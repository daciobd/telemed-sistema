import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu, Bell, ChevronDown, Stethoscope, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationsPanel from "@/components/ui/notifications-panel";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest("POST", `/api/auth/switch-role/${role}`, {});
      return response;
    },
    onSuccess: (data: any) => {
      const newRole = data?.user?.role || data?.role;
      toast({
        title: "Papel alterado",
        description: `Agora você é um ${newRole === 'doctor' ? 'médico' : 'paciente'}`,
      });
      queryClient.invalidateQueries();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: any) => {
      console.error("Role switch error:", error);
      toast({
        title: "Erro na troca de papel",
        description: error.message || "Não foi possível alterar o papel. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "doctor":
        return "Dr.";
      case "patient":
        return "";
      case "admin":
        return "Admin";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Dashboard {user?.role === "doctor" ? "Médico" : user?.role === "patient" ? "do Paciente" : ""}
            </h2>
            <p className="text-sm text-gray-500">
              {getGreeting()}, {getRoleText(user?.role || "")} {user?.firstName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationsPanel />
          
          {/* Role Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <span className="capitalize">
                  {user?.role === "doctor" ? "Visão Médico" : 
                   user?.role === "patient" ? "Visão Paciente" : 
                   user?.role === "admin" ? "Visão Admin" : ""}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Teste de Papéis</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.role !== 'doctor' && (
                <DropdownMenuItem 
                  onClick={() => switchRoleMutation.mutate('doctor')}
                  disabled={switchRoleMutation.isPending}
                >
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Testar como Médico
                </DropdownMenuItem>
              )}
              {user?.role !== 'patient' && (
                <DropdownMenuItem 
                  onClick={() => switchRoleMutation.mutate('patient')}
                  disabled={switchRoleMutation.isPending}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Testar como Paciente
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
