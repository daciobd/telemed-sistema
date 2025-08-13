import React, { memo, useCallback, useMemo, Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useRenders, useRenderAlert } from '../../dev/useRenders';
import { usePerfMarks } from '../../dev/usePerfMarks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  Phone, 
  MessageSquare, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  Calendar,
  Settings,
  Monitor,
  Mic,
  MicOff,
  VideoOff,
  Share,
  MoreHorizontal
} from 'lucide-react';

// Lazy load non-critical components
const SidePanel = lazy(() => import('./components/SidePanel'));
const ChatPanel = lazy(() => import('./components/ChatPanel'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));

// Memoized consultation data
interface ConsultationData {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  scheduledTime: string;
  status: 'waiting' | 'active' | 'completed';
  duration: number;
  notes?: string;
}

interface ControlsProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onEndCall: () => void;
  onToggleSettings: () => void;
}

// Memoized control buttons component
const ConsultationControls = memo(({ 
  isVideoEnabled, 
  isAudioEnabled, 
  onToggleVideo, 
  onToggleAudio, 
  onEndCall,
  onToggleSettings 
}: ControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 py-4 bg-gray-100 rounded-lg">
      <Button
        variant={isVideoEnabled ? "default" : "destructive"}
        size="sm"
        onClick={onToggleVideo}
        aria-label={isVideoEnabled ? "Desligar câmera" : "Ligar câmera"}
      >
        {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
      </Button>
      
      <Button
        variant={isAudioEnabled ? "default" : "destructive"}
        size="sm"
        onClick={onToggleAudio}
        aria-label={isAudioEnabled ? "Desligar microfone" : "Ligar microfone"}
      >
        {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleSettings}
        aria-label="Configurações"
      >
        <Settings className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        aria-label="Compartilhar tela"
      >
        <Share className="w-4 h-4" />
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onEndCall}
        aria-label="Encerrar consulta"
      >
        <Phone className="w-4 h-4" />
      </Button>
    </div>
  );
});

ConsultationControls.displayName = 'ConsultationControls';

// Memoized patient info component
const PatientInfo = memo(({ consultation }: { consultation: ConsultationData }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações do Paciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/api/placeholder/user" alt={consultation.patientName} />
            <AvatarFallback>{consultation.patientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{consultation.patientName}</h3>
            <p className="text-sm text-gray-600">Consulta agendada: {consultation.scheduledTime}</p>
            <Badge variant="outline" className="mt-1">
              {consultation.specialty}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PatientInfo.displayName = 'PatientInfo';

// Memoized doctor info component
const DoctorInfo = memo(({ consultation }: { consultation: ConsultationData }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          Médico Responsável
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/api/placeholder/doctor" alt={consultation.doctorName} />
            <AvatarFallback>Dr</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{consultation.doctorName}</h3>
            <p className="text-sm text-gray-600">{consultation.specialty}</p>
            <Badge variant="secondary" className="mt-1">
              Online
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

DoctorInfo.displayName = 'DoctorInfo';

// Main consultation component
const EnhancedConsultation: React.FC = () => {
  // Performance monitoring
  useRenders("EnhancedConsultation");
  // avisa se re-renderizar demais (ajuda a achar gargalos)
  useRenderAlert("EnhancedConsultation", 15);
  const { markStart, markEnd } = usePerfMarks("EnhancedConsultation");
  
  markStart("component-init");
  
  const { user, isLoading: authLoading } = useAuth();
  
  // State management with useCallback
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [showSidePanel, setShowSidePanel] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  
  // Memoized URL params
  const consultationId = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('consultationId') || 'unknown';
  }, []);
  
  // Optimized query with select and staleTime
  const { data: consultation, isLoading, error } = useQuery({
    queryKey: ['/api/consultations', consultationId],
    enabled: !!consultationId,
    staleTime: 60 * 1000, // 60 seconds
    select: useCallback((data: any) => {
      // Reduce payload by selecting only needed fields
      if (!data) return null;
      return {
        id: data.id,
        patientName: data.patient?.name || 'Paciente Demo',
        doctorName: data.doctor?.name || 'Dr. Silva',
        specialty: data.specialty || 'Medicina Geral',
        scheduledTime: data.scheduledTime || new Date().toLocaleString(),
        status: data.status || 'active',
        duration: data.duration || 0,
        notes: data.notes
      } as ConsultationData;
    }, [])
  });
  
  // Memoized event handlers
  const handleToggleVideo = useCallback(() => {
    setIsVideoEnabled(prev => !prev);
    markEnd("video-toggle");
  }, [markEnd]);
  
  const handleToggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
    markEnd("audio-toggle");
  }, [markEnd]);
  
  const handleEndCall = useCallback(() => {
    markEnd("consultation-end");
    // In a real app, this would end the consultation
    window.location.href = '/dashboard';
  }, [markEnd]);
  
  const handleToggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);
  
  const handleToggleSidePanel = useCallback(() => {
    setShowSidePanel(prev => !prev);
  }, []);
  
  // Memoized demo data fallback
  const consultationData = useMemo(() => {
    if (consultationId === 'demo') {
      return {
        id: 'demo',
        patientName: 'Maria Silva',
        doctorName: 'Dr. João Santos',
        specialty: 'Cardiologia',
        scheduledTime: new Date().toLocaleString(),
        status: 'active' as const,
        duration: 15,
        notes: 'Consulta de rotina'
      };
    }
    return consultation;
  }, [consultation, consultationId]);
  
  markEnd("component-init");
  
  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando consulta...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && consultationId !== 'demo') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Erro ao carregar consulta</h2>
              <p className="text-gray-600 mb-4">
                Não foi possível carregar os dados da consulta.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Voltar ao início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!consultationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Consulta não encontrada</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Teleconsulta Avançada</h1>
                <p className="text-sm text-gray-500">
                  Renders: {renderCount} | Status: {consultationData.status}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {consultationData.duration}min
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSidePanel}
                aria-label="Alternar painel lateral"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main video area */}
          <div className="lg:col-span-3">
            <Card className="h-96 lg:h-[600px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Consulta com {consultationData.doctorName}
                  </h3>
                  <p className="text-gray-600">
                    {isVideoEnabled ? 'Vídeo ativo' : 'Vídeo desligado'} • {isAudioEnabled ? 'Áudio ativo' : 'Áudio desligado'}
                  </p>
                </div>
              </div>
              
              {/* Video controls overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <ConsultationControls
                  isVideoEnabled={isVideoEnabled}
                  isAudioEnabled={isAudioEnabled}
                  onToggleVideo={handleToggleVideo}
                  onToggleAudio={handleToggleAudio}
                  onEndCall={handleEndCall}
                  onToggleSettings={handleToggleSettings}
                />
              </div>
            </Card>
          </div>
          
          {/* Sidebar with scrollable content */}
          <div className="lg:col-span-1">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <PatientInfo consultation={consultationData} />
              <DoctorInfo consultation={consultationData} />
              
              {/* Quick actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Prontuário
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reagendar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lazy loaded components with Suspense */}
      {showSidePanel && (
        <Suspense fallback={<div>Carregando painel...</div>}>
          <SidePanel onClose={() => setShowSidePanel(false)} />
        </Suspense>
      )}
      
      {showSettings && (
        <Suspense fallback={<div>Carregando configurações...</div>}>
          <SettingsModal 
            onClose={() => setShowSettings(false)}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
          />
        </Suspense>
      )}
    </div>
  );
};

export default memo(EnhancedConsultation);