import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Shield, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ConsentTemplate {
  title: string;
  description: string;
  purpose: string;
  legalBasis: string;
  required: boolean;
}

interface ConsentStatus {
  isCompliant: boolean;
  missingConsents: string[];
  expiredConsents: string[];
  validConsents: string[];
}

export function ConsentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar templates de consentimento
  const { data: templates } = useQuery({
    queryKey: ["/api/security/lgpd/consent-templates"],
  });

  // Buscar status dos consentimentos
  const { data: consentStatus, isLoading } = useQuery<{ compliance: ConsentStatus }>({
    queryKey: ["/api/security/lgpd/consent-status"],
  });

  // Mutation para atualizar consentimento
  const updateConsentMutation = useMutation({
    mutationFn: async (data: { consentType: string; granted: boolean }) => {
      await apiRequest("/api/security/lgpd/consent", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/lgpd/consent-status"] });
      toast({
        title: "Consentimento atualizado",
        description: "Suas preferências foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o consentimento.",
        variant: "destructive",
      });
    },
  });

  const handleConsentToggle = (consentType: string, granted: boolean) => {
    updateConsentMutation.mutate({ consentType, granted });
  };

  const getComplianceStatus = () => {
    if (!consentStatus?.compliance) return null;

    const { isCompliant, missingConsents, expiredConsents } = consentStatus.compliance;

    if (isCompliant) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Conforme com LGPD</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-amber-600">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">
          {missingConsents.length > 0 && `${missingConsents.length} consentimento(s) pendente(s)`}
          {expiredConsents.length > 0 && ` ${expiredConsents.length} consentimento(s) expirado(s)`}
        </span>
      </div>
    );
  };

  const isConsentGranted = (consentType: string): boolean => {
    return consentStatus?.compliance.validConsents.includes(consentType) || false;
  };

  const isConsentRequired = (consentType: string): boolean => {
    return templates?.templates[consentType]?.required || false;
  };

  const isConsentMissing = (consentType: string): boolean => {
    return consentStatus?.compliance.missingConsents.includes(consentType) || false;
  };

  const isConsentExpired = (consentType: string): boolean => {
    return consentStatus?.compliance.expiredConsents.includes(consentType) || false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Gerenciamento de Consentimentos</CardTitle>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Gerenciamento de Consentimentos LGPD</CardTitle>
            </div>
            {getComplianceStatus()}
          </div>
          <CardDescription>
            Gerencie suas preferências de privacidade e consentimentos conforme a Lei Geral de Proteção de Dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {templates?.templates && Object.entries(templates.templates).map(([type, template]: [string, ConsentTemplate]) => (
            <div key={type} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{template.title}</h3>
                    {template.required && (
                      <Badge variant="destructive" className="text-xs">
                        Obrigatório
                      </Badge>
                    )}
                    {isConsentMissing(type) && (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-600">
                        Pendente
                      </Badge>
                    )}
                    {isConsentExpired(type) && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        Expirado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700">
                      Ver detalhes da finalidade
                    </summary>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p><strong>Finalidade:</strong> {template.purpose}</p>
                      <p><strong>Base legal:</strong> {template.legalBasis}</p>
                    </div>
                  </details>
                </div>
                <div className="ml-4">
                  <Switch
                    checked={isConsentGranted(type)}
                    onCheckedChange={(checked) => handleConsentToggle(type, checked)}
                    disabled={updateConsentMutation.isPending}
                  />
                </div>
              </div>
              <Separator />
            </div>
          ))}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informações importantes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Consentimentos obrigatórios são necessários para o funcionamento da plataforma</li>
                  <li>• Você pode revogar consentimentos não obrigatórios a qualquer momento</li>
                  <li>• Consentimentos são válidos por 24 meses e podem ser renovados</li>
                  <li>• Seus dados são protegidos com criptografia de nível médico</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}