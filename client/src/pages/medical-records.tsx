import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Stethoscope, Pill, TestTube, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MedicalRecords() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug modal state
  console.log('Modal state:', { isModalOpen, selectedRecord });

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

  const { data: records, isLoading: recordsLoading, error } = useQuery({
    queryKey: patientId ? ["/api/medical-records", "patient", patientId] : ["/api/medical-records"],
    queryFn: async () => {
      const url = patientId ? `/api/medical-records/patient/${patientId}` : '/api/medical-records';
      console.log('Fetching medical records from:', url);
      const response = await fetch(url, {
        credentials: 'include', // Important for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      console.log('Medical records data:', data);
      return data;
    },
    retry: false,
    enabled: isAuthenticated, // Only fetch when authenticated
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
              <h1 className="text-2xl font-semibold text-gray-900">
                {patientId ? 'Prontuário do Paciente' : 'Prontuários Médicos'}
              </h1>
              <p className="text-gray-600">
                {patientId 
                  ? 'Registros médicos específicos do paciente selecionado'
                  : 'Registros médicos e histórico de consultas'
                }
              </p>
              {patientId && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.href = '/medical-records'}
                >
                  ← Voltar para todos os prontuários
                </Button>
              )}
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
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Erro ao carregar registros: {error.message}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              ) : records && Array.isArray(records) && records.length > 0 ? (
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
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Button clicked, record:', record);
                              setSelectedRecord(record);
                              setIsModalOpen(true);
                              console.log('Modal should open now');
                            }}
                          >
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
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      💡 <strong>Para ver prontuários:</strong>
                    </p>
                    <p className="text-sm text-blue-600">
                      1. Vá em <strong>"Configurações"</strong> no menu lateral<br/>
                      2. Clique em <strong>"Criar Prontuários de Demonstração"</strong><br/>
                      3. Retorne aqui para ver os dados médicos
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal de Detalhes do Registro Médico */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {selectedRecord?.title || 'Detalhes do Registro'}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {selectedRecord?.recordType && (
                    <Badge className={getRecordTypeColor(selectedRecord.recordType)}>
                      {getRecordTypeText(selectedRecord.recordType)}
                    </Badge>
                  )}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] px-6 pb-6">
            {selectedRecord && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Informações Gerais</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">
                        {format(new Date(selectedRecord.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {selectedRecord.patient && (
                      <div>
                        <span className="text-gray-500">Paciente:</span>
                        <p className="font-medium">
                          {selectedRecord.patient.user?.firstName} {selectedRecord.patient.user?.lastName}
                        </p>
                      </div>
                    )}
                    {selectedRecord.doctor && (
                      <div>
                        <span className="text-gray-500">Médico:</span>
                        <p className="font-medium">
                          Dr. {selectedRecord.doctor.user?.firstName} {selectedRecord.doctor.user?.lastName}
                        </p>
                      </div>
                    )}
                    {selectedRecord.appointment && (
                      <div>
                        <span className="text-gray-500">Consulta:</span>
                        <p className="font-medium">#{selectedRecord.appointment.id}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Descrição/Conteúdo */}
                {selectedRecord.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Descrição</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedRecord.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Detalhes Médicos */}
                {(selectedRecord.diagnosis || selectedRecord.treatment || selectedRecord.anamnesis) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Detalhes Médicos</h3>
                      <div className="space-y-4">
                        {selectedRecord.anamnesis && (
                          <div>
                            <span className="text-gray-500 text-sm">Anamnese:</span>
                            <p className="text-sm mt-1 bg-gray-50 p-3 rounded">
                              {selectedRecord.anamnesis}
                            </p>
                          </div>
                        )}
                        {selectedRecord.physicalExam && (
                          <div>
                            <span className="text-gray-500 text-sm">Exame Físico:</span>
                            <p className="text-sm mt-1 bg-gray-50 p-3 rounded">
                              {selectedRecord.physicalExam}
                            </p>
                          </div>
                        )}
                        {selectedRecord.diagnosis && (
                          <div>
                            <span className="text-gray-500 text-sm">Diagnóstico:</span>
                            <p className="text-sm mt-1 bg-gray-50 p-3 rounded">
                              {selectedRecord.diagnosis}
                            </p>
                          </div>
                        )}
                        {selectedRecord.treatment && (
                          <div>
                            <span className="text-gray-500 text-sm">Tratamento:</span>
                            <p className="text-sm mt-1 bg-gray-50 p-3 rounded">
                              {selectedRecord.treatment}
                            </p>
                          </div>
                        )}
                        {selectedRecord.cidCode && (
                          <div>
                            <span className="text-gray-500 text-sm">CID-10:</span>
                            <p className="text-sm mt-1">
                              <Badge variant="secondary">
                                {selectedRecord.cidCode} - {selectedRecord.cidDescription}
                              </Badge>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Sinais Vitais */}
                {selectedRecord.vitalSigns && Object.keys(selectedRecord.vitalSigns).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Sinais Vitais</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {selectedRecord.vitalSigns.bloodPressure && (
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-gray-500">Pressão Arterial:</span>
                            <p className="font-medium">{selectedRecord.vitalSigns.bloodPressure}</p>
                          </div>
                        )}
                        {selectedRecord.vitalSigns.heartRate && (
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-gray-500">Frequência Cardíaca:</span>
                            <p className="font-medium">{selectedRecord.vitalSigns.heartRate}</p>
                          </div>
                        )}
                        {selectedRecord.vitalSigns.temperature && (
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-gray-500">Temperatura:</span>
                            <p className="font-medium">{selectedRecord.vitalSigns.temperature}</p>
                          </div>
                        )}
                        {selectedRecord.vitalSigns.weight && (
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-gray-500">Peso:</span>
                            <p className="font-medium">{selectedRecord.vitalSigns.weight}</p>
                          </div>
                        )}
                        {selectedRecord.vitalSigns.height && (
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-gray-500">Altura:</span>
                            <p className="font-medium">{selectedRecord.vitalSigns.height}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Medicações e Recomendações */}
                {(selectedRecord.medications || selectedRecord.recommendations) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      {selectedRecord.medications && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Medicações</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedRecord.medications}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedRecord.recommendations && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Recomendações</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedRecord.recommendations}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Notas Adicionais */}
                {selectedRecord.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Notas Adicionais</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedRecord.notes}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Anexos */}
                {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Anexos</h3>
                      <div className="space-y-2">
                        {selectedRecord.attachments.map((attachment: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{attachment.filename || `Anexo ${index + 1}`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
