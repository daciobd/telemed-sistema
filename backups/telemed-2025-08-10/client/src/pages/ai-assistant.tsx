import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  User, 
  Send, 
  Brain, 
  Stethoscope, 
  AlertTriangle,
  FileText,
  Activity,
  Lightbulb,
  Shield,
  Mic,
  MicOff
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysis?: {
    possibleConditions: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
    recommendations: string[];
    symptoms: string[];
  };
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou seu assistente médico inteligente. Posso ajudar com análise de sintomas, sugestões de tratamento e orientações médicas gerais. Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/analyze", { 
        message,
        history: messages.slice(-5) // Send last 5 messages for context
      });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        analysis: data.analysis
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Erro",
          description: "Não foi possível reconhecer sua voz. Tente novamente.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Não suportado",
        description: "Reconhecimento de voz não é suportado neste navegador.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (level: string) => {
    switch (level) {
      case 'emergency': return 'Emergência';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return level;
    }
  };

  const quickQuestions = [
    "Estou com dor de cabeça há 2 dias",
    "Tenho febre e dor no corpo",
    "Dor no peito ao respirar",
    "Náusea e vômito persistente",
    "Dor abdominal intensa",
    "Tosse seca há uma semana"
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Assistente Médico IA
          </CardTitle>
          <CardDescription>
            Análise inteligente de sintomas e orientações médicas baseadas em IA
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    {message.type === 'ai' ? (
                      <Bot className="h-4 w-4 text-purple-600 mt-0.5" />
                    ) : (
                      <User className="h-4 w-4 text-white mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {format(message.timestamp, 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {/* AI Analysis Results */}
                  {message.analysis && (
                    <div className="mt-3 space-y-3 border-t pt-3">
                      {/* Urgency Level */}
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">Nível de Urgência:</span>
                        <Badge className={getUrgencyColor(message.analysis.urgencyLevel)}>
                          {getUrgencyText(message.analysis.urgencyLevel)}
                        </Badge>
                      </div>

                      {/* Symptoms Identified */}
                      {message.analysis.symptoms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Stethoscope className="h-4 w-4" />
                            <span className="text-sm font-medium">Sintomas Identificados:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {message.analysis.symptoms.map((symptom, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Possible Conditions */}
                      {message.analysis.possibleConditions.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">Possíveis Condições:</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            {message.analysis.possibleConditions.map((condition, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {message.analysis.recommendations.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4" />
                            <span className="text-sm font-medium">Recomendações:</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            {message.analysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-2"></div>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Perguntas Frequentes:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto p-2"
                    onClick={() => setInputMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Descreva seus sintomas ou faça uma pergunta..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={sendMessageMutation.isPending}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={startVoiceRecognition}
                disabled={isListening || sendMessageMutation.isPending}
                className={isListening ? 'bg-red-100 border-red-300' : ''}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-600" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">Aviso Importante:</p>
                <p>
                  Este assistente fornece informações educacionais e não substitui consulta médica profissional. 
                  Em caso de emergência, procure atendimento médico imediatamente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}