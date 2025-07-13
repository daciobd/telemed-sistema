import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

import { AuthButtons } from '@/components/auth/AuthButtons';
import { 
  Stethoscope, 
  Clock, 
  Shield, 
  Award, 
  Video, 
  FileText,
  Brain,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  Zap
} from 'lucide-react';

export default function ImprovedLandingPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    setLocation('/login');
  };

  const handleRegister = () => {
    setLocation('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    } else {
      handleLogin();
    }
  };

  const handleScheduleConsultation = () => {
    if (isAuthenticated) {
      setLocation('/appointments');
    } else {
      handleLogin();
    }
  };

  const handleVideoConsultation = () => {
    if (isAuthenticated) {
      setLocation('/teleconsult-workflow');
    } else {
      handleLogin();
    }
  };

  const handleTestDemo = () => {
    if (isAuthenticated) {
      setLocation('/demo-management');
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-teal-800/95 backdrop-blur-sm text-white p-4 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6" />
            <span className="font-bold text-xl">TeleMed Sistema</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#funcionalidades" className="hover:text-teal-200 transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-teal-200 transition-colors">Como Funciona</a>
            <a href="#especialidades" className="hover:text-teal-200 transition-colors">Especialidades</a>
            
            <AuthButtons />
          </div>
        </div>
      </nav>

      {/* Hero Section Enhanced */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                  🚀 Sistema Completo de Telemedicina
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-teal-900 leading-tight">
                  Atendimento Médico
                  <span className="text-teal-600"> Inteligente</span>
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Plataforma completa com leilão reverso, teleconsultas especializadas, 
                  prescrições digitais integradas e assistente IA para análise de sintomas.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {!isAuthenticated ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={handleLogin}
                    >
                      🩺 Entrar no Sistema
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50"
                      onClick={handleRegister}
                    >
                      📝 Criar Conta
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => setLocation('/dashboard')}
                  >
                    🏥 Ir para Dashboard
                  </Button>
                )}
                
                {isAuthenticated ? (
                  <>
                    <Button 
                      size="lg" 
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={handleScheduleConsultation}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Agendar Consulta
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-teal-600 text-teal-600 hover:bg-teal-50"
                      onClick={handleVideoConsultation}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Teleconsulta Imediata
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-teal-600 text-teal-600 hover:bg-teal-50"
                    onClick={() => setLocation('/video-test')}
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Testar Videoconsulta
                  </Button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">LGPD Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Prescrições Válidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">20+ Especialistas</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Médico em teleconsulta" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                      alt="Dr. Carlos Mendes" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <h3 className="font-semibold">Dr. Carlos Mendes</h3>
                      <p className="text-white/90 text-sm">Cardiologista • 15 anos exp.</p>
                    </div>
                    <Badge className="bg-green-500 text-white ml-auto">Online</Badge>
                  </div>
                  
                  <p className="text-white/95 text-sm italic">
                    "Sistema revolucionário que permite flexibilidade total no atendimento."
                  </p>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-teal-600">98%</div>
                    <div className="text-xs text-gray-600">Satisfação</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">15min</div>
                    <div className="text-xs text-gray-600">Atendimento</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-xs text-gray-600">Disponível</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-teal-900 mb-6">
                Tecnologia de Ponta em Telemedicina
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>VideoConsultas WebRTC de alta qualidade</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Assistente IA para análise de sintomas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Prescrições digitais integradas MEMED</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Sistema de leilão reverso transparente</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Tecnologia médica avançada" 
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-teal-600/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section id="funcionalidades" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-teal-900 mb-4">
              Funcionalidades Inovadoras
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema completo que vai além das teleconsultas tradicionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-teal-100 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-teal-500 to-teal-600 relative">
                <img 
                  src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Leilão reverso" 
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-teal-900">Leilão Reverso Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Você define o valor e os médicos avaliam. Sistema único que permite 
                  atendimento imediato ou agendamento flexível.
                </p>
                <div className="flex items-center gap-2 text-sm text-teal-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Transparência total de preços</span>
                </div>
                <Button 
                  size="sm" 
                  className="mt-3 w-full bg-teal-600 hover:bg-teal-700"
                  onClick={handleVideoConsultation}
                >
                  Testar Leilão
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-purple-500 to-purple-600 relative">
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Assistente IA" 
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-purple-900">Assistente IA Médico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Análise inteligente de sintomas, determinação de urgência e 
                  sugestões de condições antes da consulta.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Triagem automática 24/7</span>
                </div>
                <Link to="/ai-assistant">
                  <Button size="sm" className="mt-3 w-full bg-purple-600 hover:bg-purple-700">
                    Testar IA
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-green-500 to-green-600 relative">
                <img 
                  src="https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Prescrições digitais" 
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-900">Prescrições MEMED</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Integração completa com MEMED para prescrições digitais válidas, 
                  busca de medicamentos e templates.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Juridicamente válidas</span>
                </div>
                <Link to="/prescriptions">
                  <Button size="sm" className="mt-3 w-full bg-green-600 hover:bg-green-700">
                    Ver MEMED
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">VideoConsultas WebRTC</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Videochamadas de alta qualidade com chat, compartilhamento de tela 
                  e gravação para prontuário.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Tecnologia P2P avançada</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-900">Psiquiatria Especializada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Avaliações PHQ-9 e GAD-7, questionários pré-consulta e fluxo 
                  flexível com análise de risco automática.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <CheckCircle className="h-4 w-6" />
                  <span>Protocolo científico validado</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-900">Exames e Encaminhamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Sistema completo para solicitação de exames clínicos e 
                  encaminhamentos para especialistas.
                </p>
                <div className="flex items-center gap-2 text-sm text-indigo-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Workflow integrado</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Doctor Testimonial with Image */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Dra. Ana Silva" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
                <div>
                  <h3 className="text-xl font-semibold">Dra. Ana Silva</h3>
                  <p className="text-white/80">Cardiologista • São Paulo</p>
                </div>
              </div>
              <blockquote className="text-xl italic mb-6">
                "O sistema revolucionou minha prática médica. Posso atender pacientes 
                quando estou disponível, com total autonomia sobre minha agenda. 
                A tecnologia é impressionante e os pacientes adoram a flexibilidade."
              </blockquote>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-semibold">5.0 • Mais de 500 consultas</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Médica em teleconsulta" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-white/10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section id="como-funciona" className="py-16 px-4 bg-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-teal-900 mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">Processo simples e transparente</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Descreva seus sintomas",
                description: "IA analisa e sugere urgência",
                icon: Brain
              },
              {
                step: "2", 
                title: "Defina valor e tipo",
                description: "Leilão reverso ou agendamento",
                icon: Zap
              },
              {
                step: "3",
                title: "Médicos respondem",
                description: "Aceite imediato ou proposta",
                icon: Users
              },
              {
                step: "4",
                title: "Consulta completa",
                description: "Prescrição, exames e seguimento",
                icon: FileText
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-teal-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-teal-900 mb-4">Especialidades Disponíveis</h2>
            <p className="text-xl text-gray-600">Médicos experientes em todas as áreas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Cardiologia", icon: "❤️", count: 2, route: "/appointments" },
              { name: "Dermatologia", icon: "🧴", count: 2, route: "/appointments" },
              { name: "Endocrinologia", icon: "🧬", count: 2, route: "/appointments" },
              { name: "Neurologia", icon: "🧠", count: 2, route: "/appointments" },
              { name: "Psiquiatria", icon: "🧘", count: 2, route: "/psychiatric-evaluation" },
              { name: "Ortopedia", icon: "🦴", count: 2, route: "/appointments" },
              { name: "Pediatria", icon: "👶", count: 2, route: "/appointments" },
              { name: "Ginecologia", icon: "🌸", count: 2, route: "/appointments" },
              { name: "Urologia", icon: "💧", count: 2, route: "/appointments" },
              { name: "Gastro", icon: "🫁", count: 2, route: "/appointments" }
            ].map((specialty, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  if (isAuthenticated) {
                    setLocation(specialty.route);
                  } else {
                    handleLogin();
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{specialty.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{specialty.name}</h3>
                  <p className="text-sm text-gray-600">{specialty.count} especialistas</p>
                  <Button size="sm" className="mt-2 w-full" variant="outline">
                    Consultar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Success Stories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-teal-900 mb-4">Histórias de Sucesso</h2>
            <p className="text-xl text-gray-600">Pacientes reais, resultados reais</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="João M." 
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="italic text-gray-600 mb-4">
                  "Consegui uma consulta cardiológica em 20 minutos. 
                  O médico foi muito atencioso e recebi a receita digital na hora."
                </p>
                <div className="font-semibold text-teal-900">João M.</div>
                <div className="text-sm text-gray-500">Consulta Cardiológica</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b550?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Marina F." 
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="italic text-gray-600 mb-4">
                  "O sistema de leilão é genial. Defini meu orçamento e 
                  encontrei um dermatologista experiente pelo preço justo."
                </p>
                <div className="font-semibold text-teal-900">Marina F.</div>
                <div className="text-sm text-gray-500">Consulta Dermatológica</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                  alt="Roberto S." 
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="italic text-gray-600 mb-4">
                  "A avaliação psiquiátrica pré-consulta foi muito útil. 
                  Chegei na consulta já com meu perfil analisado."
                </p>
                <div className="font-semibold text-teal-900">Roberto S.</div>
                <div className="text-sm text-gray-500">Consulta Psiquiátrica</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-600 via-green-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Pronto para experimentar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Acesse nosso sistema completo de telemedicina e teste todas as funcionalidades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-teal-600 hover:bg-gray-100"
              onClick={handleTestDemo}
              disabled={isLoading}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Testar Sistema Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-teal-600"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              {isAuthenticated ? 'Ir ao Dashboard' : 'Começar Agora'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-6 w-6" />
                <span className="font-bold text-xl">TeleMed Sistema</span>
              </div>
              <p className="text-teal-200 mb-4">
                Plataforma completa de telemedicina com tecnologia avançada e foco na experiência do usuário.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Funcionalidades</h4>
              <ul className="space-y-2 text-teal-200">
                <li>
                  <button 
                    onClick={handleVideoConsultation}
                    className="hover:text-white transition-colors"
                  >
                    Leilão Reverso
                  </button>
                </li>
                <li>
                  <Link to="/ai-assistant" className="hover:text-white transition-colors">
                    Assistente IA
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleVideoConsultation}
                    className="hover:text-white transition-colors"
                  >
                    VideoConsultas
                  </button>
                </li>
                <li>
                  <Link to="/prescriptions" className="hover:text-white transition-colors">
                    Prescrições MEMED
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Especialidades</h4>
              <ul className="space-y-2 text-teal-200">
                <li>
                  <button 
                    onClick={handleScheduleConsultation}
                    className="hover:text-white transition-colors"
                  >
                    Cardiologia
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (isAuthenticated) {
                        setLocation('/psychiatric-evaluation');
                      } else {
                        handleLogin();
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Psiquiatria
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleScheduleConsultation}
                    className="hover:text-white transition-colors"
                  >
                    Dermatologia
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleScheduleConsultation}
                    className="hover:text-white transition-colors"
                  >
                    Neurologia
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-teal-200">
                <li>Suporte Técnico</li>
                <li>Política de Privacidade</li>
                <li>Termos de Uso</li>
                <li>LGPD</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-teal-700 mt-8 pt-8 text-center text-teal-200">
            <p>&copy; 2025 TeleMed Sistema - Tecnologia avançada em telemedicina</p>
          </div>
        </div>
      </footer>
    </div>
  );
}