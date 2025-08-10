import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentButtonProps {
  appointmentId: number;
  amount?: number;
  disabled?: boolean;
  className?: string;
}

export default function PaymentButton({ 
  appointmentId, 
  amount = 150, 
  disabled = false,
  className = ""
}: PaymentButtonProps) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Redirect to payment page
      setLocation(`/payment-checkout?appointment=${appointmentId}`);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`flex items-center space-x-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      <span>
        {isLoading ? 'Carregando...' : `Pagar R$ ${amount.toFixed(2).replace('.', ',')}`}
      </span>
    </Button>
  );
}