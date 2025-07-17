import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Clock, Activity, TrendingUp, Bell, Settings, ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface HealthMetrics {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  performance: {
    response_time_ms: number;
    memory_usage: {
      heapUsed: number;
      heapTotal: number;
    };
    uptime: number;
  };
  services: Record<string, boolean>;
  errors: string[];
}

interface MetricsData {
  latest: HealthMetrics;
  history: HealthMetrics[];
  summary: {
    total_checks: number;
    healthy_percentage: string;
    average_response_time: string;
  };
}

export default function MonitoringDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testAlert, setTestAlert] = useState({
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    try {
      const response = await fetch('/api/test-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testAlert),
      });

      if (response.ok) {
        toast({
          title: "Alerta de Teste Enviado",
          description: "Verifique o Slack/Telegram para confirmar o recebimento.",
        });
        setTestAlert({ type: 'info', title: '', message: '' });
      } else {
        throw new Error('Failed to send test alert');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar alerta de teste.",
        variant: "destructive",
      });
    }
  };

  const setupExternalMonitoring = async () => {
    try {
      const response = await fetch('/api/setup-monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl: window.location.origin
        }),
      });

      if (response.ok) {
        toast({
          title: "Monitoramento Externo Configurado",
          description: "UptimeRobot e StatusCake foram configurados.",
        });
      } else {
        throw new Error('Failed to setup external monitoring');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao configurar monitoramento externo.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertCircle className="h-4 w-4" />;
      case 'unhealthy': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = metrics?.history.map(m => ({
    time: new Date(m.timestamp).toLocaleTimeString(),
    response_time: m.performance.response_time_ms,
    memory: Math.round(m.performance.memory_usage.heapUsed / 1024 / 1024),
    status: m.status === 'healthy' ? 100 : m.status === 'degraded' ? 50 : 0
  })) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoramento do Sistema</h1>
          <p className="text-muted-foreground">Dashboard de saúde e performance do TeleMed</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchMetrics} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={setupExternalMonitoring}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Config. Externa
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            {getStatusIcon(metrics?.latest.status || 'unknown')}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(metrics?.latest.status || 'unknown')}`} />
              <span className="text-2xl font-bold capitalize">{metrics?.latest.status || 'Unknown'}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Última verificação: {metrics?.latest.timestamp ? new Date(metrics.latest.timestamp).toLocaleTimeString() : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.latest.performance.response_time_ms || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Média: {metrics?.summary.average_response_time || 0}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso de Memória</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMemory(metrics?.latest.performance.memory_usage.heapUsed || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              de {formatMemory(metrics?.latest.performance.memory_usage.heapTotal || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatUptime(metrics?.latest.performance.uptime || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.summary.healthy_percentage || 0}% saudável
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="charts">Gráficos</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Checks</CardTitle>
                <CardDescription>Status das verificações críticas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {metrics?.latest.checks && Object.entries(metrics.latest.checks).map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="capitalize">{name.replace('_', ' ')}</span>
                    <Badge variant={status ? "default" : "destructive"}>
                      {status ? "OK" : "FAIL"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Serviços</CardTitle>
                <CardDescription>Status dos serviços críticos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {metrics?.latest.services && Object.entries(metrics.latest.services).map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="capitalize">{name.replace('_', ' ')}</span>
                    <Badge variant={status ? "default" : "destructive"}>
                      {status ? "ONLINE" : "OFFLINE"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {metrics?.latest.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Erros Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {metrics.latest.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="response_time" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso de Memória</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="memory" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Endpoints Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>/health</span>
                  <Badge variant="default">ONLINE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>/api/status</span>
                  <Badge variant="default">ONLINE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>/api/metrics</span>
                  <Badge variant="default">ONLINE</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monitoramento Externo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>UptimeRobot</span>
                  <Badge variant="outline">CONFIGURAR</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>StatusCake</span>
                  <Badge variant="outline">CONFIGURAR</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Slack</span>
                  <Badge variant={process.env.SLACK_BOT_TOKEN ? "default" : "outline"}>
                    {process.env.SLACK_BOT_TOKEN ? "ATIVO" : "CONFIGURAR"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Telegram</span>
                  <Badge variant="outline">CONFIGURAR</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Teste de Alertas
              </CardTitle>
              <CardDescription>
                Envie um alerta de teste para verificar as integrações do Slack/Telegram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-type">Tipo do Alerta</Label>
                  <Select value={testAlert.type} onValueChange={(value) => setTestAlert({...testAlert, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-title">Título</Label>
                  <Input
                    id="alert-title"
                    value={testAlert.title}
                    onChange={(e) => setTestAlert({...testAlert, title: e.target.value})}
                    placeholder="Título do alerta"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-message">Mensagem</Label>
                <Textarea
                  id="alert-message"
                  value={testAlert.message}
                  onChange={(e) => setTestAlert({...testAlert, message: e.target.value})}
                  placeholder="Mensagem do alerta"
                  rows={3}
                />
              </div>
              <Button onClick={sendTestAlert} className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Enviar Alerta de Teste
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração de Alertas</CardTitle>
              <CardDescription>
                Configure as integrações de monitoramento externo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Variáveis de Ambiente Necessárias:</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <div>• SLACK_BOT_TOKEN - Token do bot do Slack</div>
                  <div>• SLACK_CHANNEL_ID - ID do canal para alertas</div>
                  <div>• TELEGRAM_BOT_TOKEN - Token do bot do Telegram</div>
                  <div>• TELEGRAM_CHAT_ID - ID do chat para alertas</div>
                  <div>• UPTIMEROBOT_API_KEY - Chave da API do UptimeRobot</div>
                  <div>• STATUSCAKE_API_KEY - Chave da API do StatusCake</div>
                </div>
              </div>
              <Button onClick={setupExternalMonitoring} variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Monitoramento Externo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}