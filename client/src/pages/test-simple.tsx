export default function TestSimple() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", marginBottom: "1rem" }}>
        ✅ TESTE FUNCIONANDO
      </h1>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Esta é uma página de teste ultra-simples sem dependências complexas.
      </p>
      <div style={{ 
        backgroundColor: "#f0f9ff", 
        padding: "1rem", 
        borderRadius: "8px",
        marginTop: "1rem" 
      }}>
        <h2 style={{ color: "#0369a1" }}>Dashboard do Paciente</h2>
        <p>Se você vê esta página, o roteamento está funcionando!</p>
        <ul style={{ marginTop: "1rem" }}>
          <li>✅ Rota carregada</li>
          <li>✅ Componente renderizado</li>
          <li>✅ Sistema funcionando</li>
        </ul>
      </div>
    </div>
  );
}