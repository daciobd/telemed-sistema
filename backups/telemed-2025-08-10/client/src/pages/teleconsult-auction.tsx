import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  DollarSign, 
  Star, 
  User, 
  MapPin, 
  Calendar,
  Video,
  CheckCircle,
  Timer,
  AlertCircle
} from "lucide-react";
import { format, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TeleconsultAuction() {
  const [step, setStep] = useState<'request' | 'waiting' | 'responses' | 'confirmed'>('request');
  const [requestId, setRequestId] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    symptoms: '',
    urgency: 'normal',
    consultationType: 'video',
    maxPrice: '',
    preferredTime: '',
    notes: ''
  });

  const createTeleconsultMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/teleconsult/request", data);
      return response.json();
    },
    onSuccess: (data) => {
      setRequestId(data.id);
      setStep('waiting');
      toast({
        title: "Sucesso",
        description: "Solicitação de teleconsulta criada! Aguardando propostas dos médicos...",
      });
      
      // Simulate doctor responses after 10 seconds
      setTimeout(() => {
        simulateDoctorResponsesMutation.mutate({
          appointmentId: data.id,
          offeredPrice: parseFloat(formData.maxPrice),
          consultationType: formData.consultationType
        });
      }, 10000);
    },
  });

  const simulateDoctorResponsesMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/teleconsult/simulate-responses", data);
    },
    onSuccess: () => {
      setStep('responses');
      queryClient.invalidateQueries({ queryKey: [`/api/teleconsult/responses/${requestId}`] });
    },
  });

  const { data: responses = [] } = useQuery({
    queryKey: [`/api/teleconsult/responses/${requestId}`],
    enabled: step === 'responses' && !!requestId,
  });

  const acceptResponseMutation = useMutation({
    mutationFn: async (responseId: number) => {
      const response = await apiRequest("POST", `/api/teleconsult/accept/${requestId}/${responseId}`);
      return response.json();
    },
    onSuccess: () => {
      setStep('confirmed');
      toast({
        title: "Consulta Confirmada",
        description: "Sua teleconsulta foi agendada com sucesso!",
      });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (step === 'waiting' || step === 'responses') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStep('responses');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symptoms || !formData.maxPrice) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const appointmentDate = formData.preferredTime 
      ? new Date(formData.preferredTime)
      : addMinutes(new Date(), 30);

    createTeleconsultMutation.mutate({
      symptoms: formData.symptoms,
      urgency: formData.urgency,
      consultationType: formData.consultationType,
      maxPrice: parseFloat(formData.maxPrice),
      appointmentDate: appointmentDate.toISOString(),
      notes: formData.notes,
      status: 'auction'
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'normal': return 'Normal';
      case 'low': return 'Baixa';
      default: return urgency;
    }
  };

  if (step === 'request') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Solicitar Teleconsulta
            </CardTitle>
            <CardDescription>
              Sistema de leilão reverso - médicos oferecem seus melhores preços para sua consulta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="symptoms">Sintomas e Motivo da Consulta *</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="Descreva seus sintomas e o motivo da consulta..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="urgency">Urgência</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="consultationType">Tipo de Consulta</Label>
                  <Select
                    value={formData.consultationType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, consultationType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Videochamada</SelectItem>
                      <SelectItem value="audio">Chamada de Áudio</SelectItem>
                      <SelectItem value="chat">Chat de Texto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxPrice">Valor Máximo (R$) *</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    step="0.01"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
                    placeholder="150.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="preferredTime">Horário Preferido</Label>
                  <Input
                    id="preferredTime"
                    type="datetime-local"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações Adicionais</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informações adicionais que podem ajudar o médico..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Como funciona o Leilão Reverso:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Você define o valor máximo que deseja pagar</li>
                  <li>• Médicos qualificados enviam suas propostas</li>
                  <li>• Você escolhe a melhor oferta (menor preço + qualificação)</li>
                  <li>• Consulta é confirmada automaticamente</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={createTeleconsultMutation.isPending}
              >
                {createTeleconsultMutation.isPending ? 'Criando...' : 'Iniciar Leilão'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'waiting') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Timer className="h-5 w-5 animate-spin" />
              Aguardando Propostas
            </CardTitle>
            <CardDescription>
              Médicos estão analisando sua solicitação e enviando propostas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-4xl font-bold text-blue-600">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-muted-foreground">
              Tempo restante para receber propostas
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Notificando médicos qualificados...
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Analisando disponibilidade...
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumo da Solicitação:</h4>
              <div className="text-sm text-left space-y-1">
                <p><strong>Sintomas:</strong> {formData.symptoms}</p>
                <p><strong>Urgência:</strong> <Badge className={getUrgencyColor(formData.urgency)}>{getUrgencyText(formData.urgency)}</Badge></p>
                <p><strong>Valor Máximo:</strong> R$ {formData.maxPrice}</p>
                <p><strong>Tipo:</strong> {formData.consultationType === 'video' ? 'Videochamada' : formData.consultationType === 'audio' ? 'Áudio' : 'Chat'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'responses') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Propostas Recebidas ({responses.length})
            </CardTitle>
            <CardDescription>
              Escolha a melhor proposta baseada no preço e qualificação do médico
            </CardDescription>
          </CardHeader>
          <CardContent>
            {responses.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma proposta recebida ainda. Aguarde mais alguns momentos...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((response: any) => (
                  <div key={response.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={response.doctor?.user?.profileImageUrl} />
                          <AvatarFallback>
                            Dr
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">
                              Dr. {response.doctor?.firstName} {response.doctor?.lastName}
                            </h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{response.rating || '4.8'}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {response.doctor?.specialty || 'Clínico Geral'} • {response.doctor?.experience || '8'} anos de experiência
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{response.doctor?.location || 'São Paulo, SP'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Disponível agora</span>
                            </div>
                          </div>

                          {response.notes && (
                            <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                              "{response.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          R$ {response.offeredPrice?.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {((1 - response.offeredPrice / parseFloat(formData.maxPrice)) * 100).toFixed(0)}% de desconto
                        </div>
                        <Button
                          onClick={() => acceptResponseMutation.mutate(response.id)}
                          disabled={acceptResponseMutation.isPending}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirmed') {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Consulta Confirmada!</h2>
            <p className="text-muted-foreground mb-6">
              Sua teleconsulta foi agendada com sucesso. Você receberá um link para acessar a consulta.
            </p>
            
            <div className="space-y-2 mb-6">
              <Button className="w-full" size="lg">
                <Video className="h-4 w-4 mr-2" />
                Acessar Consulta
              </Button>
              <Button variant="outline" className="w-full">
                Ver Detalhes da Consulta
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Você receberá lembretes por email e SMS antes da consulta.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}