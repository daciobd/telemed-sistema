import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, FileText, Users, Pill, TrendingUp, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [reportType, setReportType] = useState("general");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['/api/reports', reportType, dateRange],
  });

  const { data: prescriptionStats } = useQuery({
    queryKey: ['/api/reports/prescriptions', dateRange],
  });

  const { data: appointmentStats } = useQuery({
    queryKey: ['/api/reports/appointments', dateRange],
  });

  const generateReport = () => {
    // Simulate report generation
    const reportContent = `
RELATÓRIO MÉDICO - ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}

Período: ${format(new Date(dateRange.start), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(dateRange.end), 'dd/MM/yyyy', { locale: ptBR })}

ESTATÍSTICAS GERAIS:
- Total de Consultas: ${appointmentStats?.total || 0}
- Prescrições Emitidas: ${prescriptionStats?.total || 0}
- Pacientes Atendidos: ${appointmentStats?.uniquePatients || 0}

DETALHAMENTO:
- Consultas Confirmadas: ${appointmentStats?.confirmed || 0}
- Consultas Canceladas: ${appointmentStats?.cancelled || 0}
- Taxa de Conclusão: ${appointmentStats?.completionRate || 0}%

PRESCRIÇÕES MAIS COMUNS:
${prescriptionStats?.topMedications?.map((med: any) => `- ${med.name}: ${med.count} prescrições`).join('\n') || 'Nenhuma data disponível'}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-medico-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto space-y-6">
          <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios Médicos</h1>
          <p className="text-muted-foreground">Análise detalhada da atividade médica</p>
        </div>
        <Button onClick={generateReport} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start-date">Data Inicial</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end-date">Data Final</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="report-type">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="appointments">Consultas</SelectItem>
                  <SelectItem value="prescriptions">Prescrições</SelectItem>
                  <SelectItem value="patients">Pacientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{appointmentStats?.growth || 0}% desde o último período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prescrições Emitidas</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptionStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Média de {prescriptionStats?.averagePerDay || 0} por dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentStats?.uniquePatients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pacientes atendidos no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentStats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Consultas realizadas vs agendadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Medicamentos Mais Prescritos */}
      <Card>
        <CardHeader>
          <CardTitle>Medicamentos Mais Prescritos</CardTitle>
          <CardDescription>Top 10 medicamentos no período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prescriptionStats?.topMedications?.slice(0, 10).map((medication: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{medication.count} prescrições</p>
                  <p className="text-sm text-muted-foreground">{medication.percentage}% do total</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                Nenhum dado de prescrição disponível para o período selecionado
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Consultas por Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Consultas</CardTitle>
          <CardDescription>Distribuição por status no período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{appointmentStats?.confirmed || 0}</div>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{appointmentStats?.scheduled || 0}</div>
              <p className="text-sm text-muted-foreground">Agendadas</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{appointmentStats?.completed || 0}</div>
              <p className="text-sm text-muted-foreground">Realizadas</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{appointmentStats?.cancelled || 0}</div>
              <p className="text-sm text-muted-foreground">Canceladas</p>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </main>
    </div>
  );
}