import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Users, FileText, Shield, Video, Stethoscope, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 animate-slide-up">
              <div className="w-12 h-12 bg-gradient-medical rounded-xl flex items-center justify-center shadow-medical">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TeleMed</h1>
                <p className="text-sm text-blue-200">Sistema</p>
              </div>
            </div>
            <Button 
              onClick={handleLogin} 
              className="btn-medical hover-glow animate-fade-in"
              style={{animationDelay: '0.5s'}}
            >
              Entrar no Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-20">
          {/* Main title with gradient text */}
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
              <span className="block text-white mb-4">Sistema de</span>
              <span className="block text-gradient-medical bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse-medical">
                Telemedicina
              </span>
            </h1>
          </div>
          
          {/* Enhanced description */}
          <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
            <p className="mt-8 max-w-3xl mx-auto text-xl text-blue-100 leading-relaxed">
              Plataforma completa para gestão de consultas médicas, prontuários eletrônicos 
              e teleconsultas. <span className="text-white font-semibold">Conectando pacientes e profissionais de saúde</span> 
              com tecnologia de ponta.
            </p>
          </div>
          
          {/* BOTÕES DE TESTE ESPECIAIS */}
          <div className="mt-8 mb-8 p-6 bg-yellow-400/20 backdrop-blur-sm rounded-lg border border-yellow-300 animate-fade-in">
            <h3 className="text-2xl font-bold text-yellow-100 mb-4">🧪 ACESSO DIRETO PARA TESTES</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/test-demo"}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200 text-lg"
              >
                🧪 TEST DEMO API
              </button>
              <button
                onClick={() => window.location.href = "/medical-records"}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-200 text-lg"
              >
                📋 MEDICAL RECORDS
              </button>
            </div>
            <p className="text-yellow-200 text-sm mt-3">
              Acesso direto às funcionalidades sem necessidade de login
            </p>
          </div>

          {/* CTA Buttons with enhanced styling */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Button 
              onClick={handleLogin} 
              size="lg"
              className="btn-medical text-xl px-10 py-4 shadow-medical hover-glow group"
            >
              <span className="group-hover:scale-110 transition-transform">🩺</span>
              <span className="ml-2">Acessar Plataforma</span>
            </Button>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => setLocation('/video-test')}
                variant="outline"
                size="lg"
                className="glass-card text-lg px-8 py-4 border-green-400/50 text-green-300 hover:text-green-100 hover:border-green-300 hover-lift group transition-all duration-300"
              >
                <Video className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Testar Videoconsulta</span>
              </Button>
              <Button 
                onClick={() => setLocation('/register-doctor')}
                variant="outline"
                size="lg"
                className="glass-card text-lg px-8 py-4 border-blue-400/50 text-blue-300 hover:text-blue-100 hover:border-blue-300 hover-lift group transition-all duration-300"
              >
                <Stethoscope className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Sou Médico</span>
              </Button>
              <Button 
                onClick={() => setLocation('/register-patient')}
                variant="outline"
                size="lg"
                className="glass-card text-lg px-8 py-4 border-purple-400/50 text-purple-300 hover:text-purple-100 hover:border-purple-300 hover-lift group transition-all duration-300"
              >
                <UserPlus className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Sou Paciente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Agendamento Online
              </h3>
              <p className="text-gray-600">
                Sistema completo de agendamento de consultas com gestão de horários 
                e notificações automáticas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gestão de Pacientes
              </h3>
              <p className="text-gray-600">
                Cadastro completo de pacientes com histórico médico, 
                alergias e informações de contato.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Prontuários Eletrônicos
              </h3>
              <p className="text-gray-600">
                Registros médicos digitais seguros com prescrições, 
                diagnósticos e histórico de consultas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Teleconsultas
              </h3>
              <p className="text-gray-600">
                Consultas médicas à distância com qualidade e segurança, 
                conectando pacientes e médicos.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Segurança Total
              </h3>
              <p className="text-gray-600">
                Proteção completa dos dados médicos com criptografia 
                e conformidade com a LGPD.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cuidado Humanizado
              </h3>
              <p className="text-gray-600">
                Tecnologia a serviço do cuidado humano, facilitando 
                a conexão entre profissionais e pacientes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-center text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Interessado em Conhecer?
          </h2>
          <p className="text-lg mb-8 text-green-100">
            Entre em contato para agendar uma demonstração
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                const message = "Olá! Vi o TeleMed e gostaria de conhecer mais sobre a plataforma.";
                const phone = "5511999998888";
                const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                console.log("WhatsApp URL gerada:", whatsappUrl);
                window.open(whatsappUrl, '_blank');
              }}
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-3 shadow-lg"
            >
              📱 WhatsApp
            </Button>
            <Button 
              onClick={() => {
                window.location.href = 'mailto:contato@telemed.com.br?subject=Demonstração TeleMed';
              }}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-3"
            >
              📧 Email
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Acesse a plataforma e descubra como a telemedicina pode 
            transformar o atendimento médico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Entrar Agora
            </Button>
            <Button 
              onClick={() => window.location.href = '/demo-medico'}
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
            >
              Demo para Médicos
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 TeleMed Sistema. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
