import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dr. AI - Triagem Inteligente',
  description: 'Sistema de triagem médica com inteligência artificial'
}

export default function DrAI() {
  return (
    <div className="min-h-screen">
      <iframe 
        src="/dr-ai.html" 
        className="w-full h-screen border-0"
        title="Dr. AI - Triagem Inteligente"
      />
    </div>
  )
}