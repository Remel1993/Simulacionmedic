import { ClinicalCase } from '../types/clinical';

/**
 * Ampliación Curada (Bloque B): 17 casos clínicos comunes adicionales
 * (completing 35 common pathologies across rheumatology, nephrology, urology,
 * pulmonology, cardiology, psychiatry, neurology, and toxicology).
 */
export const COMMON_EXPANSION_CASES_B: ClinicalCase[] = [
  {
    id: 'case-exp-com-artritis-reumatoide',
    mode: 'medico_general',
    specialty: 'reumatologia',
    patientInfo: {
      name: 'Patricia Elena Montes',
      age: 41,
      sex: 'Femenino',
      occupation: 'Secretaria ejecutiva',
      consultReason: 'Dolor e inflamación simétrica en articulaciones de ambas manos y rigidez al despertar',
      evolutionTime: '4 meses de evolución',
      currentIllness:
        'Paciente femenina de 41 años que acude porque desde hace cuatro meses presenta dolor, hinchazón blanda y calor progresivo en los nudillos y muñecas de ambas manos de forma simétrica, así como molestia en antepiés al levantarse de la cama. Refiere que sus manos amanecen sumamente rígidas y torpes durante más de una hora y media cada mañana ("le cuesta abotonarse la blusa"), mejorando parcialmente con el movimiento durante el día. Niega lesiones cutáneas descamativas o fiebre alta.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 80,
      respiratoryRate: 16,
      temperature: 37.1,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 64,
      heightCm: 163,
    },
    background: {
      pathological: ['Sin enfermedades crónicas diagnosticadas.'],
      nonPathological: ['Fuma 5 cigarrillos diarios desde los 22 años (factor de riesgo para AR seropositiva).'],
      family: ['Sin antecedentes heredofamiliares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Toma diclofenaco casi a diario para poder teclear en la oficina.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-ar-manos',
        system: 'Osteomuscular y Piel',
        name: 'Exploración articular sistemática de manos, muñecas y pies',
        finding:
          'Sinovitis simétrica palpable (aumento de volumen blando-gomoso y dolor a la compresión) en articulaciones metacarpofalángicas (2.ª a 4.ª), interfalángicas proximales y ambas muñecas, respetando las interfalángicas distales. Signo de compresión metatarsiana ("Squeeze test") positivo bilateral en antepiés. Fuerza de prensión disminuida por dolor; sin nódulos de Heberden ni placas psoriásicas.',
        isAbnormal: true,
        semiologyNote:
          'Poliartritis inflamatoria simétrica crónica (>6 semanas) de MCF, IFP y muñecas respetando IFD con rigidez matutina >60 min es típica de Artritis Reumatoide.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-ar-inmuno',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'Factor Reumatoide (FR), Anti-CCP, VSG y PCR',
        result: 'Anticuerpos Anti-CCP: 185 U/mL (Muy positivo) | Factor Reumatoide: 96 UI/mL (Positivo) | VSG: 48 mm/h | PCR: 24 mg/L.',
        referenceRange: 'Anti-CCP <20 U/mL | FR <14 UI/mL | PCR <5 mg/L',
        interpretation: 'Poliartritis seropositiva con elevación franca de reactantes de fase aguda (cumple criterios ACR/EULAR 2010 para AR).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-ar-rx',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía comparativa de manos y muñecas + Panel basal pre-FAME',
        result: 'Osteopenia yuxtaarticular incipiente en MCF e IFP bilaterales y aumento de partes blandas periarticulares sin erosiones óseas avanzadas todavía. AST/ALT y creatinina normales.',
        referenceRange: 'Sin osteopenia yuxtaarticular ni erosiones',
        interpretation: 'Estadio temprano sin daño estructural irreversible: ventana de oportunidad ideal para iniciar FAME.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Artritis Reumatoide Temprana Seropositiva',
      differentialDiagnoses: [
        'Osteoartritis erosiva de manos (afecta IFD, rigidez <30 min)',
        'Artritis psoriásica (afecta IFD, dactilitis y placas cutáneas)',
        'Lupus eritematoso sistémico (artritis no erosiva con compromiso sistémico)',
        'Artritis viral por parvovirus B19 o Chikungunya (duración <6 semanas)',
      ],
      pathophysiology:
        'Enfermedad autoinmune sistémica mediada por linfocitos T/B y autoanticuerpos (anti-CCP, FR) que induce hiperplasia inflamatoria de la membrana sinovial (pannus), produciendo sinovitis persistente y eventual erosión cartilaginosa y ósea.',
      keyClinicalClues: [
        'Poliartritis simétrica crónica (>6 semanas) de muñecas, MCF e IFP respetando IFD',
        'Rigidez matutina >60 minutos que mejora con la actividad',
        'Anti-CCP y Factor Reumatoide fuertemente positivos con VSG/PCR elevadas',
      ],
      characteristicSignsSymptoms: [
        'Sinovitis simétrica de pequeñas articulaciones (MCF/IFP/muñecas)',
        'Rigidez matutina prolongada (>1 hora)',
        'Respeto característico de articulaciones interfalángicas distales (IFD)',
      ],
      criticalRulingOutFactors: [
        'Duración >6 semanas descarta artritis viral autolimitada; respeto de IFD y ausencia de psoriasis/nódulos de Heberden diferencian de artrosis y psoriásica.',
      ],
      recommendedWorkup: ['Anti-CCP, FR, VSG/PCR, radiografía basal de manos/pies, BH, PFH, creatinina y serologías virales pre-metotrexato'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metotrexato (FAME de primera línea) + Ácido fólico',
            dose: 'Metotrexato 10-15 mg semanales VO + Ácido fólico 5 mg semanal (24-48 h después)',
            route: 'Vía Oral',
            frequency: 'Una vez por semana (fijo)',
            duration: 'Crónico con monitoreo periódico por Reumatología',
            rationale: 'Fármaco modificador de la enfermedad (FAME) ancla que frena la progresión erosiva si se inicia tempranamente.',
          },
          {
            drug: 'Prednisona (terapia puente de inicio rápido a dosis baja)',
            dose: '5 a 10 mg',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la mañana',
            duration: 'Puente corto de 4 a 8 semanas con descenso gradual hasta suspender',
            rationale: 'Controla sinovitis dolorosa mientras el metotrexato alcanza eficacia plena (6-12 semanas).',
          },
        ],
        generalMeasures: [
          'Cese absoluto del tabaquismo (el tabaco empeora la inflamación y reduce respuesta a FAME).',
          'Referencia prioritaria a Reumatología y evitar automedicación crónica exclusiva con AINEs sin FAME.',
          'Descartar embarazo y explicar estrictamente anticoncepción segura durante tratamiento con metotrexato.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Confirmación de poliartritis inflamatoria para inicio y titulación de FAME por Reumatología en <6 semanas.'],
        followUp: 'Control con biometría hemática y transaminasas en 4 semanas al iniciar metotrexato.',
      },
      criticalSafetyAlerts: [
        'Metotrexato es estrictamente TERATOGÉNICO (contraindicado en embarazo) y se administra UNA VEZ A LA SEMANA, nunca diario (error letal por mielosupresión).',
        'No manejar AR únicamente con AINEs o corticoides crónicos sin FAME: permite daño articular irreversible.',
      ],
      guidelineReferences: [
        'EULAR 2022 Recommendations for Management of Rheumatoid Arthritis',
        'ACR Guideline for the Treatment of Rheumatoid Arthritis',
      ],
    },
    internalPersonaPrompt:
      'Habla como Patricia, secretaria de 41 años. Desde hace 4 meses te duelen y se te hinchan los nudillos y muñecas de ambas manos por igual, y amaneces muy tiesa por más de una hora.',
  },
  {
    id: 'case-exp-com-lupus-brote',
    mode: 'residente',
    specialty: 'reumatologia',
    patientInfo: {
      name: 'Mariana Isabel Salgado',
      age: 26,
      sex: 'Femenino',
      occupation: 'Arquitecta',
      consultReason: 'Enrojecimiento en el rostro que empeora al sol, llagas en la boca y dolor articular',
      evolutionTime: '6 semanas de evolución',
      currentIllness:
        'Paciente femenina de 26 años que consulta por fatiga intensa, fiebre intermitente de 38.0°C, dolor e inflamación migratoria en muñecas y rodillas, caída abundante de cabello y aparición en el último mes de un enrojecimiento persistente sobre el puente nasal y ambas mejillas que empeora notablemente al exponerse al sol. Refiere además úlceras no dolorosas en el paladar y leve hinchazón de párpados al despertar.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '144/90 mmHg',
      heartRate: 92,
      respiratoryRate: 18,
      temperature: 37.9,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 90,
      weightKg: 58,
      heightCm: 166,
    },
    background: {
      pathological: ['Dos episodios previos inexplicados de pleuritis leve el año pasado.'],
      nonPathological: ['Trabaja en supervisión de obra al sol. No fuma.'],
      family: ['Padres aparentemente sanos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Exantema previo con trimetoprim-sulfametoxazol.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-les-cara',
        system: 'Cabeza y Cuello',
        name: 'Inspección facial, mucosa oral y cuero cabelludo',
        finding:
          'Eritema maculopapular simétrico en regiones malares y dorso nasal ("en alas de mariposa") que respeta característicamente los surcos nasogenianos. Dos úlceras eritematosas indoloras en paladar duro y áreas difusas de alopecia no cicatricial. Sinovitis leve no deformante en muñecas.',
        isAbnormal: true,
        semiologyNote:
          'Exantema malar que respeta surcos nasolabiales + fotosensibilidad + úlceras orales + artritis + HTA nueva orientan a LES con posible nefritis lúpica.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-les-inmuno',
        category: 'Laboratorio',
        subcategory: 'Inflamación e Infección',
        name: 'ANA, Anti-dsDNA, Complemento C3/C4 y Biometría Hemática',
        result:
          'ANA: POSITIVO 1:1280 patrón homogéneo | Anti-dsDNA: POSITIVO alto (140 UI/mL) | C3: 48 mg/dL (bajo) | C4: 8 mg/dL (bajo) | Hb: 10.2 g/dL | Leucocitos: 3,200 /mm³ (Linfocitos 680 /mm³) | Plaquetas: 118,000 /mm³.',
        referenceRange: 'ANA negativo | C3 90-180 mg/dL | Leucocitos >4,500 /mm³',
        interpretation: 'Bicitopenia/citopenias autoinmunes + hipocomplementemia + Anti-dsDNA elevado: alta actividad inmunológica de LES.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-les-ego',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO) + Relación Proteína/Creatinina + Creatinina',
        result: 'Creatinina: 1.3 mg/dL | EGO: Proteínas +++, eritrocitos 18/campo dismórficos, cilindros hemáticos y granulosos | Índice Proteína/Creatinina: 1,450 mg/g.',
        referenceRange: 'Proteínas negativas | Creatinina 0.6-1.1 mg/dL | Relación P/C <150 mg/g',
        interpretation: 'Sedimento urinario activo con proteinuria significativa e hipertensión arterial: fuerte sospecha de nefritis lúpica activa.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Lupus Eritematoso Sistémico (LES) Activo con Sospecha de Nefritis Lúpica',
      differentialDiagnoses: [
        'Rosácea facial (no respeta surco nasogeniano ni causa citopenias/nefritis)',
        'Artritis reumatoide',
        'Síndrome de Sjögren o enfermedad mixta del tejido conectivo',
        'Infección viral diseminada (VIH / Parvovirus B19 / VEB)',
      ],
      pathophysiology:
        'Pérdida de autotolerancia frente a antígenos nucleares con producción de autoanticuerpos (ANA, anti-dsDNA), formación de inmunocomplejos circulantes, activación/consumo del complemento (C3/C4 bajos) e inflamación multiorgánica vascular, cutánea y glomerular.',
      keyClinicalClues: [
        'Mujer joven con exantema malar fotosensible que respeta surcos nasogenianos, úlceras orales indoloras, alopecia y artritis',
        'ANA 1:1280 + Anti-dsDNA positivo + C3/C4 consumidos + leucopenia/linfopenia/trombocitopenia',
        'Hipertensión arterial nueva + proteinuria + eritrocitos dismórficos/cilindros hemáticos (nefritis lúpica)',
      ],
      characteristicSignsSymptoms: [
        'Exantema malar en alas de mariposa con fotosensibilidad',
        'Úlceras palatinas indoloras y artritis no erosiva',
        'Citopenias, hipocomplementemia y sedimento urinario nefrítico',
      ],
      criticalRulingOutFactors: [
        'Siempre buscar sedimento activo e hipertensión en todo brote de LES para no pasar por alto nefritis lúpica.',
      ],
      recommendedWorkup: ['ANA, anti-dsDNA, anti-Sm, C3/C4, EGO con sedimento, relación proteína/creatinina y biopsia renal urgente'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Hidroxicloroquina (terapia de base obligatoria en todo LES)',
            dose: '200 a 400 mg (≤5 mg/kg/día de peso real)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Indefinida con tamizaje oftalmológico anual',
            rationale: 'Reduce brotes, daño orgánico, riesgo trombótico y mortalidad a largo plazo en todos los pacientes con LES.',
          },
          {
            drug: 'Metilprednisolona pulsos / Prednisona + Micofenolato de mofetilo (coordinado con Reumatología/Nefrología)',
            dose: 'Prednisona 0.5-1 mg/kg/día (tras confirmación/evaluación renal) + antihipertensivo IECA/ARA-II',
            route: 'Vía Oral / Intravenosa hospitalaria si nefritis III-IV',
            frequency: 'Según protocolo de inducción tras biopsia renal',
            duration: 'Fase de inducción con descenso progresivo de esteroide',
            rationale: 'Controla inflamación glomerular aguda para preservar función renal.',
          },
        ],
        generalMeasures: [
          'Fotoprotección estricta diaria (protector solar FPS 50+ UVA/UVB cada 3-4 horas, ropa protectora y evitar sol directo).',
          'Evitar sulfas (TMP-SMX) y estrógenos orales en enfermedad activa o antifosfolípidos.',
          'Ingreso / evaluación prioritaria por Reumatología y Nefrología para biopsia renal clasificatoria.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Sedimento urinario activo con proteinuria/creatinina elevada (requiere biopsia renal urgente e inducción inmunosupresora).'],
        followUp: 'Estudio intrahospitalario para biopsia renal y panel antifosfolípido.',
      },
      criticalSafetyAlerts: [
        'NUNCA omitir el EGO y función renal ante sospecha de LES: la nefritis lúpica suele ser asintomática al inicio pero amenaza la vida renal.',
        'Evitar sulfonamidas (TMP-SMX) que precipitan brotes lúpicos y verificar peso real para no exceder 5 mg/kg/día de hidroxicloroquina.',
      ],
      guidelineReferences: [
        'EULAR 2023 Recommendations for the Management of Systemic Lupus Erythematosus',
        'KDIGO 2024 Clinical Practice Guideline for Lupus Nephritis',
      ],
    },
    internalPersonaPrompt:
      'Habla como Mariana, arquitecta de 26 años. Desde hace 6 semanas tienes mucho cansancio, caída de cabello, llagas que no duelen en el paladar, dolor en muñecas y una mancha roja en mejillas que empeora al sol.',
  },
  {
    id: 'case-exp-com-erc-diabetica',
    mode: 'medico_general',
    specialty: 'nefrologia',
    patientInfo: {
      name: 'Héctor Ramiro Salcedo',
      age: 62,
      sex: 'Masculino',
      occupation: 'Taxista',
      consultReason: 'Orina espumosa, hinchazón de tobillos y cansancio progresivo',
      evolutionTime: '4 meses de evolución progresiva',
      currentIllness:
        'Paciente masculino de 62 años con diabetes mellitus tipo 2 desde hace 14 años e hipertensión arterial, que acude por notar desde hace cuatro meses orina persistentemente muy espumosa, hinchazón blanda de ambos pies al final del día y fatigabilidad creciente. Su glucosa en casa oscila entre 150 y 210 mg/dL y dejó de tomar sus medicamentos para la presión hace medio año por falta de seguimiento. Niega ardor al orinar, fiebre o falta de aire en reposo.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '154/92 mmHg',
      heartRate: 78,
      respiratoryRate: 17,
      temperature: 36.6,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 178,
      weightKg: 83,
      heightCm: 171,
    },
    background: {
      pathological: ['DM2 de 14 años de diagnóstico con retinopatía no proliferativa leve; HTA crónica de 10 años.'],
      nonPathological: ['Consume sal abundante en comida rápida y refrescos diarios durante jornada laboral.'],
      family: ['Sin antecedentes familiares relevantes referidos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Metformina 850 mg cada 12 h; suspendió losartán hace 6 meses; usa ketorolaco frecuente para dolor de espalda.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-erc-gen',
        system: 'General',
        name: 'Exploración cardiovascular, fondo de ojo y miembros inferiores',
        finding:
          'Palidez leve de mucosas. Edema blando bilateral en tobillos y tercio inferior de piernas con fóvea (godet ++/++++). Campos pulmonares limpios sin estertores basales. Pulsos pedios presentes; sensibilidad vibratoria ligeramente disminuida en ortejos.',
        isAbnormal: true,
        semiologyNote:
          'Orina espumosa + edema maleolar + DM2 de >10 años con retinopatía y mal control glucémico/tensional apunta fuertemente a nefropatía diabética.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-erc-renal',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química sanguínea, TFG estimada (CKD-EPI), HbA1c y Electrolitos',
        result:
          'Creatinina sérica: 1.95 mg/dL (hace 6 meses era 1.85 mg/dL) | TFGe (CKD-EPI): 37 mL/min/1.73 m² | Urea: 64 mg/dL | K+: 4.7 mEq/L | HbA1c: 8.6% | Hb: 11.4 g/dL normocítica normocrómica.',
        referenceRange: 'TFGe ≥60 mL/min/1.73 m² | Creatinina 0.7-1.3 mg/dL | HbA1c <7%',
        interpretation: 'Deterioro crónico (>3 meses) de TFGe en rango 30-44 mL/min/1.73 m²: Enfermedad Renal Crónica estadio G3b.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-erc-alb',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Cociente Albúmina/Creatinina en orina (CAC) y EGO + Ecografía renal',
        result:
          'Cociente Albúmina/Creatinina (CAC): 680 mg/g (albuminuria A3 severamente aumentada) | EGO: Proteínas ++, glucosa ++, sin eritrocitos dismórficos ni leucocituria. Ecografía: riñones de tamaño conservado (10.2 cm) con aumento difuso de ecogenicidad cortical sin hidronefrosis.',
        referenceRange: 'CAC <30 mg/g',
        interpretation: 'ERC G3b A3 clásica por nefropatía diabética sin uropatía obstructiva.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad Renal Crónica (ERC Estadio G3b A3) Secundaria a Nefropatía Diabética',
      differentialDiagnoses: [
        'Lesión renal aguda prerrenal o por AINEs (descartada por cronicidad >3 meses con creatinina previa de 1.85)',
        'Glomerulonefritis primaria no diabética (sedimento sin hematuria dismórfica)',
        'Nefropatía obstructiva prostática (descartada por ecografía sin hidronefrosis)',
      ],
      pathophysiology:
        'Hiperfiltración glomerular crónica e hiperglucemia sostenida generan glicación avanzada, hipertrofia mesangial, engrosamiento de membrana basal glomerular y esclerosis nodular (Kimmelstiel-Wilson) con albuminuria progresiva y caída nefronal.',
      keyClinicalClues: [
        'Diabetes de 14 años con retinopatía, HTA no tratada, orina espumosa y edema maleolar',
        'TFGe 37 mL/min/1.73 m² sostenida >3 meses (estadio G3b) + CAC 680 mg/g (A3)',
        'Uso frecuente de ketorolaco (AINE nefrotóxico) y suspensión de bloqueo del SRAA',
      ],
      characteristicSignsSymptoms: [
        'Orina espumosa por albuminuria severa',
        'Edema periférico y anemia normocítica leve',
        'TFGe <45 sostenida >3 meses + CAC >300 mg/g',
      ],
      criticalRulingOutFactors: [
        'Cronicidad confirmada con creatinina previa de hace 6 meses (1.85 -> 1.95) distingue ERC de LRA.',
        'Ecografía descarta obstrucción urinaria; sedimento sin hematuria apoya nefropatía diabética.',
      ],
      recommendedWorkup: ['Creatinina/TFGe, CAC urinario, electrolitos, EGO, HbA1c y ultrasonido renal'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Losartán o Enalapril (bloqueo SRAA nefroprotector)',
            dose: 'Losartán 50 mg (titular según PA y potasio)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Crónico indefinido (controlar creatinina y K+ en 2-4 semanas)',
            rationale: 'Reduce presión intraglomerular y albuminuria, frenando progresión de ERC diabética.',
          },
          {
            drug: 'Empagliflozina o Dapagliflozina (iSGLT2 nefroprotector)',
            dose: 'Empagliflozina 10 mg (o Dapagliflozina 10 mg)',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas',
            duration: 'Crónico indefinido (junto con ajuste de Metformina a máx 1000 mg/día por TFGe 30-44)',
            rationale: 'Evidencia sólida KDIGO de nefroprotección, reducción de progresión a diálisis y riesgo cardiovascular con TFGe ≥20.',
          },
        ],
        generalMeasures: [
          'SUSPENDER DE INMEDIATO ketorolaco y todo AINE por alto riesgo de deterioro renal agudo sobre crónico.',
          'Ajustar dosis de metformina (reducir a máximo 1,000 mg/día con TFGe 30-44 y suspender si TFGe <30 por riesgo de acidosis láctica).',
          'Restricción moderada de sodio (<2 g/día), control estricto de PA (<130/80 mmHg) y referencia a Nefrología.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Hiperkalemia >5.5 mEq/L, sobrecarga hídrica refractaria, caída rápida de TFGe o TFGe <30 (referencia obligatoria a Nefrología).'],
        followUp: 'Control de creatinina y potasio sérico en 2 semanas tras reiniciar Losartán + iSGLT2.',
      },
      criticalSafetyAlerts: [
        'Prohibir AINEs (ketorolaco, ibuprofeno, naproxeno) de forma permanente.',
        'Ajustar dosis de metformina ante TFGe <45 mL/min/1.73 m² y vigilar potasio y creatinina tras reiniciar bloqueador SRAA.',
      ],
      guidelineReferences: [
        'KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
        'ADA/KDIGO Consensus Report on Diabetes Management in CKD',
      ],
    },
    internalPersonaPrompt:
      'Habla como Héctor, taxista de 62 años con diabetes hace 14 años. Notas la orina muy espumosa y pies hinchados desde hace meses; dejaste la pastilla de la presión y tomas ketorolaco para la espalda.',
  },
  {
    id: 'case-exp-com-sx-nefritico',
    mode: 'residente',
    specialty: 'pediatria',
    patientInfo: {
      name: 'Diego Mateo León',
      age: 8,
      sex: 'Masculino',
      occupation: 'Estudiante de primaria',
      consultReason: 'Párpados hinchados al despertar y orina más oscura desde hace 2 días',
      evolutionTime: '2 días de evolución',
      currentIllness:
        'Paciente escolar de 8 años traído por su madre porque desde hace dos días amanece con los párpados muy hinchados y notaron que orina poco y de color café rojizo oscuro ("como té cargado o refresco de cola"). Niega dolor al orinar o traumatismo. Hace dos semanas tuvo infección de garganta con fiebre y dolor al tragar que no recibió antibiótico completo.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '136/90 mmHg',
      heartRate: 98,
      respiratoryRate: 22,
      temperature: 37.0,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 27,
      heightCm: 128,
    },
    background: {
      pathological: ['Faringoamigdalitis aguda hace 14 días sin tratamiento médico completo.'],
      nonPathological: ['Previamente sano; vacunación al día.'],
      family: ['Padres aparentemente sanos.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-gnpe-gen',
        system: 'General',
        name: 'Valoración de presión arterial pediátrica y edemas',
        finding:
          'Hipertensión arterial significativa para edad y talla (136/90 mmHg, >percentil 99). Edema periorbitario bilateral matutino marcado y edema pretibial leve con fóvea (+/++++). Crepitantes finos escasos en bases pulmonares por sobrecarga hídrica leve.',
        isAbnormal: true,
        semiologyNote:
          'Tríada de edema periorbitario + hematuria macroscópica oscura ("cola") + hipertensión arterial 2 semanas post-faringitis define síndrome nefrítico agudo.',
      },
      {
        id: 'pe-exp-gnpe-neuro',
        system: 'Neurológico',
        name: 'Estado neurológico y fondo de ojo',
        finding: 'Niño alerta, reactivo, sin cefalea intensa, convulsiones ni papiledema.',
        isAbnormal: false,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-gnpe-ego',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO) y Sedimento Urinario',
        result: 'Aspecto pardo-rojizo | Proteínas + (subnefrótico) | Hemoglobina +++ | Eritrocitos >100/campo (75% dismórficos / acantocitos) | Cilindros hemáticos presentes.',
        referenceRange: 'Eritrocitos <3/campo | Sin cilindros hemáticos',
        interpretation: 'Hematuria de origen glomerular confirmada por eritrocitos dismórficos y cilindros hemáticos.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-gnpe-inmuno',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Complemento sérico (C3/C4), Antiestreptolisina O (ASLO) y Creatinina',
        result: 'C3: 32 mg/dL (marcadamente disminuido) | C4: 22 mg/dL (normal) | ASLO: 640 UI/mL (elevado) | Creatinina: 1.05 mg/dL | K+: 4.9 mEq/L.',
        referenceRange: 'C3 90-180 mg/dL | C4 10-40 mg/dL | ASLO <200 UI/mL',
        interpretation: 'Hipocomplementemia aislada de C3 con C4 normal y ASLO elevado: diagnóstico clásico de Glomerulonefritis Aguda Postestreptocócica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Síndrome Nefrítico Agudo (Glomerulonefritis Aguda Postestreptocócica)',
      differentialDiagnoses: [
        'Nefropatía por IgA (sinfaringítica 1-3 días post-infección, C3 normal)',
        'Síndrome nefrótico infantil (edema masivo, proteinuria >3+, sin HTA ni hematuria franca)',
        'Nefritis lúpica (C3 y C4 bajos, ANA/anti-dsDNA positivos)',
        'Síndrome hemolítico urémico (anemia microangiopática y trombocitopenia)',
      ],
      pathophysiology:
        'Depósito glomerular de inmunocomplejos circulantes tras infección por cepas nefritogénicas de Streptococcus pyogenes (1-3 semanas post-faringitis o 3-6 semanas post-impétigo), con activación de la vía alterna del complemento (consumo selectivo de C3), proliferación endocapilar, caída de filtración glomerular y retención hidrosalina hipertensiva.',
      keyClinicalClues: [
        'Niño escolar con edema periorbitario + orina color "coca-cola" + hipertensión arterial + oliguria',
        'Antecedente de faringoamigdalitis hace 14 días (latencia de 2 semanas)',
        'Eritrocitos dismórficos/cilindros hemáticos + C3 muy bajo con C4 normal + ASLO elevado',
      ],
      characteristicSignsSymptoms: [
        'Hematuria macroscópica indolora ("agua de lavar carne" o cola)',
        'Edema periorbitario matutino',
        'Hipertensión arterial y consumo selectivo de C3',
      ],
      criticalRulingOutFactors: [
        'Latencia de 14 días + C3 bajo con C4 normal distingue GNPE de nefropatía por IgA (sinfaringítica con C3 normal) y de LES (C3+C4 bajos).',
      ],
      recommendedWorkup: ['EGO con sedimento, C3, C4, ASLO, creatinina, electrolitos y radiografía de tórax si disnea'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Furosemida IV (para sobrecarga hídrica e hipertensión volumen-dependiente)',
            dose: '1 mg/kg/dosis (25 mg)',
            route: 'Intravenosa',
            frequency: 'Cada 8 a 12 horas según diuresis y presión arterial',
            duration: 'Fase aguda hospitalaria (3 a 5 días)',
            rationale: 'Diurético de asa de primera línea para revertir retención hidrosalina, edema e hipertensión.',
          },
          {
            drug: 'Nifedipino o Hidralazina (si HTA severa refractaria a diurético) + Amoxicilina/Penicilina si faringitis aún positiva',
            dose: 'Nifedipino 0.25 mg/kg VO si crisis hipertensiva',
            route: 'Vía Oral',
            frequency: 'Según monitoreo estrecho de TA',
            duration: 'Fase aguda hasta normotensión',
            rationale: 'Previene encefalopatía hipertensiva y edema pulmonar agudo; el antibiótico erradica portación estreptocócica pero no altera curso glomerular.',
          },
        ],
        generalMeasures: [
          'Hospitalización para monitoreo estricto de presión arterial, balance hídrico estricto (ingresos/egresos) y peso diario.',
          'Restricción estricta de sodio (<1-2 g/día) y restricción hídrica acorde a pérdidas insensibles + diuresis.',
          'Vigilar datos de alarma: cefalea intensa, vómitos, visión borrosa o convulsiones (encefalopatía hipertensiva).',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Emergencia hipertensiva, edema agudo pulmonar, hiperkalemia severa o deterioro rápido de creatinina (Pediatría / Nefrología Pediátrica / UCIP).'],
        followUp: 'Control nefrológico ambulatorio verificando normalización de C3 a las 6-8 semanas (si sigue bajo, requiere biopsia).',
      },
      criticalSafetyAlerts: [
        'NO hidratar con cargas de solución salina a un niño con síndrome nefrítico agudo: agrava el edema agudo pulmonar y la crisis hipertensiva.',
        'Evitar IECA/ARA-II en fase aguda por riesgo de hiperpotasemia y caída adicional de filtración glomerular.',
      ],
      guidelineReferences: [
        'KDIGO Clinical Practice Guideline for Glomerular Diseases: Infection-Related Glomerulonephritis',
      ],
    },
    internalPersonaPrompt:
      'Responde como la mamá de Diego (8 años). Hace 2 días amaneció con los ojos muy hinchados y su orina salió oscura como refresco de cola; hace dos semanas tuvo anginas fuertes.',
  },
  {
    id: 'case-exp-com-prostatitis',
    mode: 'medico_general',
    specialty: 'urologia',
    patientInfo: {
      name: 'Arturo Eduardo Lozano',
      age: 48,
      sex: 'Masculino',
      occupation: 'Supervisor de logística',
      consultReason: 'Fiebre alta con escalofríos, dolor entre los testículos y el ano y ardor al orinar',
      evolutionTime: '36 horas de evolución',
      currentIllness:
        'Paciente masculino de 48 años que acude por cuadro agudo de 36 horas de evolución caracterizado por fiebre de 39.0°C con escalofríos intensos, dolor profundo y opresivo en el periné y región suprapúbica, disuria marcada, urgencia miccional, chorro urinario débil y sensación de vaciamiento vesical incompleto. Niega dolor en flancos lumbares o secreción uretral purulenta.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '116/74 mmHg',
      heartRate: 104,
      respiratoryRate: 20,
      temperature: 39.0,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 108,
      weightKg: 80,
      heightCm: 175,
    },
    background: {
      pathological: ['Niega litiasis previa; tuvo disuria leve pasajera hace dos semanas.'],
      nonPathological: ['Bebe poca agua; niega tabaquismo.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó paracetamol hace 3 horas.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-prostatitis-uro',
        system: 'Abdomen',
        name: 'Exploración abdominal, puñopercusión lumbar y tacto rectal suave',
        finding:
          'Sensibilidad suprapúbica leve sin globo vesical tenso; puñopercusión renal bilateral negativa. Al tacto rectal MUY SUAVE (sin masaje): próstata aumentada de tamaño, caliente, edematosa y exquisitamente dolorosa a la palpación mínima.',
        isAbnormal: true,
        semiologyNote:
          'Fiebre alta + síntomas urinarios irritativos/obstructivos + dolor perineal + próstata caliente muy dolorosa al tacto suave confirman prostatitis bacteriana aguda.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-prostatitis-ego',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO) + Urocultivo previo a antibiótico',
        result: 'EGO: Nitritos POSITIVOS, esterasa leucocitaria +++, piuria >50 leucocitos/campo, hematíes 8/campo. Urocultivo tomado antes de iniciar terapia.',
        referenceRange: 'Leucocitos <5/campo | Nitritos negativos',
        interpretation: 'Infección bacteriana aguda del tracto urinario con compromiso parenquimatoso prostático.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-prostatitis-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática y PCR',
        result: 'Hb 14.4 g/dL | Leucocitos: 16,200 /mm³ (Neutrófilos 84% con bandas) | PCR: 112 mg/L.',
        referenceRange: 'Leucocitos 4,500-10,500 /mm³ | PCR <5 mg/L',
        interpretation: 'Respuesta inflamatoria sistémica marcada secundaria a prostatitis aguda.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Prostatitis Bacteriana Aguda',
      differentialDiagnoses: [
        'Pielonefritis aguda (dolor en flanco, Giordano positivo)',
        'Cistitis aguda simple (sin fiebre alta ni dolor prostático)',
        'Absceso prostático (si persiste fiebre >48-72 h pese a antibiótico)',
        'Hiperplasia prostática benigna sin infección',
      ],
      pathophysiology:
        'Infección bacteriana aguda del parénquima prostático (principalmente por Escherichia coli u otros bacilos Gram negativos entéricos) por reflujo de orina infectada hacia los conductos prostáticos o vía ascendente uretral.',
      keyClinicalClues: [
        'Fiebre alta con escalofríos + dolor perineal/suprapúbico + disuria y chorro débil en varón',
        'Próstata caliente, edematosa y extremadamente dolorosa al tacto suave',
        'Puñopercusión lumbar negativa + EGO con piuria y nitritos positivos',
      ],
      characteristicSignsSymptoms: [
        'Fiebre y escalofríos con síndrome miccional agudo',
        'Dolor perineal profundo',
        'Próstata caliente y exquisitamente dolorosa',
      ],
      criticalRulingOutFactors: [
        'Giordano negativo descarta pielonefritis aislada; próstata caliente dolorosa confirma foco prostático.',
      ],
      recommendedWorkup: ['EGO, urocultivo y hemocultivos antes de iniciar antibiótico; NO solicitar antígeno prostático (PSA) ni realizar masaje prostático'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ciprofloxacino o Levofloxacino (o Ceftriaxona IV inicial si intolerancia oral/sepsis)',
            dose: 'Ciprofloxacino 500 mg (o Levofloxacino 500 mg cada 24 h)',
            route: 'Vía Oral (o Ceftriaxona 1 g IV c/24 h inicial si datos sistémicos severos)',
            frequency: 'Cada 12 horas (Ciprofloxacino)',
            duration: '14 a 28 días completos (mínimo 2-4 semanas para erradicar foco prostático)',
            rationale: 'Excelente penetración en tejido prostático inflamado y cobertura frente a E. coli (ajustar según antibiograma de urocultivo).',
          },
          {
            drug: 'Tamsulosina + Paracetamol',
            dose: 'Tamsulosina 0.4 mg VO c/24 h + Paracetamol 500-1000 mg VO c/8 h',
            route: 'Vía Oral',
            frequency: 'Diaria / cada 8 horas',
            duration: '2 a 4 semanas',
            rationale: 'Alfa-bloqueador mejora vaciamiento vesical y reduce riesgo de retención aguda de orina.',
          },
        ],
        generalMeasures: [
          'Hidratación oral abundante y reposo relativo; evitar bicicleta, alcohol y picantes.',
          'Si desarrolla retención aguda de orina, evitar sondaje uretral traumático repetido (preferir sonda suprapúbica si obstrucción severa).',
          'Reevaluar urocultivo en 48-72 horas para desescalar antibiótico según sensibilidad.',
        ],
        hospitalizationDecision: 'Observación Urgencias',
        referralCriteria: ['Sepsis, vómitos, retención aguda de orina o falta de descenso febril en 48-72 h (TAC/Eco transrectal para descartar absceso prostático).'],
        followUp: 'Control urológico a las 72 horas con resultado de urocultivo y al finalizar el ciclo.',
      },
      criticalSafetyAlerts: [
        'NUNCA realizar masaje prostático en prostatitis bacteriana aguda: riesgo grave de bacteriemia y choque séptico.',
        'Evitar nitrofurantoína en prostatitis (no alcanza concentraciones terapéuticas en parénquima prostático) y evitar sondaje uretral forzado.',
      ],
      guidelineReferences: [
        'EAU Guidelines on Urological Infections: Acute Bacterial Prostatitis',
      ],
    },
    internalPersonaPrompt:
      'Habla como Arturo, de 48 años. Tienes mucha fiebre con escalofríos desde ayer, ardor fuerte al orinar, chorro débil y un dolor muy molesto entre los testículos y el ano.',
  },
  {
    id: 'case-exp-com-epididimitis',
    mode: 'principiante',
    specialty: 'urologia',
    patientInfo: {
      name: 'Kevin Eduardo Morales',
      age: 25,
      sex: 'Masculino',
      occupation: 'Mesero',
      consultReason: 'Dolor gradual e hinchazón en el testículo derecho y ardor al orinar',
      evolutionTime: '3 días de evolución',
      currentIllness:
        'Paciente masculino de 25 años que consulta por dolor en el hemiescroto derecho que inició de forma paulatina hace tres días y ha ido aumentando hasta volver sensible e hinchado el lado derecho de la bolsa escrotal. Refiere que al sostener o levantar suavemente el testículo siente cierto alivio del dolor. Además nota ardor leve al orinar y secreción uretral clara escasa desde hace cinco días. Niega trauma o dolor súbito de inicio nocturno.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '118/74 mmHg',
      heartRate: 88,
      respiratoryRate: 17,
      temperature: 37.8,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 91,
      weightKg: 72,
      heightCm: 174,
    },
    background: {
      pathological: ['Niega episodios previos; sin cirugía escrotal.'],
      nonPathological: ['Tuvo relación sexual sin preservativo con nueva pareja hace 2 semanas.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-epididimitis-gen',
        system: 'Abdomen',
        name: 'Exploración genital escrotal, signo de Prehn y reflejo cremastérico',
        finding:
          'Hemiescroto derecho eritematoso, caliente y edematoso. Palpación muestra epidídimo derecho engrosado, indurado y muy doloroso en polo posterolateral, con testículo en posición vertical normal. Reflejo cremastérico PRESENTE bilateralmente. Signo de Prehn POSITIVO (el dolor disminuye al elevar el escroto).',
        isAbnormal: true,
        semiologyNote:
          'Inicio gradual + disuria + reflejo cremastérico presente + signo de Prehn positivo diferencian orquiepididimitis de torsión testicular.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-epididimitis-doppler',
        category: 'Imagen',
        subcategory: 'Ecografía',
        name: 'Ecografía Doppler escrotal testicular',
        result: 'Epidídimo derecho marcadamente engrosado con hiperemia intensa (aumento franco de señal Doppler color); flujo arterial intratesticular bilateral simétrico y conservado.',
        referenceRange: 'Flujo testicular simétrico sin hiperemia epididimaria',
        interpretation: 'Confirma orquiepididimitis aguda y descarta de forma segura torsión del cordón espermático.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-epididimitis-ego',
        category: 'Laboratorio',
        subcategory: 'Urinario',
        name: 'Examen General de Orina (EGO) primer chorro y urocultivo / NAAT',
        result: 'EGO primer chorro: Esterasa leucocitaria ++, 20 leucocitos/campo, nitritos negativos. Pendiente resultado de NAAT para Chlamydia/Gonococo.',
        referenceRange: 'Leucocitos <5/campo',
        interpretation: 'Uretritis/leucocituria compatible en varón <35 años con infección por Chlamydia trachomatis / Neisseria gonorrhoeae.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Orquiepididimitis Aguda Infecciosa (Probable ITS en Varón <35 años)',
      differentialDiagnoses: [
        'Torsión testicular aguda (inicio súbito, ausencia de reflejo cremastérico, flujo Doppler ausente)',
        'Torsión de hidátide de Morgagni',
        'Hidrocele / varicocele',
        'Tumor testicular (masa indolora sólida)',
      ],
      pathophysiology:
        'Inflamación infecciosa ascendente del epidídimo desde uretra; en varones sexualmente activos menores de 35 años predomina Chlamydia trachomatis y Neisseria gonorrhoeae (en mayores de 35 años predomina E. coli).',
      keyClinicalClues: [
        'Dolor escrotal de inicio gradual en varón de 25 años tras contacto sexual sin preservativo + disuria',
        'Reflejo cremastérico PRESENTE y signo de Prehn positivo',
        'Doppler escrotal con hiperemia del epidídimo y flujo intratesticular conservado',
      ],
      characteristicSignsSymptoms: [
        'Dolor progresivo localizado en epidídimo posterior',
        'Reflejo cremastérico presente y Prehn positivo',
        'Uretritis/disuria asociada y Doppler hipervascular',
      ],
      criticalRulingOutFactors: [
        'El Doppler con flujo testicular conservado y el reflejo cremastérico presente excluyen torsión testicular quirúrgica.',
      ],
      recommendedWorkup: ['Doppler escrotal (obligatorio si cualquier duda de torsión), EGO de primer chorro y tamizaje ITS (Chlamydia/Gonococo/VIH/VDRL)'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Ceftriaxona (dosis única) + Doxiciclina (esquema CDC para <35 años)',
            dose: 'Ceftriaxona 500 mg IM dosis única + Doxiciclina 100 mg VO',
            route: 'Intramuscular + Vía Oral',
            frequency: 'Doxiciclina cada 12 horas',
            duration: '10 días',
            rationale: 'Cubre simultáneamente N. gonorrhoeae y C. trachomatis (patógenos principales en varones <35 años).',
          },
          {
            drug: 'Ibuprofeno o Naproxeno',
            dose: 'Ibuprofeno 400-600 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas con alimento',
            duration: '5 a 7 días',
            rationale: 'Controla edema inflamatorio y dolor escrotal.',
          },
        ],
        generalMeasures: [
          'Reposo relativo, elevación escrotal (suspensorio escrotal o ropa interior ajustada) y frío local envuelto en paño.',
          'Abstinencia sexual y tratamiento obligatorio de la pareja sexual.',
          'Explicar signos de alarma para regresar de inmediato si aumenta dolor súbito o aparece fiebre alta.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Fiebre alta séptica, absceso escrotal o ausencia de mejoría en 48-72 horas.'],
        followUp: 'Revaloración clínica en 72 horas para confirmar descenso de inflamación y revisar pruebas de ITS.',
      },
      criticalSafetyAlerts: [
        'Ante cualquier dolor escrotal agudo en joven, SIEMPRE descartar torsión testicular mediante clínica y Doppler escrotal antes de asumir epididimitis.',
      ],
      guidelineReferences: [
        'CDC STI Treatment Guidelines: Epididymitis',
        'EAU Guidelines on Urological Infections',
      ],
    },
    internalPersonaPrompt:
      'Habla como Kevin, mesero de 25 años. Desde hace 3 días te duele y se te hinchó el testículo derecho poco a poco, con algo de ardor al orinar; estuviste con una pareja nueva hace 2 semanas sin condón.',
  },
  {
    id: 'case-exp-com-mononucleosis',
    mode: 'principiante',
    specialty: 'infectologia',
    patientInfo: {
      name: 'Emiliano Tomás Vega',
      age: 19,
      sex: 'Masculino',
      occupation: 'Estudiante universitario',
      consultReason: 'Fiebre prolongada, garganta muy inflamada, ganglios en el cuello y cansancio extremo',
      evolutionTime: '8 días de evolución',
      currentIllness:
        'Paciente masculino de 19 años que acude porque lleva ocho días con fiebre de hasta 38.7°C, dolor de garganta muy intenso que dificulta tragar, agotamiento físico marcado y aparición de múltiples bolitas dolorosas en ambos lados y parte posterior del cuello. Hace 4 días otro médico le recetó amoxicilina y ayer le apareció un brote de manchas rojas en el pecho y brazos. Niega dificultad para respirar o dolor en el pecho.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 92,
      respiratoryRate: 17,
      temperature: 38.4,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 92,
      weightKg: 69,
      heightCm: 177,
    },
    background: {
      pathological: ['Previamente sano; sin alergia conocida previa a penicilinas.'],
      nonPathological: ['Comparte bebidas en campus universitario; pareja reciente.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomando amoxicilina desde hace 4 días sin mejoría de la fiebre y con exantema posterior.'],
      allergies: ['Sin alergias previas conocidas (exantema morbiliforme tras amoxicilina).'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-mono-orl',
        system: 'Cabeza y Cuello',
        name: 'Orofaringe y cadenas ganglionares cervicales',
        finding:
          'Amígdalas palatinas muy hipertrofiadas con exudado blanco-grisáceo adherente y petequias en el límite entre paladar duro y blando. Adenopatías cervicales múltiples bilaterales prominentes, especialmente en CADENA CERVICAL POSTERIOR, móviles y sensibles.',
        isAbnormal: true,
        semiologyNote:
          'Faringitis exudativa + adenopatía cervical posterior + exantema tras amoxicilina en adolescente/joven es la firma clínica de Mononucleosis Infecciosa.',
      },
      {
        id: 'pe-exp-mono-abd',
        system: 'Abdomen',
        name: 'Palpación abdominal hepatoesplénica y piel',
        finding:
          'Esplenomegalia palpable blanda 3 cm debajo del reborde costal izquierdo y hepatomegalia leve indolora. Exantema maculopapular morbiliforme rosado en tronco y extremidades superiores.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-mono-bh',
        category: 'Laboratorio',
        subcategory: 'Hematología',
        name: 'Biometría Hemática con Frotis de Sangre Periférica y Pruebas Hepáticas',
        result:
          'Leucocitos: 15,400 /mm³ | Linfocitos: 68% con 18% de LINFOCITOS ATÍPICOS (células de Downey) en frotis | Plaquetas: 175,000 /mm³ | AST: 118 U/L | ALT: 136 U/L | Bilirrubina total: 1.1 mg/dL.',
        referenceRange: 'Linfocitos 20-45% | Linfocitos atípicos <5% | ALT <40 U/L',
        interpretation: 'Linfocitosis absoluta con >10% de linfocitos atípicos y elevación leve de transaminasas típica de VEB.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-mono-mono',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Prueba de anticuerpos heterófilos (Monotest) + Antígeno estreptocócico',
        result: 'Monotest (Paul-Bunnell): POSITIVO | IgM anti-VCA (VEB): POSITIVA | Prueba rápida estreptocócica: NEGATIVA.',
        referenceRange: 'Negativo',
        interpretation: 'Confirma primoinfección aguda por Virus de Epstein-Barr y descarta faringitis estreptocócica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Mononucleosis Infecciosa Aguda (Virus de Epstein-Barr)',
      differentialDiagnoses: [
        'Faringoamigdalitis aguda estreptocócica',
        'Síndrome retroviral agudo (primoinfección por VIH)',
        'Infección aguda por Citomegalovirus (CMV) o Toxoplasma',
        'Leucemia linfoblástica o linfoma agudo',
      ],
      pathophysiology:
        'Primoinfección por Virus de Epstein-Barr (VEB) transmitido por saliva que infecta linfocitos B orofaríngeos y desencadena intensa proliferación reactiva de linfocitos T CD8+ citotóxicos ("linfocitos atípicos") en ganglios linfáticos, bazo e hígado.',
      keyClinicalClues: [
        'Adolescente/joven con fiebre prolongada, faringitis exudativa, astenia extrema y ganglios cervicales posteriores',
        'Exantema maculopapular característico desencadenado tras prescripción previa de amoxicilina',
        'Esplenomegalia palpable + linfocitosis con >10% linfocitos atípicos + Monotest/VCA-IgM positivos',
      ],
      characteristicSignsSymptoms: [
        'Tríada clásica: fiebre + faringitis + adenopatías cervicales posteriores',
        'Esplenomegalia y elevación leve de transaminasas',
        'Rash por aminopenicilinas (amoxicilina/ampicilina)',
      ],
      criticalRulingOutFactors: [
        'Prueba rápida estreptocócica negativa + linfocitosis atípica + esplenomegalia descartan faringitis estreptocócica.',
      ],
      recommendedWorkup: ['Biometría con frotis periférico (linfocitos atípicos), Monotest / IgM anti-VCA y pruebas hepáticas'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Paracetamol (o Ibuprofeno si función renal normal)',
            dose: '500 a 1000 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas si fiebre o odinofagia',
            duration: '5 a 7 días',
            rationale: 'Manejo sintomático seguro en enfermedad viral autolimitada (evitar exceder 3 g/día por transaminasas elevadas).',
          },
        ],
        generalMeasures: [
          'SUSPENDER amoxicilina de inmediato (explicar que NO es alergia verdadera a penicilina sino fenómeno inmunológico VEB-aminopenicilina).',
          'PROHIBICIÓN ESTRICTA de deportes de contacto, levantamiento de pesas o esfuerzo físico intenso durante al menos 3-4 semanas (y hasta confirmar resolución de esplenomegalia) por riesgo de RUPTURA ESPLÉNICA.',
          'Hidratación abundante, reposo relativo y gárgaras tibias salinas.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Dificultad para tragar líquidos o estridor por hipertrofia amigdalina obstructiva (requiere corticoide corto IV), o dolor súbito en hipocondrio izquierdo/hombro (rotura esplénica).'],
        followUp: 'Revaloración clínica en 2 semanas y examen abdominal a las 4 semanas antes de autorizar deporte.',
      },
      criticalSafetyAlerts: [
        'ADVERTIR obligatoriamente sobre restricción absoluta de deportes de contacto durante 3-4 semanas por riesgo letal de rotura esplénica traumática.',
        'Suspender amoxicilina/ampicilina (ineficaces en VEB y causantes del exantema).',
      ],
      guidelineReferences: [
        'CDC Clinical Overview of Infectious Mononucleosis (EBV)',
        'UpToDate / NICE CKS: Glandular Fever (Infectious Mononucleosis)',
      ],
    },
    internalPersonaPrompt:
      'Habla como Emiliano, universitario de 19 años. Llevas 8 días con mucha fiebre, garganta muy inflamada, bolitas atrás del cuello y agotamiento extremo; te dieron amoxicilina y te llenaste de manchitas rojas.',
  },
  {
    id: 'case-exp-com-hepatitis-a',
    mode: 'principiante',
    specialty: 'gastroenterologia',
    patientInfo: {
      name: 'Raúl Adrián Domínguez',
      age: 27,
      sex: 'Masculino',
      occupation: 'Repartidor en motocicleta',
      consultReason: 'Ojos amarillos, orina color té oscuro y asco a la comida',
      evolutionTime: '6 días de evolución',
      currentIllness:
        'Paciente masculino de 27 años que consulta porque hace seis días comenzó con fiebre leve de 37.9°C, cansancio intenso, dolor leve bajo las costillas derechas, náuseas y rechazo marcado a comidas grasosas (inclusive asco al olor del café y cigarro). Desde hace dos días la fiebre cedió pero notó que sus ojos y piel se pusieron amarillos y la orina salió muy oscura color té cargado, con heces más pálidas. Come diariamente en puestos ambulantes de comida y mariscos crudos.',
      triageLevel: 'Nivel IV (Prioritario)',
    },
    vitalSigns: {
      bloodPressure: '116/72 mmHg',
      heartRate: 78,
      respiratoryRate: 16,
      temperature: 36.8,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 88,
      weightKg: 73,
      heightCm: 174,
    },
    background: {
      pathological: ['Sano previamente; no vacunado contra hepatitis A ni B.'],
      nonPathological: ['Consume alimentos y agua fresca de puestos callejeros a diario. Niega transfusiones, tatuajes o uso de drogas IV.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó 2 tabletas de paracetamol hace 4 días.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-vha-gen',
        system: 'Cabeza y Cuello',
        name: 'Inspección de escleras, piel y estado mental',
        finding: 'Ictericia escleral y cutánea franca. Paciente alerta, orientado, sin asterixis ni datos de encefalopatía hepática.',
        isAbnormal: true,
        semiologyNote: 'Ictericia tras pródromo febril-gastrointestinal sin asterixis orienta a hepatitis viral aguda no fulminante.',
      },
      {
        id: 'pe-exp-vha-abd',
        system: 'Abdomen',
        name: 'Palpación de cuadrante superior derecho',
        finding: 'Hepatomegalia lisa, blanda y levemente dolorosa 2 cm debajo del reborde costal derecho; Murphy negativo, sin ascitis ni circulación colateral.',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-vha-pfh',
        category: 'Laboratorio',
        subcategory: 'Función Hepática',
        name: 'Pruebas de Función Hepática y Tiempos de Coagulación (TP/INR)',
        result:
          'ALT: 1,420 U/L | AST: 1,180 U/L | Bilirrubina total: 6.4 mg/dL (Directa: 4.9 mg/dL) | Fosfatasa alcalina: 195 U/L | INR: 1.08 | Albúmina: 4.1 g/dL.',
        referenceRange: 'ALT/AST <40 U/L | Bilirrubina total <1.2 mg/dL | INR <1.2',
        interpretation: 'Patrón hepatocelular agudo severo (transaminasas >1,000 U/L) con función sintética hepática conservada (INR normal).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-vha-serol',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Panel Viral de Hepatitis Aguda (VHA, VHB, VHC)',
        result: 'IgM anti-VHA: POSITIVA | HBsAg: NEGATIVO | IgM anti-HBc: NEGATIVO | Anti-VHC: NEGATIVO.',
        referenceRange: 'Marcadores virales negativos',
        interpretation: 'Confirma infección aguda por Virus de Hepatitis A (transmisión fecal-oral).',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hepatitis Viral Aguda Tipo A (No Complicada)',
      differentialDiagnoses: [
        'Hepatitis aguda viral B o E',
        'Coledocolitiasis / colestasis obstructiva (patrón colestásico con FA alta y dolor biliar intenso)',
        'Hepatotoxicidad aguda por fármacos o herbolaria',
        'Leptospirosis anictérica/ictérica o fiebre amarilla',
      ],
      pathophysiology:
        'Infección entérica fecal-oral por picornavirus hepatotropo (VHA) que se replica en hepatocitos desencadenando necrosis hepatocelular mediada inmunológicamente (elevación marcada de ALT/AST >1000 U/L) y colestasis intrahepática transitoria.',
      keyClinicalClues: [
        'Pródromo viral con anorexia/asco a comida seguido de ictericia, coluria e hipocolia en consumidor de comida callejera',
        'Transaminasas >1,000 U/L con INR normal (<1.5) y ausencia de encefalopatía',
        'IgM anti-VHA positiva',
      ],
      characteristicSignsSymptoms: [
        'Ictericia escleral, coluria e hipocolia',
        'Hepatomegalia lisa dolorosa con anorexia marcada',
        'Elevación >10x-20x de transaminasas con IgM-VHA positiva',
      ],
      criticalRulingOutFactors: [
        'INR normal (1.08) y ausencia de alteración neurológica descartan falla hepática aguda fulminante.',
      ],
      recommendedWorkup: ['PFH completas, TP/INR (obligatorio para evaluar gravedad hepática) y serología IgM VHA/VHB/VHC'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Metoclopramida o Ondansetrón (solo si náusea intensa impide hidratación)',
            dose: 'Ondansetrón 4 mg (PRN mínimo)',
            route: 'Vía Oral',
            frequency: 'Cada 8 a 12 horas solo si vómito',
            duration: '2 a 3 días según tolerancia',
            rationale: 'No existe antiviral específico para VHA; el tratamiento es exclusivamente de soporte evitando fármacos hepatotóxicos.',
          },
        ],
        generalMeasures: [
          'Prohibición ABSOLUTA de alcohol, paracetamol y cualquier medicamento/herbolaria hepatotóxica hasta normalización de enzimas.',
          'Hidratación oral fraccionada y dieta blanda fraccionada tolerada (sin restricción extrema de proteínas ni reposo estricto en cama).',
          'Medidas higiénicas estrictas de aislamiento entérico (lavado de manos, no manipular alimentos para terceros durante 2 semanas) y vacunación profiláctica a contactos domiciliarios no inmunes.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Somnolencia, confusión o desorientación (encefalopatía), INR ≥1.5 o vómito incoercible que impide hidratación (urgencia de falla hepática aguda).'],
        followUp: 'Control clínico y PFH + INR en 1 semana y vigilancia de signos de alarma hepática.',
      },
      criticalSafetyAlerts: [
        'SUSPENDER paracetamol, alcohol y AINEs durante hepatitis aguda por riesgo de precipitar falla hepática fulminante.',
        'Siempre medir TP/INR en toda hepatitis aguda para detectar falla hepática incipiente.',
      ],
      guidelineReferences: [
        'WHO / CDC Hepatitis A Clinical Management & Postexposure Prophylaxis Guidelines',
      ],
    },
    internalPersonaPrompt:
      'Habla como Raúl, repartidor de 27 años. Hace 6 días te dio fiebre y asco total a la comida, y desde hace 2 días tienes los ojos amarillos y la orina como té oscuro; comes a diario en puestos callejeros.',
  },
  {
    id: 'case-exp-com-tb-pulmonar',
    mode: 'medico_general',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Joaquín Ernesto Salazar',
      age: 46,
      sex: 'Masculino',
      occupation: 'Velador nocturno',
      consultReason: 'Tos con flemas desde hace un mes, sudores en la noche y pérdida de peso',
      evolutionTime: '5 semanas de evolución',
      currentIllness:
        'Paciente masculino de 46 años que acude porque lleva más de cinco semanas con tos productiva persistente con flemas amarillo-verdosas y en dos ocasiones notó hilillos de sangre al toser por la mañana. Refiere además fiebre leve por las tardes, sudoración nocturna profusa que empapa la camiseta, falta de apetito y pérdida involuntaria de 7 kg de peso en dos meses.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '112/70 mmHg',
      heartRate: 92,
      respiratoryRate: 20,
      temperature: 37.8,
      oxygenSaturation: 95,
      glasgow: 15,
      bloodGlucose: 112,
      weightKg: 59,
      heightCm: 173,
    },
    background: {
      pathological: ['Diabetes mellitus tipo 2 diagnosticada hace 5 años sin control médico regular.'],
      nonPathological: ['Fumó 10 cigarrillos/día por 15 años; vive en vivienda compartida ventilación limitada; un compañero de trabajo tuvo "tos crónica" hace meses.'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Metformina irregular; tomó amoxicilina 5 días sin mejoría alguna.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-tb-torax',
        system: 'Tórax y Pulmones',
        name: 'Exploración física pleuropulmonar y estado nutricional',
        finding:
          'Paciente adelgazado con índice de masa corporal bajo (19.7). A la auscultación pulmonar se perciben estertores crepitantes subcrepitantes y respiración soplante (tubárica) focalizados en la región infraclavicular y ápice pulmonar derecho. Sin cianosis ni tiraje severo.',
        isAbnormal: true,
        semiologyNote:
          'Sintomático respiratorio (>15 días con tos productiva) + síndrome consuntivo + sudoración nocturna + estertores apicales derechos orienta a Tuberculosis Pulmonar.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-tb-rx',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de Tórax PA y Lateral',
        result: 'Infiltrado alveolo-nodular heterogéneo en lóbulo superior derecho con imagen cavitada de 3.2 cm de paredes gruesas en segmento apical/posterior derecho y tracción hiliar discreta.',
        referenceRange: 'Campos pulmonares sin cavitaciones ni consolidaciones apicales',
        interpretation: 'Lesión cavitada apical derecha altamente sugestiva de tuberculosis pulmonar postprimaria activa.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-tb-micro',
        category: 'Laboratorio',
        subcategory: 'Microbiología / Serología',
        name: 'Baciloscopia de esputo seriada (BAAR x3) y Prueba Molecular GeneXpert MTB/RIF',
        result:
          'Baciloscopia (Ziehl-Neelsen): POSITIVA (+++) para Bacilos Ácido-Alcohol Resistentes (BAAR). GeneXpert MTB/RIF: Complejo Mycobacterium tuberculosis DETECTADO, resistencia a Rifampicina NO detectada.',
        referenceRange: 'Negativo para BAAR / MTB',
        interpretation: 'Diagnóstico microbiológico confirmatorio de Tuberculosis Pulmonar Bacilífera sensible a rifampicina.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Tuberculosis Pulmonar Activa Bacilífera (Sensible a Rifampicina)',
      differentialDiagnoses: [
        'Absceso pulmonar bacteriano anaerobio',
        'Carcinoma broncogénico cavitado',
        'Micosis pulmonar endémica (histoplasmosis o aspergiloma)',
        'Neumonía bacteriana necrotizante',
      ],
      pathophysiology:
        'Reactivación de Mycobacterium tuberculosis inhalado en segmentos pulmonares apicales bien oxigenados (lóbulos superiores), generando granulomas caseificantes que licúan y drenan hacia la vía aérea formando cavidades bacilíferas contagiosas por aerosoles.',
      keyClinicalClues: [
        'Tos productiva >2-3 semanas ("sintomático respiratorio") con hemoptisis leve que no responde a antibióticos comunes',
        'Fiebre vespertina, diaforesis nocturna profusa y pérdida ponderal de 7 kg',
        'Caverna apical derecha en radiografía + BAAR (+++) + GeneXpert MTB/RIF positivo',
      ],
      characteristicSignsSymptoms: [
        'Tos productiva crónica >15 días y hemoptisis',
        'Diaforesis nocturna y baja ponderal',
        'Infiltrado/cavitación en lóbulo superior derecho',
      ],
      criticalRulingOutFactors: [
        'Falta de respuesta a amoxicilina y hallazgo BAAR/GeneXpert positivo confirman TB pulmonar y descartan NAC simple.',
      ],
      recommendedWorkup: ['Baciloscopia seriada + GeneXpert MTB/RIF + cultivo de esputo, Rx tórax, prueba de VIH obligatoria, PFH/creatinina basales'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Esquema estándar supervisado (TAES/DOTS) Fase Intensiva: HRZE (Isoniazida + Rifampicina + Pirazinamida + Etambutol)',
            dose: 'Combinación a dosis fijas según peso (55-70 kg: 4 tabletas diarias) + Piridoxina (Vitamina B6) 25-50 mg/día',
            route: 'Vía Oral (estrictamente supervisada)',
            frequency: 'Cada 24 horas en ayuno',
            duration: '2 meses fase intensiva (HRZE), seguidos de 4 meses fase de sostén (HR)',
            rationale: 'Terapia combinada bactericida y esterilizante estándar OMS para evitar selección de cepas farmacorresistentes.',
          },
        ],
        generalMeasures: [
          'Aislamiento respiratorio (mascarilla quirúrgica al paciente; mascarilla N95 para personal) al menos las primeras 2-3 semanas de tratamiento efectivo.',
          'Tamizaje obligatorio de VIH, optimización del control glucémico en su diabetes y notificación epidemiológica.',
          'Estudio de contactos domiciliarios y laborales cercanos.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Hemoptisis masiva, insuficiencia respiratoria o resistencia a rifampicina en GeneXpert (manejo en hospital / programa TB-MDR).'],
        followUp: 'Baciloscopia de control al 2.º mes y monitoreo mensual clínico y de toxicidad hepática/visual.',
      },
      criticalSafetyAlerts: [
        'NUNCA iniciar monoterapia antituberculosa ni añadir una sola droga a un esquema fallido.',
        'Prohibido prescribir fluoroquinolonas empíricas en sospecha de TB sin descartarla antes (enmascaran baciloscopia e inducen resistencia).',
      ],
      guidelineReferences: [
        'WHO Consolidated Guidelines on Tuberculosis: Module 4 (Drug-Susceptible TB Treatment)',
      ],
    },
    internalPersonaPrompt:
      'Habla como Joaquín, velador de 46 años con diabetes mal cuidada. Llevas 5 semanas tosiendo con flemas (a veces con hilillos de sangre), sudas empapado en las noches y bajaste 7 kilos.',
  },
  {
    id: 'case-exp-com-epoc-exacerbado',
    mode: 'urgencias',
    specialty: 'neumologia',
    patientInfo: {
      name: 'Don Aurelio Méndez',
      age: 68,
      sex: 'Masculino',
      occupation: 'Jubilado (ex-obrero)',
      consultReason: 'Aumento de falta de aire y flemas espesas desde hace 3 días',
      evolutionTime: '3 días de evolución',
      currentIllness:
        'Paciente masculino de 68 años con diagnóstico conocido de EPOC desde hace diez años que acude a Urgencias por empeoramiento progresivo de su disnea habitual desde hace tres días hasta ahogarse al caminar al baño, acompañado de aumento marcado en el volumen y espesor de la expectoración, ahora de color amarillo-verdoso purulento. Usa su inhalador de salbutamol cada dos horas sin lograr alivio.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '144/86 mmHg',
      heartRate: 108,
      respiratoryRate: 26,
      temperature: 37.9,
      oxygenSaturation: 86,
      glasgow: 15,
      bloodGlucose: 118,
      weightKg: 67,
      heightCm: 170,
    },
    background: {
      pathological: ['EPOC GOLD E con 2 hospitalizaciones el año pasado; hipertensión arterial leve.'],
      nonPathological: ['Índice tabáquico de 45 paquetes-año (fumó hasta hace 2 años).'],
      family: ['Sin antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tiotropio 18 mcg inhalado cada 24 h (lo suspendió hace 3 semanas); salbutamol de rescate.'],
      allergies: ['Sin alergias conocidas a medicamentos.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-epocex-torax',
        system: 'Tórax y Pulmones',
        name: 'Exploración respiratoria y mecánica ventilatoria',
        finding:
          'Tórax en tonel, respiración con labios fruncidos y uso moderado de músculos accesorios esternocleidomastoideos. Murmullo vesicular globalmente disminuido con espiración muy prolongada, sibilancias espiratorias difusas y roncus gruesos bilaterales sin consolidación focal densa.',
        isAbnormal: true,
        semiologyNote:
          'Criterios de Anthonisen tipo I (aumento de disnea + volumen de esputo + purulencia) en EPOC con hipoxemia SpO2 86% definen exacerbación aguda severa.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-epocex-gsa',
        category: 'Laboratorio',
        subcategory: 'Gases',
        name: 'Gasometría Arterial (basal aire ambiente)',
        result: 'pH: 7.34 | PaCO2: 54 mmHg | PaO2: 53 mmHg | HCO3-: 28.5 mEq/L | SatO2: 86%.',
        referenceRange: 'pH 7.35-7.45 | PaCO2 35-45 mmHg | PaO2 80-100 mmHg',
        interpretation: 'Insuficiencia respiratoria hipercápnica compensada parcialmente (acidosis respiratoria leve sobre retención crónica de CO2).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-epocex-rx',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de Tórax portátil',
        result: 'Hiperinsuflación pulmonar bilateral, aplanamiento de hemidiafragmas y aumento de trama broncovascular sin consolidación neumónica focal ni neumotórax.',
        referenceRange: 'Sin consolidación ni neumotórax',
        interpretation: 'Cambios crónicos de EPOC/enfisema; descarta neumonía lobar y neumotórax como causas del deterioro.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Exacerbación Aguda Infecciosa de EPOC (Criterios de Anthonisen Tipo I)',
      differentialDiagnoses: [
        'Neumonía adquirida en la comunidad (descartada por Rx sin consolidación)',
        'Edema agudo pulmonar / insuficiencia cardíaca descompensada',
        'Tromboembolia pulmonar aguda',
        'Neumotórax espontáneo secundario por ruptura de bulla',
      ],
      pathophysiology:
        'Infección traqueobronquial bacteriana/viral desencadena broncoconstricción aguda, edema mucoso e hipersecreción purulenta sobre vías aéreas crónicamente obstruidas, agravando el atrapamiento aéreo, la desigualdad V/Q, la hipoxemia y la retención aguda de CO2.',
      keyClinicalClues: [
        'Paciente con EPOC e historia de tabaquismo intenso con empeoramiento de disnea, volumen y purulencia del esputo',
        'SpO2 86%, uso de accesorios, sibilancias y espiración prolongada',
        'Gasometría con PaO2 53 mmHg y PaCO2 54 mmHg sin neumonía ni neumotórax en Rx',
      ],
      characteristicSignsSymptoms: [
        'Tríada de Anthonisen: disnea + aumento esputo + purulencia',
        'Hipoxemia + hipercapnia en gasometría',
        'Hiperinsuflación pulmonar sin neumotórax',
      ],
      criticalRulingOutFactors: [
        'Rx de tórax descarta neumotórax secundario y consolidación neumónica extensa.',
      ],
      recommendedWorkup: ['Oximetría, gasometría arterial, radiografía de tórax, biometría hemática y ECG'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Oxigenoterapia controlada (meta estricta SpO2 88-92% con cánula/Venturi)',
            dose: 'FiO2 controlada 24-28% (2-3 L/min titulando a SpO2 88-92%)',
            route: 'Inhalatoria / Mascarilla Venturi o cánula nasal',
            frequency: 'Continua monitorizada',
            duration: 'Hasta estabilización gasométrica',
            rationale: 'Corrige hipoxemia letal SIN abolir el impulso hipóxico ni empeorar hipercapnia por efecto Haldane/V-Q.',
          },
          {
            drug: 'Salbutamol + Bromuro de Ipratropio nebulizados + Prednisona sistémica + Amoxicilina/Clavulanato',
            dose: 'Salbutamol 2.5 mg + Ipratropio 500 mcg neb c/20 min x3 -> c/4-6 h + Prednisona 40 mg VO (o Hidrocortisona IV) + Amoxicilina/Clavulanato 875/125 mg c/12 h',
            route: 'Inhalatoria + Vía Oral / IV',
            frequency: 'Broncodilatador de rescate horario inicial; Prednisona c/24 h x5 días; antibiótico x5-7 días',
            duration: '5 a 7 días',
            rationale: 'SABA+SAMA maximizan broncodilatación; corticoide corto acorta recuperación; antibiótico indicado al cumplir los 3 criterios de Anthonisen.',
          },
        ],
        generalMeasures: [
          'Posición semifowler, monitoreo continuo de estado mental y nueva gasometría en 30-60 minutos.',
          'Preparar Ventilación Mecánica No Invasiva (VNI/BiPAP) si el pH cae <7.35 con PaCO2 >45 mmHg persistente o fatiga muscular.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Acidosis respiratoria pH <7.35 persistente (iniciar VNI/BiPAP), deterioro del estado de alerta o inestabilidad hemodinámica (UCI).'],
        followUp: 'Observación hospitalaria hasta destete de O2 suplementario y ajuste de terapia inhalada dual de mantenimiento (LAMA/LABA).',
      },
      criticalSafetyAlerts: [
        'PROHIBIDO administrar oxígeno a alto flujo sin control (10-15 L/min buscando SpO2 100%) en EPOC hipercápnico: precipita narcosis por CO2 y acidosis respiratoria grave.',
      ],
      guidelineReferences: [
        'GOLD 2025 Report: Management of COPD Exacerbations',
      ],
    },
    internalPersonaPrompt:
      'Habla con frases cortas como Don Aurelio, de 68 años con EPOC. Desde hace 3 días te ahogas mucho, sacas flemas verdes espesas y tu inhalador ya no te hace efecto.',
  },
  {
    id: 'case-exp-com-eap-cardiogenico',
    mode: 'urgencias',
    specialty: 'cardiologia',
    patientInfo: {
      name: 'Beatriz Elena Villagrán',
      age: 71,
      sex: 'Femenino',
      occupation: 'Jubilada',
      consultReason: 'Falta de aire súbita e intensa que empeora al acostarse y tos húmeda',
      evolutionTime: '4 horas de evolución',
      currentIllness:
        'Paciente femenina de 71 años con hipertensión arterial e insuficiencia cardíaca previa que ingresa a Urgencias con intensa dificultad respiratoria iniciada de madrugada mientras dormía, obligándola a sentarse al borde de la cama. Refiere sensación de ahogo inminente, sudoración fría y tos húmeda con expectoración espumosa ligeramente rosada. Suspendió su furosemida hace cinco días y cenó caldo salado anoche.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '186/104 mmHg',
      heartRate: 118,
      respiratoryRate: 30,
      temperature: 36.6,
      oxygenSaturation: 84,
      glasgow: 15,
      bloodGlucose: 138,
      weightKg: 74,
      heightCm: 158,
    },
    background: {
      pathological: ['Hipertensión arterial crónica, cardiopatía hipertensiva con FEVI reducida (40%).'],
      nonPathological: ['Trasgresión dietética de sodio ayer por la noche; no fuma.'],
      family: ['Sin otros antecedentes relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Furosemida 40 mg y enalapril 10 mg (suspendidos por descuido hace 5 días).'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-eap-torax',
        system: 'Tórax y Pulmones',
        name: 'Auscultación pulmonar y valoración de congestión',
        finding:
          'Paciente en ortopnea severa, taquipneica (30 rpm), diaforética, incapaz de tolerar el decúbito. Estertores crepitantes húmedos bilaterales audibles desde las bases hasta los campos medios y ápices ("marea ascendente").',
        isAbnormal: true,
        semiologyNote:
          'Ortopnea severa + esputo rosado espumoso + crepitantes bilaterales difusos + HTA severa definen edema agudo pulmonar cardiogénico.',
      },
      {
        id: 'pe-exp-eap-cardio',
        system: 'Cardiovascular',
        name: 'Auscultación cardíaca y cuello',
        finding:
          'Taquicardia con tercer ruido cardíaco (galope por S3), ingurgitación yugular visible a 45° y edema pretibial bilateral (++).',
        isAbnormal: true,
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-eap-rx',
        category: 'Imagen',
        subcategory: 'Radiología',
        name: 'Radiografía de Tórax portátil (en sedestación)',
        result: 'Cardiomegalia global, redistribución vascular cefálica, líneas B de Kerley y opacidades alveolares perihiliares bilaterales simétricas en "alas de mariposa" con derrame pleural basal bilateral leve.',
        referenceRange: 'Campos pulmonares aireados sin infiltrado alveolar perihiliar',
        interpretation: 'Imagen clásica de edema agudo de pulmón cardiogénico.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-eap-bnp',
        category: 'Laboratorio',
        subcategory: 'Cardiovascular',
        name: 'Péptido Natriurético (NT-proBNP), Troponina I y Gasometría',
        result: 'NT-proBNP: 5,420 pg/mL (muy elevado) | Troponina I: 24 ng/L (elevación mínima por estrés parietal, ECG sin supradesnivel ST) | GSA: pH 7.36, PaO2 50 mmHg, PaCO2 34 mmHg.',
        referenceRange: 'NT-proBNP <300 pg/mL | PaO2 80-100 mmHg',
        interpretation: 'Sobrecarga aguda severa de cavidades izquierdas con insuficiencia respiratoria hipoxémica.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Insuficiencia Cardíaca Aguda Descompensada con Edema Agudo Pulmonar Cardiogénico',
      differentialDiagnoses: [
        'Neumonía bilateral grave (fiebre, consolidación focal, procalcitonina elevada)',
        'Tromboembolia pulmonar masiva (campos limpios a la auscultación)',
        'Síndrome de dificultad respiratoria aguda (SDRA) no cardiogénico',
        'Crisis asmática grave',
      ],
      pathophysiology:
        'Abandono diurético/antihipertensivo y sobrecarga de sodio elevan bruscamente la poscarga y presión telediastólica del ventrículo izquierdo, incrementando la presión capilar pulmonar (>25 mmHg) con trasudación masiva de líquido hacia el intersticio y alvéolos.',
      keyClinicalClues: [
        'Ortopnea súbita nocturna, disnea extrema, diaforesis y esputo espumoso rosado tras suspender furosemida',
        'HTA severa (186/104), SpO2 84%, galope S3, ingurgitación yugular y crepitantes húmedos bilaterales',
        'Rx en "alas de mariposa" + NT-proBNP >5,000 pg/mL',
      ],
      characteristicSignsSymptoms: [
        'Ortopnea severa y esputo rosado espumoso',
        'Estertores crepitantes bilaterales ascendentes + galope S3',
        'Opacidad alveolar perihiliar en alas de mariposa',
      ],
      criticalRulingOutFactors: [
        'ECG sin elevación del ST y troponina sin curva de infarto masivo descartan IAMCEST como desencadenante primario (aunque requiere vigilancia).',
      ],
      recommendedWorkup: ['ECG 12 derivaciones inmediato, Rx tórax portátil, gasometría, NT-proBNP, troponina, electrolitos/creatinina'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Furosemida intravenosa (en bolo urgente)',
            dose: '40 a 80 mg (al menos igual o 1-2x su dosis oral previa)',
            route: 'Intravenosa en bolo STAT',
            frequency: 'Cada 6 a 8 horas según respuesta diurética',
            duration: 'Fase aguda intrahospitalaria hasta euvolemia',
            rationale: 'Venodilatación rápida y diuresis intensa reduciendo precarga y congestión pulmonar.',
          },
          {
            drug: 'Nitroglicerina intravenosa (o sublingual puente inicial al tener PAS 186 mmHg)',
            dose: 'Iniciar 10-20 mcg/min IV titulando según PAS (meta bajar ~20-25% PA en primeras horas)',
            route: 'Intravenosa en infusión continua',
            frequency: 'Titulación continua monitorizada',
            duration: 'Fase aguda hasta estabilidad tensional y respiratoria',
            rationale: 'Vasodilatador potente venoso y arterial indicado de primera línea cuando PAS >110 mmHg para desplomar precarga/poscarga.',
          },
        ],
        generalMeasures: [
          'Sentar a la paciente (posición 90° con piernas colgando) + Oxígeno + Ventilación No Invasiva (CPAP/BiPAP) de inmediato por SpO2 84% y edema pulmonar.',
          'Restricción estricta de líquidos IV (NUNCA pasar cargas de cristaloides) y sonda vesical para medir gasto urinario horario.',
          'Monitor cardíaco continuo y control estricto de potasio sérico.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Edema agudo pulmonar con SpO2 <90% requiere ingreso inmediato a sala de choque / UCI coronaria con soporte VNI.'],
        followUp: 'Estabilización en UCI/hospitalización y reinicio progresivo de terapia cuádruple de insuficiencia cardíaca (IECA/ARNI + BB + ARM + iSGLT2).',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar soluciones cristaloides en bolo ni betabloqueadores IV en edema agudo pulmonar cardiogénico agudo.',
        'Evitar acostar plana a la paciente (agrava ortopnea e hipoxemia fatal).',
      ],
      guidelineReferences: [
        'ESC 2023 Focused Update on Acute and Chronic Heart Failure',
        'AHA/ACC/HFSA Guideline for the Management of Heart Failure',
      ],
    },
    internalPersonaPrompt:
      'Habla agitada y entrecortada como Beatriz, de 71 años. Te ahogas horrible si te acuestas, toses flema rosada espumosa y dejaste tus pastillas para el corazón hace 5 días.',
  },
  {
    id: 'case-exp-com-ataque-panico',
    mode: 'medico_general',
    specialty: 'psiquiatria',
    patientInfo: {
      name: 'Camila Renata Torres',
      age: 25,
      sex: 'Femenino',
      occupation: 'Diseñadora multimedia',
      consultReason: 'Palpitaciones súbitas, sensación de ahogo y miedo intenso en el transporte',
      evolutionTime: '40 minutos desde el inicio (3.er episodio en el mes)',
      currentIllness:
        'Paciente femenina de 25 años que llega muy asustada a Urgencias acompañada de una amiga porque hace 40 minutos, mientras viajaba en el metro, comenzó de manera súbita y sin motivo aparente con latidos acelerados, opresión en el pecho, sensación de falta de aire, mareo, hormigueo en los dedos de ambas manos, sudoración y un miedo abrumador de morir o perder el control. El pico máximo duró unos 10-15 minutos y ahora está disminuyendo. Refiere dos episodios idénticos en las últimas tres semanas y vive atemorizada de volver a subir al transporte.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '128/80 mmHg',
      heartRate: 112,
      respiratoryRate: 24,
      temperature: 36.6,
      oxygenSaturation: 100,
      glasgow: 15,
      bloodGlucose: 94,
      weightKg: 57,
      heightCm: 164,
    },
    background: {
      pathological: ['Previamente sana; niega asma, arritmias o hipertiroidismo.'],
      nonPathological: ['Estrés laboral intenso reciente; toma 3 tazas de café al día; niega consumo de cocaína o anfetaminas.'],
      family: ['Sin antecedentes familiares de relevancia.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-panico-cardio',
        system: 'Cardiovascular',
        name: 'Exploración cardiopulmonar y neurológica',
        finding:
          'Paciente temblorosa y ansiosa pero alerta y orientada. Taquicardia sinusal rítmica leve (112 lpm descendiendo a 96 lpm en minutos) sin soplos; campos pulmonares completamente limpios con saturación de 100% al aire ambiente. Hiperventilación sin cianosis ni estridor; signos de focalización neurológica ausentes.',
        isAbnormal: true,
        semiologyNote:
          'Parestesias acrales bilaterales + hiperventilación + SpO2 100% + miedo súbito intenso de muerte en pico <15 min tras descartar patología orgánica orientan a crisis de pánico.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-panico-ecg',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Taquicardia sinusal regular a 108 lpm, eje normal, QRS estrecho, sin ondas delta, sin alteraciones del segmento ST ni de la onda T.',
        referenceRange: 'Ritmo sinusal 60-100 lpm sin isquemia',
        interpretation: 'Descarta taquicardia supraventricular paroxística, fibrilación auricular e isquemia miocárdica.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-panico-labs',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'TSH sérica, Glucemia, Troponina I y Electrolitos',
        result: 'TSH: 1.8 mUI/L | Glucosa: 94 mg/dL | Troponina I: <3 ng/L (negativa) | K+: 4.1 mEq/L | Ca2+: 9.3 mg/dL.',
        referenceRange: 'TSH 0.4-4.0 mUI/L | Troponina <19 ng/L',
        interpretation: 'Descarta de forma objetiva causas médicas imitadoras (hipertiroidismo, hipoglucemia, síndrome coronario, alteraciones electrolíticas).',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Trastorno de Pánico (Crisis de Angustia / Ataque de Pánico Recurrente)',
      differentialDiagnoses: [
        'Taquicardia supraventricular paroxística o arritmia cardíaca',
        'Hipertiroidismo o feocromocitoma',
        'Tromboembolia pulmonar o crisis asmática',
        'Intoxicación por estimulantes o abstinencia',
      ],
      pathophysiology:
        'Activación paroxística espontánea del circuito del miedo (amígdala-locus coeruleus) con descarga noradrenérgica masiva e hiperventilación aguda, produciendo alcalosis respiratoria transitoria que disminuye calcio iónico libre generando parestesias distales y mareo sin lesión cardíaca o pulmonar.',
      keyClinicalClues: [
        'Episodio paroxístico súbito que alcanza pico máximo en <10-15 min con palpitaciones, ahogo, parestesias y terror de morir',
        'Recurrencia con ansiedad anticipatoria/evitación del transporte (criterios DSM-5 de Trastorno de Pánico)',
        'SpO2 100%, ECG solo con taquicardia sinusal, TSH y troponina normales',
      ],
      characteristicSignsSymptoms: [
        'Inicio súbito con pico en ≤10-15 minutos',
        'Miedo intenso a morir o perder el control',
        'Taquicardia sinusal, hiperventilación y parestesias por alcalosis respiratoria',
      ],
      criticalRulingOutFactors: [
        'Siempre descartar causas orgánicas urgentes (ECG, oximetría, glucemia, TSH) antes de etiquetar una crisis como ataque de pánico.',
      ],
      recommendedWorkup: ['ECG 12 derivaciones, oximetría, glucemia capilar/venosa y TSH (para descartar causas orgánicas)'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Sertralina o Escitalopram (ISRS de mantenimiento a primera línea)',
            dose: 'Sertralina 25 mg diarios la 1.ª semana, luego subir a 50 mg/día',
            route: 'Vía Oral',
            frequency: 'Cada 24 horas por la mañana',
            duration: 'Mínimo 6 a 12 meses con seguimiento en Salud Mental',
            rationale: 'Tratamiento preventivo definitivo de elección en Trastorno de Pánico recurrente (iniciar a mitad de dosis para evitar activación inicial).',
          },
          {
            drug: 'Alprazolam o Clonazepam (solo rescate breve en crisis aguda severa si se requiere)',
            dose: 'Alprazolam 0.25-0.5 mg VO dosis única en urgencias si ansiedad extrema persistente',
            route: 'Vía Oral',
            frequency: 'Solo dosis puntual o puente máx. 2 semanas mientras actúa el ISRS',
            duration: 'Uso estrictamente limitado (<2-4 semanas)',
            rationale: 'Alivio rápido en fase aguda evitando dependencia a largo plazo.',
          },
        ],
        generalMeasures: [
          'Psicoeducación calmada confirmando normalidad de ECG/corazón y que el episodio no es mortal.',
          'Entrenamiento en respiración diafragmática lenta (inhalar 4 s, exhalar 6 s) durante las crisis.',
          'Derivar a Psicoterapia Cognitivo-Conductual (TCC) y reducir cafeína/estimulantes.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Ideación suicida, depresión severa asociada o refractariedad a primer ISRS + TCC (Psiquiatría).'],
        followUp: 'Control en 2 semanas para vigilar tolerancia inicial al ISRS y avance psicoterapéutico.',
      },
      criticalSafetyAlerts: [
        'NUNCA diagnosticar ataque de pánico sin antes verificar signos vitales, saturación y ECG para no pasar por alto TEP, arritmia o síndrome coronario.',
        'Evitar dosis iniciales altas de ISRS (pueden provocar incremento paradójico inicial de ansiedad) y no dejar benzodiacepinas crónicas indefinidas.',
      ],
      guidelineReferences: [
        'APA Practice Guideline for Panic Disorder',
        'NICE CG113: Generalised anxiety disorder and panic disorder in adults',
      ],
    },
    internalPersonaPrompt:
      'Habla muy asustada pero tranquila poco a poco como Camila, de 25 años. En el metro te empezó de golpe el corazón a mil, falta de aire, hormigueo en las manos y miedo horrible de morir; ya te pasó tres veces este mes.',
  },
  {
    id: 'case-exp-com-bipolar-mania',
    mode: 'residente',
    specialty: 'psiquiatria',
    patientInfo: {
      name: 'Julián Esteban Herrera',
      age: 30,
      sex: 'Masculino',
      occupation: 'Vendedor de autos',
      consultReason: 'Lleva varios días sin dormir, muy inquieto y con conducta impulsiva',
      evolutionTime: '6 días de evolución',
      currentIllness:
        'Paciente masculino de 30 años traído por su hermano porque desde hace seis días duerme apenas una hora por noche y amanece con energía desbordante ("no necesita dormir"), habla muy rápido saltando de un proyecto empresarial grandioso a otro, está irritable cuando lo contradicen y ayer sacó un préstamo para comprar tres motocicletas de lujo sin tener ingresos para pagarlas. Hace un año tuvo un episodio de tristeza profunda de dos meses en el que apenas salía de su cama.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '126/78 mmHg',
      heartRate: 90,
      respiratoryRate: 18,
      temperature: 36.7,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 95,
      weightKg: 75,
      heightCm: 178,
    },
    background: {
      pathological: ['Episodio depresivo hace 1 año tratado brevemente con fluoxetina (suspendida hace 6 meses).'],
      nonPathological: ['Niega consumo de cocaína, metanfetaminas o alcohol en exceso.'],
      family: ['Padre hipertenso controlado; madre sana.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-mania-neuro',
        system: 'Neurológico',
        name: 'Examen del estado mental y exploración neurológica básica',
        finding:
          'Paciente hiperactivo, intrusivo, con logorrea (habla acelerada difícil de interrumpir), fuga de ideas, ánimo expansivo/eufórico con irritabilidad súbita al poner límites e ideas de grandiosidad ("diseñará la red eléctrica nacional"). Sin alteraciones de pares craneales ni focalización motora; pupilas normorreactivas de 3 mm (sin midriasis simpaticomimética extrema).',
        isAbnormal: true,
        semiologyNote:
          'Disminución de la necesidad de dormir + verborrea + fuga de ideas + grandiosidad + conducta de riesgo financiero + episodio depresivo previo cumplen DSM-5 para Manía Bipolar.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-mania-tox',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Tamizaje toxicológico en orina, TSH, Química y Pruebas Hepáticas',
        result: 'Tóxicos en orina (cocaína, anfetaminas, cannabis, opioides): NEGATIVOS | TSH: 2.0 mUI/L | Creatinina: 0.9 mg/dL | Na+: 140 mEq/L | AST/ALT normales.',
        referenceRange: 'Tóxicos negativos | TSH 0.4-4.0 mUI/L',
        interpretation: 'Descarta manía inducida por estimulantes o hipertiroidismo y aporta perfil renal/hepático basal para estabilizadores del ánimo.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Trastorno Bipolar Tipo I (Episodio Maníaco Agudo)',
      differentialDiagnoses: [
        'Intoxicación por estimulantes (cocaína o metanfetaminas)',
        'Esquizofrenia o trastorno esquizoafectivo',
        'Hipertiroidismo o lesión frontal orgánica',
        'Trastorno límite de la personalidad',
      ],
      pathophysiology:
        'Desregulación neurobiológica episódica de redes frontolímbicas y neurotransmisores monoaminérgicos (hiperactividad dopaminérgica en fase maníaca) con marcada heredabilidad genética.',
      keyClinicalClues: [
        'Ánimo expansivo/irritable con disminución de la necesidad de dormir (<2 h sin cansancio) por ≥6 días',
        'Verborrea, fuga de ideas, grandiosidad e imprudencia financiera grave (deterioro funcional)',
        'Antecedente de episodio depresivo previo + historia familiar bipolar + tóxicos y TSH negativos',
      ],
      characteristicSignsSymptoms: [
        'Disminución de la necesidad de dormir sin fatiga',
        'Taquilalia, fuga de ideas y grandiosidad',
        'Conductas impulsivas de riesgo financiero o personal',
      ],
      criticalRulingOutFactors: [
        'Panel toxicológico negativo y TSH normal excluyen causas secundarias farmacológicas o endocrinas.',
      ],
      recommendedWorkup: ['Tóxicos en orina, TSH, biometría, electrolitos, creatinina y pruebas hepáticas basales antes de iniciar estabilizador'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Antipsicótico atípico (Quetiapina, Olanzapina o Risperidona) + Estabilizador del ánimo (Litio o Ácido Valproico)',
            dose: 'Olanzapina 10 mg/día o Risperidona 2-4 mg/día + Carbonato de Litio (titular a litemia 0.8-1.2 mEq/L) o Valproato',
            route: 'Vía Oral (hospitalario)',
            frequency: 'Diaria / fraccionada según esquema psiquiátrico',
            duration: 'Fase aguda y mantenimiento a largo plazo',
            rationale: 'Combinación de antipsicótico atípico + estabilizador logra el control más rápido y eficaz de la manía aguda.',
          },
        ],
        generalMeasures: [
          'Hospitalización psiquiátrica voluntaria o supervisada para protección patrimonial, física y del sueño en ambiente de baja estimulación.',
          'Regular ciclo sueño-vigilia (puede apoyarse con benzodiacepina corta como lorazepam mientras actúa estabilizador).',
          'NO prescribir antidepresivos (ISRS/venlafaxina), pues precipitan empeoramiento de la manía o ciclaje rápido.',
        ],
        hospitalizationDecision: 'Hospitalización en Sala',
        referralCriteria: ['Todo episodio maníaco agudo con deterioro grave del juicio o conducta financiera/física de riesgo requiere manejo por Psiquiatría.'],
        followUp: 'Monitoreo estricto de niveles séricos (litemia/valproatemia), función renal y tiroidea.',
      },
      criticalSafetyAlerts: [
        'PROHIBIDO iniciar antidepresivos en monoterapia en trastorno bipolar o episodio maníaco: agravan la manía y el riesgo de viraje/ciclaje rápido.',
        'Siempre realizar tóxicos en orina y TSH antes de confirmar manía primaria.',
      ],
      guidelineReferences: [
        'CANMAT / ISBD Guidelines for Management of Patients with Bipolar Disorder',
        'NICE CG185: Bipolar disorder: assessment and management',
      ],
    },
    internalPersonaPrompt:
      'Habla muy entusiasta, rápido y con mucha energía como Julián, de 30 años. Llevas 6 días durmiendo una hora porque tienes mil ideas geniales de negocios y compraste tres motos a crédito; tu hermano te trajo a la fuerza.',
  },
  {
    id: 'case-exp-com-parkinson',
    mode: 'medico_general',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Don Ernesto Calderón',
      age: 67,
      sex: 'Masculino',
      occupation: 'Relojero retirado',
      consultReason: 'Temblor en la mano derecha y lentitud progresiva para caminar y realizar tareas',
      evolutionTime: '1 año de evolución',
      currentIllness:
        'Paciente masculino de 67 años que acude acompañado de su hija porque desde hace un año nota un temblor rítmico involuntario en su mano derecha cuando está viendo televisión con la mano apoyada en el regazo, el cual curiosamente desaparece cuando estira la mano para tomar un vaso. Además refiere que su letra se ha vuelto muy pequeña ("micrografía"), tarda mucho en abotonarse la camisa y camina con pasos más cortos y menor braceo del brazo derecho. Hace 4 años perdió parcialmente el olfato.',
      triageLevel: 'Nivel V (No Urgente)',
    },
    vitalSigns: {
      bloodPressure: '128/78 mmHg',
      heartRate: 70,
      respiratoryRate: 16,
      temperature: 36.5,
      oxygenSaturation: 98,
      glasgow: 15,
      bloodGlucose: 96,
      weightKg: 73,
      heightCm: 170,
    },
    background: {
      pathological: ['Hiposmia de 4 años y estreñimiento leve crónico; niega EVC previos.'],
      nonPathological: ['No toma neurolépticos, metoclopramida ni cinarizina (descarta parkinsonismo farmacológico).'],
      family: ['Sin antecedentes heredofamiliares de relevancia.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-parkinson-neuro',
        system: 'Neurológico',
        name: 'Exploración de pares craneales, tono, coordinación y marcha',
        finding:
          'Hipomimia facial leve y parpadeo disminuido. Temblor asimétrico de reposo (4-6 Hz) en mano derecha ("en cuenta de monedas") que disminuye al realizar maniobras intencionales. Bradicinesia franca en golpeteo de dedos (finger tapping) derecho con decremento progresivo de amplitud, rigidez en "rueda dentada" en muñeca derecha y disminución del braceo derecho al caminar (sin ataxia ni caídas tempranas).',
        isAbnormal: true,
        semiologyNote:
          'Bradicinesia (criterio obligatorio) + temblor asimétrico de reposo ("cuenta de monedas") + rigidez en rueda dentada sin fármacos antidopaminérgicos confirman Enfermedad de Parkinson.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-parkinson-rmn',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Resonancia Magnética / TAC cerebral estructural + Revisión farmacológica',
        result: 'Parénquima cerebral acorde a la edad sin infartos lacunares en ganglios basales, sin hidrocefalia normotensiva ni lesiones ocupantes de espacio.',
        referenceRange: 'Sin lesiones vasculares ni estructurales en ganglios basales',
        interpretation: 'Descarta parkinsonismo vascular, hidrocefalia normotensiva o lesiones focales secundarias.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Enfermedad de Parkinson Idiopática en Estadio Temprano',
      differentialDiagnoses: [
        'Temblor esencial benigno (temblor postural/cinético bilateral, sin bradicinesia ni rigidez, mejora con alcohol)',
        'Parkinsonismo secundario a fármacos (metoclopramida, haloperidol, cinarizina, valproato)',
        'Parkinsonismo vascular (inicio simétrico en piernas tras microinfartos)',
        'Atrofia multisistémica o parálisis supranuclear progresiva (caídas tempranas, disautonomía grave)',
      ],
      pathophysiology:
        'Degeneración idiopática progresiva de las neuronas dopaminérgicas de la sustancia negra pars compacta con acumulación intracelular de alfa-sinucleína (cuerpos de Lewy), produciendo déficit estriatal de dopamina responsable de bradicinesia, rigidez y temblor de reposo.',
      keyClinicalClues: [
        'Bradicinesia asimétrica obligatoria + temblor de reposo en "cuenta de monedas" que cede con la acción',
        'Rigidez en rueda dentada unilateral, micrografía, hiposmia prodrómica y pérdida de braceo derecho',
        'Ausencia de fármacos bloqueadores dopaminérgicos (metoclopramida/antipsicóticos)',
      ],
      characteristicSignsSymptoms: [
        'Bradicinesia (lentitud progresiva en movimientos repetitivos)',
        'Temblor asimétrico de reposo 4-6 Hz',
        'Rigidez en rueda dentada y micrografía',
      ],
      criticalRulingOutFactors: [
        'El temblor de reposo asimétrico + bradicinesia + rigidez diferencia claramente de temblor esencial (postural simétrico sin bradicinesia).',
      ],
      recommendedWorkup: ['Diagnóstico clínico (criterios MDS), revisión exhaustiva de medicamentos y neuroimagen estructural para descartar causas secundarias'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Levodopa / Carbidopa (o Agonista Dopaminérgico como Pramipexol/Ropinirol en <65 años)',
            dose: 'Levodopa/Carbidopa 250/25 mg: iniciar 1/2 tableta (125/12.5 mg) o 100/25 mg',
            route: 'Vía Oral',
            frequency: 'Cada 8 horas (30-45 min alejada de comidas ricas en proteínas)',
            duration: 'Terapia crónica ajustada por Neurología',
            rationale: 'Levodopa/Carbidopa es el tratamiento sintomático más eficaz y mejor tolerado en pacientes ≥65 años, con respuesta diagnóstica confirmatoria.',
          },
        ],
        generalMeasures: [
          'Ejercicio físico aeróbico regular, fisioterapia enfocada en amplitud de marcha/postura (LSVT-BIG) y terapia ocupacional.',
          'Prohibir fármacos antidopaminérgicos (metoclopramida, cleboprida, haloperidol, cinarizina/flunarizina) que empeoran el parkinsonismo.',
          'Control del estreñimiento con fibra/líquidos y referencia a Neurología.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Confirmación de diagnóstico, evaluación de respuesta a levodopa y seguimiento longitudinal por Neurología.'],
        followUp: 'Revaloración neurológica en 4 a 6 semanas para titulación de dosis y respuesta motora.',
      },
      criticalSafetyAlerts: [
        'NUNCA prescribir metoclopramida, haloperidol ni antipsicóticos típicos en enfermedad de Parkinson (precipitan acinesia grave o crisis parkinsoniana).',
        'Nunca suspender abruptamente la medicación dopaminérgica por riesgo de síndrome neuroléptico-like (hiperpirexia-acinesia).',
      ],
      guidelineReferences: [
        'MDS Clinical Diagnostic Criteria for Parkinson’s Disease',
        'NICE NG71: Parkinson’s disease in adults',
      ],
    },
    internalPersonaPrompt:
      'Habla pausado pero claro como Don Ernesto, relojero retirado de 67 años. Desde hace un año te tiembla la mano derecha cuando la dejas descansando, tu letra se hizo chiquita y caminas más lento.',
  },
  {
    id: 'case-exp-com-cefalea-racimos',
    mode: 'medico_general',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Rodrigo Javier Navarro',
      age: 34,
      sex: 'Masculino',
      occupation: 'Diseñador industrial',
      consultReason: 'Crisis diarias terribles de dolor detrás del ojo derecho que lo despiertan en la madrugada',
      evolutionTime: '10 días de evolución',
      currentIllness:
        'Paciente masculino de 34 años que consulta desesperado porque desde hace diez días sufre episodios diarios de dolor sumamente intenso ("como un clavo ardiendo") exclusivamente alrededor y detrás del ojo derecho, que aparecen puntual cada madrugada alrededor de las 2:00 AM y duran de 45 a 60 minutos. Durante la crisis el ojo derecho se pone rojo, lagrimea abundante, se le tapa la fosa nasal derecha y no soporta estar acostado, caminando agitado de un lado a otro. Una copa de cerveza el viernes le detonó un ataque a los 20 minutos.',
      triageLevel: 'Nivel III (Urgencia)',
    },
    vitalSigns: {
      bloodPressure: '132/82 mmHg',
      heartRate: 88,
      respiratoryRate: 18,
      temperature: 36.6,
      oxygenSaturation: 99,
      glasgow: 15,
      bloodGlucose: 93,
      weightKg: 78,
      heightCm: 179,
    },
    background: {
      pathological: ['Tuvo una racha idéntica durante 3 semanas hace 2 años que luego desapareció sola.'],
      nonPathological: ['Fuma 10 cigarrillos diarios; el alcohol desencadena crisis inmediatas durante el brote.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Tomó paracetamol e ibuprofeno sin ningún alivio.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-racimos-neuro',
        system: 'Cabeza y Cuello',
        name: 'Exploración neuro-oftalmológica y signos autonómicos craneales',
        finding:
          'Durante episodio inicial en observación se aprecia paciente sumamente inquieto (camina de un lado a otro), hiperemia conjuntival intensa derecha, epífora (lagrimeo unilateral), rinorrea/congestión nasal derecha y discreta ptosis con miosis derecha (síndrome de Horner parcial transitorio). Pupila reacciona normalmente, ojo blando a la palpación suave (descarta glaucoma) y sin rigidez nucal ni déficit de fuerza.',
        isAbnormal: true,
        semiologyNote:
          'Dolor periorbitario unilateral excruciante de 15-180 min + síntomas autonómicos ipsilaterales + agitación motora + ritmo circadiano nocturno es clásico de Cefalea en Racimos.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-racimos-rmn',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Resonancia Magnética cerebral con estudio de seno cavernoso/hipófisis (basal)',
        result: 'Sin masas selares, sin fístula carótido-cavernosa, sin trombosis venosa ni lesiones estructurales del tronco o trigémino.',
        referenceRange: 'Neuroimagen normal',
        interpretation: 'Descarta causas secundarias estructurales de cefalea trigémino-autonómica.',
        isAbnormal: false,
      },
    ],
    solution: {
      correctDiagnosis: 'Cefalea en Racimos (Cluster Headache Episódica)',
      differentialDiagnoses: [
        'Migraña sin aura (dura 4-72 h, prefiere oscuridad e inmovilidad en cama)',
        'Glaucoma agudo de ángulo cerrado (midriasis arreactiva y globo ocular duro)',
        'Hemicránea paroxística (crisis de 2-30 min múltiples veces al día, respuesta absoluta a indometacina)',
        'Disección carotídea interna o aneurisma comunicante posterior (dolor continuo con Horner fijo)',
      ],
      pathophysiology:
        'Activación paroxística del hipotálamo posterior (explicando su periodicidad circadiana y estacional) que coactiva el reflejo trigémino-autonómico causando dolor severo en territorio V1 y síntomas parasimpáticos craneales ipsilaterales (lagrimeo, rinorrea, inyección conjuntival y Horner parcial).',
      keyClinicalClues: [
        'Varón joven con dolor unilateral orbitario excruciante de 45-60 min a hora fija nocturna',
        'Acompañado de ojo rojo, lagrimeo, congestión nasal y miosis/ptosis ipsilateral (autonómicos) + agitación psicomotriz',
        'Desencadenado por alcohol durante el brote y resistente a analgésicos comunes',
      ],
      characteristicSignsSymptoms: [
        'Dolor retroorbitario unilateral severo ("suicida")',
        'Signos autonómicos ipsilaterales (ojo rojo, lagrimeo, rinorrea, Horner)',
        'Inquietud motora (a diferencia de la migraña que busca reposo quieto)',
      ],
      criticalRulingOutFactors: [
        'Agitación motora, duración <3 h y signos autonómicos unilaterales distinguen de migraña; ojo blando sin midriasis descarta glaucoma agudo.',
      ],
      recommendedWorkup: ['Diagnóstico clínico (ICHD-3); RMN cerebral en primer diagnóstico para descartar lesiones selares/cavernosas'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Oxígeno al 100% a alto flujo (abortivo agudo de 1.ª línea) + Sumatriptán subcutáneo 6 mg (o intranasal)',
            dose: 'Oxígeno 100% a 12-15 L/min por mascarilla sin reinhalación',
            route: 'Inhalatoria (y/o Subcutánea)',
            frequency: 'Durante 15 minutos al inicio de cada crisis',
            duration: 'Abortivo por crisis',
            rationale: 'El oxígeno al 100% a alto flujo logra remisión en ~70-80% en 15 minutos sin efectos adversos sistémicos.',
          },
          {
            drug: 'Verapamilo (preventivo de elección) + Prednisona (puente transicional)',
            dose: 'Verapamilo 80 mg VO c/8 h (240 mg/día con ECG basal PR) + Prednisona 60 mg/día con descenso en 10-14 días',
            route: 'Vía Oral',
            frequency: 'Verapamilo c/8 h; Prednisona c/24 h en descenso',
            duration: 'Mientras dura el racimo (puente esteroideo 2 semanas)',
            rationale: 'La prednisona corta las crisis en 48 h mientras el verapamilo alcanza efecto preventivo sostenido.',
          },
        ],
        generalMeasures: [
          'Abstinencia ABSOLUTA de alcohol (inclusive cerveza/vino en mínimas cantidades) durante todo el período del racimo.',
          'Evitar siestas diurnas y cesar tabaquismo.',
          'Control electrocardiográfico (intervalo PR) previo y durante titulación de verapamilo.',
        ],
        hospitalizationDecision: 'Ambulatorio',
        referralCriteria: ['Crisis intratables frecuentes con riesgo de autoagresión por dolor o alteración de conducción AV bajo verapamilo (Neurología).'],
        followUp: 'Control neurológico en 1 a 2 semanas con ECG de seguimiento.',
      },
      criticalSafetyAlerts: [
        'NUNCA dar opioides ni asumir glaucoma sin revisar pupila (en cluster hay miosis o pupila normal, no midriasis fija).',
        'Realizar siempre ECG basal antes de escalar verapamilo por riesgo de bloqueo auriculoventricular.',
      ],
      guidelineReferences: [
        'EAN Guidelines on the Treatment of Cluster Headache (2023)',
        'AHS Evidence-Based Guidelines for Cluster Headache',
      ],
    },
    internalPersonaPrompt:
      'Habla como Rodrigo, de 34 años. Cada madrugada a las 2 AM te despierta un dolor brutal detrás del ojo derecho que dura una hora, con ojo rojo, lagrimeo y nariz tapada de ese lado; te pones a caminar desesperado.',
  },
  {
    id: 'case-exp-com-hsa-aneurismatica',
    mode: 'urgencias',
    specialty: 'neurologia',
    patientInfo: {
      name: 'Mónica Beatriz Salgado',
      age: 49,
      sex: 'Femenino',
      occupation: 'Contadora pública',
      consultReason: 'Dolor de cabeza muy intenso de inicio súbito tras esfuerzo',
      evolutionTime: '3 horas de evolución',
      currentIllness:
        'Paciente femenina de 49 años traída por familiares a Urgencias porque hace tres horas, mientras levantaba una caja pesada en su oficina, presentó de manera instantánea ("como un mazazo o estallido en la cabeza") el dolor de cabeza más intenso que ha sentido en su vida, alcanzando máxima intensidad en menos de un minuto. Se acompañó de náuseas, dos vómitos en proyectil, pérdida breve del conocimiento de dos minutos y molestia intensa con la luz. Niega fiebre.',
      triageLevel: 'Nivel I (Reanimación)',
    },
    vitalSigns: {
      bloodPressure: '176/98 mmHg',
      heartRate: 94,
      respiratoryRate: 20,
      temperature: 36.9,
      oxygenSaturation: 97,
      glasgow: 14,
      bloodGlucose: 112,
      weightKg: 66,
      heightCm: 162,
    },
    background: {
      pathological: ['Hipertensión arterial leve sin tratamiento regular.'],
      nonPathological: ['Fuma 12 cigarrillos/día desde hace 20 años.'],
      family: ['Padres sin patologías crónicas referidas.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno actualmente.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-hsa-neuro',
        system: 'Neurológico',
        name: 'Exploración neurológica completa y signos meníngeos',
        finding:
          'Paciente somnolienta pero despertable al llamado (Glasgow 14: O3 V5 M6), intensa fotofobia. Rigidez de nuca franca y signo de Kernig positivo sin fiebre. Pares craneales: leve anisocoria incipiente con ptosis discreta derecha (sospecha de compresión parcial del III par por aneurisma comunicante posterior); fuerza conservada en las 4 extremidades.',
        isAbnormal: true,
        semiologyNote:
          'Cefalea "en trueno" (pico <1 min) + síncope inicial + rigidez de nuca afebril + antecedente familiar y tabaquismo = Hemorragia Subaracnoidea hasta demostrar lo contrario.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-hsa-tac',
        category: 'Imagen',
        subcategory: 'Tomografía',
        name: 'Tomografía Computarizada (TAC) de cráneo simple URGENTE + Angio-TAC',
        result:
          'TAC simple: Hiperdensidad espontánea difusa ocupando las cisternas basales, cisura interhemisférica anterior y ambas cisuras de Silvio (escala de Fisher III). Angio-TAC cerebral: dilatación sacular de 7 mm en bifurcación de arteria comunicante posterior derecha.',
        referenceRange: 'Cisternas basales hipodensas libres de sangre',
        interpretation: 'Confirma Hemorragia Subaracnoidea Aguda (Fisher III) secundaria a ruptura de aneurisma sacular.',
        isAbnormal: true,
      },
      {
        id: 'std-exp-hsa-labs',
        category: 'Laboratorio',
        subcategory: 'Bioquímica',
        name: 'Química, Electrolitos, Tiempos de Coagulación y ECG',
        result: 'Na+: 136 mEq/L | K+: 3.9 mEq/L | Plaquetas: 245,000 /mm³ | INR: 1.02 | ECG: inversión simétrica profunda de onda T ("ondas T cerebrales") con troponina normal.',
        referenceRange: 'Sin coagulopatía',
        interpretation: 'Sin coagulopatía; alteraciones neurogénicas secundarias en ECG frecuentes en HSA.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Hemorragia Subaracnoidea Aneurismática Aguda (Fisher III)',
      differentialDiagnoses: [
        'Meningitis bacteriana aguda (fiebre alta, evolución de horas-días, sin sangre en TAC)',
        'Disección arterial cervical o trombosis venosa cerebral',
        'Cefalea migrañosa severa (inicio progresivo, sin rigidez nucal ni sangrado)',
        'Hemorragia intraparenquimatosa hipertensiva',
      ],
      pathophysiology:
        'Ruptura aguda de un aneurisma sacular del polígono de Willis hacia el espacio subaracnoideo durante un pico hipertensivo (Valsalva), generando aumento brusco de presión intracraneal, irritación meníngea química por sangre y alto riesgo posterior de resangrado y vasoespasmo cerebral.',
      keyClinicalClues: [
        'Cefalea "en trueno" instantánea descrita como el peor dolor de la vida con pico <60 segundos tras esfuerzo',
        'Síncope transitorio inicial, vómitos en proyectil, fotofobia y rigidez de nuca afebril',
        'TAC de cráneo simple con sangre hiperdensa en cisternas basales + aneurisma en Angio-TAC',
      ],
      characteristicSignsSymptoms: [
        'Cefalea en trueno de inicio súbito máximo',
        'Rigidez de nuca afebril y fotofobia',
        'Hiperdensidad en cisternas basales en TAC simple',
      ],
      criticalRulingOutFactors: [
        'TAC simple positiva descarta meningitis y migraña de inmediato (si TAC fuera normal <6 h y sospecha alta, seguiría punción lumbar buscando xantocromía).',
      ],
      recommendedWorkup: ['TAC de cráneo simple inmediata (<15 min) + Angio-TAC cerebral + coagulograma/electrolitos + interconsulta neuroquirúrgica'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Nimodipino (neuroprotección obligatoria anti-vasoespasmo)',
            dose: '60 mg',
            route: 'Vía Oral (o por sonda nasogástrica si deterioro)',
            frequency: 'Cada 4 horas estricto (vigilando PAS)',
            duration: '21 días completos',
            rationale: 'Único fármaco con evidencia nivel I que reduce isquemia cerebral tardía y mejora pronóstico funcional tras HSA.',
          },
          {
            drug: 'Nicardipino o Labetalol IV (control cuidadoso de PAS <160 mmHg antes de excluir aneurisma) + Analgesia sin antiagregantes',
            dose: 'Labetalol 10-20 mg IV en bolo lento (meta PAS 140-155 mmHg antes de clipaje/embolización) + Paracetamol 1 g IV',
            route: 'Intravenosa',
            frequency: 'Titulado en UCI neurocrítica',
            duration: 'Pre-exclusión endovascular/quirúrgica',
            rationale: 'Previene resangrado catastrófico evitando hipotensión que comprometa perfusión cerebral.',
          },
        ],
        generalMeasures: [
          'Ingreso INMEDIATO a UCI Neurocrítica / Neurocirugía para exclusión temprana del aneurisma (<24-48 h mediante embolización endovascular o clipaje).',
          'Cabecera a 30°, reposo absoluto en cama en ambiente oscuro sin estímulos, ablandadores fecales para evitar Valsalva.',
          'PROHIBICIÓN ABSOLUTA de ácido acetilsalicílico, AINEs o anticoagulantes.',
        ],
        hospitalizationDecision: 'Unidad de Cuidados Intensivos (UCI)',
        referralCriteria: ['Toda HSA aneurismática es emergencia neuroquirúrgica de traslado inmediato a centro con Neurocirugía/Terapia Endovascular.'],
        followUp: 'Manejo intensivo en UCI con Doppler transcraneal diario para vigilar vasoespasmo (días 4 a 14).',
      },
      criticalSafetyAlerts: [
        'NUNCA administrar Aspirina, ketorolaco, AINEs ni heparina ante cefalea en trueno sin TAC previa: pueden causar resangrado fatal.',
        'Evitar descensos bruscos de presión arterial por debajo de PAS 120 mmHg (riesgo de isquemia cerebral por hipertensión intracraneal).',
      ],
      guidelineReferences: [
        'AHA/ASA 2023 Guideline for the Management of Patients With Aneurysmal Subarachnoid Hemorrhage',
      ],
    },
    internalPersonaPrompt:
      'Habla con voz apagada y mucha molestia por la luz como Mónica, de 49 años. Hace 3 horas al cargar una caja sentiste un estallido brutal en la cabeza —el peor dolor de tu vida—, te desmayaste breve y vomitaste.',
  },
  {
    id: 'case-exp-com-intox-co',
    mode: 'urgencias',
    specialty: 'toxicologia',
    patientInfo: {
      name: 'Víctor Hugo Contreras',
      age: 39,
      sex: 'Masculino',
      occupation: 'Mecánico automotriz',
      consultReason: 'Dolor de cabeza intenso, mareo, náuseas y confusión esta mañana',
      evolutionTime: '3 horas de evolución',
      currentIllness:
        'Paciente masculino de 39 años traído a Urgencias por paramédicos porque fue hallado somnoliento y desorientado en su taller cerrado donde trabajaba con un generador eléctrico a gasolina y un calentador de gas mal ventilados. Refiere dolor de cabeza pulsátil intenso generalizado, mareo, debilidad generalizada, náuseas y visión borrosa leve. Su compañero de taller que estaba en la misma habitación también presentó cefalea y mareo. Niega traumatismo craneal o ingesta de alcohol.',
      triageLevel: 'Nivel II (Emergencia)',
    },
    vitalSigns: {
      bloodPressure: '126/78 mmHg',
      heartRate: 112,
      respiratoryRate: 22,
      temperature: 36.7,
      oxygenSaturation: 99,
      glasgow: 13,
      bloodGlucose: 105,
      weightKg: 79,
      heightCm: 175,
    },
    background: {
      pathological: ['Previamente sano; sin epilepsia ni migraña previa.'],
      nonPathological: ['Exposición prolongada hoy en espacio cerrado sin ventilación a motor de combustión interna y calentador de gas.'],
      family: ['Sin antecedentes familiares relevantes.'],
      surgical: ['Ninguna.'],
      currentMedications: ['Ninguno.'],
      allergies: ['Sin alergias conocidas.'],
    },
    physicalExamPool: [
      {
        id: 'pe-exp-co-neuro',
        system: 'Neurológico',
        name: 'Exploración neurológica y signos de hipoxia tisular',
        finding:
          'Paciente confuso y somnoliento (Glasgow 13: O3 V4 M6), ataxia leve al intentar incorporarse y taquicardia sinusal (112 lpm). Mucosas rosadas (NO cianótico) y oxímetro de pulso estándar marca falsamente 99%. Sin signos de focalización motora ni rigidez de nuca.',
        isAbnormal: true,
        semiologyNote:
          'Cefalea + confusión + otro conviviente afectado en espacio cerrado con combustión + SpO2 falsamente normal (99%) es clásico de intoxicación por Monóxido de Carbono.',
      },
    ],
    studiesPool: [
      {
        id: 'std-exp-co-coox',
        category: 'Laboratorio',
        subcategory: 'Gases',
        name: 'Cooximetría en Gasometría Arterial (Carboxihemoglobina — COHb) y Lactato',
        result: 'Carboxihemoglobina (COHb): 28.4% (severamente elevada) | pH: 7.31 | PaO2: 96 mmHg | Lactato arterial: 4.2 mmol/L | Troponina I: 22 ng/L.',
        referenceRange: 'COHb <2% (no fumadores) / <5-8% (fumadores) | Lactato <2.0 mmol/L',
        interpretation: 'Intoxicación grave por Monóxido de Carbono con acidosis láctica por hipoxia celular mitocondrial (pese a PaO2 y SpO2 estándar normales).',
        isAbnormal: true,
      },
      {
        id: 'std-exp-co-ecg',
        category: 'Gabinete y Trazados',
        subcategory: 'Electrocardiograma',
        name: 'Electrocardiograma de 12 derivaciones',
        result: 'Taquicardia sinusal a 110 lpm con depresión leve inespecífica del ST en derivaciones laterales (estrés hipóxico miocárdico).',
        referenceRange: 'Ritmo sinusal sin alteraciones del ST',
        interpretation: 'Vigilar lesión miocárdica secundaria a hipoxia tisular por CO.',
        isAbnormal: true,
      },
    ],
    solution: {
      correctDiagnosis: 'Intoxicación Aguda Grave por Monóxido de Carbono (CO)',
      differentialDiagnoses: [
        'Intoxicación por cianuro (en incendios estructurales con hollín)',
        'Evento vascular cerebral agudo o meningoencefalitis',
        'Intoxicación etílica o por solventes orgánicos',
        'Gastroenteritis viral / migraña',
      ],
      pathophysiology:
        'El monóxido de carbono tiene una afinidad por la hemoglobina ~200-250 veces mayor que el oxígeno, formando carboxihemoglobina (COHb), desplazando a la izquierda la curva de disociación de la oxihemoglobina e inhibiendo directamente la citocromo c oxidasa mitocondrial, produciendo hipoxia tisular severa cerebral y cardíaca sin cianosis.',
      keyClinicalClues: [
        'Cefalea, confusión, mareo y otro trabajador afectado en taller cerrado con motor/calentador de gas',
        'Pulsioxímetro estándar falsamente normal (99%) pese a hipoxia celular grave',
        'Cooximetría arterial con COHb 28.4% y acidosis láctica (lactato 4.2 mmol/L)',
      ],
      characteristicSignsSymptoms: [
        'Cefalea, confusión, mareo y acidosis láctica',
        'Pulsioximetría convencional falsamente normal (98-100%)',
        'Carboxihemoglobina elevada en cooximetría + múltiples afectados en ambiente cerrado',
      ],
      criticalRulingOutFactors: [
        'La cooximetría (NO el oxímetro de pulso de dedo) es obligatoria porque el oxímetro convencional no distingue COHb de oxihemoglobina.',
      ],
      recommendedWorkup: ['Cooximetría en gasometría arterial/venosa (COHb), lactato, ECG 12 derivaciones y troponina seriadas'],
      optimalTreatment: {
        pharmacological: [
          {
            drug: 'Oxígeno Normobárico al 100% a alto flujo INMEDIATO (y valoración de Oxígeno Hiperbárico)',
            dose: 'Oxígeno 100% (15 L/min) con mascarilla con reservorio de no reinhalación sin esperar resultados',
            route: 'Inhalatoria',
            frequency: 'Continuo hasta COHb <5% y resolución completa de síntomas neurológicos',
            duration: 'Mínimo 4 a 6 horas (acorta vida media de COHb de ~5 h a ~60-90 min)',
            rationale: 'Desplaza competitivamente al CO de la hemoglobina y citocromos mitocondriales; reduce riesgo de secuela neurológica tardía.',
          },
        ],
        generalMeasures: [
          'Retirar de la fuente de exposición de inmediato y notificar para revisión del taller (evitar más víctimas).',
          'Considerar Oxigenoterapia Hiperbárica (2.5-3 ATA) al cumplir criterios de gravedad (COHb >25%, alteración del estado mental/Glasgow <15, acidosis láctica o isquemia miocárdica).',
          'Monitoreo cardíaco continuo y control seriado de troponina y estado neurológico.',
        ],
        hospitalizationDecision: 'Observación Urgencias',
        referralCriteria: ['COHb ≥25%, pérdida de conciencia, focalización, acidosis o embarazo (valorar cámara hiperbárica / UCI).'],
        followUp: 'Evaluación neurológica a las 2-4 semanas para vigilar síndrome neuropsiquiátrico tardío post-CO.',
      },
      criticalSafetyAlerts: [
        'NUNCA confiar en la SpO2 de un oxímetro de pulso estándar ni retirar el oxígeno al 100% solo porque marque 99-100%.',
        'Iniciar O2 100% con mascarilla con reservorio desde el minuto cero ante sospecha clínica sin esperar resultado de laboratorio.',
      ],
      guidelineReferences: [
        'ACEP Clinical Policy: Critical Issues in the Evaluation and Management of Adult Patients Presenting to the Emergency Department With Acute Carbon Monoxide Poisoning',
      ],
    },
    internalPersonaPrompt:
      'Habla algo lento y mareado como Víctor, mecánico de 39 años. Te duele mucho la cabeza, estás confundido y con náuseas después de estar trabajando en un taller cerrado con un generador de gasolina.',
  },
];
