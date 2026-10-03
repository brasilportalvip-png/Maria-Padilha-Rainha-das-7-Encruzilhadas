import React from 'react';
import { LogOut, User, Coins, Crown, Mail, Phone, Calendar, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const UserPanel: React.FC = () => {
  const { user, logout } = useApp();

  if (!user) return null;

  const planoAtual =
    user.lastPlanId === 'prata'
      ? 'Plano Prata'
      : user.lastPlanId === 'ouro'
      ? 'Plano Ouro'
      : user.lastPlanId === 'diamante'
      ? 'Plano Diamante'
      : 'Nenhum plano comprado ainda';

  return (
    <div className="w-full max-w-md mx-auto bg-black/90 border-2 border-red-700 rounded-2xl p-5 shadow-[0_0_25px_rgba(185,28,28,0.6)] text-white">
      <div className="flex items-center gap-3 mb-4">
       <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-black">
  <img
    src="/image/Maria Padilha Logo.png"
    alt="Maria Padilha Rainha das 7 Encruzilhadas"
    className="w-full h-full object-cover"
  />
</div>

        <div>
          <h2 className="text-lg font-bold text-yellow-300">
            {user.fullName || 'Usuário'}
          </h2>
          <p className="text-xs text-red-200">Painel do Consulente</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between bg-red-950/50 rounded-xl p-3 border border-red-800">
          <span className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-300" />
            Créditos
          </span>
          <strong className="text-yellow-300 text-lg">{user.credits ?? 0}</strong>
        </div>

        <div className="flex items-center justify-between bg-red-950/50 rounded-xl p-3 border border-red-800">
          <span className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-300" />
            Plano atual
          </span>
          <strong className="text-yellow-300">{planoAtual}</strong>
        </div>

        <div className="bg-black/50 rounded-xl p-3 border border-red-900 space-y-2">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-300" />
            {user.email}
          </p>

          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-300" />
            {user.phone || 'Telefone não informado'}
          </p>

          {user.birthDate && (
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-300" />
              {user.birthDate} {user.birthTime ? `(${user.birthTime})` : ''}
            </p>
          )}
        </div>

        <div className="bg-black/50 rounded-xl p-3 border border-red-900">
          <p><strong>Nível:</strong> {user.level || 1}</p>
          <p><strong>XP:</strong> {user.xp || 0}</p>
          <p><strong>Última compra:</strong> {user.lastPlanId ? planoAtual : 'Nenhuma'}</p>
        </div>
      </div>


{user.role === 'admin' && (
  <button
    type="button"
    onClick={() => window.location.href = '/admin'}
    className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-xl border border-purple-500 transition-all"
  >
    👑 Painel Administrativo
  </button>
)}



      <button
        onClick={logout}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-red-800 hover:bg-red-700 text-white font-bold py-3 rounded-xl border border-red-500 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sair da Conta
      </button>
    </div>
  );
};