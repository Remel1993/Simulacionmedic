import { ComplementaryStudy } from '../types/clinical';

interface SingleTestSpec {
  key: string;
  canonicalName: string;
  category: ComplementaryStudy['category'];
  subcategory: ComplementaryStudy['subcategory'];
  namePattern: RegExp;
  resultPattern: RegExp;
  excludeNamePattern?: RegExp;
  defaultReferenceRange?: string;
}

function fold(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Catálogo de pruebas individuales para descomponer cualquier orden agrupada ("mezcla")
 * en pruebas únicas independientes, con extracción aislada de su resultado y subcategoría.
 * Todas las expresiones regulares se evalúan sobre texto normalizado sin tildes (fold).
 */
const SINGLE_TEST_SPECS: SingleTestSpec[] = [
  // --- HEMATOLOGÍA ---
  {
    key: 'bh',
    canonicalName: 'Hemograma completo (Biometría Hemática con diferencial)',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\b(biometria\s+hematica|hemograma|\bbh\b)\b/,
    resultPattern: /\b(hb|hemoglobina|hematocrito|hto|leucocit\w*|neutrofil\w*|linfocit\w*|plaquet\w*|vcm|pancitopenia|anemia|leucopenia|leucocitosis|trombocitop\w*|eosinofil\w*|aneosinofil\w*|cayad\w*|monocit\w*|eritrocit\w*|panmielosis)\b/,
    defaultReferenceRange: 'Leucocitos: 4,500–11,000 /mm³ | Hb: 12–16 g/dL | Plaquetas: 150,000–450,000 /mm³',
  },
  {
    key: 'frotis',
    canonicalName: 'Frotis de sangre periférica',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\bfrotis(?:\s+de\s+sangre\s+periferica|\s+periferico)?\b/,
    resultPattern: /\b(frotis|esquistocit\w*|linfocitos\s+atipic\w*|downey|dacriocit\w*|esferocit\w*|fragmentos\s+eritrocit\w*|blasto\w*|morfologia\s+eritrocit\w*|macroovalocit\w*|polisegmentad\w*)\b/,
    defaultReferenceRange: 'Morfología eritrocitaria y leucocitaria normal sin blastos ni esquistocitos',
  },
  {
    key: 'reticulocitos',
    canonicalName: 'Conteo de reticulocitos',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\breticulocitos?\b/,
    resultPattern: /\breticulocit\w*/,
    defaultReferenceRange: '0.5–2.0% (corregido)',
  },
  {
    key: 'coombs',
    canonicalName: 'Prueba de Coombs directo',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\bcoombs\b/,
    resultPattern: /\bcoombs(?:\s+directo)?\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'coag',
    canonicalName: 'Tiempos de coagulación (TP, TTPa, INR)',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\b(tiempos?\s+de\s+coagulacion|coagulograma|tp\/ttpa|tp\/inr|tp,\s*ttpa)\b/,
    resultPattern: /\b(tp|ttpa|inr|protrombina|fibrinogeno|coagulacion)\b/,
    defaultReferenceRange: 'TP: 11–13.5 s | TTPa: 25–35 s | INR: 0.9–1.15',
  },
  {
    key: 'grupo_rh',
    canonicalName: 'Grupo sanguíneo y factor Rh',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\b(grupo\s*(?:\/|\s*y\s*)?rh|grupo\s+sanguineo|tipificacion\s+de\s+grupo)\b/,
    resultPattern: /\b(grupo\s*(?:sanguineo|y\s*factor|o|a|b|ab)|factor\s*rh|rh\s*[+-]|rh\s*(?:positivo|negativo)|tipificacion|coombs\s+indirecto)\b/,
  },
  {
    key: 'pruebas_cruzadas',
    canonicalName: 'Pruebas cruzadas de compatibilidad sanguínea',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\bpruebas?\s+cruzadas?\b/,
    resultPattern: /\b(pruebas?\s+cruzadas?|compatibilidad|reserva\s+hemocomponent\w*|grupo\s+sanguineo)\b/,
  },
  {
    key: 'dimero_d',
    canonicalName: 'Dímero D cuantitativo',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\bdimero\s*d\b/,
    resultPattern: /\bdimero\s*d\b/,
    defaultReferenceRange: '< 500 ng/mL FEU',
  },
  {
    key: 'perfil_ferrico',
    canonicalName: 'Hierro sérico, TIBC y saturación de transferrina',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\b(cinetica\s+de\s+hierro|perfil\s+de\s+hierro)\b/,
    resultPattern: /\b(hierro\s+serico|tibc|saturacion\s+de\s+transferrina|transferrina)\b/,
    defaultReferenceRange: 'Hierro: 60–170 mcg/dL | Sat. transferrina: 20–50%',
  },
  {
    key: 'ferritina',
    canonicalName: 'Ferritina sérica',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\bferritina\b/,
    resultPattern: /\bferritina\b/,
    defaultReferenceRange: '30–300 ng/mL',
  },
  {
    key: 'aspirado_mo',
    canonicalName: 'Aspirado de médula ósea',
    category: 'Laboratorio',
    subcategory: 'Hematología',
    namePattern: /\baspirado\s+(?:de\s+)?medula(?:r|\s+osea)\b/,
    resultPattern: /\b(aspirado|medula\s+osea|amastigote\w*|leishman-donovan|macrofagos)\b/,
  },

  // --- BIOQUÍMICA ---
  {
    key: 'quimica',
    canonicalName: 'Química sanguínea básica (Glucosa, Urea, Creatinina, BUN)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(quimica\s+(?:sanguinea|renal)|quimica\b|funcion\s+renal|creatinina(?:\s+serica)?|urea\s+y\s+creatinina|nitrogeno\s+ureico|perfil\s+bioquimico)\b/,
    resultPattern: /\b(creatinina|urea|bun|tfg|ckd-epi|azoado\w*|azoemia|glucosa(?:\s*(?:serica|ayuno|venosa))?|glucemia)\b/,
    defaultReferenceRange: 'Glucosa: 70–100 mg/dL | Urea: 15–40 mg/dL | Creatinina: 0.6–1.2 mg/dL',
  },
  {
    key: 'glucosa',
    canonicalName: 'Glucosa sérica',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(glucosa(?:\s+(?:basal|en\s+ayuno|venosa|serica))?|glucemia(?:\s+(?:central|confirmatoria))?)\b/,
    resultPattern: /\b(glucosa|glucemia)\b/,
    defaultReferenceRange: '70–99 mg/dL (ayuno)',
  },
  {
    key: 'insulina',
    canonicalName: 'Insulina sérica basal',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\binsulina\b/,
    resultPattern: /\binsulina\b/,
    defaultReferenceRange: '2.6–24.9 mcUI/mL',
  },
  {
    key: 'hba1c',
    canonicalName: 'Hemoglobina Glucosilada (HbA1c)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(hba1c|hemoglobina\s+glucosilada)\b/,
    resultPattern: /\bhba1c\b/,
    defaultReferenceRange: '< 5.7%',
  },
  {
    key: 'lipidos',
    canonicalName: 'Perfil lipídico (Colesterol total, LDL, HDL, Triglicéridos)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bperfil\s+(?:de\s+)?lipid\w*/,
    resultPattern: /\b(colesterol|ldl|hdl|triglicerid\w*|perfil\s+lipid\w*)\b/,
    defaultReferenceRange: 'Colesterol <200 mg/dL | LDL <100 mg/dL | Triglicéridos <150 mg/dL',
  },
  {
    key: 'ldh',
    canonicalName: 'Lactato deshidrogenasa (LDH)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bldh\b/,
    resultPattern: /\bldh\b/,
    defaultReferenceRange: '120–246 U/L',
  },
  {
    key: 'cpk',
    canonicalName: 'Creatina fosfoquinasa (CPK total)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(cpk|creatina\s+fosfoquinasa)\b/,
    resultPattern: /\b(cpk|creatina\s+fosfoquinasa)\b/,
    defaultReferenceRange: '30–200 U/L',
  },
  {
    key: 'amilasa',
    canonicalName: 'Amilasa sérica',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bamilasa\b/,
    resultPattern: /\bamilasa\b/,
    defaultReferenceRange: '28–100 U/L',
  },
  {
    key: 'lipasa',
    canonicalName: 'Lipasa sérica',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\blipasa\b/,
    resultPattern: /\blipasa\b/,
    defaultReferenceRange: '13–60 U/L',
  },
  {
    key: 'acido_urico',
    canonicalName: 'Ácido úrico sérico',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bacido\s+urico\b/,
    resultPattern: /\bacido\s+urico\b/,
    defaultReferenceRange: '3.5–7.2 mg/dL',
  },
  {
    key: 'cetonemia',
    canonicalName: 'Cetonemia sérica (Beta-hidroxibutirato)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(cetonemia|cetonas|beta-hidroxibutirato)\b/,
    resultPattern: /\b(beta-hidroxibutirato|cetona\w*|cetonemia)\b/,
    defaultReferenceRange: '< 0.6 mmol/L',
  },
  {
    key: 'osmolaridad',
    canonicalName: 'Osmolaridad sérica efectiva',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(osmolaridad|brecha\s+.*osmolar|osmolalidad)\b/,
    resultPattern: /\b(osmolaridad|osmolar|mosm\/kg)\b/,
    defaultReferenceRange: '275–295 mOsm/kg',
  },
  {
    key: 'tsh',
    canonicalName: 'Perfil tiroideo (TSH y T4 libre)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(perfil\s+tiroideo|tsh(?:\s+serica)?)\b/,
    resultPattern: /\b(tsh|t4\s*libre|t4l|t3)\b/,
    defaultReferenceRange: 'TSH: 0.4–4.2 mUI/L | T4L: 0.8–1.8 ng/dL',
  },
  {
    key: 'anti_tpo',
    canonicalName: 'Anticuerpos anti-peroxidasa tiroidea (Anti-TPO)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\banti-tpo\b/,
    resultPattern: /\banti-tpo\b/,
    defaultReferenceRange: '< 35 UI/mL',
  },
  {
    key: 'trab',
    canonicalName: 'Anticuerpos anti-receptor de TSH (TRAb)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(anti-receptor\s+de\s+tsh|trab)\b/,
    resultPattern: /\b(trab|anti-receptor\s+de\s+tsh)\b/,
    defaultReferenceRange: '< 1.75 UI/L',
  },
  {
    key: 'prolactina',
    canonicalName: 'Prolactina sérica',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bprolactina\b/,
    resultPattern: /\bprolactina\b/,
    defaultReferenceRange: '4.8–23.3 ng/mL',
  },
  {
    key: 'perfil_hormonal_femenino',
    canonicalName: 'Perfil hormonal ovárico (LH, FSH, Testosterona total)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bperfil\s+hormonal\b/,
    resultPattern: /\b(testosterona|lh\/fsh|lh|fsh|estradiol)\b/,
  },
  {
    key: 'bhcg',
    canonicalName: 'Fracción Beta de Gonadotropina Coriónica Humana (β-hCG cuantitativa)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(bhcg|beta-hcg|β-hcg|subunidad\s+beta|prueba\s+(?:rapida\s+|inmunologica\s+)?de\s+embarazo)\b/,
    resultPattern: /\b(hcg|bhcg|beta-hcg|β-hcg|embarazo)\b/,
    defaultReferenceRange: 'Negativo (< 5.0 mUI/mL)',
  },
  {
    key: 'supresion_dexametasona',
    canonicalName: 'Prueba de supresión nocturna con 1 mg de dexametasona (Nugent)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(tamizaje\s+y\s+confirmacion\s+de\s+hipercortisolismo|supresion.*dexametasona|nugent)\b/,
    resultPattern: /\b(supresion|nugent|dexametasona)\b/,
    defaultReferenceRange: 'Cortisol 08:00 h < 1.8 mcg/dL',
  },
  {
    key: 'cortisol_urinario_24h',
    canonicalName: 'Cortisol libre en orina de 24 horas',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\b(hipercortisolismo|cortisol\s+libre\s+urinario)\b/,
    resultPattern: /\bcortisol\s+libre\s+urinario|mcg\/24\s*h\b/,
    defaultReferenceRange: '< 100 mcg/24 h',
  },
  {
    key: 'cortisol',
    canonicalName: 'Cortisol sérico basal',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bcortisol(?:\s+basal)?\b/,
    resultPattern: /\bcortisol(?:\s+serico|\s+salival)?\b/,
    defaultReferenceRange: '6–23 mcg/dL (08:00 h)',
  },
  {
    key: 'acth',
    canonicalName: 'Hormona adrenocorticotropa (ACTH plasmática)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bacth\b/,
    resultPattern: /\bacth\b/,
    defaultReferenceRange: '7.2–63.3 pg/mL',
  },
  {
    key: 'metanefrinas_plasma',
    canonicalName: 'Metanefrinas fraccionadas en plasma',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bmetanefrinas\s+fraccionadas\s+en\s+plasma\b|\bmetanefrinas\b.*\bplasma\b/,
    resultPattern: /\b(metanefrinas\s+plasmatic\w*|normetanefrina\s+plasmatic\w*)\b/,
    defaultReferenceRange: 'Metanefrina <0.5 nmol/L | Normetanefrina <0.9 nmol/L',
  },
  {
    key: 'metanefrinas_orina',
    canonicalName: 'Metanefrinas fraccionadas en orina de 24 horas',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\bmetanefrinas\b.*\borina\b/,
    resultPattern: /\bmetanefrinas\s+urinarias\b/,
    defaultReferenceRange: '< 400 mcg/24 h',
  },
  {
    key: 'anti_achr',
    canonicalName: 'Anticuerpos anti-receptor de acetilcolina (Anti-AChR)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(anti-achr|receptor\s+de\s+acetilcolina)\b/,
    resultPattern: /\b(anti-achr|acetilcolina)\b/,
    defaultReferenceRange: '< 0.5 nmol/L',
  },
  {
    key: 'adamts13',
    canonicalName: 'Actividad de metaloproteasa ADAMTS13',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\badamts13\b/,
    resultPattern: /\badamts13\b/,
    defaultReferenceRange: '> 50%',
  },
  {
    key: 'epo',
    canonicalName: 'Eritropoyetina sérica (EPO)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(eritropoyetina|epo)\b/,
    resultPattern: /\b(eritropoyetina|epo)\b/,
    defaultReferenceRange: '4.3–29 mUI/mL',
  },
  {
    key: 'jak2',
    canonicalName: 'Mutación JAK2 V617F',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bjak2\b/,
    resultPattern: /\bjak2\b/,
    defaultReferenceRange: 'No detectada',
  },
  {
    key: 'litemia',
    canonicalName: 'Litemia sérica (Niveles de litio)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\blitemia\b/,
    resultPattern: /\b(litio|litemia)\b/,
    defaultReferenceRange: '0.6–1.2 mEq/L (terapéutico)',
  },
  {
    key: 'acetaminofen',
    canonicalName: 'Niveles séricos de paracetamol (acetaminofén)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(acetaminofen|paracetamol)\b/,
    resultPattern: /\b(acetaminofen|paracetamol|rumack)\b/,
    defaultReferenceRange: 'No tóxico (< 150 mcg/mL a las 4 h)',
  },
  {
    key: 'colinesterasa',
    canonicalName: 'Actividad de colinesterasa plasmática / eritrocitaria',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\bcolinesterasa\b/,
    resultPattern: /\bcolinesterasa\b/,
  },
  {
    key: 'aslo',
    canonicalName: 'Antiestreptolisina O (ASLO)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\baslo\b/,
    resultPattern: /\b(aslo|antiestreptolisina)\b/,
    defaultReferenceRange: '< 200 UI/mL',
  },
  {
    key: 'calcio_serico',
    canonicalName: 'Calcio sérico total',
    category: 'Laboratorio',
    subcategory: 'Electrolitos',
    namePattern: /\bcalcio\s+serico\b/,
    resultPattern: /\bcalcio\b/,
    defaultReferenceRange: '8.5–10.5 mg/dL',
  },

  // --- ELECTROLITOS ---
  {
    key: 'electrolitos',
    canonicalName: 'Electrolitos séricos (Na⁺, K⁺, Cl⁻, Ca²⁺, Mg²⁺)',
    category: 'Laboratorio',
    subcategory: 'Electrolitos',
    namePattern: /\belectrolitos?\b/,
    resultPattern: /\b(na\+|k\+|cl-|ca2\+|mg2\+|sodio|potasio|cloro|magnesio|fosforo|anion\s*gap|brecha\s+anionica|electrolit\w*)\b/,
    defaultReferenceRange: 'Na⁺: 135–145 mEq/L | K⁺: 3.5–5.1 mEq/L | Cl⁻: 98–107 mEq/L',
  },

  // --- FUNCIÓN HEPÁTICA ---
  {
    key: 'hepatico',
    canonicalName: 'Perfil hepático completo y bilirrubinas (AST, ALT, FA, BT/BD, Albúmina)',
    category: 'Laboratorio',
    subcategory: 'Función Hepática',
    namePattern: /\b(pruebas?\s+(?:de\s+)?funcion\s+hepatica|pruebas?\s+hepaticas|perfil\s+hepatico|bilirrubinas|fosfatasa\s+alcalina|proteinas\s+totales)\b/,
    resultPattern: /\b(ast|alt|tgo|tgp|bilirrubina\w*|fosfatasa\s+alcalina|albumina|globulina|proteinas\s+totales|transaminasa\w*)\b/,
    defaultReferenceRange: 'AST/ALT: <40 U/L | Bilirrubina Total: 0.2–1.2 mg/dL | Albúmina: 3.5–5.0 g/dL',
  },
  {
    key: 'ceruloplasmina',
    canonicalName: 'Ceruloplasmina sérica',
    category: 'Laboratorio',
    subcategory: 'Función Hepática',
    namePattern: /\bceruloplasmina\b/,
    resultPattern: /\bceruloplasmina\b/,
    defaultReferenceRange: '20–40 mg/dL',
  },
  {
    key: 'cobre_24h',
    canonicalName: 'Cobre urinario en orina de 24 horas',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\bcobre\s+urinario\b/,
    resultPattern: /\bcobre\b/,
    defaultReferenceRange: '< 40 mcg/24 h',
  },

  // --- GASES ---
  {
    key: 'gasometria',
    canonicalName: 'Gasometría arterial (GSA) y lactato sérico',
    category: 'Laboratorio',
    subcategory: 'Gases',
    namePattern: /\b(gasometria|cooximetria|bicarbonato)\b/,
    resultPattern: /\b(ph|paco2|pao2|pco2|hco3|lactato|cohb|carboxihemoglobina|exceso\s+de\s+base|sao2|gsa)\b/,
    defaultReferenceRange: 'pH: 7.35–7.45 | PaCO₂: 35–45 mmHg | HCO₃⁻: 22–26 mEq/L | Lactato: <2.0 mmol/L',
  },
  {
    key: 'lactato',
    canonicalName: 'Lactato sérico',
    category: 'Laboratorio',
    subcategory: 'Gases',
    namePattern: /\blactato\b/,
    resultPattern: /\blactato\b/,
    defaultReferenceRange: '< 2.0 mmol/L',
  },

  // --- INFLAMACIÓN E INFECCIÓN ---
  {
    key: 'pcr',
    canonicalName: 'Proteína C Reactiva (PCR) cuantitativa',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\b(proteina\s+c\s+reactiva|reactantes\s+de\s+fase\s+aguda|pcr)\b/,
    excludeNamePattern: /\b(hisopado|nasofaring\w*|panel\s+viral\s+respiratorio|genexpert)\b/,
    resultPattern: /\bpcr\b|proteina\s+c\s+reactiva/,
    defaultReferenceRange: '< 5.0 mg/L',
  },
  {
    key: 'vsg',
    canonicalName: 'Velocidad de Sedimentación Globular (VSG)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\b(vsg|velocidad\s+de\s+sedimentacion)\b/,
    resultPattern: /\bvsg\b|sedimentacion/,
    defaultReferenceRange: '< 20 mm/h',
  },
  {
    key: 'procalcitonina',
    canonicalName: 'Procalcitonina sérica',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\bprocalcitonina\b/,
    resultPattern: /\bprocalcitonina\b/,
    defaultReferenceRange: '< 0.25 ng/mL',
  },
  {
    key: 'ana',
    canonicalName: 'Anticuerpos Antinucleares (ANA)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\bana\b/,
    resultPattern: /\bana\b|antinucleares/,
    defaultReferenceRange: 'Negativo (< 1:80)',
  },
  {
    key: 'anti_dsdna',
    canonicalName: 'Anticuerpos anti-DNA de doble cadena (Anti-dsDNA)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\banti-dsdna\b/,
    resultPattern: /\banti-dsdna\b/,
    defaultReferenceRange: 'Negativo (< 30 UI/mL)',
  },
  {
    key: 'complemento',
    canonicalName: 'Complemento sérico (C3 y C4)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\bcomplemento(?:\s+serico)?(?:\s*\(?c3\/c4\)?)?\b/,
    resultPattern: /\b(c3|c4|complemento)\b/,
    defaultReferenceRange: 'C3: 90–180 mg/dL | C4: 10–40 mg/dL',
  },
  {
    key: 'fr',
    canonicalName: 'Factor Reumatoide (FR)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\bfactor\s+reumatoide\b/,
    resultPattern: /\bfactor\s+reumatoide|\bfr\b/,
    defaultReferenceRange: '< 14 UI/mL',
  },
  {
    key: 'anti_ccp',
    canonicalName: 'Anticuerpos anti-péptido cíclico citrulinado (Anti-CCP)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\banti-ccp\b/,
    resultPattern: /\banti-ccp\b/,
    defaultReferenceRange: '< 20 U/mL',
  },
  {
    key: 'anca',
    canonicalName: 'Anticuerpos anticitoplasma de neutrófilos (c-ANCA / p-ANCA)',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\b(panel\s+anca|anca)\b/,
    resultPattern: /\b(anca|pr3|mpo)\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'calprotectina',
    canonicalName: 'Calprotectina fecal',
    category: 'Laboratorio',
    subcategory: 'Inflamación e Infección',
    namePattern: /\bcalprotectina\b/,
    resultPattern: /\bcalprotectina\b/,
    defaultReferenceRange: '< 50 mcg/g',
  },

  // --- CARDIOVASCULAR ---
  {
    key: 'troponina',
    canonicalName: 'Troponina I de alta sensibilidad (hs-cTnI)',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    namePattern: /\btroponina\b/,
    resultPattern: /\btroponina\b/,
    defaultReferenceRange: '< 0.04 ng/mL (< 14–19 ng/L)',
  },
  {
    key: 'bnp',
    canonicalName: 'Péptido Natriurético tipo B (NT-proBNP)',
    category: 'Laboratorio',
    subcategory: 'Cardiovascular',
    namePattern: /\b(nt-probnp|probnp|peptido\s+natriuretico|bnp)\b/,
    resultPattern: /\b(nt-probnp|probnp|bnp)\b/,
    defaultReferenceRange: '< 125 pg/mL (< 300 pg/mL agudo)',
  },

  // --- URINARIO ---
  {
    key: 'ego',
    canonicalName: 'Examen general de orina (EGO) con sedimento urinario',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\b(examen\s+general\s+de\s+orina|ego|sedimento\s+urinario)\b/,
    resultPattern: /\b(ego|orina|sedimento\w*|esterasa|nitrito\w*|cilindro\w*|densidad|leucocituria|glucosuria|cetonas:\s*(?:negativ|traz|positiv)|hematuria|eritrocitos.*campo|microhematuria|proteinuria|huevos.*schistosoma)\b/,
    defaultReferenceRange: 'Sedimento limpio, proteinuria negativa, nitritos negativos',
  },
  {
    key: 'ipc_orina',
    canonicalName: 'Índice proteína/creatinina en orina (IPC)',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\b(relacion\s+proteina\/creatinina|indice\s+proteina\/creatinina|proteinuria)\b/,
    resultPattern: /\b(indice\s+proteina\/creatinina|relacion\s+proteina\/creatinina|proteinuria|mg\/g|g\/g)\b/,
    defaultReferenceRange: '< 150 mg/g (< 0.2 g/g)',
  },
  {
    key: 'rac_orina',
    canonicalName: 'Cociente albúmina/creatinina en orina (CAC)',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\bcociente\s+albumina\/creatinina\b/,
    resultPattern: /\b(cociente\s+albumina\/creatinina|albuminuria|cac)\b/,
    defaultReferenceRange: '< 30 mg/g',
  },
  {
    key: 'pbg',
    canonicalName: 'Porfobilinógeno (PBG) cuantitativo en orina',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\bporfobilinogeno\b/,
    resultPattern: /\b(porfobilinogeno|pbg|rojo-vino)\b/,
    defaultReferenceRange: '< 2.0 mg/g creatinina',
  },
  {
    key: 'ala_orina',
    canonicalName: 'Ácido delta-aminolevulínico (ALA) en orina',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\bdelta-aminolevulinico\b/,
    resultPattern: /\b(ala|aminolevulinico)\b/,
    defaultReferenceRange: '< 5.4 mg/g creatinina',
  },
  {
    key: 'toxicologico',
    canonicalName: 'Tamizaje toxicológico en orina',
    category: 'Laboratorio',
    subcategory: 'Urinario',
    namePattern: /\btamizaje\s+toxicologico\b/,
    resultPattern: /\b(toxic\w*|cocaina|opioid\w*|anfetamina\w*|benzodiacep\w*|cannab\w*)\b/,
    defaultReferenceRange: 'Negativo',
  },

  // --- MICROBIOLOGÍA / SEROLOGÍA ---
  {
    key: 'urocultivo',
    canonicalName: 'Urocultivo con recuento de colonias y antibiograma',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\burocultivo\b/,
    resultPattern: /\b(urocultivo|ufc\/ml|e\.\s*coli|bacteriuria)\b/,
    defaultReferenceRange: 'Negativo (< 10,000 UFC/mL)',
  },
  {
    key: 'hemocultivos',
    canonicalName: 'Hemocultivos seriados pareados',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bhemocultivos?\b/,
    resultPattern: /\b(hemocultivo\w*|botellas|frascos|bacteriemia|salmonella\s+enterica)\b/,
    defaultReferenceRange: 'Negativo / Sin desarrollo bacteriano',
  },
  {
    key: 'citologia_fecal',
    canonicalName: 'Citología fecal (moco y leucocitos fecales)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bcitologia\s+fecal\b/,
    resultPattern: /\b(leucocitos\s+fecales|moco\s+positivo|citologia\s+fecal)\b/,
    defaultReferenceRange: 'Sin leucocitos ni moco fecal',
  },
  {
    key: 'coprocultivo',
    canonicalName: 'Coprocultivo',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bcoprocultivo\b/,
    resultPattern: /\b(coprocultivo|flora\s+enterica|enteropatogeno\w*|shigella|campylobacter)\b/,
    defaultReferenceRange: 'Sin aislamiento de enteropatógenos',
  },
  {
    key: 'soh',
    canonicalName: 'Sangre oculta en heces (SOH)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bsangre\s+oculta\s+en\s+heces\b/,
    resultPattern: /\bsangre\s+oculta\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'gota_gruesa',
    canonicalName: 'Gota gruesa y frotis para hemoparásitos (Malaria)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bgota\s+gruesa\b/,
    resultPattern: /\b(gota\s+gruesa|malaria|plasmodium|trofozoit\w*|extendido\s+fino|palud\w*)\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'hrp2',
    canonicalName: 'Prueba rápida de antígeno palúdico (HRP2)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\b(antigeno\s+paludic\w*|hrp2)\b/,
    resultPattern: /\b(hrp2|prueba\s+rapida.*palud\w*|antig.*palud\w*)\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'vih',
    canonicalName: 'Prueba de VIH (ELISA 4ª generación)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bvih\b/,
    resultPattern: /\bvih\b/,
    defaultReferenceRange: 'No reactivo / Negativo',
  },
  {
    key: 'hepatitis_viral',
    canonicalName: 'Panel viral de hepatitis aguda (VHA, VHB, VHC)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bpanel\s+viral(?:\s+de\s+hepatitis|\s*\(vih)?\b/,
    excludeNamePattern: /\brespiratorio\b/,
    resultPattern: /\b(vha|vhb|vhc|hbsag|anti-vha|hepatitis)\b/,
    defaultReferenceRange: 'No reactivo',
  },
  {
    key: 'rk39',
    canonicalName: 'Serología rK39 (Leishmania)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\brk39\b/,
    resultPattern: /\brk39\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'baar',
    canonicalName: 'Baciloscopia de esputo seriada (BAAR)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bbaciloscopia|baar\b/,
    resultPattern: /\b(baar|baciloscopia|ziehl|bacilos?\s+acido)\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'genexpert',
    canonicalName: 'Prueba molecular GeneXpert MTB/RIF',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bgenexpert\b/,
    resultPattern: /\b(genexpert|mtb\/rif|rifampicina)\b/,
    defaultReferenceRange: 'No detectado',
  },
  {
    key: 'monotest',
    canonicalName: 'Prueba de anticuerpos heterófilos (Monotest)',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\b(monotest|anticuerpos\s+heterofilos)\b/,
    resultPattern: /\b(monotest|paul-bunnell|anti-vca|heterofil\w*)\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'strep',
    canonicalName: 'Prueba rápida de antígeno estreptocócico faríngeo',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bantigeno\s+estreptococico\b/,
    resultPattern: /\bestreptococ\w*/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'borrelia_serol',
    canonicalName: 'Serología ELISA para Borrelia burgdorferi',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\bborrelia\b/,
    resultPattern: /\b(borrelia|elisa|western\s+blot|lyme|serologia\s+inicial)\b/,
    defaultReferenceRange: 'Negativo',
  },
  {
    key: 'gram_lcr',
    canonicalName: 'Tinción de Gram y cultivo de líquido cefalorraquídeo',
    category: 'Laboratorio',
    subcategory: 'Microbiología / Serología',
    namePattern: /\btincion\s+de\s+gram\s+en\s+lcr\b/,
    resultPattern: /\b(gram|lcr|diplococos|cefalorraquideo)\b/,
    defaultReferenceRange: 'Sin microorganismos observados',
  },

  // --- VITAMINAS Y NUTRICIÓN ---
  {
    key: 'vit_b12',
    canonicalName: 'Vitamina B12 sérica (Cobalamina)',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    namePattern: /\bvitamina\s+b12\b/,
    resultPattern: /\b(vitamina\s+b12|cobalamina)\b/,
    defaultReferenceRange: '210–911 pg/mL',
  },
  {
    key: 'acido_folico',
    canonicalName: 'Ácido fólico (Folato) sérico',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    namePattern: /\bacido\s+folico\b/,
    resultPattern: /\b(acido\s+folico|folato)\b/,
    defaultReferenceRange: '3.8–20.0 ng/mL',
  },
  {
    key: 'homocisteina',
    canonicalName: 'Homocisteína sérica total',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    namePattern: /\bhomocisteina\b/,
    resultPattern: /\bhomocisteina\b/,
    defaultReferenceRange: '5–15 µmol/L',
  },
  {
    key: 'vit_d',
    canonicalName: 'Vitamina D (25-OH-Vitamina D total)',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    namePattern: /\bvitamina\s+d\b/,
    resultPattern: /\b(vitamina\s+d|hidroxivitamina\s+d)\b/,
    defaultReferenceRange: '30–100 ng/mL',
  },
  {
    key: 'pth',
    canonicalName: 'Hormona Paratiroidea (PTH intacta)',
    category: 'Laboratorio',
    subcategory: 'Bioquímica',
    namePattern: /\b(hormona\s+paratiroidea|pth)\b/,
    resultPattern: /\bpth\b|paratiroidea/,
    defaultReferenceRange: '15–65 pg/mL',
  },
  {
    key: 'vit_b6',
    canonicalName: 'Vitamina B6 sérica (Piridoxal fosfato)',
    category: 'Laboratorio',
    subcategory: 'Vitaminas y Nutrición',
    namePattern: /\bvitamina\s+b6\b/,
    resultPattern: /\b(vitamina\s+b6|piridox\w*)\b/,
    defaultReferenceRange: '5–50 mcg/L',
  },

  // --- IMAGEN ---
  {
    key: 'us_pelvico',
    canonicalName: 'Ultrasonido pélvico / transvaginal',
    category: 'Imagen',
    subcategory: 'Ecografía',
    namePattern: /\bultrasonido\s+pelvico(?:\s+transvaginal)?\b/,
    resultPattern: /\b(utero|ovario\w*|salping\w*|anex\w*|saco\s+gestacional|fondo\s+de\s+saco|endometrio)\b/,
  },
  {
    key: 'us_renal',
    canonicalName: 'Ultrasonido renal y vesical',
    category: 'Imagen',
    subcategory: 'Ecografía',
    namePattern: /\b(ecografia|ultrasonido)\s+renal(?:\s+y\s+vesical)?\b/,
    resultPattern: /\b(rinon\w*|renal|corticomedular|hidronefrosis|vejiga)\b/,
  },
  {
    key: 'doppler_venoso',
    canonicalName: 'Ultrasonido Doppler venoso de miembro inferior',
    category: 'Imagen',
    subcategory: 'Ecografía',
    namePattern: /\b(ecografia|ultrasonido)\s+doppler\s+venos\w*/,
    resultPattern: /\b(doppler|venos\w*|safen\w*|poplite\w*|femoral|reflujo)\b/,
  },
  {
    key: 'itb',
    canonicalName: 'Índice Tobillo-Brazo (ITB)',
    category: 'Gabinete y Trazados',
    subcategory: 'Cardiovascular',
    namePattern: /\bindice\s+tobillo-brazo\b/,
    resultPattern: /\b(itb|tobillo-brazo)\b/,
    defaultReferenceRange: '0.90–1.30',
  },
  {
    key: 'tac_craneo',
    canonicalName: 'Tomografía axial computarizada (TAC) simple de cráneo',
    category: 'Imagen',
    subcategory: 'Tomografía',
    namePattern: /\btomografia\s+(?:axial\s+)?computarizada\s*\(?tac\)?\s+de\s+craneo\b/,
    resultPattern: /\b(parenquima|hemorragia\s+subaracnoidea|cisternas|ventricul\w*|tac\s+simple|hiperdensidad)\b/,
  },
  {
    key: 'angiotac_craneo',
    canonicalName: 'Angiotomografía (Angio-TAC) cerebral',
    category: 'Imagen',
    subcategory: 'Tomografía',
    namePattern: /\bangio-?tac\b/,
    excludeNamePattern: /\btorax\b/,
    resultPattern: /\b(angio-?tac|aneurisma|poligono\s+de\s+willis|arteria\s+comunicante)\b/,
  },
  {
    key: 'tac_torax',
    canonicalName: 'Tomografía computarizada (TAC) de tórax de alta resolución',
    category: 'Imagen',
    subcategory: 'Tomografía',
    namePattern: /\btac\s+de\s+torax\b/,
    resultPattern: /\b(tac\s+torax|nodulos\s+pulmonares|cavitacion|vidrio\s+deslustrado)\b/,
  },
  {
    key: 'tac_senos',
    canonicalName: 'Tomografía computarizada (TAC) de senos paranasales',
    category: 'Imagen',
    subcategory: 'Tomografía',
    namePattern: /\bsenos\s+paranasales\b/,
    resultPattern: /\b(tac\s+senos|pansinusal|tabique\s+nasal|senos?\s+paranasal\w*)\b/,
  },
  {
    key: 'tac_abdomen',
    canonicalName: 'Tomografía computarizada (TAC) de abdomen',
    category: 'Imagen',
    subcategory: 'Tomografía',
    namePattern: /\btac\s+abdomin(?:al|\s+de\s+abdomen)\b/,
    resultPattern: /\b(tac\s+abdomen|obstruccion|visceral)\b/,
  },
  {
    key: 'rx_manos',
    canonicalName: 'Radiografía comparativa de manos y muñecas',
    category: 'Imagen',
    subcategory: 'Radiología',
    namePattern: /\bradiografia\s+comparativa\s+de\s+manos\b/,
    resultPattern: /\b(radiografia|erosiones|osteopenia|espacio\s+articular|carpo|metacarp\w*)\b/,
  },

  // --- GABINETE / OFTALMOLOGÍA ---
  {
    key: 'tonometria_ocular',
    canonicalName: 'Tonometría ocular (Presión intraocular)',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    namePattern: /\btonometria\b/,
    resultPattern: /\b(presion\s+intraocular|pio|mmhg|palpacion\s+suave)\b/,
    defaultReferenceRange: '10–21 mmHg',
  },
  {
    key: 'lampara_hendidura',
    canonicalName: 'Biomicroscopía con lámpara de hendidura',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    namePattern: /\blampara\s+de\s+hendidura\b/,
    resultPattern: /\b(cornea|epitelial|fluoresceina|camara\s+anterior|angulo\s+iridocorneal|gonioscopia|hipopion)\b/,
  },
  {
    key: 'ecg',
    canonicalName: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    namePattern: /\b(electrocardiograma|ecg)\b/,
    resultPattern: /\b(ritmo|sinusal|qrs|qt|qtc|segmento\s+st|onda\s+t|ecg|frecuencia\s+cardiaca|bloqueo\s+av|intervalo\s+pr)\b/,
  },
  {
    key: 'ecocardiograma',
    canonicalName: 'Ecocardiograma transtorácico (ECOTT)',
    category: 'Imagen',
    subcategory: 'Ecografía',
    namePattern: /\b(ecocardiograma|ventriculografia)\b/,
    resultPattern: /\b(ecocardiograma|ventriculografia|eco|fevi|acinesia|hipocinesia|tako-?tsubo|pericardi\w*|valvul\w*)\b/,
  },
  {
    key: 'coronariografia',
    canonicalName: 'Coronariografía diagnóstica',
    category: 'Gabinete y Trazados',
    subcategory: 'Cardiovascular',
    namePattern: /\bcoronariografia\b/,
    resultPattern: /\b(coronariografia|arterias\s+coronarias|obstructiv\w*|estenosis\s+coronaria)\b/,
  },
  {
    key: 'cvf',
    canonicalName: 'Capacidad Vital Forzada (CVF) a la cabecera',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    namePattern: /\bcapacidad\s+vital\s+forzada\b/,
    resultPattern: /\b(capacidad\s+vital|cvf)\b/,
    defaultReferenceRange: '> 30 mL/kg',
  },
  {
    key: 'nif',
    canonicalName: 'Fuerza Inspiratoria Negativa (NIF)',
    category: 'Gabinete y Trazados',
    subcategory: 'Función Pulmonar y Audiología',
    namePattern: /\bfuerza\s+inspiratoria\s+negativa\b/,
    resultPattern: /\bnif\b|fuerza\s+inspiratoria/,
    defaultReferenceRange: '< -30 cmH2O',
  },
];

/**
 * Elimina paréntesis o frases en el título del estudio que dan pistas sobre
 * el diagnóstico, urgencia artificial o conducta esperada.
 */
export function sanitizeStudyDisplayName(rawName: string): string {
  let name = (rawName || '').trim();

  name = name
    .replace(
      /\s*\((?:para\s+SCORTEN|pre-tratamiento|tomados\s+antes\s+de\s+esteroide|previo\s+a\s+antibi[oó]tico|descarte\s+[^)]+|para\s+descartar\s+[^)]+|Protocolo\s+de\s+Aorta|FAST\s+p[eé]lvico|si\s+se\s+solicita\s+por\s+duda|si\s+duda\s+o\s+extensi[oó]n\s+profunda|solo\s+casos\s+refractarios|control\s+preventivo|protegida\s+de\s+la\s+luz|muestra\s+de\s+mediod[ií]a[^)]*|Criterios\s+IADPSG\/ADA|curva\s+0h\s+y\s+1-2h|<\s*10\s*minutos|descarte\s+basal)\)/gi,
      ''
    )
    .replace(/\s*\/\s*criterios\s+de\s+Amsel/gi, '')
    .replace(/\s*\+\s*(?:Panel\s+basal\s+pre-FAME|Revisi[oó]n\s+farmacol[oó]gica)\b/gi, '')
    .replace(/\s+URGENTE\b/gi, '')
    .replace(/\s+de\s+urgencia\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return name || rawName;
}

function splitResultSegments(resultText: string): string[] {
  const byPipe = (resultText || '')
    .split(/\s*\|\s*|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const chunk of byPipe) {
    const sentences = chunk
      .split(/(?<!\b(?:[A-Z]|No|Dr|Dra|Sr|Sra|Ej|vs|aprox|min|seg|hrs?|ref|Fig|Vol))\.\s+(?=[A-ZÁÉÍÓÚÑ])/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const sent of sentences) {
      if (/\s+y\s+(?=(?:NT-proBNP|proBNP|BNP|ACTH|LDH|Coombs|Frotis|Lipasa|Amilasa|Creatinina|Lactato|VSG|PCR)\b)/i.test(sent)) {
        const subClauses = sent
          .split(/\s+y\s+(?=(?:NT-proBNP|proBNP|BNP|ACTH|LDH|Coombs|Frotis|Lipasa|Amilasa|Creatinina|Lactato|VSG|PCR)\b)/i)
          .map((s) => s.trim())
          .filter(Boolean);
        out.push(...subClauses);
      } else {
        out.push(sent);
      }
    }
  }
  return out;
}

function inferSegmentAbnormality(segmentText: string, fallbackAbnormal: boolean): boolean {
  const norm = fold(segmentText);
  const normWithoutRefRanges = norm
    .replace(/\(\s*(?:no\s+suprime\s*;\s*)?normal\s*[<>≤≥]?[^)]*\)/g, '')
    .replace(/\b\d+(?:[.,]\d+)?x\s+lo\s+normal\b/g, '')
    .replace(/\bnormal\s*[<>≤≥]\s*\d+(?:[.,]\d+)?/g, '');

  const hasExplicitNormal =
    /\b(normal(?:es)?|negativ[oa]s?|no\s+reactivo|no\s+detectad[oa]|sin\s+desarrollo|sin\s+lesiones|sin\s+alteraciones|completamente\s+normal|indeterminada)\b/.test(
      normWithoutRefRanges
    );
  const hasExplicitAbnormal =
    /\b(positiv[oa]s?|elevad[oa]s?|baj[oa]s?|critica?s?|severa?|alta?s?|anormal|prolongad\w*|esquistocit\w*|pancitopenia|leucocitosis|leucopenia|trombocitopenia|hiponatremia|hiperkalemia|acidosis|amastigote\w*|acinesia|colgajo|flap|derrame|consolidacion|suprimida|engrosamiento|erosion|aneosinofilia|atipic\w*|downey|no\s+suprime|inapropiadamente|\d+(?:[.,]\d+)?x\s+lo\s+normal|veces\s+(?:lo\s+)?normal)\b/.test(
      norm
    );

  if (hasExplicitAbnormal && !/\bnormal\b.*\bdescarta\b/.test(normWithoutRefRanges)) {
    return true;
  }
  if (hasExplicitNormal && !hasExplicitAbnormal) {
    return false;
  }
  return fallbackAbnormal;
}

function isAlreadyCohesiveSingleOrder(name: string): boolean {
  const n = fold(name);

  if (
    /^(hemograma\s+completo|biometria\s+hematica\s+completa)(\s*\([^)]*\))?$/.test(n) ||
    /^quimica\s+sanguinea\s+(basica|completa)?\s*(\([^)]*\))?$/.test(n) ||
    /^electrolitos\s+sericos(\s*\([^)]*\))?$/.test(n) ||
    /^perfil\s+hepatico\s+completo(\s+y\s+bilirrubinas)?(\s*\([^)]*\))?$/.test(n) ||
    /^perfil\s+tiroideo(\s*\([^)]*\))?$/.test(n) ||
    /^gasometria\s+(arterial|venosa)(\s*\([^)]*\))?(\s+y\s+lactato(\s+serico)?)?$/.test(n) ||
    /^examen\s+general\s+de\s+orina(\s*\([^)]*\))?(\s+y\s+sedimento\s+urinario|\s+con\s+sedimento\s+urinario)?$/.test(n) ||
    /^tiempos?\s+de\s+coagulacion(\s*\([^)]*\))?$/.test(n) ||
    /^electrocardiograma(\s+estandar)?(\s+de\s+12\s+derivaciones)?/.test(n) ||
    /^(radiografia|rx)\s+(ap|pa|portatil|lateral|simple|anteroposterior|comparativa)/.test(n) ||
    /^(panel\s+viral\s+respiratorio|hisopado\s+nasofaringeo)/.test(n) ||
    (/^(tomografia|tac|urotomografia|angiotac|angiotomografia|resonancia\s+magnetica|rmn)\b/.test(n) &&
      !/\+/.test(n) &&
      !/\bsenos\s+paranasales\b/.test(n) &&
      !/\by\s+(?:ecg|electrocardiograma|biometria|quimica|electrolitos|revis|angio)/i.test(n)) ||
    (/^(ultrasonido|ecografia|ecocardiograma)\b/.test(n) &&
      !/\+/.test(n) &&
      !/\by\s+(?:biometria|pcr|ego|perfil|troponina|itb)/i.test(n)) ||
    (/^(espirometria|electroencefalograma|electromiografia|colonoscopia|broncoscopia|endoscopia|monitoreo\s+holter|holter)\b/.test(n) &&
      !/\+/.test(n)) ||
    /^(estudio\s+de\s+flujo\s+vaginal|ph\s+vaginal|puncion\s+lumbar|prueba\s+rapida\s+de\s+antigeno|antigeno\s+de\s+helicobacter)/.test(n)
  ) {
    const hasMixedExtra =
      /\b(ego|bhcg|beta-hcg|β-hcg|embarazo|pcr|vsg|grupo\s*(?:\/|\s*y\s*rh|sanguineo)|hemocultivo|urocultivo|perfil\s+(?:lipid|tiroideo|hepatico)|pruebas\s+cruzadas|anti-tpo|trab|cortisol|lactato|biom|electro|troponina|frotis|coombs|ldh)\b/.test(
        n.replace(/\([^)]*\)/g, '')
      );
    if (
      !hasMixedExtra ||
      /^gasometria\b.*\by\s+lactato/.test(n) ||
      /^perfil\s+hepatico\b.*\by\s+bilirrubinas/.test(n)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Convierte un estudio potencialmente agrupado ("mezcla") en una lista de estudios únicos
 * individuales, limpiando pistas del título y aislando los resultados por analito.
 */
export function normalizeStudyIntoSingleTests(study: ComplementaryStudy): ComplementaryStudy[] {
  let cleanedName = sanitizeStudyDisplayName(study.name);
  if (/^resonancia\s+magn[eé]tica\s*\/\s*tac\s+cerebral/i.test(cleanedName)) {
    cleanedName = 'Resonancia Magnética (RMN) de encéfalo';
  }
  if (/^tac\s*\/\s*rmn\s+de\s+abdomen\s+enfocada\s+en\s+gl[aá]ndulas\s+suprarrenales/i.test(cleanedName)) {
    cleanedName = 'Tomografía computarizada (TAC) de abdomen con enfoque suprarrenal';
  }
  if (/^gasometr[ií]a\s+(?:arterial\s*\/\s*venosa|venosa\s*\/\s*arterial)$/i.test(cleanedName)) {
    cleanedName = 'Gasometría arterial (GSA) y lactato sérico';
  }

  if (isAlreadyCohesiveSingleOrder(cleanedName)) {
    return [{ ...study, name: cleanedName }];
  }

  const foldedName = fold(cleanedName);
  const matchedSpecs: Array<{ spec: SingleTestSpec; pos: number }> = [];

  for (const spec of SINGLE_TEST_SPECS) {
    if (spec.excludeNamePattern && spec.excludeNamePattern.test(foldedName)) {
      continue;
    }
    const match = foldedName.match(spec.namePattern);
    if (match && typeof match.index === 'number') {
      matchedSpecs.push({ spec, pos: match.index });
    }
  }

  matchedSpecs.sort((a, b) => a.pos - b.pos);

  const dedupedSpecs: SingleTestSpec[] = [];
  for (const item of matchedSpecs) {
    if (dedupedSpecs.some((s) => s.key === item.spec.key)) continue;
    if (
      item.spec.key === 'glucosa' &&
      dedupedSpecs.some((s) => s.key === 'quimica') &&
      /quimica\s+sanguinea\s*\([^)]*glucosa/.test(foldedName)
    ) {
      continue;
    }
    if (
      item.spec.key === 'lactato' &&
      dedupedSpecs.some((s) => s.key === 'gasometria')
    ) {
      continue;
    }
    if (
      item.spec.key === 'grupo_rh' &&
      dedupedSpecs.some((s) => s.key === 'pruebas_cruzadas')
    ) {
      continue;
    }
    if (
      (item.spec.key === 'cortisol' || item.spec.key === 'cortisol_urinario_24h') &&
      dedupedSpecs.some((s) => s.key === 'supresion_dexametasona') &&
      !/cortisol\s+basal/.test(foldedName) &&
      !fold(study.result).includes('cortisol libre urinario')
    ) {
      continue;
    }
    dedupedSpecs.push(item.spec);
  }

  if (
    dedupedSpecs.some((s) => s.key === 'supresion_dexametasona') &&
    fold(study.result).includes('cortisol libre urinario') &&
    !dedupedSpecs.some((s) => s.key === 'cortisol_urinario_24h')
  ) {
    const urinSpec = SINGLE_TEST_SPECS.find((s) => s.key === 'cortisol_urinario_24h');
    if (urinSpec) dedupedSpecs.push(urinSpec);
  }

  // Si química sanguínea básica ya forma parte del panel (y ya incluye glucosa), no emitir un segundo card duplicado de Glucosa sérica
  if (dedupedSpecs.some((s) => s.key === 'quimica')) {
    const gIdx = dedupedSpecs.findIndex((s) => s.key === 'glucosa');
    if (gIdx !== -1) {
      dedupedSpecs.splice(gIdx, 1);
    }
  }

  if (dedupedSpecs.length <= 1) {
    if (dedupedSpecs.length === 1) {
      const onlySpec = dedupedSpecs[0];
      return [
        {
          ...study,
          name: cleanedName,
          category: onlySpec.category,
          subcategory: onlySpec.subcategory,
        },
      ];
    }
    return [{ ...study, name: cleanedName }];
  }

  const segments = splitResultSegments(study.result);
  const segmentsMatchedByAny = dedupedSpecs.some((spec) =>
    segments.some((seg) => spec.resultPattern.test(fold(seg)))
  );

  const splitStudies: ComplementaryStudy[] = [];

  for (const spec of dedupedSpecs) {
    const matchedSegments = segments.filter((seg) => spec.resultPattern.test(fold(seg)));

    if (matchedSegments.length === 0 && segmentsMatchedByAny) {
      continue;
    }

    let isolatedResult =
      matchedSegments.length > 0 ? matchedSegments.join(' | ') : study.result;

    // Si una línea agrupada de serologías negativas comparte VIH/VHC/VHB, presentar solo el analito correspondiente
    if (
      matchedSegments.length === 1 &&
      /serolog[ií]as?\s+vih\s*\/\s*vhc\s*\/\s*vhb:\s*negativas/i.test(isolatedResult)
    ) {
      if (spec.key === 'vih') {
        isolatedResult = 'ELISA 4.ª generación para VIH: No reactivo (Negativo).';
      } else if (spec.key === 'hepatitis_viral') {
        isolatedResult = 'HBsAg: No reactivo (Negativo) | Anti-VHC: No reactivo (Negativo).';
      }
    }

    const segAbnormal =
      matchedSegments.length > 0
        ? inferSegmentAbnormality(isolatedResult, study.isAbnormal)
        : study.isAbnormal;

    splitStudies.push({
      id: `${study.id}__${spec.key}`,
      category: spec.category,
      subcategory: spec.subcategory,
      name: spec.canonicalName,
      result: isolatedResult,
      referenceRange: spec.defaultReferenceRange || study.referenceRange,
      interpretation: segAbnormal
        ? study.interpretation
        : `${spec.canonicalName} sin alteraciones patológicas agudas en el cuadro actual.`,
      isAbnormal: segAbnormal,
    });
  }

  return splitStudies.length > 0 ? splitStudies : [{ ...study, name: cleanedName }];
}

export function normalizeStudiesPoolToSingleTests(studies: ComplementaryStudy[]): ComplementaryStudy[] {
  const expanded: ComplementaryStudy[] = [];
  const seenNames = new Set<string>();

  for (const study of studies) {
    const singles = normalizeStudyIntoSingleTests(study);
    for (const s of singles) {
      const normKey = fold(s.name).trim();
      if (!seenNames.has(normKey)) {
        seenNames.add(normKey);
        expanded.push(s);
      }
    }
  }

  return expanded;
}
