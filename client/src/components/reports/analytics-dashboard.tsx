import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Calendar,
  Users,
  Activity,
  TrendingUp,
  Clock,
  FileText,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [period, setPeriod] = useState('month');
  const [specialty, setSpecialty] = useState('all');

  // Analytics queries
  const { data: overviewStats, isLoading: loadingOverview } = useQuery({
    queryKey: ['/api/analytics/overview', period, specialty, dateRange],
    enabled: !!dateRange.from && !!dateRange.to
  });

  const { data: appointmentsTrend, isLoading: loadingTrend } = useQuery({
    queryKey: ['/api/analytics/appointments-trend', period, dateRange],
    enabled: !!dateRange.from && !!dateRange.to
  });

  const { data: patientDemographics, isLoading: loadingDemographics } = useQuery({
    queryKey: ['/api/analytics/patient-demographics', period, dateRange],
    enabled: !!dateRange.from && !!dateRange.to
  });

  const { data: prescriptionStats, isLoading: loadingPrescriptions } = useQuery({
    queryKey: ['/api/analytics/prescriptions', period, dateRange],
    enabled: !!dateRange.from && !!dateRange.to
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const exportReport = async () => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period,
          specialty,
          dateRange,
          type: 'analytics'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {format(dateRange.from, 'dd/MM')} - {format(dateRange.to, 'dd/MM')}
            </Button>
          </div>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Especialidades</SelectItem>
              <SelectItem value="cardiology">Cardiologia</SelectItem>
              <SelectItem value="dermatology">Dermatologia</SelectItem>
              <SelectItem value="pediatrics">Pediatria</SelectItem>
              <SelectItem value="psychiatry">Psiquiatria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportReport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingOverview ? '...' : overviewStats?.totalAppointments || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overviewStats?.appointmentsGrowth > 0 ? '+' : ''}{overviewStats?.appointmentsGrowth || 0}% desde o período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingOverview ? '...' : overviewStats?.activePatients || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overviewStats?.patientsGrowth > 0 ? '+' : ''}{overviewStats?.patientsGrowth || 0}% desde o período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingOverview ? '...' : `${overviewStats?.occupancyRate || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Média de horários ocupados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingOverview ? '...' : `R$ ${(overviewStats?.revenue || 0).toLocaleString('pt-BR')}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {overviewStats?.revenueGrowth > 0 ? '+' : ''}{overviewStats?.revenueGrowth || 0}% desde o período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {loadingTrend ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <AreaChart data={appointmentsTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Tempo Médio de Consulta</span>
              </div>
              <Badge variant="secondary">
                {overviewStats?.avgConsultationTime || '0'} min
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Taxa de No-Show</span>
              </div>
              <Badge variant={overviewStats?.noShowRate > 10 ? "destructive" : "secondary"}>
                {overviewStats?.noShowRate || 0}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Satisfação do Paciente</span>
              </div>
              <Badge variant="secondary">
                {overviewStats?.patientSatisfaction || 0}/5
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Prescrições Digitais</span>
              </div>
              <Badge variant="secondary">
                {overviewStats?.digitalPrescriptions || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overviewStats?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {format(new Date(activity.timestamp), 'HH:mm')}
                </Badge>
              </div>
            )) || (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma atividade recente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}