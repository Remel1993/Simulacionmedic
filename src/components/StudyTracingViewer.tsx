import React, { useState, useMemo, useRef, useId } from 'react';
import { ComplementaryStudy, VitalSigns } from '../types/clinical';
import {
  TracingKind,
  LeadName,
  LEAD_GRID,
  EcgProfile,
  detectTracingKind,
  parseEcgProfile,
  buildLeadPolylinePoints,
  stripMedicalNegations,
  gaussian,
  sampleEcgLeadMv,
} from '../utils/ecgWaveform';
import { Activity, Maximize2, Minimize2, Sun, Moon, Ruler } from 'lucide-react';

export { detectTracingKind, parseEcgProfile };

interface StudyTracingViewerProps {
  study: ComplementaryStudy;
  vitalSigns?: VitalSigns;
  dark?: boolean;
}

function norm(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const EcgTwelveLeadViewer: React.FC<{
  study: ComplementaryStudy;
  vitalSigns?: VitalSigns;
  dark?: boolean;
}> = ({ study, vitalSigns, dark = false }) => {
  const uid = useId().replace(/:/g, '');

  // Keep the 12-lead paper tracing strictly static once printed for the current study state
  // (avoids 1-second telemetry micro-oscillation jittering the printed ECG waves).
  const studySnapshotKey = `${study.id}::${study.result}::${study.interpretation || ''}`;
  const frozenSnapshotRef = useRef<{ key: string; vitals?: VitalSigns }>({
    key: studySnapshotKey,
    vitals: vitalSigns,
  });
  if (frozenSnapshotRef.current.key !== studySnapshotKey) {
    frozenSnapshotRef.current = {
      key: studySnapshotKey,
      vitals: vitalSigns,
    };
  }
  const staticVitals = frozenSnapshotRef.current.vitals;

  const profile = useMemo(
    () => parseEcgProfile(study, staticVitals),
    [study, staticVitals]
  );
  const [darkMonitor, setDarkMonitor] = useState(dark);
  const [showBaselineGuides, setShowBaselineGuides] = useState(true);
  const [zoomLead, setZoomLead] = useState<LeadName | null>(null);

  // Exact paper calibration: 4 px = 1 mm | 20 px = 5 mm (1 cuadro grande = 0.20 s x 0.5 mV)
  const W = 1000;
  const H = 560;
  const colWidth = 240; // 12 cuadros grandes = 2.40 s per column
  const startX = 40; // 2 cuadros grandes left margin (aligned to major grid)
  const rowY = [100, 220, 340]; // All baselines sit squarely on major 20px grid lines
  const rhythmY = 480; // Bottom rhythm strip baseline on major 20px grid line
  const pxPerSec = 100; // 25 mm/s -> 100 px/sec (4px = 1mm)
  const pxPerMv = 40; // 10 mm/mV -> 40 px/mV (4px = 1mm)

  const gridBg = darkMonitor ? '#030906' : '#FFFBF6';
  const minorGrid = darkMonitor ? 'rgba(34, 197, 94, 0.20)' : 'rgba(239, 68, 68, 0.24)';
  const majorGrid = darkMonitor ? 'rgba(52, 211, 153, 0.56)' : 'rgba(220, 38, 38, 0.58)';
  const traceStroke = darkMonitor ? '#39FF14' : '#111827';
  const labelFill = darkMonitor ? '#6EE7B7' : '#991B1B';
  const baselineColor = darkMonitor ? 'rgba(56, 189, 248, 0.45)' : 'rgba(37, 99, 235, 0.45)';

  const minorGridId = `ecg-paper-minor-${uid}`;
  const majorGridId = `ecg-paper-major-${uid}`;
  const zoomMinorGridId = `ecg-zoom-minor-${uid}`;
  const zoomMajorGridId = `ecg-zoom-major-${uid}`;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className={`flex flex-wrap items-center gap-3 font-mono tabular-nums ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
          <span className={`font-sans font-bold flex items-center gap-1.5 ${dark ? 'text-[#E8F2ED]' : 'text-[#263A32]'}`}>
            <Activity className={`w-4 h-4 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
            Trazado Electrocardiográfico de 12 Derivaciones
          </span>
          {profile.isAsystole ? (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${dark ? 'text-rose-200 bg-rose-950/70 border-rose-700/70' : 'text-rose-800 bg-rose-50 border-rose-300'}`}>
              25 mm/s · 10 mm/mV · FC 0 lpm (ASISTOLIA)
            </span>
          ) : (
            <span className={`text-[11px] ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
              25 mm/s · 10 mm/mV · FC ~{profile.hr} lpm
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {zoomLead && (
            <button
              type="button"
              onClick={() => setZoomLead(null)}
              className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                dark
                  ? 'bg-[#163026] border-[#3E8569] text-[#D7F0E3] hover:bg-[#1C3D30]'
                  : 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A] hover:bg-[#D5E9DC]'
              }`}
            >
              <Minimize2 className="w-3 h-3" />
              <span>Cerrar Zoom ({zoomLead})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowBaselineGuides((prev) => !prev)}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 cursor-pointer ${
              dark
                ? 'bg-[#172621] border-[#294037] text-[#E8F2ED] hover:border-[#4CA07E]'
                : 'bg-white border-[#E2EAE4] text-[#263A32] hover:border-[#72A98A]'
            }`}
          >
            <Ruler className={`w-3.5 h-3.5 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
            <span>{showBaselineGuides ? 'Ocultar Línea TP' : 'Guía Isoeléctrica TP'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkMonitor((prev) => !prev)}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 cursor-pointer ${
              dark
                ? 'bg-[#172621] border-[#294037] text-[#E8F2ED] hover:border-[#4CA07E]'
                : 'bg-white border-[#E2EAE4] text-[#263A32] hover:border-[#72A98A]'
            }`}
          >
            {darkMonitor ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className={`w-3.5 h-3.5 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />}
            <span>{darkMonitor ? 'Papel Milimetrado' : 'Monitor Oscuro'}</span>
          </button>
        </div>
      </div>

      {/* Zoomed Single Lead Inspector (Exact 5 px = 1 mm, 25 px = 5 mm = 1 cuadro grande) */}
      {zoomLead && (
        <div className={`rounded-xl overflow-hidden border shadow-sm ${dark ? 'border-[#3E8569]' : 'border-[#72A98A]'}`}>
          <div className={`px-3 py-1.5 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] ${dark ? 'bg-[#172621] border-[#243830]' : 'bg-[#F8FBF9] border-[#E2EAE4]'}`}>
            <span className={`font-bold ${dark ? 'text-[#68C79F]' : 'text-[#1F4B3A]'}`}>
              Derivación Ampliada: {zoomLead} (25 mm/s · 10 mm/mV)
            </span>
            <div className={`flex items-center gap-3 font-mono ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
              <span>1 cuadro grande = 0.20 s / 0.5 mV (5 mm)</span>
            </div>
          </div>
          <svg viewBox="0 0 1000 200" className="w-full h-auto block" style={{ background: gridBg }}>
            <defs>
              <pattern id={zoomMinorGridId} width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke={minorGrid} strokeWidth="0.65" />
              </pattern>
              <pattern id={zoomMajorGridId} width="25" height="25" patternUnits="userSpaceOnUse">
                <rect width="25" height="25" fill={`url(#${zoomMinorGridId})`} />
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke={majorGrid} strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="1000" height="200" fill={`url(#${zoomMajorGridId})`} />

            {/* Isoelectric TP baseline & +/-0.5mV calibration references aligned to major grid lines */}
            {showBaselineGuides && (
              <g>
                <line x1="50" y1="125" x2="995" y2="125" stroke={baselineColor} strokeWidth="1.2" strokeDasharray="5,4" />
                <line x1="50" y1="100" x2="995" y2="100" stroke={baselineColor} strokeOpacity="0.45" strokeWidth="0.9" strokeDasharray="2,4" />
                <line x1="50" y1="150" x2="995" y2="150" stroke={baselineColor} strokeOpacity="0.45" strokeWidth="0.9" strokeDasharray="2,4" />
                <text x="990" y="121" fill={labelFill} fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="700">
                  Basal TP (0 mV)
                </text>
                <text x="990" y="96" fill={labelFill} fontSize="9.5" fontFamily="monospace" textAnchor="end" opacity="0.8">
                  +0.5 mV (+5 mm)
                </text>
                <text x="990" y="162" fill={labelFill} fontSize="9.5" fontFamily="monospace" textAnchor="end" opacity="0.8">
                  -0.5 mV (-5 mm)
                </text>
              </g>
            )}

            {/* 1mV calibration pulse (50 px = 1.0 mV = 2 cuadros grandes tall x 25 px = 1 cuadro grande wide) */}
            <polyline points="8,125 13,125 13,75 38,75 38,125 46,125" fill="none" stroke={traceStroke} strokeWidth="1.8" />
            <polyline
              points={buildLeadPolylinePoints(zoomLead, profile, 7.6, 50, 125, 125, 50)}
              fill="none"
              stroke={traceStroke}
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Main 12-Lead Standard Static ECG Paper Sheet */}
      <div className={`rounded-xl overflow-x-auto border shadow-xs ${dark ? 'border-[#294037]' : 'border-[#E2EAE4]'}`}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[680px] h-auto block" style={{ background: gridBg }}>
          <defs>
            <pattern id={minorGridId} width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke={minorGrid} strokeWidth="0.65" />
            </pattern>
            <pattern id={majorGridId} width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill={`url(#${minorGridId})`} />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={majorGrid} strokeWidth="1.15" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill={`url(#${majorGridId})`} />

          {/* Row Calibration Pulses (1 mV = 40 px = 2 cuadros grandes tall, 20 px = 1 cuadro grande wide) */}
          {[...rowY, rhythmY].map((yb, rIdx) => (
            <polyline
              key={`cal-${rIdx}`}
              points={`8,${yb} 12,${yb} 12,${yb - 40} 32,${yb - 40} 32,${yb} 38,${yb}`}
              fill="none"
              stroke={traceStroke}
              strokeWidth="1.5"
            />
          ))}

          {/* 4x3 Lead Grid */}
          {LEAD_GRID.map((rowLeads, rIdx) =>
            rowLeads.map((lead, cIdx) => {
              const x0 = startX + cIdx * colWidth;
              const y0 = rowY[rIdx];
              const polyPts = buildLeadPolylinePoints(lead, profile, 2.28, x0 + 4, y0, pxPerSec, pxPerMv);

              return (
                <g key={lead} onClick={() => setZoomLead(lead)} className="cursor-pointer group">
                  <rect
                    x={x0}
                    y={y0 - 65}
                    width={colWidth - 4}
                    height={118}
                    fill="transparent"
                    className="group-hover:stroke-sky-500/70"
                    strokeWidth="1"
                    rx="4"
                  />
                  {cIdx > 0 && (
                    <line
                      x1={x0}
                      y1={y0 - 24}
                      x2={x0}
                      y2={y0 + 18}
                      stroke={majorGrid}
                      strokeWidth="1.35"
                      strokeDasharray="3,2"
                    />
                  )}
                  {showBaselineGuides && (
                    <line
                      x1={x0 + 4}
                      y1={y0}
                      x2={x0 + colWidth - 8}
                      y2={y0}
                      stroke={baselineColor}
                      strokeWidth="0.9"
                      strokeDasharray="4,3"
                    />
                  )}
                  <text x={x0 + 8} y={y0 - 44} fill={labelFill} fontSize="13" fontWeight="700" fontFamily="monospace">
                    {lead}
                  </text>
                  <polyline
                    points={polyPts}
                    fill="none"
                    stroke={traceStroke}
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })
          )}

          {/* Bottom Rhythm Strip: DII Largo */}
          <g onClick={() => setZoomLead('DII')} className="cursor-pointer">
            {showBaselineGuides && (
              <line
                x1={startX + 4}
                y1={rhythmY}
                x2={W - 16}
                y2={rhythmY}
                stroke={baselineColor}
                strokeWidth="0.95"
                strokeDasharray="4,3"
              />
            )}
            <text x={startX + 8} y={436} fill={labelFill} fontSize="13" fontWeight="700" fontFamily="monospace">
              DII (Tira de Ritmo)
            </text>
            <polyline
              points={buildLeadPolylinePoints('DII', profile, 9.4, startX + 4, rhythmY, pxPerSec, pxPerMv)}
              fill="none"
              stroke={traceStroke}
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <text x={startX} y={544} fill={labelFill} fontSize="11" fontFamily="monospace">
            25 mm/s   10 mm/mV   1 cuadro grande = 0.20 s / 0.5 mV   (Línea azul discontinua = Basal isoeléctrica TP · Clic para ampliar)
          </text>
        </svg>
      </div>
      <div className={`flex items-center justify-end text-[11px] gap-1 ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
        <Maximize2 className={`w-3 h-3 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
        <span>Haga clic sobre cualquier derivación (DI–V6) para ampliarla sobre papel milimetrado</span>
      </div>
    </div>
  );
};

// ---------- HOLTER 24H ECG VIEWER (HR TREND + 3-CHANNEL STRIP) ----------

const HolterEcgViewer: React.FC<{ study: ComplementaryStudy; vitalSigns?: VitalSigns; dark?: boolean }> = ({
  study,
  vitalSigns,
  dark = false,
}) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = stripMedicalNegations(txt);

  const minHrMatch = txt.match(/(?:fc\s+minima|minima)\s*(?:de|:)?\s*(\d{2,3})/);
  const meanHrMatch = txt.match(/(?:media(?:\s+de)?|entre\s+\d+\s+y\s+\d+|fc\s+media)\s*(\d{2,3})/);
  const maxHrMatch = txt.match(/(?:maxima|hasta)\s*(?:de|:)?\s*(\d{2,3})/);
  const rangeMatch = txt.match(/entre\s+(\d{2,3})\s+y\s+(\d{2,3})\s*lpm/);

  const isParoxysmal = /paroxistic|episodios\s+intermitentes|alternando\s+con\s+ritmo\s+sinusal/.test(txtNoNeg);
  const isAFib =
    study.isAbnormal &&
    /fibrilacion\s+auricular|taquiarritmia\s+supraventricular|ondas?\s+f/.test(txtNoNeg);
  const isEctopy = study.isAbnormal && /ectopia\s+ventricular|extrasistoles\s+ventriculares/.test(txtNoNeg);
  const isPause = study.isAbnormal && /pausa|bloqueo\s+av/.test(txtNoNeg);

  const minHr = minHrMatch ? Number(minHrMatch[1]) : isAFib ? 62 : 54;
  const maxHr = maxHrMatch
    ? Number(maxHrMatch[1])
    : rangeMatch
      ? Number(rangeMatch[2])
      : isAFib
        ? 148
        : 118;
  const meanHr = rangeMatch
    ? Math.round((Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2)
    : meanHrMatch
      ? Number(meanHrMatch[1])
      : isAFib
        ? 106
        : vitalSigns?.heartRate || 74;

  const profile: EcgProfile = {
    hr: vitalSigns?.heartRate === 0 ? 0 : isAFib ? Math.max(96, meanHr) : meanHr,
    atrialHr: 80,
    prMs: 160,
    qrsMs: 85,
    qtcMs: 410,
    isAsystole: vitalSigns?.heartRate === 0,
    isAFib: isAFib && !isParoxysmal ? true : false,
    isParoxysmalMix: false,
    isSVT: false,
    isVT: false,
    isCompleteAVBlock: false,
    isFirstDegAVBlock: false,
    isMobitz1: /mobitz\s*(?:i|1)\b|wenckebach/.test(txtNoNeg),
    isMobitz2: /mobitz\s*(?:ii|2)\b/.test(txtNoNeg),
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

  // Build custom paroxysmal/ectopic/sinus 3-channel event strip
  const buildHolterStrip = (lead: LeadName, yBase: number) => {
    const durationSec = 8.4;
    const x0 = 24;
    const pxPerSec = 100;
    const pxPerMv = 34;

    if (!isParoxysmal && !isEctopy && !isPause) {
      return buildLeadPolylinePoints(lead, profile, durationSec, x0, yBase, pxPerSec, pxPerMv);
    }

    const baseRR = 60 / Math.max(60, meanHr);
    const afibRR = 60 / Math.max(108, maxHr - 15);
    const afibFactors = [0.64, 1.08, 0.56, 1.24, 0.72, 0.94, 0.58, 1.15];
    const beats: Array<{ t: number; afib: boolean; pvc: boolean }> = [];

    let curT = 0.14;
    let idx = 0;
    while (curT < durationSec + 0.5) {
      const inParoxysm = isParoxysmal && curT >= 2.3 && curT <= 6.2;
      const pvcHere = isEctopy && (idx === 3 || idx === 7);
      beats.push({ t: curT, afib: inParoxysm, pvc: pvcHere });

      if (isPause && idx === 3) {
        curT += 2.25; // explicit 2.25s pause
      } else if (inParoxysm) {
        curT += afibRR * afibFactors[idx % afibFactors.length];
      } else if (pvcHere) {
        curT += baseRR * 1.38; // compensatory pause after PVC
      } else if (isEctopy && (idx === 2 || idx === 6)) {
        curT += baseRR * 0.58; // premature coupling interval
      } else {
        curT += baseRR;
      }
      idx += 1;
    }

    const pts: string[] = [];
    for (let t = 0; t <= durationSec; t += 0.008) {
      let mv = 0;
      for (let b = 0; b < beats.length; b++) {
        const beat = beats[b];
        const localT = t - beat.t + 0.18;
        if (localT >= 0 && localT <= 0.56) {
          if (beat.pvc) {
            // Wide bizarre PVC morphology + discordant T wave
            mv += 1.05 * gaussian(localT, 0.18, 0.028) - 0.55 * gaussian(localT, 0.24, 0.025) - 0.36 * gaussian(localT, 0.36, 0.055);
          } else {
            mv += sampleEcgLeadMv(localT, b, lead, { ...profile, isAFib: beat.afib }, false);
          }
        }
      }
      pts.push(`${(x0 + t * pxPerSec).toFixed(1)},${(yBase - mv * pxPerMv).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  // 24h Hourly HR trend values matching min/mean/max
  const hourlyHr = Array.from({ length: 25 }, (_, h) => {
    const clockHour = (8 + h) % 24;
    const isNight = clockHour >= 22 || clockHour < 7;
    if (isParoxysmal && (h === 4 || h === 15 || h === 20)) {
      return maxHr;
    }
    if (isNight) {
      return Math.round(minHr + ((h % 3) * (meanHr - minHr)) * 0.25);
    }
    const dayWave = Math.sin(((h % 12) / 12) * Math.PI);
    return Math.round(meanHr + dayWave * (maxHr - meanHr) * (isParoxysmal ? 0.35 : 0.65));
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-[#E8F2ED]' : 'text-[#263A32]'}`}>
          <Activity className={`w-4 h-4 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
          Monitoreo Holter ECG 24 Horas (Tira de Evento + Tendencia FC)
        </span>
        <div className={`flex flex-wrap items-center gap-3 text-[11px] font-mono tabular-nums font-semibold ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
          <span>FC Mín: {minHr} lpm</span>
          <span>Media: {meanHr} lpm</span>
          <span>Máx: {maxHr} lpm</span>
        </div>
      </div>

      {/* 24h Heart Rate Trend Graph */}
      <div className="bg-white border border-[#E2EAE4] rounded-xl p-3">
        <div className="text-[10px] font-bold text-[#43866B] uppercase tracking-wider mb-1">
          Perfil Circadiano de Frecuencia Cardíaca (24 Horas)
        </div>
        <svg viewBox="0 0 900 105" className="w-full h-auto block">
          {/* Night Sleep Shading (hours index 14..22 => 22:00..06:00) */}
          <rect x={44 + (14 / 24) * 830} y="8" width={(8 / 24) * 830} height="76" fill="rgba(67, 134, 107, 0.1)" />
          {/* 60-100 bpm reference zone */}
          {[60, 100, 140].map((hrRef) => {
            const y = 84 - ((hrRef - 30) / 150) * 76;
            return (
              <g key={hrRef}>
                <line x1="44" y1={y} x2="874" y2={y} stroke="#E2EAE4" strokeDasharray="3,3" strokeWidth="1" />
                <text x="38" y={y + 3} fill="#55685F" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {hrRef}
                </text>
              </g>
            );
          })}
          <polyline
            points={hourlyHr
              .map((val, i) => {
                const x = 44 + (i / 24) * 830;
                const y = Math.max(10, Math.min(82, 84 - ((val - 30) / 150) * 76));
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(' ')}
            fill="none"
            stroke="#43866B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {[0, 4, 8, 12, 16, 20, 24].map((h) => {
            const x = 44 + (h / 24) * 830;
            const lbl = `${String((8 + h) % 24).padStart(2, '0')}:00`;
            return (
              <text key={h} x={x} y="98" fill="#55685F" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>

      {/* 3-Channel Event Strip */}
      <div className="rounded-xl overflow-x-auto border border-[#E2EAE4]">
        <svg viewBox="0 0 900 280" className="w-full min-w-[600px] h-auto block" style={{ background: '#FFFDF8' }}>
          <defs>
            <pattern id="holter-minor" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(235, 136, 136, 0.25)" strokeWidth="0.5" />
            </pattern>
            <pattern id="holter-major" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="url(#holter-minor)" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(220, 88, 88, 0.5)" strokeWidth="0.9" />
            </pattern>
          </defs>
          <rect width="900" height="280" fill="url(#holter-major)" />
          {([
            { label: 'Ch1 · CM5', lead: 'V5' as LeadName, y: 65 },
            { label: 'Ch2 · CM1', lead: 'V1' as LeadName, y: 145 },
            { label: 'Ch3 · aVF', lead: 'aVF' as LeadName, y: 225 },
          ]).map((ch) => (
            <g key={ch.label}>
              <line x1="24" y1={ch.y} x2="870" y2={ch.y} stroke="rgba(37, 99, 235, 0.35)" strokeWidth="0.8" strokeDasharray="4,3" />
              <text x="14" y={ch.y - 28} fill="#991B1B" fontSize="11" fontWeight="700" fontFamily="monospace">
                {ch.label}
              </text>
              <polyline
                points={buildHolterStrip(ch.lead, ch.y)}
                fill="none"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ---------- HOLTER DE PRESIÓN ARTERIAL / MAPA 24H VIEWER ----------

const HolterBpViewer: React.FC<{ study: ComplementaryStudy; vitalSigns?: VitalSigns; dark?: boolean }> = ({
  study,
  vitalSigns,
  dark = false,
}) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);

  const bpFallback = vitalSigns?.bloodPressure?.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  const fallbackSys = bpFallback ? Number(bpFallback[1]) : 120;
  const fallbackDia = bpFallback ? Number(bpFallback[2]) : 76;

  const meanMatch = txt.match(/promedio(?:\s+global)?\s+24\s*h(?:oras)?:\s*(\d{2,3})\s*\/\s*(\d{2,3})/);
  const dayMatch = txt.match(/(?:periodo\s+)?diurno[^:]*:\s*(\d{2,3})\s*\/\s*(\d{2,3})/);
  const nightMatch = txt.match(/(?:periodo\s+)?nocturno[^:]*:\s*(\d{2,3})\s*\/\s*(\d{2,3})/);
  const dipMatch = txt.match(/descenso\s+nocturno[^:]*:\s*(\d+(?:\.\d+)?)\s*%/);

  const daySys = dayMatch ? Number(dayMatch[1]) : fallbackSys;
  const dayDia = dayMatch ? Number(dayMatch[2]) : fallbackDia;
  const nightSys = nightMatch
    ? Number(nightMatch[1])
    : Math.round(daySys * (study.isAbnormal ? 0.92 : 0.87));
  const nightDia = nightMatch
    ? Number(nightMatch[2])
    : Math.round(dayDia * (study.isAbnormal ? 0.92 : 0.86));
  const mean24Sys = meanMatch ? Number(meanMatch[1]) : Math.round(daySys * 0.65 + nightSys * 0.35);
  const mean24Dia = meanMatch ? Number(meanMatch[2]) : Math.round(dayDia * 0.65 + nightDia * 0.35);
  const dipPct = dipMatch ? dipMatch[1] : (((daySys - nightSys) / Math.max(1, daySys)) * 100).toFixed(1);

  // Build realistic 24-hour curve starting at 08:00 through 08:00 next day
  // Hours 0..13 (08:00..21:00) = Day; Hours 14..22 (22:00..06:00) = Night; Hours 23..24 = Morning surge
  const hourlyReadings = useMemo(() => {
    const dayMod = [-2, 3, 5, 2, -3, 1, 4, 2, -1, 3, 1, -2, -3, -4];
    const nightMod = [-1, -2, 0, -2, -1, 1, 0, 2, 4];
    const rows: Array<{ hourIdx: number; label: string; sys: number; dia: number; isNight: boolean }> = [];

    for (let h = 0; h <= 24; h++) {
      const clock = (8 + h) % 24;
      const isNight = h >= 14 && h <= 22;
      const offset = isNight ? nightMod[h - 14] : h >= 23 ? 3 : dayMod[h % dayMod.length];
      const sys = Math.max(58, Math.min(220, (isNight ? nightSys : daySys) + offset));
      const dia = Math.max(36, Math.min(140, (isNight ? nightDia : dayDia) + Math.round(offset * 0.65)));
      rows.push({
        hourIdx: h,
        label: `${String(clock).padStart(2, '0')}:00`,
        sys,
        dia,
        isNight,
      });
    }
    return rows;
  }, [daySys, dayDia, nightSys, nightDia]);

  const toX = (h: number) => 56 + (h / 24) * 814;
  const toY = (mmhg: number) => 245 - ((mmhg - 40) / 180) * 210; // Range 40..220 mmHg

  const sysPoints = hourlyReadings.map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.sys).toFixed(1)}`).join(' ');
  const diaPoints = hourlyReadings.map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.dia).toFixed(1)}`).join(' ');
  const bandPolygon = [
    ...hourlyReadings.map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.sys).toFixed(1)}`),
    ...[...hourlyReadings].reverse().map((r) => `${toX(r.hourIdx).toFixed(1)},${toY(r.dia).toFixed(1)}`),
  ].join(' ');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-[#E8F2ED]' : 'text-[#263A32]'}`}>
          <Activity className={`w-4 h-4 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
          Monitoreo Ambulatorio de Presión Arterial (MAPA / Holter de PA 24 Horas)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
          <span className={`flex items-center gap-1 ${dark ? 'text-rose-300' : 'text-rose-700'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Sistólica (PAS)
          </span>
          <span className={`flex items-center gap-1 ${dark ? 'text-sky-300' : 'text-sky-700'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Diastólica (PAD)
          </span>
          <span className={`flex items-center gap-1 ${dark ? 'text-amber-300' : 'text-amber-800'}`}>
            <span className="w-3 h-0.5 border-t border-dashed border-amber-600 inline-block" /> Límite 135/85
          </span>
        </div>
      </div>

      {/* Objective Numeric Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-2">
          <div className="text-[10px] text-[#55685F] font-semibold uppercase">Promedio 24 h</div>
          <div className="font-mono tabular-nums font-bold text-[#263A32] text-sm">{mean24Sys}/{mean24Dia} mmHg</div>
        </div>
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-2">
          <div className="text-[10px] text-[#55685F] font-semibold uppercase">Diurno (07–22 h)</div>
          <div className="font-mono tabular-nums font-bold text-[#263A32] text-sm">{daySys}/{dayDia} mmHg</div>
        </div>
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-2">
          <div className="text-[10px] text-[#55685F] font-semibold uppercase">Nocturno (22–07 h)</div>
          <div className="font-mono tabular-nums font-bold text-[#263A32] text-sm">{nightSys}/{nightDia} mmHg</div>
        </div>
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-2">
          <div className="text-[10px] text-[#55685F] font-semibold uppercase">Descenso Nocturno</div>
          <div className="font-mono tabular-nums font-bold text-[#263A32] text-sm">{dipPct}%</div>
        </div>
      </div>

      {/* 24-Hour MAPA Chart */}
      <div className="bg-white border border-[#E2EAE4] rounded-xl p-2.5 overflow-x-auto">
        <svg viewBox="0 0 900 280" className="w-full min-w-[600px] h-auto block">
          {/* Nighttime Sleep Window (22:00 to 07:00 => index 14 to 23) */}
          <rect
            x={toX(14)}
            y="35"
            width={toX(23) - toX(14)}
            height="210"
            fill="rgba(67, 134, 107, 0.1)"
          />
          <text x={(toX(14) + toX(23)) / 2} y="50" fill="#1F4B3A" fontSize="10" fontWeight="700" textAnchor="middle">
            Periodo Nocturno / Sueño (22:00–07:00)
          </text>
          <text x={(toX(0) + toX(14)) / 2} y="50" fill="#55685F" fontSize="10" textAnchor="middle">
            Periodo Diurno / Vigilia
          </text>

          {/* Horizontal mmHg grid lines */}
          {[60, 80, 100, 120, 140, 160, 180, 200].map((mmhg) => {
            const y = toY(mmhg);
            return (
              <g key={mmhg}>
                <line x1="56" y1={y} x2="870" y2={y} stroke="#E2EAE4" strokeWidth="0.9" />
                <text x="48" y={y + 3} fill="#55685F" fontSize="10" textAnchor="end" fontFamily="monospace">
                  {mmhg}
                </text>
              </g>
            );
          })}

          {/* Reference Thresholds */}
          <line x1={toX(0)} y1={toY(135)} x2={toX(14)} y2={toY(135)} stroke="#D97706" strokeWidth="1.2" strokeDasharray="5,4" opacity="0.85" />
          <line x1={toX(0)} y1={toY(85)} x2={toX(14)} y2={toY(85)} stroke="#D97706" strokeWidth="1.1" strokeDasharray="4,4" opacity="0.7" />
          <line x1={toX(14)} y1={toY(120)} x2={toX(23)} y2={toY(120)} stroke="#43866B" strokeWidth="1.2" strokeDasharray="5,4" opacity="0.85" />
          <line x1={toX(14)} y1={toY(70)} x2={toX(23)} y2={toY(70)} stroke="#43866B" strokeWidth="1.1" strokeDasharray="4,4" opacity="0.7" />

          {/* Pulse Pressure Shaded Envelope */}
          <polygon points={bandPolygon} fill="rgba(14, 165, 233, 0.1)" />

          {/* Systolic & Diastolic Curves */}
          <polyline points={sysPoints} fill="none" stroke="#E11D48" strokeWidth="2.3" strokeLinejoin="round" />
          <polyline points={diaPoints} fill="none" stroke="#0284C7" strokeWidth="2.3" strokeLinejoin="round" />

          {hourlyReadings.map((r) => (
            <g key={r.hourIdx}>
              <circle cx={toX(r.hourIdx)} cy={toY(r.sys)} r="3.2" fill="#FFFFFF" stroke="#E11D48" strokeWidth="1.8" />
              <circle cx={toX(r.hourIdx)} cy={toY(r.dia)} r="3.2" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.8" />
              {r.hourIdx % 4 === 0 && (
                <text x={toX(r.hourIdx)} y="264" fill="#55685F" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {r.label}
                </text>
              )}
            </g>
          ))}

          <text x="15" y="140" fill="#55685F" fontSize="10" transform="rotate(-90 15,140)" textAnchor="middle">
            Presión Arterial (mmHg)
          </text>
        </svg>
      </div>
    </div>
  );
};

// ---------- SPIROMETRY FLOW-VOLUME & VOLUME-TIME VIEWER ----------

const SpirometryViewer: React.FC<{ study: ComplementaryStudy; dark?: boolean }> = ({ study, dark = false }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);

  // Parse exact reported values when available so curves match text 100%
  const fev1PctMatch = txt.match(/(?:fev1|vef1)\s*(?:en|:)?\s*(\d{2,3})%/);
  const fvcPctMatch = txt.match(/(?:fvc|cvf)\s*(?:en|:)?\s*(\d{2,3})%/);
  const ratioMatch = txt.match(/(?:fev1\/fvc|vef1\/cvf)\s*(?:reducida)?\s*[:(]?\s*(0\.\d{2})/);
  const bdChangeMatch = txt.match(/\+\s*(\d{1,2})%/);

  const hasNegBd = /(?:no completamente reversible|respuesta broncodilatadora negativa|sin respuesta significativa|<\s*12%)/.test(txt);
  const hasPosBd =
    !hasNegBd &&
    (/(?:respuesta broncodilatadora(?:\s+significativa)?\s+positiva|incremento del vef1|cambio en fev1 de \+1[2-9]|cambio en fev1 de \+[2-9]\d)/.test(
      txt
    ) ||
      (bdChangeMatch ? Number(bdChangeMatch[1]) >= 12 : false));

  const isRestrictive =
    study.isAbnormal &&
    /restrictiv/.test(txt) &&
    !/obstructiv/.test(txt);

  const isCopd =
    study.isAbnormal &&
    !isRestrictive &&
    !hasPosBd &&
    (/(?:\bepoc\b|\bgold\b|no completamente reversible|respuesta broncodilatadora negativa|limitacion cronica)/.test(txt) ||
      (ratioMatch ? Number(ratioMatch[1]) < 0.7 && hasNegBd : false));

  const isAsthma =
    study.isAbnormal &&
    !isCopd &&
    !isRestrictive &&
    (hasPosBd || /\basma\b|obstructiv/.test(txt));

  const fev1Pct = fev1PctMatch ? Number(fev1PctMatch[1]) : isCopd ? 58 : isAsthma ? 72 : isRestrictive ? 64 : 94;
  const fvcPct = fvcPctMatch ? Number(fvcPctMatch[1]) : isRestrictive ? 62 : isCopd ? 84 : 96;
  const ratioVal = ratioMatch ? ratioMatch[1] : isCopd ? '0.55' : isAsthma ? '0.67' : isRestrictive ? '0.84' : '0.81';

  const fvSvg = (vol: number, flow: number) => {
    const x = 60 + (vol / 5.2) * 350;
    const y = 175 - flow * 14.5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const predictedFV = [
    [0, 0], [0.22, 8.8], [0.65, 9.1], [1.4, 7.2], [2.4, 5.1], [3.5, 3.0], [4.5, 1.0], [4.9, 0],
    [4.4, -3.5], [3.2, -5.6], [1.8, -5.8], [0.6, -4.1], [0, 0],
  ]
    .map(([v, f]) => fvSvg(v, f))
    .join(' ');

  const basalFV = (isCopd
    ? [
        [0, 0], [0.22, 4.1], [0.5, 3.8], [1.0, 2.0], [1.8, 1.05], [2.6, 0.55], [3.3, 0.25], [3.75, 0],
        [3.3, -2.1], [2.2, -3.4], [1.1, -3.2], [0.3, -1.9], [0, 0],
      ]
    : isAsthma
      ? [
          [0, 0], [0.25, 5.4], [0.6, 5.1], [1.2, 3.1], [2.1, 1.75], [3.1, 0.95], [4.0, 0.4], [4.4, 0],
          [3.9, -2.7], [2.6, -4.1], [1.3, -4.0], [0.4, -2.3], [0, 0],
        ]
      : isRestrictive
        ? [
            [0, 0], [0.18, 6.9], [0.45, 7.1], [1.0, 5.6], [1.7, 3.8], [2.4, 2.0], [2.95, 0.8], [3.15, 0],
            [2.8, -2.6], [2.0, -4.1], [1.0, -4.0], [0.35, -2.5], [0, 0],
          ]
        : [
            [0, 0], [0.22, 8.4], [0.65, 8.7], [1.38, 6.9], [2.35, 4.8], [3.4, 2.8], [4.35, 0.95], [4.75, 0],
            [4.2, -3.3], [3.0, -5.3], [1.7, -5.5], [0.55, -3.9], [0, 0],
          ]
  )
    .map(([v, f]) => fvSvg(v, f))
    .join(' ');

  const postBdFV = isAsthma
    ? [
        [0, 0], [0.22, 7.8], [0.65, 8.0], [1.35, 6.2], [2.3, 4.3], [3.35, 2.5], [4.25, 0.85], [4.7, 0],
        [4.1, -3.2], [2.9, -5.0], [1.6, -5.1], [0.5, -3.5], [0, 0],
      ]
        .map(([v, f]) => fvSvg(v, f))
        .join(' ')
    : isCopd
      ? [
          [0, 0], [0.22, 4.35], [0.52, 4.0], [1.05, 2.15], [1.85, 1.15], [2.65, 0.62], [3.4, 0.28], [3.85, 0],
          [3.4, -2.2], [2.25, -3.5], [1.15, -3.3], [0.32, -2.0], [0, 0],
        ]
          .map(([v, f]) => fvSvg(v, f))
          .join(' ')
      : null;

  const vtSvg = (t: number, vol: number) => {
    const x = 60 + (t / 6) * 350;
    const y = 235 - (vol / 5.2) * 195;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const predVT = [
    [0, 0], [0.3, 1.8], [0.6, 3.0], [1.0, 3.9], [1.8, 4.55], [3.0, 4.82], [4.5, 4.9], [6.0, 4.9],
  ]
    .map(([t, v]) => vtSvg(t, v))
    .join(' ');

  const basalVT = (isCopd
    ? [[0, 0], [0.4, 1.05], [1.0, 2.05], [2.0, 2.85], [3.2, 3.35], [4.5, 3.62], [6.0, 3.72]]
    : isAsthma
      ? [[0, 0], [0.4, 1.45], [1.0, 2.85], [2.0, 3.75], [3.2, 4.15], [4.5, 4.32], [6.0, 4.4]]
      : isRestrictive
        ? [[0, 0], [0.3, 1.35], [0.6, 2.15], [1.0, 2.65], [1.8, 2.95], [3.0, 3.1], [4.5, 3.15], [6.0, 3.15]]
        : [[0, 0], [0.3, 1.72], [0.6, 2.88], [1.0, 3.75], [1.8, 4.4], [3.0, 4.68], [4.5, 4.74], [6.0, 4.75]]
  )
    .map(([t, v]) => vtSvg(t, v))
    .join(' ');

  const postVT = isAsthma
    ? [[0, 0], [0.3, 1.68], [0.6, 2.75], [1.0, 3.55], [1.8, 4.22], [3.0, 4.55], [4.5, 4.66], [6.0, 4.68]]
        .map(([t, v]) => vtSvg(t, v))
        .join(' ')
    : isCopd
      ? [[0, 0], [0.4, 1.1], [1.0, 2.15], [2.0, 2.95], [3.2, 3.45], [4.5, 3.72], [6.0, 3.82]]
          .map(([t, v]) => vtSvg(t, v))
          .join(' ')
      : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-[#E8F2ED]' : 'text-[#263A32]'}`}>
          <Activity className={`w-4 h-4 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
          Gráficas Espirométricas (Curva Flujo-Volumen y Volumen-Tiempo)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
          <span className={`flex items-center gap-1 ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
            <span className="w-3 h-0.5 border-t-2 border-dashed border-[#718078] inline-block" /> Predicho
          </span>
          <span className={`flex items-center gap-1 ${dark ? 'text-amber-300' : 'text-amber-800'}`}>
            <span className="w-3 h-0.5 bg-amber-600 inline-block" /> Basal (Pre-BD)
          </span>
          {postBdFV && (
            <span className={`flex items-center gap-1 ${dark ? 'text-[#68C79F]' : 'text-[#1F4B3A]'}`}>
              <span className="w-3 h-0.5 bg-[#43866B] inline-block" /> Post-BD
            </span>
          )}
        </div>
      </div>

      {/* Synchronized objective values bar */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums">
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-1.5">
          <span className="text-[10px] text-[#55685F] block font-sans font-semibold">FVC Basal</span>
          <span className="font-bold text-[#263A32]">{fvcPct}% pred.</span>
        </div>
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-1.5">
          <span className="text-[10px] text-[#55685F] block font-sans font-semibold">FEV₁ Basal</span>
          <span className="font-bold text-[#263A32]">{fev1Pct}% pred.</span>
        </div>
        <div className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-1.5">
          <span className="text-[10px] text-[#55685F] block font-sans font-semibold">Relación FEV₁/FVC</span>
          <span className="font-bold text-[#263A32]">{ratioVal}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white border border-[#E2EAE4] rounded-xl p-3">
          <div className="text-[11px] font-bold text-[#263A32] mb-1.5">Curva Flujo-Volumen (L/s vs L)</div>
          <svg viewBox="0 0 440 280" className="w-full h-auto block">
            <line x1="60" y1="25" x2="60" y2="265" stroke="#CBD8CE" strokeWidth="1.2" />
            <line x1="55" y1="175" x2="420" y2="175" stroke="#9BB0A1" strokeWidth="1.2" />
            {[0, 1, 2, 3, 4, 5].map((v) => {
              const x = 60 + (v / 5.2) * 350;
              return (
                <g key={v}>
                  <line x1={x} y1="25" x2={x} y2="265" stroke="#E2EAE4" strokeWidth="0.8" />
                  <text x={x} y="190" fill="#55685F" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    {v}
                  </text>
                </g>
              );
            })}
            {[-4, 0, 4, 8].map((f) => {
              const y = 175 - f * 14.5;
              return (
                <g key={f}>
                  <line x1="60" y1={y} x2="420" y2={y} stroke="#E2EAE4" strokeWidth="0.8" />
                  <text x="50" y={y + 3} fill="#55685F" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {f}
                  </text>
                </g>
              );
            })}
            <text x="240" y="274" fill="#55685F" fontSize="10" textAnchor="middle">
              Volumen (Litros)
            </text>
            <text x="16" y="120" fill="#55685F" fontSize="10" transform="rotate(-90 16,120)" textAnchor="middle">
              Flujo (L/s)
            </text>

            <polyline points={predictedFV} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5,4" />
            <polyline points={basalFV} fill="none" stroke="#D97706" strokeWidth="2.4" strokeLinejoin="round" />
            {postBdFV && <polyline points={postBdFV} fill="none" stroke="#43866B" strokeWidth="2.2" strokeLinejoin="round" />}
          </svg>
        </div>

        <div className="bg-white border border-[#E2EAE4] rounded-xl p-3">
          <div className="text-[11px] font-bold text-[#263A32] mb-1.5">Espirograma Volumen-Tiempo (FEV₁ / FVC)</div>
          <svg viewBox="0 0 440 280" className="w-full h-auto block">
            <line x1="60" y1="25" x2="60" y2="235" stroke="#CBD8CE" strokeWidth="1.2" />
            <line x1="60" y1="235" x2="420" y2="235" stroke="#9BB0A1" strokeWidth="1.2" />
            {[0, 1, 2, 3, 4, 5, 6].map((t) => {
              const x = 60 + (t / 6) * 350;
              return (
                <g key={t}>
                  <line
                    x1={x}
                    y1="25"
                    x2={x}
                    y2="235"
                    stroke={t === 1 ? '#0284C7' : '#E2EAE4'}
                    strokeWidth={t === 1 ? '1.1' : '0.8'}
                    strokeDasharray={t === 1 ? '3,3' : undefined}
                  />
                  <text x={x} y="252" fill={t === 1 ? '#0284C7' : '#55685F'} fontSize="10" textAnchor="middle" fontFamily="monospace">
                    {t}s
                  </text>
                </g>
              );
            })}
            {[1, 2, 3, 4, 5].map((vol) => {
              const y = 235 - (vol / 5.2) * 195;
              return (
                <g key={vol}>
                  <line x1="60" y1={y} x2="420" y2={y} stroke="#E2EAE4" strokeWidth="0.8" />
                  <text x="50" y={y + 3} fill="#55685F" fontSize="10" textAnchor="end" fontFamily="monospace">
                    {vol}L
                  </text>
                </g>
              );
            })}
            <text x="125" y="38" fill="#0284C7" fontSize="10" fontFamily="monospace" fontWeight="700">
              FEV₁ (1s)
            </text>
            <text x="240" y="272" fill="#55685F" fontSize="10" textAnchor="middle">
              Tiempo (segundos)
            </text>

            <polyline points={predVT} fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeDasharray="5,4" />
            <polyline points={basalVT} fill="none" stroke="#D97706" strokeWidth="2.4" strokeLinejoin="round" />
            {postVT && <polyline points={postVT} fill="none" stroke="#43866B" strokeWidth="2.2" strokeLinejoin="round" />}
          </svg>
        </div>
      </div>
    </div>
  );
};

// ---------- ELECTROENCEPHALOGRAM (EEG) VIEWER ----------

const EegViewer: React.FC<{ study: ComplementaryStudy; dark?: boolean }> = ({ study, dark = false }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = stripMedicalNegations(txt);

  const isEpileptiform =
    study.isAbnormal && /punta-onda|puntas|ondas agudas|epileptiforme|f8-t4|f7-t3|descargas/.test(txtNoNeg);
  const isFastBeta = study.isAbnormal && !isEpileptiform && /actividad beta difusa|bajo voltaje.*abstinencia/.test(txtNoNeg);
  const isSlowing = study.isAbnormal && !isEpileptiform && !isFastBeta && /theta|delta|enlentecid|4-7 hz|4-6 hz/.test(txtNoNeg);

  const isLeftFocus = /izquierd|f7-t3|hemisferica izquierda|frontotemporal izquierda/.test(txtNoNeg);
  const isRightFocus = /derech|f8-t4/.test(txtNoNeg);
  const isBilateral = /difuso|generalizad|bilateral/.test(txtNoNeg) && !isLeftFocus && !isRightFocus;

  const channels = [
    { name: 'Fp1 - F7', region: 'ant', side: 'L', y: 45 },
    { name: 'F7 - T3', region: 'temp', side: 'L', y: 92 },
    { name: 'T3 - T5', region: 'post', side: 'L', y: 139 },
    { name: 'T5 - O1', region: 'occ', side: 'L', y: 186 },
    { name: 'Fp2 - F8', region: 'ant', side: 'R', y: 245 },
    { name: 'F8 - T4', region: 'temp', side: 'R', y: 292 },
    { name: 'T4 - T6', region: 'post', side: 'R', y: 339 },
    { name: 'T6 - O2', region: 'occ', side: 'R', y: 386 },
  ];

  const buildEegPath = (ch: (typeof channels)[number], idx: number): string => {
    const pts: string[] = [];
    const startX = 95;
    const width = 790;
    const duration = 6.0;
    const steps = 360;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      let uV = 0;

      const applyFocalSlowing =
        isSlowing && (isBilateral || (!isLeftFocus && !isRightFocus) || (isLeftFocus && ch.side === 'L') || (isRightFocus && ch.side === 'R'));

      if (isFastBeta) {
        // Low-voltage fast beta (22 Hz) + scattered theta (Delirium tremens pattern)
        uV =
          7 * Math.sin(2 * Math.PI * 22.0 * t + idx * 0.9) +
          8 * Math.sin(2 * Math.PI * 5.2 * t + idx * 1.4);
      } else if (applyFocalSlowing) {
        uV =
          22 * Math.sin(2 * Math.PI * 3.8 * t + idx * 0.7) +
          11 * Math.sin(2 * Math.PI * 5.4 * t + idx * 1.3);
      } else {
        const alphaAmp = ch.region === 'occ' ? 16 : ch.region === 'post' ? 10 : 4;
        const betaAmp = ch.region === 'ant' ? 6 : 3;
        const modulation = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.6 * t + idx);
        uV =
          alphaAmp * modulation * Math.sin(2 * Math.PI * 10.2 * t + idx * 0.4) +
          betaAmp * Math.sin(2 * Math.PI * 18.5 * t + idx * 1.1);

        if (isEpileptiform) {
          const targetRight = (isRightFocus || (!isLeftFocus && !isBilateral)) && ch.side === 'R' && (ch.name === 'F8 - T4' || ch.name === 'Fp2 - F8' || ch.name === 'T4 - T6');
          const targetLeft = isLeftFocus && ch.side === 'L' && (ch.name === 'F7 - T3' || ch.name === 'Fp1 - F7' || ch.name === 'T3 - T5');
          const targetGen = isBilateral;

          if (targetRight || targetLeft || targetGen) {
            const sign = ch.name.startsWith('Fp') ? -1 : 1;
            const ampFactor = ch.name === 'F8 - T4' || ch.name === 'F7 - T3' || targetGen ? 1.0 : 0.65;
            for (const burstCenter of [1.4, 3.25, 4.9]) {
              const dt = t - burstCenter;
              if (Math.abs(dt) < 0.25) {
                const spike = 44 * Math.exp(-Math.pow((dt + 0.03) / 0.016, 2));
                const slowWave = -24 * Math.exp(-Math.pow((dt - 0.08) / 0.06, 2));
                uV += sign * ampFactor * (spike + slowWave);
              }
            }
          }
        }
      }

      const x = startX + (i / steps) * width;
      const y = ch.y - uV * 0.52;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-[#E8F2ED]' : 'text-[#263A32]'}`}>
          <Activity className={`w-4 h-4 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
          Trazado Electroencefalográfico (Montaje Longitudinal Bipolar · 10–20)
        </span>
        <span className={`text-[11px] font-mono ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>30 mm/s · 70 µV/cm · 6 segundos</span>
      </div>
      <div className="rounded-xl overflow-x-auto border border-[#E2EAE4]">
        <svg viewBox="0 0 900 430" className="w-full min-w-[600px] h-auto block" style={{ background: '#F8FAFC' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((sec) => {
            const x = 95 + (sec / 6) * 790;
            return (
              <g key={sec}>
                <line x1={x} y1="18" x2={x} y2="408" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />
                <text x={x} y="422" fill="#475569" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {sec}s
                </text>
              </g>
            );
          })}
          <line x1="12" y1="215" x2="885" y2="215" stroke="#94A3B8" strokeWidth="0.9" strokeDasharray="5,4" />

          {channels.map((ch, idx) => (
            <g key={ch.name}>
              <text
                x="14"
                y={ch.y + 4}
                fill={ch.side === 'L' ? '#1E3A8A' : '#991B1B'}
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
              >
                {ch.name}
              </text>
              <polyline points={buildEegPath(ch, idx)} fill="none" stroke="#0F172A" strokeWidth="1.3" strokeLinejoin="round" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ---------- AUDIOMETRY VIEWER ----------

const AudiometryViewer: React.FC<{ study: ComplementaryStudy; dark?: boolean }> = ({ study, dark = false }) => {
  const txt = norm(`${study.result} ${study.interpretation || ''}`);
  const txtNoNeg = stripMedicalNegations(txt);
  const isAbnormal = study.isAbnormal;

  const isSensorineural = /neurosensorial|coclear|agudos/.test(txtNoNeg);
  const isConductive = !isSensorineural && /conductiv|brecha aereo-osea|timpanometria.*tipo b/.test(txtNoNeg);

  const affectsRight = /derech|bilateral/.test(txtNoNeg) || (!/izquierd/.test(txtNoNeg) && isAbnormal);
  const affectsLeft = /izquierd|bilateral/.test(txtNoNeg);

  const freqs = [250, 500, 1000, 2000, 4000, 8000];
  const normalAir = [15, 10, 15, 15, 20, 15];
  const conductiveAir = [30, 35, 35, 30, 30, 30];
  const sensorineuralAir = [15, 20, 30, 45, 65, 75];

  const rightDb = isAbnormal && affectsRight ? (isSensorineural ? sensorineuralAir : conductiveAir) : normalAir;
  const leftDb = isAbnormal && affectsLeft ? (isSensorineural ? sensorineuralAir : conductiveAir) : [15, 15, 10, 15, 15, 20];
  const boneRightDb = isAbnormal && affectsRight && isConductive ? [10, 10, 15, 10, 15, 15] : null;
  const boneLeftDb = isAbnormal && affectsLeft && isConductive ? [10, 15, 10, 10, 15, 15] : null;

  const toX = (i: number) => 65 + (i / (freqs.length - 1)) * 345;
  const toY = (db: number) => 30 + ((db + 10) / 110) * 195;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-[#E8F2ED]' : 'text-[#263A32]'}`}>
          <Activity className={`w-4 h-4 ${dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`} />
          Audiograma Tonal Liminar (Oído Derecho ○ · Oído Izquierdo ×)
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className={`font-semibold ${dark ? 'text-rose-300' : 'text-rose-700'}`}>○ Vía Aérea OD</span>
          <span className={`font-semibold ${dark ? 'text-sky-300' : 'text-sky-700'}`}>× Vía Aérea OI</span>
          {(boneRightDb || boneLeftDb) && (
            <span className={`font-semibold ${dark ? 'text-amber-300' : 'text-amber-700'}`}>[ / ] Vía Ósea</span>
          )}
          <span className={`font-medium ${dark ? 'text-[#68C79F]' : 'text-[#1F4B3A]'}`}>Normal ≤ 25 dB</span>
        </div>
      </div>
      <div className="bg-white border border-[#E2EAE4] rounded-xl p-3">
        <svg viewBox="0 0 440 250" className="w-full max-w-lg h-auto block mx-auto">
          <rect x="65" y={toY(-10)} width="345" height={toY(25) - toY(-10)} fill="rgba(67, 134, 107, 0.1)" />
          {freqs.map((f, i) => (
            <g key={f}>
              <line x1={toX(i)} y1="30" x2={toX(i)} y2="225" stroke="#E2EAE4" strokeWidth="0.9" />
              <text x={toX(i)} y="242" fill="#55685F" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {f}
              </text>
            </g>
          ))}
          {[0, 20, 40, 60, 80, 100].map((db) => (
            <g key={db}>
              <line x1="65" y1={toY(db)} x2="410" y2={toY(db)} stroke="#E2EAE4" strokeWidth="0.9" />
              <text x="54" y={toY(db) + 3} fill="#55685F" fontSize="10" textAnchor="end" fontFamily="monospace">
                {db}
              </text>
            </g>
          ))}
          <text x="16" y="130" fill="#55685F" fontSize="9.5" transform="rotate(-90 16,130)" textAnchor="middle">
            Umbral (dB HL)
          </text>

          <polyline points={rightDb.map((d, i) => `${toX(i)},${toY(d)}`).join(' ')} fill="none" stroke="#E11D48" strokeWidth="2" />
          <polyline points={leftDb.map((d, i) => `${toX(i)},${toY(d)}`).join(' ')} fill="none" stroke="#0284C7" strokeWidth="2" />

          {boneRightDb && boneRightDb.map((d, i) => (
            <text key={`br-${i}`} x={toX(i) - 5} y={toY(d) + 4} fill="#D97706" fontSize="11" fontWeight="700" textAnchor="middle">
              &lt;
            </text>
          ))}
          {boneLeftDb && boneLeftDb.map((d, i) => (
            <text key={`bl-${i}`} x={toX(i) + 5} y={toY(d) + 4} fill="#D97706" fontSize="11" fontWeight="700" textAnchor="middle">
              &gt;
            </text>
          ))}

          {rightDb.map((d, i) => (
            <circle key={`r-${i}`} cx={toX(i)} cy={toY(d)} r="4" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2" />
          ))}
          {leftDb.map((d, i) => (
            <text key={`l-${i}`} x={toX(i)} y={toY(d) + 4} fill="#0284C7" fontSize="12" fontWeight="700" textAnchor="middle">
              ×
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const StudyTracingViewer: React.FC<StudyTracingViewerProps> = ({ study, vitalSigns, dark = false }) => {
  const kind = detectTracingKind(study);
  if (!kind) return null;

  return (
    <div
      className={`rounded-xl p-3 sm:p-4 border ${
        dark ? 'bg-[#121E1A] border-[#294037] text-[#E8F2ED]' : 'bg-[#F8FBF9] border-[#E2EAE4]'
      }`}
    >
      {kind === 'ecg_12' && <EcgTwelveLeadViewer study={study} vitalSigns={vitalSigns} dark={dark} />}
      {kind === 'holter_ecg' && <HolterEcgViewer study={study} vitalSigns={vitalSigns} dark={dark} />}
      {kind === 'holter_bp' && <HolterBpViewer study={study} vitalSigns={vitalSigns} dark={dark} />}
      {kind === 'spirometry' && <SpirometryViewer study={study} dark={dark} />}
      {kind === 'eeg' && <EegViewer study={study} dark={dark} />}
      {kind === 'audiometry' && <AudiometryViewer study={study} dark={dark} />}
    </div>
  );
};
