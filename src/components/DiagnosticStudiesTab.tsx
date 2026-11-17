import React, { useState } from 'react';
import { ClinicalCase, ComplementaryStudy, VitalSigns } from '../types/clinical';
import { HOSPITAL_SUBCATEGORY_ORDER } from '../utils/studiesCatalog';
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
  const [searchFilter, setSearchFilter] = useState('');

  const SUBCATEGORY_ORDER = HOSPITAL_SUBCATEGORY_ORDER;
  const studiesPool = liveStudies || caseData.studiesPool;
  const effectiveVitals = liveVitals || caseData.vitalSigns;

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
  };

  const filteredPool = categoryScopedStudies.filter((std) => {
    const matchesSubcategory =
      selectedSubcategory === 'Todas' || std.subcategory === selectedSubcategory;
    const matchesSearch =
      std.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      std.subcategory.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSubcategory && matchesSearch;
  });

  const isExamMode = caseData.mode === 'examen';
  const totalStudies = studiesPool.length;
  const unlockedCount = studiesPool.filter((s) => unlockedStudyIds.includes(s.id)).length;
  const hasLiveStudies = isDeceased || studiesPool.some((s) => Boolean(s.liveStatus));

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
    <div className="space-y-4 sm:space-y-6">
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
                : 'Solicite únicamente los estudios complementarios pertinentes y justificados para confirmar o descartar sus hipótesis diagnósticas.'}
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

        {/* Category & Search controls */}
        <div className="mt-4 pt-3 border-t border-[#E2EAE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
            <Search className="w-3.5 h-3.5 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar estudio o prueba..."
              className="w-full min-h-[38px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg pl-8 pr-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
            />
          </div>
        </div>

        {/* Subcategory Quick Filters */}
        {availableSubcategories.length > 1 && (
          <div className="mt-2.5 pt-2.5 border-t border-[#E2EAE4] flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <span className="text-[11px] font-semibold text-[#55685F] shrink-0 mr-1">
              Área:
            </span>
            <button
              onClick={() => setSelectedSubcategory('Todas')}
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
                  onClick={() => setSelectedSubcategory(sub)}
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

      {/* Studies Cards Grid */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredPool.length === 0 ? (
          <div className="bg-white border border-[#E2EAE4] rounded-2xl p-8 text-center text-[#55685F] text-xs space-y-2.5">
            <p>No se encontraron estudios que coincidan con los criterios de búsqueda o subcategoría.</p>
            {(selectedCategory !== 'Todos' || selectedSubcategory !== 'Todas' || searchFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedSubcategory('Todas');
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
            const cardBorderClass = !isUnlocked
              ? 'bg-white border-[#E2EAE4] hover:border-[#72A98A]'
              : !isExamMode && (liveTag === 'iatrogenia' || liveTag === 'critico')
              ? 'bg-rose-50/40 border-rose-300 shadow-xs'
              : !isExamMode && liveTag === 'mejoria'
              ? 'bg-[#F8FBF9] border-[#72A98A] shadow-xs'
              : !isExamMode && study.isAbnormal
              ? 'bg-amber-50/40 border-amber-300 shadow-xs'
              : 'bg-white border-[#72A98A] shadow-xs';

            return (
              <div
                key={study.id}
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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#55685F]">
                            {study.category} · {study.subcategory}
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
                          {isUnlocked && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E4F1E8] text-[#1F4B3A] border border-[#72A98A]/60">
                              Reporte Emitido
                            </span>
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
