import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Calendar, Heart } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Patients() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["/api/patients"],
    retry: false,
    enabled: isAuthenticated && (user?.role === "doctor" || user?.role === "admin"),
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

  if (user?.role === "patient") {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Restrito</h3>
                  <p className="text-gray-500">
                    Esta seção é disponível apenas para médicos e administradores.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Pacientes</h1>
              <p className="text-gray-600">Lista completa de pacientes cadastrados</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              {patientsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : patients && patients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map((patient: any) => (
                    <Card key={patient.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {patient.user.firstName} {patient.user.lastName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {patient.user.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {patient.phone && (
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{patient.phone}</span>
                            </div>
                          )}
                          
                          {patient.dateOfBirth && (
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(patient.dateOfBirth), "dd/MM/yyyy")}
                              </span>
                            </div>
                          )}
                          
                          {patient.bloodType && (
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Heart className="h-4 w-4" />
                              <span>Tipo sanguíneo: {patient.bloodType}</span>
                            </div>
                          )}
                          
                          {patient.allergies && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                Alergias registradas
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Button variant="outline" size="sm" className="w-full">
                            Ver Prontuário
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum paciente encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
