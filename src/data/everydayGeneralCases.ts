import { ClinicalCase } from '../types/clinical';

/**
 * Biblioteca de 18 casos clínicos cotidianos de la vida diaria para la modalidad
 * Médico General (atención primaria, consulta externa y guardia de primer contacto),
 * cubriendo motivos de consulta frecuentes con lenguaje coloquial del paciente y
 * manejo basado en guías clínicas OMS / OPS / MINSA / NICE / IDSA.
 */
export const EVERYDAY_GENERAL_CASES: ClinicalCase[] = [
  {
    id: 'case-mg-resfriado',
    mode: 'medico_general',
    specialty: 'infectologia',
    patientInfo: {
      name: 'Camila Fernanda Rojas',
      age: 26,
      sex: 'Femenino',
      occupation: 'Maestra de preescolar',
      consultReason: 'Malestar respiratorio leve y congestión nasal',
      evolutionTime: '3 días de evolución',
      currentIllness:
        'Paciente femenina de 26 años que acude por cuadro de 3 días de evolución iniciado con cosquilleo y ardor leve en la garganta, seguido al día siguiente por nariz tapada, salida de moco claro abundante, estornudos frecuentes, lagrimeo ligero y febrícula de 37.5°C ayer por la tarde. Hoy refiere tos seca ocasional irritativa y malestar general leve. Niega falta de aire, dolor de pecho, fiebre alta o dolor facial intenso.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 37.3,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 60,
      heightCm: 163,
    },
    background: {
      pathological: ['Sana previamente; 2 a 3 catarros leves al año por contacto escolar.'],
      nonPathological: ['No fuma, no consume alcohol. Convive diariamente con niños en aula cerrada.'],
      family: ['Sin antecedentes familiares de relevancia.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó té con miel y una tableta de paracetamol ayer por la noche.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-nariz-resfriado',
        system: 'Cabeza y Cuello',
        name: 'Rinoscopia anterior, orofaringe y senos paranasales',
        finding:
          'Mucosa nasal edematosa y eritematosa con rinorrea hialina abundante. Orofaringe levemente hiperémica sin exudado ni placas purulentas amigdalinas. Senos frontales y maxilares indoloros a la digitopresión. Sin adenopatías cervicales dolorosas.',
        isAbnormal: true,
        semiologyNote: 'Rinorrea hialina con orofaringe sin exudado orienta francamente a infección viral de vía aérea superior.',
      },
      {
        id: 'pe-torax-resfriado',
        system: 'Tórax y Pulmones',
        name: 'Auscultación cardiopulmonar completa',
        finding:
          'Murmullo vesicular limpio y simétrico en ambos hemotórax, sin sibilancias, roncus ni crepitantes. Ruidos cardíacos rítmicos sin soplos.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-resfriado',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 13.6 g/dL | Leucocitos: 7,400 /mm³ (Linfocitos 42%, Neutrófilos 50%) | Plaquetas: 255,000 /mm³.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³',
        interpretation: 'Recuento leucocitario normal con discreto predominio linfocítico compatible con infección viral autolimitada (en la práctica clínica no requiere exámenes de rutina).',
        isAbnormal: false,
      },
      {
        id: 'lab-strep-resfriado',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Prueba rápida de antígeno estreptocócico faríngeo',
        result: 'NEGATIVO para Streptococcus pyogenes.',
        referenceRange: 'Negativo',
        interpretation: 'Descarta faringoamigdalitis bacteriana estreptocócica.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Rinofaringitis Aguda Viral (Resfriado Común)',
      differentialDiagnoses: [
        'Rinitis alérgica estacional',
        'Faringoamigdalitis aguda estreptocócica',
        'Rinosinusitis bacteriana aguda',
        'Influenza estacional leve',
      ],
      pathophysiology:
        'Infección viral autolimitada de la mucosa nasal y faríngea (principalmente por rinovirus o coronavirus endémicos) que induce vasodilatación local, hipersecreción mucosa hialina y reflejo de estornudo/tos sin invasión bacteriana profunda.',
      keyClinicalClues: [
        'Rinorrea acuosa, congestión nasal, estornudos y odinofagia leve de 3 días tras exposición escolar',
        'Ausencia de fiebre alta, exudado amigdalino o dolor sinusal',
        'Campos pulmonares limpios y signos vitales estables',
      ],
      characteristicSignsSymptoms: [
        'Congestión nasal y rinorrea clara',
        'Estornudos frecuentes y lagrimeo leve',
        'Tos seca irritativa por goteo postnasal',
      ],
      criticalRulingOutFactors: [
        'Sin exudado amigdalino ni adenopatías dolorosas (Centor <2), descartando etiología estreptocócica.',
        'Evolución <5 días sin dolor facial severo ni doble empeoramiento, descartando sinusitis bacteriana.',
      ],
      recommendedWorkup: [
        'Diagnóstico eminentemente clínico; no requiere radiografías ni antibiograma de rutina',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Paracetamol',
            dose: '500 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas por razón necesaria si fiebre o malestar',
            duration: '3 a 5 días',
            rationale: 'Alivio seguro de cefalea leve, febrícula y malestar faríngeo.',
          },
          {
            drug: 'Solución salina nasal isotónica (lavados nasales)',
            dose: '2 atomizaciones en cada fosa nasal',
            route: 'Nasal tópica',
            frequency: 'Cada 6 a 8 horas',
            duration: '5 a 7 días',
            rationale: 'Descongestiona mecánicamente la mucosa sin riesgo de rinitis medicamentosa.',
          },
        ],
        generalMeasures: [
          'Hidratación oral abundante y reposo relativo.',
          'Lavado frecuente de manos y uso de pañuelos desechables para cortar transmisión en aula.',
          'Explicar que el cuadro viral se autolimita en 7 a 10 días y NO requiere antibióticos.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir si aparece fiebre >38.5°C persistente, dificultad para respirar o dolor facial/auricular intenso después de 7-10 días.',
        ],
        followUp: 'Revaloración solo si los síntomas empeoran tras el día 5 o persisten más allá de 10 días sin mejoría.',
      },
      criticalSafetyAlerts: [
        'NO prescribir antibióticos (amoxicilina, azitromicina, cefalosporinas) en rinofaringitis viral no complicada: fomenta resistencia antimicrobiana y efectos adversos sin acortar la enfermedad.',
        'Evitar descongestionantes tópicos como oximetazolina por más de 3 días para prevenir congestión de rebote.',
      ],
      guidelineReferences: [
        'NICE Guideline CG69: Respiratory Tract Infections (Self-Limiting) — Antibiotic Prescribing',
        'Guía Práctica Clínica de Infecciones Respiratorias Agudas en Primer Nivel (OPS/MINSA)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Camila, maestra de 26 años con gripa común desde hace 3 días: nariz tapada, moco agüita, estornudos y garganta algo raspada.',
  },
  {
    id: 'case-mg-sinusitis',
    mode: 'medico_general',
    specialty: 'infectologia',
    patientInfo: {
      name: 'Héctor Mauricio Delgado',
      age: 38,
      sex: 'Masculino',
      occupation: 'Chofer de reparto',
      consultReason: 'Congestión nasal y dolor facial',
      evolutionTime: '12 días de evolución',
      currentIllness:
        'Paciente masculino de 38 años que comenzó hace 12 días con una gripa común que parecía ir mejorando al quinto día, pero desde hace 48 horas volvió a empeorar con dolor y pesadez intensa en ambos pómulos (más en el derecho) y entre los ojos, que aumenta mucho al agacharse a recoger cajas. Refiere salida de moco espeso verdoso-amarillento, sensación de nariz completamente tapada, febrícula de 38.1°C, mal aliento y dolor en las muelas superiores derechas.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '124/78 mmHg',
      heartRate: 86,
      respiratoryRate: 17,
      temperature: 38.0,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 96,
      weightKg: 81,
      heightCm: 175,
    },
    background: {
      pathological: ['Rinitis alérgica leve intermitente sin tratamiento regular.'],
      nonPathological: ['Fuma 4 cigarrillos al día desde hace 10 años; niega consumo excesivo de alcohol.'],
      family: ['Padre hipertenso controlado.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó ibuprofeno 400 mg ayer con alivio temporal del dolor facial.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-senos-sinusitis',
        system: 'Cabeza y Cuello',
        name: 'Palpación de senos paranasales y rinoscopia anterior',
        finding:
          'Dolor marcado a la digitopresión sobre el seno maxilar derecho y región malar ipsilateral que empeora al inclinar la cabeza hacia adelante. Edema intenso de cornetes inferiores con secreción mucopurulenta espesa en meato medio derecho y descarga retronasal purulenta en faringe.',
        isAbnormal: true,
        semiologyNote: 'El signo de "doble empeoramiento" (>10 días o recaída tras mejoría inicial) con dolor maxilar unilateral y descarga purulenta define rinosinusitis bacteriana aguda.',
      },
      {
        id: 'pe-ojos-sinusitis',
        system: 'Cabeza y Cuello',
        name: 'Inspección orbitaria y movimientos oculares',
        finding:
          'Párpados sin eritema ni edema periorbitario. Movimientos oculares conservados en todas las direcciones sin dolor ni diplopía; agudeza visual íntegra.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-sinusitis',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 15.0 g/dL | Leucocitos: 12,800 /mm³ (Neutrófilos 76%) | Plaquetas: 270,000 /mm³.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³',
        interpretation: 'Leucocitosis discreta con neutrofilia acorde a sobreinfección bacteriana sinusal.',
        isAbnormal: true,
      },
      {
        id: 'lab-pcr-sinusitis',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'Proteína C Reactiva (PCR) cuantitativa',
        result: 'PCR: 34 mg/L.',
        referenceRange: '< 5 mg/L',
        interpretation: 'Elevación inflamatoria moderada compatible con proceso bacteriano localizado.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Rinosinusitis Bacteriana Aguda Maxilar',
      differentialDiagnoses: [
        'Rinofaringitis aguda viral prolongada',
        'Rinitis alérgica exacerbada',
        'Odontalgia / absceso apical maxilar superior',
        'Cefalea en racimos o migraña',
      ],
      pathophysiology:
        'Tras una infección viral previa se edematiza el complejo ostiomeatal, bloqueando el drenaje del seno maxilar; la estasis de secreciones permite sobreinfección bacteriana (Streptococcus pneumoniae, Haemophilus influenzae o Moraxella catarrhalis) generando presión sinusal, rinorrea purulenta y dolor referido dental.',
      keyClinicalClues: [
        'Síntomas nasosinusales >10 días con "doble empeoramiento" y fiebre reciente',
        'Dolor facial maxilar que empeora al agacharse y odontalgia maxilar referida',
        'Secreción purulenta en meato medio con integridad orbitaria',
      ],
      characteristicSignsSymptoms: [
        'Dolor y presión malar que aumenta al inclinarse',
        'Rinorrea purulenta espesa y descarga retronasal',
        'Evolución >10 días o empeoramiento bifásico',
      ],
      criticalRulingOutFactors: [
        'Ausencia de edema palpebral, proptosis o limitación ocular descarta celulitis orbitaria.',
        'Ausencia de cefalea intensa con rigidez de nuca descarta complicación intracraneal.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico por criterios temporales (síntomas ≥10 días o doble empeoramiento)',
        'No se recomienda radiografía simple de senos de rutina; reservar TAC solo si hay sospecha de complicación orbitaria/intracraneal',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Amoxicilina / Ácido Clavulánico',
            dose: '875 mg / 125 mg (o Amoxicilina 500 mg cada 8 h)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '5 a 7 días',
            rationale: 'Primera línea empírica contra S. pneumoniae y H. influenzae productores de betalactamasa en adulto con tabaquismo/empeoramiento.',
          },
          {
            drug: 'Lavados nasales con solución salina + Paracetamol o Ibuprofeno',
            dose: 'Lavados c/6 h + Paracetamol 500 mg',
            route: 'Nasal / Vía Oral',
            frequency: 'Cada 8 horas por 5 días',
            duration: '5 a 7 días',
            rationale: 'Favorece drenaje mucociliar ostiomeatal y controla dolor facial y fiebre.',
          },
        ],
        generalMeasures: [
          'Hidratación oral y vahos o lavados nasales con suero fisiológico varias veces al día.',
          'Evitar humo de tabaco y cambios bruscos de temperatura.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Urgencias inmediatas si aparece hinchazón/enrojecimiento del párpado, visión doble, dolor ocular o dolor de cabeza severo con fiebre alta.',
        ],
        followUp: 'Reevaluar en 48-72 horas si no cede la fiebre o el dolor facial.',
      },
      criticalSafetyAlerts: [
        'Vigilar siempre signos de alarma orbitaria (edema periorbitario, limitación de mirada) o meníngea.',
        'Evitar el uso de corticoides sistémicos orales como monoterapia sin cobertura adecuada o abuso de vasoconstrictores tópicos >3 días.',
      ],
      guidelineReferences: [
        'IDSA Clinical Practice Guideline for Acute Bacterial Rhinosinusitis',
        'EPOS 2020 European Position Paper on Rhinosinusitis and Nasal Polyps',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Héctor, chofer de 38 años con dolor pesado en la cara que empeora al agacharse y moco verde espeso desde hace 12 días.',
  },
  {
    id: 'case-mg-conjuntivitis',
    mode: 'medico_general',
    specialty: 'medicina_interna',
    patientInfo: {
      name: 'Valeria Patricia Mendoza',
      age: 31,
      sex: 'Femenino',
      occupation: 'Contadora pública',
      consultReason: 'Enrojecimiento y molestia en ojo derecho',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente femenina de 31 años que consulta por presentar desde hace 48 horas enrojecimiento marcado en el ojo derecho con sensación de arenilla y abundante secreción espesa amarillo-verdosa. Refiere que hoy amaneció con los párpados completamente pegados y el ojo izquierdo empezó a ponerse algo rosado esta mañana. Niega dolor ocular profundo, pérdida o disminución de la visión, fotofobia intensa o trauma/cuerpo extraño previo.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '114/72 mmHg',
      heartRate: 74,
      respiratoryRate: 15,
      temperature: 36.8,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 61,
      heightCm: 162,
    },
    background: {
      pathological: ['Niega enfermedades oculares crónicas o diabetes.'],
      nonPathological: ['No usa lentes de contacto; su sobrino de 4 años tuvo infección en los ojos hace pocos días.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno; únicamente se lavó con manzanilla hoy sin mejoría.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-ojo-conjuntivitis',
        system: 'Cabeza y Cuello',
        name: 'Exploración ocular externa, agudeza visual y pupilas',
        finding:
          'Hiperemia conjuntival difusa marcada en ojo derecho (y leve en izquierdo) con secreción mucopurulenta abundante en fondo de saco inferior y costras en pestañas. Córneas transparentes sin opacidades ni captación patológica con fluoresceína. Pupilas isocóricas normorreactivas (3 mm). Agudeza visual conservada (20/20 bilateral tras limpiar secreción).',
        isAbnormal: true,
        semiologyNote: 'Secreción mucopurulenta con párpados adheridos, córnea transparente y agudeza visual normal confirman conjuntivitis bacteriana no complicada.',
      },
      {
        id: 'pe-orofaringe-conjuntivitis',
        system: 'Cabeza y Cuello',
        name: 'Palpación preauricular y orofaringe',
        finding:
          'Sin adenopatía preauricular palpable ni síntomas catarrales faríngeos.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-visual-conjuntivitis',
        category: 'Gabinete y Trazados',
        subcategory: 'Función Pulmonar y Audiología',
        name: 'Evaluación de agudeza visual (Snellen) y luz focal con fluoresceína',
        result: 'Agudeza visual OD 20/20, OI 20/20. Tinción con fluoresceína negativa para defectos epiteliales o úlcera corneal.',
        referenceRange: 'AV 20/20, córnea sin captación',
        interpretation: 'Descarta queratitis, abrasión o úlcera corneal.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Conjuntivitis Aguda Bacteriana',
      differentialDiagnoses: [
        'Conjuntivitis viral (adenovirus)',
        'Conjuntivitis alérgica aguda',
        'Queratitis o úlcera corneal',
        'Glaucoma agudo de ángulo cerrado / uveítis anterior',
      ],
      pathophysiology:
        'Infección superficial de la conjuntiva tarsal y bulbar (frecuentemente por Staphylococcus aureus, Streptococcus pneumoniae o Haemophilus influenzae) por contacto mano-ojo contaminado; produce respuesta neutrofílica con exudado mucopurulento e hiperemia conjuntival sin afección corneal ni intraocular.',
      keyClinicalClues: [
        'Ojo rojo con abundante secreción purulenta y párpados pegados al despertar',
        'Sensación de arenilla sin dolor ocular profundo ni fotofobia severa',
        'Agudeza visual 20/20 conservada, pupilas reactivas y fluoresceína negativa',
      ],
      characteristicSignsSymptoms: [
        'Hiperemia conjuntival difusa',
        'Lagañas espesas amarillo-verdosas que pegan las pestañas',
        'Ausencia de disminución visual o dolor intenso',
      ],
      criticalRulingOutFactors: [
        'Agudeza visual conservada, pupilas normorreactivas y ausencia de dolor intenso descartan glaucoma agudo, uveítis o queratitis.',
      ],
      recommendedWorkup: [
        'Exploración de agudeza visual y descartar compromiso corneal con fluoresceína; el cultivo conjuntival solo se reserva para casos graves, neonatales o refractarios',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Tobramicina o Ciprofloxacino oftálmico al 0.3% (gotas)',
            dose: '1 gota en ambos ojos',
            route: 'Oftálmica tópica',
            frequency: 'Cada 4 horas mientras esté despierta',
            duration: '5 a 7 días',
            rationale: 'Antibiótico tópico de primera línea en atención primaria que acelera la curación clínica y reduce contagio.',
          },
          {
            drug: 'Lágrimas artificiales / lavado suave con solución salina estéril',
            dose: '1 a 2 gotas en cada ojo (o lavado estéril suave con gasa)',
            route: 'Oftálmica',
            frequency: 'Cada 6 a 8 horas antes de aplicar las gotas',
            duration: '5 días',
            rationale: 'Mantiene higiene ocular y evita maceración palpebral (suspender remedios caseros como infusiones).',
          },
        ],
        generalMeasures: [
          'Higiene estricta de manos antes y después de tocar el rostro; no compartir toallas, fundas de almohada ni maquillaje.',
          'Suspender infusiones caseras o manzanilla en el ojo por riesgo de contaminación.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración oftalmológica urgente si aparece dolor ocular intenso, disminución de visión, sensibilidad severa a la luz o falta de mejoría en 48-72 h.',
        ],
        followUp: 'Control en 3 días solo si no hay mejoría clínica o si empeora el enrojecimiento.',
      },
      criticalSafetyAlerts: [
        'NUNCA prescribir colirios con corticosteroides (dexametasona/prednisolona) en ojo rojo de primer nivel sin descartar infección herpética o úlcera corneal: pueden provocar perforación corneal.',
      ],
      guidelineReferences: [
        'American Academy of Ophthalmology (AAO) Conjunctivitis Preferred Practice Pattern',
        'Guía de Práctica Clínica de Diagnóstico y Tratamiento de Conjuntivitis en Primer Nivel',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Valeria, mujer de 31 años con el ojo bien rojo y lleno de lagañas amarillas espesas que le pegaron las pestañas en la mañana.',
  },
  {
    id: 'case-mg-gastritis',
    mode: 'medico_general',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Jorge Luis Navarro',
      age: 35,
      sex: 'Masculino',
      occupation: 'Ejecutivo de ventas',
      consultReason: 'Dolor y ardor en la parte alta del abdomen',
      evolutionTime: '5 días de evolución',
      currentIllness:
        'Paciente masculino de 35 años que acude por ardor y dolor urente localizado en la boca del estómago (epigastrio) desde hace 5 días. Refiere que la molestia empeora cuando pasa muchas horas sin comer en la oficina o después de tomar café negro, refrescos de cola o comida muy condimentada, y mejora temporalmente al comer algo suave o tomar leche. Presenta eructos ocasionales y sensación de llenura rápida. Niega vómitos con sangre, heces negras como chapopote, pérdida de peso o dolor que se vaya a la espalda.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 76,
      heightCm: 174,
    },
    background: {
      pathological: ['Episodios similares leves en épocas de cierre laboral; niega úlcera diagnosticada.'],
      nonPathological: ['Toma 3 a 4 tazas de café al día en ayunas, come a deshoras, consumo ocasional de picante y alcohol los fines de semana.'],
      family: ['Padre hipertenso controlado; madre sana.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó un antiácido masticable hoy con alivio parcial durante 1 hora.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-abdomen-gastritis',
        system: 'Abdomen',
        name: 'Palpación abdominal y búsqueda de signos peritoneales',
        finding:
          'Abdomen blando, depresible, con dolor leve-moderado bien localizado a la palpación profunda en epigastrio, sin irradiación dorsal ni hacia hipocondrio derecho. Sin paro inspiratorio doloroso en cuadrante superior derecho, sin dolor a la descompresión brusca y ruidos peristálticos normales.',
        isAbnormal: true,
        semiologyNote: 'Epigastralgia localizada sin defensa ni datos de irritación peritoneal o sangrado digestivo.',
      },
      {
        id: 'pe-cardio-gastritis',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y perfusión',
        finding:
          'Ruidos cardíacos rítmicos de buen tono sin soplos; mucosas hidratadas y buen llenado capilar.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-gastritis',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 14.9 g/dL | Hematocrito: 44% | Leucocitos: 6,800 /mm³ | Plaquetas: 242,000 /mm³.',
        referenceRange: 'Hb 13.5-17.5 g/dL',
        interpretation: 'Sin anemia ni signos de sangrado digestivo oculto o agudo.',
        isAbnormal: false,
      },
      {
        id: 'lab-hpylori-gastritis',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Antígeno de Helicobacter pylori en heces',
        result: 'NEGATIVO.',
        referenceRange: 'Negativo',
        interpretation: 'Sin evidencia actual de infección activa por H. pylori (en caso de persistir >4 semanas se revalora).',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Gastritis Aguda / Dispepsia Funcional',
      differentialDiagnoses: [
        'Enfermedad por reflujo gastroesofágico (ERGE)',
        'Úlcera péptica no complicada',
        'Cólico biliar / colecistitis',
        'Pancreatitis aguda leve',
      ],
      pathophysiology:
        'Desequilibrio agudo entre los factores agresores de la mucosa gástrica (ácido clorhídrico, cafeína, ayunos prolongados y estrés) y los mecanismos defensivos mucosos (moco, bicarbonato y flujo sanguíneo), generando inflamación superficial y dolor epigástrico urente.',
      keyClinicalClues: [
        'Dolor ardoroso en epigastrio agravado por ayuno, café y condimentos',
        'Ausencia de signos de alarma (sin hematemesis, melena, disfagia ni pérdida de peso)',
        'Hemoglobina normal y abdomen blando sin Murphy ni rebote',
      ],
      characteristicSignsSymptoms: [
        'Ardor epigástrico ("en la boca del estómago")',
        'Saciedad temprana y eructos leves',
        'Relación clara con irritantes gástricos y ayuno',
      ],
      criticalRulingOutFactors: [
        'Ausencia de melena, hematemesis y anemia descarta hemorragia digestiva alta.',
        'Signo de Murphy negativo y dolor no opresivo torácico alejan colecistitis y síndrome coronario.',
      ],
      recommendedWorkup: [
        'En <55 años sin signos de alarma: manejo empírico de prueba y prueba no invasiva de H. pylori si recurre; la endoscopia se reserva para signos de alarma o falla terapéutica',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Omeprazol',
            dose: '20 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (30 minutos antes del desayuno)',
            duration: '4 semanas',
            rationale: 'Inhibidor de bomba de protones de primera elección para suprimir secreción ácida y permitir cicatrización mucosa.',
          },
          {
            drug: 'Hidróxido de aluminio y magnesio (antiácido) o Sucralfato',
            dose: '10 a 15 mL',
            route: 'Vía Oral',
            frequency: 'Después de las comidas y antes de dormir solo si ardor puntual',
            duration: '7 a 14 días',
            rationale: 'Alivio sintomático rápido de la acidez gástrica aguda.',
          },
        ],
        generalMeasures: [
          'Establecer horarios regulares de alimentación (evitar ayunos >4-5 horas).',
          'Suspender café en ayunas, refrescos gaseosos, picante, cítricos muy ácidos, alcohol y automedicación con AINEs.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir de inmediato si presenta vómito con sangre o en pozos de café, heces negras, dificultad para tragar o pérdida involuntaria de peso.',
        ],
        followUp: 'Revaloración en 4 semanas; si no hay respuesta o hay recurrencia, investigar H. pylori o considerar endoscopia.',
      },
      criticalSafetyAlerts: [
        'NO indicar AINEs (ibuprofeno, naproxeno, diclofenaco o ketorolaco) para el dolor epigástrico ni combinar innecesariamente fármacos gastrolesivos.',
        'Descartar siempre síndrome coronario agudo en pacientes >45 años o con factores de riesgo cardiovasculares antes de etiquetar epigastralgia como gastritis.',
      ],
      guidelineReferences: [
        'ACG / CAG Clinical Guideline on Management of Dyspepsia',
        'Guía de Práctica Clínica de Dispepsia y Gastritis Aguda en Primer Nivel',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Jorge, hombre de 35 años que trabaja en ventas y trae un ardor molesto en la boca del estómago por tomar mucho café y malpasarse con las comidas.',
  },
  {
    id: 'case-mg-disenteria',
    mode: 'medico_general',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Ricardo Antonio Pineda',
      age: 29,
      sex: 'Masculino',
      occupation: 'Técnico en telecomunicaciones',
      consultReason: 'Evacuaciones frecuentes, dolor abdominal y fiebre',
      evolutionTime: '28 horas de evolución',
      currentIllness:
        'Paciente masculino de 29 años que consulta por 7 evacuaciones líquidas con moco y estrías de sangre roja fresca en las últimas 24 horas, acompañadas de cólicos abdominales intensos en la parte baja, ganas urgentes de seguir evacuando aunque ya no salga nada (tenesmo) y fiebre de 38.4°C. Refiere haber comido coctel de mariscos y pollo en un puesto ambulante hace 2 días. Tolera líquidos a sorbos pequeños sin vómitos incoercibles.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '112/72 mmHg',
      heartRate: 96,
      respiratoryRate: 18,
      temperature: 38.3,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 74,
      heightCm: 173,
    },
    background: {
      pathological: ['Sano previamente.'],
      nonPathological: ['Consumo frecuente de alimentos en vía pública durante su jornada laboral.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Tomó un poco de suero casero hoy; niega antibióticos o antidiarreicos previos.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-general-disenteria',
        system: 'General',
        name: 'Estado de hidratación y mucosas',
        finding:
          'Paciente febril, consciente y cooperador. Mucosas orales discretamente secas, ojos no hundidos, signo del pliegue cutáneo negativo y llenado capilar de 2 segundos (deshidratación leve).',
        isAbnormal: true,
      },
      {
        id: 'pe-abdomen-disenteria',
        system: 'Abdomen',
        name: 'Auscultación y palpación abdominal',
        finding:
          'Peristalsis aumentada (hiperperistaltismo con borborigmos frecuentes). Dolor cólico difuso a la palpación media en marco cólico e hipogastrio, sin defensa muscular ni dolor a la descompresión brusca.',
        isAbnormal: true,
        semiologyNote: 'Síndrome disentérico (diarrea con sangre, moco, fiebre y tenesmo) sin abdomen agudo quirúrgico.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-copro-disenteria',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Citología fecal (moco fecal / leucocitos en heces) y coprocultivo',
        result: 'Leucocitos fecales abundantes (>25 por campo, predominio polimorfonuclear), eritrocitos presentes, moco positivo. Coprocultivo procesado en espera de tipificación microbiológica.',
        referenceRange: 'Leucocitos fecales ausentes o <3/campo',
        interpretation: 'Confirma diarrea aguda invasiva / inflamatoria bacteriana.',
        isAbnormal: true,
      },
      {
        id: 'lab-bh-disenteria',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y Electrolitos Séricos',
        result: 'Leucocitos: 13,200 /mm³ (Neutrófilos 78%) | Hb: 14.8 g/dL | Na⁺: 138 mEq/L | K⁺: 3.8 mEq/L | Creatinina: 0.9 mg/dL.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | K⁺ 3.5-5.0 mEq/L',
        interpretation: 'Leucocitosis inflamatoria con función renal y electrolitos preservados.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Gastroenteritis Aguda Invasiva (Disentería Bacteriana)',
      differentialDiagnoses: [
        'Gastroenteritis viral aguda',
        'Amebiasis intestinal invasiva (Entamoeba histolytica)',
        'Brote de colitis ulcerosa inflamatoria',
        'Apendicitis aguda atípica',
      ],
      pathophysiology:
        'Ingesta de patógenos bacterianos enteroinvasivos (como Shigella spp. o Campylobacter jejuni) en alimentos contaminados que invaden el epitelio colónico, produciendo necrosis mucosa superficial, exudado leucocitario, moco, estrías hemáticas, tenesmo rectal y fiebre.',
      keyClinicalClues: [
        'Evacuaciones con moco y sangre + fiebre + pujo y tenesmo tras ingesta alimentaria de riesgo',
        'Deshidratación leve sin inestabilidad hemodinámica ni rebote abdominal',
        'Abundantes leucocitos polimorfonucleares en moco fecal',
      ],
      characteristicSignsSymptoms: [
        'Diarrea mucosanguinolenta',
        'Fiebre y cólicos en bajo vientre',
        'Tenesmo rectal intenso',
      ],
      criticalRulingOutFactors: [
        'Blumberg negativo descarta perforación o peritonitis quirúrgica.',
        'Signos vitales estables y tolerancia oral permiten manejo ambulatorio con rehidratación oral.',
      ],
      recommendedWorkup: [
        'Moco fecal / leucocitos en heces y coprocultivo en diarrea disentérica febril',
        'Electrolitos y función renal si hay deshidratación moderada',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sales de Rehidratación Oral (Vida Suero Oral / SRO hipoosmolares)',
            dose: '200 a 250 mL después de cada evacuación líquida',
            route: 'Vía Oral',
            frequency: 'Tras cada evacuación líquida y a tolerancia fraccionada',
            duration: '3 a 5 días (mientras persista la diarrea)',
            rationale: 'Pilar terapéutico fundamental OMS/OPS para prevenir choque hipovolémico.',
          },
          {
            drug: 'Azitromicina (o Ciprofloxacino según sensibilidad local)',
            dose: '500 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '3 días',
            rationale: 'En diarrea disentérica bacteriana febril con leucocitos fecales positivos acorta duración, síntomas y excreción bacteriana (IDSA).',
          },
        ],
        generalMeasures: [
          'Dieta astringente blanda sin lácteos ni irritantes mientras mejoran las evacuaciones.',
          'Lavado de manos estricto y evitar preparar alimentos para otras personas hasta resolver el cuadro.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si presenta intolerancia total a líquidos, mareo al ponerse de pie, ausencia de orina >8 horas o sangrado rectal abundante.',
        ],
        followUp: 'Revaloración en 48 horas con resultado de coprocultivo o antes si persiste fiebre.',
      },
      criticalSafetyAlerts: [
        '¡CONTRAINDICADO prescribir antidiarreicos inhibidores de motilidad (Loperamida / Difenoxilato) en disentería febril con sangre!: prolongan la retención de toxinas y aumentan riesgo de megacolon tóxico y perforación.',
      ],
      guidelineReferences: [
        'IDSA Infectious Diarrhea Clinical Practice Guidelines',
        'OMS/OPS Tratamiento de la Diarrea: Manual Clínico para Servicios de Salud',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Ricardo, técnico de 29 años con diarrea con moco y poquita sangre, fiebre y retorcijones fuertes tras comer mariscos en la calle.',
  },
  {
    id: 'case-mg-dermatitis-atopica',
    mode: 'medico_general',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Sofía Isabel Jiménez',
      age: 19,
      sex: 'Femenino',
      occupation: 'Estudiante de diseño',
      consultReason: 'Lesiones en la piel con mucha picazón',
      evolutionTime: '3 semanas de evolución',
      currentIllness:
        'Paciente femenina de 19 años que consulta por empeoramiento desde hace 3 semanas de manchas rojas muy resecas y con comezón intensa en la parte interna de ambos codos, detrás de las rodillas y en el cuello. Cuenta que de niña tuvo "piel muy delicada" y rinitis alérgica, pero en las últimas semanas con el frío, baños con agua muy caliente y jabón perfumado nuevo la piel se le agrietó y le pica mucho sobre todo en la noche. Niega fiebre o salida de pus.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 74,
      respiratoryRate: 15,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 86,
      weightKg: 55,
      heightCm: 161,
    },
    background: {
      pathological: ['Rinitis alérgica estacional desde los 10 años; brotes cutáneos similares en la infancia.'],
      nonPathological: ['Se baña con agua muy caliente y usa jabones perfumados y ropa de poliéster ajustada.'],
      family: ['Sin antecedentes heredofamiliares de relevancia.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Se ha aplicado cremas perfumadas comerciales que le arden al aplicarlas.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-piel-atopica',
        system: 'Osteomuscular y Piel',
        name: 'Inspección dermatológica de pliegues flexores y piel general',
        finding:
          'Placas eritematosas mal delimitadas con xerosis marcada, descamación fina, excoriaciones lineales por rascado y liquenificación discreta simétrica en fosas antecubitales, huecos poplíteos y región anterior del cuello. Sin costras melicéricas, pústulas ni signos de celulitis.',
        isAbnormal: true,
        semiologyNote: 'Distribución flexural simétrica, xerosis, liquenificación y antecedente atópico personal/familiar cumplen criterios de Hanifin-Rajka.',
      },
      {
        id: 'pe-general-atopica',
        system: 'General',
        name: 'Signos sistémicos e inspección general',
        finding:
          'Paciente afebril, sin adenopatías inflamatorias infecciosas ni lesiones mucosas.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-atopica',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 13.4 g/dL | Leucocitos: 7,100 /mm³ (Eosinófilos 6%) | Plaquetas: 260,000 /mm³.',
        referenceRange: 'Eosinófilos 1-4%',
        interpretation: 'Eosinofilia leve acorde con diátesis atópica sin infección sistémica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Dermatitis Atópica (Brote Leve-Moderado)',
      differentialDiagnoses: [
        'Dermatitis de contacto alérgica o irritativa',
        'Escabiosis (sarna)',
        'Tiña corporal (dermatofitosis)',
        'Psoriasis en placas',
      ],
      pathophysiology:
        'Alteración genética y adquirida de la barrera epidérmica (deficiencia de filagrina y ceramidas) que permite pérdida transepidérmica de agua y entrada de alérgenos/irritantes, desencadenando inflamación crónica mediada por linfocitos Th2 (IL-4, IL-13) y prurito intenso en pliegues flexores.',
      keyClinicalClues: [
        'Prurito intenso + placas eritematosas, xerosis y liquenificación en pliegues flexores',
        'Antecedente personal de rinitis alérgica y familiar de asma ("marcha atópica")',
        'Agravamiento tras baños muy calientes y jabones perfumados, sin infección purulenta',
      ],
      characteristicSignsSymptoms: [
        'Comezón intensa que empeora por la noche',
        'Piel muy seca con placas rojas en codos y detrás de las rodillas',
        'Marcas de rascado y engrosamiento cutáneo (liquenificación)',
      ],
      criticalRulingOutFactors: [
        'Ausencia de costras melicéricas purulentas descarta impetiginización bacteriana aguda.',
        'Respeto de espacios interdigitales y cronicidad desde infancia alejan escabiosis.',
      ],
      recommendedWorkup: [
        'Diagnóstico puramente clínico (criterios de Hanifin-Rajka / UK Working Party); no requiere biopsia ni pruebas de alergia de rutina en brote clásico',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Hidrocortisona crema al 1% (cara/cuello) y Mometasona o Betametasona crema (pliegues corporales)',
            dose: 'Capa fina sobre placas activas',
            route: 'Tópica cutánea',
            frequency: 'Cada 12 horas (Hidrocortisona) o cada 24 h (Mometasona en extremidades)',
            duration: '7 a 10 días hasta controlar el brote',
            rationale: 'Corticoide tópico de potencia ajustada a zona anatómica para controlar la inflamación aguda.',
          },
          {
            drug: 'Emoliente espeso sin perfume (vaselina, crema con ceramidas o glicerina)',
            dose: 'Aplicación generosa en todo el cuerpo (especialmente 3 minutos tras el baño)',
            route: 'Tópica cutánea',
            frequency: '2 a 3 veces al día de forma continua',
            duration: 'Uso diario crónico de mantenimiento (mínimo 3 a 6 meses y tras remisión del brote)',
            rationale: 'Restaura la barrera cutánea y reduce frecuencia de recaídas.',
          },
          {
            drug: 'Loratadina o Cetirizina (coadyuvante si prurito nocturno molesto)',
            dose: '10 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: '7 días',
            rationale: 'Ayuda al confort mientras desinflama el esteroide tópico (no sustituye al corticoide ni al emoliente).',
          },
        ],
        generalMeasures: [
          'Baños cortos (<5-10 min) con agua tibia (nunca caliente) usando sustituto de jabón (syndet) sin fragancia.',
          'Usar ropa holgada de algodón 100% y evitar suavizantes perfumados.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Revalorar si aparecen costras amarillentas húmedas, vesículas agrupadas dolorosas (eccema herpético) o fiebre.',
        ],
        followUp: 'Control en 2 semanas para revisar respuesta y ajustar mantenimiento con emolientes.',
      },
      criticalSafetyAlerts: [
        'NO usar corticoides tópicos de alta potencia (como clobetasol o betametasona) en cara, cuello o pliegues por periodos prolongados por riesgo de atrofia cutánea, estrías y supresión adrenal.',
        'Evitar aplicar antibióticos o antimicóticos tópicos sin signos clínicos de infección secundaria.',
      ],
      guidelineReferences: [
        'NICE Guideline CG57 / AAD Atopic Dermatitis Clinical Guidelines',
        'Guía de Práctica Clínica de Dermatitis Atópica en Primer Nivel de Atención',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Sofía, estudiante de 19 años que sufre mucha comezón y piel muy reseca y roja en los pliegues de los brazos y detrás de las rodillas.',
  },
  {
    id: 'case-mg-urticaria',
    mode: 'medico_general',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Marcos Eduardo Castañeda',
      age: 33,
      sex: 'Masculino',
      occupation: 'Chef de restaurante',
      consultReason: 'Erupción cutánea generalizada con picazón',
      evolutionTime: '18 horas de evolución',
      currentIllness:
        'Paciente masculino de 33 años que consulta por aparición súbita desde ayer por la tarde de ronchas abultadas rojas ("como picaduras grandes") con mucha comezón en pecho, espalda, brazos y muslos. Nota que unas ronchas desaparecen en unas horas sin dejar marca y le salen otras nuevas en otro lado. Niega hinchazón de labios, lengua o párpados, niega voz ronca, dificultad para tragar o respirar, mareo o dolor abdominal. Hace 4 días tuvo un catarro leve pasajero; no ha estrenado medicamentos.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '120/76 mmHg',
      heartRate: 82,
      respiratoryRate: 16,
      temperature: 36.7,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 78,
      heightCm: 177,
    },
    background: {
      pathological: ['Cuadro catarral leve hace 4 días ya resuelto. Sin antecedentes de asma ni alergias graves.'],
      nonPathological: ['Trabaja en cocina expuesta a calor; niega consumo de drogas.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Apendicectomía hace 8 años.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-piel-urticaria',
        system: 'Osteomuscular y Piel',
        name: 'Inspección cutánea de habones y prueba de presión',
        finding:
          'Múltiples habones eritematosos edematosos ("ronchas") bien delimitados, de tamaños variables (1 a 6 cm), con palidez central y halo eritematoso en tronco y extremidades; blanquean a la digitopresión. Sin equimosis, vesículas ni lesiones purpúricas residuales.',
        isAbnormal: true,
        semiologyNote: 'Habones pruriginosos evanescentes sin lesión residual ni angioedema mucoso.',
      },
      {
        id: 'pe-via-aerea-urticaria',
        system: 'Cabeza y Cuello',
        name: 'Evaluación de labios, lengua, úvula y auscultación pulmonar',
        finding:
          'Labios, lengua y úvula de tamaño normal sin angioedema. Voz clara sin disfonía ni estridor. Pulmones completamente limpios sin sibilancias.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-urticaria',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 15.2 g/dL | Leucocitos: 7,900 /mm³ | Plaquetas: 268,000 /mm³.',
        referenceRange: 'Valores dentro de rango normal',
        interpretation: 'Sin alteraciones hematológicas; la urticaria aguda espontánea no requiere estudios extensos si no hay datos de alarma.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Urticaria Aguda Espontánea (Sin Compromiso Sistémico)',
      differentialDiagnoses: [
        'Anafilaxia (choque anafiláctico)',
        'Vasculitis urticariforme',
        'Dermatitis de contacto alérgica',
        'Eritema multiforme',
      ],
      pathophysiology:
        'Degranulación aguda de mastocitos cutáneos (frecuentemente desencadenada en adultos por infección viral reciente, estrés o alimentos/fármacos) con liberación de histamina que produce vasodilatación superficial y edema dérmico transitorio (habones pruriginosos fugaces <24 h).',
      keyClinicalClues: [
        'Habones eritematosos pruriginosos fugaces que cambian de lugar en <24 h sin dejar cicatriz',
        'Ausencia total de angioedema laríngeo/lingual, broncoespasmo o hipotensión (descarta anafilaxia)',
        'Antecedente de infección viral leve días previos',
      ],
      characteristicSignsSymptoms: [
        'Ronchas rojas abultadas que aparecen y desaparecen en horas',
        'Prurito intenso generalizado',
        'Signos vitales normales y vía aérea completamente permeable',
      ],
      criticalRulingOutFactors: [
        'Presión arterial normal, saturación 99%, pulmones limpios y ausencia de angioedema descartan anafilaxia.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico; la urticaria aguda (<6 semanas) sin signos de anafilaxia o vasculitis no requiere paneles alérgicos ni laboratorios complejos de rutina',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Cetirizina o Loratadina (antihistamínico H1 de segunda generación)',
            dose: '10 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas (puede titularse si persisten habones según guía EAACI)',
            duration: '7 a 14 días',
            rationale: 'Tratamiento de primera línea altamente efectivo sin sedación marcada.',
          },
          {
            drug: 'Prednisona (solo ciclo corto si brote muy extenso e incapacitante que no cede con H1)',
            dose: '20 a 40 mg (opcional si refractario)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la mañana',
            duration: '3 a 5 días máximo',
            rationale: 'Rescate breve reservado solo para brotes agudos extensos refractarios a antihistamínicos.',
          },
        ],
        generalMeasures: [
          'Evitar baños muy calientes, frotamiento vigoroso de piel, alcohol y AINEs/aspirina (potencian liberación mastocitaria).',
          'Aplicar compresas frías o loción de calamina para aliviar picazón inmediata.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias DE INMEDIATO si nota hinchazón de labios, lengua o párpados, sensación de cierre en la garganta, silbidos en el pecho o mareo.',
        ],
        followUp: 'Seguimiento solo si las ronchas continúan más de 6 semanas (urticaria crónica) o recurren frecuentemente.',
      },
      criticalSafetyAlerts: [
        'No administrar Adrenalina IM si NO existen criterios de anafilaxia (ni compromiso respiratorio, ni hipotensión, ni edema mucoso/síntomas GI agudos).',
        'Advertir al paciente que evite AINEs (ibuprofeno/aspirina) durante el brote porque agravan la urticaria.',
      ],
      guidelineReferences: [
        'EAACI/GA²LEN/EuroGuiDerm/APAAACI International Guideline for Urticaria',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Marcos, chef de 33 años preocupado porque le salieron ronchas rojas por todo el cuerpo que pican mucho y cambian de lugar, aunque respira perfecto y no se le ha hinchado la boca.',
  },
  {
    id: 'case-mg-escabiosis',
    mode: 'medico_general',
    specialty: 'dermatologia',
    patientInfo: {
      name: 'Mateo Sebastián Vargas',
      age: 24,
      sex: 'Masculino',
      occupation: 'Repartidor y vive en casa compartida con 3 familiares',
      consultReason: 'Picazón intensa en la piel',
      evolutionTime: '2 semanas de evolución',
      currentIllness:
        'Paciente masculino de 24 años que consulta por prurito muy intenso desde hace 2 semanas que empeora drásticamente por la noche al acostarse bajo las cobijas, impidiéndole dormir. Nota pequeños granitos y costritas entre los dedos de las manos, en la cara interna de las muñecas, alrededor del ombligo y axilas. Al preguntarle por sus contactos cercanos, refiere que su hermano menor y su mamá también empezaron con mucha comezón nocturna en los últimos días.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/72 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 89,
      weightKg: 69,
      heightCm: 172,
    },
    background: {
      pathological: ['Sano previamente; sin antecedentes de eccema o alergias.'],
      nonPathological: ['Comparte cama o sillón con su hermano; otros familiares en casa presentan síntomas parecidos.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Se aplicó crema para hongos de venta libre sin ninguna mejoría.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-piel-escabiosis',
        system: 'Osteomuscular y Piel',
        name: 'Inspección dermatológica de espacios interdigitales, muñecas y tronco',
        finding:
          'Pápulas eritematosas pequeñas, excoriaciones por rascado y escasas lesiones lineales finas levemente elevadas de 3 a 5 mm en espacios interdigitales de ambas manos, cara flexora de muñecas, pliegues axilares anteriores y región periumbilical. Respeta cara y cuero cabelludo. Sin placas purulentas.',
        isAbnormal: true,
        semiologyNote: 'Prurito nocturno + lesiones en espacios interdigitales/muñecas/periumbilical + surcos acarinos + contagio intrafamiliar es diagnóstico de escabiosis.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-raspado-escabiosis',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Examen microscópico de raspado cutáneo directo',
        result: 'Observación microscópica directa de organismo ovalado con 4 pares de patas, excretas oscuras y huevecillos ovalados en muestra epidérmica superficial de lesión interdigital.',
        referenceRange: 'Negativo (sin hallazgos parasitarios)',
        interpretation: 'Confirma ectoparasitosis por Sarcoptes scabiei.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Escabiosis (Sarna Humana)',
      differentialDiagnoses: [
        'Dermatitis atópica',
        'Dermatitis de contacto alérgica',
        'Urticaria papular por picaduras de insectos',
        'Prurigo nodular',
      ],
      pathophysiology:
        'Infestación cutánea altamente contagiosa por el ácaro Sarcoptes scabiei var. hominis transmitida por contacto piel-piel estrecho; la hembra excava surcos en el estrato córneo para depositar huevos, induciendo reacción de hipersensibilidad retardada con prurito nocturno intenso.',
      keyClinicalClues: [
        'Prurito severo de predominio nocturno que empeora con el calor de la cama',
        'Lesiones papulares y surcos en espacios interdigitales, muñecas y área periumbilical (respetando cara)',
        'Varios convivientes en el mismo domicilio con el mismo prurito',
      ],
      characteristicSignsSymptoms: [
        'Comezón intensa nocturna',
        'Granitos y surcos entre dedos de las manos y muñecas',
        'Contagio en familiares o pareja',
      ],
      criticalRulingOutFactors: [
        'El respeto facial y el antecedente claro de contagio familiar distinguen escabiosis de dermatitis atópica.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico epidemiológico; dermatoscopia ("signo del ala delta") o raspado cutáneo si se requiere confirmación',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Permetrina crema al 5%',
            dose: '1 tubo de 30 g en capa fina del cuello hacia abajo (pliegues, entre dedos y genitales externos)',
            route: 'Tópica cutánea',
            frequency: '1 aplicación nocturna (dejar 8-12 h y lavar en la mañana); repetir dosis al día 7',
            duration: '2 aplicaciones separadas por 7 días (día 1 y día 7)',
            rationale: 'Escabicida tópico de primera línea por su alta eficacia y seguridad.',
          },
          {
            drug: 'Ivermectina oral (alternativa o coadyuvante si brote familiar amplio)',
            dose: '200 mcg/kg en dosis única (repetir a los 7-14 días)',
            route: 'Vía Oral',
            frequency: 'Dosis única con comida, repetir día 7',
            duration: '2 dosis separadas por 7 días',
            rationale: 'Excelente opción práctica cuando hay múltiples contactos intradomiciliarios.',
          },
        ],
        generalMeasures: [
          'TRATAR SIMULTÁNEAMENTE a todos los convivientes de la casa y pareja aunque aún no tengan picazón.',
          'Lavar sábanas, toallas y ropa usada en los últimos 3 días con agua caliente y planchar/secar a temperatura alta, o guardar en bolsa sellada 72 horas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Revalorar si aparecen pústulas con pus/costras doradas (impetiginización) o falla tras dos ciclos completos.',
        ],
        followUp: 'Explicar que la picazón residual post-escabiótica puede persistir 2 a 3 semanas tras curarse por hipersensibilidad (calmar con emoliente o antihistamínico), sin significar reinfección.',
      },
      criticalSafetyAlerts: [
        'Error frecuente: tratar solo al paciente sin tratar al resto de los convivientes de la casa, lo que garantiza reinfección inmediata ("efecto ping-pong").',
        'No confundir con dermatitis y prescribir únicamente corticoides tópicos, los cuales empeoran la carga parasitaria ("sarna incógnita").',
      ],
      guidelineReferences: [
        'OMS Scabies Control Guidelines / IACS Consensus Criteria for the Diagnosis of Scabies',
        'CDC STI / Ectoparasitic Treatment Guidelines (Scabies)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Mateo, joven de 24 años desesperado por una picazón terrible que empeora en las noches entre los dedos y muñecas, y cuenta que su mamá y hermano también tienen lo mismo.',
  },
  {
    id: 'case-mg-bronquitis-aguda',
    mode: 'medico_general',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Roberto Carlos Aguilar',
      age: 41,
      sex: 'Masculino',
      occupation: 'Maestro de secundaria',
      consultReason: 'Tos persistente desde hace varios días',
      evolutionTime: '8 días de evolución',
      currentIllness:
        'Paciente masculino de 41 años que consulta porque hace 8 días empezó con un catarro leve (nariz tapada y malestar) que ya se le quitó, pero le quedó una tos molesta en accesos, inicialmente seca y ahora con flemas claras a amarillentas, con ligero ardor detrás del esternón al toser. Niega fiebre actual, niega falta de aire en reposo o al subir escaleras, niega dolor punzante en costado o flema con sangre.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/76 mmHg',
      heartRate: 80,
      respiratoryRate: 17,
      temperature: 36.8,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 77,
      heightCm: 175,
    },
    background: {
      pathological: ['Sin antecedente de asma, EPOC ni cardiopatías.'],
      nonPathological: ['No fuma; habla mucho durante sus clases escolares.'],
      family: ['Padres sanos.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó jarabe de miel con limón; niega antibióticos previos.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-torax-bronquitis',
        system: 'Tórax y Pulmones',
        name: 'Inspección y auscultación pulmonar completa',
        finding:
          'Tórax simétrico sin tiraje ni uso de músculos accesorios. Roncus dispersos gruesos y escasas sibilancias bilaterales que modifican o desaparecen después de que el paciente tose. Sin estertores crepitantes focales, sin matidez ni egofonía.',
        isAbnormal: true,
        semiologyNote: 'Roncus móviles que aclaran con la tos, paciente afebril, FC <100, FR <24 y SpO₂ 98% son clásicos de bronquitis aguda sin neumonía.',
      },
    ],
    studiesPool: [
      {
        id: 'img-rx-bronquitis',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de tórax PA',
        result: 'Silueta cardiomediastínica normal, senos costofrénicos libres, parénquima pulmonar sin consolidaciones alveolares ni infiltrados neumónicos.',
        referenceRange: 'Campos pulmonares sin consolidación',
        interpretation: 'Descarta neumonía (en la práctica, en paciente sin fiebre ni taquipnea/taquicardia ni signos focales no suele requerirse).',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Bronquitis Aguda Viral No Complicada',
      differentialDiagnoses: [
        'Neumonía adquirida en la comunidad (NAC)',
        'Exacerbación asmática / Asma de inicio adulto',
        'Rinofaringitis con goteo postnasal',
        'Tos ferina (Bordetella pertussis) si tos >2-3 semanas paroxística',
      ],
      pathophysiology:
        'Inflamación aguda transitoria de la mucosa traqueobronquial casi siempre de etiología viral (>90%: rinovirus, parainfluenza, coronavirus, VSR) tras infección de vías altas; produce hiperreactividad bronquial temporal, descamación epitelial y tos productiva que dura típicamente 10 a 21 días.',
      keyClinicalClues: [
        'Tos de 8 días posterior a cuadro catarral con signos vitales completamente normales (afebril, FC 80, FR 17, SpO₂ 98%)',
        'Roncus dispersos que cambian con la tos sin estertores crepitantes focales',
        'Expectoración purulenta/amarillenta en bronquitis NO indica infección bacteriana (se debe a peroxidasa leucocitaria)',
      ],
      characteristicSignsSymptoms: [
        'Tos persistente >5 días tras catarro',
        'Molestia retroesternal leve al toser',
        'Ausencia de fiebre, taquipnea o crepitantes focales',
      ],
      criticalRulingOutFactors: [
        'FC <100 lpm, FR <24 rpm, Temp <38°C y ausencia de consolidación focal descartan neumonía con alta probabilidad.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico; evitar radiografías y laboratorios innecesarios si signos vitales y auscultación son estables',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Miel / Dextrometorfano (nocturno si tos impide dormir) o Paracetamol si molestia torácica',
            dose: 'Paracetamol 500 mg o Dextrometorfano 15 mg (o 1 cucharadita de miel)',
            route: 'Vía Oral',
            frequency: 'Paracetamol cada 8 h si dolor (máx 3 g/día) / Dextrometorfano cada 12 h o nocturno si tos impide dormir',
            duration: '5 a 7 días',
            rationale: 'Control sintomático seguro en adultos sin comprometer expectoración útil.',
          },
          {
            drug: 'Salbutamol inhalado (SOLO si sibilancias persistentes o broncoespasmo clínico molesto)',
            dose: '200 mcg (2 inhalaciones)',
            route: 'Inhalatoria',
            frequency: 'Cada 8 horas por 5 días si silbido bronquial',
            duration: '5 días',
            rationale: 'Alivia hiperreactividad bronquial transitoria cuando hay sibilancias.',
          },
        ],
        generalMeasures: [
          'Explicar al paciente que es normal que la tos dure 2 a 3 semanas mientras cicatriza el epitelio bronquial ("bronquitis" no significa necesidad de antibiótico).',
          'Hidratación oral abundante y evitar exposición a humo o aire muy frío.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Regresar si aparece fiebre >38°C, falta de aire, dolor torácico pleurítico o si la tos supera las 3 semanas.',
        ],
        followUp: 'Control solo si la tos persiste más de 3 semanas o surgen datos de alarma.',
      },
      criticalSafetyAlerts: [
        '¡NO prescribir antibióticos (amoxicilina, azitromicina, levofloxacino) en bronquitis aguda no complicada!: >90% son virales y la flema verdosa/amarilla NO equivale a bacteria.',
      ],
      guidelineReferences: [
        'ACCP CHEST Guideline: Diagnosis and Management of Cough Due to Acute Bronchitis',
        'NICE Guideline NG120: Cough (Acute) — Antimicrobial Prescribing',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Roberto, profesor de 41 años con una tos con flemas desde hace 8 días después de una gripa, sin fiebre ni falta de aire, preocupado por si necesita antibiótico.',
  },
  {
    id: 'case-mg-cefalea-tensional',
    mode: 'medico_general',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Carolina Beatriz Méndez',
      age: 34,
      sex: 'Femenino',
      occupation: 'Analista financiera',
      consultReason: 'Dolor de cabeza frecuente',
      evolutionTime: '3 semanas de evolución',
      currentIllness:
        'Paciente femenina de 34 años que acude por dolores de cabeza casi diarios desde hace 3 semanas que empiezan por las tardes tras pasar 8 horas frente a la computadora durante el cierre contable. Describe el dolor como una presión sorda en ambos lados de la frente, sienes y nuca ("como si trajera una banda apretada"), de intensidad leve a moderada (5/10) que no le impide caminar ni empeora al subir escaleras. Niega náuseas, vómitos, ver luces o destellos, y la luz o ruido normales no le molestan mucho. Siente los músculos del cuello y hombros muy duros.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 91,
      weightKg: 62,
      heightCm: 165,
    },
    background: {
      pathological: ['Sin hipertensión ni migrañas previas.'],
      nonPathological: ['Jornadas largas frente a pantalla con mala postura cervical, duerme 5.5 horas y alto estrés laboral.'],
      family: ['Sin antecedentes familiares de relevancia.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ha tomado paracetamol 500 mg algunos días de esta semana con buen alivio.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-neuro-tensional',
        system: 'Neurológico',
        name: 'Exploración neurológica completa y fondo de ojo',
        finding:
          'Pares craneales íntegros, pupilas isocóricas normorreactivas, fondo de ojo normal sin papiledema. Fuerza, sensibilidad y reflejos simétricos sin focalización, rigidez de nuca ni signos de irritación meníngea.',
        isAbnormal: false,
      },
      {
        id: 'pe-cuello-tensional',
        system: 'Cabeza y Cuello',
        name: 'Palpación muscular pericraneal y cervical',
        finding:
          'Contractura y sensibilidad dolorosa reproducible a la palpación de músculos trapecios superiores, suboccipitales y temporales bilaterales. Arterias temporales no engrosadas ni pulsátiles dolorosas.',
        isAbnormal: true,
        semiologyNote: 'Hipersensibilidad miofascial pericraneal con examen neurológico íntegro es característica de cefalea tensional.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-tensional',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea y perfil tiroideo básico (control preventivo)',
        result: 'Glucosa: 91 mg/dL | Creatinina: 0.8 mg/dL | TSH: 2.1 mUI/L.',
        referenceRange: 'Glucosa 70-99 mg/dL | TSH 0.4-4.0 mUI/L',
        interpretation: 'Sin alteraciones metabólicas (diagnóstico clínico; no requiere TAC cerebral sin banderas rojas).',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Cefalea Tensional Episódica',
      differentialDiagnoses: [
        'Migraña sin aura',
        'Cefalea secundaria a hipertensión arterial o vicio de refracción',
        'Cefalea por abuso de analgésicos',
        'Cervicalgia mecánica / síndrome miofascial cervical',
      ],
      pathophysiology:
        'Sensibilización periférica de nociceptores miofasciales pericraneales y cervicales asociada a estrés sostenido, contracción muscular prolongada y alteración central de modulación del dolor, produciendo cefalea opresiva bilateral no pulsátil.',
      keyClinicalClues: [
        'Dolor bilateral opresivo ("en banda") leve-moderado que NO empeora con actividad física rutinaria',
        'Sin náuseas, vómitos, aura visual ni fotofobia/fonofobia intensa',
        'Contractura cervical/trapecio palpable y examen neurológico completamente normal (sin banderas rojas SNOOP)',
      ],
      characteristicSignsSymptoms: [
        'Presión bilateral en frente, sienes y nuca',
        'Tensión muscular en cuello y hombros',
        'Relación con estrés y postura frente a pantalla',
      ],
      criticalRulingOutFactors: [
        'Ausencia de inicio súbito "en trueno", fiebre, focalidad neurológica o papiledema descarta causas secundarias graves.',
        'Carácter opresivo bilateral sin náusea ni agravamiento con esfuerzo la distingue de migraña.',
      ],
      recommendedWorkup: [
        'Cribado clínico de banderas rojas (SNOOP4); no solicitar neuroimagen en cefalea tensional típica con examen neurológico normal',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ibuprofeno o Paracetamol (rescate puntual)',
            dose: 'Ibuprofeno 400 mg o Paracetamol 500-1000 mg',
            route: 'Vía Oral',
            frequency: 'Dosis única al inicio del dolor (máximo 2-3 días por semana)',
            duration: '1 a 2 días por episodio agudo (evitar uso diario >10 días/mes)',
            rationale: 'Analgésico simple de primera elección; limitar días de toma evita cefalea por abuso de analgésicos.',
          },
        ],
        generalMeasures: [
          'Pausas activas ergonómicas cada 50 minutos, ajuste de altura del monitor y estiramientos cervicales diarios.',
          'Higiene del sueño (7-8 horas), calor local suave en cuello/hombros y técnicas de manejo de estrés.',
          'Revisar agudeza visual si usa lentes.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Urgencias inmediatas si aparece cefalea súbita explosiva ("la peor de su vida"), fiebre, debilidad de un lado del cuerpo, alteración del habla o pérdida de visión.',
        ],
        followUp: 'Revalorar en 4 semanas; si supera 15 días al mes (cefalea tensional crónica), valorar profilaxis con amitriptilina a dosis bajas nocturnas.',
      },
      criticalSafetyAlerts: [
        'NO prescribir opioides (tramadol/codeína) ni combinaciones con ergotamina/cafeína de uso diario por altísimo riesgo de cefalea crónica por abuso de medicamentos.',
        'Evitar solicitar TAC/RMN cerebral innecesarias cuando la exploración neurológica es normal y no hay banderas rojas.',
      ],
      guidelineReferences: [
        'ICHD-3 International Classification of Headache Disorders (Tension-Type Headache)',
        'EFNS / NICE Clinical Guideline CG150 Headaches in Over 12s',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Carolina, mujer de 34 años que sufre dolor de cabeza apretado en frente y nuca todas las tardes por trabajo pesado en computadora y tensión en el cuello.',
  },
  {
    id: 'case-mg-gota',
    mode: 'medico_general',
    specialty: 'traumatologia',
    patientInfo: {
      name: 'Don Ernesto Javier Salgado',
      age: 52,
      sex: 'Masculino',
      occupation: 'Comerciante de carnes',
      consultReason: 'Dolor intenso e inflamación en el pie derecho',
      evolutionTime: '10 horas de evolución',
      currentIllness:
        'Paciente masculino de 52 años que acude cojeando porque a las 3:00 de la madrugada lo despertó un dolor punzante e insoportable en la base del dedo gordo del pie derecho. Refiere que la zona se puso muy roja, caliente e hinchada rápidamente y hasta el roce de la sábana le duele muchísimo. Cuenta que ayer asistió a una parrillada familiar donde comió bastante carne asada, vísceras y tomó varias cervezas. Niega golpe previo o herida en el pie.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '138/86 mmHg',
      heartRate: 90,
      respiratoryRate: 17,
      temperature: 37.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 104,
      weightKg: 91,
      heightCm: 172,
    },
    background: {
      pathological: ['Hipertensión arterial leve y sobrepeso; tuvo un dolor parecido pero leve en el mismo dedo hace 1 año que cedió solo.'],
      nonPathological: ['Dieta rica en carnes rojas, mariscos y consumo de cerveza los fines de semana.'],
      family: ['Madre con hipotiroidismo en control; padre sano.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Hidroclorotiazida 25 mg cada 24 h desde hace 6 meses para la presión.'],
      allergies: ['Sin alergias medicamentosas conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-pie-gota',
        system: 'Osteomuscular y Piel',
        name: 'Inspección y palpación de articulación 1.ª metatarsofalángica derecha',
        finding:
          'Eritema intenso brillante, aumento marcado de volumen y calor local circunscrito a la 1.ª articulación metatarsofalángica del pie derecho. Hiperalgesia extrema incluso al roce suave (alodinia mecánica) e impotencia funcional para apoyar el antepié. Resto de articulaciones sin flogosis; sin puertas de entrada infecciosas o heridas cutáneas.',
        isAbnormal: true,
        semiologyNote: 'Monoartritis aguda hiperálgica eritematosa de inicio nocturno en 1.ª MTF (podagra) es presentación clásica de ataque agudo de gota.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-acido-urico-gota',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea con Ácido Úrico y Creatinina sérica',
        result: 'Ácido úrico: 8.6 mg/dL (elevado; nota: durante crisis aguda puede estar falsamente normal en ~30% de pacientes) | Creatinina: 1.0 mg/dL | Glucosa: 104 mg/dL.',
        referenceRange: 'Ácido úrico 3.5-7.2 mg/dL | Creatinina 0.7-1.3 mg/dL',
        interpretation: 'Hiperuricemia con función renal preservada (TFG conservada).',
        isAbnormal: true,
      },
      {
        id: 'lab-bh-gota',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y PCR',
        result: 'Leucocitos: 11,200 /mm³ | PCR: 42 mg/L | Hemoglobina: 14.8 g/dL.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | PCR <5 mg/L',
        interpretation: 'Respuesta inflamatoria aguda intensa por cristales de urato monosódico.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Artritis Gotosa Aguda (Podagra)',
      differentialDiagnoses: [
        'Artritis séptica aguda (descartar si fiebre alta o herida/inmunosupresión)',
        'Celulitis del pie',
        'Pseudogota (condrocalcinosis)',
        'Fractura de estrés o esguince del hallux',
      ],
      pathophysiology:
        'Precipitación intraarticular de cristales de urato monosódico en una articulación distal más fría (1.ª MTF) favorecida por hiperuricemia, dieta rica en purinas, alcohol e hidroclorotiazida; los cristales activan el inflamasoma NLRP3 y liberación masiva de IL-1β con inflamación intensa.',
      keyClinicalClues: [
        'Monoartritis súbita nocturna en 1.ª metatarsofalángica (podagra) roja, caliente y dolorosa al roce',
        'Desencadenante clásico tras carnes rojas y cerveza + uso de diurético tiazídico (hidroclorotiazida eleva ácido úrico)',
        'Función renal conservada y sin puerta de entrada cutánea',
      ],
      characteristicSignsSymptoms: [
        'Dolor extremo de inicio en la madrugada en el dedo gordo del pie',
        'Enrojecimiento brillante, calor e hinchazón articular',
        'Incapacidad para tolerar el peso o la sábana',
      ],
      criticalRulingOutFactors: [
        'Sin puerta de entrada ni fiebre >38.5°C, aunque siempre vigilar respuesta rápida o artrocentesis si hay duda con artritis séptica.',
      ],
      recommendedWorkup: [
        'Ácido úrico sérico (idealmente repetir 2-4 semanas post-crisis), creatinina sérica y reactantes de fase aguda',
        'Artrocentesis con microscopía de luz polarizada (cristales en aguja birrefringencia negativa) si duda diagnóstica o sospecha séptica',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Naproxeno o Indometacina o Etoricoxib (AINE de inicio inmediato con función renal sana)',
            dose: 'Naproxeno 500 mg (o Colchicina 1 mg inicial seguido de 0.5 mg a la hora, máx 1.5 mg día 1)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas (Naproxeno) / Prednisona 30-35 mg/día si AINE contraindicado',
            duration: '5 a 7 días hasta remitir ataque agudo',
            rationale: 'AINEs a dosis plenas, Colchicina en ventana <36 h o Corticoides orales son los tres pilares de primera línea para yugular el ataque agudo (ACR 2020).',
          },
          {
            drug: 'Omeprazol (gastroprotección durante ciclo corto de AINE)',
            dose: '20 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas en ayunas',
            duration: '5 a 7 días (durante el ciclo corto de AINE)',
            rationale: 'Protección gástrica en >50 años con dosis plena de AINE.',
          },
        ],
        generalMeasures: [
          'Reposo del pie elevado, aplicación de hielo local envuelto en paño 15 minutos y abundante hidratación oral.',
          'Suspender cerveza/alcohol, vísceras, mariscos, carnes rojas en exceso y bebidas con fructosa.',
          'Valorar cambiar Hidroclorotiazida por Losartán (antihipertensivo uricosúrico) en consulta subsecuente.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir a urgencias si desarrolla fiebre alta >38.5°C, escalofríos o empeoramiento progresivo a pesar de tratamiento (descartar artritis séptica).',
        ],
        followUp: 'Cita en 2 a 4 semanas tras resolver la inflamación para valorar inicio de Alopurinol (terapia hipouricemiante crónica) y ajuste de hidroclorotiazida.',
      },
      criticalSafetyAlerts: [
        '¡ERROR FRECUENTE!: NO iniciar ni suspender bruscamente Alopurinol EN MEDIO DE UNA CRISIS AGUDA si el paciente no lo tomaba previamente, pues los cambios bruscos de uricemia prolongan o empeoran el ataque articular (esperar 2 semanas tras ceder el brote o cubrir con colchicina).',
        'Evitar dosis tóxicas antiguas de colchicina (1 mg cada hora hasta diarrea); usar esquema bajo seguro (máx 1.5-1.8 mg día 1).',
      ],
      guidelineReferences: [
        'ACR 2020 Guideline for the Management of Gout',
        'EULAR Recommendations for the Management of Gout',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Don Ernesto, señor de 52 años con un dolor terrible desde la madrugada en el dedo gordo del pie derecho tras comer carne asada y tomar cerveza.',
  },
  {
    id: 'case-mg-fascitis-plantar',
    mode: 'medico_general',
    specialty: 'traumatologia',
    patientInfo: {
      name: 'Patricia Elena Morales',
      age: 46,
      sex: 'Femenino',
      occupation: 'Cajera de supermercado (8 horas de pie diarias)',
      consultReason: 'Dolor en el talón derecho al caminar',
      evolutionTime: '6 semanas de evolución',
      currentIllness:
        'Paciente femenina de 46 años que consulta por dolor intenso en la planta del talón derecho de 6 semanas de evolución. Describe que el momento peor del día es al bajarse de la cama por la mañana ("siento como si pisara un clavo en los primeros pasos"); después de caminar unos 15 minutos mejora un poco, pero vuelve a empeorar al final de su turno de pie en la caja del supermercado usando tenis muy desgastados y planos. Niega hormigueos en los dedos, hinchazón del tobillo o golpe previo.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/78 mmHg',
      heartRate: 74,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 78,
      heightCm: 159,
    },
    background: {
      pathological: ['Sobrepeso moderado; niega diabetes o artritis reumatoide.'],
      nonPathological: ['Permanece de pie 8-9 horas diarias en piso duro con calzado plano sin soporte de arco.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Se ha puesto pomadas mentoladas sin mejoría duradera.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-talon-fascitis',
        system: 'Osteomuscular y Piel',
        name: 'Palpación del calcáneo medial y prueba de Windlass (dorsiflexión del hallux)',
        finding:
          'Dolor puntual reproducible a la palpación profunda en el tubérculo medial anteroinferior del calcáneo (origen de la fascia plantar) que se exacerba con la dorsiflexión pasiva del primer ortejo (maniobra de Windlass positiva). Sin eritema, calor, edema ni dolor en tendón de Aquiles; prueba de compresión calcánea lateral negativa.',
        isAbnormal: true,
        semiologyNote: 'Dolor en tubérculo medial del calcáneo + primer paso matutino doloroso + prueba de Windlass positiva confirman fascitis plantar.',
      },
      {
        id: 'pe-neuro-pie-fascitis',
        system: 'Neurológico',
        name: 'Sensibilidad plantar y percusión del canal tarsiano medial',
        finding:
          'Sensibilidad plantar conservada sin parestesias; percusión sobre el canal retromaleolar medial negativa para hormigueo distal.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'img-rx-talon-fascitis',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía lateral del pie derecho con apoyo',
        result: 'Alineación ósea conservada sin fractura de estrés del calcáneo ni lesiones líticas; discreta prominencia ósea plantar calcánea (espolón incidental).',
        referenceRange: 'Sin fractura ni lesión ósea aguda',
        interpretation: 'Descarta fractura de estrés del calcáneo; el espolón es un hallazgo frecuente incidental y no la causa directa del dolor fascial.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Fascitis Plantar Aguda del Talón Derecho',
      differentialDiagnoses: [
        'Fractura de estrés del calcáneo',
        'Síndrome del túnel del tarso',
        'Tendinopatía aquílea insercional',
        'Atrofia de la almohadilla grasa plantar',
      ],
      pathophysiology:
        'Microtraumatismos repetitivos por sobrecarga mecánica (bipedestación prolongada, sobrepeso y calzado plano) generan degeneración colágena (fasciosis/microdesgarros) en la inserción medial de la aponeurosis plantar en el calcáneo, contrayéndose durante el sueño y provocando dolor agudo en los primeros pasos matutinos.',
      keyClinicalClues: [
        'Dolor en los primeros pasos al levantarse de la cama que mejora tras calentar y reaparece al final del día',
        'Bipedestación laboral prolongada con calzado plano desgastado',
        'Dolor puntual en tubérculo medial del calcáneo y prueba de Windlass positiva sin Tinel',
      ],
      characteristicSignsSymptoms: [
        'Talalgia plantar matutina en primeros pasos',
        'Dolor puntual en borde interno del talón',
        'Agravamiento tras permanecer mucho tiempo de pie',
      ],
      criticalRulingOutFactors: [
        'Prueba de compresión lateral del calcáneo negativa y Rx sin trazo descartan fractura de estrés.',
        'Signo de Tinel negativo y ausencia de parestesias descartan síndrome del túnel del tarso.',
      ],
      recommendedWorkup: [
        'Diagnóstico fundamentalmente clínico; radiografía solo si dolor atípico o evolución prolongada para descartar fractura de estrés',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ibuprofeno o Naproxeno (ciclo corto analgésico)',
            dose: 'Ibuprofeno 400 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas con alimentos',
            duration: '5 a 7 días en fase dolorosa',
            rationale: 'Control analgésico inicial mientras hacen efecto los estiramientos y soporte plantar.',
          },
        ],
        generalMeasures: [
          'Estiramientos específicos de fascia plantar y pantorrilla (gemelos/sóleo) ANTES de dar el primer paso al despertar y 3 veces al día.',
          'Masaje plantar rodando una botella de agua congelada bajo el arco durante 10-15 min por la tarde.',
          'Cambiar calzado plano por zapato con buen soporte de arco, suela amortiguadora y talonera de silicón/gel.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referir a rehabilitación / traumatología si tras 6-8 semanas de terapia física conservadora bien realizada persiste dolor incapacitante.',
        ],
        followUp: 'Control en 4 semanas para verificar adherencia a estiramientos y cambio de calzado.',
      },
      criticalSafetyAlerts: [
        'Evitar el reposo con AINEs solos sin corregir calzado ni indicar estiramientos plantares: hasta 90% curan en meses con manejo mecánico conservador.',
        'No realizar infiltraciones repetidas con corticoides en el talón de primera intención por riesgo de ruptura de la fascia plantar o atrofia de la almohadilla grasa.',
      ],
      guidelineReferences: [
        'APTA Orthopaedic Section Clinical Practice Guideline: Heel Pain — Plantar Fasciitis',
        'AAFP Diagnosis and Treatment of Plantar Fasciitis in Primary Care',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Patricia, cajera de 46 años con un dolor como piquete en el talón derecho cada mañana al bajar de la cama y al final de su turno de pie.',
  },
  {
    id: 'case-mg-vaginosis',
    mode: 'medico_general',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Andrea Paola Guzmán',
      age: 28,
      sex: 'Femenino',
      occupation: 'Recepcionista de hotel',
      consultReason: 'Molestia y flujo vaginal',
      evolutionTime: '7 días de evolución',
      currentIllness:
        'Paciente femenina de 28 años que consulta con algo de pena porque desde hace una semana nota aumento del flujo vaginal de color blanco-grisáceo fluido y un olor fuerte desagradable "como a pescado", el cual se vuelve mucho más notorio después de tener relaciones sexuales con su pareja o al terminar su periodo. Niega comezón o ardor intenso en la vulva, niega dolor al orinar, fiebre o dolor en la parte baja del abdomen.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '110/68 mmHg',
      heartRate: 74,
      respiratoryRate: 15,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 87,
      weightKg: 59,
      heightCm: 162,
    },
    background: {
      pathological: ['Sin infecciones de transmisión sexual previas conocidas.'],
      nonPathological: ['Usa duchas vaginales perfumadas con frecuencia pensando que "limpian mejor". Vida sexual activa con pareja estable.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Ninguno actualmente; fecha de última menstruación hace 10 días.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-gine-vaginosis',
        system: 'Abdomen',
        name: 'Exploración abdominal y especuloscopia ginecológica',
        finding:
          'Abdomen blando, indoloro sin dolor hipogástrico ni anexial. A la especuloscopia: mucosa vaginal y cuello uterino sin eritema intenso ni lesiones en "fresa", con flujo homogéneo fino blanco-grisáceo adherido uniformemente a las paredes vaginales. Sin dolor a la movilización cervical.',
        isAbnormal: true,
        semiologyNote: 'Flujo blanco-grisáceo homogéneo sin inflamación eritematosa marcada ni dolor anexial orienta a disbiosis (vaginosis bacteriana).',
      },
    ],
    studiesPool: [
      {
        id: 'lab-frotis-vaginosis',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Estudio de flujo vaginal (pH vaginal, prueba de aminas y frotis de Gram / criterios de Amsel)',
        result: 'pH vaginal: 5.3 (alcalino) | Prueba de KOH (whiff test): POSITIVA (olor intenso a aminas/pescado) | Microscopía: >20% células clave ("clue cells"), escasez de lactobacilos y ausencia de hifas o tricomonas móviles.',
        referenceRange: 'pH vaginal normal 3.8-4.5 | Sin células clave',
        interpretation: 'Cumple 4/4 criterios de Amsel confirmando vaginosis bacteriana.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Vaginosis Bacteriana',
      differentialDiagnoses: [
        'Candidiasis vulvovaginal',
        'Tricomoniasis vaginal',
        'Cervicitis por Chlamydia o Neisseria gonorrhoeae',
        'Enfermedad pélvica inflamatoria (EPI)',
      ],
      pathophysiology:
        'Disbiosis del ecosistema vaginal caracterizada por disminución de Lactobacillus productores de peróxido de hidrógeno y ácido láctico (elevando el pH >4.5) y sobrecrecimiento polimicrobiano anaerobio (Gardnerella vaginalis, Atopobium vaginae, Prevotella), favorecido por duchas vaginales y semen alcalino.',
      keyClinicalClues: [
        'Flujo fluido blanco-grisáceo homogéneo con olor a pescado que empeora tras coito',
        'Ausencia de prurito vulvar intenso (diferencia de candidiasis) y sin dolor pélvico/fiebre',
        'Criterios de Amsel positivos (pH >4.5, KOH positivo, células clave en frotis)',
      ],
      characteristicSignsSymptoms: [
        'Olor fétido a pescado característico',
        'Flujo delgado grisáceo homogéneo',
        'Mínima o nula irritación vulvar',
      ],
      criticalRulingOutFactors: [
        'Ausencia de flujo grumoso "requesón" e intenso prurito descarta candidiasis.',
        'Ausencia de dolor a la movilización cervical o fiebre descarta EPI.',
      ],
      recommendedWorkup: [
        'Criterios clínicos de Amsel (3 de 4: flujo homogéneo, pH >4.5, test de aminas positivo, >20% células clave) o tinción de Gram (Nugent)',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metronidazol',
            dose: '500 mg (alternativa: Metronidazol gel vaginal 0.75% o Clindamicina óvulos)',
            route: 'Vía Oral',
            frequency: 'Cada 12 horas',
            duration: '7 días',
            rationale: 'Tratamiento de primera línea altamente eficaz contra anaerobios asociados a vaginosis bacteriana (CDC/OMS).',
          },
        ],
        generalMeasures: [
          'Suspender definitivamente duchas vaginales y jabones íntimos perfumados que alteran la flora protectora.',
          'Abstinencia de alcohol estricta durante el tratamiento con metronidazol y 24-48 horas después (riesgo de efecto disulfiram / antabús).',
          'No requiere tratamiento rutinario de la pareja masculina en vaginosis bacteriana no complicada.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Acudir si aparece dolor pélvico agudo, fiebre o sangrado anormal.',
        ],
        followUp: 'No requiere prueba de curación si desaparecen los síntomas.',
      },
      criticalSafetyAlerts: [
        'Advertir explícitamente NO consumir alcohol mientras toma Metronidazol (efecto disulfiram: náuseas, vómitos, rubor e hipotensión).',
        'No confundir con candidiasis y prescribir fluconazol/clotrimazol empíricos sin revisar olor, pH ni aspecto del flujo.',
      ],
      guidelineReferences: [
        'CDC Sexually Transmitted Infections Treatment Guidelines: Bacterial Vaginosis',
        'OMS Guidelines for the Management of Symptomatic Sexually Transmitted Infections',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Andrea, mujer de 28 años que consulta algo apenada por un flujo líquido grisáceo con mal olor a pescado desde hace una semana, sin picazón fuerte ni dolor.',
  },
  {
    id: 'case-mg-dismenorrea',
    mode: 'medico_general',
    specialty: 'ginecologia',
    patientInfo: {
      name: 'Mariana Lucía Salvatierra',
      age: 21,
      sex: 'Femenino',
      occupation: 'Estudiante de enfermería',
      consultReason: 'Dolor pélvico intenso desde esta mañana',
      evolutionTime: '8 horas de evolución',
      currentIllness:
        'Paciente femenina de 21 años que consulta por dolor tipo cólico intenso en hipogastrio ("en el bajo vientre") que irradia suavemente hacia la espalda baja y muslos desde hace 8 horas, coincidiendo con el inicio de su menstruación. Cuenta que casi todos sus periodos le duelen bastante los primeros 2 días, acompañados a veces de un poco de náusea leve, pero después del segundo día desaparecen por completo hasta el mes siguiente. Ciclos regulares cada 28 días. Niega fiebre, flujo fétido, sangrado fuera de fecha o dolor en relaciones.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '108/68 mmHg',
      heartRate: 84,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 54,
      heightCm: 160,
    },
    background: {
      pathological: ['Menarquia a los 12 años; ciclos menstruales regulares de 28x4 días; cólicos menstruales primarios desde los 15 años.'],
      nonPathological: ['Niega vida sexual activa reciente (o método de barrera regular); niega tabaquismo.'],
      family: ['Padres aparentemente sanos.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó una pastilla de paracetamol 500 mg hace 3 horas con muy poco alivio.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-abdomen-dismenorrea',
        system: 'Abdomen',
        name: 'Palpación abdominal y descarte de abdomen agudo',
        finding:
          'Abdomen blando y depresible, dolor leve-moderado difuso únicamente en hipogastrio suprapúbico al palpar profundo, sin defensa muscular ni dolor a la descompresión brusca. Fosa ilíaca derecha blanda e indolora.',
        isAbnormal: true,
        semiologyNote: 'Dolor hipogástrico suprapúbico cíclico sin signos peritoneales ni focalización anexial/apendicular.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-pie-dismenorrea',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Prueba inmunológica de embarazo en orina (hCG) y EGO',
        result: 'hCG en orina: NEGATIVA. Examen general de orina sin piuria ni nitritos.',
        referenceRange: 'Negativo',
        interpretation: 'Descarta embarazo ectópico/aborto e infección urinaria.',
        isAbnormal: false,
      },
      {
        id: 'img-us-dismenorrea',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ultrasonido pélvico transabdominal',
        result: 'Útero en anteversoflexión de tamaño y ecoestructura normales, endometrio acorde a fase menstrual temprana, ovarios normales sin quistes ni líquido libre en fondo de saco.',
        referenceRange: 'Útero y anexos sin masas ni líquido libre',
        interpretation: 'Sin patología estructural pélvica, apoyando dismenorrea primaria.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Dismenorrea Primaria',
      differentialDiagnoses: [
        'Dismenorrea secundaria (endometriosis o miomatosis uterina)',
        'Infección de vías urinarias',
        'Enfermedad pélvica inflamatoria',
        'Embarazo ectópico o amenaza de aborto',
      ],
      pathophysiology:
        'Liberación fisiológica excesiva de prostaglandinas endometriales (PGF2α y PGE2) al descender la progesterona al inicio de la menstruación, ocasionando hipercontractilidad miometrial, vasoespasmo arteriolar e isquemia uterina dolorosa en ausencia de patología pélvica estructural.',
      keyClinicalClues: [
        'Cólicos cíclicos coincidentes con los primeros 1-2 días de menstruación desde la adolescencia',
        'Ciclos regulares sin dispareunia, sangrado intermenstrual ni fiebre',
        'Paracetamol fracasó (no inhibe síntesis periférica de prostaglandinas uterinas como los AINEs) y US normal',
      ],
      characteristicSignsSymptoms: [
        'Dolor cólico suprapúbico que inicia con el flujo menstrual',
        'Irradiación leve a zona lumbar y cara interna de muslos',
        'Patrón recurrente mensual predecible',
      ],
      criticalRulingOutFactors: [
        'hCG negativa y US pélvico normal descartan embarazo ectópico, quistes complicados y miomatosis.',
        'Fosa ilíaca derecha indolora y afebril descartan apendicitis o EPI.',
      ],
      recommendedWorkup: [
        'Prueba de embarazo si hay vida sexual activa y ultrasonido pélvico solo si hay sospecha de causa secundaria o falta de respuesta a AINEs',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ibuprofeno o Naproxeno sódico',
            dose: 'Ibuprofeno 400-600 mg (o Naproxeno 500 mg inicial, luego 250-500 mg)',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas (Ibuprofeno) o cada 12 horas (Naproxeno) con alimentos',
            duration: 'Los primeros 2 a 3 días del ciclo (ideal iniciar al primer indicio de sangrado)',
            rationale: 'Los AINEs inhiben directamente la ciclooxigenasa endometrial reduciendo prostaglandinas (eficacia >80%, muy superior al paracetamol).',
          },
        ],
        generalMeasures: [
          'Aplicar compresa o bolsa de agua tibia en el bajo vientre (efecto relajante miometrial equiparable a analgésico leve).',
          'Ejercicio físico aeróbico regular e hidratación adecuada.',
          'Si desea anticoncepción o no responde en 3 ciclos, valorar anticonceptivos hormonales combinados y descartar endometriosis.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referir a ginecología si el dolor empeora progresivamente ciclo tras ciclo, aparece fuera de la regla o no responde a AINEs tras 3 meses.',
        ],
        followUp: 'Seguimiento en 2 a 3 ciclos para evaluar control del dolor con AINE iniciado de forma temprana.',
      },
      criticalSafetyAlerts: [
        'Evitar depender únicamente de paracetamol o antiespasmódicos débiles cuando la fisiopatología depende de prostaglandinas (el tratamiento de primera línea es un AINE salvo contraindicación).',
        'Descartar siempre embarazo en toda mujer en edad fértil con dolor pélvico agudo.',
      ],
      guidelineReferences: [
        'ACOG Committee Opinion No. 760: Dysmenorrhea and Endometriosis in the Adolescent',
        'SOGC Primary Dysmenorrhea Consensus Guideline',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Mariana, estudiante de 21 años con cólicos menstruales muy fuertes en el bajo vientre desde esta mañana que le bajó la regla, que el paracetamol casi no le quitó.',
  },
  {
    id: 'case-mg-depresion',
    mode: 'medico_general',
    specialty: 'psiquiatria',
    patientInfo: {
      name: 'Laura Beatriz Cisneros',
      age: 37,
      sex: 'Femenino',
      occupation: 'Bibliotecaria',
      consultReason: 'Cansancio extremo, tristeza y dificultad para dormir',
      evolutionTime: '5 semanas de evolución',
      currentIllness:
        'Paciente femenina de 37 años que acude por sentirse "sin pilas y muy triste" casi todos los días desde hace 5 semanas. Refiere que ya no disfruta leer ni salir con sus amigas (actividades que antes le encantaban), le cuesta mucho levantarse de la cama, se distrae fácilmente en el trabajo y se despierta a las 4 de la mañana sin poder volver a dormir. Ha perdido unos 2 kg por falta de apetito y siente culpa excesiva por no rendir igual. Al interrogarla directamente con respeto, niega ideas de muerte, autolesión o suicidio ("quiero estar bien, solo me siento apagada").',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 72,
      respiratoryRate: 15,
      temperature: 36.5,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 58,
      heightCm: 164,
    },
    background: {
      pathological: ['Sin enfermedades médicas crónicas conocidas; niega episodios previos de euforia extrema/manía.'],
      nonPathological: ['No fuma ni consume alcohol o sustancias. Separación de pareja hace 4 meses.'],
      family: ['Sin antecedentes familiares de relevancia referidos.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó complejo B por su cuenta sin notar diferencia.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-mental-depresion',
        system: 'Neurológico',
        name: 'Evaluación del estado mental y examen neurológico básico',
        finding:
          'Paciente orientada en tiempo, espacio y persona. Facies triste, tono de voz bajo y leve enlentecimiento psicomotor. Pensamiento lógico y coherente, con ideas de minusvalía leve; niega alucinaciones, delirios o ideación suicida/autolesiva activa (riesgo autolítico bajo). Examen neurológico motor y sensitivo normal.',
        isAbnormal: true,
        semiologyNote: 'Ánimo deprimido + anhedonia >2 semanas + alteración de sueño/apetito/concentración (PHQ-9 compatible con depresión moderada), sin riesgo suicida agudo ni psicosis.',
      },
      {
        id: 'pe-cuello-depresion',
        system: 'Cabeza y Cuello',
        name: 'Palpación tiroidea y estado general',
        finding:
          'Tiroides de tamaño y consistencia normal sin nódulos ni bocio; piel y faneras conservadas.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-tsh-depresion',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil tiroideo (TSH) y Biometría Hemática (descarte orgánico)',
        result: 'TSH: 1.9 mUI/L | Hemoglobina: 13.5 g/dL | Glucosa: 88 mg/dL | Vitamina B12: 410 pg/mL.',
        referenceRange: 'TSH 0.4-4.0 mUI/L | Hb 12-16 g/dL',
        interpretation: 'Descarta hipotiroidismo y anemia como causas orgánicas del cansancio y ánimo bajo.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Episodio Depresivo Leve-Moderado (Trastorno Depresivo Mayor)',
      differentialDiagnoses: [
        'Hipotiroidismo primario',
        'Anemia crónica / deficiencia de vitamina B12',
        'Trastorno de ansiedad generalizada',
        'Duelo adaptativo no patológico / Trastorno bipolar fase depresiva',
      ],
      pathophysiology:
        'Disregulación neurobiológica multifactorial de circuitos frontolímbicos y neurotransmisores monoaminérgicos (serotonina, noradrenalina, dopamina) combinada con estresores psicosociales recientes, produciendo ánimo deprimido persistente, anhedonia, alteración del sueño y fatiga >2 semanas.',
      keyClinicalClues: [
        'Ánimo triste persistente y anhedonia (pérdida de interés/placer) >2 semanas seguidas',
        'Insomnio de despertar precoz, hiporexia, fatiga y dificultad de concentración (cumple criterios DSM-5 / CIE-11)',
        'TSH y hemoglobina normales; cribado explícito de riesgo suicida y manía previos negativos',
      ],
      characteristicSignsSymptoms: [
        'Tristeza casi todo el día durante más de 2 semanas',
        'Pérdida de disfrute en actividades habituales (anhedonia)',
        'Despertares en la madrugada, falta de apetito y cansancio',
      ],
      criticalRulingOutFactors: [
        'TSH y Hb normales descartan hipotiroidismo y anemia.',
        'Negación de episodios previos de manía/hipomanía permite iniciar ISRS con seguridad.',
      ],
      recommendedWorkup: [
        'Aplicación de escala validada (PHQ-9) y evaluación obligatoria del riesgo suicida',
        'TSH y hemograma básico para descartar causas médicas mimetizadoras',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sertralina (o Fluoxetina / Escitalopram — ISRS de primera línea)',
            dose: '50 mg (iniciar con 25 mg los primeros 4-7 días si sensibilidad gastrointestinal)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la mañana',
            duration: 'Mínimo 6 a 9 meses tras remisión clínica',
            rationale: 'ISRS de primera elección en atención primaria por perfil de seguridad, tolerabilidad y eficacia (OMS mhGAP / NICE). Explicar que tarda 2-4 semanas en mostrar mejoría plena.',
          },
        ],
        generalMeasures: [
          'Psicoterapia cognitivo-conductual o terapia de activación conductual (planificar pequeñas actividades placenteras y ejercicio físico aeróbico 3-4 veces/semana).',
          'Higiene del sueño y red de apoyo familiar.',
          'Plan de seguridad y cita presencial de seguimiento cercana a las 2 semanas para vigilar tolerabilidad y adherencia.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Urgencias psiquiátricas de inmediato si aparecen pensamientos suicidas, planes autolesivos, síntomas psicóticos o cambio brusco hacia agitación/euforia.',
        ],
        followUp: 'Cita presencial en 2 semanas (crítico al iniciar antidepresivo) y luego mensual.',
      },
      criticalSafetyAlerts: [
        'En todo paciente con depresión es OBLIGATORIO preguntar directamente sobre ideación o plan suicida (preguntar NO induce la idea, sino que protege vidas).',
        'NO prescribir benzodiacepinas (diazepam/alprazolam) como monoterapia de la depresión: no tratan la enfermedad y empeoran el riesgo de dependencia y letargia.',
      ],
      guidelineReferences: [
        'OMS mhGAP Intervention Guide (Depression)',
        'NICE Guideline NG222: Depression in Adults — Treatment and Management',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Laura, mujer de 37 años que se siente muy apagada, triste casi todo el día, sin ganas de hacer las cosas que antes disfrutaba y despertándose a las 4 de la mañana desde hace 5 semanas; niega ideas de hacerse daño.',
  },
  {
    id: 'case-mg-hemorroides',
    mode: 'medico_general',
    specialty: 'cirugia_general',
    patientInfo: {
      name: 'Fernando Alberto Paredes',
      age: 42,
      sex: 'Masculino',
      occupation: 'Programador de software (sedentario)',
      consultReason: 'Molestia anal y sangrado ocasional al evacuar',
      evolutionTime: '10 días de evolución',
      currentIllness:
        'Paciente masculino de 42 años que consulta muy preocupado porque en los últimos 10 días notó manchas de sangre roja brillante en el papel higiénico y gotas en el inodoro al terminar de evacuar heces duras con mucho esfuerzo. Además siente una pequeña bolita blanda en el ano que sale cuando puja pero se vuelve a meter sola al terminar. Niega dolor anal desgarrante agudo, niega sangre oscura mezclada con las heces, pérdida de peso o fiebre.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '122/76 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 93,
      weightKg: 82,
      heightCm: 174,
    },
    background: {
      pathological: ['Estreñimiento crónico leve funcional por baja ingesta de fibra y agua.'],
      nonPathological: ['Permanece sentado 9-10 horas diarias y suele pasar 15-20 minutos sentado en el inodoro leyendo el celular.'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-procto-hemorroides',
        system: 'Abdomen',
        name: 'Inspección perianal, maniobra de Valsalva y tacto rectal',
        finding:
          'Abdomen blando, indoloro sin masas. A la inspección perianal en posición lateral izquierda: piel íntegra sin fisuras anales visibles ni abscesos; al pedir maniobra de Valsalva prolapsan dos dilataciones vasculares submucosas congestivas violáceas del canal anal a las 3 y 11 horas que se reducen espontáneamente al cesar el pujo. Tacto rectal con tono esfinteriano conservado, sin masas palpables ni dolor intenso; dedo de guante limpio con mínima estría hemática roja.',
        isAbnormal: true,
        semiologyNote: 'Rectorragia roja rutilante post-defecatoria indolora + prolapso que reduce espontáneamente al dejar de pujar = Hemorroides internas grado II.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-hemorroides',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 14.6 g/dL | VCM: 89 fL | Leucocitos: 6,900 /mm³ | Plaquetas: 245,000 /mm³.',
        referenceRange: 'Hb 13.5-17.5 g/dL | VCM 80-98 fL',
        interpretation: 'Sin anemia ferropénica ni repercusión hematológica por sangrado leve.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad Hemorroidal Sintomática (Hemorroides Internas Grado II)',
      differentialDiagnoses: [
        'Fisura anal (produce dolor punzante intenso durante/después de evacuar)',
        'Absceso o fístula perianal',
        'Pólipo o neoplasia colorrectal (descartar con colonoscopia si >45-50 años o signos de alarma)',
        'Diverticulosis / sangrado digestivo bajo',
      ],
      pathophysiology:
        'Congestión e ingurgitación de los cojinetes vasculares arteriovenosos del canal anal por aumento crónico de la presión intraabdominal (estreñimiento, pujo excesivo y tiempo prolongado sentado en el sanitario), produciendo fragilidad mucosa con sangrado arterial rutilante y prolapso reversible (grado II).',
      keyClinicalClues: [
        'Sangrado rojo brillante rutilante en el papel o goteando tras defecar heces duras (sin mezclarse con la materia fecal)',
        'Masa blanda que prolapsa al pujar y reduce espontáneamente sin dolor anal desgarrante',
        'Abdomen sin masas, tacto sin tumoraciones y hemoglobina normal',
      ],
      characteristicSignsSymptoms: [
        'Sangre roja viva al limpiarse o en la taza',
        'Bulto anal que sale al pujar y regresa solo',
        'Estreñimiento y hábito prolongado en el sanitario',
      ],
      criticalRulingOutFactors: [
        'Ausencia de dolor lancinante anal al defecar la distingue de fisura anal.',
        'Ausencia de anemia microcítica, pérdida de peso o cambios crónicos recientes en calibre fecal aleja neoplasia (aunque en ≥45-50 años siempre considerar tamizaje colonoscópico).',
      ],
      recommendedWorkup: [
        'Inspección anal, maniobra de Valsalva y tacto rectal; hemograma si sangrado frecuente; anoscopia o colonoscopia si >45 años o sospecha de origen proximal',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Psyllium plantago (fibra soluble formadora de bolo) o Polietilenglicol',
            dose: '1 cucharada (5-10 g) disuelta en un vaso grande de agua',
            route: 'Vía Oral',
            frequency: 'Cada 24 h (o cada 12 h inicialmente)',
            duration: 'Uso sostenido 4-8 semanas y hábito dietético permanente',
            rationale: 'Ablanda las heces y elimina el pujo, tratando la causa mecánica principal.',
          },
          {
            drug: 'Crema tópica con Hidrocortisona 1% / Lidocaína (ciclo breve si prurito o edema local)',
            dose: 'Capa fina (~0.5 cm de crema) aplicada localmente post-aseo',
            route: 'Tópica rectal',
            frequency: 'Cada 12 horas',
            duration: 'Máximo 5 a 7 días',
            rationale: 'Alivio sintomático transitorio de congestión y molestia local.',
          },
        ],
        generalMeasures: [
          'Baños de asiento con agua tibia 10-15 minutos 2 veces al día para descongestionar el plexo hemorroidal.',
          'No permanecer más de 3-5 minutos sentado en el inodoro ni pujar con fuerza; usar banquito elevador de pies si ayuda.',
          'Ingerir 2 a 2.5 litros de agua al día y aumentar frutas, verduras y avena.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valoración quirúrgica / proctológica si presenta trombosis hemorroidal con dolor agudo severo, hemorroides que ya no regresan adentro (grado III-IV), sangrado abundante con anemia o ≥45 años para colonoscopia de cribado.',
        ],
        followUp: 'Control en 3-4 semanas para verificar resolución del sangrado.',
      },
      criticalSafetyAlerts: [
        'NO prolongar pomadas con corticoides tópicos rectales más de 7 días por riesgo de atrofia mucosa y sobreinfección.',
        'Nunca asumir que toda rectorragia en adultos mayores de 45-50 años es solo hemorroidal sin explorar ni considerar tamizaje colorrectal.',
      ],
      guidelineReferences: [
        'ASCRS Clinical Practice Guidelines for the Management of Hemorrhoids',
        'ACG Clinical Guideline: Management of Benign Anorectal Disorders',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Fernando, programador de 42 años asustado porque le salió sangre roja brillante en el papel al hacer del baño duro y siente una bolita que sale y se vuelve a meter.',
  },
  {
    id: 'case-mg-otitis-externa',
    mode: 'medico_general',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Lucas Emiliano Ortiz (acompañado de su mamá)',
      age: 9,
      sex: 'Masculino',
      occupation: 'Estudiante de primaria (clases de natación)',
      consultReason: 'Dolor agudo en el oído derecho',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente de 9 años que acude con su madre por dolor agudo en el oído derecho desde hace 48 horas. Estuvo yendo diario al curso de natación esta semana y sintió mucha picazón en el oído antes de empezar con el dolor fuerte; además le limpiaron la oreja con hisopos de algodón ayer. Ahora llora si le tocan la oreja o al masticar, y ha salido un poquito de secreción blanquecina escasa. Niega fiebre alta, catarro previo o vómitos.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '102/64 mmHg',
      heartRate: 88,
      respiratoryRate: 19,
      temperature: 36.9,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 30,
      heightCm: 134,
    },
    background: {
      pathological: ['Sano previamente; sin cuadros frecuentes de otitis media.'],
      nonPathological: ['Asiste a alberca 5 días a la semana; uso reciente de hisopos (cotonetes) en casa.'],
      family: ['Padres sanos.'],
      surgical: ['Niega cirugías.'],
      currentMedications: ['Tomó una dosis de paracetamol hace 4 horas con alivio parcial.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-oido-externa',
        system: 'Cabeza y Cuello',
        name: 'Exploración auricular externa y otoscopia bilateral',
        finding:
          'Dolor agudo e intenso al presionar la región cartilaginosa anterior al conducto auditivo y al traccionar suavemente el pabellón auricular derecho hacia arriba y atrás. Conducto auditivo externo derecho edematoso, eritematoso y estrechado con detritus blanquecinos húmedos; membrana timpánica parcialmente visible de aspecto íntegro sin abombamiento ni perforación. Oído izquierdo completamente normal.',
        isAbnormal: true,
        semiologyNote: 'Signo del trago positivo + conducto auditivo edematoso + antecedente de natación/hisopos = Otitis externa aguda.',
      },
    ],
    studiesPool: [
      {
        id: 'lab-bh-otitis-ext',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática Completa',
        result: 'Hemoglobina: 13.0 g/dL | Leucocitos: 8,200 /mm³ | Plaquetas: 280,000 /mm³.',
        referenceRange: 'Leucocitos 5,000-13,000 /mm³ en edad escolar',
        interpretation: 'Sin leucocitosis sistémica; infección localizada superficial en conducto auditivo.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Otitis Externa Aguda Difusa ("Oído del Nadador")',
      differentialDiagnoses: [
        'Otitis media aguda',
        'Forúnculo de conducto auditivo externo',
        'Cuerpo extraño en conducto auditivo',
        'Otomicosis (si prurito persistente tras antibióticos)',
      ],
      pathophysiology:
        'La humedad retenida tras natación y el microtrauma mecánico con hisopos remueven el cerumen protector y alcalinizan la piel del conducto auditivo externo, favoreciendo infección bacteriana superficial (principalmente Pseudomonas aeruginosa y Staphylococcus aureus) con edema doloroso del conducto.',
      keyClinicalClues: [
        'Dolor intenso en oído derecho tras clases de natación y uso de hisopos',
        'Signo del trago y tracción auricular claramente positivos (dolor al palpar fuera y al masticar)',
        'Conducto auditivo inflamado con detritus sin abombamiento timpánico ni catarro previo',
      ],
      characteristicSignsSymptoms: [
        'Dolor exquisito al presionar el trago o mover la oreja',
        'Antecedente reciente de alberca o manipulación con cotonetes',
        'Conducto auditivo hinchado y estrecho',
      ],
      criticalRulingOutFactors: [
        'En otitis media aguda el signo del trago suele ser negativo y el tímpano está abombado/opaco tras catarro; aquí el dolor es externo al trago y hay antecedente acuático.',
        'Ausencia de edema retroauricular y fiebre alta descarta mastoiditis u otitis externa maligna.',
      ],
      recommendedWorkup: [
        'Diagnóstico clínico otoscópico; no requiere cultivos ni estudios de imagen en cuadro no complicado',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ciprofloxacino + Hidrocortisona o Neomicina/Polimixina B/Hidrocortisona gotas óticas',
            dose: '3 a 4 gotas en el oído derecho (entibiar frasco en la mano antes)',
            route: 'Ótica tópica',
            frequency: 'Cada 8 o 12 horas (según presentación)',
            duration: '7 días',
            rationale: 'Tratamiento de primera línea: las gotas tópicas alcanzan concentraciones 1000 veces mayores que antibióticos orales frente a Pseudomonas/S. aureus y el corticoide reduce edema y dolor.',
          },
          {
            drug: 'Ibuprofeno pediátrico (analgesia sistémica)',
            dose: '300 mg (10 mg/kg/dosis en 30 kg)',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas por dolor',
            duration: '3 días',
            rationale: 'El dolor en el oído externo suele ser intenso los primeros 2 días.',
          },
        ],
        generalMeasures: [
          'Mantener el oído completamente seco durante 7 a 10 días (suspender natación y proteger con algodón impregnado en vaselina externa al bañarse).',
          'Prohibir estrictamente volver a introducir hisopos, llaves o pasadores en el oído.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Valorar urgente si aparece inflamación/enrojecimiento detrás de la oreja, fiebre alta o falta de mejoría tras 48-72 horas de gotas.',
        ],
        followUp: 'Reevaluación en 48-72 horas solo si persiste dolor intenso.',
      },
      criticalSafetyAlerts: [
        'NO prescribir antibióticos orales sistémicos (amoxicilina) en otitis externa aguda no complicada: son ineficaces contra Pseudomonas y el tratamiento óptimo es TÓPICO en gotas óticas.',
        'Evitar gotas óticas aminoglucósidas (neomicina) si existe sospecha de membrana timpánica perforada; preferir fluoroquinolona ótica (ciprofloxacino).',
      ],
      guidelineReferences: [
        'AAO-HNS Clinical Practice Guideline: Acute Otitis Externa',
      ],
    },
    internalPersonaPrompt:
      'Habla como la mamá de Lucas (niño de 9 años) contando que al niño le duele muchísimo la oreja derecha desde que salió de natación y ella le limpió con cotonetes; pega un brinco cuando le tocan la orejita.',
  },
  {
    id: 'case-mg-dislipidemia',
    mode: 'medico_general',
    specialty: 'endocrinologia',
    patientInfo: {
      name: 'Alberto Enrique Mendoza',
      age: 48,
      sex: 'Masculino',
      occupation: 'Administrador de bodega',
      consultReason: 'Revisión de análisis médicos de chequeo general',
      evolutionTime: 'Chequeo de rutina (sin síntomas agudos)',
      currentIllness:
        'Paciente masculino de 48 años que acude a consulta externa para revisar exámenes de rutina de su empresa porque le marcaron asteriscos en "colesterol y triglicéridos altos". Se siente prácticamente asintomático, salvo ligero cansancio después de almuerzos pesados. Lleva vida muy sedentaria, cena tarde tortillas, pan dulce y refrescos, y ha subido 7 kg en los últimos 3 años acumulando grasa en la cintura. Niega dolor de pecho, sed excesiva o falta de aire.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '134/84 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 112,
      weightKg: 94,
      heightCm: 173,
    },
    background: {
      pathological: ['Obesidad abdominal (IMC 31.4 kg/m²); hipertensión limítrofe no tratada previamente.'],
      nonPathological: ['Dieta rica en carbohidratos simples, azúcares añadidos y grasas saturadas; sedentarismo completo; fuma 2 cigarrillos ocasionales.'],
      family: ['Sin antecedentes heredofamiliares de relevancia conocidos.'],
      surgical: ['Niega cirugías previas.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-antropo-dislipidemia',
        system: 'General',
        name: 'Antropometría, perímetro abdominal y búsqueda de signos cutáneos metabólicos',
        finding:
          'IMC: 31.4 kg/m² (obesidad grado I). Perímetro abdominal: 106 cm (elevado >94/102 cm). Discreta acantosis nigricans en pliegue posterior del cuello (marcador clínico de resistencia a la insulina). Sin xantomas tendinosos ni xantelasmas.',
        isAbnormal: true,
        semiologyNote: 'Obesidad abdominal + acantosis nigricans + glucemia basal alterada (112 mg/dL) + PA 134/84 mmHg conforman Síndrome Metabólico.',
      },
      {
        id: 'pe-cardio-dislipidemia',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y pulsos periféricos',
        finding:
          'Ruidos cardíacos rítmicos sin soplos; pulsos carotídeos y pedios presentes y simétricos sin soplos vasculares.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'lab-lipidos-metab',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Perfil de Lípidos en ayunas y Glucosa / HbA1c',
        result:
          'Colesterol Total: 264 mg/dL | Colesterol LDL: 172 mg/dL (elevado) | Colesterol HDL: 34 mg/dL (bajo) | Triglicéridos: 290 mg/dL (elevados) | Glucosa en ayunas: 112 mg/dL | HbA1c: 6.0% (elevada).',
        referenceRange: 'LDL <100-130 mg/dL | HDL >40 mg/dL | TG <150 mg/dL | Glucosa <100 mg/dL | HbA1c <5.7%',
        interpretation: 'Dislipidemia mixta aterogénica + glucemia en ayunas alterada (prediabetes) + HDL bajo.',
        isAbnormal: true,
      },
      {
        id: 'lab-hep-metab',
        category: 'Laboratorio',
        subcategory: 'Función Hepática',
        name: 'Pruebas de función hepática (AST, ALT) y TSH',
        result: 'AST: 34 U/L | ALT: 48 U/L (discretamente elevada) | TSH: 2.4 mUI/L.',
        referenceRange: 'ALT <40 U/L | TSH 0.4-4.0 mUI/L',
        interpretation: 'Elevación leve de ALT acorde a hígado graso metabólico; función tiroidea normal (descarta dislipidemia secundaria a hipotiroidismo).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Síndrome Metabólico y Dislipidemia Mixta (con Prediabetes)',
      differentialDiagnoses: [
        'Hipercolesterolemia familiar heterocigota',
        'Dislipidemia secundaria a hipotiroidismo o síndrome nefrótico',
        'Diabetes mellitus tipo 2 establecida',
        'Esteatosis hepática aislada',
      ],
      pathophysiology:
        'La adiposidad visceral y resistencia a la insulina incrementan la lipólisis de ácidos grasos libres hacia el hígado, aumentando la síntesis de VLDL rica en triglicéridos, disminuyendo el HDL protector y elevando partículas LDL aterogénicas, acompañadas de glucosa basal alterada y presión arterial limítrofe (criterios ATP III / IDF de Síndrome Metabólico).',
      keyClinicalClues: [
        'Obesidad abdominal (106 cm) + acantosis nigricans + historia familiar de cardiopatía isquémica temprana (padre 56 años)',
        'Dislipidemia mixta (LDL 172, TG 290, HDL 34 mg/dL) con glucemia 112 mg/dL (HbA1c 6.0%) y PA 134/84 mmHg',
        'ALT discretamente elevada y TSH normal',
      ],
      characteristicSignsSymptoms: [
        'Asintomático con hallazgo metabólico en análisis de rutina',
        'Obesidad abdominal y acantosis nigricans cervical',
        'Cumple 5/5 criterios de Síndrome Metabólico',
      ],
      criticalRulingOutFactors: [
        'TSH normal descarta hipotiroidismo secundario.',
        'Glucosa 112 mg/dL y HbA1c 6.0% ubican en prediabetes (aún no cumple criterio de DM2 ≥126 mg/dL o ≥6.5%).',
      ],
      recommendedWorkup: [
        'Cálculo de riesgo cardiovascular global (ASCVD / Framingham / OMS)',
        'Perfil lipídico, glucemia/HbA1c, función hepática basal (antes de estatina) y TSH',
      ],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Atorvastatina (estatina de moderada-alta intensidad)',
            dose: '20 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la noche',
            duration: 'Crónico con control metabólico cada 3-6 meses',
            rationale: 'Con LDL 172 mg/dL + múltiples factores de riesgo CV + antecedente paterno temprano, la estatina reduce significativamente eventos cardiovasculares mayores (AHA/ACC / ESC).',
          },
        ],
        generalMeasures: [
          'Plan nutricional hipocalórico estilo mediterráneo: eliminar bebidas azucaradas, pan dulce, alcohol y grasas trans; aumentar fibra y pescado.',
          'Ejercicio aeróbico + fuerza progresiva (150-300 min/semana) buscando pérdida ponderal inicial del 7-10%.',
          'Suspensión total del tabaquismo y monitoreo domiciliario de presión arterial.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: [
          'Referir a urgencias si presenta dolor torácico opresivo o disnea de esfuerzo; considerar ecografía hepática ambulatoria por ALT limítrofe.',
        ],
        followUp: 'Control de perfil lipídico, glucosa/HbA1c, presión arterial y transaminasas en 8 a 12 semanas.',
      },
      criticalSafetyAlerts: [
        'NO combinar de entrada gemfibrozilo + estatina por alto riesgo de miopatía/rabdomiólisis (además con TG de 290 mg/dL <500 mg/dL no hay riesgo agudo de pancreatitis y la prioridad cardiovascular es bajar el LDL con estatina + dieta/ejercicio).',
        'No pasar por alto el cálculo del riesgo cardiovascular ni la prediabetes (HbA1c 6.0%) que requiere intervención intensiva en estilo de vida.',
      ],
      guidelineReferences: [
        'AHA/ACC Guideline on the Management of Blood Cholesterol',
        'ESC/EAS Guidelines for the Management of Dyslipidaemias & ADA Standards of Care (Prediabetes)',
      ],
    },
    internalPersonaPrompt:
      'Habla en primera persona como Alberto, hombre de 48 años que viene tranquilo a enseñar sus análisis del chequeo anual donde le salieron altos el colesterol, los triglicéridos y un poco el azúcar.',
  },
];
