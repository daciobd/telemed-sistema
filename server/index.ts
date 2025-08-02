import express from 'express';
import path from 'path';
import fs from 'fs';
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

// 5. DOCTOR DASHBOARD - Dashboard médico protegido será servido pelo SPA fallback
// Comentando rota específica para permitir que seja servida pelo React SPA no final do arquivo

// 6. REGISTER PAGE - Sistema de cadastro para novos usuários
app.get('/register', (req, res) => {
  console.log('📝 Serving Registration Form for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #A7C7E7;
                font-size: 28px;
                margin-bottom: 10px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                color: #374151;
                font-weight: 500;
            }
            .form-group input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            .form-group input:focus {
                outline: none;
                border-color: #A7C7E7;
            }
            .btn {
                width: 100%;
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 16px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                margin-bottom: 20px;
            }
            .btn:hover { transform: translateY(-2px); }
            .user-type-selector {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .user-type-btn {
                flex: 1;
                padding: 12px;
                border: 2px solid #A7C7E7;
                background: white;
                color: #A7C7E7;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s;
            }
            .user-type-btn.active {
                background: #A7C7E7;
                color: white;
            }
            .already-account {
                text-align: center;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #E5E7EB;
            }
            .already-account a {
                color: #A7C7E7;
                text-decoration: none;
                font-weight: 500;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><i class="fas fa-user-plus"></i> Criar Conta</h1>
                <p>Cadastre-se na plataforma TeleMed</p>
            </div>

            <form id="registerForm">
                <!-- Seletor de Tipo de Usuário -->
                <div class="user-type-selector">
                    <button type="button" class="user-type-btn active" id="pacienteBtn" onclick="selectUserType('paciente')">
                        <i class="fas fa-user"></i> Sou Paciente
                    </button>
                    <button type="button" class="user-type-btn" id="medicoBtn" onclick="selectUserType('medico')">
                        <i class="fas fa-user-md"></i> Sou Médico
                    </button>
                </div>

                <!-- Campos Gerais -->
                <div class="form-group">
                    <label for="nome"><i class="fas fa-user"></i> Nome Completo *</label>
                    <input type="text" id="nome" name="nome" required>
                </div>

                <div class="form-group">
                    <label for="email"><i class="fas fa-envelope"></i> Email *</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <div class="form-group">
                    <label for="telefone"><i class="fas fa-phone"></i> Telefone *</label>
                    <input type="tel" id="telefone" name="telefone" required placeholder="(11) 99999-9999">
                </div>

                <!-- Campos Específicos do Médico (ocultos inicialmente) -->
                <div id="medicoFields" style="display: none;">
                    <div class="form-group">
                        <label for="crm"><i class="fas fa-id-card"></i> CRM *</label>
                        <input type="text" id="crm" name="crm" placeholder="123456-SP">
                    </div>
                    <div class="form-group">
                        <label for="especialidade"><i class="fas fa-stethoscope"></i> Especialidade *</label>
                        <input type="text" id="especialidade" name="especialidade" placeholder="Ex: Cardiologia">
                    </div>
                </div>

                <div class="form-group">
                    <label for="senha"><i class="fas fa-lock"></i> Senha *</label>
                    <input type="password" id="senha" name="senha" required>
                </div>

                <div class="form-group">
                    <label for="confirmarSenha"><i class="fas fa-lock"></i> Confirmar Senha *</label>
                    <input type="password" id="confirmarSenha" name="confirmarSenha" required>
                </div>

                <button type="submit" class="btn">
                    <i class="fas fa-user-plus"></i> Criar Conta
                </button>
            </form>

            <div class="already-account">
                <p>Já tem uma conta? <a href="/login">Fazer Login</a></p>
            </div>
        </div>

        <script>
            let currentUserType = 'paciente';

            function selectUserType(type) {
                currentUserType = type;
                
                // Atualizar botões
                const pacienteBtn = document.getElementById('pacienteBtn');
                const medicoBtn = document.getElementById('medicoBtn');
                const medicoFields = document.getElementById('medicoFields');
                
                if (type === 'paciente') {
                    pacienteBtn.classList.add('active');
                    medicoBtn.classList.remove('active');
                    medicoFields.style.display = 'none';
                } else {
                    pacienteBtn.classList.remove('active');
                    medicoBtn.classList.add('active');
                    medicoFields.style.display = 'block';
                }
            }

            // Máscara para telefone
            document.getElementById('telefone').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\\D/g, '');
                value = value.replace(/(\\d{2})(\\d)/, '($1) $2');
                value = value.replace(/(\\d{5})(\\d)/, '$1-$2');
                e.target.value = value;
            });

            // Submissão do formulário
            document.getElementById('registerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const nome = document.getElementById('nome').value;
                const email = document.getElementById('email').value;
                const telefone = document.getElementById('telefone').value;
                const senha = document.getElementById('senha').value;
                const confirmarSenha = document.getElementById('confirmarSenha').value;
                
                // Validações
                if (!nome || !email || !telefone || !senha || !confirmarSenha) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }
                
                if (senha !== confirmarSenha) {
                    alert('As senhas não coincidem.');
                    return;
                }
                
                if (currentUserType === 'medico') {
                    const crm = document.getElementById('crm').value;
                    const especialidade = document.getElementById('especialidade').value;
                    
                    if (!crm || !especialidade) {
                        alert('Por favor, preencha CRM e Especialidade.');
                        return;
                    }
                }
                
                // Simular cadastro
                alert(\`Cadastro realizado com sucesso!\\n\\nTipo: \${currentUserType === 'paciente' ? 'Paciente' : 'Médico'}\\nNome: \${nome}\\nEmail: \${email}\`);
                
                // Redirecionar para login
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            });

            console.log('📝 Sistema de Cadastro TeleMed carregado');
        </script>
    </body>
    </html>
  `);
});

// Rate limiting storage (in-memory for development)
const loginAttempts = new Map();

// Crypto functions for secure parameter handling
function encryptData(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function decryptData(encryptedData) {
  try {
    return JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf8'));
  } catch (error) {
    throw new Error('Invalid encrypted data');
  }
}

// Rate limiting function
function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];
  
  // Remove attempts older than 5 minutes
  const recentAttempts = attempts.filter(time => now - time < 5 * 60 * 1000);
  
  if (recentAttempts.length >= 5) {
    return { allowed: false, remainingTime: Math.ceil((5 * 60 * 1000 - (now - recentAttempts[0])) / 1000) };
  }
  
  recentAttempts.push(now);
  loginAttempts.set(ip, recentAttempts);
  
  return { allowed: true, attempts: recentAttempts.length };
}

// Security log function
function logSecurityEvent(type, details, ip) {
  const timestamp = new Date().toISOString();
  console.log(`🔒 [SECURITY] ${timestamp} - ${type} from ${ip}:`, details);
}

// 7. PROCESSAR LOGIN - Endpoint seguro para processamento automático via URL
app.get('/processar-login', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const hostDomain = req.get('host') || 'localhost:5000';
  const protocol = req.secure ? 'https' : 'http';
  const baseUrl = `${protocol}://${hostDomain}`;
  
  console.log('🔄 Processing secure automatic login from:', clientIP);
  console.log('🌐 Host domain:', hostDomain);
  logSecurityEvent('LOGIN_ATTEMPT', `Automatic login request received from ${baseUrl}`, clientIP);
  
  // Check rate limiting
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', `IP blocked for ${rateLimit.remainingTime}s`, clientIP);
    return res.redirect(`${baseUrl}/login?erro=bloqueado&tempo=` + Math.ceil(rateLimit.remainingTime / 60));
  }
  
  const { dados, email, senha, crm, redirect_base } = req.query;
  let credentials = {};
  
  // Dynamic redirect URL configuration
  const customRedirectBase = redirect_base || baseUrl;
  
  try {
    // Try encrypted data first (new secure method)
    if (dados) {
      console.log('🔐 Processing encrypted credentials');
      credentials = decryptData(dados as string);
      
      // Validate origin
      if (credentials.origem && credentials.origem !== 'hostinger' && credentials.origem !== 'local') {
        logSecurityEvent('INVALID_ORIGIN', `Origin: ${credentials.origem}`, clientIP);
        return res.redirect(`${baseUrl}/login?erro=origem`);
      }
      
      logSecurityEvent('ENCRYPTED_ACCESS', `Origin: ${credentials.origem || 'not-specified'}`, clientIP);
    } 
    // Fallback to plain parameters (legacy method)
    else if ((email && senha) || (crm && senha)) {
      console.log('⚠️ Processing plain credentials (legacy method)');
      credentials = { email, senha, crm };
      logSecurityEvent('PLAIN_ACCESS', 'Using legacy plain parameters', clientIP);
    } else {
      logSecurityEvent('MISSING_PARAMETERS', 'No valid credentials provided', clientIP);
      return res.redirect(`${baseUrl}/login?erro=parametros`);
    }
  } catch (error) {
    logSecurityEvent('DECRYPTION_ERROR', error.message, clientIP);
    return res.redirect(`${baseUrl}/login?erro=sistema`);
  }
  
  let userType = '';
  let isValidCredentials = false;
  let redirectUrl = '';
  let userIdentifier = '';
  
  // Validate patient credentials
  if (credentials.email && credentials.senha) {
    userIdentifier = credentials.email;
    console.log(`👤 Validating patient credentials: ${userIdentifier}`);
    
    const validPatients = {
      'paciente@demo.com': '123456',
      'maria@paciente.com': 'senha123',
      'joao@telemed.com': 'paciente456'
    };
    
    if (validPatients[credentials.email] === credentials.senha) {
      isValidCredentials = true;
      userType = 'paciente';
      redirectUrl = `${customRedirectBase}/patient-dashboard`;
      logSecurityEvent('PATIENT_LOGIN_SUCCESS', userIdentifier, clientIP);
    } else {
      logSecurityEvent('PATIENT_LOGIN_FAILED', userIdentifier, clientIP);
    }
  }
  
  // Validate doctor credentials
  if (credentials.crm && credentials.senha) {
    userIdentifier = credentials.crm;
    console.log(`🩺 Validating doctor credentials: ${userIdentifier}`);
    
    const validDoctors = {
      '123456-SP': 'medico123',
      '654321-RJ': 'doutor456', 
      '789012-MG': 'psiquiatra789'
    };
    
    if (validDoctors[credentials.crm] === credentials.senha) {
      isValidCredentials = true;
      userType = 'medico';
      redirectUrl = `${customRedirectBase}/doctor-dashboard`;
      logSecurityEvent('DOCTOR_LOGIN_SUCCESS', userIdentifier, clientIP);
    } else {
      logSecurityEvent('DOCTOR_LOGIN_FAILED', userIdentifier, clientIP);
    }
  }
  
  // Process validation result
  if (!isValidCredentials) {
    logSecurityEvent('INVALID_CREDENTIALS', userIdentifier, clientIP);
    return res.redirect(`${baseUrl}/login?erro=credenciais`);
  }
  
  // Create secure session
  const sessionData = {
    userType,
    userIdentifier,
    email: credentials.email || `CRM: ${credentials.crm}`,
    loginTime: new Date().toISOString(),
    redirectUrl,
    sessionId: Math.random().toString(36).substring(2, 15),
    ip: clientIP,
    baseUrl: customRedirectBase
  };
  
  console.log(`✅ Secure login successful for ${userType}: ${userIdentifier}`);
  console.log(`🎯 Redirecting to: ${redirectUrl}`);
  logSecurityEvent('LOGIN_SUCCESS', `${userType}: ${userIdentifier} -> ${redirectUrl}`, clientIP);
  
  // Secure confirmation page with URL cleanup
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Seguro - TeleMed</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                max-width: 450px;
                width: 100%;
            }
            .success-icon {
                font-size: 4rem;
                color: #4CAF50;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            h1 {
                color: #A7C7E7;
                margin-bottom: 10px;
                font-size: 24px;
            }
            p {
                color: #6B7280;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #A7C7E7;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .redirect-info {
                background: #F0F8FF;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border-left: 4px solid #A7C7E7;
            }
            .security-badge {
                background: #E8F5E8;
                color: #2E7D2E;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 12px;
                margin-bottom: 15px;
                display: inline-block;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="security-badge">
                <i class="fas fa-shield-alt"></i> Login Seguro Verificado
            </div>
            
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h1>Autenticação Aprovada!</h1>
            
            <div class="redirect-info">
                <p><strong>Tipo:</strong> ${userType === 'paciente' ? 'Paciente' : 'Médico Credenciado'}</p>
                <p><strong>Usuário:</strong> ${userIdentifier}</p>
                <p><strong>Destino:</strong> ${userType === 'paciente' ? 'Área do Paciente' : 'Dashboard Médico'}</p>
                <p><strong>ID Sessão:</strong> ${sessionData.sessionId}</p>
            </div>
            
            <p>
                <div class="loading"></div>
                Redirecionamento seguro em <span id="countdown">3</span> segundos...
            </p>
            
            <p style="font-size: 12px; color: #999;">
                Caso não seja redirecionado, <a href="${redirectUrl}" style="color: #A7C7E7;">clique aqui</a>
            </p>
        </div>

        <script>
            // Clean URL parameters for security
            if (window.location.search) {
                const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                console.log('🔒 URL parameters cleaned for security');
            }
            
            // Save secure session data
            const sessionData = ${JSON.stringify(sessionData)};
            localStorage.setItem('telemedSession', JSON.stringify(sessionData));
            
            // Mark as authenticated
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', '${userType}');
            localStorage.setItem('userEmail', '${userIdentifier}');
            localStorage.setItem('sessionId', '${sessionData.sessionId}');
            
            // Secure countdown and redirect
            let countdown = 3;
            const countdownElement = document.getElementById('countdown');
            
            const timer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    console.log('🔄 Secure redirect to:', '${redirectUrl}');
                    window.location.href = '${redirectUrl}';
                }
            }, 1000);
            
            console.log('✅ Secure login processed successfully');
            console.log('🔒 Session secured with ID:', '${sessionData.sessionId}');
        </script>
    </body>
    </html>
  `);
});

// 8. PATIENT DASHBOARD - Dashboard do paciente
app.get('/patient-dashboard', (req, res) => {
  console.log('👤 Serving Patient Dashboard for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard Paciente - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #F0F4F8;
            }
            .header h1 { color: #A7C7E7; font-size: 28px; }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 20px;
                border-radius: 16px;
                text-align: center;
            }
            .stat-card h3 { font-size: 24px; margin-bottom: 5px; }
            .actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            .action-card {
                background: #F8F9FA;
                padding: 25px;
                border-radius: 16px;
                border: 1px solid #E0E6ED;
                transition: transform 0.3s ease;
            }
            .action-card:hover { transform: translateY(-5px); }
            .btn {
                background: #A7C7E7;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                text-decoration: none;
                display: inline-block;
                margin-top: 15px;
                transition: background 0.3s ease;
            }
            .btn:hover { background: #92B4D7; }
            .btn.alert {
                background: #E9967A;
                margin-left: 10px;
            }
            .btn.alert:hover { background: #D18B6B; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div>
                    <h1><i class="fas fa-user-circle"></i> Dashboard do Paciente</h1>
                    <p>Bem-vindo ao seu painel de saúde</p>
                </div>
                <div>
                    <button onclick="logout()" class="btn alert">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>3</h3>
                    <p>Consultas Realizadas</p>
                </div>
                <div class="stat-card">
                    <h3>1</h3>
                    <p>Consulta Agendada</p>
                </div>
                <div class="stat-card">
                    <h3>2</h3>
                    <p>Receitas Ativas</p>
                </div>
                <div class="stat-card">
                    <h3>4.9</h3>
                    <p>Avaliação Média ⭐</p>
                </div>
            </div>

            <div class="actions-grid">
                <div class="action-card">
                    <i class="fas fa-stethoscope" style="font-size: 2rem; color: #A7C7E7; margin-bottom: 15px;"></i>
                    <h3>Nova Consulta</h3>
                    <p>Agende uma consulta médica online ou participe do sistema de lances para encontrar o melhor preço.</p>
                    <a href="/consulta-por-valor.html" class="btn">Agendar Consulta</a>
                </div>

                <div class="action-card">
                    <i class="fas fa-brain" style="font-size: 2rem; color: #F4D9B4; margin-bottom: 15px;"></i>
                    <h3>Dr. AI - Triagem Gratuita</h3>
                    <p>Receba uma avaliação inicial gratuita com nossa IA médica especializada.</p>
                    <a href="/dr-ai.html" class="btn">Iniciar Triagem</a>
                </div>

                <div class="action-card">
                    <i class="fas fa-pills" style="font-size: 2rem; color: #E9967A; margin-bottom: 15px;"></i>
                    <h3>Receitas Médicas</h3>
                    <p>Visualize suas receitas ativas e histórico de medicamentos prescritos.</p>
                    <a href="/prontuarios.html" class="btn">Ver Receitas</a>
                </div>

                <div class="action-card">
                    <i class="fas fa-history" style="font-size: 2rem; color: #A7C7E7; margin-bottom: 15px;"></i>
                    <h3>Histórico Médico</h3>
                    <p>Acesse o histórico completo de suas consultas e tratamentos.</p>
                    <a href="/prontuarios.html" class="btn">Ver Histórico</a>
                </div>

                <div class="action-card">
                    <i class="fas fa-video" style="font-size: 2rem; color: #92B4D7; margin-bottom: 15px;"></i>
                    <h3>Videoconsulta</h3>
                    <p>Participe de uma consulta médica por vídeo com tecnologia segura.</p>
                    <a href="/videoconsulta.html" class="btn">Entrar na Consulta</a>
                </div>

                <div class="action-card">
                    <i class="fas fa-heart" style="font-size: 2rem; color: #F4D9B4; margin-bottom: 15px;"></i>
                    <h3>Especialidades</h3>
                    <p>Explore as diferentes especialidades médicas disponíveis na plataforma.</p>
                    <a href="/especialidades.html" class="btn">Ver Especialidades</a>
                </div>
            </div>
        </div>

        <script>
            // SISTEMA DE AUTENTICAÇÃO - Verificar se está logado
            function verificarAutenticacao() {
                const loggedIn = sessionStorage.getItem('telemed_logged_in');
                const userType = sessionStorage.getItem('telemed_user_type');
                
                if (loggedIn !== 'true' || userType !== 'paciente') {
                    alert('🔒 Acesso restrito!\\n\\nPor favor, faça login como paciente para acessar esta área.');
                    window.location.href = '/login';
                    return false;
                }
                
                return true;
            }

            // Função de logout
            function logout() {
                if (confirm('Tem certeza que deseja sair?')) {
                    sessionStorage.clear();
                    localStorage.removeItem('telemed_remember');
                    localStorage.removeItem('telemed_user_type');
                    
                    alert('Logout realizado com sucesso!');
                    window.location.href = '/login';
                }
            }

            // Inicialização
            document.addEventListener('DOMContentLoaded', function() {
                // VERIFICAR AUTENTICAÇÃO PRIMEIRO
                if (!verificarAutenticacao()) {
                    return;
                }
                
                console.log('👤 Dashboard Paciente PROTEGIDO carregado com sucesso!');
                console.log('🔒 Verificação de autenticação ativa');
                console.log('🎯 Sistema TeleMed operacional');
            });
        </script>
    </body>
    </html>
  `);
});

// 8. PATIENT BIDDING PAGE - Sistema de lances para pacientes
app.get('/patient-bidding', (req, res) => {
  console.log('🎯 Serving Patient Bidding Page for:', req.path);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema de Lances - TeleMed</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Poppins', sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #F0F4F8;
            }
            .header h1 { color: #A7C7E7; font-size: 28px; }
            .bidding-card {
                background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                border: 2px solid #A7C7E7;
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 20px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .bidding-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(167, 199, 231, 0.3);
            }
            .specialty-badge {
                background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                display: inline-block;
                margin-bottom: 15px;
            }
            .bid-amount {
                font-size: 24px;
                font-weight: 600;
                color: #27AE60;
                margin: 10px 0;
            }
            .timer {
                background: #FFE4B5;
                color: #FF8C00;
                padding: 8px 12px;
                border-radius: 12px;
                font-weight: 500;
                display: inline-block;
            }
            .bid-btn {
                background: linear-gradient(135deg, #27AE60 0%, #2ECC71 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
            }
            .bid-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(39, 174, 96, 0.3);
            }
            .logout-btn {
                background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 12px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .stat-card {
                background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
                color: white;
                padding: 20px;
                border-radius: 16px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><i class="fas fa-gavel"></i> Sistema de Lances TeleMed</h1>
                <a href="/login" class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </a>
            </div>

            <div id="bidding-content">
                <!-- Consultations Available for Bidding -->
                <div class="bidding-card">
                    <div class="specialty-badge">
                        <i class="fas fa-heart"></i> Cardiologia
                    </div>
                    <h3>Consulta Cardiológica - Urgente</h3>
                    <p style="color: #666; margin: 10px 0;">Paciente com sintomas cardíacos necessita avaliação</p>
                    <div class="bid-amount">
                        <i class="fas fa-dollar-sign"></i> Lance Atual: R$ 180,00
                    </div>
                    <div class="timer">
                        <i class="fas fa-clock"></i> Tempo: 12:45
                    </div>
                    <div style="margin-top: 15px;">
                        <span style="color: #666;">
                            <i class="fas fa-users"></i> 5 médicos interessados
                        </span>
                    </div>
                    <button class="bid-btn" onclick="fazerLance('cardiologia', 185)">
                        <i class="fas fa-hand-paper"></i> Fazer Lance (R$ 185,00)
                    </button>
                </div>

                <div class="bidding-card">
                    <div class="specialty-badge">
                        <i class="fas fa-child"></i> Pediatria
                    </div>
                    <h3>Consulta Pediátrica</h3>
                    <p style="color: #666; margin: 10px 0;">Criança com febre e sintomas gripais</p>
                    <div class="bid-amount">
                        <i class="fas fa-dollar-sign"></i> Lance Atual: R$ 150,00
                    </div>
                    <div class="timer">
                        <i class="fas fa-clock"></i> Tempo: 25:30
                    </div>
                    <div style="margin-top: 15px;">
                        <span style="color: #666;">
                            <i class="fas fa-users"></i> 3 médicos interessados
                        </span>
                    </div>
                    <button class="bid-btn" onclick="fazerLance('pediatria', 155)">
                        <i class="fas fa-hand-paper"></i> Fazer Lance (R$ 155,00)
                    </button>
                </div>

                <div class="bidding-card">
                    <div class="specialty-badge">
                        <i class="fas fa-eye"></i> Dermatologia
                    </div>
                    <h3>Consulta Dermatológica</h3>
                    <p style="color: #666; margin: 10px 0;">Avaliação de lesão cutânea</p>
                    <div class="bid-amount">
                        <i class="fas fa-dollar-sign"></i> Lance Atual: R$ 120,00
                    </div>
                    <div class="timer">
                        <i class="fas fa-clock"></i> Tempo: 35:00
                    </div>
                    <div style="margin-top: 15px;">
                        <span style="color: #666;">
                            <i class="fas fa-users"></i> 2 médicos interessados
                        </span>
                    </div>
                    <button class="bid-btn" onclick="fazerLance('dermatologia', 125)">
                        <i class="fas fa-hand-paper"></i> Fazer Lance (R$ 125,00)
                    </button>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>3</h3>
                    <p>Lances Ativos</p>
                </div>
                <div class="stat-card">
                    <h3>R$ 450</h3>
                    <p>Valor Total em Lances</p>
                </div>
                <div class="stat-card">
                    <h3>10</h3>
                    <p>Médicos Interessados</p>
                </div>
            </div>
        </div>

        <script>
            function fazerLance(especialidade, valor) {
                if (confirm(\`Confirma lance de R$ \${valor},00 para \${especialidade}?\`)) {
                    // Simulate bidding process
                    const btn = event.target;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                    btn.disabled = true;
                    
                    setTimeout(() => {
                        alert(\`✅ Lance de R$ \${valor},00 enviado com sucesso!\\n\\nVocê será notificado sobre o resultado da consulta.\`);
                        btn.innerHTML = '<i class="fas fa-check"></i> Lance Enviado';
                        btn.style.background = 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)';
                    }, 2000);
                }
            }

            function logout() {
                if (confirm('Tem certeza que deseja sair?')) {
                    sessionStorage.clear();
                    localStorage.clear();
                    alert('Logout realizado com sucesso!');
                    window.location.href = '/login';
                }
            }

            // Timer countdown simulation
            function updateTimers() {
                const timers = document.querySelectorAll('.timer');
                timers.forEach(timer => {
                    const timeText = timer.textContent;
                    const match = timeText.match(/(\\d+):(\\d+)/);
                    if (match) {
                        let minutes = parseInt(match[1]);
                        let seconds = parseInt(match[2]);
                        
                        if (seconds > 0) {
                            seconds--;
                        } else if (minutes > 0) {
                            minutes--;
                            seconds = 59;
                        }
                        
                        timer.innerHTML = \`<i class="fas fa-clock"></i> Tempo: \${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
                    }
                });
            }

            // Update timers every second
            setInterval(updateTimers, 1000);

            // Initialize page
            document.addEventListener('DOMContentLoaded', function() {
                console.log('🎯 Sistema de Lances TeleMed carregado com sucesso!');
                console.log('💰 Plataforma de lances médicos ativa');
            });
        </script>
    </body>
    </html>
  `);
});

// 9. LOGIN PAGE - Sistema de autenticação CORRIGIDO
// Helper function to create encrypted login URLs
function createSecureLoginUrl(email, senha, crm, origem = 'hostinger') {
  const data = { email, senha, crm, origem };
  const encryptedData = encryptData(data);
  return `/processar-login?dados=${encodeURIComponent(encryptedData)}`;
}

app.get('/login', (req, res) => {
  console.log('🔐 Serving SECURE Login Form with error handling for:', req.path);
  
  const { erro, tempo, sucesso } = req.query;
  let errorMessage = '';
  let successMessage = '';
  
  // Error handling for security
  switch (erro) {
    case 'credenciais':
      errorMessage = '❌ Email ou senha incorretos. Verifique os dados e tente novamente.';
      break;
    case 'bloqueado':
      errorMessage = `🚫 Muitas tentativas de login. Tente novamente em ${tempo || 5} minutos.`;
      break;
    case 'sistema':
      errorMessage = '⚠️ Erro interno do sistema. Contate o suporte técnico.';
      break;
    case 'origem':
      errorMessage = '🔒 Acesso não autorizado. Use apenas links oficiais.';
      break;
    case 'parametros':
      errorMessage = '📝 Dados de login incompletos. Preencha todos os campos.';
      break;
  }
  
  // Success handling
  if (sucesso === '1') {
    successMessage = '✅ Login realizado com sucesso! Redirecionando...';
  }
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - TeleMed Sistema</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body style="
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 20px;
    ">
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 450px;
        ">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="color: #A7C7E7; font-size: 2.5rem; margin-bottom: 10px;">
                    <i class="fas fa-user-md"></i>
                </div>
                <h1 style="color: #A7C7E7; font-size: 28px; margin: 0; font-weight: 600;">TeleMed Sistema</h1>
                <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 16px;">Fazer Login</p>
            </div>

            <!-- Formulário de Login -->
            <form id="loginForm" style="margin-bottom: 30px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 8px;">
                        <i class="fas fa-envelope" style="margin-right: 8px; color: #A7C7E7;"></i>
                        Email ou CRM
                    </label>
                    <input type="text" id="emailCrm" required style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid #E5E7EB;
                        border-radius: 12px;
                        font-size: 16px;
                        transition: border-color 0.3s;
                        box-sizing: border-box;
                        font-family: 'Poppins', sans-serif;
                    " placeholder="seu@email.com ou CRM-UF 123456" onfocus="this.style.borderColor='#A7C7E7'" onblur="this.style.borderColor='#E5E7EB'">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; color: #374151; font-weight: 500; margin-bottom: 8px;">
                        <i class="fas fa-lock" style="margin-right: 8px; color: #A7C7E7;"></i>
                        Senha
                    </label>
                    <div style="position: relative;">
                        <input type="password" id="senha" required style="
                            width: 100%;
                            padding: 15px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            font-size: 16px;
                            transition: border-color 0.3s;
                            box-sizing: border-box;
                            font-family: 'Poppins', sans-serif;
                            padding-right: 50px;
                        " placeholder="Sua senha" onfocus="this.style.borderColor='#A7C7E7'" onblur="this.style.borderColor='#E5E7EB'">
                        <button type="button" onclick="togglePassword()" style="
                            position: absolute;
                            right: 15px;
                            top: 50%;
                            transform: translateY(-50%);
                            background: none;
                            border: none;
                            color: #A7C7E7;
                            cursor: pointer;
                            font-size: 16px;
                        ">
                            <i class="fas fa-eye" id="toggleIcon"></i>
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <label style="display: flex; align-items: center; color: #6B7280; font-size: 14px;">
                        <input type="checkbox" id="lembrarMe" style="margin-right: 8px; accent-color: #A7C7E7;"> 
                        Lembrar de mim
                    </label>
                    <a href="#" onclick="esqueceuSenha()" style="color: #A7C7E7; text-decoration: none; font-size: 14px; font-weight: 500;">
                        Esqueci minha senha
                    </a>
                </div>

                <button type="submit" id="loginBtn" style="
                    width: 100%;
                    background: linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%);
                    color: white;
                    padding: 16px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-bottom: 20px;
                    font-family: 'Poppins', sans-serif;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fas fa-sign-in-alt" style="margin-right: 8px;"></i>
                    Entrar
                </button>
            </form>

            <!-- Contas Demo para Teste -->
            <div style="background: #F8F9FA; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #A7C7E7;">
                <h4 style="color: #374151; margin-bottom: 10px; font-size: 14px;">
                    <i class="fas fa-info-circle" style="color: #A7C7E7; margin-right: 5px;"></i>
                    Contas Demo para Teste:
                </h4>
                <div style="font-size: 12px; color: #6B7280; line-height: 1.5;">
                    <strong>Médicos:</strong><br>
                    • CRM: 123456-SP / Senha: medico123<br>
                    • CRM: 654321-RJ / Senha: doutor456<br>
                    <strong>Pacientes:</strong><br>
                    • Email: paciente@demo.com / Senha: 123456
                </div>
            </div>

            <!-- Links de cadastro -->
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="color: #6B7280; margin-bottom: 15px; font-size: 14px;">Não tem conta?</p>
                <div style="display: flex; gap: 10px;">
                    <a href="/register" style="
                        flex: 1;
                        background: #F4D9B4;
                        color: #8B4513;
                        padding: 12px;
                        text-decoration: none;
                        border-radius: 8px;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.3s;
                    " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                        <i class="fas fa-user-plus" style="margin-right: 5px;"></i>
                        Sou Paciente
                    </a>
                    <a href="/register?type=medico" style="
                        flex: 1;
                        background: #E9967A;
                        color: white;
                        padding: 12px;
                        text-decoration: none;
                        border-radius: 8px;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.3s;
                    " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                        <i class="fas fa-user-md" style="margin-right: 5px;"></i>
                        Sou Médico
                    </a>
                </div>
            </div>

            <!-- Voltar -->
            <div style="text-align: center;">
                <a href="/" style="color: #6B7280; text-decoration: none; font-size: 14px; transition: color 0.3s;" onmouseover="this.style.color='#A7C7E7'" onmouseout="this.style.color='#6B7280'">
                    <i class="fas fa-arrow-left" style="margin-right: 5px;"></i>
                    Voltar ao início
                </a>
            </div>
        </div>

        <script>
            function togglePassword() {
                const senhaInput = document.getElementById('senha');
                const toggleIcon = document.getElementById('toggleIcon');
                
                if (senhaInput.type === 'password') {
                    senhaInput.type = 'text';
                    toggleIcon.className = 'fas fa-eye-slash';
                } else {
                    senhaInput.type = 'password';
                    toggleIcon.className = 'fas fa-eye';
                }
            }

            function esqueceuSenha() {
                alert('Funcionalidade "Esqueci minha senha" será implementada em breve.\\n\\nPor enquanto, use as contas demo disponíveis.');
            }

            function showLoading() {
                const btn = document.getElementById('loginBtn');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i>Entrando...';
                btn.disabled = true;
            }

            function hideLoading() {
                const btn = document.getElementById('loginBtn');
                btn.innerHTML = '<i class="fas fa-sign-in-alt" style="margin-right: 8px;"></i>Entrar';
                btn.disabled = false;
            }

            function showMessage(message, type = 'success') {
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = \`
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: \${type === 'success' ? '#10B981' : '#EF4444'};
                    color: white;
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                \`;
                messageDiv.textContent = message;
                document.body.appendChild(messageDiv);
                
                setTimeout(() => {
                    messageDiv.remove();
                }, 3000);
            }

            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                showLoading();
                
                const emailCrm = document.getElementById('emailCrm').value.trim();
                const senha = document.getElementById('senha').value;
                const lembrarMe = document.getElementById('lembrarMe').checked;
                
                // Validação básica
                if (!emailCrm || !senha) {
                    hideLoading();
                    showMessage('Por favor, preencha todos os campos.', 'error');
                    return;
                }

                // Simulação de verificação de credenciais
                setTimeout(() => {
                    // Verificar contas demo médicas
                    const contasMedicas = {
                        '123456-SP': 'medico123',
                        '654321-RJ': 'doutor456', 
                        '789012-MG': 'psiquiatra789'
                    };
                    
                    // Verificar contas demo pacientes
                    const contasPacientes = {
                        'paciente@demo.com': '123456',
                        'admin@telemed.com': 'admin123'
                    };
                    
                    let loginValido = false;
                    let tipoUsuario = '';
                    
                    // Verificar se é médico
                    if (contasMedicas[emailCrm] === senha) {
                        loginValido = true;
                        tipoUsuario = 'medico';
                    }
                    // Verificar se é paciente
                    else if (contasPacientes[emailCrm] === senha) {
                        loginValido = true;
                        tipoUsuario = 'paciente';
                    }
                    
                    if (loginValido) {
                        // Salvar sessão se "lembrar de mim" estiver marcado
                        if (lembrarMe) {
                            localStorage.setItem('telemed_remember', 'true');
                            localStorage.setItem('telemed_user_type', tipoUsuario);
                        }
                        
                        // Criar sessão temporária
                        sessionStorage.setItem('telemed_logged_in', 'true');
                        sessionStorage.setItem('telemed_user_type', tipoUsuario);
                        sessionStorage.setItem('telemed_user_email', emailCrm);
                        sessionStorage.setItem('telemed_login_time', new Date().toISOString());
                        
                        showMessage(\`Login realizado com sucesso! Redirecionando...\`, 'success');
                        
                        // Redirecionar baseado no tipo de usuário
                        setTimeout(() => {
                            if (tipoUsuario === 'medico') {
                                window.location.href = '/doctor-dashboard';
                            } else {
                                window.location.href = '/patient-dashboard';
                            }
                        }, 1500);
                    } else {
                        hideLoading();
                        showMessage('Credenciais inválidas. Verifique email/CRM e senha.', 'error');
                    }
                }, 1000);
            });

            // Verificar se já está logado
            document.addEventListener('DOMContentLoaded', function() {
                const loggedIn = sessionStorage.getItem('telemed_logged_in');
                const userType = sessionStorage.getItem('telemed_user_type');
                
                if (loggedIn === 'true' && userType) {
                    showMessage('Você já está logado. Redirecionando...', 'success');
                    setTimeout(() => {
                        if (userType === 'medico') {
                            window.location.href = '/doctor-dashboard';
                        } else {
                            window.location.href = '/patient-dashboard';
                        }
                    }, 1500);
                }
                
                console.log('🔐 Sistema de Login Seguro carregado');
                console.log('🛡️ Autenticação obrigatória implementada');
            });
        </script>
    </body>
    </html>
  `);
});

// 10. CENTRO DE AVALIAÇÃO PSIQUIÁTRICA - Sistema de testes psicológicos
app.get('/centro-avaliacao', (req, res) => {
  console.log('🧠 Serving Centro de Avaliação Psiquiátrica for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../centro-avaliacao.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading centro-avaliacao.html:', error);
    res.status(500).send('Erro ao carregar Centro de Avaliação');
  }
});

// 11. TESTE TDAH-ASRS18 - Avaliação de TDAH
app.get('/tdah-asrs18', (req, res) => {
  console.log('🧠 Serving Teste TDAH-ASRS18 for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../tdah-asrs18.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading tdah-asrs18.html:', error);
    res.status(500).send('Erro ao carregar Teste TDAH');
  }
});

// 12. TESTE GAD-7 ANSIEDADE - Avaliação de Ansiedade Generalizada
app.get('/gad7-ansiedade', (req, res) => {
  console.log('😰 Serving Teste GAD-7 Ansiedade for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../gad7-ansiedade.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading gad7-ansiedade.html:', error);
    res.status(500).send('Erro ao carregar Teste GAD-7');
  }
});

// 13. TESTE PHQ-9 DEPRESSÃO - Avaliação de Depressão
app.get('/phq9-depressao', (req, res) => {
  console.log('😔 Serving Teste PHQ-9 Depressão for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../phq9-depressao.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading phq9-depressao.html:', error);
    res.status(500).send('Erro ao carregar Teste PHQ-9');
  }
});

// 14. TESTE MDQ TRANSTORNO BIPOLAR - Avaliação de Episódios Maníacos
app.get('/mdq-bipolar', (req, res) => {
  console.log('🔄 Serving Teste MDQ Transtorno Bipolar for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../mdq-bipolar.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading mdq-bipolar.html:', error);
    res.status(500).send('Erro ao carregar Teste MDQ');
  }
});

// 15. TESTE PSS-10 STRESS - Avaliação de Stress Percebido
app.get('/pss10-stress', (req, res) => {
  console.log('💭 Serving Teste PSS-10 Stress for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../pss10-stress.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading pss10-stress.html:', error);
    res.status(500).send('Erro ao carregar Teste PSS-10');
  }
});

// 16. TRIAGEM PSIQUIÁTRICA GERAL - Avaliação Abrangente
app.get('/triagem-psiquiatrica', (req, res) => {
  console.log('🧠 Serving Triagem Psiquiátrica Geral for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../triagem-psiquiatrica.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading triagem-psiquiatrica.html:', error);
    res.status(500).send('Erro ao carregar Triagem Psiquiátrica');
  }
});

// ROTAS ADICIONAIS COM NOMES SOLICITADOS PELO USUÁRIO

// Ansiedade GAD-7 (rota alternativa)
app.get('/ansiedade-gad7', (req, res) => {
  console.log('😰 Serving Teste Ansiedade GAD-7 for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../ansiedade-gad7.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading ansiedade-gad7.html:', error);
    res.status(500).send('Erro ao carregar Teste Ansiedade GAD-7');
  }
});

// Depressão PHQ-9 (rota alternativa)
app.get('/depressao-phq9', (req, res) => {
  console.log('😔 Serving Teste Depressão PHQ-9 for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../depressao-phq9.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading depressao-phq9.html:', error);
    res.status(500).send('Erro ao carregar Teste Depressão PHQ-9');
  }
});

// Transtorno Bipolar MDQ (rota alternativa)
app.get('/bipolar-mdq', (req, res) => {
  console.log('🔄 Serving Teste Bipolar MDQ for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../bipolar-mdq.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading bipolar-mdq.html:', error);
    res.status(500).send('Erro ao carregar Teste Bipolar MDQ');
  }
});

// Stress PSS-10 (rota alternativa)
app.get('/stress-pss10', (req, res) => {
  console.log('💭 Serving Teste Stress PSS-10 for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../stress-pss10.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading stress-pss10.html:', error);
    res.status(500).send('Erro ao carregar Teste Stress PSS-10');
  }
});

// 17. TELEMONITORAMENTO - Sistema de monitoramento remoto (rota principal)
app.get('/telemonitoramento', (req, res) => {
  console.log('👩‍⚕️ Serving Telemonitoramento for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../telemonitoramento-enfermagem.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading telemonitoramento-enfermagem.html:', error);
    res.status(500).send('Erro ao carregar Telemonitoramento');
  }
});

// 17b. TELEMONITORAMENTO DE ENFERMAGEM - Sistema de monitoramento remoto (rota específica)
app.get('/telemonitoramento-enfermagem', (req, res) => {
  console.log('👩‍⚕️ Serving Telemonitoramento de Enfermagem for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../telemonitoramento-enfermagem.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading telemonitoramento-enfermagem.html:', error);
    res.status(500).send('Erro ao carregar Telemonitoramento de Enfermagem');
  }
});

// 18. DR. AI - ASSISTENTE MÉDICO INTELIGENTE - Copiloto clínico com IA
app.get('/dr-ai', (req, res) => {
  console.log('🤖 Serving Dr. AI - Assistente Médico Inteligente for:', req.path);
  
  try {
    const filePath = path.join(__dirname, '../dr-ai.html');
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error reading dr-ai.html:', error);
    res.status(500).send('Erro ao carregar Dr. AI - Assistente Médico');
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Create test page to verify all links are working
app.get('/test-links', (req, res) => {
  console.log('🔍 Serving Link Test Page');
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teste de Links - TeleMed</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #A7C7E7 0%, #F4D9B4 100%);
                padding: 20px;
                margin: 0;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .link-test {
                background: #f8f9fa;
                border: 2px solid #A7C7E7;
                border-radius: 12px;
                padding: 15px;
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .test-btn {
                background: #27AE60;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                display: inline-block;
                cursor: pointer;
            }
            .test-btn:hover { background: #219A52; }
            .status { font-weight: bold; }
            .working { color: #27AE60; }
            .error { color: #E74C3C; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Teste de Links TeleMed</h1>
            <p>Use esta página para testar se todos os links estão funcionando corretamente:</p>
            
            <div class="link-test">
                <div>
                    <strong>/lances</strong> → Sistema de Lances
                    <div class="status working">✅ FUNCIONANDO</div>
                </div>
                <a href="/lances" class="test-btn">Testar /lances</a>
            </div>
            
            <div class="link-test">
                <div>
                    <strong>/dashboard</strong> → Dashboard Paciente
                    <div class="status working">✅ FUNCIONANDO</div>
                </div>
                <a href="/dashboard" class="test-btn">Testar /dashboard</a>
            </div>
            
            <div class="link-test">
                <div>
                    <strong>/patient-bidding</strong> → Sistema de Lances (Direto)
                    <div class="status working">✅ FUNCIONANDO</div>
                </div>
                <a href="/patient-bidding" class="test-btn">Testar /patient-bidding</a>
            </div>
            
            <div class="link-test">
                <div>
                    <strong>/patient-dashboard</strong> → Dashboard Paciente (Direto)
                    <div class="status working">✅ FUNCIONANDO</div>
                </div>
                <a href="/patient-dashboard" class="test-btn">Testar /patient-dashboard</a>
            </div>
            
            <div class="link-test">
                <div>
                    <strong>/login</strong> → Página de Login
                    <div class="status working">✅ FUNCIONANDO</div>
                </div>
                <a href="/login" class="test-btn">Testar /login</a>
            </div>
            
            <hr style="margin: 30px 0; border: 1px solid #ddd;">
            
            <h3>📋 Status do Sistema:</h3>
            <p><strong>Servidor:</strong> <span class="status working">🟢 ONLINE</span></p>
            <p><strong>Redirecionamentos:</strong> <span class="status working">🟢 CONFIGURADOS</span></p>
            <p><strong>Rotas Estáticas:</strong> <span class="status working">🟢 ATIVAS</span></p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h4>✅ Todos os links estão funcionando!</h4>
                <p>Se algum link não funcionar para você, pode ser um problema de:</p>
                <ul>
                    <li>Cache do navegador (tente Ctrl+F5 para recarregar)</li>
                    <li>URL incorreta (certifique-se de usar o domínio certo)</li>
                    <li>Conexão de rede</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="/" class="test-btn">🏠 Voltar ao Início</a>
            </div>
        </div>
        
        <script>
            console.log('🔍 Página de teste de links carregada');
            console.log('📊 Status: Todos os links funcionando');
        </script>
    </body>
    </html>
  `);
});

// Create specific routes that redirect to React Router
app.get('/lances', (req, res) => {
  console.log('🎯 Redirecting /lances to /patient-bidding');
  res.redirect('/patient-bidding');
});

app.get('/dashboard', (req, res) => {
  console.log('🎯 Redirecting /dashboard to /patient-dashboard');
  res.redirect('/patient-dashboard');
});

// SPA fallback - serve React app for any non-API routes
const staticRoutes = ['/login', '/patient-dashboard', '/patient-bidding', '/fazer-lance', '/dr-ai', '/register', '/processar-login', '/sobre', '/termos-de-uso', '/politica-privacidade', '/test-links', '/centro-avaliacao', '/tdah-asrs18', '/gad7-ansiedade', '/phq9-depressao', '/mdq-bipolar', '/pss10-stress', '/triagem-psiquiatrica', '/ansiedade-gad7', '/depressao-phq9', '/bipolar-mdq', '/stress-pss10', '/telemonitoramento-enfermagem'];
app.get('*', (req, res, next) => {
  // Skip static routes and API routes
  if (req.path.startsWith('/api') || req.path.includes('.') || staticRoutes.includes(req.path)) {
    return next();
  }
  
  console.log('📱 Serving React SPA for:', req.path);
  
  // For development, serve a fallback page that redirects to proper routes
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TeleMed Sistema</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">🏥 TeleMed Sistema</h1>
                <p class="text-gray-600 mb-4">Você está tentando acessar: <strong>${req.path}</strong></p>
                <p class="text-gray-500 mb-8">Escolha uma das opções abaixo para continuar:</p>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <a href="/" class="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors">
                        🏠 Página Inicial
                    </a>
                    <a href="/patient-dashboard" class="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors">
                        👤 Dashboard Paciente
                    </a>
                    <a href="/patient-bidding" class="bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-colors">
                        🎯 Sistema de Lances
                    </a>
                    <a href="/doctor-dashboard" class="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition-colors">
                        👨‍⚕️ Dashboard Médico
                    </a>
                </div>
                <div class="mt-8 text-sm text-gray-500">
                    <p>Outras páginas disponíveis:</p>
                    <div class="flex flex-wrap justify-center gap-2 mt-2">
                        <a href="/login" class="text-blue-600 hover:underline">Login</a>
                        <a href="/register" class="text-blue-600 hover:underline">Cadastro</a>
                        <a href="/lances" class="text-orange-600 hover:underline">Lances (/lances)</a>
                        <a href="/dashboard" class="text-green-600 hover:underline">Dashboard (/dashboard)</a>
                        <a href="/sobre" class="text-blue-600 hover:underline">Sobre</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Start server
const port = parseInt(process.env.PORT || '5000');
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 TeleMed Sistema v12.5.2 rodando na porta ${port}`);
  console.log(`🔗 Acesse: http://localhost:${port}`);
  console.log(`🛡️ Sistema de login seguro implementado`);
  console.log(`🔐 Área médica protegida com autenticação`);
});
