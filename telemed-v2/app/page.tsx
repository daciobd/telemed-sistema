import { Metadata } from 'next'
import { Hero } from '@/components/layout/hero'
import { Features } from '@/components/layout/features'
import { Statistics } from '@/components/layout/statistics'
import { Testimonials } from '@/components/layout/testimonials'
import { CTA } from '@/components/layout/cta'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'TeleMed Pro - Plataforma de Telemedicina Profissional',
  description: 'Sistema completo de telemedicina com videoconsultas, prescrições digitais MEMED, gestão de pacientes e pagamentos seguros.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main>
        <Hero />
        <Features />
        <Statistics />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}