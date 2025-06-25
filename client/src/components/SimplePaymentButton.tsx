import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';

interface SimplePaymentButtonProps {
  appointmentId: number;
  amount?: number;
}

export function SimplePaymentButton({ appointmentId, amount = 150 }: SimplePaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create payment intent directly from button click
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          appointmentId: appointmentId,
          amount: amount,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Sessão Expirada",
            description: "Redirecionando para login...",
            variant: "destructive",
          });
          window.location.href = "/api/login";
          return;
        }
        throw new Error(`Payment failed: ${response.status}`);
      }

      const { clientSecret } = await response.json();
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Load Stripe and redirect to checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create a simple form for Stripe checkout
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/appointments?payment=success`,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error: any) {
      toast({
        title: "Erro no Pagamento",
        description: error.message || "Falha ao processar pagamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? "Processando..." : `💳 Pagar R$ ${amount},00`}
    </Button>
  );
}