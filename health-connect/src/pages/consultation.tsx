import { useState, useEffect } from "react";
import ConsultationHeader from "@/components/consultation/ConsultationHeader";
import VideoArea from "@/components/consultation/VideoArea";
import MedicalForm from "@/components/consultation/MedicalForm";

export interface Patient {
  name: string;
  age: number;
  phone: string;
  initials: string;
}

export interface FormData {
  chiefComplaint: string;
  currentIllness: string;
  diagnosis: string;
  indications: string;
}

export type ConsultationStatus = "waiting" | "active" | "ended";

const Consultation = () => {
  const [patient] = useState<Patient>({
    name: "Claudio Felipe Montanha Correa",
    age: 36,
    phone: "(11) 99945-1628",
    initials: "CF"
  });

  const [elapsed, setElapsed] = useState(0);
  const [consultationStatus, setConsultationStatus] = useState<ConsultationStatus>("waiting");
  const [formData, setFormData] = useState<FormData>({
    chiefComplaint: "",
    currentIllness: "",
    diagnosis: "",
    indications: ""
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (consultationStatus === "active") {
      timer = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [consultationStatus]);

  // Real-time validation
  useEffect(() => {
    const errors = [];
    if (!formData.chiefComplaint.trim()) errors.push("Queixa principal");
    if (!formData.currentIllness.trim()) errors.push("História da doença");
    if (!formData.diagnosis.trim()) errors.push("Diagnóstico");
    if (!formData.indications.trim()) errors.push("Conduta");
    setValidationErrors(errors);
  }, [formData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartConsultation = () => {
    if (consultationStatus === "waiting") {
      setConsultationStatus("active");
      setElapsed(0);
    } else if (consultationStatus === "active") {
      setConsultationStatus("ended");
    }
  };

  const handleFinalizeConsultation = () => {
    if (validationErrors.length === 0) {
      alert('Atendimento registrado com sucesso!');
      setConsultationStatus("ended");
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--medical-gray))]">
      <ConsultationHeader
        patient={patient}
        consultationStatus={consultationStatus}
        elapsedTime={formatTime(elapsed)}
        onStartConsultation={handleStartConsultation}
      />

      <div className="flex h-screen">
        <VideoArea consultationStatus={consultationStatus} />
        
        <MedicalForm
          formData={formData}
          validationErrors={validationErrors}
          onUpdateForm={updateForm}
          onFinalizeConsultation={handleFinalizeConsultation}
        />
      </div>
    </div>
  );
};

export default Consultation;
