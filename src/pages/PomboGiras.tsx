import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { generatePomboGiraNames, getPomboGiraDetails, MAJOR_POMBO_GIRAS } from '../data/pomboGiras';
import { motion } from 'motion/react';
import { Heart, Search, Sparkles, HelpCircle, AlertCircle, Coins, MessageSquare } from 'lucide-react';
import { PomboGira } from '../types/spiritual';
import {
  POMBO_GIRA_ADVICE_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../config/pricing';

function generateClientUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const PomboGiras: React.FC = () => {
  const { user, apiFetch, setUserCredits, addHistoryItem } = useApp();
  const [allNames] = useState(generatePomboGiraNames());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPG, setSelectedPG] = useState<PomboGira | null>(MAJOR_POMBO_GIRAS[0]);
  const [customAdvice, setCustomAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const idempotencyKeyRef = useRef<string>(generateClientUUID());

  // Handle filter
  const filteredNames = allNames.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPomboGira = (name: string) => {
    const details = getPomboGiraDetails(name);
    setSelectedPG(details);
    setCustomAdvice(null);
    setErrorMsg('');
    idempotencyKeyRef.current = generateClientUUID();
  };

  const handleRequestAdvice = async () => {
    if (!selectedPG || !user) return;
    setErrorMsg('');

    if (user.credits < POMBO_GIRA_ADVICE_COST) {
      setErrorMsg(INSUFFICIENT_CREDITS_MESSAGE);
      return;
    }

    setIsLoadingAdvice(true);
    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: `Diga seu nome completo, seu reino e me dê um conselho espiritual personalizado e inédito baseado no seu mistério de atuação.`,
          pomboGiraName: selectedPG.name,
          idempotencyKey: idempotencyKeyRef.current,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.code !== 'OPERATION_IN_PROGRESS') {
          idempotencyKeyRef.current = generateClientUUID();
        }
        throw new Error(data.error || 'Erro ao conectar à entidade.');
      }

      if (!data.reply || typeof data.reply !== 'string') {
        idempotencyKeyRef.current = generateClientUUID();
        throw new Error('A entidade não retornou uma mensagem. Tente novamente.');
      }

      // Refresh idempotency key on success for subsequent advice
      idempotencyKeyRef.current = generateClientUUID();

      if (typeof data.newCreditsBalance === 'number') {
        setUserCredits(data.newCreditsBalance);
      }

      const title = `Conselho de ${selectedPG.name}`;
      addHistoryItem({
        id: `pg_${Date.now()}`,
        userId: user.uid,
        type: 'pombo_gira_advice',
        title,
        date: new Date().toISOString(),
        content: data.reply,
        creditsUsed: POMBO_GIRA_ADVICE_COST, // 5 créditos
      });

      setCustomAdvice(data.reply);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao canalizar conselho inédito.');
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  return (
    <div id="mp_pombagiras_portal" className="mx-auto max-w-6xl px-4 py-8 text-white">
      {/* Title */}
      <div className="mb-8 text-center">
        <Heart className="mx-auto w-10 h-10 text-rose-500 mb-2 animate-pulse" />
        <h2 className="font-serif text-2xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-[#D4AF37]">
          O Sagrado Reino de mais de 300 Pombo Giras
        </h2>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto mt-2">
          Encontre o nome de sua guardiã protetora, aprenda sobre suas oferendas sagradas, compreenda seu reino de atuação e canalize conselhos de luz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Search & 300+ list */}
        <div className="rounded-xl border border-gray-800 bg-black/75 p-4 backdrop-blur-sm flex flex-col h-[500px]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] mb-2">
            Pesquisa de Falangeiras ({filteredNames.length} encontradas)
          </span>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              id="pg_search_box"
              type="text"
              placeholder="Digite o nome (Ex: Sete Saias, Figueira)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-gray-950 pl-10 pr-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredNames.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">Nenhuma pombo gira encontrada com este nome no reino.</p>
            ) : (
              filteredNames.map((name) => (
                <button
                  key={name}
                  id={`pg_item_select_${name.replace(/\s+/g, '_')}`}
                  onClick={() => handleSelectPomboGira(name)}
                  className={`w-full text-left px-3 py-2 rounded text-xs tracking-wide transition-all ${
                    selectedPG?.name === name 
                      ? 'bg-red-950/60 border border-[#D4AF37]/50 text-white font-bold' 
                      : 'text-gray-400 hover:text-white hover:bg-red-950/10'
                  }`}
                >
                  🌹 {name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Details & Advice Card */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {selectedPG ? (
            <motion.div
              id="pombagira_profile_card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-[#D4AF37]/30 bg-gradient-to-b from-black to-red-950/15 p-6 backdrop-blur-sm shadow-[0_0_25px_rgba(139,0,0,0.15)]"
            >
              <div className="flex items-center justify-between border-b border-gray-900 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🌹</span>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-[#D4AF37]">
                      {selectedPG.name}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{selectedPG.realm}</span>
                  </div>
                </div>

                <span className="rounded-full bg-red-950/40 border border-red-900/30 px-3 py-1 text-[10px] text-red-300 font-mono">
                  Atuação: {selectedPG.element}
                </span>
              </div>

              {/* Attributes */}
              <div className="space-y-4 text-xs md:text-sm">
                <div>
                  <h4 className="font-bold text-gray-300 uppercase text-[10px] tracking-wider mb-1 font-mono">Doutrina e Mistério</h4>
                  <p className="text-gray-200 leading-relaxed">{selectedPG.description}</p>
                </div>

                <div className="rounded-lg bg-black/60 border border-gray-900 p-4">
                  <h4 className="font-bold text-[#D4AF37] uppercase text-[10px] tracking-wider mb-1.5 font-mono">🍉 Oferenda de Sintonia & Respeito</h4>
                  <p className="text-gray-300 leading-relaxed text-xs">{selectedPG.offering}</p>
                </div>

                <div className="border-t border-gray-900 pt-4">
                  <h4 className="font-bold text-gray-300 uppercase text-[10px] tracking-wider mb-2 font-mono">💬 Conselho Espiritual Estável</h4>
                  <p className="text-gray-300 leading-relaxed italic border-l-2 border-[#D4AF37] pl-3">
                    "{selectedPG.advice}"
                  </p>
                </div>

                {/* Custom channeled advice section */}
                <div className="border-t border-gray-900 pt-5">
                  {customAdvice ? (
                    <motion.div
                      id="channeled_advice_result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-rose-900/30 bg-gradient-to-br from-red-950/20 to-black p-4 text-xs"
                    >
                      <h4 className="font-bold text-rose-400 uppercase text-[10px] tracking-wider mb-2 font-mono flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Mensagem Canalizada em Tempo Real
                      </h4>
                      <p className="text-gray-100 leading-relaxed whitespace-pre-line">{customAdvice}</p>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      {errorMsg && (
                        <div className="mb-3 rounded-md bg-red-950/20 border border-red-900/30 p-2.5 text-xs text-red-400 flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <button
                        id="btn_request_channeled_advice"
                        onClick={handleRequestAdvice}
                        disabled={isLoadingAdvice}
                        className="w-full sm:w-auto px-6 py-2.5 rounded bg-gradient-to-r from-red-800 to-red-650 hover:from-red-700 hover:to-red-600 text-xs font-bold uppercase tracking-wider text-white border border-[#D4AF37]/40 shadow-md cursor-pointer transition-all hover:scale-103"
                      >
                        {isLoadingAdvice ? 'Canalizando...' : `Canalizar Conselho Inédito Exclusivo (${POMBO_GIRA_ADVICE_COST} Créditos)`}
                      </button>
                      <p className="text-[10px] text-gray-400 mt-2 font-mono">
                        Nossa IA espiritual irá canalizar uma resposta única baseada na sabedoria sagrada de {selectedPG.name}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full rounded-xl border border-gray-800 bg-black/60 p-8 text-center flex flex-col justify-center items-center">
              <span className="text-4xl mb-2">🌹</span>
              <p className="text-sm text-gray-400">Selecione uma Pombo Gira na lista ao lado para conhecer seu mistério espiritual.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
