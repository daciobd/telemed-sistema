import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  MessageSquare, 
  ExternalLink,
  Bell,
  Smartphone
} from 'lucide-react';

interface TeleconsultOffer {
  id: number;
  patientName: string;
  specialty: string;
  offeredPrice: number;
  symptoms: string;
  urgency: string;
  createdAt: string;
  status: string;
  whatsappUrl?: string;
}

export default function MedicalNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get pending teleconsult offers for notifications
  const { data: pendingOffers = [], isLoading } = useQuery({
    queryKey: ['/api/teleconsult/pending-offers'],
    enabled: !!user?.doctor,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const generateWhatsAppMessage = (offer: TeleconsultOffer) => {
    return `🏥 *Nova Oferta de Teleconsulta - TeleMed*

👤 *Paciente:* ${offer.patientName}
🩺 *Especialidade:* ${offer.specialty}
💰 *Valor Oferecido:* R$ ${offer.offeredPrice.toFixed(2)}
📝 *Sintomas:* ${offer.symptoms}

🔗 *Aceitar Oferta:* ${window.location.origin}/ofertas-teleconsulta

⏰ Responda rapidamente para aceitar esta consulta!

_TeleMed Sistema - Conectando médicos e pacientes_`;
  };

  const generateWhatsAppUrl = (offer: TeleconsultOffer) => {
    // Use doctor's demo phone number based on doctor ID
    const demoPhones: { [key: number]: string } = {
      1: '5511999001001', 2: '5511999001002', 3: '5511999001003',
      4: '5511999001004', 5: '5511999001005', 6: '5511999001006',
      7: '5511999001007', 8: '5511999001008', 9: '5511999001009',
      10: '5511999001010'
    };
    
    const doctorPhone = demoPhones[user?.doctor?.id || 1] || '5511999000000';
    const message = generateWhatsAppMessage(offer);
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${doctorPhone}?text=${encodedMessage}`;
  };

  const openWhatsApp = (offer: TeleconsultOffer) => {
    const whatsappUrl = generateWhatsAppUrl(offer);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto!",
      description: "A mensagem foi preparada. Envie para receber a notificação.",
    });
  };

  const sendTestNotification = () => {
    const testOffer: TeleconsultOffer = {
      id: 999,
      patientName: "Maria Silva",
      specialty: user?.doctor?.specialty || "Clínica Geral",
      offeredPrice: 150,
      symptoms: "Dor de cabeça persistente há 3 dias",
      urgency: "Normal",
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    openWhatsApp(testOffer);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Notificações Médicas</h1>
          <p className="text-gray-600">
            Receba notificações via WhatsApp quando houver novas ofertas de teleconsulta.
          </p>
        </div>

        {/* Notification System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notificações Automáticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Quando um paciente faz uma oferta de teleconsulta na sua especialidade, 
                você recebe uma notificação instantânea.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-green-600" />
                Via WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                As notificações são enviadas diretamente para o seu WhatsApp 
                com todos os detalhes da consulta e link para aceitar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Resposta Rápida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Acesse diretamente a página de ofertas através do link 
                na mensagem para aceitar ou contra-propor rapidamente.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Notification Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Testar Sistema de Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Teste como você receberá as notificações de novas ofertas de teleconsulta:
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Como funciona:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Paciente faz oferta de teleconsulta na sua especialidade</li>
                  <li>Sistema gera notificação WhatsApp automaticamente</li>
                  <li>Você recebe mensagem com detalhes e link para aceitar</li>
                  <li>Clica no link e acessa a página de ofertas</li>
                  <li>Aceita, recusa ou faz contra-proposta</li>
                </ol>
              </div>

              <Button
                onClick={sendTestNotification}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Enviar Notificação de Teste para WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Pending Offers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ofertas Pendentes</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
          ) : pendingOffers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma oferta pendente
                </h3>
                <p className="text-gray-600">
                  Não há ofertas de teleconsulta aguardando sua resposta no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(pendingOffers as TeleconsultOffer[]).map((offer) => (
                <Card key={offer.id} className="hover:shadow-md transition-shadow">
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
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      R$ {offer.offeredPrice.toFixed(2)}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Sintomas:</p>
                      <p className="text-sm text-gray-600">{offer.symptoms}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openWhatsApp(offer)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Enviar WhatsApp
                      </Button>
                      
                      <Button
                        onClick={() => window.location.href = '/ofertas-teleconsulta'}
                        size="sm"
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Oferta
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(offer.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Como Configurar Notificações WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Configuração Manual (Atual):</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Use o botão "Enviar Notificação de Teste" para ver como funciona</li>
                  <li>Quando houver ofertas reais, use o botão "Enviar WhatsApp" em cada oferta</li>
                  <li>Isso abrirá seu WhatsApp com a mensagem pronta para enviar</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Configuração Automática (Futuro):</h4>
                <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                  <li>Integração com Twilio para envio automático de SMS</li>
                  <li>WhatsApp Business API para notificações automáticas</li>
                  <li>Push notifications no navegador</li>
                  <li>Email de notificação como backup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}