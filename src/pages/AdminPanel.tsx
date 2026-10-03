import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext.js';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Users,
  History,
  Coins,
  Ban,
  CheckCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import type { UserProfile, CreditLedgerEntry } from '../types/spiritual.js';

export const AdminPanel: React.FC = () => {
  const { apiFetch } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'ledger'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [adjustUid, setAdjustUid] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Ajuste de suporte');
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [blockModal, setBlockModal] = useState<{ targetUid: string; currentStatus: boolean; reason: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const url = activeTab === 'users'
        ? '/api/admin?action=list_users'
        : '/api/admin?action=list_ledger';

      const res = await apiFetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao carregar os dados administrativos.');
      }

      if (activeTab === 'users') {
        setUsers(Array.isArray(data.users) ? data.users : []);
      } else {
        setLedger(Array.isArray(data.entries) ? data.entries : []);
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Não foi possível carregar os dados do painel administrativo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleAdjustCredits = async (targetUid: string) => {
    if (adjustAmount === 0) return;
    setStatusMessage(null);
    try {
      const res = await apiFetch('/api/admin?action=update_credits', {
        method: 'POST',
        body: JSON.stringify({
          targetUid,
          creditsDelta: Number(adjustAmount),
          reason: adjustReason,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Falha ao ajustar créditos');
      }

      setAdjustUid(null);
      setAdjustAmount(0);
      setStatusMessage({ type: 'success', text: 'Créditos ajustados com sucesso!' });
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao ajustar créditos' });
    }
  };

  const handleConfirmBlock = async () => {
    if (!blockModal) return;
    const { targetUid, currentStatus, reason } = blockModal;
    setStatusMessage(null);

    try {
      const res = await apiFetch('/api/admin?action=block_user', {
        method: 'POST',
        body: JSON.stringify({
          targetUid,
          isBlocked: !currentStatus,
          reason: reason || 'Ação administrativa',
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Falha ao alterar bloqueio');
      }

      setBlockModal(null);
      setStatusMessage({ type: 'success', text: `Usuário ${!currentStatus ? 'bloqueado' : 'desbloqueado'} com sucesso!` });
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Erro ao alterar status' });
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.fullName || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.uid || '').toLowerCase().includes(term)
    );
  });

  return (
    <div id="mp_admin_portal" className="mx-auto max-w-7xl px-4 py-8 text-white">
      <div className="mb-8 border-b border-zinc-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-purple-400" />
            Painel Geral de Auditoria Administrativa
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Ações auditadas server-side com privilégios verificados.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-900/50 bg-purple-950/30 text-xs text-purple-300 hover:bg-purple-950/60 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </button>
      </div>

      {statusMessage && (
        <div
          className={`mb-6 rounded-xl p-3 text-xs flex items-center justify-between ${
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

      {blockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-800/60 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              {blockModal.currentStatus ? 'Desbloquear Usuário' : 'Bloquear Usuário'}
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              Informe o motivo da ação administrativa para registro na trilha de auditoria:
            </p>
            <input
              type="text"
              value={blockModal.reason}
              onChange={(e) => setBlockModal({ ...blockModal, reason: e.target.value })}
              placeholder="Ex: Suspeita de fraude, solicitação do usuário, etc."
              className="w-full rounded-xl border border-zinc-800 bg-black/80 p-3 text-xs text-white mb-4 outline-none focus:border-purple-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBlockModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-gray-300 hover:bg-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmBlock}
                className="px-4 py-2 rounded-xl bg-red-700 text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="admin_tab_triggers" className="mb-6 flex gap-2 border-b border-zinc-900 pb-3">
        <button
          id="tab_admin_users"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'users' ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuários ({users.length})
        </button>

        <button
          id="tab_admin_ledger"
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'ledger' ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          Livro-Razão de Créditos ({ledger.length})
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-4 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/80">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-zinc-900/60 text-[10px] uppercase font-mono text-purple-300 border-b border-zinc-800">
                <tr>
                  <th className="p-3">Consulente</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Data Nasc. / Hora</th>
                  <th className="p-3">Saldo Créditos</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Nenhum usuário cadastrado encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-3 font-semibold text-white">
                        {u.fullName || 'Sem nome'}
                        {u.role === 'admin' && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-900/50 text-[9px] text-purple-300 font-mono">
                            ADMIN
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3">{u.birthDate || 'N/I'} • {u.birthTime || 'Hora N/I'}</td>
                      <td className="p-3 font-mono font-bold text-[#D4AF37]">{u.credits} cr</td>
                      <td className="p-3">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40 text-[10px]">
                            <Ban className="w-3 h-3" /> Bloqueado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-400 bg-green-950/40 px-2 py-0.5 rounded border border-green-800/40 text-[10px]">
                            <CheckCircle className="w-3 h-3" /> Ativo
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => { setAdjustUid(u.uid); setAdjustAmount(0); }}
                          className="px-2.5 py-1 rounded bg-zinc-800 text-[11px] text-gray-200 hover:bg-zinc-700 cursor-pointer"
                        >
                          Ajustar Créditos
                        </button>
                        <button
                          onClick={() => setBlockModal({ targetUid: u.uid, currentStatus: u.isBlocked, reason: '' })}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                            u.isBlocked
                              ? 'bg-green-950/50 text-green-300 border border-green-800/50 hover:bg-green-900/50'
                              : 'bg-red-950/50 text-red-300 border border-red-800/50 hover:bg-red-900/50'
                          }`}
                        >
                          {u.isBlocked ? 'Desbloquear' : 'Bloquear'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/80">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-zinc-900/60 text-[10px] uppercase font-mono text-purple-300 border-b border-zinc-800">
              <tr>
                <th className="p-3">Data / Hora</th>
                <th className="p-3">Usuário UID</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Saldo Anterior / Novo</th>
                <th className="p-3">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Nenhum registro no livro-razão até o momento.
                  </td>
                </tr>
              ) : (
                ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-900/30">
                    <td className="p-3 font-mono text-[11px] text-gray-400">
                      {new Date(entry.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-mono text-[11px]">{entry.uid}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        entry.type === 'purchase'
                          ? 'bg-green-950/60 text-green-300 border border-green-800/50'
                          : entry.type === 'refund'
                          ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-800/50'
                          : 'bg-zinc-900 text-gray-300'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className={`p-3 font-mono font-bold ${entry.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.amount > 0 ? `+${entry.amount}` : entry.amount} cr
                    </td>
                    <td className="p-3 font-mono text-gray-400">
                      {entry.previousBalance} → <strong className="text-white">{entry.newBalance}</strong>
                    </td>
                    <td className="p-3">{entry.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust Credits Modal */}
      {adjustUid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-purple-500/40 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="font-serif text-base font-bold text-purple-300 mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Ajuste Manual de Créditos
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Informe a variação (+30 para adicionar ou -10 para deduzir) e o motivo da alteração:
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Delta de Créditos</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-md border border-zinc-800 bg-black px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">Motivo do Ajuste</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-black px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setAdjustUid(null)}
                className="px-3 py-1.5 rounded-md border border-zinc-800 text-xs text-gray-300 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAdjustCredits(adjustUid)}
                className="px-4 py-1.5 rounded-md bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 cursor-pointer"
              >
                Confirmar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
