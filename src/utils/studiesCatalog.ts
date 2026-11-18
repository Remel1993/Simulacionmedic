import { ClinicalCase, ComplementaryStudy } from '../types/clinical';
import { normalizeStudiesPoolToSingleTests } from './studySingleizer';

/**
 * Universal Hospital Diagnostic Catalog
 * Proporciona un menú hospitalario estandarizado completo de práctica clínica diaria
 * compuesto exclusivamente por pruebas individuales (sin agrupaciones ni mezclas),
 * ordenado con criterio clínico discreto para que las pruebas altamente específicas
 * no aparezcan al inicio del catálogo ni revelen el diagnóstico.
 */
export const HOSPITAL_SUBCATEGORY_ORDER: ComplementaryStudy['subcategory'][] = [
  'Hematología',
  'Bioquímica',
  'Electrolitos',
  'Función Hepática',
  'Gases',
  'Inflamación e Infección',
  'Vitaminas y Nutrición',
  'Cardiovascular',
  'Urinario',
  'Microbiología / Serología',
  'Radiología',
  'Ecografía',
  'Tomografía',
  'Electrocardiograma',
  'Electromiografía y Neurofisiología',
  'Función Pulmonar y Audiología',
  'Endoscopia y Broncoscopia',
];

export const STANDARD_HOSPITAL_STUDIES: ComplementaryStudy[] = [
  // ================= HEMATOLOGÍA (orden clínico rutinario -> especializado) =================
  {
    id: 'hosp-hemograma',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Hemograma completo (Biometría Hemática con diferencial)',
    result: 'Leucocitos: 7,400 /mm³ (Neutrófilos 60%, Linfocitos 30%, Monocitos 7%, Eosinófilos 3%) | Hemoglobina: 13.8 g/dL | Hematocrito: 41.2% | VCM: 88 fL | Plaquetas: 245,000 /mm³.',
    referenceRange: 'Leucocitos: 4,500-11,000 /mm³ | Hb: 12-16 g/dL | Hto: 36-47% | Plaquetas: 150,000-450,000 /mm³',
    interpretation: 'Serie roja, blanca y plaquetaria dentro de parámetros basales normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-coagulation',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Tiempos de coagulación (TP, TTPa, INR)',
    result: 'Tiempo de Protrombina (TP): 12.3 seg (Control: 12.0) | TTPa: 29.5 seg (Control: 30.0) | INR: 1.02 | Fibrinógeno: 320 mg/dL.',
    referenceRange: 'TP: 11-13.5 seg, TTPa: 25-35 seg, INR: 0.9-1.15',
    interpretation: 'Cascada de coagulación extrínseca e intrínseca conservadas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-grupo-rh',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Grupo sanguíneo y factor Rh',
    result: 'Grupo sanguíneo: O | Factor Rh (D): Positivo.',
    referenceRange: 'Tipificación ABO y Rh(D)',
    interpretation: 'Tipificación sanguínea basal registrada.',
    isAbnormal: false,
  },
  {
    id: 'hosp-frotis',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Frotis de sangre periférica',
    result: 'Eritrocitos normocíticos normocrómicos sin esquistocitos ni esferocitos; leucocitos maduros sin blastos ni linfocitos atípicos; plaquetas adecuadas en número y morfología.',
    referenceRange: 'Morfología eritrocitaria, leucocitaria y plaquetaria normal',
    interpretation: 'Sin alteraciones morfológicas en extendido periférico.',
    isAbnormal: false,
  },
  {
    id: 'hosp-reticulocitos',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Conteo de reticulocitos',
    result: 'Reticulocitos: 1.1% (índice de producción reticulocitaria normal).',
    referenceRange: '0.5 - 2.0%',
    interpretation: 'Respuesta medular eritropoyética basal normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ferritina',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Ferritina sérica',
    result: 'Ferritina sérica: 84 ng/mL.',
    referenceRange: '30 - 300 ng/mL',
    interpretation: 'Depósitos corporales de hierro dentro de parámetros normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-ferrico',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Hierro sérico, TIBC y saturación de transferrina',
    result: 'Hierro sérico: 98 mcg/dL | Capacidad total de fijación (TIBC): 310 mcg/dL | Saturación de transferrina: 31.6%.',
    referenceRange: 'Hierro sérico: 60-170 mcg/dL | TIBC: 250-400 mcg/dL | Sat. transferrina: 20-50%',
    interpretation: 'Cinética férrica sérica normal; descarta ferropenia circulante.',
    isAbnormal: false,
  },
  {
    id: 'hosp-dimer-d',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Dímero D cuantitativo',
    result: 'Dímero D: 210 ng/mL FEU.',
    referenceRange: '<500 ng/mL FEU',
    interpretation: 'Valores basales normales. Alto valor predictivo negativo para trombosis activa o CID.',
    isAbnormal: false,
  },
  {
    id: 'hosp-coombs',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    name: 'Prueba de Coombs directo',
    result: 'Prueba de antiglobulina directa (Coombs directo): Negativo.',
    referenceRange: 'Negativo',
    interpretation: 'Sin evidencia de sensibilización eritrocitaria mediada por autoanticuerpos o complemento.',
    isAbnormal: false,
  },

  // ================= BIOQUÍMICA =================
  {
    id: 'hosp-quimica-basica',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Química sanguínea básica (Glucosa, Urea, Creatinina, BUN)',
    result: 'Glucosa sérica: 94 mg/dL | Urea: 28 mg/dL | BUN: 13 mg/dL | Creatinina sérica: 0.88 mg/dL (TFG >90 mL/min/1.73m²).',
    referenceRange: 'Glucosa: 70-100 mg/dL | Urea: 15-40 mg/dL | Creatinina: 0.6-1.2 mg/dL',
    interpretation: 'Metabolismo glucémico basal y función renal glomerular conservados.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-lipidos',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Perfil lipídico (Colesterol total, LDL, HDL, Triglicéridos)',
    result: 'Colesterol Total: 172 mg/dL | LDL calculado: 96 mg/dL | HDL: 52 mg/dL | Triglicéridos: 118 mg/dL.',
    referenceRange: 'Colesterol total < 200 mg/dL | LDL < 100 mg/dL | TG < 150 mg/dL',
    interpretation: 'Perfil lipídico sérico dentro de metas metabólicas normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-hba1c',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Hemoglobina Glucosilada (HbA1c)',
    result: 'HbA1c: 5.3%.',
    referenceRange: '< 5.7%',
    interpretation: 'Control glucémico trimestral dentro de parámetros normoglucémicos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-tiroideo',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Perfil tiroideo (TSH y T4 libre)',
    result: 'TSH ultrasensible: 2.15 mUI/L | T4 libre: 1.24 ng/dL.',
    referenceRange: 'TSH: 0.4-4.2 mUI/L | T4L: 0.8-1.8 ng/dL',
    interpretation: 'Estado eutiroideo; descarta disfunción tiroidea aguda como causa de síntomas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-acido-urico',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Ácido úrico sérico',
    result: 'Ácido úrico sérico: 5.1 mg/dL.',
    referenceRange: '3.5 - 7.2 mg/dL',
    interpretation: 'Concentración sérica de urato dentro de límites normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-amilasa',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Amilasa sérica',
    result: 'Amilasa sérica: 55 U/L.',
    referenceRange: '28 - 100 U/L',
    interpretation: 'Amilasa sérica dentro de límites fisiológicos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-amylase-lipase',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Lipasa sérica',
    result: 'Lipasa sérica: 34 U/L.',
    referenceRange: '13 - 60 U/L',
    interpretation: 'Lipasa sérica dentro de parámetros normales sin indicios de pancreatitis aguda.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ldh',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Lactato deshidrogenasa (LDH)',
    result: 'LDH sérica: 178 U/L.',
    referenceRange: '120 - 246 U/L',
    interpretation: 'Sin elevación indicativa de hemólisis intravascular o recambio celular acelerado.',
    isAbnormal: false,
  },
  {
    id: 'hosp-cpk',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Creatina fosfoquinasa (CPK total)',
    result: 'CPK total: 108 U/L.',
    referenceRange: '30 - 200 U/L',
    interpretation: 'Sin elevación indicativa de rabdomiólisis o lesión muscular esquelética.',
    isAbnormal: false,
  },
  {
    id: 'hosp-bhcg',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Fracción Beta de Gonadotropina Coriónica Humana (β-hCG cuantitativa)',
    result: 'β-hCG sérica: < 2.0 mUI/mL (Negativo).',
    referenceRange: 'Negativo (< 5.0 mUI/mL)',
    interpretation: 'Descarta embarazo en curso.',
    isAbnormal: false,
  },
  {
    id: 'hosp-cortisol',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Cortisol sérico basal',
    result: 'Cortisol sérico matutino (08:00 h): 13.4 mcg/dL.',
    referenceRange: '6.0 - 23.0 mcg/dL',
    interpretation: 'Cortisol basal matutino dentro de parámetros fisiológicos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-prolactina',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Prolactina sérica',
    result: 'Prolactina sérica: 11.8 ng/mL.',
    referenceRange: '4.8 - 23.3 ng/mL',
    interpretation: 'Niveles basales de prolactina dentro de rango normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-pth',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    name: 'Hormona Paratiroidea (PTH intacta)',
    result: 'PTH intacta: 34 pg/mL.',
    referenceRange: '15 - 65 pg/mL',
    interpretation: 'Secreción paratiroidea basal normal.',
    isAbnormal: false,
  },

  // ================= ELECTROLITOS =================
  {
    id: 'hosp-electrolitos',
    category: 'Laboratorio',
    subcategory: 'Electrolitos',
    name: 'Electrolitos séricos (Na⁺, K⁺, Cl⁻, Ca²⁺, Mg²⁺)',
    result: 'Sodio (Na⁺): 139 mEq/L | Potasio (K⁺): 4.1 mEq/L | Cloro (Cl⁻): 102 mEq/L | Calcio total: 9.3 mg/dL | Magnesio: 2.0 mg/dL.',
    referenceRange: 'Na⁺: 135-145 mEq/L | K⁺: 3.5-5.1 mEq/L | Cl⁻: 98-107 mEq/L | Ca²⁺: 8.5-10.5 mg/dL',
    interpretation: 'Equilibrio hidroelectrolítico sérico dentro de parámetros fisiológicos.',
    isAbnormal: false,
  },

  // ================= FUNCIÓN HEPÁTICA =================
  {
    id: 'hosp-perfil-hepatico',
    category: 'Laboratorio',
    subcategory: 'Función Hepática',
    name: 'Perfil hepático completo y bilirrubinas (TGO, TGP, FA, BT/BD, Albúmina)',
    result: 'AST (TGO): 24 U/L | ALT (TGP): 26 U/L | Fosfatasa Alcalina: 78 U/L | Bilirrubina Total: 0.7 mg/dL (Directa: 0.2 mg/dL, Indirecta: 0.5 mg/dL) | Albúmina sérica: 4.1 g/dL.',
    referenceRange: 'AST/ALT: <40 U/L | FA: 40-130 U/L | Bilirrubina Total: 0.2-1.2 mg/dL | Albúmina: 3.5-5.0 g/dL',
    interpretation: 'Sin evidencia de citólisis hepática, colestasis ni hipoalbuminemia.',
    isAbnormal: false,
  },

  // ================= GASES =================
  {
    id: 'hosp-gasometria',
    category: 'Laboratorio',
    subcategory: 'Gases',
    name: 'Gasometría arterial (GSA) y lactato sérico',
    result: 'pH: 7.40 | PaCO₂: 39 mmHg | PaO₂: 92 mmHg | HCO₃⁻: 24.0 mEq/L | Exceso de base: 0.0 mEq/L | SaO₂: 97% | Lactato: 1.1 mmol/L.',
    referenceRange: 'pH: 7.35-7.45 | PaCO₂: 35-45 mmHg | PaO₂: 80-100 mmHg | HCO₃⁻: 22-26 mEq/L | Lactato: <2.0 mmol/L',
    interpretation: 'Equilibrio ácido-base, oxigenación arterial y perfusión tisular dentro de la normalidad.',
    isAbnormal: false,
  },

  // ================= INFLAMACIÓN E INFECCIÓN =================
  {
    id: 'hosp-pcr-vsg',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Proteína C Reactiva (PCR) cuantitativa',
    result: 'Proteína C Reactiva (PCR): 3.2 mg/L.',
    referenceRange: '< 5.0 mg/L',
    interpretation: 'Sin elevación significativa de proteína C reactiva.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vsg',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Velocidad de Sedimentación Globular (VSG)',
    result: 'Velocidad de Sedimentación Globular (VSG): 10 mm/h.',
    referenceRange: '< 20 mm/h',
    interpretation: 'Velocidad de sedimentación globular dentro de parámetros basales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-procalcitonina',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Procalcitonina sérica',
    result: 'Procalcitonina sérica: 0.08 ng/mL.',
    referenceRange: '< 0.25 ng/mL',
    interpretation: 'Sin elevación sugestiva de infección bacteriana sistémica invasiva.',
    isAbnormal: false,
  },
  {
    id: 'hosp-panel-autoinmune',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Anticuerpos Antinucleares (ANA)',
    result: 'Anticuerpos Antinucleares (ANA por IFI HEp-2): Negativo (<1:40).',
    referenceRange: 'Negativo (< 1:80)',
    interpretation: 'Anticuerpos antinucleares negativos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-factor-reumatoide',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Factor Reumatoide (FR)',
    result: 'Factor Reumatoide (FR): <10 UI/mL.',
    referenceRange: '< 14 UI/mL',
    interpretation: 'Factor reumatoide en rango normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-anti-ccp',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Anticuerpos anti-péptido cíclico citrulinado (Anti-CCP)',
    result: 'Anti-CCP: <5 U/mL.',
    referenceRange: '< 20 U/mL',
    interpretation: 'Negativo para anticuerpos anti-péptido cíclico citrulinado.',
    isAbnormal: false,
  },
  {
    id: 'hosp-complemento',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    name: 'Complemento sérico (C3 y C4)',
    result: 'Complemento C3: 118 mg/dL | Complemento C4: 26 mg/dL.',
    referenceRange: 'C3: 90-180 mg/dL | C4: 10-40 mg/dL',
    interpretation: 'Fracciones de complemento C3 y C4 normocomplementémicas.',
    isAbnormal: false,
  },

  // ================= VITAMINAS Y NUTRICIÓN =================
  {
    id: 'hosp-vitamina-b12-folato',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Vitamina B12 sérica (Cobalamina)',
    result: 'Vitamina B12 sérica: 465 pg/mL.',
    referenceRange: '210 - 911 pg/mL',
    interpretation: 'Reservas séricas de cobalamina dentro de rango fisiológico normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-acido-folico',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Ácido fólico (Folato) sérico',
    result: 'Ácido fólico sérico: 11.4 ng/mL.',
    referenceRange: '3.8 - 20.0 ng/mL',
    interpretation: 'Concentración de folato sérico dentro de parámetros normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-homocisteina',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Homocisteína sérica total',
    result: 'Homocisteína total: 8.6 µmol/L.',
    referenceRange: '5 - 15 µmol/L',
    interpretation: 'Homocisteína sérica dentro de rango fisiológico.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vitamina-d',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Vitamina D (25-OH-Vitamina D total)',
    result: '25-hidroxivitamina D total: 35.4 ng/mL.',
    referenceRange: '30 - 100 ng/mL (suficiencia)',
    interpretation: 'Niveles suficientes de vitamina D circulante.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vitamina-b1-b6',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Vitamina B1 (Tiamina)',
    result: 'Vitamina B1 (Tiamina difosfato en sangre total): 94 nmol/L.',
    referenceRange: '70 - 180 nmol/L',
    interpretation: 'Niveles adecuados de tiamina sin déficit carencial.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vitamina-b6',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Vitamina B6 sérica (Piridoxal fosfato)',
    result: 'Vitamina B6 (PLP): 16.2 mcg/L.',
    referenceRange: '5 - 50 mcg/L',
    interpretation: 'Niveles adecuados de piridoxal 5-fosfato.',
    isAbnormal: false,
  },
  {
    id: 'hosp-perfil-vitaminas-liposolubles',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    name: 'Prealbúmina sérica',
    result: 'Prealbúmina sérica: 26 mg/dL.',
    referenceRange: '20 - 40 mg/dL',
    interpretation: 'Estado nutricional proteico visceral conservado.',
    isAbnormal: false,
  },

  // ================= CARDIOVASCULAR =================
  {
    id: 'hosp-troponin-i',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    name: 'Troponina I de alta sensibilidad (hs-cTnI)',
    result: 'Troponina I: <0.01 ng/mL (Dentro de límites basales normales).',
    referenceRange: '<0.04 ng/mL',
    interpretation: 'Sin elevación de biomarcadores de necrosis miocárdica.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ckmb',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    name: 'Fracción MB de Creatina Fosfoquinasa (CK-MB)',
    result: 'CK-MB masa: 13 U/L.',
    referenceRange: '0 - 25 U/L',
    interpretation: 'Enzima miocárdica dentro de rango fisiológico normal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-pro-bnp',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    name: 'Péptido Natriurético tipo B (NT-proBNP)',
    result: 'NT-proBNP sérico: 68 pg/mL.',
    referenceRange: '< 125 pg/mL (ambulatorio < 75 años) | < 300 pg/mL (descarte agudo)',
    interpretation: 'Valores normales con muy alto valor predictivo negativo para insuficiencia cardíaca congestiva aguda o crónica descompensada.',
    isAbnormal: false,
  },

  // ================= URINARIO =================
  {
    id: 'hosp-urinalysis-ego',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    name: 'Examen general de orina (EGO) con sedimento urinario',
    result: 'Color: Amarillo paja | Aspecto: Transparente | Densidad: 1.018 | pH: 6.0 | Proteínas: Negativo | Glucosa: Negativo | Cetonas: Negativo | Hemoglobina/Sangre: Negativo | Leucocitos: 1-2 por campo | Eritrocitos: 0-1 por campo | Bacterias: Escasas / No significativas | Nitritos: Negativo.',
    referenceRange: 'Sedimento limpio, proteinuria negativa, glucosuria negativa',
    interpretation: 'Urianálisis dentro de la normalidad sin sedimento activo ni signos de infección urinaria.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rac-orina',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    name: 'Cociente albúmina/creatinina en orina (CAC)',
    result: 'Cociente Albúmina/Creatinina en orina al azar: 12 mg/g.',
    referenceRange: '< 30 mg/g',
    interpretation: 'Excreción urinaria de albúmina dentro de límites normales (A1).',
    isAbnormal: false,
  },
  {
    id: 'hosp-toxicologico',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    name: 'Tamizaje toxicológico en orina',
    result: 'Panel de drogas de abuso en orina negativo para benzodiacepinas, opioides, cocaína, anfetaminas, cannabinoides y antidepresivos tricíclicos.',
    referenceRange: 'Negativo para drogas evaluadas',
    interpretation: 'Tamizaje toxicológico urinario negativo.',
    isAbnormal: false,
  },

  // ================= MICROBIOLOGÍA / SEROLOGÍA =================
  {
    id: 'hosp-urocultivo',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Urocultivo con recuento de colonias y antibiograma',
    result: 'Sin desarrollo bacteriano (< 1,000 UFC/mL a las 48 horas de incubación).',
    referenceRange: 'Negativo (< 10,000 UFC/mL)',
    interpretation: 'Descarta infección del tracto urinario bacteriana.',
    isAbnormal: false,
  },
  {
    id: 'hosp-blood-cultures',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Hemocultivos seriados pareados',
    result: 'Frascos 1 y 2 incubados a 37°C: Sin desarrollo bacteriano ni fúngico a las 24 y 48 horas de incubación.',
    referenceRange: 'Negativo / Sin crecimiento bacteriano',
    interpretation: 'Cultivo de sangre periférica negativo preliminar.',
    isAbnormal: false,
  },
  {
    id: 'hosp-coprologico',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Estudio coproparasitoscópico seriado',
    result: 'Coproparasitoscópico seriado (3 muestras): Negativo para quistes, trofozoítos o huevos de helmintos.',
    referenceRange: 'Negativo para parásitos intestinales',
    interpretation: 'Sin evidencia parasitológica en muestras seriadas de heces.',
    isAbnormal: false,
  },
  {
    id: 'hosp-soh',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Sangre oculta en heces (SOH)',
    result: 'Sangre oculta en heces (inmunológica): Negativa.',
    referenceRange: 'Negativo',
    interpretation: 'Sin evidencia de sangrado oculto gastrointestinal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-coprocultivo',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Coprocultivo',
    result: 'Coprocultivo: Flora entérica habitual sin aislamiento de Salmonella, Shigella ni Campylobacter.',
    referenceRange: 'Sin aislamiento de enteropatógenos',
    interpretation: 'Cultivo bacteriano fecal sin enteropatógenos invasivos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-strep',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Prueba rápida de antígeno estreptocócico faríngeo',
    result: 'Detección rápida de antígeno de Streptococcus pyogenes (grupo A): Negativo.',
    referenceRange: 'Negativo',
    interpretation: 'Sin evidencia rápida de faringitis estreptocócica del grupo A.',
    isAbnormal: false,
  },
  {
    id: 'hosp-hpylori',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Antígeno de Helicobacter pylori en heces',
    result: 'Antígeno monoclonal de H. pylori en heces: Negativo.',
    referenceRange: 'Negativo',
    interpretation: 'Sin evidencia de infección activa por Helicobacter pylori.',
    isAbnormal: false,
  },
  {
    id: 'hosp-vih',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Prueba de VIH (ELISA 4ª generación)',
    result: 'ELISA 4ª generación (Antígeno p24 y anticuerpos anti-VIH 1/2): No reactivo.',
    referenceRange: 'No reactivo / Negativo',
    interpretation: 'Sin evidencia serológica de infección por VIH.',
    isAbnormal: false,
  },
  {
    id: 'hosp-hepatitis-viral',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Panel viral de hepatitis aguda (VHA, VHB, VHC)',
    result: 'IgM anti-VHA: Negativo | HBsAg: No reactivo | IgM anti-HBc: Negativo | Anti-VHC: No reactivo.',
    referenceRange: 'No reactivo',
    interpretation: 'Sin evidencia serológica de hepatitis viral aguda A, B o C.',
    isAbnormal: false,
  },
  {
    id: 'hosp-arboviral-panel',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Panel de Serología e Inmunocromatografía Arboviral (Dengue NS1 / IgM / IgG)',
    result: 'Antígeno NS1: NO REACTIVO (Negativo) | Anticuerpos IgM: NEGATIVO | Anticuerpos IgG: NEGATIVO',
    referenceRange: 'Negativo / No reactivo',
    interpretation: 'Sin evidencia serológica de infección aguda reciente por virus Dengue ni otros flavivirus.',
    isAbnormal: false,
  },
  {
    id: 'hosp-malaria-smear',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Gota gruesa y frotis para hemoparásitos (Malaria)',
    result: 'Frotis y gota gruesa examinados al microscopio: NEGATIVO para hemoparásitos. No se observan trofozoítos, esquizontes ni gametocitos de Plasmodium (P. falciparum, P. vivax).',
    referenceRange: 'Negativo (Ausencia de parásitos)',
    interpretation: 'Descarte de paludismo / malaria activa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-leptospira-serology',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Serología IgM para Leptospira (ELISA / MAT)',
    result: 'Título de anticuerpos IgM para Leptospira: <1:100 (No reactivo).',
    referenceRange: 'No reactivo (<1:100)',
    interpretation: 'Sin evidencia de leptospirosis activa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-lumbar-puncture',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    name: 'Punción lumbar y análisis citoquímico y microbiológico de LCR',
    result: 'Aspecto: Cristal de roca límpido y transparente | Presión de apertura: 12 cmH2O | Leucocitos: 1 célula/mm³ (100% mononucleares) | Eritrocitos: 0/mm³ | Glucosa en LCR: 64 mg/dL (glucemia plasmática concomitante 96 mg/dL, relación 0.66) | Proteínas totales: 26 mg/dL | Tinción de Gram: Sin bacterias ni leucocitos polimorfonucleares.',
    referenceRange: 'Células: 0-5/mm³, Proteínas: 15-45 mg/dL, Glucosa: 60-70% de la glucemia central',
    interpretation: 'Líquido cefalorraquídeo normal sin inflamación meníngea.',
    isAbnormal: false,
  },

  // ================= RADIOLOGÍA =================
  {
    id: 'hosp-rx-torax',
    category: 'Imagen',
    subcategory: 'Radiología',
    name: 'Radiografía de tórax PA y lateral',
    result: 'Campos pulmonares adecuadamente expandidos y ventilados, sin consolidaciones alveolares, atelectasias ni infiltrados intersticiales. Ángulos costofrénicos y cardiofrénicos agudos y libres. Silueta cardiaca con índice cardiotorácico <0.50. Estructuras óseas torácicas íntegras.',
    referenceRange: 'Radiografía de tórax normal',
    interpretation: 'Estudio de tórax sin patología pleuropulmonar visible.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rx-abdomen',
    category: 'Imagen',
    subcategory: 'Radiología',
    name: 'Radiografía simple de abdomen (Bipedestación y decúbito)',
    result: 'Distribución habitual del gas intestinal en marco cólico y cámara gástrica. Sin dilatación patológica de asas de intestino delgado (<3 cm) ni grueso (<6 cm). Ausencia de niveles hidroaéreos en escalera. Sin evidencia de neumoperitoneo (no hay aire libre bajo las cúpulas diafragmáticas). Sombras de psoas conservadas.',
    referenceRange: 'Patrón de gas abdominal fisiológico, sin niveles ni aire libre',
    interpretation: 'Radiografía simple de abdomen dentro de límites normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rx-osea',
    category: 'Imagen',
    subcategory: 'Radiología',
    name: 'Radiografía Osteoarticular / Columna (Proyecciones AP y Lateral de región sintomática)',
    result: 'Alineación ósea conservada sin trazos de fractura aguda, luxación ni lesiones líticas o blásticas. Densidad mineral ósea acorde a la edad, espacios articulares e intervertebrales preservados sin colapso ni osteofitos compresivos graves. Tejidos blandos perilesionales sin aumento significativo de volumen ni gas.',
    referenceRange: 'Continuidad cortical y alineación osteoarticular conservadas sin fractura',
    interpretation: 'Estudio radiográfico óseo sin fractura aguda, luxación ni lesión destructiva.',
    isAbnormal: false,
  },

  // ================= ECOGRAFÍA =================
  {
    id: 'hosp-us-abdomen',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ultrasonido abdominal y pélvico enfocado',
    result: 'Hígado de tamaño y ecotextura homogénea normal. Vesícula biliar de paredes delgadas (<3 mm) sin litiasis ni signos inflamatorios. Vía biliar intra y extrahepática de calibre normal. Bazo y páncreas sin alteraciones. Riñones simétricos con adecuada relación córtico-medular, sin hidronefrosis. Vejiga urinaria homogénea. No se observa líquido libre en espacio de Morrison, esplenorrenal ni fondo de saco.',
    referenceRange: 'Eco abdominal completo sin hallazgos patológicos',
    interpretation: 'Ecografía abdominal dentro de parámetros normales sin colecciones ni líquido libre.',
    isAbnormal: false,
  },
  {
    id: 'hosp-us-renal',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ultrasonido renal y vesical',
    result: 'Riñones de tamaño y ecogenicidad cortical conservados, con adecuada diferenciación córtico-medular bilateral, sin hidronefrosis ni litiasis obstructiva. Vejiga urinaria de pared delgada y contenido homogéneo.',
    referenceRange: 'Parénquima renal normal sin dilatación pielocalicial',
    interpretation: 'Ecografía renal y vesical normal sin signos obstructivos.',
    isAbnormal: false,
  },
  {
    id: 'hosp-us-pelvico',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ultrasonido pélvico / transvaginal',
    result: 'Útero de dimensiones y miometrio homogéneo normal, endometrio lineal acorde a fase, ambos ovarios de morfología y volumen conservados sin masas anexiales ni líquido libre en fondo de saco.',
    referenceRange: 'Útero y anexos sin alteraciones estructurales',
    interpretation: 'Ecografía pélvica dentro de parámetros normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-doppler-venoso',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ultrasonido Doppler venoso de extremidades',
    result: 'Sistema venoso profundo femoral, poplíteo y tibial permeable, completamente compresible y con flujo fásico respiratorio conservado; sin signos de trombosis venosa profunda ni insuficiencia valvular significativa.',
    referenceRange: 'Permeabilidad y compresibilidad venosa normal al Doppler',
    interpretation: 'Estudio Doppler venoso negativo para trombosis venosa profunda.',
    isAbnormal: false,
  },
  {
    id: 'hosp-ecocardiograma',
    category: 'Imagen',
    subcategory: 'Ecografía',
    name: 'Ecocardiograma Transtorácico (ECOTT) con Doppler Color',
    result: 'Ventrículo izquierdo de diámetros y espesores parietales normales, motilidad segmentaria y global conservada con Fracción de Eyección (FEVI) de 62% (Simpson). Cavidades derechas de tamaño normal (TAPSE 22 mm, PSAP estimada 24 mmHg). Válvulas cardíacas normofuncionantes sin estenosis, insuficiencias significativas ni vegetaciones. Pericardio libre sin derrame.',
    referenceRange: 'FEVI ≥ 55%, cavidades y válvulas normofuncionantes sin derrame pericárdico',
    interpretation: 'Función sistodiastólica biventricular conservada sin valvulopatía aguda, hipertensión pulmonar ni derrame pericárdico.',
    isAbnormal: false,
  },

  // ================= TOMOGRAFÍA / RMN =================
  {
    id: 'hosp-tac-cranio',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Tomografía axial computarizada (TAC) simple de cráneo',
    result: 'Parénquima encefálico supratentorial e infratentorial con adecuada diferenciación de sustancia blanca y gris. Sin evidencia de hemorragias intra ni extraaxiales. Sin signos de isquemia territorial aguda reciente. Sistema ventricular de morfología y tamaño conservados, sin hidrocefalia. Cisternas basales permeables y simétricas. Sin desplazamiento de la línea media.',
    referenceRange: 'TAC simple de cráneo sin lesiones agudas',
    interpretation: 'Estudio de neuroimagen normal sin lesiones ocupantes de espacio ni hipertensión endocraneana evidente.',
    isAbnormal: false,
  },
  {
    id: 'hosp-tac-torax',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Tomografía computarizada (TAC / AngioTAC) de tórax con contraste',
    result: 'Parénquima pulmonar bien aireado sin consolidaciones, nódulos ni opacidades en vidrio deslustrado. Arterias pulmonares principales, lobares y segmentarias permeables sin defectos de repleción tromboembólicos. Mediastino centrado sin adenomegalias patológicas. Silueta cardíaca y aorta torácica de calibre normal. Sin derrame pleural ni pericárdico.',
    referenceRange: 'TAC / AngioTAC torácica dentro de límites normales',
    interpretation: 'Estudio tomográfico de tórax sin patología vascular ni parenquimatosa aguda.',
    isAbnormal: false,
  },
  {
    id: 'hosp-tac-abdomen',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Tomografía computarizada (TAC) de abdomen y pelvis con contraste',
    result: 'Órganos sólidos intraabdominales (hígado, bazo, páncreas, suprarrenales y riñones) captan contraste de forma homogénea sin lesiones focales. Asas intestinales con grosor parietal normal y adecuada repleción. Apéndice cecal de calibre normal (<6 mm) sin cambios inflamatorios circundantes. Ausencia de neumoperitoneo, colecciones o adenopatías retroperitoneales.',
    referenceRange: 'TAC abdominopélvica dentro de límites normales',
    interpretation: 'Estudio tomográfico de abdomen sin alteraciones patológicas agudas.',
    isAbnormal: false,
  },
  {
    id: 'hosp-rmn-craneo',
    category: 'Imagen',
    subcategory: 'Tomografía',
    name: 'Resonancia Magnética Nuclear (RMN) de encéfalo con difusión (DWI)',
    result: 'Secuencias T1, T2, FLAIR y DWI sin áreas de restricción a la difusión ni alteración aguda de señal parenquimatosa. Sin lesiones ocupantes de espacio, hemorragias ni realce leptomeníngeo patológico.',
    referenceRange: 'RMN cerebral sin alteraciones estructurales agudas',
    interpretation: 'Neuroimagen de alta resolución normal.',
    isAbnormal: false,
  },

  // ================= ELECTROCARDIOGRAMA / HOLTER / MAPA =================
  {
    id: 'hosp-ecg-12d',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
    result: 'Ritmo sinusal regular. Frecuencia cardíaca: 76 lpm. Onda P positiva en II, III y aVF (duración 90 ms). Intervalo PR: 150 ms. Eje eléctrico QRS: +45°. Complejos QRS de duración normal (80 ms). Segmento ST isoeléctrico en todas las derivaciones. Ondas T asimétricas y concordantes sin inversión isquémica. Intervalo QTc: 410 ms.',
    referenceRange: 'Trazado electrocardiográfico sinusal normal (60-100 lpm)',
    interpretation: 'ECG de 12 derivaciones dentro de límites fisiológicos normales.',
    isAbnormal: false,
  },
  {
    id: 'hosp-holter-24h',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Monitoreo Electrocardiográfico Ambulatorio Holter de 24 Horas',
    result: 'Ritmo sinusal predominante durante todo el registro (FC mínima 54 lpm en sueño, media 74 lpm, máxima 118 lpm en actividad). Extrasístoles supraventriculares aisladas (<0.1%), sin episodios de fibrilación auricular, taquicardia supraventricular ni ventricular sostenida, pausas >2.0 seg ni bloqueos AV avanzados. Sin cambios dinámicos isquémicos del segmento ST.',
    referenceRange: 'Ritmo sinusal continuo sin pausas >2.0 s ni taquiarritmias paroxísticas',
    interpretation: 'Monitoreo Holter de 24 h sin arritmias paroxísticas clínicamente significativas ni bloqueos intermitentes.',
    isAbnormal: false,
  },
  {
    id: 'hosp-holter-presion-mapa',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Holter de Presión Arterial / MAPA de 24 Horas (Monitoreo Ambulatorio de PA)',
    result: 'Promedio global 24 horas: 118/74 mmHg (FC media 74 lpm). Periodo diurno (07:00–22:00): 122/77 mmHg | Periodo nocturno (22:00–07:00): 106/65 mmHg. Descenso nocturno fisiológico (patrón dipper): 13.1% sistólico y 15.5% diastólico. Carga hipertensiva <15% sin picos hipertensivos ni hipotensión sintomática.',
    referenceRange: 'Prom. 24h < 130/80 mmHg | Diurno < 135/85 mmHg | Nocturno < 120/70 mmHg | Descenso nocturno dipper: 10–20%',
    interpretation: 'Perfil ambulatorio de presión arterial normotenso de 24 horas con ritmo circadiano dipper fisiológico conservado.',
    isAbnormal: false,
  },

  // ================= ELECTROMIOGRAFÍA Y NEUROFISIOLOGÍA =================
  {
    id: 'hosp-eeg',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Electroencefalograma (EEG) Convencional con Activación (Hiperventilación y Fotoestimulación)',
    result: 'Actividad de base posterior constituida por ritmo alfa dominante a 9.5–10.5 Hz, simétrico, bien modulado y reactivo a la apertura ocular. Regiones anteriores con ritmo beta de bajo voltaje. Durante hiperventilación y fotoestimulación intermitente no se registran complejos punta-onda, polipuntas, brotes paroxísticos epileptiformes ni asimetrías o enlentecimiento focal delta/theta.',
    referenceRange: 'Ritmo alfa posterior reactivo (8–13 Hz), sin actividad epileptiforme ni enlentecimiento focal',
    interpretation: 'Electroencefalograma dentro de parámetros fisiológicos normales para la edad; descarta actividad epileptiforme interictal o encefalopatía difusa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-emg-extremidades',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Electromiografía (EMG) de aguja y Velocidades de Conducción Nerviosa (VCN) de 4 extremidades',
    result: 'Neuroconducción motora y sensitiva (nervios mediano, cubital, peroneo, tibial y sural): latencias distales, amplitudes (CMAP/SNAP) y velocidades de conducción nerviosa (>48-55 m/s) simétricas y normales. Ondas F y reflejos H presentes con latencias conservadas. EMG con aguja concéntrica en músculos proximales y distales: silencio eléctrico en reposo (sin fibrilaciones ni ondas positivas agudas), potenciales de unidad motora (PUM) de morfología y reclutamiento normales.',
    referenceRange: 'VCN motoras ≥45 m/s (MS ≥50 m/s), sin actividad espontánea anormal en reposo',
    interpretation: 'Estudio electrofisiológico de conducción nerviosa y miografía dentro de la normalidad; descarta polineuropatía, radiculopatía o miopatía activa.',
    isAbnormal: false,
  },
  {
    id: 'hosp-emg-tunel-carpo',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Electromiografía focal y Neuroconducción de Nervio Mediano y Cubital (Miembro Superior)',
    result: 'Conducción sensitiva y motora de nervio mediano y cubital bilateral con latencias distales (<3.6 ms sensitiva, <4.2 ms motora), amplitudes y velocidades de conducción transcarpianas dentro de parámetros normales. EMG de músculo abductor corto del pulgar sin denervación.',
    referenceRange: 'Latencia distal motora mediano <4.2 ms, sensitiva pico <3.6 ms',
    interpretation: 'Sin evidencia electrofisiológica de atrapamiento del nervio mediano en túnel del carpo ni neuropatía cubital.',
    isAbnormal: false,
  },
  {
    id: 'hosp-emg-estimulacion-repetitiva',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Prueba de Estimulación Nerviosa Repetitiva (Test de Jolly) y Reflejos Tardíos (Onda F / Reflejo H)',
    result: 'Estimulación repetitiva a baja frecuencia (3 Hz) en nervio facial, accesorio espinal y cubital en reposo y post-ejercicio: sin decremento patológico del potencial compuesto (>10% ausente). Reflejos H en sóleo y ondas F con persistencia del 100% y latencias simétricas.',
    referenceRange: 'Decremento <10% en estimulación repetitiva; ondas F y reflejo H simétricos',
    interpretation: 'Transmisión de la placa neuromuscular y conducción radicular proximal conservadas; aleja miastenia gravis o bloqueo proximal.',
    isAbnormal: false,
  },
  {
    id: 'hosp-potenciales-evocados',
    category: 'Gabinete y Trazados',
    subcategory: 'Electromiografía y Neurofisiología',
    name: 'Potenciales Evocados Multimodales (Visuales PEV, Auditivos de Tronco PEATC y Somatosensoriales PESS)',
    result: 'PEV (patrón damero): onda P100 bilateral simétrica con latencias normales (101 ms OI, 102 ms OD). PEATC: ondas I, III y V presentes con intervalos interpico I-III, III-V y I-V conservados. PESS (nervio mediano y tibial posterior): latencias corticales N20 y P37 dentro de rangos normativos.',
    referenceRange: 'P100 < 115 ms, diferencias interoculares < 6 ms; conducción troncoencefálica y cordonal posterior normal',
    interpretation: 'Integridad funcional de vías visuales, auditivas de tronco encefálico y somatosensoriales centrales.',
    isAbnormal: false,
  },

  // ================= FUNCIÓN PULMONAR Y AUDIOLOGÍA =================
  {
    id: 'hosp-espirometria',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    name: 'Espirometría Basal y Prueba con Broncodilatador (FVC, FEV₁, Relación FEV₁/FVC)',
    result: 'Basal: FVC 96% del predicho | FEV₁ 94% del predicho | Relación FEV₁/FVC: 0.81 | FEF25-75%: 89%. Post-broncodilatador (400 mcg salbutamol): cambio en FEV₁ de +4% (+95 mL). Curva flujo-volumen de morfología normal sin amputación inspiratoria ni espiratoria.',
    referenceRange: 'FEV₁/FVC ≥ 0.70 (y > LIN), FVC y FEV₁ ≥ 80% del predicho; respuesta BD negativa (<12% y <200 mL)',
    interpretation: 'Mecánica ventilatoria y flujos espiratorios normales; descarta obstrucción crónica fija o hiperreactividad bronquial reversible.',
    isAbnormal: false,
  },
  {
    id: 'hosp-audiometria',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    name: 'Audiometría Tonal Liminar y Timpanometría (Impedanciometría)',
    result: 'Audiometría tonal: umbrales auditivos aéreos y óseos entre 10 y 20 dB HL en todas las frecuencias (250–8000 Hz) bilateralmente, sin brecha aéreo-ósea. Logoaudiometría: 100% de discriminación fonémica. Timpanometría: curvas tipo A bilaterales con reflejos estapediales presentes.',
    referenceRange: 'Umbrales ≤ 25 dB HL bilateral; curva timpanométrica tipo A',
    interpretation: 'Audición periférica bilateral y función de oído medio dentro de parámetros normales.',
    isAbnormal: false,
  },

  // ================= ENDOSCOPIA Y BRONCOSCOPIA =================
  {
    id: 'hosp-endoscopia-alta',
    category: 'Gabinete y Trazados',
    subcategory: 'Endoscopia y Broncoscopia',
    name: 'Endoscopia Digestiva Alta (Panendoscopia / Esofagogastroduodenoscopia)',
    result: 'Esófago de calibre y mucosa rosada normal, línea Z íntegra a 38 cm de la arcada dental sin esofagitis, úlceras ni várices. Estómago con pliegues distensibles y mucosa fúndica, corporal y antral conservada sin sangrado activo ni lesiones. Bulbo y segunda porción duodenal sin lesiones. Test rápido de ureasa negativo.',
    referenceRange: 'Mucosa esofagogastroduodenal íntegra sin sangrado ni lesiones',
    interpretation: 'Panendoscopia dentro de parámetros normales; descarta sangrado digestivo alto, úlcera péptica o esofagitis erosiva.',
    isAbnormal: false,
  },
  {
    id: 'hosp-colonoscopia',
    category: 'Gabinete y Trazados',
    subcategory: 'Endoscopia y Broncoscopia',
    name: 'Colonoscopia Total con Ileoscopia Distal',
    result: 'Progresión completa hasta ciego e íleon terminal (preparación Boston 9/9). Mucosa de recto, sigmoides, colon descendente, transverso, ascendente y ciego con patrón vascular conservado, sin úlceras, pólipos, masas, divertículos complicados ni estigmas de sangrado activo. Canal anal sin hemorroides sangrantes.',
    referenceRange: 'Mucosa colónica e ileal distal sin lesiones estructurales ni inflamatorias',
    interpretation: 'Colonoscopia normal; descarta enfermedad inflamatoria intestinal, pólipos, neoplasia o hemorragia digestiva baja.',
    isAbnormal: false,
  },
  {
    id: 'hosp-broncoscopia',
    category: 'Gabinete y Trazados',
    subcategory: 'Endoscopia y Broncoscopia',
    name: 'Broncoscopia Flexible (Fibrobroncoscopia) con Lavado Broncoalveolar',
    result: 'Cuerdas vocales móviles y simétricas. Tráquea y carina principal centradas y agudas. Árbol bronquial bilateral permeable hasta subsegmentos sin cuerpos extraños, estenosis, masas endobronquiales ni sangrado activo. Lavado broncoalveolar (BAL) límpido con recuento celular normal y tinciones microbiológicas negativas.',
    referenceRange: 'Vía aérea traqueobronquial permeable sin obstrucción, infección ni sangrado',
    interpretation: 'Fibrobroncoscopia normal; descarta lesión endobronquial, cuerpo extraño, hemorragia alveolar u obstrucción bronquial.',
    isAbnormal: false,
  },
];

/**
 * Mapa de hallazgos anatómicos, gasométricos y bioquímicos relacionados por caso clínico
 * cuando se solicita un estudio secundario o de práctica clínica diaria.
 */
const RELATED_STUDY_OVERRIDES: Record<string, Record<string, Partial<ComplementaryStudy>>> = {
  'case-dengue-alarm': {
    'hosp-gasometria': {
      result: 'pH: 7.31 | PaCO₂: 31 mmHg | PaO₂: 88 mmHg | HCO₃⁻: 16.5 mEq/L | Lactato: 3.4 mmol/L | SaO₂: 96%.',
      interpretation: 'Acidosis metabólica hiperlactatémica leve-moderada por hipoperfusión tisular incipiente secundaria a extravasación plasmática.',
      isAbnormal: true,
    },
    'hosp-pcr-vsg': {
      result: 'Proteína C Reactiva (PCR): 28 mg/L (elevación leve-moderada).',
      interpretation: 'Elevación discreta compatible con proceso viral agudo con compromiso endotelial (contrastando con PCR >100 mg/L típica de sepsis bacteriana).',
      isAbnormal: true,
    },
    'hosp-vsg': {
      result: 'Velocidad de Sedimentación Globular (VSG): 14 mm/h (normal/baja por hemoconcentración).',
      interpretation: 'VSG no elevada por hemoconcentración durante fase crítica viral.',
      isAbnormal: false,
    },
    'hosp-tac-abdomen': {
      result: 'Hepatomegalia homogénea leve (lóbulo derecho 16.4 cm) con edema periportal. Engrosamiento laminar edematoso de la pared vesicular (5.5 mm) con aspecto en "capas de cebolla", sin cálculos ni dilatación biliar. Escasa a moderada cantidad de líquido libre laminar (ascitis) en espacio hepatorrenal de Morrison, correderas parietocólicas y fondo de saco pélvico. En los cortes basales torácicos incluidos se evidencia derrame pleural laminar derecho.',
      interpretation: 'Hallazgos tomográficos clásicos de extravasación plasmática sistémica y serositis leve propios de la fase crítica viral; explica el dolor en hipocondrio derecho sin requerir cirugía biliar.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Derrame pleural bilateral de predominio derecho laminar a moderado con atelectasia pasiva subsegmentaria bibasal. Sin consolidaciones infecciosas lobares ni tromboembolismo pulmonar.',
      interpretation: 'Extravasación plasmática a cavidad pleural (serositis) coherente con síndrome de fuga capilar sistémica.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 14.3 seg (INR: 1.18) | TTPa: 41.2 seg (Control: 30.0 seg) | Fibrinógeno: 210 mg/dL.',
      interpretation: 'Prolongación moderada del TTPa e INR limítrofe con tendencia a consumo de factores y hepatopatía viral leve, lo que incrementa el riesgo hemorrágico ante AINEs o procedimientos invasivos.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Densidad urinaria: 1.030 (elevada) | Aspecto: Ámbar concentrado | Proteínas: Trazas (+) | Cetonas: (+) | Sangre/Eritrocitos: 3-5 por campo (microhematuria leve) | Nitritos: Negativo.',
      interpretation: 'Orina altamente concentrada por hemoconcentración e hipovolemia intravascular, con proteinuria transitoria y microhematuria discreta.',
      isAbnormal: true,
    },
  },
  'case-apendicitis-aguda': {
    'hosp-gasometria': {
      result: 'pH: 7.42 | PaCO₂: 37 mmHg | PaO₂: 94 mmHg | HCO₃⁻: 23.5 mEq/L | Lactato: 1.5 mmol/L.',
      interpretation: 'Equilibrio ácido-base y lactato conservados; sin acidosis ni sepsis severa aún establecida.',
      isAbnormal: false,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 138 mEq/L | K⁺: 3.4 mEq/L (discretamente bajo por vómitos) | Cl⁻: 99 mEq/L.',
      interpretation: 'Hipokalemia leve secundaria a emesis e intolerancia oral; requiere reposición en hidratación parenteral prequirúrgica.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Apéndice cecal retrocecal/pélvico dilatado de 11 mm de diámetro externo, pared engrosada (4 mm) con hiperrealce mucoso tras contraste IV, presencia de apendicolito calcificado proximal de 5 mm, intensa estriación de la grasa mesentérica en fosa ilíaca derecha y múltiples ganglios mesentéricos reactivos (<10 mm). Sin colecciones abscedadas ni aire libre extraluminal.',
      interpretation: 'Tomografía con signos inequívocos de inflamación apendicular aguda no perforada y linfadenitis mesentérica reactiva.',
      isAbnormal: true,
    },
    'hosp-rx-abdomen': {
      result: 'Presencia de asa centinela discretamente distendida con nivel hidroaéreo aislado en fosa ilíaca derecha, imagen radioopaca cálcica redondeada en cuadrante inferior derecho y borramiento focal del borde inferior del músculo psoas derecho. Sin aire libre subdiafragmático.',
      interpretation: 'Signos radiológicos indirectos de íleo reflejo localizado en cuadrante inferior derecho secundario a proceso inflamatorio peritoneal focal.',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 620 ng/mL FEU.',
      interpretation: 'Elevación leve inespecífica como reactante secundario a inflamación peritoneal aguda, sin significado tromboembólico primario.',
      isAbnormal: true,
    },
  },
  'case-iamcest-anterior': {
    'hosp-gasometria': {
      result: 'pH: 7.36 | PaCO₂: 34 mmHg | PaO₂: 68 mmHg | HCO₃⁻: 19.2 mEq/L | Lactato: 2.8 mmol/L | SaO₂: 92%.',
      interpretation: 'Hipoxemia arterial leve e hiperlactatemia inicial por congestión venocapilar pulmonar aguda y reducción del gasto cardíaco (Killip II).',
      isAbnormal: true,
    },
    'hosp-quimica-basica': {
      result: 'Glucosa sérica: 158 mg/dL (hiperglucemia por estrés adrenérgico) | Urea: 38 mg/dL | Creatinina: 1.15 mg/dL.',
      interpretation: 'Hiperglucemia reactiva al estrés coronario agudo (sin antecedente previo de diabetes) y función renal basal preservada.',
      isAbnormal: true,
    },
    'hosp-perfil-hepatico': {
      result: 'AST (TGO): 96 U/L (elevada de origen predominantemente miocárdico) | ALT (TGP): 34 U/L | Bilirrubina Total: 0.9 mg/dL | Albúmina: 4.0 g/dL.',
      interpretation: 'Elevación aislada de AST (TGO) por liberación enzimática desde miocito necrótico con ALT normal.',
      isAbnormal: true,
    },
    'hosp-ckmb': {
      result: 'CK-MB masa: 74 U/L (Índice CK-MB/CK total > 6%).',
      interpretation: 'Elevación significativa paralela a necrosis miocárdica aguda en evolución.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Cardiomegalia global leve. Extensas placas ateromatosas calcificadas en el segmento proximal de la arteria coronaria descendente anterior y tronco izquierdo. Edema intersticial septal perihiliar bilateral y leve derrame pleural laminar bilateral por congestión venocapilar pulmonar. Arterias pulmonares principales permeables sin tromboembolismo; aorta torácica con ateromatosis sin disección.',
      interpretation: 'Descarta disección aórtica y tromboembolia pulmonar, evidenciando cardiopatía ateroesclerótica calcificada y edema pulmonar incipiente (Killip II).',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Congestión venosa pasiva hepática leve (dilatación discreta de venas suprahepáticas y vena cava inferior) secundaria a disfunción ventricular aguda. Ateromatosis calcificada de aorta abdominal y ramas ilíacas. Sin patología quirúrgica ni isquemia mesentérica.',
      interpretation: 'Hallazgos abdominales secundarios a repercusión hemodinámica retrógrada y enfermedad aterosclerótica sistémica.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Color amarillo oscuro | Densidad 1.024 | Proteínas: Trazas | Sedimento limpio sin infección.',
      interpretation: 'Concentración urinaria secundaria a descarga adrenérgica y respuesta neurohormonal al bajo gasto cardíaco.',
      isAbnormal: false,
    },
    'hosp-ecocardiograma': {
      result: 'Hipocinesia severa / acinesia de pared anterior y ápex del ventrículo izquierdo con disfunción sistólica moderada (FEVI estimada: 42%). Sin trombo apical ni derrame pericárdico significativo.',
      interpretation: 'Trastorno focal de motilidad en territorio de arteria descendente anterior acorde con IAMCEST anterior en curso.',
      isAbnormal: true,
    },
    'hosp-pro-bnp': {
      result: 'NT-proBNP sérico: 1,450 pg/mL (ELEVADO).',
      interpretation: 'Elevación por disfunción ventricular aguda e incremento de presión telediastólica tras isquemia miocárdica extensa.',
      isAbnormal: true,
    },
    'hosp-hba1c': {
      result: 'HbA1c: 6.3% (rango de prediabetes).',
      interpretation: 'Intolerancia glucémica crónica asociada a riesgo cardiovascular.',
      isAbnormal: true,
    },
    'hosp-perfil-lipidos': {
      result: 'Colesterol Total: 248 mg/dL | LDL: 168 mg/dL (ALTO) | HDL: 34 mg/dL (bajo) | Triglicéridos: 215 mg/dL.',
      interpretation: 'Dislipidemia aterogénica severa como factor de riesgo coronario mayor.',
      isAbnormal: true,
    },
  },
  'case-cetoacidosis-diabetica': {
    'hosp-hemograma': {
      result: 'Leucocitos: 15,800 /mm³ (Neutrófilos 78% sin cayados) | Hemoglobina: 15.6 g/dL | Hematocrito: 47.0% | Plaquetas: 310,000 /mm³.',
      interpretation: 'Leucocitosis reactiva moderada secundaria a descarga adrenérgica/cortisol en cetoacidosis (frecuente incluso sin infección bacteriana severa) y hemoconcentración por deshidratación severa.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Distensión hidroaérea leve difusa de cámara gástrica y asas de intestino delgado por íleo metabólico funcional, sin punto de transición mecánica. Riñones aumentados discretamente de volumen con hipercaptación cortical simétrica secundaria a diuresis osmótica intensa. Apéndice normal, páncreas homogéneo sin necrosis ni colecciones.',
      interpretation: 'Íleo adinámico metabólico (que explica el dolor abdominal agudo o "pseudoperitonitis") descartando abdomen quirúrgico verdadero como apendicitis o pancreatitis.',
      isAbnormal: true,
    },
    'hosp-amilasa': {
      result: 'Amilasa sérica: 158 U/L (discretamente elevada).',
      interpretation: 'Hiperamilasemia leve inespecífica frecuente en deshidratación y acidosis metabólica severa (aclaramiento renal reducido y origen salival/metabólico).',
      isAbnormal: true,
    },
    'hosp-amylase-lipase': {
      result: 'Lipasa sérica: 38 U/L (normal).',
      interpretation: 'Lipasa normal que descarta pancreatitis aguda verdadera.',
      isAbnormal: false,
    },
    'hosp-rx-torax': {
      result: 'Campos pulmonares hiperventilados con volúmenes pulmonares amplios secundarios a taquipnea/polipnea compensatoria profunda, sin consolidaciones ni neumotórax.',
      interpretation: 'Descarta foco infeccioso neumónico grave en lóbulos pulmonares, compatible con hiperventilación compensatoria de acidosis metabólica.',
      isAbnormal: false,
    },
  },
  'case-meningitis-bacteriana': {
    'hosp-gasometria': {
      result: 'pH: 7.29 | PaCO₂: 29 mmHg | PaO₂: 84 mmHg | HCO₃⁻: 15.0 mEq/L | Lactato: 3.9 mmol/L.',
      interpretation: 'Acidosis metabólica con hiperlactatemia significativa indicativa de sepsis bacteriana sistémica.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 131 mEq/L (hiponatremia leve por SIADH) | K⁺: 3.7 mEq/L | Cl⁻: 96 mEq/L | Calcio: 8.4 mg/dL.',
      interpretation: 'Hiponatremia leve frecuente por secreción inadecuada de hormona antidiurética (SIADH) asociada a inflamación meníngea.',
      isAbnormal: true,
    },
    'hosp-tac-cranio': {
      result: 'Edema cerebral difuso leve manifestado por discreto borramiento de los surcos corticales de la convexidad cerebral y leve compresión de las astas frontales ventriculares, manteniendo cisternas basales visibles y permeables sin herniación ni desplazamiento de línea media. Ocupación inflamatoria mucosa de celdillas etmoidales y seno esfenoidal izquierdo (probable foco contiguo de vía aérea superior). Sin hemorragias ni abscesos.',
      interpretation: 'Edema cerebral incipiente y sinusitis paranasal asociada como puerta de entrada; confirma ausencia de efecto de masa que contraindique punción lumbar inmediata.',
      isAbnormal: true,
    },
    'hosp-rmn-craneo': {
      result: 'Realce leptomeníngeo difuso tras gadolinio en surcos de la convexidad bilateral y ocupación mucosa esfenoetmoidal; sin trombosis de senos venosos ni absceso cerebral parenquimatoso.',
      interpretation: 'Confirma inflamación leptomeníngea difusa y descarta empiema o infarto venoso.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 15.1 seg (INR: 1.28) | TTPa: 38.4 seg | Fibrinógeno: 185 mg/dL.',
      interpretation: 'Coagulopatía de consumo incipiente asociada a bacteriemia e injuria endotelial sistémica.',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 1,420 ng/mL FEU.',
      interpretation: 'Elevación marcada por activación endotelial inflamatoria sistémica y riesgo de coagulación intravascular diseminada temprana (relacionado con las petequias cutáneas).',
      isAbnormal: true,
    },
    'hosp-eeg': {
      result: 'Enlentecimiento difuso bilateral de la actividad eléctrica de fondo en rangos theta (4-6 Hz) y delta intermitente de predominio frontotemporal sin descargas epileptiformes francas ni asimetría de foco estructural.',
      interpretation: 'Patrón electroencefalográfico de encefalopatía aguda infecciosa/metabólica concordante con compromiso inflamatorio meningoencefálico.',
      isAbnormal: true,
    },
  },
  'case-neumonia-adquirida': {
    'hosp-pcr-vsg': {
      result: 'Proteína C Reactiva (PCR): 194 mg/L (marcadamente elevada).',
      interpretation: 'Elevación severa característica de infección bacteriana invasiva parenquimatosa.',
      isAbnormal: true,
    },
    'hosp-vsg': {
      result: 'Velocidad de Sedimentación Globular (VSG): 68 mm/h.',
      interpretation: 'Elevación significativa concordante con respuesta inflamatoria aguda.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 132 mEq/L (hiponatremia leve) | K⁺: 4.0 mEq/L | Cl⁻: 97 mEq/L.',
      interpretation: 'Hiponatremia leve frecuente en neumonía lobar neumocócica por liberación no osmótica de ADH.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Consolidación alveolar densa y extensa del lóbulo inferior derecho con broncograma aéreo prominente, nódulos centrolobulillares satélites ramificados en lóbulo medio y derrame pleural paraneumónico derecho libre laminar (8 mm). Enfisema centrolobulillar leve apical bilateral acorde a antecedente tabáquico.',
      interpretation: 'Confirma neumonía lobar derecha extensa con derrame paraneumónico no loculado sobre pulmón con cambios enfisematosos crónicos.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'En los cortes torácicos inferiores incluidos en el barrido se identifica opacidad alveolar con broncograma aéreo basal derecha y derrame pleural laminar ipsilateral. Órganos abdominales (hígado, vesícula, páncreas, bazo y apéndice) de morfología conservada sin colecciones ni cambios inflamatorios.',
      interpretation: 'Explica el dolor referido hacia hipocondrio/flanco derecho por irritación pleural diafragmática basal.',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 840 ng/mL FEU.',
      interpretation: 'Elevación reactiva moderada secundaria a proceso infeccioso pulmonar severo e inflamación sistémica (reactante inespecífico; no confirma TEP por sí solo).',
      isAbnormal: true,
    },
    'hosp-troponin-i': {
      result: 'Troponina I: 0.048 ng/mL (discretamente limítrofe).',
      interpretation: 'Injuria miocárdica aguda leve tipo 2 secundaria al estrés hipóxico, fiebre y taquicardia en paciente anciana; sin patrón isquémico coronario agudo.',
      isAbnormal: true,
    },
    'hosp-vitamina-d': {
      result: '25-OH-Vitamina D total: 14.2 ng/mL (DEFICIENCIA).',
      interpretation: 'Deficiencia de vitamina D concordante con edad avanzada y osteoporosis previa.',
      isAbnormal: true,
    },
    'hosp-pth': {
      result: 'PTH intacta: 74 pg/mL (elevación compensatoria leve).',
      interpretation: 'Hiperparatiroidismo secundario leve por deficiencia de vitamina D.',
      isAbnormal: true,
    },
    'hosp-broncoscopia': {
      result: 'Eritema e inflamación intensa de mucosa en bronquio lobar inferior derecho con abundantes secreciones mucopurulentas espesas obstruyendo subsegmentos basales. Lavado broncoalveolar (BAL): >90% neutrófilos y diplococos Gram positivos encapsulados.',
      interpretation: 'Bronquitis purulenta lobar inferior derecha con confirmación microbiológica de neumococo en lavado broncoalveolar.',
      isAbnormal: true,
    },
  },
  'case-pancreatitis-gastro': {
    'hosp-gasometria': {
      result: 'pH: 7.35 | PaCO₂: 33 mmHg | PaO₂: 76 mmHg | HCO₃⁻: 18.8 mEq/L | Lactato: 2.4 mmol/L.',
      interpretation: 'Acidosis metabólica leve e hipoxemia discreta por secuestro de líquidos en tercer espacio y atelectasia basal reactiva.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 136 mEq/L | K⁺: 3.6 mEq/L | Calcio sérico total: 7.8 mg/dL (hipocalcemia leve) | Magnesio: 1.6 mg/dL.',
      interpretation: 'Hipocalcemia leve característica de pancreatitis aguda por saponificación del calcio con ácidos grasos libres en necrosis grasa peripancreática.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Páncreas aumentado difusamente de tamaño con bordes mal definidos, disminución heterogénea del realce parenquimatoso y extensa estriación inflamatoria de la grasa peripancreática con colección líquida laminar en espacio pararrenal anterior izquierdo (Índice Balthazar Grado C-D). Vesícula biliar con múltiples imágenes litiásicas hiperdensas en su interior y dilatación leve del colédoco distal (8 mm).',
      interpretation: 'Hallazgos tomográficos compatibles con inflamación pancreática aguda moderada-severa de origen litiásico biliar sin necrosis parenquimatosa extensa aún establecida.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Elevación discreta del hemidiafragma izquierdo, atelectasia laminar basal izquierda y mínimo derrame pleural izquierdo reactivo.',
      interpretation: 'Complicación pleuropulmonar simpática frecuente por contigüidad inflamatoria subdiafragmática izquierda.',
      isAbnormal: true,
    },
  },
  'case-pediatria-bronquiolitis': {
    'hosp-gasometria': {
      result: 'pH: 7.33 | PaCO₂: 47 mmHg | PaO₂: 62 mmHg | HCO₃⁻: 24.5 mEq/L | Lactato: 1.9 mmol/L | SaO₂: 89%.',
      interpretation: 'Hipoxemia e hipercapnia incipiente (acidosis respiratoria leve) que señala fatiga ventilatoria y necesidad inmediata de oxígeno húmedo / alto flujo.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Hiperinsuflación pulmonar bilateral (horizontalización de arcos costales y abatimiento diafragmático, 9 espacios intercostales visibles), engrosamiento peribronquial parahiliar bilateral y pequeña atelectasia subsegmentaria en lóbulo superior derecho por tapón mucoso.',
      interpretation: 'Atrapamiento aéreo y atelectasia subsegmentaria típicos de obstrucción bronquiolar viral aguda en lactantes.',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'Patrón en mosaico por atrapamiento aéreo difuso bilateral, engrosamiento difuso de paredes bronquiolares y tapones mucosos periféricos en lóbulo superior derecho.',
      interpretation: 'Confirma compromiso bronquiolar viral difuso (Nota clínica: en lactantes la TAC no es de rutina por radiación, reservándose solo para dudas o complicaciones graves).',
      isAbnormal: true,
    },
  },
  'case-nefrologia-lra': {
    'hosp-hemograma': {
      result: 'Leucocitos: 7,900 /mm³ | Hemoglobina: 10.6 g/dL (normocítica normocrómica leve) | Hematocrito: 32.1% | Plaquetas: 220,000 /mm³.',
      interpretation: 'Anemia normocítica leve compatible con vulnerabilidad renal previa/enfermedad crónica subyacente.',
      isAbnormal: true,
    },
    'hosp-gasometria': {
      result: 'pH: 7.26 | PaCO₂: 28 mmHg | PaO₂: 86 mmHg | HCO₃⁻: 13.5 mEq/L | Lactato: 1.6 mmol/L.',
      interpretation: 'Acidosis metabólica moderada-severa por incapacidad renal de excretar ácidos fijos e hiperpotasemia acompañante.',
      isAbnormal: true,
    },
    'hosp-us-abdomen': {
      result: 'Ambos riñones de tamaño conservado (10.2 cm) con incremento difuso de la ecogenicidad cortical bilateral y pérdida parcial de la diferenciación corticomedular. Ausencia de dilatación pielocalicial ni litiasis obstructiva. Vena cava inferior pletórica (>2.2 cm sin colapso inspiratorio) y discreta congestión venosa hepática.',
      interpretation: 'Descarta uropatía obstructiva; evidencia daño parenquimatoso renal agudo/agudizado y sobrecarga hídrica intravascular.',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Riñones con nefrograma cortical tardío simétrico y ausencia de obstrucción ureteral o hidronefrosis. Escaso líquido libre laminar pélvico y derrame pleural basal bilateral incipiente por retención hidrosalina.',
      interpretation: 'Refuerza nefropatía parenquimatosa bilateral no obstructiva con signos incipientes de sobrecarga de volumen.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Redistribución de flujo vascular hacia lóbulos superiores, cardiomegalia leve y borramiento de ángulos costofrénicos por derrame pleural laminar bilateral.',
      interpretation: 'Signos tempranos de congestión vascular pulmonar secundaria a oliguria/retención hídrica.',
      isAbnormal: true,
    },
    'hosp-vitamina-d': {
      result: '25-OH-Vitamina D total: 16.5 ng/mL (INSUFICIENCIA).',
      interpretation: 'Insuficiencia de vitamina D por menor hidroxilación renal 1-alfa.',
      isAbnormal: true,
    },
    'hosp-pth': {
      result: 'PTH intacta: 118 pg/mL.',
      interpretation: 'Hiperparatiroidismo secundario por deterioro de función renal.',
      isAbnormal: true,
    },
  },
  'case-ginecologia-ectopico': {
    'hosp-gasometria': {
      result: 'pH: 7.28 | PaCO₂: 29 mmHg | PaO₂: 91 mmHg | HCO₃⁻: 14.5 mEq/L | Lactato: 4.2 mmol/L.',
      interpretation: 'Acidosis metabólica láctica por hipoperfusión secundaria a hemorragia interna aguda (choque hipovolémico).',
      isAbnormal: true,
    },
    'hosp-tac-abdomen': {
      result: 'Abundante líquido libre de alta atenuación (45-60 Unidades Hounsfield) distribuido en fondo de saco de Douglas, gotieras parietocólicas y espacio hepatorrenal de Morrison. En pelvis derecha se identifica masa anexial heterogénea compleja con realce periférico y útero vacío de tamaño normal.',
      interpretation: 'Confirma hemoperitoneo activo moderado-severo secundario a patología anexial derecha rota; exige intervención quirúrgica inmediata.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 13.8 seg | TTPa: 33.5 seg | Fibrinógeno: 175 mg/dL (limítrofe bajo por consumo agudo en sangrado cavitario).',
      interpretation: 'Fibrinógeno en descenso progresivo secundario a hemorragia interna activa; requiere tipificación y reserva de hemoderivados.',
      isAbnormal: true,
    },
  },
  'case-traumatologia-compartimental': {
    'hosp-gasometria': {
      result: 'pH: 7.34 | PaCO₂: 35 mmHg | PaO₂: 92 mmHg | HCO₃⁻: 19.0 mEq/L | Lactato: 3.1 mmol/L.',
      interpretation: 'Hiperlactatemia moderada secundaria a metabolismo anaerobio por isquemia muscular compartimental.',
      isAbnormal: true,
    },
    'hosp-electrolitos': {
      result: 'Na⁺: 138 mEq/L | K⁺: 5.4 mEq/L (hiperpotasemia leve incipiente) | Calcio: 8.3 mg/dL | Fósforo: 5.1 mg/dL.',
      interpretation: 'Elevación incipiente de potasio y fósforo por lisis de miocitos isquémicos (rabdomiólisis); vigilar arritmias al descomprimir el compartimento.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Color: Rojizo-café oscuro ("agua de lavado de carne") | Tira reactiva para Sangre/Hemo: POSITIVO (+++) | Microscopía de sedimento: 0-1 eritrocitos por campo (discordancia hemo/eritrocitos). Proteínas: (+).',
      interpretation: 'Mioglobinuria severa secundaria a rabdomiólisis por isquemia y necrosis muscular progresiva (alerta riesgo inminente de necrosis tubular aguda renal).',
      isAbnormal: true,
    },
    'hosp-dimer-d': {
      result: 'Dímero D: 980 ng/mL FEU.',
      interpretation: 'Elevación secundaria al trauma tisular extenso y estasis venosa compresiva de la extremidad; debe diferenciarse clínicamente de trombosis venosa profunda.',
      isAbnormal: true,
    },
    'hosp-coagulation': {
      result: 'TP: 13.0 seg | TTPa: 31.0 seg | Fibrinógeno: 390 mg/dL (reactante de fase aguda post-trauma).',
      interpretation: 'Parámetros prequirúrgicos basales aptos para fasciotomía descompresiva urgente.',
      isAbnormal: false,
    },
    'hosp-emg-extremidades': {
      result: 'Miembro pélvico derecho afectado: reducción marcada de amplitudes de potenciales motores compuestos (CMAP) en nervios peroneo profundo y tibial posterior (<0.8 mV) con bloqueo de conducción focal en compartimento anterior/lateral de pierna; miembro contralateral normal.',
      interpretation: 'Neuropraxia/axonotmesis isquémica aguda secundaria a compresión nerviosa intracompartimental (nota: NO retrasar la fasciotomía urgente esperando electrofisiología).',
      isAbnormal: true,
    },
  },
  'case-dermatologia-stevens-johnson': {
    'hosp-hemograma': {
      result: 'Leucocitos: 11,800 /mm³ (Linfocitosis reactiva 42%, eosinófilos 7%) | Hemoglobina: 13.5 g/dL | Plaquetas: 265,000 /mm³.',
      interpretation: 'Leucocitosis reactiva con eosinofilia leve compatible con reacción de hipersensibilidad farmacológica severa.',
      isAbnormal: true,
    },
    'hosp-perfil-hepatico': {
      result: 'AST (TGO): 64 U/L | ALT (TGP): 72 U/L | Bilirrubina Total: 1.0 mg/dL | Albúmina: 3.3 g/dL.',
      interpretation: 'Discreta elevación de transaminasas e hipoalbuminemia leve por reacción sistémica medicamentosa y pérdida epidérmica.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Infiltrado intersticial reticular fino peribroncovascular bilateral incipiente sin consolidación franca ni derrame.',
      interpretation: 'Vigilancia obligada: puede reflejar compromiso inflamatorio incipiente de mucosa traqueobronquial asociado a reacción mucocutánea severa.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Densidad 1.026 | Leucocitos: 10-15 por campo | Eritrocitos: 4-6 por campo | Nitritos: Negativo | Bacterias: Ausentes.',
      interpretation: 'Leucocituria estéril e irritación uretral compatibles con afectación descamativa de mucosas urogenitales.',
      isAbnormal: true,
    },
    'hosp-broncoscopia': {
      result: 'Mucosa laríngea y traqueobronquial proximal con eritema difuso, edema leve y pequeñas áreas parcheadas de desepitelización mucocutánea sin obstrucción crítica ni cuerpo extraño.',
      interpretation: 'Compromiso inflamatorio mucoso traqueobronquial incipiente secundario a reacción medicamentosa sistémica.',
      isAbnormal: true,
    },
  },
  'case-psiquiatria-serotoninergico': {
    'hosp-gasometria': {
      result: 'pH: 7.33 | PaCO₂: 32 mmHg | PaO₂: 90 mmHg | HCO₃⁻: 17.5 mEq/L | Lactato: 2.9 mmol/L.',
      interpretation: 'Acidosis láctica leve por hiperactividad muscular sostenida, diaforesis y clonus neuromuscular.',
      isAbnormal: true,
    },
    'hosp-tac-cranio': {
      result: 'Parénquima encefálico sin hemorragia, infarto agudo ni lesiones ocupantes de espacio. Sistema ventricular y cisternas basales normales.',
      interpretation: 'Descarta lesión estructural intracraneal aguda como causa de la agitación, hiperreflexia y clonus.',
      isAbnormal: false,
    },
    'hosp-ecg-12d': {
      result: 'Taquicardia sinusal marcada a 128 lpm. Eje normal. Intervalo QTc discretamente prolongado (465 ms); sin supradesnivel del ST.',
      interpretation: 'Taquicardia autonómica y prolongación limítrofe del QTc que exige monitorización telemétrica y evitar fármacos que prolonguen el QT.',
      isAbnormal: true,
    },
    'hosp-urinalysis-ego': {
      result: 'Tira reactiva Sangre/Hemo: (++) | Microscopía: 1-2 eritrocitos/campo | Densidad 1.028.',
      interpretation: 'Mioglobinuria incipiente secundaria a contracción muscular sostenida e hipertermia por clonus muscular.',
      isAbnormal: true,
    },
  },
  'case-medicina-interna-tep': {
    'hosp-hemograma': {
      result: 'Leucocitos: 11,400 /mm³ | Hemoglobina: 13.4 g/dL | Plaquetas: 290,000 /mm³.',
      interpretation: 'Leucocitosis reactiva discreta secundaria a infarto pulmonar e inflamación aguda (previo a anticoagulación).',
      isAbnormal: true,
    },
    'hosp-gasometria': {
      result: 'pH: 7.49 | PaCO₂: 27 mmHg | PaO₂: 58 mmHg | HCO₃⁻: 20.5 mEq/L | SaO₂: 88% | Lactato: 2.3 mmol/L.',
      interpretation: 'Alcalosis respiratoria aguda con hipoxemia marcada y gradiente alvéolo-arterial ampliado por alteración grave de la relación ventilación/perfusión (V/Q).',
      isAbnormal: true,
    },
    'hosp-tac-torax': {
      result: 'AngioTAC pulmonar: Defectos de repleción intraluminales centrales en silla de montar extendidos hacia ambas arterias pulmonares principales y ramas lobares inferiores. Aumento de tamaño del ventrículo derecho (relación VD/VI = 1.28) con abombamiento del septum interventricular hacia la izquierda y opacidad periférica triangular de base pleural en base pulmonar derecha (joroba de Hampton).',
      interpretation: 'Estudio confirmatorio de tromboembolia pulmonar bilateral con sobrecarga aguda de cavidades derechas.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Disminución relativa de la trama vascular en campo pulmonar medio derecho, prominencia del tronco arterial pulmonar derecho y opacidad triangular periférica basal derecha con discreto derrame laminar.',
      interpretation: 'Signos radiográficos indirectos altamente sugestivos de tromboembolismo e infarto pulmonar periférico.',
      isAbnormal: true,
    },
    'hosp-troponin-i': {
      result: 'Troponina I: 0.14 ng/mL (Discretamente elevada).',
      interpretation: 'Microinjuria miocárdica por distensión y sobrecarga aguda de presión del ventrículo derecho (marcador de riesgo intermedio-alto).',
      isAbnormal: true,
    },
    'hosp-ecocardiograma': {
      result: 'Dilatación de ventrículo derecho (relación VD/VI >1.1), hipocinesia de la pared libre ventricular derecha con motilidad preservada del ápex, abombamiento septal paradójico hacia VI y presión sistólica arterial pulmonar estimada (PSAP) en 50 mmHg. FEVI izquierda preservada (60%).',
      interpretation: 'Disfunción aguda del ventrículo derecho secundaria a hipertensión pulmonar tromboembólica aguda.',
      isAbnormal: true,
    },
    'hosp-pro-bnp': {
      result: 'NT-proBNP sérico: 1,820 pg/mL (MARCADAMENTE ELEVADO).',
      interpretation: 'Elevación por estiramiento agudo del miocardio ventricular derecho (marcador de riesgo intermedio en TEP).',
      isAbnormal: true,
    },
  },
  'case-urgencias-anafilaxia': {
    'hosp-hemograma': {
      result: 'Leucocitos: 13,100 /mm³ (Neutrófilos 74%) | Hemoglobina: 15.2 g/dL | Hematocrito: 45.8% (hemoconcentración por vasodilatación y fuga capilar).',
      interpretation: 'Hemoconcentración aguda secundaria a incremento brusco de permeabilidad vascular durante choque anafiláctico.',
      isAbnormal: true,
    },
    'hosp-gasometria': {
      result: 'pH: 7.25 | PaCO₂: 46 mmHg | PaO₂: 60 mmHg | HCO₃⁻: 19.2 mEq/L | Lactato: 4.5 mmol/L.',
      interpretation: 'Acidosis mixta (láctica por choque distributivo + retención incipiente de CO₂ por broncoespasmo severo) e hipoxemia crítica.',
      isAbnormal: true,
    },
    'hosp-rx-torax': {
      result: 'Hiperinsuflación pulmonar aguda bilateral por atrapamiento aéreo secundario a broncoespasmo severo, sin consolidaciones ni neumotórax.',
      interpretation: 'Atrapamiento aéreo por obstrucción aguda difusa de la vía aérea inferior.',
      isAbnormal: true,
    },
    'hosp-ecg-12d': {
      result: 'Taquicardia sinusal a 134 lpm. Onda T ligeramente aplanada en cara lateral sin elevación ni descenso del segmento ST.',
      interpretation: 'Taquicardia compensatoria al choque distributivo vasodilatador.',
      isAbnormal: true,
    },
  },
  'case-neurologia-guillain-barre': {
    'hosp-emg-extremidades': {
      result: 'VCN motoras (mediano, cubital, peroneo y tibial): latencias distales marcadamente prolongadas (6.8-8.9 ms), disminución significativa de velocidades de conducción (26-34 m/s), dispersión temporal y bloqueos parciales de conducción motora; preservación relativa de respuesta sensitiva sural ("sural sparing"). Ondas F ausentes o severamente prolongadas (>65 ms). EMG con aguja: reclutamiento reducido sin denervación crónica.',
      interpretation: 'Polineuropatía desmielinizante inflamatoria aguda (patrón AIDP) altamente confirmatoria de Síndrome de Guillain-Barré.',
      isAbnormal: true,
    },
    'hosp-emg-estimulacion-repetitiva': {
      result: 'Ondas F ausentes en nervios peroneos y tibiales bilaterales; reflejo H ausente bilateralmente. Estimulación repetitiva a 3 Hz sin decremento de placa neuromuscular.',
      interpretation: 'Ausencia temprana de ondas F y reflejo H por desmielinización proximal radicular (primer hallazgo electrofisiológico en Guillain-Barré), descartando trastorno de unión neuromuscular.',
      isAbnormal: true,
    },
    'hosp-vitamina-b12-folato': {
      result: 'Vitamina B12 sérica: 410 pg/mL.',
      interpretation: 'Descarta mieloneuropatía carencial por déficit de vitamina B12 como diagnóstico diferencial de debilidad ascendente.',
      isAbnormal: false,
    },
    'hosp-acido-folico': {
      result: 'Ácido fólico sérico: 9.8 ng/mL.',
      interpretation: 'Niveles de folato dentro de límites normales.',
      isAbnormal: false,
    },
  },
  'case-psiquiatria-delirium-tremens': {
    'hosp-vitamina-b1-b6': {
      result: 'Vitamina B1 (Tiamina en sangre total): 34 nmol/L (CRÍTICAMENTE BAJA).',
      interpretation: 'Deficiencia severa de tiamina (vitamina B1) secundaria a alcoholismo crónico; altísimo riesgo de encefalopatía de Wernicke si se administra glucosa sin reposición previa de tiamina IV.',
      isAbnormal: true,
    },
    'hosp-vitamina-b6': {
      result: 'Vitamina B6 (PLP): 3.2 mcg/L (BAJA).',
      interpretation: 'Déficit nutricional de piridoxina asociado a consumo crónico de alcohol.',
      isAbnormal: true,
    },
    'hosp-vitamina-b12-folato': {
      result: 'Vitamina B12 sérica: 260 pg/mL (limítrofe baja).',
      interpretation: 'Reserva limítrofe de cobalamina en contexto de etilismo crónico.',
      isAbnormal: true,
    },
    'hosp-acido-folico': {
      result: 'Ácido fólico (B9): 2.1 ng/mL (DEFICIENCIA).',
      interpretation: 'Deficiencia de folatos frecuente en etilismo crónico que explica tendencia a macrocitosis hematológica.',
      isAbnormal: true,
    },
    'hosp-eeg': {
      result: 'Trazado de fondo rápido de bajo voltaje con predominio de actividad beta difusa entremezclada con ondas theta dispersas; sin descargas epileptiformes focales sostenidas.',
      interpretation: 'Hallazgos compatibles con síndrome de abstinencia alcohólica aguda (delirium tremens) sin foco epiléptico estructural.',
      isAbnormal: true,
    },
    'hosp-toxicologico': {
      result: 'Tamizaje urinario negativo para cocaína, opioides y anfetaminas. Etanol en sangre: <10 mg/dL (tras suspensión abrupta hace 48 h).',
      interpretation: 'Confirma estado de abstinencia alcohólica tras cese de ingesta sin intoxicación concomitante por drogas ilícitas.',
      isAbnormal: false,
    },
  },
  'case-traumatologia-cadera': {
    'hosp-vitamina-d': {
      result: '25-OH-Vitamina D total: 12.8 ng/mL (DEFICIENCIA).',
      interpretation: 'Hipovitaminosis D severa asociada a fragilidad ósea y riesgo de fractura de cadera en adulto mayor.',
      isAbnormal: true,
    },
    'hosp-pth': {
      result: 'PTH intacta: 81 pg/mL.',
      interpretation: 'Elevación compensatoria secundaria a déficit severo de vitamina D.',
      isAbnormal: true,
    },
  },
  'case-out-mi-anemia-ferropenica': {
    'hosp-vitamina-b12-folato': {
      result: 'Vitamina B12 sérica: 390 pg/mL.',
      interpretation: 'Niveles normales de vitamina B12; descarta anemia megaloblástica mixta.',
      isAbnormal: false,
    },
    'hosp-acido-folico': {
      result: 'Ácido fólico sérico: 10.2 ng/mL.',
      interpretation: 'Niveles normales de folato; refuerza ferropenia pura.',
      isAbnormal: false,
    },
    'hosp-endoscopia-alta': {
      result: 'Mucosa esofágica, gástrica y duodenal íntegra, sin úlceras, angiodisplasias ni sangrado activo; biopsias duodenales sin atrofia vellositaria.',
      interpretation: 'Descarta sangrado digestivo alto oculto o enfermedad celíaca como causa de ferropenia.',
      isAbnormal: false,
    },
    'hosp-colonoscopia': {
      result: 'Colon e íleon terminal normales sin pólipos, úlceras ni lesiones sangrantes.',
      interpretation: 'Descarta sangrado colónico oculto; refuerza etiología ginecológica (hipermenorrea).',
      isAbnormal: false,
    },
  },
  'case-out-trauma-lumbalgia': {
    'hosp-emg-extremidades': {
      result: 'EMG y VCN de miembros inferiores (L4, L5, S1 bilaterales): amplitudes motoras/sensitivas normales, reflejo H en sóleo simétrico (29.2 ms) y ausencia de ondas positivas o fibrilaciones en miotomas lumbares.',
      interpretation: 'Sin evidencia electrofisiológica de radiculopatía lumbar; respalda lumbalgia mecánica pura.',
      isAbnormal: false,
    },
  },
  'case-gastro-hda-ulcera': {
    'hosp-endoscopia-alta': {
      result: 'Abundantes restos hemáticos oscuros digeridos en cámara gástrica tras lavado. Gastropatía erosiva antral difusa por AINEs. En cara posterior del bulbo duodenal se identifica úlcera péptica profunda de 14 mm con vaso visible no sangrante / coágulo adherido (clasificación Forrest IIa-IIb). Se realiza terapia combinada endoscópica con adrenalina diluida + clipaje hemostático exitoso. Sin várices esofágicas.',
      interpretation: 'Estudio confirmatorio y terapéutico de hemorragia digestiva alta no variceal por úlcera duodenal secundaria a AINEs.',
      isAbnormal: true,
    },
    'hosp-colonoscopia': {
      result: 'Presencia de restos hemáticos digeridos oscuros (melena) descendiendo desde íleon terminal sin lesión mucosa primaria, úlceras, pólipos ni divertículos sangrantes en colon.',
      interpretation: 'Confirma que el sangrado proviene del tubo digestivo alto y descarta fuente colónica.',
      isAbnormal: false,
    },
  },
  'case-out-gastro-erge': {
    'hosp-endoscopia-alta': {
      result: 'Esofagitis erosiva leve grado A de Los Ángeles (erosión mucosa única de 4 mm en esófago distal sobre línea Z), cardias ligeramente laxo / hernia hiatal por deslizamiento de 2 cm. Sin esófago de Barrett, estenosis ni úlcera gástrica.',
      interpretation: 'Hallazgos compatibles con enfermedad por reflujo gastroesofágico leve no complicada.',
      isAbnormal: true,
    },
  },
  'case-gastro-colangitis-aguda': {
    'hosp-endoscopia-alta': {
      result: 'Esófago y estómago normales. En segunda porción duodenal se observa papila mayor de Vater edematosa y prominente con salida de bilis turbia-purulenta (indicación inmediata de CPRE descompresiva).',
      interpretation: 'Hallazgo papilar compatible con colangitis aguda purulenta por obstrucción biliar distal.',
      isAbnormal: true,
    },
  },
  'case-out-mi-deficit-b12': {
    'hosp-endoscopia-alta': {
      result: 'Adelgazamiento y palidez difusa de mucosa con pérdida de pliegues en cuerpo y fondo gástrico (gastritis crónica atrófica), respetando antro. Sin úlceras ni neoplasias. Biopsias enviadas para descartar gastritis atrófica autoinmune.',
      interpretation: 'Compatible con gastritis crónica atrófica asociada a malabsorción de vitamina B12.',
      isAbnormal: true,
    },
  },
  'case-out-gastro-sii': {
    'hosp-colonoscopia': {
      result: 'Colonoscopia total e ileoscopia distal hasta 15 cm completamente normales: mucosa rosada, patrón vascular nítido, sin úlceras, friabilidad, pólipos ni estenosis. Biopsias aleatorias sin colitis microscópica.',
      interpretation: 'Excluye enfermedad inflamatoria intestinal o neoplasia colónica; respalda Síndrome de Intestino Irritable.',
      isAbnormal: false,
    },
  },
  'case-neumologia-asma-grave': {
    'hosp-broncoscopia': {
      result: 'Edema e hiperemia difusa de mucosa bronquial con broncoconstricción segmentaria y múltiples tapones mucosos adherentes espeso-blanquecinos sin cuerpos extraños ni tumoraciones. Lavado broncoalveolar con eosinofilia (14%) y cultivos bacterianos negativos.',
      interpretation: 'Cambios inflamatorios bronquiales severos y tapones mucosos compatibles con exacerbación asmática (nota: en crisis grave la broncoscopia se reserva solo tras asegurar vía aérea).',
      isAbnormal: true,
    },
    'hosp-espirometria': {
      result: 'Obstrucción severa al flujo aéreo (FEV₁ 44% del predicho, relación FEV₁/FVC: 0.56) con respuesta broncodilatadora significativa tras estabilización (+18% y +340 mL en FEV₁).',
      interpretation: 'Patrón obstructivo reversible característico de exacerbación asmática grave (nota: realizar tras estabilizar la crisis aguda).',
      isAbnormal: true,
    },
  },
  'case-out-neumo-asma': {
    'hosp-broncoscopia': {
      result: 'Árbol traqueobronquial permeable sin estenosis ni cuerpo extraño; discreto edema mucoso y secreción mucosa clara con predominio eosinofílico en lavado broncoalveolar.',
      interpretation: 'Descarta obstrucción mecánica de vía aérea central o cuerpo extraño; compatible con inflamación asmática leve.',
      isAbnormal: true,
    },
  },
  'case-neurologia-ictus': {
    'hosp-eeg': {
      result: 'Enlentecimiento focal polimorfo continuo en rango delta-theta (1.5-5 Hz) sobre región frontotemporal izquierda; actividad de base derecha conservada sin complejos punta-onda epileptiformes.',
      interpretation: 'Disfunción bioeléctrica focal hemisférica izquierda concordante con territorio de arteria cerebral media.',
      isAbnormal: true,
    },
    'hosp-holter-24h': {
      result: 'Episodios paroxísticos de fibrilación auricular asintomática con respuesta ventricular entre 85 y 118 lpm (duración acumulada 14% del registro) alternando con ritmo sinusal.',
      interpretation: 'Detecta fibrilación auricular paroxística como fuente cardioembólica etiológica del evento vascular cerebral.',
      isAbnormal: true,
    },
    'hosp-ecocardiograma': {
      result: 'Dilatación moderada de aurícula izquierda (volumen indexado 41 mL/m²), FEVI 56%, sin trombo intracavitario visible en ventana transtorácica.',
      interpretation: 'Remodelado auricular izquierdo compatible con cardioembolismo por fibrilación auricular.',
      isAbnormal: true,
    },
  },
  'case-out-urg-vppb': {
    'hosp-audiometria': {
      result: 'Audiometría tonal liminar completamente normal bilateral (umbrales 10-15 dB en 250-8000 Hz) y timpanometría tipo A bilateral.',
      interpretation: 'Ausencia de hipoacusia neurosensorial fluctuante o conductiva; descarta enfermedad de Ménière y patología de oído medio.',
      isAbnormal: false,
    },
  },
  'case-out-ped-otitis': {
    'hosp-audiometria': {
      result: 'Timpanometría derecha curva plana tipo B (ocupación líquida en oído medio derecho); oído izquierdo curva tipo A normal. Audiometría tonal: hipoacusia conductiva derecha leve (30 dB HL con brecha aéreo-ósea de 20 dB).',
      interpretation: 'Derrame purulento/seroso en oído medio derecho concordante con otitis media aguda.',
      isAbnormal: true,
    },
  },
  'case-out-gastro-colitis-ulcerosa': {
    'hosp-coprologico': {
      result: 'Coproparasitoscópico seriado (3 muestras): Negativo para quistes, trofozoítos o huevos.',
      interpretation: 'Descarta parasitosis intestinal como causa de diarrea crónica.',
      isAbnormal: false,
    },
    'hosp-soh': {
      result: 'Sangre oculta en heces (SOH inmunológica): Fuertemente POSITIVA.',
      interpretation: 'Confirma sangrado digestivo mucoso inflamatorio activo.',
      isAbnormal: true,
    },
    'hosp-coprocultivo': {
      result: 'Coprocultivo y toxina A/B de Clostridioides difficile negativos.',
      interpretation: 'Descarta infección enteroinvasiva bacteriana como etiología del brote inflamatorio.',
      isAbnormal: false,
    },
  },
  'case-out-cardio-hta': {
    'hosp-holter-presion-mapa': {
      result: 'Promedio global 24 horas: 150/92 mmHg (FC media 76 lpm). Periodo diurno (07:00–22:00): 155/95 mmHg | Periodo nocturno (22:00–07:00): 141/86 mmHg. Descenso nocturno atenuado (patrón non-dipper): 9.0% sistólico y 9.5% diastólico. Carga hipertensiva elevada (84% sistólica, 81% diastólica).',
      interpretation: 'Confirma hipertensión arterial sistémica sostenida de grado 2 (descarta hipertensión de bata blanca) con patrón non-dipper de mayor riesgo cardiovascular.',
      isAbnormal: true,
    },
  },
  'case-ginecologia-preeclampsia': {
    'hosp-holter-presion-mapa': {
      result: 'Promedio global 24 horas: 170/109 mmHg (FC media 96 lpm). Periodo diurno (07:00–22:00): 173/111 mmHg | Periodo nocturno (22:00–07:00): 165/105 mmHg. Ausencia de descenso nocturno (patrón non-dipper: 4.6% sistólico). Carga hipertensiva del 100% (Nota clínica: ante cifras tensionales severas sostenidas en gestante, no diferir hospitalización urgente por estudio ambulatorio).',
      interpretation: 'Hipertensión arterial severa sostenida con pérdida del ritmo circadiano nocturno característica de trastorno hipertensivo grave del embarazo.',
      isAbnormal: true,
    },
  },
};

/**
 * Inferencia dinámica fisiopatológica de hallazgos relacionados para cualquier caso (incluyendo casos generados por IA)
 * cuando se solicita un estudio secundario o de práctica diaria que no vino definido explícitamente.
 */
function inferDynamicRelatedStudy(stdStudy: ComplementaryStudy, cCase: ClinicalCase): ComplementaryStudy {
  const diag = (cCase.solution?.correctDiagnosis || '').toLowerCase();
  const illness = (cCase.patientInfo?.currentIllness || '').toLowerCase();
  const vitals = cCase.vitalSigns;
  const spec = cCase.specialty;
  const textPool = `${diag} ${illness}`;

  const isBenignOutpatient =
    /reflujo gastroesofagico|\berge\b|intestino irritable|\bsii\b|migraña|migrana|cefalea tensional|paralisis de bell|paralisis facial periferica|lumbalgia mecanica|esguince|vertigo posicional|\bvppb\b|tina corporal|herpes zoster|candidiasis|ansiedad|gastroenteritis aguda probable viral/.test(
      diag
    );

  const isFebrileOrSepsis =
    !isBenignOutpatient &&
    (vitals.temperature >= 38.0 || /sepsis|infecc|bacter|mening|neumon|pielonefr|absceso|colangit|peritonit/.test(textPool));
  const isHypoxic = vitals.oxygenSaturation <= 93 || /neumon|edema|epoc|asma|tromboembol|derrame|bronquiolit|insuficiencia respiratoria/.test(textPool);
  const isShockOrDehydrated =
    !isBenignOutpatient &&
    (parseInt(vitals.bloodPressure.split('/')[0] || '120', 10) <= 95 || vitals.heartRate >= 110 || /choque|shock|hemorrag|deshidrat|cetoacidosis|ectopico/.test(textPool));
  const isAbdominalAcute =
    !isBenignOutpatient &&
    (spec === 'cirugia_general' || /apendic|colecist|pancreat|diverticul|obstruc|perforac|ectopico|isquemia mesent|colitis ulcerosa/.test(textPool));
  const isCardiac = spec === 'cardiologia' || /infarto|angina|insuficiencia cardiaca|pericardit|miocardit|arritmia|fibrilacion/.test(textPool);
  const isNeuro =
    !isBenignOutpatient &&
    (spec === 'neurologia' || /evc|ictus|acv|hemorragia|meningit|encefal|convuls|status/.test(textPool));
  const isObstructiveUro = /litiasis|calculo ureteral|colico nefrit|hidronefros|ureteral/.test(textPool);
  const isRenal =
    (spec === 'nefrologia' && !isObstructiveUro) ||
    /lesion renal|insuficiencia renal|pielonefrit|enfermedad renal|hiperpotasemia|rabdomiolisis/.test(textPool);

  // β-hCG contextual en varones, mayores de 55 años o gestación/aborto/ectópico
  if (stdStudy.id === 'hosp-bhcg') {
    if (cCase.patientInfo.sex === 'Masculino') {
      return {
        ...stdStudy,
        result: 'Estudio no aplicable en paciente de sexo masculino (β-hCG < 1.0 mUI/mL).',
        interpretation: 'No corresponde a paciente masculino.',
        isAbnormal: false,
      };
    }
    if (/aborto|ectopic|preeclampsia|eclampsia|embaraz|gesta/.test(textPool)) {
      return {
        ...stdStudy,
        result: /aborto/.test(textPool)
          ? 'β-hCG cuantitativa sérica: 2,450 mUI/mL (POSITIVA, en meseta/descenso respecto a edad gestacional).'
          : 'β-hCG cuantitativa sérica: POSITIVA (> 5,000 mUI/mL).',
        interpretation: 'Confirma gonadotropina coriónica detectable coherente con gestación o pérdida gestacional reciente.',
        isAbnormal: true,
      };
    }
    if (cCase.patientInfo.age >= 55) {
      return {
        ...stdStudy,
        result: 'β-hCG sérica: < 2.0 mUI/mL (Negativo; paciente en edad posmenopáusica).',
        interpretation: 'Negativo para embarazo.',
        isAbnormal: false,
      };
    }
  }

  // Urocultivo contextual en infección urinaria o EGO con nitritos positivos
  const hasUrinaryInfectionClue =
    /pielonefritis|cistitis|infeccion.*urinari|\bitu\b/.test(textPool) ||
    (cCase.studiesPool || []).some((s) => /nitritos\s+positiv|bacteriuria|leucocituria/i.test(s.result));
  if (stdStudy.id === 'hosp-urocultivo' && hasUrinaryInfectionClue) {
    return {
      ...stdStudy,
      result: 'Urocultivo positivo: >100,000 UFC/mL de Escherichia coli uropatógena (antibiograma disponible según sensibilidad local).',
      interpretation: 'Confirma infección bacteriana del tracto urinario.',
      isAbnormal: true,
    };
  }

  // Gasometría arterial dinámica según oxigenación, perfusión o acidosis
  if (stdStudy.id === 'hosp-gasometria') {
    if (isHypoxic && isShockOrDehydrated) {
      return {
        ...stdStudy,
        result: `pH: 7.29 | PaCO₂: 33 mmHg | PaO₂: 61 mmHg | HCO₃⁻: 16.0 mEq/L | SaO₂: ${vitals.oxygenSaturation}% | Lactato: 3.6 mmol/L.`,
        interpretation: 'Hipoxemia arterial e hiperlactatemia con acidosis metabólica por compromiso cardiorrespiratorio y de perfusión tisular.',
        isAbnormal: true,
      };
    }
    if (isHypoxic) {
      return {
        ...stdStudy,
        result: `pH: 7.46 | PaCO₂: 30 mmHg | PaO₂: 62 mmHg | HCO₃⁻: 21.5 mEq/L | SaO₂: ${vitals.oxygenSaturation}% | Lactato: 1.8 mmol/L.`,
        interpretation: 'Alcalosis respiratoria por taquipnea con hipoxemia arterial concordante con la saturación clínica.',
        isAbnormal: true,
      };
    }
    if (isShockOrDehydrated || isRenal) {
      return {
        ...stdStudy,
        result: 'pH: 7.30 | PaCO₂: 30 mmHg | PaO₂: 89 mmHg | HCO₃⁻: 15.5 mEq/L | Lactato: 3.2 mmol/L.',
        interpretation: 'Acidosis metabólica compensada parcialmente con hiperlactatemia por hipoperfusión o disfunción metabólica/renal.',
        isAbnormal: true,
      };
    }
  }

  // PCR, VSG y Procalcitonina en infecciones, abdomen agudo o isquemia
  if (stdStudy.id === 'hosp-pcr-vsg' && (isFebrileOrSepsis || isAbdominalAcute || isCardiac)) {
    return {
      ...stdStudy,
      result: `Proteína C Reactiva (PCR): ${isFebrileOrSepsis ? '145 mg/L' : '48 mg/L'}.`,
      interpretation: 'Elevación de proteína C reactiva acorde con proceso inflamatorio o infeccioso activo.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-vsg' && (isFebrileOrSepsis || isAbdominalAcute || /lupus|artritis|vasculit/.test(textPool))) {
    return {
      ...stdStudy,
      result: `Velocidad de Sedimentación Globular (VSG): ${isFebrileOrSepsis ? '54 mm/h' : '38 mm/h'}.`,
      interpretation: 'Aceleración de la velocidad de sedimentación globular acorde a inflamación sistémica.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-procalcitonina' && isFebrileOrSepsis) {
    return {
      ...stdStudy,
      result: `Procalcitonina sérica: ${isShockOrDehydrated ? '4.8 ng/mL' : '1.4 ng/mL'} (ELEVADA).`,
      interpretation: 'Elevación de procalcitonina altamente sugestiva de infección bacteriana sistémica.',
      isAbnormal: true,
    };
  }

  // Química sanguínea cuando hay hiperglucemia capilar o deshidratación
  if (stdStudy.id === 'hosp-quimica-basica') {
    if ((vitals.bloodGlucose && vitals.bloodGlucose >= 180) || isShockOrDehydrated || isRenal) {
      const glu = vitals.bloodGlucose || (isShockOrDehydrated ? 142 : 98);
      const cr = isRenal ? '2.9 mg/dL' : isShockOrDehydrated ? '1.45 mg/dL' : '0.95 mg/dL';
      const urea = isRenal ? '86 mg/dL' : isShockOrDehydrated ? '52 mg/dL' : '30 mg/dL';
      return {
        ...stdStudy,
        result: `Glucosa sérica: ${glu} mg/dL | Urea: ${urea} | Creatinina sérica: ${cr}.`,
        interpretation: isRenal
          ? 'Azoados francamente elevados por deterioro de la tasa de filtración glomerular.'
          : 'Azoados discretamente elevados por componente prerrenal/hipovolemia y respuesta metabólica al estrés.',
        isAbnormal: true,
      };
    }
  }

  // TAC Abdomen
  if (stdStudy.id === 'hosp-tac-abdomen') {
    if (isAbdominalAcute) {
      return {
        ...stdStudy,
        result: `Estriación inflamatoria focal de la grasa mesentérica/perivisceral acorde al cuadrante sintomático, ganglios mesentéricos reactivos (<12 mm) y discreta cantidad de líquido libre laminar en fondo de saco o corredera parietocólica. Sin signos incidentales contradictorios.`,
        interpretation: `Hallazgos tomográficos inflamatorios e indirectos consistentes con el proceso agudo abdominopélvico del paciente (${cCase.solution?.correctDiagnosis || 'patología visceral aguda'}).`,
        isAbnormal: true,
      };
    }
    if (isCardiac) {
      return {
        ...stdStudy,
        result: 'Congestión venosa pasiva hepática discreta con dilatación leve de vena cava inferior y suprahepáticas. Ateromatosis aórtica calcificada acorde a perfil cardiovascular. Sin foco quirúrgico abdominal.',
        interpretation: 'Repercusión hemodinámica venosa retrógrada y enfermedad vascular sistémica sin patología abdominal primaria.',
        isAbnormal: true,
      };
    }
    if (isFebrileOrSepsis) {
      return {
        ...stdStudy,
        result: 'Esplenomegalia reactiva limítrofe e hígado de tamaño conservado sin abscesos ni colecciones organizadas. Adenopatías reactivas inespecíficas de pequeño tamaño.',
        interpretation: 'Cambios reactivos sistémicos propios de respuesta inflamatoria/infecciosa aguda, sin foco quirúrgico abdominal.',
        isAbnormal: true,
      };
    }
  }

  // TAC / AngioTAC de Tórax
  if (stdStudy.id === 'hosp-tac-torax') {
    if (isHypoxic || spec === 'neumologia') {
      return {
        ...stdStudy,
        result: 'Opacidades parenquimatosas en vidrio deslustrado / infiltrados alveolares focales en bases pulmonares acompañados de derrame pleural laminar reactivo. Árbol vascular pulmonar principal permeable.',
        interpretation: 'Compromiso pleuropulmonar coherente con la alteración del intercambio gaseoso y oxigenación del paciente.',
        isAbnormal: true,
      };
    }
    if (isCardiac) {
      return {
        ...stdStudy,
        result: 'Cardiomegalia leve, calcificaciones ateromatosas coronarias y engrosamiento septal intersticial perihiliar por congestión venosa pulmonar incipiente.',
        interpretation: 'Signos tomográficos torácicos relacionados con cardiopatía isquémica o congestiva del caso.',
        isAbnormal: true,
      };
    }
  }

  // TAC Cráneo
  if (stdStudy.id === 'hosp-tac-cranio' && isNeuro) {
    return {
      ...stdStudy,
      result: 'Cambios estructurales/edematosos leves relacionados con la agresión neurológica aguda (borramiento discreto de surcos o cambios isquémicos/inflamatorios tempranos), sin efecto de masa catastrófico no concordante.',
      interpretation: 'Neuroimagen con hallazgos secundarios relacionados con la patología del sistema nervioso central en curso.',
      isAbnormal: true,
    };
  }

  // Rx Tórax
  if (stdStudy.id === 'hosp-rx-torax') {
    if (isHypoxic) {
      return {
        ...stdStudy,
        result: 'Aumento de la trama broncovascular bibasal, infiltrados intersticio-alveolares o borramiento laminar de seno costofrénico acorde al compromiso respiratorio.',
        interpretation: 'Hallazgos radiológicos pleuropulmonares relacionados con la hipoxemia clínica.',
        isAbnormal: true,
      };
    }
    if (isAbdominalAcute) {
      return {
        ...stdStudy,
        result: 'Elevación leve de hemidiafragma con atelectasia laminar basal reactiva secundaria a dolor e hipoventilación abdominal; sin neumoperitoneo subdiafragmático.',
        interpretation: 'Cambios basales pulmonares reactivos a patología abdominal aguda.',
        isAbnormal: true,
      };
    }
  }

  // US Abdominal
  if (stdStudy.id === 'hosp-us-abdomen') {
    if (isObstructiveUro) {
      return {
        ...stdStudy,
        result: 'Dilatación pielocalicial y ureteral proximal unilateral (hidronefrosis grado I-II) con asimetría o ausencia de jet ureteral vesical del lado sintomático.',
        interpretation: 'Dilatación del sistema colector compatible con uropatía obstructiva aguda.',
        isAbnormal: true,
      };
    }
    if (isRenal) {
      return {
        ...stdStudy,
        result: 'Incremento discreto de la ecogenicidad cortical renal bilateral con pérdida leve de la diferenciación corticomedular; sin dilatación pielocalicial.',
        interpretation: 'Cambios ecográficos renales parenquimatosos sin uropatía obstructiva.',
        isAbnormal: true,
      };
    }
    if (isAbdominalAcute || isShockOrDehydrated) {
      return {
        ...stdStudy,
        result: 'Escaso líquido libre laminar en fondo de saco o espacio de Morrison y distensión discreta de asas con peristaltismo disminuido.',
        interpretation: 'Hallazgos ecográficos indirectos de irritación peritoneal o tercer espacio inflamatorio.',
        isAbnormal: true,
      };
    }
  }

  // ECG coherente con taquicardia / bradicardia / frecuencia cardíaca real y hallazgos ECG asociados
  if (stdStudy.id === 'hosp-ecg-12d') {
    const existingNeuroEcg = (cCase.studiesPool || []).find(
      (s) =>
        (/\becg\b|electrocardiograma/i.test(s.name) || /\becg:/i.test(s.result)) &&
        /inversi[oó]n.*onda\s*t|ondas?\s*t\s*cerebrales/i.test(s.result)
    );
    if (existingNeuroEcg) {
      return {
        ...stdStudy,
        result: `Ritmo sinusal con frecuencia cardíaca de ${vitals.heartRate} lpm. Inversión simétrica profunda de ondas T ("ondas T cerebrales") con prolongación discreta del QTc sin elevación convexa aguda del segmento ST.`,
        interpretation:
          'Alteraciones neurogénicas de repolarización en ECG ("ondas T cerebrales") concordantes con el cuadro neurológico y frecuencia cardíaca actual.',
        isAbnormal: true,
      };
    }
    if (vitals.heartRate >= 100) {
      return {
        ...stdStudy,
        result: `Taquicardia sinusal regular a ${vitals.heartRate} lpm. Eje QRS conservado. Segmento ST isoeléctrico sin supradesnivel agudo.`,
        interpretation: `Taquicardia sinusal compensatoria concordante con la frecuencia cardíaca del paciente (${vitals.heartRate} lpm) por fiebre, dolor o hipovolemia.`,
        isAbnormal: true,
      };
    }
    if (vitals.heartRate === 0 || (vitals.bloodPressure || '').startsWith('0/')) {
      return {
        ...stdStudy,
        result: 'TRAZO ISOELÉCTRICO CONTINUO (ASISTOLIA). Frecuencia cardíaca: 0 lpm.',
        interpretation: 'ASISTOLIA: ausencia total de actividad eléctrica ventricular.',
        isAbnormal: true,
      };
    }
    if (vitals.heartRate <= 59) {
      return {
        ...stdStudy,
        result: `Bradicardia sinusal regular a ${vitals.heartRate} lpm. Vigilar trastornos de conducción o desequilibrio electrolítico asociado.`,
        interpretation: `Bradicardia sinusal acorde con los signos vitales (${vitals.heartRate} lpm).`,
        isAbnormal: true,
      };
    }
    return {
      ...stdStudy,
      result: stdStudy.result.replace('76 lpm', `${vitals.heartRate} lpm`),
    };
  }

  // EGO coherente con deshidratación, cetosis o infección urinaria/renal
  if (stdStudy.id === 'hosp-urinalysis-ego') {
    if (isRenal) {
      return {
        ...stdStudy,
        result: 'Densidad 1.015 | Proteínas: (++) | Cilindros granulosos y celulares ocasionales | Eritrocitos: 5-8 por campo.',
        interpretation: 'Sedimento urinario activo y proteinuria coherentes con compromiso renal.',
        isAbnormal: true,
      };
    }
    if (isShockOrDehydrated || isFebrileOrSepsis) {
      return {
        ...stdStudy,
        result: 'Color ámbar concentrado | Densidad 1.028 (elevada) | Cetonas: (+) por ayuno/catabolismo | Sedimento sin bacteriuria significativa.',
        interpretation: 'Orina concentrada secundaria a deshidratación, fiebre o estrés metabólico agudo.',
        isAbnormal: true,
      };
    }
  }

  // Dímero D en inflamación/infección severa
  if (stdStudy.id === 'hosp-dimer-d' && (isFebrileOrSepsis || isShockOrDehydrated || isCardiac)) {
    return {
      ...stdStudy,
      result: 'Dímero D: 760 ng/mL FEU.',
      interpretation: 'Elevación inespecífica como reactante de fase aguda e injuria endotelial secundaria al proceso inflamatorio/vascular sistémico.',
      isAbnormal: true,
    };
  }

  // Troponina I por demanda en taquicardia extrema o hipoxia severa
  if (stdStudy.id === 'hosp-troponin-i' && (isHypoxic || vitals.heartRate >= 120)) {
    return {
      ...stdStudy,
      result: 'Troponina I: 0.045 ng/mL (levemente por encima del percentil 99).',
      interpretation: 'Injuria miocárdica secundaria leve (tipo 2) atribuible a taquicardia sostenida o hipoxemia sistémica.',
      isAbnormal: true,
    };
  }

  // Vitaminas neurotrópicas y folato en etilismo / desnutrición / hepatopatía
  const hasAlcoholOrMalnutrition = /alcohol|etili|cirros|delirium tremens|wernicke|desnutric|malabsorc/.test(textPool);
  if (stdStudy.id === 'hosp-vitamina-b1-b6' && hasAlcoholOrMalnutrition) {
    return {
      ...stdStudy,
      result: 'Vitamina B1 (Tiamina en sangre total): 38 nmol/L (BAJA).',
      interpretation: 'Déficit severo de tiamina asociado a consumo crónico de alcohol o desnutrición; requiere reposición parenteral antes de infundir dextrosa.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-vitamina-b6' && hasAlcoholOrMalnutrition) {
    return {
      ...stdStudy,
      result: 'Vitamina B6 (PLP): 4.1 mcg/L (BAJA).',
      interpretation: 'Déficit nutricional de piridoxina asociado a alcoholismo crónico o malabsorción.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-acido-folico' && hasAlcoholOrMalnutrition) {
    return {
      ...stdStudy,
      result: 'Ácido fólico sérico (B9): 2.4 ng/mL (BAJO).',
      interpretation: 'Deficiencia de folato asociada a ingesta pobre o hepatopatía crónica.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-homocisteina' && hasAlcoholOrMalnutrition) {
    return {
      ...stdStudy,
      result: 'Homocisteína sérica total: 19.8 µmol/L (ELEVADA).',
      interpretation: 'Hiperhomocisteinemia secundaria a déficit de vitaminas del grupo B.',
      isAbnormal: true,
    };
  }

  // Vitamina D y PTH en adulto mayor, osteoporosis, fractura o enfermedad renal
  if (
    stdStudy.id === 'hosp-vitamina-d' &&
    (cCase.patientInfo.age >= 68 || isRenal || /osteoporos|fractura|cadera|osteomalac/.test(textPool))
  ) {
    return {
      ...stdStudy,
      result: `25-OH-Vitamina D total: ${isRenal ? '16.8' : '14.5'} ng/mL (DEFICIENCIA).`,
      interpretation: 'Hipovitaminosis D acorde al perfil óseo/renal o edad avanzada del paciente.',
      isAbnormal: true,
    };
  }
  if (
    stdStudy.id === 'hosp-pth' &&
    (cCase.patientInfo.age >= 68 || isRenal || /osteoporos|fractura|cadera|osteomalac/.test(textPool))
  ) {
    return {
      ...stdStudy,
      result: `PTH intacta: ${isRenal ? '108' : '76'} pg/mL (ELEVADA).`,
      interpretation: 'Hiperparatiroidismo secundario compensatorio acorde al metabolismo calcio-vitamina D.',
      isAbnormal: true,
    };
  }

  // Electromiografía y VCN contextual en patologías neuromusculares o compresivas
  if (stdStudy.id === 'hosp-emg-extremidades') {
    if (/guillain|desmieliniz|polineuropat/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Enlentecimiento marcado de velocidades de conducción motora (<35 m/s), latencias distales prolongadas y ausencia bilateral de ondas F y reflejos H.',
        interpretation: 'Patrón electrofisiológico de polineuropatía desmielinizante aguda.',
        isAbnormal: true,
      };
    }
    if (/radiculopat|ciatic|hernia discal|cauda equina/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Potenciales de fibrilación y ondas positivas agudas en musculatura paravertebral y miotoma distal L5-S1 ipsilateral, con prolongación de latencia de reflejo H.',
        interpretation: 'Signos electromiográficos de denervación radicular aguda/subaguda.',
        isAbnormal: true,
      };
    }
    if (/miopat|rabdomiolis|polimiosit/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Potenciales de unidad motora (PUM) de corta duración, baja amplitud y morfología polifásica con reclutamiento precoz en musculatura proximal; VCN sensitivo-motoras preservadas.',
        interpretation: 'Patrón electromiográfico miopático proximal sin compromiso neuropático primario.',
        isAbnormal: true,
      };
    }
  }
  if (stdStudy.id === 'hosp-emg-estimulacion-repetitiva' && /miasten|botulism|placa neuromuscular/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Estimulación nerviosa repetitiva a 3 Hz: decremento patológico del 22% entre el primer y cuarto potencial compuesto (CMAP) en músculo orbicular del ojo y trapecio, con facilitación post-ejercicio.',
      interpretation: 'Prueba de Jolly francamente positiva compatible con trastorno postsináptico de la unión neuromuscular (Miastenia Gravis).',
      isAbnormal: true,
    };
  }

  // Endoscopia, Colonoscopia y Broncoscopia contextuales en casos dinámicos o generados con IA
  if (
    stdStudy.id === 'hosp-endoscopia-alta' &&
    /hematemes|melena|ulcera peptica|varices|esofag|gastrit|disfagia|helicobacter|erge|hemorragia digestiva alta/.test(textPool)
  ) {
    return {
      ...stdStudy,
      result: 'Mucosa gastroduodenal/esofágica con eritema, erosiones o lesiones inflamatorias activas; se toman biopsias y prueba rápida de ureasa.',
      interpretation: 'Hallazgos endoscópicos altos compatibles con patología esofagogastroduodenal activa.',
      isAbnormal: true,
    };
  }
  if (
    stdStudy.id === 'hosp-colonoscopia' &&
    /hematoquez|rectorrag|cancer colon|colitis|crohn|diverticul|polipo|hemorragia digestiva baja|sangrado digestivo bajo/.test(textPool)
  ) {
    return {
      ...stdStudy,
      result: 'Alteración mucosa o lesión estructural en marco colónico (erosiones/úlceras friables o estigmas de sangrado distal); biopsias colónicas segmentarias obtenidas.',
      interpretation: 'Colonoscopia patológica concordante con compromiso colónico orgánico o sangrado digestivo bajo.',
      isAbnormal: true,
    };
  }
  if (
    stdStudy.id === 'hosp-broncoscopia' &&
    /hemoptis|cuerpo extrano|bronquiectas|tumor pulmonar|tuberculos|aspiracion|neumon|epoc/.test(textPool)
  ) {
    return {
      ...stdStudy,
      result: 'Inflamación mucosa bronquial segmentaria con secreciones mucopurulentas o restos hemáticos localizados; lavado broncoalveolar enviado a cultivo, baciloscopia y citología.',
      interpretation: 'Fibrobroncoscopia con alteraciones endobronquiales compatibles con patología broncopulmonar focal o infecciosa.',
      isAbnormal: true,
    };
  }

  // EEG dinámico en trastornos neurológicos, encefalopatías, crisis o alteración del Glasgow
  if (stdStudy.id === 'hosp-eeg') {
    if (/epilep|convuls|crisis|estatus|status/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Descargas epileptiformes interictales frecuentes tipo complejos punta-onda y ondas agudas focales/generalizadas con facilitación durante activación.',
        interpretation: 'EEG francamente patológico confirmatorio de hiperexcitabilidad cortical epileptogénica.',
        isAbnormal: true,
      };
    }
    if (vitals.glasgow <= 14 || /encefalop|mening|encefalit|delirium|coma|ictus|evc|cetoacidosis|tormenta tiroidea/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Actividad eléctrica cortical de fondo enlentecida en rango theta-delta (4–7 Hz) con desorganización del ritmo alfa posterior, sin actividad epileptiforme franca.',
        interpretation: 'Enlentecimiento bioeléctrico difuso o focal concordante con encefalopatía aguda o lesión cortical en curso.',
        isAbnormal: true,
      };
    }
  }

  // Espirometría en asma, EPOC, bronquiectasias o tabaquismo crónico
  if (stdStudy.id === 'hosp-espirometria') {
    if (/epoc|enfisema|bronquitis cronica/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Basal: FEV₁/FVC: 0.58 | FEV₁ 62% del predicho. Post-broncodilatador: FEV₁/FVC: 0.59, cambio en FEV₁ de +5% (<12%).',
        interpretation: 'Limitación crónica persistente al flujo aéreo no completamente reversible compatible con EPOC.',
        isAbnormal: true,
      };
    }
    if (/asma|broncoespasmo|sibilanc|bronquiectas/.test(textPool)) {
      return {
        ...stdStudy,
        result: 'Basal: FEV₁/FVC: 0.64 | FEV₁ 72% del predicho. Post-broncodilatador: incremento de FEV₁ de +15% (+280 mL).',
        interpretation: 'Alteración ventilatoria obstructiva congruente con patología bronquial.',
        isAbnormal: true,
      };
    }
  }

  // Audiometría en otitis, hipoacusia o síndrome vestibular periférico
  if (stdStudy.id === 'hosp-audiometria' && /otitis|hipoacusia|sordera|laberint|meniere|acufeno|tinnitus/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Umbrales auditivos alterados (caída tonal neurosensorial en frecuencias bajas/medias o brecha aéreo-ósea conductiva con timpanometría tipo B según compromiso).',
      interpretation: 'Alteración audiométrica congruente con compromiso otológico/coclear.',
      isAbnormal: true,
    };
  }

  // Holter 24h en arritmias, palpitaciones, síncope o cardioembolismo
  if (stdStudy.id === 'hosp-holter-24h' && (isCardiac || /sincope|palpitac|fibrilacion|taquicard|bloqueo|ictus|evc/.test(textPool))) {
    return {
      ...stdStudy,
      result: 'Registro ambulatorio de 24 h con episodios intermitentes de taquiarritmia supraventricular con intervalos R-R irregulares o ectopia ventricular frecuente.',
      interpretation: 'Monitoreo Holter positivo para trastorno arrítmico paroxístico o carga ectópica significativa.',
      isAbnormal: true,
    };
  }

  // Holter de Presión Arterial / MAPA 24h dinámico acorde a cifras tensionales del caso
  if (stdStudy.id === 'hosp-holter-presion-mapa') {
    const bpParts = vitals.bloodPressure.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
    const sys = bpParts ? parseInt(bpParts[1], 10) : 120;
    const dia = bpParts ? parseInt(bpParts[2], 10) : 78;
    const hr = vitals.heartRate || 76;

    if (sys >= 140 || dia >= 90) {
      const daySys = sys;
      const dayDia = dia;
      const isChronicNonDipper = /hipertension|renal|preeclampsia|ictus|evc|diabet/.test(textPool);
      const dipFactor = isChronicNonDipper ? 0.93 : 0.88;
      const nightSys = Math.round(daySys * dipFactor);
      const nightDia = Math.round(dayDia * dipFactor);
      const mean24Sys = Math.round(daySys * 0.65 + nightSys * 0.35);
      const mean24Dia = Math.round(dayDia * 0.65 + nightDia * 0.35);
      const dipPct = (((daySys - nightSys) / daySys) * 100).toFixed(1);
      return {
        ...stdStudy,
        result: `Promedio global 24 horas: ${mean24Sys}/${mean24Dia} mmHg (FC media ${hr} lpm). Periodo diurno (07:00–22:00): ${daySys}/${dayDia} mmHg | Periodo nocturno (22:00–07:00): ${nightSys}/${nightDia} mmHg. Descenso nocturno: ${dipPct}% sistólico (${isChronicNonDipper ? 'patrón non-dipper / atenuado' : 'respuesta hipertensiva sostenida'}). Carga hipertensiva elevada (>75%).`,
        interpretation: isChronicNonDipper
          ? 'Perfil MAPA hipertensivo sostenido con descenso nocturno atenuado (non-dipper), acorde a descontrol tensional sistémico o hipertensión reactiva aguda.'
          : 'Elevación tensional sostenida en el registro de 24 horas concordante con descarga simpática, dolor o estrés agudo.',
        isAbnormal: true,
      };
    }

    if (sys <= 95 || /choque|shock|hipotens|anafilaxia|suprarrenal|addison|hemorrag/.test(textPool)) {
      const daySys = Math.min(sys, 94);
      const dayDia = Math.min(dia, 60);
      const nightSys = Math.max(68, Math.round(daySys * 0.94));
      const nightDia = Math.max(42, Math.round(dayDia * 0.93));
      const mean24Sys = Math.round(daySys * 0.65 + nightSys * 0.35);
      const mean24Dia = Math.round(dayDia * 0.65 + nightDia * 0.35);
      return {
        ...stdStudy,
        result: `Promedio global 24 horas: ${mean24Sys}/${mean24Dia} mmHg (FC media ${hr} lpm). Periodo diurno: ${daySys}/${dayDia} mmHg | Periodo nocturno: ${nightSys}/${nightDia} mmHg. Episodios sostenidos de hipotensión arterial (<90/60 mmHg) con taquicardia compensatoria (Nota: en inestabilidad aguda priorizar reanimación inmediata).`,
        interpretation: 'Perfil tensional hipotensivo concordante con hipoperfusión / depleción de volumen o choque agudo.',
        isAbnormal: true,
      };
    }
  }

  // Ecocardiograma Transtorácico y NT-proBNP en patología cardíaca, TEP, sepsis grave o disnea
  if (stdStudy.id === 'hosp-ecocardiograma' && (isCardiac || /tromboembol|pericard|taponamiento|endocard|insuficiencia cardiaca|choque|sepsis/.test(textPool))) {
    return {
      ...stdStudy,
      result: 'Alteración ecocardiográfica en estudio Doppler transtorácico (disfunción segmentaria o global ventricular, dilatación de cavidades derechas o derrame pericárdico laminar/moderado).',
      interpretation: 'ECOTT patológico coherente con compromiso cardíaco estructural o hemodinámico.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-pro-bnp' && (isCardiac || /insuficiencia cardiaca|edema pulmonar|tromboembol|tep|disnea/.test(textPool))) {
    return {
      ...stdStudy,
      result: 'NT-proBNP sérico: 1,680 pg/mL (ELEVADO).',
      interpretation: 'Sobrecarga mecánica y estrés parietal ventricular significativo.',
      isAbnormal: true,
    };
  }

  // Radiografía ósea/columna en traumatología o artritis
  if (stdStudy.id === 'hosp-rx-osea' && (spec === 'traumatologia' || /fractur|luxacion|artritis|lumbalgia|hernia discal|cauda equina|osteomalacia/.test(textPool))) {
    return {
      ...stdStudy,
      result: /fractur|luxacion/.test(textPool)
        ? 'Solución de continuidad cortical con pérdida de congruencia articular o desplazamiento focal de fragmentos óseos.'
        : 'Cambios degenerativos leves y rectificación de la curvatura fisiológica por contractura muscular; sin trazos de fractura aguda.',
      interpretation: 'Hallazgos radiográficos osteoarticulares congruentes con el cuadro musculoesquelético.',
      isAbnormal: true,
    };
  }

  // HbA1c y perfil lipídico separados
  if (stdStudy.id === 'hosp-hba1c' && (/diabet|cetoacidosis|hiperosmolar/.test(textPool) || (vitals.bloodGlucose && vitals.bloodGlucose >= 180))) {
    return {
      ...stdStudy,
      result: `HbA1c: ${vitals.bloodGlucose && vitals.bloodGlucose >= 180 ? '9.8%' : '6.8%'} (ELEVADA).`,
      interpretation: 'Descontrol glucémico crónico trimestral.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-perfil-lipidos' && /diabet|infarto|angina|ictus|metabolic|dislipid|pancreatitis/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Colesterol Total: 238 mg/dL | LDL: 156 mg/dL | HDL: 36 mg/dL | Triglicéridos: 220 mg/dL.',
      interpretation: 'Dislipidemia aterogénica relevante.',
      isAbnormal: true,
    };
  }

  // Ferritina y hierro sérico separados
  if (stdStudy.id === 'hosp-ferritina' && /anemia|ferropen|hemorrag|melena|hematemes|hipermenorrea|ulcera/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Ferritina sérica: 9 ng/mL (BAJA).',
      interpretation: 'Depleción severa de depósitos corporales de hierro compatible con ferropenia.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-perfil-ferrico' && /anemia|ferropen|hemorrag|melena|hematemes|hipermenorrea|ulcera/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Hierro sérico: 28 mcg/dL (BAJO) | TIBC: 425 mcg/dL | Saturación de transferrina: 7%.',
      interpretation: 'Cinética férrica compatible con ferropenia o pérdida hemática.',
      isAbnormal: true,
    };
  }

  // ANA y Complemento separados
  if (stdStudy.id === 'hosp-panel-autoinmune' && /lupus|artritis|vasculit|autoinmun|serositis|hashimoto|tiroiditis/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Anticuerpos Antinucleares (ANA) positivos a título significativo (1:320).',
      interpretation: 'Positividad de anticuerpos antinucleares orientativa de patología autoinmune sistémica.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-complemento' && /lupus|vasculit|glomerulonefrit/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Complemento C3: 58 mg/dL (BAJO) | Complemento C4: 10 mg/dL (BAJO).',
      interpretation: 'Hipocomplementemia por consumo inmune activo.',
      isAbnormal: true,
    };
  }

  // CPK y LDH dinámicos
  if (stdStudy.id === 'hosp-cpk' && /rabdomiolis|compartimental|isquem|miopat|convuls|tetanos/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'CPK total: 2,480 U/L (MARCADAMENTE ELEVADA).',
      interpretation: 'Elevación marcada indicativa de lesión muscular aguda / rabdomiólisis.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-ldh' && /hemolis|ptt|purpura trombocitopenica|megaloblast|b12|palud|malaria|tep|tromboembol/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'LDH sérica: 685 U/L (ELEVADA).',
      interpretation: 'Elevación de LDH compatible con hemólisis, recambio celular acelerado o necrosis tisular.',
      isAbnormal: true,
    };
  }

  // Ecografías específicas y Doppler venoso
  if (stdStudy.id === 'hosp-us-pelvico' && /ectopico|aborto|eip|pelvic|ovaric|anexial/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Hallazgos pélvicos ecográficos positivos acordes al proceso ginecoobstétrico (ocupación/masa anexial o líquido libre en fondo de saco de Douglas).',
      interpretation: 'Ecografía pélvica patológica compatible con el cuadro clínico ginecológico.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-us-renal' && (isObstructiveUro || isRenal)) {
    return {
      ...stdStudy,
      result: isObstructiveUro
        ? 'Hidronefrosis unilateral grado I-II con dilatación ureteral proximal ipsilateral y ausencia de jet ureteral.'
        : 'Incremento discreto de ecogenicidad cortical renal bilateral sin dilatación pielocalicial.',
      interpretation: isObstructiveUro
        ? 'Uropatía obstructiva aguda confirmada por ecografía.'
        : 'Cambios ecográficos de nefropatía parenquimatosa sin obstrucción.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-doppler-venoso' && /trombosis venosa|tvp|insuficiencia venosa|ulcera venosa|tromboembol/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Alteración en estudio Doppler venoso (falta de compresibilidad focal o reflujo valvular profundo/superficial según territorio evaluado).',
      interpretation: 'Estudio Doppler venoso patológico congruente con compromiso vascular venoso periférico.',
      isAbnormal: true,
    };
  }

  // Tamizaje toxicológico en intoxicaciones o alteración del estado mental
  if (stdStudy.id === 'hosp-toxicologico' && /intoxicac|sobredos|litio|triciclic|paracetamol|serotonin|etanol|alcohol|delirium/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Cribado toxicológico preliminar reactivo en orina para metabolitos evaluados; requiere correlación con niveles cuantitativos séricos.',
      interpretation: 'Tamizaje toxicológico positivo congruente con cuadro de intoxicación o exposición farmacológica.',
      isAbnormal: true,
    };
  }

  // Sangre oculta / Coprocultivo en diarrea infecciosa o inflamatoria
  if (stdStudy.id === 'hosp-soh' && /hematoquez|disenter|crohn|ulcerosa|hemorragia digestiva/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Sangre oculta en heces (SOH inmunológica): POSITIVA.',
      interpretation: 'Sangrado digestivo micro/macroscópico activo en tracto gastrointestinal.',
      isAbnormal: true,
    };
  }
  if (stdStudy.id === 'hosp-coprocultivo' && /diarrea|gastroenterit|disenter|fiebre tifoidea/.test(textPool)) {
    return {
      ...stdStudy,
      result: 'Coprocultivo procesado en medios selectivos para enteropatógenos invasivos; pendiente reporte definitivo de tipificación y antibiograma (48-72 h).',
      interpretation: 'Muestra fecal en procesamiento microbiológico.',
      isAbnormal: false,
    };
  }

  return stdStudy;
}

/**
 * Resuelve cualquier estudio estándar con los hallazgos relacionados al caso clínico.
 */
function resolveContextualHospitalStudy(stdStudy: ComplementaryStudy, cCase: ClinicalCase): ComplementaryStudy {
  const caseOverrides = RELATED_STUDY_OVERRIDES[cCase.id];
  if (caseOverrides && caseOverrides[stdStudy.id]) {
    return {
      ...stdStudy,
      ...caseOverrides[stdStudy.id],
      id: `${stdStudy.id}-${cCase.id}`,
    };
  }

  const dynamicStudy = inferDynamicRelatedStudy(stdStudy, cCase);
  return {
    ...dynamicStudy,
    id: `${stdStudy.id}-${cCase.id}`,
  };
}

function normStudyName(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza y compara títulos de estudios individuales para evitar duplicados sin mezclar pruebas distintas.
 */
function isSameStudyCategory(name1: string, name2: string): boolean {
  const n1 = normStudyName(name1);
  const n2 = normStudyName(name2);

  if (n1.includes('hemograma') || n1.includes('biometria hematica')) {
    return n2.includes('hemograma') || n2.includes('biometria hematica');
  }
  if (
    n1.includes('frotis') &&
    !n1.includes('gota gruesa') &&
    !n1.includes('malaria') &&
    !n1.includes('flujo') &&
    !n1.includes('vaginal') &&
    !n1.includes('gram')
  ) {
    return (
      n2.includes('frotis') &&
      !n2.includes('gota gruesa') &&
      !n2.includes('malaria') &&
      !n2.includes('flujo') &&
      !n2.includes('vaginal') &&
      !n2.includes('gram')
    );
  }
  if (n1.includes('reticulocit')) {
    return n2.includes('reticulocit');
  }
  if (n1.includes('coombs')) {
    return n2.includes('coombs');
  }
  if (n1.includes('grupo sanguineo') || n1.includes('factor rh')) {
    return n2.includes('grupo sanguineo') || n2.includes('factor rh');
  }
  if (n1.includes('quimica sanguinea') || (n1.includes('urea') && n1.includes('creatinina'))) {
    return n2.includes('quimica sanguinea') || (n2.includes('urea') && n2.includes('creatinina'));
  }
  if (n1.includes('electrolito')) {
    return n2.includes('electrolito');
  }
  if (n1.includes('gasometria')) {
    return n2.includes('gasometria');
  }
  if (n1.includes('perfil hepatico') || n1.includes('bilirrubina')) {
    return n2.includes('perfil hepatico') || n2.includes('bilirrubina');
  }
  if ((n1.includes('proteina c reactiva') || /\bpcr\b/.test(n1)) && !n1.includes('hisopado') && !n1.includes('viral') && !n1.includes('genexpert')) {
    return (n2.includes('proteina c reactiva') || /\bpcr\b/.test(n2)) && !n2.includes('hisopado') && !n2.includes('viral') && !n2.includes('genexpert');
  }
  if (n1.includes('vsg') || n1.includes('sedimentacion globular')) {
    return n2.includes('vsg') || n2.includes('sedimentacion globular');
  }
  if (n1.includes('procalcitonina')) {
    return n2.includes('procalcitonina');
  }
  if (n1.includes('perfil tiroideo') || n1.includes('tsh')) {
    return n2.includes('perfil tiroideo') || n2.includes('tsh');
  }
  if (n1.includes('hcg') || n1.includes('embarazo')) {
    return n2.includes('hcg') || n2.includes('embarazo');
  }
  if (n1.includes('urocultivo')) {
    return n2.includes('urocultivo');
  }
  if (n1.includes('arbovir') || n1.includes('dengue') || n1.includes('ns1')) {
    return n2.includes('arbovir') || n2.includes('dengue') || n2.includes('ns1');
  }
  if (n1.includes('malaria') || n1.includes('gota gruesa') || n1.includes('hemoparasito')) {
    return n2.includes('malaria') || n2.includes('gota gruesa') || n2.includes('hemoparasito');
  }
  if (n1.includes('leptospira')) {
    return n2.includes('leptospira');
  }
  if (n1.includes('troponina')) {
    return n2.includes('troponina');
  }
  if (n1.includes('ck-mb') || n1.includes('fraccion mb')) {
    return n2.includes('ck-mb') || n2.includes('fraccion mb');
  }
  if (n1.includes('cpk') || (n1.includes('creatina fosfoquinasa') && !n1.includes('ck-mb') && !n1.includes('fraccion mb'))) {
    return n2.includes('cpk') || (n2.includes('creatina fosfoquinasa') && !n2.includes('ck-mb') && !n2.includes('fraccion mb'));
  }
  if (/\bldh\b/.test(n1) || n1.includes('lactato deshidrogenasa')) {
    return /\bldh\b/.test(n2) || n2.includes('lactato deshidrogenasa');
  }
  if (n1.includes('acido urico')) {
    return n2.includes('acido urico');
  }
  if (n1.includes('dimero d')) {
    return n2.includes('dimero d');
  }
  if (n1.includes('amilasa')) {
    return n2.includes('amilasa');
  }
  if (n1.includes('lipasa')) {
    return n2.includes('lipasa');
  }
  if ((n1.includes('examen general de orina') || /\bego\b/.test(n1) || n1.includes('urianalisis')) && !n1.includes('toxicol')) {
    return (n2.includes('examen general de orina') || /\bego\b/.test(n2) || n2.includes('urianalisis')) && !n2.includes('toxicol');
  }
  if (n1.includes('cociente albumina/creatinina')) {
    return n2.includes('cociente albumina/creatinina');
  }
  if (n1.includes('coagulacion') || n1.includes('tiempos de') || (/\btp\b/.test(n1) && n1.includes('ttpa'))) {
    return n2.includes('coagulacion') || n2.includes('tiempos de') || (/\btp\b/.test(n2) && n2.includes('ttpa'));
  }
  if (n1.includes('hemocultivo')) {
    return n2.includes('hemocultivo');
  }
  if (n1.includes('puncion lumbar') || /\blcr\b/.test(n1) || n1.includes('cefalorraquideo')) {
    return n2.includes('puncion lumbar') || /\blcr\b/.test(n2) || n2.includes('cefalorraquideo');
  }
  if ((n1.includes('rx de torax') || n1.includes('radiografia de torax') || n1.includes('radiografia portatil de torax')) && !n1.includes('cuello')) {
    return (n2.includes('rx de torax') || n2.includes('radiografia de torax') || n2.includes('radiografia portatil de torax')) && !n2.includes('cuello');
  }
  if (n1.includes('rx de abdomen') || n1.includes('radiografia simple de abdomen')) {
    return n2.includes('rx de abdomen') || n2.includes('radiografia simple de abdomen');
  }
  if (n1.includes('doppler venos')) {
    return n2.includes('doppler venos');
  }
  if (n1.includes('pelvic') && (n1.includes('ultrasonido') || n1.includes('ecografia')) && !n1.includes('abdominal')) {
    return n2.includes('pelvic') && (n2.includes('ultrasonido') || n2.includes('ecografia')) && !n2.includes('abdominal');
  }
  if ((n1.includes('renal') && (n1.includes('ultrasonido') || n1.includes('ecografia'))) && !n1.includes('abdominal')) {
    return (n2.includes('renal') && (n2.includes('ultrasonido') || n2.includes('ecografia'))) && !n2.includes('abdominal');
  }
  if ((n1.includes('ultrasonido abdominal') || n1.includes('ecografia abdominal')) && !n1.includes('inguinal')) {
    return (n2.includes('ultrasonido abdominal') || n2.includes('ecografia abdominal')) && !n2.includes('inguinal');
  }
  const hasTac1 = /\btac\b|\bangiotac\b|\btomografia\b/.test(n1);
  const hasTac2 = /\btac\b|\bangiotac\b|\btomografia\b/.test(n2);
  if (hasTac1 && (n1.includes('torax') || n1.includes('pulmon'))) {
    return hasTac2 && (n2.includes('torax') || n2.includes('pulmon'));
  }
  if (hasTac1 && (n1.includes('abdomen') || n1.includes('abdominal') || n1.includes('pelvis') || n1.includes('apendice')) && !n1.includes('suprarrenal')) {
    return hasTac2 && (n2.includes('abdomen') || n2.includes('abdominal') || n2.includes('pelvis') || n2.includes('apendice')) && !n2.includes('suprarrenal');
  }
  if (hasTac1 && (n1.includes('craneo') || n1.includes('cerebr')) && !n1.includes('angio')) {
    return hasTac2 && (n2.includes('craneo') || n2.includes('cerebr')) && !n2.includes('angio');
  }
  if ((n1.includes('resonancia') || n1.includes('rmn')) && (n1.includes('encefalo') || n1.includes('cerebr')) && !n1.includes('silla') && !n1.includes('cavernoso')) {
    return (n2.includes('resonancia') || n2.includes('rmn')) && (n2.includes('encefalo') || n2.includes('cerebr')) && !n2.includes('silla') && !n2.includes('cavernoso');
  }
  if (n1.includes('electrocardiograma') || /\becg\b/.test(n1)) {
    return n2.includes('electrocardiograma') || /\becg\b/.test(n2);
  }
  if (n1.includes('vitamina b12') || n1.includes('cobalamina')) {
    return n2.includes('vitamina b12') || n2.includes('cobalamina');
  }
  if (n1.includes('acido folico') || n1.includes('folato')) {
    return n2.includes('acido folico') || n2.includes('folato');
  }
  if (n1.includes('homocisteina')) {
    return n2.includes('homocisteina');
  }
  if (n1.includes('vitamina d') || n1.includes('25-oh')) {
    return n2.includes('vitamina d') || n2.includes('25-oh');
  }
  if (n1.includes('paratiroidea') || /\bpth\b/.test(n1)) {
    return n2.includes('paratiroidea') || /\bpth\b/.test(n2);
  }
  if (/\bvitamina\s+b1\b/.test(n1) || n1.includes('tiamina')) {
    return /\bvitamina\s+b1\b/.test(n2) || n2.includes('tiamina');
  }
  if (/\bvitamina\s+b6\b/.test(n1) || n1.includes('piridox')) {
    return /\bvitamina\s+b6\b/.test(n2) || n2.includes('piridox');
  }
  if (n1.includes('prealbumina')) {
    return n2.includes('prealbumina');
  }
  if (n1.includes('mediano') || n1.includes('tunel del carpo')) {
    return n2.includes('mediano') || n2.includes('tunel del carpo');
  }
  if (n1.includes('estimulacion nerviosa repetitiva') || n1.includes('jolly')) {
    return n2.includes('estimulacion nerviosa repetitiva') || n2.includes('jolly');
  }
  if ((n1.includes('electromiografia') || n1.includes('conduccion nerviosa')) && !n1.includes('mediano') && !n1.includes('repetitiva')) {
    return (n2.includes('electromiografia') || n2.includes('conduccion nerviosa')) && !n2.includes('mediano') && !n2.includes('repetitiva');
  }
  if (n1.includes('endoscopia digestiva alta') || n1.includes('panendoscopia') || n1.includes('esofagogastroduodenoscopia')) {
    return n2.includes('endoscopia digestiva alta') || n2.includes('panendoscopia') || n2.includes('esofagogastroduodenoscopia');
  }
  if (n1.includes('colonoscopia')) {
    return n2.includes('colonoscopia');
  }
  if (n1.includes('broncoscopia') || n1.includes('fibrobroncoscopia')) {
    return n2.includes('broncoscopia') || n2.includes('fibrobroncoscopia');
  }
  if (n1.includes('electroencefalograma') || /\beeg\b/.test(n1)) {
    return n2.includes('electroencefalograma') || /\beeg\b/.test(n2);
  }
  if (n1.includes('potenciales evocados')) {
    return n2.includes('potenciales evocados');
  }
  if (n1.includes('espirometr')) {
    return n2.includes('espirometr');
  }
  if (n1.includes('audiometr') || n1.includes('timpanometr')) {
    return n2.includes('audiometr') || n2.includes('timpanometr');
  }
  const isBpHolter1 = n1.includes('mapa') || (n1.includes('holter') && n1.includes('presion'));
  const isBpHolter2 = n2.includes('mapa') || (n2.includes('holter') && n2.includes('presion'));
  if (isBpHolter1 || isBpHolter2) {
    return isBpHolter1 && isBpHolter2;
  }
  if (n1.includes('holter') && !isBpHolter1) {
    return n2.includes('holter') && !isBpHolter2;
  }
  if (n1.includes('ecocardiograma') || n1.includes('ecott')) {
    return n2.includes('ecocardiograma') || n2.includes('ecott');
  }
  const isBoneRx1 =
    n1.includes('radiografia osteoarticular') ||
    n1.includes('radiografia de cadera') ||
    n1.includes('radiografia ap') ||
    n1.includes('radiografia de tobillo') ||
    (n1.includes('radiografia') && (n1.includes('pierna') || n1.includes('tibia') || n1.includes('lumbar') || n1.includes('codo')));
  const isBoneRx2 =
    n2.includes('radiografia osteoarticular') ||
    n2.includes('radiografia de cadera') ||
    n2.includes('radiografia ap') ||
    n2.includes('radiografia de tobillo') ||
    (n2.includes('radiografia') && (n2.includes('pierna') || n2.includes('tibia') || n2.includes('lumbar') || n2.includes('codo')));
  if (isBoneRx1 && isBoneRx2) {
    return true;
  }
  if (n1.includes('probnp') || n1.includes('pro-bnp') || /\bbnp\b/.test(n1) || n1.includes('peptido natriuretico')) {
    return n2.includes('probnp') || n2.includes('pro-bnp') || /\bbnp\b/.test(n2) || n2.includes('peptido natriuretico');
  }
  if (n1.includes('hba1c') || n1.includes('hemoglobina glucosilada')) {
    return n2.includes('hba1c') || n2.includes('hemoglobina glucosilada');
  }
  if (n1.includes('perfil lipidico')) {
    return n2.includes('perfil lipidico');
  }
  if (n1.includes('ferritina')) {
    return n2.includes('ferritina');
  }
  if (n1.includes('hierro serico') || n1.includes('cinetica de hierro') || n1.includes('perfil de hierro')) {
    return n2.includes('hierro serico') || n2.includes('cinetica de hierro') || n2.includes('perfil de hierro');
  }
  if (/\bana\b/.test(n1) || n1.includes('antinucleares')) {
    return /\bana\b/.test(n2) || n2.includes('antinucleares');
  }
  if (n1.includes('factor reumatoide')) {
    return n2.includes('factor reumatoide');
  }
  if (n1.includes('anti-ccp')) {
    return n2.includes('anti-ccp');
  }
  if (n1.includes('complemento')) {
    return n2.includes('complemento');
  }
  if (n1.includes('cortisol serico') || n1 === 'cortisol basal') {
    return n2.includes('cortisol serico') || n2 === 'cortisol basal';
  }
  if (n1.includes('prolactina')) {
    return n2.includes('prolactina');
  }
  if (n1.includes('toxicol')) {
    return n2.includes('toxicol');
  }
  if (n1.includes('coproparasitosc')) {
    return n2.includes('coproparasitosc');
  }
  if (n1.includes('sangre oculta')) {
    return n2.includes('sangre oculta');
  }
  if (n1.includes('coprocultivo')) {
    return n2.includes('coprocultivo');
  }
  if (n1.includes('estreptococ')) {
    return n2.includes('estreptococ');
  }
  if (n1.includes('helicobacter')) {
    return n2.includes('helicobacter');
  }
  if (/\bvih\b/.test(n1)) {
    return /\bvih\b/.test(n2);
  }
  if (n1.includes('hepatitis')) {
    return n2.includes('hepatitis');
  }

  return false;
}

function getSubcategoryRank(subcategory: string): number {
  const idx = HOSPITAL_SUBCATEGORY_ORDER.indexOf(subcategory as ComplementaryStudy['subcategory']);
  return idx === -1 ? HOSPITAL_SUBCATEGORY_ORDER.length : idx;
}

function stableHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Ordena todo el catálogo con criterio clínico hospitalario discreto:
 * - Las pruebas rutinarias universales aparecen en los primeros puestos de cada área
 *   (siguiendo el orden de STANDARD_HOSPITAL_STUDIES).
 * - Si una prueba del caso ocupa un espacio estándar (ej. Hemograma o EGO), hereda su posición estándar.
 * - Las pruebas específicas/especializadas propias del caso que no pertenecen al menú rutinario
 *   se intercalan de forma determinista y discreta en la zona media-baja de su subcategoría
 *   (nunca en posición #1 ni #2 cuando hay pruebas basales en el área).
 */
function orderStudiesDiscreetly(studies: ComplementaryStudy[], caseId: string): ComplementaryStudy[] {
  const catalogSlotRank = (study: ComplementaryStudy): number | null => {
    const directIdx = STANDARD_HOSPITAL_STUDIES.findIndex((std) =>
      study.id.startsWith(`${std.id}-`) || study.id === std.id
    );
    if (directIdx !== -1) return directIdx;
    const matchIdx = STANDARD_HOSPITAL_STUDIES.findIndex((std) =>
      isSameStudyCategory(study.name, std.name)
    );
    return matchIdx !== -1 ? matchIdx : null;
  };

  const buckets = new Map<string, { routines: Array<{ study: ComplementaryStudy; rank: number }>; specials: ComplementaryStudy[] }>();

  for (const s of studies) {
    if (!buckets.has(s.subcategory)) {
      buckets.set(s.subcategory, { routines: [], specials: [] });
    }
    const bucket = buckets.get(s.subcategory)!;
    const rank = catalogSlotRank(s);
    if (rank !== null) {
      bucket.routines.push({ study: s, rank });
    } else {
      bucket.specials.push(s);
    }
  }

  const orderedSubcategories = Array.from(buckets.keys()).sort(
    (a, b) => getSubcategoryRank(a) - getSubcategoryRank(b)
  );

  const result: ComplementaryStudy[] = [];
  for (const sub of orderedSubcategories) {
    const bucket = buckets.get(sub)!;
    bucket.routines.sort((a, b) => a.rank - b.rank || a.study.name.localeCompare(b.study.name, 'es'));
    const subList = bucket.routines.map((r) => r.study);

    // Ordenar especiales de manera determinista por hash antes de insertarlos discretamente
    const specialsSorted = [...bucket.specials].sort(
      (a, b) =>
        (stableHash(`${caseId}:${a.id}`) % 997) - (stableHash(`${caseId}:${b.id}`) % 997) ||
        a.name.localeCompare(b.name, 'es')
    );

    for (const sp of specialsSorted) {
      if (subList.length === 0) {
        subList.push(sp);
      } else if (subList.length <= 2) {
        // Nunca #1 si ya existe al menos 1 estudio rutinario en la subcategoría
        subList.push(sp);
      } else {
        // Intercalar en zona media-baja: al menos después de los 2 primeros estudios rutinarios
        const minIdx = Math.min(subList.length, Math.max(2, Math.floor(subList.length * 0.45)));
        const span = Math.max(1, subList.length - minIdx + 1);
        const insertIdx = minIdx + (stableHash(`${caseId}:${sp.id}:${sp.name}`) % span);
        subList.splice(insertIdx, 0, sp);
      }
    }

    result.push(...subList);
  }

  return result;
}

/**
 * Enriquece un caso clínico con el catálogo unificado de pruebas hospitalarias.
 * 1. Descompone cualquier estudio agrupado del caso en pruebas únicas independientes
 *    y limpia paréntesis o etiquetas que den pistas diagnósticas.
 * 2. Añade todas las pruebas únicas del catálogo hospitalario que no existan ya en el caso,
 *    resolviendo hallazgos contextuales relacionados fisiopatológicamente.
 * 3. Ordena discretamente para evitar que las pruebas específicas queden arriba dando pistas.
 */
export function enrichCaseWithHospitalCatalog(cCase: ClinicalCase): ClinicalCase {
  const existingStudies = normalizeStudiesPoolToSingleTests(cCase.studiesPool || []);
  const mergedStudies: ComplementaryStudy[] = [...existingStudies];

  for (const stdStudy of STANDARD_HOSPITAL_STUDIES) {
    const alreadyHas = existingStudies.some((s) => isSameStudyCategory(s.name, stdStudy.name));
    if (!alreadyHas) {
      mergedStudies.push(resolveContextualHospitalStudy(stdStudy, cCase));
    }
  }

  return {
    ...cCase,
    studiesPool: orderStudiesDiscreetly(mergedStudies, cCase.id || 'default'),
  };
}
