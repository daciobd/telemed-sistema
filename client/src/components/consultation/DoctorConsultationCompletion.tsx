import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, FileText, Clock, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const consultationCompletionSchema = z.object({
  consultationCompleted: z.boolean().default(true),
  consultationNotes: z.string().optional(),
  
  // Technical issues
  hadTechnicalIssues: z.boolean().default(false),
  technicalIssuesDetails: z.string().optional(),
  audioQuality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  videoQuality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  connectionStability: z.enum(['stable', 'intermittent', 'unstable']).optional(),
  
  // Patient interaction
  hadPatientIssues: z.boolean().default(false),
  patientIssuesDetails: z.string().optional(),
  patientCooperation: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  
  // Recommendations
  recommendationsType: z.array(z.enum(['none', 'mental_health_severity', 'clinical_complexity', 'clinical_inconsistencies'])).default([]),
  alertSignals: z.string().optional(),
  
  // Follow-up
  requiresPresentialConsult: z.boolean().default(false),
  requiresContinuityConsult: z.boolean().default(false),
});

type ConsultationCompletionForm = z.infer<typeof consultationCompletionSchema>;

interface DoctorConsultationCompletionProps {
  appointmentId: number;
  patientName: string;
  onComplete: (data: ConsultationCompletionForm) => void;
  onCancel: () => void;
}

export default function DoctorConsultationCompletion({
  appointmentId,
  patientName,
  onComplete,
  onCancel
}: DoctorConsultationCompletionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ConsultationCompletionForm>({
    resolver: zodResolver(consultationCompletionSchema),
    defaultValues: {
      consultationCompleted: true,
      hadTechnicalIssues: false,
      hadPatientIssues: false,
      recommendationsType: [],
      requiresPresentialConsult: false,
      requiresContinuityConsult: false,
    },
  });

  const watchTechnicalIssues = form.watch('hadTechnicalIssues');
  const watchPatientIssues = form.watch('hadPatientIssues');

  const handleSubmit = async (data: ConsultationCompletionForm) => {
    setIsSubmitting(true);
    try {
      await onComplete(data);
      toast({
        title: "Consulta finalizada",
        description: "Relatório de conclusão salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar relatório de consulta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Finalizar Atendimento</CardTitle>
              <p className="text-sm text-gray-600">
                Paciente: <span className="font-medium">{patientName}</span> | 
                Consulta ID: {appointmentId}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Status da Consulta */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-medium">Status da Consulta</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="consultationCompleted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Consulta finalizada normalmente
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultationNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações da consulta</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva resumidamente como foi a consulta..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Problemas Técnicos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-medium">Aspectos Técnicos</h3>
                </div>

                <FormField
                  control={form.control}
                  name="hadTechnicalIssues"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Houve problemas técnicos durante a consulta
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {watchTechnicalIssues && (
                  <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                    <FormField
                      control={form.control}
                      name="technicalIssuesDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descreva os problemas técnicos</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Áudio cortado, vídeo travando, conexão instável..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="audioQuality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualidade do Áudio</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excelente</SelectItem>
                                <SelectItem value="good">Boa</SelectItem>
                                <SelectItem value="fair">Regular</SelectItem>
                                <SelectItem value="poor">Ruim</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="videoQuality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualidade do Vídeo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excelente</SelectItem>
                                <SelectItem value="good">Boa</SelectItem>
                                <SelectItem value="fair">Regular</SelectItem>
                                <SelectItem value="poor">Ruim</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="connectionStability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estabilidade da Conexão</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="stable">Estável</SelectItem>
                                <SelectItem value="intermittent">Intermitente</SelectItem>
                                <SelectItem value="unstable">Instável</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Problemas com Paciente */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Interação com Paciente</h3>
                </div>

                <FormField
                  control={form.control}
                  name="hadPatientIssues"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Houve dificuldades na interação com o paciente
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {watchPatientIssues && (
                  <div className="ml-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                    <FormField
                      control={form.control}
                      name="patientIssuesDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descreva as dificuldades</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Paciente não cooperativo, dificuldade de comunicação..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="patientCooperation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nível de cooperação do paciente</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="excellent">Excelente</SelectItem>
                              <SelectItem value="good">Boa</SelectItem>
                              <SelectItem value="fair">Regular</SelectItem>
                              <SelectItem value="poor">Ruim</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Recomendações de Atendimento */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-medium">Recomendações de Atendimento</h3>
                </div>

                <FormField
                  control={form.control}
                  name="recommendationsType"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Marque se aplicável:</FormLabel>
                      </div>
                      <div className="space-y-3">
                        {[
                          { id: 'mental_health_severity', label: 'Severidade de agravo em saúde mental' },
                          { id: 'clinical_complexity', label: 'Complexidade de perfil clínico ou social' },
                          { id: 'clinical_inconsistencies', label: 'Inconsistências de queixas clínicas' },
                        ].map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="recommendationsType"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id as any)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alertSignals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sinais de alerta (se houver)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva sinais de alerta identificados durante a consulta..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Próximos Passos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Próximos Passos</h3>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="requiresPresentialConsult"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Indicar consulta presencial
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiresContinuityConsult"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Consulta de contingência
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? "Finalizando..." : "Finalizar Atendimento"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}