import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ThumbsUp, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const patientFeedbackSchema = z.object({
  // Technical experience
  hadTechnicalIssues: z.boolean().default(false),
  technicalIssuesDetails: z.string().optional(),
  audioQuality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  videoQuality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  platformEaseOfUse: z.enum(['very_easy', 'easy', 'moderate', 'difficult']).optional(),
  
  // Doctor interaction
  hadDoctorInteractionIssues: z.boolean().default(false),
  doctorInteractionDetails: z.string().optional(),
  
  // Medical evaluation
  overallSatisfaction: z.number().min(1).max(5),
  doctorKnowledge: z.number().min(1).max(5),
  doctorAttention: z.number().min(1).max(5),
  wouldRecommend: z.boolean(),
  testimonial: z.string().optional(),
  
  // Rescheduling
  wantsToReschedule: z.boolean().default(false),
  rescheduleReason: z.string().optional(),
  prefersSameDoctorReschedule: z.boolean().default(true),
});

type PatientFeedbackForm = z.infer<typeof patientFeedbackSchema>;

interface PatientConsultationFeedbackProps {
  appointmentId: number;
  doctorName: string;
  consultationDuration: string;
  onComplete: (data: PatientFeedbackForm & { wantsToReschedule: boolean }) => void;
  onScheduleNew?: () => void;
}

const StarRating = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default function PatientConsultationFeedback({
  appointmentId,
  doctorName,
  consultationDuration,
  onComplete,
  onScheduleNew
}: PatientConsultationFeedbackProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRescheduleOptions, setShowRescheduleOptions] = useState(false);
  const { toast } = useToast();

  const form = useForm<PatientFeedbackForm>({
    resolver: zodResolver(patientFeedbackSchema),
    defaultValues: {
      hadTechnicalIssues: false,
      hadDoctorInteractionIssues: false,
      overallSatisfaction: 5,
      doctorKnowledge: 5,
      doctorAttention: 5,
      wouldRecommend: true,
      wantsToReschedule: false,
      prefersSameDoctorReschedule: true,
    },
  });

  const watchTechnicalIssues = form.watch('hadTechnicalIssues');
  const watchDoctorIssues = form.watch('hadDoctorInteractionIssues');
  const watchWantsToReschedule = form.watch('wantsToReschedule');

  const handleSubmit = async (data: PatientFeedbackForm) => {
    setIsSubmitting(true);
    try {
      await onComplete(data);
      
      if (data.wantsToReschedule) {
        setShowRescheduleOptions(true);
      } else {
        toast({
          title: "Obrigado pela avaliação!",
          description: "Seu feedback foi enviado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showRescheduleOptions) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-green-50 border-b text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800">Avaliação Enviada!</CardTitle>
            <p className="text-sm text-green-600">
              Obrigado pelo seu feedback sobre a consulta com {doctorName}
            </p>
          </CardHeader>
          
          <CardContent className="p-6 text-center space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Gostaria de agendar nova consulta?</h3>
              
              <div className="space-y-2">
                <Button
                  onClick={onScheduleNew}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar com {doctorName}
                </Button>
                
                <Button
                  onClick={onScheduleNew}
                  variant="outline"
                  className="w-full"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Buscar Outro Médico
                </Button>
              </div>
              
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="ghost"
                className="w-full text-gray-600"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Avalie sua Consulta</CardTitle>
              <p className="text-sm text-gray-600">
                {doctorName} | Duração: {consultationDuration} | Consulta #{appointmentId}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* Avaliação do Médico */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-medium">Avalie o Atendimento Médico</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="overallSatisfaction"
                    render={({ field }) => (
                      <FormItem>
                        <StarRating
                          value={field.value}
                          onChange={field.onChange}
                          label="Satisfação Geral"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctorKnowledge"
                    render={({ field }) => (
                      <FormItem>
                        <StarRating
                          value={field.value}
                          onChange={field.onChange}
                          label="Conhecimento Médico"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doctorAttention"
                    render={({ field }) => (
                      <FormItem>
                        <StarRating
                          value={field.value}
                          onChange={field.onChange}
                          label="Atenção e Cuidado"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="wouldRecommend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Você recomendaria este médico?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          value={field.value ? 'true' : 'false'}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="recommend-yes" />
                            <Label htmlFor="recommend-yes" className="flex items-center gap-2">
                              <ThumbsUp className="h-4 w-4 text-green-600" />
                              Sim, recomendaria
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="recommend-no" />
                            <Label htmlFor="recommend-no">Não recomendaria</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testimonial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deixe um depoimento (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte como foi sua experiência com este médico..."
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
                  <h3 className="text-lg font-medium">Experiência Técnica</h3>
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
                      <FormLabel>
                        Tive problemas técnicos durante a consulta
                      </FormLabel>
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
                          <FormLabel>Que problemas você teve?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Áudio cortado, vídeo travando, dificuldade para conectar..."
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
                        name="platformEaseOfUse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facilidade de Uso</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="very_easy">Muito Fácil</SelectItem>
                                <SelectItem value="easy">Fácil</SelectItem>
                                <SelectItem value="moderate">Moderado</SelectItem>
                                <SelectItem value="difficult">Difícil</SelectItem>
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

              {/* Problemas com Médico */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hadDoctorInteractionIssues"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        Tive dificuldades na interação com o médico
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {watchDoctorIssues && (
                  <div className="ml-6">
                    <FormField
                      control={form.control}
                      name="doctorInteractionDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descreva as dificuldades</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Médico não me ouviu direito, pressa excessiva..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Reagendamento */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-medium">Próxima Consulta</h3>
                </div>

                <FormField
                  control={form.control}
                  name="wantsToReschedule"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>
                        Gostaria de agendar uma nova consulta
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {watchWantsToReschedule && (
                  <div className="ml-6 space-y-4 p-4 bg-blue-50 rounded-lg">
                    <FormField
                      control={form.control}
                      name="prefersSameDoctorReschedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferência para nova consulta</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(value === 'true')}
                              value={field.value ? 'true' : 'false'}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="same-doctor" />
                                <Label htmlFor="same-doctor">
                                  Quero agendar com {doctorName} novamente
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="different-doctor" />
                                <Label htmlFor="different-doctor">
                                  Prefiro buscar outro médico
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rescheduleReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivo para nova consulta (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ex: Retorno para acompanhamento, nova questão..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}