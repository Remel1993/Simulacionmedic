import {
  ClinicalCase,
  EvaluationResult,
  MedicationItem,
  ProposedMedicationReview,
  ProposedMedicationVerdict,
  RubricCategoryDetail,
  StatAuditSummary,
  StatInterventionAuditItem,
  StatReferenceProtocolItem,
  UserEvaluationInput,
  VitalSigns,
} from '../types/clinical';
import { auditMedicationPlanSafety } from './statStabilization';

function normStr(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'en', 'con', 'sin', 'por', 'para',
  'tipo', 'grado', 'fase', 'aguda', 'agudo', 'grave', 'severa', 'severo',
  'leve', 'moderada', 'moderado', 'cronica', 'cronico', 'sec', 'secundaria',
  'secundario', 'asociada', 'asociado', 'probable', 'posible', 'presuntivo',
  'cuadro', 'sindrome', 'enfermedad', 'alta', 'baja', 'extenso', 'no', 'complicada',
  'complicado', 'reciente', 'primario', 'primaria', 'idiopatica', 'idiopatico',
  'simple', 'tipica', 'tipico', 'estable', 'activa', 'activo', 'esencial',
  'consulta', 'externa', 'nivel', 'primer', 'ventana', 'territorio',
]);

export const EVALUATION_FRAMEWORK_LABEL =
  'Normativa Nicaragüense (MINSA / Lista Básica) + Estándar Internacional (OMS / OPS / AHA / IDSA / NICE)';

interface DiagnosisSynonymGroup {
  label: string;
  terms: string[];
}

const DIAGNOSIS_SYNONYM_GROUPS: DiagnosisSynonymGroup[] = [
  {
    label: 'IVU / Cistitis (ITU baja)',
    terms: ['cistitis', 'ivu baja', 'itu baja', 'infeccion urinaria baja', 'infeccion de vias urinarias baja', 'infeccion vias urinarias', 'infeccion tracto urinario'],
  },
  {
    label: 'Pielonefritis / IVU alta',
    terms: ['pielonefritis', 'ivu alta', 'itu alta', 'infeccion urinaria alta'],
  },
  {
    label: 'ACV / EVC / Ictus',
    terms: ['acv', 'evc', 'ictus', 'stroke', 'evento vascular cerebral', 'evento cerebrovascular', 'accidente cerebrovascular', 'infarto cerebral', 'isquemia cerebral'],
  },
  {
    label: 'IAMCEST / SCACEST',
    terms: ['iamcest', 'scacest', 'iam con elevacion', 'ima con elevacion', 'infarto agudo de miocardio', 'infarto agudo del miocardio', 'infarto al miocardio', 'sindrome coronario agudo con elevacion'],
  },
  {
    label: 'Neumonía Adquirida en la Comunidad (NAC)',
    terms: ['nac', 'neumonia adquirida en la comunidad', 'neumonia comunitaria', 'neumonia bacteriana'],
  },
  {
    label: 'Enfermedad Diarreica Aguda (EDA / GEPI)',
    terms: ['eda', 'edas', 'gepi', 'gastroenteritis', 'diarrea aguda', 'enfermedad diarreica aguda'],
  },
  {
    label: 'Lesión / Insuficiencia Renal Aguda (LRA / AKI)',
    terms: ['lra', 'aki', 'lesion renal aguda', 'insuficiencia renal aguda', 'injuria renal aguda', 'falla renal aguda'],
  },
  {
    label: 'Dengue con Signos de Alarma (Grupo B2)',
    terms: ['dengue con signos de alarma', 'dengue signos de alarma', 'dengue grupo b2', 'dengue b2', 'dengue con alarma'],
  },
  {
    label: 'Tromboembolia Pulmonar (TEP)',
    terms: ['tep', 'tromboembolia pulmonar', 'embolia pulmonar', 'tromboembolismo pulmonar'],
  },
  {
    label: 'Cetoacidosis Diabética (CAD)',
    terms: ['cad', 'cetoacidosis diabetica'],
  },
  {
    label: 'Estado Hiperosmolar Hiperglucémico (EHH)',
    terms: ['ehh', 'estado hiperosmolar'],
  },
  {
    label: 'Hipertensión Arterial (HTA)',
    terms: ['hta', 'hipertension arterial', 'hipertension esencial'],
  },
  {
    label: 'Diabetes Mellitus Tipo 2 (DM2)',
    terms: ['dm2', 'dm 2', 'diabetes mellitus tipo 2', 'diabetes tipo 2'],
  },
  {
    label: 'EPOC',
    terms: ['epoc', 'enfermedad pulmonar obstructiva cronica'],
  },
  {
    label: 'ERGE / Reflujo Gastroesofágico',
    terms: ['erge', 'reflujo gastroesofagico', 'enfermedad por reflujo'],
  },
  {
    label: 'Síndrome de Intestino Irritable (SII)',
    terms: ['sii', 'intestino irritable', 'colon irritable'],
  },
  {
    label: 'Síndrome de Ovario Poliquístico (SOP)',
    terms: ['sop', 'ovario poliquistico'],
  },
  {
    label: 'Vértigo Posicional Paroxístico Benigno (VPPB)',
    terms: ['vppb', 'vertigo posicional', 'vertigo benigno'],
  },
  {
    label: 'Otitis Media Aguda (OMA)',
    terms: ['oma', 'otitis media aguda'],
  },
  {
    label: 'Faringoamigdalitis Estreptocócica',
    terms: ['faringoamigdalitis', 'amigdalitis estreptococica', 'faringitis estreptococica'],
  },
  {
    label: 'Laringotraqueobronquitis / Crup',
    terms: ['crup', 'croup', 'laringotraqueobronquitis', 'laringotraqueitis'],
  },
  {
    label: 'Herpes Zóster',
    terms: ['herpes zoster', 'zoster', 'culebrilla'],
  },
  {
    label: 'Tiña Corporal / Dermatofitosis',
    terms: ['tina corporal', 'tinea corporis', 'dermatofitosis', 'micosis superficial'],
  },
  {
    label: 'Parálisis Facial Periférica (Bell)',
    terms: ['paralisis de bell', 'paralisis facial periferica', 'paralisis facial idiopatica'],
  },
  {
    label: 'Síndrome de Stevens-Johnson (SSJ)',
    terms: ['ssj', 'stevens johnson', 'necrolisis epidermica'],
  },
  {
    label: 'Preeclampsia / Trastorno Hipertensivo Gestacional',
    terms: ['preeclampsia', 'sindrome hipertensivo gestacional', 'trastorno hipertensivo del embarazo'],
  },
  {
    label: 'Choque Anafiláctico / Anafilaxia',
    terms: ['anafilaxia', 'choque anafilactico', 'shock anafilactico'],
  },
  {
    label: 'Choque Séptico / Sepsis',
    terms: ['sepsis', 'choque septico', 'shock septico', 'urosepsis'],
  },
  {
    label: 'Lumbalgia Mecánica / Radiculopatía',
    terms: ['lumbalgia', 'lumbago', 'dolor lumbar'],
  },
  {
    label: 'Radiculopatía Lumbar / Ciática',
    terms: ['radiculopatia', 'lumbociatica', 'ciatica', 'hernia discal'],
  },
  {
    label: 'Anemia Ferropénica',
    terms: ['anemia ferropenica', 'anemia por deficiencia de hierro', 'anemia microcitica ferropenica'],
  },
  {
    label: 'Anemia Megaloblástica / Déficit B12',
    terms: ['anemia megaloblastica', 'deficiencia de vitamina b12', 'deficit de b12', 'cobalamina'],
  },
  {
    label: 'Rinofaringitis Aguda Viral (Resfriado Común)',
    terms: ['rinofaringitis', 'resfriado comun', 'resfriado', 'resfrio', 'gripa', 'gripe comun', 'catarro comun', 'catarro', 'coriza'],
  },
  {
    label: 'Rinosinusitis Bacteriana Aguda',
    terms: ['rinosinusitis', 'sinusitis aguda', 'sinusitis maxilar', 'sinusitis bacteriana', 'sinusitis'],
  },
  {
    label: 'Conjuntivitis Aguda Bacteriana',
    terms: ['conjuntivitis', 'conjuntivitis bacteriana', 'conjuntivitis aguda'],
  },
  {
    label: 'Gastritis Aguda / Dispepsia Funcional',
    terms: ['gastritis', 'gastritis aguda', 'dispepsia', 'dispepsia funcional', 'enfermedad acido peptica'],
  },
  {
    label: 'Gastroenteritis Aguda Invasiva (Disentería Bacteriana)',
    terms: ['disenteria', 'disenteria bacteriana', 'gastroenteritis invasiva', 'diarrea invasiva', 'diarrea con sangre', 'shigelosis'],
  },
  {
    label: 'Dermatitis Atópica',
    terms: ['dermatitis atopica', 'eccema atopico', 'eczema atopico', 'eccema'],
  },
  {
    label: 'Urticaria Aguda Espontánea',
    terms: ['urticaria', 'urticaria aguda', 'habones', 'ronchas'],
  },
  {
    label: 'Escabiosis (Sarna Humana)',
    terms: ['escabiosis', 'sarna', 'acarosis', 'sarna humana'],
  },
  {
    label: 'Bronquitis Aguda Viral',
    terms: ['bronquitis aguda', 'traqueobronquitis aguda', 'bronquitis viral'],
  },
  {
    label: 'Cefalea Tensional',
    terms: ['cefalea tensional', 'cefalea de tipo tensional', 'dolor de cabeza tensional'],
  },
  {
    label: 'Artritis Gotosa Aguda (Podagra)',
    terms: ['gota', 'artritis gotosa', 'podagra', 'ataque de gota', 'gota aguda'],
  },
  {
    label: 'Fascitis Plantar',
    terms: ['fascitis plantar', 'espolon calcaneo', 'talalgia plantar'],
  },
  {
    label: 'Vaginosis Bacteriana',
    terms: ['vaginosis bacteriana', 'vaginosis', 'gardnerella'],
  },
  {
    label: 'Dismenorrea Primaria',
    terms: ['dismenorrea', 'dismenorrea primaria', 'colico menstrual', 'colicos menstruales'],
  },
  {
    label: 'Episodio Depresivo / Trastorno Depresivo Mayor',
    terms: ['depresion', 'episodio depresivo', 'trastorno depresivo', 'trastorno depresivo mayor', 'tdm'],
  },
  {
    label: 'Enfermedad Hemorroidal / Hemorroides',
    terms: ['hemorroides', 'enfermedad hemorroidal', 'hemorroide interna', 'almorranas'],
  },
  {
    label: 'Otitis Externa Aguda (Oído del Nadador)',
    terms: ['otitis externa', 'otitis del nadador', 'oido del nadador', 'oido de nadador'],
  },
  {
    label: 'Síndrome Metabólico y Dislipidemia Mixta',
    terms: ['sindrome metabolico', 'dislipidemia', 'dislipidemia mixta', 'hipercolesterolemia', 'hipertrigliceridemia'],
  },
  {
    label: 'Enfermedad Inflamatoria Pélvica (EIP)',
    terms: ['eip', 'enfermedad inflamatoria pelvica', 'salpingitis'],
  },
  {
    label: 'Enfermedad Renal Crónica (ERC)',
    terms: ['erc', 'enfermedad renal cronica', 'insuficiencia renal cronica', 'nefropatia diabetica'],
  },
  {
    label: 'Tuberculosis Pulmonar (TB)',
    terms: ['tb pulmonar', 'tbc pulmonar', 'tuberculosis pulmonar', 'tuberculosis'],
  },
  {
    label: 'Edema Agudo Pulmonar Cardiogénico (EAP)',
    terms: ['eap', 'edema agudo pulmonar', 'edema agudo de pulmon', 'insuficiencia cardiaca descompensada'],
  },
  {
    label: 'Hemorragia Subaracnoidea (HSA)',
    terms: ['hsa', 'hemorragia subaracnoidea', 'sangrado subaracnoideo'],
  },
  {
    label: 'Miocardiopatía de Estrés (Takotsubo)',
    terms: ['takotsubo', 'tako tsubo', 'miocardiopatia de estres', 'corazon roto', 'abombamiento apical'],
  },
  {
    label: 'Púrpura Trombótica Trombocitopénica (PTT)',
    terms: ['ptt', 'purpura trombotica trombocitopenica', 'sindrome de moschcowitz'],
  },
  {
    label: 'Granulomatosis con Poliangeítis (GPA / Wegener)',
    terms: ['gpa', 'granulomatosis con poliangeitis', 'granulomatosis de wegener', 'wegener'],
  },
  {
    label: 'Paludismo / Malaria por P. falciparum',
    terms: ['malaria', 'paludismo', 'plasmodium falciparum', 'paludismo grave'],
  },
  {
    label: 'Leishmaniasis Visceral (Kala-azar)',
    terms: ['leishmaniasis visceral', 'kala azar', 'kalaazar', 'leishmania infantum'],
  },
  {
    label: 'Esquistosomiasis Urinaria (Bilharziasis)',
    terms: ['esquistosomiasis', 'bilharziasis', 'schistosoma haematobium'],
  },
];

function expandClinicalAbbreviations(rawText: string, targetContextNorm = ''): string {
  let text = normStr(rawText);
  if (!text) return '';

  const isRenalTarget = /renal|rinon|nefro|hiperpotas|hiperkal/.test(targetContextNorm);
  const replacements: Array<[RegExp, string]> = [
    [/\bivu\b/g, 'infeccion vias urinarias cistitis pielonefritis'],
    [/\bitu\b/g, 'infeccion tracto urinario cistitis pielonefritis'],
    [/\bedas?\b/g, 'enfermedad diarreica aguda gastroenteritis diarrea'],
    [/\bgepi\b/g, 'gastroenteritis infecciosa diarrea aguda'],
    [/\bnac\b/g, 'neumonia adquirida comunidad'],
    [/\b(?:acv|evc|ictus|stroke)\b/g, 'evento vascular cerebral cerebrovascular ictus isquemia'],
    [/\b(?:iamcest|scacest)\b/g, 'infarto agudo miocardio elevacion segmento st'],
    [/\bima\b/g, 'infarto agudo miocardio'],
    [/\bsca\b/g, 'sindrome coronario agudo'],
    [/\b(?:lra|aki)\b/g, 'lesion insuficiencia renal aguda'],
    [/\bira\b/g, isRenalTarget ? 'insuficiencia lesion renal aguda' : 'infeccion respiratoria aguda'],
    [/\bcad\b/g, 'cetoacidosis diabetica'],
    [/\behh\b/g, 'estado hiperosmolar hiperglucemico'],
    [/\btep\b/g, 'tromboembolia pulmonar embolia'],
    [/\bhta\b/g, 'hipertension arterial sistemica'],
    [/\bdm2\b|\bdm\s*2\b/g, 'diabetes mellitus tipo 2'],
    [/\bepoc\b/g, 'enfermedad pulmonar obstructiva cronica'],
    [/\bvppb\b/g, 'vertigo posicional paroxistico benigno'],
    [/\berge\b/g, 'enfermedad reflujo gastroesofagico'],
    [/\bsii\b/g, 'sindrome intestino irritable'],
    [/\bsop\b/g, 'sindrome ovario poliquistico'],
    [/\boma\b/g, 'otitis media aguda'],
    [/\bssj\b/g, 'sindrome stevens johnson'],
    [/\bles\b/g, 'lupus eritematoso sistemico'],
    [/\bhda\b/g, 'hemorragia digestiva alta'],
    [/\btvp\b/g, 'trombosis venosa profunda'],
    [/\bculebrilla\b/g, 'herpes zoster'],
    [/\blumbago\b/g, 'lumbalgia'],
    [/\bciatica\b|\blumbociatica\b/g, 'radiculopatia lumbar ciatica'],
    [/\bshock\b/g, 'choque'],
    [/\bgrupo\s*b2\b/g, 'dengue signos alarma'],
    [/\bbell\b/g, 'paralisis facial periferica bell'],
    [/\bcrup\b|\bcroup\b/g, 'laringotraqueobronquitis crup'],
    [/\btina\b|\btinea\b/g, 'tina tinea dermatofitosis'],
    [/\b(?:tdm|tdd)\b/g, 'trastorno depresivo mayor episodio depresivo'],
    [/\b(?:gripa|catarro|resfrio)\b/g, 'resfriado comun rinofaringitis aguda'],
    [/\bsarna\b/g, 'escabiosis sarna'],
    [/\bpodagra\b/g, 'artritis gotosa aguda gota podagra'],
    [/\balmorranas\b/g, 'hemorroides enfermedad hemorroidal'],
    [/\beip\b/g, 'enfermedad inflamatoria pelvica'],
    [/\berc\b|\birc\b/g, 'enfermedad insuficiencia renal cronica'],
    [/\bhsa\b/g, 'hemorragia subaracnoidea'],
    [/\beap\b/g, 'edema agudo pulmonar'],
    [/\bptt\b/g, 'purpura trombotica trombocitopenica'],
    [/\bgpa\b|\bwegener\b/g, 'granulomatosis poliangeitis wegener'],
    [/\b(?:tb|tbc)\b/g, 'tuberculosis'],
    [/\b(?:ar)\b/g, 'artritis reumatoide'],
    [/\bpaludismo\b|\bmalaria\b/g, 'paludismo malaria plasmodium'],
    [/\bkala\s*azar\b/g, 'leishmaniasis visceral kala azar'],
    [/\bbilharziasis\b/g, 'esquistosomiasis bilharziasis'],
    [/\btakotsubo\b/g, 'miocardiopatia estres takotsubo'],
    [/\bpai\b/g, 'porfiria aguda intermitente'],
    [/\bfeocromocitoma\b|\bfeocromo\b/g, 'feocromocitoma'],
  ];

  for (const [pattern, expansion] of replacements) {
    if (pattern.test(text)) {
      text = `${text} ${expansion}`;
    }
  }
  return text.trim();
}

function stripParentheticalQualifiers(text: string): string {
  return (text || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function significantTokens(s: string): string[] {
  return normStr(s)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
}

function tokenMatchRatio(userText: string, targetText: string): number {
  const tTokens = significantTokens(targetText);
  if (tTokens.length === 0) return 0;
  const targetNorm = normStr(targetText);
  const uNorm = expandClinicalAbbreviations(userText, targetNorm);
  if (!uNorm) return 0;

  let hits = 0;
  for (const tk of tTokens) {
    const stem = tk.slice(0, Math.max(4, tk.length - 1));
    if (uNorm.includes(tk) || uNorm.includes(stem)) {
      hits += 1;
    }
  }
  return hits / tTokens.length;
}

function hasClinicalTerm(normHaystack: string, normTerm: string): boolean {
  if (!normHaystack || !normTerm) return false;
  const escaped = normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`).test(normHaystack);
}

function computeClinicalDiagnosisMatch(
  userText: string,
  targetText: string
): { ratio: number; matchedSynonymLabel?: string } {
  const uRawNorm = normStr(userText);
  const tRawNorm = normStr(targetText);
  if (!uRawNorm || !tRawNorm) return { ratio: 0 };

  const coreTarget = stripParentheticalQualifiers(targetText);
  const fullRatio = tokenMatchRatio(userText, targetText);
  const coreRatio = coreTarget ? tokenMatchRatio(userText, coreTarget) : 0;
  let bestRatio = Math.max(fullRatio, coreRatio >= 0.7 ? Math.max(fullRatio, 0.85) : coreRatio);
  let matchedSynonymLabel: string | undefined;

  // Check if both user diagnosis and target belong to the same recognized clinical synonym/acronym group
  const uExpanded = expandClinicalAbbreviations(userText, tRawNorm);
  const tExpanded = expandClinicalAbbreviations(targetText, tRawNorm);
  for (const group of DIAGNOSIS_SYNONYM_GROUPS) {
    const targetInGroup = group.terms.some(
      (term) => hasClinicalTerm(tRawNorm, term) || hasClinicalTerm(tExpanded, term)
    );
    if (!targetInGroup) continue;
    const userInGroup = group.terms.some(
      (term) => hasClinicalTerm(uRawNorm, term) || hasClinicalTerm(uExpanded, term)
    );
    if (userInGroup) {
      // Preserve subtype accuracy when target explicitly specifies "baja" vs "alta" or "isquemico" vs "hemorragico"
      const targetLower = tRawNorm;
      const userLower = uRawNorm;
      const subtypeConflict =
        (targetLower.includes('baja') && userLower.includes('alta')) ||
        (targetLower.includes('alta') && userLower.includes('baja')) ||
        (targetLower.includes('isquem') && userLower.includes('hemorrag')) ||
        (targetLower.includes('hemorrag') && userLower.includes('isquem')) ||
        (targetLower.includes('otitis externa') && userLower.includes('otitis media')) ||
        (targetLower.includes('otitis media') && userLower.includes('otitis externa')) ||
        (targetLower.includes('invasiva') && userLower.includes('viral'));
      if (!subtypeConflict) {
        if (bestRatio < 0.82) {
          bestRatio = 0.82;
          matchedSynonymLabel = group.label;
        }
      }
    }
  }

  return { ratio: bestRatio, matchedSynonymLabel };
}

/**
 * Elimina cláusulas donde el médico indica explícitamente SUSPENDER, RETIRAR, EVITAR o NO USAR
 * un medicamento (por ejemplo: "Suspender Enalapril y Naproxeno de inmediato").
 */
function stripNegatedMedicationClauses(text: string): string {
  if (!text) return '';
  const noAccents = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Elimina menciones de alergia o alternativa segura incluidas en notas de dosis/racional (p. ej. "con alergia grave a penicilinas")
    .replace(
      /(?:\b(?:por|con|ante|debido\s+a|en)\s+)?alergi[ao]s?\s+(?:grave\s+|severa\s+|documentada\s+)?(?:tipo\s*\d+\s+)?(?:anafilactic[ao]\s+)?a\s+[^.,;)]+/gi,
      ' '
    )
    .replace(/\balternativa\s+(?:segura\s+)?(?:a|ante|por)\s+[^.,;)]+/gi, ' ')
    .replace(
      /\b(?:en\s+reemplazo\s+de(?:l)?|en\s+sustitucion\s+de(?:l)?|sustituyendo\s+(?:a|al)|reemplazando\s+(?:a|al)|tras\s+(?:suspender|retirar|omitir))\s+[^.,;)]+/gi,
      ' '
    );
  const sentences = noAccents.split(/[.;\n]+/);
  const kept = sentences.map((seg) =>
    seg.replace(
      /\b(?:suspender|suspendase|suspenderse|suspension|retirar|retirese|retiro|omitir|evitar|evitese|prohibid[oa]s?|contraindicad[oa]s?|descontinuar|no\s+(?:administrar|usar|dar|indicar|prescribir|iniciar|mantener|reintroducir))\b.*?(?=(?:\b(?:e\s+iniciar|y\s+administrar|y\s+iniciar|y\s+dar|y\s+prescribir|en\s+su\s+lugar|reemplazar\s+por|sustituir\s+por)\b)|$)/gi,
      ' '
    )
  );
  return normStr(kept.join(' '));
}

function checkCriticalSafetyErrors(
  submission: UserEvaluationInput,
  caseData: ClinicalCase
): string[] {
  const errors: string[] = [];
  const rawRxJson = (submission.pharmacologicalPlan || [])
    .map((r) => `${r.drug || ''} ${r.dose || ''} ${r.route || ''} ${r.frequency || ''}`)
    .join('. ');
  const activeRxOnly = stripNegatedMedicationClauses(rawRxJson);
  const activeGeneral = stripNegatedMedicationClauses(submission.generalMeasures || '');
  const lowerTreatment = `${activeRxOnly} ${activeGeneral}`.trim();

  const hospDecision = normStr(submission.hospitalizationDecision || '');
  const allergiesNorm = normStr((caseData.background?.allergies || []).join(' '));
  const diagNorm = normStr(caseData.solution?.correctDiagnosis || '');

  // 1. Alergia documentada a penicilina / betalactámicos (diferenciación farmacológica real AAAAI 2022 / NICE)
  // Nota: Carbapenémicos (meropenem, imipenem, ertapenem) y monobactámicos (aztreonam) tienen reactividad
  // cruzada <1% / 0% con penicilinas y NO desencadenan anafilaxia cruzada por alergia a penicilina.
  const hasExplicitAllBetaLactamAllergy =
    allergiesNorm.includes('todos los betalactamic') ||
    allergiesNorm.includes('panbetalactam') ||
    (allergiesNorm.includes('betalactam') && !allergiesNorm.includes('penicilin'));
  const hasCephalosporinAllergy = allergiesNorm.includes('cefalosporin');
  const hasCarbapenemAllergy =
    allergiesNorm.includes('carbapenem') ||
    allergiesNorm.includes('meropenem') ||
    allergiesNorm.includes('imipenem') ||
    allergiesNorm.includes('ertapenem');

  if (allergiesNorm.includes('penicilin') || hasExplicitAllBetaLactamAllergy) {
    const highCrossRiskRegex =
      /\b(amoxicilin[a-z]*|ampicilin[a-z]*|penicilin[a-z]*|piperacilin[a-z]*|oxacilin[a-z]*|dicloxacilin[a-z]*|cloxacilin[a-z]*|flucloxacilin[a-z]*|nafcilin[a-z]*|ticarcilin[a-z]*|sultamicilin[a-z]*|amoxiclav|augmentin|cefalexin[a-z]*|cefadroxil[a-z]*|cefaclor|cefradin[a-z]*|cefprozil|cefalotin[a-z]*)\b/;
    const dissimilarCephalosporinRegex =
      /\b(ceftriaxon[a-z]*|cefotaxim[a-z]*|cefepim[a-z]*|ceftazidim[a-z]*|cefuroxim[a-z]*|cefazolina)\b/;
    const carbapenemRegex = /\b(meropenem|imipenem|ertapenem|doripenem)\b/;

    if (
      highCrossRiskRegex.test(lowerTreatment) ||
      ((hasExplicitAllBetaLactamAllergy || hasCephalosporinAllergy) &&
        dissimilarCephalosporinRegex.test(lowerTreatment)) ||
      ((hasExplicitAllBetaLactamAllergy || hasCarbapenemAllergy) && carbapenemRegex.test(lowerTreatment))
    ) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de penicilina o betalactámico con alta reactividad cruzada en un paciente con alergia/anafilaxia documentada a penicilina. Riesgo vital de choque anafiláctico.'
      );
    }
  } else if (hasCephalosporinAllergy) {
    if (/\bcefa[a-z]+|\bceft[a-z]+/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de cefalosporina en paciente con alergia documentada a cefalosporinas.'
      );
    }
  }

  // 2. Alergia a sulfamidas antimicrobianas (evita falsos positivos con sulfonamidas no antibióticas como furosemida/tiazidas)
  if (allergiesNorm.includes('sulfa')) {
    if (/\b(trimetoprim[a-z]*|sulfametoxazol[a-z]*|cotrimoxazol|bactrim|sulfadi[a-z]*|sulfasalazin[a-z]*|dapsona)\b/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD!: Prescripción de sulfamida antimicrobiana en paciente alérgico conocido a las sulfas.'
      );
    }
  }

  // 3. Dengue con signos de alarma + AINEs / AAS / Corticoides sistémicos
  if (diagNorm.includes('dengue')) {
    if (
      /\b(ibuprofeno|aspirina|acido acetilsalicilico|aas|ketorolaco|diclofenaco|naproxeno|metamizol|dipirona|meloxicam|celecoxib|indometacina|piroxicam)\b/.test(
        lowerTreatment
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de AINEs o Aspirina en Dengue con signos de alarma. Aumenta gravemente la disfunción plaquetaria y el riesgo de hemorragia digestiva o choque fatal.'
      );
    }
  }

  // 4. Lesión renal aguda + nefrotóxicos o administración de potasio IV en hiperkalemia severa
  if (diagNorm.includes('lesion renal') || diagNorm.includes('insuficiencia renal')) {
    if (
      /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|celecoxib|indometacina|losartan|valsartan|irbesartan|telmisartan|enalapril|captopril|lisinopril|ramipril|gentamicina|amikacina)\b/.test(
        lowerTreatment
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Uso de fármacos nefrotóxicos (AINEs, IECA/ARA-II o aminoglucósidos) en Lesión Renal Aguda con hiperpotasemia.'
      );
    }
    if (/\b(cloruro de potasio|kcl|gluconato de potasio|potasio iv)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Administración de potasio en paciente con hiperpotasemia severa (6.4 mEq/L) y ondas T picudas; riesgo inminente de fibrilación ventricular/asistolia.'
      );
    }
  }

  // 5. Embarazo ectópico roto e inestable + Metotrexato
  if (diagNorm.includes('ectopico') && diagNorm.includes('roto')) {
    if (/\b(metotrexato|methotrexate|mtx)\b/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO!: Uso de Metotrexato en embarazo ectópico roto con hemoperitoneo e inestabilidad hemodinámica. Requiere resolución quirúrgica inmediata.'
      );
    }
  }

  // 6. Síndrome de Stevens-Johnson + Carbamazepina o anticonvulsivantes aromáticos cruzados
  if (diagNorm.includes('stevens johnson') || diagNorm.includes('stevens-johnson')) {
    if (/\b(carbamazepina|oxcarbazepina|fenitoina|fenobarbital|lamotrigina)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Mantenimiento o prescripción de Carbamazepina o anticonvulsivantes aromáticos con reactividad cruzada en Síndrome de Stevens-Johnson.'
      );
    }
  }

  // 7. Síndrome serotoninérgico + fármacos serotoninérgicos o haloperidol/succinilcolina
  if (diagNorm.includes('serotoninergico')) {
    if (
      /\b(sertralina|fluoxetina|paroxetina|citalopram|escitalopram|venlafaxina|tramadol|dextrometorfano|linezolid|haloperidol|succinilcolina)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de fármacos serotoninérgicos, antipsicóticos (haloperidol) o succinilcolina en Síndrome Serotoninérgico agudo.'
      );
    }
  }

  // 8. Emergencias quirúrgicas / vitales manejadas como Ambulatorio
  const expectedHosp = caseData.solution?.optimalTreatment?.hospitalizationDecision || '';
  if (
    (expectedHosp.includes('UCI') ||
      expectedHosp.includes('Hospitalización') ||
      expectedHosp.includes('Quirófano')) &&
    hospDecision.includes('ambulatorio')
  ) {
    errors.push(
      `¡ERROR CRÍTICO DE CONDUCTA!: Indicaste manejo "Ambulatorio" en una patología de alto riesgo vital (${caseData.solution?.correctDiagnosis}), donde las guías exigen "${expectedHosp}".`
    );
  }

  // 9. Anafilaxia sin adrenalina (solo si sí prescribió algo pero omitió adrenalina)
  if (
    diagNorm.includes('anafilax') &&
    (submission.pharmacologicalPlan?.length || 0) > 0 &&
    !/\b(adrenalina|epinefrina)\b/.test(lowerTreatment)
  ) {
    errors.push(
      '¡ERROR CRÍTICO!: Omisión de Adrenalina (Epinefrina) intramuscular en choque anafiláctico con compromiso de vía aérea. Es el único tratamiento salvador de primera línea.'
    );
  }

  // 10. IAMCEST con prescripción errónea sin antiagregación
  if (
    diagNorm.includes('infarto') &&
    (submission.pharmacologicalPlan?.length || 0) > 0 &&
    !/\b(aspirina|acido acetilsalicilico|aas|clopidogrel|ticagrelor|prasugrel)\b/.test(lowerTreatment)
  ) {
    errors.push(
      '¡ERROR CRÍTICO!: Ausencia de terapia antiagregante plaquetaria inicial (Aspirina + inhibidor P2Y12) y estrategia de reperfusión en IAMCEST.'
    );
  }

  // 11. Tiña corporal / dermatofitosis + corticoide (produce Tiña Incógnita)
  if (diagNorm.includes('tina') || diagNorm.includes('tinea') || diagNorm.includes('dermatofitosis')) {
    if (
      /\b(hidrocortisona|betametasona|clobetasol|dexametasona|prednisona|prednisolona|mometasona|triamcinolona|fluocinolona|barmicil|quadriderm|corticoide[s]?)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO DE PRIMER NIVEL!: Prescripción de corticoide tópico o sistémico (o crema combinada con betametasona) en Tiña corporal. Suprime la inmunidad local y genera Tiña Incógnita.'
      );
    }
  }

  // 12. Hemorragia digestiva alta / Úlcera péptica / Gastritis aguda / Colitis ulcerosa + AINEs o AAS
  if (
    diagNorm.includes('hemorragia digestiva') ||
    diagNorm.includes('ulcera peptica') ||
    diagNorm.includes('colitis ulcerosa') ||
    diagNorm.includes('gastritis')
  ) {
    if (
      /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|celecoxib|indometacina|piroxicam|aspirina|acido acetilsalicilico|aas)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de AINEs o Ácido Acetilsalicílico en paciente con lesión/irritación gastrointestinal activa (Gastritis Aguda, Úlcera Péptica, Hemorragia Digestiva o Colitis Ulcerosa); agrava la lesión mucosa y el riesgo de sangrado.'
      );
    }
  }

  // 13. Epilepsia en mujer en edad fértil + Ácido Valproico (riesgo teratogénico mayor)
  if (
    diagNorm.includes('epilep') &&
    caseData.patientInfo?.sex === 'Femenino' &&
    (caseData.patientInfo?.age ?? 30) < 48
  ) {
    if (/\b(valproato|acido valproico|valproico|divalproex|depakene)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO DE SEGURIDAD TERATOGÉNICA!: Prescripción de Ácido Valproico en mujer en edad fértil con epilepsia. Alto riesgo de defectos del tubo neural y trastornos del neurodesarrollo (preferir Levetiracetam o Lamotrigina).'
      );
    }
  }

  // 14. Asma / EPOC + Betabloqueador no selectivo o depresor respiratorio
  if (diagNorm.includes('asma') || diagNorm.includes('epoc') || diagNorm.includes('obstructiva cronica')) {
    if (/\b(propranolol|nadolol|carvedilol|timolol|sotalol)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de betabloqueador no selectivo en paciente con Asma o EPOC; riesgo de broncoespasmo grave refractario.'
      );
    }
  }
  if (diagNorm.includes('crisis asmatica') || diagNorm.includes('epoc')) {
    if (/\b(alprazolam|diazepam|lorazepam|clonazepam|midazolam|morfina|fentanilo|codeina)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Prescripción de benzodiacepinas u opioides en Crisis Asmática o EPOC; riesgo de depresión respiratoria hipercápnica y paro ventilatorio.'
      );
    }
  }

  // 15. Bronquiectasias infectadas + antitusígenos supresores (codeína / dextrometorfano)
  if (diagNorm.includes('bronquiectas')) {
    if (/\b(codeina|dextrometorfano|levodropropizina)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO!: Uso de antitusígenos supresores (codeína/dextrometorfano) en Bronquiectasias; impide la depuración mucociliar y agrava el tapón mucopurulento.'
      );
    }
  }

  // 16. Delirium Tremens / Abstinencia alcohólica + Dextrosa IV sin Tiamina
  if (diagNorm.includes('delirium tremens') || diagNorm.includes('abstinencia alcoholica')) {
    if (/\b(dextrosa|glucosa|glucosada)\b/.test(activeRxOnly) && !/\b(tiamina|vitamina b1|b1)\b/.test(lowerTreatment)) {
      errors.push(
        '¡ERROR CRÍTICO!: Administración de solución glucosada IV sin Tiamina (Vitamina B1) previa en paciente con abstinencia alcohólica / Delirium Tremens; puede precipitar Encefalopatía de Wernicke aguda.'
      );
    }
  }

  // 17. Preeclampsia con severidad + IECA/ARA-II/AINEs
  if (diagNorm.includes('preeclampsia')) {
    if (
      /\b(enalapril|captopril|lisinopril|ramipril|losartan|valsartan|irbesartan|telmisartan|ibuprofeno|ketorolaco|naproxeno|diclofenaco)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO MATERNO-FETAL!: Uso de IECA, ARA-II o AINEs en Preeclampsia con criterios de severidad (contraindicación obstétrica y nefrotoxicidad).'
      );
    }
  }

  // 18. Pediatría (< 12 años) + Ácido Acetilsalicílico (Riesgo de Síndrome de Reye)
  if ((caseData.patientInfo?.age ?? 30) < 12) {
    if (/\b(aspirina|acido acetilsalicilico|aas|asa)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO PEDIÁTRICO!: Prescripción de Ácido Acetilsalicílico (Aspirina) en menor de 12 años; riesgo de Síndrome de Reye potencialmente mortal.'
      );
    }
  }

  // 19. Queratitis herpética + corticoides oftálmicos/sistémicos (úlcera geográfica / perforación corneal)
  if (diagNorm.includes('queratitis herpetica')) {
    if (
      /\b(dexametasona|prednisolona|prednisona|betametasona|hidrocortisona|fluometolona|tobradex|corticoide[s]?)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO OFTALMOLÓGICO!: Uso de corticoides tópicos o sistémicos en Queratitis Herpética Epitelial; suprime la inmunidad corneal, genera úlcera geográfica y riesgo de perforación.'
      );
    }
  }

  // 20. Glaucoma agudo de ángulo cerrado + anticolinérgicos / midriáticos
  if (diagNorm.includes('glaucoma agudo')) {
    if (
      /\b(atropina|tropicamida|ciclopentolato|fenilefrina|escopolamina|butilhioscina|hioscina|ipratropio)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO OFTALMOLÓGICO!: Prescripción de anticolinérgicos o midriáticos en Glaucoma Agudo de Ángulo Cerrado; agrava el bloqueo pupilar y precipita ceguera irreversible.'
      );
    }
  }

  // 21. Púrpura trombocitopénica inmune (PTI) severa / Epistaxis activa + AINEs / antiagregantes / anticoagulantes
  if (diagNorm.includes('purpura trombocitopenica') || diagNorm.includes('epistaxis')) {
    if (
      /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|aspirina|acido acetilsalicilico|aas|clopidogrel|enoxaparina|heparina|warfarina|rivaroxaban|apixaban)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO HEMORRÁGICO!: Prescripción de AINEs, antiagregantes o anticoagulantes en paciente con sangrado activo o trombocitopenia severa; riesgo grave de hemorragia mayor.'
      );
    }
  }

  // 22. Retención aguda de orina / HPB + diuréticos o anticolinérgicos
  if (diagNorm.includes('retencion aguda de orina') || diagNorm.includes('hiperplasia prostatica')) {
    if (
      /\b(furosemida|bumetanida|oxibutinina|tolterodina|solifenacina|butilhioscina|hioscina|atropina)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO UROLÓGICO!: Prescripción de diuréticos de asa o anticolinérgicos en Retención Aguda de Orina; aumenta la sobredistensión vesical y agrava la obstrucción.'
      );
    }
  }

  // 23. Artritis séptica + corticoides sin cobertura antibiótica
  if (diagNorm.includes('artritis septica')) {
    if (
      /\b(prednisona|prednisolona|dexametasona|metilprednisolona|betametasona|triamcinolona|hidrocortisona)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO!: Administración de corticoides en Artritis Séptica aguda; favorece la destrucción condral rápida y diseminación séptica.'
      );
    }
  }

  // 23b. Bloqueo AV (1.er/2.º/3.er grado) o Bloqueo Bifascicular + fármacos frenadores nodales
  if (
    diagNorm.includes('bloqueo auriculoventricular') ||
    diagNorm.includes('bloqueo av') ||
    diagNorm.includes('bloqueo bifascicular')
  ) {
    if (
      /\b(verapamilo|diltiazem|digoxina|metoprolol|propranolol|atenolol|carvedilol|bisoprolol|nebivolol|amiodarona|ivabradina)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO CARDIOLÓGICO!: Prescripción o mantenimiento de fármacos frenadores del nodo AV/conducción (betabloqueadores, verapamilo, diltiazem, digoxina o amiodarona) en paciente con bloqueo de conducción; riesgo grave de progresión a bloqueo AV completo o asistolia.'
      );
    }
  }

  // 23c. Disección Aórtica Aguda + Anticoagulantes / Fibrinolíticos / Antiagregantes
  if (diagNorm.includes('diseccion aortica')) {
    if (
      /\b(aspirina|acido acetilsalicilico|aas|asa|clopidogrel|ticagrelor|prasugrel|heparina|enoxaparina|warfarina|apixaban|rivaroxaban|alteplasa|tenecteplasa|estreptoquinasa)\b/.test(
        activeRxOnly
      )
    ) {
      errors.push(
        '¡ERROR CRÍTICO VASCULAR!: Prescripción de antitrombóticos o fibrinolíticos en Disección Aórtica Aguda; precipita extensión de disección, taponamiento pericárdico y rotura aórtica fatal.'
      );
    }
  }

  // 23d. Intoxicación por Paracetamol + Paracetamol
  if (/intoxicacion.*paracetamol|intoxicacion.*acetaminofen|sobredosis.*paracetamol/.test(diagNorm)) {
    if (/\b(paracetamol|acetaminofen)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO TOXICOLÓGICO!: Prescripción de Paracetamol adicional en Intoxicación por Paracetamol; agrava la necrosis hepática fulminante.'
      );
    }
  }

  // 23e. Enfermedad de Parkinson + Bloqueadores dopaminérgicos centrales
  if (diagNorm.includes('parkinson')) {
    if (/\b(metoclopramida|haloperidol|clorpromazina|risperidona)\b/.test(activeRxOnly)) {
      errors.push(
        '¡ERROR CRÍTICO NEUROLÓGICO!: Prescripción de antagonista dopaminérgico central (metoclopramida/haloperidol) en Enfermedad de Parkinson; precipita rigidez severa y crisis acinética.'
      );
    }
  }

  // 24. Auditoría posológica, de vía y sobredosis letales/acumulativas sobre fármacos prescritos y STAT
  const planAudit = auditMedicationPlanSafety(
    submission.pharmacologicalPlan || [],
    caseData,
    submission.statInterventions || []
  );
  for (const planErr of planAudit.errors) {
    if (!errors.some((e) => normStr(e) === normStr(planErr))) {
      errors.push(planErr);
    }
  }

  return errors;
}

const SYSTEMIC_ANTIBIOTIC_REGEX =
  /\b(amoxicilin[a-z]*|ampicilin[a-z]*|azitromicina|claritromicina|eritromicina|ciprofloxacino|levofloxacino|moxifloxacino|ceftriaxona|cefotaxima|cefepim[ae]|cefazolina|cefalexina|cefuroxima|cefixima|clindamicina|metronidazol|doxiciclina|trimetoprim|sulfametoxazol|nitrofurantoina|fosfomicina|vancomicina|meropenem|imipenem|ertapenem|piperacilina|oxacilina|dicloxacilina|gentamicina|amikacina)\b/;

function isNonBacterialPrimaryCase(diagNorm: string): boolean {
  if (
    /\b(bacteriana|estreptococica|pielonefritis|cistitis|colangitis|meningitis|neumonia|apendicitis|colecistitis|erisipela|endocarditis|absceso|sepsis|urosepsis|neutropenia febril|artritis septica)\b/.test(
      diagNorm
    ) ||
    diagNorm.includes('bronquiectasias infectadas')
  ) {
    return false;
  }
  return /\b(bronquiolitis|bronquitis aguda|rinofaringitis|resfriado|gastroenteritis|laringotraqueobronquitis|crup|dengue|herpes zoster|pancreatitis aguda|reflujo gastroesofagico|erge|gastritis aguda|dispepsia funcional|intestino irritable|esguince|lumbalgia mecanica|fascitis plantar|vertigo posicional|vppb|migrana|ansiedad|depresion|episodio depresivo|tunel del carpo|vitamina b12|vitamina d|ferropenica|hipotiroidismo|hipertension arterial|diabetes mellitus|dislipidemia|sindrome metabolico|ovario poliquistico|dismenorrea|tina corporal|tinea corporis|candidiasis|dermatitis atopica|urticaria aguda|escabiosis|sarna|paralisis facial|radiculopatia|hernia inguinal|hemorroides|enfermedad hemorroidal|artritis gotosa|podagra|asma bronquial|epoc.*estable|pericarditis aguda|cefalea tensional|queratitis herpetica|glaucoma agudo|epistaxis|torsion testicular|hiperplasia prostatica|retencion aguda de orina|purpura trombocitopenica|arteritis de celulas gigantes|intoxicacion aguda|bloqueo auriculoventricular|bloqueo completo de rama|bloqueo bifascicular|mobitz|wenckebach)\b/.test(
    diagNorm
  );
}

function isSimplePrimaryWorkupCase(diagNorm: string): boolean {
  return /\b(lumbalgia mecanica|esguince lateral|fascitis plantar|vertigo posicional|vppb|rinofaringitis|resfriado|bronquitis aguda|rinosinusitis|conjuntivitis|faringoamigdalitis|cistitis aguda|tina corporal|tinea corporis|herpes zoster|dermatitis atopica|urticaria aguda|escabiosis|sarna|otitis media|otitis externa|gastroenteritis aguda probable viral|gastritis aguda|dispepsia funcional|candidiasis|vaginosis bacteriana|dismenorrea|cefalea tensional|hemorroides|enfermedad hemorroidal)\b/.test(
    diagNorm
  );
}

function isSelfLimitingOrBenignOutpatientCase(caseData: ClinicalCase): boolean {
  const diagNorm = normStr(caseData.solution?.correctDiagnosis || '');
  return /\b(rinofaringitis|resfriado|bronquitis aguda|gastroenteritis aguda probable viral|cefalea tensional|lumbalgia mecanica|esguince lateral|fascitis plantar|vertigo posicional|vppb|dismenorrea primaria|gastritis aguda|dispepsia funcional|intestino irritable|urticaria aguda espontanea|dermatitis atopica|hernia inguinal.*no complicada|tunel del carpo)\b/.test(
    diagNorm
  );
}

function getDispositionRank(decisionNorm: string): number {
  if (!decisionNorm) return 0;
  if (decisionNorm.includes('ambulatorio')) return 1;
  if (decisionNorm.includes('observacion')) return 2;
  if (decisionNorm.includes('hospitalizacion')) return 3;
  if (decisionNorm.includes('quirofano') || decisionNorm.includes('cirugia')) return 4;
  if (decisionNorm.includes('uci') || decisionNorm.includes('intensivos')) return 5;
  return 0;
}

function isSurgicalOrProceduralCase(caseData: ClinicalCase): boolean {
  const opt = caseData.solution?.optimalTreatment;
  const expectedHospNorm = normStr(opt?.hospitalizationDecision || '');
  if (expectedHospNorm.includes('ambulatorio')) {
    return false;
  }
  if (expectedHospNorm.includes('quirofano') || expectedHospNorm.includes('cirugia')) {
    return true;
  }
  if (caseData.specialty === 'cirugia_general') {
    return true;
  }
  const positiveSurgicalText = normStr(
    [
      caseData.solution?.correctDiagnosis || '',
      ...(opt?.generalMeasures || []),
      ...(opt?.referralCriteria || []),
    ].join(' ')
  );
  return /\b(quirofano|cirugia|quirurgic[ao]|apendicectomia|colecistectomia|salpingectomia|fasciotomia|artroplastia|laparoscopia|laparotomia|adhesiolisis|toracostomia|pericardiocentesis|drenaje|descompresion|reduccion)\b/.test(
    positiveSurgicalText
  );
}

function parseBloodPressurePair(bp?: string): { sys: number; dia: number } {
  const m = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
  return {
    sys: m ? parseInt(m[1], 10) : 120,
    dia: m ? parseInt(m[2], 10) : 80,
  };
}

function getAbnormalVitalSignDescriptions(caseData: ClinicalCase): string[] {
  const v = caseData.vitalSigns;
  if (!v) return [];
  const age = caseData.patientInfo?.age ?? 30;
  const { sys, dia } = parseBloodPressurePair(v.bloodPressure);
  const findings: string[] = [];

  if (age < 2) {
    if (sys < 70) findings.push(`hipotensión (${v.bloodPressure})`);
  } else if (age < 12) {
    if (sys < 80) findings.push(`hipotensión (${v.bloodPressure})`);
    else if (sys >= 130) findings.push(`hipertensión (${v.bloodPressure})`);
  } else {
    if (sys < 90) findings.push(`hipotensión (${v.bloodPressure})`);
    else if (sys >= 160 || dia >= 100) findings.push(`hipertensión severa (${v.bloodPressure})`);
    else if (sys >= 140 || dia >= 90) findings.push(`hipertensión (${v.bloodPressure})`);
  }

  const hrUpper = age < 2 ? 160 : age < 6 ? 140 : age < 12 ? 120 : 100;
  const hrLower = age < 2 ? 90 : age < 12 ? 70 : 55;
  if (v.heartRate > hrUpper) findings.push(`taquicardia (${v.heartRate} lpm)`);
  else if (v.heartRate < hrLower) findings.push(`bradicardia (${v.heartRate} lpm)`);

  const rrUpper = age < 2 ? 45 : age < 6 ? 34 : age < 12 ? 26 : 20;
  if (v.respiratoryRate > rrUpper) findings.push(`taquipnea (${v.respiratoryRate} rpm)`);
  else if (v.respiratoryRate < 11) findings.push(`bradipnea (${v.respiratoryRate} rpm)`);

  if (v.temperature >= 38.0) findings.push(`fiebre (${v.temperature} °C)`);
  else if (v.temperature >= 37.6) findings.push(`febrícula (${v.temperature} °C)`);
  else if (v.temperature < 35.5) findings.push(`hipotermia (${v.temperature} °C)`);

  if (v.oxygenSaturation < 94) findings.push(`hipoxemia/desaturación (SpO₂ ${v.oxygenSaturation}%)`);
  if (v.glasgow < 15) findings.push(`alteración neurológica (Glasgow ${v.glasgow}/15)`);

  return findings;
}

function hasUnstableBaselineVitals(caseData: ClinicalCase): boolean {
  const v = caseData.vitalSigns;
  if (!v) return false;
  const age = caseData.patientInfo?.age ?? 30;
  const { sys } = parseBloodPressurePair(v.bloodPressure);
  const lowSys = age < 2 ? sys < 70 : age < 12 ? sys < 80 : sys < 90;
  const extremeHr = age < 12 ? v.heartRate >= 175 || v.heartRate <= 55 : v.heartRate >= 145 || v.heartRate <= 44;
  const extremeRr = age < 12 ? v.respiratoryRate >= 52 : v.respiratoryRate >= 32 || v.respiratoryRate <= 9;
  return lowSys || v.oxygenSaturation < 90 || v.glasgow <= 12 || extremeHr || extremeRr;
}

function hasImmediateVitalThreat(caseData: ClinicalCase): boolean {
  const triage = caseData.patientInfo?.triageLevel || '';
  if (/\bNivel I\b/.test(triage)) return true;
  if (hasUnstableBaselineVitals(caseData)) return true;

  const expectedHosp = normStr(caseData.solution?.optimalTreatment?.hospitalizationDecision || '');
  const diagNorm = normStr(caseData.solution?.correctDiagnosis || '');
  if (
    expectedHosp.includes('uci') &&
    /\b(infarto|iamcest|anafilax|choque|meningitis|cetoacidosis|ectopico.*roto|hemorragia digestiva|hiperpotasemia|stevens|serotoninergico|taponamiento|colangitis|crisis suprarrenal|delirium tremens|tormenta tiroidea|organofosforados|asma grave|ictus|guillain|preeclampsia|metanol)\b/.test(
      diagNorm
    )
  ) {
    return true;
  }
  if (/\b(ectopico.*roto|choque hipovolemico|choque anafilactico|metanol)\b/.test(diagNorm)) {
    return true;
  }
  return false;
}

function isLethalSafetyError(errMsg: string, caseData: ClinicalCase): boolean {
  const nErr = normStr(errMsg);
  // Errores claramente no letales de forma aguda (no causan muerte súbita ni paro en paciente estable)
  if (
    /\b(tina|tinea|teratogen|valproico|bronquiectas|antitusigen|queratitis herpetica|perforacion corneal)\b/.test(nErr)
  ) {
    return false;
  }

  // Egreso ambulatorio es letal solo cuando el paciente sí cursa con amenaza vital aguda o UCI
  if (nErr.includes('error critico de conducta') && nErr.includes('ambulatorio')) {
    return hasImmediateVitalThreat(caseData);
  }

  return /\b(muerte inmediata|alergi|anafilax|choque anafilactico|hiperpotasemia|fibrilacion ventricular|asistolia|paro cardiaco|paro ventilatorio|paro respiratorio|apnea|omision de adrenalina|antiagregante|dengue.*(aines|aspirina|hemorragia)|metotrexato|stevens|serotoninergico|depresion respiratoria|wernicke|crisis adrenergica|crisis hipertensiva|broncoespasmo severo|hipotension iatrogenica|shock vasoplejico|choque cardiogenico|hipoglucemia iatrogenica|descenso glucemico excesivo|neuroglucopen|coma|hipermagnesemia|hemorragia|exsanguinacion|sobredosis|dosis letal|riesgo letal|necrosis hepatica|hepatotoxic|edema pulmonar|sobrecarga hidrica|sindrome de reye|perforacion)\b/.test(
    nErr
  );
}

interface TherapeuticEquivalenceGroup {
  label: string;
  note: string;
  terms: string[];
  excludeIfDiag?: RegExp;
  onlyIfDiag?: RegExp;
}

const THERAPEUTIC_EQUIVALENCE_GROUPS: TherapeuticEquivalenceGroup[] = [
  {
    label: 'Ácido Acetilsalicílico (ASA / Aspirina)',
    note: 'Equivalencia directa de nomenclatura',
    terms: ['aspirina', 'acido acetilsalicilico', 'aas', 'asa'],
  },
  {
    label: 'Epinefrina / Adrenalina',
    note: 'Equivalencia directa de nomenclatura',
    terms: ['adrenalina', 'epinefrina'],
  },
  {
    label: 'Acetaminofén / Paracetamol (LBM MINSA)',
    note: 'Acetaminofén y Paracetamol son la misma molécula',
    terms: ['paracetamol', 'acetaminofen'],
  },
  {
    label: 'Analgésico / Antipirético no opioide (MINSA)',
    note: 'Metamizol/Dipirona aceptado como alternativa antipirética/analgésica cuando no existe contraindicación hemorrágica o por Dengue',
    terms: ['paracetamol', 'acetaminofen', 'metamizol', 'dipirona'],
    excludeIfDiag: /dengue|hemorrag|ulcera|colitis|stevens/,
  },
  {
    label: 'AINEs antiinflamatorios/analgésicos',
    note: 'Equivalencia de clase AINE según disponibilidad (MINSA / Internacional)',
    terms: ['ibuprofeno', 'naproxeno', 'diclofenaco', 'ketoprofeno', 'ketorolaco', 'meloxicam', 'celecoxib', 'indometacina'],
    excludeIfDiag: /dengue|hemorrag|ulcera|lesion renal|insuficiencia renal|preeclampsia|colitis/,
  },
  {
    label: 'Cristaloides Isotónicos (SSN 0.9% / Hartmann / Ringer)',
    note: 'Cristaloide isotónico equivalente para reanimación o hidratación IV',
    terms: ['salina', 'ssn', 'cloruro de sodio', 'fisiologica', 'cristaloides', 'hartmann', 'ringer', 'lactato de ringer'],
  },
  {
    label: 'Sales de Rehidratación Oral (SRO / Suero Oral)',
    note: 'SRO estándar OMS / Plan A-B MINSA',
    terms: ['suero oral', 'sro', 'sales de rehidratacion', 'rehidratacion oral', 'vida suero oral', 'suero de rehidratacion'],
  },
  {
    label: 'Insulina Cristalina / Rápida / Regular',
    note: 'Insulina regular (cristalina) para manejo agudo',
    terms: ['insulina', 'insulina rapida', 'insulina regular', 'insulina cristalina'],
  },
  {
    label: 'Anticoagulación Parenteral (HBPM / HNF)',
    note: 'Equivalencia HBPM (Enoxaparina) o Heparina No Fraccionada (LBM MINSA)',
    terms: ['enoxaparina', 'heparina', 'hbpm', 'hnf', 'dalteparina', 'fondaparinux'],
  },
  {
    label: 'Fluoroquinolona Respiratoria',
    note: 'Fluoroquinolona antineumocócica equivalente',
    terms: ['levofloxacino', 'moxifloxacino', 'fluoroquinolona'],
  },
  {
    label: 'Oxigenoterapia suplementaria',
    note: 'Soporte de oxígeno titulado',
    terms: ['oxigeno', 'oxigenoterapia', 'o2', 'canula nasal', 'mascarilla'],
  },
  {
    label: 'Benzodiacepinas de urgencia',
    note: 'Benzodiacepina equivalente según disponibilidad (Diazepam LBM MINSA / Lorazepam / Midazolam)',
    terms: ['lorazepam', 'diazepam', 'midazolam', 'clonazepam', 'benzodiacepina'],
  },
  {
    label: 'Inhibidor P2Y12 (Clopidogrel LBM MINSA / Ticagrelor / Prasugrel)',
    note: 'Antiagregante P2Y12 equivalente según disponibilidad (Clopidogrel en LBM MINSA; Ticagrelor/Prasugrel en guías ESC/AHA)',
    terms: ['ticagrelor', 'prasugrel', 'clopidogrel', 'p2y12'],
  },
  {
    label: 'Terapia de Reperfusión / Trombólisis (Estreptoquinasa / Alteplasa / ICP)',
    note: 'Reperfusión coronaria o trombólisis disponible según nivel resolutivo',
    terms: ['alteplasa', 'tenecteplasa', 'estreptoquinasa', 'trombolisis', 'fibrinolisis', 'angioplastia', 'icp'],
  },
  {
    label: 'Analgésicos Opioides / Rescate de Dolor Severo',
    note: 'Opioide titulado equivalente',
    terms: ['tramadol', 'buprenorfina', 'morfina', 'fentanilo'],
  },
  {
    label: 'Soluciones Glucosadas (Dextrosa)',
    note: 'Dextrosa / solución glucosada equivalente',
    terms: ['dextrosa', 'glucosa', 'solucion glucosada', 'dw5', 'dw10', 'dw50'],
  },
  {
    label: 'Inhibidores de Bomba de Protones (Omeprazol LBM MINSA)',
    note: 'IBP equivalente de clase (Omeprazol LBM MINSA / Pantoprazol / Esomeprazol)',
    terms: ['omeprazol', 'esomeprazol', 'pantoprazol', 'lansoprazol', 'rabeprazol'],
  },
  {
    label: 'IECA (Enalapril LBM MINSA)',
    note: 'IECA equivalente de clase',
    terms: ['enalapril', 'captopril', 'lisinopril', 'ramipril'],
  },
  {
    label: 'ARA-II (Irbesartán / Losartán LBM MINSA)',
    note: 'ARA-II equivalente de clase',
    terms: ['losartan', 'irbesartan', 'valsartan', 'telmisartan', 'candesartan'],
  },
  {
    label: 'Bloqueo SRAA Primera Línea en HTA Crónica / Nefropatía',
    note: 'En HTA crónica o nefropatía diabética estable, IECA, ARA-II o calcioantagonista de primera línea son alternativas válidas (MINSA / ESC / ACC)',
    terms: ['enalapril', 'lisinopril', 'losartan', 'irbesartan', 'valsartan', 'amlodipino', 'hidroclorotiazida'],
    onlyIfDiag: /hipertension arterial|nefropatia|microalbuminuria|diabetes/,
  },
  {
    label: 'Calcioantagonistas Dihidropiridínicos',
    note: 'Calcioantagonista equivalente (Amlodipino LBM MINSA / Nifedipino)',
    terms: ['amlodipino', 'nifedipino', 'felodipino'],
  },
  {
    label: 'Diuréticos Tiazídicos',
    note: 'Tiazida equivalente (Hidroclorotiazida LBM MINSA / Clortalidona)',
    terms: ['hidroclorotiazida', 'clortalidona', 'indapamida'],
  },
  {
    label: 'Betabloqueadores Cardioselectivos / Falla Cardíaca',
    note: 'Betabloqueador equivalente según ficha terapéutica',
    terms: ['metoprolol', 'bisoprolol', 'carvedilol', 'atenolol', 'nebivolol'],
    excludeIfDiag: /asma|epoc/,
  },
  {
    label: 'Estatinas de Alta/Moderada Intensidad',
    note: 'Estatina equivalente (Atorvastatina / Simvastatina LBM MINSA / Rosuvastatina)',
    terms: ['atorvastatina', 'rosuvastatina', 'simvastatina', 'pravastatina'],
  },
  {
    label: 'Antidiabéticos Orales Primera Línea (Metformina / Sulfonilurea LBM / iSGLT2)',
    note: 'Metformina en primera línea o combinación según LBM MINSA / ADA',
    terms: ['metformina', 'glibenclamida', 'glimepirida', 'empagliflozina', 'dapagliflozina', 'sitagliptina'],
  },
  {
    label: 'Antihistamínicos H1 (Loratadina / Clorfeniramina LBM MINSA)',
    note: 'Antihistamínico H1 equivalente (Loratadina, Cetirizina, Clorfeniramina)',
    terms: ['loratadina', 'cetirizina', 'desloratadina', 'fexofenadina', 'clorfeniramina', 'difenhidramina'],
  },
  {
    label: 'Corticoides Inhalados (Beclometasona LBM MINSA / Budesonida)',
    note: 'Corticoide inhalado equivalente (Beclometasona es estándar en LBM MINSA)',
    terms: ['beclometasona', 'budesonida', 'fluticasona', 'mometasona'],
  },
  {
    label: 'Corticoides Sistémicos (Prednisona / Hidrocortisona / Dexametasona)',
    note: 'Corticoide sistémico equivalente según vía (Prednisona VO / Hidrocortisona o Dexametasona IV)',
    terms: ['prednisona', 'prednisolona', 'hidrocortisona', 'metilprednisolona', 'dexametasona'],
    excludeIfDiag: /tina|tinea|dermatofitosis|dengue/,
  },
  {
    label: 'Broncodilatadores SABA / Rescate (Salbutamol LBM MINSA)',
    note: 'Broncodilatador inhalado equivalente',
    terms: ['salbutamol', 'albuterol', 'fenoterol', 'ipratropio', 'bromuro de ipratropio'],
  },
  {
    label: 'Antieméticos / Procinéticos',
    note: 'Antiemético equivalente (Metoclopramida LBM MINSA / Ondansetrón / Dimenhidrinato)',
    terms: ['metoclopramida', 'ondansetron', 'domperidona', 'dimenhidrinato'],
  },
  {
    label: 'Antiespasmódicos (Butilhioscina / Hioscina)',
    note: 'Antiespasmódico equivalente',
    terms: ['hioscina', 'butilhioscina', 'butilbromuro', 'trimebutina', 'pinaverio'],
  },
  {
    label: 'Antimicrobianos IVU Baja / Cistitis (MINSA + IDSA)',
    note: 'Esquema válido para IVU no complicada (Nitrofurantoína, TMP/SMX, Fosfomicina o Cefalexina)',
    terms: ['nitrofurantoina', 'fosfomicina', 'trimetoprim', 'sulfametoxazol', 'cotrimoxazol', 'tmp smx', 'tmp', 'smx', 'bactrim', 'cefalexina', 'cefadroxilo'],
    onlyIfDiag: /cistitis|urinaria|ivu|itu/,
  },
  {
    label: 'Trimetoprim / Sulfametoxazol (TMP-SMX / Cotrimoxazol)',
    note: 'Misma combinación antimicrobiana',
    terms: ['trimetoprim', 'sulfametoxazol', 'cotrimoxazol', 'tmp', 'smx'],
  },
  {
    label: 'Antiestafilocócico / Piel y Partes Blandas (Dicloxacilina / Cefalexina MINSA)',
    note: 'Cobertura grampositiva equivalente (Dicloxacilina, Cefalexina, Clindamicina o Amoxicilina/Clavulanato)',
    terms: ['dicloxacilina', 'cefalexina', 'cefadroxilo', 'clindamicina', 'amoxiclav', 'amoxicilina'],
    onlyIfDiag: /impetigo|celulitis|erisipela|piel|absceso|foliculitis/,
  },
  {
    label: 'Antimicrobiano Faringoamigdalitis Estreptocócica (Penicilina Benzatínica MINSA / Amoxicilina)',
    note: 'Penicilina G benzatínica IM o Amoxicilina VO como primera línea equivalente (MINSA / IDSA)',
    terms: ['penicilina benzatinica', 'penicilina g', 'amoxicilina', 'azitromicina', 'claritromicina', 'cefalexina', 'clindamicina'],
    onlyIfDiag: /faringoamigdalitis|amigdalitis|estreptococ/,
  },
  {
    label: 'Cefalosporina de 3.ª Generación Parenteral (Ceftriaxona / Cefotaxima)',
    note: 'Cefalosporina 3.ª gen equivalente para meningitis, sepsis o pielonefritis',
    terms: ['ceftriaxona', 'cefotaxima'],
  },
  {
    label: 'Macrólidos Respiratorios',
    note: 'Macrólido equivalente (Azitromicina / Claritromicina / Eritromicina)',
    terms: ['azitromicina', 'claritromicina', 'eritromicina'],
  },
  {
    label: 'Antivirales Antiherpéticos (Aciclovir LBM MINSA / Valaciclovir)',
    note: 'Aciclovir oral/IV (LBM MINSA) equivalente a Valaciclovir/Famciclovir',
    terms: ['aciclovir', 'valaciclovir', 'famciclovir'],
  },
  {
    label: 'Antimicóticos Tópicos / Sistémicos Azólicos o Alilaminas',
    note: 'Antimicótico válido según vía (Clotrimazol, Fluconazol, Miconazol, Terbinafina, Ketoconazol)',
    terms: ['clotrimazol', 'fluconazol', 'miconazol', 'ketoconazol', 'terbinafina', 'itraconazol', 'nistatina'],
  },
  {
    label: 'Nitroimidazoles (Metronidazol LBM MINSA)',
    note: 'Nitroimidazol equivalente',
    terms: ['metronidazol', 'tinidazol', 'secnidazol'],
  },
  {
    label: 'Antihipertensivos en Preeclampsia / Obstetricia (Normativa MINSA)',
    note: 'Antihipertensivo seguro en embarazo/preeclampsia (Hidralazina, Labetalol, Nifedipino, Alfametildopa)',
    terms: ['labetalol', 'hidralazina', 'nifedipino', 'alfametildopa', 'metildopa'],
    onlyIfDiag: /preeclampsia|eclampsia|embarazo|gestacional/,
  },
  {
    label: 'Sulfato de Magnesio (MgSO4)',
    note: 'Neuroprotección y profilaxis de eclampsia',
    terms: ['sulfato de magnesio', 'mgso4', 'magnesio'],
  },
  {
    label: 'Antiepilépticos (Fenitoína DFH LBM MINSA / Levetiracetam)',
    note: 'Anticomicial equivalente (respetando restricción teratogénica de Valproato en mujer fértil)',
    terms: ['fenitoina', 'dfh', 'difenilhidantoina', 'levetiracetam', 'carbamazepina', 'lamotrigina'],
  },
  {
    label: 'Suplementación de Hierro (Sulfato Ferroso LBM MINSA)',
    note: 'Sal ferrosa oral equivalente',
    terms: ['sulfato ferroso', 'hierro polimaltosado', 'fumarato ferroso', 'gluconato ferroso', 'hierro'],
  },
  {
    label: 'Vitamina B12 / Complejo B Neurotrópico',
    note: 'Cobalamina equivalente (Cianocobalamina / Hidroxicobalamina / Complejo B)',
    terms: ['cianocobalamina', 'hidroxicobalamina', 'vitamina b12', 'b12', 'complejo b'],
  },
  {
    label: 'Vitamina D (Colecalciferol / Ergocalciferol)',
    note: 'Suplemento de Vitamina D equivalente',
    terms: ['vitamina d', 'colecalciferol', 'ergocalciferol', 'calcitriol'],
  },
  {
    label: 'ISRS Primera Línea (Fluoxetina / Sertralina LBM MINSA)',
    note: 'Inhibidor selectivo de recaptación de serotonina equivalente',
    terms: ['sertralina', 'fluoxetina', 'escitalopram', 'paroxetina', 'citalopram'],
  },
  {
    label: 'Aminosalicilatos 5-ASA (Sulfasalazina LBM MINSA / Mesalazina)',
    note: 'Sulfasalazina disponible en LBM MINSA como equivalente de 5-ASA a Mesalazina en colitis ulcerosa',
    terms: ['mesalazina', 'sulfasalazina', '5 asa', 'asacol'],
  },
  {
    label: 'Anticoagulación Oral en Fibrilación Auricular (Warfarina LBM MINSA / ACOD)',
    note: 'Warfarina ajustada por INR (LBM MINSA) y anticoagulantes directos (Apixabán/Rivaroxabán) aceptados según disponibilidad',
    terms: ['apixaban', 'rivaroxaban', 'dabigatran', 'edoxaban', 'warfarina', 'acenocumarol'],
    onlyIfDiag: /fibrilacion auricular/,
  },
  {
    label: 'Broncodilatadores de Mantenimiento LAMA / LABA en EPOC',
    note: 'Anticolinérgico (Ipratropio LBM MINSA / Tiotropio) o LABA aceptado en mantenimiento de EPOC',
    terms: [
      'tiotropio',
      'ipratropio',
      'bromuro de ipratropio',
      'salmeterol',
      'formoterol',
      'indacaterol',
      'vilanterol',
      'umeclidinio',
      'olodaterol',
      'glicopirronio',
    ],
    onlyIfDiag: /epoc|obstructiva cronica/,
  },
  {
    label: 'Neuromoduladores de Dolor Neuropático (MINSA / Internacional)',
    note: 'Gabapentina, Pregabalina, Amitriptilina o Carbamazepina (evitar Carbamazepina si historia de alergia/SSJ)',
    terms: ['pregabalina', 'gabapentina', 'amitriptilina', 'carbamazepina', 'duloxetina'],
    onlyIfDiag: /radiculopatia|neuropat|zoster|tunel/,
  },
  {
    label: 'Antibióticos Oftálmicos Tópicos (Conjuntivitis Bacteriana)',
    note: 'Colirio antibiótico equivalente en primer nivel (Tobramicina, Ciprofloxacino, Gentamicina, Cloranfenicol, Eritromicina)',
    terms: ['tobramicina', 'ciprofloxacino', 'gentamicina', 'cloranfenicol', 'moxifloxacino', 'ofloxacino', 'eritromicina oftalmica'],
    onlyIfDiag: /conjuntivitis/,
  },
  {
    label: 'Antigotosos en Ataque Agudo (AINE / Colchicina / Corticoide)',
    note: 'En crisis aguda de gota sin nefropatía ni riesgo GI, AINE, Colchicina o Prednisona en ciclo corto son opciones válidas de primera línea',
    terms: ['naproxeno', 'indometacina', 'ibuprofeno', 'etoricoxib', 'celecoxib', 'colchicina', 'prednisona'],
    onlyIfDiag: /gotosa|gota|podagra/,
  },
  {
    label: 'Betalactámicos Antipseudomónicos en Neutropenia Febril',
    note: 'Monoterapia antipseudomónica de primera línea equivalente (Cefepima, Piperacilina/Tazobactam o Meropenem)',
    terms: ['cefepima', 'cefepime', 'piperacilina', 'tazobactam', 'meropenem', 'imipenem'],
    onlyIfDiag: /neutropenia febril/,
  },
  {
    label: 'Antídotos Competitivos ADH en Intoxicación por Metanol',
    note: 'Fomepizol o Etanol IV cumplen bloqueo competitivo equivalente de la alcohol deshidrogenasa',
    terms: ['etanol', 'alcohol etilico', 'fomepizol'],
    onlyIfDiag: /metanol/,
  },
  {
    label: 'Cofactores de Metabolismo de Formato (Ácido Folínico / Ácido Fólico)',
    note: 'Ácido folínico (leucovorina) y ácido fólico IV aceleran la eliminación del ácido fórmico',
    terms: ['acido folinico', 'leucovorina', 'acido folico', 'folato'],
    onlyIfDiag: /metanol/,
  },
  {
    label: 'N-Acetilcisteína (NAC) Antídoto en Intoxicación por Paracetamol',
    note: 'NAC intravenosa u oral según protocolo',
    terms: ['acetilcisteina', 'n acetilcisteina', 'nac', 'fluimucil'],
    onlyIfDiag: /paracetamol|acetaminofen/,
  },
];

interface MedicationClassProfile {
  id: string;
  classLabel: string;
  pattern: RegExp;
  mechanism: string;
  symptomaticContexts?: RegExp;
}

const MEDICATION_CLASS_PROFILES: MedicationClassProfile[] = [
  {
    id: 'paracetamol',
    classLabel: 'Analgésico y antipirético no opioide',
    pattern: /\b(paracetamol|acetaminofen)\b/,
    mechanism: 'alivio de dolor leve-moderado y control de fiebre sin gastrolesividad',
    symptomaticContexts: /dolor|fiebre|febric|cefalea|otalgia|odinofagia|artralgia|mialgia|dengue|resfriado|sinusitis|bronquitis|faringo|dismenorrea|lumbalgia|fascitis|herpes|neumonia|apendicitis|colecistitis|pancreatitis|pielonefritis/,
  },
  {
    id: 'aines',
    classLabel: 'AINE (Antiinflamatorio no esteroideo)',
    pattern: /\b(ibuprofeno|naproxeno|diclofenaco|ketorolaco|ketoprofeno|meloxicam|indometacina|celecoxib|etoricoxib|piroxicam|metamizol|dipirona|dexketoprofeno)\b/,
    mechanism: 'control de inflamación, dolor agudo y fiebre',
    symptomaticContexts: /dolor|inflam|lumbalgia|esguince|fascitis|dismenorrea|gota|artritis|otitis|cefalea|radiculopatia|pericarditis|sinusitis|faringo|fiebre/,
  },
  {
    id: 'opioides',
    classLabel: 'Analgésico opioide / de acción central',
    pattern: /\b(tramadol|morfina|fentanilo|buprenorfina|codeina|oxicodona|meperidina)\b/,
    mechanism: 'analgesia de dolor agudo intenso o refractario',
    symptomaticContexts: /dolor intenso|severo|pancreatitis|infarto|compartimental|colico|fractura|quemadura|isquemia/,
  },
  {
    id: 'penicilinas',
    classLabel: 'Penicilina / Aminopenicilina (Betalactámico)',
    pattern: /\b(amoxicilina|ampicilina|penicilina|dicloxacilina|oxacilina|piperacilina|tazobactam|clavulan|sulbactam|amoxiclav|augmentin)\b/,
    mechanism: 'antibiótico betalactámico con actividad frente a cocos grampositivos y flora respiratoria/tejidos blandos según combinación',
  },
  {
    id: 'cefalosporinas_1',
    classLabel: 'Cefalosporina de 1.ª generación',
    pattern: /\b(cefalexina|cefadroxilo|cefazolina|cefalotina|cefradina)\b/,
    mechanism: 'antibiótico betalactámico orientado principalmente a cocos grampositivos (piel/partes blandos e IVU simple)',
  },
  {
    id: 'cefalosporinas_234',
    classLabel: 'Cefalosporina de 2.ª, 3.ª o 4.ª generación',
    pattern: /\b(cefuroxima|ceftriaxona|cefotaxima|cefixima|ceftazidima|cefepima|cefepime|cefpodoxima)\b/,
    mechanism: 'antibiótico betalactámico de espectro ampliado frente a gramnegativos y neumococo',
  },
  {
    id: 'macrolidos',
    classLabel: 'Macrólido',
    pattern: /\b(azitromicina|claritromicina|eritromicina)\b/,
    mechanism: 'antibiótico bacteriostático útil en atípicos, alternativas en alergia a penicilina y enteropatógenos selectos',
  },
  {
    id: 'fluoroquinolonas',
    classLabel: 'Fluoroquinolona',
    pattern: /\b(ciprofloxacino|levofloxacino|moxifloxacino|ofloxacino|norfloxacino)\b/,
    mechanism: 'antibiótico bactericida de amplio espectro (urinario, entérico o respiratorio según molécula)',
  },
  {
    id: 'nitroimidazoles',
    classLabel: 'Nitroimidazol',
    pattern: /\b(metronidazol|tinidazol|secnidazol|ornidazol)\b/,
    mechanism: 'cobertura contra bacterias anaerobias y protozoarios',
  },
  {
    id: 'otros_antibioticos',
    classLabel: 'Antimicrobiano sistémico/urinario',
    pattern: /\b(nitrofurantoina|fosfomicina|trimetoprim|sulfametoxazol|cotrimoxazol|bactrim|clindamicina|doxiciclina|tetraciclina|vancomicina|meropenem|imipenem|ertapenem|gentamicina|amikacina|tobramicina|cloranfenicol|linezolid|rifampicina)\b/,
    mechanism: 'terapia antibiótica dirigida según foco y sensibilidad microbiológica',
  },
  {
    id: 'ibp',
    classLabel: 'Inhibidor de bomba de protones (IBP)',
    pattern: /\b(omeprazol|esomeprazol|pantoprazol|lansoprazol|rabeprazol|dexlansoprazol)\b/,
    mechanism: 'supresión ácida gástrica y gastroprotección mucosa',
    symptomaticContexts: /gastritis|dispepsia|ulcera|reflujo|erge|hemorragia digestiva|epigastr|acidez|pirosis|aine|corticoide/,
  },
  {
    id: 'antiacidos_h2',
    classLabel: 'Antihistamínico H2 / Antiácido / Citoprotector gástrico',
    pattern: /\b(famotidina|ranitidina|sucralfato|hidroxido de aluminio|hidroxido de magnesio|magaldrato|bicarbonato|alginato)\b/,
    mechanism: 'alivio sintomático de hiperacidez, reflujo o gastritis',
    symptomaticContexts: /gastritis|dispepsia|reflujo|erge|ulcera|pirosis|epigastr/,
  },
  {
    id: 'antiemeticos',
    classLabel: 'Antiemético / Procinético',
    pattern: /\b(metoclopramida|ondansetron|domperidona|dimenhidrinato|meclizina|betahistina)\b/,
    mechanism: 'control de náuseas, vómitos o componente vertiginoso',
    symptomaticContexts: /vomit|nause|vertigo|mareo|migrana|gastroenteritis|disenteria|colecistitis|pancreatitis|apendicitis|pielonefritis/,
  },
  {
    id: 'antiespasmodicos',
    classLabel: 'Antiespasmódico anticolinérgico',
    pattern: /\b(hioscina|butilhioscina|butilbromuro|trimebutina|pinaverio|mebeverina)\b/,
    mechanism: 'alivio de dolor cólico visceral o espasmo gastrointestinal',
    symptomaticContexts: /colico|intestino irritable|gastroenteritis|disenteria|dismenorrea|biliar|nefrit/,
  },
  {
    id: 'antihistaminicos',
    classLabel: 'Antihistamínico H1',
    pattern: /\b(loratadina|cetirizina|desloratadina|fexofenadina|clorfeniramina|difenhidramina|hidroxicina|levocetirizina)\b/,
    mechanism: 'bloqueo histaminérgico H1 para prurito, habones o rinorrea alérgica',
    symptomaticContexts: /prurito|picazon|urticaria|ronchas|dermatitis|escabiosis|sarna|alergi|anafilax|rinorrea|zoster/,
  },
  {
    id: 'corticoides_sistemicos',
    classLabel: 'Corticoide sistémico',
    pattern: /\b(prednisona|prednisolona|hidrocortisona|dexametasona|metilprednisolona|betametasona|deflazacort)\b/,
    mechanism: 'antiinflamatorio e inmunomodulador potente para cuadros inflamatorios agudos, broncoespasmo o anafilaxia',
    symptomaticContexts: /asma|epoc|crup|laringotraqueobronquitis|anafilax|urticaria|meningitis|gota|stevens/,
  },
  {
    id: 'corticoides_topicos',
    classLabel: 'Corticoide tópico / nasal',
    pattern: /\b(mometasona|fluticasona|clobetasol|triamcinolona|fluocinolona|desonida|hidrocortisona crema|betametasona crema)\b/,
    mechanism: 'antiinflamatorio cutáneo o mucoso local',
    symptomaticContexts: /dermatitis|eccema|rinosinusitis|sinusitis|hemorroides/,
  },
  {
    id: 'broncodilatadores',
    classLabel: 'Broncodilatador adrenérgico / anticolinérgico',
    pattern: /\b(salbutamol|albuterol|fenoterol|ipratropio|tiotropio|salmeterol|formoterol|budesonida|beclometasona)\b/,
    mechanism: 'broncodilatación o control de inflamación de vía aérea',
    symptomaticContexts: /asma|epoc|bronquitis|sibilanc|broncoespasmo|bronquiolitis|crup|anafilax/,
  },
  {
    id: 'antitusigenos_mucoliticos',
    classLabel: 'Antitusígeno / Mucolítico',
    pattern: /\b(dextrometorfano|ambroxol|bromhexina|acetilcisteina|levodropropizina|guaifenesina|miel)\b/,
    mechanism: 'modulación sintomática de tos o secreciones bronquiales',
    symptomaticContexts: /tos|bronquitis|resfriado|rinofaringitis/,
  },
  {
    id: 'cristaloides',
    classLabel: 'Cristaloide isotónico intravenoso',
    pattern: /\b(solucion salina|salina|ssn|cloruro de sodio|hartmann|ringer|lactato de ringer|fisiologica|cristaloides)\b/,
    mechanism: 'reposición de volemia e hidratación parenteral',
    symptomaticContexts: /deshidrat|hipotens|choque|shock|vomit|sepsis|dengue|cetoacidosis|pancreatitis|apendicitis|ectopico|hemorrag|lesion renal|diarrea/,
  },
  {
    id: 'sro',
    classLabel: 'Sales de rehidratación oral / hidratación enteral',
    pattern: /\b(suero oral|sro|sales de rehidratacion|vida suero oral|suero de rehidratacion)\b/,
    mechanism: 'rehidratación oral y reposición hidroelectrolítica fisiológica',
    symptomaticContexts: /diarrea|gastroenteritis|disenteria|vomit|deshidrat|fiebre|dengue/,
  },
  {
    id: 'antihipertensivos',
    classLabel: 'Antihipertensivo / Vasodilatador',
    pattern: /\b(enalapril|captopril|lisinopril|ramipril|losartan|irbesartan|valsartan|telmisartan|amlodipino|nifedipino|hidralazina|labetalol|metildopa|alfametildopa|nitroprusiato|nitroglicerina|isosorbide)\b/,
    mechanism: 'reducción de presión arterial o poscarga cardiovascular',
  },
  {
    id: 'betabloqueadores',
    classLabel: 'Betabloqueador',
    pattern: /\b(metoprolol|bisoprolol|carvedilol|atenolol|propranolol|nebivolol|esmolol|nadolol)\b/,
    mechanism: 'control de frecuencia cardíaca, presión arterial y demanda miocárdica',
  },
  {
    id: 'diureticos',
    classLabel: 'Diurético',
    pattern: /\b(furosemida|hidroclorotiazida|clortalidona|espironolactona|indapamida|bumetanida)\b/,
    mechanism: 'eliminación renal de sodio y volumen extracelular',
  },
  {
    id: 'estatinas',
    classLabel: 'Estatina / Hipolipemiante',
    pattern: /\b(atorvastatina|rosuvastatina|simvastatina|pravastatina|ezetimiba|fenofibrato|gemfibrozilo)\b/,
    mechanism: 'reducción de colesterol LDL y riesgo cardiovascular',
  },
  {
    id: 'antiagregantes_anticoagulantes',
    classLabel: 'Antiagregante plaquetario / Anticoagulante',
    pattern: /\b(aspirina|acido acetilsalicilico|clopidogrel|ticagrelor|prasugrel|enoxaparina|heparina|warfarina|apixaban|rivaroxaban|dabigatran|alteplasa|estreptoquinasa)\b/,
    mechanism: 'prevención o tratamiento de trombosis arterial o venosa',
  },
  {
    id: 'antidiabeticos_insulina',
    classLabel: 'Insulina / Antidiabético',
    pattern: /\b(insulina|metformina|glibenclamida|glimepirida|empagliflozina|dapagliflozina|sitagliptina|gliclazida)\b/,
    mechanism: 'control glucémico e inhibición de cetogénesis',
  },
  {
    id: 'psicofarmacos',
    classLabel: 'Psicofármaco (ISRS / Ansiolítico / Benzodiacepina)',
    pattern: /\b(sertralina|fluoxetina|escitalopram|paroxetina|citalopram|venlafaxina|amitriptilina|duloxetina|alprazolam|diazepam|lorazepam|clonazepam|midazolam|haloperidol)\b/,
    mechanism: 'modulación serotoninérgica, ansiolítica o anticonvulsiva central',
  },
  {
    id: 'antimicoticos',
    classLabel: 'Antimicótico',
    pattern: /\b(clotrimazol|fluconazol|miconazol|ketoconazol|terbinafina|itraconazol|nistatina)\b/,
    mechanism: 'erradicación fúngica tópica o sistémica',
  },
  {
    id: 'antivirales',
    classLabel: 'Antiviral',
    pattern: /\b(aciclovir|valaciclovir|famciclovir|oseltamivir)\b/,
    mechanism: 'inhibición de replicación viral específica',
  },
  {
    id: 'suplementos_electrolitos',
    classLabel: 'Suplemento nutricional / Electrolito / Vitaminas',
    pattern: /\b(sulfato ferroso|hierro|acido folico|cianocobalamina|vitamina b12|vitamina d|colecalciferol|tiamina|vitamina b1|gluconato de calcio|cloruro de potasio|kcl|sulfato de magnesio|zinc|psyllium|polietilenglicol|lactulosa)\b/,
    mechanism: 'corrección de déficit nutricional, electrolítico o tránsito intestinal',
  },
];

function findMedicationClassProfile(drugTextNorm: string): MedicationClassProfile | null {
  for (const profile of MEDICATION_CLASS_PROFILES) {
    if (profile.pattern.test(drugTextNorm)) {
      return profile;
    }
  }
  return null;
}

function getItemContraindicationReason(
  item: MedicationItem,
  caseData: ClinicalCase,
  fullPlan: MedicationItem[] = []
): string | null {
  const fullPlanJoined = normStr(fullPlan.map((m) => `${m.drug} ${m.dose}`).join(' '));
  const itemAudit = auditMedicationPlanSafety([item], caseData);
  if (itemAudit.errors.length > 0) {
    const firstErr = itemAudit.errors[0];
    const isMyxedemaPairingSafe =
      normStr(firstErr).includes('coma mixedematoso') &&
      /\b(hidrocortisona|dexametasona|metilprednisolona)\b/.test(fullPlanJoined);
    const isPheoPairingSafe =
      normStr(firstErr).includes('feocromocitoma') &&
      /\b(fentolamina|fenoxibenzamina|prazosina|doxazosina|nicardipino)\b/.test(fullPlanJoined);
    if (!isMyxedemaPairingSafe && !isPheoPairingSafe) {
      return firstErr;
    }
  }
  const active = stripNegatedMedicationClauses(`${item.drug} ${item.dose} ${item.route}`);
  if (!active) return null;

  const allergiesNorm = normStr((caseData.background?.allergies || []).join(' '));
  const diagNorm = normStr(caseData.solution?.correctDiagnosis || '');

  if (allergiesNorm.includes('penicilin') || allergiesNorm.includes('betalactam')) {
    if (
      /\b(amoxicilin[a-z]*|ampicilin[a-z]*|penicilin[a-z]*|piperacilin[a-z]*|dicloxacilin[a-z]*|amoxiclav|augmentin|cefalexin[a-z]*|cefadroxil[a-z]*)\b/.test(
        active
      )
    ) {
      return `Riesgo anafiláctico grave: el paciente tiene alergia documentada a penicilina/betalactámicos y ${item.drug} presenta reactividad cruzada.`;
    }
  }
  if (allergiesNorm.includes('sulfa') && /\b(trimetoprim[a-z]*|sulfametoxazol[a-z]*|cotrimoxazol|bactrim)\b/.test(active)) {
    return `Contraindicado por alergia documentada a sulfamidas.`;
  }
  if (
    diagNorm.includes('dengue') &&
    /\b(ibuprofeno|aspirina|acido acetilsalicilico|aas|ketorolaco|diclofenaco|naproxeno|metamizol|dipirona|meloxicam|celecoxib|indometacina|piroxicam)\b/.test(
      active
    )
  ) {
    return `Contraindicado en Dengue: los AINEs y el AAS agravan la disfunción plaquetaria y elevan el riesgo de hemorragia o choque.`;
  }
  if (
    (diagNorm.includes('lesion renal') || diagNorm.includes('insuficiencia renal')) &&
    /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|celecoxib|indometacina|losartan|valsartan|irbesartan|telmisartan|enalapril|captopril|lisinopril|ramipril|gentamicina|amikacina)\b/.test(
      active
    )
  ) {
    return `Contraindicado en Lesión Renal Aguda: ${item.drug} empeora la perfusión/función renal y agrava la hiperpotasemia.`;
  }
  if (
    (diagNorm.includes('hemorragia digestiva') ||
      diagNorm.includes('ulcera peptica') ||
      diagNorm.includes('colitis ulcerosa') ||
      diagNorm.includes('gastritis')) &&
    /\b(ibuprofeno|ketorolaco|diclofenaco|naproxeno|meloxicam|celecoxib|indometacina|piroxicam|aspirina|acido acetilsalicilico|aas)\b/.test(
      active
    )
  ) {
    return `Contraindicado en patología gastrolesiva activa (${caseData.solution?.correctDiagnosis}): los AINEs/AAS erosionan la mucosa y precipitan sangrado.`;
  }
  if (
    (diagNorm.includes('tina') || diagNorm.includes('tinea') || diagNorm.includes('dermatofitosis')) &&
    /\b(hidrocortisona|betametasona|clobetasol|dexametasona|prednisona|prednisolona|mometasona|triamcinolona|fluocinolona|barmicil|quadriderm|corticoide)\b/.test(
      active
    )
  ) {
    return `Contraindicado en dermatofitosis: los corticoides favorecen la proliferación fúngica y originan Tiña Incógnita.`;
  }
  if (
    diagNorm.includes('epilep') &&
    caseData.patientInfo?.sex === 'Femenino' &&
    (caseData.patientInfo?.age ?? 30) < 48 &&
    /\b(valproato|acido valproico|valproico|divalproex|depakene)\b/.test(active)
  ) {
    return `Riesgo teratogénico mayor en mujer en edad fértil (se prefiere Levetiracetam o Lamotrigina).`;
  }
  if (
    (diagNorm.includes('asma') || diagNorm.includes('epoc') || diagNorm.includes('obstructiva cronica')) &&
    /\b(propranolol|nadolol|carvedilol|timolol|sotalol|alprazolam|diazepam|lorazepam|clonazepam|midazolam|morfina|fentanilo|codeina)\b/.test(
      active
    )
  ) {
    return `Contraindicado en vía aérea reactiva/obstructiva: riesgo de broncoespasmo refractario o depresión respiratoria.`;
  }
  if (diagNorm.includes('bronquiectas') && /\b(codeina|dextrometorfano|levodropropizina)\b/.test(active)) {
    return `Contraindicado en bronquiectasias: suprime el reflejo tusígeno y favorece la retención de secreciones purulentas.`;
  }
  if (
    diagNorm.includes('preeclampsia') &&
    /\b(enalapril|captopril|lisinopril|ramipril|losartan|valsartan|irbesartan|telmisartan|ibuprofeno|ketorolaco|naproxeno|diclofenaco)\b/.test(
      active
    )
  ) {
    return `Contraindicación obstétrica en Preeclampsia (teratogenicidad/nefrotoxicidad de IECA, ARA-II y AINEs).`;
  }
  if ((caseData.patientInfo?.age ?? 30) < 12 && /\b(aspirina|acido acetilsalicilico|aas|asa)\b/.test(active)) {
    return `Contraindicado en menores de 12 años por riesgo de Síndrome de Reye.`;
  }
  if (diagNorm.includes('ectopico') && diagNorm.includes('roto') && /\b(metotrexato|methotrexate|mtx)\b/.test(active)) {
    return `Contraindicado en embarazo ectópico roto con hemoperitoneo; requiere resolución quirúrgica urgente.`;
  }
  if (diagNorm.includes('serotoninergico') && /\b(sertralina|fluoxetina|paroxetina|citalopram|escitalopram|venlafaxina|tramadol|dextrometorfano|linezolid|haloperidol|succinilcolina|ondansetron|metoclopramida|litio)\b/.test(active)) {
    return `Contraindicado en Síndrome Serotoninérgico: perpetúa o agrava la toxicidad neuromuscular y autonómica.`;
  }
  if (
    diagNorm.includes('diseccion aortica') &&
    /\b(aspirina|acido acetilsalicilico|aas|asa|clopidogrel|ticagrelor|prasugrel|heparina|enoxaparina|warfarina|apixaban|rivaroxaban|alteplasa|tenecteplasa|estreptoquinasa)\b/.test(
      active
    )
  ) {
    return `Contraindicado en Disección Aórtica Aguda: el antitrombótico/fibrinolítico precipita rotura aórtica y taponamiento fatal.`;
  }
  if (/intoxicacion.*paracetamol|intoxicacion.*acetaminofen|sobredosis.*paracetamol/.test(diagNorm) && /\b(paracetamol|acetaminofen)\b/.test(active)) {
    return `Contraindicado en Intoxicación por Paracetamol: agrava la toxicidad hepática por NAPQI.`;
  }
  if (diagNorm.includes('parkinson') && /\b(metoclopramida|haloperidol|clorpromazina|risperidona)\b/.test(active)) {
    return `Contraindicado en Enfermedad de Parkinson: el bloqueo dopaminérgico central precipita rigidez extrema y acinesia aguda.`;
  }
  return null;
}

function evaluateProposedMedications(
  userRx: MedicationItem[],
  optRx: Array<{ drug: string; dose: string; route: string; frequency: string; duration: string; rationale: string }>,
  caseData: ClinicalCase,
  nonBacterialCase: boolean
): ProposedMedicationReview[] {
  const solution = caseData.solution;
  const diagNorm = normStr(solution?.correctDiagnosis || '');
  const optNamesShort =
    optRx.length > 0
      ? optRx.map((r) => r.drug.split('(')[0].trim()).slice(0, 3).join(' + ')
      : 'medidas no farmacológicas y soporte clínico';
  const caseContextNorm = normStr(
    `${solution?.correctDiagnosis || ''} ${caseData.patientInfo?.consultReason || ''} ${caseData.patientInfo?.currentIllness || ''} ${(caseData.physicalExamPool || []).filter((p) => p.isAbnormal).map((p) => p.finding).join(' ')}`
  );

  return userRx.map((item) => {
    const drugLabel = (item.drug || '').trim() || 'Fármaco sin nombre';
    const doseSummary =
      [item.dose, item.route, item.frequency, item.duration].filter((x) => (x || '').trim()).join(' · ') ||
      'Posología no especificada';

    const missingPosology: string[] = [];
    if (!(item.dose || '').trim()) missingPosology.push('dosis');
    if (!(item.route || '').trim()) missingPosology.push('vía');
    if (!(item.frequency || '').trim()) missingPosology.push('frecuencia');
    if (!(item.duration || '').trim()) missingPosology.push('duración');

    let posologyNote =
      missingPosology.length === 0
        ? `Posología completa registrada (${doseSummary}).`
        : `Posología incompleta: faltó precisar ${missingPosology.join(', ')}.`;

    const rawJoined = `${item.drug || ''} ${item.dose || ''} ${item.route || ''}`;
    const activeClean = stripNegatedMedicationClauses(rawJoined);

    // Caso 1: Orden explícita de suspender o evitar un fármaco
    if (!activeClean && normStr(rawJoined).length > 0) {
      const negatedTarget = optRx.find((rx) => matchesOptimalDrug(normStr(rawJoined), rx.drug, diagNorm).matched);
      if (negatedTarget) {
        return {
          id: item.id,
          drug: drugLabel,
          doseSummary,
          verdict: 'diferente_o_suboptimo',
          verdictLabel: 'Suspensión no recomendada',
          matchedReferenceDrug: negatedTarget.drug,
          clinicalComment: `Indicaste suspender o evitar "${drugLabel}", pero este medicamento forma parte del esquema indicado (${negatedTarget.drug}): ${negatedTarget.rationale}`,
          posologyNote,
        };
      }
      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'alternativa_valida',
        verdictLabel: 'Medida de retiro segura',
        clinicalComment: `Indicaste suspender o evitar "${drugLabel}", una medida de seguridad válida para prevenir interacciones o agravamiento iatrogénico.`,
        posologyNote,
      };
    }

    // Caso 2: Riesgo crítico o contraindicación en este paciente
    const safetyIssue = getItemContraindicationReason(item, caseData, userRx);
    if (safetyIssue) {
      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'riesgoso_o_contraindicado',
        verdictLabel: 'Riesgoso / Contraindicado',
        clinicalComment: safetyIssue,
        posologyNote,
      };
    }

    // Caso 3: Coincidencia directa o equivalencia terapéutica contra esquema óptimo
    const itemNorm = normStr(`${item.drug} ${item.dose} ${item.route}`);
    for (const rx of optRx) {
      const rxNorm = normStr(rx.drug);
      // Matiz específico: Amoxicilina simple cuando la referencia pide Amoxicilina / Ácido Clavulánico
      const isAmoxiWithoutClav =
        rxNorm.includes('clavulan') &&
        itemNorm.includes('amoxicilin') &&
        !itemNorm.includes('clavulan') &&
        !itemNorm.includes('amoxiclav') &&
        !itemNorm.includes('augmentin');

      const matchRes = matchesOptimalDrug(itemNorm, rx.drug, diagNorm);
      if (!matchRes.matched && !isAmoxiWithoutClav) continue;

      const expectedPosologyRef = `Referencia del caso: ${rx.drug} ${rx.dose} (${rx.route}, ${rx.frequency}${rx.duration ? `, Duración: ${rx.duration}` : ''}).`;
      const routeMismatchNote =
        item.route &&
        rx.route &&
        ((normStr(rx.route).includes('intravenosa') && normStr(item.route).includes('oral')) ||
          (normStr(rx.route).includes('oral') && normStr(item.route).includes('intravenosa')))
          ? ` Atención a la vía elegida (${item.route}): este cuadro suele requerir vía ${rx.route}.`
          : '';
      posologyNote = `${posologyNote} ${expectedPosologyRef}${routeMismatchNote}`;

      if (isAmoxiWithoutClav) {
        return {
          id: item.id,
          drug: drugLabel,
          doseSummary,
          verdict: 'alternativa_valida',
          verdictLabel: 'Misma familia · Cobertura parcial',
          matchedReferenceDrug: rx.drug,
          clinicalComment: `Propusiste Amoxicilina simple, que pertenece a la misma familia que la referencia (${rx.drug}), aunque sin Ácido Clavulánico tiene menor cobertura frente a bacterias productoras de betalactamasas (H. influenzae, M. catarrhalis). En el caso esperado: ${rx.rationale}`,
          posologyNote,
        };
      }

      if (matchRes.equivalentNote) {
        return {
          id: item.id,
          drug: drugLabel,
          doseSummary,
          verdict: 'alternativa_valida',
          verdictLabel: 'Alternativa válida (Misma clase)',
          matchedReferenceDrug: rx.drug,
          clinicalComment: `Propusiste "${drugLabel}", que difiere levemente del fármaco literal de referencia (${rx.drug}), pero es farmacológicamente equivalente: ${matchRes.equivalentNote} Cumple el objetivo: ${rx.rationale}`,
          posologyNote,
        };
      }

      // Revisar si coincidió vía cláusula "o" con otro principio activo distinto al primero
      const directFirstToken = significantTokens(rxNorm.split(/[(/]/)[0] || rxNorm)[0];
      const sharesPrimaryMolecule = directFirstToken ? itemNorm.includes(directFirstToken.slice(0, 5)) : true;
      if (!sharesPrimaryMolecule && /\b(o|\/)\b/.test(rxNorm)) {
        return {
          id: item.id,
          drug: drugLabel,
          doseSummary,
          verdict: 'alternativa_valida',
          verdictLabel: 'Alternativa contemplada en guía',
          matchedReferenceDrug: rx.drug,
          clinicalComment: `Propusiste "${drugLabel}", opción reconocida dentro de las alternativas del esquema de referencia (${rx.drug}). Fundamento clínico: ${rx.rationale}`,
          posologyNote,
        };
      }

      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'acertado',
        verdictLabel: 'Acertado (Primera línea)',
        matchedReferenceDrug: rx.drug,
        clinicalComment: `Coincide con el esquema de primera línea esperado (${rx.drug}). Rol terapéutico en este paciente: ${rx.rationale}`,
        posologyNote,
      };
    }

    // Caso 4: Fármaco diferente a optRx — clasificar su grupo farmacológico y rol clínico
    const profile = findMedicationClassProfile(itemNorm);
    const isPrescribedAbx = SYSTEMIC_ANTIBIOTIC_REGEX.test(itemNorm);

    if (isPrescribedAbx && nonBacterialCase) {
      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'diferente_o_suboptimo',
        verdictLabel: 'Antibiótico no indicado',
        clinicalComment: `Propusiste "${drugLabel}" (${profile?.classLabel || 'antibiótico sistémico'}), pero ${solution.correctDiagnosis} tiene origen no bacteriano (viral, inflamatorio o mecánico). Las guías MINSA/OMS recomiendan evitar antibióticos empíricos innecesarios y centrarse en: ${optNamesShort}.`,
        posologyNote,
      };
    }

    if (isPrescribedAbx) {
      const optAbx = optRx.find((r) => SYSTEMIC_ANTIBIOTIC_REGEX.test(normStr(r.drug)));
      if (optAbx) {
        return {
          id: item.id,
          drug: drugLabel,
          doseSummary,
          verdict: 'diferente_o_suboptimo',
          verdictLabel: 'Espectro / línea diferente',
          matchedReferenceDrug: optAbx.drug,
          clinicalComment: `Propusiste "${drugLabel}" (${profile?.classLabel || 'antimicrobiano'}), un antibiótico de espectro o generación distinta al esquema de primera línea para este foco (${optAbx.drug}). Aunque busca cobertura infecciosa, evalúa sensibilidad local, cobertura de patógenos clave y penetración tisular (${optAbx.rationale}).`,
          posologyNote: `${posologyNote} Esquema de primera línea sugerido: ${optAbx.drug} ${optAbx.dose} (${optAbx.route}, ${optAbx.frequency}, Duración: ${optAbx.duration}).`,
        };
      }
      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'diferente_o_suboptimo',
        verdictLabel: 'Antimicrobiano fuera de esquema',
        clinicalComment: `Propusiste "${drugLabel}" (${profile?.classLabel || 'antimicrobiano'}), pero el manejo prioritario para ${solution.correctDiagnosis} no contempla este antibiótico (${optNamesShort}).`,
        posologyNote,
      };
    }

    if (profile?.symptomaticContexts && profile.symptomaticContexts.test(caseContextNorm)) {
      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'coadyuvante_sintomatico',
        verdictLabel: 'Coadyuvante sintomático / Soporte',
        clinicalComment: `Propusiste "${drugLabel}" (${profile.classLabel}), un apoyo razonable para ${profile.mechanism} según la clínica del paciente; sin embargo, no sustituye los pilares etiológicos esperados (${optNamesShort}).`,
        posologyNote,
      };
    }

    if (profile) {
      return {
        id: item.id,
        drug: drugLabel,
        doseSummary,
        verdict: 'diferente_o_suboptimo',
        verdictLabel: 'Fármaco diferente al esquema',
        clinicalComment: `Propusiste "${drugLabel}" (${profile.classLabel}, orientado a ${profile.mechanism}). Este grupo terapéutico difiere del manejo prioritario para ${solution.correctDiagnosis}, donde las guías indican: ${optNamesShort}.`,
        posologyNote,
      };
    }

    return {
      id: item.id,
      drug: drugLabel,
      doseSummary,
      verdict: 'diferente_o_suboptimo',
      verdictLabel: 'Fuera del esquema de referencia',
      clinicalComment: `Indicaste "${drugLabel}", pero no coincide con los principios activos ni equivalentes aceptados para ${solution.correctDiagnosis} (${optNamesShort}). Verifica si existe un nombre genérico alternativo o si la indicación no corresponde al diagnóstico definitivo.`,
      posologyNote,
    };
  });
}

function evaluateGeneralMeasuresCritique(
  userGeneralMeasures: string,
  optGeneralMeasures: string[]
): string {
  const trimmed = (userGeneralMeasures || '').trim();
  const optList = optGeneralMeasures || [];
  if (!trimmed) {
    return optList.length > 0
      ? `No redactaste medidas generales no farmacológicas. En este cuadro era importante incluir: ${optList.slice(0, 3).join('; ')}.`
      : 'No redactaste medidas generales no farmacológicas.';
  }

  const uNorm = normStr(trimmed);
  const MEASURE_PILLARS: Array<{ label: string; regex: RegExp }> = [
    { label: 'hidratación/líquidos', regex: /\b(?:hidrat|liquid|agua|suero|sro|volumen|via oral|abundant)/ },
    { label: 'reposo/descarga o postura', regex: /\b(?:repos|descans|eleva|cabecera|postura|inmoviliz|descarga|ferula|hielo|compres)/ },
    { label: 'ayuno / dieta específica', regex: /\b(?:npo|ayun|nada por boca|dieta|aliment|fibra|picante|cafe|grasa|irritant|lactancia)/ },
    { label: 'monitorización / signos vitales', regex: /\b(?:monitor|signos vital|vigil|oximet|curva|diuresis|control|tensi|gluc)/ },
    { label: 'oxigenoterapia / vía aérea', regex: /\b(?:oxigen|canula|mascarilla|via aerea|humidif|nebuliz|aspirac)/ },
    { label: 'higiene / aislamiento / contactos', regex: /\b(?:higien|lavado|aislam|contacto|ropa|sabana|bano|ventila|tabaco|alcohol)/ },
    { label: 'signos de alarma / educación', regex: /\b(?:alarma|regresar|urgencia|revalor|empeor|fiebre|sangr|evitar|suspender|no automed)/ },
  ];

  const coveredMeasures: string[] = [];
  const missedMeasures: string[] = [];

  for (const exp of optList) {
    const expNorm = normStr(exp);
    const tokens = significantTokens(expNorm);
    const tokenHits = tokens.filter((tk) => uNorm.includes(tk.slice(0, Math.max(4, tk.length - 1)))).length;
    const pillarMatch = MEASURE_PILLARS.some((p) => p.regex.test(expNorm) && p.regex.test(uNorm));
    if (pillarMatch || (tokens.length > 0 && tokenHits / tokens.length >= 0.3)) {
      coveredMeasures.push(exp);
    } else {
      missedMeasures.push(exp);
    }
  }

  if (coveredMeasures.length > 0 && missedMeasures.length === 0) {
    return `Tus medidas generales ("${trimmed}") cubrieron muy bien los pilares no farmacológicos clave del cuadro.`;
  }
  if (coveredMeasures.length > 0) {
    return `Tus medidas generales ("${trimmed}") acertaron en aspectos clave como "${coveredMeasures[0]}". Como complemento útil, considera añadir: ${missedMeasures.slice(0, 2).join('; ')}.`;
  }
  if (optList.length > 0) {
    return `Propusiste como medidas generales "${trimmed}", aunque difieren de las prioridades no farmacológicas recomendadas para este caso; procura incorporar: ${optList.slice(0, 2).join('; ')}.`;
  }
  return `Registraste medidas generales ("${trimmed}") como parte del plan integral.`;
}

function matchesOptimalDrug(
  userRxText: string,
  expectedDrugLabel: string,
  diagNorm = ''
): { matched: boolean; equivalentNote?: string } {
  const normExpected = normStr(expectedDrugLabel);
  if (!userRxText || !normExpected) return { matched: false };

  // 1. Coincidencia directa por tokens del fármaco esperado
  const directTokens = significantTokens(normExpected);
  if (directTokens.length > 0) {
    const directHits = directTokens.filter((tk) => {
      const stem = tk.slice(0, Math.max(4, tk.length - 1));
      return userRxText.includes(tk) || userRxText.includes(stem);
    }).length;
    if (directHits / directTokens.length >= 0.55) {
      return { matched: true };
    }
  }

  // 2. Equivalencia terapéutica (MINSA Nicaragua LBM + Guías Internacionales)
  for (const group of THERAPEUTIC_EQUIVALENCE_GROUPS) {
    if (group.excludeIfDiag && diagNorm && group.excludeIfDiag.test(diagNorm)) continue;
    if (group.onlyIfDiag && diagNorm && !group.onlyIfDiag.test(diagNorm)) continue;

    const expInGroup = group.terms.some((syn) => hasClinicalTerm(normExpected, syn));
    const matchedUserTerm = group.terms.find((syn) => hasClinicalTerm(userRxText, syn));
    if (expInGroup && matchedUserTerm) {
      return {
        matched: true,
        equivalentNote: `${group.label}: se validó "${matchedUserTerm}" como equivalente a "${expectedDrugLabel}" (${group.note}).`,
      };
    }
  }

  // 3. Alternativas separadas por " o ", "/", "+" o paréntesis en la solución óptima
  const alternatives = normExpected
    .split(/\s+(?:o|y)\s+|[,/+()]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 4);

  for (const alt of alternatives) {
    const tokens = significantTokens(alt);
    if (tokens.length > 0) {
      const hits = tokens.filter((tk) => {
        const stem = tk.slice(0, Math.max(4, tk.length - 1));
        return userRxText.includes(tk) || userRxText.includes(stem);
      }).length;
      if (hits / tokens.length >= 0.5) return { matched: true };
    }
  }

  return { matched: tokenMatchRatio(userRxText, expectedDrugLabel) >= 0.45 };
}

function analyzeAnamnesisPillars(questions: string[] = []) {
  const joined = normStr(questions.join(' '));
  return [
    {
      label: 'Inicio, duración y cronología (o evolución del día previo)',
      hit: /cuando|desde|hora|dia anterior|ayer|anoche|empezo|inicio|evolucion|cuanto tiempo|subito|hace cuanto|cuantos dias|principio/.test(joined),
    },
    {
      label: 'Localización, irradiación e intensidad del síntoma principal',
      hit: /donde|duele|dolor|irradia|corre|intensidad|fuerte|siente|caracteristica|molestia|ardor|escala|tipo de|opresivo|punzante|pulsatil/.test(joined),
    },
    {
      label: 'Síntomas asociados y signos de alarma (fiebre, vómitos, disnea, sangrado)',
      hit: /fiebre|calentura|escalofrio|vomit|basca|nausea|aire|ahog|respir|sangr|mareo|orina|ardor al orinar|diarrea|churria|cabeza|mancha|roncha|picazon|prurito|hinchazon|vision|desmayo/.test(joined),
    },
    {
      label: 'Antecedentes patológicos, quirúrgicos y familiares',
      hit: /enfermedad|hipertension|presion|diabetes|azucar|antecedente|operad|cirugia|familia|padece|sufre|asma|rinon|corazon|cronica/.test(joined),
    },
    {
      label: 'Medicamentos actuales y alergias conocidas',
      hit: /medicament|pastilla|toma|tomo|remedio|alergi|penicilina|insulina|tratamiento|inyect|receta/.test(joined),
    },
    {
      label: 'Hábitos, exposición epidemiológica o historia sexual/ginecológica',
      hit: /fuma|alcohol|licor|viaj|zancudo|mosquito|agua|sexo|sexual|regla|menstrua|ultima regla|fum\b|embaraz|pareja|trabajo|ocupacion|vive|comio/.test(joined),
    },
  ];
}

export function buildRecommendedStatProtocol(caseData: ClinicalCase): {
  requiresUrgentStat: boolean;
  protocol: StatReferenceProtocolItem[];
} {
  const solution = caseData.solution;
  const optRx = solution?.optimalTreatment?.pharmacological || [];
  const hosp = solution?.optimalTreatment?.hospitalizationDecision || '';
  const triage = caseData.patientInfo?.triageLevel || '';
  const age = caseData.patientInfo?.age ?? 30;
  const v = caseData.vitalSigns;
  const baseSys = parseBloodPressurePair(v?.bloodPressure || '120/80').sys;
  const diagNorm = normStr(solution?.correctDiagnosis || '');

  const isAcuteItem = (r: { drug: string; route: string; frequency: string; duration: string }) => {
    const joined = normStr(`${r.drug} ${r.route} ${r.frequency} ${r.duration}`);
    return /\b(stat|iv|intravenos[oa]|im|intramuscular|sl|sublingual|nebuliz|inhalator|bolo|carga|impregnacion|rescate|infusion|dosis unica|cada 20 min|inmediat|emergencia|urgencia|sala de choque)\b/.test(
      joined
    );
  };

  const urgentHosp = hosp !== 'Ambulatorio';
  const highAcuityTriage = /\bNivel\s+(?:I|II)\b/.test(triage);
  const unstableOrThreat = hasImmediateVitalThreat(caseData) || hasUnstableBaselineVitals(caseData);
  const acuteRxItems = optRx.filter(isAcuteItem);

  const requiresUrgentStat = Boolean(
    urgentHosp || highAcuityTriage || unstableOrThreat || acuteRxItems.length > 0
  );

  if (!requiresUrgentStat) {
    return { requiresUrgentStat: false, protocol: [] };
  }

  const protocol: StatReferenceProtocolItem[] = [];
  const seenKeys = new Set<string>();
  const pushItem = (item: StatReferenceProtocolItem) => {
    const key = normStr(item.drug).slice(0, 20);
    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    protocol.push(item);
  };

  const hasOxygenInOpt = optRx.some((r) => /\boxigen|\bo2\b/.test(normStr(r.drug)));
  if ((v?.oxygenSaturation ?? 98) < 92 && !hasOxygenInOpt) {
    pushItem({
      drug: 'Oxígeno suplementario',
      dose: (v?.oxygenSaturation ?? 98) < 88 ? '10–15 L/min mascarilla reservorio' : '4–6 L/min cánula nasal / mascarilla (Meta SpO₂ ≥ 94%)',
      route: 'Inhalatoria',
      timing: 'Inmediato STAT (Minuto 0)',
      rationale: 'Corregir hipoxemia aguda y proteger oxigenación tisular y cerebral.',
    });
  }

  const hasFluidsInOpt = optRx.some((r) =>
    /\b(salina|ssn|hartmann|ringer|cristaloid|suero)\b/.test(normStr(r.drug))
  );
  if ((baseSys < 92 || /\b(choque|shock|sepsis|anafilax|hemorrag|cetoacidosis|addison|crisis suprarrenal|ectopico)\b/.test(diagNorm)) && !hasFluidsInOpt) {
    pushItem({
      drug: 'Solución Salina Normal 0.9% (o Ringer Lactato)',
      dose: age < 12 ? '20 mL/kg en bolo IV' : '500–1000 mL en bolo rápido',
      route: 'Intravenosa (IV)',
      timing: 'Inmediato STAT (Primeros 10–15 min)',
      rationale: 'Restaurar volemia efectiva, precarga y perfusión de órganos diana.',
    });
  }

  for (const r of acuteRxItems) {
    pushItem({
      drug: r.drug,
      dose: r.dose,
      route: r.route,
      timing: /\b(stat|bolo|carga|unica|inmediat|rescate|impregnac)\b/i.test(`${r.frequency} ${r.duration}`)
        ? `${r.frequency} (${r.duration})`
        : `Inicio STAT Urgencias · ${r.frequency}`,
      rationale: r.rationale,
    });
  }

  if (protocol.length === 0 && optRx.length > 0) {
    for (const r of optRx.slice(0, 3)) {
      pushItem({
        drug: r.drug,
        dose: r.dose,
        route: r.route,
        timing: `Inicio urgente en sala · ${r.frequency}`,
        rationale: r.rationale,
      });
    }
  }

  return { requiresUrgentStat: true, protocol };
}

export function buildDidacticEvaluation(
  submission: UserEvaluationInput,
  caseData: ClinicalCase
): EvaluationResult {
  const solution = caseData.solution;
  const qCount = submission.questionCount || 0;
  const doctorQuestions = submission.doctorQuestions || [];

  const diagNormCore = normStr(solution.correctDiagnosis || '');
  const isFocusedPrimaryCase =
    isSimplePrimaryWorkupCase(diagNormCore) || caseData.mode === 'principiante';
  const recognizedEquivalents: string[] = [];

  // 1. ANAMNESIS (0 a 15 pts) — Cero preguntas = 0 puntos; adaptada a complejidad del cuadro
  const pillars = analyzeAnamnesisPillars(doctorQuestions);
  const coveredPillars = pillars.filter((p) => p.hit).map((p) => p.label);
  const missedPillars = pillars.filter((p) => !p.hit).map((p) => p.label);

  let anamScore = 0;
  if (qCount === 0) {
    anamScore = 0;
  } else if (doctorQuestions.length > 0) {
    if (coveredPillars.length === 0) {
      anamScore = 1;
    } else if (isFocusedPrimaryCase) {
      // En primer nivel o casos simples, un interrogatorio dirigido de 4 pilares y 3-4 preguntas alcanza 14-15 pts
      anamScore = Math.min(
        15,
        Math.round((Math.min(coveredPillars.length, 4) / 4) * 13 + Math.min(qCount, 4) * 0.5)
      );
    } else {
      // En casos complejos/urgencias, 5 pilares cubiertos + >=5 preguntas alcanza 15/15
      anamScore = Math.min(
        15,
        Math.round((Math.min(coveredPillars.length, 5) / 5) * 13 + Math.min(qCount, 5) * 0.4)
      );
    }
  } else {
    anamScore = Math.min(15, Math.round(qCount * 2.2));
  }

  const anamDetail: RubricCategoryDetail = {
    whyScore:
      qCount === 0
        ? 'Obtuviste 0/15 porque no realizaste ninguna pregunta al paciente durante la anamnesis.'
        : coveredPillars.length === 0 && doctorQuestions.length > 0
          ? `Realizaste ${qCount} intervención(es), pero ninguna exploró los pilares semiológicos del caso (${anamScore}/15 pts).`
          : isFocusedPrimaryCase
            ? `Realizaste ${qCount} pregunta(s) focalizadas cubriendo ${coveredPillars.length} pilares semiológicos en un motivo de atención primaria (${anamScore}/15 pts).`
            : `Realizaste ${qCount} pregunta(s) cubriendo ${coveredPillars.length} de 6 pilares semiológicos (${anamScore}/15 pts).`,
    strengths:
      coveredPillars.length > 0
        ? coveredPillars.map((c) => `Exploraste: ${c}`)
        : qCount > 0
          ? ['Iniciaste diálogo con el paciente, aunque faltó profundidad clínica.']
          : ['No se registraron preguntas en el interrogatorio clínico.'],
    missingOrImprove:
      missedPillars.length > 0 && !(isFocusedPrimaryCase && coveredPillars.length >= 4)
        ? missedPillars.map((m) => `Faltó interrogar sobre: ${m}`)
        : ['Interrogatorio clínico oportuno y bien focalizado según la complejidad del caso.'],
    expectedStandard: isFocusedPrimaryCase
      ? 'En consulta general focalizada (14-15 pts) basta explorar cronología, características del síntoma, signos de alarma y antecedentes/alergias.'
      : 'Una anamnesis completa (14-15 pts) indaga cronología exacta, semiología del síntoma, signos de alarma, antecedentes/alergias y contexto epidemiológico o fármacos.',
  };

  // 2. EXPLORACIÓN FÍSICA (0 a 15 pts) — Separar maniobras nativas del caso vs sincronización general del catálogo
  const unlockedExamIds = new Set(submission.unlockedExams || []);
  const allExams = caseData.physicalExamPool || [];
  const allAbnormalExams = allExams.filter((pe) => pe.isAbnormal);
  const nativeAbnormalExams = allAbnormalExams.filter((pe) => !pe.id.startsWith('std-pe-'));
  const abnormalExams = nativeAbnormalExams.length > 0 ? nativeAbnormalExams : allAbnormalExams;
  const foundAbnormalExams = abnormalExams.filter((pe) => unlockedExamIds.has(pe.id));
  const missedAbnormalExams = abnormalExams.filter((pe) => !unlockedExamIds.has(pe.id));
  const totalUnlockedExams = allExams.filter((pe) => unlockedExamIds.has(pe.id));
  const exploredAllBlindly =
    allExams.length >= 10 && totalUnlockedExams.length >= allExams.length - 1;

  const nativeExams = allExams.filter((pe) => !pe.id.startsWith('std-pe-'));
  const foundNativeExams = nativeExams.filter((pe) => unlockedExamIds.has(pe.id));
  const missedNativeExams = nativeExams.filter((pe) => !unlockedExamIds.has(pe.id));

  let examScore = 0;
  if (totalUnlockedExams.length === 0) {
    examScore = 0;
  } else if (abnormalExams.length > 0) {
    if (foundAbnormalExams.length === 0) {
      examScore = Math.min(4, totalUnlockedExams.length + 1);
    } else {
      const recallRatio = foundAbnormalExams.length / abnormalExams.length;
      const selectiveBonus = !exploredAllBlindly && totalUnlockedExams.length >= 2 ? 2 : 0;
      const shotgunPenalty = exploredAllBlindly ? 3 : 0;
      examScore = Math.min(
        15,
        Math.max(1, Math.round(recallRatio * 13) + selectiveBonus - shotgunPenalty)
      );
    }
  } else if (nativeExams.length > 0) {
    // Cuadro con examen físico sin hallazgos alterados (negativos pertinentes clave)
    const shotgunPenalty = exploredAllBlindly ? 3 : 0;
    if (foundNativeExams.length === 0) {
      examScore = Math.max(1, Math.min(5, totalUnlockedExams.length + 1) - shotgunPenalty);
    } else {
      const nativeRecall = foundNativeExams.length / nativeExams.length;
      const selectiveBonus = !exploredAllBlindly ? 1 : 0;
      examScore = Math.min(
        15,
        Math.max(1, Math.round(nativeRecall * 14) + selectiveBonus - shotgunPenalty)
      );
    }
  } else {
    examScore = Math.max(1, Math.min(15, totalUnlockedExams.length * 4) - (exploredAllBlindly ? 3 : 0));
  }

  const examDetail: RubricCategoryDetail = {
    whyScore:
      totalUnlockedExams.length === 0
        ? 'Obtuviste 0/15 porque no realizaste ninguna maniobra de exploración física al paciente.'
        : exploredAllBlindly
          ? `Desbloqueaste casi todo el catálogo físico (${totalUnlockedExams.length}/${allExams.length}) de forma indiscriminada; se aplicó ajuste por falta de priorización dirigida (${examScore}/15 pts).`
          : abnormalExams.length > 0
            ? `Ejecutaste ${totalUnlockedExams.length} maniobra(s) dirigida(s) y detectaste ${foundAbnormalExams.length} de ${abnormalExams.length} hallazgo(s) alterados clave del cuadro (${examScore}/15 pts).`
            : nativeExams.length > 0
              ? `Ejecutaste ${totalUnlockedExams.length} maniobra(s) dirigida(s) y verificaste ${foundNativeExams.length} de ${nativeExams.length} maniobra(s) clave de descarte (negativos pertinentes) (${examScore}/15 pts).`
              : `Ejecutaste ${totalUnlockedExams.length} maniobra(s) de exploración física dirigida (${examScore}/15 pts).`,
    strengths:
      foundAbnormalExams.length > 0
        ? foundAbnormalExams.map((e) => `Hallazgo clave detectado: ${e.name}`)
        : abnormalExams.length === 0 && foundNativeExams.length > 0
          ? foundNativeExams.map((e) => `Negativo pertinente confirmado: ${e.name}`)
          : totalUnlockedExams.length > 0
            ? [`Realizaste ${totalUnlockedExams.length} maniobra(s), aunque faltaron las maniobras clave del caso.`]
            : ['No se ejecutaron maniobras de exploración física.'],
    missingOrImprove: [
      ...(abnormalExams.length > 0
        ? missedAbnormalExams.map((e) => `Maniobra clave omitida: ${e.name} (${e.system})`)
        : missedNativeExams.map((e) => `Maniobra de descarte sugerida: ${e.name} (${e.system})`)),
      ...(exploredAllBlindly
        ? ['Evita pulsar "Explorar Todo" sin criterio; prioriza primero los sistemas comprometidos por la anamnesis (-3 pts).']
        : []),
    ],
    expectedStandard:
      abnormalExams.length > 0
        ? 'Se evalúa priorizar maniobras dirigidas a los sistemas sospechosos para detectar los signos positivos sin realizar exploración indiscriminada.'
        : 'En cuadros con exploración física normal, se evalúa confirmar los negativos pertinentes de los sistemas clave sin exploración indiscriminada.',
  };
  if (examDetail.missingOrImprove.length === 0) {
    examDetail.missingOrImprove.push('Exploración física dirigida sobresaliente: captaste todos los signos clave.');
  }

  // 3. SELECCIÓN E INTERPRETACIÓN DE ESTUDIOS (0 a 15 pts) — Separar estudios confirmatorios del caso vs hallazgos secundarios del catálogo
  const unlockedStudyIds = new Set(submission.unlockedStudies || []);
  const allStudies = caseData.studiesPool || [];
  const nativeStudies = allStudies.filter((st) => !st.id.startsWith('hosp-'));
  const foundNativeStudies = nativeStudies.filter((st) => unlockedStudyIds.has(st.id));
  const missedNativeStudies = nativeStudies.filter((st) => !unlockedStudyIds.has(st.id));
  const allAbnormalStudies = allStudies.filter((st) => st.isAbnormal);
  const nativeAbnormalStudies = allAbnormalStudies.filter((st) => !st.id.startsWith('hosp-'));
  const workupNorm = normStr((solution.recommendedWorkup || []).join(' '));
  const workupMatchedStudies = allAbnormalStudies.filter(
    (st) => workupNorm && tokenMatchRatio(workupNorm, st.name) >= 0.45
  );
  const coreAbnormalStudies =
    nativeAbnormalStudies.length > 0
      ? nativeAbnormalStudies
      : nativeStudies.length > 0
        ? []
        : workupMatchedStudies.length > 0
          ? workupMatchedStudies
          : allAbnormalStudies.slice(0, 3);

  const foundCoreStudies = coreAbnormalStudies.filter((st) => unlockedStudyIds.has(st.id));
  const missedCoreStudies = coreAbnormalStudies.filter((st) => !unlockedStudyIds.has(st.id));
  const foundAllAbnormalStudies = allAbnormalStudies.filter((st) => unlockedStudyIds.has(st.id));
  const secondaryAbnormalHits = foundAllAbnormalStudies.filter(
    (st) => !coreAbnormalStudies.some((c) => c.id === st.id)
  );
  const totalUnlockedStudies = allStudies.filter((st) => unlockedStudyIds.has(st.id));
  const orderedAllBlindly =
    allStudies.length >= 12 && totalUnlockedStudies.length >= allStudies.length - 2;
  const relevantHitCount =
    coreAbnormalStudies.length > 0 ? foundAllAbnormalStudies.length : foundNativeStudies.length;
  const unnecessaryCount = Math.max(0, totalUnlockedStudies.length - relevantHitCount - 4);

  const diagNormForStudies = normStr(solution.correctDiagnosis || '');
  const preDiagMatchRatio = (submission.primaryDiagnosis || '').trim()
    ? computeClinicalDiagnosisMatch(submission.primaryDiagnosis || '', solution.correctDiagnosis || '').ratio
    : 0;
  const highCostUnneededStudies =
    isSimplePrimaryWorkupCase(diagNormForStudies) || isSelfLimitingOrBenignOutpatientCase(caseData)
      ? totalUnlockedStudies.filter(
          (s) =>
            !s.isAbnormal &&
            /\b(tomografia|tac |resonancia|rmn|endoscopia|colonoscopia|broncoscopia)\b/.test(
              normStr(s.name)
            )
        )
      : [];

  const isPureClinicalStewardshipCase =
    coreAbnormalStudies.length === 0 &&
    (isSimplePrimaryWorkupCase(diagNormForStudies) ||
      nativeStudies.length === 0 ||
      nativeStudies.every((s) => !s.isAbnormal));

  let studyScore = 0;
  if (totalUnlockedStudies.length === 0) {
    if (isPureClinicalStewardshipCase && preDiagMatchRatio >= 0.45) {
      // Diagnóstico clínico puro donde evitar paraclínicos innecesarios es buena práctica clínica
      studyScore = 13;
    } else {
      studyScore = 0;
    }
  } else if (coreAbnormalStudies.length > 0) {
    const excessPenalty = orderedAllBlindly ? 4 : Math.min(3, Math.floor(unnecessaryCount / 3));
    const highCostPenalty = highCostUnneededStudies.length > 0 ? Math.min(2, highCostUnneededStudies.length) : 0;

    if (foundCoreStudies.length === 0 && secondaryAbnormalHits.length === 0) {
      studyScore = Math.min(4, totalUnlockedStudies.length + 1);
    } else if (foundCoreStudies.length === 0) {
      studyScore = Math.max(1, Math.min(10, 5 + secondaryAbnormalHits.length * 2) - excessPenalty - highCostPenalty);
    } else {
      const ratio = foundCoreStudies.length / coreAbnormalStudies.length;
      const bonusFromTargetedSecondary =
        !orderedAllBlindly && secondaryAbnormalHits.length > 0 ? 1 : 0;
      studyScore = Math.min(
        15,
        Math.max(1, Math.round(ratio * 14 + 1) + bonusFromTargetedSecondary - excessPenalty - highCostPenalty)
      );
    }
  } else {
    // Casos donde los estudios propios del caso son negativos pertinentes de descarte o el diagnóstico es puramente clínico
    const excessPenalty = orderedAllBlindly ? 4 : Math.min(3, Math.floor(unnecessaryCount / 3));
    const highCostPenalty = highCostUnneededStudies.length > 0 ? Math.min(2, highCostUnneededStudies.length) : 0;
    if (nativeStudies.length > 0) {
      if (foundNativeStudies.length > 0) {
        const nativeRatio = foundNativeStudies.length / nativeStudies.length;
        const targetedBonus = !orderedAllBlindly ? 1 : 0;
        studyScore = Math.max(
          1,
          Math.min(15, Math.round(nativeRatio * 14) + targetedBonus - excessPenalty - highCostPenalty)
        );
      } else {
        studyScore = Math.max(
          1,
          Math.min(10, 4 + totalUnlockedStudies.length * 2) - excessPenalty - highCostPenalty
        );
      }
    } else {
      studyScore = Math.max(
        1,
        Math.min(13, totalUnlockedStudies.length * 3) - excessPenalty - highCostPenalty
      );
    }
  }

  const workupStewardshipNote =
    totalUnlockedStudies.length === 0
      ? studyScore >= 12
        ? 'Uso racional excelente: abordaste un diagnóstico clínico sin indicar estudios paraclínicos innecesarios.'
        : 'No se solicitaron estudios complementarios.'
      : highCostUnneededStudies.length > 0
        ? `Uso racional de recursos: solicitaste estudio de alta complejidad/irradiación no indicado inicialmente en primer nivel (${highCostUnneededStudies.map((s) => s.name).join(', ')}).`
        : orderedAllBlindly || unnecessaryCount >= 3
          ? 'Se detectó solicitud excesiva de estudios ("escopetazo diagnóstico") sin discriminación clínica pre-test.'
          : 'Selección racional de estudios sin sobreutilización de imagen avanzada o pruebas innecesarias.';

  const studyDetail: RubricCategoryDetail = {
    whyScore:
      totalUnlockedStudies.length === 0
        ? studyScore >= 12
          ? `Abordaje clínico racional en un diagnóstico de resolución clínica sin paraclínicos obligatorios (${studyScore}/15 pts).`
          : 'Obtuviste 0/15 porque no solicitaste ningún estudio de laboratorio, imagen o gabinete.'
        : orderedAllBlindly
          ? `Solicitaste prácticamente toda la batería hospitalaria (${totalUnlockedStudies.length}/${allStudies.length}) sin discriminación pre-test, recibiendo penalización por uso excesivo de recursos (${studyScore}/15 pts).`
          : coreAbnormalStudies.length > 0
            ? `Solicitaste ${totalUnlockedStudies.length} estudio(s), acertando en ${foundCoreStudies.length} de ${coreAbnormalStudies.length} prueba(s) confirmatorias clave${secondaryAbnormalHits.length > 0 ? ` (+${secondaryAbnormalHits.length} estudio(s) complementario(s) útil(es))` : ''} (${studyScore}/15 pts).`
            : nativeStudies.length > 0
              ? `Solicitaste ${totalUnlockedStudies.length} estudio(s) e incluiste ${foundNativeStudies.length} de ${nativeStudies.length} estudio(s) pertinentes de descarte del cuadro (${studyScore}/15 pts).`
              : `Solicitaste ${totalUnlockedStudies.length} estudio(s) de apoyo clínico en un cuadro esencialmente clínico (${studyScore}/15 pts).`,
    strengths:
      foundAllAbnormalStudies.length > 0
        ? foundAllAbnormalStudies.slice(0, 6).map((s) => `Estudio pertinente solicitado: ${s.name}`)
        : coreAbnormalStudies.length === 0 && foundNativeStudies.length > 0
          ? foundNativeStudies.slice(0, 6).map((s) => `Estudio de descarte pertinente (negativo clave): ${s.name}`)
          : totalUnlockedStudies.length === 0 && studyScore >= 12
            ? ['Evitaste sobreestudio innecesario en un cuadro de diagnóstico primordialmente clínico.']
            : totalUnlockedStudies.length > 0
              ? [`Solicitaste ${totalUnlockedStudies.length} estudio(s), aunque faltaron los confirmatorios clave.`]
              : ['No se solicitaron estudios complementarios.'],
    missingOrImprove: [
      ...(coreAbnormalStudies.length > 0
        ? missedCoreStudies.slice(0, 5).map((s) => `Faltó solicitar estudio confirmatorio clave: ${s.name}`)
        : totalUnlockedStudies.length > 0
          ? missedNativeStudies.slice(0, 4).map((s) => `Estudio de descarte pertinente del caso: ${s.name}`)
          : []),
      ...(highCostUnneededStudies.length > 0
        ? [
            `Uso racional (MINSA / 1.er nivel): evita solicitar ${highCostUnneededStudies.map((s) => s.name).join(', ')} de entrada en un cuadro ambulatorio sin banderas rojas.`,
          ]
        : []),
      ...(orderedAllBlindly || unnecessaryCount >= 4
        ? ['Se solicitaron estudios innecesarios sin justificación clínica ("escopetazo diagnóstico").']
        : []),
    ],
    expectedStandard: `Abordaje recomendado por guías: ${(solution.recommendedWorkup || []).slice(0, 4).join(' · ') || 'Estudios dirigidos de confirmación y estratificación de gravedad.'}`,
  };
  if (studyDetail.missingOrImprove.length === 0) {
    studyDetail.missingOrImprove.push('Excelente selección racional de estudios confirmatorios sin sobreutilización.');
  }

  // 4. DIAGNÓSTICO PRINCIPAL Y RAZONAMIENTO (0 a 25 pts) — Con sinónimos y siglas nacionales/internacionales
  const isExpressDiagOnly = Boolean(submission.expressDiagnosticOnly);
  const isEcoeMode = caseData.mode === 'examen';
  const userDiag = submission.primaryDiagnosis || '';
  const correctDiag = solution.correctDiagnosis || '';
  const diagMatchResult = computeClinicalDiagnosisMatch(userDiag, correctDiag);
  const diagMatchRatio = diagMatchResult.ratio;
  if (diagMatchResult.matchedSynonymLabel) {
    recognizedEquivalents.push(
      `Nomenclatura / sigla diagnóstica validada: "${userDiag}" ↔ "${correctDiag}" (${diagMatchResult.matchedSynonymLabel}).`
    );
  }
  const diffHitRatio = Math.max(
    0,
    ...(solution.differentialDiagnoses || []).map((d) => computeClinicalDiagnosisMatch(userDiag, d).ratio)
  );
  const justifLen = (submission.clinicalJustification || '').trim().length;
  const justifBonus =
    isExpressDiagOnly || !isEcoeMode ? 2 : justifLen >= 50 ? 2 : justifLen >= 20 ? 1 : 0;

  let diagScore = 0;
  if (!userDiag.trim()) {
    diagScore = 0;
  } else if (diagMatchRatio >= 0.72) {
    diagScore = Math.min(25, 23 + justifBonus);
  } else if (diagMatchRatio >= 0.45) {
    diagScore = Math.min(22, 19 + justifBonus);
  } else if (diagMatchRatio >= 0.25 || diffHitRatio >= 0.45) {
    diagScore = Math.min(15, 12 + justifBonus);
  } else {
    diagScore = isEcoeMode && !isExpressDiagOnly && justifLen >= 40 ? 2 : 0;
  }

  const diagDetail: RubricCategoryDetail = {
    whyScore: !userDiag.trim()
      ? 'Obtuviste 0/25 porque dejaste en blanco el diagnóstico principal.'
      : diagMatchRatio >= 0.72
        ? `Tu diagnóstico ("${userDiag}") coincide de forma precisa con la patología real "${correctDiag}" (${diagScore}/25 pts).`
        : diagMatchRatio >= 0.45
          ? `Tu diagnóstico ("${userDiag}") identificó el proceso patológico central, aunque podía precisar mayor especificidad (gravedad o etiología) frente a "${correctDiag}" (${diagScore}/25 pts).`
          : diffHitRatio >= 0.45
            ? `Tu propuesta ("${userDiag}") corresponde a un diagnóstico diferencial cercano, pero no al diagnóstico definitivo real "${correctDiag}" (${diagScore}/25 pts).`
            : `Tu propuesta ("${userDiag}") no coincide con el diagnóstico definitivo "${correctDiag}" (${diagScore}/25 pts).`,
    strengths: [
      ...(diagMatchRatio >= 0.45 ? [`Aproximación clínica acertada hacia "${correctDiag}".`] : []),
      ...(diagMatchResult.matchedSynonymLabel
        ? [`Se reconoció tu terminología/sigla clínica (${diagMatchResult.matchedSynonymLabel}).`]
        : []),
      ...(isEcoeMode && !isExpressDiagOnly && justifLen >= 25
        ? ['Redactaste una justificación clínica para argumentar tu hipótesis.']
        : []),
    ],
    missingOrImprove: [
      ...(diagMatchRatio < 0.72
        ? [`El diagnóstico completo esperado es: "${correctDiag}". Especifica etiología, fase clínica o signos de alarma.`]
        : []),
      ...(isEcoeMode && !isExpressDiagOnly && justifLen < 35
        ? ['Faltó redactar una justificación clínica breve que integre anamnesis, examen físico y paraclínicos.']
        : []),
    ],
    expectedStandard: `Diagnóstico de referencia: ${correctDiag}.`,
  };
  if (diagDetail.strengths.length === 0) {
    diagDetail.strengths.push('Sin aciertos diagnósticos relevantes en el diagnóstico principal.');
  }
  if (diagDetail.missingOrImprove.length === 0) {
    diagDetail.missingOrImprove.push('Precisión diagnóstica sobresaliente.');
  }

  // 5. DIAGNÓSTICOS DIFERENCIALES (0 a 10 pts)
  const userDiffs = (submission.differentialDiagnoses || []).filter((d) => d.trim().length >= 2);
  const expectedDiffs = solution.differentialDiagnoses || [];
  const matchedDiffs: string[] = [];
  const missedDiffs: string[] = [];

  for (const expD of expectedDiffs) {
    const matched = userDiffs.some((uD) => computeClinicalDiagnosisMatch(uD, expD).ratio >= 0.35);
    if (matched) matchedDiffs.push(expD);
    else missedDiffs.push(expD);
  }

  let diffScore = 0;
  if (userDiffs.length === 0) {
    diffScore = 0;
  } else if (expectedDiffs.length > 0) {
    if (matchedDiffs.length === 0) {
      diffScore = 1;
    } else {
      diffScore = Math.min(
        10,
        Math.round((matchedDiffs.length / Math.min(3, expectedDiffs.length)) * 8 + Math.min(matchedDiffs.length, 2))
      );
    }
  } else {
    diffScore = Math.min(10, userDiffs.length * 3);
  }

  const diffDetail: RubricCategoryDetail = {
    whyScore:
      userDiffs.length === 0
        ? 'Obtuviste 0/10 porque no formulaste ningún diagnóstico diferencial.'
        : `Planteaste ${userDiffs.length} diagnóstico(s) diferencial(es), acertando en ${matchedDiffs.length} de las alternativas prioritarias del síndrome (${diffScore}/10 pts).`,
    strengths:
      matchedDiffs.length > 0
        ? matchedDiffs.map((d) => `Diferencial pertinente planteado: ${d}`)
        : userDiffs.length > 0
          ? [`Propusiste ${userDiffs.length} opción(es), pero ninguna coincidió con los diferenciales prioritarios del cuadro.`]
          : ['No se ingresaron diagnósticos diferenciales.'],
    missingOrImprove:
      missedDiffs.length > 0
        ? missedDiffs.map((d) => `Diferencial clave que faltó considerar: ${d}`)
        : ['Excelente cobertura de las principales patologías competidoras de este cuadro.'],
    expectedStandard: `Diferenciales principales esperados: ${expectedDiffs.join(' · ')}.`,
  };

  // 6. TRATAMIENTO Y RÉGIMEN FARMACOLÓGICO (0 a 15 pts) — Normativa Nicaragüense (MINSA LBM) + Estándar Internacional
  const userRx = (submission.pharmacologicalPlan || []).filter((r) => (r.drug || '').trim().length >= 2);
  const planAuditForScoring = auditMedicationPlanSafety(
    userRx,
    caseData,
    submission.statInterventions || []
  );
  const safeUserRx = userRx.filter((r) => !planAuditForScoring.unsafeMedicationIds.has(r.id));
  const optRx = solution.optimalTreatment?.pharmacological || [];
  const activeGeneralForRx = stripNegatedMedicationClauses(submission.generalMeasures || '');
  const userRxAndMeasuresText = normStr(
    `${safeUserRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join(' ')} ${activeGeneralForRx}`
  );
  const userRxOnlyNorm = normStr(safeUserRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join(' '));
  const diagNormForRx = normStr(solution.correctDiagnosis || '');

  const matchedDrugs: string[] = [];
  const missedDrugs: string[] = [];

  for (const rx of optRx) {
    const matchRes = matchesOptimalDrug(userRxAndMeasuresText, rx.drug, diagNormForRx);
    if (matchRes.matched) {
      matchedDrugs.push(`${rx.drug} (${rx.dose})`);
      if (matchRes.equivalentNote) {
        recognizedEquivalents.push(matchRes.equivalentNote);
      }
    } else {
      missedDrugs.push(`${rx.drug} — ${rx.dose}, ${rx.route}, ${rx.frequency} (${rx.duration})`);
    }
  }

  const completeRxCount = safeUserRx.filter(
    (r) => (r.drug || '').trim() && (r.dose || '').trim() && (r.route || '').trim() && (r.frequency || '').trim()
  ).length;
  const generalTextTrimmed = (submission.generalMeasures || '').trim();
  const generalTextNorm = normStr(generalTextTrimmed);
  const hasGeneralMeasures =
    generalTextTrimmed.length >= 15 ||
    (generalTextTrimmed.length >= 3 &&
      /\b(npo|ayun[oa]?|no comer|nada por boca|dieta|hidrat|suero|liquid|oxigen|repos|hielo|eleva|vigil|control|monitor|sonda|canaliz|cirug|quirofano|operar|aislam|lavado|higiene|compres|vendaj|ferula)\b/.test(
        generalTextNorm
      ));

  const requiredOptRx = optRx.filter((r) => !/\bopcional\b/i.test(`${r.drug} ${r.rationale || ''}`));
  const denominatorRxCount = requiredOptRx.length > 0 ? requiredOptRx.length : optRx.length;

  let treatScore = 0;
  if (userRx.length === 0 && !hasGeneralMeasures) {
    treatScore = 0;
  } else if (optRx.length > 0 && denominatorRxCount > 0) {
    let drugRatio = Math.min(1, matchedDrugs.length / denominatorRxCount);
    if (denominatorRxCount >= 3 && matchedDrugs.length >= denominatorRxCount - 1) {
      drugRatio = Math.max(drugRatio, 0.9);
    }
    const posologyBonus =
      matchedDrugs.length > 0 && completeRxCount > 0
        ? completeRxCount >= safeUserRx.length
          ? 3
          : 2
        : 0;
    const generalBonus = hasGeneralMeasures ? 2 : 0;
    const effortFloor = safeUserRx.length > 0 && matchedDrugs.length === 0 ? 1 : 0;
    treatScore = Math.min(15, Math.round(drugRatio * 10) + posologyBonus + generalBonus + effortFloor);
  } else if (optRx.length > 0 && denominatorRxCount === 0) {
    // Todos los fármacos de referencia eran opcionales (p. ej. rescate STAT condicional)
    treatScore = hasGeneralMeasures ? (matchedDrugs.length > 0 || safeUserRx.length === 0 ? 15 : 13) : 6;
  } else {
    // Casos estrictamente no farmacológicos / vigilancia ambulatoria (optRx.length === 0)
    treatScore = hasGeneralMeasures
      ? safeUserRx.length === 0
        ? 15
        : Math.max(10, 14 - safeUserRx.length * 2)
      : Math.min(10, safeUserRx.length * 3);
  }

  const criticalSafetyErrors = checkCriticalSafetyErrors(submission, caseData);

  // 6b. AUDITORÍA DE INTERVENCIONES STAT REALIZADAS AL PACIENTE Y EVOLUCIÓN VITAL
  const statList = submission.statInterventions || [];
  const baseVitals: VitalSigns = submission.baselineVitalSigns || caseData.vitalSigns;
  const endVitals: VitalSigns = submission.finalVitalSigns || baseVitals;

  const parseSys = (bp: string): number => {
    const m = (bp || '').match(/(\d+)\s*\/\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 120;
  };
  const baseSys = parseSys(baseVitals.bloodPressure);
  const endSys = parseSys(endVitals.bloodPressure);

  const arrivedCriticallyUnstable =
    baseSys < 90 ||
    baseSys >= 180 ||
    baseVitals.oxygenSaturation < 90 ||
    (typeof baseVitals.bloodGlucose === 'number' && baseVitals.bloodGlucose < 65) ||
    /\bNivel I\b/.test(caseData.patientInfo.triageLevel || '');

  const interventionReviews: StatInterventionAuditItem[] = statList.map((rec) => {
    const deltaSummary =
      rec.deltas.length > 0
        ? rec.deltas.map((d) => `${d.metric}: ${d.before} → ${d.after} (${d.deltaText})`).join(' · ')
        : 'Sin cambios inmediatos en monitor';

    if (rec.effectSeverity === 'reaccion_adversa') {
      return {
        drug: rec.drug,
        dose: rec.dose,
        route: rec.route,
        verdict: 'riesgo_o_excesivo',
        comment: rec.physiologicalEffectSummary,
        deltaSummary,
      };
    }
    if (rec.effectSeverity === 'mejoria') {
      return {
        drug: rec.drug,
        dose: rec.dose,
        route: rec.route,
        verdict: 'adecuado',
        comment: rec.physiologicalEffectSummary,
        deltaSummary,
      };
    }
    if (rec.effectSeverity === 'parcial') {
      return {
        drug: rec.drug,
        dose: rec.dose,
        route: rec.route,
        verdict: 'parcial_o_sin_efecto',
        comment: rec.physiologicalEffectSummary,
        deltaSummary,
      };
    }
    return {
      drug: rec.drug,
      dose: rec.dose,
      route: rec.route,
      verdict: 'parcial_o_sin_efecto',
      comment: rec.physiologicalEffectSummary,
      deltaSummary,
    };
  });

  const adverseStatEvents = interventionReviews.filter((r) => r.verdict === 'riesgo_o_excesivo');
  const positiveStatEvents = interventionReviews.filter((r) => r.verdict === 'adecuado');

  for (const adv of adverseStatEvents) {
    const commentNorm = normStr(adv.comment);
    const isSeverePhysiologicStatHarm =
      /\b(crisis adrenergica|crisis hipertensiva|descarga adrenergica|broncoespasmo severo|depresion respiratoria|paro respiratorio|paro cardiaco|fibrilacion ventricular|hipotension iatrogenica|shock vasoplejico|choque cardiogenico|descenso tensional demasiado brusco|hipoglucemia iatrogenica|descenso glucemico excesivo|sobredosis|neuroglucopen|coma|hipermagnesemia|agravamiento de edema|sobrecarga hidrica|narcosis hipercapnica|hemorragia|anafilactica|nefrotoxicidad|wernicke|perforacion|contraindicacion|error critico|arritmia|necrosis hepatica|acumulacion|acumulativa|toxicidad|salicilismo|torsades|hiperkalemia|hipercalcemia|anticolinergica|extrapiramidal|hemorragia digestiva|insuficiencia hepatica|falla hepatica|encharcamiento|edema agudo de pulmon|hiperosmolaridad)\b/.test(
        commentNorm
      );
    if (!isSeverePhysiologicStatHarm) continue;
    const msg = `¡EVENTO ADVERSO EN ESTABILIZACIÓN STAT!: ${adv.drug} (${adv.dose}, ${adv.route}) — ${adv.comment}`;
    if (
      !criticalSafetyErrors.some(
        (e) =>
          normStr(e).includes(normStr(adv.drug).slice(0, 8)) &&
          normStr(e).includes(normStr(adv.dose).slice(0, 5))
      )
    ) {
      criticalSafetyErrors.push(msg);
    }
  }

  const immediateDeathRecord = statList.find((s) => s.isImmediateDeath);
  if (immediateDeathRecord) {
    const deathReasonText =
      immediateDeathRecord.immediateDeathReason || immediateDeathRecord.physiologicalEffectSummary;
    const deathMsg = `¡MUERTE INMEDIATA POR IATROGENIA!: ${immediateDeathRecord.drug} (${immediateDeathRecord.dose}, ${immediateDeathRecord.route}) — ${deathReasonText}`;
    if (!criticalSafetyErrors.some((e) => normStr(e).includes('muerte inmediata'))) {
      criticalSafetyErrors.unshift(deathMsg);
    }
  }

  const vitalEvolutionSummary = `Ingreso: PA ${baseVitals.bloodPressure.split(' ')[0]} · FC ${baseVitals.heartRate} · FR ${baseVitals.respiratoryRate} · SpO₂ ${baseVitals.oxygenSaturation}%${typeof baseVitals.bloodGlucose === 'number' ? ` · Gluc ${baseVitals.bloodGlucose}` : ''}  →  Final: PA ${endVitals.bloodPressure.split(' ')[0]} · FC ${endVitals.heartRate} · FR ${endVitals.respiratoryRate} · SpO₂ ${endVitals.oxygenSaturation}%${typeof endVitals.bloodGlucose === 'number' ? ` · Gluc ${endVitals.bloodGlucose}` : ''}`;

  const { requiresUrgentStat, protocol: recommendedStatProtocol } = buildRecommendedStatProtocol(caseData);
  const acutePrescribedRx = safeUserRx.filter((r) => {
    if (r.phase === 'stat_urgencias') return true;
    const txt = normStr(`${r.route} ${r.frequency} ${r.duration} ${r.id}`);
    return /\b(stat|iv|intravenos[oa]|im|intramuscular|sl|sublingual|nebuliz|inhalator|bolo|carga|impregnacion|rescate|infusion|med stat)\b/.test(
      txt
    );
  });

  const validStatInterventions = statList.filter((s) => s.effectSeverity !== 'reaccion_adversa');
  const combinedUserStatText = normStr(
    [
      ...validStatInterventions.map((s) => `${s.drug} ${s.dose} ${s.route}`),
      ...acutePrescribedRx.map((r) => `${r.drug} ${r.dose} ${r.route}`),
      activeGeneralForRx,
    ].join(' ')
  );

  const matchedStatDrugs: string[] = [];
  const missedStatDrugs: string[] = [];
  for (const item of recommendedStatProtocol) {
    const m = matchesOptimalDrug(combinedUserStatText, item.drug, diagNormForRx);
    if (m.matched) {
      matchedStatDrugs.push(`${item.drug} (${item.dose}, ${item.route})`);
    } else {
      missedStatDrugs.push(`${item.drug} — ${item.dose} · ${item.route} (${item.timing})`);
    }
  }

  let statGuidanceComment = '';
  if (!requiresUrgentStat) {
    statGuidanceComment =
      'Patología de manejo ambulatorio directo: no requería fármacos STAT ni estabilización en sala de choque; enfócate en el esquema ambulatorio con días completos y signos de alarma.';
  } else if (missedStatDrugs.length === 0 && matchedStatDrugs.length > 0) {
    statGuidanceComment = `Protocolo STAT / Urgencias cubierto de forma adecuada (${matchedStatDrugs.length}/${recommendedStatProtocol.length} pilares agudos aplicados o prescritos).`;
  } else if (matchedStatDrugs.length > 0) {
    statGuidanceComment = `Cubriste parcialmente el manejo agudo (${matchedStatDrugs.length}/${recommendedStatProtocol.length}), pero en Urgencias / STAT faltó: ${missedStatDrugs.join(' · ')}.`;
  } else {
    statGuidanceComment = `Este cuadro requería manejo STAT / de urgencias oportuno antes o junto al esquema definitivo: ${missedStatDrugs.join(' · ')}.`;
  }

  let statOverallVerdict: StatAuditSummary['overallVerdict'] = requiresUrgentStat
    ? 'omitido_en_inestabilidad'
    : 'no_requerido';
  let statNarrative = requiresUrgentStat
    ? `Este caso requería protocolo de urgencias / estabilización STAT (${recommendedStatProtocol.map((p) => p.drug).slice(0, 3).join(', ')}).`
    : 'Caso sin requerimiento crítico de estabilización STAT inmediata en sala de choque.';

  if (immediateDeathRecord) {
    statOverallVerdict = 'riesgo_critico';
    statNarrative = `MUERTE INMEDIATA POR IATROGENIA: La administración de ${immediateDeathRecord.drug} (${immediateDeathRecord.dose}, ${immediateDeathRecord.route}) causó colapso cardiorrespiratorio fulminante en el acto (${immediateDeathRecord.immediateDeathReason || immediateDeathRecord.physiologicalEffectSummary}).`;
  } else if (adverseStatEvents.length > 0) {
    statOverallVerdict = 'riesgo_critico';
    statNarrative = `Se aplicaron ${statList.length} intervención(es) STAT, pero ${adverseStatEvents.length} produjo deterioro fisiológico o evento adverso por dosis excesiva o contraindicación.`;
  } else if (statList.length > 0) {
    if (positiveStatEvents.length > 0 || (matchedStatDrugs.length > 0 && missedStatDrugs.length === 0)) {
      statOverallVerdict = missedStatDrugs.length === 0 ? 'optimo' : 'parcial';
      statNarrative =
        missedStatDrugs.length === 0
          ? `Estabilización STAT oportuna (${statList.length} dosis aplicadas) con respuesta fisiológica favorable y sin iatrogenia.`
          : `Se aplicaron ${statList.length} dosis STAT con mejoría clínica, aunque quedó pendiente completar en Urgencias: ${missedStatDrugs.slice(0, 2).join('; ')}.`;
      if (treatScore > 0 && treatScore < 15 && matchedDrugs.length > 0) {
        treatScore = Math.min(15, treatScore + 1);
      }
    } else {
      statOverallVerdict = 'parcial';
      statNarrative = `Se administraron ${statList.length} intervención(es) STAT, aunque sin impacto relevante sobre la alteración fisiológica prioritaria.`;
    }
  } else if (requiresUrgentStat && matchedStatDrugs.length > 0) {
    statOverallVerdict = missedStatDrugs.length === 0 ? 'optimo' : 'parcial';
    statNarrative =
      missedStatDrugs.length === 0
        ? `Incluiste los fármacos STAT/de urgencias clave en tu prescripción (${matchedStatDrugs.join(', ')}), aunque recuerda aplicarlos en vivo desde el módulo STAT cuando el paciente esté inestable.`
        : `Prescribiste parte del manejo urgente (${matchedStatDrugs.join(', ')}), faltando en Urgencias: ${missedStatDrugs.join('; ')}.`;
  } else if (requiresUrgentStat) {
    statOverallVerdict = 'omitido_en_inestabilidad';
    statNarrative = arrivedCriticallyUnstable
      ? `El paciente ingresó con compromiso vital significativo (PA ${baseSys} mmHg / SpO₂ ${baseVitals.oxygenSaturation}%) y no recibió intervención STAT estabilizadora ni manejo de urgencias acorde.`
      : `El cuadro ameritaba manejo inmediato en Urgencias / STAT (${recommendedStatProtocol.map((p) => `${p.drug} ${p.dose}`).slice(0, 3).join(', ')}) y no se indicó ningún fármaco de estabilización aguda.`;
    if (arrivedCriticallyUnstable && matchedDrugs.length === 0 && treatScore > 2) {
      treatScore = Math.max(0, treatScore - 2);
    }
  }

  const statAudit: StatAuditSummary = {
    performedCount: statList.length,
    overallVerdict: statOverallVerdict,
    vitalEvolutionSummary,
    narrative: statNarrative,
    interventionReviews,
    requiresUrgentStat,
    recommendedStatProtocol,
    matchedStatDrugs,
    missedStatDrugs,
    statGuidanceComment,
    ...(immediateDeathRecord
      ? {
          immediateDeathReason:
            immediateDeathRecord.immediateDeathReason || immediateDeathRecord.physiologicalEffectSummary,
        }
      : {}),
  };

  if (criticalSafetyErrors.length > 0) {
    treatScore = Math.min(treatScore, 3);
  }

  // Uso Racional de Antibióticos (stewardship en primer nivel y urgencias)
  const activeUserRxOnly = stripNegatedMedicationClauses(
    userRx.map((r) => `${r.drug} ${r.dose} ${r.route}`).join('. ')
  );
  const prescribedSystemicAbx = SYSTEMIC_ANTIBIOTIC_REGEX.test(activeUserRxOnly);
  const nonBacterialCase = isNonBacterialPrimaryCase(diagNormForRx);
  let rationalAntibioticStatus: 'optimo' | 'alerta' | 'no_aplica' = 'no_aplica';
  let rationalAntibioticNote = 'Caso con indicación antimicrobiana específica o manejo no centrado en stewardship viral.';

  if (nonBacterialCase && prescribedSystemicAbx) {
    rationalAntibioticStatus = 'alerta';
    rationalAntibioticNote =
      'Alerta de Uso Racional: se prescribió antibiótico sistémico en una patología viral, mecánica o no bacteriana sin sobreinfección demostrada (-2 pts).';
    if (treatScore > 0) {
      treatScore = Math.max(0, treatScore - 2);
    }
  } else if (nonBacterialCase && (userRx.length > 0 || hasGeneralMeasures)) {
    rationalAntibioticStatus = 'optimo';
    rationalAntibioticNote =
      'Uso racional ejemplar: evitaste prescribir antibióticos innecesarios en un cuadro no bacteriano, previniendo resistencia antimicrobiana.';
  } else if (!nonBacterialCase && optRx.some((r) => SYSTEMIC_ANTIBIOTIC_REGEX.test(normStr(r.drug)))) {
    if (matchedDrugs.some((d) => SYSTEMIC_ANTIBIOTIC_REGEX.test(normStr(d)))) {
      rationalAntibioticStatus = 'optimo';
      rationalAntibioticNote =
        'Esquema antimicrobiano dirigido acorde a normativa nacional (MINSA) e internacional para este foco.';
    } else if (prescribedSystemicAbx) {
      rationalAntibioticStatus = 'alerta';
      rationalAntibioticNote =
        'El antibiótico elegido no corresponde al espectro de primera línea recomendado por las guías clínicas para este foco.';
    } else {
      rationalAntibioticStatus = 'alerta';
      rationalAntibioticNote =
        'Patología bacteriana que requería inicio oportuno de antibioticoterapia de primera línea.';
    }
  }

  // Nota docente farmacológica cuando se prescriben alternativas seguras en alergia a penicilina
  const allergiesNormForNote = normStr((caseData.background?.allergies || []).join(' '));
  const pharmacologyNotes: string[] = [];
  if (allergiesNormForNote.includes('penicilin') && criticalSafetyErrors.length === 0) {
    if (/\b(meropenem|imipenem|ertapenem)\b/.test(userRxOnlyNorm)) {
      pharmacologyNotes.push(
        'Nota farmacológica: El uso de un carbapenémico (ej. meropenem) tiene <1% de reactividad cruzada en alergia a penicilina (guías AAAAI 2022) y NO se penaliza como error anafiláctico; sin embargo, para infecciones comunitarias sin riesgo MDR se prefiere un esquema dirigido (como levofloxacino).'
      );
    }
    if (/\b(eritromicina|azitromicina|claritromicina)\b/.test(userRxOnlyNorm)) {
      pharmacologyNotes.push(
        'Nota farmacológica: Los macrólidos (eritromicina/azitromicina) son seguros ante alergia a penicilina, pero por la resistencia neumocócica (~25-40%) en paciente hospitalizado grave se prefiere fluoroquinolona respiratoria (Levofloxacino 750 mg IV).'
      );
    }
  }

  const uniqueEquivalents = Array.from(new Set(recognizedEquivalents));
  const proposedTreatmentReviews = evaluateProposedMedications(
    userRx,
    optRx,
    caseData,
    nonBacterialCase
  );
  const generalMeasuresCritique = evaluateGeneralMeasuresCritique(
    submission.generalMeasures || '',
    solution.optimalTreatment?.generalMeasures || []
  );

  const altValidReviews = proposedTreatmentReviews.filter((r) => r.verdict === 'alternativa_valida');
  const coadjuvantReviews = proposedTreatmentReviews.filter((r) => r.verdict === 'coadyuvante_sintomatico');
  const suboptimalReviews = proposedTreatmentReviews.filter((r) => r.verdict === 'diferente_o_suboptimo');
  const riskyReviews = proposedTreatmentReviews.filter((r) => r.verdict === 'riesgoso_o_contraindicado');

  const treatDetail: RubricCategoryDetail = {
    whyScore:
      userRx.length === 0 && !hasGeneralMeasures
        ? 'Obtuviste 0/15 porque no propusiste fármacos ni medidas generales terapéuticas.'
        : `Indicaste ${userRx.length} fármaco(s) (${completeRxCount} con posología completa) y cubriste ${matchedDrugs.length} de ${optRx.length} pilares terapéuticos aceptados por Normativa MINSA / Internacional (${treatScore}/15 pts).`,
    strengths: [
      ...matchedDrugs.map((d) => `Indicación terapéutica acertada: ${d}`),
      ...altValidReviews.map(
        (r) =>
          `Alternativa comentada (${r.drug}): ${r.verdictLabel}${r.matchedReferenceDrug ? ` respecto a ${r.matchedReferenceDrug}` : ''}.`
      ),
      ...coadjuvantReviews.map(
        (r) => `Apoyo sintomático válido (${r.drug}): útil como coadyuvante, aunque complementario al pilar etiológico.`
      ),
      ...positiveStatEvents.map(
        (s) => `Estabilización STAT efectiva: ${s.drug} (${s.dose}) — ${s.deltaSummary}`
      ),
      ...uniqueEquivalents.filter((e) => !e.startsWith('Nomenclatura')),
      ...(rationalAntibioticStatus === 'optimo' && nonBacterialCase
        ? ['Uso racional de antibióticos: no indicaste antimicrobianos innecesarios en cuadro no bacteriano.']
        : []),
      ...(hasGeneralMeasures ? ['Incluiste medidas generales de soporte clínico.'] : []),
    ],
    missingOrImprove: [
      ...riskyReviews.map((r) => `Sobre tu prescripción de ${r.drug}: ${r.clinicalComment}`),
      ...suboptimalReviews.map((r) => `Sobre tu prescripción de ${r.drug}: ${r.clinicalComment}`),
      ...(requiresUrgentStat && missedStatDrugs.length > 0
        ? [`Faltó en estabilización STAT / Urgencias: ${missedStatDrugs.join(' · ')}`]
        : []),
      ...missedDrugs.map((d) => `Faltó indicar según esquema de referencia: ${d}`),
      ...adverseStatEvents.map((a) => `Dosis o fármaco STAT riesgoso (${a.drug} ${a.dose}): ${a.comment}`),
      ...(rationalAntibioticStatus === 'alerta' && nonBacterialCase ? [rationalAntibioticNote] : []),
      ...pharmacologyNotes,
      ...(userRx.length > 0 && completeRxCount < userRx.length
        ? ['Completa siempre dosis exacta, vía, frecuencia y duración de cada fármaco prescrito.']
        : []),
      ...(generalMeasuresCritique ? [generalMeasuresCritique] : []),
    ],
    expectedStandard: `Esquema de referencia: ${optRx
      .map((r) => `${r.drug} ${r.dose} (${r.route}, ${r.frequency}, Duración: ${r.duration})`)
      .join(' + ')}. (También se aceptan equivalentes válidos de Lista Básica MINSA e Internacional).`,
  };
  if (treatDetail.strengths.length === 0) {
    treatDetail.strengths.push('Sin coincidencias con los fármacos recomendados.');
  }
  if (treatDetail.missingOrImprove.length === 0) {
    treatDetail.missingOrImprove.push('Prescripción farmacológica completa, segura y acorde a normativa.');
  }

  // 7. CONDUCTA, TRIAGE Y SEGURIDAD DEL PACIENTE (0 a 5 pts) — Criterio estricto de nivel asistencial
  const expectedHosp = solution.optimalTreatment?.hospitalizationDecision || '';
  const userHospNorm = normStr(submission.hospitalizationDecision);
  const expectedHospNorm = normStr(expectedHosp);
  const userRank = getDispositionRank(userHospNorm);
  const expectedRank = getDispositionRank(expectedHospNorm);
  const userIsSurgery = userHospNorm.includes('quirofano') || userHospNorm.includes('cirugia');
  const expectedIsSurgery = expectedHospNorm.includes('quirofano') || expectedHospNorm.includes('cirugia');
  const surgicalCase = isSurgicalOrProceduralCase(caseData);

  const hospExactMatch =
    Boolean(userHospNorm) &&
    (userHospNorm === expectedHospNorm ||
      (userIsSurgery && expectedIsSurgery) ||
      (userIsSurgery && surgicalCase && expectedRank === 3));

  const hasReferral = String(submission.referralCriteria || '').trim().length >= 10;
  const hasFollowUp = String(submission.followUpPlan || '').trim().length >= 10;
  const redFlagSource = normStr(
    `${submission.followUpPlan || ''} ${submission.referralCriteria || ''} ${submission.generalMeasures || ''}`
  );
  const hasRedFlagsGuidance =
    /\b(alarma|urgencia|regresar|revalor|empeor|fiebre|sangr|disnea|dificultad|deshidrat|vomit|dolor|vigil|24|48|72|signos)\b/.test(
      redFlagSource
    );
  const noMeaningfulWorkDone = !userDiag.trim() && userRx.length === 0 && !hasGeneralMeasures;

  let dispositionPts = 3;
  let referralTriageVerdict: 'correcto' | 'subestimado' | 'sobreestimado' = 'correcto';
  let referralTriageNote = `Destino clínico acertado ("${expectedHosp}"): equilibrio adecuado entre nivel de cuidado y capacidad resolutiva.`;

  if (hospExactMatch) {
    dispositionPts = 3;
    if (userHospNorm !== expectedHospNorm && userIsSurgery) {
      referralTriageNote = `Destino clínico acertado ("${submission.hospitalizationDecision}"): resolución quirúrgica/intervencionista acorde a la patología ("${expectedHosp}").`;
    }
  } else if (userRank === 0) {
    dispositionPts = 0;
    referralTriageVerdict = 'subestimado';
    referralTriageNote = `No definiste un destino clínico acorde al nivel esperado ("${expectedHosp}") (0/3 pts).`;
  } else if (expectedRank === 5) {
    // Caso que exige UCI
    if (userRank === 3) {
      dispositionPts = 1;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación del nivel de cuidado crítico: indicaste "${submission.hospitalizationDecision}", pero la gravedad del paciente exige "${expectedHosp}" para monitorización y soporte continuo (1/3 pts).`;
    } else if (userRank === 4) {
      if (surgicalCase) {
        dispositionPts = 2;
        referralTriageVerdict = 'subestimado';
        referralTriageNote = `Conducta intervencionista parcial: indicaste "${submission.hospitalizationDecision}", pero este paciente crítico requiere además manejo en "${expectedHosp}" (2/3 pts).`;
      } else {
        dispositionPts = 1;
        referralTriageVerdict = 'sobreestimado';
        referralTriageNote = `Destino clínico impreciso: indicaste "${submission.hospitalizationDecision}" en una emergencia médica que corresponde a "${expectedHosp}" (1/3 pts).`;
      }
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación grave del riesgo vital: indicaste "${submission.hospitalizationDecision}" cuando el paciente requiere ingreso inmediato a "${expectedHosp}" (0/3 pts).`;
    }
  } else if (expectedRank === 4) {
    // Caso que exige Quirófano / Cirugía de Urgencia
    if (userRank === 3) {
      dispositionPts = 1;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación de prioridad quirúrgica: indicaste "${submission.hospitalizationDecision}", aunque el caso amerita resolución directa en "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 5) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Indicaste "${submission.hospitalizationDecision}", pero el destino terapéutico prioritario es "${expectedHosp}" (1/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación grave de urgencia quirúrgica: indicaste "${submission.hospitalizationDecision}" cuando exige "${expectedHosp}" (0/3 pts).`;
    }
  } else if (expectedRank === 3) {
    // Caso que exige Hospitalización en Sala
    if (userRank === 2) {
      dispositionPts = 1;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación de requerimiento hospitalario: indicaste "${submission.hospitalizationDecision}", pero el cuadro amerita ingreso a "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 5) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobreutilización de terapia intensiva: indicaste "${submission.hospitalizationDecision}" en un paciente sin criterios críticos que corresponde a "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 4) {
      dispositionPts = 0;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Destino inadecuado: indicaste "${submission.hospitalizationDecision}" en una patología médica no quirúrgica que corresponde a "${expectedHosp}" (0/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Subestimación grave de gravedad clínica: indicaste "${submission.hospitalizationDecision}" cuando la patología exige "${expectedHosp}" (0/3 pts).`;
    }
  } else if (expectedRank === 2) {
    // Caso que exige Observación Urgencias
    if (userRank === 3) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobreestimación moderada de ingreso: indicaste "${submission.hospitalizationDecision}", aunque este cuadro se maneja inicialmente en "${expectedHosp}" (1/3 pts).`;
    } else if (userRank === 1) {
      dispositionPts = 0;
      referralTriageVerdict = 'subestimado';
      referralTriageNote = `Egreso prematuro: indicaste "${submission.hospitalizationDecision}" cuando requería vigilancia en "${expectedHosp}" (0/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobre-referencia de recursos: indicaste "${submission.hospitalizationDecision}" para un cuadro de "${expectedHosp}" (0/3 pts).`;
    }
  } else {
    // Caso Ambulatorio (expectedRank === 1)
    if (userRank === 2) {
      dispositionPts = 1;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobreestimación de estancia: indicaste "${submission.hospitalizationDecision}", aunque este cuadro estable puede manejarse de forma "${expectedHosp}" (1/3 pts).`;
    } else {
      dispositionPts = 0;
      referralTriageVerdict = 'sobreestimado';
      referralTriageNote = `Sobre-referencia injustificada de recursos hospitalarios: indicaste "${submission.hospitalizationDecision}" en una patología de manejo "${expectedHosp}" (0/3 pts).`;
    }
  }

  const redFlagsSafetyNote = hasRedFlagsGuidance
    ? 'Se documentaron signos de alarma o pautas de vigilancia/revaloración oportuna.'
    : !isEcoeMode
      ? expectedHosp === 'Ambulatorio'
        ? 'Para estudio: en manejo ambulatorio recuerda siempre explicar verbalmente los signos de alarma al paciente (criterio evaluado por escrito en Modo ECOE).'
        : 'Parámetros de vigilancia clínica y signos de deterioro documentados en la auditoría para repaso.'
      : expectedHosp === 'Ambulatorio'
        ? 'En manejo ambulatorio es indispensable explicar al paciente los signos de alarma específicos para acudir de inmediato a urgencias.'
        : 'Faltó explicitar parámetros objetivos de vigilancia o deterioro clínico para escalar manejo.';

  let safetyScore = 0;
  if (noMeaningfulWorkDone || criticalSafetyErrors.length > 0) {
    safetyScore = 0;
  } else if (!isEcoeMode) {
    // En modalidades distintas al Modo ECOE no se solicitan criterios escritos de referencia ni alta; los 5 pts evalúan destino clínico y seguridad.
    safetyScore = hospExactMatch ? 5 : dispositionPts === 2 ? 3 : dispositionPts === 1 ? 2 : 0;
  } else {
    safetyScore = dispositionPts + (hasReferral ? 1 : 0) + (hasFollowUp ? 1 : 0);
  }

  const safetyDetail: RubricCategoryDetail = {
    whyScore: noMeaningfulWorkDone
      ? 'Obtuviste 0/5 porque no se registró diagnóstico ni plan terapéutico, dejando al paciente sin conducta médica definida.'
      : criticalSafetyErrors.length > 0
        ? 'Obtuviste 0/5 por cometer un error crítico de seguridad que pone en peligro la vida o integridad del paciente.'
        : !isEcoeMode
          ? `Nivel de atención propuesto: "${submission.hospitalizationDecision || 'Sin especificar'}" vs esperado "${expectedHosp}" (Conducta y seguridad: ${safetyScore}/5 pts).`
          : `Nivel de atención propuesto: "${submission.hospitalizationDecision || 'Sin especificar'}" vs esperado "${expectedHosp}" (Destino: ${dispositionPts}/3 · Total conducta: ${safetyScore}/5 pts).`,
    strengths: [
      ...(hospExactMatch && !noMeaningfulWorkDone ? [`Decisión correcta de destino clínico (${expectedHosp}).`] : []),
      ...(!noMeaningfulWorkDone && criticalSafetyErrors.length === 0
        ? ['Sin errores farmacológicos potencialmente mortales ni iatrogenia grave.']
        : []),
      ...(isEcoeMode && hasReferral ? ['Definiste criterios de referencia o interconsulta.'] : []),
      ...(isEcoeMode && hasFollowUp ? ['Definiste plan de seguimiento y vigilancia.'] : []),
      ...(hasRedFlagsGuidance ? ['Incluiste signos de alarma o pautas claras de revaloración.'] : []),
    ],
    missingOrImprove: [
      ...criticalSafetyErrors,
      ...(noMeaningfulWorkDone
        ? ['Registra al menos un diagnóstico presuntivo y conducta clínica antes de finalizar la atención.']
        : []),
      ...(!hospExactMatch ? [referralTriageNote] : []),
      ...(isEcoeMode && !hasReferral
        ? ['Faltó especificar criterios claros de referencia/interconsulta especializada o ingreso a UCI.']
        : []),
      ...(isEcoeMode && (!hasFollowUp || !hasRedFlagsGuidance) ? [redFlagsSafetyNote] : []),
    ],
    expectedStandard: isEcoeMode
      ? `Conducta esperada: ${expectedHosp}. Seguimiento: ${solution.optimalTreatment?.followUp || 'Vigilancia clínica estrecha y signos de alarma.'}`
      : `Destino clínico esperado: ${expectedHosp}.`,
  };
  if (safetyDetail.strengths.length === 0) {
    safetyDetail.strengths.push('No se acreditó una conducta segura válida.');
  }
  if (safetyDetail.missingOrImprove.length === 0) {
    safetyDetail.missingOrImprove.push('Conducta clínica segura, oportuna y alineada con el triage del paciente.');
  }

  const finalCriticalErrors = isExpressDiagOnly
    ? criticalSafetyErrors.filter((e) => !normStr(e).includes('error critico de conducta'))
    : criticalSafetyErrors;

  const finalDiffDetail: RubricCategoryDetail = isExpressDiagOnly
    ? {
        whyScore:
          'Modo Turno Médico Express: no se evalúan diagnósticos diferenciales para agilizar el flujo clínico.',
        strengths: ['Apartado omitido intencionalmente en guardia rápida (sin penalización).'],
        missingOrImprove: [
          `Repaso sugerido de diferenciales clave: ${expectedDiffs.join(' · ')}`,
        ],
        expectedStandard: `Diferenciales de estudio: ${expectedDiffs.join(' · ')}.`,
      }
    : !isEcoeMode
      ? {
          whyScore:
            'El planteamiento de diagnósticos diferenciales es exclusivo del Modo Examen Clínico (ECOE); tu puntaje total se normaliza sobre 100 con los apartados activos.',
          strengths: ['Apartado exclusivo de Modo ECOE (sin penalización en esta modalidad).'],
          missingOrImprove: [
            `Diferenciales de referencia para repaso académico: ${expectedDiffs.join(' · ')}`,
          ],
          expectedStandard: `Diferenciales de estudio: ${expectedDiffs.join(' · ')}.`,
        }
      : diffDetail;

  const finalTreatDetail: RubricCategoryDetail = isExpressDiagOnly
    ? {
        whyScore:
          'Modo Turno Médico Express: no se exige receta farmacológica completa; debajo se muestra el esquema STAT y definitivo óptimo para repaso.',
        strengths: [
          ...(positiveStatEvents.length > 0
            ? positiveStatEvents.map(
                (s) => `Estabilización STAT oportuna aplicada: ${s.drug} (${s.dose})`
              )
            : ['Apartado terapéutico omitido en guardia rápida (sin penalización en el puntaje).']),
        ],
        missingOrImprove: [
          ...(adverseStatEvents.map(
            (a) => `Dosis o fármaco STAT riesgoso (${a.drug} ${a.dose}): ${a.comment}`
          )),
          'Consulta el esquema de referencia completo (Fase 1 STAT + Fase 2 Definitivo) en la sección terapéutica de esta auditoría.',
        ],
        expectedStandard: treatDetail.expectedStandard,
      }
    : treatDetail;

  const finalSafetyDetail: RubricCategoryDetail = isExpressDiagOnly
    ? {
        whyScore:
          'Modo Turno Médico Express: no se solicitan criterios de referencia, alta ni destino para priorizar rapidez diagnóstica.',
        strengths:
          finalCriticalErrors.length === 0
            ? ['Sin eventos adversos iatrogénicos durante el abordaje express.']
            : [],
        missingOrImprove:
          finalCriticalErrors.length > 0
            ? finalCriticalErrors
            : [`Destino clínico esperado de estudio: ${expectedHosp}.`],
        expectedStandard: safetyDetail.expectedStandard,
      }
    : safetyDetail;

  const expressNormalizedScore = Math.max(
    0,
    Math.min(100, Math.round(((anamScore + examScore + studyScore + diagScore) / 70) * 100))
  );
  const standardNonEcoeNormalizedScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(((anamScore + examScore + studyScore + diagScore + treatScore + safetyScore) / 90) * 100)
    )
  );
  const totalScore = isExpressDiagOnly
    ? finalCriticalErrors.length > 0
      ? Math.min(expressNormalizedScore, 45)
      : expressNormalizedScore
    : !isEcoeMode
      ? standardNonEcoeNormalizedScore
      : Math.min(
          100,
          anamScore + examScore + studyScore + diagScore + diffScore + treatScore + safetyScore
        );

  let classification: EvaluationResult['classification'] = 'Buen desempeño';
  if (totalScore >= 90) classification = 'Excelente razonamiento clínico';
  else if (totalScore >= 80) classification = 'Muy buen desempeño';
  else if (totalScore >= 70) classification = 'Buen desempeño';
  else if (totalScore >= 60) classification = 'Necesita reforzar conocimientos';
  else classification = 'Necesita mejorar su abordaje clínico';

  const differentialExplanations = (solution.differentialDiagnoses || []).map((diff, i) => ({
    diagnosis: diff,
    rationale:
      (solution.criticalRulingOutFactors && solution.criticalRulingOutFactors[i]) ||
      `Aunque comparte síntomas iniciales con el motivo de consulta, la exploración física dirigida y los estudios paraclínicos orientan a favor de ${solution.correctDiagnosis} y permiten descartar ${diff}.`,
  }));

  return {
    totalScore,
    breakdown: {
      anamnesis: anamScore,
      physicalExam: examScore,
      studiesInterpretation: studyScore,
      primaryDiagnosis: diagScore,
      differentialDiagnoses: isExpressDiagOnly || !isEcoeMode ? 0 : diffScore,
      treatment: isExpressDiagOnly ? 0 : treatScore,
      safetyAndConduct: isExpressDiagOnly ? 0 : safetyScore,
    },
    categoryDetails: {
      anamnesis: anamDetail,
      physicalExam: examDetail,
      studiesInterpretation: studyDetail,
      primaryDiagnosis: diagDetail,
      differentialDiagnoses: finalDiffDetail,
      treatment: finalTreatDetail,
      safetyAndConduct: finalSafetyDetail,
    },
    classification,
    criticalSafetyErrors: finalCriticalErrors,
    feedback: {
      diagnosisAccuracyComment: diagDetail.whyScore,
      reasoningEvaluation:
        isExpressDiagOnly || !isEcoeMode
          ? `Fisiopatología de referencia de "${solution.correctDiagnosis}": ${solution.pathophysiology}`
          : (() => {
              if (justifLen >= 25) {
                return `Tu justificación ("${submission.clinicalJustification.slice(0, 220)}") fue contrastada contra la fisiopatología de referencia: ${solution.pathophysiology}`;
              }
              const abnormalVitals = getAbnormalVitalSignDescriptions(caseData);
              if (abnormalVitals.length > 0) {
                return `No redactaste una justificación clínica amplia. Es fundamental explicar cómo los signos vitales alterados (${abnormalVitals.join(', ')}), los hallazgos físicos y los paraclínicos convergen en "${solution.correctDiagnosis}".`;
              }
              return `No redactaste una justificación clínica amplia. Aunque sus signos vitales se encuentran estables y dentro de parámetros normales (lo cual descarta compromiso hemodinámico o sistémico agudo), es fundamental explicar cómo los síntomas de la historia clínica, los hallazgos físicos clave y los paraclínicos respaldan "${solution.correctDiagnosis}".`;
            })(),
      differentialEvaluation: finalDiffDetail.whyScore,
      workupCritique: studyDetail.whyScore,
      treatmentCritique: isExpressDiagOnly
        ? `En Turno Express no se exige prescribir receta. Esquema recomendado de estudio: ${optRx
            .map((r) => `${r.drug} ${r.dose} (${r.route}, ${r.frequency}, ${r.duration})`)
            .join(' + ')}. Destino: ${expectedHosp}.`
        : (() => {
            if (proposedTreatmentReviews.length === 0) {
              return `${treatDetail.whyScore} ${generalMeasuresCritique}`;
            }
            const highlights = proposedTreatmentReviews
              .slice(0, 3)
              .map((r) => `${r.drug}: ${r.verdictLabel.toLowerCase()} — ${r.clinicalComment.replace(/\.$/, '')}`)
              .join(' | ');
            const extraMissed =
              missedDrugs.length > 0 ? ` Pilares pendientes de referencia: ${missedDrugs.slice(0, 2).join('; ')}.` : '';
            return `${treatDetail.whyScore} Valoración de tu propuesta: ${highlights}.${extraMissed} ${generalMeasuresCritique}`;
          })(),
      pedagogicalPearls: [
        ...(solution.keyClinicalClues || []).slice(0, 3),
        ...(solution.criticalSafetyAlerts || []).slice(0, 2),
      ],
      guidelinesSummary: (solution.guidelineReferences || []).join(' · '),
    },
    differentialExplanations,
    rationalUseAudit: {
      rationalAntibioticStatus: isExpressDiagOnly ? 'no_aplica' : rationalAntibioticStatus,
      rationalAntibioticNote: isExpressDiagOnly
        ? 'Evaluación enfocada en diagnóstico rápido (Turno Médico Express).'
        : rationalAntibioticNote,
      workupStewardshipNote,
      redFlagsSafetyNote: isExpressDiagOnly
        ? `Destino y signos de alarma sugeridos para estudio: ${expectedHosp} — ${solution.optimalTreatment?.followUp || ''}`
        : redFlagsSafetyNote,
      referralTriageVerdict: isExpressDiagOnly ? 'correcto' : referralTriageVerdict,
      referralTriageNote: isExpressDiagOnly
        ? `Destino esperado de referencia: ${expectedHosp}.`
        : referralTriageNote,
    },
    evaluationFrameworkLabel: isExpressDiagOnly
      ? 'Turno Médico Express (Evaluación enfocada en diagnóstico clínico rápido)'
      : EVALUATION_FRAMEWORK_LABEL,
    recognizedEquivalents: uniqueEquivalents,
    proposedTreatmentReviews,
    generalMeasuresCritique: isExpressDiagOnly
      ? `Medidas de referencia: ${(solution.optimalTreatment?.generalMeasures || []).slice(0, 3).join(' · ')}`
      : generalMeasuresCritique,
    statAudit,
    userSummary: {
      primaryDiagnosis: submission.primaryDiagnosis || 'Sin diagnóstico registrado',
      differentialDiagnoses: userDiffs,
      clinicalJustification: submission.clinicalJustification || '',
      pharmacologicalPlan: userRx,
      generalMeasures: submission.generalMeasures || '',
      hospitalizationDecision: isExpressDiagOnly
        ? 'Omitida (Turno Médico Express)'
        : submission.hospitalizationDecision || 'Sin definir',
      referralCriteria: submission.referralCriteria || '',
      followUpPlan: submission.followUpPlan || '',
      questionCount: qCount,
      unlockedExamsNames: totalUnlockedExams.map((e) => e.name),
      unlockedStudiesNames: totalUnlockedStudies.map((s) => s.name),
      baselineVitalSigns: baseVitals,
      finalVitalSigns: endVitals,
    },
    expressDiagnosticOnly: isExpressDiagOnly,
    resolvedAt: new Date().toISOString(),
  };
}

/**
 * Fusiona la evaluación generada por IA con límites estrictos objetivos:
 * impide que secciones vacías o acciones indiscriminadas reciban puntaje gratuito.
 */
export function enrichEvaluationWithDidactics(
  aiEval: EvaluationResult,
  submission: UserEvaluationInput,
  caseData: ClinicalCase
): EvaluationResult {
  const baseline = buildDidacticEvaluation(submission, caseData);
  const qCount = submission.questionCount || 0;
  const examsCount = submission.unlockedExams?.length || 0;
  const studiesCount = submission.unlockedStudies?.length || 0;
  const hasDiag = Boolean((submission.primaryDiagnosis || '').trim());
  const hasDiffs = (submission.differentialDiagnoses || []).some((d) => d.trim().length >= 3);
  const genTrim = (submission.generalMeasures || '').trim();
  const hasTreat =
    (submission.pharmacologicalPlan || []).some((r) => (r.drug || '').trim().length >= 2) ||
    genTrim.length >= 15 ||
    (genTrim.length >= 3 &&
      /\b(npo|ayun[oa]?|no comer|nada por boca|dieta|hidrat|suero|liquid|oxigen|repos|hielo|eleva|vigil|control|monitor|sonda|canaliz|cirug|quirofano|operar|aislam|lavado|higiene|compres|vendaj|ferula)\b/.test(
        normStr(genTrim)
      ));

  const capWithBaselineIfStrict = (aiVal: number | undefined, baseVal: number, maxVal: number, isEmpty: boolean) => {
    if (isEmpty) return 0;
    const raw = Math.min(maxVal, Math.max(0, Math.round(aiVal ?? baseVal)));
    // Permite reconocer redacción clínica natural y equivalencias nacionales cuando la IA las valida, evitando castigos artificiales
    return Math.min(raw, Math.max(baseVal + 4, Math.round(raw * 0.65 + baseVal * 0.35)));
  };

  const isEcoeMode = caseData.mode === 'examen';
  const isExpressDiagOnly = Boolean(submission.expressDiagnosticOnly);
  const mergedBreakdown = {
    anamnesis: capWithBaselineIfStrict(aiEval.breakdown?.anamnesis, baseline.breakdown.anamnesis, 15, qCount === 0),
    physicalExam: capWithBaselineIfStrict(aiEval.breakdown?.physicalExam, baseline.breakdown.physicalExam, 15, examsCount === 0),
    studiesInterpretation: capWithBaselineIfStrict(aiEval.breakdown?.studiesInterpretation, baseline.breakdown.studiesInterpretation, 15, studiesCount === 0),
    primaryDiagnosis: capWithBaselineIfStrict(aiEval.breakdown?.primaryDiagnosis, baseline.breakdown.primaryDiagnosis, 25, !hasDiag),
    differentialDiagnoses: isEcoeMode && !isExpressDiagOnly
      ? capWithBaselineIfStrict(aiEval.breakdown?.differentialDiagnoses, baseline.breakdown.differentialDiagnoses, 10, !hasDiffs)
      : 0,
    treatment: isExpressDiagOnly
      ? 0
      : capWithBaselineIfStrict(aiEval.breakdown?.treatment, baseline.breakdown.treatment, 15, !hasTreat),
    safetyAndConduct:
      isExpressDiagOnly || (!hasDiag && !hasTreat) || baseline.criticalSafetyErrors.length > 0
        ? 0
        : Math.min(
            baseline.breakdown.safetyAndConduct,
            Math.max(0, Math.round(aiEval.breakdown?.safetyAndConduct ?? baseline.breakdown.safetyAndConduct))
          ),
  };

  const sumScore = isExpressDiagOnly
    ? baseline.totalScore
    : !isEcoeMode
      ? Math.min(
          100,
          Math.round(
            ((mergedBreakdown.anamnesis +
              mergedBreakdown.physicalExam +
              mergedBreakdown.studiesInterpretation +
              mergedBreakdown.primaryDiagnosis +
              mergedBreakdown.treatment +
              mergedBreakdown.safetyAndConduct) /
              90) *
              100
          )
        )
      : mergedBreakdown.anamnesis +
        mergedBreakdown.physicalExam +
        mergedBreakdown.studiesInterpretation +
        mergedBreakdown.primaryDiagnosis +
        mergedBreakdown.differentialDiagnoses +
        mergedBreakdown.treatment +
        mergedBreakdown.safetyAndConduct;

  let classification: EvaluationResult['classification'] = 'Buen desempeño';
  if (sumScore >= 90) classification = 'Excelente razonamiento clínico';
  else if (sumScore >= 80) classification = 'Muy buen desempeño';
  else if (sumScore >= 70) classification = 'Buen desempeño';
  else if (sumScore >= 60) classification = 'Necesita reforzar conocimientos';
  else classification = 'Necesita mejorar su abordaje clínico';

  // Filtra posibles falsos positivos de la IA (betalactámicos seguros en alergia a penicilina u omisiones menores infladas como error crítico)
  const sanitizedAiCritical = (aiEval.criticalSafetyErrors || []).filter((errMsg) => {
    const nErr = normStr(errMsg);
    const baselineHasAllergyError = baseline.criticalSafetyErrors.some((b) =>
      normStr(b).includes('alergi') || normStr(b).includes('anafilax')
    );
    if (
      (nErr.includes('betalactam') || nErr.includes('penicilin') || nErr.includes('carbapenem') || nErr.includes('meropenem')) &&
      !baselineHasAllergyError
    ) {
      return false;
    }
    if (!hasImmediateVitalThreat(caseData)) {
      const looksLikeMinorOmission =
        /\b(omiti|falto|no solicito|no registro|estudio|diferencial|justificacion|seguimiento|dosis|duracion|anamnesis|exploracion)\b/.test(
          nErr
        ) &&
        !/\b(alergi|anafilax|potasio|adrenalina|metotrexato|antiagregante|broncoespasmo|depresion respiratoria|wernicke|hemorragia)\b/.test(
          nErr
        );
      if (looksLikeMinorOmission) {
        return false;
      }
    }
    return true;
  });

  const mergedCritical = Array.from(
    new Set([...sanitizedAiCritical, ...baseline.criticalSafetyErrors])
  );

  return {
    ...baseline,
    ...aiEval,
    totalScore: sumScore,
    classification,
    breakdown: mergedBreakdown,
    criticalSafetyErrors: mergedCritical,
    categoryDetails: {
      anamnesis: qCount === 0 ? baseline.categoryDetails!.anamnesis : (aiEval.categoryDetails?.anamnesis?.whyScore ? aiEval.categoryDetails.anamnesis : baseline.categoryDetails!.anamnesis),
      physicalExam: examsCount === 0 ? baseline.categoryDetails!.physicalExam : (aiEval.categoryDetails?.physicalExam?.whyScore ? aiEval.categoryDetails.physicalExam : baseline.categoryDetails!.physicalExam),
      studiesInterpretation: studiesCount === 0 ? baseline.categoryDetails!.studiesInterpretation : (aiEval.categoryDetails?.studiesInterpretation?.whyScore ? aiEval.categoryDetails.studiesInterpretation : baseline.categoryDetails!.studiesInterpretation),
      primaryDiagnosis: !hasDiag ? baseline.categoryDetails!.primaryDiagnosis : (aiEval.categoryDetails?.primaryDiagnosis?.whyScore ? aiEval.categoryDetails.primaryDiagnosis : baseline.categoryDetails!.primaryDiagnosis),
      differentialDiagnoses: !hasDiffs ? baseline.categoryDetails!.differentialDiagnoses : (aiEval.categoryDetails?.differentialDiagnoses?.whyScore ? aiEval.categoryDetails.differentialDiagnoses : baseline.categoryDetails!.differentialDiagnoses),
      treatment: !hasTreat ? baseline.categoryDetails!.treatment : (aiEval.categoryDetails?.treatment?.whyScore ? aiEval.categoryDetails.treatment : baseline.categoryDetails!.treatment),
      safetyAndConduct:
        (!hasDiag && !hasTreat) ||
        mergedCritical.length > 0 ||
        baseline.rationalUseAudit?.referralTriageVerdict !== 'correcto'
          ? baseline.categoryDetails!.safetyAndConduct
          : aiEval.categoryDetails?.safetyAndConduct?.whyScore
            ? aiEval.categoryDetails.safetyAndConduct
            : baseline.categoryDetails!.safetyAndConduct,
    },
    differentialExplanations:
      aiEval.differentialExplanations && aiEval.differentialExplanations.length > 0
        ? aiEval.differentialExplanations
        : baseline.differentialExplanations,
    rationalUseAudit: baseline.rationalUseAudit,
    evaluationFrameworkLabel: baseline.evaluationFrameworkLabel,
    recognizedEquivalents: baseline.recognizedEquivalents,
    proposedTreatmentReviews: baseline.proposedTreatmentReviews,
    generalMeasuresCritique: baseline.generalMeasuresCritique,
    statAudit: baseline.statAudit,
    userSummary: baseline.userSummary,
    feedback: {
      diagnosisAccuracyComment: aiEval.feedback?.diagnosisAccuracyComment || baseline.feedback.diagnosisAccuracyComment,
      reasoningEvaluation: aiEval.feedback?.reasoningEvaluation || baseline.feedback.reasoningEvaluation,
      differentialEvaluation: aiEval.feedback?.differentialEvaluation || baseline.feedback.differentialEvaluation,
      workupCritique: aiEval.feedback?.workupCritique || baseline.feedback.workupCritique,
      treatmentCritique: aiEval.feedback?.treatmentCritique || baseline.feedback.treatmentCritique,
      pedagogicalPearls:
        aiEval.feedback?.pedagogicalPearls && aiEval.feedback.pedagogicalPearls.length > 0
          ? aiEval.feedback.pedagogicalPearls
          : baseline.feedback.pedagogicalPearls,
      guidelinesSummary: aiEval.feedback?.guidelinesSummary || baseline.feedback.guidelinesSummary,
    },
  };
}

export type PatientOutcomeStatus =
  | 'saved'
  | 'stabilized_morbidity'
  | 'upset_complaint'
  | 'critical_morbidity'
  | 'deceased';

export interface DramaticOutcome {
  status: PatientOutcomeStatus;
  badgeLabel: string;
  headline: string;
  sceneNarrative: string;
  patientQuote?: string;
  vitalMonitorStatus: string;
  clinicalPostscript: string;
}

/**
 * Determina el desenlace clínico real (morbimortalidad) del paciente previo a mostrar
 * el puntaje y la retroalimentación académica.
 * La evolución y morbimortalidad dependen fundamentalmente del tratamiento instaurado,
 * los errores críticos de seguridad, la conducta de ingreso/egreso y la gravedad basal
 * de la patología — y no de la calificación académica global.
 */
export function determineClinicalOutcome(
  evaluation: EvaluationResult,
  caseData: ClinicalCase
): DramaticOutcome {
  const name = caseData.patientInfo.name;
  const triage = caseData.patientInfo.triageLevel;
  const vitalThreat = hasImmediateVitalThreat(caseData);
  const unstableBaseline = hasUnstableBaselineVitals(caseData);
  const expectedHosp = caseData.solution?.optimalTreatment?.hospitalizationDecision || '';
  const expectedRank = getDispositionRank(normStr(expectedHosp));
  const isOutpatientCase = expectedRank === 1 || expectedHosp === 'Ambulatorio';
  const isMildSelfLimiting = isOutpatientCase && isSelfLimitingOrBenignOutpatientCase(caseData);
  const surgicalCase = isSurgicalOrProceduralCase(caseData);

  const score = evaluation.totalScore;
  const treatScore = evaluation.breakdown.treatment;
  const allSafetyErrors = evaluation.criticalSafetyErrors || [];
  const lethalErrors = allSafetyErrors.filter((e) => isLethalSafetyError(e, caseData));
  const nonLethalErrors = allSafetyErrors.filter((e) => !isLethalSafetyError(e, caseData));
  const hasLethalError = lethalErrors.length > 0;
  const hasAnySafetyError = allSafetyErrors.length > 0;

  const questionsAsked = evaluation.userSummary?.questionCount ?? 0;
  const examsDone = evaluation.userSummary?.unlockedExamsNames.length ?? 0;

  const userRx = (evaluation.userSummary?.pharmacologicalPlan || []).filter(
    (m) => (m.drug || '').trim().length >= 2
  );
  const nonStatPlan = userRx.filter((m) => !(m.id || '').startsWith('med-stat-'));
  const generalMeasuresText = (evaluation.userSummary?.generalMeasures || '').trim();
  const generalNorm = normStr(generalMeasuresText);
  const hasGeneralMeasures =
    generalMeasuresText.length >= 12 ||
    (generalMeasuresText.length >= 3 &&
      /\b(npo|ayun[oa]?|no comer|nada por boca|dieta|hidrat|suero|liquid|oxigen|repos|hielo|eleva|vigil|control|monitor|sonda|canaliz|cirug|quirofano|operar|aislam|lavado|higiene|compres|vendaj|ferula|epley|maniobra|drenaje|cpre|pericardiocentesis|rehabilit|ejercicio)\b/.test(
        generalNorm
      ));

  const statCount = evaluation.statAudit?.performedCount ?? 0;
  const statVerdict = evaluation.statAudit?.overallVerdict || 'no_requerido';
  const reviews = evaluation.proposedTreatmentReviews || [];
  const effectiveRxCount = reviews.filter(
    (r) => r.verdict === 'acertado' || r.verdict === 'alternativa_valida'
  ).length;
  const coadjuvantRxCount = reviews.filter((r) => r.verdict === 'coadyuvante_sintomatico').length;

  const optRx = caseData.solution?.optimalTreatment?.pharmacological || [];
  const requiredOptRxCount = Math.max(
    1,
    optRx.filter((r) => !/\b(opcional|solo si|sin supresores)\b/i.test(`${r.drug} ${r.rationale || ''}`)).length
  );
  const isMedicationOptionalCase =
    optRx.length === 0 || optRx.every((r) => /\b(sin supresores|solo si)\b/i.test(r.drug));

  const userHospNorm = normStr(evaluation.userSummary?.hospitalizationDecision || '');
  const userRank = getDispositionRank(userHospNorm);
  const appropriateHospitalCare =
    userRank >= 3 ||
    (expectedRank === 2 && userRank >= 2) ||
    (userRank === 0 && !allSafetyErrors.some((e) => normStr(e).includes('ambulatorio')) && (effectiveRxCount > 0 || statVerdict === 'optimo'));

  const noTreatmentPrescribed = userRx.length === 0 && !hasGeneralMeasures && statCount === 0;

  const hasStrongTreatment =
    !hasAnySafetyError &&
    (isMedicationOptionalCase
      ? hasGeneralMeasures || treatScore >= 6 || effectiveRxCount > 0
      : surgicalCase && expectedRank >= 3
        ? userRank >= 3 && (hasGeneralMeasures || effectiveRxCount > 0 || treatScore >= 6 || statVerdict === 'optimo')
        : vitalThreat
          ? appropriateHospitalCare &&
            (statVerdict === 'optimo' ||
              effectiveRxCount >= Math.min(2, requiredOptRxCount) ||
              (effectiveRxCount >= 1 && treatScore >= 8))
          : effectiveRxCount >= 1 ||
            treatScore >= 8 ||
            (isMildSelfLimiting && (coadjuvantRxCount > 0 || hasGeneralMeasures || treatScore >= 4)));

  const hasPartialTreatment =
    !hasStrongTreatment &&
    (effectiveRxCount > 0 ||
      coadjuvantRxCount > 0 ||
      treatScore >= 4 ||
      statVerdict === 'parcial' ||
      statVerdict === 'optimo' ||
      hasGeneralMeasures ||
      userRx.length > 0);

  const baseVitals = evaluation.userSummary?.baselineVitalSigns || caseData.vitalSigns;
  const baseBpSys = baseVitals ? parseBloodPressurePair(baseVitals.bloodPressure).sys : 120;
  const finalVitals = evaluation.userSummary?.finalVitalSigns || caseData.vitalSigns;
  const endBpSys = finalVitals ? parseBloodPressurePair(finalVitals.bloodPressure).sys : 120;
  const isImmediateIatrogenicDeath = Boolean(
    evaluation.statAudit?.immediateDeathReason ||
      (finalVitals && (finalVitals.heartRate === 0 || (finalVitals.bloodPressure || '').startsWith('0/')))
  );
  const worsenedToFatalVitals = Boolean(
    finalVitals &&
      ((typeof finalVitals.bloodGlucose === 'number' &&
        finalVitals.bloodGlucose < 35 &&
        (typeof baseVitals?.bloodGlucose !== 'number' || baseVitals.bloodGlucose >= 35)) ||
        (finalVitals.glasgow <= 6 && (!baseVitals || baseVitals.glasgow > 6)) ||
        (finalVitals.respiratoryRate <= 6 && (!baseVitals || baseVitals.respiratoryRate > 6)) ||
        (endBpSys < 65 && baseBpSys >= 65))
  );
  const startedAtFatalThreshold = Boolean(
    finalVitals &&
      ((typeof finalVitals.bloodGlucose === 'number' && finalVitals.bloodGlucose < 35) ||
        finalVitals.glasgow <= 6 ||
        finalVitals.respiratoryRate <= 6 ||
        endBpSys < 65)
  );
  const unrescuedBaselineThreshold =
    startedAtFatalThreshold &&
    (!hasStrongTreatment || hasAnySafetyError || statVerdict === 'omitido_en_inestabilidad');
  const unrescuedFatalIatrogenicVitals = worsenedToFatalVitals || unrescuedBaselineThreshold;
  const hasFatalDefinitivePrescription =
    nonStatPlan.length > 0 &&
    auditMedicationPlanSafety(nonStatPlan, caseData).errors.some((e) =>
      /\b(sobredosis letal|riesgo letal|paro cardiaco|fibrilacion ventricular|paro ventilatorio|apnea|exanguinacion|coma neuroglucopenico)\b/.test(
        normStr(e)
      )
    );
  const unrescuedFatalError =
    isImmediateIatrogenicDeath || unrescuedFatalIatrogenicVitals || hasFatalDefinitivePrescription;

  const realVitalsLine = finalVitals
    ? `PA: ${finalVitals.bloodPressure.split(' ')[0]} mmHg · FC: ${finalVitals.heartRate} lpm · FR: ${finalVitals.respiratoryRate} rpm · SpO₂: ${finalVitals.oxygenSaturation}%${typeof finalVitals.bloodGlucose === 'number' ? ` · Gluc: ${finalVitals.bloodGlucose} mg/dL` : ''}`
    : 'PA y FC estables · SatO₂ 98% · Sin compromiso vital agudo';

  // Modo Turno Médico Express (Solo Diagnóstico): evalúa precisión diagnóstica + seguridad STAT sin exigir receta/alta
  if (evaluation.expressDiagnosticOnly) {
    if (unrescuedFatalError) {
      return {
        status: 'deceased',
        badgeLabel: 'CÓDIGO AZUL · IATROGENIA STAT LETAL',
        headline: `Desenlace Fatal por Iatrogenia STAT en ${name}`,
        sceneNarrative: `Durante la atención rápida en Turno Médico, la intervención STAT aplicada provocó un compromiso fisiológico irreversible (${evaluation.statAudit?.immediateDeathReason || 'toxicidad aguda severa'}).`,
        vitalMonitorStatus: 'PA: 0/0 mmHg · FC: 0 lpm (Asistolia) · SatO2: 0%',
        clinicalPostscript:
          'Revisa las alertas de seguridad STAT y la dosis correcta en la auditoría del caso.',
      };
    }

    const diagPts = evaluation.breakdown.primaryDiagnosis;
    if (diagPts >= 20) {
      return {
        status: 'saved',
        badgeLabel: 'TURNO EXPRESS · DIAGNÓSTICO CERTERO',
        headline: `¡Diagnóstico acertado! ${name} quedó encauzado correctamente`,
        sceneNarrative: `Identificaste con precisión "${caseData.solution.correctDiagnosis}" de forma ágil, permitiendo activar de inmediato la ruta clínica adecuada.`,
        vitalMonitorStatus: realVitalsLine,
        clinicalPostscript:
          'Puedes consultar en Auditoría el esquema terapéutico completo (STAT + Definitivo) y la clase magistral para repaso.',
      };
    }
    if (diagPts >= 14) {
      return {
        status: 'stabilized_morbidity',
        badgeLabel: 'TURNO EXPRESS · APROXIMACIÓN PARCIAL',
        headline: `Aproximación diagnóstica parcial en ${name}`,
        sceneNarrative: `Orientaste el síndrome clínico hacia una entidad cercana, aunque el diagnóstico definitivo correspondía a "${caseData.solution.correctDiagnosis}".`,
        vitalMonitorStatus: realVitalsLine,
        clinicalPostscript:
          'Revisa los hallazgos clave diferenciadores y las perlas semiológicas en Auditoría.',
      };
    }
    return {
      status: vitalThreat ? 'critical_morbidity' : 'stabilized_morbidity',
      badgeLabel: vitalThreat
        ? 'TURNO EXPRESS · DIAGNÓSTICO DIFERENTE EN CUADRO CRÍTICO'
        : 'TURNO EXPRESS · DIAGNÓSTICO DESACERTADO',
      headline: vitalThreat
        ? `Diagnóstico errado en cuadro crítico (${name})`
        : `Diagnóstico desacertado en ${name}`,
      sceneNarrative: `Tu impresión diagnóstica no coincidió con "${caseData.solution.correctDiagnosis}", lo que retrasaría la intervención específica en guardia real.`,
      vitalMonitorStatus: realVitalsLine,
      clinicalPostscript:
        'Revisa en Auditoría las pistas clínicas y los estudios que definían el diagnóstico correcto.',
    };
  }

  // 1. Fallecimiento (Código Azul): iatrogenia letal o amenaza vital crítica sin tratamiento eficaz
  if (
    unrescuedFatalError ||
    (vitalThreat &&
      (hasLethalError ||
        noTreatmentPrescribed ||
        (!hasStrongTreatment &&
          !hasPartialTreatment &&
          (/\bNivel I\b/.test(triage) || unstableBaseline || userRank <= 1)) ||
        (statVerdict === 'omitido_en_inestabilidad' && effectiveRxCount === 0 && treatScore <= 3)))
  ) {
    return {
      status: 'deceased',
      badgeLabel: isImmediateIatrogenicDeath
        ? 'CÓDIGO AZUL · MUERTE INMEDIATA POR IATROGENIA'
        : unrescuedFatalError
          ? 'CÓDIGO AZUL · IATROGENIA LETAL'
          : 'CÓDIGO AZUL · SALA DE CHOQUE',
      headline: `Desenlace Fatal: ${name} ha fallecido`,
      sceneNarrative: isImmediateIatrogenicDeath
        ? `Tras la administración STAT fatal (${evaluation.statAudit?.immediateDeathReason || 'iatrogenia farmacológica inmediata'}), ${name} entró de manera fulminante en parada cardiorrespiratoria refractaria e irreversible en el acto, mostrando trazo isoeléctrico (asistolia).`
        : unrescuedFatalError
          ? `Tras la administración o prescripción de una dosis letal o farmacológicamente incompatible, ${name} evolucionó rápidamente a fallo orgánico agudo irreversible (${unrescuedFatalIatrogenicVitals ? `signos críticos terminales: ${realVitalsLine}, Glasgow ${finalVitals.glasgow}/15` : 'toxicidad aguda fulminante'}). A pesar de las maniobras avanzadas de reanimación, el monitor mostró asistolia.`
          : hasLethalError
            ? `Minutos después de iniciar el tratamiento indicado, ${name} presentó colapso hemodinámico súbito refractario e insuficiencia orgánica aguda debido a la contraindicación aplicada sobre su compromiso crítico basal. A pesar de las maniobras avanzadas de reanimación, el monitor mostró asistolia irreversible.`
            : `Debido a la ausencia o ineficacia crítica del tratamiento salvador requerido para su emergencia vital, ${name} evolucionó rápidamente hacia choque refractario y parada cardiorrespiratoria irreversible en sala de choque.`,
      vitalMonitorStatus: 'PA: 0/0 mmHg · FC: 0 lpm (Asistolia) · SatO2: 0%',
      clinicalPostscript:
        'La mortalidad en cuadros críticos está directamente determinada por la oportunidad, eficacia y seguridad del tratamiento instaurado.',
    };
  }

  // 2. Morbilidad Grave / Rescate en UCI o Reingreso Hospitalario (por tratamiento insuficiente, erróneo o egreso inseguro en cuadro urgente/grave)
  if (
    hasLethalError ||
    (vitalThreat && (!hasStrongTreatment || userRank === 1 || (userRank === 2 && expectedRank > 2))) ||
    (!vitalThreat &&
      !isOutpatientCase &&
      (nonLethalErrors.length > 0 ||
        (expectedRank >= 2 && (noTreatmentPrescribed || (!hasStrongTreatment && !hasPartialTreatment) || userRank === 1))))
  ) {
    const dischargedHomeWrongly =
      userRank === 1 || nonLethalErrors.some((e) => normStr(e).includes('ambulatorio'));
    return {
      status: 'critical_morbidity',
      badgeLabel: vitalThreat
        ? 'ALERTA EN SALA · TRASLADO URGENTE A UCI'
        : dischargedHomeWrongly
          ? 'REINGRESO DE URGENCIA · COMPLICACIÓN PREVENIBLE'
          : noTreatmentPrescribed
            ? expectedRank === 2
              ? 'SIN TRATAMIENTO · PROGRESIÓN EN URGENCIAS'
              : 'SIN TRATAMIENTO · PROGRESIÓN HOSPITALARIA'
            : 'EVOLUCIÓN COMPLICADA · TRATAMIENTO INSUFICIENTE',
      headline: vitalThreat
        ? `${name} sobrevivió con morbilidad grave`
        : dischargedHomeWrongly
          ? `${name} reingresó por progresión clínica tras egreso temprano`
          : `${name} presentó complicación prevenible por falta de tratamiento eficaz`,
      sceneNarrative: vitalThreat
        ? `Durante las horas posteriores a tu atención, ${name} sufrió una descompensación aguda severa porque faltaron pilares terapéuticos clave o un nivel de cuidado acorde, obligando al equipo de guardia a intervenir de urgencia e ingresarlo a UCI.`
        : dischargedHomeWrongly
          ? `Horas después de recibir manejo ambulatorio sin ingreso ni resolución hospitalaria/quirúrgica, ${name} regresó a Urgencias con progresión franca de su cuadro agudo, requiriendo hospitalización inmediata de rescate.`
          : noTreatmentPrescribed
            ? `Al no haberse indicado esquema terapéutico ni medidas hospitalarias dirigidas, el cuadro agudo de ${name} progresó con inflamación/deterioro local que requirió rescate urgente por el equipo de guardia.`
            : `Aunque ${name} se mantuvo sin riesgo de muerte súbita, el tratamiento indicado no cubrió adecuadamente el foco etiológico y permitió una complicación prevenible que prolongó su estancia.`,
      patientQuote: vitalThreat
        ? 'El familiar aguarda angustiado en sala de espera tras el traslado urgente a terapia intensiva.'
        : '"Doctor, regresé porque el dolor y las molestias empeoraron bastante en casa después de salir."',
      vitalMonitorStatus: unstableBaseline
        ? 'PA: Limítrofe bajo vigilancia estrecha · Monitorización continua en UCI'
        : `${realVitalsLine} · ${vitalThreat ? 'Monitorización intensiva en UCI' : 'Ingreso hospitalario de rescate'}`,
      clinicalPostscript: vitalThreat
        ? 'El paciente requirió soporte intensivo por déficit terapéutico inicial.'
        : 'El cuadro fue resuelto por el equipo de guardia sin desenlace fatal, aunque con morbilidad prevenible.',
    };
  }

  // 3. Error terapéutico no letal en caso ambulatorio/estable
  if (isOutpatientCase && hasAnySafetyError) {
    return {
      status: 'stabilized_morbidity',
      badgeLabel: 'ALERTA TERAPÉUTICA · RECONSULTA AMBULATORIA',
      headline: `${name} permanece estable, pero presentó efecto adverso o empeoramiento prevenible`,
      sceneNarrative: `Los signos vitales de ${name} se mantuvieron completamente estables y sin riesgo vital; sin embargo, la indicación farmacológica contraindicada generó empeoramiento sintomático o riesgo terapéutico prevenible, motivando una reconsulta para corregir la receta.`,
      patientQuote:
        '"Me siento estable, doctor, pero la molestia empeoró con lo que me recetaron y tuve que volver a revisión."',
      vitalMonitorStatus: realVitalsLine,
      clinicalPostscript:
        'Sin compromiso vital ni ingreso hospitalario: requiere ajuste farmacológico dirigido.',
    };
  }

  // 4. Cuadros NO graves / ambulatorios o de observación sin tratamiento o con tratamiento parcial (apegado a la vida real)
  if (!vitalThreat && !hasStrongTreatment) {
    // 4a. Cuadro benigno / autolimitado sin prescripción -> evoluciona naturalmente sin complicaciones graves
    if (isMildSelfLimiting && noTreatmentPrescribed) {
      return {
        status: 'stabilized_morbidity',
        badgeLabel: 'EVOLUCIÓN NATURAL AUTOLIMITADA · SIN RIESGO VITAL',
        headline: `${name} resolvió el episodio con el paso de los días, aunque con molestias evitables`,
        sceneNarrative: `No prescribiste fármacos ni medidas generales; sin embargo, al tratarse de un cuadro benigno y autolimitado sin gravedad clínica, ${name} no sufrió complicaciones ni riesgo vital y fue mejorando espontáneamente con los días, aunque soportando incomodidad que habría aliviado desde la consulta.`,
        patientQuote:
          '"Por suerte se me fue quitando solo poco a poco, doctor, aunque pasé varios días incómodo sin nada para el alivio."',
        vitalMonitorStatus: realVitalsLine,
        clinicalPostscript:
          'En patologías leves autolimitadas, no dejar tratamiento no genera mortalidad ni morbilidad grave, pero prolonga molestias innecesarias.',
      };
    }

    // 4b. Si apenas interrogó/exploró e indicó un manejo inadecuado en consulta
    if ((questionsAsked <= 1 || examsDone === 0) && !noTreatmentPrescribed && !hasPartialTreatment) {
      return {
        status: 'upset_complaint',
        badgeLabel: 'INCONFORMIDAD DEL PACIENTE EN CONSULTA',
        headline: `${name} se retira inconforme y busca segunda opinión`,
        sceneNarrative: `Al finalizar la consulta, ${name} percibió una valoración demasiado breve y un plan terapéutico que no atendió su problema principal, por lo que decidió buscar otra opinión médica antes de empeorar.`,
        patientQuote:
          '"Doctor, siento que casi no me revisó ni me dio una solución clara para lo que tengo... prefiero consultar otra opinión."',
        vitalMonitorStatus: `${realVitalsLine} · Paciente consciente e inconforme`,
        clinicalPostscript:
          'Sin peligro vital inmediato; la falta de exploración y de tratamiento dirigido afectó la confianza y adherencia.',
      };
    }

    // 4c. Cuadro no grave sin tratamiento específico -> persistencia sintomática / falta de mejoría ambulatoria real
    if (noTreatmentPrescribed || !hasPartialTreatment) {
      return {
        status: 'stabilized_morbidity',
        badgeLabel: noTreatmentPrescribed
          ? 'SIN TRATAMIENTO · PERSISTENCIA SINTOMÁTICA AMBULATORIA'
          : 'TRATAMIENTO INEFICAZ · SIN MEJORÍA CLÍNICA',
        headline: `${name} se mantuvo estable, pero regresó sin mejoría por falta de tratamiento eficaz`,
        sceneNarrative: noTreatmentPrescribed
          ? `Al tratarse de un padecimiento sin amenaza vital inmediata, ${name} mantuvo sus signos vitales completamente estables y no presentó complicaciones graves; sin embargo, al irse sin tratamiento ni medidas dirigidas, los síntomas continuaron molestando y motivaron una reconsulta.`
          : `Aunque el cuadro no comprometía la vida, los medicamentos prescritos no cubrieron la causa real de la enfermedad; ${name} permaneció estable pero sin alivio clínico, obligando a reajustar la receta en una nueva consulta.`,
        patientQuote:
          '"Doctor, seguí igual con mis molestias en casa porque no resolvió el problema y tuve que regresar a consulta."',
        vitalMonitorStatus: realVitalsLine,
        clinicalPostscript:
          'En cuadros no graves de la vida diaria, omitir o errar el tratamiento produce persistencia sintomática y reconsulta, no mortalidad.',
      };
    }

    // 4d. Tratamiento parcial o meramente sintomático en cuadro que requería pilar etiológico
    return {
      status: 'stabilized_morbidity',
      badgeLabel: 'MEJORÍA PARCIAL · REQUIERE AJUSTE TERAPÉUTICO',
      headline: `${name} tuvo alivio parcial, pero requirió ajuste del tratamiento`,
      sceneNarrative: `El manejo indicado brindó alivio sintomático inicial sin cubrir todos los pilares necesarios para resolver de fondo el problema; ${name} evolucionó estable y sin peligro vital, aunque con recuperación más lenta hasta completar su esquema definitivo.`,
      patientQuote:
        '"Me sentí algo mejor con las indicaciones, doctor, pero todavía sigo con molestias y necesitaré ajustar el tratamiento."',
      vitalMonitorStatus: realVitalsLine,
      clinicalPostscript:
        'Sin complicaciones graves; el ajuste dirigido del tratamiento completa la curación o el control.',
    };
  }

  // 5. Caso crítico que sobrevivió estable tras recibir manejo eficaz en sala pero requería mayor nivel (UCI)
  if (vitalThreat && hasStrongTreatment && expectedRank === 5 && userRank === 3) {
    return {
      status: 'stabilized_morbidity',
      badgeLabel: 'ESTABILIZADO CON VIGILANCIA ESTRECHA',
      headline: `${name} evolucionó favorablemente gracias al tratamiento, con traslado posterior a UCI`,
      sceneNarrative: `El tratamiento farmacológico y de soporte instaurado frenó la progresión aguda y estabilizó a ${name}; aunque originalmente requería vigilancia directa en UCI desde el ingreso, la terapia acertada evitó un desenlace fatal o secuelas mayores.`,
      patientQuote:
        '"Aunque pasé horas delicado, el tratamiento rápido ayudó a estabilizarme a tiempo, doctor."',
      vitalMonitorStatus: `${realVitalsLine} · Vigilancia continua`,
      clinicalPostscript:
        'El tratamiento oportuno fue el factor decisivo para preservar la vida y función del paciente.',
    };
  }

  // 6. Salvado / Evolución Clínica Favorable (determinada por tratamiento eficaz y conducta segura, sin depender de la nota académica)
  const lowAcademicNote = score < 72;
  return {
    status: 'saved',
    badgeLabel: 'EVOLUCIÓN FAVORABLE · TRATAMIENTO EFECTIVO',
    headline: isOutpatientCase
      ? `¡${name} evolucionó favorablemente con el tratamiento indicado!`
      : `¡${name} fue estabilizado y salvado gracias al tratamiento!`,
    sceneNarrative: lowAcademicNote
      ? `El esquema terapéutico y el nivel de cuidado indicados fueron acertados para controlar el problema clínico de ${name}, logrando una recuperación favorable sin complicaciones ni morbimortalidad atribuible al manejo.${isMildSelfLimiting && !userRx.length ? ' Las medidas generales indicadas acompañaron bien este cuadro benigno.' : ''} En la auditoría podrás revisar qué puntos del interrogatorio, exploración o registro conviene completar.`
      : `Gracias a tu tratamiento oportuno, esquema terapéutico acertado y conducta clínica segura, ${name} respondió de manera excelente al manejo instaurado. Los parámetros clínicos evolucionaron favorablemente sin complicaciones ni secuelas.`,
    patientQuote:
      '"¡Muchas gracias, doctor! Con el tratamiento que me dejó me sentí muchísimo mejor y ya voy saliendo adelante."',
    vitalMonitorStatus: realVitalsLine,
    clinicalPostscript: lowAcademicNote
      ? 'Desenlace clínico favorable sostenido por un tratamiento correcto, aunque la nota académica reflejará omisiones en el abordaje.'
      : 'Desenlace clínico exitoso y seguro conforme a guías clínicas internacionales.',
  };
}
