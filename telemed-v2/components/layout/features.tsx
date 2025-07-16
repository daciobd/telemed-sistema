'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, FileText, Shield, Clock, Users, CreditCard, Phone, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Video,
    title: 'Videoconsultas HD',
    description: 'Consultas médicas em alta definição com tecnologia WebRTC P2P, criptografia end-to-end e gravação segura.',
    stats: 'HD 1080p',
    color: 'bg-blue-500',
  },
  {
    icon: FileText,
    title: 'Prescrições MEMED',
    description: 'Integração oficial com MEMED para prescrições digitais válidas, com assinatura digital e rastreabilidade.',
    stats: '98% sucesso',
    color: 'bg-green-500',
  },
  {
    icon: Users,
    title: 'Gestão de Pacientes',
    description: 'Prontuário eletrônico completo com histórico médico, exames, medicamentos e agenda integrada.',
    stats: '342 pacientes',
    color: 'bg-purple-500',
  },
  {
    icon: Shield,
    title: 'Segurança LGPD',
    description: 'Proteção completa de dados pessoais, criptografia avançada e conformidade com todas as regulamentações.',
    stats: 'LGPD Compliant',
    color: 'bg-red-500',
  },
  {
    icon: Clock,
    title: 'Agenda 24/7',
    description: 'Sistema de agendamento inteligente com notificações automáticas e sincronização com calendário.',
    stats: '24/7 disponível',
    color: 'bg-indigo-500',
  },
  {
    icon: CreditCard,
    title: 'Pagamentos Seguros',
    description: 'Processamento de pagamentos com Stripe, PIX instantâneo e sistema de cobrança automática.',
    stats: 'Stripe + PIX',
    color: 'bg-yellow-500',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tecnologia Médica Avançada
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plataforma completa com todas as funcionalidades necessárias para modernizar 
              o atendimento médico e melhorar a experiência do paciente.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="medical-card hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="medical-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Notificações WhatsApp</h3>
                  <p className="text-gray-600">Alertas automáticos para consultas</p>
                </div>
              </div>
              <p className="text-gray-600">
                Sistema integrado de notificações que envia lembretes automáticos para 
                médicos e pacientes via WhatsApp, garantindo que nenhuma consulta seja perdida.
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">IA Médica</h3>
                  <p className="text-gray-600">Assistente inteligente integrado</p>
                </div>
              </div>
              <p className="text-gray-600">
                Assistente médico com inteligência artificial que auxilia no diagnóstico, 
                sugere tratamentos e otimiza o tempo de consulta com insights baseados em dados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}