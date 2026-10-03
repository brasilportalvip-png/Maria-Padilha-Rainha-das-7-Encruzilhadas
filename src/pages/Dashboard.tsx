import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { Sparkles, Coins, MessageCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div id="mp_dashboard" className="relative flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8 text-white">
      <motion.div
        id="mp_simple_dashboard"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-2xl rounded-3xl border border-red-800/40 bg-black/80 p-6 text-center shadow-[0_0_35px_rgba(185,28,28,0.35)] backdrop-blur-xl"
      >
        <img
          src="/image/Maria Padilha Logo.png"
          alt="Maria Padilha"
          className="mx-auto mb-4 h-24 w-24 rounded-full border border-[#D4AF37]/60 object-cover shadow-[0_0_25px_rgba(212,175,55,0.35)]"
        />

        <div className="mb-3 flex items-center justify-center gap-2 text-[#D4AF37]">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-[0.25em]">
            Portal Aberto
          </span>
        </div>

        <h1 className="font-serif text-2xl font-bold text-white md:text-4xl">
          Bem vindo, {user.fullName}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-300">
          A partir de agora, tudo será feito em conversa direta com Maria Padilha.
          Amor, caminhos, proteção, espiritualidade e orientação devem ser perguntados no chat.
        </p>

        <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-red-950/30 px-4 py-3 text-sm">
          <Coins className="h-5 w-5 text-[#D4AF37]" />
          <span className="text-gray-300">Seu saldo:</span>
          <strong className="text-[#D4AF37]">{user.credits} créditos</strong>
        </div>

        <button
          id="btn_enter_maria_padilha_chat"
          type="button"
          onClick={() => navigate('/chat')}
          className="mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(220,38,38,0.55)] transition-all hover:bg-red-600"
        >
          <MessageCircle className="h-5 w-5" />
          Conversar com Maria Padilha
        </button>

        <p className="mt-4 text-xs text-gray-500">
          Cada pergunta/consulta consome 5 créditos.
        </p>
      </motion.div>
    </div>
  );
};