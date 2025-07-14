import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Activity, Target, TrendingUp, Clock, Users, FileText, Heart, Brain, Stethoscope } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, Cell, PieChart, Pie } from "recharts";
import { format, subDays, isWithinInterval } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface PatientJourneyEvent {
  id: number;
  eventType: string;
  eventDate: string;
  description?: string;
  severity: "low" | "medium" | "high" | "critical";
  category: "administrative" | "clinical" | "diagnostic" | "therapeutic" | "preventive" | "emergency";
  outcome: "positive" | "negative" | "neutral" | "pending";
  metadata?: any;
  tags?: string[];
}

interface PatientHealthMetric {
  id: number;
  metricType: string;
  value: number;
  unit: string;
  normalRangeMin?: number;
  normalRangeMax?: number;
  isNormal: boolean;
  recordedAt: string;
  recordedBy: "patient" | "doctor" | "nurse" | "device";
  notes?: string;
}

interface PatientJourneyMilestone {
  id: number;
  title: string;
  description?: string;
  targetDate?: string;
  completedDate?: string;
  milestoneType: "treatment_goal" | "recovery_target" | "preventive_care" | "lifestyle_change" | "diagnostic_milestone" | "therapeutic_milestone";
  status: "planned" | "in_progress" | "completed" | "overdue" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
}

interface PatientJourneyVisualizationProps {
  patientId: number;
  patientName?: string;
  isDoctor?: boolean;
  // Allow demo data to be passed in for testing
  eventsQuery?: any;
  metricsQuery?: any;
  milestonesQuery?: any;
}

const eventTypeColors = {
  registration: "#8B5CF6",
  appointment_scheduled: "#3B82F6",
  appointment_completed: "#10B981",
  prescription_issued: "#F59E0B",
  lab_test_ordered: "#EF4444",
  lab_result_received: "#06B6D4",
  symptom_reported: "#F97316",
  follow_up_scheduled: "#8B5CF6",
  treatment_started: "#10B981",
  treatment_completed: "#059669",
  emergency_visit: "#DC2626",
  specialist_referral: "#7C3AED",
  medication_changed: "#F59E0B",
  vital_signs_recorded: "#06B6D4"
};

const severityColors = {
  low: "#10B981",
  medium: "#F59E0B", 
  high: "#EF4444",
  critical: "#DC2626"
};

const categoryIcons = {
  administrative: Users,
  clinical: Stethoscope,
  diagnostic: FileText,
  therapeutic: Heart,
  preventive: Activity,
  emergency: Brain
};

export default function PatientJourneyVisualization({ 
  patientId, 
  patientName, 
  isDoctor = false, 
  eventsQuery, 
  metricsQuery, 
  milestonesQuery 
}: PatientJourneyVisualizationProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30");
  const [selectedMetricType, setSelectedMetricType] = useState("all");
  const [activeTab, setActiveTab] = useState("timeline");
  const queryClient = useQueryClient();

  // Use provided demo queries or default API queries
  const eventsApiQuery = useQuery({
    queryKey: ["/api/patient-journey/events", patientId],
    enabled: !!patientId && !eventsQuery,
  });

  const metricsApiQuery = useQuery({
    queryKey: ["/api/patient-journey/metrics", patientId, selectedMetricType],
    enabled: !!patientId && !metricsQuery,
  });

  const milestonesApiQuery = useQuery({
    queryKey: ["/api/patient-journey/milestones", patientId],
    enabled: !!patientId && !milestonesQuery,
  });

  // Use demo data if provided, otherwise use API data
  const { data: journeyEvents = [], isLoading: eventsLoading } = eventsQuery || eventsApiQuery;
  const { data: healthMetrics = [], isLoading: metricsLoading } = metricsQuery || metricsApiQuery;
  const { data: milestones = [], isLoading: milestonesLoading } = milestonesQuery || milestonesApiQuery;

  // Filter data based on selected time range
  const filterByTimeRange = (data: any[], dateField: string) => {
    if (selectedTimeRange === "all") return data;
    
    const days = parseInt(selectedTimeRange);
    const startDate = subDays(new Date(), days);
    const endDate = new Date();
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, { start: startDate, end: endDate });
    });
  };

  const filteredEvents = filterByTimeRange(journeyEvents, "eventDate");
  const filteredMetrics = filterByTimeRange(healthMetrics, "recordedAt");

  // Prepare chart data
  const timelineData = filteredEvents.map(event => ({
    date: format(new Date(event.eventDate), "MMM dd"),
    events: 1,
    severity: event.severity,
    category: event.category,
    eventType: event.eventType
  }));

  const metricsChartData = filteredMetrics.reduce((acc, metric) => {
    const date = format(new Date(metric.recordedAt), "MMM dd");
    const existing = acc.find(item => item.date === date && item.type === metric.metricType);
    
    if (existing) {
      existing.values.push(metric.value);
      existing.value = existing.values[existing.values.length - 1]; // Latest value
    } else {
      acc.push({
        date,
        type: metric.metricType,
        value: metric.value,
        values: [metric.value],
        unit: metric.unit,
        isNormal: metric.isNormal
      });
    }
    
    return acc;
  }, [] as any[]);

  const milestoneProgress = milestones.filter(m => m.status !== "cancelled").map(milestone => ({
    title: milestone.title.substring(0, 20) + (milestone.title.length > 20 ? "..." : ""),
    progress: milestone.progress,
    status: milestone.status,
    priority: milestone.priority,
    type: milestone.milestoneType
  }));

  // Event categorization stats
  const eventStats = filteredEvents.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventStatsData = Object.entries(eventStats).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count,
    color: eventTypeColors[category as keyof typeof eventTypeColors] || "#8B5CF6"
  }));

  // Recent activity summary
  const recentActivity = filteredEvents.slice(0, 5).map(event => ({
    ...event,
    timeAgo: format(new Date(event.eventDate), "MMM dd, HH:mm")
  }));

  if (eventsLoading || metricsLoading || milestonesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Patient Journey Visualization
          </h2>
          {patientName && (
            <p className="text-gray-600 dark:text-gray-400">
              {patientName} • {filteredEvents.length} events in last {selectedTimeRange} days
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
          
          <select
            value={selectedMetricType}
            onChange={(e) => setSelectedMetricType(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
          >
            <option value="all">All Metrics</option>
            <option value="blood_pressure">Blood Pressure</option>
            <option value="heart_rate">Heart Rate</option>
            <option value="weight">Weight</option>
            <option value="pain_level">Pain Level</option>
            <option value="mood_score">Mood Score</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{filteredEvents.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Milestones</p>
                <p className="text-2xl font-bold text-green-600">
                  {milestones.filter(m => m.status === "in_progress").length}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Goals</p>
                <p className="text-2xl font-bold text-purple-600">
                  {milestones.filter(m => m.status === "completed").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Metrics</p>
                <p className="text-2xl font-bold text-orange-600">{filteredMetrics.length}</p>
              </div>
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {recentActivity.map((event, index) => {
                    const IconComponent = categoryIcons[event.category as keyof typeof categoryIcons] || Activity;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div 
                          className="p-2 rounded-full"
                          style={{ backgroundColor: eventTypeColors[event.eventType as keyof typeof eventTypeColors] + "20" }}
                        >
                          <IconComponent 
                            className="w-4 h-4" 
                            style={{ color: eventTypeColors[event.eventType as keyof typeof eventTypeColors] }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {event.eventType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: severityColors[event.severity],
                                color: severityColors[event.severity]
                              }}
                            >
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.description || "No additional details"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{event.timeAgo}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                Patient journey events over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="events" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {/* Health Metrics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>
                  Key health metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metricsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metric Distribution</CardTitle>
                <CardDescription>
                  Normal vs abnormal readings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: "Normal", 
                          value: filteredMetrics.filter(m => m.isNormal).length,
                          color: "#10B981"
                        },
                        { 
                          name: "Abnormal", 
                          value: filteredMetrics.filter(m => !m.isNormal).length,
                          color: "#EF4444"
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {[
                        { name: "Normal", value: filteredMetrics.filter(m => m.isNormal).length, color: "#10B981" },
                        { name: "Abnormal", value: filteredMetrics.filter(m => !m.isNormal).length, color: "#EF4444" }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          {/* Milestones Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestoneProgress.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {milestone.title}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {milestone.type.replace(/_/g, " ")}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className="text-xs"
                              style={{
                                borderColor: milestone.status === "completed" ? "#10B981" : 
                                           milestone.status === "overdue" ? "#EF4444" : "#F59E0B",
                                color: milestone.status === "completed" ? "#10B981" : 
                                       milestone.status === "overdue" ? "#EF4444" : "#F59E0B"
                              }}
                            >
                              {milestone.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                          {milestone.progress}%
                        </span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Event Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Event Categories</CardTitle>
              <CardDescription>
                Distribution of events by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventStatsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {eventStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}