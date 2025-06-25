import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import PsychologistInterviewScheduler from '@/components/psychiatry/psychologist-interview-scheduler';
import PsychologistInterviewSummary from '@/components/psychiatry/psychologist-interview-summary';

export default function PsychologistInterviewPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const appointmentId = params.id ? parseInt(params.id) : 0;

  const { data: interview, isLoading } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/psychologist-interview`],
  });

  const { data: appointment } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation('/appointments')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entrevista Pré-Consulta</h1>
            <p className="text-gray-600">
              {appointment ? `Consulta de ${appointment.type} agendada` : 'Preparação psiquiátrica'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {interview && interview.status === 'completed' ? (
              <PsychologistInterviewSummary appointmentId={appointmentId} />
            ) : (
              <PsychologistInterviewScheduler 
                appointmentId={appointmentId}
                onComplete={() => {
                  // Refresh the page to show updated status
                  window.location.reload();
                }}
              />
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Sobre a Entrevista</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Objetivo</h4>
                  <p className="text-gray-600">
                    A psicóloga realizará uma avaliação psicodinâmica personalizada, dedicando o tempo 
                    necessário (até 60 minutos) para compreender seu caso e criar um resumo detalhado 
                    que auxiliará o psiquiatra na personalização do seu tratamento.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">O que será avaliado</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Estrutura de personalidade</li>
                    <li>• Mecanismos de defesa</li>
                    <li>• Padrões relacionais</li>
                    <li>• Regulação emocional</li>
                    <li>• Recursos e vulnerabilidades</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Benefícios</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Consulta mais direcionada</li>
                    <li>• Tratamento personalizado</li>
                    <li>• Melhor compreensão do caso</li>
                    <li>• Abordagem terapêutica otimizada</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span>Flexível (até 60 min)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Formato:</span>
                  <span>Videoconsulta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span>Opcional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidencial:</span>
                  <span>Sim</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}