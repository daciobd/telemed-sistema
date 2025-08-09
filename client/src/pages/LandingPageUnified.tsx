import React from 'react';

export default function LandingPageUnified() {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/logo-telemed.png" alt="TeleMed" className="h-8 w-auto mr-2" onError={(e) => {(e.target as HTMLElement).style.display = 'none'}} />
              <span className="text-xl font-bold text-gray-900">TeleMed</span>
              <span className="text-sm text-gray-500 ml-1">início</span>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => handleNavigation('/nossos-servicos')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Nossos Serviços
              </button>
              <button onClick={() => handleNavigation('/beneficios')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Benefícios
              </button>
              <button onClick={() => handleNavigation('/para-medicos')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Para Médicos
              </button>
              <button onClick={() => handleNavigation('/testagens')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Testagens
              </button>
              <button onClick={() => handleNavigation('/quem-somos')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Quem Somos
              </button>
              <button onClick={() => handleNavigation('/contato')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Contato
              </button>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <button onClick={() => handleNavigation('/login')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/agendar-consulta')} 
                className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="text-sm text-gray-500">
          <span>Início</span> 
          <span className="mx-2">&gt;</span> 
          <span>Saúde IA</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Cuide da Sua<br />
              Saúde com<br />
              <span className="text-green-500">Inteligência<br />Artificial</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Acesse consultas rápidas, triagem por IA e monitoramento 24/7 com 
              TeleMed Sistema.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleNavigation('/triagem-gratis')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🩺</span>
                Triagem Grátis
              </button>
              <button 
                onClick={() => handleNavigation('/agendar-consulta')}
                className="border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center"
              >
                <span className="mr-2">📅</span>
                Agendar Consulta
              </button>
            </div>
          </div>

          {/* Right Content - Triagem Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Triagem Psiquiátrica IA</h3>
              <p className="text-gray-600">
                Primeiro sistema do Brasil com IA especializada em saúde mental.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Avaliação em 5 minutos
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Relatório médico completo
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Encaminhamento especializado
              </div>
            </div>

            <button 
              onClick={() => handleNavigation('/triagem-psiquiatrica')}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Começar Triagem Grátis
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cuidado Completo em Saúde
            </h2>
            <p className="text-lg text-gray-600">
              Tecnologia avançada para seu bem-estar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Teleconsultas */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => handleNavigation('/teleconsultas')}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📹</span>
                <h3 className="text-lg font-semibold">Teleconsultas</h3>
              </div>
              <p className="text-sm">Consulte médicos especialistas via videochamada segura</p>
            </div>

            {/* Prontuário Digital */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => handleNavigation('/prontuario-digital')}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📋</span>
                <h3 className="text-lg font-semibold">Prontuário Digital</h3>
              </div>
              <p className="text-sm">Histórico médico completo e organizado</p>
            </div>

            {/* Receitas Digitais */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => handleNavigation('/receitas-digitais')}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">💊</span>
                <h3 className="text-lg font-semibold">Receitas Digitais</h3>
              </div>
              <p className="text-sm">Prescrições válidas em todo território nacional</p>
            </div>

            {/* IA Médica */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => handleNavigation('/ia-medica')}>
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🤖</span>
                <h3 className="text-lg font-semibold">IA Médica</h3>
              </div>
              <p className="text-sm">Triagem inteligente e análise de sintomas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2.500+</div>
              <div className="text-gray-600">Médicos Especialistas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">150k+</div>
              <div className="text-gray-600">Consultas Realizadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">75k+</div>
              <div className="text-gray-600">Pacientes Atendidos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">40+</div>
              <div className="text-gray-600">Especialidades</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-green-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Comece Sua Jornada de Saúde Hoje
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Acesso imediato a especialistas e tecnologia de ponta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleNavigation('/patient-bidding')}
              className="bg-white text-green-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Fazer Lance por Consulta
            </button>
            <button 
              onClick={() => handleNavigation('/doctor-dashboard')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-500 transition-colors"
            >
              Área Médica
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}