import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const prescriptionFormSchema = z.object({
  patientId: z.number().min(1, "Selecione um paciente"),
  medications: z.string().min(1, "Medicamentos são obrigatórios"),
  dosage: z.string().min(1, "Dosagem é obrigatória"),
  frequency: z.string().min(1, "Frequência é obrigatória"),
  duration: z.string().min(1, "Duração é obrigatória"),
  instructions: z.string().optional(),
});

type PrescriptionFormData = z.infer<typeof prescriptionFormSchema>;

export default function PrescriptionModal({ isOpen, onClose }: PrescriptionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientId: 0,
      medications: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["/api/patients"],
  });

  const mutation = useMutation({
    mutationFn: async (data: PrescriptionFormData) => {
      return await apiRequest("/api/prescriptions", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Prescrição criada com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar prescrição",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PrescriptionFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Nova Prescrição Médica
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(patients) && patients.map((patient: any) => (
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

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Dipirona 500mg, Paracetamol 750mg..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosagem</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 1 comprimido"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 3 vezes ao dia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração do Tratamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 7 dias"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruções Especiais</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Tomar com alimentos, evitar álcool..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1"
              >
                {mutation.isPending ? "Criando..." : "Criar Prescrição"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}