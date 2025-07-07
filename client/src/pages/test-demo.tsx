import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Database, Users } from "lucide-react";

export default function TestDemo() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createDemoData = async () => {
    setIsLoading(true);
    try {
      console.log('Calling API: /api/demo/quick-populate');
      
      const response = await fetch('/api/demo/quick-populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        setResult(data);
        
        toast({
          title: "Sucesso!",
          description: "Dados de demonstração criados com sucesso",
        });
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: `Falha ao criar dados: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Teste da API de Demonstração
          </h1>
          <p className="text-gray-600">
            Use esta página para testar a criação de dados de demonstração
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Criar Dados de Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>API Endpoint:</strong> POST /api/demo/quick-populate</p>
              <p><strong>Autenticação:</strong> Não requerida</p>
              <p><strong>Dados criados:</strong> 1 médico, 1 paciente, 1 prontuário</p>
            </div>
            
            <Button 
              onClick={createDemoData}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Criando dados...' : '🚀 Criar Dados de Demonstração'}
            </Button>

            {result && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Dados criados com sucesso!</span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <Badge variant="outline">Médico</Badge>
                      </div>
                      <h3 className="font-medium">{result.doctor?.name}</h3>
                      <p className="text-sm text-gray-600">{result.doctor?.specialty}</p>
                      <p className="text-sm text-gray-600">CRM: {result.doctor?.crm}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <Badge variant="outline">Paciente</Badge>
                      </div>
                      <h3 className="font-medium">{result.patient?.name}</h3>
                      <p className="text-sm text-gray-600">CPF: {result.patient?.cpf}</p>
                      <p className="text-sm text-gray-600">Tipo: {result.patient?.bloodType}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-4 w-4 text-purple-600" />
                        <Badge variant="outline">Prontuário</Badge>
                      </div>
                      <h3 className="font-medium">{result.record?.title}</h3>
                      <p className="text-sm text-gray-600">ID: {result.record?.id}</p>
                      <p className="text-sm text-gray-600">Criado agora</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Próximos passos:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>1. Vá para <strong>Registros Médicos</strong> no menu</li>
                    <li>2. Você deve ver o prontuário criado</li>
                    <li>3. Clique em "Ver Detalhes" para abrir o modal</li>
                    <li>4. O modal deve mostrar todos os dados médicos</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outras formas de acessar a API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="font-mono text-sm bg-gray-100 p-3 rounded">
              <strong>Via curl:</strong><br/>
              curl -X POST "http://localhost:5000/api/demo/quick-populate" \<br/>
              &nbsp;&nbsp;-H "Content-Type: application/json"
            </div>
            
            <div className="font-mono text-sm bg-gray-100 p-3 rounded">
              <strong>Via JavaScript:</strong><br/>
              fetch('/api/demo/quick-populate', &#123;<br/>
              &nbsp;&nbsp;method: 'POST',<br/>
              &nbsp;&nbsp;headers: &#123; 'Content-Type': 'application/json' &#125;<br/>
              &#125;)
            </div>

            <div className="font-mono text-sm bg-gray-100 p-3 rounded">
              <strong>Direto no navegador:</strong><br/>
              <a 
                href="/test-demo" 
                className="text-blue-600 hover:underline"
              >
                /test-demo
              </a> (esta página)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}