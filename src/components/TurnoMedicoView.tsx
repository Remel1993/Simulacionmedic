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
import { evaluateClinicalEvolutionStep, sampleLiveMonitorTelemetry } from '../engine/clinicalEvolution';
import { buildLivePhysicalExams, buildLiveStudies } from '../engine/liveClinicalSync';
import { evaluateClinicalCaseLocally, evaluateClinicalOutcomeLocally } from '../engine/evaluationEngine';
import { deriveDisclosedBackground } from '../utils/backgroundDisclosure';
import { StudyTracingViewer, detectTracingKind } from './StudyTracingViewer';
import { EcgMonitorStrip } from './EcgMonitorStrip';
import { findCaseEcgStudy } from '../utils/ecgWaveform';
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
  anchorVitalSigns: VitalSigns;
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
    anchorVitalSigns: caseData.vitalSigns,
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
    return { label: 'N-I Crítico', className: 'bg-rose-950/75 border-rose-700/70 text-rose-200' };
  }
  if (triage.includes('Nivel II')) {
    return { label: 'N-II Emergencia', className: 'bg-amber-950/70 border-amber-700/70 text-amber-200' };
  }
  if (triage.includes('Nivel III')) {
    return { label: 'N-III Urgencia', className: 'bg-sky-950/70 border-sky-700/70 text-sky-200' };
  }
  return { label: 'N-IV/V Consulta', className: 'bg-emerald-950/70 border-emerald-700/70 text-emerald-200' };
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

  // Shift & Active Patient Timer (runs continuously regardless of open modals, tabs, searching, or typing)
  useEffect(() => {
    if (allResolved || !activeCase || !activeDraft) return;
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
  }, [allResolved, flashResultCaseId, activeCase?.id, activeDraft?.result]);

  // Real-time physiological telemetry (every 1s) & clinical evolution (every 12s) in active patient
  useEffect(() => {
    if (!activeCase || !activeDraft || activeDraft.result || flashResultCaseId) return;

    const isActiveDeceased =
      activeDraft.statInterventions.some((s) => s.isImmediateDeath) ||
      activeDraft.liveVitalSigns.heartRate === 0 ||
      (activeDraft.liveVitalSigns.bloodPressure || '').startsWith('0/');
    if (isActiveDeceased) return;

    const shouldEvolve = activeDraft.elapsedSeconds - activeDraft.lastEvolutionSecond >= 12;
    const shouldSampleTelemetry = activeDraft.elapsedSeconds >= 1;
    if (!shouldEvolve && !shouldSampleTelemetry) return;

    updateDraft(activeCase.id, (prev) => {
      if (prev.result) return prev;
      let nextAnchor = prev.anchorVitalSigns || prev.liveVitalSigns;
      let nextEvolutionState = prev.evolutionState;
      let nextLastEval = prev.lastEvolutionSecond;

      if (prev.elapsedSeconds - prev.lastEvolutionSecond >= 12) {
        const step = evaluateClinicalEvolutionStep({
          caseData: activeCase,
          baselineVitals: activeCase.vitalSigns,
          currentVitals: nextAnchor,
          elapsedSeconds: prev.elapsedSeconds,
          statInterventions: prev.statInterventions,
          unlockedExamCount: prev.unlockedExamIds.length,
          unlockedStudyCount: prev.unlockedStudyIds.length,
          lastEvaluatedSecond: prev.lastEvolutionSecond,
        });
        nextLastEval = step.evolutionState.lastEvaluatedSecond;
        nextEvolutionState = step.evolutionState;
        if (step.changed) {
          nextAnchor = step.updatedVitals;
        }
      }

      const sampledLive = sampleLiveMonitorTelemetry({
        anchorVitals: nextAnchor,
        elapsedSeconds: prev.elapsedSeconds,
        caseId: activeCase.id,
        trajectory: nextEvolutionState?.trajectory,
        isDeceased: false,
      });

      return {
        ...prev,
        anchorVitalSigns: nextAnchor,
        lastEvolutionSecond: nextLastEval,
        evolutionState: nextEvolutionState,
        liveVitalSigns: sampledLive,
      };
    });
  }, [activeDraft?.elapsedSeconds, activeCase?.id, flashResultCaseId]);

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
      activeDraft.anchorVitalSigns || activeDraft.liveVitalSigns,
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
      const matchIdx = prev.medications.findIndex(
        (m) => `${m.drug.toLowerCase()}::${m.dose.toLowerCase()}::${m.route.toLowerCase()}` === normalizedNew
      );
      const nextMeds =
        matchIdx === -1
          ? [...prev.medications, { ...outcome.medicationItem, phase: 'stat_urgencias' as const }]
          : prev.medications.map((m, idx) => {
              if (idx !== matchIdx) return m;
              const countMatch = (m.frequency || '').match(/×\s*(\d+)/);
              const nextCount = countMatch ? parseInt(countMatch[1], 10) + 1 : 2;
              return {
                ...m,
                frequency: `Aplicado STAT × ${nextCount}`,
              };
            });

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
        anchorVitalSigns: outcome.updatedVitals,
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

  const liveEcgStudy = useMemo(
    () => findCaseEcgStudy(liveStudies, activeDraft?.liveVitalSigns),
    [liveStudies, activeDraft?.liveVitalSigns]
  );

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
  const isUnconscious = !isDeceased && activeDraft.liveVitalSigns.glasgow <= 9;
  const isChatBlocked = isDeceased || isUnconscious;

  const disclosedBg = deriveDisclosedBackground(activeDraft.messages, Boolean(activeDraft.result));
  const perPatientRemaining = Math.max(0, 180 - activeDraft.elapsedSeconds);
  const globalRemaining = Math.max(0, 720 - shiftElapsedSeconds);

  return (
    <div className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-5 py-4 space-y-4 text-[#E8F2ED]">
      {/* Turno Header Bar */}
      <div className="bg-[#121E1A] border border-[#243830] rounded-2xl p-3.5 sm:p-5 shadow-[0_6px_20px_rgba(0,0,0,0.35)] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-700/70 flex items-center justify-center text-amber-300 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#E8F2ED] tracking-tight">
                  Modo Turno Médico · Guardia Express
                </h1>
                <span className="text-xs font-semibold text-[#68C79F] whitespace-nowrap">
                  · {config.profile === 'mixto'
                    ? 'Guardia Mixta'
                    : config.profile === 'consulta_rapida'
                    ? 'Consulta Rápida'
                    : 'Urgencias / Choque'}
                </span>
              </div>
              <p className="text-xs text-[#9FB5AA] mt-0.5">
                Pacientes atendidos: <strong className="text-[#E8F2ED] tabular-nums">{resolvedResults.length} / {cases.length}</strong> · Prioriza por triage o atiende en cola rápida.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Timer */}
            {config.timerMode === 'per_patient_180' ? (
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono tabular-nums text-xs flex items-center gap-1.5 ${
                  perPatientRemaining <= 30
                    ? 'bg-rose-950/70 border-rose-700/70 text-rose-200'
                    : 'bg-amber-950/65 border-amber-700/65 text-amber-200'
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
                    ? 'bg-rose-950/70 border-rose-700/70 text-rose-200'
                    : 'bg-sky-950/65 border-sky-700/65 text-sky-200'
                }`}
              >
                <Timer className="w-3.5 h-3.5 shrink-0" />
                <span className="font-sans text-[11px] font-medium">Turno Total:</span>
                <strong>{formatTimer(globalRemaining)}</strong>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-lg border bg-[#172621] border-[#294037] text-[#E8F2ED] font-mono tabular-nums text-xs flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#68C79F] shrink-0" />
                <span className="font-sans text-[11px] text-[#9FB5AA]">Turno:</span>
                <strong>{formatTimer(shiftElapsedSeconds)}</strong>
              </div>
            )}

            {resolvedResults.length > 0 && (
              <button
                type="button"
                onClick={() => setShiftSummaryOpen(true)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>Balance ({resolvedResults.length})</span>
              </button>
            )}

            {!confirmExit ? (
              <button
                type="button"
                onClick={() => setConfirmExit(true)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#172621] hover:bg-rose-950/70 border border-[#294037] hover:border-rose-700/70 text-[#E8F2ED] hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Salir</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-950/75 border border-rose-700/70 rounded-lg px-2.5 py-1">
                <span className="text-[11px] text-rose-200 font-semibold">¿Terminar turno?</span>
                <button
                  type="button"
                  onClick={onExitTurno}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                >
                  Sí, salir
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmExit(false)}
                  className="px-2.5 py-1 rounded bg-[#172621] border border-[#294037] text-[#E8F2ED] text-[11px] font-semibold cursor-pointer"
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
                    ? 'bg-[#183329] border-[#4CA07E] ring-1 ring-[#4CA07E]/35 shadow-sm'
                    : isDone
                    ? 'bg-[#14231D] border-[#2F5B48] opacity-90 hover:opacity-100'
                    : 'bg-[#172621] border-[#243830] hover:border-[#43866B] hover:bg-[#1B2D27]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#9FB5AA] tabular-nums">
                    CAMA #{idx + 1}
                  </span>
                  {isDone ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950/75 border border-emerald-700/70 text-emerald-200 flex items-center gap-1 tabular-nums">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
                    dark
                    className="w-10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#E8F2ED] truncate">
                      {c.patientInfo.name} · {c.patientInfo.age}a
                    </div>
                    <div className="text-[11px] text-[#9FB5AA] line-clamp-1">
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
        <section className="bg-[#121E1A] border border-[#243830] rounded-2xl p-5 sm:p-7 space-y-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#243830] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#68C79F] text-xs font-bold">
                <Award className="w-4 h-4 shrink-0" />
                <span>Balance Clínico del Turno Médico</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#E8F2ED] tracking-tight">
                {allResolved ? 'Guardia Completada' : 'Resumen Parcial del Turno'}
              </h2>
              <p className="text-xs text-[#9FB5AA]">
                Tiempo total en guardia: <strong className="text-[#E8F2ED] font-mono tabular-nums">{formatTimer(shiftElapsedSeconds)}</strong> · Revisa la morbimortalidad, diagnóstico, fase STAT y tratamiento definitivo de cada paciente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!allResolved && (
                <button
                  type="button"
                  onClick={() => setShiftSummaryOpen(false)}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Continuar Atendiendo Pendientes
                </button>
              )}
              <button
                type="button"
                onClick={() => onStartNewTurno(config)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#163026] hover:bg-[#1D3E31] border border-[#3E8569] text-[#D7F0E3] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nuevo Turno Igual</span>
              </button>
              <button
                type="button"
                onClick={onExitTurno}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#172621] hover:bg-[#1E312B] border border-[#294037] text-[#E8F2ED] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Panel Principal</span>
              </button>
            </div>
          </div>

          {/* Cohort KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#172621] border border-[#294037] rounded-xl p-4">
              <div className="text-xs text-[#9FB5AA] font-semibold">Desenlace Favorable</div>
              <div className="text-2xl font-bold text-emerald-300 mt-1 font-mono tabular-nums">
                {shiftMetrics.saved} / {shiftMetrics.total}
              </div>
              <div className="text-[11px] text-[#7D968B] mt-0.5">Pacientes resueltos sin secuelas</div>
            </div>
            <div className="bg-[#172621] border border-[#294037] rounded-xl p-4">
              <div className="text-xs text-[#9FB5AA] font-semibold">Precisión Diagnóstica</div>
              <div className="text-2xl font-bold text-sky-300 mt-1 font-mono tabular-nums">
                {shiftMetrics.diagOk} / {shiftMetrics.total}
              </div>
              <div className="text-[11px] text-[#7D968B] mt-0.5">Diagnósticos principales acertados</div>
            </div>
            <div className="bg-[#172621] border border-[#294037] rounded-xl p-4">
              <div className="text-xs text-[#9FB5AA] font-semibold">Puntaje Promedio</div>
              <div className="text-2xl font-bold text-[#E8F2ED] mt-1 font-mono tabular-nums">
                {shiftMetrics.avgScore} pts
              </div>
              <div className="text-[11px] text-[#7D968B] mt-0.5">Rúbrica clínica integral /100</div>
            </div>
            <div className="bg-[#172621] border border-[#294037] rounded-xl p-4">
              <div className="text-xs text-[#9FB5AA] font-semibold">Eventos Críticos / Mortalidad</div>
              <div className={`text-2xl font-bold mt-1 font-mono tabular-nums ${shiftMetrics.morbidityOrDeath > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {shiftMetrics.morbidityOrDeath}
              </div>
              <div className="text-[11px] text-[#7D968B] mt-0.5">Morbimortalidad severa evitada o ocurrida</div>
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
                    className="bg-[#172621] border border-[#294037] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#68C79F]">Cama #{idx + 1} · {c.patientInfo.name}</span>
                      <p className="text-xs text-[#9FB5AA] mt-0.5">Aún sin finalizar ({c.patientInfo.consultReason})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShiftSummaryOpen(false);
                        setActiveCaseIndex(idx);
                      }}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Atender Ahora
                    </button>
                  </div>
                );
              }

              const statusBadge =
                res.outcomeStatus === 'saved'
                  ? 'bg-emerald-950/75 border-emerald-700/70 text-emerald-200'
                  : res.outcomeStatus === 'stabilized_morbidity'
                  ? 'bg-amber-950/70 border-amber-700/70 text-amber-200'
                  : 'bg-rose-950/75 border-rose-700/70 text-rose-200';

              const statAudit = res.evaluation.statAudit;

              return (
                <div
                  key={c.id}
                  className="bg-[#172621] border border-[#294037] rounded-xl p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#9FB5AA]">Cama #{idx + 1}</span>
                        <span className="text-sm font-bold text-[#E8F2ED]">{c.patientInfo.name} ({c.patientInfo.age}a)</span>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusBadge}`}>
                          {res.outcomeHeadline}
                        </span>
                      </div>
                      <div className="text-xs text-[#D2E2DA]">
                        <strong className="text-[#68C79F]">Dx Real:</strong> {c.solution.correctDiagnosis} ·{' '}
                        <strong className="text-[#9FB5AA]">Tu Dx:</strong>{' '}
                        {res.evaluation.userSummary?.primaryDiagnosis || 'No especificado'}
                      </div>
                      {statAudit?.requiresUrgentStat && (
                        <div className="text-[11px] text-amber-200 bg-amber-950/60 border border-amber-700/65 rounded-lg px-2.5 py-1.5 mt-1">
                          <strong>STAT/Urgencias:</strong> {statAudit.statGuidanceComment}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold font-mono tabular-nums text-[#E8F2ED]">
                          {res.evaluation.totalScore}/100
                        </div>
                        <div className="text-[10px] text-[#9FB5AA] font-mono tabular-nums">
                          {formatTimer(res.timeSpentSeconds)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAuditModalCaseId(c.id)}
                        className="min-h-[38px] px-3.5 py-2 rounded-lg bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
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
        <section className="bg-[#121E1A] border border-[#243830] rounded-2xl p-5 sm:p-8 max-w-4xl mx-auto space-y-5 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#243830] pb-4">
            <div className="flex items-center gap-3">
              <PatientVisualCard
                caseData={flashResult.caseData}
                isDeceased={flashResult.outcomeStatus === 'deceased'}
                variant="thumbnail"
                dark
                className="w-16"
              />
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                  flashResult.outcomeStatus === 'saved'
                    ? 'bg-emerald-950/75 border-emerald-700/70 text-emerald-300'
                    : flashResult.outcomeStatus === 'stabilized_morbidity'
                    ? 'bg-amber-950/70 border-amber-700/70 text-amber-300'
                    : 'bg-rose-950/75 border-rose-700/70 text-rose-300'
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
                <div className="text-xs font-semibold text-[#9FB5AA]">
                  Desenlace Rápido · {flashResult.caseData.patientInfo.name}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#E8F2ED]">
                  {flashResult.outcomeHeadline}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold font-mono tabular-nums text-[#E8F2ED]">
                {flashResult.evaluation.totalScore}
                <span className="text-sm text-[#9FB5AA] font-semibold"> /100</span>
              </div>
              <div className="text-[11px] text-[#9FB5AA] font-mono tabular-nums">
                Tiempo: {formatTimer(flashResult.timeSpentSeconds)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="bg-[#172621] border border-[#294037] rounded-xl p-4 space-y-1.5">
              <div className="font-bold text-[#68C79F]">Diagnóstico</div>
              <p className="text-[#E8F2ED] font-semibold">
                Real: {flashResult.caseData.solution.correctDiagnosis}
              </p>
              <p className="text-[#9FB5AA]">
                Tu impresión: {flashResult.evaluation.userSummary?.primaryDiagnosis || 'Sin diagnóstico registrado'}
              </p>
              <p className="text-[#D2E2DA] pt-1 leading-relaxed">
                {flashResult.evaluation.feedback.diagnosisAccuracyComment}
              </p>
            </div>

            <div className="bg-[#172621] border border-[#294037] rounded-xl p-4 space-y-1.5">
              <div className="font-bold text-amber-300">
                Manejo de Referencia para Estudio
              </div>
              {flashResult.evaluation.statAudit?.requiresUrgentStat && (
                <p className="text-amber-200 bg-amber-950/60 border border-amber-700/65 rounded-lg px-2.5 py-1.5">
                  <strong>Fase STAT / Urgencias:</strong>{' '}
                  {flashResult.evaluation.statAudit.recommendedStatProtocol
                    ?.slice(0, 3)
                    .map((p) => `${p.drug} ${p.dose} (${p.route})`)
                    .join(' · ')}
                </p>
              )}
              <p className="text-[#D2E2DA] leading-relaxed">
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
              className="min-h-[42px] px-4 py-2.5 rounded-xl bg-[#172621] hover:bg-[#1E312B] border border-[#294037] text-[#E8F2ED] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#68C79F]" />
              <span>Ver Auditoría Completa y Clase Magistral</span>
            </button>

            <button
              type="button"
              onClick={handleGoToNextPendingPatient}
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
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
          <div className="bg-[#121E1A] border border-[#243830] rounded-xl px-3.5 py-2 min-h-[48px] flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs min-w-0 flex-1">
              <div className="font-bold text-[#E8F2ED] flex items-center gap-1.5 min-w-0">
                <Users className="w-4 h-4 text-[#68C79F] shrink-0" />
                <span className="truncate">
                  {activeDraft.caseId === activeCase.id &&
                    `${activeCase.patientInfo.name}, ${activeCase.patientInfo.age}a (${activeCase.patientInfo.sex})${
                      typeof (activeDraft.liveVitalSigns.weightKg ?? activeCase.vitalSigns.weightKg) === 'number'
                        ? ` · ${activeDraft.liveVitalSigns.weightKg ?? activeCase.vitalSigns.weightKg} kg`
                        : ''
                    }${
                      typeof (activeDraft.liveVitalSigns.heightCm ?? activeCase.vitalSigns.heightCm) === 'number'
                        ? ` / ${activeDraft.liveVitalSigns.heightCm ?? activeCase.vitalSigns.heightCm} cm`
                        : ''
                    }`}
                </span>
                {!isDeceased && (
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#163026] border border-[#3E8569] text-[10px] font-bold text-[#8FE3BF] whitespace-nowrap shrink-0"
                    title="Monitoreo continuo en tiempo real"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En vivo
                  </span>
                )}
              </div>
              <span className="font-mono tabular-nums text-[#E8F2ED] font-semibold inline-flex items-center gap-1 whitespace-nowrap min-w-[116px] transition-colors">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                PA {activeDraft.liveVitalSigns.bloodPressure.split(' ')[0]}
              </span>
              <span className="font-mono tabular-nums text-emerald-300 font-semibold inline-flex items-center gap-1 whitespace-nowrap min-w-[82px] transition-colors">
                <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                FC {activeDraft.liveVitalSigns.heartRate} lpm
              </span>
              <span className="font-mono tabular-nums text-sky-300 font-semibold inline-flex items-center gap-1 whitespace-nowrap min-w-[116px] transition-colors">
                <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                FR {activeDraft.liveVitalSigns.respiratoryRate} · SpO₂ {activeDraft.liveVitalSigns.oxygenSaturation}%
              </span>
              <span className="font-mono tabular-nums text-amber-300 font-semibold inline-flex items-center gap-1 whitespace-nowrap min-w-[78px] transition-colors">
                <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                T° {activeDraft.liveVitalSigns.temperature.toFixed(1)}°C
              </span>
              <span className="font-mono tabular-nums text-[#E8F2ED] font-semibold inline-flex items-center gap-1 whitespace-nowrap min-w-[74px] transition-colors">
                <Brain className="w-3.5 h-3.5 text-[#68C79F] shrink-0" />
                GCS {activeDraft.liveVitalSigns.glasgow}/15
              </span>
              {activeDraft.liveVitalSigns.bloodGlucose !== undefined && (
                <span className="font-mono tabular-nums text-amber-200 font-semibold whitespace-nowrap min-w-[88px]">
                  Glu {activeDraft.liveVitalSigns.bloodGlucose} mg/dL
                </span>
              )}
            </div>

            {activeDraft.evolutionState?.trajectory && (
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap shrink-0 min-w-[128px] text-center ${
                  activeDraft.evolutionState.trajectory === 'mejorando'
                    ? 'bg-emerald-950/75 border-emerald-700/70 text-emerald-200'
                    : activeDraft.evolutionState.trajectory === 'critico' ||
                      activeDraft.evolutionState.trajectory === 'deterioro'
                    ? 'bg-rose-950/75 border-rose-700/70 text-rose-200'
                    : 'bg-[#172621] border-[#294037] text-[#9FB5AA]'
                }`}
              >
                Estado: {activeDraft.evolutionState.trajectory}
              </span>
            )}
          </div>

          {config.profile === 'urgencias' && (
            <EcgMonitorStrip
              compact
              study={liveEcgStudy}
              vitalSigns={activeDraft.liveVitalSigns}
              isDeceased={isDeceased}
            />
          )}

          {/* Immediate Death Banner if iatrogenic fatality occurred */}
          {(activeDraft.immediateDeathAlert || isDeceased) && (
            <div className="bg-rose-950/75 border border-rose-700/70 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-200">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-rose-400 shrink-0" />
                <span>
                  <strong className="text-rose-100 uppercase">Fallecimiento Inmediato por Iatrogenia STAT:</strong>{' '}
                  {activeDraft.immediateDeathAlert?.reason || 'Paro cardiorrespiratorio irreversible en monitoreo.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => resolvePatient(activeCase, activeDraft)}
                className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors"
              >
                Registrar Desenlace y Continuar
              </button>
            </div>
          )}

          {/* Already resolved notice when revisiting a completed bed */}
          {activeDraft.result && (
            <div className="bg-[#163026] border border-[#3E8569] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#D7F0E3]">
                <strong>Paciente ya resuelto:</strong> Obtuviste{' '}
                <strong className="font-mono tabular-nums">{activeDraft.result.evaluation.totalScore}/100</strong> ({activeDraft.result.outcomeHeadline}).
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuditModalCaseId(activeCase.id)}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#2F7A63] hover:bg-[#3A8E74] text-white font-semibold cursor-pointer transition-colors"
                >
                  Ver Auditoría y Clase
                </button>
                <button
                  type="button"
                  onClick={handleGoToNextPendingPatient}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg bg-[#172621] border border-[#294037] hover:bg-[#1E312B] text-[#E8F2ED] font-semibold cursor-pointer transition-colors"
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
              <div className="bg-[#121E1A] border border-[#243830] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#E8F2ED] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#68C79F]" />
                    <span>1. Historia Express</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#9FB5AA]">
                    {activeDraft.messages.filter((m) => m.sender === 'doctor').length} preguntas
                  </span>
                </div>

                {/* Prognosis-Style Patient Scene Vignette */}
                <PatientVisualCard
                  caseData={activeCase}
                  liveVitals={activeDraft.liveVitalSigns}
                  isDeceased={isDeceased}
                  variant="vignette"
                  dark
                />

                <div className="bg-[#172621] border border-[#294037] rounded-lg p-2.5 text-xs text-[#E8F2ED] space-y-1">
                  <div>
                    <strong className="text-[#68C79F]">Motivo:</strong> {activeCase.patientInfo.consultReason}
                  </div>
                  <div className="text-[11px] text-[#9FB5AA]">
                    <strong>Evolución:</strong> {activeCase.patientInfo.evolutionTime} · <strong>Ocupación:</strong> {activeCase.patientInfo.occupation}
                  </div>
                </div>

                {isUnconscious && (
                  <div className="bg-amber-950/60 border border-amber-700/70 rounded-lg px-2.5 py-2 text-[11px] text-amber-200 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Paciente inconsciente (Glasgow {activeDraft.liveVitalSigns.glasgow}/15):</strong> no responde al interrogatorio; prioriza examen físico, estudios y estabilización STAT.
                    </span>
                  </div>
                )}

                {/* 5 One-Click Interrogatorio Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_INTERROGATION_PROMPTS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      disabled={Boolean(activeDraft.result) || isChatBlocked}
                      onClick={() => handleAskQuestion(q.prompt)}
                      className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#172621] hover:bg-[#183329] disabled:opacity-45 disabled:pointer-events-none border border-[#294037] hover:border-[#4CA07E] text-[11px] font-semibold text-[#E8F2ED] cursor-pointer transition-colors"
                    >
                      + {q.label}
                    </button>
                  ))}
                </div>

                {/* Compact Dialogue Feed */}
                <div className="bg-[#0F1916] border border-[#243830] rounded-lg p-2.5 max-h-52 overflow-y-auto space-y-2">
                  {activeDraft.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`text-xs rounded-lg px-2.5 py-2 ${
                        m.sender === 'doctor'
                          ? 'bg-[#266953] text-white ml-4 border border-[#3C8B70]/50'
                          : m.sender === 'system'
                          ? 'bg-amber-950/60 border border-amber-700/65 text-amber-200 text-[11px]'
                          : 'bg-[#172621] border border-[#294037] text-[#E8F2ED] mr-2'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold block mb-0.5 ${
                          m.sender === 'doctor'
                            ? 'text-[#D7F0E3]'
                            : m.sender === 'system'
                            ? 'text-amber-300'
                            : 'text-[#68C79F]'
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
                  <div className="bg-[#172621] border border-[#294037] rounded-lg p-2.5 text-[11px] text-[#E8F2ED] space-y-1">
                    {disclosedBg.pathological && (
                      <div><strong className="text-[#68C79F]">Patológicos:</strong> {activeCase.background.pathological.join(' · ')}</div>
                    )}
                    {disclosedBg.currentMedications && (
                      <div><strong className="text-[#68C79F]">Fármacos:</strong> {activeCase.background.currentMedications.join(' · ')}</div>
                    )}
                    {disclosedBg.allergies && (
                      <div className="text-rose-300"><strong>Alergias:</strong> {activeCase.background.allergies.join(' · ')}</div>
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
                    disabled={Boolean(activeDraft.result) || isChatBlocked}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder={
                      isDeceased
                        ? 'Paciente fallecido (asistolia)...'
                        : isUnconscious
                          ? `Paciente inconsciente (Glasgow ${activeDraft.liveVitalSigns.glasgow}/15)...`
                          : 'Pregunta puntual al paciente...'
                    }
                    className="flex-1 min-w-0 bg-[#172621] border border-[#294037] rounded-lg px-3 py-2 text-xs text-[#E8F2ED] placeholder-[#7C9489] focus:outline-none focus:border-[#52B78E] disabled:opacity-45"
                  />
                  <button
                    type="submit"
                    disabled={!customQuestion.trim() || Boolean(activeDraft.result) || isChatBlocked}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#2F7A63] hover:bg-[#3A8E74] disabled:opacity-45 text-white cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Exploración Física 1-Clic */}
              <div className="bg-[#121E1A] border border-[#243830] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#E8F2ED] flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-[#68C79F]" />
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
                    className="px-2.5 py-1 rounded-md bg-[#163026] hover:bg-[#1E3E31] border border-[#3E8569] text-[11px] font-semibold text-[#D7F0E3] cursor-pointer transition-colors"
                  >
                    Explorar Todo ({activeDraft.unlockedExamIds.length}/{liveExams.length})
                  </button>
                </div>

                {/* System Filter */}
                <HospitalSelect
                  variant="compact"
                  dark
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
                              ? 'bg-amber-950/45 border-amber-700/65'
                              : 'bg-[#163026] border-[#3E8569]'
                            : 'bg-[#172621] border-[#294037] hover:border-[#4CA07E]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-[#9FB5AA] block">
                              {pe.system}
                            </span>
                            <span className="font-semibold text-[#E8F2ED] block truncate">{pe.name}</span>
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
                              className="min-h-[34px] px-2.5 py-1 rounded-md bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                            >
                              Examinar
                            </button>
                          )}
                        </div>
                        {isUnlocked && (
                          <p className="text-[11px] text-[#D7E8DF] mt-1.5 leading-snug border-t border-[#294037] pt-1.5">
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
              <div className="bg-[#121E1A] border border-amber-700/65 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Syringe className="w-4 h-4 text-amber-400" />
                    <span>3. Estabilización STAT en Vivo</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#9FB5AA]">
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
                          : 'bg-[#172621] text-[#9FB5AA] border border-[#294037] hover:text-[#E8F2ED]'
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
                      className="px-2.5 py-2 rounded-lg bg-[#172621] hover:bg-amber-950/60 disabled:opacity-45 border border-[#294037] hover:border-amber-600/80 text-left cursor-pointer transition-colors"
                    >
                      <div className="text-[11px] font-bold text-[#E8F2ED] truncate">{preset.label}</div>
                      <div className="text-[10px] text-amber-300 truncate">{preset.dose} · {preset.route.split(' ')[0]}</div>
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
                    className="col-span-6 bg-[#172621] border border-[#294037] rounded-lg px-2.5 py-1.5 text-[11px] text-[#E8F2ED] placeholder-[#7C9489] focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={customStatDose}
                    onChange={(e) => setCustomStatDose(e.target.value)}
                    disabled={Boolean(activeDraft.result) || isDeceased}
                    placeholder="Dosis"
                    className="col-span-3 bg-[#172621] border border-[#294037] rounded-lg px-2 py-1.5 text-[11px] text-[#E8F2ED] placeholder-[#7C9489] focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!customStatDrug.trim() || Boolean(activeDraft.result) || isDeceased}
                    className="col-span-3 min-h-[34px] rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-45 text-white text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    Aplicar
                  </button>
                </form>

                {activeDraft.statInterventions.length > 0 && (
                  <div className="space-y-1 max-h-24 overflow-y-auto pt-1.5 border-t border-[#243830]">
                    {activeDraft.statInterventions.map((st) => (
                      <div key={st.id} className="text-[11px] bg-[#172621] rounded-md px-2.5 py-1.5 border border-[#294037] flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#E8F2ED] truncate">{st.drug} ({st.dose})</span>
                        <span
                          className={`text-[10px] font-bold shrink-0 ${
                            st.effectSeverity === 'mejoria'
                              ? 'text-emerald-300'
                              : st.effectSeverity === 'reaccion_adversa'
                              ? 'text-rose-300'
                              : 'text-amber-300'
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
              <div className="bg-[#121E1A] border border-[#243830] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-[0_4px_14px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#E8F2ED] flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-[#68C79F]" />
                    <span>4. Paraclínicos Rápidos</span>
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#9FB5AA]">
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
                          ? 'bg-[#2F7A63] text-white'
                          : 'bg-[#172621] text-[#9FB5AA] border border-[#294037] hover:text-[#E8F2ED]'
                      }`}
                    >
                      {cat === 'Gabinete y Trazados' ? 'ECG/Gabinete' : cat}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#7C9489] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={studySearch}
                    onChange={(e) => setStudySearch(e.target.value)}
                    placeholder="Buscar estudio (BH, ECG, TAC, gaso...)"
                    className="w-full bg-[#172621] border border-[#294037] rounded-lg pl-8 pr-2.5 py-2 text-xs text-[#E8F2ED] placeholder-[#7C9489] focus:outline-none focus:border-[#52B78E]"
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
                              ? 'bg-amber-950/45 border-amber-700/65'
                              : 'bg-[#163026] border-[#3E8569]'
                            : 'bg-[#172621] border-[#294037] hover:border-[#4CA07E]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold text-[#68C79F] block">
                              {std.subcategory}
                            </span>
                            <span className="font-semibold text-[#E8F2ED] block leading-snug">{std.name}</span>
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
                              className="min-h-[34px] px-2.5 py-1 rounded-md bg-[#2F7A63] hover:bg-[#3A8E74] text-white text-[11px] font-semibold shrink-0 cursor-pointer transition-colors"
                            >
                              Solicitar
                            </button>
                          )}
                        </div>
                        {isUnlocked && (
                          <div className="mt-1.5 pt-1.5 border-t border-[#294037] space-y-1 text-[11px]">
                            <p className="text-[#D7E8DF] leading-snug">{std.result}</p>
                            {std.referenceRange && (
                              <p className="text-[10px] text-[#9FB5AA] font-mono">Ref: {std.referenceRange}</p>
                            )}
                            {hasTracing && (
                              <div className="pt-1">
                                <StudyTracingViewer study={std} vitalSigns={activeDraft.liveVitalSigns} dark />
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
                className="bg-[#121E1A] border border-[#3E8569] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
              >
                <div className="text-xs font-bold text-[#68C79F] flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#68C79F]" />
                  <span>5. Diagnóstico Express *</span>
                </div>

                <p className="text-xs text-[#9FB5AA] leading-relaxed">
                  Escribe únicamente tu diagnóstico clínico principal y confirma para pasar al siguiente paciente. No necesitas llenar diferenciales, recetas ni criterios de ingreso/alta.
                </p>

                <div>
                  <label className="text-xs font-semibold text-[#E8F2ED] block mb-1.5">
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
                    className="w-full bg-[#172621] border border-[#294037] rounded-xl px-3.5 py-2.5 text-sm text-[#E8F2ED] placeholder-[#7C9489] focus:outline-none focus:border-[#52B78E] focus:ring-2 focus:ring-[#2F7A63]/35"
                  />
                </div>

                {!activeDraft.result && (
                  <button
                    type="submit"
                    disabled={!activeDraft.primaryDiagnosis.trim()}
                    className="w-full min-h-[44px] py-3 rounded-xl bg-[#2F7A63] hover:bg-[#3A8E74] disabled:opacity-45 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmar Diagnóstico y Continuar</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <div className="bg-[#172621] border border-[#294037] rounded-lg p-3 text-[11px] text-[#9FB5AA] space-y-1">
                  <div className="font-semibold text-[#E8F2ED]">Al confirmar verás automáticamente:</div>
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
        <div className="fixed inset-0 z-50 bg-[#070E0C]/80 backdrop-blur-sm overflow-y-auto p-3 sm:p-6">
          <div className="max-w-6xl mx-auto bg-[#F3F7F4] border border-[#294037] rounded-2xl shadow-2xl overflow-hidden">
            <div className="sticky top-0 z-20 bg-[#121E1A] border-b border-[#243830] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#68C79F]">
                  Auditoría Clínica y Clase Magistral · Turno Médico
                </div>
                <div className="text-sm font-bold text-[#E8F2ED]">
                  {auditTarget.caseData.patientInfo.name} · {auditTarget.caseData.solution.correctDiagnosis}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalCaseId(null)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#172621] hover:bg-[#1E312B] border border-[#294037] text-xs font-semibold text-[#E8F2ED] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cerrar Auditoría</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 text-[#263A32]">
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
