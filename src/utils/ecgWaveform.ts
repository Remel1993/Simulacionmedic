import { ComplementaryStudy, VitalSigns } from '../types/clinical';

export type TracingKind =
  | 'ecg_12'
  | 'holter_ecg'
  | 'holter_bp'
  | 'spirometry'
  | 'eeg'
  | 'audiometry'
  | null;

export type LeadName =
  | 'DI'
  | 'DII'
  | 'DIII'
  | 'aVR'
  | 'aVL'
  | 'aVF'
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6';

export const ALL_ECG_LEADS: LeadName[] = [
  'DII',
  'DI',
  'DIII',
  'aVR',
  'aVL',
  'aVF',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
];

export const LEAD_GRID: LeadName[][] = [
  ['DI', 'aVR', 'V1', 'V4'],
  ['DII', 'aVL', 'V2', 'V5'],
  ['DIII', 'aVF', 'V3', 'V6'],
];

export const LEAD_TERRITORY_LABELS: Record<LeadName, string> = {
  DI: 'Cara lateral alta',
  DII: 'Cara inferior · Ritmo',
  DIII: 'Cara inferior',
  aVR: 'Cavidad ventricular',
  aVL: 'Cara lateral alta',
  aVF: 'Cara inferior',
  V1: 'Septal',
  V2: 'Septal',
  V3: 'Cara anterior',
  V4: 'Cara anterior',
  V5: 'Cara lateral baja',
  V6: 'Cara lateral baja',
};

export interface EcgProfile {
  hr: number;
  atrialHr: number;
  prMs: number;
  qrsMs: number;
  qtcMs: number;
  isAsystole: boolean;
  isAFib: boolean;
  isParoxysmalMix: boolean;
  isSVT: boolean;
  isVT: boolean;
  isCompleteAVBlock: boolean;
  isFirstDegAVBlock: boolean;
  isMobitz1: boolean;
  isMobitz2: boolean;
  isRBBB: boolean;
  isLBBB: boolean;
  isLAFB: boolean;
  isAnteriorSTEMI: boolean;
  isExtensiveAnterior: boolean;
  isInferiorSTEMI: boolean;
  isLateralSTEMI: boolean;
  isTakotsubo: boolean;
  stElevationMv: number;
  stDepressionMv: number;
  isStDepression: boolean;
  isPericarditis: boolean;
  isPeakedT: boolean;
  isS1Q3T3: boolean;
  isInvertedT: boolean;
  invertedTLeads: 'anterior' | 'lateral' | 'inferior' | 'diffuse' | null;
  isLVH: boolean;
  isLowVoltage: boolean;
  isAlternans: boolean;
  isLongQT: boolean;
  isFlatT: boolean;
}

function norm(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function stripMedicalNegations(txt: string): string {
  return txt
    .replace(
      /\bsin\s+(?:evidencia\s+de\s+|datos\s+de\s+|signos\s+de\s+|ondas?\s+t\s+)?(?:fibrilacion(?:\s+auricular)?|arritmias?(?:\s+supraventricular(?:es)?)?|isquemia(?:\s+aguda)?|supradesnivel(?:\s+agudo)?(?:\s+del\s+st)?|descenso(?:\s+del\s+st)?|elevacion(?:\s+ni\s+descenso)?(?:\s+del\s+st)?|inversion(?:\s+isquemica)?|picudas|hiperkalemia|onda\s+u|ondas\s+q|cambios\s+reciprocos|alternancia|bloqueo(?:\s+av|\s+de\s+rama)?|hipertrofia(?:\s+ventricular)?|descargas\s+epileptiformes|pausas|asimetrias?)[^.,;)]*/g,
      ' '
    )
    .replace(
      /\bausencia\s+(?:total\s+)?de\s+(?:supradesnivel|elevacion|ondas?\s+t\s+picudas|actividad\s+epileptiforme|ondas?\s+p\s+sinusales|hipoacusia)[^.,;)]*/g,
      ' '
    )
    .replace(/(?:\bpara\s+)?\bdescarta(?:r)?\s+[^.;)]*/g, ' ')
    .replace(
      /\b(?:con\s+)?(?:alto\s+)?riesgo(?:\s+(?:subito|inminente))?\s+de\s+(?:progresion\s+a\s+|evolucion\s+a\s+)?[^.;)]*/g,
      ' '
    )
    .replace(/\bno\s+se\s+registran\s+[^.;)]*/g, ' ');
}

export function detectTracingKind(study: ComplementaryStudy): TracingKind {
  const n = norm(study.name);

  const isBpHolter =
    /\bmapa\b/.test(n) ||
    n.includes('monitoreo ambulatorio de pa') ||
    n.includes('monitoreo ambulatorio de presion') ||
    (n.includes('holter') && (n.includes('presion') || n.includes('arterial')));
  if (isBpHolter) return 'holter_bp';
  if (n.includes('holter')) return 'holter_ecg';
  if (n.includes('electrocardiograma') || /\becg\b/.test(n) || /\bekg\b/.test(n)) return 'ecg_12';
  if (n.includes('espirometr')) return 'spirometry';
  if (n.includes('electroencefalograma') || /\beeg\b/.test(n)) return 'eeg';
  if (n.includes('audiometr')) return 'audiometry';
  return null;
}

/**
 * Selects the canonical ECG study from liveStudies so both the Urgencias single-lead
 * monitor strip and the 12-lead Complementary Studies viewer evaluate the exact same source.
 */
export function findCaseEcgStudy(
  studies: ComplementaryStudy[],
  fallbackVitals?: VitalSigns
): ComplementaryStudy {
  const candidates = (studies || []).filter((s) => detectTracingKind(s) === 'ecg_12');
  if (candidates.length > 0) {
    const dedicatedCurated = candidates.find(
      (s) => s.subcategory === 'Electrocardiograma' && !s.id.startsWith('hosp-ecg-12d')
    );
    if (dedicatedCurated) return dedicatedCurated;

    const nonGenericCurated = candidates.find((s) => !s.id.startsWith('hosp-ecg-12d'));
    if (nonGenericCurated) return nonGenericCurated;

    return candidates[0];
  }

  const hr =
    typeof fallbackVitals?.heartRate === 'number' && fallbackVitals.heartRate >= 0
      ? fallbackVitals.heartRate
      : 76;

  if (hr === 0 || (fallbackVitals?.bloodPressure || '').startsWith('0/')) {
    return {
      id: 'fallback-ecg-asystole',
      category: 'Gabinete y Trazados',
      subcategory: 'Electrocardiograma',
      name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
      result: 'TRAZO ISOELÉCTRICO CONTINUO (ASISTOLIA). Frecuencia cardíaca: 0 lpm.',
      interpretation: 'ASISTOLIA.',
      isAbnormal: true,
    };
  }

  const rhythmLabel =
    hr >= 100
      ? `Taquicardia sinusal regular a ${hr} lpm.`
      : hr <= 59
        ? `Bradicardia sinusal regular a ${hr} lpm.`
        : `Ritmo sinusal regular. Frecuencia cardíaca: ${hr} lpm.`;

  return {
    id: 'fallback-ecg-sinus',
    category: 'Gabinete y Trazados',
    subcategory: 'Electrocardiograma',
    name: 'Electrocardiograma estándar de 12 derivaciones (ECG)',
    result: `${rhythmLabel} Intervalo PR: 160 ms. Segmento ST isoeléctrico en todas las derivaciones. Ondas T concordantes.`,
    interpretation: 'Trazado electrocardiográfico acorde con los signos vitales actuales.',
    isAbnormal: hr >= 100 || hr <= 59,
  };
}

export function parseEcgProfile(study: ComplementaryStudy, vitalSigns?: VitalSigns): EcgProfile {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  // Preserve "ausencia de ondas p" BEFORE stripping generic negations
  const hasAbsentP = /ausencia(?:\s+total)?\s+de\s+ondas?\s+p|sustituidas\s+por\s+ondas?\s+f/.test(txt);
  const txtNoNeg = stripMedicalNegations(txt);

  const liveUpdateMatches = Array.from(
    txt.matchAll(
      /\[actualizacion en tiempo real\][^.\n]*?(?:frecuencia\s+cardiaca(?:\s+actual)?(?:\s+en\s+tira\s+de\s+control)?\s*[:de]*\s*|fc\s+en\s+vivo\s*[:de]*\s*)(\d{1,3})\s*(?:lpm|bpm)/g
    )
  );
  const liveHrMatch = liveUpdateMatches.length > 0 ? liveUpdateMatches[liveUpdateMatches.length - 1] : null;

  const ventHrMatch = txt.match(
    /(?:frecuencia\s+ventricular(?:\s+media)?|ritmo\s+de\s+escape[^.,;]*?)\s*(?:de|a|:)?\s*(\d{1,3})\s*(?:lpm|bpm)/
  );

  const hrMatch =
    liveHrMatch ||
    ventHrMatch ||
    txt.match(
      /(?:fc(?:\s+media)?|frecuencia(?:\s+cardiaca|\s+ventricular\s+media)?)\s*(?:de|:)?\s*(\d{1,3})\s*(?:lpm|bpm)?/
    ) ||
    txt.match(/\b(\d{1,3})\s*(?:lpm|bpm|latidos)\b/);

  const isAsystole =
    /\b(asistolia|trazo isoelectrico|paro cardiorrespiratorio|paro cardiaco)\b/.test(txt) ||
    vitalSigns?.heartRate === 0 ||
    (vitalSigns?.bloodPressure || '').startsWith('0/') ||
    hrMatch?.[1] === '0';

  if (isAsystole) {
    return {
      hr: 0,
      atrialHr: 0,
      prMs: 0,
      qrsMs: 0,
      qtcMs: 0,
      isAsystole: true,
      isAFib: false,
      isParoxysmalMix: false,
      isSVT: false,
      isVT: false,
      isCompleteAVBlock: false,
      isFirstDegAVBlock: false,
      isMobitz1: false,
      isMobitz2: false,
      isRBBB: false,
      isLBBB: false,
      isLAFB: false,
      isAnteriorSTEMI: false,
      isExtensiveAnterior: false,
      isInferiorSTEMI: false,
      isLateralSTEMI: false,
      isTakotsubo: false,
      stElevationMv: 0,
      stDepressionMv: 0,
      isStDepression: false,
      isPericarditis: false,
      isPeakedT: false,
      isS1Q3T3: false,
      isInvertedT: false,
      invertedTLeads: null,
      isLVH: false,
      isLowVoltage: false,
      isAlternans: false,
      isLongQT: false,
      isFlatT: false,
    };
  }

  // When live vitalSigns are supplied, use the live physiological HR so the monitor strip,
  // vital signs header, and complementary ECG stay strictly synchronized in real time.
  const rawHr =
    typeof vitalSigns?.heartRate === 'number' && vitalSigns.heartRate > 0
      ? vitalSigns.heartRate
      : hrMatch
        ? Number(hrMatch[1])
        : 76;
  const hr = Math.max(24, Math.min(220, rawHr));

  const atrialHrMatch = txt.match(/ondas?\s+p\s+(?:sinusales\s+)?(?:regulares\s+)?(?:a|de|:)?\s*(\d{2,3})\s*(?:lpm|bpm)/);
  const atrialHr = atrialHrMatch ? Math.max(40, Math.min(160, parseInt(atrialHrMatch[1], 10))) : 80;

  const stElevMmMatch = txtNoNeg.match(/(?:elevacion|supradesnivel)[^.,;]{0,35}?(\d(?:\.\d)?)\s*mm/);
  const stElevationMv = stElevMmMatch ? Math.min(0.65, Math.max(0.25, Number(stElevMmMatch[1]) * 0.1)) : 0.42;

  const stDepMmMatch = txtNoNeg.match(/(?:descenso|infradesnivel|depresion)[^.,;]{0,35}?(\d(?:\.\d)?)\s*mm/);
  const stDepressionMv = stDepMmMatch ? Math.min(0.45, Math.max(0.12, Number(stDepMmMatch[1]) * 0.1)) : 0.20;

  const isParoxysmalMix = /taquicardia\s+sinusal.*fibrilacion\s+auricular\s+paroxistica/.test(txtNoNeg);
  const isAFib =
    hasAbsentP ||
    isParoxysmalMix ||
    /fibrilatori|r-r\s+completamente\s+irregulares|irregularmente\s+irregulares|fibrilacion\s+auricular/.test(
      txtNoNeg
    );

  const isVT =
    !isAFib &&
    (/taquicardia\s+ventricular|monomorfica\s+sostenida/.test(txtNoNeg) ||
      (/complejos?\s+qrs\s+anchos?/.test(txtNoNeg) && hr >= 120));
  const isSVT =
    !isAFib &&
    !isVT &&
    /taquicardia\s+supraventricular|\btpsv\b|\btsvp\b|reentrada\s+nodal|flutter\s+auricular/.test(txtNoNeg);

  const isMobitz1 =
    /mobitz\s*(?:i|1)\b|wenckebach|alargamiento\s+progresivo\s+del\s+(?:intervalo\s+)?pr/.test(txtNoNeg);
  const isMobitz2 =
    !isMobitz1 &&
    /mobitz\s*(?:ii|2)\b|ondas?\s+p\s+bloqueadas?\s+(?:intermitentes|sin\s+alargamiento)/.test(txtNoNeg);
  const isCompleteAVBlock =
    !isVT &&
    !isMobitz1 &&
    !isMobitz2 &&
    /bloqueo\s+av\s+(?:completo|de\s+(?:tercer|3\.?\s*er)\s+grado)|disociacion\s+av/.test(txtNoNeg);
  const isFirstDegAVBlock =
    !isCompleteAVBlock &&
    !isMobitz1 &&
    !isMobitz2 &&
    /bloqueo\s+(?:av|auriculoventricular)\s+(?:de\s+)?(?:primer|1\.?\s*er)\s+grado|pr\s+(?:ligeramente\s+|discretamente\s+)?prolongado/.test(
      txtNoNeg
    );
  const isRBBB =
    !isVT && /bloqueo\s+(?:completo\s+)?de\s+rama\s+derecha|\bbrdhh\b|patron\s+rsr|orejas\s+de\s+conejo/.test(txtNoNeg);
  const isLBBB =
    !isVT &&
    !isRBBB &&
    /bloqueo\s+(?:completo\s+)?de\s+rama\s+izquierda|\bbrihh\b|r\s+ancha\s+y\s+mellada/.test(txtNoNeg);
  const isLAFB =
    !isVT && /hemibloqueo\s+(?:fascicular\s+)?anterior\s+izquierdo|bloqueo\s+bifascicular|eje[^.,;]*-60/.test(txtNoNeg);

  // Parse explicit PR interval in ms (standard normal: 120-200 ms; 1st-degree AV block: > 200 ms = > 1 large square)
  const prMsMatch =
    !isMobitz1
      ? txt.match(/\bpr\b[^.;\n]{0,40}?\(?(\d{3})\s*ms\)?/)
      : null;
  const parsedPrMs = prMsMatch ? parseInt(prMsMatch[1], 10) : 0;
  const prMs =
    parsedPrMs >= 100 && parsedPrMs <= 460
      ? parsedPrMs
      : isFirstDegAVBlock
        ? 220 // 1.10 large squares (> 200 ms / > 1 large square diagnostic threshold)
        : 160; // Classic normal PR = 160 ms (4 small squares)

  // Parse explicit QRS duration in ms (standard normal: < 120 ms; BBB/VT/escape: >= 120 ms)
  const qrsMsMatch = txt.match(/\bqrs\b[^.;\n]{0,45}?\(?(\d{2,3})\s*ms\)?/);
  const parsedQrsMs = qrsMsMatch ? parseInt(qrsMsMatch[1], 10) : 0;
  const qrsMs =
    parsedQrsMs >= 65 && parsedQrsMs <= 210
      ? parsedQrsMs
      : isVT
        ? 160
        : isLBBB
          ? 145
          : isRBBB || isCompleteAVBlock
            ? 135
            : 85;

  const isTakotsubo = /takotsubo/.test(txtNoNeg);

  const isPericarditis =
    !isTakotsubo &&
    !/iamcest/.test(txtNoNeg) &&
    /silla de montar|concava[^.,;]*st|descenso del segmento pr|pericarditis|elevacion difusa[^.,;]*(?:todas|12 derivaciones|concava)/.test(
      txtNoNeg
    );

  const isAnteriorSTEMI =
    !isPericarditis &&
    (/(?:elevacion|supradesnivel)[^.,;]*st[^.,;]*(?:v1|v2|v3|v4|cara anterior|anteroseptal|extens|apical|precordial)/.test(
      txtNoNeg
    ) ||
      /(?:v1|v2|v3|v4|cara anterior|precordiales)[^.,;]*(?:elevacion|supradesnivel)/.test(txtNoNeg) ||
      /iamcest\s+anterior/.test(txtNoNeg) ||
      isTakotsubo);

  // Only treat as extensive anterior (V1-V6) when V5/V6 or "anterior extenso" are present, not isolated "anteroseptal" V1-V4
  const isExtensiveAnterior =
    isAnteriorSTEMI &&
    (/(?:v5|v6)/.test(txtNoNeg) || /anterior\s+extens/.test(txtNoNeg) || isTakotsubo);

  const isInferiorSTEMI =
    !isPericarditis &&
    (/(?:elevacion|supradesnivel)[^.,;]*st[^.,;]*(?:dii\b|diii\b|avf|cara inferior|inferiores)/.test(txtNoNeg) ||
      /(?:dii\b|diii\b|avf|cara inferior)[^.,;]*(?:elevacion|supradesnivel)/.test(txtNoNeg) ||
      /iamcest\s+inferior/.test(txtNoNeg));

  const isLateralSTEMI =
    !isPericarditis &&
    !isAnteriorSTEMI &&
    (/(?:elevacion|supradesnivel)[^.,;]*st[^.,;]*(?:v5|v6|\bdi\b|avl|cara lateral)/.test(txtNoNeg) ||
      /iamcest\s+lateral/.test(txtNoNeg));

  const isAnySTEMI = isAnteriorSTEMI || isInferiorSTEMI || isLateralSTEMI;

  // Subendocardial ischemia / NSTEMI ST depression (ignore mirror changes of STEMI)
  const isStDepression =
    !isAnySTEMI &&
    !isPericarditis &&
    /(?:descenso|infradesnivel|depresion)[^.,;]*st|lesion\s+subendocardica|iamsest|scasest/.test(txtNoNeg);

  const isPeakedT = /ondas?\s*t\s*(?:altas|picudas)|t\s+picudas|hiperkalemia/.test(txtNoNeg);

  const isS1Q3T3 = /s1q3t3|onda s profunda en di|onda q y t negativa en diii/.test(txtNoNeg);

  // Do not misclassify expected secondary RBBB/LBBB T-wave discordance as primary ischemic T-wave inversion
  const txtForPrimaryT = txtNoNeg.replace(
    /inversion\s+secundaria[^.,;]*ondas?\s+t[^.,;]*/g,
    ' '
  );
  const hasInvertedTMention =
    /inversion(?:\s+[a-z]+){0,3}\s+de\s+(?:las?\s+)?ondas?\s+t|ondas?\s+t\s+(?:invertidas?|negativas?|cerebrales)|isquemia\s+subepicardica/.test(
      txtForPrimaryT
    );

  let invertedTLeads: EcgProfile['invertedTLeads'] = null;
  if (hasInvertedTMention && !isS1Q3T3) {
    if (isTakotsubo || /v2-v6|difus|cerebrales/.test(txtForPrimaryT)) invertedTLeads = 'diffuse';
    else if (/v1|v2|v3|anterior/.test(txtForPrimaryT)) invertedTLeads = 'anterior';
    else if (/v4|v5|v6|lateral|avl/.test(txtForPrimaryT)) invertedTLeads = 'lateral';
    else if (/dii|diii|avf|inferior/.test(txtForPrimaryT)) invertedTLeads = 'inferior';
    else invertedTLeads = 'diffuse';
  }

  const isLVH = /hipertrofia\s+ventricular\s+izquierda|sokolow|sobrecarga\s+sistolica|hipertrofia.*sobrecarga/.test(
    txtNoNeg
  );

  // Parse explicit QTc value in ms (supports "QTc: 420 ms", "QTc (482 ms)", "QTc prolongado (490 ms)")
  const qtcValMatch = txtNoNeg.match(/\bqtc\b[^.;\n]{0,35}?\(?(\d{3})\s*ms\)?/);
  const parsedQtcMs = qtcValMatch ? parseInt(qtcValMatch[1], 10) : 0;
  const isLongQT =
    /qtc[^.,;]*(?:prolongado|largo)|prolongacion[^.,;]*qtc/.test(txtNoNeg) ||
    parsedQtcMs >= 465;
  const qtcMs =
    parsedQtcMs >= 340 && parsedQtcMs <= 640
      ? parsedQtcMs
      : isLongQT
        ? 495
        : 410;

  const isLowVoltage = /bajo\s+voltaje/.test(txtNoNeg);
  const isAlternans = /alternancia\s+electrica/.test(txtNoNeg);
  const isFlatT =
    !hasInvertedTMention &&
    (/aplanamiento[^.,;]*ondas?\s*t|ondas?\s*t[^.,;]*(?:algo\s+)?aplanadas?|onda\s*t[^.,;]*aplanada/.test(txtNoNeg));

  return {
    hr,
    atrialHr,
    prMs,
    qrsMs,
    qtcMs,
    isAsystole: false,
    isAFib,
    isParoxysmalMix,
    isSVT,
    isVT,
    isCompleteAVBlock,
    isFirstDegAVBlock,
    isMobitz1,
    isMobitz2,
    isRBBB,
    isLBBB,
    isLAFB,
    isAnteriorSTEMI,
    isExtensiveAnterior,
    isInferiorSTEMI,
    isLateralSTEMI,
    isTakotsubo,
    stElevationMv,
    stDepressionMv,
    isStDepression,
    isPericarditis,
    isPeakedT,
    isS1Q3T3,
    isInvertedT: hasInvertedTMention && !isS1Q3T3,
    invertedTLeads,
    isLVH,
    isLowVoltage,
    isAlternans,
    isLongQT,
    isFlatT,
  };
}

export function gaussian(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z);
}

/**
 * Computes physiological P, QRS, ST, and T centers/widths in seconds for a single beat,
 * strictly respecting standard electrocardiographic definitions:
 * - PR interval = P-wave onset to QRS onset (pOnset -> qrsOnset)
 * - QRS duration = QRS onset to J-point
 * - QT interval (Bazett) = QRS onset to T-wave end (QT = QTc * sqrt(RR))
 */
function getBeatTiming(beatIndex: number, p: EcgProfile) {
  const mobitzCycle = beatIndex % 4;
  const droppedQrs = (p.isMobitz1 || p.isMobitz2) && mobitzCycle === 3;

  // Classic Wenckebach (Mobitz I): progressive PR lengthening with decreasing increment so R-R shortens before pause
  let prSec = p.prMs / 1000;
  if (p.isMobitz1) {
    prSec = mobitzCycle === 0 ? 0.175 : mobitzCycle === 1 ? 0.240 : mobitzCycle === 2 ? 0.280 : 0.280;
  }

  const qrsSec = p.qrsMs / 1000;
  const qrsWidth = Math.max(0.85, qrsSec / 0.085);

  const pSigma = 0.019;
  const pHalf = 0.040; // ~2.1 * pSigma -> P duration ~80 ms
  const qrsHalf = 0.040 * qrsWidth; // ~half of QRS complex width
  const tSigma = p.isPeakedT ? 0.024 : 0.046;
  const tHalf = 2.05 * tSigma;

  const pCenter = 0.058;
  const pOnset = pCenter - pHalf; // 0.018 s
  const qrsOnset = pOnset + prSec;
  const rCenter = qrsOnset + qrsHalf;
  const jPoint = qrsOnset + qrsSec;

  // Rate-corrected QT interval via Bazett's formula (clamped to avoid overlapping next P wave except extreme tachycardia)
  const rrSec = 60 / Math.max(24, p.hr);
  const rawQtSec = (p.qtcMs / 1000) * Math.sqrt(rrSec);
  const maxQtForRate = p.hr >= 150 ? rrSec * 0.78 : Math.max(0.24, rrSec - prSec - 0.04);
  const qtSec = Math.max(qrsSec + 0.11, Math.min(rawQtSec, maxQtForRate));
  const tEnd = qrsOnset + qtSec;
  const tCenter = Math.max(jPoint + tHalf * 0.85, tEnd - tHalf);

  return {
    droppedQrs,
    prSec,
    qrsSec,
    qrsWidth,
    pCenter,
    pOnset,
    qrsOnset,
    rCenter,
    jPoint,
    tCenter,
    tEnd,
    tSigma,
  };
}

export function sampleEcgLeadMv(
  phaseSec: number,
  beatIndex: number,
  lead: LeadName,
  p: EcgProfile,
  omitPWave = false
): number {
  const leadScale: Record<LeadName, { pAmp: number; qAmp: number; rAmp: number; sAmp: number; tAmp: number }> = {
    DI: { pAmp: 0.11, qAmp: -0.05, rAmp: 0.72, sAmp: -0.1, tAmp: 0.22 },
    DII: { pAmp: 0.16, qAmp: -0.06, rAmp: 0.98, sAmp: -0.12, tAmp: 0.28 },
    DIII: { pAmp: 0.08, qAmp: -0.04, rAmp: 0.42, sAmp: -0.14, tAmp: 0.12 },
    aVR: { pAmp: -0.13, qAmp: -0.58, rAmp: 0.12, sAmp: -0.25, tAmp: -0.24 },
    aVL: { pAmp: 0.06, qAmp: -0.05, rAmp: 0.45, sAmp: -0.1, tAmp: 0.14 },
    aVF: { pAmp: 0.12, qAmp: -0.05, rAmp: 0.68, sAmp: -0.12, tAmp: 0.22 },
    V1: { pAmp: 0.06, qAmp: 0, rAmp: 0.22, sAmp: -0.82, tAmp: -0.12 },
    V2: { pAmp: 0.08, qAmp: 0, rAmp: 0.45, sAmp: -0.78, tAmp: 0.26 },
    V3: { pAmp: 0.09, qAmp: -0.02, rAmp: 0.85, sAmp: -0.45, tAmp: 0.34 },
    V4: { pAmp: 0.1, qAmp: -0.05, rAmp: 1.15, sAmp: -0.22, tAmp: 0.35 },
    V5: { pAmp: 0.1, qAmp: -0.06, rAmp: 1.02, sAmp: -0.12, tAmp: 0.28 },
    V6: { pAmp: 0.09, qAmp: -0.05, rAmp: 0.82, sAmp: -0.08, tAmp: 0.24 },
  };

  const base = { ...leadScale[lead] };
  let stShift = 0;
  let prShift = 0;
  let rPrimeAmp = 0;

  const timing = getBeatTiming(beatIndex, p);
  const { droppedQrs, qrsWidth, pCenter, rCenter, jPoint, tCenter, tSigma } = timing;

  // Low voltage (uniform small QRS, e.g., myxedema) vs electrical alternans (tamponade)
  if (p.isAlternans) {
    const mult = beatIndex % 2 === 0 ? 0.44 : 0.22;
    base.rAmp *= mult;
    base.sAmp *= mult;
    base.qAmp *= mult;
  } else if (p.isLowVoltage) {
    const mult = 0.42;
    base.rAmp *= mult;
    base.sAmp *= mult;
    base.qAmp *= mult;
  }

  // LVH Voltage + Strain
  if (p.isLVH) {
    if (lead === 'V1' || lead === 'V2') {
      base.sAmp = -1.65;
      base.rAmp = 0.15;
    } else if (lead === 'V5' || lead === 'V6') {
      base.rAmp = 2.05;
      stShift = -0.14;
      base.tAmp = -0.28;
    } else if (lead === 'DI' || lead === 'aVL') {
      base.rAmp = 1.25;
      stShift = -0.1;
      base.tAmp = -0.2;
    }
  }

  // Anterior / Extensive STEMI (convex Pardee wave + mirror depression in II/III/aVF)
  if (p.isAnteriorSTEMI) {
    const antLeads: LeadName[] = p.isTakotsubo
      ? ['V2', 'V3', 'V4', 'V5', 'V6', 'DI', 'aVL']
      : p.isExtensiveAnterior
        ? ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']
        : ['V1', 'V2', 'V3', 'V4'];
    if (antLeads.includes(lead)) {
      stShift = lead === 'V2' || lead === 'V3' ? p.stElevationMv : p.stElevationMv * 0.72;
      base.sAmp = 0;
      base.qAmp = !p.isTakotsubo && (lead === 'V1' || lead === 'V2') ? -0.18 : base.qAmp;
      base.tAmp = p.isTakotsubo ? -0.38 : Math.max(base.tAmp, 0.48);
    } else if (!p.isTakotsubo && (lead === 'DII' || lead === 'DIII' || lead === 'aVF')) {
      stShift = -0.17;
    }
  }

  // Inferior STEMI (DII, DIII, aVF + mirror depression in DI, aVL)
  if (p.isInferiorSTEMI) {
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = p.stElevationMv * 0.85;
      base.sAmp = 0;
      base.tAmp = 0.42;
    } else if (lead === 'DI' || lead === 'aVL') {
      stShift = -0.17;
    }
  }

  // Lateral STEMI
  if (p.isLateralSTEMI) {
    if (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') {
      stShift = p.stElevationMv * 0.8;
      base.sAmp = 0;
      base.tAmp = 0.4;
    } else if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') {
      stShift = -0.15;
    }
  }

  // Subendocardial ischemia / NSTEMI ST depression
  if (
    p.isStDepression &&
    (lead === 'V3' || lead === 'V4' || lead === 'V5' || lead === 'V6' || lead === 'DI' || lead === 'aVL')
  ) {
    stShift = -p.stDepressionMv;
    base.tAmp = -0.22;
  }

  // Pericarditis (diffuse concave ST elevation + PR depression, opposite in aVR / V1)
  if (p.isPericarditis) {
    if (lead !== 'aVR' && lead !== 'V1') {
      stShift = 0.24;
      prShift = -0.075;
    } else if (lead === 'aVR') {
      prShift = 0.075;
      stShift = -0.14;
    }
  }

  // Hyperkalemia Peaked T waves (tall narrow symmetric tented T)
  if (p.isPeakedT && (lead === 'V2' || lead === 'V3' || lead === 'V4' || lead === 'V5')) {
    base.tAmp = 0.92;
  }

  // Pulmonary Embolism S1Q3T3 + anterior precordial T inversion (V1-V3)
  if (p.isS1Q3T3) {
    if (lead === 'DI') base.sAmp = -0.52;
    if (lead === 'DIII') {
      base.qAmp = -0.34;
      base.tAmp = -0.28;
    }
    if (lead === 'V1' || lead === 'V2' || lead === 'V3') {
      base.tAmp = -0.34;
    }
  }

  // Explicit primary T-wave inversion
  if (p.isInvertedT && !p.isTakotsubo && lead !== 'aVR') {
    const matchTarget =
      p.invertedTLeads === 'diffuse' ||
      (p.invertedTLeads === 'anterior' && (lead === 'V1' || lead === 'V2' || lead === 'V3')) ||
      (p.invertedTLeads === 'lateral' &&
        (lead === 'V4' || lead === 'V5' || lead === 'V6' || lead === 'DI' || lead === 'aVL')) ||
      (p.invertedTLeads === 'inferior' && (lead === 'DII' || lead === 'DIII' || lead === 'aVF'));
    if (matchTarget) {
      base.tAmp = -0.36;
    }
  }

  if (p.isFlatT && lead !== 'aVR') {
    base.tAmp *= 0.24;
  }

  // Bundle Branch & Fascicular Blocks
  if (p.isLAFB) {
    if (lead === 'DI' || lead === 'aVL') {
      base.qAmp = -0.14;
      base.rAmp = 1.15;
    } else if (lead === 'DII' || lead === 'aVF') {
      base.rAmp = 0.22;
      base.sAmp = -0.82;
    } else if (lead === 'DIII') {
      base.rAmp = 0.18;
      base.sAmp = -1.12; // SIII > SII
    }
  }

  if (p.isRBBB) {
    if (lead === 'V1' || lead === 'V2') {
      base.qAmp = 0;
      base.rAmp = 0.30;
      base.sAmp = -0.38;
      rPrimeAmp = 0.82;
      base.tAmp = -0.24;
    } else if (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') {
      base.sAmp = -0.48;
    }
  }

  if (p.isLBBB) {
    if (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') {
      base.qAmp = 0;
      base.rAmp = 0.92;
      base.sAmp = 0;
      rPrimeAmp = 0.78;
      stShift = -0.14;
      base.tAmp = -0.30;
    } else if (lead === 'V1' || lead === 'V2' || lead === 'V3') {
      base.qAmp = 0;
      base.rAmp = 0.08;
      base.sAmp = -1.28;
      base.tAmp = 0.28;
    }
  }

  let v = 0;

  // P wave, f-waves, SVT, or Complete AV Block
  if (p.isAFib) {
    v +=
      0.038 * Math.sin(2 * Math.PI * 6.5 * (phaseSec + beatIndex * 0.17)) +
      0.026 * Math.cos(2 * Math.PI * 9.2 * (phaseSec + beatIndex * 0.31));
  } else if (!omitPWave && !p.isSVT && !p.isVT) {
    v += base.pAmp * gaussian(phaseSec, pCenter, 0.019);
    if (prShift !== 0 && phaseSec > pCenter + 0.018 && phaseSec < timing.qrsOnset) {
      v += prShift;
    }
  }
  if (droppedQrs) {
    return v;
  }
  if (p.isVT) {
    base.tAmp = -0.36;
  }

  // QRS complex (rsR' in RBBB V1-V2, notched broad R plateau in LBBB lateral, or standard qRs)
  if (p.isRBBB && (lead === 'V1' || lead === 'V2')) {
    v += base.rAmp * gaussian(phaseSec, rCenter - 0.028, 0.0085);
    v += base.sAmp * gaussian(phaseSec, rCenter, 0.0095);
    v += rPrimeAmp * gaussian(phaseSec, rCenter + 0.032, 0.0155);
  } else if (p.isLBBB && (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6')) {
    v += base.rAmp * gaussian(phaseSec, rCenter - 0.018, 0.0145);
    v += rPrimeAmp * gaussian(phaseSec, rCenter + 0.020, 0.0165);
  } else {
    v += base.qAmp * gaussian(phaseSec, rCenter - 0.022 * qrsWidth, 0.008 * qrsWidth);
    v += base.rAmp * gaussian(phaseSec, rCenter, 0.011 * qrsWidth);
    v +=
      base.sAmp *
      gaussian(
        phaseSec,
        rCenter +
          (p.isRBBB && (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') ? 0.036 : 0.022 * qrsWidth),
        (p.isRBBB ? 0.016 : 0.009) * qrsWidth
      );
  }

  // ST segment shift (convex dome for STEMI, concave upward for pericarditis, horizontal shelf for NSTEMI depression)
  if (stShift !== 0) {
    const jStart = jPoint - 0.004;
    const tEndEnv = tCenter + tSigma * 0.7;
    if (phaseSec >= jStart && phaseSec <= tEndEnv) {
      const progress = (phaseSec - jStart) / Math.max(0.04, tEndEnv - jStart);
      let envelope: number;
      if (p.isPericarditis) {
        envelope = 0.52 + 0.48 * Math.pow(Math.sin(Math.PI * progress * 0.76), 1.6);
      } else if (stShift > 0) {
        envelope = 0.86 + 0.14 * Math.sin(Math.PI * progress);
      } else {
        // Horizontal / flat ST depression up to T onset
        envelope = progress < 0.75 ? 0.96 : 0.96 * (1 - (progress - 0.75) / 0.25);
      }
      v += stShift * envelope;
    }
  }

  // T wave
  v += base.tAmp * gaussian(phaseSec, tCenter, tSigma);

  return v;
}

export function getStShiftForLead(lead: LeadName, p: EcgProfile): number {
  if (p.isAnteriorSTEMI) {
    const antLeads: LeadName[] = p.isTakotsubo
      ? ['V2', 'V3', 'V4', 'V5', 'V6', 'DI', 'aVL']
      : p.isExtensiveAnterior
        ? ['V1', 'V2', 'V3', 'V4', 'V5', 'V6']
        : ['V1', 'V2', 'V3', 'V4'];
    if (antLeads.includes(lead)) return lead === 'V2' || lead === 'V3' ? p.stElevationMv : p.stElevationMv * 0.72;
    if (!p.isTakotsubo && (lead === 'DII' || lead === 'DIII' || lead === 'aVF')) return -0.17;
  }
  if (p.isInferiorSTEMI) {
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') return p.stElevationMv * 0.85;
    if (lead === 'DI' || lead === 'aVL') return -0.17;
  }
  if (p.isLateralSTEMI) {
    if (lead === 'DI' || lead === 'aVL' || lead === 'V5' || lead === 'V6') return p.stElevationMv * 0.8;
    if (lead === 'DII' || lead === 'DIII' || lead === 'aVF') return -0.15;
  }
  if (
    p.isStDepression &&
    (lead === 'V3' || lead === 'V4' || lead === 'V5' || lead === 'V6' || lead === 'DI' || lead === 'aVL')
  ) {
    return -p.stDepressionMv;
  }
  if (p.isPericarditis) {
    if (lead !== 'aVR' && lead !== 'V1') return 0.24;
    if (lead === 'aVR') return -0.14;
  }
  if (p.isLVH && (lead === 'V5' || lead === 'V6')) return -0.14;
  return 0;
}

export function computeLeadSamplesMv(
  lead: LeadName,
  profile: EcgProfile,
  durationSec: number,
  dt = 0.007
): Array<{ t: number; mv: number }> {
  const result: Array<{ t: number; mv: number }> = [];
  if (profile.isAsystole || profile.hr <= 0) {
    for (let t = 0; t <= durationSec; t += dt) {
      result.push({ t, mv: 0 });
    }
    return result;
  }

  // For Mobitz I/II (4:3 conduction cycle), atrial P-P cadence = 0.75 * mean ventricular R-R
  const baseRR =
    profile.isMobitz1 || profile.isMobitz2
      ? Math.max(0.55, Math.min(1.08, (60 / profile.hr) * 0.75))
      : 60 / profile.hr;
  const afibFactors = [0.64, 1.08, 0.56, 1.24, 0.72, 0.94, 0.58, 1.15, 0.81, 1.02, 0.66, 1.12];

  // Anchor beatStarts at P-wave onset (`beatAnchor = t_pOnset`), so:
  // 1) In regular sinus/1st-deg AVB, R-R is strictly 60/hr and P-R is exact
  // 2) In Mobitz I/II, atrial P-P is strictly regular and PR shifts QRS naturally
  const beatStarts: number[] = [0.06];
  let idx = 0;
  while (beatStarts[beatStarts.length - 1] < durationSec + 0.6) {
    const rr = profile.isAFib ? baseRR * afibFactors[idx % afibFactors.length] : baseRR;
    beatStarts.push(beatStarts[beatStarts.length - 1] + rr);
    idx += 1;
  }

  const pStarts: number[] = [];
  if (profile.isCompleteAVBlock) {
    const atrialPP = 60 / profile.atrialHr;
    for (let pt = 0.08; pt < durationSec + 0.5; pt += atrialPP) {
      pStarts.push(pt);
    }
  }

  for (let t = 0; t <= durationSec; t += dt) {
    let mv = 0;
    for (let b = 0; b < beatStarts.length; b++) {
      // Shift by pOnset (0.018) so localT = 0.018 corresponds to t = beatStarts[b]
      const localT = t - beatStarts[b] + 0.018;
      if (localT >= 0 && localT <= 1.1) {
        mv += sampleEcgLeadMv(localT, b, lead, profile, profile.isCompleteAVBlock);
      }
    }
    if (profile.isCompleteAVBlock) {
      const pAmp = lead === 'aVR' ? -0.13 : lead === 'DII' ? 0.16 : 0.1;
      for (const pt of pStarts) {
        mv += pAmp * gaussian(t, pt, 0.019);
      }
    }
    result.push({ t, mv });
  }

  return result;
}

export function buildLeadPolylinePoints(
  lead: LeadName,
  profile: EcgProfile,
  durationSec: number,
  x0: number,
  yBaseline: number,
  pxPerSec: number,
  pxPerMv: number
): string {
  const samples = computeLeadSamplesMv(lead, profile, durationSec, 0.007);
  if (profile.isAsystole || profile.hr <= 0) {
    const xEnd = x0 + durationSec * pxPerSec;
    return `${x0.toFixed(1)},${yBaseline.toFixed(1)} ${xEnd.toFixed(1)},${yBaseline.toFixed(1)}`;
  }

  return samples
    .map(({ t, mv }) => {
      const px = x0 + t * pxPerSec;
      const py = yBaseline - mv * pxPerMv;
      return `${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(' ');
}
