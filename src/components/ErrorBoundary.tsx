import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-800/40 bg-zinc-950 p-6 text-center shadow-[0_0_35px_rgba(185,28,28,0.4)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-red-950/40 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-xl font-bold text-[#D4AF37] mb-2">
              Oscilação no Portal Espiritual
            </h2>

            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              Ocorreu uma instabilidade temporária na interface. Seus créditos e histórico de leituras permanecem em segurança.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-800 to-red-650 py-3 text-xs font-bold uppercase tracking-wider text-white hover:from-red-700 hover:to-red-600 transition-all cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              Recarregar o Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
