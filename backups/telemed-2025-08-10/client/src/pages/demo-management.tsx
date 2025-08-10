import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Database, 
  Trash2, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const demoSpecs = [
  { 
    specialty: 'Cardiologia',
    doctors: ['Dr. Carlos Mendes', 'Dra. Ana Silva'],
    icon: '❤️',
    conditions: ['Hipertensão', 'Arritmia', 'Angina', 'Infarto']
  },
  { 
    specialty: 'Dermatologia',
    doctors: ['Dr. Pedro Santos', 'Dra. Maria Oliveira'],
    icon: '🧴',
    conditions: ['Dermatite', 'Psoríase', 'Acne', 'Melanoma']
  },
  { 
    specialty: 'Endocrinologia',
    doctors: ['Dr. João Costa', 'Dra. Lucia Ferreira'],
    icon: '🧬',
    conditions: ['Diabetes', 'Hipotireoidismo', 'Obesidade', 'Síndrome Metabólica']
  },
  { 
    specialty: 'Gastroenterologia',
    doctors: ['Dr. Roberto Lima', 'Dra. Sandra Rocha'],
    icon: '🫁',
    conditions: ['Gastrite', 'Úlcera', 'Crohn', 'Cirrose']
  },
  { 
    specialty: 'Neurologia',
    doctors: ['Dr. Antonio Gomes', 'Dra. Beatriz Alves'],
    icon: '🧠',
    conditions: ['Alzheimer', 'Enxaqueca', 'Epilepsia', 'Parkinson']
  },
  { 
    specialty: 'Ortopedia',
    doctors: ['Dr. Eduardo Machado', 'Dra. Fernanda Dias'],
    icon: '🦴',
    conditions: ['Fratura', 'Artrose', 'Hérnia', 'Fibromialgia']
  },
  { 
    specialty: 'Pediatria',
    doctors: ['Dr. Gabriel Ribeiro', 'Dra. Helena Castro'],
    icon: '👶',
    conditions: ['Asma Infantil', 'Bronquite', 'Rinite', 'Obesidade Infantil']
  },
  { 
    specialty: 'Psiquiatria',
    doctors: ['Dr. Igor Nascimento', 'Dra. Julia Barbosa'],
    icon: '🧘',
    conditions: ['Depressão', 'Ansiedade', 'Bipolar', 'Pânico']
  }
];

export default function DemoManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDemoDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/demo/create-data', { method: 'POST' });
    },
    onSuccess: () => {
      toast({
        title: "Dados de demonstração criados",
        description: "Equipe médica fictícia e pacientes foram criados com sucesso.",
      });
      queryClient.invalidateQueries();
      setIsCreating(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar os dados de demonstração.",
        variant: "destructive",
      });
      setIsCreating(false);
    },
  });

  const clearDemoDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/demo/clear-data', { method: 'DELETE' });
    },
    onSuccess: () => {
      toast({
        title: "Dados limpos",
        description: "Todos os dados de demonstração foram removidos.",
      });
      queryClient.invalidateQueries();
      setIsClearing(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível limpar os dados de demonstração.",
        variant: "destructive",
      });
      setIsClearing(false);
    },
  });

  const handleCreateDemo = () => {
    setIsCreating(true);
    createDemoDataMutation.mutate();
  };

  const handleClearDemo = () => {
    setIsClearing(true);
    clearDemoDataMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Demonstração</h1>
            <p className="text-gray-600">
              Configure dados fictícios para demonstração do sistema de telemedicina
            </p>
          </div>
        </div>

        {/* Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Os dados de demonstração incluem médicos fictícios e pacientes 
            com condições médicas variadas. Use apenas para fins de demonstração e treinamento.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleCreateDemo}
            disabled={isCreating || createDemoDataMutation.isPending}
            size="lg"
            className="flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Criando Dados...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Criar Dados de Demonstração
              </>
            )}
          </Button>

          <Button
            onClick={handleClearDemo}
            disabled={isClearing || clearDemoDataMutation.isPending}
            variant="destructive"
            size="lg"
            className="flex items-center gap-2"
          >
            {isClearing ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Limpando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Limpar Dados Demo
              </>
            )}
          </Button>
        </div>

        {/* Demo Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Equipe Médica Fictícia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoSpecs.map((spec, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{spec.icon}</span>
                      <h3 className="font-semibold">{spec.specialty}</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Médicos:</span>
                        <div className="mt-1 space-y-1">
                          {spec.doctors.map((doctor, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 mb-1">
                              {doctor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Condições:</span>
                        <div className="mt-1">
                          <span className="text-gray-600 text-xs">
                            {spec.conditions.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">20</div>
                  <div className="text-sm text-gray-600">Médicos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">50</div>
                  <div className="text-sm text-gray-600">Pacientes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">100</div>
                  <div className="text-sm text-gray-600">Consultas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-gray-600">Especialidades</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Info */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades Incluídas na Demonstração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Para Médicos:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Agendamento e gestão de consultas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Prescrições digitais integradas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Solicitação de exames clínicos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Encaminhamentos para especialistas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Teleconsultas psiquiátricas flexíveis
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Para Pacientes:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Histórico médico completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Acompanhamento de exames
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Videoconsultas WebRTC
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Avaliações psicológicas (PHQ-9, GAD-7)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Leilão reverso para teleconsultas
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}