import { ALL_CURATED_CASES } from '../data/allCases';
import { STAT_QUICK_PRESETS } from './statStabilization';

export interface MedicationSuggestion {
  drug: string;
  doseHint: string;
  routeHint: string;
  frequencyHint: string;
  durationHint: string;
}

const CORE_FORMULARY_SEEDS: MedicationSuggestion[] = [
  { drug: 'Paracetamol (Acetaminofén)', doseHint: '500 mg - 1 g', routeHint: 'Oral (VO)', frequencyHint: 'Cada 6 horas', durationHint: '5 días' },
  { drug: 'Ibuprofeno', doseHint: '400 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 8 horas', durationHint: '5 días' },
  { drug: 'Amoxicilina / Ácido Clavulánico', doseHint: '875/125 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: '7 días' },
  { drug: 'Amoxicilina', doseHint: '500 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 8 horas', durationHint: '7 días' },
  { drug: 'Azitromicina', doseHint: '500 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: '3 días' },
  { drug: 'Ceftriaxona', doseHint: '1 g', routeHint: 'Intravenosa (IV)', frequencyHint: 'Cada 24 horas', durationHint: '7 días' },
  { drug: 'Ciprofloxacino', doseHint: '500 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: '7 días' },
  { drug: 'Metronidazol', doseHint: '500 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 8 horas', durationHint: '7 días' },
  { drug: 'Nitrofurantoína', doseHint: '100 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: '5 días' },
  { drug: 'Omeprazol', doseHint: '20 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: '14 días' },
  { drug: 'Ondansetrón', doseHint: '4 mg', routeHint: 'Intravenosa (IV)', frequencyHint: 'Cada 8 horas', durationHint: 'Según tolerancia' },
  { drug: 'Salbutamol', doseHint: '200 mcg (2 disparos) / 5 mg NBZ', routeHint: 'Inhalatoria', frequencyHint: 'Cada 4-6 horas', durationHint: 'Según evolución' },
  { drug: 'Prednisona', doseHint: '40 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: '5 días' },
  { drug: 'Hidrocortisona', doseHint: '100 mg', routeHint: 'Intravenosa (IV)', frequencyHint: 'Cada 8 horas', durationHint: 'Fase aguda' },
  { drug: 'Enalapril', doseHint: '10 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: 'Continuo' },
  { drug: 'Losartán', doseHint: '50 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: 'Continuo' },
  { drug: 'Amlodipino', doseHint: '5 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: 'Continuo' },
  { drug: 'Metformina', doseHint: '850 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: 'Continuo' },
  { drug: 'Atorvastatina', doseHint: '40 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: 'Continuo' },
  { drug: 'Ácido Acetilsalicílico (Aspirina)', doseHint: '100 mg / 300 mg carga', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: 'Continuo' },
  { drug: 'Clopidogrel', doseHint: '75 mg / 300 mg carga', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: 'Continuo' },
  { drug: 'Enoxaparina', doseHint: '1 mg/kg', routeHint: 'Subcutánea (SC)', frequencyHint: 'Cada 12 horas', durationHint: 'Hospitalario' },
  { drug: 'Furosemida', doseHint: '40 mg', routeHint: 'Intravenosa (IV)', frequencyHint: 'Cada 12 horas', durationHint: 'Según balance' },
  { drug: 'Solución Salina Normal 0.9%', doseHint: '500 mL - 1000 mL', routeHint: 'Intravenosa (IV)', frequencyHint: 'Carga / infusión', durationHint: 'Fase aguda' },
  { drug: 'Solución Ringer Lactato (Hartmann)', doseHint: '500 mL - 1000 mL', routeHint: 'Intravenosa (IV)', frequencyHint: 'Carga / infusión', durationHint: 'Fase aguda' },
  { drug: 'Sales de Rehidratación Oral (SRO)', doseHint: '200-400 mL tras cada evacuación', routeHint: 'Oral (VO)', frequencyHint: 'A libre demanda', durationHint: 'Hasta hidratación' },
  { drug: 'Loratadina', doseHint: '10 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 24 horas', durationHint: '7 días' },
  { drug: 'Doxiciclina', doseHint: '100 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: '7 días' },
  { drug: 'Clindamicina', doseHint: '300 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 8 horas', durationHint: '7 días' },
  { drug: 'Aciclovir', doseHint: '800 mg', routeHint: 'Oral (VO)', frequencyHint: '5 veces al día', durationHint: '7 días' },
  { drug: 'Fluconazol', doseHint: '150 mg', routeHint: 'Oral (VO)', frequencyHint: 'Dosis única', durationHint: '1 día' },
  { drug: 'Diazepam', doseHint: '10 mg', routeHint: 'Intravenosa (IV)', frequencyHint: 'Dosis única lenta', durationHint: 'Urgencia' },
  { drug: 'Levetiracetam', doseHint: '500 mg', routeHint: 'Oral (VO)', frequencyHint: 'Cada 12 horas', durationHint: 'Continuo' },
  { drug: 'Sulfato de Magnesio', doseHint: '4 g', routeHint: 'Intravenosa (IV)', frequencyHint: 'Impregnación 20 min', durationHint: '24 horas' },
  { drug: 'Insulina Cristalina (Regular)', doseHint: '0.1 UI/kg/h', routeHint: 'Intravenosa (IV)', frequencyHint: 'Infusión continua', durationHint: 'Hasta resolución' },
  { drug: 'Dextrosa al 50%', doseHint: '25 g (50 mL)', routeHint: 'Intravenosa (IV)', frequencyHint: 'Bolo STAT', durationHint: 'Inmediato' },
  { drug: 'Adrenalina (Epinefrina)', doseHint: '0.5 mg', routeHint: 'Intramuscular (IM)', frequencyHint: 'Dosis única STAT', durationHint: 'Urgencia' },
];

function cleanBaseDrugName(raw: string): string {
  return raw
    .split(/\s+\bo\b\s+/i)[0]
    .replace(/\s*\(si.*?\)/gi, '')
    .trim();
}

function normKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildMedicationCatalog(): MedicationSuggestion[] {
  const byKey = new Map<string, MedicationSuggestion>();

  for (const seed of CORE_FORMULARY_SEEDS) {
    byKey.set(normKey(seed.drug), seed);
  }

  for (const preset of STAT_QUICK_PRESETS) {
    const k = normKey(preset.drug);
    if (!byKey.has(k)) {
      byKey.set(k, {
        drug: preset.drug,
        doseHint: preset.dose,
        routeHint: preset.route,
        frequencyHint: preset.frequency,
        durationHint: preset.duration,
      });
    }
  }

  for (const c of ALL_CURATED_CASES) {
    for (const rx of c.solution.optimalTreatment?.pharmacological || []) {
      const cleanName = cleanBaseDrugName(rx.drug);
      if (!cleanName || cleanName.length < 3) continue;
      // Avoid generic descriptive phrases in autocomplete
      if (/^(manejo|tratamiento|soporte|evaluar|ninguno)/i.test(cleanName)) continue;
      const k = normKey(cleanName);
      if (!byKey.has(k)) {
        byKey.set(k, {
          drug: cleanName,
          doseHint: rx.dose,
          routeHint: rx.route,
          frequencyHint: rx.frequency,
          durationHint: rx.duration,
        });
      }
    }
  }

  return Array.from(byKey.values()).sort((a, b) =>
    a.drug.localeCompare(b.drug, 'es', { sensitivity: 'base' })
  );
}

export const CLINICAL_MEDICATION_SUGGESTIONS: MedicationSuggestion[] = buildMedicationCatalog();

export function searchMedicationSuggestions(query: string, limit = 8): MedicationSuggestion[] {
  const q = normKey(query);
  if (q.length < 2) return [];
  const starts: MedicationSuggestion[] = [];
  const contains: MedicationSuggestion[] = [];
  for (const item of CLINICAL_MEDICATION_SUGGESTIONS) {
    const key = normKey(item.drug);
    if (key.startsWith(q)) starts.push(item);
    else if (key.includes(q)) contains.push(item);
  }
  return [...starts, ...contains].slice(0, limit);
}
