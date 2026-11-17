import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Navbar,
  MobileBottomNav,
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

import { applyStatIntervention, StatApplyInput } from './utils/statStabilization';
import { generateContextualPatientReply, PatientChatPayload } from './engine/patientEngine';
import { getLocalCaseLibrary, selectLocalClinicalCase, selectTurnoMedicoCases } from './engine/caseGenerator';
import { evaluateClinicalEvolutionStep } from './engine/clinicalEvolution';
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
  ChevronsUpDown,
} from 'lucide-react';

const URGENCIAS_WINDOW_SECONDS = 8 * 60;
const EXAMEN_WINDOW_SECONDS = 12 * 60;

export default function App() {
  // General Interface vs Active Clinical Simulation vs Turno Médico Express
  const [activeView, setActiveView] = useState<'lobby' | 'simulation' | 'turno_medico'>('lobby');
  const [turnoConfig, setTurnoConfig] = useState<TurnoMedicoConfig>({
    patientCount: 5,
    profile: 'mixto',
    timerMode: 'untimed',
    specialty: 'aleatorio',
  });
  const [turnoCases, setTurnoCases] = useState<ClinicalCase[]>([]);
  const [turnoSessionKey, setTurnoSessionKey] = useState<number>(1);

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
  const [additionalStudiesNeeded, setAdditionalStudiesNeeded] = useState('');

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

  const livePhysicalExams = useMemo(
    () => buildLivePhysicalExams(currentCase, liveVitalSigns, statInterventions, evolutionState),
    [currentCase, liveVitalSigns, statInterventions, evolutionState]
  );

  const liveStudies = useMemo(
    () => buildLiveStudies(currentCase, liveVitalSigns, statInterventions, evolutionState),
    [currentCase, liveVitalSigns, statInterventions, evolutionState]
  );

  // Consultation Timer & Mode Mechanics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const examAutoSubmittedRef = useRef(false);
  const latestFinishRef = useRef<() => void>(() => {});
  const activeChatCaseIdRef = useRef<string>(ALL_CURATED_CASES[0].id);
  const lastEvolutionCheckRef = useRef<number>(0);

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
          setLiveVitalSigns(activeSession.liveVitalSigns || restoredCase.vitalSigns);
          setStatInterventions(activeSession.statInterventions || []);
          setMessages(activeSession.messages || []);
          setUnlockedExamIds(activeSession.unlockedExamIds || []);
          setUnlockedStudyIds(activeSession.unlockedStudyIds || []);
          setEmergencyChartUnlocked(false);
          setPrimaryDiagnosis(activeSession.primaryDiagnosis || '');
          setDifferentialDiagnoses(activeSession.differentialDiagnoses || []);
          setClinicalJustification(activeSession.clinicalJustification || '');
          setAdditionalStudiesNeeded(activeSession.additionalStudiesNeeded || '');
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

  // Timer Tick (only runs while attending an active unresolved case and patient is alive)
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult || isPatientDeceased) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeView, evaluationResult, isPatientDeceased]);

  // Continuous Deterministic Clinical Evolution (every 45s or upon STAT interventions)
  useEffect(() => {
    if (activeView !== 'simulation' || evaluationResult) return;

    const shouldEvaluateNow =
      elapsedSeconds === 0 ||
      elapsedSeconds - lastEvolutionCheckRef.current >= 45;

    if (!shouldEvaluateNow && evolutionState) return;

    const step = evaluateClinicalEvolutionStep({
      caseData: currentCase,
      baselineVitals: currentCase.vitalSigns,
      currentVitals: liveVitalSigns,
      elapsedSeconds,
      statInterventions,
      unlockedExamCount: unlockedExamIds.length,
      unlockedStudyCount: unlockedStudyIds.length,
      lastEvaluatedSecond: lastEvolutionCheckRef.current,
    });

    lastEvolutionCheckRef.current = step.evolutionState.lastEvaluatedSecond;
    setEvolutionState(step.evolutionState);
    if (step.changed) {
      setLiveVitalSigns(step.updatedVitals);
    }
  }, [
    elapsedSeconds,
    activeView,
    evaluationResult,
    currentCase,
    statInterventions,
    unlockedExamIds.length,
    unlockedStudyIds.length,
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
        additionalStudiesNeeded,
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
    additionalStudiesNeeded,
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
    setLiveVitalSigns(enriched.vitalSigns);
    setStatInterventions([]);
    setStatDrawerOpen(false);
    setUnlockedExamIds([]);
    setUnlockedStudyIds([]);
    setEmergencyChartUnlocked(false);
    setPrimaryDiagnosis('');
    setDifferentialDiagnoses([]);
    setClinicalJustification('');
    setAdditionalStudiesNeeded('');
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
      liveVitalSigns,
      currentCase.vitalSigns,
      currentCase,
      input,
      statInterventions,
      elapsedSeconds
    );

    const nextStatList = [...statInterventions, outcome.record];
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
      const alreadyExists = prev.some(
        (m) => `${m.drug.toLowerCase()}::${m.dose.toLowerCase()}::${m.route.toLowerCase()}` === normalizedNew
      );
      return alreadyExists ? prev : [...prev, outcome.medicationItem];
    });

    const deltasText =
      outcome.record.deltas.length > 0
        ? ` · Cambios: ${outcome.record.deltas.map((d) => `${d.metric} ${d.before} → ${d.after}`).join(', ')}`
        : ' · Signos vitales sin cambios inmediatos';

    const nowTs = outcome.record.appliedAt;
    const baseTime = Date.now();
    const sysMsg: ChatMessage = {
      id: `msg-stat-sys-${baseTime}`,
      sender: 'system',
      text: `${outcome.record.drug} (${outcome.record.dose}, ${outcome.record.route})${deltasText}.`,
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

  const handleRefreshVitals = () => {
    if (isPatientDeceased || evaluationResult) return;
    const step = evaluateClinicalEvolutionStep({
      caseData: currentCase,
      baselineVitals: currentCase.vitalSigns,
      currentVitals: liveVitalSigns,
      elapsedSeconds,
      statInterventions,
      unlockedExamCount: unlockedExamIds.length,
      unlockedStudyCount: unlockedStudyIds.length,
      lastEvaluatedSecond: lastEvolutionCheckRef.current,
      forceRefresh: true,
    });
    lastEvolutionCheckRef.current = step.evolutionState.lastEvaluatedSecond;
    setEvolutionState(step.evolutionState);
    if (step.changed) {
      setLiveVitalSigns(step.updatedVitals);
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
        clinicalJustification,
        additionalStudiesNeeded,
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

  const handleClearDecisionDraft = () => {
    setPrimaryDiagnosis('');
    setDifferentialDiagnoses([]);
    setClinicalJustification('');
    setAdditionalStudiesNeeded('');
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

  // Keep latest finish handler for timed Exam auto-submit
  latestFinishRef.current = () => {
    void handleFinishCase();
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
    setCurrentCase(enrichedFound);
    setLiveVitalSigns(enrichedFound.vitalSigns);
    setStatInterventions([]);
    setStatDrawerOpen(false);
    setEvolutionState(undefined);
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

  const handleHeaderModeChange = (mode: GameMode) => {
    handleUpdatePreferences({ preferredMode: mode });
    if (activeView === 'simulation' && mode !== currentCase.mode) {
      void handleSelectCase(mode, userPreferences.preferredSpecialty);
    }
  };

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
      title: 'Diagnóstico Diferencial',
      subtitle: 'Impresión clínica y razonamiento',
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

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#F3F7F4] text-[#263A32] flex flex-col font-sans selection:bg-[#43866B] selection:text-white">
      {/* Top Hospital Emerald Header + Unified Horizontal Main Nav */}
      <Navbar
        activeView={activeView}
        activeSection={activeNavSection}
        onGoHome={() => setActiveView('lobby')}
        onOpenCasesLibrary={handleOpenCasesLibrary}
        onOpenHistoryModal={() => setHistoryModalOpen(true)}
        onOpenGuideModal={() => setGuideModalOpen(true)}
        onOpenCalculatorsModal={() => setCalculatorsModalOpen(true)}
        onRestartCase={() => setupCase(currentCase)}
        onSelectMode={handleHeaderModeChange}
        currentMode={activeView === 'simulation' ? currentCase.mode : userPreferences.preferredMode}
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
      ) : (
        <div className="flex-1 max-w-5xl w-full min-w-0 mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-24 md:pb-10">
          <main className="w-full min-w-0 space-y-4">
            {activeView === 'lobby' ? (
              <HomeDashboard
                onStartSimulation={handleSelectCase}
                onStartTurnoMedico={handleStartTurnoMedico}
                isLoading={isGeneratingCase}
                totalCasesCount={totalLibraryCount}
                initialMode={userPreferences.preferredMode}
                initialSpecialty={userPreferences.preferredSpecialty}
                onPreferencesChange={(mode, specialty) =>
                  handleUpdatePreferences({ preferredMode: mode, preferredSpecialty: specialty })
                }
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

                {/* Vital Signs Card */}
                <VitalSignsMonitor
                  vitals={liveVitalSigns}
                  baselineVitals={currentCase.vitalSigns}
                  statCount={statInterventions.length}
                  triageLevel={currentCase.patientInfo.triageLevel}
                  onOpenStat={() => setStatDrawerOpen(true)}
                  onRefreshVitals={!evaluationResult ? handleRefreshVitals : undefined}
                  showStatButton={!evaluationResult}
                  evolutionState={evolutionState}
                  isDeceased={isPatientDeceased}
                />

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
                {!evaluationResult && isUrgenciasMode && urgenciasRemaining === 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs text-rose-900 flex items-center gap-2.5 shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Ventana de oro (8 min) superada: defina inmediatamente su diagnóstico y conducta terapéutica antes de enviar su respuesta.
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
                <div className="space-y-3">
                  {expedienteSections.map((section, idx) => {
                    const Icon = section.icon;
                    const isOpen = expandedSections.includes(section.id);
                    const nextSection =
                      idx < expedienteSections.length - 1 ? expedienteSections[idx + 1] : null;

                    return (
                      <div
                        key={section.id}
                        id={`expediente-${section.id}`}
                        className="rounded-2xl border border-[#E2EAE4] bg-white shadow-[0_2px_8px_rgba(38,58,50,0.04)] overflow-hidden scroll-mt-24"
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
                                  additionalStudiesNeeded={additionalStudiesNeeded}
                                  setAdditionalStudiesNeeded={setAdditionalStudiesNeeded}
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
                                onClick={() => {
                                  setExpandedSections((prev) =>
                                    prev.filter((id) => id !== section.id)
                                  );
                                }}
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

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#55685F] bg-[#F3F7F4] border border-[#E2EAE4] rounded-xl px-3.5 py-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>
                            Fármacos prescritos:{' '}
                            <strong className="text-[#263A32] tabular-nums">
                              {medications.length}
                            </strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Destino:{' '}
                            <strong className="text-[#263A32]">
                              {hospitalizationDecision || 'Por definir'}
                            </strong>
                          </span>
                        </div>
                        {!expandedSections.includes('treatment') && (
                          <button
                            type="button"
                            onClick={() => focusSection('treatment')}
                            className="text-xs font-bold text-[#2F7A63] hover:text-[#174E3E] underline-offset-2 hover:underline cursor-pointer"
                          >
                            Completar en Tratamiento
                          </button>
                        )}
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

      {/* Mobile Fixed Bottom Navigation Bar */}
      {activeView !== 'turno_medico' && (
        <MobileBottomNav
          activeSection={activeNavSection}
          historyCount={history.length}
          onGoHome={() => setActiveView('lobby')}
          onOpenCases={handleOpenCasesLibrary}
          onOpenHistory={() => setHistoryModalOpen(true)}
          onOpenGuides={() => setGuideModalOpen(true)}
          onOpenCalculators={() => setCalculatorsModalOpen(true)}
        />
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
    </div>
  );
}
