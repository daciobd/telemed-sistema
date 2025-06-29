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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TeleMed</h1>
                <p className="text-sm text-gray-500">Sistema</p>
              </div>
            </div>
            <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
              Entrar no Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Sistema de
            <span className="text-blue-600"> Telemedicina</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Plataforma completa para gestão de consultas médicas, prontuários eletrônicos 
            e teleconsultas. Conectando pacientes e profissionais de saúde.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleLogin} 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Acessar Plataforma
            </Button>
            <div className="flex gap-3">
              <Button 
                onClick={() => setLocation('/video-test')}
                variant="outline"
                size="lg"
                className="text-lg px-6 py-3 border-green-600 text-green-600 hover:bg-green-50"
              >
                <Video className="h-5 w-5 mr-2" />
                Testar Videoconsulta
              </Button>
              <Button 
                onClick={() => setLocation('/register-doctor')}
                variant="outline"
                size="lg"
                className="text-lg px-6 py-3 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Stethoscope className="h-5 w-5 mr-2" />
                Sou Médico
              </Button>
              <Button 
                onClick={() => setLocation('/register-patient')}
                variant="outline"
                size="lg"
                className="text-lg px-6 py-3 border-green-600 text-green-600 hover:bg-green-50"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Sou Paciente
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
