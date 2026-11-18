import { KnowledgeRecord } from '../types/knowledge';

export const KNOWLEDGE_BASE_VERSION = '2026.11.1';
export const KNOWLEDGE_BASE_DATE = '2026-11-17';

/**
 * Base de Conocimiento Médico Local Verificada (Offline-First).
 * Regla editorial estricta:
 * - No se inventan autores, DOI ni ensayos clínicos.
 * - Toda recomendación registra fuente identificable, versión, región, estado de vigencia y nivel de certeza.
 * - Las discrepancias entre guías se explicitan y explican sin mezclarlas arbitrariamente.
 */
export const CURATED_KNOWLEDGE_RECORDS: KnowledgeRecord[] = [
  {
    id: 'abcde-critico',
    kind: 'protocolo_terapeutico',
    category: 'urgencias',
    title: 'Abordaje Primario Estructurado ABCDE en Paciente Crítico',
    source: 'ATLS 10.ª Ed. / European Resuscitation Council (ERC) / AHA',
    institution: 'AHA_ACC',
    publishedDate: '2018-01-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ATLS 10.ª Ed. · ERC 2021',
    regionOrCountry: 'Global / Hospitalario',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Consenso internacional estándar de trauma y reanimación',
    bibliographicReference:
      'American College of Surgeons. Advanced Trauma Life Support (ATLS) 10th Edition; European Resuscitation Council Guidelines 2021.',
    keywords: ['abcde', 'via aerea', 'reanimacion', 'choque', 'trauma', 'critico', 'paro'],
    summary:
      'Secuencia jerárquica obligatoria para identificar y tratar amenazas vitales inmediatas en orden de letalidad, reevaluando tras cada intervención.',
    sections: [
      {
        subtitle: 'Secuencia Operativa Paso a Paso',
        certaintyTier: 'guia_clinica',
        items: [
          'A (Airway / Vía Aérea): Permeabilidad, estridor, edema laríngeo, secreciones y protección cervical si hay trauma. Glasgow ≤ 8 exige considerar intubación orotraqueal.',
          'B (Breathing / Ventilación): Frecuencia respiratoria, trabajo respiratorio, simetría torácica, auscultación y SpO₂. Administrar O₂ suplementario si SpO₂ < 94% (meta 88–92% en EPOC retenedor de CO₂).',
          'C (Circulation / Circulación): PA, PAM (meta habitual ≥ 65 mmHg), FC, llenado capilar (>2 s = hipoperfusión), accesos venosos gruesos, lactato y reposición con cristaloides balanceados según respuesta.',
          'D (Disability / Déficit Neurológico): Escala de Glasgow, pupilas (tamaño y reactividad), signos meníngeos y glucemia capilar inmediata en todo deterioro neurológico.',
          'E (Exposure / Exposición): Búsqueda dirigida de petequias, urticaria, vesículas, Nikolsky, trauma oculto y control térmico evitando hipotermia.',
        ],
      },
    ],
    safetyRule: 'Nunca pasar al siguiente eslabón sin corregir una amenaza inmediata en A, B o C.',
    versionHistory: [
      {
        version: 'ATLS 10.ª Ed. · ERC 2021',
        publishedAt: '2018-01-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Incorporación al repositorio versionado con gradación explícita de certeza y meta de SpO₂ diferenciada en EPOC.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'sepsis-bundle',
    kind: 'guia_clinica',
    category: 'urgencias',
    title: 'Sepsis y Choque Séptico: Criterios, Tamizaje y Paquete de la Primera Hora',
    source: 'Surviving Sepsis Campaign (SSC 2021)',
    institution: 'NIH',
    publishedDate: '2021-10-02',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'SSC 2021 (Sepsis-3)',
    regionOrCountry: 'Global / Adaptable a UCI y Urgencias',
    validityStatus: 'con_discrepancia',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Recomendación fuerte (antimicrobianos/noradrenalina); recomendación débil (30 mL/kg en SSC 2021)',
    bibliographicReference:
      'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock, 2021.',
    verificationDisclaimer:
      'La elección empírica de antimicrobianos debe ajustarse al mapa microbiológico local y guías hospitalarias o del MINSA.',
    keywords: ['sepsis', 'choque septico', 'qsofa', 'sofa', 'lactato', 'noradrenalina', 'bacteriemia'],
    summary:
      'Disfunción orgánica potencialmente mortal causada por una respuesta desregulada del huésped a la infección (incremento agudo de ≥ 2 puntos en la escala SOFA).',
    sections: [
      {
        subtitle: 'Paquete Terapéutico de la 1.ª Hora (Hour-1 Bundle)',
        certaintyTier: 'guia_clinica',
        items: [
          'Medir lactato sérico basal y repetir a las 2–4 horas si el inicial es > 2.0 mmol/L.',
          'Obtener 2 sets de hemocultivos (aerobio/anaerobio) ANTES de iniciar antibióticos, sin retrasar su administración > 45 minutos.',
          'Iniciar antimicrobianos intravenosos de amplio espectro lo antes posible (idealmente < 1 hora en choque séptico).',
          'Administrar cristaloides balanceados o isotónicos en hipoperfusión inducida por sepsis (guía sugiere 30 mL/kg IV en las primeras 3 h, reevaluando respuesta dinámica para evitar sobrecarga).',
          'Iniciar vasopresor de primera línea (Noradrenalina) si persiste hipotensión para mantener PAM ≥ 65 mmHg.',
        ],
      },
    ],
    table: {
      headers: ['Herramienta', 'Variables Evaluadas', 'Umbral e Interpretación'],
      rows: [
        ['qSOFA', 'FR ≥ 22 rpm · Alteración mental · PAS ≤ 100 mmHg', '≥ 2 criterios → alta especificidad pronóstica, baja sensibilidad de tamizaje'],
        ['Choque Séptico', 'Sepsis + necesidad de vasopresores para PAM ≥ 65 + Lactato > 2 mmol/L', 'Mortalidad hospitalaria elevada (> 40% en series clásicas)'],
      ],
    },
    discrepancies: [
      {
        topic: 'Uso de qSOFA como herramienta única de tamizaje de sepsis',
        guidelineA: {
          source: 'Consenso Sepsis-3 (2016)',
          version: 'Sepsis-3 (2016)',
          position: 'Introdujo qSOFA (≥ 2 criterios) fuera de UCI para identificar sospecha de sepsis con peor pronóstico.',
        },
        guidelineB: {
          source: 'Surviving Sepsis Campaign (SSC)',
          version: 'SSC 2021',
          position: 'Recomienda EN CONTRA de usar qSOFA como herramienta única de tamizaje frente a SIRS, NEWS o MEWS debido a su baja sensibilidad.',
        },
        clinicalExplanation:
          'qSOFA predice mortalidad cuando el deterioro ya es evidente, pero puede pasar por alto sepsis temprana; por ello SSC 2021 prefiere SIRS o NEWS2 para detección precoz y reserva qSOFA como señal de alarma.',
        localAdaptationNote: 'En hospitales con recursos limitados (incluyendo red asistencial en Nicaragua/Latinoamérica), la evaluación clínica seriada de signos vitales + SIRS/qSOFA sigue siendo clave al no contar siempre con lactato inmediato.',
      },
    ],
    examPearl: 'La Noradrenalina es el vasopresor de elección inicial sobre Dopamina (menor riesgo de arritmias).',
    versionHistory: [
      {
        version: 'SSC 2016',
        publishedAt: '2016-02-23',
        verifiedAt: '2024-01-10',
        summaryOfChanges: 'Definición Sepsis-3 e introducción de qSOFA; recomendación fuerte de 30 mL/kg.',
        supersededRecommendation: 'qSOFA como tamizaje único y criterio SIRS exclusivo para definir sepsis.',
      },
      {
        version: 'SSC 2021 (Sepsis-3)',
        publishedAt: '2021-10-02',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Se desaconseja qSOFA como tamizaje único (baja sensibilidad) y 30 mL/kg pasa a recomendación condicional/débil guiada por reevaluación dinámica.',
        supersededRecommendation: 'Tamizaje único basado en qSOFA.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'anafilaxia-wao',
    kind: 'guia_clinica',
    category: 'urgencias',
    title: 'Anafilaxia Grave y Choque Anafiláctico',
    source: 'World Allergy Organization (WAO 2020) / EAACI',
    institution: 'OMS',
    publishedDate: '2020-10-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'WAO 2020 / EAACI 2021',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Estándar vital universal (eficacia clínica demostrada frente a edema laríngeo y vasodilatación)',
    bibliographicReference:
      'World Allergy Organization (WAO) Anaphylaxis Guidance 2020; European Academy of Allergy and Clinical Immunology (EAACI) Anaphylaxis Guideline 2021.',
    keywords: ['anafilaxia', 'adrenalina', 'epinefrina', 'choque anafilactico', 'alergia', 'angioedema'],
    summary:
      'Reacción de hipersensibilidad sistémica aguda potencialmente mortal de inicio en minutos a pocas horas tras exposición al alérgeno.',
    sections: [
      {
        subtitle: 'Manejo Farmacológico y Postural de Emergencia',
        certaintyTier: 'evidencia_establecida',
        items: [
          'Primera línea absoluta e irreemplazable: Adrenalina (Epinefrina) 1:1,000 (1 mg/mL) a 0.01 mg/kg (máx. 0.5 mg en adultos; 0.3 mg en niños/escolares) por vía INTRAMUSCULAR en cara anterolateral del muslo.',
          'Repetir adrenalina IM cada 5–15 minutos si no hay mejoría hemodinámica o respiratoria.',
          'Posición en decúbito supino con extremidades inferiores elevadas (o semisentado solo si hay disnea grave sin hipotensión).',
          'Bolo rápido de cristaloide IV (1,000–2,000 mL en adultos; 20 mL/kg en pediatría) y oxígeno de alto flujo.',
          'Antihistamínicos y corticoides son EXCLUSIVAMENTE coadyuvantes de segunda línea; nunca reemplazan ni retrasan la adrenalina IM.',
        ],
      },
    ],
    safetyRule:
      'ERROR CRÍTICO: Aplicar solo corticoides/antihistamínicos sin Adrenalina IM, o poner de pie al paciente en choque anafiláctico (riesgo de síndrome del ventrículo vacío y paro súbito).',
    versionHistory: [
      {
        version: 'WAO 2020 / EAACI 2021',
        publishedAt: '2020-10-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Ratifica adrenalina IM en muslo anterolateral como única terapia de primera línea y desplaza antihistamínicos/corticoides a tercera/segunda línea sintomática.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'glasgow-scale',
    kind: 'protocolo_terapeutico',
    category: 'urgencias',
    title: 'Escala de Coma de Glasgow (GCS) e Implicaciones Clínicas',
    source: 'Brain Trauma Foundation / ATLS',
    institution: 'NIH',
    publishedDate: '2016-09-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'GCS Estandarizada (Adultos / >5 años)',
    regionOrCountry: 'Global (Población: adultos y niños mayores; en lactantes usar GCS pediátrica)',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Instrumento clínico validado en trauma craneoencefálico y deterioro agudo de conciencia',
    bibliographicReference:
      'Brain Trauma Foundation Guidelines for the Management of Severe Traumatic Brain Injury; ATLS 10th Edition.',
    verificationDisclaimer:
      'En menores de 2–5 años debe emplearse la versión pediátrica modificada de respuesta verbal (sonrisa social, llanto consolable), nunca la escala verbal de adulto sin ajuste.',
    keywords: ['glasgow', 'coma', 'tce', 'neurologico', 'conciencia', 'intubacion'],
    summary: 'Evaluación estandarizada del estado de alerta de 3 a 15 puntos según respuesta ocular, verbal y motora.',
    table: {
      headers: ['Puntaje', 'Respuesta Ocular (1–4)', 'Respuesta Verbal (1–5)', 'Respuesta Motora (1–6)'],
      rows: [
        ['6', '—', '—', 'Obedece órdenes'],
        ['5', '—', 'Orientado y conversa', 'Localiza el estímulo doloroso'],
        ['4', 'Espontánea', 'Desorientado / confuso', 'Retirada normal al dolor'],
        ['3', 'Al estímulo verbal', 'Palabras inapropiadas', 'Flexión anormal (decorticación)'],
        ['2', 'Al estímulo doloroso', 'Sonidos incomprensibles', 'Extensión anormal (descerebración)'],
        ['1', 'Ninguna apertura ocular', 'Sin respuesta verbal', 'Sin respuesta motora (flacidez)'],
      ],
    },
    sections: [
      {
        subtitle: 'Clasificación del Compromiso Neurológico',
        items: [
          'Leve: 13–15 puntos · Moderado: 9–12 puntos · Grave / Coma: ≤ 8 puntos (indicación estándar de valorar protección definitiva de vía aérea).',
        ],
      },
    ],
    versionHistory: [
      {
        version: 'GCS Estandarizada',
        publishedAt: '2016-09-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Se añade restricción explícita de población validada (adultos y niños mayores; usar variante pediátrica en lactantes).',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'iamcest-killip',
    kind: 'guia_clinica',
    category: 'cardio_neumo',
    title: 'Síndrome Coronario Agudo con Elevación del ST (IAMCEST) y Killip-Kimball',
    source: 'ESC Guidelines 2023 / AHA-ACC',
    institution: 'ESC',
    publishedDate: '2023-08-25',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ESC ACS 2023',
    regionOrCountry: 'Europa / Global (adaptable según disponibilidad de ICP vs fibrinólisis)',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Clase I, Nivel A (reperfusión inmediata y antiagregación dual)',
    bibliographicReference:
      '2023 ESC Guidelines for the management of acute coronary syndromes. European Heart Journal, 2023.',
    keywords: ['infarto', 'iamcest', 'scacest', 'ecg', 'killip', 'aspirina', 'fibrinolisis', 'angioplastia'],
    summary:
      'Oclusión trombótica aguda total de una arteria coronaria epicárdica que exige reperfusión inmediata ("el tiempo es miocardio").',
    sections: [
      {
        subtitle: 'Criterios ECG y Localización Topográfica',
        certaintyTier: 'evidencia_establecida',
        items: [
          'Supradesnivel del punto J en ≥ 2 derivaciones contiguas: ≥ 2 mm en V2–V3 (hombres ≥ 40 años; ≥ 2.5 mm en < 40 años; ≥ 1.5 mm en mujeres) y ≥ 1 mm en las demás derivaciones.',
          'Cara Anterior / Septal (Arteria Descendente Anterior): V1–V4. Lateral: I, aVL, V5–V6. Inferior (Coronaria Derecha o Circunfleja): II, III, aVF.',
          'Terapia inicial: ECG en < 10 min, Aspirina 150–300 mg masticada + inhibidor P2Y12 + Anticoagulación + Reperfusión urgente (ICP primaria < 90–120 min o fibrinólisis < 30 min si no hay hemodinamia disponible).',
        ],
      },
    ],
    table: {
      headers: ['Clase Killip', 'Hallazgos a la Exploración Física', 'Riesgo Pronóstico Clásico'],
      rows: [
        ['Clase I', 'Sin signos de falla cardíaca ni estertores ni R3', 'Menor mortalidad intrahospitalaria'],
        ['Clase II', 'Estertores crepitantes en < 50% de campos pulmonares, R3 o ingurgitación yugular', 'Riesgo intermedio'],
        ['Clase III', 'Edema agudo de pulmón franco (estertores en > 50% de campos)', 'Riesgo alto'],
        ['Clase IV', 'Choque cardiogénico (PAS < 90 mmHg + signos de hipoperfusión periférica/oliguria)', 'Mortalidad muy elevada'],
      ],
    },
    safetyRule:
      'En infarto de cara inferior (II, III, aVF) obtener derivaciones derechas (V3R, V4R); si hay extensión al ventrículo derecho están contraindicados Nitroglicerina y Morfina por riesgo de colapso de precarga.',
    versionHistory: [
      {
        version: 'ESC ACS 2023',
        publishedAt: '2023-08-25',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Unificación de guías SCACEST y SCASEST bajo la guía ESC 2023 de Síndromes Coronarios Agudos.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'hta-esc-vs-aha-discrepancia',
    kind: 'guia_clinica',
    category: 'cardio_neumo',
    title: 'Hipertensión Arterial: Comparativa y Discrepancias ESC 2024 vs. ACC/AHA 2017',
    source: 'ESC 2024 / ACC-AHA 2017 / OMS 2021',
    institution: 'ESC',
    publishedDate: '2024-08-30',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ESC HTA 2024 vs ACC/AHA 2017',
    regionOrCountry: 'Europa (ESC) / EE. UU. (ACC/AHA) / Latinoamérica (OPS-HEARTS)',
    validityStatus: 'con_discrepancia',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Clase I, Nivel A en metas terapéuticas cuando existe riesgo CV; umbral diagnóstico divergente',
    bibliographicReference:
      '2024 ESC Guidelines for the management of elevated blood pressure and hypertension; ACC/AHA Guideline for High Blood Pressure in Adults; OMS/OPS HEARTS en las Américas.',
    keywords: ['hipertension', 'hta', 'esc 2024', 'aha', 'hearts', 'presion arterial', 'discrepancia'],
    summary:
      'Análisis explícito de las diferencias entre las guías europeas (ESC 2024), estadounidenses (ACC/AHA) y el enfoque programático OPS/HEARTS utilizado en atención primaria latinoamericana.',
    sections: [
      {
        subtitle: 'Principios Compartidos vs. Puntos de Divergencia',
        certaintyTier: 'guia_clinica',
        items: [
          'Consenso general: Confirmar diagnóstico fuera de consulta (MAPA o AMPA) cuando sea factible y calcular riesgo cardiovascular global antes de intensificar tratamiento farmacológico en estadios limítrofes.',
          'Combinación inicial en un solo comprimido (IECA o ARA-II + Calcioantagonista dihidropiridínico o Tiazida/tiazídico) recomendada en la mayoría de pacientes hipertensos.',
          'Nunca combinar IECA + ARA-II por aumento demostrado de hiperkalemia e injuria renal sin beneficio cardiovascular adicional.',
        ],
      },
    ],
    table: {
      headers: ['Aspecto Clínico', 'ESC 2024 (Europa)', 'ACC/AHA (EE. UU.)', 'OPS HEARTS / OMS'],
      rows: [
        ['Umbral diagnóstico de HTA', '≥ 140/90 mmHg (crea categoría "PA elevada" 120–139 / 70–89)', '≥ 130/80 mmHg (Estadio 1: 130–139 / 80–89)', '≥ 140/90 mmHg (≥ 130/80 en alto riesgo CV/DM/ERC)'],
        ['Inicio de fármacos en 130–139/80–89', 'Solo tras 3 meses de estilo de vida si riesgo CV ≥ 10% o comorbilidad de alto riesgo', 'Si ECV clínica o riesgo ASCVD a 10 años ≥ 10%', 'Prioriza tratamiento inmediato en ≥ 140/90 o ≥ 130 en muy alto riesgo'],
        ['Meta de PAS tratada', '120–129 mmHg si se tolera (principio ALARA en frágiles)', '< 130/80 mmHg en la mayoría de adultos', '< 140/90 mmHg general; < 130/80 mmHg en alto riesgo'],
      ],
    },
    discrepancies: [
      {
        topic: 'Definición diagnóstica de Hipertensión (130/80 vs 140/90 mmHg)',
        guidelineA: {
          source: 'ACC / AHA',
          version: '2017 (vigente en EE. UU.)',
          position: 'Clasifica ≥ 130/80 mmHg como Hipertensión Estadio 1.',
        },
        guidelineB: {
          source: 'ESC 2024 / OMS-OPS',
          version: 'ESC 2024 · OMS 2021',
          position: 'Mantiene ≥ 140/90 mmHg como umbral de Hipertensión; ESC 2024 agrupa 120–139/70–89 como "Presión Arterial Elevada".',
        },
        clinicalExplanation:
          'Ambos consensos reconocen que el riesgo vascular aumenta de forma continua desde 115/75 mmHg, pero ESC y OMS evitan etiquetar como "hipertensos" a adultos de bajo riesgo para prevenir sobremedicalización en sistemas de salud con recursos finitos.',
        localAdaptationNote:
          'En Nicaragua y Latinoamérica, la iniciativa OPS/HEARTS emplea protocolos estandarizados orientados a adherencia y disponibilidad del cuadro básico (Amlodipino, Enalapril/Losartán, Hidroclorotiazida/Clortalidona).',
      },
    ],
    safetyRule: 'No bajar la presión arterial bruscamente en pacientes asintomáticos con cifras altas sin daño agudo a órgano blanco (urgencia vs emergencia hipertensiva).',
    versionHistory: [
      {
        version: 'ESC HTA 2024 vs ACC/AHA 2017',
        publishedAt: '2024-08-30',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Actualización a ESC 2024 (nueva categoría de PA elevada y meta 120–129 mmHg si tolerada) contrastada con ACC/AHA y OPS HEARTS.',
        supersededRecommendation: 'Clasificación antigua ESC 2018 de "PA Normal" y "Normal-Alta" reemplazada por "No elevada" y "Elevada" en ESC 2024.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'tep-wells',
    kind: 'guia_clinica',
    category: 'cardio_neumo',
    title: 'Tromboembolia Pulmonar (TEP): Regla de Wells y Abordaje Diagnóstico',
    source: 'ESC Guidelines for Acute Pulmonary Embolism',
    institution: 'ESC',
    publishedDate: '2019-08-31',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ESC TEP 2019',
    regionOrCountry: 'Europa / Global',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Clase I, Nivel A (estrategia secuencial probabilidad clínica + Dímero D / Angio-TAC)',
    bibliographicReference:
      '2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism. European Heart Journal, 2019.',
    keywords: ['tep', 'tromboembolia pulmonar', 'wells', 'dimero d', 'anticoagulacion', 'tvp'],
    summary:
      'Obstrucción de la circulación arterial pulmonar por émbolos procedentes habitualmente de trombosis venosa profunda (TVP) iliofemoral.',
    table: {
      headers: ['Criterio Clínico de Wells (Original)', 'Puntaje'],
      rows: [
        ['Signos y síntomas clínicos de TVP (edema asimétrico y dolor a la palpación)', '+3.0'],
        ['Diagnóstico alternativo menos probable que TEP', '+3.0'],
        ['Frecuencia cardíaca > 100 lpm', '+1.5'],
        ['Inmovilización ≥ 3 días o cirugía en las últimas 4 semanas', '+1.5'],
        ['Antecedente previo de TVP o TEP objetivado', '+1.5'],
        ['Hemoptisis', '+1.0'],
        ['Cáncer activo (en tratamiento o en los últimos 6 meses)', '+1.0'],
      ],
    },
    sections: [
      {
        subtitle: 'Algoritmo de Decisión Según Probabilidad',
        certaintyTier: 'guia_clinica',
        items: [
          'Wells ≤ 4 (TEP improbable): Solicitar Dímero D cuantitativo. Si es negativo (< 500 ng/mL o ajustado a edad: edad × 10 en > 50 años), descarta TEP de forma segura.',
          'Wells > 4 (TEP probable) o Dímero D elevado: Realizar Angio-TAC de arterias pulmonares e iniciar anticoagulación (HBPM / HNF) de inmediato salvo sangrado activo.',
          'Signos ECG frecuentes: Taquicardia sinusal (el más común), inversión de onda T en V1–V4 y patrón clásico S1Q3T3 (específico pero poco sensible).',
        ],
      },
    ],
    versionHistory: [
      {
        version: 'ESC TEP 2019',
        publishedAt: '2019-08-31',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Validación de punto de corte de Dímero D ajustado por edad (> 50 años: edad × 10 ng/mL) y criterios YEARS.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'curb65-nac',
    kind: 'guia_clinica',
    category: 'cardio_neumo',
    title: 'Neumonía Adquirida en la Comunidad (NAC) y Escala CURB-65',
    source: 'IDSA-ATS 2019 / NICE NG191 / BTS',
    institution: 'IDSA',
    publishedDate: '2019-10-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ATS/IDSA 2019 · NICE NG191',
    regionOrCountry: 'Global (Población: adultos inmunocompetentes; NO aplica en pediatría)',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Recomendación fuerte basada en validación pronóstica multicéntrica',
    bibliographicReference:
      'Metlay JP, Waterer GW, et al. ATS/IDSA Clinical Practice Guideline on Community-acquired Pneumonia in Adults, 2019; NICE Guideline NG191.',
    verificationDisclaimer:
      'CURB-65 NO está validada en población pediátrica ni sustituye el juicio clínico cuando existe hipoxemia grave o sepsis en jóvenes.',
    keywords: ['neumonia', 'nac', 'curb65', 'curb-65', 'antibiotico', 'respiratorio'],
    summary:
      'Estratificación de gravedad en adultos para definir manejo ambulatorio, hospitalización en sala general o ingreso a UCI.',
    table: {
      headers: ['Sigla', 'Criterio Clínico o Bioquímico', 'Puntos'],
      rows: [
        ['C', 'Confusión mental de nueva aparición (desorientación en tiempo, lugar o persona)', '1 pt'],
        ['U', 'Urea > 42 mg/dL (7 mmol/L) o BUN > 19–20 mg/dL', '1 pt'],
        ['R', 'Frecuencia Respiratoria ≥ 30 respiraciones/minuto', '1 pt'],
        ['B', 'Blood Pressure: PAS < 90 mmHg o PAD ≤ 60 mmHg', '1 pt'],
        ['65', 'Edad ≥ 65 años', '1 pt'],
      ],
    },
    sections: [
      {
        subtitle: 'Conducta Terapéutica según Puntaje',
        items: [
          '0–1 punto: Manejo ambulatorio salvo hipoxemia, derrame o imposibilidad de vía oral (Amoxicilina o Doxiciclina según comorbilidades).',
          '2 puntos: Hospitalización en sala o vigilancia hospitalaria estrecha.',
          '3–5 puntos: Neumonía grave; ingreso hospitalario urgente y valorar UCI. Esquema estándar: Betalactámico IV (Ceftriaxona o Ampicilina/Sulbactam) + Macrólido (Azitromicina) o Fluoroquinolona respiratoria cuando proceda.',
        ],
      },
    ],
    versionHistory: [
      {
        version: 'ATS/IDSA 2019 · NICE NG191',
        publishedAt: '2019-10-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Se enfatiza restricción poblacional (solo adultos) y uso prudente de fluoroquinolonas por alertas regulatorias.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'gasometria-acidobase',
    kind: 'protocolo_terapeutico',
    category: 'cardio_neumo',
    title: 'Interpretación Sistemática de Gasometría Arterial (GSA) y Ácido-Base',
    source: 'Fisiología Clínica Respiratoria y Renal',
    institution: 'LITERATURA_PEER_REVIEWED',
    publishedDate: '2022-01-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'Estándar Fisiológico Vigente',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Fisiología ácido-base establecida (Ecuación de Henderson-Hasselbalch y Winter)',
    bibliographicReference:
      'Principios estándar de fisiología clínica ácido-base e interpretación gasométrica hospitalaria.',
    keywords: ['gasometria', 'ph', 'paco2', 'bicarbonato', 'anion gap', 'winter', 'lactato'],
    summary:
      'Lectura en 4 pasos para identificar trastorno primario, compensación fisiológica, brecha aniónica y oxigenación arterial.',
    sections: [
      {
        subtitle: 'Método en 4 Pasos Clínicos',
        items: [
          'Paso 1 (pH): < 7.35 = Acidemia | > 7.45 = Alcalemia (valores normales: 7.35–7.45).',
          'Paso 2 (Componente primario): Si pH y PaCO₂ cambian en direcciones opuestas = trastorno respiratorio; si pH y HCO₃⁻ cambian en la misma dirección = trastorno metabólico.',
          'Paso 3 (Compensación - Fórmula de Winter en acidosis metabólica): PaCO₂ esperada = (1.5 × HCO₃⁻) + 8 ± 2 mmHg. Si la PaCO₂ real es mayor a la esperada, coexiste acidosis respiratoria.',
          'Paso 4 (Anion Gap en acidosis metabólica): AG = Na⁺ - (Cl⁻ + HCO₃⁻) [Normal: 8–12 mEq/L]. Anion gap elevado: Lactato, Cetoacidosis, Uremia/Falla renal, Tóxicos.',
        ],
      },
    ],
    table: {
      headers: ['Parámetro', 'Rango Normal', 'Interpretación Clave'],
      rows: [
        ['pH arterial', '7.35 – 7.45', 'Riesgo de disfunción enzimática/arrítmica con pH < 7.20'],
        ['PaCO₂', '35 – 45 mmHg', 'Refleja ventilación alveolar (>45 = hipoventilación/hipercapnia)'],
        ['HCO₃⁻ real', '22 – 26 mEq/L', 'Componente metabólico regulado por riñón'],
        ['PaO₂ / SaO₂', '80–100 mmHg / 95–100%', 'PaO₂ < 60 mmHg (SaO₂ < 90%) = Insuficiencia respiratoria'],
        ['Lactato arterial', '< 2.0 mmol/L', '≥ 2.0–4.0 mmol/L indica metabolismo anaerobio o hipoperfusión'],
      ],
    },
    versionHistory: [
      {
        version: 'Estándar Fisiológico',
        publishedAt: '2022-01-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Validación inicial en la base local de conocimiento.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'dengue-oms',
    kind: 'guia_clinica',
    category: 'infecto_nefro',
    title: 'Dengue y Arbovirosis: Fases, Signos de Alarma y Protocolo OPS / Nicaragua (MINSA)',
    source: 'OMS / OPS Directrices Dengue (2022) / Normativa MINSA Nicaragua',
    institution: 'OPS',
    publishedDate: '2022-06-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'OPS 2022 · Adaptación Nicaragua / Latinoamérica',
    regionOrCountry: 'Nicaragua (MINSA) / Latinoamérica (OPS)',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Recomendación fuerte OPS/OMS (clasificación clínica A, B1, B2, C y manejo hídrico)',
    bibliographicReference:
      'Organización Panamericana de la Salud (OPS/OMS). Directrices para el diagnóstico clínico y el tratamiento del dengue, el chikunguña y el zika. 2022; Lineamientos nacionales de manejo clínico de arbovirosis MINSA Nicaragua.',
    verificationDisclaimer:
      'En zonas endémicas de Centroamérica y Nicaragua, considerar siempre diagnóstico diferencial con Leptospirosis, Malaria y Rickettsiosis según nexo epidemiológico y boletín local vigente.',
    keywords: ['dengue', 'ops', 'minsa', 'nicaragua', 'signos de alarma', 'ns1', 'plaquetas', 'aines'],
    summary:
      'Enfermedad febril bifásica donde la extravasación plasmática ocurre característicamente en la fase crítica al descender la fiebre (días 3 a 7).',
    sections: [
      {
        subtitle: 'Signos de Alarma (Grupo B2 — Hospitalización Inmediata)',
        certaintyTier: 'guia_clinica',
        items: [
          'Dolor abdominal intenso y continuo o dolor a la palpación del abdomen.',
          'Vómitos persistentes (≥ 3 episodios en 1 hora o ≥ 4 en 6 horas).',
          'Acumulación clínica de líquidos (ascitis, derrame pleural o pericárdico).',
          'Sangrado activo de mucosas (gingivorragia, epistaxis, metrorragia, hematemesis/melena).',
          'Letargia, somnolencia o irritabilidad marcada; lipotimia o hipotensión postural.',
          'Hepatomegalia dolorosa > 2 cm por debajo del reborde costal.',
          'Aumento progresivo del hematocrito concomitante con descenso rápido de plaquetas (< 100,000/mm³).',
        ],
      },
      {
        subtitle: 'Esquema de Líquidos en Grupo B2 (OPS / MINSA)',
        certaintyTier: 'guia_clinica',
        items: [
          'Iniciar cristaloide isotónico (Solución Salina 0.9% o Ringer Lactato) a 10 mL/kg en 1 hora; reevaluar hematocrito, signos vitales y diuresis (meta ≥ 0.5 mL/kg/h) para descender progresivamente a 5–7 mL/kg/h y 3–5 mL/kg/h.',
          'Pruebas confirmatorias: Antígeno NS1 (días 1–5) e IgM específica (a partir del día 5–6).',
          'En Nicaragua/Centroamérica: ante síndrome febril icterohemorrágico o antecedente de contacto con agua estancada/roedores, descartar Leptospirosis sin retrasar cobertura si hay sospecha fundada.',
        ],
      },
    ],
    safetyRule:
      'PROHIBIDOS de forma absoluta todos los AINEs (Ibuprofeno, Naproxeno, Diclofenaco, Ketorolaco), Aspirina y corticoides por riesgo de hemorragia digestiva grave y síndrome de Reye. Usar solo Paracetamol y medios físicos.',
    versionHistory: [
      {
        version: 'OPS 2022 · Adaptación Nicaragua / Latinoamérica',
        publishedAt: '2022-06-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Integración de lineamientos OPS 2022 y alerta epidemiológica diferencial centroamericana (Leptospirosis/Malaria).',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'malaria-leptospirosis-nicaragua',
    kind: 'protocolo_terapeutico',
    category: 'infecto_nefro',
    title: 'Síndromes Febriles Endémicos de Latinoamérica y Nicaragua: Malaria y Leptospirosis',
    source: 'OPS / OMS / Normativa Nacional MINSA Nicaragua',
    institution: 'MINSA_NICARAGUA',
    publishedDate: '2023-03-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'OPS 2023 · Contexto Centroamérica / Nicaragua',
    regionOrCountry: 'Nicaragua (MINSA) / Región de las Américas (OPS)',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Normativa epidemiológica regional OMS/OPS y guías nacionales',
    bibliographicReference:
      'OMS/OPS Directrices para el tratamiento de la malaria; Protocolos de vigilancia y abordaje de Leptospirosis en las Américas (OPS / MINSA).',
    verificationDisclaimer:
      'Los esquemas antimaláricos específicos (Cloroquina/Primaquina en P. vivax sensible vs. ACT en P. falciparum o resistencia regional) deben confirmarse con la normativa nacional MINSA vigente del área geográfica exacta.',
    keywords: ['malaria', 'paludismo', 'leptospirosis', 'nicaragua', 'minsa', 'ops', 'fiebre', 'gota gruesa'],
    summary:
      'Abordaje diferencial del síndrome febril agudo tropical en regiones endémicas de Nicaragua y Centroamérica para evitar retrasos mortales en malaria grave o leptospirosis Weil.',
    sections: [
      {
        subtitle: 'Claves Diagnósticas Diferenciales',
        certaintyTier: 'guia_clinica',
        items: [
          'Malaria (P. vivax / P. falciparum): Paroxismos febriles con escalofríos y sudoración, anemia, esplenomegalia, trombocitopenia y antecedente de residencia/viaje a zonas endémicas (ej. Costa Caribe). Diagnóstico obligado: Gota gruesa / extendido periférico y prueba rápida (PDR).',
          'Signos de Malaria Grave: Alteración de conciencia (malaria cerebral), hipoglucemia, acidosis, creatinina elevada, hiperparasitemia o choque → Artesunato IV urgente en hospital.',
          'Leptospirosis: Fiebre de inicio súbito, mialgias intensas en pantorrillas/lumbar, sufusión conjuntival sin pus tras lluvias o inundaciones; forma grave (Síndrome de Weil) cursa con ictericia rubínica, falla renal y hemorragia pulmonar.',
        ],
      },
      {
        subtitle: 'Tratamiento Inicial Orientado por Evidencia',
        certaintyTier: 'guia_clinica',
        items: [
          'Leptospirosis leve: Doxiciclina 100 mg VO cada 12 h por 7 días (en gestantes o menores de 8 años: Amoxicilina o Azitromicina según guía).',
          'Leptospirosis moderada-grave / Weil: Penicilina G sódica IV o Ceftriaxona IV + soporte renal y respiratorio inmediato.',
          'Malaria no complicada / complicada: Confirmar especie antes o simultáneo al inicio; verificar sensibilidad regional (Cloroquina + Primaquina vs Arteméter-Lumefantrina / Artesunato IV) y descartar deficiencia de G6PD antes de Primaquina cuando corresponda.',
        ],
      },
    ],
    safetyRule:
      'No iniciar tratamiento empírico prolongado con AINEs en fiebre tropical indiferenciada antes de descartar Dengue ni omitir gota gruesa en viajeros o residentes de áreas endémicas.',
    versionHistory: [
      {
        version: 'OPS 2023 · Contexto Centroamérica / Nicaragua',
        publishedAt: '2023-03-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Incorporación dedicada de protocolo diferencial regional OPS / Nicaragua para síndromes febriles tropicales.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'meningitis-idSA',
    kind: 'guia_clinica',
    category: 'infecto_nefro',
    title: 'Meningitis Bacteriana Aguda: Criterios de TAC Previa, LCR y Empirismo',
    source: 'IDSA Guidelines / ESCMID Bacterial Meningitis',
    institution: 'IDSA',
    publishedDate: '2016-05-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ESCMID 2016 / IDSA',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Recomendación fuerte (antimicrobianos inmediatos sin demora por neuroimagen)',
    bibliographicReference:
      'ESCMID Guideline: Diagnosis and treatment of acute bacterial meningitis; IDSA Practice Guidelines for the Management of Bacterial Meningitis.',
    keywords: ['meningitis', 'puncion lumbar', 'lcr', 'ceftriaxona', 'vancomicina', 'dexametasona'],
    summary:
      'Emergencia infectológica y neurológica que exige iniciar antibioticoterapia + corticoide adyuvante sin demoras por neuroimagen.',
    sections: [
      {
        subtitle: 'Indicaciones de TAC de Cráneo ANTES de Punción Lumbar',
        items: [
          'Inmunosupresión conocida (VIH, trasplante, quimioterapia) o antecedente de enfermedad del SNC (masa, EVC, infección focal).',
          'Convulsiones de nueva aparición (en la última semana), papiledema, déficit neurológico focal o deterioro del nivel de conciencia.',
          'Si se pospone la PL por la TAC, tomar hemocultivos y administrar de INMEDIATO Dexametasona + Antibióticos empíricos.',
        ],
      },
      {
        subtitle: 'Tratamiento Empírico Inicial (Adultos 18–50 años)',
        items: [
          'Dexametasona 0.15 mg/kg (10 mg IV) cada 6 horas durante 4 días (primera dosis 15–20 min antes o junto al primer antibiótico).',
          'Ceftriaxona 2 g IV cada 12 horas + Vancomicina 15–20 mg/kg IV cada 8–12 horas (+ Ampicilina 2 g IV c/4h si > 50 años o inmunocompromiso por cobertura de Listeria monocytogenes).',
        ],
      },
    ],
    table: {
      headers: ['Tipo de Meningitis', 'Aspecto / Presión', 'Células (/mm³) y Predominio', 'Glucosa (LCR/Plasma)', 'Proteínas'],
      rows: [
        ['Normal', 'Límpido · 7–18 cmH₂O', '0–5 (Mononucleares)', '> 60% (> 45 mg/dL)', '15–45 mg/dL'],
        ['Bacteriana Aguda', 'Turbio / purulento · > 20', '1,000–5,000 (PMN > 80%)', 'Muy baja (< 40% o < 40 mg/dL)', 'Muy altas (> 100–500)'],
        ['Viral (Aséptica)', 'Claro · Normal o ↑ leve', '10–500 (Linfocitos)', 'Normal (> 50–60%)', 'Normales o ↑ leve (< 100)'],
        ['Tuberculosa', 'Xantocrómico · ↑', '50–500 (Linfocitos)', 'Baja (< 45%)', 'Muy altas (100–500)'],
      ],
    },
    versionHistory: [
      {
        version: 'ESCMID 2016 / IDSA',
        publishedAt: '2016-05-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Validación con registro completo de versión y referencias institucionales.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'lra-kdigo-hiperkalemia',
    kind: 'guia_clinica',
    category: 'infecto_nefro',
    title: 'Lesión Renal Aguda (KDIGO), ERC con iSGLT2 e Hiperpotasemia con Riesgo Arrítmico',
    source: 'KDIGO AKI Guideline / KDIGO CKD 2024',
    institution: 'KDIGO',
    publishedDate: '2024-03-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'KDIGO AKI · KDIGO ERC 2024',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Nivel 1A (estabilización cálcica en hiperkalemia y nefroprotección con iSGLT2 en ERC)',
    bibliographicReference:
      'KDIGO Clinical Practice Guideline for Acute Kidney Injury; KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease.',
    keywords: ['kdigo', 'lesion renal', 'hiperkalemia', 'potasio', 'gluconato de calcio', 'isglt2', 'erc'],
    summary:
      'Diagnóstico y estadificación de LRA, manejo de urgencia arrítmica por hiperkalemia e integración de nefroprotección actualizada en ERC (KDIGO 2024).',
    table: {
      headers: ['Estadio KDIGO (LRA)', 'Criterio de Creatinina Sérica', 'Criterio de Diuresis'],
      rows: [
        ['Estadio 1', '↑ 1.5–1.9× respecto a basal o ↑ ≥ 0.3 mg/dL en 48 h', '< 0.5 mL/kg/h durante 6–12 horas'],
        ['Estadio 2', '↑ 2.0–2.9× respecto a basal', '< 0.5 mL/kg/h durante ≥ 12 horas'],
        ['Estadio 3', '↑ ≥ 3.0× basal, Cr ≥ 4.0 mg/dL o inicio de terapia dialítica', '< 0.3 mL/kg/h ≥ 24 h o anuria ≥ 12 h'],
      ],
    },
    sections: [
      {
        subtitle: 'Manejo Urgente de Hiperpotasemia Severa (K⁺ ≥ 6.0 o cambios ECG)',
        certaintyTier: 'evidencia_establecida',
        items: [
          '1. Estabilización de membrana miocárdica (no baja el K⁺, protege del paro): Gluconato de Calcio al 10% (1 g = 10 mL IV en 3–5 min) ante ondas T picudas, PR largo o QRS ancho.',
          '2. Redistribución intracelular (efecto rápido 15–30 min): Insulina regular 10 UI IV + Dextrosa al 50% (50 mL = 25 g glucosa, vigilar hipoglucemia) + Salbutamol nebulizado 10–20 mg.',
          '3. Eliminación corporal y retiro de nefrotóxicos: Suspender IECA/ARA-II/AINEs ("Triple Whammy"), Furosemida si hay respuesta diurética o Hemodiálisis de urgencia (AEIOU).',
        ],
      },
      {
        subtitle: 'Actualización KDIGO ERC 2024: iSGLT2 como Pilar Nefroprotector',
        certaintyTier: 'evidencia_establecida',
        items: [
          'KDIGO 2024 recomienda inhibidores de SGLT2 (Empagliflozina / Dapagliflozina) en pacientes con ERC y TFGe ≥ 20 mL/min/1.73 m² con albuminuria o insuficiencia cardíaca, independientemente de diabetes.',
          'Un descenso inicial leve de la TFGe (< 30%) al iniciar iSGLT2 refleja reducción de hiperfiltración glomerular y NO obliga a suspender el fármaco salvo hipovolemia o LRA progresiva.',
        ],
      },
    ],
    versionHistory: [
      {
        version: 'KDIGO AKI',
        publishedAt: '2012-03-01',
        verifiedAt: '2023-10-01',
        summaryOfChanges: 'Criterios basales de LRA y algoritmo de urgencia en hiperkalemia.',
      },
      {
        version: 'KDIGO AKI · KDIGO ERC 2024',
        publishedAt: '2024-03-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Se incorpora recomendación 1A de KDIGO 2024 sobre iSGLT2 desde TFGe ≥ 20 mL/min/1.73 m².',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'alvarado-apendicitis',
    kind: 'guia_clinica',
    category: 'cirugia_pediatria',
    title: 'Apendicitis Aguda: Escala de Alvarado (MANTRELS) y Semiología',
    source: 'WSES Jerusalem Guidelines / Alvarado Score',
    institution: 'LITERATURA_PEER_REVIEWED',
    publishedDate: '2020-04-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'WSES 2020',
    regionOrCountry: 'Global (Menor especificidad en mujeres en edad fértil y embarazadas)',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Herramienta validada de estratificación; no reemplaza imagen en duda diagnóstica',
    bibliographicReference:
      'WSES Jerusalem guidelines for diagnosis and treatment of acute appendicitis (2020 update).',
    verificationDisclaimer:
      'En mujeres en edad fértil y gestantes debe descartarse patología gineco-obstétrica (embarazo ectópico, torsión ovárica, EPI) mediante β-hCG y ecografía.',
    keywords: ['apendicitis', 'alvarado', 'mantrels', 'blumberg', 'mcburney', 'cirugia'],
    summary: 'Herramienta clínica de 10 puntos para estratificar la probabilidad de apendicitis aguda en dolor de fosa ilíaca derecha.',
    table: {
      headers: ['Letra', 'Criterio Clínico o Paraclínico', 'Puntaje'],
      rows: [
        ['M', 'Migración del dolor (de epigastrio/periumbilical a FID)', '1 pt'],
        ['A', 'Anorexia / hiporexia', '1 pt'],
        ['N', 'Náuseas y/o vómitos', '1 pt'],
        ['T', 'Tenderness (dolor a la palpación en FID / punto de McBurney)', '2 pts'],
        ['R', 'Rebote peritoneal positivo (signo de Blumberg)', '1 pt'],
        ['E', 'Elevación de temperatura (> 37.3°C – 38°C)', '1 pt'],
        ['L', 'Leucocitosis (> 10,000 /mm³)', '2 pts'],
        ['S', 'Shift to the left (neutrofilia > 75%)', '1 pt'],
      ],
    },
    sections: [
      {
        subtitle: 'Conducta Clínica',
        items: [
          '0–3 pts: Baja probabilidad (considerar diagnósticos alternativos).',
          '4–6 pts: Probabilidad intermedia (realizar Ultrasonido o TAC de abdomen).',
          '7–10 pts: Alta probabilidad → Valoración quirúrgica inmediata para apendicectomía + profilaxis antibiótica preoperatoria.',
        ],
      },
    ],
    versionHistory: [
      {
        version: 'WSES 2020',
        publishedAt: '2020-04-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Advertencia explícita sobre limitaciones diagnósticas en población femenina fértil y gestante.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'pancreatitis-atlanta',
    kind: 'recomendacion_obsoleta',
    category: 'cirugia_pediatria',
    title: 'Pancreatitis Aguda (ACG 2024): Hidratación Moderada y Abandono de Terapia Agresiva',
    source: 'ACG Clinical Guideline 2024 / Revised Atlanta Classification',
    institution: 'ACG',
    publishedDate: '2024-03-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ACG 2024',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Evidencia alta de ECA recientes (Ringer Lactato moderado vs hidratación agresiva)',
    bibliographicReference:
      'American College of Gastroenterology (ACG) Clinical Guideline: Management of Acute Pancreatitis, 2024; Revised Atlanta Classification.',
    keywords: ['pancreatitis', 'atlanta', 'ringer lactato', 'lipasa', 'hidratacion agresiva', 'obsoleta'],
    summary:
      'El diagnóstico requiere cumplir ≥ 2 de 3 criterios: dolor típico, Lipasa/Amilasa ≥ 3× LSN, o hallazgos de imagen. La guía 2024 reemplaza la hidratación agresiva histórica por hidratación moderada.',
    sections: [
      {
        subtitle: 'Pilares Actualizados del Tratamiento (ACG 2024)',
        certaintyTier: 'evidencia_establecida',
        items: [
          'Reanimación hídrica MODERADA guiada por metas con Ringer Lactato (preferible a NaCl 0.9%; bolo 10 mL/kg solo si existe hipovolemia, seguido de 1.5 mL/kg/h evitando sobrecarga masiva).',
          'Control del dolor con analgesia escalonada (Paracetamol + opioides titulados según necesidad).',
          'Realimentación oral temprana (dentro de 24–48 h en pancreatitis leve) en cuanto cedan dolor y náuseas; NO prolongar el ayuno innecesariamente.',
          'NO administrar antibióticos profilácticos en pancreatitis edematosa ni en necrosis estéril.',
          'En etiología biliar leve, realizar colecistectomía laparoscópica en el mismo ingreso hospitalario.',
        ],
      },
    ],
    obsoletePracticeAlert: {
      outdatedPractice: 'Hidratación intravenosa agresiva rutinaria (> 250–500 mL/h o 3–4 L en las primeras 24 h sin choque) y ayuno prolongado hasta normalización enzimática.',
      whyObsolete: 'Los ensayos clínicos aleatorizados recientes demostraron que la reposición agresiva aumenta significativamente la sobrecarga de volumen, edema pulmonar e insuficiencia respiratoria sin reducir la necrosis ni la mortalidad.',
      currentStandard: 'Ringer Lactato moderado (1.5 mL/kg/h; bolo de 10 mL/kg únicamente si hay hipovolemia) y realimentación oral precoz según tolerancia.',
      replacedSince: 'ACG 2024 (evidencia publicada en 2022–2024)',
    },
    versionHistory: [
      {
        version: 'ACG 2013',
        publishedAt: '2013-09-01',
        verifiedAt: '2021-01-01',
        summaryOfChanges: 'Recomendaba hidratación temprana agresiva (250–500 mL/h en las primeras 12–24 h).',
        supersededRecommendation: 'Hidratación agresiva rutinaria de 250–500 mL/h.',
      },
      {
        version: 'ACG 2024',
        publishedAt: '2024-03-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Cambio mayor a hidratación moderada (1.5 mL/kg/h) y marca explícitamente como obsoleta la hidratación agresiva rutinaria y el ayuno prolongado.',
        supersededRecommendation: 'Protocolos de infusión rápida indiscriminada en pancreatitis leve/moderada.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'ectopico-acog',
    kind: 'guia_clinica',
    category: 'cirugia_pediatria',
    title: 'Embarazo Ectópico Tubárico: Diagnóstico y Contraindicaciones de Metotrexato',
    source: 'ACOG Practice Bulletin No. 193 / NICE NG126',
    institution: 'ACOG',
    publishedDate: '2018-03-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ACOG PB 193 · NICE NG126',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Recomendación clínica consolidada en urgencias gineco-obstétricas',
    bibliographicReference:
      'ACOG Practice Bulletin No. 193: Tubal Ectopic Pregnancy; NICE Guideline NG126: Ectopic pregnancy and miscarriage.',
    keywords: ['ectopico', 'embarazo', 'metotrexato', 'bhcg', 'kehr', 'hemoperitoneo'],
    summary:
      'Toda mujer en edad fértil con dolor pélvico/abdominal y retraso menstrual o sangrado vaginal debe tener una β-hCG cuantitativa inmediata.',
    sections: [
      {
        subtitle: 'Claves Diagnósticas y Terapéuticas',
        items: [
          'Zona discriminatoria: con β-hCG > 1,500–3,500 mUI/mL y ausencia de saco gestacional intrauterino en ecografía transvaginal, sospechar gestación ectópica hasta demostrar lo contrario.',
          'Signo de Kehr (dolor referido al hombro por irritación frénica) + hipotensión/taquicardia = hemoperitoneo por ruptura tubárica → Laparoscopia/Laparotomía de urgencia inmediata.',
          'Si la paciente es Rh negativo: administrar Inmunoglobulina Anti-D.',
        ],
      },
    ],
    safetyRule:
      'El Metotrexato está ABSOLUTAMENTE CONTRAINDICADO si existe inestabilidad hemodinámica, signos de ruptura o hemoperitoneo, lactancia materna o disfunción hepatorrenal/hematológica.',
    versionHistory: [
      {
        version: 'ACOG PB 193 · NICE NG126',
        publishedAt: '2018-03-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Incorporación con zona discriminatoria conservadora (hasta 3,500 mUI/mL para no interrumpir gestación intrauterina temprana viable).',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'bronquiolitis-aap',
    kind: 'recomendacion_obsoleta',
    category: 'cirugia_pediatria',
    title: 'Bronquiolitis Aguda del Lactante: Soporte vs. Prácticas Obsoletas Sin Evidencia',
    source: 'AAP Clinical Practice Guideline / NICE NG9',
    institution: 'AAP',
    publishedDate: '2021-08-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'AAP / NICE NG9 (act. 2021)',
    regionOrCountry: 'Global (Menores de 24 meses)',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Evidencia A (no uso rutinario de salbutamol, corticoides ni antibióticos)',
    bibliographicReference:
      'American Academy of Pediatrics (AAP) Clinical Practice Guideline: Diagnosis, Management, and Prevention of Bronchiolitis; NICE Guideline NG9.',
    keywords: ['bronquiolitis', 'lactante', 'vsr', 'salbutamol', 'corticoides', 'obsoleta', 'pediatria'],
    summary:
      'Primer episodio agudo de sibilancias y dificultad respiratoria precedido de pródromo catarral en lactantes (< 2 años), causado principalmente por VSR.',
    sections: [
      {
        subtitle: 'Qué SÍ Indicar vs. Qué NO Indicar (Basado en Evidencia)',
        certaintyTier: 'evidencia_establecida',
        items: [
          'SÍ indicado: Oxígeno suplementario húmedo si SpO₂ < 90–92%, aspiración nasal suave antes de las tomas, hidratación fraccionada o IV si taquipnea > 60 rpm o rechazo oral.',
          'NO indicado de rutina: Corticoides sistémicos ni inhalados, antibióticos (salvo coinfección bacteriana demostrada) ni salbutamol/adrenalina de forma sistemática.',
          'Criterios de hospitalización: Edad < 3 meses, prematuridad, SpO₂ < 92%, dificultad respiratoria moderada-grave (tiraje, aleteo nasal), apneas o deshidratación.',
        ],
      },
    ],
    obsoletePracticeAlert: {
      outdatedPractice: 'Nebulizaciones rutinarias con Salbutamol, corticoides sistémicos/inhalados o antibióticos empíricos en bronquiolitis viral típica.',
      whyObsolete: 'Revisiones sistemáticas Cochrane y guías AAP/NICE demuestran que no acortan la estancia hospitalaria ni mejoran la saturación ni evitan la hospitalización en el primer episodio viral.',
      currentStandard: 'Soporte respiratorio (O₂ si SpO₂ < 90–92%), desobstrucción nasal e hidratación.',
      replacedSince: 'Guías AAP / NICE NG9',
    },
    versionHistory: [
      {
        version: 'AAP / NICE NG9',
        publishedAt: '2021-08-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Clasificación explícita de broncodilatadores y corticoides rutinarios en bronquiolitis como prácticas superadas por evidencia establecida.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'cad-ada',
    kind: 'guia_clinica',
    category: 'endocrino_tox_rangos',
    title: 'Cetoacidosis Diabética (CAD): Severidad, Hidratación y Regla del Potasio',
    source: 'American Diabetes Association (ADA Standards of Care 2024)',
    institution: 'ADA',
    publishedDate: '2024-01-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'ADA 2024 / Consenso Crisis Hiperglucémicas 2024',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Consenso internacional ADA/EASD 2024 basado en evidencia clínica',
    bibliographicReference:
      'American Diabetes Association (ADA). Standards of Care in Diabetes—2024; Hyperglycemic Crises in Adult Patients With Diabetes Consensus Report, 2024.',
    keywords: ['cetoacidosis', 'cad', 'diabetes', 'insulina', 'potasio', 'ada 2024', 'glucemia'],
    summary:
      'Emergencia hiperglucémica definida por hiperglucemia (≥ 200 mg/dL en consenso 2024 o antecedente diabético), cetonemia/cetonuria significativa y acidosis metabólica con Anion Gap elevado.',
    table: {
      headers: ['Parámetro', 'CAD Leve', 'CAD Moderada', 'CAD Severa'],
      rows: [
        ['pH arterial/venoso', '7.25 – 7.30', '7.00 – 7.24', '< 7.00'],
        ['HCO₃⁻ sérico (mEq/L)', '15 – 18', '10 – < 15', '< 10'],
        ['Anion Gap (mEq/L)', '> 10–12', '> 12', '> 12'],
        ['Estado Mental', 'Alerta', 'Alerta / Somnoliento', 'Estupor / Coma'],
      ],
    },
    sections: [
      {
        subtitle: 'Secuencia Terapéutica en 3 Ejes',
        certaintyTier: 'evidencia_establecida',
        items: [
          '1. Hidratación IV inicial: NaCl 0.9% o cristaloide balanceado (1,000 mL en la 1.ª hora o 15–20 mL/kg/h; ajustar en pediatría por riesgo de edema cerebral).',
          '2. Potasio ANTES de insulina: Si K⁺ < 3.3–3.5 mEq/L, NO iniciar insulina y reponer potasio primero; si K⁺ 3.5–5.2 mEq/L, añadir 20–30 mEq de KCl a cada litro IV; si K⁺ > 5.2 mEq/L, diferir K⁺ y vigilar cada 2 h.',
          '3. Insulina regular IV continua: 0.1 UI/kg/h. Al descender glucemia a ~200–250 mg/dL, añadir Dextrosa 5% y mantener insulina hasta resolver acidosis (pH > 7.3, HCO₃⁻ ≥ 18, cierre de AG).',
        ],
      },
    ],
    safetyRule:
      'NUNCA iniciar insulina con K⁺ < 3.3 mEq/L (riesgo de hipokalemia crítica y fibrilación ventricular). En pediatría evitar bolos rápidos excesivos y bicarbonato salvo indicaciones excepcionales.',
    versionHistory: [
      {
        version: 'ADA 2024',
        publishedAt: '2024-01-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Actualización con umbral de glucemia ≥ 200 mg/dL en el consenso 2024 de crisis hiperglucémicas (considerando CAD euglucémica por iSGLT2).',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'alertas-seguridad-farmacos-fda-ema',
    kind: 'alerta_farmacologica',
    category: 'endocrino_tox_rangos',
    title: 'Alertas Regulatorias Farmacológicas: Fluoroquinolonas y Metamizol (FDA / EMA / OPS)',
    source: 'FDA / EMA PRAC / OMS / OPS',
    institution: 'FDA_EMA',
    publishedDate: '2024-09-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'EMA 2024 · FDA Boxed Warnings',
    regionOrCountry: 'Comparativa Regulatoria: EE. UU. (FDA) / Europa (EMA) / Nicaragua-LATAM (OPS)',
    validityStatus: 'con_discrepancia',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Alertas oficiales de farmacovigilancia poscomercialización',
    bibliographicReference:
      'U.S. FDA Drug Safety Communications (Fluoroquinolones); European Medicines Agency (EMA) PRAC Safety Reviews on Fluoroquinolones and Metamizole (2024).',
    verificationDisclaimer:
      'La disponibilidad comercial y restricciones de cada fármaco varían según país; verifique siempre el registro sanitario y ficha técnica nacional vigente.',
    keywords: ['fluoroquinolonas', 'ciprofloxacino', 'levofloxacino', 'metamizol', 'dipirona', 'fda', 'ema', 'seguridad'],
    summary:
      'Registro de advertencias regulatorias graves y diferencias normativas reales entre agencias internacionales para evitar prescripción riesgosa o confusión regional.',
    sections: [
      {
        subtitle: 'Fluoroquinolonas Sistémicas (Ciprofloxacino, Levofloxacino, Moxifloxacino)',
        certaintyTier: 'evidencia_establecida',
        items: [
          'Restricción FDA y EMA: NO usar como primera línea en cistitis aguda no complicada, bronquitis aguda ni sinusitis bacteriana aguda si existen alternativas más seguras.',
          'Reacciones adversas graves e incapacitantes descritas: tendinitis y rotura del tendón de Aquiles (potenciada por corticoides y edad avanzada), neuropatía periférica potencialmente irreversible, alteraciones psiquiátricas/SNC, prolongación de QT y riesgo aumentado de aneurisma/disección aórtica en población predisponente.',
        ],
      },
      {
        subtitle: 'Metamizol (Dipirona): Diferencia Regulatoria Explicada',
        certaintyTier: 'guia_clinica',
        items: [
          'América Latina (incluyendo cuadro básico en Nicaragua) y varios países europeos mantienen metamizol para dolor agudo intenso o fiebre refractaria bajo prescripción, con vigilancia estricta.',
          'FDA (EE. UU.) no autoriza su comercialización por riesgo histórico de agranulocitosis idiosincrática.',
          'EMA (2024) mantuvo su autorización en indicaciones específicas pero reforzó medidas para detección temprana de agranulocitosis (fiebre persistente, odinofagia, úlceras orales → suspender e indicar hemograma urgente).',
        ],
      },
    ],
    drugSafetyUpdate: {
      genericName: 'Fluoroquinolonas / Metamizol',
      changeType: 'alerta_seguridad',
      regulatorySource: 'FDA & EMA PRAC 2024',
      clinicalImpact: 'Restricción de fluoroquinolonas en infecciones leves; vigilancia activa de agranulocitosis con metamizol donde esté autorizado.',
      doseVerificationNote: 'Ajustar fluoroquinolonas obligatoriamente según aclaramiento de creatinina y evitar en embarazo y pediatría salvo indicación excepcional sin alternativa.',
    },
    discrepancies: [
      {
        topic: 'Uso clínico de Metamizol (Dipirona)',
        guidelineA: {
          source: 'FDA (EE. UU.)',
          version: 'Vigente',
          position: 'Retirado / no comercializado por riesgo de agranulocitosis.',
        },
        guidelineB: {
          source: 'EMA (Europa) / Cuadros Básicos LATAM-OPS',
          version: 'EMA PRAC 2024',
          position: 'Autorizado bajo prescripción en indicaciones específicas con advertencia activa sobre síntomas de neutropenia/agranulocitosis.',
        },
        clinicalExplanation:
          'Refleja distintas evaluaciones riesgo-beneficio regulatorias regionales frente a alternativas como AINEs (nefrotoxicidad/sangrado) u opioides.',
      },
    ],
    versionHistory: [
      {
        version: 'EMA 2024 · FDA Boxed Warnings',
        publishedAt: '2024-09-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Incorporación de medidas reforzadas EMA 2024 sobre metamizol y restricciones FDA/EMA de fluoroquinolonas.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'serotonin-ssj',
    kind: 'protocolo_terapeutico',
    category: 'endocrino_tox_rangos',
    title: 'Urgencias Farmacológicas: Síndrome Serotoninérgico y Síndrome de Stevens-Johnson',
    source: 'Criterios de Hunter / BAD Guidelines SJS-TEN',
    institution: 'NICE',
    publishedDate: '2016-06-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'Hunter Criteria · BAD SJS/TEN',
    regionOrCountry: 'Global',
    validityStatus: 'vigente',
    certaintyTier: 'guia_clinica',
    evidenceLevel: 'Criterios diagnósticos validados de toxicidad farmacológica grave',
    bibliographicReference:
      'Hunter Toxicity Criteria for Serotonin Syndrome; British Association of Dermatologists (BAD) Guidelines for SJS/TEN.',
    keywords: ['serotoninergico', 'stevens-johnson', 'ssj', 'net', 'nikolsky', 'clonus', 'reaccion adversa'],
    summary: 'Reacciones farmacológicas graves de inicio agudo o subagudo donde la suspensión inmediata del fármaco causal salva la vida.',
    sections: [
      {
        subtitle: 'Síndrome Serotoninérgico (Criterios de Hunter)',
        items: [
          'Antecedente de fármacos serotoninérgicos (ISRS + Tramadol, Dextrometorfano, Linezolid, IMAO). Inicio rápido (< 24 h).',
          'Hallazgo clave: CLONUS espontáneo, inducible u ocular + hiperreflexia (predominio en miembros inferiores) + diaforesis, agitación, hipertermia e hiperperistaltismo.',
          'Manejo: Suspender agentes causales + Benzodiacepinas IV (Lorazepam/Diazepam) + enfriamiento físico + Ciproheptadina. NO dar Paracetamol ni Haloperidol.',
        ],
      },
      {
        subtitle: 'Síndrome de Stevens-Johnson (SSJ) / NET',
        items: [
          'Inicio 1–3 semanas tras antiepilépticos aromáticos (Carbamazepina, Fenitoína, Lamotrigina), Alopurinol o Sulfas.',
          'Compromiso severo de ≥ 2 mucosas (costras hemorrágicas labiales, conjuntivitis pseudomembranosa, erosiones genitales) + Signo de Nikolsky positivo.',
          'Clasificación por superficie corporal desprendida: < 10% = SSJ · 10–30% = Superposición SSJ/NET · > 30% = NET. Manejo en UCI/Unidad de Quemados + Oftalmología urgente.',
        ],
      },
    ],
    versionHistory: [
      {
        version: 'Hunter · BAD Guidelines',
        publishedAt: '2016-06-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Registro inicial con referencia clínica verificable.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
  {
    id: 'rangos-referencia',
    kind: 'protocolo_terapeutico',
    category: 'endocrino_tox_rangos',
    title: 'Tabla Rápida de Valores de Referencia Hospitalarios (Adultos)',
    source: 'Laboratorio Clínico Estándar Universitario',
    institution: 'LITERATURA_PEER_REVIEWED',
    publishedDate: '2024-01-01',
    lastVerifiedDate: '2026-11-17',
    guideVersion: 'Referencia Base Adultos',
    regionOrCountry: 'Global (Los rangos exactos varían según laboratorio y edad pediátrica)',
    validityStatus: 'vigente',
    certaintyTier: 'evidencia_establecida',
    evidenceLevel: 'Rangos fisiológicos estándar de referencia en adultos',
    bibliographicReference:
      'Intervalos de referencia bioquímicos y hematológicos estándar de laboratorio clínico en adultos.',
    verificationDisclaimer:
      'En pediatría y embarazo los intervalos de referencia (especialmente Hb, fosfatasa alcalina, creatinina y dímero D) difieren; interpretar siempre junto al rango específico del estudio.',
    keywords: ['rangos', 'laboratorio', 'hemograma', 'electrolitos', 'troponina', 'creatinina', 'amilasa'],
    summary: 'Parámetros bioquímicos, hematológicos y de gabinete utilizados para interpretar los estudios complementarios del simulador.',
    table: {
      headers: ['Estudio / Parámetro', 'Rango de Referencia Normal', 'Significado si Alterado'],
      rows: [
        ['Hemograma (BH)', 'Leuc: 4,500–11,000/mm³ · Hb: 12–16 g/dL · Plaq: 150–450 mil', 'Hemoconcentración, anemia, infección, trombocitopenia'],
        ['Química Sanguínea', 'Glucosa: 70–100 · Urea: 15–40 · Cr: 0.6–1.2 mg/dL', 'Hiperglucemia, lesión renal prerrenal o parenquimatosa'],
        ['Electrolitos Séricos', 'Na⁺: 135–145 · K⁺: 3.5–5.1 · Cl⁻: 98–107 · Ca²⁺: 8.5–10.5', 'Hiponatremia, hiperkalemia letal, hipocalcemia'],
        ['Perfil Hepático', 'AST/ALT: < 40 U/L · FA: 40–130 · BT: 0.2–1.2 · Alb: 3.5–5.0', 'Citólisis hepática, colestasis biliar o fuga capilar'],
        ['Reactantes Agudos', 'PCR: < 5.0 mg/L · VSG: < 20 mm/h · Procalcitonina: < 0.25', 'Infección bacteriana invasiva vs inflamación leve'],
        ['Cardíacos / Coagulación', 'hs-TnI: < 0.04 ng/mL · Dímero D: < 500 · INR: 0.9–1.15', 'Necrosis miocárdica, TEP/TVP o coagulopatía'],
        ['Enzimas Pancreáticas', 'Amilasa: 28–100 U/L · Lipasa: 13–60 U/L', 'Elevación ≥ 3× LSN apoya pancreatitis aguda'],
        ['Perfil Tiroideo / β-hCG', 'TSH: 0.4–4.2 mUI/L · T4L: 0.8–1.8 ng/dL · β-hCG: < 5 mUI/mL', 'Descarte endocrino y embarazo / ectópico'],
      ],
    },
    sections: [],
    versionHistory: [
      {
        version: 'Referencia Base Adultos',
        publishedAt: '2024-01-01',
        verifiedAt: '2026-11-17',
        summaryOfChanges: 'Se añade aclaración expresa de variación por edad pediátrica, gestación y método analítico.',
      },
    ],
    isLocalValidated: true,
    origin: 'curated_base',
  },
];
