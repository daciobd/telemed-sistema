import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, User, Video, Plus, X, Brain, Info, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppointmentModal from "@/components/modals/appointment-modal";
import TestVideoCall from "@/components/video/test-video-call";
import PsychiatryAppointmentCard from "@/components/appointments/psychiatry-appointment-card";

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<{
    appointmentId: number;
    patientName?: string;
    doctorName?: string;
  } | null>(null);
  const [location] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Extract doctor filter from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get('doctorId');
    if (doctorId) {
      setSelectedDoctorId(parseInt(doctorId));
    }
  }, [location]);

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

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
    retry: false,
  });

  // Filter appointments by selected doctor if needed
  const appointmentsArray = Array.isArray(appointments) ? appointments : [];
  const filteredAppointments = selectedDoctorId 
    ? appointmentsArray.filter((apt: any) => apt.doctor?.id === selectedDoctorId)
    : appointmentsArray;

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      await apiRequest("PUT", `/api/appointments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Sucesso",
        description: "Agendamento atualizado com sucesso!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Erro",
        description: "Falha ao atualizar agendamento.",
        variant: "destructive",
      });
    },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "telemedicine":
        return <Video className="h-4 w-4" />;
      case "routine":
        return <User className="h-4 w-4" />;
      case "followup":
        return <Calendar className="h-4 w-4" />;
      case "emergency":
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "scheduled":
        return "Agendado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      case "rescheduled":
        return "Reagendado";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "routine":
        return "Consulta de Rotina";
      case "followup":
        return "Retorno";
      case "emergency":
        return "Urgência";
      case "telemedicine":
        return "Teleconsulta";
      case "teleconsult":
        return "Teleconsulta";
      default:
        return type;
    }
  };

  const startVideoCall = (appointment: any) => {
    const isDoctor = user?.role === 'doctor';
    const callData = {
      appointmentId: appointment.id,
      patientName: isDoctor ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : undefined,
      doctorName: !isDoctor ? `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : undefined
    };
    setActiveVideoCall(callData);
  };

  const endVideoCall = () => {
    setActiveVideoCall(null);
    toast({
      title: "Consulta Finalizada",
      description: "A videochamada foi encerrada com sucesso.",
    });
  };

  if (activeVideoCall) {
    return (
      <TestVideoCall
        appointmentId={activeVideoCall.appointmentId}
        isDoctor={user?.role === 'doctor'}
        patientName={activeVideoCall.patientName}
        doctorName={activeVideoCall.doctorName}
        onEndCall={endVideoCall}
      />
    );
  }

  return (
    <Layout>
      <div className="p-4 lg:p-6">
        {/* Alert para demonstrar psiquiatria */}
        {user?.role === 'patient' && (
          <Alert variant="info" className="mb-6">
            <Brain className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Sistema de Psiquiatria Especializado:</strong> Preparação completa com avaliação psicológica, questionário detalhado e entrevista opcional com psicóloga.
              </div>
              <Button 
                onClick={() => window.location.href = '/psychiatry-consultation/12'}
                className="bg-purple-600 hover:bg-purple-700 ml-4"
                size="sm"
              >
                <Brain className="h-4 w-4 mr-2" />
                Acessar Preparação
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600">Gerencie suas consultas e horários</p>
            {selectedDoctorId && (
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">
                  Filtrado por médico
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedDoctorId(null);
                    window.history.pushState({}, '', '/appointments');
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover filtro
                </Button>
              </div>
            )}
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </Button>
        </div>

      <Card>
            <CardHeader>
              <CardTitle>Lista de Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAppointments && filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment: any) => {
                    // Check if it's a psychiatry appointment
                    const isPsychiatry = appointment.specialty === 'psychiatry' || 
                                       appointment.notes?.toLowerCase().includes('psiquiatria') ||
                                       appointment.notes?.toLowerCase().includes('psiquiátrica') ||
                                       appointment.notes?.toLowerCase().includes('mental') ||
                                       appointment.notes?.toLowerCase().includes('ansiedade') ||
                                       appointment.notes?.toLowerCase().includes('depressão');
                    
                    if (isPsychiatry) {
                      return <PsychiatryAppointmentCard key={appointment.id} appointment={appointment} isDoctor={user?.role === 'doctor'} />;
                    }
                    
                    return (
                    <div 
                      key={appointment.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(appointment.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">
                          {appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getTypeText(appointment.type)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(appointment.appointmentDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                        {appointment.doctor && (
                          <button
                            onClick={() => {
                              setSelectedDoctorId(appointment.doctor.id);
                              window.history.pushState({}, '', `/appointments?doctorId=${appointment.doctor.id}`);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            Dr. {appointment.doctor.user?.firstName} {appointment.doctor.user?.lastName}
                          </button>
                        )}
                        {appointment.notes && (
                          <p className="text-sm text-gray-400 mt-1 truncate">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusText(appointment.status)}
                        </Badge>
                        
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            {appointment.status === "scheduled" && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentMutation.mutate({
                                  id: appointment.id,
                                  status: "confirmed"
                                })}
                                disabled={updateAppointmentMutation.isPending}
                              >
                                Confirmar
                              </Button>
                            )}
                            
                            {appointment.status === "confirmed" && appointment.type === "teleconsult" && (
                              <Button
                                size="sm"
                                onClick={() => startVideoCall(appointment)}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                              >
                                <Video className="h-4 w-4" />
                                Videochamada
                              </Button>
                            )}
                            
                            {appointment.status === "confirmed" && appointment.type !== "teleconsult" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentMutation.mutate({
                                  id: appointment.id,
                                  status: "completed"
                                })}
                                disabled={updateAppointmentMutation.isPending}
                              >
                                Concluir
                              </Button>
                            )}
                          </div>
                          
                          {/* Botão de Pagamento - sempre visível para pacientes */}
                          {user?.role === 'patient' && (
                            <Button
                              size="sm"
                              onClick={() => window.location.href = `/payment-checkout?appointment=${appointment.id}`}
                              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CreditCard className="h-4 w-4" />
                              Pagar R$ 150,00
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum agendamento encontrado</p>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Criar primeiro agendamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        
{/* Appointment Modal temporarily disabled */}
      </div>
    </Layout>
  );
}
