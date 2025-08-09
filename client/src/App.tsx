import React from 'react';

// Temporary simplified App to test React rendering
function App() {
  console.log("✅ App component rendering...");
  
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
              <button className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Nossos Serviços
              </button>
              <button className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Benefícios
              </button>
              <button className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-emerald-50">
                Para Médicos
              </button>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors duration-200">
                Login
              </button>
              <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg">
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Cuide da Sua Saúde com{' '}
              <span className="text-emerald-600">Inteligência Artificial</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Conecte-se com médicos especializados através da nossa plataforma de telemedicina. 
              Consultas online, prescrições digitais e acompanhamento personalizado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                Agende Sua Consulta
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                Saiba Mais
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Consulta Rápida</h3>
                  <p className="text-sm text-gray-600">Atendimento em minutos</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-sm text-gray-700 font-medium">🩺 Triagem Inteligente</p>
                  <p className="text-xs text-gray-600 mt-1">IA analisa seus sintomas em tempo real</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-sm text-gray-700 font-medium">💊 Prescrições Digitais</p>
                  <p className="text-xs text-gray-600 mt-1">Receitas válidas em qualquer farmácia</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-sm text-gray-700 font-medium">📱 Acompanhamento 24/7</p>
                  <p className="text-xs text-gray-600 mt-1">Monitoramento contínuo da sua saúde</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;