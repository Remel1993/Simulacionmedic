import React, { useRef, useEffect } from 'react';
import { DramaticOutcome } from '../utils/caseEvaluation';
import {
  HeartHandshake,
  HeartPulse,
  AlertTriangle,
  UserX,
  Skull,
  ShieldAlert,
  ArrowRight,
  Activity,
  Quote,
} from 'lucide-react';

interface ClinicalOutcomeModalProps {
  outcome: DramaticOutcome | null;
  patientName: string;
  onContinueToAudit: () => void;
}

export const ClinicalOutcomeModal: React.FC<ClinicalOutcomeModalProps> = ({
  outcome,
  patientName,
  onContinueToAudit,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outcome && overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }
  }, [outcome]);

  if (!outcome) return null;

  const themeMap = {
    saved: {
      border: 'border-[#72A98A]',
      bg: 'bg-white',
      headerBg: 'bg-[#E4F1E8]/70 border-[#72A98A]/40',
      headerText: 'text-[#1F4B3A]',
      headerIcon: 'text-[#43866B]',
      badge: 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]',
      iconWrap: 'bg-[#E4F1E8] border-[#72A98A] text-[#43866B]',
      narrativeCard: 'bg-[#F8FBF9] border-[#E2EAE4]',
      monitorColor: 'text-[#1F4B3A] border-[#72A98A]/50 bg-[#E4F1E8]/70',
      cta: 'bg-[#43866B] hover:bg-[#356D56] text-white',
      icon: <HeartHandshake className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#34d399',
      ecgPath: 'M 0 24 L 35 24 L 42 20 L 48 24 L 54 6 L 60 40 L 66 24 L 74 19 L 82 24 L 135 24 L 142 20 L 148 24 L 154 6 L 160 40 L 166 24 L 174 19 L 182 24 L 240 24',
    },
    stabilized_morbidity: {
      border: 'border-amber-300',
      bg: 'bg-white',
      headerBg: 'bg-amber-50 border-amber-200',
      headerText: 'text-amber-900',
      headerIcon: 'text-amber-700',
      badge: 'bg-amber-100 border-amber-300 text-amber-900',
      iconWrap: 'bg-amber-50 border-amber-300 text-amber-700',
      narrativeCard: 'bg-[#F8FBF9] border-[#E2EAE4]',
      monitorColor: 'text-amber-900 border-amber-300 bg-amber-50',
      cta: 'bg-[#43866B] hover:bg-[#356D56] text-white',
      icon: <HeartPulse className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#fbbf24',
      ecgPath: 'M 0 24 L 25 24 L 30 14 L 35 34 L 40 24 L 68 24 L 74 10 L 79 38 L 85 24 L 130 24 L 135 16 L 140 32 L 146 24 L 195 24 L 200 11 L 206 36 L 212 24 L 240 24',
    },
    upset_complaint: {
      border: 'border-orange-300',
      bg: 'bg-white',
      headerBg: 'bg-orange-50 border-orange-200',
      headerText: 'text-orange-900',
      headerIcon: 'text-orange-700',
      badge: 'bg-orange-100 border-orange-300 text-orange-900',
      iconWrap: 'bg-orange-50 border-orange-300 text-orange-700',
      narrativeCard: 'bg-[#F8FBF9] border-[#E2EAE4]',
      monitorColor: 'text-orange-900 border-orange-300 bg-orange-50',
      cta: 'bg-[#43866B] hover:bg-[#356D56] text-white',
      icon: <UserX className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#fb923c',
      ecgPath: 'M 0 24 L 40 24 L 45 16 L 50 32 L 55 24 L 110 24 L 115 16 L 120 32 L 125 24 L 180 24 L 185 16 L 190 32 L 195 24 L 240 24',
    },
    critical_morbidity: {
      border: 'border-rose-400',
      bg: 'bg-white',
      headerBg: 'bg-rose-50 border-rose-200',
      headerText: 'text-rose-900',
      headerIcon: 'text-rose-600',
      badge: 'bg-rose-100 border-rose-400 text-rose-900',
      iconWrap: 'bg-rose-50 border-rose-300 text-rose-700',
      narrativeCard: 'bg-[#F8FBF9] border-rose-200',
      monitorColor: 'text-rose-900 border-rose-300 bg-rose-50',
      cta: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#fb7185',
      ecgPath: 'M 0 24 L 15 12 L 22 38 L 28 8 L 35 42 L 42 18 L 52 24 L 78 24 L 84 6 L 90 42 L 96 14 L 105 24 L 145 24 L 150 9 L 157 40 L 165 24 L 210 14 L 218 36 L 225 24 L 240 24',
    },
    deceased: {
      border: 'border-rose-400',
      bg: 'bg-white',
      headerBg: 'bg-rose-50 border-rose-200',
      headerText: 'text-rose-950',
      headerIcon: 'text-rose-700',
      badge: 'bg-rose-100 border-rose-400 text-rose-950',
      iconWrap: 'bg-rose-50 border-rose-300 text-rose-700',
      narrativeCard: 'bg-[#F8FBF9] border-rose-200',
      monitorColor: 'text-rose-900 border-rose-300 bg-rose-50',
      cta: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: <Skull className="w-10 h-10 sm:w-12 sm:h-12" />,
      ecgStroke: '#f43f5e',
      ecgPath: 'M 0 24 L 35 24 L 40 20 L 45 26 L 52 24 L 240 24',
    },
  };

  const t = themeMap[outcome.status];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-[#263A32]/50 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto"
    >
      <div
        className={`w-full max-w-[96vw] sm:max-w-3xl lg:max-w-4xl rounded-2xl border-2 ${t.border} ${t.bg} shadow-2xl overflow-hidden my-auto`}
      >
        {/* Top Hospital Telemetry Strip */}
        <div className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-2 ${t.headerBg}`}>
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 shrink-0 ${t.headerIcon}`} />
            <span className={`text-[11px] font-mono font-bold uppercase tracking-widest ${t.headerText}`}>
              Desenlace Clínico · {patientName}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${t.badge}`}>
            {outcome.badgeLabel}
          </span>
        </div>

        {/* Main Clinical Scene */}
        <div className="p-5 sm:p-8 space-y-5 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 ${t.iconWrap} flex items-center justify-center shrink-0 shadow-sm`}
            >
              {t.icon}
            </div>

            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg
                  viewBox="0 0 240 48"
                  className="w-44 h-8 bg-[#182420] rounded-lg border border-[#E2EAE4] px-1"
                  aria-hidden="true"
                >
                  <path
                    d={t.ecgPath}
                    fill="none"
                    stroke={t.ecgStroke}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#263A32] tracking-tight leading-snug">
                {outcome.headline}
              </h2>
            </div>
          </div>

          {/* Narrative Card */}
          <div className={`border rounded-xl p-4 sm:p-5 space-y-3 text-left ${t.narrativeCard}`}>
            <p className="text-xs sm:text-sm text-[#263A32] leading-relaxed">
              {outcome.sceneNarrative}
            </p>

            {outcome.patientQuote && (
              <div className="flex items-start gap-2.5 bg-white border border-[#E2EAE4] rounded-xl p-3 text-xs italic text-[#263A32]">
                <Quote className="w-4 h-4 text-[#43866B] shrink-0 mt-0.5" />
                <span>{outcome.patientQuote}</span>
              </div>
            )}

            <div className={`rounded-xl border px-3.5 py-2.5 text-[11px] sm:text-xs font-mono tabular-nums font-semibold flex items-center gap-2 ${t.monitorColor}`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{outcome.vitalMonitorStatus}</span>
            </div>

            <p className="text-[11px] sm:text-xs text-[#55685F] leading-relaxed">
              {outcome.clinicalPostscript}
            </p>
          </div>

          {/* Action CTA — Reveals score & feedback only after user reads outcome */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-[#718078] text-center sm:text-left">
              A continuación podrás revisar tu puntaje desglosado y la retroalimentación académica completa.
            </span>

            <button
              onClick={onContinueToAudit}
              className={`w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 ${t.cta}`}
            >
              <span>Ver Puntaje y Retroalimentación</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
