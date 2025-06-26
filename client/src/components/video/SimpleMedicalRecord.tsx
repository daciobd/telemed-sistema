import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Save, FileText, CheckCircle, Search, Pill, ExternalLink } from "lucide-react";

interface SimpleMedicalRecordProps {
  appointmentId: number;
  patientId: number;
  isDoctor: boolean;
}

interface Patient {
  id: number;
  userId: string;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  cpf?: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function SimpleMedicalRecord({ appointmentId, patientId, isDoctor }: SimpleMedicalRecordProps) {
  const [record, setRecord] = useState({
    chiefComplaint: "",
    anamnesis: "",
    diagnosis: "",
    treatment: "",
    physicalExam: "",
    notes: "",
    cidCode: "",
    cidDescription: ""
  });
  
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [cidResults, setCidResults] = useState<any[]>([]);
  const [showCidDropdown, setShowCidDropdown] = useState(false);
  const [searchingCid, setSearchingCid] = useState(false);

  // Buscar dados do paciente para preenchimento automático do MEMED
  const { data: patient } = useQuery<Patient>({
    queryKey: [`/api/patients/${patientId}`],
    enabled: !!patientId,
    retry: false
  });

  const [showPatientData, setShowPatientData] = useState(false);

  const openMemed = () => {
    if (!patient) {
      window.open('https://memed.com.br', '_blank');
      toast({
        title: "MEMED aberto",
        description: "Carregue os dados do paciente manualmente.",
        variant: "destructive"
      });
      return;
    }

    // Mostrar dados do paciente primeiro
    setShowPatientData(true);
  };

  // Search CID codes when diagnosis changes
  useEffect(() => {
    const searchTerm = record.diagnosis.trim();
    if (searchTerm.length >= 2) {
      const timeoutId = setTimeout(async () => {
        setSearchingCid(true);
        try {
          const response = await fetch(`/api/cid/search?q=${encodeURIComponent(searchTerm)}&limit=5`);
          if (response.ok) {
            const results = await response.json();
            setCidResults(results);
            setShowCidDropdown(results.length > 0);
          }
        } catch (error) {
          console.error('Error searching CID codes:', error);
        } finally {
          setSearchingCid(false);
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setCidResults([]);
      setShowCidDropdown(false);
    }
  }, [record.diagnosis]);

  const selectCidCode = (cid: any) => {
    setRecord(prev => ({
      ...prev,
      cidCode: cid.code,
      cidDescription: cid.description
    }));
    setShowCidDropdown(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/consultation-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          patientId,
          ...record,
          status: 'in_progress'
        })
      });

      if (response.ok) {
        toast({
          title: "Prontuário salvo",
          description: "Os dados da consulta foram salvos com sucesso.",
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o prontuário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/consultation-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          patientId,
          ...record,
          status: 'completed'
        })
      });

      if (response.ok) {
        toast({
          title: "Consulta finalizada",
          description: "O prontuário foi salvo e a consulta finalizada.",
        });
      } else {
        throw new Error('Erro ao finalizar');
      }
    } catch (error) {
      toast({
        title: "Erro ao finalizar",
        description: "Não foi possível finalizar a consulta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isDoctor) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prontuário da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            O médico está documentando a consulta. Você poderá acessar o prontuário após a consulta.
          </p>
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
              onClick={openMemed}
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            >
              <Pill className="h-4 w-4 mr-1" />
              MEMED
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
            <Button
              onClick={handleComplete}
              disabled={saving}
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
                value={record.chiefComplaint}
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
                value={record.anamnesis}
                onChange={(e) => setRecord(prev => ({ ...prev, anamnesis: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>

            <Separator />

            {/* Hipótese Diagnóstica */}
            <div className="relative">
              <Label htmlFor="diagnosis">Hipótese Diagnóstica</Label>
              <Textarea
                id="diagnosis"
                placeholder="Digite a hipótese diagnóstica (ex: ansiedade) para buscar códigos CID..."
                value={record.diagnosis}
                onChange={(e) => setRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                className="mt-1"
                rows={3}
              />
              
              {/* CID Code Dropdown */}
              {showCidDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchingCid ? (
                    <div className="p-3 text-center text-gray-500">
                      <Search className="h-4 w-4 animate-spin inline mr-2" />
                      Buscando códigos CID...
                    </div>
                  ) : cidResults.length > 0 ? (
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                        Códigos CID-10 encontrados:
                      </div>
                      {cidResults.map((cid, index) => (
                        <button
                          key={index}
                          className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                          onClick={() => selectCidCode(cid)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-blue-600 text-sm">
                                {cid.code}
                              </div>
                              <div className="text-gray-700 text-sm mt-1">
                                {cid.shortDescription || cid.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
              
              {/* Selected CID Display */}
              {record.cidCode && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-blue-800">CID-10: {record.cidCode}</span>
                      <div className="text-sm text-blue-600 mt-1">{record.cidDescription}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setRecord(prev => ({ ...prev, cidCode: "", cidDescription: "" }))}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Conduta */}
            <div>
              <Label htmlFor="treatment">Conduta</Label>
              <Textarea
                id="treatment"
                placeholder="Tratamento, medicações, orientações..."
                value={record.treatment}
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
                value={record.physicalExam}
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
                value={record.notes}
                onChange={(e) => setRecord(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      {/* Modal com dados do paciente para MEMED */}
      {showPatientData && patient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Pill className="h-5 w-5 text-green-600" />
                Dados para MEMED
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPatientData(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-gray-50 rounded">
                <label className="text-sm font-medium text-gray-600">Nome Completo:</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {`${(patient as any).user?.firstName || ''} ${(patient as any).user?.lastName || ''}`.trim() || 'DACIO DUTRA'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <label className="text-sm font-medium text-gray-600">CPF:</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).cpf || '123.456.789-01'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <label className="text-sm font-medium text-gray-600">Telefone:</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).phone || '(11) 99999-9999'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <label className="text-sm font-medium text-gray-600">Endereço:</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).address || 'São Paulo - SP'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  window.open('https://memed.com.br', '_blank');
                  toast({
                    title: "MEMED aberta",
                    description: "Use os dados acima para preencher o cadastro do paciente.",
                  });
                }}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir MEMED
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const patientData = `Nome: ${`${(patient as any).user?.firstName || ''} ${(patient as any).user?.lastName || ''}`.trim() || 'DACIO DUTRA'}
CPF: ${(patient as any).cpf || '123.456.789-01'}
Telefone: ${(patient as any).phone || '(11) 99999-9999'}
Endereço: ${(patient as any).address || 'São Paulo - SP'}`;
                  
                  navigator.clipboard.writeText(patientData);
                  toast({
                    title: "Dados copiados",
                    description: "Cole os dados na MEMED com Ctrl+V",
                  });
                }}
              >
                Copiar Dados
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}