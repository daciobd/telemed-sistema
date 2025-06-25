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
import PsychiatryAssessment from "@/pages/psychiatry-assessment";
import PsychiatryQuestionnaire from "@/pages/psychiatry-questionnaire";
import PsychiatryPreConsultation from "@/components/psychiatry/psychiatry-pre-consultation";
import PsychologistInterviewPage from "@/pages/psychologist-interview";
import PsychologistInterviewSimple from "@/pages/psychologist-interview-simple";
import TeleconsultWorkflowPage from "@/pages/teleconsult-workflow";
import DemoManagementPage from "@/pages/demo-management";
import ImprovedLandingPage from "@/pages/landing-improved";
import WhatsAppContactPage from "@/pages/whatsapp-contact";
import MedicalEvaluationPage from "@/pages/medical-evaluation";


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
          <Route path="/consultas" component={Appointments} />
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
          <Route path="/psychiatry-assessment/:appointmentId" component={({ params }: any) => 
            <PsychiatryAssessment 
              appointmentId={parseInt(params.appointmentId)} 
              onComplete={() => window.history.back()} 
            />
          } />
          <Route path="/psychiatry-questionnaire/:appointmentId" component={({ params }: any) => 
            <PsychiatryQuestionnaire 
              appointmentId={parseInt(params.appointmentId)} 
              onComplete={() => window.history.back()} 
            />
          } />
          <Route path="/psychiatry-consultation/:appointmentId" component={({ params }: any) => 
            <PsychiatryPreConsultation 
              appointmentId={parseInt(params.appointmentId)} 
              onStartConsultation={() => window.location.href = `/videoconsulta/${params.appointmentId}`} 
            />
          } />
          <Route path="/psychologist-interview/:appointmentId" component={({ params }: any) => 
            <PsychologistInterviewSimple 
              appointmentId={parseInt(params.appointmentId)} 
            />
          } />
          <Route path="/teleconsult-workflow" component={TeleconsultWorkflowPage} />
          <Route path="/teleconsultas-psiquiatricas" component={TeleconsultWorkflowPage} />
          <Route path="/demo-management" component={DemoManagementPage} />
          <Route path="/landing-improved" component={ImprovedLandingPage} />
          <Route path="/whatsapp-contact" component={WhatsAppContactPage} />
          <Route path="/medical-evaluation/:appointmentId" component={({ params }: any) => 
            <MedicalEvaluationPage appointmentId={parseInt(params.appointmentId)} />
          } />

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
