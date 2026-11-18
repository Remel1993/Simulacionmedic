import {
  ClinicalCase,
  MedicationItem,
  StatEffectSeverity,
  StatInterventionRecord,
  StatVitalDelta,
  VitalSigns,
} from '../types/clinical';
import {
  detectPregnancyContext,
  detectRenalImpairmentContext,
} from './clinicalContext';

export interface StatPreset {
  id: string;
  category: 'Vía Aérea / O₂' | 'Hemodinamia / Líquidos' | 'Cardio / Crisis' | 'Metabólico / Síntomas';
  label: string;
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
}

export const STAT_QUICK_PRESETS: StatPreset[] = [
  {
    id: 'stat-o2',
    category: 'Vía Aérea / O₂',
    label: 'Oxígeno',
    drug: 'Oxígeno suplementario',
    dose: '6 L/min',
    route: 'Inhalatoria',
    frequency: 'Continuo STAT',
    duration: 'Hasta SpO₂ meta',
  },
  {
    id: 'stat-salbutamol',
    category: 'Vía Aérea / O₂',
    label: 'Salbutamol NBZ',
    drug: 'Salbutamol',
    dose: '5 mg',
    route: 'Inhalatoria',
    frequency: 'STAT nebulizado',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-corticoide',
    category: 'Vía Aérea / O₂',
    label: 'Hidrocortisona IV',
    drug: 'Hidrocortisona',
    dose: '200 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis única STAT',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-ssn',
    category: 'Hemodinamia / Líquidos',
    label: 'Bolo SSN 0.9%',
    drug: 'Solución Salina Normal 0.9%',
    dose: '500 mL',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo STAT',
    duration: 'Reanimación inicial',
  },
  {
    id: 'stat-adrenalina',
    category: 'Hemodinamia / Líquidos',
    label: 'Adrenalina IM',
    drug: 'Adrenalina (Epinefrina)',
    dose: '0.5 mg',
    route: 'Intramuscular (IM)',
    frequency: 'Dosis STAT muslo anterolateral',
    duration: 'Emergencia',
  },
  {
    id: 'stat-furosemida',
    category: 'Hemodinamia / Líquidos',
    label: 'Furosemida IV',
    drug: 'Furosemida',
    dose: '40 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento STAT',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-labetalol',
    category: 'Cardio / Crisis',
    label: 'Labetalol IV',
    drug: 'Labetalol',
    dose: '20 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento STAT',
    duration: 'Control crisis HTA',
  },
  {
    id: 'stat-hidralazina',
    category: 'Cardio / Crisis',
    label: 'Hidralazina IV',
    drug: 'Hidralazina',
    dose: '5 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento STAT',
    duration: 'Control crisis HTA',
  },
  {
    id: 'stat-ntg',
    category: 'Cardio / Crisis',
    label: 'Nitroglicerina SL',
    drug: 'Nitroglicerina',
    dose: '0.4 mg',
    route: 'Sublingual (SL)',
    frequency: 'STAT (valorar PA previa)',
    duration: 'Fase aguda',
  },
  {
    id: 'stat-asa',
    category: 'Cardio / Crisis',
    label: 'Aspirina (ASA)',
    drug: 'Ácido Acetilsalicílico (Aspirina)',
    dose: '300 mg',
    route: 'Oral (VO)',
    frequency: 'Dosis de carga masticable',
    duration: 'Dosis única inicial',
  },
  {
    id: 'stat-adenosina',
    category: 'Cardio / Crisis',
    label: 'Adenosina IV',
    drug: 'Adenosina',
    dose: '6 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo rápido STAT + flush 20 mL SSN',
    duration: 'Reversión TSVP',
  },
  {
    id: 'stat-atropina',
    category: 'Cardio / Crisis',
    label: 'Atropina IV',
    drug: 'Atropina',
    dose: '1 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo STAT',
    duration: 'Bradiarritmia sintomática',
  },
  {
    id: 'stat-amiodarona',
    category: 'Cardio / Crisis',
    label: 'Amiodarona IV',
    drug: 'Amiodarona',
    dose: '150 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Infusión STAT 10 min',
    duration: 'Control taquiarritmia',
  },
  {
    id: 'stat-dextrosa',
    category: 'Metabólico / Síntomas',
    label: 'Dextrosa 50% IV',
    drug: 'Dextrosa al 50%',
    dose: '25 g',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo STAT',
    duration: 'Corrección inmediata',
  },
  {
    id: 'stat-insulina',
    category: 'Metabólico / Síntomas',
    label: 'Insulina Cristalina IV',
    drug: 'Insulina Cristalina (Regular)',
    dose: '6 UI',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo / infusión STAT',
    duration: 'Control glucémico',
  },
  {
    id: 'stat-paracetamol',
    category: 'Metabólico / Síntomas',
    label: 'Paracetamol IV',
    drug: 'Paracetamol (Acetaminofén)',
    dose: '1000 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis STAT',
    duration: 'Control febril/dolor',
  },
  {
    id: 'stat-antiemetico',
    category: 'Metabólico / Síntomas',
    label: 'Ondansetrón IV',
    drug: 'Ondansetrón',
    dose: '4 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis STAT',
    duration: 'Control emético',
  },
  {
    id: 'stat-mgso4',
    category: 'Metabólico / Síntomas',
    label: 'Sulfato de Magnesio IV',
    drug: 'Sulfato de Magnesio',
    dose: '4 g',
    route: 'Intravenosa (IV)',
    frequency: 'Impregnación en 20 min',
    duration: 'Neuroprotección / broncodilatación',
  },
  {
    id: 'stat-benzodiazepina',
    category: 'Metabólico / Síntomas',
    label: 'Diazepam IV',
    drug: 'Diazepam',
    dose: '10 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Dosis STAT lenta',
    duration: 'Yugulación crisis',
  },
  {
    id: 'stat-naloxona',
    category: 'Metabólico / Síntomas',
    label: 'Naloxona IV',
    drug: 'Naloxona',
    dose: '0.4 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Rescate opioide STAT',
    duration: 'Reversión depresión SNC',
  },
  {
    id: 'stat-flumazenil',
    category: 'Metabólico / Síntomas',
    label: 'Flumazenil IV',
    drug: 'Flumazenil',
    dose: '0.2 mg',
    route: 'Intravenosa (IV)',
    frequency: 'Rescate benzodiacepina STAT',
    duration: 'Reversión sedación',
  },
  {
    id: 'stat-calcio',
    category: 'Cardio / Crisis',
    label: 'Gluconato de Calcio IV',
    drug: 'Gluconato de Calcio al 10%',
    dose: '1 g',
    route: 'Intravenosa (IV)',
    frequency: 'Bolo lento 3-5 min STAT',
    duration: 'Cardioprotección / hipermagnesemia',
  },
];

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
    sys: parseInt(match[1], 10),
    dia: parseInt(match[2], 10),
  };
}

function calcMAP(sys: number, dia: number): number {
  return Math.round(dia + (sys - dia) / 3);
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

export interface ParsedDose {
  mg: number | null;
  ml: number | null;
  ui: number | null;
  lpm: number | null;
  meq: number | null;
  puffs: number | null;
  percent: number | null;
  perKg: boolean;
}

/**
 * Normaliza separadores de miles ("1,000", "2,500") y decimales con coma ("0,5", "1,25")
 * sin destruir dosis en miles.
 */
function normalizeNumericSeparators(raw: string): string {
  let s = raw;
  // Quitar comas de miles reiteradas: 1,000,000 -> 1000000
  let prev = '';
  while (prev !== s) {
    prev = s;
    s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1$2');
  }
  // Comas decimales europeas/latinas: 0,5 -> 0.5 | 1,25 -> 1.25
  s = s.replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2');
  return s;
}

/**
 * Extrae dosis numéricas reales de cadenas como "100 UI", "1,000 mg", "1.5 L",
 * "50 mcg", "40 mEq", "0.1 UI/kg/h", "10 L/min", "2 disparos", etc.
 */
export function parseNumericDose(doseStr: string, weightKg: number): ParsedDose {
  const clean = normalizeNumericSeparators(norm(doseStr));
  const empty: ParsedDose = {
    mg: null,
    ml: null,
    ui: null,
    lpm: null,
    meq: null,
    puffs: null,
    percent: null,
    perKg: false,
  };

  if (!clean) return empty;

  const perKgGlobal = /\/\s*kg\b/.test(clean);

  const extractUnitValue = (unitPattern: string): number | null => {
    const regex = new RegExp(
      `(\\d+(?:\\.\\d+)?)\\s*(?:(?:-|–|\\ba\\b)\\s*(\\d+(?:\\.\\d+)?))?\\s*(?:${unitPattern})(?:\\s*\\/\\s*kg)?\\b`,
      'i'
    );
    const m = clean.match(regex);
    if (!m) return null;
    const v1 = parseFloat(m[1]);
    const v2 = m[2] ? parseFloat(m[2]) : null;
    if (Number.isNaN(v1) || v1 <= 0) return null;
    const rawVal = v2 && !Number.isNaN(v2) && v2 >= v1 ? (v1 + v2) / 2 : v1;
    const isThisPerKg = new RegExp(
      `(?:${unitPattern})\\s*\\/\\s*kg\\b`,
      'i'
    ).test(m[0]);
    return isThisPerKg ? rawVal * weightKg : rawVal;
  };

  const mcgVal = extractUnitValue('mcg|ug');
  const mgVal = extractUnitValue('mg');
  const gVal = extractUnitValue('g|gr|gramos?');
  const mlVal = extractUnitValue('ml|cc');
  const lpmVal = extractUnitValue('l\\s*\\/\\s*min|lpm|litros\\s*\\/\\s*min');
  const lVal = extractUnitValue('l|litros?');
  const uiVal = extractUnitValue('ui|u|unidades');
  const meqVal = extractUnitValue('meq|mmol');
  const puffsVal = extractUnitValue('puffs?|disparos?|inhalaciones?|atomizaciones?');
  const pctMatch = clean.match(/(\d+(?:\.\d+)?)\s*%/);
  const percent = pctMatch ? parseFloat(pctMatch[1]) : null;

  let mg: number | null = null;
  if (mgVal !== null) mg = mgVal;
  else if (gVal !== null) mg = gVal * 1000;
  else if (mcgVal !== null) mg = mcgVal / 1000;

  let ml: number | null = null;
  if (mlVal !== null) ml = mlVal;
  else if (lVal !== null && lpmVal === null) ml = lVal * 1000;

  const lpm = lpmVal ?? (lVal !== null ? lVal : null);

  if (
    mg !== null ||
    ml !== null ||
    uiVal !== null ||
    lpmVal !== null ||
    lVal !== null ||
    meqVal !== null ||
    puffsVal !== null
  ) {
    return {
      mg,
      ml,
      ui: uiVal,
      lpm,
      meq: meqVal,
      puffs: puffsVal,
      percent,
      perKg: perKgGlobal,
    };
  }

  // Sin unidad explícita (ej. el clínico escribió solo "100" o "20"): intentar número suelto
  const bareMatch = clean.match(/\b(\d+(?:\.\d+)?)\b/);
  if (bareMatch) {
    const rawVal = parseFloat(bareMatch[1]);
    if (!Number.isNaN(rawVal) && rawVal > 0 && percent === null) {
      const val = perKgGlobal ? rawVal * weightKg : rawVal;
      return {
        mg: val,
        ml: val,
        ui: val,
        lpm: val,
        meq: val,
        puffs: val,
        percent,
        perKg: perKgGlobal,
      };
    }
  }

  return { ...empty, percent };
}

function getEffectiveWeightKg(caseData: ClinicalCase, vitals: VitalSigns): number {
  if (vitals.weightKg && vitals.weightKg > 0) return vitals.weightKg;
  const age = caseData.patientInfo.age;
  if (age < 1) return 6;
  if (age < 12) return Math.max(8, age * 2 + 8);
  return 70;
}

function buildMetricDeltas(before: VitalSigns, after: VitalSigns): StatVitalDelta[] {
  const deltas: StatVitalDelta[] = [];
  const bpBefore = parseBP(before.bloodPressure);
  const bpAfter = parseBP(after.bloodPressure);

  if (bpBefore.sys !== bpAfter.sys || bpBefore.dia !== bpAfter.dia) {
    const sysDiff = bpAfter.sys - bpBefore.sys;
    const diaDiff = bpAfter.dia - bpBefore.dia;
    const signSys = sysDiff >= 0 ? `+${sysDiff}` : `${sysDiff}`;
    const signDia = diaDiff >= 0 ? `+${diaDiff}` : `${diaDiff}`;
    deltas.push({
      metric: 'PA',
      before: `${bpBefore.sys}/${bpBefore.dia}`,
      after: `${bpAfter.sys}/${bpAfter.dia} mmHg`,
      direction: sysDiff > 0 ? 'up' : sysDiff < 0 ? 'down' : 'neutral',
      deltaText: `${signSys}/${signDia} mmHg`,
    });
  }

  if (before.heartRate !== after.heartRate) {
    const diff = after.heartRate - before.heartRate;
    deltas.push({
      metric: 'FC',
      before: `${before.heartRate}`,
      after: `${after.heartRate} lpm`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} lpm`,
    });
  }

  if (before.respiratoryRate !== after.respiratoryRate) {
    const diff = after.respiratoryRate - before.respiratoryRate;
    deltas.push({
      metric: 'FR',
      before: `${before.respiratoryRate}`,
      after: `${after.respiratoryRate} rpm`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} rpm`,
    });
  }

  if (Math.abs(before.temperature - after.temperature) >= 0.05) {
    const diff = Number((after.temperature - before.temperature).toFixed(1));
    deltas.push({
      metric: 'Temp',
      before: `${before.temperature.toFixed(1)}`,
      after: `${after.temperature.toFixed(1)} °C`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff.toFixed(1)} °C`,
    });
  }

  if (before.oxygenSaturation !== after.oxygenSaturation) {
    const diff = after.oxygenSaturation - before.oxygenSaturation;
    deltas.push({
      metric: 'SpO₂',
      before: `${before.oxygenSaturation}%`,
      after: `${after.oxygenSaturation}%`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff}%`,
    });
  }

  if (
    typeof before.bloodGlucose === 'number' &&
    typeof after.bloodGlucose === 'number' &&
    before.bloodGlucose !== after.bloodGlucose
  ) {
    const diff = after.bloodGlucose - before.bloodGlucose;
    deltas.push({
      metric: 'Glucemia',
      before: `${before.bloodGlucose}`,
      after: `${after.bloodGlucose} mg/dL`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} mg/dL`,
    });
  }

  if (before.glasgow !== after.glasgow) {
    const diff = after.glasgow - before.glasgow;
    deltas.push({
      metric: 'Glasgow',
      before: `${before.glasgow}/15`,
      after: `${after.glasgow}/15`,
      direction: diff > 0 ? 'up' : 'down',
      deltaText: `${diff > 0 ? '+' : ''}${diff} pts`,
    });
  }

  return deltas;
}

export interface StatApplyInput {
  presetId?: string;
  label?: string;
  drug: string;
  dose?: string;
  route?: string;
  frequency?: string;
  duration?: string;
}

export interface StatApplyOutcome {
  updatedVitals: VitalSigns;
  record: StatInterventionRecord;
  medicationItem: MedicationItem;
  isImmediateDeath: boolean;
  immediateDeathReason?: string;
}

interface CaseClinicalFlags {
  diagNorm: string;
  fullCaseNorm: string;
  bgMedsNorm: string;
  allergiesNorm: string;
  ageYears: number;
  isPediatric: boolean;
  isUnder18: boolean;
  isUnder8: boolean;
  isPregnant: boolean;
  isViablePregnancy: boolean;
  isThirdTrimester: boolean;
  isRenalImpairment: boolean;
  isAcuteKidneyInjury: boolean;
  weightKg: number;
  isDengue: boolean;
  isActiveBleed: boolean;
  isHemorrhagicStroke: boolean;
  isEctopicRuptured: boolean;
  isRenalFailureOrHyperK: boolean;
  isHyperkalemia: boolean;
  isObstructiveAirway: boolean;
  isCopd: boolean;
  isAnaphylaxis: boolean;
  isPulmonaryEdemaOrFluidOverload: boolean;
  isInferiorStemi: boolean;
  isIschemicChestPain: boolean;
  isSeizureOrEclampsia: boolean;
  isBowelObstruction: boolean;
  isOrganophosphate: boolean;
  isAlcoholWithdrawal: boolean;
  isMyasthenia: boolean;
  isThyroidStorm: boolean;
  isPheochromocytoma: boolean;
  isPorphyria: boolean;
  isCarbonMonoxide: boolean;
  isPreloadDependentShock: boolean;
  isIschemicStroke: boolean;
  usesPde5: boolean;
  isSepsisOrBacterialEmergency: boolean;
  isMeningitis: boolean;
  isDkaOrHhs: boolean;
  isHypoglycemia: boolean;
  isSerotoninSyndrome: boolean;
  isMyxedemaComa: boolean;
  isAdrenalCrisis: boolean;
  isMethanol: boolean;
  isAcetaminophenTox: boolean;
  isAcutePulmonaryEmbolism: boolean;
  isPneumothorax: boolean;
  isTamponade: boolean;
  isAorticDissection: boolean;
  isPreeclampsiaOrEclampsia: boolean;
  isNeurologicEmergency: boolean;
  isStatusEpilepticus: boolean;
  isTakotsuboOrQtcRisk: boolean;
  isAvBlock: boolean;
  isInfranodalAvBlock: boolean;
  isVentricularTachycardia: boolean;
  isSvt: boolean;
  isAfibRvr: boolean;
  isArrhythmiaTachy: boolean;
  isParkinson: boolean;
  isGlaucoma: boolean;
  isUrinaryRetention: boolean;
  isSeverePainEmergency: boolean;
  isColicOrSpasm: boolean;
  isPeritonealOrSurgicalAbdomen: boolean;
  isGiUlcerOrBleedOrGerd: boolean;
  isNauseaVertigoPrimary: boolean;
  isPanicOrSympathomimetic: boolean;
  isEndocrineHyperthermia: boolean;
  isMalariaSevere: boolean;
  isHerpeticKeratitis: boolean;
  isTinea: boolean;
  isSepticArthritis: boolean;
  isTrueShock: boolean;
  isTrueHypertensiveEmergency: boolean;
}

function extractCaseClinicalFlags(caseData: ClinicalCase, vitals: VitalSigns): CaseClinicalFlags {
  const diagNorm = norm(caseData.solution.correctDiagnosis || '');
  const fullCaseNorm = norm(
    `${caseData.solution.correctDiagnosis} ${caseData.solution.pathophysiology} ${caseData.patientInfo.consultReason} ${caseData.patientInfo.currentIllness}`
  );
  const bgMedsNorm = norm(
    `${(caseData.background.currentMedications || []).join(' ')} ${(caseData.background.pathological || []).join(' ')} ${caseData.patientInfo.currentIllness}`
  );
  const allergiesNorm = norm((caseData.background.allergies || []).join(' '));
  const ageYears = caseData.patientInfo.age;
  const isPediatric = ageYears < 12;
  const isUnder18 = ageYears < 18;
  const isUnder8 = ageYears < 8;
  const preg = detectPregnancyContext(caseData, { publicOnly: false });
  const renal = detectRenalImpairmentContext(caseData);
  const weightKg = getEffectiveWeightKg(caseData, vitals);
  const bp = parseBP(vitals.bloodPressure);

  const isDengue = diagNorm.includes('dengue') || fullCaseNorm.includes('dengue');
  const isHemorrhagicStroke =
    diagNorm.includes('hemorragia subaracnoidea') ||
    diagNorm.includes('ictus hemorragico') ||
    diagNorm.includes('hemorragia intracerebral') ||
    fullCaseNorm.includes('ictus hemorragico');
  const isEctopicRuptured = diagNorm.includes('ectopico') && (diagNorm.includes('roto') || fullCaseNorm.includes('hemoperitoneo'));
  const isAorticDissection = diagNorm.includes('diseccion aortica');
  const isActiveBleed =
    diagNorm.includes('hemorragia digestiva') ||
    diagNorm.includes('ulcera peptica') ||
    diagNorm.includes('purpura trombocitopenica') ||
    diagNorm.includes('epistaxis') ||
    isHemorrhagicStroke ||
    isEctopicRuptured ||
    fullCaseNorm.includes('hematemesis') ||
    fullCaseNorm.includes('melena');
  const isHyperkalemia =
    fullCaseNorm.includes('hiperpotasemia') ||
    fullCaseNorm.includes('hiperkalemia') ||
    diagNorm.includes('lesion renal') ||
    diagNorm.includes('insuficiencia renal');
  const isRenalFailureOrHyperK =
    isHyperkalemia || renal.hasRenalImpairment || diagNorm.includes('renal') || fullCaseNorm.includes('rabdomiolisis');
  const isObstructiveAirway =
    diagNorm.includes('asma') ||
    diagNorm.includes('epoc') ||
    diagNorm.includes('bronquiolitis') ||
    diagNorm.includes('broncoespasmo') ||
    diagNorm.includes('crup') ||
    diagNorm.includes('anafilax');
  const isCopd = diagNorm.includes('epoc') || diagNorm.includes('enfisema') || bgMedsNorm.includes('epoc');
  const isAnaphylaxis = diagNorm.includes('anafilax');
  const isPulmonaryEdemaOrFluidOverload =
    /edema agudo.*pulmon|insuficiencia cardiaca.*descompensada|sobrecarga hidrica/.test(diagNorm);
  const isInferiorStemi =
    (diagNorm.includes('infarto') || diagNorm.includes('iamcest')) &&
    (fullCaseNorm.includes('inferior') || fullCaseNorm.includes('ventriculo derecho'));
  const isIschemicChestPain =
    diagNorm.includes('infarto') ||
    diagNorm.includes('angina') ||
    diagNorm.includes('sindrome coronario') ||
    diagNorm.includes('iamcest') ||
    diagNorm.includes('iamsest') ||
    diagNorm.includes('scasest') ||
    diagNorm.includes('takotsubo');
  const isPreeclampsiaOrEclampsia = diagNorm.includes('preeclampsia') || diagNorm.includes('eclampsia');
  const isStatusEpilepticus =
    diagNorm.includes('estatus epileptico') || diagNorm.includes('status epileptico') || diagNorm.includes('convuls');
  const isSeizureOrEclampsia = isStatusEpilepticus || isPreeclampsiaOrEclampsia;
  const isBowelObstruction =
    diagNorm.includes('obstruccion intestinal') ||
    diagNorm.includes('invaginacion') ||
    diagNorm.includes('apendicitis') ||
    diagNorm.includes('perforacion');
  const isOrganophosphate =
    diagNorm.includes('organofosforad') ||
    diagNorm.includes('colinergico') ||
    fullCaseNorm.includes('organofosforad');
  const isAlcoholWithdrawal =
    diagNorm.includes('delirium tremens') || diagNorm.includes('abstinencia alcoholica');
  const isMyasthenia =
    diagNorm.includes('miastenia') ||
    diagNorm.includes('miastenica') ||
    diagNorm.includes('guillain-barre') ||
    diagNorm.includes('guillain barre');
  const isThyroidStorm = diagNorm.includes('tormenta tiroidea') || diagNorm.includes('crisis tirotoxica');
  const isSerotoninSyndrome = diagNorm.includes('serotoninergico');
  const isPheochromocytoma = diagNorm.includes('feocromocitoma');
  const isPorphyria = diagNorm.includes('porfiria');
  const isCarbonMonoxide = diagNorm.includes('monoxido de carbono');
  const isAcutePulmonaryEmbolism = /tromboembolia pulmonar|\btep\b/.test(diagNorm);
  const isPneumothorax = diagNorm.includes('neumotorax');
  const isTamponade = diagNorm.includes('taponamiento cardiaco');
  const isPreloadDependentShock = isInferiorStemi || isTamponade || isAcutePulmonaryEmbolism;
  const isIschemicStroke =
    diagNorm.includes('ictus isquemico') || diagNorm.includes('evento vascular cerebral isquemico');
  const usesPde5 = /\b(sildenafil|tadalafil|vardenafil|viagra|cialis)\b/.test(bgMedsNorm);

  const isMeningitis = diagNorm.includes('meningitis');
  const isSepticArthritis = diagNorm.includes('artritis septica');
  const isSepsisOrBacterialEmergency =
    /sepsis|choque septico|shock septico|colangitis|pielonefritis|neutropenia febril|neumonia.*grave|endocarditis|absceso|fascitis necrosante|urosepsis/.test(
      diagNorm
    ) ||
    isMeningitis ||
    isSepticArthritis;
  const isDkaOrHhs = /cetoacidosis|estado hiperosmolar/.test(diagNorm);
  const isHypoglycemia = /hipoglucemia|coma hipoglucemico|neuroglucopenia/.test(diagNorm);
  const isMyxedemaComa = diagNorm.includes('coma mixedematoso');
  const isAdrenalCrisis = /crisis suprarrenal|insuficiencia adrenal/.test(diagNorm);
  const isMethanol = diagNorm.includes('metanol');
  const isAcetaminophenTox = /intoxicacion.*paracetamol|intoxicacion.*acetaminofen|sobredosis.*paracetamol/.test(
    diagNorm
  );
  const isNeurologicEmergency =
    isHemorrhagicStroke ||
    isIschemicStroke ||
    isMeningitis ||
    isStatusEpilepticus ||
    diagNorm.includes('delirium') ||
    diagNorm.includes('encefalopatia') ||
    diagNorm.includes('arteritis de celulas gigantes');
  const isTakotsuboOrQtcRisk =
    diagNorm.includes('takotsubo') ||
    diagNorm.includes('intoxicacion por litio') ||
    /\bqt largo\b|\bqtc prolongad|\btorsades\b/.test(fullCaseNorm);
  const isAvBlock =
    diagNorm.includes('bloqueo auriculoventricular') ||
    diagNorm.includes('bloqueo av') ||
    diagNorm.includes('bloqueo bifascicular') ||
    diagNorm.includes('mobitz') ||
    diagNorm.includes('wenckebach');
  const isInfranodalAvBlock =
    isAvBlock &&
    /completo|tercer grado|3er grado|mobitz ii|segundo grado tipo ii|bifascicular/.test(fullCaseNorm);
  const isVentricularTachycardia = diagNorm.includes('taquicardia ventricular');
  const isSvt = /\b(supraventricular|tsvp|tpsv|reentrada nodal)\b/.test(diagNorm);
  const isAfibRvr = /fibrilacion auricular/.test(diagNorm);
  const isArrhythmiaTachy = isVentricularTachycardia || isSvt || isAfibRvr;
  const isParkinson = diagNorm.includes('parkinson') || bgMedsNorm.includes('parkinson') || bgMedsNorm.includes('levodopa');
  const isGlaucoma = diagNorm.includes('glaucoma');
  const isUrinaryRetention = diagNorm.includes('retencion aguda de orina') || diagNorm.includes('hiperplasia prostatica');
  const isPeritonealOrSurgicalAbdomen =
    isBowelObstruction ||
    diagNorm.includes('colecistitis') ||
    diagNorm.includes('colangitis') ||
    diagNorm.includes('pancreatitis') ||
    isEctopicRuptured ||
    diagNorm.includes('torsion testicular') ||
    diagNorm.includes('isquemia mesenterica');
  const isColicOrSpasm =
    /colico biliar|colico renal|nefritico|litiasis|dismenorrea|intestino irritable/.test(diagNorm) &&
    !isPeritonealOrSurgicalAbdomen;
  const isSeverePainEmergency =
    isAorticDissection ||
    diagNorm.includes('pancreatitis') ||
    diagNorm.includes('compartimental') ||
    diagNorm.includes('torsion testicular') ||
    diagNorm.includes('fractura') ||
    diagNorm.includes('isquemia aguda') ||
    diagNorm.includes('stevens-johnson') ||
    diagNorm.includes('stevens johnson') ||
    diagNorm.includes('arteritis de celulas gigantes') ||
    isColicOrSpasm;
  const isGiUlcerOrBleedOrGerd =
    diagNorm.includes('hemorragia digestiva') ||
    diagNorm.includes('ulcera peptica') ||
    diagNorm.includes('gastritis') ||
    diagNorm.includes('reflujo gastroesofagico') ||
    diagNorm.includes('erge');
  const isNauseaVertigoPrimary =
    /vertigo|hiperemesis|gastroenteritis|migran|cinetosis/.test(diagNorm) || isGiUlcerOrBleedOrGerd;
  const isPanicOrSympathomimetic =
    /ataque de panico|trastorno de panico|ansiedad|cocaina|anfetamina|simpaticomimet/.test(diagNorm);
  const isEndocrineHyperthermia = isThyroidStorm || isSerotoninSyndrome;
  const isMalariaSevere = /paludismo|malaria/.test(diagNorm);
  const isHerpeticKeratitis = diagNorm.includes('queratitis herpetica');
  const isTinea = diagNorm.includes('tina') || diagNorm.includes('tinea') || diagNorm.includes('dermatofitosis');

  const isTrueShock =
    bp.sys < 95 ||
    (!isPanicOrSympathomimetic &&
      !isArrhythmiaTachy &&
      !isHemorrhagicStroke &&
      !isIschemicStroke &&
      !isPreeclampsiaOrEclampsia &&
      (/choque|shock|sepsis|cetoacidosis|estado hiperosmolar|deshidrat|hemorragia digestiva|ectopico/.test(
        diagNorm
      ) ||
        isDengue ||
        isAdrenalCrisis ||
        isAnaphylaxis ||
        isMalariaSevere ||
        isMyxedemaComa));

  const isTrueHypertensiveEmergency =
    bp.sys >= 180 ||
    bp.dia >= 115 ||
    isPreeclampsiaOrEclampsia ||
    isAorticDissection ||
    isPheochromocytoma ||
    isHemorrhagicStroke ||
    diagNorm.includes('emergencia hipertensiva');

  return {
    diagNorm,
    fullCaseNorm,
    bgMedsNorm,
    allergiesNorm,
    ageYears,
    isPediatric,
    isUnder18,
    isUnder8,
    isPregnant: preg.isPregnant,
    isViablePregnancy: preg.isViablePregnancy,
    isThirdTrimester: preg.isThirdTrimester,
    isRenalImpairment: renal.hasRenalImpairment,
    isAcuteKidneyInjury: renal.isAcuteKidneyInjury,
    weightKg,
    isDengue,
    isActiveBleed,
    isHemorrhagicStroke,
    isEctopicRuptured,
    isRenalFailureOrHyperK,
    isHyperkalemia,
    isObstructiveAirway,
    isCopd,
    isAnaphylaxis,
    isPulmonaryEdemaOrFluidOverload,
    isInferiorStemi,
    isIschemicChestPain,
    isSeizureOrEclampsia,
    isBowelObstruction,
    isOrganophosphate,
    isAlcoholWithdrawal,
    isMyasthenia,
    isThyroidStorm,
    isPheochromocytoma,
    isPorphyria,
    isCarbonMonoxide,
    isPreloadDependentShock,
    isIschemicStroke,
    usesPde5,
    isSepsisOrBacterialEmergency,
    isMeningitis,
    isDkaOrHhs,
    isHypoglycemia,
    isSerotoninSyndrome,
    isMyxedemaComa,
    isAdrenalCrisis,
    isMethanol,
    isAcetaminophenTox,
    isAcutePulmonaryEmbolism,
    isPneumothorax,
    isTamponade,
    isAorticDissection,
    isPreeclampsiaOrEclampsia,
    isNeurologicEmergency,
    isStatusEpilepticus,
    isTakotsuboOrQtcRisk,
    isAvBlock,
    isInfranodalAvBlock,
    isVentricularTachycardia,
    isSvt,
    isAfibRvr,
    isArrhythmiaTachy,
    isParkinson,
    isGlaucoma,
    isUrinaryRetention,
    isSeverePainEmergency,
    isColicOrSpasm,
    isPeritonealOrSurgicalAbdomen,
    isGiUlcerOrBleedOrGerd,
    isNauseaVertigoPrimary,
    isPanicOrSympathomimetic,
    isEndocrineHyperthermia,
    isMalariaSevere,
    isHerpeticKeratitis,
    isTinea,
    isSepticArthritis,
    isTrueShock,
    isTrueHypertensiveEmergency,
  };
}

function getCumulativePriorDoses(
  previousHistory: StatInterventionRecord[],
  weightKg: number,
  matcher: RegExp
): { mg: number; ml: number; ui: number; meq: number; count: number } {
  let mg = 0;
  let ml = 0;
  let ui = 0;
  let meq = 0;
  let count = 0;
  for (const rec of previousHistory) {
    const recText = norm(`${rec.drug} ${rec.label} ${rec.presetId || ''}`);
    if (!matcher.test(recText)) continue;
    count += 1;
    const p = parseNumericDose(rec.dose || '', weightKg);
    if (p.mg) mg += p.mg;
    if (p.ml) ml += p.ml;
    if (p.ui) ui += p.ui;
    if (p.meq) meq += p.meq;
  }
  return { mg, ml, ui, meq, count };
}

function resolvePrimaryAntihypertensiveDrug(drugNorm: string, doseNorm: string): string {
  const candidates = [
    'labetalol',
    'hidralazina',
    'nitroprusiato',
    'nifedipin',
    'nicardipin',
    'enalaprilat',
    'enalapril',
    'amlodipino',
    'captopril',
    'losartan',
    'esmolol',
    'propranolol',
    'metoprolol',
    'atenolol',
  ];
  // Si la dosis nombra explícitamente uno de los fármacos de la fila, priorizar ese fármaco
  let bestDoseIdx = Infinity;
  let bestDoseDrug = '';
  for (const cand of candidates) {
    if (!drugNorm.includes(cand)) continue;
    const idx = doseNorm.search(new RegExp(`\\b${cand}`));
    if (idx >= 0 && idx < bestDoseIdx) {
      bestDoseIdx = idx;
      bestDoseDrug = cand;
    }
  }
  if (bestDoseDrug) return bestDoseDrug;

  // Sino, tomar el fármaco primario listado primero (antes de alternativas entre paréntesis o "o")
  const primarySegment = drugNorm.replace(/\(\s*(?:o|u)\s+[^)]+\)/g, ' ');
  let bestDrugIdx = Infinity;
  let bestDrug = '';
  for (const cand of candidates) {
    const idx = primarySegment.search(new RegExp(`\\b${cand}`));
    if (idx >= 0 && idx < bestDrugIdx) {
      bestDrugIdx = idx;
      bestDrug = cand;
    }
  }
  return bestDrug || drugNorm;
}

function getAntihypertensiveEquivUnits(
  drugNorm: string,
  parsed: ParsedDose,
  doseNorm = '',
  routeNorm = ''
): number {
  const primary = resolvePrimaryAntihypertensiveDrug(drugNorm, doseNorm);
  const isOralPrimary =
    /\b(vo|via oral|oral)\b/.test(doseNorm) ||
    (/\boral\b/.test(routeNorm) && !/\b(iv|intravenosa)\b/.test(doseNorm));

  if (primary.includes('labetalol')) {
    return isOralPrimary ? (parsed.mg ?? 200) / 200 : (parsed.mg ?? 20) / 20;
  }
  if (primary.includes('hidralazina')) {
    return isOralPrimary ? (parsed.mg ?? 25) / 25 : (parsed.mg ?? 5) / 5;
  }
  if (primary.includes('nitroprusiato')) return (parsed.mg ?? 0.05) / 0.05;
  if (primary.includes('nifedipin')) return ((parsed.mg ?? 10) / 10) * 1.2;
  if (primary.includes('nicardipin')) return (parsed.mg ?? 5) / 5;
  if (primary.includes('enalaprilat')) return (parsed.mg ?? 1.25) / 1.25;
  if (primary.includes('enalapril') || primary.includes('amlodipino')) return (parsed.mg ?? 10) / 10;
  if (primary.includes('captopril')) return (parsed.mg ?? 25) / 25;
  if (primary.includes('losartan')) return (parsed.mg ?? 50) / 50;
  if (primary.includes('esmolol')) return (parsed.mg ?? 35) / 35;
  if (primary.includes('propranolol')) {
    return isOralPrimary ? (parsed.mg ?? 40) / 40 : (parsed.mg ?? 2) / 2;
  }
  if (primary.includes('metoprolol')) {
    return isOralPrimary ? (parsed.mg ?? 50) / 50 : (parsed.mg ?? 5) / 5;
  }
  if (primary.includes('atenolol')) {
    return isOralPrimary ? (parsed.mg ?? 50) / 50 : (parsed.mg ?? 5) / 5;
  }
  return (parsed.mg ?? 10) / 10;
}

function getNsaidEquivUnits(drugNorm: string, parsed: ParsedDose): number {
  if (drugNorm.includes('ketorolaco')) return (parsed.mg ?? 30) / 30;
  if (drugNorm.includes('diclofenaco')) return (parsed.mg ?? 75) / 75;
  if (drugNorm.includes('ibuprofeno')) return (parsed.mg ?? 600) / 600;
  if (drugNorm.includes('naproxeno')) return (parsed.mg ?? 500) / 500;
  if (drugNorm.includes('indometacina')) return (parsed.mg ?? 50) / 50;
  if (drugNorm.includes('meloxicam')) return (parsed.mg ?? 15) / 15;
  if (drugNorm.includes('piroxicam')) return (parsed.mg ?? 20) / 20;
  if (drugNorm.includes('celecoxib')) return (parsed.mg ?? 200) / 200;
  return 1.0;
}

interface CumulativePharmacologyState {
  unreversedOpioidMeq: number;
  unreversedBenzoDeq: number;
  propofolMg: number;
  sedatingAdjunctCount: number;
  unreversedMgGrams: number;
  ahtEquivUnits: number;
  nsaidEquivUnits: number;
  hydrocortisoneEquivMg: number;
  kclMeq: number;
  nitrateMg: number;
  pressorMg: number;
  pressorCount: number;
  o2Count: number;
  o2Lpm: number;
  adrNonInhaledMg: number;
  adrNonInhaledCount: number;
  adrInhaledMg: number;
  furoMg: number;
  furoCount: number;
  dextroseGrams: number;
  asaMg: number;
  paracetamolMg: number;
  metamizolMg: number;
  metamizolCount: number;
  ondansetronMg: number;
  metoclopramidaMg: number;
  metoclopramidaCount: number;
  dimenhidrinatoMg: number;
  dimenhidrinatoCount: number;
  atropinaMg: number;
  calciumMg: number;
  naloxonaMg: number;
  flumazenilMg: number;
  amiodaronaMg: number;
  lidocainaMg: number;
  digoxinaMg: number;
  adenosinaMg: number;
  adenosinaCount: number;
  heparinaUi: number;
  enoxaparinaMg: number;
  lyticMg: number;
  verapamiloMg: number;
  diltiazemMg: number;
  haloperidolMg: number;
  ketaminaMg: number;
  ketaminaCount: number;
  fenitoinaMg: number;
  bicarbMeq: number;
  manitolGrams: number;
  kSparingMg: number;
  kSparingCount: number;
  antihistamineCount: number;
  difenhidraminaMg: number;
  aminoglycCount: number;
  vancoMg: number;
  butilhioscinaMg: number;
  butilhioscinaCount: number;
  antibioticCount: number;
}

function computeCumulativePharmacology(
  previousHistory: StatInterventionRecord[],
  weightKg: number
): CumulativePharmacologyState {
  const state: CumulativePharmacologyState = {
    unreversedOpioidMeq: 0,
    unreversedBenzoDeq: 0,
    propofolMg: 0,
    sedatingAdjunctCount: 0,
    unreversedMgGrams: 0,
    ahtEquivUnits: 0,
    nsaidEquivUnits: 0,
    hydrocortisoneEquivMg: 0,
    kclMeq: 0,
    nitrateMg: 0,
    pressorMg: 0,
    pressorCount: 0,
    o2Count: 0,
    o2Lpm: 0,
    adrNonInhaledMg: 0,
    adrNonInhaledCount: 0,
    adrInhaledMg: 0,
    furoMg: 0,
    furoCount: 0,
    dextroseGrams: 0,
    asaMg: 0,
    paracetamolMg: 0,
    metamizolMg: 0,
    metamizolCount: 0,
    ondansetronMg: 0,
    metoclopramidaMg: 0,
    metoclopramidaCount: 0,
    dimenhidrinatoMg: 0,
    dimenhidrinatoCount: 0,
    atropinaMg: 0,
    calciumMg: 0,
    naloxonaMg: 0,
    flumazenilMg: 0,
    amiodaronaMg: 0,
    lidocainaMg: 0,
    digoxinaMg: 0,
    adenosinaMg: 0,
    adenosinaCount: 0,
    heparinaUi: 0,
    enoxaparinaMg: 0,
    lyticMg: 0,
    verapamiloMg: 0,
    diltiazemMg: 0,
    haloperidolMg: 0,
    ketaminaMg: 0,
    ketaminaCount: 0,
    fenitoinaMg: 0,
    bicarbMeq: 0,
    manitolGrams: 0,
    kSparingMg: 0,
    kSparingCount: 0,
    antihistamineCount: 0,
    difenhidraminaMg: 0,
    aminoglycCount: 0,
    vancoMg: 0,
    butilhioscinaMg: 0,
    butilhioscinaCount: 0,
    antibioticCount: 0,
  };

  for (const rec of previousHistory) {
    const dNorm = norm(`${rec.drug} ${rec.label} ${rec.presetId || ''}`);
    const rNorm = norm(rec.route || '');
    const doseN = norm(rec.dose || '');
    const p = parseNumericDose(rec.dose || '', weightKg);
    const isInh =
      rNorm.includes('inhalat') || rNorm.includes('nebuliz') || doseN.includes('nebuliz') || dNorm.includes('nebuliz');

    if (/\b(cloruro de potasio|kcl|potasio)\b/.test(dNorm) && !dNorm.includes('losartan')) {
      state.kclMeq += p.meq ?? (p.mg ? p.mg / 74.5 : 20);
    } else if (
      /\b(labetalol|hidralazina|nifedipin|nitroprusiato|nicardipin|enalaprilat|enalapril|antihipertensiv|losartan|captopril|amlodipino|esmolol|metoprolol|atenolol|propranolol)\b/.test(
        dNorm
      )
    ) {
      state.ahtEquivUnits += getAntihypertensiveEquivUnits(dNorm, p);
    } else if (/\b(nitroglicerina|nitrat|isosorbide)\b/.test(dNorm)) {
      state.nitrateMg += p.mg ?? 0.4;
    } else if (/\b(norepinefrina|noradrenalina|dopamina|dobutamina|vasopresina)\b/.test(dNorm)) {
      state.pressorMg += p.mg ?? 0.02;
      state.pressorCount += 1;
    } else if (/\b(oxigeno|o2|mascarilla|canula)\b/.test(dNorm)) {
      state.o2Count += 1;
      state.o2Lpm += p.lpm ?? (p.percent ? Math.round((p.percent - 21) / 4) : 6);
    } else if (/\b(adrenalina|epinefrina)\b/.test(dNorm)) {
      if (isInh) state.adrInhaledMg += p.mg ?? 3;
      else {
        state.adrNonInhaledMg += p.mg ?? 0.5;
        state.adrNonInhaledCount += 1;
      }
    } else if (/\b(furosemida|diuretico)\b/.test(dNorm)) {
      state.furoMg += p.mg ?? 40;
      state.furoCount += 1;
    } else if (/\b(dextrosa|glucosa|glucosada|mixta)\b/.test(dNorm)) {
      let g = p.mg ? p.mg / 1000 : 25;
      if (!p.mg && p.ml) {
        const pct = p.percent ?? (dNorm.includes('50') ? 50 : dNorm.includes('10') ? 10 : 5);
        g = (p.ml * pct) / 100;
      }
      state.dextroseGrams += g;
    } else if (/\b(morfina|fentanilo|tramadol|meperidina|oxicodona)\b/.test(dNorm)) {
      if (dNorm.includes('fentanilo')) state.unreversedOpioidMeq += (p.mg ?? 0.05) * 100;
      else if (dNorm.includes('tramadol')) state.unreversedOpioidMeq += (p.mg ?? 50) * 0.1;
      else state.unreversedOpioidMeq += p.mg ?? 4;
    } else if (/\b(diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/.test(dNorm)) {
      if (dNorm.includes('lorazepam')) state.unreversedBenzoDeq += (p.mg ?? 2) * 5;
      else if (dNorm.includes('midazolam')) state.unreversedBenzoDeq += (p.mg ?? 3) * 3.33;
      else if (dNorm.includes('clonazepam')) state.unreversedBenzoDeq += (p.mg ?? 1) * 10;
      else state.unreversedBenzoDeq += p.mg ?? 10;
    } else if (dNorm.includes('propofol')) {
      state.propofolMg += p.mg ?? 100;
    } else if (dNorm.includes('naloxona')) {
      state.naloxonaMg += p.mg ?? 0.4;
      state.unreversedOpioidMeq = Math.max(0, state.unreversedOpioidMeq - (p.mg ?? 0.4) * 25);
    } else if (dNorm.includes('flumazenil')) {
      state.flumazenilMg += p.mg ?? 0.2;
      state.unreversedBenzoDeq = Math.max(0, state.unreversedBenzoDeq - (p.mg ?? 0.2) * 100);
    } else if (/\b(sulfato de magnesio|magnesio|mgso4)\b/.test(dNorm)) {
      state.unreversedMgGrams += p.mg ? p.mg / 1000 : 4;
    } else if (/\b(gluconato de calcio|cloruro de calcio)\b/.test(dNorm)) {
      const mg = p.mg ?? 1000;
      state.calciumMg += mg;
      state.unreversedMgGrams = Math.max(0, state.unreversedMgGrams - (mg / 1000) * 6);
    } else if (/\b(aspirina|acetilsalicilico|acido acetilsalicilico|aas|asa)\b/.test(dNorm)) {
      state.asaMg += p.mg ?? 300;
    } else if (/\b(paracetamol|acetaminofen|antipiret)\b/.test(dNorm)) {
      state.paracetamolMg += p.mg ?? 1000;
    } else if (/\b(metamizol|dipirona)\b/.test(dNorm)) {
      state.metamizolMg += p.mg ?? 1000;
      state.metamizolCount += 1;
    } else if (
      /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|piroxicam|indometacina|meloxicam|celecoxib)\b/.test(dNorm)
    ) {
      state.nsaidEquivUnits += getNsaidEquivUnits(dNorm, p);
    } else if (dNorm.includes('ondansetron')) {
      state.ondansetronMg += p.mg ?? 4;
    } else if (dNorm.includes('metoclopramida')) {
      state.metoclopramidaMg += p.mg ?? 10;
      state.metoclopramidaCount += 1;
    } else if (dNorm.includes('dimenhidrinato')) {
      state.dimenhidrinatoMg += p.mg ?? 50;
      state.dimenhidrinatoCount += 1;
      state.sedatingAdjunctCount += 1;
    } else if (/\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|prednisolona|corticoide|esteroide)\b/.test(dNorm)) {
      const raw = p.mg ?? (dNorm.includes('dexametasona') ? 8 : dNorm.includes('metilprednisolona') ? 80 : 100);
      state.hydrocortisoneEquivMg += dNorm.includes('dexametasona')
        ? raw * 25
        : dNorm.includes('metilprednisolona')
          ? raw * 5
          : raw;
    } else if (dNorm.includes('atropina')) {
      state.atropinaMg += p.mg ?? 1;
    } else if (dNorm.includes('amiodarona')) {
      state.amiodaronaMg += p.mg ?? 150;
    } else if (dNorm.includes('lidocaina')) {
      state.lidocainaMg += p.mg ?? 100;
    } else if (dNorm.includes('digoxina')) {
      state.digoxinaMg += p.mg ?? 0.25;
    } else if (dNorm.includes('adenosina')) {
      state.adenosinaMg += p.mg ?? 6;
      state.adenosinaCount += 1;
    } else if (dNorm.includes('heparina')) {
      state.heparinaUi += p.ui ?? 5000;
    } else if (dNorm.includes('enoxaparina')) {
      state.enoxaparinaMg += p.mg ?? 40;
    } else if (/\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(dNorm)) {
      state.lyticMg += p.mg ?? 50;
    } else if (dNorm.includes('verapamilo')) {
      state.verapamiloMg += p.mg ?? 5;
    } else if (dNorm.includes('diltiazem')) {
      state.diltiazemMg += p.mg ?? 15;
    } else if (dNorm.includes('haloperidol')) {
      state.haloperidolMg += p.mg ?? 5;
      state.sedatingAdjunctCount += 1;
    } else if (dNorm.includes('ketamina')) {
      state.ketaminaMg += p.mg ?? 50;
      state.ketaminaCount += 1;
    } else if (dNorm.includes('fenitoina')) {
      state.fenitoinaMg += p.mg ?? 500;
    } else if (/\b(bicarbonato|nahco3)\b/.test(dNorm)) {
      state.bicarbMeq += p.meq ?? (p.mg ? p.mg / 84 : 50);
    } else if (dNorm.includes('manitol')) {
      state.manitolGrams += p.mg ? p.mg / 1000 : 50;
    } else if (/\b(espironolactona|amilorida)\b/.test(dNorm)) {
      state.kSparingMg += p.mg ?? 50;
      state.kSparingCount += 1;
    } else if (/\b(clorfeniramina|difenhidramina|loratadina|cetirizina)\b/.test(dNorm)) {
      state.antihistamineCount += 1;
      if (dNorm.includes('difenhidramina')) state.difenhidraminaMg += p.mg ?? 50;
      if (/\b(clorfeniramina|difenhidramina)\b/.test(dNorm)) state.sedatingAdjunctCount += 1;
    } else if (/\b(butilhioscina|buscapina)\b/.test(dNorm)) {
      state.butilhioscinaMg += p.mg ?? 20;
      state.butilhioscinaCount += 1;
    } else if (
      /\b(ceftriaxona|ampicilina|amoxicilina|azitromicina|levofloxacino|meropenem|vancomicina|clindamicina|metronidazol|piperacilina|gentamicina|amikacina)\b/.test(
        dNorm
      )
    ) {
      state.antibioticCount += 1;
      if (/\b(gentamicina|amikacina)\b/.test(dNorm)) state.aminoglycCount += 1;
      if (dNorm.includes('vancomicina')) state.vancoMg += p.mg ?? 1000;
    }
  }

  return state;
}

export function summarizeDrugSessionAccumulation(
  drugInput: string,
  previousHistory: StatInterventionRecord[],
  weightKg = 70
): { count: number; totalLabel: string } | null {
  const query = norm(drugInput);
  if (!query || query.length < 3 || previousHistory.length === 0) return null;
  const matches = previousHistory.filter((rec) => {
    const r = norm(`${rec.drug} ${rec.label}`);
    return r === query || r.includes(query) || query.includes(norm(rec.drug));
  });
  if (matches.length === 0) return null;

  let mg = 0;
  let ml = 0;
  let ui = 0;
  let meq = 0;
  for (const m of matches) {
    const p = parseNumericDose(m.dose || '', weightKg);
    if (p.mg) mg += p.mg;
    if (p.ml) ml += p.ml;
    if (p.ui) ui += p.ui;
    if (p.meq) meq += p.meq;
  }

  const parts: string[] = [];
  if (mg > 0) parts.push(`${Number(mg.toFixed(2))} mg`);
  if (ml > 0) parts.push(`${Math.round(ml)} mL`);
  if (ui > 0) parts.push(`${Math.round(ui)} UI`);
  if (meq > 0) parts.push(`${Math.round(meq)} mEq`);

  return {
    count: matches.length,
    totalLabel: parts.length > 0 ? parts.join(' · ') : `${matches.length} dosis`,
  };
}

export function applyStatIntervention(
  currentVitals: VitalSigns,
  _baselineVitals: VitalSigns,
  caseData: ClinicalCase,
  input: StatApplyInput,
  previousHistory: StatInterventionRecord[],
  elapsedSeconds: number
): StatApplyOutcome {
  const cleanDrug = input.drug.trim();
  const cleanDose = (input.dose || '').trim() || 'Dosis STAT estándar';
  const cleanRoute = (input.route || '').trim() || 'Intravenosa (IV)';
  const label = (input.label || cleanDrug).trim();

  const drugNorm = norm(`${cleanDrug} ${label} ${input.presetId || ''}`);
  const doseNorm = norm(cleanDose);
  const freqNorm = norm(`${input.frequency || ''} ${input.duration || ''}`);
  const routeNorm = norm(cleanRoute);

  const flags = extractCaseClinicalFlags(caseData, currentVitals);
  const {
    diagNorm: strictDiagNorm,
    fullCaseNorm: diagNorm,
    allergiesNorm,
    isPediatric,
    weightKg,
    isDengue,
    isActiveBleed,
    isHemorrhagicStroke,
    isRenalFailureOrHyperK,
    isHyperkalemia,
    isObstructiveAirway,
    isCopd,
    isAnaphylaxis,
    isPulmonaryEdemaOrFluidOverload,
    isInferiorStemi,
    isIschemicChestPain,
    isSeizureOrEclampsia,
    isBowelObstruction,
    isOrganophosphate,
    isAlcoholWithdrawal,
    isMyasthenia,
    isThyroidStorm,
    isSerotoninSyndrome,
    isMyxedemaComa,
    isAdrenalCrisis,
    isMethanol,
    isAcetaminophenTox,
    isAcutePulmonaryEmbolism,
    isAorticDissection,
    isPreeclampsiaOrEclampsia,
    isNeurologicEmergency,
    isStatusEpilepticus,
    isTakotsuboOrQtcRisk,
    isAvBlock,
    isInfranodalAvBlock,
    isVentricularTachycardia,
    isSvt,
    isAfibRvr,
    isArrhythmiaTachy,
    isParkinson,
    isGlaucoma,
    isUrinaryRetention,
    isSeverePainEmergency,
    isColicOrSpasm,
    isPeritonealOrSurgicalAbdomen,
    isGiUlcerOrBleedOrGerd,
    isNauseaVertigoPrimary,
    isPanicOrSympathomimetic,
    isEndocrineHyperthermia,
    isMalariaSevere,
    isHerpeticKeratitis,
    isTinea,
    isSepticArthritis,
    isSepsisOrBacterialEmergency,
    isMeningitis,
    isDkaOrHhs,
    isHypoglycemia,
    isPheochromocytoma,
    isPorphyria,
    isCarbonMonoxide,
    isPreloadDependentShock,
    isIschemicStroke,
    usesPde5,
    isTrueShock,
    isTrueHypertensiveEmergency,
  } = flags;

  const parsedDose = parseNumericDose(cleanDose, weightKg);

  const bp = parseBP(currentVitals.bloodPressure);
  const mapBefore = calcMAP(bp.sys, bp.dia);
  let sys = bp.sys;
  let dia = bp.dia;
  let hr = currentVitals.heartRate;
  let rr = currentVitals.respiratoryRate;
  let temp = currentVitals.temperature;
  let spo2 = currentVitals.oxygenSaturation;
  let glasgow = currentVitals.glasgow;
  let glucose = currentVitals.bloodGlucose;

  const isIV = routeNorm.includes('intravenosa') || /\biv\b/.test(routeNorm);
  const isIM = routeNorm.includes('intramuscular') || /\bim\b/.test(routeNorm);
  const isInhaled =
    routeNorm.includes('inhalat') ||
    routeNorm.includes('nebuliz') ||
    doseNorm.includes('nebuliz') ||
    drugNorm.includes('nebuliz');

  const cum = computeCumulativePharmacology(previousHistory, weightKg);

  const sameDrugCount = previousHistory.filter(
    (item) =>
      (input.presetId && item.presetId === input.presetId) ||
      norm(item.drug) === norm(cleanDrug)
  ).length;

  let effectSeverity: StatEffectSeverity = 'mejoria';
  let summary = '';
  let patientFeelingNote = '';
  let isImmediateDeath = false;
  let immediateDeathReason: string | undefined = undefined;

  const isAllergicToPenicillin =
    allergiesNorm.includes('penicilin') || allergiesNorm.includes('betalactam');
  const isAllergicToSulfa = allergiesNorm.includes('sulfa') || allergiesNorm.includes('trimetoprim');
  const isAllergicToAine =
    allergiesNorm.includes('aine') || allergiesNorm.includes('aspirina') || allergiesNorm.includes('ibuprofeno');

  const isPenicillinDrug =
    /\b(penicilina|amoxicilina|ampicilina|piperacilina|oxacilina|dicloxacilina|amoxiclav)\b/.test(drugNorm);
  const isSulfaDrug = /\b(sulfa|trimetoprim|cotrimoxazol|bactrim)\b/.test(drugNorm);
  const isAsaDrug = /\b(aspirina|acetilsalicilico|acido acetilsalicilico|aas|asa)\b/.test(drugNorm);
  const isNsaidDrug =
    /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|metamizol|dipirona|piroxicam|indometacina|meloxicam|celecoxib)\b/.test(
      drugNorm
    );

  // Choque / hipovolemia estrictos (no confundir taquicardia sinusal/TSVP/ansiedad/asma con choque hipovolémico)
  const isShockOrHypovolemic = isTrueShock;
  const isHypertensiveCrisis = isTrueHypertensiveEmergency;

  // 1. CONTRAINDICACIONES INMUNOLÓGICAS / PATOLÓGICAS ABSOLUTAS
  if (
    (isAllergicToPenicillin && isPenicillinDrug) ||
    (isAllergicToSulfa && isSulfaDrug) ||
    (isAllergicToAine && (isNsaidDrug || isAsaDrug))
  ) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 30, 48, 220);
    dia = clamp(dia - 18, 28, 130);
    hr = clamp(hr + 30, 50, 182);
    rr = clamp(rr + 8, 12, 46);
    spo2 = clamp(spo2 - 9, 66, 100);
    glasgow = clamp(glasgow - (sys < 75 ? 6 : 3), 5, 15);
    if (bp.sys < 90 || sameDrugCount >= 1 || sys <= 54 || spo2 <= 72) {
      isImmediateDeath = true;
      immediateDeathReason = `Choque anafiláctico fulminante y edema laríngeo asfíctico por administrar ${cleanDrug} en paciente con alergia documentada e inestabilidad hemodinámica.`;
      summary = `Muerte inmediata por anafilaxia fulminante tras ${cleanDrug} en paciente alérgico.`;
    } else {
      summary =
        'Reacción anafiláctica / hipersensibilidad inmediata tras administrar fármaco con alergia registrada: caída brusca de PA, taquicardia compensadora y desaturación.';
    }
    patientFeelingNote = isPediatric
      ? '¡Doctor, mi niño se empezó a brotar todo, está respirando muy agitado y se puso pálido justo después de ese medicamento!'
      : '¡Doctor, me picó la garganta de golpe, me falta el aire y siento que me voy a desmayar después de que me pusieron ese medicamento!';
  } else if ((isDengue || isActiveBleed) && (isNsaidDrug || isAsaDrug)) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 18, 56, 220);
    dia = clamp(dia - 10, 35, 130);
    hr = clamp(hr + 18, 50, 178);
    if (sys < 85) glasgow = clamp(glasgow - 2, 6, 15);
    summary = isDengue
      ? 'Hemorragia / deterioro hemodinámico grave tras AINE o salicilato en Dengue: disfunción plaquetaria y riesgo de choque hemorrágico fatal.'
      : 'Agravamiento de hemorragia digestiva / sangrado activo por AINE o Ácido Acetilsalicílico: aumenta sangrado e inestabilidad hemodinámica.';
    patientFeelingNote = isPediatric
      ? 'Doctor, después de esa medicina mi niño siguió con más dolor en la pancita y se ve más pálido y frío.'
      : '¡Doctor, me empezó un ardor horrible en el estómago, náuseas con sangre y mucho mareo después de eso!';
  } else if (isAsaDrug && isPediatric) {
    effectSeverity = 'reaccion_adversa';
    summary =
      'Contraindicación pediátrica de Ácido Acetilsalicílico (riesgo de Síndrome de Reye en menores de 12 años con enfermedad febril/viral).';
    patientFeelingNote = 'Doctor, ¿seguro que esa aspirina es adecuada para un niño pequeño?';
  } else if (isRenalFailureOrHyperK && isNsaidDrug) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 8, 65, 220);
    summary =
      'Nefrotoxicidad aguda por AINE en paciente con Lesión Renal Aguda: vasoconstricción de arteriola aferente, caída adicional de TFG y empeoramiento de hiperpotasemia.';
    patientFeelingNote = 'Me duele un poco la espalda baja y sigo sintiéndome muy decaído, doctor.';
  } else if (
    (isActiveBleed || isDengue) &&
    /\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban|clopidogrel|ticagrelor)\b/.test(
      drugNorm
    )
  ) {
    const isFibrinolytic = /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(drugNorm);
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 36, 48, 220);
    dia = clamp(dia - 20, 30, 130);
    hr = clamp(hr + 34, 50, 185);
    rr = clamp(rr + 6, 12, 42);
    spo2 = clamp(spo2 - 5, 70, 100);
    glasgow = sys < 80 ? clamp(glasgow - 6, 5, 9) : clamp(glasgow - 4, 6, 11);
    if (isFibrinolytic || (/\b(heparina|enoxaparina)\b/.test(drugNorm) && bp.sys < 90)) {
      isImmediateDeath = true;
      immediateDeathReason = `Exanguinación catastrófica irreversible e hipovolemia refractaria tras administrar ${cleanDrug} (${cleanDose}) en paciente con sangrado activo o contraindicación hemorrágica absoluta.`;
      summary = `Muerte inmediata por exanguinación catastrófica tras ${cleanDrug} en hemorragia activa.`;
    } else {
      summary = `Hemorragia catastrófica iatrogénica tras administrar ${cleanDrug} en paciente con sangrado activo / contraindicación hemorrágica absoluta: choque hipovolémico agudo y riesgo letal inmediato.`;
    }
    patientFeelingNote =
      '[Alerta crítica: sangrado masivo súbito, palidez extrema, diaforesis y deterioro brusco de conciencia tras anticoagulante/fibrinolítico]';
  } else if (
    isObstructiveAirway &&
    /\b(propranolol|nadolol|timolol|carvedilol|labetalol|sotalol|betabloqueador)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    spo2 = clamp(spo2 - 8, 68, 100);
    rr = clamp(rr + 7, 12, 46);
    hr = clamp(hr - 18, 36, 170);
    if (drugNorm.includes('labetalol')) {
      const labMg = parsedDose.mg ?? 20;
      sys = clamp(sys - Math.round(18 + labMg * 0.6), 52, 220);
      dia = clamp(dia - Math.round(10 + labMg * 0.35), 32, 130);
    }
    summary =
      'Broncoespasmo severo paradójico por bloqueo beta-2 no selectivo en paciente con hiperreactividad bronquial / asma / EPOC: caída de SpO₂ e incremento de taquipnea.';
    patientFeelingNote = isPediatric
      ? '¡Doctor, mi hijo empezó a silbar muchísimo del pecho y le cuesta mucho más meter aire!'
      : '¡Doctor, se me cerró el pecho de golpe y siento que me ahogo después de esa dosis!';
  } else if (
    isBowelObstruction &&
    /\b(metoclopramida|domperidona|loperamida)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 18, 55, 175);
    sys = clamp(sys - 10, 65, 220);
    summary = `Empeoramiento clínico por ${cleanDrug} en obstrucción intestinal / abdomen agudo quirúrgico: riesgo grave de perforación de víscera hueca o megacolon.`;
    patientFeelingNote =
      '¡Ay, doctor! Con esa medicina me empezaron unos retorcijones terribles y el dolor de panza se volvió insoportable.';
  } else if (isThyroidStorm && isAsaDrug) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 16, 65, 185);
    temp = Number(clamp(temp + 0.4, 36.5, 41.3).toFixed(1));
    summary = `Contraindicación clásica en Tormenta Tiroidea: Ácido Acetilsalicílico (${cleanDrug}) desplaza hormonas tiroideas de la TBG sérica, incrementando T4 libre, hipertermia y taquiarritmia.`;
    patientFeelingNote =
      'Doctor, siento más calor todavía, el corazón mucho más acelerado y mucha agitación después de esa aspirina.';
  } else if (
    isMyasthenia &&
    /\b(sulfato de magnesio|magnesio|mgso4|gentamicina|amikacina|tobramicina|diazepam|lorazepam|midazolam|clonazepam|propranolol|metoprolol|atenolol|labetalol)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    rr = clamp(rr - 6, 6, 36);
    spo2 = clamp(spo2 - 9, 68, 100);
    glasgow = clamp(glasgow - 4, 6, 15);
    summary = `EMPEORAMIENTO DE CRISIS MIASTÉNICA por ${cleanDrug}: bloqueo adicional de la unión neuromuscular / depresión respiratoria con caída de fuerza ventilatoria (FR ${rr} rpm, SpO₂ ${spo2}%).`;
    patientFeelingNote =
      '¡Doctor... siento los párpados caídos por completo, no puedo tragar y se me acaba el aire para respirar!';
  } else if (
    isPorphyria &&
    /\b(metamizol|dipirona|fenitoina|carbamazepina|valproico|metoclopramida|sulfametoxazol|trimetoprim|rifampicina)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 18, 55, 175);
    sys = clamp(sys + 16, 70, 225);
    glasgow = clamp(glasgow - 2, 7, 15);
    summary = `Fármaco porfirinogénico contraindicado (${cleanDrug}) en Porfiria Aguda Intermitente: induce ALA-sintasa hepática y agrava el dolor abdominal neurovisceral y la neuropatía.`;
    patientFeelingNote =
      '¡Doctor, me dio un cólico abdominal mucho más atroz, debilidad en los brazos y confusión después de esa medicina!';
  } else if (
    isAorticDissection &&
    (isAsaDrug ||
      /\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban|clopidogrel|ticagrelor)\b/.test(
        drugNorm
      ))
  ) {
    const isFibrinolytic = /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(drugNorm);
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 42, 46, 220);
    dia = clamp(dia - 24, 28, 130);
    hr = clamp(hr + 36, 55, 188);
    glasgow = clamp(glasgow - 6, 4, 9);
    if (isFibrinolytic || /\b(heparina|enoxaparina)\b/.test(drugNorm)) {
      isImmediateDeath = true;
      immediateDeathReason = `Rotura aórtica catastrófica y taponamiento pericárdico fulminante tras administrar ${cleanDrug} en Disección Aórtica Aguda (contraindicación absoluta de trombólisis y anticoagulación).`;
      summary = `Muerte inmediata por rotura aórtica / hemopericardio masivo tras ${cleanDrug} en Disección Aórtica Aguda.`;
    } else {
      summary = `¡ERROR CRÍTICO!: Antiagregante (${cleanDrug}) en Disección Aórtica Aguda aumenta el riesgo de extensión del hematoma intramural, rotura aórtica y sangrado quirúrgico.`;
    }
    patientFeelingNote =
      '[Alerta crítica: dolor torácico desgarrante súbito, diaforesis profusa y colapso hemodinámico tras antitrombótico en disección aórtica]';
  } else if (
    isGlaucoma &&
    /\b(atropina|tropicamida|ciclopentolato|fenilefrina|escopolamina|butilhioscina|hioscina|ipratropio|dimenhidrinato|difenhidramina|clorfeniramina)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 12, 55, 170);
    sys = clamp(sys + 10, 80, 225);
    summary = `¡ERROR CRÍTICO OFTALMOLÓGICO!: Anticolinérgico / midriático (${cleanDrug}) en Glaucoma Agudo de Ángulo Cerrado agrava el bloqueo pupilar, eleva críticamente la presión intraocular y precipita ceguera irreversible.`;
    patientFeelingNote =
      '¡Doctor, el ojo me late con un dolor muchísimo más atroz, veo halos y se me nubló por completo la vista!';
  } else if (
    isUrinaryRetention &&
    /\b(furosemida|bumetanida|butilhioscina|buscapina|hioscina|atropina|escopolamina|oxibutinina|tolterodina|dimenhidrinato|difenhidramina)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys + 12, 75, 225);
    hr = clamp(hr + 14, 55, 175);
    summary = `¡ERROR CRÍTICO UROLÓGICO!: ${cleanDrug} en Retención Aguda de Orina agrava la atonía del detrusor (anticolinérgico) o la sobredistensión vesical (diurético de asa) con riesgo de hidronefrosis y dolor intenso.`;
    patientFeelingNote =
      '¡Doctor, siento la vejiga a punto de reventar y todavía más dolor en el bajo vientre después de esa medicina!';
  } else if (
    isSerotoninSyndrome &&
    /\b(sertralina|fluoxetina|paroxetina|citalopram|escitalopram|venlafaxina|tramadol|fentanilo|dextrometorfano|linezolid|haloperidol|ondansetron|metoclopramida|litio)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    temp = Number(clamp(temp + 0.6, 36.5, 41.6).toFixed(1));
    hr = clamp(hr + 22, 60, 188);
    sys = clamp(sys + 18, 70, 235);
    glasgow = clamp(glasgow - 2, 6, 15);
    summary = `¡AGRAVAMIENTO DE TOXICIDAD SEROTONINÉRGICA!: ${cleanDrug} potencia la actividad serotoninérgica/extrapiramidal y empeora hipertermia (${temp.toFixed(1)} °C), clonus e inestabilidad autonómica.`;
    patientFeelingNote =
      '¡Doctor, me tiemblan muchísimo más las piernas, estoy empapado en sudor y más agitado!';
  } else if (
    isParkinson &&
    /\b(metoclopramida|haloperidol|clorpromazina|risperidona)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 10, 50, 170);
    summary = `¡ERROR NEUROLÓGICO!: Antagonista dopaminérgico central (${cleanDrug}) en Enfermedad de Parkinson desencadena rigidez severa aguda, acinesia y empeoramiento motor grave (usar Ondansetrón o Domperidona periférica).`;
    patientFeelingNote =
      '¡Doctor, me quedé completamente rígido y no puedo mover los brazos ni hablar bien!';
  } else if (
    isTakotsuboOrQtcRisk &&
    /\b(ondansetron|haloperidol|amiodarona|sotalol|claritromicina|azitromicina|levofloxacino|moxifloxacino|metoclopramida|litio)\b/.test(
      drugNorm
    ) &&
    !isVentricularTachycardia
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 24, 55, 185);
    sys = clamp(sys - 12, 62, 220);
    summary = `¡RIESGO ARRÍTMICO DE QTc PROLONGADO!: ${cleanDrug} prolonga adicionalmente la repolarización ventricular y eleva el riesgo de Torsades de Pointes en este cuadro.`;
    patientFeelingNote =
      '¡Doctor, siento vuelcos y pausas muy raras en el corazón con mareo intenso!';
  } else if (
    isAvBlock &&
    /\b(verapamilo|diltiazem|digoxina|metoprolol|propranolol|atenolol|esmolol|labetalol|carvedilol|bisoprolol|amiodarona|adenosina)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr - 18, 24, 150);
    sys = clamp(sys - 24, 48, 220);
    dia = clamp(dia - 14, 28, 130);
    if (hr <= 28 || bp.sys < 80) {
      isImmediateDeath = true;
      immediateDeathReason = `Asistolia irreversible por bloqueo nodal farmacológico (${cleanDrug}) administrado sobre un Bloqueo AV preexistente.`;
      summary = `Muerte inmediata por asistolia tras administrar frenador nodal (${cleanDrug}) en Bloqueo AV.`;
    } else {
      glasgow = clamp(glasgow - 4, 5, 15);
      summary = `¡ERROR CRÍTICO CARDIOLÓGICO!: ${cleanDrug} suprime adicionalmente la conducción AV sobre un Bloqueo AV de base; riesgo inminente de asistolia (FC cae a ${hr} lpm, PA ${sys}/${dia} mmHg).`;
    }
    patientFeelingNote =
      '¡Doctor, se me fue la vista a negro y siento que el corazón se me detiene!';
  } else if (
    isPeritonealOrSurgicalAbdomen &&
    /\b(butilhioscina|buscapina|hioscina|escopolamina)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 12, 55, 178);
    summary = `¡ERROR CLÍNICO EN ABDOMEN QUIRÚRGICO!: ${cleanDrug} (anticolinérgico espasmolítico) paraliza el tránsito intestinal, genera taquicardia y enmascara signos peritoneales retrasando cirugía urgente (además agrava íleo paralítico).`;
    patientFeelingNote =
      'Me siento más distendido del abdomen y con el pulso más acelerado, doctor.';
  } else if (
    isAcetaminophenTox &&
    /\b(paracetamol|acetaminofen)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    sys = clamp(sys - 10, 62, 220);
    hr = clamp(hr + 14, 55, 178);
    summary = `¡ERROR CRÍTICO TOXICOLÓGICO!: Administrar Paracetamol adicional en Intoxicación por Paracetamol incrementa directamente la carga de NAPQI y acelera la necrosis hepatocelular fulminante (antídoto: N-acetilcisteína).`;
    patientFeelingNote =
      'Doctor, me dieron más náuseas intensas y un dolor muy fuerte debajo de las costillas derechas...';
  } else if (
    (isHerpeticKeratitis || isTinea || isSepticArthritis) &&
    /\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|prednisolona|betametasona|corticoide|esteroide)\b/.test(
      drugNorm
    )
  ) {
    effectSeverity = 'reaccion_adversa';
    summary = isHerpeticKeratitis
      ? `¡ERROR CRÍTICO OFTALMOLÓGICO!: Corticoide (${cleanDrug}) en Queratitis Herpética suprime inmunidad local y precipita úlcera geográfica y perforación corneal.`
      : isTinea
        ? `¡ERROR DERMATOLÓGICO!: Corticoide (${cleanDrug}) en dermatofitosis favorece proliferación fúngica y Tiña Incógnita.`
        : `¡ERROR CRÍTICO!: Corticoide (${cleanDrug}) en Artritis Séptica acelera destrucción articular y diseminación infecciosa.`;
    patientFeelingNote = 'Doctor, siento que la molestia empeoró y me arde más la zona afectada.';
  } else if (
    isStatusEpilepticus &&
    /\b(tramadol|flumazenil)\b/.test(drugNorm)
  ) {
    effectSeverity = 'reaccion_adversa';
    hr = clamp(hr + 20, 55, 185);
    glasgow = clamp(glasgow - 3, 4, 15);
    summary = `¡ERROR CRÍTICO NEUROLÓGICO!: ${cleanDrug} disminuye el umbral convulsivo o antagoniza GABA en Estatus Epiléptico, perpetuando crisis convulsivas refractarias.`;
    patientFeelingNote = '[El paciente presentó nueva descarga convulsiva tónico-clónica generalizada]';
  }
  // 2. CLORURO DE POTASIO (KCl) IV — Alto riesgo de paro cardíaco y acumulación de hiperkalemia
  else if (/\b(cloruro de potasio|kcl|potasio)\b/.test(drugNorm) && !drugNorm.includes('losartan')) {
    const meq = parsedDose.meq ?? (parsedDose.mg ? parsedDose.mg / 74.5 : 20);
    const totalMeq = meq + cum.kclMeq;
    const isDilutedInfusion =
      /\b(diluid|en 1000|en 500|por litro|infusion|mantenimiento|bomba)\b/.test(
        `${doseNorm} ${freqNorm} ${routeNorm}`
      ) && !/\b(bolo|directa|push|stat rapido)\b/.test(`${doseNorm} ${freqNorm}`);

    if (isHyperkalemia || !isDilutedInfusion || meq >= 30 || (isIV && meq >= 15 && !isDilutedInfusion)) {
      effectSeverity = 'reaccion_adversa';
      isImmediateDeath = true;
      immediateDeathReason = isHyperkalemia
        ? `Fibrilación ventricular inmediata y asistolia por administrar Cloruro de Potasio (${cleanDose}) en paciente con hiperpotasemia severa / lesión renal aguda.`
        : `Paro cardíaco inmediato por fibrilación ventricular tras bolo IV directo / infusión sin dilución segura de Cloruro de Potasio (${cleanDose}).`;
      hr = 0;
      sys = 0;
      dia = 0;
      rr = 0;
      spo2 = 0;
      glasgow = 3;
      summary = isHyperkalemia
        ? `Muerte inmediata por paro cardíaco / fibrilación ventricular al administrar potasio (${cleanDose}) en hiperpotasemia / lesión renal aguda.`
        : `Muerte inmediata por fibrilación ventricular / paro cardíaco tras bolo IV directo o sin dilución segura de Cloruro de Potasio (${cleanDose}).`;
      patientFeelingNote =
        '[CÓDIGO AZUL · MUERTE INMEDIATA: arritmia ventricular maligna y asistolia súbita tras bolo de potasio IV]';
    } else if (totalMeq >= 120) {
      effectSeverity = 'reaccion_adversa';
      isImmediateDeath = true;
      immediateDeathReason = `Fibrilación ventricular y asistolia por hiperkalemia tóxica acumulativa (${Math.round(totalMeq)} mEq acumulados de Cloruro de Potasio).`;
      summary = `Muerte inmediata por paro cardíaco tras toxicidad acumulativa de potasio (${Math.round(totalMeq)} mEq totales).`;
    } else if (totalMeq >= 80) {
      effectSeverity = 'reaccion_adversa';
      hr = clamp(hr - 24, 34, 155);
      sys = clamp(sys - 22, 54, 210);
      dia = clamp(dia - 12, 32, 125);
      glasgow = clamp(glasgow - 3, 6, 15);
      summary = `Hiperkalemia iatrogénica por acumulación de Cloruro de Potasio (${Math.round(totalMeq)} mEq acumulados): bradicardia severa, ensanchamiento QRS e inestabilidad hemodinámica.`;
      patientFeelingNote = '¡Doctor, siento muchísima debilidad en las piernas, hormigueo y el corazón muy lento e irregular!';
    } else {
      effectSeverity = 'parcial';
      summary = `Reposición diluida cautelosa de KCl (${cleanDose}; acumulado ${Math.round(totalMeq)} mEq) en infusión lenta con monitoreo.`;
      patientFeelingNote = 'Siento un leve ardor en la vena por donde pasa el suero, doctor, pero me siento estable.';
    }
  }
  // 3. INSULINA (sensible a dosis real en UI, peso, acumulación, formulación IV vs SC y glucemia)
  else if (/\b(insulina)\b/.test(drugNorm)) {
    const isBasalFormulation = /\b(nph|glargina|lantus|detemir|degludec|tresiba|levemir|intermedia|prolongada)\b/.test(
      drugNorm
    );
    if (isIV && isBasalFormulation) {
      effectSeverity = 'reaccion_adversa';
      if (typeof glucose === 'number') {
        glucose = clamp(glucose - 95, 22, 650);
      }
      hr = clamp(hr + 24, 50, 178);
      glasgow = clamp(glasgow - 3, 6, 15);
      summary = `Error crítico farmacológico: administración intravenosa de insulina de acción intermedia/prolongada (${cleanDrug}), contraindicada por vía IV por riesgo de precipitación, hipoglucemia prolongada grave e impredecible.`;
      patientFeelingNote =
        '¡Doctor, me siento muy mareado, sudoroso y confundido después de que me inyectaron esa insulina en la vena!';
    } else {
      const prevInsulin = getCumulativePriorDoses(previousHistory, weightKg, /\binsulina\b/);
      const priorDextrose = getCumulativePriorDoses(previousHistory, weightKg, /\b(dextrosa|glucosa)\b/);
      const ui = parsedDose.ui ?? 6;
      const totalUi = ui + prevInsulin.ui;
      const uiPerKg = ui / weightKg;
      const isPolarizingDose =
        isHyperkalemia && ui <= 15 && (priorDextrose.mg !== null && priorDextrose.mg >= 15000 || /\bpolariz/.test(drugNorm));

      if (isPolarizingDose) {
        if (typeof glucose === 'number') {
          glucose = clamp(glucose - Math.round(ui * 2.2), 75, 650);
        }
        effectSeverity = 'mejoria';
        summary = `Solución polarizante (${cleanDose}) en hiperkalemia con cobertura glucosada: favorece desplazamiento intracelular de K⁺ manteniendo normoglucemia.`;
        patientFeelingNote = 'Me siento un poco más tranquilo, doctor, sin temblor ni sudoración.';
      } else if (typeof glucose === 'number') {
        const beforeGlucose = glucose;
        const sensitivity = beforeGlucose >= 350 ? 5.2 : beforeGlucose >= 200 ? 6.0 : 6.8;
        const isMassiveSingle = ui >= 35 || uiPerKg >= 0.45;
        const isMassiveCumulative = totalUi >= 45 || totalUi / weightKg >= 0.65;
        const isHighDose = ui >= 20 || uiPerKg >= 0.25;

        // Cálculo fisiológico acumulativo: cada dosis previa sensibiliza el descenso glucémico e hipokalemia
        const cumulativeScale = isMassiveCumulative ? 1.25 : prevInsulin.count >= 2 ? 1.12 : 1.0;
        const rawDrop =
          ui <= 16 && uiPerKg <= 0.22 && !isMassiveCumulative
            ? Math.round(clamp(ui * sensitivity * cumulativeScale, 12, 95))
            : Math.round(ui * sensitivity * cumulativeScale);

        glucose = clamp(beforeGlucose - rawDrop, 14, 700);
        const actualDrop = beforeGlucose - glucose;

        if (glucose < 35 || isMassiveSingle || isMassiveCumulative) {
          effectSeverity = 'reaccion_adversa';
          const isInstantInsulinArrest =
            ui >= 150 ||
            uiPerKg >= 2.0 ||
            totalUi >= 150 ||
            totalUi / weightKg >= 2.1 ||
            (beforeGlucose < 65 && ui >= 25) ||
            (beforeGlucose <= 28 && totalUi >= 45);

          if (isInstantInsulinArrest) {
            isImmediateDeath = true;
            immediateDeathReason = `Choque neuroglucopénico fulminante, hipopotasemia crítica y paro cardiorrespiratorio irreversible tras sobredosis extrema/acumulativa de insulina (${cleanDose}, acumulado ${Math.round(totalUi)} UI) con glucemia ${beforeGlucose} mg/dL.`;
            summary = `Muerte inmediata por sobredosis extrema/acumulación letal de insulina (${cleanDose}, acumulado ${Math.round(totalUi)} UI): paro por neuroglucopenia e hipopotasemia severa.`;
          } else if (glucose < 30 || ui >= 70 || uiPerKg >= 0.85 || isMassiveCumulative) {
            glasgow = clamp(glasgow - 10, 3, 6);
            sys = clamp(sys - 38, 52, 200);
            dia = clamp(dia - 22, 30, 120);
            hr = glucose <= 22 || ui >= 80 || totalUi >= 80 ? clamp(40, 32, 48) : clamp(hr + 42, 60, 178);
            rr = clamp(rr - 6, 6, 36);
            spo2 = clamp(spo2 - 9, 72, 100);
            summary = `Sobredosis ${isMassiveCumulative && !isMassiveSingle ? 'acumulativa' : 'masiva'} de insulina (${cleanDose}, acumulado ${Math.round(totalUi)} UI): hipoglucemia iatrogénica catastrófica (glucemia cae de ${beforeGlucose} a ${glucose} mg/dL), coma neuroglucopénico (Glasgow ${glasgow}/15), hipokalemia aguda severa y colapso cardiorrespiratorio — requiere rescate inmediato o será letal.`;
            patientFeelingNote =
              '[Alerta crítica: el paciente perdió la conciencia súbitamente con convulsiones, diaforesis profusa y bradicardia/shock tras sobredosis acumulativa de insulina — requiere Dextrosa IV inmediata]';
          } else {
            glasgow = clamp(glasgow - 6, 6, 9);
            sys = clamp(sys - 20, 68, 210);
            dia = clamp(dia - 12, 40, 125);
            hr = clamp(hr + 32, 55, 176);
            spo2 = clamp(spo2 - 4, 80, 100);
            summary = `Hipoglucemia iatrogénica severa por sobredosis de insulina (${cleanDose}; acumulado ${Math.round(totalUi)} UI): glucemia cae bruscamente a ${glucose} mg/dL con coma/estupor agudo (Glasgow ${glasgow}/15) y riesgo letal.`;
            patientFeelingNote = isPediatric
              ? '[El niño quedó inconsciente, flácido y sudando frío tras la dosis alta de insulina]'
              : '[El paciente quedó inconsciente / en estupor profundo con sudoración fría tras la sobredosis de insulina]';
          }
        } else if (glucose < 54) {
          effectSeverity = 'reaccion_adversa';
          hr = clamp(hr + 28, 55, 176);
          glasgow = clamp(glasgow - 3, 7, 13);
          summary = `Hipoglucemia iatrogénica clínicamente significativa (<54 mg/dL) tras ${cleanDose} de insulina (cae a ${glucose} mg/dL): neuroglucopenia aguda.`;
          patientFeelingNote =
            '¡Doctor, me siento muy mareado, sudando frío, me tiembla todo el cuerpo y me cuesta hablar claro!';
        } else if (glucose < 70) {
          effectSeverity = 'reaccion_adversa';
          hr = clamp(hr + 18, 55, 172);
          glasgow = clamp(glasgow - 1, 10, 15);
          summary = `Descenso glucémico excesivo tras ${cleanDose} de insulina: cayó a ${glucose} mg/dL causando hipoglucemia iatrogénica sintomática.`;
          patientFeelingNote = isPediatric
            ? '¡Doctor, mi niño empezó a sudar frío, está temblando mucho y se ve muy dormido!'
            : '¡Doctor, empecé a temblar muchísimo, tengo sudor frío, el corazón muy acelerado y la vista nublada!';
        } else if (actualDrop >= 95 || isHighDose) {
          effectSeverity = 'reaccion_adversa';
          hr = clamp(hr + 12, 55, 172);
          summary = `Descenso glucémico y osmolar demasiado brusco (-${actualDrop} mg/dL tras ${cleanDose} de insulina): alto riesgo de edema cerebral, hipokalemia aguda e hipoglucemia tardía.`;
          patientFeelingNote =
            'Doctor, me siento muy débil, mareado y con el corazón acelerado desde que me pasaron esa dosis tan alta.';
        } else if (
          beforeGlucose < 180 &&
          !(diagNorm.includes('cetoacidosis') && beforeGlucose >= 120)
        ) {
          effectSeverity = 'reaccion_adversa';
          summary = `Insulina (${cleanDose}) administrada sin hiperglucemia de urgencia (${beforeGlucose} → ${glucose} mg/dL): riesgo injustificado de hipoglucemia iatrogénica.`;
          patientFeelingNote = 'Me siento un poco flojo y con hambre rara desde esa inyección, doctor.';
        } else if (diagNorm.includes('cetoacidosis') || diagNorm.includes('hiperosmolar') || beforeGlucose >= 280) {
          rr = clamp(rr - (rr > 22 ? 3 : 0), 14, 42);
          hr = clamp(hr - (hr > 105 ? 6 : 2), 55, 170);
          effectSeverity = ui < 2 ? 'parcial' : 'mejoria';
          summary =
            ui < 2
              ? `Dosis subterapéutica de insulina (${cleanDose}) en hiperglucemia severa (-${actualDrop} mg/dL); requiere titulación a 0.1 UI/kg/h.`
              : `Descenso gradual y seguro de glucemia (-${actualDrop} mg/dL) tras ${cleanDose} de insulina, dentro de meta (50-75 mg/dL/h).`;
          patientFeelingNote =
            'Ya siento un poquito menos de pesadez y menos agitación al respirar, doctor.';
        } else {
          // Hiperglucemia moderada ambulatoria (ej. DM2 con 224 mg/dL sin cetosis) y dosis pequeña segura
          effectSeverity = 'parcial';
          summary = `Descenso de glucemia (-${actualDrop} mg/dL a ${glucose} mg/dL) tras ${cleanDose}; en DM2 estable sin cetoacidosis la prioridad es el manejo oral progresivo y no bolo IV.`;
          patientFeelingNote = 'Me siento estable, doctor, aunque todavía tengo algo de sed.';
        }
      } else {
        hr = clamp(hr + 6, 50, 175);
        sys = clamp(sys - 3, 65, 220);
        effectSeverity = 'parcial';
        summary = 'Insulina administrada sin hiperglucemia basal documentada: desplazamiento intracelular de K⁺ y leve activación adrenérgica compensadora.';
        patientFeelingNote = 'Siento un leve temblor en las manos y el pulso un poco más rápido, doctor.';
      }
    }
  }
  // 4. LABETALOL y ANTIHIPERTENSIVOS IV/VO
  else if (
    /\b(labetalol|hidralazina|nifedipin|nitroprusiato|nicardipin|enalaprilat|enalapril|antihipertensiv|losartan|captopril|amlodipino|esmolol|metoprolol|atenolol|propranolol)\b/.test(
      drugNorm
    )
  ) {
    const isOralOnlyDrug = /\b(losartan|amlodipino|captopril|nifedipin)\b/.test(drugNorm);
    const isLabetalol = drugNorm.includes('labetalol');
    const isHidralazina = drugNorm.includes('hidralazina');
    const isNitroprusiato = drugNorm.includes('nitroprusiato');
    const isNicardipino = drugNorm.includes('nicardipin');
    const isAceOrArb = /\b(enalaprilat|enalapril|losartan|captopril)\b/.test(drugNorm);
    const isPureVasodilator = isHidralazina || isNitroprusiato || isNicardipino || drugNorm.includes('nifedipin');
    const isBetaBlocker = /\b(labetalol|esmolol|metoprolol|atenolol|propranolol)\b/.test(drugNorm);
    const isPureBetaBlocker = /\b(esmolol|metoprolol|atenolol|propranolol)\b/.test(drugNorm);
    const hasPriorBetaBlocker = previousHistory.some(
      (h) =>
        h.effectSeverity !== 'reaccion_adversa' &&
        /\b(esmolol|labetalol|propranolol|metoprolol|atenolol)\b/.test(norm(`${h.drug} ${h.label}`))
    );
    const hasPriorAlphaBlocker = previousHistory.some(
      (h) =>
        h.effectSeverity !== 'reaccion_adversa' &&
        /\b(fentolamina|fenoxibenzamina|prazosina|doxazosina)\b/.test(norm(`${h.drug} ${h.label}`))
    );

    if (isIV && isOralOnlyDrug) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 24, 58, 220);
      dia = clamp(dia - 14, 34, 130);
      summary = `Error crítico farmacológico: administración intravenosa de formulación exclusivamente oral (${cleanDrug}). Riesgo de embolismo o toxicidad vascular grave.`;
      patientFeelingNote = '¡Doctor, me ardió horrible la vena y me siento muy mareado!';
    } else if (isPreeclampsiaOrEclampsia && (isNitroprusiato || isAceOrArb)) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 18, 65, 225);
      dia = clamp(dia - 10, 40, 135);
      summary = `¡ERROR CRÍTICO OBSTÉTRICO!: ${cleanDrug} está contraindicado en Preeclampsia/Eclampsia (${isNitroprusiato ? 'toxicidad fetal por cianuro' : 'fetotoxicidad renal severa por IECA/ARA-II'}); usar Labetalol IV, Hidralazina IV o Nifedipino VO.`;
      patientFeelingNote = 'Doctor, siento mareo intenso y menos movimientos del bebé después de esa medicina.';
    } else if (isHemorrhagicStroke && isNitroprusiato) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 22, 65, 225);
      glasgow = clamp(glasgow - 2, 4, 15);
      summary = `¡ERROR NEUROCRÍTICO!: Nitroprusiato de Sodio en hemorragia intracerebral / HSA produce vasodilatación cerebral y eleva la presión intracraneal (preferir Labetalol o Nicardipino IV).`;
      patientFeelingNote = 'Doctor, me duele más fuerte la cabeza y siento más somnolencia...';
    } else if (isAorticDissection && isPureVasodilator && !hasPriorBetaBlocker) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 16, 70, 225);
      dia = clamp(dia - 8, 42, 130);
      hr = clamp(hr + 24, 65, 178);
      summary = `¡ERROR CRÍTICO EN DISECCIÓN AÓRTICA!: Vasodilatador puro (${cleanDrug}) sin betabloqueo previo genera taquicardia refleja (+24 lpm) y aumenta el estrés de cizallamiento aórtico (dP/dt), propagando la disección (administrar Esmolol o Labetalol IV primero).`;
      patientFeelingNote =
        '¡Doctor, el dolor desgarrante de pecho y espalda se volvió mucho peor y el corazón me late fuertísimo!';
    } else if (isPheochromocytoma && isPureBetaBlocker && !hasPriorAlphaBlocker) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys + 28, 80, 248);
      dia = clamp(dia + 16, 48, 146);
      hr = clamp(hr - 18, 44, 170);
      summary = `CRISIS HIPERTENSIVA PARADÓJICA en Feocromocitoma por betabloqueo sin bloqueo alfa previo (${cleanDrug}): vasoconstricción alfa-1 no opuesta (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg).`;
      patientFeelingNote =
        '¡Doctor, me estalla la cabeza todavía más fuerte, siento palpitaciones pesadas y opresión en el pecho después de esa dosis!';
    } else if (isBetaBlocker && (sys < 92 || hr < 52)) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 26, 48, 220);
      dia = clamp(dia - 16, 28, 130);
      hr = clamp(hr - 18, 30, 165);
      glasgow = clamp(glasgow - 6, 4, 9);
      if (bp.sys < 80 || currentVitals.heartRate < 45) {
        isImmediateDeath = true;
        immediateDeathReason = `Bloqueo AV completo y asistolia por administrar betabloqueador (${cleanDrug}) en paciente ya en choque profundo o bradicardia extrema.`;
        summary = `Muerte inmediata por choque cardiogénico / asistolia tras ${cleanDrug} en paciente en colapso.`;
      } else {
        summary = `Choque cardiogénico / bradicardia severa agravada por betabloqueador (${cleanDrug}) en paciente ya hipotenso o bradicárdico: riesgo vital inmediato.`;
      }
      patientFeelingNote =
        '[El paciente quedó inconsciente y frío con hipotensión severa y bradicardia extrema tras el betabloqueador]';
    } else if (isThyroidStorm && isBetaBlocker) {
      const mg = parsedDose.mg ?? (drugNorm.includes('propranolol') ? 2 : 20);
      hr = clamp(hr - clamp(Math.round(24 + mg * 0.4), 18, 38), 68, 165);
      sys = clamp(sys - 10, 95, 210);
      dia = clamp(dia - 4, 55, 125);
      effectSeverity = 'mejoria';
      summary = `Bloqueo beta-adrenérgico eficaz en Tormenta Tiroidea (${cleanDrug} ${cleanDose}): control de taquicardia extrema (${hr} lpm) e inhibición periférica de conversión T4→T3.`;
      patientFeelingNote =
        'Siento que el corazón dejó de galopar tan frenéticamente, doctor; respiro un poco menos agitado.';
    } else if (isArrhythmiaTachy && !isVentricularTachycardia && isBetaBlocker) {
      const mg = parsedDose.mg ?? 10;
      hr = clamp(hr - clamp(Math.round(26 + mg * 0.5), 18, 46), 64, 155);
      sys = clamp(sys - 8, 92, 210);
      dia = clamp(dia - 4, 54, 125);
      effectSeverity = 'mejoria';
      summary = `Frenado nodal AV eficaz con betabloqueador (${cleanDrug} ${cleanDose}): control de frecuencia ventricular en taquiarritmia supraventricular (FC ${hr} lpm).`;
      patientFeelingNote = 'Siento el corazón mucho menos desbocado y menos palpitaciones en el pecho, doctor.';
    } else if (isShockOrHypovolemic && !isHypertensiveCrisis && hr >= 100 && isBetaBlocker) {
      sys = clamp(sys - 18, 54, 210);
      dia = clamp(dia - 10, 32, 125);
      hr = clamp(hr - 20, 48, 165);
      effectSeverity = 'reaccion_adversa';
      summary = `¡ERROR FISIOPATOLÓGICO!: Betabloqueador (${cleanDrug}) bloquea la taquicardia compensadora en choque/hipovolemia/sepsis, precipitando caída severa del gasto cardíaco e hipotensión (${sys}/${dia} mmHg).`;
      patientFeelingNote = '¡Doctor, me siento muchísimo más débil, frío y mareado después de esa dosis!';
    } else {
      const prevHidra = getCumulativePriorDoses(previousHistory, weightKg, /\bhidralazina\b/);
      const prevNtp = getCumulativePriorDoses(previousHistory, weightKg, /\bnitroprusiato\b/);
      const prevNif = getCumulativePriorDoses(previousHistory, weightKg, /\bnifedipin/);
      const prevLab = getCumulativePriorDoses(previousHistory, weightKg, /\blabetalol\b/);
      const prevOtherAht = getCumulativePriorDoses(
        previousHistory,
        weightKg,
        /\b(nicardipin|enalapril|losartan|captopril|amlodipino|esmolol|metoprolol|atenolol|propranolol)\b/
      );
      const currentAhtEquiv = getAntihypertensiveEquivUnits(drugNorm, parsedDose);
      const totalAhtEquiv = cum.ahtEquivUnits + currentAhtEquiv;

      let rawSysDrop = 20;
      let rawDiaDrop = 11;
      let hrDelta = -4;
      let isMassiveOverdose = false;
      let isInstantFatalAht = false;
      let cumulativeAhtMgNote = '';

      if (isLabetalol) {
        const mg = parsedDose.mg ?? 20;
        const totalMg = mg + prevLab.mg;
        const mgPerKg = mg / weightKg;
        const potencyRatio = mg / 20;
        isMassiveOverdose = mg >= 120 || totalMg >= 180 || totalAhtEquiv >= 5.0 || mgPerKg >= 2.0;
        isInstantFatalAht = mg >= 300 || totalMg >= 300 || totalAhtEquiv >= 10.0;
        const baselineFactor = sys >= 180 ? 1.18 : sys >= 150 ? 1.0 : 0.9;
        rawSysDrop = Math.round(25 * Math.pow(potencyRatio, 0.85) * baselineFactor);
        rawDiaDrop = Math.round(rawSysDrop * 0.56);
        hrDelta = -Math.round(10 * Math.pow(potencyRatio, 0.72));
        if (prevLab.count > 0) cumulativeAhtMgNote = ` · acumulado ${Math.round(totalMg)} mg Labetalol`;
      } else if (isHidralazina) {
        const mg = parsedDose.mg ?? 5;
        const totalMg = mg + prevHidra.mg;
        const mgPerKg = mg / weightKg;
        const ratio = mg / 5;
        isMassiveOverdose = mg >= 30 || totalMg >= 30 || totalAhtEquiv >= 5.0 || mgPerKg >= 0.5;
        isInstantFatalAht = mg >= 100 || totalMg >= 90 || totalAhtEquiv >= 10.0;
        rawSysDrop = Math.round(22 * Math.pow(ratio, 0.8));
        rawDiaDrop = Math.round(rawSysDrop * 0.54);
        hrDelta = Math.round(11 * Math.pow(ratio, 0.65));
        if (prevHidra.count > 0) cumulativeAhtMgNote = ` · acumulado ${Math.round(totalMg)} mg Hidralazina`;
      } else if (isNitroprusiato) {
        const mg = parsedDose.mg ?? 0.05;
        const totalMg = mg + prevNtp.mg;
        isMassiveOverdose = mg >= 2 || totalMg >= 1.5 || totalAhtEquiv >= 5.0;
        isInstantFatalAht = mg >= 10 || totalMg >= 6.0 || totalAhtEquiv >= 10.0;
        const ratio = clamp(mg / 0.05, 0.5, 40);
        rawSysDrop = Math.round(28 * Math.pow(ratio, 0.55));
        rawDiaDrop = Math.round(rawSysDrop * 0.56);
        hrDelta = Math.round(10 * Math.pow(ratio, 0.4));
        if (prevNtp.count > 0) cumulativeAhtMgNote = ` · acumulado ${totalMg.toFixed(2)} mg (riesgo cianuro)`;
      } else if (drugNorm.includes('nifedipin')) {
        const mg = parsedDose.mg ?? 10;
        const totalMg = mg + prevNif.mg;
        const isSL = routeNorm.includes('sublingual') || /\bsl\b/.test(routeNorm);
        isMassiveOverdose = mg >= 30 || (isSL && mg >= 10) || totalMg >= 40 || totalAhtEquiv >= 5.0;
        isInstantFatalAht = totalMg >= 90 || totalAhtEquiv >= 10.0;
        rawSysDrop = Math.round((isSL ? 38 : 22) * (mg / 10));
        rawDiaDrop = Math.round(rawSysDrop * 0.55);
        hrDelta = Math.round(12 * (mg / 10));
        if (prevNif.count > 0) cumulativeAhtMgNote = ` · acumulado ${Math.round(totalMg)} mg Nifedipino`;
      } else {
        const mg = parsedDose.mg ?? 10;
        const totalOtherMg = mg + prevOtherAht.mg;
        const ratio = mg / 10;
        isMassiveOverdose =
          mg >= 80 ||
          mg / weightKg >= 1.5 ||
          (isPureBetaBlocker && totalAhtEquiv >= 4.5) ||
          totalAhtEquiv >= 5.0;
        isInstantFatalAht = totalAhtEquiv >= 9.5;
        rawSysDrop = Math.round(18 * Math.pow(ratio, 0.72));
        rawDiaDrop = Math.round(rawSysDrop * 0.55);
        hrDelta = isPureBetaBlocker ? -Math.round(12 * Math.pow(ratio, 0.6)) : -2;
        if (prevOtherAht.count > 0) cumulativeAhtMgNote = ` · acumulado ${Math.round(totalOtherMg)} mg`;
      }

      if (totalAhtEquiv >= 3.5 && !isMassiveOverdose) {
        rawSysDrop = Math.round(rawSysDrop * 1.25);
        rawDiaDrop = Math.round(rawDiaDrop * 1.25);
        if (isBetaBlocker) hrDelta -= 6;
      }

      sys = clamp(sys - rawSysDrop, 45, 240);
      dia = clamp(dia - rawDiaDrop, 26, 140);
      hr = clamp(hr + hrDelta, 30, 180);

      const mapAfter = calcMAP(sys, dia);
      const mapDropPct = Math.round(((mapBefore - mapAfter) / Math.max(1, mapBefore)) * 100);
      const isIatrogenicHypotension = sys < 95 || mapAfter < 65 || hr < 50 || isMassiveOverdose;
      const isExcessiveDrop = mapDropPct >= 25;

      if (isInstantFatalAht) {
        effectSeverity = 'reaccion_adversa';
        isImmediateDeath = true;
        immediateDeathReason = `Colapso vasopléjico / choque cardiogénico irreversible o toxicidad acumulativa fulminante tras ${cleanDrug} (${cleanDose}${cumulativeAhtMgNote}).`;
        summary = `Muerte inmediata por colapso vasopléjico irreversible tras acumulación/sobredosis letal de ${cleanDrug} (${cleanDose}${cumulativeAhtMgNote}).`;
        patientFeelingNote = '[CÓDIGO AZUL · Colapso súbito irreversible tras sobrecarga antihipertensiva letal]';
      } else if (isIatrogenicHypotension) {
        effectSeverity = 'reaccion_adversa';
        if (sys < 75 || isMassiveOverdose) {
          glasgow = clamp(glasgow - 6, 4, 9);
          spo2 = clamp(spo2 - 6, 74, 100);
        } else if (sys < 88) {
          glasgow = clamp(glasgow - 1, 8, 15);
        }
        summary = `Hipotensión iatrogénica / shock vasopléjico tras ${totalAhtEquiv >= 4.5 ? 'acumulación excesiva' : 'sobredosis'} (${cleanDose} de ${cleanDrug}${cumulativeAhtMgNote}): descenso de PAM del ${mapDropPct}% (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg)${hr < 50 ? ' con bradicardia severa' : ''}${isMassiveOverdose ? ' y riesgo letal por hipoperfusión orgánica' : ''}.`;
        patientFeelingNote =
          glasgow <= 9
            ? '[El paciente perdió la lucidez y está inconsciente, frío y en choque profundo tras la sobredosis acumulativa antihipertensiva]'
            : '¡Doctor, me dio un mareo terrible y siento que se me oscurece la vista, el cuerpo helado y mucha debilidad desde que me pasaron esa dosis!';
      } else if (isIschemicStroke && bp.sys < 185 && bp.dia < 110) {
        effectSeverity = 'reaccion_adversa';
        if (sys < 135) glasgow = clamp(glasgow - 1, 6, 15);
        summary = `Descenso innecesario/agresivo de PA en EVC Isquémico (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg${cumulativeAhtMgNote}): con PA <185/110 (<220/120 sin trombólisis) rige hipertensión permisiva para proteger la penumbra isquémica.`;
        patientFeelingNote =
          'Doctor, me siento más mareado y con más dificultad para mover el lado debilitado desde que bajó la presión...';
      } else if (isIschemicStroke && (mapDropPct >= 18 || sys < 142)) {
        effectSeverity = 'reaccion_adversa';
        if (sys < 130) glasgow = clamp(glasgow - 1, 6, 15);
        summary = `Descenso agresivo de PA en EVC Isquémico (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg, -${mapDropPct}% PAM${cumulativeAhtMgNote}): compromete la perfusión de la zona de penumbra isquémica (meta sin trombólisis: tolerar <220/120; con trombólisis: <185/110).`;
        patientFeelingNote =
          'Doctor, me siento más mareado y con más dificultad para mover el lado debilitado desde que bajó tanto la presión...';
      } else if (isExcessiveDrop) {
        effectSeverity = 'reaccion_adversa';
        summary = `Descenso tensional demasiado brusco (caída de PAM del ${mapDropPct}%, superando la meta segura ≤25% en la primera hora) tras ${cleanDose} de ${cleanDrug}${cumulativeAhtMgNote}: riesgo de hipoperfusión cerebral/renal o placentaria.`;
        patientFeelingNote =
          'Doctor, me bajó rapidísimo la presión y aunque se me quitó el dolor de cabeza, ahora me siento muy mareado, sudoroso y con náuseas.';
      } else if (isHypertensiveCrisis) {
        effectSeverity = 'mejoria';
        summary = isAorticDissection
          ? `Control antiimpulso (PAS ${sys} mmHg, FC ${hr} lpm) tras ${cleanDose} de ${cleanDrug}: reduce estrés de cizallamiento aórtico (meta PAS 100-120 mmHg y FC <60 lpm).`
          : `Descenso tensional titulado y seguro (caída de PAM del ${mapDropPct}% dentro de meta ≤25%) tras ${cleanDose} de ${cleanDrug}${cumulativeAhtMgNote}.`;
        patientFeelingNote =
          'Doctor, ya siento menos presión en la cabeza y me disminuyó el malestar sin marearme.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Antihipertensivo (${cleanDrug} ${cleanDose}${cumulativeAhtMgNote}) sin criterio de emergencia hipertensiva: la elevación leve/reactiva por dolor o ansiedad no debe tratarse agresivamente en agudo (${bp.sys}/${bp.dia} → ${sys}/${dia} mmHg).`;
        patientFeelingNote =
          'Siento algo de pesadez ligera, doctor, aunque mi molestia de fondo sigue igual.';
      }
    }
  }
  // 5. NITROGLICERINA SL / IV (acumulativa)
  else if (/\b(nitroglicerina|nitrat|isosorbide)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.4;
    const totalMg = mg + cum.nitrateMg;
    const isCumulativeNitrateOverdose = totalMg >= 2.4 && (!isIV || totalMg >= 8);
    const isMassiveNtg = mg >= 5 || isCumulativeNitrateOverdose;
    const hasPriorBetaBlockerNtg = previousHistory.some(
      (h) =>
        h.effectSeverity !== 'reaccion_adversa' &&
        /\b(esmolol|labetalol|propranolol|metoprolol|atenolol)\b/.test(norm(`${h.drug} ${h.label}`))
    );
    if (usesPde5 || sys < 100 || isPreloadDependentShock || isMassiveNtg || (isAorticDissection && !hasPriorBetaBlockerNtg)) {
      const dropSys = isMassiveNtg
        ? Math.round(28 + Math.min(45, totalMg * 3.5))
        : usesPde5
          ? 48
          : Math.round(24 * clamp(mg / 0.4, 0.7, 4));
      sys = clamp(sys - dropSys, 48, 220);
      dia = clamp(dia - Math.round(dropSys * 0.58), 28, 130);
      hr = clamp(hr + 20, 50, 180);
      if (sys < 80) glasgow = clamp(glasgow - (sys < 65 ? 6 : 3), 5, 9);
      effectSeverity = 'reaccion_adversa';
      if ((usesPde5 && bp.sys < 95) || mg >= 20 || totalMg >= 15) {
        isImmediateDeath = true;
        immediateDeathReason = usesPde5
          ? 'Choque vasopléjico refractario e irreversible por interacción mortal entre nitrato e inhibidor PDE5 en paciente ya hipotenso.'
          : `Colapso vasopléjico fulminante tras sobredosis/acumulación masiva de nitrato (${cleanDose}, acumulado ${totalMg.toFixed(1)} mg).`;
      }
      summary = usesPde5
        ? 'Hipotensión refractaria severa por interacción mortal entre nitrato e inhibidor de PDE5 (sildenafil/tadalafil).'
        : isAorticDissection && !hasPriorBetaBlockerNtg
          ? `¡ERROR EN DISECCIÓN AÓRTICA!: Nitroglicerina sin betabloqueo previo induce taquicardia refleja y aumenta dP/dt agravando el desgarro aórtico.`
          : isMassiveNtg
            ? `Colapso vasopléjico / cefalea vascular severa por ${isCumulativeNitrateOverdose ? 'acumulación excesiva' : 'sobredosis masiva'} de nitrato (${cleanDose}, acumulado ${totalMg.toFixed(1)} mg): caída crítica de PA a ${sys}/${dia} mmHg.`
            : 'Hipotensión marcada dependiente de precarga tras nitrato en paciente hipotenso o con choque obstructivo/compromiso ventricular derecho.';
      patientFeelingNote =
        glasgow <= 9
          ? '[Síncope brusco con inconsciencia, hipotensión severa y diaforesis tras nitrato]'
          : '¡Doctor, se me nubló la vista, me late fuertísimo la cabeza y siento un mareo muy intenso desde esa dosis!';
    } else {
      const scale = clamp(mg / 0.4, 0.7, 4.5);
      sys = clamp(sys - Math.round(14 * scale), 70, 220);
      dia = clamp(dia - Math.round(8 * scale), 42, 130);
      if ((isIschemicChestPain || isPulmonaryEdemaOrFluidOverload) && sys >= 95) {
        hr = clamp(hr - (hr > 95 ? 8 : 0), 55, 165);
        if (isPulmonaryEdemaOrFluidOverload) spo2 = clamp(spo2 + 4, 74, 99);
        effectSeverity = 'mejoria';
        summary = isPulmonaryEdemaOrFluidOverload
          ? `Venodilatación rápida tras ${cleanDose} de nitroglicerina: reduce precarga ventricular y congestión pulmonar aguda.`
          : `Vasodilatación coronaria tras ${cleanDose} de nitroglicerina (acumulado ${totalMg.toFixed(1)} mg): alivio progresivo de angina con descenso tensional esperado.`;
        patientFeelingNote =
          'Siento que me aflojó un poco esa opresión en el pecho, aunque noto un leve dolor de cabeza.';
      } else {
        effectSeverity = sys < 95 ? 'reaccion_adversa' : 'sin_cambio';
        summary =
          sys < 95
            ? `Hipotensión iatrogénica tras ${cleanDose} de nitroglicerina (acumulado ${totalMg.toFixed(1)} mg; PA cae a ${sys}/${dia} mmHg).`
            : `Nitrato (${cleanDose}) sin indicación isquémica ni congestiva pulmonar: descenso tensional inespecífico y cefalea vasodilatadora sin impacto terapéutico en el cuadro.`;
        patientFeelingNote =
          sys < 95
            ? 'Me siento muy mareado y flojo después de esa dosis, doctor.'
            : 'Me empezó a latir un poquito la sien con esa medicina, pero mi molestia principal sigue igual.';
      }
    }
  }
  // 6. VASOPRESORES (Norepinefrina, Dopamina, Vasopresina, Dobutamina — acumulativo)
  else if (/\b(norepinefrina|noradrenalina|dopamina|dobutamina|vasopresina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.02;
    const totalMg = mg + cum.pressorMg;
    const totalCount = 1 + cum.pressorCount;
    const isMassiveBolus = mg >= 2 || totalMg >= 3 || (totalCount >= 3 && sys >= 128);
    if (sys >= 115 || isMassiveBolus) {
      sys = clamp(sys + (isMassiveBolus ? 85 : 45), 70, 248);
      dia = clamp(dia + (isMassiveBolus ? 46 : 24), 45, 148);
      hr = clamp(hr + (isMassiveBolus ? 46 : 24), 45, 188);
      if (sys >= 220) glasgow = clamp(glasgow - 6, 5, 9);
      effectSeverity = 'reaccion_adversa';
      if (mg >= 10 || totalMg >= 12) {
        isImmediateDeath = true;
        immediateDeathReason = `Fibrilación ventricular / hemorragia intracerebral fulminante por acumulación o bolo masivo de vasopresor (${cleanDose} de ${cleanDrug}, acumulado ${totalMg.toFixed(2)} mg).`;
      }
      summary = `Crisis hipertensiva severa y riesgo de isquemia/arritmia maligna por vasopresor (${cleanDose} ${cleanDrug}; ${totalCount} dosis / ${totalMg.toFixed(2)} mg acumulados)${sys >= 115 && !isMassiveBolus ? ' en paciente sin hipotensión' : ' por dosis excesiva o acumulación adrenérgica'}.`;
      patientFeelingNote =
        glasgow <= 9
          ? '[Crisis hipertensiva maligna con pérdida brusca de la conciencia y arritmia]'
          : '¡Doctor, me estalla la cabeza, siento los dedos fríos y un apretón horrible en el pecho con el corazón desbocado!';
    } else {
      const gainSys = clamp(Math.round(24 + mg * 40), 18, 42);
      sys = clamp(sys + gainSys, 75, 138);
      dia = clamp(dia + Math.round(gainSys * 0.55), 48, 88);
      hr = clamp(hr - (hr > 125 ? 10 : -8), 55, 175);
      if (glasgow < 15 && bp.sys < 85) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = 'mejoria';
      summary = `Soporte vasopresor titulado con ${cleanDrug} (${totalCount} ajuste(s)): recuperación de PAM ≥65 mmHg y perfusión orgánica.`;
      patientFeelingNote = 'Parece que está reaccionando un poco mejor, doctor, la presión subió en el monitor.';
    }
  }
  // 7. OXÍGENO SUPLEMENTARIO (acumulativo en EPOC e hiperoxia)
  else if (/\b(oxigeno|o2|mascarilla|canula)\b/.test(drugNorm)) {
    const targetSpo2 = isCopd ? 92 : 97;
    const lpm =
      parsedDose.lpm ??
      (parsedDose.percent ? Math.round((parsedDose.percent - 21) / 4) : 6);
    const totalO2Count = 1 + cum.o2Count;
    const totalO2Lpm = lpm + cum.o2Lpm;
    if (isCarbonMonoxide) {
      hr = clamp(hr - (hr > 95 ? 8 : 3), 55, 165);
      rr = clamp(rr - (rr > 20 ? 3 : 1), 12, 38);
      if (glasgow < 15) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = lpm >= 10 || parsedDose.percent === 100 ? 'mejoria' : 'parcial';
      summary =
        effectSeverity === 'mejoria'
          ? `Oxigenoterapia de alto flujo al 100% (${cleanDose}) en intoxicación por Monóxido de Carbono: acelera disociación de carboxihemoglobina (COHb) y mejora hipoxia tisular aunque la SpO₂ basal pareciera normal.`
          : `Oxígeno (${lpm} L/min) iniciado en intoxicación por CO: conviene mascarilla con reservorio al 100% (12-15 L/min) para desplazar rápidamente la COHb.`;
      patientFeelingNote =
        'Con la mascarilla de oxígeno siento menos punzadas en la cabeza y un poco menos de mareo, doctor.';
    } else if (spo2 >= targetSpo2) {
      const isNarcosisRisk = isCopd && (lpm >= 10 || (totalO2Count >= 2 && (lpm >= 6 || totalO2Lpm >= 14)));
      const isCumulativeHyperoxia = !isCopd && totalO2Count >= 4 && lpm >= 10 && spo2 >= 98;
      if (isNarcosisRisk) {
        rr = clamp(rr - (totalO2Count >= 3 ? 7 : 5), 6, 40);
        glasgow = clamp(glasgow - (totalO2Count >= 3 ? 4 : 2), 6, 15);
        spo2 = clamp(spo2 + 2, 70, 100);
        effectSeverity = 'reaccion_adversa';
        summary = `Flujo excesivo acumulado de O₂ (${lpm} L/min; ${totalO2Count} exposiciones) en paciente con EPOC ya en meta: narcosis hipercápnica progresiva (FR cae a ${rr} rpm, Glasgow ${glasgow}/15).`;
        patientFeelingNote = 'Con tanto oxígeno acumulado me siento muy somnoliento, aturdido y respiro más despacio, doctor...';
      } else if (isCumulativeHyperoxia) {
        sys = clamp(sys + 4, 65, 225);
        effectSeverity = 'reaccion_adversa';
        summary = `Hiperoxia sostenida innecesaria (${totalO2Count} aplicaciones de alto flujo con SpO₂ ≥98%): riesgo de vasoconstricción coronaria/cerebral y estrés oxidativo alveolar.`;
        patientFeelingNote = 'Siento la garganta muy reseca y algo de mareo con tanto oxígeno sin necesitarlo, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary =
          isCopd && lpm >= 6
            ? `Flujo alto de O₂ (${lpm} L/min) en EPOC ya en meta (${spo2}%): riesgo de hipercapnia si se sostiene; titular a 1-3 L/min para meta 88-92%.`
            : `Oxigenoterapia aplicada (${lpm} L/min) en paciente ya normoxémico (${spo2}%): sin beneficio hemodinámico o respiratorio agudo adicional.`;
        patientFeelingNote = isPediatric
          ? 'Mi niño respira igual con la mascarilla, doctor.'
          : 'Siento el aire fresco de la mascarilla, aunque no sentía falta de aire, doctor.';
      }
    } else {
      const flowFactor = clamp(lpm / 4, 0.7, 1.6);
      const rawGain = Math.round(5 * flowFactor);
      const gain = isCopd ? Math.min(4, targetSpo2 - spo2) : Math.min(rawGain, 99 - spo2);
      spo2 = clamp(spo2 + Math.max(2, gain), 70, 99);
      rr = clamp(rr - (rr > 22 ? 4 : 2), 14, 45);
      hr = clamp(hr - (hr > 100 ? 8 : 3), 55, 170);
      effectSeverity = gain >= 4 ? 'mejoria' : 'parcial';
      summary = isCopd
        ? `Mejoría de oxigenación titulada (${lpm} L/min) buscando meta segura 88-92% en EPOC; disminuye la taquipnea.`
        : `Incremento de SpO₂ tras oxígeno a ${lpm} L/min y reducción del trabajo respiratorio.`;
      patientFeelingNote = isPediatric
        ? '¡Qué alivio, doctor! Con el oxígeno mi niño dejó de respirar tan desesperado y se ve con mejor color.'
        : '¡Ay, qué alivio, doctor! Con el oxígeno siento que ya me entra mejor el aire y no me ahogo tanto.';
    }
  }
  // 8. SALBUTAMOL / BRONCODILATADORES (estrictamente broncoespasmo o hiperkalemia)
  else if (/\b(salbutamol|albuterol|ipratropio|broncodilat)\b/.test(drugNorm)) {
    const mg =
      parsedDose.mg ??
      (parsedDose.puffs ? parsedDose.puffs * 0.1 : 5);
    const prevSaba = getCumulativePriorDoses(previousHistory, weightKg, /\b(salbutamol|albuterol)\b/);
    const totalMg = mg + prevSaba.mg;
    const isExtremeInhaled = !isHyperkalemia && (mg >= 40 || totalMg >= 65 || (totalMg >= 40 && hr >= 170));
    const isToxicInhaled = !isHyperkalemia && (mg >= 20 || mg / weightKg >= 0.6 || totalMg >= 30 || (!isObstructiveAirway && totalMg >= 20));
    const isToxicIV = isIV && (mg >= 0.8 || totalMg >= 2.0);
    const isIschemicOrTachyDanger =
      !isObstructiveAirway &&
      !isHyperkalemia &&
      (isIschemicChestPain || isArrhythmiaTachy || isThyroidStorm || isPheochromocytoma || isPulmonaryEdemaOrFluidOverload);

    if (isExtremeInhaled || (isIV && totalMg >= 5)) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Taquiarritmia ventricular maligna e hipopotasemia crítica por sobredosis acumulativa extrema de Salbutamol (${Math.round(totalMg)} mg totales).`;
      summary = `Muerte inmediata por arritmia letal y toxicidad beta-2 acumulativa tras Salbutamol (${Math.round(totalMg)} mg acumulados).`;
    } else if (isToxicInhaled || isToxicIV) {
      hr = clamp(hr + clamp(Math.round(mg * 2.5 + prevSaba.count * 6), 28, 74), 75, 188);
      sys = clamp(sys - 14, 70, 210);
      effectSeverity = 'reaccion_adversa';
      summary = `Toxicidad beta-adrenérgica severa por ${totalMg >= 30 ? 'acumulación excesiva' : 'sobredosis o vía inadecuada'} de Salbutamol (${cleanDose}, acumulado ${totalMg.toFixed(1)} mg, ${cleanRoute}): taquiarritmia (${hr} lpm), temblor intenso, hipokalemia aguda y acidosis láctica.`;
      patientFeelingNote =
        '¡Doctor, el corazón me va a estallar, me tiemblan muchísimo las manos y siento un mareo y calambres horribles!';
    } else if (isIschemicOrTachyDanger) {
      hr = clamp(hr + 16, 55, 185);
      sys = clamp(sys + (isThyroidStorm || isPheochromocytoma ? 10 : -4), 65, 225);
      effectSeverity = 'reaccion_adversa';
      summary = `¡ERROR FISIOPATOLÓGICO!: Agonista beta-2 (${cleanDrug}) administrado sin broncoespasmo en patología isquémica, taquiarritmia, tormenta tiroidea o edema pulmonar cardiogénico — induce taquicardia (+16 lpm), mayor consumo miocárdico de O₂ e hipokalemia sin mejorar la hipoxemia.`;
      patientFeelingNote =
        '¡Doctor, siento el corazón muchísimo más acelerado y más opresión en el pecho, no me ayudó a respirar mejor!';
    } else if (isObstructiveAirway || isHyperkalemia) {
      const effectiveDoseMg = parsedDose.puffs ? Math.max(2.5, parsedDose.puffs * 1.2) : mg;
      const doseRatio = clamp(effectiveDoseMg / 5, 0.5, 2.2);
      const gain = isObstructiveAirway ? clamp(Math.round((sameDrugCount >= 2 ? 2 : 5) * Math.min(1.4, doseRatio)), 2, 8) : 0;
      if (isObstructiveAirway) {
        spo2 = clamp(spo2 + gain, 72, isCopd ? 94 : 99);
        rr = clamp(rr - clamp(Math.round(5 * doseRatio), 2, 8), 14, 44);
      }
      hr = clamp(hr + Math.round((sameDrugCount >= 2 ? 7 : 8) * doseRatio), 55, 178);
      effectSeverity = effectiveDoseMg < 1 ? 'parcial' : 'mejoria';
      summary = isHyperkalemia
        ? `Broncodilatador beta-2 (${cleanDose}; acumulado ${totalMg.toFixed(1)} mg) favorece entrada celular de potasio como medida puente en hiperkalemia.`
        : `Broncodilatación dosis-dependiente (${cleanDose}; acumulado ${totalMg.toFixed(1)} mg): mejora SpO₂ y baja la frecuencia respiratoria, con taquicardia beta-2 adrenérgica acumulativa.`;
      patientFeelingNote = isPediatric
        ? 'Después de la nebulización mi niño ya no chilla tanto al respirar y se le hunden menos las costillas, aunque está un poquito inquieto.'
        : isHyperkalemia
          ? 'Siento un poco de temblor en las manos y el corazón algo más rápido, doctor.'
          : 'Siento el pecho mucho más abierto después de la nebulización, doctor; respiro con menos silbido, aunque siento el corazón acelerado.';
    } else {
      hr = clamp(hr + 12, 55, 180);
      effectSeverity = sameDrugCount >= 2 ? 'reaccion_adversa' : 'sin_cambio';
      summary = `Broncodilatador beta-2 (${cleanDose}; acumulado ${totalMg.toFixed(1)} mg) sin broncoespasmo ni hiperkalemia: no corrige neumonía, TEP, neumotórax ni acidosis metabólica (solo genera taquicardia refleja +12 lpm y temblor).`;
      patientFeelingNote =
        'Doctor, sigo respirando igual de agitado y ahora me tiemblan las manos con el corazón más rápido.';
    }
  }
  // 9. ADRENALINA / EPINEFRINA (IM anafilaxia vs Nebulizada crup vs Infusión titulada bloqueo AV completo)
  else if (/\b(adrenalina|epinefrina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 0.5;
    const isCrup = diagNorm.includes('crup') || diagNorm.includes('laringotraque');
    const isTitratedAvBlockInfusion =
      isAvBlock && isIV && mg < 0.05 && /\b(infusion|bomba|titulad|mcg\/min|ug\/min)\b/.test(`${doseNorm} ${freqNorm} ${routeNorm}`);

    if (isInhaled && isCrup) {
      const totalNebMg = mg + cum.adrInhaledMg;
      if (mg > 6 || totalNebMg >= 12) {
        hr = clamp(hr + 36, 60, 188);
        effectSeverity = 'reaccion_adversa';
        summary = `Dosis excesiva/acumulada de Adrenalina nebulizada (${cleanDose}, acumulado ${totalNebMg.toFixed(1)} mg) en crup pediátrico: taquicardia marcada y riesgo de rebote.`;
        patientFeelingNote = 'Mi niño se puso muy agitado, pálido y con el corazón aceleradísimo después de otra nebulización, doctor.';
      } else {
        spo2 = clamp(spo2 + 6, 75, 99);
        rr = clamp(rr - 6, 16, 46);
        hr = clamp(hr + 8, 60, 170);
        effectSeverity = 'mejoria';
        summary = `Vasoconstricción subglótica rápida tras Adrenalina nebulizada (${cleanDose}, acumulado ${totalNebMg.toFixed(1)} mg): disminuye el estridor laríngeo y mejora SpO₂.`;
        patientFeelingNote = '¡Doctor, la nebulización le ayudó muchísimo! Ya no ronca tan feo al meter aire.';
      }
    } else if (isTitratedAvBlockInfusion) {
      hr = clamp(hr + 24, 52, 110);
      sys = clamp(sys + 22, 85, 165);
      dia = clamp(dia + 12, 50, 100);
      if (glasgow < 15) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = 'mejoria';
      summary = `Infusión cronotrópica titulada de Adrenalina IV (${cleanDose}) en Bloqueo AV refractario a atropina: mejora frecuencia de escape (FC ${hr} lpm) y gasto cardíaco mientras se instala marcapasos transcutáneo/transvenoso.`;
      patientFeelingNote = 'Siento menos mareo y el pulso un poco más firme, doctor.';
    } else {
      const totalAdrMg = mg + cum.adrNonInhaledMg;
      const totalAdrCount = 1 + cum.adrNonInhaledCount;
      const pedMaxSafeIm = Math.min(0.5, Math.max(0.15, Number((weightKg * 0.015).toFixed(2))));
      const isOverdoseIM = isPediatric ? mg >= pedMaxSafeIm * 2.5 : mg >= 1.2;
      const isCumulativeToxicity =
        (isPediatric ? totalAdrMg >= pedMaxSafeIm * 4.2 : totalAdrMg >= 1.8) ||
        (!isAnaphylaxis && totalAdrCount >= 2) ||
        (totalAdrCount >= 3 && sys >= 145);

      if (isIV || isOverdoseIM || isCumulativeToxicity) {
        const overdoseScale = clamp(Math.max(mg, totalAdrMg * 0.65) / 0.5, 1.5, 8);
        sys = clamp(sys + Math.round(45 + overdoseScale * 12), 70, 250);
        dia = clamp(dia + Math.round(24 + overdoseScale * 7), 40, 150);
        hr = clamp(hr + Math.round(35 + overdoseScale * 10), 55, 192);
        if (mg >= 2 || totalAdrMg >= 3 || sys >= 230) glasgow = clamp(glasgow - 6, 5, 9);
        effectSeverity = 'reaccion_adversa';
        if ((isIV && mg >= 2) || mg >= 5 || totalAdrMg >= 4.0) {
          isImmediateDeath = true;
          immediateDeathReason = `Fibrilación ventricular refractaria y hemorragia intracerebral masiva por sobredosis/acumulación de Adrenalina (${cleanDose} ${cleanRoute}; acumulado ${totalAdrMg.toFixed(2)} mg) fuera de paro cardiorrespiratorio.`;
          summary = `Muerte inmediata por arritmia ventricular letal y crisis hipertensiva fulminante tras ${cleanDose} (${cleanRoute}; acumulado ${totalAdrMg.toFixed(2)} mg) de Adrenalina.`;
        } else {
          summary = `Crisis adrenérgica / hipertensiva grave por ${isCumulativeToxicity ? 'acumulación excesiva' : 'dosis o vía inadecuada'} de Adrenalina (${cleanDose} ${cleanRoute}; acumulado ${totalAdrMg.toFixed(2)} mg): PA ${sys}/${dia} mmHg, taquiarritmia (${hr} lpm) y riesgo de isquemia/hemorragia intracerebral.`;
        }
        patientFeelingNote =
          glasgow <= 9
            ? '[Crisis hipertensiva severa e inconsciencia súbita tras sobredosis/acumulación de adrenalina]'
            : '¡Doctor, me dio un dolor fuertísimo en el pecho y la cabeza, siento que el corazón se me va a salir del pecho!';
      } else if (isAnaphylaxis) {
        if (mg < (isPediatric ? 0.08 : 0.15)) {
          sys = clamp(sys + 8, 65, 175);
          effectSeverity = 'parcial';
          summary = `Dosis subterapéutica de Adrenalina IM (${cleanDose}); en adulto administrar 0.3-0.5 mg IM (0.01 mg/kg en pediatría).`;
          patientFeelingNote = 'Mejoró apenitas, doctor, pero todavía siento la garganta apretada y mareo.';
        } else {
          sys = clamp(sys + 28, 75, 180);
          dia = clamp(dia + 16, 45, 115);
          spo2 = clamp(spo2 + 6, 75, 99);
          rr = clamp(rr - 4, 14, 42);
          hr = clamp(hr + (hr < 70 ? 22 : -4), 55, 165);
          glasgow = clamp(glasgow + (glasgow < 15 ? 1 : 0), 3, 15);
          effectSeverity = 'mejoria';
          summary =
            `Reversión alfa/beta adrenérgica de anafilaxia con Adrenalina IM (acumulado ${totalAdrMg.toFixed(2)} mg): recuperación rápida de PA y vía aérea.`;
          patientFeelingNote = isPediatric
            ? '¡Doctor, la inyección en la pierna le ayudó rapidísimo! Ya respira más despejado y volvió a abrir bien los ojos.'
            : '¡Doctor, siento que se me destapó la garganta y ya no me siento tan mareado después de la inyección en el muslo!';
        }
      } else {
        sys = clamp(sys + 30, 70, 225);
        dia = clamp(dia + 16, 40, 130);
        hr = clamp(hr + 30, 55, 180);
        effectSeverity = 'reaccion_adversa';
        summary =
          '¡ERROR CRÍTICO!: Adrenalina IM fuera de anafilaxia o paro cardiorrespiratorio (en choque hipovolémico/séptico/cardiogénico la descarga adrenérgica empeora vasoconstricción esplácnica, isquemia miocárdica y taquiarritmias; usar cristaloides o vasopresor titulado en bomba IV).';
        patientFeelingNote =
          '¡Doctor, me late rapidísimo el corazón, me duele el pecho y la cabeza después de esa inyección!';
      }
    }
  }
  // 10. CRISTALOIDES IV (SSN 0.9% / HARTMANN / RINGER — solo benefician hipovolemia/choque/CAD/EHH)
  else if (/\b(salina|ssn|hartmann|ringer|cristaloide|bolo|suero)\b/.test(drugNorm) && !/\b(glucosad|dextrosa|mixta)\b/.test(drugNorm)) {
    const ml = parsedDose.ml ?? (isPediatric ? Math.round(weightKg * 20) : 500);
    const prevFluid = getCumulativePriorDoses(previousHistory, weightKg, /\b(salina|ssn|hartmann|ringer|cristaloide)\b/);
    const mlPerKg = ml / weightKg;
    const totalMl = ml + prevFluid.ml;
    const totalMlPerKg = totalMl / weightKg;
    const isExcessiveFluidLoad =
      (isPulmonaryEdemaOrFluidOverload && sys >= 95) ||
      (isPreeclampsiaOrEclampsia && (ml >= 500 || totalMl >= 1000)) ||
      mlPerKg >= (isPediatric ? 45 : 50) ||
      totalMlPerKg >= 75 ||
      (totalMl >= 2500 && sys >= 120 && !isDkaOrHhs) ||
      ml >= 3000;

    let salineGlucoseDrop = 0;
    if (typeof glucose === 'number' && glucose > 140 && (isDkaOrHhs || glucose >= 240)) {
      const beforeGlu = glucose;
      const volFactor = clamp(ml / 500, 0.3, 4.0);
      if (beforeGlu >= 300) {
        const rawDrop = Math.round(clamp(32 * volFactor, 12, 110));
        glucose = clamp(beforeGlu - rawDrop, 115, 700);
      } else {
        const rawDrop = Math.round(clamp(20 * volFactor, 8, 60));
        glucose = clamp(beforeGlu - rawDrop, 95, 700);
      }
      salineGlucoseDrop = beforeGlu - glucose;
    }

    if (temp >= 38.0 && ml >= 500 && (isShockOrHypovolemic || isDkaOrHhs || isSepsisOrBacterialEmergency)) {
      temp = Number(clamp(temp - 0.2, 36.2, 41.5).toFixed(1));
    }

    const gluNote =
      salineGlucoseDrop > 0
        ? ` y descenso glucémico por hemodilución/depuración renal (-${salineGlucoseDrop} mg/dL → ${glucose} mg/dL)`
        : '';

    if (isExcessiveFluidLoad) {
      const overloadScale = clamp(Math.max(ml, totalMl * 0.35) / (isPediatric ? 500 : 1500), 1, 4.5);
      spo2 = clamp(spo2 - Math.round(6 * overloadScale), 58, 100);
      rr = clamp(rr + Math.round(5 * overloadScale), 12, 46);
      sys = clamp(sys + Math.round(8 * overloadScale), 65, 230);
      if (spo2 < 82) glasgow = clamp(glasgow - 3, 5, 15);
      effectSeverity = 'reaccion_adversa';
      if (totalMlPerKg >= 115 || spo2 <= 66) {
        isImmediateDeath = true;
        immediateDeathReason = `Edema agudo de pulmón fulminante e insuficiencia respiratoria hipoxémica irreversible por sobrecarga hídrica acumulativa (${Math.round(totalMl)} mL / ${Math.round(totalMlPerKg)} mL/kg).`;
        summary = `Muerte inmediata por encharcamiento pulmonar fulminante tras sobrecarga hídrica acumulativa (${Math.round(totalMl)} mL totales).`;
      } else {
        summary = isPreeclampsiaOrEclampsia
          ? `¡RIESGO DE EDEMA PULMONAR EN PREECLAMPSIA!: Bolo liberal de cristaloides (${ml} mL; acumulado ${Math.round(totalMl)} mL) en paciente con fuga capilar y disfunción endotelial eleva riesgo de edema pulmonar agudo (SpO₂ ${spo2}%).`
          : `Sobrecarga hídrica / edema pulmonar agudo iatrogénico tras ${ml} mL (acumulado ${Math.round(totalMl)} mL · ${Math.round(totalMlPerKg)} mL/kg) de cristaloide: caída de SpO₂ a ${spo2}% y taquipnea severa${gluNote}.`;
      }
      patientFeelingNote = isPediatric
        ? '¡Doctor, con tanto suero acumulado mi niño empezó a respirar agitadísimo y se oye encharcado!'
        : '¡Doctor, siento que me ahogo muchísimo más y burbujea el pecho desde que me pasaron tanto suero!';
    } else if (isShockOrHypovolemic || sys < 100 || isDkaOrHhs || isPreloadDependentShock) {
      const refVol = isPediatric ? Math.max(150, weightKg * 20) : 500;
      const volRatio = clamp(ml / refVol, 0.3, 2.5);
      const baseSysGain = sys < 95 ? 16 : 10;
      const sysGain = Math.round(baseSysGain * Math.pow(volRatio, 0.72) * (sameDrugCount >= 2 ? 0.45 : 1));
      const diaGain = Math.round(sysGain * 0.58);
      const hrDrop = Math.round((hr > 100 ? 12 : 5) * Math.pow(volRatio, 0.7) * (sameDrugCount >= 2 ? 0.5 : 1));
      sys = clamp(sys + sysGain, 65, 175);
      dia = clamp(dia + diaGain, 42, 108);
      hr = clamp(hr - hrDrop, 55, 170);
      if (glasgow < 15 && bp.sys < 95) glasgow = clamp(glasgow + 1, 3, 15);
      effectSeverity = sysGain >= 6 || salineGlucoseDrop >= 15 || isDkaOrHhs ? 'mejoria' : 'parcial';
      summary = `Expansión intravascular fisiológica con ${ml} mL de cristaloide (acumulado ${Math.round(totalMl)} mL): mejora precarga y PA (+${sysGain}/+${diaGain} mmHg)${gluNote}.`;
      patientFeelingNote = isPediatric
        ? 'Con el suero en la venita mi niño ya no está tan frío ni decaído, se ve un poco más despejado.'
        : salineGlucoseDrop >= 18
          ? 'Con el suero por la vena siento menos boca seca, menos sed y menos mareo, doctor.'
          : 'Con el suero por la vena siento menos mareo al mover la cabeza y menos boca seca, doctor.';
    } else if (ml >= 2000 || totalMl >= 2500) {
      spo2 = clamp(spo2 - 5, 70, 100);
      rr = clamp(rr + 5, 12, 42);
      sys = clamp(sys + 10, 70, 210);
      dia = clamp(dia + 5, 40, 125);
      effectSeverity = 'reaccion_adversa';
      summary = `Carga acumulada excesiva de volumen (${ml} mL; acumulado ${Math.round(totalMl)} mL) en paciente normotenso: congestión pulmonar y caída de SpO₂ a ${spo2}%${gluNote}.`;
      patientFeelingNote = 'Me siento muy agitado del pecho con tanto líquido que me han pasado, doctor.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Cristaloide IV (${ml} mL; acumulado ${Math.round(totalMl)} mL) en paciente normovolémico sin choque ni cetoacidosis: no corrige la etiología aguda${gluNote}.`;
      patientFeelingNote = 'El suero pasa por la vena, doctor, pero mis síntomas principales siguen igual.';
    }
  }
  // 11. FUROSEMIDA IV (estrictamente edema agudo de pulmón / sobrecarga hídrica o hiperkalemia estable)
  else if (/\b(furosemida|diuretico)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 40;
    const totalMg = mg + cum.furoMg;
    const totalCount = 1 + cum.furoCount;
    const cumFuroNote = cum.furoCount > 0 ? ` (acumulado ${Math.round(totalMg)} mg en ${totalCount} dosis)` : '';
    const isCumulativeOverdoseFuro =
      totalMg >= 200 ||
      (isPediatric && totalMg / weightKg >= 5) ||
      (totalCount >= 3 && !isPulmonaryEdemaOrFluidOverload);
    const isOverdoseFuro =
      mg >= 240 || (isPediatric && mg / weightKg >= 4) || isCumulativeOverdoseFuro;
    const isFatalFuro = totalMg >= 480 || (isPediatric && totalMg / weightKg >= 10);

    if (isFatalFuro) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Colapso hipovolémico severo y arritmia ventricular por hipokalemia fulminante tras acumulación extrema de Furosemida (${Math.round(totalMg)} mg totales).`;
      summary = `Muerte inmediata por depleción vascular extrema e hipokalemia letal tras acumulación de Furosemida (${Math.round(totalMg)} mg).`;
    } else if (
      ((isShockOrHypovolemic || isPreloadDependentShock || isDengue || isDkaOrHhs || isPreeclampsiaOrEclampsia) &&
        !isPulmonaryEdemaOrFluidOverload) ||
      isOverdoseFuro
    ) {
      const ratio = clamp(Math.max(mg, totalMg * 0.4) / 40, 0.8, 5);
      sys = clamp(sys - Math.round(18 * ratio), 50, 220);
      dia = clamp(dia - Math.round(10 * ratio), 28, 130);
      hr = clamp(hr + Math.round(14 * ratio), 55, 182);
      if (sys < 80) glasgow = clamp(glasgow - 2, 6, 15);
      effectSeverity = 'reaccion_adversa';
      summary = isOverdoseFuro
        ? `${isCumulativeOverdoseFuro && mg < 240 ? 'Toxicidad acumulativa' : 'Sobredosis'} de Furosemida (${cleanDose}${cumFuroNote}): depleción intravascular severa, hipokalemia aguda, lesión renal prerrenal y riesgo de ototoxicidad.`
        : `¡ERROR FISIOPATOLÓGICO!: Furosemida (${cleanDose}${cumFuroNote}) en paciente con hipovolemia, choque, CAD/EHH, dengue, preeclampsia o choque obstructivo agrava depleción intravascular, hemoconcentración e hipoperfusión renal.`;
      patientFeelingNote =
        '¡Doctor, me siento muchísimo más mareado, con calambres, zumbido de oídos y el corazón acelerado después de esa dosis!';
    } else if (isPulmonaryEdemaOrFluidOverload) {
      const ratio = clamp(mg / 40, 0.4, 3.0);
      spo2 = clamp(spo2 + Math.round(5 * Math.min(1.5, ratio)), 74, 99);
      rr = clamp(rr - Math.round(5 * Math.min(1.4, ratio)), 14, 42);
      sys = clamp(sys - Math.round((sys > 130 ? 12 : 6) * ratio), 78, 220);
      hr = clamp(hr - (sys >= 95 ? 6 : -8), 55, 170);
      effectSeverity = sys < 90 ? 'reaccion_adversa' : 'mejoria';
      summary =
        sys < 90
          ? `Diuresis y venodilatación intensa tras ${cleanDose} de furosemida${cumFuroNote} con caída excesiva de presión arterial.`
          : `Venodilatación y diuresis tras ${cleanDose} de furosemida${cumFuroNote}: reduce precarga pulmonar y mejora SpO₂ en edema agudo de pulmón / sobrecarga hídrica.`;
      patientFeelingNote =
        sys < 90
          ? 'Ya respiro un poco mejor pero me siento muy mareado y flojo desde que me pusieron otra dosis, doctor.'
          : 'Ya siento menos ahogo en el pecho y ganas de orinar después de la ampolla, doctor.';
    } else if (isHyperkalemia && sys >= 105) {
      sys = clamp(sys - 6, 70, 220);
      effectSeverity = 'mejoria';
      summary = `Diurético de asa (${cleanDose}${cumFuroNote}) en hiperkalemia con volemia preservada: promueve kaliuresis renal.`;
      patientFeelingNote = 'Me dieron ganas de ir al baño después de esa dosis, doctor.';
    } else {
      const ratio = clamp(mg / 40, 0.4, 3.0);
      sys = clamp(sys - Math.round(12 * ratio), 64, 220);
      dia = clamp(dia - Math.round(7 * ratio), 38, 130);
      hr = clamp(hr + Math.round(8 * ratio), 55, 170);
      effectSeverity = sys < 90 ? 'reaccion_adversa' : 'sin_cambio';
      summary = `Diurético (${cleanDose}${cumFuroNote}) sin sobrecarga hídrica ni edema pulmonar: no resuelve asma, TEP, neumotórax ni neumonía y produce depleción de volumen inoportuna.`;
      patientFeelingNote =
        sys < 90
          ? 'Me dieron muchas ganas de orinar y me siento muy mareado y débil, doctor.'
          : 'Me dieron ganas de orinar, doctor, pero sigo con la misma molestia principal.';
    }
  }
  // 12. DEXTROSA IV (acumulativa: hiperosmolaridad progresiva)
  else if (/\b(dextrosa|glucosa|glucosada|mixta)\b/.test(drugNorm)) {
    let grams = parsedDose.mg ? parsedDose.mg / 1000 : 25;
    if (!parsedDose.mg && parsedDose.ml) {
      const pct = parsedDose.percent ?? (drugNorm.includes('50') ? 50 : drugNorm.includes('10') ? 10 : drugNorm.includes('5') || drugNorm.includes('mixta') ? 5 : 50);
      grams = (parsedDose.ml * pct) / 100;
    }
    const totalGrams = grams + cum.dextroseGrams;
    const cumDexNote = cum.dextroseGrams > 0 ? ` (acumulado ${Math.round(totalGrams)} g)` : '';
    const scale = clamp(grams / 25, 0.3, 4.5);
    const gaveThiamine = previousHistory.some((h) => /\b(tiamina|vitamina b1)\b/.test(norm(h.drug)));

    if (isAlcoholWithdrawal && !gaveThiamine) {
      if (typeof glucose === 'number') {
        glucose = clamp(glucose + Math.round(60 * scale), 40, 650);
      }
      glasgow = clamp(glasgow - 2, 6, 15);
      effectSeverity = 'reaccion_adversa';
      summary =
        'Riesgo crítico: administración de Dextrosa IV sin Tiamina (Vitamina B1) previa en paciente con abstinencia alcohólica/Delirium Tremens; puede precipitar Encefalopatía de Wernicke aguda.';
      patientFeelingNote =
        'Doctor, me siento más desorientado, veo doble y me cuesta enfocar la vista...';
    } else if (isPorphyria) {
      if (typeof glucose === 'number') {
        glucose = clamp(glucose + Math.round(35 * scale), 65, 280);
      }
      hr = clamp(hr - (hr > 95 ? 8 : 2), 55, 165);
      effectSeverity = 'mejoria';
      summary = `Terapia metabólica de rescate en Porfiria Aguda Intermitente (${cleanDose}${cumDexNote} de dextrosa): el aporte de carbohidratos IV reprime la ALA-sintasa hepática y atenúa la crisis neurovisceral.`;
      patientFeelingNote = 'Siento que la intensidad de los retortijones y el malestar están disminuyendo poco a poco, doctor.';
    } else if (typeof glucose === 'number' && glucose < 75) {
      const gain = Math.round(85 * clamp(grams / 25, 0.4, 2.5));
      glucose = clamp(glucose + gain, 35, 340);
      hr = clamp(hr - (hr > 95 ? 16 : 4), 58, 160);
      if (sys < 90) sys = clamp(sys + 16, 65, 160);
      glasgow = clamp(Math.max(glasgow + 4, 14), 3, 15);
      effectSeverity = 'mejoria';
      summary = `Corrección rápida de hipoglucemia (+${gain} mg/dL → ${glucose} mg/dL) tras ${cleanDose}${cumDexNote} de dextrosa: recuperación del estado de alerta (Glasgow ${glasgow}/15).`;
      patientFeelingNote = isPediatric
        ? '¡Doctor, despertó enseguida con el suero dulce! Ya me mira y dejó de temblar.'
        : '¡Qué cambio, doctor! Se me quitó el temblor, el sudor frío y ya pienso con claridad otra vez.';
    } else {
      if (typeof glucose === 'number') {
        glucose = clamp(glucose + Math.round(52 * scale), 40, 700);
      }
      const isOsmoticOverload =
        (typeof glucose === 'number' && glucose >= 250 && totalGrams >= 75) ||
        (typeof glucose === 'number' && glucose >= 400 && totalGrams >= 150) ||
        totalGrams >= 125;
      if (isOsmoticOverload) {
        const severeHyper = typeof glucose === 'number' && glucose >= 400 && totalGrams >= 150;
        sys = clamp(sys - 8, 65, 225);
        hr = clamp(hr + 12, 50, 178);
        glasgow = clamp(glasgow - (severeHyper ? 4 : 2), 6, 15);
        effectSeverity = 'reaccion_adversa';
        summary = `Hiperosmolaridad y diuresis osmótica iatrogénica por acumulación de dextrosa (${cleanDose}${cumDexNote}; glucemia ${glucose ?? '--'} mg/dL): deshidratación celular y deterioro neurológico (Glasgow ${glasgow}/15).`;
        patientFeelingNote =
          'Doctor, tengo muchísima sed, la boca completamente seca, orino demasiado y me siento muy embotado...';
      } else {
        sys = clamp(sys + 4, 65, 225);
        hr = clamp(hr + 3, 50, 175);
        const hyperComa = typeof glucose === 'number' && glucose >= 350;
        effectSeverity = hyperComa || grams >= 80 ? 'reaccion_adversa' : 'parcial';
        summary =
          typeof glucose === 'number' && glucose >= 250
            ? `Aporte contraindicado de dextrosa (${cleanDose}${cumDexNote}) en paciente hiperglucémico: empeora hiperosmolaridad (glucemia sube a ${glucose} mg/dL).`
            : `Aporte de dextrosa (${cleanDose}${cumDexNote}) sin hipoglucemia previa: elevación glucémica a ${glucose ?? '--'} mg/dL y leve expansión osmótica.`;
        patientFeelingNote = hyperComa
          ? 'Doctor, tengo muchísima sed, la boca seca y me siento muy embotado...'
          : 'Sentí un poco de calor y ardor en la vena con ese suero, doctor.';
      }
    }
  }
  // 13. OPIOIDES / BENZODIACEPINAS (acumulativos con carga SNC unificada descontando antídotos)
  else if (/\b(morfina|fentanilo|tramadol|diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/.test(drugNorm)) {
    const isFentanyl = drugNorm.includes('fentanilo');
    const isMorphine = drugNorm.includes('morfina');
    const isTramadol = drugNorm.includes('tramadol');
    const isLorazOrMidaz = /\b(lorazepam|midazolam|clonazepam)\b/.test(drugNorm);
    const isDiazepam = drugNorm.includes('diazepam');

    const defaultMg = isFentanyl ? 0.05 : isMorphine ? 4 : isLorazOrMidaz ? 2 : isTramadol ? 50 : 10;
    const mg = parsedDose.mg ?? defaultMg;
    const mgPerKg = mg / weightKg;

    const addedMeq = isFentanyl ? mg * 100 : isTramadol ? mg * 0.1 : isMorphine ? mg : 0;
    const addedDeq = drugNorm.includes('lorazepam')
      ? mg * 5
      : drugNorm.includes('midazolam')
        ? mg * 3.33
        : drugNorm.includes('clonazepam')
          ? mg * 10
          : isDiazepam || drugNorm.includes('alprazolam')
            ? mg
            : 0;

    const totalMeq = cum.unreversedOpioidMeq + addedMeq;
    const totalDeq = cum.unreversedBenzoDeq + addedDeq;
    const cnsLoad =
      totalMeq / 10 + totalDeq / 20 + cum.propofolMg / 150 + cum.sedatingAdjunctCount * 0.25;
    const hasPriorSed = cum.unreversedOpioidMeq > 0 || cum.unreversedBenzoDeq > 0 || cum.propofolMg > 0;

    const isCumulativeDepressant = cnsLoad >= 1.1;
    const isCumulativeApnea = cnsLoad >= 2.2;
    const isCumulativeFulminant = cnsLoad >= 4.8;

    // Umbrales toxicológicos reales diferenciados por potencia + acumulación no revertida
    const severeOpioid =
      (isFentanyl && (mg >= 0.25 || mgPerKg >= 0.004)) ||
      (isMorphine && (mg >= 10 || mgPerKg >= 0.22)) ||
      (isTramadol && (mg >= 350 || mgPerKg >= 6)) ||
      isCumulativeDepressant;
    const lethalOpioid =
      (isFentanyl && mg >= 0.5) ||
      (isMorphine && mg >= 25) ||
      (isTramadol && mg >= 600) ||
      isCumulativeApnea;

    const severeBenzo =
      (isLorazOrMidaz && (mg >= 8 || mgPerKg >= 0.25)) ||
      (isDiazepam && (mg >= 25 || mgPerKg >= 0.55)) ||
      isCumulativeDepressant;
    const lethalBenzo =
      (isLorazOrMidaz && mg >= 18) ||
      (isDiazepam && mg >= 50) ||
      isCumulativeApnea;

    const isObstructiveContra = isObstructiveAirway && (isMorphine || isFentanyl || isDiazepam || isLorazOrMidaz);
    const isHypotensiveContra = sys < 90 && (isMorphine || isDiazepam || isLorazOrMidaz);
    const isNeuroOpioidContra =
      (isMorphine || isFentanyl || isTramadol) &&
      (isNeurologicEmergency || spo2 < 90 || (isInferiorStemi && isMorphine) || (isSerotoninSyndrome && (isTramadol || isFentanyl)));
    const isNeuroBenzoContra =
      !isObstructiveAirway &&
      !isStatusEpilepticus &&
      !isAlcoholWithdrawal &&
      !isSerotoninSyndrome &&
      (isDiazepam || isLorazOrMidaz || drugNorm.includes('alprazolam')) &&
      (isNeurologicEmergency || spo2 < 88);

    const fulminantArrest =
      (isFentanyl && mg >= 2.0) ||
      (isMorphine && mg >= 60) ||
      (isLorazOrMidaz && mg >= 40) ||
      (isDiazepam && mg >= 100) ||
      isCumulativeFulminant;

    if (lethalOpioid || lethalBenzo || severeOpioid || severeBenzo || isObstructiveContra || isHypotensiveContra || isNeuroOpioidContra || isNeuroBenzoContra) {
      const isApneaLevel = lethalOpioid || lethalBenzo;
      rr = clamp(rr - (isApneaLevel ? 14 : 7), isApneaLevel ? 4 : 7, 40);
      spo2 = clamp(spo2 - (isApneaLevel ? 22 : 7), 65, 100);
      sys = clamp(sys - (isApneaLevel ? 36 : isInferiorStemi ? 22 : 16), 54, 220);
      dia = clamp(dia - (isApneaLevel ? 20 : 10), 32, 130);
      hr = clamp(hr - (isApneaLevel ? 28 : 8), 36, 170);
      glasgow = clamp(glasgow - (isApneaLevel || spo2 < 86 ? 9 : 4), 3, isApneaLevel || spo2 < 86 ? 8 : 11);
      effectSeverity = 'reaccion_adversa';
      const cumTag = hasPriorSed ? ' (efecto depresor acumulativo de SNC)' : '';
      if (fulminantArrest) {
        isImmediateDeath = true;
        immediateDeathReason = `Apnea fulminante y paro cardiorrespiratorio hipóxico irreversible tras sobredosis/acumulación extrema de ${cleanDrug} (${cleanDose}${cumTag}).`;
        summary = `Muerte inmediata por apnea fulminante y paro hipóxico tras sobredosis/acumulación de ${cleanDrug} (${cleanDose}).`;
      } else if (isInferiorStemi && isMorphine) {
        summary = `¡ERROR EN IAM INFERIOR/VD!: Morfina (${cleanDose}) reduce peligrosamente la precarga ventricular derecha e inhibe absorción de antiagregantes P2Y12 (PA cae a ${sys}/${dia} mmHg).`;
      } else if (isNeuroOpioidContra || isNeuroBenzoContra) {
        summary = `¡ERROR NEUROLÓGICO/RESPIRATORIO!: ${cleanDrug} (${cleanDose}) agrava el deterioro del estado de alerta (Glasgow ${glasgow}/15) o la hipoxemia y enmascara la exploración neurológica urgente.`;
      } else {
        summary = isApneaLevel
          ? `Sobredosis/acumulación letal y paro respiratorio inminente por ${cleanDrug} (${cleanDose}${cumTag}): bradipnea extrema (FR ${rr} rpm), hipoxemia grave (SpO₂ ${spo2}%), coma (Glasgow ${glasgow}/15) — requiere Naloxona/Flumazenil y ventilación asistida inmediata.`
          : `Depresión respiratoria y hemodinámica aguda tras ${cleanDose} de ${cleanDrug}${cumTag}${isObstructiveContra ? ' en paciente con insuficiencia respiratoria obstructiva' : isHypotensiveContra ? ' en paciente con choque/hipotensión' : ''}: FR cae a ${rr} rpm, SpO₂ a ${spo2}% y paciente inconsciente (Glasgow ${glasgow}/15).`;
      }
      patientFeelingNote =
        glasgow <= 9
          ? '[Alerta crítica: paciente inconsciente en coma con pausas apneicas y cianosis tras dosis depresora del SNC]'
          : 'Doctor... tengo muchísimo sueño... siento los párpados muy pesados y respiro más lento...';
    } else if (cnsLoad >= 0.7 && hasPriorSed) {
      rr = clamp(rr - 3, 10, 38);
      glasgow = clamp(glasgow - 1, 10, 15);
      hr = clamp(hr - 5, 52, 165);
      effectSeverity = 'parcial';
      summary = `Sedación acumulativa moderada tras ${cleanDose} de ${cleanDrug} (carga SNC acumulada en aumento): FR baja a ${rr} rpm; vigilar depresión ventilatoria si agrega más dosis.`;
      patientFeelingNote = 'Me siento bastante adormilado y algo lento para responder después de esa otra dosis, doctor.';
    } else if (
      (isStatusEpilepticus || isAlcoholWithdrawal || isSerotoninSyndrome || isPanicOrSympathomimetic) &&
      (isDiazepam || isLorazOrMidaz || drugNorm.includes('alprazolam'))
    ) {
      hr = clamp(hr - (hr > 96 ? 14 : 6), 55, 165);
      rr = clamp(rr - (rr > 20 ? 3 : 1), 12, 38);
      effectSeverity = 'mejoria';
      summary = `Control GABAérgico adecuado tras ${cleanDose} de ${cleanDrug} (yugulación de crisis/rigidez/agitación autonómica sin depresión respiratoria).`;
      patientFeelingNote = isPediatric
        ? 'Ya cedieron las sacudidas y el niño está más tranquilo, doctor.'
        : 'Ya me disminuyó bastante el temblor y la agitación, doctor; me siento más calmado.';
    } else if (
      (isMorphine || isFentanyl || isTramadol) &&
      (isSeverePainEmergency || (isIschemicChestPain && !isInferiorStemi) || (isPulmonaryEdemaOrFluidOverload && isMorphine && sys >= 115))
    ) {
      hr = clamp(hr - (hr > 96 ? 10 : 4), 55, 165);
      rr = clamp(rr - (rr > 20 ? 2 : 0), 12, 38);
      if ((isMorphine || isFentanyl) && sys > 110) sys = clamp(sys - 6, 88, 220);
      effectSeverity = 'mejoria';
      summary = `Analgesia opioide titulada (${cleanDose} de ${cleanDrug}) en dolor agudo severo / edema pulmonar con PA preservada: atenúa respuesta simpática al dolor.`;
      patientFeelingNote = isPediatric
        ? 'Ya se quedó más calmadito y sin tanto dolor agudo, doctor.'
        : 'Ya me calmó bastante el dolor intenso, doctor; respiro un poco menos angustiado.';
    } else {
      rr = clamp(rr - 2, 11, 38);
      glasgow = clamp(glasgow - (glasgow > 13 ? 1 : 0), 10, 15);
      effectSeverity = 'sin_cambio';
      summary = `Sedante/opioide (${cleanDose} de ${cleanDrug}) sin indicación prioritaria en este cuadro: ligera depresión autonómica sin resolver la causa base.`;
      patientFeelingNote = 'Me siento algo atontado y con sueño, doctor, pero mi problema principal sigue igual.';
    }
  }
  // 14. ÁCIDO ACETILSALICÍLICO (ASA) / ANTIAGREGANTES (acumulativo: gastrolesión y salicilismo)
  else if (isAsaDrug || /\b(clopidogrel|ticagrelor|prasugrel)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? (isAsaDrug ? 300 : 75);
    const totalAsaMg = isAsaDrug ? mg + cum.asaMg : 0;
    if (isAsaDrug && totalAsaMg >= 10000) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Intoxicación salicílica fulminante, acidosis metabólica severa y edema pulmonar/cerebral por acumulación extrema de Ácido Acetilsalicílico (${Math.round(totalAsaMg)} mg).`;
      summary = `Muerte inmediata por intoxicación salicílica letal tras acumulación de ASA (${Math.round(totalAsaMg)} mg).`;
    } else if (isAsaDrug && totalAsaMg >= 3000) {
      rr = clamp(rr + 8, 14, 42);
      temp = Number(clamp(temp + 0.4, 36.2, 41.5).toFixed(1));
      sys = clamp(sys - 12, 60, 220);
      hr = clamp(hr + 20, 55, 180);
      glasgow = clamp(glasgow - 2, 7, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Salicilismo agudo por acumulación de Ácido Acetilsalicílico (${cleanDose}; acumulado ${Math.round(totalAsaMg)} mg): hiperventilación, acúfenos, fiebre, deshidratación y riesgo de acidosis metabólica.`;
      patientFeelingNote = '¡Doctor, me zumban fuertísimo los oídos, tengo calor, náuseas y respiro muy agitado!';
    } else if (isAsaDrug && totalAsaMg >= 900) {
      hr = clamp(hr + 8, 50, 175);
      sys = clamp(sys - (totalAsaMg >= 1500 ? 8 : 2), 65, 220);
      effectSeverity = totalAsaMg >= 1500 ? 'reaccion_adversa' : 'parcial';
      summary = `Acumulación de Ácido Acetilsalicílico (${Math.round(totalAsaMg)} mg acumulados): alto riesgo de gastritis erosiva y hemorragia digestiva alta sin beneficio antiagregante adicional.`;
      patientFeelingNote = 'Siento bastante ardor y dolor en la boca del estómago con tanta aspirina, doctor.';
    } else if (isIschemicChestPain || isIschemicStroke || diagNorm.includes('kawasaki')) {
      hr = clamp(hr - (hr > 85 ? 4 : 2), 50, 170);
      sys = clamp(sys - (sys > 125 ? 4 : 2), 68, 220);
      effectSeverity = 'mejoria';
      summary = `Antiagregación plaquetaria de carga (${cleanDrug} ${cleanDose}) iniciada oportunamente en ventana isquémica/antiagregante.`;
      patientFeelingNote =
        'Ya mastiqué/tragué la pastilla, doctor. Sigo vigilado mientras hace efecto.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Antiagregante (${cleanDrug} ${cleanDose}) sin indicación isquémica aguda en este caso: inhibición plaquetaria innecesaria con riesgo hemorrágico.`;
      patientFeelingNote = 'Ya me tragué la pastilla, doctor, aunque no siento mejoría de mis síntomas.';
    }
  }
  // 15. PARACETAMOL / METAMIZOL (fisiopatología de fiebre infecciosa vs hipertermia endocrina vs sepsis)
  else if (/\b(paracetamol|acetaminofen|antipiret|metamizol|dipirona)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 1000;
    const isParacetamol = /\b(paracetamol|acetaminofen|antipiret)\b/.test(drugNorm);
    const isMetamizol = /\b(metamizol|dipirona)\b/.test(drugNorm);
    const totalParaMg = isParacetamol ? mg + cum.paracetamolMg : 0;
    const totalMetaMg = isMetamizol ? mg + cum.metamizolMg : 0;
    const totalMetaCount = isMetamizol ? 1 + cum.metamizolCount : 0;

    const isFulminantPara =
      isParacetamol && (totalParaMg >= 10000 || (isPediatric && totalParaMg / weightKg >= 150));
    const isHepatotoxicOverdose =
      isParacetamol && (totalParaMg >= 4000 || (isPediatric && totalParaMg / weightKg >= 75));
    const isCumulativeMetamizol = isMetamizol && (totalMetaMg >= 4000 || totalMetaCount >= 3);

    if ((isMetamizol && sys < 100) || isCumulativeMetamizol) {
      sys = clamp(sys - (isCumulativeMetamizol ? 18 : 22), 54, 220);
      dia = clamp(dia - 12, 32, 130);
      hr = clamp(hr + (isCumulativeMetamizol ? 16 : 18), 50, 178);
      effectSeverity = 'reaccion_adversa';
      summary = isCumulativeMetamizol
        ? `Hipotensión vasodilatadora acumulativa y riesgo de agranulocitosis por Metamizol repetido (${cleanDose}; acumulado ${Math.round(totalMetaMg)} mg en ${totalMetaCount} dosis): PA cae a ${sys}/${dia} mmHg.`
        : `Hipotensión severa agravada por Metamizol (${cleanDose}) en paciente hemodinámicamente inestable (PA cae a ${sys}/${dia} mmHg).`;
      patientFeelingNote = '¡Doctor, me dio mucho mareo, calor en la cara y sudor frío después de esa ampolla!';
    } else if (isFulminantPara || isHepatotoxicOverdose) {
      hr = clamp(hr + (isFulminantPara ? 22 : 10), 55, 180);
      sys = clamp(sys - (isFulminantPara ? 14 : 6), 58, 220);
      if (isFulminantPara) glasgow = clamp(glasgow - 3, 6, 15);
      effectSeverity = 'reaccion_adversa';
      const cumNote = cum.paracetamolMg > 0 ? ` · acumulado ${Math.round(totalParaMg)} mg` : '';
      summary = isFulminantPara
        ? `Falla hepática aguda fulminante / encefalopatía por acumulación masiva de Paracetamol (${cleanDose}${cumNote}, ${Math.round(totalParaMg / weightKg)} mg/kg): requiere N-acetilcisteína urgente.`
        : `Toxicidad hepática acumulativa por Paracetamol (${cleanDose}${cumNote}, ${Math.round(totalParaMg / weightKg)} mg/kg): supera umbral seguro (4 g/24h o 75 mg/kg) con riesgo de necrosis hepática — iniciar N-acetilcisteína.`;
      patientFeelingNote = isFulminantPara
        ? 'Doctor, tengo náuseas intensas, dolor fuerte en el costado derecho y me siento muy confundido...'
        : 'Doctor, me siento con náuseas fuertes y dolor en la boca del estómago tras tanta dosis acumulada.';
    } else if (isEndocrineHyperthermia) {
      effectSeverity = 'sin_cambio';
      summary = `Antipirético (${cleanDrug} ${cleanDose}) ineficaz sobre hipertermia endocrina/central (${isThyroidStorm ? 'Tormenta Tiroidea' : 'Síndrome Serotoninérgico'}): el ascenso térmico no es mediado por PGE2 hipotalámica sino por hipermetabolismo/hipertonía (tratar la causa y usar medios físicos).`;
      patientFeelingNote = 'Sigo igual de caliente y sudoroso, doctor, esa medicina no me bajó la fiebre.';
    } else if (temp >= 37.8) {
      const scale = clamp(mg / 1000, 0.5, 1.3);
      const tempDrop = Number((0.8 * scale * (sameDrugCount >= 1 ? 0.5 : 1)).toFixed(1));
      temp = Number(clamp(temp - tempDrop, 36.4, 41.5).toFixed(1));
      hr = clamp(hr - (hr > 95 ? 8 : 4), 55, 165);
      if (isMetamizol && sys > 105) {
        sys = clamp(sys - 6, 85, 220);
        dia = clamp(dia - 3, 50, 130);
      }
      const isSepticShockMasking = isSepsisOrBacterialEmergency && (bp.sys < 100 || glasgow < 15 || isMeningitis);
      effectSeverity = isSepticShockMasking ? 'parcial' : 'mejoria';
      const cumNote = isParacetamol && cum.paracetamolMg > 0 ? ` (acumulado ${Math.round(totalParaMg)} mg)` : isMetamizol && cum.metamizolMg > 0 ? ` (acumulado ${Math.round(totalMetaMg)} mg)` : '';
      summary = isSepticShockMasking
        ? `Descenso térmico sintomático (-${tempDrop.toFixed(1)} °C) tras ${cleanDrug}${cumNote}, pero NO trata la sepsis/infección grave subyacente (prioridad: antimicrobiano IV en la primera hora y soporte de perfusión).`
        : `Descenso térmico progresivo (-${tempDrop.toFixed(1)} °C) y alivio de taquicardia febril tras ${cleanDose} de ${cleanDrug}${cumNote}.`;
      patientFeelingNote = isPediatric
        ? 'Ya le empezó a bajar un poco la calentura al niño, doctor; empezó a sudar suave y se queja menos.'
        : 'Ya siento que me está bajando un poco la calentura, doctor, aunque sigo débil.';
    } else if (isSeverePainEmergency || isColicOrSpasm || /\b(migran|cefalea|lumbalgia|esguince|otitis|faring|artritis|gota|dismenorrea|herpes)\b/.test(diagNorm)) {
      effectSeverity = 'parcial';
      hr = clamp(hr - (hr > 80 ? 4 : 1), 52, 165);
      const cumNote = isParacetamol && cum.paracetamolMg > 0 ? ` (acumulado ${Math.round(totalParaMg)} mg)` : isMetamizol && cum.metamizolMg > 0 ? ` (acumulado ${Math.round(totalMetaMg)} mg)` : '';
      summary = `Analgésico (${cleanDrug} ${cleanDose}${cumNote}) administrado: alivio sintomático leve del dolor sin impacto etiológico en patología de urgencia.`;
      patientFeelingNote = 'Siento un alivio ligero del dolor, doctor, aunque la molestia de base continúa.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Analgésico/antipirético (${cleanDrug} ${cleanDose}) en paciente afebril y sin síndrome doloroso tratable con este agente: sin efecto sobre la alteración fisiológica prioritaria.`;
      patientFeelingNote = 'No sentí cambio relevante con esa medicina, doctor.';
    }
  }
  // 16. ANTIEMÉTICOS (gating por QTc/Parkinson/Glaucoma/HPB y utilidad real)
  else if (/\b(ondansetron|metoclopramida|dimenhidrinato|antiemet)\b/.test(drugNorm)) {
    if (drugNorm.includes('ondansetron')) {
      const mg = parsedDose.mg ?? 4;
      const totalOndMg = mg + cum.ondansetronMg;
      const cumNote = cum.ondansetronMg > 0 ? ` (acumulado ${Math.round(totalOndMg)} mg)` : '';
      if (totalOndMg >= 56) {
        isImmediateDeath = true;
        effectSeverity = 'reaccion_adversa';
        immediateDeathReason = `Taquicardia ventricular polimórfica (Torsades de Pointes) y fibrilación ventricular irreversible por prolongación extrema acumulativa del intervalo QTc tras Ondansetrón (${Math.round(totalOndMg)} mg).`;
        summary = `Muerte inmediata por arritmia ventricular (Torsades de Pointes) tras acumulación tóxica de Ondansetrón (${Math.round(totalOndMg)} mg).`;
      } else if (totalOndMg >= 24 || (isPediatric && totalOndMg / weightKg >= 0.6)) {
        hr = clamp(hr + 28, 55, 185);
        sys = clamp(sys - 10, 62, 220);
        effectSeverity = 'reaccion_adversa';
        summary = `Prolongación acumulativa crítica del intervalo QT / riesgo de Torsades de Pointes tras Ondansetrón (${cleanDose}${cumNote}): taquiarritmia (${hr} lpm) y síncope inminente.`;
        patientFeelingNote = '¡Doctor, siento el corazón dando saltos disparejos, palpitaciones fuertes y mucho mareo!';
      } else if (isNauseaVertigoPrimary) {
        hr = clamp(hr - (hr > 98 ? 5 : 3), 52, 165);
        effectSeverity = 'mejoria';
        summary = `Control del reflejo emético con Ondansetrón (${cleanDose}${cumNote}) en cuadro con vómito/náusea prominente.`;
        patientFeelingNote = isPediatric
          ? 'Parece que ya se le calmó el asco al niño, doctor; no ha vuelto a tener arcadas.'
          : 'Ya se me asentó bastante el estómago y se me quitó esa sensación de querer vomitar, doctor.';
      } else if (/\b(nausea|vomito|arcada|emesis|cetoacidosis|pancreatitis|apendicitis|colecistitis|colangitis|dengue|infarto)\b/.test(diagNorm)) {
        effectSeverity = 'parcial';
        summary = `Coadyuvante antiemético (${cleanDrug} ${cleanDose}${cumNote}): controla náuseas secundarias sin resolver la causa orgánica de urgencia.`;
        patientFeelingNote = 'Me calmó un poco el asco, doctor, pero sigo con mi malestar principal.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Ondansetrón (${cleanDose}${cumNote}) administrado sin síndrome emético activo: sin impacto clínico sobre la patología primaria.`;
        patientFeelingNote = 'No tenía náuseas, doctor, así que sigo sintiéndome exactamente igual.';
      }
    } else if (drugNorm.includes('metoclopramida')) {
      const mg = parsedDose.mg ?? 10;
      const totalMetoMg = mg + cum.metoclopramidaMg;
      const totalMetoCount = 1 + cum.metoclopramidaCount;
      if (totalMetoMg >= 30 || totalMetoCount >= 3) {
        hr = clamp(hr + 16, 55, 178);
        sys = clamp(sys + 8, 65, 225);
        effectSeverity = 'reaccion_adversa';
        summary = `Síndrome extrapiramidal agudo por acumulación de Metoclopramida (${cleanDose}, acumulado ${Math.round(totalMetoMg)} mg): distonía cervical/facial, crisis oculógira y acatisia severa.`;
        patientFeelingNote = '¡Doctor, se me tuerce el cuello solo, los ojos se me van para arriba y siento una desesperación terrible!';
      } else if (isNauseaVertigoPrimary) {
        hr = clamp(hr - (hr > 98 ? 5 : 3), 52, 165);
        effectSeverity = 'mejoria';
        summary = `Procinético y control emético con Metoclopramida (${cleanDose}; acumulado ${Math.round(totalMetoMg)} mg).`;
        patientFeelingNote = 'Ya se me calmó un poco la náusea y el malestar estomacal, doctor.';
      } else if (/\b(nausea|vomito|gastroparesia|migran)\b/.test(diagNorm)) {
        effectSeverity = 'parcial';
        summary = `Antiemético coadyuvante (${cleanDrug} ${cleanDose}): atenúa náusea sin tratar la causa primaria.`;
        patientFeelingNote = 'Me asentó ligeramente el estómago, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Metoclopramida (${cleanDose}) sin indicación procinética o emética prioritaria: sin impacto clínico en la evolución.`;
        patientFeelingNote = 'No noté ningún alivio en mi problema principal, doctor.';
      }
    } else {
      const mg = parsedDose.mg ?? 50;
      const totalDimMg = mg + cum.dimenhidrinatoMg;
      const totalDimCount = 1 + cum.dimenhidrinatoCount;
      if (totalDimMg >= 200 || totalDimCount >= 3) {
        glasgow = clamp(glasgow - 3, 8, 15);
        hr = clamp(hr + 18, 55, 178);
        effectSeverity = 'reaccion_adversa';
        summary = `Toxicidad anticolinérgica y sedación excesiva acumulativa por Dimenhidrinato (${cleanDose}, acumulado ${Math.round(totalDimMg)} mg): confusión, boca seca, taquicardia y deterioro del alerta (Glasgow ${glasgow}/15).`;
        patientFeelingNote = 'Doctor, tengo la boca totalmente seca, veo muy borroso y me cuesta mantenerme despierto...';
      } else if (isNeurologicEmergency || isMyasthenia || isGlaucoma || isUrinaryRetention) {
        glasgow = clamp(glasgow - 2, 6, 15);
        effectSeverity = 'reaccion_adversa';
        summary = `Contraindicación anticolinérgica/sedante de Dimenhidrinato (${cleanDose}) en este cuadro: deteriora el estado de alerta o agrava bloqueo colinérgico.`;
        patientFeelingNote = 'Me siento más aturdido, con la boca seca y peor después de esa dosis, doctor.';
      } else if (/\b(vertigo|cinetosis|vestibular|meniere)\b/.test(diagNorm) || isNauseaVertigoPrimary) {
        hr = clamp(hr - (hr > 98 ? 5 : 3), 52, 165);
        glasgow = clamp(glasgow - (glasgow > 13 ? 1 : 0), 10, 15);
        effectSeverity = 'mejoria';
        summary = `Control vestibular/antiemético con Dimenhidrinato (${cleanDose}) con discreta somnolencia anticolinérgica.`;
        patientFeelingNote = 'Se me calmó el mareo y las náuseas, doctor, aunque me dio algo de sueño.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Dimenhidrinato (${cleanDose}) sin síndrome vestibular o emético activo: solo leve sedación sin beneficio terapéutico.`;
        patientFeelingNote = 'Me dio algo de sueño, pero mis síntomas siguen igual, doctor.';
      }
    }
  }
  // 17. CORTICOIDES SISTÉMICOS (indicaciones específicas: crisis suprarrenal, coma mixedematoso, tormenta tiroidea, obstrucción vía aérea, anafilaxia, meningitis, arteritis temporal)
  else if (/\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|prednisolona|corticoide|esteroide)\b/.test(drugNorm)) {
    const isDex = drugNorm.includes('dexametasona');
    const isMetil = drugNorm.includes('metilprednisolona');
    const rawMg = parsedDose.mg ?? (isDex ? 8 : isMetil ? 80 : 100);
    const hydroEquivMg = isDex ? rawMg * 25 : isMetil ? rawMg * 5 : rawMg;
    const totalHydroMg = hydroEquivMg + cum.hydrocortisoneEquivMg;
    const doseFactor = clamp(hydroEquivMg / 100, 0.5, 3.0);

    let steroidGluDelta = 0;
    if (typeof glucose === 'number') {
      const beforeGlu = glucose;
      const isDiabeticOrHyper = diagNorm.includes('diabet') || diagNorm.includes('cetoacid') || beforeGlu >= 150;
      const gain = Math.round((isDiabeticOrHyper ? 26 : 15) * doseFactor);
      glucose = clamp(beforeGlu + gain, 35, 700);
      steroidGluDelta = glucose - beforeGlu;
    }
    sys = clamp(sys + Math.round(clamp(4 * doseFactor, 3, 12)), 65, 235);
    dia = clamp(dia + Math.round(clamp(2 * doseFactor, 2, 7)), 40, 140);
    if (temp >= 37.8 && !isEndocrineHyperthermia) {
      temp = Number(clamp(temp - 0.3, 36.2, 41.5).toFixed(1));
    }

    const gluStr = steroidGluDelta > 0 ? ` con hiperglucemia corticoidea (+${steroidGluDelta} mg/dL → ${glucose} mg/dL)` : '';
    const isSevereHyperCrisis = typeof glucose === 'number' && glucose >= 380 && isDkaOrHhs;
    const isCumulativeSteroidToxicity =
      totalHydroMg >= 1000 ||
      (totalHydroMg >= 600 && (sys >= 165 || (typeof glucose === 'number' && glucose >= 250)));

    if (isDengue || isSevereHyperCrisis || isCumulativeSteroidToxicity) {
      effectSeverity = 'reaccion_adversa';
      summary = isDengue
        ? `Uso perjudicial de corticoide sistémico (${cleanDrug}) en Dengue: aumenta riesgo de sangrado digestivo e inmunosupresión${gluStr}.`
        : isCumulativeSteroidToxicity
          ? `Toxicidad corticoidea acumulativa (${Math.round(totalHydroMg)} mg equiv. hidrocortisona): hiperglucemia severa, retención hidrosalina/crisis HTA y alto riesgo de hemorragia digestiva${gluStr}.`
          : `Corticoide sistémico (${cleanDrug}) empeora descompensación hiperglucémica severa en CAD/EHH${gluStr}.`;
      patientFeelingNote = isDengue || isCumulativeSteroidToxicity
        ? 'Siento ardor intenso en el estómago, mucha sed y dolor de cabeza, doctor.'
        : 'Tengo más sed y la boca más seca después de esa ampolla, doctor.';
    } else if (isAdrenalCrisis || isMyxedemaComa) {
      sys = clamp(sys + (bp.sys < 100 ? 16 : 6), 65, 165);
      dia = clamp(dia + (bp.sys < 100 ? 9 : 4), 40, 100);
      effectSeverity = 'mejoria';
      summary = isMyxedemaComa
        ? `Hidrocortisona/corticoide IV (${cleanDrug} ${cleanDose}) en Coma Mixedematoso: cobertura obligatoria contra insuficiencia suprarrenal concomitante ANTES de administrar Levotiroxina${gluStr}.`
        : `Reemplazo glucocorticoide de urgencia en Crisis Suprarrenal: restaura sensibilidad vascular a catecolaminas y estabiliza PA${gluStr}.`;
      patientFeelingNote = 'Parece responder un poco mejor la presión arterial tras el esteroide IV, doctor.';
    } else if (isThyroidStorm) {
      effectSeverity = 'mejoria';
      summary = `Corticoide IV en Tormenta Tiroidea (${cleanDrug} ${cleanDose}): inhibe conversión periférica T4→T3 y cubre reserva suprarrenal agotada${gluStr}.`;
      patientFeelingNote = 'Sigo agitado pero bajo manejo integral de tormenta tiroidea, doctor.';
    } else if (diagNorm.includes('arteritis de celulas gigantes') || isMeningitis || isObstructiveAirway || isAnaphylaxis || diagNorm.includes('crup') || diagNorm.includes('stevens')) {
      if (isObstructiveAirway || diagNorm.includes('crup')) {
        rr = clamp(rr - (rr > 22 ? 2 : 0), 14, 42);
        spo2 = clamp(spo2 + (spo2 < 95 ? 2 : 0), 74, 99);
      }
      effectSeverity = isMeningitis || diagNorm.includes('arteritis de celulas gigantes') || isObstructiveAirway ? 'mejoria' : 'parcial';
      summary = `Corticoide sistémico indicado (${cleanDrug} ${cleanDose}): reduce inflamación meníngea/vascular/bronquial (inicio progresivo en 2-4 h)${gluStr}.`;
      patientFeelingNote = isPediatric
        ? 'Ya le pasaron la dosis para desinflamar; mi niño parece tolerarla bien.'
        : 'Sentí un poquito de calor al pasar el medicamento, doctor.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Corticoide sistémico (${cleanDrug} ${cleanDose}) sin indicación en este cuadro: solo eleva glucemia/PA levemente sin beneficio terapéutico${gluStr}.`;
      patientFeelingNote = 'No noto mejoría de mis síntomas con esa ampolla, doctor.';
    }
  }
  // 18. SULFATO DE MAGNESIO IV (eclampsia/preeclampsia severa, estatus asmático, Torsades/TV polimorfa)
  else if (/\b(sulfato de magnesio|magnesio|mgso4)\b/.test(drugNorm)) {
    const grams = parsedDose.mg ? parsedDose.mg / 1000 : 4;
    const totalGrams = grams + cum.unreversedMgGrams;
    const renalRisk = isRenalFailureOrHyperK && totalGrams >= 4;
    const severeMg = grams >= 8 || totalGrams >= 10 || (isPediatric && (grams * 1000) / weightKg >= 100) || renalRisk;
    const lethalMg = grams >= 12 || totalGrams >= 16;

    if (severeMg) {
      const scale = lethalMg ? 2.2 : 1.0;
      rr = clamp(rr - Math.round(7 * scale), 5, 40);
      spo2 = clamp(spo2 - Math.round(6 * scale), 70, 100);
      sys = clamp(sys - Math.round(18 * scale), 56, 220);
      dia = clamp(dia - Math.round(11 * scale), 32, 130);
      hr = clamp(hr - Math.round(16 * scale), 36, 170);
      glasgow = clamp(glasgow - Math.round(6 * scale), 4, 9);
      effectSeverity = 'reaccion_adversa';
      if (grams >= 20 || totalGrams >= 24) {
        isImmediateDeath = true;
        immediateDeathReason = `Parálisis respiratoria completa y bloqueo auriculoventricular total irreversible por hipermagnesemia extrema tras ${cleanDose} de Sulfato de Magnesio (acumulado ${totalGrams.toFixed(1)} g).`;
        summary = `Muerte inmediata por hipermagnesemia letal tras acumulación de Sulfato de Magnesio (${totalGrams.toFixed(1)} g).`;
      } else {
        summary = `Hipermagnesemia severa / bloqueo neuromuscular por ${lethalMg ? 'acumulación/sobredosis grave de' : renalRisk ? 'acumulación renal de' : 'dosis excesiva de'} Sulfato de Magnesio (${cleanDose}, acumulado no revertido ${totalGrams.toFixed(1)} g): arreflexia, bradipnea (FR ${rr} rpm), hipotensión e inconsciencia (Glasgow ${glasgow}/15; antídoto: Gluconato de Calcio IV).`;
      }
      patientFeelingNote =
        glasgow <= 9
          ? '[Alerta crítica: paciente inconsciente con flacidez muscular generalizada y bradipnea severa por hipermagnesemia]'
          : 'Doctor, siento mucho bochorno, muchísima pesadez muscular y me cuesta trabajo mantener los ojos abiertos o respirar hondo...';
    } else if (isPreeclampsiaOrEclampsia || isObstructiveAirway || isVentricularTachycardia || isAlcoholWithdrawal) {
      sys = clamp(sys - (sys > 140 ? 10 : 5), 78, 220);
      dia = clamp(dia - (dia > 90 ? 6 : 3), 46, 130);
      if (isObstructiveAirway) {
        rr = clamp(rr - (rr > 22 ? 3 : 1), 12, 40);
        spo2 = clamp(spo2 + (spo2 < 94 ? 3 : 0), 74, 99);
      }
      effectSeverity = 'mejoria';
      summary = `Neuroprotección en eclampsia/preeclampsia severa, estabilización de membrana o broncodilatación adyuvante tras Sulfato de Magnesio (${cleanDose}, acumulado ${totalGrams.toFixed(1)} g).`;
      patientFeelingNote =
        'Sentí bastante calor en la cara y el brazo mientras pasaba el suero, doctor, pero ya me siento más tranquilo.';
    } else {
      sys = clamp(sys - 6, 62, 220);
      dia = clamp(dia - 4, 36, 130);
      hr = clamp(hr + 4, 48, 175);
      effectSeverity = sys < 90 ? 'reaccion_adversa' : 'sin_cambio';
      summary = `Sulfato de Magnesio (${cleanDose}, acumulado ${totalGrams.toFixed(1)} g) sin indicación específica (eclampsia, asma refractaria ni Torsades): solo vasodilatación y bochorno transitorio.`;
      patientFeelingNote = 'Sentí calor y bochorno al pasar ese suero, doctor, pero mi cuadro sigue igual.';
    }
  }
  // 19. ATROPINA / CALCIO / ANTÍDOTOS / ANTIARRÍTMICOS / TROMBOLÍTICOS (acumulativos)
  else if (/\b(atropina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 1;
    const totalAtrMg = mg + cum.atropinaMg;
    const cumNote = cum.atropinaMg > 0 ? ` (acumulado ${totalAtrMg.toFixed(1)} mg)` : '';
    if (isThyroidStorm) {
      hr = clamp(hr + 28, 70, 190);
      temp = Number(clamp(temp + 0.3, 36.5, 41.5).toFixed(1));
      effectSeverity = 'reaccion_adversa';
      summary = `¡ERROR EN TORMENTA TIROIDEA!: Atropina (${cleanDose}) bloquea el freno vagal y agrava la taquiarritmia (${hr} lpm) y la hipertermia.`;
      patientFeelingNote = '¡Doctor, el corazón me late todavía más rápido y siento mucho calor!';
    } else if (!isOrganophosphate && (totalAtrMg >= 3 || (hr >= 115 && mg >= 1))) {
      hr = clamp(hr + 40, 70, 186);
      sys = clamp(sys + 8, 65, 225);
      glasgow = clamp(glasgow - 2, 7, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Toxicidad anticolinérgica / delirium y taquiarritmia severa tras Atropina (${cleanDose}${cumNote}, FC ${hr} lpm) sin intoxicación colinérgica.`;
      patientFeelingNote = '¡Doctor, tengo la boca completamente seca, veo borroso, siento mucho calor y el corazón me galopa rapidísimo!';
    } else if (isOrganophosphate) {
      hr = clamp(hr + (hr < 80 ? 28 : 14), 60, 130);
      sys = clamp(sys + (sys < 100 ? 12 : 4), 65, 190);
      spo2 = clamp(spo2 + 6, 75, 100);
      rr = clamp(rr - (rr > 24 ? 3 : 0), 12, 38);
      effectSeverity = 'mejoria';
      summary = `Atropinización efectiva en síndrome colinérgico (${cleanDose}${cumNote}): seca secreciones bronquiales/broncorrea y revierte bradicardia (FC ${hr} lpm, SpO₂ ${spo2}%).`;
      patientFeelingNote = 'Ya siento la respiración más limpia, menos flema y menos mareo, doctor.';
    } else if (isInfranodalAvBlock) {
      hr = clamp(hr + 3, 28, 120);
      effectSeverity = 'parcial';
      summary = `Respuesta cronotrópica mínima/ineficaz tras Atropina (${cleanDose}${cumNote}) en bloqueo AV infranodal (completo / Mobitz II): el nodo AV responde poco o nada a vagólisis; iniciar marcapasos transcutáneo o infusión de Dopamina/Adrenalina IV.`;
      patientFeelingNote = 'Sigo igual de mareado y lento del pulso, doctor, no sentí casi mejoría.';
    } else if (hr < 58) {
      hr = clamp(hr + 26, 55, 125);
      sys = clamp(sys + (sys < 100 ? 10 : 4), 65, 190);
      effectSeverity = 'mejoria';
      summary = `Incremento cronotrópico en bradiarritmia nodal tras Atropina (${cleanDose}${cumNote}): FC sube a ${hr} lpm.`;
      patientFeelingNote = 'Ya siento menos mareo y el pulso más fuerte, doctor.';
    } else {
      hr = clamp(hr + 18, 60, 165);
      effectSeverity = 'sin_cambio';
      summary = `Atropina (${cleanDose}${cumNote}) administrada en paciente sin bradicardia ni síndrome colinérgico: solo produce taquicardia vagolítica y sequedad bucal sin beneficio clínico.`;
      patientFeelingNote = 'Siento la boca seca y el corazón más rápido, pero mi molestia principal sigue igual, doctor.';
    }
  } else if (/\b(gluconato de calcio|cloruro de calcio)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 1000;
    const totalCalcMg = mg + cum.calciumMg;
    const hasRecentMgToxicity =
      cum.unreversedMgGrams >= 4 ||
      previousHistory.some(
        (h) => h.effectSeverity === 'reaccion_adversa' && /\b(magnesio|mgso4)\b/.test(norm(h.drug))
      );
    if (hasRecentMgToxicity) {
      rr = clamp(Math.max(rr + 7, 15), 12, 36);
      spo2 = clamp(Math.max(spo2 + 8, 95), 75, 99);
      sys = clamp(sys + (sys < 95 ? 20 : 6), 70, 180);
      dia = clamp(dia + (dia < 60 ? 12 : 4), 42, 110);
      hr = clamp(Math.max(hr + 16, 68), 55, 160);
      glasgow = clamp(Math.max(glasgow + 6, 14), 3, 15);
      effectSeverity = 'mejoria';
      summary = `Reversión rápida de bloqueo neuromuscular por hipermagnesemia tras ${cleanDose} de Calcio IV: recuperación ventilatoria (FR ${rr} rpm) y neurológica (Glasgow ${glasgow}/15).`;
      patientFeelingNote = 'Ya puedo abrir los ojos y respirar mejor, doctor; se me quitó esa debilidad paralizante.';
    } else if (isHyperkalemia && totalCalcMg < 6000) {
      hr = clamp(hr + (hr < 55 ? 12 : -3), 50, 155);
      sys = clamp(sys + 4, 65, 220);
      effectSeverity = 'mejoria';
      summary = `Estabilización inmediata de membrana miocárdica con Calcio IV (${cleanDose}; acumulado ${Math.round(totalCalcMg)} mg) en hiperkalemia severa.`;
      patientFeelingNote = 'Sentí un calorcito breve en el cuerpo al pasar la ampolla, doctor, sigo vigilado.';
    } else if (totalCalcMg >= 9000) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Hipercalcemia letal acumulativa y paro cardíaco en sístole tras administración excesiva de Calcio IV (${Math.round(totalCalcMg)} mg).`;
      summary = `Muerte inmediata por hipercalcemia fulminante tras acumulación de Calcio IV (${Math.round(totalCalcMg)} mg).`;
    } else if (totalCalcMg >= 4000) {
      hr = clamp(hr - 14, 38, 165);
      sys = clamp(sys + 10, 65, 225);
      glasgow = clamp(glasgow - 2, 7, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Hipercalcemia iatrogénica acumulativa tras Calcio IV (${cleanDose}; acumulado ${Math.round(totalCalcMg)} mg): bradicardia, somnolencia y riesgo de arritmia por bloqueo de conducción.`;
      patientFeelingNote = '¡Doctor, siento mucho bochorno, náuseas, debilidad rara y el corazón más lento!';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Calcio IV administrado (${cleanDose}; acumulado ${Math.round(totalCalcMg)} mg) sin hiperkalemia ni hipocalcemia/hipermagnesemia documentada: sin beneficio clínico relevante.`;
      patientFeelingNote = 'Sentí un calorcito breve al pasar la medicina por la vena, pero sigo igual, doctor.';
    }
  } else if (/\b(naloxona|flumazenil|acetilcisteina|n acetilcisteina|nac)\b/.test(drugNorm)) {
    if (drugNorm.includes('naloxona')) {
      const mg = parsedDose.mg ?? 0.4;
      const totalNalMg = mg + cum.naloxonaMg;
      const hadOpioidDepression =
        rr <= 11 ||
        glasgow <= 11 ||
        cum.unreversedOpioidMeq > 0 ||
        previousHistory.some((h) => /\b(morfina|fentanilo|tramadol)\b/.test(norm(h.drug)));
      if (hadOpioidDepression && totalNalMg < 8) {
        rr = clamp(Math.max(rr + 9, 16), 14, 34);
        spo2 = clamp(Math.max(spo2 + 16, 96), 80, 99);
        sys = clamp(sys + (sys < 95 ? 22 : 6), 75, 175);
        hr = clamp(Math.max(hr + 18, 72), 55, 165);
        glasgow = clamp(Math.max(glasgow + 8, 14), 3, 15);
        effectSeverity = 'mejoria';
        summary = `Antagonismo opioide inmediato con Naloxona (${cleanDose}): recuperación rápida del impulso respiratorio (FR ${rr} rpm, SpO₂ ${spo2}%) y del estado de alerta (Glasgow ${glasgow}/15).`;
        patientFeelingNote = '¡Ay, doctor, desperté de golpe! Ya puedo respirar hondo otra vez.';
      } else if (totalNalMg >= 4) {
        sys = clamp(sys + 22, 70, 235);
        hr = clamp(hr + 28, 55, 182);
        spo2 = clamp(spo2 - 4, 72, 100);
        effectSeverity = 'reaccion_adversa';
        summary = `Descarga simpática de rebote por acumulación de Naloxona (${totalNalMg.toFixed(1)} mg): hipertensión reactiva, taquicardia y riesgo de edema pulmonar no cardiogénico.`;
        patientFeelingNote = '¡Doctor, siento agitación extrema, sudoración, el corazón desbocado y dolor intenso repentino!';
      } else {
        sys = clamp(sys + 6, 65, 220);
        hr = clamp(hr + 6, 50, 175);
        effectSeverity = 'parcial';
        summary = 'Naloxona administrada sin depresión opioide documentada: leve activación simpática refleja.';
        patientFeelingNote = 'Sentí el pulso un poco más rápido tras esa ampolla, doctor.';
      }
    } else if (drugNorm.includes('flumazenil')) {
      const mg = parsedDose.mg ?? 0.2;
      const totalFluMg = mg + cum.flumazenilMg;
      const hadBenzoDepression =
        rr <= 11 ||
        glasgow <= 11 ||
        cum.unreversedBenzoDeq > 0 ||
        previousHistory.some((h) => /\b(diazepam|lorazepam|midazolam|clonazepam)\b/.test(norm(h.drug)));
      if (totalFluMg >= 3) {
        hr = clamp(hr + 24, 55, 180);
        sys = clamp(sys + 16, 65, 230);
        glasgow = clamp(glasgow - 2, 7, 15);
        effectSeverity = 'reaccion_adversa';
        summary = `Toxicidad proconvulsivante por acumulación de Flumazenil (${totalFluMg.toFixed(1)} mg): riesgo alto de crisis convulsivas refractarias y arritmia por abstinencia aguda de GABA.`;
        patientFeelingNote = '¡Doctor, siento sacudidas en los brazos, muchísima ansiedad y palpitaciones rápidas!';
      } else if (hadBenzoDepression) {
        rr = clamp(Math.max(rr + 7, 15), 14, 34);
        spo2 = clamp(Math.max(spo2 + 12, 95), 80, 99);
        glasgow = clamp(Math.max(glasgow + 8, 14), 3, 15);
        effectSeverity = 'mejoria';
        summary = `Reversión de sedación profunda por benzodiacepinas con Flumazenil (${cleanDose}): recuperación ventilatoria y de conciencia (Glasgow ${glasgow}/15; vigilar resedación).`;
        patientFeelingNote = 'Ya se me despejó la cabeza y ya no siento los párpados tan pesados, doctor.';
      } else {
        hr = clamp(hr + 7, 50, 175);
        sys = clamp(sys + 5, 65, 220);
        effectSeverity = 'parcial';
        summary = 'Flumazenil administrado sin sedación por benzodiacepinas: discreta ansiedad/alerta simpática.';
        patientFeelingNote = 'Me siento un poco más inquieto y con el pulso acelerado, doctor.';
      }
    } else {
      const priorParaToxic = previousHistory.some(
        (h) => h.effectSeverity === 'reaccion_adversa' && /\b(paracetamol|acetaminofen)\b/.test(norm(h.drug))
      );
      if (isAcetaminophenTox || priorParaToxic || cum.paracetamolMg >= 3500) {
        effectSeverity = 'mejoria';
        summary = `Antídoto N-acetilcisteína (${cleanDose}) iniciado oportunamente para reponer glutatión y neutralizar NAPQI hepatotóxico.`;
        patientFeelingNote = 'Sigo bajo cuidado con el suero protector hepático, doctor, algo menos de náusea.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `N-acetilcisteína (${cleanDose}) sin sobredosis de paracetamol: sin efecto sobre la urgencia aguda actual.`;
        patientFeelingNote = 'Me pasaron ese suero con olor fuerte, pero mis síntomas siguen igual, doctor.';
      }
    }
  } else if (/\b(amiodarona|lidocaina|digoxina|adenosina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 150;
    const isAdenosine = drugNorm.includes('adenosina');
    if (isAdenosine) {
      const adMg = parsedDose.mg ?? 6;
      const totalAdenMg = adMg + cum.adenosinaMg;
      const totalAdenCount = 1 + cum.adenosinaCount;
      if (isObstructiveAirway) {
        spo2 = clamp(spo2 - 7, 68, 100);
        rr = clamp(rr + 5, 12, 44);
        hr = clamp(hr - 18, 42, 170);
        effectSeverity = 'reaccion_adversa';
        summary = `Broncoespasmo agudo inducido por Adenosina (${cleanDose}) en paciente con hiperreactividad bronquial/asma/EPOC.`;
        patientFeelingNote = '¡Doctor, sentí que se me cerró el pecho y se me detuvo el corazón un segundo!';
      } else if (totalAdenMg >= 36 || totalAdenCount >= 4) {
        hr = clamp(hr - 24, 38, 160);
        sys = clamp(sys - 14, 58, 210);
        spo2 = clamp(spo2 - 4, 74, 100);
        effectSeverity = 'reaccion_adversa';
        summary = `Acumulación repetida de bolos de Adenosina (${Math.round(totalAdenMg)} mg en ${totalAdenCount} dosis): pausa nodal prolongada, broncoespasmo e hipotensión sostenida.`;
        patientFeelingNote = '¡Doctor, cada bolo me deja sin aire y con pausas horribles en el pecho!';
      } else if (isVentricularTachycardia) {
        sys = clamp(sys - 10, 62, 210);
        effectSeverity = 'reaccion_adversa';
        summary = `Adenosina (${cleanDose}) en Taquicardia Ventricular de QRS ancho: no revierte taquicardias ventriculares y puede precipitar hipotensión; priorizar Amiodarona IV o cardioversión sincronizada.`;
        patientFeelingNote = 'Sentí una opresión y mareo breve en el pecho, doctor, pero el corazón sigue igual de acelerado.';
      } else if (isSvt && hr >= 125) {
        hr = clamp(Math.round(hr * 0.44), 72, 92);
        sys = clamp(sys + (sys < 105 ? 12 : 0), 70, 210);
        effectSeverity = 'mejoria';
        summary = `Bolo rápido de Adenosina (${cleanDose}) en TSVP: pausa AV transitoria y cardioversión exitosa a ritmo sinusal estable (FC ${hr} lpm).`;
        patientFeelingNote = 'Sentí un vuelco fuerte en el pecho y calor en la cara unos segundos, ¡y ya se me calmó por completo el corazón!';
      } else if (isAfibRvr && hr >= 125) {
        effectSeverity = 'parcial';
        summary = `Adenosina (${cleanDose}) en Fibrilación Auricular con RVR: enlentece transitoriamente el nodo AV sin cardiovertir la FA (requiere control sostenido con betabloqueador, diltiazem o amiodarona).`;
        patientFeelingNote = 'Sentí una pausa rara y bochorno unos segundos, pero el corazón volvió a latir rápido e irregular.';
      } else if (hr >= 120 && !isArrhythmiaTachy) {
        sys = clamp(sys - 10, 60, 215);
        effectSeverity = 'reaccion_adversa';
        summary = `Adenosina (${cleanDose}) en taquicardia sinusal compensadora (choque, sepsis, CAD, fiebre o hipoxia): pausa nodal transitoria sin beneficio y descenso de PA.`;
        patientFeelingNote = 'Sentí falta de aire, mareo y que se me detuvo el pecho un instante, pero sigo muy mal.';
      } else {
        hr = clamp(hr - 12, 42, 165);
        sys = clamp(sys - 6, 65, 215);
        effectSeverity = hr < 50 ? 'reaccion_adversa' : 'sin_cambio';
        summary = `Adenosina (${cleanDose}) sin taquicardia supraventricular activa: solo bochorno pasajero y molestia torácica transitoria.`;
        patientFeelingNote = 'Sentí un golpe raro en el pecho y falta de aire unos segundos, doctor.';
      }
    } else {
      const totalMg = drugNorm.includes('digoxina')
        ? (parsedDose.mg ?? 0.25) + cum.digoxinaMg
        : drugNorm.includes('lidocaina')
          ? (parsedDose.mg ?? 100) + cum.lidocainaMg
          : mg + cum.amiodaronaMg;
      const isToxic =
        (drugNorm.includes('digoxina') && totalMg >= 1.5) ||
        (drugNorm.includes('lidocaina') && totalMg >= 300) ||
        (drugNorm.includes('amiodarona') && totalMg >= 900);
      const isFatalAntiarrhythmic =
        (drugNorm.includes('digoxina') && totalMg >= 4.0) ||
        (drugNorm.includes('lidocaina') && totalMg >= 900) ||
        (drugNorm.includes('amiodarona') && totalMg >= 1800);
      if (isFatalAntiarrhythmic) {
        isImmediateDeath = true;
        effectSeverity = 'reaccion_adversa';
        immediateDeathReason = `Asistolia / fibrilación ventricular refractaria por dosis o acumulación fulminante de ${cleanDrug} (acumulado ${totalMg.toFixed(2)} mg).`;
        summary = `Muerte inmediata por paro cardíaco tóxico tras acumulación letal de ${cleanDrug} (${totalMg.toFixed(2)} mg).`;
      } else if (isToxic) {
        hr = clamp(hr - 34, 32, 160);
        sys = clamp(sys - 30, 54, 210);
        dia = clamp(dia - 16, 30, 130);
        glasgow = clamp(glasgow - 6, 5, 9);
        effectSeverity = 'reaccion_adversa';
        summary = `Toxicidad antiarrítmica acumulativa severa tras ${cleanDrug} (${cleanDose}; acumulado ${totalMg.toFixed(2)} mg): bradicardia extrema (${hr} lpm), hipotensión e inconsciencia (Glasgow ${glasgow}/15).`;
        patientFeelingNote = '[Alerta crítica: paciente inconsciente con bradicardia severa e hipotensión aguda tras toxicidad acumulativa antiarrítmica]';
      } else if (drugNorm.includes('digoxina') && (isVentricularTachycardia || isHyperkalemia)) {
        hr = clamp(hr + 18, 40, 185);
        sys = clamp(sys - 16, 58, 215);
        effectSeverity = 'reaccion_adversa';
        summary = `¡ERROR CRÍTICO!: Digoxina (${cleanDose}) en ${isVentricularTachycardia ? 'Taquicardia Ventricular' : 'hiperkalemia/LRA'} favorece toxicidad digitálica y arritmias ventriculares malignas.`;
        patientFeelingNote = '¡Doctor, siento náuseas y saltos muy fuertes e irregulares en el corazón!';
      } else if ((drugNorm.includes('amiodarona') || drugNorm.includes('lidocaina')) && isVentricularTachycardia) {
        hr = clamp(hr - (hr > 130 ? 64 : 26), 66, 125);
        sys = clamp(sys + (sys < 105 ? 6 : 0), 68, 220);
        effectSeverity = hr >= 52 ? 'mejoria' : 'reaccion_adversa';
        summary = `Carga antiarrítmica IV (${cleanDrug} ${cleanDose}; acumulado ${totalMg.toFixed(2)} mg): supresión del foco ectópico ventricular y estabilización hemodinámica (FC ${hr} lpm).`;
        patientFeelingNote = 'El latido fuerte y rápido en el pecho se está controlando poco a poco, doctor.';
      } else if ((drugNorm.includes('amiodarona') || drugNorm.includes('digoxina')) && (isAfibRvr || isSvt)) {
        hr = clamp(hr - (hr > 110 ? 28 : 12), 58, 135);
        sys = clamp(sys - (drugNorm.includes('amiodarona') ? 5 : 0), 68, 220);
        effectSeverity = hr >= 52 ? 'mejoria' : 'reaccion_adversa';
        summary = `Control de ritmo/respuesta ventricular con ${cleanDrug} (${cleanDose}): reduce FC a ${hr} lpm.`;
        patientFeelingNote = 'Siento el pulso más tranquilo y regular, doctor.';
      } else if (hr >= 100 && !isArrhythmiaTachy) {
        sys = clamp(sys - (drugNorm.includes('amiodarona') ? 10 : 4), 60, 220);
        hr = clamp(hr - 8, 52, 175);
        effectSeverity = isShockOrHypovolemic || sys < 105 ? 'reaccion_adversa' : 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) aplicado en taquicardia sinusal compensadora (no es arritmia primaria): riesgo de hipotensión y depresión miocárdica sin tratar la causa subyacente.`;
        patientFeelingNote = 'Me siento algo más mareado tras ese medicamento, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Antiarrítmico (${cleanDrug} ${cleanDose}) sin taquiarritmia tributaria en este caso: sin efecto terapéutico agudo.`;
        patientFeelingNote = 'No siento mejoría de mi cuadro con ese medicamento, doctor.';
      }
    }
  } else if (/\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban)\b/.test(drugNorm)) {
    const isLytic = /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(drugNorm);
    const totalLyticMg = isLytic ? (parsedDose.mg ?? 50) + cum.lyticMg : 0;
    const totalHepUi = drugNorm.includes('heparina') ? (parsedDose.ui ?? 5000) + cum.heparinaUi : 0;
    const totalEnoxMg = drugNorm.includes('enoxaparina') ? (parsedDose.mg ?? 40) + cum.enoxaparinaMg : 0;

    const isAntithrombFatal =
      (isLytic && totalLyticMg >= 180) ||
      (drugNorm.includes('heparina') && totalHepUi >= 40000) ||
      (drugNorm.includes('enoxaparina') && totalEnoxMg >= 400);
    const isAntithrombOverdose =
      (isLytic && totalLyticMg >= 110) ||
      (drugNorm.includes('heparina') && totalHepUi >= 20000) ||
      (drugNorm.includes('enoxaparina') && totalEnoxMg >= 200);

    if (isAntithrombFatal) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Hemorragia intracerebral o exanguinación masiva irreversible por acumulación/sobredosis letal de ${cleanDrug} (${cleanDose}).`;
      summary = `Muerte inmediata por hemorragia masiva tras acumulación letal de ${cleanDrug} (${cleanDose}).`;
    } else if (isAntithrombOverdose) {
      effectSeverity = 'reaccion_adversa';
      sys = clamp(sys - 28, 56, 220);
      dia = clamp(dia - 16, 32, 130);
      hr = clamp(hr + 28, 55, 180);
      glasgow = clamp(glasgow - 6, 5, 9);
      summary = `Toxicidad hemorrágica acumulativa por anticoagulante/fibrinolítico (${cleanDose} de ${cleanDrug}): riesgo crítico de hemorragia intracerebral o sistémica mayor e inconsciencia (Glasgow ${glasgow}/15).`;
      patientFeelingNote = '[El paciente presentó cefalea explosiva súbita, sangrado activo y pérdida de conciencia tras sobrecarga anticoagulante/fibrinolítica]';
    } else if (isIschemicChestPain || isIschemicStroke || isAcutePulmonaryEmbolism || isAfibRvr || strictDiagNorm.includes('trombosis')) {
      effectSeverity = 'mejoria';
      summary = `Terapia antitrombótica/reperfusión indicada (${cleanDose} de ${cleanDrug}) iniciada oportunamente para limitar trombo o revascularizar; vigilar datos de sangrado.`;
      patientFeelingNote = 'Ya me pasaron la medicación, doctor, sigo quieto y bajo vigilancia.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Anticoagulante/fibrinolítico (${cleanDose} de ${cleanDrug}) sin indicación trombótica demostrada en este caso: expone a riesgo hemorrágico sin beneficio.`;
      patientFeelingNote = 'No noté mejoría con ese medicamento, doctor.';
    }
  }
  // 20. FÁRMACOS ADICIONALES ESPECÍFICOS (CON ACUMULACIÓN REAL Y EFECTOS SECUNDARIOS)
  else if (/\b(verapamilo|diltiazem)\b/.test(drugNorm)) {
    const isVera = drugNorm.includes('verapamilo');
    const mg = parsedDose.mg ?? (isVera ? 5 : 15);
    const totalMg = mg + (isVera ? cum.verapamiloMg : cum.diltiazemMg);
    const isFatalCcb = isVera ? totalMg >= 45 : totalMg >= 150;
    const isToxicCcb = isVera ? totalMg >= 20 : totalMg >= 60;
    if (isFatalCcb) {
      isImmediateDeath = true;
      effectSeverity = 'reaccion_adversa';
      immediateDeathReason = `Bloqueo AV completo y asistolia refractaria por acumulación letal de ${cleanDrug} (${Math.round(totalMg)} mg).`;
      summary = `Muerte inmediata por asistolia tras acumulación tóxica de ${cleanDrug} (${Math.round(totalMg)} mg).`;
    } else if (isVentricularTachycardia || sys < 92 || hr < 55 || isToxicCcb || isPulmonaryEdemaOrFluidOverload || isPreloadDependentShock) {
      sys = clamp(sys - (isVentricularTachycardia ? 32 : 24), 48, 220);
      dia = clamp(dia - 15, 28, 130);
      hr = clamp(isVentricularTachycardia ? hr + 14 : hr - 22, 32, 190);
      if (sys < 80 || hr < 42) glasgow = clamp(glasgow - 4, 6, 12);
      effectSeverity = 'reaccion_adversa';
      summary = isVentricularTachycardia
        ? `¡ERROR CRÍTICO!: ${cleanDrug} en Taquicardia Ventricular de QRS ancho induce vasoplejia severa, choque (${sys}/${dia} mmHg) y riesgo inminente de fibrilación ventricular.`
        : `Bloqueo nodal e inotropismo negativo perjudicial tras ${cleanDrug} (${cleanDose}): empeora disfunción ventricular/hipotensión (${sys}/${dia} mmHg).`;
      patientFeelingNote = '¡Doctor, me siento muy mareado, frío y siento que me voy a desmayar!';
    } else if (hr >= 100 && !isArrhythmiaTachy && !isHypertensiveCrisis) {
      sys = clamp(sys - 12, 65, 220);
      dia = clamp(dia - 7, 40, 130);
      hr = clamp(hr - 10, 52, 165);
      effectSeverity = isShockOrHypovolemic || sys < 105 ? 'reaccion_adversa' : 'sin_cambio';
      summary = `${cleanDrug} (${cleanDose}) en taquicardia sinusal compensadora: descender la respuesta sinusal y el inotropismo sin tratar la causa empeora perfusión.`;
      patientFeelingNote = 'Me siento algo más flojo y mareado después de ese medicamento, doctor.';
    } else if (isSvt || isAfibRvr || isHypertensiveCrisis) {
      hr = clamp(hr - (hr > 100 ? 26 : 12), 52, 155);
      sys = clamp(sys - 14, 78, 220);
      dia = clamp(dia - 8, 44, 130);
      effectSeverity = 'mejoria';
      summary = `Calcioantagonista no-dihidropiridínico (${cleanDrug} ${cleanDose}): control eficaz del nodo AV / poscarga (FC ${hr} lpm, PA ${sys}/${dia} mmHg).`;
      patientFeelingNote = 'Siento el pulso más pausado y menos palpitaciones, doctor.';
    } else {
      sys = clamp(sys - 8, 72, 220);
      effectSeverity = 'sin_cambio';
      summary = `${cleanDrug} (${cleanDose}) sin taquiarritmia supraventricular ni emergencia hipertensiva: solo ligero descenso de PA sin beneficio específico.`;
      patientFeelingNote = 'No noté mejoría de mi problema principal, doctor.';
    }
  } else if (/\b(sildenafil|tadalafil|vardenafil)\b/.test(drugNorm)) {
    sys = clamp(sys - 14, 65, 220);
    dia = clamp(dia - 8, 40, 130);
    hr = clamp(hr + 8, 50, 175);
    effectSeverity = sys < 90 ? 'reaccion_adversa' : 'sin_cambio';
    summary = `Vasodilatación sistémica por inhibidor PDE5 (${cleanDrug} ${cleanDose}): descenso de PA y taquicardia refleja (contraindica nitratos).`;
    patientFeelingNote = 'Siento algo de bochorno en la cara, la nariz tapada y leve mareo, doctor.';
  } else if (/\b(bicarbonato|nahco3)\b/.test(drugNorm)) {
    const meq = parsedDose.meq ?? (parsedDose.mg ? parsedDose.mg / 84 : 50);
    const totalMeq = meq + cum.bicarbMeq;
    if (totalMeq >= 200) {
      sys = clamp(sys + 6, 65, 225);
      effectSeverity = 'reaccion_adversa';
      glasgow = clamp(glasgow - 2, 8, 15);
      summary = `Alcalosis metabólica iatrogénica, hipokalemia y sobrecarga sódica por acumulación de Bicarbonato (${cleanDose}; acumulado ${Math.round(totalMeq)} mEq).`;
      patientFeelingNote = 'Siento hormigueo en los labios y dedos, espasmos musculares y algo de confusión, doctor.';
    } else if (isHyperkalemia || isMethanol || diagNorm.includes('antidepresivo triciclico') || diagNorm.includes('rabdomiolisis')) {
      sys = clamp(sys + 4, 65, 225);
      rr = clamp(rr - (rr > 24 ? 2 : 0), 10, 42);
      hr = clamp(hr - (isHyperkalemia ? 6 : 0), 48, 175);
      effectSeverity = 'mejoria';
      summary = isMethanol
        ? `Alcalinización con Bicarbonato de Sodio IV (${cleanDose}) en intoxicación por metanol: atrapa ácido fórmico en forma ionizada y reduce toxicidad retiniana/neurológica.`
        : `Bicarbonato de Sodio IV (${cleanDose}; acumulado ${Math.round(totalMeq)} mEq): amortiguación ácido-base e introducción intracelular de K⁺ / bloqueo de toxicidad de membrana.`;
      patientFeelingNote = 'Sentí un poco de ardor en la vena al pasar ese medicamento, doctor.';
    } else if (isDkaOrHhs) {
      effectSeverity = isPediatric ? 'reaccion_adversa' : 'sin_cambio';
      if (isPediatric) glasgow = clamp(glasgow - 2, 6, 15);
      summary = isPediatric
        ? `¡ALERTA EN CAD PEDIÁTRICA!: Bicarbonato de Sodio de rutina eleva riesgo de edema cerebral, hipokalemia y acidosis paradójica del SNC (priorizar SSN + Insulina).`
        : `Bicarbonato de Sodio de rutina en CAD/EHH sin indicación (solo considerar si pH < 6.9): puede provocar hipokalemia aguda, retraso en aclaramiento de cetonas y acidosis paradójica del SNC.`;
      patientFeelingNote = 'Sigo igual de sediento y agitado tras ese suero, doctor.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Bicarbonato de Sodio (${cleanDose}) sin acidosis metabólica tóxica ni hiperkalemia: sin efecto terapéutico sobre el cuadro.`;
      patientFeelingNote = 'Sentí leve ardor en la vena, pero mis síntomas siguen igual, doctor.';
    }
  } else if (/\b(manitol)\b/.test(drugNorm)) {
    const grams = parsedDose.mg ? parsedDose.mg / 1000 : 50;
    const totalGrams = grams + cum.manitolGrams;
    if (isPulmonaryEdemaOrFluidOverload || isShockOrHypovolemic) {
      spo2 = clamp(spo2 - (isPulmonaryEdemaOrFluidOverload ? 6 : 2), 68, 100);
      rr = clamp(rr + (isPulmonaryEdemaOrFluidOverload ? 5 : 2), 12, 44);
      sys = clamp(sys + (isPulmonaryEdemaOrFluidOverload ? 10 : -12), 58, 230);
      effectSeverity = 'reaccion_adversa';
      summary = isPulmonaryEdemaOrFluidOverload
        ? `Manitol (${cleanDose}) contraindicado en sobrecarga hídrica: expansión intravascular inicial agrava edema pulmonar.`
        : `Manitol (${cleanDose}) contraindicado en choque/hipovolemia: induce diuresis osmótica y agrava la depleción intravascular.`;
      patientFeelingNote = '¡Doctor, me siento peor y más mareado desde que me pasaron ese suero rápido!';
    } else if (totalGrams >= 150) {
      sys = clamp(sys - 16, 58, 220);
      hr = clamp(hr + 18, 55, 180);
      glasgow = clamp(glasgow - 2, 7, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Deshidratación hiperosmolar e injuria renal aguda por acumulación de Manitol (${cleanDose}; acumulado ${Math.round(totalGrams)} g).`;
      patientFeelingNote = '¡Doctor, tengo sed extrema, mareo fuerte al mover la cabeza y mucha debilidad!';
    } else if (isGlaucoma || isHemorrhagicStroke || isNeurologicEmergency) {
      if (glasgow < 15 && glasgow > 6) glasgow = clamp(glasgow + 1, 3, 15);
      hr = clamp(hr - (isGlaucoma && hr > 90 ? 8 : 0), 50, 175);
      effectSeverity = 'mejoria';
      summary = isGlaucoma
        ? `Diuresis osmótica con Manitol IV (${cleanDose}): reduce rápidamente el volumen vítreo y la presión intraocular en glaucoma agudo.`
        : `Terapia hiperosmolar con Manitol (${cleanDose}; acumulado ${Math.round(totalGrams)} g): reduce hipertensión endocraneana / edema cerebral.`;
      patientFeelingNote = isGlaucoma
        ? 'Siento que empieza a bajar un poco la presión insoportable en el ojo, doctor.'
        : 'Siento muchas ganas de orinar tras ese suero, doctor.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Manitol (${cleanDose}) sin hipertensión intracraneal ni glaucoma agudo: diuresis osmótica injustificada.`;
      patientFeelingNote = 'Me dieron ganas de orinar pero mi problema sigue igual, doctor.';
    }
  } else if (/\b(espironolactona|amilorida)\b/.test(drugNorm)) {
    const totalCount = 1 + cum.kSparingCount;
    const totalMg = (parsedDose.mg ?? 50) + cum.kSparingMg;
    sys = clamp(sys - 6, 65, 220);
    dia = clamp(dia - 3, 40, 130);
    hr = clamp(hr + (isHyperkalemia || totalCount >= 3 ? -8 : 0), 42, 170);
    effectSeverity = isHyperkalemia || totalCount >= 3 || totalMg >= 200 ? 'reaccion_adversa' : 'sin_cambio';
    summary = isHyperkalemia
      ? `Contraindicación crítica: diurético ahorrador de potasio (${cleanDrug}) en hiperkalemia / lesión renal aguda.`
      : totalCount >= 3 || totalMg >= 200
        ? `Riesgo acumulativo de hiperkalemia por dosis repetidas de ${cleanDrug} (${Math.round(totalMg)} mg).`
        : `Antagonista de aldosterona (${cleanDrug} ${cleanDose}): sin efecto estabilizador en urgencias agudas (acción diferida en días).`;
    patientFeelingNote = 'Ya me tomé la pastilla para orinar que me indicó, doctor.';
  } else if (/\b(propofol|ketamina|haloperidol|fenitoina|levetiracetam|valproico|carbamazepina)\b/.test(drugNorm)) {
    const mg = parsedDose.mg ?? 100;
    if (drugNorm.includes('propofol')) {
      const totalPropMg = mg + cum.propofolMg;
      const isFatalProp = totalPropMg >= 450;
      const isHighProp =
        totalPropMg >= 180 ||
        sys < 95 ||
        cum.unreversedOpioidMeq >= 6 ||
        cum.unreversedBenzoDeq >= 10;
      if (isFatalProp) {
        isImmediateDeath = true;
        effectSeverity = 'reaccion_adversa';
        immediateDeathReason = `Apnea irreversible, vasoplejia profunda y paro cardiorrespiratorio por acumulación extrema de Propofol (${Math.round(totalPropMg)} mg).`;
        summary = `Muerte inmediata por apnea y colapso vasopléjico tras acumulación letal de Propofol (${Math.round(totalPropMg)} mg).`;
      } else {
        sys = clamp(sys - (isHighProp ? 34 : 20), 48, 220);
        dia = clamp(dia - (isHighProp ? 18 : 11), 28, 130);
        rr = clamp(rr - (isHighProp ? 8 : 4), 5, 40);
        spo2 = clamp(spo2 - (isHighProp ? 10 : 3), 68, 100);
        glasgow = clamp(glasgow - (isHighProp ? 7 : 4), 3, 15);
        effectSeverity = isHighProp || !isStatusEpilepticus ? 'reaccion_adversa' : 'parcial';
        summary = `${isHighProp ? 'Hipotensión y depresión ventilatoria severa acumulativa' : 'Sedación profunda y vasodilatación'} por Propofol (${cleanDose}; acumulado ${Math.round(totalPropMg)} mg).`;
        patientFeelingNote = glasgow <= 9 ? '[Paciente sedado profundamente / inconsciente tras Propofol]' : 'Me siento muy mareado y me vence el sueño rápidamente...';
      }
    } else if (drugNorm.includes('ketamina')) {
      const totalKetMg = (parsedDose.mg ?? 50) + cum.ketaminaMg;
      const totalKetCount = 1 + cum.ketaminaCount;
      sys = clamp(sys + 16, 65, 235);
      dia = clamp(dia + 10, 40, 140);
      hr = clamp(hr + 16, 50, 185);
      glasgow = clamp(glasgow - 3, 6, 15);
      const isExcessKet = isHypertensiveCrisis || isIschemicChestPain || totalKetMg >= 250 || totalKetCount >= 3;
      effectSeverity = isExcessKet ? 'reaccion_adversa' : 'parcial';
      summary = isExcessKet
        ? `Agitación disociativa severa, descarga hipertensiva/isquémica o acumulación por Ketamina (${cleanDose}; acumulado ${Math.round(totalKetMg)} mg).`
        : `Disociación simpaticomimética tras Ketamina (${cleanDose}): ascenso de PA y FC preservando reflejos de vía aérea.`;
      patientFeelingNote = 'Siento el cuerpo raro, como desconectado, alucinaciones y el corazón rápido, doctor...';
    } else if (drugNorm.includes('haloperidol')) {
      const halMg = parsedDose.mg ?? 5;
      const totalHalMg = halMg + cum.haloperidolMg;
      if (totalHalMg >= 15) {
        hr = clamp(hr + 24, 55, 182);
        sys = clamp(sys - 8, 65, 220);
        effectSeverity = 'reaccion_adversa';
        summary = `Acumulación tóxica de Haloperidol (${cleanDose}; acumulado ${Math.round(totalHalMg)} mg): riesgo grave de prolongación del QTc (Torsades de Pointes) y síndrome neuroléptico/extrapiramidal.`;
        patientFeelingNote = '¡Doctor, siento rigidez en la mandíbula y el cuello y saltos raros en el corazón!';
      } else if (strictDiagNorm.includes('delirium') || strictDiagNorm.includes('psicosis') || strictDiagNorm.includes('esquizofrenia') || strictDiagNorm.includes('agitacion')) {
        hr = clamp(hr - (hr > 85 ? 8 : 3), 50, 170);
        sys = clamp(sys - 6, 68, 220);
        glasgow = clamp(glasgow - (glasgow > 13 ? 1 : 0), 8, 15);
        effectSeverity = 'mejoria';
        summary = `Contención conductual tras Haloperidol (${cleanDose}; acumulado ${Math.round(totalHalMg)} mg) en agitación/delirium severo.`;
        patientFeelingNote = 'Me siento más calmado y un poco somnoliento después de esa dosis, doctor.';
      } else {
        glasgow = clamp(glasgow - (glasgow > 13 ? 1 : 0), 8, 15);
        effectSeverity = 'sin_cambio';
        summary = `Haloperidol (${cleanDose}) sin indicación por agitación grave o psicosis: sedación innecesaria y riesgo de QTc prolongado sin beneficio en el cuadro.`;
        patientFeelingNote = 'Me siento atontado, pero mis síntomas siguen igual, doctor.';
      }
    } else if (drugNorm.includes('fenitoina')) {
      const fenMg = parsedDose.mg ?? 500;
      const totalFenMg = fenMg + cum.fenitoinaMg;
      if (totalFenMg >= 1800) {
        sys = clamp(sys - 20, 56, 220);
        hr = clamp(hr - 18, 40, 170);
        glasgow = clamp(glasgow - 3, 6, 15);
        effectSeverity = 'reaccion_adversa';
        summary = `Toxicidad cardiovascular/cerebelosa por acumulación de Fenitoína (${cleanDose}; acumulado ${Math.round(totalFenMg)} mg): hipotensión, bradiarritmia y nistagmo/ataxia.`;
        patientFeelingNote = '¡Doctor, veo doble, me da vueltas todo y siento mucho mareo y debilidad!';
      } else if (isSeizureOrEclampsia) {
        hr = clamp(hr - (hr > 95 ? 8 : 3), 50, 170);
        sys = clamp(sys - 4, 68, 220);
        effectSeverity = 'mejoria';
        summary = `Impregnación anticomicial de segunda línea con Fenitoína (${cleanDose}; acumulado ${Math.round(totalFenMg)} mg) en estatus epiléptico.`;
        patientFeelingNote = 'Me siento más calmado y sin nuevas sacudidas después de esa infusión, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Fenitoína (${cleanDose}) sin crisis epilépticas activas: sin impacto terapéutico y con riesgo de hipotensión/arritmia por infusión.`;
        patientFeelingNote = 'Sentí ardor en la vena y algo de mareo, pero sigo igual, doctor.';
      }
    } else {
      if (isSeizureOrEclampsia) {
        hr = clamp(hr - (hr > 95 ? 8 : 3), 50, 170);
        effectSeverity = 'mejoria';
        summary = `Estabilización neuroeléctrica con ${cleanDrug} (${cleanDose}): previene recurrencia de crisis epilépticas.`;
        patientFeelingNote = 'Me siento más calmado y sin convulsiones después de esa dosis, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Antiepiléptico (${cleanDrug} ${cleanDose}) sin síndrome convulsivo activo: sin efecto clínico relevante.`;
        patientFeelingNote = 'Me siento algo somnoliento, pero mi cuadro no ha cambiado, doctor.';
      }
    }
  } else if (/\b(tiamina|vitamina b1)\b/.test(drugNorm)) {
    if (isAlcoholWithdrawal || diagNorm.includes('wernicke') || diagNorm.includes('desnutricion')) {
      hr = clamp(hr - (hr > 95 ? 6 : 2), 52, 170);
      effectSeverity = 'mejoria';
      summary = `Tiamina IV (${cleanDose}) administrada oportunamente: cofactor esencial para prevenir Encefalopatía de Wernicke antes de cargas glucosadas.`;
      patientFeelingNote = 'Ya me pasaron la vitamina por la vena, doctor, me siento estable.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `Tiamina IV (${cleanDose}) sin encefalopatía carencial ni abstinencia alcohólica: sin efecto hemodinámico agudo.`;
      patientFeelingNote = 'Ya me pasaron esa vitamina, doctor, sigo sintiéndome igual.';
    }
  } else if (/\b(protamina|vitamina k|fitomenadiona)\b/.test(drugNorm)) {
    const hadPriorAnticoag = previousHistory.some((h) => /\b(heparina|enoxaparina|warfarina)\b/.test(norm(h.drug)));
    if (hadPriorAnticoag || (isActiveBleed && /\b(warfarina|acenocumarol|heparina|enoxaparina)\b/.test(`${flags.bgMedsNorm} ${flags.fullCaseNorm}`))) {
      effectSeverity = 'mejoria';
      summary = `${cleanDrug} (${cleanDose}): reversión específica de anticoagulación en hemorragia/sobreanticoagulación.`;
      patientFeelingNote = 'Sentí un leve calor al pasar ese medicamento por la vena, doctor.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `${cleanDrug} (${cleanDose}) sin anticoagulación activa previa que revertir: sin beneficio agudo.`;
      patientFeelingNote = 'No siento cambio en mis síntomas tras esa dosis, doctor.';
    }
  } else if (isNsaidDrug) {
    const addedNsaidEq = getNsaidEquivUnits(drugNorm, parsedDose);
    const totalNsaidEq = addedNsaidEq + cum.nsaidEquivUnits;
    const isPainOrInflammatoryIndication =
      isSeverePainEmergency ||
      isColicOrSpasm ||
      /\b(pericarditis|gota|podagra|artritis|migran|dismenorrea|lumbalgia|esguince|fractura|otitis|faringoamigdalitis|sinusitis|bursitis|tendinitis|fascitis|herpes zoster|cefalea tensional|cefalea en racimos)\b/.test(
        strictDiagNorm
      ) ||
      (temp >= 37.8 && !isEndocrineHyperthermia && !isShockOrHypovolemic);

    if (totalNsaidEq >= 3.5) {
      sys = clamp(sys - 24, 54, 220);
      dia = clamp(dia - 14, 30, 130);
      hr = clamp(hr + 26, 55, 182);
      glasgow = clamp(glasgow - 2, 7, 15);
      effectSeverity = 'reaccion_adversa';
      summary = `Hemorragia digestiva alta aguda y nefrotoxicidad grave por acumulación severa de AINEs (${cleanDrug} ${cleanDose}; ${totalNsaidEq.toFixed(1)} dosis equivalentes acumuladas): taquicardia compensadora e inestabilidad hemodinámica.`;
      patientFeelingNote = '¡Doctor, me duele horriblemente la boca del estómago, tengo náuseas oscuras y un mareo frío muy intenso!';
    } else if (totalNsaidEq >= 2.0) {
      sys = clamp(sys - 10, 62, 220);
      hr = clamp(hr + 12, 55, 175);
      effectSeverity = 'reaccion_adversa';
      summary = `Acumulación tóxica de AINEs (${cleanDrug} ${cleanDose}; ${totalNsaidEq.toFixed(1)} dosis equivalentes acumuladas): gastritis erosiva aguda y vasoconstricción de arteriola aferente renal (riesgo de LRA y sangrado digestivo).`;
      patientFeelingNote = 'Doctor, me empezó un ardor muy fuerte en el estómago y siento mareo después de acumular tantos antiinflamatorios.';
    } else if (isEndocrineHyperthermia) {
      effectSeverity = 'sin_cambio';
      summary = `AINE (${cleanDrug} ${cleanDose}) ineficaz en hipertermia no mediada por prostaglandinas (tormenta tiroidea / síndrome serotoninérgico): no modifica temperatura ni FC.`;
      patientFeelingNote = 'Sigo igual de acalorado y con el corazón acelerado, doctor.';
    } else if (isSepsisOrBacterialEmergency && isShockOrHypovolemic) {
      sys = clamp(sys - 6, 55, 220);
      effectSeverity = 'reaccion_adversa';
      summary = `¡RIESGO RENAL EN CHOQUE SÉPTICO!: AINE (${cleanDrug} ${cleanDose}) constriñe la arteriola aferente renal en paciente hipoperfundido, precipitando Lesión Renal Aguda sin corregir la causa infecciosa.`;
      patientFeelingNote = 'Sigo muy débil, mareado y ahora me molesta la espalda baja y el estómago, doctor.';
    } else if (isPainOrInflammatoryIndication) {
      if (temp >= 37.8) {
        temp = Number(clamp(temp - 0.5, 36.2, 41.5).toFixed(1));
      }
      hr = clamp(hr - (hr > 88 ? 7 : 3), 52, 170);
      effectSeverity = 'mejoria';
      summary = `Efecto analgésico y antiinflamatorio indicado de ${cleanDrug} (${cleanDose}): alivio de respuesta simpática al dolor/fiebre.`;
      patientFeelingNote = 'Ya me empezó a disminuir bastante el dolor y el malestar, doctor.';
    } else {
      effectSeverity = 'sin_cambio';
      summary = `AINE (${cleanDrug} ${cleanDose}) administrado sin proceso doloroso o inflamatorio tributario: no resuelve la urgencia y expone a riesgo gástrico/renal.`;
      patientFeelingNote = 'No noté ningún cambio en mi problema principal, doctor.';
    }
  } else {
    if (/\b(clorfeniramina|difenhidramina|loratadina|cetirizina)\b/.test(drugNorm)) {
      const totalAntihistCount = 1 + cum.antihistamineCount;
      const totalDiphenMg =
        (drugNorm.includes('difenhidramina') ? (parsedDose.mg ?? 50) : 0) + cum.difenhidraminaMg;
      if (totalAntihistCount >= 3 || totalDiphenMg >= 150) {
        hr = clamp(hr + 16, 55, 178);
        glasgow = clamp(glasgow - 2, 8, 15);
        effectSeverity = 'reaccion_adversa';
        summary = `Toxicidad anticolinérgica acumulativa por antihistamínicos (${totalAntihistCount} dosis): sedación marcada, taquicardia, sequedad de mucosas y confusión (Glasgow ${glasgow}/15).`;
        patientFeelingNote = 'Doctor, tengo la boca completamente seca, veo borroso y me cuesta mantenerme despierto...';
      } else if (isAnaphylaxis || /\b(urticaria|dermatitis|rinitis|alergi|escabiosis|sarna)\b/.test(strictDiagNorm)) {
        hr = clamp(hr - (hr > 100 ? 5 : 0), 52, 165);
        glasgow = clamp(glasgow - (/\b(clorfeniramina|difenhidramina)\b/.test(drugNorm) && glasgow > 12 ? 1 : 0), 9, 15);
        effectSeverity = 'parcial';
        summary = 'Antihistamínico H1 coadyuvante: alivia prurito y ronchas cutáneas (en anafilaxia NUNCA sustituye a la Adrenalina IM).';
        patientFeelingNote = 'Ya me pica un poquito menos la piel, doctor.';
      } else {
        glasgow = clamp(glasgow - (/\b(clorfeniramina|difenhidramina)\b/.test(drugNorm) && glasgow > 12 ? 1 : 0), 9, 15);
        effectSeverity = 'sin_cambio';
        summary = `Antihistamínico (${cleanDrug} ${cleanDose}) sin cuadro alérgico/histaminérgico: solo sedación leve sin beneficio clínico.`;
        patientFeelingNote = 'Me dio un poco de sueño, pero mis síntomas siguen igual, doctor.';
      }
    } else if (/\b(ceftriaxona|cefotaxima|cefepime|ampicilina|amoxicilina|azitromicina|levofloxacino|ciprofloxacino|meropenem|vancomicina|clindamicina|metronidazol|piperacilina|gentamicina|amikacina)\b/.test(drugNorm)) {
      const isAminoglycoside = /\b(gentamicina|amikacina)\b/.test(drugNorm);
      const totalAminoglycCount = (isAminoglycoside ? 1 : 0) + cum.aminoglycCount;
      const vancoMg = drugNorm.includes('vancomicina') ? (parsedDose.mg ?? 1000) : 0;
      const totalVancoMg = vancoMg + cum.vancoMg;
      const totalAbxCount = 1 + cum.antibioticCount;
      const isVancoFast = drugNorm.includes('vancomicina') && ((parsedDose.mg ?? 1000) >= 1500 || /\brapida|bolo\b/.test(`${doseNorm} ${freqNorm}`));
      const isGiantDose = parsedDose.mg !== null && parsedDose.mg >= 10000;
      const isBacterialFocus =
        isSepsisOrBacterialEmergency ||
        /\b(neumonia|pielonefritis|colangitis|meningitis|endocarditis|apendicitis|colecistitis|cistitis|faringoamigdalitis|otitis|sinusitis|erisipela|celulitis|absceso|artritis septica|sepsis|neutropenia|sifilis|gonorrea|clamidia|salmonel|shigel|colera|leptospir|ricketts|brucel|tuberculosis|diverticulitis|osteomielitis)\b/.test(
          strictDiagNorm
        );

      if ((isAminoglycoside && (isRenalFailureOrHyperK || totalAminoglycCount >= 2)) || isGiantDose) {
        sys = clamp(sys - 8, 65, 220);
        hr = clamp(hr + 12, 50, 175);
        effectSeverity = 'reaccion_adversa';
        summary = isGiantDose
          ? `Sobredosis masiva de antimicrobiano (${cleanDose} de ${cleanDrug}): riesgo agudo de neurotoxicidad/convulsiones o toxicidad vascular.`
          : isRenalFailureOrHyperK
            ? `Nefrotoxicidad aguda por aminoglucósido (${cleanDrug}) en paciente con Lesión Renal Aguda.`
            : `Nefrotoxicidad y ototoxicidad acumulativa por dosis repetidas de aminoglucósido (${cleanDrug}, ${totalAminoglycCount} dosis en ventana STAT).`;
        patientFeelingNote = '¡Doctor, me siento muy mal, con zumbido de oídos y mareo desde que me volvieron a pasar ese antibiótico!';
      } else if (isVancoFast || totalVancoMg >= 2500) {
        sys = clamp(sys - 12, 65, 220);
        hr = clamp(hr + 14, 55, 175);
        effectSeverity = 'reaccion_adversa';
        summary =
          totalVancoMg >= 2500 && !isVancoFast
            ? `Nefrotoxicidad acumulativa y liberación histamínica tras Vancomicina repetida (acumulado ${Math.round(totalVancoMg)} mg).`
            : `Síndrome del hombre rojo por infusión rápida/dosis elevada de Vancomicina (${cleanDose}): liberación histamínica con eritema e hipotensión.`;
        patientFeelingNote = '¡Doctor, me puse todo rojo, me pica mucho el cuello y siento mareo con este suero!';
      } else if (totalAbxCount >= 3) {
        hr = clamp(hr + 6, 52, 175);
        effectSeverity = 'reaccion_adversa';
        summary = `Acumulación antimicrobiana sin intervalo seguro (${totalAbxCount} dosis antibióticas STAT en la misma ventana aguda): riesgo de toxicidad renal/hepática y disbiosis sin mayor eficacia bactericida.`;
        patientFeelingNote = 'Siento náuseas y malestar en el estómago con tantos antibióticos seguidos por la vena, doctor.';
      } else if (isBacterialFocus) {
        if (temp >= 37.8) temp = Number(clamp(temp - 0.2, 36.2, 41.5).toFixed(1));
        effectSeverity = 'mejoria';
        summary = `Primera dosis antimicrobiana oportuna (${cleanDrug} ${cleanDose}) en la hora de oro: controla progresivamente la carga bacteriana del foco infeccioso.`;
        patientFeelingNote = isPediatric
          ? 'Ya le pasaron la primera dosis del antibiótico por la vena, doctor; el niño sigue bajo vigilancia.'
          : 'Ya me pasaron ese antibiótico por la vena, doctor; estoy bajo vigilancia mientras empieza a actuar.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Antimicrobiano (${cleanDrug} ${cleanDose}) administrado sin foco bacteriano demostrado: no modifica el cuadro agudo ni los signos vitales.`;
        patientFeelingNote = 'Ya me pasaron esa medicina, pero sigo sintiéndome exactamente igual, doctor.';
      }
    } else if (/\b(fomepizol|etanol|acido folinico|leucovorina)\b/.test(drugNorm)) {
      if (isMethanol) {
        rr = clamp(rr - (rr > 24 ? 3 : 0), 12, 38);
        if (glasgow < 15 && glasgow >= 10) glasgow = clamp(glasgow + 1, 3, 15);
        effectSeverity = 'mejoria';
        summary = `Antídoto específico para Metanol (${cleanDrug} ${cleanDose}): bloquea la alcohol deshidrogenasa / depura formato, frenando acidosis láctica/fórmica y ceguera.`;
        patientFeelingNote = 'Siento que respiro un poco menos agitado y me vigilan la vista, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin intoxicación por alcoholes tóxicos: sin efecto sobre la urgencia actual.`;
        patientFeelingNote = 'No noté ningún cambio tras esa medicina, doctor.';
      }
    } else if (/\b(propiltiouracilo|ptu|metimazol|tiamazol|lugol|yoduro)\b/.test(drugNorm)) {
      const isIodine = /\b(lugol|yoduro)\b/.test(drugNorm);
      const hadPriorThionamide = previousHistory.some((h) => /\b(propiltiouracilo|ptu|metimazol|tiamazol)\b/.test(norm(h.drug)));
      if (isThyroidStorm) {
        if (isIodine && !hadPriorThionamide) {
          hr = clamp(hr + 18, 70, 190);
          temp = Number(clamp(temp + 0.4, 36.5, 41.5).toFixed(1));
          effectSeverity = 'reaccion_adversa';
          summary = `¡ERROR SECUENCIAL (Efecto Jod-Basedow)!: Lugol/Yodo administrado ANTES de tionamida (Propiltiouracilo/Metimazol) aporta sustrato para nueva síntesis de T4/T3 y empeora la Tormenta Tiroidea.`;
          patientFeelingNote = '¡Doctor, el corazón me late todavía más disparado y siento más calor!';
        } else {
          hr = clamp(hr - (hr > 115 ? 10 : 4), 60, 180);
          temp = Number(clamp(temp - 0.3, 36.2, 41.5).toFixed(1));
          effectSeverity = 'mejoria';
          summary = isIodine
            ? `Bloqueo de liberación hormonal (Wolff-Chaikoff) con ${cleanDrug} tras tionamida previa en Tormenta Tiroidea.`
            : `Tionamida antitiroidea (${cleanDrug} ${cleanDose}): inhibe síntesis tiroidea (y conversión periférica T4→T3 si PTU) en Tormenta Tiroidea.`;
          patientFeelingNote = 'Sigo agitado pero parece ir bajando un poco esa desesperación y calor, doctor.';
        }
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin tormenta tiroidea: sin efecto agudo.`;
        patientFeelingNote = 'No noto cambio en mi malestar actual, doctor.';
      }
    } else if (/\b(levotiroxina|liotironina)\b/.test(drugNorm)) {
      if (isMyxedemaComa) {
        const hasPriorSteroid = previousHistory.some(
          (h) =>
            h.effectSeverity !== 'reaccion_adversa' &&
            /\b(hidrocortisona|dexametasona|metilprednisolona)\b/.test(norm(h.drug))
        );
        if (!hasPriorSteroid) {
          sys = clamp(sys - 20, 52, 180);
          dia = clamp(dia - 12, 30, 110);
          hr = clamp(hr + 14, 40, 160);
          effectSeverity = 'reaccion_adversa';
          summary = `¡CRISIS SUPRARRENAL PRECIPITADA!: Levotiroxina/Liotironina (${cleanDose}) en Coma Mixedematoso SIN Hidrocortisona IV previa acelera el metabolismo de cortisol y colapsa la PA (${sys}/${dia} mmHg).`;
          patientFeelingNote = '¡Doctor, siento más debilidad extrema y mareo de golpe!';
        } else {
          temp = Number(clamp(temp + 0.6, 33.5, 37.5).toFixed(1));
          hr = clamp(hr + (hr < 60 ? 12 : 4), 40, 120);
          sys = clamp(sys + (sys < 105 ? 12 : 4), 65, 160);
          if (glasgow < 14) glasgow = clamp(glasgow + 2, 3, 15);
          effectSeverity = 'mejoria';
          summary = `Reposición tiroidea segura (${cleanDrug} ${cleanDose}) tras cobertura con Hidrocortisona IV en Coma Mixedematoso: mejora termogénesis (${temp.toFixed(1)} °C), cronotropismo y conciencia.`;
          patientFeelingNote = 'Siento menos frío extremo y empiezo a reaccionar un poco más, doctor.';
        }
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Hormona tiroidea (${cleanDrug}) sin coma mixedematoso: sin utilidad STAT aguda.`;
        patientFeelingNote = 'No noté cambios inmediatos, doctor.';
      }
    } else if (/\b(fentolamina|fenoxibenzamina|prazosina|doxazosina)\b/.test(drugNorm)) {
      if (isPheochromocytoma) {
        sys = clamp(sys - Math.min(34, Math.max(12, Math.round((sys - 135) * 0.45))), 92, 220);
        dia = clamp(dia - Math.min(20, Math.max(8, Math.round((dia - 85) * 0.45))), 55, 130);
        hr = clamp(hr + (hr < 105 ? 8 : 0), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Bloqueo alfa-adrenérgico específico con ${cleanDrug} (${cleanDose}) en Feocromocitoma: controla vasoconstricción catecolaminérgica (PA ${sys}/${dia} mmHg).`;
        patientFeelingNote = 'Se me está quitando esa opresión pulsátil en la cabeza y el pecho, doctor.';
      } else if (sys < 100 || isShockOrHypovolemic) {
        sys = clamp(sys - 24, 52, 220);
        effectSeverity = 'reaccion_adversa';
        summary = `Alfabloqueador (${cleanDrug}) contraindicado en hipotensión/choque: precipita vasoplejia severa.`;
        patientFeelingNote = '¡Me siento muy mareado y a punto de desmayarme, doctor!';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Alfabloqueador (${cleanDrug} ${cleanDose}) sin crisis por feocromocitoma: sin indicación STAT.`;
        patientFeelingNote = 'No noté mejoría específica, doctor.';
      }
    } else if (/\b(ciproheptadina)\b/.test(drugNorm)) {
      if (isSerotoninSyndrome) {
        temp = Number(clamp(temp - 0.6, 36.2, 41.5).toFixed(1));
        hr = clamp(hr - (hr > 100 ? 18 : 6), 55, 175);
        sys = clamp(sys - (sys > 140 ? 14 : 4), 70, 220);
        if (glasgow < 15) glasgow = clamp(glasgow + 1, 3, 15);
        effectSeverity = 'mejoria';
        summary = `Antagonista 5-HT2A específico (Ciproheptadina ${cleanDose}) en Síndrome Serotoninérgico: atenúa hipertermia (${temp.toFixed(1)} °C), hiperactividad autonómica y clonus.`;
        patientFeelingNote = 'Siento que me tiemblan menos las piernas y me baja un poco el calor y la agitación, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Ciproheptadina (${cleanDose}) sin toxicidad serotoninérgica: sin efecto agudo relevante.`;
        patientFeelingNote = 'Me dio algo de sueño, pero sigo igual, doctor.';
      }
    } else if (/\b(acetazolamida|pilocarpina)\b/.test(drugNorm)) {
      if (isGlaucoma) {
        hr = clamp(hr - (hr > 90 ? 8 : 2), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Control de presión intraocular con ${cleanDrug} (${cleanDose}) en Glaucoma Agudo de Ángulo Cerrado: disminuye producción/facilita drenaje del humor acuoso.`;
        patientFeelingNote = 'Empiezo a sentir un poco menos de presión y latido doloroso en el ojo, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin glaucoma agudo ni indicación específica: sin beneficio agudo.`;
        patientFeelingNote = 'No noté cambios en mis síntomas, doctor.';
      }
    } else if (/\b(tamsulosina|alfuzosina)\b/.test(drugNorm)) {
      if (isUrinaryRetention) {
        hr = clamp(hr - (hr > 90 ? 6 : 2), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Bloqueador alfa-1A prostático (${cleanDrug} ${cleanDose}): relaja cuello vesical/uretra prostática facilitando sondaje y micción (en RAO priorizar drenaje con sonda Foley).`;
        patientFeelingNote = 'Siento un poco menos de espasmo abajo, aunque sigo necesitando vaciar la vejiga, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin obstrucción urinaria baja: sin impacto agudo.`;
        patientFeelingNote = 'Sigo sintiéndome igual, doctor.';
      }
    } else if (/\b(nimodipino)\b/.test(drugNorm)) {
      if (isHemorrhagicStroke) {
        sys = clamp(sys - (sys > 165 ? 8 : 3), 85, 220);
        effectSeverity = 'mejoria';
        summary = `Neuroprotección vascular con Nimodipino (${cleanDose}) en Hemorragia Subaracnoidea: reduce riesgo de vasoespasmo cerebral isquémico tardío.`;
        patientFeelingNote = 'Ya me tomé la pastilla indicada para proteger la circulación cerebral, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Nimodipino (${cleanDose}) sin hemorragia subaracnoidea: sin indicación aguda.`;
        patientFeelingNote = 'Sigo sintiéndome igual, doctor.';
      }
    } else if (/\b(octreotido|terlipresina|somatostatina)\b/.test(drugNorm)) {
      if (isGiUlcerOrBleedOrGerd || isHypoglycemia) {
        if (isHypoglycemia && typeof glucose === 'number') {
          glucose = clamp(glucose + 24, 25, 220);
        }
        sys = clamp(sys + (sys < 100 ? 8 : 0), 65, 220);
        effectSeverity = 'mejoria';
        summary = isHypoglycemia
          ? `Octreótido (${cleanDose}) en hipoglucemia refractaria (p. ej. sulfonilureas): inhibe secreción pancreática de insulina y evita hipoglucemias de rebote.`
          : `Vasoconstricción esplácnica con ${cleanDrug} (${cleanDose}): reduce flujo portal y controla sangrado digestivo variceal.`;
        patientFeelingNote = 'Me siento más estable tras esa dosis, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin hemorragia variceal ni hipoglucemia por sulfonilureas: sin efecto agudo.`;
        patientFeelingNote = 'No noté cambios con ese medicamento, doctor.';
      }
    } else if (/\b(artesunato|quinina|cloroquina)\b/.test(drugNorm)) {
      if (isMalariaSevere) {
        if (temp >= 38.0) temp = Number(clamp(temp - 0.3, 36.5, 41.5).toFixed(1));
        effectSeverity = 'mejoria';
        summary = `Antipalúdico intravenoso de primera línea (${cleanDrug} ${cleanDose}): aclaramiento rápido de parasitemia en malaria grave.`;
        patientFeelingNote = 'Ya me pasaron el tratamiento antipalúdico por la vena, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin malaria/paludismo documentado: sin beneficio clínico.`;
        patientFeelingNote = 'No noté mejoría con esa medicina, doctor.';
      }
    } else if (/\b(piridostigmina|neostigmina|inmunoglobulina|igiv)\b/.test(drugNorm)) {
      if (isMyasthenia) {
        rr = clamp(rr + (rr < 14 ? 4 : 0), 10, 34);
        spo2 = clamp(spo2 + (spo2 < 94 ? 5 : 0), 75, 99);
        effectSeverity = 'mejoria';
        summary = `Terapia específica en crisis miasténica/neuromuscular (${cleanDrug} ${cleanDose}): mejora transmisión colinérgica o inmunomodulación.`;
        patientFeelingNote = 'Siento un poco más de fuerza para abrir los ojos y respirar, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin trastorno de unión neuromuscular: sin efecto terapéutico agudo.`;
        patientFeelingNote = 'Sigo igual, doctor.';
      }
    } else if (/\b(pralidoxima|obidoxima)\b/.test(drugNorm)) {
      if (isOrganophosphate) {
        rr = clamp(rr + (rr < 14 ? 3 : 0), 10, 36);
        spo2 = clamp(spo2 + (spo2 < 95 ? 4 : 0), 75, 100);
        effectSeverity = 'mejoria';
        summary = `Reactivador de acetilcolinesterasa (${cleanDrug} ${cleanDose}) en intoxicación por organofosforados: revierte síntomas nicotínicos/fasciculaciones y debilidad muscular.`;
        patientFeelingNote = 'Siento menos temblor muscular y un poco más de fuerza para respirar, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) sin intoxicación por organofosforados: sin indicación.`;
        patientFeelingNote = 'No sentí mejoría, doctor.';
      }
    } else if (/\b(butilhioscina|buscapina|hioscina|omeprazol|pantoprazol|esomeprazol)\b/.test(drugNorm)) {
      const isButil = /\b(butilhioscina|buscapina|hioscina)\b/.test(drugNorm);
      const totalButMg = isButil ? (parsedDose.mg ?? 20) + cum.butilhioscinaMg : 0;
      const totalButCount = isButil ? 1 + cum.butilhioscinaCount : 0;
      if (isButil && (totalButMg >= 80 || totalButCount >= 3)) {
        hr = clamp(hr + 24, 55, 178);
        glasgow = clamp(glasgow - 1, 9, 15);
        effectSeverity = 'reaccion_adversa';
        summary = `Toxicidad anticolinérgica acumulativa por Butilhioscina (${cleanDose}; acumulado ${Math.round(totalButMg)} mg): taquicardia marcada (${hr} lpm), visión borrosa y retención urinaria.`;
        patientFeelingNote = '¡Doctor, tengo la boca completamente seca, veo borroso y el corazón me late rapidísimo!';
      } else if (isButil && isColicOrSpasm) {
        hr = clamp(hr - (hr > 96 ? 8 : 3), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Alivio antiespasmódico con ${cleanDrug} (${cleanDose}) en cólico visceral/biliar/renal no quirúrgico.`;
        patientFeelingNote = 'Sí me calmó bastante el cólico tipo retortijón, doctor.';
      } else if (!isButil && isGiUlcerOrBleedOrGerd) {
        hr = clamp(hr - (hr > 96 ? 4 : 0), 55, 165);
        effectSeverity = 'mejoria';
        summary = `Supresión ácida IV intensa (${cleanDrug} ${cleanDose}) en hemorragia digestiva alta / patología ácido-péptica: estabiliza el coágulo gástrico elevando el pH intragástrico.`;
        patientFeelingNote = 'Me disminuyó un poco ese ardor en la boca del estómago, doctor.';
      } else if (!isButil && diagNorm.includes('pancreatitis')) {
        effectSeverity = 'parcial';
        summary = `IBP coadyuvante (${cleanDrug} ${cleanDose}) en pancreatitis aguda: protege mucosa sin sustituir hidratación IV agresiva ni analgesia.`;
        patientFeelingNote = 'Me alivió un poco el ardor gástrico, aunque sigo con el dolor fuerte del abdomen.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `${cleanDrug} (${cleanDose}) administrado sin indicación ${isButil ? 'espasmolítica cólica benigna' : 'ácido-péptica o hemorragia digestiva'}: sin impacto real sobre la urgencia del paciente.`;
        patientFeelingNote = 'No siento ninguna mejoría en mis síntomas con esa medicina, doctor.';
      }
    } else {
      // Cualquier otro fármaco escrito manualmente: NO inventar mejoría de PA/FC/temperatura
      if (sameDrugCount >= 2) {
        effectSeverity = 'reaccion_adversa';
        summary = `Acumulación repetida de "${cleanDrug}" (${sameDrugCount + 1} dosis STAT sin intervalo seguro): riesgo de toxicidad acumulativa sin beneficio terapéutico adicional.`;
        patientFeelingNote = 'Siento malestar, náuseas y mareo ligero después de repetirme esa misma medicina tantas veces, doctor.';
      } else {
        effectSeverity = 'sin_cambio';
        summary = `Orden STAT "${cleanDrug} (${cleanDose}, ${cleanRoute})" registrada sin mecanismo fisiopatológico específico demostrado sobre los signos vitales agudos.`;
        patientFeelingNote = isPediatric
          ? `Ya le aplicaron ${cleanDrug}, doctor, pero el niño sigue exactamente igual.`
          : `Ya me aplicaron ${cleanDrug}, doctor, pero no siento ningún alivio ni cambio en mis molestias.`;
      }
    }
  }

  // MOTOR INTEGRAL DE INTERACCIONES FARMACOLÓGICAS (Fármaco-Fármaco y Fármaco-Antecedentes)
  if (!isImmediateDeath) {
    const priorAllNorm = norm(
      previousHistory.map((h) => `${h.drug} ${h.label} ${h.dose}`).join(' | ')
    );
    const combinedContextNorm = `${priorAllNorm} | ${flags.bgMedsNorm}`;

    const isNitrateNow = /\b(nitroglicerina|nitrat|isosorbide)\b/.test(drugNorm);
    const isPde5Now = /\b(sildenafil|tadalafil|vardenafil)\b/.test(drugNorm);
    const hasPriorPde5 = usesPde5 || /\b(sildenafil|tadalafil|vardenafil)\b/.test(priorAllNorm);
    const hasPriorNitrate = /\b(nitroglicerina|nitrat|isosorbide)\b/.test(combinedContextNorm);

    const isBetaBlockerNow = /\b(labetalol|metoprolol|esmolol|atenolol|propranolol|carvedilol|bisoprolol|nadolol)\b/.test(drugNorm);
    const isNonDhpCcbNow = /\b(verapamilo|diltiazem)\b/.test(drugNorm);
    const isDigoxinNow = drugNorm.includes('digoxina');
    const isAmiodaroneNow = drugNorm.includes('amiodarona');
    const hasPriorBetaBlocker = /\b(labetalol|metoprolol|esmolol|atenolol|propranolol|carvedilol|bisoprolol|nadolol)\b/.test(combinedContextNorm);
    const hasPriorNonDhpCcb = /\b(verapamilo|diltiazem)\b/.test(combinedContextNorm);
    const hasPriorDigoxin = /\bdigoxina\b/.test(combinedContextNorm);
    const hasPriorAmiodarone = /\bamiodarona\b/.test(combinedContextNorm);

    const isOpioidNow = /\b(morfina|fentanilo|tramadol|meperidina|oxicodona|buprenorfina)\b/.test(drugNorm);
    const isBenzoNow = /\b(diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/.test(drugNorm);
    const isCnsDepressantNow =
      isOpioidNow ||
      isBenzoNow ||
      /\b(propofol|haloperidol|clorfeniramina|difenhidramina|sulfato de magnesio|mgso4|magnesio)\b/.test(drugNorm);
    const hasPriorOpioid =
      cum.unreversedOpioidMeq > 0 ||
      /\b(morfina|fentanilo|tramadol|meperidina|oxicodona|buprenorfina)\b/.test(flags.bgMedsNorm);
    const hasPriorBenzo =
      cum.unreversedBenzoDeq > 0 ||
      /\b(diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/.test(flags.bgMedsNorm);
    const hasPriorOtherSedative =
      cum.propofolMg > 0 ||
      cum.unreversedMgGrams > 0 ||
      /\b(propofol|haloperidol|clorfeniramina|difenhidramina|sulfato de magnesio|mgso4)\b/.test(priorAllNorm);

    const isAnticoagNow = /\b(heparina|enoxaparina|warfarina|apixaban|rivaroxaban)\b/.test(drugNorm);
    const isLyticNow = /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(drugNorm);
    const isAntiplateletNow = isAsaDrug || /\b(clopidogrel|ticagrelor|prasugrel)\b/.test(drugNorm);
    const hasPriorAnticoag = /\b(heparina|enoxaparina|warfarina|apixaban|rivaroxaban)\b/.test(combinedContextNorm);
    const hasPriorLytic = /\b(alteplasa|tenecteplasa|estreptoquinasa)\b/.test(priorAllNorm);
    const hasPriorNsaid = /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|metamizol|dipirona|piroxicam|indometacina|meloxicam|celecoxib)\b/.test(combinedContextNorm);
    const hasPriorAntiplatelet = /\b(aspirina|acetilsalicilico|aas|asa|clopidogrel|ticagrelor|prasugrel)\b/.test(combinedContextNorm);

    const isQtcDrugNow = /\b(ondansetron|amiodarona|haloperidol|azitromicina|levofloxacino|claritromicina|metoclopramida)\b/.test(drugNorm);
    const qtcList = ['ondansetron', 'amiodarona', 'haloperidol', 'azitromicina', 'levofloxacino', 'claritromicina', 'metoclopramida'];
    const priorQtcMatches = qtcList.filter((q) => combinedContextNorm.includes(q) && !drugNorm.includes(q));

    const isKRaisingNow = /\b(cloruro de potasio|kcl|espironolactona|amilorida|enalapril|enalaprilat|captopril|losartan)\b/.test(drugNorm) || isNsaidDrug;
    const hasPriorKclOrKsparing = /\b(cloruro de potasio|kcl|espironolactona|amilorida)\b/.test(combinedContextNorm);
    const hasPriorAceiArb = /\b(enalapril|enalaprilat|captopril|losartan|valsartan|lisinopril)\b/.test(combinedContextNorm);

    const isKLoweringNow = /\b(insulina|salbutamol|albuterol|furosemida)\b/.test(drugNorm);
    const kLoweringList = ['insulina', 'salbutamol', 'furosemida'];
    const priorKLoweringCount = kLoweringList.filter((k) => priorAllNorm.includes(k) && !drugNorm.includes(k)).length;

    const isAceiArbNow = /\b(enalapril|enalaprilat|captopril|losartan|valsartan|lisinopril)\b/.test(drugNorm);
    const isFuroNow = /\b(furosemida|diuretico)\b/.test(drugNorm);
    const isAminoglycNow = /\b(gentamicina|amikacina)\b/.test(drugNorm);
    const isVancoNow = drugNorm.includes('vancomicina');
    const hasPriorFuro = /\bfurosemida\b/.test(combinedContextNorm);
    const hasPriorAminoglyc = /\b(gentamicina|amikacina)\b/.test(priorAllNorm);
    const hasPriorVanco = /\bvancomicina\b/.test(priorAllNorm);

    const isAdrenergicNow = /\b(adrenalina|epinefrina|norepinefrina|noradrenalina|dopamina|dobutamina|ketamina)\b/.test(drugNorm);
    const hasPriorAdrenergic = /\b(adrenalina|epinefrina|norepinefrina|noradrenalina|dopamina|dobutamina|ketamina)\b/.test(priorAllNorm);

    const isSteroidNow = /\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|prednisolona)\b/.test(drugNorm);
    const hasPriorSteroid = /\b(hidrocortisona|dexametasona|metilprednisolona|prednisona|prednisolona)\b/.test(combinedContextNorm);

    const isSalineNow = /\b(salina|ssn|hartmann|ringer|cristaloide)\b/.test(drugNorm) && !/\b(glucosad|dextrosa|mixta)\b/.test(drugNorm);
    const hasPriorInsulin = /\binsulina\b/.test(priorAllNorm);
    const hasPriorSaline = /\b(salina|ssn|hartmann|ringer|cristaloide)\b/.test(priorAllNorm);

    const isHypotensiveAgentNow =
      isAceiArbNow ||
      isBetaBlockerNow ||
      isNonDhpCcbNow ||
      isNitrateNow ||
      isPde5Now ||
      isFuroNow ||
      /\b(hidralazina|nitroprusiato|nifedipin|nicardipin|amlodipino|propofol|metamizol)\b/.test(drugNorm);
    const priorHypotensiveCount = previousHistory.filter((h) =>
      /\b(labetalol|hidralazina|nifedipin|nitroprusiato|nicardipin|enalapril|losartan|captopril|amlodipino|metoprolol|nitroglicerina|furosemida|verapamilo|diltiazem|sildenafil|propofol)\b/.test(
        norm(h.drug)
      )
    ).length;

    const interactionNotes: string[] = [];

    // I1. Nitrato + PDE5i (bidireccional)
    if ((isNitrateNow && hasPriorPde5 && !usesPde5) || (isPde5Now && hasPriorNitrate)) {
      sys = clamp(sys - 36, 46, 220);
      dia = clamp(dia - 20, 26, 130);
      hr = clamp(hr + 24, 48, 185);
      if (sys < 82) glasgow = clamp(glasgow - 4, 5, 13);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN MORTAL (Nitrato + Inhibidor PDE5): potenciación masiva de GMPc con vasoplejia e hipotensión refractaria');
      patientFeelingNote = '¡Doctor, siento que se me apaga la vista, un mareo extremo y frío helado en todo el cuerpo!';
    }

    // I2. Bloqueo nodal sinérgico (Betabloqueador + Verapamilo/Diltiazem o Digoxina + BB/Amiodarona/Verapamilo)
    const isAcuteSessionBetaBlocker = /\b(labetalol|metoprolol|esmolol|atenolol|propranolol|carvedilol|bisoprolol|nadolol)\b/.test(priorAllNorm);
    const isVtOrSevereTachyForAmio =
      currentVitals.heartRate >= 115 ||
      diagNorm.includes('taquicardia ventricular') ||
      diagNorm.includes('fibrilacion auricular');
    if (
      (isBetaBlockerNow && (hasPriorNonDhpCcb || hasPriorDigoxin)) ||
      (isNonDhpCcbNow && (hasPriorBetaBlocker || hasPriorDigoxin)) ||
      (isDigoxinNow && (hasPriorBetaBlocker || hasPriorNonDhpCcb || hasPriorAmiodarone)) ||
      (isAmiodaroneNow &&
        (hasPriorDigoxin ||
          (hasPriorBetaBlocker && (!isVtOrSevereTachyForAmio || (isAcuteSessionBetaBlocker && currentVitals.heartRate < 85)))))
    ) {
      hr = clamp(hr - 20, 30, 165);
      sys = clamp(sys - 20, 48, 220);
      dia = clamp(dia - 11, 28, 130);
      if (hr < 46 || sys < 80) glasgow = clamp(glasgow - 4, 5, 12);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN CARDIOTÓXICA (Doble freno nodal AV): riesgo severo de bradicardia extrema, bloqueo AV completo y choque cardiogénico');
      patientFeelingNote =
        glasgow <= 9
          ? '[Alerta crítica: inconsciencia súbita con bradicardia extrema y choque por interacción nodal]'
          : '¡Doctor, siento pausas en el corazón, un cansancio extremo y me estoy desvaneciendo!';
    }

    // I3. Sinergia depresora del SNC / ventilatoria (Opioide + Benzodiacepina / Propofol / MgSO4 / Sedante)
    if (
      (isOpioidNow && (hasPriorBenzo || hasPriorOtherSedative)) ||
      (isBenzoNow && (hasPriorOpioid || hasPriorOtherSedative)) ||
      (isCnsDepressantNow && !isOpioidNow && !isBenzoNow && (hasPriorOpioid || hasPriorBenzo))
    ) {
      rr = clamp(rr - 5, 4, 40);
      spo2 = clamp(spo2 - 7, 65, 100);
      sys = clamp(sys - 12, 52, 220);
      dia = clamp(dia - 6, 30, 130);
      glasgow = clamp(glasgow - 4, 3, 15);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN DEPRESORA DEL SNC (Sinergia respiratoria): depresión ventilatoria supra-aditiva, hipercapnia y pérdida progresiva de conciencia');
      if (glasgow <= 9) {
        patientFeelingNote = '[Alerta crítica: paciente inconsciente por depresión respiratoria sinérgica multi-fármaco]';
      } else {
        patientFeelingNote = 'Doctor... me cuesta muchísimo mantenerme despierto y siento la respiración demasiado lenta...';
      }
    }

    // I4. Sinergia hemorrágica (Anticoagulante/Fibrinolítico + AINE/Antiagregante/Doble antitrombótico)
    if (
      ((isAnticoagNow || isLyticNow) && (hasPriorNsaid || hasPriorLytic || (hasPriorAnticoag && isLyticNow) || (hasPriorAntiplatelet && !isIschemicChestPain))) ||
      (isNsaidDrug && (hasPriorAnticoag || hasPriorLytic || hasPriorAntiplatelet)) ||
      (isAntiplateletNow && hasPriorLytic)
    ) {
      sys = clamp(sys - 18, 52, 220);
      dia = clamp(dia - 10, 30, 130);
      hr = clamp(hr + 18, 50, 182);
      spo2 = clamp(spo2 - 2, 70, 100);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN HEMORRÁGICA GRAVE: potenciación antitrombótica/lesión mucosa con alto riesgo de sangrado digestivo o hemorragia mayor');
      patientFeelingNote = '¡Doctor, me empezó un dolor ardoroso en el estómago, mareo frío y sangrado en el sitio de la vía!';
    }

    // I5. Prolongación aditiva del QTc
    if (isQtcDrugNow && priorQtcMatches.length >= 1) {
      hr = clamp(hr + 16, 48, 185);
      sys = clamp(sys - 8, 60, 220);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push(`INTERACCIÓN ELÉCTRICA (Prolongación aditiva de QTc con ${priorQtcMatches.join(', ')}): riesgo de taquicardia ventricular polimórfica (Torsades de Pointes)`);
      patientFeelingNote = 'Doctor, siento palpitaciones irregulares como saltos en el pecho y mareo.';
    }

    // I6. Hiperkalemia aditiva (KCl / Espironolactona + IECA / ARA-II / AINE)
    if (
      ((/\b(cloruro de potasio|kcl|espironolactona|amilorida)\b/.test(drugNorm)) && (hasPriorAceiArb || hasPriorNsaid)) ||
      ((isAceiArbNow || isNsaidDrug) && hasPriorKclOrKsparing)
    ) {
      hr = clamp(hr - 10, 36, 170);
      sys = clamp(sys - 8, 60, 220);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN ELECTROLÍTICA (Hiperkalemia sinérgica): retención aditiva de potasio con riesgo de trastorno de conducción cardíaca');
    }

    // I7. Hipokalemia aditiva (Insulina + Salbutamol + Furosemida)
    if (isKLoweringNow && priorKLoweringCount >= 1 && !isHyperkalemia) {
      hr = clamp(hr + 12, 50, 182);
      sys = clamp(sys - 5, 62, 220);
      if (priorKLoweringCount >= 2 || hasPriorInsulin) {
        effectSeverity = 'reaccion_adversa';
      }
      interactionNotes.push('INTERACCIÓN ELECTROLÍTICA (Hipokalemia sinérgica por desplazamiento/pérdida de K⁺): debilidad muscular y riesgo de ectopia ventricular');
    } else if (isKLoweringNow && priorKLoweringCount >= 1 && isHyperkalemia) {
      interactionNotes.push('Sinergia terapéutica en hiperkalemia: potenciación del desplazamiento intracelular de K⁺');
    }

    // I8. Triple Whammy / Nefrotoxicidad sinérgica (IECA/ARA-II + Furosemida + AINE o Aminoglucósido + Vancomicina/Furosemida/AINE)
    const tripleWhammyHit =
      (isNsaidDrug && hasPriorAceiArb && hasPriorFuro) ||
      (isAceiArbNow && hasPriorNsaid && hasPriorFuro) ||
      (isFuroNow && hasPriorAceiArb && hasPriorNsaid);
    const nephroComboHit =
      (isAminoglycNow && (hasPriorVanco || hasPriorFuro || hasPriorNsaid)) ||
      ((isVancoNow || isFuroNow || isNsaidDrug) && hasPriorAminoglyc);
    if (tripleWhammyHit || nephroComboHit) {
      sys = clamp(sys - 8, 62, 220);
      dia = clamp(dia - 4, 36, 130);
      hr = clamp(hr + 8, 50, 175);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push(
        tripleWhammyHit
          ? 'INTERACCIÓN NEFROTÓXICA ("Triple Whammy": IECA/ARA-II + Diurético + AINE): caída crítica de presión de filtración glomerular y riesgo de Lesión Renal Aguda'
          : 'INTERACCIÓN NEFROTÓXICA ADITIVA (Aminoglucósido + Vancomicina/Diurético/AINE): alto riesgo de necrosis tubular aguda'
      );
    }

    // I9. Crisis adrenérgica sinérgica
    if (isAdrenergicNow && hasPriorAdrenergic) {
      sys = clamp(sys + 22, 65, 248);
      dia = clamp(dia + 12, 40, 148);
      hr = clamp(hr + 24, 55, 190);
      effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN SIMPATICOMIMÉTICA (Doble estímulo adrenérgico): descarga hipertensiva y taquicardia de alto consumo miocárdico');
    }

    // I10. Vasodilatación / Hipotensión aditiva multifármaco
    if (isHypotensiveAgentNow && priorHypotensiveCount >= 1 && sys < 130 && !isHypertensiveCrisis) {
      sys = clamp(sys - 12, 50, 220);
      dia = clamp(dia - 7, 28, 130);
      hr = clamp(hr + (isBetaBlockerNow ? -4 : 8), 40, 178);
      const mapAfterCombo = calcMAP(sys, dia);
      const mapComboDropPct = Math.round(((mapBefore - mapAfterCombo) / Math.max(1, mapBefore)) * 100);
      if (sys < 92 || (priorHypotensiveCount >= 2 && mapComboDropPct >= 20)) {
        effectSeverity = 'reaccion_adversa';
      }
      interactionNotes.push('INTERACCIÓN HIPOTENSIVA ADITIVA: suma de fármacos vasodilatadores/diuréticos provoca descenso adicional de PAM');
    }

    // I11. Interacciones metabólicas y balances (Salina + Insulina, Corticoide + Insulina, Cristaloides vs Furosemida, AINE + Corticoide)
    if (isSalineNow && hasPriorInsulin && typeof glucose === 'number' && glucose >= 180) {
      const extraDrop = Math.min(12, glucose - 140);
      glucose = clamp(glucose - extraDrop, 90, 700);
      interactionNotes.push('Sinergia cristaloides + insulina: la hidratación restaura perfusión tisular y optimiza el aclaramiento renal de glucosa');
    } else if (drugNorm.includes('insulina') && hasPriorSaline && typeof glucose === 'number' && glucose >= 180) {
      interactionNotes.push('Sinergia insulina + hidratación previa: mejora perfusión y sensibilidad periférica a la insulina');
    }

    if ((isSteroidNow && hasPriorInsulin) || (drugNorm.includes('insulina') && hasPriorSteroid)) {
      interactionNotes.push('INTERACCIÓN METABÓLICA (Corticoide + Insulina): el glucocorticoide induce resistencia insulínica y contrarresta parcialmente el control glucémico');
    }

    if ((isSteroidNow && hasPriorNsaid) || (isNsaidDrug && hasPriorSteroid)) {
      hr = clamp(hr + 4, 50, 175);
      if (isActiveBleed) effectSeverity = 'reaccion_adversa';
      interactionNotes.push('INTERACCIÓN GASTROLESIVA (Corticoide + AINE): riesgo sinérgico de úlcera péptica y hemorragia digestiva alta');
    }

    if ((isFuroNow && hasPriorSaline && !isPulmonaryEdemaOrFluidOverload) || (isSalineNow && hasPriorFuro && !isShockOrHypovolemic)) {
      interactionNotes.push('Interacción de volumen antagónica (Cristaloide + Diurético de asa): revisar objetivo de balance hídrico');
    }

    if (hr <= 32 || sys <= 48) {
      isImmediateDeath = true;
      immediateDeathReason = `Colapso hemodinámico o asistolia irreversible precipitada por interacción farmacológica grave tras ${cleanDrug} (${cleanDose}).`;
    }

    if (interactionNotes.length > 0) {
      summary = `${summary} · [${interactionNotes.join(' | ')}]`;
    }
  }

  if (isImmediateDeath) {
    sys = 0;
    dia = 0;
    hr = 0;
    rr = 0;
    spo2 = 0;
    glasgow = 3;
    effectSeverity = 'reaccion_adversa';
    patientFeelingNote =
      '[CÓDIGO AZUL · MUERTE INMEDIATA: El paciente entró en asistolia irreversible sin pulso ni ventilación espontánea.]';
  }

  const updatedVitals: VitalSigns = {
    ...currentVitals,
    bloodPressure: `${sys}/${dia} mmHg`,
    heartRate: Math.round(hr),
    respiratoryRate: Math.round(rr),
    temperature: Number(temp.toFixed(1)),
    oxygenSaturation: Math.round(spo2),
    glasgow: Math.round(glasgow),
    ...(typeof glucose === 'number' ? { bloodGlucose: Math.round(glucose) } : {}),
  };

  const deltas = buildMetricDeltas(currentVitals, updatedVitals);
  const mapAfter = calcMAP(sys, dia);
  if (mapBefore !== mapAfter && !deltas.some((d) => d.metric === 'PA')) {
    deltas.push({
      metric: 'PAM',
      before: `${mapBefore}`,
      after: `${mapAfter} mmHg`,
      direction: mapAfter > mapBefore ? 'up' : 'down',
      deltaText: `${mapAfter - mapBefore > 0 ? '+' : ''}${mapAfter - mapBefore} mmHg`,
    });
  }

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const record: StatInterventionRecord = {
    id: `stat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    presetId: input.presetId,
    label,
    drug: cleanDrug,
    dose: cleanDose,
    route: cleanRoute,
    appliedAt: nowStr,
    elapsedSeconds,
    effectSeverity,
    physiologicalEffectSummary: summary,
    deltas,
    patientFeelingNote,
    ...(isImmediateDeath ? { isImmediateDeath: true, immediateDeathReason } : {}),
  };

  const medicationItem: MedicationItem = {
    id: `med-stat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    drug: cleanDrug,
    dose: cleanDose,
    route: cleanRoute,
    frequency: input.frequency || 'Dosis STAT (Urgencias)',
    duration: input.duration || 'Aplicación inmediata',
  };

  return {
    updatedVitals,
    record,
    medicationItem,
    isImmediateDeath,
    immediateDeathReason,
  };
}

export interface PlanMedicationAuditResult {
  unsafeMedicationIds: Set<string>;
  errors: string[];
}

const COMPOUND_DRUG_NAMES_REGEX =
  /\b(paracetamol|acetaminofen|tramadol|morfina|fentanilo|buprenorfina|labetalol|hidralazina|nifedipin[oa]?|nicardipin[oa]?|nitroprusiato|doxazosina|fentolamina|fenoxibenzamina|prazosina|esmolol|propranolol|metoprolol|atenolol|losartan|enalaprilat|enalapril|amlodipino|captopril|diltiazem|verapamilo|amiodarona|digoxina|dopamina|adrenalina|epinefrina|noradrenalina|norepinefrina|insulina|dextrosa|glucosa|salina|ringer|hartmann|kcl|potasio|ketorolaco|ibuprofeno|naproxeno|diclofenaco|metamizol|ondansetron|metoclopramida|sumatriptan|magnesio|atropina|enoxaparina|heparina|atorvastatina|nitroglicerina|ceftriaxona|cefalexina|cefazolina|clindamicina|amoxicilina|dexametasona|adenosina)\b/;

function extractDrugSpecificDose(
  drugPattern: RegExp,
  item: MedicationItem,
  weightKg: number
): ParsedDose | null {
  const doseRaw = item.dose || '';
  const doseN = norm(doseRaw);
  const splitRegex =
    /\s*(?:\+|;|\||\(\s*o\s+)\s*|\s+\bo\b\s+|\s*\/(?!\s*(?:\d|kg\b|min\b|h\b|hr\b|horas?\b|dia\b|dias\b|l\b|dl\b|ml\b|dosis\b))/i;

  if (COMPOUND_DRUG_NAMES_REGEX.test(doseN)) {
    const segments = doseRaw.split(splitRegex);
    const matchingSegments = segments.filter((seg) => drugPattern.test(norm(seg)));
    if (matchingSegments.length > 0) {
      return parseNumericDose(matchingSegments[0], weightKg);
    }
    // La cadena de dosis nombra explícitamente otros fármacos (p. ej. "Paracetamol 1 g + Tramadol 50 mg"), no éste
    return null;
  }

  // Si tanto el campo fármaco como la dosis usan segmentos paralelos separados por "+", mapear posicionalmente
  const drugPlusSegs = (item.drug || '').split(/\s*\+\s*/);
  const dosePlusSegs = doseRaw.split(/\s*\+\s*/);
  if (drugPlusSegs.length > 1 && drugPlusSegs.length === dosePlusSegs.length) {
    const matchIdx = drugPlusSegs.findIndex((seg) => drugPattern.test(norm(seg)));
    if (matchIdx >= 0 && dosePlusSegs[matchIdx]) {
      return parseNumericDose(dosePlusSegs[matchIdx], weightKg);
    }
  }

  return parseNumericDose(doseRaw, weightKg);
}

/**
 * Audita cada fármaco del plan terapéutico propuesto para detectar sobredosis letales/tóxicas,
 * vías incompatibles o contraindicaciones críticas dependientes de dosis y contexto clínico.
 */
export function auditMedicationPlanSafety(
  medications: MedicationItem[],
  caseData: ClinicalCase,
  statInterventions: StatInterventionRecord[] = []
): PlanMedicationAuditResult {
  const errors: string[] = [];
  const unsafeMedicationIds = new Set<string>();
  const flags = extractCaseClinicalFlags(caseData, caseData.vitalSigns);
  const {
    diagNorm,
    ageYears,
    weightKg,
    isPediatric,
    isUnder8,
    isViablePregnancy,
    isThirdTrimester,
    isRenalImpairment,
    isAcuteKidneyInjury,
    isHyperkalemia,
    isActiveBleed,
    isDengue,
    isOrganophosphate,
    isObstructiveAirway,
    isPulmonaryEdemaOrFluidOverload,
    isBowelObstruction,
    isMyasthenia,
    isThyroidStorm,
    isPheochromocytoma,
    isPorphyria,
    isAorticDissection,
    isGlaucoma,
    isUrinaryRetention,
    isAcetaminophenTox,
    isParkinson,
    isAvBlock,
    isMyxedemaComa,
    isSerotoninSyndrome,
  } = flags;

  const baseBP = parseBP(caseData.vitalSigns.bloodPressure);
  const baseGlu = caseData.vitalSigns.bloodGlucose;
  const baseHr = caseData.vitalSigns.heartRate;

  const fullPlanNorm = norm(
    medications.map((m) => `${m.drug} ${m.dose} ${m.route} ${m.frequency}`).join(' ')
  );
  const hasConcomitantDextrose = /\b(dextrosa|glucosa|dw50|dw10|dw5)\b/.test(fullPlanNorm);

  const negationRegex =
    /\b(suspender|suspendase|retirar|retiro|omitir|evitar|prohibid[oa]|contraindicad[oa]|descontinuar|no\s+(?:administrar|usar|dar|indicar|prescribir))\b/;

  for (const item of medications) {
    const drugNorm = norm(item.drug || '');
    const doseNorm = norm(item.dose || '');
    const routeNorm = norm(item.route || '');
    const freqNorm = norm(`${item.frequency || ''} ${item.duration || ''}`);
    if (!drugNorm) continue;
    if (negationRegex.test(`${drugNorm} ${doseNorm}`)) continue;

    const p = parseNumericDose(item.dose || '', weightKg);
    const isIV = routeNorm.includes('intravenosa') || /\biv\b/.test(routeNorm);
    const isInhaled =
      routeNorm.includes('inhalat') ||
      routeNorm.includes('nebuliz') ||
      doseNorm.includes('nebuliz') ||
      drugNorm.includes('nebuliz');
    const isTopicalLocal =
      /\b(topic[oa]|otic[oa]|oftalmic[oa]|nasal|cutane[oa]|gel|crema|gotas|colirio|unguento|pomada)\b/.test(
        `${drugNorm} ${doseNorm} ${routeNorm}`
      ) && !/\b(intravenos[oa]|oral|\bvo\b|\biv\b|\bim\b)\b/.test(routeNorm);

    const flagError = (msg: string) => {
      unsafeMedicationIds.add(item.id);
      if (!errors.some((e) => norm(e) === norm(msg))) {
        errors.push(msg);
      }
    };

    // 1. Insulina: sobredosis letal, vía IV en basal, o insulina en normoglucemia sin dextrosa
    if (/\binsulina\b/.test(drugNorm)) {
      const pIns = extractDrugSpecificDose(/\binsulina\b/, item, weightKg);
      const isBasal = /\b(nph|glargina|lantus|detemir|degludec|tresiba|levemir|intermedia|prolongada)\b/.test(drugNorm);
      if (isIV && isBasal) {
        flagError(
          `¡ERROR CRÍTICO FARMACOLÓGICO!: Indicaste insulina de acción intermedia/prolongada (${item.drug}) por vía intravenosa (${item.route}); riesgo de hipoglucemia prolongada grave y embolismo.`
        );
        continue;
      }
      if (pIns && pIns.ui !== null) {
        const uiPerKg = pIns.ui / weightKg;
        const isPolarizing =
          isHyperkalemia &&
          pIns.ui <= 15 &&
          (hasConcomitantDextrose || /\b(polariz|dextrosa|glucosa)\b/.test(`${drugNorm} ${doseNorm}`));

        if (pIns.ui >= 30 || uiPerKg >= 0.45) {
          flagError(
            `¡ERROR CRÍTICO DE SOBREDOSIS LETAL!: Prescripción de ${item.dose} de ${item.drug} (${item.route}). Excede ampliamente las dosis terapéuticas (0.05-0.15 UI/kg) y provoca hipoglucemia neuroglucopénica catastrófica, hipokalemia severa y riesgo letal inmediato.`
          );
          continue;
        }
        if (!isPolarizing && typeof baseGlu === 'number' && baseGlu < 160 && pIns.ui >= 6) {
          flagError(
            `¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de ${item.dose} de ${item.drug} en paciente sin hiperglucemia significativa (glucemia basal ${baseGlu} mg/dL) sin cobertura polarizante; riesgo de hipoglucemia iatrogénica severa.`
          );
          continue;
        }
        if (typeof baseGlu === 'number' && baseGlu >= 160 && baseGlu < 250 && isIV && pIns.ui >= 15) {
          flagError(
            `¡ERROR CRÍTICO DE DOSIFICACIÓN!: Bolo IV excesivo de insulina (${item.dose}) para glucemia de ${baseGlu} mg/dL; riesgo grave de hipoglucemia iatrogénica.`
          );
          continue;
        }
      }
    }

    // 2. Cloruro de Potasio (KCl) en bolo IV directo o sin dilución segura
    if (/\b(cloruro de potasio|kcl)\b/.test(drugNorm)) {
      const hasCarrierOrDilution =
        /\b(diluid|en 1000|en 500|por litro|infusion|mantenimiento|bomba|solucion|ringer|salina|hartmann|reposicion)\b/.test(
          `${drugNorm} ${doseNorm} ${routeNorm} ${freqNorm}`
        ) && !/\b(bolo|directa|push|stat rapido)\b/.test(`${doseNorm} ${freqNorm}`);
      const pKcl = extractDrugSpecificDose(/\b(potasio|kcl)\b/, item, weightKg);
      if (isIV && (!hasCarrierOrDilution || (pKcl && pKcl.meq !== null && pKcl.meq >= 45 && !/\b(por dia|24|en 1000|en 2 litros)\b/.test(`${doseNorm} ${freqNorm}`)))) {
        flagError(
          `¡ERROR CRÍTICO DE RIESGO LETAL!: Administración de Cloruro de Potasio (${item.dose}) en bolo/vía IV directa o sin dilución segura. Provoca hiperpotasemia cardíaca súbita, fibrilación ventricular y paro cardíaco.`
        );
        continue;
      }
    }

    // 3. Adrenalina / Epinefrina IV fuera de paro o sobredosis IM (excluyendo nebulizada en crup e infusión titulada en bradiarritmia)
    if (/\b(adrenalina|epinefrina)\b/.test(drugNorm) && !isInhaled) {
      const pAdr = extractDrugSpecificDose(/\b(adrenalina|epinefrina)\b/, item, weightKg);
      const mg = pAdr?.mg ?? null;
      const isTitratedInfusion =
        /\b(infusion|bomba|titulad[oa]|bradiarritmia|bloqueo|mcg\/min|ug\/min)\b/.test(
          `${drugNorm} ${doseNorm} ${routeNorm}`
        ) &&
        mg !== null &&
        mg < 0.05;
      if (isIV && !isTitratedInfusion && mg !== null && mg >= 0.3) {
        flagError(
          `¡ERROR CRÍTICO FARMACOLÓGICO!: Adrenalina ${item.dose} por vía IV fuera de paro cardiorrespiratorio; riesgo de crisis adrenérgica letal, arritmia ventricular y hemorragia intracerebral (en anafilaxia la vía segura es Intramuscular).`
        );
        continue;
      }
      if (mg !== null && (isPediatric ? mg >= 0.8 : mg >= 1.5)) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis excesiva de Adrenalina (${item.dose}); provoca crisis hipertensiva severa y taquiarritmia potencialmente fatal.`
        );
        continue;
      }
    }

    // 4. Antihipertensivos sobredosis / vía incompatible / betabloqueador en shock
    if (
      /\b(labetalol|hidralazina|nitroprusiato|nifedipin|enalaprilat|nicardipin|losartan|amlodipino|captopril|metoprolol)\b/.test(
        drugNorm
      )
    ) {
      if (isIV && /\b(losartan|amlodipino|captopril|nifedipin)\b/.test(drugNorm) && !/\b(o|\/)\b/.test(routeNorm)) {
        flagError(
          `¡ERROR CRÍTICO FARMACOLÓGICO!: Formulación oral (${item.drug}) prescrita por vía intravenosa (${item.route}).`
        );
        continue;
      }
      const pLab = extractDrugSpecificDose(/\blabetalol\b/, item, weightKg);
      if (drugNorm.includes('labetalol') && pLab && pLab.mg !== null && (pLab.mg >= 120 || pLab.mg / weightKg >= 2.0)) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Bolo de Labetalol excesivo (${item.dose}); la dosis inicial segura es 10-20 mg IV. Riesgo de shock vasopléjico, bradicardia severa e hipoperfusión orgánica.`
        );
        continue;
      }
      const pNtp = extractDrugSpecificDose(/\bnitroprusiato\b/, item, weightKg);
      if (drugNorm.includes('nitroprusiato') && pNtp && pNtp.mg !== null && pNtp.mg >= 2 && !/\b(mcg)\b/.test(doseNorm)) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis letal de Nitroprusiato (${item.dose}); debe titularse en mcg/kg/min. Riesgo de colapso tensional y toxicidad por cianuro.`
        );
        continue;
      }
      if (/\b(labetalol|metoprolol|esmolol|atenolol)\b/.test(drugNorm) && (baseBP.sys < 92 || baseHr < 52)) {
        const pBb = extractDrugSpecificDose(/\b(labetalol|metoprolol|esmolol|atenolol)\b/, item, weightKg);
        if (pBb !== null || !COMPOUND_DRUG_NAMES_REGEX.test(doseNorm)) {
          flagError(
            `¡ERROR CRÍTICO!: Betabloqueador (${item.drug}) prescrito en paciente hipotenso o con bradicardia severa; riesgo de choque cardiogénico.`
          );
          continue;
        }
      }
    }

    // 5. Opioides y Benzodiacepinas (control de mcg vs mg en Fentanilo y depresores respiratorios)
    if (/\b(fentanilo|morfina|tramadol|lorazepam|midazolam|diazepam|clonazepam)\b/.test(drugNorm)) {
      const pSed = extractDrugSpecificDose(
        /\b(fentanilo|morfina|tramadol|lorazepam|midazolam|diazepam|clonazepam)\b/,
        item,
        weightKg
      );
      const mg = pSed?.mg ?? null;
      const isFent = drugNorm.includes('fentanilo');
      const isMorph = drugNorm.includes('morfina');
      const isLorazMidaz = /\b(lorazepam|midazolam|clonazepam)\b/.test(drugNorm);
      const isDiaz = drugNorm.includes('diazepam');
      if (
        mg !== null &&
        ((isFent && (mg >= 0.4 || mg / weightKg >= 0.006)) ||
          (isMorph && !drugNorm.includes('tramadol') && (mg >= 20 || mg / weightKg >= 0.3)) ||
          (isLorazMidaz && (mg >= 12 || mg / weightKg >= 0.3)) ||
          (isDiaz && (mg >= 35 || mg / weightKg >= 0.8)) ||
          (drugNorm.includes('tramadol') && mg >= 400))
      ) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS LETAL!: Dosis tóxica de ${item.drug} (${item.dose}); causa depresión respiratoria severa, apnea y paro ventilatorio.`
        );
        continue;
      }
    }

    // 6. Sulfato de Magnesio sobredosis
    if (/\b(sulfato de magnesio|mgso4)\b/.test(drugNorm)) {
      const pMag = extractDrugSpecificDose(/\b(sulfato de magnesio|magnesio|mgso4)\b/, item, weightKg);
      if (pMag && pMag.mg !== null) {
        const grams = pMag.mg / 1000;
        if (grams >= 10 || (isPediatric && pMag.mg / weightKg >= 100)) {
          flagError(
            `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis excesiva de Sulfato de Magnesio (${item.dose}); provoca hipermagnesemia severa, parálisis respiratoria y paro cardíaco.`
          );
          continue;
        }
      }
    }

    // 7. Paracetamol dosis hepatotóxica
    if (/\b(paracetamol|acetaminofen)\b/.test(drugNorm)) {
      const pPara = extractDrugSpecificDose(/\b(paracetamol|acetaminofen)\b/, item, weightKg);
      if (pPara && pPara.mg !== null) {
        const isDaily = /\b(dia|24\s*h|cada 6|cada 8|c\/\s*6|c\/\s*8)\b/.test(`${doseNorm} ${freqNorm}`);
        if (!isDaily && (pPara.mg >= 4000 || (isPediatric && pPara.mg / weightKg >= 75))) {
          flagError(
            `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis única tóxica de Paracetamol (${item.dose}); supera el umbral seguro y provoca necrosis hepática aguda.`
          );
          continue;
        }
      }
    }

    // 8. Furosemida en choque / hipovolemia / sobredosis
    if (/\b(furosemida)\b/.test(drugNorm)) {
      const pFuro = extractDrugSpecificDose(/\bfurosemida\b/, item, weightKg);
      if ((baseBP.sys < 95 && !isPulmonaryEdemaOrFluidOverload) || (pFuro && pFuro.mg !== null && pFuro.mg >= 240)) {
        flagError(
          `¡ERROR CRÍTICO!: Prescripción riesgosa de Furosemida (${item.dose}) en hipotensión/hipovolemia o a dosis excesiva.`
        );
        continue;
      }
    }

    // 9. Anticoagulantes / Fibrinolíticos en sangrado activo o sobredosis
    if (
      /\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban)\b/.test(
        drugNorm
      )
    ) {
      if (isActiveBleed || isDengue) {
        flagError(
          `¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de anticoagulante o fibrinolítico (${item.drug}) en paciente con hemorragia activa o dengue; riesgo de exanguinación fatal.`
        );
        continue;
      }
      const pAltep = extractDrugSpecificDose(/\b(alteplasa|tenecteplasa)\b/, item, weightKg);
      if (/\b(alteplasa|tenecteplasa)\b/.test(drugNorm) && pAltep && pAltep.mg !== null && pAltep.mg >= 120) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis supraterapéutica de fibrinolítico (${item.dose}, máx 90 mg en Alteplasa); alto riesgo de hemorragia intracerebral fatal.`
        );
        continue;
      }
    }

    // 10. Atropina tóxica fuera de organofosforados / Metoclopramida en obstrucción
    if (drugNorm.includes('atropina') && !isOrganophosphate && p.mg !== null && p.mg >= 4) {
      flagError(
        `¡ERROR CRÍTICO DE SOBREDOSIS!: Dosis tóxica de Atropina (${item.dose}) fuera de intoxicación por organofosforados.`
      );
    }
    if (isBowelObstruction && /\b(metoclopramida|domperidona|loperamida)\b/.test(drugNorm)) {
      flagError(
        `¡ERROR CRÍTICO!: Uso de procinético/antidiarreico (${item.drug}) en obstrucción intestinal mecánica; riesgo de perforación intestinal.`
      );
    }
    if (isObstructiveAirway && /\b(metoprolol|atenolol|esmolol)\b/.test(drugNorm) && p.mg !== null && p.mg >= 50 && isIV) {
      flagError(
        `¡ERROR CRÍTICO!: Dosis alta IV de betabloqueador en paciente con asma/EPOC.`
      );
    }
    if (isThyroidStorm && /\b(aspirina|acido acetilsalicilico|aas|asa)\b/.test(drugNorm)) {
      flagError(
        `¡ERROR CRÍTICO ENDOCRINO!: Ácido Acetilsalicílico (${item.drug}) está contraindicado en Tormenta Tiroidea porque desplaza T4 de la TBG y agrava la tirotoxicosis.`
      );
    }
    if (
      isMyasthenia &&
      /\b(sulfato de magnesio|mgso4|gentamicina|amikacina|tobramicina|diazepam|lorazepam|midazolam|propranolol|metoprolol|atenolol|labetalol)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO NEUROMUSCULAR!: ${item.drug} agrava el bloqueo de la unión neuromuscular en Miastenia Gravis / Crisis Miasténica y puede precipitar paro ventilatorio.`
      );
    }
    if (
      isPorphyria &&
      /\b(metamizol|dipirona|fenitoina|carbamazepina|valproico|metoclopramida|sulfametoxazol|trimetoprim|rifampicina)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO METABÓLICO!: Fármaco porfirinogénico (${item.drug}) contraindicado en Porfiria Aguda Intermitente.`
      );
    }
    if (
      isPheochromocytoma &&
      /\b(propranolol|metoprolol|atenolol|esmolol)\b/.test(drugNorm) &&
      !/\b(fentolamina|fenoxibenzamina|prazosina|doxazosina|nicardipino)\b/.test(fullPlanNorm)
    ) {
      flagError(
        `¡ERROR CRÍTICO ADRENÉRGICO!: Betabloqueador puro (${item.drug}) sin bloqueo alfa previo en Feocromocitoma provoca crisis hipertensiva paradójica por vasoconstricción alfa-1 no opuesta.`
      );
    }
    if (
      isAorticDissection &&
      /\b(aspirina|acido acetilsalicilico|aas|asa|clopidogrel|ticagrelor|prasugrel|heparina|enoxaparina|warfarina|apixaban|rivaroxaban|alteplasa|tenecteplasa|estreptoquinasa)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO VASCULAR!: Antitrombótico/fibrinolítico (${item.drug}) contraindicado en Disección Aórtica Aguda; precipita extensión de disección, taponamiento pericárdico y rotura aórtica fatal.`
      );
    }
    if (
      isGlaucoma &&
      /\b(atropina|tropicamida|ciclopentolato|fenilefrina|escopolamina|butilhioscina|hioscina|ipratropio|dimenhidrinato|difenhidramina)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO OFTALMOLÓGICO!: Anticolinérgico o midriático (${item.drug}) contraindicado en Glaucoma Agudo de Ángulo Cerrado; precipita bloqueo pupilar y ceguera irreversible.`
      );
    }
    if (
      isUrinaryRetention &&
      /\b(furosemida|bumetanida|butilhioscina|buscapina|hioscina|atropina|escopolamina|oxibutinina|tolterodina|dimenhidrinato)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO UROLÓGICO!: Diurético de asa o anticolinérgico (${item.drug}) contraindicado en Retención Aguda de Orina.`
      );
    }
    if (isAcetaminophenTox && /\b(paracetamol|acetaminofen)\b/.test(drugNorm)) {
      flagError(
        `¡ERROR CRÍTICO TOXICOLÓGICO!: Prescripción de Paracetamol (${item.drug}) en intoxicación por Paracetamol; agrava la necrosis hepática fulminante.`
      );
    }
    if (isParkinson && /\b(metoclopramida|haloperidol|clorpromazina|risperidona)\b/.test(drugNorm)) {
      flagError(
        `¡ERROR CRÍTICO NEUROLÓGICO!: Bloqueador dopaminérgico central (${item.drug}) contraindicado en Enfermedad de Parkinson; precipita rigidez extrema y acinesia aguda.`
      );
    }
    if (
      isAvBlock &&
      /\b(verapamilo|diltiazem|digoxina|metoprolol|propranolol|atenolol|esmolol|labetalol|carvedilol|bisoprolol|amiodarona)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO CARDIOLÓGICO!: Frenador del nodo AV (${item.drug}) contraindicado en paciente con Bloqueo AV; riesgo de bloqueo completo/asistolia.`
      );
    }
    if (
      isMyxedemaComa &&
      /\b(levotiroxina|liotironina)\b/.test(drugNorm) &&
      !/\b(hidrocortisona|dexametasona|metilprednisolona)\b/.test(fullPlanNorm)
    ) {
      flagError(
        `¡ERROR CRÍTICO ENDOCRINO!: Hormona tiroidea (${item.drug}) en Coma Mixedematoso sin cobertura concomitante de Hidrocortisona IV puede precipitar crisis suprarrenal aguda.`
      );
    }
    if (
      isSerotoninSyndrome &&
      /\b(sertralina|fluoxetina|paroxetina|citalopram|escitalopram|venlafaxina|tramadol|fentanilo|dextrometorfano|linezolid|haloperidol|ondansetron|metoclopramida|litio)\b/.test(
        drugNorm
      )
    ) {
      flagError(
        `¡ERROR CRÍTICO!: ${item.drug} perpetúa o agrava el Síndrome Serotoninérgico agudo.`
      );
    }

    // 11. Seguridad en Embarazo (teratógenos y toxicidad fetal)
    if (isViablePregnancy) {
      if (/\b(enalapril|captopril|lisinopril|ramipril|losartan|valsartan|irbesartan|telmisartan|candesartan)\b/.test(drugNorm)) {
        flagError(
          `¡ERROR CRÍTICO OBSTÉTRICO!: IECA/ARA-II (${item.drug}) absolutamente contraindicado en el embarazo por fetotoxicidad renal, oligohidramnios y teratogenicidad.`
        );
        continue;
      }
      if (/\b(doxiciclina|tetraciclina|minociclina|ciprofloxacino|levofloxacino|moxifloxacino|metotrexato|valproato|acido valproico|litio|warfarina|atorvastatina|rosuvastatina|simvastatina|isotretinoina)\b/.test(drugNorm)) {
        flagError(
          `¡ERROR CRÍTICO TERATOGÉNICO!: ${item.drug} está contraindicado durante la gestación por alto riesgo teratogénico o toxicidad fetal.`
        );
        continue;
      }
      if (drugNorm.includes('misoprostol') && !/\b(aborto|hemorragia postparto|atonia|puerperio)\b/.test(diagNorm)) {
        flagError(
          `¡ERROR CRÍTICO OBSTÉTRICO!: Misoprostol (${item.drug}) contraindicado en embarazo viable sin indicación obstétrica específica (riesgo de aborto o rotura uterina).`
        );
        continue;
      }
      if (
        isThirdTrimester &&
        /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|indometacina|meloxicam|celecoxib|piroxicam)\b/.test(drugNorm)
      ) {
        flagError(
          `¡ERROR CRÍTICO OBSTÉTRICO!: AINE (${item.drug}) contraindicado en el tercer trimestre de gestación por riesgo de cierre prematuro del conducto arterioso fetal y oligohidramnios.`
        );
        continue;
      }
    }

    // 12. Seguridad en Deterioro Renal (LRA / ERC)
    if (isRenalImpairment) {
      if (/\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|indometacina|meloxicam|celecoxib|piroxicam|gentamicina|amikacina|tobramicina)\b/.test(drugNorm)) {
        flagError(
          `¡ERROR CRÍTICO NEFROLÓGICO!: Fármaco nefrotóxico (${item.drug}) contraindicado en paciente con lesión/enfermedad renal; agrava la caída de la TFG.`
        );
        continue;
      }
      if (isAcuteKidneyInjury && /\b(metformina|espironolactona|eplerenona)\b/.test(drugNorm)) {
        flagError(
          `¡ERROR CRÍTICO!: ${item.drug} contraindicado en Lesión Renal Aguda por alto riesgo de acidosis láctica (metformina) o hiperpotasemia grave (ahorradores de K⁺).`
        );
        continue;
      }
    }

    // 13. Seguridad Pediátrica (contraindicaciones por edad y sobredosis por peso)
    if (ageYears < 16) {
      const isKawasaki = diagNorm.includes('kawasaki');
      if (!isKawasaki && /\b(aspirina|acido acetilsalicilico|aas)\b/.test(drugNorm)) {
        flagError(
          `¡ERROR CRÍTICO PEDIÁTRICO!: Ácido Acetilsalicílico (${item.drug}) contraindicado en menores de 16 años por riesgo de Síndrome de Reye.`
        );
        continue;
      }
      if (isUnder8 && /\b(doxiciclina|tetraciclina|minociclina)\b/.test(drugNorm) && !/\b(ricketts|antrax|carbunco)\b/.test(diagNorm)) {
        flagError(
          `¡ERROR CRÍTICO PEDIÁTRICO!: Tetraciclina (${item.drug}) contraindicada de rutina en menores de 8 años por tinción dental e inhibición del crecimiento óseo.`
        );
        continue;
      }
      if (
        !isTopicalLocal &&
        /\b(ciprofloxacino|levofloxacino|moxifloxacino)\b/.test(drugNorm) &&
        !/\b(fibrosis quistica|pseudomonas|antrax)\b/.test(diagNorm)
      ) {
        flagError(
          `¡ERROR CRÍTICO PEDIÁTRICO!: Fluoroquinolona (${item.drug}) no indicada como primera línea en pediatría por riesgo de artropatía; utilice betalactámico o macrólido seguro.`
        );
        continue;
      }
    }
    if (isPediatric && p.mg !== null) {
      if (drugNorm.includes('amoxicilina') && p.mg / weightKg >= 150) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS PEDIÁTRICA!: Dosis excesiva de Amoxicilina (${item.dose} para ~${weightKg} kg).`
        );
        continue;
      }
      if (drugNorm.includes('ceftriaxona') && p.mg / weightKg >= 120) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS PEDIÁTRICA!: Dosis excesiva de Ceftriaxona (${item.dose} para ~${weightKg} kg).`
        );
        continue;
      }
      if (drugNorm.includes('ibuprofeno') && p.mg / weightKg >= 20) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS PEDIÁTRICA!: Dosis única tóxica de Ibuprofeno (${item.dose} para ~${weightKg} kg).`
        );
        continue;
      }
      if (/\b(prednisona|prednisolona)\b/.test(drugNorm) && p.mg / weightKg >= 4) {
        flagError(
          `¡ERROR CRÍTICO DE SOBREDOSIS PEDIÁTRICA!: Dosis supraterapéutica de corticoide (${item.dose} para ~${weightKg} kg).`
        );
        continue;
      }
    }
  }

  // 14. Auditoría Acumulativa (receta multi-línea + dosis STAT acumuladas)
  const extractRepeatMultiplier = (item: MedicationItem): number => {
    const txt = `${item.frequency || ''} ${item.duration || ''}`;
    const m = txt.match(
      /(?:×|(?<![a-zA-ZáéíóúñÁÉÍÓÚÑ])x)\s*(\d+)(?!\s*(?:h\b|hr\b|horas?|d\b|dias?|días?|semanas?|mes(?:es)?|%|kg\b|mg\b|ml\b))/i
    );
    return m ? Math.max(1, parseInt(m[1], 10)) : 1;
  };
  const isStatSyncedRow = (item: MedicationItem): boolean =>
    item.id.startsWith('med-stat-') ||
    item.phase === 'stat_urgencias' ||
    /aplicado stat|dosis stat/i.test(item.frequency || '');

  const cumFromStat = computeCumulativePharmacology(statInterventions, weightKg);
  const rxItemsToSum =
    statInterventions.length > 0
      ? medications.filter((m) => !isStatSyncedRow(m))
      : medications;

  let paraRxMg = 0;
  const paraIds: string[] = [];
  let nsaidRxEq = 0;
  const nsaidIds: string[] = [];
  let opioidRxMeq = 0;
  let benzoRxDeq = 0;
  let propofolRxMg = 0;
  const cnsIds: string[] = [];
  let ahtRxEq = 0;
  const ahtIds: string[] = [];
  let insulinRxUi = 0;
  const insulinIds: string[] = [];
  let furoRxMg = 0;
  const furoIds: string[] = [];
  let mgRxGrams = 0;
  const mgIds: string[] = [];
  let sabaRxMg = 0;
  const sabaIds: string[] = [];
  let ondRxMg = 0;
  const ondIds: string[] = [];
  let metoRxMg = 0;
  const metoIds: string[] = [];
  let adrRxMg = 0;
  const adrIds: string[] = [];
  let kclRxMeq = 0;
  const kclIds: string[] = [];
  let fluidRxMl = 0;
  const fluidIds: string[] = [];
  let anticoagCount = 0;
  const anticoagIds: string[] = [];

  for (const item of rxItemsToSum) {
    const dN = norm(item.drug || '');
    const doseN = norm(item.dose || '');
    const rN = norm(item.route || '');
    const fN = norm(`${item.frequency || ''} ${item.duration || ''}`);
    if (!dN || negationRegex.test(`${dN} ${doseN}`)) continue;
    const mult = extractRepeatMultiplier(item);
    const pItem = parseNumericDose(item.dose || '', weightKg);
    const isInh = rN.includes('inhalat') || rN.includes('nebuliz') || doseN.includes('nebuliz');
    const isTopicalLocal =
      /\b(topic[oa]|otic[oa]|oftalmic[oa]|nasal|cutane[oa]|gel|crema|gotas|colirio|unguento|pomada)\b/.test(
        `${dN} ${doseN} ${rN}`
      ) && !/\b(intravenos[oa]|oral|\bvo\b|\biv\b|\bim\b)\b/.test(rN);

    if (/\b(paracetamol|acetaminofen)\b/.test(dN)) {
      const pPar = extractDrugSpecificDose(/\b(paracetamol|acetaminofen)\b/, item, weightKg);
      if (pPar !== null) {
        paraRxMg += (pPar.mg ?? 500) * mult;
        paraIds.push(item.id);
      }
    }
    if (
      !isTopicalLocal &&
      /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|piroxicam|indometacina|meloxicam|celecoxib)\b/.test(dN)
    ) {
      const nsaidRegex = /\b(ibuprofeno|diclofenaco|ketorolaco|naproxeno|piroxicam|indometacina|meloxicam|celecoxib)\b/;
      const pNsaid = extractDrugSpecificDose(nsaidRegex, item, weightKg);
      if (pNsaid !== null) {
        // Si dN combina varios nombres (ej. "Ketorolaco o Paracetamol"), seleccionar el AINE realmente dosificado
        const nsaidDrugMatch =
          doseN.match(nsaidRegex)?.[0] || dN.match(nsaidRegex)?.[0] || dN;
        nsaidRxEq += getNsaidEquivUnits(nsaidDrugMatch, pNsaid) * mult;
        nsaidIds.push(item.id);
      }
    }
    if (/\b(morfina|fentanilo|tramadol|meperidina|oxicodona)\b/.test(dN)) {
      const opRegex = /\b(morfina|fentanilo|tramadol|meperidina|oxicodona)\b/;
      const pOp = extractDrugSpecificDose(opRegex, item, weightKg);
      if (pOp !== null) {
        const opName = doseN.match(opRegex)?.[0] || dN.match(opRegex)?.[0] || dN;
        const mgVal = (pOp.mg ?? (opName.includes('fentanilo') ? 0.05 : opName.includes('tramadol') ? 50 : 4)) * mult;
        opioidRxMeq += opName.includes('fentanilo') ? mgVal * 100 : opName.includes('tramadol') ? mgVal * 0.1 : mgVal;
        cnsIds.push(item.id);
      }
    }
    if (/\b(diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/.test(dN)) {
      const bzRegex = /\b(diazepam|lorazepam|midazolam|clonazepam|alprazolam)\b/;
      const pBz = extractDrugSpecificDose(bzRegex, item, weightKg);
      if (pBz !== null) {
        const primaryBz =
          doseN.match(bzRegex)?.[0] ||
          dN.replace(/\(\s*(?:o|u)\s+[^)]+\)/g, ' ').match(bzRegex)?.[0] ||
          dN;
        const mgVal =
          (pBz.mg ?? (primaryBz.includes('lorazepam') ? 2 : primaryBz.includes('midazolam') ? 3 : 10)) * mult;
        benzoRxDeq += primaryBz.includes('lorazepam')
          ? mgVal * 5
          : primaryBz.includes('midazolam')
            ? mgVal * 3.33
            : primaryBz.includes('clonazepam')
              ? mgVal * 10
              : mgVal;
        cnsIds.push(item.id);
      }
    }
    if (dN.includes('propofol')) {
      propofolRxMg += (pItem.mg ?? 100) * mult;
      cnsIds.push(item.id);
    }
    if (/\b(labetalol|hidralazina|nifedipin|nitroprusiato|nicardipin|enalaprilat|enalapril|losartan|captopril|amlodipino|esmolol|metoprolol|atenolol|propranolol)\b/.test(dN)) {
      const ahtRegex =
        /\b(labetalol|hidralazina|nifedipin[oa]?|nitroprusiato|nicardipin[oa]?|enalaprilat|enalapril|losartan|captopril|amlodipino|esmolol|metoprolol|atenolol|propranolol)\b/;
      const pAht = extractDrugSpecificDose(ahtRegex, item, weightKg);
      if (pAht !== null) {
        ahtRxEq += getAntihypertensiveEquivUnits(dN, pAht, doseN, rN) * mult;
        ahtIds.push(item.id);
      }
    }
    if (/\binsulina\b/.test(dN)) {
      const pIns = extractDrugSpecificDose(/\binsulina\b/, item, weightKg);
      if (pIns !== null) {
        insulinRxUi += (pIns.ui ?? 6) * mult;
        insulinIds.push(item.id);
      }
    }
    if (/\b(furosemida|diuretico)\b/.test(dN)) {
      const pFuro = extractDrugSpecificDose(/\b(furosemida|diuretico)\b/, item, weightKg);
      if (pFuro !== null) {
        furoRxMg += (pFuro.mg ?? 40) * mult;
        furoIds.push(item.id);
      }
    }
    if (/\b(sulfato de magnesio|magnesio|mgso4)\b/.test(dN)) {
      const pMg = extractDrugSpecificDose(/\b(sulfato de magnesio|magnesio|mgso4)\b/, item, weightKg);
      if (pMg !== null) {
        mgRxGrams += (pMg.mg ? pMg.mg / 1000 : 4) * mult;
        mgIds.push(item.id);
      }
    }
    if (/\b(salbutamol|albuterol)\b/.test(dN)) {
      sabaRxMg += (pItem.mg ?? (pItem.puffs ? pItem.puffs * 0.1 : 5)) * mult;
      sabaIds.push(item.id);
    }
    if (dN.includes('ondansetron')) {
      const pOnd = extractDrugSpecificDose(/\bondansetron\b/, item, weightKg);
      if (pOnd !== null) {
        ondRxMg += (pOnd.mg ?? 4) * mult;
        ondIds.push(item.id);
      }
    }
    if (dN.includes('metoclopramida')) {
      const pMeto = extractDrugSpecificDose(/\bmetoclopramida\b/, item, weightKg);
      if (pMeto !== null) {
        metoRxMg += (pMeto.mg ?? 10) * mult;
        metoIds.push(item.id);
      }
    }
    if (/\b(adrenalina|epinefrina)\b/.test(dN) && !isInh) {
      const pAdrRx = extractDrugSpecificDose(/\b(adrenalina|epinefrina)\b/, item, weightKg);
      if (pAdrRx !== null) {
        adrRxMg += (pAdrRx.mg ?? 0.5) * mult;
        adrIds.push(item.id);
      }
    }
    if (/\b(cloruro de potasio|kcl|potasio)\b/.test(dN) && !dN.includes('losartan')) {
      const pKclRx = extractDrugSpecificDose(/\b(cloruro de potasio|kcl|potasio)\b/, item, weightKg);
      if (pKclRx !== null) {
        kclRxMeq += (pKclRx.meq ?? (pKclRx.mg ? pKclRx.mg / 74.5 : 20)) * mult;
        kclIds.push(item.id);
      }
    }
    if (
      /\b(salina|ssn|hartmann|ringer|cristaloide)\b/.test(dN) &&
      !/\b(glucosad|glucosal|dextrosa|mixta)\b/.test(dN) &&
      !isTopicalLocal
    ) {
      const pFluid = extractDrugSpecificDose(/\b(salina|ssn|hartmann|ringer|cristaloide)\b/, item, weightKg);
      if (pFluid !== null) {
        const rawFluidMl = (pFluid.ml ?? (isPediatric ? Math.round(weightKg * 20) : 500)) * mult;
        const is24hMaintenance =
          /(?:\/|por\s+)(?:dia|24\s*h)|holliday|mantenimiento/i.test(`${doseN} ${fN}`) &&
          !/\b(bolo|carga|1\.?a?\s*hora|primera\s*hora|rapida|stat)\b/.test(`${doseN} ${fN}`);
        fluidRxMl += is24hMaintenance ? Math.round(rawFluidMl / 12) : rawFluidMl;
        fluidIds.push(item.id);
      }
    }
    if (/\b(alteplasa|tenecteplasa|estreptoquinasa|heparina|enoxaparina|warfarina|apixaban|rivaroxaban)\b/.test(dN)) {
      anticoagCount += mult;
      anticoagIds.push(item.id);
    }
  }

  const statFluid = getCumulativePriorDoses(statInterventions, weightKg, /\b(salina|ssn|hartmann|ringer|cristaloide)\b/);
  const statIns = getCumulativePriorDoses(statInterventions, weightKg, /\binsulina\b/);
  const statSaba = getCumulativePriorDoses(statInterventions, weightKg, /\b(salbutamol|albuterol)\b/);

  const flagCumulative = (ids: string[], msg: string) => {
    for (const id of ids) unsafeMedicationIds.add(id);
    for (const m of medications) {
      if (isStatSyncedRow(m)) {
        const mn = norm(m.drug || '');
        if (ids.length === 0 && msg.toLowerCase().includes(mn.slice(0, 5))) {
          unsafeMedicationIds.add(m.id);
        }
      }
    }
    if (!errors.some((e) => norm(e) === norm(msg))) {
      errors.push(msg);
    }
  };

  const totalParaCum = cumFromStat.paracetamolMg + paraRxMg;
  const hasMultipleParaSources =
    cumFromStat.paracetamolMg > 0 || paraIds.length >= 2 || rxItemsToSum.some((m) => paraIds.includes(m.id) && extractRepeatMultiplier(m) >= 2);
  if (hasMultipleParaSources && (totalParaCum >= 4000 || (isPediatric && totalParaCum / weightKg >= 75))) {
    flagCumulative(
      paraIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN FARMACOLÓGICA!: Dosis acumulada de Paracetamol (${Math.round(totalParaCum)} mg) supera el umbral hepatotóxico seguro (4,000 mg/día o 75 mg/kg).`
    );
  }

  const totalNsaidCum = cumFromStat.nsaidEquivUnits + nsaidRxEq;
  if (totalNsaidCum >= 2.0) {
    flagCumulative(
      nsaidIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN FARMACOLÓGICA!: Duplicidad/acumulación de AINEs (${totalNsaidCum.toFixed(1)} dosis equivalentes); alto riesgo de hemorragia digestiva alta y lesión renal aguda.`
    );
  }

  const totalUnreversedOpioids = cumFromStat.unreversedOpioidMeq + opioidRxMeq;
  const totalUnreversedBenzos = cumFromStat.unreversedBenzoDeq + benzoRxDeq;
  const totalPropofol = cumFromStat.propofolMg + propofolRxMg;
  const totalCnsLoad = totalUnreversedOpioids / 10 + totalUnreversedBenzos / 20 + totalPropofol / 150;
  if (totalCnsLoad >= 1.2) {
    flagCumulative(
      cnsIds,
      '¡ERROR CRÍTICO POR ACUMULACIÓN DE DEPRESORES DEL SNC!: Suma acumulada no revertida de opioides/benzodiacepinas/propofol provoca depresión respiratoria grave y coma.'
    );
  }

  const totalAhtCum = cumFromStat.ahtEquivUnits + ahtRxEq;
  if (totalAhtCum >= 5.0) {
    flagCumulative(
      ahtIds,
      '¡ERROR CRÍTICO POR ACUMULACIÓN ANTIHIPERTENSIVA!: Dosis repetidas o combinadas de antihipertensivos generan hipotensión vasopléjica severa e hipoperfusión orgánica.'
    );
  }

  const totalInsCum = statIns.ui + insulinRxUi;
  if (totalInsCum >= 45) {
    flagCumulative(
      insulinIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN DE INSULINA!: Carga total acumulada (${Math.round(totalInsCum)} UI) conlleva alto riesgo de hipoglucemia neuroglucopénica e hipokalemia letal.`
    );
  }

  const totalFuroCum = cumFromStat.furoMg + furoRxMg;
  if (totalFuroCum >= 200 || (isPediatric && totalFuroCum / weightKg >= 5)) {
    flagCumulative(
      furoIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN DE DIURÉTICO!: Carga acumulada de Furosemida (${Math.round(totalFuroCum)} mg) produce depleción intravascular severa, hipokalemia y ototoxicidad.`
    );
  }

  const totalMgCum = cumFromStat.unreversedMgGrams + mgRxGrams;
  if (totalMgCum >= 10) {
    flagCumulative(
      mgIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN DE MAGNESIO!: Dosis acumulada de Sulfato de Magnesio (${totalMgCum.toFixed(1)} g) supera margen seguro con riesgo de parálisis respiratoria y bloqueo AV.`
    );
  }

  const totalSabaCum = statSaba.mg + sabaRxMg;
  if (!isHyperkalemia && totalSabaCum >= 30) {
    flagCumulative(
      sabaIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN BETA-2!: Dosis acumulada de Salbutamol (${Math.round(totalSabaCum)} mg) provoca taquiarritmia severa, hipokalemia aguda y acidosis láctica.`
    );
  }

  const totalOndCum = cumFromStat.ondansetronMg + ondRxMg;
  if (totalOndCum >= 24) {
    flagCumulative(
      ondIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN DE ONDANSETRÓN!: Carga acumulada (${Math.round(totalOndCum)} mg) prolonga peligrosamente el intervalo QTc (riesgo de Torsades de Pointes).`
    );
  }

  const totalMetoCum = cumFromStat.metoclopramidaMg + metoRxMg;
  if (totalMetoCum >= 30) {
    flagCumulative(
      metoIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN DE METOCLOPRAMIDA!: Dosis acumulada (${Math.round(totalMetoCum)} mg) precipita síndrome extrapiramidal agudo (distonía/acatisia).`
    );
  }

  const totalAdrCum = cumFromStat.adrNonInhaledMg + adrRxMg;
  if (totalAdrCum >= 1.8) {
    flagCumulative(
      adrIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN ADRENÉRGICA!: Carga acumulada de Adrenalina (${totalAdrCum.toFixed(2)} mg) desencadena crisis hipertensiva e isquemia/arritmia maligna.`
    );
  }

  const totalKclCum = cumFromStat.kclMeq + kclRxMeq;
  if (totalKclCum >= 80) {
    flagCumulative(
      kclIds,
      `¡ERROR CRÍTICO POR ACUMULACIÓN DE POTASIO!: Carga acumulada de KCl (${Math.round(totalKclCum)} mEq) genera hiperkalemia severa y riesgo de fibrilación ventricular.`
    );
  }

  const totalFluidCum = statFluid.ml + fluidRxMl;
  if (totalFluidCum / weightKg >= 75) {
    flagCumulative(
      fluidIds,
      `¡ERROR CRÍTICO POR SOBRECARGA HÍDRICA ACUMULATIVA!: Volumen total (${Math.round(totalFluidCum)} mL · ${Math.round(totalFluidCum / weightKg)} mL/kg) precipita edema agudo de pulmón iatrogénico.`
    );
  }

  if (anticoagCount >= 3 || cumFromStat.heparinaUi >= 20000 || cumFromStat.lyticMg >= 110 || cumFromStat.enoxaparinaMg >= 200) {
    flagCumulative(
      anticoagIds,
      '¡ERROR CRÍTICO POR ACUMULACIÓN ANTITROMBÓTICA!: Duplicidad o exceso acumulado de anticoagulantes/fibrinolíticos con alto riesgo de hemorragia mayor.'
    );
  }

  return { unsafeMedicationIds, errors };
}
