import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.js';
import { Coins, LogOut, ShieldAlert, MessageCircle, Compass, BookOpen, Heart, Sparkles, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/chat', label: 'Chat', icon: MessageCircle },
    { to: '/readings', label: 'Oráculos', icon: Compass },
    { to: '/dashboard', label: 'Portal', icon: LayoutDashboard },
    { to: '/pombagiras', label: 'Pombo Giras', icon: Sparkles },
    { to: '/compatibility', label: 'Sintonia', icon: Heart },
    { to: '/diary', label: 'Diário', icon: BookOpen },
  ];

  return (
    <header
      id="mp_premium_header"
      className="sticky top-0 z-40 w-full border-b border-red-900/40 bg-black/90 px-4 py-2.5 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link to="/chat" className="flex min-w-0 items-center gap-2.5">
          <img
            src="/image/Maria Padilha Logo.png"
            alt="Maria Padilha Rainha das 7 Encruzilhadas"
            className="h-10 w-10 shrink-0 rounded-full border border-[#D4AF37]/50 object-cover shadow-[0_0_12px_rgba(212,175,55,0.4)]"
          />

          <div className="flex min-w-0 flex-col">
            <h1 className="truncate bg-gradient-to-r from-red-600 via-[#D4AF37] to-red-500 bg-clip-text font-serif text-sm font-bold tracking-wider text-transparent md:text-lg">
              REINO DE MARIA PADILHA
            </h1>
            <span className="truncate text-[9px] uppercase tracking-widest text-[#D4AF37]/80">
              Portal das 7 Encruzilhadas
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-red-950/80 border border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'text-gray-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            id="header_credits_badge"
            to="/credits"
            className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-red-950 to-black px-3 py-1.5 shadow-[0_0_10px_rgba(212,175,55,0.15)] hover:border-[#D4AF37]"
            title="Seus créditos espirituais"
          >
            <Coins className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold text-[#D4AF37]">
              {user.credits}
            </span>
          </Link>

          {isAdmin && (
            <Link
              id="nav_link_admin"
              to="/admin"
              className="flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-950/30 px-3 py-1.5 text-[11px] font-bold text-purple-300 hover:bg-purple-900/40"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          <button
            id="header_logout_btn"
            onClick={handleLogout}
            title="Sair da Conta"
            className="rounded-full border border-red-900/40 bg-red-950/30 p-2 text-red-300 hover:bg-red-950/60 hover:text-red-100 cursor-pointer"
            aria-label="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
