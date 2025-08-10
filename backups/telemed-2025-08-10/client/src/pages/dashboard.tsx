import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Layout from "@/components/layout/layout";
import StatsCards from "@/components/dashboard/stats-cards";
import AppointmentsList from "@/components/dashboard/appointments-list";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentPatients from "@/components/dashboard/recent-patients";
import DoctorQuickActions from "@/components/dashboard/doctor-quick-actions";
import DoctorAppointments from "@/components/dashboard/doctor-appointments";
import DoctorPatients from "@/components/dashboard/doctor-patients";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse-medical">
            <div className="text-white text-2xl">🩺</div>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-medical-blue mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Carregando TeleMed...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="p-4 lg:p-6">
        {/* BOTÕES DE TESTE TEMPORÁRIOS - MUITO VISÍVEIS */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <h3 className="text-lg font-bold text-yellow-800 mb-3">🚨 BOTÕES DE TESTE - PARA DEBUG</h3>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/test-demo'}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200 text-lg"
            >
              🧪 TEST DEMO API
            </button>
            <button 
              onClick={() => window.location.href = '/medical-records'}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200 text-lg"
            >
              📋 MEDICAL RECORDS
            </button>
          </div>
          <p className="text-yellow-700 text-sm mt-2">
            Clique nos botões acima para testar as páginas que estavam inacessíveis
          </p>
        </div>
        
        <StatsCards />
        
        <DoctorDashboardContent />
      </div>
    </Layout>
  );
}

function DoctorDashboardContent() {
  const { user } = useAuth();
  
  if (user?.role === "doctor") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DoctorAppointments />
        </div>
        
        <div className="space-y-6">
          <DoctorQuickActions />
          <DoctorPatients />
        </div>
      </div>
    );
  }
  
  // Default patient/admin view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <AppointmentsList />
      </div>
      
      <div className="space-y-6">
        <QuickActions />
        <RecentPatients />
      </div>
    </div>
  );
}
