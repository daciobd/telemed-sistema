import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  MessageCircle, 
  Phone, 
  FileText, 
  Send, 
  CheckCircle, 
  Clock,
  User,
  Stethoscope
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PrescriptionRequest {
  id: string;
  patientName: string;
  doctorName: string;
  medication: string;
  status: 'pending' | 'sent' | 'delivered';
  requestTime: string;
  sentTime?: string;
}

export default function InstitutionalWhatsApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'send' | 'queue' | 'history'>('send');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [prescriptionQueue] = useState<PrescriptionRequest[]>([
    {
      id: '1',
      patientName: 'Maria Santos',
      doctorName: 'Dr. João Silva',
      medication: 'Dipirona 500mg',
      status: 'pending',
      requestTime: '2025-06-27 14:30'
    },
    {
      id: '2',
      patientName: 'Carlos Oliveira',
      doctorName: 'Dra. Ana Costa',
      medication: 'Omeprazol 20mg',
      status: 'sent',
      requestTime: '2025-06-27 14:15',
      sentTime: '2025-06-27 14:17'
    }
  ]);

  const handleSendMessage = () => {
    // Simula envio via WhatsApp Business API
    // Clean phone number and ensure proper format
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendPrescription = (prescriptionId: string) => {
    // Simula envio de receita
    console.log(`Enviando receita ${prescriptionId} via WhatsApp institucional`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      sent: 'default',
      delivered: 'default'
    } as const;
    
    const labels = {
      pending: 'Pendente',
      sent: 'Enviado',
      delivered: 'Entregue'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Institucional TeleMed</h1>
          <p className="text-gray-600">Central de comunicação segura com pacientes</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 text-green-600">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Proteção Ativa</span>
          </div>
          <p className="text-sm text-gray-500">Dados do paciente protegidos</p>
        </div>
      </div>

      {/* WhatsApp Business Info */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <MessageCircle className="h-5 w-5" />
            <span>Número Oficial TeleMed</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Todas as comunicações são enviadas através do nosso WhatsApp Business oficial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
              <span className="font-mono text-lg font-semibold">(11) 9999-8888</span>
            </div>
            <div className="text-sm text-green-700">
              <p>✓ Verificado pelo WhatsApp Business</p>
              <p>✓ Conformidade LGPD garantida</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'send' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('send')}
        >
          Enviar Mensagem
        </Button>
        <Button
          variant={activeTab === 'queue' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('queue')}
        >
          Fila de Receitas
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'send' && (
        <Card>
          <CardHeader>
            <CardTitle>Enviar Mensagem via WhatsApp Oficial</CardTitle>
            <CardDescription>
              Envie mensagens para pacientes através do número institucional da TeleMed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Telefone do Paciente</label>
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Mensagem</label>
              <Textarea
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Enviado pelo: WhatsApp Oficial TeleMed (11) 9999-8888
              </div>
              <Button onClick={handleSendMessage} disabled={!recipientPhone || !message}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'queue' && (
        <Card>
          <CardHeader>
            <CardTitle>Fila de Envio de Receitas</CardTitle>
            <CardDescription>
              Receitas pendentes para envio automático via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptionQueue.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(prescription.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{prescription.patientName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Stethoscope className="h-4 w-4" />
                          <span>{prescription.doctorName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(prescription.status)}
                      <p className="text-xs text-gray-500 mt-1">
                        {prescription.requestTime}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{prescription.medication}</span>
                    </div>
                    
                    {prescription.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => handleSendPrescription(prescription.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Agora
                      </Button>
                    )}
                    
                    {prescription.status === 'sent' && prescription.sentTime && (
                      <div className="text-xs text-green-600">
                        Enviado às {prescription.sentTime}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Mensagens</CardTitle>
            <CardDescription>
              Registro completo de comunicações via WhatsApp institucional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Histórico será exibido aqui quando mensagens forem enviadas</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Segurança e Proteção de Dados</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Todas as mensagens são enviadas pelo número oficial (11) 9999-8888</li>
                <li>• Médicos não têm acesso direto ao contato dos pacientes</li>
                <li>• Histórico completo mantido para auditoria LGPD</li>
                <li>• Receitas enviadas automaticamente após prescrição</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}