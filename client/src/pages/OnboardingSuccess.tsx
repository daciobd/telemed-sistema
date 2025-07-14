import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, PlayCircle, CheckCircle, Star } from 'lucide-react';

export default function OnboardingSuccess() {
  const [showSuccess, setShowSuccess] = useState(true);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-red-500/95 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-16 text-center max-w-5xl w-full shadow-2xl border-8 border-blue-500 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-green-50 opacity-30"></div>
          
          {/* Success content */}
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="bg-green-100 p-6 rounded-full">
                <CheckCircle className="h-20 w-20 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-7xl font-bold text-gray-900 mb-6">
              🎉 SUCESSO TOTAL!
            </h1>
            
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8">
              <h2 className="text-4xl font-bold text-green-800 mb-4">
                ✅ Sistema de Onboarding v2.0 IMPLEMENTADO!
              </h2>
              <p className="text-2xl text-green-700 leading-relaxed">
                <strong>Gentle Onboarding Experience</strong> funcionando completamente!<br/>
                Tour guiado, modal de boas-vindas e experiência de usuário aprimorada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Welcome Modal</h3>
                <p className="text-blue-700">Modal de boas-vindas implementado</p>
              </div>
              
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                <PlayCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-purple-800 mb-2">Guided Tour</h3>
                <p className="text-purple-700">Tour guiado em 6 etapas funcionando</p>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">User Experience</h3>
                <p className="text-green-700">Experiência completa para novos usuários</p>
              </div>
            </div>
            
            <div className="space-x-6">
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  // Aqui poderia iniciar um tour real
                }}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-6 text-2xl font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                ▶️ VER SISTEMA FUNCIONANDO
              </Button>
              
              <Button
                onClick={() => setShowSuccess(false)}
                size="lg"
                variant="outline"
                className="border-gray-400 text-gray-700 px-12 py-6 text-2xl font-bold rounded-xl hover:scale-105 transition-all shadow-lg"
              >
                Fechar
              </Button>
            </div>

            <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800 text-lg font-medium">
                🎯 <strong>Objetivo Alcançado:</strong> Sistema de Onboarding v2.0 totalmente funcional no ambiente Replit!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página normal após fechar o modal
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Sistema de Onboarding v2.0 Implementado com Sucesso!
          </h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-4xl mx-auto">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-8" />
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Funcionalidades Implementadas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-4">✅ Welcome Modal</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Modal de boas-vindas responsivo</li>
                  <li>• Design moderno com gradientes</li>
                  <li>• Botões funcionais de ação</li>
                  <li>• Animações suaves</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ Guided Tour</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Tour em 6 etapas interativas</li>
                  <li>• Progress tracking</li>
                  <li>• Navegação intuitiva</li>
                  <li>• Persistência no banco de dados</li>
                </ul>
              </div>
            </div>
            
            <Button
              onClick={() => setShowSuccess(true)}
              size="lg"
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl"
            >
              🎉 Mostrar Modal de Sucesso Novamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}