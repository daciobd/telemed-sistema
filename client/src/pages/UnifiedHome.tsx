
import React from 'react';
import { Link } from 'wouter';
import { UnifiedNavigation } from '../components/UnifiedNavigation';

export default function UnifiedHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <UnifiedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TeleMed + Health Connect
          </h1>
          <p className="text-xl text-gray-600">
            Sistema Unificado de Telemedicina - Duas plataformas, uma experiência completa
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* TeleMed Sistema */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">TeleMed Sistema</h2>
            <p className="text-gray-600 mb-6">
              Plataforma original com AI médica, consultas de vídeo e sistema de notificações.
            </p>
            <div className="space-y-3">
              <Link href="/consulta?consultationId=demo">
                <div className="block p-3 bg-emerald-100 rounded hover:bg-emerald-200 transition-colors">
                  🎥 Video Consulta
                </div>
              </Link>
              <Link href="/consulta?consultationId=demo">
                <div className="block p-3 bg-emerald-100 rounded hover:bg-emerald-200 transition-colors">
                  🤖 Consulta com IA
                </div>
              </Link>
              <Link href="/api/status">
                <div className="block p-3 bg-emerald-100 rounded hover:bg-emerald-200 transition-colors">
                  📊 Status do Sistema
                </div>
              </Link>
            </div>
          </div>

          {/* Health Connect */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Health Connect</h2>
            <p className="text-gray-600 mb-6">
              Módulo avançado com gestão de pacientes, exames e consultas especializadas.
            </p>
            <div className="space-y-3">
              <Link href="/health-connect/patients">
                <div className="block p-3 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
                  👥 Gestão de Pacientes
                </div>
              </Link>
              <Link href="/health-connect/consultation">
                <div className="block p-3 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
                  🩺 Consulta Especializada
                </div>
              </Link>
              <Link href="/health-connect/exam-request">
                <div className="block p-3 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
                  🔬 Solicitação de Exames
                </div>
              </Link>
            </div>
          </div>
          
        </div>

        {/* Status da Integração */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">🔗 Integração Concluída</h3>
            <p className="mb-4">
              TeleMed e Health Connect agora funcionam como um sistema unificado
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-lg font-bold">66+</div>
                <div>Componentes UI</div>
              </div>
              <div>
                <div className="text-lg font-bold">2</div>
                <div>Sistemas Integrados</div>
              </div>
              <div>
                <div className="text-lg font-bold">100%</div>
                <div>Funcional</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
