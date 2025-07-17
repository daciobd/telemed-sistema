import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Settings, Download, Trash2, AlertCircle } from "lucide-react";
import { ConsentManager } from "./ConsentManager";
import { PrivacySettings } from "./PrivacySettings";
import { DataExportTool } from "./DataExportTool";
import { SecurityAuditLog } from "./SecurityAuditLog";

export function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState("consent");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Segurança e Privacidade</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas configurações de privacidade e conformidade com LGPD
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Shield className="h-3 w-3 mr-1" />
          Conforme LGPD
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Consentimentos
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Meus Dados
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Auditoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consent" className="space-y-6">
          <ConsentManager />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataExportTool />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <SecurityAuditLog />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas LGPD</CardTitle>
          <CardDescription>
            Exercite seus direitos conforme a Lei Geral de Proteção de Dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveTab("data")}
            >
              <Download className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Exportar Dados</div>
                <div className="text-xs text-gray-500">Baixe todos os seus dados</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => setActiveTab("privacy")}
            >
              <Settings className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Configurar Privacidade</div>
                <div className="text-xs text-gray-500">Ajuste suas preferências</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setActiveTab("data")}
            >
              <Trash2 className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Deletar Conta</div>
                <div className="text-xs text-gray-500">Exercer direito ao esquecimento</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}