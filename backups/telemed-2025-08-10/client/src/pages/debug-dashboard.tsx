import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';

export default function DebugDashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [location] = useLocation();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    setDebugInfo({
      location,
      isAuthenticated,
      user,
      isLoading,
      localStorage: {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user')
      },
      timestamp: new Date().toISOString()
    });
  }, [location, isAuthenticated, user, isLoading]);

  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "monospace",
      backgroundColor: "#f8fafc",
      minHeight: "100vh"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <h1 style={{ color: "#dc2626", marginBottom: "2rem" }}>
          🔍 DEBUG: Patient Dashboard
        </h1>
        
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "#059669", fontSize: "1.5rem" }}>
            ✅ React Router Funcionando!
          </h2>
          <p style={{ color: "#6b7280" }}>
            Esta página prova que o React Router está processando a rota `/patient-dashboard`
          </p>
        </div>

        <div style={{
          backgroundColor: "#f3f4f6",
          padding: "1.5rem",
          borderRadius: "6px",
          marginBottom: "2rem"
        }}>
          <h3 style={{ color: "#374151", marginBottom: "1rem" }}>Debug Info:</h3>
          <pre style={{ 
            fontSize: "12px", 
            lineHeight: "1.4",
            overflow: "auto",
            color: "#1f2937"
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem"
        }}>
          <div style={{
            backgroundColor: "#dbeafe",
            padding: "1rem",
            borderRadius: "6px"
          }}>
            <h4 style={{ color: "#1e40af" }}>Sistema Status</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>✅ Express Server</li>
              <li>✅ Vite HMR</li>
              <li>✅ React Router</li>
              <li>✅ SPA Fallback</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: "#dcfce7",
            padding: "1rem",
            borderRadius: "6px"
          }}>
            <h4 style={{ color: "#166534" }}>Próximos Passos</h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
              <li>• Implementar autenticação JWT</li>
              <li>• Conectar componentes reais</li>
              <li>• Testar videoconsultas</li>
              <li>• Sistema completo MVP</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#fef3c7",
          borderRadius: "6px",
          border: "2px solid #f59e0b"
        }}>
          <h4 style={{ color: "#92400e" }}>🎯 SUCESSO!</h4>
          <p style={{ color: "#a16207", margin: "0.5rem 0" }}>
            O React Router está funcionando corretamente. 
            Agora podemos prosseguir para a Feature #2 (videoconsultas) do MVP.
          </p>
        </div>
      </div>
    </div>
  );
}