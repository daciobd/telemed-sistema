import { storage } from './storage';

interface NotificationData {
  doctorId: number;
  appointmentId: number;
  patientName: string;
  specialty: string;
  offeredPrice: number;
  symptoms: string;
}

// Generate WhatsApp notification message
export function generateWhatsAppMessage(data: NotificationData): string {
  const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const offerLink = `${protocol}://${baseUrl}/ofertas-teleconsulta`;
  
  return `🏥 *Nova Oferta de Teleconsulta - TeleMed*

👤 *Paciente:* ${data.patientName}
🩺 *Especialidade:* ${data.specialty}
💰 *Valor Oferecido:* R$ ${data.offeredPrice.toFixed(2)}
📝 *Sintomas:* ${data.symptoms}

🔗 *Aceitar Oferta:* ${offerLink}

⏰ Responda rapidamente para aceitar esta consulta!

_TeleMed Sistema - Conectando médicos e pacientes_`;
}

// Generate WhatsApp Web URL
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

// Send notification to doctor via WhatsApp
export async function sendDoctorNotification(data: NotificationData): Promise<string> {
  try {
    // Get doctor with user details
    const doctorWithUser = await storage.getDoctorWithUser(data.doctorId);
    if (!doctorWithUser) {
      console.log(`Doctor ${data.doctorId} not found`);
      return '';
    }

    // For demo doctors, use mock phone numbers
    const demoPhones: { [key: number]: string } = {
      1: '+5511999001001', 2: '+5511999001002', 3: '+5511999001003',
      4: '+5511999001004', 5: '+5511999001005', 6: '+5511999001006',
      7: '+5511999001007', 8: '+5511999001008', 9: '+5511999001009',
      10: '+5511999001010', 11: '+5511999001011', 12: '+5511999001012',
      13: '+5511999001013', 14: '+5511999001014', 15: '+5511999001015',
      16: '+5511999001016', 17: '+5511999001017', 18: '+5511999001018',
      19: '+5511999001019', 20: '+5511999001020'
    };

    const doctorPhone = demoPhones[data.doctorId] || '+5511999000000';
    const doctorName = `${doctorWithUser.user.firstName} ${doctorWithUser.user.lastName}`;

    const message = generateWhatsAppMessage(data);
    const whatsappUrl = generateWhatsAppUrl(doctorPhone, message);
    
    console.log(`WhatsApp notification prepared for Dr. ${doctorName}: ${whatsappUrl}`);
    
    return whatsappUrl;
    
  } catch (error) {
    console.error('Error sending doctor notification:', error);
    return '';
  }
}

// Send SMS via Twilio (if credentials are available)
export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.log('Twilio credentials not configured, skipping SMS');
      return false;
    }

    // Dynamic import to avoid errors if Twilio is not installed
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber
    });

    console.log(`SMS sent successfully to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

// Notify all eligible doctors about new teleconsult offer
export async function notifyDoctorsAboutOffer(appointmentId: number): Promise<string[]> {
  try {
    const appointment = await storage.getAppointmentWithDetails(appointmentId);
    if (!appointment) {
      console.log(`Appointment ${appointmentId} not found`);
      return [];
    }

    const patientWithUser = await storage.getPatientWithUser(appointment.patientId);
    if (!patientWithUser) {
      console.log(`Patient ${appointment.patientId} not found`);
      return [];
    }

    // Get all doctors (we'll filter by specialty later if needed)
    const allDoctors = await storage.getAllDoctors();
    
    // Filter doctors by specialty matching the appointment
    const eligibleDoctors = allDoctors.filter(doctor => 
      doctor.specialty === appointment.specialty
    );

    const patientName = `${patientWithUser.user.firstName} ${patientWithUser.user.lastName}`.trim() || 'Paciente';
    const notificationData: NotificationData = {
      doctorId: 0, // Will be set for each doctor
      appointmentId,
      patientName,
      specialty: appointment.specialty || 'Consulta Geral',
      offeredPrice: Number(appointment.offeredPrice) || 150,
      symptoms: appointment.symptoms || 'Consulta médica'
    };

    const whatsappUrls: string[] = [];

    // Send notification to each eligible doctor
    for (const doctor of eligibleDoctors) {
      const url = await sendDoctorNotification({
        ...notificationData,
        doctorId: doctor.id
      });
      
      if (url) {
        whatsappUrls.push(url);
      }
    }

    console.log(`Notifications prepared for ${eligibleDoctors.length} doctors for appointment ${appointmentId}`);
    return whatsappUrls;
  } catch (error) {
    console.error('Error notifying doctors:', error);
    return [];
  }
}