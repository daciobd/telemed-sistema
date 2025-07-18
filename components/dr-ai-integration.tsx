'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Brain, Stethoscope, Calendar } from 'lucide-react'

interface AIAnalysis {
  riskLevel: 'low' | 'medium' | 'high'
  specialty: string
  symptoms: string[]
  recommendations: string[]
  confidence: number
}

export function DrAIIntegration() {
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null)

  useEffect(() => {
    // Check if there's AI analysis data from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const analysisData = urlParams.get('ai_analysis')
    
    if (analysisData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(analysisData))
        setAIAnalysis(parsed)
      } catch (error) {
        console.error('Error parsing AI analysis data:', error)
      }
    }
  }, [])

  if (!aiAnalysis) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Bot className="w-5 h-5" />
            Dr. AI - Triagem Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Experimente nossa triagem médica com inteligência artificial para uma análise rápida dos seus sintomas.
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <a href="/dr-ai.html">
              <Brain className="w-4 h-4 mr-2" />
              Iniciar Triagem IA
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high': return 'Alto Risco'
      case 'medium': return 'Risco Moderado'
      default: return 'Baixo Risco'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Bot className="w-5 h-5" />
            Análise Dr. AI Completa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Risk Level */}
          <div className={`p-4 rounded-lg border ${getRiskColor(aiAnalysis.riskLevel)}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{getRiskText(aiAnalysis.riskLevel)}</span>
              <span className="text-sm">Confiança: {aiAnalysis.confidence}%</span>
            </div>
          </div>

          {/* Specialty Recommendation */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Especialidade Recomendada</span>
            </div>
            <p className="text-blue-700">{aiAnalysis.specialty}</p>
          </div>

          {/* Symptoms Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Sintomas Analisados</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {aiAnalysis.symptoms.map((symptom, index) => (
                <li key={index}>• {symptom}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Recomendações</h4>
            <ul className="text-sm text-green-700 space-y-1">
              {aiAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Consulta
            </Button>
            <Button variant="outline" asChild>
              <a href="/dr-ai.html">
                Nova Análise
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}