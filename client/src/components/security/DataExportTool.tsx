import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Trash2, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function DataExportTool() {
  const { toast } = useToast();
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");

  // Mutation para exportar dados
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/security/lgpd/export");
      return response;
    },
    onSuccess: (data) => {
      // Criar e baixar arquivo JSON
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { 
        type: "application/json" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `telemed-dados-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Dados exportados com sucesso",
        description: "O arquivo foi baixado para o seu dispositivo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na exportação",
        description: error.message || "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    },
  });

  // Mutation para solicitar direitos LGPD
  const requestRightsMutation = useMutation({
    mutationFn: async (data: { requestType: string; description: string }) => {
      return await apiRequest("/api/security/lgpd/request", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Solicitação registrada",
        description: `Sua solicitação foi registrada. Prazo para resposta: ${new Date(data.request.dueDate).toLocaleDateString()}.`,
      });
      setRequestType("");
      setDescription("");
    },
    onError: (error) => {
      toast({
        title: "Erro ao processar solicitação",
        description: error.message || "Não foi possível registrar a solicitação.",
        variant: "destructive",
      });
    },
  });

  const handleExportData = () => {
    exportDataMutation.mutate();
  };

  const handleSubmitRequest = () => {
    if (!requestType || !description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo de solicitação e forneça uma descrição.",
        variant: "destructive",
      });
      return;
    }

    requestRightsMutation.mutate({ requestType, description });
  };

  const requestTypeOptions = [
    { value: "access", label: "Acesso aos Dados", description: "Solicitar informações sobre quais dados possuímos sobre você" },
    { value: "portability", label: "Portabilidade", description: "Exportar seus dados em formato estruturado" },
    { value: "rectification", label: "Retificação", description: "Corrigir dados incorretos ou incompletos" },
    { value: "deletion", label: "Exclusão", description: "Deletar seus dados (direito ao esquecimento)" },
    { value: "restriction", label: "Limitação", description: "Restringir o processamento dos seus dados" },
    { value: "objection", label: "Oposição", description: "Opor-se ao processamento dos seus dados" },
  ];

  return (
    <div className="space-y-6">
      {/* Exportação Rápida */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <CardTitle>Exportar Meus Dados</CardTitle>
          </div>
          <CardDescription>
            Baixe uma cópia completa de todos os seus dados da plataforma TeleMed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">O que será incluído:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Dados pessoais (nome, e-mail, telefone)</li>
              <li>• Histórico médico e consultas</li>
              <li>• Prescrições e resultados de exames</li>
              <li>• Histórico de consentimentos</li>
              <li>• Logs de atividade na plataforma</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleExportData}
            disabled={exportDataMutation.isPending}
            className="w-full"
          >
            {exportDataMutation.isPending ? "Exportando..." : "Exportar Dados Agora"}
          </Button>
          
          <p className="text-xs text-gray-500">
            O arquivo será baixado em formato JSON. Mantenha-o seguro, pois contém informações sensíveis.
          </p>
        </CardContent>
      </Card>

      {/* Solicitações LGPD */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Exercer Direitos LGPD</CardTitle>
          </div>
          <CardDescription>
            Faça solicitações formais conforme seus direitos previstos na LGPD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestType">Tipo de Solicitação</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de solicitação" />
              </SelectTrigger>
              <SelectContent>
                {requestTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Solicitação</Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente sua solicitação..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Forneça o máximo de detalhes possível para agilizar o processamento.
            </p>
          </div>

          <Button 
            onClick={handleSubmitRequest}
            disabled={requestRightsMutation.isPending || !requestType || !description.trim()}
            className="w-full"
          >
            {requestRightsMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
          </Button>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Temos 15 dias para responder sua solicitação</li>
                  <li>• Você será notificado por e-mail sobre o andamento</li>
                  <li>• Solicitações de exclusão são irreversíveis</li>
                  <li>• Alguns dados podem ser mantidos por obrigação legal</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exclusão de Conta */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
          </div>
          <CardDescription>
            Ações irreversíveis que afetam permanentemente sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Deletar Conta e Dados</h4>
            <p className="text-sm text-red-800 mb-3">
              Esta ação removerá permanentemente:
            </p>
            <ul className="text-sm text-red-800 space-y-1 mb-3">
              <li>• Todos os seus dados pessoais</li>
              <li>• Histórico médico completo</li>
              <li>• Consultas e prescrições</li>
              <li>• Configurações e preferências</li>
            </ul>
            <p className="text-xs text-red-700">
              <strong>Atenção:</strong> Esta ação é irreversível e não pode ser desfeita.
            </p>
          </div>

          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              setRequestType("deletion");
              setDescription("Solicitação de exclusão completa da conta e todos os dados associados.");
            }}
          >
            Solicitar Exclusão da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}