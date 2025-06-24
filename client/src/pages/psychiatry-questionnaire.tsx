import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, Clock, Heart, Brain, Users } from 'lucide-react';

const questionnaireSchema = z.object({
  // Current symptoms
  currentSymptoms: z.array(z.string()).min(1, "Selecione pelo menos um sintoma"),
  symptomDuration: z.string().min(1, "Selecione a duração dos sintomas"),
  symptomSeverity: z.number().min(1).max(10),
  triggerEvents: z.string().optional(),
  
  // Medical history
  previousTreatment: z.boolean(),
  currentMedications: z.array(z.string()),
  familyHistory: z.array(z.string()),
  medicalConditions: z.array(z.string()),
  
  // Lifestyle
  sleepHours: z.number().min(1).max(24),
  exerciseFrequency: z.string(),
  alcoholUse: z.string(),
  substanceUse: z.string(),
  smokingStatus: z.string(),
  
  // Social factors
  workStress: z.number().min(1).max(10),
  relationshipStatus: z.string(),
  supportSystem: z.number().min(1).max(10),
  financialStress: z.number().min(1).max(10),
  
  // Goals
  treatmentGoals: z.string().min(10, "Descreva seus objetivos com pelo menos 10 caracteres"),
  preferredApproach: z.string(),
  concerns: z.string().optional(),
});

interface PsychiatryQuestionnaireProps {
  appointmentId: number;
  onComplete: () => void;
}

export default function PsychiatryQuestionnaire({ appointmentId, onComplete }: PsychiatryQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<z.infer<typeof questionnaireSchema>>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      currentSymptoms: [],
      symptomDuration: '',
      symptomSeverity: 5,
      triggerEvents: '',
      previousTreatment: false,
      currentMedications: [],
      familyHistory: [],
      medicalConditions: [],
      sleepHours: 8,
      exerciseFrequency: '',
      alcoholUse: '',
      substanceUse: '',
      smokingStatus: '',
      workStress: 5,
      relationshipStatus: '',
      supportSystem: 5,
      financialStress: 5,
      treatmentGoals: '',
      preferredApproach: '',
      concerns: '',
    },
  });

  const submitQuestionnaire = useMutation({
    mutationFn: async (data: z.infer<typeof questionnaireSchema>) => {
      try {
        const questionnaireData = {
          appointmentId,
          ...data,
        };

        const response = await fetch('/api/psychiatry-questionnaires', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionnaireData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error in submitQuestionnaire:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Questionário Concluído",
        description: "Suas informações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      onComplete();
    },
    onError: (error: any) => {
      console.error('Questionnaire submission error:', error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao salvar questionário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof questionnaireSchema>) => {
    submitQuestionnaire.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const symptoms = [
    'Ansiedade', 'Depressão', 'Insônia', 'Pânico', 'Preocupação excessiva',
    'Tristeza persistente', 'Irritabilidade', 'Dificuldade de concentração',
    'Pensamentos negativos', 'Isolamento social', 'Mudanças de humor',
    'Fadiga', 'Perda de interesse', 'Sensação de desesperança'
  ];

  const familyConditions = [
    'Depressão', 'Ansiedade', 'Transtorno bipolar', 'Esquizofrenia',
    'Dependência química', 'Suicídio', 'Outros transtornos mentais', 'Nenhum histórico'
  ];

  const medicalConditions = [
    'Diabetes', 'Hipertensão', 'Problemas cardíacos', 'Problemas de tireoide',
    'Doenças autoimunes', 'Problemas neurológicos', 'Outras condições', 'Nenhuma condição'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold">Questionário Pré-Consulta</h3>
              <p className="text-gray-600">Informações sobre seus sintomas atuais</p>
            </div>

            <FormField
              control={form.control}
              name="currentSymptoms"
              render={() => (
                <FormItem>
                  <FormLabel>Quais sintomas você tem experimentado? (Selecione todos que se aplicam)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map((symptom) => (
                      <FormField
                        key={symptom}
                        control={form.control}
                        name="currentSymptoms"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(symptom)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), symptom]
                                    : field.value?.filter((value) => value !== symptom) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{symptom}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptomDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Há quanto tempo você tem esses sintomas?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="days">Alguns dias</SelectItem>
                      <SelectItem value="weeks">Algumas semanas</SelectItem>
                      <SelectItem value="months">Alguns meses</SelectItem>
                      <SelectItem value="years">Mais de um ano</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptomSeverity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intensidade dos sintomas (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        Valor atual: {field.value}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="triggerEvents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eventos que podem ter desencadeado os sintomas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: perda de emprego, luto, separação, mudança..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold">Histórico Médico</h3>
            </div>

            <FormField
              control={form.control}
              name="previousTreatment"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Já fez tratamento psiquiátrico ou psicológico antes?</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="familyHistory"
              render={() => (
                <FormItem>
                  <FormLabel>Histórico familiar de problemas de saúde mental</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {familyConditions.map((condition) => (
                      <FormField
                        key={condition}
                        control={form.control}
                        name="familyHistory"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(condition)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), condition]
                                    : field.value?.filter((value) => value !== condition) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{condition}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicalConditions"
              render={() => (
                <FormItem>
                  <FormLabel>Outras condições médicas</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {medicalConditions.map((condition) => (
                      <FormField
                        key={condition}
                        control={form.control}
                        name="medicalConditions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(condition)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), condition]
                                    : field.value?.filter((value) => value !== condition) || [];
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">{condition}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Estilo de Vida</h3>

            <FormField
              control={form.control}
              name="sleepHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantas horas você dorme por noite?</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exerciseFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência de exercícios</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Não pratico</SelectItem>
                      <SelectItem value="rare">Raramente</SelectItem>
                      <SelectItem value="weekly">1-2 vezes por semana</SelectItem>
                      <SelectItem value="regular">3-4 vezes por semana</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alcoholUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uso de álcool</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o uso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Não bebo</SelectItem>
                      <SelectItem value="occasional">Ocasionalmente</SelectItem>
                      <SelectItem value="moderate">Moderadamente</SelectItem>
                      <SelectItem value="frequent">Frequentemente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smokingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status de tabagismo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nunca fumei</SelectItem>
                      <SelectItem value="former">Ex-fumante</SelectItem>
                      <SelectItem value="current">Fumante atual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold">Fatores Sociais</h3>
            </div>

            <FormField
              control={form.control}
              name="workStress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de estresse no trabalho (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        Valor atual: {field.value}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationshipStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status de relacionamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Solteiro(a)</SelectItem>
                      <SelectItem value="relationship">Em relacionamento</SelectItem>
                      <SelectItem value="married">Casado(a)</SelectItem>
                      <SelectItem value="divorced">Divorciado(a)</SelectItem>
                      <SelectItem value="widowed">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualidade do suporte social (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        Valor atual: {field.value}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financialStress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de estresse financeiro (1-10)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        min={1}
                        max={10}
                        step={1}
                      />
                      <div className="text-center text-sm text-gray-600">
                        Valor atual: {field.value}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold">Objetivos do Tratamento</h3>
            </div>

            <FormField
              control={form.control}
              name="treatmentGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quais são seus principais objetivos com o tratamento?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: reduzir ansiedade, melhorar qualidade do sono, aumentar autoestima..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredApproach"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferência de abordagem terapêutica</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua preferência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="therapy">Apenas psicoterapia</SelectItem>
                      <SelectItem value="medication">Apenas medicação</SelectItem>
                      <SelectItem value="both">Psicoterapia e medicação</SelectItem>
                      <SelectItem value="undecided">Não tenho certeza</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="concerns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preocupações ou dúvidas sobre o tratamento (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva qualquer preocupação que você tenha..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                Questionário Pré-Consulta Psiquiátrica
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {currentStep}/{totalSteps}
              </div>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}
                
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Anterior
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={nextStep}>
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitQuestionnaire.isPending}
                      className="flex items-center gap-2"
                    >
                      {submitQuestionnaire.isPending ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Finalizar Questionário
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}