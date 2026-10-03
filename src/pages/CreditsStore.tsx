import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Coins, ShieldCheck, Check, RefreshCw } from 'lucide-react';
import { CreditPlan } from '../types/spiritual';

function generateClientUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export const CreditsStore: React.FC = () => {
  const { user, apiFetch, setUserCredits } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const paymentIdempotencyRef = useRef<Record<string, string>>({});

  const plans: CreditPlan[] = [
    {
      id: 'prata',
      name: 'Plano Prata',
      price: 50.00,
      credits: 30,
      badge: 'BÁSICO',
      color: 'from-slate-800 to-slate-900',
    },
    {
      id: 'ouro',
      name: 'Plano Ouro',
      price: 100.00,
      credits: 65,
      badge: 'MELHOR VALOR',
      color: 'from-amber-950 to-amber-900',
    },
    {
      id: 'diamante',
      name: 'Plano Diamante',
      price: 150.00,
      credits: 110,
      badge: 'RECOMENDADO',
      color: 'from-red-950 to-red-900',
    }
  ];

  const handleOpenPayment = async (plan: CreditPlan) => {
    try {
      setFeedback(null);
      setIsProcessing(true);
      setProcessingPlanId(plan.id);

      const idempotencyKey = paymentIdempotencyRef.current[plan.id] || generateClientUUID();
      paymentIdempotencyRef.current[plan.id] = idempotencyKey;

      const response = await apiFetch('/api/create-payment', {
        method: 'POST',
        body: JSON.stringify({
          planId: plan.id,
          idempotencyKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao iniciar pagamento.');
      }

      if (data.isMock) {
        // In local development or when MP token is not yet provisioned
        setFeedback({
          type: 'success',
          message: `Ordem de teste ${data.orderId} gerada com sucesso! Em ambiente real, você será redirecionado para o Mercado Pago.`,
        });
        setIsProcessing(false);
        setProcessingPlanId(null);
        return;
      }

      if (!data.init_point) {
        throw new Error('Link de pagamento não foi retornado pelo Mercado Pago.');
      }

      window.location.href = data.init_point;
    } catch (error: any) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao iniciar pagamento.',
      });
      setIsProcessing(false);
      setProcessingPlanId(null);
    }
  };

  return (
    <div id="mp_store_portal" className="mx-auto max-w-5xl px-4 py-8 text-white">
      <div className="mb-8 text-center">
        <Coins className="mx-auto mb-2 h-10 w-10 animate-bounce text-[#D4AF37]" />

        <h2 className="bg-gradient-to-b from-white to-[#D4AF37] bg-clip-text font-serif text-2xl font-extrabold tracking-wide text-transparent md:text-4xl">
          Comprar Créditos
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-xs text-gray-300 md:text-sm">
          Escolha um plano e finalize o pagamento no checkout oficial do Mercado Pago.
          Cada pergunta/consulta oracular consome 5 créditos.
        </p>

        {user && (
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-black/70 px-4 py-2 text-xs">
            <Coins className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-gray-300">Saldo atual:</span>
            <strong className="text-[#D4AF37]">{user.credits} créditos</strong>
          </div>
        )}

        {feedback && (
          <div
            className={`mx-auto mt-4 max-w-md rounded-xl p-3 text-xs ${
              feedback.type === 'error'
                ? 'border border-red-800 bg-red-950/60 text-red-200'
                : 'border border-green-800 bg-green-950/60 text-green-200'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>

      <div id="store_plans_grid" className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            id={`plan_card_${plan.id}`}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 bg-black/70 p-6 shadow-md transition-all hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.18)]"
          >
            {plan.badge && (
              <span className="absolute right-4 top-3 rounded-full bg-gradient-to-r from-yellow-500 to-[#D4AF37] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase text-black shadow">
                {plan.badge}
              </span>
            )}

            <div>
              <h4 className="mb-1 font-serif text-lg font-bold text-white">
                {plan.name}
              </h4>

              <div className="my-4 flex items-baseline gap-1">
                <span className="font-mono text-[10px] text-gray-400">R$</span>
                <span className="text-4xl font-extrabold text-white">
                  {plan.price.toFixed(0)}
                </span>
                <span className="font-mono text-xs text-gray-400">,00</span>
              </div>

              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-900/20 bg-red-950/20 px-3 py-3">
                <Coins className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <span className="block text-sm font-bold text-[#D4AF37]">
                    {plan.credits} créditos
                  </span>
                  <span className="block font-mono text-[9px] text-gray-400">
                    Aproximadamente R$ {(plan.price / plan.credits).toFixed(2)} por crédito
                  </span>
                </div>
              </div>

              <ul className="space-y-2 border-t border-gray-900 pt-3 text-[11px] text-gray-300">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Conversa direta com Maria Padilha
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Todas as perguntas no mesmo chat
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  5 créditos por pergunta/consulta
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Pagamento seguro pelo Mercado Pago
                </li>
              </ul>
            </div>

            <button
              id={`btn_buy_${plan.id}`}
              type="button"
              onClick={() => handleOpenPayment(plan)}
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-gradient-to-r from-red-800 to-red-700 px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow transition-all hover:from-red-700 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing && processingPlanId === plan.id ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Abrindo Mercado Pago...
                </>
              ) : (
                'Comprar Créditos'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-2xl items-center gap-3.5 rounded-xl border border-gray-900 bg-gray-950/50 p-4">
        <ShieldCheck className="h-8 w-8 shrink-0 text-green-500" />
        <div className="text-left text-xs leading-normal">
          <h5 className="font-bold text-white">
            Checkout oficial Mercado Pago
          </h5>
          <p className="mt-0.5 text-[11px] text-gray-400">
            O pagamento será finalizado fora do app, no ambiente seguro do Mercado Pago.
            Após aprovação, os créditos precisam ser liberados pela confirmação do pagamento no backend/webhook.
          </p>
        </div>
      </div>
    </div>
  );
};