import React from 'react';
import {
  ClinicalCase,
  ClinicalEvolutionState,
  StatInterventionRecord,
  VitalSigns,
} from '../types/clinical';
import {
  DisclosedBackgroundSections,
  countDisclosedBackgroundSections,
} from '../utils/backgroundDisclosure';
import {
  FileText,
  ShieldAlert,
  Pill,
  Scissors,
  Users,
  Home,
  AlertCircle,
  Activity,
  AlertTriangle,
  Skull,
  Syringe,
  Lock,
  MessageSquare,
} from 'lucide-react';

interface BackgroundTabProps {
  caseData: ClinicalCase;
  liveVitals?: VitalSigns;
  statInterventions?: StatInterventionRecord[];
  evolutionState?: ClinicalEvolutionState;
  isDeceased?: boolean;
  disclosed?: DisclosedBackgroundSections;
  onGoToAnamnesis?: () => void;
  onUnlockEmergencyChart?: () => void;
  emergencyChartUnlocked?: boolean;
}

export const BackgroundTab: React.FC<BackgroundTabProps> = ({
  caseData,
  liveVitals,
  statInterventions = [],
  evolutionState,
  isDeceased = false,
  disclosed,
  onGoToAnamnesis,
  onUnlockEmergencyChart,
  emergencyChartUnlocked = false,
}) => {
  const { background } = caseData;
  const resolvedDisclosed: DisclosedBackgroundSections = disclosed || {
    pathological: true,
    nonPathological: true,
    family: true,
    surgical: true,
    currentMedications: true,
    allergies: true,
  };
  const disclosedCount = countDisclosedBackgroundSections(resolvedDisclosed);
  const currentGlasgow = liveVitals?.glasgow ?? caseData.vitalSigns.glasgow;
  const isUnconscious = isDeceased || currentGlasgow <= 9;
  const hasLiveRecord =
    statInterventions.length > 0 ||
    isDeceased ||
    Boolean(evolutionState && evolutionState.trajectory !== 'estable');

  const allergicEvents = statInterventions.filter(
    (s) => s.effectSeverity === 'reaccion_adversa' || s.isImmediateDeath
  );

  const renderLockedNotice = (topicLabel: string) => (
    <div className="rounded-lg bg-[#F8FBF9] border border-[#E2EAE4] p-3 text-xs text-[#55685F] space-y-2">
      <div className="flex items-center gap-2 text-[#263A32] font-semibold">
        <Lock className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
        <span>Información aún no interrogada ({topicLabel}).</span>
      </div>
      <p className="text-[11px] text-[#718078] leading-relaxed">
        Interrogue este apartado al paciente en la pestaña <strong>Anamnesis</strong> para documentarlo en el expediente.
      </p>
      {onGoToAnamnesis && !isUnconscious && (
        <button
          type="button"
          onClick={onGoToAnamnesis}
          className="inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1 rounded-md bg-[#E4F1E8] hover:bg-[#D4E8DA] text-[#1F4B3A] border border-[#72A98A] text-[11px] font-semibold transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3 h-3 shrink-0" />
          <span>Ir a Anamnesis</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Intro Card */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#43866B] shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
              Expediente Clínico y Antecedentes del Paciente
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E4F1E8] border border-[#72A98A]/60 text-[#1F4B3A] tabular-nums">
            Recabados en Anamnesis: {disclosedCount} / 6
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#55685F] leading-relaxed">
          Los antecedentes se registran progresivamente conforme usted los interroga durante la entrevista clínica (enfermedades previas, hábitos y contactos, familia, cirugías, fármacos actuales y alergias).
        </p>
        {(() => {
          const weightKg = liveVitals?.weightKg ?? caseData.vitalSigns.weightKg;
          const heightCm = liveVitals?.heightCm ?? caseData.vitalSigns.heightCm;
          const bmi =
            typeof weightKg === 'number' && typeof heightCm === 'number' && heightCm > 0
              ? Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1))
              : null;
          if (typeof weightKg !== 'number' && typeof heightCm !== 'number') return null;
          return (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl bg-[#F8FBF9] border border-[#E2EAE4] px-3.5 py-2 text-xs text-[#55685F] tabular-nums">
              <span className="font-bold text-[#1F4B3A]">Somatometría de ingreso:</span>
              {typeof weightKg === 'number' && (
                <span>
                  Peso: <strong className="text-[#263A32]">{weightKg} kg</strong>
                </span>
              )}
              {typeof heightCm === 'number' && (
                <span>
                  Talla: <strong className="text-[#263A32]">{heightCm} cm</strong> ({(heightCm / 100).toFixed(2)} m)
                </span>
              )}
              {bmi !== null && (
                <span>
                  IMC: <strong className="text-[#263A32]">{bmi} kg/m²</strong>
                </span>
              )}
            </div>
          );
        })()}
        {isUnconscious && !emergencyChartUnlocked && disclosedCount < 6 && onUnlockEmergencyChart && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#E2EAE4]">
            <span className="text-xs text-amber-900">
              Paciente sin respuesta verbal (Glasgow {currentGlasgow}/15). Puede revisar la cartera médica o expediente previo de urgencias.
            </span>
            <button
              type="button"
              onClick={onUnlockEmergencyChart}
              className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Consultar Ficha de Emergencia
            </button>
          </div>
        )}
      </div>

      {/* Live Encounter Log: Evolution, STAT Interventions & Iatrogenic Events */}
      {hasLiveRecord && (
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)] space-y-3 ${
            isDeceased || allergicEvents.length > 0
              ? 'bg-rose-50/70 border-rose-300'
              : 'bg-white border-sky-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2EAE4] pb-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#263A32]">
              {isDeceased ? (
                <Skull className="w-4 h-4 text-rose-700 shrink-0" />
              ) : allergicEvents.length > 0 ? (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-sky-700 shrink-0" />
              )}
              <span>
                Registro de Evolución, Intervenciones STAT y Eventos Adversos en Curso
              </span>
            </div>

            {liveVitals && (
              <div className="font-mono tabular-nums text-[11px] text-[#263A32] bg-[#F8FBF9] border border-[#E2EAE4] px-2.5 py-1 rounded-md">
                {isDeceased
                  ? 'FALLECIDO · ASISTOLIA · PA 0/0 mmHg · FC 0 lpm · Glasgow 3/15'
                  : `PA ${liveVitals.bloodPressure} · FC ${liveVitals.heartRate} lpm · FR ${liveVitals.respiratoryRate} · SpO₂ ${liveVitals.oxygenSaturation}%${typeof liveVitals.bloodGlucose === 'number' ? ` · Gluc ${liveVitals.bloodGlucose}` : ''} · Glasgow ${liveVitals.glasgow}/15`}
              </div>
            )}
          </div>

          {evolutionState?.summaryNote && (
            <div className="text-xs text-[#263A32] bg-sky-50 border border-sky-200 rounded-lg px-3 py-2">
              <span className="font-bold text-sky-900">Nota de Evolución Clínica: </span>
              <span>{evolutionState.summaryNote}</span>
            </div>
          )}

          {allergicEvents.length > 0 && (
            <div className="bg-rose-50 border border-rose-300 rounded-lg px-3 py-2.5 space-y-1.5">
              <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                <span>Reacciones Adversas / Eventos Iatrogénicos Documentados en Sala:</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-900">
                {allergicEvents.map((ev) => (
                  <li key={ev.id} className="leading-relaxed">
                    <span className="font-mono text-[11px] text-rose-700">[{ev.appliedAt}] </span>
                    <strong>
                      {ev.drug} ({ev.dose}, {ev.route}):
                    </strong>{' '}
                    {ev.physiologicalEffectSummary}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {statInterventions.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#55685F] flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
                <span>Bitácora de Órdenes e Intervenciones STAT ({statInterventions.length})</span>
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {statInterventions.map((st) => {
                  const sevBadge = st.isImmediateDeath
                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                    : st.effectSeverity === 'reaccion_adversa'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : st.effectSeverity === 'mejoria' || st.effectSeverity === 'parcial'
                    ? 'bg-[#E4F1E8] text-[#1F4B3A] border-[#72A98A]'
                    : 'bg-sky-50 text-sky-900 border-sky-200';

                  return (
                    <div
                      key={st.id}
                      className="text-xs bg-[#F8FBF9] border border-[#E2EAE4] rounded-lg px-3 py-2 flex flex-col gap-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-[#263A32]">
                          <span className="font-mono text-[11px] text-[#55685F] mr-1.5">
                            [{st.appliedAt}]
                          </span>
                          {st.drug} — {st.dose} ({st.route})
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${sevBadge}`}>
                          {st.isImmediateDeath
                            ? 'Muerte Iatrogénica Inmediata'
                            : st.effectSeverity === 'reaccion_adversa'
                            ? 'Iatrogenia / Evento Adverso'
                            : st.effectSeverity === 'mejoria' || st.effectSeverity === 'parcial'
                            ? 'Respuesta Terapéutica'
                            : 'Registrado'}
                        </span>
                      </div>
                      <p className="text-[#263A32]">{st.physiologicalEffectSummary}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid of Background Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Antecedentes Personales Patológicos */}
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center gap-2 text-[#263A32] text-sm font-bold border-b border-[#E2EAE4] pb-2">
            <ShieldAlert className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Antecedentes Personales Patológicos</span>
          </div>
          {!resolvedDisclosed.pathological ? (
            renderLockedNotice('enfermedades previas o crónicas')
          ) : background.pathological && background.pathological.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#263A32]">
              {background.pathological.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#43866B] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#718078] italic">Sin antecedentes patológicos crónicos referidos.</p>
          )}
        </div>

        {/* Antecedentes Personales No Patológicos y Epidemiológicos */}
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center gap-2 text-[#263A32] text-sm font-bold border-b border-[#E2EAE4] pb-2">
            <Home className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Antecedentes No Patológicos & Epidemiología</span>
          </div>
          {!resolvedDisclosed.nonPathological ? (
            renderLockedNotice('ocupación, hábitos, viajes o contactos')
          ) : background.nonPathological && background.nonPathological.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#263A32]">
              {background.nonPathological.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#43866B] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#718078] italic">No se refieren exposiciones relevantes.</p>
          )}
        </div>

        {/* Antecedentes Heredofamiliares */}
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center gap-2 text-[#263A32] text-sm font-bold border-b border-[#E2EAE4] pb-2">
            <Users className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Antecedentes Heredofamiliares</span>
          </div>
          {!resolvedDisclosed.family ? (
            renderLockedNotice('antecedentes familiares o convivientes')
          ) : background.family && background.family.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#263A32]">
              {background.family.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#43866B] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#718078] italic">Sin antecedentes familiares de relevancia referidos.</p>
          )}
        </div>

        {/* Antecedentes Quirúrgicos */}
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center gap-2 text-[#263A32] text-sm font-bold border-b border-[#E2EAE4] pb-2">
            <Scissors className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Antecedentes Quirúrgicos y Traumáticos</span>
          </div>
          {!resolvedDisclosed.surgical ? (
            renderLockedNotice('cirugías, traumatismos u hospitalizaciones')
          ) : background.surgical && background.surgical.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#263A32]">
              {background.surgical.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#43866B] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#718078] italic">Niega intervenciones quirúrgicas previas.</p>
          )}
        </div>

        {/* Medicación Actual */}
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center gap-2 text-[#263A32] text-sm font-bold border-b border-[#E2EAE4] pb-2">
            <Pill className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Medicamentos Habituales y Automedicación</span>
          </div>
          {!resolvedDisclosed.currentMedications ? (
            renderLockedNotice('fármacos actuales o automedicación')
          ) : background.currentMedications && background.currentMedications.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#263A32]">
              {background.currentMedications.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#43866B] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#718078] italic">Niega consumo habitual de fármacos.</p>
          )}
        </div>

        {/* Alergias Medicamentosas */}
        <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center gap-2 text-rose-800 text-sm font-bold border-b border-[#E2EAE4] pb-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Alergias Medicamentosas & Reacciones Adversas</span>
          </div>
          {!resolvedDisclosed.allergies ? (
            renderLockedNotice('alergias a fármacos o alimentos')
          ) : background.allergies && background.allergies.length > 0 ? (
            <ul className="space-y-2 text-xs sm:text-sm text-[#263A32]">
              {background.allergies.map((item, idx) => {
                const isNoAllergy = item.toLowerCase().includes('sin alergias') || item.toLowerCase().includes('niega alerg');
                return (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={isNoAllergy ? 'text-[#43866B] font-bold' : 'text-rose-600 font-bold'}>
                      {isNoAllergy ? '·' : '!'}
                    </span>
                    <span className={isNoAllergy ? 'text-[#263A32]' : 'font-semibold text-rose-800'}>
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-[#718078] italic">Sin alergias conocidas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
