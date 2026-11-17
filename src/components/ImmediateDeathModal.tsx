import React from 'react';
import { Skull, AlertOctagon, Activity, ArrowRight, Eye } from 'lucide-react';

export interface ImmediateDeathAlertData {
  drug: string;
  dose: string;
  route: string;
  reason: string;
  appliedAt: string;
}

interface ImmediateDeathModalProps {
  alert: ImmediateDeathAlertData | null;
  patientName: string;
  onGoToAudit: () => void;
  onInspectRecord: () => void;
}

export const ImmediateDeathModal: React.FC<ImmediateDeathModalProps> = ({
  alert,
  patientName,
  onGoToAudit,
  onInspectRecord,
}) => {
  if (!alert) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#263A32]/55 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 lg:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de muerte inmediata por iatrogenia"
    >
      <div className="w-full max-w-[96vw] sm:max-w-2xl lg:max-w-3xl rounded-2xl border-2 border-rose-400 bg-white shadow-2xl overflow-hidden my-auto">
        {/* Top Hospital Código Azul Strip */}
        <div className="px-4 sm:px-6 py-3 bg-rose-50 border-b border-rose-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-[11px] font-mono tabular-nums font-bold uppercase tracking-widest text-rose-900">
              Monitorización Crítica · {patientName} · {alert.appliedAt}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg border bg-rose-600 border-rose-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
            CÓDIGO AZUL · MUERTE INMEDIATA POR IATROGENIA
          </span>
        </div>

        {/* Main Content */}
        <div className="p-5 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-rose-300 bg-rose-50 flex items-center justify-center text-rose-700 shrink-0 shadow-sm">
              <Skull className="w-11 h-11 sm:w-12 sm:h-12" />
            </div>

            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start">
                <svg
                  viewBox="0 0 240 48"
                  className="w-48 h-8 bg-[#182420] rounded-lg border border-rose-300 px-1"
                  aria-hidden="true"
                >
                  <path
                    d="M 0 24 L 30 24 L 36 21 L 41 26 L 48 24 L 240 24"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#263A32] tracking-tight leading-snug">
                {patientName} ha fallecido de forma inmediata
              </h2>
              <p className="text-xs sm:text-sm text-rose-800 font-medium">
                La intervención aplicada produjo colapso cardiorrespiratorio fulminante e irreversible en el acto.
              </p>
            </div>
          </div>

          {/* Iatrogenic Event Card */}
          <div className="bg-rose-50/80 border border-rose-300 rounded-xl p-4 space-y-3 text-left">
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-900">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <div className="font-bold text-rose-950">
                  Agente desencadenante: {alert.drug} · {alert.dose} ({alert.route})
                </div>
                <p className="text-rose-900 leading-relaxed">{alert.reason}</p>
              </div>
            </div>

            <div className="rounded-xl border border-rose-300 bg-[#182420] px-3.5 py-2.5 text-[11px] sm:text-xs font-mono tabular-nums text-rose-300 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>PA: 0/0 mmHg</span>
              <span>·</span>
              <span>FC: 0 lpm (Asistolia)</span>
              <span>·</span>
              <span>FR: 0 rpm</span>
              <span>·</span>
              <span>SpO₂: 0%</span>
              <span>·</span>
              <span>Glasgow: 3/15</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-1 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onInspectRecord}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E2EAE4] bg-[#F8FBF9] hover:bg-white hover:border-[#72A98A] text-[#263A32] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 shrink-0 text-[#43866B]" />
              <span>Revisar Signos y Expediente</span>
            </button>

            <button
              type="button"
              onClick={onGoToAudit}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Finalizar Caso y Ver Auditoría Clínica</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
