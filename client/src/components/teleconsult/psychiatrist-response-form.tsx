import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertCircle, DollarSign, MessageSquare, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface TeleconsultRequest {
  id: number;
  patientName: string;
  consultationType: string;
  offeredPrice: number;
  urgency: string;
  symptoms: string;
  timeRemaining: string;
}

interface PsychiatristResponseFormProps {
  request: TeleconsultRequest;
  onResponse: () => void;
}

export default function PsychiatristResponseForm({ request, onResponse }: PsychiatristResponseFormProps) {
  const [offeredPrice, setOfferedPrice] = useState(request.offeredPrice.toString());
  const [consultationPreference, setConsultationPreference] = useState<'immediate' | 'with_preparation'>('immediate');
  const [message, setMessage] = useState('');
  const [preparationMessage, setPreparationMessage] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitResponseMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/teleconsult/${request.id}/respond`, {
        method: 'POST',
        body: JSON.stringify({
          offeredPrice: parseFloat(offeredPrice),
          consultationPreference,
          message,
          preparationMessage: consultationPreference === 'with_preparation' ? preparationMessage : null,
          requiresPreparation: consultationPreference === 'with_preparation',
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Resposta enviada",
        description: "Sua proposta foi enviada ao paciente.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/teleconsult/requests'] });
      onResponse();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta.",
        variant: "destructive",
      });
    },
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alto': return 'bg-orange-100 text-orange-800';
      case 'moderado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Responder Solicitação de Teleconsulta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Paciente: {request.patientName}</span>
            <Badge className={getUrgencyColor(request.urgency)}>
              {request.urgency}
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Valor oferecido: R$ {request.offeredPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Tempo restante: {request.timeRemaining}</span>
            </div>
          </div>
          
          <div>
            <div className="font-medium text-sm mb-1">Sintomas:</div>
            <div className="text-sm text-gray-600">{request.symptoms}</div>
          </div>
        </div>

        {/* Price Adjustment */}
        <div className="space-y-2">
          <Label htmlFor="price">Valor da Consulta (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={offeredPrice}
            onChange={(e) => setOfferedPrice(e.target.value)}
            placeholder="Ex: 150.00"
          />
          <p className="text-xs text-gray-600">
            Você pode aceitar o valor oferecido ou propor um valor diferente
          </p>
        </div>

        {/* Consultation Preference */}
        <div className="space-y-4">
          <Label>Preferência de Atendimento</Label>
          <RadioGroup 
            value={consultationPreference} 
            onValueChange={(value: 'immediate' | 'with_preparation') => setConsultationPreference(value)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate" className="flex-1 cursor-pointer">
                <div className="font-medium">Atendimento Imediato</div>
                <div className="text-sm text-gray-600">
                  Posso atender o paciente imediatamente após confirmação
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="with_preparation" id="with_preparation" />
              <Label htmlFor="with_preparation" className="flex-1 cursor-pointer">
                <div className="font-medium">Com Preparação Prévia</div>
                <div className="text-sm text-gray-600">
                  Prefiro que o paciente faça a preparação psiquiátrica antes da consulta
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Preparation Message (only if with_preparation is selected) */}
        {consultationPreference === 'with_preparation' && (
          <div className="space-y-2">
            <Label htmlFor="preparation-message">Mensagem sobre a Preparação</Label>
            <Textarea
              id="preparation-message"
              value={preparationMessage}
              onChange={(e) => setPreparationMessage(e.target.value)}
              placeholder="Explique ao paciente por que a preparação é importante para sua consulta..."
              rows={3}
            />
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium">Processo com Preparação:</div>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Paciente fará avaliação psicológica (PHQ-9 e GAD-7)</li>
                    <li>Preencherá questionário detalhado de psiquiatria</li>
                    <li>Opcionalmente, entrevista com psicóloga para avaliação psicodinâmica</li>
                    <li>Se risco alto detectado, consulta pode ser antecipada</li>
                    <li>Preparação completa permite consulta mais personalizada</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Mensagem para o Paciente (Opcional)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mensagem adicional para o paciente..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => submitResponseMutation.mutate()}
            disabled={submitResponseMutation.isPending}
            className="flex-1"
          >
            {submitResponseMutation.isPending ? 'Enviando...' : 'Enviar Proposta'}
          </Button>
          <Button
            variant="outline"
            onClick={onResponse}
            disabled={submitResponseMutation.isPending}
          >
            Cancelar
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-medium">Informações Importantes:</div>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>O paciente será notificado da sua resposta imediatamente</li>
                <li>Se escolher "Com Preparação", o paciente iniciará o processo antes da consulta</li>
                <li>Consultas com risco alto podem ser antecipadas mesmo com preparação</li>
                <li>Você receberá o resumo da preparação antes do atendimento</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}