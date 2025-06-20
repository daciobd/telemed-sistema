import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Stethoscope, 
  Heart, 
  Eye, 
  Baby, 
  Brain, 
  Users, 
  Video, 
  Clock, 
  CheckCircle, 
  Search,
  Loader2,
  Calendar,
  DollarSign,
  AlertCircle,
  UserCheck,
  XCircle
} from "lucide-react";

interface TeleconsultAuctionModalProps {
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

type FlowStep = "form" | "searching" | "responses" | "no_immediate" | "schedule_offers" | "confirmed";

export default function TeleconsultAuctionModal({ isOpen, onClose }: TeleconsultAuctionModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<FlowStep>("form");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState<number | null>(null);
  
  const form = useForm<TeleconsultFormData>({
    resolver: zodResolver(teleconsultFormSchema),
    defaultValues: {
      specialty: "",
      symptoms: "",
      offeredPrice: 250,
      consultationType: "immediate",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setCurrentAppointmentId(null);
      setSelectedSpecialty("");
      form.reset();
    }
  }, [isOpen, form]);

  // Poll for responses when waiting
  const { data: teleconsultStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/teleconsult", currentAppointmentId, "status"],
    enabled: !!currentAppointmentId && (step === "searching" || step === "responses"),
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Update step based on responses
  useEffect(() => {
    if (teleconsultStatus && step === "searching") {
      const { hasImmediateAcceptance, scheduleOffers, responses } = teleconsultStatus;
      
      if (hasImmediateAcceptance) {
        setStep("confirmed");
        toast({
          title: "Médico encontrado!",
          description: "Conectando para teleconsulta imediata...",
        });
      } else if (scheduleOffers?.length > 0) {
        setStep("schedule_offers");
      } else if (responses?.length > 0) {
        setStep("no_immediate");
      }
    }
  }, [teleconsultStatus, step, toast]);

  const createTeleconsultMutation = useMutation({
    mutationFn: async (data: TeleconsultFormData) => {
      const response = await apiRequest("POST", "/api/teleconsult", data);
      return response;
    },
    onSuccess: (data) => {
      setCurrentAppointmentId(data.appointment?.id);
      setStep("searching");
      
      if (data.status === "no_doctors_available") {
        setStep("no_immediate");
        toast({
          title: "Nenhum médico disponível",
          description: "Nenhum médico encontrado para esta especialidade",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Oferta enviada",
        description: `Enviando para ${data.availableDoctors} médicos disponíveis...`,
      });
      
      // Stop searching after 8 seconds and show results
      setTimeout(() => {
        refetchStatus();
      }, 8000);
    },
    onError: (error) => {
      console.error("Teleconsult error:", error);
      toast({
        title: "Erro na solicitação",
        description: error.message || "Não foi possível enviar a oferta",
        variant: "destructive",
      });
    },
  });

  const acceptResponseMutation = useMutation({
    mutationFn: async (responseId: number) => {
      const response = await apiRequest("POST", `/api/teleconsult/${currentAppointmentId}/accept-response/${responseId}`, {});
      return response;
    },
    onSuccess: () => {
      setStep("confirmed");
      toast({
        title: "Consulta confirmada!",
        description: "Redirecionando para a videochamada...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setTimeout(() => onClose(), 3000);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a consulta",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TeleconsultFormData) => {
    createTeleconsultMutation.mutate(data);
  };

  const renderFormStep = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidade</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  {specialties.map((specialty) => {
                    const Icon = specialty.icon;
                    const isSelected = field.value === specialty.id;
                    return (
                      <Card
                        key={specialty.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          field.onChange(specialty.id);
                          setSelectedSpecialty(specialty.id);
                        }}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                          <p className="text-sm font-medium">{specialty.name}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offeredPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor que você quer pagar</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      R$ {field.value}
                    </div>
                    <p className="text-sm text-gray-500">por consulta</p>
                  </div>
                  <Slider
                    min={150}
                    max={600}
                    step={25}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>R$ 150</span>
                    <span>R$ 600</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consultationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de atendimento</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  <Card
                    className={`cursor-pointer transition-all ${
                      field.value === "immediate" ? "ring-2 ring-green-500 bg-green-50" : ""
                    }`}
                    onClick={() => field.onChange("immediate")}
                  >
                    <CardContent className="p-4 text-center">
                      <Video className={`h-6 w-6 mx-auto mb-2 ${
                        field.value === "immediate" ? "text-green-600" : "text-gray-600"
                      }`} />
                      <p className="font-medium">Imediato</p>
                      <p className="text-xs text-gray-500">Conecte agora</p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      field.value === "scheduled" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => field.onChange("scheduled")}
                  >
                    <CardContent className="p-4 text-center">
                      <Calendar className={`h-6 w-6 mx-auto mb-2 ${
                        field.value === "scheduled" ? "text-blue-600" : "text-gray-600"
                      }`} />
                      <p className="font-medium">Agendado</p>
                      <p className="text-xs text-gray-500">Escolha horário</p>
                    </CardContent>
                  </Card>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sintomas ou motivo da consulta (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva brevemente seus sintomas ou o motivo da consulta..."
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={createTeleconsultMutation.isPending}
          >
            {createTeleconsultMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar Médicos
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const renderSearchingStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <Search className="h-8 w-8 text-blue-600 animate-pulse" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Enviando oferta para médicos</h3>
        <p className="text-gray-600">
          Sua oferta de <strong>R$ {form.getValues("offeredPrice")}</strong> foi enviada para médicos especialistas.
          Aguarde as respostas...
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Aguardando respostas dos médicos</span>
        </div>
      </div>
    </div>
  );

  const renderNoImmediateStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-orange-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Nenhum médico disponível agora</h3>
        <p className="text-gray-600">
          No valor de <strong>R$ {form.getValues("offeredPrice")}</strong>, nenhum médico pode atender imediatamente.
        </p>
      </div>
      <div className="space-y-3">
        <Button 
          className="w-full" 
          onClick={() => {
            setStep("form");
            form.setValue("consultationType", "scheduled");
          }}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Ver Opções de Agendamento
        </Button>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Tentar Outro Valor
        </Button>
      </div>
    </div>
  );

  const renderScheduleOffersStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Horários Disponíveis</h3>
        <p className="text-gray-600">
          Médicos disponíveis para atender por <strong>R$ {form.getValues("offeredPrice")}</strong>
        </p>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {teleconsultStatus?.scheduleOffers?.map((offer: any, index: number) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Dr. {offer.doctor?.user?.firstName} {offer.doctor?.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{offer.doctor?.specialty}</p>
                    <p className="text-sm text-blue-600">
                      {new Date(offer.offeredDateTime).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => acceptResponseMutation.mutate(offer.id)}
                  disabled={acceptResponseMutation.isPending}
                >
                  {acceptResponseMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              </div>
              {offer.message && (
                <p className="text-sm text-gray-500 mt-2 pl-13">{offer.message}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full" onClick={onClose}>
        Cancelar
      </Button>
    </div>
  );

  const renderConfirmedStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-700 mb-2">Consulta Confirmada!</h3>
        <p className="text-gray-600">
          Conectando você com o médico. A videochamada será iniciada em instantes.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Video className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Preparando videochamada...</span>
        </div>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case "form":
        return renderFormStep();
      case "searching":
        return renderSearchingStep();
      case "no_immediate":
        return renderNoImmediateStep();
      case "schedule_offers":
        return renderScheduleOffersStep();
      case "confirmed":
        return renderConfirmedStep();
      default:
        return renderFormStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-600" />
            <span>Teleconsulta com Leilão de Preços</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {getStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}