import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Pill, 
  TestTube, 
  Users, 
  MessageSquare, 
  BarChart3, 
  CreditCard,
  CheckCircle,
  Play,
  Download,
  ExternalLink
} from "lucide-react";

const guideSteps = [
  {
    id: "login",
    title: "Acesso ao Sistema",
    icon: <Play className="h-5 w-5" />,
    description: "Login e navegação inicial no dashboard médico",
    details: [
      "Faça login com suas credenciais",
      "Explore o dashboard com estatísticas em tempo real",
      "Familiarize-se com o menu lateral e header"
    ],
    route: "/",
    time: "2 min"
  },
  {
    id: "agenda",
    title: "Agenda Médica",
    icon: <Video className="h-5 w-5" />,
    description: "Visualize consultas com indicadores visuais em tempo real",
    details: [
      "Acesse 'Agenda Médica' no menu lateral",
      "Observe ícones piscantes para consultas aguardando",
      "Inicie uma videoconsulta de teste"
    ],
    route: "/doctor-agenda",
    time: "3 min"
  },
  {
    id: "videoconsulta",
    title: "Videoconsulta Completa",
    icon: <Video className="h-5 w-5" />,
    description: "Teste câmera, microfone, chat e compartilhamento de tela",
    details: [
      "Permita acesso à câmera e microfone",
      "Teste controles de áudio e vídeo",
      "Use o chat em tempo real",
      "Experimente compartilhamento de tela"
    ],
    route: "/video-call/12",
    time: "5 min"
  },
  {
    id: "prontuario",
    title: "Prontuário Eletrônico",
    icon: <FileText className="h-5 w-5" />,
    description: "Documente consultas com busca CID-10 integrada",
    details: [
      "Abra o prontuário durante a videoconsulta",
      "Preencha queixa principal e anamnese",
      "Use busca automática de códigos CID-10",
      "Salve e finalize a consulta"
    ],
    route: "/video-call/12",
    time: "4 min"
  },
  {
    id: "memed",
    title: "Integração MEMED (DESTAQUE)",
    icon: <Pill className="h-5 w-5" />,
    description: "Prescrições com preenchimento automático dos dados do paciente",
    details: [
      "Clique no botão verde 'MEMED' no prontuário",
      "Veja dados do paciente (DACIO DUTRA) pré-carregados",
      "Use 'Copiar Dados' para facilitar preenchimento",
      "Abra MEMED e cole os dados automaticamente"
    ],
    route: "/prescriptions",
    time: "3 min",
    highlight: true
  },
  {
    id: "exames",
    title: "Exames Clínicos",
    icon: <TestTube className="h-5 w-5" />,
    description: "Solicite exames por categoria com instruções automáticas",
    details: [
      "Acesse solicitação de exames no dashboard",
      "Escolha categoria (sangue, urina, imagem, etc.)",
      "Defina prioridade e instruções de preparo",
      "Visualize exames solicitados"
    ],
    route: "/",
    time: "3 min"
  },
  {
    id: "encaminhamentos",
    title: "Encaminhamentos",
    icon: <Users className="h-5 w-5" />,
    description: "Encaminhe para especialistas (presencial ou teleconsulta)",
    details: [
      "Crie encaminhamento para especialidade",
      "Escolha entre presencial ou teleconsulta",
      "Adicione resumo clínico e motivo",
      "Defina prioridade do encaminhamento"
    ],
    route: "/",
    time: "2 min"
  },
  {
    id: "whatsapp",
    title: "Contato WhatsApp",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Sistema de comunicação direta com pacientes",
    details: [
      "Acesse 'Contato WhatsApp' no menu",
      "Veja mensagens pré-formatadas",
      "Observe avisos de segurança para emergências",
      "Teste links diretos para WhatsApp"
    ],
    route: "/whatsapp-contact",
    time: "2 min"
  },
  {
    id: "relatorios",
    title: "Relatórios e Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Dashboard avançado com métricas e gráficos interativos",
    details: [
      "Visualize estatísticas detalhadas",
      "Explore gráficos de consultas e receita",
      "Analise satisfação dos pacientes",
      "Exporte relatórios em PDF"
    ],
    route: "/reports",
    time: "3 min"
  },
  {
    id: "pagamentos",
    title: "Sistema de Pagamentos",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Pagamentos Stripe integrados com cartão de teste",
    details: [
      "Acesse 'Agendamentos' no menu",
      "Clique em 'Pagar R$ 150,00' em qualquer consulta",
      "Use cartão teste: 4242 4242 4242 4242",
      "Data: 12/34, CVC: 123"
    ],
    route: "/appointments",
    time: "2 min"
  }
];

export default function GuiaMedico() {
  const { isAuthenticated, isLoading } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const downloadGuide = () => {
    const link = document.createElement('a');
    link.href = '/GUIA_MEDICO_TESTE.md';
    link.download = 'Guia_Medico_Telemed.md';
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="lg:pl-64">
        <Header />
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    Guia de Teste para Médicos
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Passo a passo completo para demonstração do sistema de telemedicina
                  </p>
                </div>
                <Button onClick={downloadGuide} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </Button>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {completedSteps.length}/{guideSteps.length} Concluídos
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Tempo Total: ~30 min
                </Badge>
              </div>
            </div>

            {/* Progress Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progresso do Teste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps.length / guideSteps.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {completedSteps.length === guideSteps.length 
                    ? "🎉 Parabéns! Você completou todos os testes do sistema!"
                    : `${guideSteps.length - completedSteps.length} etapas restantes para completar o teste`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Steps List */}
            <div className="space-y-4">
              {guideSteps.map((step, index) => (
                <Card 
                  key={step.id} 
                  className={`transition-all duration-200 ${
                    step.highlight ? 'ring-2 ring-green-500 bg-green-50' : ''
                  } ${
                    completedSteps.includes(step.id) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          completedSteps.includes(step.id) 
                            ? 'bg-blue-100 text-blue-600' 
                            : step.highlight
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {step.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">
                              Passo {index + 1}
                            </span>
                            {step.highlight && (
                              <Badge className="bg-green-500 text-white">DESTAQUE</Badge>
                            )}
                            <Badge variant="outline">{step.time}</Badge>
                          </div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.route && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(step.route, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Testar
                          </Button>
                        )}
                        <Button
                          variant={completedSteps.includes(step.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleStepCompletion(step.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {completedSteps.includes(step.id) ? 'Concluído' : 'Marcar'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {currentStep === step.id && (
                    <CardContent>
                      <Separator className="mb-4" />
                      <h4 className="font-medium mb-2">Instruções Detalhadas:</h4>
                      <ul className="space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-blue-500 mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                  
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(currentStep === step.id ? null : step.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {currentStep === step.id ? 'Ocultar detalhes' : 'Ver instruções detalhadas'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Completion Message */}
            {completedSteps.length === guideSteps.length && (
              <Card className="mt-6 bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Teste Completo Realizado!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Você experimentou todas as funcionalidades do sistema de telemedicina.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="text-center">
                        <Video className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p>Videoconsultas</p>
                      </div>
                      <div className="text-center">
                        <Pill className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p>MEMED Integrada</p>
                      </div>
                      <div className="text-center">
                        <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p>Prontuário Digital</p>
                      </div>
                      <div className="text-center">
                        <CreditCard className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p>Pagamentos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}