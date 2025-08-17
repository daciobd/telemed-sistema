import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, UserCheck } from "lucide-react";

export default function Protected({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-center text-slate-600">Verificando sua sessão...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md mx-4 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 text-center">
              Você precisa estar logado para acessar o sistema TeleMed.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium mb-2">Para desenvolvedores:</p>
              <p className="text-xs text-blue-700">
                Use as APIs de autenticação em <code>/api/auth/register</code> e <code>/api/auth/login</code>
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => setLocation('/login')}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Fazer Login
              </Button>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500">
                TeleMed - Sistema de Telemedicina
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}