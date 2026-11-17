import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, Check, Search } from 'lucide-react';

export interface HospitalSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface HospitalSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: HospitalSelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  panelTitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  variant?: 'default' | 'header' | 'compact';
  align?: 'left' | 'right';
  disabled?: boolean;
  dark?: boolean;
  className?: string;
}

export const HospitalSelect: React.FC<HospitalSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar opción...',
  ariaLabel,
  panelTitle,
  searchable = false,
  searchPlaceholder = 'Buscar opción...',
  variant = 'default',
  align = 'left',
  disabled = false,
  dark = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.description && o.description.toLowerCase().includes(q))
    );
  }, [options, query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    if (searchable) {
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 30);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, searchable]);

  const triggerClasses =
    variant === 'header'
      ? dark
        ? 'w-full min-w-0 min-h-[40px] px-3 py-2 rounded-xl bg-[#0B1F19]/90 hover:bg-[#0A1A15] border border-[#2D5546] text-[#E8F2ED] text-xs sm:text-[13px] font-semibold flex items-center justify-between gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#68C79F]/60'
        : 'w-full min-w-0 min-h-[40px] px-3 py-2 rounded-xl bg-[#133E31]/85 hover:bg-[#103429] border border-white/25 text-white text-xs sm:text-[13px] font-semibold flex items-center justify-between gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
      : variant === 'compact'
        ? dark
          ? 'w-full min-w-0 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#172621] hover:border-[#4CA07E] border border-[#294037] text-xs font-medium text-[#E8F2ED] flex items-center justify-between gap-2 transition-colors focus:outline-none focus:border-[#52B78E]'
          : 'w-full min-w-0 min-h-[38px] px-3 py-1.5 rounded-xl bg-white hover:border-[#72A98A] border border-[#E2EAE4] text-xs font-medium text-[#263A32] flex items-center justify-between gap-2 transition-colors focus:outline-none focus:border-[#43866B]'
        : dark
          ? 'w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#172621] hover:bg-[#1C2D27] hover:border-[#4CA07E] border border-[#294037] text-sm font-semibold text-[#E8F2ED] flex items-center justify-between gap-2 transition-colors focus:outline-none focus:border-[#52B78E]'
          : 'w-full min-w-0 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8FBF9] hover:bg-white hover:border-[#72A98A] border border-[#E2EAE4] text-sm font-semibold text-[#263A32] flex items-center justify-between gap-2 transition-colors focus:outline-none focus:border-[#43866B] focus:bg-white';

  const dropdownPositionClasses =
    variant === 'header'
      ? 'absolute left-0 top-full mt-2 w-full min-w-[240px] max-w-[calc(100vw-24px)] md:left-auto md:right-0 md:w-80'
      : align === 'right'
        ? 'absolute right-0 top-full mt-1.5 w-full min-w-0 sm:min-w-[240px] max-w-[calc(100vw-24px)]'
        : 'absolute left-0 top-full mt-1.5 w-full min-w-0 sm:min-w-[240px] max-w-[calc(100vw-24px)]';

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || panelTitle || placeholder}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`${triggerClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp
            className={`w-4 h-4 shrink-0 ${variant === 'header' ? 'text-white/90' : dark ? 'text-[#68C79F]' : 'text-[#43866B]'}`}
          />
        ) : (
          <ChevronDown
            className={`w-4 h-4 shrink-0 ${variant === 'header' ? 'text-white/85' : dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}
          />
        )}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={ariaLabel || panelTitle || placeholder}
          className={`${dropdownPositionClasses} z-50 rounded-2xl border overflow-hidden ${
            dark
              ? 'border-[#294037] bg-[#121E1A] shadow-[0_16px_40px_rgba(0,0,0,0.55)]'
              : 'border-[#CFE4D6] bg-white shadow-[0_14px_36px_rgba(23,78,62,0.2)]'
          }`}
        >
          {/* Floating UI Window Header with fold button */}
          <div
            className={`border-b px-3.5 py-2 flex items-center justify-between gap-2 ${
              dark ? 'bg-[#172621] border-[#243830]' : 'bg-[#E4F1E8]/85 border-[#CFE4D6]'
            }`}
          >
            <span
              className={`text-[11px] font-bold uppercase tracking-wider truncate ${
                dark ? 'text-[#68C79F]' : 'text-[#1F4B3A]'
              }`}
            >
              {panelTitle || 'Seleccionar opción'}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0 ${
                dark
                  ? 'bg-[#121E1A] hover:bg-[#1E312B] border-[#294037] text-[#E8F2ED]'
                  : 'bg-white hover:bg-[#F3F7F4] border-[#CFE4D6] text-[#1F4B3A]'
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Cerrar</span>
            </button>
          </div>

          {searchable && options.length > 6 && (
            <div className={`p-2 border-b ${dark ? 'border-[#243830] bg-[#14221D]' : 'border-[#E2EAE4] bg-[#F8FBF9]'}`}>
              <div className="relative flex items-center">
                <Search className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${dark ? 'text-[#8EA69B]' : 'text-[#718078]'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`w-full min-h-[36px] pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                    dark
                      ? 'bg-[#0F1916] border-[#294037] text-[#E8F2ED] placeholder-[#7C9489] focus:border-[#52B78E]'
                      : 'bg-white border-[#E2EAE4] text-[#263A32] placeholder-[#718078] focus:border-[#43866B]'
                  }`}
                />
              </div>
            </div>
          )}

          <div className={`max-h-[min(22rem,58dvh)] overflow-y-auto p-1.5 space-y-1 ${dark ? 'bg-[#121E1A]' : 'bg-white'}`}>
            {filteredOptions.length === 0 ? (
              <div className={`px-3 py-4 text-center text-xs ${dark ? 'text-[#8EA69B]' : 'text-[#718078]'}`}>
                Sin coincidencias para "{query}"
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full min-h-[40px] px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? dark
                          ? 'bg-[#183329] text-[#D7F0E3] font-bold'
                          : 'bg-[#E4F1E8] text-[#1F4B3A] font-bold'
                        : dark
                          ? 'text-[#E8F2ED] hover:bg-[#172621]'
                          : 'text-[#263A32] hover:bg-[#F3F7F4]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-[13px] leading-snug">{opt.label}</div>
                      {opt.description && (
                        <div className={`text-[11px] font-normal mt-0.5 leading-snug ${dark ? 'text-[#8EA69B]' : 'text-[#55685F]'}`}>
                          {opt.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#2F7A63] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
