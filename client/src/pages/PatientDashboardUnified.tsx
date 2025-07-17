import React, { useState } from 'react';
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  FileText,
  Pill,
  Video,
  Heart,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  MessageSquare,
  Download,
  Star,
  TrendingUp
} from "lucide-react";

export default function PatientDashboardUnified() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data
  const patient = {
    name: "Maria Silva",
    email: "maria.silva@email.com",
    avatar: "/api/placeholder/40/40",
    plan: "Plano Premium",
    healthScore: 85,
    nextAppointment: "15 Jul 2025, 14:30",
    lastConsultation: "10 Jul 2025"
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Carlos Mendes",
      specialty: "Cardiologia",
      date: "15 Jul 2025",
      time: "14:30",
      type: "Videoconsulta",
      status: "confirmado"
    },
    {
      id: 2,
      doctor: "Dra. Ana Costa",
      specialty: "Clínica Geral",
      date: "22 Jul 2025",
      time: "09:00",
      type: "Presencial",
      status: "agendado"
    }
  ];

  const recentPrescriptions = [
    {
      id: 1,
      medication: "Losartana 50mg",
      doctor: "Dr. Carlos Mendes",
      date: "10 Jul 2025",
      status: "ativa",
      refills: 2
    },
    {
      id: 2,
      medication: "Vitamina D3",
      doctor: "Dra. Ana Costa",
      date: "05 Jul 2025",
      status: "ativa",
      refills: 5
    }
  ];

  const healthMetrics = [
    { name: "Pressão Arterial", value: "120/80", status: "normal", trend: "stable" },
    { name: "Frequência Cardíaca", value: "72 bpm", status: "normal", trend: "down" },
    { name: "Peso", value: "68 kg", status: "normal", trend: "down" },
    { name: "IMC", value: "22.5", status: "normal", trend: "stable" }
  ];

  const quickActions = [
    {
      title: "Agendar Consulta",
      description: "Marque uma nova consulta com especialistas",
      icon: Calendar,
      color: "blue",
      action: () => window.location.href = "/appointments/new"
    },
    {
      title: "Videoconsulta Rápida",
      description: "Conecte-se rapidamente com um médico online",
      icon: Video,
      color: "green",
      action: () => window.location.href = "/teleconsult/quick"
    },
    {
      title: "Meu Prontuário",
      description: "Visualize seu histórico médico completo",
      icon: FileText,
      color: "purple",
      action: () => window.location.href = "/medical-records"
    },
    {
      title: "Receitas Digitais",
      description: "Acesse e baixe suas prescrições",
      icon: Pill,
      color: "orange",
      action: () => window.location.href = "/prescriptions"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmado: "default",
      agendado: "secondary",
      ativa: "default",
      normal: "default"
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <UnifiedLayout
      userType="patient"
      user={patient}
      notifications={3}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Olá, {patient.name}! 👋</h2>
              <p className="text-blue-100 mb-4">
                Como está se sentindo hoje? Sua próxima consulta é em {patient.nextAppointment}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>Score de Saúde: {patient.healthScore}%</span>
                </div>
                <Progress value={patient.healthScore} className="w-32 bg-blue-400" />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Monitoramento Ativo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.action}>
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-${action.color}-100 text-${action.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments & Health */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas Consultas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Próximas Consultas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.doctor}</p>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <p className="text-sm text-gray-500">{appointment.date} às {appointment.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(appointment.status)}
                        <div className="flex gap-2 mt-2">
                          {appointment.type === "Videoconsulta" && (
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4 mr-1" />
                              Entrar
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Todas as Consultas
                </Button>
              </CardContent>
            </Card>

            {/* Métricas de Saúde */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Métricas de Saúde
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <p className="text-xl font-bold">{metric.value}</p>
                      {getStatusBadge(metric.status)}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Histórico Completo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Prescriptions & Quick Info */}
          <div className="space-y-6">
            {/* Receitas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Receitas Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{prescription.medication}</p>
                        {getStatusBadge(prescription.status)}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Por: {prescription.doctor}</p>
                      <p className="text-xs text-gray-500">{prescription.date}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{prescription.refills} renovações restantes</span>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Todas as Receitas
                </Button>
              </CardContent>
            </Card>

            {/* Informações de Contato de Emergência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergência 24h
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-800">Emergência Médica</p>
                    <p className="text-sm text-red-600">192 - SAMU</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-medium text-blue-800">TeleMed 24h</p>
                    <p className="text-sm text-blue-600">(11) 3333-4444</p>
                    <Button size="sm" className="w-full mt-2" variant="outline">
                      <Video className="h-4 w-4 mr-2" />
                      Consulta Urgente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avaliação do Serviço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Sua Experiência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Como você avalia nossos serviços médicos?
                </p>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Deixar Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}