import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  login, 
  register, 
  logout, 
  apiRequest, 
  isAuthenticated, 
  getUserData,
  type AuthUser 
} from "@/lib/auth";
import { type LoginRequest, type RegisterRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Get current user info
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => isAuthenticated() ? apiRequest("/api/auth/me") : null,
    enabled: isAuthenticated(),
    retry: false,
  });

  return {
    user: user?.user || getUserData(),
    profile: user?.profile,
    isLoading,
    isAuthenticated: isAuthenticated(),
    error,
  };
}

export function useLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${data.user.firstName}!`,
      });
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      // Redirect based on user role
      if (data.user.role === "doctor") {
        setLocation("/dashboard");
      } else if (data.user.role === "patient") {
        setLocation("/patient-dashboard");
      } else {
        setLocation("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      toast({
        title: "Cadastro realizado com sucesso",
        description: `Bem-vindo ao TeleMed, ${data.user.firstName}!`,
      });
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      // Redirect based on user role
      if (data.user.role === "doctor") {
        setLocation("/dashboard");
      } else if (data.user.role === "patient") {
        setLocation("/patient-dashboard");
      } else {
        setLocation("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiRequest("/api/auth/logout", { method: "POST" });
      logout();
    },
    onSuccess: () => {
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      
      // Clear all cached data
      queryClient.clear();
      
      // Redirect to home
      setLocation("/");
    },
    onError: (error: Error) => {
      // Even if the server request fails, we can still logout locally
      logout();
      queryClient.clear();
      setLocation("/");
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    },
  });
}