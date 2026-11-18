import {
  ClinicalCase,
  ComplementaryStudy,
  EvaluationResult,
  SavedCaseRecord,
} from '../types/clinical';
import {
  ExamDifficultyTier,
  ExamDomainPerformance,
  ExamOption,
  ExamQuestionCategory,
  ExamSafetyErrorItem,
  ExamStationQuestionReview,
  ProgressiveExamConfig,
  ProgressiveExamEvaluation,
  ProgressiveExamQuestion,
  ProgressiveExamStation,
  ProgressiveExamStationDebriefing,
} from '../types/exam';
import { CERTAINTY_TIER_META, EvidenceCertaintyTier } from '../types/knowledge';
import { getLocalCaseLibrary } from './caseGenerator';
import { enrichCaseWithHospitalCatalog } from '../utils/studiesCatalog';
import { enrichCaseWithUniversalPhysicalExam } from '../utils/physicalExamCatalog';
import {
  buildDeepPathophysiologyMatrix,
  buildDifferentialReasoningMatrix,
  selectValidatedClinicalScales,
} from '../utils/pathophysiologyEngine';
import {
  PHARMACOLOGY_MONOGRAPHS,
  getEffectivePatientWeightKg,
} from '../utils/pharmacologyEngine';
import {
  detectPregnancyContext,
  detectRenalImpairmentContext,
  evaluateVitalsWithAgeContext,
} from '../utils/clinicalContext';
import {
  CURATED_KNOWLEDGE_RECORDS,
  KNOWLEDGE_BASE_DATE,
  KNOWLEDGE_BASE_VERSION,
} from '../knowledge/clinicalKnowledgeBase';
import { auditCaseKnowledgeReferences } from '../knowledge/knowledgeSyncEngine';

function norm(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function deterministicShuffle<T>(items: T[], seedKey: string): T[] {
  const arr = [...items];
  let seed = hashSeed(seedKey);
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCaseComplexityRank(c: ClinicalCase): 1 | 2 | 3 {
  const triage = c.patientInfo?.triageLevel || '';
  if (
    c.mode === 'residente' ||
    triage.includes('Nivel I') ||
    c.solution.optimalTreatment.hospitalizationDecision === 'Unidad de Cuidados Intensivos (UCI)' ||
    (c.background?.pathological?.length || 0) >= 2
  ) {
    return 3;
  }
  if (
    c.mode === 'urgencias' ||
    triage.includes('Nivel II') ||
    triage.includes('Nivel III') ||
    c.solution.optimalTreatment.hospitalizationDecision === 'Quirófano / Cirugía de Urgencia'
  ) {
    return 2;
  }
  return 1;
}

function rankToDifficultyLabel(
  rank: 1 | 2 | 3
): 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización' {
  if (rank === 1) return 'Médico General';
  if (rank === 2) return 'Urgencias / Guardia';
  return 'Residencia / Especialización';
}

function getTargetRanksForExam(
  difficulty: ExamDifficultyTier,
  stationCount: 3 | 5
): Array<1 | 2 | 3> {
  if (difficulty === 'medico_general') return Array(stationCount).fill(1);
  if (difficulty === 'urgencias') return Array(stationCount).fill(2);
  if (difficulty === 'residente') return Array(stationCount).fill(3);
  if (stationCount === 3) return [1, 2, 3];
  return [1, 1, 2, 2, 3];
}

function selectExamCases(
  config: ProgressiveExamConfig,
  customCases: ClinicalCase[],
  recentCaseIds: string[]
): Array<{ caseData: ClinicalCase; tierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización' }> {
  const library = getLocalCaseLibrary(customCases);
  const specPool =
    config.specialty === 'aleatorio'
      ? library
      : library.filter((c) => c.specialty === config.specialty);
  const primaryPool = specPool.length >= config.stationCount ? specPool : [...specPool, ...library];

  const recentSet = new Set(recentCaseIds.slice(-30));
  const usedIds = new Set<string>();
  const usedDiags = new Set<string>();
  const ranks = getTargetRanksForExam(config.difficulty, config.stationCount);

  const selected: Array<{
    caseData: ClinicalCase;
    tierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización';
  }> = [];

  for (let i = 0; i < ranks.length; i++) {
    const targetRank = ranks[i];
    const candidates = primaryPool.filter((c) => {
      if (usedIds.has(c.id)) return false;
      if (usedDiags.has(norm(c.solution.correctDiagnosis))) return false;
      return true;
    });

    const exactRank = candidates.filter((c) => getCaseComplexityRank(c) === targetRank);
    const rankedPool = exactRank.length > 0 ? exactRank : candidates;

    const unseen = rankedPool.filter((c) => !recentSet.has(c.id));
    const finalCandidates = unseen.length > 0 ? unseen : rankedPool;

    const picked =
      finalCandidates[Math.floor(Math.random() * Math.min(finalCandidates.length, 6))] ||
      library[i % library.length];

    usedIds.add(picked.id);
    usedDiags.add(norm(picked.solution.correctDiagnosis));

    const enriched = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog({ ...picked }));
    selected.push({
      caseData: enriched,
      tierLabel: rankToDifficultyLabel(targetRank),
    });
  }

  return selected;
}

function buildStep1DiagnosticQuestion(
  caseData: ClinicalCase,
  stationIndex: number,
  tierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización'
): ProgressiveExamQuestion {
  const { patientInfo, vitalSigns, solution } = caseData;
  const age = patientInfo.age;
  const preg = detectPregnancyContext(caseData);
  const vFlags = evaluateVitalsWithAgeContext(vitalSigns, age, preg.isViablePregnancy);

  const differentials = (solution.differentialDiagnoses || []).filter(
    (d) => norm(d) !== norm(solution.correctDiagnosis)
  );
  const rulingOut = solution.criticalRulingOutFactors || [];

  const isCriticalCase =
    patientInfo.triageLevel.includes('Nivel I') ||
    patientInfo.triageLevel.includes('Nivel II') ||
    solution.optimalTreatment.hospitalizationDecision === 'Unidad de Cuidados Intensivos (UCI)' ||
    solution.optimalTreatment.hospitalizationDecision === 'Quirófano / Cirugía de Urgencia';

  const correctOpt: ExamOption = {
    id: 'opt-correct',
    label: solution.correctDiagnosis,
    rationaleIfSelected: `Correcto. Integra los hallazgos clave del cuadro (${(solution.keyClinicalClues || []).slice(0, 2).join('; ') || patientInfo.consultReason}).`,
  };

  const distractorPool: ExamOption[] = [];

  for (let i = 0; i < Math.min(2, differentials.length); i++) {
    const diffName = differentials[i];
    const rule =
      rulingOut[i] ||
      `Aunque comparte motivo de consulta inicial, el perfil temporal y los signos de este paciente (${vitalSigns.bloodPressure}, FC ${vitalSigns.heartRate} lpm, T ${vitalSigns.temperature} °C) orientan hacia otro mecanismo primario.`;
    distractorPool.push({
      id: `opt-diff-${i}`,
      label: diffName,
      rationaleIfSelected: `Distractor diagnóstico plausible: ${diffName}. ${rule}`,
    });
  }

  if (isCriticalCase) {
    distractorPool.push({
      id: 'opt-benign-trap',
      label:
        differentials[2] ||
        'Cuadro autolimitado benigno apto para manejo sintomático domiciliario sin estudios adicionales',
      rationaleIfSelected:
        'Error crítico de razonamiento: subestima signos de alarma o compromiso agudo que exige diagnóstico prioritario y vigilancia/estabilización hospitalaria.',
      isSafetyError: true,
      safetyRiskNote:
        'Omitir un diagnóstico potencialmente letal o egresar a un paciente con criterios de riesgo vital eleva la mortalidad evitable.',
    });
  } else {
    distractorPool.push({
      id: 'opt-alt-3',
      label:
        differentials[2] ||
        'Trastorno funcional inespecífico sin necesidad de correlato semiológico ni diagnóstico diferencial',
      rationaleIfSelected:
        'Descarta prematuramente una patología orgánica definida que explica la anamnesis y la exploración del paciente.',
    });
  }

  const options = deterministicShuffle(
    [correctOpt, ...distractorPool.slice(0, 3)],
    `${caseData.id}-step1`
  );

  const vitalClue = vFlags.isHypotensive
    ? 'compromiso hemodinámico inicial'
    : vFlags.isHypoxemic
      ? 'desaturación arterial'
      : vFlags.isFebrile
        ? 'respuesta febril'
        : 'constantes iniciales';

  const questionPrompt = `Paciente de ${age} ${age === 1 ? 'año' : 'años'} (${patientInfo.sex}) que consulta por "${patientInfo.consultReason}" (${patientInfo.evolutionTime}) con ${vitalClue}. Con base en la anamnesis inicial y factores de riesgo, ¿cuál es la hipótesis diagnóstica principal de mayor probabilidad y prioridad clínica?`;

  return {
    id: `${caseData.id}-q1`,
    stationIndex,
    stepNumber: 1,
    stepLabel: 'Paso 1 · Razonamiento Inicial y Diagnóstico Diferencial',
    category: 'caso_progresivo',
    difficultyTierLabel: tierLabel,
    vitalSnapshot: vitalSigns,
    questionPrompt,
    options,
    correctOptionId: 'opt-correct',
    teachingExplanation: `${solution.correctDiagnosis} explica de forma integral la historia actual (${patientInfo.currentIllness.slice(0, 180)}...). Claves: ${(solution.keyClinicalClues || []).slice(0, 3).join(' · ')}.`,
    expectedConduct: `Priorizar la confirmación dirigida de ${solution.correctDiagnosis} y descartar activamente ${differentials.slice(0, 2).join(' y ') || 'los diagnósticos de riesgo vital'}.`,
    referenceSource:
      caseData.clinicalMetadata?.evidenceSources?.[0] ||
      solution.guidelineReferences?.[0] ||
      'Guías clínicas internacionales vigentes',
    certaintyTier: caseData.clinicalMetadata?.certaintyTier || 'guia_clinica',
  };
}

function pickKeyDiagnosticStudy(caseData: ClinicalCase): ComplementaryStudy | null {
  const pool = caseData.studiesPool || [];
  const nativeAbnormal = pool.find((s) => !s.id.startsWith('hosp-') && s.isAbnormal);
  if (nativeAbnormal) return nativeAbnormal;
  const anyAbnormal = pool.find((s) => s.isAbnormal);
  if (anyAbnormal) return anyAbnormal;
  const nativeAny = pool.find((s) => !s.id.startsWith('hosp-'));
  if (nativeAny) return nativeAny;
  return pool[0] || null;
}

function buildStep2StudyQuestion(
  caseData: ClinicalCase,
  stationIndex: number,
  tierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización',
  matrix: ReturnType<typeof buildDeepPathophysiologyMatrix>
): ProgressiveExamQuestion {
  const study = pickKeyDiagnosticStudy(caseData);
  const abnormalExam = (caseData.physicalExamPool || []).find((pe) => pe.isAbnormal) ||
    caseData.physicalExamPool?.[0];
  const diffs = caseData.solution.differentialDiagnoses || [];

  const studyName = study?.name || 'Evaluación paraclínica inicial';
  const studyResult = study?.result || 'Sin alteraciones estructurales mayores reportadas en tamizaje inicial';
  const studyRange = study?.referenceRange;
  const matchedCorr = matrix.labAndImagingCorrelations.find((c) =>
    norm(c.studyName) === norm(studyName)
  );

  // Build non-spoiling interpretation text for the correct option
  const rawInterpretation =
    study?.interpretation ||
    matchedCorr?.physiologicalExplanation ||
    'Hallazgo concordante con el proceso fisiopatológico activo y criterio de severidad del caso.';

  const correctOpt: ExamOption = {
    id: 'opt-correct',
    label: rawInterpretation,
    rationaleIfSelected: `Interpretación correcta de ${studyName}: ${rawInterpretation}`,
  };

  const subcat = study?.subcategory || 'Bioquímica';
  const d1 = diffs[0] || 'una patología funcional benigna';
  const d2 = diffs[1] || 'un artefacto preanalítico';

  let distA = `Hallazgo incidental o variante fisiológica normal sin correlación con el cuadro clínico actual.`;
  let distB = `Resultado específico que confirma ${d1} y permite descartar compromiso orgánico o sistémico agudo.`;
  let distC = `Alteración atribuible únicamente a ${d2}, sin necesidad de ajuste terapéutico ni vigilancia adicional.`;

  if (subcat === 'Electrocardiograma' || subcat === 'Cardiovascular') {
    distA = 'Variante normal de repolarización temprana benigna; no requiere seriación enzimática ni estratificación aguda.';
    distB = `Cambio electrocardiográfico secundario exclusivamente a ansiedad o desequilibrio postural, compatible con ${d1}.`;
    distC = 'Artefacto de línea base o sobrecarga crónica sin relevancia para la toma de decisiones en urgencias.';
  } else if (subcat === 'Hematología' || subcat === 'Inflamación e Infección') {
    distA = 'Respuesta reactiva inespecífica compatible con proceso viral autolimitado sin indicación de seguimiento estrecho.';
    distB = `Error de toma de muestra o pseudotrombocitopenia por EDTA; descartar correlación clínica con ${d1}.`;
    distC = 'Hallazgo esperado crónico que contraindica solicitar estudios confirmatorios o reevaluación clínica.';
  } else if (subcat === 'Gases' || subcat === 'Electrolitos' || subcat === 'Bioquímica') {
    distA = 'Trastorno ácido-base o metabólico compensado que no requiere corrección hidroelectrolítica ni monitoreo seriado.';
    distB = `Alteración compatible con alcalosis respiratoria primaria por dolor/ansiedad asociada a ${d1}.`;
    distC = 'Valor limítrofe sin impacto fisiopatológico sobre la perfusión tisular ni la conducción cardíaca.';
  } else if (subcat === 'Radiología' || subcat === 'Ecografía' || subcat === 'Tomografía') {
    distA = 'Estudio sin hallazgos agudos significativos; los cambios descritos son crónicos e incidentales.';
    distB = `Imagen característica que confirma ${d1} como diagnóstico definitivo único sin requerir correlación clínica.`;
    distC = 'Hallazgo técnico subóptimo que obliga a diferir cualquier conducta médica hasta repetir el estudio en consulta externa.';
  }

  const options = deterministicShuffle(
    [
      correctOpt,
      {
        id: 'opt-dist-a',
        label: distA,
        rationaleIfSelected:
          'Subestima un resultado paraclínico objetivo del caso, lo cual retrasa la estratificación de riesgo y la conducta oportuna.',
        isSafetyError: Boolean(study?.isAbnormal && caseData.patientInfo.triageLevel.match(/Nivel (I|II)\b/i)),
        safetyRiskNote:
          study?.isAbnormal
            ? 'Descartar como normal o incidental un hallazgo paraclínico alterado en un paciente agudo compromete la seguridad clínica.'
            : undefined,
      },
      {
        id: 'opt-dist-b',
        label: distB,
        rationaleIfSelected: `Confunde el patrón paraclínico real con el esperado para ${d1} sin integrar la semiología completa.`,
      },
      {
        id: 'opt-dist-c',
        label: distC,
        rationaleIfSelected:
          'Atribuye el resultado a un artefacto o hallazgo menor sin sustento semiológico ni correlación con los signos vitales.',
      },
    ],
    `${caseData.id}-step2`
  );

  return {
    id: `${caseData.id}-q2`,
    stationIndex,
    stepNumber: 2,
    stepLabel: 'Paso 2 · Exploración Física e Interpretación de Estudios',
    category: 'laboratorios_estudios',
    difficultyTierLabel: tierLabel,
    stageRevealNote:
      'Se incorpora el hallazgo objetivo de exploración física y el primer reporte paraclínico solicitado en el caso.',
    examFindingHighlight: abnormalExam ? `${abnormalExam.name}: ${abnormalExam.finding}` : undefined,
    studySnippet: {
      name: studyName,
      result: studyResult,
      referenceRange: studyRange,
    },
    questionPrompt: `Al correlacionar la exploración física con el resultado de "${studyName}", ¿cuál es la interpretación clínica más rigurosa para guiar el manejo?`,
    options,
    correctOptionId: 'opt-correct',
    teachingExplanation: `El resultado (${studyResult}) demuestra: ${rawInterpretation}${matchedCorr ? ` Mecanismo asociado: ${matchedCorr.physiologicalExplanation}` : ''}`,
    expectedConduct: `Integrar ${studyName} con el cuadro semiológico completo antes de definir terapia definitiva.`,
    referenceSource:
      caseData.clinicalMetadata?.evidenceSources?.[0] ||
      caseData.solution.guidelineReferences?.[0] ||
      'Estándar diagnóstico clínico y paraclínico',
    certaintyTier: 'evidencia_establecida',
  };
}

function buildStep3PathophysiologyQuestion(
  caseData: ClinicalCase,
  stationIndex: number,
  tierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización',
  matrix: ReturnType<typeof buildDeepPathophysiologyMatrix>
): ProgressiveExamQuestion {
  const diagNorm = norm(caseData.solution.correctDiagnosis);
  const symCorr = matrix.symptomCorrelations[0];

  const correctMechanism = symCorr
    ? `${symCorr.causalMechanism} (${matrix.cellularAndMolecular.split('.')[0]}.)`
    : `${matrix.cellularAndMolecular.split('.')[0]}. ${matrix.hemodynamicAndMetabolic.split('.')[0]}.`;

  const competingMechanisms: Array<{ id: string; text: string; rationale: string }> = [
    {
      id: 'mech-cardio',
      text: 'Rotura de placa ateromatosa coronaria con pérdida aguda de ATP miocárdico, disfunción diastólica del VI y congestión venocapilar pulmonar retrógrada.',
      rationale:
        'Describe la cascada de la isquemia miocárdica aguda, no el mecanismo causal primario del cuadro de este paciente.',
    },
    {
      id: 'mech-dka',
      text: 'Déficit absoluto de insulina con lipólisis descontrolada hacia cuerpos cetónicos, diuresis osmótica y desplazamiento extracelular de K⁺ por acidosis metabólica.',
      rationale:
        'Corresponde a la fisiopatología de la cetoacidosis diabética, distinta al proceso biológico de este caso.',
    },
    {
      id: 'mech-vasoplejia',
      text: 'Activación endotelial sistémica por citocinas/iNOS o degranulación mastocitaria con lesión del glucocálix, fuga capilar intersticial y caída de resistencias vasculares.',
      rationale:
        'Mecanismo característico de choque distributivo/sepsis o extravasación endotelial aguda.',
    },
    {
      id: 'mech-broncho',
      text: 'Broncoconstricción mediada por leucotrienos e histamina con incremento exponencial de resistencia de vía aérea (R ∝ 1/r⁴), atrapamiento aéreo y desequilibrio V/Q.',
      rationale:
        'Describe obstrucción bronquial aguda y atrapamiento aéreo, mecanismo ajeno a la lesión principal evaluada aquí.',
    },
    {
      id: 'mech-neuro',
      text: 'Excitotoxicidad neuronal por glutamato/Ca²⁺ en zona de penumbra o pérdida de autorregulación con compromiso directo de presión de perfusión cerebral.',
      rationale:
        'Mecanismo neurovascular agudo que no explica el eje fisiopatológico primario de este cuadro.',
    },
  ];

  // Pick 3 distractors that do NOT overlap with the case's true domain
  const filteredDistractors = competingMechanisms.filter((m) => {
    if (m.id === 'mech-cardio' && /\b(infarto|angina|coronari|iamcest|iamsest|insuficiencia cardiaca)\b/.test(diagNorm)) {
      return false;
    }
    if (m.id === 'mech-dka' && /\b(cetoacidosis|cad|hiperglucem|diabetes)\b/.test(diagNorm)) {
      return false;
    }
    if (m.id === 'mech-vasoplejia' && /\b(sepsis|choque|shock|dengue|anafilax|meningitis)\b/.test(diagNorm)) {
      return false;
    }
    if (m.id === 'mech-broncho' && /\b(asma|epoc|bronquiolitis|neumonia|crup|tromboembol)\b/.test(diagNorm)) {
      return false;
    }
    if (m.id === 'mech-neuro' && /\b(ictus|acv|epilep|convuls|mening|migrana)\b/.test(diagNorm)) {
      return false;
    }
    return true;
  });

  const options = deterministicShuffle(
    [
      {
        id: 'opt-correct',
        label: correctMechanism,
        rationaleIfSelected:
          'Explica con precisión el mecanismo celular/molecular y su traducción hemodinámica o clínica directa en este paciente.',
      },
      ...filteredDistractors.slice(0, 3).map((d) => ({
        id: d.id,
        label: d.text,
        rationaleIfSelected: d.rationale,
      })),
    ],
    `${caseData.id}-step3`
  );

  const featurePrompt = symCorr
    ? `la aparición de ${symCorr.clinicalFeature}`
    : `las manifestaciones clínicas y alteraciones de signos vitales observadas (PA ${caseData.vitalSigns.bloodPressure}, FC ${caseData.vitalSigns.heartRate} lpm, FR ${caseData.vitalSigns.respiratoryRate} rpm)`;

  return {
    id: `${caseData.id}-q3`,
    stationIndex,
    stepNumber: 3,
    stepLabel: 'Paso 3 · Fisiopatología Causal y Mecanismo de Enfermedad',
    category: 'fisiopatologia',
    difficultyTierLabel: tierLabel,
    stageRevealNote:
      'Correlación fisiopatológica: analiza por qué la alteración molecular o anatómica genera los signos observados antes de decidir el fármaco.',
    questionPrompt: `Desde el punto de vista fisiopatológico, ¿qué secuencia celular y hemodinámica explica directamente ${featurePrompt} en este paciente?`,
    options,
    correctOptionId: 'opt-correct',
    teachingExplanation: `${caseData.solution.pathophysiology} En concreto: ${matrix.anatomicalAndFunctional} Además, ${matrix.hemodynamicAndMetabolic}`,
    expectedConduct:
      'Dirigir la terapéutica a revertir el mecanismo causal primario y proteger la perfusión y oxigenación tisular.',
    referenceSource:
      caseData.clinicalMetadata?.evidenceSources?.[0] ||
      'Fisiopatología médica basada en evidencia',
    certaintyTier: 'evidencia_establecida',
  };
}

function buildStep4PharmacologyQuestion(
  caseData: ClinicalCase,
  stationIndex: number,
  tierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización'
): ProgressiveExamQuestion {
  const { patientInfo, background, solution } = caseData;
  const age = patientInfo.age;
  const isPed = age < 15;
  const { weightKg, isEstimated } = getEffectivePatientWeightKg(caseData);
  const preg = detectPregnancyContext(caseData);
  const renal = detectRenalImpairmentContext(caseData);
  const diagNorm = norm(solution.correctDiagnosis);
  const allergyText = norm((background.allergies || []).join(' '));
  const hasPenicillinAllergy = /\b(penicilina|amoxicilina|ampicilina|betalactam)\b/.test(allergyText);

  const primaryRx = solution.optimalTreatment.pharmacological[0];
  const disposition = solution.optimalTreatment.hospitalizationDecision;

  const monograph = primaryRx
    ? PHARMACOLOGY_MONOGRAPHS.find((m) => m.matchPattern.test(norm(primaryRx.drug)))
    : undefined;

  const weightContext = isPed
    ? ` (peso ${weightKg} kg${isEstimated ? ' est.' : ''}, verificando cálculo mg/kg y dosis máxima)`
    : '';
  const specialContextNotes: string[] = [];
  if (isPed) specialContextNotes.push(`Pediatría: ${age} años, peso ${weightKg} kg`);
  if (preg.isViablePregnancy) specialContextNotes.push('Gestación activa confirmada');
  if (renal.hasRenalImpairment) specialContextNotes.push('Compromiso renal documentado');
  if ((background.allergies || []).length > 0) {
    specialContextNotes.push(`Alergias: ${background.allergies.join(', ')}`);
  } else {
    specialContextNotes.push('Sin alergias farmacológicas reportadas');
  }

  const optimalLabel = primaryRx
    ? `${primaryRx.drug} (${primaryRx.dose}, ${primaryRx.route}, ${primaryRx.frequency})${weightContext} + ${disposition}`
    : `${solution.optimalTreatment.generalMeasures[0] || 'Medidas de soporte dirigidas'} + ${disposition}`;

  const correctOpt: ExamOption = {
    id: 'opt-correct',
    label: optimalLabel,
    rationaleIfSelected: primaryRx
      ? `Conducta farmacológica óptima: ${primaryRx.rationale}. Destino clínico idóneo: ${disposition}.`
      : `Manejo racional correcto sin exposición farmacológica innecesaria. Destino: ${disposition}.`,
  };

  // Build 3 clinically plausible, non-trivial pharmacological traps specific to this patient
  const traps: ExamOption[] = [];

  if (/\bdengue\b/.test(diagNorm)) {
    traps.push({
      id: 'trap-dengue-nsaid',
      label: 'Ibuprofeno 400–600 mg VO cada 8 horas + ácido acetilsalicílico para control de fiebre y mialgias',
      rationaleIfSelected:
        'Contraindicación absoluta en dengue: los AINEs y salicilatos inhiben la agregación plaquetaria y dañan la mucosa gástrica, precipitando hemorragia grave.',
      isSafetyError: true,
      safetyRiskNote:
        'Prescribir AINEs o AAS en sospecha de dengue induce riesgo elevado de hemorragia digestiva y descompensación hemodinámica.',
    });
  }

  if (/\b(cetoacidosis|\bcad\b)\b/.test(diagNorm)) {
    traps.push({
      id: 'trap-dka-k',
      label: 'Iniciar inmediatamente bolo e infusión de insulina regular IV sin comprobar ni corregir previamente el potasio sérico',
      rationaleIfSelected:
        'Error crítico de seguridad en CAD: la insulina desplaza K⁺ al espacio intracelular y puede precipitar hipokalemia severa y arritmias ventriculares letales si K⁺ < 3.3 mEq/L.',
      isSafetyError: true,
      safetyRiskNote:
        'Administrar insulina IV sin verificar K⁺ sérico en cetoacidosis diabética puede causar paro cardíaco por hipokalemia aguda.',
    });
  }

  if (/\bpielonefritis\b/.test(diagNorm)) {
    traps.push({
      id: 'trap-nitro-pyelo',
      label: 'Nitrofurantoína 100 mg VO cada 12 horas por 5 días y egreso domiciliario inmediato',
      rationaleIfSelected:
        'Error terapéutico clásico: la nitrofurantoína alcanza concentración solo en orina vesical y NO penetra parénquima renal ni circulación sistémica.',
      isSafetyError: true,
      safetyRiskNote:
        'Tratar pielonefritis con nitrofurantoína favorece progresión a bacteriemia, absceso renal o urosepsis.',
    });
  }

  if (/\banafilax\b/.test(diagNorm)) {
    traps.push({
      id: 'trap-anafilax',
      label: 'Difenhidramina IV + hidrocortisona IV como manejo inicial exclusivo observando respuesta antes de usar adrenalina',
      rationaleIfSelected:
        'Retraso peligroso: antihistamínicos y corticoides NO revierten el broncoespasmo ni la vasoplejía aguda; la adrenalina IM es el único fármaco de primera línea.',
      isSafetyError: true,
      safetyRiskNote:
        'Omitir adrenalina IM inmediata en anafilaxia permite obstrucción laríngea y choque refractario.',
    });
  }

  if (preg.isViablePregnancy) {
    traps.push({
      id: 'trap-preg',
      label: 'Ketorolaco IV / Ibuprofeno a dosis plena + IECA para optimización sintomática y tensional',
      rationaleIfSelected:
        'Iatrogenia gestacional: los IECA/ARA-II son teratogénicos (fetopatía renal) en todo el embarazo y los AINEs causan cierre del conducto arterioso fetal y oligohidramnios.',
      isSafetyError: true,
      safetyRiskNote:
        'Exposición fetal a AINEs tardíos o IECA/ARA-II conlleva toxicidad renal fetal y cierre ductal prematuro.',
    });
  }

  if (isPed) {
    traps.push({
      id: 'trap-ped-dose',
      label:
        'Administrar dosis estándar fija de adulto sin ajuste por peso (mg/kg) ni verificación de dosis máxima pediátrica y añadir ácido acetilsalicílico si persiste fiebre',
      rationaleIfSelected:
        'Doble error pediátrico: sobredosificación tóxica por omitir cálculo mg/kg y riesgo de síndrome de Reye asociado a AAS en menores de 16 años.',
      isSafetyError: true,
      safetyRiskNote:
        'Omitir el cálculo pediátrico por peso (mg/kg/dosis) y prescribir AAS en pediatría genera toxicidad medicamentosa grave y síndrome de Reye.',
    });
  }

  if (renal.hasRenalImpairment) {
    traps.push({
      id: 'trap-renal-nsaid',
      label: 'AINE sistémico a dosis plena (diclofenaco o ketorolaco) más aminoglucósido sin ajuste a tasa de filtrado glomerular',
      rationaleIfSelected:
        'Doble nefrotoxicidad: vasoconstricción aferente por bloqueo de prostaglandinas renales + toxicidad tubular acumulativa.',
      isSafetyError: true,
      safetyRiskNote:
        'Combinar AINEs o nefrotóxicos sin ajuste renal precipita lesión renal aguda oligúrica e hiperkalemia.',
    });
  }

  if (hasPenicillinAllergy) {
    traps.push({
      id: 'trap-allergy',
      label: 'Amoxicilina/ácido clavulánico o ampicilina IV de primera intención pese al antecedente documentado de alergia',
      rationaleIfSelected:
        'Riesgo de anafilaxia iatrogénica al ignorar la alergia a betalactámicos registrada en los antecedentes del paciente.',
      isSafetyError: true,
      safetyRiskNote:
        'Administrar betalactámicos en paciente con alergia documentada puede desencadenar choque anafiláctico.',
    });
  }

  // Ensure we always have 3 rich, distinct traps
  if (traps.length < 3) {
    traps.push({
      id: 'trap-disposition',
      label:
        disposition === 'Ambulatorio'
          ? 'Indicar doble antibiótico parenteral de amplio espectro + corticoides sistémicos sin evidencia bacteriana ni criterios de gravedad'
          : `${primaryRx?.drug || 'Analgesia sintomática aislada'} a dosis subterapéutica y egreso inmediato a domicilio con revaloración en 1 semana`,
      rationaleIfSelected:
        disposition === 'Ambulatorio'
          ? 'Sobretratamiento iatrogénico: expone al paciente a efectos adversos y resistencia antimicrobiana sin beneficio clínico.'
          : `Error grave de seguridad y posología: un cuadro que amerita "${disposition}" requiere tratamiento completo oportuno y vigilancia hospitalaria.`,
      isSafetyError: disposition !== 'Ambulatorio',
      safetyRiskNote:
        disposition !== 'Ambulatorio'
          ? `Egresar sin estabilización o con dosis subterapéutica cuando se indica "${disposition}" expone a descompensación fuera del hospital.`
          : undefined,
    });
  }

  if (traps.length < 3) {
    traps.push({
      id: 'trap-route-timing',
      label: primaryRx
        ? `${primaryRx.drug} vía oral en dosis única aislada esperando evolución ambulatoria antes de definir seguimiento o monitorización`
        : 'Diferir toda medida de soporte y monitoreo hasta completar estudios ambulatorios electivos la próxima semana',
      rationaleIfSelected:
        'Vía, duración o temporalidad inadecuada para la fase clínica actual del paciente; omite monitorización de respuesta y seguridad.',
    });
  }

  if (traps.length < 3) {
    traps.push({
      id: 'trap-monograph-alt',
      label: 'Benzodiacepina o sedación profiláctica + suspensión temporal de hidratación y vigilancia de signos vitales',
      rationaleIfSelected:
        'Enmascara el deterioro neurológico/respiratorio y puede agravar hipoventilación o hipotensión sin tratar la causa subyacente.',
      isSafetyError: true,
      safetyRiskNote:
        'Sedar o suspender vigilancia básica antes de controlar la causa primaria enmascara hipoxia y deterioro neurológico.',
    });
  }

  const options = deterministicShuffle(
    [correctOpt, ...traps.slice(0, 3)],
    `${caseData.id}-step4`
  );

  const safetyRule = solution.criticalSafetyAlerts?.[0] || monograph?.monitoringPlan || '';

  return {
    id: `${caseData.id}-q4`,
    stationIndex,
    stepNumber: 4,
    stepLabel: 'Paso 4 · Farmacología, Posología y Seguridad Terapéutica',
    category: 'farmacologia_terapeutica',
    difficultyTierLabel: tierLabel,
    stageRevealNote:
      'Decisión terapéutica definitiva: verifica indicación, dosis, vía, ajustes por edad/peso/función orgánica y alertas de seguridad.',
    pharmacologyContextNote: specialContextNotes.join(' · '),
    questionPrompt: `Considerando el perfil completo del paciente (${specialContextNotes.join('; ')}), ¿qué esquema terapéutico y destino asistencial es farmacológicamente correcto y seguro?`,
    options,
    correctOptionId: 'opt-correct',
    teachingExplanation: `${optimalLabel}.${monograph ? ` Grupo: ${monograph.pharmacologicalGroup}. Mecanismo: ${monograph.mechanismOfAction} Monitorización: ${monograph.monitoringPlan}` : ''}${safetyRule ? ` Seguridad: ${safetyRule}` : ''}`,
    expectedConduct: `Prescribir ${optimalLabel} verificando alergias, función renal/hepática y signos de alarma.`,
    referenceSource:
      caseData.clinicalMetadata?.evidenceSources?.[0] ||
      solution.guidelineReferences?.[0] ||
      'Formularios farmacológicos oficiales (OMS / FDA / EMA / MINSA)',
    certaintyTier: caseData.clinicalMetadata?.certaintyTier || 'guia_clinica',
  };
}

export function buildProgressiveExamSession(
  config: ProgressiveExamConfig,
  customCases: ClinicalCase[] = [],
  recentCaseIds: string[] = []
): ProgressiveExamStation[] {
  const pickedCases = selectExamCases(config, customCases, recentCaseIds);

  return pickedCases.map(({ caseData, tierLabel }, idx) => {
    const stationIndex = idx + 1;
    const matrix = buildDeepPathophysiologyMatrix(caseData);
    const baseVignette = `Paciente de ${caseData.patientInfo.age} ${caseData.patientInfo.age === 1 ? 'año' : 'años'} (${caseData.patientInfo.sex}), ${caseData.patientInfo.occupation || 'consulta habitual'}. Motivo de consulta: ${caseData.patientInfo.consultReason} (${caseData.patientInfo.evolutionTime}). Historia actual: ${caseData.patientInfo.currentIllness}`;

    const questions: ProgressiveExamQuestion[] = [
      buildStep1DiagnosticQuestion(caseData, stationIndex, tierLabel),
      buildStep2StudyQuestion(caseData, stationIndex, tierLabel, matrix),
      buildStep3PathophysiologyQuestion(caseData, stationIndex, tierLabel, matrix),
      buildStep4PharmacologyQuestion(caseData, stationIndex, tierLabel),
    ];

    return {
      stationIndex,
      difficultyTierLabel: tierLabel,
      caseData,
      baseVignette,
      questions,
    };
  });
}

export function evaluateProgressiveExam(
  stations: ProgressiveExamStation[],
  answersByQuestionId: Record<string, string>,
  isOnline = true
): ProgressiveExamEvaluation {
  let totalCorrect = 0;
  let totalQuestions = 0;
  const safetyErrorsDetected: ExamSafetyErrorItem[] = [];

  const categoryTotals: Record<
    ExamQuestionCategory,
    { label: string; correct: number; total: number }
  > = {
    caso_progresivo: {
      label: 'Casos Progresivos y Diagnóstico',
      correct: 0,
      total: 0,
    },
    laboratorios_estudios: {
      label: 'Interpretación de Estudios y Labs',
      correct: 0,
      total: 0,
    },
    fisiopatologia: {
      label: 'Fisiopatología Causal',
      correct: 0,
      total: 0,
    },
    farmacologia_terapeutica: {
      label: 'Farmacología y Seguridad',
      correct: 0,
      total: 0,
    },
  };

  const stationDebriefings: ProgressiveExamStationDebriefing[] = stations.map((station) => {
    const { caseData } = station;
    const pathoMatrix = buildDeepPathophysiologyMatrix(caseData);
    const diffMatrix = buildDifferentialReasoningMatrix(caseData);
    const validatedScales = selectValidatedClinicalScales(caseData);
    const knowledgeAudit = auditCaseKnowledgeReferences(
      caseData,
      CURATED_KNOWLEDGE_RECORDS,
      null,
      isOnline
    );

    const questionReviews: ExamStationQuestionReview[] = station.questions.map((q) => {
      totalQuestions += 1;
      categoryTotals[q.category].total += 1;

      const selectedId = answersByQuestionId[q.id] || '';
      const selectedOpt = q.options.find((o) => o.id === selectedId);
      const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
      const isCorrect = selectedId === q.correctOptionId;
      const isSafetyError = Boolean(selectedOpt?.isSafetyError && !isCorrect);

      if (isCorrect) {
        totalCorrect += 1;
        categoryTotals[q.category].correct += 1;
      }

      if (isSafetyError && selectedOpt) {
        safetyErrorsDetected.push({
          stationIndex: station.stationIndex,
          patientName: caseData.patientInfo.name,
          questionStep: q.stepLabel,
          chosenOption: selectedOpt.label,
          riskNote:
            selectedOpt.safetyRiskNote ||
            selectedOpt.rationaleIfSelected ||
            'Conducta con riesgo de iatrogenia o deterioro clínico grave.',
        });
      }

      return {
        question: q,
        selectedOptionId: selectedId,
        selectedOptionLabel: selectedOpt?.label || 'Sin respuesta seleccionada',
        correctOptionLabel: correctOpt?.label || '',
        isCorrect,
        isSafetyError,
        selectedRationale:
          selectedOpt?.rationaleIfSelected || 'No se seleccionó ninguna opción en este paso.',
        safetyRiskNote: selectedOpt?.safetyRiskNote,
      };
    });

    const stationCorrect = questionReviews.filter((r) => r.isCorrect).length;
    const stationSafetyErrs = questionReviews.filter((r) => r.isSafetyError).length;
    let stationScore = Math.round((stationCorrect / Math.max(1, questionReviews.length)) * 100);
    if (stationSafetyErrs > 0) {
      stationScore = Math.min(stationScore, stationSafetyErrs >= 2 ? 40 : 55);
    }

    const userErrors: string[] = [];
    const errorRisksAndConsequences: string[] = [];

    for (const rev of questionReviews) {
      if (!rev.isCorrect) {
        userErrors.push(
          `${rev.question.stepLabel}: elegiste "${rev.selectedOptionLabel}" en lugar de "${rev.correctOptionLabel}".`
        );
        errorRisksAndConsequences.push(
          rev.safetyRiskNote
            ? `Riesgo crítico (${rev.question.stepLabel}): ${rev.safetyRiskNote}`
            : `Consecuencia clínica (${rev.question.stepLabel}): ${rev.selectedRationale}`
        );
      }
    }

    if (userErrors.length === 0) {
      userErrors.push('Sin errores en esta estación: respondiste correctamente los 4 pasos clínicos.');
      errorRisksAndConsequences.push(
        'No se identificaron conductas iatrogénicas ni omisiones diagnósticas en esta estación.'
      );
    }

    const pharmJustifications = caseData.solution.optimalTreatment.pharmacological.map((rx) => {
      const mono = PHARMACOLOGY_MONOGRAPHS.find((m) => m.matchPattern.test(norm(rx.drug)));
      return mono
        ? `${rx.drug} (${mono.pharmacologicalGroup}): ${mono.mechanismOfAction} Ajuste renal: ${mono.renalAdjustment} Monitorización: ${mono.monitoringPlan}`
        : `${rx.drug} (${rx.dose}, ${rx.route}, ${rx.frequency}): ${rx.rationale}`;
    });

    const tier: EvidenceCertaintyTier =
      caseData.clinicalMetadata?.certaintyTier || 'guia_clinica';
    const tierMeta = CERTAINTY_TIER_META[tier];

    const nativeStudies = (caseData.studiesPool || []).filter((s) => !s.id.startsWith('hosp-'));
    const otherStudies = (caseData.studiesPool || []).filter((s) => s.id.startsWith('hosp-'));
    const prioritizedPool = [...nativeStudies, ...otherStudies];
    const keyStudies = prioritizedPool
      .filter((s) => s.isAbnormal)
      .slice(0, 4)
      .concat(prioritizedPool.filter((s) => !s.isAbnormal).slice(0, 2));

    const optimalFirstRx = caseData.solution.optimalTreatment.pharmacological[0];
    const expectedConduct = `Confirmar ${caseData.solution.correctDiagnosis} mediante semiología dirigida y estudios clave (${(caseData.solution.recommendedWorkup || []).slice(0, 3).join(', ') || 'paraclínicos del caso'}), instaurar ${optimalFirstRx ? `${optimalFirstRx.drug} (${optimalFirstRx.dose}, ${optimalFirstRx.route}, ${optimalFirstRx.frequency})` : 'medidas de soporte indicadas'} y definir destino "${caseData.solution.optimalTreatment.hospitalizationDecision}".`;

    return {
      stationIndex: station.stationIndex,
      caseData,
      difficultyTierLabel: station.difficultyTierLabel,
      stationScore,
      questionReviews,
      definitiveDiagnosis: caseData.solution.correctDiagnosis,
      clinicalReasoning: `Claves clínicas integradoras: ${(caseData.solution.keyClinicalClues || []).join(' · ')}. Factores de descarte: ${(caseData.solution.criticalRulingOutFactors || []).join(' · ')}.`,
      pathophysiologySummary: caseData.solution.pathophysiology,
      pathophysiologyMatrix: pathoMatrix,
      differentialDiagnoses: caseData.solution.differentialDiagnoses || [],
      differentialMatrix: diffMatrix,
      validatedScales,
      studiesInterpretation: keyStudies.map((s) => ({
        name: s.name,
        result: s.result,
        interpretation: s.interpretation || 'Correlacionar con la evolución clínica.',
        isAbnormal: s.isAbnormal,
      })),
      recommendedTreatment: caseData.solution.optimalTreatment.pharmacological,
      generalMeasures: caseData.solution.optimalTreatment.generalMeasures,
      hospitalizationDecision: caseData.solution.optimalTreatment.hospitalizationDecision,
      pharmacologicalJustification: pharmJustifications,
      userErrors,
      errorRisksAndConsequences,
      expectedConduct,
      clinicalPearls: [
        ...(caseData.solution.keyClinicalClues || []).slice(0, 2),
        ...(caseData.solution.criticalSafetyAlerts || []).slice(0, 2),
      ],
      bibliographicReferences:
        caseData.clinicalMetadata?.evidenceSources ||
        caseData.solution.guidelineReferences ||
        [],
      certaintyClassification: {
        tier,
        label: tierMeta.label,
        explanation: tierMeta.description,
        offlineVerificationNotice:
          knowledgeAudit.verificationNotice ||
          `Base científica local v${KNOWLEDGE_BASE_VERSION} (revisada ${KNOWLEDGE_BASE_DATE}).`,
      },
    };
  });

  const rawUncappedScore =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  let totalScore = rawUncappedScore;
  let safetyNonCompensation: ProgressiveExamEvaluation['safetyNonCompensation'] | undefined;

  if (safetyErrorsDetected.length > 0) {
    const cappedMaxScore = safetyErrorsDetected.length >= 2 ? 44 : 58;
    const penalized = Math.max(0, rawUncappedScore - safetyErrorsDetected.length * 18);
    totalScore = Math.min(cappedMaxScore, penalized);
    safetyNonCompensation = {
      applied: true,
      cappedMaxScore,
      reason: `Se detectaron ${safetyErrorsDetected.length} error(es) crítico(s) de seguridad del paciente. Por principio de no compensación clínica, el puntaje global queda limitado a ≤${cappedMaxScore}/100 sin importar los aciertos diagnósticos o teóricos.`,
    };
  }

  const classification: ProgressiveExamEvaluation['classification'] =
    totalScore >= 90
      ? 'Excelente razonamiento clínico'
      : totalScore >= 80
        ? 'Muy buen desempeño'
        : totalScore >= 70
          ? 'Buen desempeño'
          : totalScore >= 55
            ? 'Necesita reforzar conocimientos'
            : 'Necesita mejorar su abordaje clínico';

  const domainBreakdown: ExamDomainPerformance[] = (
    Object.keys(categoryTotals) as ExamQuestionCategory[]
  ).map((cat) => {
    const item = categoryTotals[cat];
    return {
      category: cat,
      label: item.label,
      correct: item.correct,
      total: item.total,
      scorePct: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
    };
  });

  return {
    totalScore,
    rawUncappedScore,
    correctCount: totalCorrect,
    totalQuestions,
    classification,
    safetyNonCompensation,
    domainBreakdown,
    safetyErrorsDetected,
    stationDebriefings,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Convierte el desempeño de cada estación del Examen Progresivo en registros compatibles con el historial IndexedDB.
 */
export function buildStationHistoryRecords(
  evaluation: ProgressiveExamEvaluation
): SavedCaseRecord[] {
  return evaluation.stationDebriefings.map((st) => {
    const qDiag = st.questionReviews[0];
    const qStud = st.questionReviews[1];
    const qPatho = st.questionReviews[2];
    const qPharm = st.questionReviews[3];

    const stationSafetyErrors = st.questionReviews
      .filter((r) => r.isSafetyError)
      .map((r) => `${r.question.stepLabel}: ${r.safetyRiskNote || r.selectedRationale}`);

    const evalResult: EvaluationResult = {
      totalScore: st.stationScore,
      breakdown: {
        anamnesis: qPatho?.isCorrect ? 15 : 6,
        physicalExam: qStud?.isCorrect ? 15 : 8,
        studiesInterpretation: qStud?.isCorrect ? 15 : 5,
        primaryDiagnosis: qDiag?.isCorrect ? 25 : 8,
        differentialDiagnoses: qDiag?.isCorrect ? 10 : 4,
        treatment: qPharm?.isCorrect ? 15 : qPharm?.isSafetyError ? 0 : 5,
        safetyAndConduct: stationSafetyErrors.length === 0 ? 5 : 0,
      },
      classification:
        st.stationScore >= 90
          ? 'Excelente razonamiento clínico'
          : st.stationScore >= 80
            ? 'Muy buen desempeño'
            : st.stationScore >= 70
              ? 'Buen desempeño'
              : 'Necesita reforzar conocimientos',
      criticalSafetyErrors: stationSafetyErrors,
      feedback: {
        diagnosisAccuracyComment: qDiag?.isCorrect
          ? `Acierto diagnóstico en Examen Progresivo (${st.difficultyTierLabel}).`
          : `Elegiste "${qDiag?.selectedOptionLabel}". Diagnóstico real: ${st.definitiveDiagnosis}.`,
        reasoningEvaluation: st.clinicalReasoning,
        differentialEvaluation: st.differentialDiagnoses.join(' · '),
        workupCritique: qStud?.isCorrect
          ? 'Interpretación correcta del estudio clave.'
          : qStud?.selectedRationale || 'Revisar correlación paraclínica.',
        treatmentCritique: qPharm?.isCorrect
          ? 'Decisión farmacológica y de seguridad correcta.'
          : qPharm?.selectedRationale || 'Revisar posología y seguridad farmacológica.',
        pedagogicalPearls: st.clinicalPearls,
        guidelinesSummary: st.bibliographicReferences.join(' · '),
      },
      pathophysiologyMatrix: st.pathophysiologyMatrix,
      differentialMatrix: st.differentialMatrix,
      validatedClinicalScales: st.validatedScales,
      safetyNonCompensation:
        stationSafetyErrors.length > 0
          ? {
              applied: true,
              rawUncappedScore: Math.round(
                (st.questionReviews.filter((r) => r.isCorrect).length / 4) * 100
              ),
              cappedMaxScore: 55,
              severity: 'grave',
              reason: stationSafetyErrors.join(' '),
            }
          : undefined,
      userSummary: {
        primaryDiagnosis: qDiag?.selectedOptionLabel || '',
        differentialDiagnoses: [],
        clinicalJustification: qPatho?.selectedOptionLabel || '',
        pharmacologicalPlan: [],
        generalMeasures: '',
        hospitalizationDecision: st.hospitalizationDecision,
        referralCriteria: '',
        followUpPlan: '',
        questionCount: 4,
        unlockedExamsNames: [],
        unlockedStudiesNames: st.studiesInterpretation.map((s) => s.name),
      },
      resolvedAt: evaluation.evaluatedAt,
    };

    return {
      id: `exam-st-${st.caseData.id}-${Date.now()}-${st.stationIndex}`,
      caseId: st.caseData.id,
      patientName: `${st.caseData.patientInfo.name} (Examen Prog.)`,
      specialty: st.caseData.specialty,
      mode: 'examen',
      userDiagnosis: qDiag?.selectedOptionLabel || 'Examen Progresivo',
      correctDiagnosis: st.definitiveDiagnosis,
      score: st.stationScore,
      date: evaluation.evaluatedAt,
      evaluation: evalResult,
    };
  });
}
