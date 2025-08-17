import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Consultation from "@/pages/consultation";
import ExamRequest from "@/pages/exam-request";
import EnhancedConsultation from "@/pages/enhanced-consultation";
import Login from "@/pages/login";
import PatientsPage from "@/pages/patients";
import Protected from "@/components/Protected";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <Protected><PatientsPage /></Protected>
      )} />
      <Route path="/patients" component={() => (
        <Protected><PatientsPage /></Protected>
      )} />
      <Route path="/consultation" component={() => (
        <Protected><Consultation /></Protected>
      )} />
      <Route path="/enhanced" component={() => (
        <Protected><EnhancedConsultation /></Protected>
      )} />
      <Route path="/exames" component={() => (
        <Protected><ExamRequest /></Protected>
      )} />
      <Route path="/login" component={Login} />
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
