import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/layout";

export default function PaymentTest() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  // Get appointment ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = parseInt(urlParams.get('appointment') || '0');

  const testPaymentAPI = async () => {
    setLoading(true);
    console.log('Testing payment API with appointment:', appointmentId);
    
    try {
      const response = await fetch('/api/payments/create-payment-intent', {
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

      console.log('Payment test response status:', response.status);
      console.log('Payment test response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Payment test response text:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        toast({
          title: "Sucesso!",
          description: `Payment Intent criado: ${data.paymentIntentId}`,
        });
      } else {
        toast({
          title: "Erro",
          description: `Erro ${response.status}: ${responseText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Payment test error:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Teste do Sistema de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Informações de Teste</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Usuário autenticado:</span>
                    <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                      {isAuthenticated ? "Sim" : "Não"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID da consulta:</span>
                    <span>{appointmentId || "Não encontrado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuário:</span>
                    <span>{user?.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={testPaymentAPI}
                  disabled={loading || !isAuthenticated || !appointmentId}
                  className="w-full"
                >
                  {loading ? "Testando..." : "Testar API de Pagamento"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setLocation('/appointments')}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Consultas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}