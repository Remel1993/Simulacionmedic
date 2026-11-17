import React, { useState } from 'react';
import { Target, Plus, Trash2, Brain, AlertCircle } from 'lucide-react';

interface DiagnosticTabProps {
  primaryDiagnosis: string;
  setPrimaryDiagnosis: (val: string) => void;
  differentialDiagnoses: string[];
  setDifferentialDiagnoses: (val: string[]) => void;
  clinicalJustification: string;
  setClinicalJustification: (val: string) => void;
  isEcoeMode?: boolean;
}

export const DiagnosticTab: React.FC<DiagnosticTabProps> = ({
  primaryDiagnosis,
  setPrimaryDiagnosis,
  differentialDiagnoses,
  setDifferentialDiagnoses,
  clinicalJustification,
  setClinicalJustification,
  isEcoeMode = false,
}) => {
  const [newDiffText, setNewDiffText] = useState('');

  const handleAddDifferential = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newDiffText.trim()) return;
    setDifferentialDiagnoses([...differentialDiagnoses, newDiffText.trim()]);
    setNewDiffText('');
  };

  const handleRemoveDifferential = (index: number) => {
    setDifferentialDiagnoses(differentialDiagnoses.filter((_, idx) => idx !== index));
  };

  const isFormComplete =
    primaryDiagnosis.trim().length > 3 &&
    (!isEcoeMode || (differentialDiagnoses.length >= 1 && clinicalJustification.trim().length > 10));

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Intro Card */}
      <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-[#43866B] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#263A32] tracking-tight">
            {isEcoeMode ? 'Razonamiento Diagnóstico & Diferenciales' : 'Razonamiento Diagnóstico'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#55685F] leading-relaxed">
          {isEcoeMode
            ? 'Sintetice los datos obtenidos del interrogatorio, exploración física y paraclínicos para fundamentar su diagnóstico principal y descartar patologías competidoras.'
            : 'Sintetice los datos obtenidos del interrogatorio, exploración física y paraclínicos para fundamentar su diagnóstico principal.'}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Diagnóstico Principal — Highlighted Decision Card */}
        <div className="bg-white border border-[#72A98A] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_2px_8px_rgba(67,134,107,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-[#43866B] flex items-center gap-1.5">
              <Target className="w-4 h-4 shrink-0" />
              <span>
                {isEcoeMode ? '1. ' : ''}Diagnóstico Principal Presuntivo o Definitivo *
              </span>
            </label>
            <span className="text-xs text-[#55685F] font-semibold tabular-nums">Puntaje: 25 pts</span>
          </div>
          <input
            type="text"
            value={primaryDiagnosis}
            onChange={(e) => setPrimaryDiagnosis(e.target.value)}
            placeholder="Escriba el diagnóstico presuntivo o definitivo formulado..."
            className="w-full min-h-[44px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
          />
          <p className="text-xs text-[#718078] italic">
            Especifique el diagnóstico con la mayor precisión clínica posible (incluya subtipo, severidad o fase si corresponde).
          </p>
        </div>

        {/* Diagnósticos Diferenciales (Solo en Modo ECOE) */}
        {isEcoeMode && (
          <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-[#263A32]">
                2. Diagnósticos Diferenciales (Mín. 2 recomendados) *
              </label>
              <span className="text-xs text-[#55685F] font-semibold tabular-nums">Puntaje: 10 pts</span>
            </div>

            {differentialDiagnoses.length > 0 ? (
              <div className="space-y-2">
                {differentialDiagnoses.map((diff, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 bg-[#F8FBF9] px-3.5 py-2.5 rounded-xl border border-[#E2EAE4] text-xs sm:text-sm text-[#263A32]"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[#43866B] font-bold font-mono shrink-0">#{index + 1}</span>
                      <span className="break-words">{diff}</span>
                    </span>
                    <button
                      onClick={() => handleRemoveDifferential(index)}
                      className="text-[#718078] hover:text-rose-700 transition-colors p-1.5 shrink-0 cursor-pointer"
                      title="Eliminar diagnóstico diferencial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#718078] italic p-3 bg-[#F8FBF9] rounded-xl border border-[#E2EAE4]">
                Aún no ha agregado diagnósticos diferenciales. Agregue al menos 2 diagnósticos competidores.
              </div>
            )}

            {/* Add Differential Input Form */}
            <form onSubmit={handleAddDifferential} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <input
                type="text"
                value={newDiffText}
                onChange={(e) => setNewDiffText(e.target.value)}
                placeholder="Escriba un diagnóstico diferencial a descartar..."
                className="flex-1 min-w-0 min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
              />
              <button
                type="submit"
                disabled={!newDiffText.trim()}
                className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 bg-[#43866B] hover:bg-[#356D56] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Agregar Diferencial</span>
              </button>
            </form>
          </div>
        )}

        {/* Justificación Clínica & Razonamiento (Solo en Modo ECOE) */}
        {isEcoeMode && (
          <div className="bg-white border border-[#E2EAE4] rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
            <label className="text-xs font-bold text-[#263A32] block">
              3. Justificación Clínica y Razonamiento Fisiopatológico *
            </label>
            <textarea
              rows={4}
              value={clinicalJustification}
              onChange={(e) => setClinicalJustification(e.target.value)}
              placeholder="Fundamente su razonamiento clínico integrando los hallazgos del interrogatorio, signos y maniobras del examen físico, paraclínicos y la fisiopatología que descarta los diagnósticos diferenciales..."
              className="w-full bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl p-3.5 text-xs sm:text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8]"
            />
            <p className="text-xs text-[#718078] italic">
              El tribunal evaluará la calidad analítica de su razonamiento, no solo la coincidencia del nombre del diagnóstico.
            </p>
          </div>
        )}

        {/* Completion Hint */}
        {!isFormComplete && (
          <div className="flex items-start sm:items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0 text-amber-700" />
            <span>
              {isEcoeMode
                ? 'Complete el diagnóstico principal, al menos 1 diferencial y la justificación para avanzar.'
                : 'Complete el diagnóstico principal para avanzar.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
