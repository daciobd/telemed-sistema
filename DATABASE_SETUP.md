# Configuração do Banco de Dados - TeleMed Pro

## Estrutura do Banco de Dados PostgreSQL

### Tabela: pacientes
Armazena informações dos pacientes agendados para consultas.

```sql
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    hora_consulta TEXT,
    status TEXT,
    especialidade TEXT,
    convenio TEXT,
    telefone TEXT,
    email TEXT,
    idade INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: prontuarios
Armazena os prontuários eletrônicos das consultas realizadas.

```sql
CREATE TABLE prontuarios (
    id SERIAL PRIMARY KEY,
    paciente_id INTEGER,
    queixa TEXT,
    exame_fisico TEXT,
    hipotese_diagnostica TEXT,
    conduta TEXT,
    data_consulta DATE,
    medico_crm TEXT,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);
```

## Dados de Teste Inseridos

### Pacientes (8 registros)
- João Silva Santos (08:20 - Cardiologia - Confirmado)
- Maria Oliveira Costa (09:15 - Dermatologia - Agendado)
- Pedro Souza Lima (10:30 - Psiquiatria - Confirmado)
- Ana Carolina Mendes (11:45 - Ginecologia - Pendente)
- Carlos Eduardo Santos (14:00 - Neurologia - Confirmado)
- Juliana Pereira Rocha (15:20 - Endocrinologia - Agendado)
- Roberto Silva Oliveira (16:10 - Ortopedia - Confirmado)
- Fernanda Costa Lima (17:30 - Nutrição - Reagendado)

### Prontuários (5 registros)
Prontuários fictícios com queixas, exames físicos, hipóteses diagnósticas e condutas médicas realistas.

## Status da Configuração

✅ **Banco PostgreSQL**: Configurado e ativo
✅ **Tabelas**: Criadas com sucesso
✅ **Dados de Teste**: Inseridos (8 pacientes + 5 prontuários)
✅ **Relacionamentos**: Foreign keys configuradas
✅ **Timestamps**: Campos de auditoria implementados

## Credenciais e Acesso

- **Banco**: PostgreSQL (via Replit)
- **URL**: Disponível na variável `DATABASE_URL`
- **Ambiente**: Desenvolvimento
- **Ferramenta**: execute_sql_tool para consultas

## Consultas de Teste

### Listar todos os pacientes
```sql
SELECT * FROM pacientes ORDER BY hora_consulta;
```

### Buscar paciente por nome
```sql
SELECT * FROM pacientes WHERE nome ILIKE '%Silva%';
```

### Obter prontuário de um paciente
```sql
SELECT p.nome, pr.* 
FROM prontuarios pr 
JOIN pacientes p ON pr.paciente_id = p.id 
WHERE p.id = 1;
```

### Pacientes do dia com status
```sql
SELECT nome, hora_consulta, status, especialidade, convenio 
FROM pacientes 
WHERE data_consulta = CURRENT_DATE 
ORDER BY hora_consulta;
```

## Integração com Frontend

As páginas `agenda-medica.html` e `atendimento-medico.html` podem ser integradas para:

1. **agenda-medica.html**: Buscar pacientes do banco em vez de dados estáticos
2. **atendimento-medico.html**: Carregar e salvar prontuários no banco
3. **Parâmetros URL**: Passar `paciente_id` em vez de dados inline

## Próximos Passos

1. Integrar agenda com dados reais do banco
2. Implementar salvamento de prontuários
3. Adicionar funcionalidades de busca e filtros
4. Criar API endpoints para operações CRUD
5. Implementar autenticação de médicos

## Última Atualização
04 de Janeiro de 2025 - Configuração inicial completa