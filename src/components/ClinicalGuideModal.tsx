import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  BookOpen,
  Search,
  Flame,
  HeartPulse,
  Microscope,
  Stethoscope,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  GraduationCap,
  RefreshCw,
  WifiOff,
  Wifi,
  History,
  Plus,
  GitCompare,
  ShieldAlert,
  Ban,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CERTAINTY_TIER_META,
  EvidenceCertaintyTier,
  KNOWLEDGE_KIND_META,
  KnowledgeCategory,
  KnowledgeContentKind,
  KnowledgeRecord,
  KnowledgeSourceInstitution,
  KnowledgeSyncState,
  KnowledgeValidityStatus,
  PendingKnowledgeUpdate,
  VALIDITY_STATUS_META,
} from '../types/knowledge';
import {
  CURATED_KNOWLEDGE_RECORDS,
  KNOWLEDGE_BASE_DATE,
  KNOWLEDGE_BASE_VERSION,
} from '../knowledge/clinicalKnowledgeBase';
import {
  approvePendingKnowledgeUpdate,
  checkRemoteManifestUpdates,
  getKnowledgeSnapshot,
  registerLocalKnowledgeRecord,
  rejectPendingKnowledgeUpdate,
} from '../knowledge/knowledgeSyncEngine';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface ClinicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type KindFilter = 'all' | 'discrepancies' | 'obsolete' | 'drug_safety' | 'studies';

const CATEGORIES: Array<{
  id: KnowledgeCategory;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'urgencias', label: 'Urgencias & Reanimación', shortLabel: 'Urgencias', icon: Flame },
  { id: 'cardio_neumo', label: 'Cardiología & Neumología', shortLabel: 'Cardio/Neumo', icon: HeartPulse },
  { id: 'infecto_nefro', label: 'Infectología & Nefrología', shortLabel: 'Infecto/Nefro', icon: Microscope },
  { id: 'cirugia_pediatria', label: 'Cirugía, Abdomen & Pediatría', shortLabel: 'Cirugía/Ped', icon: Stethoscope },
  { id: 'endocrino_tox_rangos', label: 'Endocrino, Tox & Rangos', shortLabel: 'Endocrino/Rangos', icon: FlaskConical },
];

const INSTITUTION_OPTIONS: Array<{ value: KnowledgeSourceInstitution; label: string }> = [
  { value: 'OMS', label: 'OMS (Organización Mundial de la Salud)' },
  { value: 'OPS', label: 'OPS (Organización Panamericana de la Salud)' },
  { value: 'MINSA_NICARAGUA', label: 'MINSA Nicaragua (Normativa Nacional)' },
  { value: 'AHA_ACC', label: 'AHA / ACC' },
  { value: 'ESC', label: 'ESC (European Society of Cardiology)' },
  { value: 'IDSA', label: 'IDSA' },
  { value: 'ADA', label: 'ADA (American Diabetes Association)' },
  { value: 'KDIGO', label: 'KDIGO' },
  { value: 'GINA', label: 'GINA' },
  { value: 'GOLD', label: 'GOLD' },
  { value: 'NICE', label: 'NICE' },
  { value: 'CDC', label: 'CDC' },
  { value: 'NIH', label: 'NIH' },
  { value: 'ACG', label: 'ACG' },
  { value: 'AAP', label: 'AAP' },
  { value: 'ACOG', label: 'ACOG' },
  { value: 'FDA_EMA', label: 'FDA / EMA (Farmacovigilancia)' },
  { value: 'LITERATURA_PEER_REVIEWED', label: 'PubMed / Cochrane / NEJM / Lancet / BMJ / JAMA' },
];

function getCertaintyBadgeStyle(tier: EvidenceCertaintyTier): string {
  switch (tier) {
    case 'evidencia_establecida':
      return 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]';
    case 'guia_clinica':
      return 'bg-sky-50 border-sky-200 text-sky-900';
    case 'evidencia_emergente':
      return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    case 'opinion_experta':
      return 'bg-amber-50 border-amber-200 text-amber-900';
    case 'incertidumbre_cientifica':
      return 'bg-rose-50 border-rose-200 text-rose-900';
  }
}

function getValidityBadgeStyle(status: KnowledgeValidityStatus): string {
  switch (status) {
    case 'vigente':
      return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    case 'en_revision':
      return 'bg-amber-50 border-amber-200 text-amber-900';
    case 'con_discrepancia':
      return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    case 'obsoleta':
      return 'bg-rose-50 border-rose-300 text-rose-900';
  }
}

export const ClinicalGuideModal: React.FC<ClinicalGuideModalProps> = ({ isOpen, onClose }) => {
  const isOnline = useOnlineStatus();
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>('urgencias');
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');
  const [certaintyFilter, setCertaintyFilter] = useState<EvidenceCertaintyTier | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [records, setRecords] = useState<KnowledgeRecord[]>(CURATED_KNOWLEDGE_RECORDS);
  const [pendingUpdates, setPendingUpdates] = useState<PendingKnowledgeUpdate[]>([]);
  const [syncState, setSyncState] = useState<KnowledgeSyncState | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Record<string, boolean>>({});
  const [showPendingPanel, setShowPendingPanel] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Form states for registering/updating local clinical knowledge
  const [formTitle, setFormTitle] = useState('');
  const [formKind, setFormKind] = useState<KnowledgeContentKind>('guia_clinica');
  const [formCategory, setFormCategory] = useState<KnowledgeCategory>('urgencias');
  const [formSource, setFormSource] = useState('');
  const [formInstitution, setFormInstitution] = useState<KnowledgeSourceInstitution>('OPS');
  const [formPublishedDate, setFormPublishedDate] = useState(new Date().toISOString().slice(0, 10));
  const [formVerifiedDate, setFormVerifiedDate] = useState(new Date().toISOString().slice(0, 10));
  const [formGuideVersion, setFormGuideVersion] = useState('');
  const [formRegion, setFormRegion] = useState('Nicaragua (MINSA) / Latinoamérica (OPS)');
  const [formValidity, setFormValidity] = useState<KnowledgeValidityStatus>('vigente');
  const [formCertainty, setFormCertainty] = useState<EvidenceCertaintyTier>('guia_clinica');
  const [formEvidenceLevel, setFormEvidenceLevel] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formItemsText, setFormItemsText] = useState('');
  const [formOutdatedPractice, setFormOutdatedPractice] = useState('');
  const [formWhyObsolete, setFormWhyObsolete] = useState('');
  const [formCurrentStandard, setFormCurrentStandard] = useState('');
  const [formError, setFormError] = useState('');
  const [isSavingRecord, setIsSavingRecord] = useState(false);

  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    void getKnowledgeSnapshot(isOnline).then((snap) => {
      if (cancelled) return;
      setRecords(snap.records);
      setPendingUpdates(snap.pendingUpdates);
      setSyncState(snap.syncState);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, isOnline]);

  useEffect(() => {
    if (isOpen && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isOpen, selectedCategory, kindFilter, certaintyFilter]);

  const handleCheckUpdates = async () => {
    setIsSyncing(true);
    try {
      const snap = await checkRemoteManifestUpdates(isOnline);
      setRecords(snap.records);
      setPendingUpdates(snap.pendingUpdates);
      setSyncState(snap.syncState);
      if (snap.pendingUpdates.length > 0) {
        setShowPendingPanel(true);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleApprovePending = async (pendingId: string) => {
    const snap = await approvePendingKnowledgeUpdate(pendingId, isOnline);
    setRecords(snap.records);
    setPendingUpdates(snap.pendingUpdates);
    setSyncState(snap.syncState);
  };

  const handleRejectPending = async (pendingId: string) => {
    const snap = await rejectPendingKnowledgeUpdate(pendingId, isOnline);
    setRecords(snap.records);
    setPendingUpdates(snap.pendingUpdates);
    setSyncState(snap.syncState);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !formTitle.trim() ||
      !formSource.trim() ||
      !formGuideVersion.trim() ||
      !formRegion.trim() ||
      !formReference.trim() ||
      !formSummary.trim()
    ) {
      setFormError(
        'Completa todos los metadatos obligatorios: título, fuente, versión, país/región, referencia bibliográfica y resumen clínico.'
      );
      return;
    }

    setIsSavingRecord(true);
    try {
      const items = formItemsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const snap = await registerLocalKnowledgeRecord(
        {
          title: formTitle,
          kind: formKind,
          category: formCategory,
          source: formSource,
          institution: formInstitution,
          publishedDate: formPublishedDate,
          lastVerifiedDate: formVerifiedDate,
          guideVersion: formGuideVersion,
          regionOrCountry: formRegion,
          validityStatus: formValidity,
          certaintyTier: formCertainty,
          evidenceLevel: formEvidenceLevel,
          bibliographicReference: formReference,
          summary: formSummary,
          items,
          changeSummary: 'Registro clínico local verificado desde el gestor de conocimiento.',
          obsoletePractice:
            formKind === 'recomendacion_obsoleta' && formOutdatedPractice.trim()
              ? {
                  outdatedPractice: formOutdatedPractice,
                  whyObsolete: formWhyObsolete || 'Superada por nueva evidencia clínica.',
                  currentStandard: formCurrentStandard || formSummary,
                  replacedSince: formPublishedDate,
                }
              : undefined,
        },
        isOnline
      );

      setRecords(snap.records);
      setPendingUpdates(snap.pendingUpdates);
      setSyncState(snap.syncState);
      setSelectedCategory(formCategory);
      setKindFilter('all');
      setShowRegisterForm(false);
      setFormTitle('');
      setFormSource('');
      setFormGuideVersion('');
      setFormEvidenceLevel('');
      setFormReference('');
      setFormSummary('');
      setFormItemsText('');
      setFormOutdatedPractice('');
      setFormWhyObsolete('');
      setFormCurrentStandard('');
    } finally {
      setIsSavingRecord(false);
    }
  };

  const filteredRecords = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const hasGlobalFilter = Boolean(q) || kindFilter !== 'all' || certaintyFilter !== 'all';

    return records.filter((rec) => {
      if (!hasGlobalFilter && rec.category !== selectedCategory) {
        return false;
      }

      if (kindFilter === 'discrepancies' && !(rec.discrepancies && rec.discrepancies.length > 0)) {
        return false;
      }
      if (
        kindFilter === 'obsolete' &&
        rec.kind !== 'recomendacion_obsoleta' &&
        !rec.obsoletePracticeAlert &&
        rec.validityStatus !== 'obsoleta'
      ) {
        return false;
      }
      if (
        kindFilter === 'drug_safety' &&
        rec.kind !== 'alerta_farmacologica' &&
        !rec.drugSafetyUpdate
      ) {
        return false;
      }
      if (kindFilter === 'studies' && rec.kind !== 'estudio_relevante') {
        return false;
      }

      if (certaintyFilter !== 'all' && rec.certaintyTier !== certaintyFilter) {
        return false;
      }

      if (!q) return true;

      const haystack = [
        rec.title,
        rec.source,
        rec.guideVersion,
        rec.regionOrCountry,
        rec.bibliographicReference,
        rec.summary,
        rec.safetyRule || '',
        rec.examPearl || '',
        ...(rec.keywords || []),
        ...rec.sections.flatMap((s) => [s.subtitle, ...s.items]),
        ...(rec.table ? rec.table.rows.flat() : []),
        ...(rec.discrepancies
          ? rec.discrepancies.flatMap((d) => [
              d.topic,
              d.guidelineA.source,
              d.guidelineA.position,
              d.guidelineB.source,
              d.guidelineB.position,
              d.clinicalExplanation,
            ])
          : []),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [records, selectedCategory, kindFilter, certaintyFilter, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-3 lg:p-4 bg-[#263A32]/45 backdrop-blur-sm">
      <div className="relative w-full max-w-[98vw] sm:max-w-[95vw] lg:max-w-6xl h-[94dvh] sm:h-[90dvh] max-h-[960px] flex flex-col bg-white border border-[#E2EAE4] rounded-2xl shadow-xl overflow-hidden">
        {/* Academic Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#F8FBF9] border-b border-[#E2EAE4] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E4F1E8] border border-[#72A98A]/50 flex items-center justify-center text-[#43866B] shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight truncate">
                Base de Conocimiento Clínico Versionada & Guías
              </h3>
              <p className="text-[11px] text-[#718078] truncate hidden sm:block">
                Fuentes verificables (OMS, OPS, MINSA Nicaragua, ESC, AHA, ADA, KDIGO, IDSA, ACG, FDA/EMA) · v{syncState?.baseVersion || KNOWLEDGE_BASE_VERSION}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowPendingPanel(false);
                setShowRegisterForm((v) => !v);
              }}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showRegisterForm
                  ? 'bg-[#43866B] text-white border-[#43866B]'
                  : 'bg-white hover:bg-[#E4F1E8]/60 text-[#1F4B3A] border-[#72A98A]/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Registrar Guía / Alerta</span>
              <span className="sm:hidden">Registrar</span>
            </button>

            <button
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] p-2 text-[#55685F] hover:text-[#263A32] rounded-xl hover:bg-[#E4F1E8]/60 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
              aria-label="Cerrar base de conocimiento"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Offline-First Governance & Verification Bar */}
        <div
          className={`px-3.5 sm:px-6 py-2 border-b text-[11px] flex flex-wrap items-center justify-between gap-2 shrink-0 ${
            !isOnline || syncState?.lastOnlineCheckStatus === 'offline_unverified'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : pendingUpdates.length > 0
                ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
                : 'bg-[#FAFDFB] border-[#E2EAE4] text-[#55685F]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {!isOnline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
            )}
            <span className="leading-snug">
              {syncState?.syncMessage ||
                (!isOnline
                  ? `Sin conexión: usando última base local verificada (v${KNOWLEDGE_BASE_VERSION}). No se ha comprobado su actualización.`
                  : `Base local verificada (v${KNOWLEDGE_BASE_VERSION}, ${KNOWLEDGE_BASE_DATE}). No se asume actualización automática en tiempo real.`)}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pendingUpdates.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowRegisterForm(false);
                  setShowPendingPanel((v) => !v);
                }}
                className="min-h-[32px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
              >
                Pendientes de revisión ({pendingUpdates.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => void handleCheckUpdates()}
              disabled={isSyncing}
              className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#E4F1E8]/60 border border-[#CFE4D6] text-[#1F4B3A] text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Comprobando...' : 'Comprobar actualizaciones'}</span>
            </button>
          </div>
        </div>

        {/* Search + Category + Evidence Filters Bar */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#F3F7F4] border-b border-[#E2EAE4] space-y-2 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive =
                  !searchTerm.trim() &&
                  kindFilter === 'all' &&
                  certaintyFilter === 'all' &&
                  selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setKindFilter('all');
                      setCertaintyFilter('all');
                      setSelectedCategory(cat.id);
                    }}
                    className={`min-h-[36px] px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#43866B] text-white shadow-sm'
                        : 'bg-white text-[#55685F] hover:text-[#263A32] border border-[#E2EAE4] hover:border-[#72A98A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="sm:hidden">{cat.shortLabel}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar guía, fármaco, Nicaragua, escala..."
                className="w-full min-h-[36px] bg-white border border-[#E2EAE4] rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
              />
            </div>
          </div>

          {/* Governance & Certainty Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'Por categoría' },
                  { id: 'discrepancies', label: 'Discrepancias entre guías' },
                  { id: 'obsolete', label: 'Prácticas obsoletas' },
                  { id: 'drug_safety', label: 'Alertas farmacológicas' },
                ] as Array<{ id: KindFilter; label: string }>
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setKindFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                    kindFilter === f.id
                      ? 'bg-[#263A32] text-white border-[#263A32]'
                      : 'bg-white text-[#55685F] border-[#E2EAE4] hover:border-[#72A98A]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="kb-certainty-filter" className="text-[#55685F] font-semibold">
                Certeza:
              </label>
              <select
                id="kb-certainty-filter"
                value={certaintyFilter}
                onChange={(e) =>
                  setCertaintyFilter(e.target.value as EvidenceCertaintyTier | 'all')
                }
                className="bg-white border border-[#E2EAE4] rounded-lg px-2 py-1 text-[11px] text-[#263A32] font-semibold focus:outline-none focus:border-[#43866B]"
              >
                <option value="all">Todos los niveles</option>
                <option value="evidencia_establecida">Evidencia establecida</option>
                <option value="guia_clinica">Recomendación de guía</option>
                <option value="evidencia_emergente">Evidencia emergente</option>
                <option value="opinion_experta">Opinión experta</option>
                <option value="incertidumbre_cientifica">Incertidumbre científica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          ref={modalBodyRef}
          className="p-3.5 sm:p-6 flex-1 min-h-0 overflow-y-auto space-y-4 bg-[#F3F7F4]/50"
        >
          {/* Pending External Updates Review Panel (never auto-overwrites validated content) */}
          {showPendingPanel && pendingUpdates.length > 0 && (
            <section className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-indigo-950">
                  Actualizaciones Externas Pendientes de Validación Clínica ({pendingUpdates.length})
                </div>
                <button
                  type="button"
                  onClick={() => setShowPendingPanel(false)}
                  className="text-xs text-indigo-700 hover:underline cursor-pointer"
                >
                  Ocultar
                </button>
              </div>
              <p className="text-[11px] text-indigo-900">
                Política de seguridad: ninguna recomendación validada se reemplaza automáticamente. Revisa cada cambio antes de aprobarlo.
              </p>
              <div className="space-y-2">
                {pendingUpdates.map((upd) => (
                  <div
                    key={upd.id}
                    className="bg-white border border-indigo-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="font-bold text-[#263A32]">{upd.proposedRecord.title}</div>
                      <div className="text-[11px] text-[#55685F]">
                        {upd.changeSummary} · Fuente: {upd.proposedRecord.source} ({upd.proposedRecord.guideVersion})
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => void handleRejectPending(upd.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold cursor-pointer"
                      >
                        Descartar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleApprovePending(upd.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#43866B] hover:bg-[#356D56] text-white text-[11px] font-bold cursor-pointer"
                      >
                        Aprobar versión
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Local Knowledge Registration Form */}
          {showRegisterForm && (
            <form
              onSubmit={(e) => void handleRegisterSubmit(e)}
              className="bg-white border border-[#72A98A] rounded-xl p-4 sm:p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#E2EAE4] pb-2">
                <h4 className="text-sm font-bold text-[#1F4B3A]">
                  Registrar Nueva Guía, Estudio, Alerta Farmacológica o Práctica Obsoleta
                </h4>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="text-xs text-[#55685F] hover:text-[#263A32] cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              {formError && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-900">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="font-semibold text-[#263A32] block mb-1">Título del contenido *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ej. Manejo actualizado de Leptospirosis en adultos (MINSA / OPS)"
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs focus:outline-none focus:border-[#43866B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Tipo de contenido *</label>
                  <select
                    value={formKind}
                    onChange={(e) => setFormKind(e.target.value as KnowledgeContentKind)}
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  >
                    <option value="guia_clinica">Guía Clínica</option>
                    <option value="protocolo_terapeutico">Protocolo Terapéutico</option>
                    <option value="estudio_relevante">Estudio / Metaanálisis</option>
                    <option value="alerta_farmacologica">Alerta Farmacológica / Dosis</option>
                    <option value="recomendacion_obsoleta">Recomendación Obsoleta</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Área temática *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as KnowledgeCategory)}
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Organismo / Institución *</label>
                  <select
                    value={formInstitution}
                    onChange={(e) =>
                      setFormInstitution(e.target.value as KnowledgeSourceInstitution)
                    }
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  >
                    {INSTITUTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Fuente identificable *</label>
                  <input
                    type="text"
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="Ej. OPS / MINSA Nicaragua"
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Versión de la guía *</label>
                  <input
                    type="text"
                    value={formGuideVersion}
                    onChange={(e) => setFormGuideVersion(e.target.value)}
                    placeholder="Ej. Edición 2025 v1.0"
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">País o región *</label>
                  <input
                    type="text"
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                    placeholder="Ej. Nicaragua / Latinoamérica"
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Estado de vigencia *</label>
                  <select
                    value={formValidity}
                    onChange={(e) => setFormValidity(e.target.value as KnowledgeValidityStatus)}
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  >
                    <option value="vigente">Vigente</option>
                    <option value="en_revision">En revisión</option>
                    <option value="con_discrepancia">Con discrepancia entre guías</option>
                    <option value="obsoleta">Obsoleta</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Tipo de certeza *</label>
                  <select
                    value={formCertainty}
                    onChange={(e) => setFormCertainty(e.target.value as EvidenceCertaintyTier)}
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  >
                    <option value="evidencia_establecida">Evidencia científica establecida</option>
                    <option value="guia_clinica">Recomendación de guía clínica</option>
                    <option value="evidencia_emergente">Evidencia emergente</option>
                    <option value="opinion_experta">Opinión experta</option>
                    <option value="incertidumbre_cientifica">Incertidumbre científica</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Fecha de publicación</label>
                  <input
                    type="date"
                    value={formPublishedDate}
                    onChange={(e) => setFormPublishedDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#263A32] block mb-1">Última verificación</label>
                  <input
                    type="date"
                    value={formVerifiedDate}
                    onChange={(e) => setFormVerifiedDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-semibold text-[#263A32] block mb-1">
                    Referencia bibliográfica verificable * (sin inventar DOI ni autores)
                  </label>
                  <input
                    type="text"
                    value={formReference}
                    onChange={(e) => setFormReference(e.target.value)}
                    placeholder="Cita oficial de la guía, formulario nacional o publicación verificada"
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-semibold text-[#263A32] block mb-1">Nivel de evidencia (opcional)</label>
                  <input
                    type="text"
                    value={formEvidenceLevel}
                    onChange={(e) => setFormEvidenceLevel(e.target.value)}
                    placeholder="Ej. Clase I, Nivel A / Recomendación fuerte GRADE"
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-semibold text-[#263A32] block mb-1">Resumen clínico *</label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Síntesis clínica y alcance poblacional de la recomendación..."
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-semibold text-[#263A32] block mb-1">
                    Puntos clínicos clave (uno por línea)
                  </label>
                  <textarea
                    rows={3}
                    value={formItemsText}
                    onChange={(e) => setFormItemsText(e.target.value)}
                    placeholder="Ej. Confirmar diagnóstico antes de..."
                    className="w-full rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-3 py-2 text-xs"
                  />
                </div>

                {formKind === 'recomendacion_obsoleta' && (
                  <>
                    <div>
                      <label className="font-semibold text-rose-900 block mb-1">Práctica declarada obsoleta</label>
                      <input
                        type="text"
                        value={formOutdatedPractice}
                        onChange={(e) => setFormOutdatedPractice(e.target.value)}
                        className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-rose-900 block mb-1">Por qué quedó obsoleta</label>
                      <input
                        type="text"
                        value={formWhyObsolete}
                        onChange={(e) => setFormWhyObsolete(e.target.value)}
                        className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[#1F4B3A] block mb-1">Estándar actual vigente</label>
                      <input
                        type="text"
                        value={formCurrentStandard}
                        onChange={(e) => setFormCurrentStandard(e.target.value)}
                        className="w-full rounded-lg border border-[#CFE4D6] bg-[#F8FBF9] px-3 py-2 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingRecord}
                  className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSavingRecord ? 'Guardando...' : 'Guardar en Base Local Verificada'}
                </button>
              </div>
            </form>
          )}

          {/* Records List */}
          {filteredRecords.length === 0 ? (
            <div className="bg-white border border-[#E2EAE4] rounded-xl p-8 text-center text-xs text-[#55685F] space-y-2">
              <p>No se encontraron registros clínicos con los filtros aplicados.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setKindFilter('all');
                  setCertaintyFilter('all');
                }}
                className="min-h-[38px] px-4 py-1.5 bg-[#43866B] hover:bg-[#356D56] text-white rounded-xl font-semibold cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            filteredRecords.map((rec) => {
              const historyOpen = Boolean(expandedHistoryIds[rec.id]);
              return (
                <article
                  key={rec.id}
                  className="bg-white border border-[#E2EAE4] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]"
                >
                  {/* Governance Badges & Header */}
                  <div className="border-b border-[#E2EAE4] pb-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#43866B]">
                        <Bookmark className="w-3 h-3 shrink-0" />
                        <span>{rec.source}</span>
                      </span>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md border border-[#E2EAE4] bg-[#F8FBF9] text-[#263A32] text-[10px] font-bold">
                          {KNOWLEDGE_KIND_META[rec.kind].label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getCertaintyBadgeStyle(
                            rec.certaintyTier
                          )}`}
                          title={CERTAINTY_TIER_META[rec.certaintyTier].description}
                        >
                          {CERTAINTY_TIER_META[rec.certaintyTier].shortLabel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getValidityBadgeStyle(
                            rec.validityStatus
                          )}`}
                        >
                          {VALIDITY_STATUS_META[rec.validityStatus].label}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
                      {rec.title}
                    </h4>

                    <p className="text-xs text-[#55685F] leading-relaxed">{rec.summary}</p>

                    {/* Structured Traceability Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px] text-[#55685F]">
                      <div className="bg-[#FAFDFB] border border-[#E2EAE4] rounded-lg px-2.5 py-1.5">
                        <span className="font-semibold text-[#263A32]">Versión: </span>
                        <span className="font-mono">{rec.guideVersion}</span>
                      </div>
                      <div className="bg-[#FAFDFB] border border-[#E2EAE4] rounded-lg px-2.5 py-1.5">
                        <span className="font-semibold text-[#263A32]">Publicación / Verif.: </span>
                        <span className="font-mono">
                          {rec.publishedDate} / {rec.lastVerifiedDate}
                        </span>
                      </div>
                      <div className="bg-[#FAFDFB] border border-[#E2EAE4] rounded-lg px-2.5 py-1.5 sm:col-span-2">
                        <span className="font-semibold text-[#263A32]">Aplicación regional: </span>
                        <span>{rec.regionOrCountry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Structured Table */}
                  {rec.table && (
                    <div className="overflow-x-auto rounded-xl border border-[#E2EAE4] bg-white">
                      <table className="w-full text-left text-[11px] sm:text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#E2EAE4] bg-[#F8FBF9] text-[#43866B] uppercase text-[10px] tracking-wider">
                            {rec.table.headers.map((head, hIdx) => (
                              <th key={hIdx} className="py-2.5 px-3 font-bold">
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2EAE4] text-[#263A32]">
                          {rec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#F8FBF9]/80">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-2 px-3 align-top ${
                                    cIdx === 0
                                      ? 'font-bold text-[#263A32] whitespace-nowrap'
                                      : 'text-[#55685F]'
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Clinical Sections */}
                  {rec.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#43866B]">
                          {sec.subtitle}
                        </h5>
                        {sec.certaintyTier && (
                          <span className="text-[10px] font-semibold text-[#55685F]">
                            {CERTAINTY_TIER_META[sec.certaintyTier].shortLabel}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#263A32] leading-relaxed">
                        {sec.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#43866B] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Explicit Guideline Discrepancies */}
                  {rec.discrepancies && rec.discrepancies.length > 0 && (
                    <div className="space-y-2">
                      {rec.discrepancies.map((disc, dIdx) => (
                        <div
                          key={dIdx}
                          className="bg-indigo-50/75 border border-indigo-200 rounded-xl p-3.5 space-y-2 text-xs text-indigo-950"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                            <GitCompare className="w-4 h-4 shrink-0" />
                            <span>Discrepancia Identificada entre Guías: {disc.topic}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="bg-white border border-indigo-200 rounded-lg p-2.5">
                              <div className="font-bold text-[11px] text-indigo-900">
                                {disc.guidelineA.source} ({disc.guidelineA.version})
                              </div>
                              <p className="text-[11px] text-[#263A32] mt-0.5">{disc.guidelineA.position}</p>
                            </div>
                            <div className="bg-white border border-indigo-200 rounded-lg p-2.5">
                              <div className="font-bold text-[11px] text-indigo-900">
                                {disc.guidelineB.source} ({disc.guidelineB.version})
                              </div>
                              <p className="text-[11px] text-[#263A32] mt-0.5">{disc.guidelineB.position}</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-indigo-950 leading-relaxed">
                            <strong>Explicación clínica:</strong> {disc.clinicalExplanation}
                          </p>
                          {disc.localAdaptationNote && (
                            <p className="text-[11px] text-[#1F4B3A] bg-[#E4F1E8]/70 border border-[#CFE4D6] rounded-lg px-2.5 py-1.5">
                              <strong>Adaptación regional (OPS / Nicaragua):</strong> {disc.localAdaptationNote}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Obsolete Practice Detection Box */}
                  {rec.obsoletePracticeAlert && (
                    <div className="bg-rose-50/85 border border-rose-300 rounded-xl p-3.5 space-y-1.5 text-xs text-rose-950">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900">
                        <Ban className="w-4 h-4 shrink-0" />
                        <span>Recomendación Obsoleta Detectada (Reemplazada: {rec.obsoletePracticeAlert.replacedSince})</span>
                      </div>
                      <p className="text-[11px]">
                        <strong>Práctica superada:</strong> {rec.obsoletePracticeAlert.outdatedPractice}
                      </p>
                      <p className="text-[11px]">
                        <strong>Por qué cambió:</strong> {rec.obsoletePracticeAlert.whyObsolete}
                      </p>
                      <p className="text-[11px] text-[#1F4B3A] bg-white border border-[#CFE4D6] rounded-lg px-2.5 py-1.5">
                        <strong>Estándar vigente:</strong> {rec.obsoletePracticeAlert.currentStandard}
                      </p>
                    </div>
                  )}

                  {/* Drug Safety Update Box */}
                  {rec.drugSafetyUpdate && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-1 text-xs text-amber-950">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>
                          Seguridad Farmacológica ({rec.drugSafetyUpdate.genericName} · {rec.drugSafetyUpdate.regulatorySource})
                        </span>
                      </div>
                      <p className="text-[11px]">{rec.drugSafetyUpdate.clinicalImpact}</p>
                      <p className="text-[11px] font-semibold">
                        Verificación de dosis: {rec.drugSafetyUpdate.doseVerificationNote}
                      </p>
                    </div>
                  )}

                  {/* Exam Pearl */}
                  {rec.examPearl && (
                    <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-start gap-2 text-xs text-sky-900">
                      <GraduationCap className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-sky-800">Perla Académica: </span>
                        <span>{rec.examPearl}</span>
                      </div>
                    </div>
                  )}

                  {/* Safety Alert Rule */}
                  {rec.safetyRule && (
                    <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-800">Alerta Crítica de Seguridad: </span>
                        <span>{rec.safetyRule}</span>
                      </div>
                    </div>
                  )}

                  {/* Bibliographic Reference, Disclaimer & Version History */}
                  <div className="border-t border-[#E2EAE4] pt-2.5 space-y-1.5 text-[11px] text-[#55685F]">
                    <div>
                      <strong className="text-[#263A32]">Referencia: </strong>
                      <span>{rec.bibliographicReference}</span>
                      {rec.evidenceLevel && (
                        <span className="text-[#43866B]"> · Nivel: {rec.evidenceLevel}</span>
                      )}
                    </div>

                    {rec.verificationDisclaimer && (
                      <div className="text-amber-900 bg-amber-50/70 border border-amber-200 rounded-lg px-2.5 py-1.5">
                        <strong>Nota de verificación: </strong>
                        {rec.verificationDisclaimer}
                      </div>
                    )}

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedHistoryIds((prev) => ({
                            ...prev,
                            [rec.id]: !prev[rec.id],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#43866B] hover:text-[#1F4B3A] cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5 shrink-0" />
                        <span>Historial de versiones ({rec.versionHistory.length})</span>
                        {historyOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {historyOpen && (
                        <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-[#CFE4D6]">
                          {rec.versionHistory.map((ver, vIdx) => (
                            <div key={vIdx} className="text-[11px] space-y-0.5">
                              <div className="font-bold text-[#263A32]">
                                {ver.version}{' '}
                                <span className="font-mono font-normal text-[#718078]">
                                  (Publicado: {ver.publishedAt} · Verificado: {ver.verifiedAt})
                                </span>
                              </div>
                              <div className="text-[#55685F]">{ver.summaryOfChanges}</div>
                              {ver.supersededRecommendation && (
                                <div className="text-rose-800">
                                  Reemplaza: {ver.supersededRecommendation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#F8FBF9] border-t border-[#E2EAE4] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] text-[#718078]">
            <span>{records.length} registros clínicos versionados (offline-first)</span>
            <span className="hidden sm:inline"> · Uso educativo: verificar dosis y normas institucionales locales antes de aplicar en pacientes reales.</span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 bg-[#43866B] hover:bg-[#356D56] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Cerrar Base de Conocimiento
          </button>
        </div>
      </div>
    </div>
  );
};
