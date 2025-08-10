import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  UserPlus, 
  Stethoscope, 
  FileText,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import ExamSelectionModal from '@/components/clinical/exam-selection-modal';
import ReferralModal from '@/components/clinical/referral-modal';

interface Appointment {
  id: number;
  patient: {
    id: number;
    name: string;
  };
  appointmentDate: string;
  status: string;
  notes?: string;
}

interface DoctorClinicalActionsProps {
  appointments: Appointment[];
}

export default function DoctorClinicalActions({ appointments }: DoctorClinicalActionsProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    const today = new Date();
    aptDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return aptDate > today;
  });

  const handleExamRequest = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowExamModal(true);
  };

  const handleReferral = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowReferralModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'confirmed': return 'Confirmada';
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultas de Hoje ({todayAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma consulta agendada para hoje</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{appointment.patient.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExamRequest(appointment)}
                        className="flex items-center gap-1"
                      >
                        <Activity className="h-3 w-3" />
                        Exames
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReferral(appointment)}
                        className="flex items-center gap-1"
                      >
                        <UserPlus className="h-3 w-3" />
                        Encaminhar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Consultas ({upcomingAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Nenhuma consulta futura agendada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{appointment.patient.name}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(appointment.appointmentDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>
              ))}
              
              {upcomingAppointments.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="link" size="sm">
                    Ver mais {upcomingAppointments.length - 5} consultas
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Clinical Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ações Clínicas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => {
                if (todayAppointments.length > 0) {
                  handleExamRequest(todayAppointments[0]);
                }
              }}
              disabled={todayAppointments.length === 0}
            >
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Solicitar Exames</div>
                  <div className="text-xs text-gray-600">
                    Hemograma, glicemia, imagem...
                  </div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => {
                if (todayAppointments.length > 0) {
                  handleReferral(todayAppointments[0]);
                }
              }}
              disabled={todayAppointments.length === 0}
            >
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Encaminhar Paciente</div>
                  <div className="text-xs text-gray-600">
                    Para especialista ou teleconsulta
                  </div>
                </div>
              </div>
            </Button>
          </div>

          {todayAppointments.length === 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  Ações disponíveis após selecionar uma consulta
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedAppointment && (
        <>
          <ExamSelectionModal
            isOpen={showExamModal}
            onClose={() => {
              setShowExamModal(false);
              setSelectedAppointment(null);
            }}
            appointmentId={selectedAppointment.id}
            patientName={selectedAppointment.patient.name}
          />

          <ReferralModal
            isOpen={showReferralModal}
            onClose={() => {
              setShowReferralModal(false);
              setSelectedAppointment(null);
            }}
            appointmentId={selectedAppointment.id}
            patientName={selectedAppointment.patient.name}
          />
        </>
      )}
    </div>
  );
}