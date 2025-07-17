import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  FileText, 
  Activity, 
  TrendingUp, 
  Clock, 
  Bell,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Stethoscope,
  Heart,
  User,
  Calendar as CalendarIcon,
  MessageSquare,
  Video,
  Prescription,
  ChartLine
} from "lucide-react";

// Componente integrado do medical-dashboard-pro.html no fluxo React
export default function DashboardMedicalPro() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const quickStats = [
    { title: "Consultas Hoje", value: "12", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pacientes Ativos", value: "245", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { title: "Prescrições", value: "8", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Emergências", value: "2", icon: Activity, color: "text-red-600", bg: "bg-red-50" },
  ];

  const recentPatients = [
    { name: "Maria Silva", time: "09:30", status: "Consulta", avatar: "/api/placeholder/40/40" },
    { name: "João Santos", time: "10:15", status: "Retorno", avatar: "/api/placeholder/40/40" },
    { name: "Ana Costa", time: "11:00", status: "Emergência", avatar: "/api/placeholder/40/40" },
    { name: "Pedro Lima", time: "14:30", status: "Agendado", avatar: "/api/placeholder/40/40" },
  ];

  const appointments = [
    { patient: "Carlos Mendes", time: "08:00", type: "Consulta Inicial", status: "confirmado" },
    { patient: "Lucia Fernandes", time: "09:30", type: "Retorno", status: "confirmado" },
    { patient: "Roberto Silva", time: "11:00", type: "Teleconsulta", status: "pendente" },
    { patient: "Sandra Costa", time: "14:00", type: "Consulta", status: "confirmado" },
    { patient: "Miguel Torres", time: "15:30", type: "Emergência", status: "urgente" },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartLine },
    { id: 'appointments', label: 'Consultas', icon: CalendarIcon },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'prescriptions', label: 'Prescrições', icon: Prescription },
    { id: 'telemedicine', label: 'Telemedicina', icon: Video },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bg}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.time}</p>
                          </div>
                        </div>
                        <Badge variant={patient.status === 'Emergência' ? 'destructive' : 'default'}>
                          {patient.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Consulta
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Teleconsulta
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Prescrição
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Agenda de Consultas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Hoje - {new Date().toLocaleDateString('pt-BR')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-bold text-lg">{appointment.time}</p>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          appointment.status === 'urgente' ? 'destructive' :
                          appointment.status === 'confirmado' ? 'default' : 'secondary'
                        }>
                          {appointment.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Seção em desenvolvimento</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/95 backdrop-blur-sm shadow-xl min-h-screen">
          {/* Logo */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 className="text-xl font-bold">TeleMed Pro</h1>
            <p className="text-sm opacity-90">Sistema Médico Avançado</p>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/api/placeholder/48/48" />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Dr. Marcus Silva</p>
                <p className="text-sm text-muted-foreground">CRM 123456/SP</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Avatar>
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}