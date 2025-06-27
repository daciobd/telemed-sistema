import { Shield, Phone, Mail, User, MessageCircle, FileText, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
}

interface PatientDataProtectionProps {
  patient: Patient;
  isDoctor?: boolean;
}

export default function PatientDataProtection({ patient, isDoctor = false }: PatientDataProtectionProps) {
  
  // Função para mascarar dados sensíveis para médicos
  const maskSensitiveData = (data: string, type: 'phone' | 'email' | 'cpf') => {
    if (!isDoctor) return data; // Paciente vê seus próprios dados completos
    
    switch (type) {
      case 'phone':
        return data.replace(/(\d{2})(\d{4})(\d{4})/, '($1) ****-$3');
      case 'email':
        const [username, domain] = data.split('@');
        return `${username.charAt(0)}****@${domain}`;
      case 'cpf':
        return data.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.***-$4');
      default:
        return data;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Proteção */}
      {isDoctor && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800 text-lg">Proteção de Dados do Paciente</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              Por segurança da plataforma, dados de contato são protegidos. Use apenas os canais oficiais da TeleMed.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Dados do Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informações do Paciente</span>
            {isDoctor && <Badge variant="secondary" className="ml-auto">Dados Protegidos</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome Completo */}
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Nome</p>
              <p className="text-base">{patient.name}</p>
            </div>
          </div>

          <Separator />

          {/* Telefone */}
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Telefone</p>
              <p className="text-base">{maskSensitiveData(patient.phone, 'phone')}</p>
            </div>
            {isDoctor && <Lock className="h-4 w-4 text-amber-500" />}
          </div>

          <Separator />

          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-base">{maskSensitiveData(patient.email, 'email')}</p>
            </div>
            {isDoctor && <Lock className="h-4 w-4 text-amber-500" />}
          </div>

          <Separator />

          {/* CPF */}
          <div className="flex items-center space-x-3">
            <FileText className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">CPF</p>
              <p className="text-base">{maskSensitiveData(patient.cpf, 'cpf')}</p>
            </div>
            {isDoctor && <Lock className="h-4 w-4 text-amber-500" />}
          </div>
        </CardContent>
      </Card>

      {/* Canais de Comunicação para Médicos */}
      {isDoctor && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <MessageCircle className="h-5 w-5" />
              <span>Comunicação com o Paciente</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Use apenas os canais oficiais da TeleMed para contato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-blue-200 hover:bg-blue-100"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar Mensagem via TeleMed
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-green-200 hover:bg-green-100"
            >
              <FileText className="h-4 w-4 mr-2" />
              Enviar Receita via WhatsApp Institucional
            </Button>
            
            <div className="text-xs text-blue-600 mt-3 p-3 bg-blue-100 rounded-lg">
              <strong>📞 WhatsApp TeleMed:</strong> (11) 9999-8888<br />
              Todas as receitas são enviadas automaticamente por este número oficial.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sistema de Receitas Seguras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Sistema de Receitas Seguras</span>
          </CardTitle>
          <CardDescription>
            {isDoctor 
              ? "As receitas são enviadas automaticamente via WhatsApp institucional da TeleMed"
              : "Acesse suas receitas de forma segura através da plataforma"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDoctor ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-700">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Proteção automática ativada</span>
              </div>
              <div className="text-sm text-gray-600">
                • Receitas enviadas pelo WhatsApp (11) 9999-8888<br />
                • Paciente não recebe seu contato pessoal<br />
                • Histórico mantido na plataforma<br />
                • Conformidade total com LGPD
              </div>
            </div>
          ) : (
            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Acessar Minhas Receitas
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}