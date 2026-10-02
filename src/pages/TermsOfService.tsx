import React from 'react';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 text-white">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 rounded-lg border border-red-900/40 bg-zinc-950 px-4 py-2 text-xs text-gray-300 hover:text-white cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
        Voltar à Página Principal
      </button>

      <div className="rounded-3xl border border-[#D4AF37]/30 bg-black/85 p-6 md:p-10 backdrop-blur-md shadow-[0_0_35px_rgba(139,0,0,0.25)]">
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          <BookOpen className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#D4AF37]">
              Termos de Uso e Condições de Serviço
            </h1>
            <p className="text-xs text-gray-400">
              Vigência a partir de Outubro de 2026 | Portal Maria Padilha Rainha das 7 Encruzilhadas
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs md:text-sm text-gray-200 leading-relaxed font-sans">
          <section className="rounded-xl border border-red-900/30 bg-red-950/20 p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 text-[#D4AF37] mt-0.5" />
            <div>
              <h2 className="font-serif text-sm font-bold text-[#D4AF37] mb-1">
                Aviso Importante sobre Conteúdo Espiritual e Oracular
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                As consultas, jogos de tarot, conchas de búzios e diálogos oferecidos nesta plataforma constituem um serviço de orientação espiritual, simbólica e interpretativa.
                Não garantem resultados absolutos, riqueza fácil, retorno amoroso garantido ou cura de enfermidades, e <strong>jamais substituem acompanhamento médico, psicológico, psiquiátrico, jurídico ou financeiro profissional</strong>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">1. Aceitação e Elegibilidade</h2>
            <p>
              Ao criar uma conta ou utilizar os serviços do Portal Maria Padilha, você declara ser maior de 18 anos e concorda plenamente com estes Termos de Uso e com nossa Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">2. Sistema de Créditos e Pagamentos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cada pergunta ou consulta oracular paga (Chat com Maria Padilha, Tarot, Jogo de Búzios, Odù Ifá, Numerologia, Cabala, Astrologia, conselho de Pombo Gira ou Compatibilidade Amorosa) consome exatamente 5 créditos. Mensagens de simples atendimento, saudação ou suporte não consom créditos (0 créditos).</li>
              <li>A aquisição de créditos é realizada através de pacotes pré-pagos seguros processados pelo Mercado Pago.</li>
              <li>Em caso de falha técnica comprovada no servidor ou indisponibilidade da IA durante uma consulta, o sistema efetua o estorno automático integral dos 5 créditos debitados naquela transação.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">3. Responsabilidade do Usuário</h2>
            <p>
              O usuário é o único responsável pela guarda e sigilo de suas credenciais de login e pelas decisões tomadas a partir de suas interpretações e de seu livre-arbítrio. É estritamente proibido o uso da plataforma para fins ilegais, difamação ou assédio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">4. Propriedade Intelectual</h2>
            <p>
              Todos os elementos visuais, textos rituais, marcas, artes e códigos-fonte pertencem exclusivamente ao Portal Vip Brasil, sendo vedada a reprodução comercial sem prévia autorização por escrito.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">5. Contato e Suporte</h2>
            <p>
              Para dúvidas sobre pagamentos, créditos ou funcionamento da plataforma, entre em contato pelo e-mail:{' '}
              <a href="mailto:brasilportalvip@gmail.com" className="text-[#D4AF37] underline">
                brasilportalvip@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
