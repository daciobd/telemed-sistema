import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Star, MessageCircle, Download, WhatsApp } from "lucide-react";

export default function GuiaFeedback() {
  const testPhases = [
    {
      phase: "FASE 1",
      title: "Primeiro Acesso",
      duration: "5 min",
      tasks: [
        "Acesse a URL principal",
        "Teste o botão WhatsApp",
        "Acesse /api-test para verificar conectividade",
        "Entre via 'Demo para Médicos'"
      ],
      feedback: "A página carrega? O design é profissional? A navegação é intuitiva?"
    },
    {
      phase: "FASE 2", 
      title: "Dashboard Médico",
      duration: "10 min",
      tasks: [
        "Explore o dashboard principal",
        "Verifique estatísticas e métricas",
        "Navegue pelos menus laterais",
        "Teste responsividade no celular"
      ],
      feedback: "As informações são úteis? O layout funciona bem no mobile?"
    },
    {
      phase: "FASE 3",
      title: "Gestão de Pacientes", 
      duration: "15 min",
      tasks: [
        "Acesse 'Pacientes' no menu",
        "Visualize dados dos pacientes demo",
        "Teste busca e filtros",
        "Explore prontuários eletrônicos"
      ],
      feedback: "Os dados são organizados de forma clara? Falta alguma informação crítica?"
    },
    {
      phase: "FASE 4",
      title: "Sistema de Consultas",
      duration: "20 min", 
      tasks: [
        "Acesse 'Consultas' ou 'Agendamentos'",
        "Verifique agenda do dia",
        "Teste sistema de pagamentos (Stripe)",
        "Explore histórico de consultas"
      ],
      feedback: "O fluxo de pagamento é claro? As informações são suficientes?"
    },
    {
      phase: "FASE 5",
      title: "Videoconsultas WebRTC",
      duration: "15 min",
      tasks: [
        "Inicie uma videoconsulta",
        "Teste câmera, microfone e chat", 
        "Experimente compartilhamento de tela",
        "Use /video-test para teste com duas pessoas"
      ],
      feedback: "A qualidade do vídeo é boa? Os controles são intuitivos?"
    },
    {
      phase: "FASE 6", 
      title: "Prescrições MEMED",
      duration: "15 min",
      tasks: [
        "Acesse integração MEMED",
        "Teste busca de medicamentos",
        "Experimente templates de prescrição", 
        "Copie dados do paciente para MEMED"
      ],
      feedback: "A integração facilita seu trabalho? Os dados estão corretos?"
    },
    {
      phase: "FASE 7",
      title: "Funcionalidades Avançadas",
      duration: "20 min",
      tasks: [
        "Teste Assistente IA médico",
        "Explore sistema de psiquiatria (PHQ-9/GAD-7)",
        "Use sistema de exames clínicos",
        "Teste encaminhamentos médicos"
      ],
      feedback: "Estas funcionalidades agregam valor real? São precisas?"
    }
  ];

  const evaluationCriteria = [
    "Design e Usabilidade",
    "Funcionalidades Médicas", 
    "Integração MEMED",
    "Videoconsultas",
    "Performance"
  ];

  const downloadGuide = () => {
    const content = document.querySelector('.guide-content')?.textContent || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Guia_Feedback_TeleMed.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Guia de Teste e Feedback
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Para Médicos e Profissionais de Saúde
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={downloadGuide}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Guia Completo
            </Button>
            <Button 
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5511987654321&text=Gostaria%20de%20enviar%20feedback%20sobre%20o%20TeleMed', '_blank')}
              className="bg-green-500 hover:bg-green-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Enviar Feedback via WhatsApp
            </Button>
          </div>
        </div>

        {/* Access Info */}
        <Card className="mb-8 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
              Acesso à Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">URL Principal:</h4>
                <code className="bg-black/30 px-3 py-1 rounded text-blue-200">
                  https://telemed-consultation-daciobd.replit.app/
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Acesso Rápido:</h4>
                <ul className="text-blue-200 space-y-1">
                  <li>• Demo para Médicos</li>
                  <li>• /demo-medico (direto)</li>
                  <li>• /api-test (teste técnico)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Phases */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testPhases.map((phase, index) => (
            <Card key={index} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
                    {phase.phase}
                  </Badge>
                  <div className="flex items-center text-white">
                    <Clock className="mr-1 h-4 w-4" />
                    <span className="text-sm">{phase.duration}</span>
                  </div>
                </div>
                <CardTitle className="text-white">{phase.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-blue-200 mb-2">Tarefas:</h5>
                    <ul className="text-sm space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-200 mb-1">Feedback esperado:</h5>
                    <p className="text-sm text-gray-300">{phase.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Evaluation Criteria */}
        <Card className="mb-8 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-400" />
              Critérios de Avaliação (1-5 estrelas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evaluationCriteria.map((criteria, index) => (
                <div key={index} className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{criteria}</h4>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-200">Avisos Importantes</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-yellow-200 mb-2">Dados de Demo</h4>
                <p className="text-sm">Todos os pacientes e consultas são fictícios. Use apenas dados demo para testes.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-200 mb-2">Ambiente de Teste</h4>
                <p className="text-sm">Esta é uma versão de demonstração. Foco na avaliação do conceito.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-200 mb-2">Confidencialidade</h4>
                <p className="text-sm">Seus dados de teste não são compartilhados. Feedback usado apenas para melhorias.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-blue-200 text-lg">
            <strong>Obrigado por testar o TeleMed Sistema!</strong>
          </p>
          <p className="text-white/80">
            Sua experiência como médico é fundamental para criarmos a melhor plataforma de telemedicina do Brasil.
          </p>
        </div>
      </div>
    </div>
  );
}