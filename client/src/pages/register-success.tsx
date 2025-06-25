import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle, Stethoscope, Heart, Mail, Clock } from "lucide-react";

export default function RegisterSuccess() {
  const [, setLocation] = useLocation();
  const [registrationType, setRegistrationType] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || '';
    setRegistrationType(type);
  }, []);

  const isDoctorRegistration = registrationType === 'doctor';
  const isPatientRegistration = registrationType === 'patient';

  if (!isDoctorRegistration && !isPatientRegistration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Tipo de registro não especificado</p>
            <Button onClick={() => setLocation('/')} className="w-full mt-4">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-600" />
              {isDoctorRegistration ? (
                <Stethoscope className="h-8 w-8 text-blue-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
              ) : (
                <Heart className="h-8 w-8 text-red-600 absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
              )}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isDoctorRegistration ? 'Candidatura Enviada!' : 'Cadastro Realizado!'}
          </h1>
          
          <p className="text-xl text-gray-600">
            {isDoctorRegistration 
              ? 'Sua candidatura foi recebida com sucesso'
              : 'Sua conta foi criada com sucesso'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              {isDoctorRegistration ? (
                <>
                  <Clock className="h-5 w-5 mr-2" />
                  Próximos Passos - Médico
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 mr-2" />
                  Bem-vindo à Plataforma
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {isDoctorRegistration ? (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Análise da Candidatura
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Nossa equipe analisará sua candidatura em até <strong>48 horas úteis</strong>. 
                    Verificaremos seus dados profissionais e entraremos em contato por email.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">O que acontece agora:</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Verificação de Dados</p>
                        <p className="text-sm text-gray-600">Validaremos seu CRM e dados profissionais</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Entrevista Online</p>
                        <p className="text-sm text-gray-600">Agendaremos uma breve conversa para conhecê-lo melhor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Aprovação e Treinamento</p>
                        <p className="text-sm text-gray-600">Após aprovação, você receberá acesso e treinamento na plataforma</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">Mantenha seu email atualizado</span>
                  </div>
                  <p className="text-green-800 text-sm mt-1">
                    Toda comunicação será feita pelo email que você forneceu. 
                    Verifique também sua caixa de spam.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Conta Criada com Sucesso!
                  </h3>
                  <p className="text-green-800 text-sm">
                    Você já pode fazer login e começar a agendar consultas médicas online.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">O que você pode fazer agora:</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-green-600 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Fazer Login</p>
                        <p className="text-sm text-gray-600">Use seu email para entrar na plataforma</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-green-600 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Agendar Consulta</p>
                        <p className="text-sm text-gray-600">Escolha uma especialidade e médico disponível</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-green-600 text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Teleconsulta</p>
                        <p className="text-sm text-gray-600">Realize sua consulta por videochamada</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Recursos Disponíveis
                  </h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Consultas por vídeo com médicos especialistas</li>
                    <li>• Prescrições digitais válidas</li>
                    <li>• Histórico médico completo</li>
                    <li>• Agendamento flexível</li>
                    <li>• Pagamento seguro online</li>
                  </ul>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {isPatientRegistration ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/')}
                    className="flex-1"
                  >
                    Explorar
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/api/login"}
                    className="flex-1"
                  >
                    Fazer Login
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/')}
                    className="flex-1"
                  >
                    Voltar ao Início
                  </Button>
                  <Button
                    onClick={() => setLocation('/register-patient')}
                    className="flex-1"
                  >
                    Cadastrar como Paciente
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Precisa de ajuda? Entre em contato conosco pelo email: 
            <br />
            <a href="mailto:suporte@telemedsistema.com" className="text-blue-600 hover:underline">
              suporte@telemedsistema.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}