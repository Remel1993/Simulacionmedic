import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ComplementaryStudy, VitalSigns } from '../types/clinical';
import {
  ALL_ECG_LEADS,
  LeadName,
  computeLeadSamplesMv,
  parseEcgProfile,
} from '../utils/ecgWaveform';
import { Activity, RefreshCw } from 'lucide-react';

interface EcgMonitorStripProps {
  study: ComplementaryStudy;
  vitalSigns?: VitalSigns;
  isDeceased?: boolean;
  compact?: boolean;
  lead?: LeadName;
  onLeadChange?: (nextLead: LeadName) => void;
}

export const EcgMonitorStrip: React.FC<EcgMonitorStripProps> = ({
  study,
  vitalSigns,
  isDeceased = false,
  compact = false,
  lead: controlledLead,
  onLeadChange,
}) => {
  const uid = useId().replace(/:/g, '');
  const [internalLead, setInternalLead] = useState<LeadName>('DII');
  const activeLead = controlledLead ?? internalLead;

  const setLead = (next: LeadName) => {
    if (onLeadChange) {
      onLeadChange(next);
    } else {
      setInternalLead(next);
    }
  };

  const handleCycleLead = () => {
    const idx = ALL_ECG_LEADS.indexOf(activeLead);
    const nextLead = ALL_ECG_LEADS[(idx + 1) % ALL_ECG_LEADS.length];
    setLead(nextLead);
  };

  const profile = useMemo(() => {
    const effectiveVitals =
      isDeceased && vitalSigns
        ? { ...vitalSigns, heartRate: 0, bloodPressure: '0/0 mmHg' }
        : vitalSigns;
    return parseEcgProfile(study, effectiveVitals);
  }, [study, vitalSigns, isDeceased]);

  const dead = Boolean(isDeceased || profile.isAsystole || profile.hr <= 0);

  // Exact clinical ECG scale: 5 px = 1 mm | 25 px = 5 mm (1 cuadro grande = 0.20 s x 0.5 mV)
  // Speed: 25 mm/s -> 125 px/s | Gain: 10 mm/mV -> 50 px/mV (2 cuadros grandes = 1 mV)
  // Width 800 = 50 px calibration margin (2 cuadros) + 750 px (6.00 s = 30 cuadros grandes)
  const W = 800;
  const H = compact ? 125 : 150;
  const traceStartX = 50;
  const pxPerSec = 125;
  const pxPerMv = 50;
  const yBaseline = compact ? 75 : 100;
  const traceWidthPx = W - traceStartX; // 750 px = 6.00 s exactos (30 cuadros grandes)
  const durationSec = traceWidthPx / pxPerSec;

  const { samples, points } = useMemo(() => {
    const raw = computeLeadSamplesMv(activeLead, profile, durationSec, 0.008);
    const pts = raw.map(({ t, mv }) => ({
      x: traceStartX + t * pxPerSec,
      y: Math.max(6, Math.min(H - 6, yBaseline - (dead ? 0 : mv) * pxPerMv)),
    }));
    return { samples: raw, points: pts };
  }, [activeLead, profile, durationSec, H, yBaseline, pxPerMv, dead]);

  const fullPolylineStr = useMemo(
    () => points.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' '),
    [points]
  );

  // Continuous hospital bedside oscilloscope sweep animation
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [sweepProgress, setSweepProgress] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const sweepStartRef = useRef<number | null>(null);
  useEffect(() => {
    if (prefersReducedMotion || samples.length === 0) {
      setSweepProgress(1);
      return;
    }

    let rafId = 0;
    const cycleMs = durationSec * 1000;
    const tick = (now: number) => {
      if (sweepStartRef.current === null) {
        sweepStartRef.current = now - cycleMs * 0.45;
      }
      const elapsed = (now - sweepStartRef.current) % cycleMs;
      setSweepProgress(elapsed / cycleMs);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [prefersReducedMotion, durationSec, samples.length]);

  const { leadingSegment, trailingSegment, cursorPoint } = useMemo(() => {
    if (prefersReducedMotion || points.length < 2) {
      return {
        leadingSegment: fullPolylineStr,
        trailingSegment: '',
        cursorPoint: null as { x: number; y: number } | null,
      };
    }

    const totalPts = points.length;
    const cursorIdx = Math.min(totalPts - 1, Math.max(0, Math.floor(sweepProgress * totalPts)));
    const gapPts = Math.max(4, Math.round((18 / traceWidthPx) * totalPts));

    const leftPts = points.slice(0, cursorIdx + 1);
    const rightStart = Math.min(totalPts, cursorIdx + gapPts);
    const rightPts = rightStart < totalPts - 1 ? points.slice(rightStart) : [];

    return {
      leadingSegment:
        leftPts.length >= 2
          ? leftPts.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
          : '',
      trailingSegment:
        rightPts.length >= 2
          ? rightPts.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
          : '',
      cursorPoint: points[cursorIdx] || null,
    };
  }, [prefersReducedMotion, points, sweepProgress, traceWidthPx, fullPolylineStr]);

  const minorGridId = `ecg-strip-minor-${uid}`;
  const majorGridId = `ecg-strip-major-${uid}`;
  const glowFilterId = `ecg-neon-glow-${uid}`;

  const leadIndex = ALL_ECG_LEADS.indexOf(activeLead) + 1;

  return (
    <div
      aria-label={`Monitor ECG en vivo · Derivación ${activeLead}`}
      className="rounded-xl overflow-hidden bg-[#020704] border border-emerald-900/80 shadow-[inset_0_1px_0_rgba(57,255,20,0.08)]"
    >
      {/* Oscilloscope Monitor Top Control Bar */}
      <div className="px-3 py-1.5 bg-[#040E08] border-b border-emerald-900/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 min-w-0 font-mono tabular-nums">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39FF14] tracking-wide">
            <Activity className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
            <span>Monitor ECG · {activeLead}</span>
          </span>
          <span className="hidden sm:inline text-emerald-700" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline text-[10px] text-emerald-300/80">
            25 mm/s · 10 mm/mV · 1 cuadro grande = 0.20 s / 0.5 mV
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 font-mono tabular-nums">
          <span
            className={`text-xs font-bold ${
              dead ? 'text-rose-400' : 'text-[#39FF14]'
            }`}
          >
            FC {dead ? 0 : profile.hr} lpm
          </span>

          <button
            type="button"
            onClick={handleCycleLead}
            aria-label={`Cambiar derivación ECG (actual: ${activeLead})`}
            title="Cambiar derivación del monitor ECG (DII, DI, DIII, aVR, aVL, aVF, V1–V6)"
            className="min-h-[30px] px-2.5 py-1 rounded-lg bg-[#071D10] hover:bg-[#0D311C] active:scale-[0.98] border border-[#39FF14]/45 text-[#39FF14] text-[11px] font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39FF14]/70"
          >
            <RefreshCw className="w-3 h-3 shrink-0" />
            <span>Cambiar derivación</span>
            <span className="text-[10px] text-emerald-300/80">
              ({leadIndex}/12)
            </span>
          </button>
        </div>
      </div>

      {/* Black Oscilloscope Screen with Calibrated Green Clinical Grid & Neon Green Trace */}
      <div className="relative bg-[#020603]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block select-none"
          role="img"
          aria-label={`Trazado electrocardiográfico en tiempo real en derivación ${activeLead} a ${dead ? 0 : profile.hr} lpm`}
        >
          <defs>
            {/* 1 mm minor grid (5x5 px = 0.04 s x 0.1 mV) */}
            <pattern id={minorGridId} width="5" height="5" patternUnits="userSpaceOnUse">
              <path
                d="M 5 0 L 0 0 0 5"
                fill="none"
                stroke="rgba(34, 197, 94, 0.22)"
                strokeWidth="0.7"
              />
            </pattern>
            {/* 5 mm major grid / Cuadro grande (25x25 px = 0.20 s x 0.5 mV) */}
            <pattern id={majorGridId} width="25" height="25" patternUnits="userSpaceOnUse">
              <rect width="25" height="25" fill={`url(#${minorGridId})`} />
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="rgba(52, 211, 153, 0.62)"
                strokeWidth="1.25"
              />
            </pattern>
            <filter id={glowFilterId} x="-10%" y="-25%" width="120%" height="150%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Calibrated dark screen + green millimeter grid */}
          <rect width={W} height={H} fill="#020603" />
          <rect width={W} height={H} fill={`url(#${majorGridId})`} />

          {/* 1-second markers every 5 cuadros grandes (125 px = 1.0 s across 6.0 s strip) */}
          {[1, 2, 3, 4, 5].map((sec) => {
            const sx = traceStartX + sec * pxPerSec;
            return (
              <g key={sec}>
                <line
                  x1={sx}
                  y1={0}
                  x2={sx}
                  y2={7}
                  stroke="rgba(57, 255, 20, 0.72)"
                  strokeWidth="1.3"
                />
                <text
                  x={sx + 3}
                  y="11"
                  fill="rgba(110, 231, 183, 0.78)"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {sec}s
                </text>
              </g>
            );
          })}

          {/* 1 mV calibration square pulse (width 25px = 1 cuadro, height 50px = 2 cuadros = 1.0 mV) */}
          <polyline
            points={`8,${yBaseline} 13,${yBaseline} 13,${yBaseline - pxPerMv} 38,${yBaseline - pxPerMv} 38,${yBaseline} 46,${yBaseline}`}
            fill="none"
            stroke="#39FF14"
            strokeWidth="1.75"
            opacity="0.9"
          />
          <text
            x="10"
            y={yBaseline - pxPerMv - 5}
            fill="rgba(57, 255, 20, 0.85)"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="700"
          >
            1mV
          </text>

          {/* Lead watermark tag on grid corner */}
          <text
            x={traceStartX + 4}
            y="16"
            fill="#39FF14"
            fontSize="12"
            fontFamily="monospace"
            fontWeight="700"
            opacity="0.95"
          >
            {activeLead}
          </text>

          {/* Trailing previous sweep segment (faded slightly) */}
          {trailingSegment && (
            <polyline
              points={trailingSegment}
              fill="none"
              stroke="#39FF14"
              strokeOpacity="0.58"
              strokeWidth="1.85"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Active fresh neon-green ECG trace */}
          {leadingSegment && (
            <polyline
              points={leadingSegment}
              fill="none"
              stroke="#39FF14"
              strokeWidth="2.15"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${glowFilterId})`}
            />
          )}

          {/* Bright sweeping phosphor dot */}
          {cursorPoint && !prefersReducedMotion && (
            <circle
              cx={cursorPoint.x}
              cy={cursorPoint.y}
              r="2.9"
              fill="#D9FFD1"
              filter={`url(#${glowFilterId})`}
            />
          )}
        </svg>
      </div>
    </div>
  );
};
