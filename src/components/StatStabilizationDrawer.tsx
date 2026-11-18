import React, { useState, useRef, useEffect } from 'react';
import { HospitalSelect } from './HospitalSelect';
import {
  Zap,
  Syringe,
  Activity,
  Send,
  CornerDownLeft,
  Volume2,
  VolumeX,
  UserRound,
  Baby,
  Stethoscope,
  Sparkles,
  MessageCircleQuestion,
  AlertTriangle,
  CheckCircle2,
  X,
  Clock,
  ShieldCheck,
  Skull,
  AlertOctagon,
} from 'lucide-react';
import {
  ChatMessage,
  ClinicalCase,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';
import {
  STAT_QUICK_PRESETS,
  StatApplyInput,
  StatPreset,
  summarizeDrugSessionAccumulation,
} from '../utils/statStabilization';

interface StatStabilizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: ClinicalCase;
  baselineVitals: VitalSigns;
  liveVitals: VitalSigns;
  statInterventions: StatInterventionRecord[];
  messages: ChatMessage[];
  onApplyStat: (input: StatApplyInput) => void;
  onSendMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  isDeceased?: boolean;
  initialTtsEnabled?: boolean;
  onToggleTts?: (enabled: boolean) => void;
}

type CategoryFilter = 'Todos' | StatPreset['category'];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'Todos',
  'Vía Aérea / O₂',
  'Hemodinamia / Líquidos',
  'Cardio / Crisis',
  'Metabólico / Síntomas',
];

const POST_STAT_QUESTIONS = [
  '¿Cómo se siente ahora después de lo que le acabamos de aplicar?',
  '¿Siente que respira más fácil o le falta menos el aire?',
  '¿Le disminuyó el dolor, el mareo o la presión en la cabeza?',
  '¿Notó mareo nuevo, visión borrosa, picazón o palpitaciones tras la dosis?',
];

function parseBPNums(bp: string): { sys: number; dia: number } {
  const match = bp.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) return { sys: 120, dia: 80 };
  return { sys: parseInt(match[1], 10), dia: parseInt(match[2], 10) };
}

export const StatStabilizationDrawer: React.FC<StatStabilizationDrawerProps> = ({
  isOpen,
  onClose,
  caseData,
  baselineVitals,
  liveVitals,
  statInterventions,
  messages,
  onApplyStat,
  onSendMessage,
  isChatLoading,
  isDeceased = false,
  initialTtsEnabled = false,
  onToggleTts,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Todos');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [drug, setDrug] = useState('');
  const [dose, setDose] = useState('');
  const [route, setRoute] = useState('Intravenosa (IV)');
  const [chatInput, setChatInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(initialTtsEnabled);

  useEffect(() => {
    setTtsEnabled(initialTtsEnabled);
  }, [initialTtsEnabled]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const doseInputRef = useRef<HTMLInputElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const isPediatric = caseData.patientInfo.age < 12;
  const isExamenMode = caseData.mode === 'examen';
  const isUnconscious = !isDeceased && liveVitals.glasgow <= 9;
  const isChatBlocked = Boolean(isDeceased || isUnconscious);
  const weightKgApprox = caseData.vitalSigns.weightKg || (isPediatric ? Math.max(8, caseData.patientInfo.age * 2 + 8) : 70);
  const sessionAccumulation = drug.trim()
    ? summarizeDrugSessionAccumulation(drug, statInterventions, weightKgApprox)
    : null;

  const filteredPresets =
    categoryFilter === 'Todos'
      ? STAT_QUICK_PRESETS
      : STAT_QUICK_PRESETS.filter((p) => p.category === categoryFilter);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    lastSpokenIdRef.current = messages[messages.length - 1]?.id ?? null;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [caseData.id]);

  useEffect(() => {
    if (!isOpen || !ttsEnabled) return;
    const lastPatientMsg = [...messages].reverse().find((m) => m.sender === 'patient');
    if (lastPatientMsg && lastPatientMsg.id !== lastSpokenIdRef.current) {
      lastSpokenIdRef.current = lastPatientMsg.id;
      speakText(lastPatientMsg.text);
    }
  }, [messages, ttsEnabled, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isChatLoading, statInterventions.length, isOpen]);

  if (!isOpen) return null;

  const handleLoadPreset = (preset: StatPreset) => {
    setSelectedPresetId(preset.id);
    setDrug(preset.drug);
    setDose(preset.dose);
    setRoute(preset.route);
    window.setTimeout(() => {
      doseInputRef.current?.focus();
    }, 30);
  };

  const handleApplyOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDeceased || !drug.trim()) return;
    onApplyStat({
      presetId: selectedPresetId,
      label: drug.trim(),
      drug: drug.trim(),
      dose: dose.trim() || 'Dosis STAT estándar',
      route,
      frequency: 'Dosis STAT (Urgencias)',
      duration: 'Estabilización aguda',
    });
    setSelectedPresetId(undefined);
    setDrug('');
    setDose('');
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading || isChatBlocked) return;
    const text = chatInput.trim();
    setChatInput('');
    await onSendMessage(text);
  };

  const baseBP = parseBPNums(baselineVitals.bloodPressure);
  const liveBP = parseBPNums(liveVitals.bloodPressure);
  const sysDiff = liveBP.sys - baseBP.sys;
  const diaDiff = liveBP.dia - baseBP.dia;
  const hrDiff = liveVitals.heartRate - baselineVitals.heartRate;
  const rrDiff = liveVitals.respiratoryRate - baselineVitals.respiratoryRate;
  const tempDiff = Number((liveVitals.temperature - baselineVitals.temperature).toFixed(1));
  const spo2Diff = liveVitals.oxygenSaturation - baselineVitals.oxygenSaturation;
  const gcsDiff = liveVitals.glasgow - baselineVitals.glasgow;
  const hasGlucose =
    typeof liveVitals.bloodGlucose === 'number' && typeof baselineVitals.bloodGlucose === 'number';
  const glucDiff = hasGlucose
    ? (liveVitals.bloodGlucose as number) - (baselineVitals.bloodGlucose as number)
    : 0;

  const vitalComparisons: Array<{
    key: string;
    label: string;
    liveValue: string;
    baseValue: string;
    changed: boolean;
    direction: 'up' | 'down' | 'neutral';
    deltaLabel: string;
    isAlert: boolean;
    isImproved: boolean;
  }> = [
    {
      key: 'pa',
      label: 'PA (mmHg)',
      liveValue: `${liveBP.sys}/${liveBP.dia}`,
      baseValue: `${baseBP.sys}/${baseBP.dia}`,
      changed: sysDiff !== 0 || diaDiff !== 0,
      direction: sysDiff > 0 ? 'up' : sysDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${sysDiff >= 0 ? '+' : ''}${sysDiff}/${diaDiff >= 0 ? '+' : ''}${diaDiff}`,
      isAlert: liveBP.sys < 95 || liveBP.sys >= 165,
      isImproved:
        (baseBP.sys < 95 && sysDiff > 0 && liveBP.sys >= 95) ||
        (baseBP.sys >= 160 && sysDiff < 0 && liveBP.sys >= 110 && liveBP.sys < 160),
    },
    {
      key: 'fc',
      label: 'FC (lpm)',
      liveValue: `${liveVitals.heartRate}`,
      baseValue: `${baselineVitals.heartRate}`,
      changed: hrDiff !== 0,
      direction: hrDiff > 0 ? 'up' : hrDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${hrDiff > 0 ? '+' : ''}${hrDiff}`,
      isAlert: liveVitals.heartRate > 110 || liveVitals.heartRate < 50,
      isImproved: baselineVitals.heartRate > 100 && hrDiff < 0 && liveVitals.heartRate >= 55,
    },
    {
      key: 'fr',
      label: 'FR (rpm)',
      liveValue: `${liveVitals.respiratoryRate}`,
      baseValue: `${baselineVitals.respiratoryRate}`,
      changed: rrDiff !== 0,
      direction: rrDiff > 0 ? 'up' : rrDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${rrDiff > 0 ? '+' : ''}${rrDiff}`,
      isAlert: liveVitals.respiratoryRate > 22 || liveVitals.respiratoryRate < 11,
      isImproved: baselineVitals.respiratoryRate > 20 && rrDiff < 0 && liveVitals.respiratoryRate >= 12,
    },
    {
      key: 'spo2',
      label: 'SpO₂ (%)',
      liveValue: `${liveVitals.oxygenSaturation}%`,
      baseValue: `${baselineVitals.oxygenSaturation}%`,
      changed: spo2Diff !== 0,
      direction: spo2Diff > 0 ? 'up' : spo2Diff < 0 ? 'down' : 'neutral',
      deltaLabel: `${spo2Diff > 0 ? '+' : ''}${spo2Diff}%`,
      isAlert: liveVitals.oxygenSaturation < 93,
      isImproved: baselineVitals.oxygenSaturation < 94 && spo2Diff > 0,
    },
    {
      key: 'temp',
      label: 'Temp (°C)',
      liveValue: `${liveVitals.temperature.toFixed(1)}°`,
      baseValue: `${baselineVitals.temperature.toFixed(1)}°`,
      changed: Math.abs(tempDiff) >= 0.05,
      direction: tempDiff > 0 ? 'up' : tempDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${tempDiff > 0 ? '+' : ''}${tempDiff.toFixed(1)}°`,
      isAlert: liveVitals.temperature >= 38.0,
      isImproved: baselineVitals.temperature >= 38.0 && tempDiff < 0,
    },
    ...(hasGlucose
      ? [
          {
            key: 'gluc',
            label: 'Gluc (mg/dL)',
            liveValue: `${liveVitals.bloodGlucose}`,
            baseValue: `${baselineVitals.bloodGlucose}`,
            changed: glucDiff !== 0,
            direction: (glucDiff > 0 ? 'up' : glucDiff < 0 ? 'down' : 'neutral') as
              | 'up'
              | 'down'
              | 'neutral',
            deltaLabel: `${glucDiff > 0 ? '+' : ''}${glucDiff}`,
            isAlert:
              (liveVitals.bloodGlucose as number) < 70 ||
              (liveVitals.bloodGlucose as number) >= 250,
            isImproved:
              ((baselineVitals.bloodGlucose as number) < 70 &&
                glucDiff > 0 &&
                (liveVitals.bloodGlucose as number) >= 75) ||
              ((baselineVitals.bloodGlucose as number) >= 200 &&
                glucDiff < 0 &&
                (liveVitals.bloodGlucose as number) >= 90),
          },
        ]
      : []),
    {
      key: 'gcs',
      label: 'Glasgow',
      liveValue: `${liveVitals.glasgow}/15`,
      baseValue: `${baselineVitals.glasgow}/15`,
      changed: gcsDiff !== 0,
      direction: gcsDiff > 0 ? 'up' : gcsDiff < 0 ? 'down' : 'neutral',
      deltaLabel: `${gcsDiff > 0 ? '+' : ''}${gcsDiff}`,
      isAlert: liveVitals.glasgow < 14,
      isImproved: baselineVitals.glasgow < 15 && gcsDiff > 0,
    },
  ];

  const renderPatientAvatarIcon = (className: string) =>
    isPediatric ? <Baby className={className} /> : <UserRound className={className} />;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#263A32]/45 backdrop-blur-sm flex items-center justify-center p-1.5 sm:p-3 lg:p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Ventana de Aplicación STAT de Emergencias"
    >
      <div className="w-full max-w-[98vw] sm:max-w-[96vw] xl:max-w-[1440px] h-[96dvh] sm:h-[94dvh] bg-white border border-[#E2EAE4] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#F8FBF9] border-b border-[#E2EAE4] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#263A32] truncate">
                Aplicación STAT de Emergencias · {caseData.patientInfo.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#55685F] truncate tabular-nums">
                {caseData.patientInfo.age} años · {caseData.patientInfo.sex}
                {typeof (liveVitals.weightKg ?? caseData.vitalSigns.weightKg) === 'number'
                  ? ` · Peso: ${liveVitals.weightKg ?? caseData.vitalSigns.weightKg} kg`
                  : ` · Peso est.: ${weightKgApprox} kg`}
                {typeof (liveVitals.heightCm ?? caseData.vitalSigns.heightCm) === 'number'
                  ? ` · Talla: ${liveVitals.heightCm ?? caseData.vitalSigns.heightCm} cm`
                  : ''}
                {' · '}Seleccione o edite la dosis exacta a administrar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-[#E4F1E8] border border-[#E2EAE4] text-xs sm:text-sm font-semibold text-[#263A32] flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 shrink-0 text-[#55685F]" />
            <span className="hidden sm:inline">Volver a Consulta</span>
          </button>
        </div>

        {/* Live Vitals Delta Strip */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#F3F7F4] border-b border-[#E2EAE4] shrink-0">
          <div className="flex lg:grid lg:grid-cols-7 gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 no-scrollbar font-mono tabular-nums">
            {vitalComparisons.map((item) => (
              <div
                key={item.key}
                className={`min-w-[128px] lg:min-w-0 shrink-0 rounded-xl border px-3 py-2 space-y-0.5 ${
                  item.isAlert
                    ? 'bg-rose-50 border-rose-300'
                    : item.isImproved
                    ? 'bg-[#E4F1E8] border-[#72A98A]'
                    : 'bg-white border-[#E2EAE4]'
                }`}
              >
                <div className="text-[10px] font-sans uppercase font-bold text-[#55685F]">
                  {item.label}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#263A32] leading-tight">
                  {item.liveValue}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Zone Body */}
        <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-5 bg-[#F3F7F4] grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* LEFT: Unified STAT Order Composer + Applied History (5 cols) */}
          <div className="lg:col-span-5 lg:h-full lg:overflow-y-auto lg:pr-1 space-y-4">
            <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 space-y-3 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Syringe className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>1. Preparar y Aplicar Dosis STAT</span>
                </h3>
                <span className="text-[11px] font-mono tabular-nums text-[#55685F] font-semibold">
                  {statInterventions.length} aplicadas
                </span>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {CATEGORY_FILTERS.map((cat) => {
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`min-h-[34px] px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#43866B] border-[#43866B] text-white'
                          : 'bg-[#F8FBF9] border-[#E2EAE4] text-[#55685F] hover:text-[#263A32] hover:border-[#72A98A]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Quick-Load Chips */}
              {isDeceased && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl px-3.5 py-2.5 text-[11px] text-rose-900 flex items-center gap-2 font-medium">
                  <Skull className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>Paciente en asistolia tras muerte inmediata por iatrogenia. No es posible administrar más dosis STAT.</span>
                </div>
              )}

              <div>
                <div className="text-[11px] sm:text-xs text-[#55685F] mb-2">
                  Toque una opción rápida para cargarla (puede editar la dosis antes de aplicar):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
                  {filteredPresets.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        disabled={isDeceased}
                        onClick={() => handleLoadPreset(preset)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl text-left text-xs font-medium border transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-300'
                            : 'bg-[#F8FBF9] hover:bg-[#E4F1E8] border-[#E2EAE4] hover:border-[#72A98A] text-[#263A32]'
                        }`}
                      >
                        <span className="font-semibold truncate">{preset.label}</span>
                        <span className="text-[11px] text-[#55685F] font-mono tabular-nums shrink-0">{preset.dose}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unified Order Composer */}
              <form
                onSubmit={handleApplyOrder}
                className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3.5 space-y-2.5"
              >
                <div>
                  <label className="text-[11px] font-semibold text-[#55685F] block mb-1">
                    Medicamento o Soporte *
                  </label>
                  <input
                    type="text"
                    value={drug}
                    disabled={isDeceased}
                    onChange={(e) => {
                      setDrug(e.target.value);
                      if (selectedPresetId) setSelectedPresetId(undefined);
                    }}
                    placeholder="Ej. Labetalol, Solución Salina 0.9%, Oxígeno..."
                    className="w-full min-h-[40px] bg-white border border-[#E2EAE4] rounded-xl px-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#43866B]/15 disabled:opacity-45"
                  />
                  {sessionAccumulation && (
                    <p className="mt-1 text-[11px] font-mono tabular-nums text-amber-800">
                      Acumulado en sesión: {sessionAccumulation.count} dosis ({sessionAccumulation.totalLabel})
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#55685F] block mb-1">
                      Dosis Exacta (editable) *
                    </label>
                    <input
                      ref={doseInputRef}
                      type="text"
                      value={dose}
                      disabled={isDeceased}
                      onChange={(e) => setDose(e.target.value)}
                      placeholder="Ej. 20 mg, 80 mg, 1000 mL..."
                      className="w-full min-h-[40px] bg-white border border-[#E2EAE4] rounded-xl px-3 py-2 text-xs text-[#263A32] font-mono placeholder-[#718078] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15 disabled:opacity-45"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#55685F] block mb-1">Vía</label>
                    <HospitalSelect
                      variant="compact"
                      align="right"
                      panelTitle="Vía de Administración STAT"
                      value={route}
                      disabled={isDeceased}
                      onChange={setRoute}
                      options={[
                        { value: 'Intravenosa (IV)', label: 'Intravenosa (IV)' },
                        { value: 'Intramuscular (IM)', label: 'Intramuscular (IM)' },
                        { value: 'Inhalatoria', label: 'Inhalatoria' },
                        { value: 'Sublingual (SL)', label: 'Sublingual (SL)' },
                        { value: 'Oral (VO)', label: 'Oral (VO)' },
                        { value: 'Subcutánea (SC)', label: 'Subcutánea (SC)' },
                      ]}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDeceased || !drug.trim()}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-45 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{isDeceased ? 'Paciente Fallecido' : 'Aplicar STAT al Paciente'}</span>
                </button>
              </form>
            </div>

            {/* Applied STAT History */}
            <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 space-y-2.5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#263A32] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#43866B] shrink-0" />
                <span>Registro de Dosis Aplicadas y Efecto</span>
              </h3>

              {statInterventions.length === 0 ? (
                <p className="text-xs text-[#55685F] leading-relaxed">
                  Ninguna dosis STAT aplicada aún. Cargue o escriba un medicamento arriba para evaluar la respuesta hemodinámica y respiratoria.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {[...statInterventions].reverse().map((rec) => {
                    const isAdverse = rec.effectSeverity === 'reaccion_adversa';
                    const isImproved = rec.effectSeverity === 'mejoria';
                    return (
                      <div
                        key={rec.id}
                        className={`rounded-xl border p-3 text-xs space-y-1.5 ${
                          isAdverse
                            ? 'bg-rose-50 border-rose-300'
                            : isImproved
                            ? 'bg-[#E4F1E8]/60 border-[#72A98A]'
                            : 'bg-[#F8FBF9] border-[#E2EAE4]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#263A32] flex items-center gap-1.5 min-w-0">
                            {isAdverse ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                            ) : isImproved ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                            )}
                            <span className="truncate">
                              {rec.drug} · {rec.dose}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-[#718078] shrink-0">
                            {rec.appliedAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#55685F] leading-snug">
                          {rec.physiologicalEffectSummary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Live Patient Revaluation Chat (7 cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-[500px] h-[560px] lg:h-full lg:min-h-0 bg-white rounded-2xl border border-[#E2EAE4] shadow-[0_1px_3px_rgba(38,58,50,0.04)] overflow-hidden">
            <div className="px-4 py-3 bg-[#F8FBF9] border-b border-[#E2EAE4] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#E4F1E8] border border-[#72A98A]/50 flex items-center justify-center text-[#1F4B3A] shrink-0">
                  {renderPatientAvatarIcon('w-4 h-4')}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#263A32] truncate">
                  2. Conversación de Revaloración con {caseData.patientInfo.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !ttsEnabled;
                  setTtsEnabled(next);
                  onToggleTts?.(next);
                }}
                className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors shrink-0 cursor-pointer ${
                  ttsEnabled
                    ? 'bg-[#43866B] border-[#43866B] text-white'
                    : 'bg-white border-[#E2EAE4] text-[#55685F] hover:text-[#263A32] hover:border-[#72A98A]'
                }`}
                title="Activar o desactivar voz del paciente"
              >
                {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-semibold hidden sm:inline">Voz</span>
              </button>
            </div>

            {/* Shared Consultation + STAT Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#F8FBF9]/60"
            >
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      className="mx-auto max-w-xl bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 text-[11px] text-amber-950 flex items-start gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-amber-900">Aplicación STAT ({msg.timestamp}): </span>
                        <span className="text-amber-900">{msg.text}</span>
                      </div>
                    </div>
                  );
                }

                const isDoctor = msg.sender === 'doctor';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 sm:gap-2.5 ${
                      isDoctor ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isDoctor && (
                      <div className="w-8 h-8 rounded-full bg-[#E4F1E8] border border-[#72A98A] flex items-center justify-center text-[#1F4B3A] shrink-0 mt-0.5">
                        {renderPatientAvatarIcon('w-4 h-4')}
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed break-words shadow-xs ${
                        isDoctor
                          ? 'bg-[#43866B] text-white rounded-tr-sm'
                          : 'bg-white border border-[#E2EAE4] text-[#263A32] rounded-tl-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px]">
                        <span className={isDoctor ? 'text-[#E4F1E8] font-bold uppercase' : 'text-[#43866B] font-bold uppercase'}>
                          {isDoctor ? 'Usted (Médico)' : `${caseData.patientInfo.name} · Paciente`}
                        </span>
                        <span className={isDoctor ? 'text-[#E4F1E8]/80 font-mono' : 'text-[#718078] font-mono'}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>

                    {isDoctor && (
                      <div className="w-8 h-8 rounded-full bg-[#43866B] border border-[#356D56] flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E4F1E8] border border-[#72A98A] flex items-center justify-center text-[#1F4B3A] shrink-0">
                    {renderPatientAvatarIcon('w-4 h-4')}
                  </div>
                  <div className="bg-white border border-[#E2EAE4] rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs text-[#55685F] flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#43866B] animate-spin shrink-0" />
                    <span>El paciente está respondiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Unconscious / Deceased Notice in Revaluation Chat */}
            {isDeceased ? (
              <div className="bg-rose-50 border-t border-rose-300 px-3.5 py-2.5 text-[11px] text-rose-900 flex items-center gap-2 shrink-0">
                <Skull className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  <strong>PACIENTE FALLECIDO (ASISTOLIA):</strong> No hay respuesta verbal ni neurológica.
                </span>
              </div>
            ) : isUnconscious ? (
              <div className="bg-rose-50 border-t border-rose-300 px-3.5 py-2.5 text-[11px] text-rose-900 flex items-center gap-2 shrink-0">
                <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  <strong>Paciente inconsciente (Glasgow {liveVitals.glasgow}/15):</strong> No responde preguntas hasta que logre estabilizarlo o revertir la toxicidad con un antídoto STAT en el panel izquierdo.
                </span>
              </div>
            ) : null}

            {/* Suggested Post-STAT Prompts */}
            {isExamenMode ? (
              <div className="bg-amber-50 border-t border-amber-200 px-3.5 py-2 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Modo Examen: formule directamente sus preguntas de revaloración.</span>
              </div>
            ) : (
              <div className="bg-[#F8FBF9] border-t border-[#E2EAE4] px-3 py-2 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                  {POST_STAT_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isChatLoading || isChatBlocked}
                      onClick={() => void onSendMessage(q)}
                      className="min-h-[34px] px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#E4F1E8] text-[#263A32] hover:text-[#1F4B3A] text-xs border border-[#E2EAE4] hover:border-[#72A98A] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                    >
                      <MessageCircleQuestion className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={handleSendChat}
              className="p-2.5 sm:p-3 bg-white border-t border-[#E2EAE4] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  isDeceased
                    ? 'Paciente fallecido — sin respuesta'
                    : isUnconscious
                      ? `Paciente inconsciente (Glasgow ${liveVitals.glasgow}/15) — administre rescate o antídoto arriba`
                      : 'Pregunte al paciente cómo se siente después del tratamiento STAT...'
                }
                disabled={isChatLoading || isChatBlocked}
                className="flex-1 min-w-0 min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#43866B]/15 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading || isChatBlocked}
                className="min-h-[42px] px-3.5 sm:px-4 py-2 bg-[#43866B] hover:bg-[#356D56] disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span className="hidden sm:inline">Enviar</span>
                <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
                <Send className="w-4 h-4 sm:hidden" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
