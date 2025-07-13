import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  FileText,
  Pill,
  Video,
  Clock,
  CheckCircle,
  Activity,
  Heart,
  Stethoscope,
  Settings,
  LogOut,
  PlayCircle,
  X
} from "lucide-react";

export default function OnboardingDemo() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const tourSteps = [
    { title: 'Bem-vindo ao TeleMed!', description: 'Este é seu dashboard principal onde você pode acessar todas as funcionalidades.' },
    { title: 'Consultas', description: 'Agende e gerencie suas consultas médicas online.' },
    { title: 'Prontuário', description: 'Acesse seu histórico médico completo.' },
    { title: 'Receitas', description: 'Visualize suas prescrições médicas.' },
    { title: 'Videoconsultas', description: 'Realize consultas por vídeo com seus médicos.' },
    { title: 'Configurações', description: 'Personalize sua experiência na plataforma.' }
  ];

  const startTour = () => {
    setShowWelcome(false);
    setShowTour(true);
    setTourStep(0);
  };

  const nextStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
    }
  };

  const skipTour = () => {
    setShowWelcome(false);
    setShowTour(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
              <span className="ml-3 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                ✅ v2.0 Onboarding FUNCIONANDO
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Olá, João Silva</span>
              <Button 
                onClick={() => setShowTour(true)}
                variant="outline"
                size="sm"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Repetir Tour
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 m-4 max-w-lg w-full">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao TeleMed!</h2>
                <p className="text-gray-600 mb-6">
                  Sua plataforma completa de telemedicina. Vamos fazer um tour rápido pelas principais funcionalidades?
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Video className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Videoconsultas</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Prontuário Digital</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Pill className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Receitas Online</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="font-medium">Agendamento</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={skipTour} variant="outline" className="flex-1">
                  Pular por agora
                </Button>
                <Button onClick={startTour} className="flex-1">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Começar Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{tourSteps[tourStep]?.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{tourStep + 1} / {tourSteps.length}</span>
                <Button 
                  onClick={() => setShowTour(false)} 
                  variant="ghost" 
                  size="sm"
                  className="p-1 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{tourSteps[tourStep]?.description}</p>
            <div className="mb-4">
              <Progress value={(tourStep + 1) / tourSteps.length * 100} />
            </div>
            <div className="flex justify-between">
              <Button onClick={() => setShowTour(false)} variant="outline" size="sm">
                Pular Tour
              </Button>
              <Button onClick={nextStep} size="sm">
                {tourStep < tourSteps.length - 1 ? 'Próximo' : 'Concluir'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Sistema de Onboarding Funcionando! 🎉</h1>
              <p className="text-blue-100">
                Gentle onboarding experience implementado com sucesso. Tour guiado, welcome modal e progress tracking.
              </p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Welcome Modal</p>
                  <p className="text-lg font-semibold text-green-600">✅ OK</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Guided Tour</p>
                  <p className="text-lg font-semibold text-green-600">✅ OK</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress Tracking</p>
                  <p className="text-lg font-semibold text-green-600">✅ OK</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">UI Components</p>
                  <p className="text-lg font-semibold text-green-600">✅ OK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="hover:shadow-lg transition-all duration-200" data-tour="appointments">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Consultas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Agende suas consultas online com médicos especialistas
              </p>
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Consultas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200" data-tour="medical-records">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Prontuário</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Acesse seu histórico médico completo
              </p>
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Ver Prontuário
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200" data-tour="prescriptions">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Receitas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Visualize suas prescrições médicas
              </p>
              <Button className="w-full" variant="outline">
                <Pill className="w-4 h-4 mr-2" />
                Ver Receitas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Checklist */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">Sistema Operacional - Onboarding v2.0</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>✅ Welcome Modal: Implementado</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>✅ Guided Tour: 6 etapas funcionais</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>✅ Progress Bar: Tracking implementado</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>✅ UI Components: shadcn/ui funcionando</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>✅ Layout Responsivo: Mobile + Desktop</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>🚀 Próximo: Feature #2 (Videoconsultas)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}