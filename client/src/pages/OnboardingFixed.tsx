import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  FileText,
  Pill,
  Video,
  Heart,
  Stethoscope,
  Settings,
  LogOut,
  PlayCircle,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function OnboardingFixed() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  const tourSteps = [
    { 
      title: 'Bem-vindo ao TeleMed!', 
      description: 'Este é seu dashboard principal onde você pode acessar todas as funcionalidades médicas.',
      highlight: '.welcome-section'
    },
    { 
      title: 'Consultas Médicas', 
      description: 'Agende e gerencie suas consultas médicas online com especialistas.',
      highlight: '[data-tour="appointments"]'
    },
    { 
      title: 'Prontuário Eletrônico', 
      description: 'Acesse seu histórico médico completo e seguro.',
      highlight: '[data-tour="medical-records"]'
    },
    { 
      title: 'Receitas Digitais', 
      description: 'Visualize e baixe suas prescrições médicas digitais.',
      highlight: '[data-tour="prescriptions"]'
    },
    { 
      title: 'Videoconsultas', 
      description: 'Realize consultas por vídeo com seus médicos especialistas.',
      highlight: '[data-tour="video"]'
    },
    { 
      title: 'Parabéns!', 
      description: 'Você concluiu o tour! Agora pode explorar todas as funcionalidades da plataforma.',
      highlight: null
    }
  ];

  const startTour = () => {
    console.log('🎯 Iniciando tour...');
    setShowWelcome(false);
    setShowTour(true);
    setTourStep(0);
    setTourCompleted(false);
  };

  const nextStep = () => {
    console.log('🎯 Próximo passo:', tourStep + 1);
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      // Tour concluído
      setTourCompleted(true);
      setShowTour(false);
    }
  };

  const prevStep = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const skipTour = () => {
    console.log('🎯 Tour pulado');
    setShowWelcome(false);
    setShowTour(false);
  };

  const closeTour = () => {
    setShowTour(false);
  };

  // Highlight current step element
  useEffect(() => {
    if (showTour && tourSteps[tourStep]?.highlight) {
      const element = document.querySelector(tourSteps[tourStep].highlight);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight effect
        element.classList.add('tour-highlight');
        return () => element.classList.remove('tour-highlight');
      }
    }
  }, [showTour, tourStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CSS for tour highlighting */}
      <style>{`
        .tour-highlight {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
          border-radius: 8px !important;
          position: relative !important;
          z-index: 10 !important;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
              <span className="ml-3 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                ✅ Sistema Funcionando
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Olá, João Silva</span>
              <Button 
                onClick={() => {
                  setShowTour(true);
                  setTourStep(0);
                }}
                variant="outline"
                size="sm"
                className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Iniciar Tour
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
          <div className="bg-white rounded-lg p-8 m-4 max-w-lg w-full text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Bem-vindo ao TeleMed!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua plataforma completa de telemedicina. Gostaria de fazer um tour pelas principais funcionalidades?
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={startTour} className="bg-blue-600 hover:bg-blue-700">
                <PlayCircle className="h-4 w-4 mr-2" />
                Começar Tour
              </Button>
              <Button onClick={skipTour} variant="outline">
                Pular Tour
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-end justify-center md:items-center md:justify-end">
          <div className="bg-white rounded-t-lg md:rounded-lg p-6 m-4 max-w-sm w-full md:mr-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {tourSteps[tourStep]?.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    Passo {tourStep + 1} de {tourSteps.length}
                  </span>
                </div>
              </div>
              <Button 
                onClick={closeTour} 
                variant="ghost" 
                size="sm"
                className="p-1 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-gray-600 mb-4">
              {tourSteps[tourStep]?.description}
            </p>
            
            <div className="mb-4">
              <Progress value={(tourStep + 1) / tourSteps.length * 100} className="h-2" />
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={prevStep} 
                variant="outline" 
                size="sm"
                disabled={tourStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex gap-2">
                <Button onClick={skipTour} variant="ghost" size="sm">
                  Pular
                </Button>
                <Button onClick={nextStep} size="sm" className="flex items-center gap-2">
                  {tourStep === tourSteps.length - 1 ? 'Concluir' : 'Próximo'}
                  {tourStep < tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tour Completed Modal */}
      {tourCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 m-4 max-w-md w-full text-center">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tour Concluído!
              </h2>
              <p className="text-gray-600">
                Parabéns! Você conheceu as principais funcionalidades do TeleMed. 
                Agora pode explorar a plataforma livremente.
              </p>
            </div>
            <Button 
              onClick={() => setTourCompleted(false)} 
              className="bg-green-600 hover:bg-green-700"
            >
              Começar a usar
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="welcome-section bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Sistema de Telemedicina Completo 🏥</h1>
              <p className="text-blue-100">
                Acesse consultas, prontuários, receitas e videochamadas médicas em uma plataforma segura.
              </p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="hover:shadow-lg transition-all duration-200" data-tour="appointments">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Consultas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Agende consultas online com médicos especialistas
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

          <Card className="hover:shadow-lg transition-all duration-200" data-tour="video">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg">Videoconsultas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Consultas por vídeo com médicos
              </p>
              <Button className="w-full" variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Iniciar Vídeo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Card */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Sistema Operacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Tour Guiado Funcionando</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Navegação por Etapas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Interface Responsiva</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}