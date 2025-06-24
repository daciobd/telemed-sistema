import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function VideoDebug() {
  const [logs, setLogs] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicVideo = async () => {
    addLog('=== INICIANDO TESTE BÁSICO ===');
    
    try {
      // Teste 1: Verificar disponibilidade da API
      if (!navigator.mediaDevices) {
        addLog('ERRO: navigator.mediaDevices não disponível');
        return;
      }
      addLog('✓ navigator.mediaDevices disponível');

      // Teste 2: Listar dispositivos
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        addLog(`✓ Dispositivos de vídeo encontrados: ${videoDevices.length}`);
        videoDevices.forEach((device, i) => {
          addLog(`  - Dispositivo ${i + 1}: ${device.label || 'Unnamed'}`);
        });
      } catch (e) {
        addLog(`Erro ao listar dispositivos: ${e}`);
      }

      // Teste 3: Solicitar stream simples
      addLog('Solicitando acesso à câmera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      addLog('✓ Stream obtido com sucesso');
      addLog(`Stream ID: ${mediaStream.id}`);
      addLog(`Stream ativo: ${mediaStream.active}`);
      addLog(`Tracks total: ${mediaStream.getTracks().length}`);
      
      const videoTracks = mediaStream.getVideoTracks();
      addLog(`Video tracks: ${videoTracks.length}`);
      
      if (videoTracks.length > 0) {
        const track = videoTracks[0];
        addLog(`✓ Video track encontrado: ${track.label}`);
        addLog(`Track estado: ${track.readyState}`);
        addLog(`Track habilitado: ${track.enabled}`);
        
        const settings = track.getSettings();
        addLog(`Configurações: ${settings.width}x${settings.height}`);
      }

      setStream(mediaStream);

      // Teste 4: Configurar elemento de vídeo
      if (videoRef.current) {
        addLog('Configurando elemento de vídeo...');
        const video = videoRef.current;
        
        // Event listeners
        video.addEventListener('loadstart', () => addLog('Video: loadstart'));
        video.addEventListener('loadedmetadata', () => {
          addLog(`Video: metadata carregada (${video.videoWidth}x${video.videoHeight})`);
        });
        video.addEventListener('canplay', () => addLog('Video: canplay'));
        video.addEventListener('playing', () => addLog('Video: playing'));
        video.addEventListener('error', (e) => addLog(`Video ERROR: ${e}`));
        
        // Definir srcObject
        video.srcObject = mediaStream;
        addLog('✓ srcObject definido');
        
        // Configurações
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        // Tentar reproduzir manualmente
        try {
          await video.play();
          addLog('✓ video.play() executado com sucesso');
        } catch (playError) {
          addLog(`ERRO video.play(): ${playError}`);
        }
      } else {
        addLog('ERRO: videoRef.current é null');
      }

    } catch (error: any) {
      addLog(`ERRO GERAL: ${error.name} - ${error.message}`);
    }
  };

  const stopTest = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      addLog('Stream parado');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug de Vídeo Avançado</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Controles */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Controles</h2>
            <div className="space-x-2 mb-4">
              <Button onClick={testBasicVideo} disabled={!!stream}>
                Iniciar Teste
              </Button>
              <Button onClick={stopTest} disabled={!stream} variant="destructive">
                Parar
              </Button>
              <Button onClick={clearLogs} variant="outline">
                Limpar Logs
              </Button>
            </div>
            
            {/* Área de vídeo */}
            <div className="bg-black rounded-lg p-2" style={{ minHeight: '200px' }}>
              <video
                ref={videoRef}
                className="w-full h-auto rounded"
                style={{ 
                  backgroundColor: 'black',
                  minHeight: '150px'
                }}
                controls
              />
              {stream && (
                <div className="text-white text-sm mt-2">
                  Status: {stream.active ? 'Ativo' : 'Inativo'} | 
                  Tracks: {stream.getTracks().length}
                </div>
              )}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Logs de Debug</h2>
            <div 
              className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto"
              style={{ fontSize: '12px' }}
            >
              {logs.length === 0 ? (
                <div>Clique em "Iniciar Teste" para começar...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}