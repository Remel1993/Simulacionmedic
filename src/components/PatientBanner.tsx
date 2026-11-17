import React from 'react';
import { ClinicalCase, VitalSigns } from '../types/clinical';
import { DisclosedBackgroundSections } from '../utils/backgroundDisclosure';
import { getVitalReferenceBounds, detectPregnancyContext } from '../utils/clinicalContext';
import { PatientVisualCard } from './PatientVisualCard';
import { AlertTriangle, Pill, Clock, HelpCircle, Heart, Siren, Stethoscope } from 'lucide-react';

interface PatientBannerProps {
  caseData: ClinicalCase;
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
  revealSpecialty?: boolean;
  disclosedBackground?: DisclosedBackgroundSections;
}

const SPECIALTY_NAMES: Record<string, string> = {
  aleatorio: 'General',
  infectologia: 'Infectología',
  cardiologia: 'Cardiología',
  cirugia_general: 'Cirugía General',
  endocrinologia: 'Endocrinología',
  neurologia: 'Neurología',
  neumologia: 'Neumología',
  medicina_interna: 'Medicina Interna',
  urgencias: 'Medicina de Emergencias',
  pediatria: 'Pediatría',
  gastroenterologia: 'Gastroenterología',
  nefrologia: 'Nefrología',
  ginecologia: 'Ginecología y Obstetricia',
  traumatologia: 'Traumatología',
  dermatologia: 'Dermatología',
  psiquiatria: 'Psiquiatría',
  oftalmologia: 'Oftalmología',
  otorrinolaringologia: 'Otorrinolaringología',
  urologia: 'Urología',
  hematologia: 'Hematología',
  reumatologia: 'Reumatología',
  toxicologia: 'Toxicología Clínica',
};

const MODE_NAMES: Record<string, string> = {
  principiante: 'Principiante',
  medico_general: 'Médico General',
  residente: 'Residente',
  urgencias: 'Urgencias',
  examen: 'Modo Examen',
};

export const PatientBanner: React.FC<PatientBannerProps> = ({
  caseData,
  liveVitals,
  isDeceased = false,
  revealSpecialty = false,
  disclosedBackground,
}) => {
  const { patientInfo, background } = caseData;
  const allergiesKnown = Boolean(revealSpecialty || disclosedBackground?.allergies);
  const medsKnown = Boolean(revealSpecialty || disclosedBackground?.currentMedications);
  const occupationKnown = Boolean(revealSpecialty || disclosedBackground?.nonPathological);

  const hasAllergies =
    background.allergies &&
    background.allergies.length > 0 &&
    !background.allergies[0].toLowerCase().includes('sin alergias');

  const isCrashRoom = isDeceased || caseData.mode === 'urgencias';

  const pregPublic = detectPregnancyContext(caseData, { publicOnly: true });
  const ageGroupLabel = getVitalReferenceBounds(patientInfo.age, pregPublic.isViablePregnancy).ageGroupLabel;

  return (
    <section
      aria-label="Resumen del paciente"
      className={`relative rounded-2xl border bg-white shadow-[0_2px_10px_rgba(38,58,50,0.05)] overflow-hidden ${
        isCrashRoom ? 'border-rose-200' : 'border-[#E2EAE4]'
      }`}
    >
      {/* Ambient Clinical Setting Header Strip */}
      <div
        className={`px-3.5 sm:px-5 py-1.5 border-b flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold tracking-wide ${
          isDeceased
            ? 'bg-rose-700 text-white border-rose-800'
            : isCrashRoom
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-[#F8FBF9] text-[#2F6A55] border-[#E2EAE4]'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isCrashRoom ? (
            <Siren className={`w-3.5 h-3.5 shrink-0 ${isDeceased ? 'text-white' : 'text-rose-600'}`} />
          ) : (
            <Stethoscope className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
          )}
          <span className="truncate">
            {isDeceased
              ? 'Código Azul · Paro Cardiorrespiratorio'
              : caseData.mode === 'urgencias'
                ? 'Área de Choque · Atención de Urgencias'
                : 'Expediente de Atención Clínica'}
          </span>
        </div>
        <span className="text-[11px] font-semibold opacity-90 shrink-0">
          {revealSpecialty
            ? `${SPECIALTY_NAMES[caseData.specialty] || caseData.specialty} · ${MODE_NAMES[caseData.mode] || caseData.mode}`
            : `Modo ${MODE_NAMES[caseData.mode] || caseData.mode}`}
        </span>
      </div>

      <div className="relative px-3.5 sm:px-5 py-3.5 sm:py-4">
        {/* Subtle Decorative ECG Trace */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:flex items-center gap-2 absolute top-3.5 right-5 opacity-50"
        >
          <svg width="96" height="24" viewBox="0 0 96 24" fill="none">
            <path
              d="M2 13H24L29 13L33 5L38 20L43 3L48 18L53 13H74L78 9L82 13H94"
              stroke={isCrashRoom ? '#E11D48' : '#72A98A'}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Heart className={`w-4 h-4 ${isCrashRoom ? 'text-rose-500' : 'text-[#43866B]'}`} />
        </div>

        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          {/* Patient Visual Portrait */}
          <div className="shrink-0">
            <PatientVisualCard
              caseData={caseData}
              liveVitals={liveVitals}
              isDeceased={isDeceased}
              variant="banner"
              className="w-20 sm:w-32"
            />
          </div>

          {/* Core Patient Narrative */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:pr-32 text-[11px] sm:text-xs text-[#55685F] font-medium">
              <span className="font-semibold text-[#1F4B3A]">{ageGroupLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                {patientInfo.evolutionTime}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-[#263A32] leading-snug">
                {patientInfo.name}
              </h1>
              <span className="text-xs sm:text-sm text-[#55685F] font-medium tabular-nums">
                · {patientInfo.age} años · {patientInfo.sex}
                {typeof (liveVitals?.weightKg ?? caseData.vitalSigns.weightKg) === 'number'
                  ? ` · Peso ${liveVitals?.weightKg ?? caseData.vitalSigns.weightKg} kg`
                  : ''}
                {typeof (liveVitals?.heightCm ?? caseData.vitalSigns.heightCm) === 'number'
                  ? ` · Talla ${liveVitals?.heightCm ?? caseData.vitalSigns.heightCm} cm`
                  : ''}
                {occupationKnown && patientInfo.occupation ? ` · ${patientInfo.occupation}` : ''}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#55685F] leading-snug">
              <span className="font-semibold text-[#263A32]">Consulta: </span>
              {patientInfo.consultReason}
            </p>

            {/* Background Quick Indicators */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] sm:text-xs">
              {!allergiesKnown ? (
                <div className="inline-flex items-center gap-1.5 text-[#55685F]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                  <span>Alergias:</span>
                  <span className="text-[#263A32] font-semibold">Por interrogar</span>
                </div>
              ) : hasAllergies ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="font-bold text-rose-700">Alergia:</span>
                  <span className="font-semibold">{background.allergies.join(', ')}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-[#1F4B3A] font-semibold">
                  <span>Sin alergias conocidas</span>
                </div>
              )}

              {medsKnown && background.currentMedications && background.currentMedications.length > 0 && (
                <div className="inline-flex items-center gap-1.5 text-[#55685F] min-w-0">
                  <Pill className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                  <span>Fármacos habituales:</span>
                  <span
                    className="text-[#263A32] font-medium max-w-[200px] sm:max-w-xs truncate"
                    title={background.currentMedications.join(' · ')}
                  >
                    {background.currentMedications.join(' · ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
