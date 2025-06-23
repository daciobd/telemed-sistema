import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Heart, BarChart3, Calendar, Users, FileText, Pill, Settings, LogOut, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigation = [
    {
      name: "Visão Geral",
      href: "/",
      icon: BarChart3,
      roles: ["doctor", "patient", "admin"]
    },
    {
      name: "Agendamentos",
      href: "/appointments",
      icon: Calendar,
      roles: ["doctor", "patient", "admin"]
    },
    {
      name: "Pacientes",
      href: "/patients",
      icon: Users,
      roles: ["doctor", "admin"]
    },
    {
      name: "Prontuários",
      href: "/medical-records",
      icon: FileText,
      roles: ["doctor", "patient", "admin"]
    },
    {
      name: "Prescrições",
      href: "/prescriptions",
      icon: Pill,
      roles: ["doctor", "patient", "admin"]
    },
    {
      name: "Videoconsultas",
      href: "/videoconsultas",
      icon: Video,
      roles: ["doctor", "patient"]
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const getRoleText = (role: string) => {
    switch (role) {
      case "doctor":
        return "Médico";
      case "patient":
        return "Paciente";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 hidden lg:block">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TeleMed</h1>
            <p className="text-sm text-gray-500">Sistema</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Dashboard
          </div>
          
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </span>
              </Link>
            );
          })}
          
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">
            Sistema
          </div>
          
          <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors w-full text-left">
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </button>
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role && getRoleText(user.role)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
