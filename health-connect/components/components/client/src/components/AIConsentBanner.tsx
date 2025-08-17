import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Brain, Shield } from 'lucide-react';
import { useAIConsent } from '@/hooks/useAIFeatures';

interface AIConsentBannerProps {
  onConsentGiven?: () => void;
}

export function AIConsentBanner({ onConsentGiven }: AIConsentBannerProps) {
  const { hasConsent, giveConsent } = useAIConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [isGivingConsent, setIsGivingConsent] = useState(false);

  if (hasConsent) return null;

  const handleGiveConsent = async () => {
    setIsGivingConsent(true);
    try {
      await giveConsent();
      onConsentGiven?.();
      setShowDetails(false);
    } catch (error) {
      console.error('Failed to give consent:', error);
    } finally {
      setIsGivingConsent(false);
    }
  };

  return (
    <>
      <Alert className="mb-4 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Assistente de IA Médica Disponível</strong>
            <p className="text-sm mt-1">
              Para usar recursos de inteligência artificial, é necessário consentimento informado.
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
              Ver Detalhes
            </Button>
            <Button size="sm" onClick={() => setShowDetails(true)}>
              Autorizar IA
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent 
          aria-describedby="ai-consent-desc"
          className="
            max-w-2xl w-[min(92vw,42rem)]
            max-h-[80vh]
            p-0
            overflow-hidden
            grid grid-rows-[1fr_auto]
          "
        >
          <div className="consent-scroll overflow-y-auto p-6 max-h-[70vh]">
            <DialogHeader className="mb-2">
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Consentimento para Assistente de IA Médica
              </DialogTitle>
              <DialogDescription id="ai-consent-desc">
                Este assistente de IA é apenas para APOIO - não substitui o médico. Leia atentamente antes de autorizar.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>IMPORTANTE - LEIA ATENTAMENTE</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-red-700 mb-2">⚠️ LIMITAÇÕES IMPORTANTES</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Este assistente de IA é apenas para APOIO</strong> - não substitui o médico</li>
                  <li><strong>NÃO usar em situações de emergência</strong> - procure atendimento imediato</li>
                  <li><strong>Não é um diagnóstico</strong> - sempre confirme com avaliação médica presencial</li>
                  <li><strong>Para casos pediátricos, gestantes</strong> - obrigatória consulta presencial</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2">🔒 PRIVACIDADE E DADOS</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Dados são processados sem informações pessoais identificáveis (CPF, nome, etc.)</li>
                  <li>Apenas sintomas e informações clínicas relevantes são analisados</li>
                  <li>Conformidade com LGPD - dados mínimos necessários</li>
                  <li>Logs de uso para auditoria (sem dados pessoais)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-700 mb-2">✅ O QUE O ASSISTENTE FAZ</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Sugere hipóteses diagnósticas com baixa confiança</li>
                  <li>Identifica sinais de alerta e urgência</li>
                  <li>Recomenda especialidades médicas</li>
                  <li>Fornece informações educativas gerais</li>
                  <li>Sempre recomenda avaliação médica presencial</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-orange-700 mb-2">🚫 O QUE O ASSISTENTE NÃO FAZ</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Não diagnostica definitivamente</li>
                  <li>Não prescreve medicamentos ou dosagens</li>
                  <li>Não verifica interações medicamentosas (use base licenciada)</li>
                  <li>Não orienta emergências médicas</li>
                  <li>Não substitui consulta médica</li>
                </ul>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription>
                <strong>Ao autorizar, você confirma que:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Entende que é apenas um assistente de apoio</li>
                  <li>Não usará para emergências médicas</li>
                  <li>Sempre buscará avaliação médica presencial para decisões clínicas</li>
                  <li>Concorda com o processamento mínimo de dados clínicos</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>

          <DialogFooter className="sticky bottom-0 bg-background border-t p-4 flex gap-2">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={async () => {
                console.log("Autorizar IA: clicado");
                setIsGivingConsent(true);
                try {
                  const response = await fetch('/api/medical/consent', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      consentType: 'AI_MEDICAL_ASSISTANCE',
                      timestamp: new Date().toISOString()
                    })
                  });
                  
                  console.log("POST /api/medical/consent =", response.status);
                  
                  if (response.ok) {
                    // Store consent locally
                    const consentData = {
                      timestamp: new Date().toISOString(),
                      version: '1.0',
                      type: 'AI_MEDICAL_ASSISTANCE'
                    };
                    localStorage.setItem('ai-medical-consent', JSON.stringify(consentData));
                    
                    // Update state and close modal
                    setShowDetails(false);
                    onConsentGiven?.();
                    
                    // Force page refresh to update AI features
                    window.location.reload();
                  }
                } catch (error) {
                  console.error('Failed to give consent:', error);
                } finally {
                  setIsGivingConsent(false);
                }
              }}
              disabled={isGivingConsent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGivingConsent ? 'Processando...' : 'Entendi - Autorizar IA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}