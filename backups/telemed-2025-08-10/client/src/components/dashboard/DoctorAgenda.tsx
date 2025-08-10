import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Phone,
  Calendar,
  User,
  FileText,
  Camera
} from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";

interface AppointmentStatus {
  id: number;
  patientName: string;
  patientId: number;
  scheduledTime: string;
  status: 'scheduled' | 'confirmed' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  specialty: string;
  type: 'teleconsulta' | 'presencial';
  isPatientOnline?: boolean;
  lastActivity?: string;
  notes?: string;
}

export default function DoctorAgenda() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: todayAppointments = [], isLoading } = useQuery({
    queryKey: ['/api/appointments'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'confirmed': return 'Confirmado';
      case 'waiting': return 'Aguardando';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const startVideoCall = (appointmentId: number) => {
    window.location.href = `/videoconsulta/${appointmentId}`;
  };

  const openMedicalRecord = (appointmentId: number) => {
    // Open medical record in new tab or modal
    window.open(`/medical-record/${appointmentId}`, '_blank');
  };

  const isAppointmentTime = (scheduledTime: string) => {
    const appointmentTime = new Date(scheduledTime);
    const timeDiff = Math.abs(currentTime.getTime() - appointmentTime.getTime());
    return timeDiff <= 15 * 60 * 1000; // Within 15 minutes
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agenda do Dia</h2>
          <p className="text-gray-600">
            {format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            {format(currentTime, "HH:mm")}
          </div>
          <div className="text-sm text-gray-500">
            {todayAppointments.length} consultas hoje
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {!Array.isArray(todayAppointments) || todayAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma consulta agendada
              </h3>
              <p className="text-gray-500">
                Você não tem consultas agendadas para hoje.
              </p>
            </CardContent>
          </Card>
        ) : (
          (todayAppointments as any[]).filter((apt: any) => 
            apt.status === 'waiting' || isToday(new Date(apt.appointmentDate))
          ).map((appointment: any) => (
            <Card 
              key={appointment.id}
              className={`transition-all duration-200 hover:shadow-md ${
                appointment.status === 'waiting' ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {appointment.patient?.firstName?.[0] || 'P'}
                        {appointment.patient?.lastName?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </h3>
                        
                        {/* Waiting indicator - pulsing camera */}
                        {appointment.status === 'waiting' && (
                          <div className="flex items-center space-x-1">
                            <Camera className="h-4 w-4 text-yellow-500 animate-pulse" />
                            <span className="text-xs text-yellow-600 animate-pulse font-medium">
                              AGUARDANDO
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(appointment.appointmentDate), "HH:mm")}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Video className="h-4 w-4" />
                          <span>Teleconsulta</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(appointment.status)} text-white`}
                        >
                          {getStatusText(appointment.status)}
                        </Badge>
                        
                        {appointment.appointmentType && (
                          <Badge variant="outline">
                            {appointment.appointmentType}
                          </Badge>
                        )}

                        {isAppointmentTime(appointment.appointmentDate) && (
                          <Badge className="bg-green-100 text-green-700">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Horário da consulta
                          </Badge>
                        )}
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{appointment.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {/* Video call button - prominent when waiting */}
                    {(appointment.status === 'waiting' || appointment.status === 'confirmed') && (
                      <Button
                        onClick={() => startVideoCall(appointment.id)}
                        className={`${
                          appointment.status === 'waiting' 
                            ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        size="sm"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {appointment.status === 'waiting' ? 'Atender Agora' : 'Iniciar'}
                      </Button>
                    )}

                    {/* Medical record button */}
                    <Button
                      onClick={() => openMedicalRecord(appointment.id)}
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Prontuário
                    </Button>

                    {/* Contact patient button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Open WhatsApp or phone contact
                        window.open(`tel:${appointment.patient?.phone || ''}`, '_blank');
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contato
                    </Button>
                  </div>
                </div>

                {/* Patient online status */}
                {appointment.isPatientOnline && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">
                        Paciente online - Último acesso: {appointment.lastActivity || 'agora'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Array.isArray(todayAppointments) ? (todayAppointments as any[]).filter((a: any) => a.status === 'confirmed').length : 0}
            </div>
            <div className="text-sm text-gray-600">Confirmadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(todayAppointments) ? (todayAppointments as any[]).filter((a: any) => a.status === 'completed').length : 0}
            </div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Array.isArray(todayAppointments) ? (todayAppointments as any[]).filter((a: any) => isToday(new Date(a.appointmentDate))).length : 0}
            </div>
            <div className="text-sm text-gray-600">Hoje</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {Array.isArray(todayAppointments) ? todayAppointments.length : 0}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}