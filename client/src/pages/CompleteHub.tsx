import React from "react";

export default function CompleteHub() {
  return (
    <main style={{maxWidth:960,margin:"24px auto",padding:"0 16px"}}>
      <h1>Sistema Integrado</h1>
      <p>Integra TeleMed + HealthConnect (atalhos):</p>
      <ul>
        <li><a href="/">Home principal</a></li>
        <li><a href="/telemed">TeleMed IA</a></li>
        <li><a href="/health">Health Connect</a></li>
        <li><a href="/video-consultation?consultationId=demo">VideoConsultation</a></li>
        <li><a href="/dashboard-teste-robust">Doctor Dashboard</a></li>
      </ul>
    </main>
  );
}