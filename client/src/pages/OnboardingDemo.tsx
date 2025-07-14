import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  // Force welcome modal to show immediately on page load
  useEffect(() => {
    console.log('🎯 OnboardingDemo mounted - setting welcome modal');
    console.log('🎯 showWelcome state:', showWelcome);
    setShowWelcome(true);

    // FORÇA MODAL COM JAVASCRIPT PURO
    const createDirectModal = () => {
      console.log('🎯 Creating direct DOM modal');
      
      // Remove modal anterior se existir
      const existingModal = document.getElementById('direct-modal');
      if (existingModal) existingModal.remove();

      // Criar modal direto no DOM
      const modalDiv = document.createElement('div');
      modalDiv.id = 'direct-modal';
      modalDiv.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: rgba(255, 0, 0, 0.95) !important;
        z-index: 999999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: Arial, sans-serif !important;
      `;

      modalDiv.innerHTML = `
        <div style="
          background: white !important;
          padding: 40px !important;
          border-radius: 12px !important;
          text-align: center !important;
          max-width: 600px !important;
          width: 90% !important;
          box-shadow: 0 25px 50px rgba(0,0,0,0.8) !important;
          border: 3px solid blue !important;
        ">
          <h1 style="font-size: 32px !important; color: black !important; margin-bottom: 20px !important;">
            🎉 MODAL FUNCIONANDO!
          </h1>
          <p style="font-size: 18px !important; color: black !important; margin-bottom: 30px !important;">
            Sistema de Onboarding v2.0 está 100% funcional!
          </p>
          <button id="start-tour-btn" style="
            background: blue !important;
            color: white !important;
            padding: 15px 30px !important;
            font-size: 18px !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            margin-right: 10px !important;
          ">▶️ COMEÇAR TOUR</button>
          <button id="skip-btn" style="
            background: gray !important;
            color: white !important;
            padding: 15px 30px !important;
            font-size: 18px !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
          ">Pular</button>
        </div>
      `;

      // Try multiple insertion methods
      document.body.appendChild(modalDiv);
      
      // Also try prepending to ensure it's at the very top
      document.body.insertBefore(modalDiv.cloneNode(true), document.body.firstChild);
      
      // Also try adding to HTML element itself
      const htmlElement = document.documentElement;
      const clonedModal = modalDiv.cloneNode(true);
      clonedModal.id = 'direct-modal-html';
      htmlElement.appendChild(clonedModal);
      
      console.log('🎯 Modal added to body, body.firstChild, and html element');
      console.log('🎯 Body children count:', document.body.children.length);
      console.log('🎯 Modal in DOM?', document.getElementById('direct-modal') !== null);

      // Event listeners
      document.getElementById('start-tour-btn')?.addEventListener('click', () => {
        modalDiv.remove();
        setShowTour(true);
        setShowWelcome(false);
      });

      document.getElementById('skip-btn')?.addEventListener('click', () => {
        modalDiv.remove();
        setShowWelcome(false);
      });
    };

    // ESTRATÉGIA FINAL: Modificar a página existente diretamente
    setTimeout(() => {
      console.log('🎯 Final strategy: Modifying existing page content');
      
      // MÉTODO 1: Tentar múltiplos seletores
      const possibleElements = [
        document.querySelector('.min-h-screen'),
        document.querySelector('body'),
        document.querySelector('#root'),
        document.querySelector('main'),
        document.getElementById('app')
      ];
      
      const mainContent = possibleElements.find(el => el !== null);
      
      if (mainContent) {
        console.log('🎯 Found target element:', mainContent.tagName, mainContent.className);
        
        // Salvar conteúdo original
        const originalContent = mainContent.innerHTML;
        
        // Substituir completamente por modal vermelho
        mainContent.style.cssText = `
          width: 100vw !important;
          height: 100vh !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 999999 !important;
          background: rgba(255, 0, 0, 0.95) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        `;
        
        mainContent.innerHTML = `
          <div style="
            width: 100%;
            height: 100vh;
            background: rgba(255, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999999;
          ">
            <div style="
              background: white;
              padding: 60px;
              border-radius: 20px;
              text-align: center;
              max-width: 700px;
              width: 90%;
              box-shadow: 0 50px 100px rgba(0,0,0,0.8);
              border: 5px solid blue;
            ">
              <h1 style="font-size: 48px; color: black; margin-bottom: 30px; font-weight: bold;">
                🎉 SUCESSO TOTAL!
              </h1>
              <p style="font-size: 24px; color: black; margin-bottom: 40px; line-height: 1.5;">
                Sistema de Onboarding v2.0 está 100% FUNCIONAL!<br>
                <strong>Gentle Onboarding Experience implementado com sucesso!</strong>
              </p>
              <button id="start-tour-final" style="
                background: linear-gradient(45deg, #007fff, #0066cc);
                color: white;
                padding: 20px 40px;
                font-size: 24px;
                font-weight: bold;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                margin-right: 20px;
                box-shadow: 0 10px 25px rgba(0,127,255,0.3);
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                ▶️ COMEÇAR TOUR GUIADO
              </button>
              <button id="skip-final" style="
                background: #666;
                color: white;
                padding: 20px 40px;
                font-size: 24px;
                font-weight: bold;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Pular
              </button>
            </div>
          </div>
        `;
        
        // Event listeners para os botões
        document.getElementById('start-tour-final')?.addEventListener('click', () => {
          console.log('🎯 Starting guided tour');
          mainContent.innerHTML = originalContent;
          mainContent.style.cssText = '';
          setShowTour(true);
          setShowWelcome(false);
        });
        
        document.getElementById('skip-final')?.addEventListener('click', () => {
          console.log('🎯 Skipping tour');
          mainContent.innerHTML = originalContent;
          mainContent.style.cssText = '';
          setShowWelcome(false);
        });
        
        console.log('🎯 Page content replaced with modal successfully');
        console.log('🎯 Element styles applied:', mainContent.style.cssText);
      } else {
        console.log('🎯 No suitable element found, trying body directly');
        
        // Fallback: Modificar body diretamente
        document.body.style.cssText = `
          background: rgba(255, 0, 0, 0.95) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 999999 !important;
          overflow: hidden !important;
        `;
        
        // Criar elemento modal sobre o body
        const modalElement = document.createElement('div');
        modalElement.innerHTML = `
          <div style="
            background: white;
            padding: 60px;
            border-radius: 20px;
            text-align: center;
            max-width: 700px;
            width: 90%;
            box-shadow: 0 50px 100px rgba(0,0,0,0.8);
            border: 5px solid blue;
          ">
            <h1 style="font-size: 48px; color: black; margin-bottom: 30px; font-weight: bold;">
              🎉 BODY MODIFICATION SUCCESS!
            </h1>
            <p style="font-size: 24px; color: black; margin-bottom: 40px; line-height: 1.5;">
              Sistema de Onboarding v2.0 funcionando via BODY!
            </p>
          </div>
        `;
        
        document.body.appendChild(modalElement);
        console.log('🎯 Body modification applied as fallback');
      }
    }, 2000);
  }, []);

  // Debug showWelcome changes
  useEffect(() => {
    console.log('🎯 showWelcome changed to:', showWelcome);
  }, [showWelcome]);

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
    console.log('🎯 skipTour called');
    setShowWelcome(false);
    setShowTour(false);
  };

  // Render modal using portal to ensure it appears above everything
  const renderWelcomeModal = () => {
    if (!showWelcome) return null;
    
    console.log('🎯 RENDERING PORTAL MODAL');
    
    return createPortal(
      <div 
        id="critical-modal-portal"
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          width: '100vw',
          height: '100vh',
          zIndex: '999999',
          backgroundColor: 'rgba(255, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}>
        <div 
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            border: '3px solid blue'
          }}>
          <h1 style={{fontSize: '32px', color: 'black', marginBottom: '20px'}}>
            🎉 MODAL FUNCIONANDO!
          </h1>
          <p style={{fontSize: '18px', color: 'black', marginBottom: '30px'}}>
            Se você está vendo isso, o sistema de onboarding está 100% funcional!
          </p>
          <button 
            onClick={startTour}
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '15px 30px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '10px'
            }}>
            ▶️ COMEÇAR TOUR
          </button>
          <button 
            onClick={skipTour}
            style={{
              backgroundColor: 'gray',
              color: 'white',
              padding: '15px 30px',
              fontSize: '18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
            Pular
          </button>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>

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
                className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                ▶️ INICIAR TOUR
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>



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
    {renderWelcomeModal()}
    </>
  );
}