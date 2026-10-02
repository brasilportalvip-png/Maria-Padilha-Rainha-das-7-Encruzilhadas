import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Tag, Sparkles, Flame, Heart, Shield } from 'lucide-react';

export const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pombagiras' | 'herbs' | 'candles' | 'psalms'>('pombagiras');

  const tabs = [
    { id: 'pombagiras', label: '🌹 Falanges e Orixás', icon: Heart },
    { id: 'herbs', label: '🌿 Ervas e Banhos', icon: BookOpen },
    { id: 'candles', label: '🕯️ Velas e Cristais', icon: Flame },
    { id: 'psalms', label: '📜 Salmos Sagrados', icon: Shield }
  ];

  return (
    <div id="mp_library_portal" className="mx-auto max-w-5xl px-4 py-8 text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <BookOpen className="mx-auto w-10 h-10 text-[#D4AF37] mb-2 animate-pulse" />
        <h2 className="font-serif text-2xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-[#D4AF37]">
          Biblioteca Espiritual e Litúrgica
        </h2>
        <p className="text-xs md:text-sm text-gray-300 max-w-xl mx-auto mt-2">
          Aprenda a doutrina, os fundamentos espirituais, as receitas sagradas e o uso correto das energias materiais para seu fortalecimento pessoal.
        </p>
      </div>

      {/* Tabs */}
      <div id="library_tab_triggers" className="mb-8 flex flex-wrap justify-center gap-2 border-b border-gray-900 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab_lib_${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-950/60 border border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-red-950/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content display area */}
      <div id="library_content_box" className="rounded-xl border border-gray-800 bg-black/70 p-6 md:p-8 backdrop-blur-sm min-h-[400px]">
        {activeTab === 'pombagiras' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#D4AF37] border-b border-gray-900 pb-2">
              Doutrina das Pombo Giras, Exus e Orixás
            </h3>
            
            <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
              <p>
                <strong>As Pombo Giras</strong> são espíritos humanos que alcançaram alto grau de ascensão energética e atuam no plano astral como guardiãs do comportamento, do amor-próprio, do magnetismo e da atração equilibrada. Ao contrário do que superstições antigas pregavam, elas não trazem "o mal" nem promovem vinganças cegas; seu papel é aplicar a justiça cósmica e ensinar a autoestima.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="rounded-lg bg-red-950/10 border border-red-950/20 p-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Exus Protetores</h4>
                  <p className="text-[11.5px]">
                    Agem nas encruzilhadas físicas e astrais promovendo o fluxo da matéria e a proteção das porteiras. São guerreiros incansáveis contra espíritos obsessores (eguns) e manipuladores de energia negativa.
                  </p>
                </div>
                <div className="rounded-lg bg-red-950/10 border border-red-950/20 p-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Os Orixás</h4>
                  <p className="text-[11.5px]">
                    As grandes divindades naturais, personificações das leis cósmicas de Deus (Olorum). Oxalá representa a paz, Iemanjá a harmonia, Xangô a justiça, e Ogum a lei e o movimento.
                  </p>
                </div>
              </div>

              <blockquote className="border-l-2 border-[#D4AF37] pl-3 italic text-gray-400 text-xs mt-4">
                "Não curve sua espinha diante de quem não conhece o seu valor. O Reino das Pombo Giras protege a rainha que existe em cada mulher." — Chanalizado por Maria Padilha.
              </blockquote>
            </div>
          </motion.div>
        )}

        {activeTab === 'herbs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#D4AF37] border-b border-gray-900 pb-2">
              Banhos de Ervas de Luz e Fortalecimento
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
              <p>
                As ervas guardam as frequências mais limpas e curativas da Mãe Natureza (reino de Ossaim). O uso inteligente de banhos ajuda a descarregar energias acumuladas no duplo-etérico e restabelecer o brilho de sua aura.
              </p>

              <div className="space-y-3.5 mt-4">
                <div className="p-3.5 rounded bg-gray-950 border border-gray-900">
                  <h4 className="font-bold text-green-400 font-mono text-xs uppercase">1. Banho de Atração e Brilho Pessoal</h4>
                  <p className="text-[11px] mt-1 text-gray-300 leading-normal">
                    <strong>Ingredientes:</strong> Pétalas de 3 rosas vermelhas abertas (sem espinhos), 1 punhado de canela em pó ou rama, 1 colher de mel de abelha e 1 litro de água mineral.<br />
                    <strong>Como fazer:</strong> Ferva a canela por 5 minutos, coe, adicione o mel e as pétalas de rosas macerando com as mãos. Jogue do pescoço para baixo após o banho higiênico, mentalizando seus caminhos amorosos brilhando.
                  </p>
                </div>

                <div className="p-3.5 rounded bg-gray-950 border border-gray-900">
                  <h4 className="font-bold text-green-400 font-mono text-xs uppercase">2. Banho de Desobsessão e Descarrego</h4>
                  <p className="text-[11px] mt-1 text-gray-300 leading-normal">
                    <strong>Ingredientes:</strong> Um punhado de alecrim seco, folhas de arruda frescas e casca de alho roxo.<br />
                    <strong>Como fazer:</strong> Macere as ervas frescas na água morna, coe. Despeje do pescoço para baixo em uma terça ou sexta-feira para cortar inveja, desânimo e pensamentos recorrentes destrutivos.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'candles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#D4AF37] border-b border-gray-900 pb-2">
              Mistérios das Velas e Cristais Protetores
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
              <p>
                <strong>As Velas</strong> agem como amplificadores mentais e pontos de ancoragem etérica. A queima da cera consome miasmas e cria um portal de comunicação focado com o plano invisível.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="p-3 rounded bg-gray-950 border border-gray-900 text-center">
                  <span className="text-white text-xl">⚪</span>
                  <h5 className="font-bold text-xs uppercase mt-1">Vela Branca</h5>
                  <p className="text-[10px] text-gray-400 mt-1">Paz de espírito, equilíbrio psíquico e elevação ao Anjo da Guarda.</p>
                </div>
                <div className="p-3 rounded bg-gray-950 border border-gray-900 text-center">
                  <span className="text-red-500 text-xl">🔴</span>
                  <h5 className="font-bold text-xs uppercase mt-1">Vela Vermelha</h5>
                  <p className="text-[10px] text-gray-400 mt-1">Ação rápida, paixão equilibrada, determinação e conexão com Pombo Giras.</p>
                </div>
                <div className="p-3 rounded bg-gray-950 border border-gray-900 text-center">
                  <span className="text-indigo-400 text-xl">🔮</span>
                  <h5 className="font-bold text-xs uppercase mt-1">Cristais de Força</h5>
                  <p className="text-[10px] text-gray-400 mt-1">Use <strong>Ametista</strong> para transmutar, ou <strong>Turmalina Preta</strong> para repelir invejas.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'psalms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="font-serif text-lg md:text-xl font-bold text-[#D4AF37] border-b border-gray-900 pb-2">
              Salmos de Alta Proteção e Firmeza
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-gray-300 leading-relaxed">
              <p>
                Os salmos bíblicos guardam uma egrégora milenar de socorro e purificação. Pronunciados em voz alta, suas vogais e entonações reorganizam a malha geométrica de proteção ao seu redor.
              </p>

              <div className="space-y-3 mt-4">
                <div className="p-3.5 rounded bg-gray-950 border border-gray-900">
                  <h4 className="font-bold text-[#D4AF37] text-xs font-serif">Salmo 91 - Contra Assaltos Espirituais e Inimigos</h4>
                  <p className="text-[11px] italic mt-1 text-gray-400">
                    "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei."
                  </p>
                </div>

                <div className="p-3.5 rounded bg-gray-950 border border-gray-900">
                  <h4 className="font-bold text-[#D4AF37] text-xs font-serif">Salmo 23 - Para Atrair Abundância e Fartura</h4>
                  <p className="text-[11px] italic mt-1 text-gray-400">
                    "O Senhor é o meu pastor, nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
