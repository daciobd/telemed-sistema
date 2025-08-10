import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, DollarSign, Clock, Heart, FileText, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function StatsCards() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-enhanced skeleton">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl"></div>
              </div>
              <div className="mt-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatsCards = () => {
    if (user?.role === "patient") {
      return [
        {
          title: "Próximas Consultas",
          value: stats?.upcomingAppointments || 0,
          icon: Calendar,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
          trend: "",
          trendText: "agendadas",
          trendIcon: TrendingUp,
        },
        {
          title: "Consultas Realizadas",
          value: stats?.totalAppointments || 0,
          icon: FileText,
          iconColor: "text-green-600",
          iconBg: "bg-green-100",
          trend: "",
          trendText: "histórico",
          trendIcon: TrendingUp,
        },
      ];
    } else if (user?.role === "doctor") {
      return [
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
          title: "Pacientes Atendidos",
          value: stats?.totalPatients || 0,
          icon: Users,
          iconColor: "text-green-600",
          iconBg: "bg-green-100",
          trend: "+12%",
          trendText: "este mês",
          trendIcon: TrendingUp,
        },
      ];
    } else if (user?.role === "admin") {
      return [
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
    }
    return [];
  };

  const statsCards = getStatsCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        
        return (
          <Card 
            key={index} 
            className="card-enhanced hover-lift hover-glow group cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 relative overflow-hidden">
              {/* Gradient overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-medical-blue transition-colors">
                    {stat.value}
                  </p>
                </div>
                
                <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <Icon className={`h-7 w-7 ${stat.iconColor} group-hover:scale-110 transition-transform`} />
                </div>
              </div>
              
              {stat.trend && (
                <div className="mt-4 flex items-center text-sm relative z-10">
                  <div className={`flex items-center px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100' : 'bg-red-100'}`}>
                    <TrendIcon className={`h-4 w-4 mr-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`font-semibold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <span className="text-gray-500 ml-2 font-medium">{stat.trendText}</span>
                </div>
              )}
              
              {!stat.trend && (
                <div className="mt-4 flex items-center text-sm relative z-10">
                  <div className="px-3 py-1 bg-blue-50 rounded-full">
                    <span className="text-blue-700 font-medium">{stat.trendText}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
