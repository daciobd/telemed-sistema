import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, User, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'doctor' as 'doctor' | 'patient' | 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'register') {
        await api('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccess('Conta criada com sucesso! Agora faça login.');
        setMode('login');
      } else {
        await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });
        
        // Invalidate auth query to refresh user data
        queryClient.invalidateQueries({ queryKey: ['me'] });
        
        // Redirect to main app
        setLocation('/');
      }
    } catch (err: any) {
      const errorMsg = err.message.includes('409') ? 'Nome de usuário já existe' :
                      err.message.includes('401') ? 'Credenciais inválidas' :
                      'Erro no servidor. Tente novamente.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">TeleMed</CardTitle>
            <p className="text-slate-600 text-sm">Sistema de Telemedicina</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'login' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={mode === 'register' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setMode('register');
                setError('');
                setSuccess('');
              }}
            >
              Registrar
            </Button>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  className="pl-10"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={8}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de usuário</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'doctor' | 'patient' | 'admin') => 
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Médico</SelectItem>
                    <SelectItem value="patient">Paciente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Criar conta')}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">
              Sistema seguro com autenticação JWT e PostgreSQL
            </p>
            {mode === 'register' && (
              <p className="text-xs text-slate-600">
                A senha deve ter pelo menos 8 caracteres
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}