import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Shield, MessageCircle } from 'lucide-react';

export const Entrance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="mp_entrance_page" className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-4 py-10 text-white">
      <div className="absolute inset-0 bg-black/35" />

      <motion.div
        id="mp_entrance_container"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-red-800/40 bg-black/78 p-6 text-center shadow-[0_0_45px_rgba(185,28,28,0.35)] backdrop-blur-xl md:p-10"
      >
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <motion.div
          id="mp_emblem"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#D4AF37] bg-black/70 shadow-[0_0_35px_rgba(212,175,55,0.45)]"
        >
         <img
  src="/image/Maria Padilha Logo.png"
  alt="Maria Padilha Rainha das 7 Encruzilhadas"
  className="h-full w-full object-cover"
/>
        </motion.div>

        <div className="mb-3 flex items-center justify-center gap-2 text-[#D4AF37]">
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-[0.25em]">
            Portal Espiritual
          </span>
        </div>

        <h1
          id="mp_title"
          className="bg-gradient-to-b from-white via-[#FDF5E6] to-[#D4AF37] bg-clip-text font-serif text-3xl font-extrabold leading-tight tracking-wide text-transparent md:text-5xl"
        >
          Maria Padilha
          <br />
          <span className="text-red-500">Rainha das 7 Encruzilhadas</span>
        </h1>

        <p id="mp_subtitle" className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-200 md:text-base">
          Converse diretamente com Maria Padilha sobre amor, caminhos, proteção,
          espiritualidade, decisões e tudo que pesar no seu coração.
        </p>

        <div id="mp_feature_highlights" className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-800/35 bg-red-950/25 p-4">
            <MessageCircle className="mx-auto mb-2 h-5 w-5 text-[#D4AF37]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Conversa Direta
            </h3>
            <p className="mt-1 text-[11px] text-gray-400">
              Sem menus grandes. Basta perguntar e receber orientação.
            </p>
          </div>

          <div className="rounded-2xl border border-red-800/35 bg-red-950/25 p-4">
            <Shield className="mx-auto mb-2 h-5 w-5 text-[#D4AF37]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Proteção do Portal
            </h3>
            <p className="mt-1 text-[11px] text-gray-400">
              Ambiente com segurança, respeito, livre-arbítrio e acolhimento.
            </p>
          </div>
        </div>

        <div id="mp_entrance_actions" className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            id="btn_enter_faith"
            onClick={() => navigate('/auth?tab=login')}
            className="w-full rounded-2xl border border-[#D4AF37]/50 bg-red-700 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(185,28,28,0.55)] transition-all hover:bg-red-600 sm:w-auto"
          >
            Entrar
          </button>

          <button
            id="btn_consecrate_account"
            onClick={() => navigate('/auth?tab=register')}
            className="w-full rounded-2xl border-2 border-[#D4AF37] bg-black/40 px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#D4AF37] transition-all hover:bg-white/5 sm:w-auto"
          >
            Criar Conta
          </button>
        </div>

        <p className="mt-5 text-xs font-mono text-[#D4AF37]">
          ✨ Ganhe 07 créditos grátis no cadastro. Cada pergunta ou consulta usa 5 créditos. ✨
        </p>

        <div id="mp_disclaimer" className="mx-auto mt-7 max-w-lg border-t border-gray-800 pt-4 text-[11px] leading-normal text-gray-500">
          Este ambiente respeita todas as crenças e oferece orientação espiritual
          e oracular. Não substitui ajuda médica, psicológica, jurídica ou financeira.
        </div>
      </motion.div>
    </div>
  );
};