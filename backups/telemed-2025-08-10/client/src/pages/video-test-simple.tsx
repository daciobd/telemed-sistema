import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

export default function VideoTestSimple() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startVideo = async () => {
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      console.log('Camera access granted!');
      console.log('Stream tracks:', mediaStream.getTracks().length);
      console.log('Video tracks:', mediaStream.getVideoTracks().length);
      console.log('Audio tracks:', mediaStream.getAudioTracks().length);
      
      if (mediaStream.getVideoTracks().length > 0) {
        const videoTrack = mediaStream.getVideoTracks()[0];
        console.log('Video track settings:', videoTrack.getSettings());
        console.log('Video track state:', videoTrack.readyState);
        console.log('Video track enabled:', videoTrack.enabled);
      }

      setStream(mediaStream);
      
      if (videoRef.current) {
        console.log('Setting video element srcObject');
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        
        // Add event listeners for debugging
        videoRef.current.onloadstart = () => console.log('Video loadstart');
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
        };
        videoRef.current.oncanplay = () => console.log('Video can play');
        videoRef.current.onplaying = () => console.log('Video is playing');
        videoRef.current.onerror = (e) => console.error('Video error:', e);
        
        // Force play
        setTimeout(() => {
          videoRef.current?.play().then(() => {
            console.log('Video play succeeded');
          }).catch(e => {
            console.error('Video play failed:', e);
          });
        }, 100);
      } else {
        console.error('Video ref is null!');
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(`Erro: ${err.message}`);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Teste Simples de Vídeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {!stream ? (
                <Button onClick={startVideo}>
                  Iniciar Câmera
                </Button>
              ) : (
                <Button onClick={stopVideo} variant="destructive">
                  Parar Câmera
                </Button>
              )}
              
              {stream && (
                <>
                  <Button onClick={toggleVideo} variant={isVideoEnabled ? "default" : "secondary"}>
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button onClick={toggleAudio} variant={isAudioEnabled ? "default" : "secondary"}>
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Display */}
        <div className="bg-gray-800 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
          {stream ? (
            <div className="relative w-full max-w-2xl bg-black rounded-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                controls
                className="w-full h-auto rounded-lg"
                style={{ 
                  maxHeight: '500px',
                  backgroundColor: 'black'
                }}
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center rounded-lg">
                  <VideoOff className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Stream Status: {stream.active ? 'Ativo' : 'Inativo'}
              </div>
            </div>
          ) : (
            <div className="text-white text-center">
              <VideoOff className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p>Clique em "Iniciar Câmera" para testar o vídeo</p>
            </div>
          )}
        </div>

        {/* Debug Info */}
        {stream && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Informações de Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Tracks:</strong> {stream.getTracks().length}</p>
                <p><strong>Vídeo:</strong> {stream.getVideoTracks().length > 0 ? 'Ativo' : 'Inativo'}</p>
                <p><strong>Áudio:</strong> {stream.getAudioTracks().length > 0 ? 'Ativo' : 'Inativo'}</p>
                {stream.getVideoTracks()[0] && (
                  <>
                    <p><strong>Vídeo Enabled:</strong> {stream.getVideoTracks()[0].enabled ? 'Sim' : 'Não'}</p>
                    <p><strong>Video State:</strong> {stream.getVideoTracks()[0].readyState}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}