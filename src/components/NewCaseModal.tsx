import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ClinicalCase, GameMode, SavedCaseRecord, Specialty } from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import { buildCustomLocalCase } from '../engine/caseGenerator';
import { HospitalSelect } from './HospitalSelect';
import {
  X,
  Sparkles,
  Stethoscope,
  Shield,
  Flame,
  GraduationCap,
  Check,
  ChevronRight,
  PlusCircle,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (mode: GameMode, specialty: Specialty, caseId?: string) => Promise<void>;
  isLoading: boolean;
  customCases?: ClinicalCase[];
  onSaveCustomCase?: (newCase: ClinicalCase) => Promise<void>;
  onDeleteCustomCase?: (caseId: string) => Promise<void>;
  initialTab?: 'custom' | 'presets' | 'add_case';
  completedCaseIds?: string[];
  history?: SavedCaseRecord[];
}

const ALL_CURATED = ALL_CURATED_CASES;

const MODES: Array<{ id: GameMode; title: string; short: string; desc: string; icon: any }> = [
  {
    id: 'principiante',
    title: 'Modo Principiante',
    short: 'Principiante',
    desc: 'Casos frecuentes, síntomas cardinales característicos y menor número de distractores.',
    icon: GraduationCap,
  },
  {
    id: 'medico_general',
    title: 'Modo Médico General',
    short: 'Médico General',
    desc: 'Patologías frecuentes de consulta externa y guardia con presentaciones clínicas variadas.',
    icon: Stethoscope,
  },
  {
    id: 'residente',
    title: 'Modo Residente',
    short: 'Residente',
    desc: 'Casos complejos, comorbilidades múltiples, presentaciones atípicas y decisiones difíciles.',
    icon: Shield,
  },
  {
    id: 'urgencias',
    title: 'Modo Urgencias (Sala de Choque)',
    short: 'Urgencias',
    desc: 'Ventana crítica de 8 min, estabilización STAT en vivo y emergencias con amenaza vital.',
    icon: Flame,
  },
  {
    id: 'examen',
    title: 'Modo Examen Clínico',
    short: 'Examen Clínico',
    desc: 'Estación de 12 min sin preguntas rápidas, sin atajos ni resaltado de hallazgos.',
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
  { id: 'urgencias', name: 'Medicina de Emergencias' },
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

type OriginFilter = 'all' | 'common' | 'rare' | 'foreign' | 'custom_only';
type CompletionFilter = 'all' | 'unsolved' | 'solved' | 'review';
type ModeScopeFilter = 'all' | 'outpatient' | 'principiante' | 'medico_general' | 'complex';

function getCaseOrigin(c: ClinicalCase): Exclude<OriginFilter, 'all'> {
  if (c.clinicalMetadata?.isCustom) return 'custom_only';
  if (c.id.startsWith('case-exp-ext-')) return 'foreign';
  if (c.id.startsWith('case-exp-rare-')) return 'rare';
  return 'common';
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
  isLoading,
  customCases = [],
  onSaveCustomCase,
  onDeleteCustomCase,
  initialTab = 'custom',
  completedCaseIds = [],
  history = [],
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('medico_general');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>('aleatorio');
  const [activeTab, setActiveTab] = useState<'custom' | 'presets' | 'add_case'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<Specialty | 'all'>('all');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');
  const [presetFilter, setPresetFilter] = useState<ModeScopeFilter>('all');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Local extensible library builder state
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState('34');
  const [newSex, setNewSex] = useState<'Masculino' | 'Femenino'>('Masculino');
  const [newWeightKg, setNewWeightKg] = useState('70');
  const [newHeightCm, setNewHeightCm] = useState('168');
  const [newSpecialty, setNewSpecialty] = useState<Exclude<Specialty, 'aleatorio'>>('medicina_interna');
  const [newMode, setNewMode] = useState<GameMode>('medico_general');
  const [newReason, setNewReason] = useState('');
  const [newIllness, setNewIllness] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newDifferentials, setNewDifferentials] = useState('');
  const [newDrug, setNewDrug] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newSource, setNewSource] = useState('Guía clínica OMS/OPS / protocolo institucional vigente');
  const [newAlert, setNewAlert] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, activeTab, presetFilter, originFilter, completionFilter, specialtyFilter]);

  const completedSet = useMemo(() => new Set(completedCaseIds), [completedCaseIds]);

  const performanceByCaseId = useMemo(() => {
    const map = new Map<
      string,
      { bestScore: number; latestScore: number; attempts: number; hasSafetyError: boolean }
    >();
    for (const rec of history) {
      if (!rec.caseId) continue;
      const existing = map.get(rec.caseId);
      const hasErr = (rec.evaluation?.criticalSafetyErrors?.length ?? 0) > 0;
      if (!existing) {
        map.set(rec.caseId, {
          bestScore: rec.score,
          latestScore: rec.score,
          attempts: 1,
          hasSafetyError: hasErr,
        });
      } else {
        existing.bestScore = Math.max(existing.bestScore, rec.score);
        existing.attempts += 1;
        existing.hasSafetyError = existing.hasSafetyError || hasErr;
      }
    }
    return map;
  }, [history]);

  if (!isOpen) return null;

  const combinedCases = [...customCases, ...ALL_CURATED];

  const getSpecialtyLabel = (id: Specialty) =>
    SPECIALTIES.find((s) => s.id === id)?.name || id.replace('_', ' ');

  const getModeLabel = (id: GameMode) =>
    MODES.find((m) => m.id === id)?.short || id;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPresets = combinedCases.filter((c) => {
    if (specialtyFilter !== 'all' && c.specialty !== specialtyFilter) return false;

    if (originFilter !== 'all' && getCaseOrigin(c) !== originFilter) return false;

    const perf = performanceByCaseId.get(c.id);
    const isResolved = completedSet.has(c.id) || Boolean(perf);
    const needsReview = Boolean(perf && (perf.bestScore < 70 || perf.hasSafetyError));

    if (completionFilter === 'unsolved' && isResolved) return false;
    if (completionFilter === 'solved' && !isResolved) return false;
    if (completionFilter === 'review' && !needsReview) return false;

    if (presetFilter === 'outpatient' && c.solution.optimalTreatment.hospitalizationDecision !== 'Ambulatorio') {
      return false;
    }
    if (presetFilter === 'principiante' && c.mode !== 'principiante') return false;
    if (presetFilter === 'medico_general' && c.mode !== 'medico_general') return false;
    if (
      presetFilter === 'complex' &&
      c.mode !== 'residente' &&
      c.mode !== 'urgencias' &&
      c.mode !== 'examen'
    ) {
      return false;
    }

    if (normalizedQuery) {
      // Strictly exclude solution.correctDiagnosis and differentials from public search to prevent spoilers
      const haystack = [
        c.patientInfo.name,
        String(c.patientInfo.age),
        c.patientInfo.sex,
        c.patientInfo.consultReason,
        getSpecialtyLabel(c.specialty),
        getModeLabel(c.mode),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }

    return true;
  });

  const hasActiveFilters =
    Boolean(normalizedQuery) ||
    specialtyFilter !== 'all' ||
    originFilter !== 'all' ||
    completionFilter !== 'all' ||
    presetFilter !== 'all';

  const resetPresetFilters = () => {
    setSearchQuery('');
    setSpecialtyFilter('all');
    setOriginFilter('all');
    setCompletionFilter('all');
    setPresetFilter('all');
  };

  const selectedModeObj = MODES.find((m) => m.id === selectedMode);
  const selectedSpecObj = SPECIALTIES.find((s) => s.id === selectedSpecialty);

  const handleGenerate = async () => {
    await onSelectCase(selectedMode, selectedSpecialty);
  };

  const handlePresetSelect = async (presetId: string) => {
    const preset = combinedCases.find((p) => p.id === presetId);
    if (preset) {
      await onSelectCase(preset.mode, preset.specialty, preset.id);
    }
  };

  const handleCreateLocalCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newReason.trim() || !newIllness.trim() || !newDiagnosis.trim()) {
      setSaveError('Completa al menos nombre del paciente, motivo de consulta, enfermedad actual y diagnóstico definitivo.');
      return;
    }
    setSaveError('');
    const created = buildCustomLocalCase({
      mode: newMode,
      specialty: newSpecialty,
      patientName: newPatientName,
      age: Number(newAge) || 35,
      sex: newSex,
      occupation: 'Paciente local',
      consultReason: newReason,
      evolutionTime: '24 horas de evolución',
      currentIllness: newIllness,
      triageLevel: newMode === 'urgencias' ? 'Nivel II (Emergencia)' : 'Nivel III (Urgencia)',
      bloodPressure: '120/80 mmHg',
      heartRate: 86,
      respiratoryRate: 18,
      temperature: 37.0,
      oxygenSaturation: 98,
      glasgow: 15,
      weightKg: Number(newWeightKg) || 70,
      heightCm: Number(newHeightCm) || 168,
      correctDiagnosis: newDiagnosis,
      differentialDiagnoses: newDifferentials
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      pathophysiology: `Cuadro clínico compatible con ${newDiagnosis.trim()} según la historia clínica ingresada.`,
      keyClinicalClues: [newReason.trim()],
      expectedDrug: newDrug || 'Manejo terapéutico dirigido según diagnóstico',
      expectedDose: newDose || 'Dosis estándar',
      expectedRoute: 'Oral / Intravenosa según criterio clínico',
      expectedFrequency: 'Según evolución clínica',
      hospitalizationDecision: newMode === 'urgencias' ? 'Observación Urgencias' : 'Ambulatorio',
      guidelineReference: newSource,
      criticalSafetyAlert: newAlert || 'Verificar alergias, dosis y signos de alarma antes del egreso.',
    });
    await onSaveCustomCase?.(created);
    setNewPatientName('');
    setNewReason('');
    setNewIllness('');
    setNewDiagnosis('');
    setNewDifferentials('');
    setNewDrug('');
    setNewDose('');
    setNewAlert('');
    setActiveTab('presets');
    setOriginFilter('custom_only');
  };

  const originCounts = {
    common: combinedCases.filter((c) => getCaseOrigin(c) === 'common').length,
    rare: combinedCases.filter((c) => getCaseOrigin(c) === 'rare').length,
    foreign: combinedCases.filter((c) => getCaseOrigin(c) === 'foreign').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-[#263A32]/45 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-5xl xl:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[940px] flex flex-col bg-white border border-[#E2EAE4] rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F8FBF9] border-b border-[#E2EAE4] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E4F1E8] border border-[#72A98A]/50 flex items-center justify-center text-[#43866B] shrink-0">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight truncate">
                Iniciar Nuevo Caso Clínico
              </h3>
              <p className="text-[11px] text-[#718078] truncate">
                Simulador de razonamiento diagnóstico y decisiones médicas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[40px] min-h-[40px] p-2 text-[#55685F] hover:text-[#263A32] rounded-xl hover:bg-[#E4F1E8]/60 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#E2EAE4] grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0 bg-[#F3F7F4]">
          <button
            onClick={() => setActiveTab('custom')}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center ${
              activeTab === 'custom'
                ? 'bg-[#43866B] text-white shadow-sm'
                : 'bg-white border border-[#E2EAE4] text-[#55685F] hover:text-[#263A32] hover:border-[#72A98A]'
            }`}
          >
            Configuración Offline
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center tabular-nums ${
              activeTab === 'presets'
                ? 'bg-[#43866B] text-white shadow-sm'
                : 'bg-white border border-[#E2EAE4] text-[#55685F] hover:text-[#263A32] hover:border-[#72A98A]'
            }`}
          >
            Biblioteca Local ({combinedCases.length})
          </button>
          <button
            onClick={() => setActiveTab('add_case')}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'add_case'
                ? 'bg-[#43866B] text-white shadow-sm'
                : 'bg-white border border-[#E2EAE4] text-[#55685F] hover:text-[#263A32] hover:border-[#72A98A]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Ampliar Biblioteca</span>
          </button>
        </div>

        {/* Modal Body */}
        <div
          ref={modalBodyRef}
          className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 sm:space-y-6 bg-white"
        >
          {activeTab === 'custom' ? (
            <div className="space-y-5">
              {/* Compact Dropdown Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="modal-select-mode"
                    className="text-xs font-bold uppercase tracking-wider text-[#43866B] block"
                  >
                    1. Clasificación de Simulación
                  </label>
                  <HospitalSelect
                    id="modal-select-mode"
                    panelTitle="Clasificación de Simulación"
                    value={selectedMode}
                    onChange={(val) => setSelectedMode(val as GameMode)}
                    options={MODES.map((mode) => ({
                      value: mode.id,
                      label: mode.title,
                      description: mode.desc,
                    }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="modal-select-specialty"
                    className="text-xs font-bold uppercase tracking-wider text-[#43866B] block"
                  >
                    2. Especialidad Médica
                  </label>
                  <HospitalSelect
                    id="modal-select-specialty"
                    panelTitle="Especialidad Médica"
                    searchable
                    searchPlaceholder="Buscar especialidad..."
                    value={selectedSpecialty}
                    onChange={(val) => setSelectedSpecialty(val as Specialty)}
                    options={SPECIALTIES.map((spec) => ({
                      value: spec.id,
                      label: spec.name,
                    }))}
                  />
                </div>
              </div>

              {/* Concise Summary of Active Selection */}
              {selectedModeObj && (
                <div className="rounded-xl border border-[#E2EAE4] bg-[#F8FBF9] p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E4F1E8] border border-[#72A98A]/50 flex items-center justify-center text-[#2F7A63] shrink-0">
                    <selectedModeObj.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="text-sm font-bold text-[#263A32]">{selectedModeObj.title}</div>
                    <p className="text-xs text-[#55685F] leading-relaxed">{selectedModeObj.desc}</p>
                    <div className="text-xs text-[#43866B] font-semibold pt-0.5">
                      Área seleccionada: <span className="text-[#263A32]">{selectedSpecObj?.name}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'presets' ? (
            <div className="space-y-3.5">
              {/* Header + Search + Specialty Filter */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#43866B] tabular-nums">
                  Casos Clínicos Curados y Locales ({filteredPresets.length} de {combinedCases.length})
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetPresetFilters}
                    className="self-start md:self-auto min-h-[36px] px-3 py-1.5 rounded-lg bg-[#F8FBF9] border border-[#E2EAE4] hover:border-[#43866B] text-xs font-semibold text-[#1F4B3A] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpiar filtros</span>
                  </button>
                )}
              </div>

              {/* Search & Specialty Dropdown Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                <div className="md:col-span-7 relative">
                  <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por paciente, edad, síntoma inicial o especialidad..."
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] focus:border-[#43866B] focus:bg-white rounded-xl pl-10 pr-8 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Borrar búsqueda"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#718078] hover:text-[#263A32] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="md:col-span-5">
                  <HospitalSelect
                    variant="compact"
                    panelTitle="Filtrar por Especialidad"
                    searchable
                    searchPlaceholder="Buscar especialidad..."
                    value={specialtyFilter}
                    onChange={(val) => setSpecialtyFilter(val as Specialty | 'all')}
                    options={[
                      { value: 'all', label: 'Todas las especialidades' },
                      ...SPECIALTIES.filter((s) => s.id !== 'aleatorio').map((s) => ({
                        value: s.id,
                        label: s.name,
                      })),
                    ]}
                  />
                </div>
              </div>

              {/* Interactive Segmented Filters: Origin, Status, Level */}
              <div className="space-y-2 pt-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#718078] mr-1">Origen:</span>
                  {(
                    [
                      { id: 'all', label: 'Todos' },
                      { id: 'common', label: `Comunes (${originCounts.common})` },
                      { id: 'rare', label: `Poco frecuentes (${originCounts.rare})` },
                      { id: 'foreign', label: `Extranjeros (${originCounts.foreign})` },
                      ...(customCases.length > 0
                        ? [{ id: 'custom_only', label: `Mis Casos (${customCases.length})` }]
                        : []),
                    ] as Array<{ id: OriginFilter; label: string }>
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOriginFilter(f.id)}
                      className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                        originFilter === f.id
                          ? 'bg-[#43866B] text-white shadow-xs'
                          : 'bg-[#F8FBF9] border border-[#E2EAE4] text-[#55685F] hover:border-[#72A98A] hover:text-[#263A32]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#718078] mr-1">Estado:</span>
                    {(
                      [
                        { id: 'all', label: 'Todos' },
                        { id: 'unsolved', label: 'No resueltos' },
                        { id: 'solved', label: 'Resueltos' },
                        { id: 'review', label: 'A reforzar (<70 pts)' },
                      ] as Array<{ id: CompletionFilter; label: string }>
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setCompletionFilter(s.id)}
                        className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          completionFilter === s.id
                            ? 'bg-[#263A32] text-white shadow-xs'
                            : 'bg-[#F8FBF9] border border-[#E2EAE4] text-[#55685F] hover:border-[#72A98A] hover:text-[#263A32]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#718078] mr-1">Nivel:</span>
                    {(
                      [
                        { id: 'all', label: 'Todos' },
                        { id: 'outpatient', label: 'Consulta Externa' },
                        { id: 'principiante', label: 'Principiante' },
                        { id: 'medico_general', label: 'Médico General' },
                        { id: 'complex', label: 'Urgencias / Complejos' },
                      ] as Array<{ id: ModeScopeFilter; label: string }>
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPresetFilter(f.id)}
                        className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          presetFilter === f.id
                            ? 'bg-[#43866B] text-white shadow-xs'
                            : 'bg-[#F8FBF9] border border-[#E2EAE4] text-[#55685F] hover:border-[#72A98A] hover:text-[#263A32]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredPresets.length === 0 ? (
                <div className="rounded-xl border border-[#E2EAE4] bg-[#F8FBF9] p-8 text-center space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-[#263A32]">
                    No se encontraron casos con los filtros seleccionados.
                  </p>
                  <button
                    type="button"
                    onClick={resetPresetFilters}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Mostrar todos los casos</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPresets.map((preset) => {
                    const origin = getCaseOrigin(preset);
                    const perf = performanceByCaseId.get(preset.id);
                    const isSolved = completedSet.has(preset.id) || Boolean(perf);
                    const needsReview = Boolean(
                      perf && (perf.bestScore < 70 || perf.hasSafetyError)
                    );

                    return (
                      <div
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.id)}
                        className="p-4 rounded-xl bg-[#F8FBF9] border border-[#E2EAE4] hover:border-[#43866B] hover:bg-white transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#55685F]">
                            <span className="text-[#43866B]">{getSpecialtyLabel(preset.specialty)}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-sky-700">{getModeLabel(preset.mode)}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#263A32]">
                              {preset.solution.optimalTreatment.hospitalizationDecision === 'Ambulatorio'
                                ? 'Consulta Externa'
                                : 'Atención Hospitalaria / Urgencias'}
                            </span>
                            {origin === 'rare' && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-amber-700">Poco frecuente</span>
                              </>
                            )}
                            {origin === 'foreign' && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-sky-800">Caso extranjero</span>
                              </>
                            )}
                            {origin === 'custom_only' && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-amber-700">Caso Local</span>
                              </>
                            )}
                            {isSolved && (
                              <>
                                <span aria-hidden="true">·</span>
                                {needsReview ? (
                                  <span className="inline-flex items-center gap-1 text-amber-800 tabular-nums">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    A reforzar ({perf?.bestScore ?? 0}/100)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-emerald-700 tabular-nums">
                                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    {perf ? `Completado · Mejor ${perf.bestScore}/100` : 'Completado'}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[#263A32] mt-1 group-hover:text-[#43866B] transition-colors">
                            {preset.patientInfo.name} (<span className="tabular-nums">{preset.patientInfo.age}</span> años, {preset.patientInfo.sex})
                          </h4>
                          <p className="text-xs text-[#55685F] mt-1 line-clamp-2 italic">
                            "{preset.patientInfo.consultReason}"
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-[#43866B] group-hover:text-[#356D56]">
                          {preset.clinicalMetadata?.isCustom && onDeleteCustomCase && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void onDeleteCustomCase(preset.id);
                              }}
                              className="min-w-[40px] min-h-[40px] p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer flex items-center justify-center"
                              title="Eliminar caso local"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <span className="whitespace-nowrap">{isSolved ? 'Reintentar' : 'Cargar Caso'}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateLocalCase} className="space-y-4 text-xs">
              <div className="bg-[#E4F1E8]/60 border border-[#72A98A]/50 rounded-xl p-4 space-y-1">
                <h4 className="font-bold text-[#1F4B3A] text-sm">Agregar Caso Clínico a la Biblioteca Offline</h4>
                <p className="text-[#55685F] text-[11px]">
                  Los casos guardados aquí se almacenan en IndexedDB en tu dispositivo y quedan disponibles sin conexión.
                </p>
              </div>

              {saveError && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl px-3.5 py-2.5 text-rose-800 font-medium">
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Nombre del paciente *</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="Ej. Luis Herrera Gómez"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Edad (años)</label>
                  <input
                    type="number"
                    min={0}
                    max={110}
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Sexo</label>
                  <HospitalSelect
                    panelTitle="Sexo del Paciente"
                    value={newSex}
                    onChange={(val) => setNewSex(val as 'Masculino' | 'Femenino')}
                    options={[
                      { value: 'Masculino', label: 'Masculino' },
                      { value: 'Femenino', label: 'Femenino' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    min={2}
                    max={250}
                    step="0.1"
                    value={newWeightKg}
                    onChange={(e) => setNewWeightKg(e.target.value)}
                    placeholder="Ej. 70"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Talla (cm)</label>
                  <input
                    type="number"
                    min={40}
                    max={230}
                    value={newHeightCm}
                    onChange={(e) => setNewHeightCm(e.target.value)}
                    placeholder="Ej. 168"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Especialidad</label>
                  <HospitalSelect
                    panelTitle="Especialidad del Caso"
                    searchable
                    searchPlaceholder="Buscar especialidad..."
                    value={newSpecialty}
                    onChange={(val) => setNewSpecialty(val as any)}
                    options={SPECIALTIES.filter((s) => s.id !== 'aleatorio').map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Dificultad / Modalidad</label>
                  <HospitalSelect
                    panelTitle="Modalidad del Caso"
                    value={newMode}
                    onChange={(val) => setNewMode(val as GameMode)}
                    options={MODES.map((m) => ({
                      value: m.id,
                      label: m.short,
                      description: m.desc,
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#263A32] font-semibold mb-1">Motivo de consulta *</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Ej. Dolor torácico opresivo de 2 horas de evolución"
                  className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#263A32] font-semibold mb-1">Enfermedad actual (historia clínica para el paciente virtual) *</label>
                <textarea
                  rows={3}
                  value={newIllness}
                  onChange={(e) => setNewIllness(e.target.value)}
                  placeholder="Describe inicio, localización, intensidad, irradiación y síntomas asociados..."
                  className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Diagnóstico definitivo (oculto en simulación) *</label>
                  <input
                    type="text"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    placeholder="Ej. Pielonefritis aguda no complicada"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Diferenciales (separados por coma)</label>
                  <input
                    type="text"
                    value={newDifferentials}
                    onChange={(e) => setNewDifferentials(e.target.value)}
                    placeholder="Ej. Litiasis renal, Cistitis aguda"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Fármaco esperado</label>
                  <input
                    type="text"
                    value={newDrug}
                    onChange={(e) => setNewDrug(e.target.value)}
                    placeholder="Ej. Ceftriaxona"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Dosis esperada</label>
                  <input
                    type="text"
                    value={newDose}
                    onChange={(e) => setNewDose(e.target.value)}
                    placeholder="Ej. 1 g IV cada 24 h"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Fuente / Guía clínica</label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#263A32] font-semibold mb-1">Error frecuente / Alerta de seguridad</label>
                  <input
                    type="text"
                    value={newAlert}
                    onChange={(e) => setNewAlert(e.target.value)}
                    placeholder="Ej. No retrasar antibioticoterapia en sepsis"
                    className="w-full min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 bg-[#43866B] hover:bg-[#356D56] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Guardar Caso en Biblioteca Offline</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === 'custom' && (
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#F8FBF9] border-t border-[#E2EAE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] sm:text-xs text-[#55685F] text-center sm:text-left">
              <span className="text-[#718078] font-semibold">Selección:</span>{' '}
              <span className="text-[#263A32] font-bold">{selectedModeObj?.short}</span> ·{' '}
              <span className="text-[#43866B] font-bold">{selectedSpecObj?.name}</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#43866B] hover:bg-[#356D56] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white shrink-0" />
                  <span>Generando Paciente...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white shrink-0" />
                  <span>Comenzar Simulación</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
