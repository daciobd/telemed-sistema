import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Stethoscope,
  Heart,
  User,
  Settings,
  Shield,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Calendar,
  FileText,
  Pill,
  Video
} from "lucide-react";
import { useState } from 'react';

interface UnifiedLayoutProps {
  children: ReactNode;
  userType: 'doctor' | 'patient' | 'admin';
  user?: {
    name: string;
    email: string;
    avatar?: string;
    specialty?: string;
    crm?: string;
    plan?: string;
  };
  notifications?: number;
  onNavigate?: (path: string) => void;
}

export function UnifiedLayout({ 
  children, 
  userType, 
  user = { name: 'Usuário', email: 'usuario@telemed.com' },
  notifications = 0,
  onNavigate = (path) => window.location.href = path
}: UnifiedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getIcon = () => {
    switch (userType) {
      case 'doctor':
        return <Stethoscope className="h-8 w-8 text-blue-600" />;
      case 'patient':
        return <Heart className="h-8 w-8 text-green-600" />;
      case 'admin':
        return <Shield className="h-8 w-8 text-purple-600" />;
      default:
        return <User className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTitle = () => {
    switch (userType) {
      case 'doctor':
        return 'Painel Médico';
      case 'patient':
        return 'Minha Saúde';
      case 'admin':
        return 'Administração';
      default:
        return 'TeleMed Sistema';
    }
  };

  const getNavigationItems = () => {
    const commonItems = [
      { label: 'Configurações', icon: Settings, path: '/settings' },
      { label: 'Segurança & LGPD', icon: Shield, path: '/security' },
    ];

    switch (userType) {
      case 'doctor':
        return [
          { label: 'Dashboard', icon: Stethoscope, path: '/doctor-dashboard' },
          { label: 'Agenda', icon: Calendar, path: '/doctor-agenda' },
          { label: 'Pacientes', icon: User, path: '/patients' },
          { label: 'Prescrições', icon: Pill, path: '/prescriptions' },
          { label: 'Teleconsultas', icon: Video, path: '/teleconsults' },
          ...commonItems
        ];
      case 'patient':
        return [
          { label: 'Meu Dashboard', icon: Heart, path: '/patient-dashboard' },
          { label: 'Consultas', icon: Calendar, path: '/appointments' },
          { label: 'Prontuário', icon: FileText, path: '/medical-records' },
          { label: 'Receitas', icon: Pill, path: '/my-prescriptions' },
          { label: 'Videoconsultas', icon: Video, path: '/video-consultations' },
          ...commonItems
        ];
      case 'admin':
        return [
          { label: 'Dashboard Admin', icon: Shield, path: '/admin-dashboard' },
          { label: 'Médicos', icon: Stethoscope, path: '/admin/doctors' },
          { label: 'Pacientes', icon: User, path: '/admin/patients' },
          { label: 'Relatórios', icon: FileText, path: '/admin/reports' },
          ...commonItems
        ];
      default:
        return commonItems;
    }
  };

  const getUserInitials = () => {
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo e Título */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              {getIcon()}
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
                <p className="text-sm text-gray-600">{getTitle()}</p>
              </div>
            </div>

            {/* Ações do Header */}
            <div className="flex items-center gap-4">
              {/* Pesquisa */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notificações */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* Menu do Usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {user.specialty && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.specialty} {user.crm && `- CRM ${user.crm}`}
                        </p>
                      )}
                      {user.plan && (
                        <Badge variant="outline" className="w-fit">
                          {user.plan}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('/security')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Segurança & LGPD</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('/logout')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center">
                {getIcon()}
                <span className="ml-2 text-lg font-semibold">{getTitle()}</span>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {getNavigationItems().map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onNavigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <span>© 2025 TeleMed Sistema</span>
              <span className="mx-2">•</span>
              <span>Conformidade LGPD</span>
              <span className="mx-2">•</span>
              <span>Segurança Médica</span>
            </div>
            <div className="text-sm text-gray-500">
              Versão 3.0.0 - Sistema Unificado
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}