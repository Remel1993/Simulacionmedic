import { ClinicalCase, ComplementaryStudy, VitalSigns } from '../types/clinical';

function normText(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export interface PregnancyContext {
  isPregnant: boolean;
  isViablePregnancy: boolean;
  isThirdTrimester: boolean;
  gestationalWeeks: number | null;
}

/**
 * Detecta contexto gestacional del caso.
 * Con `publicOnly: true` solo revisa datos visibles de ingreso/anamnesis (evita spoilers en casos ocultos como ectópico).
 */
export function detectPregnancyContext(
  caseData: ClinicalCase,
  options?: { publicOnly?: boolean }
): PregnancyContext {
  if (caseData.patientInfo.sex !== 'Femenino' || caseData.patientInfo.age < 11 || caseData.patientInfo.age > 55) {
    return { isPregnant: false, isViablePregnancy: false, isThirdTrimester: false, gestationalWeeks: null };
  }

  const publicOnly = Boolean(options?.publicOnly);
  const publicCorpus = normText(
    [
      caseData.patientInfo.consultReason,
      caseData.patientInfo.currentIllness,
      ...(caseData.background?.pathological || []),
      ...(caseData.background?.nonPathological || []),
    ].join(' ')
  );
  const fullCorpus = publicOnly
    ? publicCorpus
    : normText(
        [
          publicCorpus,
          caseData.solution?.correctDiagnosis || '',
          caseData.solution?.pathophysiology || '',
        ].join(' ')
      );

  const sdgMatch = fullCorpus.match(/\b(\d{1,2})\s*(?:sdg|semanas?\s+de\s+(?:gestacion|embarazo)|semanas?\s+gestacional)/);
  const gestationalWeeks = sdgMatch ? parseInt(sdgMatch[1], 10) : null;

  const isEctopicOrMiscarriage = /\b(ectopico|aborto|mola\s+hidatiforme|embarazo\s+no\s+viable|huevo\s+muerto)\b/.test(
    fullCorpus
  );

  const hasExplicitPregnancy =
    /\b(embarazo|embarazada|gestacion|gestante|primigesta|multigesta|preeclampsia|eclampsia|placenta\s+previa|desprendimiento\s+prematuro|diabetes\s+gestacional|hiperemesis\s+gravidica|parto|puerperio)\b/.test(
      fullCorpus
    ) || gestationalWeeks !== null;

  // Negación explícita ("descarta embarazo", "niega embarazo", "sin embarazo")
  const hasExplicitNegation = /\b(niega\s+embarazo|sin\s+embarazo|no\s+embarazada)\b/.test(fullCorpus);

  const isPregnant = hasExplicitPregnancy && !hasExplicitNegation;
  const isViablePregnancy = isPregnant && !isEctopicOrMiscarriage;
  const isThirdTrimester =
    isViablePregnancy &&
    ((gestationalWeeks !== null && gestationalWeeks >= 27) ||
      /\b(tercer\s+trimestre|preeclampsia|eclampsia|placenta\s+previa|prematuro)\b/.test(fullCorpus));

  return {
    isPregnant,
    isViablePregnancy,
    isThirdTrimester,
    gestationalWeeks,
  };
}

export interface RenalImpairmentContext {
  hasRenalImpairment: boolean;
  isAcuteKidneyInjury: boolean;
  isChronicKidneyDisease: boolean;
}

export function detectRenalImpairmentContext(caseData: ClinicalCase): RenalImpairmentContext {
  const diag = normText(caseData.solution?.correctDiagnosis || '');
  const corpus = normText(
    [
      diag,
      caseData.solution?.pathophysiology || '',
      ...(caseData.background?.pathological || []),
      caseData.patientInfo.currentIllness,
    ].join(' ')
  );

  const isAcuteKidneyInjury = /\b(lesion\s+renal\s+aguda|insuficiencia\s+renal\s+aguda|lra|ira|rabdomiolisis|sindrome\s+nefritico\s+agudo|necrosis\s+tubular)\b/.test(
    corpus
  );
  const isChronicKidneyDisease = /\b(enfermedad\s+renal\s+cronica|insuficiencia\s+renal\s+cronica|\berc\b|nefropatia\s+diabetica|nefropatia\s+hipertensiva|dialisis|hemodialisis)\b/.test(
    corpus
  );

  return {
    hasRenalImpairment: isAcuteKidneyInjury || isChronicKidneyDisease,
    isAcuteKidneyInjury,
    isChronicKidneyDisease,
  };
}

export interface VitalReferenceBounds {
  ageGroupLabel: string;
  hrMin: number;
  hrMax: number;
  rrMin: number;
  rrMax: number;
  sbpLow: number;
  sbpHigh: number;
  summaryText: string;
}

export function getVitalReferenceBounds(age: number, isPregnant = false): VitalReferenceBounds {
  if (age < 1) {
    return {
      ageGroupLabel: 'Lactante (<1 año)',
      hrMin: 100,
      hrMax: 160,
      rrMin: 30,
      rrMax: 55,
      sbpLow: 70,
      sbpHigh: 105,
      summaryText: 'Ref. lactante: FC 100–160 lpm · FR 30–55 rpm · PAS ≥70 mmHg',
    };
  }
  if (age <= 5) {
    return {
      ageGroupLabel: `Preescolar (${age} años)`,
      hrMin: 80,
      hrMax: 130,
      rrMin: 20,
      rrMax: 34,
      sbpLow: 75 + age * 2,
      sbpHigh: 115,
      summaryText: `Ref. ${age} años: FC 80–130 lpm · FR 20–34 rpm · PAS ≥${75 + age * 2} mmHg`,
    };
  }
  if (age <= 11) {
    return {
      ageGroupLabel: `Escolar (${age} años)`,
      hrMin: 70,
      hrMax: 115,
      rrMin: 16,
      rrMax: 26,
      sbpLow: 80 + age * 2,
      sbpHigh: 125,
      summaryText: `Ref. ${age} años: FC 70–115 lpm · FR 16–26 rpm · PAS ≥${80 + age * 2} mmHg`,
    };
  }
  if (age <= 17) {
    return {
      ageGroupLabel: `Adolescente (${age} años)`,
      hrMin: 60,
      hrMax: 105,
      rrMin: 12,
      rrMax: 22,
      sbpLow: 90,
      sbpHigh: 135,
      summaryText: 'Ref. adolescente: FC 60–105 lpm · FR 12–22 rpm · PAS 90–135 mmHg',
    };
  }
  if (isPregnant) {
    return {
      ageGroupLabel: 'Gestante',
      hrMin: 60,
      hrMax: 110,
      rrMin: 12,
      rrMax: 22,
      sbpLow: 90,
      sbpHigh: 139,
      summaryText: 'Ref. gestante: FC 60–110 lpm · FR 12–22 rpm · PA <140/90 mmHg',
    };
  }
  if (age >= 65) {
    return {
      ageGroupLabel: 'Adulto mayor',
      hrMin: 55,
      hrMax: 100,
      rrMin: 12,
      rrMax: 20,
      sbpLow: 95,
      sbpHigh: 140,
      summaryText: 'Ref. adulto mayor: FC 55–100 lpm · FR 12–20 rpm · PAS 95–140 mmHg',
    };
  }
  return {
    ageGroupLabel: 'Adulto',
    hrMin: 60,
    hrMax: 100,
    rrMin: 12,
    rrMax: 20,
    sbpLow: 90,
    sbpHigh: 140,
    summaryText: 'Ref. adulto: FC 60–100 lpm · FR 12–20 rpm · PA <140/90 mmHg',
  };
}

export interface AgeAdjustedVitalFlags {
  bounds: VitalReferenceBounds;
  isTachycardic: boolean;
  isBradycardic: boolean;
  isHypotensive: boolean;
  isHypertensive: boolean;
  isFebrile: boolean;
  isHypoxemic: boolean;
  isTachypneic: boolean;
  isBradypneic: boolean;
  isLowGlasgow: boolean;
  isHypoglycemic: boolean;
  isSevereHyperglycemic: boolean;
  isModerateHyperglycemic: boolean;
}

export function evaluateVitalsWithAgeContext(
  vitals: VitalSigns,
  age: number,
  isPregnant = false
): AgeAdjustedVitalFlags {
  const bounds = getVitalReferenceBounds(age, isPregnant);
  const bpMatch = (vitals.bloodPressure || '').match(/(\d+)\s*\/\s*(\d+)/);
  const sys = bpMatch ? parseInt(bpMatch[1], 10) : 120;
  const dia = bpMatch ? parseInt(bpMatch[2], 10) : 80;
  const hasGlucose = typeof vitals.bloodGlucose === 'number' && !Number.isNaN(vitals.bloodGlucose);

  return {
    bounds,
    isTachycardic: vitals.heartRate > bounds.hrMax,
    isBradycardic: vitals.heartRate < bounds.hrMin,
    isHypotensive: bpMatch ? sys < bounds.sbpLow : false,
    isHypertensive: bpMatch ? sys >= bounds.sbpHigh || dia >= 90 : false,
    isFebrile: vitals.temperature >= 38.0,
    isHypoxemic: vitals.oxygenSaturation < 94,
    isTachypneic: vitals.respiratoryRate > bounds.rrMax,
    isBradypneic: vitals.respiratoryRate < bounds.rrMin,
    isLowGlasgow: vitals.glasgow <= 12,
    isHypoglycemic: hasGlucose && (vitals.bloodGlucose as number) < 70,
    isSevereHyperglycemic: hasGlucose && (vitals.bloodGlucose as number) >= 250,
    isModerateHyperglycemic:
      hasGlucose && (vitals.bloodGlucose as number) >= 180 && (vitals.bloodGlucose as number) < 250,
  };
}

export interface DerivedBedsideIndices {
  map: number | null;
  bmi: number | null;
  bmiLabel: string | null;
  qsofaScore: number | null;
  pao2Fio2: number | null;
}

export function computeDerivedBedsideIndices(
  vitals: VitalSigns,
  age: number,
  unlockedStudies: ComplementaryStudy[] = []
): DerivedBedsideIndices {
  const bpMatch = (vitals.bloodPressure || '').match(/(\d+)\s*\/\s*(\d+)/);
  const sys = bpMatch ? parseInt(bpMatch[1], 10) : null;
  const dia = bpMatch ? parseInt(bpMatch[2], 10) : null;
  const map = sys !== null && dia !== null ? Math.round(dia + (sys - dia) / 3) : null;

  let bmi: number | null = null;
  let bmiLabel: string | null = null;
  if (vitals.weightKg && vitals.heightCm && vitals.heightCm > 60) {
    const hm = vitals.heightCm / 100;
    const raw = vitals.weightKg / (hm * hm);
    bmi = Number(raw.toFixed(1));
    if (age >= 18) {
      bmiLabel =
        bmi < 18.5
          ? 'Bajo peso'
          : bmi < 25
            ? 'Normopeso'
            : bmi < 30
              ? 'Sobrepeso'
              : 'Obesidad';
    }
  }

  let qsofaScore: number | null = null;
  if (age >= 16 && sys !== null) {
    let q = 0;
    if (vitals.respiratoryRate >= 22) q += 1;
    if (sys <= 100) q += 1;
    if (vitals.glasgow < 15) q += 1;
    qsofaScore = q;
  }

  let pao2Fio2: number | null = null;
  const gasStudy = unlockedStudies.find((s) => {
    const n = normText(s.name);
    return n.includes('gasometria') || s.subcategory === 'Gases';
  });
  if (gasStudy) {
    const gasNorm = normText(gasStudy.result || '');
    const pao2Match = gasNorm.match(/pao2\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)/);
    if (pao2Match) {
      const pao2 = parseFloat(pao2Match[1]);
      const fio2Match = gasNorm.match(/fio2\s*[:=]?\s*(0\.\d+|\d{2,3}\s*%)/);
      let fio2 = 0.21;
      if (fio2Match) {
        const raw = fio2Match[1];
        fio2 = raw.includes('%') ? parseFloat(raw) / 100 : parseFloat(raw);
      }
      if (fio2 > 0 && fio2 <= 1) {
        pao2Fio2 = Math.round(pao2 / fio2);
      }
    }
  }

  return { map, bmi, bmiLabel, qsofaScore, pao2Fio2 };
}

export interface StudyResourceProfile {
  turnaroundLabel: 'Inmediato' | 'Diferido · ~15 min' | 'Alta complejidad · ~30 min';
  costTier: 'Básico' | 'Intermedio' | 'Avanzado';
}

export function getStudyResourceProfile(study: ComplementaryStudy): StudyResourceProfile {
  const n = normText(study.name);
  const sub = study.subcategory;

  if (
    sub === 'Electrocardiograma' &&
    !n.includes('holter') &&
    !n.includes('mapa')
  ) {
    return { turnaroundLabel: 'Inmediato', costTier: 'Básico' };
  }
  if (
    sub === 'Gases' ||
    sub === 'Urinario' ||
    n.includes('glucosa capilar') ||
    n.includes('prueba rapida') ||
    n.includes('inmunocromatografia') ||
    n.includes('gota gruesa')
  ) {
    return { turnaroundLabel: 'Inmediato', costTier: 'Básico' };
  }
  if (
    sub === 'Tomografía' ||
    sub === 'Endoscopia y Broncoscopia' ||
    sub === 'Electromiografía y Neurofisiología' ||
    n.includes('hemocultivo') ||
    n.includes('urocultivo') ||
    n.includes('puncion lumbar') ||
    n.includes('ecocardiograma') ||
    n.includes('holter') ||
    n.includes('mapa') ||
    n.includes('panel autoinmune')
  ) {
    return { turnaroundLabel: 'Alta complejidad · ~30 min', costTier: 'Avanzado' };
  }
  if (sub === 'Radiología' || sub === 'Ecografía') {
    return { turnaroundLabel: 'Diferido · ~15 min', costTier: 'Intermedio' };
  }
  return { turnaroundLabel: 'Diferido · ~15 min', costTier: 'Básico' };
}

/**
 * Nota de referencia fisiológica ajustada por edad/sexo/gestación (sin revelar diagnósticos).
 */
export function getContextualStudyReferenceNote(
  study: ComplementaryStudy,
  caseData: ClinicalCase
): string | null {
  const age = caseData.patientInfo.age;
  const sex = caseData.patientInfo.sex;
  const preg = detectPregnancyContext(caseData, { publicOnly: true });
  const sub = study.subcategory;
  const n = normText(study.name);

  if (sub === 'Hematología' || n.includes('hemograma') || n.includes('biometria')) {
    if (age < 1) {
      return 'Referencia lactante: Hb 10.5–13.5 g/dL · Leucocitos 6,000–17,500/mm³ con predominio linfocítico fisiológico.';
    }
    if (age <= 12) {
      return `Referencia pediátrica (${age} años): Hb 11.5–14.5 g/dL · Leucocitos 5,000–14,500/mm³.`;
    }
    if (preg.isViablePregnancy) {
      return 'Referencia gestacional: hemodilución fisiológica esperada (Hb normal ≥11.0 g/dL en 1.º/3.º trim., ≥10.5 g/dL en 2.º trim.; leucocitosis leve hasta 14,000/mm³).';
    }
    if (sex === 'Masculino') {
      return 'Referencia adulto masculino: Hb 13.5–17.5 g/dL · Hto 40–52%.';
    }
    return 'Referencia adulto femenino: Hb 12.0–15.5 g/dL · Hto 36–46%.';
  }

  if (sub === 'Bioquímica' || n.includes('quimica') || n.includes('creatinina')) {
    if (preg.isViablePregnancy) {
      return 'Referencia gestacional: la hiperfiltración glomerular disminuye fisiológicamente la creatinina sérica esperada (0.4–0.8 mg/dL); valores >0.9 mg/dL sugieren disfunción renal.';
    }
    if (age < 12) {
      return `Referencia pediátrica (${age} años): creatinina sérica basal menor que en adultos (0.3–0.7 mg/dL según talla/masa muscular).`;
    }
    if (age >= 65) {
      return 'Adulto mayor: evaluar siempre TFG estimada (CKD-EPI), ya que creatininas aparentemente normales pueden ocultar deterioro renal por menor masa muscular.';
    }
  }

  if (sub === 'Función Hepática') {
    if (preg.isViablePregnancy) {
      return 'Referencia gestacional: la fosfatasa alcalina se eleva fisiológicamente hasta 2–3× por origen placentario; las transaminasas (AST/ALT) deben mantenerse normales.';
    }
    if (age < 16) {
      return 'Referencia pediátrica: la fosfatasa alcalina fisiológica es más alta que en adultos por crecimiento óseo activo.';
    }
  }

  if (sub === 'Electrocardiograma' && age < 14) {
    return `ECG pediátrico (${age} años): la frecuencia cardíaca basal es mayor y es normal observar patrón juvenil de ondas T invertidas en V1–V3 hasta la adolescencia.`;
  }

  return null;
}
