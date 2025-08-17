import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";

interface AIConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onDismiss?: () => void;
}

export const AIConsentBanner: React.FC<AIConsentBannerProps> = ({
  onAccept,
  onDecline,
  onDismiss
}) => {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Consentimento para IA Médica:</strong> Esta consulta pode utilizar recursos de
          inteligência artificial para auxiliar no diagnóstico. Os dados serão processados de forma
          segura e confidencial.
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onDecline}
            className="text-xs"
          >
            Recusar
          </Button>
          <Button
            size="sm"
            onClick={onAccept}
            className="bg-blue-600 hover:bg-blue-700 text-xs"
          >
            Aceitar
          </Button>
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="p-1 h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};