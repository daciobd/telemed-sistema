import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PatientJourneyVisualization from "@/components/PatientJourneyVisualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PatientJourneyPage() {
  const { patientId } = useParams();
  const { toast } = useToast();
  const [isDemoPopulating, setIsDemoPopulating] = useState(false);

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ["/api/patients", patientId],
    enabled: !!patientId,
  });

  const handlePopulateDemo = async () => {
    if (!patientId) return;
    
    setIsDemoPopulating(true);
    try {
      const result = await apiRequest(`/api/patient-journey/populate-demo/${patientId}`, {
        method: "POST",
      });
      
      toast({
        title: "Demo Data Created",
        description: `Created ${result.created.events} events, ${result.created.metrics} metrics, and ${result.created.milestones} milestones`,
      });
      
      // Refresh the data by invalidating queries
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to populate demo data",
        variant: "destructive",
      });
    } finally {
      setIsDemoPopulating(false);
    }
  };

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading patient information...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Not Found</h3>
            <p className="text-gray-600 mb-4">
              The patient you're looking for doesn't exist or you don't have permission to view their data.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {patient.user.firstName} {patient.user.lastName}
              </CardTitle>
              <CardDescription>
                Patient ID: {patient.id} • Email: {patient.user.email}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePopulateDemo}
                disabled={isDemoPopulating}
                className="flex items-center gap-2"
              >
                {isDemoPopulating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                {isDemoPopulating ? "Creating..." : "Populate Demo Data"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Patient Journey Visualization */}
      <PatientJourneyVisualization
        patientId={parseInt(patientId || "0")}
        patientName={`${patient.user.firstName} ${patient.user.lastName}`}
        isDoctor={true}
      />
    </div>
  );
}