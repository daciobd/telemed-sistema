import React from "react";

export default function HealthHub() {
  return (
    <main style={{maxWidth:960,margin:"24px auto",padding:"0 16px"}}>
      <h1>Health Connect</h1>
      <p>Gestão de pacientes, consultas especializadas e exames (demo).</p>
      <ul>
        <li><a href="/dashboard-teste-robust">Doctor Dashboard</a></li>
        <li><a href="/enhanced-consultation?consultationId=demo">Enhanced Consultation (demo)</a></li>
      </ul>
    </main>
  );
}