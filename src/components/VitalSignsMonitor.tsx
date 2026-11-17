import React, { useState } from 'react';
import { ClinicalEvolutionState, VitalSigns } from '../types/clinical';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  Droplet,
  Brain,
  Zap,
  AlertTriangle,
  Skull,
  RefreshCw,
} from 'lucide-react';

interface VitalSignsMonitorProps {
  vitals: VitalSigns;
  baselineVitals?: VitalSigns;
  statCount?: number;
  triageLevel: string;
  onOpenStat?: () => void;
  onRefreshVitals?: () => void;
  showStatButton?: boolean;
  evolutionState?: ClinicalEvolutionState;
  isDeceased?: boolean;
}

export const VitalSignsMonitor: React.FC<VitalSignsMonitorProps> = ({
  vitals,
  baselineVitals,
  statCount = 0,
  onOpenStat,
  onRefreshVitals,
  showStatButton = false,
  evolutionState,
  isDeceased = false,
}) => {
  const deceased = Boolean(
    isDeceased || vitals.heartRate === 0 || (vitals.bloodPressure || '').startsWith('0/')
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    if (!onRefreshVitals || deceased) return;
    setIsRefreshing(true);
    onRefreshVitals();
    window.setTimeout(() => setIsRefreshing(false), 380);
  };

  const bpMatch = vitals.bloodPressure.match(/(\d+)\/(\d+)/);
  const baseBpMatch = baselineVitals?.bloodPressure.match(/(\d+)\/(\d+)/);
  let mapText = '--';
  if (bpMatch) {
    const sys = parseInt(bpMatch[1], 10);
    const dia = parseInt(bpMatch[2], 10);
    const map = Math.round(dia + (sys - dia) / 3);
    mapText = `${map}`;
  }

  const sysDiff =
    bpMatch && baseBpMatch ? parseInt(bpMatch[1], 10) - parseInt(baseBpMatch[1], 10) : 0;
  const hrDiff = baselineVitals ? vitals.heartRate - baselineVitals.heartRate : 0;
  const rrDiff = baselineVitals ? vitals.respiratoryRate - baselineVitals.respiratoryRate : 0;
  const tempDiff = baselineVitals
    ? Number((vitals.temperature - baselineVitals.temperature).toFixed(1))
    : 0;
  const spo2Diff = baselineVitals ? vitals.oxygenSaturation - baselineVitals.oxygenSaturation : 0;
  const hasGlucose = typeof vitals.bloodGlucose === 'number' && !Number.isNaN(vitals.bloodGlucose);
  const glucDiff =
    hasGlucose && typeof baselineVitals?.bloodGlucose === 'number'
      ? (vitals.bloodGlucose as number) - baselineVitals.bloodGlucose
      : 0;
  const gcsDiff = baselineVitals ? vitals.glasgow - baselineVitals.glasgow : 0;

  const isTachycardic = vitals.heartRate > 100;
  const isBradycardic = vitals.heartRate < 50;
  const isHypotensive = bpMatch && parseInt(bpMatch[1], 10) < 90;
  const isFebrile = vitals.temperature >= 38.0;
  const isHypoxemic = vitals.oxygenSaturation < 94;
  const isTachypneic = vitals.respiratoryRate > 20;
  const isBradypneic = vitals.respiratoryRate <= 10;
  const isLowGlasgow = vitals.glasgow <= 12;

  const isHypoglycemic = hasGlucose && (vitals.bloodGlucose as number) < 70;
  const isSevereHyperglycemic = hasGlucose && (vitals.bloodGlucose as number) >= 250;
  const isModerateHyperglycemic =
    hasGlucose && (vitals.bloodGlucose as number) >= 180 && (vitals.bloodGlucose as number) < 250;

  return (
    <section
      aria-label="Monitor de Signos Vitales"
      className="rounded-2xl border border-[#E2EAE4] bg-white shadow-[0_2px_10px_rgba(38,58,50,0.05)] overflow-hidden"
    >
      {/* Slim Mint Header Strip */}
      <div className="bg-[#E4F1E8] px-3.5 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#CFE4D6]">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-4 h-4 text-[#2F7A63] shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-[#1F4B3A] whitespace-nowrap">
            Signos Vitales
          </span>
          <span className="hidden sm:inline text-[#72A98A]" aria-hidden="true">·</span>
          <span
            className={`hidden sm:inline text-xs font-semibold truncate ${
              deceased ? 'text-rose-700 font-bold' : 'text-[#43866B]'
            }`}
          >
            {deceased
              ? 'ASISTOLIA · FALLECIDO'
              : statCount > 0
                ? `${statCount} STAT aplicado${statCount > 1 ? 's' : ''}`
                : 'Monitor Clínico'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onRefreshVitals && !deceased && (
            <button
              type="button"
              onClick={handleRefreshClick}
              title="Actualizar / reevaluar signos vitales ahora"
              aria-label="Actualizar signos vitales"
              className="min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#F3F7F4] border border-[#CFE4D6] text-[11px] sm:text-xs font-semibold text-[#263A32] transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#43866B] shrink-0 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
              <span>Actualizar</span>
            </button>
          )}

          {showStatButton && onOpenStat && (
            <button
              type="button"
              onClick={deceased ? undefined : onOpenStat}
              disabled={deceased}
              className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs transition-colors ${
                deceased
                  ? 'bg-rose-50 border border-rose-300 text-rose-700 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
              }`}
              title={
                deceased
                  ? 'Paciente en asistolia tras muerte inmediata por iatrogenia'
                  : 'Aplicar tratamiento STAT de emergencia y conversar con el paciente'
              }
            >
              {deceased ? (
                <Skull className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Zap className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{deceased ? 'Asistolia' : 'STAT'}</span>
              {!deceased && statCount > 0 && (
                <span className="text-[10px] font-mono tabular-nums bg-black/20 px-1.5 py-0.5 rounded-md">
                  {statCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Ultra-Compact Practical Telemetry Grid:
          Mobile/Tablet: Row 1 = 3 cards (TA/PAM, FC, FR), Row 2 = 4 cards (T°, SpO2, Gluc, GCS)
          Desktop lg+: Single aligned 7-column horizontal bar */}
      <div className="p-2.5 sm:px-5 sm:py-2.5 bg-[#F7FBF8]">
        <div className="grid grid-cols-12 lg:grid-cols-7 gap-1.5 sm:gap-2 tabular-nums">
          {/* 1. Presión Arterial + PAM */}
          <div
            className={`col-span-4 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isHypotensive ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Activity className={`w-3 h-3 shrink-0 ${isHypotensive ? 'text-rose-600' : 'text-[#2F7A63]'}`} />
              <span>TA · PAM {mapText}</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isHypotensive ? 'text-rose-600' : 'text-[#263A32]'
              }`}
            >
              {vitals.bloodPressure.split(' ')[0]}
              {sysDiff !== 0 && (
                <span className="ml-1 text-[10px] font-bold text-[#0369A1]">
                  ({sysDiff > 0 ? '+' : ''}{sysDiff})
                </span>
              )}
            </div>
          </div>

          {/* 2. Frecuencia Cardíaca */}
          <div
            className={`col-span-4 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isBradycardic
                ? 'bg-rose-50/80 border-rose-200'
                : isTachycardic
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Heart
                className={`w-3 h-3 shrink-0 ${
                  isBradycardic ? 'text-rose-600' : isTachycardic ? 'text-amber-600' : 'text-[#2F7A63]'
                }`}
              />
              <span>FC</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isBradycardic ? 'text-rose-600' : isTachycardic ? 'text-[#2F7A63]' : 'text-[#263A32]'
              }`}
            >
              {vitals.heartRate}
              <span className="text-[10px] font-medium text-[#718078] ml-0.5">lpm</span>
              {hrDiff !== 0 && (
                <span className="ml-1 text-[10px] font-bold text-[#0369A1]">
                  ({hrDiff > 0 ? '+' : ''}{hrDiff})
                </span>
              )}
            </div>
          </div>

          {/* 3. Frecuencia Respiratoria */}
          <div
            className={`col-span-4 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isBradypneic
                ? 'bg-rose-50/80 border-rose-200'
                : isTachypneic
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Wind className="w-3 h-3 text-[#2F7A63] shrink-0" />
              <span>FR</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isBradypneic ? 'text-rose-600' : isTachypneic ? 'text-amber-700' : 'text-[#263A32]'
              }`}
            >
              {vitals.respiratoryRate}
              <span className="text-[10px] font-medium text-[#718078] ml-0.5">rpm</span>
              {rrDiff !== 0 && (
                <span className="ml-1 text-[10px] font-bold text-[#0369A1]">
                  ({rrDiff > 0 ? '+' : ''}{rrDiff})
                </span>
              )}
            </div>
          </div>

          {/* 4. Temperatura */}
          <div
            className={`col-span-3 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isFebrile ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Thermometer className={`w-3 h-3 shrink-0 ${isFebrile ? 'text-rose-600' : 'text-[#43866B]'}`} />
              <span>T°</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isFebrile ? 'text-rose-600' : 'text-[#263A32]'
              }`}
            >
              {vitals.temperature.toFixed(1)}°
              {Math.abs(tempDiff) >= 0.05 && (
                <span className="ml-0.5 text-[10px] font-bold text-[#0369A1]">
                  ({tempDiff > 0 ? '+' : ''}{tempDiff.toFixed(1)})
                </span>
              )}
            </div>
          </div>

          {/* 5. SpO2 */}
          <div
            className={`col-span-3 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isHypoxemic ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Droplets className={`w-3 h-3 shrink-0 ${isHypoxemic ? 'text-rose-600' : 'text-[#0369A1]'}`} />
              <span>SpO₂</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isHypoxemic ? 'text-rose-600' : 'text-[#263A32]'
              }`}
            >
              {vitals.oxygenSaturation}%
              {spo2Diff !== 0 && (
                <span className={`ml-0.5 text-[10px] font-bold ${spo2Diff > 0 ? 'text-[#1B5E3F]' : 'text-rose-600'}`}>
                  ({spo2Diff > 0 ? '+' : ''}{spo2Diff})
                </span>
              )}
            </div>
          </div>

          {/* 6. Glucemia */}
          <div
            title="Glucemia capilar (Glucometría)"
            className={`col-span-3 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isHypoglycemic || isSevereHyperglycemic
                ? 'bg-rose-50/80 border-rose-200'
                : isModerateHyperglycemic
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Droplet className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Gluc</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isHypoglycemic || isSevereHyperglycemic ? 'text-rose-600' : 'text-[#263A32]'
              }`}
            >
              {hasGlucose ? vitals.bloodGlucose : '--'}
              <span className="text-[9px] font-medium text-[#718078] ml-0.5">mg</span>
              {glucDiff !== 0 && (
                <span className="ml-0.5 text-[10px] font-bold text-[#0369A1]">
                  ({glucDiff > 0 ? '+' : ''}{glucDiff})
                </span>
              )}
            </div>
          </div>

          {/* 7. Glasgow */}
          <div
            className={`col-span-3 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isLowGlasgow ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Brain className={`w-3 h-3 shrink-0 ${isLowGlasgow ? 'text-rose-600' : 'text-[#43866B]'}`} />
              <span>GCS</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isLowGlasgow ? 'text-rose-600' : vitals.glasgow < 15 ? 'text-amber-700' : 'text-[#263A32]'
              }`}
            >
              {vitals.glasgow}/15
              {gcsDiff !== 0 && (
                <span className={`ml-0.5 text-[10px] font-bold ${gcsDiff > 0 ? 'text-[#1B5E3F]' : 'text-rose-600'}`}>
                  ({gcsDiff > 0 ? '+' : ''}{gcsDiff})
                </span>
              )}
            </div>
          </div>
        </div>

        {evolutionState && (evolutionState.activeAlerts.length > 0 || evolutionState.trajectory !== 'estable') && (
          <div
            className={`mt-2 px-3 py-1.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
              evolutionState.trajectory === 'critico' || evolutionState.trajectory === 'deterioro'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : evolutionState.trajectory === 'mejorando'
                  ? 'bg-[#E4F1E8] border-[#72A98A]/60 text-[#1F4B3A]'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertTriangle
                className={`w-3.5 h-3.5 shrink-0 ${
                  evolutionState.trajectory === 'critico' || evolutionState.trajectory === 'deterioro'
                    ? 'text-rose-600'
                    : evolutionState.trajectory === 'mejorando'
                      ? 'text-[#43866B]'
                      : 'text-amber-600'
                }`}
              />
              <span className="font-semibold">
                {evolutionState.activeAlerts[0] || evolutionState.summaryNote}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
              Evolución: {evolutionState.trajectory}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
