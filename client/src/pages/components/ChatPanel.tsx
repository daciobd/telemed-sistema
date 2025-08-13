import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';

const ChatPanel: React.FC = memo(() => {
  return (
    <Card className="h-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Chat da Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48 bg-gray-50 rounded p-3 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-emerald-600">Dr. Santos:</span>
              <span className="ml-2 text-gray-700">Como está se sentindo hoje?</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-blue-600">Você:</span>
              <span className="ml-2 text-gray-700">Melhor, obrigada doutor.</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Input placeholder="Digite sua mensagem..." className="flex-1" />
          <Button size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ChatPanel.displayName = 'ChatPanel';

export default ChatPanel;