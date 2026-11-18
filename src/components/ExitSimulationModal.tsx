import React, { useEffect } from 'react';
import { AlertTriangle, ArrowLeft, LogOut } from 'lucide-react';

export interface ExitSimulationPromptInfo {
  modeLabel: string;
  title: string;
  description: string;
  contextLine?: string;
  leaveButtonLabel?: string;
}

interface ExitSimulationModalProps {
  isOpen: boolean;
  info: ExitSimulationPromptInfo | null;
  onStay: () => void;
  onConfirmLeave: () => void;
}

export const ExitSimulationModal: React.FC<ExitSimulationModalProps> = ({
  isOpen,
  info,
  onStay,
  onConfirmLeave,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onStay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay]);

  if (!isOpen || !info) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#263A32]/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-sim-modal-title"
      onClick={onStay}
    >
      <div
        className="w-full max-w-md bg-white border border-[#E2EAE4] rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-amber-50/80 border-b border-amber-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              {info.modeLabel}
            </div>
            <h3
              id="exit-sim-modal-title"
              className="text-base font-extrabold text-[#263A32] leading-snug"
            >
              {info.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5 text-xs sm:text-sm text-[#263A32]">
          <p className="text-[#55685F] leading-relaxed">{info.description}</p>

          {info.contextLine && (
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 py-2.5 text-xs text-[#263A32] font-medium tabular-nums">
              {info.contextLine}
            </div>
          )}

          <p className="text-xs text-[#55685F] leading-relaxed">
            Puedes regresar para continuar exactamente donde estabas o confirmar tu salida.
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 bg-[#F8FBF9] border-t border-[#E2EAE4] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onConfirmLeave}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-[#E2EAE4] hover:border-rose-300 text-xs sm:text-sm font-semibold text-rose-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{info.leaveButtonLabel || 'Sí, salir'}</span>
          </button>

          <button
            type="button"
            onClick={onStay}
            className="min-h-[42px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#174E3E] to-[#3A846B] hover:from-[#123D31] hover:to-[#2F7A63] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Regresar a la simulación</span>
          </button>
        </div>
      </div>
    </div>
  );
};
