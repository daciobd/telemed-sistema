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

// PÁGINAS CRÍTICAS - MÁXIMA PRIORIDADE (antes de Vite/React)
// LOGIN - HTML estático com CSS inline
app.get('/login', (req, res) => {
  console.log('📄 Serving login (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - TeleMed Consultas</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .login-container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                width: 100%;
                max-width: 900px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                box-shadow: 0 20px 40px rgba(167, 199, 231, 0.15);
            }
            .login-left {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .login-right {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                border-radius: 15px;
                padding: 30px;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2D5A87;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6B7280;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #2D5A87;
            }
            .form-group input {
                width: 100%;
                padding: 15px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            .form-group input:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            .btn-primary {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 15px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                width: 100%;
                margin-bottom: 15px;
                transition: transform 0.3s;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
            }
            .social-login {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .btn-social {
                flex: 1;
                padding: 12px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                background: white;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: 500;
            }
            .btn-social:hover {
                border-color: #A7C7E7;
                transform: translateY(-1px);
            }
            .features {
                margin-top: 20px;
            }
            .feature {
                background: rgba(255,255,255,0.2);
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                font-size: 14px;
            }
            .links {
                text-align: center;
                margin-top: 20px;
            }
            .links a {
                color: #A7C7E7;
                text-decoration: none;
                font-weight: 500;
            }
            @media (max-width: 768px) {
                .login-container {
                    grid-template-columns: 1fr;
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="login-left">
                <div class="logo">🏥 TeleMed Consultas</div>
                <div class="subtitle">Acesse sua conta e gerencie suas consultas</div>
                
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">E-mail ou Telefone:</label>
                        <input type="text" id="email" placeholder="seu@email.com ou (11) 99999-9999" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Senha:</label>
                        <input type="password" id="password" placeholder="Sua senha" required>
                    </div>
                    
                    <button type="submit" class="btn-primary">🔐 Entrar na Minha Conta</button>
                </form>
                
                <div class="social-login">
                    <button class="btn-social" onclick="loginGoogle()">📧 Google</button>
                    <button class="btn-social" onclick="loginWhatsApp()">💬 WhatsApp</button>
                </div>
                
                <div class="links">
                    <a href="#" onclick="esqueceuSenha()">Esqueceu a senha?</a> | 
                    <a href="/register">Criar conta gratuita</a>
                </div>
            </div>
            
            <div class="login-right">
                <h2>🚀 Mais que uma consulta</h2>
                <p style="margin-bottom: 25px;">Uma experiência completa em telemedicina</p>
                
                <div class="features">
                    <div class="feature">🎯 <strong>Sistema de Lances</strong><br>Você define o preço da consulta</div>
                    <div class="feature">🤖 <strong>Dr. AI</strong><br>Triagem inteligente automatizada</div>
                    <div class="feature">💰 <strong>Preços Flexíveis</strong><br>Consultas até 50% mais baratas</div>
                    <div class="feature">⚡ <strong>Atendimento Rápido</strong><br>Consultas em até 30 minutos</div>
                </div>
            </div>
        </div>
        
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    alert('Por favor, preencha todos os campos!');
                    return;
                }
                
                // Simular login
                alert('Login realizado com sucesso!\\nRedirecionando...');
                
                // Redirecionar baseado no tipo de usuário
                if (email.includes('dr') || email.includes('medic')) {
                    window.location.href = '/doctor-dashboard';
                } else {
                    window.location.href = '/patient-dashboard';
                }
            });
            
            function loginGoogle() {
                alert('Login com Google em desenvolvimento...\\nUsando login tradicional.');
            }
            
            function loginWhatsApp() {
                const numero = prompt('Digite seu WhatsApp:');
                if (numero) {
                    alert('Código enviado para ' + numero + '\\nEm breve: verificação automática');
                }
            }
            
            function esqueceuSenha() {
                const email = prompt('Digite seu e-mail para recuperação:');
                if (email) {
                    alert('E-mail de recuperação enviado para: ' + email);
                }
            }
        </script>
    </body>
    </html>
  `);
});

// DOCTOR-DASHBOARD - HTML estático com CSS inline
app.get('/doctor-dashboard', (req, res) => {
  console.log('📄 Serving doctor-dashboard (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard Médico - TeleMed</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: #FAFBFC;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 20px 30px;
                border-radius: 20px;
                margin-bottom: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: white;
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(167, 199, 231, 0.1);
                border-left: 5px solid #A7C7E7;
            }
            .stat-value {
                font-size: 32px;
                font-weight: bold;
                color: #2D5A87;
                margin-bottom: 5px;
            }
            .stat-label {
                color: #6B7280;
                font-size: 14px;
            }
            .stat-change {
                color: #10B981;
                font-size: 12px;
                font-weight: 500;
                margin-top: 5px;
            }
            .section {
                background: white;
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 20px;
                box-shadow: 0 5px 15px rgba(167, 199, 231, 0.1);
            }
            .section h3 {
                color: #2D5A87;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #A7C7E7;
            }
            .lance-card {
                background: #F8F9FA;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                border-left: 5px solid #F4D9B4;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .btn-primary {
                background: #A7C7E7;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: opacity 0.3s;
            }
            .btn-primary:hover { opacity: 0.8; }
            .urgent { border-left-color: #E9967A; }
            .menu-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 8px 15px;
                border-radius: 8px;
                cursor: pointer;
                margin-left: 10px;
            }
            
            /* OTIMIZAÇÕES VISUAIS - Animações */
            .fade-in {
                animation: fadeIn 0.5s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideIn {
                from { transform: translateX(300px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 12px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .toast-success {
                background: #A7C7E7;
                color: white;
            }
            
            .toast-error {
                background: #E9967A;
                color: white;
            }
            
            .btn-loading {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            @media (max-width: 768px) {
                .toast {
                    right: 10px;
                    left: 10px;
                    top: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1>👨‍⚕️ Dr. Dácio Bonoldi Dutra</h1>
                <p>Bem-vindo ao seu dashboard médico</p>
            </div>
            <div>
                <button class="menu-btn" onclick="window.location.href='/patient-bidding'">🎯 Ver Lances</button>
                <button class="menu-btn" onclick="window.location.href='/login'">🚪 Sair</button>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">R$ 2.840</div>
                <div class="stat-label">Faturamento Hoje</div>
                <div class="stat-change">+15% vs ontem</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">12</div>
                <div class="stat-label">Consultas Hoje</div>
                <div class="stat-change">+3 vs média</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">8</div>
                <div class="stat-label">Lances Ativos</div>
                <div class="stat-change">Aguardando resposta</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">4.9⭐</div>
                <div class="stat-label">Avaliação Média</div>
                <div class="stat-change">Excelente!</div>
            </div>
        </div>
        
        <div class="section">
            <h3>🎯 Lances Aguardando Sua Resposta</h3>
            
            <div class="lance-card urgent">
                <div>
                    <strong>❤️ Cardiologia - Urgente</strong><br>
                    <span style="color: #6B7280;">Paciente: Maria Silva | Valor: R$ 180</span>
                </div>
                <div>
                    <button class="btn-primary" onclick="aceitarLance('cardiologia', 180)">Aceitar R$ 180</button>
                </div>
            </div>
            
            <div class="lance-card">
                <div>
                    <strong>👶 Pediatria - Regular</strong><br>
                    <span style="color: #6B7280;">Paciente: Ana Costa | Valor: R$ 150</span>
                </div>
                <div>
                    <button class="btn-primary" onclick="aceitarLance('pediatria', 150)">Aceitar R$ 150</button>
                </div>
            </div>
            
            <div class="lance-card">
                <div>
                    <strong>🔬 Dermatologia - Alta</strong><br>
                    <span style="color: #6B7280;">Paciente: João Santos | Valor: R$ 120</span>
                </div>
                <div>
                    <button class="btn-primary" onclick="aceitarLance('dermatologia', 120)">Aceitar R$ 120</button>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h3>📅 Próximas Consultas</h3>
            <p style="color: #6B7280;">Consultas agendadas para hoje:</p>
            <div style="margin-top: 15px;">
                <div style="padding: 10px; border-left: 3px solid #A7C7E7; margin-bottom: 10px;">
                    <strong>14:00</strong> - Consulta Cardiologia (Maria Silva)
                </div>
                <div style="padding: 10px; border-left: 3px solid #F4D9B4; margin-bottom: 10px;">
                    <strong>15:30</strong> - Consulta Pediatria (Ana Costa)
                </div>
            </div>
        </div>
        
        <script>
            // Sistema de Toast Notifications
            function showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = \`toast toast-\${type}\`;
                toast.innerHTML = message;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
            
            // Sistema de Loading States
            function showLoading(button) {
                const originalText = button.innerHTML;
                button.innerHTML = '⏳ Processando...';
                button.disabled = true;
                button.classList.add('btn-loading');
                
                return () => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.classList.remove('btn-loading');
                };
            }
            
            // Aplicar animações fade-in quando página carrega
            document.addEventListener('DOMContentLoaded', function() {
                document.querySelectorAll('.stat-card, .lance-card, .section').forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('fade-in');
                    }, index * 100);
                });
            });
            
            function aceitarLance(especialidade, valor) {
                const button = event.target;
                
                if (confirm(\`Aceitar lance de \${especialidade} por R$ \${valor}?\\n\\nApós aceitar, a consulta será agendada automaticamente.\`)) {
                    const hideLoading = showLoading(button);
                    
                    // Simular processamento
                    setTimeout(() => {
                        hideLoading();
                        
                        showToast(\`✅ Lance de \${especialidade} aceito! Consulta agendada por R$ \${valor}\`);
                        
                        // Marcar como aceito
                        const card = button.closest('.lance-card');
                        card.style.opacity = '0.5';
                        card.style.transform = 'scale(0.98)';
                        button.innerHTML = '✅ Aceito';
                        button.style.background = '#10B981';
                        button.disabled = true;
                        
                        // Atualizar contador de lances
                        setTimeout(() => {
                            const lancesAtivos = document.querySelector('.stat-card:nth-child(3) .stat-value');
                            if (lancesAtivos) {
                                lancesAtivos.textContent = parseInt(lancesAtivos.textContent) - 1;
                            }
                        }, 500);
                        
                    }, 1500);
                }
            }
        </script>
    </body>
    </html>
  `);
});

// REGISTER - PÁGINA DE CADASTRO CRÍTICA
app.get('/register', (req, res) => {
  console.log('📄 Serving register (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro - TeleMed Sistema</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .register-container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                width: 100%;
                max-width: 1000px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                box-shadow: 0 20px 40px rgba(167, 199, 231, 0.15);
                animation: fadeIn 0.5s ease-in;
            }
            .register-left {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .register-right {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                border-radius: 15px;
                padding: 30px;
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2D5A87;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6B7280;
                margin-bottom: 30px;
            }
            .user-type {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
            }
            .type-option {
                flex: 1;
                padding: 15px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s;
                background: white;
            }
            .type-option:hover,
            .type-option.selected {
                border-color: #A7C7E7;
                background: #A7C7E71A;
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 20px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group.full-width {
                grid-column: 1 / -1;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #2D5A87;
            }
            .form-group input, .form-group select {
                width: 100%;
                padding: 15px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            .form-group input:focus, .form-group select:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            .speciality-section {
                display: none;
                padding: 20px;
                background: #F8F9FA;
                border-radius: 12px;
                margin-bottom: 20px;
            }
            .speciality-section.show {
                display: block;
            }
            .btn-primary {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 18px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                width: 100%;
                margin-bottom: 15px;
                transition: transform 0.3s;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
            }
            .btn-primary:disabled {
                background: #D1D5DB;
                cursor: not-allowed;
                transform: none;
            }
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
            }
            .links {
                text-align: center;
                margin-top: 20px;
            }
            .links a {
                color: #A7C7E7;
                text-decoration: none;
                font-weight: 500;
            }
            .feature {
                background: rgba(255,255,255,0.2);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-size: 14px;
            }
            .btn-loading {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            /* OTIMIZAÇÕES VISUAIS */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideIn {
                from { transform: translateX(300px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 12px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .toast-success {
                background: #A7C7E7;
                color: white;
            }
            .toast-error {
                background: #E9967A;
                color: white;
            }
            
            @media (max-width: 768px) {
                .register-container {
                    grid-template-columns: 1fr;
                    padding: 20px;
                }
                .form-row {
                    grid-template-columns: 1fr;
                }
                .toast {
                    right: 10px;
                    left: 10px;
                    top: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="register-container">
            <div class="register-left">
                <div class="logo">🏥 TeleMed Sistema</div>
                <div class="subtitle">Crie sua conta e comece a cuidar da sua saúde</div>
                
                <!-- Tipo de Usuário -->
                <div class="user-type">
                    <div class="type-option" onclick="selectUserType('paciente')">
                        <h4>👤 Sou Paciente</h4>
                        <p>Busco consultas médicas</p>
                    </div>
                    <div class="type-option" onclick="selectUserType('medico')">
                        <h4>👨‍⚕️ Sou Médico</h4>
                        <p>Quero atender pacientes</p>
                    </div>
                </div>
                
                <form id="registerForm">
                    <input type="hidden" id="userType" name="userType" required>
                    
                    <!-- Dados Pessoais -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nome">Nome Completo:</label>
                            <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">E-mail:</label>
                            <input type="email" id="email" name="email" placeholder="seu@email.com" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="telefone">Telefone/WhatsApp:</label>
                            <input type="tel" id="telefone" name="telefone" placeholder="(11) 99999-9999" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nascimento">Data de Nascimento:</label>
                            <input type="date" id="nascimento" name="nascimento" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="senha">Senha:</label>
                            <input type="password" id="senha" name="senha" placeholder="Mínimo 8 caracteres" required>
                        </div>
                    </div>
                    
                    <!-- Seção Específica para Médicos -->
                    <div id="medicoSection" class="speciality-section">
                        <h4 style="color: #2D5A87; margin-bottom: 15px;">📋 Informações Profissionais</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="crm">CRM:</label>
                                <input type="text" id="crm" name="crm" placeholder="CRM/SP 123456">
                            </div>
                            
                            <div class="form-group">
                                <label for="especialidade1">Especialidade Principal:</label>
                                <select id="especialidade1" name="especialidade1">
                                    <option value="">Selecione...</option>
                                    <option value="clinica-geral">Clínica Geral</option>
                                    <option value="cardiologia">Cardiologia</option>
                                    <option value="pediatria">Pediatria</option>
                                    <option value="dermatologia">Dermatologia</option>
                                    <option value="psiquiatria">Psiquiatria</option>
                                    <option value="ginecologia">Ginecologia</option>
                                    <option value="ortopedia">Ortopedia</option>
                                    <option value="psicoterapia">Psicoterapia</option>
                                    <option value="nutricao">Nutrição</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="experiencia">Anos de Experiência:</label>
                            <select id="experiencia" name="experiencia">
                                <option value="">Selecione...</option>
                                <option value="0-2">0-2 anos</option>
                                <option value="3-5">3-5 anos</option>
                                <option value="6-10">6-10 anos</option>
                                <option value="11-20">11-20 anos</option>
                                <option value="20+">Mais de 20 anos</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Termos e Condições -->
                    <div class="checkbox-group">
                        <input type="checkbox" id="termos" name="termos" required>
                        <label for="termos">Concordo com os <a href="/termos-de-uso" target="_blank">Termos de Uso</a> e <a href="/politica-privacidade" target="_blank">Política de Privacidade</a></label>
                    </div>
                    
                    <button type="submit" class="btn-primary" id="submitBtn">
                        Criar Conta Gratuitamente
                    </button>
                    
                    <div class="links">
                        Já tem uma conta? <a href="/login">Fazer Login</a>
                    </div>
                </form>
            </div>
            
            <div class="register-right">
                <h3 style="margin-bottom: 20px;">🎯 Por que escolher o TeleMed?</h3>
                
                <div class="feature">
                    <strong>🩺 Sistema de Lances Único</strong><br>
                    Primeiro sistema do Brasil com preços flexíveis
                </div>
                
                <div class="feature">
                    <strong>🤖 Dr. AI Integrado</strong><br>
                    Triagem inteligente com IA médica especializada
                </div>
                
                <div class="feature">
                    <strong>📱 100% Digital</strong><br>
                    Consultas por videochamada com qualidade HD
                </div>
                
                <div class="feature">
                    <strong>🔒 Segurança Total</strong><br>
                    Conformidade LGPD e criptografia end-to-end
                </div>
                
                <div class="feature">
                    <strong>⚡ Disponível 24/7</strong><br>
                    Emergências médicas a qualquer hora
                </div>
            </div>
        </div>
        
        <script>
            // Sistema de Toast Notifications
            function showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = \`toast toast-\${type}\`;
                toast.innerHTML = message;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
            
            // Sistema de Loading States
            function showLoading(button) {
                const originalText = button.innerHTML;
                button.innerHTML = '⏳ Criando conta...';
                button.disabled = true;
                button.classList.add('btn-loading');
                
                return () => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.classList.remove('btn-loading');
                };
            }
            
            let selectedType = '';
            
            function selectUserType(type) {
                selectedType = type;
                document.getElementById('userType').value = type;
                
                // Atualizar visual
                document.querySelectorAll('.type-option').forEach(option => {
                    option.classList.remove('selected');
                });
                event.target.closest('.type-option').classList.add('selected');
                
                // Mostrar/ocultar seção médico
                const medicoSection = document.getElementById('medicoSection');
                if (type === 'medico') {
                    medicoSection.classList.add('show');
                } else {
                    medicoSection.classList.remove('show');
                }
            }
            
            // Máscaras para inputs
            document.getElementById('telefone').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });
            
            document.getElementById('cpf').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
            
            // Submit do formulário
            document.getElementById('registerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitButton = document.getElementById('submitBtn');
                
                if (!selectedType) {
                    showToast('⚠️ Selecione o tipo de usuário', 'error');
                    return;
                }
                
                const hideLoading = showLoading(submitButton);
                
                // Simular processamento
                setTimeout(() => {
                    hideLoading();
                    
                    showToast('✅ Conta criada com sucesso! Redirecionando...');
                    
                    // Redirecionar baseado no tipo
                    setTimeout(() => {
                        if (selectedType === 'medico') {
                            window.location.href = '/doctor-dashboard';
                        } else {
                            window.location.href = '/patient-dashboard';
                        }
                    }, 1500);
                    
                }, 2000);
            });
        </script>
    </body>
    </html>
  `);
});

// TERMOS DE USO - PÁGINA INSTITUCIONAL CRÍTICA
app.get('/termos-de-uso', (req, res) => {
  console.log('📄 Serving termos-de-uso (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Termos de Uso - TeleMed Sistema</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background: #FAFBFC;
                line-height: 1.6;
                color: #374151;
            }
            .header {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 20px 0;
                text-align: center;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: white;
                border-radius: 20px;
                margin-top: -20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                animation: fadeIn 0.5s ease-in;
            }
            h1 { color: #2D5A87; margin-bottom: 20px; }
            h2 { color: #2D5A87; margin: 30px 0 15px 0; font-size: 20px; }
            h3 { color: #374151; margin: 20px 0 10px 0; font-size: 18px; }
            p { margin-bottom: 15px; }
            .section { margin-bottom: 30px; }
            .back-btn {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                display: inline-block;
                margin-bottom: 20px;
                font-weight: 500;
            }
            .back-btn:hover { transform: translateY(-2px); }
            .highlight { background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .date { color: #6B7280; font-size: 14px; }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📋 Termos de Uso</h1>
            <p>TeleMed Sistema - Plataforma de Telemedicina</p>
        </div>
        
        <div class="container">
            <a href="/" class="back-btn">← Voltar ao Site</a>
            
            <div class="date">Última atualização: 28 de julho de 2025</div>
            
            <div class="section">
                <h2>1. Aceitação dos Termos</h2>
                <p>Ao acessar e utilizar a plataforma TeleMed Sistema, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.</p>
            </div>
            
            <div class="section">
                <h2>2. Descrição do Serviço</h2>
                <p>O TeleMed Sistema é uma plataforma de telemedicina que conecta pacientes e médicos através de:</p>
                <div class="highlight">
                    <p><strong>• Sistema de Lances:</strong> Pacientes fazem lances por consultas médicas</p>
                    <p><strong>• Dr. AI:</strong> Triagem médica inteligente com inteligência artificial</p>
                    <p><strong>• Videoconsultas:</strong> Consultas médicas por videochamada</p>
                    <p><strong>• Prescrições Digitais:</strong> Emissão de receitas médicas digitais</p>
                </div>
            </div>
            
            <div class="section">
                <h2>3. Cadastro e Conta de Usuário</h2>
                <h3>3.1 Elegibilidade</h3>
                <p>Para usar nossos serviços, você deve ter pelo menos 18 anos de idade ou ter autorização dos pais/responsáveis.</p>
                
                <h3>3.2 Informações Precisas</h3>
                <p>Você deve fornecer informações precisas, atuais e completas durante o processo de registro e manter essas informações atualizadas.</p>
                
                <h3>3.3 Segurança da Conta</h3>
                <p>Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem sob sua conta.</p>
            </div>
            
            <div class="section">
                <h2>4. Contato</h2>
                <p>Para dúvidas sobre estes termos, entre em contato:</p>
                <div class="highlight">
                    <p><strong>E-mail:</strong> juridico@telemed.com.br</p>
                    <p><strong>WhatsApp:</strong> (11) 99999-8888</p>
                    <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// POLÍTICA DE PRIVACIDADE - PÁGINA INSTITUCIONAL CRÍTICA
app.get('/politica-privacidade', (req, res) => {
  console.log('📄 Serving politica-privacidade (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Política de Privacidade - TeleMed Sistema</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background: #FAFBFC;
                line-height: 1.6;
                color: #374151;
            }
            .header {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 20px 0;
                text-align: center;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: white;
                border-radius: 20px;
                margin-top: -20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                animation: fadeIn 0.5s ease-in;
            }
            h1 { color: #2D5A87; margin-bottom: 20px; }
            h2 { color: #2D5A87; margin: 30px 0 15px 0; font-size: 20px; }
            h3 { color: #374151; margin: 20px 0 10px 0; font-size: 18px; }
            p { margin-bottom: 15px; }
            .section { margin-bottom: 30px; }
            .back-btn {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                display: inline-block;
                margin-bottom: 20px;
                font-weight: 500;
            }
            .back-btn:hover { transform: translateY(-2px); }
            .highlight { background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .lgpd-box { background: linear-gradient(135deg, #A7C7E71A 0%, #92B4D71A 100%); padding: 20px; border-radius: 12px; border: 2px solid #A7C7E7; margin: 20px 0; }
            .date { color: #6B7280; font-size: 14px; }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔒 Política de Privacidade</h1>
            <p>TeleMed Sistema - Proteção de Dados LGPD</p>
        </div>
        
        <div class="container">
            <a href="/" class="back-btn">← Voltar ao Site</a>
            
            <div class="date">Última atualização: 28 de julho de 2025</div>
            
            <div class="lgpd-box">
                <h3>🛡️ Conformidade LGPD</h3>
                <p>Esta Política de Privacidade está em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) e garante seus direitos como titular dos dados.</p>
            </div>
            
            <div class="section">
                <h2>1. Informações que Coletamos</h2>
                <h3>1.1 Dados Pessoais Básicos</h3>
                <p>• Nome completo, CPF, data de nascimento</p>
                <p>• E-mail, telefone/WhatsApp</p>
                <p>• Endereço residencial</p>
                
                <h3>1.2 Dados Médicos (Pacientes)</h3>
                <p>• Histórico médico e sintomas relatados</p>
                <p>• Prescrições e tratamentos recebidos</p>
                <p>• Resultados de triagem com Dr. AI</p>
            </div>
            
            <div class="section">
                <h2>2. Seus Direitos como Titular (LGPD)</h2>
                <div class="lgpd-box">
                    <h3>Você tem direito a:</h3>
                    <p><strong>• Confirmação:</strong> Saber se processamos seus dados</p>
                    <p><strong>• Acesso:</strong> Obter cópia dos seus dados pessoais</p>
                    <p><strong>• Correção:</strong> Corrigir dados incompletos ou incorretos</p>
                    <p><strong>• Eliminação:</strong> Excluir dados desnecessários</p>
                    <p><strong>• Revogação:</strong> Retirar consentimento a qualquer momento</p>
                </div>
            </div>
            
            <div class="section">
                <h2>3. Contato e Exercício de Direitos</h2>
                <div class="highlight">
                    <p><strong>Encarregado de Dados (DPO):</strong></p>
                    <p><strong>E-mail:</strong> dpo@telemed.com.br</p>
                    <p><strong>WhatsApp:</strong> (11) 99999-7777</p>
                    <p><strong>Horário:</strong> Segunda a sexta, 9h às 18h</p>
                </div>
                <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco através dos canais acima.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// SOBRE - PÁGINA INSTITUCIONAL
app.get('/sobre', (req, res) => {
  console.log('📄 Serving sobre (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sobre Nós - TeleMed Sistema</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background: #FAFBFC;
                line-height: 1.6;
                color: #374151;
            }
            .header {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 40px 0;
                text-align: center;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: white;
                border-radius: 20px;
                margin-top: -20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                animation: fadeIn 0.5s ease-in;
            }
            .hero {
                text-align: center;
                margin: 40px 0;
                padding: 30px;
                background: linear-gradient(135deg, #A7C7E71A 0%, #92B4D71A 100%);
                border-radius: 15px;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .stat {
                text-align: center;
                padding: 20px;
                background: #F8F9FA;
                border-radius: 12px;
            }
            .section { margin-bottom: 30px; }
            .back-btn {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                text-decoration: none;
                display: inline-block;
                margin-bottom: 20px;
                font-weight: 500;
            }
            h1 { color: #2D5A87; margin-bottom: 20px; }
            h2 { color: #2D5A87; margin: 30px 0 15px 0; font-size: 20px; }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🏥 Sobre o TeleMed Sistema</h1>
            <p>Revolucionando o acesso à saúde no Brasil</p>
        </div>
        
        <div class="container">
            <a href="/" class="back-btn">← Voltar ao Site</a>
            
            <div class="hero">
                <h2>🎯 Nossa Missão</h2>
                <p style="font-size: 18px; margin-top: 15px;">Democratizar o acesso à saúde de qualidade através da tecnologia, conectando médicos e pacientes de forma inovadora, segura e acessível.</p>
            </div>
            
            <div class="stats">
                <div class="stat">
                    <h3 style="font-size: 24px; color: #A7C7E7;">5.000+</h3>
                    <p>Médicos Credenciados</p>
                </div>
                <div class="stat">
                    <h3 style="font-size: 24px; color: #A7C7E7;">100K+</h3>
                    <p>Consultas Realizadas</p>
                </div>
                <div class="stat">
                    <h3 style="font-size: 24px; color: #A7C7E7;">4.9⭐</h3>
                    <p>Avaliação dos Usuários</p>
                </div>
                <div class="stat">
                    <h3 style="font-size: 24px; color: #A7C7E7;">24/7</h3>
                    <p>Disponibilidade</p>
                </div>
            </div>
            
            <div class="section">
                <h2>🚀 Nossa História</h2>
                <p>Fundado em 2025, o TeleMed Sistema nasceu da necessidade de tornar a medicina mais acessível e eficiente. Somos pioneiros no sistema de lances médicos, permitindo que pacientes definam quanto podem pagar por uma consulta médica de qualidade.</p>
            </div>
            
            <div class="section">
                <h2>📞 Entre em Contato</h2>
                <div style="background: linear-gradient(135deg, #A7C7E71A 0%, #92B4D71A 100%); padding: 20px; border-radius: 12px;">
                    <p><strong>E-mail:</strong> contato@telemed.com.br</p>
                    <p><strong>WhatsApp:</strong> (11) 99999-0000</p>
                    <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
                    <p><strong>Horário:</strong> Segunda a domingo, 24 horas</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// PATIENT-DASHBOARD - Corrigido com HTML estático
app.get('/patient-dashboard', (req, res) => {
  console.log('📄 Serving patient-dashboard (HTML corrigido - PRIORIDADE) for:', req.path);
  res.send(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dashboard Paciente - TeleMed</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins','Inter',Arial,sans-serif;background-color:#FAFBFC}.dashboard-header{background:linear-gradient(135deg,#E9967A 0%,#D67B5A 100%);color:white;padding:20px;display:flex;justify-content:space-between;align-items:center}.patient-info h1{font-size:24px;margin-bottom:5px}.patient-info p{font-size:14px;opacity:0.9}.welcome-section{padding:30px;text-align:center}.welcome-card{background:white;border-radius:20px;padding:40px;box-shadow:0 4px 15px rgba(0,0,0,0.08);margin-bottom:30px}.welcome-card h2{color:#2D5A87;font-size:28px;margin-bottom:15px}.welcome-card p{color:#666;font-size:16px;line-height:1.6}.actions-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;padding:0 30px 30px}.action-card{background:white;border-radius:20px;padding:30px;text-align:center;box-shadow:0 4px 15px rgba(0,0,0,0.08);border:2px solid transparent;transition:all 0.3s;cursor:pointer}.action-card:hover{border-color:#E9967A;transform:translateY(-5px)}.action-card .icon{font-size:48px;margin-bottom:20px;display:block}.action-card h3{color:#2D5A87;font-size:20px;margin-bottom:15px}.action-card p{color:#666;font-size:14px;margin-bottom:20px}.action-btn{background:linear-gradient(135deg,#E9967A 0%,#D67B5A 100%);color:white;border:none;padding:12px 24px;border-radius:10px;font-weight:600;cursor:pointer;transition:transform 0.2s;text-decoration:none;display:inline-block}.action-btn:hover{transform:translateY(-2px)}@media (max-width:768px){.dashboard-header{flex-direction:column;text-align:center;gap:10px}.actions-grid{grid-template-columns:1fr;padding:0 20px 20px}.welcome-section{padding:20px}}</style></head><body><div class="dashboard-header"><div class="patient-info"><h1>👤 Maria Silva</h1><p>Paciente • ID: 789456</p></div><div><a href="/" style="color:white;text-decoration:none;padding:10px 20px;border:1px solid rgba(255,255,255,0.3);border-radius:10px">Voltar ao Site</a></div></div><div class="welcome-section"><div class="welcome-card"><h2>Bem-vinda ao TeleMed Sistema! 👋</h2><p>Sua saúde está em boas mãos. Acesse consultas médicas profissionais sem sair de casa, com toda a segurança e qualidade que você merece.</p></div></div><div class="actions-grid"><div class="action-card" onclick="window.location.href='/agendamento'"><span class="icon">📅</span><h3>Agendar Consulta</h3><p>Agende sua consulta médica com especialistas qualificados</p><a href="/agendamento" class="action-btn">Agendar Agora</a></div><div class="action-card" onclick="window.location.href='/patient-bidding'"><span class="icon">💰</span><h3>Sistema de Lances</h3><p>Faça lances por consultas e encontre o melhor preço</p><a href="/patient-bidding" class="action-btn">Fazer Lance</a></div><div class="action-card" onclick="window.location.href='/dr-ai'"><span class="icon">🤖</span><h3>Dr. AI - Triagem</h3><p>Triagem inteligente gratuita com inteligência artificial</p><a href="/dr-ai" class="action-btn">Iniciar Triagem</a></div><div class="action-card" onclick="window.location.href='/especialidades.html'"><span class="icon">🩺</span><h3>Especialidades</h3><p>Conheça nossas especialidades médicas disponíveis</p><a href="/especialidades.html" class="action-btn">Ver Especialidades</a></div></div></body></html>`);
});

// DR-AI - Corrigido com HTML estático
app.get('/dr-ai', (req, res) => {
  console.log('📄 Serving dr-ai (HTML corrigido - PRIORIDADE) for:', req.path);
  res.send(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dr. AI - Triagem Médica - TeleMed</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Poppins','Inter',Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;flex-direction:column}.header{background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);padding:20px;text-align:center;color:white}.header h1{font-size:28px;margin-bottom:10px}.header p{font-size:16px;opacity:0.9}.chat-container{flex:1;max-width:800px;margin:20px auto;background:white;border-radius:20px;box-shadow:0 20px 50px rgba(0,0,0,0.15);overflow:hidden;display:flex;flex-direction:column}.chat-messages{flex:1;padding:30px;overflow-y:auto;max-height:400px}.message{margin-bottom:20px;display:flex;align-items:flex-start;gap:15px}.message.ai{flex-direction:row}.message.user{flex-direction:row-reverse}.message-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}.message.ai .message-avatar{background:linear-gradient(135deg,#667eea,#764ba2);color:white}.message.user .message-avatar{background:linear-gradient(135deg,#E9967A,#D67B5A);color:white}.message-content{background:#f8f9fa;padding:15px 20px;border-radius:18px;max-width:70%;line-height:1.6}.message.ai .message-content{border-bottom-left-radius:5px}.message.user .message-content{border-bottom-right-radius:5px;background:linear-gradient(135deg,#667eea,#764ba2);color:white}.chat-input-container{padding:20px;background:#f8f9fa;border-top:1px solid #eee}.chat-input{display:flex;gap:10px}.chat-input input{flex:1;padding:15px 20px;border:2px solid #e2e8f0;border-radius:25px;font-size:16px;outline:none}.chat-input input:focus{border-color:#667eea}.send-btn{background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;border-radius:50%;width:50px;height:50px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.2s}.send-btn:hover{transform:scale(1.05)}.suggestions{display:flex;gap:10px;flex-wrap:wrap;margin-top:15px}.suggestion-btn{background:white;border:2px solid #667eea;color:#667eea;padding:8px 16px;border-radius:20px;cursor:pointer;font-size:14px;transition:all 0.2s}.suggestion-btn:hover{background:#667eea;color:white}.back-btn{position:fixed;top:20px;left:20px;background:rgba(255,255,255,0.2);color:white;border:none;padding:10px 20px;border-radius:25px;cursor:pointer;backdrop-filter:blur(10px);text-decoration:none}@media (max-width:768px){.chat-container{margin:10px;border-radius:15px}.message-content{max-width:85%}.suggestions{flex-direction:column}}</style></head><body><a href="/" class="back-btn">← Voltar</a><div class="header"><h1>🤖 Dr. AI - Assistente Médico</h1><p>Triagem inteligente e orientações médicas personalizadas</p></div><div class="chat-container"><div class="chat-messages" id="chatMessages"><div class="message ai"><div class="message-avatar">🤖</div><div class="message-content">Olá! Sou o Dr. AI, seu assistente médico virtual. 👋<br><br>Estou aqui para ajudar com uma triagem inicial dos seus sintomas e orientá-lo sobre os próximos passos. Como posso ajudá-lo hoje?</div></div></div><div class="chat-input-container"><div class="chat-input"><input type="text" id="messageInput" placeholder="Descreva seus sintomas ou faça uma pergunta..."/><button class="send-btn" onclick="sendMessage()">📤</button></div><div class="suggestions"><button class="suggestion-btn" onclick="sendSuggestion('Estou com dor de cabeça há 2 dias')">Dor de cabeça</button><button class="suggestion-btn" onclick="sendSuggestion('Tenho ansiedade e insônia')">Ansiedade</button><button class="suggestion-btn" onclick="sendSuggestion('Dor no peito e falta de ar')">Dor no peito</button><button class="suggestion-btn" onclick="sendSuggestion('Triagem psiquiátrica completa')">Triagem psiquiátrica</button></div></div></div><script>const chatMessages=document.getElementById('chatMessages');const messageInput=document.getElementById('messageInput');function addMessage(content,isUser=false){const messageDiv=document.createElement('div');messageDiv.className=\`message \${isUser?'user':'ai'}\`;messageDiv.innerHTML=\`<div class="message-avatar">\${isUser?'👤':'🤖'}</div><div class="message-content">\${content}</div>\`;chatMessages.appendChild(messageDiv);chatMessages.scrollTop=chatMessages.scrollHeight}function sendMessage(){const message=messageInput.value.trim();if(!message)return;addMessage(message,true);messageInput.value='';setTimeout(()=>{const responses=["Entendo seus sintomas. Com base no que você descreveu, recomendo algumas avaliações. Você gostaria de:","Obrigado por compartilhar. Vou fazer algumas perguntas para uma triagem mais precisa:","Seus sintomas podem indicar algumas possibilidades. Para um diagnóstico adequado, sugiro:","Com base nos sintomas relatados, aqui estão meus próximos passos recomendados:"];const randomResponse=responses[Math.floor(Math.random()*responses.length)];addMessage(randomResponse+"<br><br>• Consulta com especialista<br>• Exames complementares<br>• <a href='/agendamento' style='color:#667eea;'>Agendar consulta presencial</a>")},1500)}function sendSuggestion(suggestion){messageInput.value=suggestion;sendMessage()}messageInput.addEventListener('keypress',function(e){if(e.key==='Enter'){sendMessage()}})</script></body></html>`);
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

// SOLUÇÃO AGENDAMENTO - HTML Estático com CSS Inline (4 passos organizados)
app.get('/agendamento', (req, res) => {
  const especialidade = req.query.especialidade || '';
  console.log('📄 Serving agendamento (HTML estático) for:', req.path, 'especialidade:', especialidade);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agendamento - TeleMed Consultas</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                padding: 20px; 
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 20px; 
                padding: 40px; 
                box-shadow: 0 10px 30px rgba(167, 199, 231, 0.1);
            }
            .header { 
                text-align: center;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%); 
                color: white; 
                padding: 30px; 
                border-radius: 20px; 
                margin-bottom: 40px; 
            }
            .step-indicator {
                display: flex;
                justify-content: center;
                margin-bottom: 30px;
            }
            .step {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #E5E7EB;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 10px;
                font-weight: bold;
                color: #6B7280;
            }
            .step.active {
                background: #A7C7E7;
                color: white;
            }
            .step.completed {
                background: #10B981;
                color: white;
            }
            .form-section {
                background: #F8F9FA;
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
                border-left: 5px solid #A7C7E7;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #2D5A87;
                font-size: 14px;
            }
            .form-group input, 
            .form-group select, 
            .form-group textarea {
                width: 100%;
                padding: 15px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            .form-group input:focus, 
            .form-group select:focus, 
            .form-group textarea:focus {
                outline: none;
                border-color: #A7C7E7;
                box-shadow: 0 0 0 3px rgba(167, 199, 231, 0.1);
            }
            .form-group textarea {
                min-height: 100px;
                resize: vertical;
            }
            .radio-group {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 10px;
            }
            .radio-option {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }
            .radio-option:hover {
                border-color: #A7C7E7;
            }
            .radio-option.selected {
                border-color: #A7C7E7;
                background: #A7C7E71A;
            }
            .radio-option input {
                display: none;
            }
            .btn-primary {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 18px 40px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                width: 100%;
                transition: all 0.3s ease;
                margin-top: 20px;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(167, 199, 231, 0.4);
            }
            .btn-secondary {
                background: #F4D9B4;
                color: #8B4513;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 500;
                margin-right: 10px;
            }
            .price-display {
                background: linear-gradient(135deg, #F4D9B4 0%, #E6C7A0 100%);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .price-value {
                font-size: 32px;
                font-weight: bold;
                color: #8B4513;
            }
            .alert {
                background: #E9967A;
                color: white;
                padding: 15px;
                border-radius: 12px;
                margin-bottom: 20px;
                text-align: center;
            }
            @media (max-width: 768px) {
                .container { padding: 20px; margin: 10px; }
                .radio-group { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📅 Agendamento de Consulta</h1>
                <p>Configure sua consulta médica online</p>
            </div>
            
            <!-- Indicador de Passos -->
            <div class="step-indicator">
                <div class="step active">1</div>
                <div class="step">2</div>
                <div class="step">3</div>
                <div class="step">4</div>
            </div>
            
            <form id="agendamentoForm">
                <!-- PASSO 1: ESPECIALIDADE -->
                <div class="form-section">
                    <h2 style="color: #2D5A87; margin-bottom: 20px;">🏥 Passo 1: Escolha a Especialidade</h2>
                    
                    <div class="form-group">
                        <label for="especialidade">Área Médica:</label>
                        <select id="especialidade" name="especialidade" required>
                            <option value="">Selecione uma especialidade...</option>
                            <option value="clinica-geral" ${especialidade === 'clinica-geral' ? 'selected' : ''}>🩺 Clínica Geral</option>
                            <option value="cardiologia" ${especialidade === 'cardiologia' ? 'selected' : ''}>❤️ Cardiologia</option>
                            <option value="pediatria" ${especialidade === 'pediatria' ? 'selected' : ''}>👶 Pediatria</option>
                            <option value="dermatologia" ${especialidade === 'dermatologia' ? 'selected' : ''}>🔬 Dermatologia</option>
                            <option value="psiquiatria" ${especialidade === 'psiquiatria' ? 'selected' : ''}>🧠 Psiquiatria</option>
                            <option value="ginecologia" ${especialidade === 'ginecologia' ? 'selected' : ''}>👩‍⚕️ Ginecologia</option>
                            <option value="psicoterapia" ${especialidade === 'psicoterapia' ? 'selected' : ''}>💭 Psicoterapia</option>
                            <option value="nutricao" ${especialidade === 'nutricao' ? 'selected' : ''}>🥗 Nutrição</option>
                            <option value="ortopedia" ${especialidade === 'ortopedia' ? 'selected' : ''}>🦴 Ortopedia</option>
                        </select>
                    </div>
                </div>
                
                <!-- PASSO 2: TIPO DE CONSULTA -->
                <div class="form-section">
                    <h2 style="color: #2D5A87; margin-bottom: 20px;">⚡ Passo 2: Tipo de Consulta</h2>
                    
                    <div class="radio-group">
                        <div class="radio-option" onclick="selectOption(this, 'tipo', 'agendada')">
                            <input type="radio" name="tipo" value="agendada">
                            <h3>📅 Consulta Agendada</h3>
                            <p>Escolha data e horário</p>
                            <strong>A partir de R$ 120</strong>
                        </div>
                        
                        <div class="radio-option" onclick="selectOption(this, 'tipo', 'lance')">
                            <input type="radio" name="tipo" value="lance">
                            <h3>🎯 Sistema de Lances</h3>
                            <p>Médicos fazem propostas</p>
                            <strong>Você define o valor</strong>
                        </div>
                        
                        <div class="radio-option" onclick="selectOption(this, 'tipo', 'urgente')">
                            <input type="radio" name="tipo" value="urgente">
                            <h3>🚨 Consulta Urgente</h3>
                            <p>Atendimento em até 30min</p>
                            <strong>A partir de R$ 200</strong>
                        </div>
                    </div>
                </div>
                
                <!-- PASSO 3: VALOR E URGÊNCIA -->
                <div class="form-section">
                    <h2 style="color: #2D5A87; margin-bottom: 20px;">💰 Passo 3: Valor e Prioridade</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label for="valor">Valor Máximo (R$):</label>
                            <input type="number" id="valor" name="valor" placeholder="150" min="50" max="500" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="urgencia">Nível de Urgência:</label>
                            <select id="urgencia" name="urgencia" required>
                                <option value="regular">Regular (24-48h)</option>
                                <option value="alta">Alta (6-12h)</option>
                                <option value="urgente">Urgente (até 2h)</option>
                                <option value="emergencia">Emergência (até 30min)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="price-display">
                        <div class="price-value" id="valorDisplay">R$ 0</div>
                        <p>Valor da sua consulta</p>
                    </div>
                </div>
                
                <!-- PASSO 4: INFORMAÇÕES PESSOAIS -->
                <div class="form-section">
                    <h2 style="color: #2D5A87; margin-bottom: 20px;">👤 Passo 4: Seus Dados</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label for="nome">Nome Completo:</label>
                            <input type="text" id="nome" name="nome" placeholder="Seu nome completo" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="telefone">Telefone:</label>
                            <input type="tel" id="telefone" name="telefone" placeholder="(11) 99999-9999" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">E-mail:</label>
                        <input type="email" id="email" name="email" placeholder="seu@email.com" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="sintomas">Descreva seus sintomas:</label>
                        <textarea id="sintomas" name="sintomas" placeholder="Descreva brevemente o que você está sentindo..." required></textarea>
                    </div>
                </div>
                
                <!-- BOTÕES DE AÇÃO -->
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <button type="button" class="btn-secondary" onclick="window.history.back()">
                        ← Voltar
                    </button>
                    <button type="submit" class="btn-primary">
                        🚀 Finalizar Agendamento
                    </button>
                </div>
            </form>
        </div>
        
        <script>
            // Atualizar valor em tempo real
            document.getElementById('valor').addEventListener('input', function() {
                const valor = this.value || 0;
                document.getElementById('valorDisplay').textContent = 'R$ ' + valor;
            });
            
            // Função para selecionar opções
            function selectOption(element, name, value) {
                // Remove seleção anterior
                const siblings = element.parentNode.children;
                for (let sibling of siblings) {
                    sibling.classList.remove('selected');
                }
                
                // Adiciona seleção atual
                element.classList.add('selected');
                element.querySelector('input').checked = true;
                
                // Atualizar preços baseado no tipo
                const valorInput = document.getElementById('valor');
                if (value === 'agendada') {
                    valorInput.value = 120;
                    valorInput.min = 80;
                } else if (value === 'lance') {
                    valorInput.value = 100;
                    valorInput.min = 50;
                } else if (value === 'urgente') {
                    valorInput.value = 200;
                    valorInput.min = 150;
                }
                
                // Atualizar display
                valorInput.dispatchEvent(new Event('input'));
                
                // Atualizar indicador de passos
                updateSteps();
            }
            
            // Atualizar indicador de passos
            function updateSteps() {
                const steps = document.querySelectorAll('.step');
                let currentStep = 1;
                
                if (document.getElementById('especialidade').value) currentStep = 2;
                if (document.querySelector('input[name="tipo"]:checked')) currentStep = 3;
                if (document.getElementById('valor').value) currentStep = 4;
                
                steps.forEach((step, index) => {
                    step.classList.remove('active', 'completed');
                    if (index + 1 < currentStep) {
                        step.classList.add('completed');
                    } else if (index + 1 === currentStep) {
                        step.classList.add('active');
                    }
                });
            }
            
            // Submit do formulário
            document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Validações
                if (!data.especialidade || !data.tipo || !data.valor || !data.nome || !data.email) {
                    alert('Por favor, preencha todos os campos obrigatórios!');
                    return;
                }
                
                if (parseInt(data.valor) < 50) {
                    alert('Valor mínimo é R$ 50');
                    return;
                }
                
                // Simular envio e redirecionar baseado no tipo de consulta
                alert(\`Agendamento enviado com sucesso!\\n\\nEspecialidade: \${data.especialidade}\\nTipo: \${data.tipo}\\nValor: R$ \${data.valor}\\nPaciente: \${data.nome}\\n\\nRedirecionando...\`);
                
                // Redirecionar baseado no tipo
                if (data.tipo === 'lance') {
                    window.location.href = '/patient-bidding';
                } else if (data.tipo === 'agendada') {
                    window.location.href = '/patient-dashboard';
                } else if (data.tipo === 'urgente') {
                    window.location.href = '/aguardando-medico.html';
                }
            });
            
            // Inicializar página
            document.addEventListener('DOMContentLoaded', function() {
                updateSteps();
                
                // Se especialidade veio da URL, atualizar indicador
                if (document.getElementById('especialidade').value) {
                    updateSteps();
                }
                
                // Adicionar listeners para atualização de passos
                document.getElementById('especialidade').addEventListener('change', updateSteps);
                document.getElementById('valor').addEventListener('input', updateSteps);
                
                // Máscara para telefone
                document.getElementById('telefone').addEventListener('input', function() {
                    let value = this.value.replace(/\\D/g, '');
                    if (value.length >= 11) {
                        value = value.replace(/(\\d{2})(\\d{5})(\\d{4})/, '($1) $2-$3');
                    } else if (value.length >= 7) {
                        value = value.replace(/(\\d{2})(\\d{4})(\\d{0,4})/, '($1) $2-$3');
                    } else if (value.length >= 3) {
                        value = value.replace(/(\\d{2})(\\d{0,5})/, '($1) $2');
                    }
                    this.value = value;
                });
            });
        </script>
    </body>
    </html>
  `);
});

// PÁGINAS CORRIGIDAS - HTML Estático com CSS Inline (solução para problema React/Vite)
// 1. LOGIN - Sistema de entrada
app.get('/login', (req, res) => {
  console.log('📄 Serving login (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - TeleMed Sistema</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', 'Inter', Arial, sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px; 
            }
            .login-container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 400px;
            }
            .logo {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo h1 {
                color: #2D5A87;
                font-size: 28px;
                margin-bottom: 10px;
            }
            .logo p {
                color: #666;
                font-size: 14px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-weight: 500;
            }
            .form-group input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #E2E2E2;
                border-radius: 12px;
                font-size: 16px;
                transition: border-color 0.2s;
            }
            .form-group input:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            .login-btn {
                width: 100%;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border: none;
                padding: 14px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .login-btn:hover {
                transform: translateY(-2px);
            }
            .links {
                text-align: center;
                margin-top: 20px;
            }
            .links a {
                color: #A7C7E7;
                text-decoration: none;
                font-size: 14px;
                margin: 0 10px;
            }
            .demo-accounts {
                background: #F8F9FA;
                border-radius: 12px;
                padding: 15px;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
            }
            .demo-accounts strong {
                color: #333;
            }
            /* OTIMIZAÇÕES VISUAIS - Animações e Toast */
            .fade-in {
                animation: fadeIn 0.5s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideIn {
                from { transform: translateX(300px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 12px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .toast-success {
                background: #A7C7E7;
                color: white;
            }
            
            .toast-error {
                background: #E9967A;
                color: white;
            }
            
            .btn-loading {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            @media (max-width: 768px) {
                .login-container {
                    padding: 30px 20px;
                    margin: 0 10px;
                }
                .toast {
                    right: 10px;
                    left: 10px;
                    top: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <h1>🩺 TeleMed Sistema</h1>
                <p>Acesso Profissional</p>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required placeholder="seu@email.com">
                </div>
                
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input type="password" id="password" name="password" required placeholder="Sua senha">
                </div>
                
                <button type="submit" class="login-btn">Entrar no Sistema</button>
            </form>
            
            <div class="links">
                <a href="/register.html">Criar Conta</a> |
                <a href="/">Voltar ao Site</a>
            </div>
            
            <div class="demo-accounts">
                <strong>Contas de Demonstração:</strong><br>
                👨‍⚕️ <strong>Médico:</strong> medico@demo.com / 123456<br>
                👤 <strong>Paciente:</strong> paciente@demo.com / 123456
            </div>
        </div>
        
        <script>
            // Sistema de Toast Notifications
            function showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = \`toast toast-\${type}\`;
                toast.innerHTML = message;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
            
            // Sistema de Loading States
            function showLoading(button) {
                const originalText = button.innerHTML;
                button.innerHTML = '⏳ Carregando...';
                button.disabled = true;
                button.classList.add('btn-loading');
                
                return () => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.classList.remove('btn-loading');
                };
            }
            
            // Aplicar animações fade-in quando página carrega
            document.addEventListener('DOMContentLoaded', function() {
                document.querySelector('.login-container').classList.add('fade-in');
            });
            
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const submitButton = document.querySelector('.login-btn');
                
                if (!email || !password) {
                    showToast('⚠️ Preencha todos os campos', 'error');
                    return;
                }
                
                const hideLoading = showLoading(submitButton);
                
                // Simular processamento
                setTimeout(() => {
                    hideLoading();
                    
                    // Sistema de login de demonstração
                    if (email === 'medico@demo.com' && password === '123456') {
                        showToast('✅ Login médico realizado com sucesso!');
                        setTimeout(() => window.location.href = '/doctor-dashboard', 1000);
                    } else if (email === 'paciente@demo.com' && password === '123456') {
                        showToast('✅ Login paciente realizado com sucesso!');
                        setTimeout(() => window.location.href = '/patient-dashboard', 1000);
                    } else {
                        showToast('❌ Email ou senha incorretos. Use as contas demo.', 'error');
                    }
                }, 1500);
            });
        </script>
    </body>
    </html>
  `);
});

// ROTAS DUPLICADAS REMOVIDAS - VERSÕES PRINCIPAIS ESTÃO NO TOPO DO ARQUIVO

// CONTINUAÇÃO DO SISTEMA DE LANCES (corrigindo estrutura)
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
      // Static routes that should NOT go to React SPA
      const staticRoutes = ['/login', '/doctor-dashboard', '/patient-dashboard', '/dr-ai'];
      
      if (req.path.startsWith('/api/') || 
          req.path.endsWith('.html') || 
          staticRoutes.includes(req.path)) {
        return next(); // Let API routes, HTML files, and static routes pass through
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