import { useQuery } from "@tanstack/react-query";
import type { PatientWithUser } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  AlertCircle,
  Calendar,
  FileText
} from "lucide-react";

export default function DoctorPatients() {
  const { data: patients = [], isLoading } = useQuery<PatientWithUser[]>({
    queryKey: ["/api/patients"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentPatients = patients.slice(0, 5);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRiskLevel = (patient: any) => {
    // Simple risk assessment based on age and medical history
    const age = patient.dateOfBirth ? 
      new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 0;
    
    if (age > 65 || patient.allergies || patient.medicalHistory) {
      return { level: "Alto", color: "bg-red-100 text-red-800" };
    } else if (age > 50) {
      return { level: "Médio", color: "bg-yellow-100 text-yellow-800" };
    }
    return { level: "Baixo", color: "bg-green-100 text-green-800" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Pacientes Recentes</span>
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum paciente encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPatients.map((patient: any) => {
              const risk = getRiskLevel(patient);
              return (
                <div key={patient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {getInitials(patient.user?.firstName, patient.user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {patient.user?.firstName} {patient.user?.lastName}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone || "Não informado"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{patient.user?.email}</span>
                          </div>
                        </div>
                        {patient.bloodType && (
                          <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>Tipo sanguíneo: {patient.bloodType}</span>
                          </div>
                        )}
                        {patient.allergies && (
                          <div className="flex items-center space-x-1 mt-1 text-sm text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span>Alergias: {patient.allergies}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={risk.color}>
                        Risco {risk.level}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Agendar
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Prontuário
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}