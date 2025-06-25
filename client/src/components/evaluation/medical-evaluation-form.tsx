import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Star, Heart, MessageSquare, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MedicalEvaluationFormProps {
  appointmentId: number;
  doctorName: string;
  onComplete?: () => void;
}

export default function MedicalEvaluationForm({ 
  appointmentId, 
  doctorName, 
  onComplete 
}: MedicalEvaluationFormProps) {
  const [satisfactionRating, setSatisfactionRating] = useState<number>(0);
  const [knowledgeRating, setKnowledgeRating] = useState<number>(0);
  const [attentivenessRating, setAttentivenessRating] = useState<number>(0);
  const [testimonial, setTestimonial] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const evaluationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/medical-evaluations", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Avaliação enviada com sucesso!",
        description: "Obrigado pelo seu feedback. Isso nos ajuda a melhorar nossos serviços.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      onComplete?.();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar avaliação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (rating: number) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star 
              className={`h-6 w-6 ${
                star <= value 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {value === 0 ? "Clique para avaliar" : 
         value === 1 ? "Muito insatisfeito" :
         value === 2 ? "Insatisfeito" :
         value === 3 ? "Neutro" :
         value === 4 ? "Satisfeito" : "Muito satisfeito"}
      </p>
    </div>
  );

  const handleSubmit = () => {
    if (satisfactionRating === 0 || knowledgeRating === 0 || attentivenessRating === 0) {
      toast({
        title: "Avaliação incompleta",
        description: "Por favor, avalie todos os aspectos do atendimento.",
        variant: "destructive",
      });
      return;
    }

    const overallRating = Math.round(
      (satisfactionRating + knowledgeRating + attentivenessRating) / 3
    );

    evaluationMutation.mutate({
      appointmentId,
      satisfactionRating,
      knowledgeRating,
      attentivenessRating,
      testimonial: testimonial.trim() || null,
      wouldRecommend,
      overallRating,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center bg-blue-50">
        <CardTitle className="flex items-center justify-center gap-2 text-blue-700">
          <Heart className="h-5 w-5" />
          Avaliação do Atendimento Médico
        </CardTitle>
        <p className="text-sm text-blue-600">
          Avalie seu atendimento com {doctorName}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Question 1: Satisfaction */}
        <StarRating
          value={satisfactionRating}
          onChange={setSatisfactionRating}
          label="1. Ficou satisfeito com o atendimento?"
        />

        {/* Question 2: Knowledge */}
        <StarRating
          value={knowledgeRating}
          onChange={setKnowledgeRating}
          label="2. O médico demonstrou conhecimento adequado?"
        />

        {/* Question 3: Attentiveness */}
        <StarRating
          value={attentivenessRating}
          onChange={setAttentivenessRating}
          label="3. O médico foi atencioso durante a consulta?"
        />

        {/* Recommendation */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Recomendaria este médico para outros pacientes?
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={wouldRecommend}
              onCheckedChange={setWouldRecommend}
            />
            <span className="text-sm">
              {wouldRecommend ? "Sim, recomendaria" : "Não recomendaria"}
            </span>
            <ThumbsUp className={`h-4 w-4 ${wouldRecommend ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Testimonial */}
        <div className="space-y-2">
          <Label htmlFor="testimonial" className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Poderia deixar um depoimento? (opcional)
          </Label>
          <Textarea
            id="testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            placeholder="Compartilhe sua experiência com outros pacientes..."
            className="min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-gray-500">
            {testimonial.length}/500 caracteres
          </p>
        </div>

        {/* Overall Rating Display */}
        {satisfactionRating > 0 && knowledgeRating > 0 && attentivenessRating > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avaliação geral:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round((satisfactionRating + knowledgeRating + attentivenessRating) / 3)
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {Math.round((satisfactionRating + knowledgeRating + attentivenessRating) / 3)}/5
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={evaluationMutation.isPending || satisfactionRating === 0 || knowledgeRating === 0 || attentivenessRating === 0}
        >
          {evaluationMutation.isPending ? "Enviando..." : "Enviar Avaliação"}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Sua avaliação é anônima e ajuda a melhorar a qualidade dos nossos serviços
        </p>
      </CardContent>
    </Card>
  );
}