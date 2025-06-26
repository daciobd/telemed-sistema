import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Search, Save, FileText, Clock, CheckCircle } from "lucide-react";

interface CidCode {
  id: number;
  code: string;
  description: string;
  shortDescription?: string;
  category: string;
  chapter: string;
}

interface ConsultationRecord {
  id?: number;
  appointmentId: number;
  patientId: number;
  chiefComplaint?: string;
  anamnesis?: string;
  diagnosis?: string;
  cidCode?: string;
  cidDescription?: string;
  treatment?: string;
  physicalExam?: string;
  notes?: string;
  followUp?: string;
  status?: string;
}

interface ConsultationRecordProps {
  appointmentId: number;
  patientId: number;
  isDoctor: boolean;
}

export default function ConsultationRecord({ appointmentId, patientId, isDoctor }: ConsultationRecordProps) {
  const [record, setRecord] = useState<ConsultationRecord>({
    appointmentId,
    patientId,
    status: 'in_progress'
  });
  
  const [cidQuery, setCidQuery] = useState("");
  const [selectedCid, setSelectedCid] = useState<CidCode | null>(null);
  const [showCidResults, setShowCidResults] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar registro existente
  const { data: existingRecord, isLoading } = useQuery({
    queryKey: [`/api/consultation-records/appointment/${appointmentId}`],
    enabled: !!appointmentId,
    retry: false
  });

  // Busca de códigos CID-10
  const { data: cidResults = [], isLoading: isSearchingCid } = useQuery({
    queryKey: [`/api/cid-codes/search`, cidQuery],
    enabled: cidQuery.length >= 2,
    queryFn: () => apiRequest(`/api/cid-codes/search?q=${encodeURIComponent(cidQuery)}&limit=10`)
  });

  // Mutation para salvar/atualizar registro
  const saveMutation = useMutation({
    mutationFn: async (data: ConsultationRecord) => {
      if (existingRecord?.id) {
        return await apiRequest(`/api/consultation-records/${existingRecord.id}`, {
          method: 'PUT',
          body: data
        });
      } else {
        return await apiRequest('/api/consultation-records', {
          method: 'POST',
          body: data
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Prontuário salvo",
        description: "Os dados da consulta foram salvos com sucesso.",
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/consultation-records/appointment/${appointmentId}`] 
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o prontuário. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Carregar dados existentes
  useEffect(() => {
    if (existingRecord) {
      setRecord(existingRecord);
      if (existingRecord.cidCode && existingRecord.cidDescription) {
        setSelectedCid({
          id: 0,
          code: existingRecord.cidCode,
          description: existingRecord.cidDescription,
          category: existingRecord.cidCode.substring(0, 3),
          chapter: ""
        });
      }
    }
  }, [existingRecord]);

  const handleSave = () => {
    const dataToSave = {
      ...record,
      cidCode: selectedCid?.code,
      cidDescription: selectedCid?.description,
    };
    saveMutation.mutate(dataToSave);
  };

  const handleCidSelect = (cid: CidCode) => {
    setSelectedCid(cid);
    setCidQuery(cid.description);
    setShowCidResults(false);
    setRecord(prev => ({
      ...prev,
      diagnosis: `${cid.description} (${cid.code})`,
      cidCode: cid.code,
      cidDescription: cid.description
    }));
  };

  const handleCompleteConsultation = () => {
    const completedRecord = {
      ...record,
      status: 'completed',
      completedAt: new Date().toISOString(),
      cidCode: selectedCid?.code,
      cidDescription: selectedCid?.description,
    };
    saveMutation.mutate(completedRecord);
  };

  if (!isDoctor) {
    // Visualização para pacientes (somente leitura)
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prontuário da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {existingRecord?.chiefComplaint && (
                <div>
                  <Label className="font-semibold">Queixa Principal</Label>
                  <p className="text-sm text-gray-700 mt-1">{existingRecord.chiefComplaint}</p>
                </div>
              )}
              
              {existingRecord?.diagnosis && (
                <div>
                  <Label className="font-semibold">Diagnóstico</Label>
                  <p className="text-sm text-gray-700 mt-1">{existingRecord.diagnosis}</p>
                  {existingRecord.cidCode && (
                    <Badge variant="outline" className="mt-1">
                      {existingRecord.cidCode}
                    </Badge>
                  )}
                </div>
              )}
              
              {existingRecord?.treatment && (
                <div>
                  <Label className="font-semibold">Conduta</Label>
                  <p className="text-sm text-gray-700 mt-1">{existingRecord.treatment}</p>
                </div>
              )}
              
              {existingRecord?.followUp && (
                <div>
                  <Label className="font-semibold">Orientações</Label>
                  <p className="text-sm text-gray-700 mt-1">{existingRecord.followUp}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Carregando prontuário...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prontuário Eletrônico
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              variant="outline"
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
            <Button
              onClick={handleCompleteConsultation}
              disabled={saveMutation.isPending}
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Finalizar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {/* Queixa Principal */}
            <div>
              <Label htmlFor="chiefComplaint">Queixa Principal</Label>
              <Textarea
                id="chiefComplaint"
                placeholder="Descreva a queixa principal do paciente..."
                value={record.chiefComplaint || ""}
                onChange={(e) => setRecord(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <Separator />

            {/* Anamnese */}
            <div>
              <Label htmlFor="anamnesis">Anamnese</Label>
              <Textarea
                id="anamnesis"
                placeholder="História clínica, sintomas, evolução..."
                value={record.anamnesis || ""}
                onChange={(e) => setRecord(prev => ({ ...prev, anamnesis: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>

            <Separator />

            {/* Hipótese Diagnóstica com busca CID */}
            <div>
              <Label htmlFor="diagnosis">Hipótese Diagnóstica</Label>
              <div className="relative mt-1">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite o diagnóstico para buscar CID-10..."
                      value={cidQuery}
                      onChange={(e) => {
                        setCidQuery(e.target.value);
                        setShowCidResults(e.target.value.length >= 2);
                      }}
                      onFocus={() => setShowCidResults(cidQuery.length >= 2)}
                    />
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Resultados da busca CID */}
                {showCidResults && cidResults.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto">
                    <CardContent className="p-2">
                      {cidResults.map((cid: CidCode) => (
                        <div
                          key={cid.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={() => handleCidSelect(cid)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{cid.description}</div>
                              <div className="text-xs text-gray-500">
                                {cid.shortDescription && cid.shortDescription !== cid.description && 
                                  `${cid.shortDescription} • `
                                }
                                Capítulo: {cid.chapter}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {cid.code}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* CID selecionado */}
                {selectedCid && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{selectedCid.description}</div>
                        <div className="text-xs text-gray-600">Código: {selectedCid.code}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCid(null);
                          setCidQuery("");
                          setRecord(prev => ({ ...prev, diagnosis: "", cidCode: "", cidDescription: "" }));
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Conduta */}
            <div>
              <Label htmlFor="treatment">Conduta</Label>
              <Textarea
                id="treatment"
                placeholder="Tratamento, medicações, orientações..."
                value={record.treatment || ""}
                onChange={(e) => setRecord(prev => ({ ...prev, treatment: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>

            <Separator />

            {/* Exame Físico */}
            <div>
              <Label htmlFor="physicalExam">Exame Físico</Label>
              <Textarea
                id="physicalExam"
                placeholder="Achados do exame físico..."
                value={record.physicalExam || ""}
                onChange={(e) => setRecord(prev => ({ ...prev, physicalExam: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Observações Gerais */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações adicionais..."
                value={record.notes || ""}
                onChange={(e) => setRecord(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>

            {/* Follow-up */}
            <div>
              <Label htmlFor="followUp">Orientações e Retorno</Label>
              <Textarea
                id="followUp"
                placeholder="Orientações para o paciente e agendamento de retorno..."
                value={record.followUp || ""}
                onChange={(e) => setRecord(prev => ({ ...prev, followUp: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}