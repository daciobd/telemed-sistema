import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MedicalEvaluationsView() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: evaluations, isLoading: evaluationsLoading } = useQuery({
    queryKey: ["/api/medical-evaluations/doctor", user?.role === 'doctor' ? user?.doctor?.id : null],
    queryFn: async () => {
      if (user?.role !== 'doctor' || !user?.doctor?.id) return [];
      const response = await fetch(`/api/medical-evaluations/doctor/${user.doctor.id}`);
      if (!response.ok) throw new Error('Failed to fetch evaluations');
      return response.json();
    },
    enabled: isAuthenticated && user?.role === 'doctor' && !!user?.doctor?.id,
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'doctor') {
    return (
      <div className="min-h-screen flex bg-neutral-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Acesso Negado
                </h3>
                <p className="text-gray-500">
                  Apenas médicos podem visualizar avaliações.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
    </div>
  );

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excelente";
    if (rating >= 3.5) return "Muito Bom";
    if (rating >= 2.5) return "Bom";
    if (rating >= 1.5) return "Regular";
    return "Ruim";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800";
    if (rating >= 3.5) return "bg-blue-100 text-blue-800";
    if (rating >= 2.5) return "bg-yellow-100 text-yellow-800";
    if (rating >= 1.5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  // Calculate average ratings
  const averageRatings = evaluations && evaluations.length > 0 ? {
    satisfaction: evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.satisfactionRating, 0) / evaluations.length,
    knowledge: evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.knowledgeRating, 0) / evaluations.length,
    attentiveness: evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.attentivenessRating, 0) / evaluations.length,
    overall: evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.overallRating, 0) / evaluations.length,
  } : null;

  const recommendationRate = evaluations && evaluations.length > 0 
    ? (evaluations.filter((evaluation: any) => evaluation.wouldRecommend).length / evaluations.length) * 100
    : 0;

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Avaliações dos Pacientes
              </h1>
              <p className="text-gray-600">
                Feedback dos pacientes sobre seus atendimentos
              </p>
            </div>

            {evaluationsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando avaliações...</p>
              </div>
            ) : !evaluations || evaluations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma avaliação encontrada
                  </h3>
                  <p className="text-gray-500">
                    Suas avaliações aparecerão aqui quando os pacientes enviarem feedback.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Summary Cards */}
                {averageRatings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-600 mb-2">Avaliação Geral</h3>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {averageRatings.overall.toFixed(1)}
                          </div>
                          <StarRating rating={Math.round(averageRatings.overall)} />
                          <Badge className={`mt-2 ${getRatingColor(averageRatings.overall)}`}>
                            {getRatingText(averageRatings.overall)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-600 mb-2">Satisfação</h3>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {averageRatings.satisfaction.toFixed(1)}
                          </div>
                          <StarRating rating={Math.round(averageRatings.satisfaction)} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-600 mb-2">Conhecimento</h3>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {averageRatings.knowledge.toFixed(1)}
                          </div>
                          <StarRating rating={Math.round(averageRatings.knowledge)} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-600 mb-2">Recomendação</h3>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {recommendationRate.toFixed(0)}%
                          </div>
                          <div className="flex items-center justify-center space-x-1">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">dos pacientes</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Individual Evaluations */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Avaliações Individuais ({evaluations.length})
                  </h2>
                  
                  {evaluations.map((evaluation: any) => (
                    <Card key={evaluation.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Paciente #{evaluation.patientId}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(evaluation.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getRatingColor(evaluation.overallRating)}>
                            {getRatingText(evaluation.overallRating)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-1">Satisfação</h5>
                            <StarRating rating={evaluation.satisfactionRating} />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-1">Conhecimento</h5>
                            <StarRating rating={evaluation.knowledgeRating} />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-1">Atenção</h5>
                            <StarRating rating={evaluation.attentivenessRating} />
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            {evaluation.wouldRecommend ? (
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <ThumbsDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-600">
                              {evaluation.wouldRecommend ? 'Recomendaria' : 'Não recomendaria'}
                            </span>
                          </div>
                        </div>

                        {evaluation.testimonial && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Depoimento</span>
                            </div>
                            <p className="text-gray-700 italic">"{evaluation.testimonial}"</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}