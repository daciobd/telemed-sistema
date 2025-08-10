import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Stethoscope, AlertCircle, CheckCircle } from "lucide-react";

export function PopulateMedicalRecords() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPopulated, setIsPopulated] = useState(false);

  const populateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/medical-records/populate-demo', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      console.log('Medical records populated:', data);
      setIsPopulated(true);
      
      toast({
        title: "Prontuários Criados com Sucesso!",
        description: `${data.casesAdded} casos médicos realistas adicionados aos prontuários`,
        variant: "default",
      });

      // Invalidate medical records queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/medical-records'] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
    },
    onError: (error: Error) => {
      console.error('Error populating medical records:', error);
      toast({
        title: "Erro ao Criar Prontuários",
        description: error.message || "Falha ao popular prontuários médicos",
        variant: "destructive",
      });
    },
  });

  const medicalCases = [
    {
      title: "Enxaqueca sem aura",
      complaint: "Dor de cabeça persistente há 5 dias",
      specialty: "Neurologia"
    },
    {
      title: "Tosse pós-viral",
      complaint: "Tosse seca persistente há 2 semanas",
      specialty: "Clínica Geral"
    },
    {
      title: "Angina pectoris estável",
      complaint: "Dor no peito durante exercícios",
      specialty: "Cardiologia"
    },
    {
      title: "Transtorno de ansiedade",
      complaint: "Ansiedade e palpitações há 3 semanas",
      specialty: "Psiquiatria"
    },
    {
      title: "Lombialgia aguda",
      complaint: "Dor nas costas após carregar peso",
      specialty: "Ortopedia"
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Popular Prontuários com Dados de Demonstração
        </CardTitle>
        <p className="text-sm text-gray-600">
          Adicione casos médicos realistas aos prontuários dos pacientes para demonstração do sistema
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isPopulated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Casos Médicos Incluídos</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Esta ação criará prontuários detalhados com anamnese, exame físico, diagnóstico e tratamento para 5 casos clínicos realistas.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {medicalCases.map((case_, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                <div>
                  <h5 className="font-medium text-sm">{case_.title}</h5>
                  <p className="text-xs text-gray-600">{case_.complaint}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {case_.specialty}
              </Badge>
            </div>
          ))}
        </div>

        {isPopulated ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <h4 className="font-medium text-green-900">Prontuários Populados!</h4>
                <p className="text-sm text-green-700">
                  Os prontuários foram criados com sucesso. Agora você pode acessar a lista de pacientes para ver os dados médicos completos.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={() => populateMutation.mutate()}
              disabled={populateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {populateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando Prontuários...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Criar Prontuários de Demonstração
                </>
              )}
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Nota:</strong> Estes são dados fictícios criados exclusivamente para demonstração do sistema. 
          Incluem anamnese completa, exame físico, diagnóstico com CID-10, prescrição de tratamento e orientações de seguimento.
        </div>
      </CardContent>
    </Card>
  );
}