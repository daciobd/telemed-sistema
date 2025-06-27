import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import MediaPermissions from './media-permissions';
import SimpleMedicalRecord from './SimpleMedicalRecord';
import DoctorConsultationCompletion from '../consultation/DoctorConsultationCompletion';
import PatientConsultationFeedback from '../consultation/PatientConsultationFeedback';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Monitor,
  Camera,
  Settings,
  Send,
  Clock,
  FileText,
  Calendar,
  FileCheck,
  Pill
} from 'lucide-react';

interface VideoRoomProps {
  appointmentId: number;
  patientName?: string;
  doctorName?: string;
  onEndCall?: () => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system';
}

export default function VideoRoom({ appointmentId, patientName, doctorName, onEndCall }: VideoRoomProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Detectar se estamos no modo de teste (URL /video-test)
  const isTestMode = window.location.pathname === '/video-test';
  
  // Para modo de teste, simular um usuário baseado no localStorage
  const testUser = isTestMode ? JSON.parse(localStorage.getItem('testUser') || '{}') : null;
  
  // Video/Audio states
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [mediaReady, setMediaReady] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Medical record states
  const [showMedicalRecord, setShowMedicalRecord] = useState(false);
  const [showMemedModal, setShowMemedModal] = useState(false);
  
  // Consultation completion states
  const [showDoctorCompletion, setShowDoctorCompletion] = useState(false);
  const [showPatientFeedback, setShowPatientFeedback] = useState(false);
  const [isConsultationEnding, setIsConsultationEnding] = useState(false);

  // Fetch appointment details to get patient information
  const { data: appointment } = useQuery({
    queryKey: [`/api/appointments/${appointmentId}`],
    enabled: !!appointmentId && appointmentId !== 999 // Skip for demo
  });
  
  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  
  // Timer states
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime] = useState(new Date());

  useEffect(() => {
    initializeWebSocket();
    
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTime.getTime()) / 1000));
    }, 1000);

    return () => {
      cleanup();
      clearInterval(timer);
    };
  }, []);

  // Separate effect to handle video element setup when both stream and ref are ready
  useEffect(() => {
    if (localStreamRef.current && localVideoRef.current && mediaReady) {
      console.log('Setting up local video element with existing stream');
      const video = localVideoRef.current;
      const stream = localStreamRef.current;
      
      // Add event listeners for debugging
      video.addEventListener('loadstart', () => console.log('Local video: loadstart'));
      video.addEventListener('loadedmetadata', () => {
        console.log(`Local video: metadata loaded (${video.videoWidth}x${video.videoHeight})`);
      });
      video.addEventListener('canplay', () => console.log('Local video: canplay'));
      video.addEventListener('playing', () => console.log('Local video: playing'));
      video.addEventListener('error', (e) => console.error('Local video error:', e));
      
      // Set properties
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      // Force play
      setTimeout(async () => {
        try {
          await video.play();
          console.log('Local video play successful');
        } catch (e) {
          console.error('Local video play failed:', e);
        }
      }, 100);
    }
  }, [mediaReady]);

  const handlePermissionsGranted = (stream: MediaStream) => {
    console.log('Permissions granted, setting up local stream');
    console.log('Stream details:', {
      id: stream.id,
      active: stream.active,
      tracks: stream.getTracks().length,
      videoTracks: stream.getVideoTracks().length
    });
    
    localStreamRef.current = stream;
    
    setupPeerConnection();
    setMediaReady(true);
    setPermissionError(null);
    
    // Notify server that media is ready
    setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const currentUser = isTestMode ? testUser : user;
        wsRef.current.send(JSON.stringify({
          type: 'media-ready',
          appointmentId,
          userId: currentUser?.id
        }));
      }
    }, 500);
  };

  // Separate effect to handle video element setup when both stream and ref are ready
  useEffect(() => {
    if (localStreamRef.current && localVideoRef.current && mediaReady) {
      console.log('Setting up local video element with existing stream');
      const video = localVideoRef.current;
      const stream = localStreamRef.current;
      
      // Add event listeners for debugging
      video.addEventListener('loadstart', () => console.log('Local video: loadstart'));
      video.addEventListener('loadedmetadata', () => {
        console.log(`Local video: metadata loaded (${video.videoWidth}x${video.videoHeight})`);
      });
      video.addEventListener('canplay', () => console.log('Local video: canplay'));
      video.addEventListener('playing', () => console.log('Local video: playing'));
      video.addEventListener('error', (e) => console.error('Local video error:', e));
      
      // Set properties
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      // Force play
      setTimeout(async () => {
        try {
          await video.play();
          console.log('Local video play successful');
        } catch (e) {
          console.error('Local video play failed:', e);
        }
      }, 100);
    }
  }, [mediaReady, localStreamRef.current, localVideoRef.current]);

  const handlePermissionError = (error: string) => {
    setPermissionError(error);
    setMediaReady(false);
  };

  const initializeWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected for video call');
      
      // Small delay to ensure connection is stable
      setTimeout(() => {
        const currentUser = isTestMode ? testUser : user;
        wsRef.current?.send(JSON.stringify({
          type: 'join-video-call',
          appointmentId,
          userId: currentUser?.id,
          role: currentUser?.role || 'patient'
        }));
      }, 100);
    };
    
    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      await handleWebSocketMessage(data);
    };
    
    wsRef.current.onclose = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected');
    };
  };

  const handleWebSocketMessage = async (data: any) => {
    console.log('WebSocket message received:', data.type);
    
    switch (data.type) {
      case 'user-joined':
        console.log('User joined, setting connected status');
        setConnectionStatus('connected');
        // Only create offer if we have media ready and this is the initiator
        if (mediaReady && peerConnectionRef.current) {
          setTimeout(() => createOffer(), 1000); // Small delay to ensure peer is ready
        }
        break;
      case 'webrtc-offer':
        await handleOffer(data.offer);
        break;
      case 'webrtc-answer':
        await handleAnswer(data.answer);
        break;
      case 'webrtc-ice-candidate':
        await handleIceCandidate(data.candidate);
        break;
      case 'chat-message':
        console.log('Received chat message:', data);
        addChatMessage(data);
        break;
      case 'user-left':
        handleUserLeft();
        break;
      case 'room-ready':
        // New message type to indicate both users are connected
        console.log('Room is ready for WebRTC');
        setConnectionStatus('connected');
        if (mediaReady && peerConnectionRef.current && data.shouldInitiate) {
          setTimeout(() => createOffer(), 500);
        }
        break;
    }
  };

  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    };
    
    peerConnectionRef.current = new RTCPeerConnection(configuration);
    
    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });
    }
    
    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      console.log('Remote stream received');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(e => {
          console.log('Remote video autoplay failed:', e);
        });
      }
    };
    
    // Handle connection state changes
    peerConnectionRef.current.onconnectionstatechange = () => {
      const state = peerConnectionRef.current?.connectionState;
      console.log('Connection state changed:', state);
      
      if (state === 'connected') {
        setConnectionStatus('connected');
        toast({
          title: "Conectado!",
          description: "Videoconsulta iniciada com sucesso",
        });
      } else if (state === 'disconnected' || state === 'failed') {
        setConnectionStatus('disconnected');
        toast({
          title: "Conexão perdida",
          description: "A videoconsulta foi desconectada",
          variant: "destructive"
        });
      }
    };
    
    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current?.send(JSON.stringify({
          type: 'webrtc-ice-candidate',
          appointmentId,
          candidate: event.candidate
        }));
      }
    };
  };

  const createOffer = async () => {
    if (!peerConnectionRef.current) {
      console.log('No peer connection available for offer');
      return;
    }
    
    try {
      console.log('Creating WebRTC offer');
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await peerConnectionRef.current.setLocalDescription(offer);
      
      wsRef.current?.send(JSON.stringify({
        type: 'webrtc-offer',
        appointmentId,
        offer
      }));
      
      console.log('WebRTC offer sent');
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "Erro de conexão",
        description: "Falha ao iniciar videochamada",
        variant: "destructive"
      });
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      console.log('Handling WebRTC offer');
      await peerConnectionRef.current.setRemoteDescription(offer);
      
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      wsRef.current?.send(JSON.stringify({
        type: 'webrtc-answer',
        appointmentId,
        answer
      }));
      
      console.log('WebRTC answer sent');
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      console.log('Handling WebRTC answer');
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
      console.log('ICE candidate added');
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Replace video track in peer connection
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
      
      setIsScreenSharing(true);
      
      // Handle screen share end
      videoTrack.onended = () => {
        stopScreenShare();
      };
      
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar a tela.",
        variant: "destructive",
      });
    }
  };

  const stopScreenShare = async () => {
    try {
      // Get camera stream again
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
      
      // Update local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = cameraStream;
      }
      
      localStreamRef.current = cameraStream;
      setIsScreenSharing(false);
      
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    const currentUser = isTestMode ? testUser : user;
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser?.id || '',
      userName: isTestMode ? testUser?.name : `${user?.firstName} ${user?.lastName}`,
      message: chatMessage,
      timestamp: new Date(),
      type: 'user'
    };
    
    console.log('Sending chat message:', message);
    setChatMessages(prev => [...prev, message]);
    
    const wsMessage = {
      type: 'chat-message',
      appointmentId,
      id: message.id,
      userId: message.userId,
      userName: message.userName,
      message: message.message,
      timestamp: message.timestamp
    };
    
    console.log('WebSocket message to send:', wsMessage);
    wsRef.current?.send(JSON.stringify(wsMessage));
    
    setChatMessage('');
  };

  const addChatMessage = (data: any) => {
    const message: ChatMessage = {
      id: data.id,
      userId: data.userId,
      userName: data.userName,
      message: data.message,
      timestamp: new Date(data.timestamp),
      type: data.type || 'user'
    };
    
    setChatMessages(prev => {
      // Avoid duplicate messages
      if (prev.find(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  };

  const handleUserLeft = () => {
    toast({
      title: "Usuário Desconectado",
      description: "O outro participante saiu da chamada.",
      variant: "destructive",
    });
  };

  const endCall = () => {
    if (isTestMode) {
      // No modo de teste, encerrar diretamente
      cleanup();
      window.location.href = '/video-test';
      return;
    }

    const currentUser = user;
    if (!currentUser) return;

    // Iniciar processo de finalização baseado no tipo de usuário
    setIsConsultationEnding(true);
    
    if (currentUser.role === 'doctor') {
      setShowDoctorCompletion(true);
    } else {
      setShowPatientFeedback(true);
    }
  };

  const handleDoctorCompletionComplete = async (data: any) => {
    try {
      // Enviar relatório do médico para o backend
      const response = await fetch('/api/consultation-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          doctorId: user?.id,
          ...data
        })
      });

      if (response.ok) {
        // Marcar consulta como concluída
        await fetch(`/api/appointments/${appointmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' })
        });

        cleanup();
        setShowDoctorCompletion(false);
        window.location.href = '/doctor-agenda';
      }
    } catch (error) {
      console.error('Error saving doctor completion:', error);
    }
  };

  const handlePatientFeedbackComplete = async (data: any) => {
    try {
      // Enviar feedback do paciente para o backend
      const response = await fetch('/api/consultation-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          patientId: user?.id,
          ...data
        })
      });

      if (response.ok) {
        cleanup();
        setShowPatientFeedback(false);
        
        if (data.wantsToReschedule) {
          // Redirecionar para agendamento
          window.location.href = '/agendamentos';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      console.error('Error saving patient feedback:', error);
    }
  };

  const handleCancelCompletion = () => {
    setShowDoctorCompletion(false);
    setShowPatientFeedback(false);
    setIsConsultationEnding(false);
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Show permissions screen if media is not ready
  if (!mediaReady) {
    return (
      <MediaPermissions
        onPermissionsGranted={handlePermissionsGranted}
        onError={handlePermissionError}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold">Videoconsulta</h1>
            <p className="text-sm text-gray-600">
              {user?.role === 'doctor' ? `Paciente: ${patientName}` : `Dr(a): ${doctorName}`}
            </p>
          </div>
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
            {connectionStatus === 'connected' ? 'Conectado' : 'Conectando...'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {formatDuration(callDuration)}
          </div>
          
          {/* Medical Calendar Button - visible for doctors */}
          {(user?.role === 'doctor' || (isTestMode && testUser?.role === 'doctor')) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/doctor-agenda'}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Calendar className="h-4 w-4" />
              Agenda
            </Button>
          )}
          
          {/* Finalize Consultation Button - only for doctors */}
          {(user?.role === 'doctor' || (isTestMode && testUser?.role === 'doctor')) && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowDoctorCompletion(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="h-4 w-4" />
              Finalizar Consulta
            </Button>
          )}
          
          {/* End Call Button - for everyone */}
          <Button
            variant="destructive"
            size="sm"
            onClick={endCall}
            className="flex items-center gap-2"
          >
            <PhoneOff className="h-4 w-4" />
            Encerrar
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video or Simulated Patient */}
        {connectionStatus === 'connected' && remoteVideoRef.current?.srcObject ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-800"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
            {/* Simulated Patient Video */}
            <div className="absolute inset-0 bg-gray-800">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-6xl font-bold shadow-2xl animate-pulse">
                  {patientName ? patientName.charAt(0).toUpperCase() : 'P'}
                </div>
              </div>
            </div>
            
            {/* Patient Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              <div className="text-lg font-semibold">{patientName || 'Paciente'}</div>
              <div className="text-sm text-green-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Conectado - Áudio/Vídeo simulado
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="absolute bottom-4 left-4 bg-yellow-500/90 text-white px-3 py-1 rounded-full text-sm">
              {connectionStatus === 'connecting' ? 'Conectando...' : 'Simulação ativa'}
            </div>
          </div>
        )}
        
        {/* Local Video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ 
              backgroundColor: 'black',
              transform: 'scaleX(-1)'
            }}
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            Você
          </div>
          {mediaReady && localStreamRef.current && (
            <div className="absolute top-2 left-2 text-xs text-green-400 bg-black/50 px-2 py-1 rounded">
              {localStreamRef.current?.active ? 'Ativo' : 'Inativo'}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isVideoEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleVideo}
                    className="rounded-full"
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isVideoEnabled ? "Desligar câmera" : "Ligar câmera"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isAudioEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleAudio}
                    className="rounded-full"
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isAudioEnabled ? "Desligar microfone" : "Ligar microfone"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isScreenSharing ? "default" : "outline"}
                    size="sm"
                    onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                    className="rounded-full"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isScreenSharing ? "Parar compartilhamento de tela" : "Compartilhar tela"}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChat(!showChat)}
                    className="rounded-full"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showChat ? "Fechar chat" : "Abrir chat"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {(user?.role === 'doctor' || (isTestMode && testUser?.role === 'doctor')) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showMedicalRecord ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowMedicalRecord(!showMedicalRecord)}
                    className="rounded-full"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showMedicalRecord ? "Fechar prontuário" : "Abrir prontuário"}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="absolute right-4 top-4 bottom-4 w-80 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Chat da Consulta</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Nenhuma mensagem ainda. Digite algo para começar a conversa.
                </div>
              )}
              {chatMessages.map((msg) => {
                const currentUserId = isTestMode ? testUser?.id : user?.id;
                const isMyMessage = msg.userId === currentUserId;
                
                return (
                  <div
                    key={msg.id}
                    className={`p-2 rounded text-sm ${
                      isMyMessage
                        ? 'bg-blue-100 ml-auto max-w-[80%]'
                        : 'bg-gray-100 mr-auto max-w-[80%]'
                    }`}
                  >
                    <div className="font-medium text-xs text-gray-600">{msg.userName}</div>
                    <div>{msg.message}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 border-t flex gap-2">
              <Textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 min-h-[60px]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
              />
              <Button
                onClick={sendChatMessage}
                size="sm"
                disabled={!chatMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Medical Record Panel */}
        {showMedicalRecord && (user?.role === 'doctor' || (isTestMode && testUser?.role === 'doctor')) && (
          <div className="absolute left-4 top-4 bottom-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden">
            {isTestMode ? (
              <div className="p-6 h-full overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Prontuário Eletrônico</h3>
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    Modo de teste - Dados simulados
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Dados do Paciente</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Nome:</strong> {patientName || 'Paciente Teste'}</p>
                      <p><strong>CPF:</strong> ***.***.***-12 (protegido)</p>
                      <p><strong>Idade:</strong> 45 anos</p>
                      <p><strong>Telefone:</strong> (11) ****-1234 (protegido)</p>
                    </div>
                  </div>
                  
                  <hr className="my-4 border-gray-200" />
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Histórico Médico</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Alergias:</strong> Penicilina</p>
                      <p><strong>Medicações Atuais:</strong> Losartana 50mg</p>
                      <p><strong>Condições:</strong> Hipertensão arterial</p>
                    </div>
                  </div>
                  
                  <hr className="my-4 border-gray-200" />
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Consulta Atual</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Queixa Principal:</strong> Dor de cabeça persistente</p>
                      <p><strong>Sintomas:</strong> Cefaleia há 3 dias</p>
                      <p><strong>Sinais Vitais:</strong></p>
                      <ul className="ml-4 list-disc">
                        <li>PA: 140/90 mmHg</li>
                        <li>FC: 78 bpm</li>
                        <li>Temp: 36.5°C</li>
                      </ul>
                    </div>
                  </div>
                  
                  <hr className="my-4 border-gray-200" />
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Ações Disponíveis</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setShowMemedModal(true)}
                      >
                        <Pill className="h-4 w-4 mr-2" />
                        Abrir MEMED
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => alert('Função disponível no sistema completo')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Solicitar Exames
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SimpleMedicalRecord 
                appointmentId={appointmentId}
                patientId={1}
                isDoctor={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Doctor Consultation Completion Modal */}
      {showDoctorCompletion && (
        <DoctorConsultationCompletion
          appointmentId={appointmentId}
          patientName={patientName || 'Paciente Teste'}
          onComplete={handleDoctorCompletionComplete}
          onCancel={handleCancelCompletion}
        />
      )}

      {/* Patient Consultation Feedback Modal */}
      {showPatientFeedback && (
        <PatientConsultationFeedback
          appointmentId={appointmentId}
          doctorName={doctorName || 'Dr. Teste'}
          consultationDuration={formatDuration(callDuration)}
          onComplete={handlePatientFeedbackComplete}
          onScheduleNew={() => window.location.href = '/agendamentos'}
        />
      )}

      {/* MEMED Modal with Patient Data */}
      {showMemedModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Dados do Paciente - MEMED</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMemedModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>Instruções:</strong> Use os ícones 📋 ao lado de cada dado para copiar individualmente no MEMED.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open('https://memed.com.br', '_blank')}
                    >
                      🌐 Abrir MEMED
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Dados Pessoais</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span><strong>Nome:</strong> {patientName || 'Paciente Teste'}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText(patientName || 'Paciente Teste');
                              toast({ title: "Nome copiado!", duration: 1500 });
                            }}
                          >
                            📋
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span><strong>CPF:</strong> 123.456.789-12</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText('123.456.789-12');
                              toast({ title: "CPF copiado!", duration: 1500 });
                            }}
                          >
                            📋
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span><strong>Data de Nascimento:</strong> 15/03/1978</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText('15/03/1978');
                              toast({ title: "Data de nascimento copiada!", duration: 1500 });
                            }}
                          >
                            📋
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span><strong>Telefone:</strong> (11) 99999-1234</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText('(11) 99999-1234');
                              toast({ title: "Telefone copiado!", duration: 1500 });
                            }}
                          >
                            📋
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span><strong>Endereço:</strong> Rua das Flores, 123</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText('Rua das Flores, 123');
                              toast({ title: "Endereço copiado!", duration: 1500 });
                            }}
                          >
                            📋
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span><strong>Cidade:</strong> São Paulo/SP</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              navigator.clipboard.writeText('São Paulo/SP');
                              toast({ title: "Cidade copiada!", duration: 1500 });
                            }}
                          >
                            📋
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Histórico Médico</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p><strong>Alergias:</strong> Penicilina</p>
                        <p><strong>Medicações Atuais:</strong> Losartana 50mg</p>
                        <p><strong>Condições:</strong> Hipertensão arterial</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Consulta Atual</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p><strong>Queixa Principal:</strong> Dor de cabeça persistente</p>
                        <p><strong>Sintomas:</strong> Cefaleia há 3 dias</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Sinais Vitais</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <p><strong>PA:</strong> 140/90 mmHg</p>
                        <p><strong>FC:</strong> 78 bpm</p>
                        <p><strong>Temperatura:</strong> 36.5°C</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">Como usar no MEMED:</h4>
                  <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Abra o MEMED clicando em "Abrir MEMED" acima</li>
                    <li>Crie uma nova prescrição no MEMED</li>
                    <li>Use os ícones 📋 para copiar cada dado individualmente</li>
                    <li>Cole cada dado no campo correspondente do MEMED</li>
                    <li>Adicione os medicamentos conforme diagnóstico</li>
                    <li>Gere a prescrição digital</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}