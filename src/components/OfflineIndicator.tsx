import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3 sm:left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-50/95 border border-amber-300 px-3.5 py-2 text-xs font-semibold text-amber-900 shadow-lg backdrop-blur-sm">
      <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
      <span>Modo Offline Activo — Motor clínico local operando</span>
    </div>
  );
};
