import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

interface TestVideoCallProps {
  appointmentId: number;
  isDoctor: boolean;
  patientName?: string;
  doctorName?: string;
  onEndCall: () => void;
}

export default function TestVideoCall({ 
  appointmentId, 
  isDoctor, 
  patientName, 
  doctorName, 
  onEndCall 
}: TestVideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  console.log('TestVideoCall component rendered successfully');

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between text-white">
        <div>
          <h1 className="text-xl font-bold">
            Teste de Videochamada
          </h1>
          <p className="text-sm">
            Appointment ID: {appointmentId} | 
            Role: {isDoctor ? 'Doctor' : 'Patient'} |
            {patientName && ` Patient: ${patientName}`}
            {doctorName && ` Doctor: ${doctorName}`}
          </p>
        </div>
        <div className="bg-green-600 px-3 py-1 rounded text-sm">
          Teste Conectado
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Video className="h-24 w-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Teste de Videochamada</h2>
          <p className="text-lg mb-4">O componente de vídeo está funcionando!</p>
          <p className="text-sm opacity-75">
            Esta é uma versão simplificada para testar se o componente carrega corretamente.
          </p>
        </div>

        {/* Test local video placeholder */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          <div className="text-white text-center">
            <Video className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">Video Local</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          className="rounded-full w-12 h-12 p-0"
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className="rounded-full w-12 h-12 p-0"
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={() => {
            console.log('Ending test video call');
            onEndCall();
          }}
          className="rounded-full w-12 h-12 p-0"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}