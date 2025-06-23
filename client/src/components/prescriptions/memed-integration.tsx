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
  
  useEffect(() => {
    loadTemplates();
    if (patientId) {
      loadPatientInfo();
    }
  }, [patientId]);

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
    // Generate MEMED prescription link
    const memedUrl = 'https://memed.com.br/prescricao/nova';
    window.open(memedUrl, '_blank');
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
                  Clique no botão abaixo para acessar diretamente o sistema MEMED.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Prescrições Digitais</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Crie prescrições digitais válidas juridicamente
                  </p>
                  <Button variant="outline" size="sm" onClick={generateMemedLink}>
                    Acessar MEMED
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