import {
  ClinicalCase,
  DrugInteractionAlert,
  MedicationItem,
} from '../types/clinical';
import {
  detectPregnancyContext,
  detectRenalImpairmentContext,
} from './clinicalContext';
import { parseNumericDose } from './statStabilization';

export interface PharmacologyMonograph {
  id: string;
  genericName: string;
  matchPattern: RegExp;
  pharmacologicalGroup: string;
  mechanismOfAction: string;
  standardAdultSingleMg?: { min: number; max: number; unitLabel?: string };
  adultDailyMaxMg?: number;
  pediatricSingleMgPerKg?: { min: number; max: number };
  pediatricMaxSingleMg?: number;
  renalAdjustment: string;
  hepaticAdjustment: string;
  pregnancyNote: string;
  monitoringPlan: string;
  therapeuticAlternatives: string;
}

export interface MedicationPharmacologyAudit {
  pharmacologicalGroup: string;
  mechanismOfAction: string;
  doseCheckStatus: 'adecuada' | 'subterapeutica' | 'excesiva' | 'no_evaluable';
  doseAdjustmentAlert?: string;
  timingOrIndicationIssue?: string;
  monitoringPlan: string;
  therapeuticAlternatives: string;
}

function norm(value: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function getEffectivePatientWeightKg(caseData: ClinicalCase): {
  weightKg: number;
  isEstimated: boolean;
} {
  const recorded = caseData.vitalSigns?.weightKg;
  if (typeof recorded === 'number' && recorded > 0) {
    return { weightKg: recorded, isEstimated: false };
  }
  const age = caseData.patientInfo?.age ?? 30;
  if (age < 1) return { weightKg: 7, isEstimated: true };
  if (age < 12) return { weightKg: Math.max(8, age * 2 + 8), isEstimated: true };
  return { weightKg: 70, isEstimated: true };
}

function detectHepaticImpairmentContext(caseData: ClinicalCase): boolean {
  const corpus = norm(
    [
      caseData.solution?.correctDiagnosis || '',
      ...(caseData.background?.pathological || []),
      ...(caseData.studiesPool || [])
        .filter((s) => s.isAbnormal && s.subcategory === 'Función Hepática')
        .map((s) => `${s.name} ${s.result}`),
    ].join(' ')
  );
  return /\b(cirrosis|insuficiencia hepatica|falla hepatica|hepatopatia|hepatitis aguda|necrosis hepatica|child pugh|encefalopatia hepatica)\b/.test(
    corpus
  );
}

function detectPotassiumFromStudies(caseData: ClinicalCase): number | null {
  for (const st of caseData.studiesPool || []) {
    const text = norm(`${st.name} ${st.result}`);
    if (!/\b(potasio|k\+|electrolitos|ionograma)\b/.test(text)) continue;
    const match = text.match(/(?:potasio|k\+?)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(?:meq|mmol)?/);
    if (match) {
      const val = parseFloat(match[1]);
      if (!Number.isNaN(val) && val > 1 && val < 12) return val;
    }
  }
  return null;
}

export const PHARMACOLOGY_MONOGRAPHS: PharmacologyMonograph[] = [
  {
    id: 'paracetamol',
    genericName: 'Paracetamol (Acetaminofén)',
    matchPattern: /\b(paracetamol|acetaminofen)\b/,
    pharmacologicalGroup: 'Analgésico y antipirético no opioide (derivado del para-aminofenol)',
    mechanismOfAction:
      'Inhibición central de la síntesis de prostaglandinas (COX-3 / peroxidasa en SNC) y modulación de vías serotoninérgicas descendentes sin efecto antiinflamatorio periférico ni gastrolesividad.',
    standardAdultSingleMg: { min: 500, max: 1000 },
    adultDailyMaxMg: 4000,
    pediatricSingleMgPerKg: { min: 10, max: 15 },
    pediatricMaxSingleMg: 1000,
    renalAdjustment: 'En TFG <10 mL/min espaciar dosis cada 8 h; suele ser el analgésico de elección en enfermedad renal.',
    hepaticAdjustment: 'Reducir dosis máxima diaria a ≤2 g/día en hepatopatía crónica compensada y evitar en fallo hepático agudo o intoxicación por paracetamol.',
    pregnancyNote: 'Fármaco analgésico/antipirético de primera línea seguro en todos los trimestres a la dosis mínima eficaz.',
    monitoringPlan: 'Vigilar curva térmica/dolor; en uso prolongado o riesgo hepático controlar AST/ALT y bilirrubinas.',
    therapeuticAlternatives: 'En dolor inflamatorio adulto sin nefropatía ni dengue: Ibuprofeno o Naproxeno. En dolor intenso: valorar escalón opioide o metamizol según disponibilidad.',
  },
  {
    id: 'ibuprofeno',
    genericName: 'Ibuprofeno',
    matchPattern: /\bibuprofeno\b/,
    pharmacologicalGroup: 'Antiinflamatorio no esteroideo (AINE, derivado del ácido propiónico)',
    mechanismOfAction:
      'Inhibición reversible no selectiva de ciclooxigenasas COX-1 y COX-2, bloqueando la síntesis de prostaglandinas proinflamatorias y sensibilizantes nociceptivas.',
    standardAdultSingleMg: { min: 200, max: 800 },
    adultDailyMaxMg: 2400,
    pediatricSingleMgPerKg: { min: 5, max: 10 },
    pediatricMaxSingleMg: 600,
    renalAdjustment: 'Evitar en LRA o ERC (TFG <30–45 mL/min): la inhibición de prostaglandinas vasodilatadoras aferentes precipita caída aguda de TFG.',
    hepaticAdjustment: 'Evitar en cirrosis descompensada (riesgo de sangrado variceal y síndrome hepatorrenal).',
    pregnancyNote: 'Evitar en 1.º/2.º trimestre si hay alternativa; contraindicado en el 3.º trimestre (≥28 SDG) por cierre prematuro del conducto arterioso fetal y oligohidramnios.',
    monitoringPlan: 'Vigilar tolerancia gástrica, diuresis/creatinina en adultos mayores y descartar sangrado mucocutáneo en síndromes febriles tropicales (dengue).',
    therapeuticAlternatives: 'Paracetamol (cuando predomina fiebre/dolor sin componente inflamatorio o existe riesgo renal/gástrico/dengue) o Naproxeno.',
  },
  {
    id: 'ketorolaco',
    genericName: 'Ketorolaco',
    matchPattern: /\bketorolaco\b/,
    pharmacologicalGroup: 'AINE parenteral/oral de alta potencia analgésica',
    mechanismOfAction:
      'Inhibidor potente no selectivo de COX-1/COX-2 con elevada actividad analgésica periférica y significativo riesgo gastrolesivo, antiagregante y nefrotóxico.',
    standardAdultSingleMg: { min: 10, max: 30 },
    adultDailyMaxMg: 90,
    pediatricSingleMgPerKg: { min: 0.5, max: 0.5 },
    pediatricMaxSingleMg: 30,
    renalAdjustment: 'Contraindicado en insuficiencia renal moderada-grave o depleción de volumen; máximo 5 días totales de tratamiento.',
    hepaticAdjustment: 'Usar con extrema cautela o evitar en hepatopatía significativa.',
    pregnancyNote: 'Contraindicado en tercer trimestre y trabajo de parto (riesgo hemorrágico y cierre ductal).',
    monitoringPlan: 'Limitar duración ≤5 días (≤2 días IV), vigilar función renal y sangrado digestivo.',
    therapeuticAlternatives: 'Paracetamol IV/VO, Ibuprofeno VO o Tramadol/Morfina titulada si dolor visceral intenso o contraindicación renal.',
  },
  {
    id: 'diclofenaco',
    genericName: 'Diclofenaco',
    matchPattern: /\bdiclofenaco\b/,
    pharmacologicalGroup: 'AINE (derivado fenilacético)',
    mechanismOfAction:
      'Inhibición no selectiva de COX-1 y COX-2 con mayor selectividad relativa por COX-2 y riesgo cardiovascular/renal dosis-dependiente.',
    standardAdultSingleMg: { min: 50, max: 75 },
    adultDailyMaxMg: 150,
    renalAdjustment: 'Evitar en LRA/ERC; riesgo de necrosis papilar, hiperkalemia y retención hidrosalina.',
    hepaticAdjustment: 'Monitorizar transaminasas en uso prolongado; evitar en cirrosis.',
    pregnancyNote: 'Contraindicado en tercer trimestre.',
    monitoringPlan: 'Presión arterial, creatinina sérica y síntomas dispépticos.',
    therapeuticAlternatives: 'Paracetamol o Naproxeno en pacientes con riesgo cardiovascular.',
  },
  {
    id: 'amoxicilina_clavulanato',
    genericName: 'Amoxicilina / Ácido Clavulánico',
    matchPattern: /\b(amoxicilina.*clavulan|clavulan|amoxiclav|augmentin)\b/,
    pharmacologicalGroup: 'Aminopenicilina asociada a inhibidor de betalactamasas',
    mechanismOfAction:
      'La amoxicilina inhibe las PBP (proteínas fijadoras de penicilina) bloqueando el entrecruzamiento de peptidoglicano bacteriano; el ácido clavulánico inactiva betalactamasas plasmídicas de H. influenzae, M. catarrhalis, S. aureus MSSA y anaerobios.',
    standardAdultSingleMg: { min: 500, max: 1000 },
    adultDailyMaxMg: 3000,
    pediatricSingleMgPerKg: { min: 22.5, max: 45 },
    pediatricMaxSingleMg: 875,
    renalAdjustment: 'Con TFG 10–30 mL/min espaciar cada 12 h (máx. 500 mg de amoxicilina); con TFG <10 mL/min cada 24 h.',
    hepaticAdjustment: 'Vigilar colestasis medicamentosa si antecedente previo; usar con precaución en disfunción hepática.',
    pregnancyNote: 'Categoría compatible con el embarazo cuando está clínicamente indicado (evitar en alergia a penicilinas).',
    monitoringPlan: 'Evaluar mejoría febril/clínica a las 48–72 h, tolerancia gastrointestinal y ausencia de exantema alérgico.',
    therapeuticAlternatives: 'Cefuroxima o Cefixima en infección respiratoria/urinaria; Azitromicina/Claritromicina o Clindamicina (según foco) si alergia grave a penicilina.',
  },
  {
    id: 'amoxicilina',
    genericName: 'Amoxicilina',
    matchPattern: /\bamoxicilina\b/,
    pharmacologicalGroup: 'Aminopenicilina betalactámica de espectro moderado',
    mechanismOfAction:
      'Unión a PBP bacterianas e inhibición de la transpeptidación de la pared celular bacteriana provocando lisis osmótica bactericida.',
    standardAdultSingleMg: { min: 500, max: 1000 },
    adultDailyMaxMg: 3000,
    pediatricSingleMgPerKg: { min: 20, max: 45 },
    pediatricMaxSingleMg: 1000,
    renalAdjustment: 'En TFG <30 mL/min ajustar intervalo cada 12–24 h.',
    hepaticAdjustment: 'No requiere ajuste habitual.',
    pregnancyNote: 'Primera línea segura en gestación si no existe alergia a betalactámicos.',
    monitoringPlan: 'Reevaluación clínica a las 48–72 horas y vigilancia de reacciones de hipersensibilidad.',
    therapeuticAlternatives: 'Amoxicilina/Ácido Clavulánico (si sospecha de betalactamasas) o Macrólido en alergia tipo I.',
  },
  {
    id: 'ceftriaxona',
    genericName: 'Ceftriaxona',
    matchPattern: /\bceftriaxona\b/,
    pharmacologicalGroup: 'Cefalosporina de 3.ª generación parenteral',
    mechanismOfAction:
      'Betalactámico bactericida resistente a muchas betalactamasas de gramnegativos entéricos y neumococo; excelente penetración a SNC en dosis meníngeas.',
    standardAdultSingleMg: { min: 1000, max: 2000 },
    adultDailyMaxMg: 4000,
    pediatricSingleMgPerKg: { min: 50, max: 100 },
    pediatricMaxSingleMg: 2000,
    renalAdjustment: 'Eliminación dual renal/biliar: generalmente no requiere ajuste hasta TFG <10 mL/min salvo insuficiencia hepatorrenal combinada (máx. 2 g/día).',
    hepaticAdjustment: 'Precaución si coexiste insuficiencia renal; riesgo de barro biliar en pediatría/uso prolongado.',
    pregnancyNote: 'Segura durante el embarazo en infecciones graves o pielonefritis.',
    monitoringPlan: 'No mezclar en la misma vía con soluciones con calcio (Ringer Lactato/Hartmann) en neonatos; controlar curva febril y cultivos.',
    therapeuticAlternatives: 'Cefotaxima (preferida en neonatos <28 días) o Cefepima/Meropenem cuando se requiere cobertura antipseudomónica.',
  },
  {
    id: 'azitromicina',
    genericName: 'Azitromicina',
    matchPattern: /\bazitromicina\b/,
    pharmacologicalGroup: 'Macrólido (azálido)',
    mechanismOfAction:
      'Inhibe la síntesis proteica bacteriana al unirse de forma reversible a la subunidad ribosómica 50S; cobertura de gérmenes atípicos (Mycoplasma, Chlamydophila, Legionella) y Campylobacter.',
    standardAdultSingleMg: { min: 500, max: 1000 },
    adultDailyMaxMg: 1000,
    pediatricSingleMgPerKg: { min: 10, max: 10 },
    pediatricMaxSingleMg: 500,
    renalAdjustment: 'No requiere ajuste en ERC leve-moderada; precaución si TFG <10 mL/min.',
    hepaticAdjustment: 'Precaución en hepatopatía grave (eliminación predominantemente biliar).',
    pregnancyNote: 'Compatible con el embarazo cuando el beneficio supera el riesgo (opción en atípicos/ITS).',
    monitoringPlan: 'Vigilar riesgo de prolongación del intervalo QTc en pacientes con cardiopatía o fármacos concomitantes que alargan QT.',
    therapeuticAlternatives: 'Doxiciclina (en adultos no gestantes) o Claritromicina.',
  },
  {
    id: 'ciprofloxacino',
    genericName: 'Ciprofloxacino',
    matchPattern: /\bciprofloxacino\b/,
    pharmacologicalGroup: 'Fluoroquinolona de 2.ª generación',
    mechanismOfAction:
      'Inhibición bactericida de la ADN girasa y topoisomerasa IV bacterianas con potente actividad frente a bacilos gramnegativos (incluida Pseudomonas aeruginosa).',
    standardAdultSingleMg: { min: 250, max: 750 },
    adultDailyMaxMg: 1500,
    renalAdjustment: 'Reducir dosis al 50% o espaciar cada 12–24 h cuando TFG <30–50 mL/min.',
    hepaticAdjustment: 'Sin ajuste habitual salvo disfunción severa.',
    pregnancyNote: 'Evitar durante el embarazo y lactancia por riesgo potencial sobre cartílago fetal.',
    monitoringPlan: 'Alertar sobre tendinopatía, prolongación de QTc, disglucemia e interacciones con warfarina/teofilina.',
    therapeuticAlternatives: 'Nitrofurantoína o Fosfomicina en cistitis no complicada; Ceftriaxona en pielonefritis.',
  },
  {
    id: 'metronidazol',
    genericName: 'Metronidazol',
    matchPattern: /\bmetronidazol\b/,
    pharmacologicalGroup: 'Nitroimidazol antimicrobiano y antiprotozoario',
    mechanismOfAction:
      'Profármaco activado por nitroreductasas anaerobias que genera radicales libres citotóxicos capaces de fragmentar el ADN de anaerobios y protozoos.',
    standardAdultSingleMg: { min: 500, max: 750 },
    adultDailyMaxMg: 2250,
    pediatricSingleMgPerKg: { min: 7.5, max: 15 },
    pediatricMaxSingleMg: 500,
    renalAdjustment: 'Sin ajuste salvo hemodiálisis/anuria (reducir 50%).',
    hepaticAdjustment: 'Reducir dosis en un 50% en cirrosis Child-Pugh C por acumulación y neurotoxicidad.',
    pregnancyNote: 'Evitar uso sistémico en primer trimestre salvo indicación estricta; compatible posteriormente si es necesario.',
    monitoringPlan: 'Prohibir consumo de alcohol (efecto disulfiram); vigilar INR si toma warfarina y neuropatía periférica en ciclos largos.',
    therapeuticAlternatives: 'Clindamicina (para cobertura anaerobia supradiafragmática) o Tinidazol (en protozoarios).',
  },
  {
    id: 'nitrofurantoina',
    genericName: 'Nitrofurantoína',
    matchPattern: /\bnitrofurantoina\b/,
    pharmacologicalGroup: 'Antiséptico urinario nitrofurano',
    mechanismOfAction:
      'Reducción enzimática bacteriana en orina a intermediarios reactivos que dañan ribosomas y ADN de E. coli y otros uropatógenos; no alcanza niveles terapéuticos en parénquima renal ni sangre.',
    standardAdultSingleMg: { min: 50, max: 100 },
    adultDailyMaxMg: 400,
    renalAdjustment: 'Contraindicada con TFG <30 mL/min por excreción urinaria insuficiente y riesgo de neuropatía periférica.',
    hepaticAdjustment: 'Precaución en hepatopatía crónica.',
    pregnancyNote: 'Segura en 2.º trimestre; evitar al final del 3.º trimestre (≥38 SDG) por riesgo de anemia hemolítica neonatal.',
    monitoringPlan: 'No usar nunca en pielonefritis ni sepsis urinaria (concentración tisular insuficiente).',
    therapeuticAlternatives: 'Fosfomicina trometamol o Cefalexina en cistitis; Ceftriaxona si hay compromiso parenquimatoso renal.',
  },
  {
    id: 'aspirina',
    genericName: 'Ácido Acetilsalicílico (AAS / Aspirina)',
    matchPattern: /\b(aspirina|acido acetilsalicilico|\baas\b|\basa\b)\b/,
    pharmacologicalGroup: 'Antiagregante plaquetario irreversible / Salicilato',
    mechanismOfAction:
      'Acetilación irreversible de la serina 530 de la COX-1 plaquetaria, bloqueando la síntesis de tromboxano A₂ durante toda la vida de la plaqueta (7–10 días).',
    standardAdultSingleMg: { min: 75, max: 325 },
    adultDailyMaxMg: 4000,
    renalAdjustment: 'Evitar dosis analgésicas en ERC avanzada; las dosis antiagregantes (75–100 mg) suelen mantenerse si no hay hemorragia.',
    hepaticAdjustment: 'Evitar en hepatopatía grave con coagulopatía.',
    pregnancyNote: 'Evitar dosis altas; dosis bajas (81–150 mg) indicadas solo en profilaxis de preeclampsia bajo indicación obstétrica.',
    monitoringPlan: 'Descartar siempre disección aórtica, hemorragia activa, dengue y edad <16 años (Síndrome de Reye) antes de indicar.',
    therapeuticAlternatives: 'Clopidogrel o Ticagrelor cuando se requiere antiagregación alternativa por alergia verdadera a AAS.',
  },
  {
    id: 'enoxaparina',
    genericName: 'Enoxaparina',
    matchPattern: /\benoxaparina\b/,
    pharmacologicalGroup: 'Heparina de bajo peso molecular (HBPM)',
    mechanismOfAction:
      'Potencia a la antitrombina III con selectividad predominante anti-Factor Xa sobre anti-IIa, inhibiendo la propagación del trombo arterial o venoso.',
    standardAdultSingleMg: { min: 40, max: 120 },
    adultDailyMaxMg: 240,
    pediatricSingleMgPerKg: { min: 0.5, max: 1.0 },
    pediatricMaxSingleMg: 100,
    renalAdjustment: 'Con TFG <30 mL/min reducir a 1 mg/kg cada 24 h (dosis terapéutica) o preferir Heparina No Fraccionada IV.',
    hepaticAdjustment: 'Precaución si coagulopatía o trombocitopenia severa.',
    pregnancyNote: 'Anticoagulante de elección en el embarazo (no atraviesa la barrera placentaria).',
    monitoringPlan: 'Vigilar hemoglobina, plaquetas (HIT), signos de sangrado y función renal (anti-Xa si ERC o embarazo).',
    therapeuticAlternatives: 'Heparina No Fraccionada IV (preferida si inestabilidad hemodinámica, posible fibrinólisis/cirugía urgente o TFG <30).',
  },
  {
    id: 'labetalol',
    genericName: 'Labetalol',
    matchPattern: /\blabetalol\b/,
    pharmacologicalGroup: 'Bloqueador adrenérgico mixto (alfa-1 selectivo y beta no selectivo)',
    mechanismOfAction:
      'Vasodilatación arteriolar periférica por bloqueo alfa-1 sin taquicardia refleja gracias al bloqueo beta-1/beta-2 concomitante.',
    standardAdultSingleMg: { min: 10, max: 80 },
    adultDailyMaxMg: 300,
    pediatricSingleMgPerKg: { min: 0.2, max: 1.0 },
    pediatricMaxSingleMg: 40,
    renalAdjustment: 'No requiere ajuste renal directo.',
    hepaticAdjustment: 'Precaución en hepatotoxicidad previa.',
    pregnancyNote: 'Primera línea en emergencia hipertensiva del embarazo / preeclampsia severa (MINSA / ACOG).',
    monitoringPlan: 'Monitorizar PA cada 5–15 min buscando descenso controlado (no >25% en 1.ª hora en emergencia hipertensiva no obstétrica), FC (>55 lpm) y ausencia de broncoespasmo.',
    therapeuticAlternatives: 'Hidralazina IV o Nifedipino de liberación prolongada en preeclampsia; Nicardipino o Nitroglicerina según órgano blanco.',
  },
  {
    id: 'furosemida',
    genericName: 'Furosemida',
    matchPattern: /\bfurosemida\b/,
    pharmacologicalGroup: 'Diurético de asa',
    mechanismOfAction:
      'Inhibe el cotransportador Na⁺/K⁺/2Cl⁻ en la rama ascendente gruesa del asa de Henle y produce venodilatación refleja inicial, reduciendo la precarga pulmonar.',
    standardAdultSingleMg: { min: 20, max: 80 },
    adultDailyMaxMg: 600,
    pediatricSingleMgPerKg: { min: 0.5, max: 2.0 },
    pediatricMaxSingleMg: 40,
    renalAdjustment: 'En ERC puede requerir dosis más altas para alcanzar el túbulo; contraindicada en anuria o hipovolemia/choque.',
    hepaticAdjustment: 'Evitar depleción brusca en cirrosis (precipita encefalopatía y síndrome hepatorrenal).',
    pregnancyNote: 'Reservar solo para edema pulmonar agudo o sobrecarga hídrica grave; reduce perfusión útero-placentaria.',
    monitoringPlan: 'Balance hídrico estricto, diuresis horaria, potasio/magnesio séricos y creatinina.',
    therapeuticAlternatives: 'Nitroglicerina IV en edema agudo pulmonar hipertensivo para reducir precarga sin depleción excesiva de volumen.',
  },
  {
    id: 'nitroglicerina',
    genericName: 'Nitroglicerina',
    matchPattern: /\bnitroglicerina\b/,
    pharmacologicalGroup: 'Nitrato orgánico vasodilatador (donador de óxido nítrico)',
    mechanismOfAction:
      'Libera óxido nítrico activando la guanilato ciclasa y elevando el GMPc en músculo liso vascular, con predominio venodilatador (reduce precarga) y vasodilatación coronaria.',
    standardAdultSingleMg: { min: 0.3, max: 0.8 },
    renalAdjustment: 'Sin ajuste renal directo.',
    hepaticAdjustment: 'Sin ajuste específico.',
    pregnancyNote: 'Uso reservado para edema pulmonar o emergencia hipertensiva refractaria monitorizada.',
    monitoringPlan: 'Verificar PA sistólica ≥90–100 mmHg, descartar infarto de ventrículo derecho y prohibir absolutamente tras inhibidores de PDE-5 (sildenafil/tadalafil).',
    therapeuticAlternatives: 'Dinitrato de isosorbide o Morfina/Furosemida en edema pulmonar según contexto hemodinámico.',
  },
  {
    id: 'salbutamol',
    genericName: 'Salbutamol (Albuterol)',
    matchPattern: /\b(salbutamol|albuterol)\b/,
    pharmacologicalGroup: 'Agonista beta-2 adrenérgico de acción corta (SABA)',
    mechanismOfAction:
      'Estimula receptores beta-2 en músculo liso bronquial activando adenilato ciclasa / AMPc, relajando el broncoespasmo y favoreciendo el ingreso intracelular de potasio vía Na⁺/K⁺-ATPasa.',
    standardAdultSingleMg: { min: 0.2, max: 5.0 },
    pediatricSingleMgPerKg: { min: 0.15, max: 0.15 },
    pediatricMaxSingleMg: 5,
    renalAdjustment: 'No requiere ajuste renal.',
    hepaticAdjustment: 'No requiere ajuste hepático.',
    pregnancyNote: 'Seguro e indispensable en crisis asmática durante el embarazo (evita hipoxia fetal).',
    monitoringPlan: 'SpO₂, frecuencia cardíaca, temblor, potasio sérico y lactato si se usan nebulizaciones repetidas.',
    therapeuticAlternatives: 'Asociar Bromuro de Ipratropio en crisis moderadas-graves; nunca usar solo como terapia crónica de asma (GINA).',
  },
  {
    id: 'hidrocortisona',
    genericName: 'Hidrocortisona',
    matchPattern: /\bhidrocortisona\b/,
    pharmacologicalGroup: 'Glucocorticoide sistémico de acción corta',
    mechanismOfAction:
      'Unión a receptores citosólicos de glucocorticoides inhibiendo NF-κB, citocinas proinflamatorias y fosfolipasa A2; aporta además efecto mineralocorticoide fisiológico en crisis suprarrenal.',
    standardAdultSingleMg: { min: 50, max: 200 },
    adultDailyMaxMg: 400,
    pediatricSingleMgPerKg: { min: 2, max: 5 },
    pediatricMaxSingleMg: 100,
    renalAdjustment: 'No requiere ajuste renal.',
    hepaticAdjustment: 'Precaución en hepatopatía severa.',
    pregnancyNote: 'Metabolizada por 11β-HSD2 placentaria (menor paso fetal que dexametasona); segura en crisis aguda o insuficiencia suprarrenal.',
    monitoringPlan: 'Glucemia capilar, presión arterial, potasio y signos de sangrado digestivo si uso concomitante de AINEs.',
    therapeuticAlternatives: 'Metilprednisolona IV o Prednisona VO (en crisis asmática/EPOC una vez asegurada la vía oral).',
  },
  {
    id: 'prednisona',
    genericName: 'Prednisona / Prednisolona',
    matchPattern: /\b(prednisona|prednisolona)\b/,
    pharmacologicalGroup: 'Glucocorticoide sistémico de acción intermedia',
    mechanismOfAction:
      'Inhibe transcripción de mediadores inflamatorios, reclutamiento leucocitario y restablece sensibilidad de receptores beta-2 bronquiales en exacerbaciones.',
    standardAdultSingleMg: { min: 20, max: 60 },
    adultDailyMaxMg: 80,
    pediatricSingleMgPerKg: { min: 1, max: 2 },
    pediatricMaxSingleMg: 60,
    renalAdjustment: 'Sin ajuste renal requerido.',
    hepaticAdjustment: 'Preferir Prednisolona (forma activa) sobre Prednisona en insuficiencia hepática severa.',
    pregnancyNote: 'Baja transferencia placentaria (~10%); aceptada en exacerbaciones agudas cuando está indicada.',
    monitoringPlan: 'Control glucémico y síntomas dispépticos; en ciclos ≤5–7 días no requiere descenso escalonado.',
    therapeuticAlternatives: 'Dexametasona VO/IM en crup o Hidrocortisona IV en intolerancia oral.',
  },
  {
    id: 'insulina_cristalina',
    genericName: 'Insulina Cristalina (Regular)',
    matchPattern: /\binsulina\b/,
    pharmacologicalGroup: 'Hormona peptídica hipoglucemiante de acción rápida/corta',
    mechanismOfAction:
      'Activa el receptor tirosina-cinasa promoviendo translocación de GLUT-4, captación celular de glucosa y potasio, e inhibición inmediata de la lipólisis y cetogénesis hepática.',
    renalAdjustment: 'En ERC/LRA disminuye el aclaramiento renal de insulina; reducir dosis y vigilar glucemia horaria para evitar hipoglucemia prolongada.',
    hepaticAdjustment: 'Mayor riesgo de hipoglucemia por menor gluconeogénesis hepática.',
    pregnancyNote: 'Tratamiento de elección en diabetes pregestacional o gestacional descompensada (no atraviesa la placenta).',
    monitoringPlan: 'Verificar potasio sérico antes de iniciar en CAD (si K⁺ <3.3 mEq/L reponer K⁺ primero), glucometría horaria y brecha aniónica.',
    therapeuticAlternatives: 'Insulina Lispro/Aspart en protocolos subcutáneos seleccionados de CAD leve-moderada.',
  },
  {
    id: 'cloruro_potasio',
    genericName: 'Cloruro de Potasio (KCl)',
    matchPattern: /\b(cloruro de potasio|kcl)\b/,
    pharmacologicalGroup: 'Electrolito / Reposición de potasio',
    mechanismOfAction:
      'Restaura el gradiente electroquímico transmembrana de K⁺ esencial para el potencial de reposo miocárdico y la conducción neuromuscular.',
    renalAdjustment: 'Contraindicado o muy restringido en anuria, oliguria o TFG severamente deprimida sin control estricto de K⁺.',
    hepaticAdjustment: 'Sin ajuste hepático directo.',
    pregnancyNote: 'Seguro cuando existe hipokalemia documentada y diuresis conservada.',
    monitoringPlan: 'Administrar SIEMPRE diluido en infusión lenta (nunca en bolo IV directo), con control de diuresis y potasio sérico cada 2–4 h.',
    therapeuticAlternatives: 'Sales de potasio por vía oral cuando la hipokalemia es leve-moderada y existe tolerancia digestiva.',
  },
  {
    id: 'sulfato_magnesio',
    genericName: 'Sulfato de Magnesio',
    matchPattern: /\b(sulfato de magnesio|mgso4)\b/,
    pharmacologicalGroup: 'Anticonvulsivo eclámptico / Antiarrítmico estabilizador de membrana',
    mechanismOfAction:
      'Antagoniza canales de calcio dependientes de voltaje y receptores NMDA, disminuyendo la liberación presináptica de acetilcolina, el vasoespasmo cerebral y las posdespolarizaciones precoces.',
    standardAdultSingleMg: { min: 2000, max: 6000 },
    adultDailyMaxMg: 30000,
    pediatricSingleMgPerKg: { min: 25, max: 50 },
    pediatricMaxSingleMg: 2000,
    renalAdjustment: 'Eliminación exclusivamente renal: en oliguria (<30 mL/h) o creatinina elevada reducir infusión de mantenimiento al 50% o suspender y medir magnesemia.',
    hepaticAdjustment: 'Sin ajuste hepático; fármaco de elección en preeclampsia/eclampsia con síndrome HELLP.',
    pregnancyNote: 'Estándar de oro en prevención/control de eclampsia y neuroprotección fetal (<32 SDG).',
    monitoringPlan: 'Vigilar reflejos osteotendinosos (patelar), frecuencia respiratoria (>12–14 rpm) y diuresis (>30 mL/h) cada hora; tener Gluconato de Calcio como antídoto.',
    therapeuticAlternatives: 'En asma refractaria pediátrica/adulta es coadyuvante al SABA + corticoide; en eclampsia no tiene equivalente de igual eficacia (fenitoína/diazepam son inferiores).',
  },
  {
    id: 'adrenalina',
    genericName: 'Adrenalina (Epinefrina)',
    matchPattern: /\b(adrenalina|epinefrina)\b/,
    pharmacologicalGroup: 'Catecolamina simpaticomimética agonista alfa y beta adrenérgico',
    mechanismOfAction:
      'Agonismo alfa-1 (vasoconstricción y reversión del edema laríngeo/vasoplejía), beta-1 (inotropismo/cronotropismo) y beta-2 (broncodilatación y estabilización mastocitaria que frena liberación de histamina).',
    standardAdultSingleMg: { min: 0.3, max: 0.5 },
    pediatricSingleMgPerKg: { min: 0.01, max: 0.01 },
    pediatricMaxSingleMg: 0.5,
    renalAdjustment: 'No requiere ajuste renal en emergencia.',
    hepaticAdjustment: 'No requiere ajuste hepático en emergencia.',
    pregnancyNote: 'Indicada de forma inmediata IM en anafilaxia durante el embarazo (la hipoperfusión materna es el mayor riesgo fetal).',
    monitoringPlan: 'En anafilaxia administrar exclusivamente vía IM en cara anterolateral del muslo (1:1000); vigilar ECG, PA y SpO₂.',
    therapeuticAlternatives: 'Antihistamínicos y corticoides son SOLO coadyuvantes secundarios: nunca sustituyen a la Adrenalina IM en anafilaxia.',
  },
  {
    id: 'ondansetron',
    genericName: 'Ondansetrón',
    matchPattern: /\bondansetron\b/,
    pharmacologicalGroup: 'Antagonista selectivo de receptores 5-HT₃ de serotonina',
    mechanismOfAction:
      'Bloquea receptores 5-HT₃ en terminales vagales intestinales y zona gatillo quimiorreceptora del área postrema, suprimiendo el reflejo emético.',
    standardAdultSingleMg: { min: 4, max: 8 },
    adultDailyMaxMg: 24,
    pediatricSingleMgPerKg: { min: 0.1, max: 0.15 },
    pediatricMaxSingleMg: 4,
    renalAdjustment: 'Sin ajuste en insuficiencia renal.',
    hepaticAdjustment: 'En insuficiencia hepática grave (Child-Pugh C) no superar dosis máxima diaria de 8 mg.',
    pregnancyNote: 'Opción de segunda línea si falla hidratación/piridoxina-doxilamina/metoclopramida; valorar riesgo-beneficio en 1.º trimestre.',
    monitoringPlan: 'Vigilar QTc especialmente si se combina con amiodarona, macrólidos, fluoroquinolonas o antipsicóticos.',
    therapeuticAlternatives: 'Metoclopramida (evitar en obstrucción intestinal o Parkinson) o Dimenhidrinato.',
  },
  {
    id: 'omeprazol',
    genericName: 'Omeprazol',
    matchPattern: /\bomeprazol\b/,
    pharmacologicalGroup: 'Inhibidor de la bomba de protones (IBP)',
    mechanismOfAction:
      'Profármaco que se activa en medio ácido canalicular parietal formando puentes disulfuro irreversibles con la ATPasa H⁺/K⁺, elevando el pH intragástrico para estabilizar coágulos y cicatrizar mucosa.',
    standardAdultSingleMg: { min: 20, max: 80 },
    adultDailyMaxMg: 160,
    pediatricSingleMgPerKg: { min: 0.5, max: 1.5 },
    pediatricMaxSingleMg: 40,
    renalAdjustment: 'Sin ajuste por TFG; vigilar nefritis intersticial en uso crónico.',
    hepaticAdjustment: 'Reducir a máx. 20 mg/día en cirrosis hepática.',
    pregnancyNote: 'Compatible cuando existe enfermedad ácido-péptica o ERGE sintomática refractaria.',
    monitoringPlan: 'En hemorragia digestiva alta no variceal usar dosis inicial alta IV tras estabilización; evaluar interacción con clopidogrel (preferir pantoprazol).',
    therapeuticAlternatives: 'Pantoprazol o Esomeprazol (Pantoprazol tiene menor inhibición de CYP2C19 frente a clopidogrel).',
  },
  {
    id: 'warfarina',
    genericName: 'Warfarina',
    matchPattern: /\bwarfarina\b/,
    pharmacologicalGroup: 'Anticoagulante oral antagonista de la vitamina K',
    mechanismOfAction:
      'Inhibe la epóxido reductasa de vitamina K (VKORC1), reduciendo la gamma-carboxilación hepática de factores II, VII, IX, X y proteínas C y S.',
    standardAdultSingleMg: { min: 2, max: 10 },
    renalAdjustment: 'No requiere ajuste por TFG, aunque exige control más estrecho del INR en ERC avanzada.',
    hepaticAdjustment: 'Extremadamente sensible en hepatopatía por déficit basal de síntesis de factores.',
    pregnancyNote: 'Contraindicada en embarazo por embriopatía warfarínica y hemorragia fetal (sustituir por Enoxaparina).',
    monitoringPlan: 'Control seriado de INR (meta habitual 2.0–3.0) y revisión estricta de interacciones antibióticas/AINEs.',
    therapeuticAlternatives: 'Apixabán o Rivaroxabán (en FA no valvular con TFG adecuada); Enoxaparina en gestación.',
  },
  {
    id: 'enalapril',
    genericName: 'Enalapril / IECA',
    matchPattern: /\b(enalapril|captopril|lisinopril|ramipril)\b/,
    pharmacologicalGroup: 'Inhibidor de la enzima convertidora de angiotensina (IECA)',
    mechanismOfAction:
      'Bloquea la conversión de angiotensina I en angiotensina II y reduce la degradación de bradicinina, disminuyendo poscarga, presión intraglomerular y remodelado ventricular.',
    standardAdultSingleMg: { min: 5, max: 40 },
    adultDailyMaxMg: 40,
    renalAdjustment: 'Iniciar con dosis bajas en ERC; suspender si la creatinina sube >30% tras el inicio o aparece hiperkalemia >5.5 mEq/L.',
    hepaticAdjustment: 'Enalapril es profármaco que requiere activación hepática a enalaprilato (preferir lisinopril en cirrosis grave).',
    pregnancyNote: 'Absolutamente contraindicado en el embarazo (toxicidad renal fetal, oligohidramnios y disgenesia craneal).',
    monitoringPlan: 'Controlar creatinina sérica y potasio a los 7–14 días del inicio o ajuste de dosis.',
    therapeuticAlternatives: 'Losartán / ARA-II si tos por bradicinina; Labetalol/Metildopa/Nifedipino en gestantes.',
  },
  {
    id: 'metformina',
    genericName: 'Metformina',
    matchPattern: /\bmetformina\b/,
    pharmacologicalGroup: 'Antidiabético biguanida',
    mechanismOfAction:
      'Activa AMPK hepática disminuyendo la gluconeogénesis y mejorando la sensibilidad periférica a la insulina sin inducir hipoglucemia aislada ni ganancia ponderal.',
    standardAdultSingleMg: { min: 500, max: 1000 },
    adultDailyMaxMg: 2550,
    renalAdjustment: 'Reducir a máx. 1,000 mg/día con TFG 30–44 mL/min; CONTRAINDICADA en TFG <30 mL/min, LRA, sepsis o hipoperfusión por riesgo de acidosis láctica.',
    hepaticAdjustment: 'Contraindicada en insuficiencia hepática clínicamente manifiesta (reduce aclaramiento de lactato).',
    pregnancyNote: 'Preferir Insulina como estándar de oro en diabetes durante el embarazo (MINSA / ADA).',
    monitoringPlan: 'Suspender temporalmente en hospitalización aguda inestable, sepsis, LRA o estudios con contraste yodado IV; vigilar vitamina B12 en uso crónico.',
    therapeuticAlternatives: 'Insulina basal/rápida en paciente hospitalizado o descompensado; iSGLT2 en ERC/IC crónica según TFG.',
  },
  {
    id: 'atropina',
    genericName: 'Atropina',
    matchPattern: /\batropina\b/,
    pharmacologicalGroup: 'Antagonista muscarínico anticolinérgico',
    mechanismOfAction:
      'Bloqueo competitivo de receptores colinérgicos muscarínicos (M₂ en nodo SA/AV y M₃ periféricos), revertiendo bradicardia vagal y crisis colinérgica por organofosforados.',
    standardAdultSingleMg: { min: 0.5, max: 3 },
    pediatricSingleMgPerKg: { min: 0.02, max: 0.05 },
    pediatricMaxSingleMg: 0.5,
    renalAdjustment: 'No requiere ajuste inmediato en urgencias.',
    hepaticAdjustment: 'No requiere ajuste inmediato en urgencias.',
    pregnancyNote: 'Uso aceptado en emergencia vital (bradicardia sintomática o intoxicación por organofosforados).',
    monitoringPlan: 'Vigilar ritmo cardíaco (en bloqueo AV infranodal Mobitz II/III puede empeorar paradójicamente la conducción), retención urinaria y delirium.',
    therapeuticAlternatives: 'En bradiarritmia refractaria o bloqueo AV completo: Dopamina/Adrenalina en infusión o marcapasos transcutáneo.',
  },
  {
    id: 'cristaloides',
    genericName: 'Cristaloide Isotónico (SSN 0.9% / Ringer Lactato)',
    matchPattern: /\b(solucion salina|salina|ssn|hartmann|ringer|lactato de ringer|cristaloide)\b/,
    pharmacologicalGroup: 'Solución cristaloide isotónica expansora de compartimento extracelular',
    mechanismOfAction:
      'Restaura volumen intravascular y perfusión tisular aumentando la precarga ventricular según la ley de Frank-Starling.',
    renalAdjustment: 'Evitar sobrecarga agresiva en oligoanuria/edema pulmonar; preferir soluciones balanceadas (Hartmann) en CAD/sepsis salvo hiperkalemia severa o TEC.',
    hepaticAdjustment: 'Preferir SSN 0.9% en disfunción hepática severa con hiperlactatemia marcada si preocupa aclaramiento de lactato.',
    pregnancyNote: 'Primera línea en reanimación obstétrica y choque hipovolémico.',
    monitoringPlan: 'Reevaluar tras cada carga de 250–500 mL (o 10–20 mL/kg pediátrico): auscultación pulmonar, FC, PA, llenado capilar y diuresis.',
    therapeuticAlternatives: 'Sales de rehidratación oral (SRO) cuando no existe choque, vómitos incoercibles ni alteración de conciencia.',
  },
];

function findMonograph(drugNorm: string): PharmacologyMonograph | null {
  for (const m of PHARMACOLOGY_MONOGRAPHS) {
    if (m.matchPattern.test(drugNorm)) return m;
  }
  return null;
}

function inferFallbackGroupAndMechanism(drugNorm: string): {
  group: string;
  mechanism: string;
  monitoring: string;
  alternatives: string;
} {
  if (/\b(azitromicina|claritromicina|eritromicina|cefalexina|cefuroxima|cefotaxima|cefepima|meropenem|piperacilina|clindamicina|vancomicina|doxiciclina|trimetoprim|sulfametoxazol|fosfomicina|levofloxacino|gentamicina|amikacina)\b/.test(drugNorm)) {
    return {
      group: 'Antimicrobiano sistémico',
      mechanism: 'Inhibición selectiva de pared celular, síntesis proteica o replicación bacteriana según clase antimicrobiana.',
      monitoring: 'Control de curva febril a las 48–72 h, cultivos, función renal y eventos adversos/alergias.',
      alternatives: 'Ajustar según antibiograma local, alergias documentadas y protocolo MINSA/IDSA del foco infeccioso.',
    };
  }
  if (/\b(losartan|valsartan|amlodipino|nifedipino|hidralazina|metoprolol|carvedilol|bisoprolol|propranolol|esmolol|amiodarona|adenosina|digoxina|verapamilo|diltiazem|norepinefrina)\b/.test(drugNorm)) {
    return {
      group: 'Fármaco cardiovascular / vasoactivo / antiarrítmico',
      mechanism: 'Modulación de tono vascular, conducción nodal o contractilidad miocárdica mediante receptores adrenérgicos, canales iónicos o eje RAA.',
      monitoring: 'Presión arterial seriada, frecuencia cardíaca, trazo ECG y electrolitos/función renal.',
      alternatives: 'Individualizar según fracción de eyección, embarazo, asma/EPOC y estabilidad hemodinámica.',
    };
  }
  if (/\b(dexametasona|metilprednisolona|budesonida|ipratropio|tiotropio)\b/.test(drugNorm)) {
    return {
      group: 'Corticoide / Broncodilatador respiratorio',
      mechanism: 'Modulación antiinflamatoria genómica o relajación del músculo liso bronquial (bloqueo muscarínico / agonismo beta-2).',
      monitoring: 'SpO₂, trabajo respiratorio, glucemia capilar y respuesta clínica tras dosis inicial.',
      alternatives: 'Titular según severidad de crisis respiratoria y vía oral disponible.',
    };
  }
  if (/\b(diazepam|lorazepam|midazolam|fenitoina|levetiracetam|valproato|carbamazepina|haloperidol|sertralina|fluoxetina)\b/.test(drugNorm)) {
    return {
      group: 'Fármaco neuropsiquiátrico / Anticonvulsivo',
      mechanism: 'Modulación GABAérgica, de canales de sodio/calcio sinápticos o neurotransmisión monoaminérgica central.',
      monitoring: 'Nivel de conciencia, frecuencia respiratoria, presión arterial y riesgo de interacciones hepáticas/QTc.',
      alternatives: 'En mujeres en edad fértil evitar valproato cuando existan alternativas seguras como levetiracetam.',
    };
  }
  if (/\b(sro|suero oral|sales de rehidratacion|dextrosa|bicarbonato)\b/.test(drugNorm)) {
    return {
      group: 'Solución hidroelectrolítica / Soporte metabólico',
      mechanism: 'Reposición dirigida de agua, electrolitos, glucosa o capacidad tampón extracelular.',
      monitoring: 'Signos de hidratación, diuresis, glucemia capilar e ionograma sérico.',
      alternatives: 'Ajustar vía enteral vs parenteral según tolerancia digestiva y perfusión.',
    };
  }
  return {
    group: 'Agente terapéutico específico',
    mechanism: 'Acción farmacológica dirigida sobre el proceso fisiopatológico o sintomático seleccionado.',
    monitoring: 'Respuesta clínica esperada, tolerabilidad, función renal/hepática y signos de alarma.',
    alternatives: 'Contrastar siempre con el esquema de primera línea de la guía vigente para el diagnóstico definitivo.',
  };
}

export function auditMedicationPharmacology(
  item: MedicationItem,
  caseData: ClinicalCase,
  fullPlan: MedicationItem[]
): MedicationPharmacologyAudit {
  const drugNorm = norm(item.drug || '');
  const doseNorm = norm(item.dose || '');
  const routeNorm = norm(item.route || '');
  const age = caseData.patientInfo?.age ?? 30;
  const { weightKg, isEstimated } = getEffectivePatientWeightKg(caseData);
  const monograph = findMonograph(drugNorm);
  const fallback = inferFallbackGroupAndMechanism(drugNorm);

  const preg = detectPregnancyContext(caseData);
  const renal = detectRenalImpairmentContext(caseData);
  const hepatic = detectHepaticImpairmentContext(caseData);
  const isPediatric = age < 12 || (age < 16 && weightKg < 45);
  const isGeriatric = age >= 65;

  const parsed = parseNumericDose(item.dose || '', weightKg);

  let doseCheckStatus: MedicationPharmacologyAudit['doseCheckStatus'] = 'no_evaluable';
  const adjustmentNotes: string[] = [];

  if (monograph) {
    if (isPediatric && monograph.pediatricSingleMgPerKg && parsed.mg !== null) {
      const mgPerKg = parsed.mg / weightKg;
      const minP = monograph.pediatricSingleMgPerKg.min;
      const maxP = monograph.pediatricSingleMgPerKg.max;
      const maxCap = monograph.pediatricMaxSingleMg ?? (monograph.standardAdultSingleMg?.max || 99999);
      const weightTag = isEstimated ? `~${weightKg} kg (estimado por edad)` : `${weightKg} kg`;

      if (parsed.mg > maxCap * 1.15 || mgPerKg > maxP * 1.45) {
        doseCheckStatus = 'excesiva';
        adjustmentNotes.push(
          `Dosis pediátrica excesiva: ${Math.round(parsed.mg)} mg equivalen a ${mgPerKg.toFixed(1)} mg/kg para ${weightTag} (rango recomendado ${minP}–${maxP} mg/kg/dosis; tope máx. ${maxCap} mg).`
        );
      } else if (mgPerKg < minP * 0.6) {
        doseCheckStatus = 'subterapeutica';
        adjustmentNotes.push(
          `Dosis pediátrica infraterapéutica: ${Math.round(parsed.mg)} mg equivalen a ${mgPerKg.toFixed(1)} mg/kg para ${weightTag} (rango esperado ${minP}–${maxP} mg/kg/dosis).`
        );
      } else {
        doseCheckStatus = 'adecuada';
        adjustmentNotes.push(
          `Cálculo pediátrico adecuado (${mgPerKg.toFixed(1)} mg/kg para ${weightTag}; dentro de ${minP}–${maxP} mg/kg y bajo el tope de ${maxCap} mg).`
        );
      }
    } else if (!isPediatric && monograph.standardAdultSingleMg && parsed.mg !== null) {
      const minA = monograph.standardAdultSingleMg.min;
      const maxA = monograph.standardAdultSingleMg.max;
      if (parsed.mg > maxA * 1.5 || (monograph.adultDailyMaxMg && parsed.mg > monograph.adultDailyMaxMg)) {
        doseCheckStatus = 'excesiva';
        adjustmentNotes.push(
          `Dosis única de ${parsed.mg} mg supera el rango adulto habitual (${minA}–${maxA} mg por toma${monograph.adultDailyMaxMg ? `; máx. diario ${monograph.adultDailyMaxMg} mg` : ''}).`
        );
      } else if (parsed.mg < minA * 0.5) {
        doseCheckStatus = 'subterapeutica';
        adjustmentNotes.push(
          `Dosis única de ${parsed.mg} mg es inferior al rango terapéutico adulto habitual (${minA}–${maxA} mg).`
        );
      } else {
        doseCheckStatus = 'adecuada';
      }
    }
  }

  // Context adjustments: renal, hepatic, pregnancy, geriatric
  if (renal.hasRenalImpairment) {
    if (monograph) {
      adjustmentNotes.push(`Ajuste renal: ${monograph.renalAdjustment}`);
    } else if (/\b(ciprofloxacino|levofloxacino|enoxaparina|vancomicina|meropenem|cefepima|gabapentina|pregabalina|alopurinol|espironolactona)\b/.test(drugNorm)) {
      adjustmentNotes.push('Ajuste renal requerido: reducir dosis o espaciar intervalo según TFG estimada.');
    }
  }
  if (hepatic) {
    if (monograph) {
      adjustmentNotes.push(`Ajuste hepático: ${monograph.hepaticAdjustment}`);
    } else if (/\b(paracetamol|acetaminofen|metronidazol|clindamicina|atorvastatina|valproico|carbamazepina)\b/.test(drugNorm)) {
      adjustmentNotes.push('Ajuste hepático requerido: metabolismo hepático reducido en hepatopatía.');
    }
  }
  if (preg.isViablePregnancy && monograph) {
    adjustmentNotes.push(`Gestación: ${monograph.pregnancyNote}`);
  }
  if (isGeriatric) {
    if (/\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|diazepam|alprazolam|clonazepam|glibenclamida|metoclopramida|difenhidramina|amitriptilina)\b/.test(drugNorm)) {
      adjustmentNotes.push(
        `Precaución geriátrica (${age} años, criterios Beers): mayor riesgo de sangrado GI, caída de TFG, sedación o delirium.`
      );
    }
  }

  // Timing / clinical appropriateness checks
  const timingNotes: string[] = [];
  const fullPlanNorm = norm(fullPlan.map((m) => `${m.drug} ${m.dose} ${m.route} ${m.frequency}`).join(' '));
  const diagNorm = norm(caseData.solution?.correctDiagnosis || '');
  const triage = caseData.patientInfo?.triageLevel || '';
  const isAcuteEmergency = caseData.mode === 'urgencias' || /\bNivel\s+(?:I|II)\b/.test(triage);

  if (/\b(norepinefrina|noradrenalina|dopamina)\b/.test(drugNorm)) {
    const hasFluidResuscitation = /\b(salina|ssn|hartmann|ringer|cristaloide)\b/.test(fullPlanNorm);
    if (!hasFluidResuscitation && /\b(sepsis|choque septico|choque hipovolemico|deshidrat)\b/.test(diagNorm)) {
      timingNotes.push(
        'Momento terapéutico inadecuado: iniciar vasopresor sin carga previa/simultánea de cristaloides en choque hipovolémico o distributivo agrava la isquemia esplácnica y renal.'
      );
    }
  }

  if (/\binsulina\b/.test(drugNorm) && /\b(cetoacidosis|\bcad\b|dka)\b/.test(diagNorm)) {
    const kVal = detectPotassiumFromStudies(caseData);
    if (kVal !== null && kVal < 3.3 && !/\b(cloruro de potasio|kcl|potasio)\b/.test(fullPlanNorm)) {
      timingNotes.push(
        `Secuencia crítica en CAD: el potasio sérico basal es ${kVal} mEq/L (<3.3 mEq/L). La insulina debe diferirse hasta iniciar reposición de K⁺ para evitar arritmia mortal por hipokalemia.`
      );
    } else if (!/\b(salina|ssn|hartmann|ringer|cristaloide)\b/.test(fullPlanNorm)) {
      timingNotes.push(
        'Secuencia terapéutica en CAD: la reanimación hídrica con cristaloides debe preceder/acompañar la infusión de insulina regular.'
      );
    }
  }

  if (
    /\b(prednisona|hidrocortisona|metilprednisolona)\b/.test(drugNorm) &&
    /\b(asma|epoc|broncoespasmo)\b/.test(diagNorm) &&
    !/\b(salbutamol|albuterol|ipratropio|adrenalina)\b/.test(fullPlanNorm)
  ) {
    timingNotes.push(
      'Momento clínico incompleto: en broncoespasmo agudo el corticoide actúa tras horas; requiere asociarse a broncodilatador de rescate inmediato (SABA).'
    );
  }

  if (
    isAcuteEmergency &&
    /\boral\b|\bvo\b/.test(routeNorm) &&
    /\b(labetalol|hidralazina|furosemida|ceftriaxona|amiodarona|insulina|hidrocortisona)\b/.test(drugNorm) &&
    !/\b(ambulatorio)\b/.test(norm(caseData.solution?.optimalTreatment?.hospitalizationDecision || ''))
  ) {
    timingNotes.push(
      `Vía/momento subóptimo: en emergencia ${triage || 'aguda'} la vía oral tiene latencia errática frente a la vía parenteral indicada.`
    );
  }

  if (
    /\b(nitrofurantoina)\b/.test(drugNorm) &&
    /\b(pielonefritis|sepsis|urosepsis)\b/.test(diagNorm)
  ) {
    timingNotes.push(
      'Indicación incorrecta para el cuadro: la nitrofurantoína no alcanza concentraciones terapéuticas en parénquima renal ni sangre; solo sirve en cistitis no complicada.'
    );
  }

  if (/\b(amoxicilina)\b/.test(drugNorm) && /\b(atipica|mycoplasma|chlamydia)\b/.test(diagNorm)) {
    timingNotes.push(
      'Indicación discordante: los betalactámicos carecen de diana en patógenos atípicos sin pared de peptidoglicano (Mycoplasma/Chlamydophila).'
    );
  }

  if (/\bdosis estandar\b/.test(doseNorm) || !doseNorm) {
    adjustmentNotes.push('No se cuantificó una dosis numérica explícita para auditoría posológica estricta.');
  }

  return {
    pharmacologicalGroup: monograph?.pharmacologicalGroup || fallback.group,
    mechanismOfAction: monograph?.mechanismOfAction || fallback.mechanism,
    doseCheckStatus,
    doseAdjustmentAlert: adjustmentNotes.length > 0 ? adjustmentNotes.join(' ') : undefined,
    timingOrIndicationIssue: timingNotes.length > 0 ? timingNotes.join(' ') : undefined,
    monitoringPlan: monograph?.monitoringPlan || fallback.monitoring,
    therapeuticAlternatives: monograph?.therapeuticAlternatives || fallback.alternatives,
  };
}

export function detectPlanDrugInteractions(
  userRx: MedicationItem[],
  caseData: ClinicalCase
): DrugInteractionAlert[] {
  const negationRegex =
    /\b(suspender|suspendase|retirar|retiro|omitir|evitar|prohibid[oa]|contraindicad[oa]|descontinuar|no\s+(?:administrar|usar|dar|indicar|prescribir))\b/;

  const suspendedMedsText = norm(
    userRx
      .filter((m) => negationRegex.test(norm(`${m.drug} ${m.dose} ${m.frequency}`)))
      .map((m) => `${m.drug} ${m.dose}`)
      .join(' ')
  );

  const activeRxText = norm(
    userRx
      .filter((m) => !negationRegex.test(norm(`${m.drug} ${m.dose} ${m.frequency}`)))
      .map((m) => `${m.drug} ${m.dose} ${m.route}`)
      .join(' | ')
  );

  // Exclude chronic home medications explicitly suspended by the clinician
  const activeHomeMeds = (caseData.background?.currentMedications || []).filter((cm) => {
    const cmNorm = norm(cm);
    if (!cmNorm || /\b(ninguno|niega|sin medicacion)\b/.test(cmNorm)) return false;
    const mainToken = cmNorm.split(/[\s,/()-]+/).find((t) => t.length >= 5);
    if (mainToken && suspendedMedsText.includes(mainToken)) return false;
    return true;
  });

  const combinedText = `${activeRxText} | ${norm(activeHomeMeds.join(' | '))}`;
  if (!activeRxText.trim()) return [];

  const alerts: DrugInteractionAlert[] = [];
  const pushUnique = (alert: DrugInteractionAlert) => {
    if (!alerts.some((a) => a.pairLabel === alert.pairLabel)) {
      alerts.push(alert);
    }
  };

  const hasNitrate = /\b(nitroglicerina|isosorbide|mononitrato|dinitrato)\b/.test(combinedText);
  const hasPde5 = /\b(sildenafil|tadalafil|vardenafil|avanafil)\b/.test(combinedText);
  if (hasNitrate && hasPde5) {
    pushUnique({
      pairLabel: 'Nitratos + Inhibidor de PDE-5 (Sildenafil/Tadalafil)',
      severity: 'critica',
      mechanism: 'Sinergia sobre la vía óxido nítrico–GMPc al estimular producción e impedir degradación de GMPc vascular.',
      clinicalRisk: 'Vasodilatación sistémica masiva e hipotensión refractaria potencialmente mortal.',
      recommendation: 'Contraindicación absoluta durante al menos 24 h tras sildenafil/vardenafil o 48 h tras tadalafil.',
    });
  }

  const hasBetaBlocker = /\b(metoprolol|propranolol|atenolol|esmolol|labetalol|carvedilol|bisoprolol)\b/.test(activeRxText);
  const hasNonDhpCcb = /\b(verapamilo|diltiazem)\b/.test(combinedText);
  if (hasBetaBlocker && hasNonDhpCcb) {
    pushUnique({
      pairLabel: 'Betabloqueador + Calcioantagonista no dihidropiridínico (Verapamilo/Diltiazem)',
      severity: 'critica',
      mechanism: 'Sinergia cronotrópica, dromotrópica e inotrópica negativa sobre el nodo SA/AV y miocardio.',
      clinicalRisk: 'Bradicardia severa, bloqueo auriculoventricular completo, asistolia o choque cardiogénico.',
      recommendation: 'Evitar asociación (especialmente IV); elegir una sola estrategia nodal y monitorizar ECG continuo.',
    });
  }

  const hasWarfarin = /\b(warfarina|acenocumarol)\b/.test(combinedText);
  const hasNsaidOrAsa =
    /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|indometacina|meloxicam|celecoxib|aspirina|acido acetilsalicilico|\baas\b)\b/.test(
      activeRxText
    );
  if (hasWarfarin && hasNsaidOrAsa) {
    pushUnique({
      pairLabel: 'Warfarina + AINE / Ácido Acetilsalicílico',
      severity: 'critica',
      mechanism: 'Doble agresión: disfunción plaquetaria/erosión mucosa + desplazamiento proteico y anticoagulación sistémica.',
      clinicalRisk: 'Aumento marcado del riesgo de hemorragia digestiva alta grave y hemorragia intracraneal.',
      recommendation: 'Evitar AINEs en pacientes anticoagulados; usar Paracetamol o gastroprotección estricta solo si AAS tiene indicación cardiológica precisa.',
    });
  }

  if (
    hasWarfarin &&
    /\b(metronidazol|trimetoprim|sulfametoxazol|cotrimoxazol|ciprofloxacino|fluconazol|amiodarona)\b/.test(activeRxText)
  ) {
    pushUnique({
      pairLabel: 'Warfarina + Inhibidor CYP2C9 (Metronidazol / TMP-SMX / Fluconazol / Ciprofloxacino / Amiodarona)',
      severity: 'moderada',
      mechanism: 'Inhibición del metabolismo hepático CYP2C9 de la S-warfarina activa.',
      clinicalRisk: 'Elevación súbita del INR y riesgo de sangrado mayor entre 48–96 h.',
      recommendation: 'Preferir antibiótico alternativo si es posible o reducir empíricamente warfarina con control estricto de INR.',
    });
  }

  const hasIecaOrAra = /\b(enalapril|captopril|lisinopril|ramipril|losartan|valsartan|irbesartan|telmisartan)\b/.test(combinedText);
  const hasKRetaining = /\b(espironolactona|eplerenona|cloruro de potasio|kcl)\b/.test(combinedText);
  if (hasIecaOrAra && hasKRetaining) {
    const renal = detectRenalImpairmentContext(caseData);
    pushUnique({
      pairLabel: 'IECA / ARA-II + Espironolactona o Suplemento de Potasio (KCl)',
      severity: renal.hasRenalImpairment ? 'critica' : 'moderada',
      mechanism: 'Supresión aditiva de aldosterona y reducción de excreción tubular distal de potasio.',
      clinicalRisk: 'Hiperpotasemia severa con riesgo de bloqueo cardíaco o fibrilación ventricular, especialmente si TFG reducida.',
      recommendation: 'Control estricto de K⁺ y creatinina; evitar KCl rutinario salvo hipokalemia demostrada.',
    });
  }

  const qtDrugsCount = [
    /\bamiodarona\b/.test(combinedText),
    /\bondansetron\b/.test(combinedText),
    /\b(azitromicina|claritromicina|eritromicina)\b/.test(combinedText),
    /\b(ciprofloxacino|levofloxacino|moxifloxacino)\b/.test(combinedText),
    /\b(haloperidol|clorpromazina|risperidona)\b/.test(combinedText),
  ].filter(Boolean).length;
  if (qtDrugsCount >= 2 && [
    /\bamiodarona\b/.test(activeRxText),
    /\bondansetron\b/.test(activeRxText),
    /\b(azitromicina|claritromicina|eritromicina)\b/.test(activeRxText),
    /\b(ciprofloxacino|levofloxacino|moxifloxacino)\b/.test(activeRxText),
    /\b(haloperidol|clorpromazina|risperidona)\b/.test(activeRxText),
  ].some(Boolean)) {
    pushUnique({
      pairLabel: 'Combinación de fármacos prolongadores del intervalo QTc',
      severity: /\bamiodarona\b/.test(combinedText) && /\b(haloperidol|moxifloxacino|ondansetron)\b/.test(combinedText) ? 'critica' : 'moderada',
      mechanism: 'Bloqueo aditivo de canales rectificadores tardíos de potasio (IKr / hERG) miocárdicos.',
      clinicalRisk: 'Prolongación del QTc >500 ms y taquicardia ventricular polimórfica (Torsades de Pointes).',
      recommendation: 'Monitorizar QTc en ECG y corregir K⁺ (>4.0 mEq/L) y Mg²⁺ (>2.0 mg/dL) o elegir alternativa sin efecto QT.',
    });
  }

  const hasSsri = /\b(sertralina|fluoxetina|paroxetina|citalopram|escitalopram|venlafaxina)\b/.test(combinedText);
  const hasSerotonergicPartner = /\b(tramadol|linezolid|dextrometorfano|litio|fentanilo)\b/.test(combinedText);
  if (hasSsri && hasSerotonergicPartner) {
    pushUnique({
      pairLabel: 'ISRS/IRSN + Tramadol / Linezolid / Dextrometorfano',
      severity: 'critica',
      mechanism: 'Exceso sináptico de serotonina (recaptación bloqueada + liberación/inhibición MAO).',
      clinicalRisk: 'Síndrome serotoninérgico agudo (hipertermia, clonus, agitación e inestabilidad autonómica).',
      recommendation: 'Evitar tramadol, linezolid y dextrometorfano en pacientes tratados con ISRS/IRSN.',
    });
  }

  const hasDigoxin = /\bdigoxina\b/.test(combinedText);
  if (hasDigoxin && /\b(amiodarona|verapamilo|diltiazem|claritromicina)\b/.test(combinedText)) {
    pushUnique({
      pairLabel: 'Digoxina + Amiodarona / Verapamilo / Claritromicina',
      severity: 'moderada',
      mechanism: 'Inhibición de glucoproteína P renal e intestinal con aumento de concentraciones séricas de digoxina (hasta +70–100%).',
      clinicalRisk: 'Intoxicación digitálica (arritmias ventriculares/nodales, bloqueos, vómitos y xantopsia).',
      recommendation: 'Reducir dosis de digoxina al 50% y vigilar digoxinemia, K⁺ y ECG.',
    });
  }

  const hasMetformin = /\bmetformina\b/.test(activeRxText);
  const diagNorm = norm(caseData.solution?.correctDiagnosis || '');
  const renal = detectRenalImpairmentContext(caseData);
  if (
    hasMetformin &&
    (renal.isAcuteKidneyInjury || /\b(sepsis|choque|cetoacidosis|hipoxemia grave|insuficiencia cardiaca descompensada)\b/.test(diagNorm))
  ) {
    pushUnique({
      pairLabel: 'Metformina en contexto de hipoperfusión / sepsis / LRA',
      severity: 'critica',
      mechanism: 'Disminución del aclaramiento renal de metformina sumada a metabolismo anaerobio e inhibición de gluconeogénesis de lactato.',
      clinicalRisk: 'Acidosis láctica asociada a metformina (MALA) con elevada mortalidad.',
      recommendation: 'Suspender metformina durante enfermedad aguda grave o LRA y controlar glucemia con insulina.',
    });
  }

  return alerts;
}
