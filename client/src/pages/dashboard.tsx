import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <StatsCards />
          
          <DoctorDashboardContent />
        </div>
      </main>
    </div>
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
