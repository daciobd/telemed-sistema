import React from "react";
import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EnhancedConsultation from "./EnhancedConsultation";
import EnhancedConsultationV3 from "./pages/EnhancedConsultationV3";
import EnhancedClone from "./pages/enhanced-clone";

// Simple components without complex imports
const SimpleToaster = () => <div id="toaster" className="fixed top-4 right-4 z-50" />;

const VideoConsultation = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Consultation</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Video consultation feature will be implemented here.</p>
      </div>
    </div>
  </div>
);

const EnhancedConsultationSimple = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Enhanced Consultation</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Enhanced consultation with AI features will be implemented here.</p>
      </div>
    </div>
  </div>
);

const AIConsolePage = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Console</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>AI console interface will be implemented here.</p>
      </div>
    </div>
  </div>
);

const DashboardTeste = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Teste</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Dashboard de testes.</p>
      </div>
    </div>
  </div>
);

const DashboardTesteRobust = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Teste Robusto</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Dashboard robusto com Chart.js.</p>
      </div>
    </div>
  </div>
);

const TelemedHub = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">TeleMed Hub</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>TeleMed Hub central.</p>
      </div>
    </div>
  </div>
);

const HealthHub = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Health Hub</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Health Hub central.</p>
      </div>
    </div>
  </div>
);

const CompleteHub = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Hub</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Complete Hub central.</p>
      </div>
    </div>
  </div>
);

const PatientManagementDashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Management</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p>Patient management dashboard.</p>
      </div>
    </div>
  </div>
);

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
              <a 
                href="/enhanced-v3"
                className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
              >
                Enhanced Consultation v3
              </a>
              <code className="block bg-gray-100 p-2 rounded text-xs text-gray-700 mt-2">
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
            {/* ROTAS CANÔNICAS */}
            <Route path="/agenda" component={() => <div>Redirecting to agenda...</div>} />
            <Route path="/consulta" component={() => <div>Redirecting to consulta...</div>} />
            <Route path="/dashboard" component={() => <div>Redirecting to dashboard...</div>} />
            
            {/* ALIASES ANTIGOS - Redirecionamentos */}
            <Route path="/enhanced" component={() => <div>Redirecting to /consulta...</div>} />
            <Route path="/enhanced-consultation" component={() => <div>Redirecting to /consulta...</div>} />
            <Route path="/enhanced-teste" component={() => <div>Redirecting to /consulta...</div>} />
            <Route path="/dashboard-teste" component={() => <div>Redirecting to /dashboard...</div>} />
            <Route path="/doctor-dashboard" component={() => <div>Redirecting to /dashboard...</div>} />
            
            {/* ROTAS REACT ESPECÍFICAS */}
            <Route path="/video-consultation" component={VideoConsultation} />
            <Route path="/enhanced-original" component={EnhancedConsultation} />
            <Route path="/enhanced-v3" component={EnhancedConsultationV3} />
            <Route path="/enhanced-clone" component={EnhancedClone} />
            <Route path="/ai-console" component={AIConsolePage} />
            <Route path="/ai-lab" component={AIConsolePage} />
            <Route path="/dashboard-teste-robust" component={DashboardTesteRobust} />
            <Route path="/telemed" component={TelemedHub} />
            <Route path="/health" component={HealthHub} />
            <Route path="/complete" component={CompleteHub} />
            <Route path="/patient-management" component={PatientManagementDashboard} />
            <Route path="/patients" component={() => <div>Patients page loading...</div>} />
            
            {/* ROOT → Redirect to /agenda */}
            <Route path="/" component={() => <div>Redirecting to agenda...</div>} />
            
            <Route>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
                  <a href="/agenda" className="text-emerald-600 hover:text-emerald-700">
                    Voltar à Agenda
                  </a>
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
        <SimpleToaster />
      </MockAuthProvider>
    </QueryClientProvider>
  );
}