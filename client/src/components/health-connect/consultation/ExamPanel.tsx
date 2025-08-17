import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Plus, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface ExamPanelProps {
  examCount?: number;
}

const ExamPanel = ({ examCount = 0 }: ExamPanelProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[hsl(var(--medical-blue))]" />
            Exames Solicitados
          </div>
          {examCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {examCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {examCount === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FlaskConical className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-3">Nenhum exame solicitado</p>
            <Link to="/exames">
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Solicitar Exames
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              {examCount} exame{examCount > 1 ? 's' : ''} solicitado{examCount > 1 ? 's' : ''} para este paciente.
            </div>
            <div className="flex gap-2">
              <Link to="/exames" className="flex-1">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Ver Detalhes
                </Button>
              </Link>
              <Link to="/exames">
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamPanel;