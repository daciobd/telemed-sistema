import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  DollarSign, 
  Video, 
  Calendar,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  Baby,
  Users,
  Search,
  Loader2
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface TeleconsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const teleconsultFormSchema = z.object({
  specialty: z.string().min(1, "Selecione uma especialidade"),
  symptoms: z.string().optional(),
  offeredPrice: z.number().min(150, "Valor mínimo R$ 150").max(600, "Valor máximo R$ 600"),
  consultationType: z.enum(["immediate", "scheduled"]),
});

type TeleconsultFormData = z.infer<typeof teleconsultFormSchema>;

const specialties = [
  { id: "general", name: "Clínico Geral", icon: Stethoscope, color: "bg-blue-100 text-blue-700" },
  { id: "cardiology", name: "Cardiologia", icon: Heart, color: "bg-red-100 text-red-700" },
  { id: "dermatology", name: "Dermatologia", icon: Eye, color: "bg-green-100 text-green-700" },
  { id: "pediatrics", name: "Pediatria", icon: Baby, color: "bg-pink-100 text-pink-700" },
  { id: "psychiatry", name: "Psiquiatria", icon: Brain, color: "bg-purple-100 text-purple-700" },
  { id: "gynecology", name: "Ginecologia", icon: Users, color: "bg-yellow-100 text-yellow-700" },
];

export default function TeleconsultModal({ isOpen, onClose }: TeleconsultModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "searching" | "found">("form");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  
  const form = useForm<TeleconsultFormData>({
    resolver: zodResolver(teleconsultFormSchema),
    defaultValues: {
      specialty: "",
      symptoms: "",
      offeredPrice: 250,
      consultationType: "immediate",
    },
  });

  const { data: doctors } = useQuery({
    queryKey: ["/api/doctors"],
    retry: false,
    enabled: !!user,
  });

  const createTeleconsultMutation = useMutation({
    mutationFn: async (data: TeleconsultFormData) => {
      const teleconsultData = {
        ...data,
        type: "telemedicine",
        status: "pending",
        appointmentDate: new Date(),
      };
      
      const response = await apiRequest("POST", "/api/teleconsult", teleconsultData);
      return response;
    },
    onSuccess: () => {
      setStep("searching");
      setTimeout(() => {
        setStep("found");
      }, 3000);
      
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Teleconsulta solicitada",
        description: "Buscando médicos disponíveis...",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível solicitar a teleconsulta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TeleconsultFormData) => {
    createTeleconsultMutation.mutate(data);
  };

  const handleSpecialtySelect = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    form.setValue("specialty", specialtyId);
  };

  const handleClose = () => {
    setStep("form");
    setSelectedSpecialty("");
    form.reset();
    onClose();
  };

  if (step === "searching") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Buscando médicos disponíveis
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Estamos conectando você com médicos especializados em {selectedSpecialty}
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Valor oferecido: <span className="font-medium">R$ {form.getValues("offeredPrice")}</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "found") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Video className="h-10 w-10 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Médico encontrado!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Dr. Carlos Silva está disponível para atendê-lo agora
            </p>
            
            <div className="w-full space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Dr. Carlos Silva</h4>
                      <p className="text-sm text-gray-600">Cardiologia - CRM 12345</p>
                      <p className="text-sm text-green-600">● Disponível agora</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {form.getValues("offeredPrice")}</p>
                      <p className="text-xs text-gray-500">30 min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleClose}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Iniciar Consulta
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nova Teleconsulta
          </DialogTitle>
          <p className="text-gray-600">
            Escolha uma especialidade, defina seu orçamento e conecte-se com médicos disponíveis
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Specialties Grid */}
            <div className="space-y-3">
              <FormLabel className="text-base font-medium">Especialidade</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {specialties.map((specialty) => {
                  const Icon = specialty.icon;
                  const isSelected = selectedSpecialty === specialty.id;
                  
                  return (
                    <Card
                      key={specialty.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleSpecialtySelect(specialty.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${specialty.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{specialty.name}</p>
                            <p className="text-xs text-gray-500">
                              {Math.floor(Math.random() * 5) + 2} médicos online
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {form.formState.errors.specialty && (
                <p className="text-sm text-red-500">{form.formState.errors.specialty.message}</p>
              )}
            </div>

            {/* Price Slider */}
            <FormField
              control={form.control}
              name="offeredPrice"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">
                    Valor que você quer pagar
                  </FormLabel>
                  <div className="px-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">R$ 150</span>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {field.value}
                        </span>
                        <p className="text-xs text-gray-500">por consulta</p>
                      </div>
                      <span className="text-sm text-gray-600">R$ 600</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={150}
                        max={600}
                        step={25}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex justify-center mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {field.value <= 200 ? "Econômico" : 
                         field.value <= 350 ? "Padrão" : 
                         field.value <= 500 ? "Premium" : "VIP"}
                      </Badge>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Consultation Type */}
            <FormField
              control={form.control}
              name="consultationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base font-medium">Tipo de atendimento</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        field.value === "immediate" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => field.onChange("immediate")}
                    >
                      <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-medium">Imediato</h4>
                        <p className="text-xs text-gray-600">Conecte agora com médicos online</p>
                      </CardContent>
                    </Card>
                    
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        field.value === "scheduled" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => field.onChange("scheduled")}
                    >
                      <CardContent className="p-4 text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-medium">Agendado</h4>
                        <p className="text-xs text-gray-600">Escolha data e horário</p>
                      </CardContent>
                    </Card>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Symptoms */}
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sintomas ou motivo da consulta (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      rows={3}
                      placeholder="Descreva brevemente seus sintomas ou o motivo da consulta..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={createTeleconsultMutation.isPending}
              >
                {createTeleconsultMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Buscar Médicos
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}