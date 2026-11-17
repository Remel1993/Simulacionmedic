import React, { useEffect, useState } from 'react';
import { Expand, UserRound, Baby, X } from 'lucide-react';
import { ClinicalCase, VitalSigns } from '../types/clinical';
import { getPatientIllustration, PathologyIntensity } from '../utils/patientIllustration';

interface PatientVisualCardProps {
  caseData: ClinicalCase;
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
  variant?: 'banner' | 'vignette' | 'thumbnail';
  dark?: boolean;
  className?: string;
}

function getIntensityBorderClass(intensity: PathologyIntensity, dark = false): string {
  switch (intensity) {
    case 'deceased':
      return dark ? 'border-rose-600' : 'border-rose-500';
    case 'critical':
      return dark ? 'border-rose-500/80 hover:border-rose-400' : 'border-rose-400 hover:border-rose-500';
    case 'moderate':
      return dark ? 'border-amber-500/80 hover:border-amber-400' : 'border-amber-400 hover:border-amber-500';
    case 'mild':
    default:
      return dark ? 'border-[#294037] hover:border-[#4CA07E]' : 'border-[#E2EAE4] hover:border-[#43866B]';
  }
}

export const PatientVisualCard: React.FC<PatientVisualCardProps> = ({
  caseData,
  liveVitals,
  isDeceased = false,
  variant = 'vignette',
  dark = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const illustration = getPatientIllustration(caseData, liveVitals, isDeceased);
  const isPediatric = caseData.patientInfo.age < 13;
  const borderClass = getIntensityBorderClass(illustration.intensity, dark);

  useEffect(() => {
    setImageError(false);
  }, [illustration.src, caseData.id]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const renderFallback = (iconSizeClass: string) => (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-1 ${
        dark
          ? 'bg-gradient-to-br from-[#163026] to-[#121E1A] text-[#68C79F]'
          : 'bg-gradient-to-br from-[#E4F1E8] to-[#F3F7F4] text-[#43866B]'
      }`}
    >
      {isPediatric ? (
        <Baby className={iconSizeClass} />
      ) : (
        <UserRound className={iconSizeClass} />
      )}
    </div>
  );

  if (variant === 'thumbnail') {
    return (
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-lg border shrink-0 ${
          dark ? 'bg-[#172621]' : 'bg-[#F3F7F4]'
        } ${borderClass} ${className}`}
      >
        {!imageError ? (
          <img
            src={illustration.src}
            alt={illustration.altText}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center ${
              isDeceased ? 'grayscale brightness-75' : ''
            }`}
          />
        ) : (
          renderFallback('w-4 h-4')
        )}
      </div>
    );
  }

  const lightboxModal = lightboxOpen ? (
    <div
      className="fixed inset-0 z-50 bg-[#070E0C]/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setLightboxOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Imagen del paciente ampliada"
    >
      <div
        className={`relative w-full max-w-2xl border ${borderClass} rounded-2xl overflow-hidden shadow-2xl ${
          dark ? 'bg-[#121E1A]' : 'bg-[#F3F7F4]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(false)}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow-md ${
            dark
              ? 'bg-[#172621]/90 hover:bg-[#2F7A63] border-[#294037] text-[#E8F2ED] hover:text-white'
              : 'bg-white/90 hover:bg-[#43866B] border-[#E2EAE4] text-[#263A32] hover:text-white'
          }`}
          aria-label="Cerrar vista ampliada"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`relative aspect-[4/3] w-full ${dark ? 'bg-[#121E1A]' : 'bg-[#F3F7F4]'}`}>
          {!imageError ? (
            <img
              src={illustration.src}
              alt={illustration.altText}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center ${
                isDeceased ? 'grayscale brightness-75' : ''
              }`}
            />
          ) : (
            renderFallback('w-12 h-12')
          )}
        </div>
      </div>
    </div>
  ) : null;

  if (variant === 'banner') {
    return (
      <>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          title="Ampliar imagen del paciente"
          aria-label="Ampliar imagen del paciente"
          className={`group relative aspect-[4/3] w-28 sm:w-36 rounded-xl overflow-hidden border ${borderClass} transition-colors shrink-0 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#43866B] ${
            dark ? 'bg-[#172621]' : 'bg-[#F3F7F4]'
          } ${className}`}
        >
          {!imageError ? (
            <img
              src={illustration.src}
              alt={illustration.altText}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                isDeceased ? 'grayscale brightness-75' : ''
              }`}
            />
          ) : (
            renderFallback('w-7 h-7')
          )}
          <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-md bg-[#16231D]/70 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
            <Expand className="w-3 h-3 shrink-0" />
          </span>
        </button>
        {lightboxModal}
      </>
    );
  }

  // 'vignette' variant: clean patient portrait for Express Turno & consultation reception
  return (
    <>
      <div
        className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden border ${borderClass} shadow-sm ${
          dark ? 'bg-[#172621]' : 'bg-[#F3F7F4]'
        } ${className}`}
      >
        {!imageError ? (
          <img
            src={illustration.src}
            alt={illustration.altText}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center ${
              isDeceased ? 'grayscale brightness-75' : ''
            }`}
          />
        ) : (
          renderFallback('w-10 h-10')
        )}

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          title="Ampliar imagen del paciente"
          aria-label="Ampliar imagen del paciente"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-colors shadow-sm ${
            dark
              ? 'bg-[#121E1A]/90 hover:bg-[#2F7A63] border-[#294037] text-[#E8F2ED] hover:text-white'
              : 'bg-white/90 hover:bg-[#43866B] border-[#E2EAE4] text-[#263A32] hover:text-white'
          }`}
        >
          <Expand className="w-3.5 h-3.5" />
        </button>
      </div>
      {lightboxModal}
    </>
  );
};
