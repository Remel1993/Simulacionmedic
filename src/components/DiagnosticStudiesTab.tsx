import React, { useRef, useState } from 'react';
import { ClinicalCase, ComplementaryStudy, VitalSigns } from '../types/clinical';
import { HOSPITAL_SUBCATEGORY_ORDER } from '../utils/studiesCatalog';
import {
  getContextualStudyReferenceNote,
  getStudyResourceProfile,
} from '../utils/clinicalContext';
import { StudyTracingViewer } from './StudyTracingViewer';
import {
  FlaskConical,
  ImageIcon,
  Activity,
  CheckCircle2,
  Search,
  ChevronRight,
  Microscope,
  HeartPulse,
  Droplets,
  Scan,
  Bone,
  Waves,
  Wind,
  Beaker,
  TestTube2,
  LayoutGrid,
  ListChecks,
  Zap,
  Sparkles,
  Eye,
  AlertTriangle,
  Skull,
  ArrowUp,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DiagnosticStudiesTabProps {
  caseData: ClinicalCase;
  unlockedStudyIds: string[];
  onUnlockStudy: (studyId: string) => void;
  onUnlockAllStudies: () => void;
  liveStudies?: ComplementaryStudy[];
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
}

function getStudyIcon(study: ComplementaryStudy, className = 'w-4 h-4 shrink-0') {
  switch (study.subcategory) {
    case 'Microbiología / Serología':
      return <Microscope className={className} />;
    case 'Cardiovascular':
    case 'Electrocardiograma':
      return <HeartPulse className={className} />;
    case 'Hematología':
    case 'Inflamación e Infección':
      return <Droplets className={className} />;
    case 'Tomografía':
      return <Scan className={className} />;
    case 'Radiología':
      return <Bone className={className} />;
    case 'Ecografía':
      return <Waves className={className} />;
    case 'Gases':
      return <Wind className={className} />;
    case 'Urinario':
      return <Beaker className={className} />;
    case 'Bioquímica':
    case 'Electrolitos':
    case 'Función Hepática':
      return <TestTube2 className={className} />;
    case 'Vitaminas y Nutrición':
      return <Sparkles className={className} />;
    case 'Electromiografía y Neurofisiología':
      return <Zap className={className} />;
    case 'Función Pulmonar y Audiología':
      return <Wind className={className} />;
    case 'Endoscopia y Broncoscopia':
      return <Eye className={className} />;
    default:
      if (study.category === 'Imagen') return <ImageIcon className={className} />;
      if (study.category === 'Gabinete y Trazados') return <Activity className={className} />;
      return <FlaskConical className={className} />;
  }
}

export const DiagnosticStudiesTab: React.FC<DiagnosticStudiesTabProps> = ({
  caseData,
  unlockedStudyIds,
  onUnlockStudy,
  onUnlockAllStudies,
  liveStudies,
  liveVitals,
  isDeceased = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados'>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todas');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'unlocked'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [trayExpanded, setTrayExpanded] = useState(false);
  const studiesListRef = useRef<HTMLDivElement>(null);

  const scrollStudiesToTop = () => {
    studiesListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SUBCATEGORY_ORDER = HOSPITAL_SUBCATEGORY_ORDER;
  const studiesPool = liveStudies || caseData.studiesPool;
  const effectiveVitals = liveVitals || caseData.vitalSigns;
  const unlockedStudies = studiesPool.filter((s) => unlockedStudyIds.includes(s.id));

  const SUBCATEGORY_SHORT_LABEL: Record<string, string> = {
    Gases: 'Gasometría',
    Hematología: 'Hematología',
    Bioquímica: 'Bioquímica',
    Electrolitos: 'Electrolitos',
    'Función Hepática': 'Perfil Hepático',
    'Inflamación e Infección': 'PCR / VSG',
    'Vitaminas y Nutrición': 'Vitaminas',
    Cardiovascular: 'Cardíacos',
    Urinario: 'Orina / EGO',
    'Microbiología / Serología': 'Microbiología',
    Radiología: 'Radiografías',
    Ecografía: 'Ultrasonido',
    Tomografía: 'TAC / RMN',
    Electrocardiograma: 'ECG / Holter / MAPA',
    'Electromiografía y Neurofisiología': 'EEG / EMG / Neurofisiología',
    'Función Pulmonar y Audiología': 'Espirometría / ORL',
    'Endoscopia y Broncoscopia': 'Endoscopia / Broncoscopia',
  };

  const categoryScopedStudies = studiesPool.filter(
    (std) => selectedCategory === 'Todos' || std.category === selectedCategory
  );

  const availableSubcategories = SUBCATEGORY_ORDER.filter((sub) =>
    categoryScopedStudies.some((std) => std.subcategory === sub)
  );

  const handleSelectCategory = (cat: 'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados') => {
    setSelectedCategory(cat);
    setSelectedSubcategory('Todas');
    scrollStudiesToTop();
  };

  const filteredPool = categoryScopedStudies.filter((std) => {
    const matchesSubcategory =
      selectedSubcategory === 'Todas' || std.subcategory === selectedSubcategory;
    const matchesSearch =
      std.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      std.subcategory.toLowerCase().includes(searchFilter.toLowerCase());
    const isUnlocked = unlockedStudyIds.includes(std.id);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unlocked' && isUnlocked) ||
      (statusFilter === 'pending' && !isUnlocked);
    return matchesSubcategory && matchesSearch && matchesStatus;
  });

  const isExamMode = caseData.mode === 'examen';
  const showAbnormalColorCue = caseData.mode === 'principiante';
  const totalStudies = studiesPool.length;
  const unlockedCount = unlockedStudies.length;
  const pendingCount = Math.max(0, totalStudies - unlockedCount);
  const hasLiveStudies = isDeceased || studiesPool.some((s) => Boolean(s.liveStatus));

  const jumpToStudyCard = (studyId: string) => {
    setSelectedCategory('Todos');
    setSelectedSubcategory('Todas');
    setStatusFilter('all');
    setSearchFilter('');
    window.setTimeout(() => {
      document.getElementById(`study-card-${studyId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 50);
  };

  const categoryTabs: Array<{
    id: 'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados';
    icon: React.ReactNode;
  }> = [
    { id: 'Todos', icon: <LayoutGrid className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'Laboratorio', icon: <FlaskConical className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'Imagen', icon: <Scan className="w-3.5 h-3.5 shrink-0" /> },
    { id: 'Gabinete y Trazados', icon: <HeartPulse className="w-3.5 h-3.5 shrink-0" /> },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Bar */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#43866B] shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
                Laboratorio Clínico, Gabinete e Imagen
              </h2>
            </div>
            <p className="text-xs text-[#55685F] mt-1 leading-relaxed">
              {isExamMode
                ? 'Modo Examen: solicite de forma individual únicamente los estudios justificados e interprete los resultados sin alertas de color.'
                : showAbnormalColorCue
                  ? 'Aprendizaje Guiado: solicite los estudios pertinentes para confirmar o descartar su hipótesis diagnóstica.'
                  : 'Lectura paraclínica objetiva: solicite únicamente pruebas con justificación pre-test e interprete cifras y trazados sin ayudas de color.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="text-xs text-[#55685F] font-medium">
              Solicitados: <span className="font-mono tabular-nums text-[#263A32] font-bold">{unlockedCount}</span> / {totalStudies}
            </div>
            {!isExamMode && (
              <button
                onClick={onUnlockAllStudies}
                className="w-full sm:w-auto min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#1F4B3A] bg-[#E4F1E8] hover:bg-[#D4E8DA] border border-[#72A98A] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ListChecks className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                <span>Solicitar Batería Completa</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Lab & Gabinete Sync Banner */}
        {hasLiveStudies && (
          <div
            className={`mt-3 rounded-xl border px-3.5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 ${
              isDeceased
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-sky-50 border-sky-200 text-sky-900'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {isDeceased ? (
                <Skull className="w-4 h-4 text-rose-700 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-sky-700 shrink-0" />
              )}
              <span>
                {isDeceased
                  ? 'Monitor y laboratorio en paro cardiorrespiratorio: el ECG muestra asistolia isoeléctrica y los paneles analíticos reflejan los trastornos letales ocurridos.'
                  : 'Laboratorio, gasometría y trazados sincronizados en tiempo real con la evolución clínica, glucemia, fármacos STAT y posibles eventos iatrogénicos.'}
              </span>
            </div>
            <span className="font-mono tabular-nums text-[11px] font-semibold text-[#263A32] shrink-0">
              Gluc {effectiveVitals.bloodGlucose} mg/dL · FC {effectiveVitals.heartRate} lpm · SpO₂ {effectiveVitals.oxygenSaturation}%
            </span>
          </div>
        )}

        {/* Category, Status & Search controls */}
        <div className="mt-4 pt-3 border-t border-[#E2EAE4] space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#43866B] text-white font-semibold shadow-xs'
                      : 'bg-[#F8FBF9] text-[#55685F] hover:text-[#263A32] hover:bg-[#E4F1E8] border border-[#E2EAE4]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.id}</span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  scrollStudiesToTop();
                }}
                placeholder="Buscar estudio o prueba..."
                className="w-full min-h-[38px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg pl-8 pr-8 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchFilter('');
                    scrollStudiesToTop();
                  }}
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md text-[#718078] hover:text-[#263A32] hover:bg-[#E4F1E8] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `Todos (${totalStudies})` },
              { id: 'pending', label: `Pendientes (${pendingCount})` },
              { id: 'unlocked', label: `Solicitados (${unlockedCount})` },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setStatusFilter(st.id as 'all' | 'pending' | 'unlocked');
                  scrollStudiesToTop();
                }}
                className={`min-h-[32px] px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-[#1F4B3A] text-white'
                    : 'bg-[#F8FBF9] text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Quick Filters */}
        {availableSubcategories.length > 1 && (
          <div className="mt-2.5 pt-2.5 border-t border-[#E2EAE4] flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-[11px] font-semibold text-[#55685F] shrink-0 mr-1">
              Área:
            </span>
            <button
              onClick={() => {
                setSelectedSubcategory('Todas');
                scrollStudiesToTop();
              }}
              className={`min-h-[32px] px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedSubcategory === 'Todas'
                  ? 'bg-[#E4F1E8] text-[#1F4B3A] border border-[#72A98A] font-semibold'
                  : 'bg-[#F8FBF9] text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4]'
              }`}
            >
              Todas ({categoryScopedStudies.length})
            </button>
            {availableSubcategories.map((sub) => {
              const count = categoryScopedStudies.filter((s) => s.subcategory === sub).length;
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubcategory(sub);
                    scrollStudiesToTop();
                  }}
                  className={`min-h-[32px] px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#E4F1E8] text-[#1F4B3A] border border-[#72A98A] font-semibold'
                      : 'bg-[#F8FBF9] text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4]'
                  }`}
                >
                  <span>{SUBCATEGORY_SHORT_LABEL[sub] || sub}</span>
                  <span className="text-[10px] font-mono opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pinned Quick-Jump Tray for Unlocked Studies */}
      {unlockedStudies.length > 0 && (
        <div className="bg-[#F8FBF9] border border-[#CFE4D6] rounded-2xl px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F4B3A]">
              <CheckCircle2 className="w-4 h-4 text-[#43866B] shrink-0" />
              <span>Estudios Solicitados ({unlockedStudies.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setTrayExpanded((v) => !v)}
              className="text-[11px] font-semibold text-[#43866B] hover:text-[#1F4B3A] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{trayExpanded ? 'Ocultar resultados rápidos' : 'Ver resumen de resultados'}</span>
              {trayExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {unlockedStudies.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => jumpToStudyCard(st.id)}
                className="min-h-[30px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#E4F1E8] border border-[#CFE4D6] text-[11px] font-semibold text-[#263A32] transition-colors cursor-pointer truncate max-w-full sm:max-w-[260px]"
                title={`Ir a ${st.name}`}
              >
                {st.name}
              </button>
            ))}
          </div>

          {trayExpanded && (
            <div className="pt-2 border-t border-[#DDE8E0] space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {unlockedStudies.map((st) => (
                <div key={st.id} className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-2 text-xs">
                  <div className="font-bold text-[#1F4B3A]">{st.name}</div>
                  <p className="text-[#263A32] mt-0.5 leading-snug whitespace-pre-line">{st.result}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scrollable Studies List Container (keeps search/filters & bottom controls always nearby) */}
      <div className="relative">
        <div
          ref={studiesListRef}
          onScroll={(e) => setShowScrollTop(e.currentTarget.scrollTop > 140)}
          className="max-h-[56dvh] sm:max-h-[62dvh] overflow-y-auto pr-1 space-y-3.5 sm:space-y-4 scroll-smooth"
        >
        {filteredPool.length === 0 ? (
          <div className="bg-white border border-[#E2EAE4] rounded-2xl p-8 text-center text-[#55685F] text-xs space-y-2.5">
            <p>No se encontraron estudios que coincidan con los criterios de búsqueda o subcategoría.</p>
            {(selectedCategory !== 'Todos' || selectedSubcategory !== 'Todas' || searchFilter || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedSubcategory('Todas');
                  setStatusFilter('all');
                  setSearchFilter('');
                }}
                className="min-h-[38px] px-3.5 py-1.5 bg-[#43866B] hover:bg-[#356D56] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          filteredPool.map((study) => {
            const isUnlocked = unlockedStudyIds.includes(study.id);
            const liveTag = study.liveStatus;
            const resourceProfile = getStudyResourceProfile(study);
            const contextualNote = isUnlocked ? getContextualStudyReferenceNote(study, caseData) : null;

            const cardBorderClass = !isUnlocked
              ? 'bg-white border-[#E2EAE4] hover:border-[#72A98A]'
              : !isExamMode && (liveTag === 'iatrogenia' || liveTag === 'critico')
                ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                : !isExamMode && liveTag === 'mejoria'
                  ? 'bg-[#F8FBF9] border-[#72A98A] shadow-xs'
                  : showAbnormalColorCue && study.isAbnormal
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : 'bg-white border-[#72A98A] shadow-xs';

            return (
              <div
                key={study.id}
                id={`study-card-${study.id}`}
                className={`rounded-2xl border transition-all overflow-hidden ${cardBorderClass}`}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          study.category === 'Laboratorio'
                            ? 'bg-[#E4F1E8] border border-[#72A98A]/60 text-[#43866B]'
                            : study.category === 'Imagen'
                            ? 'bg-sky-50 border border-sky-200 text-sky-700'
                            : 'bg-[#F8FBF9] border border-[#E2EAE4] text-[#263A32]'
                        }`}
                      >
                        {getStudyIcon(study, 'w-4 h-4')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-[11px] font-semibold text-[#55685F]">
                            {study.category} · {study.subcategory}
                          </span>
                          <span className="text-[#CBD8CE]" aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#718078]">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{resourceProfile.turnaroundLabel}</span>
                          </span>
                          {isUnlocked && liveTag && (
                            isExamMode ? (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                                Actualizado en tiempo real
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                                  liveTag === 'iatrogenia' || liveTag === 'critico'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : liveTag === 'mejoria'
                                    ? 'bg-[#E4F1E8] text-[#1F4B3A] border-[#72A98A]'
                                    : 'bg-sky-50 text-sky-800 border-sky-200'
                                }`}
                              >
                                {(liveTag === 'iatrogenia' || liveTag === 'critico') && (
                                  <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                )}
                                {liveTag === 'mejoria' && <Sparkles className="w-2.5 h-2.5 shrink-0" />}
                                <span>{study.liveUpdateNote || 'Actualizado en vivo'}</span>
                              </span>
                            )
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#263A32] mt-0.5 break-words">
                          {study.name}
                        </h3>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#43866B] font-semibold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Reporte Disponible</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onUnlockStudy(study.id)}
                          className="w-full sm:w-auto min-h-[40px] px-4 py-2 bg-[#43866B] hover:bg-[#356D56] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {getStudyIcon(study, 'w-3.5 h-3.5 shrink-0')}
                          <span>Solicitar Estudio</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Unlocked Study Content Report + Visual Tracing */}
                  {isUnlocked && (
                    <div className="mt-4 pt-4 border-t border-[#E2EAE4] space-y-3">
                      <StudyTracingViewer study={study} vitalSigns={effectiveVitals} />

                      <div className="bg-[#F8FBF9] p-3.5 sm:p-4 rounded-xl border border-[#E2EAE4] font-mono text-xs text-[#263A32]">
                        <div className="text-[11px] text-[#43866B] font-sans font-bold mb-1">
                          Informe Oficial del Laboratorio / Gabinete:
                        </div>
                        <div className="text-xs sm:text-sm font-sans font-semibold text-[#263A32] whitespace-pre-line leading-relaxed break-words">
                          {study.result}
                        </div>

                        {study.referenceRange && (
                          <div className="mt-2.5 text-xs font-sans text-[#55685F] border-t border-[#E2EAE4] pt-2 flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-[#263A32]">Valores de Referencia:</span>
                            <span>{study.referenceRange}</span>
                          </div>
                        )}

                        {contextualNote && (
                          <div className="mt-2 text-[11px] font-sans text-[#1F4B3A] bg-[#E4F1E8]/60 border border-[#CFE4D6] rounded-lg px-2.5 py-1.5">
                            {contextualNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
          {filteredPool.length > 5 && (
            <div className="flex justify-center pt-1 pb-2">
              <button
                type="button"
                onClick={scrollStudiesToTop}
                className="min-h-[36px] px-4 py-1.5 rounded-xl bg-[#F8FBF9] hover:bg-[#E4F1E8] border border-[#E2EAE4] hover:border-[#72A98A] text-xs font-semibold text-[#1F4B3A] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#43866B]" />
                <span>Volver arriba al buscador</span>
              </button>
            </div>
          )}
        </div>

        {showScrollTop && (
          <button
            type="button"
            onClick={scrollStudiesToTop}
            aria-label="Volver arriba al buscador de estudios"
            className="absolute bottom-3 right-3 z-10 min-h-[36px] px-3 py-1.5 rounded-full bg-[#1F5E4B] hover:bg-[#174E3E] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 cursor-pointer transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5 shrink-0" />
            <span>Subir</span>
          </button>
        )}
      </div>
    </div>
  );
};
