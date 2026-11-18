import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(!isOnline);

  useEffect(() => {
    if (isOnline) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [isOnline]);

  if (isOnline || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 md:bottom-4 left-3 right-3 sm:left-4 sm:right-auto max-w-[calc(100vw-24px)] z-50 flex items-center gap-2 rounded-xl bg-amber-50/95 border border-amber-300 px-3.5 py-2 text-xs font-semibold text-amber-900 shadow-lg backdrop-blur-sm"
    >
      <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
      <span className="min-w-0 leading-snug">
        Sin conexión — Base clínica local verificada activa (actualización en línea no comprobada)
      </span>
    </div>
  );
};
