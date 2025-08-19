import React, { useEffect, useMemo, useRef } from "react";
import "./enhanced-fix.css";

export default function EnhancedConsultation() {
  // 🔧 Garante 2 colunas de verdade: tudo até o vídeo fica à esquerda, o restante vai para a direita
  useEffect(() => {
    const wrap = document.querySelector(".enhanced-wrap") as HTMLElement | null;
    if (!wrap) return;
    // Evita duplicar se já estiver montado
    if (wrap.querySelector(".enhanced-columns")) return;

    // Pegamos os filhos DIRETOS do wrap
    const children = Array.from(wrap.children) as HTMLElement[];
    if (children.length === 0) return;

    // Localiza o contêiner do vídeo (id criado no patch anterior)
    const video = wrap.querySelector("#enhanced-video") as HTMLElement | null;

    // Cria a estrutura das 2 colunas
    const columns = document.createElement("div");
    columns.className = "enhanced-columns";
    const left = document.createElement("aside");
    left.className = "enhanced-left";
    const right = document.createElement("section");
    right.className = "enhanced-right";

    // Regra: tudo ATÉ o vídeo (inclusive) vai para a esquerda; o restante, direita.
    if (video) {
      let onRight = false;
      for (const el of children) {
        if (el === columns) continue;        // segurança
        if (!onRight) left.appendChild(el);
        else right.appendChild(el);
        if (el === video) onRight = true;    // a partir daqui, tudo à direita
      }
    } else {
      // Fallback: se por algum motivo não achou o vídeo, manda o 1º bloco para esquerda, resto direita
      if (children[0]) left.appendChild(children[0]);
      for (let i = 1; i < children.length; i++) right.appendChild(children[i]);
    }

    columns.appendChild(left);
    columns.appendChild(right);
    wrap.appendChild(columns);
  }, []);

  return (
    <div className="enhanced-shell">
      <div className="enhanced-wrap">
        {/* Container de vídeo (será movido para coluna esquerda) */}
        <div id="enhanced-video" className="enhanced-video-shell">
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

        {/* Conteúdo principal (será movido para coluna direita) */}
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
  );
}