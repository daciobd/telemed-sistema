import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Clock, Save, AlertCircle } from 'lucide-react';

interface PsychologistInterviewNotesProps {
  appointmentId: number;
  interviewId: number;
}

export default function PsychologistInterviewNotes({ appointmentId, interviewId }: PsychologistInterviewNotesProps) {
  const [notes, setNotes] = useState({
    duration: '',
    psychodynamicSummary: '',
    personalityProfile: '',
    copingMechanisms: '',
    interpersonalPatterns: '',
    defenseStructures: '',
    emotionalRegulation: '',
    recommendations: '',
    riskFactors: '',
    strengths: '',
    therapeuticAlliance: '',
    transferenceNotes: '',
    countertransferenceNotes: '',
    treatmentRecommendations: '',
    urgencyLevel: 'low',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interview } = useQuery({
    queryKey: [`/api/psychologist-interviews/${interviewId}`],
  });

  const saveNotes = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/psychologist-interviews/${interviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          duration: data.duration ? parseInt(data.duration) : null,
          status: 'completed',
        }),
      });
      if (!response.ok) throw new Error('Failed to save notes');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notas Salvas",
        description: "As anotações da entrevista foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/${appointmentId}/psychologist-interview`] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as anotações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!notes.psychodynamicSummary.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O resumo psicodinâmico é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    saveNotes.mutate(notes);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle>Anotações da Entrevista Psicodinâmica</CardTitle>
          </div>
          <CardDescription>
            Complete as informações da avaliação realizada com o paciente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duração Real da Entrevista (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="60"
                value={notes.duration}
                onChange={(e) => setNotes({ ...notes, duration: e.target.value })}
                placeholder="Ex: 45"
              />
            </div>

            <div>
              <Label htmlFor="urgencyLevel">Nível de Urgência</Label>
              <Select value={notes.urgencyLevel} onValueChange={(value) => setNotes({ ...notes, urgencyLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="moderate">Moderado</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="psychodynamicSummary">Resumo Psicodinâmico *</Label>
            <Textarea
              id="psychodynamicSummary"
              value={notes.psychodynamicSummary}
              onChange={(e) => setNotes({ ...notes, psychodynamicSummary: e.target.value })}
              placeholder="Descreva a estrutura de personalidade, dinâmica psíquica e aspectos centrais observados..."
              className="min-h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="personalityProfile">Perfil de Personalidade</Label>
              <Textarea
                id="personalityProfile"
                value={notes.personalityProfile}
                onChange={(e) => setNotes({ ...notes, personalityProfile: e.target.value })}
                placeholder="Traços predominantes, organização da personalidade..."
                className="min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="copingMechanisms">Mecanismos de Enfrentamento</Label>
              <Textarea
                id="copingMechanisms"
                value={notes.copingMechanisms}
                onChange={(e) => setNotes({ ...notes, copingMechanisms: e.target.value })}
                placeholder="Como o paciente lida com estresse e adversidades..."
                className="min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="interpersonalPatterns">Padrões Interpessoais</Label>
              <Textarea
                id="interpersonalPatterns"
                value={notes.interpersonalPatterns}
                onChange={(e) => setNotes({ ...notes, interpersonalPatterns: e.target.value })}
                placeholder="Padrões relacionais, vínculos, interações sociais..."
                className="min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="emotionalRegulation">Regulação Emocional</Label>
              <Textarea
                id="emotionalRegulation"
                value={notes.emotionalRegulation}
                onChange={(e) => setNotes({ ...notes, emotionalRegulation: e.target.value })}
                placeholder="Capacidade de regulação afetiva, expressão emocional..."
                className="min-h-24"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strengths">Recursos e Pontos Fortes</Label>
              <Textarea
                id="strengths"
                value={notes.strengths}
                onChange={(e) => setNotes({ ...notes, strengths: e.target.value })}
                placeholder="Recursos psíquicos, habilidades, aspectos adaptativos..."
                className="min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="riskFactors">Fatores de Risco</Label>
              <Textarea
                id="riskFactors"
                value={notes.riskFactors}
                onChange={(e) => setNotes({ ...notes, riskFactors: e.target.value })}
                placeholder="Vulnerabilidades, fatores de risco identificados..."
                className="min-h-24"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="treatmentRecommendations">Recomendações de Tratamento</Label>
            <Textarea
              id="treatmentRecommendations"
              value={notes.treatmentRecommendations}
              onChange={(e) => setNotes({ ...notes, treatmentRecommendations: e.target.value })}
              placeholder="Sugestões de abordagem terapêutica, focos do tratamento, considerações especiais..."
              className="min-h-32"
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Estas informações serão compartilhadas com o psiquiatra responsável pela consulta
              para otimizar o atendimento e personalizar o tratamento.
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={saveNotes.isPending}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveNotes.isPending ? 'Salvando...' : 'Finalizar Entrevista e Salvar Resumo'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}