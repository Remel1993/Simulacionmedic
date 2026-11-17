import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#E4F1E8] hover:bg-[#D5E9DC] border border-[#72A98A]/60 text-[#263A32] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Instalar aplicación en el dispositivo para uso 100 % sin conexión"
      >
        <Download className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#E4F1E8] hover:bg-[#D5E9DC] border border-[#72A98A]/60 text-[#263A32] text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Instrucciones para instalar en iPhone o iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
          <span>Instalar iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263A32]/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E2EAE4] p-5 shadow-xl space-y-3.5 text-[#263A32]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold flex items-center gap-2 text-[#263A32]">
                  <Smartphone className="w-4 h-4 text-[#43866B]" />
                  <span>Instalar en iPhone / iPad</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-lg text-[#55685F] hover:text-[#263A32] hover:bg-[#F3F7F4] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="text-xs text-[#55685F] space-y-2 list-decimal pl-4 leading-relaxed">
                <li>Pulsa el botón <strong className="text-[#263A32]">Compartir</strong> en la barra inferior de Safari.</li>
                <li>Desplázate hacia abajo y selecciona <strong className="text-[#263A32]">Agregar a inicio</strong>.</li>
                <li>Abre la app desde tu pantalla principal para usarla 100 % sin conexión.</li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full min-h-[42px] py-2.5 rounded-xl bg-[#43866B] hover:bg-[#356D56] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
