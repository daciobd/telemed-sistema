import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  FileText,
  Pill,
  Video,
  Clock,
  CheckCircle,
  Activity,
  Heart,
  MessageCircle,
  AlertCircle,
  Plus,
  Stethoscope,
  Settings,
  LogOut,
  PlayCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Calendar as CalendarIcon,
  FileTextIcon,
  PillIcon,
  VideoIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ShieldIcon,
  BellIcon,
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  Share2Icon,
  EyeIcon
} from "lucide-react";
import { Link } from 'wouter';

export default function PatientDashboardComplete() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for complete dashboard
  const patientData = {
    name: "João Silva Santos",
    age: 45,
    email: "joao.silva@email.com",
    phone: "(11) 99999-1234",
    address: "Rua das Flores, 123 - São Paulo, SP",
    healthPlan: "Bradesco Saúde",
    registrationDate: "2024-01-15"
  };

  const healthMetrics = {
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    weight: "78 kg",
    height: "1.75 m",
    bmi: "25.1",
    lastUpdate: "2025-07-15"
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Maria Silva",
      specialty: "Cardiologia",
      date: "2025-07-17",
      time: "14:30",
      type: "teleconsulta",
      status: "confirmada",
      avatar: "MS"
    },
    {
      id: 2,
      doctor: "Dr. João Santos",
      specialty: "Clínica Geral",
      date: "2025-07-20",
      time: "09:00",
      type: "presencial",
      status: "agendada",
      avatar: "JS"
    },
    {
      id: 3,
      doctor: "Dra. Ana Costa",
      specialty: "Endocrinologia",
      date: "2025-07-25",
      time: "16:00",
      type: "teleconsulta",
      status: "pendente",
      avatar: "AC"
    }
  ];

  const recentRecords = [
    {
      id: 1,
      title: "Consulta Cardiológica",
      doctor: "Dr. Maria Silva",
      date: "2025-07-10",
      summary: "Exame de rotina - pressão arterial controlada",
      type: "consulta",
      status: "completo"
    },
    {
      id: 2,
      title: "Exame de Sangue",
      doctor: "Dr. João Santos",
      date: "2025-07-08",
      summary: "Hemograma completo - resultados normais",
      type: "exame",
      status: "completo"
    },
    {
      id: 3,
      title: "Eletrocardiograma",
      doctor: "Dr. Maria Silva",
      date: "2025-07-05",
      summary: "ECG normal - ritmo sinusal",
      type: "exame",
      status: "completo"
    }
  ];

  const activePrescriptions = [
    {
      id: 1,
      medication: "Losartana 50mg",
      doctor: "Dr. Maria Silva",
      date: "2025-07-10",
      instructions: "1 comprimido pela manhã",
      dosage: "50mg",
      frequency: "1x/dia",
      duration: "30 dias",
      status: "ativa"
    },
    {
      id: 2,
      medication: "Sinvastatina 20mg",
      doctor: "Dr. Maria Silva",
      date: "2025-07-10",
      instructions: "1 comprimido à noite",
      dosage: "20mg",
      frequency: "1x/dia",
      duration: "30 dias",
      status: "ativa"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "appointment",
      title: "Consulta amanhã",
      message: "Consulta com Dr. Maria Silva às 14:30",
      time: "1 hora atrás",
      read: false
    },
    {
      id: 2,
      type: "prescription",
      title: "Receita disponível",
      message: "Nova prescrição foi adicionada ao seu prontuário",
      time: "2 horas atrás",
      read: false
    },
    {
      id: 3,
      type: "result",
      title: "Resultado de exame",
      message: "Resultado do exame de sangue já disponível",
      time: "1 dia atrás",
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
                <p className="text-sm text-gray-500">Portal do Paciente</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-700">Olá, {patientData.name.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{currentTime.toLocaleTimeString('pt-BR')}</p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Bem-vindo, {patientData.name.split(' ')[0]}!</h2>
                  <p className="text-blue-100 text-lg">Sua saúde é nossa prioridade. Gerencie suas consultas e histórico médico facilmente.</p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Próxima Consulta</p>
                    <p className="text-2xl font-bold text-blue-600">17 Jul</p>
                    <p className="text-sm text-gray-500">14:30h</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Prontuários</p>
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-gray-500">registros</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receitas Ativas</p>
                    <p className="text-2xl font-bold text-purple-600">2</p>
                    <p className="text-sm text-gray-500">medicamentos</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Pill className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teleconsultas</p>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                    <p className="text-sm text-gray-500">realizadas</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Video className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Appointments & Records */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Próximas Consultas</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Consulta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{appointment.avatar}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                              <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                              <p className="text-sm text-gray-500">{appointment.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
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
                            <div className="flex space-x-2">
                              {appointment.type === 'teleconsulta' && (
                                <Button size="sm" variant="outline">
                                  <Video className="w-4 h-4 mr-1" />
                                  Entrar
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                Detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Medical Records */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span>Histórico Médico Recente</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Tudo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRecords.map((record) => (
                      <div key={record.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.type === 'consulta' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {record.type === 'consulta' ? (
                              <Stethoscope className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Activity className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">{record.title}</p>
                            <p className="text-sm text-gray-500">{record.date}</p>
                          </div>
                          <p className="text-sm text-gray-600">{record.doctor}</p>
                          <p className="text-sm text-gray-500 mt-1">{record.summary}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Prescriptions & Health Status */}
            <div className="space-y-6">
              {/* Active Prescriptions */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <span>Medicamentos Ativos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activePrescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900">{prescription.medication}</p>
                          <Badge variant="outline" className="text-xs">
                            {prescription.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{prescription.doctor}</p>
                        <p className="text-sm text-gray-500 mb-2">{prescription.instructions}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <span>Dosagem: {prescription.dosage}</span>
                          <span>Frequência: {prescription.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health Metrics */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Métricas de Saúde</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Pressão Arterial</span>
                        <span className="text-sm font-medium text-green-600">{healthMetrics.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Frequência Cardíaca</span>
                        <span className="text-sm font-medium text-green-600">{healthMetrics.heartRate}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Peso</span>
                        <span className="text-sm font-medium">{healthMetrics.weight}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">IMC</span>
                        <span className="text-sm font-medium text-yellow-600">{healthMetrics.bmi}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Última atualização: {healthMetrics.lastUpdate}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-yellow-500" />
                    <span>Notificações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.read ? 'bg-gray-400' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-24 flex-col space-y-2">
                  <Plus className="w-8 h-8" />
                  <span className="text-sm">Nova Consulta</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col space-y-2">
                  <Video className="w-8 h-8" />
                  <span className="text-sm">Videoconsulta</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col space-y-2">
                  <FileText className="w-8 h-8" />
                  <span className="text-sm">Prontuário</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col space-y-2">
                  <Pill className="w-8 h-8" />
                  <span className="text-sm">Receitas</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col space-y-2 border-red-200 text-red-600 hover:bg-red-50">
                  <AlertCircle className="w-8 h-8" />
                  <span className="text-sm">Emergência</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col space-y-2">
                  <MessageCircle className="w-8 h-8" />
                  <span className="text-sm">Suporte</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}