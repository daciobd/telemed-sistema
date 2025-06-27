import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Send, 
  Download,
  ExternalLink,
  Check,
  AlertCircle,
  User,
  Calendar,
  Clock
} from 'lucide-react';

interface MemedIntegrationProps {
  patientId?: number;
  appointmentId?: number;
  onPrescriptionCreated?: (prescription: any) => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  activeIngredient: string;
  presentation: string;
}

interface PrescriptionTemplate {
  id: string;
  name: string;
  medications: Medication[];
  instructions: string;
  specialty: string;
}

export default function MemedIntegration({ patientId, appointmentId, onPrescriptionCreated }: MemedIntegrationProps) {
  const { toast } = useToast();
  
  // Prescription state
  const [medications, setMedications] = useState<Medication[]>([]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Templates
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Patient info
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [showPatientData, setShowPatientData] = useState(false);
  const [copiedData, setCopiedData] = useState('');
  
  useEffect(() => {
    loadTemplates();
    if (patientId) {
      loadPatientInfo();
    }
  }, [patientId]);

  // Format patient data for MEMED
  const formatPatientForMemed = (patient: any) => {
    if (!patient) return '';
    
    const birthDate = patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('pt-BR') : 'Não informado';
    const age = patient.dateOfBirth ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'Não informado';
    
    return `Nome: ${patient.firstName || ''} ${patient.lastName || ''}
CPF: ${patient.cpf || 'Não informado'}
Data de Nascimento: ${birthDate}
Idade: ${age} anos
Telefone: ${patient.phone || 'Não informado'}
Email: ${patient.email || 'Não informado'}
Endereço: ${patient.address || 'Não informado'}
Cidade: ${patient.city || ''} - ${patient.state || ''}
CEP: ${patient.zipCode || 'Não informado'}
Sexo: ${patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Feminino' : 'Não informado'}
Plano de Saúde: ${patient.healthInsurance || 'Particular'}
Número da Carteirinha: ${patient.healthInsuranceNumber || 'Não informado'}
Contato de Emergência: ${patient.emergencyContactName || 'Não informado'}
Telefone de Emergência: ${patient.emergencyContactPhone || 'Não informado'}
Medicamentos em Uso: ${patient.medications || 'Nenhum informado'}
Alergias: ${patient.allergies || 'Nenhuma informada'}
Histórico Médico: ${patient.medicalHistory || 'Não informado'}`;
  };

  const copyPatientData = () => {
    const formattedData = formatPatientForMemed(patientInfo);
    setCopiedData(formattedData);
    navigator.clipboard.writeText(formattedData);
    toast({
      title: "Dados copiados!",
      description: "Os dados do paciente foram copiados para a área de transferência",
    });
  };

  const openMemedWithData = () => {
    if (!patientInfo) {
      toast({
        title: "Erro",
        description: "Dados do paciente não encontrados",
        variant: "destructive"
      });
      return;
    }

    // Criar URL da MEMED com dados pré-preenchidos
    const memedBaseUrl = 'https://memed.com.br/prescricao';
    const patientData = {
      nome: `${patientInfo.firstName || ''} ${patientInfo.lastName || ''}`.trim(),
      cpf: patientInfo.cpf || '',
      nascimento: patientInfo.dateOfBirth ? new Date(patientInfo.dateOfBirth).toISOString().split('T')[0] : '',
      telefone: patientInfo.phone || '',
      email: patientInfo.email || ''
    };

    // Construir query string com dados do paciente
    const queryParams = new URLSearchParams();
    Object.entries(patientData).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const memedUrl = `${memedBaseUrl}?${queryParams.toString()}`;
    
    // Abrir MEMED em nova aba
    window.open(memedUrl, '_blank');
    
    toast({
      title: "MEMED aberta",
      description: "A MEMED foi aberta com os dados do paciente pré-carregados",
    });
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/prescription-templates');
      const data = await response.json();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadPatientInfo = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      const data = await response.json();
      setPatientInfo(data);
    } catch (error) {
      console.error('Error loading patient info:', error);
    }
  };

  const searchMedications = async (term: string) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/medications/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term })
      });
      const data = await response.json();
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching medications:', error);
      toast({
        title: "Erro na Busca",
        description: "Não foi possível buscar medicamentos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addMedication = (medication?: any) => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: medication?.name || '',
      dosage: medication?.dosage || '',
      frequency: '',
      duration: '',
      instructions: '',
      activeIngredient: medication?.activeIngredient || '',
      presentation: medication?.presentation || ''
    };
    
    setMedications([...medications, newMedication]);
    setSearchResults([]);
    setSearchTerm('');
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMedications(template.medications.map(med => ({
        ...med,
        id: Date.now().toString() + Math.random()
      })));
      setGeneralInstructions(template.instructions);
      setSelectedTemplate(templateId);
    }
  };

  const createPrescription = async () => {
    if (medications.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um medicamento à prescrição.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const prescriptionData = {
        patientId,
        appointmentId,
        medications,
        generalInstructions,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptionData)
      });
      
      const data = await response.json();

      toast({
        title: "Prescrição Criada",
        description: "A prescrição foi criada com sucesso e enviada para o MEMED.",
      });

      onPrescriptionCreated?.(data);
      
      // Reset form
      setMedications([]);
      setGeneralInstructions('');
      setSelectedTemplate('');
      
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a prescrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const generateMemedLink = () => {
    // Generate MEMED prescription link with patient data
    let memedUrl = 'https://memed.com.br/prescricao/nova';
    
    // Add patient data as URL parameters if available
    if (patientInfo) {
      const params = new URLSearchParams();
      
      // Patient name
      if (patientInfo.user?.firstName && patientInfo.user?.lastName) {
        params.append('paciente_nome', `${patientInfo.user.firstName} ${patientInfo.user.lastName}`);
      }
      
      // CPF
      if (patientInfo.cpf) {
        params.append('paciente_cpf', patientInfo.cpf);
      }
      
      // Phone number
      if (patientInfo.phone) {
        params.append('paciente_telefone', patientInfo.phone);
      }
      
      // Address
      if (patientInfo.address) {
        params.append('paciente_endereco', patientInfo.address);
      }
      
      // City and state (extracted from address if available)
      if (patientInfo.city) {
        params.append('paciente_cidade', patientInfo.city);
      }
      
      if (patientInfo.state) {
        params.append('paciente_estado', patientInfo.state);
      }
      
      // Date of birth
      if (patientInfo.dateOfBirth) {
        const birthDate = new Date(patientInfo.dateOfBirth).toLocaleDateString('pt-BR');
        params.append('paciente_nascimento', birthDate);
      }
      
      // Add parameters to URL if any exist
      if (params.toString()) {
        memedUrl += '?' + params.toString();
      }
    }
    
    window.open(memedUrl, '_blank');
    
    // Show success message
    toast({
      title: "MEMED Aberto",
      description: patientInfo ? 
        "Dados do paciente preenchidos automaticamente no MEMED" : 
        "MEMED aberto - preencha os dados do paciente manualmente",
    });
  };

  return (
    <div className="space-y-6">
      {patientInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Nome</Label>
                <p className="font-medium">{patientInfo.user?.firstName} {patientInfo.user?.lastName}</p>
              </div>
              <div>
                <Label>Data de Nascimento</Label>
                <p>{patientInfo.dateOfBirth ? new Date(patientInfo.dateOfBirth).toLocaleDateString('pt-BR') : 'Não informado'}</p>
              </div>
              <div>
                <Label>CPF</Label>
                <p>{patientInfo.cpf || 'Não informado'}</p>
              </div>
              <div>
                <Label>Telefone</Label>
                <p>{patientInfo.phone || 'Não informado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Nova Prescrição</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="memed">MEMED</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Medicamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o nome do medicamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMedications(searchTerm)}
                />
                <Button 
                  onClick={() => searchMedications(searchTerm)}
                  disabled={isSearching}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.activeIngredient}</p>
                        <p className="text-xs text-gray-500">{medication.presentation}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addMedication(medication)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Medicamentos da Prescrição</CardTitle>
              <Button size="sm" onClick={() => addMedication()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Manual
              </Button>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum medicamento adicionado
                </p>
              ) : (
                <div className="space-y-4">
                  {medications.map((medication) => (
                    <div key={medication.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Nome do Medicamento</Label>
                          <Input
                            value={medication.name}
                            onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                            placeholder="Ex: Paracetamol"
                          />
                        </div>
                        <div>
                          <Label>Dosagem</Label>
                          <Input
                            value={medication.dosage}
                            onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                            placeholder="Ex: 500mg"
                          />
                        </div>
                        <div>
                          <Label>Frequência</Label>
                          <Select
                            value={medication.frequency}
                            onValueChange={(value) => updateMedication(medication.id, 'frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1x-dia">1x ao dia</SelectItem>
                              <SelectItem value="2x-dia">2x ao dia</SelectItem>
                              <SelectItem value="3x-dia">3x ao dia</SelectItem>
                              <SelectItem value="4x-dia">4x ao dia</SelectItem>
                              <SelectItem value="6-6h">De 6 em 6 horas</SelectItem>
                              <SelectItem value="8-8h">De 8 em 8 horas</SelectItem>
                              <SelectItem value="12-12h">De 12 em 12 horas</SelectItem>
                              <SelectItem value="sos">Se necessário</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Duração</Label>
                          <Input
                            value={medication.duration}
                            onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                            placeholder="Ex: 7 dias"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Label>Instruções de Uso</Label>
                        <Textarea
                          value={medication.instructions}
                          onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                          placeholder="Ex: Tomar com água, após as refeições"
                          rows={2}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMedication(medication.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orientações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generalInstructions}
                onChange={(e) => setGeneralInstructions(e.target.value)}
                placeholder="Instruções gerais para o paciente..."
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={createPrescription} disabled={isCreating} className="flex-1">
              {isCreating ? 'Criando...' : 'Criar Prescrição'}
            </Button>
            <Button variant="outline" onClick={generateMemedLink}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir MEMED
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Prescrição</CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum template disponível
                </p>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary">{template.specialty}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.medications.length} medicamento(s)
                      </p>
                      <Button
                        size="sm"
                        onClick={() => applyTemplate(template.id)}
                      >
                        Aplicar Template
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memed" className="space-y-4">
          {/* Patient Data Preview for MEMED */}
          {patientInfo && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <User className="h-5 w-5" />
                  Dados que serão preenchidos automaticamente no MEMED
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-4">
                  <Button 
                    onClick={openMemedWithData}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir MEMED com Dados Preenchidos
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={copyPatientData}
                    className="border-green-600 text-green-700 hover:bg-green-100"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Copiar Dados para Colar
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPatientData(!showPatientData)}
                  >
                    {showPatientData ? 'Ocultar' : 'Ver'} Detalhes
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Nome:</span>
                      <span>{patientInfo.firstName || patientInfo.user?.firstName} {patientInfo.lastName || patientInfo.user?.lastName}</span>
                    </div>
                    {patientInfo.cpf && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium">CPF:</span>
                        <span>{patientInfo.cpf}</span>
                      </div>
                    )}
                    {patientInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Celular:</span>
                        <span>{patientInfo.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {patientInfo.address && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Endereço:</span>
                        <span className="text-xs">{patientInfo.address}</span>
                      </div>
                    )}
                    {patientInfo.dateOfBirth && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Nascimento:</span>
                        <span>{new Date(patientInfo.dateOfBirth).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {patientInfo.email && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Email:</span>
                        <span className="text-xs">{patientInfo.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {showPatientData && (
                  <div className="mt-4 bg-white p-3 rounded border space-y-2">
                    <h4 className="font-medium text-sm mb-2">Dados Complementares:</h4>
                    <div className="text-sm space-y-1">
                      {patientInfo.healthInsurance && (
                        <div><strong>Plano de Saúde:</strong> {patientInfo.healthInsurance}</div>
                      )}
                      {patientInfo.allergies && (
                        <div><strong>Alergias:</strong> {patientInfo.allergies}</div>
                      )}
                      {patientInfo.medications && (
                        <div><strong>Medicamentos em Uso:</strong> {patientInfo.medications}</div>
                      )}
                      {patientInfo.medicalHistory && (
                        <div><strong>Histórico Médico:</strong> {patientInfo.medicalHistory}</div>
                      )}
                    </div>
                  </div>
                )}

                {copiedData && (
                  <Alert className="mt-4 bg-green-100 border-green-300">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Dados copiados! Cole no formulário da MEMED usando Ctrl+V
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                  <p className="text-xs text-green-700">
                    ✓ Use "Abrir MEMED com Dados Preenchidos" para pré-carregamento automático
                    <br />
                    ✓ Use "Copiar Dados para Colar" se precisar inserir manualmente
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Integração MEMED
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O MEMED é uma plataforma profissional para prescrições médicas digitais.
                  {patientInfo ? 
                    " Os dados do paciente serão preenchidos automaticamente." : 
                    " Selecione um paciente para preenchimento automático dos dados."}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-blue-50">
                  <h4 className="font-medium mb-2 text-green-800">Prescrições Digitais</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {patientInfo ? 
                      "Dados do paciente preenchidos automaticamente" : 
                      "Crie prescrições digitais válidas juridicamente"}
                  </p>
                  <Button 
                    size="sm" 
                    onClick={patientInfo ? openMemedWithData : () => window.open('https://memed.com.br', '_blank')}
                    className={patientInfo ? 
                      "bg-green-600 hover:bg-green-700 text-white" : 
                      "bg-blue-600 hover:bg-blue-700 text-white"}
                  >
                    {patientInfo ? 
                      "Abrir MEMED (dados preenchidos)" : 
                      "Acessar MEMED"}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Base de Medicamentos</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Acesso à base completa de medicamentos do Brasil
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Em Breve
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Funcionalidades Disponíveis</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Prescrições com assinatura digital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Integração com farmácias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Histórico de prescrições</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Conformidade com CFM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}