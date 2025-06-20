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

const appointmentFormSchema = insertAppointmentSchema.extend({
  appointmentDate: z.string().min(1, "Data e hora são obrigatórias"),
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
    },
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
    retry: false,
    enabled: user?.role === "doctor" || user?.role === "admin",
  });

  const { data: doctors } = useQuery({
    queryKey: ["/api/doctors"],
    retry: false,
    enabled: user?.role === "patient" || user?.role === "admin",
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const appointmentData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate),
      };
      
      await apiRequest("POST", "/api/appointments", appointmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Sucesso",
        description: "Consulta agendada com sucesso!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
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
      toast({
        title: "Erro",
        description: "Falha ao agendar consulta.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    createAppointmentMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Consulta</DialogTitle>
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
                        {patients?.map((patient: any) => (
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
                        {doctors?.map((doctor: any) => (
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
