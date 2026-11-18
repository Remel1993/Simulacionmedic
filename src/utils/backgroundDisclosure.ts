import { ChatMessage } from '../types/clinical';

export interface DisclosedBackgroundSections {
  pathological: boolean;
  nonPathological: boolean;
  family: boolean;
  surgical: boolean;
  currentMedications: boolean;
  allergies: boolean;
}

function normalizeQuestion(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasAnyKeyword(norm: string, keywords: string[]): boolean {
  return keywords.some((kw) => norm.includes(kw));
}

function isNonVerbalPlaceholder(text: string): boolean {
  const norm = normalizeQuestion(text);
  return (
    !norm ||
    norm.startsWith('sin respuesta') ||
    norm.includes('el paciente esta inconsciente') ||
    norm.includes('el nino se encuentra inconsciente') ||
    norm.includes('no puede responder a las preguntas') ||
    norm.includes('fallec')
  );
}

/**
 * Determina qué apartados de Antecedentes han sido referidos por el paciente
 * durante el interrogatorio en Anamnesis (estrictamente desde la historia clínica conversada).
 */
export function deriveDisclosedBackground(
  messages: ChatMessage[],
  revealAll = false
): DisclosedBackgroundSections {
  if (revealAll) {
    return {
      pathological: true,
      nonPathological: true,
      family: true,
      surgical: true,
      currentMedications: true,
      allergies: true,
    };
  }

  // Solo considerar preguntas del médico que obtuvieron una respuesta verbal real del paciente/acompañante
  const answeredDoctorTexts: string[] = [];
  const verbalPatientTexts: string[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.sender === 'patient') {
      if (!isNonVerbalPlaceholder(msg.text)) {
        verbalPatientTexts.push(normalizeQuestion(msg.text));
      }
      continue;
    }
    if (msg.sender === 'doctor') {
      // Buscar la respuesta del paciente correspondiente a esta intervención
      let answeredVerbally = false;
      for (let j = i + 1; j < messages.length; j++) {
        if (messages[j].sender === 'patient') {
          if (!isNonVerbalPlaceholder(messages[j].text)) {
            answeredVerbally = true;
          }
          break;
        }
        if (messages[j].sender === 'doctor') {
          break;
        }
      }
      if (answeredVerbally) {
        answeredDoctorTexts.push(normalizeQuestion(msg.text));
      }
    }
  }

  const combined = answeredDoctorTexts.join(' ');
  const patientCombined = verbalPatientTexts.join(' ');
  if (!combined && !patientCombined) {
    return {
      pathological: false,
      nonPathological: false,
      family: false,
      surgical: false,
      currentMedications: false,
      allergies: false,
    };
  }

  const allergies =
    hasAnyKeyword(combined, [
      'alergi',
      'alergic',
      'intoleran',
      'hace dano',
      'reaccion adversa',
      'penicilin',
      'sulfa',
    ]) ||
    hasAnyKeyword(patientCombined, ['alergi', 'alergic', 'intoleran', 'me da ronchas']);

  const combinedWithoutDrugAllergyPhrase = combined
    .replace(/alergi[ao]s?\s+(?:conocidas?\s+)?(?:a\s+|con\s+)?(?:los\s+|algun(?:os|as)?\s+)?medicamentos?/g, ' ')
    .replace(/alergic[oa]\s+a\s+(?:los\s+|algun(?:os|as)?\s+)?medicamentos?/g, ' ');

  const currentMedications =
    hasAnyKeyword(combinedWithoutDrugAllergyPhrase, [
      'medicament',
      'medicina',
      'farmac',
      'pastilla',
      'remedio',
      'automedic',
      'tratamiento',
      'inhalador',
      'jarabe',
      'tomado algo',
      'que toma',
      'toma algun',
      'toma alguna',
      'recetado',
    ]) ||
    hasAnyKeyword(patientCombined, [
      'estoy tomando',
      'tomo pastilla',
      'me recetaron',
      'uso insulina',
      'uso inhalador',
      'ningun medicamento',
    ]);

  const family =
    hasAnyKeyword(combined, [
      'familia',
      'hered',
      'madre',
      'mama',
      'padre',
      'papa',
      'herman',
      'abuel',
      'parient',
      'padres',
    ]) ||
    hasAnyKeyword(patientCombined, ['en mi familia', 'mi papa', 'mi mama', 'mis padres']);

  const surgical =
    hasAnyKeyword(combined, [
      'cirug',
      'operad',
      'operacion',
      'quirofano',
      'intervencion',
      'hospitaliz',
      'fractur',
      'traumat',
      'accidente',
    ]) ||
    hasAnyKeyword(patientCombined, ['me operaron', 'cirugia', 'nunca me han operado']);

  const nonPathological =
    hasAnyKeyword(combined, [
      'ocupacion',
      'trabaj',
      'oficio',
      'profesion',
      'dedica',
      'estudia',
      'habito',
      'fuma',
      'tabaco',
      'cigarro',
      'alcohol',
      'bebe',
      'toma alcohol',
      'droga',
      'sustancia',
      'dieta',
      'aliment',
      'comida',
      'comio',
      'viaj',
      'contacto',
      'personas enfermas',
      'conviv',
      'casa',
      'vive',
      'sexual',
      'pareja',
      'ejercicio',
      'vacun',
      'duerme',
      'sueno',
      'estres',
      'bano',
      'higiene',
      'alberca',
      'piscina',
      'no patolog',
      'epidemiolog',
    ]) ||
    hasAnyKeyword(patientCombined, ['no fumo', 'fumo', 'alcohol', 'trabajo en', 'viaje']);

  const pathological =
    hasAnyKeyword(combined, [
      'enfermedad',
      'cronic',
      'padece',
      'sufre',
      'hipertension',
      'presion alta',
      'diabetes',
      'azucar',
      'asma',
      'epoc',
      'tiroides',
      'corazon',
      'rinon',
      'higado',
      'patolog',
      'antecedente',
      'historia medica',
      'cuadros previos',
      'antes le habia',
    ]) ||
    hasAnyKeyword(patientCombined, ['persona sana', 'sufro de', 'padezco', 'tengo diabetes', 'presion alta']);

  return {
    pathological,
    nonPathological,
    family,
    surgical,
    currentMedications,
    allergies,
  };
}

export function countDisclosedBackgroundSections(
  sections: DisclosedBackgroundSections
): number {
  return Object.values(sections).filter(Boolean).length;
}
