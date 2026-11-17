import { ClinicalCase, StatReferenceProtocolItem } from '../types/clinical';
import { buildRecommendedStatProtocol } from './caseEvaluation';

export interface SemiologicalPearlDetail {
  title: string;
  explanation: string;
}

export interface MasterclassTreatmentItem {
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  rationale: string;
}

export interface PathologyMasterclass {
  title: string;
  specialtyLabel: string;
  overviewNarrative: string;
  anamnesisStudy: string;
  physicalExamStudy: string;
  clinicalParametersAndLabs: string[];
  imagingAndCabinetFindings: string[];
  requiresUrgentStat: boolean;
  statProtocol: StatReferenceProtocolItem[];
  treatmentDisposition: string;
  treatmentRegimens: MasterclassTreatmentItem[];
  treatmentSupportMeasures: string[];
  treatmentSafetyRule?: string;
  treatmentSummary: string;
  semiologicalPearls: SemiologicalPearlDetail[];
}

interface CuratedPearlPattern {
  match: RegExp;
  title: string;
  explanation: string;
}

const SPECIALTY_LABELS: Record<string, string> = {
  medicina_interna: 'Medicina Interna',
  cardiologia: 'Cardiología',
  neurologia: 'Neurología',
  gastroenterologia: 'Gastroenterología',
  neumologia: 'Neumología',
  infectologia: 'Infectología',
  endocrinologia: 'Endocrinología',
  nefrologia: 'Nefrología',
  pediatria: 'Pediatría',
  ginecologia: 'Ginecología y Obstetricia',
  dermatologia: 'Dermatología',
  cirugia_general: 'Cirugía General',
  traumatologia: 'Traumatología y Ortopedia',
  psiquiatria: 'Psiquiatría',
  urgencias: 'Medicina de Urgencias',
  oftalmologia: 'Oftalmología',
  otorrinolaringologia: 'Otorrinolaringología',
  urologia: 'Urología',
  hematologia: 'Hematología',
  reumatologia: 'Reumatología',
  toxicologia: 'Toxicología Clínica',
  aleatorio: 'Medicina Clínica',
};

const SEMIOLOGICAL_PEARLS_BANK: CuratedPearlPattern[] = [
  {
    match: /\bapendicitis\b/,
    title: 'Cronología de Murphy y signos peritoneales (McBurney, Blumberg, Rovsing)',
    explanation:
      'El dolor inicia periumbilical/epigástrico por distensión visceral (fibras C autónomas) y migra a FID al inflamarse el peritoneo parietal (fibras somáticas). Blumberg indica irritación peritoneal directa; Rovsing traslada aire colónico hacia el ciego inflamado.',
  },
  {
    match: /\b(?:colecistitis|colangitis)\b/,
    title: 'Signo de Murphy y diferencia con Tríada de Charcot',
    explanation:
      'El signo de Murphy (corte inspiratorio doloroso al palpar hipocondrio derecho) traduce inflamación vesicular aguda. Si se suma ictericia y fiebre con escalofríos (Tríada de Charcot), indica obstrucción biliar infectada (colangitis) con riesgo de sepsis.',
  },
  {
    match: /\bpancreatitis\b/,
    title: 'Dolor en cinturón e hipersensibilidad epigástrica desproporcionada',
    explanation:
      'El páncreas es retroperitoneal: la inflamación irrita el plexo celíaco generando dolor transfictivo hacia la espalda que alivia levemente al inclinarse hacia adelante (posición mahometana) y empeora en decúbito supino.',
  },
  {
    match: /\b(?:infarto|iamcest|sindrome coronario)\b/,
    title: 'Signo de Levine, cuarto ruido (R4) y clasificación Killip-Kimball',
    explanation:
      'Apretar el puño sobre el esternón (Levine) traduce dolor isquémico profundo mediado por fibras viscerales simpáticas. El R4 aparece por rigidez diastólica del ventrículo isquémico; los estertores basales (Killip II) señalan congestión venocapilar incipiente.',
  },
  {
    match: /\bcetoacidosis\b/,
    title: 'Respiración de Kussmaul y pseudoperitonitis diabética',
    explanation:
      'La hiperpnea profunda y rápida (Kussmaul) es una compensación respiratoria para exhalar CO₂ ante acidosis metabólica con brecha aniónica elevada. La cetonemia e íleo generan dolor abdominal agudo que remite al corregir fluidos e insulina.',
  },
  {
    match: /\bmeningitis\b/,
    title: 'Tríada meníngea (Kernig/Brudzinski) y púrpura meningocócica',
    explanation:
      'Kernig (resistencia dolorosa al extender la rodilla con cadera flexionada) y Brudzinski (flexión involuntaria de rodillas al flexionar el cuello) reflejan estiramiento de raíces espinales inflamadas. Las petequias que no blanquean a la vitropresión sugieren meningococcemia.',
  },
  {
    match: /\bdengue\b/,
    title: 'Prueba del lazo y signos de alarma en la transición febril-crítica',
    explanation:
      'En dengue, el mayor peligro ocurre al caer la fiebre (días 3–6), cuando aumenta la permeabilidad capilar y el hematocrito sube mientras caen las plaquetas. Dolor abdominal intenso, vómitos persistentes y letargia preceden al choque.',
  },
  {
    match: /\bneumotorax\b/,
    title: 'Tríada de hipertimpanismo, abolición de murmullo vesicular y desviación traqueal',
    explanation:
      'El aire atrapado bajo presión positiva colapsa el pulmón ipsilateral (silencio auscultatorio + percusión timpánica) y empuja el mediastino al lado sano, comprimiendo las venas cavas (choque obstructivo).',
  },
  {
    match: /\btaponamiento\b/,
    title: 'Tríada de Beck y pulso paradójico',
    explanation:
      'Hipotensión, ingurgitación yugular y ruidos cardíacos velados reflejan restricción diastólica aguda por líquido pericárdico. El pulso paradójico (caída > 10 mmHg de PA sistólica en inspiración) se produce por abombamiento septal hacia el ventrículo izquierdo.',
  },
  {
    match: /\bneumonia\b/,
    title: 'Síndrome de condensación pulmonar (matidez, egofonía y crepitantes)',
    explanation:
      'El exudado alveolar reemplaza el aire y transmite mejor las vibraciones vocales (frémito aumentado, soplo tubárico) mientras genera crepitantes teleinspiratorios al despegarse los alvéolos ocupados.',
  },
  {
    match: /\b(?:asma|epoc|obstructiva cronica)\b/,
    title: 'Sibilancias espiratorias vs. tórax silencioso como bandera roja',
    explanation:
      'Las sibilancias indican flujo turbulento a través de bronquios estrechados. Si en una crisis grave las sibilancias desaparecen con disnea extrema, significa flujo aéreo crítico mínimo ("tórax silencioso") y riesgo de paro ventilatorio.',
  },
  {
    match: /\b(?:vertigo posicional|vppb)\b/,
    title: 'Nistagmo fatigado y latencia en la maniobra de Dix-Hallpike',
    explanation:
      'El vértigo periférico por canalolitiasis tiene latencia de 2–10 segundos, duración < 60 segundos, nistagmo torsional agotable y no presenta focalidad neurológica central (sin diplopía ni dismetría).',
  },
  {
    match: /\b(?:paralisis facial|bell)\b/,
    title: 'Compromiso de hemicara completa y signo de Bell',
    explanation:
      'La afectación periférica del VII par compromete tanto la frente como la boca (imposibilidad de arrugar la frente ipsilateral), diferenciándola de una lesión cortical central donde la frente queda respetada por inervación bilateral.',
  },
  {
    match: /\btunel del carpo\b/,
    title: 'Signos de Phalen y Tinel en territorio del nervio mediano',
    explanation:
      'Las parestesias nocturnas afectan pulgar, índice, dedo medio y mitad radial del anular (respetando el meñique, inervado por el cubital). La flexión sostenida de muñeca (Phalen) aumenta la presión intracarpiana y reproduce los síntomas.',
  },
  {
    match: /\b(?:artritis gotosa|gota|podagra)\b/,
    title: 'Podagra hiperálgica nocturna',
    explanation:
      'La primera articulación metatarsofalángica es más fría y soporta microtraumas mecánicos que favorecen la precipitación de cristales de urato monosódico, provocando flogosis intensa que alcanza su pico en 12–24 horas.',
  },
  {
    match: /\bfascitis plantar\b/,
    title: 'Dolor en primeros pasos ("post-reposo") y prueba de Windlass',
    explanation:
      'Durante el descanso nocturno la fascia plantar se acorta; los primeros apoyos matutinos generan microdesgarros en su inserción calcánea medial que ceden parcialmente al caminar y se reproducen al dorsiflexionar el hallux.',
  },
  {
    match: /\b(?:radiculopatia|ciatica)\b/,
    title: 'Signo de Lasègue y distribución dermatomérica',
    explanation:
      'Elevar la pierna extendida entre 30° y 70° estira las raíces L5–S1 sobre un disco herniado, desencadenando dolor irradiado por debajo de la rodilla (a diferencia de una lumbalgia mecánica pura, que se limita al área lumbar/glútea).',
  },
  {
    match: /\bfaringoamigdalitis\b/,
    title: 'Criterios clínicos de Centor modificados (McIsaac)',
    explanation:
      'Fiebre > 38 °C, exudado amigdalino, adenopatías cervicales anteriores dolorosas y ausencia de tos aumentan la probabilidad de Streptococcus pyogenes; la presencia de tos o rinorrea apunta con fuerza a causa viral.',
  },
  {
    match: /\b(?:sinusitis|rinosinusitis)\b/,
    title: 'Doble empeoramiento ("double sickening") y dolor maxilar postural',
    explanation:
      'Un cuadro catarral que mejora y luego empeora a partir del 5.º–7.º día (o dura > 10 días sin mejoría) sugiere sobreinfección bacteriana sinusal con aumento de presión ostiomeatal al inclinar la cabeza.',
  },
  {
    match: /\botitis externa\b/,
    title: 'Signo del trago positivo',
    explanation:
      'El dolor intenso al presionar el trago o traccionar el pabellón auricular localiza la inflamación en la piel del conducto auditivo externo, diferenciándola de la otitis media aguda donde el dolor nace detrás del tímpano.',
  },
  {
    match: /\b(?:escabiosis|sarna)\b/,
    title: 'Prurito de predominio nocturno y surco acarino con antecedente familiar',
    explanation:
      'La actividad del ácaro Sarcoptes scabiei y la respuesta de hipersensibilidad tardía aumentan con el calor de la cama por la noche; las lesiones respetan habitualmente cara y cuero cabelludo en adultos y comprometen pliegues interdigitales y muñecas.',
  },
  {
    match: /\b(?:tina|tinea|dermatofitosis)\b/,
    title: 'Borde activo circinado con centro claro',
    explanation:
      'Los dermatofitos crecen centrífugamente consumiendo queratina superficial, dejando un borde eritematoso descamativo sobreelevado con vesículas mientras el centro tiende a aclararse. Usar corticoides borra este borde y enmascara la infección (tiña incógnita).',
  },
  {
    match: /\bpreeclampsia\b/,
    title: 'Criterios de severidad neurovascular y epigastralgia en barra',
    explanation:
      'Cefalea refractaria, escotomas/fosfenos y dolor en epigastrio/hipocondrio derecho reflejan vasoespasmo cerebral y distensión de la cápsula de Glisson por edema/isquemia hepática, marcando riesgo inminente de eclampsia o síndrome HELLP.',
  },
  {
    match: /\bectopico\b/,
    title: 'Tríada de amenorrea, sangrado transvaginal y dolor pélvico con irritación peritoneal',
    explanation:
      'En toda mujer en edad fértil con amenorrea o retraso menstrual, hipotensión y dolor en fosa ilíaca/hipogastrio debe descartarse rotura tubárica con hemoperitoneo; el signo del hombro (Laffont) traduce sangre irritando el diafragma.',
  },
  {
    match: /\bstevens\b/,
    title: 'Signo de Nikolsky y compromiso mucocutáneo múltiple',
    explanation:
      'El desprendimiento epidérmico al friccionar suavemente piel aparentemente sana (Nikolsky positivo) indica necrosis queratinocítica de espesor completo y diferencia el síndrome de Stevens-Johnson de un exantema medicamentoso benigno.',
  },
  {
    match: /\b(?:tromboembolia|embolia pulmonar|tep)\b/,
    title: 'Disnea súbita con taquicardia e hipoxemia sin hallazgos pulmonares proporcionales',
    explanation:
      'La oclusión trombótica arterial pulmonar crea espacio muerto alveolar (alteración V/Q) e hipertensión pulmonar aguda sin exudado alveolar inicial, por lo que la auscultación y radiografía suelen lucir engañosamente limpias.',
  },
  {
    match: /\b(?:lesion renal|insuficiencia renal|hiperpotasemia)\b/,
    title: 'Efecto "Triple Whammy" y progresión electrocardiográfica del potasio',
    explanation:
      'Combinar IECA/ARA-II (dilatan arteriola eferente) + AINE (constriñen arteriola aferente) + diurético (depleta volumen) desploma la filtración glomerular. En el ECG, el potasio eleva ondas T picudas antes de ensanchar el QRS y precipitar asistolia.',
  },
  {
    match: /\banafilax[a-z]*\b/,
    title: 'Estridor laríngeo, urticaria y choque distributivo de rápida instauración',
    explanation:
      'La degranulación masiva de mastocitos libera histamina y triptasa que provocan vasodilatación brusca y edema de vía aérea superior en minutos; la ausencia de fiebre y la exposición previa a un alergeno orientan el diagnóstico inmediato.',
  },
  {
    match: /\b(?:rinofaringitis|resfriado)\b/,
    title: 'Rinorrea hialina, coriza y orofaringe sin exudado',
    explanation:
      'El predominio de estornudos, congestión nasal y secreción acuosa sin fiebre alta ni placas amigdalinas purulentas distingue una infección viral autolimitada de vía aérea superior, evitando antibioticoterapia innecesaria.',
  },
  {
    match: /\b(?:gastritis|dispepsia)\b/,
    title: 'Dolor epigástrico urente relacionado con ayuno o gastrolesivos',
    explanation:
      'La inflamación mucosa por ácido clorhídrico, AINEs o Helicobacter pylori genera ardor epigástrico sin irradiación dorsal transfictiva ni defensa peritoneal; la ausencia de pérdida ponderal, disfagia o melena descarta banderas rojas.',
  },
  {
    match: /\b(?:cistitis|pielonefritis)\b/,
    title: 'Disuria y polaquiuria vs. tríada de fiebre, dolor lumbar y Giordano positivo',
    explanation:
      'La irritación vesical produce síntomas bajos sin compromiso sistémico (cistitis); cuando aparece fiebre, escalofríos y puño-percusión lumbar dolorosa (signo de Giordano), traduce ascenso bacteriano al parénquima renal (pielonefritis).',
  },
  {
    match: /\bmigrana\b/,
    title: 'Cefalea pulsátil hemicránea con fotofobia/fonofobia y aura visual',
    explanation:
      'La depresión cortical propagada explica el aura visual reversible (< 60 min) previa al dolor, mientras la activación trigeminovascular genera cefalea pulsátil agravada por la actividad física rutinaria y acompañada de náuseas.',
  },
  {
    match: /\b(?:depresivo|depresion)\b/,
    title: 'Ánimo deprimido + anhedonia persistente (≥ 2 semanas)',
    explanation:
      'El diagnóstico clínico exige al menos dos semanas continuas de tristeza o pérdida de interés/placer asociadas a síntomas neurovegetativos (insomnio/hipersomnia, fatiga, alteración del apetito), evaluando siempre el riesgo suicida de forma directa.',
  },
  {
    match: /\bqueratitis herpetica\b/,
    title: 'Úlcera dendrítica con fluoresceína e hipoestesia corneal',
    explanation:
      'La infección epitelial por VHS sigue trayectos nerviosos causando ramificaciones con bulbos terminales y daño de fibras corneales sensitivas (hipoestesia). Nunca usar corticoides tópicos porque expanden la dendrita hacia una úlcera geográfica.',
  },
  {
    match: /\bglaucoma agudo\b/,
    title: 'Ojo rojo pétreo + pupila en midriasis media arreactiva',
    explanation:
      'Al superar los 45-50 mmHg de presión intraocular, la isquemia del esfínter pupilar fija la pupila en midriasis media arreactiva, produce edema corneal (halos de colores) y dolor trigeminal con náuseas y vómitos reflejos.',
  },
  {
    match: /\babsceso periamigdalino\b/,
    title: 'Trismo, voz en "papa caliente" y desviación contralateral de la úvula',
    explanation:
      'La colección supurativa irrita el músculo pterigoideo medial provocando incapacidad para abrir la boca (trismo), empuja el paladar blando hacia adelante y desvía la úvula hacia el lado sano.',
  },
  {
    match: /\bepistaxis\b/,
    title: 'Plexo de Kiesselbach visible y faringe posterior limpia',
    explanation:
      'El 90% de los sangrados nasales proceden del área anteroinferior del tabique (plexo de Kiesselbach). Observar la pared posterior de la orofaringe permite descartar sangrado posterior grave.',
  },
  {
    match: /\btorsion testicular\b/,
    title: 'Reflejo cremastérico abolido, Signo de Prehn negativo y testículo horizontal',
    explanation:
      'La rotación del cordón espermático acorta el pedículo elevando y horizontalizando el testículo (Gouverneur), suprime el reflejo cremastérico y hace que elevar el escroto empeore el dolor isquémico (Prehn negativo), a diferencia de la orquiepididimitis.',
  },
  {
    match: /\b(?:hiperplasia prostatica|retencion aguda de orina)\b/,
    title: 'Globo vesical suprapúbico mate y doloroso',
    explanation:
      'La vejiga sobredistendida por obstrucción del tracto de salida se palpa como una masa ovoide tensa suprapúbica con matidez convexa hacia arriba y desencadena urgencia miccional al presionarla.',
  },
  {
    match: /\bneutropenia febril\b/,
    title: 'Fiebre en nadir medular sin pus ni inflamación local florida',
    explanation:
      'Con <500 neutrófilos/mm³, el organismo no forma abscesos ni exudados purulentos clásicos: una simple febrícula o discreto eritema peri-catéter puede ocultar bacteriemia por gramnegativos.',
  },
  {
    match: /\bpurpura trombocitopenica\b/,
    title: 'Petequias que no blanquean y "púrpura húmeda" mucosa',
    explanation:
      'Las petequias verdaderas por plaquetopenia no desaparecen a la vitropresión. Cuando se acompañan de bulas hemorrágicas orales o gingivorragia (púrpura húmeda), alertan alto riesgo de sangrado mayor.',
  },
  {
    match: /\barteritis de celulas gigantes\b/,
    title: 'Claudicación mandibular, alodinia capilar y arteria temporal hipopulsátil',
    explanation:
      'La isquemia de los músculos maseteros durante la masticación (claudicación mandibular) y el dolor al peinarse en >50 años apuntan a vasculitis de ramas carotídeas externas con riesgo inminente de ceguera si hay amaurosis fugaz.',
  },
  {
    match: /\bartritis septica\b/,
    title: 'Monoartritis febril con bloqueo absoluto del rango articular pasivo',
    explanation:
      'La distensión capsular purulenta genera un espasmo protector que bloquea incluso el movimiento pasivo mínimo de la articulación, diferenciándola de procesos periarticulares como bursitis o celulitis.',
  },
  {
    match: /\b(?:paracetamol|acetaminofen)\b/,
    title: 'Fase silenciosa temprana (<24 h) antes de elevarse las transaminasas',
    explanation:
      'Durante las primeras horas tras una sobredosis de acetaminofén, el paciente solo presenta náuseas o molestias leves en hipocondrio derecho y AST/ALT aún normales: la indicación de N-acetilcisteína depende del nomograma de Rumack-Matthew, no de esperar necrosis hepática.',
  },
  {
    match: /\bmetanol\b/,
    title: 'Visión en "tormenta de nieve" y doble brecha (aniónica + osmolar)',
    explanation:
      'El metanol sin metabolizar eleva inicialmente la brecha osmolar, y su metabolito tóxico (ácido fórmico) genera acidosis metabólica grave con brecha aniónica alta e hiperemia del disco óptico.',
  },
];

function lowerFirstIfNotAcronym(text: string): string {
  const t = cleanText(text);
  if (!t) return '';
  if (/^[A-ZÁÉÍÓÚÑ]{2,}/.test(t)) return t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}

function truncateAtWordBoundary(text: string, maxLen: number): string {
  const t = cleanText(text);
  if (t.length <= maxLen) return t;
  const sliced = t.slice(0, maxLen);
  const lastSpace = sliced.lastIndexOf(' ');
  let out = (lastSpace > 20 ? sliced.slice(0, lastSpace) : sliced).replace(/[,:;.\-]+$/, '').trim();
  while (/\s+(?:de|del|la|el|los|las|y|e|o|u|con|sin|en|a|al|para|por)$/i.test(out)) {
    out = out.replace(/\s+(?:de|del|la|el|los|las|y|e|o|u|con|sin|en|a|al|para|por)$/i, '').trim();
  }
  return out;
}

function cleanText(s?: string): string {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function normStr(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isNonEmptyBackgroundEntry(val: string): boolean {
  const n = normStr(val);
  if (!n || n.length < 4) return false;
  return !/^(ningun[oa]?|no refiere|sin antecedentes|niega|no conocidos|sin alergias|no aplica|negados?)/.test(
    n
  );
}

function extractSemiologicalTitle(name: string, finding: string, note?: string): string {
  const combined = `${name} ${finding} ${note || ''}`;
  const namedSignMatch = combined.match(
    /(?:Signo|Maniobra|Tríada|Triada|Prueba|Criterios|Escala|Clasificación|Reflejo)\s+(?:de(?:l)?\s+)?[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚáéíóúñÑ0-9\-/\s]{2,42}/
  );
  if (namedSignMatch) {
    return namedSignMatch[0].replace(/[.:,;]+$/, '').trim();
  }
  return name.replace(/\s*\([^)]*\)/g, '').trim();
}

function buildVitalProfileSentence(caseData: ClinicalCase): string {
  const v = caseData.vitalSigns;
  const age = caseData.patientInfo?.age ?? 30;
  const bpMatch = (v.bloodPressure || '').match(/(\d+)\s*\/\s*(\d+)/);
  const sys = bpMatch ? parseInt(bpMatch[1], 10) : 120;
  const dia = bpMatch ? parseInt(bpMatch[2], 10) : 80;
  const alterations: string[] = [];

  if (sys < 90) alterations.push('hipotensión arterial / compromiso hemodinámico');
  else if (sys >= 160 || dia >= 100) alterations.push('elevación tensional marcada');
  else if (sys >= 140 || dia >= 90) alterations.push('cifras tensionales elevadas');

  const hrLimit = age < 12 ? 125 : 100;
  if (v.heartRate > hrLimit) alterations.push('taquicardia reactiva o compensatoria');
  else if (v.heartRate < 55 && age >= 12) alterations.push('bradicardia');

  const rrLimit = age < 12 ? 30 : 20;
  if (v.respiratoryRate > rrLimit) alterations.push('taquipnea');
  if (v.temperature >= 38.0) alterations.push('fiebre franca');
  else if (v.temperature >= 37.5) alterations.push('febrícula');
  if (v.oxygenSaturation < 94) alterations.push('desaturación de oxígeno (hipoxemia)');
  if (v.glasgow < 15) alterations.push('alteración del estado de conciencia (Glasgow disminuido)');
  if (typeof v.bloodGlucose === 'number' && v.bloodGlucose >= 200) {
    alterations.push('hiperglucemia significativa');
  } else if (typeof v.bloodGlucose === 'number' && v.bloodGlucose < 65) {
    alterations.push('hipoglucemia');
  }

  if (alterations.length === 0) {
    return 'Los signos vitales suelen conservarse estables y dentro de parámetros normales en formas no complicadas (su alteración debe alertar sobre complicación sistémica o sepsis).';
  }
  return `En los signos vitales típicamente se documenta ${alterations.join(', ')}.`;
}

export function buildPathologyMasterclass(caseData: ClinicalCase): PathologyMasterclass {
  const { solution, patientInfo, background, physicalExamPool, studiesPool } = caseData;
  const diagnosis = cleanText(solution.correctDiagnosis);
  const specialtyLabel = SPECIALTY_LABELS[caseData.specialty] || 'Medicina Clínica';

  // 1. Visión general fisiopatológica
  const overviewNarrative = cleanText(solution.pathophysiology);

  // 2. Anamnesis de estudio (narrativa)
  const relevantPath = (background?.pathological || []).filter(isNonEmptyBackgroundEntry);
  const relevantNonPath = (background?.nonPathological || []).filter(isNonEmptyBackgroundEntry);
  const relevantFamily = (background?.family || []).filter(isNonEmptyBackgroundEntry);
  const backgroundHints = [...relevantPath, ...relevantNonPath, ...relevantFamily].slice(0, 3);

  const symptomClues = (solution.characteristicSignsSymptoms || []).slice(0, 4);
  const historyClues = (solution.keyClinicalClues || [])
    .filter((clue) => !/\b(tac|rx|ecograf|ultrasonid|ecg|electrocardiogram|troponina|pcr|leucocit|plaqueta|hemograma|laboratorio|biometria)\b/i.test(clue))
    .slice(0, 2);

  const evoHint = cleanText(patientInfo.evolutionTime);
  const anamnesisParts: string[] = [];
  anamnesisParts.push(
    `En la historia clínica de estudio, ${diagnosis} suele presentarse con una evolución ${evoHint ? `típica de ${evoHint.toLowerCase()}` : 'característica según su fase clínica'} y un cuadro dominado por ${
      symptomClues.length > 0
        ? symptomClues.map((s) => lowerFirstIfNotAcronym(s).replace(/\.$/, '')).join('; ')
        : lowerFirstIfNotAcronym(patientInfo.consultReason)
    }.`
  );
  if (historyClues.length > 0) {
    anamnesisParts.push(
      `Durante el interrogatorio dirigido conviene explorar especialmente: ${historyClues
        .map((c) => lowerFirstIfNotAcronym(c).replace(/\.$/, ''))
        .join('; ')}.`
    );
  }
  if (backgroundHints.length > 0) {
    anamnesisParts.push(
      `Como antecedentes o factores predisponentes relevantes al investigar el contexto del paciente destacan: ${backgroundHints
        .map((b) => lowerFirstIfNotAcronym(b).replace(/\.$/, ''))
        .join('; ')}.`
    );
  } else {
    anamnesisParts.push(
      `En la anamnesis de antecedentes es clave preguntar por alergias medicamentosas, fármacos habituales y exposiciones recientes para definir seguridad terapéutica y descartar desencadenantes.`
    );
  }
  const anamnesisStudy = anamnesisParts.join(' ');

  // 3. Examen físico de estudio (narrativa)
  const abnormalExams = (physicalExamPool || []).filter((pe) => pe.isAbnormal);
  const vitalSentence = buildVitalProfileSentence(caseData);
  const examHighlights = abnormalExams
    .slice(0, 4)
    .map((pe) => `${pe.name.replace(/\s*\([^)]*\)/g, '')}: ${cleanText(pe.finding)}`);

  const physicalExamStudy =
    examHighlights.length > 0
      ? `${vitalSentence} A la exploración física dirigida se esperan hallazgos focales en ${examHighlights.join(' · ')}`
      : `${vitalSentence} La exploración física suele mostrar hallazgos focales discretos o ausencia de signos de alarma sistémicos, por lo que su valor principal es descartar patología grave concomitante.`;

  // 4. Parámetros clínicos y datos de laboratorio relevantes
  const clinicalParametersAndLabs: string[] = [];
  const v = caseData.vitalSigns;
  clinicalParametersAndLabs.push(
    `Perfil de signos vitales guía del cuadro: PA ${v.bloodPressure.split(' ')[0]} mmHg · FC ${v.heartRate} lpm · FR ${v.respiratoryRate} rpm · Temp ${v.temperature} °C · SpO₂ ${v.oxygenSaturation}% · Glasgow ${v.glasgow}/15${typeof v.bloodGlucose === 'number' ? ` · Glucemia ${v.bloodGlucose} mg/dL` : ''}.`
  );

  const abnormalLabs = (studiesPool || []).filter(
    (st) => st.isAbnormal && st.category === 'Laboratorio'
  );
  if (abnormalLabs.length > 0) {
    for (const lab of abnormalLabs.slice(0, 5)) {
      const refText = lab.referenceRange ? ` [Ref: ${lab.referenceRange}]` : '';
      const interpText = lab.interpretation ? ` — ${cleanText(lab.interpretation)}` : '';
      clinicalParametersAndLabs.push(
        `${lab.name}: ${cleanText(lab.result)}${refText}${interpText}`
      );
    }
  } else {
    clinicalParametersAndLabs.push(
      `Diagnóstico primordialmente clínico: los estudios de laboratorio generales suelen resultar normales y se reservan para casos atípicos, sospecha de sobreinfección o descarte de complicaciones.`
    );
  }

  // 5. Estudios de imagen y gabinete esperados
  const imagingStudies = (studiesPool || []).filter(
    (st) => st.category === 'Imagen' || st.category === 'Gabinete y Trazados'
  );
  const abnormalImaging = imagingStudies.filter((st) => st.isAbnormal);
  const imagingAndCabinetFindings: string[] = [];

  if (abnormalImaging.length > 0) {
    for (const img of abnormalImaging.slice(0, 4)) {
      const interpText = img.interpretation ? ` (${cleanText(img.interpretation)})` : '';
      imagingAndCabinetFindings.push(
        `${img.name}: ${cleanText(img.result)}${interpText}`
      );
    }
  } else if (imagingStudies.length > 0) {
    const normalExamples = imagingStudies.slice(0, 2).map((s) => s.name).join(' / ');
    imagingAndCabinetFindings.push(
      `En cuadros típicos sin banderas rojas no se requieren estudios de imagen o gabinete de rutina; si se realizan (${normalExamples}), suelen resultar normales y sirven principalmente para descartar diagnósticos alternativos.`
    );
  } else {
    imagingAndCabinetFindings.push(
      `No se indican estudios de imagen ni trazados de gabinete de rutina en la presentación clásica no complicada.`
    );
  }

  // 6. Resumen terapéutico de estudio (Protocolo STAT/Urgencias + esquema definitivo/ambulatorio con días)
  const { requiresUrgentStat, protocol: statProtocol } = buildRecommendedStatProtocol(caseData);
  const treatmentDisposition = cleanText(solution.optimalTreatment?.hospitalizationDecision);
  const treatmentRegimens: MasterclassTreatmentItem[] = (solution.optimalTreatment?.pharmacological || []).map(
    (r) => ({
      drug: cleanText(r.drug),
      dose: cleanText(r.dose),
      route: cleanText(r.route),
      frequency: cleanText(r.frequency),
      duration: cleanText(r.duration),
      rationale: cleanText(r.rationale),
    })
  );
  const treatmentSupportMeasures = (solution.optimalTreatment?.generalMeasures || [])
    .slice(0, 3)
    .map((g) => cleanText(g).replace(/\.$/, ''));
  const topAlert = solution.criticalSafetyAlerts?.[0] || caseData.clinicalMetadata?.frequentErrors?.[0];
  const treatmentSafetyRule = topAlert ? cleanText(topAlert) : undefined;

  const rxSummaryList = treatmentRegimens.map(
    (r) =>
      `${r.drug} — Dosis: ${r.dose} · Vía: ${r.route} · Frecuencia: ${r.frequency} · Duración: ${r.duration}`
  );
  const gmSummary = treatmentSupportMeasures.slice(0, 2).join('; ');

  const treatmentSummary = [
    treatmentDisposition ? `Conducta y nivel asistencial: ${treatmentDisposition}.` : '',
    rxSummaryList.length > 0
      ? `Esquema farmacológico de referencia: ${rxSummaryList.join(' | ')}.`
      : `El abordaje central descansa en medidas no farmacológicas y soporte clínico.`,
    gmSummary ? `Soporte no farmacológico indispensable: ${gmSummary}.` : '',
    treatmentSafetyRule ? `Regla de oro de seguridad: ${treatmentSafetyRule}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  // 7. Perlas semiológicas clave CON explicación fisiopatológica/clínica
  const semiologicalPearls: SemiologicalPearlDetail[] = [];
  const seenNormalized = new Set<string>();

  const pushPearl = (title: string, explanation: string) => {
    const cleanTitle = cleanText(title).replace(/[.:]+$/, '');
    const cleanExp = cleanText(explanation);
    if (!cleanTitle || !cleanExp || semiologicalPearls.length >= 5) return;
    const key = normStr(cleanTitle).slice(0, 22);
    if (seenNormalized.has(key)) return;
    seenNormalized.add(key);
    semiologicalPearls.push({ title: cleanTitle, explanation: cleanExp });
  };

  // 7a. Perlas semiológicas del diccionario clínico según diagnóstico definitivo
  const diagNormSearchable = normStr(diagnosis);
  for (const entry of SEMIOLOGICAL_PEARLS_BANK) {
    if (entry.match.test(diagNormSearchable)) {
      pushPearl(entry.title, entry.explanation);
    }
  }

  // 7b. Notas semiológicas específicas del examen físico del caso
  for (const pe of abnormalExams) {
    if (pe.semiologyNote && pe.semiologyNote.trim().length >= 15) {
      const signTitle = extractSemiologicalTitle(pe.name, pe.finding, pe.semiologyNote);
      const exp =
        pe.semiologyNote.length < 75
          ? `${cleanText(pe.semiologyNote)} Hallazgo semiológico asociado: ${cleanText(pe.finding)}`
          : cleanText(pe.semiologyNote);
      pushPearl(signTitle, exp);
    }
  }

  // 7c. Respaldo didáctico con claves + interpretación si faltan perlas para llegar al menos a 3
  if (semiologicalPearls.length < 3) {
    for (const clue of solution.keyClinicalClues || []) {
      if (semiologicalPearls.length >= 4) break;
      const head = clue.split(':')[0].split('(')[0].trim();
      const shortTitle = truncateAtWordBoundary(head, 68);
      pushPearl(
        shortTitle,
        `${cleanText(clue).replace(/\.$/, '')}. En la práctica clínica, este dato orienta la probabilidad pre-test hacia ${diagnosis} frente a diagnósticos diferenciales de presentación similar.`
      );
    }
  }

  if (semiologicalPearls.length < 3 && (caseData.clinicalMetadata?.frequentErrors?.length ?? 0) > 0) {
    const err = caseData.clinicalMetadata!.frequentErrors[0];
    pushPearl(
      'Trampa diagnóstica / terapéutica frecuente',
      `${cleanText(err)}. Reconocer este punto evita retrasos diagnósticos o yatrogenia prevenible en la guardia.`
    );
  }

  return {
    title: `Clase Magistral de Estudio: ${diagnosis}`,
    specialtyLabel,
    overviewNarrative,
    anamnesisStudy,
    physicalExamStudy,
    clinicalParametersAndLabs,
    imagingAndCabinetFindings,
    requiresUrgentStat,
    statProtocol,
    treatmentDisposition,
    treatmentRegimens,
    treatmentSupportMeasures,
    treatmentSafetyRule,
    treatmentSummary,
    semiologicalPearls,
  };
}
