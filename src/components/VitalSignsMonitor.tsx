import React, { useState } from 'react';
import { ClinicalEvolutionState, ComplementaryStudy, VitalSigns } from '../types/clinical';
import {
  computeDerivedBedsideIndices,
  evaluateVitalsWithAgeContext,
} from '../utils/clinicalContext';
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
  triageLevel?: string;
  patientAge?: number;
  isPregnant?: boolean;
  unlockedStudies?: ComplementaryStudy[];
  onOpenStat?: () => void;
  onRefreshVitals?: () => void;
  showStatButton?: boolean;
  evolutionState?: ClinicalEvolutionState;
  isDeceased?: boolean;
}

export const VitalSignsMonitor: React.FC<VitalSignsMonitorProps> = ({
  vitals,
  baselineVitals: _baselineVitals,
  statCount = 0,
  triageLevel: _triageLevel,
  patientAge = 30,
  isPregnant = false,
  unlockedStudies = [],
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

  const indices = computeDerivedBedsideIndices(vitals, patientAge, unlockedStudies);
  const mapText = indices.map !== null ? `${indices.map}` : '--';
  const hasGlucose = typeof vitals.bloodGlucose === 'number' && !Number.isNaN(vitals.bloodGlucose);

  const {
    bounds,
    isTachycardic,
    isBradycardic,
    isHypotensive,
    isHypertensive,
    isFebrile,
    isHypoxemic,
    isTachypneic,
    isBradypneic,
    isLowGlasgow,
    isHypoglycemic,
    isSevereHyperglycemic,
    isModerateHyperglycemic,
  } = evaluateVitalsWithAgeContext(vitals, patientAge, isPregnant);

  const isCriticalMonitor =
    deceased ||
    evolutionState?.trajectory === 'critico';

  return (
    <section
      aria-label="Monitor de Signos Vitales"
      className={`rounded-2xl border bg-white shadow-[0_2px_10px_rgba(38,58,50,0.05)] overflow-hidden ${
        isCriticalMonitor ? 'border-rose-300' : 'border-[#E2EAE4]'
      }`}
    >
      {/* Slim Header Strip */}
      <div
        className={`px-3.5 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 border-b ${
          isCriticalMonitor
            ? 'bg-rose-50 border-rose-200'
            : 'bg-[#E4F1E8] border-[#CFE4D6]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Activity
            className={`w-4 h-4 shrink-0 ${isCriticalMonitor ? 'text-rose-600' : 'text-[#2F7A63]'}`}
          />
          <span
            className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
              isCriticalMonitor ? 'text-rose-950' : 'text-[#1F4B3A]'
            }`}
          >
            Signos Vitales
          </span>
          {!deceased && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap border ${
                isCriticalMonitor
                  ? 'bg-rose-100/90 border-rose-300 text-rose-800'
                  : 'bg-white/80 border-[#B8D7C4] text-[#1F4B3A]'
              }`}
              title="Monitoreo fisiológico continuo en tiempo real"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isCriticalMonitor ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
              />
              <span>En vivo</span>
            </span>
          )}
          <span
            className={`hidden sm:inline ${isCriticalMonitor ? 'text-rose-300' : 'text-[#72A98A]'}`}
            aria-hidden="true"
          >
            ·
          </span>
          <span
            className={`hidden sm:inline text-xs font-semibold truncate ${
              deceased
                ? 'text-rose-700 font-bold'
                : isCriticalMonitor
                  ? 'text-rose-800'
                  : 'text-[#43866B]'
            }`}
          >
            {deceased
              ? 'ASISTOLIA · FALLECIDO'
              : statCount > 0
                ? `${statCount} STAT aplicado${statCount > 1 ? 's' : ''}`
                : bounds.summaryText}
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

      {/* Telemetry Grid */}
      <div className="p-2.5 sm:px-5 sm:py-2.5 bg-[#F7FBF8] space-y-2">
        <div className="grid grid-cols-12 lg:grid-cols-7 gap-1.5 sm:gap-2 tabular-nums">
          {/* 1. Presión Arterial + PAM */}
          <div
            className={`col-span-4 lg:col-span-1 rounded-xl border px-2 py-1.5 flex flex-col justify-center text-center transition-colors ${
              isHypotensive
                ? 'bg-rose-50/80 border-rose-200'
                : isHypertensive
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-white border-[#E2EAE4]'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#55685F] leading-none">
              <Activity
                className={`w-3 h-3 shrink-0 ${
                  isHypotensive ? 'text-rose-600' : isHypertensive ? 'text-amber-600' : 'text-[#2F7A63]'
                }`}
              />
              <span>TA · PAM {mapText}</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isHypotensive ? 'text-rose-600' : isHypertensive ? 'text-amber-800' : 'text-[#263A32]'
              }`}
            >
              {vitals.bloodPressure.split(' ')[0]}
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
                className={`w-3 h-3 shrink-0 ${!deceased ? 'animate-pulse ' : ''}${
                  isBradycardic ? 'text-rose-600' : isTachycardic ? 'text-amber-600' : 'text-[#2F7A63]'
                }`}
              />
              <span>FC</span>
            </div>
            <div
              className={`text-xs sm:text-sm font-extrabold font-mono mt-1 whitespace-nowrap leading-none ${
                isBradycardic ? 'text-rose-600' : isTachycardic ? 'text-amber-800' : 'text-[#263A32]'
              }`}
            >
              {vitals.heartRate}
              <span className="text-[10px] font-medium text-[#718078] ml-0.5">lpm</span>
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
                isBradypneic ? 'text-rose-600' : isTachypneic ? 'text-amber-800' : 'text-[#263A32]'
              }`}
            >
              {vitals.respiratoryRate}
              <span className="text-[10px] font-medium text-[#718078] ml-0.5">rpm</span>
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
            </div>
          </div>
        </div>

        {/* Somatometry & Derived Bedside Indices Strip */}
        {(typeof vitals.weightKg === 'number' ||
          typeof vitals.heightCm === 'number' ||
          indices.qsofaScore !== null ||
          indices.bmi !== null ||
          indices.pao2Fio2 !== null) &&
          !deceased && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-[#E2EAE4] text-[11px] text-[#55685F] tabular-nums">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-[#263A32]">Somatometría e índices:</span>
              {typeof vitals.weightKg === 'number' && (
                <span>
                  Peso: <strong className="text-[#263A32]">{vitals.weightKg} kg</strong>
                </span>
              )}
              {typeof vitals.heightCm === 'number' && (
                <span>
                  Talla: <strong className="text-[#263A32]">{vitals.heightCm} cm</strong>{' '}
                  <span className="text-[#718078]">({(vitals.heightCm / 100).toFixed(2)} m)</span>
                </span>
              )}
              {indices.bmi !== null && (
                <span>
                  IMC: <strong className="text-[#263A32]">{indices.bmi} kg/m²</strong>
                  {indices.bmiLabel ? ` (${indices.bmiLabel})` : ''}
                </span>
              )}
              {indices.qsofaScore !== null && (
                <span>
                  qSOFA:{' '}
                  <strong
                    className={
                      indices.qsofaScore >= 2
                        ? 'text-rose-700'
                        : indices.qsofaScore === 1
                          ? 'text-amber-700'
                          : 'text-[#1F4B3A]'
                    }
                  >
                    {indices.qsofaScore}/3
                  </strong>
                </span>
              )}
              {indices.pao2Fio2 !== null && (
                <span>
                  PaO₂/FiO₂ (Kirby):{' '}
                  <strong
                    className={
                      indices.pao2Fio2 < 200
                        ? 'text-rose-700'
                        : indices.pao2Fio2 < 300
                          ? 'text-amber-700'
                          : 'text-[#1F4B3A]'
                    }
                  >
                    {indices.pao2Fio2} mmHg
                  </strong>
                </span>
              )}
            </div>
            <span className="sm:hidden text-[10px] text-[#718078]">{bounds.summaryText}</span>
          </div>
        )}

        {evolutionState && (evolutionState.activeAlerts.length > 0 || evolutionState.trajectory !== 'estable') && (
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
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
