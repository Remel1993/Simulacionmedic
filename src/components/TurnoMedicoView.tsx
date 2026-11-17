import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HospitalSelect } from './HospitalSelect';
import {
  ClinicalCase,
  ClinicalEvolutionState,
  ChatMessage,
  MedicationItem,
  StatInterventionRecord,
  TurnoMedicoConfig,
  TurnoPatientResult,
  UserEvaluationInput,
  VitalSigns,
} from '../types/clinical';
import { applyStatIntervention, STAT_QUICK_PRESETS, StatPreset } from '../utils/statStabilization';
import { generateContextualPatientReply, humanizeMedicalJargon, humanizeReason } from '../engine/patientEngine';
import { evaluateClinicalEvolutionStep } from '../engine/clinicalEvolution';
import { buildLivePhysicalExams, buildLiveStudies } from '../engine/liveClinicalSync';
import { evaluateClinicalCaseLocally, evaluateClinicalOutcomeLocally } from '../engine/evaluationEngine';
import { deriveDisclosedBackground } from '../utils/backgroundDisclosure';
import { StudyTracingViewer, detectTracingKind } from './StudyTracingViewer';
import { ClinicalAuditTab } from './ClinicalAuditTab';
import { PatientVisualCard } from './PatientVisualCard';
import {
  Zap,
  Users,
  Timer,
  LogOut,
  HeartPulse,
  Thermometer,
  Wind,
  Activity,
  Brain,
  MessageSquare,
  Stethoscope,
  FlaskConical,
  Send,
  Search,
  CheckCircle2,
  AlertTriangle,
  Skull,
  HeartHandshake,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Home,
  X,
  Syringe,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface TurnoMedicoViewProps {
  config: TurnoMedicoConfig;
  cases: ClinicalCase[];
  onExitTurno: () => void;
  onStartNewTurno: (config: TurnoMedicoConfig) => void;
  onPatientResolved: (result: TurnoPatientResult) => void;
}

interface PatientDraftState {
  caseId: string;
  messages: ChatMessage[];
  liveVitalSigns: VitalSigns;
  statInterventions: StatInterventionRecord[];
  evolutionState?: ClinicalEvolutionState;
  unlockedExamIds: string[];
  unlockedStudyIds: string[];
  primaryDiagnosis: string;
  medications: MedicationItem[];
  elapsedSeconds: number;
  lastEvolutionSecond: number;
  result?: TurnoPatientResult;
  immediateDeathAlert?: {
    drug: string;
    dose: string;
    route: string;
    reason: string;
  } | null;
}

const QUICK_INTERROGATION_PROMPTS = [
  {
    id: 'q-inicio',
    label: 'Inicio, evolución y dolor',
    prompt: '¿Cuándo y cómo le empezaron estas molestias, cómo han cambiado y qué las empeora o calma?',
  },
  {
    id: 'q-asociados',
    label: 'Síntomas asociados y alarma',
    prompt: '¿Ha tenido calentura, falta de aire, mareos, vómitos, sangrado u otra molestia?',
  },
  {
    id: 'q-antecedentes',
    label: 'Enfermedades y cirugías',
    prompt: '¿Sufre de alguna enfermedad de hace tiempo, ha estado internado o lo han operado antes?',
  },
  {
    id: 'q-meds-alergias',
    label: 'Alergias y medicación actual',
    prompt: '¿Es alérgico a algún medicamento y qué medicinas toma todos los días o se ha tomado para esto?',
  },
  {
    id: 'q-habitos-fam',
    label: 'Hábitos, familia y exposición',
    prompt: '¿Fuma, toma alcohol, hay enfermedades en su familia o convivió con alguien enfermo o viajó hace poco?',
  },
];

function createInitialDraft(caseData: ClinicalCase): PatientDraftState {
  const isPediatric = caseData.patientInfo.age < 12;
  const naturalReason = humanizeReason(caseData.patientInfo.consultReason, isPediatric);
  const naturalEvo = humanizeMedicalJargon(caseData.patientInfo.evolutionTime || 'un rato', isPediatric)
    .replace(/\s+de\s+evoluci[oó]n.*/i, '')
    .replace(/\s+con\s+esto\b/gi, '')
    .trim()
    .toLowerCase();
  const greetingText = isPediatric
    ? `Doctor, traje rápido a ${caseData.patientInfo.name.replace(/\s*\([^)]*\)/, '')} porque tiene ${naturalReason}${naturalEvo ? ` desde hace ${naturalEvo}` : ''}.`
    : `Doctor, vengo por ${naturalReason}${naturalEvo ? `. Empecé hace ${naturalEvo}` : ''}.`;

  const initialEvo = evaluateClinicalEvolutionStep({
    caseData,
    baselineVitals: caseData.vitalSigns,
    currentVitals: caseData.vitalSigns,
    elapsedSeconds: 0,
    statInterventions: [],
    unlockedExamCount: 0,
    unlockedStudyCount: 0,
    lastEvaluatedSecond: 0,
  });

  return {
    caseId: caseData.id,
    messages: [
      {
        id: `turno-init-${caseData.id}`,
        sender: 'patient',
        text: greetingText,
        timestamp: 'Ingreso',
      },
    ],
    liveVitalSigns: caseData.vitalSigns,
    statInterventions: [],
    evolutionState: initialEvo.evolutionState,
    unlockedExamIds: [],
    unlockedStudyIds: [],
    primaryDiagnosis: '',
    medications: [],
    elapsedSeconds: 0,
    lastEvolutionSecond: 0,
  };
}

function formatTimer(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getTriageShortBadge(triage: string): { label: string; className: string } {
  if (triage.includes('Nivel I')) {
    return { label: 'N-I Crítico', className: 'bg-rose-50 border-rose-300 text-rose-800' };
  }
  if (triage.includes('Nivel II')) {
    return { label: 'N-II Emergencia', className: 'bg-amber-50 border-amber-300 text-amber-900' };
  }
  if (triage.includes('Nivel III')) {
    return { label: 'N-III Urgencia', className: 'bg-sky-50 border-sky-300 text-sky-800' };
  }
  return { label: 'N-IV/V Consulta', className: 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]' };
}

export const TurnoMedicoView: React.FC<TurnoMedicoViewProps> = ({
  config,
  cases,
  onExitTurno,
  onStartNewTurno,
  onPatientResolved,
}) => {
  const [drafts, setDrafts] = useState<Record<string, PatientDraftState>>(() => {
    const map: Record<string, PatientDraftState> = {};
    for (const c of cases) {
      map[c.id] = createInitialDraft(c);
    }
    return map;
  });

  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [flashResultCaseId, setFlashResultCaseId] = useState<string | null>(null);
  const [shiftSummaryOpen, setShiftSummaryOpen] = useState<boolean>(false);
  const [auditModalCaseId, setAuditModalCaseId] = useState<string | null>(null);
  const [confirmExit, setConfirmExit] = useState<boolean>(false);

  // Timers
  const [shiftElapsedSeconds, setShiftElapsedSeconds] = useState<number>(0);
  const shiftAutoEndedRef = useRef<boolean>(false);

  // Custom Question & Filter States (cleared on patient change)
  const [customQuestion, setCustomQuestion] = useState('');
  const [examSystemFilter, setExamSystemFilter] = useState<string>('Todos');
  const [studyCategoryFilter, setStudyCategoryFilter] = useState<'Todos' | 'Laboratorio' | 'Imagen' | 'Gabinete y Trazados'>('Todos');
  const [studySearch, setStudySearch] = useState('');
  const [statCategoryFilter, setStatCategoryFilter] = useState<string>('Todos');
  const [customStatDrug, setCustomStatDrug] = useState('');
  const [customStatDose, setCustomStatDose] = useState('');
  const [customStatRoute] = useState('Intravenosa (IV)');

  const activeCase = cases[activeCaseIndex] || cases[0];
  const activeDraft = activeCase ? drafts[activeCase.id] : undefined;

  // Reset per-patient ephemeral UI inputs when changing patient
  useEffect(() => {
    setCustomQuestion('');
    setExamSystemFilter('Todos');
    setStudyCategoryFilter('Todos');
    setStudySearch('');
    setCustomStatDrug('');
    setCustomStatDose('');
  }, [activeCase?.id]);

  // Resolved list
  const resolvedResults = useMemo(() => {
    return cases
      .map((c) => drafts[c.id]?.result)
      .filter((r): r is TurnoPatientResult => Boolean(r));
  }, [cases, drafts]);

  const allResolved = cases.length > 0 && resolvedResults.length === cases.length;

  // Update helper
  const updateDraft = (caseId: string, updater: (prev: PatientDraftState) => PatientDraftState) => {
    setDrafts((prev) => {
      const current = prev[caseId];
      if (!current) return prev;
      return { ...prev, [caseId]: updater(current) };
    });
  };

  // Finalize patient evaluation cleanly (Diagnosis-only Express Mode)
  const resolvePatient = (caseItem: ClinicalCase, draftSnapshot: PatientDraftState) => {
    if (draftSnapshot.result) return;

    const doctorQuestions = draftSnapshot.messages.filter((m) => m.sender === 'doctor').map((m) => m.text);

    const submission: UserEvaluationInput = {
      primaryDiagnosis: draftSnapshot.primaryDiagnosis,
      differentialDiagnoses: [],
      clinicalJustification: '',
      additionalStudiesNeeded: '',
      pharmacologicalPlan: draftSnapshot.medications,
      generalMeasures: '',
      hospitalizationDecision: '',
      referralCriteria: '',
      followUpPlan: '',
      unlockedExams: draftSnapshot.unlockedExamIds,
      unlockedStudies: draftSnapshot.unlockedStudyIds,
      questionCount: doctorQuestions.length,
      doctorQuestions,
      timeSpentSeconds: draftSnapshot.elapsedSeconds,
      statInterventions: draftSnapshot.statInterventions,
      baselineVitalSigns: caseItem.vitalSigns,
      finalVitalSigns: draftSnapshot.liveVitalSigns,
      expressDiagnosticOnly: true,
    };

    const evaluation = evaluateClinicalCaseLocally(submission, caseItem);
    const outcome = evaluateClinicalOutcomeLocally(evaluation, caseItem);

    const turnoResult: TurnoPatientResult = {
      caseData: caseItem,
      evaluation,
      outcomeStatus: outcome.status,
      outcomeHeadline: outcome.headline,
      timeSpentSeconds: draftSnapshot.elapsedSeconds,
      diagCorrect: evaluation.breakdown.primaryDiagnosis >= 17,
    };

    updateDraft(caseItem.id, (prev) => ({
      ...prev,
      immediateDeathAlert: null,
      result: turnoResult,
    }));

    onPatientResolved(turnoResult);
    setFlashResultCaseId(caseItem.id);
  };

  // Ref to latest resolve function for timer auto-submit
  const latestResolveRef = useRef<(c: ClinicalCase, d: PatientDraftState) => void>(() => {});
  latestResolveRef.current = (c, d) => resolvePatient(c, d);

  const latestAutoEndShiftRef = useRef<() => void>(() => {});
  latestAutoEndShiftRef.current = () => {
    for (const c of cases) {
      const d = drafts[c.id];
      if (d && !d.result) {
        resolvePatient(c, d);
      }
    }
    setFlashResultCaseId(null);
    setShiftSummaryOpen(true);
  };

  // Shift & Active Patient Timer
  useEffect(() => {
    if (shiftSummaryOpen || allResolved || !activeCase || !activeDraft) return;
    const isFlashViewing = Boolean(flashResultCaseId);
    if (isFlashViewing) return;

    const timer = window.setInterval(() => {
      setShiftElapsedSeconds((prev) => prev + 1);
      if (!activeDraft.result) {
        updateDraft(activeCase.id, (prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [shiftSummaryOpen, allResolved, flashResultCaseId, activeCase?.id, activeDraft?.result]);

  // Clinical evolution every 30s in active patient
  useEffect(() => {
    if (!activeCase || !activeDraft || activeDraft.result || shiftSummaryOpen || flashResultCaseId) return;
    if (activeDraft.elapsedSeconds - activeDraft.lastEvolutionSecond < 30) return;

    const step = evaluateClinicalEvolutionStep({
      caseData: activeCase,
      baselineVitals: activeCase.vitalSigns,
      currentVitals: activeDraft.liveVitalSigns,
      elapsedSeconds: activeDraft.elapsedSeconds,
      statInterventions: activeDraft.statInterventions,
      unlockedExamCount: activeDraft.unlockedExamIds.length,
      unlockedStudyCount: activeDraft.unlockedStudyIds.length,
      lastEvaluatedSecond: activeDraft.lastEvolutionSecond,
    });

    updateDraft(activeCase.id, (prev) => ({
      ...prev,
      lastEvolutionSecond: step.evolutionState.lastEvaluatedSecond,
      evolutionState: step.evolutionState,
      liveVitalSigns: step.changed ? step.updatedVitals : prev.liveVitalSigns,
    }));
  }, [activeDraft?.elapsedSeconds, activeCase?.id]);

  // Auto-submit on per_patient_180 or global_720 expiration
  useEffect(() => {
    if (shiftSummaryOpen || allResolved) return;
    if (config.timerMode === 'per_patient_180' && activeCase && activeDraft && !activeDraft.result) {
      if (activeDraft.elapsedSeconds >= 180) {
        latestResolveRef.current(activeCase, activeDraft);
      }
    } else if (config.timerMode === 'global_720' && !shiftAutoEndedRef.current) {
      if (shiftElapsedSeconds >= 720) {
        shiftAutoEndedRef.current = true;
        latestAutoEndShiftRef.current();
      }
    }
  }, [activeDraft?.elapsedSeconds, shiftElapsedSeconds, config.timerMode, shiftSummaryOpen, allResolved]);

  const handleAskQuestion = (questionText: string) => {
    if (!activeCase || !activeDraft || activeDraft.result) return;
    const isDeceased =
      activeDraft.statInterventions.some((s) => s.isImmediateDeath) ||
      activeDraft.liveVitalSigns.heartRate === 0;
    if (isDeceased || activeDraft.liveVitalSigns.glasgow <= 9) return;

    const clean = questionText.trim();
    if (!clean) return;

    const docMsg: ChatMessage = {
      id: `t-doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: 'doctor',
      text: clean,
      timestamp: formatTimer(activeDraft.elapsedSeconds),
    };

    const nextHistory = [...activeDraft.messages, docMsg];
    const replyText = generateContextualPatientReply({
      history: activeDraft.messages,
      userMessage: clean,
      patientPersona: activeCase.internalPersonaPrompt,
      patientInfo: activeCase.patientInfo,
      vitalSigns: activeCase.vitalSigns,
      liveVitalSigns: activeDraft.liveVitalSigns,
      isDeceased,
      appliedStatInterventions: activeDraft.statInterventions.map((s) => ({
        label: s.label,
        drug: s.drug,
        dose: s.dose,
        route: s.route,
        effectSeverity: s.effectSeverity,
        patientFeelingNote: s.patientFeelingNote,
        deltasSummary: s.deltas.map((d) => `${d.metric} ${d.before}->${d.after}`).join(', '),
      })),
      background: activeCase.background,
      clinicalClues: activeCase.solution.keyClinicalClues,
      characteristicSymptoms: activeCase.solution.characteristicSignsSymptoms,
      specialty: activeCase.specialty,
      caseId: activeCase.id,
    });

    const patMsg: ChatMessage = {
      id: `t-pat-${Date.now() + 1}-${Math.random().toString(36).slice(2, 6)}`,
      sender: 'patient',
      text: replyText,
      timestamp: formatTimer(activeDraft.elapsedSeconds),
    };

    updateDraft(activeCase.id, (prev) => ({
      ...prev,
      messages: [...prev.messages, docMsg, patMsg],
    }));
  };

  const handleApplyStat = (presetOrCustom: {
    presetId?: string;
    label: string;
    drug: string;
    dose: string;
    route: string;
    frequency?: string;
    duration?: string;
  }) => {
    if (!activeCase || !activeDraft || activeDraft.result) return;
    const isDeceased =
      activeDraft.statInterventions.some((s) => s.isImmediateDeath) ||
      activeDraft.liveVitalSigns.heartRate === 0;
    if (isDeceased) return;

    const outcome = applyStatIntervention(
      activeDraft.liveVitalSigns,
      activeCase.vitalSigns,
      activeCase,
      presetOrCustom,
      activeDraft.statInterventions,
      activeDraft.elapsedSeconds
    );

    const nextStats = [...activeDraft.statInterventions, outcome.record];
    const evoAfterStat = evaluateClinicalEvolutionStep({
      caseData: activeCase,
      baselineVitals: activeCase.vitalSigns,
      currentVitals: outcome.updatedVitals,
      elapsedSeconds: activeDraft.elapsedSeconds,
      statInterventions: nextStats,
      unlockedExamCount: activeDraft.unlockedExamIds.length,
      unlockedStudyCount: activeDraft.unlockedStudyIds.length,
      lastEvaluatedSecond: activeDraft.elapsedSeconds,
    });

    updateDraft(activeCase.id, (prev) => {
      const normalizedNew = `${outcome.medicationItem.drug.toLowerCase()}::${outcome.medicationItem.dose.toLowerCase()}::${outcome.medicationItem.route.toLowerCase()}`;
      const exists = prev.medications.some(
        (m) => `${m.drug.toLowerCase()}::${m.dose.toLowerCase()}::${m.route.toLowerCase()}` === normalizedNew
      );
      const nextMeds = exists
        ? prev.medications
        : [...prev.medications, { ...outcome.medicationItem, phase: 'stat_urgencias' as const }];

      const sysMsg: ChatMessage = {
        id: `t-sys-${Date.now()}`,
        sender: 'system',
        text: `STAT aplicado: ${outcome.record.drug} ${outcome.record.dose} (${outcome.record.route}).`,
        timestamp: formatTimer(prev.elapsedSeconds),
      };

      const reactionMsg: ChatMessage = {
        id: `t-pat-stat-${Date.now() + 1}`,
        sender: 'patient',
        text: outcome.record.patientFeelingNote,
        timestamp: formatTimer(prev.elapsedSeconds),
      };

      return {
        ...prev,
        liveVitalSigns: outcome.updatedVitals,
        statInterventions: nextStats,
        evolutionState: evoAfterStat.evolutionState,
        lastEvolutionSecond: prev.elapsedSeconds,
        medications: nextMeds,
        messages: [...prev.messages, sysMsg, reactionMsg],
        immediateDeathAlert: outcome.isImmediateDeath
          ? {
              drug: outcome.record.drug,
              dose: outcome.record.dose,
              route: outcome.record.route,
              reason: outcome.immediateDeathReason || outcome.record.physiologicalEffectSummary,
            }
          : prev.immediateDeathAlert,
      };
    });
  };

  const handleGoToNextPendingPatient = () => {
    setFlashResultCaseId(null);
    const nextUnresolvedIdx = cases.findIndex((c) => !drafts[c.id]?.result);
    if (nextUnresolvedIdx >= 0) {
      setActiveCaseIndex(nextUnresolvedIdx);
    } else {
      setShiftSummaryOpen(true);
    }
  };

  // Live synced exams & studies for active patient
  const liveExams = useMemo(() => {
    if (!activeCase || !activeDraft) return [];
    return buildLivePhysicalExams(
      activeCase,
      activeDraft.liveVitalSigns,
      activeDraft.statInterventions,
      activeDraft.evolutionState
    );
  }, [activeCase, activeDraft?.liveVitalSigns, activeDraft?.statInterventions, activeDraft?.evolutionState]);

  const liveStudies = useMemo(() => {
    if (!activeCase || !activeDraft) return [];
    return buildLiveStudies(
      activeCase,
      activeDraft.liveVitalSigns,
      activeDraft.statInterventions,
      activeDraft.evolutionState
    );
  }, [activeCase, activeDraft?.liveVitalSigns, activeDraft?.statInterventions, activeDraft?.evolutionState]);

  const filteredExams = useMemo(() => {
    if (examSystemFilter === 'Todos') return liveExams;
    return liveExams.filter((pe) => pe.system === examSystemFilter);
  }, [liveExams, examSystemFilter]);

  const filteredStudies = useMemo(() => {
    const q = studySearch.trim().toLowerCase();
    return liveStudies
      .filter((s) => studyCategoryFilter === 'Todos' || s.category === studyCategoryFilter)
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.subcategory.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
  }, [liveStudies, studyCategoryFilter, studySearch]);

  const filteredStatPresets = useMemo(() => {
    if (statCategoryFilter === 'Todos') return STAT_QUICK_PRESETS;
    return STAT_QUICK_PRESETS.filter((p) => p.category === statCategoryFilter);
  }, [statCategoryFilter]);

  const flashResult = flashResultCaseId ? drafts[flashResultCaseId]?.result : undefined;
  const auditTarget = auditModalCaseId ? drafts[auditModalCaseId]?.result : undefined;

  // Balance Final metrics
  const shiftMetrics = useMemo(() => {
    const total = resolvedResults.length;
    if (total === 0) {
      return { total: 0, saved: 0, stabilized: 0, morbidityOrDeath: 0, diagOk: 0, avgScore: 0 };
    }
    const saved = resolvedResults.filter((r) => r.outcomeStatus === 'saved').length;
    const stabilized = resolvedResults.filter((r) => r.outcomeStatus === 'stabilized_morbidity').length;
    const morbidityOrDeath = resolvedResults.filter(
      (r) => r.outcomeStatus === 'critical_morbidity' || r.outcomeStatus === 'deceased'
    ).length;
    const diagOk = resolvedResults.filter((r) => r.diagCorrect).length;
    const avgScore = Math.round(resolvedResults.reduce((acc, r) => acc + r.evaluation.totalScore, 0) / total);
    return { total, saved, stabilized, morbidityOrDeath, diagOk, avgScore };
  }, [resolvedResults]);

  if (!activeCase || !activeDraft) return null;

  const isDeceased =
    activeDraft.statInterventions.some((s) => s.isImmediateDeath) ||
    activeDraft.liveVitalSigns.heartRate === 0 ||
    (activeDraft.liveVitalSigns.bloodPressure || '').startsWith('0/');

  const disclosedBg = deriveDisclosedBackground(activeDraft.messages, Boolean(activeDraft.result));
  const perPatientRemaining = Math.max(0, 180 - activeDraft.elapsedSeconds);
  const globalRemaining = Math.max(0, 720 - shiftElapsedSeconds);

  return (
    <div className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-5 py-4 space-y-4">
      {/* Turno Header Bar */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-3.5 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
                  Modo Turno Médico · Guardia Express
                </h1>
                <span className="text-xs font-semibold text-[#43866B] whitespace-nowrap">
                  · {config.profile === 'mixto'
                    ? 'Guardia Mixta'
                    : config.profile === 'consulta_rapida'
                    ? 'Consulta Rápida'
                    : 'Urgencias / Choque'}
                </span>
              </div>
              <p className="text-xs text-[#55685F] mt-0.5">
                Pacientes atendidos: <strong className="text-[#263A32] tabular-nums">{resolvedResults.length} / {cases.length}</strong> · Prioriza por triage o atiende en cola rápida.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Timer */}
            {config.timerMode === 'per_patient_180' ? (
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono tabular-nums text-xs flex items-center gap-1.5 ${
                  perPatientRemaining <= 30
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Timer className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] font-medium">Paciente:</span>
                <strong>{formatTimer(perPatientRemaining)}</strong>
              </div>
            ) : config.timerMode === 'global_720' ? (
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono tabular-nums text-xs flex items-center gap-1.5 ${
                  globalRemaining <= 90
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-sky-50 border-sky-200 text-sky-900'
                }`}
              >
                <Timer className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] font-medium">Turno Total:</span>
                <strong>{formatTimer(globalRemaining)}</strong>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg border bg-[#F8FBF9] border-[#E2EAE4] text-[#263A32] font-mono tabular-nums text-xs flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                <span className="font-sans text-[11px] text-[#55685F]">Turno:</span>
                <strong>{formatTimer(shiftElapsedSeconds)}</strong>
              </div>
            )}

            {resolvedResults.length > 0 && (
              <button
                type="button"
                onClick={() => setShiftSummaryOpen(true)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Balance ({resolvedResults.length})</span>
              </button>
            )}

            {!confirmExit ? (
              <button
                type="button"
                onClick={() => setConfirmExit(true)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F8FBF9] hover:bg-rose-50 border border-[#E2EAE4] hover:border-rose-300 text-[#263A32] hover:text-rose-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Salir</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-300 rounded-lg px-2.5 py-1">
                <span className="text-[11px] text-rose-900 font-semibold">¿Terminar turno?</span>
                <button
                  type="button"
                  onClick={onExitTurno}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                >
                  Sí, salir
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmExit(false)}
                  className="px-2.5 py-1 rounded bg-white border border-[#E2EAE4] text-[#263A32] text-[11px] font-semibold cursor-pointer"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Waiting Room / Triage Queue Strip */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {cases.map((c, idx) => {
            const draft = drafts[c.id];
            const isActive = idx === activeCaseIndex && !shiftSummaryOpen;
            const isDone = Boolean(draft?.result);
            const triage = getTriageShortBadge(c.patientInfo.triageLevel);

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setShiftSummaryOpen(false);
                  setFlashResultCaseId(null);
                  setActiveCaseIndex(idx);
                }}
                className={`min-w-[210px] max-w-[245px] shrink-0 rounded-xl border p-2.5 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-[#E4F1E8] border-[#43866B] ring-1 ring-[#43866B]/30 shadow-sm'
                    : isDone
                    ? 'bg-[#F8FBF9] border-[#72A98A] opacity-90 hover:opacity-100'
                    : 'bg-white border-[#E2EAE4] hover:border-[#72A98A] hover:bg-[#F8FBF9]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#55685F] tabular-nums">
                    CAMA #{idx + 1}
                  </span>
                  {isDone ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E4F1E8] border border-[#72A98A] text-[#1F4B3A] flex items-center gap-1 tabular-nums">
                      <CheckCircle2 className="w-3 h-3 text-[#43866B]" />
                      {draft.result?.evaluation.totalScore}/100
                    </span>
                  ) : (
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${triage.className}`}>
                      {triage.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <PatientVisualCard
                    caseData={c}
                    liveVitals={draft?.liveVitalSigns}
                    isDeceased={
                      Boolean(draft?.immediateDeathAlert) ||
                      draft?.liveVitalSigns?.heartRate === 0 ||
                      (draft?.liveVitalSigns?.bloodPressure || '').startsWith('0/')
                    }
                    variant="thumbnail"
                    className="w-10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#263A32] truncate">
                      {c.patientInfo.name} · {c.patientInfo.age}a
                    </div>
                    <div className="text-[11px] text-[#55685F] line-clamp-1">
                      {c.patientInfo.consultReason}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Either Balance Final, Flash Result Card, or 3-Column Express Workstation */}
      {shiftSummaryOpen || allResolved && !flashResultCaseId ? (
        <section className="bg-white border border-[#E2EAE4] rounded-2xl p-5 sm:p-7 space-y-6 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2EAE4] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#43866B] text-xs font-bold">
                <Award className="w-4 h-4 shrink-0" />
                <span>Balance Clínico del Turno Médico</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#263A32] tracking-tight">
                {allResolved ? 'Guardia Completada' : 'Resumen Parcial del Turno'}
              </h2>
              <p className="text-xs text-[#55685F]">
                Tiempo total en guardia: <strong className="text-[#263A32] font-mono tabular-nums">{formatTimer(shiftElapsedSeconds)}</strong> · Revisa la morbimortalidad, diagnóstico, fase STAT y tratamiento definitivo de cada paciente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!allResolved && (
                <button
                  type="button"
                  onClick={() => setShiftSummaryOpen(false)}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Continuar Atendiendo Pendientes
                </button>
              )}
              <button
                type="button"
                onClick={() => onStartNewTurno(config)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#E4F1E8] hover:bg-[#D4E8DA] border border-[#72A98A] text-[#1F4B3A] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nuevo Turno Igual</span>
              </button>
              <button
                type="button"
                onClick={onExitTurno}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white hover:bg-[#F3F7F4] border border-[#E2EAE4] text-[#263A32] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Panel Principal</span>
              </button>
            </div>
          </div>

          {/* Cohort KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4">
              <div className="text-xs text-[#55685F] font-semibold">Desenlace Favorable</div>
              <div className="text-2xl font-bold text-[#1B5E3F] mt-1 font-mono tabular-nums">
                {shiftMetrics.saved} / {shiftMetrics.total}
              </div>
              <div className="text-[11px] text-[#718078] mt-0.5">Pacientes resueltos sin secuelas</div>
            </div>
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4">
              <div className="text-xs text-[#55685F] font-semibold">Precisión Diagnóstica</div>
              <div className="text-2xl font-bold text-sky-800 mt-1 font-mono tabular-nums">
                {shiftMetrics.diagOk} / {shiftMetrics.total}
              </div>
              <div className="text-[11px] text-[#718078] mt-0.5">Diagnósticos principales acertados</div>
            </div>
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4">
              <div className="text-xs text-[#55685F] font-semibold">Puntaje Promedio</div>
              <div className="text-2xl font-bold text-[#263A32] mt-1 font-mono tabular-nums">
                {shiftMetrics.avgScore} pts
              </div>
              <div className="text-[11px] text-[#718078] mt-0.5">Rúbrica clínica integral /100</div>
            </div>
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4">
              <div className="text-xs text-[#55685F] font-semibold">Eventos Críticos / Mortalidad</div>
              <div className={`text-2xl font-bold mt-1 font-mono tabular-nums ${shiftMetrics.morbidityOrDeath > 0 ? 'text-rose-700' : 'text-[#1B5E3F]'}`}>
                {shiftMetrics.morbidityOrDeath}
              </div>
              <div className="text-[11px] text-[#718078] mt-0.5">Morbimortalidad severa evitada o ocurrida</div>
            </div>
          </div>

          {/* Patient Roster Audit List */}
          <div className="space-y-3">
            {cases.map((c, idx) => {
              const res = drafts[c.id]?.result;
              if (!res) {
                return (
                  <div
                    key={c.id}
                    className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#43866B]">Cama #{idx + 1} · {c.patientInfo.name}</span>
                      <p className="text-xs text-[#55685F] mt-0.5">Aún sin finalizar ({c.patientInfo.consultReason})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShiftSummaryOpen(false);
                        setActiveCaseIndex(idx);
                      }}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Atender Ahora
                    </button>
                  </div>
                );
              }

              const statusBadge =
                res.outcomeStatus === 'saved'
                  ? 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]'
                  : res.outcomeStatus === 'stabilized_morbidity'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-rose-50 border-rose-300 text-rose-800';

              const statAudit = res.evaluation.statAudit;

              return (
                <div
                  key={c.id}
                  className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#55685F]">Cama #{idx + 1}</span>
                        <span className="text-sm font-bold text-[#263A32]">{c.patientInfo.name} ({c.patientInfo.age}a)</span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusBadge}`}>
                          {res.outcomeHeadline}
                        </span>
                      </div>
                      <div className="text-xs text-[#263A32]">
                        <strong className="text-[#43866B]">Dx Real:</strong> {c.solution.correctDiagnosis} ·{' '}
                        <strong className="text-[#55685F]">Tu Dx:</strong>{' '}
                        {res.evaluation.userSummary?.primaryDiagnosis || 'No especificado'}
                      </div>
                      {statAudit?.requiresUrgentStat && (
                        <div className="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mt-1">
                          <strong>STAT/Urgencias:</strong> {statAudit.statGuidanceComment}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold font-mono tabular-nums text-[#263A32]">
                          {res.evaluation.totalScore}/100
                        </div>
                        <div className="text-[10px] text-[#55685F] font-mono tabular-nums">
                          {formatTimer(res.timeSpentSeconds)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAuditModalCaseId(c.id)}
                        className="min-h-[38px] px-3.5 py-2 rounded-lg bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Auditoría y Clase</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : flashResult ? (
        /* Flash Inter-Patient Outcome Card */
        <section className="bg-white border border-[#E2EAE4] rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto space-y-5 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2EAE4] pb-4">
            <div className="flex items-center gap-3">
              <PatientVisualCard
                caseData={flashResult.caseData}
                isDeceased={flashResult.outcomeStatus === 'deceased'}
                variant="thumbnail"
                className="w-16"
              />
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                  flashResult.outcomeStatus === 'saved'
                    ? 'bg-[#E4F1E8] border-[#72A98A] text-[#43866B]'
                    : flashResult.outcomeStatus === 'stabilized_morbidity'
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-rose-50 border-rose-300 text-rose-700'
                }`}
              >
                {flashResult.outcomeStatus === 'saved' ? (
                  <HeartHandshake className="w-5 h-5" />
                ) : flashResult.outcomeStatus === 'deceased' ? (
                  <Skull className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-[#55685F]">
                  Desenlace Rápido · {flashResult.caseData.patientInfo.name}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#263A32]">
                  {flashResult.outcomeHeadline}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold font-mono tabular-nums text-[#263A32]">
                {flashResult.evaluation.totalScore}
                <span className="text-sm text-[#55685F] font-semibold"> /100</span>
              </div>
              <div className="text-[11px] text-[#55685F] font-mono tabular-nums">
                Tiempo: {formatTimer(flashResult.timeSpentSeconds)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-1.5">
              <div className="font-bold text-[#43866B]">Diagnóstico</div>
              <p className="text-[#263A32] font-semibold">
                Real: {flashResult.caseData.solution.correctDiagnosis}
              </p>
              <p className="text-[#55685F]">
                Tu impresión: {flashResult.evaluation.userSummary?.primaryDiagnosis || 'Sin diagnóstico registrado'}
              </p>
              <p className="text-[#263A32] pt-1 leading-relaxed">
                {flashResult.evaluation.feedback.diagnosisAccuracyComment}
              </p>
            </div>

            <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-4 space-y-1.5">
              <div className="font-bold text-amber-800">
                Manejo de Referencia para Estudio
              </div>
              {flashResult.evaluation.statAudit?.requiresUrgentStat && (
                <p className="text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                  <strong>Fase STAT / Urgencias:</strong>{' '}
                  {flashResult.evaluation.statAudit.recommendedStatProtocol
                    ?.slice(0, 3)
                    .map((p) => `${p.drug} ${p.dose} (${p.route})`)
                    .join(' · ')}
                </p>
              )}
              <p className="text-[#263A32] leading-relaxed">
                <strong>Esquema Definitivo:</strong>{' '}
                {flashResult.caseData.solution.optimalTreatment.pharmacological
                  .slice(0, 3)
                  .map((p) => `${p.drug} ${p.dose} (${p.duration})`)
                  .join(' · ')}{' '}
                · <strong>Destino:</strong> {flashResult.caseData.solution.optimalTreatment.hospitalizationDecision}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAuditModalCaseId(flashResult.caseData.id)}
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3F7F4] border border-[#E2EAE4] text-[#263A32] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#43866B]" />
              <span>Ver Auditoría Completa y Clase Magistral</span>
            </button>

            <button
              type="button"
              onClick={handleGoToNextPendingPatient}
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#43866B] hover:bg-[#356D56] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <span>
                {cases.some((c) => !drafts[c.id]?.result)
                  ? 'Siguiente Paciente en Sala'
                  : 'Ver Balance Final del Turno'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      ) : (
        /* 3-Column Express Workstation */
        <div className="space-y-3.5">
          {/* Compact Live Vital Signs Telemetry Strip */}
          <div className="bg-white border border-[#E2EAE4] rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
              <div className="font-bold text-[#263A32] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#43866B]" />
                <span>
                  {activeDraft.caseId === activeCase.id && `${activeCase.patientInfo.name}, ${activeCase.patientInfo.age}a (${activeCase.patientInfo.sex})`}
                </span>
              </div>
              <span className="font-mono tabular-nums text-[#263A32] font-semibold flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                PA {activeDraft.liveVitalSigns.bloodPressure}
              </span>
              <span className="font-mono tabular-nums text-[#1B5E3F] font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#43866B]" />
                FC {activeDraft.liveVitalSigns.heartRate} lpm
              </span>
              <span className="font-mono tabular-nums text-sky-800 font-semibold flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-600" />
                FR {activeDraft.liveVitalSigns.respiratoryRate} · SpO₂ {activeDraft.liveVitalSigns.oxygenSaturation}%
              </span>
              <span className="font-mono tabular-nums text-amber-800 font-semibold flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                T° {activeDraft.liveVitalSigns.temperature}°C
              </span>
              <span className="font-mono tabular-nums text-[#263A32] font-semibold flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-[#43866B]" />
                GCS {activeDraft.liveVitalSigns.glasgow}/15
              </span>
              {activeDraft.liveVitalSigns.bloodGlucose !== undefined && (
                <span className="font-mono tabular-nums text-amber-900 font-semibold">
                  Glu {activeDraft.liveVitalSigns.bloodGlucose} mg/dL
                </span>
              )}
            </div>

            {activeDraft.evolutionState?.trajectory && (
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                  activeDraft.evolutionState.trajectory === 'mejorando'
                    ? 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]'
                    : activeDraft.evolutionState.trajectory === 'critico' ||
                      activeDraft.evolutionState.trajectory === 'deterioro'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-[#F8FBF9] border-[#E2EAE4] text-[#55685F]'
                }`}
              >
                Estado: {activeDraft.evolutionState.trajectory}
              </span>
            )}
          </div>

          {/* Immediate Death Banner if iatrogenic fatality occurred */}
          {(activeDraft.immediateDeathAlert || isDeceased) && (
            <div className="bg-rose-50 border border-rose-300 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-900">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-rose-700 shrink-0" />
                <span>
                  <strong className="text-rose-950 uppercase">Fallecimiento Inmediato por Iatrogenia STAT:</strong>{' '}
                  {activeDraft.immediateDeathAlert?.reason || 'Paro cardiorrespiratorio irreversible en monitoreo.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => resolvePatient(activeCase, activeDraft)}
                className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors"
              >
                Registrar Desenlace y Continuar
              </button>
            </div>
          )}

          {/* Already resolved notice when revisiting a completed bed */}
          {activeDraft.result && (
            <div className="bg-[#E4F1E8] border border-[#72A98A] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#1F4B3A]">
                <strong>Paciente ya resuelto:</strong> Obtuviste{' '}
                <strong className="font-mono tabular-nums">{activeDraft.result.evaluation.totalScore}/100</strong> ({activeDraft.result.outcomeHeadline}).
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuditModalCaseId(activeCase.id)}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#43866B] hover:bg-[#356D56] text-white font-semibold cursor-pointer transition-colors"
                >
                  Ver Auditoría y Clase
                </button>
                <button
                  type="button"
                  onClick={handleGoToNextPendingPatient}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white border border-[#E2EAE4] hover:bg-[#F8FBF9] text-[#263A32] font-semibold cursor-pointer transition-colors"
                >
                  Ir a Pendientes
                </button>
              </div>
            </div>
          )}

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* COL 1: Interrogatorio Rápido + Examen Físico (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Motivo e Historia Breve */}
              <div className="bg-white border border-[#E2EAE4] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#263A32] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#43866B]" />
                    <span>1. Historia Express</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#55685F]">
                    {activeDraft.messages.filter((m) => m.sender === 'doctor').length} preguntas
                  </span>
                </div>

                {/* Prognosis-Style Patient Scene Vignette */}
                <PatientVisualCard
                  caseData={activeCase}
                  liveVitals={activeDraft.liveVitalSigns}
                  isDeceased={isDeceased}
                  variant="vignette"
                />

                <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg p-2.5 text-xs text-[#263A32] space-y-1">
                  <div>
                    <strong className="text-[#43866B]">Motivo:</strong> {activeCase.patientInfo.consultReason}
                  </div>
                  <div className="text-[11px] text-[#55685F]">
                    <strong>Evolución:</strong> {activeCase.patientInfo.evolutionTime} · <strong>Ocupación:</strong> {activeCase.patientInfo.occupation}
                  </div>
                </div>

                {/* 5 One-Click Interrogatorio Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_INTERROGATION_PROMPTS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      disabled={Boolean(activeDraft.result) || isDeceased}
                      onClick={() => handleAskQuestion(q.prompt)}
                      className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#F8FBF9] hover:bg-[#E4F1E8] disabled:opacity-45 border border-[#E2EAE4] hover:border-[#72A98A] text-[11px] font-semibold text-[#263A32] cursor-pointer transition-colors"
                    >
                      + {q.label}
                    </button>
                  ))}
                </div>

                {/* Compact Dialogue Feed */}
                <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg p-2.5 max-h-52 overflow-y-auto space-y-2">
                  {activeDraft.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`text-xs rounded-lg px-2.5 py-2 ${
                        m.sender === 'doctor'
                          ? 'bg-[#43866B] text-white ml-4'
                          : m.sender === 'system'
                          ? 'bg-amber-50 border border-amber-200 text-amber-900 text-[11px]'
                          : 'bg-white border border-[#E2EAE4] text-[#263A32] mr-2'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold block mb-0.5 ${
                          m.sender === 'doctor'
                            ? 'text-[#E4F1E8]'
                            : m.sender === 'system'
                            ? 'text-amber-800'
                            : 'text-[#43866B]'
                        }`}
                      >
                        {m.sender === 'doctor' ? 'Médico' : m.sender === 'system' ? 'Monitor STAT' : 'Paciente'} · {m.timestamp}
                      </span>
                      <span className="leading-snug">{m.text}</span>
                    </div>
                  ))}
                </div>

                {/* Disclosed Antecedentes Chips */}
                {(disclosedBg.pathological || disclosedBg.allergies || disclosedBg.currentMedications) && (
                  <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg p-2.5 text-[11px] text-[#263A32] space-y-1">
                    {disclosedBg.pathological && (
                      <div><strong className="text-[#43866B]">Patológicos:</strong> {activeCase.background.pathological.join(' · ')}</div>
                    )}
                    {disclosedBg.currentMedications && (
                      <div><strong className="text-[#43866B]">Fármacos:</strong> {activeCase.background.currentMedications.join(' · ')}</div>
                    )}
                    {disclosedBg.allergies && (
                      <div className="text-rose-800"><strong>Alergias:</strong> {activeCase.background.allergies.join(' · ')}</div>
                    )}
                  </div>
                )}

                {/* Custom Question Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customQuestion.trim()) return;
                    handleAskQuestion(customQuestion);
                    setCustomQuestion('');
                  }}
                  className="flex gap-1.5"
                >
                  <input
                    type="text"
                    value={customQuestion}
                    disabled={Boolean(activeDraft.result) || isDeceased}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Pregunta puntual al paciente..."
                    className="flex-1 min-w-0 bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg px-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
                  />
                  <button
                    type="submit"
                    disabled={!customQuestion.trim() || Boolean(activeDraft.result) || isDeceased}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#43866B] hover:bg-[#356D56] disabled:opacity-45 text-white cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Exploración Física 1-Clic */}
              <div className="bg-white border border-[#E2EAE4] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#263A32] flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#43866B]" />
                    <span>2. Examen Físico (1 clic)</span>
                  </span>
                  <button
                    type="button"
                    disabled={Boolean(activeDraft.result)}
                    onClick={() =>
                      updateDraft(activeCase.id, (prev) => ({
                        ...prev,
                        unlockedExamIds: liveExams.map((e) => e.id),
                      }))
                    }
                    className="px-2.5 py-1 rounded-md bg-[#E4F1E8] hover:bg-[#D4E8DA] border border-[#72A98A] text-[11px] font-semibold text-[#1F4B3A] cursor-pointer transition-colors"
                  >
                    Explorar Todo ({activeDraft.unlockedExamIds.length}/{liveExams.length})
                  </button>
                </div>

                {/* System Filter */}
                <HospitalSelect
                  variant="compact"
                  panelTitle="Filtrar por Sistema"
                  value={examSystemFilter}
                  onChange={setExamSystemFilter}
                  options={[
                    { value: 'Todos', label: `Todos los sistemas (${liveExams.length})` },
                    ...['General', 'Cabeza y Cuello', 'Tórax y Pulmones', 'Cardiovascular', 'Abdomen', 'Neurológico', 'Osteomuscular y Piel'].map((sys) => ({
                      value: sys,
                      label: sys,
                    })),
                  ]}
                />

                {/* Neutral clickable maneuver buttons + inline findings */}
                <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5">
                  {filteredExams.map((pe) => {
                    const isUnlocked = activeDraft.unlockedExamIds.includes(pe.id);
                    return (
                      <div
                        key={pe.id}
                        className={`rounded-lg border p-2.5 text-xs transition-colors ${
                          isUnlocked
                            ? pe.isAbnormal
                              ? 'bg-amber-50/70 border-amber-300'
                              : 'bg-[#F8FBF9] border-[#72A98A]'
                            : 'bg-[#F8FBF9] border-[#E2EAE4] hover:border-[#72A98A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-[#55685F] block">
                              {pe.system}
                            </span>
                            <span className="font-semibold text-[#263A32] block truncate">{pe.name}</span>
                          </div>
                          {!isUnlocked && (
                            <button
                              type="button"
                              onClick={() =>
                                updateDraft(activeCase.id, (prev) => ({
                                  ...prev,
                                  unlockedExamIds: prev.unlockedExamIds.includes(pe.id)
                                    ? prev.unlockedExamIds
                                    : [...prev.unlockedExamIds, pe.id],
                                }))
                              }
                              className="min-h-[34px] px-2.5 py-1 rounded-md bg-[#43866B] hover:bg-[#356D56] text-white text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                            >
                              Examinar
                            </button>
                          )}
                        </div>
                        {isUnlocked && (
                          <p className="text-[11px] text-[#263A32] mt-1.5 leading-snug border-t border-[#E2EAE4] pt-1.5">
                            {pe.finding}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COL 2: Estabilización STAT en Vivo + Paraclínicos Rápidos (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* STAT Express Stabilization */}
              <div className="bg-white border border-amber-300 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Syringe className="w-4 h-4 text-amber-700" />
                    <span>3. Estabilización STAT en Vivo</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#55685F]">
                    Aplicadas: {activeDraft.statInterventions.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {['Todos', 'Vía Aérea / O₂', 'Hemodinamia / Líquidos', 'Cardio / Crisis', 'Metabólico / Síntomas'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setStatCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                        statCategoryFilter === cat
                          ? 'bg-amber-600 text-white'
                          : 'bg-[#F8FBF9] text-[#55685F] border border-[#E2EAE4] hover:text-[#263A32]'
                      }`}
                    >
                      {cat === 'Vía Aérea / O₂'
                        ? 'O₂/Resp'
                        : cat === 'Hemodinamia / Líquidos'
                        ? 'Líquidos/Shock'
                        : cat === 'Cardio / Crisis'
                        ? 'Cardio/HTA'
                        : cat === 'Metabólico / Síntomas'
                        ? 'Metab/Sint'
                        : 'Todos'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-0.5">
                  {filteredStatPresets.map((preset: StatPreset) => (
                    <button
                      key={preset.id}
                      type="button"
                      disabled={Boolean(activeDraft.result) || isDeceased}
                      onClick={() =>
                        handleApplyStat({
                          presetId: preset.id,
                          label: preset.label,
                          drug: preset.drug,
                          dose: preset.dose,
                          route: preset.route,
                          frequency: preset.frequency,
                          duration: preset.duration,
                        })
                      }
                      className="px-2.5 py-2 rounded-lg bg-[#F8FBF9] hover:bg-amber-50 disabled:opacity-45 border border-[#E2EAE4] hover:border-amber-400 text-left cursor-pointer transition-colors"
                    >
                      <div className="text-[11px] font-bold text-[#263A32] truncate">{preset.label}</div>
                      <div className="text-[10px] text-amber-800 truncate">{preset.dose} · {preset.route.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>

                {/* Custom STAT quick input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customStatDrug.trim()) return;
                    handleApplyStat({
                      label: customStatDrug.trim(),
                      drug: customStatDrug.trim(),
                      dose: customStatDose.trim() || 'Dosis STAT estándar',
                      route: customStatRoute,
                      frequency: 'Dosis única STAT',
                      duration: 'Fase aguda',
                    });
                    setCustomStatDrug('');
                    setCustomStatDose('');
                  }}
                  className="grid grid-cols-12 gap-1.5 pt-1"
                >
                  <input
                    type="text"
                    value={customStatDrug}
                    onChange={(e) => setCustomStatDrug(e.target.value)}
                    disabled={Boolean(activeDraft.result) || isDeceased}
                    placeholder="Otro STAT (ej. Atropina)"
                    className="col-span-6 bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg px-2.5 py-1.5 text-[11px] text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={customStatDose}
                    onChange={(e) => setCustomStatDose(e.target.value)}
                    disabled={Boolean(activeDraft.result) || isDeceased}
                    placeholder="Dosis"
                    className="col-span-3 bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg px-2 py-1.5 text-[11px] text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!customStatDrug.trim() || Boolean(activeDraft.result) || isDeceased}
                    className="col-span-3 min-h-[34px] rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-45 text-white text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    Aplicar
                  </button>
                </form>

                {activeDraft.statInterventions.length > 0 && (
                  <div className="space-y-1 max-h-24 overflow-y-auto pt-1.5 border-t border-[#E2EAE4]">
                    {activeDraft.statInterventions.map((st) => (
                      <div key={st.id} className="text-[11px] bg-[#F8FBF9] rounded-md px-2.5 py-1.5 border border-[#E2EAE4] flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#263A32] truncate">{st.drug} ({st.dose})</span>
                        <span
                          className={`text-[10px] font-bold shrink-0 ${
                            st.effectSeverity === 'mejoria'
                              ? 'text-[#1B5E3F]'
                              : st.effectSeverity === 'reaccion_adversa'
                              ? 'text-rose-700'
                              : 'text-amber-800'
                          }`}
                        >
                          {st.effectSeverity === 'mejoria'
                            ? 'Mejoría'
                            : st.effectSeverity === 'reaccion_adversa'
                            ? 'Riesgo'
                            : 'Aplicado'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Paraclínicos Rápidos */}
              <div className="bg-white border border-[#E2EAE4] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#263A32] flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-[#43866B]" />
                    <span>4. Paraclínicos Rápidos</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#55685F]">
                    Solicitados: {activeDraft.unlockedStudyIds.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(['Todos', 'Laboratorio', 'Imagen', 'Gabinete y Trazados'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setStudyCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                        studyCategoryFilter === cat
                          ? 'bg-[#43866B] text-white'
                          : 'bg-[#F8FBF9] text-[#55685F] border border-[#E2EAE4] hover:text-[#263A32]'
                      }`}
                    >
                      {cat === 'Gabinete y Trazados' ? 'ECG/Gabinete' : cat}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#718078] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={studySearch}
                    onChange={(e) => setStudySearch(e.target.value)}
                    placeholder="Buscar estudio (BH, ECG, TAC, gaso...)"
                    className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg pl-8 pr-2.5 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
                  />
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-0.5">
                  {filteredStudies.map((std) => {
                    const isUnlocked = activeDraft.unlockedStudyIds.includes(std.id);
                    const hasTracing = isUnlocked && Boolean(detectTracingKind(std));

                    return (
                      <div
                        key={std.id}
                        className={`rounded-lg border p-2.5 text-xs ${
                          isUnlocked
                            ? std.isAbnormal
                              ? 'bg-amber-50/70 border-amber-300'
                              : 'bg-[#F8FBF9] border-[#72A98A]'
                            : 'bg-[#F8FBF9] border-[#E2EAE4] hover:border-[#72A98A]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-[#43866B] block">
                              {std.subcategory}
                            </span>
                            <span className="font-semibold text-[#263A32] block leading-snug">{std.name}</span>
                          </div>
                          {!isUnlocked && (
                            <button
                              type="button"
                              onClick={() =>
                                updateDraft(activeCase.id, (prev) => ({
                                  ...prev,
                                  unlockedStudyIds: prev.unlockedStudyIds.includes(std.id)
                                    ? prev.unlockedStudyIds
                                    : [...prev.unlockedStudyIds, std.id],
                                }))
                              }
                              className="min-h-[34px] px-2.5 py-1 rounded-md bg-[#43866B] hover:bg-[#356D56] text-white text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                            >
                              Solicitar
                            </button>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className="mt-1.5 pt-1.5 border-t border-[#E2EAE4] space-y-1 text-[11px]">
                            <p className="text-[#263A32] leading-snug">{std.result}</p>
                            {std.referenceRange && (
                              <p className="text-[10px] text-[#55685F] font-mono">Ref: {std.referenceRange}</p>
                            )}
                            {hasTracing && (
                              <div className="pt-1">
                                <StudyTracingViewer study={std} vitalSigns={activeDraft.liveVitalSigns} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COL 3: Diagnóstico Express Directo (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!activeDraft.primaryDiagnosis.trim() || activeDraft.result) return;
                  resolvePatient(activeCase, activeDraft);
                }}
                className="bg-white border border-[#72A98A] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-[0_2px_8px_rgba(67,134,107,0.08)]"
              >
                <div className="text-xs font-bold text-[#43866B] flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#43866B]" />
                  <span>5. Diagnóstico Express *</span>
                </div>

                <p className="text-xs text-[#55685F] leading-relaxed">
                  Escribe únicamente tu diagnóstico clínico principal y confirma para pasar al siguiente paciente. No necesitas llenar diferenciales, recetas ni criterios de ingreso/alta.
                </p>

                <div>
                  <label className="text-xs font-semibold text-[#263A32] block mb-1.5">
                    Impresión Diagnóstica Principal *
                  </label>
                  <input
                    type="text"
                    value={activeDraft.primaryDiagnosis}
                    disabled={Boolean(activeDraft.result)}
                    onChange={(e) =>
                      updateDraft(activeCase.id, (prev) => ({
                        ...prev,
                        primaryDiagnosis: e.target.value,
                      }))
                    }
                    placeholder="Ej. Apendicitis aguda / Dengue con signos de alarma..."
                    className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 py-2.5 text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
                  />
                </div>

                {!activeDraft.result && (
                  <button
                    type="submit"
                    disabled={!activeDraft.primaryDiagnosis.trim()}
                    className="w-full min-h-[44px] py-3 rounded-xl bg-[#43866B] hover:bg-[#356D56] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmar Diagnóstico y Continuar</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <div className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg p-3 text-[11px] text-[#55685F] space-y-1">
                  <div className="font-semibold text-[#263A32]">Al confirmar verás automáticamente:</div>
                  <p>· Exactitud diagnóstica y tiempo empleado</p>
                  <p>· Protocolo STAT + Tratamiento definitivo con días</p>
                  <p>· Auditoría completa y Clase Magistral para estudio</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Full Clinical Audit & Masterclass Modal for any patient in the Turno */}
      {auditTarget && (
        <div className="fixed inset-0 z-50 bg-[#16231D]/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6">
          <div className="max-w-6xl mx-auto bg-[#F3F7F4] border border-[#E2EAE4] rounded-2xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 z-20 bg-white border-b border-[#E2EAE4] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#43866B]">
                  Auditoría Clínica y Clase Magistral · Turno Médico
                </div>
                <div className="text-sm font-bold text-[#263A32]">
                  {auditTarget.caseData.patientInfo.name} · {auditTarget.caseData.solution.correctDiagnosis}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalCaseId(null)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F8FBF9] hover:bg-[#E4F1E8] border border-[#E2EAE4] text-xs font-semibold text-[#263A32] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cerrar Auditoría</span>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <ClinicalAuditTab
                caseData={auditTarget.caseData}
                evaluation={auditTarget.evaluation}
                onNextCase={() => {
                  setAuditModalCaseId(null);
                  if (flashResultCaseId) {
                    handleGoToNextPendingPatient();
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
