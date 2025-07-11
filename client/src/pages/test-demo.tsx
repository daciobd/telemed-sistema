import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Database, Users, FileText } from "lucide-react";

export default function TestDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const testAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing demo API...');
      const response = await fetch('/api/test-demo-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      setResult(data);
      toast({
        title: "✅ Demo Data Created! (Safe Route)",
        description: "Successfully tested safe demo endpoint - working in production.",
      });
    } catch (err: any) {
      console.error('API test failed:', err);
      setError(err.message);
      toast({
        title: "❌ API Test Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testMedicalRecords = async () => {
    try {
      console.log('Testing medical records API...');
      const response = await fetch('/api/medical-records');
      console.log('Medical records response:', response.status);
      
      if (response.ok) {
        const records = await response.json();
        console.log('Medical records:', records);
        toast({
          title: "✅ Medical Records API Working",
          description: `Found ${records.length} medical records`,
        });
      } else {
        throw new Error(`Medical records API failed: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Medical records test failed:', err);
      toast({
        title: "❌ Medical Records API Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Demo API Test Page
          </h1>
          <p className="text-gray-600 text-lg">
            Test and debug the demo data creation API
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* API Test Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Create Demo Data (Safe Route)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                This will test the safe demo endpoint that bypasses production issues.
              </p>
              
              <Button
                onClick={testAPI}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Testing Safe Demo API...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Test Demo API (Safe Route)
                  </>
                )}
              </Button>

              <Button
                onClick={testMedicalRecords}
                variant="outline"
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Test Medical Records API
              </Button>

              <Button
                onClick={() => window.open('/api/test-demo-safe', '_blank')}
                variant="secondary"
                className="w-full"
              >
                🔗 Test Safe Endpoint Directly
              </Button>

              <div className="pt-4">
                <Button
                  onClick={() => window.location.href = '/medical-records'}
                  variant="secondary"
                  className="w-full"
                >
                  📋 Go to Medical Records Page
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {error ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : result ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Testing API...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Error</h3>
                  <p className="text-red-700 text-sm font-mono">{error}</p>
                </div>
              )}

              {result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Success!</h3>
                  <div className="text-sm space-y-2">
                    {result.doctor && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>Doctor: {result.doctor.specialty} (ID: {result.doctor.id})</span>
                      </div>
                    )}
                    {result.patient && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span>Patient: ID {result.patient.id}</span>
                      </div>
                    )}
                    {result.record && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span>Medical Record: {result.record.title}</span>
                      </div>
                    )}
                  </div>
                  
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-green-700">
                      View Raw Data
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {!isLoading && !error && !result && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Test Demo API" to start testing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📝 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ol className="space-y-2">
                <li>Click <strong>"Test Demo API"</strong> to create demo data</li>
                <li>Check the results panel for success/error messages</li>
                <li>Click <strong>"Go to Medical Records Page"</strong> to see the created data</li>
                <li>Test the "Ver Detalhes" buttons on medical records</li>
              </ol>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Debug Info</h4>
                <p className="text-sm text-blue-700">
                  Check the browser console (F12) for detailed API logs and responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}