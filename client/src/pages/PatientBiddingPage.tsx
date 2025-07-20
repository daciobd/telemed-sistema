import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Clock, 
  DollarSign, 
  User, 
  Video,
  CheckCircle,
  AlertCircle,
  Gavel,
  Heart,
  Baby,
  Eye,
  Brain
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BidData {
  specialty: string;
  offeredPrice: number;
  symptoms: string;
  urgency: 'normal' | 'high' | 'urgent';
}

interface ActiveConsultation {
  id: number;
  specialty: string;
  currentBid: number;
  timeRemaining: number;
  interestedDoctors: number;
  patientName: string;
  urgency: 'normal' | 'high' | 'urgent';
  minBid: number;
}

const specialtyIcons: Record<string, React.ReactNode> = {
  'Cardiologia': <Heart className="h-5 w-5 text-red-500" />,
  'Pediatria': <Baby className="h-5 w-5 text-blue-500" />,
  'Dermatologia': <Eye className="h-5 w-5 text-green-500" />,
  'Psiquiatria': <Brain className="h-5 w-5 text-purple-500" />,
  'Clínica Geral': <User className="h-5 w-5 text-gray-500" />
};

const mockConsultations: ActiveConsultation[] = [
  {
    id: 1,
    specialty: 'Cardiologia',
    currentBid: 180,
    timeRemaining: 765, // 12:45
    interestedDoctors: 5,
    patientName: 'Maria Silva',
    urgency: 'urgent',
    minBid: 185
  },
  {
    id: 2,
    specialty: 'Pediatria', 
    currentBid: 150,
    timeRemaining: 1530, // 25:30
    interestedDoctors: 3,
    patientName: 'Ana Costa',
    urgency: 'normal',
    minBid: 155
  },
  {
    id: 3,
    specialty: 'Dermatologia',
    currentBid: 120,
    timeRemaining: 2100, // 35:00
    interestedDoctors: 2,
    patientName: 'João Santos',
    urgency: 'high',
    minBid: 125
  }
];

export default function PatientBiddingPage() {
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ActiveConsultation | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultations, setConsultations] = useState<ActiveConsultation[]>(mockConsultations);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Timer para atualizar o tempo restante
  useEffect(() => {
    const interval = setInterval(() => {
      setConsultations(prev => prev.map(consultation => ({
        ...consultation,
        timeRemaining: Math.max(0, consultation.timeRemaining - 1)
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createBidMutation = useMutation({
    mutationFn: async (bidData: BidData) => {
      const response = await apiRequest("POST", "/api/teleconsult", {
        specialty: bidData.specialty.toLowerCase(),
        symptoms: bidData.symptoms,
        offeredPrice: bidData.offeredPrice,
        consultationType: "immediate"
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Lance Enviado com Sucesso! 🎯",
        description: `Sua proposta de R$ ${bidAmount} foi enviada para os médicos de ${specialty}. Aguarde as ofertas!`,
      });
      setShowBidModal(false);
      setBidAmount('');
      setSymptoms('');
      setSpecialty('');
      
      // Adicionar a nova consulta à lista
      const newConsultation: ActiveConsultation = {
        id: Date.now(),
        specialty: specialty,
        currentBid: parseFloat(bidAmount),
        timeRemaining: 1800, // 30 minutes
        interestedDoctors: 0,
        patientName: 'Você',
        urgency: 'normal',
        minBid: parseFloat(bidAmount) + 5
      };
      
      setConsultations(prev => [newConsultation, ...prev]);
    },
    onError: () => {
      toast({
        title: "Erro ao Enviar Lance",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'normal': return 'Regular';
      default: return urgency;
    }
  };

  const handleMakeBid = (consultation?: ActiveConsultation) => {
    if (consultation) {
      setSelectedConsultation(consultation);
      setSpecialty(consultation.specialty);
      setBidAmount((consultation.minBid).toString());
    }
    setShowBidModal(true);
  };

  const handleSubmitBid = () => {
    const bidValue = parseFloat(bidAmount);
    
    if (!specialty) {
      toast({
        title: "Especialidade Obrigatória",
        description: "Por favor, selecione uma especialidade médica.",
        variant: "destructive"
      });
      return;
    }

    if (!bidValue || bidValue < 149) {
      toast({
        title: "Valor Inválido",
        description: "O valor mínimo para lance é R$ 149,00.",
        variant: "destructive"
      });
      return;
    }

    if (!symptoms.trim()) {
      toast({
        title: "Sintomas Obrigatórios",
        description: "Descreva seus sintomas para que os médicos possam avaliar.",
        variant: "destructive"
      });
      return;
    }

    if (selectedConsultation && bidValue < selectedConsultation.minBid) {
      toast({
        title: "Lance Muito Baixo",
        description: `O lance mínimo é R$ ${selectedConsultation.minBid},00.`,
        variant: "destructive"
      });
      return;
    }

    createBidMutation.mutate({
      specialty,
      offeredPrice: bidValue,
      symptoms,
      urgency: 'normal'
    });
  };

  const attendNow = async (consultation: ActiveConsultation) => {
    toast({
      title: "Redirecionando para Consulta",
      description: `Conectando com médico para ${consultation.specialty}...`,
    });
    
    // Simular redirecionamento para videoconsulta
    setTimeout(() => {
      window.location.href = '/videoconsulta.html';
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Lances TeleMed 🏥
            </h1>
            <p className="text-gray-600">
              Faça seu lance e receba propostas dos melhores médicos
            </p>
          </div>
          <Button 
            onClick={() => handleMakeBid()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
            size="lg"
          >
            <Gavel className="h-5 w-5 mr-2" />
            Novo Lance
          </Button>
        </div>
      </div>

      {/* Active Consultations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {consultations.map((consultation) => (
          <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {specialtyIcons[consultation.specialty]}
                  {consultation.specialty}
                </CardTitle>
                <Badge className={getUrgencyColor(consultation.urgency)}>
                  {getUrgencyText(consultation.urgency)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lance Atual:</span>
                <span className="text-2xl font-bold text-green-600">
                  R$ {consultation.currentBid}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tempo Restante:</span>
                <span className="text-red-600 font-semibold">
                  {formatTime(consultation.timeRemaining)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Médicos Interessados:</span>
                <Badge variant="outline" className="bg-blue-50">
                  {consultation.interestedDoctors}
                </Badge>
              </div>

              {consultation.patientName !== 'Você' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paciente:</span>
                  <span className="text-sm font-medium">{consultation.patientName}</span>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => attendNow(consultation)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-bold"
                  size="lg"
                >
                  🚨 ATENDER AGORA - R$ {consultation.currentBid + 50}
                </Button>
                
                <Button 
                  onClick={() => handleMakeBid(consultation)}
                  variant="outline"
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  <Gavel className="h-4 w-4 mr-2" />
                  Fazer Lance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Lance */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-green-600" />
              Fazer Lance - Teleconsulta
            </DialogTitle>
            <DialogDescription>
              Preencha os dados para enviar sua proposta aos médicos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="specialty">Especialidade Médica *</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiologia">❤️ Cardiologia</SelectItem>
                  <SelectItem value="Pediatria">👶 Pediatria</SelectItem>
                  <SelectItem value="Dermatologia">👁️ Dermatologia</SelectItem>
                  <SelectItem value="Psiquiatria">🧠 Psiquiatria</SelectItem>
                  <SelectItem value="Clínica Geral">👨‍⚕️ Clínica Geral</SelectItem>
                  <SelectItem value="Ginecologia">👩‍⚕️ Ginecologia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bidAmount">Valor da Consulta (R$) *</Label>
              <Input
                id="bidAmount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="149.00"
                min="149"
                step="1"
                className="text-lg font-semibold"
              />
              <p className="text-sm text-gray-500 mt-1">
                Valor mínimo: R$ 149,00
              </p>
            </div>

            <div>
              <Label htmlFor="symptoms">Sintomas e Motivo da Consulta *</Label>
              <Textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Descreva seus sintomas, quando começaram e o que está sentindo..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowBidModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitBid}
              disabled={createBidMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {createBidMutation.isPending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Gavel className="h-4 w-4 mr-2" />
                  Enviar Lance
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Lances Ativos</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {consultations.filter(c => c.patientName === 'Você').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Médicos Disponíveis</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {consultations.reduce((sum, c) => sum + c.interestedDoctors, 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Tempo Médio</span>
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              15 min
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}