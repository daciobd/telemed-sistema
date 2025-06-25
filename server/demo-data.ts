import { db } from './db';
import { users, doctors, patients, appointments } from '@shared/schema';
import { storage } from './storage';
import { sql } from 'drizzle-orm';

// Demo data for medical team and patients
export const demoSpecialties = [
  'Cardiologia',
  'Dermatologia', 
  'Endocrinologia',
  'Gastroenterologia',
  'Neurologia',
  'Ortopedia',
  'Pediatria',
  'Psiquiatria',
  'Ginecologia',
  'Urologia'
];

export const demoDoctors = [
  // Cardiologia
  { name: 'Dr. Carlos Mendes', specialty: 'Cardiologia', crm: 'CRM12345', experience: 15 },
  { name: 'Dra. Ana Silva', specialty: 'Cardiologia', crm: 'CRM12346', experience: 12 },
  
  // Dermatologia
  { name: 'Dr. Pedro Santos', specialty: 'Dermatologia', crm: 'CRM12347', experience: 8 },
  { name: 'Dra. Maria Oliveira', specialty: 'Dermatologia', crm: 'CRM12348', experience: 10 },
  
  // Endocrinologia
  { name: 'Dr. João Costa', specialty: 'Endocrinologia', crm: 'CRM12349', experience: 18 },
  { name: 'Dra. Lucia Ferreira', specialty: 'Endocrinologia', crm: 'CRM12350', experience: 14 },
  
  // Gastroenterologia
  { name: 'Dr. Roberto Lima', specialty: 'Gastroenterologia', crm: 'CRM12351', experience: 16 },
  { name: 'Dra. Sandra Rocha', specialty: 'Gastroenterologia', crm: 'CRM12352', experience: 11 },
  
  // Neurologia
  { name: 'Dr. Antonio Gomes', specialty: 'Neurologia', crm: 'CRM12353', experience: 20 },
  { name: 'Dra. Beatriz Alves', specialty: 'Neurologia', crm: 'CRM12354', experience: 13 },
  
  // Ortopedia
  { name: 'Dr. Eduardo Machado', specialty: 'Ortopedia', crm: 'CRM12355', experience: 17 },
  { name: 'Dra. Fernanda Dias', specialty: 'Ortopedia', crm: 'CRM12356', experience: 9 },
  
  // Pediatria
  { name: 'Dr. Gabriel Ribeiro', specialty: 'Pediatria', crm: 'CRM12357', experience: 12 },
  { name: 'Dra. Helena Castro', specialty: 'Pediatria', crm: 'CRM12358', experience: 15 },
  
  // Psiquiatria
  { name: 'Dr. Igor Nascimento', specialty: 'Psiquiatria', crm: 'CRM12359', experience: 14 },
  { name: 'Dra. Julia Barbosa', specialty: 'Psiquiatria', crm: 'CRM12360', experience: 11 },
  
  // Ginecologia
  { name: 'Dr. Leonardo Souza', specialty: 'Ginecologia', crm: 'CRM12361', experience: 16 },
  { name: 'Dra. Mariana Torres', specialty: 'Ginecologia', crm: 'CRM12362', experience: 13 },
  
  // Urologia
  { name: 'Dr. Nicolas Vieira', specialty: 'Urologia', crm: 'CRM12363', experience: 19 },
  { name: 'Dra. Olivia Cardoso', specialty: 'Urologia', crm: 'CRM12364', experience: 10 }
];

export const demoPatients = [
  // Patients with varied conditions
  { name: 'José da Silva', age: 65, condition: 'Hipertensão Arterial', phone: '11999001001' },
  { name: 'Maria Santos', age: 58, condition: 'Diabetes Mellitus', phone: '11999001002' },
  { name: 'João Oliveira', age: 72, condition: 'Arritmia Cardíaca', phone: '11999001003' },
  { name: 'Ana Costa', age: 45, condition: 'Angina do Peito', phone: '11999001004' },
  { name: 'Carlos Pereira', age: 55, condition: 'Infarto Prévio', phone: '11999001005' },
  
  { name: 'Lucia Fernandes', age: 34, condition: 'Dermatite Atópica', phone: '11999002001' },
  { name: 'Pedro Almeida', age: 42, condition: 'Psoríase', phone: '11999002002' },
  { name: 'Sandra Lima', age: 28, condition: 'Acne Severa', phone: '11999002003' },
  { name: 'Roberto Dias', age: 55, condition: 'Melanoma', phone: '11999002004' },
  { name: 'Fernanda Rocha', age: 38, condition: 'Vitiligo', phone: '11999002005' },
  
  { name: 'Antonio Gomes', age: 48, condition: 'Diabetes Tipo 2', phone: '11999003001' },
  { name: 'Beatriz Silva', age: 52, condition: 'Hipotireoidismo', phone: '11999003002' },
  { name: 'Eduardo Santos', age: 39, condition: 'Hipertireoidismo', phone: '11999003003' },
  { name: 'Helena Costa', age: 61, condition: 'Síndrome Metabólica', phone: '11999003004' },
  { name: 'Gabriel Machado', age: 44, condition: 'Obesidade', phone: '11999003005' },
  
  { name: 'Igor Ribeiro', age: 56, condition: 'Gastrite Crônica', phone: '11999004001' },
  { name: 'Julia Nascimento', age: 43, condition: 'Úlcera Péptica', phone: '11999004002' },
  { name: 'Leonardo Barbosa', age: 38, condition: 'Doença de Crohn', phone: '11999004003' },
  { name: 'Mariana Souza', age: 29, condition: 'Síndrome do Intestino Irritável', phone: '11999004004' },
  { name: 'Nicolas Torres', age: 67, condition: 'Cirrose Hepática', phone: '11999004005' },
  
  { name: 'Olivia Vieira', age: 71, condition: 'Doença de Alzheimer', phone: '11999005001' },
  { name: 'Paulo Cardoso', age: 54, condition: 'Enxaqueca Crônica', phone: '11999005002' },
  { name: 'Raquel Moreira', age: 36, condition: 'Epilepsia', phone: '11999005003' },
  { name: 'Sergio Azevedo', age: 49, condition: 'Esclerose Múltipla', phone: '11999005004' },
  { name: 'Tatiana Freitas', age: 62, condition: 'Parkinson', phone: '11999005005' },
  
  { name: 'Ulisses Campos', age: 35, condition: 'Fratura de Fêmur', phone: '11999006001' },
  { name: 'Viviane Monteiro', age: 41, condition: 'Artrose de Joelho', phone: '11999006002' },
  { name: 'Wagner Pinto', age: 58, condition: 'Hérnia de Disco', phone: '11999006003' },
  { name: 'Ximena Lopes', age: 47, condition: 'Tendinite de Ombro', phone: '11999006004' },
  { name: 'Yara Cavalcanti', age: 52, condition: 'Fibromialgia', phone: '11999006005' },
  
  { name: 'Zilda Martins', age: 7, condition: 'Asma Infantil', phone: '11999007001' },
  { name: 'Andre Filho', age: 12, condition: 'Bronquite', phone: '11999007002' },
  { name: 'Bruno Junior', age: 5, condition: 'Rinite Alérgica', phone: '11999007003' },
  { name: 'Camila Pequena', age: 9, condition: 'Dermatite', phone: '11999007004' },
  { name: 'Diego Criança', age: 14, condition: 'Obesidade Infantil', phone: '11999007005' },
  
  { name: 'Elena Rodriguez', age: 33, condition: 'Depressão', phone: '11999008001' },
  { name: 'Felipe Moura', age: 41, condition: 'Transtorno de Ansiedade', phone: '11999008002' },
  { name: 'Giovana Reis', age: 27, condition: 'Transtorno Bipolar', phone: '11999008003' },
  { name: 'Henrique Valle', age: 54, condition: 'Esquizofrenia', phone: '11999008004' },
  { name: 'Isabela Nunes', age: 39, condition: 'Síndrome do Pânico', phone: '11999008005' },
  
  { name: 'Juliana Teixeira', age: 29, condition: 'Endometriose', phone: '11999009001' },
  { name: 'Karen Vasconcelos', age: 35, condition: 'Mioma Uterino', phone: '11999009002' },
  { name: 'Larissa Cunha', age: 42, condition: 'Menopausa Precoce', phone: '11999009003' },
  { name: 'Monica Farias', age: 25, condition: 'SOP - Síndrome dos Ovários Policísticos', phone: '11999009004' },
  { name: 'Natalia Guedes', age: 31, condition: 'Infertilidade', phone: '11999009005' },
  
  { name: 'Oscar Henriques', age: 48, condition: 'Cálculo Renal', phone: '11999010001' },
  { name: 'Patricia Melo', age: 56, condition: 'Incontinência Urinária', phone: '11999010002' },
  { name: 'Quintino Aragão', age: 62, condition: 'Hiperplasia Prostática', phone: '11999010003' },
  { name: 'Renata Correia', age: 44, condition: 'Cistite de Repetição', phone: '11999010004' },
  { name: 'Silvio Batista', age: 58, condition: 'Disfunção Erétil', phone: '11999010005' }
];

export async function createDemoData() {
  console.log('Creating demo medical team and patients...');
  
  try {
    // Create demo doctors
    for (let i = 0; i < demoDoctors.length; i++) {
      const doctor = demoDoctors[i];
      const userId = `demo_doctor_${i + 1}`;
      
      // Create user for doctor
      await storage.upsertUser({
        id: userId,
        email: `${doctor.name.toLowerCase().replace(/\s+/g, '').replace('dr.', '').replace('dra.', '')}@telemeddemo.com`,
        firstName: doctor.name.split(' ')[1] || doctor.name,
        lastName: doctor.name.split(' ').slice(2).join(' ') || '',
        role: 'doctor',
        specialty: doctor.specialty,
        licenseNumber: doctor.crm
      });
      
      // Create doctor profile
      await storage.createDoctor({
        userId,
        specialty: doctor.specialty,
        licenseNumber: doctor.crm,
        experience: doctor.experience,
        consultationFee: 15000 + Math.floor(Math.random() * 10000), // R$ 150-250
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
      });
    }
    
    // Create demo patients
    for (let i = 0; i < demoPatients.length; i++) {
      const patient = demoPatients[i];
      const userId = `demo_patient_${i + 1}`;
      
      // Create user for patient
      await storage.upsertUser({
        id: userId,
        email: `${patient.name.toLowerCase().replace(/\s+/g, '')}@paciente.com`,
        firstName: patient.name.split(' ')[0],
        lastName: patient.name.split(' ').slice(1).join(' '),
        role: 'patient'
      });
      
      // Create patient profile
      const birthYear = new Date().getFullYear() - patient.age;
      await storage.createPatient({
        userId,
        dateOfBirth: new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        phone: patient.phone,
        address: `Rua Demo ${i + 1}, ${Math.floor(Math.random() * 9999) + 1}, São Paulo - SP`,
        emergencyContact: patient.phone.replace(/(\d{2})(\d{1})/, '$1$29'),
        bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
        allergies: Math.random() > 0.7 ? 'Alergia a dipirona' : null,
        medicalHistory: patient.condition
      });
    }
    
    // Create demo appointments (5 per doctor)
    const allDoctors = await storage.getAllDoctors();
    const allPatients = await storage.getAllPatients();
    
    for (let doctorIndex = 0; doctorIndex < allDoctors.length; doctorIndex++) {
      const doctor = allDoctors[doctorIndex];
      
      // Assign 5 patients to each doctor
      for (let patientOffset = 0; patientOffset < 5; patientOffset++) {
        const patientIndex = (doctorIndex * 5 + patientOffset) % allPatients.length;
        const patient = allPatients[patientIndex];
        
        // Create varied appointment dates
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) - 15); // -15 to +15 days
        appointmentDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // 9-17h
        
        const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
        const types = ['routine', 'followup', 'emergency', 'telemedicine'];
        
        await storage.createAppointment({
          patientId: patient.id,
          doctorId: doctor.id,
          appointmentDate,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          type: types[Math.floor(Math.random() * types.length)],
          notes: `Consulta para ${demoPatients[patientIndex]?.condition || 'acompanhamento'}`
        });
      }
    }
    
    console.log('Demo data created successfully!');
    console.log(`Created ${demoDoctors.length} doctors and ${demoPatients.length} patients`);
    console.log(`Created ${allDoctors.length * 5} appointments`);
    
  } catch (error) {
    console.error('Error creating demo data:', error);
    throw error;
  }
}

export async function clearDemoData() {
  console.log('Clearing existing demo data...');
  
  try {
    // Delete demo users (cascade will handle related records)
    await db.delete(users).where(sql`id LIKE 'demo_%'`);
    console.log('Demo data cleared successfully!');
  } catch (error) {
    console.error('Error clearing demo data:', error);
    throw error;
  }
}