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
      description: "Agendar consulta com paciente",
      icon: Calendar,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setShowAppointmentModal(true),
    },
    {
      title: "Ver Pacientes",
      description: "Lista de pacientes ativos",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
      action: () => window.location.href = "/patients",
    },
    {
      title: "Prontuários",
      description: "Acessar registros médicos",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => window.location.href = "/medical-records",
    },
    {
      title: "Teleconsulta",
      description: "Iniciar videochamada",
      icon: Video,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => console.log("Start teleconsultation"),
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
                className={`h-20 flex flex-col items-center justify-center space-y-2 transition-colors ${action.color} text-white border-0`}
                onClick={action.action}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
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