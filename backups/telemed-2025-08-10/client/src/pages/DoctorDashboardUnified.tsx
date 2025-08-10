import React, { useState } from 'react';
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
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
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Plus,
  Activity,
  Star,
  BarChart3,
  User,
  Brain,
  Target,
  Heart,
  Zap,
  Download
} from "lucide-react";

export default function DoctorDashboardUnified() {
  const [activeTab, setActiveTab] = useState("overview");

  // Psychiatric Evaluation Center Functions
  const openQuickTest = (testType: string) => {
    const testUrls = {
      'gad7': '/gad7-ansiedade',
      'phq9': '/phq9-depressao', 
      'pss10': '/pss10-stress',
      'tdah': '/tdah-asrs18',
      'bipolar': '/mdq-bipolar',
      'triagem': '/triagem-psiquiatrica'
    };
    
    if (testUrls[testType as keyof typeof testUrls]) {
      window.location.href = testUrls[testType as keyof typeof testUrls];
    } else {
      alert('Teste não encontrado!');
    }
  };

  const showCenterStats = () => {
    alert('📊 Estatísticas do Centro de Avaliação em desenvolvimento!');
  };

  // Mock doctor data
  const doctor = {
    name: "Dr. Carlos Mendes",
    email: "carlos.mendes@telemed.com",
    avatar: "/api/placeholder/40/40",
    specialty: "Cardiologia",
    crm: "123456",
    plan: "Médico Premium"
  };

  // Mock data for demonstration
  const todayStats = {
    consultations: 8,
    completed: 5,
    pending: 3,
    revenue: 1250,
    satisfaction: 4.8
  };

  const todayConsultations = [
    {
      id: 1,
      patient: "Maria Silva",
      time: "09:00",
      type: "Videoconsulta",
      status: "confirmed",
      condition: "Hipertensão",
      priority: "normal"
    },
    {
      id: 2,
      patient: "João Santos",
      time: "10:30",
      type: "Presencial",
      status: "waiting",
      condition: "Diabetes",
      priority: "high"
    },
    {
      id: 3,
      patient: "Ana Costa",
      time: "14:00",
      type: "Videoconsulta",
      status: "confirmed",
      condition: "Ansiedade",
      priority: "normal"
    },
    {
      id: 4,
      patient: "Pedro Lima",
      time: "15:30",
      type: "Retorno",
      status: "scheduled",
      condition: "Cardiologia",
      priority: "normal"
    }
  ];

  const recentPatients = [
    {
      id: 1,
      name: "Maria Silva",
      age: 45,
      lastVisit: "2024-07-10",
      condition: "Hipertensão",
      risk: "medium",
      nextAppointment: "2024-07-15"
    },
    {
      id: 2,
      name: "João Santos",
      age: 32,
      lastVisit: "2024-07-08",
      condition: "Diabetes Tipo 2",
      risk: "high",
      nextAppointment: "2024-07-12"
    },
    {
      id: 3,
      name: "Ana Costa",
      age: 28,
      lastVisit: "2024-07-05",
      condition: "Ansiedade",
      risk: "low",
      nextAppointment: "2024-07-15"
    }
  ];

  const quickActions = [
    {
      title: "Nova Consulta",
      description: "Agendar nova consulta para paciente",
      icon: Plus,
      color: "blue",
      action: () => window.location.href = "/appointments/new"
    },
    {
      title: "Iniciar Videoconsulta",
      description: "Conectar com próximo paciente",
      icon: Video,
      color: "green",
      action: () => window.location.href = "/teleconsult/start"
    },
    {
      title: "Criar Receita",
      description: "Prescrever medicamentos",
      icon: Pill,
      color: "purple",
      action: () => window.location.href = "/prescriptions/new"
    },
    {
      title: "Ver Prontuários",
      description: "Acessar registros médicos",
      icon: FileText,
      color: "orange",
      action: () => window.location.href = "/medical-records"
    },
    {
      title: "Telemonitoramento",
      description: "Monitoramento de Enfermagem",
      icon: Activity,
      color: "cyan",
      action: () => window.location.href = "/telemonitoramento-enfermagem"
    },
    {
      title: "Dr. AI",
      description: "Assistente Médico Inteligente",
      icon: Brain,
      color: "indigo",
      action: () => window.location.href = "/dr-ai"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: { variant: "default", label: "Confirmado" },
      waiting: { variant: "secondary", label: "Aguardando" },
      completed: { variant: "default", label: "Concluído" },
      scheduled: { variant: "outline", label: "Agendado" }
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      high: { variant: "destructive", label: "Alto Risco" },
      medium: { variant: "secondary", label: "Médio Risco" },
      low: { variant: "outline", label: "Baixo Risco" }
    };
    const config = variants[risk] || { variant: "outline", label: risk };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <UnifiedLayout
      userType="doctor"
      user={doctor}
      notifications={5}
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Bom dia, {doctor.name}! 👨‍⚕️</h2>
              <p className="text-blue-100 mb-4">
                Você tem {todayStats.pending} consultas pendentes hoje e {todayStats.completed} já concluídas.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>Avaliação: {todayStats.satisfaction}/5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Receita: R$ {todayStats.revenue}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Stethoscope className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Consultas Hoje</p>
                <p className="text-2xl font-bold">{todayStats.consultations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultas Hoje</p>
                  <p className="text-2xl font-bold">{todayStats.consultations}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold">{todayStats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold">{todayStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
                  <p className="text-2xl font-bold">124</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
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

        {/* Centro de Avaliação Psiquiátrica Section */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Centro de Avaliação Psiquiátrica</h2>
                <p className="text-sm text-gray-600 font-normal">Ferramentas profissionais de triagem e diagnóstico</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Testes Rápidos */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Testes Rápidos
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left p-3 hover:bg-blue-100 transition-colors"
                    onClick={() => openQuickTest('gad7')}
                  >
                    <span className="mr-2">😰</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">GAD-7</div>
                      <div className="text-xs text-blue-600">Ansiedade (3 min)</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left p-3 hover:bg-blue-100 transition-colors"
                    onClick={() => openQuickTest('phq9')}
                  >
                    <span className="mr-2">😔</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">PHQ-9</div>
                      <div className="text-xs text-blue-600">Depressão (3 min)</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left p-3 hover:bg-blue-100 transition-colors"
                    onClick={() => openQuickTest('pss10')}
                  >
                    <span className="mr-2">💭</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">PSS-10</div>
                      <div className="text-xs text-blue-600">Stress (3 min)</div>
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Testes Completos */}
              <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Testes Completos
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left p-3 hover:bg-green-100 transition-colors"
                    onClick={() => openQuickTest('tdah')}
                  >
                    <span className="mr-2">🎯</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">TDAH - ASRS-18</div>
                      <div className="text-xs text-green-600">Atenção (8 min)</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left p-3 hover:bg-green-100 transition-colors"
                    onClick={() => openQuickTest('bipolar')}
                  >
                    <span className="mr-2">🔄</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">Bipolar - MDQ</div>
                      <div className="text-xs text-green-600">Humor (7 min)</div>
                    </div>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left p-3 hover:bg-green-100 transition-colors"
                    onClick={() => openQuickTest('triagem')}
                  >
                    <span className="mr-2">🧠</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">Triagem Geral</div>
                      <div className="text-xs text-green-600">Completo (15 min)</div>
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Acesso Completo */}
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Centro Completo
                </h3>
                <p className="text-sm text-purple-700 mb-4">
                  Acesse todos os testes e ferramentas de avaliação psiquiátrica
                </p>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    onClick={() => window.location.href = '/centro-avaliacao'}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Abrir Centro
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={showCenterStats}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Estatísticas
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Quick Stats for Psychiatric Center */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">6</div>
                  <div className="text-xs text-indigo-600">Testes Disponíveis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-xs text-purple-600">Avaliações Mês</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-xs text-green-600">Precisão Clínica</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">CVV 188</div>
                  <div className="text-xs text-blue-600">Emergência</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dr. AI - Assistente Médico Inteligente Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dr. AI - Assistente Médico Inteligente</h2>
                <p className="text-sm text-gray-600 font-normal">Copiloto clínico com triagem inteligente e suporte à decisão</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Triagem Inteligente */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Triagem Inteligente
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  IA médica para análise inicial de sintomas e suporte à decisão clínica
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  onClick={() => window.location.href = '/dr-ai'}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Abrir Dr. AI
                </Button>
              </div>
              
              {/* Protocolos Clínicos */}
              <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Protocolos Validados
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Triagem de emergências</div>
                  <div>• Análise de sintomas</div>
                  <div>• Sugestões de exames</div>
                  <div>• Referenciamento adequado</div>
                </div>
              </div>
              
              {/* Segurança Clínica */}
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Segurança Clínica
                </h3>
                <div className="space-y-2 text-sm text-amber-700">
                  <div>• Conformidade CFM 2.227/2018</div>
                  <div>• Não substitui consulta médica</div>
                  <div>• Logs auditáveis</div>
                  <div>• Redirecionamento automático</div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats for Dr. AI */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">AI</div>
                  <div className="text-xs text-blue-600">Copiloto Ativo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">97%</div>
                  <div className="text-xs text-green-600">Precisão Triagem</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-purple-600">Disponibilidade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">192</div>
                  <div className="text-xs text-red-600">SAMU - Emergência</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Today's Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{consultation.time}</span>
                          {getPriorityIcon(consultation.priority)}
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{consultation.patient}</p>
                          <p className="text-sm text-gray-600">{consultation.condition}</p>
                          <p className="text-sm text-gray-500">{consultation.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(consultation.status)}
                        <div className="flex gap-2 mt-2">
                          {consultation.type === "Videoconsulta" && consultation.status === "confirmed" && (
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4 mr-1" />
                              Iniciar
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Agenda Completa
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Patients & Quick Info */}
          <div className="space-y-6">
            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pacientes Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">{patient.name}</p>
                        {getRiskBadge(patient.risk)}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{patient.condition}</p>
                      <p className="text-xs text-gray-500">Última visita: {patient.lastVisit}</p>
                      <p className="text-xs text-gray-500">Próxima: {patient.nextAppointment}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="ghost">
                          <FileText className="h-3 w-3 mr-1" />
                          Prontuário
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Todos os Pacientes
                </Button>
              </CardContent>
            </Card>

            {/* Quick Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estatísticas da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Consultas realizadas</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de satisfação</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Receitas emitidas</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Teleconsultas</span>
                    <span className="font-medium">18</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Ferramentas Médicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    CID-10 Lookup
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Pill className="h-4 w-4 mr-2" />
                    Bula de Medicamentos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Calculadoras Médicas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatórios Clínicos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
}