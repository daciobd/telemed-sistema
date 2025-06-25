import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Brain,
  Stethoscope,
  MessageSquare,
  Video
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PsychiatristResponseForm from '@/components/teleconsult/psychiatrist-response-form';
import ConsultationWorkflowStatus from '@/components/teleconsult/consultation-workflow-status';
import WorkflowInfoCard from '@/components/teleconsult/workflow-info-card';

export default function TeleconsultWorkflowPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('active-requests');

  const { data: teleconsultRequests, isLoading } = useQuery({
    queryKey: ['/api/teleconsult/requests'],
    enabled: !!user,
  });

  const { data: myAppointments } = useQuery({
    queryKey: ['/api/appointments/workflow'],
    enabled: !!user,
  });

  const getDoctorRole = () => {
    // Assuming we can detect if user is a psychiatrist
    return user?.specialty?.toLowerCase().includes('psiquiatria') ? 'psychiatrist' : 'doctor';
  };

  const renderTeleconsultRequests = () => {
    if (!teleconsultRequests?.length) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma solicitação de teleconsulta ativa no momento</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {teleconsultRequests.map((request: any) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Teleconsulta de {request.consultationType}
                </CardTitle>
                <Badge variant={request.urgency === 'urgente' ? 'destructive' : 'secondary'}>
                  {request.urgency}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Paciente:</span> {request.patientName}
                  </div>
                  <div>
                    <span className="font-medium">Valor oferecido:</span> R$ {request.offeredPrice}
                  </div>
                  <div>
                    <span className="font-medium">Tempo restante:</span> {request.timeRemaining}
                  </div>
                  <div>
                    <span className="font-medium">Tipo:</span> {request.consultationType}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-sm">Sintomas:</span>
                  <p className="text-sm text-gray-600 mt-1">{request.symptoms}</p>
                </div>

                {getDoctorRole() === 'psychiatrist' && request.consultationType.toLowerCase().includes('psiquiatria') && (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Fluxo Flexível Disponível:</strong> Você pode escolher atender imediatamente ou 
                      solicitar que o paciente faça a preparação psiquiátrica completa antes da consulta.
                    </AlertDescription>
                  </Alert>
                )}

                <PsychiatristResponseForm 
                  request={request} 
                  onResponse={() => {
                    // Refresh requests
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderMyConsultations = () => {
    if (!myAppointments?.length) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma consulta com fluxo especial no momento</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {myAppointments.map((appointment: any) => (
          <div key={appointment.id}>
            <ConsultationWorkflowStatus 
              appointmentId={appointment.id}
              userRole={user?.specialty?.toLowerCase().includes('psiquiatria') ? 'doctor' : 'patient'}
            />
          </div>
        ))}
      </div>
    );
  };



  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Teleconsultas Psiquiátricas</h1>
            <p className="text-gray-600">
              Fluxo flexível para atendimento imediato ou com preparação personalizada
            </p>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active-requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Solicitações Ativas
            </TabsTrigger>
            <TabsTrigger value="my-consultations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Minhas Consultas
            </TabsTrigger>
            <TabsTrigger value="workflow-info" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Como Funciona
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active-requests" className="space-y-4">
            {renderTeleconsultRequests()}
          </TabsContent>

          <TabsContent value="my-consultations" className="space-y-4">
            {renderMyConsultations()}
          </TabsContent>

          <TabsContent value="workflow-info" className="space-y-4">
            <WorkflowInfoCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}