import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard do Paciente',
  description: 'Painel do paciente para consultas e histórico médico'
}

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Dashboard do Paciente
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Próximas Consultas */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Próximas Consultas
              </h2>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="font-medium">Dr. Silva - Cardiologia</p>
                  <p className="text-sm text-gray-600">20/07/2025 - 14:00</p>
                </div>
              </div>
            </div>

            {/* Histórico Médico */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Histórico Médico
              </h2>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <p className="font-medium">Consulta Geral</p>
                  <p className="text-sm text-gray-600">15/07/2025 - Dr. Santos</p>
                </div>
              </div>
            </div>

            {/* Prescrições */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Prescrições
              </h2>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="font-medium">Medicamento ABC</p>
                  <p className="text-sm text-gray-600">Prescrição ativa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                Agendar Consulta
              </button>
              <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                Ver Receitas
              </button>
              <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                Exames
              </button>
              <button className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors">
                Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}