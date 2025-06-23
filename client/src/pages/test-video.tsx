import { useState } from 'react';
import VideoRoom from '@/components/video/video-room';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestVideo() {
  const [isInCall, setIsInCall] = useState(false);
  const [appointmentId, setAppointmentId] = useState(1);
  const [patientName, setPatientName] = useState('João Silva');
  const [doctorName, setDoctorName] = useState('Dr. Maria Santos');

  const startCall = () => {
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
  };

  if (isInCall) {
    return (
      <VideoRoom
        appointmentId={appointmentId}
        patientName={patientName}
        doctorName={doctorName}
        onEndCall={endCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Teste de Videoconsulta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="appointmentId">ID da Consulta</Label>
            <Input
              id="appointmentId"
              type="number"
              value={appointmentId}
              onChange={(e) => setAppointmentId(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="patientName">Nome do Paciente</Label>
            <Input
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="doctorName">Nome do Médico</Label>
            <Input
              id="doctorName"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          
          <Button onClick={startCall} className="w-full">
            Iniciar Videochamada de Teste
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}