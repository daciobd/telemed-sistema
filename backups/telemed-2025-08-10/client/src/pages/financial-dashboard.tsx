import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  Users,
  Clock,
  FileText,
  Download,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function FinancialDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: financialData, isLoading: financialLoading } = useQuery({
    queryKey: ["/api/financial/dashboard", user?.role === 'doctor' ? user?.doctor?.id : null],
    queryFn: async () => {
      if (user?.role !== 'doctor' || !user?.doctor?.id) return null;
      const response = await fetch(`/api/financial/dashboard/${user.doctor.id}`);
      if (!response.ok) throw new Error('Failed to fetch financial data');
      return response.json();
    },
    enabled: isAuthenticated && user?.role === 'doctor' && !!user?.doctor?.id,
    retry: false,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/financial/transactions", user?.role === 'doctor' ? user?.doctor?.id : null],
    queryFn: async () => {
      if (user?.role !== 'doctor' || !user?.doctor?.id) return [];
      const response = await fetch(`/api/financial/transactions/${user.doctor.id}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: isAuthenticated && user?.role === 'doctor' && !!user?.doctor?.id,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (user?.role !== 'doctor') {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Acesso Negado
              </h3>
              <p className="text-gray-500">
                Apenas médicos podem acessar o dashboard financeiro.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'succeeded': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  // Sample data for charts (replace with real data from API)
  const monthlyEarnings = [
    { month: 'Jan', earnings: 4500 },
    { month: 'Fev', earnings: 5200 },
    { month: 'Mar', earnings: 4800 },
    { month: 'Abr', earnings: 6100 },
    { month: 'Mai', earnings: 5800 },
    { month: 'Jun', earnings: 7200 },
  ];

  const paymentMethods = [
    { name: 'Cartão de Crédito', value: 65, color: '#3b82f6' },
    { name: 'PIX', value: 30, color: '#10b981' },
    { name: 'Boleto', value: 5, color: '#f59e0b' },
  ];

  return (
    <Layout>
      <div className="p-4 lg:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600">
            Acompanhe seus ganhos, transações e estatísticas financeiras
          </p>
        </div>

        {financialLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados financeiros...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Receita Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {financialData?.totalEarnings?.toLocaleString('pt-BR') || '0,00'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12.5%</span>
                    <span className="text-gray-500 ml-1">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Este Mês</p>
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {financialData?.monthlyEarnings?.toLocaleString('pt-BR') || '0,00'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-gray-500">{financialData?.monthlyConsultations || 0} consultas</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">
                        R$ {financialData?.pendingPayments?.toLocaleString('pt-BR') || '0,00'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-gray-500">{financialData?.pendingCount || 0} transações</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {financialData?.conversionRate || '95'}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-gray-500">Pagamentos bem-sucedidos</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full lg:w-[400px] grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="transactions">Transações</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Earnings Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Receita Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyEarnings}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                          <Line 
                            type="monotone" 
                            dataKey="earnings" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Payment Methods Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Métodos de Pagamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={paymentMethods}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {paymentMethods.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Transações Recentes</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactionsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando transações...</p>
                      </div>
                    ) : transactions && transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.map((transaction: any) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Consulta #{transaction.appointmentId}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(transaction.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                R$ {transaction.amount}
                              </p>
                              <Badge className={getStatusColor(transaction.status)}>
                                {getStatusText(transaction.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma transação encontrada</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Relatório Mensal</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Resumo completo de ganhos e transações do mês
                      </p>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <FileText className="h-8 w-8 text-green-600" />
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Declaração IR</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Documento para declaração de imposto de renda
                      </p>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar PDF
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <FileText className="h-8 w-8 text-purple-600" />
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Extrato Anual</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Histórico completo de transações do ano
                      </p>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
}