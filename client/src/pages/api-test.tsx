import SafeApiTester from "@/components/SafeApiTester";

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Teste de API - TeleMed Sistema
          </h1>
          <p className="text-xl text-blue-200">
            Página dedicada para testar a API e verificar conectividade
          </p>
        </div>
        
        <SafeApiTester />
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-blue-300 hover:text-blue-100 underline text-lg"
          >
            ← Voltar para a página principal
          </a>
        </div>
      </div>
    </div>
  );
}