import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Gavel } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefilledSpecialty?: string;
  prefilledAmount?: string;
}

export function BidModal({ isOpen, onClose, onSuccess, prefilledSpecialty = '', prefilledAmount = '' }: BidModalProps) {
  const [specialty, setSpecialty] = useState(prefilledSpecialty);
  const [bidAmount, setBidAmount] = useState(prefilledAmount);
  const [symptoms, setSymptoms] = useState('');
  const { toast } = useToast();

  const createBidMutation = useMutation({
    mutationFn: async (bidData: any) => {
      const response = await apiRequest("POST", "/api/teleconsult", {
        specialty: bidData.specialty.toLowerCase(),
        symptoms: bidData.symptoms,
        offeredPrice: bidData.offeredPrice,
        consultationType: "immediate"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lance Enviado com Sucesso! 🎯",
        description: `Sua proposta de R$ ${bidAmount} foi enviada para os médicos de ${specialty}. Aguarde as ofertas!`,
      });
      onSuccess();
      handleClose();
    },
    onError: () => {
      toast({
        title: "Erro ao Enviar Lance",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });

  const handleClose = () => {
    setSpecialty('');
    setBidAmount('');
    setSymptoms('');
    onClose();
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

    createBidMutation.mutate({
      specialty,
      offeredPrice: bidValue,
      symptoms
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            onClick={handleClose}
            className="flex-1"
            disabled={createBidMutation.isPending}
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
  );
}