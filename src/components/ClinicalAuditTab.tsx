import React, { useEffect, useMemo, useState } from 'react';
import { ClinicalCase, EvaluationResult, RubricCategoryDetail } from '../types/clinical';
import { buildPathologyMasterclass } from '../utils/pathologyMasterclass';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { CURATED_KNOWLEDGE_RECORDS } from '../knowledge/clinicalKnowledgeBase';
import { auditCaseKnowledgeReferences, getKnowledgeSnapshot } from '../knowledge/knowledgeSyncEngine';
import {
  CERTAINTY_TIER_META,
  KnowledgeRecord,
  KnowledgeSyncState,
  VALIDITY_STATUS_META,
} from '../types/knowledge';
import {
  Award,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  Stethoscope,
  FlaskConical,
  Pill,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Target,
  ShieldCheck,
  Hospital,
  Zap,
  Activity,
  GraduationCap,
  ClipboardList,
  Lightbulb,
  GitCompare,
  Ban,
  WifiOff,
  Wifi,
} from 'lucide-react';

interface ClinicalAuditTabProps {
  caseData: ClinicalCase;
  evaluation: EvaluationResult;
  onNextCase: () => void;
}

export const ClinicalAuditTab: React.FC<ClinicalAuditTabProps> = ({
  caseData,
  evaluation,
  onNextCase,
}) => {
  const {
    totalScore,
    breakdown,
    categoryDetails,
    classification,
    criticalSafetyErrors,
    feedback,
    differentialExplanations,
    rationalUseAudit,
    proposedTreatmentReviews,
    generalMeasuresCritique,
    statAudit,
    pathophysiologyMatrix,
    differentialMatrix,
    validatedClinicalScales,
    drugInteractionAlerts,
    safetyNonCompensation,
    userSummary,
  } = evaluation;
  const { solution } = caseData;
  const isOnline = useOnlineStatus();
  const [showAllNormalStudies, setShowAllNormalStudies] = useState(false);
  const [showMasterclass, setShowMasterclass] = useState(true);
  const [knowledgeRecords, setKnowledgeRecords] = useState<KnowledgeRecord[]>(CURATED_KNOWLEDGE_RECORDS);
  const [knowledgeSyncState, setKnowledgeSyncState] = useState<KnowledgeSyncState | null>(null);
  const masterclass = useMemo(() => buildPathologyMasterclass(caseData), [caseData]);

  useEffect(() => {
    let cancelled = false;
    void getKnowledgeSnapshot(isOnline).then((snap) => {
      if (cancelled) return;
      setKnowledgeRecords(snap.records);
      setKnowledgeSyncState(snap.syncState);
    });
    return () => {
      cancelled = true;
    };
  }, [isOnline]);

  const knowledgeAudit = useMemo(
    () => auditCaseKnowledgeReferences(caseData, knowledgeRecords, knowledgeSyncState, isOnline),
    [caseData, knowledgeRecords, knowledgeSyncState, isOnline]
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'border-[#43866B] bg-gradient-to-br from-[#E4F1E8] via-white to-[#F8FBF9]';
    if (score >= 80) return 'border-[#72A98A] bg-white';
    if (score >= 70) return 'border-sky-300 bg-white';
    if (score >= 60) return 'border-amber-300 bg-amber-50/40';
    return 'border-rose-300 bg-rose-50/40';
  };

  const getScoreBarColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.85) return 'bg-[#43866B]';
    if (ratio >= 0.7) return 'bg-[#72A98A]';
    if (ratio >= 0.55) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  const isEcoeMode = caseData.mode === 'examen';
  const isExpressDiag = Boolean(evaluation.expressDiagnosticOnly);

  const allRubricItems: Array<{
    key: keyof EvaluationResult['breakdown'];
    name: string;
    score: number;
    max: number;
    fallbackDesc: string;
    detail?: RubricCategoryDetail;
  }> = [
    {
      key: 'anamnesis',
      name: '1. Anamnesis e Interrogatorio Clínico',
      score: breakdown.anamnesis,
      max: 15,
      fallbackDesc: 'Semiología de síntomas, evolución cronológica y antecedentes.',
      detail: categoryDetails?.anamnesis,
    },
    {
      key: 'physicalExam',
      name: '2. Exploración Física y Maniobras',
      score: breakdown.physicalExam,
      max: 15,
      fallbackDesc: 'Solicitud de maniobras dirigidas y detección de signos positivos.',
      detail: categoryDetails?.physicalExam,
    },
    {
      key: 'studiesInterpretation',
      name: '3. Selección e Interpretación de Estudios',
      score: breakdown.studiesInterpretation,
      max: 15,
      fallbackDesc: 'Paraclínicos pertinentes sin despilfarro ni omisión crítica.',
      detail: categoryDetails?.studiesInterpretation,
    },
    {
      key: 'primaryDiagnosis',
      name: '4. Diagnóstico Principal y Razonamiento',
      score: breakdown.primaryDiagnosis,
      max: 25,
      fallbackDesc: 'Coincidencia con la patología real y especificidad sindromática.',
      detail: categoryDetails?.primaryDiagnosis,
    },
    ...(isEcoeMode && !isExpressDiag
      ? [
          {
            key: 'differentialDiagnoses' as const,
            name: '5. Diagnósticos Diferenciales',
            score: breakdown.differentialDiagnoses,
            max: 10,
            fallbackDesc: 'Planteamiento de patologías competidoras fundamentadas.',
            detail: categoryDetails?.differentialDiagnoses,
          },
        ]
      : []),
    ...(!isExpressDiag
      ? [
          {
            key: 'treatment' as const,
            name: isEcoeMode
              ? '6. Tratamiento y Régimen Farmacológico'
              : '5. Tratamiento y Régimen Farmacológico',
            score: breakdown.treatment,
            max: 15,
            fallbackDesc: 'Esquema de fármacos, dosis, vías, frecuencias y medidas de soporte.',
            detail: categoryDetails?.treatment,
          },
          {
            key: 'safetyAndConduct' as const,
            name: isEcoeMode
              ? '7. Conducta, Triage y Seguridad'
              : '6. Conducta, Destino y Seguridad',
            score: breakdown.safetyAndConduct,
            max: 5,
            fallbackDesc: 'Nivel de hospitalización idóneo y ausencia de contraindicaciones.',
            detail: categoryDetails?.safetyAndConduct,
          },
        ]
      : []),
  ];

  const rubricItems = allRubricItems;

  const requestedStudySet = new Set(userSummary?.unlockedStudiesNames || []);
  const requestedExamSet = new Set(userSummary?.unlockedExamsNames || []);

  const allStudies = caseData.studiesPool || [];
  const relevantOrRequestedStudies = allStudies.filter(
    (s) => s.isAbnormal || requestedStudySet.has(s.name)
  );
  const normalUnrequestedStudies = allStudies.filter(
    (s) => !s.isAbnormal && !requestedStudySet.has(s.name)
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Score Header Hero */}
      <div className={`rounded-2xl border p-5 sm:p-7 ${getScoreColor(totalScore)} shadow-[0_2px_8px_rgba(38,58,50,0.06)] relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F8FBF9] border border-[#E2EAE4] flex flex-col items-center justify-center shrink-0 shadow-xs">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-[#263A32]">
                {totalScore}
              </span>
              <span className="text-[11px] font-semibold uppercase text-[#55685F]">sobre 100</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <Award className="w-5 h-5 text-[#43866B] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#43866B]">
                  Dictamen Didáctico del Tribunal Evaluador
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-[#263A32] tracking-tight">
                {classification}
              </h2>
              <p className="text-xs sm:text-sm text-[#55685F] mt-1 max-w-2xl">
                Diagnóstico Real del Caso:{' '}
                <span className="font-bold text-[#263A32]">{solution.correctDiagnosis}</span>
              </p>
              {userSummary?.primaryDiagnosis && (
                <p className="text-xs text-[#55685F] mt-0.5 max-w-2xl">
                  Tu Diagnóstico Propuesto:{' '}
                  <span className="font-semibold text-[#1F4B3A]">{userSummary.primaryDiagnosis}</span>
                </p>
              )}
              <p className="text-[11px] text-[#43866B] mt-1.5 font-medium max-w-2xl">
                Marco evaluador: {evaluation.evaluationFrameworkLabel || 'Normativa Nicaragüense (MINSA / Lista Básica) + Estándar Internacional (OMS / OPS / AHA / IDSA)'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end w-full lg:w-auto">
            <button
              onClick={onNextCase}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#43866B] hover:bg-[#356D56] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <span>Siguiente Caso Clínico</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Validated MINSA Nicaragua / International Equivalents Banner */}
      {evaluation.recognizedEquivalents && evaluation.recognizedEquivalents.length > 0 && (
        <div className="bg-[#E4F1E8]/70 border border-[#72A98A] rounded-2xl p-4 sm:p-5 text-[#1F4B3A] shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-2">
          <div className="flex items-center gap-2 text-[#1F4B3A] font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Equivalencias Clínicas y Normativas Validadas (MINSA Nicaragua + Internacional)</span>
          </div>
          <ul className="space-y-1 text-xs text-[#263A32] pl-5 list-disc">
            {evaluation.recognizedEquivalents.map((eq, idx) => (
              <li key={idx}>{eq}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Safety Errors Banner */}
      {criticalSafetyErrors && criticalSafetyErrors.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 text-rose-950 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm uppercase tracking-wide">
            <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0" />
            <span>Alerta Crítica de Seguridad Detectada:</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-rose-900 pl-6 list-disc">
            {criticalSafetyErrors.map((err, idx) => (
              <li key={idx} className="font-semibold">{err}</li>
            ))}
          </ul>
          {safetyNonCompensation?.applied && (
            <div className="bg-white/85 border border-rose-300 rounded-xl p-3 text-xs text-rose-950 space-y-1">
              <div className="font-bold text-rose-900 tabular-nums">
                Regla de No Compensación Aplicada · Puntaje previo: {safetyNonCompensation.rawUncappedScore}/100 → Calificación final limitada a {totalScore}/100 (Tope ≤{safetyNonCompensation.cappedMaxScore})
              </div>
              <p className="text-rose-800 leading-relaxed">{safetyNonCompensation.reason}</p>
            </div>
          )}
          <p className="text-[11px] text-rose-700 italic pt-0.5">
            * Nota docente: En la práctica clínica real, este tipo de error conlleva alto riesgo de morbimortalidad iatrogénica y no puede compensarse con otros aciertos.
          </p>
        </div>
      )}

      {/* Drug-Drug Interaction Alerts */}
      {drugInteractionAlerts && drugInteractionAlerts.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Interacciones Farmacológicas Detectadas ({drugInteractionAlerts.length})</span>
          </div>
          <div className="space-y-2">
            {drugInteractionAlerts.map((inter, idx) => (
              <div key={idx} className="bg-white border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#263A32]">{inter.pairLabel}</span>
                  <span className={`text-[11px] font-semibold ${inter.severity === 'critica' ? 'text-rose-700' : 'text-amber-800'}`}>
                    {inter.severity === 'critica' ? 'Severidad Crítica' : 'Severidad Moderada'}
                  </span>
                </div>
                <p className="text-[#55685F] leading-relaxed">
                  <strong className="text-[#263A32]">Mecanismo:</strong> {inter.mechanism}
                </p>
                <p className="text-[#263A32] leading-relaxed">
                  <strong>Riesgo clínico:</strong> {inter.clinicalRisk}{' '}
                  <span className="text-[#43866B] font-medium">Recomendación: {inter.recommendation}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Care & Stewardship Decision Summary (Tratar en casa vs Referir, Uso Racional, Banderas Rojas) */}
      {rationalUseAudit && (
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#263A32] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#43866B] shrink-0" />
              <span>Auditoría de Primer Nivel: Destino, Uso Racional y Banderas Rojas</span>
            </h3>
            <span
              className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                rationalUseAudit.referralTriageVerdict === 'correcto'
                  ? 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]'
                  : rationalUseAudit.referralTriageVerdict === 'subestimado'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {rationalUseAudit.referralTriageVerdict === 'correcto'
                ? 'Destino Clínico Oportuno'
                : rationalUseAudit.referralTriageVerdict === 'subestimado'
                  ? 'Referencia Tardía / Subestimada'
                  : 'Sobre-referencia'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
                <Hospital className="w-3.5 h-3.5 shrink-0" />
                <span>Casa vs. Referir a Tiempo</span>
              </div>
              <p className="text-[11px] text-[#263A32] leading-relaxed">
                {rationalUseAudit.referralTriageNote}
              </p>
            </div>

            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 shrink-0" />
                <span>Uso Racional de Antibióticos</span>
              </div>
              <p
                className={`text-[11px] leading-relaxed ${
                  rationalUseAudit.rationalAntibioticStatus === 'alerta'
                    ? 'text-amber-900 font-medium'
                    : rationalUseAudit.rationalAntibioticStatus === 'optimo'
                      ? 'text-[#1F4B3A] font-medium'
                      : 'text-[#263A32]'
                }`}
              >
                {rationalUseAudit.rationalAntibioticNote}
              </p>
            </div>

            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 shrink-0" />
                <span>Pertinencia de Estudios</span>
              </div>
              <p className="text-[11px] text-[#263A32] leading-relaxed">
                {rationalUseAudit.workupStewardshipNote}
              </p>
            </div>

            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{isEcoeMode ? 'Banderas Rojas y Alta' : 'Vigilancia y Seguridad'}</span>
              </div>
              <p className="text-[11px] text-[#263A32] leading-relaxed">
                {rationalUseAudit.redFlagsSafetyNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAT Stabilization & Patient Physiological Evolution Audit */}
      {statAudit && (statAudit.performedCount > 0 || statAudit.overallVerdict === 'omitido_en_inestabilidad' || statAudit.requiresUrgentStat) && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-3 ${
            statAudit.overallVerdict === 'riesgo_critico' || statAudit.overallVerdict === 'omitido_en_inestabilidad'
              ? 'bg-rose-50/60 border-rose-300'
              : statAudit.overallVerdict === 'optimo'
                ? 'bg-[#E4F1E8]/50 border-[#72A98A]'
                : 'bg-white border-[#E2EAE4]'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-2.5">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Auditoría de Estabilización STAT y Urgencias</span>
            </h3>
            <span
              className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                statAudit.overallVerdict === 'optimo'
                  ? 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]'
                  : statAudit.overallVerdict === 'riesgo_critico' || statAudit.overallVerdict === 'omitido_en_inestabilidad'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {statAudit.overallVerdict === 'optimo'
                ? 'Estabilización Oportuna'
                : statAudit.overallVerdict === 'riesgo_critico'
                  ? 'Dosis Riesgosa / Evento Adverso'
                  : statAudit.overallVerdict === 'omitido_en_inestabilidad'
                    ? 'Omitida en Urgencia'
                    : statAudit.overallVerdict === 'parcial'
                      ? 'Manejo Agudo Parcial'
                      : 'Evaluado'}
            </span>
          </div>

          <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3.5 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-[#43866B] font-semibold">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>Evolución de Signos Vitales:</span>
            </div>
            <p className="font-mono tabular-nums text-[11px] text-[#263A32] font-semibold break-words">
              {statAudit.vitalEvolutionSummary}
            </p>
            <p className="text-[#55685F] leading-relaxed pt-1">{statAudit.narrative}</p>
            {statAudit.statGuidanceComment && (
              <p className="text-amber-900 leading-relaxed pt-1.5 border-t border-[#E2EAE4]">
                <strong className="text-amber-800">Corrección STAT / Urgencias: </strong>
                {statAudit.statGuidanceComment}
              </p>
            )}
            {statAudit.immediateDeathReason && (
              <p className="text-rose-800 font-semibold leading-relaxed pt-1.5 border-t border-rose-200">
                Mecanismo letal inmediato: {statAudit.immediateDeathReason}
              </p>
            )}
          </div>

          {statAudit.interventionReviews.length > 0 && (
            <div className="space-y-2">
              {statAudit.interventionReviews.map((rev, idx) => {
                const isPartial = rev.verdict === 'parcial_o_sin_efecto' && rev.effectSeverity === 'parcial';
                const isIrrelevant = rev.verdict === 'parcial_o_sin_efecto' && rev.effectSeverity === 'sin_cambio';
                return (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 text-xs space-y-1 ${
                    rev.verdict === 'riesgo_o_excesivo'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : rev.verdict === 'adecuado'
                        ? 'bg-white border-[#72A98A] text-[#263A32]'
                        : isPartial
                          ? 'bg-sky-50/50 border-sky-200 text-[#263A32]'
                          : 'bg-amber-50/50 border-amber-200 text-[#263A32]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-[#263A32]">
                      {rev.drug} · {rev.dose} ({rev.route})
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        rev.verdict === 'riesgo_o_excesivo'
                          ? 'text-rose-700'
                          : rev.verdict === 'adecuado'
                            ? 'text-[#1F4B3A]'
                            : isPartial
                              ? 'text-sky-800'
                              : 'text-amber-800'
                      }`}
                    >
                      {rev.verdict === 'riesgo_o_excesivo'
                        ? 'Iatrogenia / Contraindicado'
                        : rev.verdict === 'adecuado'
                          ? 'Adecuado'
                          : isPartial
                            ? 'Coadyuvante / Parcial'
                            : isIrrelevant
                              ? 'Sin indicación aguda'
                              : 'Sin impacto agudo'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#55685F] leading-relaxed">{rev.comment}</p>
                  <div className="text-[10px] font-mono tabular-nums text-[#43866B] font-medium">
                    {rev.deltaSummary}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Rubric Breakdown Grid (7 Categories WITH Why Score & Missing Items) */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#263A32] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#43866B] shrink-0" />
              <span>Desglose Detallado: ¿Por qué obtuviste cada puntaje y qué faltó?</span>
            </h3>
            <p className="text-xs text-[#55685F] mt-0.5">
              Cada apartado muestra exactamente la justificación de tu calificación, tus aciertos y los puntos específicos por mejorar.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#1F4B3A] bg-[#E4F1E8] px-3 py-1 rounded-lg font-bold shrink-0">
            Total: {totalScore} / 100 pts
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
          {rubricItems.map((item) => {
            const pct = Math.round((item.score / item.max) * 100);
            return (
              <div
                key={item.key}
                className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#263A32] text-xs sm:text-sm">{item.name}</span>
                    <span className="font-mono tabular-nums font-bold text-[#263A32] text-sm shrink-0 bg-white px-2.5 py-0.5 rounded-lg border border-[#E2EAE4]">
                      {item.score}{' '}
                      <span className="text-[#718078] font-normal text-xs">/ {item.max}</span>
                    </span>
                  </div>

                  <div className="w-full bg-[#E2EAE4] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                        item.score,
                        item.max
                      )}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {item.detail ? (
                    <div className="space-y-2.5 pt-1 text-xs">
                      <div className="bg-white border border-[#E2EAE4] rounded-lg p-2.5 text-[#263A32] leading-relaxed">
                        <span className="font-bold text-[#43866B] block mb-0.5">
                          ¿Por qué este puntaje?
                        </span>
                        {item.detail.whyScore}
                      </div>

                      {item.detail.strengths.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F4B3A] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                            Lo que hiciste bien
                          </span>
                          <ul className="space-y-1 text-[11px] sm:text-xs text-[#263A32] pl-1">
                            {item.detail.strengths.map((s, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1.5">
                                <span className="text-[#43866B] font-bold">·</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.detail.missingOrImprove.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            Qué faltó / Cómo mejorar
                          </span>
                          <ul className="space-y-1 text-[11px] sm:text-xs text-amber-950 pl-1">
                            {item.detail.missingOrImprove.map((m, mIdx) => (
                              <li key={mIdx} className="flex items-start gap-1.5">
                                <span className="text-amber-700 font-bold">·</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#55685F]">{item.fallbackDesc}</p>
                  )}
                </div>

                {item.detail?.expectedStandard && (
                  <div className="pt-2 border-t border-[#E2EAE4] text-[11px] text-[#55685F]">
                    <span className="font-semibold text-[#263A32]">Estándar esperado: </span>
                    {item.detail.expectedStandard}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Academic Debriefing Section */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-6 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-6">
        <div className="border-b border-[#E2EAE4] pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#43866B] shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
              Sesión Clínico-Patológica Didáctica: Diagnósticos, Estudios y Tratamiento
            </h3>
          </div>
          <span className="text-xs text-[#55685F] font-medium">Normativa MINSA Nicaragua · Guías OMS / OPS / AHA / NICE</span>
        </div>

        {/* 1. Diagnóstico Comparativo y Fisiopatología */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
            <Target className="w-4 h-4 shrink-0" />
            <span>1. Diagnóstico Definitivo, Comparativa y Fisiopatología</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#55685F]">
                {isEcoeMode && !isExpressDiag ? 'Tu Diagnóstico y Justificación' : 'Tu Diagnóstico Propuesto'}
              </div>
              <div className="text-sm font-bold text-[#263A32]">
                {userSummary?.primaryDiagnosis || 'No registraste diagnóstico principal'}
              </div>
              {((isEcoeMode && !isExpressDiag) || Boolean(userSummary?.clinicalJustification)) && (
                <p className="text-xs text-[#55685F] leading-relaxed">
                  {userSummary?.clinicalJustification
                    ? userSummary.clinicalJustification
                    : 'No ingresaste justificación clínica escrita.'}
                </p>
              )}
            </div>

            <div className="bg-[#E4F1E8]/60 p-4 rounded-xl border border-[#72A98A] space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F4B3A]">
                Diagnóstico Real de Referencia
              </div>
              <div className="text-sm font-bold text-[#263A32]">{solution.correctDiagnosis}</div>
              <p className="text-xs text-[#263A32] leading-relaxed">
                {feedback.diagnosisAccuracyComment}
              </p>
            </div>
          </div>

          <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-3">
            <div className="text-xs font-bold text-[#43866B] uppercase tracking-wider">
              ¿Por qué ocurre esta enfermedad y cómo produce el cuadro del paciente? (Fisiopatología Causal)
            </div>
            <p className="text-xs sm:text-sm text-[#263A32] leading-relaxed">{solution.pathophysiology}</p>

            {pathophysiologyMatrix && (
              <div className="space-y-3 pt-2 border-t border-[#E2EAE4]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-semibold text-[#43866B]">Mecanismo Celular y Molecular</div>
                    <p className="text-[#263A32] leading-relaxed">{pathophysiologyMatrix.cellularAndMolecular}</p>
                  </div>
                  <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-semibold text-[#43866B]">Alteración Anatómica y Funcional</div>
                    <p className="text-[#263A32] leading-relaxed">{pathophysiologyMatrix.anatomicalAndFunctional}</p>
                  </div>
                  <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-semibold text-[#43866B]">Repercusión Hemodinámica y Metabólica</div>
                    <p className="text-[#263A32] leading-relaxed">{pathophysiologyMatrix.hemodynamicAndMetabolic}</p>
                  </div>
                  <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1">
                    <div className="text-[11px] font-semibold text-[#43866B]">Respuesta Inflamatoria e Inmunológica</div>
                    <p className="text-[#263A32] leading-relaxed">{pathophysiologyMatrix.inflammatoryAndImmunologic}</p>
                  </div>
                </div>

                {pathophysiologyMatrix.symptomCorrelations.length > 0 && (
                  <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="text-[11px] font-semibold text-[#263A32]">
                      Correlación Fisiopatológica de Signos Vitales y Exploración del Caso
                    </div>
                    <ul className="space-y-1.5 text-[#55685F]">
                      {pathophysiologyMatrix.symptomCorrelations.map((cor, cIdx) => (
                        <li key={cIdx} className="leading-relaxed">
                          <span className="font-semibold text-[#263A32]">{cor.clinicalFeature}:</span>{' '}
                          {cor.causalMechanism}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pathophysiologyMatrix.labAndImagingCorrelations.length > 0 && (
                  <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="text-[11px] font-semibold text-[#263A32]">
                      Correlación entre Mecanismo y Resultados Paraclínicos Reales del Caso
                    </div>
                    <ul className="space-y-1.5 text-[#55685F]">
                      {pathophysiologyMatrix.labAndImagingCorrelations.map((lab, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          <span className="font-semibold text-[#263A32]">{lab.studyName}</span>{' '}
                          <span className="font-mono text-[11px] text-[#43866B]">({lab.abnormalFinding})</span>:{' '}
                          {lab.physiologicalExplanation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {isEcoeMode && !isExpressDiag && feedback.reasoningEvaluation && (
              <div className="pt-2 border-t border-[#E2EAE4] text-xs text-[#55685F]">
                <span className="font-semibold text-[#263A32]">Evaluación de tu razonamiento: </span>
                {feedback.reasoningEvaluation}
              </div>
            )}
          </div>
        </div>

        {/* 2. Pistas Cardinales y Signos Característicos */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 shrink-0" />
            <span>2. Claves Clínicas y Signos Característicos del Cuadro</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#55685F]">
                Pistas que Orientaban al Diagnóstico
              </div>
              <ul className="space-y-1.5 text-xs text-[#263A32]">
                {solution.keyClinicalClues.map((clue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#43866B] shrink-0 mt-0.5" />
                    <span>{clue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#55685F]">
                Signos y Síntomas Típicos & Hallazgos Físicos Clave
              </div>
              <ul className="space-y-1.5 text-xs text-[#263A32]">
                {(solution.characteristicSignsSymptoms || []).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#43866B] font-bold">·</span>
                    <span>{s}</span>
                  </li>
                ))}
                {(caseData.physicalExamPool || [])
                  .filter((pe) => pe.isAbnormal)
                  .slice(0, 4)
                  .map((pe) => (
                    <li key={pe.id} className="flex items-start gap-2 text-[#55685F]">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 border ${
                          requestedExamSet.has(pe.name)
                            ? 'bg-[#E4F1E8] text-[#1F4B3A] border-[#72A98A]'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {requestedExamSet.has(pe.name) ? 'Explorado' : 'Omitido'}
                      </span>
                      <span>
                        <strong className="text-[#263A32]">{pe.name}:</strong> {pe.finding}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Diagnósticos Diferenciales Didácticos */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#43866B]">
            {isEcoeMode && !isExpressDiag
              ? '3. Análisis de Diagnósticos Diferenciales y Claves para Descartarlos'
              : '3. Diagnósticos Diferenciales de Referencia y Claves para Descartarlos (Repaso)'}
          </h4>

          {isEcoeMode && !isExpressDiag && (
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#55685F] font-semibold">Tus diferenciales:</span>
                {userSummary?.differentialDiagnoses && userSummary.differentialDiagnoses.length > 0 ? (
                  userSummary.differentialDiagnoses.map((d, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border border-[#E2EAE4] text-[#263A32] font-medium">
                      {d}
                    </span>
                  ))
                ) : (
                  <span className="text-amber-800 italic">No registraste diagnósticos diferenciales.</span>
                )}
              </div>
              <p className="text-xs text-[#55685F]">{feedback.differentialEvaluation}</p>
            </div>
          )}

          {differentialMatrix && differentialMatrix.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {differentialMatrix.map((item, idx) => (
                <div key={idx} className="bg-[#F8FBF9] p-3.5 rounded-xl border border-[#E2EAE4] space-y-1.5 text-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold text-[#263A32]">{item.diagnosis}</span>
                    <span
                      className={`text-[11px] font-semibold ${
                        item.qualitativeProbability === 'No omitir (riesgo vital)'
                          ? 'text-rose-700'
                          : item.qualitativeProbability === 'Alta probabilidad clínica'
                            ? 'text-[#1F4B3A]'
                            : 'text-[#55685F]'
                      }`}
                    >
                      {item.qualitativeProbability}
                    </span>
                  </div>
                  <p className="text-[#55685F] leading-relaxed">
                    <strong className="text-[#263A32]">A favor:</strong> {item.findingsFor.join(' ')}
                  </p>
                  <p className="text-[#55685F] leading-relaxed">
                    <strong className="text-[#263A32]">En contra / Descarte:</strong> {item.findingsAgainst.join(' ')}
                  </p>
                  <p className="text-[#43866B] text-[11px] pt-1 border-t border-[#E2EAE4]">
                    <strong className="text-[#263A32]">Prueba clave de contraste:</strong> {item.confirmatoryWorkup}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(differentialExplanations && differentialExplanations.length > 0
                ? differentialExplanations
                : (solution.differentialDiagnoses || []).map((d, i) => ({
                    diagnosis: d,
                    rationale:
                      (solution.criticalRulingOutFactors && solution.criticalRulingOutFactors[i]) ||
                      `Comparte presentación clínica inicial, pero se descarta con el interrogatorio dirigido, exploración física y paraclínicos.`,
                  }))
              ).map((item, idx) => (
                <div key={idx} className="bg-[#F8FBF9] p-3.5 rounded-xl border border-[#E2EAE4] space-y-1">
                  <div className="text-xs font-bold text-[#263A32]">{item.diagnosis}</div>
                  <p className="text-xs text-[#55685F] leading-relaxed">{item.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {validatedClinicalScales && validatedClinicalScales.length > 0 && (
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-2.5 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
                Escalas y Herramientas Clínicas Validadas (Según Población del Caso)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {validatedClinicalScales.map((sc, sIdx) => (
                  <div key={sIdx} className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-bold text-[#263A32]">{sc.scaleName}</span>
                      <span
                        className={`text-[10px] font-semibold ${
                          sc.eligibilityStatus === 'aplicable' ? 'text-[#43866B]' : 'text-amber-800'
                        }`}
                      >
                        {sc.eligibilityStatus === 'aplicable' ? 'Población validada' : 'Fuera de población validada'}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#718078]">Población: {sc.validatedPopulation}</div>
                    <p className="text-[#263A32] leading-relaxed">{sc.criteriaSummary}</p>
                    <p className="text-[#55685F] leading-relaxed">{sc.clinicalInterpretation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(solution.criticalRulingOutFactors || []).length > 0 && (
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#55685F]">
                Pautas Semiológicas Adicionales de Descarte
              </div>
              <ul className="space-y-1 text-xs text-[#263A32]">
                {solution.criticalRulingOutFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#43866B] font-bold">·</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 4. Interpretación Docente de Estudios (Primarios, Solicitados y Relacionados como TAC/Rx/US) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 shrink-0" />
              <span>4. Interpretación de Estudios e Imágenes (Hallazgos Primarios y Relacionados)</span>
            </h4>
            {normalUnrequestedStudies.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllNormalStudies((prev) => !prev)}
                className="min-h-[34px] text-[11px] text-[#43866B] hover:text-[#1F4B3A] font-semibold flex items-center gap-1 cursor-pointer"
              >
                {showAllNormalStudies ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Ocultar estudios normales no solicitados ({normalUnrequestedStudies.length})</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Ver también estudios normales no solicitados ({normalUnrequestedStudies.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3.5 text-xs text-[#263A32] space-y-1">
            <div>
              <span className="font-bold text-[#43866B]">Auditoría de tu solicitud de estudios: </span>
              {feedback.workupCritique}
            </div>
            {(solution.recommendedWorkup || []).length > 0 && (
              <div className="text-[#55685F]">
                <span className="font-semibold text-[#263A32]">Abordaje paraclínico recomendado: </span>
                {solution.recommendedWorkup.join(' · ')}
              </div>
            )}
          </div>

          <div className="bg-[#F8FBF9] p-3.5 sm:p-4 rounded-xl border border-[#E2EAE4] space-y-2.5">
            {(showAllNormalStudies ? allStudies : relevantOrRequestedStudies).map((std) => {
              const wasRequested = requestedStudySet.has(std.name);
              return (
                <div
                  key={std.id}
                  className={`p-3 rounded-xl border text-xs bg-white ${
                    std.isAbnormal
                      ? 'border-amber-300'
                      : 'border-[#E2EAE4]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-[#263A32] font-bold">{std.name}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          wasRequested
                            ? 'bg-[#E4F1E8] text-[#1F4B3A] border-[#72A98A]'
                            : 'bg-[#F8FBF9] text-[#55685F] border-[#E2EAE4]'
                        }`}
                      >
                        {wasRequested ? 'Solicitado por ti' : 'No solicitado'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          std.isAbnormal
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-[#F8FBF9] text-[#55685F] border-[#E2EAE4]'
                        }`}
                      >
                        {std.isAbnormal ? 'Hallazgo Alterado / Relacionado' : 'Normal / Descarte'}
                      </span>
                    </div>
                  </div>
                  <div className="text-[#263A32] font-mono text-[11px] mb-1 break-words">{std.result}</div>
                  {std.interpretation && (
                    <div className="text-[#55685F] italic pt-1.5 border-t border-[#E2EAE4] text-[11px]">
                      <span className="font-semibold text-[#43866B] not-italic">Interpretación clínica: </span>
                      {std.interpretation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Esquema Terapéutico Completo y Conducta Médica (Tu Plan vs Ideal) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#43866B] flex items-center gap-1.5">
            <Pill className="w-4 h-4 shrink-0" />
            <span>5. Clase Magistral de Tratamiento, Dosis y Conducta Integral</span>
          </h4>

          {/* Comparativa rápida de lo que propuso el usuario vs lo óptimo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#55685F]">
                Lo que Tú Propusiste
              </div>
              {userSummary?.pharmacologicalPlan && userSummary.pharmacologicalPlan.length > 0 ? (
                <ul className="space-y-1.5 text-[#263A32]">
                  {userSummary.pharmacologicalPlan.map((m) => (
                    <li key={m.id} className="bg-white px-2.5 py-1.5 rounded-lg border border-[#E2EAE4]">
                      <span className="font-bold">{m.drug || 'Fármaco sin nombre'}</span>{' '}
                      <span className="text-[#55685F]">
                        — {[m.dose, m.route, m.frequency, m.duration].filter(Boolean).join(' · ') || 'Sin posología detallada'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-amber-800 italic">No prescribiste ningún fármaco.</p>
              )}
              <div className="pt-2 border-t border-[#E2EAE4] space-y-1 text-[#55685F]">
                <p>
                  <span className="font-semibold text-[#263A32]">Destino propuesto:</span>{' '}
                  {userSummary?.hospitalizationDecision || 'Sin definir'}
                </p>
                <p>
                  <span className="font-semibold text-[#263A32]">Medidas generales:</span>{' '}
                  {userSummary?.generalMeasures || 'No especificadas'}
                </p>
              </div>
            </div>

            <div className="bg-[#E4F1E8]/55 p-4 rounded-xl border border-[#72A98A] space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F4B3A]">
                Retroalimentación Terapéutica Directa
              </div>
              <p className="text-[#263A32] leading-relaxed">{feedback.treatmentCritique}</p>
              <div className="pt-2 border-t border-[#72A98A]/40 space-y-1 text-[#263A32]">
                <p>
                  <span className="font-semibold text-[#1F4B3A]">Destino óptimo indicado:</span>{' '}
                  {solution.optimalTreatment.hospitalizationDecision}
                </p>
                {(solution.criticalSafetyAlerts || []).length > 0 && (
                  <div className="flex items-start gap-1.5 text-amber-900 pt-1">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Precaución terapéutica clave:</strong>{' '}
                      {solution.criticalSafetyAlerts[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Análisis fármaco por fármaco de lo que el usuario propuso */}
          {(proposedTreatmentReviews !== undefined || generalMeasuresCritique) && (
            <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#263A32] flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                  <span>Análisis de tu Tratamiento Propuesto (Fármaco por Fármaco)</span>
                </div>
                {proposedTreatmentReviews && proposedTreatmentReviews.length > 0 && (
                  <span className="text-[10px] font-semibold text-[#55685F]">
                    {proposedTreatmentReviews.length} fármaco(s) evaluado(s)
                  </span>
                )}
              </div>

              {proposedTreatmentReviews && proposedTreatmentReviews.length > 0 ? (
                <div className="space-y-2.5">
                  {proposedTreatmentReviews.map((rev) => {
                    const cardStyle =
                      rev.verdict === 'acertado'
                        ? 'bg-[#E4F1E8]/55 border-[#72A98A]'
                        : rev.verdict === 'alternativa_valida'
                          ? 'bg-sky-50/70 border-sky-300'
                          : rev.verdict === 'coadyuvante_sintomatico'
                            ? 'bg-white border-[#72A98A]/70'
                            : rev.verdict === 'riesgoso_o_contraindicado'
                              ? 'bg-rose-50 border-rose-300'
                              : 'bg-amber-50/70 border-amber-300';

                    const badgeStyle =
                      rev.verdict === 'acertado'
                        ? 'bg-[#E4F1E8] text-[#1F4B3A] border-[#72A98A]'
                        : rev.verdict === 'alternativa_valida'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : rev.verdict === 'coadyuvante_sintomatico'
                            ? 'bg-[#F8FBF9] text-[#263A32] border-[#E2EAE4]'
                            : rev.verdict === 'riesgoso_o_contraindicado'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300';

                    return (
                      <div key={rev.id} className={`rounded-xl border p-3 text-xs space-y-1.5 ${cardStyle}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#263A32] text-xs sm:text-sm">{rev.drug}</span>
                            <span className="text-[11px] text-[#55685F] font-mono">{rev.doseSummary}</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${badgeStyle}`}>
                            {rev.verdictLabel}
                          </span>
                        </div>

                        {rev.pharmacologicalGroup && (
                          <div className="text-[11px] text-[#55685F]">
                            <span className="font-semibold text-[#263A32]">Grupo y mecanismo:</span>{' '}
                            {rev.pharmacologicalGroup}
                            {rev.mechanismOfAction ? ` · ${rev.mechanismOfAction}` : ''}
                          </div>
                        )}

                        {rev.matchedReferenceDrug && (
                          <div className="text-[11px] text-[#43866B]">
                            <span className="font-semibold text-[#263A32]">Comparado con referencia: </span>
                            {rev.matchedReferenceDrug}
                          </div>
                        )}

                        <p className="text-[#263A32] leading-relaxed">{rev.clinicalComment}</p>

                        {rev.timingOrIndicationIssue && (
                          <p className="text-[11px] text-amber-900 bg-white/75 border border-amber-200 rounded-lg px-2.5 py-1.5">
                            <strong>Momento e indicación clínica:</strong> {rev.timingOrIndicationIssue}
                          </p>
                        )}

                        {rev.doseAdjustmentAlert && (
                          <p className="text-[11px] text-[#263A32] bg-white/75 border border-[#E2EAE4] rounded-lg px-2.5 py-1.5">
                            <strong>Ajustes y verificación posológica:</strong> {rev.doseAdjustmentAlert}
                          </p>
                        )}

                        {(rev.posologyNote || rev.monitoringPlan || rev.therapeuticAlternatives) && (
                          <div className="text-[11px] text-[#55685F] pt-1.5 border-t border-[#E2EAE4] space-y-1">
                            {rev.posologyNote && <p>{rev.posologyNote}</p>}
                            {rev.monitoringPlan && (
                              <p>
                                <strong className="text-[#263A32]">Monitorización:</strong> {rev.monitoringPlan}
                              </p>
                            )}
                            {rev.therapeuticAlternatives && (
                              <p>
                                <strong className="text-[#263A32]">Alternativas terapéuticas:</strong>{' '}
                                {rev.therapeuticAlternatives}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-amber-800 italic">
                  No propusiste fármacos en tu prescripción definitiva para comentar individualmente. Revisa abajo el esquema óptimo sugerido para este cuadro.
                </p>
              )}

              {generalMeasuresCritique && (
                <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 text-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#43866B] block">
                    Valoración de tus Medidas Generales y Soporte No Farmacológico
                  </span>
                  <p className="text-[#263A32] leading-relaxed">{generalMeasuresCritique}</p>
                </div>
              )}
            </div>
          )}

          {/* Protocolo STAT / de Urgencias recomendado (si el caso lo requiere) */}
          {statAudit?.requiresUrgentStat && statAudit.recommendedStatProtocol && statAudit.recommendedStatProtocol.length > 0 && (
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Fase 1 · Protocolo STAT y de Urgencias Recomendado (Estabilización Aguda)</span>
                </div>
                <span className="text-[10px] font-semibold text-amber-900 bg-white border border-amber-300 px-2.5 py-0.5 rounded-md font-mono tabular-nums">
                  Cubiertos: {(statAudit.matchedStatDrugs || []).length}/{statAudit.recommendedStatProtocol.length}
                </span>
              </div>
              {statAudit.statGuidanceComment && (
                <p className="text-xs text-amber-950 leading-relaxed">{statAudit.statGuidanceComment}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {statAudit.recommendedStatProtocol.map((st, idx) => (
                  <div key={idx} className="bg-white border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#263A32]">{st.drug}</span>
                      <span className="text-[10px] font-semibold text-amber-800">{st.timing}</span>
                    </div>
                    <div className="text-[#43866B]">
                      <strong className="text-[#263A32]">Dosis / Vía:</strong> {st.dose} · {st.route}
                    </div>
                    <p className="text-[11px] text-[#55685F] italic">{st.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#F8FBF9] p-4 rounded-xl border border-[#E2EAE4] space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
              {statAudit?.requiresUrgentStat
                ? 'Fase 2 · Esquema Terapéutico Óptimo de Referencia (Definitivo / Mantenimiento y Días)'
                : 'Esquema Terapéutico Óptimo Ambulatorio de Referencia (Fármaco por Fármaco)'}
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-2.5">
              {solution.optimalTreatment.pharmacological.map((rx, idx) => (
                <div key={idx} className="bg-white border border-[#E2EAE4] rounded-xl p-3 text-xs space-y-1.5">
                  <div className="font-bold text-[#263A32]">{rx.drug}</div>
                  <div className="text-[#263A32]">
                    <span className="text-[#55685F] font-semibold">Dosis:</span> {rx.dose}
                  </div>
                  <div className="text-[#43866B] font-medium">
                    <span className="text-[#55685F] font-semibold">Vía y frecuencia:</span> {rx.route} · {rx.frequency}
                  </div>
                  <div className="text-[#1F4B3A] font-medium">
                    <span className="text-[#55685F] font-semibold">Duración:</span> {rx.duration || 'Según evolución clínica'}
                  </div>
                  <div className="text-[#55685F] italic">{rx.rationale}</div>
                </div>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-[#E2EAE4]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2EAE4] bg-[#F8FBF9] text-[#55685F] uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 font-bold">Fármaco</th>
                    <th className="py-2.5 px-3 font-bold">Dosis Recomendada</th>
                    <th className="py-2.5 px-3 font-bold">Vía y Frecuencia</th>
                    <th className="py-2.5 px-3 font-bold">Duración / Días</th>
                    <th className="py-2.5 px-3 font-bold">¿Por qué se indica? (Racional Clínico)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EAE4] font-sans">
                  {solution.optimalTreatment.pharmacological.map((rx, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-[#263A32]">{rx.drug}</td>
                      <td className="py-2.5 px-3 text-[#263A32]">{rx.dose}</td>
                      <td className="py-2.5 px-3 text-[#43866B] font-medium">
                        {rx.route} · {rx.frequency}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#1F4B3A]">
                        {rx.duration || 'Según evolución clínica'}
                      </td>
                      <td className="py-2.5 px-3 text-[#55685F] italic">{rx.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-[#E2EAE4] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#263A32]">
              <div className="space-y-1">
                <span className="font-semibold text-[#43866B] block">Medidas Generales y Soporte:</span>
                <ul className="space-y-1 pl-4 list-disc">
                  {solution.optimalTreatment.generalMeasures.map((gm, idx) => (
                    <li key={idx}>{gm}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-[#43866B] block">Criterios de Referencia / UCI:</span>
                  <ul className="space-y-1 pl-4 list-disc">
                    {(solution.optimalTreatment.referralCriteria || []).map((rc, idx) => (
                      <li key={idx}>{rc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-[#43866B] block">Plan de Seguimiento Clínico:</span>
                  <p className="text-[#55685F]">{solution.optimalTreatment.followUp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5b. Síntesis de Errores Cometidos, Riesgos Clínicos y Conducta Esperada (Puntos 8-10) */}
        <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#263A32] font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Síntesis Docente: Errores, Riesgos y Conducta que Debió Realizarse</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1.5">
              <span className="font-bold text-[#263A32] block">8. Errores u omisiones detectadas</span>
              <ul className="space-y-1 text-[#55685F]">
                {(criticalSafetyErrors.length > 0
                  ? criticalSafetyErrors
                  : rubricItems.flatMap((r) => r.detail?.missingOrImprove || []).slice(0, 3)
                ).length > 0 ? (
                  (criticalSafetyErrors.length > 0
                    ? criticalSafetyErrors
                    : rubricItems.flatMap((r) => r.detail?.missingOrImprove || []).slice(0, 3)
                  ).map((item, idx) => <li key={idx}>· {item}</li>)
                ) : (
                  <li className="text-[#1F4B3A]">· Sin omisiones mayores ni errores de seguridad relevantes.</li>
                )}
              </ul>
            </div>

            <div className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1.5">
              <span className="font-bold text-rose-800 block">9. Riesgos y consecuencias clínicas</span>
              <p className="text-[#55685F] leading-relaxed">
                {criticalSafetyErrors.length > 0
                  ? `Riesgo iatrogénico o de deterioro fisiopatológico directo: ${criticalSafetyErrors.join(' ')}`
                  : safetyNonCompensation?.applied
                    ? safetyNonCompensation.reason
                    : rationalUseAudit?.redFlagsSafetyNote ||
                      'Retrasar confirmación diagnóstica o ajustar inadecuadamente la dosis según peso/función orgánica incrementa la morbimortalidad evitable.'}
              </p>
            </div>

            <div className="bg-[#E4F1E8]/55 border border-[#72A98A] rounded-xl p-3 space-y-1.5">
              <span className="font-bold text-[#1F4B3A] block">10. Conducta que debió realizarse</span>
              <p className="text-[#263A32] leading-relaxed">
                Confirmar <strong className="text-[#1F4B3A]">{solution.correctDiagnosis}</strong>, solicitar estudios clave (
                {(solution.recommendedWorkup || []).slice(0, 2).join(', ') || 'paraclínicos dirigidos'}), instaurar{' '}
                {solution.optimalTreatment.pharmacological[0]
                  ? `${solution.optimalTreatment.pharmacological[0].drug} (${solution.optimalTreatment.pharmacological[0].dose}, ${solution.optimalTreatment.pharmacological[0].route})`
                  : 'soporte no farmacológico dirigido'}{' '}
                y definir destino: <strong>{solution.optimalTreatment.hospitalizationDecision}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Perlas Pedagógicas y Alertas de Seguridad */}
        <div className="bg-[#E4F1E8]/55 border border-[#72A98A] rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#1F4B3A] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Perlas Clínicas y Puntos Clave para el Examen y la Guardia</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#263A32] pl-5 list-disc">
            {feedback.pedagogicalPearls.map((pearl, idx) => (
              <li key={idx}>{pearl}</li>
            ))}
            {(solution.criticalSafetyAlerts || []).map((alert, idx) => (
              <li key={`alert-${idx}`} className="text-amber-900">
                <strong>Alerta de seguridad:</strong> {alert}
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Errores Frecuentes, Trazabilidad Científica, Discrepancias y Descargo Educativo */}
        <div className="text-[11px] text-[#55685F] border-t border-[#E2EAE4] pt-3 space-y-3">
          {caseData.clinicalMetadata?.frequentErrors && caseData.clinicalMetadata.frequentErrors.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-1">
              <span className="font-semibold text-amber-900 uppercase tracking-wide block">
                Errores Frecuentes a Evitar en Este Cuadro:
              </span>
              <ul className="space-y-0.5 text-amber-950 pl-4 list-disc">
                {caseData.clinicalMetadata.frequentErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Clasificación explícita de certeza científica del caso */}
          <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3 py-2 space-y-0.5">
            <div className="font-semibold text-[#263A32]">
              Nivel de certeza asignado al caso:{' '}
              <span className="text-[#43866B]">
                {CERTAINTY_TIER_META[caseData.clinicalMetadata?.certaintyTier || 'guia_clinica'].label}
              </span>
            </div>
            <div className="text-[#55685F]">
              {CERTAINTY_TIER_META[caseData.clinicalMetadata?.certaintyTier || 'guia_clinica'].description}{' '}
              Se diferencia de evidencia emergente, opinión experta o áreas de incertidumbre científica.
            </div>
          </div>

          {/* Estado honesto de verificación de la base científica */}
          <div
            className={`rounded-xl border px-3 py-2 flex items-start gap-2 ${
              knowledgeAudit.isVerifiedAgainstRemote
                ? 'bg-[#F0F7F2] border-[#C8DCD0] text-[#263A32]'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#43866B]" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-700" />
            )}
            <span className="leading-relaxed">{knowledgeAudit.verificationNotice}</span>
          </div>

          {/* Discrepancias documentadas entre guías aplicables al caso */}
          {knowledgeAudit.activeDiscrepancies.length > 0 && (
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-950 uppercase tracking-wide">
                <GitCompare className="w-3.5 h-3.5 shrink-0 text-indigo-700" />
                <span>Discrepancias Documentadas Entre Guías Clínicas</span>
              </div>
              {knowledgeAudit.activeDiscrepancies.map((item, idx) => (
                <div key={idx} className="bg-white/90 border border-indigo-100 rounded-lg p-2.5 space-y-1.5">
                  <div className="font-semibold text-[#263A32]">
                    {item.discrepancy.topic} <span className="text-[10px] font-normal text-[#718078]">({item.recordTitle})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded p-2">
                      <span className="font-semibold text-[#43866B] block">
                        {item.discrepancy.guidelineA.source} ({item.discrepancy.guidelineA.version})
                      </span>
                      <span className="text-[#263A32]">{item.discrepancy.guidelineA.position}</span>
                    </div>
                    <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded p-2">
                      <span className="font-semibold text-indigo-800 block">
                        {item.discrepancy.guidelineB.source} ({item.discrepancy.guidelineB.version})
                      </span>
                      <span className="text-[#263A32]">{item.discrepancy.guidelineB.position}</span>
                    </div>
                  </div>
                  <p className="text-[#263A32] leading-relaxed">
                    <strong>Explicación clínica:</strong> {item.discrepancy.clinicalExplanation}
                  </p>
                  {item.discrepancy.localAdaptationNote && (
                    <p className="text-[#43866B] leading-relaxed">
                      <strong>Contexto Nicaragua / OPS LATAM:</strong> {item.discrepancy.localAdaptationNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Alertas de prácticas obsoletas o seguridad farmacológica regulatoria */}
          {knowledgeAudit.obsoleteAlerts.length > 0 && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-rose-900 uppercase tracking-wide">
                <Ban className="w-3.5 h-3.5 shrink-0 text-rose-700" />
                <span>Prácticas Desaconsejadas / Superadas en Este Escenario</span>
              </div>
              {knowledgeAudit.obsoleteAlerts.map((item, idx) => (
                <div key={idx} className="space-y-0.5 text-rose-950">
                  <div>
                    <strong>Evitar:</strong> {item.alert.outdatedPractice} ({item.alert.replacedSince})
                  </div>
                  <div>
                    <strong>Estándar vigente:</strong> {item.alert.currentStandard} — {item.alert.whyObsolete}
                  </div>
                </div>
              ))}
            </div>
          )}

          {knowledgeAudit.drugAlerts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900 uppercase tracking-wide">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                <span>Alertas Regulatorias y Seguridad Farmacológica (FDA / EMA / OPS)</span>
              </div>
              {knowledgeAudit.drugAlerts.map((item, idx) => (
                <div key={idx} className="space-y-0.5 text-amber-950">
                  <div>
                    <strong>{item.alert.genericName}</strong> ({item.alert.regulatorySource}): {item.alert.clinicalImpact}
                  </div>
                  <div className="text-[10px] text-amber-800">{item.alert.doseVerificationNote}</div>
                </div>
              ))}
            </div>
          )}

          {/* Fichas versionadas vinculadas de la Base de Conocimiento */}
          {knowledgeAudit.matchedRecords.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-semibold text-[#263A32] uppercase tracking-wide block">
                Base Científica Versionada Vinculada al Caso:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {knowledgeAudit.matchedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-2.5 space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-semibold text-[#263A32]">{rec.title}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#D4E2DA] text-[#43866B]">
                        {rec.guideVersion}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#E4F1E8] text-[#1F4B3A] font-medium">
                        {CERTAINTY_TIER_META[rec.certaintyTier].shortLabel}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white border border-[#E2EAE4] text-[#55685F]">
                        {VALIDITY_STATUS_META[rec.validityStatus].label}
                      </span>
                      <span className="text-[#718078]">
                        Verif.: {rec.lastVerifiedDate} · {rec.regionOrCountry}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#55685F] leading-snug">
                      {rec.bibliographicReference}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="font-semibold text-[#263A32] uppercase tracking-wide block mb-1">
              Referencias Bibliográficas y Guías de Práctica Clínica del Caso:
            </span>
            <ul className="space-y-0.5 text-[#55685F] pl-4 list-disc">
              {(caseData.clinicalMetadata?.evidenceSources || solution.guidelineReferences).map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2EAE4] text-[10px] text-[#718078]">
            <span>
              Última revisión clínica del caso:{' '}
              <strong className="text-[#263A32]">{caseData.clinicalMetadata?.lastReviewed || '2026-10-15'}</strong>
              {caseData.clinicalMetadata?.guideVersion ? ` · ${caseData.clinicalMetadata.guideVersion}` : ''}
              {caseData.clinicalMetadata?.regionOrCountry ? ` · ${caseData.clinicalMetadata.regionOrCountry}` : ''}
              {caseData.clinicalMetadata?.reviewedBy ? ` · ${caseData.clinicalMetadata.reviewedBy}` : ''}
            </span>
            <span>
              {caseData.clinicalMetadata?.educationalDisclaimer ||
                'Herramienta educativa; no sustituye el juicio clínico ni los protocolos institucionales locales.'}
            </span>
          </div>
        </div>
      </div>

      {/* Cátedra Clínica de Bolsillo / Clase Magistral Teórico-Práctica al Final de la Auditoría */}
      <div className="bg-white border border-[#72A98A] rounded-2xl p-4 sm:p-6 shadow-[0_2px_8px_rgba(38,58,50,0.05)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2EAE4] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#43866B] text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Clase Magistral de Estudio · {masterclass.specialtyLabel}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#263A32] tracking-tight">
              {masterclass.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowMasterclass((prev) => !prev)}
            className="min-h-[38px] text-xs font-semibold text-[#263A32] hover:text-[#1F4B3A] bg-[#F8FBF9] hover:bg-[#E4F1E8] border border-[#E2EAE4] px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {showMasterclass ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Contraer clase</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Ver clase magistral</span>
              </>
            )}
          </button>
        </div>

        {showMasterclass && (
          <div className="space-y-4 text-xs sm:text-[13px]">
            {/* Enfoque Teórico y Fisiopatológico */}
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
                Panorama Teórico de la Patología
              </div>
              <p className="text-[#263A32] leading-relaxed">{masterclass.overviewNarrative}</p>
            </div>

            {/* Narrativa de Anamnesis y Examen Físico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Anamnesis y Perfil Clínico Típico</span>
                </div>
                <p className="text-[#263A32] leading-relaxed">{masterclass.anamnesisStudy}</p>
              </div>

              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
                  <Stethoscope className="w-4 h-4 shrink-0" />
                  <span>Examen Físico y Signos Esperados</span>
                </div>
                <p className="text-[#263A32] leading-relaxed">{masterclass.physicalExamStudy}</p>
              </div>
            </div>

            {/* Parámetros Clínicos, Laboratorio e Imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1F4B3A]">
                  <Activity className="w-4 h-4 text-[#43866B] shrink-0" />
                  <span>Parámetros Clínicos y Datos de Laboratorio</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#263A32] pl-4 list-disc">
                  {masterclass.clinicalParametersAndLabs.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#43866B]">
                  <FlaskConical className="w-4 h-4 shrink-0" />
                  <span>Estudios de Imagen y Gabinete Esperados</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#263A32] pl-4 list-disc">
                  {masterclass.imagingAndCabinetFindings.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Síntesis Terapéutica de Estudio */}
            <div className="bg-[#E4F1E8]/45 border border-[#72A98A] rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1F4B3A]">
                  <Pill className="w-4 h-4 text-[#43866B] shrink-0" />
                  <span>Esquema Terapéutico y Conducta de Estudio (Urgencias + Ambulatorio/Sostén)</span>
                </div>
                {masterclass.treatmentDisposition && (
                  <span className="text-[11px] font-semibold text-[#1F4B3A] bg-white border border-[#72A98A] px-2.5 py-1 rounded-lg">
                    Conducta: {masterclass.treatmentDisposition}
                  </span>
                )}
              </div>

              {masterclass.requiresUrgentStat && masterclass.statProtocol.length > 0 && (
                <div className="bg-amber-50/75 border border-amber-300 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Abordaje STAT y de Urgencias (Primeros Minutos)</span>
                  </div>
                  <div className="space-y-1.5">
                    {masterclass.statProtocol.map((st, idx) => (
                      <div key={idx} className="text-xs text-[#263A32] bg-white border border-amber-200 rounded-lg px-2.5 py-2">
                        <span className="font-bold text-[#263A32]">{st.drug}</span>{' '}
                        <span className="text-amber-800 font-mono">({st.dose} · {st.route})</span>{' '}
                        <span className="text-[#43866B]">· {st.timing}</span>
                        {st.rationale && <div className="text-[11px] text-[#55685F] mt-0.5">{st.rationale}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {masterclass.treatmentRegimens.length > 0 ? (
                <div className="space-y-2">
                  {masterclass.treatmentRegimens.map((reg, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1.5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-xs sm:text-[13px] font-bold text-[#263A32]">
                          {idx + 1}. {reg.drug}
                        </span>
                        <span className="text-[11px] font-semibold text-[#1F4B3A]">
                          Duración: {reg.duration}
                        </span>
                      </div>
                      <div className="text-xs text-[#55685F] flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          <strong className="text-[#43866B]">Dosis:</strong> {reg.dose}
                        </span>
                        <span>
                          <strong className="text-[#43866B]">Vía:</strong> {reg.route}
                        </span>
                        <span>
                          <strong className="text-[#43866B]">Frecuencia:</strong> {reg.frequency}
                        </span>
                      </div>
                      {reg.rationale && (
                        <p className="text-[11px] text-[#55685F] leading-relaxed">{reg.rationale}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-[13px] text-[#263A32] leading-relaxed">
                  El abordaje central descansa en medidas no farmacológicas y soporte clínico.
                </p>
              )}

              {masterclass.treatmentSupportMeasures.length > 0 && (
                <div className="text-xs text-[#263A32] space-y-1 pt-1.5 border-t border-[#72A98A]/35">
                  <span className="font-semibold text-[#1F4B3A] block">Soporte no farmacológico clave:</span>
                  <ul className="pl-4 list-disc space-y-0.5 text-[#263A32]">
                    {masterclass.treatmentSupportMeasures.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {masterclass.treatmentSafetyRule && (
                <div className="text-xs text-amber-950 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 leading-relaxed">
                  <strong className="text-amber-900">Regla de oro de seguridad:</strong> {masterclass.treatmentSafetyRule}
                </div>
              )}
            </div>

            {/* Perlas Semiológicas Clave y su Explicación */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Perlas Semiológicas Clave y su Explicación Clínica</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {masterclass.semiologicalPearls.map((pearl, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E2EAE4] rounded-xl p-3 space-y-1"
                  >
                    <div className="text-xs font-bold text-[#263A32] flex items-start gap-1.5">
                      <span className="text-[#43866B] font-mono">{idx + 1}.</span>
                      <span>{pearl.title}</span>
                    </div>
                    <p className="text-xs text-[#55685F] leading-relaxed">
                      {pearl.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={onNextCase}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-[#43866B] hover:bg-[#356D56] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>Siguiente Caso Clínico</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
