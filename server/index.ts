import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes';
import { setupVite, serveStatic } from './vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 5000;
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from root and public directory
app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// Security headers
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  // Only apply security headers to non-Vite resources
  if (!req.url.startsWith('/@vite/') && !req.url.startsWith('/src/') && !req.url.includes('?v=')) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  
  next();
});

// HTML Landing Pages - HIGHEST PRIORITY
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../index.html');
  console.log('📄 Serving NEW simple landing page for:', req.path);
  res.sendFile(indexPath);
});

app.get('/dr-ai.html', (req, res) => {
  const drAiPath = path.join(__dirname, '../public/dr-ai.html');
  console.log('📄 Serving Dr. AI page for:', req.path);
  res.sendFile(drAiPath);
});

app.get('/consulta-por-valor.html', (req, res) => {
  const bidPath = path.join(__dirname, '../public/consulta-por-valor.html');
  console.log('📄 Serving bidding system for:', req.path);
  res.sendFile(bidPath);
});

app.get('/medical-dashboard-pro.html', (req, res) => {
  const dashboardPath = path.join(__dirname, '../public/medical-dashboard-pro.html');
  console.log('📄 Serving medical dashboard for:', req.path);
  res.sendFile(dashboardPath);
});

app.get('/agenda-do-dia.html', (req, res) => {
  const agendaPath = path.join(__dirname, '../public/agenda-do-dia.html');
  console.log('📄 Serving agenda do dia for:', req.path);
  res.sendFile(agendaPath);
});

// SISTEMA COMPLETO DE LANCES - HTML Estático com Todas as Especialidades
app.get('/patient-bidding', (req, res) => {
  console.log('📄 Serving sistema completo de lances for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema de Lances TeleMed</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background-color: #FAFBFC; 
                padding: 20px; 
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 20px; 
                padding: 30px; 
            }
            .header { 
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%); 
                color: white; 
                padding: 25px; 
                border-radius: 20px; 
                margin-bottom: 30px; 
                text-align: center;
            }
            .section-title {
                font-size: 24px;
                color: #2D5A87;
                margin: 30px 0 20px 0;
                border-bottom: 2px solid #A7C7E7;
                padding-bottom: 10px;
            }
            .new-lance-section {
                background: linear-gradient(135deg, #F4D9B41A, #A7C7E71A);
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 30px;
                border: 2px dashed #A7C7E7;
            }
            .especialidades-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .especialidade-card {
                background: #F8F9FA;
                border-radius: 15px;
                padding: 20px;
                border-left: 5px solid #A7C7E7;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .especialidade-card:hover {
                border-color: #A7C7E7;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(167, 199, 231, 0.3);
            }
            .lance-card {
                background: #F8F9FA;
                border-radius: 20px;
                padding: 25px;
                margin-bottom: 20px;
                border-left: 5px solid #A7C7E7;
                position: relative;
            }
            .urgente { border-left-color: #E9967A; }
            .regular { border-left-color: #A7C7E7; }
            .alta { border-left-color: #F4D9B4; }
            .disponivel { border-left-color: #90EE90; }
            
            .btn-primary {
                background: #A7C7E7;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 500;
                transition: opacity 0.3s;
                margin: 5px;
            }
            .btn-secondary {
                background: #F4D9B4;
                color: #8B4513;
                border: none;
                padding: 10px 20px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 500;
                margin: 5px;
            }
            .btn-new {
                background: linear-gradient(135deg, #A7C7E7, #92B4D7);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                width: 100%;
                margin-bottom: 20px;
            }
            .btn:hover { opacity: 0.8; }
            
            .valor { font-size: 22px; font-weight: bold; color: #2D5A87; }
            .tempo { color: #E9967A; font-weight: 500; }
            .medicos { color: #6B7280; }
            .status { font-weight: bold; margin-bottom: 10px; }
            
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #2D5A87;
            }
            .form-group select, .form-group input {
                width: 100%;
                padding: 12px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            .form-group select:focus, .form-group input:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .badge-urgente { background: #E9967A; color: white; }
            .badge-regular { background: #A7C7E7; color: white; }
            .badge-alta { background: #F4D9B4; color: #8B4513; }
            .badge-disponivel { background: #90EE90; color: #2D5A27; }
            
            @media (max-width: 768px) {
                .container { padding: 15px; }
                .especialidades-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏥 Sistema de Lances TeleMed</h1>
                <p>Faça seu lance e receba propostas dos melhores médicos</p>
            </div>
            
            <!-- SEÇÃO: CRIAR NOVO LANCE -->
            <div class="new-lance-section">
                <h2 style="color: #2D5A87; margin-bottom: 20px;">🎯 Criar Novo Lance</h2>
                <div class="form-group">
                    <label for="especialidade">Escolha a Especialidade:</label>
                    <select id="especialidade">
                        <option value="">Selecione uma especialidade...</option>
                        <option value="clinica-geral">🩺 Clínica Geral</option>
                        <option value="cardiologia">❤️ Cardiologia</option>
                        <option value="pediatria">👶 Pediatria</option>
                        <option value="dermatologia">🔬 Dermatologia</option>
                        <option value="psiquiatria">🧠 Psiquiatria</option>
                        <option value="ginecologia">👩‍⚕️ Ginecologia</option>
                        <option value="psicoterapia">💭 Psicoterapia</option>
                        <option value="nutricao">🥗 Nutrição</option>
                        <option value="ortopedia">🦴 Ortopedia</option>
                        <option value="oftalmologia">👁️ Oftalmologia</option>
                    </select>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label for="valor">Valor Máximo (R$):</label>
                        <input type="number" id="valor" placeholder="150" min="50" max="500">
                    </div>
                    <div class="form-group">
                        <label for="urgencia">Urgência:</label>
                        <select id="urgencia">
                            <option value="regular">Regular</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tempo">Tempo Limite:</label>
                        <select id="tempo">
                            <option value="60">1 hora</option>
                            <option value="120">2 horas</option>
                            <option value="360">6 horas</option>
                            <option value="720">12 horas</option>
                            <option value="1440">24 horas</option>
                        </select>
                    </div>
                </div>
                
                <button class="btn-new" onclick="criarLance()">
                    🚀 Publicar Meu Lance
                </button>
            </div>
            
            <!-- SEÇÃO: LANCES ATIVOS -->
            <h2 class="section-title">⚡ Lances Ativos - Recebendo Propostas</h2>
            
            <div class="lance-card urgente">
                <div class="status-badge badge-urgente">🚨 URGENTE</div>
                <h3>❤️ Cardiologia</h3>
                <div class="valor">Lance Atual: R$ 180</div>
                <p>Tempo Restante: <span class="tempo">12:26</span> | Médicos Interessados: <span class="medicos">5</span></p>
                <p>Paciente: Maria Silva</p>
                <div style="margin-top: 15px;">
                    <button class="btn-primary" onclick="aceitarProposta('cardiologia', 230)">
                        🩺 ACEITAR MELHOR PROPOSTA - R$ 230
                    </button>
                    <button class="btn-secondary" onclick="verPropostas('cardiologia')">
                        👁️ Ver Todas as Propostas (5)
                    </button>
                </div>
            </div>
            
            <div class="lance-card regular">
                <div class="status-badge badge-regular">⏰ REGULAR</div>
                <h3>👶 Pediatria</h3>
                <div class="valor">Lance Atual: R$ 150</div>
                <p>Tempo Restante: <span class="tempo">25:11</span> | Médicos Interessados: <span class="medicos">3</span></p>
                <p>Paciente: Ana Costa</p>
                <div style="margin-top: 15px;">
                    <button class="btn-primary" onclick="aceitarProposta('pediatria', 200)">
                        🩺 ACEITAR MELHOR PROPOSTA - R$ 200
                    </button>
                    <button class="btn-secondary" onclick="verPropostas('pediatria')">
                        👁️ Ver Todas as Propostas (3)
                    </button>
                </div>
            </div>
            
            <div class="lance-card alta">
                <div class="status-badge badge-alta">📈 PRIORIDADE ALTA</div>
                <h3>🔬 Dermatologia</h3>
                <div class="valor">Lance Atual: R$ 120</div>
                <p>Tempo Restante: <span class="tempo">34:43</span> | Médicos Interessados: <span class="medicos">2</span></p>
                <p>Paciente: João Santos</p>
                <div style="margin-top: 15px;">
                    <button class="btn-primary" onclick="aceitarProposta('dermatologia', 170)">
                        🩺 ACEITAR MELHOR PROPOSTA - R$ 170
                    </button>
                    <button class="btn-secondary" onclick="verPropostas('dermatologia')">
                        👁️ Ver Todas as Propostas (2)
                    </button>
                </div>
            </div>
            
            <!-- SEÇÃO: ESPECIALIDADES DISPONÍVEIS -->
            <h2 class="section-title">🏥 Especialidades Disponíveis - Faça seu Lance</h2>
            
            <div class="especialidades-grid">
                <div class="especialidade-card" onclick="lancarEspecialidade('clinica-geral')">
                    <div class="status-badge badge-disponivel">✅ DISPONÍVEL</div>
                    <h3>🩺 Clínica Geral</h3>
                    <p>Consultas gerais e acompanhamento</p>
                    <p><strong>Médicos ativos:</strong> 12</p>
                    <p><strong>Valor médio:</strong> R$ 120</p>
                </div>
                
                <div class="especialidade-card" onclick="lancarEspecialidade('psiquiatria')">
                    <div class="status-badge badge-disponivel">✅ DISPONÍVEL</div>
                    <h3>🧠 Psiquiatria</h3>
                    <p>Saúde mental e bem-estar</p>
                    <p><strong>Médicos ativos:</strong> 8</p>
                    <p><strong>Valor médio:</strong> R$ 180</p>
                </div>
                
                <div class="especialidade-card" onclick="lancarEspecialidade('ginecologia')">
                    <div class="status-badge badge-disponivel">✅ DISPONÍVEL</div>
                    <h3>👩‍⚕️ Ginecologia</h3>
                    <p>Saúde da mulher</p>
                    <p><strong>Médicos ativos:</strong> 6</p>
                    <p><strong>Valor médio:</strong> R$ 160</p>
                </div>
                
                <div class="especialidade-card" onclick="lancarEspecialidade('psicoterapia')">
                    <div class="status-badge badge-disponivel">✅ DISPONÍVEL</div>
                    <h3>💭 Psicoterapia</h3>
                    <p>Terapia e aconselhamento</p>
                    <p><strong>Médicos ativos:</strong> 10</p>
                    <p><strong>Valor médio:</strong> R$ 140</p>
                </div>
                
                <div class="especialidade-card" onclick="lancarEspecialidade('nutricao')">
                    <div class="status-badge badge-disponivel">✅ DISPONÍVEL</div>
                    <h3>🥗 Nutrição</h3>
                    <p>Orientação nutricional</p>
                    <p><strong>Médicos ativos:</strong> 7</p>
                    <p><strong>Valor médio:</strong> R$ 100</p>
                </div>
                
                <div class="especialidade-card" onclick="lancarEspecialidade('ortopedia')">
                    <div class="status-badge badge-disponivel">✅ DISPONÍVEL</div>
                    <h3>🦴 Ortopedia</h3>
                    <p>Ossos, músculos e articulações</p>
                    <p><strong>Médicos ativos:</strong> 5</p>
                    <p><strong>Valor médio:</strong> R$ 200</p>
                </div>
            </div>
        </div>
        
        <script>
            function criarLance() {
                const especialidade = document.getElementById('especialidade').value;
                const valor = document.getElementById('valor').value;
                const urgencia = document.getElementById('urgencia').value;
                const tempo = document.getElementById('tempo').value;
                
                if (!especialidade || !valor) {
                    alert('Por favor, selecione uma especialidade e defina um valor!');
                    return;
                }
                
                alert(\`Lance criado!\\n\\nEspecialidade: \${especialidade}\\nValor: R$ \${valor}\\nUrgência: \${urgencia}\\nTempo: \${tempo} min\\n\\nRedirecionando para área do paciente...\`);
                
                // Redirecionar para aguardando médico
                window.location.href = '/aguardando-medico.html';
            }
            
            function lancarEspecialidade(especialidade) {
                const especialidades = {
                    'clinica-geral': '🩺 Clínica Geral',
                    'psiquiatria': '🧠 Psiquiatria',
                    'ginecologia': '👩‍⚕️ Ginecologia',
                    'psicoterapia': '💭 Psicoterapia',
                    'nutricao': '🥗 Nutrição',
                    'ortopedia': '🦴 Ortopedia'
                };
                
                const valor = prompt(\`Criar lance para \${especialidades[especialidade]}\\n\\nDigite o valor máximo que deseja pagar (R$):\`, '120');
                
                if (valor && parseInt(valor) >= 50) {
                    alert(\`Lance criado para \${especialidades[especialidade]}!\\nValor: R$ \${valor}\\n\\nMédicos serão notificados...\\n\\nRedirecionando...\`);
                    // Redirecionar para aguardando médico
                    window.location.href = '/aguardando-medico.html';
                } else if (valor) {
                    alert('Valor mínimo é R$ 50');
                }
            }
            
            function aceitarProposta(especialidade, valor) {
                if (confirm(\`Confirma aceitar a proposta de R$ \${valor} para \${especialidade}?\\n\\nApós aceitar, a consulta será agendada.\`)) {
                    alert('Proposta aceita! Redirecionando para agendamento...');
                    window.location.href = '/aguardando-medico.html';
                }
            }
            
            function verPropostas(especialidade) {
                alert(\`Abrindo lista de propostas para \${especialidade}...\\n\\nEm breve: página com todas as propostas detalhadas.\`);
                // window.location.href = \`/propostas/\${especialidade}\`;
            }
        </script>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '8.3.0-CLEAN'
  });
});

// Initialize server
async function startServer() {
  try {
    const httpServer = await registerRoutes(app);
    
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log('🔧 NODE_ENV:', nodeEnv);
    
    if (nodeEnv === 'development') {
      console.log('🔧 Setting up Vite for development...');
      await setupVite(app, httpServer);
      console.log('✅ Vite setup complete');
    } else {
      console.log('🔧 Setting up static file serving for production...');
      serveStatic(app);
    }

    // SPA fallback - ONLY for non-API routes and non-HTML routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.endsWith('.html')) {
        return next(); // Let API routes and HTML files pass through
      }
      
      // Serve React app index.html for all other routes
      const indexPath = path.join(__dirname, '../client/index.html');
      console.log('📄 Serving React SPA for:', req.path);
      res.sendFile(indexPath);
    });
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`[${new Date().toISOString()}] 🩺 TeleMed Sistema v8.3.0-CLEAN`);
      console.log(`[${new Date().toISOString()}] 🌐 Servidor rodando na porta ${PORT}`);
      console.log(`[${new Date().toISOString()}] 🔗 Acesso: http://localhost:${PORT}`);
      console.log(`[${new Date().toISOString()}] ✅ React + Backend integrados`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();