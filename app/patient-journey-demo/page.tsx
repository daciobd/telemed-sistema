import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jornada do Paciente - Demo',
  description: 'Demonstração da jornada completa do paciente na plataforma'
}

export default function PatientJourneyDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Jornada do Paciente - Demonstração
          </h1>
          
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200"></div>
            
            {/* Etapa 1: Cadastro */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 text-right pr-8">
                <div className="bg-blue-50 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    1. Cadastro Inicial
                  </h3>
                  <p className="text-gray-600">
                    Paciente se registra na plataforma com dados básicos
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• Nome completo e CPF</li>
                    <li>• Dados de contato</li>
                    <li>• Plano de saúde (opcional)</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="flex-1 pl-8"></div>
            </div>

            {/* Etapa 2: Questionário */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="flex-1 text-left pl-8">
                <div className="bg-green-50 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    2. Questionário de Sintomas
                  </h3>
                  <p className="text-gray-600">
                    Preenchimento detalhado dos sintomas e histórico
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• Sintomas atuais</li>
                    <li>• Histórico médico</li>
                    <li>• Medicações em uso</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Etapa 3: Leilão Reverso */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 text-right pr-8">
                <div className="bg-purple-50 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    3. Leilão Reverso de Preços
                  </h3>
                  <p className="text-gray-600">
                    Médicos oferecem valores para a teleconsulta
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• Paciente define orçamento máximo</li>
                    <li>• Médicos qualificados fazem ofertas</li>
                    <li>• Sistema de avaliações</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="flex-1 pl-8"></div>
            </div>

            {/* Etapa 4: Consulta */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="flex-1 text-left pl-8">
                <div className="bg-orange-50 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-semibold text-orange-800 mb-2">
                    4. Videoconsulta
                  </h3>
                  <p className="text-gray-600">
                    Consulta médica por videoconferência
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• WebRTC para qualidade de vídeo</li>
                    <li>• Chat integrado</li>
                    <li>• Gravação (quando autorizada)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Etapa 5: Prescrição */}
            <div className="relative flex items-center mb-12">
              <div className="flex-1 text-right pr-8">
                <div className="bg-teal-50 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-semibold text-teal-800 mb-2">
                    5. Prescrição Digital
                  </h3>
                  <p className="text-gray-600">
                    Receita médica via integração MEMED
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• Assinatura digital certificada</li>
                    <li>• Envio via WhatsApp</li>
                    <li>• Válida em qualquer farmácia</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">5</span>
              </div>
              <div className="flex-1 pl-8"></div>
            </div>

            {/* Etapa 6: Acompanhamento */}
            <div className="relative flex items-center">
              <div className="flex-1 pr-8"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">6</span>
              </div>
              <div className="flex-1 text-left pl-8">
                <div className="bg-red-50 rounded-lg p-6 inline-block">
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    6. Acompanhamento
                  </h3>
                  <p className="text-gray-600">
                    Follow-up e evolução do tratamento
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• Lembretes de medicação</li>
                    <li>• Reavaliação agendada</li>
                    <li>• Histórico completo</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
              Iniciar Demonstração Interativa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}