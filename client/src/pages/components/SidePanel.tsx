import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Clock, User, Activity } from 'lucide-react';

interface SidePanelProps {
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="w-80 bg-white h-full shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Painel Avançado</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4 max-h-full overflow-y-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Histórico da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Início</span>
                <Badge variant="secondary">14:30</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duração</span>
                <Badge variant="outline">15 min</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <Badge variant="default">Ativo</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                Exames Anteriores
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Prescrições
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

SidePanel.displayName = 'SidePanel';

export default SidePanel;