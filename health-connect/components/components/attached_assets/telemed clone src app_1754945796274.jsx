import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [patient] = useState({
    name: "Claudio Felipe Montanha Correa",
    age: 36,
    phone: "(11) 99945-1628"
  });

  const [elapsed, setElapsed] = useState(0);
  const [consultationStatus, setConsultationStatus] = useState("waiting");

  const [formData, setFormData] = useState({
    chiefComplaint: "",
    currentIllness: "", 
    diagnosis: "",
    indications: ""
  });

  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Validação em tempo real
  useEffect(() => {
    const errors = [];
    if (!formData.chiefComplaint.trim()) errors.push("Queixa principal");
    if (!formData.currentIllness.trim()) errors.push("História da doença");
    if (!formData.diagnosis.trim()) errors.push("Diagnóstico");
    if (!formData.indications.trim()) errors.push("Conduta");
    setValidationErrors(errors);
  }, [formData]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              CF
            </div>
            <div>
              <h2 className="font-semibold">{patient.name}, {patient.age} anos</h2>
              <p className="text-sm text-gray-600">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm flex items-center">
              <span className={`status-dot status-${consultationStatus}`}></span>
              Status: {consultationStatus}
            </span>
            <span className="text-sm">Tempo: {formatTime(elapsed)}</span>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setConsultationStatus("active")}
            >
              Iniciar
            </button>
          </div>
        </div>
      </div>

      {/* Área Principal */}
      <div className="flex h-screen">
        {/* Vídeo */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl">Aguardando Paciente</h3>
            <p>Sala: #ABC123</p>
          </div>
        </div>

        {/* Painel Lateral */}
        <div className="w-96 bg-white border-l p-4 overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Registro do Atendimento</h3>
          
          {/* Validação Visual */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
              <p className="text-sm text-red-700 font-medium">Campos obrigatórios:</p>
              <ul className="text-sm text-red-600 mt-1">
                {validationErrors.map(error => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Campos Obrigatórios */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Queixa Principal *
              </label>
              <textarea 
                value={formData.chiefComplaint}
                onChange={(e) => updateForm('chiefComplaint', e.target.value)}
                className="w-full p-2 border rounded resize-none h-20"
                placeholder="Descreva o motivo da consulta..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                História da Doença Atual *
              </label>
              <textarea 
                value={formData.currentIllness}
                onChange={(e) => updateForm('currentIllness', e.target.value)}
                className="w-full p-2 border rounded resize-none h-20"
                placeholder="Evolução dos sintomas..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Hipótese Diagnóstica *
              </label>
              <input 
                type="text"
                value={formData.diagnosis}
                onChange={(e) => updateForm('diagnosis', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ex: F41.1 - Ansiedade generalizada"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Conduta/Indicações *
              </label>
              <textarea 
                value={formData.indications}
                onChange={(e) => updateForm('indications', e.target.value)}
                className="w-full p-2 border rounded resize-none h-20"
                placeholder="Prescrições, orientações médicas..."
              />
            </div>

            {/* Botão de Salvar */}
            <button 
              className={`w-full py-2 px-4 rounded font-medium ${
                validationErrors.length === 0 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={validationErrors.length > 0}
              onClick={() => {
                if (validationErrors.length === 0) {
                  alert('Atendimento registrado com sucesso!');
                  setConsultationStatus("ended");
                }
              }}
            >
              {validationErrors.length === 0 ? 'Finalizar Atendimento' : `Faltam ${validationErrors.length} campos`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;