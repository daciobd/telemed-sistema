import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Stethoscope,
  User,
  Lock,
  ArrowRight,
  Heart,
  Shield,
  Calendar,
  Video,
  FileText,
  Pill
} from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    userType: 'patient'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - redirect to appropriate dashboard
    if (loginData.userType === 'doctor') {
      setLocation('/doctor-dashboard');
    } else {
      setLocation('/patient-dashboard');
    }
  };

  const handleDemoLogin = (userType: string) => {
    if (userType === 'doctor') {
      setLocation('/doctor-dashboard');
    } else {
      setLocation('/patient-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TeleMed Sistema</h1>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Sistema Seguro</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Bem-vindo ao TeleMed
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Plataforma completa de telemedicina para médicos e pacientes
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Consultas</h3>
                  <p className="text-sm text-gray-600">Agendamento online</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Video className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Videochamadas</h3>
                  <p className="text-sm text-gray-600">Consultas por vídeo</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Prontuário</h3>
                  <p className="text-sm text-gray-600">Histórico completo</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Pill className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Receitas</h3>
                  <p className="text-sm text-gray-600">Prescrições digitais</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Sistema em Produção</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">1,200+</div>
                  <div className="text-sm text-gray-600">Médicos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">15,000+</div>
                  <div className="text-sm text-gray-600">Pacientes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfação</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  Acesso ao Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="demo">Demo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipo de Usuário</Label>
                        <Tabs value={loginData.userType} onValueChange={(value) => setLoginData({...loginData, userType: value})}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="patient">Paciente</TabsTrigger>
                            <TabsTrigger value="doctor">Médico</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Lock className="h-4 w-4 mr-2" />
                        Entrar no Sistema
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="demo" className="space-y-4">
                    <div className="text-center text-gray-600 mb-4">
                      Acesso rápido para demonstração
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleDemoLogin('doctor')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Entrar como Médico
                      </Button>
                      
                      <Button 
                        onClick={() => handleDemoLogin('patient')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Entrar como Paciente
                      </Button>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-center mt-4">
                      * Modo demonstração com dados fictícios
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}