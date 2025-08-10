import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Bell,
  Settings
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'waiting';
  type: 'presencial' | 'teleconsulta';
  specialty?: string;
  duration?: number;
}

interface DayAppointments {
  [key: string]: Appointment[];
}

export default function MedicalCalendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Buscar consultas reais do servidor
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Processar dados das consultas por data
  const processAppointmentsByDate = (appointments: any[] | undefined = []): DayAppointments => {
    const grouped: DayAppointments = {};
    
    if (!appointments || !Array.isArray(appointments)) {
      return grouped;
    }
    
    appointments.forEach(appointment => {
      if (appointment.appointmentDate) {
        const dateKey = format(new Date(appointment.appointmentDate), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        
        grouped[dateKey].push({
          id: appointment.id,
          patientName: appointment.patientName || 'Paciente',
          time: format(new Date(appointment.appointmentDate), 'HH:mm'),
          status: appointment.status || 'scheduled',
          type: appointment.isVideoCall ? 'teleconsulta' : 'presencial',
          specialty: appointment.specialty || 'Consulta Geral'
        });
      }
    });

    // Ordenar por horário
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    return grouped;
  };

  const appointmentsByDate = processAppointmentsByDate(appointments as any[]);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const dayAppointments = appointmentsByDate[selectedDateKey] || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Finalizada</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Confirmada</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Aguardando</Badge>;
      case 'scheduled':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Agendada</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'confirmed':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'waiting':
        return <AlertCircle className="h-4 w-4 text-yellow-600 animate-pulse" />;
      case 'scheduled':
        return <CalendarIcon className="h-4 w-4 text-gray-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CalendarIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'teleconsulta' ? 
      <Video className="h-4 w-4 text-blue-600" /> : 
      <User className="h-4 w-4 text-green-600" />;
  };

  const hasAppointments = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return appointmentsByDate[dateKey] && appointmentsByDate[dateKey].length > 0;
  };

  const getAppointmentCount = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return appointmentsByDate[dateKey]?.length || 0;
  };

  const handleStartVideoCall = (appointmentId: number) => {
    window.location.href = `/videoconsulta/${appointmentId}`;
  };

  const availableHours = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Calendário */}
      <Card className="w-96 h-fit">
        <CardHeader className="bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Calendário Médico</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-blue-700"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 border-b">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grade do calendário */}
          <div className="grid grid-cols-7">
            {monthDays.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const hasAppts = hasAppointments(date);
              const apptCount = getAppointmentCount(date);
              const isTodayDate = isToday(date);
              
              return (
                <Button
                  key={date.toISOString()}
                  variant="ghost"
                  className={`
                    h-16 p-1 rounded-none border-r border-b last:border-r-0 flex flex-col items-center justify-center relative
                    ${isSelected ? 'bg-blue-100 border-blue-300' : ''}
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isTodayDate ? 'bg-blue-50 border-blue-200' : ''}
                    hover:bg-gray-50
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className={`text-sm ${isTodayDate ? 'font-bold text-blue-600' : ''}`}>
                    {format(date, 'd')}
                  </span>
                  {hasAppts && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-5 h-3 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {apptCount}
                      </div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de consultas do dia */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <CardTitle>
                Consultas para {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </CardTitle>
              {isToday(selectedDate) && (
                <Badge className="bg-blue-100 text-blue-800">Hoje</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma consulta agendada</h3>
              <p className="text-gray-500 mb-4">
                Não há consultas marcadas para {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold text-blue-600">{appointment.time}</span>
                          {getTypeIcon(appointment.type)}
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                            {getStatusIcon(appointment.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{appointment.specialty}</p>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.status)}
                            <Badge variant="outline" className="text-xs">
                              {appointment.type === 'teleconsulta' ? 'Online' : 'Presencial'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.status === 'waiting' && appointment.type === 'teleconsulta' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStartVideoCall(appointment.id)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && appointment.type === 'teleconsulta' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStartVideoCall(appointment.id)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Aguardando
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Formulário de adicionar horário */}
          {showAddForm && (
            <Card className="mt-4 border-dashed border-2 border-gray-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHours.map((hour) => (
                        <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Horário
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}