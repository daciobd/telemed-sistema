import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Heart, BarChart3, Calendar, Users, FileText, Pill, Settings, LogOut, Video, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUserRole = () => {
    if (!user) return "patient";
    
    // Use the role field directly from user object
    return user.role || "patient";
  };

  // Navigation items based on user role
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3, roles: ["patient", "doctor"] },
    { name: "Consultas", href: "/consultas", icon: Calendar, roles: ["patient", "doctor"] },
    { name: "Pacientes", href: "/pacientes", icon: Users, roles: ["doctor"] },
    { name: "Prontuários", href: "/prontuarios", icon: FileText, roles: ["patient", "doctor"] },
    { name: "Prescrições", href: "/prescricoes", icon: Pill, roles: ["patient", "doctor"] },
    { name: "Videoconsultas", href: "/videoconsultas", icon: Video, roles: ["patient", "doctor"] },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!user) return false;
    
    // Determine user role
    const userRole = getUserRole();
    return item.roles.includes(userRole);
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-white shadow-lg border-r border-gray-200 fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
                    onClick={() => setIsMobileMenuOpen(false)}
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
        
        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {user?.firstName?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getUserRole() === "doctor" ? "Médico" : "Paciente"}
                </p>
              </div>
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
    </>
  );
}