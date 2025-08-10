import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/layout";

export default function PaymentSuccess() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get appointment ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = parseInt(urlParams.get('appointment') || '0');

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
    if (!appointmentId || !isAuthenticated) return;

    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointment');
        }
        const appointment = await response.json();
        setAppointmentDetails(appointment);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da consulta.",
          variant: "destructive",
        });
        setLocation('/consultas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, isAuthenticated, toast, setLocation]);

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !appointmentId) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pagamento Realizado com Sucesso!
            </h1>
            <p className="text-gray-600">
              Sua consulta foi confirmada e você receberá uma confirmação por email
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Detalhes da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Médico</label>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        Dr. {appointmentDetails?.doctor?.firstName} {appointmentDetails?.doctor?.lastName}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Especialidade</label>
                    <p className="text-gray-900 mt-1">{appointmentDetails?.doctor?.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data e Horário</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {appointmentDetails?.appointmentDate && 
                          format(new Date(appointmentDetails.appointmentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Duração</label>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{appointmentDetails?.duration} minutos</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">Valor Pago:</span>
                  <span className="text-green-900 font-bold text-lg">
                    R$ {appointmentDetails?.amount || '150,00'}
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Status: Pagamento confirmado
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Você receberá um email de confirmação com os detalhes da consulta</li>
              <li>• Um lembrete será enviado 24 horas antes da consulta</li>
              <li>• Acesse a seção "Videoconsultas" para participar da consulta online</li>
              <li>• Tenha seus documentos e exames em mãos no dia da consulta</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/consultas')}
              className="flex-1"
            >
              Ver Minhas Consultas
            </Button>
            <Button
              onClick={() => setLocation('/dashboard')}
              className="flex-1"
            >
              Voltar ao Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}