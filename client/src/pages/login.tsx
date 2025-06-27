import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro no login");
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema de telemedicina.",
      });

      // Redirect to dashboard
      setLocation("/");
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erro no login",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType: 'doctor' | 'patient') => {
    setIsLoading(true);
    try {
      const demoCredentials = {
        doctor: { email: "medico@demo.com", password: "demo123" },
        patient: { email: "paciente@demo.com", password: "demo123" }
      };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demoCredentials[userType]),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro no login");
      }

      toast({
        title: `Login demo ${userType === 'doctor' ? 'médico' : 'paciente'} realizado!`,
        description: "Explorando o sistema em modo demonstração.",
      });

      setLocation("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Telemed Sistema</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Entrar no Sistema</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Sua senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </Form>

            {/* Demo Buttons */}
            <div className="mt-6 space-y-3">
              <div className="text-center text-sm text-gray-600 mb-3">
                Ou acesse com conta demo:
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('doctor')}
                disabled={isLoading}
              >
                Entrar como Médico Demo
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin('patient')}
                disabled={isLoading}
              >
                Entrar como Paciente Demo
              </Button>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Não tem uma conta? </span>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setLocation("/register")}
              >
                Cadastre-se aqui
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Telemed Sistema. Sistema seguro de telemedicina.</p>
        </div>
      </div>
    </div>
  );
}