import React from 'react';

// Simple dashboard that replicates the working static version
export default function WorkingDashboard() {
  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      margin: 0,
      padding: "2rem",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "white",
        padding: "3rem",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        width: "100%"
      }}>
        <h1 style={{
          color: "#059669",
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          ✅ Dashboard React Router Funcionando!
        </h1>
        
        <p style={{
          color: "#6b7280",
          fontSize: "1.2rem",
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          Sistema de Telemedicina com React Router operacional
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          margin: "2rem 0"
        }}>
          <div style={{
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            border: "2px solid #3b82f6",
            transition: "transform 0.3s ease"
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: "#1e40af"
            }}>
              📅 Consultas
            </h3>
            <p style={{ color: "#1d4ed8" }}>
              Agende suas consultas online com médicos especialistas
            </p>
          </div>

          <div style={{
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
            border: "2px solid #10b981"
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: "#166534"
            }}>
              📋 Prontuário
            </h3>
            <p style={{ color: "#15803d" }}>
              Acesse seu histórico médico completo
            </p>
          </div>

          <div style={{
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            border: "2px solid #f59e0b"
          }}>
            <h3 style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: "#92400e"
            }}>
              💊 Receitas
            </h3>
            <p style={{ color: "#a16207" }}>
              Visualize suas prescrições médicas
            </p>
          </div>
        </div>

        <div style={{
          background: "#f1f5f9",
          padding: "2rem",
          borderRadius: "12px",
          marginTop: "3rem"
        }}>
          <h3 style={{ 
            color: "#374151", 
            marginBottom: "1rem" 
          }}>
            ✅ Sistema Operacional
          </h3>
          <ul style={{ 
            listStyle: "none", 
            padding: 0,
            margin: 0
          }}>
            <li style={{ color: "#059669", margin: "0.5rem 0", fontWeight: "500" }}>
              ✅ Express Server: Funcionando
            </li>
            <li style={{ color: "#059669", margin: "0.5rem 0", fontWeight: "500" }}>
              ✅ Arquivos Estáticos: OK
            </li>
            <li style={{ color: "#059669", margin: "0.5rem 0", fontWeight: "500" }}>
              ✅ React Router: Operacional
            </li>
            <li style={{ color: "#059669", margin: "0.5rem 0", fontWeight: "500" }}>
              ✅ Feature #1 (Autenticação): Base implementada
            </li>
            <li style={{ color: "#2563eb", margin: "0.5rem 0", fontWeight: "500" }}>
              🚀 Próximo: Feature #2 (Videoconsultas)
            </li>
          </ul>
        </div>

        <div style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "#6b7280",
          fontSize: "0.9rem"
        }}>
          <p><strong>URL:</strong> /patient-dashboard</p>
          <p><strong>Status:</strong> Sistema React Router funcionando</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}