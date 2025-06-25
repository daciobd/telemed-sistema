import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Clock, User, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/layout";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface CheckoutFormProps {
  appointmentId: number;
  appointmentDetails: any;
}

function CheckoutForm({ appointmentId, appointmentDetails }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't render if appointment details are missing critical data
  if (!appointmentDetails) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando dados da consulta...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Starting payment confirmation...');
      console.log('Appointment ID:', appointmentId);
      console.log('Stripe instance:', !!stripe);
      console.log('Elements instance:', !!elements);
      
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?appointment=${appointmentId}`,
        },
      });

      console.log('Payment confirmation result:', result);
      const { error } = result;

      if (error) {
        let errorMessage = error.message;
        
        console.log('Payment error details:', {
          code: error.code,
          type: error.type,
          message: error.message,
          decline_code: error.decline_code
        });
        
        // Provide more helpful error messages for common test scenarios
        if (error.code === 'card_declined') {
          errorMessage = "Cartão recusado. Para teste, use o cartão 4242 4242 4242 4242";
        } else if (error.code === 'expired_card') {
          errorMessage = "Cartão expirado. Use uma data futura (ex: 12/34)";
        } else if (error.code === 'incorrect_cvc') {
          errorMessage = "CVC incorreto. Use qualquer código de 3 dígitos (ex: 123)";
        } else if (error.code === 'processing_error') {
          errorMessage = "Erro de processamento. Verifique os dados do cartão de teste.";
        } else if (error.type === 'validation_error') {
          errorMessage = "Dados do cartão inválidos. Use: 4242 4242 4242 4242, 12/34, 123";
        }
        
        toast({
          title: "Erro no Pagamento",
          description: `${errorMessage} (Código: ${error.code || error.type})`,
          variant: "destructive",
        });
      } else {
        // Payment succeeded
        toast({
          title: "Pagamento Processado!",
          description: "Redirecionando para confirmação...",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erro no Pagamento",
        description: "Erro inesperado. Para teste, use: 4242 4242 4242 4242, data futura, CVC 123",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Resumo da Consulta</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Médico:</span>
            <span className="font-medium">Dr. {appointmentDetails?.doctor?.firstName} {appointmentDetails?.doctor?.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Especialidade:</span>
            <span className="font-medium">{appointmentDetails?.doctor?.specialty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Data:</span>
            <span className="font-medium">
              {appointmentDetails?.appointmentDate ? 
                format(new Date(appointmentDetails.appointmentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) :
                'Carregando...'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duração:</span>
            <span className="font-medium">{appointmentDetails?.duration} minutos</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>R$ {appointmentDetails?.amount || '150,00'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Informações de Pagamento
        </h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="font-medium text-blue-900 mb-1">Dados para teste:</p>
          <p className="text-blue-800">
            <strong>Cartão:</strong> 4242 4242 4242 4242 | 
            <strong>Data:</strong> 12/34 | 
            <strong>CVC:</strong> 123
          </p>
        </div>
        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: appointmentDetails?.patient?.firstName && appointmentDetails?.patient?.lastName 
                  ? `${appointmentDetails.patient.firstName} ${appointmentDetails.patient.lastName}`
                  : '',
                email: appointmentDetails?.patient?.email || '',
              }
            }
          }}
        />
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setLocation('/consultas')}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? 'Processando...' : `Pagar R$ ${appointmentDetails?.amount || '150,00'}`}
        </Button>
      </div>
    </form>
  );
}

export default function PaymentCheckout() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get appointment ID and client secret from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = parseInt(urlParams.get('appointment') || '0');
  const preAuthClientSecret = urlParams.get('clientSecret');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const appointmentResponse = await fetch(`/api/appointments/${appointmentId}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (appointmentResponse.ok) {
          const appointment = await appointmentResponse.json();
          setAppointmentDetails(appointment);
        }
      } catch (error) {
        console.error('Failed to fetch appointment details:', error);
      } finally {
        setLoading(false);
      }
    };

    // If we have a pre-authenticated client secret, use it directly
    if (preAuthClientSecret) {
      setClientSecret(preAuthClientSecret);
      // Still need to fetch appointment details for display
      if (appointmentId) {
        fetchAppointmentDetails();
      } else {
        setLoading(false);
      }
      return;
    }

    if (!appointmentId || isLoading) return;

    const fetchAppointmentAndCreatePayment = async () => {
      try {
        // Multiple authentication verification attempts with backoff
        let authVerified = false;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!authVerified && attempts < maxAttempts) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, attempts * 200));
          
          const authCheck = await fetch('/api/auth/user', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          });
          
          if (authCheck.ok) {
            authVerified = true;
          } else if (attempts === maxAttempts) {
            toast({
              title: "Autenticação Necessária",
              description: "Redirecionando para login...",
              variant: "destructive",
            });
            window.location.href = "/api/login";
            return;
          }
        }
        
        // Fetch appointment details
        const appointmentResponse = await fetch(`/api/appointments/${appointmentId}`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!appointmentResponse.ok) {
          throw new Error('Failed to fetch appointment');
        }
        const appointment = await appointmentResponse.json();
        setAppointmentDetails(appointment);

        // Create payment intent with authenticated session
        const paymentResponse = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            appointmentId: appointmentId,
            amount: 150,
          }),
        });

        // Handle payment API response
        const contentType = paymentResponse.headers.get('content-type');
        
        if (paymentResponse.status === 401 || contentType?.includes('text/html')) {
          toast({
            title: "Sessão Expirada",
            description: "Redirecionando para login...",
            variant: "destructive",
          });
          window.location.href = "/api/login";
          return;
        }

        if (!paymentResponse.ok) {
          const errorText = await paymentResponse.text();
          throw new Error(`Erro no pagamento: ${paymentResponse.status}`);
        }
        
        const paymentData = await paymentResponse.json();
        
        if (!paymentData.clientSecret) {
          throw new Error('Falha na criação do pagamento');
        }
        
        setClientSecret(paymentData.clientSecret);
      } catch (error: any) {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Unauthorized",
            description: "You are logged out. Logging in again...",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/api/login";
          }, 500);
          return;
        }
        
        console.error('Payment error:', error);
        toast({
          title: "Erro",
          description: error.message || "Não foi possível carregar os dados da consulta.",
          variant: "destructive",
        });
        setLocation('/appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentAndCreatePayment();
  }, [appointmentId, isAuthenticated, toast, setLocation, preAuthClientSecret]);

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do pagamento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !appointmentId) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Acesso negado ou consulta não encontrada.</p>
            <Button 
              onClick={() => setLocation('/appointments')} 
              className="mt-4"
            >
              Voltar para Consultas
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!clientSecret) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Erro no Pagamento
              </h3>
              <p className="text-gray-500 mb-4">
                Não foi possível processar o pagamento.
              </p>
              <Button onClick={() => setLocation('/consultas')}>
                Voltar às Consultas
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento da Consulta
            </h1>
            <p className="text-gray-600">
              Complete o pagamento para confirmar sua consulta médica
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Finalizar Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#2563eb',
                    }
                  }
                }}
              >
                <CheckoutForm 
                  appointmentId={appointmentId} 
                  appointmentDetails={appointmentDetails}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}