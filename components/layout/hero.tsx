'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Video, FileText, Shield, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Heart className="h-6 w-6" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Telemedicina Profissional
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Conectando
                <span className="text-blue-600"> Médicos</span>
                <br />
                e <span className="text-blue-600">Pacientes</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Plataforma completa de telemedicina com videoconsultas seguras, 
                prescrições digitais MEMED e gestão inteligente de pacientes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="medical-button" asChild>
                <Link href="/auth/register">
                  Começar Agora
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dr-ai.html" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border-0">
                  <Video className="w-4 h-4 mr-2" />
                  Triagem com IA
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">
                  Ver Demonstração
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">342</div>
                <div className="text-sm text-gray-600">Pacientes Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,280</div>
                <div className="text-sm text-gray-600">Consultas Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Satisfação</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Dashboard Preview */}
            <Card className="medical-card shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. Silva</h3>
                      <p className="text-sm text-gray-600">Cardiologista</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Online</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Pacientes Hoje</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">12</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">Consultas</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">8</div>
                  </div>
                </div>
                
                <Button className="w-full medical-button" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Iniciar Consulta
                </Button>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="medical-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Seguro</h4>
                      <p className="text-sm text-gray-600">LGPD Compliant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="medical-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">24/7</h4>
                      <p className="text-sm text-gray-600">Disponível</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}