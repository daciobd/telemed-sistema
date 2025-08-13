import { useRenders, useRendersAdvanced, useRenderAlert } from "../dev/useRenders";
import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import VideoRoom from "@/components/video/video-room";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, User, Phone, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useParams } from "wouter";

import { usePerfMarks } from "../dev/usePerfMarks";

type Props = {};

function VideoConsultationImpl(props: Props) {
  useRenders("VideoConsultation");
  // avisa se re-renderizar demais (ajuda a achar gargalos)
  useRenderAlert("VideoConsultation", 15);
  usePerfMarks("VideoConsultation");

  const { user } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const [activeCall, setActiveCall] = useState<{
    appointmentId: number;
    patientName?: string;
    doctorName?: string;
  } | null>(null);

  // Check URL parameters for appointment ID
  useEffect(() => {
    const appointmentId = params.appointmentId;
    if (appointmentId) {
      setActiveCall({
        appointmentId: parseInt(appointmentId),
        patientName: "Paciente",
        doctorName: "Médico"
      });
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const urlAppointmentId = urlParams.get('appointment');
      if (urlAppointmentId) {
        setActiveCall({
          appointmentId: parseInt(urlAppointmentId),
          patientName: "Paciente",
          doctorName: "Médico"
        });
      }
    }
  }, [params.appointmentId]);

  // Get appointments ready for video consultation
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    select: (data: any[]) => {
      // Reduz payload - só os campos necessários
      const filtered = data.filter(appointment => 
        appointment.status === 'confirmed' && 
        appointment.type === 'teleconsult'
      );
      return filtered.map(apt => ({
        id: apt.id,
        status: apt.status,
        type: apt.type,
        date: apt.date,
        patient: apt.patient ? {
          id: apt.patient.id,
          user: {
            firstName: apt.patient.user.firstName,
            lastName: apt.patient.user.lastName
          }
        } : null,
        doctor: apt.doctor ? {
          id: apt.doctor.id,
          user: {
            firstName: apt.doctor.user.firstName,
            lastName: apt.doctor.user.lastName
          }
        } : null
      }));
    }
  });

  // Callbacks estáveis para evitar re-render
  const startVideoCall = useCallback((appointment: any) => {
    const isDoctor = user?.role === 'doctor';
    const callData = {
      appointmentId: appointment.id,
      patientName: isDoctor ? `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}` : undefined,
      doctorName: !isDoctor ? `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : undefined
    };
    
    setActiveCall(callData);
    
    toast({
      title: "Videoconsulta iniciada",
      description: "Conectando com o participante...",
    });
  }, [user?.role, toast]);

  const endVideoCall = useCallback(() => {
    setActiveCall(null);
    toast({
      title: "Videoconsulta encerrada",
      description: "A consulta foi finalizada com sucesso.",
    });
  }, [toast]);

  // Derivado memoizado para o header title
  const headerTitle = useMemo(() => {
    if (!user) return "Videoconsultas";
    return user.role === 'doctor' ? 'Atendimentos Médicos' : 'Minhas Consultas';
  }, [user?.role]);

  const appointmentStats = useMemo(() => {
    const total = appointments.length;
    const today = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const todayDate = new Date();
      return aptDate.toDateString() === todayDate.toDateString();
    }).length;
    return { total, today };
  }, [appointments]);

  if (activeCall) {
    return (
      <main role="main" aria-label="Video Consultation" className="min-h-screen bg-gray-50">
        <VideoRoom
          appointmentId={activeCall.appointmentId}
          patientName={activeCall.patientName}
          doctorName={activeCall.doctorName}
          onEndCall={endVideoCall}
        />
      </main>
    );
  }

  return (
    <main role="main" aria-label="Video Consultation Dashboard" className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{headerTitle}</h1>
          <p className="text-gray-600 mt-2">
            Realize consultas médicas por videoconferência
          </p>
          {appointmentStats.total > 0 && (
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>{appointmentStats.total} agendadas</span>
              <span>•</span>
              <span>{appointmentStats.today} hoje</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Video className="h-4 w-4" />
          <span>Sistema WebRTC</span>
        </div>
      </header>

      {isLoading ? (
        <section aria-label="Carregando consultas" className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma videoconsulta agendada
            </h3>
            <p className="text-gray-600">
              Suas videoconsultas aparecerão aqui quando agendadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <section aria-label="Lista de consultas" className="grid gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isDoctor={user?.role === 'doctor'}
              onStartCall={startVideoCall}
            />
          ))}
        </section>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Como funciona a videoconsulta
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Clique em "Iniciar Videoconsulta" para conectar</li>
                <li>• Permita acesso à câmera e microfone quando solicitado</li>
                <li>• Use o chat integrado para comunicação adicional</li>
                <li>• Compartilhe sua tela se necessário</li>
                <li>• Finalize a consulta quando concluída</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

// Componente de carta isolado para evitar re-render desnecessário
const AppointmentCard = memo(function AppointmentCard({
  appointment,
  isDoctor,
  onStartCall,
}: {
  appointment: any;
  isDoctor: boolean;
  onStartCall: (appointment: any) => void;
}) {
  useRenders("AppointmentCard"); // opcional p/ ver se caiu a contagem

  // calcula uma única vez por mudança de data
  const appointmentDate = useMemo(
    () => new Date(appointment.date),
    [appointment.date]
  );

  // deriva "outra parte" sem criar objetos novos
  const otherParty = isDoctor ? appointment.patient : appointment.doctor;

  const handleStart = useCallback(() => {
    onStartCall(appointment);
  }, [appointment, onStartCall]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isDoctor ? 'Atendimento' : 'Consulta'} com {" "}
            {otherParty?.user ? `${otherParty.user.firstName} ${otherParty.user.lastName}` : 'Participante'}
          </CardTitle>
          <Badge variant="secondary">
            {appointment.status === 'confirmed' ? 'Confirmada' : appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {format(appointmentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {format(appointmentDate, "HH:mm", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {isDoctor ? 'Paciente' : 'Médico'}: {" "}
                {otherParty?.user ? `${otherParty.user.firstName} ${otherParty.user.lastName}` : 'N/A'}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleStart}
              size="sm"
              className="flex items-center space-x-2"
              aria-label={`Iniciar videoconsulta com ${otherParty?.user ? `${otherParty.user.firstName} ${otherParty.user.lastName}` : 'participante'}`}
            >
              <Video className="h-4 w-4" />
              <span>Iniciar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Evita re-render do topo quando props estáveis
export default memo(VideoConsultationImpl);