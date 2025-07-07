import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Diagnostico() {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const diagnosticar = async () => {
      const resultados: any = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // Teste 1: Health Check
      try {
        const healthResponse = await fetch('/health');
        resultados.health = {
          status: healthResponse.status,
          data: await healthResponse.json()
        };
      } catch (error: any) {
        resultados.health = { error: error.message };
      }

      // Teste 2: Auth Status  
      try {
        const authResponse = await fetch('/api/auth/user');
        resultados.auth = {
          status: authResponse.status,
          data: authResponse.status === 200 ? await authResponse.json() : await authResponse.text()
        };
      } catch (error: any) {
        resultados.auth = { error: error.message };
      }

      // Teste 3: Test Demo API
      try {
        const testResponse = await fetch('/api/demo/quick-populate', { method: 'POST' });
        resultados.testDemo = {
          status: testResponse.status,
          data: testResponse.status === 200 ? await testResponse.json() : await testResponse.text()
        };
      } catch (error: any) {
        resultados.testDemo = { error: error.message };
      }

      // Teste 4: Medical Records API
      try {
        const recordsResponse = await fetch('/api/medical-records');
        resultados.medicalRecords = {
          status: recordsResponse.status,
          data: recordsResponse.status === 200 ? await recordsResponse.json() : await recordsResponse.text()
        };
      } catch (error: any) {
        resultados.medicalRecords = { error: error.message };
      }

      setStatus(resultados);
      setLoading(false);
    };

    diagnosticar();
  }, []);

  const testarNavegacao = (url: string) => {
    console.log(`🔗 Navegando para: ${url}`);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔧 DIAGNÓSTICO COMPLETO - TELEMED
          </h1>
          <p className="text-blue-200 text-lg">
            Verificação detalhada de todos os sistemas
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Executando diagnóstico...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Botões de Teste */}
            <Card className="bg-yellow-400/20 border-yellow-300">
              <CardHeader>
                <CardTitle className="text-yellow-100">🧪 TESTES DE NAVEGAÇÃO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => testarNavegacao('/test-demo')}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto"
                  >
                    🧪 Test Demo<br/>
                    <small>/test-demo</small>
                  </Button>
                  <Button 
                    onClick={() => testarNavegacao('/medical-records')}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 h-auto"
                  >
                    📋 Medical Records<br/>
                    <small>/medical-records</small>
                  </Button>
                  <Button 
                    onClick={() => testarNavegacao('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto"
                  >
                    🏠 Home<br/>
                    <small>/</small>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultados dos Testes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(status).map(([key, value]: [string, any]) => (
                <Card key={key} className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white capitalize">
                      {key === 'health' && '🔥 Health Check'}
                      {key === 'auth' && '🔐 Authentication'}
                      {key === 'testDemo' && '🧪 Test Demo API'}
                      {key === 'medicalRecords' && '📋 Medical Records API'}
                      {!['health', 'auth', 'testDemo', 'medicalRecords'].includes(key) && `📊 ${key}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-white text-sm bg-black/30 p-3 rounded overflow-auto max-h-40">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Informações do Sistema */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">📊 RESUMO DIAGNÓSTICO</CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold mb-2">✅ Status dos Serviços:</h4>
                    <ul>
                      <li>• Servidor: {status.health?.status === 200 ? '✅ Online' : '❌ Offline'}</li>
                      <li>• Auth: {status.auth?.status === 401 ? '⚠️ Não logado' : status.auth?.status === 200 ? '✅ Logado' : '❌ Erro'}</li>
                      <li>• Test Demo: {status.testDemo?.status ? (status.testDemo.status === 200 ? '✅ OK' : '⚠️ Precisa auth') : '❌ Erro'}</li>
                      <li>• Records: {status.medicalRecords?.status ? (status.medicalRecords.status === 200 ? '✅ OK' : '⚠️ Precisa auth') : '❌ Erro'}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">🔗 Links Diretos:</h4>
                    <ul className="text-blue-200">
                      <li>• <code>http://localhost:5000/test-demo</code></li>
                      <li>• <code>http://localhost:5000/medical-records</code></li>
                      <li>• <code>http://localhost:5000/api/login</code></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}