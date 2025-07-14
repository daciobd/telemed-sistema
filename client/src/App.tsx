import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import OnboardingDemo from "@/pages/OnboardingDemo";
import OnboardingFixed from "@/pages/OnboardingFixed";
import OnboardingSuccess from "@/pages/OnboardingSuccess";
import PatientJourneyPage from "@/pages/PatientJourneyPage";
import PatientJourneyDemo from "@/pages/PatientJourneyDemo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={OnboardingSuccess} />
            <Route path="/patient-dashboard" component={OnboardingFixed} />
            <Route path="/dashboard" component={OnboardingFixed} />
            <Route path="/onboarding-demo" component={OnboardingDemo} />
            <Route path="/onboarding-fixed" component={OnboardingFixed} />
            <Route path="/success" component={OnboardingSuccess} />
            <Route path="/patient-journey/:patientId" component={PatientJourneyPage} />
            <Route path="/patient-journey-demo" component={PatientJourneyDemo} />
            
            {/* 404 fallback */}
            <Route>
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">Página não encontrada</p>
                  <p className="text-sm text-gray-500 mt-2">🔥 Onboarding System v2.0 - FUNCIONANDO</p>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;