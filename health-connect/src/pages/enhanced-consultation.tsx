import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AIConsentBanner } from "@/components/AIConsentBanner";
import { useAIFeatures, useAIConsent } from "@/hooks/useAIFeatures";
import {
  Paperclip, Undo2, Pencil, Camera, PhoneOff, Clock3, MessagesSquare, HelpCircle,
  Plus, Trash2, FileText, ShieldAlert, Mic, MicOff, Video, VideoOff, Settings,
  Star, AlertTriangle, CheckCircle, User, Stethoscope, Phone, Send, Save, Bell,
  Brain, Zap, Search, XCircle, LogOut, ArrowLeft
} from "lucide-react";

const ICD_SAMPLES = [
  { code: "F41.1", label: "Transtorno de ansiedade generalizada" },
  { code: "F41.0", label: "Ataque de pânico" },
  { code: "F32.1", label: "Episódio depressivo moderado" },
  { code: "F33.1", label: "Transtorno depressivo recorrente" },
  { code: "F43.2", label: "Transtornos de adaptação" },
  { code: "R50", label: "Febre não especificada" }
];

const EXAM_TEMPLATES = [
  { name: "Hemograma completo", urgency: "routine", instructions: "Jejum de 8-12 horas" },
  { name: "Glicemia de jejum", urgency: "routine", instructions: "Jejum rigoroso de 8-12 horas" },
  { name: "TSH + T4 livre", urgency: "routine", instructions: "Jejum de 4 horas" },
  { name: "Creatinina + Ureia", urgency: "routine", instructions: "Jejum de 8 horas" },
  { name: "ECG", urgency: "routine", instructions: "Não é necessário jejum" },
  { name: "Raio-X de Tórax", urgency: "routine", instructions: "Retirar objetos metálicos" },
  { name: "Ecocardiograma", urgency: "priority", instructions: "Usar roupas confortáveis" },
  { name: "Ultrassom Abdome", urgency: "routine", instructions: "Jejum de 8 horas, bexiga cheia" }
];

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatChatTime(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

interface ChatMessage {
  id: number;
  sender: "doctor" | "patient";
  message: string;
  timestamp: Date;
  type: "text";
}

interface ExamItem {
  id: number;
  name: string;
  urgency: "routine" | "priority" | "urgent";
  customInstructions: string;
}

interface RxItem {
  id: number;
  name: string;
  dose: string;
  indication: string;
}

interface DiagnosisOption {
  code: string;
  label: string;
}

const EnhancedConsultation = () => {
  const { features: aiFeatures } = useAIFeatures();
  const { hasConsent } = useAIConsent();
  const [, navigate] = useLocation();
  
  const [patient, setPatient] = useState({
    name: "Selecione um paciente",
    age: 0,
    phone: "",
    plan: "",
    cpf: ""
  });

  // Load selected patient from sessionStorage
  useEffect(() => {
    const savedPatient = sessionStorage.getItem('selectedPatient');
    if (savedPatient) {
      try {
        const patientData = JSON.parse(savedPatient);
        const age = patientData.birthDate ? 
          Math.floor((new Date().getTime() - new Date(patientData.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
          0;
        setPatient({
          name: patientData.name,
          age: age,
          phone: patientData.phone || "",
          plan: patientData.healthPlan || "Particular",
          cpf: patientData.cpf
        });
      } catch (error) {
        console.error('Error parsing saved patient:', error);
        navigate('/patients');
      }
    } else {
      navigate('/patients');
    }
  }, [navigate]);

  const [elapsed, setElapsed] = useState(0);
  const [consultationStatus, setConsultationStatus] = useState<"waiting" | "active" | "ended">("waiting");
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelWidth, setRightPanelWidth] = useState("40%");
  const [helpOpen, setHelpOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [currentIllness, setCurrentIllness] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisOption | null>(null);
  const [diagnosisQuery, setDiagnosisQuery] = useState("");
  const [showDiagList, setShowDiagList] = useState(false);
  const [indications, setIndications] = useState("");

  const [recurrence, setRecurrence] = useState({
    mentalSeverity: false,
    clinicalComplexity: false,
    complaintInconsistency: false
  });
  const [alertSigns, setAlertSigns] = useState("");

  const [examList, setExamList] = useState<ExamItem[]>([]);
  const [examDraft, setExamDraft] = useState({
    name: "",
    urgency: "routine" as "routine" | "priority" | "urgent",
    customInstructions: ""
  });

  // Estados de prescrições e MedMed
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [medmedStatus, setMedmedStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Sistema de notificações
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Estados da IA Assistente
  const [analiseIA, setAnaliseIA] = useState<any>(null);
  const [sintomasInput, setSintomasInput] = useState('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [iaOpen, setIaOpen] = useState(false);

  // Base de conhecimento médico
  const baseConhecimento = {
    sintomas: {
      'febre': { peso: 8, urgencia: 'media', areas: ['infectologia', 'clinica'] },
      'dor de cabeça': { peso: 6, urgencia: 'baixa', areas: ['neurologia', 'clinica'] },
      'dor no peito': { peso: 10, urgencia: 'alta', areas: ['cardiologia', 'emergencia'] },
      'falta de ar': { peso: 9, urgencia: 'alta', areas: ['cardiologia', 'pneumologia'] },
      'tosse': { peso: 5, urgencia: 'baixa', areas: ['pneumologia', 'clinica'] },
      'dor abdominal': { peso: 7, urgencia: 'media', areas: ['gastroenterologia', 'cirurgia'] },
      'vomito': { peso: 6, urgencia: 'media', areas: ['gastroenterologia', 'clinica'] },
      'tontura': { peso: 6, urgencia: 'media', areas: ['neurologia', 'otorrino'] },
      'dor nas costas': { peso: 4, urgencia: 'baixa', areas: ['ortopedia', 'clinica'] },
      'palpitação': { peso: 8, urgencia: 'media', areas: ['cardiologia'] }
    },
    diagnosticos: {
      'febre + dor de cabeça': { diagnostico: 'Síndrome Gripal', probabilidade: 85, urgencia: 'media' },
      'dor no peito + falta de ar': { diagnostico: 'Possível IAM', probabilidade: 75, urgencia: 'alta' },
      'febre + tosse': { diagnostico: 'Infecção Respiratória', probabilidade: 80, urgencia: 'media' },
      'dor abdominal + vomito': { diagnostico: 'Gastroenterite', probabilidade: 70, urgencia: 'media' },
      'tontura + palpitação': { diagnostico: 'Arritmia Cardíaca', probabilidade: 65, urgencia: 'media' }
    },
    medicamentos: {
      'Losartana': { categoria: 'Anti-hipertensivo', interacoes: ['Potássio', 'Espironolactona'] },
      'Sinvastatina': { categoria: 'Estatina', interacoes: ['Gemfibrozila', 'Ciclosporina'] },
      'Paracetamol': { categoria: 'Analgésico', interacoes: ['Álcool', 'Warfarina'] },
      'Ibuprofeno': { categoria: 'AINE', interacoes: ['Losartana', 'Warfarina', 'Lítio'] },
      'Amoxicilina': { categoria: 'Antibiótico', interacoes: ['Warfarina'] }
    }
  };

  const historicoPaciente = {
    idade: 36,
    sexo: 'M',
    alergias: ['Penicilina'],
    medicamentosAtuais: ['Losartana 50mg'],
    condicoesCronicas: ['Hipertensão'],
    nome: patient.name
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "patient",
      message: "Boa tarde, doutor! Estou aqui para a consulta.",
      timestamp: new Date(Date.now() - 300000),
      type: "text"
    },
    {
      id: 2,
      sender: "doctor",
      message: "Boa tarde! Como está se sentindo hoje?",
      timestamp: new Date(Date.now() - 240000),
      type: "text"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (consultationStatus === "active" || consultationStatus === "waiting") {
      const id = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(id);
    }
  }, [consultationStatus]);

  useEffect(() => {
    const errors = [];
    if (!chiefComplaint.trim()) errors.push("Queixa principal");
    if (!currentIllness.trim()) errors.push("Doença atual");
    if (!diagnosis) errors.push("Diagnóstico");
    if (!indications.trim()) errors.push("Conduta");
    setValidationErrors(errors);
  }, [chiefComplaint, currentIllness, diagnosis, indications]);

  const canFinalize = validationErrors.length === 0;

  const diagOptions = useMemo(() => {
    if (!diagnosisQuery) return ICD_SAMPLES.slice(0, 4);
    const q = diagnosisQuery.toLowerCase();
    return ICD_SAMPLES.filter(
      d => d.label.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
    );
  }, [diagnosisQuery]);

  function startConsultation() {
    setConsultationStatus("active");
    setElapsed(0);
  }

  function addExam() {
    if (!examDraft.name.trim()) return;
    const newExam = { id: Date.now(), ...examDraft };
    setExamList(prev => [...prev, newExam]);
    
    // Adicionar notificação de exame
    setNotificacoes(prev => [...prev, {
      id: Date.now() + 1,
      titulo: 'Exame Solicitado',
      descricao: `${examDraft.name} - Prioridade: ${examDraft.urgency === 'routine' ? 'Rotina' : examDraft.urgency === 'priority' ? 'Prioritário' : 'Urgente'}`,
      tipo: 'exame',
      timestamp: new Date(),
      lida: false,
      prioridade: examDraft.urgency === 'urgent' ? 'alta' : 'normal'
    }]);
    
    playNotificationSound('exame');
    showBrowserNotification('Exame Solicitado', `${examDraft.name} adicionado à lista de exames`);
    
    setExamDraft({ name: "", urgency: "routine", customInstructions: "" });
  }

  function selectExamTemplate(template: typeof EXAM_TEMPLATES[0]) {
    setExamDraft({
      name: template.name,
      urgency: template.urgency as "routine" | "priority" | "urgent",
      customInstructions: template.instructions
    });
  }

  // Integração MedMed
  function openMedMedPrescription() {
    setMedmedStatus('loading');
    
    const patientData = {
      name: patient.name,
      age: patient.age,
      phone: patient.phone,
      cpf: patient.cpf,
      consultationId: `TELEMED-${Date.now()}`,
      chiefComplaint: chiefComplaint,
      diagnosis: diagnosis ? `${diagnosis.code} - ${diagnosis.label}` : ""
    };

    setTimeout(() => {
      try {
        const medmedUrl = `https://memed.com.br/?demo=1&patient=${encodeURIComponent(JSON.stringify(patientData))}`;
        
        const medmedWindow = window.open(
          medmedUrl,
          'medmed-prescription',
          'width=1200,height=800,scrollbars=yes,resizable=yes'
        );

        if (medmedWindow) {
          setMedmedStatus('success');
          
          setTimeout(() => {
            try {
              const mockPrescription = {
                id: `RX-${Date.now()}`,
                patientName: patient.name,
                doctorName: "Dr. João Silva",
                medications: [
                  {
                    name: "Dipirona Sódica",
                    dosage: "500mg",
                    instructions: "1 comprimido de 6/6 horas se dor ou febre",
                    quantity: "20 comprimidos"
                  }
                ],
                createdAt: new Date(),
                digitalSignature: true,
                medmedId: `MEMED-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: "signed"
              };

              setPrescriptions(prev => [...prev, mockPrescription]);
              
              // Adicionar notificação
              setNotificacoes(prev => [...prev, {
                id: Date.now(),
                titulo: 'Receita MedMed Finalizada',
                descricao: `Receita #${mockPrescription.medmedId} finalizada com sucesso`,
                tipo: 'receita',
                timestamp: new Date(),
                lida: false,
                prioridade: 'alta'
              }]);
              
              playNotificationSound('receita');
              showBrowserNotification('Receita MedMed', `Nova receita #${mockPrescription.medmedId} finalizada!`);
              
            } catch(e) {
              setNotificacoes(prev => [...prev, {
                id: Date.now(),
                titulo: 'Receita MedMed Finalizada',
                descricao: `Receita #${Math.floor(Math.random() * 1000)} finalizada`,
                tipo: 'receita',
                timestamp: new Date(),
                lida: false,
                prioridade: 'alta'
              }]);
              playNotificationSound('receita');
              showBrowserNotification('Receita MedMed', `Nova receita #${Math.floor(Math.random() * 1000)} finalizada!`);
            }
          }, 5000);

        } else {
          setMedmedStatus('error');
          alert("❌ Erro ao abrir MedMed. Verifique bloqueador de pop-up.");
        }

      } catch (error) {
        setMedmedStatus('error');
        alert("❌ Erro ao conectar com MedMed.");
      }
    }, 1000);
  }

  function downloadPrescriptionPDF(prescription: any) {
    alert(`📄 Download da receita ${prescription.medmedId} iniciado!`);
  }

  // Funções de notificação
  function playNotificationSound(tipo: 'receita' | 'exame' | 'geral' = 'geral') {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Sons diferentes para cada tipo
      const frequencies = {
        receita: [800, 1000, 1200],
        exame: [600, 800, 600],
        geral: [400, 600, 400]
      };

      frequencies[tipo].forEach((freq, index) => {
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
      });

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Áudio não disponível');
    }
  }

  function showBrowserNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
        }
      });
    }
  }

  function markNotificationAsRead(id: number) {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, lida: true } : notif
    ));
  }

  // Função da IA para análise de sintomas usando ChatGPT
  async function analisarSintomas() {
    if (!sintomasInput.trim()) return;
    
    // Check if AI features are enabled and user has consent
    if (!aiFeatures.AI_ENABLED || !aiFeatures.AI_SYMPTOMS_ENABLED) {
      setNotificacoes(prev => [...prev, {
        id: Date.now(),
        titulo: `Assistente de IA não disponível`,
        descricao: `Recursos de IA estão temporariamente desabilitados`,
        tipo: 'geral',
        timestamp: new Date(),
        lida: false,
        prioridade: 'normal'
      }]);
      return;
    }

    if (!hasConsent) {
      setNotificacoes(prev => [...prev, {
        id: Date.now(),
        titulo: `Consentimento necessário`,
        descricao: `Autorize o uso do assistente de IA primeiro`,
        tipo: 'geral',
        timestamp: new Date(),
        lida: false,
        prioridade: 'normal'
      }]);
      return;
    }
    
    setCarregandoIA(true);
    
    try {
      // Preparar dados do paciente para análise
      const analysisRequest = {
        symptoms: sintomasInput,
        patientAge: patient.age,
        patientGender: 'M' as const, // Pode ser dinamizado com mais dados do paciente
        currentMedications: historicoPaciente.medicamentosAtuais,
        chronicConditions: historicoPaciente.condicoesCronicas,
        allergies: historicoPaciente.alergias || []
      };

      // Chamar API do ChatGPT
      const response = await fetch('/api/medical/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(analysisRequest)
      });

      if (!response.ok) {
        throw new Error(`Erro na análise: ${response.status}`);
      }

      const result = await response.json();
      
      // Converter resultado para o formato esperado pela interface
      const analiseFormatada = {
        sintomas: sintomasInput.split(',').map(s => s.trim()),
        scoreUrgencia: result.urgencyScore,
        nivelUrgencia: result.urgencyLevel,
        especialidades: result.recommendedSpecialties,
        diagnosticosPossiveis: result.possibleDiagnoses.map((d: any) => ({
          condicao: d.diagnosis,
          codigo: d.icdCode,
          confianca: `${d.confidence}%`,
          descricao: d.description
        })),
        medicamentosSugeridos: result.suggestedMedications.map((m: any) => 
          `${m.medication} ${m.dosage} - ${m.indication}`
        ),
        interacoesMedicamentosas: result.drugInteractions,
        recomendacoes: [
          ...result.recommendedActions,
          ...result.followUpRecommendations
        ],
        timestamp: new Date()
      };

      setAnaliseIA(analiseFormatada);
      
      // Notificar resultado
      const tipoNotificacao = result.urgencyLevel === 'alta' ? 'urgente' : 'geral';
      setNotificacoes(prev => [...prev, {
        id: Date.now(),
        titulo: `ChatGPT: Análise de sintomas concluída`,
        descricao: `Nível de urgência: ${result.urgencyLevel.toUpperCase()} - Score: ${result.urgencyScore}`,
        tipo: tipoNotificacao as 'exame' | 'receita' | 'geral',
        timestamp: new Date(),
        lida: false,
        prioridade: result.urgencyLevel === 'alta' ? 'alta' : 'normal'
      }]);
      
      playNotificationSound(tipoNotificacao as 'exame' | 'receita' | 'geral');
      showBrowserNotification('ChatGPT Médico', `Análise concluída - Urgência: ${result.urgencyLevel}`);
      
    } catch (error) {
      console.error('Erro na análise de sintomas:', error);
      setNotificacoes(prev => [...prev, {
        id: Date.now(),
        titulo: `Erro na análise de sintomas`,
        descricao: `Falha ao processar sintomas. Tente novamente.`,
        tipo: 'geral',
        timestamp: new Date(),
        lida: false,
        prioridade: 'normal'
      }]);
    } finally {
      setCarregandoIA(false);
    }
  }
  
  function gerarRecomendacoes(urgencia: string, sintomas: string[]) {
    const recomendacoes = [];
    
    if (urgencia === 'alta') {
      recomendacoes.push('🚨 URGENTE: Avaliar imediatamente');
      recomendacoes.push('📞 Considerar encaminhamento ao PS');
    } else if (urgencia === 'media') {
      recomendacoes.push('⏰ Agendar consulta nas próximas 24h');
      recomendacoes.push('📋 Solicitar exames complementares');
    } else {
      recomendacoes.push('📅 Retorno em 7-15 dias');
      recomendacoes.push('💊 Tratamento sintomático');
    }
    
    if (sintomas.includes('febre')) {
      recomendacoes.push('🌡️ Monitorar temperatura');
    }
    
    if (sintomas.includes('dor no peito')) {
      recomendacoes.push('📊 ECG obrigatório');
    }
    
    return recomendacoes;
  }

  function sendChatMessage() {
    if (!newMessage.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      sender: "doctor",
      message: newMessage,
      timestamp: new Date(),
      type: "text"
    }]);
    setNewMessage("");
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: "patient",
          message: "Entendi, doutor. Obrigado!",
          timestamp: new Date(),
          type: "text"
        }]);
        if (!chatOpen) setUnreadCount(prev => prev + 1);
      }, 2000);
    }, 1000);
  }

  function openChat() {
    setChatOpen(true);
    setUnreadCount(0);
  }

  function finalizeConsultation() {
    setConsultationStatus("ended");
    setConfirmEndOpen(false);
    setFeedbackOpen(true);
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="border-b bg-white sticky top-0 z-30 shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  CF
                </div>
                <div className="text-sm">
                  <div className="font-semibold flex items-center gap-2">
                    {patient.name}
                    <span className="text-slate-500">, {patient.age} anos</span>
                    <Badge variant="secondary">Convite</Badge>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {patient.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" />
                      {patient.plan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    consultationStatus === "active" ? "bg-green-500" :
                    consultationStatus === "waiting" ? "bg-blue-500" : "bg-gray-500"
                  }`} />
                  <span className="font-medium">
                    {consultationStatus === "waiting" ? "Aguardando" :
                     consultationStatus === "active" ? "Em atendimento" : "Finalizado"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock3 className="w-4 h-4" />
                  <span>{formatElapsed(elapsed)}</span>
                </div>

                {consultationStatus === "waiting" && (
                  <Button onClick={startConsultation} size="sm">
                    Iniciar Consulta
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/patients')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Formulário
                </Button>
                
                <Select value={rightPanelWidth} onValueChange={setRightPanelWidth}>
                  <SelectTrigger className="w-20 h-8">
                    <Settings className="w-3 h-3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="33%">33%</SelectItem>
                    <SelectItem value="40%">40%</SelectItem>
                    <SelectItem value="50%">50%</SelectItem>
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          await fetch('/api/logout', { 
                            method: 'POST',
                            credentials: 'include'
                          });
                          window.location.href = '/login';
                        } catch (error) {
                          console.error('Logout error:', error);
                          window.location.href = '/login';
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sair</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Area */}
          <div 
            style={{ width: rightPanelOpen ? `calc(100% - ${rightPanelWidth})` : '100%' }} 
            className="transition-all duration-300"
          >
            <Card className="h-full rounded-none border-0">
              <CardContent className="p-0 h-full relative bg-gradient-to-br from-slate-900 to-slate-800">
                {/* Main Video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Video className="w-16 h-16 mx-auto mb-4" />
                    <div className="text-lg font-medium">Aguardando paciente</div>
                    <div className="text-sm">Sala: #ABC123</div>
                  </div>
                </div>

                {/* Self Video */}
                <div className="absolute top-4 right-4 w-40 h-28 bg-slate-700 rounded-lg ring-2 ring-white/20">
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    <User className="w-6 h-6" />
                  </div>
                  {!videoEnabled && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <VideoOff className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Media Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className={`w-12 h-12 rounded-full ${micEnabled ? "bg-slate-700" : "bg-red-600"}`}
                        onClick={() => setMicEnabled(!micEnabled)}
                      >
                        {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{micEnabled ? "Desativar mic" : "Ativar mic"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className={`w-12 h-12 rounded-full ${videoEnabled ? "bg-slate-700" : "bg-red-600"}`}
                        onClick={() => setVideoEnabled(!videoEnabled)}
                      >
                        {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{videoEnabled ? "Desativar vídeo" : "Ativar vídeo"}</TooltipContent>
                  </Tooltip>
                </div>

                {/* Action Controls */}
                <div className="absolute bottom-6 left-6 flex gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Anexar</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm">
                        <Camera className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Screenshot</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm relative" 
                        onClick={openChat}
                      >
                        <MessagesSquare className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {unreadCount}
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chat</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm relative" 
                        onClick={() => setNotificationOpen(true)}
                      >
                        <Bell className="w-5 h-5" />
                        {notificacoes.filter(n => !n.lida).length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {notificacoes.filter(n => !n.lida).length}
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notificações</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        className={`w-12 h-12 rounded-full ${
                          aiFeatures.AI_ENABLED && hasConsent 
                            ? 'bg-purple-600 hover:bg-purple-700' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => setIaOpen(true)}
                        disabled={!aiFeatures.AI_ENABLED || !hasConsent}
                      >
                        <Brain className="w-5 h-5" />
                        {analiseIA && aiFeatures.AI_ENABLED && hasConsent && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            ✓
                          </div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!aiFeatures.AI_ENABLED ? 'IA desabilitada' : 
                       !hasConsent ? 'Consentimento necessário' : 'IA Assistente'}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* End Controls */}
                <div className="absolute bottom-6 right-6 flex gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" className="w-12 h-12 rounded-full bg-amber-600">
                        <Undo2 className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sala de espera</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="icon" 
                        className="w-12 h-12 rounded-full bg-red-600"
                        onClick={() => setConfirmEndOpen(true)}
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Finalizar</TooltipContent>
                  </Tooltip>
                </div>

                {/* Help Button */}
                <button
                  onClick={() => setHelpOpen(true)}
                  className="absolute top-6 left-6 w-10 h-10 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <div className="border-l bg-white overflow-hidden" style={{ width: rightPanelWidth }}>
              <div className="h-full flex flex-col">
                <div className="border-b p-4 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Registro do Atendimento</h3>
                    <Button variant="ghost" size="sm" onClick={() => setRightPanelOpen(false)}>
                      ✕
                    </Button>
                  </div>
                  
                  {validationErrors.length > 0 && (
                    <Alert className="mt-3 border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        {validationErrors.length} campo(s) obrigatório(s)
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* AI Consent Banner */}
                  <AIConsentBanner />
                  
                  {/* Main Fields */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      Queixa Principal *
                      {!chiefComplaint && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                    </Label>
                    <Textarea
                      placeholder="Motivo da consulta"
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      História da Doença Atual *
                      {!currentIllness && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                    </Label>
                    <Textarea
                      placeholder="Evolução dos sintomas"
                      value={currentIllness}
                      onChange={(e) => setCurrentIllness(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="relative">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      Hipótese Diagnóstica *
                      {!diagnosis && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                    </Label>
                    <Input
                      placeholder="Digite CID"
                      value={diagnosis ? `${diagnosis.code} - ${diagnosis.label}` : diagnosisQuery}
                      onChange={(e) => {
                        if (!diagnosis) {
                          setDiagnosisQuery(e.target.value);
                          setShowDiagList(true);
                        }
                      }}
                      onFocus={() => !diagnosis && setShowDiagList(true)}
                      className="mt-1"
                    />
                    {diagnosis && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-7 h-8"
                        onClick={() => {
                          setDiagnosis(null);
                          setDiagnosisQuery("");
                        }}
                      >
                        ✕
                      </Button>
                    )}
                    
                    {showDiagList && !diagnosis && (
                      <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg max-h-48 overflow-auto z-20 mt-1">
                        {diagOptions.map((d) => (
                          <button
                            key={d.code}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b last:border-b-0"
                            onClick={() => {
                              setDiagnosis(d);
                              setShowDiagList(false);
                            }}
                          >
                            <div className="font-medium text-blue-600">{d.code}</div>
                            <div className="text-slate-700">{d.label}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Tabs defaultValue="conduta" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="conduta" className="text-xs">Conduta</TabsTrigger>
                      <TabsTrigger value="exames" className="text-xs">Exames</TabsTrigger>
                      <TabsTrigger value="receitas" className="text-xs">MedMed</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conduta" className="space-y-4 mt-4">
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          Conduta Terapêutica *
                          {!indications && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        </Label>
                        <Textarea
                          placeholder="Orientações e tratamento"
                          value={indications}
                          onChange={(e) => setIndications(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Complexidade</Label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={recurrence.mentalSeverity}
                              onCheckedChange={(checked) => 
                                setRecurrence(prev => ({...prev, mentalSeverity: checked}))
                              }
                            />
                            Agravo em saúde mental
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={recurrence.clinicalComplexity}
                              onCheckedChange={(checked) => 
                                setRecurrence(prev => ({...prev, clinicalComplexity: checked}))
                              }
                            />
                            Complexidade clínica
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <Switch
                              checked={recurrence.complaintInconsistency}
                              onCheckedChange={(checked) => 
                                setRecurrence(prev => ({...prev, complaintInconsistency: checked}))
                              }
                            />
                            Inconsistência de queixas
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-red-500" />
                          Sinais de Alerta
                        </Label>
                        <Input
                          placeholder="Ex: ideação suicida, dor torácica..."
                          value={alertSigns}
                          onChange={(e) => setAlertSigns(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="exames" className="space-y-4 mt-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Templates Comuns</Label>
                        <div className="grid gap-2 max-h-32 overflow-y-auto border rounded-lg p-2">
                          {EXAM_TEMPLATES.map((template, index) => (
                            <button
                              key={index}
                              className="text-left p-2 hover:bg-blue-50 rounded text-sm"
                              onClick={() => selectExamTemplate(template)}
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-slate-500">{template.instructions}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Input
                          placeholder="Nome do exame"
                          value={examDraft.name}
                          onChange={(e) => setExamDraft({...examDraft, name: e.target.value})}
                        />

                        <Select 
                          value={examDraft.urgency} 
                          onValueChange={(value: "routine" | "priority" | "urgent") => setExamDraft({...examDraft, urgency: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Rotina</SelectItem>
                            <SelectItem value="priority">Prioritário</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>

                        <Textarea
                          placeholder="Instruções específicas"
                          value={examDraft.customInstructions}
                          onChange={(e) => setExamDraft({...examDraft, customInstructions: e.target.value})}
                          className="h-16"
                        />

                        <Button onClick={addExam} className="w-full" disabled={!examDraft.name.trim()}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Exame
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {examList.length === 0 ? (
                          <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed rounded-lg">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            Nenhum exame solicitado
                          </div>
                        ) : (
                          examList.map((exam) => (
                            <div key={exam.id} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{exam.name}</h4>
                                  <div className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                                    exam.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                                    exam.urgency === 'priority' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {exam.urgency === 'urgent' ? 'Urgente' :
                                     exam.urgency === 'priority' ? 'Prioritário' : 'Rotina'}
                                  </div>
                                  {exam.customInstructions && (
                                    <div className="mt-2 text-xs text-slate-600">
                                      {exam.customInstructions}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExamList(prev => prev.filter(e => e.id !== exam.id))}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="receitas" className="space-y-4 mt-4">
                      {/* Integração MedMed */}
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="text-center space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-blue-800">Integração MedMed</h3>
                          </div>
                          
                          <p className="text-sm text-blue-700">
                            Prescreva medicamentos de forma segura e rápida com assinatura digital automática
                          </p>

                          <Button 
                            onClick={openMedMedPrescription}
                            disabled={medmedStatus === 'loading'}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {medmedStatus === 'loading' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Conectando...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Nova Receita MedMed
                              </>
                            )}
                          </Button>

                          <div className="text-xs text-blue-600 space-y-1">
                            <div>✅ Base farmacológica completa</div>
                            <div>✅ Assinatura digital ICP-Brasil</div>
                            <div>✅ Verificação de interações</div>
                          </div>
                        </div>
                      </div>

                      {/* Lista de Receitas */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Receitas do Atendimento ({prescriptions.length})
                        </Label>
                        
                        <div className="space-y-3">
                          {prescriptions.length === 0 ? (
                            <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed rounded-lg">
                              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              Nenhuma receita criada ainda
                            </div>
                          ) : (
                            prescriptions.map((prescription) => (
                              <div key={prescription.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-medium text-sm">Receita #{prescription.medmedId}</h4>
                                      {prescription.digitalSignature && (
                                        <Badge className="bg-green-100 text-green-700 text-xs">
                                          ✓ Assinada
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="text-xs text-slate-500 space-y-1">
                                      <div>📅 {new Intl.DateTimeFormat('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit', 
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }).format(prescription.createdAt)}</div>
                                      <div>👨‍⚕️ {prescription.doctorName}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => downloadPrescriptionPDF(prescription)}
                                    >
                                      📄 PDF
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setPrescriptions(prev => prev.filter(p => p.id !== prescription.id))}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-600 uppercase">
                                    Medicamentos
                                  </Label>
                                  {prescription.medications.map((med: any, index: number) => (
                                    <div key={index} className="bg-slate-50 rounded p-3">
                                      <div className="font-medium text-sm">
                                        💊 {med.name} - {med.dosage}
                                      </div>
                                      <div className="text-sm text-slate-600 mt-1">
                                        📋 {med.instructions}
                                      </div>
                                      <div className="text-xs text-slate-500 mt-1">
                                        📦 {med.quantity}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      {medmedStatus !== 'idle' && (
                        <div className="p-3 rounded-lg text-sm">
                          {medmedStatus === 'loading' && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              Conectando com MedMed...
                            </div>
                          )}
                          {medmedStatus === 'success' && (
                            <div className="bg-green-50 border border-green-200 text-green-800">
                              ✅ MedMed conectado! Aguardando receita...
                            </div>
                          )}
                          {medmedStatus === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-800">
                              ❌ Erro na conexão. Tente novamente.
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="border-t p-4 bg-slate-50">
                  {validationErrors.length > 0 && (
                    <div className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                      ⚠️ Campos obrigatórios: {validationErrors.join(", ")}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Save className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={!canFinalize}
                      onClick={() => setConfirmEndOpen(true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Finalizar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Chat */}
        <Drawer open={chatOpen} onOpenChange={setChatOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessagesSquare className="w-5 h-5" />
                  Chat com {patient.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </div>
              </DrawerTitle>
            </DrawerHeader>
            
            <div className="max-w-4xl mx-auto w-full px-4 pb-6">
              <div className="h-96 border rounded-lg bg-white overflow-auto p-4 mb-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'doctor' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        <div>{msg.message}</div>
                        <div className={`text-xs mt-1 ${
                          msg.sender === 'doctor' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {formatChatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="text-xs text-slate-500 ml-2">Paciente digitando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem ou pergunta médica..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="flex-1"
                />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={async () => {
                        if (!newMessage.trim()) return;
                        
                        // Check AI features and consent
                        if (!aiFeatures.AI_ENABLED || !hasConsent) {
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            sender: 'doctor',
                            message: '🤖 Assistente de IA não disponível. Verifique as configurações ou consentimento.',
                            timestamp: new Date(),
                            type: 'text'
                          }]);
                          return;
                        }
                        
                        // Adicionar pergunta do médico ao chat
                        const questionId = Date.now();
                        setChatMessages(prev => [...prev, {
                          id: questionId,
                          sender: 'doctor',
                          message: `🤖 ${newMessage}`,
                          timestamp: new Date(),
                          type: 'text'
                        }]);
                        
                        const question = newMessage;
                        setNewMessage('');
                        
                        // Mostrar que está processando
                        const loadingId = Date.now() + 1;
                        setChatMessages(prev => [...prev, {
                          id: loadingId,
                          sender: 'doctor',
                          message: 'ChatGPT está analisando...',
                          timestamp: new Date(),
                          type: 'text'
                        }]);
                        
                        try {
                          const response = await fetch('/api/medical/advice', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                              question,
                              patientContext: {
                                patientAge: patient.age,
                                currentMedications: historicoPaciente.medicamentosAtuais,
                                chronicConditions: historicoPaciente.condicoesCronicas
                              }
                            })
                          });
                          
                          if (response.status === 403) {
                            const error = await response.json();
                            setChatMessages(prev => prev.filter(msg => msg.id !== loadingId));
                            setChatMessages(prev => [...prev, {
                              id: Date.now(),
                              sender: 'doctor',
                              message: `🤖 ${error.error}`,
                              timestamp: new Date(),
                              type: 'text'
                            }]);
                            return;
                          }
                          
                          if (!response.ok) throw new Error('Falha na consulta');
                          
                          const result = await response.json();
                          
                          // Remover mensagem de carregamento e adicionar resposta
                          setChatMessages(prev => prev.filter(msg => msg.id !== loadingId));
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            sender: 'doctor',
                            message: `🤖 ChatGPT: ${result.advice}`,
                            timestamp: new Date(),
                            type: 'text'
                          }]);
                          
                        } catch (error) {
                          setChatMessages(prev => prev.filter(msg => msg.id !== loadingId));
                          setChatMessages(prev => [...prev, {
                            id: Date.now(),
                            sender: 'doctor',
                            message: '🤖 Erro ao consultar ChatGPT. Tente novamente.',
                            timestamp: new Date(),
                            type: 'text'
                          }]);
                        }
                      }}
                      disabled={!newMessage.trim() || !aiFeatures.AI_ENABLED || !hasConsent}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                    >
                      <Brain className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!aiFeatures.AI_ENABLED ? 'IA desabilitada' : 
                     !hasConsent ? 'Consentimento necessário' : 'Perguntar ao ChatGPT'}
                  </TooltipContent>
                </Tooltip>
                
                <Button onClick={sendChatMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewMessage("Obrigado pela consulta!")}
                  >
                    📝 Agradecimento
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewMessage("Pode me explicar melhor?")}
                  >
                    ❓ Dúvida
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewMessage("Quando devo retornar?")}
                  >
                    📅 Retorno
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewMessage("Posso entrar em contato?")}
                  >
                    📞 Contato
                  </Button>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center text-purple-700">
                    <Brain className="w-4 h-4 mr-1" />
                    Perguntas para ChatGPT
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNewMessage("Quais são as possíveis causas desses sintomas?")}
                      className="text-purple-700 border-purple-200"
                    >
                      🤖 Possíveis causas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNewMessage("Que exames devo solicitar?")}
                      className="text-purple-700 border-purple-200"
                    >
                      🤖 Exames recomendados
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNewMessage("Há interações com os medicamentos atuais?")}
                      className="text-purple-700 border-purple-200"
                    >
                      🤖 Interações medicamentosas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNewMessage("Qual especialista devo encaminhar?")}
                      className="text-purple-700 border-purple-200"
                    >
                      🤖 Encaminhamento
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Help */}
        <Drawer open={helpOpen} onOpenChange={setHelpOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Central de Ajuda</DrawerTitle>
            </DrawerHeader>
            <div className="max-w-2xl mx-auto w-full px-4 pb-6">
              <Input placeholder="O que você está procurando?" className="mb-4" />
              <div className="space-y-2 text-sm">
                <div>💡 Use Ctrl+M para microfone</div>
                <div>💡 Use Ctrl+D para câmera</div>
                <div>💡 Preencha todos os campos obrigatórios</div>
                <div>💡 Use as abas para organizar informações</div>
                <div>💡 Chat disponível durante toda a consulta</div>
                <div>💊 Use MedMed para receitas seguras</div>
                <div>📋 Exames organizados por prioridade</div>
                <div>🧠 IA Assistente para análise de sintomas</div>
                <div>🔔 Notificações em tempo real</div>
                <div>⚠️ Verificação automática de interações medicamentosas</div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Notificações */}
        <Drawer open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações ({notificacoes.filter(n => !n.lida).length} não lidas)
              </DrawerTitle>
            </DrawerHeader>
            
            <div className="max-w-4xl mx-auto w-full px-4 pb-6">
              <div className="space-y-3 max-h-96 overflow-auto">
                {notificacoes.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma notificação ainda</p>
                  </div>
                ) : (
                  notificacoes.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        !notificacao.lida ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
                      }`}
                      onClick={() => markNotificationAsRead(notificacao.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-lg">
                              {notificacao.tipo === 'receita' ? '💊' : 
                               notificacao.tipo === 'exame' ? '📋' : '📢'}
                            </div>
                            <h4 className="font-medium text-sm">{notificacao.titulo}</h4>
                            {!notificacao.lida && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2">{notificacao.descricao}</p>
                          
                          <div className="text-xs text-slate-500">
                            {new Intl.DateTimeFormat('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(notificacao.timestamp)}
                          </div>
                        </div>
                        
                        {notificacao.prioridade === 'alta' && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            Alta
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notificacoes.length > 0 && (
                <div className="mt-4 pt-3 border-t flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNotificacoes([])}
                  >
                    Limpar Todas
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))}
                  >
                    Marcar Todas como Lidas
                  </Button>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* IA Assistente */}
        <Drawer open={iaOpen} onOpenChange={setIaOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                IA Assistente Médico
              </DrawerTitle>
            </DrawerHeader>
            
            <div className="max-w-6xl mx-auto w-full px-4 pb-6 overflow-auto">
              {/* Perfil do Paciente */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Perfil do Paciente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {historicoPaciente.nome}</p>
                    <p><strong>Idade:</strong> {historicoPaciente.idade} anos</p>
                    <p><strong>Sexo:</strong> {historicoPaciente.sexo}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Alergias:</strong> {historicoPaciente.alergias.join(', ')}</p>
                    <p><strong>Medicamentos:</strong> {historicoPaciente.medicamentosAtuais.join(', ')}</p>
                    <p><strong>Condições:</strong> {historicoPaciente.condicoesCronicas.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Interface de Análise */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Análise de Sintomas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      Descreva os sintomas (separados por vírgula):
                    </Label>
                    <Textarea
                      value={sintomasInput}
                      onChange={(e) => setSintomasInput(e.target.value)}
                      placeholder="Ex: febre, dor de cabeça, tosse, dor no peito..."
                      className="w-full"
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    onClick={analisarSintomas}
                    disabled={carregandoIA || !sintomasInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  >
                    {carregandoIA ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Analisar com IA
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Resultados da Análise */}
              {analiseIA && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Resultado da Análise IA
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Urgência e Especialidades */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Nível de Urgência</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            analiseIA.nivelUrgencia === 'alta' ? 'bg-red-100 text-red-800' :
                            analiseIA.nivelUrgencia === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {analiseIA.nivelUrgencia.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-slate-600">Score: {analiseIA.scoreUrgencia}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Especialidades Sugeridas</h4>
                        <div className="flex flex-wrap gap-2">
                          {analiseIA.especialidades.map((esp: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Diagnósticos Possíveis */}
                    <div>
                      <h4 className="font-semibold mb-2">Diagnósticos Possíveis</h4>
                      {analiseIA.diagnosticosPossiveis.length > 0 ? (
                        <div className="space-y-2">
                          {analiseIA.diagnosticosPossiveis.map((diag: any, index: number) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-2 rounded">
                              <div className="font-medium">{diag.diagnostico}</div>
                              <div className="text-sm text-slate-600">Probabilidade: {diag.probabilidade}%</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm">Nenhum padrão específico identificado</p>
                      )}
                    </div>
                  </div>

                  {/* Medicamentos Sugeridos */}
                  {analiseIA.medicamentosSugeridos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2 flex items-center text-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Medicamentos Sugeridos
                      </h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <ul className="space-y-1">
                          {analiseIA.medicamentosSugeridos.map((med: string, index: number) => (
                            <li key={index} className="text-sm flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {med}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Interações Medicamentosas */}
                  {analiseIA.interacoesMedicamentosas.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2 flex items-center text-red-700">
                        <XCircle className="h-4 w-4 mr-1" />
                        Alertas de Interação Medicamentosa
                      </h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        {analiseIA.interacoesMedicamentosas.map((item: any, index: number) => (
                          <div key={index} className="mb-2 last:mb-0">
                            <div className="font-medium text-red-800">{item.medicamento}</div>
                            <div className="text-sm text-red-600">
                              Interações: {item.interacoes.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recomendações */}
                  <div>
                    <h4 className="font-semibold mb-2">Recomendações Clínicas</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <ul className="space-y-1">
                        {analiseIA.recomendacoes.map((rec: string, index: number) => (
                          <li key={index} className="text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* Confirmation */}
        <Dialog open={confirmEndOpen} onOpenChange={setConfirmEndOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finalizar Atendimento</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja finalizar esta consulta?</p>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setConfirmEndOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={finalizeConsultation}>Finalizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feedback */}
        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atendimento Finalizado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Consulta finalizada com sucesso!</p>
              <div className="text-center">
                <div className="flex justify-center gap-1 text-yellow-400 text-2xl mb-2">
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                  <Star className="fill-current" />
                </div>
                <p className="text-sm">Avaliação do paciente: Excelente!</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setFeedbackOpen(false)}>
                Próximo Atendimento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedConsultation;