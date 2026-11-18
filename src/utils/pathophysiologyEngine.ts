import {
  ClinicalCase,
  DifferentialReasoningMatrixItem,
  PathophysiologyMatrix,
  QualitativeClinicalProbability,
  ValidatedClinicalScaleItem,
} from '../types/clinical';
import {
  computeDerivedBedsideIndices,
  detectPregnancyContext,
  evaluateVitalsWithAgeContext,
} from './clinicalContext';

function norm(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

interface PathoDomainProfile {
  pattern: RegExp;
  cellularAndMolecular: string;
  anatomicalAndFunctional: string;
  hemodynamicAndMetabolic: string;
  inflammatoryAndImmunologic: string;
}

const PATHO_PROFILES: PathoDomainProfile[] = [
  {
    pattern: /\b(infarto|iamcest|iamsest|scasest|scacest|angina|coronari|isquemia miocard)\b/,
    cellularAndMolecular:
      'La rotura o erosión de placa ateromatosa expone colágeno subendotelial y factor tisular, activando adhesión plaquetaria (GP Ib/IIb-IIIa) y cascada de coagulación hasta formar trombo oclusivo/suboclusivo. En el cardiomiocito hipóxico cesa la fosforilación oxidativa, cae el ATP, falla la bomba Na⁺/K⁺ y se acumula lactato/H⁺ intracelular con activación de fibras aferentes nociceptivas.',
    anatomicalAndFunctional:
      'La isquemia subendocárdica o transmural genera disfunción diastólica precoz seguida de acinesia/hipocinesia segmentaria del miocardio dependiente del vaso culpable y remodelado eléctrico susceptible a reentrada ventricular.',
    hemodynamicAndMetabolic:
      'La caída de la distensibilidad y contractilidad eleva la presión telediastólica del VI (congestión pulmonar retrógrada) o compromete el gasto cardíaco si la masa isquémica es extensa; la descarga simpática compensatoria eleva FC y consumo miocárdico de O₂.',
    inflammatoryAndImmunologic:
      'Liberación de DAMPs celulares y troponina tras pérdida de integridad sarcolemal, con infiltración neutrofílica temprana y liberación de IL-6/PCR.',
  },
  {
    pattern: /\b(asma|epoc|bronquiolitis|crup|laringotraqueo|neumonia|neumotorax|derrame pleural|tromboembol|tep)\b/,
    cellularAndMolecular:
      'Alteración aguda de la relación ventilación-perfusión (V/Q) o incremento crítico de la resistencia de la vía aérea (ley de Poiseuille: R ∝ 1/r⁴). En obstrucción/edema bronquial, la activación mastocitaria/epitelial libera leucotrienos, histamina e IL-4/IL-5/IL-13 con broncoconstricción e hipersecreción mucosa.',
    anatomicalAndFunctional:
      'Atrapamiento aéreo, hiperinsuflación dinámica, colapso alveolar o ocupación del espacio alveolar/pleural que reduce la superficie efectiva de hematosis a través de la membrana alvéolo-capilar.',
    hemodynamicAndMetabolic:
      'La hipoxemia estimula quimiorreceptores carotídeos aumentando el trabajo muscular ventilatorio y la frecuencia respiratoria; la vasoconstricción pulmonar hipóxica o el tromboembolismo aumentan la poscarga del ventrículo derecho.',
    inflammatoryAndImmunologic:
      'Exudado alveolar neutrofílico o inflamación eosinofílica/neutrofílica de mucosa bronquial con liberación de mediadores vasoactivos y citocinas febriles (IL-1β, TNF-α) si hay etiología infecciosa.',
  },
  {
    pattern: /\b(sepsis|choque|shock|meningitis|pielonefritis|colangitis|dengue|anafilax)\b/,
    cellularAndMolecular:
      'Activación masiva de receptores tipo Toll (TLR) por PAMPs bacterianos/virales o degranulación mediada por IgE (anafilaxia), liberando óxido nítrico inducible (iNOS), TNF-α, IL-1β, IL-6, histamina y triptasa que abren uniones endoteliales estrechas.',
    anatomicalAndFunctional:
      'Vasoplejía arteriolar/venosa y lesión del glucocálix endotelial con fuga capilar hacia el intersticio, edema tisular y microtrombosis heterogénea en lechos esplácnico, renal y cutáneo.',
    hemodynamicAndMetabolic:
      'Caída crítica de las resistencias vasculares sistémicas y del retorno venoso efectivo; la hipoperfusión celular fuerza glucólisis anaerobia con hiperlactatemia y acidosis metabólica compensada con taquipnea.',
    inflammatoryAndImmunologic:
      'Tormenta inflamatoria sistémica acompañada de disfunción inmune/endotelial; en dengue la respuesta inmune mediada por anticuerpos/citocinas produce extravasación plasmática y trombocitopenia inmune/medular.',
  },
  {
    pattern: /\b(cetoacidosis|\bcad\b|hiperglucem|hipoglucem|tiroid|tormenta tiroidea|mixedemat|suprarrenal|diabetes)\b/,
    cellularAndMolecular:
      'Déficit absoluto/relativo de insulina con exceso de hormonas contrarreguladoras (glucagón, catecolaminas, cortisol) que activa lipasa sensible a hormonas y beta-oxidación hepática descontrolada hacia β-hidroxibutirato y acetoacetato (o, en déficit extremo opuesto, neuroglucopenia neuronal o tormenta transcripcional por T3).',
    anatomicalAndFunctional:
      'Glucosuria cuando se supera el umbral de reabsorción tubular renal (~180 mg/dL), arrastrando agua y electrolitos por diuresis osmótica y reduciendo la volemia efectiva.',
    hemodynamicAndMetabolic:
      'Acidosis metabólica con brecha aniónica elevada que estimula el centro respiratorio bulbar (respiración de Kussmaul) y desplaza K⁺ del espacio intracelular al extracelular pese a depleción corporal total de potasio.',
    inflammatoryAndImmunologic:
      'Estado proinflamatorio y protrombótico inducido por hiperosmolaridad/estrés oxidativo, habitualmente gatillado por infección intercurrente o omisión terapéutica.',
  },
  {
    pattern: /\b(apendicitis|colecistitis|pancreatitis|obstruccion intestinal|ulcera|hemorragia digestiva|gastroenteritis|peritonitis|ectopico)\b/,
    cellularAndMolecular:
      'Distensión luminal, activación enzimática intrapancreática (tripsinógeno→tripsina) o isquemia mucosa que libera mediadores locales (prostaglandinas, bradicinina, sustancia P) activando nociceptores viscerales y posteriormente somáticos peritoneales.',
    anatomicalAndFunctional:
      'Edema parietal, obstrucción venosa-linfática y compromiso arterial progresivo de la víscera hueca o parénquima, con íleo reflejo, tercer espacio líquido o pérdida hemática intraluminal/intraperitoneal.',
    hemodynamicAndMetabolic:
      'Secuestro de líquidos en tercer espacio o hemorragia activa que reduce la precarga cardiaca generando taquicardia compensatoria e hipotensión ortostática o manifiesta.',
    inflammatoryAndImmunologic:
      'Transmigración leucocitaria transmural, exudación peritoneal fibrinopurulenta y liberación sistémica de citocinas que originan fiebre y leucocitosis con neutrofilia.',
  },
  {
    pattern: /\b(ictus|acv|evento cerebrovascular|epilep|status|convuls|mening|guillain|migrana|vertigo|parkinson|miastenia)\b/,
    cellularAndMolecular:
      'Fallo energético neuronal en penumbra isquémica, excitotoxicidad por glutamato/Ca²⁺, despolarización paroxística sincrónica, desmielinización inmunomediada de nervio periférico o sensibilización trigeminovascular por CGRP.',
    anatomicalAndFunctional:
      'Interrupción focal de tractos corticoespinales, troncoencefálicos, placa neuromuscular o vías vestibulares según territorio vascular o estructura comprometida.',
    hemodynamicAndMetabolic:
      'En lesión intracraneal aguda se activa el mecanismo de autorregulación cerebral y respuesta hipertensiva compensatoria (mantener PPC = PAM − PIC); en convulsiones prolongadas sube el lactato y el consumo de O₂.',
    inflammatoryAndImmunologic:
      'Activación microglial, ruptura de barrera hematoencefálica o mimetismo molecular (autoanticuerpos antigangliósido/anti-AChR) según etiología.',
  },
  {
    pattern: /\b(renal|pielonefritis|cistitis|nefrit|nefrot|litiasis|retencion aguda|hiperpotasemia)\b/,
    cellularAndMolecular:
      'Alteración glomerular inmunomediada, injuria tubular isquémica/tóxica u obstrucción del flujo urinario que eleva la presión intratubular y reduce el filtrado glomerular neto.',
    anatomicalAndFunctional:
      'Disminución del aclaramiento de productos nitrogenados (urea/creatinina), alteración de la reabsorción tubular de Na⁺/H₂O y compromiso de la excreción renal de H⁺ y K⁺.',
    hemodynamicAndMetabolic:
      'Retención hidrosalina o activación del eje renina-angiotensina-aldosterona con hipertensión arterial, acidosis metabólica hiperclorémica o hiperkalemia arritmogénica.',
    inflammatoryAndImmunologic:
      'Infiltración intersticial/urotelial por neutrófilos o depósito de inmunocomplejos/complemento en capilares glomerulares.',
  },
  {
    pattern: /\b(preeclampsia|eclampsia|embarazo|obstetric|hemorragia postparto)\b/,
    cellularAndMolecular:
      'Remodelado trofoblástico incompleto de arterias espirales uterinas que produce isquemia placentaria y liberación de factores antiangiogénicos (sFlt-1, endoglina soluble), causando disfunción endotelial materna sistémica.',
    anatomicalAndFunctional:
      'Vasoespasmo arteriolar generalizado, microangiopatía trombótica hepatorrenal, edema endotelial glomerular (endoteliosis) y aumento de permeabilidad cerebrovascular.',
    hemodynamicAndMetabolic:
      'Aumento severo de resistencias vasculares periféricas pese a contracción del volumen plasmático intravascular, proteinuria y riesgo de edema pulmonar o eclampsia.',
    inflammatoryAndImmunologic:
      'Desbalance inmuno-endotelial materno-placentario con activación plaquetaria y consumo microvascular (espectro HELLP).',
  },
];

function buildSymptomCorrelations(caseData: ClinicalCase): Array<{
  clinicalFeature: string;
  causalMechanism: string;
}> {
  const age = caseData.patientInfo?.age ?? 30;
  const preg = detectPregnancyContext(caseData);
  const vitals = caseData.vitalSigns;
  const vFlags = evaluateVitalsWithAgeContext(vitals, age, preg.isViablePregnancy);
  const correlations: Array<{ clinicalFeature: string; causalMechanism: string }> = [];

  if (vFlags.isHypotensive) {
    correlations.push({
      clinicalFeature: `Hipotensión arterial (${vitals.bloodPressure})`,
      causalMechanism:
        'Caída del volumen sistólico (pérdida de precarga/volemia o fallo de bomba) y/o descenso de resistencias vasculares sistémicas por vasodilatación mediada por citocinas/óxido nítrico.',
    });
  } else if (vFlags.isHypertensive) {
    correlations.push({
      clinicalFeature: `Hipertensión arterial (${vitals.bloodPressure})`,
      causalMechanism:
        'Aumento sostenido de las resistencias vasculares periféricas (descarga simpática, eje RAA, vasoespasmo endotelial o dolor/estrés agudo) que eleva la poscarga ventricular.',
    });
  }

  if (vFlags.isTachycardic) {
    correlations.push({
      clinicalFeature: `Taquicardia (${vitals.heartRate} lpm)`,
      causalMechanism:
        'Respuesta cronotrópica compensatoria mediada por barorreceptores y descarga adrenérgica ante hipovolemia, fiebre (+~10 lpm/°C), hipoxemia, dolor intenso o tirotoxicosis.',
    });
  } else if (vFlags.isBradycardic) {
    correlations.push({
      clinicalFeature: `Bradicardia (${vitals.heartRate} lpm)`,
      causalMechanism:
        'Disfunción del automatismo sinusal, bloqueo de conducción en el nodo AV, hipertono vagal o intoxicación colinérgica/frenadora nodal.',
    });
  }

  if (vFlags.isTachypneic || vFlags.isHypoxemic) {
    correlations.push({
      clinicalFeature: `Taquipnea / Hipoxemia (FR ${vitals.respiratoryRate} rpm · SpO₂ ${vitals.oxygenSaturation}%)`,
      causalMechanism:
        'Desequilibrio ventilación-perfusión (V/Q), ocupación alveolar o broncoespasmo que reduce la PaO₂, o bien compensación ventilatoria de acidosis metabólica mediante hiperventilación.',
    });
  }

  if (vFlags.isFebrile) {
    correlations.push({
      clinicalFeature: `Fiebre (${vitals.temperature} °C)`,
      causalMechanism:
        'Pirógenos exógenos inducen liberación de IL-1, IL-6 y TNF-α que estimulan la síntesis de PGE₂ en el órgano vasculoso de la lámina terminal, elevando el punto de ajuste termorregulador hipotalámico.',
    });
  }

  if (vFlags.isLowGlasgow) {
    correlations.push({
      clinicalFeature: `Compromiso neurológico (Glasgow ${vitals.glasgow}/15)`,
      causalMechanism:
        'Hipoperfusión cerebral global, hipoxemia, neuroglucopenia, encefalopatía metabólica/séptica o lesión estructural con aumento de presión intracraneal.',
    });
  }

  if (vFlags.isHypoglycemic) {
    correlations.push({
      clinicalFeature: `Hipoglucemia (${vitals.bloodGlucose} mg/dL)`,
      causalMechanism:
        'Exceso relativo de insulina o agotamiento de reservas de glucógeno hepático que priva al SNC del sustrato energético primario (neuroglucopenia + descarga adrenérgica).',
    });
  } else if (vFlags.isSevereHyperglycemic) {
    correlations.push({
      clinicalFeature: `Hiperglucemia severa (${vitals.bloodGlucose} mg/dL)`,
      causalMechanism:
        'Déficit de acción insulínica y exceso de glucagón/cortisol que aceleran glucogenólisis, gluconeogénesis y resistencia periférica a la captación celular de glucosa.',
    });
  }

  // Real abnormal physical exam findings from caseData (strictly non-invented)
  for (const pe of (caseData.physicalExamPool || []).filter((p) => p.isAbnormal).slice(0, 3)) {
    correlations.push({
      clinicalFeature: `${pe.name}: ${pe.finding}`,
      causalMechanism:
        pe.semiologyNote?.trim() ||
        `Expresión física directa de la alteración fisiopatológica en ${pe.system.toLowerCase()} descrita en el cuadro (${caseData.solution.correctDiagnosis}).`,
    });
  }

  if (correlations.length === 0) {
    correlations.push({
      clinicalFeature: `Motivo de consulta: ${caseData.patientInfo.consultReason}`,
      causalMechanism:
        caseData.solution.pathophysiology ||
        `Manifestación clínica directa del proceso fisiopatológico propio de ${caseData.solution.correctDiagnosis}, manteniendo estabilidad hemodinámica basal.`,
    });
  }

  return correlations.slice(0, 5);
}

function buildLabAndImagingCorrelations(caseData: ClinicalCase): Array<{
  studyName: string;
  abnormalFinding: string;
  physiologicalExplanation: string;
}> {
  const abnormalStudies = (caseData.studiesPool || []).filter((s) => s.isAbnormal);
  if (abnormalStudies.length === 0) {
    const normalPertinent = (caseData.studiesPool || []).filter((s) => !s.isAbnormal).slice(0, 2);
    return normalPertinent.map((st) => ({
      studyName: st.name,
      abnormalFinding: st.result,
      physiologicalExplanation:
        st.interpretation ||
        'Resultado sin alteración aguda que respalda el descarte de complicaciones orgánicas sistémicas.',
    }));
  }

  return abnormalStudies.slice(0, 5).map((st) => {
    const n = norm(`${st.name} ${st.result}`);
    let fallbackWhy =
      st.interpretation ||
      `Alteración coherente con el daño tisular, inflamatorio o metabólico de ${caseData.solution.correctDiagnosis}.`;

    if (!st.interpretation) {
      if (/\btroponina\b/.test(n)) {
        fallbackWhy =
          'La necrosis o injuria sarcolemal aguda libera troponina estructural del complejo contráctil miocárdico hacia la circulación sistémica.';
      } else if (/\blactato\b/.test(n)) {
        fallbackWhy =
          'Refleja metabolismo anaerobio celular por déficit de entrega/utilización de O₂ o aclaramiento hepático reducido en estado de hipoperfusión.';
      } else if (/\b(leucocit|pcr|procalcitonina)\b/.test(n)) {
        fallbackWhy =
          'La respuesta de citocinas (IL-6, G-CSF) acelera la liberación medular de neutrófilos y la síntesis hepática de reactantes de fase aguda.';
      } else if (/\bcreatinina\b/.test(n)) {
        fallbackWhy =
          'Disminución de la tasa de filtración glomerular por hipoperfusión renal prerrenal, lesión tubular aguda o nefropatía subyacente.';
      }
    }

    return {
      studyName: st.name,
      abnormalFinding: st.result,
      physiologicalExplanation: fallbackWhy,
    };
  });
}

export function buildDeepPathophysiologyMatrix(caseData: ClinicalCase): PathophysiologyMatrix {
  const diagCorpus = norm(
    `${caseData.solution?.correctDiagnosis || ''} ${caseData.solution?.pathophysiology || ''}`
  );
  const matchedProfile = PATHO_PROFILES.find((p) => p.pattern.test(diagCorpus));
  const basePatho = caseData.solution?.pathophysiology || '';

  return {
    cellularAndMolecular:
      matchedProfile?.cellularAndMolecular ||
      `Mecanismo primario del caso: ${basePatho}`,
    anatomicalAndFunctional:
      matchedProfile?.anatomicalAndFunctional ||
      `Alteración órgano-funcional central documentada en el caso: ${basePatho}`,
    hemodynamicAndMetabolic:
      matchedProfile?.hemodynamicAndMetabolic ||
      `Repercusión sistémica evaluada mediante signos vitales basales (PA ${caseData.vitalSigns.bloodPressure}, FC ${caseData.vitalSigns.heartRate} lpm, FR ${caseData.vitalSigns.respiratoryRate} rpm, SpO₂ ${caseData.vitalSigns.oxygenSaturation}%).`,
    inflammatoryAndImmunologic:
      matchedProfile?.inflammatoryAndImmunologic ||
      'Respuesta neuroendocrina e inflamatoria modulada por la etiología subyacente (infecciosa, autoinmune, isquémica o metabólica) del caso clínico.',
    symptomCorrelations: buildSymptomCorrelations(caseData),
    labAndImagingCorrelations: buildLabAndImagingCorrelations(caseData),
  };
}

export function buildDifferentialReasoningMatrix(
  caseData: ClinicalCase
): DifferentialReasoningMatrixItem[] {
  const diffs = caseData.solution?.differentialDiagnoses || [];
  const rulingOut = caseData.solution?.criticalRulingOutFactors || [];
  const consult = caseData.patientInfo?.consultReason || 'el síndrome clínico de ingreso';
  const abnormalStudies = (caseData.studiesPool || []).filter((s) => s.isAbnormal);
  const normalStudies = (caseData.studiesPool || []).filter((s) => !s.isAbnormal);
  const workup = caseData.solution?.recommendedWorkup || [];

  return diffs.map((diff, idx) => {
    const diffNorm = norm(diff);
    const isCriticalMustNotMiss =
      /\b(infarto|sca|iam|diseccion aortica|tromboembol|tep|ectopico|meningitis|sepsis|aneurisma|hemorragia|torsion|apendicitis|anafilax|preeclampsia|cetoacidosis|neumotorax)\b/.test(
        diffNorm
      );

    let qualitativeProbability: QualitativeClinicalProbability = 'Probabilidad intermedia';
    if (isCriticalMustNotMiss) {
      qualitativeProbability = 'No omitir (riesgo vital)';
    } else if (idx >= 2) {
      qualitativeProbability = 'Baja probabilidad · Descarte crítico';
    }

    const findingsFor: string[] = [
      `Comparte la presentación inicial orientada por "${consult}" y ${caseData.patientInfo.evolutionTime} de evolución.`,
    ];
    if (caseData.solution.characteristicSignsSymptoms?.[idx]) {
      findingsFor.push(
        `Puede coincidir parcialmente con manifestaciones del síndrome (${caseData.solution.characteristicSignsSymptoms[idx]}).`
      );
    }

    const findingsAgainst: string[] = [];
    if (rulingOut[idx]) {
      findingsAgainst.push(rulingOut[idx]);
    } else if (rulingOut[0]) {
      findingsAgainst.push(rulingOut[0]);
    }
    if (abnormalStudies[0]) {
      findingsAgainst.push(
        `Hallazgo real del caso en ${abnormalStudies[0].name} (${abnormalStudies[0].result}) orienta hacia ${caseData.solution.correctDiagnosis}.`
      );
    } else if (normalStudies[0]) {
      findingsAgainst.push(
        `El estudio ${normalStudies[0].name} (${normalStudies[0].result}) no apoya patología alternativa grave de ese sistema.`
      );
    }

    const matchingStudy =
      (caseData.studiesPool || []).find((st) => {
        const sn = norm(st.name);
        return diffNorm
          .split(/\s+/)
          .some((tok) => tok.length >= 5 && sn.includes(tok.slice(0, 5)));
      }) || abnormalStudies[0];

    const confirmatoryWorkup = matchingStudy
      ? `${matchingStudy.name} (${matchingStudy.result})`
      : workup[idx] || workup[0] || 'Exploración física dirigida e integración clínica con paraclínicos del caso';

    return {
      diagnosis: diff,
      qualitativeProbability,
      findingsFor,
      findingsAgainst:
        findingsAgainst.length > 0
          ? findingsAgainst
          : [`La anamnesis dirigida y el examen físico completo respaldan ${caseData.solution.correctDiagnosis} sobre ${diff}.`],
      confirmatoryWorkup,
    };
  });
}

/**
 * Selecciona y calcula únicamente escalas clínicas validadas para la edad, sexo y contexto real del paciente.
 * Nunca aplica escalas de adultos en población pediátrica ni inventa puntos de parámetros ausentes.
 */
export function selectValidatedClinicalScales(
  caseData: ClinicalCase
): ValidatedClinicalScaleItem[] {
  const age = caseData.patientInfo?.age ?? 30;
  const vitals = caseData.vitalSigns;
  const bpMatch = (vitals.bloodPressure || '').match(/(\d+)\s*\/\s*(\d+)/);
  const sys = bpMatch ? parseInt(bpMatch[1], 10) : 120;
  const derived = computeDerivedBedsideIndices(vitals, age, caseData.studiesPool || []);
  const diagNorm = norm(
    `${caseData.solution?.correctDiagnosis || ''} ${caseData.patientInfo?.consultReason || ''} ${caseData.patientInfo?.currentIllness || ''}`
  );

  const scales: ValidatedClinicalScaleItem[] = [];

  // 1. Escala de Coma de Glasgow (siempre verificable; distingue versión pediátrica <2 años vs estándar)
  scales.push({
    scaleName: age < 2 ? 'Escala de Coma de Glasgow Pediátrica' : 'Escala de Coma de Glasgow (ECG)',
    validatedPopulation: age < 2 ? 'Lactantes (<2 años)' : 'Niños ≥2 años y adultos',
    eligibilityStatus: 'aplicable',
    criteriaSummary: `Puntaje basal documentado: ${vitals.glasgow}/15.`,
    clinicalInterpretation:
      vitals.glasgow <= 8
        ? 'Compromiso neurológico grave (≤8): indicación de protección definitiva de vía aérea.'
        : vitals.glasgow <= 12
          ? 'Alteración moderada del estado de alerta (9–12): requiere vigilancia neurológica estrecha.'
          : vitals.glasgow < 15
            ? 'Compromiso neurológico leve (13–14): investigar causa metabólica, hipóxica o estructural.'
            : 'Estado de alerta conservado (15/15).',
  });

  // 2. Sepsis / qSOFA vs Pediatría
  if (/\b(sepsis|choque|shock|fiebre|infeccion|pielonefritis|neumonia|meningitis|colangitis)\b/.test(diagNorm)) {
    if (age >= 16) {
      const q = derived.qsofaScore ?? 0;
      scales.push({
        scaleName: 'qSOFA (Quick SOFA — Sepsis-3)',
        validatedPopulation: 'Adultos y adolescentes ≥16 años con sospecha de infección',
        eligibilityStatus: 'aplicable',
        criteriaSummary: `Criterios basales: FR ≥22 (${vitals.respiratoryRate >= 22 ? 'Sí' : 'No'}), PAS ≤100 (${sys <= 100 ? 'Sí' : 'No'}), Glasgow <15 (${vitals.glasgow < 15 ? 'Sí' : 'No'}) → ${q}/3 puntos.`,
        clinicalInterpretation:
          q >= 2
            ? 'qSOFA ≥2: alto riesgo de desenlace desfavorable por sepsis; activar protocolo de reanimación y cultivos de inmediato.'
            : 'qSOFA <2: no descarta sepsis por sí solo si existen otros datos de disfunción orgánica o lactato elevado.',
      });
    } else {
      scales.push({
        scaleName: 'qSOFA (Adultos) — No extrapolable a Pediatría',
        validatedPopulation: 'Validada únicamente en población adulta (≥16–18 años)',
        eligibilityStatus: 'no_validada_en_poblacion',
        criteriaSummary: `Paciente de ${age} años: no se calcula qSOFA adulto para evitar subestimación o falsos positivos.`,
        clinicalInterpretation:
          'En pediatría debe utilizarse el Triángulo de Evaluación Pediátrica (TEP), signos vitales ajustados por edad y criterios Phoenix de sepsis pediátrica.',
      });
    }
  }

  // 3. Neumonía: CURB-65 (solo >=18 años)
  if (/\bneumonia\b/.test(diagNorm)) {
    if (age >= 18) {
      const conf = vitals.glasgow < 15 ? 1 : 0;
      const rr = vitals.respiratoryRate >= 30 ? 1 : 0;
      const bp = sys < 90 ? 1 : 0;
      const agePt = age >= 65 ? 1 : 0;
      const partial = conf + rr + bp + agePt;
      scales.push({
        scaleName: 'CURB-65 (estratificación en Neumonía Adquirida en la Comunidad)',
        validatedPopulation: 'Adultos ≥18 años con NAC confirmada',
        eligibilityStatus: 'aplicable',
        criteriaSummary: `Parámetros clínicos medidos: Confusión (${conf}), FR≥30 (${rr}), PA<90/60 (${bp}), Edad≥65 (${agePt}) → ≥${partial} puntos clínicos (sin contar BUN si no se midió).`,
        clinicalInterpretation:
          partial >= 2
            ? 'Puntaje ≥2 sugiere necesidad de manejo hospitalario o estrecha vigilancia clínica.'
            : 'Bajo puntaje clínico basal; integrar siempre SpO₂, comorbilidades, tolerancia oral y valor real de urea/BUN.',
      });
    } else {
      scales.push({
        scaleName: 'CURB-65 — No validada en Pediatría',
        validatedPopulation: 'Exclusiva para adultos ≥18 años',
        eligibilityStatus: 'no_validada_en_poblacion',
        criteriaSummary: `Paciente de ${age} años: CURB-65 no aplica en edad pediátrica.`,
        clinicalInterpretation:
          'En niños se evalúa gravedad mediante taquipnea por edad OMS/AIEPI, tiraje subcostal, saturación de O₂, cianosis o incapacidad para beber.',
      });
    }
  }

  // 4. Dolor torácico / SCA / TEP / FA
  if (/\b(infarto|iam|sca|angina|dolor toracico)\b/.test(diagNorm) && age >= 18) {
    scales.push({
      scaleName: 'Estratificación clínica SCA (ESC / AHA)',
      validatedPopulation: 'Adultos ≥18 años con dolor torácico sospechoso de SCA',
      eligibilityStatus: 'aplicable',
      criteriaSummary: `Edad ${age} años · PA ${vitals.bloodPressure} · FC ${vitals.heartRate} lpm · SpO₂ ${vitals.oxygenSaturation}%.`,
      clinicalInterpretation:
        'Todo dolor torácico agudo adulto exige ECG de 12 derivaciones en ≤10 minutos y troponinas seriadas antes de descartar isquemia.',
    });
  }

  if (/\b(fibrilacion auricular)\b/.test(diagNorm) && age >= 18) {
    scales.push({
      scaleName: 'CHA₂DS₂-VASc (Riesgo tromboembólico en Fibrilación Auricular)',
      validatedPopulation: 'Adultos ≥18 años con Fibrilación Auricular no valvular',
      eligibilityStatus: 'aplicable',
      criteriaSummary: `Edad ${age} años (${age >= 75 ? '+2' : age >= 65 ? '+1' : '0'}), sexo ${caseData.patientInfo.sex} (${caseData.patientInfo.sex === 'Femenino' ? '+1 modificador' : '0'}). Sumar comorbilidades reales de antecedentes (HTA, IC, DM, ECV).`,
      clinicalInterpretation:
        'Guía la indicación de anticoagulación oral crónica (Warfarina con INR 2–3 o ACOD) frente a riesgo hemorrágico.',
    });
  }

  if (/\b(tromboembol|tep|tvp)\b/.test(diagNorm)) {
    scales.push({
      scaleName: 'Criterios de Wells (Probabilidad clínica pretest de TEP)',
      validatedPopulation: 'Adultos ≥18 años',
      eligibilityStatus: age >= 18 ? 'aplicable' : 'no_validada_en_poblacion',
      criteriaSummary:
        age >= 18
          ? 'Evalúa signos de TVP (+3), diagnóstico alternativo menos probable (+3), FC >100 (+1.5), inmovilización/cirugía (+1.5), TEP/TVP previa (+1.5), hemoptisis (+1), cáncer (+1).'
          : `Paciente de ${age} años: Wells no está validada en pediatría.`,
      clinicalInterpretation:
        age >= 18
          ? 'Permite decidir dímero D de alta sensibilidad (probabilidad baja) vs angio-TAC pulmonar directa (probabilidad alta).'
          : 'En pediatría requiere valoración hematológica/imagenológica especializada sin usar puntaje Wells adulto.',
    });
  }

  // 5. Triángulo de Evaluación Pediátrica (si <18 años)
  if (age < 18) {
    const abnormalVitals = evaluateVitalsWithAgeContext(vitals, age, false);
    scales.push({
      scaleName: 'Triángulo de Evaluación Pediátrica (TEP)',
      validatedPopulation: 'Lactantes, niños y adolescentes (<18 años)',
      eligibilityStatus: 'aplicable',
      criteriaSummary: `Apariencia (Glasgow ${vitals.glasgow}/15), Trabajo respiratorio (FR ${vitals.respiratoryRate} rpm · SpO₂ ${vitals.oxygenSaturation}%), Circulación (FC ${vitals.heartRate} lpm · PA ${vitals.bloodPressure}).`,
      clinicalInterpretation:
        abnormalVitals.isHypotensive || abnormalVitals.isHypoxemic || abnormalVitals.isLowGlasgow
          ? 'TEP alterado con compromiso fisiológico agudo: priorizar estabilización A-B-C inmediata y dosis por peso.'
          : 'Estabilidad hemodinámica/respiratoria basal conservada; vigilar hidratación y signos de alarma por edad.',
    });
  }

  // 6. Faringoamigdalitis: Centor/McIsaac
  if (/\b(faringoamigdalitis|amigdalitis|faringitis)\b/.test(diagNorm) && age >= 3) {
    scales.push({
      scaleName: 'Criterios de Centor modificados (McIsaac)',
      validatedPopulation: 'Pacientes ≥3 años con odinofagia aguda',
      eligibilityStatus: 'aplicable',
      criteriaSummary: `Edad ${age} años (${age <= 14 ? '+1' : age >= 45 ? '-1' : '0'}) · Fiebre >38°C (${vitals.temperature >= 38 ? '+1' : '0'}). Sumar exudado amigdalino, adenopatía cervical anterior dolorosa y ausencia de tos.`,
      clinicalInterpretation:
        'Un puntaje ≤1 orienta fuertemente a etiología viral sin requerir antibiótico; ≥3–4 respalda prueba rápida o tratamiento antibiótico dirigido según guía.',
    });
  }

  return scales.slice(0, 4);
}
