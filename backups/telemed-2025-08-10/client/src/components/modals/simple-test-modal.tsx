import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SimpleTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleTestModal({ isOpen, onClose }: SimpleTestModalProps) {
  console.log("SimpleTestModal render - isOpen:", isOpen);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Modal de Teste</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Este é um modal de teste para verificar a funcionalidade.</p>
          <Button onClick={onClose} className="mt-4">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}