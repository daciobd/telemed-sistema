import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Mic, Monitor, AlertCircle, CheckCircle } from 'lucide-react';

interface MediaPermissionsProps {
  onPermissionsGranted: (stream: MediaStream) => void;
  onError: (error: string) => void;
}

export default function MediaPermissions({ onPermissionsGranted, onError }: MediaPermissionsProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const requestPermissions = async () => {
    setIsRequesting(true);
    setPermissionError(null);

    try {
      // First try with both video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      onPermissionsGranted(stream);
      
    } catch (error: any) {
      console.error('Permission error:', error);
      
      if (error.name === 'NotAllowedError') {
        setPermissionError('Permissões negadas. Clique no ícone de câmera na barra de endereços para permitir acesso.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('Câmera ou microfone não encontrados. Verifique se estão conectados.');
      } else if (error.name === 'NotReadableError') {
        setPermissionError('Câmera ou microfone já estão sendo usados por outro aplicativo.');
      } else {
        setPermissionError('Erro ao acessar câmera/microfone. Tente novamente.');
      }
      
      onError(permissionError || 'Erro de permissões');
    } finally {
      setIsRequesting(false);
    }
  };

  const requestAudioOnly = async () => {
    setIsRequesting(true);
    setPermissionError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      onPermissionsGranted(stream);
    } catch (error: any) {
      console.error('Audio permission error:', error);
      setPermissionError('Não foi possível acessar o microfone.');
      onError('Erro de permissões de áudio');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle>Permissões de Mídia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600 mb-6">
            Para participar da videoconsulta, precisamos acessar sua câmera e microfone.
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Camera className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Câmera</div>
                <div className="text-sm text-gray-600">Para videochamada</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mic className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Microfone</div>
                <div className="text-sm text-gray-600">Para comunicação por voz</div>
              </div>
            </div>
          </div>

          {permissionError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{permissionError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button 
              onClick={requestPermissions} 
              disabled={isRequesting}
              className="w-full"
            >
              {isRequesting ? 'Solicitando Permissões...' : 'Permitir Câmera e Microfone'}
            </Button>
            
            <Button 
              onClick={requestAudioOnly} 
              disabled={isRequesting}
              variant="outline"
              className="w-full"
            >
              Apenas Microfone
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Como permitir acesso:</div>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Clique no ícone de câmera na barra de endereços</li>
                  <li>Selecione "Permitir" para câmera e microfone</li>
                  <li>Clique em "Permitir Câmera e Microfone" novamente</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}