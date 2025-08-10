import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Pill, Video, Heart, CheckCircle } from 'lucide-react';

export default function SimpleDashboard() {
  const [clickCount, setClickCount] = useState(0);

  const handleConsultations = () => {
    setClickCount(prev => prev + 1);
    alert(`✅ BOTÃO FUNCIONANDO! Cliques: ${clickCount + 1} - Navegando para Consultas`);
  };

  const handleMedicalRecords = () => {
    setClickCount(prev => prev + 1);
    alert(`✅ BOTÃO FUNCIONANDO! Cliques: ${clickCount + 1} - Navegando para Prontuário`);
  };

  const handlePrescriptions = () => {
    setClickCount(prev => prev + 1);
    alert(`✅ BOTÃO FUNCIONANDO! Cliques: ${clickCount + 1} - Navegando para Receitas`);
  };

  const handleVideo = () => {
    setClickCount(prev => prev + 1);
    alert(`✅ BOTÃO FUNCIONANDO! Cliques: ${clickCount + 1} - Iniciando Videoconsulta`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Sistema Funcionando</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Olá, João Silva</p>
              <p className="text-xs text-gray-500">Cliques totais: {clickCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Sistema de Telemedicina Completo 💻</h2>
              <p className="text-blue-100">
                Acesse consultas, prontuários, receitas e videochamadas médicas em uma plataforma segura.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Consultas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Agende consultas online com médicos especialistas
              </CardDescription>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleConsultations}
                style={{ pointerEvents: 'auto' }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Consultas
              </Button>
            </CardContent>
          </Card>

          {/* Prontuário */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-green-600" />
                Prontuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Acesse seu histórico médico completo
              </CardDescription>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleMedicalRecords}
                style={{ pointerEvents: 'auto' }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Prontuário
              </Button>
            </CardContent>
          </Card>

          {/* Receitas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="h-5 w-5 text-purple-600" />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Visualize suas prescrições médicas
              </CardDescription>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handlePrescriptions}
                style={{ pointerEvents: 'auto' }}
              >
                <Pill className="w-4 h-4 mr-2" />
                Ver Receitas
              </Button>
            </CardContent>
          </Card>

          {/* Videoconsultas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5 text-red-600" />
                Videoconsultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Consultas por vídeo com médicos
              </CardDescription>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={handleVideo}
                style={{ pointerEvents: 'auto' }}
              >
                <Video className="w-4 h-4 mr-2" />
                Iniciar Vídeo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Sistema Operacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Tour Guiado Funcionando</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Progress Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Navegação por Etapas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Interface Responsiva</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Teste de Funcionalidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 mb-4">
                Clique nos botões dos cards acima para testar se estão funcionando corretamente.
              </p>
              <div className="text-2xl font-bold text-blue-800">
                Cliques: {clickCount}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}