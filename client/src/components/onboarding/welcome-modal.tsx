import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  BookOpen, 
  Star, 
  Users, 
  Shield, 
  Zap,
  Heart,
  X
} from "lucide-react";

interface WelcomeModalProps {
  isVisible: boolean;
  onStartTour: () => void;
  onSkipTour: () => void;
  userType: 'doctor' | 'patient';
  userName?: string;
}

export default function WelcomeModal({ 
  isVisible, 
  onStartTour, 
  onSkipTour, 
  userType,
  userName 
}: WelcomeModalProps) {
  
  if (!isVisible) return null;

  const userTypeText = userType === 'doctor' ? 'Dr(a)' : '';
  const displayName = userName ? `${userTypeText} ${userName}` : userType === 'doctor' ? 'Doutor(a)' : 'Paciente';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-blue-200 animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bem-vindo ao TeleMed
              </CardTitle>
              
              <p className="text-xl text-muted-foreground mt-2">
                Olá, {displayName}!
              </p>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onSkipTour}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {userType === 'doctor' ? (
                <>
                  Sua plataforma completa para atendimento médico digital. 
                  Gerencie consultas, pacientes e prescrições com segurança e eficiência.
                </>
              ) : (
                <>
                  Sua saúde em primeiro lugar. Acesse consultas médicas online, 
                  acompanhe seu histórico e receba cuidados personalizados.
                </>
              )}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Rápido</h4>
              <p className="text-xs text-muted-foreground">Acesso instantâneo</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Seguro</h4>
              <p className="text-xs text-muted-foreground">Conformidade LGPD</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Integrado</h4>
              <p className="text-xs text-muted-foreground">Tudo em um lugar</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm">Profissional</h4>
              <p className="text-xs text-muted-foreground">Qualidade médica</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-center">Principais Funcionalidades</h3>
            
            <div className="grid gap-2">
              {userType === 'doctor' ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Videoconsultas WebRTC</h4>
                      <p className="text-sm text-muted-foreground">Chat, compartilhamento de tela e gravação</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Prescrições MEMED</h4>
                      <p className="text-sm text-muted-foreground">Prescrições digitais válidas integradas</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Consultas Online</h4>
                      <p className="text-sm text-muted-foreground">Atendimento médico por videochamada</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Histórico Médico</h4>
                      <p className="text-sm text-muted-foreground">Acesso completo ao seu prontuário</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={onStartTour} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Tour Guiado
            </Button>
            
            <Button 
              onClick={onSkipTour} 
              variant="outline" 
              className="flex-1"
              size="lg"
            >
              Explorar por conta própria
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              O tour leva apenas 2 minutos e mostra os recursos essenciais
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}