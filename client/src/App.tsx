import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import VideoConsultation from "@/pages/video-consultation";
import EnhancedConsultation from "@/pages/enhanced-consultation";
import AIConsolePage from "@/pages/ai-console";
import DashboardTeste from "@/pages/dashboard-teste";
import DashboardTesteRobust from "@/pages/dashboard-teste-robust";
import TelemedHub from "@/pages/TelemedHub";
import HealthHub from "@/pages/HealthHub";
import CompleteHub from "@/pages/CompleteHub";

// Mock auth context for demo mode
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockUser = {
    id: "demo-user",
    email: "demo@telemed.com",
    firstName: "Demo",
    lastName: "User",
    role: "patient" as const
  };

  return (
    <div data-mock-auth="true" data-user={JSON.stringify(mockUser)}>
      {children}
    </div>
  );
};

// Query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount < 2) return true;
        return false;
      }
    }
  }
});

// Simple landing page component
function LandingPage() {
  const handleNavigateToVideo = () => {
    window.location.href = '/video-consultation?consultationId=demo';
  };
  
  const handleNavigateToEnhanced = () => {
    window.location.href = '/enhanced-consultation?consultationId=demo';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">TeleMed Sistema</span>
            </div>
            <button 
              onClick={handleNavigateToVideo}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              Demo VideoConsultation
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            TeleMed Sistema
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma de telemedicina com foco em performance e acessibilidade
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">VideoConsultation Pilot</h3>
              <p className="text-gray-600 mb-4">
                Piloto otimizado com React performance patterns
              </p>
              <button 
                onClick={handleNavigateToVideo}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors mb-2"
              >
                Testar VideoConsultation
              </button>
              <code className="block bg-gray-100 p-2 rounded text-xs text-gray-700">
                ./scripts/perf-video.sh
              </code>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">EnhancedConsultation</h3>
              <p className="text-gray-600 mb-4">
                Trilho A - lazy loading, memo, virtualizacao
              </p>
              <button 
                onClick={handleNavigateToEnhanced}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-2"
              >
                Testar EnhancedConsultation
              </button>
              <code className="block bg-gray-100 p-2 rounded text-xs text-gray-700">
                ./scripts/perf-enhanced.sh
              </code>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">ChatGPT Agent Console</h3>
              <p className="text-gray-600 mb-4">
                Interface para interagir com o ChatGPT Agent
              </p>
              <a 
                href="/ai-console"
                className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center mb-2"
              >
                Acessar AI Console
              </a>
              <code className="block bg-gray-100 p-2 rounded text-xs text-gray-700">
                /api/ai-agent/*
              </code>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Teste</h3>
              <p className="text-gray-600 mb-4">
                Dashboard médico completo com gráficos, KPIs e análises em tempo real
              </p>
              <a 
                href="/dashboard-teste"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center mb-2"
              >
                Acessar Dashboard Teste
              </a>
              <a 
                href="/dashboard-teste-robust"
                className="block w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-center mb-2"
              >
                Dashboard Teste Robusto (Chart.js + ResizeObserver)
              </a>
              <code className="block bg-gray-100 p-2 rounded text-xs text-gray-700">
                Chart.js + Analytics + ResizeObserver
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  console.log("🚀 TeleMed Landing Page carregada com sucesso");

  return (
    <QueryClientProvider client={queryClient}>
      <MockAuthProvider>
        <Router>
          <Switch>
            <Route path="/video-consultation" component={VideoConsultation} />
            <Route path="/enhanced-consultation" component={EnhancedConsultation} />
            <Route path="/ai-console" component={AIConsolePage} />
            <Route path="/ai-lab" component={AIConsolePage} />
            <Route path="/dashboard-teste" component={DashboardTeste} />
            <Route path="/dashboard-teste-robust" component={DashboardTesteRobust} />
            <Route path="/telemed" component={TelemedHub} />
            <Route path="/health" component={HealthHub} />
            <Route path="/complete" component={CompleteHub} />
            <Route path="/patients" component={() => import("@/pages/health-connect/patients")} />
            <Route path="/" component={LandingPage} />
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
                  <a href="/" className="text-emerald-600 hover:text-emerald-700">
                    Voltar ao início
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
        <Toaster />
      </MockAuthProvider>
    </QueryClientProvider>
  );
}