import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-teal-800">
              Entrar
            </Button>
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
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Consulta
                </Button>
                <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                  <Video className="h-5 w-5 mr-2" />
                  Teleconsulta Imediata
                </Button>
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
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. Carlos Mendes</h3>
                      <p className="text-gray-600">Cardiologista • 15 anos exp.</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 ml-auto">Online</Badge>
                  </div>
                  
                  <div className="border-l-4 border-teal-200 pl-4">
                    <p className="text-gray-700">
                      "Sistema revolucionário que permite flexibilidade total no atendimento. 
                      Posso aceitar consultas imediatas ou agendar conforme minha disponibilidade."
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                    </div>
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                      Consultar Agora
                    </Button>
                  </div>
                </div>
              </div>
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
            <Card className="border-teal-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
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
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
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
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
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
              { name: "Cardiologia", icon: "❤️", count: 2 },
              { name: "Dermatologia", icon: "🧴", count: 2 },
              { name: "Endocrinologia", icon: "🧬", count: 2 },
              { name: "Neurologia", icon: "🧠", count: 2 },
              { name: "Psiquiatria", icon: "🧘", count: 2 },
              { name: "Ortopedia", icon: "🦴", count: 2 },
              { name: "Pediatria", icon: "👶", count: 2 },
              { name: "Ginecologia", icon: "🌸", count: 2 },
              { name: "Urologia", icon: "💧", count: 2 },
              { name: "Gastro", icon: "🫁", count: 2 }
            ].map((specialty, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{specialty.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{specialty.name}</h3>
                  <p className="text-sm text-gray-600">{specialty.count} especialistas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para experimentar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Acesse nosso sistema completo de telemedicina e teste todas as funcionalidades
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
              <Calendar className="h-5 w-5 mr-2" />
              Testar Sistema Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
              <ArrowRight className="h-5 w-5 mr-2" />
              Ver Demonstração
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
                <li>Leilão Reverso</li>
                <li>Assistente IA</li>
                <li>VideoConsultas</li>
                <li>Prescrições MEMED</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Especialidades</h4>
              <ul className="space-y-2 text-teal-200">
                <li>Cardiologia</li>
                <li>Psiquiatria</li>
                <li>Dermatologia</li>
                <li>Neurologia</li>
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