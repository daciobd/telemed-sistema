'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Dr. Ana Silva',
    role: 'Cardiologista',
    image: '/avatars/dr-ana.jpg',
    rating: 5,
    text: 'A plataforma revolucionou minha prática médica. As videoconsultas são cristalinas e a integração com MEMED facilita muito as prescrições.',
    specialty: 'Cardiologia',
    experience: '15 anos',
  },
  {
    name: 'Maria Santos',
    role: 'Paciente',
    image: '/avatars/maria.jpg',
    rating: 5,
    text: 'Excelente experiência! Consegui uma consulta rápida e recebi minha prescrição digital na hora. Muito prático e seguro.',
    condition: 'Hipertensão',
    consultations: '8 consultas',
  },
  {
    name: 'Dr. João Mendes',
    role: 'Pediatra',
    image: '/avatars/dr-joao.jpg',
    rating: 5,
    text: 'O sistema é intuitivo e confiável. Meus pacientes adoram a facilidade de marcar consultas e a qualidade do atendimento digital.',
    specialty: 'Pediatria',
    experience: '12 anos',
  },
  {
    name: 'Carlos Oliveira',
    role: 'Paciente',
    image: '/avatars/carlos.jpg',
    rating: 5,
    text: 'Atendimento excepcional! A consulta foi tão eficiente quanto presencial. Recomendo a todos que precisam de cuidados médicos.',
    condition: 'Diabetes',
    consultations: '12 consultas',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Depoimentos de Usuários
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Médicos e pacientes que já experimentaram a transformação digital 
              do atendimento médico através da nossa plataforma.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="medical-card hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="h-8 w-8 text-blue-300" />
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {testimonial.specialty || testimonial.condition} • {testimonial.experience || testimonial.consultations}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <Card className="medical-card">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Confiança e Segurança
                </h3>
                <p className="text-gray-600">
                  Certificações e conformidades que garantem a qualidade do serviço
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">CFM Aprovado</h4>
                  <p className="text-sm text-gray-600">Conselho Federal de Medicina</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">LGPD Compliant</h4>
                  <p className="text-sm text-gray-600">Proteção de dados garantida</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">ISO 27001</h4>
                  <p className="text-sm text-gray-600">Segurança da informação</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">HIPAA Ready</h4>
                  <p className="text-sm text-gray-600">Padrões internacionais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}