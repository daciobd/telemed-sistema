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

  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest(`/api/auth/switch-role/${role}`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      toast({
        title: "Sucesso",
        description: "Perfil alterado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao alterar perfil",
        variant: "destructive",
      });
    },
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
      instructions: formData.get('instructions') || '',
    });
  };

  if (isLoading || prescriptionsLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </main>
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
            <div className="flex items-center gap-3">
              {user?.role !== 'doctor' && (
                <Button 
                  onClick={() => switchRoleMutation.mutate('doctor')}
                  variant="outline"
                  disabled={switchRoleMutation.isPending}
                >
                  {switchRoleMutation.isPending ? "Alterando..." : "Modo Médico"}
                </Button>
              )}
              {user?.role === 'doctor' && (
                <>
                  <Button 
                    onClick={() => switchRoleMutation.mutate('patient')}
                    variant="outline"
                    disabled={switchRoleMutation.isPending}
                  >
                    {switchRoleMutation.isPending ? "Alterando..." : "Modo Paciente"}
                  </Button>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Prescrição
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            id="medications"
                            name="medications"
                            placeholder="Digite os medicamentos prescritos..."
                            required
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="dosage">Dosagem</Label>
                            <Input
                              id="dosage"
                              name="dosage"
                              placeholder="Ex: 500mg"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="frequency">Frequência</Label>
                            <Input
                              id="frequency"
                              name="frequency"
                              placeholder="Ex: 3x ao dia"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="duration">Duração do tratamento</Label>
                          <Input
                            id="duration"
                            name="duration"
                            placeholder="Ex: 7 dias"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="instructions">Instruções especiais</Label>
                          <Textarea
                            id="instructions"
                            name="instructions"
                            placeholder="Instruções adicionais para o paciente..."
                            className="min-h-[60px]"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
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
                </>
              )}
            </div>
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

          {filteredPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma prescrição encontrada
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {user?.role === 'doctor' 
                    ? "Você ainda não criou nenhuma prescrição médica."
                    : "Você ainda não possui prescrições médicas."
                  }
                </p>
                {user?.role === 'doctor' && (
                  <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira prescrição
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Prescrição #{prescription.id}
                      </CardTitle>
                      <Badge variant="secondary">
                        {format(new Date(prescription.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>
                        Paciente: {prescription.patient?.user?.firstName} {prescription.patient?.user?.lastName}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-900">Medicamentos:</span>
                        <p className="text-sm text-gray-600 mt-1">{prescription.medications}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Dosagem:</span>
                          <p className="text-gray-600">{prescription.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Frequência:</span>
                          <p className="text-gray-600">{prescription.frequency}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-900">Duração:</span>
                        <p className="text-sm text-gray-600">{prescription.duration}</p>
                      </div>
                      
                      {prescription.instructions && (
                        <div>
                          <span className="font-medium text-gray-900">Instruções:</span>
                          <p className="text-sm text-gray-600 mt-1">{prescription.instructions}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Prescrito por Dr. {prescription.doctor?.user?.firstName} {prescription.doctor?.user?.lastName}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}