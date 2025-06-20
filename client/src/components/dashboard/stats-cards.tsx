import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, DollarSign, Clock, Heart } from "lucide-react";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Consultas Hoje",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      trend: "+8%",
      trendText: "vs ontem",
      trendIcon: TrendingUp,
    },
    {
      title: "Pacientes Ativos",
      value: stats?.activePatients || 0,
      icon: Users,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      trend: "+12%",
      trendText: "este mês",
      trendIcon: TrendingUp,
    },
    {
      title: "Taxa Aprovação",
      value: stats?.approvalRate || "94.2%",
      icon: Heart,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      trend: "+2.1%",
      trendText: "vs semana passada",
      trendIcon: TrendingUp,
    },
    {
      title: "Receita Mensal",
      value: stats?.monthlyRevenue || "R$ 18.4k",
      icon: DollarSign,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      trend: "-3.2%",
      trendText: "vs mês passado",
      trendIcon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        
        return (
          <Card key={index} className="bg-white shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendIcon className={`h-4 w-4 mr-1 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`font-medium ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
                <span className="text-gray-500 ml-1">{stat.trendText}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
