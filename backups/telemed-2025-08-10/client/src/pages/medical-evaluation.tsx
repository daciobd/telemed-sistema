import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MedicalEvaluationForm from "@/components/evaluation/medical-evaluation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

interface MedicalEvaluationPageProps {
  appointmentId: number;
}

export default function MedicalEvaluationPage({ appointmentId }: MedicalEvaluationPageProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: appointment, isLoading: appointmentLoading } = useQuery({
    queryKey: ["/api/appointments", appointmentId],
    queryFn: async () => {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (!response.ok) throw new Error('Failed to fetch appointment');
      return response.json();
    },
    enabled: isAuthenticated && !!appointmentId,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (appointmentLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados da consulta...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Consulta não encontrada
                </h3>
                <p className="text-gray-500">
                  Não foi possível encontrar os dados desta consulta.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const doctorName = appointment.doctor 
    ? `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
    : "Médico";

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Avaliação do Atendimento
              </h1>
              <p className="text-gray-600">
                Sua opinião é muito importante para melhorarmos nossos serviços
              </p>
            </div>

            <MedicalEvaluationForm 
              appointmentId={appointmentId}
              doctorName={doctorName}
              onComplete={() => {
                window.location.href = "/appointments";
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}