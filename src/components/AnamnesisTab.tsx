import React, { useState, useRef, useEffect } from 'react';
import {
  UserRound,
  Baby,
  Stethoscope,
  Sparkles,
  Volume2,
  VolumeX,
  CornerDownLeft,
  Send,
  ClipboardCheck,
  MessageCircleQuestion,
  HeartPulse,
  Zap,
  AlertOctagon,
  Skull,
} from 'lucide-react';
import { ChatMessage, ClinicalCase, VitalSigns } from '../types/clinical';
import { PatientVisualCard } from './PatientVisualCard';

interface AnamnesisTabProps {
  caseData: ClinicalCase;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  liveVitals?: VitalSigns;
  isDeceased?: boolean;
  initialTtsEnabled?: boolean;
  onToggleTts?: (enabled: boolean) => void;
}

const COMMON_QUESTIONS = [
  '¿Desde cuándo empezaron exactamente estas molestias?',
  '¿Dónde le duele y cómo siente ese dolor (como apretón, piquete, cólico o ardor)?',
  '¿El dolor se le corre hacia alguna otra parte del cuerpo?',
  '¿Ha tenido náuseas, vómitos o se le quitó el hambre?',
  '¿Ha tenido calentura, sudor frío o escalofríos?',
  '¿Qué medicinas toma todos los días o qué se ha tomado para esto?',
  '¿Sufre de presión alta, diabetes o alguna otra enfermedad?',
  '¿A qué se dedica y qué hábitos tiene (cigarro, alcohol, comidas)?',
  '¿Lo han operado antes, ha estado internado o ha tenido fracturas?',
  '¿Alguien en su familia padece enfermedades importantes o tiene los mismos síntomas?',
  '¿Está yendo al baño normal o ha notado algún cambio en su regla o zona íntima?',
  '¿Ha salido de viaje hace poco o convivido con personas enfermas?',
  '¿Es alérgico a algún medicamento o alimento?',
];

export const AnamnesisTab: React.FC<AnamnesisTabProps> = ({
  caseData,
  messages,
  onSendMessage,
  isLoading,
  liveVitals,
  isDeceased = false,
  initialTtsEnabled = false,
  onToggleTts,
}) => {
  const [inputText, setInputText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(initialTtsEnabled);

  useEffect(() => {
    setTtsEnabled(initialTtsEnabled);
  }, [initialTtsEnabled]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const isPediatric = caseData.patientInfo.age < 12;
  const currentGlasgow = liveVitals?.glasgow ?? caseData.vitalSigns.glasgow;
  const isUnconscious = !isDeceased && currentGlasgow <= 9;
  const isChatBlocked = Boolean(isDeceased || isUnconscious);

  const renderPatientAvatarIcon = (className: string) =>
    isPediatric ? <Baby className={className} /> : <UserRound className={className} />;

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
    setInputText('');
    lastSpokenIdRef.current = messages[0]?.id ?? null;
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [caseData.id]);

  useEffect(() => {
    if (!ttsEnabled) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    const lastPatientMsg = [...messages].reverse().find((m) => m.sender === 'patient');
    if (lastPatientMsg && lastPatientMsg.id !== lastSpokenIdRef.current) {
      lastSpokenIdRef.current = lastPatientMsg.id;
      speakText(lastPatientMsg.text);
    }
  }, [messages, ttsEnabled]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    if (messages.length <= 1 && !isLoading) {
      el.scrollTop = 0;
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading || isChatBlocked) return;
    const textToSend = inputText.trim();
    setInputText('');
    await onSendMessage(textToSend);
  };

  const handleQuickQuestion = async (q: string) => {
    if (isLoading || isChatBlocked) return;
    await onSendMessage(q);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)] min-h-[480px] max-h-[780px] bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden shadow-[0_1px_3px_rgba(38,58,50,0.04)]">
      {/* Tab Header Bar */}
      <div className="px-3.5 sm:px-5 py-3 bg-[#F8FBF9] border-b border-[#E2EAE4] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <PatientVisualCard
            caseData={caseData}
            liveVitals={liveVitals}
            isDeceased={isDeceased}
            variant="thumbnail"
            className="w-10"
          />
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-[#263A32] truncate flex items-center gap-1.5">
              <span>Interrogatorio Directo al Paciente</span>
              <span className="text-xs font-normal text-[#55685F] shrink-0 tabular-nums">
                ({messages.filter((m) => m.sender === 'doctor').length} preg.)
              </span>
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = !ttsEnabled;
            setTtsEnabled(next);
            onToggleTts?.(next);
          }}
          className={`flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs rounded-lg border transition-colors shrink-0 cursor-pointer ${
            ttsEnabled
              ? 'bg-[#E4F1E8] border-[#72A98A] text-[#1F4B3A] font-semibold'
              : 'bg-white border-[#E2EAE4] text-[#55685F] hover:text-[#263A32] hover:bg-[#F3F7F4]'
          }`}
          title="Activar o desactivar síntesis de voz en español"
        >
          {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#43866B]" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-xs font-medium hidden sm:inline">Voz del Paciente</span>
          <span className="text-xs font-medium sm:hidden">Voz</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 sm:space-y-4 bg-[#F8FBF9]/60"
      >
        {/* Initial Medical Reception System Notice */}
        <div className="bg-white border border-[#E2EAE4] rounded-xl p-3.5 text-xs text-[#55685F] max-w-2xl mx-auto text-center space-y-1.5 shadow-[0_1px_2px_rgba(38,58,50,0.03)]">
          <div className="flex items-center justify-center gap-2 font-bold text-[#263A32]">
            <ClipboardCheck className="w-4 h-4 text-[#43866B] shrink-0" />
            <span>Recepción del Paciente en Consultorio / Urgencias</span>
          </div>
          <p>
            {caseData.patientInfo.name} ({caseData.patientInfo.age} años) se encuentra en la consulta médica listo para el interrogatorio clínico.
          </p>
          <p className="text-[11px] text-[#718078]">
            Realice preguntas abiertas o minuciosas sobre cronología, síntomas, antecedentes, medicamentos, alergias o hábitos.
          </p>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                className="mx-auto max-w-xl bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2 text-[11px] text-amber-900 flex items-start gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-amber-950">Aplicación STAT ({msg.timestamp}): </span>
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          const isDoctor = msg.sender === 'doctor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3 ${isDoctor ? 'justify-end' : 'justify-start'}`}
            >
              {!isDoctor && (
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E4F1E8] border border-[#72A98A] flex items-center justify-center text-[#43866B] shadow-xs"
                    title="Paciente"
                  >
                    {renderPatientAvatarIcon('w-4 h-4 sm:w-4.5 sm:h-4.5')}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white border border-[#72A98A] flex items-center justify-center">
                    <HeartPulse className="w-2 h-2 text-[#43866B]" />
                  </span>
                </div>
              )}

              <div
                className={`min-w-0 max-w-[84%] sm:max-w-xl rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm leading-relaxed break-words ${
                  isDoctor
                    ? 'bg-[#43866B] text-white rounded-tr-sm shadow-xs'
                    : 'bg-white border border-[#E2EAE4] text-[#263A32] rounded-tl-sm shadow-[0_1px_2px_rgba(38,58,50,0.03)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[11px] font-bold truncate flex items-center gap-1 ${
                      isDoctor ? 'text-[#E4F1E8]' : 'text-[#43866B]'
                    }`}
                  >
                    {isDoctor ? (
                      <>
                        <Stethoscope className="w-3 h-3 shrink-0" />
                        <span>Usted (Médico)</span>
                      </>
                    ) : (
                      <>
                        {renderPatientAvatarIcon('w-3 h-3 shrink-0')}
                        <span>{caseData.patientInfo.name} · Paciente</span>
                      </>
                    )}
                  </span>
                  <div className={`flex items-center gap-1.5 text-[10px] shrink-0 font-mono tabular-nums ${isDoctor ? 'text-[#E4F1E8]/90' : 'text-[#718078]'}`}>
                    <span>{msg.timestamp}</span>
                    {!isDoctor && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-[#43866B] hover:text-[#263A32] ml-1 transition-colors cursor-pointer"
                        title="Escuchar respuesta"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {isDoctor && (
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#43866B] border border-[#356D56] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs"
                  title="Médico Tratante"
                >
                  <Stethoscope className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E4F1E8] border border-[#72A98A] flex items-center justify-center text-[#43866B] shrink-0 mt-0.5">
              {renderPatientAvatarIcon('w-4 h-4')}
            </div>
            <div className="bg-white border border-[#E2EAE4] rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-[#55685F] flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#43866B] animate-spin shrink-0" />
              <span>El paciente está respondiendo...</span>
            </div>
          </div>
        )}
      </div>

      {/* Unconscious / Deceased Clinical Alert Banner */}
      {isDeceased ? (
        <div className="bg-rose-50 border-t border-rose-200 px-3.5 sm:px-4 py-2.5 text-xs text-rose-900 flex items-center gap-2">
          <Skull className="w-4 h-4 text-rose-700 shrink-0" />
          <span>
            <strong>PACIENTE FALLECIDO (ASISTOLIA):</strong> El paciente perdió los signos vitales tras iatrogenia inmediata y no presenta respuesta verbal ni neurológica.
          </span>
        </div>
      ) : isUnconscious ? (
        <div className="bg-rose-50 border-t border-rose-200 px-3.5 sm:px-4 py-2.5 text-xs text-rose-900 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0" />
          <span>
            <strong>Paciente inconsciente (Glasgow {currentGlasgow}/15):</strong> Se desestabilizó gravemente y <strong>NO responde preguntas</strong>. Aplique estabilización o antídoto urgente desde <strong>Aplicación STAT</strong>.
          </span>
        </div>
      ) : null}

      {/* Suggested Quick Questions Carousel (Hidden in Modo Examen for genuine blind assessment) */}
      {caseData.mode === 'examen' ? (
        <div className="bg-amber-50 border-t border-amber-200 px-3 sm:px-4 py-2 text-[11px] text-amber-900 flex items-center gap-2">
          <ClipboardCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            <strong>Modo Examen Activo:</strong> Las preguntas sugeridas están deshabilitadas. Formule su interrogatorio directamente.
          </span>
        </div>
      ) : (
        <div className="bg-[#F8FBF9] border-t border-[#E2EAE4] px-3 sm:px-4 py-2.5">
          <div className="text-[11px] font-semibold text-[#55685F] mb-1.5 flex items-center gap-1.5">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-[#43866B] shrink-0" />
            <span>
              {caseData.mode === 'urgencias'
                ? 'Preguntas rápidas dirigidas (Urgencias — priorice signos de alarma):'
                : 'Preguntas rápidas (deslice y toque para preguntar):'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {COMMON_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                disabled={isLoading || isChatBlocked}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white hover:bg-[#E4F1E8] text-[#263A32] hover:text-[#1F4B3A] text-xs border border-[#E2EAE4] hover:border-[#72A98A] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
              >
                <MessageCircleQuestion className="w-3 h-3 text-[#43866B] shrink-0" />
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Input Box */}
      <form
        onSubmit={handleSend}
        className="p-2.5 sm:p-3.5 bg-white border-t border-[#E2EAE4] flex items-center gap-2"
      >
        <div className="w-9 h-9 rounded-lg bg-[#E4F1E8] border border-[#72A98A]/50 hidden sm:flex items-center justify-center text-[#43866B] shrink-0">
          <Stethoscope className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isDeceased
              ? 'Paciente fallecido — sin respuesta verbal posible'
              : isUnconscious
                ? `Paciente inconsciente (Glasgow ${currentGlasgow}/15) — aplique rescate STAT para reanimarlo`
                : 'Escriba su pregunta directa al paciente...'
          }
          disabled={isLoading || isChatBlocked}
          className="flex-1 min-w-0 min-h-[42px] bg-[#F8FBF9] border border-[#E2EAE4] rounded-xl px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm text-[#263A32] placeholder-[#718078] focus:outline-none focus:border-[#43866B] focus:ring-2 focus:ring-[#E4F1E8] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading || isChatBlocked}
          className="min-h-[42px] px-3.5 sm:px-4 py-2.5 bg-[#43866B] hover:bg-[#356D56] disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">Preguntar</span>
          <CornerDownLeft className="w-3.5 h-3.5 hidden sm:inline" />
          <Send className="w-4 h-4 sm:hidden" />
        </button>
      </form>
    </div>
  );
};
