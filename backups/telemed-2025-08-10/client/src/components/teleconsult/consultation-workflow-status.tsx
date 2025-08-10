import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Calendar, 
  ArrowRight,
  Brain,
  FileText,
  Users
} from 'lucide-react';

interface ConsultationWorkflowStatusProps {
  appointmentId: number;
  userRole: 'patient' | 'doctor';
}

export default function ConsultationWorkflowStatus({ appointmentId, userRole }: ConsultationWorkflowStatusProps) {
  const { data: appointment, isLoading } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/workflow-status`],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: preparationStatus } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/preparation-status`],
    enabled: appointment?.requiresPreparation,
    refetchInterval: 30000,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'not_required': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPreparationProgress = () => {
    if (!preparationStatus) return 0;
    
    let completed = 0;
    let total = 3;
    
    if (preparationStatus.psychologicalAssessment) completed++;
    if (preparationStatus.psychiatryQuestionnaire) completed++;
    if (preparationStatus.psychologistInterview) completed++;
    
    return (completed / total) * 100;
  };

  const canAdvanceConsultation = () => {
    return preparationStatus?.riskLevel === 'high' || preparationStatus?.riskLevel === 'urgent';
  };

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Status da Consulta de Psiquiatria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Agendamento #{appointmentId}</div>
              <div className="text-sm text-gray-600">
                {appointment?.appointmentDate && new Date(appointment.appointmentDate).toLocaleString('pt-BR')}
              </div>
            </div>
            <Badge className={getStatusColor(appointment?.status)}>
              {appointment?.status === 'scheduled' && 'Agendada'}
              {appointment?.status === 'preparation_requested' && 'Preparação Solicitada'}
              {appointment?.status === 'preparation_in_progress' && 'Preparação em Andamento'}
              {appointment?.status === 'ready_for_consultation' && 'Pronta para Consulta'}
              {appointment?.status === 'completed' && 'Concluída'}
            </Badge>
          </div>

          {/* Preparation Status */}
          {appointment?.requiresPreparation && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Preparação Psiquiátrica</span>
                <Badge className={getStatusColor(appointment.preparationStatus)}>
                  {appointment.preparationStatus === 'requested' && 'Solicitada'}
                  {appointment.preparationStatus === 'in_progress' && 'Em Andamento'}
                  {appointment.preparationStatus === 'completed' && 'Concluída'}
                </Badge>
              </div>
              
              <Progress value={getPreparationProgress()} className="h-2" />
              
              <div className="text-sm text-gray-600">
                {appointment.preparationMessage}
              </div>

              {/* Preparation Steps */}
              {preparationStatus && (
                <div className="grid md:grid-cols-3 gap-3 mt-4">
                  <div className={`p-3 rounded-lg border ${
                    preparationStatus.psychologicalAssessment ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {preparationStatus.psychologicalAssessment ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">Avaliação Psicológica</span>
                    </div>
                    {preparationStatus.psychologicalAssessment && (
                      <div className="text-xs text-gray-600 mt-1">
                        PHQ-9: {preparationStatus.phq9Score} | GAD-7: {preparationStatus.gad7Score}
                      </div>
                    )}
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    preparationStatus.psychiatryQuestionnaire ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {preparationStatus.psychiatryQuestionnaire ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">Questionário Detalhado</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    preparationStatus.psychologistInterview ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {preparationStatus.psychologistInterview ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">Entrevista (Opcional)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Assessment Alert */}
              {preparationStatus?.riskLevel && (
                <div className={`p-3 rounded-lg ${
                  preparationStatus.riskLevel === 'urgent' ? 'bg-red-50 border border-red-200' :
                  preparationStatus.riskLevel === 'high' ? 'bg-orange-50 border border-orange-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      preparationStatus.riskLevel === 'urgent' ? 'text-red-600' :
                      preparationStatus.riskLevel === 'high' ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                    <span className="font-medium text-sm">
                      Nível de Risco: {preparationStatus.riskLevel === 'urgent' ? 'Urgente' :
                      preparationStatus.riskLevel === 'high' ? 'Alto' :
                      preparationStatus.riskLevel === 'moderate' ? 'Moderado' : 'Baixo'}
                    </span>
                  </div>
                  
                  {canAdvanceConsultation() && userRole === 'doctor' && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Antecipar Consulta
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {userRole === 'patient' && appointment?.requiresPreparation && appointment?.preparationStatus !== 'completed' && (
              <Button className="flex-1">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar Preparação
              </Button>
            )}
            
            {userRole === 'doctor' && appointment?.preparationStatus === 'completed' && (
              <Button className="flex-1">
                <User className="h-4 w-4 mr-2" />
                Iniciar Consulta
              </Button>
            )}
            
            {appointment?.status === 'scheduled' && !appointment?.requiresPreparation && (
              <Button className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Entrar na Consulta
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Doctor Summary Card (for doctors when preparation is complete) */}
      {userRole === 'doctor' && preparationStatus && appointment?.preparationStatus === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumo da Preparação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Escores de Avaliação:</span>
                <div className="mt-1">
                  PHQ-9: {preparationStatus.phq9Score}/27 | GAD-7: {preparationStatus.gad7Score}/21
                </div>
              </div>
              <div>
                <span className="font-medium">Nível de Risco:</span>
                <div className="mt-1">
                  <Badge className={getStatusColor(preparationStatus.riskLevel)}>
                    {preparationStatus.riskLevel === 'urgent' ? 'Urgente' :
                     preparationStatus.riskLevel === 'high' ? 'Alto' :
                     preparationStatus.riskLevel === 'moderate' ? 'Moderado' : 'Baixo'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {preparationStatus.psychologistSummary && (
              <div>
                <span className="font-medium text-sm">Resumo Psicodinâmico:</span>
                <div className="text-sm text-gray-600 mt-1">
                  {preparationStatus.psychologistSummary}
                </div>
              </div>
            )}
            
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Ver Preparação Completa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}