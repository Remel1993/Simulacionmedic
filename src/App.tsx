import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Navbar,
  NavSectionKey,
} from './components/Navbar';
import { VitalSignsMonitor } from './components/VitalSignsMonitor';
import { PatientBanner } from './components/PatientBanner';
import { AnamnesisTab } from './components/AnamnesisTab';
import { BackgroundTab } from './components/BackgroundTab';
import { PhysicalExamTab } from './components/PhysicalExamTab';
import { DiagnosticStudiesTab } from './components/DiagnosticStudiesTab';
import { DiagnosticTab } from './components/DiagnosticTab';
import { TreatmentTab } from './components/TreatmentTab';
import { StatStabilizationDrawer } from './components/StatStabilizationDrawer';
import { ClinicalAuditTab } from './components/ClinicalAuditTab';
import { HomeDashboard } from './components/HomeDashboard';
import { NewCaseModal } from './components/NewCaseModal';
import { CaseHistoryModal } from './components/CaseHistoryModal';
import { ClinicalGuideModal } from './components/ClinicalGuideModal';
import { CalculatorsModal } from './components/CalculatorsModal';
import { ClinicalOutcomeModal } from './components/ClinicalOutcomeModal';
import { ImmediateDeathModal, ImmediateDeathAlertData } from './components/ImmediateDeathModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TurnoMedicoView } from './components/TurnoMedicoView';
import { ProgressiveExamView } from './components/ProgressiveExamView';
import {
  ExitSimulationModal,
  ExitSimulationPromptInfo,
} from './components/ExitSimulationModal';

import { applyStatIntervention, StatApplyInput } from './utils/statStabilization';
import { generateContextualPatientReply, PatientChatPayload } from './engine/patientEngine';
import { getLocalCaseLibrary, selectLocalClinicalCase, selectTurnoMedicoCases } from './engine/caseGenerator';
import {
  buildProgressiveExamSession,
  buildStationHistoryRecords,
} from './engine/progressiveExamEngine';
import { evaluateClinicalEvolutionStep, sampleLiveMonitorTelemetry } from './engine/clinicalEvolution';
import { buildLivePhysicalExams, buildLiveStudies } from './engine/liveClinicalSync';
import {
  evaluateClinicalCaseLocally,
  evaluateClinicalOutcomeLocally,
  DramaticOutcome,
} from './engine/evaluationEngine';

import { ALL_CURATED_CASES } from './data/allCases';
import { enrichCaseWithHospitalCatalog } from './utils/studiesCatalog';
import { enrichCaseWithUniversalPhysicalExam } from './utils/physicalExamCatalog';
import { deriveDisclosedBackground } from './utils/backgroundDisclosure';
import { detectPregnancyContext } from './utils/clinicalContext';
import { LeadName, findCaseEcgStudy } from './utils/ecgWaveform';
import {
  clearActiveSimulationSession,
  clearAllHistoryRecords,
  deleteCustomCase,
  getActiveSimulationSession,
  getAllHistoryRecords,
  getCustomCases,
  getStoredProgress,
  getUserPreferences,
  migrateLegacyLocalStorage,
  saveActiveSimulationSession,
  saveCustomCase,
  saveHistoryRecord,
  saveStoredProgress,
  saveUserPreferences,
} from './storage/indexedDb';
import {
  ClinicalCase,
  ClinicalEvolutionState,
  ChatMessage,
  MedicationItem,
  EvaluationResult,
  SavedCaseRecord,
  GameMode,
  Specialty,
  StatInterventionRecord,
  UserEvaluationInput,
  UserPreferences,
  VitalSigns,
  TurnoMedicoConfig,
  TurnoPatientResult,
} from './types/clinical';
import {
  ProgressiveExamConfig,
  ProgressiveExamEvaluation,
  ProgressiveExamStation,
} from './types/exam';

import {
  MessageSquare,
  FileText,
  Stethoscope,
  FlaskConical,
  Brain,
  Pill,
  Award,
  Timer,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Skull,
  ChevronDown,
  ChevronUp,
  Target,
  PenLine,
  RotateCcw,
  Check,
  CheckCircle2,
  Circle,
  ChevronsUpDown,
} from 'lucide-react';

const URGENCIAS_WINDOW_SECONDS = 8 * 60;
const EXAMEN_WINDOW_SECONDS = 12 * 60;

export default function App() {
  // General Interface vs Active Clinical Simulation vs Turno Médico Express vs Examen Progresivo
  const [activeView, setActiveView] = useState<
    'lobby' | 'simulation' | 'turno_medico' | 'examen_progresivo'
  >('lobby');
  const [turnoConfig, setTurnoConfig] = useState<TurnoMedicoConfig>({
    patientCount: 5,
    profile: 'mixto',
    timerMode: 'untimed',
    specialty: 'aleatorio',
  });
  const [turnoCases, setTurnoCases] = useState<ClinicalCase[]>([]);
  const [turnoSessionKey, setTurnoSessionKey] = useState<number>(1);
  const [examConfig, setExamConfig] = useState<ProgressiveExamConfig>({
    difficulty: 'progresivo',
    specialty: 'aleatorio',
    stationCount: 3,
  });
  const [examStations, setExamStations] = useState<ProgressiveExamStation[]>([]);
  const [examSessionKey, setExamSessionKey] = useState<number>(1);
  const [isProgressiveExamFinished, setIsProgressiveExamFinished] = useState<boolean>(false);
  const [pendingExitRequest, setPendingExitRequest] = useState<{
    info: ExitSimulationPromptInfo;
    onConfirm: () => void;
  } | null>(null);

  // Current Case State
  const [currentCase, setCurrentCase] = useState<ClinicalCase>(() =>
    enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(ALL_CURATED_CASES[0]))
  );
  const [activeTab, setActiveTab] = useState<
    'anamnesis' | 'background' | 'physical_exam' | 'studies' | 'diagnosis' | 'treatment' | 'audit'
  >('anamnesis');
  const [expandedSections, setExpandedSections] = useState<string[]>(['anamnesis']);

  // Live Vitals, Evolution Engine & STAT Stabilization Tracking
  const [liveVitalSigns, setLiveVitalSigns] = useState<VitalSigns>(() => ALL_CURATED_CASES[0].vitalSigns);
  const [statInterventions, setStatInterventions] = useState<StatInterventionRecord[]>([]);
  const [statDrawerOpen, setStatDrawerOpen] = useState(false);
  const [evolutionState, setEvolutionState] = useState<ClinicalEvolutionState | undefined>(undefined);

  // Interactive Exploration Tracking
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [unlockedExamIds, setUnlockedExamIds] = useState<string[]>([]);
  const [unlockedStudyIds, setUnlockedStudyIds] = useState<string[]>([]);
  const [emergencyChartUnlocked, setEmergencyChartUnlocked] = useState(false);

  // Diagnostics and Treatment Form States
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<string[]>([]);
  const [clinicalJustification, setClinicalJustification] = useState('');

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [pendingMedDraft, setPendingMedDraft] = useState<MedicationItem | undefined>(undefined);
  const [generalMeasures, setGeneralMeasures] = useState('');
  const [hospitalizationDecision, setHospitalizationDecision] = useState('');
  const [referralCriteria, setReferralCriteria] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  // Evaluation, History & Local IndexedDB State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<SavedCaseRecord[]>([]);
  const [customCases, setCustomCases] = useState<ClinicalCase[]>([]);
  const [completedCaseIds, setCompletedCaseIds] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    preferredMode: 'medico_general',
    preferredSpecialty: 'aleatorio',
    ttsEnabled: false,
    updatedAt: '',
  });
  const [lobbyClassification, setLobbyClassification] = useState<
    GameMode | 'turno_medico' | 'examen_progresivo'
  >('medico_general');
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  // Modals & Dramatic Outcome Stage
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [newCaseModalTab, setNewCaseModalTab] = useState<'custom' | 'presets'>('custom');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [calculatorsModalOpen, setCalculatorsModalOpen] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [pendingOutcome, setPendingOutcome] = useState<DramaticOutcome | null>(null);
  const [immediateDeathAlert, setImmediateDeathAlert] = useState<ImmediateDeathAlertData | null>(null);
  const [recentCaseIds, setRecentCaseIds] = useState<string[]>([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState<string[]>([]);

  const isPatientDeceased =
    statInterventions.some((s) => s.isImmediateDeath) ||
    liveVitalSigns.heartRate === 0 ||
    (liveVitalSigns.bloodPressure || '').startsWith('0/');

  const isActiveSimulationInProgress =
    (activeView === 'simulation' && !evaluationResult) ||
    activeView === 'turno_medico' ||
    (activeView === 'examen_progresivo' && !isProgressiveExamFinished);

  const livePhysicalExams = useMemo(
    () => buildLivePhysicalExams(currentCase, liveVitalSigns, statInterventions, evolutionState),
    [currentCase, liveVitalSigns, statInterventions, evolutionState]
  );

  const liveStudies = useMemo(
    () => buildLiveStudies(currentCase, liveVitalSigns, statInterventions, evolutionState),
    [currentCase, liveVitalSigns, statInterventions, evolutionState]
  );

  const unlockedStudyObjects = useMemo(
    () => liveStudies.filter((s) => unlockedStudyIds.includes(s.id)),
    [liveStudies, unlockedStudyIds]
  );

  const liveEcgStudy = useMemo(
    () => findCaseEcgStudy(liveStudies, liveVitalSigns),
    [liveStudies, liveVitalSigns]
  );

  const [selectedEcgLead, setSelectedEcgLead] = useState<LeadName>('DII');

  const isPublicPregnant = useMemo(
    () => detectPregnancyContext(currentCase, { publicOnly: true }).isViablePregnancy,
    [currentCase]
  );

  // Consultation Timer & Mode Mechanics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const examAutoSubmittedRef = useRef(false);
  const urgenciasAutoSubmittedRef = useRef(false);
  const latestFinishRef = useRef<() => void>(() => {});
  const latestUrgenciasTimeoutRef = useRef<() => void>(() => {});
  const activeChatCaseIdRef = useRef<string>(ALL_CURATED_CASES[0].id);
  const lastEvolutionCheckRef = useRef<number>(0);
  const clinicalAnchorVitalsRef = useRef<VitalSigns>(ALL_CURATED_CASES[0].vitalSigns);
  const vitalsMonitorRef = useRef<HTMLDivElement | null>(null);
  const [isMonitorOffscreen, setIsMonitorOffscreen] = useState(false);

  // Initialize IndexedDB (with one-time migration from legacy localStorage)
  useEffect(() => {
    let cancelled = false;

    const hydrateLocalDatabase = async () => {
      try {
        await migrateLegacyLocalStorage();
        const [loadedHistory, storedProgress, loadedPrefs, loadedCustomCases, activeSession] =
          await Promise.all([
            getAllHistoryRecords(),
            getStoredProgress(),
            getUserPreferences(),
            getCustomCases(),
            getActiveSimulationSession(),
          ]);

        if (cancelled) return;

        setHistory(loadedHistory);
        setUserPreferences(loadedPrefs);
        setLobbyClassification(loadedPrefs.preferredMode);
        setCustomCases(loadedCustomCases);

        const mergedSeenIds = Array.from(
          new Set([
            ...storedProgress.seenCaseIds,
            ...loadedHistory.map((h) => h.caseId).filter(Boolean),
          ])
        );
        const mergedSeenDiags = Array.from(
          new Set([
            ...storedProgress.seenDiagnoses,
            ...loadedHistory.map((h) => h.correctDiagnosis).filter(Boolean),
          ])
        );
        const mergedCompletedIds = Array.from(
          new Set([
            ...storedProgress.completedCaseIds,
            ...loadedHistory.map((h) => h.caseId).filter(Boolean),
          ])
        );

        const totalLibrarySize = Math.max(10, ALL_CURATED_CASES.length + loadedCustomCases.length - 1);
        setRecentCaseIds(mergedSeenIds.slice(-totalLibrarySize));
        setRecentDiagnoses(mergedSeenDiags.slice(-95));
        setCompletedCaseIds(mergedCompletedIds);

        if (activeSession && activeSession.caseData) {
          const restoredCase = enrichCaseWithUniversalPhysicalExam(
            enrichCaseWithHospitalCatalog(activeSession.caseData)
          );
          activeChatCaseIdRef.current = restoredCase.id;
          lastEvolutionCheckRef.current = activeSession.elapsedSeconds || 0;
          setCurrentCase(restoredCase);
          setActiveTab(activeSession.activeTab || 'anamnesis');
          setExpandedSections([activeSession.activeTab || 'anamnesis']);
          clinicalAnchorVitalsRef.current = activeSession.liveVitalSigns || restoredCase.vitalSigns;
          setLiveVitalSigns(activeSession.liveVitalSigns || restoredCase.vitalSigns);
          setStatInterventions(activeSession.statInterventions || []);
          setMessages(activeSession.messages || []);
          setUnlockedExamIds(activeSession.unlockedExamIds || []);
          setUnlockedStudyIds(activeSession.unlockedStudyIds || []);
          setEmergencyChartUnlocked(false);
          setPrimaryDiagnosis(activeSession.primaryDiagnosis || '');
          setDifferentialDiagnoses(activeSession.differentialDiagnoses || []);
          setClinicalJustification(activeSession.clinicalJustification || '');
          setMedications(activeSession.medications || []);
          setGeneralMeasures(activeSession.generalMeasures || '');
          setHospitalizationDecision(activeSession.hospitalizationDecision || '');
          setReferralCriteria(activeSession.referralCriteria || '');
          setFollowUpPlan(activeSession.followUpPlan || '');
          setElapsedSeconds(activeSession.elapsedSeconds || 0);
          setActiveView('simulation');

          const initialEvo = evaluateClinicalEvolutionStep({
            caseData: restoredCase,
            baselineVitals: restoredCase.vitalSigns,
            currentVitals: activeSession.liveVitalSigns || restoredCase.vitalSigns,
            elapsedSeconds: activeSession.elapsedSeconds || 0,
            statInterventions: activeSession.statInterventions || [],
            unlockedExamCount: (activeSession.unlockedExamIds || []).length,
            unlockedStudyCount: (activeSession.unlockedStudyIds || []).length,
            lastEvaluatedSecond: activeSession.elapsedSeconds || 0,
          });
          setEvolutionState(initialEvo.evolutionState);
        }
      } catch (e) {
        console.warn('No se pudo hidratar la base local IndexedDB', e);
      } finally {
        if (!cancelled) {
          setIsStorageHydrated(true);
        }
      }
    };

    void hydrateLocalDatabase();
    return () => {
      cancelled = true;
    };
  }, []);

  // Detect when VitalSignsMonitor scrolls offscreen so a compact sticky telemetry strip keeps live vitals visible while searching/typing
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult) {
      setIsMonitorOffscreen(false);
      return;
    }
    const target = vitalsMonitorRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsMonitorOffscreen(!entry.isIntersecting && entry.boundingClientRect.bottom < 160);
        }
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [activeView, Boolean(evaluationResult), currentCase.id]);

  // Timer Tick (runs continuously without pausing for searches, typing, tabs, or open modals)
  const hasEvaluation = Boolean(evaluationResult);
  useEffect(() => {
    if (activeView !== 'simulation' || hasEvaluation || isPatientDeceased) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeView, hasEvaluation, isPatientDeceased, currentCase.id]);

  // Continuous Real-Time Vitals Telemetry (every 1s) & Clinical Evolution (every 12-15s across all modes)
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult) return;

    const evolutionStepSeconds =
      currentCase.mode === 'urgencias' ||
      /^nivel (i|ii)\b/i.test(currentCase.patientInfo.triageLevel)
        ? 12
        : 15;

    const shouldEvaluateEvolution =
      elapsedSeconds === 0 ||
      !evolutionState ||
      elapsedSeconds - lastEvolutionCheckRef.current >= evolutionStepSeconds;

    let currentTrajectory = evolutionState?.trajectory;
    let evoChanged = false;

    if (shouldEvaluateEvolution) {
      const step = evaluateClinicalEvolutionStep({
        caseData: currentCase,
        baselineVitals: currentCase.vitalSigns,
        currentVitals: clinicalAnchorVitalsRef.current,
        elapsedSeconds,
        statInterventions,
        unlockedExamCount: unlockedExamIds.length,
        unlockedStudyCount: unlockedStudyIds.length,
        lastEvaluatedSecond: lastEvolutionCheckRef.current,
      });

      lastEvolutionCheckRef.current = step.evolutionState.lastEvaluatedSecond;
      setEvolutionState(step.evolutionState);
      currentTrajectory = step.evolutionState.trajectory;
      if (step.changed) {
        clinicalAnchorVitalsRef.current = step.updatedVitals;
        evoChanged = true;
      }
    }

    if (elapsedSeconds === 0) {
      setLiveVitalSigns(clinicalAnchorVitalsRef.current);
      return;
    }

    if (evoChanged || elapsedSeconds >= 1) {
      const sampled = sampleLiveMonitorTelemetry({
        anchorVitals: clinicalAnchorVitalsRef.current,
        elapsedSeconds,
        caseId: currentCase.id,
        trajectory: currentTrajectory,
        isDeceased: isPatientDeceased,
      });
      setLiveVitalSigns(sampled);
    }
  }, [
    elapsedSeconds,
    activeView,
    evaluationResult,
    currentCase,
    statInterventions,
    unlockedExamIds.length,
    unlockedStudyIds.length,
    isPatientDeceased,
  ]);

  // Persist Active Simulation Session in IndexedDB (offline crash/reload recovery)
  useEffect(() => {
    if (!isStorageHydrated || activeView !== 'simulation' || evaluationResult) return;

    const handle = window.setTimeout(() => {
      void saveActiveSimulationSession({
        id: 'current',
        caseData: currentCase,
        activeTab,
        liveVitalSigns,
        statInterventions,
        messages,
        unlockedExamIds,
        unlockedStudyIds,
        primaryDiagnosis,
        differentialDiagnoses,
        clinicalJustification,
        additionalStudiesNeeded: '',
        medications,
        generalMeasures,
        hospitalizationDecision,
        referralCriteria,
        followUpPlan,
        elapsedSeconds,
        updatedAt: new Date().toISOString(),
      });
    }, 450);

    return () => window.clearTimeout(handle);
  }, [
    isStorageHydrated,
    activeView,
    evaluationResult,
    currentCase,
    activeTab,
    liveVitalSigns,
    statInterventions,
    messages,
    unlockedExamIds,
    unlockedStudyIds,
    primaryDiagnosis,
    differentialDiagnoses,
    clinicalJustification,
    medications,
    generalMeasures,
    hospitalizationDecision,
    referralCriteria,
    followUpPlan,
    Math.floor(elapsedSeconds / 15),
  ]);

  // Reset window scroll to top whenever changing views, cases, or outcome stage
  useEffect(() => {
    const resetTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetTop();
    const rafId = window.requestAnimationFrame(resetTop);
    return () => window.cancelAnimationFrame(rafId);
  }, [activeView, currentCase.id, pendingOutcome]);

  // Persist user preferences helper
  const handleUpdatePreferences = (prefs: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({
      ...prev,
      ...prefs,
      updatedAt: new Date().toISOString(),
    }));
    void saveUserPreferences(prefs);
  };

  // Set up case initial dialogue and enter simulation view
  const setupCase = (newCase: ClinicalCase) => {
    const enriched = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(newCase));
    activeChatCaseIdRef.current = enriched.id;
    lastEvolutionCheckRef.current = 0;
    setIsChatLoading(false);
    setCurrentCase(enriched);

    const maxRecentIds = Math.max(10, ALL_CURATED_CASES.length + customCases.length - 1);
    const updatedSeenIds = [
      ...recentCaseIds.filter((id) => id !== enriched.id),
      enriched.id,
    ].slice(-maxRecentIds);
    setRecentCaseIds(updatedSeenIds);

    let updatedSeenDiags = recentDiagnoses;
    if (enriched.solution?.correctDiagnosis) {
      const diag = enriched.solution.correctDiagnosis;
      updatedSeenDiags = [...recentDiagnoses.filter((d) => d !== diag), diag].slice(-95);
      setRecentDiagnoses(updatedSeenDiags);
    }

    void saveStoredProgress({
      id: 'default',
      seenCaseIds: updatedSeenIds,
      seenDiagnoses: updatedSeenDiags,
      completedCaseIds,
      updatedAt: new Date().toISOString(),
    });

    setActiveView('simulation');
    setActiveTab('anamnesis');
    setExpandedSections(['anamnesis']);
    clinicalAnchorVitalsRef.current = enriched.vitalSigns;
    setLiveVitalSigns(enriched.vitalSigns);
    setStatInterventions([]);
    setStatDrawerOpen(false);
    setSelectedEcgLead('DII');
    setUnlockedExamIds([]);
    setUnlockedStudyIds([]);
    setEmergencyChartUnlocked(false);
    setPrimaryDiagnosis('');
    setDifferentialDiagnoses([]);
    setClinicalJustification('');
    setMedications([]);
    setPendingMedDraft(undefined);
    setGeneralMeasures('');
    setHospitalizationDecision('');
    setReferralCriteria('');
    setFollowUpPlan('');
    setEvaluationResult(null);
    setPendingOutcome(null);
    setImmediateDeathAlert(null);
    setElapsedSeconds(0);
    examAutoSubmittedRef.current = false;
    urgenciasAutoSubmittedRef.current = false;

    const initialEvo = evaluateClinicalEvolutionStep({
      caseData: enriched,
      baselineVitals: enriched.vitalSigns,
      currentVitals: enriched.vitalSigns,
      elapsedSeconds: 0,
      statInterventions: [],
      unlockedExamCount: 0,
      unlockedStudyCount: 0,
      lastEvaluatedSecond: 0,
    });
    setEvolutionState(initialEvo.evolutionState);

    const isPediatric = enriched.patientInfo.age < 12;
    const greetingText = isPediatric
      ? `Buenos días doctor, gracias por atendernos tan rápido. Soy la mamá de ${enriched.patientInfo.name.replace(/\s*\([^)]*\)/, '')}; traje a mi niño porque se ha sentido bastante mal.`
      : `Buenos días doctor, gracias por atenderme. Me llamo ${enriched.patientInfo.name}. Vengo a consulta porque me he estado sintiendo bastante mal y necesito que me revise, por favor.`;

    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'patient',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Save history & progress helper (IndexedDB)
  const saveToHistory = (
    evalRes: EvaluationResult,
    caseItem: ClinicalCase,
    userDiag: string,
    clearActiveSession = true
  ) => {
    const record: SavedCaseRecord = {
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      caseId: caseItem.id,
      patientName: caseItem.patientInfo.name,
      specialty: caseItem.specialty,
      mode: caseItem.mode,
      userDiagnosis: userDiag || 'Sin diagnóstico registrado',
      correctDiagnosis: caseItem.solution.correctDiagnosis,
      score: evalRes.totalScore,
      date: new Date().toISOString(),
      evaluation: evalRes,
    };

    setHistory((prev) => [record, ...prev]);

    const nextSeenIds = [...recentCaseIds.filter((id) => id !== caseItem.id), caseItem.id].slice(
      -Math.max(10, ALL_CURATED_CASES.length + customCases.length - 1)
    );
    setRecentCaseIds(nextSeenIds);

    setCompletedCaseIds((prevCompleted) => {
      const updatedCompleted = Array.from(new Set([...prevCompleted, caseItem.id]));
      void saveStoredProgress({
        id: 'default',
        seenCaseIds: nextSeenIds,
        seenDiagnoses: recentDiagnoses,
        completedCaseIds: updatedCompleted,
        updatedAt: new Date().toISOString(),
      });
      return updatedCompleted;
    });

    void saveHistoryRecord(record);
    if (clearActiveSession) {
      void clearActiveSimulationSession();
    }
  };

  const handleStartTurnoMedico = (config: TurnoMedicoConfig) => {
    const queue = selectTurnoMedicoCases(config, customCases, recentCaseIds);
    setTurnoConfig(config);
    setTurnoCases(queue);
    setTurnoSessionKey((k) => k + 1);
    setActiveView('turno_medico');
  };

  const handleTurnoPatientResolved = (res: TurnoPatientResult) => {
    saveToHistory(
      res.evaluation,
      res.caseData,
      res.evaluation.userSummary?.primaryDiagnosis || '',
      false
    );
  };

  const handleStartProgressiveExam = (config: ProgressiveExamConfig) => {
    const stations = buildProgressiveExamSession(config, customCases, recentCaseIds);
    setExamConfig(config);
    setExamStations(stations);
    setExamSessionKey((k) => k + 1);
    setIsProgressiveExamFinished(false);
    setActiveView('examen_progresivo');
  };

  const handleExamCompleted = (evalRes: ProgressiveExamEvaluation) => {
    setIsProgressiveExamFinished(true);
    const records = buildStationHistoryRecords(evalRes);
    if (records.length === 0) return;

    setHistory((prev) => [...records, ...prev]);

    const newIds = records.map((r) => r.caseId).filter(Boolean);
    const maxRecent = Math.max(10, ALL_CURATED_CASES.length + customCases.length - 1);
    const nextSeenIds = [
      ...recentCaseIds.filter((id) => !newIds.includes(id)),
      ...newIds,
    ].slice(-maxRecent);
    setRecentCaseIds(nextSeenIds);

    setCompletedCaseIds((prevCompleted) => {
      const updatedCompleted = Array.from(new Set([...prevCompleted, ...newIds]));
      void saveStoredProgress({
        id: 'default',
        seenCaseIds: nextSeenIds,
        seenDiagnoses: recentDiagnoses,
        completedCaseIds: updatedCompleted,
        updatedAt: new Date().toISOString(),
      });
      return updatedCompleted;
    });

    for (const rec of records) {
      void saveHistoryRecord(rec);
    }
  };

  // Deterministic 100% Offline Virtual Patient Chat Handler
  const handleSendMessage = async (text: string) => {
    if (isPatientDeceased || liveVitalSigns.glasgow <= 9) return;

    const requestCaseId = currentCase.id;
    activeChatCaseIdRef.current = requestCaseId;

    const newDocMsg: ChatMessage = {
      id: `msg-doc-${Date.now()}`,
      sender: 'doctor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newDocMsg];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    const chatPayload: PatientChatPayload = {
      history: updatedMessages.slice(0, -1),
      userMessage: text,
      patientPersona: currentCase.internalPersonaPrompt,
      patientInfo: currentCase.patientInfo,
      vitalSigns: currentCase.vitalSigns,
      liveVitalSigns,
      isDeceased: isPatientDeceased,
      appliedStatInterventions: statInterventions.map((s) => ({
        label: s.label,
        drug: s.drug,
        dose: s.dose,
        route: s.route,
        effectSeverity: s.effectSeverity,
        patientFeelingNote: s.patientFeelingNote,
        deltasSummary: s.deltas.map((d) => `${d.metric} ${d.before}->${d.after}`).join(', '),
      })),
      background: currentCase.background,
      clinicalClues: currentCase.solution?.keyClinicalClues,
      characteristicSymptoms: currentCase.solution?.characteristicSignsSymptoms,
      specialty: currentCase.specialty,
      caseId: currentCase.id,
    };

    // Short micro-delay for natural conversational pacing without any external request
    await new Promise((resolve) => window.setTimeout(resolve, 90));
    if (activeChatCaseIdRef.current !== requestCaseId) return;

    const localReply = generateContextualPatientReply(chatPayload);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-pat-${Date.now()}`,
        sender: 'patient',
        text: localReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsChatLoading(false);
  };

  // Apply STAT emergency intervention and update live vitals + evolution + patient dialogue
  const handleApplyStatIntervention = (input: StatApplyInput) => {
    if (isPatientDeceased) return;

    const outcome = applyStatIntervention(
      clinicalAnchorVitalsRef.current,
      currentCase.vitalSigns,
      currentCase,
      input,
      statInterventions,
      elapsedSeconds
    );

    const nextStatList = [...statInterventions, outcome.record];
    clinicalAnchorVitalsRef.current = outcome.updatedVitals;
    setLiveVitalSigns(outcome.updatedVitals);
    setStatInterventions(nextStatList);

    const evoAfterStat = evaluateClinicalEvolutionStep({
      caseData: currentCase,
      baselineVitals: currentCase.vitalSigns,
      currentVitals: outcome.updatedVitals,
      elapsedSeconds,
      statInterventions: nextStatList,
      unlockedExamCount: unlockedExamIds.length,
      unlockedStudyCount: unlockedStudyIds.length,
      lastEvaluatedSecond: elapsedSeconds,
    });
    lastEvolutionCheckRef.current = elapsedSeconds;
    setEvolutionState(evoAfterStat.evolutionState);

    setMedications((prev) => {
      const normalizedNew = `${outcome.medicationItem.drug.toLowerCase()}::${outcome.medicationItem.dose.toLowerCase()}::${outcome.medicationItem.route.toLowerCase()}`;
      const matchIdx = prev.findIndex(
        (m) => `${m.drug.toLowerCase()}::${m.dose.toLowerCase()}::${m.route.toLowerCase()}` === normalizedNew
      );
      if (matchIdx === -1) {
        return [...prev, outcome.medicationItem];
      }
      return prev.map((m, idx) => {
        if (idx !== matchIdx) return m;
        const countMatch = (m.frequency || '').match(/×\s*(\d+)/);
        const nextCount = countMatch ? parseInt(countMatch[1], 10) + 1 : 2;
        return {
          ...m,
          frequency: `Aplicado STAT × ${nextCount}`,
        };
      });
    });

    const nowTs = outcome.record.appliedAt;
    const baseTime = Date.now();
    const sysMsg: ChatMessage = {
      id: `msg-stat-sys-${baseTime}`,
      sender: 'system',
      text: `${outcome.record.drug} (${outcome.record.dose}, ${outcome.record.route}) aplicada.`,
      timestamp: nowTs,
    };
    const patientReactionMsg: ChatMessage = {
      id: `msg-stat-pat-${baseTime + 1}`,
      sender: 'patient',
      text: outcome.record.patientFeelingNote,
      timestamp: nowTs,
    };

    setMessages((prev) => [...prev, sysMsg, patientReactionMsg]);

    if (outcome.isImmediateDeath) {
      setStatDrawerOpen(false);
      setImmediateDeathAlert({
        drug: outcome.record.drug,
        dose: outcome.record.dose,
        route: outcome.record.route,
        reason: outcome.immediateDeathReason || outcome.record.physiologicalEffectSummary,
        appliedAt: nowTs,
      });
    }
  };

  // Unlock physical exam finding
  const handleUnlockExam = (id: string) => {
    if (!unlockedExamIds.includes(id)) {
      setUnlockedExamIds([...unlockedExamIds, id]);
    }
  };

  const handleUnlockAllExams = () => {
    setUnlockedExamIds(currentCase.physicalExamPool.map((e) => e.id));
  };

  // Unlock complementary study report
  const handleUnlockStudy = (id: string) => {
    if (!unlockedStudyIds.includes(id)) {
      setUnlockedStudyIds([...unlockedStudyIds, id]);
    }
  };

  const handleUnlockAllStudies = () => {
    setUnlockedStudyIds(currentCase.studiesPool.map((s) => s.id));
  };

  // Local Offline Case Selection / Generation
  const handleSelectCase = async (mode: GameMode, specialty: Specialty, caseId?: string) => {
    setIsGeneratingCase(true);
    try {
      handleUpdatePreferences({ preferredMode: mode, preferredSpecialty: specialty });

      const selectedCase = selectLocalClinicalCase({
        mode,
        specialty,
        caseId,
        excludeCaseId:
          activeView === 'simulation' || recentCaseIds.includes(currentCase.id)
            ? currentCase.id
            : recentCaseIds[recentCaseIds.length - 1],
        excludeCaseIds: recentCaseIds,
        excludeDiagnoses: recentDiagnoses,
        customCases,
      });

      setupCase(selectedCase);
      setNewCaseModalOpen(false);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  const handleStartNextUnseen = async (mode: GameMode, specialty: Specialty) => {
    setIsGeneratingCase(true);
    try {
      handleUpdatePreferences({ preferredMode: mode, preferredSpecialty: specialty });

      const selectedCase = selectLocalClinicalCase({
        mode,
        specialty,
        completedCaseIds,
        preferUnseen: true,
        excludeCaseIds: recentCaseIds,
        excludeDiagnoses: recentDiagnoses,
        customCases,
      });

      setupCase(selectedCase);
      setNewCaseModalOpen(false);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  const handleRetryCaseById = async (caseId: string, mode?: GameMode) => {
    const library = getLocalCaseLibrary(customCases);
    const matched = library.find((c) => c.id === caseId);
    await handleSelectCase(
      mode || matched?.mode || userPreferences.preferredMode,
      matched?.specialty || userPreferences.preferredSpecialty,
      caseId
    );
  };

  // Save & Delete Custom Cases in IndexedDB
  const handleSaveCustomCase = async (newCase: ClinicalCase) => {
    await saveCustomCase(newCase);
    setCustomCases((prev) => [newCase, ...prev.filter((c) => c.id !== newCase.id)]);
  };

  const handleDeleteCustomCase = async (caseId: string) => {
    await deleteCustomCase(caseId);
    setCustomCases((prev) => prev.filter((c) => c.id !== caseId));
  };

  // Deterministic 100% Offline Evaluation Engine
  const executeFinishCase = async (pendingDraft?: MedicationItem, skipOutcomeModal = false) => {
    setIsEvaluating(true);
    try {
      const doctorQuestions = messages.filter((m) => m.sender === 'doctor').map((m) => m.text);
      const effectiveMedications = pendingDraft ? [...medications, pendingDraft] : medications;

      const isEcoeMode = currentCase.mode === 'examen';
      const submission: UserEvaluationInput = {
        primaryDiagnosis,
        differentialDiagnoses: isEcoeMode ? differentialDiagnoses : [],
        clinicalJustification: isEcoeMode ? clinicalJustification : '',
        additionalStudiesNeeded: '',
        pharmacologicalPlan: effectiveMedications,
        generalMeasures,
        hospitalizationDecision,
        referralCriteria: isEcoeMode ? referralCriteria : '',
        followUpPlan: isEcoeMode ? followUpPlan : '',
        unlockedExams: unlockedExamIds,
        unlockedStudies: unlockedStudyIds,
        questionCount: doctorQuestions.length,
        doctorQuestions,
        timeSpentSeconds: elapsedSeconds,
        statInterventions,
        baselineVitalSigns: currentCase.vitalSigns,
        finalVitalSigns: liveVitalSigns,
      };

      const evalResult = evaluateClinicalCaseLocally(submission, currentCase);
      setEvaluationResult(evalResult);
      if (pendingDraft) {
        setMedications(effectiveMedications);
        setPendingMedDraft(undefined);
      }
      saveToHistory(evalResult, currentCase, primaryDiagnosis);
      if (skipOutcomeModal) {
        setPendingOutcome(null);
      } else {
        setPendingOutcome(evaluateClinicalOutcomeLocally(evalResult, currentCase));
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinishCase = async (pendingDraft?: MedicationItem) => {
    await executeFinishCase(pendingDraft ?? pendingMedDraft, false);
  };

  const focusSection = (
    sectionId:
      | 'anamnesis'
      | 'background'
      | 'physical_exam'
      | 'studies'
      | 'diagnosis'
      | 'treatment'
      | 'audit'
  ) => {
    setActiveTab(sectionId);
    setExpandedSections((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]));
    window.setTimeout(() => {
      const el = document.getElementById(`expediente-${sectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const toggleSection = (
    sectionId:
      | 'anamnesis'
      | 'background'
      | 'physical_exam'
      | 'studies'
      | 'diagnosis'
      | 'treatment'
      | 'audit'
  ) => {
    setActiveTab(sectionId);
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const closeSectionAndKeepPlace = (
    sectionId:
      | 'anamnesis'
      | 'background'
      | 'physical_exam'
      | 'studies'
      | 'diagnosis'
      | 'treatment'
      | 'audit'
  ) => {
    const elBefore = document.getElementById(`expediente-${sectionId}`);
    const rectBefore = elBefore?.getBoundingClientRect();

    setExpandedSections((prev) => prev.filter((id) => id !== sectionId));

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const elAfter = document.getElementById(`expediente-${sectionId}`);
        if (!elAfter) return;
        const rectAfter = elAfter.getBoundingClientRect();
        const headerBottom =
          document.querySelector('header')?.getBoundingClientRect().bottom ?? 120;
        const minVisibleTop = headerBottom + 8;

        if (!rectBefore || rectBefore.top < minVisibleTop || rectAfter.top < minVisibleTop) {
          elAfter.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        const delta = rectAfter.top - rectBefore.top;
        if (Math.abs(delta) > 2) {
          window.scrollBy({ top: delta, behavior: 'auto' });
        }
      });
    });
  };

  const handleClearDecisionDraft = () => {
    setPrimaryDiagnosis('');
    setDifferentialDiagnoses([]);
    setClinicalJustification('');
    setMedications([]);
    setPendingMedDraft(undefined);
    setGeneralMeasures('');
    setHospitalizationDecision('');
    setReferralCriteria('');
    setFollowUpPlan('');
  };

  const handleGoToAuditAfterImmediateDeath = async () => {
    setImmediateDeathAlert(null);
    await executeFinishCase(undefined, true);
    focusSection('audit');
  };

  // Keep latest finish handlers for timed Exam & abrupt Urgencias auto-submit
  latestFinishRef.current = () => {
    void handleFinishCase();
  };

  latestUrgenciasTimeoutRef.current = () => {
    void (async () => {
      setStatDrawerOpen(false);
      setNewCaseModalOpen(false);
      setHistoryModalOpen(false);
      setGuideModalOpen(false);
      setCalculatorsModalOpen(false);
      setImmediateDeathAlert(null);
      await executeFinishCase(pendingMedDraft, true);
      focusSection('audit');
    })();
  };

  useEffect(() => {
    if (
      activeView === 'simulation' &&
      !evaluationResult &&
      !isEvaluating &&
      currentCase.mode === 'examen' &&
      elapsedSeconds >= EXAMEN_WINDOW_SECONDS &&
      !examAutoSubmittedRef.current
    ) {
      examAutoSubmittedRef.current = true;
      latestFinishRef.current();
    }
  }, [elapsedSeconds, activeView, evaluationResult, isEvaluating, currentCase.mode]);

  useEffect(() => {
    if (
      activeView === 'simulation' &&
      !evaluationResult &&
      !isEvaluating &&
      currentCase.mode === 'urgencias' &&
      elapsedSeconds >= URGENCIAS_WINDOW_SECONDS &&
      !urgenciasAutoSubmittedRef.current
    ) {
      urgenciasAutoSubmittedRef.current = true;
      latestUrgenciasTimeoutRef.current();
    }
  }, [elapsedSeconds, activeView, evaluationResult, isEvaluating, currentCase.mode]);

  const isUrgenciasMode = currentCase.mode === 'urgencias';
  const isExamenMode = currentCase.mode === 'examen';
  const urgenciasRemaining = Math.max(0, URGENCIAS_WINDOW_SECONDS - elapsedSeconds);
  const examenRemaining = Math.max(0, EXAMEN_WINDOW_SECONDS - elapsedSeconds);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Review past case from history (checks curated + custom cases)
  const handleReviewPastCase = (record: SavedCaseRecord) => {
    const allLibrary = getLocalCaseLibrary(customCases);
    const found = allLibrary.find((c) => c.id === record.caseId) || {
      ...currentCase,
      solution: {
        ...currentCase.solution,
        correctDiagnosis: record.correctDiagnosis,
      },
    };
    const enrichedFound = enrichCaseWithUniversalPhysicalExam(enrichCaseWithHospitalCatalog(found));
    const summary = record.evaluation.userSummary;
    const finalVitals = summary?.finalVitalSigns || enrichedFound.vitalSigns;

    const unlockedExamSet = new Set(summary?.unlockedExamsNames || []);
    const matchedExamIds = enrichedFound.physicalExamPool
      .filter((pe) => unlockedExamSet.has(pe.name))
      .map((pe) => pe.id);

    const unlockedStudySet = new Set(summary?.unlockedStudiesNames || []);
    const matchedStudyIds = enrichedFound.studiesPool
      .filter((st) => unlockedStudySet.has(st.name))
      .map((st) => st.id);

    setCurrentCase(enrichedFound);
    clinicalAnchorVitalsRef.current = finalVitals;
    setLiveVitalSigns(finalVitals);
    setStatInterventions([]);
    setStatDrawerOpen(false);
    setEvolutionState(undefined);
    setUnlockedExamIds(matchedExamIds);
    setUnlockedStudyIds(matchedStudyIds);
    setEmergencyChartUnlocked(false);
    setPrimaryDiagnosis(summary?.primaryDiagnosis || record.userDiagnosis || '');
    setDifferentialDiagnoses(summary?.differentialDiagnoses || []);
    setClinicalJustification(summary?.clinicalJustification || '');
    setMedications(summary?.pharmacologicalPlan || []);
    setPendingMedDraft(undefined);
    setGeneralMeasures(summary?.generalMeasures || '');
    setHospitalizationDecision(summary?.hospitalizationDecision || '');
    setReferralCriteria(summary?.referralCriteria || '');
    setFollowUpPlan(summary?.followUpPlan || '');
    setMessages([]);
    setEvaluationResult(record.evaluation);
    setPendingOutcome(null);
    setImmediateDeathAlert(null);
    setActiveView('simulation');
    setActiveTab('audit');
    setExpandedSections(['audit']);
  };

  const totalLibraryCount = getLocalCaseLibrary(customCases).length;
  const disclosedBg = deriveDisclosedBackground(
    messages,
    Boolean(evaluationResult) || emergencyChartUnlocked
  );

  const activeNavSection: NavSectionKey = newCaseModalOpen
    ? 'cases'
    : historyModalOpen
      ? 'history'
      : guideModalOpen
        ? 'guides'
        : calculatorsModalOpen
          ? 'calculators'
          : 'home';

  const buildExitPromptInfo = (leaveButtonLabel: string): ExitSimulationPromptInfo => {
    if (activeView === 'turno_medico') {
      return {
        modeLabel: 'Turno Médico en Curso',
        title: '¿Salir del Turno Médico?',
        description:
          'Estás atendiendo una guardia multi-paciente. Si sales ahora, se interrumpirá la cola de pacientes pendientes.',
        contextLine: `Turno de ${turnoCases.length} pacientes · Guardia activa`,
        leaveButtonLabel,
      };
    }

    if (activeView === 'examen_progresivo') {
      return {
        modeLabel: 'Examen Clínico Progresivo',
        title: '¿Salir del Examen Progresivo?',
        description:
          'Aún no has completado todas las estaciones del bloque. Si sales ahora, no se guardará tu progreso ni el debriefing.',
        contextLine: `Bloque de ${examStations.length} estaciones en curso`,
        leaveButtonLabel,
      };
    }

    const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    return {
      modeLabel: 'Simulación Clínica en Curso',
      title: '¿Salir de la consulta actual?',
      description:
        'Tienes un expediente clínico abierto que aún no ha sido evaluado. Si sales ahora sin enviar, esta atención quedará interrumpida.',
      contextLine: `Paciente: ${currentCase.patientInfo.name} · Tiempo: ${mins}:${secs} · Estudios: ${unlockedStudyIds.length}/${liveStudies.length}`,
      leaveButtonLabel,
    };
  };

  const requestSafeNavigation = (leaveButtonLabel: string, action: () => void) => {
    if (!isActiveSimulationInProgress) {
      action();
      return;
    }
    setPendingExitRequest({
      info: buildExitPromptInfo(leaveButtonLabel),
      onConfirm: action,
    });
  };

  const performHeaderModeChange = (mode: GameMode | 'turno_medico' | 'examen_progresivo') => {
    setLobbyClassification(mode);
    if (mode === 'turno_medico') {
      if (activeView !== 'lobby') {
        handleStartTurnoMedico({
          ...turnoConfig,
          specialty: userPreferences.preferredSpecialty,
        });
      }
      return;
    }

    if (mode === 'examen_progresivo') {
      if (activeView !== 'lobby') {
        handleStartProgressiveExam({
          ...examConfig,
          specialty: userPreferences.preferredSpecialty,
        });
      }
      return;
    }

    handleUpdatePreferences({ preferredMode: mode });
    if (
      (activeView === 'simulation' && mode !== currentCase.mode) ||
      activeView === 'turno_medico' ||
      activeView === 'examen_progresivo'
    ) {
      void handleSelectCase(mode, userPreferences.preferredSpecialty);
    }
  };

  const handleHeaderModeChange = (mode: GameMode | 'turno_medico' | 'examen_progresivo') => {
    const currentEffectiveMode =
      activeView === 'turno_medico'
        ? 'turno_medico'
        : activeView === 'examen_progresivo'
          ? 'examen_progresivo'
          : activeView === 'simulation'
            ? currentCase.mode
            : lobbyClassification;

    if (mode === currentEffectiveMode) return;

    requestSafeNavigation('Sí, cambiar modalidad', () => {
      if (activeView === 'simulation') {
        void clearActiveSimulationSession();
      }
      performHeaderModeChange(mode);
    });
  };

  // Protect against accidental browser Back button or tab close/reload while a simulation is active
  const activeSimGuardRef = useRef(false);
  const simHistoryPushedRef = useRef(false);
  const requestExitRef = useRef<() => void>(() => {});
  activeSimGuardRef.current = isActiveSimulationInProgress;
  requestExitRef.current = () => {
    requestSafeNavigation('Sí, salir al inicio', () => {
      simHistoryPushedRef.current = false;
      if (activeView === 'simulation') {
        void clearActiveSimulationSession();
      }
      setActiveView('lobby');
    });
  };

  useEffect(() => {
    if (isActiveSimulationInProgress && !simHistoryPushedRef.current) {
      window.history.pushState({ simGuard: true }, '');
      simHistoryPushedRef.current = true;
    } else if (!isActiveSimulationInProgress) {
      simHistoryPushedRef.current = false;
    }
  }, [isActiveSimulationInProgress]);

  useEffect(() => {
    const handlePopState = () => {
      if (activeSimGuardRef.current) {
        window.history.pushState({ simGuard: true }, '');
        requestExitRef.current();
      }
    };
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeSimGuardRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const allSectionIds = [
    'anamnesis',
    'background',
    'physical_exam',
    'studies',
    'diagnosis',
    'treatment',
    ...(evaluationResult && !pendingOutcome ? ['audit'] : []),
  ];
  const allExpanded = allSectionIds.every((id) => expandedSections.includes(id));

  const expedienteSections: Array<{
    id: 'anamnesis' | 'background' | 'physical_exam' | 'studies' | 'diagnosis' | 'treatment' | 'audit';
    title: string;
    subtitle: string;
    badge?: string;
    icon: any;
  }> = [
    {
      id: 'anamnesis',
      title: 'Anamnesis',
      subtitle: 'Historia clínica del paciente',
      badge: `${messages.filter((m) => m.sender === 'doctor').length} preg.`,
      icon: MessageSquare,
    },
    {
      id: 'background',
      title: 'Antecedentes',
      subtitle: 'Patológicos, alergias y medicación actual',
      badge:
        disclosedBg.pathological || disclosedBg.allergies || disclosedBg.currentMedications
          ? 'Consultado'
          : 'Por interrogar',
      icon: FileText,
    },
    {
      id: 'physical_exam',
      title: 'Exploración Física',
      subtitle: 'Hallazgos relevantes al examen',
      badge: `${unlockedExamIds.length}/${livePhysicalExams.length}`,
      icon: Stethoscope,
    },
    {
      id: 'studies',
      title: 'Estudios Complementarios',
      subtitle: 'Resultados de laboratorios e imágenes',
      badge: `${unlockedStudyIds.length}/${liveStudies.length}`,
      icon: FlaskConical,
    },
    {
      id: 'diagnosis',
      title: isExamenMode ? 'Diagnóstico Diferencial' : 'Diagnóstico Clínico',
      subtitle: isExamenMode
        ? 'Diagnóstico principal, diferenciales y justificación'
        : 'Impresión diagnóstica principal',
      badge: primaryDiagnosis.trim() ? 'Definido' : undefined,
      icon: Brain,
    },
    {
      id: 'treatment',
      title: 'Tratamiento',
      subtitle: 'Manejo y conductas terapéuticas',
      badge: medications.length > 0 ? `${medications.length} fárm.` : undefined,
      icon: Pill,
    },
    ...(evaluationResult && !pendingOutcome
      ? [
          {
            id: 'audit' as const,
            title: 'Auditoría Clínica',
            subtitle: 'Evaluación docente y retroalimentación final',
            badge: `${evaluationResult.totalScore}/100`,
            icon: Award,
          },
        ]
      : []),
  ];

  const handleOpenCasesLibrary = () => {
    setNewCaseModalTab('presets');
    setNewCaseModalOpen(true);
  };

  const isTurnoDark = activeView === 'turno_medico';

  return (
    <div
      className={`min-h-screen w-full overflow-x-clip flex flex-col font-sans selection:text-white transition-colors duration-200 ${
        isTurnoDark
          ? 'bg-[#0B1411] text-[#E8F2ED] selection:bg-[#3A846B]'
          : 'bg-[#F3F7F4] text-[#263A32] selection:bg-[#43866B]'
      }`}
    >
      {/* Top Hospital Emerald Header + Unified Horizontal Main Nav */}
      <Navbar
        activeView={activeView}
        activeSection={activeNavSection}
        onGoHome={() =>
          requestSafeNavigation('Sí, salir al inicio', () => {
            if (activeView === 'simulation') {
              void clearActiveSimulationSession();
            }
            setActiveView('lobby');
          })
        }
        onOpenCasesLibrary={handleOpenCasesLibrary}
        onOpenHistoryModal={() => setHistoryModalOpen(true)}
        onOpenGuideModal={() => setGuideModalOpen(true)}
        onOpenCalculatorsModal={() => setCalculatorsModalOpen(true)}
        onRestartCase={() =>
          requestSafeNavigation('Sí, reiniciar caso', () => setupCase(currentCase))
        }
        onSelectMode={handleHeaderModeChange}
        currentMode={
          activeView === 'turno_medico'
            ? 'turno_medico'
            : activeView === 'examen_progresivo'
              ? 'examen_progresivo'
              : activeView === 'simulation'
                ? currentCase.mode
                : lobbyClassification
        }
        currentSpecialty={currentCase.specialty}
        historyCount={history.length}
      />

      {activeView === 'turno_medico' ? (
        <div className="pb-20 md:pb-6">
          <TurnoMedicoView
            key={turnoSessionKey}
            config={turnoConfig}
            cases={turnoCases}
            onExitTurno={() => setActiveView('lobby')}
            onStartNewTurno={handleStartTurnoMedico}
            onPatientResolved={handleTurnoPatientResolved}
          />
        </div>
      ) : activeView === 'examen_progresivo' ? (
        <div className="flex-1 pb-12">
          <ProgressiveExamView
            key={examSessionKey}
            config={examConfig}
            stations={examStations}
            onExitToLobby={() =>
              requestSafeNavigation('Sí, salir del examen', () => setActiveView('lobby'))
            }
            onStartNewExam={handleStartProgressiveExam}
            onExamCompleted={handleExamCompleted}
          />
        </div>
      ) : (
        <div className="flex-1 max-w-5xl w-full min-w-0 mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-8 md:pb-10">
          <main className="w-full min-w-0 space-y-4">
            {activeView === 'lobby' ? (
              <HomeDashboard
                onStartSimulation={handleSelectCase}
                onStartTurnoMedico={handleStartTurnoMedico}
                onStartProgressiveExam={handleStartProgressiveExam}
                isLoading={isGeneratingCase}
                totalCasesCount={totalLibraryCount}
                initialMode={userPreferences.preferredMode}
                initialSpecialty={userPreferences.preferredSpecialty}
                externalClassification={lobbyClassification}
                onClassificationChange={setLobbyClassification}
                onPreferencesChange={(mode, specialty) =>
                  handleUpdatePreferences({ preferredMode: mode, preferredSpecialty: specialty })
                }
                completedCaseIds={completedCaseIds}
                customCaseIds={customCases.map((c) => c.id)}
                history={history}
                onStartNextUnseen={handleStartNextUnseen}
                onRetryCase={handleRetryCaseById}
              />
            ) : (
              <>
                {/* Patient Summary Card */}
                <PatientBanner
                  caseData={currentCase}
                  liveVitals={liveVitalSigns}
                  isDeceased={isPatientDeceased}
                  revealSpecialty={Boolean(evaluationResult)}
                  disclosedBackground={disclosedBg}
                />

                {/* Fixed Out-of-Flow Compact Telemetry Strip when scrolled into Expediente (zero layout shift) */}
                {isMonitorOffscreen && !evaluationResult && (
                  <div
                    aria-label="Monitor compacto en vivo"
                    className="fixed top-[104px] md:top-[116px] left-0 right-0 z-30 pointer-events-none px-2.5 sm:px-6"
                  >
                    <div
                      className={`max-w-5xl mx-auto pointer-events-auto h-9 rounded-xl border px-3 shadow-md backdrop-blur-md flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums overflow-hidden ${
                        evolutionState?.trajectory === 'critico' || isPatientDeceased
                          ? 'bg-rose-50/95 border-rose-300 text-rose-950'
                          : 'bg-[#F3FBF6]/95 border-[#B8D7C4] text-[#1F4B3A]'
                      }`}
                    >
                      <div className="flex items-center gap-x-3 overflow-x-auto no-scrollbar whitespace-nowrap min-w-0 flex-1">
                        <span className="inline-flex items-center gap-1 font-sans font-bold shrink-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              evolutionState?.trajectory === 'critico' || isPatientDeceased
                                ? 'bg-rose-600'
                                : 'bg-emerald-600'
                            }`}
                          />
                          <span>En vivo</span>
                        </span>
                        <span className="shrink-0">TA {liveVitalSigns.bloodPressure.split(' ')[0]}</span>
                        <span className="shrink-0">FC {liveVitalSigns.heartRate}</span>
                        <span className="shrink-0">FR {liveVitalSigns.respiratoryRate}</span>
                        <span className="shrink-0">SpO₂ {liveVitalSigns.oxygenSaturation}%</span>
                        <span className="shrink-0">T° {liveVitalSigns.temperature.toFixed(1)}°</span>
                        <span className="shrink-0">GCS {liveVitalSigns.glasgow}/15</span>
                        {typeof liveVitalSigns.bloodGlucose === 'number' && (
                          <span className="shrink-0">Gluc {liveVitalSigns.bloodGlucose}</span>
                        )}
                      </div>
                      {isUrgenciasMode && (
                        <span className="font-bold text-amber-800 shrink-0 whitespace-nowrap">
                          Ventana {formatTimer(urgenciasRemaining)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Vital Signs Card */}
                <div ref={vitalsMonitorRef}>
                  <VitalSignsMonitor
                    vitals={liveVitalSigns}
                    baselineVitals={currentCase.vitalSigns}
                    statCount={statInterventions.length}
                    triageLevel={currentCase.patientInfo.triageLevel}
                    onOpenStat={() => setStatDrawerOpen(true)}
                    showStatButton={!evaluationResult}
                    evolutionState={evolutionState}
                    isDeceased={isPatientDeceased}
                    patientAge={currentCase.patientInfo.age}
                    isPregnant={isPublicPregnant}
                    unlockedStudies={unlockedStudyObjects}
                    showEcgMonitor={isUrgenciasMode}
                    ecgStudy={liveEcgStudy}
                    selectedEcgLead={selectedEcgLead}
                    onChangeEcgLead={setSelectedEcgLead}
                  />
                </div>

                {/* Compact Expediente Controls + Timer Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white border border-[#E2EAE4] rounded-2xl px-3.5 sm:px-5 py-2.5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#263A32]">
                      Expediente Clínico
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSections(allExpanded ? [] : allSectionIds)
                      }
                      className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#F3F7F4] hover:bg-[#E4F1E8] border border-[#E2EAE4] text-xs font-semibold text-[#1F4B3A] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ChevronsUpDown className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                      <span>{allExpanded ? 'Cerrar todo' : 'Abrir todo'}</span>
                    </button>
                  </div>

                  {/* Consultation Timer */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isUrgenciasMode ? (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-mono tabular-nums px-3 py-1.5 rounded-xl border ${
                          urgenciasRemaining === 0
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : urgenciasRemaining <= 120
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-[#F8FBF9] border-amber-200 text-amber-900'
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 shrink-0 ${urgenciasRemaining === 0 ? 'text-rose-600' : 'text-amber-600'}`} />
                        <span className="font-sans text-[11px] font-semibold">Ventana:</span>
                        <span className="font-bold">
                          {urgenciasRemaining > 0 ? formatTimer(urgenciasRemaining) : 'EXCEDIDA'}
                        </span>
                      </div>
                    ) : isExamenMode ? (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-mono tabular-nums px-3 py-1.5 rounded-xl border ${
                          examenRemaining <= 60
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-sky-50 border-sky-200 text-sky-900'
                        }`}
                      >
                        <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${examenRemaining <= 60 ? 'text-rose-600' : 'text-sky-700'}`} />
                        <span className="font-sans text-[11px] font-semibold">Examen:</span>
                        <span className="font-bold">{formatTimer(examenRemaining)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-[#55685F] font-mono tabular-nums bg-[#F8FBF9] border border-[#E2EAE4] px-3 py-1.5 rounded-xl">
                        <Timer className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                        <span className="hidden sm:inline font-sans font-medium">Tiempo:</span>
                        <span className="font-bold text-[#263A32]">{formatTimer(elapsedSeconds)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Persistent Immediate Death Banner */}
                {isPatientDeceased && !evaluationResult && !immediateDeathAlert && (
                  <div className="bg-rose-50 border border-rose-300 rounded-2xl px-4 py-3 text-xs text-rose-900 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <Skull className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>
                        <strong className="text-rose-950 uppercase">Paciente Fallecido por Iatrogenia Inmediata · Asistolia:</strong>{' '}
                        Puede revisar el expediente o finalizar el caso para consultar su dictamen en Auditoría Clínica.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleGoToAuditAfterImmediateDeath()}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
                    >
                      Finalizar y Ver Auditoría
                    </button>
                  </div>
                )}

                {/* Mode-Specific Notices */}
                {!evaluationResult && isUrgenciasMode && urgenciasRemaining <= 60 && urgenciasRemaining > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs text-rose-900 flex items-center gap-2.5 shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Último minuto de ventana crítica (8 min): al agotarse el tiempo, la consulta finalizará automáticamente y pasará directo a Auditoría Clínica.
                    </span>
                  </div>
                )}

                {!evaluationResult && isExamenMode && (
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
                    <div className="flex items-center gap-2 text-sky-900">
                      <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                      <span>
                        <strong className="text-sky-950">Evaluación Ciega (Modo Examen):</strong> Sin preguntas sugeridas, sin botones de desbloqueo masivo y sin alertas visuales en hallazgos.
                      </span>
                    </div>
                    {examenRemaining <= 60 && (
                      <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Último minuto (envío automático al llegar a 00:00)
                      </span>
                    )}
                  </div>
                )}

                {/* Collapsible Clinical Expediente Accordion Cards matching mockup */}
                <div className="space-y-3 no-scroll-anchor">
                  {expedienteSections.map((section, idx) => {
                    const Icon = section.icon;
                    const isOpen = expandedSections.includes(section.id);
                    const nextSection =
                      idx < expedienteSections.length - 1 ? expedienteSections[idx + 1] : null;

                    return (
                      <div
                        key={section.id}
                        id={`expediente-${section.id}`}
                        className="rounded-2xl border border-[#E2EAE4] bg-white shadow-[0_2px_8px_rgba(38,58,50,0.04)] overflow-hidden scroll-mt-[146px] md:scroll-mt-[124px]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          aria-expanded={isOpen}
                          className="w-full px-3.5 sm:px-5 py-3 flex items-center justify-between gap-3 text-left hover:bg-[#F7FBF8] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#236A54] to-[#3A846B] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm sm:text-base font-bold text-[#263A32] leading-snug">
                                {section.title}
                              </div>
                              <div className="text-xs text-[#55685F] mt-0.5 leading-snug">
                                {section.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {section.badge && (
                              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-xl bg-[#E4F1E8] text-[#1F4B3A] text-[11px] font-bold font-mono tabular-nums">
                                {section.badge}
                              </span>
                            )}
                            <span
                              aria-hidden="true"
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                                isOpen
                                  ? 'bg-[#E4F1E8] border-[#72A98A]/60 text-[#1F4B3A]'
                                  : 'bg-[#F3F7F4] border-[#E2EAE4] text-[#55685F]'
                              }`}
                            >
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 shrink-0" />
                              )}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-[#E2EAE4] bg-[#FAFDFB]">
                            <div className="p-3 sm:p-4">
                              {section.id === 'anamnesis' && (
                                <AnamnesisTab
                                  key={currentCase.id}
                                  caseData={currentCase}
                                  messages={messages}
                                  onSendMessage={handleSendMessage}
                                  isLoading={isChatLoading}
                                  liveVitals={liveVitalSigns}
                                  isDeceased={isPatientDeceased}
                                  initialTtsEnabled={userPreferences.ttsEnabled}
                                  onToggleTts={(enabled) =>
                                    handleUpdatePreferences({ ttsEnabled: enabled })
                                  }
                                />
                              )}

                              {section.id === 'background' && (
                                <BackgroundTab
                                  caseData={currentCase}
                                  liveVitals={liveVitalSigns}
                                  statInterventions={statInterventions}
                                  evolutionState={evolutionState}
                                  isDeceased={isPatientDeceased}
                                  disclosed={disclosedBg}
                                  onGoToAnamnesis={() => focusSection('anamnesis')}
                                  onUnlockEmergencyChart={() => setEmergencyChartUnlocked(true)}
                                  emergencyChartUnlocked={emergencyChartUnlocked}
                                />
                              )}

                              {section.id === 'physical_exam' && (
                                <PhysicalExamTab
                                  key={currentCase.id}
                                  caseData={currentCase}
                                  unlockedExamIds={unlockedExamIds}
                                  onUnlockExam={handleUnlockExam}
                                  onUnlockAllExams={handleUnlockAllExams}
                                  liveExams={livePhysicalExams}
                                  liveVitals={liveVitalSigns}
                                  isDeceased={isPatientDeceased}
                                />
                              )}

                              {section.id === 'studies' && (
                                <DiagnosticStudiesTab
                                  key={currentCase.id}
                                  caseData={currentCase}
                                  unlockedStudyIds={unlockedStudyIds}
                                  onUnlockStudy={handleUnlockStudy}
                                  onUnlockAllStudies={handleUnlockAllStudies}
                                  liveStudies={liveStudies}
                                  liveVitals={liveVitalSigns}
                                  isDeceased={isPatientDeceased}
                                />
                              )}

                              {section.id === 'diagnosis' && (
                                <DiagnosticTab
                                  primaryDiagnosis={primaryDiagnosis}
                                  setPrimaryDiagnosis={setPrimaryDiagnosis}
                                  differentialDiagnoses={differentialDiagnoses}
                                  setDifferentialDiagnoses={setDifferentialDiagnoses}
                                  clinicalJustification={clinicalJustification}
                                  setClinicalJustification={setClinicalJustification}
                                  isEcoeMode={isExamenMode}
                                />
                              )}

                              {section.id === 'treatment' && (
                                <TreatmentTab
                                  key={currentCase.id}
                                  medications={medications}
                                  setMedications={setMedications}
                                  generalMeasures={generalMeasures}
                                  setGeneralMeasures={setGeneralMeasures}
                                  hospitalizationDecision={hospitalizationDecision}
                                  setHospitalizationDecision={setHospitalizationDecision}
                                  referralCriteria={referralCriteria}
                                  setReferralCriteria={setReferralCriteria}
                                  followUpPlan={followUpPlan}
                                  setFollowUpPlan={setFollowUpPlan}
                                  onPendingDraftChange={setPendingMedDraft}
                                  isEcoeMode={isExamenMode}
                                  gameMode={currentCase.mode}
                                  patientAge={currentCase.patientInfo.age}
                                  patientWeightKg={currentCase.vitalSigns.weightKg}
                                />
                              )}

                              {section.id === 'audit' && evaluationResult && (
                                <ClinicalAuditTab
                                  caseData={currentCase}
                                  evaluation={evaluationResult}
                                  onNextCase={() => setNewCaseModalOpen(true)}
                                />
                              )}
                            </div>

                            {/* Dedicated Bottom Fold / Save Tab inside every expanded collapsible panel */}
                            <div className="border-t border-[#E2EAE4] bg-[#EFF6F1] px-3.5 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => closeSectionAndKeepPlace(section.id)}
                                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#E4F1E8] border border-[#72A98A]/65 text-xs font-bold text-[#1F4B3A] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                              >
                                <ChevronUp className="w-4 h-4 shrink-0" />
                                <span>Guardar y cerrar</span>
                              </button>

                              {nextSection && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedSections((prev) => [
                                      ...prev.filter((id) => id !== section.id),
                                      ...(prev.includes(nextSection.id)
                                        ? []
                                        : [nextSection.id]),
                                    ]);
                                    setActiveTab(nextSection.id);
                                    window.setTimeout(() => {
                                      document
                                        .getElementById(`expediente-${nextSection.id}`)
                                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }, 50);
                                  }}
                                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#2F7A63] hover:bg-[#1F5E4B] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                                >
                                  <span>Siguiente: {nextSection.title}</span>
                                  <ChevronDown className="w-4 h-4 shrink-0" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Prominent "Tu Decisión" Quick Action Card matching mockup */}
                {!evaluationResult && (
                  <section
                    aria-label="Tu Decisión Clínica"
                    className="rounded-2xl border border-[#CFE4D6] bg-white shadow-[0_4px_16px_rgba(31,94,75,0.08)] overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-[#174E3E] via-[#266E58] to-[#3A846B] text-white px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Target className="w-5 h-5 text-white shrink-0" />
                        <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                          Tu Decisión
                        </h2>
                      </div>
                      <svg
                        aria-hidden="true"
                        width="86"
                        height="22"
                        viewBox="0 0 86 22"
                        fill="none"
                        className="opacity-70 hidden sm:block"
                      >
                        <path
                          d="M2 12H24L29 12L33 5L37 18L42 2L47 16L51 12H84"
                          stroke="#D2EDE1"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3.5">
                      <label
                        htmlFor="quick-decision-diagnosis"
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#263A32]"
                      >
                        <PenLine className="w-4 h-4 text-[#2F7A63] shrink-0" />
                        <span>
                          Escribe tu diagnóstico principal y verifica tu tratamiento antes de enviar...
                        </span>
                      </label>

                      <input
                        id="quick-decision-diagnosis"
                        type="text"
                        value={primaryDiagnosis}
                        onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                        placeholder="Ingresa tu diagnóstico principal aquí..."
                        className="w-full min-h-[44px] bg-[#F8FBF9] border border-[#E2EAE4] focus:border-[#43866B] focus:bg-white rounded-xl px-4 py-2.5 text-sm text-[#263A32] placeholder-[#718078] focus:outline-none transition-colors"
                      />

                      {/* Checklist de Completitud del Expediente */}
                      <div className="rounded-xl border border-[#E2EAE4] bg-[#F8FBF9] p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-[#43866B] uppercase tracking-wider">
                          <span>Completitud del Expediente</span>
                          <span className="text-[#55685F] font-normal normal-case">
                            Pulsa cualquier rubro para ir directo
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                          {[
                            {
                              id: 'anamnesis' as const,
                              label: 'Anamnesis',
                              done: messages.filter((m) => m.sender === 'doctor').length > 0,
                              detail: `${messages.filter((m) => m.sender === 'doctor').length} preg.`,
                            },
                            {
                              id: 'physical_exam' as const,
                              label: 'Exploración',
                              done: unlockedExamIds.length > 0,
                              detail: `${unlockedExamIds.length}/${livePhysicalExams.length}`,
                            },
                            {
                              id: 'studies' as const,
                              label: 'Estudios',
                              done: unlockedStudyIds.length > 0,
                              detail: `${unlockedStudyIds.length}/${liveStudies.length}`,
                            },
                            {
                              id: 'diagnosis' as const,
                              label: 'Diagnóstico',
                              done: Boolean(primaryDiagnosis.trim()),
                              detail: primaryDiagnosis.trim() ? 'Listo' : 'Pendiente',
                            },
                            {
                              id: 'treatment' as const,
                              label: 'Tratamiento',
                              done: medications.length > 0 || Boolean(generalMeasures.trim()),
                              detail:
                                medications.length > 0
                                  ? `${medications.length} fárm.`
                                  : generalMeasures.trim()
                                    ? 'Medidas'
                                    : 'Pendiente',
                            },
                            {
                              id: 'treatment' as const,
                              label: 'Destino',
                              done: Boolean(hospitalizationDecision.trim()),
                              detail: hospitalizationDecision || 'Por definir',
                            },
                          ].map((item, idx) => (
                            <button
                              key={`${item.id}-${idx}`}
                              type="button"
                              onClick={() => focusSection(item.id)}
                              className={`min-h-[40px] px-2.5 py-1.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                                item.done
                                  ? 'bg-white border-[#CFE4D6] hover:border-[#43866B] text-[#1F4B3A]'
                                  : 'bg-[#F3F7F4] border-[#E2EAE4] hover:border-[#72A98A] text-[#55685F]'
                              }`}
                            >
                              {item.done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7A63] shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-[#718078] shrink-0" />
                              )}
                              <div className="min-w-0 leading-tight">
                                <div className="text-[11px] font-bold truncate">{item.label}</div>
                                <div className="text-[10px] opacity-80 truncate tabular-nums">
                                  {item.detail}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleClearDecisionDraft}
                          disabled={isEvaluating}
                          className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#43866B] bg-white hover:bg-[#E4F1E8]/60 text-[#1F4B3A] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4 shrink-0" />
                          <span>Limpiar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleFinishCase()}
                          disabled={isEvaluating}
                          className="sm:col-span-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#174E3E] to-[#3A846B] hover:from-[#123D31] hover:to-[#2F7A63] disabled:opacity-55 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4 shrink-0" />
                          <span>
                            {isEvaluating ? 'Evaluando Respuesta...' : 'Enviar Respuesta'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      )}

      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Modals */}
      <StatStabilizationDrawer
        isOpen={statDrawerOpen}
        onClose={() => setStatDrawerOpen(false)}
        caseData={currentCase}
        baselineVitals={currentCase.vitalSigns}
        liveVitals={liveVitalSigns}
        statInterventions={statInterventions}
        messages={messages}
        onApplyStat={handleApplyStatIntervention}
        onSendMessage={handleSendMessage}
        isChatLoading={isChatLoading}
        isDeceased={isPatientDeceased}
        initialTtsEnabled={userPreferences.ttsEnabled}
        onToggleTts={(enabled) => handleUpdatePreferences({ ttsEnabled: enabled })}
      />

      <NewCaseModal
        isOpen={newCaseModalOpen}
        onClose={() => setNewCaseModalOpen(false)}
        onSelectCase={handleSelectCase}
        isLoading={isGeneratingCase}
        customCases={customCases}
        onSaveCustomCase={handleSaveCustomCase}
        onDeleteCustomCase={handleDeleteCustomCase}
        initialTab={newCaseModalTab}
        completedCaseIds={completedCaseIds}
        history={history}
      />

      <CaseHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        history={history}
        onClearHistory={() => {
          setHistory([]);
          void clearAllHistoryRecords();
        }}
        onReviewCase={handleReviewPastCase}
        onRetryCase={(rec) => {
          void handleSelectCase(rec.mode, rec.specialty, rec.caseId);
        }}
        customCases={customCases}
      />

      <ClinicalGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      <CalculatorsModal
        isOpen={calculatorsModalOpen}
        onClose={() => setCalculatorsModalOpen(false)}
      />

      <ImmediateDeathModal
        alert={immediateDeathAlert}
        patientName={currentCase.patientInfo.name}
        onGoToAudit={() => void handleGoToAuditAfterImmediateDeath()}
        onInspectRecord={() => setImmediateDeathAlert(null)}
      />

      <ClinicalOutcomeModal
        outcome={pendingOutcome}
        patientName={currentCase.patientInfo.name}
        onContinueToAudit={() => {
          setPendingOutcome(null);
          focusSection('audit');
        }}
      />

      <ExitSimulationModal
        isOpen={Boolean(pendingExitRequest)}
        info={pendingExitRequest?.info || null}
        onStay={() => setPendingExitRequest(null)}
        onConfirmLeave={() => {
          const confirmFn = pendingExitRequest?.onConfirm;
          setPendingExitRequest(null);
          confirmFn?.();
        }}
      />
    </div>
  );
}
