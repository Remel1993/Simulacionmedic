import React, { useEffect, useState } from 'react';
import { Expand, UserRound, Baby, X } from 'lucide-react';
import { ClinicalCase, VitalSigns } from '../types/clinical';
import { getPatientIllustration, PathologyIntensity } from '../utils/patientIllustration';

interface PatientVisualCardProps {
  caseData: ClinicalCase;
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
  variant?: 'banner' | 'vignette' | 'thumbnail';
  className?: string;
}

function getIntensityBorderClass(intensity: PathologyIntensity): string {
  switch (intensity) {
    case 'deceased':
      return 'border-rose-500';
    case 'critical':
      return 'border-rose-400 hover:border-rose-500';
    case 'moderate':
      return 'border-amber-400 hover:border-amber-500';
    case 'mild':
    default:
      return 'border-[#E2EAE4] hover:border-[#43866B]';
  }
}

function getIntensityModalTextClass(intensity: PathologyIntensity): string {
  switch (intensity) {
    case 'deceased':
    case 'critical':
      return 'text-rose-700';
    case 'moderate':
      return 'text-amber-700';
    case 'mild':
    default:
      return 'text-[#43866B]';
  }
}

export const PatientVisualCard: React.FC<PatientVisualCardProps> = ({
  caseData,
  liveVitals,
  isDeceased = false,
  variant = 'vignette',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const illustration = getPatientIllustration(caseData, liveVitals, isDeceased);
  const isPediatric = caseData.patientInfo.age < 13;
  const borderClass = getIntensityBorderClass(illustration.intensity);
  const modalAccentTextClass = getIntensityModalTextClass(illustration.intensity);

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
    <div className="w-full h-full bg-gradient-to-br from-[#E4F1E8] to-[#F3F7F4] flex flex-col items-center justify-center text-[#43866B] gap-1">
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
        className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-[#F3F7F4] border ${borderClass} shrink-0 ${className}`}
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
      className="fixed inset-0 z-50 bg-[#263A32]/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setLightboxOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen del paciente ${caseData.patientInfo.name}`}
    >
      <div
        className={`w-full max-w-2xl bg-white border ${borderClass} rounded-2xl overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3.5 bg-[#F8FBF9] border-b border-[#E2EAE4] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#263A32] truncate">
              {caseData.patientInfo.name} · {caseData.patientInfo.age} años ({caseData.patientInfo.sex})
            </h3>
            <p className={`text-xs font-semibold truncate ${modalAccentTextClass}`}>
              {illustration.intensityLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="w-9 h-9 rounded-xl bg-white border border-[#E2EAE4] hover:bg-[#E4F1E8] text-[#263A32] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
            aria-label="Cerrar vista ampliada"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full bg-[#F3F7F4]">
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

        <div className="px-4 py-3 bg-[#F8FBF9] border-t border-[#E2EAE4]">
          <p className="text-xs text-[#263A32] leading-snug">
            <strong className="text-[#43866B] font-semibold">Motivo de consulta:</strong>{' '}
            {caseData.patientInfo.consultReason}
          </p>
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
          className={`group relative aspect-[4/3] w-28 sm:w-36 rounded-xl overflow-hidden bg-[#F3F7F4] border ${borderClass} transition-colors shrink-0 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#43866B] ${className}`}
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
        className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F3F7F4] border ${borderClass} shadow-sm ${className}`}
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
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/90 hover:bg-[#43866B] border border-[#E2EAE4] text-[#263A32] hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm"
        >
          <Expand className="w-3.5 h-3.5" />
        </button>
      </div>
      {lightboxModal}
    </>
  );
};
