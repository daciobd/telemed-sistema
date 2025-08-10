import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import WhatsAppContact from "@/components/whatsapp/whatsapp-contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Users, Phone } from "lucide-react";

export default function WhatsAppContactPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: doctors } = useQuery({
    queryKey: ["/api/doctors"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Default doctor contact for general inquiries
  const defaultDoctor = {
    id: 0,
    user: { firstName: "Dr. Equipe", lastName: "Médica" },
    specialty: "Atendimento Geral",
    phone: "5511999998888" // WhatsApp number
  };

  const handleDoctorSelect = (doctorId: string) => {
    if (doctorId === "default") {
      setSelectedDoctor(defaultDoctor);
    } else {
      const doctor = doctors?.find((d: any) => d.id.toString() === doctorId);
      if (doctor) {
        // Add a default phone if not present
        setSelectedDoctor({
          ...doctor,
          phone: doctor.phone || "5511999887766"
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Contato via WhatsApp
              </h1>
              <p className="text-gray-600">
                Envie suas dúvidas médicas diretamente para nossos profissionais
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Doctor Selection */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Selecionar Médico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select onValueChange={handleDoctorSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um médico para contato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">
                          Dr. Equipe Médica - Atendimento Geral
                        </SelectItem>
                        {doctors?.map((doctor: any) => (
                          <SelectItem key={doctor.id} value={doctor.id.toString()}>
                            Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedDoctor && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900">
                          Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}
                        </h4>
                        <p className="text-sm text-blue-700">{selectedDoctor.specialty}</p>
                        <div className="flex items-center gap-1 mt-1 text-sm text-blue-600">
                          <Phone className="h-3 w-3" />
                          <span>{selectedDoctor.phone}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Information Card */}
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">
                      ⚠️ Importante
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-yellow-700 space-y-2">
                    <p>• Este canal é para dúvidas não-urgentes</p>
                    <p>• Em emergências, procure atendimento médico imediato</p>
                    <p>• Respostas em horário comercial: 8h às 18h</p>
                    <p>• Mantenha suas informações pessoais protegidas</p>
                  </CardContent>
                </Card>
              </div>

              {/* WhatsApp Contact Form */}
              <div className="flex justify-center">
                {selectedDoctor ? (
                  <WhatsAppContact 
                    doctorName={`Dr. ${selectedDoctor.user.firstName} ${selectedDoctor.user.lastName}`}
                    doctorPhone={selectedDoctor.phone}
                    patientName={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : ""}
                  />
                ) : (
                  <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Selecione um médico
                      </h3>
                      <p className="text-gray-500">
                        Escolha o profissional que deseja contactar para enviar sua mensagem
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}