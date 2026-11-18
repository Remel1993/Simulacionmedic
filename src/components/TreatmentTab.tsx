import React, { useState, useEffect, useRef } from 'react';
import { Pill, Plus, Trash2, Hospital, Stethoscope, AlertTriangle } from 'lucide-react';
import { GameMode, MedicationItem } from '../types/clinical';
import { HospitalSelect } from './HospitalSelect';
import { MedicationSuggestion, searchMedicationSuggestions } from '../utils/medicationCatalog';

interface TreatmentTabProps {
  medications: MedicationItem[];
  setMedications: (meds: MedicationItem[]) => void;
  generalMeasures: string;
  setGeneralMeasures: (val: string) => void;
  hospitalizationDecision: string;
  setHospitalizationDecision: (val: string) => void;
  referralCriteria: string;
  setReferralCriteria: (val: string) => void;
  followUpPlan: string;
  setFollowUpPlan: (val: string) => void;
  onPendingDraftChange?: (draft?: MedicationItem) => void;
  isEcoeMode?: boolean;
  gameMode?: GameMode;
  patientAge?: number;
  patientWeightKg?: number;
}

export const TreatmentTab: React.FC<TreatmentTabProps> = ({
  medications,
  setMedications,
  generalMeasures,
  setGeneralMeasures,
  hospitalizationDecision,
  setHospitalizationDecision,
  referralCriteria,
  setReferralCriteria,
  followUpPlan,
  setFollowUpPlan,
  onPendingDraftChange,
  isEcoeMode = false,
  gameMode = 'medico_general',
  patientAge,
  patientWeightKg,
}) => {
  const [newDrug, setNewDrug] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newRoute, setNewRoute] = useState('Intravenosa (IV)');
  const [newFrequency, setNewFrequency] = useState('Cada 8 horas');
  const [newDuration, setNewDuration] = useState('7 días');
  const [newPhase, setNewPhase] = useState<'stat_urgencias' | 'ambulatorio_definitivo'>('ambulatorio_definitivo');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const allowAutocomplete =
    !isEcoeMode && (gameMode === 'principiante' || gameMode === 'medico_general');
  const drugSuggestions = allowAutocomplete ? searchMedicationSuggestions(newDrug, 7) : [];

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelectSuggestion = (sug: MedicationSuggestion) => {
    setNewDrug(sug.drug);
    if (!newDose.trim()) setNewDose(sug.doseHint);
    if (sug.routeHint) setNewRoute(sug.routeHint);
    if (sug.frequencyHint) setNewFrequency(sug.frequencyHint);
    if (sug.durationHint) setNewDuration(sug.durationHint);
    setShowSuggestions(false);
  };

  const handlePhaseChange = (phase: 'stat_urgencias' | 'ambulatorio_definitivo') => {
    setNewPhase(phase);
    if (phase === 'stat_urgencias') {
      setNewRoute('Intravenosa (IV)');
      setNewFrequency('Dosis única STAT');
      setNewDuration('Inmediato (Urgencias)');
    } else {
      setNewRoute('Oral (VO)');
      setNewFrequency('Cada 8 horas');
      setNewDuration('7 días');
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrug.trim()) return;

    const newItem: MedicationItem = {
      id: `med-${Date.now()}`,
      drug: newDrug.trim(),
      dose: newDose.trim() || 'Dosis terapéutica estándar',
      route: newRoute,
      frequency: newFrequency,
      duration: newDuration,
      phase: newPhase,
    };

    setMedications([...medications, newItem]);
    setNewDrug('');
    setNewDose('');
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  useEffect(() => {
    if (!onPendingDraftChange) return;
    if (!newDrug.trim()) {
      onPendingDraftChange(undefined);
      return;
    }
    onPendingDraftChange({
      id: 'med-pending-draft',
      drug: newDrug.trim(),
      dose: newDose.trim() || 'Dosis terapéutica estándar',
      route: newRoute,
      frequency: newFrequency,
      duration: newDuration,
      phase: newPhase,
    });
  }, [newDrug, newDose, newRoute, newFrequency, newDuration, newPhase, onPendingDraftChange]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Intro Card */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-5 h-5 text-[#43866B] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
            Plan Terapéutico Integral & Conducta Médica
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#55685F] leading-relaxed">
          {isEcoeMode
            ? 'Establezca el régimen farmacológico específico (fármacos, dosis, vías, frecuencias), las medidas generales de soporte, el nivel de hospitalización, los criterios de referencia y el plan de seguimiento y alta según guías clínicas vigentes.'
            : 'Establezca el régimen farmacológico específico (fármacos, dosis, vías, frecuencias), las medidas generales de soporte y la conducta o destino clínico según guías clínicas vigentes.'}
        </p>
      </div>

      {/* 1. Tratamiento Farmacológico Dinámico */}
      <div className="bg-white border border-[#72A98A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_2px_8px_rgba(67,134,107,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-3">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-[#43866B] flex items-center gap-2">
              <Pill className="w-4 h-4 shrink-0" />
              <span>1. Tratamiento Farmacológico Propuesto *</span>
            </label>
            {(typeof patientAge === 'number' || (typeof patientWeightKg === 'number' && patientWeightKg > 0)) && (
              <p className="text-[11px] text-[#55685F] tabular-nums">
                {typeof patientAge === 'number' && patientAge < 12 ? (
                  <>
                    Paciente pediátrico ({patientAge} años)
                    <span aria-hidden="true"> · </span>
                    Peso de referencia:{' '}
                    {typeof patientWeightKg === 'number' && patientWeightKg > 0
                      ? `${patientWeightKg} kg`
                      : `~${patientAge < 1 ? 7 : Math.max(8, patientAge * 2 + 8)} kg (estimado)`}
                    <span aria-hidden="true"> · </span>
                    Verifique cálculo en mg/kg y dosis máxima
                  </>
                ) : (
                  <>
                    {typeof patientWeightKg === 'number' && patientWeightKg > 0
                      ? `Peso registrado: ${patientWeightKg} kg · `
                      : ''}
                    {typeof patientAge === 'number' && patientAge >= 65
                      ? `Adulto mayor (${patientAge} años) · `
                      : ''}
                    Precise dosis, vía, frecuencia, duración y ajuste renal/hepático si aplica
                  </>
                )}
              </p>
            )}
          </div>
          <span className="text-xs text-[#55685F] font-semibold tabular-nums">Puntaje: 15 pts</span>
        </div>

        {/* Medications: Mobile Cards + Desktop Table */}
        {medications.length > 0 ? (
          <>
            <div className="md:hidden space-y-2.5">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3.5 space-y-1.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-[#263A32] text-sm">
                      {med.drug}
                      {(med.id.startsWith('med-stat-') || med.phase === 'stat_urgencias') ? (
                        <span className="ml-2 text-[11px] font-bold text-amber-800">
                          · STAT / Urgencias
                        </span>
                      ) : (
                        <span className="ml-2 text-[11px] font-semibold text-[#43866B]">
                          · Definitivo / Ambulatorio
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => handleRemoveMedication(med.id)}
                      className="text-[#718078] hover:text-rose-700 p-1.5 shrink-0 cursor-pointer"
                      title="Eliminar fármaco"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                    <div>
                      <span className="text-[#55685F]">Dosis: </span>
                      <span className="text-[#263A32] font-semibold">{med.dose}</span>
                    </div>
                    <div>
                      <span className="text-[#55685F]">Vía: </span>
                      <span className="text-[#43866B] font-semibold">{med.route}</span>
                    </div>
                    <div>
                      <span className="text-[#55685F]">Frecuencia: </span>
                      <span className="text-[#263A32]">{med.frequency}</span>
                    </div>
                    <div>
                      <span className="text-[#55685F]">Duración: </span>
                      <span className="text-[#55685F]">{med.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2EAE4] text-[#55685F] text-[11px] font-semibold">
                    <th className="py-2.5 px-3">Fármaco / Principio Activo</th>
                    <th className="py-2.5 px-3">Dosis</th>
                    <th className="py-2.5 px-3">Vía</th>
                    <th className="py-2.5 px-3">Frecuencia</th>
                    <th className="py-2.5 px-3">Duración</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EAE4] font-sans">
                  {medications.map((med) => (
                    <tr key={med.id} className="hover:bg-[#F8FBF9]">
                      <td className="py-3 px-3 font-semibold text-[#263A32]">
                        {med.drug}
                        {(med.id.startsWith('med-stat-') || med.phase === 'stat_urgencias') ? (
                          <span className="ml-2 text-[11px] font-bold text-amber-800">
                            · STAT / Urgencias
                          </span>
                        ) : (
                          <span className="ml-2 text-[11px] font-semibold text-[#43866B]">
                            · Definitivo
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#263A32]">{med.dose}</td>
                      <td className="py-3 px-3 text-[#43866B] font-medium">{med.route}</td>
                      <td className="py-3 px-3 text-[#263A32]">{med.frequency}</td>
                      <td className="py-3 px-3 text-[#55685F]">{med.duration}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleRemoveMedication(med.id)}
                          className="text-[#718078] hover:text-rose-700 p-1 transition-colors cursor-pointer"
                          title="Eliminar fármaco"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-xs text-[#718078] italic p-4 bg-[#F8FBF9] rounded-xl border border-[#E2EAE4]">
            No se han agregado fármacos al esquema. Utilice el formulario inferior para recetar soluciones, analgésicos, antibióticos o medicamentos específicos.
          </div>
        )}

        {/* Add Medication Form */}
        <form
          onSubmit={handleAddMedication}
          className="bg-[#F8FBF9] p-3.5 sm:p-4 rounded-xl border border-[#E2EAE4] space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-bold text-[#263A32]">
              Prescribir Nuevo Fármaco o Infusión:
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePhaseChange('stat_urgencias')}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                  newPhase === 'stat_urgencias'
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-white border-[#E2EAE4] text-[#55685F] hover:text-[#263A32]'
                }`}
              >
                STAT / Urgencias
              </button>
              <button
                type="button"
                onClick={() => handlePhaseChange('ambulatorio_definitivo')}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                  newPhase === 'ambulatorio_definitivo'
                    ? 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A]'
                    : 'bg-white border-[#E2EAE4] text-[#55685F] hover:text-[#263A32]'
                }`}
              >
                Definitivo / Ambulatorio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div ref={autocompleteRef} className="relative">
              <label className="text-[11px] font-medium text-[#55685F] block mb-1">
                Nombre del Medicamento *
              </label>
              <input
                type="text"
                value={newDrug}
                onFocus={() => allowAutocomplete && setShowSuggestions(true)}
                onChange={(e) => {
                  setNewDrug(e.target.value);
                  if (allowAutocomplete) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setShowSuggestions(false);
                }}
                placeholder={
                  allowAutocomplete
                    ? 'Escribe principio activo...'
                    : 'Fármaco o solución...'
                }
                autoComplete="off"
                className="w-full min-h-[40px] bg-white border border-[#E2EAE4] rounded-lg px-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
              />
              {allowAutocomplete && showSuggestions && drugSuggestions.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Sugerencias de vademécum offline"
                  className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#CFE4D6] rounded-xl shadow-lg max-h-56 overflow-y-auto py-1"
                >
                  {drugSuggestions.map((sug) => (
                    <button
                      key={sug.drug}
                      type="button"
                      onClick={() => handleSelectSuggestion(sug)}
                      className="w-full text-left px-3 py-2 hover:bg-[#E4F1E8] transition-colors cursor-pointer border-b border-[#F3F7F4] last:border-b-0"
                    >
                      <div className="text-xs font-bold text-[#263A32]">{sug.drug}</div>
                      <div className="text-[10px] text-[#55685F] truncate">
                        Ref: {sug.doseHint} · {sug.routeHint} · {sug.frequencyHint}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#55685F] block mb-1">Dosis Exacta *</label>
              <input
                type="text"
                value={newDose}
                onChange={(e) => setNewDose(e.target.value)}
                placeholder="Dosis (mg, g, mL/kg/h)..."
                className="w-full min-h-[40px] bg-white border border-[#E2EAE4] rounded-lg px-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#55685F] block mb-1">Vía de Administración</label>
              <HospitalSelect
                variant="compact"
                panelTitle="Vía de Administración"
                value={newRoute}
                onChange={setNewRoute}
                options={[
                  { value: 'Intravenosa (IV)', label: 'Intravenosa (IV)' },
                  { value: 'Oral (VO)', label: 'Oral (VO)' },
                  { value: 'Subcutánea (SC)', label: 'Subcutánea (SC)' },
                  { value: 'Inhalatoria', label: 'Inhalatoria' },
                  { value: 'Intramuscular (IM)', label: 'Intramuscular (IM)' },
                  { value: 'Sublingual (SL)', label: 'Sublingual (SL)' },
                  { value: 'Tópica', label: 'Tópica' },
                ]}
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#55685F] block mb-1">Frecuencia</label>
              <input
                type="text"
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                placeholder="Ej. c/8h, infusión..."
                className="w-full min-h-[40px] bg-white border border-[#E2EAE4] rounded-lg px-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#55685F] block mb-1">Duración</label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="Duración del esquema..."
                className="w-full min-h-[40px] bg-white border border-[#E2EAE4] rounded-lg px-3 py-2 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            {newDrug.trim() ? (
              <span className="text-[11px] text-amber-800">
                Borrador detectado: se agregará automáticamente al esquema al enviar si aún no pulsó «Agregar».
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={!newDrug.trim()}
              className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 bg-[#43866B] hover:bg-[#356D56] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Agregar al Esquema</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Medidas Generales y de Soporte */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
        <label className="text-xs font-bold text-[#263A32] block">
          2. Medidas Generales y de Soporte (No farmacológicas) *
        </label>
        <textarea
          rows={3}
          value={generalMeasures}
          onChange={(e) => setGeneralMeasures(e.target.value)}
          placeholder="Especifique medidas no farmacológicas, monitorización, dieta o ayuno, posición del paciente y cuidados generales..."
          className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 text-xs sm:text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
        />
      </div>

      {/* 3. Nivel de Atención / Destino Clínico (sin pistas) */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-[#263A32] flex items-center gap-2">
            <Hospital className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>3. Conducta y Destino Clínico *</span>
          </label>
          <span className="text-xs text-[#55685F] font-medium">
            {isEcoeMode
              ? hospitalizationDecision
                ? '3 pts de destino (5 pts total con ref./seguimiento)'
                : 'Seleccione una opción · 3 pts'
              : hospitalizationDecision
                ? 'Destino seleccionado · 5 pts'
                : 'Seleccione una opción · 5 pts'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            {
              id: 'Ambulatorio',
              label: 'Manejo Ambulatorio',
            },
            {
              id: 'Observación Urgencias',
              label: 'Observación Urgencias',
            },
            {
              id: 'Hospitalización en Sala',
              label: 'Hospitalización en Sala',
            },
            {
              id: 'Quirófano / Cirugía de Urgencia',
              label: 'Quirófano / Cirugía de Urgencia',
            },
            {
              id: 'Unidad de Cuidados Intensivos (UCI)',
              label: 'Unidad de Cuidados Intensivos (UCI)',
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setHospitalizationDecision(opt.id)}
              className={`min-h-[48px] p-3.5 rounded-xl border text-center sm:text-left flex items-center justify-center sm:justify-start transition-all cursor-pointer ${
                hospitalizationDecision === opt.id
                  ? 'bg-[#E4F1E8] border-[#43866B] text-[#1F4B3A] shadow-xs ring-1 ring-[#43866B]/30'
                  : 'bg-[#F8FBF9] border-[#E2EAE4] text-[#263A32] hover:border-[#72A98A] hover:bg-white'
              }`}
            >
              <div className="text-xs font-bold">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Criterios de Referencia y Seguimiento (Solo en Modo ECOE) */}
      {isEcoeMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-2 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
            <label className="text-xs font-bold text-[#263A32] block">
              4. Criterios de Referencia / Interconsulta
            </label>
            <textarea
              rows={3}
              value={referralCriteria}
              onChange={(e) => setReferralCriteria(e.target.value)}
              placeholder="Indique criterios de gravedad para interconsulta especializada o derivación de urgencia..."
              className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
            />
          </div>

          <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-2 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
            <label className="text-xs font-bold text-[#263A32] block">
              5. Plan de Seguimiento y Criterios de Alta
            </label>
            <textarea
              rows={3}
              value={followUpPlan}
              onChange={(e) => setFollowUpPlan(e.target.value)}
              placeholder="Describa los parámetros de vigilancia clínica y metas de respuesta terapéutica esperada..."
              className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3 text-xs text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B]"
            />
          </div>
        </div>
      )}

      {/* Safety alert warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-950">Auditoría de Seguridad del Paciente:</span>
          <p className="mt-0.5 leading-relaxed">
            Al enviar su respuesta desde el panel «Tu Decisión», el tribunal docente contrastará su plan con la normativa nacional (MINSA / LBM) y guías internacionales vigentes (OMS, OPS, AHA, NICE), e inspeccionará posibles errores peligrosos.
          </p>
        </div>
      </div>
    </div>
  );
};
