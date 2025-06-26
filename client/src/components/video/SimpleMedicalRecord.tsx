import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, CheckCircle } from "lucide-react";

interface SimpleMedicalRecordProps {
  appointmentId: number;
  patientId: number;
  isDoctor: boolean;
}

export default function SimpleMedicalRecord({ appointmentId, patientId, isDoctor }: SimpleMedicalRecordProps) {
  const [record, setRecord] = useState({
    chiefComplaint: "",
    anamnesis: "",
    diagnosis: "",
    treatment: "",
    physicalExam: "",
    notes: ""
  });
  
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/consultation-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          patientId,
          ...record,
          status: 'in_progress'
        })
      });

      if (response.ok) {
        toast({
          title: "Prontuário salvo",
          description: "Os dados da consulta foram salvos com sucesso.",
        });
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o prontuário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/consultation-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          patientId,
          ...record,
          status: 'completed'
        })
      });

      if (response.ok) {
        toast({
          title: "Consulta finalizada",
          description: "O prontuário foi salvo e a consulta finalizada.",
        });
      } else {
        throw new Error('Erro ao finalizar');
      }
    } catch (error) {
      toast({
        title: "Erro ao finalizar",
        description: "Não foi possível finalizar a consulta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isDoctor) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prontuário da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            O médico está documentando a consulta. Você poderá acessar o prontuário após a consulta.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prontuário Eletrônico
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
            <Button
              onClick={handleComplete}
              disabled={saving}
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Finalizar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {/* Queixa Principal */}
            <div>
              <Label htmlFor="chiefComplaint">Queixa Principal</Label>
              <Textarea
                id="chiefComplaint"
                placeholder="Descreva a queixa principal do paciente..."
                value={record.chiefComplaint}
                onChange={(e) => setRecord(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <Separator />

            {/* Anamnese */}
            <div>
              <Label htmlFor="anamnesis">Anamnese</Label>
              <Textarea
                id="anamnesis"
                placeholder="História clínica, sintomas, evolução..."
                value={record.anamnesis}
                onChange={(e) => setRecord(prev => ({ ...prev, anamnesis: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>

            <Separator />

            {/* Hipótese Diagnóstica */}
            <div>
              <Label htmlFor="diagnosis">Hipótese Diagnóstica</Label>
              <Textarea
                id="diagnosis"
                placeholder="Hipótese diagnóstica ou diagnóstico definitivo..."
                value={record.diagnosis}
                onChange={(e) => setRecord(prev => ({ ...prev, diagnosis: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <Separator />

            {/* Conduta */}
            <div>
              <Label htmlFor="treatment">Conduta</Label>
              <Textarea
                id="treatment"
                placeholder="Tratamento, medicações, orientações..."
                value={record.treatment}
                onChange={(e) => setRecord(prev => ({ ...prev, treatment: e.target.value }))}
                className="mt-1"
                rows={4}
              />
            </div>

            <Separator />

            {/* Exame Físico */}
            <div>
              <Label htmlFor="physicalExam">Exame Físico</Label>
              <Textarea
                id="physicalExam"
                placeholder="Achados do exame físico..."
                value={record.physicalExam}
                onChange={(e) => setRecord(prev => ({ ...prev, physicalExam: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Observações Gerais */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações adicionais..."
                value={record.notes}
                onChange={(e) => setRecord(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}