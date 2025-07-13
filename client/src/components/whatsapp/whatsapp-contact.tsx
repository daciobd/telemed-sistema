import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppContactProps {
  doctorName?: string;
  doctorPhone?: string;
  patientName?: string;
}

export default function WhatsAppContact({ 
  doctorName = "Dr. Equipe Médica", 
  doctorPhone = "5511999998888",
  patientName = ""
}: WhatsAppContactProps) {
  const [message, setMessage] = useState("");
  const [patientInfo, setPatientInfo] = useState(patientName);
  const { toast } = useToast();

  const generateWhatsAppLink = () => {
    // Simplified message for better compatibility
    const baseMessage = `Olá ${doctorName}! Sou ${patientInfo || "um paciente"} da TeleMed. Dúvida: ${message}`;

    const encodedMessage = encodeURIComponent(baseMessage);
    return `https://api.whatsapp.com/send?phone=${doctorPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, escreva sua dúvida antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    const whatsappUrl = generateWhatsAppLink();
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Sua mensagem foi preparada e você será direcionado ao WhatsApp.",
    });

    // Clear form after sending
    setMessage("");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center bg-green-50">
        <CardTitle className="flex items-center justify-center gap-2 text-green-700">
          <MessageCircle className="h-5 w-5" />
          Contato via WhatsApp
        </CardTitle>
        <p className="text-sm text-green-600">
          Envie sua dúvida médica diretamente para {doctorName}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-6">
        <div>
          <Label htmlFor="patient-name">Seu nome (opcional)</Label>
          <Input
            id="patient-name"
            value={patientInfo}
            onChange={(e) => setPatientInfo(e.target.value)}
            placeholder="Digite seu nome"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="message">Sua dúvida médica *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Descreva sua dúvida ou sintomas..."
            className="mt-1 min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length}/500 caracteres
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Phone className="h-4 w-4" />
            <span>Contato: {doctorPhone}</span>
          </div>
          <p className="text-xs text-gray-500">
            Você será redirecionado para o WhatsApp com a mensagem pré-formatada
          </p>
        </div>

        <Button 
          onClick={handleSendMessage}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar via WhatsApp
        </Button>

        <p className="text-xs text-center text-gray-500">
          ⚠️ Esta é uma comunicação não-emergencial. Em caso de urgência, procure atendimento médico imediato.
        </p>
      </CardContent>
    </Card>
  );
}