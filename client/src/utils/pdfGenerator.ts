import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PatientData {
  name: string;
  age: number;
  id: string;
  condition: string;
  lastVisit: string;
  treatments: string[];
  prescriptions: string[];
  notes: string;
}

interface ConsultationData {
  date: string;
  doctor: string;
  patient: string;
  type: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
  prescriptions: string[];
}

export class PDFGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  // Gerar relatório médico completo
  generateMedicalReport(patientData: PatientData, consultationData: ConsultationData): void {
    this.doc = new jsPDF();
    
    // Header
    this.addHeader();
    
    // Título do relatório
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RELATÓRIO MÉDICO', 105, 40, { align: 'center' });
    
    // Dados do paciente
    this.addPatientInfo(patientData);
    
    // Dados da consulta
    this.addConsultationInfo(consultationData);
    
    // Prescrições
    this.addPrescriptions(consultationData.prescriptions);
    
    // Footer
    this.addFooter();
    
    // Download
    this.doc.save(`relatorio_medico_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Gerar relatório de prescrição
  generatePrescriptionReport(patientData: PatientData, prescriptions: string[]): void {
    this.doc = new jsPDF();
    
    this.addHeader();
    
    // Título
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PRESCRIÇÃO MÉDICA', 105, 40, { align: 'center' });
    
    // Dados do paciente
    this.addPatientInfo(patientData);
    
    // Prescrições detalhadas
    let yPosition = 100;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PRESCRIÇÕES:', 20, yPosition);
    
    yPosition += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    prescriptions.forEach((prescription, index) => {
      this.doc.text(`${index + 1}. ${prescription}`, 25, yPosition);
      yPosition += 8;
    });
    
    this.addFooter();
    this.doc.save(`prescricao_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Gerar relatório de triagem psiquiátrica
  generatePsychiatricReport(patientData: PatientData, assessmentResults: any): void {
    this.doc = new jsPDF();
    
    this.addHeader();
    
    // Título
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RELATÓRIO DE AVALIAÇÃO PSIQUIÁTRICA', 105, 40, { align: 'center' });
    
    // Dados do paciente
    this.addPatientInfo(patientData);
    
    // Resultados da avaliação
    let yPosition = 100;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RESULTADOS DA AVALIAÇÃO:', 20, yPosition);
    
    yPosition += 15;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    // GAD-7
    if (assessmentResults.gad7) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('GAD-7 (Ansiedade):', 25, yPosition);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Pontuação: ${assessmentResults.gad7.score}/21`, 25, yPosition + 8);
      this.doc.text(`Classificação: ${assessmentResults.gad7.classification}`, 25, yPosition + 16);
      yPosition += 30;
    }
    
    // PHQ-9
    if (assessmentResults.phq9) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('PHQ-9 (Depressão):', 25, yPosition);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Pontuação: ${assessmentResults.phq9.score}/27`, 25, yPosition + 8);
      this.doc.text(`Classificação: ${assessmentResults.phq9.classification}`, 25, yPosition + 16);
      yPosition += 30;
    }
    
    // Recomendações
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECOMENDAÇÕES:', 20, yPosition);
    this.doc.setFont('helvetica', 'normal');
    
    const recommendations = [
      'Acompanhamento psiquiátrico especializado',
      'Reavaliação em 30 dias',
      'Monitoramento de sintomas',
      'Apoio psicológico recomendado'
    ];
    
    yPosition += 10;
    recommendations.forEach((rec, index) => {
      this.doc.text(`• ${rec}`, 25, yPosition);
      yPosition += 8;
    });
    
    this.addFooter();
    this.doc.save(`avaliacao_psiquiatrica_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // Gerar relatório de telemonitoramento
  generateTelemonitoringReport(patientData: PatientData, monitoringData: any): void {
    this.doc = new jsPDF();
    
    this.addHeader();
    
    // Título
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RELATÓRIO DE TELEMONITORAMENTO', 105, 40, { align: 'center' });
    
    // Dados do paciente
    this.addPatientInfo(patientData);
    
    // Dados de monitoramento
    let yPosition = 100;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DADOS DE MONITORAMENTO:', 20, yPosition);
    
    yPosition += 15;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    const monitoringItems = [
      `Período: ${monitoringData.period || 'Últimos 30 dias'}`,
      `Sinais vitais: ${monitoringData.vitalSigns || 'Estáveis'}`,
      `Medicação: ${monitoringData.medication || 'Conforme prescrito'}`,
      `Sintomas: ${monitoringData.symptoms || 'Nenhum sintoma relatado'}`,
      `Aderência ao tratamento: ${monitoringData.adherence || 'Boa'}`,
      `Próxima avaliação: ${monitoringData.nextEvaluation || '15 dias'}`
    ];
    
    monitoringItems.forEach((item) => {
      this.doc.text(item, 25, yPosition);
      yPosition += 10;
    });
    
    this.addFooter();
    this.doc.save(`telemonitoramento_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private addHeader(): void {
    // Logo/Header da clínica
    this.doc.setFillColor(167, 199, 231); // #A7C7E7
    this.doc.rect(0, 0, 210, 25, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TeleMed Sistema', 20, 15);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Plataforma de Telemedicina Avançada', 140, 15);
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  private addPatientInfo(patientData: PatientData): void {
    let yPosition = 60;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DADOS DO PACIENTE:', 20, yPosition);
    
    yPosition += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    const patientInfo = [
      `Nome: ${patientData.name}`,
      `Idade: ${patientData.age} anos`,
      `ID: ${patientData.id}`,
      `Condição: ${patientData.condition}`,
      `Última visita: ${patientData.lastVisit}`
    ];
    
    patientInfo.forEach((info) => {
      this.doc.text(info, 25, yPosition);
      yPosition += 8;
    });
  }

  private addConsultationInfo(consultationData: ConsultationData): void {
    let yPosition = 120;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DADOS DA CONSULTA:', 20, yPosition);
    
    yPosition += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    const consultationInfo = [
      `Data: ${consultationData.date}`,
      `Médico: ${consultationData.doctor}`,
      `Tipo: ${consultationData.type}`,
      `Diagnóstico: ${consultationData.diagnosis}`,
      `Tratamento: ${consultationData.treatment}`,
      `Acompanhamento: ${consultationData.followUp}`
    ];
    
    consultationInfo.forEach((info) => {
      this.doc.text(info, 25, yPosition);
      yPosition += 8;
    });
  }

  private addPrescriptions(prescriptions: string[]): void {
    let yPosition = 200;
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PRESCRIÇÕES:', 20, yPosition);
    
    yPosition += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    
    prescriptions.forEach((prescription, index) => {
      this.doc.text(`${index + 1}. ${prescription}`, 25, yPosition);
      yPosition += 8;
    });
  }

  private addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(128, 128, 128);
    
    this.doc.text('TeleMed Sistema - Relatório gerado automaticamente', 20, pageHeight - 20);
    this.doc.text(`Data de geração: ${new Date().toLocaleString('pt-BR')}`, 20, pageHeight - 15);
    this.doc.text('Este documento é confidencial e destinado exclusivamente ao uso médico', 20, pageHeight - 10);
  }
}

// Funções de conveniência para uso direto
export const generateMedicalReportPDF = (patientData: PatientData, consultationData: ConsultationData) => {
  const generator = new PDFGenerator();
  generator.generateMedicalReport(patientData, consultationData);
};

export const generatePrescriptionPDF = (patientData: PatientData, prescriptions: string[]) => {
  const generator = new PDFGenerator();
  generator.generatePrescriptionReport(patientData, prescriptions);
};

export const generatePsychiatricReportPDF = (patientData: PatientData, assessmentResults: any) => {
  const generator = new PDFGenerator();
  generator.generatePsychiatricReport(patientData, assessmentResults);
};

export const generateTelemonitoringReportPDF = (patientData: PatientData, monitoringData: any) => {
  const generator = new PDFGenerator();
  generator.generateTelemonitoringReport(patientData, monitoringData);
};