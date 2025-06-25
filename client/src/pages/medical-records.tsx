import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Stethoscope, Pill, TestTube } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MedicalRecords() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  // Get patient ID from URL parameters if viewing specific patient
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('patient');

  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: patientId ? ["/api/medical-records", "patient", patientId] : ["/api/medical-records"],
    queryFn: async () => {
      const url = patientId ? `/api/medical-records/patient/${patientId}` : '/api/medical-records';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch records');
      return response.json();
    },
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Stethoscope className="h-5 w-5" />;
      case "prescription":
        return <Pill className="h-5 w-5" />;
      case "lab_result":
        return <TestTube className="h-5 w-5" />;
      case "diagnosis":
        return <FileText className="h-5 w-5" />;
      case "procedure":
        return <User className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getRecordTypeText = (type: string) => {
    switch (type) {
      case "consultation":
        return "Consulta";
      case "prescription":
        return "Prescrição";
      case "lab_result":
        return "Resultado de Exame";
      case "diagnosis":
        return "Diagnóstico";
      case "procedure":
        return "Procedimento";
      default:
        return type;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-800";
      case "prescription":
        return "bg-green-100 text-green-800";
      case "lab_result":
        return "bg-purple-100 text-purple-800";
      case "diagnosis":
        return "bg-red-100 text-red-800";
      case "procedure":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Prontuários Médicos</h1>
              <p className="text-gray-600">Registros médicos e histórico de consultas</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registros Médicos</CardTitle>
            </CardHeader>
            <CardContent>
              {recordsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="w-20 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : records && records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((record: any) => (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getRecordIcon(record.recordType)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {record.title}
                              </h4>
                              <Badge className={getRecordTypeColor(record.recordType)}>
                                {getRecordTypeText(record.recordType)}
                              </Badge>
                            </div>
                            
                            {record.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {record.description}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(record.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                              
                              {record.attachments && record.attachments.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-3 w-3" />
                                  <span>{record.attachments.length} anexo(s)</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum registro médico encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
