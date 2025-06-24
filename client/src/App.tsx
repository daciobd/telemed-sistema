import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import Patients from "@/pages/patients";
import MedicalRecords from "@/pages/medical-records";
import Prescriptions from "@/pages/prescriptions";
import VideoConsultation from "@/pages/video-consultation";
import Reports from "@/pages/reports";
import CalendarView from "@/pages/calendar";
import TeleconsultAuction from "@/pages/teleconsult-auction";
import AIAssistant from "@/pages/ai-assistant";
import Configuracoes from "@/pages/configuracoes";
import TestVideo from "@/pages/test-video";
import VideoTestSimple from "@/pages/video-test-simple";
import VideoDebug from "@/pages/video-debug";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/consultas" component={Appointments} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/pacientes" component={Patients} />
          <Route path="/patients" component={Patients} />
          <Route path="/prontuarios" component={MedicalRecords} />
          <Route path="/medical-records" component={MedicalRecords} />
          <Route path="/prescricoes" component={Prescriptions} />
          <Route path="/prescriptions" component={Prescriptions} />
          <Route path="/videoconsultas" component={VideoConsultation} />
          <Route path="/video-consultation" component={VideoConsultation} />
          <Route path="/relatorios" component={Reports} />
          <Route path="/reports" component={Reports} />
          <Route path="/agenda" component={CalendarView} />
          <Route path="/calendar" component={CalendarView} />
          <Route path="/leilao-teleconsulta" component={TeleconsultAuction} />
          <Route path="/teleconsult-auction" component={TeleconsultAuction} />
          <Route path="/assistente-ia" component={AIAssistant} />
          <Route path="/ai-assistant" component={AIAssistant} />
          <Route path="/configuracoes" component={Configuracoes} />
          <Route path="/settings" component={Configuracoes} />
          <Route path="/test-video" component={TestVideo} />
          <Route path="/video-test-simple" component={VideoTestSimple} />
          <Route path="/video-debug" component={VideoDebug} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
