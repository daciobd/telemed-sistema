import React from 'react';

export default function LandingPageUnified() {
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header Navigation */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex items-center py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">TeleMed</span>
                <span className="text-sm text-gray-500 ml-2">início</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex space-x-6">
              <button onClick={() => handleNavigation('/nossos-servicos')} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Nossos Serviços
              </button>
              <button onClick={() => handleNavigation('/beneficios')} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Benefícios
              </button>
              <button onClick={() => handleNavigation('/para-medicos')} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Para Médicos
              </button>
              <button onClick={() => handleNavigation('/testagens')} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Testagens
              </button>
              <button onClick={() => handleNavigation('/quem-somos')} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Quem Somos
              </button>
              <button onClick={() => handleNavigation('/contato')} className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Contato
              </button>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <button onClick={() => handleNavigation('/login')} className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/agendar-consulta')} 
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="lg:pr-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              Cuide da Sua<br />
              Saúde com<br />
              <span className="text-emerald-500">Inteligência<br />Artificial</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Acesse consultas rápidas, triagem por IA e monitoramento 24/7 com 
              TeleMed Sistema.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleNavigation('/triagem-gratis')}
                className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Triagem Grátis
              </button>
              <button 
                onClick={() => handleNavigation('/agendar-consulta')}
                className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Agendar Consulta
              </button>
            </div>
          </div>

          {/* Right Content - Triagem Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-10 border border-indigo-100 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full"></div>
            
            <div className="text-center mb-10 relative z-10">
              {/* Icon with exact colors from image */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-emerald-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Triagem Psiquiátrica IA</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Primeiro sistema do Brasil com IA especializada em saúde mental.
              </p>
            </div>

            {/* Features list with exact styling from image */}
            <div className="space-y-5 mb-10">
              <div className="flex items-center text-gray-800 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-4 shadow-sm flex-shrink-0"></div>
                <span className="font-semibold text-lg">Avaliação em 5 minutos</span>
              </div>
              <div className="flex items-center text-gray-800 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-4 shadow-sm flex-shrink-0"></div>
                <span className="font-semibold text-lg">Relatório médico completo</span>
              </div>
              <div className="flex items-center text-gray-800 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-4 shadow-sm flex-shrink-0"></div>
                <span className="font-semibold text-lg">Encaminhamento especializado</span>
              </div>
            </div>

            <button 
              onClick={() => handleNavigation('/triagem-psiquiatrica')}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:scale-95"
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