import { ClinicalCase } from '../types/clinical';

/**
 * Ampliación Curada (Bloque A): 18 casos clínicos comunes de alta frecuencia
 * en consulta externa, pediatría, ginecología, traumatología y urgencias básicas.
 */
export const COMMON_EXPANSION_CASES_A: ClinicalCase[] = [
  {
    id: 'case-exp-com-orzuelo',
    mode: 'principiante',
    specialty: 'oftalmologia',
    patientInfo: {
      name: 'Valeria Sofía Navarro',
      age: 23,
      sex: 'Femenino',
      occupation: 'Recepcionista',
      consultReason: 'Bolita roja y dolorosa en el párpado derecho',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente femenina de 23 años que consulta por aparición hace 48 horas de un abultamiento localizado, enrojecido y doloroso al tacto en el borde del párpado superior derecho. Refiere sensación leve de peso palpebral y lagrimeo ocasional. Niega disminución de la visión, dolor al mover los ojos, fiebre o secreción purulenta profusa.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '110/72 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 58,
      heightCm: 162,
    },
    background: {
      pathological: ['Blefaritis seborreica leve ocasional; sin enfermedades sistémicas.'],
      nonPathological: ['Usa maquillaje ocular diariamente y a veces duerme sin desmaquillarse.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-orzuelo-ojo',
        system: 'Cabeza y Cuello',
        name: 'Inspección palpebral y exploración ocular',
        finding:
          'Nódulo eritematoso de 4 mm, caliente y doloroso a la palpación en el margen anterior del párpado superior derecho centrado en un folículo de pestaña (glándula de Zeis), con punto amarillento apical. Conjuntiva bulbar clara, córnea transparente, agudeza visual 20/20 y movimientos oculares indoloros.',
        isAbnormal: true,
        semiologyNote:
          'Nódulo agudo doloroso y eritematoso en borde palpebral anterior sin compromiso orbitario ni visual es típico de orzuelo externo.',
      },
      {
        id: 'pe-exp-orzuelo-gen',
        system: 'General',
        name: 'Estado general y adenopatías preauriculares',
        finding:
          'Paciente afebril, hidratada y orientada. Sin edema periorbitario difuso ni adenopatías preauriculares palpables.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-orzuelo-av',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Evaluación de agudeza visual (Snellen) y motilidad extrínseca',
        result: 'Agudeza visual 20/20 bilateral sin corrección; motilidad ocular extrínseca completa e indolora.',
        referenceRange: '20/20 bilateral',
        interpretation: 'Descarta afectación corneal u orbitaria profunda.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Orzuelo Externo Agudo del Párpado Superior Derecho',
      differentialDiagnoses: [
        'Chalazión (crónico e indoloro)',
        'Celulitis preseptal aguda',
        'Blefaritis ulcerativa difusa',
        'Carcinoma sebáceo palpebral',
      ],
      pathophysiology:
        'Infección bacteriana aguda purulenta (generalmente por Staphylococcus aureus) de las glándulas sebáceas de Zeis o sudoríparas de Moll asociadas al folículo piloso de la pestaña.',
      keyClinicalClues: [
        'Nódulo palpebral agudo doloroso, rojo y caliente en el margen anterior de las pestañas',
        'Antecedente de uso prolongado de maquillaje sin higiene nocturna',
        'Ausencia de dolor a los movimientos oculares, fiebre o déficit visual',
      ],
      characteristicSignsSymptoms: [
        'Nódulo eritematoso doloroso en borde palpebral',
        'Punto pustuloso centrado en pestaña',
        'Lagrimeo leve sin pérdida visual',
      ],
      criticalRulingOutFactors: [
        'Motilidad ocular indolora, ausencia de proptosis y agudeza visual 20/20 descartan celulitis orbitaria.',
        'Inicio agudo y dolor marcado lo diferencian de chalazión crónico indoloro.',
      ],
      recommendedWorkup: ['Diagnóstico clínico por inspección palpebral; no requiere estudios de imagen ni cultivos de rutina'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Eritromicina ungüento oftálmico 0.5% (o Tobramicina ungüento oftálmico)',
            dose: 'Tira de 1 cm en borde palpebral afectado',
            route: 'Oftálmica tópica',
            frequency: 'Cada 8 horas',
            duration: '7 días',
            rationale: 'Controla la carga bacteriana superficial y previene blefaritis secundaria.',
          },
        ],
        generalMeasures: [
          'Compresas tibias húmedas sobre el párpado cerrado durante 10-15 minutos, 3 a 4 veces al día para favorecer drenaje espontáneo.',
          'Higiene diaria del borde palpebral con champú neutro diluido o toallitas oftálmicas.',
          'Suspender maquillaje y lentes de contacto hasta la resolución completa.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Aparición de fiebre, edema que se extiende a mejilla/órbita, dolor al mover el ojo o persistencia >4 semanas (evolución a chalazión).',
        ],
        followUp: 'Control clínico en 7 días si no ha drenado espontáneamente.',
      },
      criticalSafetyAlerts: [
        'NUNCA exprimir, puncionar ni apretar manualmente el orzuelo: puede diseminar la infección hacia el tejido preseptal u orbitario.',
      ],
      guidelineReferences: [
        'AAO Preferred Practice Pattern: Blepharitis & Hordeolum',
        'NICE Clinical Knowledge Summaries: Stye (Hordeolum)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Valeria, de 23 años. Tienes una bolita roja y muy sensible en el párpado derecho desde hace 2 días; usas delineador a diario y ves normal.',
  },
  {
    id: 'case-exp-com-rinitis-alergica',
    mode: 'principiante',
    specialty: 'otorrinolaringologia',
    patientInfo: {
      name: 'Sebastián Alejandro Mena',
      age: 24,
      sex: 'Masculino',
      occupation: 'Estudiante de arquitectura',
      consultReason: 'Estornudos diarios, comezón nasal y moco transparente desde hace meses',
      evolutionTime: '4 meses de evolución',
      currentIllness:
        'Paciente masculino de 24 años que acude por presentar desde hace cuatro meses episodios diarios de estornudos en salva al despertar, picazón intensa en nariz y paladar, lagrimeo y secreción nasal acuosa transparente continua, además de congestión nasal alternante que empeora al limpiar polvo o estar cerca de gatos. Niega fiebre, moco verde espeso o dolor facial.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/72 mmHg',
      heartRate: 72,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 71,
      heightCm: 176,
    },
    background: {
      pathological: ['Dermatitis atópica leve en la infancia.'],
      nonPathological: ['Vive en departamento con alfombra antigua y un gato. No fuma.'],
      family: ['Padre hipertenso en control; madre sana.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Usa gotas de oximetazolina ocasionalmente cuando se tapa demasiado la nariz.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-rinitis-orl',
        system: 'Cabeza y Cuello',
        name: 'Rinoscopia anterior y exploración facial',
        finding:
          'Pliegue nasal transversal ("saludo alérgico") y ojeras violáceas infraorbitarias. Cornetes inferiores pálidos, violáceos y marcadamente edematosos con abundante rinorrea hialina. Sin secreción purulenta ni dolor sinusal.',
        isAbnormal: true,
        semiologyNote:
          'Cornetes pálido-violáceos edematosos + rinorrea acuosa + saludo alérgico son clásicos de rinitis alérgica mediada por IgE.',
      },
      {
        id: 'pe-exp-rinitis-torax',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar',
        finding: 'Murmullo vesicular conservado bilateralmente sin sibilancias ni estertores.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-rinitis-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hb 15.1 g/dL | Leucocitos 6,900 /mm³ (Eosinófilos 7%, Neutrófilos 52%, Linfocitos 35%) | Plaquetas 248,000 /mm³.',
        referenceRange: 'Eosinófilos 1-4%',
        interpretation: 'Eosinofilia periférica discreta compatible con enfermedad atópica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Rinitis Alérgica Persistente Moderada',
      differentialDiagnoses: [
        'Rinitis vasomotora no alérgica',
        'Rinitis medicamentosa por abuso de oximetazolina',
        'Rinofaringitis viral recurrente',
        'Poliposis nasal crónica',
      ],
      pathophysiology:
        'Reacción de hipersensibilidad tipo I mediada por IgE frente a aeroalérgenos (ácaros, epitelio de gato, pólenes) que induce degranulación mastocitaria, liberación de histamina y leucotrienos con inflamación eosinofílica crónica de la mucosa nasal.',
      keyClinicalClues: [
        'Estornudos en salva, prurito naso-palatino, rinorrea hialina y obstrucción crónica',
        'Cornetes nasales pálidos y edematosos con antecedente familiar atópico',
        'Empeoramiento claro ante exposición a polvo y epitelio de gato',
      ],
      characteristicSignsSymptoms: [
        'Prurito nasal y estornudos en salva',
        'Rinorrea hialina persistente',
        'Cornetes pálido-edematosos y ojeras alérgicas',
      ],
      criticalRulingOutFactors: [
        'Ausencia de fiebre, algia facial y secreción purulenta descarta rinosinusitis infecciosa.',
        'Campos pulmonares sin sibilancias descartan asma concomitante descompensada.',
      ],
      recommendedWorkup: ['Diagnóstico clínico; pruebas cutáneas (Prick test) o IgE específica si falta respuesta a tratamiento inicial'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Mometasona furoato o Fluticasona propionato spray nasal',
            dose: '2 atomizaciones (100 mcg) en cada fosa nasal',
            route: 'Nasal tópica',
            frequency: 'Cada 24 horas por la mañana',
            duration: 'Uso continuo mínimo 4 a 8 semanas',
            rationale: 'Corticosteroide intranasal de primera línea; controla tanto la congestión como la inflamación alérgica.',
          },
          {
            drug: 'Loratadina o Cetirizina (antihistamínico H1 de 2.ª generación)',
            dose: '10 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '2 a 4 semanas durante picos sintomáticos',
            rationale: 'Alivia rápidamente estornudos, prurito y rinorrea sin sedación significativa.',
          },
        ],
        generalMeasures: [
          'Control ambiental: fundas antiácaros, retirar alfombras y evitar entrada de mascota al dormitorio.',
          'Lavados nasales con solución salina isotónica antes del corticoide nasal.',
          'Suspender de inmediato oximetazolina tópica para evitar rinitis medicamentosa de rebote.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Falta de control tras 8 semanas de apego o aparición de sibilancias/disnea (sospecha de asma asociada).'],
        followUp: 'Revaloración en 4 semanas para verificar respuesta al esteroide intranasal.',
      },
      criticalSafetyAlerts: [
        'Evitar descongestionantes tópicos (oximetazolina) por más de 3 días y evitar antihistamínicos de 1.ª generación sedantes en conductores.',
      ],
      guidelineReferences: [
        'ARIA Guidelines (Allergic Rhinitis and its Impact on Asthma)',
        'AAO-HNS Clinical Practice Guideline: Allergic Rhinitis',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Sebastián, estudiante de 24 años. Desde hace meses estornudas muchísimo al despertar, te pica la nariz y el paladar, y te sale agüita clara, sobre todo con polvo o tu gato.',
  },
  {
    id: 'case-exp-com-acne-inflamatorio',
    mode: 'principiante',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Camila Andrea Herrera',
      age: 19,
      sex: 'Femenino',
      occupation: 'Estudiante universitaria',
      consultReason: 'Barros rojos y espinillas con pus en cara y espalda',
      evolutionTime: '8 meses de evolución',
      currentIllness:
        'Paciente femenina de 19 años que acude preocupada porque desde hace ocho meses han aumentado los granos en frente, mejillas, mentón y parte alta de la espalda, varios de ellos rojos, dolorosos y con punta blanca, dejándole manchas oscuras residuales. Ha probado jabones exfoliantes y pasta dental sin mejoría. Refiere menstruaciones regulares y niega fiebre o nódulos profundos con cicatrices extensas.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 87,
      weightKg: 56,
      heightCm: 164,
    },
    background: {
      pathological: ['Menarca a los 12 años, ciclos menstruales regulares cada 28 días.'],
      nonPathological: ['Usa cremas hidratantes aceitosas y bloqueador solar corporal en rostro.'],
      family: ['Padres aparentemente sanos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno; niega suplementos con esteroides o complejos B en megadosis.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-acne-piel',
        system: 'Osteomuscular y Piel',
        name: 'Exploración dermatológica de rostro y tronco superior',
        finding:
          'Piel facial seborreica con múltiples comedones abiertos y cerrados, 18 pápulas eritematosas y 10 pústulas distribuidas en frente, mejillas y región dorsal superior, más máculas hiperpigmentadas postinflamatorias. Sin nódulos profundos, quistes fluctuantes ni hirsutismo.',
        isAbnormal: true,
        semiologyNote:
          'Presencia simultánea de comedones + pápulas y pústulas sin quistes ni signos de hiperandrogenismo define acné vulgar inflamatorio moderado.',
      },
      {
        id: 'pe-exp-acne-gen',
        system: 'General',
        name: 'Valoración general y signos de hiperandrogenismo',
        finding: 'Sin acantosis nigricans, sin vello terminal facial ni alopecia androgénica.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-acne-emb',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Prueba rápida de embarazo en orina (pre-tratamiento)',
        result: 'NEGATIVA.',
        referenceRange: 'Negativa',
        interpretation: 'Indispensable documentar antes de iniciar retinoides tópicos o sistémicos en mujeres en edad fértil.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Acné Vulgar Papulopustuloso Moderado',
      differentialDiagnoses: [
        'Rosácea papulopustulosa (ausencia de comedones)',
        'Foliculitis por Malassezia o bacteriana',
        'Acné secundario a hiperandrogenismo (SOP)',
        'Reacción acneiforme por corticoides o cosméticos comedogénicos',
      ],
      pathophysiology:
        'Hiperqueratinización folicular, aumento de secreción sebácea andrógeno-dependiente, colonización por Cutibacterium acnes e inflamación perifolicular mediada por citocinas.',
      keyClinicalClues: [
        'Comedones abiertos/cerrados combinados con pápulas y pústulas en áreas seborreicas',
        'Ausencia de irregularidad menstrual o hirsutismo',
        'Uso de cremas aceitosas comedogénicas y manipulación de lesiones',
      ],
      characteristicSignsSymptoms: [
        'Comedones abiertos y cerrados',
        'Pápulas eritematosas y pústulas superficiales',
        'Seborrea facial e hiperpigmentación postinflamatoria',
      ],
      criticalRulingOutFactors: [
        'La presencia de comedones descarta rosácea; los ciclos regulares sin hirsutismo alejan síndrome de ovario poliquístico.',
      ],
      recommendedWorkup: ['Diagnóstico clínico; no requiere perfil hormonal si ciclos regulares y ausencia de virilización'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Adapaleno 0.1% gel + Peróxido de benzoilo 2.5% gel (combinación tópica)',
            dose: 'Capa fina en toda el área afectada (rostro)',
            route: 'Tópica cutánea',
            frequency: 'Cada 24 horas por la noche',
            duration: '12 semanas mínimo',
            rationale: 'Combina efecto comedolítico/antiinflamatorio del retinoide con acción bactericida sin resistencia de C. acnes.',
          },
          {
            drug: 'Doxiciclina (si extensión troncal o falta de respuesta inicial)',
            dose: '100 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas con abundante agua después de alimento',
            duration: '8 a 12 semanas (siempre asociada a peróxido de benzoilo)',
            rationale: 'Reduce inflamación folicular moderada; nunca debe usarse en monoterapia.',
          },
        ],
        generalMeasures: [
          'Limpieza facial suave 2 veces al día con dermolimpiador syndet; no frotar ni exprimir lesiones.',
          'Cambiar cremas y fotoprotector por fórmulas oil-free no comedogénicas con FPS 50+ diario.',
          'Informar que la mejoría visible tarda 6 a 8 semanas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Evolución a acné noduloquístico cicatricial o falta de respuesta tras 12 semanas (valorar isotretinoína por Dermatología).'],
        followUp: 'Control dermatológico en 8 semanas para evaluar tolerancia y respuesta.',
      },
      criticalSafetyAlerts: [
        'NUNCA prescribir antibióticos tópicos u orales en monoterapia (favorecen resistencia de C. acnes); evitar retinoides y tetraciclinas durante el embarazo.',
      ],
      guidelineReferences: [
        'AAD Guidelines of Care for the Management of Acne Vulgaris (2024)',
        'NICE NG198: Acne vulgaris: management',
      ],
    },
    internalPersonaPrompt:
      'Habla como Camila, universitaria de 19 años. Te acomplejan los granitos rojos y puntos negros en la cara y parte alta de la espalda desde hace meses; tus reglas son puntuales.',
  },
  {
    id: 'case-exp-com-impetigo',
    mode: 'principiante',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Matías Emiliano Vargas',
      age: 6,
      sex: 'Masculino',
      occupation: 'Estudiante de primaria',
      consultReason: 'Lesiones húmedas con costras amarillentas alrededor de nariz y boca',
      evolutionTime: '4 días de evolución',
      currentIllness:
        'Paciente escolar de 6 años traído por su madre por presentar desde hace cuatro días pequeñas ronchitas y ampollas frágiles alrededor de la fosa nasal derecha y comisura labial que se rompen rápido y dejan costras gruesas de color amarillo dorado ("como miel seca"). Se rasca con frecuencia y apareció una nueva lesión en el mentón. Niega fiebre, dolor de garganta o rechazo al alimento.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '96/62 mmHg',
      heartRate: 92,
      respiratoryRate: 20,
      temperature: 36.8,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 86,
      weightKg: 21,
      heightCm: 116,
    },
    background: {
      pathological: ['Vacunación completa para su edad; antecedente reciente de catarro leve con rinorrea.'],
      nonPathological: ['Asiste a primero de primaria; varios compañeros tienen lesiones similares en cara.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Mamá aplicó pomada con óxido de zinc sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-impetigo-piel',
        system: 'Osteomuscular y Piel',
        name: 'Inspección cutánea facial y ganglios regionales',
        finding:
          'Placas eritematosas superficiales bien delimitadas cubiertas por costras gruesas amarillento-doradas (melicéricas) en región perinasal derecha, labio superior y mentón. Adenopatía submandibular derecha pequeña móvil levemente sensible. Sin compromiso de mucosas orales ni signos sistémicos.',
        isAbnormal: true,
        semiologyNote:
          'Las costras melicéricas ("color miel") periorificiales en edad pediátrica son el signo cardinal del impétigo contagioso no ampolloso.',
      },
      {
        id: 'pe-exp-impetigo-orl',
        system: 'Cabeza y Cuello',
        name: 'Orofaringe y oídos',
        finding: 'Orofaringe sin exudado amigdalino ni vesículas intraorales; membranas timpánicas íntegras.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-impetigo-cultivo',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Tinción de Gram y cultivo de exudado subcostroso (solo casos refractarios)',
        result: 'Cocos Gram positivos en racimos y cadenas: crecimiento compatible con Staphylococcus aureus / Streptococcus pyogenes.',
        referenceRange: 'Flora cutánea habitual sin patógenos piógenos predominantes',
        interpretation: 'Confirma etiología piógena superficial habitual; el diagnóstico de rutina es clínico.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Impétigo Contagioso No Ampolloso Pediátrico',
      differentialDiagnoses: [
        'Herpes simple labial recurrente',
        'Dermatitis atópica impetiginizada',
        'Tiña facial superficial',
        'Escabiosis con infección secundaria',
      ],
      pathophysiology:
        'Infección bacteriana superficial de la epidermis (estrato córneo/espinoso) por Staphylococcus aureus o Streptococcus pyogenes tras microtraumas por rascado nasal, formando pústulas frágiles cuyo exudado seca en costras melicéricas.',
      keyClinicalClues: [
        'Costras melicéricas doradas alrededor de nariz y boca en niño escolar',
        'Autoinoculación por rascado y contagio entre compañeros de aula',
        'Niño afebril y en buen estado general sin compromiso mucoso',
      ],
      characteristicSignsSymptoms: [
        'Costras melicéricas amarillentas ("color miel")',
        'Distribución perinasal y peribucal',
        'Prurito leve y autoinoculación rápida',
      ],
      criticalRulingOutFactors: [
        'Ausencia de vesículas agrupadas sobre base eritematosa dolorosa y compromiso mucoso aleja herpes labial.',
      ],
      recommendedWorkup: ['Diagnóstico eminentemente clínico; no requiere laboratorio en casos localizados'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Mupirocina ungüento al 2%',
            dose: 'Aplicación local sobre lesiones limpias',
            route: 'Tópica cutánea',
            frequency: 'Cada 8 horas',
            duration: '5 a 7 días',
            rationale: 'Antibiótico tópico de primera línea altamente efectivo frente a S. aureus y S. pyogenes en impétigo localizado.',
          },
        ],
        generalMeasures: [
          'Retirar suavemente las costras lavando con agua tibia y jabón neutro antes de aplicar la pomada.',
          'Cortar uñas al ras, lavado frecuente de manos y no compartir toallas ni fundas.',
          'Evitar asistencia escolar hasta completar 24-48 horas de tratamiento antibiótico efectivo o cubrir lesiones.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Aparición de fiebre, celulitis extensa, múltiples lesiones diseminadas (requiere antibiótico oral) o edema/orina oscura posterior.'],
        followUp: 'Revaloración en 5 días si las lesiones no han secado o siguen extendiéndose.',
      },
      criticalSafetyAlerts: [
        'No aplicar corticoides tópicos sobre lesiones impetiginosas (empeoran la infección); vigilar signos de celulitis o síndrome de piel escaldada.',
      ],
      guidelineReferences: [
        'IDSA Skin and Soft Tissue Infections Guidelines: Impetigo',
        'NICE NG153: Impetigo: antimicrobial prescribing',
      ],
    },
    internalPersonaPrompt:
      'Responde como la mamá de Matías (6 años). Le salieron unas costritas amarillas como miel alrededor de la nariz y la boca hace 4 días después de un catarro; se rasca mucho pero no tiene fiebre.',
  },
  {
    id: 'case-exp-com-varicela',
    mode: 'principiante',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Sofía Valentina Morales',
      age: 7,
      sex: 'Femenino',
      occupation: 'Estudiante de primaria',
      consultReason: 'Fiebre y ronchitas con agua que pican mucho en todo el cuerpo',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente femenina de 7 años llevada a consulta por fiebre de 38.2°C y aparición desde hace 48 horas de múltiples lesiones muy pruriginosas que comenzaron en el pecho y cuero cabelludo y se extendieron a espalda y cara. La madre nota que algunas ya son costras mientras siguen saliendo manchitas rojas y ampollitas claras nuevas ("como gotitas de rocío"). Refiere leve pérdida de apetito pero buena hidratación.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '98/64 mmHg',
      heartRate: 102,
      respiratoryRate: 20,
      temperature: 38.1,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 23,
      heightCm: 122,
    },
    background: {
      pathological: ['Previamente sana; no recibió vacuna contra varicela.'],
      nonPathological: ['Brote en su salón de clases hace 2 semanas.'],
      family: ['Padres aparentemente sanos; sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Madre pregunta si puede darle ibuprofeno o aspirina para la fiebre.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-varicela-piel',
        system: 'Osteomuscular y Piel',
        name: 'Examen dermatológico completo (incluyendo cuero cabelludo y mucosas)',
        finding:
          'Exantema polimorfo generalizado en "cielo estrellado": coexistencia simultánea de máculas eritematosas, pápulas, vesículas tensas con contenido claro sobre base eritematosa ("gota de rocío sobre pétalo de rosa"), pústulas y costras en tronco, cara y cuero cabelludo, respetando palmas y plantas. Dos pequeñas úlceras superficiales en paladar blando.',
        isAbnormal: true,
        semiologyNote:
          'Polimorfismo lesional regional simultáneo con afectación de cuero cabelludo es patognomónico de primoinfección por Virus Varicela-Zóster.',
      },
      {
        id: 'pe-exp-varicela-pulm',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar y valoración neurológica básica',
        finding: 'Campos pulmonares bien ventilados sin estertores; marcha estable sin ataxia ni rigidez nucal.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-varicela-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa (diagnóstico clínico en casos típicos)',
        result: 'Hb 12.6 g/dL | Leucocitos 5,800 /mm³ (Linfocitos 56%, Neutrófilos 38%) | Plaquetas 235,000 /mm³.',
        referenceRange: 'Leucocitos 4,500-12,000 /mm³',
        interpretation: 'Predominio linfocítico leve acorde a viremia por VVZ; sin datos de sobreinfección bacteriana.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Varicela No Complicada en Edad Escolar (Primoinfección por Virus Varicela-Zóster)',
      differentialDiagnoses: [
        'Enfermedad mano-pie-boca (Coxsackie)',
        'Impétigo ampolloso diseminado',
        'Prurigo por insectos (estrófulo)',
        'Herpes zóster diseminado',
      ],
      pathophysiology:
        'Primoinfección por Virus Varicela-Zóster (VVZ) transmitido por gotas respiratorias y contacto vesicular; tras incubación de 14 días produce viremias sucesivas que originan brotes de lesiones cutáneas en diferentes estadios evolutivos.',
      keyClinicalClues: [
        'Exantema muy pruriginoso en diferentes estadios simultáneos ("cielo estrellado") incluyendo cuero cabelludo',
        'Vesículas claras sobre halo eritematoso ("gota de rocío") tras contacto escolar hace 2 semanas',
        'Niña sin vacuna previa contra varicela y sin signos de sobreinfección o neumonitis',
      ],
      characteristicSignsSymptoms: [
        'Polimorfismo lesional en cielo estrellado',
        'Lesiones en cuero cabelludo y mucosa oral',
        'Prurito intenso y fiebre moderada',
      ],
      criticalRulingOutFactors: [
        'Pulmones limpios y marcha normal descartan neumonía varicelosa o cerebelitis aguda.',
      ],
      recommendedWorkup: ['Diagnóstico puramente clínico; evitar exámenes innecesarios'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Paracetamol',
            dose: '10-15 mg/kg/dosis (250-300 mg)',
            route: 'Vía Oral',
            frequency: 'Cada 6 a 8 horas si fiebre o malestar',
            duration: '3 a 5 días',
            rationale: 'Antipirético de elección y seguro en varicela pediátrica.',
          },
          {
            drug: 'Loratadina o Cetirizina jarabe (o loción de calamina)',
            dose: '5 mg (5 mL)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '5 a 7 días',
            rationale: 'Controla el prurito intenso y reduce el rascado y la sobreinfección bacteriana secundaria.',
          },
        ],
        generalMeasures: [
          'Aislamiento domiciliario hasta que TODAS las lesiones estén en fase de costra (aprox. 5-7 días); evitar contacto con embarazadas, recién nacidos o inmunodeprimidos.',
          'Baños cortos con agua tibia y jabón suave, uñas cortas y limpias, ropa ligera de algodón.',
          'Hidratación oral abundante.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Fiebre persistente >4 días o que reaparece, lesión roja caliente con pus (sobreinfección/celulitis), tos con dificultad respiratoria o inestabilidad al caminar (ataxia).',
        ],
        followUp: 'Vigilancia domiciliaria con signos de alarma explicados a los padres.',
      },
      criticalSafetyAlerts: [
        'CONTRAINDICACIÓN ABSOLUTA de ácido acetilsalicílico (Aspirina) por riesgo de Síndrome de Reye mortal.',
        'Evitar ibuprofeno y otros AINEs en varicela por asociación con fascitis necrosante estreptocócica sobreinfectada.',
      ],
      guidelineReferences: [
        'AAP Red Book: Varicella-Zoster Virus Infections',
        'CDC Clinical Overview of Chickenpox (Varicella)',
      ],
    },
    internalPersonaPrompt:
      'Responde como la mamá de Sofía (7 años). Desde hace 2 días tiene fiebre y muchísimas ronchas con agüita y costras que le pican mucho hasta en la cabeza; un compañero de escuela tuvo lo mismo.',
  },
  {
    id: 'case-exp-com-tina-pedis',
    mode: 'principiante',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Fernando Javier Castillo',
      age: 35,
      sex: 'Masculino',
      occupation: 'Instructor de natación',
      consultReason: 'Descamación, grietas y picazón entre los dedos de los pies y uña gruesa',
      evolutionTime: '3 meses de evolución',
      currentIllness:
        'Paciente masculino de 35 años que consulta porque desde hace tres meses tiene comezón molesta, piel blanca húmeda, descamación y grietas dolorosas entre el cuarto y quinto dedo de ambos pies, además de notar que la uña del primer dedo del pie derecho se ha vuelto gruesa, amarillenta y quebradiza. Camina descalzo en vestidores húmedos de alberca. Niega diabetes conocida o fiebre.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: 70,
      respiratoryRate: 15,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 76,
      heightCm: 177,
    },
    background: {
      pathological: ['Sano; niega diabetes mellitus o insuficiencia arterial.'],
      nonPathological: ['Trabaja en ambiente húmedo con calzado deportivo cerrado durante 8 horas al día.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Aplicó una crema combinada con betametasona hace un mes que calmó la picazón pero extendió la lesión.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-tinapedis-pies',
        system: 'Osteomuscular y Piel',
        name: 'Exploración podal interdigital y láminas ungueales',
        finding:
          'Maceración blanquecina, eritema, descamación fina y fisura superficial en el cuarto espacio interdigital de ambos pies sin secreción purulenta ni celulitis ascendente. Uña del primer artejo derecho con hiperqueratosis subungueal, onicólisis distal y cambio de coloración blanco-amarillenta (xantoniquia). Pulsos pedios y tibiales posteriores presentes.',
        isAbnormal: true,
        semiologyNote:
          'Maceración interdigital del 4.º espacio + hiperqueratosis subungueal amarillenta en trabajador de albercas confirma tiña pedis con onicomicosis.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-tinapedis-koh',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Examen directo con KOH al 10-20% de escamas y detrito ungueal',
        result: 'POSITIVO: Se observan hifas hialinas septadas y artroconidios compatibles con dermatofitos.',
        referenceRange: 'Negativo para elementos fúngicos',
        interpretation: 'Confirma infección por dermatofitos (usualmente Trichophyton rubrum) antes de iniciar antifúngico oral prolongado.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Tiña Pedis Interdigital y Onicomicosis Subungueal Distal (Pie de Atleta)',
      differentialDiagnoses: [
        'Eritrasma interdigital (Corynebacterium minutissimum)',
        'Psoriasis ungueal y palmoplantar',
        'Dermatitis de contacto por calzado',
        'Infección bacteriana interdigital (celulitis incipiente)',
      ],
      pathophysiology:
        'Colonización e invasión del estrato córneo interdigital y lecho ungueal por hongos dermatofitos queratinofílicos (Trichophyton rubrum, T. interdigitale) favorecida por humedad, oclusión térmica y microtrauma en duchas públicas.',
      keyClinicalClues: [
        'Maceración y fisuración pruriginosa en 4.º espacio interdigital de ambos pies',
        'Uña gruesa, amarilla y friable con hiperqueratosis subungueal',
        'Exposición laboral en albercas y antecedente de empeoramiento con crema corticoide',
      ],
      characteristicSignsSymptoms: [
        'Maceración blanquecina y descamación interdigital',
        'Hiperqueratosis subungueal amarillenta',
        'Prurito podal en calzado cerrado',
      ],
      criticalRulingOutFactors: [
        'Ausencia de eritema ascendente en pierna y fiebre descarta celulitis secundaria por fisura.',
        'KOH positivo confirma dermatofitosis y excluye psoriasis ungueal.',
      ],
      recommendedWorkup: ['Examen directo con KOH o cultivo micológico antes de iniciar terapia sistémica para onicomicosis'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Terbinafina crema 1%',
            dose: 'Capa fina en espacios interdigitales y planta',
            route: 'Tópica cutánea',
            frequency: 'Cada 12 horas',
            duration: '2 a 4 semanas',
            rationale: 'Antifúngico alilamínico fungicida de elección para tiña pedis interdigital.',
          },
          {
            drug: 'Terbinafina tabletas (para onicomicosis podal confirmada por KOH)',
            dose: '250 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '12 semanas (previa verificación de función hepática basal)',
            rationale: 'Tratamiento sistémico con mayor tasa de curación micológica para onicomicosis de uñas de los pies.',
          },
        ],
        generalMeasures: [
          'Secado meticuloso entre los dedos después del baño y uso obligatorio de sandalias en duchas/albercas.',
          'Calcetines de algodón transpirables cambiados diariamente y ventilación/desinfección del calzado.',
          'Suspender cualquier crema con corticoides.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Aparición de eritema caliente ascendente, dolor intenso o secreción purulenta (celulitis secundaria).'],
        followUp: 'Control clínico y transaminasas a las 6 semanas si recibe terbinafina oral.',
      },
      criticalSafetyAlerts: [
        'NUNCA usar cremas combinadas con corticoides (betametasona + clotrimazol) en tiña pedis: causan tinea incognito y empeoran la infección fúngica.',
      ],
      guidelineReferences: [
        'BAD Guidelines for Management of Onychomycosis',
        'AAD Clinical Guidance on Dermatophyte Infections',
      ],
    },
    internalPersonaPrompt:
      'Habla como Fernando, instructor de natación de 35 años. Te pica y se pela la piel entre los dedos chicos del pie y la uña del dedo gordo derecho está gruesa y amarilla desde hace 3 meses.',
  },
  {
    id: 'case-exp-com-estrenimiento',
    mode: 'principiante',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Martha Lucía Paredes',
      age: 32,
      sex: 'Femenino',
      occupation: 'Contadora',
      consultReason: 'Dificultad para evacuar y sensación de inflamación abdominal',
      evolutionTime: '6 meses de evolución',
      currentIllness:
        'Paciente femenina de 32 años que acude porque desde hace seis meses evacua únicamente una a dos veces por semana, con heces muy duras en bolitas (Bristol tipo 1-2), pujo excesivo y sensación de evacuación incompleta. Refiere distensión abdominal leve que mejora al lograr evacuar. Niega pérdida de peso, sangre en las evacuaciones, fiebre o despertar nocturno por dolor.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '114/72 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 91,
      weightKg: 62,
      heightCm: 165,
    },
    background: {
      pathological: ['Niega hipotiroidismo conocido, diabetes o depresión.'],
      nonPathological: ['Trabaja sentada 10 horas diarias, toma menos de 700 mL de agua al día y consume poca fibra.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Toma ocasionalmente té de sen (laxante estimulante) cuando lleva 5 días sin evacuar.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-estrenimiento-abd',
        system: 'Abdomen',
        name: 'Exploración abdominal y región perianal',
        finding:
          'Abdomen blando, depresible, con leve timpanismo generalizado y palpación de marco cólico izquierdo ocupado por masa fecal blanda-firme indolora sin defensa muscular ni visceromegalias. Ruidos hidroaéreos presentes normales. Sin fisuras profundas ni masas rectales al tacto.',
        isAbnormal: true,
        semiologyNote:
          'Abdomen blando sin datos de alarma ni obstrucción con heces palpables en colon descendente orienta a estreñimiento funcional.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-estrenimiento-labs',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Biometría hemática, TSH y calcio sérico (descarte básico)',
        result: 'Hb 13.5 g/dL | Leucocitos 6,400 /mm³ | TSH 2.1 mUI/L | Calcio 9.4 mg/dL | Glucosa 91 mg/dL.',
        referenceRange: 'Hb 12-16 g/dL | TSH 0.4-4.0 mUI/L',
        interpretation: 'Sin anemia ferropénica ni causas metabólicas secundarias (hipotiroidismo/hipercalcemia).',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Estreñimiento Crónico Funcional (Criterios de Roma IV)',
      differentialDiagnoses: [
        'Síndrome de intestino irritable con predominio de estreñimiento',
        'Estreñimiento secundario a hipotiroidismo o fármacos',
        'Disinergia del piso pélvico',
        'Neoplasia obstructiva de colon (descartada por ausencia de signos de alarma)',
      ],
      pathophysiology:
        'Enlentecimiento del tránsito colónico y/o deshidratación del bolo fecal secundario a baja ingesta hídrica, dieta pobre en fibra soluble, sedentarismo y supresión voluntaria repetida del reflejo defecatorio.',
      keyClinicalClues: [
        '<3 evacuaciones semanales, esfuerzo defecatorio y heces Bristol 1-2 durante ≥6 meses',
        'Dieta baja en fibra/líquidos y sedentarismo laboral',
        'Ausencia total de signos de alarma (anemia, hematoquecia, pérdida de peso)',
      ],
      characteristicSignsSymptoms: [
        'Evacuaciones infrecuentes (<3/semana)',
        'Heces duras fragmentadas (Bristol 1-2)',
        'Esfuerzo defecatorio y sensación de vaciamiento incompleto',
      ],
      criticalRulingOutFactors: [
        'Hemoglobina normal, edad <50 años, ausencia de sangrado rectal y sin pérdida ponderal descartan patología orgánica maligna.',
      ],
      recommendedWorkup: ['Diagnóstico clínico (Roma IV); solo hemograma/TSH si sospecha clínica; colonoscopia únicamente ante datos de alarma'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Polietilenglicol (PEG 3350) polvo para solución oral',
            dose: '17 g disueltos en 240 mL de agua',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '2 a 4 semanas con ajuste según consistencia (meta Bristol 3-4)',
            rationale: 'Laxante osmótico de primera línea basado en evidencia; seguro para uso sostenido sin crear hábito.',
          },
          {
            drug: 'Psyllium plantago (fibra soluble formadora de bolo)',
            dose: '1 cucharada (5-7 g) en 250 mL de agua seguido de otro vaso de agua',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (incremento progresivo)',
            duration: 'Mantenimiento',
            rationale: 'Aumenta volumen e hidratación fecal si se acompaña de ingesta hídrica adecuada.',
          },
        ],
        generalMeasures: [
          'Incrementar hidratación a 1.5-2 litros de agua al día y caminar 30 minutos diarios.',
          'Entrenamiento intestinal: aprovechar reflejo gastrocólico tras el desayuno usando banco elevador de pies (postura en cuclillas).',
          'Evitar uso crónico diario de laxantes estimulantes irritativos (senósidos).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Aparición de sangre en heces, anemia, pérdida de peso inexplicada o ausencia de respuesta a laxantes osmóticos (estudiar disinergia pélvica).'],
        followUp: 'Revaloración en 4 semanas para verificar frecuencia evacuatoria y retiro progresivo de laxante.',
      },
      criticalSafetyAlerts: [
        'No prescribir fibra formadora de bolo sin asegurar hidratación adecuada ni ante sospecha de obstrucción mecánica o impactación fecal severa.',
      ],
      guidelineReferences: [
        'AGA / ACG Clinical Practice Guideline on Chronic Idiopathic Constipation (2023)',
        'Criterios Diagnósticos de Roma IV para Trastornos Funcionales Intestinales',
      ],
    },
    internalPersonaPrompt:
      'Habla como Martha, contadora de 32 años. Vas al baño solo 1 o 2 veces por semana, haces bolitas muy duras con mucho esfuerzo desde hace 6 meses; trabajas sentada y tomas poca agua.',
  },
  {
    id: 'case-exp-com-hipertiroidismo-graves',
    mode: 'medico_general',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Brenda Paola Mendoza',
      age: 29,
      sex: 'Femenino',
      occupation: 'Diseñadora de interiores',
      consultReason: 'Pérdida de peso, palpitaciones y nerviosismo persistente',
      evolutionTime: '3 meses de evolución',
      currentIllness:
        'Paciente femenina de 29 años que consulta porque en los últimos tres meses ha bajado 6 kg de peso a pesar de comer más de lo habitual, presenta palpitaciones frecuentes en reposo, temblor fino en las manos al sostener el lápiz, intolerancia marcada al calor con sudoración excesiva, insomnio e irritabilidad. También nota que sus evacuaciones son más frecuentes y sus ojos se ven más prominentes.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '132/68 mmHg',
      heartRate: 108,
      respiratoryRate: 18,
      temperature: 37.1,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 104,
      weightKg: 53,
      heightCm: 165,
    },
    background: {
      pathological: ['Previamente sana; reglas más escasas en los últimos dos ciclos.'],
      nonPathological: ['No consume pastillas para adelgazar ni hormonas tiroideas.'],
      family: ['Sin antecedentes familiares de relevancia referidos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-graves-cuello',
        system: 'Cabeza y Cuello',
        name: 'Exploración cervical tiroidea y signos oculares',
        finding:
          'Bocio difuso simétrico aproximadamente 2 veces su tamaño normal, de consistencia elástica e indoloro, con discreto soplo tiroideo a la auscultación. Exoftalmos bilateral leve con retracción palpebral superior y signo de Von Graefe (lid lag) presente.',
        isAbnormal: true,
        semiologyNote:
          'Bocio difuso indoloro + oftalmopatía (retracción palpebral/exoftalmos) + hipermetabolismo confirman Enfermedad de Graves.',
      },
      {
        id: 'pe-exp-graves-cardio',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y extremidades',
        finding:
          'Taquicardia rítmica (108 lpm) con ruidos cardíacos hiperdinámicos y presión de pulso amplia (64 mmHg). Piel caliente y húmeda, temblor postural fino en manos extendidas e hiperreflexia osteotendinosa.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-graves-perfil',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil Tiroideo y Anticuerpos Anti-Receptor de TSH (TRAb)',
        result: 'TSH: <0.01 mUI/L (suprimida) | T4 libre: 3.4 ng/dL (elevada) | T3 total: 310 ng/dL | Anticuerpos TRAb: POSITIVOS (8.6 UI/L).',
        referenceRange: 'TSH 0.4-4.0 mUI/L | T4 libre 0.8-1.8 ng/dL | TRAb <1.75 UI/L',
        interpretation: 'Hipertiroidismo primario franco de etiología autoinmune (Enfermedad de Graves).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-graves-ecg',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Taquicardia sinusal a 108 lpm, eje normal, intervalo QTc normal, sin fibrilación auricular ni signos de isquemia.',
        referenceRange: 'Ritmo sinusal 60-100 lpm',
        interpretation: 'Taquicardia sinusal adrenérgica sin arritmias malignas ni tormenta tiroidea.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hipertiroidismo Primario por Enfermedad de Graves (Consulta Ambulatoria)',
      differentialDiagnoses: [
        'Bocio multinodular tóxico',
        'Tiroiditis subaguda de De Quervain (fase tirotóxica dolorosa)',
        'Trastorno de ansiedad generalizada',
        'Tormenta tiroidea (descartada por ausencia de fiebre >38.5°C, delirio o falla orgánica)',
      ],
      pathophysiology:
        'Autoanticuerpos IgG estimulantes del receptor de TSH (TRAb) activan de manera continua las células foliculares tiroideas generando hiperproducción autónoma de T4/T3, sensibilización beta-adrenérgica periférica e inflamación orbitaria autoinmune.',
      keyClinicalClues: [
        'Pérdida de peso con apetito aumentado, intolerancia al calor, palpitaciones y temblor fino',
        'Bocio difuso indoloro + exoftalmos leve / signo de Von Graefe',
        'TSH suprimida (<0.01) con T4 libre elevada y TRAb positivos',
      ],
      characteristicSignsSymptoms: [
        'Bocio difuso con soplo tiroideo',
        'Retracción palpebral / oftalmopatía tiroidea',
        'Taquicardia, temblor distal y pérdida ponderal',
      ],
      criticalRulingOutFactors: [
        'Estado mental íntegro (Glasgow 15), normotermia y estabilidad hemodinámica descartan tormenta tiroidea aguda.',
      ],
      recommendedWorkup: ['TSH, T4 libre, anticuerpos TRAb, ECG basal, biometría hemática y pruebas hepáticas basales pre-antitiroideos'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metimazol (Tiamazol)',
            dose: '15 a 20 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '12 a 18 meses con ajuste por T4L/TSH y seguimiento por Endocrinología',
            rationale: 'Tionamida de primera línea que bloquea la peroxidasa tiroidea y la síntesis hormonal (preferida sobre propiltiouracilo fuera de 1.er trimestre de embarazo).',
          },
          {
            drug: 'Propranolol',
            dose: '20 a 40 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas',
            duration: '4 a 6 semanas hasta lograr eutiroidismo',
            rationale: 'Betabloqueador no selectivo que controla taquicardia, temblor y ansiedad e inhibe levemente conversión periférica T4->T3.',
          },
        ],
        generalMeasures: [
          'Evitar ejercicio intenso y cafeína hasta normalizar frecuencia cardíaca.',
          'Lubricación ocular frecuente si existe exposición corneal por exoftalmos; evitar tabaquismo (empeora oftalmopatía).',
          'Advertir signos de agranulocitosis (fiebre o dolor faríngeo súbito) para suspender metimazol y acudir a biometría urgente.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Fiebre alta >38.5°C, taquicardia >130 lpm, agitación/confusión o ictericia (riesgo de tormenta tiroidea o hepatotoxicidad).'],
        followUp: 'Perfil tiroideo (T4 libre) y consulta con Endocrinología en 4 semanas.',
      },
      criticalSafetyAlerts: [
        'Advertir explícitamente al paciente que si presenta fiebre o odinofagia bajo Metimazol debe suspenderlo y realizar biometría urgente por riesgo de agranulocitosis.',
        'Verificar posibilidad de embarazo antes de elegir tionamida o yodo radiactivo.',
      ],
      guidelineReferences: [
        'ATA / ETA Guidelines for Diagnosis and Management of Hyperthyroidism',
        'NICE NG145: Thyroid disease: assessment and management',
      ],
    },
    internalPersonaPrompt:
      'Habla como Brenda, diseñadora de 29 años. Bajaste 6 kilos comiendo mucho, te tiemblan las manos, te late rápido el corazón, tienes mucho calor y notas los ojos un poco saltones.',
  },
  {
    id: 'case-exp-com-angina-estable',
    mode: 'medico_general',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Roberto Carlos Domínguez',
      age: 61,
      sex: 'Masculino',
      occupation: 'Comerciante',
      consultReason: 'Opresión en el pecho que aparece al caminar rápido o subir escaleras',
      evolutionTime: '4 meses de evolución',
      currentIllness:
        'Paciente masculino de 61 años que consulta porque desde hace cuatro meses, cada vez que camina más de dos cuadras cuesta arriba o sube dos pisos de escaleras, siente una opresión retroesternal pesada que se corre levemente al hombro izquierdo y lo obliga a detenerse. Refiere que el malestar cede por completo en 3 a 5 minutos tras sentarse a descansar. Niega dolor en reposo, sudoración fría, falta de aire nocturna o empeoramiento reciente de los episodios.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '142/86 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 118,
      weightKg: 86,
      heightCm: 172,
    },
    background: {
      pathological: ['Hipertensión arterial sistémica y dislipidemia en tratamiento irregular desde hace 8 años.'],
      nonPathological: ['Fumó 15 cigarrillos/día durante 25 años (suspendió hace 1 año). Sedentario.'],
      family: ['Madre con artrosis leve; padre sano.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Losartán 50 mg cada 24 h (lo olvida algunos días); suspendió su estatina hace meses.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-angina-cardio',
        system: 'Cardiovascular',
        name: 'Exploración cardiovascular y pulsos periféricos',
        finding:
          'Paciente tranquilo y sin dolor en el consultorio. Ruidos cardíacos rítmicos a 76 lpm, presencia de cuarto ruido (S4) discreto sin soplos ni frote pericárdico. Sin ingurgitación yugular, pulsos periféricos simétricos sin edema maleolar.',
        isAbnormal: true,
        semiologyNote:
          'Cuarto ruido (S4) sugiere rigidez ventricular izquierda hipertensiva/isquémica en paciente asintomático en reposo.',
      },
      {
        id: 'pe-exp-angina-pulm',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar y palpación torácica',
        finding: 'Campos pulmonares limpios sin estertores; la palpación condrocostal no reproduce ningún dolor.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-angina-ecg',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones en reposo',
        result: 'Ritmo sinusal a 75 lpm, signos de hipertrofia ventricular izquierda con inversión leve de onda T asimétrica en V5-V6; sin elevación ni depresión aguda del ST.',
        referenceRange: 'Ritmo sinusal sin alteraciones isquémicas agudas',
        interpretation: 'ECG basal estable sin datos de síndrome coronario agudo en curso.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-angina-trop',
        category: 'Laboratorio',
        subcategory: 'Cardiovascular',
        name: 'Troponina I de alta sensibilidad + Perfil lipídico',
        result: 'Troponina I: 4 ng/L (negativa) | Colesterol total: 248 mg/dL | LDL: 162 mg/dL | HDL: 36 mg/dL | HbA1c: 6.2%.',
        referenceRange: 'Troponina I <19 ng/L | LDL óptimo <70 mg/dL en riesgo coronario',
        interpretation: 'Descarta necrosis miocárdica aguda y documenta dislipidemia aterogénica no controlada.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Angina de Pecho Estable (Síndrome Coronario Crónico)',
      differentialDiagnoses: [
        'Angina inestable / Síndrome coronario agudo sin elevación del ST',
        'Enfermedad por reflujo gastroesofágico o espasmo esofágico',
        'Costocondritis mecánica',
        'Estenosis aórtica sintomática',
      ],
      pathophysiology:
        'Estenosis aterosclerótica crónica fija de una o más arterias coronarias epicárdicas que mantiene flujo suficiente en reposo pero resulta incapaz de satisfacer el aumento de demanda miocárdica de oxígeno durante el esfuerzo físico.',
      keyClinicalClues: [
        'Dolor opresivo retroesternal desencadenado predeciblemente por esfuerzo físico (>2 cuadras/escaleras)',
        'Alivio completo en <5 minutos con el reposo sin cambios recientes en frecuencia ni duración',
        'Múltiples factores de riesgo cardiovascular (HTA, tabaquismo previo, dislipidemia, AHF) con troponina negativa',
      ],
      characteristicSignsSymptoms: [
        'Opresión retroesternal típica desencadenada por esfuerzo',
        'Duración breve (3-5 minutos) que cede con reposo',
        'Troponina negativa y ECG sin cambios agudos del ST',
      ],
      criticalRulingOutFactors: [
        'Ausencia de dolor en reposo, estabilidad de 4 meses y troponina normal descartan síndrome coronario agudo.',
        'Dolor no reproducible a la palpación condrocostal descarta costocondritis.',
      ],
      recommendedWorkup: ['ECG basal, troponina para descartar SCA, perfil lipídico/glucémico y prueba de inducción de isquemia / eco estrés por Cardiología'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ácido Acetilsalicílico (Aspirina)',
            dose: '100 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Indefinida',
            rationale: 'Antiagregación plaquetaria de base que reduce eventos coronarios mayores en síndrome coronario crónico.',
          },
          {
            drug: 'Atorvastatina (o Rosuvastatina de alta intensidad) + Bisoprolol',
            dose: 'Atorvastatina 40-80 mg VO c/24 h + Bisoprolol 2.5-5 mg VO c/24 h',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Crónica indefinida (y nitroglicerina sublingual PRN para crisis)',
            rationale: 'Estatina de alta potencia estabiliza placa ateromatosa (meta LDL <55 mg/dL); betabloqueador reduce demanda miocárdica de O2 y episodios anginosos.',
          },
        ],
        generalMeasures: [
          'Control estricto de presión arterial (<130/80 mmHg) y dieta cardioprotectora baja en grasas saturadas y sodio.',
          'Educar signos de alarma para acudir de inmediato a Urgencias si el dolor aparece en reposo o dura >15-20 minutos.',
          'Referencia programada a Cardiología para estratificación funcional (ergometría / angiotomografía coronaria).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Dolor torácico en reposo, duración >15 minutos, diaforesis o disnea aguda (activar código infarto).'],
        followUp: 'Valoración preferente en Cardiología en 1 a 2 semanas con prueba de esfuerzo.',
      },
      criticalSafetyAlerts: [
        'Si prescribe nitratos sublinguales de rescate, verificar que el paciente NO use inhibidores de fosfodiesterasa-5 (sildenafil/tadalafil) por riesgo de hipotensión severa.',
      ],
      guidelineReferences: [
        'ESC 2024 Guidelines for the Management of Chronic Coronary Syndromes',
        'AHA/ACC Guideline for the Management of Patients With Chronic Coronary Disease',
      ],
    },
    internalPersonaPrompt:
      'Habla como Roberto, comerciante de 61 años. Desde hace 4 meses te aprieta el pecho al caminar rápido o subir escaleras y se te quita al sentarte unos 4 minutos; dejaste tus pastillas del colesterol.',
  },
  {
    id: 'case-exp-com-ulcera-venosa',
    mode: 'medico_general',
    specialty: 'cirugia_general',
    patientInfo: {
      name: 'Rosa María Benítez',
      age: 63,
      sex: 'Femenino',
      occupation: 'Vendedora de abarrotes (pasa 9 horas de pie)',
      consultReason: 'Llaga abierta arriba del tobillo izquierdo e hinchazón de piernas',
      evolutionTime: '5 meses de evolución',
      currentIllness:
        'Paciente femenina de 63 años que acude por una herida abierta superficial en la cara interna de la pierna izquierda por arriba del tobillo desde hace cinco meses tras un roce leve, que supura líquido claro y no logra cerrar. Refiere pesadez, calambres nocturnos e hinchazón vespertina de ambos tobillos desde hace años. Niega dolor intenso al caminar o al elevar la pierna, fiebre o escalofríos.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 79,
      heightCm: 158,
    },
    background: {
      pathological: ['Várices visibles en miembros inferiores desde hace 15 años.'],
      nonPathological: ['Bipedestación prolongada diaria en su tienda.'],
      family: ['Sin antecedentes heredofamiliares de relevancia.'],
      surgical: ['3 partos eutócicos; niega cirugías vasculares.'],
      currentMedications: ['Aplicó remedios herbales y alcohol sobre la herida sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-venosa-pierna',
        system: 'Osteomuscular y Piel',
        name: 'Exploración vascular y dermatológica de miembros inferiores',
        finding:
          'Úlcera de 3.5 x 3 cm sobre el maléolo medial izquierdo, de bordes irregulares y poco profundos, lecho rojizo con tejido de granulación y exudado seroso moderado sin pus ni mal olor. Piel circundante con hiperpigmentación ocre (dermatitis ocre por hemosiderina), lipodermatoesclerosis, várices dilatadas y edema maleolar vespertino bilateral. Pulsos pedios y tibiales posteriores palpables fuertes y simétricos.',
        isAbnormal: true,
        semiologyNote:
          'Localización supramaleolar medial + bordes irregulares poco profundos + dermatitis ocre y pulsos presentes definen úlcera venosa crónica.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-venosa-doppler',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Índice Tobillo-Brazo (ITB) y Ecografía Doppler Venosa de Miembro Inferior Izquierdo',
        result:
          'ITB derecho: 1.05 | ITB izquierdo: 1.02 (sin enfermedad arterial periférica). Doppler venoso: flujo venoso profundo permeable sin trombosis; reflujo significativo (>1.2 s) en vena safena magna y perforantes mediales.',
        referenceRange: 'ITB normal 0.90-1.30 | Reflujo venoso <0.5 s',
        interpretation: 'Confirma insuficiencia venosa crónica superficial sin componente isquémico arterial, autorizando terapia compresiva segura.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Insuficiencia Venosa Crónica con Úlcera Venosa Maleolar Medial',
      differentialDiagnoses: [
        'Úlcera arterial isquémica (dolorosa en reposo/dedos, pulsos ausentes)',
        'Úlcera neuropática diabética (plantar indolora)',
        'Celulitis bacteriana aguda sobreinfección',
        'Pioderma gangrenoso o carcinoma epidermoide (úlcera de Marjolin)',
      ],
      pathophysiology:
        'Incompetencia valvular venosa que genera hipertensión venosa ambulatoria crónica, extravasación de eritrocitos (depósito de hemosiderina/dermatitis ocre), edema pericapilar e hipoxia tisular local que impide la cicatrización epidérmica.',
      keyClinicalClues: [
        'Úlcera superficial de bordes irregulares en cara interna supramaleolar del tobillo',
        'Dermatitis ocre, várices, edema vespertino y alivio relativo al elevar la pierna',
        'Pulsos distales conservados e Índice Tobillo-Brazo normal (ITB >0.9)',
      ],
      characteristicSignsSymptoms: [
        'Úlcera en maléolo medial de lecho húmedo',
        'Hiperpigmentación ocre y edema de tobillos',
        'Pulsos pedios presentes e ITB normal',
      ],
      criticalRulingOutFactors: [
        'ITB >0.9 y pulsos pedios palpables fuertes descartan úlcera arterial isquémica antes de indicar vendaje compresivo.',
      ],
      recommendedWorkup: ['Índice Tobillo-Brazo (ITB) obligatorio antes de compresión + Doppler venoso'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Diosmina / Hesperidina (fracción flavonoica purificada micronizada)',
            dose: '500 mg (o 1000 mg una vez al día)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '8 a 12 semanas como coadyuvante',
            rationale: 'Flebotónico que mejora el tono venoso, reduce edema y favorece cierre ulceroso junto con la compresión.',
          },
        ],
        generalMeasures: [
          'Piedra angular: Terapia de compresión graduada multicapa (30-40 mmHg) aplicada tras confirmar ITB ≥0.9.',
          'Curación húmeda con solución salina fisiológica y apósito hidrocoloide/espuma absorbente (sin alcohol, yodo ni remedios caseros citotóxicos).',
          'Elevación de piernas sobre el nivel del corazón 30 min tres veces al día y evitar bipedestación estática prolongada.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Aparición de eritema caliente expansivo, pus o fiebre (infección), o ausencia de cicatrización tras 3 meses (biopsia + Cirugía Vascular).'],
        followUp: 'Curación y vigilancia semanal en clínica de heridas y valoración por Angiología/Cirugía Vascular.',
      },
      criticalSafetyAlerts: [
        'NUNCA iniciar vendaje compresivo fuerte sin comprobar antes Índice Tobillo-Brazo ≥0.8-0.9 (riesgo de necrosis isquémica si hubiera arteriopatía oculta).',
        'No prescribir antibióticos sistémicos en úlceras venosas limpias sin signos clínicos de celulitis/infección.',
      ],
      guidelineReferences: [
        'ESVS Clinical Practice Guidelines on Management of Chronic Venous Disease',
        'SVS/AVF Guidelines for Management of Venous Leg Ulcers',
      ],
    },
    internalPersonaPrompt:
      'Habla como Rosa María, de 63 años. Trabajas parada 9 horas en tu tiendita y tienes una llaga arriba del tobillo izquierdo por dentro que no cierra desde hace 5 meses y los tobillos se te hinchan en la tarde.',
  },
  {
    id: 'case-exp-com-eip',
    mode: 'medico_general',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Daniela Alejandra Cruz',
      age: 24,
      sex: 'Femenino',
      occupation: 'Estilista',
      consultReason: 'Dolor en el vientre bajo, fiebre y flujo vaginal distinto',
      evolutionTime: '4 días de evolución',
      currentIllness:
        'Paciente femenina de 24 años que acude por dolor continuo en la parte baja del abdomen (hipogastrio y ambas fosas ilíacas) desde hace cuatro días, que empeora al caminar y durante las relaciones sexuales. Refiere además flujo vaginal amarillento con mal olor, febrícula de 38.1°C desde ayer y náuseas leves. Última menstruación inició hace 9 días. Tiene pareja sexual nueva desde hace 2 meses y no usa preservativo.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 96,
      respiratoryRate: 18,
      temperature: 38.1,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 61,
      heightCm: 164,
    },
    background: {
      pathological: ['Niega infecciones urinarias recientes; niega uso de DIU.'],
      nonPathological: ['Vida sexual activa, pareja reciente sin método de barrera; usa anticonceptivos orales.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Etinilestradiol/drospirenona oral diario; tomó paracetamol hoy.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-eip-gine',
        system: 'Abdomen',
        name: 'Exploración abdominal y tacto vaginal bimanual',
        finding:
          'Abdomen blando con dolor a la palpación profunda en hipogastrio y ambas fosas ilíacas sin rebote franco. A la especuloscopia: secreción mucopurulenta en orificio cervical externo. Al tacto bimanual: dolor intenso a la movilización del cuello uterino (signo de Chandelier positivo), sensibilidad uterina y anexial bilateral sin masas pélvicas fluctuantes.',
        isAbnormal: true,
        semiologyNote:
          'Dolor abdominal bajo + dolor a la movilización cervical + sensibilidad anexial bilateral + flujo mucopurulento cumplen criterios mínimos de CDC para EIP.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-eip-bhcg',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Prueba inmunológica de embarazo (β-hCG) y EGO',
        result: 'β-hCG en orina/suero: NEGATIVA | EGO: Esterasa leucocitaria +, nitritos negativos, sin bacteriuria significativa.',
        referenceRange: 'β-hCG negativa',
        interpretation: 'Descarta embarazo ectópico y cistitis aguda como causa del dolor pélvico.',
        isAbnormal: false,
      },
      {
        id: 'std-exp-eip-eco',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido pélvico transvaginal + Biometría hemática / PCR',
        result:
          'Útero y ovarios de morfología conservada, leve engrosamiento de salpinges bilaterales y escaso líquido libre en fondo de saco sin absceso tubo-ovárico. Leucocitos: 13,400 /mm³ | PCR: 38 mg/L.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | PCR <5 mg/L',
        interpretation: 'Apoya inflamación pélvica aguda no complicada (sin absceso drenable).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad Inflamatoria Pélvica (EIP) Aguda No Complicada',
      differentialDiagnoses: [
        'Apendicitis aguda',
        'Embarazo ectópico (descartado por β-hCG negativa)',
        'Quiste ovárico torcido o roto',
        'Infección de vías urinarias / pielonefritis',
      ],
      pathophysiology:
        'Infección ascendente polimicrobiana desde endocérvix hacia endometrio y trompas uterinas (frecuentemente iniciada por Chlamydia trachomatis y Neisseria gonorrhoeae junto con anaerobios vaginales), causando endometritis y salpingitis.',
      keyClinicalClues: [
        'Dolor pélvico bajo bilateral postmenstrual en mujer joven sexualmente activa sin preservativo',
        'Dolor a la movilización cervical y sensibilidad anexial/uterina al tacto bimanual',
        'Fiebre, secreción cervical mucopurulenta y prueba de embarazo negativa',
      ],
      characteristicSignsSymptoms: [
        'Dolor abdominal bajo y dispareunia',
        'Signo de Chandelier (dolor al mover el cérvix)',
        'Secreción endocervical mucopurulenta y fiebre',
      ],
      criticalRulingOutFactors: [
        'Prueba de embarazo negativa descarta embarazo ectópico; ultrasonido sin masa anexial descarta absceso tubo-ovárico o torsión.',
      ],
      recommendedWorkup: ['β-hCG obligatoria, biometría/PCR, tamizaje ITS (VIH/VDRL/NAAT) y ecografía pélvica si duda o sospecha de absceso'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ceftriaxona (dosis única) + Doxiciclina + Metronidazol (esquema CDC ambulatorio)',
            dose: 'Ceftriaxona 500 mg IM dosis única + Doxiciclina 100 mg VO + Metronidazol 500 mg VO',
            route: 'Intramuscular + Vía Oral',
            frequency: 'Doxiciclina y Metronidazol cada 12 horas',
            duration: '14 días completos',
            rationale: 'Cubre simultáneamente N. gonorrhoeae, C. trachomatis y anaerobios pélvicos para prevenir infertilidad tubárica y dolor crónico.',
          },
        ],
        generalMeasures: [
          'Abstinencia sexual hasta completar tratamiento ella y su(s) pareja(s) de los últimos 60 días y resolución de síntomas.',
          'Estudio y tratamiento empírico de la pareja sexual para evitar reinfección.',
          'Tamizaje de otras ITS (VIH, sífilis, hepatitis B) y consejería en uso de preservativo.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Vómito incoercible que impide vía oral, fiebre >38.5°C persistente, embarazo, sospecha de absceso tubo-ovárico o falta de mejoría a las 72 horas (requiere manejo IV hospitalario).',
        ],
        followUp: 'Revaloración clínica obligatoria en 48 a 72 horas para confirmar mejoría franca del dolor.',
      },
      criticalSafetyAlerts: [
        'SIEMPRE descartar embarazo con β-hCG antes de asumir EIP y tratar también a la pareja sexual.',
      ],
      guidelineReferences: [
        'CDC STI Treatment Guidelines: Pelvic Inflammatory Disease (PID)',
        'BASHH UK National Guideline for Management of Pelvic Inflammatory Disease',
      ],
    },
    internalPersonaPrompt:
      'Habla como Daniela, de 24 años. Tienes dolor constante en el vientre bajo desde hace 4 días, calentura desde ayer y flujo amarillo con mal olor; empezaste con pareja nueva hace 2 meses sin condón.',
  },
  {
    id: 'case-exp-com-aborto-incompleto',
    mode: 'urgencias',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Carolina Isabel Paredes',
      age: 27,
      sex: 'Femenino',
      occupation: 'Asistente administrativa',
      consultReason: 'Sangrado vaginal abundante con coágulos y dolor cólico en vientre bajo',
      evolutionTime: '6 horas de evolución',
      currentIllness:
        'Paciente femenina de 27 años embarazada de 9 semanas por fecha de última regla, que acude a Urgencias por presentar desde hace seis horas dolor tipo cólico intenso en bajo vientre acompañado de sangrado transvaginal rojo rutilante abundante que empapó tres toallas sanitarias, con expulsión de coágulos y tejido hace una hora. Refiere mareo leve al levantarse. Niega fiebre.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '100/64 mmHg',
      heartRate: 106,
      respiratoryRate: 20,
      temperature: 36.7,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 62,
      heightCm: 163,
    },
    background: {
      pathological: ['Grupo sanguíneo O Rh NEGATIVO documentado en carnet prenatal; primer embarazo.'],
      nonPathological: ['Niega toma de medicamentos abortivos, tabaco o alcohol.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ácido fólico 400 mcg diarios.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-aborto-gine',
        system: 'Abdomen',
        name: 'Exploración abdominal y especuloscopia obstétrica',
        finding:
          'Abdomen blando, doloroso en hipogastrio sin irritación peritoneal ni masas anexiales palpables. En especuloscopia: sangrado activo moderado proveniente de cavidad uterina, orificio cervical externo E INTERNO DILATADOS (~1.5 cm) con restos ovulares retenidos visibles en canal cervical.',
        isAbnormal: true,
        semiologyNote:
          'Orificio cervical interno abierto/dilatado con expulsión parcial de restos ovulares y sangrado activo confirma aborto incompleto.',
      },
      {
        id: 'pe-exp-aborto-gen',
        system: 'General',
        name: 'Estado hemodinámico y perfusión',
        finding: 'Palidez tegumentaria leve, mucosas hidratadas, llenado capilar 2 segundos, taquicardia compensatoria a 106 lpm.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-aborto-eco',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido pélvico transvaginal de urgencia',
        result:
          'Útero aumentado de tamaño con cavidad endometrial ocupada por ecos heterogéneos y coágulos de 24 mm de grosor; saco gestacional deformado ausente/incompleto; anexos sin embarazo ectópico ni líquido libre masivo.',
        referenceRange: 'Saco gestacional intrauterino íntegro con embrión vivo o endometrio lineal vacío',
        interpretation: 'Confirma retención de restos ovulares intrauterinos (aborto incompleto) y excluye embarazo ectópico.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-aborto-labs',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría hemática, grupo/Rh y β-hCG cuantitativa',
        result: 'Hb: 10.6 g/dL | Hto: 32% | Plaquetas: 230,000 /mm³ | Grupo y Factor: O Rh NEGATIVO | Coombs indirecto: Negativo.',
        referenceRange: 'Hb 12-16 g/dL',
        interpretation: 'Anemia aguda leve secundaria a pérdida hemática; paciente Rh negativa no sensibilizada que requiere profilaxis anti-D.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Aborto Incompleto del Primer Trimestre (en Paciente Rh Negativa)',
      differentialDiagnoses: [
        'Amenaza de aborto (orificio cervical cerrado y embrión vivo)',
        'Aborto completo (cavidad vacía y cese del sangrado)',
        'Embarazo ectópico roto',
        'Enfermedad trofoblástica gestacional (mola hidatiforme)',
      ],
      pathophysiology:
        'Interrupción espontánea de la gestación antes de las 20 semanas con dilatación del orificio cervical interno y expulsión parcial del producto de la concepción, permaneciendo tejido trofoblástico retenido que impide la retracción miometrial y perpetúa la hemorragia.',
      keyClinicalClues: [
        'Embarazo de 9 semanas con cólicos intensos, sangrado rojo abundante y expulsión de tejido',
        'Orificio cervical interno dilatado con restos en canal y ecografía con material endometrial heterogéneo (>15-20 mm)',
        'Antecedente crítico de grupo sanguíneo Rh NEGATIVO',
      ],
      characteristicSignsSymptoms: [
        'Hemorragia transvaginal con coágulos y restos',
        'Cérvix dilatado al tacto/especuloscopia',
        'Restos ovulares intrauterinos en ultrasonido',
      ],
      criticalRulingOutFactors: [
        'Orificio cervical interno abierto descarta amenaza de aborto; ultrasonido con contenido intrauterino y anexos libres descarta embarazo ectópico.',
      ],
      recommendedWorkup: ['Ultrasonido transvaginal urgente, biometría hemática, tipificación ABO/Rh y pruebas cruzadas'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Oxitocina IV (o Misoprostol 600 mcg VO / 400 mcg SL si manejo médico) + Analgesia',
            dose: 'Oxitocina 10-20 UI en 500 mL solución salina 0.9% IV tras estabilización / AMEU',
            route: 'Intravenosa (en sala de urgencias)',
            frequency: 'Infusión continua durante evacuación uterina',
            duration: 'Fase aguda hasta adecuada retracción uterina',
            rationale: 'Favorece la contracción miometrial tras el vaciamiento uterino instrumental (AMEU), reduciendo pérdida sanguínea.',
          },
          {
            drug: 'Inmunoglobulina Anti-D (Rhogam)',
            dose: '300 mcg (o 50-300 mcg según protocolo local <12 semanas)',
            route: 'Intramuscular',
            frequency: 'Dosis única dentro de las primeras 72 horas',
            duration: 'Dosis única',
            rationale: 'Previene la aloinmunización materna Rh en embarazos futuros.',
          },
        ],
        generalMeasures: [
          'Canalizar vía venosa permeable de grueso calibre (16-18G) e hidratación cristaloide isotónica si taquicardia o hipotensión.',
          'Evacuación uterina por Aspiración Manual Endouterina (AMEU) prioritaria ante sangrado activo abundante.',
          'Acompañamiento emocional empático y consejería post-evento obstétrico.',
        ],
        hospitalizationDecision: 'Quirófano / Cirugía de Urgencia',
        referralCriteria: ['Choque hipovolémico, hemoglobina <7 g/dL o fiebre con olor fétido (aborto séptico).'],
        followUp: 'Control ginecológico en 7 a 14 días y verificación de cese de sangrado.',
      },
      criticalSafetyAlerts: [
        'NUNCA olvidar administrar Inmunoglobulina Anti-D en paciente Rh negativa tras aborto.',
        'Ante sangrado activo abundante y taquicardia, no diferir estabilización con cristaloides ni vaciamiento uterino (AMEU).',
      ],
      guidelineReferences: [
        'ACOG Practice Bulletin No. 200: Early Pregnancy Loss',
        'OMS: Atención para el aborto y manejo del aborto incompleto',
      ],
    },
    internalPersonaPrompt:
      'Habla como Carolina, de 27 años, con 9 semanas de embarazo. Estás asustada porque desde hace 6 horas tienes cólicos fuertes, sangrado abundante con coágulos y hace una hora arrojaste un pedacito de tejido; eres O negativo.',
  },
  {
    id: 'case-exp-com-diabetes-gestacional',
    mode: 'medico_general',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Alejandra Beatriz Ochoa',
      age: 33,
      sex: 'Femenino',
      occupation: 'Maestra de primaria',
      consultReason: 'Control prenatal de rutina y revisión de estudios solicitados',
      evolutionTime: 'Control prenatal (26 semanas de gestación)',
      currentIllness:
        'Paciente femenina de 33 años cursando su segundo embarazo de 26 semanas de gestación, asintomática, que acude a consulta prenatal con los resultados de su curva de tolerancia oral a la glucosa (PTOG 75 g) realizada hace dos días. Niega visión borrosa, dolor de cabeza, hinchazón súbita, sangrado vaginal o disminución de movimientos fetales.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/72 mmHg',
      heartRate: 82,
      respiratoryRate: 17,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 108,
      weightKg: 76,
      heightCm: 161,
    },
    background: {
      pathological: ['Sobrepeso pregestacional (IMC 27.8); niega diabetes conocida previa al embarazo.'],
      nonPathological: ['Dieta habitual rica en pan dulce, jugos industrializados y refrescos durante el embarazo.'],
      family: ['Padres aparentemente sanos; sin antecedentes relevantes.'],
      surgical: ['Parto previo hace 4 años de recién nacido de 4,150 gramos (macrosomía).'],
      currentMedications: ['Hierro + ácido fólico prenatal diario.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-dmg-obst',
        system: 'Abdomen',
        name: 'Exploración obstétrica y fondo uterino',
        finding:
          'Abdomen globoso a expensas de útero grávido; altura de fondo uterino 27 cm (acorde a 26-27 semanas), frecuencia cardíaca fetal rítmica de 146 lpm por Doppler, movimientos fetales activos presentes. Sin edema pretibial patológico.',
        isAbnormal: false,
        semiologyNote: 'Embarazo normoevolutivo en semana 26 con factores de riesgo metabólico (antecedente de macrosomía y carga familiar de DM2).',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-dmg-ptog',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Prueba de Tolerancia Oral a la Glucosa (PTOG 75 g — Criterios IADPSG/ADA)',
        result: 'Glucosa ayuno: 98 mg/dL (ref <92) | Glucosa 1 hora: 194 mg/dL (ref <180) | Glucosa 2 horas: 162 mg/dL (ref <153).',
        referenceRange: 'Ayuno <92 mg/dL | 1 h <180 mg/dL | 2 h <153 mg/dL',
        interpretation: 'Los tres valores superan el umbral diagnóstico IADPSG/OMS: confirma Diabetes Mellitus Gestacional.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-dmg-ego',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO) + Urocultivo prenatal',
        result: 'Glucosuria trazas (+), cetonas negativas, proteínas negativas, leucocitos 1/campo, nitritos negativos.',
        referenceRange: 'Proteínas negativas | Nitritos negativos',
        interpretation: 'Descarta proteinuria (preeclampsia) e infección urinaria concomitante.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Diabetes Mellitus Gestacional',
      differentialDiagnoses: [
        'Diabetes Mellitus tipo 2 pregestacional manifiesta (requeriría glucosa ayuno ≥126 o HbA1c ≥6.5% en 1.er trimestre)',
        'Glucosuria renal fisiológica del embarazo',
        'Intolerancia transitoria sin criterios diagnósticos',
      ],
      pathophysiology:
        'Resistencia a la insulina inducida fisiológicamente en la segunda mitad del embarazo por hormonas placentarias (lactógeno placentario, progesterona, cortisol) que supera la capacidad compensatoria secretora de las células beta pancreáticas.',
      keyClinicalClues: [
        'PTOG 75 g en semana 26 con valores alterados (ayuno ≥92, 1h ≥180, 2h ≥153 mg/dL)',
        'Antecedente de recién nacido macrosómico (>4 kg), sobrepeso y madre con DM2',
        'Presión arterial normal y ausencia de proteinuria',
      ],
      characteristicSignsSymptoms: [
        'Diagnóstico por tamizaje bioquímico (usualmente asintomática)',
        'Antecedente de macrosomía previa',
        'Tres valores elevados en PTOG 75 g',
      ],
      criticalRulingOutFactors: [
        'Presión arterial normal y proteinuria negativa descartan trastorno hipertensivo del embarazo.',
      ],
      recommendedWorkup: ['PTOG 75 g entre semanas 24-28, automonitoreo glucémico capilar diario y seguimiento ultrasonográfico de crecimiento fetal'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Terapia nutricional médica como 1.ª línea; Insulina humana NPH / rápida si metas no se logran en 1-2 semanas',
            dose: 'Iniciar solo si glucosa ayuno ≥95 o 1h postprandial ≥140 mg/dL tras dieta',
            route: 'Subcutánea (si se requiere insulina)',
            frequency: 'Esquema ajustado a automonitoreo capilar',
            duration: 'Hasta el parto (reevaluar PTOG 4-12 semanas postparto)',
            rationale: 'La insulina no atraviesa la placenta y es el fármaco de primera línea si fracasa la terapia nutricional y ejercicio.',
          },
        ],
        generalMeasures: [
          'Plan nutricional fraccionado (3 comidas + 2 colaciones), eliminando azúcares simples, jugos y refrescos.',
          'Actividad física moderada segura (caminata 20-30 min tras comidas si no hay contraindicación obstétrica).',
          'Automonitoreo glucémico capilar en ayuno (meta <95 mg/dL) y 1 h postprandial (<140 mg/dL) o 2 h (<120 mg/dL).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Glucemias capilares persistentemente fuera de meta tras 1-2 semanas de dieta (iniciar insulina), cetonuria o polihidramnios/macrosomía fetal.'],
        followUp: 'Control prenatal conjunto con Obstetricia y Nutrición en 1 a 2 semanas con bitácora de glucometrías.',
      },
      criticalSafetyAlerts: [
        'Evitar sulfonilureas (glibenclamida) como primera línea en embarazo por riesgo de hipoglucemia neonatal y paso transplacentario.',
        'Recordar realizar PTOG 75 g a las 4-12 semanas postparto para reclasificación metabólica.',
      ],
      guidelineReferences: [
        'ADA Standards of Care in Diabetes — Management of Diabetes in Pregnancy',
        'ACOG Practice Bulletin: Gestational Diabetes Mellitus',
      ],
    },
    internalPersonaPrompt:
      'Habla como Alejandra, maestra de 33 años con 26 semanas de embarazo. Te sientes bien y vienes a mostrar los resultados de la curva de azúcar; tu primer bebé pesó más de 4 kilos.',
  },
  {
    id: 'case-exp-com-diverticulitis',
    mode: 'medico_general',
    specialty: 'cirugia_general',
    patientInfo: {
      name: 'Jorge Alberto Villalobos',
      age: 58,
      sex: 'Masculino',
      occupation: 'Ingeniero civil',
      consultReason: 'Dolor en la parte baja izquierda del abdomen y fiebre',
      evolutionTime: '48 horas de evolución',
      currentIllness:
        'Paciente masculino de 58 años que acude por dolor abdominal continuo y progresivo localizado en el cuadrante inferior izquierdo desde hace 48 horas, que empeora al toser o caminar, acompañado de fiebre de 38.2°C, pérdida del apetito y estreñimiento reciente. Niega vómitos persistentes, diarrea con sangre o ardor al orinar.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '126/78 mmHg',
      heartRate: 94,
      respiratoryRate: 18,
      temperature: 38.2,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 102,
      weightKg: 84,
      heightCm: 174,
    },
    background: {
      pathological: ['Estreñimiento habitual desde hace años; niega cirugías abdominales previas.'],
      nonPathological: ['Dieta baja en fibra y alto consumo de carnes rojas; no fuma.'],
      family: ['Sin antecedentes heredofamiliares de relevancia.'],
      surgical: ['Apendicectomía en la juventud (hace 30 años).'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-divert-abd',
        system: 'Abdomen',
        name: 'Exploración abdominal por cuadrantes',
        finding:
          'Dolor focal intenso a la palpación superficial y profunda en fosa ilíaca izquierda ("apendicitis del lado izquierdo"), con resistencia muscular voluntaria localizada pero sin abdomen en tabla ni rebote generalizado. Ruidos peristálticos disminuidos. Cicatriz de McBurney antigua.',
        isAbnormal: true,
        semiologyNote:
          'Dolor en fosa ilíaca izquierda + fiebre en paciente >50 años con antecedente de apendicectomía previa es cuadro clásico de diverticulitis aguda sigmoidea.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-divert-tac',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Tomografía Computarizada (TAC) de abdomen y pelvis con contraste',
        result:
          'Múltiples divertículos en colon sigmoides con engrosamiento focal de la pared sigmoidea (6 mm) y estriación inflamatoria de la grasa pericólica adyacente. Sin aire libre extraluminal (neumoperitoneo) ni abscesos o colecciones drenables (Hinchey Ia).',
        referenceRange: 'Pared colónica <3 mm sin cambios inflamatorios pericólicos',
        interpretation: 'Confirma diverticulitis aguda no complicada (clasificación Hinchey Ia).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-divert-labs',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y Proteína C Reactiva (PCR)',
        result: 'Hb 14.3 g/dL | Leucocitos: 14,100 /mm³ (Neutrófilos 80%) | Plaquetas 260,000 /mm³ | PCR: 78 mg/L.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | PCR <5 mg/L',
        interpretation: 'Leucocitosis neutrofílica y elevación de PCR compatibles con inflamación diverticular aguda.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Diverticulitis Aguda No Complicada de Colon Sigmoides (Hinchey Ia)',
      differentialDiagnoses: [
        'Colitis isquémica o infecciosa',
        'Carcinoma colorrectal perforado/inflamado',
        'Cólico nefrítico izquierdo / pielonefritis',
        'Obstrucción intestinal parcial',
      ],
      pathophysiology:
        'Microperforación de un pseudodivertículo colónico (frecuentemente en sigmoides por alta presión intraluminal y dieta baja en fibra) que desencadena inflamación pericólica localizada contenida por la grasa mesentérica.',
      keyClinicalClues: [
        'Dolor focalizado en fosa ilíaca izquierda + fiebre + leucocitosis en adulto >50 años',
        'TAC abdominal con engrosamiento sigmoideo y estriación grasa pericólica sin absceso ni aire libre',
        'Estabilidad hemodinámica y ausencia de irritación peritoneal difusa',
      ],
      characteristicSignsSymptoms: [
        'Dolor en fosa ilíaca izquierda',
        'Fiebre y leucocitosis',
        'Engrosamiento sigmoideo con estriación pericólica en TAC',
      ],
      criticalRulingOutFactors: [
        'TAC sin neumoperitoneo ni absceso >3-4 cm descarta perforación libre o diverticulitis complicada.',
      ],
      recommendedWorkup: ['TAC de abdomen/pelvis con contraste (estudio de elección), biometría hemática, PCR y EGO'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amoxicilina/Ácido Clavulánico (o Ciprofloxacino + Metronidazol en alérgicos)',
            dose: '875/125 mg (o Ciprofloxacino 500 mg + Metronidazol 500 mg)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas (Metronidazol cada 8 h)',
            duration: '7 días (en pacientes seleccionados con comorbilidad/fiebre/PCR elevada)',
            rationale: 'Cubre bacilos entéricos Gram negativos y anaerobios colónicos.',
          },
          {
            drug: 'Paracetamol',
            dose: '500 a 1000 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas',
            duration: '5 días',
            rationale: 'Analgesia segura evitando AINEs que aumentan riesgo de perforación diverticular.',
          },
        ],
        generalMeasures: [
          'Dieta líquida clara inicial durante 48 horas con progresión a dieta blanda baja en residuo hasta ceder el dolor agudo.',
          'Al resolverse el cuadro agudo (6-8 semanas después), programar colonoscopia de control si nunca se ha realizado para descartar neoplasia oculta.',
          'Signos de alarma estrictos: incremento del dolor, rigidez abdominal, vómitos o fiebre persistente.',
        ],
        hospitalizationDecision: 'Observación Urgencias',
        referralCriteria: ['Intolerancia a vía oral, fiebre >38.8°C persistente, absceso >3 cm, peritonitis o inmunosupresión (hospitalización y antibióticos IV).'],
        followUp: 'Revaloración clínica en 48-72 horas y colonoscopia diferida a las 6-8 semanas.',
      },
      criticalSafetyAlerts: [
        'NO realizar colonoscopia durante la fase aguda de diverticulitis por alto riesgo de perforación colónica.',
        'Evitar AINEs (ibuprofeno, ketorolaco, naproxeno) y opioides fuertes por incrementar riesgo de perforación diverticular.',
      ],
      guidelineReferences: [
        'WSES Guidelines for Management of Acute Left-Sided Colonic Diverticulitis',
        'AGA Clinical Practice Update on Medical Management of Colonic Diverticulitis',
      ],
    },
    internalPersonaPrompt:
      'Habla como Jorge, ingeniero de 58 años. Desde hace 2 días te duele fuerte abajo a la izquierda del abdomen y tienes fiebre; hace muchos años te quitaron el apéndice.',
  },
  {
    id: 'case-exp-com-fisura-anal',
    mode: 'principiante',
    specialty: 'cirugia_general',
    patientInfo: {
      name: 'Andrea Lizeth Ramírez',
      age: 28,
      sex: 'Femenino',
      occupation: 'Diseñadora textil',
      consultReason: 'Dolor anal cortante muy intenso al evacuar y manchas de sangre roja',
      evolutionTime: '10 días de evolución',
      currentIllness:
        'Paciente femenina de 28 años que acude por presentar desde hace diez días dolor anal agudo de tipo cortante ("como si pasara un vidrio") justo al iniciar cada evacuación, que permanece con ardor pulsátil durante una a dos horas después de ir al baño, acompañado de escasas rayas de sangre rojo brillante en el papel higiénico. Por temor al dolor ha aguantado las ganas de evacuar, endureciendo más las heces. Niega fiebre o bultos calientes supurativos.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 59,
      heightCm: 163,
    },
    background: {
      pathological: ['Episodio de estreñimiento intenso hace 2 semanas tras viaje largo con poca ingesta de agua.'],
      nonPathological: ['Dieta baja en fibra; niega hábitos tóxicos.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó paracetamol con alivio parcial.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-fisura-ano',
        system: 'Abdomen',
        name: 'Inspección perianal suave con separación de glúteos',
        finding:
          'Al separar suavemente los pliegues anales se observa desgarro lineal superficial agudo de bordes limpios y base roja en la línea media posterior (a las 6 en punto en posición ginecológica), con marcado espasmo reflejo del esfínter anal interno. Sin tumoraciones fluctuantes calientes, sin orificio fistuloso y sin hemorroides trombosadas. Se difiere tacto rectal instrumental por dolor agudo.',
        isAbnormal: true,
        semiologyNote:
          'Dolor urente/cortante desencadenado por la defecación + sangrado mínimo en el papel + desgarro en línea media posterior confirman fisura anal aguda.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-fisura-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática (si sangrado referido)',
        result: 'Hb 13.4 g/dL | Hto 40% | Leucocitos 6,500 /mm³ | Plaquetas 250,000 /mm³.',
        referenceRange: 'Hb 12-16 g/dL',
        interpretation: 'Sin anemia ni leucocitosis infecciosa.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Fisura Anal Aguda Posterior',
      differentialDiagnoses: [
        'Hemorroide externa trombosada (masa violácea tensa)',
        'Absceso perianal (masa fluctuante, fiebre y dolor continuo)',
        'Enfermedad hemorroidal interna (sangrado indoloro)',
        'Fisura atípica secundaria (Crohn, sífilis o VIH si ubicación lateral)',
      ],
      pathophysiology:
        'Desgarro lineal de la mucosa del anodermo distal (90% en línea media posterior por menor irrigación sanguínea) provocado por paso de heces duras; el dolor genera hipertonía refleja del esfínter anal interno que perpetúa la isquemia local.',
      keyClinicalClues: [
        'Dolor lacerante ("como vidrio") durante la defecación que persiste 1-2 h después',
        'Sangrado escaso rojo vivo al limpiarse con antecedente de heces duras',
        'Desgarro lineal visible en línea media posterior a las 6 horas sin masa fluctuante',
      ],
      characteristicSignsSymptoms: [
        'Dolor lacerante post-defecatorio',
        'Sangrado escaso rojo rutilante en papel',
        'Desgarro lineal en línea media posterior + hipertonía esfinteriana',
      ],
      criticalRulingOutFactors: [
        'Ausencia de masa caliente fluctuante y fiebre descarta absceso perianal.',
        'Ubicación en línea media posterior descarta fisura atípica lateral.',
      ],
      recommendedWorkup: ['Inspección perianal cuidadosa; evitar tacto rectal doloroso o anoscopia en fase aguda'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Diltiazem 2% gel tópico o Nitroglicerina 0.2-0.4% ungüento perianal',
            dose: 'Aplicación perianal/margen anal suave (tamaño de un guisante)',
            route: 'Tópica anal',
            frequency: 'Cada 12 horas',
            duration: '6 a 8 semanas',
            rationale: 'Relaja el espasmo del esfínter anal interno mejorando el flujo sanguíneo y la cicatrización del anodermo.',
          },
          {
            drug: 'Polietilenglicol 3350 o Psyllium plantago (ablandador fecal)',
            dose: 'PEG 17 g en 240 mL agua',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '4 a 6 semanas',
            rationale: 'Mantiene heces blandas para evitar nuevo trauma mecánico durante la cicatrización.',
          },
        ],
        generalMeasures: [
          'Baños de asiento con agua tibia durante 15 minutos, 2 a 3 veces al día y después de evacuar para relajar el esfínter.',
          'Dieta alta en fibra (25-30 g/día) y al menos 2 litros de agua diaria; higiene suave sin papel seco abrasivo.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Persistencia >8 semanas (fisura crónica con plicoma centinela), localización lateral o fiebre/supuración (valoración por Coloproctología).'],
        followUp: 'Control clínico en 3 a 4 semanas para verificar alivio del dolor y cicatrización.',
      },
      criticalSafetyAlerts: [
        'No forzar tacto rectal ni anoscopia en fisura anal aguda dolorosa sin anestesia/relajación.',
        'Evitar uso prolongado de corticoides tópicos anales que adelgazan el anodermo y retrasan la cicatrización.',
      ],
      guidelineReferences: [
        'ASCRS Clinical Practice Guidelines for the Management of Anal Fissures',
        'AGA Technical Review on Anorectal Disorders',
      ],
    },
    internalPersonaPrompt:
      'Habla como Andrea, de 28 años. Hace 10 días tuviste heces muy duras y desde entonces sientes como si te cortaran con un vidrio cada vez que evacuas, con manchitas rojas en el papel.',
  },
  {
    id: 'case-exp-com-epicondilitis',
    mode: 'principiante',
    specialty: 'traumatologia',
    patientInfo: {
      name: 'Gustavo Adolfo Reyes',
      age: 42,
      sex: 'Masculino',
      occupation: 'Carpintero y jugador recreativo de tenis',
      consultReason: 'Dolor en la parte externa del codo derecho al agarrar herramientas',
      evolutionTime: '5 semanas de evolución',
      currentIllness:
        'Paciente masculino de 42 años que consulta por dolor progresivo en la cara lateral del codo derecho desde hace cinco semanas, irradiado levemente por la parte externa del antebrazo. El dolor aparece al atornillar madera, levantar una taza de café o dar la mano con fuerza, y mejora con el reposo. Niega golpe directo, inflamación articular generalizada, fiebre o adormecimiento de dedos.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/78 mmHg',
      heartRate: 72,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 78,
      heightCm: 175,
    },
    background: {
      pathological: ['Sano previamente; sin antecedentes reumatológicos.'],
      nonPathological: ['Movimientos repetitivos de extensión y supinación de muñeca en carpintería y tenis los fines de semana.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Aplicó pomada mentolada de venta libre con alivio transitorio.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-epicon-osteo',
        system: 'Osteomuscular y Piel',
        name: 'Palpación de codo y maniobras de Cozen y Maudsley',
        finding:
          'Sin eritema, calor ni derrame articular en codo derecho. Dolor puntiforme intenso a la palpación 1 cm distal al epicóndilo lateral humeral. Maniobra de Cozen positiva (dolor agudo lateral al extender la muñeca contra resistencia con codo extendido) y prueba de Maudsley positiva (dolor al extender 3.er dedo contra resistencia). Flexoextensión pasiva y sensibilidad distal conservadas.',
        isAbnormal: true,
        semiologyNote:
          'Dolor en epicóndilo lateral reproducido por extensión resistida de muñeca (Cozen+) confirma epicondilitis lateral.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-epicon-rx',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía AP y lateral de codo derecho (para descartar lesión ósea)',
        result: 'Espacio articular humerorradial y humerocubital conservados, sin fracturas, cuerpos libres intraarticulares ni espolones óseos significativos.',
        referenceRange: 'Estructuras óseas sin lesiones agudas',
        interpretation: 'Radiografía normal; confirma origen tendinopático extraarticular.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Epicondilitis Lateral Derecha ("Codo de Tenista")',
      differentialDiagnoses: [
        'Atrapamiento del nervio interóseo posterior (síndrome del túnel radial)',
        'Artrosis humerorradial o lesión condral',
        'Radiculopatía cervical C6-C7',
        'Epitrocleítis medial ("codo de golfista")',
      ],
      pathophysiology:
        'Tendinosis degenerativa por microtraumatismos repetitivos de sobrecarga en el origen común de los músculos extensores de muñeca en el epicóndilo lateral (especialmente el extensor radial corto del carpo — ECRB).',
      keyClinicalClues: [
        'Dolor focal en cara lateral del codo al agarrar objetos o usar herramientas repetitivas',
        'Pruebas de Cozen y Maudsley positivas sin derrame articular ni eritema',
        'Sensibilidad distal normal y arcos de movilidad pasiva conservados',
      ],
      characteristicSignsSymptoms: [
        'Dolor puntual en epicóndilo lateral',
        'Prueba de Cozen positiva (extensión resistida de muñeca)',
        'Dolor al sujetar peso o estrechar la mano',
      ],
      criticalRulingOutFactors: [
        'Ausencia de déficit sensitivo o debilidad de extensión pura de dedos descarta atrapamiento del nervio interóseo posterior o radiculopatía cervical.',
      ],
      recommendedWorkup: ['Diagnóstico clínico mediante maniobras de Cozen y Maudsley; radiografía solo si antecedente traumático o duda clínica'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Diclofenaco gel 1% tópico (o Ibuprofeno 400 mg VO ciclo corto)',
            dose: 'Gel tópico en cara lateral de codo',
            route: 'Tópica cutánea',
            frequency: 'Cada 8 a 12 horas',
            duration: '10 a 14 días',
            rationale: 'Alivio sintomático inicial de bajo riesgo gastrointestinal mientras inicia rehabilitación excéntrica.',
          },
        ],
        generalMeasures: [
          'Reposo relativo modificando la técnica de agarre y evitando sobrecarga de extensión/pronosupinación.',
          'Fisioterapia activa con estiramientos de extensores y ejercicios excéntricos progresivos (pilar terapéutico a largo plazo).',
          'Uso temporal de codera de contrafuerza (cincha epicondílea) 3 cm distal al epicóndilo durante actividades laborales.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Dolor refractario tras 3-6 meses de fisioterapia formal o aparición de parestesias/debilidad neurológica (valorar Ortopedia).'],
        followUp: 'Revaloración en 4 semanas tras programa de ejercicios excéntricos.',
      },
      criticalSafetyAlerts: [
        'Evitar infiltraciones repetidas de corticoides en epicóndilo lateral: empeoran resultados a largo plazo y favorecen ruptura o atrofia tendinosa.',
      ],
      guidelineReferences: [
        'AAOS / JOSPT Clinical Practice Guidelines for Lateral Elbow Tendinopathy',
      ],
    },
    internalPersonaPrompt:
      'Habla como Gustavo, carpintero de 42 años. Te duele la parte de afuera del codo derecho desde hace 5 semanas cuando aprietas el desarmador, levantas peso o das la mano.',
  },
  {
    id: 'case-exp-com-manguito-rotador',
    mode: 'medico_general',
    specialty: 'traumatologia',
    patientInfo: {
      name: 'Lucía Fernanda Cárdenas',
      age: 49,
      sex: 'Femenino',
      occupation: 'Pintora de interiores',
      consultReason: 'Dolor en el hombro derecho que empeora al alzar el brazo y al dormir de lado',
      evolutionTime: '2 meses de evolución',
      currentIllness:
        'Paciente femenina de 49 años que acude por dolor sordo en cara anterolateral del hombro derecho irradiado hasta la parte media del brazo (deltoides) desde hace dos meses. Empeora claramente al pintar techos, peinarse o abrocharse el sostén y le despierta por la noche cuando se acuesta sobre ese hombro. Niega caída reciente, fiebre o pérdida de sensibilidad en los dedos.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '124/76 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 66,
      heightCm: 160,
    },
    background: {
      pathological: ['Sana previamente; niega diabetes o enfermedades reumáticas.'],
      nonPathological: ['Trabaja elevando ambos brazos por encima de la cabeza varias horas al día.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó naproxeno ocasional con alivio leve nocturno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-manguito-osteo',
        system: 'Osteomuscular y Piel',
        name: 'Exploración de hombro derecho (Neer, Hawkins-Kennedy y Jobe)',
        finding:
          'Arco doloroso positivo en abducción activa entre 60° y 120°. Maniobras de pinzamiento subacromial de Neer y Hawkins-Kennedy positivas; prueba de Jobe (lata vacía) dolorosa con leve debilidad antálgica pero elevación activa completa conservada. Movilidad pasiva completa (descarta capsulitis adhesiva).',
        isAbnormal: true,
        semiologyNote:
          'Arco doloroso 60°-120° + Neer/Hawkins positivos + movilidad pasiva completa confirman tendinopatía del manguito rotador (supraespinoso).',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-manguito-us',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido musculoesquelético de hombro derecho',
        result: 'Engrosamiento hipoecoico heterogéneo del tendón supraespinoso y bursitis subacromio-subdeltoidea leve; sin ruptura de espesor completo ni calcificaciones grandes.',
        referenceRange: 'Tendón supraespinoso fibrilar homogéneo sin líquido bursal',
        interpretation: 'Confirma tendinopatía del supraespinoso y bursitis subacromial sin desgarro completo.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Tendinopatía del Manguito Rotador (Síndrome de Pinzamiento Subacromial)',
      differentialDiagnoses: [
        'Capsulitis adhesiva ("hombro congelado": limita movilidad pasiva)',
        'Ruptura completa de manguito rotador (incapacidad para abducir/sostener brazo)',
        'Radiculopatía cervical C5',
        'Artrosis acromioclavicular o glenohumeral',
      ],
      pathophysiology:
        'Sobrecarga mecánica repetitiva del tendón del supraespinoso contra el arco coracoacromial al elevar el brazo por encima de 90°, produciendo tendinosis degenerativa e inflamación de la bursa subacromial.',
      keyClinicalClues: [
        'Dolor anterolateral del hombro al elevar el brazo (>90°) y dolor nocturno en decúbito lateral',
        'Arco doloroso 60°-120°, signos de Neer, Hawkins-Kennedy y Jobe positivos',
        'Movilidad pasiva íntegra (excluye hombro congelado)',
      ],
      characteristicSignsSymptoms: [
        'Dolor nocturno al recostarse sobre el hombro',
        'Arco doloroso entre 60° y 120°',
        'Pruebas de Neer y Hawkins positivas con movilidad pasiva preservada',
      ],
      criticalRulingOutFactors: [
        'Movilidad pasiva conservada descarta capsulitis adhesiva; ausencia de drop-arm o hueco tendinoso en ecografía descarta ruptura total.',
      ],
      recommendedWorkup: ['Diagnóstico clínico; radiografía/ultrasonido si evolución >6 semanas o sospecha de desgarro'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Naproxeno (o Celecoxib si riesgo gástrico)',
            dose: '500 mg (o 250-500 mg) con protector gástrico si requiere',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas con alimentos',
            duration: '7 a 10 días (ciclo corto)',
            rationale: 'Reduce dolor inflamatorio agudo bursal facilitando el inicio temprano de fisioterapia.',
          },
        ],
        generalMeasures: [
          'Fisioterapia supervisada de fortalecimiento escapular y manguito rotador (ejercicios pendulares de Codman + rotadores externos con banda).',
          'Evitar trabajo sostenido por encima del nivel del hombro y aplicación de hielo local 15 min tras jornada laboral.',
          'No inmovilizar el hombro con cabestrillo (favorece rigidez/capsulitis secundaria).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Debilidad súbita incapaz de elevar el brazo o falta de mejoría tras 8-12 semanas de fisioterapia (RMN y Ortopedia).'],
        followUp: 'Revaloración funcional en 4 a 6 semanas.',
      },
      criticalSafetyAlerts: [
        'NO indicar inmovilización prolongada con cabestrillo en tendinopatía subacromial porque favorece capsulitis adhesiva secundaria.',
      ],
      guidelineReferences: [
        'AAOS Appropriate Use Criteria: Management of Rotator Cuff Pathology',
      ],
    },
    internalPersonaPrompt:
      'Habla como Lucía, pintora de 49 años. Te duele el hombro derecho desde hace 2 meses al alzar la brocha arriba de la cabeza y te despierta cuando te acuestas de ese lado.',
  },
  {
    id: 'case-exp-com-gonartrosis',
    mode: 'principiante',
    specialty: 'reumatologia',
    patientInfo: {
      name: 'Carmen Elisa Aguilar',
      age: 64,
      sex: 'Femenino',
      occupation: 'Ama de casa',
      consultReason: 'Dolor en ambas rodillas al caminar y subir escaleras que truena',
      evolutionTime: '2 años de evolución progresiva',
      currentIllness:
        'Paciente femenina de 64 años que acude porque desde hace dos años presenta dolor mecánico progresivo en ambas rodillas (predominio derecho) que aparece al levantarse de la silla, caminar varias cuadras o bajar escaleras, y mejora con el reposo. Refiere rigidez matutina breve que dura menos de 15 minutos y sensación de chasquido o crujido al doblarlas. Niega fiebre, enrojecimiento o hinchazón caliente súbita.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 99,
      weightKg: 82,
      heightCm: 157,
    },
    background: {
      pathological: ['Obesidad grado I (IMC 33.2 kg/m²); hipertensión arterial leve controlada con enalapril.'],
      nonPathological: ['Sedentaria por el dolor articular.'],
      family: ['Padre hipertenso en control; madre sin patologías crónicas referidas.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Enalapril 10 mg cada 24 h; toma ibuprofeno casi diario por su cuenta desde hace un mes.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-gonartrosis-osteo',
        system: 'Osteomuscular y Piel',
        name: 'Exploración articular de ambas rodillas',
        finding:
          'Ensanchamiento óseo articular bilateral sin eritema ni aumento de temperatura local. Crepitación gruesa palpable a la flexoextensión activa de ambas rodillas, sensibilidad leve en interlínea articular medial derecha y leve derrame frío no a tensión. Ligamentos colaterales y cruzados estables; presencia de nódulos de Heberden en interfalángicas distales de manos.',
        isAbnormal: true,
        semiologyNote:
          'Dolor mecánico + rigidez matutina <30 min + crepitación ósea y agrandamiento articular en >50 años cumplen criterios ACR de gonartrosis.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-gonartrosis-rx',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografías AP en carga y lateral de ambas rodillas',
        result: 'Disminución asimétrica del espacio articular del compartimiento femorotibial medial bilateral, osteofitos marginales, esclerosis subcondral y quistes subcondrales leves (Kellgren-Lawrence grado III derecho).',
        referenceRange: 'Espacio articular simétrico sin osteofitos ni esclerosis',
        interpretation: 'Hallazgos radiográficos clásicos de osteoartritis femorotibial bilateral.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Osteoartritis de Rodilla (Gonartrosis Bilateral Sintomática)',
      differentialDiagnoses: [
        'Artritis reumatoide (rigidez matutina >60 min, poliartritis simétrica inflamatoria)',
        'Artritis por cristales (gota o pseudogota aguda)',
        'Lesión meniscal degenerativa aislada o artritis séptica',
      ],
      pathophysiology:
        'Degeneración mecánica y bioquímica progresiva del cartílago articular hialino asociada a sobrecarga ponderal y remodelación ósea subcondral reactiva (esclerosis y osteofitos) con sinovitis leve secundaria.',
      keyClinicalClues: [
        'Dolor mecánico que empeora con carga/escaleras y cede en reposo en mujer de 64 años',
        'Rigidez matutina breve (<15-30 min) y crepitación articular bilateral',
        'Radiografía en carga con pinzamiento asimétrico medial, osteofitos y esclerosis subcondral',
      ],
      characteristicSignsSymptoms: [
        'Dolor mecánico de rodillas con la marcha',
        'Crepitación palpable y rigidez breve (<30 min)',
        'Pinzamiento asimétrico + osteofitos en radiografía',
      ],
      criticalRulingOutFactors: [
        'Rigidez <30 min y ausencia de calor/eritema descartan artritis inflamatoria activa o séptica.',
      ],
      recommendedWorkup: ['Diagnóstico clínico y confirmación con radiografía simple en bipedestación (en carga)'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Diclofenaco gel 1% tópico (1.ª línea farmacológica en rodilla) o Paracetamol PRN',
            dose: 'Aplicar 2-4 g en cada rodilla',
            route: 'Tópica articular',
            frequency: 'Cada 8 horas',
            duration: 'Uso sintomático seguro evitando AINEs orales crónicos',
            rationale: 'Eficacia similar a AINEs orales en gonartrosis con mínima exposición sistémica renal y gástrica (crucial en paciente que toma IECA).',
          },
        ],
        generalMeasures: [
          'Reducción de peso corporal (bajar 5-10% del peso reduce significativamente la carga y el dolor articular).',
          'Ejercicio terapéutico de bajo impacto y fortalecimiento de cuádriceps (natación, bicicleta estática, ejercicios isométricos).',
          'Suspender automedicación diaria con ibuprofeno oral (riesgo renal combinado con enalapril y riesgo gástrico).',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Dolor incapacitante refractario a medidas conservadoras y pérdida funcional severa (valorar artroplastia por Ortopedia).'],
        followUp: 'Control en 6 a 8 semanas para revisar descenso ponderal, adherencia a ejercicios y retiro de AINE oral.',
      },
      criticalSafetyAlerts: [
        'Suspender AINEs orales diarios en adultos mayores o pacientes que toman IECA (enalapril) por riesgo de lesión renal aguda y sangrado digestivo.',
      ],
      guidelineReferences: [
        'OARSI / ACR Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee',
      ],
    },
    internalPersonaPrompt:
      'Habla como Carmen, de 64 años. Desde hace 2 años te duelen las dos rodillas al caminar y bajar escaleras, te truenan y en la mañana sientes un poco tiesas las piernas unos 10 minutos; tomas ibuprofeno diario.',
  },
];
