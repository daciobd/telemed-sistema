import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Droplets, 
  Scan, 
  Activity, 
  Eye, 
  Ear,
  Brain,
  Bone,
  Pill,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ExamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  patientName: string;
}

interface ExamOption {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description?: string;
  preparationInstructions?: string;
}

const examCategories = {
  blood: {
    name: 'Exames de Sangue',
    icon: <Droplets className="h-4 w-4 text-red-500" />,
    exams: [
      { id: 'hemograma', name: 'Hemograma Completo', description: 'Avaliação geral das células sanguíneas' },
      { id: 'glicemia', name: 'Glicemia de Jejum', description: 'Dosagem de açúcar no sangue', preparationInstructions: 'Jejum de 8-12 horas' },
      { id: 'colesterol', name: 'Perfil Lipídico', description: 'Colesterol total, HDL, LDL e triglicerídeos', preparationInstructions: 'Jejum de 12 horas' },
      { id: 'tsh', name: 'TSH e T4 Livre', description: 'Função da tireoide' },
      { id: 'creatinina', name: 'Creatinina e Ureia', description: 'Função renal' },
      { id: 'transaminases', name: 'TGO/TGP', description: 'Função hepática' },
      { id: 'vitamina-d', name: 'Vitamina D', description: '25-hidroxivitamina D' },
      { id: 'vitamina-b12', name: 'Vitamina B12', description: 'Dosagem de cobalamina' },
      { id: 'ferritina', name: 'Ferritina', description: 'Reservas de ferro' },
      { id: 'psa', name: 'PSA Total e Livre', description: 'Marcador prostático' }
    ]
  },
  urine: {
    name: 'Exames de Urina',
    icon: <Activity className="h-4 w-4 text-yellow-500" />,
    exams: [
      { id: 'eas', name: 'EAS - Urina Tipo I', description: 'Exame básico de urina' },
      { id: 'urocultura', name: 'Urocultura', description: 'Pesquisa de bactérias na urina' },
      { id: 'proteinuria-24h', name: 'Proteinúria de 24h', description: 'Dosagem de proteínas em 24 horas' },
      { id: 'microalbuminuria', name: 'Microalbuminúria', description: 'Detecção precoce de lesão renal' }
    ]
  },
  imaging: {
    name: 'Exames de Imagem',
    icon: <Scan className="h-4 w-4 text-blue-500" />,
    exams: [
      { id: 'rx-torax', name: 'Raio-X de Tórax', description: 'Avaliação de pulmões e coração' },
      { id: 'rx-abdome', name: 'Raio-X de Abdome', description: 'Avaliação abdominal' },
      { id: 'eco-abdome', name: 'Ultrassom de Abdome', description: 'Avaliação de órgãos abdominais', preparationInstructions: 'Jejum de 8 horas' },
      { id: 'eco-tireoide', name: 'Ultrassom de Tireoide', description: 'Avaliação da glândula tireoide' },
      { id: 'eco-pelvico', name: 'Ultrassom Pélvico', description: 'Avaliação de órgãos pélvicos' },
      { id: 'tomografia-abdome', name: 'Tomografia de Abdome', description: 'Imagem detalhada do abdome' },
      { id: 'ressonancia-cranio', name: 'Ressonância de Crânio', description: 'Avaliação cerebral detalhada' },
      { id: 'mamografia', name: 'Mamografia', description: 'Rastreamento de câncer de mama' }
    ]
  },
  cardiac: {
    name: 'Exames Cardiológicos',
    icon: <Heart className="h-4 w-4 text-red-600" />,
    exams: [
      { id: 'ecg', name: 'Eletrocardiograma (ECG)', description: 'Avaliação do ritmo cardíaco' },
      { id: 'ecocardiograma', name: 'Ecocardiograma', description: 'Ultrassom do coração' },
      { id: 'teste-esforco', name: 'Teste de Esforço', description: 'ECG durante exercício' },
      { id: 'holter-24h', name: 'Holter 24h', description: 'Monitorização cardíaca contínua' },
      { id: 'mapa', name: 'MAPA', description: 'Monitorização ambulatorial da pressão arterial' }
    ]
  },
  specialty: {
    name: 'Exames Especializados',
    icon: <Brain className="h-4 w-4 text-purple-500" />,
    exams: [
      { id: 'endoscopia', name: 'Endoscopia Digestiva', description: 'Avaliação do estômago e duodeno', preparationInstructions: 'Jejum de 8 horas' },
      { id: 'colonoscopia', name: 'Colonoscopia', description: 'Avaliação do intestino grosso', preparationInstructions: 'Preparo intestinal conforme orientação' },
      { id: 'espirometria', name: 'Espirometria', description: 'Avaliação da função pulmonar' },
      { id: 'densitometria', name: 'Densitometria Óssea', description: 'Avaliação da densidade óssea' },
      { id: 'eletroencefalograma', name: 'Eletroencefalograma', description: 'Avaliação da atividade cerebral' }
    ]
  }
};

export default function ExamSelectionModal({ isOpen, onClose, appointmentId, patientName }: ExamSelectionModalProps) {
  const [selectedExams, setSelectedExams] = useState<ExamOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [instructions, setInstructions] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const orderExamsMutation = useMutation({
    mutationFn: async () => {
      // Get patient ID from appointment
      const appointmentResponse = await apiRequest(`/api/appointments/${appointmentId}`);
      const patientId = appointmentResponse.patientId;

      for (const exam of selectedExams) {
        await apiRequest('/api/clinical-exams', {
          method: 'POST',
          body: JSON.stringify({
            appointmentId,
            patientId,
            examType: exam.category,
            examName: exam.name,
            priority,
            instructions: `${instructions}\n${exam.preparationInstructions || ''}`.trim()
          }),
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Exames solicitados",
        description: `${selectedExams.length} exame(s) solicitado(s) para ${patientName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clinical-exams'] });
      setSelectedExams([]);
      setInstructions('');
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível solicitar os exames.",
        variant: "destructive",
      });
    },
  });

  const toggleExam = (exam: ExamOption) => {
    setSelectedExams(prev => {
      const exists = prev.find(e => e.id === exam.id);
      if (exists) {
        return prev.filter(e => e.id !== exam.id);
      } else {
        return [...prev, exam];
      }
    });
  };

  const filteredExams = Object.entries(examCategories).map(([categoryKey, category]) => ({
    ...category,
    key: categoryKey,
    exams: category.exams.filter(exam =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(exam => ({
      ...exam,
      category: categoryKey,
      icon: category.icon
    }))
  })).filter(category => category.exams.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Solicitar Exames Clínicos - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar exames..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Exams */}
          {selectedExams.length > 0 && (
            <div className="border rounded-lg p-3">
              <Label className="text-sm font-medium">Exames Selecionados ({selectedExams.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedExams.map((exam) => (
                  <Badge
                    key={exam.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleExam(exam)}
                  >
                    {exam.name} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Exam Categories */}
          <Tabs defaultValue={Object.keys(examCategories)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {filteredExams.map((category) => (
                <TabsTrigger key={category.key} value={category.key} className="text-xs">
                  <span className="flex items-center gap-1">
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {filteredExams.map((category) => (
              <TabsContent key={category.key} value={category.key}>
                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  <div className="space-y-3">
                    {category.exams.map((exam) => {
                      const isSelected = selectedExams.some(e => e.id === exam.id);
                      return (
                        <div
                          key={exam.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleExam(exam)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => {}} // Controlled by parent click
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {exam.icon}
                              <span className="font-medium">{exam.name}</span>
                            </div>
                            {exam.description && (
                              <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                            )}
                            {exam.preparationInstructions && (
                              <p className="text-xs text-orange-600 mt-1">
                                📋 {exam.preparationInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          {/* Priority and Instructions */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Rotina</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="emergency">Emergência</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Instruções Especiais</Label>
              <Textarea
                placeholder="Instruções adicionais para os exames..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => orderExamsMutation.mutate()}
              disabled={selectedExams.length === 0 || orderExamsMutation.isPending}
            >
              {orderExamsMutation.isPending ? 'Solicitando...' : `Solicitar ${selectedExams.length} Exame(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}