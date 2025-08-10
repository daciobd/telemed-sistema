import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Stethoscope, Upload, UserCheck, FileText, Mail, Phone } from "lucide-react";

const doctorRegistrationSchema = z.object({
  // Dados Pessoais
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
  
  // Dados Profissionais
  crm: z.string().min(4, "CRM deve ter pelo menos 4 caracteres"),
  crmState: z.string().min(2, "Estado do CRM é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  subSpecialty: z.string().optional(),
  medicalSchool: z.string().min(1, "Faculdade de medicina é obrigatória"),
  graduationYear: z.string().min(4, "Ano de formatura é obrigatório"),
  residency: z.string().optional(),
  
  // Experiência
  yearsOfExperience: z.string().min(1, "Anos de experiência é obrigatório"),
  currentWorkplace: z.string().min(1, "Local de trabalho atual é obrigatório"),
  consultationFee: z.string().min(1, "Valor da consulta é obrigatório"),
  
  // Disponibilidade
  availability: z.string().min(1, "Disponibilidade é obrigatória"),
  preferredSchedule: z.string().min(1, "Horário preferencial é obrigatório"),
  
  // Motivação
  motivation: z.string().min(50, "Conte-nos mais sobre sua motivação (mínimo 50 caracteres)"),
  telemedicineExperience: z.string().optional(),
});

type DoctorRegistrationForm = z.infer<typeof doctorRegistrationSchema>;

const specialties = [
  "Clínica Geral",
  "Cardiologia", 
  "Dermatologia",
  "Pediatria",
  "Psiquiatria",
  "Ginecologia",
  "Neurologia",
  "Ortopedia",
  "Oftalmologia",
  "Urologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Pneumologia",
  "Reumatologia",
  "Anestesiologia",
  "Radiologia"
];

const brazilianStates = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function RegisterDoctor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<DoctorRegistrationForm>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      crm: "",
      crmState: "",
      specialty: "",
      subSpecialty: "",
      medicalSchool: "",
      graduationYear: "",
      residency: "",
      yearsOfExperience: "",
      currentWorkplace: "",
      consultationFee: "",
      availability: "",
      preferredSchedule: "",
      motivation: "",
      telemedicineExperience: "",
    },
  });

  const onSubmit = async (data: DoctorRegistrationForm) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha no registro');
      }

      const result = await response.json();

      toast({
        title: "Candidatura Enviada!",
        description: "Sua candidatura foi recebida. Analisaremos em até 48 horas e entraremos em contato.",
      });

      // Redirecionar para página de confirmação
      setLocation('/register-success?type=doctor');
      
    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro no Registro",
        description: "Ocorreu um erro ao enviar sua candidatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Candidature-se como Médico
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Junte-se à nossa plataforma de telemedicina e ajude pacientes em todo o Brasil
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Formulário de Candidatura
            </CardTitle>
            <CardDescription>
              Preencha todos os campos para que possamos avaliar sua candidatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Dados Pessoais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu primeiro nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu sobrenome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dados Profissionais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Dados Profissionais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="crm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CRM</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="crmState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado do CRM</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brazilianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anos de Experiência</FormLabel>
                          <FormControl>
                            <Input placeholder="5" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidade Principal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione sua especialidade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specialties.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
                                  {specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subSpecialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subespecialidade (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Cardiologia Intervencionista" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="medicalSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Faculdade de Medicina</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da instituição" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="graduationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ano de Formatura</FormLabel>
                          <FormControl>
                            <Input placeholder="2015" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="residency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residência Médica (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Hospital e especialidade da residência" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Trabalho Atual */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Experiência e Disponibilidade
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentWorkplace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local de Trabalho Atual</FormLabel>
                          <FormControl>
                            <Input placeholder="Hospital, clínica ou consultório" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consultationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Desejado por Consulta (R$)</FormLabel>
                          <FormControl>
                            <Input placeholder="150" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disponibilidade Semanal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="part-time">Meio período (até 20h/semana)</SelectItem>
                              <SelectItem value="full-time">Período integral (20-40h/semana)</SelectItem>
                              <SelectItem value="flexible">Flexível conforme demanda</SelectItem>
                              <SelectItem value="weekends">Apenas finais de semana</SelectItem>
                              <SelectItem value="evenings">Apenas noites</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredSchedule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário Preferencial</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Manhã (6h-12h)</SelectItem>
                              <SelectItem value="afternoon">Tarde (12h-18h)</SelectItem>
                              <SelectItem value="evening">Noite (18h-22h)</SelectItem>
                              <SelectItem value="dawn">Madrugada (22h-6h)</SelectItem>
                              <SelectItem value="flexible">Flexível</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Motivação */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Motivação e Experiência
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Por que deseja trabalhar conosco?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos sobre sua motivação para trabalhar com telemedicina e como você pode contribuir para nossa plataforma..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telemedicineExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experiência com Telemedicina (opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva sua experiência prévia com teleconsultas, plataformas digitais de saúde ou atendimento remoto..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Candidatura'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}