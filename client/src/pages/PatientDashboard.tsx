import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  FileText,
  Pills,
  Video,
  Users,
  Clock,
  CheckCircle,
  Activity,
  Heart,
  Phone,
  MessageCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Stethoscope,
  Shield,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from 'wouter';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function PatientDashboard() {
  // Mock data for demonstration
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Maria Silva",
      specialty: "Cardiologia",
      date: "2025-07-15",
      time: "14:30",
      type: "teleconsulta",
      status: "confirmada"
    },
    {
      id: 2,
      doctor: "Dr. João Santos",
      specialty: "Clínica Geral",
      date: "2025-07-18",
      time: "09:00",
      type: "presencial",
      status: "agendada"
    }
  ];

  const recentRecords = [
    {
      id: 1,
      title: "Consulta Cardiológica",
      doctor: "Dr. Maria Silva",
      date: "2025-07-10",
      summary: "Exame de rotina - pressão arterial controlada"
    },
    {
      id: 2,
      title: "Exame de Sangue",
      doctor: "Dr. João Santos",
      date: "2025-07-08",
      summary: "Resultados dentro da normalidade"
    }
  ];

  const prescriptions = [
    {
      id: 1,
      medication: "Losartana 50mg",
      doctor: "Dr. Maria Silva",
      date: "2025-07-10",
      instructions: "1 comprimido pela manhã"
    },
    {
      id: 2,
      medication: "Sinvastatina 20mg",
      doctor: "Dr. Maria Silva", 
      date: "2025-07-10",
      instructions: "1 comprimido à noite"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white" data-tour="dashboard">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Bem-vindo ao TeleMed</h1>
              <p className="text-blue-100">Sua saúde, nosso cuidado. Acesse suas consultas e histórico médico.</p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Próxima Consulta</p>
                  <p className="text-lg font-semibold">15 Jul</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Prontuários</p>
                  <p className="text-lg font-semibold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Pills className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Receitas Ativas</p>
                  <p className="text-lg font-semibold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Video className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Teleconsultas</p>
                  <p className="text-lg font-semibold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Consultas Card */}
          <Card className="hover:shadow-lg transition-all duration-200" data-tour="appointments">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Consultas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Agende suas consultas online com médicos especialistas
              </p>
              
              <div className="space-y-2">
                {upcomingAppointments.slice(0, 2).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{appointment.doctor}</p>
                      <p className="text-xs text-gray-500">{appointment.date} • {appointment.time}</p>
                    </div>
                    <Badge 
                      variant={appointment.type === 'teleconsulta' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {appointment.type === 'teleconsulta' ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <Stethoscope className="w-3 h-3 mr-1" />
                      )}
                      {appointment.type}
                    </Badge>
                  </div>
                ))}
              </div>

              <Link href="/appointments">
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Todas as Consultas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Prontuário Card */}
          <Card className="hover:shadow-lg transition-all duration-200" data-tour="medical-records">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Prontuário</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Acesse seu histórico médico completo
              </p>
              
              <div className="space-y-2">
                {recentRecords.slice(0, 2).map((record) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">{record.title}</p>
                    <p className="text-xs text-gray-500">{record.doctor} • {record.date}</p>
                    <p className="text-xs text-gray-600 mt-1">{record.summary}</p>
                  </div>
                ))}
              </div>

              <Link href="/medical-records">
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Prontuário Completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Receitas Card */}
          <Card className="hover:shadow-lg transition-all duration-200" data-tour="prescriptions">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Pills className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Receitas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Visualize suas prescrições médicas
              </p>
              
              <div className="space-y-2">
                {prescriptions.slice(0, 2).map((prescription) => (
                  <div key={prescription.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">{prescription.medication}</p>
                    <p className="text-xs text-gray-500">{prescription.doctor} • {prescription.date}</p>
                    <p className="text-xs text-gray-600 mt-1">{prescription.instructions}</p>
                  </div>
                ))}
              </div>

              <Link href="/prescriptions">
                <Button className="w-full" variant="outline">
                  <Pills className="w-4 h-4 mr-2" />
                  Ver Todas as Receitas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/appointments/new">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Plus className="w-6 h-6 mb-2" />
                  Nova Consulta
                </Button>
              </Link>

              <Link href="/video-consultation">
                <Button variant="outline" className="w-full h-20 flex-col" data-tour="video-consultation">
                  <Video className="w-6 h-6 mb-2" />
                  Videoconsulta
                </Button>
              </Link>

              <Link href="/emergency">
                <Button variant="outline" className="w-full h-20 flex-col border-red-200 text-red-600 hover:bg-red-50">
                  <AlertCircle className="w-6 h-6 mb-2" />
                  Emergência
                </Button>
              </Link>

              <Link href="/support">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <MessageCircle className="w-6 h-6 mb-2" />
                  Suporte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Health Status & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Status de Saúde</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pressão Arterial</span>
                <span className="text-sm font-medium text-green-600">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Peso</span>
                <span className="text-sm font-medium">72kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Última consulta</span>
                <span className="text-sm font-medium">10/07/2025</span>
              </div>
              <div className="pt-2">
                <Link href="/health-monitoring">
                  <Button variant="ghost" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Monitoramento Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Lembretes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tomar medicação</p>
                  <p className="text-xs text-gray-600">Losartana 50mg - Manhã</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Consulta amanhã</p>
                  <p className="text-xs text-gray-600">Dr. Maria Silva - 14:30</p>
                </div>
              </div>

              <Link href="/settings">
                <Button variant="ghost" className="w-full" data-tour="settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Lembretes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status Checklist */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">Sistema Operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Express Server: Funcionando</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Arquivos Estáticos: OK</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>React Router: Operacional</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Feature #1: Autenticação: Base implementada</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Próximo: Feature #2 (Videoconsultas)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}