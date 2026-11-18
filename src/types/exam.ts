import {
  ClinicalCase,
  DifferentialReasoningMatrixItem,
  PathophysiologyMatrix,
  Specialty,
  ValidatedClinicalScaleItem,
  VitalSigns,
} from './clinical';
import { EvidenceCertaintyTier } from './knowledge';

export type ExamDifficultyTier = 'progresivo' | 'medico_general' | 'urgencias' | 'residente';

export type ExamQuestionCategory =
  | 'caso_progresivo'
  | 'laboratorios_estudios'
  | 'fisiopatologia'
  | 'farmacologia_terapeutica';

export interface ProgressiveExamConfig {
  difficulty: ExamDifficultyTier;
  specialty: Specialty;
  stationCount: 3 | 5;
}

export interface ExamOption {
  id: string;
  label: string;
  rationaleIfSelected: string;
  isSafetyError?: boolean;
  safetyRiskNote?: string;
}

export interface ProgressiveExamQuestion {
  id: string;
  stationIndex: number;
  stepNumber: 1 | 2 | 3 | 4;
  stepLabel: string;
  category: ExamQuestionCategory;
  difficultyTierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización';
  stageRevealNote?: string;
  vitalSnapshot?: VitalSigns;
  examFindingHighlight?: string;
  studySnippet?: {
    name: string;
    result: string;
    referenceRange?: string;
  };
  pharmacologyContextNote?: string;
  questionPrompt: string;
  options: ExamOption[];
  correctOptionId: string;
  teachingExplanation: string;
  expectedConduct: string;
  referenceSource: string;
  certaintyTier: EvidenceCertaintyTier;
}

export interface ProgressiveExamStation {
  stationIndex: number;
  difficultyTierLabel: 'Médico General' | 'Urgencias / Guardia' | 'Residencia / Especialización';
  caseData: ClinicalCase;
  baseVignette: string;
  questions: ProgressiveExamQuestion[];
}

export interface ExamQuestionUserAnswer {
  questionId: string;
  selectedOptionId: string;
  answeredAt: string;
}

export interface ExamStationQuestionReview {
  question: ProgressiveExamQuestion;
  selectedOptionId: string;
  selectedOptionLabel: string;
  correctOptionLabel: string;
  isCorrect: boolean;
  isSafetyError: boolean;
  selectedRationale: string;
  safetyRiskNote?: string;
}

export interface ProgressiveExamStationDebriefing {
  stationIndex: number;
  caseData: ClinicalCase;
  difficultyTierLabel: string;
  stationScore: number;
  questionReviews: ExamStationQuestionReview[];
  // 12 Puntos Estructurados de Debriefing Docente (Sección 9)
  definitiveDiagnosis: string;
  clinicalReasoning: string;
  pathophysiologySummary: string;
  pathophysiologyMatrix: PathophysiologyMatrix;
  differentialDiagnoses: string[];
  differentialMatrix: DifferentialReasoningMatrixItem[];
  validatedScales: ValidatedClinicalScaleItem[];
  studiesInterpretation: Array<{
    name: string;
    result: string;
    interpretation: string;
    isAbnormal: boolean;
  }>;
  recommendedTreatment: Array<{
    drug: string;
    dose: string;
    route: string;
    frequency: string;
    duration: string;
    rationale: string;
  }>;
  generalMeasures: string[];
  hospitalizationDecision: string;
  pharmacologicalJustification: string[];
  userErrors: string[];
  errorRisksAndConsequences: string[];
  expectedConduct: string;
  clinicalPearls: string[];
  bibliographicReferences: string[];
  certaintyClassification: {
    tier: EvidenceCertaintyTier;
    label: string;
    explanation: string;
    offlineVerificationNotice: string;
  };
}

export interface ExamDomainPerformance {
  category: ExamQuestionCategory;
  label: string;
  correct: number;
  total: number;
  scorePct: number;
}

export interface ExamSafetyErrorItem {
  stationIndex: number;
  patientName: string;
  questionStep: string;
  chosenOption: string;
  riskNote: string;
}

export interface ProgressiveExamEvaluation {
  totalScore: number;
  rawUncappedScore: number;
  correctCount: number;
  totalQuestions: number;
  classification:
    | 'Excelente razonamiento clínico'
    | 'Muy buen desempeño'
    | 'Buen desempeño'
    | 'Necesita reforzar conocimientos'
    | 'Necesita mejorar su abordaje clínico';
  safetyNonCompensation?: {
    applied: boolean;
    cappedMaxScore: number;
    reason: string;
  };
  domainBreakdown: ExamDomainPerformance[];
  safetyErrorsDetected: ExamSafetyErrorItem[];
  stationDebriefings: ProgressiveExamStationDebriefing[];
  evaluatedAt: string;
}
