import React, { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Volume2, Video, Mic } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = memo(({ 
  onClose, 
  isVideoEnabled, 
  isAudioEnabled 
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações da Consulta
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="video-toggle" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Câmera
              </Label>
              <Switch id="video-toggle" checked={isVideoEnabled} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="audio-toggle" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Microfone
              </Label>
              <Switch id="audio-toggle" checked={isAudioEnabled} />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume do Sistema
            </Label>
            <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
          </div>
          
          <div className="space-y-4">
            <Label>Qualidade de Vídeo</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm">Baixa</Button>
              <Button variant="default" size="sm">Média</Button>
              <Button variant="outline" size="sm">Alta</Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onClose}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

SettingsModal.displayName = 'SettingsModal';

export default SettingsModal;