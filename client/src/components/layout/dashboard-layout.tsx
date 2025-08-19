import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  FileText, 
  Pills, 
  Video, 
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import WelcomeModal from '@/components/onboarding/welcome-modal';
import GuidedTour from '@/components/onboarding/guided-tour';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    tourTarget: 'dashboard'
  },
  { 
    id: 'appointments', 
    label: 'Consultas', 
    href: '/appointments', 
    icon: Calendar,
    tourTarget: 'appointments'
  },
  { 
    id: 'patients', 
    label: 'Pacientes', 
    href: '/patients', 
    icon: Users,
    tourTarget: 'patients'
  },
  { 
    id: 'medical-records', 
    label: 'Prontuário', 
    href: '/medical-records', 
    icon: FileText,
    tourTarget: 'medical-records'
  },
  { 
    id: 'prescriptions', 
    label: 'Prescrições', 
    href: '/prescriptions', 
    icon: Pills,
    tourTarget: 'prescriptions'
  },
  { 
    id: 'video-consultation', 
    label: 'Videoconsultas', 
    href: '/consulta', 
    icon: Video,
    tourTarget: 'video-consultation'
  },
  { 
    id: 'reports', 
    label: 'Relatórios', 
    href: '/reports', 
    icon: BarChart3,
    tourTarget: 'reports'
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const {
    isWelcomeModalVisible,
    isTourActive,
    startTour,
    skipWelcome,
    completeTour,
    skipTour,
    resetOnboarding,
    userType,
    userName
  } = useOnboarding();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Modal */}
      <WelcomeModal
        isVisible={isWelcomeModalVisible}
        onStartTour={startTour}
        onSkipTour={skipWelcome}
        userType={userType || 'patient'}
        userName={userName}
      />

      {/* Guided Tour */}
      <GuidedTour
        isVisible={isTourActive}
        onComplete={completeTour}
        onSkip={skipTour}
        userType={userType || 'patient'}
      />

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TeleMed</span>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {userName || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userType === 'doctor' ? 'Médico' : 'Paciente'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.id} href={item.href}>
                  <a
                    data-tour={item.tourTarget}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetOnboarding}
              className="w-full justify-start text-gray-600"
              data-tour="help"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Repetir Tour
            </Button>
            
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600"
                data-tour="settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-6">
          <div data-tour="main-content">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}