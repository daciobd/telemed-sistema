import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Heart,
  MessageSquare
} from 'lucide-react';

interface PsychiatryPreConsultationProps {
  appointmentId: number;
  onStartConsultation: () => void;
}

export default function PsychiatryPreConsultation({ appointmentId, onStartConsultation }: PsychiatryPreConsultationProps) {
  const [, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Check if assessment is completed
  const { data: assessment } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/psychological-assessment`],
    retry: false,
  });

  // Check if questionnaire is completed
  const { data: questionnaire } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/psychiatry-questionnaire`],
    retry: false,
  });

  const isAssessmentCompleted = !!assessment;
  const isQuestionnaireCompleted = !!questionnaire;
  const allCompleted = isAssessmentCompleted && isQuestionnaireCompleted;

  const assessmentProgress = isAssessmentCompleted ? 100 : 0;
  const questionnaireProgress = isQuestionnaireCompleted ? 100 : 0;
  const totalProgress = (assessmentProgress + questionnaireProgress) / 2;

  const startAssessment = () => {
    setLocation(`/psychiatry-assessment/${appointmentId}`);
  };

  const startQuestionnaire = () => {
    setLocation(`/psychiatry-questionnaire/${appointmentId}`);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'high': 
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <CardTitle>Preparação para Consulta Psiquiátrica</CardTitle>
                  <p className="text-gray-600 text-sm">
                    Complete a avaliação e questionário antes da consulta para otimizar seu atendimento
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{Math.round(totalProgress)}%</div>
                <div className="text-sm text-gray-600">Concluído</div>
              </div>
            </div>
            <Progress value={totalProgress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Assessment Summary */}
        {isAssessmentCompleted && assessment && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Avaliação Psicológica Concluída
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{assessment.phq9Score || 0}</div>
                  <div className="text-sm text-gray-600">PHQ-9</div>
                  <div className="text-xs text-gray-500">Depressão</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{assessment.gad7Score || 0}</div>
                  <div className="text-sm text-gray-600">GAD-7</div>
                  <div className="text-xs text-gray-500">Ansiedade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{assessment.stressLevel}/10</div>
                  <div className="text-sm text-gray-600">Estresse</div>
                  <div className="text-xs text-gray-500">Nível atual</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{assessment.sleepQuality}/10</div>
                  <div className="text-sm text-gray-600">Sono</div>
                  <div className="text-xs text-gray-500">Qualidade</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Nível de Risco:</span>
                <Badge className={`${getRiskLevelColor(assessment.riskLevel)} flex items-center gap-1`}>
                  {getRiskLevelIcon(assessment.riskLevel)}
                  {assessment.riskLevel === 'low' ? 'Baixo' : 
                   assessment.riskLevel === 'medium' ? 'Moderado' : 
                   assessment.riskLevel === 'high' ? 'Alto' : 'Urgente'}
                </Badge>
              </div>

              {assessment.recommendedActions && assessment.recommendedActions.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">Recomendações:</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {assessment.recommendedActions.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Psychological Assessment */}
          <Card className={isAssessmentCompleted ? 'border-green-200' : 'border-blue-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className={`h-6 w-6 ${isAssessmentCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                Avaliação Psicológica
                {isAssessmentCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              </CardTitle>
              <Progress value={assessmentProgress} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Questionário breve para avaliar seus níveis atuais de ansiedade, depressão, 
                estresse e qualidade do sono. Inclui escalas PHQ-9 e GAD-7.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Tempo estimado: 5-8 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span>4 etapas de avaliação</span>
                </div>
              </div>

              {isAssessmentCompleted ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Avaliação concluída
                </div>
              ) : (
                <Button 
                  onClick={startAssessment}
                  className="w-full flex items-center gap-2"
                >
                  Iniciar Avaliação
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Psychiatry Questionnaire */}
          <Card className={isQuestionnaireCompleted ? 'border-green-200' : 'border-purple-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className={`h-6 w-6 ${isQuestionnaireCompleted ? 'text-green-600' : 'text-purple-600'}`} />
                Questionário Detalhado
                {isQuestionnaireCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
              </CardTitle>
              <Progress value={questionnaireProgress} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Informações detalhadas sobre sintomas, histórico médico, estilo de vida 
                e objetivos do tratamento para personalizar sua consulta.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Tempo estimado: 10-15 minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <span>5 seções detalhadas</span>
                </div>
              </div>

              {isQuestionnaireCompleted ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Questionário concluído
                </div>
              ) : (
                <Button 
                  onClick={startQuestionnaire}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  disabled={!isAssessmentCompleted}
                >
                  Preencher Questionário
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              
              {!isAssessmentCompleted && (
                <p className="text-xs text-gray-500">
                  Complete a avaliação psicológica primeiro
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Start Consultation */}
        {allCompleted && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-lg font-medium">Preparação Concluída!</span>
                </div>
                <p className="text-green-700">
                  Você completou todos os passos preparatórios. 
                  Agora pode iniciar sua consulta psiquiátrica com informações detalhadas.
                </p>
                <Button 
                  onClick={onStartConsultation}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Iniciar Consulta
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Por que fazer a preparação?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium">Consulta Mais Eficiente</h4>
                <p className="text-sm text-gray-600">
                  O médico terá informações prévias para focar no que é mais importante
                </p>
              </div>
              <div className="text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium">Cuidado Personalizado</h4>
                <p className="text-sm text-gray-600">
                  Tratamento adaptado ao seu perfil e necessidades específicas
                </p>
              </div>
              <div className="text-center">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium">Melhor Diagnóstico</h4>
                <p className="text-sm text-gray-600">
                  Avaliação mais precisa com dados estruturados e padronizados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}