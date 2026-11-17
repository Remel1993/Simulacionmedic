import { ClinicalCase } from '../types/clinical';

/**
 * Expansión curada de 12 casos clínicos en 6 nuevas especialidades/áreas médicas
 * (Oftalmología, Otorrinolaringología, Urología, Hematología, Reumatología y Toxicología Clínica)
 * para completar una biblioteca offline de 100 casos curados.
 */
export const SPECIALTY_EXPANSION_CASES: ClinicalCase[] = [
  // =========================================================================
  // 1. OFTALMOLOGÍA (2 casos)
  // =========================================================================
  {
    id: 'case-oftalmo-queratitis-herpetica',
    mode: 'principiante',
    specialty: 'oftalmologia',
    patientInfo: {
      name: 'Diego Alejandro Salgado',
      age: 34,
      sex: 'Masculino',
      occupation: 'Diseñador gráfico',
      consultReason: 'Ojo izquierdo rojo, lloroso y muy molesto con la luz',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente masculino de 34 años que consulta porque desde hace dos días siente el ojo izquierdo rojo, con lagrimeo constante, sensación de tener una basurita adentro y molestia intensa al mirar luces o pantallas. Refiere que ve ligeramente borroso con ese ojo. Hace una semana tuvo un fueguito (ampollita dolorosa) en el labio superior tras varios días de desvelo laboral. Niega trauma ocular, uso de lentes de contacto o secreción amarilla espesa.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.7,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 74,
      heightCm: 175,
    },
    background: {
      pathological: ['Episodios ocasionales de lesiones labiales por estrés; niega enfermedades oculares crónicas.'],
      nonPathological: ['Trabaja frente a computadora; no fuma.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Aplicó gotas refrescantes de venta libre sin mejoría.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-oft-queratitis-ojo',
        system: 'Cabeza y Cuello',
        name: 'Inspección ocular, reflejos pupilares y tinción con fluoresceína',
        finding:
          'Ojo izquierdo con hiperemia conjuntival periquerática (inyección ciliar), lagrimeo acuoso sin secreción purulenta. Pupilas isocóricas normorreactivas (3 mm). A la tinción con fluoresceína bajo luz azul cobalto se observa lesión epitelial lineal ramificada con bulbos terminales y disminución del reflejo y sensibilidad corneal ipsilateral.',
        isAbnormal: true,
        semiologyNote:
          'Úlcera dendrítica teñida con fluoresceína + hipoestesia corneal e inyección ciliar es patognomónica de queratitis epitelial por VHS.',
      },
      {
        id: 'pe-oft-queratitis-general',
        system: 'General',
        name: 'Inspección general y piel facial',
        finding:
          'Paciente orientado y tranquilo, con ligera fotofobia al explorar el ojo izquierdo. Costra pequeña residual en borde bermellón de labio superior. Resto de piel facial sin vesículas en punta nasal.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-oft-fluoresceina',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Lámpara de hendidura y tinción corneal con fluoresceína',
        result:
          'Defecto epitelial lineal ramificado en forma de árbol con bulbos terminales en córnea central-paracentral izquierda que capta intensamente fluoresceína; cámara anterior formada sin hipopión.',
        referenceRange: 'Córnea avascular transparente sin captación de fluoresceína',
        interpretation: 'Patrón dendrítico característico de infección epitelial activa por Virus Herpes Simple (VHS-1).',
        isAbnormal: true,
      },
      {
        id: 'std-oft-agudeza',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Agudeza visual (cartilla de Snellen) y tonometría digital',
        result:
          'Ojo derecho: 20/20. Ojo izquierdo: 20/40 (mejora parcialmente con agujero estenopeico). Globo ocular blando y simétrico a la palpación suave comparativa.',
        referenceRange: 'Agudeza visual 20/20',
        interpretation: 'Baja visual moderada secundaria a defecto epitelial corneal central sin hipertensión ocular.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Queratitis Herpética Epitelial (Úlcera Dendrítica por VHS)',
      differentialDiagnoses: [
        'Abrasión corneal traumática',
        'Queratitis bacteriana o por Acanthamoeba',
        'Conjuntivitis viral aguda',
        'Uveítis anterior aguda',
      ],
      pathophysiology:
        'Reactivación del Virus Herpes Simple tipo 1 (VHS-1) latente en el ganglio trigeminal que desciende por la rama oftálmica e infecta directamente las células epiteliales corneales, generando lisis celular en patrón ramificado (dendrita) e hipoestesia corneal.',
      keyClinicalClues: [
        'Ojo rojo doloroso con inyección ciliar, fotofobia y baja de agudeza visual',
        'Tinción con fluoresceína con imagen dendrítica con bulbos terminales + hipoestesia corneal',
        'Antecedente reciente de lesión herpética labial y ausencia de secreción purulenta',
      ],
      characteristicSignsSymptoms: [
        'Fotofobia e inyección periquerática',
        'Úlcera corneal dendrítica con fluoresceína',
        'Disminución del reflejo/sensibilidad corneal',
      ],
      criticalRulingOutFactors: [
        'Ausencia de secreción purulenta o infiltrado estromal blanco denso que sugeriría queratitis bacteriana.',
        'Globo ocular blando y pupila normorreactiva descartan glaucoma agudo de ángulo cerrado.',
      ],
      recommendedWorkup: [
        'Evaluación con lámpara de hendidura y tinción de fluoresceína',
        'Medición de agudeza visual antes de cualquier gota',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Aciclovir ungüento oftálmico 3% (o Aciclovir / Valaciclovir vía oral)',
            dose: 'Aplicación 1 cm en saco conjuntival inferior (o Aciclovir 400 mg VO)',
            route: 'Oftálmica tópica (o Vía Oral)',
            frequency: '5 veces al día',
            duration: '10 a 14 días',
            rationale: 'Inhibe selectivamente la ADN polimerasa del VHS deteniendo la replicación epitelial corneal.',
          },
          {
            drug: 'Lágrimas artificiales sin conservantes',
            dose: '1 gota en ojo izquierdo',
            route: 'Oftálmica tópica',
            frequency: 'Cada 4 horas',
            duration: '14 días',
            rationale: 'Favorece la reepitelización corneal y alivia la sensación de cuerpo extraño.',
          },
        ],
        generalMeasures: [
          'Prohibir estrictamente cualquier colirio con corticoides mientras exista defecto epitelial.',
          'Uso de lentes oscuros si fotofobia intensa; no frotarse el ojo y lavado estricto de manos.',
          'Valoración por Oftalmología en 48 a 72 horas para vigilar cierre epitelial.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Empeoramiento del dolor, caída progresiva de visión o aparición de mancha blanca corneal (hipopión/úlcera geográfica).',
        ],
        followUp: 'Control oftalmológico en 48-72 horas hasta resolución completa de la dendrita.',
      },
      criticalSafetyAlerts: [
        'NUNCA prescribir corticoides tópicos (dexametasona, prednisolona, betametasona oftálmica) en queratitis herpética epitelial: suprimen la respuesta inmune local, transforman la dendrita en úlcera geográfica extensa y pueden provocar perforación corneal.',
      ],
      guidelineReferences: [
        'AAO Preferred Practice Pattern: Herpes Simplex Virus Keratitis',
        'Wills Eye Manual — Infectious Keratitis Guidelines',
      ],
    },
    internalPersonaPrompt:
      'Habla como Diego, 34 años, diseñador gráfico. Tienes el ojo izquierdo rojo, te lagrimea mucho, te molesta la luz y sientes como basurita adentro; hace unos días te salió un fueguito en el labio. No uses palabras médicas como queratitis o dendrítica.',
  },
  {
    id: 'case-oftalmo-glaucoma-agudo',
    mode: 'urgencias',
    specialty: 'oftalmologia',
    patientInfo: {
      name: 'Esperanza Morales viuda de Castro',
      age: 67,
      sex: 'Femenino',
      occupation: 'Comerciante jubilada',
      consultReason: 'Dolor muy fuerte en el ojo derecho, dolor de cabeza y náuseas',
      evolutionTime: '4 horas de evolución',
      currentIllness:
        'Paciente femenina de 67 años que acude acompañada porque hace 4 horas, estando en una sala de cine oscura, inició de golpe con dolor punzante e insoportable en el ojo derecho irradiado a la frente y sien del mismo lado, visión muy nublada con halos de colores alrededor de los focos, náuseas intensas y dos vómitos de contenido alimentario. Refiere sentir el ojo derecho duro y palpitante.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '164/94 mmHg',
      heartRate: 102,
      respiratoryRate: 20,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 110,
      weightKg: 66,
      heightCm: 158,
    },
    background: {
      pathological: ['Hipermetropía desde joven (usa lentes gruesos para leer); hipertensión arterial leve.'],
      nonPathological: ['Niega tabaquismo o alcoholismo.'],
      family: ['Padre hipertenso en control; madre sana.'],
      surgical: ['Niega cirugías oculares.'],
      currentMedications: ['Losartán 50 mg cada 24 h; tomó un antigripal con clorfeniramina esta tarde.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-oft-glaucoma-ojo',
        system: 'Cabeza y Cuello',
        name: 'Exploración ocular, pupilas, cámara anterior y tonometría digital',
        finding:
          'Ojo derecho con hiperemia conjuntival difusa e inyección ciliar intensa, córnea opaca (aspecto de vidrio esmerilado por edema corneal), cámara anterior muy estrecha y pupila en midriasis media fija (6 mm) que NO responde a la luz. A la palpación digital suave sobre el párpado cerrado, el globo ocular derecho presenta consistencia pétrea (muy dura) comparado con el ojo izquierdo.',
        isAbnormal: true,
        semiologyNote:
          'Tríada clásica de glaucoma agudo de ángulo cerrado: ojo rojo doloroso + pupila en midriasis media arreactiva + globo ocular pétreo.',
      },
      {
        id: 'pe-oft-glaucoma-neuro',
        system: 'Neurológico',
        name: 'Estado de conciencia, pares craneales y signos meníngeos',
        finding:
          'Glasgow 15/15, muy adolorida y nauseosa. Sin rigidez de nuca, sin déficit motor ni sensitivo en extremidades. Campos visuales derechos gravemente disminuidos por edema corneal.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-oft-pio',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Tonometría ocular (presión intraocular) y lámpara de hendidura',
        result:
          'Presión intraocular (PIO) ojo derecho: 58 mmHg | Ojo izquierdo: 16 mmHg. Edema epitelial corneal difuso, ángulo iridocorneal cerrado en 360° (gonioscopia) y cámara anterior plana.',
        referenceRange: 'PIO normal 10-21 mmHg',
        interpretation: 'Hipertensión ocular crítica aguda por bloqueo pupilar en cámara anterior estrecha.',
        isAbnormal: true,
      },
      {
        id: 'std-oft-tac-craneo',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Tomografía Axial Computarizada (TAC) de Cráneo Simple',
        result: 'Sin hemorragia intracraneal, sin lesiones ocupativas ni edema cerebral difuso.',
        referenceRange: 'Parénquima cerebral sin alteraciones agudas',
        interpretation: 'Descarta causa neurológica central (hemorragia subaracnoidea / evento vascular) de cefalea y vómitos.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Glaucoma Agudo de Ángulo Cerrado',
      differentialDiagnoses: [
        'Migraña aguda con síntomas autonómicos',
        'Hemorragia subaracnoidea o arteritis temporal',
        'Uveítis anterior aguda',
        'Conjuntivitis aguda',
      ],
      pathophysiology:
        'En ojos hipermétropes con cámara anterior estrecha, la midriasis (oscuridad, cine o fármacos anticolinérgicos como antigripales) desencadena bloqueo pupilar: el iris obstruye la malla trabecular impidiendo el drenaje del humor acuoso, elevando bruscamente la presión intraocular (>45-60 mmHg) con isquemia rápida del nervio óptico.',
      keyClinicalClues: [
        'Inicio súbito en sala oscura tras tomar antigripal en mujer mayor hipermétrope',
        'Dolor ocular severo con cefalea frontal, halos de colores y vómitos',
        'Pupila en midriasis media fija, edema corneal y ojo pétreo con PIO >50 mmHg',
      ],
      characteristicSignsSymptoms: [
        'Pupila fija en midriasis media',
        'Edema corneal con visión de halos',
        'Ojo duro pétreo al tacto y náuseas/vómitos',
      ],
      criticalRulingOutFactors: [
        'En uveítis suele haber miosis; en conjuntivitis no hay baja visual marcada, edema corneal ni ojo pétreo.',
        'La exploración pupilar y tonometría evitan diagnosticar erróneamente como migraña o gastritis.',
      ],
      recommendedWorkup: [
        'Medición urgente de presión intraocular (tonometría) y lámpara de hendidura',
        'Interconsulta inmediata a Oftalmología para iridotomía láser periférica',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Acetazolamida',
            dose: '500 mg',
            route: 'Intravenosa (IV) o Vía Oral',
            frequency: 'Dosis de carga STAT seguida de 250 mg cada 6 horas',
            duration: 'Hasta resolución con iridotomía',
            rationale: 'Inhibidor de anhidrasa carbónica que reduce de inmediato la producción de humor acuoso.',
          },
          {
            drug: 'Timolol 0.5% solución oftálmica',
            dose: '1 gota en ojo derecho',
            route: 'Oftálmica tópica',
            frequency: 'Cada 12 horas (primera dosis STAT)',
            duration: 'Hasta control de presión e iridotomía',
            rationale: 'Betabloqueador tópico que disminuye la producción de humor acuoso (verificar ausencia de asma/bradicardia).',
          },
          {
            drug: 'Pilocarpina 2% solución oftálmica',
            dose: '1 gota en ojo derecho',
            route: 'Oftálmica tópica',
            frequency: 'Cada 15 minutos x 2-3 dosis tras descenso inicial de PIO, luego cada 6 h',
            duration: 'Hasta iridotomía láser',
            rationale: 'Miótico colinérgico que retrae el iris periférico abriendo el ángulo iridocorneal una vez cede la isquemia del esfínter.',
          },
          {
            drug: 'Manitol 20% (si PIO refractaria >50 mmHg)',
            dose: '1 a 1.5 g/kg en infusión IV en 30-45 min',
            route: 'Intravenosa (IV)',
            frequency: 'Dosis única de rescate osmótico',
            duration: 'Fase aguda',
            rationale: 'Agente hiperosmótico que deshidrata el vítreo disminuyendo rápidamente la presión intraocular.',
          },
        ],
        generalMeasures: [
          'Mantener paciente en decúbito supino para favorecer desplazamiento posterior del cristalino.',
          'Control analgésico y antiemético IV (Ondansetrón) mientras hace efecto la terapia hipotensora ocular.',
          'Programar iridotomía periférica con láser YAG bilateral (terapéutica y profiláctica en ojo contralateral) de urgencia.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Valoración oftalmológica urgente inmediata para iridotomía láser antes de las 4-6 horas para evitar ceguera permanente.',
        ],
        followUp: 'Control de presión intraocular cada hora hasta normalizar (<21 mmHg) e iridotomía láser urgente.',
      },
      criticalSafetyAlerts: [
        'CONTRAINDICADO administrar midriáticos o anticolinérgicos (Atropina, Tropicamida, Butilhioscina) en glaucoma de ángulo cerrado: empeoran el bloqueo pupilar y aceleran la pérdida visual irreversible.',
        'Retrasar el tratamiento hipotensor ocular pensando en migraña o gastritis provoca atrofia óptica y ceguera permanente.',
      ],
      guidelineReferences: [
        'AAO Preferred Practice Pattern: Primary Angle-Closure Disease',
        'European Glaucoma Society (EGS) Guidelines — Acute Angle-Closure Crisis',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Esperanza, señora de 67 años. Estabas en el cine cuando de repente te empezó un dolor insoportable en el ojo derecho que se te va a la frente, ves arcoíris alrededor de las luces y te dan ganas de vomitar. Habla con palabras sencillas.',
  },

  // =========================================================================
  // 2. OTORRINOLARINGOLOGÍA (2 casos)
  // =========================================================================
  {
    id: 'case-orl-absceso-periamigdalino',
    mode: 'medico_general',
    specialty: 'otorrinolaringologia',
    patientInfo: {
      name: 'Kevin Mauricio Barahona',
      age: 25,
      sex: 'Masculino',
      occupation: 'Repartidor en motocicleta',
      consultReason: 'Dolor muy intenso en un lado de la garganta y dificultad para abrir la boca',
      evolutionTime: '4 días de evolución',
      currentIllness:
        'Paciente masculino de 25 años que consulta por cuadro de 4 días iniciado con dolor de garganta y fiebre que no mejoró tras tomar dos días de pastillas sueltas. Desde ayer el dolor se concentró fuertemente en el lado izquierdo de la garganta corriéndose hacia el oído izquierdo; hoy apenas puede abrir la boca para hablar o tragar, babea un poco porque tragar saliva le duele demasiado y su voz suena gangosa o apagada.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '124/78 mmHg',
      heartRate: 108,
      respiratoryRate: 20,
      temperature: 38.7,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 98,
      weightKg: 76,
      heightCm: 174,
    },
    background: {
      pathological: ['Amigdalitis de repetición durante la adolescencia; caries dentales no tratadas.'],
      nonPathological: ['Fuma 6 cigarrillos al día.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó ibuprofeno 400 mg hace 4 horas y dos dosis aisladas de azitromicina sin receta.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-orl-absceso-faringe',
        system: 'Cabeza y Cuello',
        name: 'Exploración de cavidad oral, orofaringe y apertura bucal',
        finding:
          'Trismo moderado (apertura bucal limitada a ~2 cm por espasmo pterigoideo). Halitosis marcada y sialorrea leve. Voz gutural ("en papa caliente"). Abombamiento eritematoso fluctuante del pilar amigdalino anterior y paladar blando izquierdos, con desplazamiento medial de la amígdala izquierda y desviación franca de la úvula hacia el lado derecho.',
        isAbnormal: true,
        semiologyNote:
          'Trismo + voz en papa caliente + abombamiento del pilar anterior con úvula desviada al lado sano es diagnóstico clínico de absceso periamigdalino.',
      },
      {
        id: 'pe-orl-absceso-cuello',
        system: 'Cabeza y Cuello',
        name: 'Palpación cervical y vía aérea',
        finding:
          'Adenopatías submandibulares y yugulodigástricas izquierdas de 2 cm muy dolorosas a la palpación. Sin estridor laríngeo ni tiraje supraclavicular. Piso de la boca blando y depresible, sin induración submentoniana.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-orl-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa y PCR',
        result: 'Leucocitos: 16,800 /mm³ (Neutrófilos 84% con desviación a la izquierda) | Hb: 14.5 g/dL | Plaquetas: 290,000 /mm³ | PCR: 118 mg/L.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | PCR < 5 mg/L',
        interpretation: 'Leucocitosis neutrofílica y PCR francamente elevada compatibles con colección supurativa aguda.',
        isAbnormal: true,
      },
      {
        id: 'img-orl-tac-cuello',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'TAC de cuello contrastada (si duda o extensión profunda)',
        result:
          'Colección hipodensa bien definida de 2.8 x 2.1 cm con realce periférico en anillo en espacio periamigdalino izquierdo, desplazando la úvula hacia la derecha; sin extensión al espacio retrofaríngeo ni mediastino.',
        referenceRange: 'Espacios profundos del cuello sin colecciones',
        interpretation: 'Confirma absceso periamigdalino izquierdo circunscrito apto para drenaje inmediato.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Absceso Periamigdalino Izquierdo',
      differentialDiagnoses: [
        'Faringoamigdalitis aguda no complicada',
        'Celulitis o flemón periamigdalino sin colección',
        'Mononucleosis infecciosa',
        'Absceso parafaríngeo o retrofaríngeo',
      ],
      pathophysiology:
        'Infección polimicrobiana (Streptococcus pyogenes, S. anginosus y anaerobios orales como Fusobacterium) que progresa desde una amigdalitis aguda hacia el espacio entre la cápsula amigdalina y el músculo constrictor superior de la faringe formando pus y espasmo pterigoideo (trismo).',
      keyClinicalClues: [
        'Odinofagia unilateral severa con otalgia refleja tras faringitis mal tratada',
        'Trismo, sialorrea y voz gutural ("en papa caliente")',
        'Asimetría de paladar blando con abombamiento izquierdo y úvula desviada al lado contralateral',
      ],
      characteristicSignsSymptoms: [
        'Trismo y voz apagada gutural',
        'Desviación de la úvula hacia el lado sano',
        'Abombamiento unilateral del pilar amigdalino',
      ],
      criticalRulingOutFactors: [
        'La presencia de trismo, asimetría marcada del paladar blando y desviación de la úvula distingue el absceso de una amigdalitis simple.',
        'Piso de boca blando y ausencia de rigidez cervical profunda descartan angina de Ludwig y absceso retrofaríngeo.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico; punción-aspiración o incisión y drenaje por ORL',
        'Biometría hemática y TAC de cuello si sospecha de extensión a espacios profundos',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amoxicilina / Ácido Clavulánico IV (o Clindamicina + Ceftriaxona IV)',
            dose: '1.2 g (o Clindamicina 600 mg IV)',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas (luego completar vía oral al tolerar)',
            duration: '10 a 14 días totales',
            rationale: 'Cobertura bactericida contra estreptococos, S. aureus y anaerobios productores de betalactamasas.',
          },
          {
            drug: 'Dexametasona',
            dose: '8 a 10 mg',
            route: 'Intravenosa (IV)',
            frequency: 'Dosis única inicial',
            duration: '1 día (dosis única)',
            rationale: 'Reduce rápidamente el edema faríngeo, el trismo y el dolor favoreciendo la tolerancia oral.',
          },
          {
            drug: 'Paracetamol / Ketorolaco IV',
            dose: 'Paracetamol 1 g IV',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas según dolor o fiebre',
            duration: '3 a 5 días',
            rationale: 'Analgesia y control térmico mientras drena la colección.',
          },
        ],
        generalMeasures: [
          'Drenaje quirúrgico urgente (punción aspirativa o incisión y drenaje por ORL bajo anestesia local).',
          'Hidratación parenteral inicial hasta recuperar deglución segura.',
          'Vigilancia estricta de permeabilidad de vía aérea.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Valoración urgente por Otorrinolaringología para drenaje; traslado inmediato si aparece estridor, disnea o extensión cervical.',
        ],
        followUp: 'Control en 48 horas por ORL tras drenaje para verificar resolución del trismo y completar antibiótico oral 10 días.',
      },
      criticalSafetyAlerts: [
        'Tratar un absceso periamigdalino únicamente con antibiótico ambulatorio sin drenaje ni valoración de vía aérea conlleva riesgo de rotura espontánea con broncoaspiración o extensión a mediastinitis necrotizante.',
      ],
      guidelineReferences: [
        'AAO-HNS / NICE Clinical Knowledge Summary: Peritonsillar Abscess (Quinsy)',
        'IDSA Pharyngitis & Deep Neck Infection Management Guidelines',
      ],
    },
    internalPersonaPrompt:
      'Habla como Kevin, 25 años, repartidor. Te duele muchísimo solo el lado izquierdo de la garganta hasta el oído, casi no puedes abrir la boca, hablas medio atragantado y te cuesta pasar hasta la saliva. Usa palabras normales.',
  },
  {
    id: 'case-orl-epistaxis-anterior',
    mode: 'principiante',
    specialty: 'otorrinolaringologia',
    patientInfo: {
      name: 'Martha Lucía Estrada',
      age: 54,
      sex: 'Femenino',
      occupation: 'Costurera',
      consultReason: 'Sangrado por la fosa nasal derecha que no se detiene',
      evolutionTime: '45 minutos de evolución',
      currentIllness:
        'Paciente femenina de 54 años que acude con un pañuelo en la nariz porque hace 45 minutos empezó a sangrar por la fosa nasal derecha tras sonarse fuerte por alergia nasal. El sangrado gotea hacia afuera de forma continua cuando retira el pañuelo; niega tragar coágulos grandes por la garganta, mareo al ponerse de pie o sangrado de encías. Se había echado la cabeza hacia atrás en casa y notó que tragaba un poco de sangre.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '146/88 mmHg',
      heartRate: 88,
      respiratoryRate: 18,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 102,
      weightKg: 68,
      heightCm: 160,
    },
    background: {
      pathological: ['Hipertensión arterial leve controlada y rinitis alérgica estacional.'],
      nonPathological: ['No fuma ni toma alcohol.'],
      family: ['Padre hipertenso.'],
      surgical: ['Niega cirugías nasales previas.'],
      currentMedications: ['Enalapril 10 mg cada 24 h; niega tomar aspirina o anticoagulantes.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-orl-epistaxis-rinoscopia',
        system: 'Cabeza y Cuello',
        name: 'Rinoscopia anterior y exploración de orofaringe',
        finding:
          'Al retirar coágulos suaves de fosa nasal derecha se observa punto sangrante arterial/capilar superficial bien delimitado en la porción anteroinferior del tabique nasal (área vascular septal anterior). Fosa nasal izquierda permeable sin sangrado. Orofaringe limpia sin escurrimiento hemático activo en pared posterior.',
        isAbnormal: true,
        semiologyNote:
          'Sangrado visible en tabique anterior (plexo de Kiesselbach) sin caída hemática en faringe posterior confirma epistaxis anterior (90% de los casos).',
      },
      {
        id: 'pe-orl-epistaxis-cardio',
        system: 'Cardiovascular',
        name: 'Pulsos periféricos y perfusión distal',
        finding:
          'Pulsos radiales amplios y regulares, llenado capilar <2 segundos, mucosas húmedas y normocoloreadas sin datos de hipovolemia.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-orl-epistaxis-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y Tiempos de Coagulación (TP / TTPa)',
        result: 'Hb: 13.1 g/dL | Hto: 39.2% | Plaquetas: 245,000 /mm³ | TP: 11.8 seg (INR 1.0) | TTPa: 29 seg.',
        referenceRange: 'Hb 12-16 g/dL | INR 0.8-1.2 | Plaquetas 150,000-450,000 /mm³',
        interpretation: 'Sin anemia por sangrado ni trastorno de la coagulación.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Epistaxis Anterior Activa (Plexo de Kiesselbach)',
      differentialDiagnoses: [
        'Epistaxis posterior (arteria esfenopalatina)',
        'Coagulopatía o trombocitopenia',
        'Telangiectasia hemorrágica hereditaria',
        'Rinitis atrófica sin sangrado activo',
      ],
      pathophysiology:
        'El área de Little (plexo de Kiesselbach) en el tabique anterior reúne una red anastomótica vascular muy superficial y frágil (arterias etmoidal anterior, esfenopalatina y labial superior); el rascado, aire seco, rinitis y picos tensionales leves rompen estos capilares produciendo epistaxis anterior.',
      keyClinicalClues: [
        'Sangrado nasal unilateral anterior tras sonarse fuerte en paciente estable',
        'Punto sangrante visible en porción anteroinferior del tabique (plexo de Kiesselbach)',
        'Orofaringe sin sangrado activo posterior y tiempos de coagulación normales',
      ],
      characteristicSignsSymptoms: [
        'Sangrado visible en área de Little (tabique anterior)',
        'Orofaringe posterior libre de sangrado continuo',
        'Estabilidad hemodinámica conservada',
      ],
      criticalRulingOutFactors: [
        'Ausencia de escurrimiento posterior masivo hacia faringe o bilateralidad descarta epistaxis posterior.',
        'Plaquetas y tiempos de coagulación normales descartan coagulopatía sistémica.',
      ],
      recommendedWorkup: [
        'Rinoscopia anterior con buena iluminación tras sonado suave o aspiración de coágulos',
        'Verificar presión arterial (suele elevarse secundariamente por ansiedad) y coagulación si uso de anticoagulantes o sangrado persistente',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Oximetazolina 0.05% spray nasal (vasoconstrictor tópico)',
            dose: '2 atomizaciones o algodón embebido en fosa nasal derecha',
            route: 'Nasal tópica',
            frequency: 'Dosis aguda única en urgencias (máximo 3 días si se indica en casa)',
            duration: '1 a 3 días',
            rationale: 'Promueve vasoconstricción local rápida del plexo de Kiesselbach facilitando la hemostasia y visualización.',
          },
          {
            drug: 'Vaselina blanca o ungüento nasal lubricante (o Mupirocina tópica si costras)',
            dose: 'Capa fina en tabique nasal anterior',
            route: 'Nasal tópica',
            frequency: 'Cada 12 horas tras control del sangrado',
            duration: '7 días',
            rationale: 'Previene resequedad, fisuras y resangrado del epitelio septal tras la hemostasia.',
          },
        ],
        generalMeasures: [
          'Compresión digital firme continua de las alas nasales blandas durante 10 a 15 minutos sin soltar, con la cabeza inclinada hacia ADELANTE (nunca hacia atrás para evitar deglución/aspiración de sangre).',
          'Si persiste pese a compresión + vasoconstrictor: cauterización química con nitrato de plata o taponamiento nasal anterior.',
          'Controlar la ansiedad y reevaluar presión arterial una vez detenida la hemorragia antes de agregar antihipertensivos agudos.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración urgente por ORL si no cede con taponamiento anterior, si aparece sangrado posterior hacia garganta o inestabilidad hemodinámica.',
        ],
        followUp: 'Retiro de taponamiento en 48-72 horas (si se colocó) y control de rinitis/TA en primer nivel.',
      },
      criticalSafetyAlerts: [
        'NO indicar inclinar la cabeza hacia atrás ni prescribir AINEs/Aspirina para el malestar nasal, pues inhiben la agregación plaquetaria y prolongan la hemorragia.',
        'Evitar descenso agresivo de presión arterial con fármacos de acción rápida antes de controlar el dolor/ansiedad y lograr hemostasia local.',
      ],
      guidelineReferences: [
        'AAO-HNS Clinical Practice Guideline: Nosebleed (Epistaxis)',
        'Guías de Urgencias de Otorrinolaringología OPS / NICE',
      ],
    },
    internalPersonaPrompt:
      'Habla como Martha, costurera de 54 años. Te empezó a salir sangre por la fosa derecha de la nariz después de sonarte fuerte; te habías echado la cabeza para atrás pero sentiste que tragabas sangre. Estás asustada pero no mareada.',
  },

  // =========================================================================
  // 3. UROLOGÍA (2 casos)
  // =========================================================================
  {
    id: 'case-uro-torsion-testicular',
    mode: 'urgencias',
    specialty: 'urologia',
    patientInfo: {
      name: 'Mateo Sebastián Ramírez',
      age: 16,
      sex: 'Masculino',
      occupation: 'Estudiante de secundaria',
      consultReason: 'Dolor repentino y muy fuerte en un testículo con náuseas',
      evolutionTime: '3 horas de evolución',
      currentIllness:
        'Paciente masculino de 16 años que acude acompañado porque a las 6:00 a. m., estando dormido, lo despertó un dolor brutal y repentino en el testículo derecho que se corre hacia la parte baja del abdomen derecho. Presentó dos vómitos por el intenso dolor. Niega fiebre, ardor al orinar, secreción por el pene o golpes recientes.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '132/82 mmHg',
      heartRate: 112,
      respiratoryRate: 22,
      temperature: 36.8,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 96,
      weightKg: 62,
      heightCm: 171,
    },
    background: {
      pathological: ['Refiere dos episodios breves de dolor testicular derecho autolimitados en el último año.'],
      nonPathological: ['Estudiante sano; niega vida sexual activa.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-uro-torsion-genital',
        system: 'Abdomen',
        name: 'Exploración inguinal, escrotal y reflejo local',
        finding:
          'Hemiscroto derecho eritematoso y discretamente edematoso. Testículo derecho ascendido y en posición horizontal, extremadamente doloroso al mínimo roce. El dolor NO alivia y empeora al elevar manualmente el testículo. Reflejo cutáneo-muscular ipsilateral al estimular cara interna del muslo ABOLIDO (presente en el lado izquierdo).',
        isAbnormal: true,
        semiologyNote:
          'Testículo ascendido horizontalizado + reflejo cremastérico abolido + Signo de Prehn negativo = torsión testicular hasta demostrar lo contrario.',
      },
      {
        id: 'pe-uro-torsion-abdomen',
        system: 'Abdomen',
        name: 'Palpación abdominal y signos de irritación peritoneal',
        finding:
          'Abdomen blando, leve dolor referido en fosa ilíaca derecha sin dolor al rebote ni defensa muscular.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'img-uro-doppler-testicular',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ecografía Doppler testicular bilateral (solo si disponibilidad inmediata sin retrasar quirófano)',
        result:
          'Ausencia total de flujo arterial y venoso intratesticular en el testículo derecho, con torsión en espiral de los vasos del cordón espermático derecho. Testículo izquierdo con flujo conservado.',
        referenceRange: 'Flujo arterial y venoso intratesticular simétrico bilateral',
        interpretation: 'Isquemia testicular aguda por torsión completa del cordón espermático derecho.',
        isAbnormal: true,
      },
      {
        id: 'lab-uro-ego',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO)',
        result: 'Color amarillo claro | Leucocitos: 0-1 /campo | Nitritos: Negativo | Bacterias: Escasas.',
        referenceRange: 'Sin piuria ni bacteriuria',
        interpretation: 'EGO normal; apoya origen no infeccioso y aleja orquiepididimitis.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Torsión Testicular Aguda (Torsión del Cordón Espermático)',
      differentialDiagnoses: [
        'Orquiepididimitis aguda',
        'Torsión de hidátide de Morgagni',
        'Apendicitis aguda',
        'Hernia inguinal encarcelada',
      ],
      pathophysiology:
        'Deformidad anatómica en "badajo de campana" permite la rotación espontánea del testículo sobre el cordón espermático, ocluyendo primero el retorno venoso (congestión/edema) y luego la irrigación arterial. Después de 6 horas la tasa de viabilidad y salvamento testicular cae drásticamente.',
      keyClinicalClues: [
        'Inicio súbito nocturno de dolor escrotal severo con vómitos en adolescente de 16 años',
        'Testículo ascendido y horizontalizado + reflejo cremastérico abolido + Signo de Prehn negativo',
        'Ausencia de síntomas urinarios o fiebre y EGO normal',
      ],
      characteristicSignsSymptoms: [
        'Reflejo cremastérico abolido ipsilateral',
        'Testículo elevado y horizontal (Signo de Gouverneur)',
        'Signo de Prehn negativo y vómitos reflejos',
      ],
      criticalRulingOutFactors: [
        'En orquiepididimitis el inicio es progresivo, hay fiebre/disuria, reflejo cremastérico suele estar conservado y Prehn es positivo.',
        'La clínica manda: si la sospecha es alta no esperar horas por una ecografía Doppler.',
      ],
      recommendedWorkup: [
        'Exploración escrotal inmediata (reflejo cremastérico, posición testicular y signo de Prehn)',
        'Ecografía Doppler solo si se realiza al pie de cama en minutos sin demorar cirugía',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ketorolaco IV o Tramadol IV + Ondansetrón IV (analgesia preoperatoria)',
            dose: 'Ketorolaco 30 mg IV + Ondansetrón 4 mg IV',
            route: 'Intravenosa (IV)',
            frequency: 'Dosis única prequirúrgica',
            duration: 'Fase preoperatoria inmediata',
            rationale: 'Controla el dolor agudo intenso y vómitos mientras el paciente pasa a quirófano sin enmascarar la urgencia.',
          },
          {
            drug: 'Cefazolina (profilaxis antibiótica quirúrgica)',
            dose: '1 g',
            route: 'Intravenosa (IV)',
            frequency: 'Dosis única 30-60 min antes de incisión',
            duration: 'Dosis única preoperatoria',
            rationale: 'Profilaxis estándar de herida limpia en exploración escrotal de urgencia.',
          },
        ],
        generalMeasures: [
          'Exploración quirúrgica de urgencia (<6 horas desde el inicio del dolor) para detorsión testicular y orquidopexia bilateral.',
          'Ayuno absoluto (NPO), canalización venosa periférica y consentimiento informado urgente con padres/tutores.',
          'Intentar detorsión manual ("abrir un libro") solo si hay demora inevitable hacia quirófano y bajo analgesia.',
        ],
        hospitalizationDecision: 'Quirófano / Cirugía de Urgencia',
        referralCriteria: [
          'Traslado inmediato a Quirófano / Urología Pediátrica o Cirugía General sin esperar estudios demorados.',
        ],
        followUp: 'Control postoperatorio urológico a los 7 días para vigilar herida escrotal y vitalidad testicular.',
      },
      criticalSafetyAlerts: [
        '¡EMERGENCIA QUIRÚRGICA TIEMPO-DEPENDIENTE!: Dar el alta como "orquiepididimitis" con antibióticos ambulatorios o retrasar el quirófano esperando ecografía Doppler más allá de las 6 horas causa necrosis e infarto testicular irreversible.',
      ],
      guidelineReferences: [
        'EAU Guidelines on Paediatric Urology — Acute Scrotum & Testicular Torsion',
        'AUA Acute Scrotum Management Consensus',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Mateo, adolescente de 16 años. Te despertó en la madrugada un dolor terrible en el testículo derecho que se sube hacia la parte baja de la panza y te hizo vomitar; nunca habías sentido algo tan fuerte, pero no te arde al orinar.',
  },
  {
    id: 'case-uro-hpb-rao',
    mode: 'medico_general',
    specialty: 'urologia',
    patientInfo: {
      name: 'Don Aurelio Mendoza',
      age: 68,
      sex: 'Masculino',
      occupation: 'Carpintero retirado',
      consultReason: 'No puede orinar desde hace varias horas y tiene mucho dolor en el vientre bajo',
      evolutionTime: '10 horas de evolución',
      currentIllness:
        'Paciente masculino de 68 años que acude sumamente inquieto porque lleva 10 horas sin poder orinar ni una gota, pese a tener ganas desesperadas y pujo doloroso en el bajo vientre. Desde hace 2 años nota que el chorro de orina sale delgado y sin fuerza, se levanta 4 veces por la noche a orinar y siente que no vacía bien la vejiga. Ayer tomó un medicamento para el resfriado por la noche.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '154/90 mmHg',
      heartRate: 96,
      respiratoryRate: 20,
      temperature: 36.7,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 105,
      weightKg: 78,
      heightCm: 169,
    },
    background: {
      pathological: ['Síntomas urinarios bajos crónicos sin seguimiento médico; hipertensión leve.'],
      nonPathological: ['Tabaquismo suspendido hace 10 años.'],
      family: ['Sin antecedentes familiares de relevancia referidos.'],
      surgical: ['Hernioplastia inguinal izquierda hace 12 años.'],
      currentMedications: ['Amlodipino 5 mg al día; tomó un antigripal con pseudoefedrina y clorfeniramina anoche.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-uro-hpb-abdomen',
        system: 'Abdomen',
        name: 'Palpación y percusión suprapúbica',
        finding:
          'Abdomen blando en cuadrantes superiores, pero con masa suprapúbica redondeada, tensa, lisa y muy dolorosa a la palpación que alcanza casi la altura del ombligo, con matidez franca a la percusión (globo vesical). Al presionar aumenta el deseo urgente de orinar.',
        isAbnormal: true,
        semiologyNote:
          'Tumoración suprapúbica ovoide dolorosa y mate a la percusión = globo vesical por retención aguda de orina.',
      },
      {
        id: 'pe-uro-hpb-tacto',
        system: 'Abdomen',
        name: 'Tacto rectal prostático (tras descompresión vesical o valoración urológica)',
        finding:
          'Próstata aumentada de tamaño (grado III, ~55-60 g), superficie lisa, consistencia fibroelástica uniforme, bordes bien delimitados y borramiento del surco medio, no dolorosa a la palpación (sin calor ni fluctuación, alejando prostatitis aguda).',
        isAbnormal: true,
        semiologyNote: 'Próstata grande, lisa, fibroelástica e indolora orienta a hiperplasia prostática benigna (HPB).',
      },
    ],
    studiesPool: [
      {
        id: 'lab-uro-hpb-quimica',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea (Creatinina, Urea y Electrolitos)',
        result: 'Creatinina: 1.4 mg/dL | Urea: 46 mg/dL | Na⁺: 139 mEq/L | K⁺: 4.5 mEq/L.',
        referenceRange: 'Creatinina 0.7-1.3 mg/dL | K⁺ 3.5-5.1 mEq/L',
        interpretation: 'Elevación leve de creatinina postrenal secundaria a obstrucción vesical aguda.',
        isAbnormal: true,
      },
      {
        id: 'img-uro-hpb-eco',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ecografía vesicoprostática',
        result:
          'Vejiga sobredistendida con volumen urinario calculado de 820 mL y engrosamiento trabecular de pared; próstata homogénea de 58 mL de volumen con protrusión intravesical.',
        referenceRange: 'Residuo postmiccional < 50 mL | Próstata < 25-30 mL',
        interpretation: 'Confirma retención urinaria aguda secundaria a crecimiento prostático benigno.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hiperplasia Prostática Benigna (HPB) con Retención Aguda de Orina',
      differentialDiagnoses: [
        'Prostatitis bacteriana aguda',
        'Estenosis uretral',
        'Litiasis vesical enclavada',
        'Cáncer de próstata obstructivo',
      ],
      pathophysiology:
        'El crecimiento nodular benigno de la zona de transición prostática comprime la uretra prostática. Un desencadenante agudo (antigripales con agonistas alfa-adrenérgicos y antihistamínicos anticolinérgicos) aumenta el tono del cuello vesical y reduce la contractilidad del detrusor precipitando retención aguda de orina.',
      keyClinicalClues: [
        'Varón >60 años con chorro débil, nicturia crónica e incapacidad súbita para orinar tras tomar antigripal',
        'Globo vesical suprapúbico doloroso y mate a la percusión',
        'Próstata aumentada, lisa, fibroelástica e indolora al tacto rectal',
      ],
      characteristicSignsSymptoms: [
        'Globo vesical palpable y mate',
        'Pujo vesical doloroso sin micción',
        'Próstata aumentada lisa e indolora',
      ],
      criticalRulingOutFactors: [
        'Próstata indolora y afebril descarta prostatitis bacteriana aguda (donde el sondaje uretral estaría contraindicado).',
        'Sin globo vesical y en anuria correspondería a falla renal prerrenal/intrínseca, no retención urinaria.',
      ],
      recommendedWorkup: [
        'Cateterismo vesical evacuador con registro de volumen residual inicial',
        'Creatinina sérica, examen general de orina y ecografía renal/vesicoprostática',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Tamsulosina',
            dose: '0.4 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas después de una comida',
            duration: 'Tratamiento continuo (mínimo 30 días y valoración urológica)',
            rationale: 'Bloqueador selectivo alfa-1A que relaja el músculo liso prostático y del cuello vesical, duplicando el éxito del retiro de sonda (TWOC).',
          },
          {
            drug: 'Finasterida (coadyuvante de mediano plazo si próstata >40 mL)',
            dose: '5 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Uso crónico urológico (6+ meses)',
            rationale: 'Inhibidor de 5-alfa-reductasa que reduce progresivamente el volumen prostático (~20-25%).',
          },
          {
            drug: 'Paracetamol (control del dolor tras vaciamiento)',
            dose: '500 mg a 1 g',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas si molestia uretral/suprapúbica',
            duration: '2 a 3 días',
            rationale: 'Analgesia segura tras descompresión vesical sin riesgo renal.',
          },
        ],
        generalMeasures: [
          'Colocación aséptica de sonda vesical tipo Foley (16-18 Fr) conectada a bolsa colectora y registro de diuresis inicial.',
          'Suspender inmediatamente antigripales, descongestionantes alfa-adrenérgicos y antihistamínicos anticolinérgicos.',
          'Vigilar diuresis postobstructiva en las primeras horas y realizar prueba de retiro de sonda (TWOC) tras 3-7 días de Tamsulosina.',
        ],
        hospitalizationDecision: 'Observación Urgencias',
        referralCriteria: [
          'Referencia a Urología para seguimiento, prueba de micción sin sonda, antígeno prostático (fuera de retención aguda) y valorar cirugía prostática.',
        ],
        followUp: 'Cita con Urología o consulta externa en 3 a 5 días para intento de retiro de sonda bajo Tamsulosina.',
      },
      criticalSafetyAlerts: [
        '¡NUNCA administrar diuréticos (Furosemida) ante un globo vesical!: aumenta el llenado de una vejiga obstruida provocando dolor intolerable y riesgo de rotura vesical.',
        'Evitar fármacos anticolinérgicos o descongestionantes simpaticomiméticos (clorfeniramina, butilhioscina, pseudoefedrina) que perpetúan la retención.',
      ],
      guidelineReferences: [
        'EAU Guidelines on Management of Non-Neurogenic Male LUTS / Acute Urinary Retention',
        'AUA Benign Prostatic Hyperplasia Guideline',
      ],
    },
    internalPersonaPrompt:
      'Habla como Don Aurelio, carpintero retirado de 68 años. Tienes un dolor desesperante abajo del ombligo porque llevas 10 horas sin poder sacar ni una gota de orina aunque sientes la vejiga a reventar; desde hace años el chorro salía débil y anoche tomaste una pastilla para el catarro.',
  },

  // =========================================================================
  // 4. HEMATOLOGÍA (2 casos)
  // =========================================================================
  {
    id: 'case-hema-neutropenia-febril',
    mode: 'residente',
    specialty: 'hematologia',
    patientInfo: {
      name: 'Patricia Isabel Valverde',
      age: 49,
      sex: 'Femenino',
      occupation: 'Contadora pública',
      consultReason: 'Fiebre alta con escalofríos y malestar general desde anoche',
      evolutionTime: '6 horas de evolución',
      currentIllness:
        'Paciente femenina de 49 años que acude a urgencias porque hace 6 horas inició con escalofríos intensos, fiebre de 38.9 °C en casa, debilidad marcada y ligero ardor en la boca al tragar. Refiere estar en tratamiento oncológico por tumor de mama izquierda y haber recibido su último ciclo de quimioterapia intravenosa exactamente hace 10 días (nadir). Niega tos productiva o diarrea profusa.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '96/60 mmHg',
      heartRate: 118,
      respiratoryRate: 22,
      temperature: 38.9,
      oxygenSaturation: 96,
      glasgow: 15,
      bloodGlucose: 108,
      weightKg: 64,
      heightCm: 162,
    },
    background: {
      pathological: ['Carcinoma ductal de mama izquierda en quimioterapia adyuvante (día +10 de ciclo AC).'],
      nonPathological: ['Portadora de catéter venoso central subcutáneo (Port-a-Cath) subclavio derecho.'],
      family: ['Madre con diabetes mellitus tipo 2.'],
      surgical: ['Cuadrantectomía mamaria izquierda y colocación de puerto subcutáneo hace 2 meses.'],
      currentMedications: ['Ondansetrón ocasional post-quimioterapia.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-hema-nf-general',
        system: 'Cabeza y Cuello',
        name: 'Inspección de cavidad oral, mucosas y sitio de catéter venoso',
        finding:
          'Mucositis oral grado II (eritema y pequeñas úlceras dolorosas en mucosa yugal y paladar blando sin placas purulentas). Sitio de inserción de catéter subclavio derecho con discreto eritema peri-reservorio sin secreción purulenta franca. Alopecia secundaria a quimioterapia.',
        isAbnormal: true,
        semiologyNote:
          'En neutropenia febril la respuesta inflamatoria local es pobre: puede haber bacteriemia grave sin pus evidente.',
      },
      {
        id: 'pe-hema-nf-cardio',
        system: 'Cardiovascular',
        name: 'Auscultación cardiopulmonar y perfusión',
        finding:
          'Taquicardia sinusal rítmica sin soplos. Campos pulmonares ventilados sin estertores ni sibilancias. Llenado capilar de 2.5 segundos, extremidades tibias.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-hema-nf-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa con diferencial manual',
        result:
          'Leucocitos totales: 600 /mm³ | Neutrófilos absolutos (ANC): 180 /mm³ | Linfocitos: 380 /mm³ | Hb: 10.4 g/dL | Plaquetas: 98,000 /mm³.',
        referenceRange: 'Neutrófilos absolutos > 1,500 /mm³ (Neutropenia severa < 500 /mm³)',
        interpretation: 'Neutropenia profunda severa (<500 /mm³) en fase de nadir postquimioterapia asociada a fiebre.',
        isAbnormal: true,
      },
      {
        id: 'lab-hema-nf-cultivos',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Hemocultivos pareados (periférico + catéter), PCR y procalcitonina',
        result:
          'Hemocultivos tomados previo a antibiótico (pendiente crecimiento en 24-48 h) | PCR: 162 mg/L | Procalcitonina: 3.8 ng/mL | Lactato: 2.3 mmol/L.',
        referenceRange: 'Procalcitonina < 0.5 ng/mL | Lactato < 2.0 mmol/L',
        interpretation: 'Elevación importante de marcadores bacterianos sistémicos compatible con sepsis incipiente en neutropenia.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Neutropenia Febril Post-Quimioterapia',
      differentialDiagnoses: [
        'Infección asociada a catéter venoso central / bacteriemia por gramnegativos',
        'Fiebre tumoral o medicamentosa (diagnóstico de exclusión)',
        'Mucositis infecciosa herpética o candidiásica',
        'Sepsis de foco pulmonar oculto',
      ],
      pathophysiology:
        'La quimioterapia citotóxica alcanza su nadir medular a los 7-14 días causando neutropenia severa (ANC <500/mm³) y mucositis intestinal/oral, lo que permite translocación de bacilos gramnegativos (incluyendo Pseudomonas aeruginosa) y cocos grampositivos al torrente sanguíneo con escasos signos locales de pus.',
      keyClinicalClues: [
        'Fiebre >=38.3°C (o >=38°C sostenida) en el día +10 post-quimioterapia',
        'Conteo absoluto de neutrófilos (ANC) <500/mm³ (180/mm³)',
        'Taquicardia, PA limítrofe, mucositis y catéter central portador de riesgo bacteriémico',
      ],
      characteristicSignsSymptoms: [
        'Fiebre con escalofríos en día +10 postquimioterapia',
        'ANC < 500 /mm³',
        'Signos inflamatorios locales atenuados por falta de neutrófilos',
      ],
      criticalRulingOutFactors: [
        'En el paciente neutropénico febril, NUNCA esperar el resultado de cultivos ni confirmar foco focalizado para iniciar antibióticos IV antipseudomónicos.',
      ],
      recommendedWorkup: [
        'Biometría hemática urgente para calcular ANC, química sanguínea y lactato',
        'Dos sets de hemocultivos (venopunción periférica y lúmenes del catéter) ANTES del antibiótico sin retrasar >1 hora',
        'Radiografía de tórax y urocultivo según síntomas',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Cefepima (o Piperacilina / Tazobactam o Meropenem) IV empírico antipseudomónico',
            dose: '2 g',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas (primera dosis dentro de los primeros 60 minutos)',
            duration: 'Mínimo 7 a 10 días hasta recuperación de neutrófilos (ANC >500/mm³) y 48-72 h afebril',
            rationale: 'Monoterapia betalactámica antipseudomónica de primera línea en neutropenia febril de alto riesgo ("hora dorada").',
          },
          {
            drug: 'Solución Salina Normal 0.9% (reposición volémica inicial)',
            dose: '500 a 1,000 mL en infusión inicial',
            route: 'Intravenosa (IV)',
            frequency: 'Bolo inicial seguido de mantenimiento según PAM y diuresis',
            duration: 'Fase aguda hospitalaria',
            rationale: 'Sostiene presión de perfusión ante PA limítrofe (96/60) e hiperlactatemia.',
          },
          {
            drug: 'Filgrastim (G-CSF) según protocolo onco-hematológico de alto riesgo',
            dose: '300 mcg (5 mcg/kg)',
            route: 'Subcutánea (SC)',
            frequency: 'Cada 24 horas',
            duration: 'Hasta alcanzar ANC > 1,000/mm³',
            rationale: 'Acorta la duración de la neutropenia severa en pacientes con inestabilidad o riesgo MASCC alto.',
          },
        ],
        generalMeasures: [
          'Aislamiento protector (inverso), lavado estricto de manos y restricción de visitas con infecciones respiratorias.',
          'Administración del antibiótico antipseudomónico IV en la primera hora tras toma inmediata de hemocultivos.',
          'Cuidados de mucositis con enjuagues salinos/bicarbonato suaves; dieta cocida.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Ingreso a UCI inmediato si cae presión arterial sistólica <90 mmHg refractaria a cristaloides (choque séptico).',
        ],
        followUp: 'Monitorización estrecha de curva térmica, cultivos a las 48-72 h y recuento diario de neutrófilos por Hematología/Oncología.',
      },
      criticalSafetyAlerts: [
        '¡PROHIBIDO realizar tacto rectal, tomar temperatura rectal o aplicar supositorios/enemas en pacientes con neutropenia severa!: rompe la barrera mucosa y precipita translocación bacteriana y choque séptico fulminante.',
        'Retrasar el antibiótico IV antipseudomónico más allá de 1 hora o manejar como ambulatorio a un paciente con ANC <500 y taquicardia/hipotensión conlleva alta mortalidad.',
      ],
      guidelineReferences: [
        'IDSA Clinical Practice Guideline for the Use of Antimicrobial Agents in Neutropenic Patients with Cancer',
        'NCCN Guidelines: Prevention and Treatment of Cancer-Related Infections',
      ],
    },
    internalPersonaPrompt:
      'Habla como Patricia, mujer de 49 años en tratamiento por cáncer de mama. Hace 10 días te pusieron quimioterapia y desde hace 6 horas tienes fiebre alta con temblor de frío, debilidad y la boca ardorosa al tragar.',
  },
  {
    id: 'case-hema-pti-severa',
    mode: 'medico_general',
    specialty: 'hematologia',
    patientInfo: {
      name: 'Valeria Nicole Zambrano',
      age: 24,
      sex: 'Femenino',
      occupation: 'Estudiante universitaria de Arquitectura',
      consultReason: 'Manchitas rojas en las piernas, moretones fáciles y sangrado de encías',
      evolutionTime: '3 días de evolución',
      currentIllness:
        'Paciente femenina de 24 años que acude preocupada porque desde hace 3 días nota puntitos rojos múltiples en ambas piernas y tobillos, varios moretones grandes en brazos sin haberse golpeado y hoy al cepillarse los dientes presentó sangrado abundante de las encías que tardó en ceder. Hace 2 semanas tuvo un cuadro viral leve de vías respiratorias ya resuelto. Niega fiebre actual, dolores óseos o pérdida de peso.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '114/72 mmHg',
      heartRate: 84,
      respiratoryRate: 17,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 58,
      heightCm: 165,
    },
    background: {
      pathological: ['Cuadro gripal autolimitado hace 15 días; niega lupus, hepatopatías o sangrados previos.'],
      nonPathological: ['No toma alcohol ni fuma.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno actualmente; niega uso de aspirina, anticoagulantes o suplementos herbales.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-hema-pti-piel',
        system: 'Osteomuscular y Piel',
        name: 'Inspección cutánea integral, mucosas y búsqueda de sangrado',
        finding:
          'Múltiples petequias puntiformes violáceas que NO blanquean a la digitopresión en ambas piernas, pies y antebrazos, acompañadas de equimosis espontáneas de 3 a 5 cm en brazos y muslos. Pequeñas bulas hemorrágicas en mucosa yugal y gingivorragia leve activa.',
        isAbnormal: true,
        semiologyNote:
          'Petequias + equimosis + sangrado mucoso ("púrpura húmeda") en paciente estable orienta a trombocitopenia severa con alto riesgo hemorrágico.',
      },
      {
        id: 'pe-hema-pti-abd',
        system: 'Abdomen',
        name: 'Palpación abdominal, ganglios y visceromegalias',
        finding:
          'Abdomen blando no doloroso. Sin esplenomegalia ni hepatomegalia palpables. Sin adenopatías cervicales, axilares o inguinales (aleja leucemia aguda o linfoma).',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-hema-pti-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa y Frotis de Sangre Periférica',
        result:
          'Plaquetas: 8,000 /mm³ | Hb: 12.6 g/dL | Leucocitos: 6,800 /mm³ (diferencial normal). Frotis periférico: trombocitopenia severa aislada con plaquetas gigantes, SIN blastos, SIN esquistocitos y serie eritroide/mieloide normal.',
        referenceRange: 'Plaquetas 150,000-450,000 /mm³',
        interpretation: 'Trombocitopenia severa aislada sin alteración de otras líneas celulares ni microangiopatía.',
        isAbnormal: true,
      },
      {
        id: 'lab-hema-pti-coag',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Tiempos de Coagulación (TP, TTPa) y Panel Viral (VIH / VHC / VHB)',
        result: 'TP: 11.5 seg (INR 1.0) | TTPa: 28 seg | Fibrinógeno: 310 mg/dL | Serologías VIH/VHC/VHB: Negativas.',
        referenceRange: 'TP/TTPa normales | Serologías negativas',
        interpretation: 'Descarta coagulopatía plasmática, CID y trombocitopenia viral crónica secundaria.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Púrpura Trombocitopénica Inmune (PTI) Primaria Severa',
      differentialDiagnoses: [
        'Leucemia aguda o aplasia medular',
        'Púrpura trombocitopénica trombótica (PTT)',
        'Trombocitopenia inducida por fármacos o infección (VIH / VHC / Dengue)',
        'Coagulación intravascular diseminada (CID)',
      ],
      pathophysiology:
        'Producción de autoanticuerpos IgG contra glucoproteínas plaquetarias (GPIIb/IIIa, GPIb/IX), frecuentemente tras un detonante viral previo, que provoca destrucción acelerada de plaquetas en el bazo y supresión relativa de su producción megacariocítica.',
      keyClinicalClues: [
        'Mujer joven previamente sana tras cuadro viral reciente con petequias, equimosis y sangrado gingival',
        'Trombocitopenia severa aislada (<10,000/mm³) con Hb, leucocitos y tiempos de coagulación normales',
        'Frotis sin blastos ni esquistocitos y ausencia de esplenomegalia o adenopatías',
      ],
      characteristicSignsSymptoms: [
        'Petequias que no desaparecen a la vitropresión y equimosis',
        'Púrpura húmeda (gingivorragia o bulas hemorrágicas orales)',
        'Trombocitopenia aislada sin visceromegalias',
      ],
      criticalRulingOutFactors: [
        'Frotis sin esquistocitos y función renal/neurológica normal descartan PTT.',
        'Hb/leucocitos normales y ausencia de blastos/adenopatías alejan leucemia aguda.',
      ],
      recommendedWorkup: [
        'Biometría hemática completa con revisión obligatoria de frotis periférico (descarta pseudotrombocitopenia y blastos)',
        'TP, TTPa y serologías VIH / Hepatitis B y C',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Dexametasona 40 mg/día IV/VO (o Prednisona 1 mg/kg/día VO)',
            dose: '40 mg (o Prednisona 60 mg)',
            route: 'Intravenosa (IV) o Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '4 días (Dexametasona en pulso) o 2-3 semanas con descenso gradual (Prednisona)',
            rationale: 'Corticoide de primera línea que frena la destrucción esplénica mediada por macrófagos y la producción de autoanticuerpos.',
          },
          {
            drug: 'Inmunoglobulina Humana Intravenosa (IGIV) por sangrado mucoso activo ("púrpura húmeda")',
            dose: '1 g/kg/día',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 24 horas',
            duration: '1 a 2 días',
            rationale: 'Eleva las plaquetas en 24-48 horas cuando existe sangrado mucoso activo o plaquetas <10,000/mm³.',
          },
          {
            drug: 'Omeprazol (gastroprotección durante pulso esteroideo)',
            dose: '20 a 40 mg',
            route: 'Vía Oral o IV',
            frequency: 'Cada 24 horas',
            duration: 'Mientras dure el esquema esteroideo',
            rationale: 'Previene hemorragia digestiva alta asociada a dosis altas de corticoides en paciente trombocitopénica.',
          },
        ],
        generalMeasures: [
          'Reposo relativo, evitar traumatismos, cepillado dental muy suave y suspender deportes de contacto.',
          'Prohibir inyecciones intramusculares, punciones innecesarias, AINEs y antiagregantes.',
          'No transfundir plaquetas de rutina salvo hemorragia crítica amenazante para la vida (se destruyen rápidamente).',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'UCI y transfusión de plaquetas + IGIV + metilprednisolona urgente ante cefalea intensa o sospecha de hemorragia intracraneal.',
        ],
        followUp: 'Seguimiento estrecho por Hematología con biometría hemática a las 48-72 h para verificar ascenso plaquetario (>30,000-50,000/mm³).',
      },
      criticalSafetyAlerts: [
        'CONTRAINDICADO administrar AINEs (ibuprofeno, ketorolaco, naproxeno), Aspirina, anticoagulantes o inyecciones intramusculares en trombocitopenia severa: riesgo de hemorragia intracraneal o gastrointestinal mortal.',
      ],
      guidelineReferences: [
        'ASH Clinical Practice Guidelines for Immune Thrombocytopenia (ITP)',
        'International Consensus Report on Investigation and Management of Primary ITP',
      ],
    },
    internalPersonaPrompt:
      'Habla como Valeria, estudiante de 24 años. Desde hace 3 días te salieron puntitos rojos en las piernas, moretones grandes sin golpearte y hoy te sangraron mucho las encías al lavarte los dientes. Hace dos semanas tuviste una gripita suave.',
  },

  // =========================================================================
  // 5. REUMATOLOGÍA (2 casos)
  // =========================================================================
  {
    id: 'case-reuma-arteritis-temporal',
    mode: 'urgencias',
    specialty: 'reumatologia',
    patientInfo: {
      name: 'Doña Carmen Alicia Montoya',
      age: 72,
      sex: 'Femenino',
      occupation: 'Maestra jubilada',
      consultReason: 'Dolor fuerte en la sien derecha, cansancio al masticar y ratos de visión borrosa',
      evolutionTime: '12 días de evolución',
      currentIllness:
        'Paciente femenina de 72 años que consulta porque desde hace casi dos semanas presenta un dolor punzante continuo en la sien derecha que empeoró en los últimos dos días. Nota que le duele el cuero cabelludo al peinarse o apoyar la cabeza en la almohada, que se le cansa y duele la mandíbula a los pocos segundos de empezar a masticar alimentos sólidos, y hoy tuvo dos episodios breves de unos minutos en que perdió parcialmente la vista del ojo derecho ("como una cortina gris"). Además refiere rigidez matutina en hombros y caderas desde hace un mes.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '142/82 mmHg',
      heartRate: 88,
      respiratoryRate: 18,
      temperature: 37.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 104,
      weightKg: 61,
      heightCm: 157,
    },
    background: {
      pathological: ['Dolor y rigidez en hombros matutinos desde hace un mes; osteopenia leve.'],
      nonPathological: ['No fuma ni consume alcohol.'],
      family: ['Sin antecedentes heredofamiliares conocidos.'],
      surgical: ['Colecistectomía hace 18 años.'],
      currentMedications: ['Tomó paracetamol sin alivio real de la cefalea.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-reuma-acg-temporal',
        system: 'Cabeza y Cuello',
        name: 'Palpación de arterias temporales, cuero cabelludo y fondo de ojo',
        finding:
          'Arteria temporal superficial derecha engrosada, tortuosa, indurada, muy sensible a la palpación superficial y con pulso francamente disminuido en comparación con la izquierda. Alodinia del cuero cabelludo derecho al roce. Agudeza visual conservada en este momento entre episodios.',
        isAbnormal: true,
        semiologyNote:
          'Arteria temporal engrosada/hipopulsátil e hipersensible + claudicación mandibular + amaurosis fugaz en >50 años es emergencia reumatológica.',
      },
      {
        id: 'pe-reuma-acg-musculo',
        system: 'Osteomuscular y Piel',
        name: 'Exploración articular de cinturas escapular y pélvica',
        finding:
          'Limitación dolorosa leve a la abducción activa de ambos hombros con rigidez dolorosa proximal bilateral; fuerza muscular real conservada (5/5).',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-reuma-acg-reactantes',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'VSG (Velocidad de Sedimentación Globular), PCR y Biometría Hemática',
        result:
          'VSG: 98 mm/h | PCR: 86 mg/L | Hb: 10.9 g/dL (normocítica normocrómica de trastorno crónico) | Plaquetas: 440,000 /mm³ (trombocitosis reactiva).',
        referenceRange: 'VSG < 30 mm/h | PCR < 5 mg/L',
        interpretation: 'Elevación extrema de VSG y PCR con anemia inflamatoria y trombocitosis reactiva altamente sugestivas de vasculitis de grandes vasos.',
        isAbnormal: true,
      },
      {
        id: 'img-reuma-acg-eco',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ecografía Doppler de arterias temporales',
        result:
          'Engrosamiento hipoecoico concéntrico perivascular no compresible de la pared de la arteria temporal superficial derecha con estenosis del flujo luminar.',
        referenceRange: 'Pared arterial delgada sin engrosamiento perivascular',
        interpretation: 'Signo del halo positivo altamente específico de Arteritis de Células Gigantes.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Arteritis de Células Gigantes (Arteritis Temporal)',
      differentialDiagnoses: [
        'Cefalea tensional o migraña de inicio tardío',
        'Neuralgia del trigémino',
        'Glaucoma agudo de ángulo cerrado',
        'Evento vascular cerebral / AIT carotídeo',
      ],
      pathophysiology:
        'Vasculitis granulomatosa mediada por linfocitos T y células gigantes multinucleadas en arterias de mediano y gran calibre (ramas de la carótida externa, oftálmica y ciliar posterior) en adultos >50 años. La inflamación transmural ocluye la arteria ciliar posterior pudiendo causar neuropatía óptica isquémica anterior y ceguera irreversible.',
      keyClinicalClues: [
        'Mujer >50 años con cefalea temporal nueva, dolor al peinarse y claudicación mandibular',
        'Episodios transitorios de pérdida visual (amaurosis fugaz) y síntomas de polimialgia reumática',
        'Arteria temporal engrosada/dolorosa + VSG muy elevada (98 mm/h) y Signo del Halo',
      ],
      characteristicSignsSymptoms: [
        'Claudicación mandibular al masticar',
        'Alodinia de cuero cabelludo y arteria temporal indurada',
        'Amaurosis fugaz con riesgo inminente de ceguera',
      ],
      criticalRulingOutFactors: [
        'La claudicación mandibular + VSG ~100 mm/h + edad >50 años diferencia rotundamente este cuadro de migraña o cefalea tensional.',
        'La amaurosis fugaz obliga a iniciar corticoides IV de inmediato sin esperar biopsia.',
      ],
      recommendedWorkup: [
        'VSG, PCR y biometría hemática urgentes',
        'Ecografía Doppler temporal ("signo del halo") y programar biopsia de arteria temporal (los corticoides NO deben retrasarse por ella)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metilprednisolona IV (pulsos por síntomas visuales / amaurosis fugaz) seguida de Prednisona VO',
            dose: '500 a 1,000 mg IV (o Prednisona 60 mg/día si sin síntomas visuales)',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 24 horas x 3 días, luego Prednisona 60 mg VO cada 24 h con descenso lento',
            duration: '3 días pulsos IV + pauta descendente prolongada (12-18 meses)',
            rationale: 'Frena en horas la vasculitis de la arteria oftálmica/ciliar evitando ceguera permanente unilateral o bilateral.',
          },
          {
            drug: 'Omeprazol (gastroprotección) + Calcio/Vitamina D (profilaxis ósea)',
            dose: 'Omeprazol 20 mg VO + Calcio 1000 mg/Vit D 800 UI',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Durante corticoterapia prolongada',
            rationale: 'Previene complicaciones gástricas y osteoporosis por uso crónico de esteroides en adulta mayor.',
          },
        ],
        generalMeasures: [
          'Iniciar el corticoide DE INMEDIATO ante la sospecha clínica con síntomas visuales, SIN esperar biopsia ni ecografía.',
          'Valoración conjunta urgente por Reumatología y Oftalmología (fondo de ojo).',
          'Solicitar biopsia de arteria temporal dentro de los primeros 7-14 días tras iniciar esteroides (el infiltrado sigue visible).',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Valoración oftalmológica urgente si pérdida visual aguda; seguimiento estrecho por Reumatología para ahorradores de esteroides (Tocilizumab/Metotrexato).',
        ],
        followUp: 'Control semanal inicial de VSG/PCR y síntomas visuales con Reumatología.',
      },
      criticalSafetyAlerts: [
        '¡ERROR CRÍTICO!: Retrasar los corticoides sistémicos esperando una biopsia de arteria temporal o tratar solo con analgésicos/AINEs en presencia de amaurosis fugaz produce neuropatía óptica isquémica y CEGUERA IRREVERSIBLE en cuestión de horas o días.',
      ],
      guidelineReferences: [
        'ACR / Vasculitis Foundation Guideline for the Management of Giant Cell Arteritis',
        'EULAR Recommendations for the Management of Large Vessel Vasculitis',
      ],
    },
    internalPersonaPrompt:
      'Habla como Doña Carmen, maestra jubilada de 72 años. Te duele mucho la sien derecha desde hace casi dos semanas, hasta peinarte te duele, se te cansa la quijada al masticar y hoy se te nubló la vista del ojo derecho unos minutos como una cortina gris.',
  },
  {
    id: 'case-reuma-artritis-septica',
    mode: 'residente',
    specialty: 'reumatologia',
    patientInfo: {
      name: 'Roberto Carlos Pineda',
      age: 58,
      sex: 'Masculino',
      occupation: 'Operador de maquinaria agrícola',
      consultReason: 'Rodilla derecha muy hinchada, roja, caliente y con fiebre alta',
      evolutionTime: '36 horas de evolución',
      currentIllness:
        'Paciente masculino de 58 años que consulta porque desde hace 36 horas la rodilla derecha se le inflamó rápidamente, se puso roja y muy caliente, con dolor intenso que le impide por completo caminar o doblar la pierna. Desde anoche tiene fiebre de 38.8 °C y escalofríos. Hace 5 días se raspó la espinilla derecha trabajando en el campo. Niega otros dolores articulares.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 108,
      respiratoryRate: 20,
      temperature: 38.8,
      oxygenSaturation: 97,
      glasgow: 15,
      bloodGlucose: 248,
      weightKg: 84,
      heightCm: 173,
    },
    background: {
      pathological: ['Diabetes mellitus tipo 2 de 10 años de evolución con apego irregular.'],
      nonPathological: ['Trabaja en campo; niega consumo de alcohol reciente o gota previa.'],
      family: ['Padres con diabetes tipo 2.'],
      surgical: ['Niega cirugías previas o prótesis articulares.'],
      currentMedications: ['Metformina 850 mg de forma irregular.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-reuma-artritis-rodilla',
        system: 'Osteomuscular y Piel',
        name: 'Exploración articular de rodilla derecha y piel distal',
        finding:
          'Rodilla derecha en actitud antálgica en ligera flexión, con eritema intenso, aumento marcado de calor local, derrame articular a tensión (peloteo rotuliano positivo) y dolor exquisito ante el más mínimo movimiento activo o pasivo (rango de movimiento casi 0°). Lesión cutánea costrosa en cara anterior de pierna derecha (puerta de entrada). Resto de articulaciones sin inflamación.',
        isAbnormal: true,
        semiologyNote:
          'Monoartritis aguda febril + bloqueo doloroso absoluto de movilidad pasiva en diabético con puerta de entrada cutánea = artritis séptica hasta demostrar lo contrario.',
      },
      {
        id: 'pe-reuma-artritis-general',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y perfusión periférica',
        finding: 'Ruidos cardíacos taquicárdicos rítmicos sin soplos patológicos. Pulsos pedios y tibiales presentes.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-reuma-artrocentesis',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Artrocentesis de rodilla derecha (Citoquímico, Gram y Cultivo de líquido sinovial)',
        result:
          'Aspecto turbio-purulento | Leucocitos: 86,000 /mm³ (94% polimorfonucleares) | Glucosa sinovial: 18 mg/dL (muy baja respecto a sérica) | Tinción de Gram: Cocos grampositivos en racimos | Cristales (luz polarizada): Ausentes.',
        referenceRange: 'Líquido claro < 200 leucocitos/mm³ | Gram negativo | Sin cristales',
        interpretation: 'Líquido sinovial francamente séptico (purulento, >50,000 PMN y cocos grampositivos en racimos sugerentes de S. aureus).',
        isAbnormal: true,
      },
      {
        id: 'lab-reuma-septica-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática, PCR y Hemocultivos',
        result: 'Leucocitos: 17,400 /mm³ (Neutrófilos 86%) | PCR: 194 mg/L | Glucosa sérica: 248 mg/dL | Hemocultivos tomados previo a antibiótico.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | PCR < 5 mg/L',
        interpretation: 'Respuesta inflamatoria sistémica aguda y descontrol glucémico secundario a infección grave.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Artritis Séptica Aguda de Rodilla (Staphylococcus aureus)',
      differentialDiagnoses: [
        'Artritis gotosa aguda (gota) o pseudogota (CPPD)',
        'Celulitis o bursitis prepatelar sin derrame intraarticular',
        'Hemartrosis traumática',
        'Artritis reactiva',
      ],
      pathophysiology:
        'Diseminación hematógena (desde lesión cutánea en paciente diabético inmunocomprometido) de Staphylococcus aureus hacia la membrana sinovial vascularizada. La rápida liberación de enzimas proteolíticas bacterianas y neutrofílicas destruye irreversiblemente el cartílago articular en 24-48 horas si no se drena y trata.',
      keyClinicalClues: [
        'Monoartritis aguda febril en rodilla en diabético tras herida cutánea reciente',
        'Bloqueo completo de la movilidad pasiva por dolor extremo y calor local marcado',
        'Artrocentesis con >50,000 leucocitos/mm³ (>90% PMN), glucosa muy baja y cocos grampositivos en racimos sin cristales',
      ],
      characteristicSignsSymptoms: [
        'Monoartritis aguda febril con derrame a tensión',
        'Impotencia funcional absoluta ante movilidad pasiva',
        'Líquido sinovial purulento (>50,000 células/mm³)',
      ],
      criticalRulingOutFactors: [
        'La artrocentesis antes de iniciar antibióticos es obligatoria para diferenciar gota/pseudogota (cristales) de artritis séptica.',
        'La presencia de derrame a tensión y dolor en todo arco articular distingue de celulitis o bursitis superficial.',
      ],
      recommendedWorkup: [
        'Artrocentesis urgente ANTES del antibiótico (citoquímico, Gram, cultivo y cristales)',
        'Hemocultivos pareados, biometría hemática, PCR y radiografía simple basal de rodilla',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Vancomicina IV + Ceftriaxona IV (o Oxacilina / Cefazolina si SAMS confirmado)',
            dose: 'Vancomicina 1 g IV + Ceftriaxona 2 g IV',
            route: 'Intravenosa (IV)',
            frequency: 'Vancomicina cada 12 h + Ceftriaxona cada 24 h',
            duration: '2 a 4 semanas (IV inicial seguida de oral dirigido según cultivo y evolución)',
            rationale: 'Cobertura empírica inicial inmediata contra S. aureus (incluyendo SARM) y bacilos gramnegativos tras artrocentesis.',
          },
          {
            drug: 'Paracetamol IV / Control glucémico con Insulina Cristalina según esquema',
            dose: 'Paracetamol 1 g IV',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas según dolor o fiebre',
            duration: 'Fase aguda hospitalaria',
            rationale: 'Controla dolor y fiebre evitando nefrotoxicidad de AINEs junto con vancomicina y optimiza control metabólico.',
          },
        ],
        generalMeasures: [
          'Drenaje articular urgente y lavado quirúrgico (artroscópico o artrotomía por Ortopedia/Traumatología) para evacuar pus y proteger el cartílago.',
          'Inmovilización temporal en posición funcional en fase hiperalgésica seguida de rehabilitación temprana tras control infeccioso.',
          'Control metabólico estricto de glucosa capilar en hospitalización.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Valoración quirúrgica inmediata por Traumatología/Ortopedia para lavado y drenaje articular urgente.',
        ],
        followUp: 'Ajuste antibiótico con resultado de cultivo de líquido sinovial a las 48-72 h y seguimiento de PCR y función articular.',
      },
      criticalSafetyAlerts: [
        '¡ERROR CRÍTICO!: NUNCA infiltrar corticoides intraarticulares ni dar esteroides sistémicos creyendo que es gota antes de descartar artritis séptica por artrocentesis: destruye la articulación y precipita sepsis fulminante.',
        'La artritis séptica exige drenaje articular además de antibióticos IV; tratar solo con pastillas orales en casa condena a destrucción cartilaginosa.',
      ],
      guidelineReferences: [
        'BSR / BOA Guideline for Management of the Hot Swollen Joint in Adults',
        'IDSA / SANFORD Septic Arthritis Treatment Recommendations',
      ],
    },
    internalPersonaPrompt:
      'Habla como Roberto, trabajador de campo de 58 años con azúcar alta. Hace cinco días te raspaste la espinilla y desde ayer la rodilla derecha se te hinchó enorme, está roja, hirviendo y no puedes ni doblarla tantito; además tienes fiebre con escalofríos.',
  },

  // =========================================================================
  // 6. TOXICOLOGÍA CLÍNICA (2 casos)
  // =========================================================================
  {
    id: 'case-tox-intoxicacion-paracetamol',
    mode: 'urgencias',
    specialty: 'toxicologia',
    patientInfo: {
      name: 'Sofía Valentina Morales',
      age: 22,
      sex: 'Femenino',
      occupation: 'Estudiante de Diseño',
      consultReason: 'Náuseas, vómitos y malestar abdominal tras incidente en domicilio',
      evolutionTime: '5 horas desde la ingestión',
      currentIllness:
        'Paciente femenina de 22 años que acude con su hermana porque hace exactamente 5 horas, después de una crisis emocional, ingirió de golpe 36 tabletas de 500 mg de un analgésico común de venta libre (total aproximado 18 gramos) con agua. Hace dos horas presentó náuseas intensas, dos vómitos y refiere molestia sorda leve debajo de las costillas del lado derecho. Se encuentra despierta, arrepentida y colaboradora.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 98,
      respiratoryRate: 18,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 56,
      heightCm: 162,
    },
    background: {
      pathological: ['Episodio depresivo sin seguimiento reciente; niega enfermedad hepática crónica previa.'],
      nonPathological: ['Niega consumo crónico diario de alcohol u otras drogas; no ingirió otros fármacos junto a las tabletas.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno crónico.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-tox-paracetamol-abd',
        system: 'Abdomen',
        name: 'Exploración abdominal y búsqueda de estigmas hepáticos',
        finding:
          'Abdomen blando, depresible, con dolor leve a la palpación profunda en hipocondrio derecho sin defensa ni rebote. Sin ictericia escleral ni asterixis al momento de la valoración inicial.',
        isAbnormal: true,
        semiologyNote:
          'En las primeras 24 horas de intoxicación por paracetamol el examen y las transaminasas pueden ser casi normales ("fase silenciosa engañosa"); la ventana de antídoto es ahora.',
      },
      {
        id: 'pe-tox-paracetamol-neuro',
        system: 'Neurológico',
        name: 'Estado de conciencia, pupilas y evaluación de riesgo suicida',
        finding:
          'Glasgow 15/15, orientada, afecto ansioso y lábil. Pupilas isocóricas normorreactivas (3 mm) sin nistagmo ni depresión del SNC.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-tox-paracetamol-nivel',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Nivel sérico de Acetaminofén (Nomograma Rumack-Matthew) y Perfil Hepático basal',
        result:
          'Acetaminofén sérico (a las 5 h post-ingesta): 215 mcg/mL (muy por encima de la línea de tratamiento del nomograma de Rumack-Matthew: >125 mcg/mL a las 5 h) | AST: 44 U/L | ALT: 39 U/L | Bilirrubina total: 0.8 mg/dL | INR: 1.05.',
        referenceRange: 'Tóxico a las 4-5 h > 150-125 mcg/mL | AST/ALT < 40 U/L',
        interpretation: 'Nivel sérico francamente hepatotóxico antes de que se disparen las transaminasas; indicación absoluta de N-acetilcisteína inmediata.',
        isAbnormal: true,
      },
      {
        id: 'lab-tox-paracetamol-quimica',
        category: 'Laboratorio',
        subcategory: 'Electrolitos',
        name: 'Química renal, Electrolitos y Prueba de Embarazo (β-hCG)',
        result: 'Creatinina: 0.72 mg/dL | Na⁺: 140 mEq/L | K⁺: 4.0 mEq/L | β-hCG sérica: Negativa.',
        referenceRange: 'Creatinina 0.6-1.1 mg/dL | β-hCG negativa',
        interpretation: 'Función renal conservada y embarazo descartado.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Intoxicación Aguda por Paracetamol (Acetaminofén)',
      differentialDiagnoses: [
        'Intoxicación por AINEs o salicilatos',
        'Hepatitis viral aguda',
        'Gastroenteritis medicamentosa sin riesgo hepático',
        'Poliintoxicación con depresores del SNC',
      ],
      pathophysiology:
        'Dosis >150 mg/kg (>7.5-10 g en adultos; aquí ~321 mg/kg) saturan las vías hepáticas de glucuronidación y sulfatación, desviando el paracetamol hacia CYP2E1 y generando el metabolito tóxico NAPQI. Al agotarse el glutatión hepático, el NAPQI provoca necrosis hepatocelular centrolobulillar fulminante si no se administra N-acetilcisteína dentro de las primeras 8 horas.',
      keyClinicalClues: [
        'Ingestión aguda de 18 g (~321 mg/kg) hace 5 horas con náuseas y dolor leve en hipocondrio derecho',
        'Transaminasas aún casi normales en fase temprana (5 h), pero nivel sérico 215 mcg/mL por encima de la línea de Rumack-Matthew',
        'Ventana dorada (<8 h) donde la N-acetilcisteína previene casi el 100% de la necrosis hepática',
      ],
      characteristicSignsSymptoms: [
        'Fase I engañosa (<24 h): náuseas, vómitos y estado de alerta conservado',
        'Nivel de paracetamol por encima de la línea de tratamiento de Rumack-Matthew',
        'Dolor leve en hipocondrio derecho previo a elevación tardía de AST/ALT',
      ],
      criticalRulingOutFactors: [
        'NUNCA esperar elevación de AST/ALT o ictericia para indicar el antídoto: cuando suben las transaminasas el daño necrótico ya ocurrió.',
      ],
      recommendedWorkup: [
        'Nivel sérico de acetaminofén (a partir de las 4 h post-ingesta) para ubicar en nomograma de Rumack-Matthew',
        'AST, ALT, bilirrubinas, INR, creatinina, gasometría/lactato y β-hCG',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'N-Acetilcisteína (NAC) IV (esquema de 21 horas)',
            dose: '150 mg/kg en 200 mL DW5% en 60 min (carga), luego 50 mg/kg en 4 h y 100 mg/kg en 16 h',
            route: 'Intravenosa (IV)',
            frequency: 'Infusión continua protocolizada en 3 etapas (o esquema oral 72 h)',
            duration: '21 horas IV (o hasta confirmar descenso de paracetamol indetectable e INR/transaminasas estables)',
            rationale: 'Precursor de cisteína que restaura las reservas de glutatión hepático y neutraliza directamente el metabolito tóxico NAPQI.',
          },
          {
            drug: 'Ondansetrón IV (si náuseas/vómitos persistentes)',
            dose: '4 mg',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 8 horas por razón necesaria',
            duration: '24 horas',
            rationale: 'Controla emesis asociada a la fase I de intoxicación o a NAC.',
          },
        ],
        generalMeasures: [
          'Iniciar N-acetilcisteína DE INMEDIATO dada la dosis tóxica confirmada (>10 g / >150 mg/kg) y el nivel en nomograma (>125 mcg/mL a las 5 h).',
          'Si hubiera llegado <4 horas de la ingesta, valorar carbón activado 1 g/kg VO (a las 5 h ya es tardío salvo coingesta retardada).',
          'Control seriado de AST/ALT, INR y creatinina al finalizar protocolo + valoración obligatoria por Psiquiatría antes del egreso.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: [
          'Ingreso a UCI y contacto con centro de trasplante hepático si evoluciona a falla hepática aguda (INR >2.0, acidosis láctica o encefalopatía).',
        ],
        followUp: 'Repetir perfil hepático e INR al concluir las 21 h de NAC y seguimiento conjunto con Psiquiatría por riesgo autolesivo.',
      },
      criticalSafetyAlerts: [
        '¡ERROR FATAL!: Dar de alta a la paciente porque "se ve despierta, estable y sus transaminasas de ingreso salieron casi normales": la hepatonecrosis fulminante por paracetamol aparece entre las 24 y 72 horas si se omite la N-acetilcisteína en la ventana temprana.',
      ],
      guidelineReferences: [
        'FDA / AACT / ACMT Clinical Practice Guidance for Acetaminophen Overdose',
        'TOXBASE / Rumack-Matthew Nomogram Protocol',
      ],
    },
    internalPersonaPrompt:
      'Habla como Sofía, estudiante de 22 años. Hace 5 horas te tomaste de golpe 36 pastillas de acetaminofén (paracetamol) de 500 mg porque estabas muy agobiada; vomitaste dos veces y te duele poquito debajo de las costillas del lado derecho, estás asustada y arrepentida.',
  },
  {
    id: 'case-tox-intoxicacion-metanol',
    mode: 'examen',
    specialty: 'toxicologia',
    patientInfo: {
      name: 'Esteban Rodrigo Castellón',
      age: 41,
      sex: 'Masculino',
      occupation: 'Albañil',
      consultReason: 'Visión muy borrosa, respiración agitada y dolor abdominal intenso',
      evolutionTime: '18 horas tras ingesta de licor artesanal',
      currentIllness:
        'Paciente masculino de 41 años que acude con familiares porque desde hace 4 horas empezó a ver sumamente borroso ("como si tuviera una neblina blanca espesa frente a los ojos"), refiere dolor intenso en la boca del estómago, náuseas, dolor de cabeza y respiración muy rápida y profunda. Sus familiares cuentan que anoche estuvo bebiendo abundante licor artesanal sin etiqueta en una reunión; otros conocidos del grupo también se sintieron mal esta mañana.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '92/58 mmHg',
      heartRate: 116,
      respiratoryRate: 30,
      temperature: 36.4,
      oxygenSaturation: 97,
      glasgow: 13,
      bloodGlucose: 102,
      weightKg: 72,
      heightCm: 170,
    },
    background: {
      pathological: ['Consumo episódico de alcohol; niega diabetes mellitus o epilepsia.'],
      nonPathological: ['Bebió licor artesanal sin registro sanitario hace aproximadamente 18 horas.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-tox-metanol-ojos',
        system: 'Cabeza y Cuello',
        name: 'Exploración pupilar, agudeza visual y fondo de ojo',
        finding:
          'Pupilas midriáticas (6 mm) con respuesta lenta o perezosa a la luz. Disminución severa bilateral de la agudeza visual (cuenta dedos a 1 metro). En el fondo de ojo se aprecia hiperemia del disco óptico y borramiento incipiente de bordes papilares (edema retiniano por toxicidad directa).',
        isAbnormal: true,
        semiologyNote:
          'Alteración visual en "tormenta de nieve" + midriasis hiporreactiva + hiperemia papilar tras licor adulterado es altamente característico de metanol.',
      },
      {
        id: 'pe-tox-metanol-resp',
        system: 'Tórax y Pulmones',
        name: 'Patrón respiratorio y auscultación cardiopulmonar',
        finding:
          'Respiración rápida y muy profunda forzada (FR 30 rpm) como compensación de acidosis metabólica grave; campos pulmonares limpios sin estertores.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'lab-tox-metanol-gases',
        category: 'Laboratorio',
        subcategory: 'Gases',
        name: 'Gasometría arterial, Electrolitos y Brecha Aniónica / Osmolar',
        result:
          'pH: 7.11 | PaCO₂: 18 mmHg | HCO₃⁻: 6.0 mEq/L | Lactato: 3.4 mmol/L | Na⁺: 139 mEq/L | Cl⁻: 101 mEq/L | K⁺: 5.1 mEq/L | Brecha Aniónica (Anion Gap): 32 mEq/L | Osmolaridad medida: 342 mOsm/kg (Brecha osmolar: +46 mOsm/kg).',
        referenceRange: 'pH 7.35-7.45 | HCO₃⁻ 22-26 mEq/L | Anion Gap 8-12 mEq/L | Brecha osmolar < 10',
        interpretation: 'Acidosis metabólica severísima con brecha aniónica elevada + brecha osmolar aumentada producida por ácido fórmico y metanol sérico.',
        isAbnormal: true,
      },
      {
        id: 'lab-tox-metanol-quimica',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea completa, Amilasa/Lipasa y Cetonas',
        result:
          'Glucosa: 102 mg/dL | Creatinina: 1.35 mg/dL | Amilasa: 165 U/L | Cetonas séricas: Negativas | Etanol sérico: < 10 mg/dL.',
        referenceRange: 'Glucosa 70-100 mg/dL | Cetonas negativas',
        interpretation: 'Descarta cetoacidosis diabética (glucosa normal, cetonas negativas) e hipoglucemia; explica dolor epigástrico por irritación/pancreatitis química.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Intoxicación Aguda por Metanol (Alcohol Adulterado)',
      differentialDiagnoses: [
        'Cetoacidosis diabética o alcohólica',
        'Intoxicación por etilenglicol',
        'Acidosis láctica por sepsis o choque',
        'Intoxicación por salicilatos',
      ],
      pathophysiology:
        'La enzima alcohol deshidrogenasa (ADH) metaboliza el metanol a formaldehído y luego a ÁCIDO FÓRMICO, el cual inhibe la citocromo c oxidasa mitocondrial provocando acidosis metabólica severa con Anion Gap alto y toxicidad selectiva sobre el nervio óptico y los ganglios basales (putamen), causando ceguera permanente y muerte.',
      keyClinicalClues: [
        'Antecedente de ingesta de licor artesanal 18 horas antes en grupo',
        'Visión en "tormenta de nieve", midriasis perezosa y respiración de Kussmaul',
        'Acidosis metabólica grave (pH 7.11, HCO3 6) con brecha aniónica (32) Y brecha osmolar (+46) elevadas',
      ],
      characteristicSignsSymptoms: [
        'Visión borrosa en tormenta de nieve o escotomas',
        'Acidosis metabólica grave con doble brecha (aniónica + osmolar)',
        'Respiración de Kussmaul e hiperemia del disco óptico',
      ],
      criticalRulingOutFactors: [
        'Glucosa normal y cetonas negativas descartan cetoacidosis diabética.',
        'La afectación visual aguda es distintiva del metanol (ácido fórmico) frente al etilenglicol (cristales renales de oxalato).',
      ],
      recommendedWorkup: [
        'Gasometría arterial inmediata, electrolitos para calcular Anion Gap y osmolaridad medida/calculada',
        'Niveles de metanol/etanol si disponibles (NO retrasar antídoto esperando resultado)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Etanol IV (o Fomepizol IV como inhibidor competitivo de ADH)',
            dose: 'Etanol 10% IV: carga 8-10 mL/kg (0.8 g/kg) en 30-60 min, luego infusión 1-2 mL/kg/h (o Fomepizol 15 mg/kg IV carga)',
            route: 'Intravenosa (IV)',
            frequency: 'Carga STAT seguida de mantenimiento continuo hasta metanol indetectable',
            duration: '24 a 72 horas (ajustado según hemodiálisis)',
            rationale: 'Bloquea competitivamente la enzima alcohol deshidrogenasa impidiendo que el metanol siga convirtiéndose en ácido fórmico neurotóxico.',
          },
          {
            drug: 'Bicarbonato de Sodio IV',
            dose: '1 a 2 mEq/kg (50 a 100 mEq)',
            route: 'Intravenosa (IV)',
            frequency: 'En bolo lento / infusión para mantener pH arterial > 7.20 - 7.30',
            duration: 'Hasta corrección de acidemia severa',
            rationale: 'Alcaliniza la sangre favoreciendo la forma ionizada del ácido fórmico (formato), reduciendo su entrada al nervio óptico y cerebro.',
          },
          {
            drug: 'Ácido Folínico (Leucovorina) o Ácido Fólico IV',
            dose: 'Ácido folínico 50 mg IV (o Ácido fólico 50 mg IV)',
            route: 'Intravenosa (IV)',
            frequency: 'Cada 4 a 6 horas',
            duration: '48 a 72 horas',
            rationale: 'Cofactor metabólico que acelera la conversión del ácido fórmico tóxico en CO₂ y agua.',
          },
        ],
        generalMeasures: [
          'Hemodiálisis urgente de emergencia (indicada por pH <7.25, alteración visual y brecha aniónica/osmolar extrema) para depurar metanol y ácido fórmico.',
          'Monitorización intensiva continua en UCI, vía aérea protegida si deterioro de Glasgow y corrección electrolítica.',
          'Notificar a salud pública/epidemiología por riesgo de brote comunitario de licor adulterado.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: [
          'Activación inmediata de Nefrología para hemodiálisis de urgencia e ingreso a UCI.',
        ],
        followUp: 'Control gasométrico horario en UCI, valoración oftalmológica y seguimiento neurológico tras depuración.',
      },
      criticalSafetyAlerts: [
        '¡EMERGENCIA TOXICOLÓGICA LETAL!: Retrasar el bloqueo de la alcohol deshidrogenasa (Etanol IV o Fomepizol) y la hemodiálisis mientras se espera confirmación de laboratorio o tratando solo con hidratación condena a ceguera bilateral permanente y muerte por acidosis.',
      ],
      guidelineReferences: [
        'EXTRIP Workgroup Recommendations for Extracorporeal Treatment of Methanol Poisoning',
        'AACT Practice Guidelines on the Treatment of Methanol Poisoning',
      ],
    },
    internalPersonaPrompt:
      'Habla como Esteban, albañil de 41 años. Estás cansado, respiras rápido y te cuesta ver porque ves todo blanco como una neblina espesa frente a los ojos; te duele mucho la boca del estómago y tomaste guaro artesanal anoche con unos compañeros.',
  },
];
