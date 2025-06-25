import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Users, Clock, Video, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PsychologistInterviewSchedulerProps {
  appointmentId: number;
  onComplete: () => void;
}

export default function PsychologistInterviewScheduler({ appointmentId, onComplete }: PsychologistInterviewSchedulerProps) {
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: psychologists, isLoading: loadingPsychologists } = useQuery({
    queryKey: ['/api/psychologists'],
    enabled: appointmentId > 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: existingInterview } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}/psychologist-interview`],
    enabled: appointmentId > 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const scheduleInterview = useMutation({
    mutationFn: async (data: {
      appointmentId: number;
      psychologistId: number;
      interviewDate: string;
    }) => {
      const response = await fetch('/api/psychologist-interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to schedule interview');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Entrevista Agendada",
        description: "Sua entrevista pré-consulta foi agendada com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível agendar a entrevista. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSchedule = () => {
    if (!selectedPsychologist || !selectedDate || !selectedTime) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um psicólogo, data e horário.",
        variant: "destructive",
      });
      return;
    }

    const interviewDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    interviewDateTime.setHours(parseInt(hours), parseInt(minutes));

    scheduleInterview.mutate({
      appointmentId,
      psychologistId: parseInt(selectedPsychologist),
      interviewDate: interviewDateTime.toISOString(),
    });
  };

  if (existingInterview) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle>Entrevista Pré-Consulta Agendada</CardTitle>
          </div>
          <CardDescription>
            Sua entrevista com a psicóloga foi agendada com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Psicóloga</span>
              </div>
              <p className="font-medium">Dra. Ana Silva (exemplo)</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>Data e Horário</span>
              </div>
              <p className="font-medium">
                {format(new Date(existingInterview.interviewDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Objetivo da Entrevista</h4>
            <p className="text-sm text-blue-800">
              A psicóloga realizará uma avaliação psicodinâmica para compreender melhor sua personalidade, 
              mecanismos de enfrentamento e padrões relacionais. Este resumo ajudará o psiquiatra a 
              personalizar seu tratamento desde a primeira consulta.
            </p>
          </div>

          <Badge variant="outline" className="w-fit">
            <Video className="h-3 w-3 mr-1" />
            Teleconsulta
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <CardTitle>Agendar Entrevista Pré-Consulta</CardTitle>
        </div>
        <CardDescription>
          Agende uma entrevista com nossa psicóloga para preparar sua consulta psiquiátrica
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Por que fazer esta entrevista?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Avaliação psicodinâmica completa de sua personalidade</li>
            <li>• Análise de mecanismos de enfrentamento e padrões relacionais</li>
            <li>• Resumo profissional para otimizar sua consulta psiquiátrica</li>
            <li>• Melhor compreensão de suas necessidades terapêuticas</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Selecione uma Psicóloga</label>
            <Select value={selectedPsychologist} onValueChange={setSelectedPsychologist}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma psicóloga disponível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Dra. Ana Silva - CRP 06/123456</SelectItem>
                <SelectItem value="2">Dra. Maria Santos - CRP 06/789012</SelectItem>
                <SelectItem value="3">Dra. Carla Lima - CRP 06/345678</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Selecione a Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Escolha uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Selecione o Horário</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Informações Importantes</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Duração: flexível (até 60 minutos conforme necessário)</li>
              <li>• A psicóloga determina o tempo ideal para cada caso</li>
              <li>• Formato: videoconsulta online</li>
              <li>• Realizada antes da consulta psiquiátrica</li>
              <li>• Opcional, mas altamente recomendada</li>
            </ul>
          </div>

          <Button 
            onClick={handleSchedule} 
            disabled={scheduleInterview.isPending}
            className="w-full"
          >
            {scheduleInterview.isPending ? 'Agendando...' : 'Agendar Entrevista'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}