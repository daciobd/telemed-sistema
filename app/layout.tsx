import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  }
}

export const metadata: Metadata = {
  title: 'TeleMed Pro - Plataforma de Telemedicina',
  description: 'Sistema completo de telemedicina para consultas médicas digitais, prescrições e gestão de pacientes.',
  keywords: ['telemedicina', 'consulta médica', 'prescrição digital', 'MEMED', 'videoconsulta'],
  authors: [{ name: 'TeleMed Pro Team' }],
  creator: 'TeleMed Pro',
  publisher: 'TeleMed Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'TeleMed Pro - Plataforma de Telemedicina',
    description: 'Sistema completo de telemedicina para consultas médicas digitais.',
    url: 'https://telemed-pro.vercel.app',
    siteName: 'TeleMed Pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TeleMed Pro - Plataforma de Telemedicina',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeleMed Pro - Plataforma de Telemedicina',
    description: 'Sistema completo de telemedicina para consultas médicas digitais.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}