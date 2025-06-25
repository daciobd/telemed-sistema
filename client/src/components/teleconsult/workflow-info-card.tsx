import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Video, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function WorkflowInfoCard() {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Fluxo Flexível de Teleconsultas Psiquiátricas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            O sistema oferece flexibilidade completa para psiquiatras escolherem entre 
            atendimento imediato ou solicitar preparação detalhada do paciente, 
            otimizando a qualidade do atendimento conforme cada caso.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Immediate Consultation */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Atendimento Imediato</h3>
              </div>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Psiquiatra aceita e atende na hora
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Ideal para urgências ou disponibilidade imediata
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Consulta iniciada após confirmação
                </li>
              </ul>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Tempo: Imediato
              </Badge>
            </div>

            {/* With Preparation */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Com Preparação Prévia</h3>
              </div>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  Avaliação psicológica (PHQ-9 e GAD-7)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  Questionário detalhado de psiquiatria
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  Entrevista com psicóloga (opcional)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  Consulta personalizada e direcionada
                </li>
              </ul>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Tempo: 30-60 min de preparação
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk-based Advancement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Sistema Inteligente de Antecipação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Quando o paciente realiza a preparação, o sistema analisa automaticamente 
            o nível de risco através das escalas validadas e pode antecipar consultas 
            quando necessário.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-red-900">Risco Urgente</div>
                <div className="text-sm text-red-700">
                  PHQ-9 ≥ 20 ou GAD-7 ≥ 15 → Consulta antecipada imediatamente
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <Clock className="h-5 w-5 text-orange-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-orange-900">Risco Alto</div>
                <div className="text-sm text-orange-700">
                  PHQ-9 ≥ 15 ou GAD-7 ≥ 10 → Consulta antecipada no mesmo dia
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-900">Risco Moderado/Baixo</div>
                <div className="text-sm text-blue-700">
                  Escores menores → Consulta mantida conforme agendamento
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-600" />
            Fluxo do Processo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                1
              </div>
              <div>
                <div className="font-medium">Paciente solicita teleconsulta psiquiátrica</div>
                <div className="text-sm text-gray-600">Leilão reverso com valor oferecido</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                2
              </div>
              <div>
                <div className="font-medium">Psiquiatra responde com preferência</div>
                <div className="text-sm text-gray-600">Escolhe entre atendimento imediato ou com preparação</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                3a
              </div>
              <div>
                <div className="font-medium">Imediato: Consulta iniciada</div>
                <div className="text-sm text-gray-600">Videochamada WebRTC após confirmação</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                3b
              </div>
              <div>
                <div className="font-medium">Com preparação: Paciente inicia processo</div>
                <div className="text-sm text-gray-600">Avaliação → Questionário → Entrevista opcional</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                4
              </div>
              <div>
                <div className="font-medium">Análise de risco automática</div>
                <div className="text-sm text-gray-600">Sistema pode antecipar consulta se risco alto</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                5
              </div>
              <div>
                <div className="font-medium">Consulta personalizada</div>
                <div className="text-sm text-gray-600">Psiquiatra recebe resumo completo da preparação</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}