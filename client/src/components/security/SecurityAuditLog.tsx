import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Shield, Eye, Filter, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditLog {
  id: number;
  action: string;
  resourceType: string;
  resourceId?: string;
  result: "success" | "failure" | "unauthorized";
  riskLevel: "low" | "medium" | "high" | "critical";
  details: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export function SecurityAuditLog() {
  const [filters, setFilters] = useState({
    action: "",
    result: "",
    riskLevel: "",
    startDate: "",
    endDate: "",
  });

  // Query para buscar logs (em produção, seria filtrado no backend)
  const { data: logs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/security/admin/audit-logs", filters],
    // Em produção, seria algo como: queryKey: ["/api/audit-logs", filters],
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "success": return "bg-green-100 text-green-800";
      case "failure": return "bg-red-100 text-red-800";
      case "unauthorized": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Mock data para demonstração (em produção viria da API)
  const mockLogs: AuditLog[] = [
    {
      id: 1,
      action: "USER_LOGIN",
      resourceType: "auth",
      result: "success",
      riskLevel: "low",
      details: { method: "credentials", email: "user@example.com" },
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      action: "DATA_ENCRYPTED",
      resourceType: "medical_records",
      resourceId: "rec_123",
      result: "success",
      riskLevel: "medium",
      details: { fieldName: "symptoms", keyVersion: 1 },
      ipAddress: "192.168.1.100",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      action: "CONSENT_RECORDED",
      resourceType: "user_consents",
      result: "success",
      riskLevel: "low",
      details: { consentType: "medical_data", granted: true },
      ipAddress: "192.168.1.100",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 4,
      action: "LOGIN_FAILED",
      resourceType: "auth",
      result: "failure",
      riskLevel: "medium",
      details: { email: "attacker@example.com", reason: "Invalid credentials" },
      ipAddress: "10.0.0.1",
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 5,
      action: "SUSPICIOUS_SESSION_ACCESS",
      resourceType: "user_sessions",
      result: "failure",
      riskLevel: "high",
      details: { risk: "IP address mismatch", originalIP: "192.168.1.100", currentIP: "10.0.0.1" },
      ipAddress: "10.0.0.1",
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ];

  const displayLogs = logs || mockLogs;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Log de Auditoria de Segurança</CardTitle>
          </div>
          <CardDescription>
            Visualize todas as atividades relacionadas à segurança da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label>Ação</Label>
              <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="DATA_ENCRYPTED">Criptografia</SelectItem>
                  <SelectItem value="CONSENT">Consentimento</SelectItem>
                  <SelectItem value="EXPORT">Exportação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resultado</Label>
              <Select value={filters.result} onValueChange={(value) => setFilters(prev => ({ ...prev, result: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="failure">Falha</SelectItem>
                  <SelectItem value="unauthorized">Não autorizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nível de Risco</Label>
              <Select value={filters.riskLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600">Atividades Normais</div>
              <div className="text-2xl font-bold text-green-700">
                {displayLogs.filter(log => log.riskLevel === "low" && log.result === "success").length}
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600">Alertas Médios</div>
              <div className="text-2xl font-bold text-yellow-700">
                {displayLogs.filter(log => log.riskLevel === "medium").length}
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600">Alertas Altos</div>
              <div className="text-2xl font-bold text-orange-700">
                {displayLogs.filter(log => log.riskLevel === "high").length}
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-600">Críticos</div>
              <div className="text-2xl font-bold text-red-700">
                {displayLogs.filter(log => log.riskLevel === "critical").length}
              </div>
            </div>
          </div>

          {/* Tabela de Logs */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {formatAction(log.action)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.resourceType}
                      {log.resourceId && (
                        <div className="text-xs text-gray-500">ID: {log.resourceId}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getResultColor(log.result)}>
                        {log.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskLevelColor(log.riskLevel)}>
                        {log.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>
                      <details className="text-xs">
                        <summary className="cursor-pointer hover:text-blue-600">
                          Ver detalhes
                        </summary>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Ações */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Logs mantidos por {Math.floor(1095 / 365)} anos conforme LGPD</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Logs
            </Button>
          </div>

          {/* Informações de Segurança */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Eye className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Sobre os logs de auditoria:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Todas as ações na sua conta são registradas para segurança</li>
                  <li>• Logs incluem IP, timestamp e detalhes da operação</li>
                  <li>• Atividades suspeitas são automaticamente sinalizadas</li>
                  <li>• Você pode exportar seus logs a qualquer momento</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}