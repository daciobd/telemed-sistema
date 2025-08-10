import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, DollarSign, User, Phone, MessageSquare, Calendar } from 'lucide-react';

interface TeleconsultOffer {
  id: number;
  patientName: string;
  specialty: string;
  offeredPrice: number;
  symptoms: string;
  urgency: string;
  createdAt: string;
  status: string;
}

interface TeleconsultResponse {
  doctorId: number;
  appointmentId: number;
  acceptedPrice: number;
  message: string;
  availableSlots: string[];
}

export default function OfertasTeleconsulta() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedOffer, setSelectedOffer] = useState<TeleconsultOffer | null>(null);
  const [responseData, setResponseData] = useState<TeleconsultResponse>({
    doctorId: 0,
    appointmentId: 0,
    acceptedPrice: 0,
    message: '',
    availableSlots: []
  });

  // Get available teleconsult offers for the doctor's specialty
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['/api/teleconsult/offers'],
    enabled: !!user?.doctor
  });

  // Get doctor's existing responses
  const { data: myResponses = [] } = useQuery({
    queryKey: ['/api/teleconsult/my-responses'],
    enabled: !!user?.doctor
  });

  // Mutation to respond to an offer
  const respondToOfferMutation = useMutation({
    mutationFn: async (data: TeleconsultResponse) => {
      const response = await fetch('/api/teleconsult/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit response');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Resposta enviada!",
        description: "Sua proposta foi enviada para o paciente.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/teleconsult/offers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/teleconsult/my-responses'] });
      setSelectedOffer(null);
      setResponseData({
        doctorId: 0,
        appointmentId: 0,
        acceptedPrice: 0,
        message: '',
        availableSlots: []
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao enviar resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleSelectOffer = (offer: TeleconsultOffer) => {
    setSelectedOffer(offer);
    setResponseData({
      doctorId: user?.doctor?.id || 0,
      appointmentId: offer.id,
      acceptedPrice: offer.offeredPrice,
      message: `Olá! Aceito realizar a teleconsulta sobre ${offer.symptoms} pelo valor oferecido de R$ ${offer.offeredPrice.toFixed(2)}.`,
      availableSlots: []
    });
  };

  const handleSubmitResponse = () => {
    if (!responseData.message.trim() || responseData.acceptedPrice <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a mensagem e confirme o valor.",
        variant: "destructive"
      });
      return;
    }

    respondToOfferMutation.mutate(responseData);
  };

  if (!user?.doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Esta página é exclusiva para médicos.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ofertas de Teleconsulta</h1>
          <p className="text-gray-600">
            Visualize e responda às solicitações de teleconsulta na sua especialidade.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (offers as TeleconsultOffer[]).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma oferta disponível
              </h3>
              <p className="text-gray-600">
                Não há solicitações de teleconsulta para sua especialidade no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Offers List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Ofertas Disponíveis</h2>
              
              {(offers as TeleconsultOffer[]).map((offer: TeleconsultOffer) => (
                <Card 
                  key={offer.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedOffer?.id === offer.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectOffer(offer)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {offer.patientName}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{offer.specialty}</p>
                      </div>
                      <Badge variant={offer.urgency === 'Urgente' ? 'destructive' : 'secondary'}>
                        {offer.urgency}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        R$ {offer.offeredPrice.toFixed(2)}
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Sintomas:</p>
                        <p className="text-sm text-gray-600">{offer.symptoms}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(offer.createdAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Response Form */}
            {selectedOffer && (
              <div className="lg:sticky lg:top-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Responder Oferta
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="patient">Paciente</Label>
                      <Input 
                        id="patient"
                        value={selectedOffer.patientName}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Valor da Consulta (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={responseData.acceptedPrice}
                        onChange={(e) => setResponseData(prev => ({
                          ...prev,
                          acceptedPrice: parseFloat(e.target.value) || 0
                        }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensagem para o Paciente</Label>
                      <Textarea
                        id="message"
                        value={responseData.message}
                        onChange={(e) => setResponseData(prev => ({
                          ...prev,
                          message: e.target.value
                        }))}
                        placeholder="Digite sua mensagem..."
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSubmitResponse}
                        disabled={respondToOfferMutation.isPending}
                        className="flex-1"
                      >
                        {respondToOfferMutation.isPending ? 'Enviando...' : 'Aceitar Oferta'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOffer(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* My Responses Section */}
        {(myResponses as any[]).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Minhas Respostas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(myResponses as any[]).map((response: any) => (
                <Card key={response.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{response.patientName}</CardTitle>
                    <Badge variant="outline">{response.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{response.message}</p>
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      R$ {response.acceptedPrice.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}