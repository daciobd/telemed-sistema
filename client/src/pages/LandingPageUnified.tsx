import React from 'react';

export default function LandingPageUnified() {
  const stats = [
    { label: "Médicos Ativos", value: "2.500+" },
    { label: "Consultas Realizadas", value: "150.000+" },
    { label: "Pacientes Cadastrados", value: "75.000+" },
    { label: "Especialidades", value: "40+" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              TeleMed Sistema
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Transformando o cuidado médico através da tecnologia
            </p>
            <p className="text-lg mb-10 max-w-3xl mx-auto text-blue-50">
              Conecte-se com especialistas, gerencie sua saúde e tenha acesso a cuidados médicos de qualidade, 
              onde quer que esteja. Nossa plataforma integra tecnologia de ponta com o cuidado humano.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center"
                onClick={() => window.location.href = '/patient-dashboard'}
              >
                ❤️ Sou Paciente
              </button>
              <button 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                onClick={() => window.location.href = '/doctor-dashboard'}
              >
                🩺 Sou Médico
              </button>
              <button 
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center"
                onClick={() => window.location.href = '/patient-bidding'}
              >
                💰 Fazer Lance
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para cuidados de saúde modernos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 features-section">
            {/* Card Teleconsultas - Verde */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">📹</span>
                <h3 className="text-lg font-semibold">Teleconsultas Seguras</h3>
              </div>
              <p>Consulte médicos especialistas através de videochamadas criptografadas e seguras</p>
            </div>

            {/* Card Prontuário - Azul */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">📋</span>
                <h3 className="text-lg font-semibold">Prontuário Digital</h3>
              </div>
              <p>Acesse seu histórico médico completo de forma segura e organizada</p>
            </div>

            {/* Card Receitas - Laranja */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">💊</span>
                <h3 className="text-lg font-semibold">Receitas Digitais</h3>
              </div>
              <p>Receba prescrições médicas digitais válidas em todo território nacional</p>
            </div>

            {/* Card Conformidade - Roxo */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🔒</span>
                <h3 className="text-lg font-semibold">Conformidade LGPD</h3>
              </div>
              <p>Seus dados médicos protegidos com máxima segurança e privacidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Números que Falam por Si
            </h2>
            <p className="text-lg text-blue-100">
              A confiança de milhares de usuários em todo o Brasil
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pronto para Transformar sua Experiência de Saúde?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Junte-se a milhares de pacientes e médicos que já confiam no TeleMed Sistema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              onClick={() => window.location.href = '/patient-bidding'}
            >
              Começar Agora
            </button>
            <button 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => window.location.href = '/login'}
            >
              Fazer Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TeleMed Sistema</h3>
              <p className="text-gray-300">
                Revolucionando o cuidado médico através da tecnologia e inovação.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="/login" className="text-gray-300 hover:text-white transition-colors">Entrar</a></li>
                <li><a href="/patient-dashboard" className="text-gray-300 hover:text-white transition-colors">Área do Paciente</a></li>
                <li><a href="/doctor-dashboard" className="text-gray-300 hover:text-white transition-colors">Área Médica</a></li>
                <li><a href="/security" className="text-gray-300 hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-300">
                📞 0800-123-4567<br/>
                📧 contato@telemedsis.com.br<br/>
                🌐 www.telemedsis.com.br
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 TeleMed Sistema. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}