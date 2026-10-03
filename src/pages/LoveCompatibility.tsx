import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { Heart, Coins, Calendar, Clock, User, RefreshCw, AlertCircle, Sparkles, Flame, Moon, Compass, Lock } from 'lucide-react';
import { ReadingViewer } from '../components/ReadingViewer';
import {
  LOVE_COMPATIBILITY_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../config/pricing';
import type { LoveSynastryReport } from '../oraculos/loveSynastryEngine';

function generateClientUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const LoveCompatibility: React.FC = () => {
  const { user, apiFetch, setUserCredits, addHistoryItem } = useApp();

  // Person 1: Authoritative from authenticated user profile (Read-only)
  const name1 = user?.fullName || '';
  const date1 = user?.birthDate || '';
  const time1 = user?.birthTime || '';

  // Person 2: User input (strictly name, birthDate, optional birthTime, NO city)
  const [name2, setName2] = useState('');
  const [date2, setDate2] = useState('');
  const [time2, setTime2] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Authoritative server-provided synastry report & reading
  const [synastryReport, setSynastryReport] = useState<LoveSynastryReport | null>(null);
  const [readingResult, setReadingResult] = useState<string | null>(null);

  // Idempotency key per analysis action (maintained on retry, refreshed on reset)
  const idempotencyKeyRef = useRef<string>(generateClientUUID());

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');

    if (!user.birthDate) {
      setErrorMsg('Seus dados natais estão incompletos em seu perfil. Por favor, atualize sua data de nascimento.');
      return;
    }

    if (user.credits < LOVE_COMPATIBILITY_COST) {
      setErrorMsg(INSUFFICIENT_CREDITS_MESSAGE);
      return;
    }

    if (!name2.trim()) {
      setErrorMsg('Por favor, informe o nome completo de solteiro da pessoa consultada.');
      return;
    }

    if (!date2.trim()) {
      setErrorMsg('Por favor, informe a data de nascimento da pessoa consultada.');
      return;
    }

    setIsLoading(true);
    try {
      // Exclusively call /api/love-compatibility (single server-side tarot draw & calculation)
      const res = await apiFetch('/api/love-compatibility', {
        method: 'POST',
        body: JSON.stringify({
          fullName2: name2.trim(),
          birthDate2: date2.trim(),
          birthTime2: time2.trim() || undefined,
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar sinastria amorosa no servidor sagrado.');
      }

      if (typeof data.newCreditsBalance === 'number') {
        setUserCredits(data.newCreditsBalance);
      }

      if (data.synastryReport) {
        setSynastryReport(data.synastryReport);
      }

      if (data.reading) {
        setReadingResult(data.reading);
      }

      const title = `Compatibilidade Amorosa: ${name1} & ${name2.trim()}`;
      addHistoryItem({
        id: data.readingRecord?.id || `compat_${Date.now()}`,
        userId: user.uid,
        type: 'compatibility',
        title,
        date: new Date().toISOString(),
        content: data.reading,
        creditsUsed: LOVE_COMPATIBILITY_COST,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao processar sinastria amorosa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSynastryReport(null);
    setReadingResult(null);
    setName2('');
    setDate2('');
    setTime2('');
    setErrorMsg('');
    idempotencyKeyRef.current = generateClientUUID();
  };

  return (
    <div id="mp_compatibility_page" className="mx-auto max-w-4xl px-4 py-8 text-white">
      {/* Title */}
      <div className="mb-8 text-center">
        <Heart className="mx-auto w-10 h-10 text-red-500 mb-2 animate-pulse" />
        <h2 className="font-serif text-2xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-[#D4AF37]">
          Compatibilidade Amorosa Sagrada
        </h2>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto mt-2">
          Cruzamento profundo entre dois mapas natais, numerologia da alma, cabala hermética, astrologia cósmica e tiragem sagrada de Tarot realizada no altar de Maria Padilha.
        </p>
      </div>

      {readingResult && synastryReport ? (
        /* RESULT VIEW */
        <motion.div
          id="compatibility_results_card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#D4AF37]/30 bg-black/80 p-6 md:p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(139,0,0,0.25)]"
        >
          <div className="text-center border-b border-gray-900 pb-4 mb-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-red-500/50 shadow-[0_0_15px_rgba(139,0,0,0.4)] mb-3">
              <img
                src="/image/Maria Padilha Logo.png"
                alt="Maria Padilha"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-lg md:text-2xl font-bold text-white mt-1">
              Sinastria Sagrada: {name1} & {name2}
            </h3>
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider">
              Análise Qualitativa de Almas e Destino Amoroso
            </span>
          </div>

          {/* Qualitative Indicators derived from actual spiritual engines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg bg-red-950/20 border border-red-900/40 p-4 text-center">
              <span className="text-gray-400 block text-[10px] uppercase font-mono">Afinidade Espiritual</span>
              <span className="text-[#D4AF37] text-2xl font-bold block mt-1">
                {synastryReport.qualitativeIndicators.spiritualAffinity.level}
              </span>
              <span className="text-xs text-gray-300 mt-1 block">
                Ressonância de Alma: {synastryReport.qualitativeIndicators.spiritualAffinity.index}%
              </span>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden mt-2 border border-gray-800">
                <div
                  className="bg-[#D4AF37] h-full rounded-full transition-all duration-700"
                  style={{ width: `${synastryReport.qualitativeIndicators.spiritualAffinity.index}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-red-950/20 border border-red-900/40 p-4 text-center">
              <span className="text-gray-400 block text-[10px] uppercase font-mono">Ressonância Afetiva</span>
              <span className="text-red-400 text-2xl font-bold block mt-1">
                {synastryReport.qualitativeIndicators.emotionalResonance.level}
              </span>
              <span className="text-xs text-gray-300 mt-1 block">
                Magnetismo Astral: {synastryReport.qualitativeIndicators.emotionalResonance.index}%
              </span>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden mt-2 border border-gray-800">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${synastryReport.qualitativeIndicators.emotionalResonance.index}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-red-950/20 border border-red-900/40 p-4 text-center">
              <span className="text-gray-400 block text-[10px] uppercase font-mono">Harmonia Prática</span>
              <span className="text-purple-300 text-2xl font-bold block mt-1">
                {synastryReport.qualitativeIndicators.practicalHarmony.level}
              </span>
              <span className="text-xs text-gray-300 mt-1 block">
                Estabilidade Terrena: {synastryReport.qualitativeIndicators.practicalHarmony.index}%
              </span>
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden mt-2 border border-gray-800">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${synastryReport.qualitativeIndicators.practicalHarmony.index}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cross Analysis Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-4">
              <h4 className="font-serif text-sm font-bold text-[#D4AF37] mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500" />
                Dinâmica Elemental
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {synastryReport.elementalDynamic.description}
              </p>
              <div className="mt-3 flex gap-2 text-[11px] text-gray-400 font-mono">
                <span>{name1}: {synastryReport.person1.astrology.sunSign} ({synastryReport.elementalDynamic.element1})</span>
                <span>•</span>
                <span>{name2}: {synastryReport.person2.astrology.sunSign} ({synastryReport.elementalDynamic.element2})</span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-4">
              <h4 className="font-serif text-sm font-bold text-[#D4AF37] mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                Cruzamento Numerológico e Cabalístico
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {synastryReport.cabalisticAlignment.pillarDynamic}
              </p>
              <div className="mt-3 flex gap-2 text-[11px] text-gray-400 font-mono">
                <span>Caminhos de Vida: {synastryReport.numerologicalResonance.lifePath1} & {synastryReport.numerologicalResonance.lifePath2}</span>
                <span>•</span>
                <span>{synastryReport.cabalisticAlignment.spiritualBondLevel}</span>
              </div>
            </div>
          </div>

          {/* Single Server Tarot Spread */}
          {synastryReport.tarotSpread.length > 0 && (
            <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4 mb-6">
              <h4 className="font-serif text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-red-400" />
                Cartas Sagradas Reveladas no Sorteio Real (Altar de Maria Padilha)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {synastryReport.tarotSpread.map((draw, idx) => (
                  <div key={idx} className="rounded bg-black/60 border border-gray-800/80 p-3 text-center">
                    <span className="text-[10px] uppercase font-mono text-[#D4AF37] block mb-1">{draw.label}</span>
                    <span className="text-xs font-bold text-white block">{draw.card.name}</span>
                    <span className="text-[10.5px] text-gray-400 block mt-1">
                      {draw.isReversed ? 'Invertida' : 'Direta'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Channeled Interpretation Text */}
          <div className="prose prose-invert max-w-none text-xs md:text-sm text-gray-200 leading-relaxed space-y-4">
            <div className="border border-red-950/40 rounded-xl bg-red-950/10 p-4 md:p-6">
              <h4 className="font-serif text-[#D4AF37] text-base font-bold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-500" />
                Doutrina dos Caminhos de Maria Padilha para o Casal
              </h4>
              <ReadingViewer content={readingResult || ''} />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              id="btn_reset_compatibility"
              onClick={handleReset}
              className="px-6 py-2.5 rounded bg-gradient-to-r from-red-800 to-red-650 hover:from-red-700 hover:to-red-600 text-xs font-bold uppercase tracking-wider text-white border border-[#D4AF37]/30 transition-all cursor-pointer"
            >
              Fazer Nova Análise
            </button>
          </div>
        </motion.div>
      ) : (
        /* INPUT FORM */
        <form onSubmit={handleCalculate} className="mx-auto max-w-xl rounded-xl border border-gray-800 bg-black/75 p-6 md:p-8 backdrop-blur-sm shadow-md">
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-4">
                <img
                  src="/image/Maria Padilha Logo.png"
                  alt="Maria Padilha"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" /> Cruzando Mapas e Destinos de Amor no Servidor...
              </h3>
              <p className="text-xs text-gray-400 mt-2 max-w-xs">
                Sincronizando astrologia, numerologia, cabala e tiragem sagrada de Tarot.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Person 1 (Consulente) - STRICTLY READ-ONLY from authenticated DB profile */}
              <div className="rounded-lg border border-gray-850 bg-gray-950/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-serif uppercase tracking-wider text-[#D4AF37] font-bold flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Seus Dados Natais (Consulente)
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    <Lock className="w-3 h-3 text-[#D4AF37]" /> Perfil Autenticado
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Nome Completo</label>
                    <div className="rounded-md border border-gray-800 bg-black/60 px-3 py-1.5 text-xs text-white font-medium truncate">
                      {name1 || 'Não cadastrado'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Data de Nascimento</label>
                    <div className="rounded-md border border-gray-800 bg-black/60 px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{date1 || 'Não informada'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Hora de Nascimento</label>
                    <div className="rounded-md border border-gray-800 bg-black/60 px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{time1 ? `${time1}` : 'Hora não informada'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Person 2 (Amor) - Full Name and Birth Date required, Birth Time optional, NO city */}
              <div className="rounded-lg border border-gray-850 bg-gray-950/40 p-4">
                <h3 className="text-xs font-serif uppercase tracking-wider text-red-400 font-bold mb-3 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-red-500" /> Dados da Pessoa Consultada (Pessoa Amada)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">
                      Nome Completo de Solteiro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      placeholder="Ex: Maria Pereira da Silva"
                      className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">
                      Data de Nascimento <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="date"
                        value={date2}
                        onChange={(e) => setDate2(e.target.value)}
                        className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">
                      Hora de Nascimento (Opcional)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="time"
                        value={time2}
                        onChange={(e) => setTime2(e.target.value)}
                        className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-red-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculate Action */}
              <div className="pt-4 border-t border-gray-900 flex flex-col items-center gap-3">
                <button
                  id="btn_calculate_sinastria"
                  type="submit"
                  className="w-full py-2.5 rounded bg-gradient-to-r from-red-800 to-red-650 hover:from-red-700 hover:to-red-600 text-xs font-bold uppercase tracking-wider text-white border border-[#D4AF37]/40 shadow-md cursor-pointer transition-all"
                >
                  Calcular Compatibilidade Amorosa ({LOVE_COMPATIBILITY_COST} Créditos)
                </button>
                <div className="flex items-center gap-1.5 text-[10.5px] text-[#D4AF37] font-mono">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Esta análise profunda consome {LOVE_COMPATIBILITY_COST} créditos do seu saldo.</span>
                </div>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
