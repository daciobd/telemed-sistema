import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  FileText, 
  Video, 
  Clock, 
  Stethoscope,
  Plus,
  Search
} from "lucide-react";
import AppointmentModal from "@/components/modals/appointment-modal";

export default function DoctorQuickActions() {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const quickActions = [
    {
      title: "Nova Consulta",
      description: "Agendar consulta",
      icon: Calendar,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setShowAppointmentModal(true),
    },
    {
      title: "Ver Pacientes",
      description: "Lista de pacientes",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
      action: () => window.location.href = "/patients",
    },
    {
      title: "Prontuários",
      description: "Registros médicos",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => window.location.href = "/medical-records",
    },
    {
      title: "Teleconsulta",
      description: "Iniciar videochamada",
      icon: Video,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => window.location.href = "/videoconsultas",
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <span>Ações Rápidas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center space-y-2 transition-colors ${action.color} text-white border-0 p-3`}
                onClick={action.action}
              >
                <action.icon className="h-7 w-7 flex-shrink-0" />
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="font-medium text-sm leading-tight mb-1">{action.title}</div>
                  <div className="text-xs opacity-90 leading-tight">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AppointmentModal 
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />
    </>
  );
}