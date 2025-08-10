import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  TestTube, 
  Activity, 
  Database, 
  Code, 
  FileText, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from "lucide-react";

// Componente que replica funcionalidades dos arquivos HTML legacy
export default function LegacyDemoPage() {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Replicar funcionalidade do demo-vs-real.html
  const testDemoAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-demo-safe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      const result = await response.json();
      setTestResults(prev => ({ ...prev, demo: result }));
      
      toast({
        title: "Demo API Testado",
        description: response.ok ? "API demo funcionando corretamente" : "Erro na API demo",
        variant: response.ok ? "default" : "destructive"
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, demo: { error: 'Falha na conexão' } }));
      toast({
        title: "Erro",
        description: "Falha ao testar API demo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Replicar funcionalidade de health check
  const testHealthCheck = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/health');
      const result = await response.json();
      setTestResults(prev => ({ ...prev, health: result }));
      
      toast({
        title: "Health Check",
        description: `Sistema ${result.status}`,
        variant: result.status === 'healthy' ? "default" : "destructive"
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, health: { error: 'Indisponível' } }));
    } finally {
      setIsLoading(false);
    }
  };

  // Replicar funcionalidade de status completo
  const testFullStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/status');
      const result = await response.json();
      setTestResults(prev => ({ ...prev, status: result }));
      
      toast({
        title: "Status Completo",
        description: `Sistema ${result.status} - ${result.performance?.response_time_ms || 0}ms`,
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, status: { error: 'Falha no status' } }));
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-test similar ao HTML original
  useEffect(() => {
    const timer = setTimeout(() => {
      testHealthCheck();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const testActions = [
    {
      id: 'demo',
      title: 'Demo API',
      description: 'Testa endpoint de demonstração seguro',
      icon: TestTube,
      action: testDemoAPI,
      color: 'text-blue-600'
    },
    {
      id: 'health',
      title: 'Health Check',
      description: 'Verifica saúde básica do sistema',
      icon: Activity,
      action: testHealthCheck,
      color: 'text-green-600'
    },
    {
      id: 'status',
      title: 'Status Completo',
      description: 'Análise detalhada do sistema',
      icon: Database,
      action: testFullStatus,
      color: 'text-purple-600'
    }
  ];

  const getResultStatus = (result: any) => {
    if (!result) return { status: 'pending', icon: Clock, color: 'text-gray-500' };
    if (result.error) return { status: 'error', icon: AlertCircle, color: 'text-red-500' };
    return { status: 'success', icon: CheckCircle, color: 'text-green-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Code className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">TeleMed Legacy Demo</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Interface unificada para testes e demonstrações do sistema
          </p>
          <Badge variant="outline" className="text-sm">
            Migrado de HTML para React • v8.3.0
          </Badge>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Testes de API</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            {/* Test Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testActions.map((test) => {
                const result = testResults[test.id];
                const resultStatus = getResultStatus(result);
                
                return (
                  <Card key={test.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <test.icon className={`h-5 w-5 ${test.color}`} />
                          {test.title}
                        </div>
                        <resultStatus.icon className={`h-5 w-5 ${resultStatus.color}`} />
                      </CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={test.action}
                        disabled={isLoading}
                        className="w-full"
                        variant="outline"
                      >
                        {isLoading ? (
                          <>
                            <Zap className="h-4 w-4 mr-2 animate-spin" />
                            Testando...
                          </>
                        ) : (
                          <>
                            <test.icon className="h-4 w-4 mr-2" />
                            Executar Teste
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Navegação para outras seções do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" asChild>
                  <a href="/dashboard">
                    <Activity className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/monitoring">
                    <Database className="h-4 w-4 mr-2" />
                    Monitoramento
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/security">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Segurança
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/medical-pro">
                    <FileText className="h-4 w-4 mr-2" />
                    Dashboard Médico
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resultados dos Testes</CardTitle>
                <CardDescription>
                  Dados retornados pelos endpoints testados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(testResults).map(([key, result]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2 capitalize">{key} Test Result:</h4>
                      <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-64">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  ))}
                  
                  {Object.keys(testResults).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Execute os testes acima para ver os resultados aqui
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentação de Migração</CardTitle>
                <CardDescription>
                  Como os arquivos HTML legacy foram integrados ao React
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Arquivos HTML Migrados:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><code>medical-dashboard-pro.html</code> → <code>/medical-pro</code></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><code>demo-vs-real.html</code> → <code>/legacy-demo</code></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span><code>index.html</code> → Integrado ao Vite</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Benefícios da Migração:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Componentes reutilizáveis com React</li>
                    <li>• State management unificado</li>
                    <li>• TypeScript para type safety</li>
                    <li>• Hot reload durante desenvolvimento</li>
                    <li>• Otimização de build com Vite</li>
                    <li>• Componentização com shadcn/ui</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button variant="outline" asChild>
                    <a href="https://github.com/your-repo/telemed" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Repositório
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}