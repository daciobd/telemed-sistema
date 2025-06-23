import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import TestVideoCall from "@/components/video/test-video-call";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, User, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function VideoConsultation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCall, setActiveCall] = useState<{
    appointmentId: number;
    patientName?: string;
    doctorName?: string;
  } | null>(null);

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
  };

  const endCall = () => {
    setActiveCall(null);
    toast({
      title: "Consulta Finalizada",
      description: "A videochamada foi encerrada com sucesso.",
    });
  };

  if (activeCall) {
    return (
      <TestVideoCall
        appointmentId={activeCall.appointmentId}
        isDoctor={user?.role === 'doctor'}
        patientName={activeCall.patientName}
        doctorName={activeCall.doctorName}
        onEndCall={endCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Videoconsultas
          </h1>
          <p className="text-gray-600">
            {user?.role === 'doctor' 
              ? 'Inicie videochamadas com seus pacientes'
              : 'Participe de suas consultas online'
            }
          </p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ) : appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma videoconsulta disponível
                </h3>
                <p className="text-gray-600 mb-4">
                  {user?.role === 'doctor' 
                    ? 'Não há teleconsultas confirmadas para iniciar no momento.'
                    : 'Você não tem consultas online agendadas no momento.'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Para testar, confirme um agendamento do tipo "teleconsult" na página de agendamentos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment: any) => (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {user?.role === 'doctor' 
                          ? `Consulta com ${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`
                          : `Consulta com Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`
                        }
                      </CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Confirmada
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(appointment.appointmentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        {appointment.price && (
                          <div className="flex items-center gap-1">
                            <span>R$ {appointment.price?.toFixed(2)}</span>
                          </div>
                        )}
                      </div>

                      {appointment.reason && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Motivo da consulta:</p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Video className="h-4 w-4" />
                          <span>Teleconsulta por vídeo</span>
                        </div>
                        
                        <Button 
                          onClick={() => startVideoCall(appointment)}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Phone className="h-4 w-4" />
                          Iniciar Videochamada
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Technical Requirements Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 text-lg">
              Requisitos Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 text-sm">
              <li>• Câmera e microfone funcionais</li>
              <li>• Conexão estável com a internet</li>
              <li>• Navegador atualizado (Chrome, Firefox, Safari ou Edge)</li>
              <li>• Ambiente silencioso e com boa iluminação</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}