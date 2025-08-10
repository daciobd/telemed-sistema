import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VideoRoom from '@/components/video/video-room';

export default function TestVideo() {
  const [inCall, setInCall] = useState(false);
  const [appointmentId] = useState(9); // Using appointment ID 9 from the logs

  const startCall = () => {
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
  };

  if (inCall) {
    return (
      <VideoRoom
        appointmentId={appointmentId}
        patientName="Dacio Dutra"
        doctorName="Dr. Test"
        onEndCall={endCall}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Teste de Videoconsulta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Teste o sistema de videoconsulta WebRTC.
            </p>
            <Button onClick={startCall} className="w-full">
              Iniciar Videochamada de Teste
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}