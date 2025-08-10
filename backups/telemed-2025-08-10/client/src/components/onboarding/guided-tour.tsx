import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  Pills, 
  Video,
  Settings,
  ChevronRight,
  CheckCircle,
  BookOpen,
  Lightbulb
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao TeleMed',
    description: 'Este tour rápido irá mostrar as principais funcionalidades da plataforma de telemedicina.',
    target: 'body',
    icon: <BookOpen className="w-5 h-5" />,
    position: 'top'
  },
  {
    id: 'dashboard',
    title: 'Dashboard Principal',
    description: 'Visão geral das suas atividades, estatísticas e acesso rápido às funcionalidades.',
    target: '[data-tour="dashboard"]',
    icon: <Calendar className="w-5 h-5" />,
    position: 'bottom'
  },
  {
    id: 'appointments',
    title: 'Gerenciar Consultas',
    description: 'Agende, visualize e gerencie suas consultas médicas presenciais e por teleconsulta.',
    target: '[data-tour="appointments"]',
    icon: <Calendar className="w-5 h-5" />,
    position: 'right'
  },
  {
    id: 'patients',
    title: 'Pacientes',
    description: 'Acesse o cadastro de pacientes, histórico médico e informações de contato.',
    target: '[data-tour="patients"]',
    icon: <Users className="w-5 h-5" />,
    position: 'right'
  },
  {
    id: 'medical-records',
    title: 'Prontuário Eletrônico',
    description: 'Visualize e edite prontuários médicos de forma segura e organizada.',
    target: '[data-tour="medical-records"]',
    icon: <FileText className="w-5 h-5" />,
    position: 'right'
  },
  {
    id: 'prescriptions',
    title: 'Prescrições MEMED',
    description: 'Integração com MEMED para prescrições digitais válidas e busca de medicamentos.',
    target: '[data-tour="prescriptions"]',
    icon: <Pills className="w-5 h-5" />,
    position: 'right'
  },
  {
    id: 'video-consultation',
    title: 'Videoconsultas',
    description: 'Realize consultas por vídeo com qualidade profissional, chat e compartilhamento de tela.',
    target: '[data-tour="video-consultation"]',
    icon: <Video className="w-5 h-5" />,
    position: 'right'
  },
  {
    id: 'settings',
    title: 'Configurações',
    description: 'Personalize suas preferências, dados profissionais e configurações da conta.',
    target: '[data-tour="settings"]',
    icon: <Settings className="w-5 h-5" />,
    position: 'top'
  }
];

interface GuidedTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  userType: 'doctor' | 'patient';
}

export default function GuidedTour({ isVisible, onComplete, onSkip, userType }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsActive(true);
      setCurrentStep(0);
    }
  }, [isVisible]);

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  if (!isActive || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Tour Overlay */}
      <div className="relative w-full h-full">
        
        {/* Tour Card */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60">
          <Card className="w-96 max-w-[90vw] shadow-2xl border-2 border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentTourStep.icon}
                  <CardTitle className="text-lg">
                    {currentTourStep.title}
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Passo {currentStep + 1} de {tourSteps.length}</span>
                  <span>{Math.round(progress)}% completo</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {currentTourStep.description}
              </p>

              {/* Tour Features */}
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Videoconsultas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Prontuário Digital</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Prescrições MEMED</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Segurança LGPD</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                  )}
                  
                  <Button variant="ghost" onClick={handleSkip}>
                    Pular Tour
                  </Button>
                </div>

                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Finalizar
                    </>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}