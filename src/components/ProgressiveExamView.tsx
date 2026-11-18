import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  GraduationCap,
  Layers,
  Microscope,
  Pill,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import {
  ProgressiveExamConfig,
  ProgressiveExamEvaluation,
  ProgressiveExamStation,
} from '../types/exam';
import { evaluateProgressiveExam } from '../engine/progressiveExamEngine';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface ProgressiveExamViewProps {
  config: ProgressiveExamConfig;
  stations: ProgressiveExamStation[];
  onExitToLobby: () => void;
  onStartNewExam: (config: ProgressiveExamConfig) => void;
  onExamCompleted?: (evaluation: ProgressiveExamEvaluation) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const DIFFICULTY_TITLE: Record<ProgressiveExamConfig['difficulty'], string> = {
  progresivo: 'Dificultad Progresiva (General → Urgencias → Residencia)',
  medico_general: 'Nivel Médico General',
  urgencias: 'Nivel Urgencias y Guardia',
  residente: 'Nivel Residencia y Especialización',
};

const CATEGORY_LABEL: Record<string, string> = {
  caso_progresivo: 'Caso Clínico Progresivo',
  laboratorios_estudios: 'Interpretación de Estudios',
  fisiopatologia: 'Fisiopatología Causal',
  farmacologia_terapeutica: 'Farmacología y Seguridad',
};

export const ProgressiveExamView: React.FC<ProgressiveExamViewProps> = ({
  config,
  stations,
  onExitToLobby,
  onStartNewExam,
  onExamCompleted,
}) => {
  const isOnline = useOnlineStatus();
  const [stationIdx, setStationIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<ProgressiveExamEvaluation | null>(null);
  const [debriefStationIdx, setDebriefStationIdx] = useState(0);

  const currentStation = stations[stationIdx];
  const currentQuestion = currentStation?.questions[stepIdx];

  const totalQuestions = useMemo(
    () => stations.reduce((acc, s) => acc + s.questions.length, 0),
    [stations]
  );

  const currentGlobalIndex = useMemo(() => {
    let count = 0;
    for (let i = 0; i < stationIdx; i++) {
      count += stations[i]?.questions.length || 0;
    }
    return count + stepIdx + 1;
  }, [stations, stationIdx, stepIdx]);

  const isLastQuestionOfAll =
    stationIdx === stations.length - 1 &&
    currentStation &&
    stepIdx === currentStation.questions.length - 1;

  const handleConfirmAndAdvance = () => {
    if (!currentQuestion || !selectedOptionId) return;

    const updatedAnswers: Record<string, string> = {
      ...answersByQuestionId,
      [currentQuestion.id]: selectedOptionId,
    };
    setAnswersByQuestionId(updatedAnswers);
    setSelectedOptionId('');

    if (!isLastQuestionOfAll) {
      if (stepIdx < currentStation.questions.length - 1) {
        setStepIdx((prev) => prev + 1);
      } else {
        setStationIdx((prev) => prev + 1);
        setStepIdx(0);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = evaluateProgressiveExam(stations, updatedAnswers, isOnline);
    setEvaluation(result);
    setDebriefStationIdx(0);
    onExamCompleted?.(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentStation || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm text-[#55685F]">
            No se pudieron cargar las estaciones del examen progresivo.
          </p>
          <button
            type="button"
            onClick={onExitToLobby}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-[#43866B] text-white text-xs font-bold cursor-pointer"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // ==================== RESULTADOS Y DEBRIEFING DE 12 PUNTOS ====================
  if (evaluation) {
    const activeDebrief = evaluation.stationDebriefings[debriefStationIdx] || evaluation.stationDebriefings[0];

    return (
      <div className="max-w-5xl w-full mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-12 space-y-5">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExitToLobby}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white border border-[#E2EAE4] hover:border-[#72A98A] text-xs font-bold text-[#263A32] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#43866B]" />
            <span>Volver al Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => onStartNewExam(config)}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nuevo Examen Progresivo</span>
          </button>
        </div>

        {/* Score Hero & Domain Breakdown */}
        <section className="rounded-2xl border border-[#E2EAE4] bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(38,58,50,0.05)] space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#E2EAE4] pb-5">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-[#F8FBF9] border border-[#CFE4D6] flex flex-col items-center justify-center shrink-0">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-[#263A32]">
                  {evaluation.totalScore}
                </span>
                <span className="text-[11px] font-semibold uppercase text-[#55685F]">sobre 100</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#43866B]">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Dictamen Final · Examen Clínico Progresivo</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#263A32] tracking-tight">
                  {evaluation.classification}
                </h1>
                <p className="text-xs text-[#55685F] tabular-nums">
                  {evaluation.correctCount} de {evaluation.totalQuestions} reactivos correctos · {DIFFICULTY_TITLE[config.difficulty]}
                </p>
              </div>
            </div>

            <div className="text-xs text-[#55685F] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 py-2.5 space-y-0.5 tabular-nums">
              <div className="font-bold text-[#263A32]">
                Estaciones completadas: {evaluation.stationDebriefings.length}
              </div>
              <div>
                Alertas críticas de seguridad:{' '}
                <strong className={evaluation.safetyErrorsDetected.length > 0 ? 'text-rose-700' : 'text-[#1F4B3A]'}>
                  {evaluation.safetyErrorsDetected.length}
                </strong>
              </div>
            </div>
          </div>

          {/* Non-Compensatory Safety Cap Alert */}
          {evaluation.safetyNonCompensation?.applied && (
            <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-4 space-y-2 text-xs text-rose-950">
              <div className="flex items-center gap-2 font-bold text-rose-800 uppercase tracking-wide">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>
                  Regla de Seguridad del Paciente (No Compensación): Tope ≤{evaluation.safetyNonCompensation.cappedMaxScore}/100
                </span>
              </div>
              <p className="leading-relaxed">
                Puntaje bruto previo: <strong className="tabular-nums">{evaluation.rawUncappedScore}/100</strong>. {evaluation.safetyNonCompensation.reason}
              </p>
              <ul className="space-y-1 pl-4 list-disc text-rose-900">
                {evaluation.safetyErrorsDetected.map((err, idx) => (
                  <li key={idx}>
                    <strong>Estación {err.stationIndex} ({err.questionStep}):</strong> {err.riskNote}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4-Domain Competency Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {evaluation.domainBreakdown.map((dom) => (
              <div
                key={dom.category}
                className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#263A32] leading-tight">{dom.label}</span>
                  <span className="font-mono tabular-nums font-bold text-[#1F4B3A] shrink-0">
                    {dom.correct}/{dom.total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2EAE4] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dom.scorePct >= 75
                        ? 'bg-[#43866B]'
                        : dom.scorePct >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                    }`}
                    style={{ width: `${dom.scorePct}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#55685F] font-mono tabular-nums">
                  Dominio: {dom.scorePct}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Station Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {evaluation.stationDebriefings.map((st, idx) => {
            const isSelected = idx === debriefStationIdx;
            const hasSafety = st.questionReviews.some((r) => r.isSafetyError);
            return (
              <button
                key={st.caseData.id}
                type="button"
                onClick={() => setDebriefStationIdx(idx)}
                className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors tabular-nums ${
                  isSelected
                    ? 'bg-[#1F5E4B] text-white border-[#1F5E4B]'
                    : 'bg-white text-[#263A32] border-[#E2EAE4] hover:border-[#72A98A]'
                }`}
              >
                <span>Estación {st.stationIndex}</span>
                <span className="opacity-80 font-mono">{st.stationScore}/100</span>
                {hasSafety && (
                  <AlertOctagon
                    className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-rose-600'}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Complete 12-Point Debriefing for Selected Station */}
        {activeDebrief && (
          <section className="rounded-2xl border border-[#E2EAE4] bg-white p-5 sm:p-6 shadow-[0_1px_4px_rgba(38,58,50,0.04)] space-y-5">
            <div className="border-b border-[#E2EAE4] pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
                  Revisión Docente Completa de 12 Puntos · Estación {activeDebrief.stationIndex} · {activeDebrief.difficultyTierLabel}
                </div>
                <h2 className="text-lg font-extrabold text-[#263A32] mt-0.5">
                  {activeDebrief.caseData.patientInfo.name} ({activeDebrief.caseData.patientInfo.age} años, {activeDebrief.caseData.patientInfo.sex})
                </h2>
              </div>
              <span className="font-mono tabular-nums text-sm font-bold px-3 py-1 rounded-xl bg-[#E4F1E8] text-[#1F4B3A]">
                {activeDebrief.stationScore}/100 pts
              </span>
            </div>

            {/* Puntos 1 & 2: Diagnóstico Definitivo y Razonamiento Clínico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-[#E4F1E8]/55 border border-[#72A98A] rounded-xl p-4 space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-[#1F4B3A] text-[11px]">
                  1. Diagnóstico Definitivo del Caso
                </div>
                <p className="text-sm font-extrabold text-[#263A32]">
                  {activeDebrief.definitiveDiagnosis}
                </p>
              </div>
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px]">
                  2. Razonamiento Clínico Correcto
                </div>
                <p className="text-[#263A32] leading-relaxed">{activeDebrief.clinicalReasoning}</p>
              </div>
            </div>

            {/* Punto 3: Fisiopatología Detallada */}
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px] flex items-center gap-1.5">
                <Microscope className="w-4 h-4 shrink-0" />
                <span>3. Fisiopatología Detallada y Correlación Clínica</span>
              </div>
              <p className="text-[#263A32] leading-relaxed">{activeDebrief.pathophysiologySummary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-white border border-[#E2EAE4] rounded-lg p-3 space-y-1">
                  <span className="font-semibold text-[#43866B] block">Mecanismo celular y molecular</span>
                  <p className="text-[#263A32] leading-relaxed">
                    {activeDebrief.pathophysiologyMatrix.cellularAndMolecular}
                  </p>
                </div>
                <div className="bg-white border border-[#E2EAE4] rounded-lg p-3 space-y-1">
                  <span className="font-semibold text-[#43866B] block">Repercusión hemodinámica e inflamatoria</span>
                  <p className="text-[#263A32] leading-relaxed">
                    {activeDebrief.pathophysiologyMatrix.hemodynamicAndMetabolic}{' '}
                    {activeDebrief.pathophysiologyMatrix.inflammatoryAndImmunologic}
                  </p>
                </div>
              </div>
            </div>

            {/* Punto 4: Diagnósticos Diferenciales y Escalas Validadas */}
            <div className="space-y-2.5 text-xs">
              <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px] flex items-center gap-1.5">
                <Layers className="w-4 h-4 shrink-0" />
                <span>4. Diagnósticos Diferenciales y Herramientas Clínicas Validadas</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeDebrief.differentialMatrix.map((diff, dIdx) => (
                  <div key={dIdx} className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-bold text-[#263A32]">{diff.diagnosis}</span>
                      <span className="text-[11px] font-semibold text-[#43866B]">
                        {diff.qualitativeProbability}
                      </span>
                    </div>
                    <p className="text-[#55685F] leading-relaxed">
                      <strong className="text-[#263A32]">A favor:</strong> {diff.findingsFor.join(' ')}
                    </p>
                    <p className="text-[#55685F] leading-relaxed">
                      <strong className="text-[#263A32]">En contra:</strong> {diff.findingsAgainst.join(' ')}
                    </p>
                  </div>
                ))}
              </div>
              {activeDebrief.validatedScales.length > 0 && (
                <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-1.5">
                  <span className="font-semibold text-[#263A32] block">Escalas clínicas aplicables:</span>
                  {activeDebrief.validatedScales.map((sc, sIdx) => (
                    <div key={sIdx} className="text-[#55685F]">
                      <strong className="text-[#263A32]">{sc.scaleName}</strong> ({sc.validatedPopulation}):{' '}
                      {sc.clinicalInterpretation}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Punto 5: Interpretación de Estudios */}
            <div className="space-y-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px] flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 shrink-0" />
                <span>5. Interpretación de Estudios Paraclínicos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeDebrief.studiesInterpretation.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className={`rounded-xl border p-3 space-y-1 ${
                      st.isAbnormal ? 'bg-amber-50/40 border-amber-300' : 'bg-[#F8FBF9] border-[#E2EAE4]'
                    }`}
                  >
                    <div className="font-bold text-[#263A32]">{st.name}</div>
                    <div className="font-mono text-[11px] text-[#263A32]">{st.result}</div>
                    <p className="text-[#55685F] leading-relaxed">{st.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Puntos 6 & 7: Tratamiento Recomendado y Justificación Farmacológica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px] flex items-center gap-1.5">
                  <Pill className="w-4 h-4 shrink-0" />
                  <span>6. Tratamiento Recomendado ({activeDebrief.hospitalizationDecision})</span>
                </div>
                <ul className="space-y-1.5 text-[#263A32]">
                  {activeDebrief.recommendedTreatment.map((rx, rIdx) => (
                    <li key={rIdx} className="bg-white border border-[#E2EAE4] rounded-lg p-2.5">
                      <span className="font-bold">{rx.drug}</span> — {rx.dose} · {rx.route} · {rx.frequency} ({rx.duration})
                    </li>
                  ))}
                </ul>
                <ul className="list-disc pl-4 space-y-0.5 text-[#55685F]">
                  {activeDebrief.generalMeasures.map((gm, gIdx) => (
                    <li key={gIdx}>{gm}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>7. Justificación Farmacológica y Monitorización</span>
                </div>
                <ul className="space-y-1.5 text-[#263A32]">
                  {activeDebrief.pharmacologicalJustification.map((pj, pIdx) => (
                    <li key={pIdx} className="leading-relaxed">
                      · {pj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Puntos 8, 9 & 10: Errores Cometidos, Riesgos/Consecuencias y Conducta que Debió Realizarse */}
            <div className="bg-white border border-[#E2EAE4] rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold uppercase tracking-wider text-[#263A32] text-[11px] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>8–10. Desempeño Paso a Paso, Errores, Riesgos y Conducta Esperada</span>
              </div>

              <div className="space-y-2">
                {activeDebrief.questionReviews.map((rev) => (
                  <div
                    key={rev.question.id}
                    className={`rounded-xl border p-3 space-y-1.5 ${
                      rev.isCorrect
                        ? 'bg-[#E4F1E8]/45 border-[#72A98A]'
                        : rev.isSafetyError
                          ? 'bg-rose-50 border-rose-300'
                          : 'bg-amber-50/50 border-amber-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-[#263A32]">{rev.question.stepLabel}</span>
                      <span
                        className={`text-[11px] font-bold flex items-center gap-1 ${
                          rev.isCorrect
                            ? 'text-[#1F4B3A]'
                            : rev.isSafetyError
                              ? 'text-rose-800'
                              : 'text-amber-900'
                        }`}
                      >
                        {rev.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Acierto
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> {rev.isSafetyError ? 'Error Crítico de Seguridad' : 'Error Clínico'}
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-[#55685F]">{rev.question.questionPrompt}</p>
                    <div className="text-[#263A32]">
                      <strong>Tu selección:</strong> {rev.selectedOptionLabel}
                    </div>
                    {!rev.isCorrect && (
                      <div className="text-[#1F4B3A]">
                        <strong>Opción correcta:</strong> {rev.correctOptionLabel}
                      </div>
                    )}
                    <p className="text-[#263A32] leading-relaxed">
                      <strong>Justificación docente:</strong> {rev.question.teachingExplanation}
                    </p>
                    {!rev.isCorrect && (
                      <p className={rev.isSafetyError ? 'text-rose-900 font-medium' : 'text-amber-900'}>
                        <strong>Riesgo / consecuencia:</strong>{' '}
                        {rev.safetyRiskNote || rev.selectedRationale}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-[#E2EAE4]">
                <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg p-3 space-y-1">
                  <span className="font-bold text-[#263A32] block">8. Errores cometidos</span>
                  <ul className="space-y-1 text-[#55685F]">
                    {activeDebrief.userErrors.map((e, i) => (
                      <li key={i}>· {e}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg p-3 space-y-1">
                  <span className="font-bold text-rose-800 block">9. Riesgos y consecuencias</span>
                  <ul className="space-y-1 text-[#55685F]">
                    {activeDebrief.errorRisksAndConsequences.map((r, i) => (
                      <li key={i}>· {r}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#E4F1E8]/50 border border-[#72A98A] rounded-lg p-3 space-y-1">
                  <span className="font-bold text-[#1F4B3A] block">10. Conducta que debió realizarse</span>
                  <p className="text-[#263A32] leading-relaxed">{activeDebrief.expectedConduct}</p>
                </div>
              </div>
            </div>

            {/* Puntos 11 & 12: Perlas Clínicas, Referencias Bibliográficas y Certeza */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              <div className="bg-[#E4F1E8]/45 border border-[#72A98A] rounded-xl p-4 space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-[#1F4B3A] text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#43866B] shrink-0" />
                  <span>11. Perlas Clínicas para Recordar</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[#263A32]">
                  {activeDebrief.clinicalPearls.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="font-bold uppercase tracking-wider text-[#43866B] text-[11px] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>12. Referencias y Nivel de Certeza Científica</span>
                </div>
                <div className="text-[#263A32]">
                  <strong>Nivel de evidencia:</strong> {activeDebrief.certaintyClassification.label} —{' '}
                  <span className="text-[#55685F]">{activeDebrief.certaintyClassification.explanation}</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[#55685F]">
                  {activeDebrief.bibliographicReferences.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
                <div className="flex items-start gap-1.5 text-[11px] text-[#55685F] pt-1 border-t border-[#E2EAE4]">
                  {isOnline ? (
                    <Wifi className="w-3.5 h-3.5 text-[#43866B] shrink-0 mt-0.5" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <span>{activeDebrief.certaintyClassification.offlineVerificationNotice}</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ==================== EXAMEN ACTIVO (CERO SPOILERS PREVIOS) ====================
  const { patientInfo, vitalSigns, background } = currentStation.caseData;
  const progressPct = Math.round((currentGlobalIndex / Math.max(1, totalQuestions)) * 100);

  return (
    <div className="max-w-4xl w-full mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-12 space-y-4">
      {/* Exam Header Strip */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 shadow-[0_1px_4px_rgba(38,58,50,0.04)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F4B3A] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Examen Clínico Progresivo · Sin Pistas Previas</span>
          </div>
          <button
            type="button"
            onClick={onExitToLobby}
            className="min-h-[34px] px-3 py-1 rounded-lg border border-[#E2EAE4] hover:border-[#72A98A] text-xs font-semibold text-[#55685F] hover:text-[#263A32] cursor-pointer transition-colors"
          >
            Salir del Examen
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#55685F] tabular-nums">
          <span>
            Estación <strong className="text-[#263A32]">{stationIdx + 1} de {stations.length}</strong> ·{' '}
            {currentStation.difficultyTierLabel}
          </span>
          <span>
            Reactivo <strong className="text-[#263A32]">{currentGlobalIndex} de {totalQuestions}</strong> ({progressPct}%)
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-[#E4F1E8] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2F7A63] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Progressive Clinical Dossier (Unfolds step-by-step) */}
      <section className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#43866B] shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-[#263A32]">
              {patientInfo.name} · {patientInfo.age} {patientInfo.age === 1 ? 'año' : 'años'} · {patientInfo.sex}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#43866B]">
            {patientInfo.triageLevel}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#263A32] leading-relaxed">
          {currentStation.baseVignette}
        </p>

        {/* Vitals Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs tabular-nums">
          {[
            { label: 'PA', value: vitalSigns.bloodPressure },
            { label: 'FC', value: `${vitalSigns.heartRate} lpm` },
            { label: 'FR', value: `${vitalSigns.respiratoryRate} rpm` },
            { label: 'Temp', value: `${vitalSigns.temperature} °C` },
            { label: 'SpO₂', value: `${vitalSigns.oxygenSaturation}%` },
            { label: 'Glasgow', value: `${vitalSigns.glasgow}/15` },
          ].map((v) => (
            <div key={v.label} className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg px-2.5 py-2">
              <div className="text-[10px] font-bold uppercase text-[#718078]">{v.label}</div>
              <div className="font-mono font-bold text-[#263A32] mt-0.5">{v.value}</div>
            </div>
          ))}
        </div>

        {/* Antecedentes */}
        <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 text-xs text-[#55685F] space-y-1">
          <div>
            <strong className="text-[#263A32]">Antecedentes patológicos:</strong>{' '}
            {background.pathological.join('; ') || 'Ninguno referido'}
          </div>
          <div>
            <strong className="text-[#263A32]">Medicación habitual / Alergias:</strong>{' '}
            {background.currentMedications.join(', ') || 'Ninguna'} · Alergias:{' '}
            {background.allergies.join(', ') || 'No referidas'}
          </div>
        </div>

        {/* Progressive Unlocks for Step >= 2 */}
        {currentQuestion.stepNumber >= 2 && (
          <div className="bg-[#FAFDFB] border border-[#CFE4D6] rounded-xl p-3.5 space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-[#1F4B3A] text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#43866B]" />
              <span>Actualización Clínica Progresiva (Exploración y Estudios)</span>
            </div>
            {currentStation.questions[1]?.examFindingHighlight && (
              <p className="text-[#263A32]">
                <strong>Exploración dirigida:</strong> {currentStation.questions[1].examFindingHighlight}
              </p>
            )}
            {currentStation.questions[1]?.studySnippet && (
              <div className="bg-white border border-[#E2EAE4] rounded-lg p-2.5 space-y-0.5">
                <div className="font-bold text-[#263A32]">
                  {currentStation.questions[1].studySnippet.name}
                </div>
                <div className="font-mono text-[11px] text-[#263A32]">
                  {currentStation.questions[1].studySnippet.result}
                </div>
                {currentStation.questions[1].studySnippet.referenceRange && (
                  <div className="text-[11px] text-[#718078]">
                    Ref.: {currentStation.questions[1].studySnippet.referenceRange}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentQuestion.stepNumber >= 4 && currentQuestion.pharmacologyContextNote && (
          <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 text-xs text-[#263A32]">
            <strong>Parámetros de seguridad farmacológica:</strong> {currentQuestion.pharmacologyContextNote}
          </div>
        )}
      </section>

      {/* Active Question Card */}
      <section className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-6 shadow-[0_2px_8px_rgba(38,58,50,0.05)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#43866B] font-bold uppercase tracking-wider">
          <span>{currentQuestion.stepLabel}</span>
          <span className="text-[#55685F] font-semibold normal-case">
            {CATEGORY_LABEL[currentQuestion.category]} · {currentQuestion.difficultyTierLabel}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-[#263A32] leading-snug">
          {currentQuestion.questionPrompt}
        </h3>

        <div className="space-y-2.5" role="radiogroup" aria-label={currentQuestion.stepLabel}>
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#E4F1E8]/65 border-[#43866B] text-[#1F4B3A]'
                    : 'bg-[#F8FBF9] border-[#E2EAE4] hover:border-[#72A98A] text-[#263A32]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-[#43866B] text-white border-[#43866B]'
                      : 'bg-white text-[#55685F] border-[#E2EAE4]'
                  }`}
                >
                  {OPTION_LETTERS[idx] || idx + 1}
                </span>
                <span className="text-xs sm:text-sm leading-relaxed font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E2EAE4]">
          <span className="text-[11px] text-[#718078]">
            La respuesta y su fundamentación se revelan únicamente al finalizar todas las estaciones.
          </span>
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleConfirmAndAdvance}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#174E3E] to-[#3A846B] hover:from-[#123D31] hover:to-[#2F7A63] disabled:opacity-45 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <span>
              {isLastQuestionOfAll ? 'Finalizar Examen y Ver Debriefing' : 'Confirmar y Avanzar'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </section>
    </div>
  );
};
