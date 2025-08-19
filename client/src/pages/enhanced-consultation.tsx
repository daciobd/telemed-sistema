import React, { useEffect, useMemo, useRef } from "react";
import "./enhanced-fix.css";

export default function EnhancedConsultation() {
  // 🔧 garante que o grid tenha exatamente 2 filhos: .enhanced-left e .enhanced-right
  useEffect(() => {
    const columns = document.querySelector(".enhanced-columns");
    if (!columns) return;

    const left = columns.querySelector(".enhanced-left");
    let right = columns.querySelector(".enhanced-right") as HTMLElement | null;

    if (!right) {
      right = document.createElement("section");
      right.className = "enhanced-right";
      columns.appendChild(right);
    }

    // move todos os irmãos diretos que não sejam a coluna esquerda/direita para dentro da direita
    Array.from(columns.children).forEach((el) => {
      if (el !== left && el !== right) {
        right!.appendChild(el);
      }
    });
  }, []);

  return (
    <div className="enhanced-shell">
      <div className="enhanced-wrap">
        <div className="enhanced-columns">
          {/* Coluna Esquerda - Vídeo */}
          <div className="enhanced-left">
            <div className="enhanced-video-shell">
              <div className="wait">
                <div>🎥 Aguardando conexão de vídeo...</div>
              </div>
              {/* Controles de vídeo serão inseridos aqui via JavaScript */}
              <div className="enhanced-controls">
                <button title="Anexar arquivo">📎</button>
                <button title="Capturar tela">📸</button>
                <button title="Chat">💬</button>
                <button title="Notificações">🔔</button>
                <button title="Microfone">🎙️</button>
                <button title="Câmera">📹</button>
                <button title="Pausar">⏸️</button>
                <button title="Encerrar">🔚</button>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Formulários e dados */}
          <div className="enhanced-right">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Consulta Avançada com IA</h1>
              
              {/* Informações do Paciente */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Paciente em Atendimento</h3>
                <p className="text-blue-800">Nome: Bruno Peixoto Alberto da Silva</p>
                <p className="text-blue-800">Idade: 34 anos</p>
                <p className="text-blue-800">Motivo: Consulta de rotina</p>
              </div>

              {/* Tabs de navegação */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button className="border-blue-500 text-blue-600 border-b-2 py-2 px-1 text-sm font-medium">
                    Chat
                  </button>
                  <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium">
                    Atendimento
                  </button>
                  <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium">
                    Exames
                  </button>
                  <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 py-2 px-1 text-sm font-medium">
                    Receitas
                  </button>
                </nav>
              </div>

              {/* Área de conteúdo principal */}
              <div className="space-y-6">
                {/* Chat área */}
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Dr. Silva - 14:30</p>
                      <p>Olá! Como está se sentindo hoje?</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg shadow-sm ml-auto max-w-xs">
                      <p className="text-sm text-gray-600 mb-1">Paciente - 14:31</p>
                      <p>Estou bem, doutor. Vim para a consulta de rotina.</p>
                    </div>
                  </div>
                </div>

                {/* Input de chat */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Enviar
                  </button>
                </div>

                {/* Dr. AI Panel */}
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900 mb-2 flex items-center">
                    🤖 Dr. AI - Assistente Clínico
                  </h4>
                  <p className="text-emerald-800 text-sm mb-3">
                    Pronto para auxiliar no diagnóstico e sugestões de tratamento.
                  </p>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700">
                    Consultar IA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}