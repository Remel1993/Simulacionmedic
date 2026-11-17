import React, { useEffect, useState } from 'react';
import {
  GameMode,
  Specialty,
  TurnoMedicoConfig,
  TurnoProfile,
  TurnoTimerMode,
} from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import { HospitalSelect } from './HospitalSelect';
import {
  Stethoscope,
  Sparkles,
  GraduationCap,
  Shield,
  Flame,
  Check,
  Zap,
  Heart,
} from 'lucide-react';

interface HomeDashboardProps {
  onStartSimulation: (mode: GameMode, specialty: Specialty, caseId?: string) => Promise<void>;
  onStartTurnoMedico: (config: TurnoMedicoConfig) => void;
  isLoading: boolean;
  totalCasesCount?: number;
  initialMode?: GameMode;
  initialSpecialty?: Specialty;
  onPreferencesChange?: (mode: GameMode, specialty: Specialty) => void;
}

type ClassificationKey = GameMode | 'turno_medico';

const MODES: Array<{
  id: GameMode;
  title: string;
  short: string;
  desc: string;
  details: string[];
  icon: any;
}> = [
  {
    id: 'principiante',
    title: 'Principiante · Aprendizaje Guiado',
    short: 'Principiante',
    desc: 'Cuadros clásicos frecuentes y semiología directa.',
    details: [
      'Presentaciones clínicas típicas con menor carga de distractores.',
      'Preguntas rápidas guiadas y exploración completa por sistemas.',
      'Rúbrica académica de 100 pts enfocada en diagnóstico y manejo seguro.',
    ],
    icon: GraduationCap,
  },
  {
    id: 'medico_general',
    title: 'Médico General · Consulta Externa',
    short: 'Médico General',
    desc: 'Consulta externa y guardia con cuadros clínicos habituales.',
    details: [
      'Balance realista entre casos ambulatorios frecuentes y patología aguda.',
      'Evaluación de anamnesis dirigida, paraclínicos justificados y receta completa.',
      'Práctica cotidiana de primer contacto hospitalario.',
    ],
    icon: Stethoscope,
  },
  {
    id: 'residente',
    title: 'Residente · Alta Complejidad',
    short: 'Residente',
    desc: 'Comorbilidades múltiples y cuadros clínicos complejos.',
    details: [
      'Pacientes con antecedentes múltiples, interacciones y presentaciones atípicas.',
      'Mayor exigencia en razonamiento diagnóstico y manejo farmacológico.',
      'Incluye aplicación STAT en vivo si el paciente se inestabiliza.',
    ],
    icon: Shield,
  },
  {
    id: 'urgencias',
    title: 'Urgencias · Sala de Choque',
    short: 'Urgencias',
    desc: 'Ventana crítica de 8 min, estabilización STAT y riesgo vital.',
    details: [
      'Reloj crítico de 8 minutos con deterioro fisiológico continuo si no estabilizas.',
      'Módulo STAT en tiempo real (fármacos IV, oxígeno, fluidos y antídotos).',
      'Evalúa conducta de urgencia inmediata y prevención de iatrogenia fatal.',
    ],
    icon: Flame,
  },
  {
    id: 'examen',
    title: 'Examen Clínico · Estación ECOE',
    short: 'Modo Examen',
    desc: 'Estación ciega de 12 min sin ayudas ni resaltado visual.',
    details: [
      'Sin preguntas sugeridas ni desbloqueo masivo de maniobras o estudios.',
      'Incluye diferenciales, criterios de referencia y plan de alta.',
      'Envío automático al concluir la estación clínica de 12 minutos.',
    ],
    icon: Check,
  },
];

const SPECIALTIES: Array<{ id: Specialty; name: string }> = [
  { id: 'aleatorio', name: 'Aleatorio (Sorpresa Clínica)' },
  { id: 'infectologia', name: 'Infectología' },
  { id: 'cardiologia', name: 'Cardiología' },
  { id: 'cirugia_general', name: 'Cirugía General' },
  { id: 'endocrinologia', name: 'Endocrinología' },
  { id: 'neurologia', name: 'Neurología' },
  { id: 'neumologia', name: 'Neumología' },
  { id: 'medicina_interna', name: 'Medicina Interna' },
  { id: 'urgencias', name: 'Urgencias' },
  { id: 'pediatria', name: 'Pediatría' },
  { id: 'gastroenterologia', name: 'Gastroenterología' },
  { id: 'nefrologia', name: 'Nefrología' },
  { id: 'ginecologia', name: 'Ginecología y Obstetricia' },
  { id: 'traumatologia', name: 'Traumatología' },
  { id: 'dermatologia', name: 'Dermatología' },
  { id: 'psiquiatria', name: 'Psiquiatría' },
  { id: 'oftalmologia', name: 'Oftalmología' },
  { id: 'otorrinolaringologia', name: 'Otorrinolaringología' },
  { id: 'urologia', name: 'Urología' },
  { id: 'hematologia', name: 'Hematología' },
  { id: 'reumatologia', name: 'Reumatología' },
  { id: 'toxicologia', name: 'Toxicología Clínica' },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onStartSimulation,
  onStartTurnoMedico,
  isLoading,
  totalCasesCount,
  initialMode = 'medico_general',
  initialSpecialty = 'aleatorio',
  onPreferencesChange,
}) => {
  const [classification, setClassification] = useState<ClassificationKey>(initialMode);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(initialSpecialty);

  const [turnoCount, setTurnoCount] = useState<3 | 5 | 7>(5);
  const [turnoProfile, setTurnoProfile] = useState<TurnoProfile>('mixto');
  const [turnoTimer, setTurnoTimer] = useState<TurnoTimerMode>('untimed');

  useEffect(() => {
    setClassification((prev) => (prev === 'turno_medico' ? prev : initialMode));
  }, [initialMode]);

  useEffect(() => {
    setSelectedSpecialty(initialSpecialty);
  }, [initialSpecialty]);

  const libraryCount = totalCasesCount ?? ALL_CURATED_CASES.length;
  const isTurno = classification === 'turno_medico';
  const activeModeObj = !isTurno ? MODES.find((m) => m.id === classification) || MODES[1] : null;
  const ActiveIcon = isTurno ? Zap : activeModeObj?.icon || Stethoscope;

  const handleClassificationChange = (val: ClassificationKey) => {
    setClassification(val);
    if (val !== 'turno_medico') {
      onPreferencesChange?.(val, selectedSpecialty);
    }
  };

  const handleSpecialtyChange = (val: Specialty) => {
    setSelectedSpecialty(val);
    if (classification !== 'turno_medico') {
      onPreferencesChange?.(classification, val);
    }
  };

  const handleLaunch = () => {
    if (classification === 'turno_medico') {
      onStartTurnoMedico({
        patientCount: turnoCount,
        profile: turnoProfile,
        timerMode: turnoTimer,
        specialty: selectedSpecialty,
      });
    } else {
      void onStartSimulation(classification, selectedSpecialty);
    }
  };

  const classificationOptions = [
    ...MODES.map((m) => ({
      value: m.id,
      label: m.title,
      description: m.desc,
    })),
    {
      value: 'turno_medico',
      label: 'Turno Médico · Guardia Express Multi-Paciente',
      description: 'Cola ágil de 3, 5 o 7 pacientes en una sola pantalla.',
    },
  ];

  const specialtyOptions = SPECIALTIES.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="space-y-5">
      {/* Main Compact Clinical Briefing & UI Selector Card */}
      <section className="relative rounded-2xl border border-[#E2EAE4] bg-white shadow-[0_2px_12px_rgba(38,58,50,0.06)]">
        <div className="bg-[#E4F1E8]/85 border-b border-[#CFE4D6] rounded-t-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F4B3A] uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-[#2F7A63] shrink-0" />
            <span>Configuración de Consulta · {libraryCount} Casos Offline</span>
          </div>
          <div aria-hidden="true" className="hidden sm:flex items-center gap-2 opacity-65">
            <svg width="84" height="22" viewBox="0 0 84 22" fill="none">
              <path
                d="M2 12H20L25 12L28 5L32 18L36 2L41 16L45 12H66L69 9L72 12H82"
                stroke="#2F7A63"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Heart className="w-4 h-4 text-[#2F7A63]" />
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#263A32]">
              Entrena tu Razonamiento Clínico
            </h1>
            <p className="text-xs sm:text-sm text-[#55685F] leading-relaxed max-w-2xl">
              Elige la clasificación y especialidad médica desde las listas clínicas para comenzar una consulta individual o un turno hospitalario.
            </p>
          </div>

          {/* Custom Hospital UI Dropdown Windows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label
                htmlFor="home-classification-select"
                className="text-xs font-bold text-[#263A32] block"
              >
                Clasificación de Simulación
              </label>
              <HospitalSelect
                id="home-classification-select"
                panelTitle="Clasificación de Simulación"
                value={classification}
                onChange={(val) => handleClassificationChange(val as ClassificationKey)}
                options={classificationOptions}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="home-specialty-select"
                className="text-xs font-bold text-[#263A32] block"
              >
                Área o Especialidad Médica
              </label>
              <HospitalSelect
                id="home-specialty-select"
                panelTitle="Área o Especialidad"
                searchable
                searchPlaceholder="Buscar especialidad..."
                value={selectedSpecialty}
                onChange={(val) => handleSpecialtyChange(val as Specialty)}
                options={specialtyOptions}
              />
            </div>
          </div>

          {/* Conditional Turno Médico UI Selectors */}
          {isTurno && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-950 block">
                  Pacientes en Sala
                </label>
                <HospitalSelect
                  variant="compact"
                  panelTitle="Cantidad de Pacientes"
                  value={String(turnoCount)}
                  onChange={(val) => setTurnoCount(Number(val) as 3 | 5 | 7)}
                  options={[
                    { value: '3', label: '3 pacientes' },
                    { value: '5', label: '5 pacientes' },
                    { value: '7', label: '7 pacientes' },
                  ]}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-950 block">
                  Perfil de Guardia
                </label>
                <HospitalSelect
                  variant="compact"
                  panelTitle="Perfil de Guardia"
                  value={turnoProfile}
                  onChange={(val) => setTurnoProfile(val as TurnoProfile)}
                  options={[
                    { value: 'mixto', label: 'Mixto (Consulta + Urgencias)' },
                    { value: 'consulta_rapida', label: 'Consulta Rápida' },
                    { value: 'urgencias', label: 'Urgencias' },
                  ]}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-950 block">
                  Control de Reloj
                </label>
                <HospitalSelect
                  variant="compact"
                  panelTitle="Control de Reloj"
                  value={turnoTimer}
                  onChange={(val) => setTurnoTimer(val as TurnoTimerMode)}
                  options={[
                    { value: 'untimed', label: 'Sin reloj límite' },
                    { value: 'per_patient_180', label: '3 min por paciente' },
                    { value: 'global_720', label: '12 min totales' },
                  ]}
                />
              </div>
            </div>
          )}

          {/* Concise Clinical Mode Summary */}
          <div className="rounded-xl border border-[#E2EAE4] bg-[#F8FBF9] p-4 flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isTurno ? 'bg-amber-100 text-amber-700' : 'bg-[#2F7A63] text-white'
              }`}
            >
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 space-y-1.5 text-xs">
              <div className="font-bold text-[#263A32] text-sm">
                {isTurno
                  ? 'Guardia Multi-Paciente · Turno Médico Express'
                  : activeModeObj?.title}
              </div>
              {isTurno ? (
                <p className="text-[#55685F] leading-relaxed">
                  Atiende una cola de {turnoCount} pacientes en una sola pantalla enfocada en triage, exploración directa, estabilización STAT opcional y diagnóstico principal.
                </p>
              ) : (
                <ul className="space-y-1 text-[#55685F]">
                  {activeModeObj?.details.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2F7A63] font-bold">·</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Single Primary Launch Action */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleLaunch}
              disabled={isLoading}
              className="w-full min-h-[46px] px-5 py-3 bg-gradient-to-r from-[#1F5E4B] to-[#3A846B] hover:from-[#174839] hover:to-[#2F7A63] disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 shrink-0 ${isLoading ? 'animate-spin' : ''}`} />
              <span>
                {isLoading
                  ? 'Preparando Expediente...'
                  : isTurno
                    ? `Iniciar Turno (${turnoCount} Pacientes)`
                    : 'Comenzar Simulación'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Offline Disclaimer Footer */}
      <footer className="rounded-2xl border border-[#E2EAE4] bg-white px-4 py-3 text-xs text-[#55685F] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          <strong className="text-[#43866B]">Motor Clínico 100 % Offline:</strong> Funciona sin internet y guarda tu progreso localmente.
        </span>
        <span className="text-[#718078]">
          Uso exclusivamente educativo; no sustituye el juicio clínico ni los protocolos vigentes.
        </span>
      </footer>
    </div>
  );
};
