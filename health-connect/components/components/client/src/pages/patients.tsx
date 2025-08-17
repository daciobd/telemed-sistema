import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Plus, User, Phone, Calendar, Heart, LogOut, Stethoscope,
  Search, Edit, Trash2, Video, Clock, MapPin, AlertCircle
} from "lucide-react";

// Types
interface Patient {
  id: number;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  healthPlan?: string;
  planNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  createdAt: string;
  updatedAt: string;
}

// Form validation schema
const patientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  healthPlan: z.string().optional(),
  planNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const PatientsPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form setup
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      phone: "",
      birthDate: "",
      address: "",
      healthPlan: "",
      planNumber: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalHistory: "",
      allergies: "",
      medications: "",
    },
  });

  // Fetch patients
  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ["/api/patients"],
  });

  // Create patient mutation
  const createPatientMutation = useMutation({
    mutationFn: (data: PatientFormData) => 
      fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      setIsNewPatientOpen(false);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Paciente cadastrado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar paciente",
        variant: "destructive",
      });
    },
  });

  // Filter patients based on search
  const filteredPatients = Array.isArray(patients) ? patients.filter((patient: Patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  ) : [];

  const onSubmit = (data: PatientFormData) => {
    createPatientMutation.mutate(data);
  };

  const handleStartConsultation = (patient: Patient) => {
    // Store selected patient in sessionStorage for the consultation
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    navigate('/enhanced');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleLogout = () => {
    fetch("/api/logout", { method: "POST", credentials: "include" })
      .then(() => {
        queryClient.clear();
        navigate("/login");
      })
      .catch(() => {
        navigate("/login");
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="mx-auto h-12 w-12 text-blue-600 animate-pulse mb-4" />
          <p className="text-blue-600 font-medium">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TeleMed</h1>
                <p className="text-sm text-gray-600">Sistema de Telemedicina</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title and Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pacientes</h2>
            <p className="text-gray-600">Gerencie seus pacientes e inicie consultas</p>
          </div>
          <Button onClick={() => setIsNewPatientOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-patients"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar pacientes. Tente novamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Patients Grid */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum paciente encontrado</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Tente buscar com outros termos" : "Cadastre seu primeiro paciente para começar"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsNewPatientOpen(true)} data-testid="button-add-first-patient">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Paciente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient: Patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow duration-200" data-testid={`card-patient-${patient.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-patient-name-${patient.id}`}>{patient.name}</CardTitle>
                        <p className="text-sm text-gray-600">{formatCPF(patient.cpf)}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {patient.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {patient.phone}
                      </div>
                    )}
                    {patient.birthDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {getAge(patient.birthDate)} anos
                      </div>
                    )}
                    {patient.healthPlan && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="h-4 w-4 mr-2" />
                        {patient.healthPlan}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleStartConsultation(patient)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      data-testid={`button-start-consultation-${patient.id}`}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Iniciar Consulta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Patient Dialog */}
      <Dialog open={isNewPatientOpen} onOpenChange={setIsNewPatientOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-new-patient">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} data-testid="input-patient-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF *</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} data-testid="input-patient-cpf" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} data-testid="input-patient-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} data-testid="input-patient-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-patient-birthdate" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="healthPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano de Saúde</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do plano" {...field} data-testid="input-patient-healthplan" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo" {...field} data-testid="input-patient-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato de Emergência</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do contato" {...field} data-testid="input-patient-emergency-contact" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone de Emergência</FormLabel>
                      <FormControl>
                        <Input placeholder="(11) 99999-9999" {...field} data-testid="input-patient-emergency-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Histórico Médico</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Histórico médico relevante..." 
                        className="min-h-[80px]" 
                        {...field} 
                        data-testid="textarea-patient-medical-history"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alergias</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Alergias conhecidas..." 
                        className="min-h-[60px]" 
                        {...field} 
                        data-testid="textarea-patient-allergies"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicações Atuais</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Medicações em uso..." 
                        className="min-h-[60px]" 
                        {...field} 
                        data-testid="textarea-patient-medications"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewPatientOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPatientMutation.isPending}
                  data-testid="button-save-patient"
                >
                  {createPatientMutation.isPending ? "Salvando..." : "Salvar Paciente"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsPage;