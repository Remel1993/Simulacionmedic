import { ClinicalCase } from '../types/clinical';

/**
 * Ampliación Curada (Bloque C):
 * - 10 casos menos comunes de alta relevancia diagnóstica y terapéutica.
 * - 5 casos extranjeros / importados (medicina del viajero y patologías endémicas internacionales).
 */
export const UNCOMMON_AND_FOREIGN_CASES: ClinicalCase[] = [
  // =========================================================================
  // 10 CASOS MENOS COMUNES
  // =========================================================================
  {
    id: 'case-exp-rare-crisis-miastenica',
    mode: 'residente',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Helena Gabriela Navarro',
      age: 36,
      sex: 'Femenino',
      occupation: 'Locutora de radio',
      consultReason: 'Párpados caídos, voz nasal, dificultad para tragar y falta de aire progresiva',
      evolutionTime: '3 días de empeoramiento agudo (antecedente de 5 meses)',
      currentIllness:
        'Paciente femenina de 36 años con diagnóstico reciente de miastenia gravis en estudio que acude a Urgencias tras tres días de fiebre leve e infección respiratoria alta. Refiere caída severa de ambos párpados, visión doble, voz débil y nasal, atragantamiento con líquidos y sensación creciente de no poder llenar los pulmones de aire, empeorando notablemente al final del día y al acostarse. Recibió ayer una dosis de azitromicina en otro consultorio.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '126/78 mmHg',
      heartRate: 108,
      respiratoryRate: 28,
      temperature: 37.6,
      oxygenSaturation: 93,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 60,
      heightCm: 165,
    },
    background: {
      pathological: ['Debilidad muscular fluctuante ocular/bulbar desde hace 5 meses (anticuerpos anti-AChR positivos pendientes de iniciar inmunosupresión).'],
      nonPathological: ['No fuma; niega consumo de sustancias.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Piridostigmina 60 mg cada 6 horas; ayer inició azitromicina por catarro.'],
      allergies: ['Sin alergias conocidas (empeoramiento tras macrólido).'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-mg-neuro',
        system: 'Neurológico',
        name: 'Exploración de pares craneales, fatiga muscular y mecánica ventilatoria',
        finding:
          'Ptosis palpebral bilateral asimétrica que empeora tras 30 segundos de mirada sostenida hacia arriba, diplopía a la mirada lateral y disfonía nasal con debilidad para elevar el velo del paladar. Reflejos osteotendinosos normorreactivos (NO abolidos) y sensibilidad íntegra. Conteo en una sola respiración (Single Breath Count): apenas llega a 11 (normal ≥25); respiración superficial paradójica leve.',
        isAbnormal: true,
        semiologyNote:
          'Debilidad fatigante ocular/bulbar + reflejos conservados + conteo en una respiración <15-20 tras infección y macrólido = Crisis Miasténica con falla ventilatoria inminente.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-mg-pfr',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Capacidad Vital Forzada (CVF) a la cabecera y Fuerza Inspiratoria Negativa (NIF)',
        result: 'Capacidad Vital Forzada: 14 mL/kg (840 mL, críticamente baja; umbral intubación <15 mL/kg) | NIF: -16 cmH2O (umbral < -20 cmH2O).',
        referenceRange: 'CVF >30 mL/kg | NIF más negativo que -30 cmH2O',
        interpretation: 'Claudicación mecánica ventilatoria inminente ("regla 20/30/40" superada): requiere UCI y protección temprana de vía aérea.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-mg-ac',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Anticuerpos Anti-Receptor de Acetilcolina (Anti-AChR) y Gasometría',
        result: 'Anti-AChR: POSITIVO (14.2 nmol/L) | GSA: pH 7.42, PaCO2 43 mmHg (normocapnia engañosamente "normal" en paciente taquipneica a 28 rpm = fatiga temprana), PaO2 68 mmHg.',
        referenceRange: 'Anti-AChR <0.5 nmol/L | PaCO2 35-45 mmHg',
        interpretation: 'PaCO2 "normal" en taquipnea severa es señal de alarma de agotamiento respiratorio inminente antes de hipercapnia brusca.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Crisis Miasténica Aguda (Descompensación Bulbar y Ventilatoria de Miastenia Gravis)',
      differentialDiagnoses: [
        'Crisis colinérgica por exceso de piridostigmina (miosis, fasciculaciones, diarrea, bradicardia)',
        'Síndrome de Guillain-Barré (arreflexia osteotendinosa)',
        'Botulismo (midriasis fija y boca seca)',
        'Evento vascular cerebral de tronco encefálico',
      ],
      pathophysiology:
        'Autoanticuerpos IgG contra receptores nicotínicos postsinápticos de acetilcolina (AChR) en la unión neuromuscular bloquean y destruyen receptores; una infección intercurrente o fármacos bloqueadores neuromusculares (macrólidos, aminoglucósidos, fluoroquinolonas, betabloqueadores) precipitan fallo respiratorio agudo.',
      keyClinicalClues: [
        'Ptosis fatigante, diplopía, disfagia y voz nasal con reflejos osteotendinosos conservados',
        'Desencadenada por infección respiratoria y prescripción reciente de azitromicina',
        'CVF 14 mL/kg (<15-20 mL/kg), NIF -16 cmH2O y conteo en una respiración de 11',
      ],
      characteristicSignsSymptoms: [
        'Ptosis palpebral fatigante y disfagia/voz nasal',
        'Debilidad diafragmática (CVF <15 mL/kg, NIF < -20)',
        'Reflejos miotáticos conservados',
      ],
      criticalRulingOutFactors: [
        'Reflejos conservados descartan Guillain-Barré; ausencia de miosis, bradicardia y diaforesis descarta crisis colinérgica.',
      ],
      recommendedWorkup: ['Medición seriada de CVF y NIF en cabecera ("regla 20/30/40"), gasometría, Rx tórax y anti-AChR/MuSK'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Inmunoglobulina Intravenosa (IGIV) o Plasmaféresis terapéutica (terapia modificadora urgente)',
            dose: 'IGIV 0.4 g/kg/día (24 g/día) IV durante 5 días (dosis total 2 g/kg) o 5 recambios plasmáticos',
            route: 'Intravenosa en UCI',
            frequency: 'Cada 24 horas',
            duration: '5 días',
            rationale: 'Tratamientos de rescate de primera línea que depuran/neutralizan autoanticuerpos logrando recuperación ventilatoria en días.',
          },
          {
            drug: 'Suspender piridostigmina temporalmente si se intuba (luego reiniciar) + Corticoides sistémicos con cautela en UCI',
            dose: 'Metilprednisolona o Prednisona bajo soporte ventilatorio protegido',
            route: 'Vía Oral / IV',
            frequency: 'Según protocolo de UCI neurológica',
            duration: 'Fase aguda y mantenimiento',
            rationale: 'Evita aumento de secreciones bronquiales tras intubación y evita empeoramiento paradójico inicial fuera de UCI.',
          },
        ],
        generalMeasures: [
          'Ingreso INMEDIATO a UCI e intubación orotraqueal electiva temprana ante CVF <15 mL/kg y NIF peor que -20 cmH2O (NO esperar paro hipercápnico ni desaturación tardía).',
          'SUSPENDER DE INMEDIATO azitromicina y evitar fármacos prohibidos en miastenia (aminoglucósidos, fluoroquinolonas, macrólidos, sulfato de magnesio, betabloqueadores).',
          'Tratar infección desencadenante con antibiótico seguro (p. ej. ceftriaxona o amoxicilina-clavulanato).',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Toda sospecha de crisis miasténica con disfagia o caída de CVF requiere UCI inmediata.'],
        followUp: 'Manejo conjunto por Neurología y Medicina Crítica; posterior estudio de timo (TAC tórax para timoma).',
      },
      criticalSafetyAlerts: [
        'NUNCA esperar hipoxemia severa o hipercapnia para proteger vía aérea en crisis miasténica (guiarse por CVF <15-20 mL/kg y NIF).',
        'PROHIBIDO usar macrólidos (azitromicina), aminoglucósidos, fluoroquinolonas, sulfato de magnesio o succinilcolina.',
      ],
      guidelineReferences: [
        'International Consensus Guidance for Management of Myasthenia Gravis (AAN)',
      ],
    },
    internalPersonaPrompt:
      'Habla con voz nasal, entrecortada y débil como Helena, de 36 años. Te caen los párpados, ves doble, te atragantas con el agua y sientes que ya no tienes fuerza para jalar aire desde que te dieron azitromicina.',
  },
  {
    id: 'case-exp-rare-feocromocitoma',
    mode: 'examen',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Ignacio Rafael Benavides',
      age: 43,
      sex: 'Masculino',
      occupation: 'Ingeniero de sistemas',
      consultReason: 'Ataques súbitos de dolor de cabeza pulsátil, sudoración fría y palpitaciones con presión muy alta',
      evolutionTime: '5 meses con crisis paroxísticas',
      currentIllness:
        'Paciente masculino de 43 años remitido por crisis episódicas de 15 a 30 minutos de duración que ocurren dos veces por semana sin previo aviso, caracterizadas por tríada súbita de cefalea pulsátil intensa, diaforesis fría empapante, palpitaciones violentas y palidez facial, durante las cuales su baumanómetro registra presiones de hasta 220/125 mmHg. Entre crisis su presión arterial es casi normal. Ha perdido 4 kg y ayer tras tomar propranolol su presión subió aún más.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '198/114 mmHg',
      heartRate: 122,
      respiratoryRate: 20,
      temperature: 37.2,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 146,
      weightKg: 70,
      heightCm: 176,
    },
    background: {
      pathological: ['Hipertensión paroxística refractaria de reciente diagnóstico; glucemias en ayuno limítrofes.'],
      nonPathological: ['Niega consumo de cocaína, anfetaminas o descongestionantes nasales.'],
      family: ['Padres aparentemente sanos; sin antecedentes relevantes referidos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Le recetaron propranolol hace 2 días y empeoró drásticamente la hipertensión tras la primera dosis.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-feo-gen',
        system: 'Cardiovascular',
        name: 'Exploración cardiovascular durante crisis paroxística',
        finding:
          'Paciente pálido y marcadamente diaforético con temblor fino. Taquicardia sinusal 122 lpm e hipertensión severa (198/114 mmHg) con caída ortostática de 25 mmHg al ponerse de pie (depleción de volumen intravascular). Sin soplos abdominales renales ni estigmas de Cushing.',
        isAbnormal: true,
        semiologyNote:
          'Tríada clásica (cefalea + diaforesis + palpitaciones) + HTA paroxística + reacción paradójica hipertensiva al betabloqueador aislado = Feocromocitoma.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-feo-meta',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Metanefrinas fraccionadas en plasma y orina de 24 horas',
        result: 'Metanefrinas plasmáticas libres: 4.8 nmol/L (ref <0.5) | Normetanefrina plasmática: 11.4 nmol/L (ref <0.9) | Metanefrinas urinarias 24 h: elevadas 8 veces sobre límite superior.',
        referenceRange: 'Metanefrina <0.5 nmol/L | Normetanefrina <0.9 nmol/L',
        interpretation: 'Confirmación bioquímica inequívoca de tumor productor de catecolaminas (feocromocitoma/paraganglioma).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-feo-tac',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'TAC / RMN de Abdomen enfocada en glándulas suprarrenales',
        result: 'Masa bien circunscrita hipervascular de 4.6 cm en glándula suprarrenal derecha con alta atenuación basal (>20 UH), áreas quísticas centrales e hiperintensidad brillante característica en T2 ("signo de la bombilla") en RMN.',
        referenceRange: 'Glándulas suprarrenales delgadas sin masas',
        interpretation: 'Localiza feocromocitoma suprarrenal derecho de 4.6 cm.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Feocromocitoma Suprarrenal (Crisis Catecolaminérgica Paroxística)',
      differentialDiagnoses: [
        'Trastorno de pánico (sin elevación de metanefrinas ni masa suprarrenal)',
        'Intoxicación por simpaticomiméticos (cocaína, anfetaminas)',
        'Hipertensión renovascular o tirotoxicosis',
        'Síndrome carcinoide (cursaría con flushing rojo y diarrea, no palidez)',
      ],
      pathophysiology:
        'Neoplasia neuroendocrina de células cromafines de la médula suprarrenal que secreta de manera autónoma y episódica cantidades masivas de epinefrina y norepinefrina, estimulando receptores alfa-1 (vasoconstricción severa, palidez, HTA) y beta (taquicardia, diaforesis, hiperglucemia).',
      keyClinicalClues: [
        'Tríada clásica episódica: cefalea intensa + diaforesis profusa + palpitaciones con HTA paroxística >200/120',
        'Empeoramiento hipertensivo paradójico tras administrar betabloqueador (propranolol) sin bloqueo alfa previo',
        'Metanefrinas plasmáticas/urinarias muy elevadas + masa suprarrenal hipervascular',
      ],
      characteristicSignsSymptoms: [
        'Tríada paroxística: cefalea, sudoración y palpitaciones',
        'Crisis hipertensivas con palidez e hipotensión ortostática intercrítica',
        'Reacción paradójica grave a betabloqueadores aislados',
      ],
      criticalRulingOutFactors: [
        'Metanefrinas fraccionadas >4x lo normal confirman feocromocitoma y descartan crisis de pánico o HTA esencial.',
      ],
      recommendedWorkup: ['Metanefrinas libres plasmáticas o fraccionadas en orina 24 h (primero bioquímica), luego TAC/RMN suprarrenal y estudio genético (RET/VHL/SDHx)'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Bloqueo ALFA-adrenérgico PRIMERO: Fenoxibenzamina o Doxazosina / Prazosina (y Fentolamina o Nitroprusiato/Nicardipino IV en crisis aguda)',
            dose: 'Doxazosina 2 mg VO c/24 h (titular progresivamente; en crisis aguda urgente Fentolamina o Nicardipino IV)',
            route: 'Vía Oral (o IV en crisis hipertensiva)',
            frequency: 'Diaria / titulación por 10-14 días prequirúrgicos',
            duration: 'Mínimo 10 a 14 días preoperatorios antes de agregar betabloqueador',
            rationale: 'El bloqueo alfa-1 revierte la vasoconstricción catecolaminérgica y permite expansión de volumen antes de cualquier betabloqueo.',
          },
          {
            drug: 'Propranolol o Atenolol (ÚNICAMENTE DESPUÉS de lograr bloqueo alfa efectivo, usualmente día 3-7)',
            dose: 'Propranolol 20-40 mg VO cada 8 horas solo tras normotensión ortostática controlada con alfa-bloqueo',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas (post-bloqueo alfa)',
            duration: 'Hasta resección quirúrgica',
            rationale: 'Controla la taquicardia refleja tras bloquear receptores alfa.',
          },
        ],
        generalMeasures: [
          'SUSPENDER DE INMEDIATO el propranolol aislado hasta establecer bloqueo alfa completo.',
          'Expansión de volumen con ingesta liberal de sodio y líquidos (o cristaloides IV) una vez iniciado el bloqueo alfa.',
          'Adrenalectomía laparoscópica definitiva en centro especializado tras preparación alfa->beta de 10-14 días.',
        ],
        hospitalizationDecision: 'Observación Urgencias',
        referralCriteria: ['Crisis hipertensiva aguda requiere monitoreo IV en Urgencias/UCI y referencia a Endocrinología + Cirugía Endocrina.'],
        followUp: 'Resección quirúrgica tras preparación preoperatoria y panel genético familiar.',
      },
      criticalSafetyAlerts: [
        'REGLA DE ORO: NUNCA administrar betabloqueadores (propranolol, metoprolol, labetalol oral inicial) ANTES de lograr bloqueo alfa-adrenérgico en feocromocitoma — la estimulación alfa sin oposición desencadena crisis hipertensiva letal y edema pulmonar.',
        'Evitar biopsia percutánea de masa suprarrenal antes de descartar feocromocitoma (riesgo de crisis fatal).',
      ],
      guidelineReferences: [
        'Endocrine Society Clinical Practice Guideline: Pheochromocytoma and Paraganglioma',
      ],
    },
    internalPersonaPrompt:
      'Habla preocupado como Ignacio, de 43 años. Te dan ataques repentinos de dolor de cabeza brutal, sudoración helada y corazón acelerado con presión de 220; ayer te dieron propranolol y te pusiste muchísimo peor.',
  },
  {
    id: 'case-exp-rare-cushing',
    mode: 'residente',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Lorena Beatriz Guzmán',
      age: 35,
      sex: 'Femenino',
      occupation: 'Diseñadora de modas',
      consultReason: 'Aumento progresivo de peso, cambios en la piel y debilidad en las piernas',
      evolutionTime: '10 meses de evolución progresiva',
      currentIllness:
        'Paciente femenina de 35 años que consulta por aumento de 12 kg concentrado únicamente en el rostro, nuca y abdomen mientras sus brazos y piernas se han vuelto más delgados y débiles, al grado de costarle trabajo levantarse de una silla baja o subir escaleras. Nota también aparición de estrías gruesas color rojo-violáceo en el abdomen, moretones fáciles sin golpes, vello facial nuevo, hipertensión arterial y amenorrea de cinco meses. Niega categóricamente tomar pastillas o cremas con esteroides.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '156/94 mmHg',
      heartRate: 84,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 158,
      weightKg: 78,
      heightCm: 161,
    },
    background: {
      pathological: ['Amenorrea secundaria de 5 meses; hipertensión y glucosa alta de reciente aparición.'],
      nonPathological: ['Niega uso exógeno de prednisona, dexametasona, inyecciones articulares o pomadas con corticoides.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-cushing-gen',
        system: 'Osteomuscular y Piel',
        name: 'Inspección fenotípica, piel y fuerza muscular proximal',
        finding:
          'Obesidad central con extremidades delgadas. Facies pletórica redondeada ("cara de luna llena"), acúmulo graso interescapular ("giba de búfalo") y almohadillas supraclaviculares prominentes. Piel fina con múltiples equimosis espontáneas en antebrazos y ESTRÍAS VIOLÁCEAS ANCHAS (>1 cm de ancho) en abdomen inferior y flancos. Miopatía proximal evidente: incapaz de levantarse de cuclillas sin apoyar las manos.',
        isAbnormal: true,
        semiologyNote:
          'Estrías violáceas >1 cm + miopatía proximal + equimosis en piel fina + plétora facial + HTA/hiperglucemia sin esteroides exógenos = Síndrome de Cushing endógeno.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-cushing-tamiz',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Pruebas de tamizaje y confirmación de hipercortisolismo + ACTH plasmática',
        result:
          'Prueba de supresión nocturna con 1 mg de Dexametasona (Nugent): Cortisol 8 AM = 14.8 mcg/dL (NO suprime; normal <1.8) | Cortisol libre urinario 24 h: 310 mcg/24 h (3x lo normal) | Cortisol salival nocturno: elevado | ACTH plasmática: 68 pg/mL (elevada / inapropiadamente normal-alta = ACTH-dependiente) | K+: 3.5 mEq/L.',
        referenceRange: 'Cortisol post-1 mg Dex <1.8 mcg/dL | ACTH 10-60 pg/mL',
        interpretation: 'Confirma Síndrome de Cushing endógeno ACTH-dependiente.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-cushing-rmn',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Resonancia Magnética de silla turca / hipófisis con gadolinio',
        result: 'Microadenoma hipofisario hipocaptante de 7 mm en el lóbulo anterior derecho de la hipófisis sin compresión del quiasma óptico.',
        referenceRange: 'Hipófisis homogénea sin lesiones focales',
        interpretation: 'Microadenoma corticotropo hipofisario productor de ACTH (Enfermedad de Cushing).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Síndrome de Cushing Endógeno ACTH-Dependiente (Enfermedad de Cushing por Microadenoma Hipofisario)',
      differentialDiagnoses: [
        'Síndrome de Cushing exógeno iatrogénico (descartado por interrogatorio y ACTH no suprimida)',
        'Obesidad exógena simple o síndrome metabólico (estrías pálidas <1 cm, sin miopatía proximal ni piel fina)',
        'Secreción ectópica de ACTH (carcinoide bronquial / ca microcítico de pulmón)',
        'Adenoma suprarrenal productor de cortisol (ACTH suprimida <5-10 pg/mL)',
      ],
      pathophysiology:
        'Hipersecreción autónoma de ACTH por un microadenoma hipofisario corticotropo (Enfermedad de Cushing, ~70% de los casos endógenos) que hiperestimula la corteza suprarrenal generando hipercortisolismo crónico con catabolismo proteico (estrías anchas, equimosis, miopatía), redistribución grasa central, resistencia insulínica e hipertensión.',
      keyClinicalClues: [
        'Signos discriminantes específicos: estrías rojo-violáceas >1 cm, miopatía proximal, plétora facial y equimosis fáciles',
        'Falta de supresión con dexametasona 1 mg + cortisol libre urinario elevado + ACTH elevada (68 pg/mL)',
        'RMN hipofisaria con microadenoma de 7 mm',
      ],
      characteristicSignsSymptoms: [
        'Estrías violáceas anchas (>1 cm) y piel atrófica con equimosis',
        'Miopatía proximal de cinturas y obesidad centrípeta',
        'HTA, hiperglucemia secundaria y amenorrea',
      ],
      criticalRulingOutFactors: [
        'Estrías >1 cm + equimosis espontáneas + miopatía proximal distinguen Cushing verdadero de pseudo-Cushing/obesidad común; ACTH elevada localiza origen hipofisario/ectópico y excluye tumor suprarrenal.',
      ],
      recommendedWorkup: ['Descartar esteroides exógenos primero; 2 pruebas de 1.ª línea (Nugent 1 mg Dex, cortisol urinario 24h, cortisol salival nocturno) -> ACTH -> RMN hipofisaria'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Control metabólico/tensional puente (IECA/ARA-II + Metformina) e inhibidores de esteroidogénesis si espera cirugía (Ketoconazol / Osilodrostat por Endocrinología)',
            dose: 'Losartán 50 mg c/24 h + Metformina 850 mg c/12 h (preparación preoperatoria)',
            route: 'Vía Oral',
            frequency: 'Diaria',
            duration: 'Preoperatoria hasta resección curativa',
            rationale: 'Controla riesgo cardiovascular, hiperglucemia e hipertensión mientras se programa resección hipofisaria.',
          },
        ],
        generalMeasures: [
          'Tratamiento definitivo de primera línea: Resección quirúrgica transesfenoidal selectiva del microadenoma hipofisario por Neurocirugía experta.',
          'Profilaxis tromboembólica perioperatoria (alto riesgo de TVP/TEP en hipercortisolismo) y cobertura transitoria con hidrocortisona postoperatoria hasta recuperar eje hipotálamo-hipófisis-suprarrenal.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Confirmación bioquímica para manejo conjunto por Endocrinología y Neurocirugía transesfenoidal.'],
        followUp: 'Seguimiento estrecho endocrinológico para vigilar remisión bioquímica y recuperación del eje adrenal post-cirugía.',
      },
      criticalSafetyAlerts: [
        'Siempre descartar uso oculto de esteroides (cremas, infiltraciones, remedios "milagro" para artritis) antes de iniciar estudios complejos.',
        'Tras resección exitosa del adenoma corticotropo, el eje adrenal queda suprimido y requiere reemplazo temporal con hidrocortisona para evitar crisis suprarrenal.',
      ],
      guidelineReferences: [
        'Pituitary Society Consensus Guideline on Diagnosis and Management of Cushing’s Disease',
      ],
    },
    internalPersonaPrompt:
      'Habla como Lorena, de 35 años. Subiste 12 kilos solo en cara y abdomen mientras tus piernas adelgazaron y te cuesta levantarte de la silla; te salieron estrías moradas anchas y moretones sin golpearte.',
  },
  {
    id: 'case-exp-rare-porfiria',
    mode: 'examen',
    specialty: 'medicina_interna',
    patientInfo: {
      name: 'Sofía Raquel Alarcón',
      age: 28,
      sex: 'Femenino',
      occupation: 'Fotógrafa',
      consultReason: 'Dolor abdominal intenso recurrente, cambio en el color de la orina y confusión',
      evolutionTime: '4 días de evolución',
      currentIllness:
        'Paciente femenina de 28 años traída a Urgencias por dolor abdominal difuso severísimo de tipo cólico desde hace cuatro días, acompañado de estreñimiento pertinaz, náuseas, vómitos, debilidad progresiva en brazos y piernas, ansiedad extrema y alucinaciones leves desde anoche. Ha acudido dos veces antes a urgencias por cuadros idénticos tras ayunos prolongados o antes de su menstruación, incluso con laparoscopía blanca el año pasado. Refiere que su orina se torna color rojo-vino oscuro si se deja en el recipiente al sol.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '158/98 mmHg',
      heartRate: 124,
      respiratoryRate: 20,
      temperature: 36.9,
      oxygenSaturation: 99,
      glasgow: 14,
      bloodGlucose: 84,
      weightKg: 54,
      heightCm: 164,
    },
    background: {
      pathological: ['Múltiples episodios previos de "abdomen agudo" sin hallazgos quirúrgicos.'],
      nonPathological: ['Inició dieta cetogénica estricta de ayuno hace 6 días; recibió trimetoprim-sulfametoxazol hace 5 días por supuesta cistitis y empeoró drásticamente.'],
      family: ['Madre con hipertensión arterial controlada; padre sano.'],
      surgical: ['Apendicectomía blanca (apéndice sano) hace 1 año.'],
      currentMedications: ['Trimetoprim-sulfametoxazol recién iniciado.'],
      allergies: ['Sin alergias conocidas (crisis precipitada por sulfas y ayuno).'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-porfiria-abd',
        system: 'Abdomen',
        name: 'Exploración abdominal y neurológica comparada',
        finding:
          'DESPROPORCIÓN CLÁSICA: Paciente se retuerce de dolor abdominal intenso, pero a la palpación el abdomen está blando, depresible, SIN defensa muscular ni signo de rebote. Taquicardia sinusal 124 lpm e hipertensión 158/98 mmHg (disautonomía simpática). Debilidad motora proximal simétrica (4/5) en extremidades con reflejos hipoactivos.',
        isAbnormal: true,
        semiologyNote:
          'Dolor abdominal severo con abdomen blando sin peritonismo + hiponatremia + taquicardia/HTA + neuropatía + orina roja al sol + desencadenante sulfas/ayuno = Porfiria Aguda Intermitente.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-porfiria-elec',
        category: 'Laboratorio',
        subcategory: 'Electrolitos',
        name: 'Electrolitos séricos, Química y TAC abdominal previo',
        result: 'Na+: 121 mEq/L (hiponatremia severa por SIADH) | K+: 3.9 mEq/L | Leucocitos: 8,200 /mm³ | Amilasa/Lipasa normales | TAC abdomen: completamente normal sin obstrucción ni inflamación.',
        referenceRange: 'Na+ 135-145 mEq/L',
        interpretation: 'Hiponatremia severa inexplicada junto con dolor abdominal intenso y TAC normal sugiere fuertemente crisis neurovisceral porfírica.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-porfiria-pbg',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Porfobilinógeno (PBG) y Ácido Delta-Aminolevulínico (ALA) en orina puntual (protegida de la luz)',
        result: 'Porfobilinógeno (PBG) en orina: 88 mg/g creatinina (MARCADAMENTE ELEVADO >20x lo normal) | ALA urinario: elevado 15x | La muestra de orina adquiere color rojo-vino oscuro al exponerse a la luz.',
        referenceRange: 'PBG urinario <2 mg/g creatinina',
        interpretation: 'Confirmación bioquímica diagnóstica de crisis aguda de Porfiria Aguda Intermitente.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Porfiria Aguda Intermitente (Crisis Neurovisceral Aguda con Hiponatremia)',
      differentialDiagnoses: [
        'Abdomen agudo quirúrgico / obstrucción intestinal (descartada por TAC normal y abdomen blando)',
        'Síndrome de Guillain-Barré (cursa sin dolor abdominal severo disautonómico ni PBG elevado)',
        'Intoxicación por plomo (saturnismo: ribete de Burton, punteado basófilo)',
        'Crisis suprarrenal aguda',
      ],
      pathophysiology:
        'Deficiencia parcial autosómica dominante de porfobilinógeno desaminasa (HMBS); el ayuno, fase lútea o fármacos inductores de CYP450 (sulfas, barbitúricos, fenitoína, carbamazepina, metoclopramida) desinhiben la enzima ALA sintasa-1 acumulando neurotóxicos ALA y PBG que causan neuropatía autonómica (dolor abdominal, HTA, taquicardia), periférica y SIADH (hiponatremia).',
      keyClinicalClues: [
        'Mujer joven con dolor abdominal severo recurrente desproporcionado a abdomen blando y cirugía previa blanca',
        'Precipitada por ayuno/dieta cetogénica y TMP-SMX (sulfa porfirinogénica)',
        'Hiponatremia (Na 121) + taquicardia/HTA + neuropatía + orina vino al sol + PBG urinario muy elevado',
      ],
      characteristicSignsSymptoms: [
        'Dolor abdominal intenso sin signos de irritación peritoneal',
        'Disautonomía (HTA, taquicardia), neuropatía e hiponatremia',
        'Orina oscura rojiza al exponerse a la luz y PBG urinario elevado',
      ],
      criticalRulingOutFactors: [
        'PBG urinario masivamente elevado durante la crisis confirma de inmediato porfiria hepática aguda y evita laparotomías innecesarias.',
      ],
      recommendedWorkup: ['Porfobilinógeno (PBG) y ALA en muestra única de orina protegida de luz, electrolitos séricos y revisión de lista de fármacos seguros'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Hemina intravenosa (Arginato de hemina / Panhematin — tratamiento específico de elección)',
            dose: '3 a 4 mg/kg/día',
            route: 'Intravenosa (infusión en vena de buen calibre o vía central)',
            frequency: 'Cada 24 horas',
            duration: '4 días consecutivos',
            rationale: 'Inhibe por retroalimentación negativa la enzima ALA sintasa-1 hepática, frenando de raíz la producción tóxica de ALA y PBG.',
          },
          {
            drug: 'Carga glucosada intravenosa (Dextrosa 10% IV continua a 300-400 g/día como puente urgente) + Analgesia segura (Morfina o Fentanilo IV)',
            dose: 'Dextrosa 10% 100-125 mL/h (vigilando Na+ sérico) + Morfina IV titulada',
            route: 'Intravenosa',
            frequency: 'Infusión continua / analgesia horaria',
            duration: 'Hasta disponer e iniciar hemina IV',
            rationale: 'La glucosa reprime transitoriamente la ALA sintasa-1; los opioides puros (morfina/fentanilo) son seguros para dolor agudo.',
          },
        ],
        generalMeasures: [
          'SUSPENDER DE INMEDIATO trimetoprim-sulfametoxazol y verificar TODA medicación en base segura de porfirias (NAPOS / American Porphyria Foundation).',
          'Corregir lentamente hiponatremia (cuidado con dextrosa hipotónica en SIADH si no se vigila Na+ horario; combinar con aporte salino cuidadoso).',
          'Vigilar fuerza inspiratoria/respiratoria en UCI por riesgo de parálisis bulbar/respiratoria.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Crisis aguda neurovisceral con hiponatremia y debilidad motora requiere ingreso a UCI y suministro urgente de Hemina.'],
        followUp: 'Educación sobre fármacos prohibidos, evitar ayunos prolongados/alcohol y consejería genética familiar.',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar metoclopramida, sulfonamidas, fenitoína, carbamazepina, valproato, barbitúricos, metamizol ni diclofenaco: agravan mortalmente la crisis porfírica.',
        'La administración rápida de dextrosa sin monitoreo sódico en SIADH puede empeorar hiponatremia si no se balancea con sodio/hemina.',
      ],
      guidelineReferences: [
        'AGA Clinical Practice Update on Diagnosis and Management of Acute Hepatic Porphyrias (2023)',
      ],
    },
    internalPersonaPrompt:
      'Habla adolorida y algo confusa como Sofía, de 28 años. Tienes un dolor de panza horrible que ya te hizo operar hace un año sin encontrar nada; empezaste una dieta sin carbohidratos y sulfas hace días y tu orina se oscurece como vino.',
  },
  {
    id: 'case-exp-rare-takotsubo',
    mode: 'residente',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Martha Eugenia Figueroa',
      age: 64,
      sex: 'Femenino',
      occupation: 'Profesora jubilada',
      consultReason: 'Dolor opresivo agudo en el pecho y falta de aire de inicio reciente',
      evolutionTime: '3 horas de evolución',
      currentIllness:
        'Paciente femenina de 64 años posmenopáusica que llega a Urgencias con dolor retroesternal opresivo intenso irradiado a cuello y falta de aire iniciados hace tres horas, exactamente quince minutos después de presenciar un accidente grave de su nieto (quien resultó ileso finalmente). Niega diabetes, tabaquismo o angina previa.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '104/68 mmHg',
      heartRate: 104,
      respiratoryRate: 22,
      temperature: 36.6,
      oxygenSaturation: 93,
      glasgow: 15,
      bloodGlucose: 116,
      weightKg: 62,
      heightCm: 160,
    },
    background: {
      pathological: ['Hipotiroidismo leve controlado con levotiroxina 50 mcg/día; niega cardiopatía previa.'],
      nonPathological: ['No fuma; estrés emocional extremo agudo hace 3 horas.'],
      family: ['Sin antecedentes familiares relevantes referidos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Levotiroxina 50 mcg cada 24 h.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-tako-cardio',
        system: 'Cardiovascular',
        name: 'Exploración cardiopulmonar',
        finding:
          'Paciente ansiosa con disnea leve. Ruidos cardíacos taquicárdicos rítmicos con soplo sistólico suave en foco mitral (posible insuficiencia mitral transitoria por movimiento sistólico anterior) y escasos estertores crepitantes bibasales finos.',
        isAbnormal: true,
        semiologyNote: 'Clínica indistinguible inicialmente de IAMCEST en mujer posmenopáusica tras estrés emocional súbito.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-tako-ecg',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Elevación difusa del segmento ST en V2-V6 y DI/aVL seguida de inversión profunda simétrica de ondas T y prolongación del intervalo QTc (505 ms).',
        referenceRange: 'Segmento ST isoeléctrico | QTc <460 ms',
        interpretation: 'Simula IAMCEST anterior extenso con QTc prolongado; obliga coronariografía urgente para descartar oclusión coronaria.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-tako-cat',
        category: 'Imagen',
        subcategory: 'Cardiovascular',
        name: 'Coronariografía Urgente + Ventriculografía / Ecocardiograma + Troponina/BNP',
        result:
          'Coronariografía: Arterias coronarias epicárdicas SIN lesiones obstructivas significativas. Ventriculografía/Eco: Acinesia apical y medioventricular circunferencial con hipercontractilidad compensadora basal ("abombamiento apical en forma de trampa de pulpo / tako-tsubo"), FEVI 36%. Troponina I levemente elevada (420 ng/L, desproporcionadamente baja respecto al área acinética) y NT-proBNP muy elevado (4,800 pg/mL).',
        referenceRange: 'Coronarias sin estenosis | FEVI ≥55% | Troponina <19 ng/L',
        interpretation: 'Cumple criterios diagnósticos InterTAK para Miocardiopatía de Estrés (Síndrome de Takotsubo) tras excluir oclusión coronaria.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Miocardiopatía de Estrés (Síndrome de Takotsubo / Abombamiento Apical Transitorio)',
      differentialDiagnoses: [
        'Infarto agudo de miocardio con elevación del ST (IAMCEST) por oclusión de descendente anterior (descartado en coronariografía)',
        'Miocarditis aguda viral (suele tener pródromo infeccioso y realce tardío no coronario en RMN)',
        'Feocromocitoma (desencadenante catecolaminérgico oculto)',
        'Disección espontánea de arteria coronaria (DEAC)',
      ],
      pathophysiology:
        'Descarga catecolaminérgica masiva desencadenada por estrés emocional o físico agudo en mujeres posmenopáusicas, induciendo aturdimiento miocárdico mediado por receptores beta-2 en el ápex ventricular (disfunción apical transitoria con hipercontractilidad basal) sin oclusión coronaria aterotrombótica.',
      keyClinicalClues: [
        'Mujer posmenopáusica con dolor torácico y elevación del ST inmediatamente tras trauma emocional intenso',
        'Coronarias limpias sin lesiones obstructivas + acinesia apical con hipercontractilidad basal ("abombamiento apical")',
        'Disociación troponina moderada vs NT-proBNP muy alto y QTc prolongado',
      ],
      characteristicSignsSymptoms: [
        'Dolor anginoso tras estrés emocional o físico intenso',
        'Coronariografía sin estenosis coronaria obstructiva',
        'Acinesia apical transitoria en "tako-tsubo" con recuperación en semanas',
      ],
      criticalRulingOutFactors: [
        'Nunca diagnosticar Takotsubo sin coronariografía/angio-TAC que descarte IAMCEST agudo mientras el paciente está en ventana.',
      ],
      recommendedWorkup: ['ECG inmediato, troponina, NT-proBNP, ecocardiograma urgente y coronariografía emergente para descartar SCA/IAMCEST'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Manejo inicial tipo SCA hasta coronariografía; luego IECA/ARA-II (Enalapril/Ramipril) + Betabloqueador (Carvedilol/Metoprolol solo si NO hay obstrucción del tracto de salida VI ni bradicardia/QTc extremo)',
            dose: 'Ramipril 2.5-5 mg VO c/24 h + Furosemida IV si congestión pulmonar',
            route: 'Vía Oral / IV en UCC',
            frequency: 'Diaria bajo telemetría cardíaca',
            duration: 'Hasta recuperación completa de FEVI (usualmente 4-8 semanas)',
            rationale: 'Protege contra remodelado y arritmias ventriculares; evitar catecolaminas exógenas (dobutamina/adrenalina) si hay obstrucción dinámica del TSVI.',
          },
        ],
        generalMeasures: [
          'Telemetría continua en Unidad Coronaria durante 48-72 h por riesgo de Torsades de Pointes (QTc prolongado >500 ms), obstrucción del TSVI o trombo apical.',
          'Suspender fármacos que prolongan el QT y corregir K+/Mg2+ séricos estrictamente.',
          'Repetir ecocardiograma en 4-6 semanas para confirmar recuperación ad integrum de FEVI (y descartar miocarditis si no recupera).',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Manejo en Unidad de Cuidados Coronarios con hemodinamia disponible para coronariografía urgente.'],
        followUp: 'Ecocardiograma de control a las 4 semanas con Cardiología.',
      },
      criticalSafetyAlerts: [
        'NO omitir el protocolo de Síndrome Coronario Agudo ni la coronariografía: clínicamente y en ECG es indistinguible de un infarto anterior hasta ver las coronarias.',
        'Evitar catecolaminas inotrópicas (adrenalina, dopamina, dobutamina) y fármacos que prolonguen el QT (ondansetrón/amiodarona) si existe QTc >500 ms u obstrucción del TSVI.',
      ],
      guidelineReferences: [
        'ESC / International Takotsubo Diagnostic Criteria (InterTAK Consensus Statement)',
      ],
    },
    internalPersonaPrompt:
      'Habla angustiada como Martha, de 64 años. Hace 3 horas viste chocar el carro donde iba tu nieto y a los 15 minutos te empezó un dolor opresivo fuerte en el pecho y falta de aire.',
  },
  {
    id: 'case-exp-rare-ptt',
    mode: 'urgencias',
    specialty: 'hematologia',
    patientInfo: {
      name: 'Camila Esperanza Duarte',
      age: 34,
      sex: 'Femenino',
      occupation: 'Abogada',
      consultReason: 'Moretones espontáneos, ictericia leve, fiebre y episodios transitorios de confusión al hablar',
      evolutionTime: '3 días de evolución',
      currentIllness:
        'Paciente femenina de 34 años traída por familiares a Urgencias porque desde hace tres días presenta decaimiento intenso, fiebre de 38.2°C, aparición espontánea de múltiples puntitos rojos en piernas y brazos y moretones grandes sin golpes. Hoy notaron coloración amarillenta leve en los ojos y dos episodios de 15 minutos en los que hablaba palabras incoherentes y sentía hormigueo en la mano derecha.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '124/76 mmHg',
      heartRate: 106,
      respiratoryRate: 19,
      temperature: 38.1,
      oxygenSaturation: 98,
      glasgow: 14,
      bloodGlucose: 96,
      weightKg: 61,
      heightCm: 166,
    },
    background: {
      pathological: ['Previamente sana; sin antecedentes de lupus ni fármacos recientes nuevos.'],
      nonPathological: ['No consume alcohol ni drogas; prueba de embarazo negativa.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-ptt-gen',
        system: 'Osteomuscular y Piel',
        name: 'Exploración mucocutánea y neurológica fluctuante',
        finding:
          'Palidez cutáneo-mucosa marcada con subictericia escleral. Petequias abundantes en extremidades inferiores y equimosis en sitios de venopunción. Paciente levemente desorientada en tiempo con bradipsiquia fluctuante sin déficit motor fijo.',
        isAbnormal: true,
        semiologyNote:
          'Péntada clínica clásica (fiebre + anemia hemolítica + trombocitopenia severa + síntomas neurológicos fluctuantes + lesión renal leve) = Púrpura Trombótica Trombocitopénica.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-ptt-frotis',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática con Frotis de Sangre Periférica, LDH y Coombs',
        result:
          'Hb: 7.4 g/dL | Plaquetas: 11,000 /mm³ (críticas) | Reticulocitos: 8.5% | Frotis periférico: ESQUISTOCITOS ABUNDANTES (>4% fragmentos eritrocitarios por campo) | LDH: 1,680 U/L (extremadamente elevada) | Bilirrubina indirecta: 3.1 mg/dL | Test de Coombs directo: NEGATIVO.',
        referenceRange: 'Plaquetas 150,000-450,000 | LDH <250 U/L | Sin esquistocitos',
        interpretation: 'Anemia hemolítica microangiopática (AHMA) Coombs negativa + trombocitopenia grave (PLASMIC score alto).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-ptt-coag',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Tiempos de Coagulación (TP/TTPa/Fibrinógeno), Creatinina y ADAMTS13',
        result:
          'TP / INR: 1.04 (NORMAL) | TTPa: 29 s (NORMAL) | Fibrinógeno: 340 mg/dL (NORMAL — descarta CID) | Creatinina: 1.45 mg/dL | Muestra enviada para actividad de ADAMTS13 (resultado posterior <5% con inhibidor positivo).',
        referenceRange: 'INR <1.2 | Fibrinógeno 200-400 mg/dL | ADAMTS13 >50%',
        interpretation: 'Coagulograma normal descarta CID; confirma emergencia hematológica de Púrpura Trombótica Trombocitopénica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Púrpura Trombótica Trombocitopénica (PTT Adquirida / Microangiopatía Trombótica)',
      differentialDiagnoses: [
        'Coagulación intravascular diseminada (CID: TP/TTPa prolongados y fibrinógeno bajo)',
        'Síndrome hemolítico urémico (SHU: predominio de falla renal grave tras diarrea sanguinolenta)',
        'Púrpura trombocitopénica inmune (PTI: sin esquistocitos, sin hemólisis ni clínica neurológica)',
        'Síndrome de Evans o crisis esclerodérmica / preeclampsia-HELLP',
      ],
      pathophysiology:
        'Autoanticuerpos contra la metaloproteasa ADAMTS13 impiden escindir los multímeros ultragrandes del factor de von Willebrand (vWF), provocando agregación plaquetaria microvascular masiva, trombos ricos en plaquetas en microcirculación cerebral/renal/cardíaca y fragmentación mecánica de eritrocitos (esquistocitos).',
      keyClinicalClues: [
        'Anemia hemolítica microangiopática (esquistocitos abundantes, LDH >1,500, Coombs negativo) + trombocitopenia severa (11,000)',
        'Fiebre + síntomas neurológicos fluctuantes (confusión/afasia transitoria) + elevación discreta de creatinina',
        'TP, TTPa y fibrinógeno NORMALES (excluyendo CID)',
      ],
      characteristicSignsSymptoms: [
        'Trombocitopenia severa con esquistocitos y LDH muy alta',
        'Alteraciones neurológicas fluctuantes y fiebre',
        'Tiempos de coagulación normales (diferencia clave vs CID)',
      ],
      criticalRulingOutFactors: [
        'Tiempos de coagulación normales descartan CID; abundantes esquistocitos y síntomas neurológicos descartan PTI simple.',
      ],
      recommendedWorkup: ['Frotis de sangre periférica URGENTE buscando esquistocitos, LDH, haptoglobina, Coombs directo, TP/TTPa/fibrinógeno, creatinina y toma de muestra de ADAMTS13 antes de plasmaféresis'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Recambio Plasmático Terapéutico (PLASMAFÉRESIS) DE URGENCIA VITAL + Metilprednisolona IV',
            dose: 'Plasmaféresis diaria (1-1.5 volúmenes plasmáticos con plasma fresco congelado) + Metilprednisolona 1 g/día IV x3 días (o Prednisona 1 mg/kg/día)',
            route: 'Catéter venoso central en UCI / Hematología',
            frequency: 'Diaria hasta normalización de plaquetas >150,000 x 2 días y descenso de LDH',
            duration: 'Fase aguda hospitalaria (usualmente 5-14 sesiones; asociar Caplacizumab/Rituximab según protocolo)',
            rationale: 'La plasmaféresis remueve autoanticuerpos y repone ADAMTS13 funcional, reduciendo la mortalidad del >90% a <10-15%.',
          },
        ],
        generalMeasures: [
          'NO esperar resultado de ADAMTS13 para iniciar plasmaféresis urgente ante PLASMIC score alto (≥6) o sospecha clínica firme.',
          'Si existe demora inevitable de horas para iniciar plasmaféresis, infundir Plasma Fresco Congelado (PFC) como puente temporal.',
          'Ingreso inmediato a UCI y colocación cuidadosa de catéter de aféresis.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Emergencia hematológica con mortalidad de horas sin plasmaféresis: activar Hematología, Banco de Sangre y UCI inmediatamente.'],
        followUp: 'Seguimiento hematológico estricto por riesgo de recaídas.',
      },
      criticalSafetyAlerts: [
        'CONTRAINDICADA la transfusión profiláctica de PLAQUETAS en PTT (salvo hemorragia intracraneal o riesgo vital hemorrágico inmediato): las plaquetas transfundidas alimentan los microtrombos y precipitan infarto cerebral/miocárdico mortal.',
      ],
      guidelineReferences: [
        'ISTH Guidelines for the Diagnosis and Management of Thrombotic Thrombocytopenic Purpura (TTP)',
      ],
    },
    internalPersonaPrompt:
      'Habla algo lenta y confundida por momentos como Camila, de 34 años. Te salieron muchos puntitos rojos y moretones sin golpes, tienes fiebre, los ojos algo amarillos y por ratos se te traban las palabras.',
  },
  {
    id: 'case-exp-rare-policitemia-vera',
    mode: 'residente',
    specialty: 'hematologia',
    patientInfo: {
      name: 'Don Aurelio Santamaría',
      age: 61,
      sex: 'Masculino',
      occupation: 'Contador jubilado',
      consultReason: 'Picazón intensa en la piel, dolor de cabeza frecuente y enrojecimiento facial',
      evolutionTime: '8 meses de evolución',
      currentIllness:
        'Paciente masculino de 61 años que consulta por presentar desde hace ocho meses sensación de cabeza embotada, zumbido de oídos ocasional, ardor enrojecido en palmas y plantas y una picazón generalizada desesperante durante 30 minutos cada vez que sale de la ducha con agua caliente ("prurito acuagénico"). Su esposa nota que su rostro se ve constantemente encendido y morado-rojizo. Niega vivir en grandes alturas, EPOC o apnea del sueño.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '152/90 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 77,
      heightCm: 173,
    },
    background: {
      pathological: ['Hipertensión arterial reciente; episodio previo de gota hace 6 meses.'],
      nonPathological: ['No fuma; vive al nivel del mar (~100 msnm).'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-pv-gen',
        system: 'General',
        name: 'Inspección facial/acral y palpación abdominal esplénica',
        finding:
          'Plétora facial marcada (rubicundez facial eritrocianótica e inyección conjuntival) y eritromelalgia leve en palmas. A la palpación abdominal se detecta ESPLENOMEGALIA moderada palpable 4 cm bajo el reborde costal izquierdo. Saturación de oxígeno al aire ambiente de 98%.',
        isAbnormal: true,
        semiologyNote:
          'Plétora facial + prurito acuagénico + eritromelalgia + esplenomegalia con SpO2 normal (98%) = tríada clásica clínica de Policitemia Vera.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-pv-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa y Ácido Úrico',
        result:
          'Hemoglobina: 19.8 g/dL | Hematocrito: 59.5% | Eritrocitos: 7.1 millones/mm³ | Leucocitos: 14,600 /mm³ (panmielosis) | Plaquetas: 540,000 /mm³ | Ácido úrico: 8.9 mg/dL.',
        referenceRange: 'Hb 13.5-17.5 g/dL | Hto 40-52% | Plaquetas 150,000-450,000',
        interpretation: 'Eritrocitosis marcada acompañada de leucocitosis y trombocitosis (panmielosis trilinaje).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-pv-jak2',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Eritropoyetina (EPO) sérica y Mutación JAK2 V617F',
        result: 'Eritropoyetina (EPO) sérica: 1.4 mUI/mL (SUPRIMIDA) | Mutación JAK2 V617F en sangre periférica: POSITIVA.',
        referenceRange: 'EPO 4-24 mUI/mL | JAK2 V617F Negativo',
        interpretation: 'Criterios mayores OMS cumplidos (Hb >16.5/Hto >49% + JAK2 V617F positivo + EPO baja): confirma Policitemia Vera.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Policitemia Vera (Neoplasia Mieloproliferativa Crónica JAK2 V617F Positiva)',
      differentialDiagnoses: [
        'Policitemia secundaria a hipoxia crónica (EPOC, SAOS, altura, tabaquismo: EPO elevada y JAK2 negativo)',
        'Policitemia relativa por hemoconcentración / deshidratación (síndrome de Gaisböck)',
        'Tumor productor ectópico de eritropoyetina (carcinoma renal/hepatocarcinoma: EPO elevada)',
        'Trombocitemia esencial (predominio plaquetario sin Hto >49%)',
      ],
      pathophysiology:
        'Mutación somática activadora en el gen de la tirosina cinasa JAK2 (V617F en >95% de casos) en la célula madre hematopoyética que produce proliferación clonal independiente de eritropoyetina de series eritroide, mieloide y megacariocítica, generando hiperviscosidad sanguínea, alto riesgo trombótico y degranulación basofílica/mastocitaria con agua tibia (prurito acuagénico).',
      keyClinicalClues: [
        'Prurito acuagénico tras duchas tibias, eritromelalgia palmar, plétora facial y esplenomegalia',
        'Panmielosis: Hb 19.8 / Hto 59.5% + leucocitosis + trombocitosis con SpO2 normal (98%)',
        'Eritropoyetina (EPO) suprimida + mutación JAK2 V617F positiva',
      ],
      characteristicSignsSymptoms: [
        'Prurito acuagénico post-ducha y eritromelalgia',
        'Plétora facial y esplenomegalia',
        'Hto elevado con panmielosis + EPO baja + JAK2+',
      ],
      criticalRulingOutFactors: [
        'SpO2 normal (98%), EPO suprimida y JAK2 V617F positivo excluyen eritrocitosis secundaria hipóxica.',
      ],
      recommendedWorkup: ['Biometría hemática, EPO sérica, mutación JAK2 V617F y biopsia de médula ósea por Hematología'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ácido Acetilsalicílico (Aspirina dosis baja) + Citorreducción con Hidroxiurea (al tener ≥60 años = alto riesgo trombótico)',
            dose: 'Aspirina 100 mg VO c/24 h + Hidroxiurea (titulada por Hematología para meta Hto <45%)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Crónica supervisada por Hematología',
            rationale: 'Aspirina previene eventos trombóticos y controla eritromelalgia; edad ≥60 años clasifica alto riesgo e indica citorreducción junto con flebotomías.',
          },
        ],
        generalMeasures: [
          'Flebotomías terapéuticas seriadas (sangrías de 250-500 mL) hasta alcanzar y mantener estrictamente un HEMATOCRITO <45%.',
          'Duchas breves con agua templada-fresca (evitar agua caliente) y antihistamínicos o citorreducción para prurito acuagénico.',
          'Control estricto de factores cardiovasculares (PA, lípidos) y NO prescribir suplementos de hierro.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Todo paciente con sospecha/diagnóstico de Policitemia Vera requiere referencia prioritaria a Hematología para flebotomías y citorreducción.'],
        followUp: 'Controles semanales/quincenales de hematocrito durante fase de flebotomías hasta meta <45%.',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar hierro oral o IV para la microcitosis secundaria por flebotomías en Policitemia Vera: dispara rápidamente el hematocrito y el riesgo de trombosis.',
      ],
      guidelineReferences: [
        'WHO / ICC Diagnostic Criteria for Myeloproliferative Neoplasms & NCCN Guidelines for Polycythemia Vera',
      ],
    },
    internalPersonaPrompt:
      'Habla como Don Aurelio, de 61 años. Tienes una picazón insoportable cada vez que te bañas con agua tibia, dolor de cabeza embotada, palmas ardorosas y tu esposa dice que estás muy rojo de la cara.',
  },
  {
    id: 'case-exp-rare-granulomatosis-gpa',
    mode: 'examen',
    specialty: 'reumatologia',
    patientInfo: {
      name: 'Esteban Alejandro Quiroga',
      age: 51,
      sex: 'Masculino',
      occupation: 'Administrador de bodega',
      consultReason: 'Congestión nasal persistente, tos con pintas de sangre y disminución de la orina',
      evolutionTime: '3 meses de evolución progresiva',
      currentIllness:
        'Paciente masculino de 51 años que consulta porque lleva tres meses con congestión nasal severa, costras nasales sanguinolentas diarias y dolor facial que no mejoraron con tres ciclos de antibióticos para sinusitis. En las últimas dos semanas se agregó fiebre de 38.0°C, dolor articular, tos con esputo con sangre (hemoptisis leve) y ha notado descenso del volumen urinario con orina color rojizo. Refiere además caída progresiva de audición en el oído derecho.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '154/94 mmHg',
      heartRate: 96,
      respiratoryRate: 22,
      temperature: 38.0,
      oxygenSaturation: 93,
      glasgow: 15,
      bloodGlucose: 102,
      weightKg: 76,
      heightCm: 175,
    },
    background: {
      pathological: ['Diagnóstico previo erróneo de "sinusitis crónica refractaria" tratado con 3 antibióticos sin éxito.'],
      nonPathological: ['No fuma; niega consumo de cocaína intranasal ni exposición tuberculosa conocida.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Terminó amoxicilina-clavulanato hace 1 semana sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-gpa-orl',
        system: 'Cabeza y Cuello',
        name: 'Exploración ORL nasal y otoscopia',
        finding:
          'Ligero hundimiento incipiente del puente nasal ("nariz en silla de montar" temprana), mucosa nasal friable con costras hemorrágicas abundantes y perforación septal anterior de 6 mm. Derrame seroso en oído medio derecho (otitis media serosa).',
        isAbnormal: true,
        semiologyNote:
          'Tríada de vía aérea superior (sinusitis hemorrágica/perforación septal) + pulmonar (hemoptisis/nódulos cavitados) + renal (glomerulonefritis) = Granulomatosis con Poliangeítis.',
      },
      {
        id: 'pe-exp-gpa-pulm',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar y piel',
        finding: 'Estertores gruesos escasos bilaterales; algunas lesiones purpúricas palpables en tobillos.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-gpa-anca',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'Panel ANCA (c-ANCA / Anti-PR3 y p-ANCA / Anti-MPO), Creatinina y EGO',
        result:
          'c-ANCA: POSITIVO (1:320) con Anti-PR3 (Proteinasa-3): 145 U/mL (Muy positivo) | Anti-MPO: Negativo | Creatinina: 2.6 mg/dL (subió desde 0.9 basal) | EGO: Hematuria +++, eritrocitos dismórficos, cilindros hemáticos y proteinuria ++.',
        referenceRange: 'ANCA negativo | Anti-PR3 <20 U/mL | Creatinina 0.7-1.3 mg/dL',
        interpretation: 'Vasculitis asociada a ANCA (c-ANCA/PR3+) con glomerulonefritis rápidamente progresiva activa.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-gpa-tac',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'TAC de Tórax de Alta Resolución y Senos Paranasales',
        result: 'TAC Tórax: Múltiples nódulos pulmonares bilaterales de hasta 2.8 cm, dos de ellos con cavitación central y halo en vidrio deslustrado circundante (hemorragia alveolar focal). TAC Senos: Engrosamiento mucoso pansinusal con erosión ósea del tabique nasal.',
        referenceRange: 'Parénquima pulmonar sin nódulos cavitados',
        interpretation: 'Compromiso granulomatoso clásico de tracto respiratorio superior e inferior.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Granulomatosis con Poliangeítis (Vasculitis c-ANCA / Anti-PR3 Positiva)',
      differentialDiagnoses: [
        'Tuberculosis pulmonar diseminada (BAAR/GeneXpert negativo, sin glomerulonefritis c-ANCA+)',
        'Síndrome de Goodpasture (anti-MBG positivo, sin sinusitis destructiva)',
        'Poliangeítis microscópica o granulomatosis eosinofílica con poliangeítis (p-ANCA/MPO+)',
        'Lesión nasal por consumo crónico de cocaína o linfoma T/NK extranodal',
      ],
      pathophysiology:
        'Vasculitis necrotizante granulomatosa de vasos pequeños y medianos mediada por anticuerpos anticitoplasma de neutrófilos patrón citoplasmático dirigidos contra Proteinasa-3 (c-ANCA/PR3), lesionando clásicamente la tríada vía aérea superior (senos/tabique/oído), pulmón (nódulos cavitados/hemorragia alveolar) y riñón (glomerulonefritis pauciinmune rápidamente progresiva).',
      keyClinicalClues: [
        'Sinusitis crónica destructiva con costras hemorrágicas y perforación septal refractaria a antibióticos',
        'Hemoptisis con nódulos pulmonares bilaterales cavitados',
        'Glomerulonefritis rápidamente progresiva (creatinina 2.6 + hematuria glomerular) con c-ANCA / anti-PR3 fuertemente positivos',
      ],
      characteristicSignsSymptoms: [
        'Tríada vía aérea superior (sinusitis/epistaxis/otitis) + pulmón + riñón',
        'Nódulos pulmonares cavitados bilaterales',
        'c-ANCA (anti-PR3) positivo con sedimento nefrítico',
      ],
      criticalRulingOutFactors: [
        'c-ANCA/PR3 positivo + compromiso pansinusal destructivo diferencia GPA de Goodpasture y TB.',
      ],
      recommendedWorkup: ['ANCA (IFI + ELISA PR3/MPO), creatinina, EGO con sedimento, TAC tórax/senos y biopsia renal o respiratoria urgente'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Pulsos de Metilprednisolona IV + Rituximab (o Ciclofosfamida) para inducción urgente',
            dose: 'Metilprednisolona 500-1,000 mg IV c/24 h x3 días (luego Prednisona en descenso + Avacopan/Rituximab 375 mg/m² semanal x4 o Ciclofosfamida)',
            route: 'Intravenosa hospitalaria',
            frequency: 'Esquema de inducción inmunosupresora urgente',
            duration: 'Inducción aguda seguida de mantenimiento (Rituximab/Azatioprina)',
            rationale: 'Inmunosupresión agresiva inmediata salva función renal irreversible y previene hemorragia alveolar masiva mortal.',
          },
          {
            drug: 'Trimetoprim-Sulfametoxazol profiláctico (después de iniciar inmunosupresión)',
            dose: '160/800 mg VO 3 veces por semana (o diario según ajuste renal)',
            route: 'Vía Oral',
            frequency: '3 veces/semana',
            duration: 'Durante terapia con Rituximab/Ciclofosfamida + esteroides altos',
            rationale: 'Profilaxis obligatoria contra neumonía por Pneumocystis jirovecii.',
          },
        ],
        generalMeasures: [
          'Hospitalización urgente para monitoreo respiratorio (riesgo de hemorragia alveolar difusa) y función renal.',
          'Descartar infección activa oculta (hemocultivos, BAAR/GeneXpert) en paralelo sin retrasar pulsos ante compromiso orgánico crítico.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Toda vasculitis ANCA con glomerulonefritis rápidamente progresiva o hemoptisis requiere ingreso inmediato con Reumatología y Nefrología.'],
        followUp: 'Mantenimiento inmunosupresor prolongado y monitoreo estrecho de recaídas y función renal.',
      },
      criticalSafetyAlerts: [
        'No seguir rotando ciclos de antibióticos creyendo que es sinusitis común cuando hay costras hemorrágicas, hemoptisis o deterioro renal: cada día de retraso pierde nefronas irreversibles.',
      ],
      guidelineReferences: [
        'EULAR 2022 Recommendations for the Management of ANCA-Associated Vasculitis',
        'ACR/VF Guideline for the Management of ANCA-Associated Vasculitis',
      ],
    },
    internalPersonaPrompt:
      'Habla preocupado como Esteban, de 51 años. Llevas 3 meses con nariz tapada y costras con sangre que no mejoraron con 3 antibióticos, y ahora toses sangre leve y orinas poco y oscuro.',
  },
  {
    id: 'case-exp-rare-wilson',
    mode: 'residente',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Mateo Sebastián Quiroz',
      age: 21,
      sex: 'Masculino',
      occupation: 'Estudiante de ingeniería',
      consultReason: 'Temblor en las manos, dificultad para articular palabras y coloración amarillenta en los ojos',
      evolutionTime: '5 meses de evolución progresiva',
      currentIllness:
        'Paciente masculino de 21 años traído por sus padres porque en los últimos cinco meses ha presentado deterioro progresivo del rendimiento académico, cambios de conducta con irritabilidad, dificultad para articular palabras con claridad, salivación excesiva y un temblor grueso en ambos brazos al sostener objetos ("como aleteo"). Hace tres semanas notaron coloración amarillenta leve en los ojos. Niega consumo de alcohol, drogas o fármacos psiquiátricos.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 64,
      heightCm: 175,
    },
    background: {
      pathological: ['Episodio inexplicado de "hepatitis" autolimitada hace 2 años con serologías virales negativas.'],
      nonPathological: ['Abstemio absoluto de alcohol y drogas.'],
      family: ['Padres y hermano menor aparentemente sanos; sin antecedentes relevantes conocidos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-wilson-neuro',
        system: 'Cabeza y Cuello',
        name: 'Exploración ocular, neurológica y hepática',
        finding:
          'Subictericia escleral leve. A la inspección de limbo corneal (confirmado con lámpara de hendidura) se observa anillo pigmentado pardo-verdoso periférico bilateral (ANILLOS DE KAYSER-FLEISCHER). Disartria moderada, distonía facial leve ("sonrisa sardónica") y temblor postural/cinético proximal amplio ("en batimiento de alas"). Hepatomegalia firme leve y esplenomegalia discreta.',
        isAbnormal: true,
        semiologyNote:
          'Joven <35 años con hepatopatía crónica inexplicable + trastorno neuropsiquiátrico/movimiento + Anillos de Kayser-Fleischer = Enfermedad de Wilson.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-wilson-cobre',
        category: 'Laboratorio',
        subcategory: 'Función Hepática',
        name: 'Ceruloplasmina sérica, Cobre urinario de 24 h y Pruebas Hepáticas',
        result:
          'Ceruloplasmina sérica: 7 mg/dL (MARCADAMENTE BAJA) | Cobre urinario en 24 h: 240 mcg/24 h (MUY ELEVADO) | AST: 124 U/L | ALT: 108 U/L | Bilirrubina total: 2.3 mg/dL | Fosfatasa alcalina: 48 U/L (característicamente baja respecto a bilirrubina) | Hb: 11.2 g/dL con Coombs negativo.',
        referenceRange: 'Ceruloplasmina 20-40 mg/dL | Cobre urinario 24h <40 mcg/24 h',
        interpretation: 'Perfil diagnóstico clásico de Enfermedad de Wilson (ceruloplasmina baja + hipercupriuria + anillos de Kayser-Fleischer).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-wilson-rmn',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Resonancia Magnética cerebral (ponderada en T2/FLAIR)',
        result: 'Hiperintensidad bilateral simétrica en putamen, globo pálido y mesencéfalo ("signo de la cara del panda gigante").',
        referenceRange: 'Ganglios basales sin alteraciones de señal',
        interpretation: 'Hallazgo neuroimagenológico característico de depósito tóxico de cobre en Enfermedad de Wilson.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad de Wilson (Degeneración Hepatolenticular)',
      differentialDiagnoses: [
        'Hepatitis autoinmune o hepatitis viral crónica',
        'Enfermedad de Parkinson juvenil / distonía genética primaria',
        'Esquizofrenia o trastorno psiquiátrico primario sin base metabólica',
        'Enfermedad de Huntington',
      ],
      pathophysiology:
        'Mutación autosómica recesiva en el gen ATP7B (cromosoma 13) que impide la excreción biliar hepática de cobre y su incorporación a la ceruloplasmina, provocando acumulación tóxica progresiva de cobre en hepatocitos, ganglios basales cerebrales (putamen/globo pálido), córnea (membrana de Descemet) y eritrocitos.',
      keyClinicalClues: [
        'Adulto joven (<35 años) con combinación de hepatopatía crónica inexplicable + síntomas neuropsiquiátricos/extrapiramidales',
        'Anillos corneales pardo-verdosos de Kayser-Fleischer bilaterales',
        'Ceruloplasmina muy baja (<20 mg/dL) + cobre urinario 24 h >100 mcg + fosfatasa alcalina baja',
      ],
      characteristicSignsSymptoms: [
        'Anillos de Kayser-Fleischer en córnea',
        'Disartria, temblor "en aleteo" y cambios conductuales en joven',
        'Hepatopatía + ceruloplasmina baja + hipercupriuria',
      ],
      criticalRulingOutFactors: [
        'Evaluar SIEMPRE enfermedad de Wilson en todo paciente <40 años con hepatitis crónica no aclarada o trastorno del movimiento.',
      ],
      recommendedWorkup: ['Lámpara de hendidura (Kayser-Fleischer), ceruloplasmina sérica, cobre urinario 24 h, PFH/TP/BH, RMN cerebral y tamizaje genético ATP7B a hermanos'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Trientina (quelante preferido si síntomas neurológicos por menor riesgo de empeoramiento inicial) o D-Penicilamina + Piridoxina',
            dose: 'Trientina 250-500 mg VO c/8-12 h alejada de alimentos (o D-Penicilamina con escalado muy gradual)',
            route: 'Vía Oral',
            frequency: 'Cada 8 a 12 horas (1 h antes o 2 h después de comidas)',
            duration: 'Tratamiento quelante de por vida (transición eventual a Acetato de Zinc de mantenimiento)',
            rationale: 'Promueve la excreción urinaria del cobre acumulado deteniendo progresión hepática y neurológica.',
          },
        ],
        generalMeasures: [
          'Dieta estricta baja en cobre (evitar mariscos/crustáceos, vísceras/hígado, chocolate, nueces y hongos, especialmente el primer año).',
          'Tamizaje OBLIGATORIO de todos los hermanos de primer grado aunque estén asintomáticos (25% de probabilidad de padecer la enfermedad).',
          'Evitar alcohol y fármacos hepatotóxicos.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Manejo conjunto por Gastroenterología/Hepatología y Neurología; evaluación urgente de trasplante hepático si evoluciona a falla hepática aguda con hemólisis Coombs negativa.'],
        followUp: 'Monitoreo periódico de cobre libre, cupriuria 24 h, biometría y EGO (vigilar toxicidad renal/hematológica de quelantes).',
      },
      criticalSafetyAlerts: [
        'Iniciar quelantes (especialmente D-penicilamina) con titulación muy lenta en pacientes con síntomas neurológicos para evitar empeoramiento neurológico paradójico inicial (Trientina o Zinc son más seguros en neuro-Wilson).',
        'Siempre examinar a los hermanos del paciente.',
      ],
      guidelineReferences: [
        'AASLD 2022 Practice Guidance on Wilson Disease',
        'EASL Clinical Practice Guidelines: Wilson’s Disease',
      ],
    },
    internalPersonaPrompt:
      'Habla con pronunciación algo arrastrada como Mateo, de 21 años. Desde hace meses te tiemblan los brazos como aleteo, arrastras las palabras, cambiaste de carácter y hace poco se pusieron tus ojos amarillos; nunca tomas alcohol.',
  },
  {
    id: 'case-exp-rare-intox-litio',
    mode: 'residente',
    specialty: 'toxicologia',
    patientInfo: {
      name: 'Roberto Fabián Morales',
      age: 56,
      sex: 'Masculino',
      occupation: 'Bibliotecario',
      consultReason: 'Temblor intenso, inestabilidad al caminar, diarrea y confusión',
      evolutionTime: '3 días de evolución progresiva',
      currentIllness:
        'Paciente masculino de 56 años con trastorno bipolar controlado desde hace 12 años con carbonato de litio, traído por su esposa porque desde hace tres días presenta temblor grueso en ambas manos, torpeza al caminar como si estuviera ebrio, habla arrastrada, náuseas y somnolencia progresiva. Hace una semana inició ibuprofeno 600 mg cada 8 horas por dolor de rodilla y hace cuatro días su médico familiar añadió hidroclorotiazida por presión arterial alta. No ha tomado sobredosis intencional.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '110/68 mmHg',
      heartRate: 62,
      respiratoryRate: 16,
      temperature: 36.7,
      oxygenSaturation: 98,
      glasgow: 13,
      bloodGlucose: 98,
      weightKg: 76,
      heightCm: 173,
    },
    background: {
      pathological: ['Trastorno bipolar tipo I estable en tratamiento crónico con litio; HTA recién diagnosticada.'],
      nonPathological: ['Disminución reciente de ingesta hídrica por náuseas.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Carbonato de litio 300 mg cada 8 h (900 mg/día), Ibuprofeno 600 mg c/8 h hace 7 días, Hidroclorotiazida 25 mg c/24 h hace 4 días.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-litio-neuro',
        system: 'Neurológico',
        name: 'Exploración neurológica cerebelosa y neuromuscular',
        finding:
          'Paciente somnoliento y lento para responder (Glasgow 13: O3 V4 M6). Disartria marcada, nistagmo horizontal bilateral, ataxia troncal y de la marcha incapaz de caminar sin ayuda, temblor postural/intencional grueso en extremidades, fasciculaciones discretas e hiperreflexia generalizada con clonus aquíleo bilateral no sostenido.',
        isAbnormal: true,
        semiologyNote:
          'Ataxia + disartria + temblor grueso + hiperreflexia + confusión en usuario crónico de litio tras iniciar AINE + tiazida = Toxicidad Crónica Agudizada por Litio.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-litio-litemia',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Litemia sérica (Litio en sangre), Electrolitos y Función Renal',
        result:
          'Litemia sérica: 2.7 mEq/L (TÓXICO GRAVE; rango terapéutico 0.6-1.2 mEq/L) | Creatinina: 1.9 mg/dL (LRA por AINE/depleción) | Na+: 133 mEq/L | K+: 3.4 mEq/L | TSH: 4.9 mUI/L.',
        referenceRange: 'Litemia terapéutica 0.6-1.2 mEq/L | Creatinina 0.7-1.3 mg/dL',
        interpretation: 'Intoxicación crónica agudizada grave por litio (litemia 2.7 mEq/L con signos neurológicos severos y LRA) precipitada por ibuprofeno + tiazida.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-litio-ecg',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Bradicardia sinusal leve a 58 lpm, aplanamiento difuso de ondas T y prolongación leve del intervalo QTc (482 ms).',
        referenceRange: 'Ritmo sinusal 60-100 lpm sin cambios de repolarización',
        interpretation: 'Cambios electrocardiográficos clásicos de toxicidad por litio.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Intoxicación Crónica Agudizada por Litio (Precipitada por AINE y Diurético Tiazídico)',
      differentialDiagnoses: [
        'Evento vascular cerebral cerebeloso o de tronco encefálico',
        'Síndrome serotoninérgico (fiebre alta, rigidez extrema, antecedente ISRS)',
        'Encefalopatía metabólica o hiponatremia aislada',
        'Intoxicación alcohólica o por benzodiacepinas',
      ],
      pathophysiology:
        'El litio se excreta casi exclusivamente por riñón y se reabsorbe en el túbulo proximal en paralelo al sodio. La hidroclorotiazida (depleción de Na+/volumen) y el ibuprofeno (reducción de filtración glomerular vía prostaglandinas) disparan la reabsorción tubular y acumulación intracelular neurotóxica lenta de litio en SNC.',
      keyClinicalClues: [
        'Usuario crónico de litio con ataxia, disartria, temblor grueso, hiperreflexia y confusión progresiva',
        'Desencadenante farmacológico clásico: adición reciente de Ibuprofeno (AINE) + Hidroclorotiazida (tiazida)',
        'Litemia 2.7 mEq/L con lesión renal aguda (creatinina 1.9) y ondas T aplanadas en ECG',
      ],
      characteristicSignsSymptoms: [
        'Ataxia cerebelosa, disartria y temblor grueso',
        'Confusión, hiperreflexia y mioclonías',
        'Interacción clásica Litio + AINE + Tiazida/IECA',
      ],
      criticalRulingOutFactors: [
        'En intoxicación CRÓNICA, los síntomas neurológicos severos aparecen con niveles séricos más bajos (>1.5-2.5 mEq/L) que en sobredosis aguda.',
      ],
      recommendedWorkup: ['Litemia sérica seriada (c/4-6 h), creatinina, electrolitos, TSH, ECG continuo y evaluación para hemodiálisis'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Hidratación Intravenosa con Solución Salina Isotónica (NaCl 0.9%) + Valoración URGENTE de Hemodiálisis (criterios EXTRIP)',
            dose: 'Solución Salina 0.9% 150-200 mL/h IV (restaurar volemia y natriuresis favoreciendo excreción renal de litio)',
            route: 'Intravenosa (con interconsulta inmediata a Nefrología)',
            frequency: 'Infusión continua monitorizada según diuresis/PA',
            duration: 'Hasta litemia <1.0 mEq/L y resolución neurológica',
            rationale: 'El sodio intravenoso compite con el litio en la reabsorción tubular proximal; en toxicidad crónica con litemia >2.5 + neurotoxicidad/LRA está indicada hemodiálisis urgente.',
          },
        ],
        generalMeasures: [
          'SUSPENDER DE INMEDIATO carbonato de litio, ibuprofeno e hidroclorotiazida.',
          'Contactar de urgencia a Nefrología para HEMODIÁLISIS (indicada por criterios EXTRIP: alteración del estado mental/neurotoxicidad severa + insuficiencia renal + litemia >2.5 mEq/L).',
          'NO administrar carbón activado (NO adsorbe iones metálicos como el litio) ni usar diuréticos de asa/tiazidas para forzar diuresis.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Criterios EXTRIP cumplidos (neurotoxicidad severa + LRA + litemia 2.7): ingreso a UCI y hemodiálisis urgente para prevenir daño cerebeloso irreversible (SILENT).'],
        followUp: 'Monitoreo de litemia post-diálisis (por efecto rebote de redistribución tisular) y ajuste psiquiátrico posterior.',
      },
      criticalSafetyAlerts: [
        'El carbón activado NO sirve para litio; los diuréticos empeoran la toxicidad por litio.',
        'NUNCA combinar litio con AINEs, diuréticos tiazídicos ni IECA/ARA-II sin vigilancia estrecha de litemia y función renal.',
      ],
      guidelineReferences: [
        'EXTRIP Workgroup Systematic Review: Extracorporeal Treatment for Lithium Poisoning',
      ],
    },
    internalPersonaPrompt:
      'Habla lento, arrastrando las palabras y somnoliento como Roberto, de 56 años. Tomas litio hace 12 años y desde que empezaste ibuprofeno e hidroclorotiazida te tiemblan grueso las manos y caminas tambaleándote.',
  },

  // =========================================================================
  // 5 CASOS EXTRANJEROS / IMPORTADOS (MEDICINA DEL VIAJERO)
  // =========================================================================
  {
    id: 'case-exp-ext-malaria-falciparum',
    mode: 'urgencias',
    specialty: 'infectologia',
    patientInfo: {
      name: 'David Alejandro Castellanos',
      age: 33,
      sex: 'Masculino',
      occupation: 'Ingeniero de telecomunicaciones',
      consultReason: 'Fiebre muy alta con escalofríos intensos, dolor de cabeza y confusión',
      evolutionTime: '4 días de evolución',
      currentIllness:
        'Paciente masculino de 33 años traído a Urgencias por presentar desde hace cuatro días accesos de fiebre de hasta 40.0°C precedidos de escalofríos intensos que sacuden la cama, seguidos de sudoración empapante, dolor de cabeza intenso, mialgias y orina oscura desde hoy por la mañana, agregándose somnolencia y desorientación en las últimas tres horas. Regresó hace 11 días de un viaje laboral de tres semanas a Acra y zonas rurales de Ghana (África Occidental), donde no tomó profilaxis antipalúdica y sufrió múltiples picaduras de mosquitos.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '94/58 mmHg',
      heartRate: 124,
      respiratoryRate: 24,
      temperature: 39.7,
      oxygenSaturation: 96,
      glasgow: 13,
      bloodGlucose: 56,
      weightKg: 78,
      heightCm: 178,
    },
    background: {
      pathological: ['Previamente sano; sin inmunizaciones tropicales completas recientes.'],
      nonPathological: ['Viaje internacional reciente a Ghana (África Subsahariana) regresando hace 11 días; NO tomó atovacuona-proguanil ni doxiciclina profiláctica.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó paracetamol ayer sin controlar la fiebre.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-malaria-gen',
        system: 'General',
        name: 'Exploración sistémica, piel y estado neurológico',
        finding:
          'Paciente febril (39.7°C), somnoliento y desorientado (Glasgow 13: malaria cerebral incipiente), hipotenso (94/58 mmHg), pálido con ictericia escleral evidente. Sin exantema petequial ni rigidez de nuca. Esplenomegalia blanda palpable 3 cm bajo reborde costal izquierdo y hepatomegalia leve.',
        isAbnormal: true,
        semiologyNote:
          'Todo síndrome febril tras regreso de África Subsahariana sin profilaxis + hipoglucemia (56 mg/dL) + ictericia + esplenomegalia + alteración neurológica = Paludismo Grave por P. falciparum hasta demostrar lo contrario.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-malaria-gota',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Gota Gruesa, Extendido Fino y Prueba Rápida de Antígeno Palúdico (HRP2)',
        result:
          'Prueba rápida HRP2: POSITIVA para Plasmodium falciparum | Gota gruesa y extendido fino: Abundantes trofozoítos anulares intracelulares con infección múltiple de eritrocitos y formas en "aplicación/auriculares" compatibles con Plasmodium falciparum; índice de parasitemia: 7.4% (Criterio de Malaria Grave >5%).',
        referenceRange: 'Negativo para hemoparásitos',
        interpretation: 'Diagnóstico definitivo de Paludismo Grave por Plasmodium falciparum (hiperparasitemia 7.4%).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-malaria-labs',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática, Química, Lactato y Bilirrubinas',
        result:
          'Hb: 8.6 g/dL (anemia hemolítica aguda) | Plaquetas: 42,000 /mm³ | Glucosa venosa: 54 mg/dL (hipoglucemia crítica) | Bilirrubina total: 4.6 mg/dL (Indirecta 3.5) | Creatinina: 1.9 mg/dL | Lactato: 4.8 mmol/L.',
        referenceRange: 'Hb 13.5-17.5 | Plaquetas >150,000 | Glucosa 70-100 | Lactato <2.0',
        interpretation: 'Criterios múltiples OMS de malaria grave: parasitemia >5%, deterioro neurológico, hipoglucemia, hiperlactatemia, ictericia y trombocitopenia.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Paludismo (Malaria) Grave por Plasmodium falciparum (Caso Importado de África Occidental)',
      differentialDiagnoses: [
        'Fiebre tifoidea o sepsis bacteriana importada',
        'Dengue grave o fiebre amarilla',
        'Meningoencefalitis aguda bacteriana/viral',
        'Leptospirosis icterohemorrágica (enfermedad de Weil)',
      ],
      pathophysiology:
        'Transmisión por picadura de mosquito Anopheles en zona endémica (Ghana). P. falciparum invade eritrocitos de cualquier edad generando alta parasitemia, citoadherencia y secuestro microvascular en capilares cerebrales, renales y hepáticos, hemólisis masiva, hipoglucemia por consumo parasitario/disfunción hepática y acidosis láctica.',
      keyClinicalClues: [
        'Regreso hace 11 días de África Occidental (Ghana) sin profilaxis antipalúdica',
        'Fiebre alta con escalofríos, ictericia, esplenomegalia, confusión (Glasgow 13) e hipoglucemia severa (54-56 mg/dL)',
        'Gota gruesa/extendido positivo para trofozoítos de P. falciparum con parasitemia del 7.4% (>5% = grave)',
      ],
      characteristicSignsSymptoms: [
        'Fiebre en picos con escalofríos tras viaje a zona endémica',
        'Alteración neurológica, ictericia, hipoglucemia y esplenomegalia',
        'Trofozoítos anulares de P. falciparum en gota gruesa',
      ],
      criticalRulingOutFactors: [
        'La gota gruesa + test rápido confirma P. falciparum de forma inmediata; SIEMPRE corregir hipoglucemia en paciente febril confuso que vuelve de África.',
      ],
      recommendedWorkup: ['Gota gruesa y extendido fino seriados (c/12 h), prueba rápida antigénica, glucemia inmediata, lactato, BH, creatinina, PFH y hemocultivos'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Artesunato intravenoso (tratamiento de elección absoluta OMS en malaria grave) + Dextrosa IV para hipoglucemia',
            dose: 'Artesunato 2.4 mg/kg IV a las 0, 12 y 24 h (luego c/24 h hasta tolerar vía oral) + Dextrosa 50% 50 mL IV STAT (por glucosa 56 mg/dL)',
            route: 'Intravenosa en UCI',
            frequency: '0 h, 12 h, 24 h y luego cada 24 h (completar después esquema oral ACT con Arteméter-Lumefantrina 3 días)',
            duration: 'Mínimo 24 h IV (3 dosis) seguido de ciclo completo oral de 3 días de Arteméter-Lumefantrina',
            rationale: 'Artesunato IV reduce la mortalidad de malaria grave en ~35% frente a quinina al eliminar rápidamente formas anulares circulantes.',
          },
        ],
        generalMeasures: [
          'Ingreso INMEDIATO a UCI, corrección urgente de hipoglucemia (dextrosa IV + infusión de mantenimiento glucosada) e hidratación cuidadosa (evitar sobrecarga por riesgo de edema pulmonar).',
          'NO usar cloroquina (resistencia universal de P. falciparum en África Subsahariana).',
          'Repetir gota gruesa cada 12 horas para confirmar caída de parasitemia y vigilar hemólisis tardía post-artesunato.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Toda malaria por P. falciparum con criterios de gravedad (parasitemia >5%, Glasgow <15, hipoglucemia, lactato >5 o ictericia) requiere UCI y artesunato IV inmediato.'],
        followUp: 'Seguimiento semanal por 4 semanas (vigilar anemia hemolítica tardía post-artesunato).',
      },
      criticalSafetyAlerts: [
        'EMERGENCIA MÉDICA: No prescribir cloroquina para P. falciparum africano (resistencia generalizada) ni demorar artesunato IV.',
        'Corregir INMEDIATAMENTE la hipoglucemia (56 mg/dL), causa frecuente de deterioro neurológico rápido y muerte en malaria grave.',
      ],
      guidelineReferences: [
        'WHO Guidelines for Malaria (2024): Treatment of Severe Malaria',
        'CDC Guidelines for Treatment of Malaria in the United States',
      ],
    },
    internalPersonaPrompt:
      'Habla somnoliento, tembloroso de frío y algo desorientado como David, de 33 años. Volviste hace 11 días de trabajar en Ghana (África) sin tomar pastillas preventivas y tienes fiebre altísima, confusión y orina muy oscura.',
  },
  {
    id: 'case-exp-ext-fiebre-tifoidea',
    mode: 'residente',
    specialty: 'infectologia',
    patientInfo: {
      name: 'Jimena Fernanda Solís',
      age: 28,
      sex: 'Femenino',
      occupation: 'Fotógrafa documental',
      consultReason: 'Fiebre progresiva de una semana, dolor abdominal y decaimiento',
      evolutionTime: '9 días de evolución',
      currentIllness:
        'Paciente femenina de 28 años que consulta por fiebre continua que comenzó hace nueve días en forma ascendente ("en escalera") alcanzando hoy 39.4°C, acompañada de cefalea frontal intensa, malestar general marcado, dolor abdominal difuso sordo, estreñimiento inicial seguido hoy de diarrea verdosa escasa y tos seca leve. Regresó hace dos semanas de un viaje de un mes recorriendo Nueva Delhi y Varanasi (India), donde consumió alimentos callejeros y bebidas con hielo sin haber recibido vacuna antitifoidea.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 74,
      respiratoryRate: 18,
      temperature: 39.4,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 57,
      heightCm: 164,
    },
    background: {
      pathological: ['Previamente sana; no vacunada contra Salmonella Typhi ni Hepatitis A.'],
      nonPathological: ['Regresó hace 14 días de India tras consumir comida callejera y jugos con hielo no embotellado.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó paracetamol con alivio breve; no ha recibido antibióticos.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-tifoidea-gen',
        system: 'General',
        name: 'Constantes vitales, piel y exploración abdominal',
        finding:
          'DISOCIACIÓN PULSO-TEMPERATURA (Signo de Faget): Temperatura 39.4°C con frecuencia cardíaca de solo 74 lpm (bradicardia relativa). En tórax anterior y abdomen superior se observan 8 máculas rosadas pequeñas de 2-3 mm que blanquean a la vitropresión ("roséola tífica"). Lengua saburral central con bordes rojos. Abdomen blando pero doloroso en fosa ilíaca derecha sin rebote, con hepatoesplenomegalia blanda leve.',
        isAbnormal: true,
        semiologyNote:
          'Viajera que vuelve de India + fiebre en escalera + bradicardia relativa (Signo de Faget) + roséola tífica + hepatoesplenomegalia = Fiebre Tifoidea.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-tifoidea-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y Pruebas Hepáticas',
        result:
          'Hb: 12.1 g/dL | Leucocitos: 3,600 /mm³ (leucopenia con neutropenia relativa y ANEOSINOFILIA 0%) | Plaquetas: 138,000 /mm³ | AST: 96 U/L | ALT: 110 U/L.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | Eosinófilos 1-4%',
        interpretation: 'Leucopenia + aneosinofilia + transaminitis leve típicas de fiebre entérica sistémica.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-tifoidea-hemo',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Hemocultivos seriados (x2) + Coprocultivo + Gota gruesa (descarte malaria)',
        result:
          'Hemocultivo (2/2 botellas): POSITIVO para bacilo Gram negativo no fermentador de lactosa identificado como Salmonella enterica serovar Typhi (resistente a ciprofloxacino/fluoroquinolonas, sensible a ceftriaxona y azitromicina). Gota gruesa para malaria: NEGATIVA.',
        referenceRange: 'Hemocultivos negativos',
        interpretation: 'Confirmación microbiológica por hemocultivo de Fiebre Tifoidea (cepa resistente a fluoroquinolonas procedente de Asia del Sur).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Fiebre Tifoidea Importada (Salmonella enterica serovar Typhi)',
      differentialDiagnoses: [
        'Paludismo / malaria (descartado por gota gruesa negativa)',
        'Dengue grave / hepatitis viral aguda',
        'Rickettsiosis o brucelosis',
        'Apendicitis aguda (dolor FID sin signos peritoneales y hemocultivo positivo)',
      ],
      pathophysiology:
        'Ingestión de Salmonella enterica serovar Typhi en agua o alimentos contaminados; invade las placas de Peyer del íleon terminal, sobrevive en macrófagos del sistema reticuloendotelial causando bacteriemia sostenida, hepatoesplenomegalia, roséola cutánea y riesgo de perforación ileal o hemorragia digestiva en la 2.ª-3.ª semana sin tratamiento.',
      keyClinicalClues: [
        'Viaje reciente (14 días) a India con consumo de comida callejera y sin vacunación tifoidea',
        'Fiebre prolongada en escalera (39.4°C) + bradicardia relativa (74 lpm, Signo de Faget) + roséola tífica + hepatoesplenomegalia',
        'Leucopenia con aneosinofilia + hemocultivo positivo para Salmonella Typhi (descartando malaria)',
      ],
      characteristicSignsSymptoms: [
        'Fiebre en escalera + bradicardia relativa (Signo de Faget)',
        'Roséola tífica en tronco y hepatoesplenomegalia',
        'Leucopenia con aneosinofilia y hemocultivo positivo',
      ],
      criticalRulingOutFactors: [
        'SIEMPRE descartar malaria en viajero febril que vuelve de zona endémica; las reacciones febriles (Widal) son poco específicas frente al hemocultivo.',
      ],
      recommendedWorkup: ['Hemocultivos (estándar de oro en primeras 2 semanas), gota gruesa para malaria, biometría/PFH y evitar pruebas de Widal como criterio único'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ceftriaxona intravenosa (o Azitromicina oral en casos leves estables; evitar ciprofloxacino en cepas del Sur de Asia)',
            dose: 'Ceftriaxona 2 g cada 24 h IV (o Azitromicina 1 g inicial luego 500 mg VO c/24 h si tolera vía oral)',
            route: 'Intravenosa (hospitalaria inicial)',
            frequency: 'Cada 24 horas',
            duration: '10 a 14 días (7 días si esquema con azitromicina en forma no complicada)',
            rationale: 'En viajeros procedentes de India/Pakistán existe altísima resistencia a fluoroquinolonas (ciprofloxacino), siendo ceftriaxona IV o azitromicina los fármacos empíricos seguros.',
          },
        ],
        generalMeasures: [
          'Hospitalización para hidratación IV, vigilancia estricta de signos abdominales de alarma en 2.ª semana (dolor súbito/peritonismo por perforación ileal o melena).',
          'Aislamiento entérico de contacto, lavado estricto de manos y notificación epidemiológica.',
          'Considerar dexametasona IV únicamente si aparece shock séptico o delirio/estupor tífico grave.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Dolor abdominal súbito intenso con rebote (sospecha de perforación de placas de Peyer -> Cirugía urgente), hemorragia digestiva o estupor.'],
        followUp: 'Confirmar defervescencia gradual (tarda 3-5 días tras iniciar antibiótico efectivo) y coprocultivos de control si manipula alimentos.',
      },
      criticalSafetyAlerts: [
        'NO usar ciprofloxacino empírico en fiebre tifoidea adquirida en India/Sudeste Asiático por tasas >80% de resistencia a fluoroquinolonas.',
        'La fiebre tarda 3-5 días en ceder aún con antibiótico correcto; vigilar perforación intestinal o hemorragia en semanas 2-3.',
      ],
      guidelineReferences: [
        'WHO / CDC Yellow Book: Typhoid & Paratyphoid Fever Management',
      ],
    },
    internalPersonaPrompt:
      'Habla cansada y acalorada como Jimena, fotógrafa de 28 años. Regresaste hace 2 semanas de viajar por la India donde comiste en la calle; llevas 9 días con fiebre cada vez más alta, dolor de panza y unos puntitos rosados en el pecho.',
  },
  {
    id: 'case-exp-ext-lyme',
    mode: 'medico_general',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Lucas Gabriel Montalvo',
      age: 37,
      sex: 'Masculino',
      occupation: 'Biólogo ambiental',
      consultReason: 'Mancha roja en el muslo que ha ido creciendo en los últimos días y malestar leve',
      evolutionTime: '12 días desde el viaje (lesión de 6 días)',
      currentIllness:
        'Paciente masculino de 37 años que consulta por una lesión cutánea rojiza única en el muslo izquierdo que apareció hace seis días como un punto rojo y ha ido creciendo centrífugamente hasta alcanzar unos 14 cm de diámetro con aclaramiento central ("como un blanco de tiro al arco"), acompañada de cansancio leve, febrícula de 37.7°C y dolores musculares ligeros. Regresó hace 12 días de acampar en bosques rurales de Massachusetts (noreste de Estados Unidos), donde recuerda haberse retirado una pequeña garrapata adherida a ese muslo.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '118/74 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 37.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 76,
      heightCm: 178,
    },
    background: {
      pathological: ['Previamente sano; sin antecedentes dermatológicos o cardíacos.'],
      nonPathological: ['Campamento reciente en bosques del noreste de EE.UU. (Massachusetts) con retiro de garrapata hace ~15 días.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-lyme-piel',
        system: 'Osteomuscular y Piel',
        name: 'Inspección dermatológica de lesión y examen neurológico/cardíaco',
        finding:
          'En cara lateral de muslo izquierdo se observa placa eritematosa anular ovalada de 14 x 11 cm con borde eritematoso expansivo y zona central parcialmente aclarada formando patrón en "ojo de buey" o diana (Eritema Migrans), tibia al tacto, prácticamente indolora y sin descamación ni vesículas. Pares craneales (VII par íntegro), articulaciones sin derrame y ritmo cardíaco regular sin bloqueos.',
        isAbnormal: true,
        semiologyNote:
          'Lesión en expansión >5 cm en diana ("ojo de buey") + picadura de garrapata Ixodes en zona endémica (noreste de EE.UU./Europa) = Eritema Migrans patognomónico de Enfermedad de Lyme.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-lyme-serol',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Serología ELISA + Western Blot para Borrelia burgdorferi + ECG basal',
        result:
          'Serología inicial (semana 1 del exantema): Indeterminada/negativa temprana (falso negativo esperado en fase localizada precoz antes de seroconversión a las 2-4 semanas). ECG 12 derivaciones: Ritmo sinusal normal a 76 lpm, intervalo PR 156 ms (sin bloqueo AV).',
        referenceRange: 'ECG PR 120-200 ms',
        interpretation: 'El diagnóstico de Eritema Migrans es CLÍNICO y NO se debe retrasar el antibiótico esperando seroconversión.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad de Lyme Temprana Localizada con Eritema Migrans (Importada de EE.UU.)',
      differentialDiagnoses: [
        'Tiña corporal (borde descamativo microvesicular pruriginoso, crecimiento lento)',
        'Reacción local de hipersensibilidad a picadura de artrópodo (<5 cm, aparece en <48 h y cede en días)',
        'Celulitis bacteriana aguda (dolor intenso, fiebre alta, sin aclaramiento central)',
        'Eritema multiforme (múltiples dianas simétricas acrales)',
      ],
      pathophysiology:
        'Infección por la espiroqueta Borrelia burgdorferi transmitida tras picadura prolongada (>24-36 h) de garrapata de patas negras (Ixodes scapularis / I. ricinus) en regiones endémicas de Norteamérica o Europa; la migración cutánea centrífuga genera el Eritema Migrans antes de la diseminación hematógena neurológica, cardíaca o articular.',
      keyClinicalClues: [
        'Regreso reciente de área boscosa endémica (Massachusetts / noreste de EE.UU.) con antecedente de garrapata adherida',
        'Placa eritematosa en expansión centrífuga >5 cm (14 cm) con aclaramiento central en "ojo de buey"',
        'Diagnóstico 100% clínico sin esperar serología positiva (que suele ser negativa en la primera semana)',
      ],
      characteristicSignsSymptoms: [
        'Eritema migrans (>5 cm en diana / ojo de buey)',
        'Síntomas pseudogripales leves (febrícula, mialgias, fatiga)',
        'Antecedente epidemiológico de picadura de garrapata en EE.UU./Europa',
      ],
      criticalRulingOutFactors: [
        'Diámetro >5 cm y expansión progresiva tras 1-2 semanas diferencian Eritema Migrans de reacción alérgica local a picadura (<5 cm en <48 h).',
      ],
      recommendedWorkup: ['Diagnóstico puramente clínico en presencia de Eritema Migrans + exposición endémica (no esperar serología ni diferir antibiótico)'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Doxiciclina (tratamiento de elección en adultos no embarazadas)',
            dose: '100 mg',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '10 a 14 días (10 días estándar para Doxiciclina en Lyme temprano localizado)',
            rationale: 'Erradica Borrelia burgdorferi previniendo progresión a neuroborreliosis (parálisis facial/meningitis), carditis de Lyme (bloqueo AV) o artritis crónica.',
          },
        ],
        generalMeasures: [
          'Advertir posibilidad de reacción leve de Jarisch-Herxheimer en las primeras 24 horas (fiebre/mialgias transitorias que no son alergia).',
          'Fotoprotección solar y tomar doxiciclina con vaso lleno de agua permaneciendo erguido 30 min.',
          'Vigilar síntomas de diseminación (palpitaciones/síncope, parálisis facial, cefalea intensa o inflamación de rodilla).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Aparición de bloqueo AV en ECG, parálisis facial bilateral, meningitis o artritis tardía (requiere ceftriaxona IV o ciclo prolongado).'],
        followUp: 'Control clínico en 2 semanas para confirmar desaparición completa del eritema y ausencia de síntomas sistémicos.',
      },
      criticalSafetyAlerts: [
        'NUNCA esperar a que la serología de Lyme salga positiva ni usarla para descartar Eritema Migrans temprano: la sensibilidad en la primera semana es <40%.',
        'No confundir con tiña corporal (aplicar solo antimicóticos o corticoides deja progresar la infección sistémica).',
      ],
      guidelineReferences: [
        'IDSA / AAN / ACR 2020 Guidelines for the Prevention, Diagnosis and Treatment of Lyme Disease',
      ],
    },
    internalPersonaPrompt:
      'Habla como Lucas, biólogo de 37 años. Regresaste hace 12 días de acampar en Massachusetts (EE.UU.) donde te quitaste una garrapata del muslo; te salió una mancha roja en forma de tiro al blanco que crece cada día.',
  },
  {
    id: 'case-exp-ext-esquistosomiasis',
    mode: 'residente',
    specialty: 'urologia',
    patientInfo: {
      name: 'Diego Alejandro Fuentes',
      age: 29,
      sex: 'Masculino',
      occupation: 'Cooperante internacional / Voluntario',
      consultReason: 'Orina con sangre y ardor leve desde hace varias semanas sin mejoría',
      evolutionTime: '5 semanas de evolución',
      currentIllness:
        'Paciente masculino de 29 años que consulta porque desde hace cinco semanas observa sangre rojo brillante al finalizar cada micción ("en las últimas gotas al terminar de orinar"), acompañada de ardor suprapúbico leve y aumento en la frecuencia urinaria. Hace 4 meses regresó de una estancia de seis meses en Malawi (África Oriental), donde nadó en varias ocasiones en agua dulce del Lago Malawi. Niega trauma genital, cólico lumbar intenso o tabaquismo.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '118/74 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.8,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 72,
      heightCm: 177,
    },
    background: {
      pathological: ['Previamente sano; niega litiasis renal previa o infecciones urinarias recurrentes.'],
      nonPathological: ['Cooperante en Malawi (África Oriental) con baños repetidos en agua dulce (Lago Malawi) hace 4-6 meses. No fuma.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó ciprofloxacino 5 días por supuesta cistitis sin ninguna mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-esquisto-abd',
        system: 'Abdomen',
        name: 'Exploración abdominal, lumbar y genital',
        finding:
          'Sensibilidad discreta a la palpación profunda en hipogastrio sin globo vesical ni masas. Puñopercusión renal bilateral negativa; examen escrotal y prostático normal.',
        isAbnormal: false,
        semiologyNote:
          'Hematuria terminal indolora en adulto joven con antecedente de baño en agua dulce de África subsahariana = Esquistosomiasis urinaria hasta demostrar lo contrario.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-esquisto-orina',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Microscopía de Sedimento Urinario (muestra de mediodía 10 AM - 2 PM) + Biometría Hemática',
        result:
          'Sedimento urinario (filtración de orina de mediodía): Presencia de HUEVOS DE SCHISTOSOMA HAEMATOBIUM con su característica ESPINA TERMINAL y eritrocitos abundantes | BH: Hb 13.8 g/dL, Leucocitos 8,400 /mm³ con EOSINOFILIA marcada (16%, 1,340 /mm³) | Urocultivo bacteriano estándar: NEGATIVO.',
        referenceRange: 'Sin huevos de parásitos | Eosinófilos 1-4%',
        interpretation: 'Diagnóstico definitivo de Esquistosomiasis (Bilharziasis) urinaria por huevos con espina terminal + eosinofilia periférica.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-esquisto-eco',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido Renal y Vesical',
        result: 'Engrosamiento nodular focal leve de la pared vesical posterolateral derecha ("parches arenosos"); riñones sin hidronefrosis ni cálculos.',
        referenceRange: 'Pared vesical lisa <3 mm sin engrosamientos nodulares',
        interpretation: 'Cambios granulomatosos vesicales tempranos por depósito de huevos sin obstrucción ureteral todavía.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Esquistosomiasis Urinaria (Schistosoma haematobium — Caso Importado de África)',
      differentialDiagnoses: [
        'Cistitis bacteriana hemorrágica (urocultivo negativo, no respondió a ciprofloxacino)',
        'Litiasis vesical o ureteral distal (sin cálculo en ecografía)',
        'Carcinoma urotelial de vejiga (importante descartar en hematuria crónica, y secuela tardía de S. haematobium)',
        'Tuberculosis genitourinaria (piuria estéril con cultivo negativo)',
      ],
      pathophysiology:
        'Penetración percutánea de cercarias al nadar en agua dulce africana infectada por caracoles Bulinus. Los gusanos adultos maduran y residen en el plexo venoso vesical depositando huevos con espina terminal que atraviesan la mucosa vesical causando reacción granulomatosa, hematuria terminal y riesgo a largo plazo de fibrosis ureteral o carcinoma epidermoide vesical.',
      keyClinicalClues: [
        'Adulto joven con hematuria TERMINAL ("en las últimas gotas") resistente a antibióticos comunes',
        'Antecedente epidemiológico clave: baño en agua dulce en África Oriental (Lago Malawi) hace meses',
        'Eosinofilia periférica (16%) + huevos con espina terminal en orina de mediodía',
      ],
      characteristicSignsSymptoms: [
        'Hematuria terminal indolora tras baño en agua dulce africana',
        'Eosinofilia y urocultivo bacteriano negativo',
        'Huevos ovalados con espina terminal en sedimento urinario',
      ],
      criticalRulingOutFactors: [
        'Falta de respuesta a ciprofloxacino + urocultivo negativo + eosinofilia + viaje a Malawi orientan a parásito vesical y no cistitis común.',
      ],
      recommendedWorkup: ['Examen microscópico de orina recolectada entre 10:00 y 14:00 h (máxima excreción de huevos), BH (eosinofilia), serología de Schistosoma y ultrasonido renal/vesical'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Praziquantel (tratamiento curativo de elección absoluta)',
            dose: '40 mg/kg/día dividido en 2 dosis (1,500 mg cada 12 horas en el día para 72 kg)',
            route: 'Vía Oral con alimentos',
            frequency: 'Cada 12 horas (2 dosis en 1 día)',
            duration: '1 día (esquema estándar OMS/CDC para S. haematobium)',
            rationale: 'Paraliza y daña el tegumento de los trematodos adultos de Schistosoma con tasas de curación >85-90%.',
          },
        ],
        generalMeasures: [
          'Repetir examen microscópico de orina a los 3-6 meses post-tratamiento para confirmar erradicación completa (el praziquantel actúa sobre adultos; algunos estadios jóvenes pueden requerir 2.ª dosis a las 4-6 semanas si persiste).',
          'Seguimiento urológico ecográfico si persiste engrosamiento vesical para descartar fibrosis o displasia vesical.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Hematuria persistente post-tratamiento o hidronefrosis en ecografía (valorar cistoscopia por Urología).'],
        followUp: 'Control de orina y eosinófilos en 6-12 semanas post-praziquantel.',
      },
      criticalSafetyAlerts: [
        'NO tratar hematuria terminal persistente de viajero con ciclos repetidos de antibióticos urinarios sin investigar Schistosoma: la infección crónica no tratada provoca hidronefrosis y cáncer escamoso de vejiga.',
      ],
      guidelineReferences: [
        'WHO Guideline on Control and Elimination of Human Schistosomiasis',
        'CDC Parasites — Schistosomiasis Clinical Treatment Guidance',
      ],
    },
    internalPersonaPrompt:
      'Habla como Diego, voluntario de 29 años. Hace 5 semanas orinas sangre en las últimas gotas al terminar y los antibióticos para infección no sirvieron; hace unos meses estuviste trabajando y nadando en el Lago Malawi en África.',
  },
  {
    id: 'case-exp-ext-leishmaniasis-visceral',
    mode: 'examen',
    specialty: 'hematologia',
    patientInfo: {
      name: 'Tomás Ignacio Benítez',
      age: 44,
      sex: 'Masculino',
      occupation: 'Ingeniero agrónomo',
      consultReason: 'Fiebre prolongada, sensación de bulto o llenura abdominal y palidez',
      evolutionTime: '6 semanas de evolución',
      currentIllness:
        'Paciente masculino de 44 años referido para estudio por fiebre persistente irregular (con dos picos diarios en ocasiones) de seis semanas de evolución, pérdida de 9 kg de peso, palidez progresiva, sangrado leve de encías al cepillarse y sensación de llenura rápida y peso en el lado izquierdo del abdomen donde se palpa un bulto enorme. Vivió durante cuatro meses en una finca rural de Andalucía/cuenca mediterránea rural con abundantes perros y mosquitos flebótomos regresando hace cinco semanas.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '104/66 mmHg',
      heartRate: 102,
      respiratoryRate: 18,
      temperature: 38.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 65,
      heightCm: 175,
    },
    background: {
      pathological: ['Previamente sano; prueba de VIH negativa reciente.'],
      nonPathological: ['Estancia de 4 meses en zona rural mediterránea endémica de Leishmania infantum conviviendo con perros con lesiones cutáneas y exposición nocturna a flebótomos ("beatillas").'],
      family: ['Sin antecedentes familiares relevantes referidos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó amoxicilina y paracetamol sin respuesta clínica.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-leish-abd',
        system: 'Abdomen',
        name: 'Exploración abdominal, ganglionar y mucocutánea',
        finding:
          'Palidez intensa mucocutánea, petequias escasas en piernas y discreta hiperpigmentación cutánea grisácea. ESPLENOMEGALIA MASIVA firme e indolora que rebasa 10 cm debajo del reborde costal izquierdo alcanzando casi la línea media umbilical, junto con hepatomegalia moderada (4 cm). Adenopatías periféricas discretas.',
        isAbnormal: true,
        semiologyNote:
          'Fiebre prolongada + esplenomegalia gigante + pérdida de peso + estancia rural mediterránea/endémica = sospecha cardinal de Leishmaniasis Visceral (Kala-azar).',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-leish-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática, Proteínas Totales y Serología rK39 / Aspirado Medular',
        result:
          'PANCITOPENIA SEVERA: Hb 7.8 g/dL | Leucocitos 1,900 /mm³ (Neutrófilos 720 /mm³) | Plaquetas 48,000 /mm³ | Albúmina baja (2.6 g/dL) con GLOBULINAS MUY ALTAS (6.4 g/dL: hipergammaglobulinemia policlonal) | Test rápido rK39: POSITIVO | Aspirado de médula ósea: Macrófagos cargados de AMASTIGOTES intracelulares de Leishmania con cinetoplasto visible (cuerpos de Leishman-Donovan).',
        referenceRange: 'Hb 13.5-17.5 | Leucocitos >4,500 | Plaquetas >150,000 | Sin parásitos medulares',
        interpretation: 'Pancitopenia + inversión albúmina/globulina + amastigotes intracelulares en médula ósea confirman Leishmaniasis Visceral (Kala-azar).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-leish-descarte',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Hemocultivos, VIH y Gota gruesa para malaria',
        result: 'VIH 4.ª generación: Negativo | Gota gruesa malaria: Negativa | Hemocultivos bacterianos: Negativos.',
        referenceRange: 'Negativos',
        interpretation: 'Excluye coinfección VIH, malaria y bacteriemia.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Leishmaniasis Visceral Importada (Kala-azar por Leishmania infantum)',
      differentialDiagnoses: [
        'Leucemia aguda o linfoma esplénico (descartado por aspirado medular con amastigotes sin blastos)',
        'Paludismo crónico / síndrome de esplenomegalia hiperreactiva malárica',
        'Fiebre tifoidea prolongada o brucelosis',
        'Endocarditis infecciosa subaguda o tuberculosis miliar',
      ],
      pathophysiology:
        'Protozoo intracelular obligado (Leishmania donovani / L. infantum) transmitido por picadura de flebótomo hembra (Phlebotomus/Lutzomyia; reservorio canino en región mediterránea/Sudamérica). Los amastigotes se multiplican dentro de los macrófagos del bazo, hígado y médula ósea causando esplenomegalia gigante, pancitopenia por hiperesplenismo/infiltración e hipergammaglobulinemia policlonal.',
      keyClinicalClues: [
        'Fiebre prolongada (6 semanas) + esplenomegalia masiva (10 cm) + pérdida ponderal + pancitopenia severa',
        'Hipergammaglobulinemia policlonal con hipoalbuminemia (inversión albúmina/globulina)',
        'Estancia rural en zona endémica mediterránea (reservorio canino/flebótomos) + rK39 y amastigotes en médula ósea',
      ],
      characteristicSignsSymptoms: [
        'Fiebre prolongada, esplenomegalia masiva y caquexia',
        'Pancitopenia + hipergammaglobulinemia policlonal',
        'Amastigotes intracelulares (cuerpos de Leishman-Donovan) en médula ósea',
      ],
      criticalRulingOutFactors: [
        'El aspirado medular descarta leucemia/linfoma y demuestra directamente los amastigotes con cinetoplasto.',
      ],
      recommendedWorkup: ['Biometría, proteínas/albúmina, test serológico rK39 / PCR Leishmania, aspirado de médula ósea (evitar biopsia esplénica por riesgo hemorrágico con 48,000 plaquetas) y prueba de VIH'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Anfotericina B Liposomal intravenosa (tratamiento de elección OMS/IDSA en Leishmaniasis Visceral)',
            dose: '3 mg/kg/día IV (días 1 a 5, y repetir dosis los días 14 y 21 — esquema total 20-21 mg/kg)',
            route: 'Intravenosa hospitalaria',
            frequency: 'Días 1-5, 14 y 21 (en inmunocompetentes)',
            duration: 'Esquema completo de 21 días',
            rationale: 'Máxima eficacia (>95% curación) y mucha menor nefrotoxicidad que anfotericina deoxicolato o antimoniales pentavalentes.',
          },
        ],
        generalMeasures: [
          'Hospitalización inicial para hidratación, vigilancia de función renal y electrolitos (K+/Mg2+) durante infusión de Anfotericina B liposomal.',
          'Descartar siempre coinfección por VIH (cambia la dosis total a 40 mg/kg en inmunodeprimidos).',
          'Vigilar sangrados por trombocitopenia e infecciones secundarias por neutropenia hasta recuperación medular.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Manejo conjunto por Infectología y Hematología intrahospitalaria.'],
        followUp: 'Control clínico y biometría hemática mensual por 6-12 meses para confirmar resolución esplénica y ausencia de recaída.',
      },
      criticalSafetyAlerts: [
        'NO realizar punción/biopsia esplénica teniendo 48,000 plaquetas por altísimo riesgo de hemoperitoneo mortal: preferir aspirado de médula ósea o PCR en sangre + rK39.',
        'La leishmaniasis visceral sin tratamiento específico tiene mortalidad >90% por hemorragia o infección oportunista.',
      ],
      guidelineReferences: [
        'IDSA / ASTMH Clinical Practice Guidelines: Diagnosis and Treatment of Leishmaniasis',
        'WHO Technical Report Series: Control of the Leishmaniases',
      ],
    },
    internalPersonaPrompt:
      'Habla muy agotado como Tomás, agrónomo de 44 años. Trabajaste 4 meses en el campo del sur de España (Andalucía) rodeado de perros y mosquitos; llevas 6 semanas con fiebre, bajaste 9 kilos y sientes la panza muy dura e inflada del lado izquierdo.',
  },
];
