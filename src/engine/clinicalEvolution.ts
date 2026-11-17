import {
  ClinicalCase,
  ClinicalEvolutionState,
  EvolutionTrajectory,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';
import {
  detectPregnancyContext,
  getVitalReferenceBounds,
} from '../utils/clinicalContext';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function norm(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function parseBP(bp: string): { sys: number; dia: number } {
  const match = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { sys: 120, dia: 80 };
  return {
    sys: clamp(parseInt(match[1], 10) || 120, 45, 250),
    dia: clamp(parseInt(match[2], 10) || 80, 24, 150),
  };
}

function formatBP(sys: number, dia: number): string {
  const safeSys = clamp(Math.round(sys), 45, 250);
  const safeDia = clamp(Math.round(dia), 24, Math.min(150, Math.max(28, safeSys - 14)));
  return `${safeSys}/${safeDia} mmHg`;
}

export interface EvolutionTickResult {
  updatedVitals: VitalSigns;
  evolutionState: ClinicalEvolutionState;
  changed: boolean;
}

function lastIndex(
  list: StatInterventionRecord[],
  predicate: (rec: StatInterventionRecord) => boolean
): number {
  for (let i = list.length - 1; i >= 0; i--) {
    if (predicate(list[i])) return i;
  }
  return -1;
}

/**
 * Motor determinista de evolución clínica continua basado en fisiopatología real por patología y grupo etario.
 * Diferencia consultas ambulatorias estables de urgencias progresivas, evita rescates falsos por fármacos
 * meramente sintomáticos (p. ej. paracetamol/ondansetrón en choque séptico) y ajusta umbrales a pediatría/gestación.
 */
export function evaluateClinicalEvolutionStep(params: {
  caseData: ClinicalCase;
  baselineVitals: VitalSigns;
  currentVitals: VitalSigns;
  elapsedSeconds: number;
  statInterventions: StatInterventionRecord[];
  unlockedExamCount: number;
  unlockedStudyCount: number;
  lastEvaluatedSecond: number;
  forceRefresh?: boolean;
}): EvolutionTickResult {
  const {
    caseData,
    baselineVitals,
    currentVitals,
    elapsedSeconds,
    statInterventions,
    lastEvaluatedSecond,
    forceRefresh = false,
  } = params;

  const isDeceased =
    statInterventions.some((s) => s.isImmediateDeath) ||
    currentVitals.heartRate === 0 ||
    (currentVitals.bloodPressure || '').startsWith('0/');

  if (isDeceased) {
    return {
      updatedVitals: {
        ...currentVitals,
        bloodPressure: '0/0 mmHg',
        heartRate: 0,
        respiratoryRate: 0,
        oxygenSaturation: 0,
        glasgow: 3,
      },
      evolutionState: {
        trajectory: 'critico',
        activeAlerts: [
          '¡CÓDIGO AZUL · PACIENTE FALLECIDO (ASISTOLIA)!: muerte inmediata por iatrogenia irreversible.',
        ],
        lastEvaluatedSecond: elapsedSeconds,
        summaryNote: 'Paciente en asistolia irreversible sin pulso ni ventilación espontánea.',
      },
      changed: false,
    };
  }

  const age = caseData.patientInfo.age;
  const preg = detectPregnancyContext(caseData, { publicOnly: true });
  const bounds = getVitalReferenceBounds(age, preg.isPregnant);

  const maxHrClamp = age <= 5 ? 215 : 195;
  const maxRrClamp = age < 1 ? 76 : age <= 5 ? 60 : 48;
  const hypotensionLimit = bounds.sbpLow; // 70 lactante, 75+2e preescolar, 80+2e escolar, 90 adulto, 95 anciano
  const criticalShockLimit = Math.max(48, hypotensionLimit - 14);
  const tachySevereLimit = Math.max(145, bounds.hrMax + 30);
  const tachyMarkedLimit = Math.max(125, bounds.hrMax + 15);
  const tachypneaSevereLimit = Math.max(28, bounds.rrMax + 10);

  const baseBP = parseBP(baselineVitals.bloodPressure);
  const curBP = parseBP(currentVitals.bloodPressure);

  let sys = curBP.sys;
  let dia = curBP.dia;
  let hr = currentVitals.heartRate;
  let rr = currentVitals.respiratoryRate;
  let temp = currentVitals.temperature;
  let spo2 = currentVitals.oxygenSaturation;
  let glasgow = currentVitals.glasgow;
  let glucose = currentVitals.bloodGlucose;

  const diagText = norm(`${caseData.solution.correctDiagnosis} ${caseData.solution.pathophysiology}`);
  const triageText = norm(caseData.patientInfo.triageLevel);
  const isCriticalCase =
    caseData.mode === 'urgencias' || /^nivel (i|ii)\b/.test(triageText);

  // Perfil fisiopatológico real según diagnóstico
  const isHemorrhagicStrokeOrIch =
    /hemorragia subaracnoidea|ictus hemorragico|hemorragia intracerebral/.test(diagText);
  const isIschemicStroke = /ictus isquemico|evento vascular cerebral isquemico/.test(diagText);
  const isObstetricEclampsia = /preeclampsia|eclampsia/.test(diagText);
  const isPanicOrAnxiety = /trastorno de panico|ataque de panico|ansiedad generalizada/.test(diagText);
  const isPheochromocytoma = /feocromocitoma/.test(diagText);
  const isThyroidStorm = /tormenta tiroidea|crisis tirotoxica/.test(diagText);
  const isSerotoninSyndrome = /sindrome serotoninergico/.test(diagText);
  const isCardiacTamponade = /taponamiento cardiaco/.test(diagText);
  const isPneumothorax = /neumotorax/.test(diagText);
  const isPulmonaryEmbolism = /tromboembolia pulmonar|\btep\b/.test(diagText);
  const isPulmonaryEdemaOrChf =
    /edema agudo.*pulmon|insuficiencia cardiaca.*descompensada|sobrecarga hidrica/.test(diagText);
  const isAfibRvr = /fibrilacion auricular.*respuesta ventricular rapida/.test(diagText);
  const isTsvp = /taquicardia supraventricular|\btsvp\b|\btpsv\b|reentrada nodal/.test(diagText);
  const isVentricularTachycardia = /taquicardia ventricular/.test(diagText);
  const isCompleteAvBlock =
    /bloqueo av.*(?:completo|tercer grado|3er grado)|bloqueo auriculoventricular completo/.test(diagText);
  const isAorticDissection = /diseccion aortica/.test(diagText);
  const isMyxedemaComa = /coma mixedematoso/.test(diagText);
  const isHypoglycemiaEmergency = /hipoglucemia severa|coma hipoglucemico|neuroglucopenia/.test(diagText);
  const isMyasthenicCrisis = /crisis miastenica|miastenia gravis|guillain-barre|guillain barre/.test(diagText);
  const isOrganophosphate = /organofosforad|colinergico/.test(diagText);
  const isCarbonMonoxide = /monoxido de carbono/.test(diagText);
  const isMethanol = /metanol/.test(diagText);
  const isDkaOrHhs = /cetoacidosis|estado hiperosmolar/.test(diagText);
  const isAdrenalCrisis = /crisis suprarrenal|insuficiencia adrenal/.test(diagText);
  const isAnaphylaxis = /anafilax/.test(diagText);
  const isStatusEpilepticus = /estatus epileptico|status epileptico|crisis epileptica/.test(diagText);
  const isMeningitis = /meningitis/.test(diagText);
  const isMalariaSevere = /paludismo|malaria/.test(diagText);
  const isCopd = /\bepoc\b|enfisema/.test(diagText);
  const isIschemicHeart = /infarto|iamcest|iamsest|scasest|sindrome coronario|takotsubo/.test(diagText);

  const isHypovolemicOrDistributive =
    !isHemorrhagicStrokeOrIch &&
    (/choque|shock|dengue|sepsis|ectopico|hemorragia digestiva|ulcera peptica|colangitis|pielonefritis|neutropenia febril|deshidratacion severa/.test(
      diagText
    ) ||
      isAdrenalCrisis ||
      isAnaphylaxis ||
      isMalariaSevere ||
      isMyxedemaComa);

  const isObstructiveShock = isCardiacTamponade || isPneumothorax || isPulmonaryEmbolism;

  const isHypoxemicRespiratoryEmergency =
    /crisis asmatica|exacerbacion aguda.*epoc|bronquiolitis|crup|laringotraque|neumonia.*grave/.test(
      diagText
    ) ||
    isPulmonaryEdemaOrChf ||
    isPneumothorax ||
    isPulmonaryEmbolism ||
    isMyasthenicCrisis ||
    isOrganophosphate ||
    isAnaphylaxis;

  const isMetabolicAcidosisPathology = isDkaOrHhs || isMethanol;

  const isTrueAcuteEmergency =
    isCriticalCase ||
    isHypovolemicOrDistributive ||
    isObstructiveShock ||
    isHypoxemicRespiratoryEmergency ||
    isHemorrhagicStrokeOrIch ||
    isIschemicStroke ||
    isObstetricEclampsia ||
    isPheochromocytoma ||
    isThyroidStorm ||
    isSerotoninSyndrome ||
    isCarbonMonoxide ||
    isMethanol ||
    isDkaOrHhs ||
    isStatusEpilepticus ||
    isMeningitis ||
    isAfibRvr ||
    isTsvp ||
    isVentricularTachycardia ||
    isCompleteAvBlock ||
    isAorticDissection ||
    isMyxedemaComa ||
    isHypoglycemiaEmergency ||
    isIschemicHeart ||
    /compartimental|torsion testicular|apendicitis|obstruccion intestinal|invaginacion|perforacion|delirium tremens|rabdomiolisis|hiperkalemia|hiperpotasemia|paracetamol|litio|purpura trombotica|porfiria/.test(
      diagText
    );

  // Seguimiento por dominio terapéutico real (evita que Ondansetrón/Paracetamol frenen un choque o hipoxia)
  const isSafeStat = (r: StatInterventionRecord) => r.effectSeverity !== 'reaccion_adversa';
  const drugOf = (r: StatInterventionRecord) => norm(`${r.drug} ${r.label} ${r.presetId || ''}`);

  const lastAdverseIdx = lastIndex(statInterventions, (r) => r.effectSeverity === 'reaccion_adversa');
  const lastAdverseRec = lastAdverseIdx >= 0 ? statInterventions[lastAdverseIdx] : undefined;
  const lastAdverseNote = lastAdverseRec ? norm(lastAdverseRec.physiologicalEffectSummary) : '';

  const hasValidHemodynamicRescue = statInterventions.some((r, idx) => {
    if (!isSafeStat(r)) return false;
    const d = drugOf(r);
    const isFluidOrPressor =
      /\b(salina|ssn|hartmann|ringer|cristaloide|norepinefrina|noradrenalina|dopamina|vasopresina)\b/.test(d) ||
      (isAnaphylaxis && /\b(adrenalina|epinefrina)\b/.test(d)) ||
      (isAdrenalCrisis && /\bhidrocortisona\b/.test(d)) ||
      (isMyxedemaComa && /\b(hidrocortisona|levotiroxina|liotironina)\b/.test(d)) ||
      (isCompleteAvBlock && /\b(atropina|adrenalina|epinefrina)\b/.test(d)) ||
      (isOrganophosphate && /\batropina\b/.test(d));
    // Si hubo iatrogenia hemodinámica posterior, requiere rescate posterior
    const hasLaterHemoAdverse =
      lastAdverseIdx > idx &&
      /hipotension|choque|vasoplej|anafil|hemorrag|sangr|deshidrat/.test(lastAdverseNote);
    return isFluidOrPressor && !hasLaterHemoAdverse;
  });

  const hasValidRespiratoryTx = statInterventions.some((r, idx) => {
    if (!isSafeStat(r)) return false;
    const d = drugOf(r);
    const isResp =
      /\b(oxigeno|o2|mascarilla|canula|salbutamol|albuterol|ipratropio|broncodilat|furosemida|nitroglicerina)\b/.test(
        d
      ) ||
      ((isAnaphylaxis || /crup|laringotraque/.test(diagText)) && /\b(adrenalina|epinefrina)\b/.test(d)) ||
      (isOrganophosphate && /\batropina\b/.test(d)) ||
      /\b(naloxona|flumazenil|gluconato de calcio)\b/.test(d);
    const hasLaterRespAdverse =
      lastAdverseIdx > idx && /broncoespasmo|edema pulmonar|bradipnea|depresion|narcosis|apnea/.test(lastAdverseNote);
    return isResp && !hasLaterRespAdverse;
  });

  const hasValidBpControlTx = statInterventions.some((r) => {
    if (!isSafeStat(r)) return false;
    const d = drugOf(r);
    return (
      /\b(labetalol|hidralazina|nitroprusiato|nicardipin|nifedipin|enalapril|propranolol|metoprolol|esmolol|nitroglicerina|furosemida)\b/.test(
        d
      ) ||
      (isObstetricEclampsia && /\b(sulfato de magnesio|magnesio|mgso4)\b/.test(d))
    );
  });

  const hasValidRateControlTx = statInterventions.some((r) => {
    if (!isSafeStat(r)) return false;
    const d = drugOf(r);
    return (
      /\b(propranolol|metoprolol|esmolol|atenolol|labetalol|diltiazem|verapamilo|amiodarona|adenosina|lidocaina|digoxina|diazepam|lorazepam|midazolam)\b/.test(
        d
      ) ||
      ((isOrganophosphate || isCompleteAvBlock || isMyxedemaComa || currentVitals.heartRate < bounds.hrMin) &&
        /\b(atropina|dopamina|adrenalina|epinefrina|levotiroxina|liotironina)\b/.test(d))
    );
  });

  const lastInsulinAdverseIdx = lastIndex(
    statInterventions,
    (r) => r.effectSeverity === 'reaccion_adversa' && /\binsulin/.test(drugOf(r))
  );
  const lastDextroseIdx = lastIndex(
    statInterventions,
    (r) => isSafeStat(r) && /\b(dextrosa|glucosa|glucosada|dw50|dw10)\b/.test(drugOf(r))
  );

  const hasValidInsulinTx = statInterventions.some(
    (r) => isSafeStat(r) && /\binsulin/.test(drugOf(r))
  );
  const hasValidHydrationOnly = statInterventions.some(
    (r) => isSafeStat(r) && /\b(salina|ssn|hartmann|ringer|cristaloide)\b/.test(drugOf(r))
  );
  const hasValidDextroseTx =
    lastDextroseIdx >= 0 && lastDextroseIdx > lastInsulinAdverseIdx;

  const hasValidAntipyreticTx = statInterventions.some((r) => {
    if (!isSafeStat(r)) return false;
    const d = drugOf(r);
    return /\b(paracetamol|acetaminofen|metamizol|dipirona|ibuprofeno|naproxeno|ketorolaco|diclofenaco)\b/.test(d);
  });

  const hasValidNeuroTx = statInterventions.some((r) => {
    if (!isSafeStat(r)) return false;
    const d = drugOf(r);
    return (
      /\b(diazepam|lorazepam|midazolam|fenitoina|levetiracetam|naloxona|flumazenil|gluconato de calcio|manitol)\b/.test(
        d
      ) ||
      (isObstetricEclampsia && /\b(magnesio|mgso4)\b/.test(d)) ||
      (isCarbonMonoxide && /\b(oxigeno|o2|mascarilla)\b/.test(d)) ||
      (typeof glucose === 'number' && baselineVitals.bloodGlucose !== undefined && baselineVitals.bloodGlucose < 70 && /\b(dextrosa|glucosa)\b/.test(d))
    );
  });

  // Detección de depresión iatrogénica activa no revertida
  const lastOpioidAdverse = lastIndex(
    statInterventions,
    (r) => r.effectSeverity === 'reaccion_adversa' && /\b(morfina|fentanilo|tramadol)\b/.test(drugOf(r))
  );
  const lastNaloxone = lastIndex(statInterventions, (r) => isSafeStat(r) && /\bnaloxona\b/.test(drugOf(r)));
  const lastBenzoAdverse = lastIndex(
    statInterventions,
    (r) => r.effectSeverity === 'reaccion_adversa' && /\b(diazepam|lorazepam|midazolam|propofol)\b/.test(drugOf(r))
  );
  const lastFlumazenil = lastIndex(statInterventions, (r) => isSafeStat(r) && /\bflumazenil\b/.test(drugOf(r)));
  const lastMgAdverse = lastIndex(
    statInterventions,
    (r) => r.effectSeverity === 'reaccion_adversa' && /\b(magnesio|mgso4)\b/.test(drugOf(r))
  );
  const lastCalcium = lastIndex(statInterventions, (r) => isSafeStat(r) && /\b(gluconato de calcio|cloruro de calcio)\b/.test(drugOf(r)));

  const lastFluidOverloadAdverse = lastIndex(
    statInterventions,
    (r) =>
      r.effectSeverity === 'reaccion_adversa' &&
      /sobrecarga hidrica|edema pulmonar|encharcamiento/.test(norm(r.physiologicalEffectSummary))
  );
  const lastFuroTx = lastIndex(statInterventions, (r) => isSafeStat(r) && /\bfurosemida\b/.test(drugOf(r)));
  const hasUnreversedFluidOverload = lastFluidOverloadAdverse >= 0 && lastFluidOverloadAdverse > lastFuroTx;

  const lastParacetamolAdverse = lastIndex(
    statInterventions,
    (r) =>
      r.effectSeverity === 'reaccion_adversa' &&
      /\b(paracetamol|acetaminofen)\b/.test(drugOf(r)) &&
      /necrosis hepatica|hepat|falla hepatica/.test(norm(r.physiologicalEffectSummary))
  );
  const lastNacTx = lastIndex(
    statInterventions,
    (r) => isSafeStat(r) && /\b(acetilcisteina|n acetilcisteina|nac)\b/.test(drugOf(r))
  );
  const hasUnreversedHepatotoxicity = lastParacetamolAdverse >= 0 && lastParacetamolAdverse > lastNacTx;

  const lastBleedOrNsaidAdverse = lastIndex(
    statInterventions,
    (r) =>
      r.effectSeverity === 'reaccion_adversa' &&
      /hemorragia digestiva|hemorragia|sangrado/.test(norm(r.physiologicalEffectSummary))
  );
  const hasActiveBleedIatrogeny =
    lastBleedOrNsaidAdverse >= 0 &&
    lastIndex(statInterventions, (r) => isSafeStat(r) && /\b(protamina|vitamina k|salina|ssn|hartmann|ringer)\b/.test(drugOf(r))) <= lastBleedOrNsaidAdverse;

  const lastCumulativeToxicOther = lastIndex(
    statInterventions,
    (r) =>
      r.effectSeverity === 'reaccion_adversa' &&
      /torsades|prolongacion.*qt|hiperkalemia|hipercalcemia|salicilismo|anticolinerg|extrapiramidal|crisis adrenergica|bloqueo av|bloqueo nodal|alcalosis metabolica|nefrotoxicidad/.test(
        norm(r.physiologicalEffectSummary)
      )
  );
  const hasActiveCumulativeToxicity =
    lastCumulativeToxicOther >= 0 && elapsedSeconds - statInterventions[lastCumulativeToxicOther].elapsedSeconds <= 240;

  const hasUnreversedSedation =
    lastOpioidAdverse > lastNaloxone || lastBenzoAdverse > lastFlumazenil || lastMgAdverse > lastCalcium;
  const evaluatePhysiologicalSnapshot = (v: {
    sys: number;
    dia: number;
    hr: number;
    rr: number;
    temp: number;
    spo2: number;
    glasgow: number;
    glucose?: number;
  }) => {
    const hasActiveAdverseReaction =
      lastAdverseIdx >= 0 &&
      (hasUnreversedSedation ||
        hasUnreversedFluidOverload ||
        hasUnreversedHepatotoxicity ||
        hasActiveBleedIatrogeny ||
        hasActiveCumulativeToxicity ||
        (lastInsulinAdverseIdx >= 0 && lastDextroseIdx <= lastInsulinAdverseIdx) ||
        (!hasValidHemodynamicRescue && v.sys < hypotensionLimit) ||
        (!hasValidRespiratoryTx && v.spo2 < 92));

    const isHypotensive = v.sys < hypotensionLimit || (v.sys - v.dia <= 22 && v.sys < hypotensionLimit + 10);
    const isHypertensiveCrisis = v.sys >= 180 || v.dia >= 115;
    const isHypoxemic = v.spo2 < 92;
    const isSevereFever = v.temp >= 38.8;
    const isHypoglycemic = typeof v.glucose === 'number' && v.glucose < 70;
    const isSevereHypoglycemic = typeof v.glucose === 'number' && v.glucose < 54;
    const isSevereHyperglycemic = typeof v.glucose === 'number' && v.glucose >= 280;

    const activeAlerts: string[] = [];
    if (isSevereHypoglycemic) {
      activeAlerts.push(
        `¡EMERGENCIA METABÓLICA (Glucemia ${v.glucose} mg/dL)!: neuroglucopenia grave y riesgo letal inmediato; administrar Dextrosa IV urgente.`
      );
    } else if (isHypoglycemic) {
      activeAlerts.push('Hipoglucemia (< 70 mg/dL): riesgo neurológico agudo; corregir de inmediato.');
    }
    if (v.sys < criticalShockLimit) {
      activeAlerts.push(`¡CHOQUE CRÍTICO (PA ${v.sys}/${v.dia} mmHg)!: hipoperfusión cerebral/orgánica inminente.`);
    } else if (isHypotensive) {
      activeAlerts.push(`Hipotensión arterial para la edad (PAS < ${hypotensionLimit} mmHg): riesgo de hipoperfusión orgánica.`);
    }
    if (v.spo2 < 92) {
      activeAlerts.push('Hipoxemia (SpO₂ < 92%): requiere oxigenoterapia y soporte respiratorio inmediato.');
    }
    if (v.rr <= 9) {
      activeAlerts.push(`¡DEPRESIÓN VENTILATORIA CRÍTICA (FR ${v.rr} rpm)!: riesgo de apnea y paro respiratorio.`);
    } else if (v.rr >= tachypneaSevereLimit) {
      activeAlerts.push(`Taquipnea severa (FR ≥ ${tachypneaSevereLimit} rpm): riesgo de fatiga respiratoria.`);
    }
    if (v.hr >= tachySevereLimit) {
      activeAlerts.push(`¡TAQUIARRITMIA SEVERA (FC ${v.hr} lpm)!: alto riesgo de inestabilidad hemodinámica.`);
    } else if (v.hr >= tachyMarkedLimit) {
      activeAlerts.push(`Taquicardia marcada (FC ≥ ${tachyMarkedLimit} lpm): vigilar choque compensado, fiebre alta o arritmia.`);
    }
    if (v.hr <= Math.max(42, bounds.hrMin - 18)) {
      activeAlerts.push(`Bradicardia severa (FC ${v.hr} lpm): riesgo de bajo gasto o bloqueo AV de alto grado.`);
    }
    if (v.temp >= 39.2) {
      activeAlerts.push('Fiebre elevada (≥ 39.2°C): aumenta consumo metabólico y riesgo de deshidratación.');
    }
    if (isSevereHyperglycemic) {
      activeAlerts.push('Hiperglucemia severa (≥ 280 mg/dL): vigilar cetoacidosis o estado hiperosmolar.');
    }
    if (v.glasgow <= 9) {
      activeAlerts.unshift(
        `¡PACIENTE INCONSCIENTE (Glasgow ${v.glasgow}/15)!: pérdida del estado de alerta — no responde preguntas; proteja vía aérea y aplique rescate STAT.`
      );
    } else if (v.glasgow <= 12) {
      activeAlerts.push(`Compromiso neurológico significativo (Glasgow ${v.glasgow}/15): vigilar protección de vía aérea.`);
    } else if (v.glasgow <= 13 && v.glasgow < baselineVitals.glasgow) {
      activeAlerts.push(`Deterioro del estado de alerta (Glasgow ${v.glasgow}/15): vigilar progresión intracraneal o metabólica.`);
    }
    if (v.sys >= 180 || v.dia >= 115) {
      activeAlerts.push('Crisis hipertensiva (≥ 180/115 mmHg): descartar daño agudo a órgano blanco.');
    }
    if (hasUnreversedFluidOverload) {
      activeAlerts.push('Sobrecarga hídrica / edema pulmonar iatrogénico activo: suspender líquidos y valorar diurético IV.');
    }
    if (hasUnreversedHepatotoxicity) {
      activeAlerts.push('Hepatotoxicidad aguda por acumulación de Paracetamol: iniciar N-acetilcisteína STAT.');
    }
    if (hasActiveBleedIatrogeny) {
      activeAlerts.push('Riesgo activo de hemorragia iatrogénica por acumulación antitrombótica o de AINEs.');
    }
    if (hasActiveCumulativeToxicity) {
      activeAlerts.push('Toxicidad farmacológica acumulativa activa: vigilar arritmias, electrolitos y signos neurológicos.');
    }

    const hasAcuteCriticalState =
      v.sys < criticalShockLimit ||
      v.spo2 < 88 ||
      v.glasgow <= 11 ||
      v.rr <= 9 ||
      v.hr <= Math.max(42, bounds.hrMin - 20) ||
      v.hr >= tachySevereLimit ||
      isSevereHypoglycemic;

    const hasActivePathophysiologicDriver =
      isTrueAcuteEmergency ||
      hasActiveAdverseReaction ||
      hasAcuteCriticalState ||
      isHypotensive ||
      isHypoxemic ||
      isSevereFever ||
      isHypoglycemic ||
      isSevereHyperglycemic ||
      isHypertensiveCrisis;

    return {
      hasActiveAdverseReaction,
      isHypotensive,
      isHypertensiveCrisis,
      isHypoxemic,
      isSevereFever,
      isHypoglycemic,
      isSevereHypoglycemic,
      isSevereHyperglycemic,
      activeAlerts,
      hasAcuteCriticalState,
      hasActivePathophysiologicDriver,
    };
  };

  const preStep = evaluatePhysiologicalSnapshot({
    sys,
    dia,
    hr,
    rr,
    temp,
    spo2,
    glasgow,
    glucose,
  });

  const stepInterval = isCriticalCase || preStep.hasAcuteCriticalState ? 12 : 15;
  let changed = false;
  const shouldStep = forceRefresh || elapsedSeconds - lastEvaluatedSecond >= stepInterval;

  if (shouldStep) {
    const progressionReady = isCriticalCase ? elapsedSeconds >= 12 : elapsedSeconds >= 15;

    // FASE A: PROGRESIÓN FISIOPATOLÓGICA REAL CUANDO NO ESTÁ CONTROLADO EL DOMINIO ESPECÍFICO
    if (
      preStep.hasActivePathophysiologicDriver &&
      (progressionReady || preStep.hasAcuteCriticalState || preStep.hasActiveAdverseReaction)
    ) {
      // A1. Hemodinamia (Choque hipovolémico/distributivo/obstructivo vs Crisis HTA / HSA / Cushing / Tormenta Tiroidea)
      if (
        (isHypovolemicOrDistributive || isObstructiveShock || (preStep.isHypotensive && !isPanicOrAnxiety)) &&
        !hasValidHemodynamicRescue &&
        !isHemorrhagicStrokeOrIch &&
        !isIschemicStroke
      ) {
        const minSysFloor = isCriticalCase || preStep.isHypotensive ? 48 : Math.max(76, hypotensionLimit - 8);
        const nextSys = clamp(sys - (isCriticalCase ? 3 : 2), minSysFloor, 220);
        const nextDia = clamp(dia - (isCriticalCase ? 2 : 1), 26, Math.max(28, nextSys - 14));
        if (nextSys !== sys || nextDia !== dia) {
          sys = nextSys;
          dia = nextDia;
          changed = true;
        }
        if (isOrganophosphate && !hasValidRateControlTx) {
          // Efecto muscarínico colinérgico: bradicardia progresiva sin atropina
          const nextHr = clamp(hr - 2, 34, maxHrClamp);
          if (nextHr !== hr) {
            hr = nextHr;
            changed = true;
          }
        } else if (hr >= 52 && !hasValidRateControlTx) {
          const nextHr = clamp(hr + (isCriticalCase ? 3 : 2), 45, Math.min(maxHrClamp, 184));
          if (nextHr !== hr) {
            hr = nextHr;
            changed = true;
          }
        }
      } else if (
        (isHemorrhagicStrokeOrIch || isObstetricEclampsia || isPheochromocytoma || preStep.isHypertensiveCrisis) &&
        !hasValidBpControlTx &&
        !isIschemicStroke
      ) {
        // Reactividad presora hipertensiva real (HSA, Preeclampsia/Eclampsia, Feocromocitoma, Emergencia HTA)
        const maxSysCap = isPheochromocytoma || preStep.isHypertensiveCrisis ? 236 : Math.min(212, baseBP.sys + 16);
        const nextSys = clamp(sys + 2, 95, maxSysCap);
        const nextDia = clamp(dia + 1, 55, Math.min(138, nextSys - 22));
        if (nextSys !== sys || nextDia !== dia) {
          sys = nextSys;
          dia = nextDia;
          changed = true;
        }
        // Reflejo de Cushing en HIC / HSA / Meningitis si deterioro neurológico con HTA severa
        if ((isHemorrhagicStrokeOrIch || isMeningitis) && glasgow <= 10 && sys >= 165 && hr > 46) {
          hr = clamp(hr - 2, 42, maxHrClamp);
          changed = true;
        }
      } else if (isThyroidStorm || isSerotoninSyndrome) {
        if (!hasValidRateControlTx && hr < 178) {
          hr = clamp(hr + 3, 60, 178);
          changed = true;
        }
        if (!hasValidBpControlTx && sys < Math.min(205, baseBP.sys + 16)) {
          sys = clamp(sys + 2, 95, 205);
          changed = true;
        }
      } else if ((isAfibRvr || isTsvp || isVentricularTachycardia) && !hasValidRateControlTx && hr < maxHrClamp) {
        hr = clamp(hr + 2, 70, maxHrClamp);
        if (hr >= 165 && sys > 82) {
          sys = clamp(sys - 2, 74, 220);
          dia = clamp(dia - 1, 44, Math.max(46, sys - 14));
        }
        changed = true;
      } else if (isCompleteAvBlock && !hasValidRateControlTx && !hasValidHemodynamicRescue) {
        if (hr > 28) {
          hr = clamp(hr - 1, 28, maxHrClamp);
          changed = true;
        }
        if (sys > 62) {
          sys = clamp(sys - 2, 62, 220);
          dia = clamp(dia - 1, 34, Math.max(36, sys - 14));
          changed = true;
        }
      }

      // A1b. Progresión secundaria por hemorragia iatrogénica activa
      if (hasActiveBleedIatrogeny && sys > 58) {
        sys = clamp(sys - 2, 54, 220);
        dia = clamp(dia - 1, 30, Math.max(32, sys - 14));
        hr = clamp(hr + 2, 50, maxHrClamp);
        changed = true;
      }

      // A2. Ventilación y Oxigenación diferenciada por mecanismo fisiopatológico
      if (hasUnreversedSedation || isMyasthenicCrisis) {
        // Hipoventilación alveolar central o fatiga neuromuscular: CAE la FR y CAE la SpO₂
        const rrFloor = isMyasthenicCrisis ? 8 : 5;
        const nextRr = clamp(rr - 1, rrFloor, maxRrClamp);
        const nextSpo2 = clamp(spo2 - 1, 66, 100);
        if (nextRr !== rr || nextSpo2 !== spo2) {
          rr = nextRr;
          spo2 = nextSpo2;
          changed = true;
        }
      } else if (
        hasUnreversedFluidOverload ||
        (!isPanicOrAnxiety &&
          !hasValidRespiratoryTx &&
          (isHypoxemicRespiratoryEmergency || isAfibRvr || spo2 < 92))
      ) {
        const minSpo2Floor = isCriticalCase || preStep.isHypoxemic || hasUnreversedFluidOverload ? 66 : 88;
        const nextSpo2 = clamp(spo2 - 1, minSpo2Floor, 100);
        const nextRr = clamp(rr + 1, bounds.rrMin, Math.min(maxRrClamp, Math.max(baselineVitals.respiratoryRate + 8, 38)));
        if (nextSpo2 !== spo2 || nextRr !== rr) {
          spo2 = nextSpo2;
          rr = nextRr;
          changed = true;
        }
      } else if (isMetabolicAcidosisPathology && !hasValidInsulinTx && !hasValidHemodynamicRescue) {
        // Acidosis metabólica (CAD, Metanol): respiración de Kussmaul (taquipnea compensadora SIN hipoxemia primaria)
        if (rr < Math.min(36, baselineVitals.respiratoryRate + 6)) {
          rr = clamp(rr + 1, 12, 38);
          changed = true;
        }
      } else if (isCarbonMonoxide && !hasValidRespiratoryTx) {
        // CO: pulsioximetría SpO₂ suele seguir falsamente normal, pero aumentan FC/FR compensadoras
        if (hr < Math.min(148, baselineVitals.heartRate + 14)) {
          hr = clamp(hr + 2, 60, 155);
          changed = true;
        }
      }

      // A3. Termorregulación (Fiebre infecciosa / Tormenta tiroidea / Síndrome serotoninérgico sin antipirético)
      if (
        (preStep.isSevereFever || isThyroidStorm || isSerotoninSyndrome) &&
        !hasValidAntipyreticTx &&
        temp < (isThyroidStorm || isSerotoninSyndrome ? 40.9 : 40.2)
      ) {
        temp = Number(clamp(temp + 0.1, 35.0, 41.2).toFixed(1));
        changed = true;
      } else if (isMyxedemaComa && !hasValidHemodynamicRescue && temp > 33.8) {
        temp = Number(clamp(temp - 0.1, 33.8, 37.2).toFixed(1));
        if (hr > 34) hr = clamp(hr - 1, 34, maxHrClamp);
        if (rr > 7) rr = clamp(rr - 1, 7, maxRrClamp);
        changed = true;
      }

      // A4. Glucemia (Hipoglucemia / Crisis suprarrenal / Malaria vs Cetoacidosis sin Insulina)
      if (
        typeof glucose === 'number' &&
        !hasValidDextroseTx &&
        (preStep.isHypoglycemic || ((isAdrenalCrisis || isMalariaSevere) && !hasValidHemodynamicRescue && glucose < 92)) &&
        glucose > 14
      ) {
        glucose = clamp(glucose - 4, 12, 700);
        if (glucose < 50 && glasgow > 5) {
          glasgow = clamp(glasgow - 1, 3, 15);
        }
        changed = true;
      } else if (
        typeof glucose === 'number' &&
        isDkaOrHhs &&
        !hasValidInsulinTx &&
        glucose < 640
      ) {
        // Si ya hidrató con SSN sin insulina aún, la hemodilución frena el ascenso
        const rise = hasValidHydrationOnly ? 0 : 5;
        if (rise > 0) {
          glucose = clamp(glucose + rise, 12, 700);
          changed = true;
        }
      }

      // A5. Deterioro Neurológico (solo ante hipoperfusión crítica, hipoxia grave, CO, hipercapnia o injuria SNC)
      const activeNeuroThreat =
        sys < criticalShockLimit ||
        spo2 < 84 ||
        hasUnreversedSedation ||
        (isCarbonMonoxide && !hasValidRespiratoryTx && elapsedSeconds >= 45) ||
        ((isHemorrhagicStrokeOrIch || isMeningitis || isStatusEpilepticus || isObstetricEclampsia) &&
          !hasValidNeuroTx &&
          elapsedSeconds >= 60);

      if (activeNeuroThreat && glasgow > 5) {
        if (elapsedSeconds % 30 < stepInterval) {
          glasgow = clamp(glasgow - 1, 4, 15);
          changed = true;
        }
      }
    }

    // FASE B: CONSOLIDACIÓN GRADUAL DE MEJORÍA CUANDO EL DOMINIO FUE TRATADO ADECUADAMENTE
    if (!preStep.hasAcuteCriticalState || hasValidHemodynamicRescue || hasValidRespiratoryTx || hasValidDextroseTx || hasValidNeuroTx) {
      // B1. Recuperación hemodinámica (choque tratado o recuperación post-iatrogenia)
      if (hasValidHemodynamicRescue && sys < Math.max(106, hypotensionLimit + 10) && baseBP.sys < 140) {
        const targetRecoverySys = clamp(Math.max(112, baseBP.sys), hypotensionLimit + 8, 124);
        if (sys < targetRecoverySys) {
          sys = clamp(sys + 3, 60, targetRecoverySys);
          dia = clamp(dia + 2, 38, Math.min(78, sys - 18));
          changed = true;
        }
      }
      // B2. Control tensional progresivo tras antihipertensivos (respetando HTA permisiva en Ictus Isquémico)
      const safeBpFloor = isIschemicStroke ? 148 : Math.max(122, Math.round(baseBP.sys * 0.78));
      if (hasValidBpControlTx && sys > Math.max(138, safeBpFloor)) {
        sys = clamp(sys - 3, safeBpFloor, 230);
        dia = clamp(dia - 2, 70, 128);
        changed = true;
      }

      // B3. Consolidación de frecuencia cardíaca (taquiarritmias vs bradiarritmias)
      if (
        (hasValidRateControlTx || hasValidHemodynamicRescue || hasValidAntipyreticTx) &&
        hr > Math.max(88, bounds.hrMax - 4)
      ) {
        hr = clamp(hr - 3, Math.max(66, bounds.hrMin), maxHrClamp);
        changed = true;
      } else if (
        (hasValidRateControlTx || hasValidHemodynamicRescue) &&
        hr < bounds.hrMin
      ) {
        hr = clamp(hr + 3, 30, Math.max(66, bounds.hrMin + 4));
        changed = true;
      }

      // B4. Consolidación respiratoria y de SpO₂
      const spo2Target = isCopd ? 92 : 97;
      if (hasValidRespiratoryTx && spo2 < spo2Target) {
        spo2 = clamp(spo2 + 1, 70, spo2Target);
        changed = true;
      }
      if (hasValidRespiratoryTx && rr > bounds.rrMax) {
        rr = clamp(rr - 1, bounds.rrMin, maxRrClamp);
        changed = true;
      } else if (hasValidRespiratoryTx && rr < bounds.rrMin) {
        rr = clamp(rr + 1, 8, bounds.rrMin + 2);
        changed = true;
      }

      // B5. Consolidación térmica
      if ((hasValidAntipyreticTx || (hasValidHemodynamicRescue && temp >= 38.4)) && temp >= 37.5) {
        temp = Number(clamp(temp - 0.1, 36.5, 41.2).toFixed(1));
        changed = true;
      }

      // B6. Consolidación glucémica (descenso progresivo tras insulina en CAD/HHS o estabilización post-dextrosa)
      if (hasValidInsulinTx && typeof glucose === 'number' && glucose > 185) {
        glucose = clamp(glucose - 10, 160, 700);
        changed = true;
      } else if (hasValidDextroseTx && typeof glucose === 'number' && glucose < 88) {
        glucose = clamp(glucose + 6, 70, 115);
        changed = true;
      }

      // B7. Recuperación neurológica tras revertir causa amenazante
      if (
        hasValidNeuroTx &&
        !hasUnreversedSedation &&
        spo2 >= 91 &&
        sys >= hypotensionLimit &&
        (typeof glucose !== 'number' || glucose >= 70) &&
        glasgow < Math.min(15, baselineVitals.glasgow)
      ) {
        glasgow = clamp(glasgow + 1, 3, Math.min(15, baselineVitals.glasgow));
        changed = true;
      }
    }
  }

  // Re-medición fisiológica discreta al pulsar actualización manual
  if (forceRefresh && !changed) {
    const sysOsc = sys >= baseBP.sys ? -2 : 2;
    const diaOsc = dia >= baseBP.dia ? -1 : 1;
    const hrOsc = hr >= baselineVitals.heartRate ? -2 : 2;
    const nextSys = clamp(sys + sysOsc, Math.max(50, baseBP.sys - 4), Math.min(240, baseBP.sys + 4));
    const nextDia = clamp(dia + diaOsc, Math.max(28, baseBP.dia - 3), Math.min(140, baseBP.dia + 3));
    const nextHr = clamp(hr + hrOsc, Math.max(36, baselineVitals.heartRate - 4), Math.min(maxHrClamp, baselineVitals.heartRate + 4));
    if (nextSys !== sys || nextDia !== dia || nextHr !== hr) {
      sys = nextSys;
      dia = nextDia;
      hr = nextHr;
      changed = true;
    }
  }

  // Coherencia fisiológica estricta respetando edad pediátrica y rangos críticos reales
  sys = clamp(Math.round(sys), 45, 250);
  dia = clamp(Math.round(dia), 24, Math.min(150, Math.max(28, sys - 14)));
  hr = clamp(Math.round(hr), 28, Math.max(maxHrClamp, baselineVitals.heartRate));
  rr = clamp(Math.round(rr), 4, Math.max(maxRrClamp, baselineVitals.respiratoryRate));
  spo2 = clamp(Math.round(spo2), 60, 100);
  const minTempFloor = Math.min(34.5, baselineVitals.temperature);
  temp = Number(clamp(temp, minTempFloor, 41.5).toFixed(1));
  glasgow = clamp(Math.round(glasgow), 3, 15);
  if (typeof glucose === 'number') {
    glucose = clamp(Math.round(glucose), 12, 700);
  }

  // Evaluación post-paso para reflejar alertas y trayectoria en tiempo real sobre los signos actualizados
  const postStep = evaluatePhysiologicalSnapshot({
    sys,
    dia,
    hr,
    rr,
    temp,
    spo2,
    glasgow,
    glucose,
  });

  const anyStabilizingRescue =
    hasValidHemodynamicRescue ||
    hasValidRespiratoryTx ||
    hasValidBpControlTx ||
    hasValidRateControlTx ||
    hasValidInsulinTx ||
    hasValidDextroseTx ||
    hasValidNeuroTx ||
    (hasValidAntipyreticTx &&
      !isHypovolemicOrDistributive &&
      !isHypoxemicRespiratoryEmergency &&
      !postStep.isHypotensive &&
      !postStep.isHypoxemic);

  let trajectory: EvolutionTrajectory = 'estable';
  if (postStep.hasActiveAdverseReaction || postStep.hasAcuteCriticalState) {
    trajectory = 'critico';
  } else if (anyStabilizingRescue && postStep.activeAlerts.length <= 1) {
    trajectory = 'mejorando';
  } else if (postStep.activeAlerts.length > 0 && isTrueAcuteEmergency && !anyStabilizingRescue && elapsedSeconds >= 30) {
    trajectory = 'deterioro';
  }

  let summaryNote = 'Parámetros fisiológicos sin cambios agudos de alarma.';
  if (trajectory === 'critico') {
    summaryNote = 'Compromiso fisiológico crítico activo: priorice soporte ABCDE y estabilización/antídoto STAT.';
  } else if (trajectory === 'deterioro') {
    summaryNote = 'Tendencia progresiva al deterioro ante persistencia de inestabilidad sin estabilización dirigida.';
  } else if (trajectory === 'mejorando') {
    summaryNote = 'Respuesta clínica favorable tras las medidas de estabilización aplicadas.';
  } else if (postStep.isHypertensiveCrisis) {
    summaryNote = 'Cifras tensionales en rango crítico: vigilar síntomas neurológicos, torácicos y renales.';
  }

  const updatedVitals: VitalSigns = {
    ...currentVitals,
    bloodPressure: formatBP(sys, dia),
    heartRate: hr,
    respiratoryRate: rr,
    temperature: temp,
    oxygenSaturation: spo2,
    glasgow,
    bloodGlucose: glucose,
  };

  return {
    updatedVitals,
    evolutionState: {
      trajectory,
      activeAlerts: postStep.activeAlerts,
      lastEvaluatedSecond: shouldStep ? elapsedSeconds : lastEvaluatedSecond,
      summaryNote,
    },
    changed,
  };
}

/**
 * Muestreador fisiológico continuo en tiempo real (latido a latido / ciclo respiratorio).
 * Oscila de manera acotada y visible cada segundo alrededor de `anchorVitals` sin provocar deriva acumulativa ni falsas alarmas.
 */
export function sampleLiveMonitorTelemetry(params: {
  anchorVitals: VitalSigns;
  elapsedSeconds: number;
  caseId: string;
  trajectory?: EvolutionTrajectory;
  isDeceased?: boolean;
}): VitalSigns {
  const { anchorVitals, elapsedSeconds, caseId, trajectory = 'estable', isDeceased = false } = params;

  if (
    isDeceased ||
    anchorVitals.heartRate === 0 ||
    (anchorVitals.bloodPressure || '').startsWith('0/')
  ) {
    return anchorVitals;
  }

  let seed = 0;
  for (let i = 0; i < caseId.length; i++) {
    seed = (seed * 31 + caseId.charCodeAt(i)) % 997;
  }

  const stepIdx = Math.max(1, elapsedSeconds);
  const phase = stepIdx * 0.65 + seed * 0.13;
  const isUnstable = trajectory === 'critico' || trajectory === 'deterioro';

  const anchorBp = parseBP(anchorVitals.bloodPressure);
  const sysAmp = isUnstable ? 5 : 3;
  const diaAmp = isUnstable ? 3 : 2;
  const hrAmp = isUnstable ? 5 : 3;

  const waveA = Math.sin(phase * 1.17);
  const waveB = Math.cos(phase * 0.83 + 1.1);
  const waveC = Math.sin(phase * 0.61 + 2.3);
  const beatJitter = stepIdx % 2 === 0 ? 1 : -1;

  const rawSysShift = Math.round(waveA * sysAmp + beatJitter * 0.8);
  const sysShift = rawSysShift === 0 ? beatJitter : rawSysShift;
  const nextSys = clamp(
    anchorBp.sys + sysShift,
    Math.max(45, anchorBp.sys - sysAmp),
    Math.min(250, anchorBp.sys + sysAmp)
  );

  const rawDiaShift = Math.round(waveB * diaAmp);
  const diaShift = rawDiaShift === 0 && stepIdx % 3 !== 0 ? beatJitter : rawDiaShift;
  const nextDia = clamp(
    anchorBp.dia + diaShift,
    Math.max(24, anchorBp.dia - diaAmp),
    Math.min(150, Math.max(28, nextSys - 14))
  );

  const maxHrUpper = Math.max(195, anchorVitals.heartRate + hrAmp);
  const rawHrShift = Math.round(waveB * hrAmp + beatJitter);
  const hrShift = rawHrShift === 0 ? beatJitter : rawHrShift;
  const nextHr = clamp(
    anchorVitals.heartRate + hrShift,
    Math.max(28, anchorVitals.heartRate - hrAmp),
    Math.min(220, maxHrUpper)
  );

  // Variabilidad respiratoria respetando techos pediátricos (p. ej. lactante con 56 rpm)
  const rrCycle = [-1, 0, 1, 0, 1, -1, 0, 1][stepIdx % 8] * (isUnstable ? 2 : 1);
  const maxRrUpper = Math.max(48, anchorVitals.respiratoryRate + 4);
  const nextRr = clamp(anchorVitals.respiratoryRate + rrCycle, 4, Math.min(80, maxRrUpper));

  // Oximetría con micro-variación fisiológica acotada (nunca baja un basal sano debajo de 96%)
  const spo2Pattern = [0, 1, 0, -1, 0, 1][stepIdx % 6];
  let spo2Delta = spo2Pattern;
  if (anchorVitals.oxygenSaturation >= 97 && spo2Delta < 0) {
    spo2Delta = anchorVitals.oxygenSaturation === 100 ? -1 : 0;
  } else if (anchorVitals.oxygenSaturation === 96 && spo2Delta < 0) {
    spo2Delta = 0;
  } else if (anchorVitals.oxygenSaturation >= 99 && spo2Delta > 0) {
    spo2Delta = anchorVitals.oxygenSaturation === 100 ? 0 : 1;
  }
  const nextSpo2 = clamp(anchorVitals.oxygenSaturation + spo2Delta, 60, 100);

  // Variabilidad térmica discreta cada ~6-8s (+/- 0.1°C dentro de rango coherente)
  let nextTemp = anchorVitals.temperature;
  const tempCycle = [0, 0, 0.1, 0, 0, -0.1][stepIdx % 6];
  if (tempCycle !== 0) {
    const minT = anchorVitals.temperature >= 37.5 ? anchorVitals.temperature - 0.1 : 36.2;
    const maxT = anchorVitals.temperature < 37.5 ? 37.3 : 41.5;
    nextTemp = Number(clamp(anchorVitals.temperature + tempCycle, minT, maxT).toFixed(1));
  }

  const nextGlucose =
    typeof anchorVitals.bloodGlucose === 'number'
      ? clamp(
          Math.round(anchorVitals.bloodGlucose + Math.round(waveC * 3) + (stepIdx % 2 === 0 ? 1 : -1)),
          12,
          700
        )
      : undefined;

  return {
    ...anchorVitals,
    bloodPressure: formatBP(nextSys, nextDia),
    heartRate: nextHr,
    respiratoryRate: nextRr,
    oxygenSaturation: nextSpo2,
    temperature: nextTemp,
    bloodGlucose: nextGlucose,
  };
}
