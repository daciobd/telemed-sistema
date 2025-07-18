import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding - TeleMed Pro',
  description: 'Bem-vindo à plataforma TeleMed Pro - Configure sua conta'
}

export default function OnboardingFixed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bem-vindo ao TeleMed Pro!
            </h1>
            <p className="text-xl text-gray-600">
              Vamos configurar sua conta em poucos passos
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Progresso</span>
              <span className="text-sm font-medium text-blue-600">3 de 4 etapas</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>

          {/* Current Step */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">
              Etapa 3: Configurações de Conta
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuário
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Paciente</option>
                  <option>Médico</option>
                  <option>Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidade (Médicos)
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Clínica Geral</option>
                  <option>Cardiologia</option>
                  <option>Dermatologia</option>
                  <option>Pediatria</option>
                  <option>Psiquiatria</option>
                  <option>Outra</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Rua, número, bairro, cidade, estado, CEP"
              ></textarea>
            </div>
          </div>

          {/* Completed Steps Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h3 className="font-semibold text-green-800">Dados Básicos</h3>
              </div>
              <p className="text-sm text-green-600">Nome, email e senha configurados</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h3 className="font-semibold text-green-800">Verificação</h3>
              </div>
              <p className="text-sm text-green-600">Email verificado com sucesso</p>
            </div>
          </div>

          {/* Next Step Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Próxima Etapa: Configurações de Notificação
            </h3>
            <p className="text-gray-600">
              Configure como deseja receber notificações sobre consultas, receitas e lembretes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Voltar
            </button>
            <div className="space-x-4">
              <button className="px-6 py-3 text-blue-600 hover:text-blue-800 transition-colors">
                Pular por Agora
              </button>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Continuar
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Precisa de ajuda?</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">Suporte</a>
              <span>•</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">FAQ</a>
              <span>•</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">Chat</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}