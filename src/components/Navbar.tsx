import React from 'react';
import {
  Home,
  FolderOpen,
  BarChart3,
  BookOpen,
  Calculator,
  Stethoscope,
  RefreshCw,
} from 'lucide-react';
import { GameMode, Specialty } from '../types/clinical';
import { PWAInstallButton } from './PWAInstallButton';
import { HospitalSelect } from './HospitalSelect';

export type NavSectionKey = 'home' | 'cases' | 'history' | 'guides' | 'calculators';

interface NavbarProps {
  activeView: 'lobby' | 'simulation' | 'turno_medico';
  activeSection: NavSectionKey;
  onGoHome: () => void;
  onOpenCasesLibrary: () => void;
  onOpenHistoryModal: () => void;
  onOpenGuideModal: () => void;
  onOpenCalculatorsModal: () => void;
  onRestartCase: () => void;
  onSelectMode: (mode: GameMode | 'turno_medico') => void;
  currentMode: GameMode | 'turno_medico';
  currentSpecialty: Specialty;
  historyCount: number;
}

const MODE_OPTIONS: Array<{ value: GameMode | 'turno_medico'; label: string; description: string }> = [
  {
    value: 'principiante',
    label: 'Modo Principiante',
    description: 'Cuadros clásicos frecuentes con semiología guiada.',
  },
  {
    value: 'medico_general',
    label: 'Modo Médico General',
    description: 'Consulta externa y guardia con cuadros habituales.',
  },
  {
    value: 'residente',
    label: 'Modo Residente',
    description: 'Comorbilidades múltiples y casos de alta complejidad.',
  },
  {
    value: 'urgencias',
    label: 'Modo Urgencias',
    description: 'Sala de choque (8 min), evolución rápida y STAT.',
  },
  {
    value: 'examen',
    label: 'Modo Examen (ECOE)',
    description: 'Estación ciega de 12 min sin ayudas ni atajos.',
  },
  {
    value: 'turno_medico',
    label: 'Modo Turno Médico (Express)',
    description: 'Cola ágil de múltiples pacientes en una sola pantalla.',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  activeSection,
  onGoHome,
  onOpenCasesLibrary,
  onOpenHistoryModal,
  onOpenGuideModal,
  onOpenCalculatorsModal,
  onRestartCase,
  onSelectMode,
  currentMode,
  historyCount,
}) => {
  const navItems: Array<{
    key: NavSectionKey;
    label: string;
    mobileLabel: string;
    icon: any;
    onClick: () => void;
    badge?: number;
  }> = [
    { key: 'home', label: 'Inicio', mobileLabel: 'Inicio', icon: Home, onClick: onGoHome },
    { key: 'cases', label: 'Casos', mobileLabel: 'Casos', icon: FolderOpen, onClick: onOpenCasesLibrary },
    {
      key: 'history',
      label: 'Resultados',
      mobileLabel: 'Result.',
      icon: BarChart3,
      onClick: onOpenHistoryModal,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    { key: 'guides', label: 'Guías Clínicas', mobileLabel: 'Guías', icon: BookOpen, onClick: onOpenGuideModal },
    { key: 'calculators', label: 'Calculadoras', mobileLabel: 'Calc.', icon: Calculator, onClick: onOpenCalculatorsModal },
  ];

  const isTurnoDark = activeView === 'turno_medico';

  return (
    <header
      className={`sticky top-0 z-40 w-full pt-[env(safe-area-inset-top)] ${
        isTurnoDark ? 'shadow-[0_4px_16px_rgba(0,0,0,0.45)]' : 'shadow-[0_2px_12px_rgba(23,78,62,0.16)]'
      }`}
    >
      {/* Top Hospital Emerald Bar (higher z-index so the Mode dropdown cleanly overlaps the sub-nav) */}
      <div
        className={`relative z-20 text-white border-b transition-colors duration-200 ${
          isTurnoDark
            ? 'bg-gradient-to-r from-[#0E2B22] via-[#133A2E] to-[#194A3B] border-[#243830]'
            : 'bg-gradient-to-r from-[#174E3E] via-[#266E58] to-[#3A846B] border-white/15'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-3 sm:px-5 py-2 md:py-0 md:h-16 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          {/* Top Row (Mobile) / Left (Desktop): Emblem + Title + Mobile Restart */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group min-w-0"
              title="Volver al inicio"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/15 border border-white/25 group-hover:bg-white/25 flex items-center justify-center text-white shrink-0 transition-colors">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
                  Simulador Médico
                </span>
                <span className="text-[10.5px] sm:text-xs text-[#E4F1E8] font-medium whitespace-nowrap leading-tight">
                  Aprende · Piensa · Decide
                </span>
              </div>
            </button>

            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {activeView === 'simulation' && (
                <button
                  type="button"
                  onClick={onRestartCase}
                  title="Reiniciar expediente actual"
                  aria-label="Reiniciar expediente actual"
                  className="min-h-[34px] px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11.5px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  <span>Reiniciar</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2 (Mobile: edge-to-edge) / Right (Desktop md+) */}
          <div className="flex items-center gap-2 md:gap-2.5 w-full md:w-auto justify-between md:justify-end min-w-0">
            <HospitalSelect
              variant="header"
              align="right"
              dark={isTurnoDark}
              ariaLabel="Clasificación de simulación"
              panelTitle="Clasificación de Simulación"
              value={currentMode}
              onChange={(val) => onSelectMode(val as GameMode | 'turno_medico')}
              options={MODE_OPTIONS}
              className="flex-1 min-w-0 md:flex-none md:w-56 lg:w-64"
            />

            <div className="md:hidden shrink-0 empty:hidden">
              <PWAInstallButton />
            </div>

            {activeView === 'simulation' && (
              <button
                type="button"
                onClick={onRestartCase}
                title="Reiniciar expediente actual"
                aria-label="Reiniciar expediente actual"
                className="hidden md:flex min-h-[40px] px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                <span>Reiniciar</span>
              </button>
            )}

            <div className="hidden md:block shrink-0 empty:hidden">
              <PWAInstallButton />
            </div>
          </div>
        </div>
      </div>

      {/* Slim Horizontal Navigation Bar (Mobile & Desktop) */}
      {activeView !== 'turno_medico' && (
        <nav
          aria-label="Navegación clínica principal"
          className="relative z-10 bg-white/95 backdrop-blur-md border-b border-[#E2EAE4]"
        >
          <div className="max-w-7xl w-full mx-auto px-1.5 py-1 md:py-0 md:px-5 md:h-12 grid grid-cols-5 md:flex md:items-center gap-1 md:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  title={item.label}
                  aria-label={item.label}
                  className={`relative h-[30px] md:h-9 px-1 md:px-3.5 rounded-lg md:rounded-xl flex items-center justify-center md:justify-start gap-1 md:gap-2 text-[10px] md:text-xs font-bold transition-colors cursor-pointer whitespace-nowrap min-w-0 ${
                    isActive
                      ? 'bg-[#E4F1E8] text-[#174E3E] border border-[#72A98A]/60'
                      : 'text-[#55685F] hover:text-[#263A32] hover:bg-[#F3F7F4] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 ${isActive ? 'text-[#2F7A63]' : 'text-[#55685F]'}`} />
                  <span className="md:hidden truncate">{item.mobileLabel}</span>
                  <span className="hidden md:inline">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`min-w-[14px] h-[14px] md:min-w-[18px] md:h-[18px] px-1 md:px-1.5 rounded-full text-[8.5px] md:text-[10px] font-mono tabular-nums font-bold flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#2F7A63] text-white' : 'bg-[#E4F1E8] text-[#1F4B3A]'
                      }`}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
