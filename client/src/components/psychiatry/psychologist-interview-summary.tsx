import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Brain, Clock, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface PsychologistInterviewSummaryProps {
  appointmentId: number;
}

export default function PsychologistInterviewSummary({ appointmentId }: PsychologistInterviewSummaryProps) {
  const { data: interview, isLoading } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/psychologist-interview`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!interview || interview.status !== 'completed') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Entrevista Pendente</CardTitle>
          </div>
          <CardDescription>
            A entrevista com a psicóloga ainda não foi realizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Aguardando entrevista
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Resumo Psicodinâmico</CardTitle>
          </div>
          <CardDescription>
            Avaliação realizada pela psicóloga para orientar o tratamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Psicóloga</span>
              </div>
              <p className="text-sm text-gray-700">Dra. Ana Silva</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Duração</span>
              </div>
              <p className="text-sm text-gray-700">
                {interview.duration ? `${interview.duration} minutos` : 'Duração personalizada'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={interview.urgencyLevel === 'urgent' ? 'destructive' : 
                     interview.urgencyLevel === 'high' ? 'outline' : 'secondary'}
            >
              {interview.urgencyLevel === 'urgent' && <AlertCircle className="h-3 w-3 mr-1" />}
              Urgência: {interview.urgencyLevel || 'baixa'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {interview.psychodynamicSummary && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Resumo Psicodinâmico</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interview.psychodynamicSummary}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interview.personalityProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Perfil de Personalidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {interview.personalityProfile}
              </p>
            </CardContent>
          </Card>
        )}

        {interview.copingMechanisms && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mecanismos de Enfrentamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {interview.copingMechanisms}
              </p>
            </CardContent>
          </Card>
        )}

        {interview.interpersonalPatterns && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Padrões Interpessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {interview.interpersonalPatterns}
              </p>
            </CardContent>
          </Card>
        )}

        {interview.emotionalRegulation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regulação Emocional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {interview.emotionalRegulation}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {interview.treatmentRecommendations && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Recomendações de Tratamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interview.treatmentRecommendations}
            </p>
          </CardContent>
        </Card>
      )}

      {(interview.strengths || interview.riskFactors) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interview.strengths && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-green-700">Pontos Fortes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {interview.strengths}
                </p>
              </CardContent>
            </Card>
          )}

          {interview.riskFactors && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-orange-700">Fatores de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {interview.riskFactors}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}