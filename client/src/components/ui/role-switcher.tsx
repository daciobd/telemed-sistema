import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { UserCircle, Stethoscope, Users } from "lucide-react";

export default function RoleSwitcher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest("POST", `/api/auth/switch-role/${role}`, {});
      return response;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Papel alterado",
        description: `Agora você é um ${data.user.role === 'doctor' ? 'médico' : 'paciente'}`,
      });
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
      // Refresh the page to update the interface
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o papel",
        variant: "destructive",
      });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "doctor": return <Stethoscope className="h-4 w-4" />;
      case "admin": return <Users className="h-4 w-4" />;
      default: return <UserCircle className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor": return "bg-blue-100 text-blue-800";
      case "admin": return "bg-purple-100 text-purple-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "doctor": return "Médico";
      case "admin": return "Admin";
      default: return "Paciente";
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Badge className={`${getRoleColor(user?.role || 'patient')} flex items-center space-x-1`}>
        {getRoleIcon(user?.role || 'patient')}
        <span>{getRoleLabel(user?.role || 'patient')}</span>
      </Badge>
      
      <div className="flex space-x-2">
        {user?.role !== 'doctor' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => switchRoleMutation.mutate('doctor')}
            disabled={switchRoleMutation.isPending}
            className="text-xs"
          >
            <Stethoscope className="h-3 w-3 mr-1" />
            Testar como Médico
          </Button>
        )}
        
        {user?.role !== 'patient' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => switchRoleMutation.mutate('patient')}
            disabled={switchRoleMutation.isPending}
            className="text-xs"
          >
            <UserCircle className="h-3 w-3 mr-1" />
            Testar como Paciente
          </Button>
        )}
      </div>
    </div>
  );
}