import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface PsychologistInterviewSimpleProps {
  appointmentId: number;
}

export default function PsychologistInterviewSimple({ appointmentId }: PsychologistInterviewSimpleProps) {
  const [, setLocation] = useLocation();
  const [isScheduled, setIsScheduled] = useState(() => {
    // Check if interview was already scheduled
    return localStorage.getItem(`interview-scheduled-${appointmentId}`) === 'true';
  });

  const scheduleInterview = () => {
    setIsScheduled(true);
    localStorage.setItem(`interview-scheduled-${appointmentId}`, 'true');
    // Trigger a custom event to update other components
    window.dispatchEvent(new CustomEvent('interview-scheduled', { detail: { appointmentId } }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation('/psychiatry-consultation/12')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Preparação
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entrevista com Psicóloga</h1>
            <p className="text-gray-600">
              Avaliação psicodinâmica para preparação da consulta psiquiátrica
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  {isScheduled ? 'Entrevista Agendada' : 'Agendar Entrevista'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isScheduled ? (
                  <>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">Sobre a Entrevista</h3>
                      <p className="text-purple-800 text-sm">
                        Esta entrevista opcional com uma psicóloga especializada cria um resumo 
                        psicodinâmico detalhado que auxilia o psiquiatra na personalização do 
                        tratamento e abordagem terapêutica.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Psicóloga Disponível</label>
                          <div className="p-3 border rounded-lg bg-gray-50">
                            <div className="font-medium">Dra. Ana Maria Silva</div>
                            <div className="text-sm text-gray-600">CRP: 12345-SP</div>
                            <div className="text-sm text-gray-600">Especialista em Psicodinâmica</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Data e Horário</label>
                          <div className="p-3 border rounded-lg bg-gray-50">
                            <div className="font-medium">Hoje, 15:00</div>
                            <div className="text-sm text-gray-600">Duração: até 60 minutos</div>
                            <div className="text-sm text-gray-600">Modalidade: Videochamada</div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={scheduleInterview}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="lg"
                      >
                        Confirmar Agendamento
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">Entrevista Agendada com Sucesso!</h3>
                      <p className="text-green-700 mt-2">
                        Sua entrevista com a Dra. Ana Maria Silva está confirmada para hoje às 15:00.
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <div className="font-medium">Próximos Passos:</div>
                      <ul className="text-sm space-y-1 text-green-800">
                        <li>• Você receberá um link de videochamada por email</li>
                        <li>• A psicóloga criará um resumo psicodinâmico</li>
                        <li>• O resumo será enviado ao psiquiatra antes da consulta</li>
                        <li>• Isso permitirá uma consulta mais personalizada</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => setLocation('/psychiatry-consultation/12')}
                      variant="outline"
                      className="w-full"
                    >
                      Voltar para Preparação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Informações</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-sm">Duração</div>
                  <div className="text-sm text-gray-600">30-60 minutos (flexível)</div>
                </div>
                <div>
                  <div className="font-medium text-sm">Modalidade</div>
                  <div className="text-sm text-gray-600">Videochamada online</div>
                </div>
                <div>
                  <div className="font-medium text-sm">Objetivo</div>
                  <div className="text-sm text-gray-600">Avaliação psicodinâmica para personalização do tratamento</div>
                </div>
                <div>
                  <div className="font-medium text-sm">Resultado</div>
                  <div className="text-sm text-gray-600">Resumo detalhado enviado ao psiquiatra</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefícios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• Consulta psiquiátrica mais personalizada</div>
                <div>• Abordagem terapêutica direcionada</div>
                <div>• Melhor compreensão do perfil psicológico</div>
                <div>• Tratamento mais eficaz</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}