import { Video, MicOff, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConsultationStatus } from "@/pages/consultation";

interface VideoAreaProps {
  consultationStatus: ConsultationStatus;
}

const VideoArea = ({ consultationStatus }: VideoAreaProps) => {
  return (
    <div className="flex-1 video-overlay flex items-center justify-center relative">
      <div className="text-white text-center z-10">
        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
          <Video className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Aguardando Paciente</h3>
        <p className="text-gray-300 mb-4">Sala de Consulta Virtual</p>
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
          <span className="text-sm font-mono">Sala: #ABC123</span>
        </div>
      </div>
      
      {/* Video Controls (when active) */}
      {consultationStatus === "active" && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-4">
            <Button
              size="icon"
              variant="destructive"
              className="w-12 h-12 rounded-full"
            >
              <MicOff className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white"
            >
              <VideoOff className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="w-12 h-12 rounded-full"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoArea;
