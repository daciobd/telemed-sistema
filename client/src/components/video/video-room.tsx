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
        wsRef.current.send(JSON.stringify({
          type: 'media-ready',
          appointmentId,
          userId: user?.id
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
        wsRef.current?.send(JSON.stringify({
          type: 'join-video-call',
          appointmentId,
          userId: user?.id,
          role: user?.role || 'patient'
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
              {localStreamRef.current.active ? 'Ativo' : 'Inativo'}
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
          <div className="absolute right-4 top-4 bottom-4 w-80 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Chat da Consulta</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded text-sm ${
                    msg.userId === user?.id
                      ? 'bg-blue-100 ml-auto max-w-[80%]'
                      : 'bg-gray-100 mr-auto max-w-[80%]'
                  }`}
                >
                  <div className="font-medium text-xs text-gray-600">{msg.userName}</div>
                  <div>{msg.message}</div>
                </div>
              ))}
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
      </div>
    </div>
  );
}