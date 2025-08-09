import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Stethoscope,
  Heart,
  Shield,
  Video,
  FileText,
  Pill,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Globe,
  Users,
  Award
} from "lucide-react";

export default function LandingPageUnified() {
  const features = [
    {
      icon: Video,
      title: "Teleconsultas Seguras",
      description: "Consulte médicos especialistas através de videochamadas criptografadas e seguras"
    },
    {
      icon: FileText,
      title: "Prontuário Digital",
      description: "Acesse seu histórico médico completo de forma segura e organizada"
    },
    {
      icon: Pill,
      title: "Receitas Digitais",
      description: "Receba prescrições médicas digitais válidas em todo território nacional"
    },
    {
      icon: Shield,
      title: "Conformidade LGPD",
      description: "Seus dados médicos protegidos com máxima segurança e privacidade"
    }
  ];

  const testimonials = [
    {
      name: "Dra. Maria Santos",
      role: "Cardiologista",
      content: "A plataforma TeleMed revolutionou minha prática médica. Posso atender mais pacientes mantendo a qualidade do atendimento.",
      rating: 5
    },
    {
      name: "João Silva",
      role: "Paciente",
      content: "Consegui uma consulta de cardiologia em 24 horas. O médico foi excelente e o sistema é muito fácil de usar.",
      rating: 5
    },
    {
      name: "Dr. Carlos Mendes",
      role: "Clínico Geral",
      content: "Interface intuitiva e funcionalidades completas. Recomendo para qualquer profissional da saúde.",
      rating: 5
    }
  ];

  const stats = [
    { value: "5000+", label: "Consultas Realizadas" },
    { value: "500+", label: "Médicos Certificados" },
    { value: "98%", label: "Satisfação dos Pacientes" },
    { value: "24/7", label: "Suporte Disponível" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TeleMed Sistema</h1>
                <p className="text-sm text-gray-600">Saúde Digital Profissional</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => window.location.href = '/login'}>
                Entrar
              </Button>
              <Button onClick={() => window.location.href = '/doctor-dashboard'}>
                Área Médica
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4">
            Conformidade LGPD • Certificação CFM
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Telemedicina de
            <span className="text-blue-600"> Qualidade Mundial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conectamos pacientes e médicos através de uma plataforma segura, 
            intuitiva e completa para cuidados de saúde digitais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" onClick={() => window.location.href = '/patient-dashboard'}>
              <Heart className="mr-2 h-5 w-5" />
              Sou Paciente
            </Button>
            <Button size="lg" variant="outline" className="px-8" onClick={() => window.location.href = '/doctor-dashboard'}>
              <Stethoscope className="mr-2 h-5 w-5" />
              Sou Médico
            </Button>
            <Button size="lg" variant="secondary" className="px-8 bg-green-600 hover:bg-green-700 text-white border-0" onClick={() => window.location.href = '/patient-bidding'}>
              💰 Fazer Lance
            </Button>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Depoimentos Reais
            </h2>
            <p className="text-lg text-gray-600">
              Veja o que médicos e pacientes dizem sobre nossa plataforma
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Revolucionar seus Cuidados de Saúde?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Junte-se a milhares de usuários que já confiam no TeleMed Sistema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" onClick={() => window.location.href = '/patient-dashboard'}>
              Começar como Paciente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8" onClick={() => window.location.href = '/doctor-dashboard'}>
              Cadastrar como Médico
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">TeleMed Sistema</span>
              </div>
              <p className="text-gray-400">
                Conectando saúde e tecnologia para um futuro melhor.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Pacientes</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/patient-dashboard" className="hover:text-white">Dashboard</a></li>
                <li><a href="/appointments" className="hover:text-white">Consultas</a></li>
                <li><a href="/medical-records" className="hover:text-white">Prontuário</a></li>
                <li><a href="/prescriptions" className="hover:text-white">Receitas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Médicos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/doctor-dashboard" className="hover:text-white">Dashboard</a></li>
                <li><a href="/patients" className="hover:text-white">Pacientes</a></li>
                <li><a href="/teleconsults" className="hover:text-white">Teleconsultas</a></li>
                <li><a href="/security" className="hover:text-white">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> (11) 3333-4444</li>
                <li className="flex items-center"><Globe className="h-4 w-4 mr-2" /> telemed.com.br</li>
                <li><a href="/security" className="hover:text-white">Política LGPD</a></li>
                <li><a href="/security" className="hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© 2025 TeleMed Sistema. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-gray-400 border-gray-400">
                <Shield className="h-3 w-3 mr-1" />
                LGPD Compliant
              </Badge>
              <Badge variant="outline" className="text-gray-400 border-gray-400">
                <Award className="h-3 w-3 mr-1" />
                CFM Certificado
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}