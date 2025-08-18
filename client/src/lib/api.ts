const BASE = import.meta.env.VITE_API_URL || "";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  return res.json();
}

export const api = {
  // Consultation Management
  startConsult: (id: string) =>
    fetch(`${BASE}/api/consults/${id}/start`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }).then(handleResponse),
    
  saveNotes: (id: string, body: any) =>
    fetch(`${BASE}/api/consults/${id}/notes`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body) 
    }).then(handleResponse),
    
  finalizeConsult: (id: string, summary?: string) =>
    fetch(`${BASE}/api/consults/${id}/finalize`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ summary }) 
    }).then(handleResponse),

  getConsult: (id: string) =>
    fetch(`${BASE}/api/consults/${id}`).then(handleResponse),

  // Dr. AI Integration
  askAI: (body: { question: string; patient?: any; context?: any }) =>
    fetch(`${BASE}/api/ai/clinical`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body) 
    }).then(handleResponse),

  // CID-10 Autocomplete
  cid10: (query: string) =>
    fetch(`${BASE}/api/cid10?query=${encodeURIComponent(query)}`).then(handleResponse),
    
  getCid10Code: (code: string) =>
    fetch(`${BASE}/api/cid10/${code}`).then(handleResponse),

  // Exam Management
  examTemplates: () =>
    fetch(`${BASE}/api/exams/templates`).then(handleResponse),
    
  examTemplatesByCategory: (category: string) =>
    fetch(`${BASE}/api/exams/templates/category/${category}`).then(handleResponse),
    
  orderExam: (body: any) =>
    fetch(`${BASE}/api/exams/order`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body) 
    }).then(handleResponse),
    
  getExamOrders: (consultId: string) =>
    fetch(`${BASE}/api/exams/orders/${consultId}`).then(handleResponse),
    
  getExamOrder: (orderId: string) =>
    fetch(`${BASE}/api/exams/order/${orderId}`).then(handleResponse),
    
  updateExamStatus: (orderId: string, status: string) =>
    fetch(`${BASE}/api/exams/order/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).then(handleResponse),

  // MedMed Integration
  memedLaunch: (patient: { name: string; age: number; phone: string }) =>
    fetch(`${BASE}/api/memed/launch?` + new URLSearchParams({
      name: patient.name,
      age: patient.age.toString(),
      phone: patient.phone
    })).then(handleResponse),
    
  getPrescriptions: (consultId: string) =>
    fetch(`${BASE}/api/memed/prescriptions/${consultId}`).then(handleResponse),
    
  createDemoPrescription: (body: { consultId: string; patientName: string; medications?: any[] }) =>
    fetch(`${BASE}/api/memed/prescription/demo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(handleResponse),
    
  getPrescriptionPdf: (prescriptionId: string) =>
    fetch(`${BASE}/api/memed/prescription/${prescriptionId}/pdf`).then(handleResponse),
    
  cancelPrescription: (prescriptionId: string) =>
    fetch(`${BASE}/api/memed/prescription/${prescriptionId}`, {
      method: "DELETE"
    }).then(handleResponse),
};

// Simple debounce utility (no React dependency in this file)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

// Export types for better TypeScript support
export type ConsultStatus = "waiting" | "in_progress" | "finished";
export type ExamPriority = "Rotina" | "Prioritário" | "Urgente";
export type PanelSize = "sm" | "md" | "lg";

export interface Patient {
  name: string;
  age: number;
  phone: string;
}

export interface CID10Item {
  code: string;
  label: string;
}

export interface ExamTemplate {
  id: string;
  name: string;
  routine: string;
  category: string;
  description: string;
}