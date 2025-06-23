import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Search, Calendar, User } from "lucide-react";
import PrescriptionModal from "@/components/modals/prescription-modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PrescriptionData {
  id: number;
  patientId: number;
  doctorId: number;
  medications: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  createdAt: string;
  patient: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function Prescriptions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Não autorizado",
        description: "Você foi desconectado. Fazendo login novamente...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: prescriptions, isLoading: prescriptionsLoading } = useQuery({
    queryKey: ["/api/prescriptions"],
    retry: false,
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    retry: false,
    enabled: user?.role === 'doctor',
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("/api/prescriptions", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      setIsModalOpen(false);
      toast({
        title: "Sucesso",
        description: "Prescrição criada com sucesso!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Não autorizado",
          description: "Você foi desconectado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao criar prescrição.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createPrescriptionMutation.mutate({
      patientId: selectedPatient,
      medications: formData.get('medications'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      duration: formData.get('duration'),
      instructions: formData.get('instructions'),
    });
  };

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

  const filteredPrescriptions = (prescriptions as PrescriptionData[] || []).filter(prescription =>
    prescription.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patient?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medications?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Prescrições Médicas</h1>
              <p className="text-gray-600">Gerencie prescrições e medicamentos</p>
            </div>
            {user?.role === 'doctor' && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Prescrição
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nova Prescrição Médica</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="patient">Paciente</Label>
                      <Select onValueChange={(value) => setSelectedPatient(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {(patients as any[] || []).map((patient: any) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.user?.firstName} {patient.user?.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="medications">Medicamentos</Label>
                      <Textarea
                        name="medications"
                        placeholder="Liste os medicamentos prescritos..."
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dosage">Dosagem</Label>
                        <Input
                          name="dosage"
                          placeholder="Ex: 500mg"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frequência</Label>
                        <Input
                          name="frequency"
                          placeholder="Ex: 2x ao dia"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Duração do tratamento</Label>
                      <Input
                        name="duration"
                        placeholder="Ex: 7 dias"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instructions">Instruções especiais</Label>
                      <Textarea
                        name="instructions"
                        placeholder="Instruções de uso, contraindicações, etc..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createPrescriptionMutation.isPending}>
                        {createPrescriptionMutation.isPending ? "Criando..." : "Criar Prescrição"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por paciente ou medicamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Prescrições</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptionsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription) => (
                    <div 
                      key={prescription.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">
                          {prescription.patient?.user?.firstName} {prescription.patient?.user?.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Medicamentos:</strong> {prescription.medications}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Dosagem:</strong> {prescription.dosage} | <strong>Frequência:</strong> {prescription.frequency}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Duração:</strong> {prescription.duration}
                        </p>
                        {prescription.instructions && (
                          <p className="text-sm text-gray-400 mt-1">
                            <strong>Instruções:</strong> {prescription.instructions}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className="bg-green-100 text-green-800">
                          Ativa
                        </Badge>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(prescription.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Dr. {prescription.doctor?.user?.firstName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma prescrição encontrada</p>
                  {user?.role === 'doctor' && (
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4"
                      variant="outline"
                    >
                      Criar primeira prescrição
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}