export default function PatientDashboardSimple() {
  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "Arial, sans-serif",
      minHeight: "100vh",
      backgroundColor: "#f8fafc"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <h1 style={{ 
          color: "#1e293b", 
          marginBottom: "1rem",
          fontSize: "2.5rem",
          fontWeight: "bold"
        }}>
          ✅ Dashboard do Paciente TeleMed
        </h1>
        
        <p style={{ 
          color: "#64748b", 
          fontSize: "1.2rem",
          marginBottom: "2rem"
        }}>
          Sistema de Telemedicina funcionando com React Router!
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "2rem"
        }}>
          <div style={{
            backgroundColor: "#dbeafe",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #93c5fd"
          }}>
            <h3 style={{ color: "#1d4ed8", marginBottom: "0.5rem" }}>📅 Consultas</h3>
            <p style={{ color: "#1e40af" }}>Agende suas consultas online</p>
          </div>

          <div style={{
            backgroundColor: "#dcfce7",
            padding: "1.5rem",
            borderRadius: "8px", 
            border: "1px solid #86efac"
          }}>
            <h3 style={{ color: "#166534", marginBottom: "0.5rem" }}>📋 Prontuário</h3>
            <p style={{ color: "#15803d" }}>Acesse seu histórico médico</p>
          </div>

          <div style={{
            backgroundColor: "#fef3c7",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #fcd34d"
          }}>
            <h3 style={{ color: "#92400e", marginBottom: "0.5rem" }}>💊 Receitas</h3>
            <p style={{ color: "#a16207" }}>Visualize suas prescrições</p>
          </div>
        </div>

        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px"
        }}>
          <h4 style={{ color: "#334155" }}>Status do Sistema:</h4>
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            <li style={{ color: "#059669" }}>✅ React Router funcionando</li>
            <li style={{ color: "#059669" }}>✅ SPA fallback configurado</li>
            <li style={{ color: "#059669" }}>✅ Dashboard carregado com sucesso</li>
            <li style={{ color: "#059669" }}>✅ Sistema de autenticação pronto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}