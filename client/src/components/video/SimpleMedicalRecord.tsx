import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Save, FileText, CheckCircle, Search, Pill, ExternalLink, User, MapPin, Home, Phone } from "lucide-react";

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
    cidDescription: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: ""
    },
    medications: "",
    recommendations: "",
    followUp: ""
  });
  
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [cidResults, setCidResults] = useState<any[]>([]);
  const [showCidDropdown, setShowCidDropdown] = useState(false);
  const [searchingCid, setSearchingCid] = useState(false);
  const [activeTab, setActiveTab] = useState('anamnese');

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
          const response = await fetch(`/api/cid-codes/search?q=${encodeURIComponent(searchTerm)}`);
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
      
      <CardContent className="p-0">
        {/* Tabs Navigation */}
        <div className="flex border-b">
          {[
            { id: 'anamnese', label: 'Anamnese' },
            { id: 'exame', label: 'Exame Físico' },
            { id: 'diagnostico', label: 'Diagnóstico' },
            { id: 'conduta', label: 'Conduta' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ScrollArea className="h-96 p-4">
          {/* Tab Content: Anamnese */}
          {activeTab === 'anamnese' && (
            <div className="space-y-4">
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
          )}

          {/* Tab Content: Exame Físico */}
          {activeTab === 'exame' && (
            <div className="space-y-4">
              <div>
                <Label>Sinais Vitais</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label htmlFor="bloodPressure" className="text-xs">Pressão Arterial</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80 mmHg"
                      value={record.vitalSigns.bloodPressure}
                      onChange={(e) => setRecord(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, bloodPressure: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="heartRate" className="text-xs">Freq. Cardíaca</Label>
                    <Input
                      id="heartRate"
                      placeholder="72 bpm"
                      value={record.vitalSigns.heartRate}
                      onChange={(e) => setRecord(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, heartRate: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature" className="text-xs">Temperatura</Label>
                    <Input
                      id="temperature"
                      placeholder="36.5°C"
                      value={record.vitalSigns.temperature}
                      onChange={(e) => setRecord(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, temperature: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-xs">Peso</Label>
                    <Input
                      id="weight"
                      placeholder="70 kg"
                      value={record.vitalSigns.weight}
                      onChange={(e) => setRecord(prev => ({ 
                        ...prev, 
                        vitalSigns: { ...prev.vitalSigns, weight: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="physicalExamDetails">Exame Físico Detalhado</Label>
                <Textarea
                  id="physicalExamDetails"
                  placeholder="Achados do exame físico por sistemas..."
                  value={record.physicalExam}
                  onChange={(e) => setRecord(prev => ({ ...prev, physicalExam: e.target.value }))}
                  className="mt-1"
                  rows={6}
                />
              </div>
            </div>
          )}

          {/* Tab Content: Diagnóstico */}
          {activeTab === 'diagnostico' && (
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="diagnosisMain">Hipótese Diagnóstica Principal</Label>
                <Textarea
                  id="diagnosisMain"
                  placeholder="Digite a hipótese diagnóstica principal..."
                  value={record.diagnosis}
                  onChange={(e) => setRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
                
                {/* Selected CID Display */}
                {record.cidCode && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
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
            </div>
          )}

          {/* Tab Content: Conduta */}
          {activeTab === 'conduta' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="treatmentPlan">Plano Terapêutico</Label>
                <Textarea
                  id="treatmentPlan"
                  placeholder="Tratamento prescrito, orientações gerais..."
                  value={record.treatment}
                  onChange={(e) => setRecord(prev => ({ ...prev, treatment: e.target.value }))}
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="medicationsList">Medicações Prescritas</Label>
                <Textarea
                  id="medicationsList"
                  placeholder="Lista de medicamentos e posologia..."
                  value={record.medications}
                  onChange={(e) => setRecord(prev => ({ ...prev, medications: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="recommendationsList">Recomendações</Label>
                <Textarea
                  id="recommendationsList"
                  placeholder="Orientações sobre dieta, exercícios, cuidados..."
                  value={record.recommendations}
                  onChange={(e) => setRecord(prev => ({ ...prev, recommendations: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="followUpPlan">Retorno</Label>
                <Input
                  id="followUpPlan"
                  placeholder="Ex: 30 dias, se necessário, emergência..."
                  value={record.followUp}
                  onChange={(e) => setRecord(prev => ({ ...prev, followUp: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          )}
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
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <label className="text-sm font-medium text-blue-800">Nome de Registro (obrigatório MEMED):</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {`${(patient as any).user?.firstName || ''} ${(patient as any).user?.lastName || ''}`.trim() || 'DACIO DUTRA'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <label className="text-sm font-medium text-gray-600">Nome Social (opcional MEMED):</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).socialName || ''}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <label className="text-sm font-medium text-blue-800">Cidade (obrigatório MEMED):</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).city || 'São Paulo'}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <label className="text-sm font-medium text-blue-800">Endereço (obrigatório MEMED):</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).address || 'Rua das Flores, 123 - Centro'}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <label className="text-sm font-medium text-blue-800">Telefone (obrigatório MEMED):</label>
                <p className="font-mono text-sm bg-white p-2 rounded border mt-1">
                  {(patient as any).phone || '(11) 99999-9999'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Solução completa para MEMED */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-green-800 font-semibold">
                    📋 COPIAR DADOS PARA MEMED (campos obrigatórios):
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPatientData(false)}
                    className="text-red-600 hover:bg-red-100 h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
                <TooltipProvider>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const name = `${(patient as any).user?.firstName || ''} ${(patient as any).user?.lastName || ''}`.trim() || 'DACIO DUTRA';
                            navigator.clipboard.writeText(name);
                            toast({
                              title: "Nome de Registro copiado!",
                              description: "Clique no 'X' acima para fechar ou continue copiando",
                            });
                          }}
                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Nome Registro
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar o nome completo do paciente para colar no campo "Nome de Registro" da MEMED</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const city = (patient as any).city || 'São Paulo';
                            navigator.clipboard.writeText(city);
                            toast({
                              title: "Cidade copiada!",
                              description: "Clique no 'X' acima para fechar ou continue copiando",
                            });
                          }}
                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Cidade
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar a cidade do paciente para colar no campo "Cidade" da MEMED</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const address = (patient as any).address || 'Rua das Flores, 123 - Centro';
                            navigator.clipboard.writeText(address);
                            toast({
                              title: "Endereço copiado!",
                              description: "Clique no 'X' acima para fechar ou continue copiando",
                            });
                          }}
                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Endereço
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar o endereço completo do paciente para colar no campo "Endereço" da MEMED</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            const phone = (patient as any).phone || '(11) 99999-9999';
                            navigator.clipboard.writeText(phone);
                            toast({
                              title: "Telefone copiado!",
                              description: "Clique no 'X' acima para fechar ou continue copiando",
                            });
                          }}
                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Telefone
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clique para copiar o telefone do paciente para colar no campo "Telefone" da MEMED</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
                
                {/* Campo opcional */}
                <div className="border-t pt-2">
                  <p className="text-xs text-gray-600 mb-2">Campo Opcional:</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const socialName = (patient as any).socialName || '';
                          if (socialName) {
                            navigator.clipboard.writeText(socialName);
                            toast({
                              title: "Nome Social copiado!",
                              description: "Clique no 'X' acima para fechar ou continue copiando",
                            });
                          } else {
                            toast({
                              title: "Nome Social vazio",
                              description: "Este paciente não possui nome social cadastrado",
                              variant: "destructive"
                            });
                          }
                        }}
                        className="border-gray-400 text-gray-600 hover:bg-gray-50"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Nome Social
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clique para copiar o nome social do paciente (se houver) para colar no campo "Nome Social" da MEMED</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Botões principais */}
              <div className="space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        window.open('https://memed.com.br/prescricao', '_blank');
                        setShowPatientData(false); // Fecha o modal
                        toast({
                          title: "MEMED aberta",
                          description: "Use os dados copiados nos campos corretos.",
                        });
                      }}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir MEMED e Fechar Modal
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Abre o site da MEMED em nova aba e fecha este modal. Use após copiar os dados necessários.</p>
                  </TooltipContent>
                </Tooltip>
                
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const patientData = `Nome: ${`${(patient as any).user?.firstName || ''} ${(patient as any).user?.lastName || ''}`.trim() || 'DACIO DUTRA'}
CPF: ${(patient as any).cpf || '123.456.789-01'}
Telefone: ${(patient as any).phone || '(11) 99999-9999'}
Endereço: ${(patient as any).address || 'São Paulo - SP'}`;
                          
                          navigator.clipboard.writeText(patientData);
                          toast({
                            title: "Dados completos copiados",
                            description: "Cole os dados na MEMED com Ctrl+V",
                          });
                        }}
                        className="flex-1"
                      >
                        Copiar Todos
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copia todos os dados do paciente em formato de texto para colar diretamente na MEMED</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setShowPatientData(false)}
                        className="flex-1 bg-red-50 hover:bg-red-100 border-red-300 text-red-700"
                      >
                        ✕ Fechar
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fecha este modal sem abrir a MEMED. Use se quiser continuar no prontuário.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}