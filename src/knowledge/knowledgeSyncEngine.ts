import { ClinicalCase } from '../types/clinical';
import {
  CaseKnowledgeAudit,
  EvidenceCertaintyTier,
  KnowledgeCategory,
  KnowledgeContentKind,
  KnowledgeRecord,
  KnowledgeSourceInstitution,
  KnowledgeSyncState,
  KnowledgeValidityStatus,
  PendingKnowledgeUpdate,
} from '../types/knowledge';
import {
  CURATED_KNOWLEDGE_RECORDS,
  KNOWLEDGE_BASE_DATE,
  KNOWLEDGE_BASE_VERSION,
} from './clinicalKnowledgeBase';
import {
  deletePendingKnowledgeUpdate,
  getKnowledgeSyncState,
  getPendingKnowledgeUpdates,
  getStoredKnowledgeRecords,
  saveKnowledgeSyncState,
  savePendingKnowledgeUpdate,
  saveStoredKnowledgeRecord,
} from '../storage/indexedDb';

export interface KnowledgeSnapshot {
  records: KnowledgeRecord[];
  pendingUpdates: PendingKnowledgeUpdate[];
  syncState: KnowledgeSyncState;
}

export interface RegisterKnowledgeInput {
  id?: string;
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
  summary: string;
  items: string[];
  safetyRule?: string;
  examPearl?: string;
  changeSummary: string;
  supersededRecommendation?: string;
  obsoletePractice?: {
    outdatedPractice: string;
    whyObsolete: string;
    currentStandard: string;
    replacedSince: string;
  };
  drugSafetyUpdate?: {
    genericName: string;
    changeType: 'nueva_molecula' | 'ajuste_dosis' | 'alerta_seguridad' | 'contraindicacion';
    regulatorySource: string;
    clinicalImpact: string;
    doseVerificationNote: string;
  };
}

interface RemoteManifestPayload {
  manifestVersion: string;
  publishedAt: string;
  records: KnowledgeRecord[];
}

export function buildDefaultSyncState(isOnline: boolean, pendingCount = 0): KnowledgeSyncState {
  return {
    id: 'default',
    baseVersion: KNOWLEDGE_BASE_VERSION,
    lastLocalBaseDate: KNOWLEDGE_BASE_DATE,
    lastOnlineCheckAt: null,
    lastOnlineCheckStatus: isOnline ? 'never_checked' : 'offline_unverified',
    syncMessage: isOnline
      ? `Operando con la base clínica local verificada (v${KNOWLEDGE_BASE_VERSION}, revisada ${KNOWLEDGE_BASE_DATE}). No se asume actualización automática en tiempo real.`
      : `Sin conexión a Internet: operando con la última base clínica local verificada (v${KNOWLEDGE_BASE_VERSION}). No se ha comprobado su actualización en línea.`,
    pendingUpdatesCount: pendingCount,
  };
}

function mergeKnowledgeRecords(
  baseRecords: KnowledgeRecord[],
  storedApproved: KnowledgeRecord[]
): KnowledgeRecord[] {
  const map = new Map<string, KnowledgeRecord>();
  for (const rec of baseRecords) {
    map.set(rec.id, rec);
  }
  for (const custom of storedApproved) {
    if (!custom?.id) continue;
    const prev = map.get(custom.id);
    if (prev) {
      // Preserve merged immutable version history without losing curated history
      const seenVersions = new Set(prev.versionHistory.map((v) => `${v.version}::${v.verifiedAt}`));
      const mergedHistory = [
        ...prev.versionHistory,
        ...custom.versionHistory.filter((v) => !seenVersions.has(`${v.version}::${v.verifiedAt}`)),
      ];
      map.set(custom.id, {
        ...custom,
        versionHistory: mergedHistory,
      });
    } else {
      map.set(custom.id, custom);
    }
  }
  return Array.from(map.values());
}

export async function getKnowledgeSnapshot(isOnline = true): Promise<KnowledgeSnapshot> {
  const [storedApproved, pendingUpdates, storedSyncState] = await Promise.all([
    getStoredKnowledgeRecords(),
    getPendingKnowledgeUpdates(),
    getKnowledgeSyncState(),
  ]);

  const records = mergeKnowledgeRecords(CURATED_KNOWLEDGE_RECORDS, storedApproved);

  let syncState = storedSyncState || buildDefaultSyncState(isOnline, pendingUpdates.length);
  if (!isOnline && syncState.lastOnlineCheckStatus !== 'offline_unverified') {
    syncState = {
      ...syncState,
      lastOnlineCheckStatus: 'offline_unverified',
      syncMessage: `Sin conexión a Internet: usando la última base local verificada (v${KNOWLEDGE_BASE_VERSION}). No se ha comprobado su actualización.`,
      pendingUpdatesCount: pendingUpdates.length,
    };
  } else {
    syncState = {
      ...syncState,
      pendingUpdatesCount: pendingUpdates.length,
    };
  }

  return { records, pendingUpdates, syncState };
}

function isValidRemoteRecord(raw: unknown): raw is KnowledgeRecord {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Partial<KnowledgeRecord>;
  return Boolean(
    typeof r.id === 'string' &&
      r.id.trim() &&
      typeof r.title === 'string' &&
      r.title.trim() &&
      typeof r.source === 'string' &&
      typeof r.publishedDate === 'string' &&
      typeof r.lastVerifiedDate === 'string' &&
      typeof r.guideVersion === 'string' &&
      typeof r.regionOrCountry === 'string' &&
      typeof r.bibliographicReference === 'string' &&
      Array.isArray(r.sections)
  );
}

/**
 * Consulta un manifiesto remoto verificado (/knowledge-manifest.json) solo si existe conectividad.
 * NUNCA sobrescribe automáticamente recomendaciones locales validadas: las encola en pendingUpdates.
 */
export async function checkRemoteManifestUpdates(isOnline: boolean): Promise<KnowledgeSnapshot> {
  const current = await getKnowledgeSnapshot(isOnline);

  if (!isOnline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    const offlineState: KnowledgeSyncState = {
      ...current.syncState,
      lastOnlineCheckStatus: 'offline_unverified',
      syncMessage: `Sin conexión a Internet: no fue posible comprobar actualizaciones remotas. Se mantiene la base local verificada (v${KNOWLEDGE_BASE_VERSION}).`,
      pendingUpdatesCount: current.pendingUpdates.length,
    };
    await saveKnowledgeSyncState(offlineState);
    return { ...current, syncState: offlineState };
  }

  try {
    const response = await fetch('/knowledge-manifest.json', {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      const noFeedState: KnowledgeSyncState = {
        ...current.syncState,
        lastOnlineCheckAt: new Date().toISOString(),
        lastOnlineCheckStatus: 'no_remote_feed',
        syncMessage: `Comprobación ejecutada (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}): no hay repositorio remoto conectado en este entorno. Operando con base local verificada (v${KNOWLEDGE_BASE_VERSION}).`,
        pendingUpdatesCount: current.pendingUpdates.length,
      };
      await saveKnowledgeSyncState(noFeedState);
      return { ...current, syncState: noFeedState };
    }

    const payload = (await response.json()) as Partial<RemoteManifestPayload>;
    if (!payload || typeof payload.manifestVersion !== 'string' || !Array.isArray(payload.records)) {
      const invalidState: KnowledgeSyncState = {
        ...current.syncState,
        lastOnlineCheckAt: new Date().toISOString(),
        lastOnlineCheckStatus: 'sync_error',
        syncMessage:
          'El manifiesto remoto recibido no cumple el esquema clínico validado. Se conserva intacta la base local.',
        pendingUpdatesCount: current.pendingUpdates.length,
      };
      await saveKnowledgeSyncState(invalidState);
      return { ...current, syncState: invalidState };
    }

    const existingMap = new Map(current.records.map((r) => [r.id, r]));
    const existingPendingIds = new Set(current.pendingUpdates.map((p) => `${p.targetRecordId}::${p.proposedRecord.guideVersion}`));
    let newStagedCount = 0;

    for (const candidate of payload.records) {
      if (!isValidRemoteRecord(candidate)) continue;
      const existing = existingMap.get(candidate.id);
      const isChanged =
        !existing ||
        existing.guideVersion !== candidate.guideVersion ||
        existing.lastVerifiedDate !== candidate.lastVerifiedDate ||
        existing.validityStatus !== candidate.validityStatus;

      if (!isChanged) continue;
      const dedupeKey = `${candidate.id}::${candidate.guideVersion}`;
      if (existingPendingIds.has(dedupeKey)) continue;

      const staged: PendingKnowledgeUpdate = {
        id: `upd-${candidate.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        targetRecordId: candidate.id,
        proposedRecord: {
          ...candidate,
          isLocalValidated: false,
          origin: 'synced_pending_review',
        },
        remoteManifestVersion: payload.manifestVersion,
        detectedAt: new Date().toISOString(),
        changeSummary: existing
          ? `Nueva versión propuesta (${existing.guideVersion} → ${candidate.guideVersion})`
          : `Nuevo contenido clínico propuesto (${candidate.guideVersion})`,
        replacesValidatedRecord: Boolean(existing?.isLocalValidated),
      };

      await savePendingKnowledgeUpdate(staged);
      newStagedCount += 1;
    }

    const refreshed = await getKnowledgeSnapshot(true);
    const hasPending = refreshed.pendingUpdates.length > 0;
    const verifiedState: KnowledgeSyncState = {
      id: 'default',
      baseVersion: KNOWLEDGE_BASE_VERSION,
      lastLocalBaseDate: KNOWLEDGE_BASE_DATE,
      lastOnlineCheckAt: new Date().toISOString(),
      lastOnlineCheckStatus: hasPending ? 'updates_pending_review' : 'up_to_date_verified',
      syncMessage: hasPending
        ? `Se detectaron ${refreshed.pendingUpdates.length} actualización(es) pendiente(s) de revisión clínica. No se sobrescribieron recomendaciones validadas automáticamente.`
        : `Repositorio remoto consultado (${payload.manifestVersion}): base local al día respecto al manifiesto disponible.${newStagedCount === 0 ? '' : ''}`,
      pendingUpdatesCount: refreshed.pendingUpdates.length,
    };
    await saveKnowledgeSyncState(verifiedState);
    return { ...refreshed, syncState: verifiedState };
  } catch {
    const errState: KnowledgeSyncState = {
      ...current.syncState,
      lastOnlineCheckAt: new Date().toISOString(),
      lastOnlineCheckStatus: 'sync_error',
      syncMessage:
        'No se pudo contactar el repositorio externo; operando con la base local verificada sin cambios automáticos.',
      pendingUpdatesCount: current.pendingUpdates.length,
    };
    await saveKnowledgeSyncState(errState);
    return { ...current, syncState: errState };
  }
}

/**
 * Aprueba manualmente una propuesta pendiente, conservando el historial de versiones previo.
 */
export async function approvePendingKnowledgeUpdate(
  pendingId: string,
  isOnline = true
): Promise<KnowledgeSnapshot> {
  const snapshot = await getKnowledgeSnapshot(isOnline);
  const pending = snapshot.pendingUpdates.find((u) => u.id === pendingId);
  if (!pending) return snapshot;

  const prev = snapshot.records.find((r) => r.id === pending.targetRecordId);
  const nextEntry = {
    version: pending.proposedRecord.guideVersion,
    publishedAt: pending.proposedRecord.publishedDate,
    verifiedAt: new Date().toISOString().slice(0, 10),
    summaryOfChanges: pending.changeSummary,
    supersededRecommendation: prev ? `${prev.guideVersion} (${prev.source})` : undefined,
  };

  const approvedRecord: KnowledgeRecord = {
    ...pending.proposedRecord,
    isLocalValidated: true,
    origin: 'user_approved_update',
    versionHistory: [...(prev?.versionHistory || []), nextEntry],
  };

  await saveStoredKnowledgeRecord(approvedRecord);
  await deletePendingKnowledgeUpdate(pendingId);

  const nextSnapshot = await getKnowledgeSnapshot(isOnline);
  const nextSyncState: KnowledgeSyncState = {
    ...nextSnapshot.syncState,
    lastOnlineCheckStatus:
      nextSnapshot.pendingUpdates.length > 0 ? 'updates_pending_review' : 'up_to_date_verified',
    syncMessage: `Actualización "${approvedRecord.title}" aprobada e incorporada con historial de versiones.`,
  };
  await saveKnowledgeSyncState(nextSyncState);
  return { ...nextSnapshot, syncState: nextSyncState };
}

export async function rejectPendingKnowledgeUpdate(
  pendingId: string,
  isOnline = true
): Promise<KnowledgeSnapshot> {
  await deletePendingKnowledgeUpdate(pendingId);
  const nextSnapshot = await getKnowledgeSnapshot(isOnline);
  const nextSyncState: KnowledgeSyncState = {
    ...nextSnapshot.syncState,
    syncMessage:
      'Propuesta externa descartada; se conservó intacta la recomendación local previamente validada.',
  };
  await saveKnowledgeSyncState(nextSyncState);
  return { ...nextSnapshot, syncState: nextSyncState };
}

/**
 * Registra localmente una nueva guía, protocolo, estudio, alerta farmacológica o aviso de obsolescencia.
 * Si se pasa un ID existente, agrega una nueva versión al historial sin borrar versiones previas.
 */
export async function registerLocalKnowledgeRecord(
  input: RegisterKnowledgeInput,
  isOnline = true
): Promise<KnowledgeSnapshot> {
  const snapshot = await getKnowledgeSnapshot(isOnline);
  const recordId =
    input.id?.trim() ||
    `local-${input.kind}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const existing = snapshot.records.find((r) => r.id === recordId);

  const newVersionEntry = {
    version: input.guideVersion.trim(),
    publishedAt: input.publishedDate.trim(),
    verifiedAt: input.lastVerifiedDate.trim(),
    summaryOfChanges: input.changeSummary.trim() || 'Registro/actualización local validada.',
    supersededRecommendation: input.supersededRecommendation?.trim() || undefined,
  };

  const cleanItems = input.items.map((i) => i.trim()).filter(Boolean);

  const newRecord: KnowledgeRecord = {
    id: recordId,
    kind: input.kind,
    category: input.category,
    title: input.title.trim(),
    source: input.source.trim(),
    institution: input.institution,
    publishedDate: input.publishedDate.trim(),
    lastVerifiedDate: input.lastVerifiedDate.trim(),
    guideVersion: input.guideVersion.trim(),
    regionOrCountry: input.regionOrCountry.trim(),
    validityStatus: input.validityStatus,
    certaintyTier: input.certaintyTier,
    evidenceLevel: input.evidenceLevel?.trim() || undefined,
    bibliographicReference: input.bibliographicReference.trim(),
    verificationDisclaimer: input.verificationDisclaimer?.trim() || undefined,
    keywords: input.title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 4),
    summary: input.summary.trim(),
    sections:
      cleanItems.length > 0
        ? [
            {
              subtitle: 'Recomendaciones Clínicas Registradas',
              items: cleanItems,
              certaintyTier: input.certaintyTier,
              sourceNote: `${input.source.trim()} (${input.guideVersion.trim()})`,
            },
          ]
        : [],
    safetyRule: input.safetyRule?.trim() || undefined,
    examPearl: input.examPearl?.trim() || undefined,
    obsoletePracticeAlert: input.obsoletePractice?.outdatedPractice?.trim()
      ? {
          outdatedPractice: input.obsoletePractice.outdatedPractice.trim(),
          whyObsolete: input.obsoletePractice.whyObsolete.trim(),
          currentStandard: input.obsoletePractice.currentStandard.trim(),
          replacedSince: input.obsoletePractice.replacedSince.trim() || input.publishedDate,
        }
      : undefined,
    drugSafetyUpdate: input.drugSafetyUpdate?.genericName?.trim()
      ? input.drugSafetyUpdate
      : undefined,
    versionHistory: [...(existing?.versionHistory || []), newVersionEntry],
    isLocalValidated: true,
    origin: 'user_approved_update',
  };

  await saveStoredKnowledgeRecord(newRecord);
  return getKnowledgeSnapshot(isOnline);
}

function normalizeSearchText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Cruza un caso clínico con la base de conocimiento versionada para mostrar fuentes verificadas,
 * niveles de certeza, discrepancias entre guías, prácticas obsoletas y estado de verificación offline/online.
 */
export function auditCaseKnowledgeReferences(
  caseData: ClinicalCase,
  records: KnowledgeRecord[],
  syncState: KnowledgeSyncState | null,
  isOnline: boolean
): CaseKnowledgeAudit {
  const caseCorpus = normalizeSearchText(
    [
      caseData.solution.correctDiagnosis,
      ...(caseData.solution.guidelineReferences || []),
      ...(caseData.clinicalMetadata?.evidenceSources || []),
      ...caseData.solution.optimalTreatment.pharmacological.map((p) => p.drug),
      caseData.specialty,
    ].join(' ')
  );

  const scored: Array<{ rec: KnowledgeRecord; hits: number }> = [];

  for (const rec of records) {
    let hits = 0;
    const kw = rec.keywords || [];
    for (const k of kw) {
      const nk = normalizeSearchText(k);
      if (nk.length >= 3 && caseCorpus.includes(nk)) {
        hits += 2;
      }
    }

    const titleTokens = normalizeSearchText(rec.title)
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 5);
    for (const token of titleTokens) {
      if (caseCorpus.includes(token)) hits += 1;
    }

    if (hits >= 2) {
      scored.push({ rec, hits });
    }
  }

  scored.sort((a, b) => b.hits - a.hits);
  const matchedRecords = scored.slice(0, 4).map((s) => s.rec);

  const activeDiscrepancies = matchedRecords.flatMap((rec) =>
    (rec.discrepancies || []).map((discrepancy) => ({
      recordTitle: rec.title,
      discrepancy,
    }))
  );

  const obsoleteAlerts = matchedRecords
    .filter((rec) => Boolean(rec.obsoletePracticeAlert))
    .map((rec) => ({
      recordTitle: rec.title,
      alert: rec.obsoletePracticeAlert!,
    }));

  const drugAlerts = matchedRecords
    .filter((rec) => Boolean(rec.drugSafetyUpdate))
    .map((rec) => ({
      recordTitle: rec.title,
      alert: rec.drugSafetyUpdate!,
    }));

  const isVerifiedAgainstRemote =
    isOnline && syncState?.lastOnlineCheckStatus === 'up_to_date_verified';

  const verificationNotice = !isOnline
    ? `Sin conexión a Internet: referencias y recomendaciones respaldadas por la base local verificada (v${syncState?.baseVersion || KNOWLEDGE_BASE_VERSION}, revisada ${syncState?.lastLocalBaseDate || KNOWLEDGE_BASE_DATE}). No se ha comprobado si existen actualizaciones recientes en línea.`
    : isVerifiedAgainstRemote && syncState?.lastOnlineCheckAt
      ? `Repositorio consultado el ${syncState.lastOnlineCheckAt.slice(0, 10)}. Verifique dosis y alertas locales en ficha técnica oficial antes de prescribir en pacientes reales.`
      : `Respaldado en base de conocimiento local verificada (v${syncState?.baseVersion || KNOWLEDGE_BASE_VERSION}, fecha ${syncState?.lastLocalBaseDate || KNOWLEDGE_BASE_DATE}). No se ha consultado un servidor remoto en tiempo real.`;

  return {
    matchedRecords,
    activeDiscrepancies,
    obsoleteAlerts,
    drugAlerts,
    verificationNotice,
    isVerifiedAgainstRemote,
  };
}
