# 💳 COMO TESTAR O SISTEMA DE PAGAMENTO

## 🎯 CAMINHO COMPLETO PARA TESTE

### 1. ACESSE O SISTEMA
- Vá para: http://localhost:5000
- Faça login com sua conta

### 2. AGENDE UMA CONSULTA
- No menu lateral, clique em "Consultas"
- Clique em "Nova Consulta"
- Preencha os dados:
  - Selecione um médico
  - Escolha data e horário
  - Confirme o agendamento

### 3. ACESSE O PAGAMENTO
- Na lista de consultas, encontre sua consulta agendada
- Clique no botão "Pagar Consulta" ou ícone de pagamento
- OU vá diretamente para: `/payment-checkout?appointment=ID_DA_CONSULTA`

### 4. TESTE O PAGAMENTO
Use estes cartões de teste do Stripe:

**✅ CARTÃO APROVADO:**
- Número: 4242 4242 4242 4242
- Validade: qualquer data futura (ex: 12/25)
- CVC: qualquer 3 dígitos (ex: 123)
- Nome: Seu nome

**❌ CARTÃO RECUSADO (para testar erro):**
- Número: 4000 0000 0000 0002
- Validade: qualquer data futura
- CVC: qualquer 3 dígitos

**🔄 CARTÃO PROCESSAMENTO (para testar demora):**
- Número: 4000 0000 0000 0119
- Validade: qualquer data futura
- CVC: qualquer 3 dígitos

### 5. VERIFICAR RESULTADO
- Pagamento aprovado: redirecionará para página de sucesso
- Pagamento recusado: mostrará mensagem de erro
- Consulta será marcada como "paga" no sistema

## 🛠️ FUNCIONALIDADES DO PAGAMENTO

### O que funciona:
- ✅ Criação do Payment Intent no Stripe
- ✅ Interface de pagamento responsiva
- ✅ Processamento seguro de cartões
- ✅ Validação de dados do cartão
- ✅ Feedback visual durante processamento
- ✅ Redirecionamento após sucesso
- ✅ Tratamento de erros
- ✅ Integração com consultas médicas

### Valor da consulta:
- **R$ 150,00** (valor padrão para todas as consultas)

## 🔍 COMO VERIFICAR SE FUNCIONOU

### No Dashboard do Stripe:
1. Acesse: https://dashboard.stripe.com/test/payments
2. Veja os pagamentos processados em tempo real
3. Verifique detalhes da transação

### No Sistema:
1. Consulta aparecerá como "Paga" na lista
2. Status será atualizado automaticamente
3. Histórico de pagamento será salvo

## 🚨 TROUBLESHOOTING

**Se não conseguir acessar o pagamento:**
- Certifique-se de estar logado
- Verifique se a consulta existe
- Confirme se você é o paciente da consulta

**Se o pagamento não processar:**
- Verifique os dados do cartão de teste
- Confirme se as chaves do Stripe estão configuradas
- Veja o console do navegador para erros

## 📱 RECURSOS ADICIONAIS

- Interface otimizada para mobile
- Suporte a múltiples formas de pagamento
- Integração completa com sistema médico
- Histórico de transações
- Comprovantes automáticos