import { Router } from 'express';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const router = Router();

// Interface para dados do laudo médico
interface MedicalReportData {
  patientName: string;
  patientAge: number;
  patientCPF: string;
  doctorName: string;
  doctorCRM: string;
  specialty: string;
  date: Date;
  examType: string;
  findings: string;
  conclusion: string;
  recommendations: string;
}

// Dados fictícios para demonstração
const generateFictionalReportData = (): MedicalReportData => {
  const patients = [
    { name: 'Ana Silva Santos', age: 45, cpf: '123.456.789-01' },
    { name: 'João Pereira Lima', age: 52, cpf: '987.654.321-02' },
    { name: 'Maria Oliveira Costa', age: 38, cpf: '456.789.123-03' },
    { name: 'Carlos Eduardo Souza', age: 61, cpf: '789.123.456-04' },
    { name: 'Fernanda Rodrigues', age: 29, cpf: '321.654.987-05' }
  ];

  const doctors = [
    { name: 'Dr. Roberto Cardoso', crm: 'CRM/SP 123456', specialty: 'Cardiologia' },
    { name: 'Dra. Patricia Mendes', crm: 'CRM/RJ 654321', specialty: 'Neurologia' },
    { name: 'Dr. Anderson Silva', crm: 'CRM/MG 789012', specialty: 'Ortopedia' },
    { name: 'Dra. Camila Santos', crm: 'CRM/RS 345678', specialty: 'Dermatologia' },
    { name: 'Dr. Ricardo Alves', crm: 'CRM/PR 901234', specialty: 'Pneumologia' }
  ];

  const examTypes = [
    'Ecocardiograma com Doppler',
    'Ressonância Magnética de Crânio',
    'Radiografia de Tórax PA e Perfil',
    'Ultrassonografia Abdominal Total',
    'Tomografia Computadorizada de Abdome'
  ];

  const patient = patients[Math.floor(Math.random() * patients.length)];
  const doctor = doctors[Math.floor(Math.random() * doctors.length)];
  const examType = examTypes[Math.floor(Math.random() * examTypes.length)];

  return {
    patientName: patient.name,
    patientAge: patient.age,
    patientCPF: patient.cpf,
    doctorName: doctor.name,
    doctorCRM: doctor.crm,
    specialty: doctor.specialty,
    date: new Date(),
    examType,
    findings: generateFindings(examType),
    conclusion: generateConclusion(examType),
    recommendations: generateRecommendations(examType)
  };
};

const generateFindings = (examType: string): string => {
  const findings = {
    'Ecocardiograma com Doppler': 'Ventrículo esquerdo com dimensões e função sistólica preservadas. Fração de ejeção estimada em 65%. Válvulas cardíacas com abertura e fechamento adequados. Átrios com dimensões normais.',
    'Ressonância Magnética de Crânio': 'Estruturas encefálicas com sinal e morfologia preservados. Ausência de lesões expansivas ou hemorrágicas. Sistema ventricular com dimensões normais.',
    'Radiografia de Tórax PA e Perfil': 'Campos pulmonares com transparência preservada. Coração com área cardíaca normal. Mediastino centrado. Arcadas costais íntegras.',
    'Ultrassonografia Abdominal Total': 'Fígado com ecotextura homogênea e dimensões normais. Vesícula biliar sem alterações. Rins com morfologia e ecogenicidade preservadas.',
    'Tomografia Computadorizada de Abdome': 'Órgãos abdominais com densidade e realce contrastográfico habituais. Ausência de massas ou coleções líquidas anômalas.'
  };
  return findings[examType as keyof typeof findings] || 'Exame dentro dos parâmetros de normalidade.';
};

const generateConclusion = (examType: string): string => {
  const conclusions = {
    'Ecocardiograma com Doppler': 'Ecocardiograma transtorácico normal. Função sistólica do ventrículo esquerdo preservada.',
    'Ressonância Magnética de Crânio': 'Ressonância magnética de crânio sem alterações patológicas significativas.',
    'Radiografia de Tórax PA e Perfil': 'Radiografia de tórax dentro dos limites da normalidade.',
    'Ultrassonografia Abdominal Total': 'Ultrassonografia abdominal sem alterações dignas de nota.',
    'Tomografia Computadorizada de Abdome': 'Tomografia computadorizada de abdome sem achados patológicos.'
  };
  return conclusions[examType as keyof typeof conclusions] || 'Exame normal.';
};

const generateRecommendations = (examType: string): string => {
  const recommendations = {
    'Ecocardiograma com Doppler': 'Manter acompanhamento cardiológico de rotina. Controle de fatores de risco cardiovasculares.',
    'Ressonância Magnética de Crânio': 'Seguimento neurológico conforme indicação clínica. Reavaliação se necessário.',
    'Radiografia de Tórax PA e Perfil': 'Acompanhamento clínico. Repetir exame se indicado clinicamente.',
    'Ultrassonografia Abdominal Total': 'Seguimento médico de rotina. Controle dos parâmetros laboratoriais.',
    'Tomografia Computadorizada de Abdome': 'Acompanhamento clínico regular. Controle evolutivo se necessário.'
  };
  return recommendations[examType as keyof typeof recommendations] || 'Seguimento médico de rotina.';
};

// Gerar PDF do laudo médico
const generateMedicalReportPDF = (data: MedicalReportData): Buffer => {
  const doc = new jsPDF();
  
  // Configurações do documento
  doc.setFont('helvetica');
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185); // Azul TeleMed
  doc.text('TELEMED SISTEMA', 105, 25, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('LAUDO MÉDICO', 105, 35, { align: 'center' });
  
  // Linha separadora
  doc.setLineWidth(0.5);
  doc.setDrawColor(41, 128, 185);
  doc.line(20, 40, 190, 40);
  
  // Dados do paciente
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE', 20, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${data.patientName}`, 20, 65);
  doc.text(`Idade: ${data.patientAge} anos`, 20, 75);
  doc.text(`CPF: ${data.patientCPF}`, 20, 85);
  
  // Dados do médico
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO MÉDICO', 20, 105);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Médico: ${data.doctorName}`, 20, 115);
  doc.text(`${data.doctorCRM}`, 20, 125);
  doc.text(`Especialidade: ${data.specialty}`, 20, 135);
  
  // Data do exame
  const formattedDate = format(data.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  doc.text(`Data: ${formattedDate}`, 20, 145);
  
  // Tipo de exame
  doc.setFont('helvetica', 'bold');
  doc.text('EXAME REALIZADO', 20, 165);
  doc.setFont('helvetica', 'normal');
  doc.text(data.examType, 20, 175);
  
  // Achados
  doc.setFont('helvetica', 'bold');
  doc.text('ACHADOS', 20, 195);
  doc.setFont('helvetica', 'normal');
  const findingsLines = doc.splitTextToSize(data.findings, 170);
  doc.text(findingsLines, 20, 205);
  
  // Conclusão
  const conclusionY = 205 + (findingsLines.length * 5) + 15;
  doc.setFont('helvetica', 'bold');
  doc.text('CONCLUSÃO', 20, conclusionY);
  doc.setFont('helvetica', 'normal');
  const conclusionLines = doc.splitTextToSize(data.conclusion, 170);
  doc.text(conclusionLines, 20, conclusionY + 10);
  
  // Recomendações
  const recommendationsY = conclusionY + 10 + (conclusionLines.length * 5) + 15;
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDAÇÕES', 20, recommendationsY);
  doc.setFont('helvetica', 'normal');
  const recommendationsLines = doc.splitTextToSize(data.recommendations, 170);
  doc.text(recommendationsLines, 20, recommendationsY + 10);
  
  // Assinatura
  const signatureY = recommendationsY + 10 + (recommendationsLines.length * 5) + 30;
  doc.line(20, signatureY, 90, signatureY);
  doc.setFont('helvetica', 'bold');
  doc.text(data.doctorName, 20, signatureY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.doctorCRM, 20, signatureY + 20);
  
  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('TeleMed Sistema - Plataforma de Telemedicina', 105, 280, { align: 'center' });
  doc.text('Este laudo foi gerado automaticamente para fins demonstrativos', 105, 285, { align: 'center' });
  
  return Buffer.from(doc.output('arraybuffer'));
};

// Endpoint para gerar laudo médico fictício
router.get('/generate-fictional', (req, res) => {
  try {
    console.log('🏥 Gerando laudo médico fictício...');
    
    const reportData = generateFictionalReportData();
    const pdfBuffer = generateMedicalReportPDF(reportData);
    
    const filename = `laudo_medico_${reportData.patientName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('✅ Laudo médico gerado com sucesso:', filename);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('❌ Erro ao gerar laudo médico:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao gerar laudo médico',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para gerar laudo com dados personalizados
router.post('/generate-custom', (req, res) => {
  try {
    const customData: Partial<MedicalReportData> = req.body;
    const defaultData = generateFictionalReportData();
    
    const reportData: MedicalReportData = {
      ...defaultData,
      ...customData,
      date: customData.date ? new Date(customData.date) : defaultData.date
    };
    
    const pdfBuffer = generateMedicalReportPDF(reportData);
    
    const filename = `laudo_custom_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('✅ Laudo médico personalizado gerado:', filename);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('❌ Erro ao gerar laudo personalizado:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Falha ao gerar laudo personalizado',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para listar tipos de exames disponíveis
router.get('/exam-types', (req, res) => {
  const examTypes = [
    'Ecocardiograma com Doppler',
    'Ressonância Magnética de Crânio',
    'Radiografia de Tórax PA e Perfil',
    'Ultrassonografia Abdominal Total',
    'Tomografia Computadorizada de Abdome',
    'Eletrocardiograma',
    'Holter 24h',
    'Teste Ergométrico',
    'Endoscopia Digestiva Alta',
    'Colonoscopia'
  ];
  
  res.json({
    success: true,
    examTypes,
    message: 'Tipos de exames disponíveis para laudos fictícios'
  });
});

export default router;