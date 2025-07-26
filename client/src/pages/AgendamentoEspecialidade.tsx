import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock, DollarSign, User, FileText } from 'lucide-react';

const especialidades = {
  'clinica-geral': {
    nome: 'Clínica Geral',
    icon: '🏥',
    precoMin: 80,
    precoMax: 120,
    descricao: 'Consultas gerais, check-ups e acompanhamento de rotina'
  },
  'ortopedia': {
    nome: 'Ortopedia',
    icon: '🦴',
    precoMin: 130,
    precoMax: 220,
    descricao: 'Problemas ósseos, articulares e musculares'
  },
  'pediatria': {
    nome: 'Pediatria',
    icon: '👶',
    precoMin: 100,
    precoMax: 180,
    descricao: 'Cuidados médicos especializados para crianças'
  },
  'dermatologia': {
    nome: 'Dermatologia',
    icon: '🔬',
    precoMin: 120,
    precoMax: 200,
    descricao: 'Problemas de pele, cabelo e unhas'
  },
  'psiquiatria': {
    nome: 'Psiquiatria',
    icon: '🧠',
    precoMin: 150,
    precoMax: 250,
    descricao: 'Saúde mental e transtornos psiquiátricos'
  },
  'ginecologia': {
    nome: 'Ginecologia',
    icon: '👩‍⚕️',
    precoMin: 120,
    precoMax: 200,
    descricao: 'Saúde íntima feminina e reprodutiva'
  },
  'psicoterapia': {
    nome: 'Psicoterapia',
    icon: '💭',
    precoMin: 100,
    precoMax: 180,
    descricao: 'Terapia e acompanhamento psicológico'
  },
  'nutricao': {
    nome: 'Nutrição',
    icon: '🥗',
    precoMin: 90,
    precoMax: 150,
    descricao: 'Orientação nutricional e planos alimentares'
  }
};

export default function AgendamentoEspecialidade() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');
  const [valorLance, setValorLance] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [urgencia, setUrgencia] = useState('normal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pegar especialidade da URL
    const params = new URLSearchParams(window.location.search);
    const especialidade = params.get('especialidade');
    if (especialidade && especialidades[especialidade as keyof typeof especialidades]) {
      setEspecialidadeSelecionada(especialidade);
      const esp = especialidades[especialidade as keyof typeof especialidades];
      setValorLance(esp.precoMin.toString());
    }
  }, []);

  const especialidadeInfo = especialidadeSelecionada ? 
    especialidades[especialidadeSelecionada as keyof typeof especialidades] : null;

  const handleSubmit = async () => {
    if (!especialidadeSelecionada || !valorLance || !sintomas) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para continuar',
        variant: 'destructive'
      });
      return;
    }

    if (parseInt(valorLance) < (especialidadeInfo?.precoMin || 80)) {
      toast({
        title: 'Valor muito baixo',
        description: `O valor mínimo para ${especialidadeInfo?.nome} é R$ ${especialidadeInfo?.precoMin}`,
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Salvar lance no localStorage
      const lance = {
        id: Date.now(),
        especialidade: especialidadeSelecionada,
        especialidadeNome: especialidadeInfo?.nome,
        valor: parseInt(valorLance),
        sintomas,
        urgencia,
        data: new Date().toISOString(),
        status: 'aguardando'
      };

      const lancesExistentes = JSON.parse(localStorage.getItem('lances') || '[]');
      lancesExistentes.push(lance);
      localStorage.setItem('lances', JSON.stringify(lancesExistentes));

      toast({
        title: 'Lance enviado com sucesso!',
        description: `Seu lance de R$ ${valorLance} para ${especialidadeInfo?.nome} foi enviado. Aguarde os médicos responderem.`
      });

      // Redirecionar para página de aguardo
      setTimeout(() => {
        setLocation('/patient-bidding');
      }, 2000);

    } catch (error) {
      toast({
        title: 'Erro ao enviar lance',
        description: 'Tente novamente em alguns instantes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setLocation('/especialidades.html')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar às Especialidades
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Especialidade */}
          <div className="lg:col-span-1">
            {especialidadeInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{especialidadeInfo.icon}</span>
                    {especialidadeInfo.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{especialidadeInfo.descricao}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Faixa de Preço:</span>
                      <span className="text-blue-600 font-bold">
                        R$ {especialidadeInfo.precoMin} - {especialidadeInfo.precoMax}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Tempo Médio:</span>
                      <span className="text-green-600 font-bold">30-45 min</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Resposta:</span>
                      <span className="text-orange-600 font-bold">2-24 horas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Formulário de Agendamento */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fazer Lance para Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seletor de Especialidade */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="inline mr-2 h-4 w-4" />
                    Especialidade Médica
                  </label>
                  <Select value={especialidadeSelecionada} onValueChange={setEspecialidadeSelecionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(especialidades).map(([key, esp]) => (
                        <SelectItem key={key} value={key}>
                          {esp.icon} {esp.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Valor do Lance */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <DollarSign className="inline mr-2 h-4 w-4" />
                    Valor do Seu Lance (R$)
                  </label>
                  <Input
                    type="number"
                    value={valorLance}
                    onChange={(e) => setValorLance(e.target.value)}
                    placeholder={`Mínimo: R$ ${especialidadeInfo?.precoMin || 80}`}
                    min={especialidadeInfo?.precoMin || 80}
                    max={especialidadeInfo?.precoMax || 300}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Quanto maior o valor, mais médicos irão se interessar pelo seu caso
                  </p>
                </div>

                {/* Descrição dos Sintomas */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <FileText className="inline mr-2 h-4 w-4" />
                    Descreva seus sintomas ou motivo da consulta
                  </label>
                  <Textarea
                    value={sintomas}
                    onChange={(e) => setSintomas(e.target.value)}
                    placeholder="Descreva detalhadamente seus sintomas, quando começaram, intensidade, etc."
                    rows={4}
                  />
                </div>

                {/* Urgência */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="inline mr-2 h-4 w-4" />
                    Nível de Urgência
                  </label>
                  <Select value={urgencia} onValueChange={setUrgencia}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">🟢 Baixa - Pode aguardar alguns dias</SelectItem>
                      <SelectItem value="normal">🟡 Normal - Preferível em 24-48h</SelectItem>
                      <SelectItem value="alta">🟠 Alta - Preciso hoje ou amanhã</SelectItem>
                      <SelectItem value="urgente">🔴 Urgente - Preciso em poucas horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Botão de Envio */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !especialidadeSelecionada || !valorLance || !sintomas}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Enviando Lance...' : 'Enviar Lance para Médicos'}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Após enviar, você receberá ofertas de médicos qualificados</p>
                  <p>Você poderá avaliar perfil, experiência e escolher o melhor profissional</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}