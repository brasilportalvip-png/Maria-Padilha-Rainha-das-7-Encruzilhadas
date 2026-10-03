import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { 
  Compass, Coins, Calendar, User, FileText, ChevronRight, HelpCircle, Check, Printer, ArrowLeft, RefreshCw, AlertTriangle
} from 'lucide-react';
import { ReadingViewer } from '../components/ReadingViewer';
import {
  READING_CONSULTATION_COST,
  INSUFFICIENT_CREDITS_MESSAGE,
} from '../config/pricing';

function generateClientUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeHtmlForPrint(html: string): string {
  return String(html || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, 'blocked:');
}

export const Readings: React.FC = () => {
  const { user, history, apiFetch, setUserCredits, addHistoryItem } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewId = searchParams.get('view');

  const [activeReading, setActiveReading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readingResult, setReadingResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Question / Context for the oracle
  const [question, setQuestion] = useState('');

  // Fields for a specific person involved in the query
  const [hasSpecificPerson, setHasSpecificPerson] = useState(false);
  const [specificPersonName, setSpecificPersonName] = useState('');
  const [specificPersonDate, setSpecificPersonDate] = useState('');
  const [specificPersonRelationship, setSpecificPersonRelationship] = useState('outro');

  const idempotencyKeyRef = useRef<string>(generateClientUUID());

  // If viewing a history item, load it.
  // Do not clear a newly generated reading when history changes.
  useEffect(() => {
    if (viewId && history.length > 0) {
      const item = history.find(h => h.id === viewId);
      if (item) {
        setReadingResult(item.content);
        setActiveReading(item.type);
      }
    }
  }, [viewId, history]);

  const oracleOptions = [
    {
      id: 'odu',
      title: 'Odù Ifá Regente',
      desc: 'Descubra qual Odù de nascimento rege seus caminhos espirituais atuais.',
      cost: READING_CONSULTATION_COST,
      icon: '✨'
    },
    {
      id: 'buzios',
      title: 'Jogo de Búzios',
      desc: 'Consulta às conchas sagradas e revelação da influência dos Orixás.',
      cost: READING_CONSULTATION_COST,
      icon: '🐚'
    },
    {
      id: 'tarot',
      title: 'Tarot das Três Cartas',
      desc: 'Visualização completa do passado, presente e tendências futuras.',
      cost: READING_CONSULTATION_COST,
      icon: '🃏'
    },
    {
      id: 'numerology',
      title: 'Numerologia da Alma',
      desc: 'Mapa numérico completo com sua missão de vida e desafios cármicos.',
      cost: READING_CONSULTATION_COST,
      icon: '🔢'
    },
    {
      id: 'cabala',
      title: 'Cabala e Anjo Guardião',
      desc: 'Sua esfera na Árvore da Vida, Arcanjo regente e anjo protetor.',
      cost: READING_CONSULTATION_COST,
      icon: '🌌'
    },
    {
      id: 'astrology',
      title: 'Astrologia e Horário Planetário',
      desc: 'Fase da lua regente, horário planetário e seu impacto astral.',
      cost: READING_CONSULTATION_COST,
      icon: '🌙'
    },
    {
      id: 'premium_complete',
      title: 'Grande Consulta Premium',
      desc: 'A leitura definitiva integrando Tarot, Odù Ifá, Búzios, Numerologia Cabalística, Astrologia Cósmica, Síntese de Maria Padilha e Ritual Personalizado.',
      cost: READING_CONSULTATION_COST,
      icon: '👑',
      badge: 'MAIS PROCURADO'
    }
  ];

  const handleRunReading = async (type: string, cost: number) => {
    if (!user) return;
    setErrorMsg('');

    if (user.credits < cost) {
      setErrorMsg(INSUFFICIENT_CREDITS_MESSAGE);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/reading', {
        method: 'POST',
        body: JSON.stringify({
          type,
          question: question.trim() || undefined,
          userData: {
            fullName: user.fullName,
            birthDate: user.birthDate,
            birthTime: user.birthTime,
            timezone: user.timezone || 'America/Sao_Paulo'
          },
          specificName: hasSpecificPerson ? specificPersonName : undefined,
          specificDate: hasSpecificPerson ? specificPersonDate : undefined,
          relationshipContext: hasSpecificPerson ? specificPersonRelationship : undefined,
          participantRelation: hasSpecificPerson ? specificPersonRelationship : undefined,
          idempotencyKey: idempotencyKeyRef.current,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (typeof data.newCreditsBalance === 'number') {
          setUserCredits(data.newCreditsBalance);
        }
        if (data.code !== 'OPERATION_IN_PROGRESS') {
          idempotencyKeyRef.current = generateClientUUID();
        }
        throw new Error(data.error || 'Erro na consulta do oráculo.');
      }

      if (!data.reading || typeof data.reading !== 'string' || !data.reading.trim()) {
        idempotencyKeyRef.current = generateClientUUID();
        throw new Error('O oráculo não retornou uma leitura. Tente novamente.');
      }

      // Refresh idempotency key for future new consultations
      idempotencyKeyRef.current = generateClientUUID();

      if (typeof data.newCreditsBalance === 'number') {
        setUserCredits(data.newCreditsBalance);
      }

      const title = oracleOptions.find(o => o.id === type)?.title || 'Oráculo';
      addHistoryItem({
        id: `h_${Date.now()}`,
        userId: user.uid,
        type,
        title,
        date: new Date().toISOString(),
        content: data.reading,
        creditsUsed: cost,
      });

      setReadingResult(data.reading);
      setActiveReading(type);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao consultar os oráculos sagrados. Seus créditos foram preservados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const activeTitle = oracleOptions.find(o => o.id === activeReading)?.title || 'Leitura Espiritual';
    const printContent = `
      <html>
        <head>
          <title>Relatório Espiritual - Maria Padilha Portal</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@400;600&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #111;
              margin: 40px;
              line-height: 1.6;
            }
            .cover {
              text-align: center;
              padding: 80px 20px;
              border: 3px double #D4AF37;
              margin-bottom: 40px;
              page-break-after: always;
            }
            .cover h1 {
              font-family: 'Cinzel', serif;
              font-size: 26px;
              color: #8B0000;
              margin-top: 20px;
            }
            .metadata-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            .metadata-table th, .metadata-table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
              font-size: 13px;
            }
            .metadata-table th {
              background-color: #f9f9f9;
            }
            .content {
              font-size: 14px;
            }
            .content h3 {
              font-family: 'Cinzel', serif;
              color: #8B0000;
              border-bottom: 2px solid #D4AF37;
              padding-bottom: 5px;
              margin-top: 30px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 11px;
              color: #777;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="cover">
            <div style="font-size: 48px;">🌹</div>
            <h1>PORTAL ESPIRITUAL PREMIUM</h1>
            <h2>Maria Padilha Rainha das 7 Encruzilhadas</h2>
            <p>Relatório de Orientação, Oráculos e Autoconhecimento</p>
            <div style="margin-top: 60px; font-size: 13px;">
              <p>Consulente: <strong>${escapeHtml(user?.fullName || 'Consulente')}</strong></p>
              <p>Data de Emissão: <strong>${new Date().toLocaleDateString('pt-BR')}</strong></p>
              <p>Código de Autenticação Espiritual: <strong>MP-${Math.floor(100000 + Math.random() * 900000)}</strong></p>
            </div>
          </div>

          <div class="content">
            <h3>DADOS DO CONSULTANTE & ENERGIAS</h3>
            <table class="metadata-table">
              <tr>
                <th>Nome Completo</th>
                <td>${escapeHtml(user?.fullName || '')}</td>
                <th>Data de Nascimento</th>
                <td>${escapeHtml(user?.birthDate || '')}</td>
              </tr>
              <tr>
                <th>Hora de Nascimento</th>
                <td>${escapeHtml(user?.birthTime || 'Não informada')}</td>
                <th>Vibração do Portal</th>
                <td>Ativo</td>
              </tr>
              ${hasSpecificPerson ? `
              <tr>
                <th>Pessoa Consultada</th>
                <td>${escapeHtml(specificPersonName)}</td>
                <th>Nascimento Pessoa</th>
                <td>${escapeHtml(specificPersonDate || 'Não informada')}</td>
              </tr>
              ` : ''}
            </table>

            <h3>${escapeHtml(activeTitle.toUpperCase())}</h3>
            <div style="margin-top: 20px;">
              ${sanitizeHtmlForPrint(readingResult || '')}
            </div>

            <div class="footer">
              <p>Este relatório foi gerado através de inteligência artificial canalizada e oráculos ancestrais do Reino de Maria Padilha.</p>
              <p>Laroyé Pombo Gira! Saravá a força das 7 Encruzilhadas.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Try iframe print first (safe for sandboxed iFrames without window.open)
    try {
      const existingIframe = document.getElementById('print-iframe');
      if (existingIframe) existingIframe.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(printContent);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        }, 500);
        return;
      }
    } catch (e) {
      console.warn('Iframe print failed, trying window.print', e);
    }

    // Direct fallback
    window.print();
  };

  const handleReset = () => {
    setReadingResult(null);
    setActiveReading(null);
    setSearchParams({});
    setHasSpecificPerson(false);
    setSpecificPersonName('');
    setSpecificPersonDate('');
  };

  return (
    <div id="mp_readings_portal" className="mx-auto max-w-5xl px-4 py-8 text-white">
      {/* READING RESULT VIEW */}
      {readingResult ? (
        <motion.div
          id="reading_result_container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#D4AF37]/40 bg-black/85 p-6 md:p-8 backdrop-blur-sm shadow-[0_0_40px_rgba(139,0,0,0.3)]"
        >
          {/* Controls Bar */}
          <div className="mb-6 flex flex-wrap gap-3 items-center justify-between border-b border-gray-900 pb-4">
            <button
              id="btn_back_to_oracles"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-800 bg-gray-950 text-xs text-gray-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar aos Oráculos
            </button>

            <div className="flex gap-2">
              <button
                id="btn_print_pdf"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-xs font-bold text-black hover:opacity-90 cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.2)]"
              >
                <Printer className="w-3.5 h-3.5" />
                Gerar PDF Oficial
              </button>
            </div>
          </div>

          {/* Report Paper */}
          <div id="spiritual_report_paper" className="prose prose-invert max-w-none text-xs md:text-sm text-gray-100 space-y-4 font-sans leading-relaxed">
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.4)] mb-3">
                <img
                  src="/image/Maria Padilha Logo.png"
                  alt="Maria Padilha"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-[#D4AF37] mt-1 uppercase tracking-wider">
                Revelação do Oráculo Sagrado
              </h2>
              <span className="text-[10px] font-mono text-gray-400">Canalizado em {new Date().toLocaleDateString('pt-BR')}</span>
            </div>

            {/* Structured reading output without dangerouslySetInnerHTML */}
            <div 
              id="reading_output_html" 
              className="max-h-[65vh] overflow-y-auto overscroll-contain space-y-4 border border-red-950/40 rounded-xl bg-red-950/5 p-4 pr-3 md:p-6 md:pr-4 scrollbar-thin scrollbar-track-black/60 scrollbar-thumb-red-700"
            >
              <ReadingViewer content={readingResult || ''} />
            </div>
          </div>

          <div className="mt-8 border-t border-gray-900 pt-4 text-center">
            <p className="text-[11px] text-gray-500 font-mono">
              Obrigado por consultar o Portal. Guarde estas orientações com discrição e fé em seu coração.
            </p>
          </div>
        </motion.div>
      ) : (
        /* LIST OF ORACLES TO RUN */
        <div>
          {/* Header titles */}
          <div className="mb-8 text-center">
            <Compass className="mx-auto w-10 h-10 text-red-500 mb-2 animate-spin-slow" />
            <h2 className="font-serif text-2xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-[#D4AF37]">
              Oráculos & Consultas do Destino
            </h2>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto mt-2">
              Escolha uma consulta comum ou acesse a imensa Consulta Premium para receber um dossiê espiritual completo sobre sua jornada terrena.
            </p>
          </div>

          {/* Question / Context Input */}
          <div className="mb-6 max-w-xl mx-auto rounded-xl border border-gray-800 bg-black/60 p-4">
            <label className="block text-xs font-bold text-gray-200 mb-1 flex items-center justify-between">
              <span>Sua Pergunta ou Situação para o Oráculo (Opcional)</span>
              <span className="text-[10px] text-gray-400 font-normal">Ex: Sociedade, trabalho, amor ou caminhos</span>
            </label>
            <input
              id="oracle_question_input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: Como ficará minha sociedade com Carlos? Ou deixe em branco para consulta geral."
              className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Specific Person Involved in Query */}
          <div className="mb-8 max-w-xl mx-auto rounded-xl border border-red-900/20 bg-red-950/10 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                id="checkbox_specific_person"
                type="checkbox"
                checked={hasSpecificPerson}
                onChange={(e) => setHasSpecificPerson(e.target.checked)}
                className="w-4 h-4 rounded border-gray-800 bg-black text-red-600 focus:ring-0 focus:ring-offset-0"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-200">Esta consulta envolve uma pessoa específica?</span>
                <span className="text-[10px] text-gray-400">Marque se você for perguntar sobre alguém (família, trabalho, sociedade, amor ou outra relação).</span>
              </div>
            </label>

            {hasSpecificPerson && (
              <motion.div
                id="specific_person_fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-red-950/40 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">Nome da Pessoa</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    <input
                      id="specific_person_name_input"
                      type="text"
                      placeholder="Nome completo"
                      value={specificPersonName}
                      onChange={(e) => setSpecificPersonName(e.target.value)}
                      className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      required={hasSpecificPerson}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">Data de Nascimento (se conhecida)</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    <input
                      id="specific_person_birth_input"
                      type="date"
                      value={specificPersonDate}
                      onChange={(e) => setSpecificPersonDate(e.target.value)}
                      className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">Relação com a Questão</label>
                  <select
                    id="specific_person_relation_select"
                    value={specificPersonRelationship}
                    onChange={(e) => setSpecificPersonRelationship(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="amor">Amor / Afeto</option>
                    <option value="ex">Ex-parceiro(a)</option>
                    <option value="conjuge">Cônjuge</option>
                    <option value="familia">Família</option>
                    <option value="amizade">Amizade</option>
                    <option value="sociedade">Sociedade / Parceria</option>
                    <option value="trabalho">Trabalho / Colega</option>
                    <option value="chefe">Chefe / Superior</option>
                    <option value="funcionario">Funcionário</option>
                    <option value="cliente">Cliente / Negócios</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {errorMsg && (
            <div id="readings_error_alert" className="mb-6 mx-auto max-w-xl rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Grid Layout */}
          {isLoading ? (
            <div id="reading_loading_screen" className="text-center py-12 bg-black/80 rounded-xl border border-[#D4AF37]/30 flex flex-col items-center shadow-lg">
              <div className="w-28 h-28 rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-4">
                <img
                  src="/image/Maria Padilha Logo.png"
                  alt="Maria Padilha"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" /> Invocando Sabedoria Cósmica...
              </h3>
              <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto leading-normal px-4">
                Maria Padilha está analisando os caminhos, as conchas e as cartas sob as irradiações do Reino das 7 Encruzilhadas.
              </p>
            </div>
          ) : (
            <div id="oracles_bento_grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {oracleOptions.map((oracle, i) => (
                <div
                  key={oracle.id}
                  id={`oracle_item_${oracle.id}`}
                  className={`relative rounded-xl border p-5 backdrop-blur-sm flex flex-col justify-between transition-all duration-300 ${
                    oracle.id === 'premium_complete'
                      ? 'border-[#D4AF37]/50 bg-gradient-to-r from-red-950/50 via-black to-black md:col-span-2 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-gray-800 bg-black/60 hover:border-red-900/50'
                  }`}
                >
                  {oracle.badge && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-yellow-500 to-[#D4AF37] px-2.5 py-0.5 text-[9px] font-bold text-black uppercase font-mono shadow">
                      {oracle.badge}
                    </span>
                  )}

                  <div className="flex gap-4 items-start">
                    <span className="text-4xl">{oracle.icon}</span>
                    <div>
                      <h4 className={`font-serif text-base font-bold ${oracle.id === 'premium_complete' ? 'text-[#D4AF37] text-lg' : 'text-white'}`}>
                        {oracle.title}
                      </h4>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                        {oracle.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-900 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Custo: <strong>{oracle.cost} {oracle.cost === 1 ? 'Crédito' : 'Créditos'}</strong>
                    </span>

                    <button
                      id={`btn_run_${oracle.id}`}
                      onClick={() => handleRunReading(oracle.id, oracle.cost)}
                      className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-103 ${
                        oracle.id === 'premium_complete'
                          ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black shadow'
                          : 'bg-red-950/40 border border-red-900/40 text-red-300 hover:bg-red-900/30'
                      }`}
                    >
                      Realizar Consulta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
