import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Lock, FileText, Trash2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.js';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { user, apiFetch, logout } = useApp();
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    if (!user) {
      setStatusMessage({ type: 'error', text: 'Faça login para solicitar a exportação de seus dados.' });
      return;
    }
    setStatusMessage(null);
    try {
      const res = await apiFetch('/api/account?action=export_data');
      if (!res.ok) throw new Error('Falha ao exportar dados.');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meus_dados_maria_padilha_${user.uid}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Arquivo de dados exportado com sucesso!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Erro ao exportar dados: ' + err.message });
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmationInput !== 'QUERO_EXCLUIR_MINHA_CONTA') {
      setStatusMessage({ type: 'error', text: 'Frase de confirmação incorreta. Digite exatamente: QUERO_EXCLUIR_MINHA_CONTA' });
      return;
    }

    setIsDeleting(true);
    setStatusMessage(null);
    try {
      const res = await apiFetch('/api/account?action=delete_account', {
        method: 'POST',
        body: JSON.stringify({ confirmation: 'QUERO_EXCLUIR_MINHA_CONTA' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir conta.');
      setShowDeleteModal(false);
      await logout();
      navigate('/');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Erro ao excluir conta: ' + err.message });
    } finally {
      setIsDeleting(false);
    }
  };

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
          <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#D4AF37]">
              Política de Privacidade e Proteção de Dados (LGPD)
            </h1>
            <p className="text-xs text-gray-400">
              Última atualização: Outubro de 2026 | Conformidade com a Lei Federal nº 13.709/2018
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs md:text-sm text-gray-200 leading-relaxed font-sans">
          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">1. Identificação do Controlador</h2>
            <p>
              O portal espiritual <strong>Maria Padilha — Rainha das 7 Encruzilhadas</strong> é operado por{' '}
              <strong>Portal Vip Brasil</strong>, atuando como controlador no tratamento dos dados pessoais coletados nesta plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">2. Dados Pessoais Coletados e Finalidade</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dados de Cadastro:</strong> Nome completo, e-mail e telefone para identificação e comunicação segura de acesso.</li>
              <li><strong>Dados Natais:</strong> Data de nascimento, hora e cidade de nascimento utilizados exclusivamente como base permanente para cálculos oraculares e numerológicos do usuário.</li>
              <li><strong>Diário Espiritual e Histórico:</strong> Registros de sonhos, sinais e leituras anteriores solicitados pelo próprio usuário.</li>
              <li><strong>Dados Transacionais de Pagamento:</strong> Processados de forma criptografada pelo intermediador Mercado Pago. Não armazenamos números de cartão de crédito.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">3. Uso de Inteligência Artificial (Google Gemini)</h2>
            <p>
              Para a interpretação dos oráculos, o sistema canaliza leituras através de APIs server-side seguras da tecnologia Google Gemini.
              Apenas os dados de consulta necessários e os resultados numéricos do oráculo são transmitidos de forma minimizada, sem envio de senhas, telefones ou dados de pagamento.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">4. Armazenamento, Segurança e Retenção</h2>
            <p>
              Os dados são armazenados em infraestrutura segura em nuvem (Google Firebase e Vercel), protegidos por regras estritas de segurança de acesso, autenticação de sessão e criptografia em trânsito (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">5. Seus Direitos como Titular (Art. 18 da LGPD)</h2>
            <p className="mb-4">
              Você possui o direito de confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou inexatos, solicitar a portabilidade e requerer a exclusão definitiva de sua conta.
            </p>

            {user && (
              <div className="flex flex-wrap gap-4 mt-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] hover:bg-zinc-800 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exportar Meus Dados (JSON)
                </button>

                <button
                  onClick={() => {
                    setDeleteConfirmationInput('');
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 border border-red-800/40 text-xs font-bold text-red-300 hover:bg-red-900/40 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Minha Conta Permanentemente
                </button>
              </div>
            )}
          </section>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center justify-between ${
                statusMessage.type === 'error'
                  ? 'border border-red-800 bg-red-950/60 text-red-200'
                  : 'border border-green-800 bg-green-950/60 text-green-200'
              }`}
            >
              <span>{statusMessage.text}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-gray-400 hover:text-white ml-2 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl border border-red-800/80 bg-zinc-950 p-6 shadow-2xl">
                <h3 className="font-serif text-lg font-bold text-red-500 mb-2">
                  Exclusão Definitiva de Conta (LGPD)
                </h3>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                  ATENÇÃO: Esta ação é irreversível. Todos os seus dados, histórico de consultas, créditos e acessos serão permanentemente apagados de nossos servidores.
                </p>
                <p className="text-xs text-yellow-400 font-bold mb-2">
                  Para confirmar, digite exatamente abaixo:
                </p>
                <p className="font-mono text-xs bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 text-center mb-4 select-all text-white">
                  QUERO_EXCLUIR_MINHA_CONTA
                </p>
                <input
                  type="text"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  placeholder="Digite aqui para confirmar"
                  className="w-full rounded-xl border border-zinc-800 bg-black/80 p-3 text-xs text-white mb-4 outline-none focus:border-red-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-gray-300 hover:bg-zinc-700 cursor-pointer disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDeleteAccount}
                    disabled={isDeleting || deleteConfirmationInput !== 'QUERO_EXCLUIR_MINHA_CONTA'}
                    className="px-4 py-2 rounded-xl bg-red-700 text-xs font-bold text-white hover:bg-red-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Excluindo...' : 'Excluir Definitivamente'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <section>
            <h2 className="font-serif text-base font-bold text-[#D4AF37] mb-2">6. Canal de Privacidade e Proteção de Dados</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Para dúvidas, esclarecimentos ou solicitações relativas à privacidade e proteção de dados pessoais sob a LGPD (Lei nº 13.709/2018), entre em contato com nossa equipe pelo e-mail:{' '}
              <a href="mailto:brasilportalvip@gmail.com" className="text-[#D4AF37] underline">
                brasilportalvip@gmail.com
              </a>.
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              *Nota legal sobre retenção: Em caso de solicitação de exclusão, seus dados de identificação, perfil e diário espiritual serão imediatamente apagados de nossos servidores. Registros contábeis e fiscais de transações de crédito são retidos em formato anonimizado estritamente para o cumprimento de obrigações legais e regulatórias (Marco Civil da Internet, Lei nº 12.965/2014, e art. 16, I da LGPD).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
