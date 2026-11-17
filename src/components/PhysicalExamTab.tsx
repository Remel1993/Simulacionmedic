import React, { useState } from 'react';
import { ClinicalCase, PhysicalExamFinding, VitalSigns } from '../types/clinical';
import {
  Stethoscope,
  CheckCircle2,
  Eye,
  HeartPulse,
  Wind,
  Brain,
  UserRound,
  Hand,
  LayoutGrid,
  ClipboardList,
  Activity,
  AlertTriangle,
  Sparkles,
  Skull,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PhysicalExamTabProps {
  caseData: ClinicalCase;
  unlockedExamIds: string[];
  onUnlockExam: (examId: string) => void;
  onUnlockAllExams: () => void;
  liveExams?: PhysicalExamFinding[];
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
}

function getSystemIcon(system: string, className = 'w-4 h-4 shrink-0') {
  switch (system) {
    case 'todos':
      return <LayoutGrid className={className} />;
    case 'General':
      return <UserRound className={className} />;
    case 'Cabeza y Cuello':
      return <Eye className={className} />;
    case 'Tórax y Pulmones':
      return <Wind className={className} />;
    case 'Cardiovascular':
      return <HeartPulse className={className} />;
    case 'Abdomen':
      return <Activity className={className} />;
    case 'Neurológico':
      return <Brain className={className} />;
    case 'Osteomuscular y Piel':
      return <Hand className={className} />;
    default:
      return <Stethoscope className={className} />;
  }
}

export const PhysicalExamTab: React.FC<PhysicalExamTabProps> = ({
  caseData,
  unlockedExamIds,
  onUnlockExam,
  onUnlockAllExams,
  liveExams,
  liveVitals,
  isDeceased = false,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'unlocked'>('all');
  const [trayExpanded, setTrayExpanded] = useState(false);

  const systems = [
    'todos',
    'General',
    'Cabeza y Cuello',
    'Tórax y Pulmones',
    'Cardiovascular',
    'Abdomen',
    'Neurológico',
    'Osteomuscular y Piel',
  ];

  const examPool = liveExams || caseData.physicalExamPool;
  const unlockedExams = examPool.filter((pe) => unlockedExamIds.includes(pe.id));

  const filteredPool = examPool.filter((pe) => {
    const matchesSystem = selectedSystem === 'todos' || pe.system === selectedSystem;
    const isUnlocked = unlockedExamIds.includes(pe.id);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unlocked' && isUnlocked) ||
      (statusFilter === 'pending' && !isUnlocked);
    return matchesSystem && matchesStatus;
  });

  const isExamMode = caseData.mode === 'examen';
  const showAbnormalColorCue = caseData.mode === 'principiante';
  const totalPoolCount = examPool.length;
  const unlockedCount = unlockedExams.length;
  const pendingCount = Math.max(0, totalPoolCount - unlockedCount);
  const hasLiveEvents = isDeceased || examPool.some((pe) => Boolean(pe.liveStatus));

  const jumpToExamCard = (examId: string) => {
    setSelectedSystem('todos');
    setStatusFilter('all');
    window.setTimeout(() => {
      document.getElementById(`exam-card-${examId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 40);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header and stats */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#43866B] shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
                Exploración Física & Maniobras Semiológicas
              </h2>
            </div>
            <p className="text-xs text-[#55685F] mt-1 leading-relaxed">
              {isExamMode
                ? 'Modo Examen: seleccione manualmente únicamente las maniobras pertinentes e interprete los hallazgos de forma objetiva.'
                : showAbnormalColorCue
                  ? 'Aprendizaje Guiado: ejecute las maniobras dirigidas a los sistemas pertinentes y analice los signos clínicos.'
                  : 'Lectura semiológica objetiva: priorice las maniobras dirigidas a los sistemas sospechosos e interprete directamente el hallazgo sin alertas de color.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="text-xs text-[#55685F] font-medium">
              Exploradas: <span className="font-mono tabular-nums text-[#263A32] font-bold">{unlockedCount}</span> / {totalPoolCount}
            </div>
            {!isExamMode && (
              <button
                onClick={onUnlockAllExams}
                className="w-full sm:w-auto min-h-[40px] px-3.5 py-2 text-xs font-semibold text-[#1F4B3A] bg-[#E4F1E8] hover:bg-[#D4E8DA] border border-[#72A98A] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ClipboardList className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                <span>Explorar Todo el Cuerpo</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time clinical status banner */}
        {hasLiveEvents && (
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
                  ? 'Registro post-paro / asistolia: la exploración física refleja el estado terminal actual del paciente (sin pulso ni respiraciones).'
                  : 'Reevaluación en tiempo real activa: las maniobras desbloqueadas y nuevas exploraciones reflejan cambios fisiológicos, fármacos STAT o eventos adversos actuales.'}
              </span>
            </div>
            {liveVitals && (
              <span className="font-mono tabular-nums text-[11px] font-semibold text-[#263A32] shrink-0">
                PA {liveVitals.bloodPressure} · FC {liveVitals.heartRate} · SpO₂ {liveVitals.oxygenSaturation}% · Glasgow {liveVitals.glasgow}/15
              </span>
            )}
          </div>
        )}

        {/* Status Filter + System Filter Segmented Tabs */}
        <div className="mt-4 pt-3 border-t border-[#E2EAE4] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: `Todas (${totalPoolCount})` },
                { id: 'pending', label: `Pendientes (${pendingCount})` },
                { id: 'unlocked', label: `Exploradas (${unlockedCount})` },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id as 'all' | 'pending' | 'unlocked')}
                  className={`min-h-[34px] px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {systems.map((sys) => (
              <button
                key={sys}
                onClick={() => setSelectedSystem(sys)}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedSystem === sys
                    ? 'bg-[#43866B] text-white font-semibold shadow-xs'
                    : 'bg-[#F8FBF9] hover:bg-[#E4F1E8] text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4]'
                }`}
              >
                {getSystemIcon(sys, 'w-3.5 h-3.5 shrink-0')}
                <span>{sys === 'todos' ? 'Todos los Sistemas' : sys}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick-Review Tray of Already Documented Findings */}
      {unlockedExams.length > 0 && (
        <div className="bg-[#F8FBF9] border border-[#CFE4D6] rounded-2xl px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F4B3A]">
              <CheckCircle2 className="w-4 h-4 text-[#43866B] shrink-0" />
              <span>Maniobras Documentadas ({unlockedExams.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setTrayExpanded((v) => !v)}
              className="text-[11px] font-semibold text-[#43866B] hover:text-[#1F4B3A] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{trayExpanded ? 'Ocultar resumen' : 'Ver resumen rápido'}</span>
              {trayExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {unlockedExams.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => jumpToExamCard(ex.id)}
                className="min-h-[30px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#E4F1E8] border border-[#CFE4D6] text-[11px] font-semibold text-[#263A32] transition-colors cursor-pointer truncate max-w-full sm:max-w-[240px]"
                title={`Ir a ${ex.name}`}
              >
                {ex.name}
              </button>
            ))}
          </div>

          {trayExpanded && (
            <div className="pt-2 border-t border-[#DDE8E0] space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {unlockedExams.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white border border-[#E2EAE4] rounded-xl px-3 py-2 text-xs"
                >
                  <div className="font-bold text-[#1F4B3A]">
                    {ex.system} · {ex.name}
                  </div>
                  <p className="text-[#263A32] mt-0.5 leading-snug">{ex.finding}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid of Physical Exams */}
      {filteredPool.length === 0 ? (
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-6 text-center text-xs text-[#55685F] space-y-2">
          <p>No hay maniobras que coincidan con el filtro seleccionado.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSystem('todos');
              setStatusFilter('all');
            }}
            className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-[#43866B] text-white font-semibold cursor-pointer"
          >
            Mostrar todas las maniobras
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredPool.map((exam: PhysicalExamFinding) => {
            const isUnlocked = unlockedExamIds.includes(exam.id);
            const liveTag = exam.liveStatus;
            const cardBorderClass = !isUnlocked
              ? 'bg-white border-[#E2EAE4] hover:border-[#72A98A]'
              : !isExamMode && (liveTag === 'iatrogenia' || liveTag === 'critico')
                ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                : !isExamMode && liveTag === 'mejoria'
                  ? 'bg-[#F8FBF9] border-[#72A98A] shadow-xs'
                  : showAbnormalColorCue && exam.isAbnormal
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : 'bg-white border-[#72A98A] shadow-xs';

            return (
              <div
                key={exam.id}
                id={`exam-card-${exam.id}`}
                className={`rounded-2xl border transition-all ${cardBorderClass}`}
              >
                <div className="p-4 sm:p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#E4F1E8] border border-[#72A98A]/50 flex items-center justify-center text-[#43866B] shrink-0">
                          {getSystemIcon(exam.system, 'w-3.5 h-3.5')}
                        </span>
                        <span className="text-[11px] font-semibold text-[#55685F]">
                          {exam.system}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isUnlocked && liveTag && (
                          isExamMode ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                              Actualizado en vivo
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
                              <span>{exam.liveUpdateNote || 'Reevaluado en vivo'}</span>
                            </span>
                          )
                        )}
                        {isUnlocked && (
                          <span className="text-[10px] font-semibold text-[#1F4B3A]">
                            Explorado
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#263A32] mb-2">{exam.name}</h3>

                    {isUnlocked ? (
                      <div className="space-y-2 mt-2">
                        <p className="text-xs sm:text-sm text-[#263A32] leading-relaxed font-sans bg-[#F8FBF9] p-3 rounded-xl border border-[#E2EAE4]">
                          {exam.finding}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#718078] italic mt-1">
                        Maniobra pendiente. Toque para examinar al paciente y documentar el hallazgo actual.
                      </p>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="mt-4 pt-3 border-t border-[#E2EAE4] flex items-center justify-end">
                    {isUnlocked ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#43866B] font-semibold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Explorado y documentado</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onUnlockExam(exam.id)}
                        className="w-full sm:w-auto min-h-[40px] px-4 py-2 bg-[#43866B] hover:bg-[#356D56] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {getSystemIcon(exam.system, 'w-3.5 h-3.5 shrink-0')}
                        <span>Realizar Exploración</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
