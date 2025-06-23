import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Video, MapPin } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Sucesso",
        description: "Status da consulta atualizado!",
      });
    },
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt: any) => 
      isSameDay(new Date(apt.appointmentDate), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'scheduled': return 'Agendada';
      case 'completed': return 'Realizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const renderMonthView = () => {
    const start = startOfWeek(startOfMonth(selectedDate));
    const end = endOfWeek(endOfMonth(selectedDate));
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-sm text-gray-500">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayAppointments = getAppointmentsForDate(day);
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] p-1 border border-gray-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${isToday ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 2).map((apt: any) => (
                  <div
                    key={apt.id}
                    className={`text-xs p-1 rounded text-center cursor-pointer hover:opacity-80 ${getStatusColor(apt.status)}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {format(new Date(apt.appointmentDate), 'HH:mm')}
                    <br />
                    {user?.role === 'doctor' 
                      ? apt.patient?.user?.firstName 
                      : apt.doctor?.user?.firstName}
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAppointments.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(selectedDate);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </h3>
        {dayAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma consulta agendada para este dia
          </p>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map((apt: any) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {format(new Date(apt.appointmentDate), 'HH:mm')}
                        </span>
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusText(apt.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>
                          {user?.role === 'doctor' 
                            ? `${apt.patient?.user?.firstName} ${apt.patient?.user?.lastName}`
                            : `Dr. ${apt.doctor?.user?.firstName} ${apt.doctor?.user?.lastName}`}
                        </span>
                      </div>

                      {apt.consultationType === 'video' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="h-4 w-4 text-blue-500" />
                          <span className="text-blue-600">Videoconsulta</span>
                        </div>
                      )}

                      {apt.consultationType === 'in-person' && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Presencial</span>
                        </div>
                      )}

                      {apt.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          {apt.notes}
                        </p>
                      )}
                    </div>

                    {user?.role === 'doctor' && apt.status === 'scheduled' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAppointmentMutation.mutate({ 
                            id: apt.id, 
                            status: 'confirmed' 
                          })}
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateAppointmentMutation.mutate({ 
                            id: apt.id, 
                            status: 'cancelled' 
                          })}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}

                    {apt.consultationType === 'video' && apt.status === 'confirmed' && (
                      <Button
                        size="sm"
                        className="ml-4"
                        onClick={() => window.open(`/videoconsultas?appointment=${apt.id}`, '_blank')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Iniciar Consulta
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agenda Médica</h1>
          <p className="text-muted-foreground">
            Gerencie suas consultas e compromissos
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
          >
            Mês
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            onClick={() => setViewMode('day')}
          >
            Dia
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {viewMode === 'month' && format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
              {viewMode === 'day' && format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (viewMode === 'month') {
                    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
                  } else {
                    setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
                  }
                }}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (viewMode === 'month') {
                    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
                  } else {
                    setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
                  }
                }}
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Resumo do Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['scheduled', 'confirmed', 'completed', 'cancelled'].map(status => {
              const todayAppointments = getAppointmentsForDate(new Date());
              const count = todayAppointments.filter((apt: any) => apt.status === status).length;
              
              return (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-sm text-muted-foreground">
                    {getStatusText(status)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}