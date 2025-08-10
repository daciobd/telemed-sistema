import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import type { AppointmentWithDetails } from '@shared/schema';

interface PsychiatryAppointmentCardProps {
  appointment: AppointmentWithDetails;
  isDoctor?: boolean;
}

export default function PsychiatryAppointmentCard({ appointment, isDoctor = false }: PsychiatryAppointmentCardProps) {
  const [, setLocation] = useLocation();

  const isPsychiatryAppointment = appointment.specialty === 'psychiatry' || 
                                 appointment.notes?.toLowerCase().includes('psiquiatria') ||
                                 appointment.notes?.toLowerCase().includes('psiquiátrica') ||
                                 appointment.notes?.toLowerCase().includes('mental') ||
                                 appointment.notes?.toLowerCase().includes('ansiedade') ||
                                 appointment.notes?.toLowerCase().includes('depressão');

  if (!isPsychiatryAppointment) {
    return null; // Don't render for non-psychiatry appointments
  }

  const startPreparation = () => {
    setLocation(`/psychiatry-consultation/${appointment.id}`);
  };

  const startConsultation = () => {
    setLocation(`/videoconsulta/${appointment.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'confirmed': return 'Confirmada';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const isUpcoming = new Date(appointment.appointmentDate) > new Date();
  const canStartPreparation = isUpcoming && appointment.status === 'confirmed';

  return (
    <Card className="border-l-4 border-purple-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Consulta Psiquiátrica
                <Badge className={getStatusColor(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(appointment.appointmentDate)}
                </div>
                {!isDoctor && (
                  <div className="flex items-center gap-1">
                    <Stethoscope className="h-4 w-4" />
                    Dr(a) {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                  </div>
                )}
                {isDoctor && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {appointment.reason && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Motivo da Consulta:</div>
            <div className="text-sm text-gray-600">{appointment.reason}</div>
          </div>
        )}

        {appointment.notes && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Observações:</div>
            <div className="text-sm text-gray-600">{appointment.notes}</div>
          </div>
        )}

        {/* Preparation Status for Patients */}
        {!isDoctor && canStartPreparation && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-purple-900 mb-1">
                  Preparação Pré-Consulta Disponível
                </div>
                <div className="text-sm text-purple-700 mb-3">
                  Complete a avaliação psicológica e questionário antes da consulta para 
                  otimizar seu atendimento e permitir um diagnóstico mais preciso.
                </div>
                <div className="flex items-center gap-2 text-xs text-purple-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Avaliação PHQ-9 e GAD-7</span>
                  <CheckCircle className="h-3 w-3" />
                  <span>Questionário detalhado</span>
                  <CheckCircle className="h-3 w-3" />
                  <span>Análise de risco automática</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {!isDoctor && canStartPreparation && (
            <Button 
              onClick={startPreparation}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4" />
              Iniciar Preparação
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {appointment.status === 'confirmed' && isUpcoming && (
            <Button 
              variant="outline"
              onClick={startConsultation}
              className="flex items-center gap-2"
            >
              <Stethoscope className="h-4 w-4" />
              Entrar na Consulta
            </Button>
          )}

          {appointment.status === 'completed' && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Ver Resultado
            </Button>
          )}
        </div>

        {/* Benefits Info for Psychiatry */}
        {!isDoctor && appointment.status === 'scheduled' && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="font-medium mb-1">💡 Benefícios da Preparação Pré-Consulta:</div>
            <ul className="space-y-1">
              <li>• Consulta mais eficiente e focada</li>
              <li>• Diagnóstico mais preciso com dados estruturados</li>
              <li>• Tratamento personalizado para suas necessidades</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}