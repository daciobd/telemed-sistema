import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertAppointmentSchema } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const appointmentFormSchema = z.object({
  doctorId: z.number().optional(),
  patientId: z.number().optional(),
  appointmentDate: z.string().min(1, "Data e hora são obrigatórias"),
  type: z.string().default("routine"),
  duration: z.number().default(30),
  status: z.string().default("scheduled"),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export default function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      type: "routine",
      duration: 30,
      status: "scheduled",
      notes: "",
      appointmentDate: "",
      patientId: undefined,
      doctorId: undefined,
    },
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    retry: false,
    enabled: !!user && (user.role === "doctor" || user.role === "admin"),
  });

  const { data: doctors } = useQuery({
    queryKey: ["/api/doctors"],
    retry: false,
    enabled: !!user && (user.role === "patient" || user.role === "admin"),
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      console.log("Creating appointment with data:", data);
      
      // Simple validation
      if (!data.appointmentDate) {
        throw new Error("Data e hora são obrigatórias");
      }
      
      // Get user's patient/doctor info for automatic assignment
      const userProfile = await fetch("/api/auth/user", {
        credentials: "include"
      }).then(res => res.json());
      
      // Create appointment object with proper structure
      const appointmentPayload = {
        doctorId: data.doctorId,
        patientId: data.patientId || userProfile.patient?.id,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
        type: data.type || "routine",
        duration: data.duration || 30,
        status: "scheduled",
        notes: data.notes || "",
      };
      
      console.log("Sending to API:", appointmentPayload);
      
      try {
        const response = await fetch("/api/appointments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(appointmentPayload),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("API Error:", response.status, errorData);
          throw new Error(`Erro ${response.status}: ${errorData}`);
        }

        const result = await response.json();
        console.log("Success response:", result);
        return result;
      } catch (error) {
        console.error("Request failed:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Sucesso",
        description: "Consulta agendada com sucesso!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Appointment creation error:", error);
      
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : "Falha ao agendar consulta";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    console.log("Form submission started");
    console.log("User role:", user?.role);
    console.log("Form data:", data);
    console.log("Form state errors:", form.formState.errors);
    
    // Prevent multiple submissions
    if (createAppointmentMutation.isPending) {
      console.log("Submission already in progress, ignoring");
      return;
    }
    
    // Role-based validation
    if (user?.role === "patient" && !data.doctorId) {
      console.log("Patient missing doctor selection");
      toast({
        title: "Erro",
        description: "Selecione um médico para continuar",
        variant: "destructive",
      });
      return;
    }
    
    if (user?.role === "doctor" && !data.patientId) {
      console.log("Doctor missing patient selection");
      toast({
        title: "Erro", 
        description: "Selecione um paciente para continuar",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Validation passed, submitting...");
    createAppointmentMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Consulta</DialogTitle>
          <DialogDescription>
            Agende uma nova consulta médica preenchendo as informações abaixo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(user?.role === "doctor" || user?.role === "admin") && (
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(patients as any[])?.map((patient: any) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.user.firstName} {patient.user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(user?.role === "patient" || user?.role === "admin") && (
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médico</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um médico" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(doctors as any[])?.map((doctor: any) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Consulta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="routine">Consulta de Rotina</SelectItem>
                      <SelectItem value="followup">Retorno</SelectItem>
                      <SelectItem value="emergency">Urgência</SelectItem>
                      <SelectItem value="telemedicine">Teleconsulta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Observações sobre a consulta..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={createAppointmentMutation.isPending}
              >
                {createAppointmentMutation.isPending ? "Agendando..." : "Agendar Consulta"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
