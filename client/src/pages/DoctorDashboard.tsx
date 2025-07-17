import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Video,
  FileText,
  Pill,
  Phone,
  MessageSquare,
  Settings,
  LogOut,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Plus
} from "lucide-react";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for demonstration
  const todayConsultations = [
    {
      id: 1,
      patient: "Maria Silva",
      time: "09:00",
      type: "Videoconsulta",
      status: "confirmed",
      specialty: "Cardiologia"
    },
    {
      id: 2,
      patient: "João Santos",
      time: "10:30",
      type: "Presencial",
      status: "waiting",
      specialty: "Clínica Geral"
    },
    {
      id: 3,
      patient: "Ana Costa",
      time: "14:00",
      type: "Videoconsulta",
      status: "confirmed",
      specialty: "Cardiologia"
    }
  ];

  const patients = [
    {
      id: 1,
      name: "Maria Silva",
      age: 45,
      lastVisit: "2024-07-10",
      condition: "Hipertensão",
      risk: "medium"
    },
    {
      id: 2,
      name: "João Santos",
      age: 32,
      lastVisit: "2024-07-08",
      condition: "Diabetes Tipo 2",
      risk: "high"
    },
    {
      id: 3,
      name: "Ana Costa",
      age: 28,
      lastVisit: "2024-07-05",
      condition: "Ansiedade",
      risk: "low"
    }
  ];

  const startVideoCall = (patientId: number) => {
    // Simulate starting video call
    alert(`Iniciando videochamada com paciente ${patientId}`);
  };

  const viewPatientRecord = (patientId: number) => {
    // Simulate viewing patient record
    alert(`Visualizando prontuário do paciente ${patientId}`);
  };

  const createPrescription = (patientId: number) => {
    // Simulate creating prescription
    alert(`Criando receita para paciente ${patientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
                <p className="text-sm text-gray-600">Dashboard Médico</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dr. Carlos Mendes</p>
                <p className="text-xs text-gray-600">Cardiologista - CRM 123456</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/security'}>
                <Settings className="h-4 w-4 mr-2" />
                Segurança & LGPD
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="consultations">Consultas</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="prescriptions">Receitas</TabsTrigger>
            <TabsTrigger value="video">Videochamadas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Consultas Hoje</p>
                      <p className="text-2xl font-bold text-blue-600">8</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                      <p className="text-2xl font-bold text-green-600">127</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receitas Emitidas</p>
                      <p className="text-2xl font-bold text-purple-600">45</p>
                    </div>
                    <Pill className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Satisfação</p>
                      <p className="text-2xl font-bold text-orange-600">98%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-blue-600">
                          {consultation.time}
                        </div>
                        <div>
                          <p className="font-medium">{consultation.patient}</p>
                          <p className="text-sm text-gray-600">{consultation.specialty}</p>
                        </div>
                        <Badge variant={consultation.status === 'confirmed' ? 'default' : 'secondary'}>
                          {consultation.status === 'confirmed' ? 'Confirmada' : 'Aguardando'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {consultation.type === 'Videoconsulta' && (
                          <Button size="sm" onClick={() => startVideoCall(consultation.id)}>
                            <Video className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => viewPatientRecord(consultation.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Prontuário
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gerenciar Consultas</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Consulta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayConsultations.map((consultation) => (
                    <div key={consultation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{consultation.patient}</h3>
                          <p className="text-sm text-gray-600">{consultation.specialty}</p>
                        </div>
                        <Badge variant={consultation.status === 'confirmed' ? 'default' : 'secondary'}>
                          {consultation.status === 'confirmed' ? 'Confirmada' : 'Aguardando'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{consultation.time} - {consultation.type}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Mensagem
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Ligar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.age} anos - {patient.condition}</p>
                          <p className="text-xs text-gray-500">Última consulta: {patient.lastVisit}</p>
                        </div>
                        <Badge variant={
                          patient.risk === 'high' ? 'destructive' : 
                          patient.risk === 'medium' ? 'default' : 'secondary'
                        }>
                          {patient.risk === 'high' ? 'Alto Risco' : 
                           patient.risk === 'medium' ? 'Risco Médio' : 'Baixo Risco'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => viewPatientRecord(patient.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Prontuário
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => createPrescription(patient.id)}>
                          <Pill className="h-4 w-4 mr-1" />
                          Receita
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startVideoCall(patient.id)}>
                          <Video className="h-4 w-4 mr-1" />
                          Videochamada
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas Médicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema de Receitas</h3>
                  <p className="text-gray-600 mb-4">Crie e gerencie prescrições médicas digitais</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Receita
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Videoconsultas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Iniciar Videochamada</h3>
                    <p className="text-gray-600 mb-4">Comece uma nova consulta por vídeo</p>
                    <Button>
                      <Video className="h-4 w-4 mr-2" />
                      Iniciar Chamada
                    </Button>
                  </div>
                  
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chamadas Agendadas</h3>
                    <p className="text-gray-600 mb-4">Visualize suas próximas videoconsultas</p>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Agenda
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}