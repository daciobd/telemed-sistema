import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Clock, Database, Share2, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PrivacySettings {
  dataRetentionPeriod: number;
  allowDataSharing: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
  allowThirdPartySharing: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  notificationPreferences: any;
}

export function PrivacySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar configurações atuais
  const { data: settings, isLoading } = useQuery<{ settings: PrivacySettings }>({
    queryKey: ["/api/security/privacy/settings"],
  });

  // State local para mudanças
  const [localSettings, setLocalSettings] = useState<Partial<PrivacySettings>>({});

  // Mutation para atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<PrivacySettings>) => {
      await apiRequest("/api/security/privacy/settings", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/privacy/settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências de privacidade foram salvas com sucesso.",
      });
      setLocalSettings({});
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar as configurações.",
        variant: "destructive",
      });
    },
  });

  const getCurrentValue = (key: keyof PrivacySettings) => {
    return localSettings[key] ?? settings?.settings[key];
  };

  const updateLocalSetting = (key: keyof PrivacySettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const hasChanges = Object.keys(localSettings).length > 0;

  const handleSave = () => {
    if (hasChanges) {
      updateSettingsMutation.mutate(localSettings);
    }
  };

  const handleReset = () => {
    setLocalSettings({});
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Configurações de Privacidade</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Configurações de Privacidade</CardTitle>
          </div>
          <CardDescription>
            Controle como seus dados são utilizados e por quanto tempo são mantidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Retenção de Dados */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <Label className="text-base font-medium">Retenção de Dados</Label>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Período de retenção (dias)</span>
                <span className="text-sm font-medium">{getCurrentValue("dataRetentionPeriod")} dias</span>
              </div>
              <Slider
                value={[getCurrentValue("dataRetentionPeriod") || 365]}
                onValueChange={([value]) => updateLocalSetting("dataRetentionPeriod", value)}
                min={30}
                max={3650}
                step={30}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Seus dados serão automaticamente removidos após este período, exceto quando exigido por lei.
              </p>
            </div>
          </div>

          {/* Timeout de Sessão */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-base font-medium">Segurança da Sessão</Label>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Timeout automático (minutos)</span>
                <span className="text-sm font-medium">{getCurrentValue("sessionTimeout")} min</span>
              </div>
              <Slider
                value={[getCurrentValue("sessionTimeout") || 30]}
                onValueChange={([value]) => updateLocalSetting("sessionTimeout", value)}
                min={5}
                max={480}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Sua sessão será encerrada automaticamente após este período de inatividade.
              </p>
            </div>
          </div>

          {/* Compartilhamento de Dados */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <Label className="text-base font-medium">Compartilhamento de Dados</Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Compartilhar dados para pesquisa médica</Label>
                  <p className="text-xs text-gray-500">
                    Permite uso anonimizado dos seus dados para pesquisas científicas
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue("allowDataSharing") || false}
                  onCheckedChange={(checked) => updateLocalSetting("allowDataSharing", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Compartilhar com terceiros</Label>
                  <p className="text-xs text-gray-500">
                    Permite compartilhamento com parceiros autorizados
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue("allowThirdPartySharing") || false}
                  onCheckedChange={(checked) => updateLocalSetting("allowThirdPartySharing", checked)}
                />
              </div>
            </div>
          </div>

          {/* Analytics e Marketing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <Label className="text-base font-medium">Analytics e Marketing</Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Permitir analytics</Label>
                  <p className="text-xs text-gray-500">
                    Ajuda a melhorar a plataforma através de análises de uso
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue("allowAnalytics") || false}
                  onCheckedChange={(checked) => updateLocalSetting("allowAnalytics", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Receber comunicações de marketing</Label>
                  <p className="text-xs text-gray-500">
                    E-mails sobre novos serviços e promoções
                  </p>
                </div>
                <Switch
                  checked={getCurrentValue("allowMarketing") || false}
                  onCheckedChange={(checked) => updateLocalSetting("allowMarketing", checked)}
                />
              </div>
            </div>
          </div>

          {/* Autenticação de Dois Fatores */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <Label className="text-base font-medium">Segurança Adicional</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Autenticação de dois fatores</Label>
                <p className="text-xs text-gray-500">
                  Adiciona uma camada extra de segurança à sua conta
                </p>
              </div>
              <Switch
                checked={getCurrentValue("twoFactorEnabled") || false}
                onCheckedChange={(checked) => updateLocalSetting("twoFactorEnabled", checked)}
              />
            </div>
          </div>

          {/* Ações */}
          {hasChanges && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                disabled={updateSettingsMutation.isPending}
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Informações de Segurança */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Segurança dos seus dados:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Todos os dados médicos são criptografados com AES-256</li>
                  <li>• Logs de auditoria registram todas as ações realizadas</li>
                  <li>• Você pode exportar ou deletar seus dados a qualquer momento</li>
                  <li>• Conformidade total com LGPD e normas médicas</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}