import { useState } from "react";
import PatientJourneyVisualization from "@/components/PatientJourneyVisualization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, TrendingUp, Database, CheckCircle } from "lucide-react";

// Mock data for demonstration
const mockPatientJourneyData = {
  events: [
    {
      id: 1,
      patientId: 1,
      eventType: "registration",
      eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      description: "Patient registered on the platform",
      severity: "low" as const,
      category: "administrative" as const,
      outcome: "positive" as const,
      metadata: { source: "demo" },
      tags: ["onboarding", "initial"]
    },
    {
      id: 2,
      patientId: 1,
      eventType: "appointment_scheduled",
      eventDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      description: "First consultation scheduled",
      severity: "low" as const,
      category: "administrative" as const,
      outcome: "positive" as const,
      metadata: { doctorSpecialty: "Clínica Geral" },
      tags: ["consultation", "first_visit"]
    },
    {
      id: 3,
      patientId: 1,
      eventType: "appointment_completed",
      eventDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      description: "Initial consultation completed successfully",
      severity: "low" as const,
      category: "clinical" as const,
      outcome: "positive" as const,
      metadata: { duration: 45, satisfaction: 5 },
      tags: ["consultation", "completed"]
    },
    {
      id: 4,
      patientId: 1,
      eventType: "prescription_issued",
      eventDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      description: "Medication prescribed for hypertension",
      severity: "medium" as const,
      category: "therapeutic" as const,
      outcome: "positive" as const,
      metadata: { medications: ["Losartana 50mg", "Hidroclorotiazida 25mg"] },
      tags: ["medication", "hypertension"]
    },
    {
      id: 5,
      patientId: 1,
      eventType: "lab_test_ordered",
      eventDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      description: "Blood tests ordered for cholesterol and glucose",
      severity: "medium" as const,
      category: "diagnostic" as const,
      outcome: "pending" as const,
      metadata: { tests: ["Colesterol Total", "Glicemia de Jejum", "Hemograma"] },
      tags: ["lab_test", "routine"]
    },
    {
      id: 6,
      patientId: 1,
      eventType: "symptom_reported",
      eventDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      description: "Patient reported mild headaches",
      severity: "medium" as const,
      category: "clinical" as const,
      outcome: "neutral" as const,
      metadata: { intensity: 4, frequency: "ocasional" },
      tags: ["symptoms", "headache"]
    },
    {
      id: 7,
      patientId: 1,
      eventType: "follow_up_scheduled",
      eventDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      description: "Follow-up appointment scheduled",
      severity: "low" as const,
      category: "administrative" as const,
      outcome: "positive" as const,
      metadata: { purpose: "medication_review" },
      tags: ["follow_up", "medication"]
    }
  ],
  metrics: [
    {
      id: 1,
      patientId: 1,
      metricType: "blood_pressure",
      value: 140,
      unit: "mmHg (systolic)",
      normalRangeMin: 90,
      normalRangeMax: 120,
      isNormal: false,
      recordedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      recordedBy: "doctor" as const,
      notes: "Slightly elevated, monitoring needed"
    },
    {
      id: 2,
      patientId: 1,
      metricType: "blood_pressure",
      value: 90,
      unit: "mmHg (diastolic)",
      normalRangeMin: 60,
      normalRangeMax: 80,
      isNormal: false,
      recordedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      recordedBy: "doctor" as const,
      notes: "Elevated diastolic pressure"
    },
    {
      id: 3,
      patientId: 1,
      metricType: "heart_rate",
      value: 72,
      unit: "bpm",
      normalRangeMin: 60,
      normalRangeMax: 100,
      isNormal: true,
      recordedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      recordedBy: "doctor" as const,
      notes: "Normal resting heart rate"
    },
    {
      id: 4,
      patientId: 1,
      metricType: "weight",
      value: 75.5,
      unit: "kg",
      normalRangeMin: 65,
      normalRangeMax: 80,
      isNormal: true,
      recordedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      recordedBy: "patient" as const,
      notes: "Weight stable"
    },
    {
      id: 5,
      patientId: 1,
      metricType: "pain_level",
      value: 3,
      unit: "scale 0-10",
      normalRangeMin: 0,
      normalRangeMax: 2,
      isNormal: false,
      recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      recordedBy: "patient" as const,
      notes: "Mild headache episodes"
    }
  ],
  milestones: [
    {
      id: 1,
      patientId: 1,
      title: "Blood Pressure Control",
      description: "Achieve target blood pressure below 130/80 mmHg",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      milestoneType: "treatment_goal" as const,
      status: "in_progress" as const,
      priority: "high" as const,
      progress: 40,
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: 2,
      patientId: 1,
      title: "Medication Adherence",
      description: "Take prescribed medications consistently for 90 days",
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      milestoneType: "treatment_goal" as const,
      status: "in_progress" as const,
      priority: "high" as const,
      progress: 75,
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: 3,
      patientId: 1,
      title: "Regular Exercise Routine",
      description: "Establish 30 minutes of daily exercise",
      targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      milestoneType: "lifestyle_change" as const,
      status: "planned" as const,
      priority: "medium" as const,
      progress: 20,
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    {
      id: 4,
      patientId: 1,
      title: "Follow-up Lab Tests",
      description: "Complete cholesterol and glucose follow-up tests",
      targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      milestoneType: "diagnostic_milestone" as const,
      status: "planned" as const,
      priority: "medium" as const,
      progress: 0,
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ]
};

// Create a demo version of the PatientJourneyVisualization component
const PatientJourneyVisualizationDemo = () => {
  const [currentView, setCurrentView] = useState<"overview" | "timeline" | "metrics" | "milestones">("overview");
  
  // Mock query hooks for demo
  const mockEventsQuery = { data: mockPatientJourneyData.events, isLoading: false };
  const mockMetricsQuery = { data: mockPatientJourneyData.metrics, isLoading: false };
  const mockMilestonesQuery = { data: mockPatientJourneyData.milestones, isLoading: false };

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Patient Journey Visualization Demo
          </CardTitle>
          <CardDescription>
            Interactive demonstration of the patient journey tracking system with sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {mockPatientJourneyData.events.length} Events
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {mockPatientJourneyData.metrics.length} Metrics
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {mockPatientJourneyData.milestones.length} Milestones
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Use the actual PatientJourneyVisualization component */}
      <PatientJourneyVisualization
        patientId={1}
        patientName="João Silva"
        isDoctor={true}
        // Override the queries with demo data
        eventsQuery={mockEventsQuery}
        metricsQuery={mockMetricsQuery}
        milestonesQuery={mockMilestonesQuery}
      />
    </div>
  );
};

export default function PatientJourneyDemo() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                João Silva (Demo Patient)
              </CardTitle>
              <CardDescription>
                Patient ID: 1 • Email: joao.silva@example.com • Hypertension Treatment
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Demo Mode</Badge>
              <Badge variant="outline">Hypertension</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Demo Visualization */}
      <PatientJourneyVisualizationDemo />
    </div>
  );
}