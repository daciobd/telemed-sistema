import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard do Médico',
  description: 'Painel médico para gerenciar consultas e pacientes'
}

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Dashboard do Médico
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agenda do Dia */}
            <div className="lg:col-span-2 bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Agenda do Dia - 18/07/2025
              </h2>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 flex justify-between items-center">
                  <div>
                    <p className="font-medium">João Silva - Consulta Geral</p>
                    <p className="text-sm text-gray-600">14:00 - 14:30</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Iniciar
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Maria Santos - Cardiologia</p>
                    <p className="text-sm text-gray-600">15:00 - 15:30</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Aguardando
                  </button>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Consultas Hoje
                </h3>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Pacientes Ativos
                </h3>
                <p className="text-3xl font-bold text-purple-600">147</p>
              </div>
            </div>
          </div>

          {/* Ferramentas Médicas */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ferramentas Médicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 transition-colors">
                Prescrições MEMED
              </button>
              <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                Prontuário Eletrônico
              </button>
              <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                Solicitar Exames
              </button>
              <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors">
                Relatórios
              </button>
            </div>
          </div>

          {/* Pacientes Recentes */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pacientes Recentes
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Última Consulta</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">João Silva</td>
                      <td className="py-2">15/07/2025</td>
                      <td className="py-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Finalizada
                        </span>
                      </td>
                      <td className="py-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          Ver Prontuário
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}