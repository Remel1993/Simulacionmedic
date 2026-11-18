import { ClinicalCase } from '../types/clinical';

/**
 * Casos de Consulta Externa (Cardiología Ambulatoria y Atención Primaria)
 * enfocados en Bloqueos Auriculoventriculares y Bloqueos de Rama / Fasciculares.
 */
export const OUTPATIENT_CARDIO_BLOCKS_CASES: ClinicalCase[] = [
  {
    id: 'case-cardio-out-bav-1grado',
    mode: 'principiante',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Martha Eugenia Pineda Rosales',
      age: 62,
      sex: 'Femenino',
      occupation: 'Comerciante de abarrotes',
      consultReason: 'Cansancio leve y sensación pasajera de mareo al levantarse desde hace dos semanas',
      evolutionTime: '14 días de evolución',
      currentIllness:
        'Paciente femenina de 62 años con hipertensión arterial crónica en seguimiento en consulta externa. Refiere que hace dos semanas acudió a otra clínica por sensación ocasional de palpitaciones leves y le añadieron un segundo comprimido antihipertensivo sobre su medicación habitual. Desde hace 10 días percibe fatiga fácil al realizar sus labores del hogar y mareo leve transitorio al incorporarse, sin llegar nunca al desmayo. Niega dolor opresivo en el pecho, falta de aire en reposo, edema en piernas o fiebre.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '118/72 mmHg',
      heartRate: 56,
      respiratoryRate: 16,
      temperature: 36.4,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 68,
      heightCm: 160,
    },
    background: {
      pathological: ['Hipertensión arterial sistémica de 9 años de evolución, habitualmente bien controlada.'],
      nonPathological: ['No fuma ni consume alcohol. Dieta baja en sal de forma parcial.'],
      family: ['Madre con hipertensión arterial.'],
      surgical: ['Colecistectomía laparoscópica hace 8 años.'],
      currentMedications: [
        'Metoprolol 50 mg vía oral cada 12 horas (uso crónico).',
        'Diltiazem 60 mg vía oral cada 8 horas (agregado hace 14 días en consulta externa ajena).',
      ],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cv-bav1',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y pulsos periféricos',
        finding:
          'Ruidos cardíacos rítmicos, bradicardia sinusal leve a 56 lpm, R1 y R2 de intensidad constante sin soplos audibles ni frote pericárdico. Pulsos radiales y pedios simétricos de buena amplitud, llenado capilar < 2 segundos, sin ingurgitación yugular.',
        isAbnormal: true,
        semiologyNote:
          'A diferencia del bloqueo AV completo, el R1 mantiene intensidad uniforme y el ritmo permanece regular.',
      },
      {
        id: 'pe-lungs-bav1',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar',
        finding: 'Murmullo vesicular conservado bilateralmente sin estertores crepitantes ni sibilancias.',
        isAbnormal: false,
      },
      {
        id: 'pe-neuro-bav1',
        system: 'Neurológico',
        name: 'Estado de alerta y ortostatismo',
        finding: 'Paciente alerta, orientada (Glasgow 15/15), sin nistagmo ni focalización neurológica.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'ecg-bav1',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones',
        result:
          'Ritmo sinusal regular a 56 lpm, eje eléctrico normal (+45°). Intervalo PR prolongado de forma constante a 260 ms (0.26 s), con conducción AV 1:1 (cada onda P es seguida por un complejo QRS estrecho de 86 ms). Sin ondas P bloqueadas ni alteraciones agudas del segmento ST-T.',
        referenceRange: 'Intervalo PR normal: 120–200 ms',
        interpretation:
          'Bloqueo Auriculoventricular de 1.er Grado (PR prolongado constante a 260 ms) secundario a sinergia frenadora nodal (Metoprolol + Diltiazem).',
        isAbnormal: true,
      },
      {
        id: 'lab-elec-bav1',
        category: 'Laboratorio',
        subcategory: 'Electrolitos',
        name: 'Electrolitos séricos y creatinina',
        result: 'Na⁺: 139 mEq/L | K⁺: 4.3 mEq/L | Cl⁻: 102 mEq/L | Creatinina: 0.86 mg/dL.',
        referenceRange: 'K⁺ 3.5–5.1 mEq/L | Creatinina 0.6–1.1 mg/dL',
        interpretation: 'Electrolitos y función renal normales; descarta hiperkalemia o falla renal que acumule fármacos.',
        isAbnormal: false,
      },
      {
        id: 'lab-tsh-bav1',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil tiroideo (TSH)',
        result: 'TSH: 2.1 mUI/L.',
        referenceRange: '0.4–4.2 mUI/L',
        interpretation: 'Eutiroidismo; descarta hipotiroidismo como causa de bradicardia.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bloqueo Auriculoventricular de 1.er Grado (Fármaco-Inducido / Nodal)',
      differentialDiagnoses: [
        'Bradicardia sinusal fisiológica o por hipotiroidismo',
        'Bloqueo auriculoventricular de 2.º grado Mobitz I (Wenckebach)',
        'Hipotensión ortostática por polifarmacia antihipertensiva',
        'Disfunción del nodo sinusal incipiente',
      ],
      pathophysiology:
        'El retraso uniforme de la conducción a través del nodo auriculoventricular (generalmente suprahisiano) prolonga el intervalo PR por encima de 200 ms sin interrumpir la relación 1:1 entre aurículas y ventrículos. La combinación simultánea de un betabloqueador (metoprolol) con un calcioantagonista no dihidropiridínico (diltiazem) suma sus efectos cronotrópico y dromotrópico negativos sobre el nodo AV.',
      keyClinicalClues: [
        'Inicio de síntomas leves tras añadir diltiazem a un esquema previo con metoprolol',
        'Bradicardia leve regular (56 lpm) hemodinámicamente estable en consulta externa',
        'ECG con intervalo PR constante > 200 ms (260 ms) y conducción 1:1 sin ondas P bloqueadas',
      ],
      characteristicSignsSymptoms: [
        'Asintomático o fatiga/mareo leve sin síncope',
        'Prolongación constante del intervalo PR (>200 ms) con QRS estrecho',
        'Antecedente de combinación betabloqueador + calcioantagonista no dihidropiridínico',
      ],
      criticalRulingOutFactors: [
        'Todas las ondas P conducen un QRS (relación 1:1), lo que descarta bloqueo AV de 2.º o 3.er grado.',
        'Electrolitos y TSH normales descartan hiperpotasemia e hipotiroidismo.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones de consultorio para medir intervalo PR y duración del QRS',
        'Revisión minuciosa de fármacos frenadores del nodo AV (betabloqueadores, diltiazem, verapamilo, digoxina)',
        'Electrolitos séricos, función renal y TSH como estudio básico de bradicardia ambulatoria',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Losartán (o Amlodipino en reemplazo del Diltiazem tras suspender doble bloqueo nodal)',
            dose: '50 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Mantenimiento crónico ambulatorio',
            rationale:
              'Suspender de inmediato Diltiazem para eliminar el doble freno nodal y, en caso de requerir un segundo antihipertensivo junto a dosis ajustada de Metoprolol o monoterapia, utilizar ARA-II o dihidropiridínico sin efecto sobre el nodo AV.',
          },
        ],
        generalMeasures: [
          'Suspender Diltiazem de inmediato (evitar siempre asociar betabloqueador con verapamilo o diltiazem en consulta externa)',
          'Educar a la paciente sobre signos de alarma que ameritan acudir a urgencias (síncope, mareo intenso, disnea o pulso < 45 lpm)',
          'Repetir ECG ambulatorio de control en 1 a 2 semanas tras retirar el calcioantagonista no dihidropiridínico',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia programada a Cardiología solo si el PR persiste > 300 ms o aparecen síntomas tras retirar fármacos frenadores nodales.',
        ],
        followUp: 'Control ambulatorio en 7 a 14 días con toma de presión arterial, frecuencia cardíaca y ECG de verificación.',
      },
      criticalSafetyAlerts: [
        'Nunca prescribir o mantener simultáneamente betabloqueadores junto a diltiazem/verapamilo o digoxina ante bloqueo AV: riesgo de progresión a bloqueo AV avanzado o bradicardia severa.',
        'El BAV de 1.er grado aislado con QRS estrecho y estabilidad hemodinámica NO requiere atropina urgente ni implante de marcapasos definitivo.',
      ],
      guidelineReferences: [
        'ACC/AHA/HRS Guideline on the Evaluation and Management of Patients With Bradycardia and Cardiac Conduction Delay',
        'ESC Guidelines on Cardiac Pacing and Cardiac Resynchronization Therapy',
      ],
    },
    internalPersonaPrompt:
      'Eres Martha Pineda, de 62 años. Desde que hace dos semanas te agregaron una segunda pastilla para la presión sientes algo de cansancio y un ligero mareo al levantarte, aunque nunca te has desmayado ni te duele el pecho.',
  },
  {
    id: 'case-cardio-out-bav-mobitz-1',
    mode: 'medico_general',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Fernando Lizárraga Montes',
      age: 54,
      sex: 'Masculino',
      occupation: 'Profesor de educación física y corredor amateur',
      consultReason: 'Sensación intermitente de pausas o latidos irregulares en el pecho al descansar por la noche',
      evolutionTime: '3 semanas de evolución',
      currentIllness:
        'Paciente masculino de 54 años que acude a consulta externa porque en las últimas 3 semanas ha notado, principalmente por la noche al acostarse, la sensación fugaz de que el corazón "hace una pausa" seguida de un latido un poco más fuerte. Entrena trote ligero 4 días por semana sin fatiga anormal, angina ni falta de aire. Su reloj deportivo registró frecuencias entre 52 y 60 lpm en reposo. Niega desmayos, mareos intensos o ingesta de fármacos cardíacos.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '122/74 mmHg',
      heartRate: 58,
      respiratoryRate: 14,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 77,
      heightCm: 174,
    },
    background: {
      pathological: ['Sin enfermedades crónicas diagnosticadas.'],
      nonPathological: ['Entrena trote 25-30 km semanales desde hace 12 años. No fuma.'],
      family: ['Sin antecedentes familiares de muerte súbita o miocardiopatía.'],
      surgical: ['Apendicectomía en la adolescencia.'],
      currentMedications: ['Ninguno actualmente; solo toma suplemento de magnesio ocasional.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cv-mob1',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y pulso arterial',
        finding:
          'Frecuencia cardíaca de 58 lpm con pausas intermitentes regularmente agrupadas (se auscultan 3 latidos seguidos de una pausa breve sin soplos). Ruidos cardíacos de tono normal, extremidades tibias y bien perfundidas.',
        isAbnormal: true,
        semiologyNote:
          'El patrón de latidos agrupados con pausa periódica orienta clínicamente a fenómeno de Wenckebach en el nodo AV.',
      },
      {
        id: 'pe-lungs-mob1',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar',
        finding: 'Campos pulmonares limpios y bien ventilados sin ruidos agregados.',
        isAbnormal: false,
      },
      {
        id: 'pe-neuro-mob1',
        system: 'Neurológico',
        name: 'Examen neurológico básico',
        finding: 'Alerta, orientado, sin déficit motor ni signos de hipoperfusión.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'ecg-mob1',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones con tira de ritmo',
        result:
          'Ritmo sinusal con bloqueo AV de 2.º grado tipo I (Mobitz I / fenómeno de Wenckebach): alargamiento progresivo del intervalo PR (180 ms → 230 ms → 280 ms) hasta que la cuarta onda P se bloquea y no conduce QRS, con acortamiento progresivo de los intervalos R-R previos a la pausa. Complejos QRS estrechos (88 ms), FC ventricular media 58 lpm, sin alteraciones isquémicas del ST.',
        referenceRange: 'Conducción AV 1:1 con PR constante 120–200 ms',
        interpretation:
          'Bloqueo Auriculoventricular de 2.º Grado Tipo I (Mobitz I / Wenckebach) de localización nodal suprahisiana.',
        isAbnormal: true,
      },
      {
        id: 'holter-mob1',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Monitoreo Holter ECG de 24 horas',
        result:
          'Ritmo sinusal predominante con respuesta cronotrópica normal durante la caminata (FC máxima 146 lpm, conducción 1:1 en ejercicio). Durante el reposo nocturno se registran episodios de bloqueo AV 2.º grado Mobitz I (Wenckebach) sin pausas > 2.2 segundos, sin episodios de Mobitz II ni bloqueo AV completo.',
        referenceRange: 'Sin pausas > 2.5 s ni bloqueos AV avanzados',
        interpretation: 'Mobitz I nocturno benigno mediado por hipertonía vagal fisiológica, con adecuada conducción AV al esfuerzo.',
        isAbnormal: true,
      },
      {
        id: 'lab-elec-mob1',
        category: 'Laboratorio',
        subcategory: 'Electrolitos',
        name: 'Electrolitos séricos y perfil tiroideo',
        result: 'K⁺: 4.1 mEq/L | Mg²⁺: 2.0 mg/dL | TSH: 1.8 mUI/L | Creatinina: 0.92 mg/dL.',
        referenceRange: 'K⁺ 3.5–5.1 mEq/L | TSH 0.4–4.2 mUI/L',
        interpretation: 'Sin alteraciones electrolíticas ni tiroideas subyacentes.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bloqueo Auriculoventricular de 2.º Grado Tipo I (Mobitz I / Fenómeno de Wenckebach)',
      differentialDiagnoses: [
        'Bloqueo auriculoventricular de 2.º grado tipo II (Mobitz II)',
        'Extrasístoles auriculares bloqueadas (bigeminismo auricular no conducido)',
        'Arritmia sinusal respiratoria benigna',
        'Bloqueo auriculoventricular de 1.er grado',
      ],
      pathophysiology:
        'En el bloqueo AV Mobitz I existe fatiga progresiva de la conducción a nivel del nodo AV (suprahisiano), frecuentemente favorecida por hipertonía vagal en reposo o sueño. Esto produce alargamiento incremental del intervalo PR latido a latido hasta que un impulso auricular encuentra el nodo completamente refractario y no se conduce, tras lo cual el nodo se recupera y el ciclo reinicia.',
      keyClinicalClues: [
        'Pausas percibidas en reposo nocturno en paciente deportista sin síncope y con buena tolerancia al ejercicio',
        'ECG con alargamiento progresivo del PR antes de la onda P bloqueada y QRS estrecho (88 ms)',
        'Holter de 24 h muestra normalización de la conducción 1:1 durante actividad física diurna',
      ],
      characteristicSignsSymptoms: [
        'Alargamiento progresivo del PR hasta una P no conducida (Wenckebach)',
        'QRS estrecho con resolución durante esfuerzo o hipertonía simpática',
        'Curso benigno en ausencia de síntomas graves o enfermedad estructural',
      ],
      criticalRulingOutFactors: [
        'El PR se alarga progresivamente antes de la pausa (diferenciándolo de Mobitz II, donde el PR es constante y el riesgo infrahisiano es alto).',
        'El Holter descarta pausas prolongadas patológicas o bloqueo AV de alto grado.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones con tira de ritmo larga (DII) para medir secuencia de intervalos PR',
        'Holter ECG de 24 horas para confirmar comportamiento benigno con la actividad física y descartar bloqueos avanzados',
        'Electrolitos séricos y TSH para descartar causas metabólicas corregibles',
      ],
      optimalTreatment: {
        pharmacological: [],
        generalMeasures: [
          'Manejo conservador y vigilancia ambulatoria: el BAV Mobitz I asintomático suprahisiano no requiere fármacos ni marcapasos',
          'Evitar la prescripción futura de fármacos frenadores del nodo AV (betabloqueadores, verapamilo, diltiazem o digoxina)',
          'Educar sobre signos de alarma (mareo incapacitante, presíncope, síncope o intolerancia al esfuerzo) que ameriten revaloración',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia programada a Cardiología con resultados de Holter para seguimiento anual o si aparecen síntomas de bajo gasto.',
        ],
        followUp: 'Control ambulatorio con resultado de Holter de 24 h y vigilancia clínica periódica sin restricción de ejercicio leve-moderado mientras permanezca asintomático.',
      },
      criticalSafetyAlerts: [
        'No confundir Mobitz I (benigno nodal con PR progresivo) con Mobitz II (infrahisiano de alto riesgo que exige marcapasos).',
        'Evitar iniciar betabloqueadores o calcioantagonistas no dihidropiridínicos ante palpitaciones benignas cuando ya existe bloqueo AV de 2.º grado.',
      ],
      guidelineReferences: [
        'ACC/AHA/HRS 2018 Bradycardia and Cardiac Conduction Delay Guideline',
        'ESC 2021 Guidelines on Cardiac Pacing',
      ],
    },
    internalPersonaPrompt:
      'Eres Fernando Lizárraga, profesor de educación física de 54 años. Corres sin fatigarte, pero últimamente en las noches sientes como si el corazón hiciera una pequeña pausa cada ciertos latidos y eso te generó curiosidad para venir a chequeo.',
  },
  {
    id: 'case-cardio-out-bav-mobitz-2',
    mode: 'medico_general',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Armando Cepeda Valdivia',
      age: 71,
      sex: 'Masculino',
      occupation: 'Sastre en activo',
      consultReason: 'Dos episodios breves de mareo intenso y oscurecimiento de la vista al caminar esta semana',
      evolutionTime: '5 días de evolución',
      currentIllness:
        'Paciente masculino de 71 años que acude caminando acompañado de su esposa a consulta externa tras presentar ayer y hace cuatro días dos episodios súbitos de oscurecimiento visual y sensación inminente de desmayo de unos 5 segundos de duración mientras caminaba en su taller, obligándolo a sujetarse de una mesa para no caer. Niega dolor opresivo en el pecho, palpitaciones rápidas, pérdida del control de esfínteres o movimientos anormales.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '114/68 mmHg',
      heartRate: 44,
      respiratoryRate: 17,
      temperature: 36.4,
      oxygenSaturation: 96,
      glasgow: 15,
      bloodGlucose: 104,
      weightKg: 74,
      heightCm: 170,
    },
    background: {
      pathological: ['Hipertensión arterial crónica controlada.', 'Cardiopatía degenerativa leve documentada hace 4 años.'],
      nonPathological: ['No fuma desde hace 20 años.'],
      family: ['Padre fallecido de enfermedad cardíaca a los 78 años.'],
      surgical: ['Cirugía de hernia inguinal hace 10 años.'],
      currentMedications: ['Amlodipino 5 mg al día.', 'Ácido acetilsalicílico 100 mg al día.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cv-mob2',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y pulsos',
        finding:
          'Bradicardia de 44 lpm con pausas irregulares intermitentes a la auscultación. R1 y R2 audibles sin soplos significativos; pulsos periféricos lentos pero simétricos.',
        isAbnormal: true,
        semiologyNote:
          'Bradicardia < 50 lpm acompañada de episodios presincopales en paciente mayor exige ECG inmediato en consultorio.',
      },
      {
        id: 'pe-neuro-mob2',
        system: 'Neurológico',
        name: 'Exploración neurológica',
        finding: 'Alerta y coherente en el consultorio (Glasgow 15/15), sin focalización motora ni alteración cerebelosa.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'ecg-mob2',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones con tira de ritmo',
        result:
          'Ritmo sinusal con bloqueo AV de 2.º grado tipo II (Mobitz II): intervalo PR constante de 175 ms en todos los latidos conducidos, con ondas P bloqueadas intermitentes de aparición súbita (conducción 3:1 / 4:1) sin alargamiento previo del PR. Complejos QRS anchos (132 ms) de morfología de bloqueo de rama derecha, frecuencia ventricular media 44 lpm.',
        referenceRange: 'Conducción AV 1:1 con PR 120–200 ms',
        interpretation:
          'Bloqueo Auriculoventricular de 2.º Grado Tipo II (Mobitz II) infrahisiano sintomático con alto riesgo de progresión súbita a bloqueo AV completo.',
        isAbnormal: true,
      },
      {
        id: 'lab-elec-mob2',
        category: 'Laboratorio',
        subcategory: 'Electrolitos',
        name: 'Electrolitos séricos',
        result: 'K⁺: 4.3 mEq/L | Na⁺: 138 mEq/L | Creatinina: 1.08 mg/dL.',
        referenceRange: 'K⁺ 3.5–5.1 mEq/L',
        interpretation: 'Descarta hiperkalemia como causa metabólica reversible del bloqueo.',
        isAbnormal: false,
      },
      {
        id: 'lab-trop-mob2',
        category: 'Laboratorio',
        subcategory: 'Cardiovascular',
        name: 'Troponina I cardíaca',
        result: 'Troponina I: 0.015 ng/mL.',
        referenceRange: '<0.04 ng/mL',
        interpretation: 'Sin lesión miocárdica isquémica aguda en curso.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bloqueo Auriculoventricular de 2.º Grado Tipo II (Mobitz II)',
      differentialDiagnoses: [
        'Bloqueo auriculoventricular de 2.º grado tipo I (Mobitz I / Wenckebach)',
        'Bloqueo auriculoventricular completo (3.er grado)',
        'Síndrome del seno enfermo',
        'Hipotensión ortostática',
      ],
      pathophysiology:
        'A diferencia del Mobitz I, el bloqueo Mobitz II se localiza distalmente en el sistema His-Purkinje (bloqueo infrahisiano), por lo que las ondas P fallan de manera súbita ("todo o nada") manteniendo un intervalo PR constante y frecuentemente un QRS ancho. Conlleva alto riesgo impredecible de progresar abruptamente a bloqueo AV completo y asistolia.',
      keyClinicalClues: [
        'Presíncopes de esfuerzo reciente con bradicardia de 44 lpm en consultorio',
        'ECG con intervalo PR constante (175 ms) antes y después de ondas P bloqueadas súbitamente',
        'QRS ancho asociado (132 ms) que confirma afectación del sistema His-Purkinje',
      ],
      characteristicSignsSymptoms: [
        'Intervalo PR constante sin alargamiento previo antes de la onda P bloqueada',
        'QRS frecuentemente ancho (>120 ms)',
        'Presíncope o síncope con alto riesgo de muerte súbita si no se ingresa',
      ],
      criticalRulingOutFactors: [
        'La ausencia de alargamiento progresivo del PR descarta fenómeno benigno de Wenckebach.',
        'La conducción AV aún conservada en varios latidos con PR fijo lo distingue del BAV completo de 3.er grado.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones con tira de ritmo larga de forma inmediata',
        'Electrolitos séricos y troponina I para descartar causa reversible o isquemia aguda',
        'Monitoreo electrocardiográfico continuo intrahospitalario hasta implante de marcapasos',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Atropina (solo como puente de rescate si desarrolla inestabilidad aguda durante el traslado; recordar baja eficacia en bloqueo infrahisiano)',
            dose: '0.5 a 1 mg (opcional en espera de marcapasos si deterioro)',
            route: 'Intravenosa (IV)',
            frequency: 'Dosis única de rescate solo ante hipotensión/síncope inminente',
            duration: 'Puente a marcapasos transcutáneo/definitivo',
            rationale:
              'El tratamiento definitivo del Mobitz II es el implante de marcapasos definitivo (Indicación Clase I ESC/AHA); en consultorio la prioridad absoluta es el traslado inmediato a sala con telemetría evitando egresarlo a casa.',
          },
        ],
        generalMeasures: [
          'NO egresar a domicilio: gestionar ingreso inmediato a Hospitalización en Sala con monitoreo cardíaco continuo / telemetría',
          'Mantener acceso venoso periférico permeable y vigilancia estrecha durante el traslado',
          'Evitar terminantemente betabloqueadores, verapamilo, diltiazem o digoxina; valorar traslado con parches de marcapasos transcutáneo disponibles',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Interconsulta urgente a Cardiología / Electrofisiología para implante de marcapasos definitivo bicameral.',
        ],
        followUp: 'Seguimiento intrahospitalario hasta colocación de marcapasos permanente y control posterior en clínica de marcapasos.',
      },
      criticalSafetyAlerts: [
        '¡PELIGRO CRÍTICO!: NUNCA enviar a manejo ambulatorio a un paciente con BAV de 2.º grado Mobitz II; aunque entre caminando estable al consultorio, tiene indicación de ingreso urgente y marcapasos definitivo por riesgo de asistolia súbita.',
        'Contraindicados fármacos frenadores del nodo AV/conducción (metoprolol, propranolol, verapamilo, diltiazem, digoxina).',
      ],
      guidelineReferences: [
        'ESC 2021 Guidelines on Cardiac Pacing and Cardiac Resynchronization Therapy',
        'ACC/AHA/HRS 2018 Bradycardia and Conduction Delay Guideline',
      ],
    },
    internalPersonaPrompt:
      'Eres Armando Cepeda, sastre de 71 años. Viniste caminando a consulta porque esta semana sentiste dos veces que se te nublaba la vista y casi te desmayabas de pie en tu taller; ahorita te sientes tranquilo pero un poco lento.',
  },
  {
    id: 'case-cardio-out-brdhh',
    mode: 'principiante',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Julián Torres Salgado',
      age: 49,
      sex: 'Masculino',
      occupation: 'Contador público',
      consultReason: 'Valoración médica preoperatoria de rutina para cirugía electiva de hernia umbilical',
      evolutionTime: 'Asintomático',
      currentIllness:
        'Paciente masculino de 49 años que acude a consulta externa para valoración preoperatoria solicitada por cirugía general previo a hernioplastia umbilical electiva. Se encuentra completamente asintomático: camina 40 minutos todos los días sin disnea ni opresión torácica, niega palpitaciones, mareos o síncopes. Trae estudios básicos preoperatorios solicitados hace 2 días.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '120/78 mmHg',
      heartRate: 72,
      respiratoryRate: 15,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 79,
      heightCm: 177,
    },
    background: {
      pathological: ['Hernia umbilical pequeña no complicada.', 'Sin enfermedades cardiovasculares ni respiratorias conocidas.'],
      nonPathological: ['No fuma, realiza caminata diaria sin síntomas.'],
      family: ['Padres vivos sin cardiopatías tempranas.'],
      surgical: ['Ninguna cirugía previa.'],
      currentMedications: ['Ninguno de uso crónico.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cv-brdhh',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y cuello',
        finding:
          'Ritmo cardíaco regular a 72 lpm. R1 normal; discreto desdoblamiento amplio fisiológico del segundo ruido (R2) sin soplos sistólicos ni diastólicos patológicos. Sin ingurgitación yugular ni edema maleolar.',
        isAbnormal: true,
        semiologyNote:
          'El retraso en la despolarización y cierre de la válvula pulmonar produce un desdoblamiento amplio del R2 audible en foco pulmonar.',
      },
      {
        id: 'pe-lungs-brdhh',
        system: 'Tórax y Pulmones',
        name: 'Campos pulmonares',
        finding: 'Murmullo vesicular normal bilateral sin estertores ni sibilancias.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'ecg-brdhh',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones',
        result:
          'Ritmo sinusal regular a 72 lpm, intervalo PR normal (160 ms). Complejos QRS anchos de 136 ms con morfología rsR\' ("orejas de conejo") en V1 y V2 acompañada de inversión secundaria esperable de la onda T en V1-V2, y onda S ancha y empastada en derivaciones DI, aVL, V5 y V6. Sin elevación del ST ni ondas Q patológicas.',
        referenceRange: 'QRS < 120 ms sin morfología de bloqueo de rama',
        interpretation:
          'Bloqueo Completo de Rama Derecha del Haz de His (BRDHH) aislado, sin bloqueos AV ni signos de isquemia aguda.',
        isAbnormal: true,
      },
      {
        id: 'eco-brdhh',
        category: 'Imagen',
        subcategory: 'Cardiovascular',
        name: 'Ecocardiograma transtorácico (ECOTT)',
        result:
          'Ventrículo izquierdo de dimensiones y grosor normales con FEVI 62%. Cavidades derechas de tamaño y función sistólica conservadas (TAPSE 22 mm), tabique interauricular íntegro sin cortocircuito y presión sistólica arterial pulmonar estimada normal (24 mmHg).',
        referenceRange: 'FEVI ≥ 55% | Sin dilatación de cavidades derechas',
        interpretation: 'Corazón estructuralmente sano; descarta comunicación interauricular, cor pulmonale o cardiopatía derecha.',
        isAbnormal: false,
      },
      {
        id: 'rx-brdhh',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía posteroanterior de tórax',
        result: 'Índice cardiotorácico normal (<0.50), campos pulmonares claros sin congestión ni dilatación de arteria pulmonar.',
        referenceRange: 'Silueta cardíaca e hilios normales',
        interpretation: 'Sin alteraciones cardiopulmonares estructurales.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bloqueo Completo de Rama Derecha del Haz de His (BRDHH)',
      differentialDiagnoses: [
        'Bloqueo completo de rama izquierda del haz de His (BRIHH)',
        'Síndrome de Brugada',
        'Sobrecarga ventricular derecha / comunicación interauricular',
        'Bloqueo incompleto de rama derecha',
      ],
      pathophysiology:
        'La interrupción de la conducción a través de la rama derecha del haz de His obliga a que el ventrículo derecho se despolarice de forma tardía mediante conducción músculo-a-músculo desde el ventrículo izquierdo. Esto prolonga el QRS a ≥120 ms generando una segunda onda R tardía positiva (rsR\') en precordiales derechas (V1-V2) y una onda S terminal empastada en derivaciones izquierdas (DI, aVL, V5-V6). En personas sin cardiopatía estructural ni síncopes suele ser un hallazgo benigno.',
      keyClinicalClues: [
        'Hallazgo preoperatorio en paciente asintomático con excelente capacidad funcional',
        'ECG con QRS ≥ 120 ms (136 ms), patrón rsR\' en V1-V2 y onda S empastada en DI, aVL, V5-V6',
        'Ecocardiograma normal que descarta cardiopatía estructural o sobrecarga de cavidades derechas',
      ],
      characteristicSignsSymptoms: [
        'QRS ≥ 120 ms con patrón rsR\' en V1-V2',
        'Onda S ancha empastada en DI, V5 y V6',
        'Desdoblamiento amplio del segundo ruido cardíaco (R2)',
      ],
      criticalRulingOutFactors: [
        'Ausencia de elevación cóncava/en silla en V1-V2 y ausencia de síncopes/historia familiar alejan síndrome de Brugada.',
        'Ecocardiograma con cavidades derechas normales y tabique íntegro descarta CIA e hipertensión pulmonar.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones de calidad para diferenciar BRDHH de BRIHH o patrón de Brugada',
        'Ecocardiograma transtorácico (descarte de cardiopatía estructural si no cuenta con estudio previo)',
      ],
      optimalTreatment: {
        pharmacological: [],
        generalMeasures: [
          'El BRDHH aislado y asintomático con corazón estructuralmente sano NO requiere fármacos antiarrítmicos ni marcapasos',
          'Emitir aptitud cardiovascular para su cirugía electiva de bajo riesgo sin diferir innecesariamente el procedimiento',
          'Entregar copia del ECG basal al paciente para referencia futura y vigilar en chequeos médicos habituales',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración por Cardiología solo si llegaran a aparecer síntomas (síncope, disnea) o bloqueo fascicular adicional.',
        ],
        followUp: 'Seguimiento ambulatorio rutinario en atención primaria; no requiere restricciones físicas ni medicación específica.',
      },
      criticalSafetyAlerts: [
        'No prescribir fármacos antiarrítmicos (amiodarona, propafenona, flecainida) ni indicar marcapasos en un BRDHH aislado asintomático.',
        'Recordar que el BRDHH aislado tiene bajo riesgo cardiovascular cuando el ecocardiograma es normal, a diferencia del BRIHH o los bloqueos bifasciculares sintomáticos.',
      ],
      guidelineReferences: [
        'ACC/AHA/HRS 2018 Bradycardia and Cardiac Conduction Delay Guideline',
        'ESC Guidelines on Cardiovascular Assessment and Management of Patients Undergoing Non-Cardiac Surgery',
      ],
    },
    internalPersonaPrompt:
      'Eres Julián Torres, contador de 49 años. Te sientes perfectamente bien y haces ejercicio sin problema; solo viniste a consulta externa porque el cirujano te pidió tu valoración preoperatoria para operarte una pequeña hernia en el ombligo.',
  },
  {
    id: 'case-cardio-out-brihh',
    mode: 'medico_general',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Consuelo Benavides Herrera',
      age: 64,
      sex: 'Femenino',
      occupation: 'Profesora jubilada',
      consultReason: 'Control de presión arterial y cansancio leve al subir dos pisos de escaleras',
      evolutionTime: '3 meses de evolución gradual',
      currentIllness:
        'Paciente femenina de 64 años con hipertensión arterial de 12 años de diagnóstico que acude a consulta externa para retomar su control médico tras haber suspendido irregularmente su antihipertensivo en los últimos meses. Refiere cansancio discreto cuando sube dos pisos de escaleras en la escuela donde apoya, estable desde hace unos 3 meses. Niega por completo dolor torácico opresivo, opresión al esfuerzo, ortopnea, disnea paroxística nocturna, palpitaciones o desmayos.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '146/88 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 97,
      glasgow: 15,
      bloodGlucose: 102,
      weightKg: 72,
      heightCm: 159,
    },
    background: {
      pathological: ['Hipertensión arterial sistémica de 12 años.', 'Dislipidemia leve diagnosticada hace 3 años.'],
      nonPathological: ['No fuma. Sedentarismo relativo.'],
      family: ['Hermano con hipertensión arterial.'],
      surgical: ['Histerectomía abdominal hace 14 años.'],
      currentMedications: ['Tomaba Losartán 50 mg al día de manera irregular (sin dosis en la última semana).'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cv-brihh',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y choque de punta',
        finding:
          'Ritmo cardíaco regular a 74 lpm, presión arterial elevada (146/88 mmHg). Choque de la punta palpable ligeramente sostenido en 5.º espacio intercostal izquierdo línea medioclavicular; desdoblamiento paradójico sutil de R2 sin soplos de insuficiencia ni galope S3. Sin edema de miembros inferiores.',
        isAbnormal: true,
        semiologyNote:
          'El retraso de activación del ventrículo izquierdo puede invertir el orden de cierre valvular generando desdoblamiento paradójico del R2.',
      },
      {
        id: 'pe-lungs-brihh',
        system: 'Tórax y Pulmones',
        name: 'Campos pulmonares',
        finding: 'Murmullo vesicular conservado en ambos hemitórax sin estertores crepitantes basales.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'ecg-brihh',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones',
        result:
          'Ritmo sinusal a 74 lpm, PR normal (165 ms). Complejos QRS anchos de 148 ms con onda R ancha y mellada en meseta en DI, aVL, V5 y V6 acompañada de ausencia de ondas q septales y cambios secundarios esperables de repolarización (segmento ST y onda T discordantes negativos en DI, aVL, V5-V6). Complejos QS/rS profundos y anchos en V1 y V2. Sin criterios de Sgarbossa para isquemia aguda.',
        referenceRange: 'QRS < 120 ms con ondas q septales presentes en V5-V6',
        interpretation:
          'Bloqueo Completo de Rama Izquierda del Haz de His (BRIHH) con discordancia apropiada del segmento ST-T (sin signos electrocardiográficos de infarto agudo).',
        isAbnormal: true,
      },
      {
        id: 'eco-brihh',
        category: 'Imagen',
        subcategory: 'Cardiovascular',
        name: 'Ecocardiograma transtorácico (ECOTT)',
        result:
          'Hipertrofia concéntrica leve del ventrículo izquierdo secundaria a hipertensión arterial; movimiento septal paradójico típico de asincronía por BRIHH; función sistólica global conservada en rango limítrofe-normal (FEVI 52%), disfunción diastólica grado I, sin valvulopatías graves ni derrame pericárdico.',
        referenceRange: 'FEVI ≥ 55% | Sin hipertrofia ventricular',
        interpretation: 'Cardiopatía hipertensiva leve con FEVI 52% y asincronía septal esperada por BRIHH; descarta insuficiencia cardíaca grave.',
        isAbnormal: true,
      },
      {
        id: 'lab-trop-brihh',
        category: 'Laboratorio',
        subcategory: 'Cardiovascular',
        name: 'Troponina I sérica y perfil bioquímico',
        result: 'Troponina I: 0.011 ng/mL (negativa) | Creatinina: 0.89 mg/dL | K⁺: 4.4 mEq/L | LDL: 138 mg/dL.',
        referenceRange: 'Troponina I < 0.04 ng/mL | Creatinina 0.6–1.1 mg/dL',
        interpretation: 'Descarta síndrome coronario agudo en curso y confirma función renal normal.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bloqueo Completo de Rama Izquierda del Haz de His (BRIHH)',
      differentialDiagnoses: [
        'Infarto agudo de miocardio en presencia de BRIHH (criterios de Sgarbossa positivos)',
        'Hipertrofia ventricular izquierda con sobrecarga sistólica aislada',
        'Bloqueo completo de rama derecha del haz de His (BRDHH)',
        'Ritmo de marcapasos ventricular',
      ],
      pathophysiology:
        'El retraso o interrupción de la conducción en la rama izquierda del haz de His obliga a que el ventrículo izquierdo se active tardíamente desde el ventrículo derecho a través del miocardio septal de derecha a izquierda. Esto produce complejos QRS ≥120 ms con ausencia de ondas q septales fisiológicas, onda R ancha y mellada en derivaciones laterales (DI, aVL, V5-V6) y complejos rS/QS profundos en V1-V2. A diferencia del BRDHH, el BRIHH suele asociarse a cardiopatía estructural subyacente (hipertensiva, isquémica o miocardiopatía), por lo que exige siempre estudio ecocardiográfico.',
      keyClinicalClues: [
        'Paciente hipertensa crónica con control ambulatorio estable y sin angina aguda',
        'ECG con QRS ≥ 120 ms (148 ms), R ancha mellada en DI/aVL/V5-V6 sin ondas q septales y rS/QS ancho en V1-V2',
        'Troponina negativa y ausencia de criterios de Sgarbossa descartan emergencia isquémica; ecocardiograma confirma cardiopatía hipertensiva con FEVI 52%',
      ],
      characteristicSignsSymptoms: [
        'QRS ≥ 120 ms con onda R mellada ancha en DI, aVL, V5 y V6',
        'Ausencia de ondas q en derivaciones laterales izquierdas y QS/rS profundo en V1-V2',
        'Fuerte asociación a cardiopatía hipertensiva o estructural que amerita ecocardiograma',
      ],
      criticalRulingOutFactors: [
        'Ausencia de dolor torácico típico, troponina normal y ausencia de criterios de Sgarbossa descartan infarto agudo.',
        'La evaluación ecocardiográfica descarta miocardiopatía dilatada severa (FEVI < 35%) que requeriría terapia de resincronización.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones evaluando criterios de Sgarbossa ante cualquier síntoma torácico',
        'Ecocardiograma transtorácico OBLIGATORIO ante todo BRIHH recién identificado para valorar FEVI y cardiopatía estructural',
        'Troponina I basal si existe duda sobre temporalidad del hallazgo y perfil lipídico/renal',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Losartán (o Enalapril)',
            dose: '50 mg (o Enalapril 10 mg c/12h)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Tratamiento crónico continuo',
            rationale:
              'Reinstaurar y optimizar antihipertensivo bloqueador del eje renina-angiotensina para control tensional y prevención de remodelado ventricular izquierdo.',
          },
          {
            drug: 'Atorvastatina',
            dose: '20 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la noche',
            duration: 'Uso crónico en prevención cardiovascular',
            rationale: 'Control lipídico y reducción de riesgo cardiovascular global en paciente hipertensa con cardiopatía estructural incipiente.',
          },
        ],
        generalMeasures: [
          'Todo paciente con BRIHH debe contar con ecocardiograma transtorácico para descartar disfunción sistólica o cardiopatía isquémica',
          'Entregar copia impresa del ECG actual al paciente (un BRIHH previo documentado evita confusiones diagnósticas en urgencias futuras)',
          'Educar sobre signos de alarma (dolor torácico opresivo, disnea progresiva, ortopnea o síncope) y restricción moderada de sodio',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referencia programada a Cardiología para seguimiento de cardiopatía hipertensiva con BRIHH (y valoración de prueba de isquemia con imagen o resincronización solo si descendiera FEVI).',
        ],
        followUp: 'Cita de control en 4 semanas con bitácora de presión arterial en domicilio y valoración programada por Cardiología.',
      },
      criticalSafetyAlerts: [
        'Todo BRIHH nuevo o sin estudio previo exige ecocardiograma para valorar FEVI; nunca asumir que es inocuo sin descartar cardiopatía estructural.',
        'Si un paciente con BRIHH presenta dolor torácico agudo, el ECG convencional pierde sensibilidad para isquemia: aplicar criterios de Sgarbossa modificados y troponinas seriadas.',
      ],
      guidelineReferences: [
        'ACC/AHA/HRS 2018 Guideline on Bradycardia and Cardiac Conduction Delay',
        'ESC Guidelines on Arterial Hypertension & Chronic Heart Failure',
      ],
    },
    internalPersonaPrompt:
      'Eres Consuelo Benavides, maestra jubilada de 64 años. Viniste a consulta externa porque dejaste de tomar con orden tu pastilla para la presión y sientes un poco de cansancio al subir dos pisos de escaleras, aunque nunca te ha dolido el pecho.',
  },
  {
    id: 'case-cardio-out-bloqueo-bifascicular',
    mode: 'medico_general',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Gilberto Salvatierra Núñez',
      age: 67,
      sex: 'Masculino',
      occupation: 'Administrador de finca',
      consultReason: 'Chequeo médico anual y sensación fugaz de palpitaciones aisladas en reposo',
      evolutionTime: '1 mes de evolución ocasional',
      currentIllness:
        'Paciente masculino de 67 años con hipertensión arterial controlada que acude a consulta externa para su revisión médica anual. Menciona que en dos tardes del mes pasado sintió un par de latidos fuertes aislados mientras leía el periódico, sin mareo, sudoración, falta de aire ni dolor en el pecho. Nunca se ha desmayado ni ha tenido episodios de presíncope. Camina diariamente supervisando su propiedad sin limitación.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 66,
      respiratoryRate: 16,
      temperature: 36.4,
      oxygenSaturation: 97,
      glasgow: 15,
      bloodGlucose: 99,
      weightKg: 75,
      heightCm: 169,
    },
    background: {
      pathological: ['Hipertensión arterial sistémica de 10 años, bien controlada.'],
      nonPathological: ['No fuma, actividad física moderada diaria.'],
      family: ['Sin antecedentes familiares de muerte súbita.'],
      surgical: ['Sin antecedentes quirúrgicos relevantes.'],
      currentMedications: ['Amlodipino 5 mg vía oral cada 24 horas.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-cv-bifasc',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y pulsos',
        finding:
          'Ritmo cardíaco regular a 66 lpm, R1 normal, discreto desdoblamiento de R2, sin soplos ni extratonos. Pulsos periféricos amplios y simétricos sin datos de congestión.',
        isAbnormal: true,
      },
      {
        id: 'pe-neuro-bifasc',
        system: 'Neurológico',
        name: 'Estado de alerta',
        finding: 'Alerta, orientado y sin déficit neurológico.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'ecg-bifasc',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma estándar de 12 derivaciones',
        result:
          'Ritmo sinusal a 66 lpm, intervalo PR normal (168 ms). Complejos QRS anchos (134 ms) con morfología de bloqueo completo de rama derecha (rsR\' en V1-V2 y S empastada en V5-V6) combinada con desviación extrema del eje eléctrico a la izquierda (-60°: complejo qR en DI y aVL, y complejos rS profundos en DII, DIII y aVF con SIII > SII) compatible con hemibloqueo fascicular anterior izquierdo.',
        referenceRange: 'Eje QRS -30° a +90° y QRS < 120 ms',
        interpretation:
          'Bloqueo Bifascicular (BRDHH + Hemibloqueo Fascicular Anterior Izquierdo) con conducción AV 1:1 conservada.',
        isAbnormal: true,
      },
      {
        id: 'holter-bifasc',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Monitoreo Holter ECG de 24 horas',
        result:
          'Ritmo sinusal estable durante las 24 horas (FC mínima 54 lpm, media 69 lpm, máxima 124 lpm). Extrasístoles auriculares y ventriculares aisladas muy escasas (<0.2%), sin pausas > 1.9 segundos y sin episodios intermitentes de bloqueo AV de 2.º grado o completo.',
        referenceRange: 'Sin bloqueos AV intermitentes ni pausas patológicas',
        interpretation: 'Descarta progresión intermitente a bloqueo AV avanzado o bloqueo trifascicular sintomático.',
        isAbnormal: false,
      },
      {
        id: 'eco-bifasc',
        category: 'Imagen',
        subcategory: 'Cardiovascular',
        name: 'Ecocardiograma transtorácico (ECOTT)',
        result:
          'Ventrículo izquierdo con grosor septal basal normal-limítrofe y FEVI 58%, sin trastornos segmentarios de contractilidad ni valvulopatías significativas.',
        referenceRange: 'FEVI ≥ 55%',
        interpretation: 'Función sistólica ventricular conservada sin cardiopatía estructural grave.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bloqueo Bifascicular (BRDHH + Hemibloqueo Fascicular Anterior Izquierdo)',
      differentialDiagnoses: [
        'Bloqueo completo de rama derecha aislado',
        'Bloqueo completo de rama izquierda',
        'Bloqueo trifascicular sintomático (con BAV avanzado o síncope)',
        'Infarto inferior antiguo simulando desviación izquierda del eje',
      ],
      pathophysiology:
        'La conducción intraventricular distal depende de la rama derecha y de los fascículos anterior y posterior de la rama izquierda. La lesión conjunta de la rama derecha y del fascículo anterior izquierdo produce un bloqueo bifascicular: el impulso baja únicamente por el fascículo posterior izquierdo, sumando el QRS ancho del BRDHH (rsR\' en V1-V2) con una desviación marcada del eje hacia arriba y a la izquierda (-45° a -90°, patrón qR en DI/aVL y rS en cara inferior). Mientras no exista síncope ni BAV de alto grado documentado, el manejo es de vigilancia evitando fármacos bloqueadores de conducción.',
      keyClinicalClues: [
        'Paciente mayor asintomático de síncopes ni disnea en control ambulatorio',
        'ECG con criterios simultáneos de BRDHH (rsR\' V1-V2) + hemibloqueo anterior izquierdo (eje -60°, qR DI/aVL, rS DII/DIII/aVF)',
        'Holter 24 h sin pausas ni BAV intermitente y ecocardiograma con FEVI conservada (58%)',
      ],
      characteristicSignsSymptoms: [
        'Patrón de BRDHH + desviación extrema del eje eléctrico a la izquierda (≤ -45°)',
        'PR normal (si no hay retraso nodal asociado)',
        'Asintomático en manejo ambulatorio vs síncope que obliga a estudio de marcapasos',
      ],
      criticalRulingOutFactors: [
        'Ausencia de síncopes y Holter sin bloqueos AV intermitentes descartan necesidad inmediata de marcapasos profiláctico.',
        'La presencia de pequeña onda r inicial en DII, DIII y aVF (patrón rS) distingue el hemibloqueo anterior izquierdo de ondas Q de necrosis inferior.',
      ],
      recommendedWorkup: [
        'ECG de 12 derivaciones analizando morfología en precordiales y eje frontal',
        'Holter ECG de 24–48 horas para descartar bloqueos AV paroxísticos intermitentes',
        'Ecocardiograma transtorácico y electrolitos séricos basales',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amlodipino (continuar antihipertensivo seguro sin depresión nodal)',
            dose: '5 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Uso crónico ambulatorio',
            rationale:
              'Mantiene control óptimo de la hipertensión arterial sin interferir sobre el nodo AV ni sobre el único fascículo posterior izquierdo restante.',
          },
        ],
        generalMeasures: [
          'En paciente asintomático con bloqueo bifascicular y Holter negativo NO está indicado implantar marcapasos profiláctico',
          'Evitar absolutamente fármacos depresores de la conducción AV/His-Purkinje (betabloqueadores, verapamilo, diltiazem, digoxina, antiarrítmicos clase I)',
          'Educar estrictamente al paciente y familia: ante cualquier episodio de síncope o presíncope debe acudir de inmediato a Urgencias para descartar progresión a bloqueo trifascicular/completo',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Seguimiento ambulatorio programado por Cardiología; referencia urgente para marcapasos definitivo si presentara síncope de origen no aclarado o BAV avanzado.',
        ],
        followUp: 'Control ambulatorio cada 6 meses con ECG de vigilancia y evaluación de síntomas presincopales.',
      },
      criticalSafetyAlerts: [
        '¡ADVERTENCIA TERAPÉUTICA!: Evitar añadir betabloqueadores, diltiazem, verapamilo o digoxina en un paciente con bloqueo bifascicular; el sistema de conducción depende de un solo fascículo restante.',
        'Si un paciente con bloqueo bifascicular presenta síncope, cambia por completo el riesgo (sospecha de bloqueo intermitente completo) y requiere evaluación urgente para marcapasos.',
      ],
      guidelineReferences: [
        'ACC/AHA/HRS 2018 Bradycardia and Cardiac Conduction Delay Guideline',
        'ESC 2021 Guidelines on Cardiac Pacing (Management of Bundle Branch / Bifascicular Block)',
      ],
    },
    internalPersonaPrompt:
      'Eres Gilberto Salvatierra, de 67 años. Viniste a tu chequeo anual de rutina; estás muy bien, caminas sin cansarte y solo sentiste un par de latidos fuertes breves hace semanas mientras leías sentado.',
  },
];
