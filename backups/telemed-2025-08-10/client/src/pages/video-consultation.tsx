import { useState, useEffect } from "react";
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

export default function VideoConsultation() {
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
    select: (data: any[]) => data.filter(appointment => 
      appointment.status === 'confirmed' && 
      appointment.type === 'teleconsult'
    )
  });

  const startVideoCall = (appointment: any) => {
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
  };

  const endVideoCall = () => {
    setActiveCall(null);
    toast({
      title: "Videoconsulta encerrada",
      description: "A consulta foi finalizada com sucesso.",
    });
  };

  if (activeCall) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VideoRoom
          appointmentId={activeCall.appointmentId}
          patientName={activeCall.patientName}
          doctorName={activeCall.doctorName}
          onEndCall={endVideoCall}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videoconsultas</h1>
          <p className="text-gray-600 mt-2">
            Realize consultas médicas por videoconferência
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Video className="h-4 w-4" />
          <span>Sistema WebRTC</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma consulta disponível
            </h3>
            <p className="text-gray-500">
              Não há consultas confirmadas para videochamada no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment: any) => {
            const isDoctor = user?.role === 'doctor';
            const otherParty = isDoctor ? appointment.patient : appointment.doctor;
            const appointmentDate = new Date(appointment.appointmentDate);

            return (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {isDoctor 
                              ? `${otherParty.user.firstName} ${otherParty.user.lastName}`
                              : `Dr. ${otherParty.user.firstName} ${otherParty.user.lastName}`
                            }
                          </h3>
                          <p className="text-sm text-gray-500">
                            {isDoctor ? 'Paciente' : otherParty.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{format(appointmentDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{format(appointmentDate, "HH:mm", { locale: ptBR })}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {appointment.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Phone className="h-3 w-3 mr-1" />
                          Teleconsulta
                        </Badge>
                        <Badge variant="outline">
                          {appointment.status === 'confirmed' ? 'Confirmada' : appointment.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="ml-6">
                      <Button
                        onClick={() => startVideoCall(appointment)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Iniciar Videoconsulta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}