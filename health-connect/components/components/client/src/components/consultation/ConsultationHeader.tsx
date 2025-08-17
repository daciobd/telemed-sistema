import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Play, Square, Check, Clock, Phone, FlaskConical } from "lucide-react";
import { Link } from "wouter";
import type { Patient, ConsultationStatus } from "@/pages/consultation";

interface ConsultationHeaderProps {
  patient: Patient;
  consultationStatus: ConsultationStatus;
  elapsedTime: string;
  onStartConsultation: () => void;
}

const ConsultationHeader = ({ 
  patient, 
  consultationStatus, 
  elapsedTime, 
  onStartConsultation 
}: ConsultationHeaderProps) => {
  const getStatusText = () => {
    switch (consultationStatus) {
      case "waiting": return "aguardando";
      case "active": return "ativa";
      case "ended": return "finalizada";
      default: return "aguardando";
    }
  };

  const getButtonContent = () => {
    switch (consultationStatus) {
      case "waiting":
        return (
          <>
            <Play className="w-4 h-4" />
            Iniciar Consulta
          </>
        );
      case "active":
        return (
          <>
            <Square className="w-4 h-4" />
            Encerrar
          </>
        );
      case "ended":
        return (
          <>
            <Check className="w-4 h-4" />
            Finalizada
          </>
        );
      default:
        return (
          <>
            <Play className="w-4 h-4" />
            Iniciar Consulta
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (consultationStatus) {
      case "waiting":
        return "default";
      case "active":
        return "destructive";
      case "ended":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Patient Info Section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 bg-[hsl(var(--medical-blue))] text-white">
              <AvatarFallback className="bg-[hsl(var(--medical-blue))] text-white font-bold text-lg">
                {patient.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">
                {patient.name}, {patient.age} anos
              </h2>
              <p className="text-sm text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {patient.phone}
              </p>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="flex items-center text-sm font-medium">
              <span className={`status-dot status-${consultationStatus}`}></span>
              <span className="text-gray-700">Status: </span>
              <span className="ml-1 capitalize text-gray-900">{getStatusText()}</span>
            </div>
            
            {/* Timer */}
            <div className="consultation-timer text-white px-4 py-2 rounded-lg shadow-md">
              <div className="flex items-center text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                <span>Tempo: </span>
                <span className="ml-1 font-mono">{elapsedTime}</span>
              </div>
            </div>
            
            {/* Exam Request Button */}
            <Link to="/exames">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Solicitar Exames
              </Button>
            </Link>
            
            {/* Action Button */}
            <Button 
              variant={getButtonVariant()}
              onClick={onStartConsultation}
              disabled={consultationStatus === "ended"}
              className="px-6 py-2 font-medium shadow-md flex items-center gap-2"
            >
              {getButtonContent()}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ConsultationHeader;
