import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, UserCheck, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AppointmentsList() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    retry: false,
  });

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case "telemedicine":
        return <Video className="text-blue-600" />;
      case "followup":
        return <Clock className="text-yellow-600" />;
      case "routine":
        return <UserCheck className="text-purple-600" />;
      default:
        return <Calendar className="text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
      case "rescheduled":
        return <Badge className="bg-blue-100 text-blue-800">Reagendado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments?.filter((apt: any) => 
    new Date(apt.appointmentDate) > new Date()
  ).slice(0, 3) || [];

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Próximas Consultas
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment: any) => (
              <div
                key={appointment.id}
                className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getAppointmentIcon(appointment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">
                    {appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {appointment.type === "routine" ? "Consulta de Rotina" : 
                     appointment.type === "followup" ? "Exame de Seguimento" : 
                     appointment.type === "telemedicine" ? "Teleconsulta" : appointment.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(appointment.appointmentDate), "HH:mm - HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getStatusBadge(appointment.status)}
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                    {appointment.status === "confirmed" ? "Iniciar" : "Aguardar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma consulta agendada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
