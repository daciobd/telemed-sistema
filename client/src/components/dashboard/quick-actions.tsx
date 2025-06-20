import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Calendar, Users } from "lucide-react";
import AppointmentModal from "@/components/modals/appointment-modal";
import { useAuth } from "@/hooks/useAuth";

export default function QuickActions() {
  const { user } = useAuth();
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  return (
    <>
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {user?.role === "patient" && (
            <>
              <Button 
                className="w-full flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsAppointmentModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Agendar Consulta</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center space-x-3 hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4" />
                <span>Ver Consultas</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center space-x-3 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                <span>Meus Exames</span>
              </Button>
            </>
          )}

          {user?.role === "doctor" && (
            <>
              <Button 
                className="w-full flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsAppointmentModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Nova Consulta</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center space-x-3 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                <span>Nova Prescrição</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center space-x-3 hover:bg-gray-50"
              >
                <Search className="h-4 w-4" />
                <span>Buscar Paciente</span>
              </Button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Button 
                className="w-full flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsAppointmentModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Nova Consulta</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center space-x-3 hover:bg-gray-50"
              >
                <Users className="h-4 w-4" />
                <span>Gerenciar Usuários</span>
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center space-x-3 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                <span>Relatórios</span>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
}
