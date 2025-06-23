import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Pill, 
  Activity, 
  Heart,
  TrendingUp,
  AlertTriangle,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface PatientProfileProps {
  patientId: number;
}

export default function PatientProfile({ patientId }: PatientProfileProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patient, isLoading } = useQuery({
    queryKey: [`/api/patients/${patientId}`],
  });

  const { data: appointments = [] } = useQuery({
    queryKey: [`/api/appointments/patient/${patientId}`],
  });

  const { data: prescriptions = [] } = useQuery({
    queryKey: [`/api/prescriptions/patient/${patientId}`],
  });

  const { data: medicalRecords = [] } = useQuery({
    queryKey: [`/api/medical-records/patient/${patientId}`],
  });

  const { data: vitals = [] } = useQuery({
    queryKey: [`/api/vitals/patient/${patientId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Paciente não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPatientAge = () => {
    if (!patient.dateOfBirth) return "N/A";
    const birth = new Date(patient.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'high-risk': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header do Perfil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient.user?.profileImageUrl} />
              <AvatarFallback className="text-lg">
                {patient.user?.firstName?.[0]}{patient.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {patient.user?.firstName} {patient.user?.lastName}
                </h1>
                <Badge className={getStatusColor(patient.status || 'active')}>
                  {patient.status === 'active' ? 'Ativo' : 
                   patient.status === 'inactive' ? 'Inativo' : 
                   patient.status === 'high-risk' ? 'Alto Risco' : patient.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Idade: {getPatientAge()} anos</span>
                </div>
                {patient.user?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{patient.user.email}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{patient.address}</span>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Emergência: {patient.emergencyContact}</span>
                  </div>
                )}
                {patient.insuranceProvider && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Convênio: {patient.insuranceProvider}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Consulta
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Prescrição
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas do Perfil */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescrições</TabsTrigger>
          <TabsTrigger value="records">Prontuários</TabsTrigger>
          <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  Última: {appointments[0] ? format(new Date(appointments[0].appointmentDate), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prescrições Ativas</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.length}</div>
                <p className="text-xs text-muted-foreground">
                  Última: {prescriptions[0] ? format(new Date(prescriptions[0].createdAt), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registros Médicos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicalRecords.length}</div>
                <p className="text-xs text-muted-foreground">
                  Último: {medicalRecords[0] ? format(new Date(medicalRecords[0].createdAt), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas e Informações Importantes */}
          {patient.allergies && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alergias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700">{patient.allergies}</p>
              </CardContent>
            </Card>
          )}

          {/* Histórico Recente */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...appointments.slice(0, 3), ...prescriptions.slice(0, 2)]
                .sort((a, b) => new Date(b.createdAt || b.appointmentDate).getTime() - new Date(a.createdAt || a.appointmentDate).getTime())
                .slice(0, 5)
                .map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-full bg-gray-100">
                      {item.medications ? <Pill className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.medications ? 'Prescrição emitida' : 'Consulta agendada'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.createdAt || item.appointmentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {item.status && (
                      <Badge className={getAppointmentStatusColor(item.status)}>
                        {item.status === 'confirmed' ? 'Confirmada' :
                         item.status === 'scheduled' ? 'Agendada' :
                         item.status === 'completed' ? 'Realizada' :
                         item.status === 'cancelled' ? 'Cancelada' : item.status}
                      </Badge>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultas */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Consultas</CardTitle>
              <CardDescription>
                {appointments.length} consulta{appointments.length !== 1 ? 's' : ''} registrada{appointments.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma consulta registrada
                </p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {format(new Date(apt.appointmentDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                          <Badge className={getAppointmentStatusColor(apt.status)}>
                            {apt.status === 'confirmed' ? 'Confirmada' :
                             apt.status === 'scheduled' ? 'Agendada' :
                             apt.status === 'completed' ? 'Realizada' :
                             apt.status === 'cancelled' ? 'Cancelada' : apt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}
                        </p>
                        {apt.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {apt.notes}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescrições */}
        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prescrições Médicas</CardTitle>
              <CardDescription>
                {prescriptions.length} prescrição{prescriptions.length !== 1 ? 'ões' : ''} emitida{prescriptions.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma prescrição registrada
                </p>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((presc: any) => (
                    <div key={presc.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{presc.medications}</h4>
                          <p className="text-sm text-muted-foreground">
                            Dr. {presc.doctor?.user?.firstName} {presc.doctor?.user?.lastName}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(presc.createdAt), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Dosagem:</span> {presc.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frequência:</span> {presc.frequency}
                        </div>
                        <div>
                          <span className="font-medium">Duração:</span> {presc.duration}
                        </div>
                      </div>
                      {presc.instructions && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Instruções:</span> {presc.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prontuários */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Médicos</CardTitle>
              <CardDescription>
                {medicalRecords.length} registro{medicalRecords.length !== 1 ? 's' : ''} médico{medicalRecords.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {medicalRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum registro médico encontrado
                </p>
              ) : (
                <div className="space-y-3">
                  {medicalRecords.map((record: any) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{record.diagnosis}</h4>
                          <p className="text-sm text-muted-foreground">
                            Dr. {record.doctor?.user?.firstName} {record.doctor?.user?.lastName}
                          </p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(record.createdAt), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      {record.symptoms && (
                        <div className="mb-2 text-sm">
                          <span className="font-medium">Sintomas:</span> {record.symptoms}
                        </div>
                      )}
                      {record.treatment && (
                        <div className="text-sm">
                          <span className="font-medium">Tratamento:</span> {record.treatment}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sinais Vitais */}
        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sinais Vitais</CardTitle>
              <CardDescription>
                Histórico de medições e acompanhamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">120/80</div>
                  <p className="text-sm text-muted-foreground">Pressão Arterial</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">72</div>
                  <p className="text-sm text-muted-foreground">Freq. Cardíaca</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">36.5°C</div>
                  <p className="text-sm text-muted-foreground">Temperatura</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <User className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">70kg</div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                </div>
              </div>
              
              <p className="text-center text-muted-foreground">
                Dados simulados - Integração com dispositivos médicos disponível
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}