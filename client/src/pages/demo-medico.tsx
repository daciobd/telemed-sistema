import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Stethoscope, Video, MessageCircle, ClipboardList, Star, Users, Calendar } from "lucide-react";
import { useCredentialAuth } from "@/hooks/useCredentialAuth";

const MEDICAL_SPECIALTIES = [
  "Clínico Geral", "Cardiologia", "Dermatologia", "Endocrinologia", 
  "Ginecologia", "Neurologia", "Ortopedia", "Pediatria", "Psiquiatria", 
  "Urologia", "Gastroenterologia", "Oftalmologia", "Otorrinolaringologia"
];

export default function DemoMedico() {
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    telefone: ""
  });
  const [step, setStep] = useState<'form' | 'guide'>('form');
  const { loginAsDemo } = useCredentialAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.crm || !formData.especialidade) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Login automático como médico demo
    await loginAsDemo('doctor', {
      name: formData.nome,
      crm: formData.crm,
      specialty: formData.especialidade,
      phone: formData.telefone
    });

    setStep('guide');
  };

  const handleStartTesting = () => {
    window.location.href = "/";
  };

  if (step === 'guide') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Bem-vindo, Dr(a). {formData.nome}!</CardTitle>
              <CardDescription className="text-blue-100">
                Sistema TeleMed - Plataforma de Telemedicina Completa
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Passo 1: Teste de Videoconsulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Para testar videoconsulta com outra pessoa:
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Link para compartilhar:</p>
                  <code className="text-xs bg-white p-2 rounded block mt-1">
                    {window.location.origin}/video-test
                  </code>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Envie este link para colega/assistente</li>
                  <li>• Você: escolha "Médico"</li>
                  <li>• Colega: escolha "Paciente"</li>
                  <li>• Testem vídeo, áudio e chat</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                  Passo 2: Prescrições MEMED
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sistema integrado com MEMED para prescrições digitais:
                </p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Acesse "Prescrições" no menu</li>
                  <li>• Clique "Abrir MEMED"</li>
                  <li>• Use dados do paciente fornecidos</li>
                  <li>• Teste busca de medicamentos</li>
                </ul>
                <Badge variant="outline" className="text-green-600">
                  Prescrições Válidas Juridicamente
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Passo 3: Notificações WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sistema automático de notificações:
                </p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Acesse "Notificações WhatsApp"</li>
                  <li>• Veja ofertas de teleconsulta</li>
                  <li>• Teste envio de mensagens</li>
                  <li>• Configure seu número WhatsApp</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Passo 4: Funcionalidades Médicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Explore todas as funcionalidades:
                </p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Dashboard com estatísticas</li>
                  <li>• Agenda médica avançada</li>
                  <li>• Prontuários eletrônicos</li>
                  <li>• Sistema financeiro</li>
                  <li>• Avaliações de pacientes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={handleStartTesting}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Iniciar Teste da Plataforma
            </Button>
            <p className="text-sm text-gray-500">
              Dúvidas? WhatsApp: (11) 9999-8888 | Email: suporte@telemed.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Demo TeleMed</CardTitle>
          <CardDescription>
            Acesso para Médicos Testarem a Plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
                placeholder="Dr. João Silva"
                required
              />
            </div>

            <div>
              <Label htmlFor="crm">CRM *</Label>
              <Input
                id="crm"
                value={formData.crm}
                onChange={(e) => setFormData(prev => ({...prev, crm: e.target.value}))}
                placeholder="123456-SP"
                required
              />
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade *</Label>
              <Select 
                value={formData.especialidade} 
                onValueChange={(value) => setFormData(prev => ({...prev, especialidade: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICAL_SPECIALTIES.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="telefone">WhatsApp (opcional)</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({...prev, telefone: e.target.value}))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Acessar Demo da Plataforma
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              Esta é uma demonstração completa do sistema TeleMed.<br/>
              Todos os dados são fictícios para fins de teste.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}