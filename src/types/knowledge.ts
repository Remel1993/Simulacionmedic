export type EvidenceCertaintyTier =
  | 'evidencia_establecida'
  | 'guia_clinica'
  | 'evidencia_emergente'
  | 'opinion_experta'
  | 'incertidumbre_cientifica';

export type KnowledgeValidityStatus =
  | 'vigente'
  | 'en_revision'
  | 'con_discrepancia'
  | 'obsoleta';

export type KnowledgeContentKind =
  | 'guia_clinica'
  | 'protocolo_terapeutico'
  | 'estudio_relevante'
  | 'alerta_farmacologica'
  | 'recomendacion_obsoleta';

export type KnowledgeCategory =
  | 'urgencias'
  | 'cardio_neumo'
  | 'infecto_nefro'
  | 'cirugia_pediatria'
  | 'endocrino_tox_rangos';

export type KnowledgeSourceInstitution =
  | 'OMS'
  | 'OPS'
  | 'MINSA_NICARAGUA'
  | 'CDC'
  | 'NICE'
  | 'NIH'
  | 'AHA_ACC'
  | 'ESC'
  | 'IDSA'
  | 'ADA'
  | 'KDIGO'
  | 'GINA'
  | 'GOLD'
  | 'ACG'
  | 'AAP'
  | 'ACOG'
  | 'FDA_EMA'
  | 'LITERATURA_PEER_REVIEWED';

export interface KnowledgeVersionEntry {
  version: string;
  publishedAt: string;
  verifiedAt: string;
  summaryOfChanges: string;
  supersededRecommendation?: string;
}

export interface GuidelineDiscrepancy {
  topic: string;
  guidelineA: {
    source: string;
    version: string;
    position: string;
  };
  guidelineB: {
    source: string;
    version: string;
    position: string;
  };
  clinicalExplanation: string;
  localAdaptationNote?: string;
}

export interface DrugSafetyUpdate {
  genericName: string;
  changeType: 'nueva_molecula' | 'ajuste_dosis' | 'alerta_seguridad' | 'contraindicacion';
  regulatorySource: string;
  clinicalImpact: string;
  doseVerificationNote: string;
}

export interface ObsoletePracticeAlert {
  outdatedPractice: string;
  whyObsolete: string;
  currentStandard: string;
  replacedSince: string;
}

export interface KnowledgeSection {
  subtitle: string;
  items: string[];
  certaintyTier?: EvidenceCertaintyTier;
  sourceNote?: string;
}

export interface KnowledgeRecord {
  id: string;
  kind: KnowledgeContentKind;
  category: KnowledgeCategory;
  title: string;
  source: string;
  institution: KnowledgeSourceInstitution;
  publishedDate: string;
  lastVerifiedDate: string;
  guideVersion: string;
  regionOrCountry: string;
  validityStatus: KnowledgeValidityStatus;
  certaintyTier: EvidenceCertaintyTier;
  evidenceLevel?: string;
  bibliographicReference: string;
  verificationDisclaimer?: string;
  keywords?: string[];
  summary: string;
  sections: KnowledgeSection[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  safetyRule?: string;
  examPearl?: string;
  drugSafetyUpdate?: DrugSafetyUpdate;
  obsoletePracticeAlert?: ObsoletePracticeAlert;
  discrepancies?: GuidelineDiscrepancy[];
  versionHistory: KnowledgeVersionEntry[];
  isLocalValidated: boolean;
  origin: 'curated_base' | 'synced_pending_review' | 'user_approved_update';
}

export interface PendingKnowledgeUpdate {
  id: string;
  targetRecordId: string;
  proposedRecord: KnowledgeRecord;
  remoteManifestVersion: string;
  detectedAt: string;
  changeSummary: string;
  replacesValidatedRecord: boolean;
}

export type KnowledgeCheckStatus =
  | 'never_checked'
  | 'offline_unverified'
  | 'up_to_date_verified'
  | 'updates_pending_review'
  | 'no_remote_feed'
  | 'sync_error';

export interface KnowledgeSyncState {
  id: 'default';
  baseVersion: string;
  lastLocalBaseDate: string;
  lastOnlineCheckAt: string | null;
  lastOnlineCheckStatus: KnowledgeCheckStatus;
  syncMessage: string;
  pendingUpdatesCount: number;
}

export interface CaseKnowledgeAudit {
  matchedRecords: KnowledgeRecord[];
  activeDiscrepancies: Array<{ recordTitle: string; discrepancy: GuidelineDiscrepancy }>;
  obsoleteAlerts: Array<{ recordTitle: string; alert: ObsoletePracticeAlert }>;
  drugAlerts: Array<{ recordTitle: string; alert: DrugSafetyUpdate }>;
  verificationNotice: string;
  isVerifiedAgainstRemote: boolean;
}

export const CERTAINTY_TIER_META: Record<
  EvidenceCertaintyTier,
  { label: string; shortLabel: string; description: string }
> = {
  evidencia_establecida: {
    label: 'Evidencia científica establecida',
    shortLabel: 'Evidencia establecida',
    description: 'Respaldada por ensayos clínicos controlados consistentes, metaanálisis o fisiopatología demostrada.',
  },
  guia_clinica: {
    label: 'Recomendación de guía clínica',
    shortLabel: 'Guía clínica',
    description: 'Consenso formal de sociedad científica u organismo sanitario con gradación de evidencia.',
  },
  evidencia_emergente: {
    label: 'Evidencia emergente',
    shortLabel: 'Evidencia emergente',
    description: 'Estudios recientes prometedores que aún requieren validación amplia o adopción uniforme en guías.',
  },
  opinion_experta: {
    label: 'Opinión experta',
    shortLabel: 'Opinión experta',
    description: 'Criterio de consenso clínico donde faltan ensayos comparativos definitivos.',
  },
  incertidumbre_cientifica: {
    label: 'Incertidumbre científica',
    shortLabel: 'Incertidumbre',
    description: 'Área con datos insuficientes o contradictorios; requiere individualización y vigilancia.',
  },
};

export const VALIDITY_STATUS_META: Record<
  KnowledgeValidityStatus,
  { label: string; description: string }
> = {
  vigente: {
    label: 'Vigente',
    description: 'Recomendación activa en la última verificación local registrada.',
  },
  en_revision: {
    label: 'En revisión',
    description: 'Sujeta a vigilancia por posible actualización próxima de guías o fichas técnicas.',
  },
  con_discrepancia: {
    label: 'Con discrepancia entre guías',
    description: 'Existen diferencias documentadas entre organismos internacionales o nacionales.',
  },
  obsoleta: {
    label: 'Obsoleta / Reemplazada',
    description: 'Práctica superada por nueva evidencia; no debe emplearse como estándar actual.',
  },
};

export const KNOWLEDGE_KIND_META: Record<
  KnowledgeContentKind,
  { label: string }
> = {
  guia_clinica: { label: 'Guía Clínica' },
  protocolo_terapeutico: { label: 'Protocolo Terapéutico' },
  estudio_relevante: { label: 'Estudio / Metaanálisis' },
  alerta_farmacologica: { label: 'Seguridad Farmacológica' },
  recomendacion_obsoleta: { label: 'Práctica Obsoleta' },
};
