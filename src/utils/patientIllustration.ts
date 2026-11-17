import pediatricClinicImg from '../assets/images/patient_pediatric_clinic_1794863925914.jpg';
import infantErImg from '../assets/images/patient_infant_er_1794868785998.jpg';
import pregnantCareImg from '../assets/images/patient_pregnant_care_1794863927003.jpg';
import adultFemaleClinicImg from '../assets/images/patient_adult_female_clinic_1794863927386.jpg';
import adultMaleClinicImg from '../assets/images/patient_adult_male_clinic_1794863929411.jpg';
import adultFemaleErImg from '../assets/images/patient_adult_female_er_1794863929541.jpg';
import adultMaleErImg from '../assets/images/patient_adult_male_er_1794863930039.jpg';
import seniorFemaleCareImg from '../assets/images/patient_senior_female_care_1794863931218.jpg';
import seniorMaleCareImg from '../assets/images/patient_senior_male_care_1794863944246.jpg';
import seniorTraumaHipImg from '../assets/images/patient_senior_trauma_hip_1794868793779.jpg';
import femaleChestErImg from '../assets/images/patient_female_chest_er_1794868787059.jpg';
import maleRespiratoryClinicImg from '../assets/images/patient_male_respiratory_clinic_1794868788036.jpg';
import femaleAbdominalAcuteImg from '../assets/images/patient_female_abdominal_acute_1794868789216.jpg';
import maleAbdominalSevereImg from '../assets/images/patient_male_abdominal_severe_1794868789152.jpg';
import adultHeadacheSevereImg from '../assets/images/patient_adult_headache_severe_1794868790013.jpg';
import femaleHeadacheClinicImg from '../assets/images/patient_female_headache_clinic_1794868790710.jpg';
import adultLumbarFlankImg from '../assets/images/patient_adult_lumbar_flank_1794868791852.jpg';
import traumaLowerLimbImg from '../assets/images/patient_trauma_lower_limb_1794868793279.jpg';
import dermatologyRashImg from '../assets/images/patient_dermatology_rash_1794868794882.jpg';
import entEyeCareImg from '../assets/images/patient_ent_eye_care_1794868795742.jpg';
import { ClinicalCase, VitalSigns } from '../types/clinical';

export type PatientSceneArchetype =
  | 'pediatric_clinic'
  | 'infant_er'
  | 'pregnant_care'
  | 'adult_female_clinic'
  | 'adult_male_clinic'
  | 'adult_female_er'
  | 'adult_male_er'
  | 'senior_female_care'
  | 'senior_male_care'
  | 'senior_trauma_hip'
  | 'female_chest_er'
  | 'male_respiratory_clinic'
  | 'female_abdominal_acute'
  | 'male_abdominal_severe'
  | 'adult_headache_severe'
  | 'female_headache_clinic'
  | 'adult_lumbar_flank'
  | 'trauma_lower_limb'
  | 'dermatology_rash'
  | 'ent_eye_care';

export type PathologyIntensity = 'mild' | 'moderate' | 'critical' | 'deceased';

export type PainSymptomSite =
  | 'chest_respiratory'
  | 'abdominal_pelvic'
  | 'head_neuro'
  | 'lumbar_flank'
  | 'lower_limb'
  | 'skin_rash'
  | 'ent_eye'
  | 'general_systemic';

export interface PatientIllustrationMeta {
  src: string;
  archetype: PatientSceneArchetype;
  intensity: PathologyIntensity;
  intensityLabel: string;
  painSite: PainSymptomSite;
  painSiteLabel: string;
  sceneTitle: string;
  visualCue: string;
  altText: string;
}

function parseSystolicBP(bp?: string): number {
  if (!bp) return 120;
  const sys = parseInt(bp.split('/')[0] || '120', 10);
  return Number.isFinite(sys) ? sys : 120;
}

function isVisiblyPregnantPatient(caseData: ClinicalCase): boolean {
  if (caseData.patientInfo.sex !== 'Femenino') return false;
  if (caseData.patientInfo.age < 14 || caseData.patientInfo.age > 52) return false;

  const consult = (caseData.patientInfo.consultReason || '').toLowerCase();
  const name = (caseData.patientInfo.name || '').toLowerCase();
  const bg = [
    ...(caseData.background?.pathological || []),
    ...(caseData.background?.nonPathological || []),
  ]
    .join(' ')
    .toLowerCase();
  const combined = `${consult} ${name} ${bg}`;

  if (/\b(gestante|embarazada|control prenatal|tercer trimestre|segundo trimestre)\b/.test(combined)) {
    return true;
  }
  const weeksMatch = combined.match(/\b(\d{1,2})\s*semanas?\s*(de\s*)?(embarazo|gestaci[oó]n)\b/);
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1], 10);
    return weeks >= 12;
  }
  return false;
}

function evaluateIntensity(
  caseData: ClinicalCase,
  vitals: VitalSigns,
  isDeceased: boolean
): PathologyIntensity {
  if (isDeceased) return 'deceased';

  const triage = caseData.patientInfo.triageLevel;
  const sysBp = parseSystolicBP(vitals.bloodPressure);

  if (
    triage === 'Nivel I (Reanimación)' ||
    triage === 'Nivel II (Emergencia)' ||
    caseData.mode === 'urgencias' ||
    caseData.specialty === 'urgencias' ||
    vitals.glasgow <= 12 ||
    vitals.oxygenSaturation < 92 ||
    vitals.heartRate >= 120 ||
    vitals.respiratoryRate >= 25 ||
    sysBp < 92
  ) {
    return 'critical';
  }

  if (
    triage === 'Nivel III (Urgencia)' ||
    vitals.oxygenSaturation < 95 ||
    vitals.temperature >= 38.0 ||
    vitals.heartRate >= 102
  ) {
    return 'moderate';
  }

  return 'mild';
}

function detectPainOrSymptomSite(caseData: ClinicalCase): {
  site: PainSymptomSite;
  label: string;
} {
  const consult = (caseData.patientInfo.consultReason || '').toLowerCase();
  const spec = caseData.specialty;

  // Lumbar / flank prior to general back/leg
  if (/\b(espalda baja|lumbar|flanco|lumbalgia)\b/.test(consult)) {
    return { site: 'lumbar_flank', label: 'Región lumbar / flanco' };
  }

  // Lower limb / hip / knee / ankle / foot trauma or pain
  if (/\b(cadera|pierna|rodilla|tobillo|pie|tal[oó]n|ca[ií]da)\b/.test(consult)) {
    return { site: 'lower_limb', label: 'Extremidad inferior / articular' };
  }

  // Skin / dermatologic rash
  if (
    /\b(piel|erupci[oó]n|picaz[oó]n|lesiones dolorosas|manchitas rojas|moretones)\b/.test(consult) ||
    spec === 'dermatologia'
  ) {
    return { site: 'skin_rash', label: 'Piel y tegumentos' };
  }

  // Eye / ENT / throat / ear / nose
  if (
    /\b(ojo|garganta|o[ií]do|nasal|congesti[oó]n|fosa nasal|abrir la boca|asimetr[ií]a facial|sien)\b/.test(
      consult
    ) ||
    spec === 'oftalmologia' ||
    spec === 'otorrinolaringologia'
  ) {
    return { site: 'ent_eye', label: 'Ojo, oído o vía aérea alta' };
  }

  // Chest / respiratory / cardiac
  if (
    /\b(pecho|precordial|tor[aá]cic|falta de aire|respirar|respiraci[oó]n|tos|palpitaciones|opresi[oó]n)\b/.test(
      consult
    ) ||
    spec === 'neumologia'
  ) {
    return { site: 'chest_respiratory', label: 'Tórax y vía respiratoria' };
  }

  // Abdominal / GI / pelvic / urinary
  if (
    /\b(abdomen|abdominal|est[oó]mago|panza|vientre|costillas|p[eé]lvic|ingle|orina|orinar|test[ií]culo|v[oó]mitos|evacuaciones|diarrea|flujo vaginal|menstrual|anal|pastillas)\b/.test(
      consult
    )
  ) {
    return { site: 'abdominal_pelvic', label: 'Abdomen y pelvis' };
  }

  // Head / neurological / mood
  if (
    /\b(cabeza|cefalea|conocimiento|desorientaci[oó]n|mareo|hablar|hormigueo|temblor|agitaci[oó]n|tristeza|insomnio|nerviosismo|visi[oó]n)\b/.test(
      consult
    ) ||
    spec === 'neurologia' ||
    spec === 'psiquiatria'
  ) {
    return { site: 'head_neuro', label: 'Cabeza y esfera neurológica' };
  }

  return { site: 'general_systemic', label: 'Cuadro general / sistémico' };
}

function getIntensityLabel(intensity: PathologyIntensity): string {
  switch (intensity) {
    case 'deceased':
      return 'Sin signos vitales';
    case 'critical':
      return 'Cuadro crítico · Urgencias';
    case 'moderate':
      return 'Intensidad moderada';
    case 'mild':
      return 'Cuadro ambulatorio leve';
  }
}

function deriveVisualCue(
  intensity: PathologyIntensity,
  vitals: VitalSigns,
  site: PainSymptomSite,
  isPediatric: boolean,
  isPregnant: boolean
): string {
  if (intensity === 'deceased') {
    return 'Sin respuesta clínica en cama de monitoreo';
  }

  const sysBp = parseSystolicBP(vitals.bloodPressure);
  if (vitals.glasgow <= 11) {
    return 'Compromiso agudo del estado de alerta';
  }
  if (isPediatric) {
    return intensity === 'critical'
      ? 'Lactante o niño con dificultad clínica en área de urgencias'
      : 'Paciente pediátrico acompañado de su cuidador';
  }
  if (isPregnant) {
    return 'Gestante con cefalea y monitoreo obstétrico';
  }

  if (site === 'chest_respiratory') {
    return intensity === 'critical' || intensity === 'moderate'
      ? 'Presiona el pecho con dificultad respiratoria visible'
      : 'Tos y molestia torácica leve en consulta externa';
  }
  if (site === 'abdominal_pelvic') {
    return intensity === 'critical' || intensity === 'moderate'
      ? 'Postura antiálgica sujetando abdomen por dolor agudo'
      : 'Molestia abdominal o digestiva en valoración ambulatoria';
  }
  if (site === 'head_neuro') {
    return intensity === 'critical'
      ? 'Sujeta la cabeza con dolor intenso y fotofobia'
      : 'Cansancio y presión frontal en consulta externa';
  }
  if (site === 'lumbar_flank') {
    return 'Se sujeta la región lumbar / flanco por dolor agudo';
  }
  if (site === 'lower_limb') {
    return 'Extremidad inferior elevada o inmovilizada por dolor';
  }
  if (site === 'skin_rash') {
    return 'Alteraciones visibles en piel del brazo';
  }
  if (site === 'ent_eye') {
    return 'Molestia ocular o de vía aérea superior focalizada';
  }
  if (vitals.oxygenSaturation < 92 || vitals.respiratoryRate >= 26) {
    return 'Dificultad respiratoria visible en valoración';
  }
  if (sysBp < 90 || vitals.heartRate >= 125) {
    return 'Palidez y signos de compromiso hemodinámico';
  }
  if (vitals.temperature >= 38.2) {
    return 'Aspecto de decaimiento general y temperatura elevada';
  }
  return intensity === 'critical'
    ? 'Paciente en camilla con monitoreo continuo'
    : 'Valoración general en consultorio';
}

export function getPatientIllustration(
  caseData: ClinicalCase,
  liveVitals?: VitalSigns,
  isDeceased = false
): PatientIllustrationMeta {
  const { age, sex } = caseData.patientInfo;
  const vitals = liveVitals || caseData.vitalSigns;
  const isFemale = sex === 'Femenino';
  const isPediatric = age < 13;
  const isSenior = age >= 65;
  const isPregnant = isVisiblyPregnantPatient(caseData);
  const intensity = evaluateIntensity(caseData, vitals, isDeceased);
  const intensityLabel = getIntensityLabel(intensity);
  const { site, label: painSiteLabel } = detectPainOrSymptomSite(caseData);
  const visualCue = deriveVisualCue(intensity, vitals, site, isPediatric, isPregnant);
  const isAcuteOrModerate = intensity === 'critical' || intensity === 'moderate' || intensity === 'deceased';

  const makeMeta = (
    archetype: PatientSceneArchetype,
    src: string,
    sceneTitle: string,
    subjectDesc: string
  ): PatientIllustrationMeta => ({
    src,
    archetype,
    intensity,
    intensityLabel,
    painSite: site,
    painSiteLabel,
    sceneTitle,
    visualCue,
    altText: `Ilustración clínica de ${subjectDesc} (${age} años)`,
  });

  // 1. Pediatric (< 13 years)
  if (isPediatric) {
    if (age <= 2 || intensity === 'critical') {
      return makeMeta(
        'infant_er',
        infantErImg,
        'Urgencias Pediátricas',
        'lactante o niño pequeño en brazo materno con monitoreo'
      );
    }
    return makeMeta(
      'pediatric_clinic',
      pediatricClinicImg,
      'Consulta Pediátrica',
      'paciente pediátrico con su cuidador'
    );
  }

  // 2. Obstetric / Visibly pregnant
  if (isPregnant) {
    return makeMeta(
      'pregnant_care',
      pregnantCareImg,
      'Valoración Obstétrica',
      'paciente gestante en cama de valoración'
    );
  }

  // 3. Senior (>= 65 years)
  if (isSenior) {
    if (isFemale && site === 'lower_limb') {
      return makeMeta(
        'senior_trauma_hip',
        seniorTraumaHipImg,
        'Urgencias · Traumatología Geriátrica',
        'paciente adulta mayor inmovilizada en camilla'
      );
    }
    if (isFemale) {
      return makeMeta(
        'senior_female_care',
        seniorFemaleCareImg,
        isAcuteOrModerate ? 'Urgencias · Adulto Mayor' : 'Atención Geriátrica',
        'paciente adulta mayor en cama hospitalaria'
      );
    }
    return makeMeta(
      'senior_male_care',
      seniorMaleCareImg,
      isAcuteOrModerate ? 'Urgencias · Adulto Mayor' : 'Atención Geriátrica',
      'paciente adulto mayor en cama hospitalaria'
    );
  }

  // 4. Adult Female (13 - 64 years)
  if (isFemale) {
    if (site === 'chest_respiratory' && isAcuteOrModerate) {
      return makeMeta(
        'female_chest_er',
        femaleChestErImg,
        'Urgencias · Tórax y Respiración',
        'paciente femenina en camilla sujetando el pecho con mascarilla'
      );
    }
    if (site === 'abdominal_pelvic' && isAcuteOrModerate) {
      return makeMeta(
        'female_abdominal_acute',
        femaleAbdominalAcuteImg,
        'Urgencias · Dolor Abdominal',
        'paciente femenina en camilla con postura antiálgica abdominal'
      );
    }
    if (site === 'head_neuro') {
      if (isAcuteOrModerate) {
        return makeMeta(
          'adult_headache_severe',
          adultHeadacheSevereImg,
          'Urgencias · Dolor Cefálico Intenso',
          'paciente femenina en camilla sujetando la cabeza por dolor intenso'
        );
      }
      return makeMeta(
        'female_headache_clinic',
        femaleHeadacheClinicImg,
        'Consulta Externa · Cefalea / Fatiga',
        'paciente femenina sentada presionando suavemente la frente'
      );
    }
    if (isAcuteOrModerate) {
      return makeMeta(
        'adult_female_er',
        adultFemaleErImg,
        'Sala de Urgencias / Observación',
        'paciente femenina en camilla hospitalaria con vía intravenosa'
      );
    }
    return makeMeta(
      'adult_female_clinic',
      adultFemaleClinicImg,
      'Consultorio Médico',
      'paciente femenina sentada en consulta médica'
    );
  }

  // 5. Adult / Adolescent Male (13 - 64 years)
  if (site === 'lower_limb') {
    return makeMeta(
      'trauma_lower_limb',
      traumaLowerLimbImg,
      isAcuteOrModerate ? 'Urgencias · Extremidad Inferior' : 'Valoración Traumatológica',
      'paciente masculino con extremidad inferior elevada y vendada'
    );
  }
  if (site === 'lumbar_flank') {
    return makeMeta(
      'adult_lumbar_flank',
      adultLumbarFlankImg,
      isAcuteOrModerate ? 'Urgencias · Dolor Lumbar / Flanco' : 'Consultorio · Región Lumbar',
      'paciente masculino sujetando región lumbar / flanco con dolor'
    );
  }
  if (site === 'skin_rash') {
    return makeMeta(
      'dermatology_rash',
      dermatologyRashImg,
      isAcuteOrModerate ? 'Urgencias · Valoración de Piel' : 'Consulta · Valoración de Piel',
      'paciente masculino en bata con alteración visible en piel del brazo'
    );
  }
  if (site === 'ent_eye') {
    return makeMeta(
      'ent_eye_care',
      entEyeCareImg,
      isAcuteOrModerate ? 'Urgencias · Ojo / Otorrino' : 'Consulta Oftalmo / ORL',
      'paciente masculino bajo lámpara de exploración de cabeza y cuello'
    );
  }
  if (site === 'chest_respiratory') {
    if (isAcuteOrModerate) {
      return makeMeta(
        'adult_male_er',
        adultMaleErImg,
        'Urgencias · Dolor Torácico / Disnea',
        'paciente masculino en camilla sujetando el pecho en área crítica'
      );
    }
    return makeMeta(
      'male_respiratory_clinic',
      maleRespiratoryClinicImg,
      'Consulta Respiratoria',
      'paciente masculino tosiendo en silla de consultorio'
    );
  }
  if (site === 'abdominal_pelvic') {
    if (isAcuteOrModerate) {
      return makeMeta(
        'male_abdominal_severe',
        maleAbdominalSevereImg,
        'Urgencias · Dolor Abdominal Severo',
        'paciente masculino en cama sujetando abdomen con sudoración y dolor intenso'
      );
    }
    return makeMeta(
      'adult_male_clinic',
      adultMaleClinicImg,
      'Consultorio · Valoración Digestiva',
      'paciente masculino sentado con molestia abdominal leve'
    );
  }
  if (isAcuteOrModerate) {
    return makeMeta(
      'adult_male_er',
      adultMaleErImg,
      'Sala de Urgencias / Camilla',
      'paciente masculino en camilla de urgencias con monitorización'
    );
  }
  return makeMeta(
    'adult_male_clinic',
    adultMaleClinicImg,
    'Consultorio Médico',
    'paciente masculino sentado en consulta médica'
  );
}
