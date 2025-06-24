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
import { Brain, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const assessmentSchema = z.object({
  // Basic assessment
  anxietyLevel: z.number().min(1).max(10),
  depressionLevel: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  sleepQuality: z.number().min(1).max(10),
  moodStability: z.number().min(1).max(10),
  
  // PHQ-9 questions (simplified)
  phq9_1: z.number().min(0).max(3), // Little interest or pleasure
  phq9_2: z.number().min(0).max(3), // Feeling down, depressed
  phq9_3: z.number().min(0).max(3), // Sleep problems
  phq9_4: z.number().min(0).max(3), // Feeling tired
  phq9_5: z.number().min(0).max(3), // Poor appetite
  phq9_6: z.number().min(0).max(3), // Feeling bad about yourself
  phq9_7: z.number().min(0).max(3), // Trouble concentrating
  phq9_8: z.number().min(0).max(3), // Moving slowly or restlessly
  phq9_9: z.number().min(0).max(3), // Thoughts of death
  
  // GAD-7 questions (simplified)
  gad7_1: z.number().min(0).max(3), // Feeling nervous
  gad7_2: z.number().min(0).max(3), // Not being able to control worrying
  gad7_3: z.number().min(0).max(3), // Worrying too much
  gad7_4: z.number().min(0).max(3), // Trouble relaxing
  gad7_5: z.number().min(0).max(3), // Restlessness
  gad7_6: z.number().min(0).max(3), // Easily annoyed
  gad7_7: z.number().min(0).max(3), // Feeling afraid
});

interface PsychiatryAssessmentProps {
  appointmentId: number;
  onComplete: () => void;
}

export default function PsychiatryAssessment({ appointmentId, onComplete }: PsychiatryAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      anxietyLevel: 5,
      depressionLevel: 5,
      stressLevel: 5,
      sleepQuality: 5,
      moodStability: 5,
      phq9_1: 0, phq9_2: 0, phq9_3: 0, phq9_4: 0, phq9_5: 0,
      phq9_6: 0, phq9_7: 0, phq9_8: 0, phq9_9: 0,
      gad7_1: 0, gad7_2: 0, gad7_3: 0, gad7_4: 0,
      gad7_5: 0, gad7_6: 0, gad7_7: 0,
    },
  });

  const submitAssessment = useMutation({
    mutationFn: async (data: z.infer<typeof assessmentSchema>) => {
      try {
        // Calculate scores
        const phq9Score = data.phq9_1 + data.phq9_2 + data.phq9_3 + data.phq9_4 + data.phq9_5 + 
                         data.phq9_6 + data.phq9_7 + data.phq9_8 + data.phq9_9;
        const gad7Score = data.gad7_1 + data.gad7_2 + data.gad7_3 + data.gad7_4 + 
                         data.gad7_5 + data.gad7_6 + data.gad7_7;
        
        // Determine risk level
        let riskLevel = 'low';
        let recommendedActions = [];
        
        if (phq9Score >= 15 || gad7Score >= 15 || data.phq9_9 > 1) {
          riskLevel = 'high';
          recommendedActions = [
            'Consulta prioritária com psiquiatra',
            'Avaliação de risco de autolesão',
            'Considerar acompanhamento intensivo'
          ];
        } else if (phq9Score >= 10 || gad7Score >= 10) {
          riskLevel = 'medium';
          recommendedActions = [
            'Avaliação detalhada durante consulta',
            'Considerar psicoterapia',
            'Monitoramento regular de sintomas'
          ];
        } else {
          recommendedActions = [
            'Consulta de rotina',
            'Orientações sobre saúde mental',
            'Estratégias de autocuidado'
          ];
        }
        
        const assessmentData = {
          appointmentId,
          anxietyLevel: data.anxietyLevel,
          depressionLevel: data.depressionLevel,
          stressLevel: data.stressLevel,
          sleepQuality: data.sleepQuality,
          moodStability: data.moodStability,
          phq9Score,
          gad7Score,
          riskLevel,
          recommendedActions,
          notes: `Avaliação realizada pelo paciente. PHQ-9: ${phq9Score}, GAD-7: ${gad7Score}`
        };

        return await apiRequest(`/api/psychological-assessments`, {
          method: 'POST',
          body: JSON.stringify(assessmentData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error in submitAssessment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Avaliação Concluída",
        description: "Sua avaliação psicológica foi salva com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      onComplete();
    },
    onError: (error: any) => {
      console.error('Assessment submission error:', error);
      toast({
        title: "Erro",
        description: error?.message || "Erro ao salvar avaliação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof assessmentSchema>) => {
    submitAssessment.mutate(data);
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

  const phqOptions = [
    { value: 0, label: "Nunca" },
    { value: 1, label: "Vários dias" },
    { value: 2, label: "Mais da metade dos dias" },
    { value: 3, label: "Quase todos os dias" }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Brain className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold">Avaliação Psicológica Breve</h3>
              <p className="text-gray-600">Vamos começar com uma autoavaliação dos seus sintomas atuais</p>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="anxietyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Ansiedade (1-10)</FormLabel>
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
                name="depressionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Depressão/Tristeza (1-10)</FormLabel>
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
                name="stressLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Estresse (1-10)</FormLabel>
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Qualidade do Sono e Estabilidade Emocional</h3>
            
            <FormField
              control={form.control}
              name="sleepQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualidade do Sono (1-10)</FormLabel>
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
              name="moodStability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estabilidade do Humor (1-10)</FormLabel>
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

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Questionário PHQ-9 - Depressão</h3>
            <p className="text-gray-600">Nas últimas 2 semanas, com que frequência você foi incomodado por:</p>
            
            <div className="space-y-4">
              {[
                { name: 'phq9_1', label: 'Pouco interesse ou prazer em fazer as coisas' },
                { name: 'phq9_2', label: 'Se sentir deprimido, desanimado ou sem esperança' },
                { name: 'phq9_3', label: 'Problemas para adormecer, permanecer dormindo ou dormir demais' },
                { name: 'phq9_4', label: 'Se sentir cansado ou com pouca energia' },
                { name: 'phq9_5', label: 'Falta de apetite ou comer demais' },
              ].map((question) => (
                <FormField
                  key={question.name}
                  control={form.control}
                  name={question.name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{question.label}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                          className="flex space-x-4"
                        >
                          {phqOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value.toString()} />
                              <label className="text-xs">{option.label}</label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Questionário GAD-7 - Ansiedade</h3>
            <p className="text-gray-600">Nas últimas 2 semanas, com que frequência você foi incomodado por:</p>
            
            <div className="space-y-4">
              {[
                { name: 'gad7_1', label: 'Se sentir nervoso, ansioso ou muito tenso' },
                { name: 'gad7_2', label: 'Não ser capaz de parar ou controlar as preocupações' },
                { name: 'gad7_3', label: 'Preocupar-se muito com diversas coisas' },
                { name: 'gad7_4', label: 'Dificuldade para relaxar' },
                { name: 'gad7_5', label: 'Ficar tão agitado que se torna difícil permanecer parado' },
              ].map((question) => (
                <FormField
                  key={question.name}
                  control={form.control}
                  name={question.name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{question.label}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString()}
                          className="flex space-x-4"
                        >
                          {phqOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value.toString()} />
                              <label className="text-xs">{option.label}</label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
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
                <Brain className="h-6 w-6 text-blue-600" />
                Avaliação Psicológica Pré-Consulta
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
                      disabled={submitAssessment.isPending}
                      className="flex items-center gap-2"
                    >
                      {submitAssessment.isPending ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Concluir Avaliação
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