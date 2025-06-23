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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/patients" component={Patients} />
          <Route path="/medical-records" component={MedicalRecords} />
          <Route path="/prescriptions" component={Prescriptions} />
          <Route path="/video-consultation" component={VideoConsultation} />
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
