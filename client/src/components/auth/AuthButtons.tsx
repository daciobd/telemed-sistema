import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export function AuthButtons() {
  const { isAuthenticated, user } = useAuth();
  const logout = useLogout();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation('/login');
  };

  const handleRegister = () => {
    setLocation('/register');
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-teal-200">
          Olá, {user?.firstName || user?.email?.split('@')[0]}
        </span>
        <Button 
          onClick={() => setLocation('/dashboard')}
          variant="outline" 
          className="text-teal-800 border-white hover:bg-white"
        >
          Dashboard
        </Button>
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="text-white hover:bg-teal-700"
        >
          Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={handleLogin}
        variant="ghost" 
        className="text-white hover:bg-teal-700 font-medium"
        size="lg"
      >
        ENTRAR
      </Button>
      <Button 
        onClick={handleRegister}
        variant="outline" 
        className="text-teal-800 border-white hover:bg-white font-medium"
        size="lg"
      >
        CADASTRAR
      </Button>
    </div>
  );
}