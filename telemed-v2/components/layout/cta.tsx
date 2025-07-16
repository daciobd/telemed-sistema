'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const benefits = [
  'Configuração em 5 minutos',
  'Suporte técnico 24/7',
  'Treinamento incluído',
  'Sem taxa de setup',
]

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* CTA Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-blue-200" />
              <span className="text-blue-200 font-medium">
                Comece sua jornada digital
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Transforme sua
              <br />
              <span className="text-blue-200">Prática Médica</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Junte-se a centenas de médicos que já modernizaram seu atendimento 
              com nossa plataforma completa de telemedicina.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-blue-100">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                asChild
              >
                <Link href="/auth/register">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/demo">
                  Agendar Demo
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* CTA Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Teste Grátis por 30 dias
                  </h3>
                  <p className="text-blue-100">
                    Experimente todas as funcionalidades sem compromisso
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white">
                    <span>Videoconsultas ilimitadas</span>
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span>Prescrições MEMED</span>
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span>Suporte prioritário</span>
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <span>Treinamento incluído</span>
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">R$ 0</div>
                    <div className="text-blue-100 text-sm">
                      Primeiro mês gratuito
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}