import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext.js';
import { BackgroundEffects } from './components/BackgroundEffects.js';
import { Header } from './components/Header.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';

// Core Pages
import { Entrance } from './pages/Entrance.js';
import { Auth } from './pages/Auth.js';
import { Chat } from './pages/Chat.js';
import { CreditsStore } from './pages/CreditsStore.js';
import { AdminPanel } from './pages/AdminPanel.js';
import { PrivacyPolicy } from './pages/PrivacyPolicy.js';
import { TermsOfService } from './pages/TermsOfService.js';

// Lazy loaded feature pages (Code Splitting - Ponto 63)
const Readings = lazy(() => import('./pages/Readings.js').then((m) => ({ default: m.Readings })));
const PomboGiras = lazy(() => import('./pages/PomboGiras.js').then((m) => ({ default: m.PomboGiras })));
const LoveCompatibility = lazy(() => import('./pages/LoveCompatibility.js').then((m) => ({ default: m.LoveCompatibility })));
const Diary = lazy(() => import('./pages/Diary.js').then((m) => ({ default: m.Diary })));
const Library = lazy(() => import('./pages/Library.js').then((m) => ({ default: m.Library })));
const Dashboard = lazy(() => import('./pages/Dashboard.js').then((m) => ({ default: m.Dashboard })));

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  return user ? <>{children}</> : <Navigate to="/auth?tab=login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const isAdmin = user && user.role === 'admin';
  return user && isAdmin ? <>{children}</> : <Navigate to="/chat" replace />;
};

function LoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-[#D4AF37] font-serif text-sm">
      Canalizando frequências espirituais...
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className="relative min-h-screen font-sans antialiased text-white selection:bg-red-800 selection:text-white flex flex-col justify-between overflow-x-hidden">
      <BackgroundEffects />

      {!isChat && <Header />}

      <main className="relative z-10 w-full flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Entrance />} />
            <Route path="/auth" element={<Auth />} />

            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/readings"
              element={
                <PrivateRoute>
                  <Readings />
                </PrivateRoute>
              }
            />

            <Route
              path="/pombagiras"
              element={
                <PrivateRoute>
                  <PomboGiras />
                </PrivateRoute>
              }
            />

            <Route
              path="/compatibility"
              element={
                <PrivateRoute>
                  <LoveCompatibility />
                </PrivateRoute>
              }
            />

            <Route
              path="/diary"
              element={
                <PrivateRoute>
                  <Diary />
                </PrivateRoute>
              }
            />

            <Route
              path="/library"
              element={
                <PrivateRoute>
                  <Library />
                </PrivateRoute>
              }
            />

            <Route
              path="/credits"
              element={
                <PrivateRoute>
                  <CreditsStore />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            <Route path="/privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos" element={<TermsOfService />} />

            <Route path="/login" element={<Navigate to="/auth?tab=login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isChat && (
        <footer className="relative z-20 border-t border-red-950/60 bg-black/90 py-8 px-4 text-center text-xs text-gray-400">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-serif text-sm text-[#D4AF37] font-bold">
                Reino de Maria Padilha Rainha das 7 Encruzilhadas
              </span>
              <p className="text-[11px] text-gray-400 mt-1 max-w-md">
                Orientação espiritual e interpretativa. Respeito irrestrito a todas as crenças e ao livre-arbítrio.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-300">
              <Link to="/" className="hover:text-[#D4AF37] transition-colors">Início</Link>
              <Link to="/privacidade" className="hover:text-[#D4AF37] transition-colors">Política de Privacidade (LGPD)</Link>
              <Link to="/termos" className="hover:text-[#D4AF37] transition-colors">Termos de Uso</Link>
              <a href="mailto:brasilportalvip@gmail.com" className="hover:text-[#D4AF37] transition-colors">Contato & Suporte</a>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-900 pt-4 text-[10px] text-gray-400">
            © {new Date().getFullYear()} Portal Vip Brasil. Todos os direitos reservados.
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
