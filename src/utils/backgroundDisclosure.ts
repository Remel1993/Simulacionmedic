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

/**
 * Determina qué apartados de Antecedentes han sido preguntados por el médico
 * durante el interrogatorio en Anamnesis para evitar mostrar pistas gratuitas al inicio.
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

  const doctorTexts = messages
    .filter((m) => m.sender === 'doctor')
    .map((m) => normalizeQuestion(m.text));

  const combined = doctorTexts.join(' ');
  if (!combined) {
    return {
      pathological: false,
      nonPathological: false,
      family: false,
      surgical: false,
      currentMedications: false,
      allergies: false,
    };
  }

  const allergies = hasAnyKeyword(combined, [
    'alergi',
    'alergic',
    'intoleran',
    'hace dano',
    'reaccion adversa',
    'penicilin',
    'sulfa',
  ]);

  const combinedWithoutDrugAllergyPhrase = combined
    .replace(/alergi[ao]s?\s+(?:conocidas?\s+)?(?:a\s+|con\s+)?(?:los\s+|algun(?:os|as)?\s+)?medicamentos?/g, ' ')
    .replace(/alergic[oa]\s+a\s+(?:los\s+|algun(?:os|as)?\s+)?medicamentos?/g, ' ');

  const currentMedications = hasAnyKeyword(combinedWithoutDrugAllergyPhrase, [
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
  ]);

  const family = hasAnyKeyword(combined, [
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
  ]);

  const surgical = hasAnyKeyword(combined, [
    'cirug',
    'operad',
    'operacion',
    'quirofano',
    'intervencion',
    'hospitaliz',
    'fractur',
    'traumat',
    'accidente',
  ]);

  const nonPathological = hasAnyKeyword(combined, [
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
  ]);

  const pathological = hasAnyKeyword(combined, [
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
  ]);

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
