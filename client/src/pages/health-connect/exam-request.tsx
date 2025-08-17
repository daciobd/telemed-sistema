import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus, Trash2, FileText, Send, Save, 
  Stethoscope, FlaskConical, Heart, Scan,
  ArrowLeft, CheckCircle, AlertTriangle
} from "lucide-react";

export interface ExamTemplate {
  name: string;
  category: string;
  instructions: string;
  preparation: string;
  urgency: "routine" | "priority" | "urgent";
}

export interface ExamRequest {
  id: number;
  name: string;
  urgency: "routine" | "priority" | "urgent";
  customInstructions: string;
  template?: ExamTemplate;
  dateRequested: Date;
}

const EXAM_TEMPLATES: ExamTemplate[] = [
  {
    name: "Hemograma completo",
    category: "Laboratorial",
    instructions: "Jejum de 8-12 horas. Coleta preferencialmente pela manhã.",
    preparation: "Não fazer exercícios físicos intensos 24h antes",
    urgency: "routine"
  },
  {
    name: "Glicemia de jejum",
    category: "Laboratorial", 
    instructions: "Jejum rigoroso de 8-12 horas. Apenas água permitida.",
    preparation: "Suspender medicamentos conforme orientação médica",
    urgency: "routine"
  },
  {
    name: "TSH + T4 livre",
    category: "Laboratorial",
    instructions: "Jejum de 4 horas. Coleta preferencialmente pela manhã.",
    preparation: "Informar uso de medicamentos para tireoide",
    urgency: "routine"
  },
  {
    name: "Creatinina + Ureia",
    category: "Laboratorial",
    instructions: "Jejum de 8 horas. Manter hidratação normal.",
    preparation: "Evitar exercícios intensos 48h antes",
    urgency: "routine"
  },
  {
    name: "Eletrocardiograma (ECG)",
    category: "Cardiológico",
    instructions: "Não é necessário jejum. Usar roupas confortáveis.",
    preparation: "Evitar cafeína 2h antes. Manter medicações habituais",
    urgency: "routine"
  },
  {
    name: "Raio-X de Tórax",
    category: "Imagem",
    instructions: "Não é necessário jejum. Retirar objetos metálicos.",
    preparation: "Informar sobre gravidez se aplicável",
    urgency: "routine"
  },
  {
    name: "Ecocardiograma",
    category: "Cardiológico",
    instructions: "Não é necessário jejum. Usar roupas confortáveis.",
    preparation: "Manter medicações habituais. Trazer exames anteriores",
    urgency: "priority"
  },
  {
    name: "Ultrassom Abdome Total",
    category: "Imagem",
    instructions: "Jejum de 8 horas. Bexiga cheia (tomar 4 copos d'água 1h antes).",
    preparation: "Não mascar chicletes ou balas. Evitar refrigerantes",
    urgency: "routine"
  },
  {
    name: "Mamografia",
    category: "Imagem",
    instructions: "Agendar para 1ª semana após menstruação. Não usar desodorante.",
    preparation: "Trazer exames anteriores. Usar blusa com abertura frontal",
    urgency: "routine"
  },
  {
    name: "Teste Ergométrico",
    category: "Cardiológico",
    instructions: "Jejum de 2 horas. Usar roupas e tênis para exercício.",
    preparation: "Suspender betabloqueadores 48h antes (conforme orientação)",
    urgency: "priority"
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Laboratorial":
      return <FlaskConical className="w-4 h-4" />;
    case "Cardiológico":
      return <Heart className="w-4 h-4" />;
    case "Imagem":
      return <Scan className="w-4 h-4" />;
    default:
      return <Stethoscope className="w-4 h-4" />;
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "urgent":
      return "bg-red-100 text-red-700 border-red-200";
    case "priority":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-green-100 text-green-700 border-green-200";
  }
};

const getUrgencyLabel = (urgency: string) => {
  switch (urgency) {
    case "urgent":
      return "Urgente";
    case "priority":
      return "Prioritário";
    default:
      return "Rotina";
  }
};

const ExamRequest = () => {
  const [patient] = useState({
    name: "Claudio Felipe Montanha Correa",
    age: 36,
    phone: "(11) 99945-1628",
    plan: "Particular"
  });

  const [examList, setExamList] = useState<ExamRequest[]>([]);
  const [examDraft, setExamDraft] = useState<{
    name: string;
    urgency: "routine" | "priority" | "urgent";
    customInstructions: string;
    selectedTemplate: ExamTemplate | null;
  }>({
    name: "",
    urgency: "routine",
    customInstructions: "",
    selectedTemplate: null
  });

  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = ["all", "Laboratorial", "Cardiológico", "Imagem"];
  
  const filteredTemplates = activeCategory === "all" 
    ? EXAM_TEMPLATES 
    : EXAM_TEMPLATES.filter(t => t.category === activeCategory);

  const selectExamTemplate = (template: ExamTemplate) => {
    setExamDraft({
      name: template.name,
      urgency: template.urgency,
      customInstructions: "",
      selectedTemplate: template
    });
  };

  const addExam = () => {
    if (!examDraft.name.trim()) return;
    
    const newExam: ExamRequest = {
      id: Date.now(),
      name: examDraft.name,
      urgency: examDraft.urgency,
      customInstructions: examDraft.customInstructions,
      template: examDraft.selectedTemplate || undefined,
      dateRequested: new Date()
    };
    
    setExamList(prev => [...prev, newExam]);
    setExamDraft({
      name: "",
      urgency: "routine",
      customInstructions: "",
      selectedTemplate: null
    });
  };

  const removeExam = (id: number) => {
    setExamList(prev => prev.filter(exam => exam.id !== id));
  };

  const generateRequest = () => {
    if (examList.length === 0) return;
    alert(`Solicitação gerada com ${examList.length} exame(s) para ${patient.name}`);
  };

  const sendByEmail = () => {
    if (examList.length === 0) return;
    alert("Solicitação enviada por email para o paciente");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--medical-gray))]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[hsl(var(--medical-blue))] rounded-full flex items-center justify-center text-white font-bold">
                  CF
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {patient.name}, {patient.age} anos
                  </h2>
                  <p className="text-sm text-gray-600">{patient.phone} • {patient.plan}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Solicitação de Exames
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Templates e Formulário */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[hsl(var(--medical-blue))]" />
                  Templates de Exames
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Category Filter */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                      className="flex items-center gap-2 whitespace-nowrap"
                    >
                      {category !== "all" && getCategoryIcon(category)}
                      {category === "all" ? "Todos" : category}
                    </Button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {filteredTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => selectExamTemplate(template)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <h4 className="font-medium text-sm">{template.name}</h4>
                        </div>
                        <Badge className={`text-xs ${getUrgencyColor(template.urgency)}`}>
                          {getUrgencyLabel(template.urgency)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{template.category}</p>
                      <p className="text-xs text-gray-500 mt-1">{template.instructions}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exam Form */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Exame</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nome do Exame</Label>
                  <Input
                    placeholder="Digite o nome do exame ou selecione um template"
                    value={examDraft.name}
                    onChange={(e) => setExamDraft({...examDraft, name: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Prioridade</Label>
                  <Select 
                    value={examDraft.urgency} 
                    onValueChange={(value: "routine" | "priority" | "urgent") => 
                      setExamDraft({...examDraft, urgency: value})
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Rotina (até 30 dias)
                        </div>
                      </SelectItem>
                      <SelectItem value="priority">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Prioritário (até 7 dias)
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Urgente (24-48 horas)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Instruções Específicas</Label>
                  <Textarea
                    placeholder="Instruções adicionais para este paciente..."
                    value={examDraft.customInstructions}
                    onChange={(e) => setExamDraft({...examDraft, customInstructions: e.target.value})}
                    className="mt-1 h-20"
                  />
                </div>

                {examDraft.selectedTemplate && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-500" />
                    <AlertDescription>
                      <div className="text-sm text-blue-700">
                        <p><strong>Instruções padrão:</strong> {examDraft.selectedTemplate.instructions}</p>
                        <p><strong>Preparo:</strong> {examDraft.selectedTemplate.preparation}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={addExam} 
                  className="w-full" 
                  disabled={!examDraft.name.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exame
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Exames Solicitados */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Exames Solicitados</span>
                  {examList.length > 0 && (
                    <Badge variant="secondary">
                      {examList.length} exame{examList.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examList.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Nenhum exame solicitado</p>
                      <p className="text-sm">Selecione um template ou digite o nome do exame</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {examList.map((exam) => (
                          <div key={exam.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{exam.name}</h4>
                                  <Badge className={`text-xs ${getUrgencyColor(exam.urgency)}`}>
                                    {getUrgencyLabel(exam.urgency)}
                                  </Badge>
                                </div>
                                
                                {exam.template && (
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                      {getCategoryIcon(exam.template.category)}
                                      <span className="font-medium">{exam.template.category}</span>
                                    </div>
                                    <div><strong>Instruções:</strong> {exam.template.instructions}</div>
                                    <div><strong>Preparo:</strong> {exam.template.preparation}</div>
                                  </div>
                                )}
                                
                                {exam.customInstructions && (
                                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                      <strong>Instruções específicas:</strong> {exam.customInstructions}
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExam(exam.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Button onClick={generateRequest} className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Gerar Solicitação
                          </Button>
                          <Button variant="outline" onClick={sendByEmail} className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Enviar por Email
                          </Button>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-gray-500">
                            {examList.length} exame{examList.length > 1 ? 's' : ''} • {' '}
                            {examList.filter(e => e.urgency === 'urgent').length} urgente{examList.filter(e => e.urgency === 'urgent').length > 1 ? 's' : ''} • {' '}
                            {examList.filter(e => e.urgency === 'priority').length} prioritário{examList.filter(e => e.urgency === 'priority').length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRequest;