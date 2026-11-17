import React, { useState, useRef, useEffect } from 'react';
import { ClinicalCase, SavedCaseRecord, Specialty } from '../types/clinical';
import { ALL_CURATED_CASES } from '../data/allCases';
import {
  X,
  History,
  Trophy,
  Award,
  Trash2,
  Calendar,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Layers,
  Target,
  RotateCcw,
} from 'lucide-react';

interface CaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedCaseRecord[];
  onClearHistory: () => void;
  onReviewCase: (record: SavedCaseRecord) => void;
  onRetryCase?: (record: SavedCaseRecord) => void;
  customCases?: ClinicalCase[];
}

const SPECIALTY_LABELS: Record<Specialty, string> = {
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

const MODE_LABELS: Record<string, string> = {
  principiante: 'Principiante',
  medico_general: 'Médico General',
  residente: 'Residente',
  urgencias: 'Urgencias',
  examen: 'Modo Examen',
};

function getScoreBarTone(score: number): string {
  if (score >= 90) return 'bg-[#43866B]';
  if (score >= 75) return 'bg-[#72A98A]';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getScoreTextTone(score: number): string {
  if (score >= 90) return 'text-[#1F4B3A]';
  if (score >= 75) return 'text-[#43866B]';
  if (score >= 60) return 'text-amber-700';
  return 'text-rose-700';
}

export const CaseHistoryModal: React.FC<CaseHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onReviewCase,
  onRetryCase,
  customCases = [],
}) => {
  const [activeView, setActiveView] = useState<'list' | 'analytics'>('list');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, activeView]);

  if (!isOpen) return null;

  const averageScore =
    history.length > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
      : 0;

  const excellentCount = history.filter((h) => h.score >= 90).length;

  const libraryBySpecialty = [...customCases, ...ALL_CURATED_CASES].reduce<
    Record<string, Set<string>>
  >((acc, c) => {
    if (!acc[c.specialty]) acc[c.specialty] = new Set();
    acc[c.specialty].add(c.id);
    return acc;
  }, {});

  // Aggregate scores by specialty (including unique library coverage)
  const specialtyStats = Object.values(
    history.reduce<
      Record<
        string,
        {
          specialty: Specialty;
          label: string;
          count: number;
          uniqueIds: Set<string>;
          total: number;
          best: number;
          latest: number;
        }
      >
    >((acc, rec) => {
      const key = rec.specialty || 'medicina_interna';
      if (!acc[key]) {
        acc[key] = {
          specialty: key,
          label: SPECIALTY_LABELS[key] || key.replace('_', ' '),
          count: 0,
          uniqueIds: new Set<string>(),
          total: 0,
          best: 0,
          latest: rec.score,
        };
      }
      acc[key].count += 1;
      if (rec.caseId) acc[key].uniqueIds.add(rec.caseId);
      acc[key].total += rec.score;
      acc[key].best = Math.max(acc[key].best, rec.score);
      return acc;
    }, {})
  )
    .map((item) => {
      const librarySet = libraryBySpecialty[item.specialty];
      const uniqueSolvedInLib = librarySet
        ? Array.from(item.uniqueIds).filter((id) => librarySet.has(id)).length
        : item.uniqueIds.size;
      const libraryTotal = librarySet ? librarySet.size : item.uniqueIds.size;
      return {
        ...item,
        uniqueSolved: uniqueSolvedInLib,
        libraryTotal,
        avg: Math.round(item.total / item.count),
      };
    })
    .sort((a, b) => b.avg - a.avg || b.count - a.count);

  const strongestSpecialty = specialtyStats.length > 0 ? specialtyStats[0] : null;
  const weakestSpecialty =
    specialtyStats.length > 1 ? specialtyStats[specialtyStats.length - 1] : null;

  // Chronological progression (last 10 cases oldest -> newest)
  const recentChronological = [...history].slice(0, 10).reverse();

  // Rubric competency averages (differentialDiagnoses shown only when ECOE cases exist)
  const hasEcoeHistory = history.some(
    (h) => h.mode === 'examen' && !h.evaluation?.expressDiagnosticOnly && h.evaluation?.breakdown
  );

  const rubricDomains = [
    { key: 'anamnesis' as const, label: 'Anamnesis', max: 15 },
    { key: 'physicalExam' as const, label: 'Examen Físico', max: 15 },
    { key: 'studiesInterpretation' as const, label: 'Estudios', max: 15 },
    { key: 'primaryDiagnosis' as const, label: 'Diagnóstico', max: 25 },
    ...(hasEcoeHistory
      ? [{ key: 'differentialDiagnoses' as const, label: 'Diferenciales (ECOE)', max: 10 }]
      : []),
    { key: 'treatment' as const, label: 'Tratamiento', max: 15 },
    { key: 'safetyAndConduct' as const, label: 'Conducta/Seguridad', max: 5 },
  ].map((domain) => {
    const validRecords = history.filter((h) => {
      if (!h.evaluation?.breakdown) return false;
      if (domain.key === 'differentialDiagnoses') {
        return h.mode === 'examen' && !h.evaluation?.expressDiagnosticOnly;
      }
      if (domain.key === 'treatment' || domain.key === 'safetyAndConduct') {
        return !h.evaluation?.expressDiagnosticOnly;
      }
      return true;
    });
    if (validRecords.length === 0) {
      return { ...domain, avgScore: 0, pct: 0 };
    }
    const avgRaw =
      validRecords.reduce((sum, r) => sum + (r.evaluation.breakdown[domain.key] || 0), 0) /
      validRecords.length;
    return {
      ...domain,
      avgScore: Number(avgRaw.toFixed(1)),
      pct: Math.min(100, Math.round((avgRaw / domain.max) * 100)),
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-[#263A32]/45 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[960px] flex flex-col bg-white border border-[#E2EAE4] rounded-2xl shadow-xl overflow-hidden">
        {/* Compact Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#F8FBF9] border-b border-[#E2EAE4] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E4F1E8] border border-[#72A98A]/50 flex items-center justify-center text-[#43866B] shrink-0">
              <History className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight truncate">
                Historial y Progreso Clínico
              </h3>
              <p className="text-[11px] text-[#718078] truncate hidden sm:block">
                Registro de casos, puntajes por especialidad y evolución
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 text-[#55685F] hover:text-[#263A32] rounded-xl hover:bg-[#E4F1E8]/60 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
            aria-label="Cerrar historial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs Switcher */}
        {history.length > 0 && (
          <div className="px-3 sm:px-6 py-2.5 bg-[#F3F7F4] border-b border-[#E2EAE4] grid grid-cols-2 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={`min-h-[40px] px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'list'
                  ? 'bg-[#43866B] text-white shadow-sm'
                  : 'bg-white text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4] hover:border-[#72A98A]'
              }`}
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span>Casos ({history.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('analytics')}
              className={`min-h-[40px] px-2.5 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'analytics'
                  ? 'bg-[#43866B] text-white shadow-sm'
                  : 'bg-white text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4] hover:border-[#72A98A]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Especialidades y Gráficos</span>
              <span className="hidden sm:inline">Puntaje por Especialidad y Gráficos</span>
            </button>
          </div>
        )}

        {/* Generous Scrollable Body (Stats + Content together) */}
        <div
          ref={modalBodyRef}
          className="p-3.5 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-4 bg-white"
        >
          {/* Compact 3-Column Stats Strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-[#F8FBF9] p-2.5 sm:p-3.5 rounded-xl border border-[#E2EAE4] flex items-center gap-2 sm:gap-3 min-w-0">
              <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-[#718078] uppercase font-semibold truncate">
                  Casos
                </div>
                <div className="text-base sm:text-xl font-bold font-mono tabular-nums text-[#263A32] leading-tight">
                  {history.length}
                </div>
              </div>
            </div>

            <div className="bg-[#F8FBF9] p-2.5 sm:p-3.5 rounded-xl border border-[#E2EAE4] flex items-center gap-2 sm:gap-3 min-w-0">
              <Award className="w-5 h-5 sm:w-7 sm:h-7 text-[#43866B] shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-[#718078] uppercase font-semibold truncate">
                  Promedio
                </div>
                <div className="text-base sm:text-xl font-bold font-mono tabular-nums text-[#263A32] leading-tight">
                  {averageScore}
                  <span className="text-[10px] sm:text-xs font-normal text-[#718078]">/100</span>
                </div>
              </div>
            </div>

            <div className="bg-[#E4F1E8]/60 p-2.5 sm:p-3.5 rounded-xl border border-[#72A98A]/45 flex items-center gap-2 sm:gap-3 min-w-0">
              <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-[#43866B] shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] text-[#43866B] uppercase font-semibold truncate">
                  ≥90 pts
                </div>
                <div className="text-base sm:text-xl font-bold font-mono tabular-nums text-[#1F4B3A] leading-tight">
                  {excellentCount}
                </div>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-[#55685F] text-xs bg-[#F8FBF9] rounded-xl border border-[#E2EAE4] px-4">
              Aún no has completado ningún caso clínico. Atiende a tu primer paciente y somete tu diagnóstico para ver tu historial y gráficas de progreso.
            </div>
          ) : activeView === 'list' ? (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#72A98A] hover:bg-white transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#718078]">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{new Date(record.date).toLocaleDateString('es-ES', { dateStyle: 'medium' })}</span>
                      <span>·</span>
                      <span className="text-[#43866B] font-semibold">
                        {SPECIALTY_LABELS[record.specialty] || record.specialty.replace('_', ' ')}
                      </span>
                      <span>·</span>
                      <span className="text-[#263A32] font-medium">{MODE_LABELS[record.mode] || record.mode}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#263A32] mt-1 break-words">
                      {record.patientName} — {record.correctDiagnosis}
                    </h4>
                    <p className="text-xs text-[#55685F] mt-0.5 break-words">
                      Tu diagnóstico: <span className="text-[#263A32] font-medium">"{record.userDiagnosis}"</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2EAE4]">
                    <div className="sm:text-right">
                      <div className={`text-lg font-bold font-mono tabular-nums ${getScoreTextTone(record.score)}`}>
                        {record.score} <span className="text-xs text-[#718078] font-normal">pts</span>
                      </div>
                      <div className="text-[10px] text-[#55685F] font-medium">
                        {record.evaluation.classification}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {onRetryCase && (
                        <button
                          type="button"
                          onClick={() => {
                            onRetryCase(record);
                            onClose();
                          }}
                          className="min-h-[40px] px-3 py-2 bg-white hover:bg-[#E4F1E8] text-[#1F4B3A] border border-[#CFE4D6] hover:border-[#72A98A] rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                          <span>Reintentar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onReviewCase(record);
                          onClose();
                        }}
                        className="min-h-[40px] px-3.5 py-2 bg-[#43866B] hover:bg-[#356D56] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                      >
                        Ver Dictamen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Quick Highlights */}
              {strongestSpecialty && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#E4F1E8]/60 border border-[#72A98A]/50 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#43866B]">
                        Especialidad más fuerte
                      </div>
                      <div className="text-sm font-bold text-[#263A32] truncate mt-0.5">
                        {strongestSpecialty.label}
                      </div>
                      <div className="text-[11px] text-[#55685F]">
                        {strongestSpecialty.count} {strongestSpecialty.count === 1 ? 'caso' : 'casos'} · Máx {strongestSpecialty.best} pts
                      </div>
                    </div>
                    <div className="text-xl font-extrabold font-mono tabular-nums text-[#1F4B3A] shrink-0">
                      {strongestSpecialty.avg}
                    </div>
                  </div>

                  {weakestSpecialty ? (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-amber-800">
                          Área recomendada a reforzar
                        </div>
                        <div className="text-sm font-bold text-[#263A32] truncate mt-0.5">
                          {weakestSpecialty.label}
                        </div>
                        <div className="text-[11px] text-[#55685F]">
                          {weakestSpecialty.count} {weakestSpecialty.count === 1 ? 'caso' : 'casos'} · Máx {weakestSpecialty.best} pts
                        </div>
                      </div>
                      <div className={`text-xl font-extrabold font-mono tabular-nums shrink-0 ${getScoreTextTone(weakestSpecialty.avg)}`}>
                        {weakestSpecialty.avg}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-[#55685F]">
                      <Target className="w-5 h-5 text-[#43866B] shrink-0" />
                      <span>Resuelve casos de otras especialidades para comparar tus fortalezas y áreas a reforzar.</span>
                    </div>
                  )}
                </div>
              )}

              {/* 1. Gráfico de Evolución Reciente */}
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#43866B] shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-[#263A32]">
                      Evolución de Puntaje (Últimos {recentChronological.length} casos)
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#55685F] font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#43866B] inline-block" /> ≥90
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#72A98A] inline-block" /> 75-89
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> 60-74
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> &lt;60
                    </span>
                  </div>
                </div>

                <div className="relative pt-4 pb-1">
                  {/* Reference line at 70 pts */}
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-[#72A98A]/70 pointer-events-none"
                    style={{ bottom: 'calc(28px + 0.70 * 116px)' }}
                  >
                    <span className="text-[9px] font-mono tabular-nums font-semibold text-[#43866B] bg-[#F8FBF9] pr-1.5 -mt-2 inline-block">
                      70 pts
                    </span>
                  </div>

                  <div className="flex items-end gap-2 sm:gap-3 h-[144px] overflow-x-auto pb-1 no-scrollbar">
                    {recentChronological.map((rec, idx) => {
                      const barHeight = Math.max(8, Math.round((rec.score / 100) * 116));
                      const specShort = (SPECIALTY_LABELS[rec.specialty] || rec.specialty).slice(0, 8);
                      return (
                        <div
                          key={rec.id}
                          className="flex-1 min-w-[38px] flex flex-col items-center justify-end h-full group"
                          title={`${SPECIALTY_LABELS[rec.specialty] || rec.specialty}: ${rec.score}/100 pts (${rec.correctDiagnosis})`}
                        >
                          <span className={`text-[11px] font-mono tabular-nums font-bold mb-1 ${getScoreTextTone(rec.score)}`}>
                            {rec.score}
                          </span>
                          <div
                            className={`w-full max-w-[36px] rounded-t-md transition-all ${getScoreBarTone(rec.score)}`}
                            style={{ height: `${barHeight}px` }}
                          />
                          <span className="text-[9px] text-[#718078] mt-1.5 truncate max-w-full font-medium">
                            #{idx + 1} · {specShort}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Puntaje por Especialidad Médica */}
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#43866B] shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-[#263A32]">
                      Promedio por Especialidad Médica
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#718078] font-mono tabular-nums">
                    {specialtyStats.length} {specialtyStats.length === 1 ? 'área' : 'áreas'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {specialtyStats.map((spec) => (
                    <div
                      key={spec.specialty}
                      className="bg-white border border-[#E2EAE4] rounded-lg p-3 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="font-bold text-[#263A32] truncate">{spec.label}</span>
                          <span className="text-[11px] text-[#55685F] tabular-nums shrink-0">
                            · {spec.uniqueSolved}/{spec.libraryTotal} resueltos
                            {spec.count > spec.uniqueSolved ? ` (${spec.count} intentos)` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
                          <span className="text-[10px] text-[#718078] hidden sm:inline">
                            Máx: {spec.best}
                          </span>
                          <span className={`text-sm font-bold ${getScoreTextTone(spec.avg)}`}>
                            {spec.avg} <span className="text-[10px] text-[#718078] font-normal">/ 100</span>
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#F3F7F4] overflow-hidden border border-[#E2EAE4]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBarTone(spec.avg)}`}
                          style={{ width: `${Math.min(100, spec.avg)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Dominio por Competencia Clínica (Rúbrica) */}
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#43866B] shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#263A32]">
                    Rendimiento Promedio por Competencia Clínica
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rubricDomains.map((dom) => (
                    <div
                      key={dom.key}
                      className="bg-white border border-[#E2EAE4] rounded-lg p-2.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#263A32]">{dom.label}</span>
                        <span className="font-mono tabular-nums font-bold text-[#263A32]">
                          {dom.avgScore} <span className="text-[#718078] font-normal">/ {dom.max} ({dom.pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#F3F7F4] overflow-hidden border border-[#E2EAE4]/60">
                        <div
                          className={`h-full rounded-full ${getScoreBarTone(dom.pct)}`}
                          style={{ width: `${dom.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="px-4 sm:px-6 py-3.5 bg-[#F8FBF9] border-t border-[#E2EAE4] flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span className="text-xs text-[#718078]">
              Datos guardados localmente en este dispositivo
            </span>
            <button
              onClick={onClearHistory}
              className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Historial</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
