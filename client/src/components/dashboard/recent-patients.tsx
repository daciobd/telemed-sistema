import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ChevronRight } from "lucide-react";

export default function RecentPatients() {
  const { data: patients, isLoading } = useQuery({
    queryKey: ["/api/patients"],
    retry: false,
  });

  const recentPatients = patients?.slice(0, 3) || [];

  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Pacientes Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3 p-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentPatients.length > 0 ? (
          <div className="space-y-3">
            {recentPatients.map((patient: any) => (
              <div
                key={patient.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {patient.user?.firstName} {patient.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Último contato: {patient.createdAt ? "Recente" : "Sem registros"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhum paciente encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
