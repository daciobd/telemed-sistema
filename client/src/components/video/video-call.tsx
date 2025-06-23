import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff,
  Users,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface VideoCallProps {
  appointmentId: number;
  isDoctor: boolean;
  patientName?: string;
  doctorName?: string;
  onEndCall: () => void;
}

export default function VideoCall({ 
  appointmentId, 
  isDoctor, 
  patientName, 
  doctorName, 
  onEndCall 
}: VideoCallProps) {
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [error, setError] = useState<string | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    initializeVideoCall();
    return () => {
      cleanupCall();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const initializeVideoCall = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setConnectionStatus('disconnected');
        setError('Seu navegador não suporta videochamadas. Use Chrome, Firefox ou Safari mais recente.');
        return;
      }

      // Get user media with proper error handling
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize WebRTC peer connection
        const configuration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        };
        
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        // Add local stream to peer connection
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event: RTCTrackEvent) => {
          const [stream] = event.streams;
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          const state = peerConnection.connectionState;
          if (state === 'connected') {
            setIsConnected(true);
            setConnectionStatus('connected');
          } else if (state === 'disconnected' || state === 'failed') {
            setConnectionStatus('disconnected');
            setIsConnected(false);
          }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && socketRef.current) {
            socketRef.current.send(JSON.stringify({
              type: 'ice-candidate',
              candidate: event.candidate,
              appointmentId
            }));
          }
        };

        // Initialize WebSocket connection
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/ws`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          socket.send(JSON.stringify({
            type: 'join-video-call',
            appointmentId,
            role: isDoctor ? 'doctor' : 'patient'
          }));
        };

        socket.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
              case 'offer':
                await handleOffer(data.offer);
                break;
              case 'answer':
                await handleAnswer(data.answer);
                break;
              case 'ice-candidate':
                await handleIceCandidate(data.candidate);
                break;
              case 'user-joined':
                if (isDoctor) {
                  createOffer();
                }
                break;
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('disconnected');
        };

        socket.onclose = () => {
          setConnectionStatus('disconnected');
          setIsConnected(false);
        };

      } catch (mediaError: any) {
        console.error('Media access error:', mediaError);
        let errorMessage = 'Erro ao acessar câmera e microfone.';
        
        if (mediaError.name === 'NotAllowedError') {
          errorMessage = 'Permissão negada para câmera/microfone. Clique no ícone da câmera na barra de endereço e permita o acesso.';
        } else if (mediaError.name === 'NotFoundError') {
          errorMessage = 'Câmera ou microfone não encontrados. Verifique se os dispositivos estão conectados.';
        } else if (mediaError.name === 'NotReadableError') {
          errorMessage = 'Câmera ou microfone já estão sendo usados por outro aplicativo.';
        }
        
        setError(errorMessage);
        setConnectionStatus('disconnected');
        return;
      }

    } catch (error) {
      console.error('Error initializing video call:', error);
      setError('Erro ao inicializar videochamada. Tente novamente.');
      setConnectionStatus('disconnected');
    }
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current || !socketRef.current) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socketRef.current.send(JSON.stringify({
        type: 'offer',
        offer,
        appointmentId
      }));
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current || !socketRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      socketRef.current.send(JSON.stringify({
        type: 'answer',
        answer,
        appointmentId
      }));
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanupCall();
    onEndCall();
  };

  const cleanupCall = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    // Close WebSocket
    if (socketRef.current) {
      socketRef.current.close();
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">
              {isDoctor ? `Consulta com ${patientName}` : `Dr. ${doctorName}`}
            </span>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-green-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatCallDuration(callDuration)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs ${
            connectionStatus === 'connected' ? 'bg-green-600' : 
            connectionStatus === 'connecting' ? 'bg-yellow-600' : 'bg-red-600'
          }`}>
            {connectionStatus === 'connected' ? 'Conectado' : 
             connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-gray-900">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Connection Status Overlay */}
        {!isConnected && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center">
            <Card className="w-96">
              <CardHeader>
                <CardTitle className="text-center">
                  {error ? 'Erro de Conexão' : 
                   connectionStatus === 'connecting' ? 'Conectando...' : 'Aguardando conexão'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {error ? (
                  <div className="space-y-4">
                    <p className="text-red-600 text-sm">{error}</p>
                    <div className="text-xs text-gray-600 space-y-2">
                      <p><strong>Para permitir acesso:</strong></p>
                      <p>1. Clique no ícone da câmera na barra de endereço</p>
                      <p>2. Selecione "Permitir" para câmera e microfone</p>
                      <p>3. Recarregue a página se necessário</p>
                    </div>
                    <Button 
                      onClick={() => {
                        setError(null);
                        initializeVideoCall();
                      }}
                      className="w-full"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {connectionStatus === 'connecting' 
                        ? 'Configurando câmera e microfone...' 
                        : 'Aguardando o outro participante se conectar'}
                    </p>
                    <div className="animate-pulse flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                    {connectionStatus === 'connecting' && (
                      <div className="text-xs text-gray-500">
                        Se solicitado, permita acesso à câmera e microfone
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12 p-0"
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-12 h-12 p-0"
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={endCall}
          className="rounded-full w-12 h-12 p-0"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}