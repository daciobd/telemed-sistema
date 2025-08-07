import { Router } from 'express';
import axios from 'axios';
import { db } from '../storage';

const router = Router();

// Interface para dados de oferta médica
interface OfertaMedica {
  especialidade: string;
  valor: number;
  horario: string;
  pacienteId: number;
  pacienteNome?: string;
  urgencia?: boolean;
}

// Interface para médico
interface Medico {
  id: number;
  nome: string;
  telefone: string;
  whatsapp?: string;
  especialidade: string;
  disponibilidade: boolean;
  crm: string;
}

// Interface para resposta de médico
interface RespostaMedico {
  ofertaId: number;
  resposta: 'ACEITAR' | 'RECUSAR';
  medicoTelefone: string;
  observacoes?: string;
}

// Rota para enviar oferta aos médicos cadastrados
router.post('/enviar-oferta', async (req, res) => {
  try {
    const { especialidade, valor, horario, pacienteId, pacienteNome, urgencia } = req.body as OfertaMedica;

    // Validação básica
    if (!especialidade || !valor || !horario || !pacienteId) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Dados obrigatórios: especialidade, valor, horario, pacienteId' 
      });
    }

    if (valor < 150) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Valor mínimo para consulta é R$ 150,00' 
      });
    }

    // Inserir oferta no banco de dados
    const novaOferta = {
      paciente_id: pacienteId,
      paciente_nome: pacienteNome || 'Paciente',
      valor,
      especialidade,
      horario: new Date(horario),
      status: 'pendente',
      urgencia: urgencia || false,
      created_at: new Date(),
      medico_id: null
    };

    // Simular inserção no banco (adaptar conforme schema existente)
    const ofertaId = Date.now(); // Temporário - usar ID real do banco

    // Buscar médicos disponíveis da especialidade
    const medicosDisponiveis: Medico[] = [
      {
        id: 1,
        nome: 'Dr. Carlos Silva',
        telefone: '+5511999887766',
        whatsapp: '+5511999887766',
        especialidade: especialidade,
        disponibilidade: true,
        crm: 'CRM 123456-SP'
      },
      // Adicionar mais médicos conforme cadastro
    ];

    const medicosEnviados = [];
    const falhasEnvio = [];

    // Preparar mensagem base
    const valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const dataFormatada = new Date(horario).toLocaleString('pt-BR');
    const urgenciaTexto = urgencia ? '🚨 URGENTE - ' : '';
    
    const mensagemBase = `${urgenciaTexto}Nova consulta TeleMed:
📋 Especialidade: ${especialidade.toUpperCase()}
💰 Valor: ${valorFormatado}
📅 Horário: ${dataFormatada}
👤 Paciente: ${pacienteNome || 'Não informado'}

Para aceitar: ACEITAR ${ofertaId}
Para recusar: RECUSAR ${ofertaId}

TeleMed Pro - Sistema Médico`;

    // Enviar notificações para médicos disponíveis
    for (const medico of medicosDisponiveis) {
      try {
        // Personalizar mensagem para cada médico
        const mensagemPersonalizada = `Olá ${medico.nome}!

${mensagemBase}

CRM: ${medico.crm}`;

        // Tentar envio por SMS (Twilio)
        if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && medico.telefone) {
          try {
            await enviarSMS(medico.telefone, mensagemPersonalizada);
            console.log(`✅ SMS enviado para ${medico.nome} (${medico.telefone})`);
          } catch (smsError) {
            console.log(`❌ Falha SMS para ${medico.nome}:`, smsError);
          }
        }

        // Tentar envio por WhatsApp (Twilio)
        if (process.env.TWILIO_WHATSAPP && medico.whatsapp) {
          try {
            await enviarWhatsApp(medico.whatsapp, mensagemPersonalizada);
            console.log(`✅ WhatsApp enviado para ${medico.nome} (${medico.whatsapp})`);
          } catch (whatsappError) {
            console.log(`❌ Falha WhatsApp para ${medico.nome}:`, whatsappError);
          }
        }

        medicosEnviados.push({
          medico: medico.nome,
          telefone: medico.telefone,
          whatsapp: medico.whatsapp
        });

      } catch (erro) {
        console.error(`Erro ao enviar para ${medico.nome}:`, erro);
        falhasEnvio.push({
          medico: medico.nome,
          erro: erro.message
        });
      }
    }

    // Registrar tentativa de envio no log
    console.log(`📤 Oferta ${ofertaId} enviada para ${medicosEnviados.length} médicos`);
    console.log(`⚠️ Falhas de envio: ${falhasEnvio.length}`);

    res.json({
      sucesso: true,
      mensagem: `Oferta enviada para ${medicosEnviados.length} médicos da especialidade ${especialidade}`,
      dados: {
        ofertaId,
        medicosEnviados: medicosEnviados.length,
        falhasEnvio: falhasEnvio.length,
        detalhes: {
          enviados: medicosEnviados,
          falhas: falhasEnvio
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro ao processar envio de oferta:', error);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Falha interna do servidor ao enviar oferta',
      detalhes: error.message 
    });
  }
});

// Rota para receber resposta do médico
router.post('/responder-oferta', async (req, res) => {
  try {
    const { ofertaId, resposta, medicoTelefone, observacoes } = req.body as RespostaMedico;

    // Validação
    if (!ofertaId || !resposta || !medicoTelefone) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Dados obrigatórios: ofertaId, resposta, medicoTelefone' 
      });
    }

    if (!['ACEITAR', 'RECUSAR'].includes(resposta.toUpperCase())) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Resposta deve ser ACEITAR ou RECUSAR' 
      });
    }

    // Buscar médico pelo telefone
    const medico = medicosTemporarios.find(m => 
      m.telefone === medicoTelefone || m.whatsapp === medicoTelefone
    );

    if (!medico) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Médico não encontrado com este telefone' 
      });
    }

    const agora = new Date();
    const respostaFormatada = resposta.toUpperCase();

    if (respostaFormatada === 'ACEITAR') {
      // Atualizar oferta como aceita
      console.log(`✅ Oferta ${ofertaId} ACEITA por ${medico.nome} (${medico.crm})`);
      
      // Simular atualização no banco
      // await db.updateOffer(ofertaId, { 
      //   status: 'aceito', 
      //   medico_id: medico.id,
      //   resposta_em: agora,
      //   observacoes 
      // });

      // Notificar paciente sobre aceitação
      const mensagemPaciente = `🎉 Sua consulta foi aceita!

👨‍⚕️ Médico: ${medico.nome}
📋 CRM: ${medico.crm}
📅 Oferta ID: ${ofertaId}

Aguarde contato para confirmação do horário.

TeleMed Pro`;

      // Aqui você enviaria SMS/WhatsApp para o paciente
      console.log('📱 Notificação para paciente:', mensagemPaciente);

      res.json({ 
        sucesso: true, 
        mensagem: `Oferta aceita com sucesso por ${medico.nome}`,
        dados: {
          medico: medico.nome,
          crm: medico.crm,
          respondidoEm: agora
        }
      });

    } else if (respostaFormatada === 'RECUSAR') {
      // Atualizar oferta como recusada por este médico
      console.log(`❌ Oferta ${ofertaId} RECUSADA por ${medico.nome} (${medico.crm})`);
      
      // Simular atualização no banco
      // await db.addOfferResponse(ofertaId, {
      //   medico_id: medico.id,
      //   resposta: 'recusado',
      //   respondido_em: agora,
      //   observacoes
      // });

      res.json({ 
        sucesso: true, 
        mensagem: `Oferta recusada. Obrigado pela resposta, ${medico.nome}`,
        dados: {
          medico: medico.nome,
          crm: medico.crm,
          respondidoEm: agora
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro ao processar resposta:', error);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Falha ao processar resposta do médico',
      detalhes: error.message 
    });
  }
});

// Rota para webhook do Twilio (receber respostas automáticas)
router.post('/webhook/twilio', async (req, res) => {
  try {
    const { From, Body } = req.body;
    
    console.log(`📲 Resposta recebida de ${From}: ${Body}`);

    // Processar resposta automática do formato "ACEITAR 123" ou "RECUSAR 123"
    const respostaPattern = /^(ACEITAR|RECUSAR)\s+(\d+)$/i;
    const match = Body.trim().match(respostaPattern);

    if (match) {
      const [, resposta, ofertaId] = match;
      
      // Processar resposta automaticamente
      const resultado = await router.post('/responder-oferta', {
        body: {
          ofertaId: parseInt(ofertaId),
          resposta: resposta.toUpperCase(),
          medicoTelefone: From
        }
      });

      // Resposta automática para o médico
      const mensagemResposta = `✅ Resposta registrada: ${resposta.toUpperCase()} para oferta ${ofertaId}. Obrigado!`;
      
      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>${mensagemResposta}</Message>
        </Response>`);
    } else {
      // Resposta inválida
      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>Formato inválido. Use: ACEITAR [ID] ou RECUSAR [ID]</Message>
        </Response>`);
    }

  } catch (error) {
    console.error('❌ Erro no webhook Twilio:', error);
    res.status(500).send('Erro interno');
  }
});

// Função auxiliar para enviar SMS via Twilio
async function enviarSMS(telefone: string, mensagem: string): Promise<void> {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE) {
    throw new Error('Credenciais Twilio não configuradas');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`;
  
  await axios.post(url, {
    To: telefone,
    From: process.env.TWILIO_PHONE,
    Body: mensagem
  }, {
    auth: {
      username: process.env.TWILIO_SID,
      password: process.env.TWILIO_AUTH_TOKEN
    }
  });
}

// Função auxiliar para enviar WhatsApp via Twilio
async function enviarWhatsApp(whatsapp: string, mensagem: string): Promise<void> {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP) {
    throw new Error('Credenciais Twilio WhatsApp não configuradas');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`;
  
  await axios.post(url, {
    To: `whatsapp:${whatsapp}`,
    From: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
    Body: mensagem
  }, {
    auth: {
      username: process.env.TWILIO_SID,
      password: process.env.TWILIO_AUTH_TOKEN
    }
  });
}

// Dados temporários de médicos (mover para banco de dados)
const medicosTemporarios: Medico[] = [
  {
    id: 1,
    nome: 'Dr. Carlos Silva',
    telefone: '+5511999887766',
    whatsapp: '+5511999887766',
    especialidade: 'clinica',
    disponibilidade: true,
    crm: 'CRM 123456-SP'
  },
  {
    id: 2,
    nome: 'Dra. Ana Beatriz',
    telefone: '+5511888776655',
    whatsapp: '+5511888776655',
    especialidade: 'psiquiatria',
    disponibilidade: true,
    crm: 'CRM 654321-SP'
  },
  {
    id: 3,
    nome: 'Dr. Rafael Santos',
    telefone: '+5511777665544',
    whatsapp: '+5511777665544',
    especialidade: 'cardiologia',
    disponibilidade: true,
    crm: 'CRM 789012-SP'
  }
];

export default router;