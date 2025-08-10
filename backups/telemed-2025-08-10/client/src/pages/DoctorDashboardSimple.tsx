import { useState } from 'react';

export default function DoctorDashboardSimple() {
  const [activeTab, setActiveTab] = useState("overview");

  const openTelemonitoramento = () => {
    window.location.href = '/telemonitoramento-enfermagem';
  };

  const openCentroAvaliacao = () => {
    window.location.href = '/centro-avaliacao';
  };

  const openDrAI = () => {
    window.location.href = '/dr-ai';
  };

  const generatePDFReport = () => {
    alert('🎯 Função de PDF em desenvolvimento!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                🏥 TeleMed Sistema
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Painel Médico</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Bom dia, Dr. Carlos Mendes! 👨‍⚕️
            </h2>
            <p className="text-blue-100">
              Você tem 3 consultas pendentes hoje e 5 já concluídas.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📊</div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Avaliação: 4.8/5.0
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    Receita: R$ 1250
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📅</div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Consultas Hoje
                  </div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">✅</div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Concluídas
                  </div>
                  <div className="text-2xl font-bold text-gray-900">5</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">⏳</div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">
                    Pendentes
                  </div>
                  <div className="text-2xl font-bold text-gray-900">3</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                🚀 Ações Rápidas
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={openTelemonitoramento}
                  className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-semibold">Telemonitoramento</div>
                  <div className="text-sm opacity-90">
                    Acompanhamento de enfermagem
                  </div>
                </button>

                <button
                  onClick={openCentroAvaliacao}
                  className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="font-semibold">Centro de Avaliação</div>
                  <div className="text-sm opacity-90">
                    Testes psiquiátricos e triagem
                  </div>
                </button>

                <button
                  onClick={openDrAI}
                  className="bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-semibold">Dr. AI</div>
                  <div className="text-sm opacity-90">
                    Assistente inteligente médico
                  </div>
                </button>

                <button
                  onClick={generatePDFReport}
                  className="bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-semibold">Relatórios PDF</div>
                  <div className="text-sm opacity-90">
                    Gerar relatórios médicos
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Centro de Avaliação Psiquiátrica */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-indigo-200">
              <h3 className="text-lg font-medium text-indigo-900">
                🧠 Centro de Avaliação Psiquiátrica
              </h3>
              <p className="text-sm text-indigo-700 mt-1">
                Ferramentas especializadas para triagem e diagnóstico
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/gad7-ansiedade"
                  className="bg-white border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-indigo-900 mb-2">
                    😰 GAD-7
                  </div>
                  <div className="text-sm text-indigo-700">
                    Transtorno de Ansiedade Generalizada
                  </div>
                </a>

                <a
                  href="/phq9-depressao"
                  className="bg-white border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-indigo-900 mb-2">
                    😔 PHQ-9
                  </div>
                  <div className="text-sm text-indigo-700">
                    Escala de Depressão
                  </div>
                </a>

                <a
                  href="/mdq-bipolar"
                  className="bg-white border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-indigo-900 mb-2">
                    🔄 MDQ
                  </div>
                  <div className="text-sm text-indigo-700">
                    Transtorno Bipolar
                  </div>
                </a>

                <a
                  href="/tdah-asrs18"
                  className="bg-white border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-indigo-900 mb-2">
                    🎯 TDAH-ASRS18
                  </div>
                  <div className="text-sm text-indigo-700">
                    Déficit de Atenção e Hiperatividade
                  </div>
                </a>

                <a
                  href="/pss10-stress"
                  className="bg-white border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-indigo-900 mb-2">
                    😤 PSS-10
                  </div>
                  <div className="text-sm text-indigo-700">
                    Escala de Estresse Percebido
                  </div>
                </a>

                <a
                  href="/triagem-psiquiatrica"
                  className="bg-white border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-indigo-900 mb-2">
                    🔍 Triagem
                  </div>
                  <div className="text-sm text-indigo-700">
                    Triagem Psiquiátrica Completa
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Telemonitoramento Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="px-6 py-4 border-b border-blue-200">
              <h3 className="text-lg font-medium text-blue-900">
                🏥 Sistema de Telemonitoramento
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Acompanhamento remoto de pacientes 24/7
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/telemonitoramento-enfermagem"
                  className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-lg font-semibold text-blue-900 mb-2">
                    👩‍⚕️ Enfermagem
                  </div>
                  <div className="text-sm text-blue-700">
                    Acompanhamento de enfermagem especializado
                  </div>
                </a>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="text-lg font-semibold text-blue-900 mb-2">
                    📊 Métricas
                  </div>
                  <div className="text-sm text-blue-700">
                    Pacientes Ativos: 12 | Alertas: 2 | Status: Operacional
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}