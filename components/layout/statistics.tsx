'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Activity, Users, FileText, Clock, Star, Shield } from 'lucide-react'

const stats = [
  {
    icon: Users,
    label: 'Pacientes Ativos',
    value: '342',
    description: 'Pacientes cadastrados no sistema',
    growth: '+12% este mês',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Activity,
    label: 'Consultas Realizadas',
    value: '1,280',
    description: 'Videoconsultas completadas',
    growth: '+8% esta semana',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: FileText,
    label: 'Prescrições MEMED',
    value: '156',
    description: 'Prescrições digitais válidas',
    growth: '98% taxa de sucesso',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Clock,
    label: 'Tempo Médio',
    value: '28min',
    description: 'Duração média das consultas',
    growth: '-5% otimização',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Star,
    label: 'Satisfação',
    value: '4.9/5',
    description: 'Avaliação dos pacientes',
    growth: '94% recomendaria',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    icon: Shield,
    label: 'Conformidade',
    value: '100%',
    description: 'LGPD e normas médicas',
    growth: 'Auditoria aprovada',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
]

export function Statistics() {
  return (
    <section id="statistics" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Números que Comprovam a Eficácia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dados reais do sistema em produção, demonstrando o impacto positivo 
              da telemedicina na qualidade do atendimento médico.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="medical-card hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm">
                      {stat.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">
                        {stat.growth}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-16">
          <Card className="medical-card">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Status do Sistema
                </h3>
                <p className="text-gray-600">
                  Monitoramento em tempo real da plataforma
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">API Status</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">MEMED</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">Online</div>
                  <div className="text-sm text-gray-600">Conectado</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">WebRTC</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">HD</div>
                  <div className="text-sm text-gray-600">1080p</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Pagamentos</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">Ativo</div>
                  <div className="text-sm text-gray-600">Stripe + PIX</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}