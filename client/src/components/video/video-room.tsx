import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import MediaPermissions from './media-permissions';
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
  Clock
} from 'lucide-react';

interface VideoRoomProps {
  appointmentId: number;
  patientName?: string;
  doctorName?: string;
  onEndCall: () => void;
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

  const handlePermissionsGranted = (stream: MediaStream) => {
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    
    setupPeerConnection();
    setMediaReady(true);
    setPermissionError(null);
  };

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
      wsRef.current?.send(JSON.stringify({
        type: 'join-video-call',
        appointmentId,
        userId: user?.id,
        role: user?.role || 'patient'
      }));
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
    switch (data.type) {
      case 'user-joined':
        setConnectionStatus('connected');
        await createOffer();
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
        addChatMessage(data);
        break;
      case 'user-left':
        handleUserLeft();
        break;
    }
  };



  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
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
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
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
    if (!peerConnectionRef.current) return;
    
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      wsRef.current?.send(JSON.stringify({
        type: 'webrtc-offer',
        appointmentId,
        offer
      }));
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;
    
    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      
      wsRef.current?.send(JSON.stringify({
        type: 'webrtc-answer',
        appointmentId,
        answer
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
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: `${user?.firstName} ${user?.lastName}`,
      message: chatMessage,
      timestamp: new Date(),
      type: 'user'
    };
    
    setChatMessages(prev => [...prev, message]);
    
    wsRef.current?.send(JSON.stringify({
      type: 'chat-message',
      appointmentId,
      id: message.id,
      userId: message.userId,
      userName: message.userName,
      message: message.message,
      timestamp: message.timestamp
    }));
    
    setChatMessage('');
  };

  const addChatMessage = (data: any) => {
    const message: ChatMessage = {
      id: data.id,
      userId: data.userId,
      userName: data.userName,
      message: data.message,
      timestamp: new Date(data.timestamp),
      type: data.type
    };
    
    setChatMessages(prev => [...prev, message]);
  };

  const handleUserLeft = () => {
    toast({
      title: "Usuário Desconectado",
      description: "O outro participante saiu da chamada.",
      variant: "destructive",
    });
  };

  const endCall = () => {
    wsRef.current?.send(JSON.stringify({
      type: 'leave-video-call',
      appointmentId
    }));
    
    cleanup();
    onEndCall();
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
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-gray-800"
        />
        
        {/* Local Video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
            <Button
              variant={isVideoEnabled ? "default" : "secondary"}
              size="sm"
              onClick={toggleVideo}
              className="rounded-full"
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant={isAudioEnabled ? "default" : "secondary"}
              size="sm"
              onClick={toggleAudio}
              className="rounded-full"
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              className="rounded-full"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="rounded-full"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white border-l flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Chat da Consulta</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`${msg.userId === user?.id ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    msg.userId === user?.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 min-h-[40px] max-h-[100px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}