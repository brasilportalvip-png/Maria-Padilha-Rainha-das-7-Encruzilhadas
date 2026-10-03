import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserPanel } from '../components/UserPanel';
import {
  Send,
  AlertTriangle,
  Coins,
  HelpCircle,
  LogOut,
  LogIn,
  User
} from 'lucide-react';
import {
  ORACLE_QUESTION_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../config/pricing';

function generateClientUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}


export const Chat: React.FC = () => {
  const { user, logout, apiFetch, setUserCredits, addHistoryItem } = useApp();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showUserPanel, setShowUserPanel] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChatIdempotencyKeyRef = useRef<string>(generateClientUUID());

  const CREDIT_COST = ORACLE_QUESTION_COST; // 5 créditos

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;
    if (isTyping) return;

    if (!user) {
      setErrorMsg('Faça login para consultar Maria Padilha.');
      return;
    }

    if (user.credits < CREDIT_COST) {
      setErrorMsg(INSUFFICIENT_CREDITS_MESSAGE);
      return;
    }

    const userText = inputText.trim();
    setInputText('');
    setErrorMsg('');

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: userText,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const chatHistory = nextMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userText,
          history: chatHistory,
          pomboGiraName: 'Maria Padilha Rainha das 7 Encruzilhadas',
          idempotencyKey: currentChatIdempotencyKeyRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro na conexão com o oráculo.');
      }

      // Successful reply received: refresh idempotency key for next question
      currentChatIdempotencyKeyRef.current = generateClientUUID();

      if (typeof data.newCreditsBalance === 'number') {
        setUserCredits(data.newCreditsBalance);
      }

      setMessages([
        ...nextMessages,
        {
          id: 'mdl_' + Date.now(),
          role: 'model',
          text: data.reply,
        },
      ]);

      addHistoryItem({
        id: `h_${Date.now()}`,
        userId: user.uid,
        type: 'chat',
        title: 'Consulta no Reino de Maria Padilha',
        date: new Date().toISOString(),
        content: data.reply,
        creditsUsed: data.creditsCost !== undefined ? data.creditsCost : CREDIT_COST,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Não foi possível concluir esta consulta agora. Tente novamente.');
      // Restore input text so the user doesn't lose what they typed
      setInputText(userText);
    } finally {
      setIsTyping(false);
    }
  };

  const goToCredits = () => {
    navigate('/credits');
  };

  const goToSupport = () => {
    window.location.href = 'mailto:brasilportalvip@gmail.com?subject=Suporte%20Maria%20Padilha%20Online';
  };

  const handleLogout = () => {
    setMessages([]);
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
        <img
  src="/image/Maria Padilha Fundo.png"
  alt=""
  className="fixed inset-0 z-0 h-full w-full object-cover"
/>

        <div className="fixed inset-0 z-10 bg-black/45" />

        <div className="relative z-20 flex h-[100dvh] items-end justify-center px-4 pb-10">
          <div className="w-full max-w-md rounded-3xl border border-red-600/60 bg-black/75 p-5 text-center shadow-[0_0_35px_rgba(185,28,28,0.65)] backdrop-blur-xl">
            <h1 className="mb-2 text-xl font-bold text-red-100">
              🌹 Maria Padilha
            </h1>

            <p className="mb-5 text-sm leading-relaxed text-red-100/90">
              Faça login para abrir sua consulta espiritual.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-4 text-sm font-bold text-white shadow-[0_0_25px_rgba(220,38,38,0.65)]"
            >
              <LogIn className="h-5 w-5" />
              Entrar / Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-black text-white">
      <img
  src="/image/Maria Padilha Fundo.png"
  alt=""
  className="fixed inset-0 z-0 h-full w-full object-cover"
/>

      <div className="fixed inset-0 z-10 bg-black/45" />

      <div className="relative z-20 flex h-[100dvh] flex-col overflow-hidden lg:h-auto lg:min-h-[100dvh] lg:overflow-visible">
  <div className="flex shrink-0 items-center justify-between px-3 py-3">
    <div className="rounded-full border border-yellow-500/50 bg-black/75 px-2 py-2 text-[10px] sm:text-xs font-bold text-yellow-200 backdrop-blur-md">
      <span className="inline-flex items-center gap-1">
        <Coins className="h-4 w-4" />
        {user.credits} créditos
      </span>
    </div>

    <div className="flex flex-wrap gap-2 justify-end">
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-red-500/50 bg-black/75 px-2 py-2 text-[10px] sm:text-xs font-bold text-red-100 backdrop-blur-md"
      >
        <span className="inline-flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          Sair
        </span>
      </button>
    </div>
  </div>

  <div className="mx-auto flex shrink-0 items-center justify-center px-4 py-2 sm:py-3">
  <div className="relative flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52 md:h-60 md:w-60 lg:h-64 lg:w-64">
    <div className="absolute inset-0 rounded-full bg-red-700/40 blur-3xl animate-pulse" />

    <div className="absolute inset-2 rounded-full border-2 border-red-500/50 shadow-[0_0_80px_rgba(220,38,38,0.95)] animate-pulse" />

    <div className="absolute inset-5 rounded-full border-2 border-[#D4AF37]/60 shadow-[0_0_60px_rgba(212,175,55,0.75)]" />

    <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-[#D4AF37] bg-black shadow-[0_0_50px_rgba(212,175,55,0.95),0_0_100px_rgba(185,28,28,0.90)] sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-60 lg:w-60">
<img
        src="/image/Maria Padilha Logo.png"
        alt="Maria Padilha Rainha das 7 Encruzilhadas"
        className="h-full w-full scale-110 object-cover"
      />
    </div>
  </div>
</div>

  <div className="mx-auto flex w-full max-w-3xl flex-1 min-h-0 flex-col rounded-t-3xl border border-red-900/60 bg-black/75 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.92)] sm:p-4 lg:max-h-[52vh] lg:flex-none lg:rounded-3xl">
<div className="flex-1 overflow-y-auto pr-1 space-y-4 overscroll-contain scrollbar-thin scrollbar-track-black/60 scrollbar-thumb-red-700">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex w-full ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                

<div
  className={`max-w-full sm:max-w-[90%] rounded-2xl p-3.5 sm:p-4 text-xs md:text-[13px] leading-relaxed shadow-xl backdrop-blur-md ${
    m.role === 'user'
      ? 'bg-red-900/80 text-white rounded-tr-none'
      : 'border border-red-500/40 bg-black/80 text-red-50 rounded-tl-none'
  }`}
  style={{ whiteSpace: 'pre-line' }}
>
  {m.text}
</div>




              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-red-500/30 bg-black/70 px-4 py-3 text-sm text-red-100 backdrop-blur-md">
                  🌹 Estou correndo sua gira para responder...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-950/80 p-3 text-center text-xs text-red-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-red-900/50 bg-black/85 p-3 backdrop-blur-xl">
          <form onSubmit={handleSendMessage} className="mx-auto flex max-w-3xl flex-col gap-3">
            <input
              id="chat_input"
              type="text"
              placeholder={
                user.credits >= CREDIT_COST
                  ? 'Pergunte à Maria Padilha...'
                  : 'Acabou Seus Creditos, Faça Uma Recarga.'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping || user.credits < CREDIT_COST}
              className="w-full rounded-2xl border-2 border-red-500 bg-black/90 px-5 py-4 text-sm text-white placeholder-red-200/70 shadow-[0_0_30px_rgba(220,38,38,0.75)] outline-none focus:border-red-300 focus:ring-2 focus:ring-red-500 disabled:opacity-60"
            />

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={goToCredits}
                className="flex items-center justify-center gap-1 rounded-xl border border-yellow-500/50 bg-yellow-700/25 px-2 py-3 text-xs font-bold text-yellow-200"
              >
                <Coins className="h-4 w-4" />
                Comprar
              </button>

              <button
                type="button"
                onClick={goToSupport}
                className="flex items-center justify-center gap-1 rounded-xl border border-red-500/50 bg-red-900/30 px-2 py-3 text-xs font-bold text-red-100"
              >
                <HelpCircle className="h-4 w-4" />
                Suporte
              </button>

              <button
                id="btn_send_chat"
                type="submit"
                disabled={isTyping || !inputText.trim() || user.credits < CREDIT_COST}
                className="flex items-center justify-center gap-1 rounded-xl bg-red-700 px-2 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.55)] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>

              <button
                type="button"
                onClick={() => setShowUserPanel(true)}
                className="flex items-center justify-center gap-1 rounded-xl border border-yellow-500/50 bg-black/75 px-2 py-3 text-xs font-bold text-yellow-200"
              >
                <User className="h-4 w-4" />
                Perfil
              </button>
            </div>
          </form>
        </div>
      </div>

      {showUserPanel && (
        <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center px-3 py-4">
          <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-3xl border-2 border-red-700 bg-black p-3 shadow-[0_0_35px_rgba(185,28,28,0.8)]">
            <button
              type="button"
              onClick={() => setShowUserPanel(false)}
              className="sticky top-0 z-[100000] ml-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white font-bold shadow-lg"
            >
              X
            </button>

            <UserPanel />
          </div>
        </div>
      )}
    </div>
  );
};