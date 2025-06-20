import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, Bell, ChevronDown } from "lucide-react";
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

export default function Header() {
  const { user } = useAuth();
  
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
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
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
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500"
              >
                3
              </Badge>
            </Button>
          </div>
          
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
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
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
