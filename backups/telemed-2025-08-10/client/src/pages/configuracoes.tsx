import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";
import { PopulateMedicalRecords } from "@/components/PopulateMedicalRecords";

export default function Configuracoes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas configurações de perfil foram salvas com sucesso.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Segurança atualizada",
      description: "Suas configurações de segurança foram alteradas.",
    });
  };

  const getUserRole = () => {
    if (!user) return "paciente";
    return user.role || "paciente";
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações do sistema</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {getUserRole() === "doctor" ? "Médico" : "Paciente"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  defaultValue={user?.firstName || ""}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  defaultValue={user?.lastName || ""}
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              Salvar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você quer receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-gray-500">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-gray-500">
                  Receba resumos e alertas por email
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes de Consulta</Label>
                <p className="text-sm text-gray-500">
                  Alertas antes das consultas
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full">
              Salvar Notificações
            </Button>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Digite sua senha atual"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Digite a nova senha"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação de Dois Fatores</Label>
                <p className="text-sm text-gray-500">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>

            <Button onClick={handleSaveSecurity} className="w-full">
              Atualizar Segurança
            </Button>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a interface do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-sm text-gray-500">
                  Ative o tema escuro para a interface
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Idioma</Label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Fuso Horário</Label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="America/New_York">Nova York (GMT-5)</option>
                <option value="Europe/London">Londres (GMT+0)</option>
              </select>
            </div>

            <Button className="w-full">
              Salvar Aparência
            </Button>
          </CardContent>
        </Card>

        {/* Dados de Demonstração - Apenas para médicos */}
        {getUserRole() === 'doctor' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dados de Demonstração
              </CardTitle>
              <CardDescription>
                Popule o sistema com prontuários médicos realistas para demonstração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PopulateMedicalRecords />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
          <CardDescription>
            Detalhes sobre sua conta e o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">ID do Usuário</p>
              <p className="text-sm text-gray-900">{user?.id || "N/A"}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Tipo de Conta</p>
              <Badge variant={getUserRole() === "doctor" ? "default" : "secondary"}>
                {getUserRole() === "doctor" ? "Médico" : "Paciente"}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Último Acesso</p>
              <p className="text-sm text-gray-900">Agora</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}