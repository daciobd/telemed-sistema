const express = require('express');
const axios = require('axios');
const { Client } = require('pg');
const router = express.Router();

// Simulação da integração MEMED - será atualizada com dados reais após autorização
class MemedService {
    constructor() {
        this.baseURL = process.env.MEMED_API_URL || 'https://api.memed.com.br/v1';
        this.apiKey = process.env.MEMED_API_KEY || 'sua_chave_api_aqui';
        this.clientSecret = process.env.MEMED_CLIENT_SECRET || 'seu_secret_aqui';
    }

    async authenticate() {
        try {
            // Autenticação com API MEMED (será implementada com dados reais)
            const response = await axios.post(`${this.baseURL}/auth/token`, {
                grant_type: 'client_credentials',
                client_id: this.apiKey,
                client_secret: this.clientSecret
            });
            return response.data.access_token;
        } catch (error) {
            console.log('Simulando autenticação MEMED - aguardando credenciais reais');
            return 'token_simulado_memed_123456';
        }
    }

    async criarReceita(dadosPaciente, medicamentos, medicoData) {
        const token = await this.authenticate();
        
        try {
            // Estrutura da receita conforme padrão MEMED
            const receitaData = {
                patient: {
                    name: dadosPaciente.nome,
                    birthDate: dadosPaciente.data_nascimento || '1990-01-01',
                    cpf: dadosPaciente.cpf || '000.000.000-00',
                    phone: dadosPaciente.telefone,
                    email: dadosPaciente.email
                },
                doctor: {
                    name: medicoData.nome || 'Dr. Sistema TeleMed',
                    crm: medicoData.crm || 'CRM 123456-SP',
                    specialty: medicoData.especialidade || 'Clínica Geral'
                },
                medications: medicamentos.map(med => ({
                    name: med.nome,
                    dosage: med.dosagem,
                    frequency: med.frequencia,
                    duration: med.duracao,
                    instructions: med.instrucoes || 'Conforme orientação médica'
                })),
                date: new Date().toISOString(),
                type: 'digital'
            };

            // Chamada real à API MEMED (será ativada após autorização)
            /*
            const response = await axios.post(`${this.baseURL}/prescriptions`, receitaData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
            */

            // Simulação temporária - retorna receita mockada
            return {
                success: true,
                prescriptionId: `MEMED_${Date.now()}`,
                url: `https://receita.memed.com.br/view/${Date.now()}`,
                qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==`,
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                medications: receitaData.medications,
                patient: receitaData.patient,
                doctor: receitaData.doctor,
                status: 'active'
            };

        } catch (error) {
            console.error('Erro na integração MEMED:', error);
            throw new Error('Falha ao gerar receita digital');
        }
    }

    async verificarReceita(prescriptionId) {
        const token = await this.authenticate();
        
        try {
            // Verificação de status da receita
            /*
            const response = await axios.get(`${this.baseURL}/prescriptions/${prescriptionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
            */

            // Simulação
            return {
                id: prescriptionId,
                status: 'active',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                dispensed: false
            };

        } catch (error) {
            console.error('Erro ao verificar receita:', error);
            throw new Error('Falha ao verificar status da receita');
        }
    }
}

const memedService = new MemedService();

// Rota para gerar receita médica digital
router.post('/gerar-receita', async (req, res) => {
    try {
        const { pacienteId, medicamentos, observacoes } = req.body;

        if (!pacienteId || !medicamentos || !Array.isArray(medicamentos)) {
            return res.status(400).json({
                error: 'Dados inválidos. Forneça pacienteId e array de medicamentos'
            });
        }

        // Buscar dados do paciente no banco
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        const pacienteResult = await client.query('SELECT * FROM pacientes WHERE id = $1', [pacienteId]);
        
        if (pacienteResult.rows.length === 0) {
            await client.end();
            return res.status(404).json({ error: 'Paciente não encontrado' });
        }

        const paciente = pacienteResult.rows[0];

        // Dados do médico (podem vir da sessão ou ser configuráveis)
        const medicoData = {
            nome: 'Dr. Sistema TeleMed',
            crm: 'CRM 123456-SP',
            especialidade: 'Clínica Geral'
        };

        // Gerar receita via MEMED
        const receita = await memedService.criarReceita(paciente, medicamentos, medicoData);

        // Salvar receita no banco de dados
        const receitaInsert = await client.query(`
            INSERT INTO receitas_digitais (
                paciente_id, prescription_id, url_receita, qr_code, 
                medicamentos, status, valida_ate, observacoes, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
            RETURNING *
        `, [
            pacienteId,
            receita.prescriptionId,
            receita.url,
            receita.qrCode,
            JSON.stringify(medicamentos),
            receita.status,
            receita.validUntil,
            observacoes || ''
        ]);

        await client.end();

        res.json({
            success: true,
            receita: {
                id: receitaInsert.rows[0].id,
                prescriptionId: receita.prescriptionId,
                url: receita.url,
                qrCode: receita.qrCode,
                validUntil: receita.validUntil,
                status: receita.status,
                paciente: paciente.nome,
                medicamentos: medicamentos
            }
        });

        console.log(`📋 Receita digital gerada: ${receita.prescriptionId} para ${paciente.nome}`);

    } catch (error) {
        console.error('Erro ao gerar receita:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para listar receitas de um paciente
router.get('/paciente/:id/receitas', async (req, res) => {
    try {
        const { id } = req.params;

        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        const result = await client.query(`
            SELECT r.*, p.nome as paciente_nome 
            FROM receitas_digitais r
            JOIN pacientes p ON r.paciente_id = p.id
            WHERE r.paciente_id = $1
            ORDER BY r.created_at DESC
        `, [id]);

        await client.end();

        res.json(result.rows);

    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para verificar status de uma receita
router.get('/receita/:prescriptionId/status', async (req, res) => {
    try {
        const { prescriptionId } = req.params;

        const status = await memedService.verificarReceita(prescriptionId);

        res.json(status);

    } catch (error) {
        console.error('Erro ao verificar receita:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para invalidar receita
router.patch('/receita/:id/invalidar', async (req, res) => {
    try {
        const { id } = req.params;

        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();

        const result = await client.query(`
            UPDATE receitas_digitais 
            SET status = 'invalidated', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `, [id]);

        await client.end();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Receita não encontrada' });
        }

        res.json({ success: true, receita: result.rows[0] });

    } catch (error) {
        console.error('Erro ao invalidar receita:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;