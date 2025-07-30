import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. PÁGINA SOBRE NÓS - Informações institucionais TeleMed
app.get('/sobre', (req, res) => {
  console.log('📄 Serving página Sobre Nós for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sobre Nós - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                line-height: 1.6; 
                color: #2D5A87; 
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 40px 20px; 
            }
            .header {
                text-align: center;
                margin-bottom: 60px;
            }
            .header h1 {
                font-size: 3rem;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 20px;
                font-weight: 700;
            }
            .header p {
                font-size: 1.2rem;
                color: #666;
                max-width: 600px;
                margin: 0 auto;
            }
            .section {
                background: white;
                border-radius: 20px;
                padding: 40px;
                margin-bottom: 40px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #E0E6ED;
            }
            .section h2 {
                color: #2D5A87;
                font-size: 2rem;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .section p {
                font-size: 1.1rem;
                margin-bottom: 15px;
                color: #555;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 30px;
                margin: 40px 0;
            }
            .stat-card {
                text-align: center;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 30px 20px;
                border-radius: 20px;
                box-shadow: 0 8px 25px rgba(167, 199, 231, 0.3);
            }
            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 10px;
            }
            .stat-label {
                font-size: 1rem;
                opacity: 0.9;
            }
            .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 30px;
                margin-top: 40px;
            }
            .team-member {
                text-align: center;
                background: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .member-avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }
            .back-button {
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 12px 25px;
                border: none;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(167, 199, 231, 0.3);
                transition: transform 0.3s ease;
            }
            .back-button:hover {
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .container { padding: 20px 15px; }
                .header h1 { font-size: 2rem; }
                .section { padding: 25px 20px; }
                .stats-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
                .stat-number { font-size: 2rem; }
            }
        </style>
    </head>
    <body>
        <a href="/" class="back-button">← Voltar ao Site</a>
        
        <div class="container">
            <div class="header">
                <h1>Sobre o TeleMed Sistema</h1>
                <p>Revolucionando a medicina digital no Brasil com tecnologia de ponta e cuidado humanizado</p>
            </div>
            
            <div class="section">
                <h2>🚀 Nossa Missão</h2>
                <p>
                    Democratizar o acesso à saúde de qualidade através da tecnologia, conectando pacientes 
                    e médicos especialistas em um ambiente seguro, eficiente e inovador. Acreditamos que 
                    a telemedicina é o futuro da assistência médica no Brasil.
                </p>
                <p>
                    Nossa plataforma combina inteligência artificial, sistema de lances transparente e 
                    videoconsultas de alta qualidade para oferecer a melhor experiência médica digital.
                </p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">5K+</div>
                    <div class="stat-label">Médicos Especialistas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">100K+</div>
                    <div class="stat-label">Consultas Realizadas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">4.9⭐</div>
                    <div class="stat-label">Avaliação Média</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">98%</div>
                    <div class="stat-label">Satisfação</div>
                </div>
            </div>
            
            <div class="section">
                <h2>💡 Nossa História</h2>
                <p>
                    Fundado em 2020 por uma equipe de médicos e tecnólogos visionários, o TeleMed Sistema 
                    nasceu da necessidade de tornar a medicina mais acessível e eficiente para todos os brasileiros.
                </p>
                <p>
                    Durante a pandemia, percebemos que a tecnologia poderia quebrar barreiras geográficas 
                    e socioeconômicas, levando especialistas de primeira linha para qualquer lugar do país. 
                    Desde então, já realizamos mais de 100.000 consultas e conectamos milhares de vidas.
                </p>
            </div>
            
            <div class="section">
                <h2>🎯 Nossos Valores</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 30px;">
                    <div style="padding: 20px; background: #F8F9FA; border-radius: 15px; border-left: 5px solid #A7C7E7;">
                        <h3 style="color: #2D5A87; margin-bottom: 10px;">🔒 Segurança e Privacidade</h3>
                        <p style="color: #666; font-size: 0.95rem;">Conformidade total com LGPD e criptografia end-to-end em todas as comunicações.</p>
                    </div>
                    <div style="padding: 20px; background: #F8F9FA; border-radius: 15px; border-left: 5px solid #F4D9B4;">
                        <h3 style="color: #2D5A87; margin-bottom: 10px;">⚡ Inovação Contínua</h3>
                        <p style="color: #666; font-size: 0.95rem;">Sempre na vanguarda da tecnologia médica, com Dr. AI e sistemas de ponta.</p>
                    </div>
                    <div style="padding: 20px; background: #F8F9FA; border-radius: 15px; border-left: 5px solid #E9967A;">
                        <h3 style="color: #2D5A87; margin-bottom: 10px;">❤️ Cuidado Humanizado</h3>
                        <p style="color: #666; font-size: 0.95rem;">Tecnologia a serviço do relacionamento médico-paciente, nunca o contrário.</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>👥 Nossa Equipe</h2>
                <div class="team-grid">
                    <div class="team-member">
                        <div class="member-avatar">👨‍⚕️</div>
                        <h3>Dr. João Silva</h3>
                        <p style="color: #A7C7E7; font-weight: 600;">CEO & Cardiologista</p>
                        <p style="font-size: 0.9rem; color: #666;">15 anos de experiência, ex-InCor USP</p>
                    </div>
                    <div class="team-member">
                        <div class="member-avatar">👩‍💻</div>
                        <h3>Ana Costa</h3>
                        <p style="color: #F4D9B4; font-weight: 600;">CTO & Engenheira</p>
                        <p style="font-size: 0.9rem; color: #666;">Especialista em IA médica e WebRTC</p>
                    </div>
                    <div class="team-member">
                        <div class="member-avatar">👨‍💼</div>
                        <h3>Carlos Mendes</h3>
                        <p style="color: #E9967A; font-weight: 600;">COO & Estrategista</p>
                        <p style="font-size: 0.9rem; color: #666;">MBA em Saúde Digital, ex-Hospital Sírio-Libanês</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>📞 Entre em Contato</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; margin-top: 20px;">
                    <div>
                        <h4 style="color: #2D5A87; margin-bottom: 10px;">📧 Email Institucional</h4>
                        <p style="color: #666;">contato@telemed.com.br</p>
                    </div>
                    <div>
                        <h4 style="color: #2D5A87; margin-bottom: 10px;">📞 Telefone</h4>
                        <p style="color: #666;">(11) 3000-0000</p>
                    </div>
                    <div>
                        <h4 style="color: #2D5A87; margin-bottom: 10px;">📍 Endereço</h4>
                        <p style="color: #666;">São Paulo - SP, Brasil</p>
                    </div>
                    <div>
                        <h4 style="color: #2D5A87; margin-bottom: 10px;">🕒 Horário</h4>
                        <p style="color: #666;">24/7 Online</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 2. POLÍTICA DE PRIVACIDADE - Conformidade LGPD
app.get('/politica-privacidade', (req, res) => {
  console.log('📄 Serving Política de Privacidade for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Política de Privacidade - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                line-height: 1.6; 
                color: #2D5A87; 
            }
            .container { 
                max-width: 900px; 
                margin: 0 auto; 
                padding: 40px 20px; 
            }
            .header {
                text-align: center;
                margin-bottom: 50px;
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header h1 {
                font-size: 2.5rem;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 15px;
                font-weight: 700;
            }
            .header p {
                font-size: 1.1rem;
                color: #666;
            }
            .section {
                background: white;
                border-radius: 20px;
                padding: 35px;
                margin-bottom: 30px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #E0E6ED;
            }
            .section-title {
                color: #2D5A87;
                font-size: 1.6rem;
                margin-bottom: 20px;
                font-weight: 600;
                border-bottom: 3px solid #A7C7E7;
                padding-bottom: 10px;
            }
            .section-text {
                font-size: 1rem;
                margin-bottom: 15px;
                color: #555;
                text-align: justify;
            }
            .highlight-box {
                background: linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%);
                border-left: 5px solid #A7C7E7;
                padding: 20px;
                margin: 20px 0;
                border-radius: 10px;
            }
            .data-list {
                background: #F8F9FA;
                padding: 20px;
                border-radius: 12px;
                margin: 15px 0;
            }
            .data-list ul {
                list-style: none;
                padding-left: 0;
            }
            .data-list li {
                padding: 8px 0;
                border-bottom: 1px solid #E0E6ED;
                color: #555;
            }
            .data-list li:before {
                content: '🔹';
                margin-right: 10px;
                color: #A7C7E7;
            }
            .rights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin: 25px 0;
            }
            .right-card {
                background: #F0F8FF;
                padding: 20px;
                border-radius: 15px;
                border-left: 4px solid #A7C7E7;
            }
            .right-card h4 {
                color: #2D5A87;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .right-card p {
                color: #666;
                font-size: 0.95rem;
            }
            .back-button {
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 12px 25px;
                border: none;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(167, 199, 231, 0.3);
                transition: transform 0.3s ease;
            }
            .back-button:hover {
                transform: translateY(-2px);
            }
            .lgpd-badge {
                display: inline-block;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .container { padding: 20px 15px; }
                .header { padding: 25px 20px; }
                .header h1 { font-size: 2rem; }
                .section { padding: 25px 20px; }
                .rights-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <a href="/" class="back-button">← Voltar ao Site</a>
        
        <div class="container">
            <div class="header">
                <div class="lgpd-badge">✓ CONFORMIDADE LGPD</div>
                <h1>Política de Privacidade</h1>
                <p>Transparência total sobre como tratamos seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD)</p>
                <p style="font-size: 0.9rem; color: #888; margin-top: 10px;"><strong>Última atualização:</strong> Janeiro 2025</p>
            </div>
            
            <div class="section">
                <h2 class="section-title">1. Quem Somos</h2>
                <p class="section-text">
                    O <strong>TeleMed Sistema</strong> é uma plataforma de telemedicina que conecta pacientes e médicos 
                    através de tecnologia avançada. Somos o controlador dos dados pessoais coletados através da nossa 
                    plataforma, atuando sempre em conformidade com a LGPD (Lei 13.709/2018).
                </p>
                <div class="highlight-box">
                    <p><strong>Razão Social:</strong> TeleMed Sistemas Médicos Ltda.</p>
                    <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
                    <p><strong>Contato DPO:</strong> dpo@telemed.com.br</p>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">2. Dados que Coletamos</h2>
                <p class="section-text">
                    Coletamos apenas os dados estritamente necessários para prestação dos nossos serviços médicos, 
                    sempre com base legal adequada e mediante seu consentimento quando aplicável.
                </p>
                
                <div class="data-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">📝 Dados de Identificação:</h4>
                    <ul>
                        <li>Nome completo, CPF, RG</li>
                        <li>Data de nascimento e gênero</li>
                        <li>Endereço completo</li>
                        <li>Telefone e e-mail</li>
                    </ul>
                </div>
                
                <div class="data-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">🩺 Dados de Saúde:</h4>
                    <ul>
                        <li>Histórico médico e exames</li>
                        <li>Sintomas e queixas relatadas</li>
                        <li>Prescrições e tratamentos</li>
                        <li>Dados de videoconsultas (áudio/vídeo)</li>
                    </ul>
                </div>
                
                <div class="data-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">💳 Dados Financeiros:</h4>
                    <ul>
                        <li>Informações de pagamento (tokenizadas)</li>
                        <li>Histórico de transações</li>
                        <li>Dados para emissão de nota fiscal</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">3. Como Usamos seus Dados</h2>
                <p class="section-text">
                    Utilizamos seus dados pessoais exclusivamente para as finalidades descritas abaixo, 
                    sempre respeitando o princípio da minimização de dados:
                </p>
                
                <div class="rights-grid">
                    <div class="right-card">
                        <h4>🏥 Prestação de Serviços Médicos</h4>
                        <p>Realização de consultas, diagnósticos, prescrições e acompanhamento médico.</p>
                    </div>
                    <div class="right-card">
                        <h4>💬 Comunicação Médica</h4>
                        <p>Videoconsultas, chat médico, notificações de consultas e resultados.</p>
                    </div>
                    <div class="right-card">
                        <h4>📊 Melhoria dos Serviços</h4>
                        <p>Análise de qualidade, desenvolvimento de IA médica e otimização da plataforma.</p>
                    </div>
                    <div class="right-card">
                        <h4>⚖️ Cumprimento Legal</h4>
                        <p>Atendimento a determinações do CFM, ANVISA e outros órgãos reguladores.</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">4. Seus Direitos (Art. 18 LGPD)</h2>
                <p class="section-text">
                    Você possui direitos específicos sobre seus dados pessoais. Para exercê-los, 
                    entre em contato com nosso DPO através do e-mail dpo@telemed.com.br:
                </p>
                
                <div class="rights-grid">
                    <div class="right-card">
                        <h4>📋 Confirmação e Acesso</h4>
                        <p>Confirmar se tratamos seus dados e acessar suas informações.</p>
                    </div>
                    <div class="right-card">
                        <h4>✏️ Correção</h4>
                        <p>Corrigir dados incompletos, inexatos ou desatualizados.</p>
                    </div>
                    <div class="right-card">
                        <h4>🗑️ Eliminação</h4>
                        <p>Solicitar a exclusão de dados desnecessários ou tratados inadequadamente.</p>
                    </div>
                    <div class="right-card">
                        <h4>📤 Portabilidade</h4>
                        <p>Receber seus dados em formato estruturado e de uso comum.</p>
                    </div>
                    <div class="right-card">
                        <h4>🚫 Oposição</h4>
                        <p>Opor-se ao tratamento baseado em legítimo interesse.</p>
                    </div>
                    <div class="right-card">
                        <h4>ℹ️ Informações</h4>
                        <p>Obter informações sobre compartilhamento e consequências da negativa.</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">5. Segurança dos Dados</h2>
                <p class="section-text">
                    Implementamos medidas técnicas e organizacionais robustas para proteger 
                    seus dados contra acessos não autorizados, vazamentos e outras violações:
                </p>
                
                <div class="highlight-box">
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 10px 0;"><strong>🔐 Criptografia End-to-End:</strong> Todas as videoconsultas são criptografadas</li>
                        <li style="margin: 10px 0;"><strong>🛡️ Infraestrutura Segura:</strong> Servidores em nuvem com certificação SOC 2</li>
                        <li style="margin: 10px 0;"><strong>👥 Controle de Acesso:</strong> Acesso restrito por função e necessidade</li>
                        <li style="margin: 10px 0;"><strong>📱 Autenticação Forte:</strong> 2FA obrigatório para médicos</li>
                        <li style="margin: 10px 0;"><strong>🔍 Monitoramento 24/7:</strong> Detecção automática de ameaças</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">6. Retenção de Dados</h2>
                <p class="section-text">
                    Mantemos seus dados apenas pelo tempo necessário para as finalidades descritas, 
                    respeitando prazos legais e regulamentares:
                </p>
                
                <div class="data-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">⏰ Prazos de Retenção:</h4>
                    <ul>
                        <li><strong>Dados médicos:</strong> 20 anos (CFM)</li>
                        <li><strong>Dados de consulta:</strong> 10 anos</li>
                        <li><strong>Dados financeiros:</strong> 5 anos (Receita Federal)</li>
                        <li><strong>Logs de acesso:</strong> 6 meses</li>
                        <li><strong>Dados de marketing:</strong> Até revogação do consentimento</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">7. Contato do DPO</h2>
                <div class="highlight-box">
                    <p><strong>Encarregado de Dados (DPO):</strong></p>
                    <p>📧 Email: dpo@telemed.com.br</p>
                    <p>📞 Telefone: (11) 3000-0000</p>
                    <p>📍 Horário: Segunda a Sexta, 9h às 18h</p>
                </div>
                <p class="section-text">
                    Para exercer seus direitos ou esclarecer dúvidas sobre tratamento de dados, 
                    entre em contato com nosso Encarregado de Dados.
                </p>
            </div>
            
            <div class="section">
                <h2 class="section-title">8. Atualizações</h2>
                <p class="section-text">
                    Esta política pode ser atualizada periodicamente. Mudanças significativas 
                    serão comunicadas por e-mail com 30 dias de antecedência.
                </p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 3. TERMOS DE USO - Condições legais de uso da plataforma
app.get('/termos-de-uso', (req, res) => {
  console.log('📄 Serving Termos de Uso for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Termos de Uso - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                line-height: 1.6; 
                color: #2D5A87; 
            }
            .container { 
                max-width: 900px; 
                margin: 0 auto; 
                padding: 40px 20px; 
            }
            .header {
                text-align: center;
                margin-bottom: 50px;
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header h1 {
                font-size: 2.5rem;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 15px;
                font-weight: 700;
            }
            .header p {
                font-size: 1.1rem;
                color: #666;
            }
            .section {
                background: white;
                border-radius: 20px;
                padding: 35px;
                margin-bottom: 30px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #E0E6ED;
            }
            .section-title {
                color: #2D5A87;
                font-size: 1.6rem;
                margin-bottom: 20px;
                font-weight: 600;
                border-bottom: 3px solid #F4D9B4;
                padding-bottom: 10px;
            }
            .section-text {
                font-size: 1rem;
                margin-bottom: 15px;
                color: #555;
                text-align: justify;
            }
            .highlight-box {
                background: linear-gradient(135deg, #FFF8DC 0%, #F4E6CD 100%);
                border-left: 5px solid #F4D9B4;
                padding: 20px;
                margin: 20px 0;
                border-radius: 10px;
            }
            .conditions-list {
                background: #F8F9FA;
                padding: 20px;
                border-radius: 12px;
                margin: 15px 0;
            }
            .conditions-list ul {
                list-style: none;
                padding-left: 0;
            }
            .conditions-list li {
                padding: 8px 0;
                border-bottom: 1px solid #E0E6ED;
                color: #555;
            }
            .conditions-list li:before {
                content: '⚖️';
                margin-right: 10px;
                color: #F4D9B4;
            }
            .responsibilities-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin: 25px 0;
            }
            .responsibility-card {
                background: #FFF8DC;
                padding: 20px;
                border-radius: 15px;
                border-left: 4px solid #F4D9B4;
            }
            .responsibility-card h4 {
                color: #2D5A87;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .responsibility-card p {
                color: #666;
                font-size: 0.95rem;
            }
            .warning-box {
                background: linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 100%);
                border-left: 5px solid #E9967A;
                padding: 20px;
                margin: 20px 0;
                border-radius: 10px;
            }
            .warning-box h4 {
                color: #C5392A;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .back-button {
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 12px 25px;
                border: none;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(167, 199, 231, 0.3);
                transition: transform 0.3s ease;
            }
            .back-button:hover {
                transform: translateY(-2px);
            }
            .legal-badge {
                display: inline-block;
                background: linear-gradient(135deg, #F4D9B4 0%, #E6C896 100%);
                color: #8B4513;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 20px;
            }
            
            @media (max-width: 768px) {
                .container { padding: 20px 15px; }
                .header { padding: 25px 20px; }
                .header h1 { font-size: 2rem; }
                .section { padding: 25px 20px; }
                .responsibilities-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <a href="/" class="back-button">← Voltar ao Site</a>
        
        <div class="container">
            <div class="header">
                <div class="legal-badge">⚖️ DOCUMENTO LEGAL</div>
                <h1>Termos de Uso</h1>
                <p>Condições gerais para uso da plataforma TeleMed Sistema</p>
                <p style="font-size: 0.9rem; color: #888; margin-top: 10px;"><strong>Última atualização:</strong> Janeiro 2025</p>
            </div>
            
            <div class="section">
                <h2 class="section-title">1. Aceitação dos Termos</h2>
                <p class="section-text">
                    Ao acessar e utilizar o <strong>TeleMed Sistema</strong>, você concorda integralmente com estes 
                    Termos de Uso. Caso não concorde com alguma disposição, deve cessar imediatamente o uso da plataforma.
                </p>
                <div class="highlight-box">
                    <p><strong>Importante:</strong> Estes termos constituem um acordo legal vinculante entre você e a TeleMed Sistemas Médicos Ltda.</p>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">2. Sobre a Plataforma</h2>
                <p class="section-text">
                    O TeleMed Sistema é uma plataforma digital que facilita a conexão entre pacientes e médicos 
                    através de tecnologia de telemedicina, sempre em conformidade com as resoluções do CFM 
                    (Conselho Federal de Medicina).
                </p>
                
                <div class="conditions-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">🏥 Serviços Oferecidos:</h4>
                    <ul>
                        <li>Videoconsultas médicas com especialistas</li>
                        <li>Sistema de agendamento e lances por consultas</li>
                        <li>Dr. AI - Triagem médica inteligente</li>
                        <li>Prescrições digitais e prontuários eletrônicos</li>
                        <li>Chat médico seguro e criptografado</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">3. Responsabilidades do Paciente</h2>
                <p class="section-text">
                    Como usuário da plataforma, você se compromete a:
                </p>
                
                <div class="responsibilities-grid">
                    <div class="responsibility-card">
                        <h4>📋 Informações Precisas</h4>
                        <p>Fornecer dados pessoais e médicos verdadeiros e atualizados.</p>
                    </div>
                    <div class="responsibility-card">
                        <h4>🔐 Confidencialidade</h4>
                        <p>Manter sigilo sobre suas credenciais de acesso à plataforma.</p>
                    </div>
                    <div class="responsibility-card">
                        <h4>💊 Seguir Orientações</h4>
                        <p>Cumprir rigorosamente as prescrições e orientações médicas.</p>
                    </div>
                    <div class="responsibility-card">
                        <h4>⚖️ Uso Adequado</h4>
                        <p>Utilizar a plataforma apenas para finalidades médicas legítimas.</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">4. Responsabilidades dos Médicos</h2>
                <p class="section-text">
                    Os profissionais médicos cadastrados devem:
                </p>
                
                <div class="conditions-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">👨‍⚕️ Obrigações Profissionais:</h4>
                    <ul>
                        <li>Possuir registro ativo no CRM</li>
                        <li>Cumprir o Código de Ética Médica</li>
                        <li>Manter atualizadas suas especialidades</li>
                        <li>Respeitar horários de consulta agendados</li>
                        <li>Garantir qualidade no atendimento</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">5. Limitações e Exclusões</h2>
                
                <div class="warning-box">
                    <h4>⚠️ IMPORTANTE - EMERGÊNCIAS MÉDICAS</h4>
                    <p>A plataforma NÃO deve ser utilizada para emergências médicas. Em casos de urgência, 
                    procure imediatamente o serviço de emergência mais próximo ou ligue 192 (SAMU).</p>
                </div>
                
                <p class="section-text">
                    O TeleMed Sistema atua como intermediário tecnológico. A responsabilidade médica 
                    permanece integralmente com o profissional que presta o atendimento.
                </p>
                
                <div class="conditions-list">
                    <h4 style="margin-bottom: 15px; color: #2D5A87;">🚫 Limitações Técnicas:</h4>
                    <ul>
                        <li>Dependência de conexão estável com internet</li>
                        <li>Limitações inerentes à consulta não presencial</li>
                        <li>Impossibilidade de exame físico direto</li>
                        <li>Restrições para procedimentos diagnósticos</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">6. Pagamentos e Reembolsos</h2>
                <p class="section-text">
                    Nossa política de pagamentos segue os seguintes princípios:
                </p>
                
                <div class="responsibilities-grid">
                    <div class="responsibility-card">
                        <h4>💳 Métodos de Pagamento</h4>
                        <p>PIX, cartão de crédito/débito e boleto bancário.</p>
                    </div>
                    <div class="responsibility-card">
                        <h4>💰 Sistema de Lances</h4>
                        <p>Pagamento realizado apenas após confirmação da consulta.</p>
                    </div>
                    <div class="responsibility-card">
                        <h4>🔄 Reembolsos</h4>
                        <p>Possíveis em casos de não comparecimento médico.</p>
                    </div>
                    <div class="responsibility-card">
                        <h4>📄 Nota Fiscal</h4>
                        <p>Emissão automática após cada consulta realizada.</p>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">7. Propriedade Intelectual</h2>
                <p class="section-text">
                    Todo o conteúdo da plataforma (textos, imagens, logos, software) é propriedade 
                    exclusiva da TeleMed Sistemas Médicos Ltda. ou de seus licenciadores.
                </p>
                <div class="highlight-box">
                    <p><strong>Proibido:</strong> Reprodução, distribuição ou uso comercial sem autorização expressa.</p>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">8. Modificações dos Termos</h2>
                <p class="section-text">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                    Mudanças significativas serão notificadas com 30 dias de antecedência.
                </p>
            </div>
            
            <div class="section">
                <h2 class="section-title">9. Lei Aplicável</h2>
                <div class="highlight-box">
                    <p><strong>Jurisdição:</strong> Estes termos são regidos pela legislação brasileira.</p>
                    <p><strong>Foro:</strong> Comarca de São Paulo - SP para dirimir controvérsias.</p>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">10. Contato</h2>
                <p class="section-text">
                    Para dúvidas sobre estes termos:
                </p>
                <p style="text-align: center; margin-top: 20px;">
                    📧 <strong>legal@telemed.com.br</strong><br>
                    📞 <strong>(11) 3000-0000</strong>
                </p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 4. FAQ - Perguntas Frequentes sobre TeleMed Sistema
app.get('/faq', (req, res) => {
  console.log('📄 Serving FAQ for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FAQ - Perguntas Frequentes | TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                line-height: 1.6; 
                color: #2D5A87; 
            }
            .container { 
                max-width: 900px; 
                margin: 0 auto; 
                padding: 40px 20px; 
            }
            .header {
                text-align: center;
                margin-bottom: 50px;
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header h1 {
                font-size: 2.5rem;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 15px;
                font-weight: 700;
            }
            .header p {
                font-size: 1.1rem;
                color: #666;
            }
            .category {
                background: white;
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 30px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #E0E6ED;
            }
            .category-title {
                color: #2D5A87;
                font-size: 1.4rem;
                margin-bottom: 25px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .category-icon {
                font-size: 1.8rem;
                padding: 8px;
                border-radius: 12px;
                background: linear-gradient(135deg, #A7C7E7 20%, #F4D9B4 100%);
            }
            .faq-item {
                border-bottom: 1px solid #F0F4F8;
                padding: 20px 0;
            }
            .faq-item:last-child {
                border-bottom: none;
            }
            .faq-question {
                font-weight: 600;
                color: #2D5A87;
                cursor: pointer;
                padding: 15px 20px;
                background: #F8F9FA;
                border-radius: 12px;
                border-left: 4px solid #A7C7E7;
                margin-bottom: 10px;
                transition: all 0.3s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .faq-question:hover {
                background: #E6F3FF;
                transform: translateX(5px);
            }
            .faq-question.active {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border-left-color: #92B4D7;
            }
            .faq-answer {
                padding: 20px;
                background: #F0F8FF;
                border-radius: 12px;
                color: #555;
                display: none;
                margin-top: 10px;
                border-left: 4px solid #E6F3FF;
            }
            .faq-answer.active {
                display: block;
                animation: fadeIn 0.3s ease-in;
            }
            .toggle-icon {
                font-size: 1.2rem;
                transition: transform 0.3s ease;
            }
            .toggle-icon.rotated {
                transform: rotate(180deg);
            }
            .back-button {
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 12px 25px;
                border: none;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(167, 199, 231, 0.3);
                transition: transform 0.3s ease;
            }
            .back-button:hover {
                transform: translateY(-2px);
            }
            .help-badge {
                display: inline-block;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 20px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @media (max-width: 768px) {
                .container { padding: 20px 15px; }
                .header { padding: 25px 20px; }
                .header h1 { font-size: 2rem; }
                .category { padding: 20px; }
                .faq-question { padding: 12px 15px; }
                .faq-answer { padding: 15px; }
            }
        </style>
    </head>
    <body>
        <a href="/" class="back-button">← Voltar ao Site</a>
        
        <div class="container">
            <div class="header">
                <div class="help-badge">❓ CENTRAL DE AJUDA</div>
                <h1>Perguntas Frequentes</h1>
                <p>Encontre respostas rápidas para as dúvidas mais comuns sobre o TeleMed Sistema</p>
            </div>
            
            <!-- CATEGORIA: CONSULTAS E AGENDAMENTOS -->
            <div class="category">
                <h2 class="category-title">
                    <span class="category-icon">🩺</span>
                    Consultas e Agendamentos
                </h2>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Como funciona o sistema de lances para consultas?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        No sistema de lances, você informa sua necessidade médica e o valor que deseja pagar. 
                        Médicos especialistas fazem propostas, e você escolhe a melhor opção. O pagamento só é 
                        realizado após a confirmação da consulta, garantindo total transparência.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Qual o valor mínimo para uma consulta por lance?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        O valor mínimo varia por especialidade: Clínica Geral R$ 120, Cardiologia R$ 180, 
                        Psiquiatria R$ 220, Dermatologia R$ 200. Valores mais altos geralmente atraem 
                        mais médicos e respostas mais rápidas.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Em quanto tempo recebo resposta dos médicos?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Emergências são atendidas em até 15 minutos. Consultas regulares recebem propostas 
                        em até 2 horas. Consultas de rotina podem levar até 24 horas para receber todas 
                        as propostas disponíveis.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Posso remarcar ou cancelar uma consulta agendada?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Sim, cancelamentos com mais de 24h de antecedência têm reembolso integral. 
                        Entre 12-24h: reembolso de 50%. Menos de 12h: sem reembolso. Reagendamentos 
                        são gratuitos com 24h de antecedência.
                    </div>
                </div>
            </div>
            
            <!-- CATEGORIA: PAGAMENTOS E REEMBOLSOS -->
            <div class="category">
                <h2 class="category-title">
                    <span class="category-icon">💳</span>
                    Pagamentos e Reembolsos
                </h2>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Quais formas de pagamento são aceitas?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Aceitamos PIX (desconto 5%), cartão de crédito/débito (Visa, Mastercard, Elo), 
                        boleto bancário e carteiras digitais (PayPal, PicPay). O pagamento é processado 
                        apenas após a confirmação da consulta.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Como funciona o reembolso se o médico não comparecer?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Reembolso automático e integral em até 2 horas úteis. Além disso, oferecemos 
                        R$ 50 de crédito como compensação pelo transtorno. Você também pode optar por 
                        reagendar com prioridade máxima.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Recebo nota fiscal das consultas?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Sim, a nota fiscal é emitida automaticamente após cada consulta e enviada 
                        por e-mail. Você pode deduzir no Imposto de Renda como despesa médica. 
                        Empresas podem solicitar nota fiscal com CNPJ.
                    </div>
                </div>
            </div>
            
            <!-- CATEGORIA: TECNOLOGIA E SUPORTE -->
            <div class="category">
                <h2 class="category-title">
                    <span class="category-icon">💻</span>
                    Tecnologia e Suporte
                </h2>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Que equipamentos preciso para a videoconsulta?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Computador, tablet ou smartphone com câmera, microfone e internet de pelo menos 
                        1MB. Recomendamos Chrome ou Safari. Testamos automaticamente sua conexão antes 
                        de cada consulta para garantir qualidade.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Como funciona o Dr. AI para triagem médica?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        O Dr. AI é uma inteligência artificial que faz perguntas sobre seus sintomas 
                        e sugere a especialidade médica adequada. Também identifica emergências e 
                        prioriza casos urgentes. É gratuito e disponível 24/7.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        E se houver problemas técnicos durante a consulta?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Nosso suporte técnico está disponível 24/7 via chat. Se a consulta for 
                        interrompida por problemas técnicos, reagendamos automaticamente sem custo 
                        adicional e oferecemos compensação quando aplicável.
                    </div>
                </div>
            </div>
            
            <!-- CATEGORIA: PRIVACIDADE E SEGURANÇA -->
            <div class="category">
                <h2 class="category-title">
                    <span class="category-icon">🔒</span>
                    Privacidade e Segurança
                </h2>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Meus dados médicos estão seguros?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Sim, utilizamos criptografia end-to-end, conformidade LGPD total, servidores 
                        certificados SOC 2 no Brasil. Nenhum dado é compartilhado sem sua autorização 
                        expressa. Auditorias de segurança mensais garantem proteção máxima.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        As videoconsultas são gravadas?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Não gravamos videoconsultas por questões de privacidade. Apenas o prontuário 
                        eletrônico é salvo com as informações médicas relevantes. Se precisar de 
                        gravação para fins específicos, deve solicitar previamente.
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFAQ(this)">
                        Posso excluir meus dados da plataforma?
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="faq-answer">
                        Sim, você pode solicitar exclusão dos dados pelo e-mail dpo@telemed.com.br. 
                        Dados médicos são mantidos por 20 anos (exigência CFM), mas dados pessoais 
                        e de marketing são excluídos em até 30 dias.
                    </div>
                </div>
            </div>
            
            <!-- CONTATO PARA OUTRAS DÚVIDAS -->
            <div class="category">
                <h2 class="category-title">
                    <span class="category-icon">📞</span>
                    Ainda tem dúvidas?
                </h2>
                <div style="text-align: center; padding: 20px 0;">
                    <p style="margin-bottom: 20px; color: #555;">
                        Não encontrou sua pergunta? Nossa equipe está disponível para ajudar:
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        <div style="background: #F8F9FA; padding: 15px; border-radius: 12px;">
                            <strong style="color: #2D5A87;">💬 Chat Online</strong><br>
                            <span style="color: #666;">24/7 Disponível</span>
                        </div>
                        <div style="background: #F8F9FA; padding: 15px; border-radius: 12px;">
                            <strong style="color: #2D5A87;">📧 E-mail</strong><br>
                            <span style="color: #666;">suporte@telemed.com.br</span>
                        </div>
                        <div style="background: #F8F9FA; padding: 15px; border-radius: 12px;">
                            <strong style="color: #2D5A87;">📞 Telefone</strong><br>
                            <span style="color: #666;">(11) 3000-0000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            function toggleFAQ(element) {
                const answer = element.nextElementSibling;
                const icon = element.querySelector('.toggle-icon');
                
                // Close all other FAQs
                document.querySelectorAll('.faq-question.active').forEach(q => {
                    if (q !== element) {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('active');
                        q.querySelector('.toggle-icon').classList.remove('rotated');
                    }
                });
                
                // Toggle current FAQ
                element.classList.toggle('active');
                answer.classList.toggle('active');
                icon.classList.toggle('rotated');
            }
        </script>
    </body>
    </html>
  `);
});

// 5. DOCTOR DASHBOARD - Dashboard médico profissional REPARADO
app.get('/doctor-dashboard', (req, res) => {
  console.log('🩺 Serving REPAIRED Doctor Dashboard for:', req.path);
  res.sendFile(path.join(__dirname, '../public/medical-dashboard-pro.html'));
});

// 6. LOGIN PAGE - Sistema de autenticação
app.get('/login', (req, res) => {
  console.log('🔐 Serving Login Page for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
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
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                width: 100%;
                text-align: center;
            }
            .stat-change {
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .stat-change.positive {
                color: #059669;
            }
            .stat-change.negative {
                color: #DC2626;
            }
            
            /* CONTENT SECTIONS */
            .content-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 30px;
            }
            .content-card {
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #E0E6ED;
            }
            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 1px solid #F0F4F8;
            }
            .card-title {
                font-size: 1.3rem;
                font-weight: 600;
                color: #2D5A87;
            }
            .consultation-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #F0F4F8;
            }
            .consultation-item:last-child {
                border-bottom: none;
            }
            .patient-info h4 {
                font-weight: 600;
                color: #2D5A87;
                margin-bottom: 3px;
            }
            .patient-info p {
                color: #666;
                font-size: 0.9rem;
            }
            .consultation-status {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            .status-confirmed {
                background: #E6F7FF;
                color: #0891B2;
            }
            .status-pending {
                background: #FFF7ED;
                color: #EA580C;
            }
            .status-completed {
                background: #ECFDF5;
                color: #059669;
            }
            
            /* QUICK ACTIONS */
            .quick-actions {
                display: grid;
                grid-template-columns: 1fr;
                gap: 15px;
            }
            .quick-action {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #F8F9FA;
                border-radius: 12px;
                text-decoration: none;
                color: #2D5A87;
                transition: all 0.3s ease;
                border: 1px solid #E0E6ED;
            }
            .quick-action:hover {
                background: #E6F3FF;
                transform: translateX(5px);
            }
            .quick-action i {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
            }
            
            /* RESPONSIVE */
            @media (max-width: 768px) {
                .dashboard-container {
                    grid-template-columns: 1fr;
                }
                .sidebar {
                    display: none;
                }
                .content-grid {
                    grid-template-columns: 1fr;
                }
                .stats-grid {
                    grid-template-columns: 1fr;
                }
                .main-header {
                    flex-direction: column;
                    text-align: center;
                    gap: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="dashboard-container">
            <!-- SIDEBAR -->
            <div class="sidebar">
                <div class="sidebar-header">
                    <h2>TeleMed</h2>
                    <p>Dashboard Médico</p>
                </div>
                
                <nav class="sidebar-nav">
                    <div class="nav-section">
                        <div class="nav-section-title">Principal</div>
                        <a href="#" class="nav-item active">
                            <i class="fas fa-home"></i>
                            Dashboard
                        </a>
                        <a href="#" class="nav-item">
                            <i class="fas fa-users"></i>
                            Fila de Pacientes
                            <span class="nav-badge">9</span>
                        </a>
                        <a href="#" class="nav-item">
                            <i class="fas fa-calendar"></i>
                            Agenda do Dia
                            <span class="nav-badge">8</span>
                        </a>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Consultas</div>
                        <a href="/videoconsulta.html" class="nav-item">
                            <i class="fas fa-video"></i>
                            Videoconsultas
                            <span class="nav-badge">2</span>
                        </a>
                        <a href="#" class="nav-item">
                            <i class="fas fa-clock"></i>
                            Agendadas
                        </a>
                        <a href="#" class="nav-item">
                            <i class="fas fa-history"></i>
                            Histórico
                        </a>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Ferramentas</div>
                        <a href="#" class="nav-item">
                            <i class="fas fa-prescription"></i>
                            Prescrições
                        </a>
                        <a href="/dr-ai.html" class="nav-item">
                            <i class="fas fa-robot"></i>
                            Dr. AI
                        </a>
                        <a href="#" class="nav-item">
                            <i class="fas fa-file-medical"></i>
                            Prontuários
                        </a>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-section-title">Configurações</div>
                        <a href="#" class="nav-item">
                            <i class="fas fa-user"></i>
                            Perfil Médico
                        </a>
                        <a href="#" class="nav-item">
                            <i class="fas fa-bell"></i>
                            Notificações
                            <span class="nav-badge">3</span>
                        </a>
                        <a href="/" class="nav-item">
                            <i class="fas fa-arrow-left"></i>
                            Voltar ao Site
                        </a>
                    </div>
                </nav>
            </div>
            
            <!-- MAIN CONTENT -->
            <div class="main-content">
                <div class="main-header">
                    <div class="welcome-section">
                        <h1>Bom dia, Dr. Carlos Mendes! 👨‍⚕️</h1>
                        <p>Você tem 3 consultas pendentes hoje e 5 já concluídas.</p>
                    </div>
                    <div class="header-actions">
                        <a href="/videoconsulta.html" class="action-btn">
                            <i class="fas fa-video"></i>
                            Nova Videoconsulta
                        </a>
                        <a href="/consulta-por-valor.html" class="action-btn">
                            <i class="fas fa-gavel"></i>
                            Ver Lances
                        </a>
                    </div>
                </div>
                
                <!-- STATS CARDS -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Pacientes Ativos</span>
                            <div class="stat-icon" style="background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="stat-value">156</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +12% este mês
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Consultas Hoje</span>
                            <div class="stat-icon" style="background: linear-gradient(135deg, #F4D9B4 0%, #E6C896 100%);">
                                <i class="fas fa-calendar-day"></i>
                            </div>
                        </div>
                        <div class="stat-value">8</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +8% vs ontem
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Receita Hoje</span>
                            <div class="stat-icon" style="background: linear-gradient(135deg, #E9967A 0%, #D4825A 100%);">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                        </div>
                        <div class="stat-value">R$ 1.850</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +25% vs ontem
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Avaliação</span>
                            <div class="stat-icon" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                        <div class="stat-value">4.9</div>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            +0.1 este mês
                        </div>
                    </div>
                </div>
                
                <!-- CONTENT GRID -->
                <div class="content-grid">
                    <!-- CONSULTAS DO DIA -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3 class="card-title">Consultas de Hoje</h3>
                            <a href="#" class="action-btn" style="padding: 8px 16px; font-size: 0.9rem;">
                                <i class="fas fa-plus"></i>
                                Nova Consulta
                            </a>
                        </div>
                        
                        <div class="consultation-item">
                            <div class="patient-info">
                                <h4>Maria Silva</h4>
                                <p>09:00 - Cardiologia - Videoconsulta</p>
                            </div>
                            <span class="consultation-status status-confirmed">Confirmada</span>
                        </div>
                        
                        <div class="consultation-item">
                            <div class="patient-info">
                                <h4>João Santos</h4>
                                <p>10:30 - Clínica Geral - Presencial</p>
                            </div>
                            <span class="consultation-status status-pending">Aguardando</span>
                        </div>
                        
                        <div class="consultation-item">
                            <div class="patient-info">
                                <h4>Ana Costa</h4>
                                <p>14:00 - Cardiologia - Videoconsulta</p>
                            </div>
                            <span class="consultation-status status-confirmed">Confirmada</span>
                        </div>
                        
                        <div class="consultation-item">
                            <div class="patient-info">
                                <h4>Pedro Lima</h4>
                                <p>15:30 - Retorno - Presencial</p>
                            </div>
                            <span class="consultation-status status-pending">Aguardando</span>
                        </div>
                        
                        <div class="consultation-item">
                            <div class="patient-info">
                                <h4>Carla Oliveira</h4>
                                <p>16:00 - Exames - Videoconsulta</p>
                            </div>
                            <span class="consultation-status status-completed">Concluída</span>
                        </div>
                    </div>
                    
                    <!-- AÇÕES RÁPIDAS -->
                    <div class="content-card">
                        <div class="card-header">
                            <h3 class="card-title">Ações Rápidas</h3>
                        </div>
                        
                        <div class="quick-actions">
                            <a href="/videoconsulta.html" class="quick-action">
                                <i class="fas fa-video"></i>
                                <div>
                                    <strong>Iniciar Videoconsulta</strong>
                                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Atender paciente agora</p>
                                </div>
                            </a>
                            
                            <a href="#" class="quick-action">
                                <i class="fas fa-user-injured"></i>
                                <div>
                                    <strong>Emergências</strong>
                                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Casos urgentes</p>
                                </div>
                            </a>
                            
                            <a href="#" class="quick-action">
                                <i class="fas fa-prescription"></i>
                                <div>
                                    <strong>Prescrições</strong>
                                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Receitas digitais</p>
                                </div>
                            </a>
                            
                            <a href="#" class="quick-action">
                                <i class="fas fa-user-plus"></i>
                                <div>
                                    <strong>Cadastrar Paciente</strong>
                                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Novo cadastro</p>
                                </div>
                            </a>
                            
                            <a href="#" class="quick-action">
                                <i class="fas fa-chart-bar"></i>
                                <div>
                                    <strong>Relatórios</strong>
                                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Análises e métricas</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            // Add active state to navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (this.getAttribute('href') === '#') {
                        e.preventDefault();
                    }
                    
                    // Remove active from all items
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    
                    // Add active to clicked item
                    this.classList.add('active');
                });
            });
            
            // Auto-refresh badges (simulate real-time updates)
            setInterval(() => {
                const badges = document.querySelectorAll('.nav-badge');
                badges.forEach(badge => {
                    if (Math.random() > 0.8) {
                        badge.style.animation = 'pulse 0.5s ease-in-out';
                        setTimeout(() => {
                            badge.style.animation = '';
                        }, 500);
                    }
                });
            }, 10000);
            
            console.log('🩺 Dashboard Médico TeleMed carregado com sucesso!');
        </script>
        
        <style>
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        </style>
    </body>
    </html>
  `);
});

// 6. LOGIN PAGE - Sistema de autenticação
app.get('/login', (req, res) => {
  console.log('🔐 Serving Login Page for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
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
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 400px;
                text-align: center;
            }
            .login-header {
                margin-bottom: 30px;
            }
            .login-header h1 {
                color: #2D5A87;
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 10px;
            }
            .login-header p {
                color: #666;
                font-size: 1rem;
            }
            .form-group {
                margin-bottom: 20px;
                text-align: left;
            }
            .form-group label {
                display: block;
                color: #2D5A87;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .form-group input {
                width: 100%;
                padding: 15px;
                border: 2px solid #E0E6ED;
                border-radius: 12px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .form-group input:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            .btn-primary {
                width: 100%;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 15px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
                margin-bottom: 20px;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(167, 199, 231, 0.4);
            }
            .user-type-selector {
                display: flex;
                margin-bottom: 20px;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid #E0E6ED;
            }
            .user-type-option {
                flex: 1;
                padding: 12px;
                background: #F8F9FA;
                cursor: pointer;
                text-align: center;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .user-type-option.active {
                background: #A7C7E7;
                color: white;
            }
            .demo-accounts {
                background: #F0F9FF;
                border: 1px solid #A7C7E7;
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
                text-align: left;
            }
            .demo-accounts h4 {
                color: #2D5A87;
                margin-bottom: 10px;
                font-size: 0.9rem;
            }
            .demo-accounts p {
                font-size: 0.8rem;
                color: #666;
                margin: 5px 0;
            }
            .back-button {
                position: absolute;
                top: 20px;
                left: 20px;
                background: rgba(255,255,255,0.9);
                color: #2D5A87;
                padding: 10px 15px;
                border: none;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            .back-button:hover {
                background: white;
                transform: translateY(-2px);
            }
            .success-message, .error-message {
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 15px;
                font-weight: 600;
                display: none;
            }
            .success-message {
                background: #E6F7E6;
                color: #059669;
                border: 1px solid #059669;
            }
            .error-message {
                background: #FFE6E6;
                color: #DC2626;
                border: 1px solid #DC2626;
            }
        </style>
    </head>
    <body>
        <a href="/" class="back-button">
            <i class="fas fa-arrow-left"></i>
            Voltar ao Site
        </a>
        
        <div class="login-container">
            <div class="login-header">
                <h1>🩺 Login TeleMed</h1>
                <p>Acesse sua conta médica ou de paciente</p>
            </div>
            
            <div class="user-type-selector">
                <div class="user-type-option active" data-type="patient">
                    <i class="fas fa-user"></i> Paciente
                </div>
                <div class="user-type-option" data-type="doctor">
                    <i class="fas fa-user-md"></i> Médico
                </div>
            </div>
            
            <div class="demo-accounts">
                <h4>📋 Contas de Demonstração:</h4>
                <p><strong>Paciente:</strong> paciente@demo.com / 123456</p>
                <p><strong>Médico:</strong> medico@demo.com / 123456</p>
            </div>
            
            <form id="loginForm">
                <div class="success-message" id="successMessage"></div>
                <div class="error-message" id="errorMessage"></div>
                
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="email" name="email" placeholder="seu@email.com" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
                </div>
                
                <button type="submit" class="btn-primary">
                    <i class="fas fa-sign-in-alt"></i>
                    Entrar
                </button>
            </form>
            
            <p style="color: #666; font-size: 0.9rem;">
                Não tem conta? <a href="/register" style="color: #A7C7E7; text-decoration: none; font-weight: 600;">Cadastre-se aqui</a>
            </p>
        </div>
        
        <script>
            let selectedUserType = 'patient';
            
            // User type selection
            document.querySelectorAll('.user-type-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.user-type-option').forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    selectedUserType = this.dataset.type;
                });
            });
            
            // Form submission
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Hide previous messages
                document.getElementById('successMessage').style.display = 'none';
                document.getElementById('errorMessage').style.display = 'none';
                
                // Demo authentication
                if ((email === 'paciente@demo.com' || email === 'medico@demo.com') && password === '123456') {
                    document.getElementById('successMessage').textContent = 'Login realizado com sucesso! Redirecionando...';
                    document.getElementById('successMessage').style.display = 'block';
                    
                    setTimeout(() => {
                        if (email === 'medico@demo.com' || selectedUserType === 'doctor') {
                            window.location.href = '/doctor-dashboard';
                        } else {
                            window.location.href = '/patient-dashboard';
                        }
                    }, 1500);
                } else {
                    document.getElementById('errorMessage').textContent = 'E-mail ou senha incorretos. Use as contas de demonstração.';
                    document.getElementById('errorMessage').style.display = 'block';
                }
            });
            
            console.log('🔐 Sistema de Login TeleMed carregado!');
        </script>
    </body>
    </html>
  `);
});

// 7. AGENDAMENTO PAGE - Sistema de agendamento com especialidades
app.get('/agendamento', (req, res) => {
  console.log('📅 Serving Agendamento Page for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agendamento - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', Arial, sans-serif; 
                background: linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            .header h1 {
                color: #2D5A87;
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 10px;
            }
            .header p {
                color: #666;
                font-size: 1.1rem;
            }
            .form-section {
                margin-bottom: 30px;
                padding: 25px;
                border: 2px solid #E0E6ED;
                border-radius: 15px;
                background: #FAFBFC;
            }
            .form-section h2 {
                color: #2D5A87;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                color: #2D5A87;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .form-group select, .form-group input {
                width: 100%;
                padding: 15px;
                border: 2px solid #E0E6ED;
                border-radius: 12px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .form-group select:focus, .form-group input:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            .btn-primary {
                width: 100%;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 18px;
                border: none;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
                margin-top: 30px;
            }
            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(167, 199, 231, 0.4);
            }
            .back-button {
                position: absolute;
                top: 20px;
                left: 20px;
                background: rgba(255,255,255,0.9);
                color: #2D5A87;
                padding: 10px 15px;
                border: none;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            .back-button:hover {
                background: white;
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <a href="/" class="back-button">
            <i class="fas fa-arrow-left"></i>
            Voltar ao Site
        </a>
        
        <div class="container">
            <div class="header">
                <h1>📅 Agendar Consulta</h1>
                <p>Preencha os dados para agendar sua consulta médica</p>
            </div>
            
            <form id="agendamentoForm">
                <div class="form-section">
                    <h2><i class="fas fa-stethoscope"></i> Especialidade Médica</h2>
                    
                    <div class="form-group">
                        <label for="especialidade">Escolha a especialidade:</label>
                        <select id="especialidade" name="especialidade" required>
                            <option value="">Selecione uma especialidade</option>
                            <option value="cardiologia">Cardiologia - Doenças do coração</option>
                            <option value="clinica-geral">Clínica Geral - Consultas gerais</option>
                            <option value="pediatria">Pediatria - Cuidados infantis</option>
                            <option value="dermatologia">Dermatologia - Problemas de pele</option>
                            <option value="psiquiatria">Psiquiatria - Saúde mental</option>
                            <option value="ginecologia">Ginecologia - Saúde feminina</option>
                            <option value="ortopedia">Ortopedia - Ossos e articulações</option>
                            <option value="psicoterapia">Psicoterapia - Terapia</option>
                            <option value="nutricao">Nutrição - Alimentação</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-section">
                    <h2><i class="fas fa-user"></i> Seus Dados</h2>
                    
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
                        <textarea id="sintomas" name="sintomas" rows="4" placeholder="Descreva brevemente o que está sentindo..." style="width: 100%; padding: 15px; border: 2px solid #E0E6ED; border-radius: 12px; resize: vertical;"></textarea>
                    </div>
                </div>
                
                <button type="submit" class="btn-primary">
                    <i class="fas fa-calendar-plus"></i>
                    Agendar Consulta
                </button>
            </form>
        </div>
        
        <script>
            // Auto-detect specialty from URL
            const urlParams = new URLSearchParams(window.location.search);
            const especialidadeParam = urlParams.get('especialidade');
            if (especialidadeParam) {
                document.getElementById('especialidade').value = especialidadeParam;
            }
            
            // Phone mask
            document.getElementById('telefone').addEventListener('input', function() {
                let value = this.value.replace(/\\D/g, '');
                value = value.replace(/^(\\d{2})(\\d)/g, '($1) $2');
                value = value.replace(/(\\d{5})(\\d)/, '$1-$2');
                this.value = value;
            });
            
            // Form submission
            document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                if (!data.especialidade || !data.nome || !data.email) {
                    alert('Por favor, preencha todos os campos obrigatórios!');
                    return;
                }
                
                alert(\`Agendamento enviado com sucesso!\\n\\nEspecialidade: \${data.especialidade}\\nPaciente: \${data.nome}\\n\\nRedirecionando para sistema de lances...\`);
                
                // Redirect to bidding system
                window.location.href = '/patient-bidding';
            });
            
            console.log('📅 Sistema de Agendamento TeleMed carregado!');
        </script>
    </body>
    </html>
  `);
});

// ÁREA MÉDICA - SISTEMA DE SEGURANÇA E AUTENTICAÇÃO

// 1. Área Médica (Porteiro)
app.get('/area-medica.html', (req, res) => {
  console.log('🏥 Serving Área Médica (Porteiro) for:', req.path);
  res.sendFile(path.join(__dirname, '../public/area-medica.html'));
});

// 2. Login Médico
app.get('/login-medico.html', (req, res) => {
  console.log('🔐 Serving Login Médico for:', req.path);
  res.sendFile(path.join(__dirname, '../public/login-medico.html'));
});

// 3. Cadastro Médico
app.get('/medico-cadastro.html', (req, res) => {
  console.log('📋 Serving Cadastro Médico for:', req.path);
  res.sendFile(path.join(__dirname, '../public/medico-cadastro.html'));
});

// 4. Agenda Médico (Protegida)
app.get('/agenda-medico.html', (req, res) => {
  console.log('📅 Serving Agenda Médico for:', req.path);
  res.sendFile(path.join(__dirname, '../public/agenda-medico.html'));
});

// 5. Estatísticas Médico (Protegida)
app.get('/estatisticas-medico.html', (req, res) => {
  console.log('📊 Serving Estatísticas Médico for:', req.path);
  res.sendFile(path.join(__dirname, '../public/estatisticas-medico.html'));
});

// 4. Proteção de URLs médicas - Middleware de segurança
const protectedMedicalRoutes = [
  '/doctor-dashboard',
  '/agenda-medico.html',
  '/estatisticas-medico.html',
  '/pagamentos-medicos.html'
];

// Middleware para verificar autenticação médica (simulação)
function checkMedicalAuth(req, res, next) {
  // Em produção, verificaria JWT token ou sessão
  // Por agora, redireciona para área médica
  console.log(`🔒 Verificando acesso médico para: ${req.path}`);
  
  // Para demonstração, permite acesso direto
  // Em produção, faria verificação real de autenticação
  next();
}

// Aplicar middleware de segurança nas rotas protegidas
app.use(protectedMedicalRoutes, checkMedicalAuth);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] 🩺 TeleMed Sistema v12.2.0`);
  console.log(`[${new Date().toISOString()}] 🌐 Servidor rodando na porta ${PORT}`);
  console.log(`[${new Date().toISOString()}] 🔗 Acesso: http://localhost:${PORT}`);
});

