import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.js';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  Lock,
  User,
  Calendar,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const Auth: React.FC = () => {
  const { user, register, login, resetPassword, isAuthenticating } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'login';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    tabParam === 'register' ? 'register' : 'login'
  );

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab(tabParam === 'register' ? 'register' : 'login');
  }, [tabParam]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('A senha secreta deve ter no mínimo 8 caracteres.');
      return;
    }

    if (phone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Por favor, informe um telefone válido com DDD.');
      return;
    }

    try {
      await register({
        fullName,
        email: email.trim(),
        phone: phone.trim(),
        birthDate,
        birthTime: birthTime || null,
        password,
      });

      setSuccessMsg('Conta criada com sucesso! Redirecionando para o Reino...');
      setTimeout(() => navigate('/chat'), 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao criar cadastro espiritual.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await login(loginEmail.trim(), loginPassword);
      navigate('/chat');
    } catch (err: any) {
      setErrorMsg(err.message || 'Dados incorretos ou erro de autenticação.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsResetting(true);
    setErrorMsg('');
    try {
      await resetPassword(resetEmail.trim());
      setShowResetModal(false);
      setSuccessMsg('E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao enviar e-mail de recuperação.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div id="mp_auth_page" className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8 text-white">
      <motion.div
        id="mp_auth_card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-black/85 p-6 md:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(139,0,0,0.25)]"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-[#D4AF37] to-red-650" />

        <div className="mb-6 text-center flex flex-col items-center">
          <img
            src="/image/Maria Padilha Logo.png"
            alt="Maria Padilha Rainha das 7 Encruzilhadas"
            className="w-16 h-16 object-cover rounded-full border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] mb-2"
          />
          <h2 className="font-serif text-2xl font-bold tracking-wider text-[#D4AF37] mt-1">
            Consagração de Acesso
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            Ambiente espiritual protegido. Seus dados natais permanecem sob sigilo.
          </p>
        </div>

        {errorMsg && (
          <div id="auth_error_alert" className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div id="auth_success_alert" className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-950/40 p-3 text-xs text-green-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div id="auth_tab_triggers" className="mb-6 flex border-b border-gray-800">
          <button
            id="tab_login_trigger"
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-2.5 text-center text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Entrar
          </button>

          <button
            id="tab_register_trigger"
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-2.5 text-center text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login_email_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  id="login_email_input"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-gray-950 pl-10 pr-4 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="login_password_input" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Senha Secreta
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  id="login_password_input"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-gray-950 pl-10 pr-11 py-2 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white cursor-pointer"
                  aria-label={showLoginPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end text-xs">
              <button
                id="btn_forgot_password"
                type="button"
                onClick={() => { setResetEmail(loginEmail); setShowResetModal(true); }}
                className="text-[#D4AF37] hover:underline cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              id="btn_login_submit"
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-md bg-gradient-to-r from-red-800 to-red-650 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-red-700 hover:to-red-600 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,0,0,0.3)] disabled:opacity-50"
            >
              {isAuthenticating ? 'Entrando no Reino...' : 'Acessar o Reino'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[75dvh] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_name_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                  Nome Completo de Solteiro
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  <input
                    id="reg_name_input"
                    type="text"
                    placeholder="Nome completo de solteiro"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg_email_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  <input
                    id="reg_email_input"
                    type="email"
                    placeholder="exemplo@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_phone_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  <input
                    id="reg_phone_input"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg_birthdate_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                  Data de Nascimento Exata (Obrigatória)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  <input
                    id="reg_birthdate_input"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="reg_birthtime_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                Hora de Nascimento
              </label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                <input
                  id="reg_birthtime_input"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                Hora de nascimento — opcional, informe somente se souber.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg_password_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                  Senha (mínimo 8 caracteres)
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  <input
                    id="reg_password_input"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-10 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-2.5 top-1.5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg_confirmpassword_input" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-0.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                  <input
                    id="reg_confirmpassword_input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-800 bg-gray-950 pl-8 pr-10 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1.5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              id="btn_register_submit"
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-md bg-gradient-to-r from-red-800 to-red-650 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-red-700 hover:to-red-600 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,0,0,0.3)] disabled:opacity-50"
            >
              {isAuthenticating ? 'Consagrando Cadastro...' : 'Consagrar Cadastro (Ganhe 07 Créditos)'}
            </button>
          </form>
        )}
      </motion.div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/40 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-serif text-base font-bold">Recuperação de Senha</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Informe seu e-mail cadastrado para receber o link oficial de redefinição de senha enviado pelo Firebase.
            </p>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-3 py-1.5 rounded-md border border-zinc-800 text-xs text-gray-300 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-1.5 rounded-md bg-[#D4AF37] text-black font-bold text-xs hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {isResetting ? 'Enviando...' : 'Enviar Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
