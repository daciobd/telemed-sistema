import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ClipboardList, 
  UserX, 
  History, 
  Stethoscope, 
  Pill, 
  CheckCircle,
  AlertTriangle 
} from "lucide-react";
import ExamPanel from "./ExamPanel";
import type { FormData } from "@/pages/consultation";

interface MedicalFormProps {
  formData: FormData;
  validationErrors: string[];
  onUpdateForm: (field: keyof FormData, value: string) => void;
  onFinalizeConsultation: () => void;
}

const MedicalForm = ({ 
  formData, 
  validationErrors, 
  onUpdateForm, 
  onFinalizeConsultation 
}: MedicalFormProps) => {
  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="text-[hsl(var(--medical-blue))] w-6 h-6" />
          <h3 className="font-bold text-xl text-gray-900">Registro do Atendimento</h3>
        </div>
        
        {/* Validation Alert */}
        {validationErrors.length > 0 && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription>
              <p className="text-sm text-red-700 font-medium mb-2">Campos obrigatórios pendentes:</p>
              <ul className="text-sm text-red-600 space-y-1">
                {validationErrors.map(error => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Medical Form */}
        <form className="space-y-6">
          
          {/* Chief Complaint */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center">
              <UserX className="w-4 h-4 mr-2 text-[hsl(var(--medical-blue))]" />
              Queixa Principal *
            </Label>
            <Textarea 
              value={formData.chiefComplaint}
              onChange={(e) => onUpdateForm('chiefComplaint', e.target.value)}
              className="resize-none h-20 focus:ring-2 focus:ring-[hsl(var(--medical-blue))] focus:border-transparent"
              placeholder="Descreva o motivo principal da consulta..."
            />
          </div>
          
          {/* Current Illness History */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center">
              <History className="w-4 h-4 mr-2 text-[hsl(var(--medical-blue))]" />
              História da Doença Atual *
            </Label>
            <Textarea 
              value={formData.currentIllness}
              onChange={(e) => onUpdateForm('currentIllness', e.target.value)}
              className="resize-none h-20 focus:ring-2 focus:ring-[hsl(var(--medical-blue))] focus:border-transparent"
              placeholder="Evolução dos sintomas, duração, fatores de melhora/piora..."
            />
          </div>
          
          {/* Diagnostic Hypothesis */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center">
              <Stethoscope className="w-4 h-4 mr-2 text-[hsl(var(--medical-blue))]" />
              Hipótese Diagnóstica *
            </Label>
            <Input 
              value={formData.diagnosis}
              onChange={(e) => onUpdateForm('diagnosis', e.target.value)}
              className="focus:ring-2 focus:ring-[hsl(var(--medical-blue))] focus:border-transparent"
              placeholder="Ex: F41.1 - Transtorno de ansiedade generalizada"
            />
          </div>

          {/* Medical Conduct */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 flex items-center">
              <Pill className="w-4 h-4 mr-2 text-[hsl(var(--medical-blue))]" />
              Conduta/Indicações *
            </Label>
            <Textarea 
              value={formData.indications}
              onChange={(e) => onUpdateForm('indications', e.target.value)}
              className="resize-none h-20 focus:ring-2 focus:ring-[hsl(var(--medical-blue))] focus:border-transparent"
              placeholder="Prescrições médicas, orientações, retorno..."
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="button"
            className={`w-full py-3 px-6 font-semibold flex items-center justify-center gap-2 ${
              validationErrors.length === 0 
                ? 'bg-[hsl(var(--medical-green))] hover:bg-[hsl(var(--medical-green))] hover:opacity-90 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
            }`}
            disabled={validationErrors.length > 0}
            onClick={onFinalizeConsultation}
          >
            <CheckCircle className="w-5 h-5" />
            {validationErrors.length === 0 
              ? 'Finalizar Atendimento' 
              : `Faltam ${validationErrors.length} campos obrigatórios`
            }
          </Button>
        </form>

        {/* Exam Panel */}
        <div className="mt-6">
          <ExamPanel examCount={0} />
        </div>
      </div>
    </div>
  );
};

export default MedicalForm;
