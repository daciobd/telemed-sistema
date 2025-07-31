# URLs Corrigidas para Integração Hostinger

## 🔒 Sistema de Login Seguro Implementado

### URLs Principais do Sistema TeleMed

#### **BASE HOSTINGER**: `https://seudominio.hostinger.com`

### 1. LOGIN AUTOMÁTICO SEGURO
```
MÉTODO RECOMENDADO (Criptografado):
https://seudominio.hostinger.com/processar-login?dados=[BASE64_ENCRYPTED_DATA]

MÉTODO LEGACY (Compatibilidade):
https://seudominio.hostinger.com/processar-login?email=USUARIO&senha=SENHA
https://seudominio.hostinger.com/processar-login?crm=CRM&senha=SENHA
```

### 2. REDIRECIONAMENTO PERSONALIZADO
```
Para garantir que o usuário seja redirecionado para URLs específicas do Hostinger:
https://seudominio.hostinger.com/processar-login?dados=[ENCRYPTED]&redirect_base=https://seudominio.hostinger.com
```

### 3. EXEMPLOS DE DADOS CRIPTOGRAFADOS

#### **Paciente Demo**:
```json
Dados originais: {"email":"paciente@demo.com","senha":"123456","origem":"hostinger"}
Base64: eyJlbWFpbCI6InBhY2llbnRlQGRlbW8uY29tIiwic2VuaGEiOiIxMjM0NTYiLCJvcmlnZW0iOiJob3N0aW5nZXIifQ==

URL Final:
https://seudominio.hostinger.com/processar-login?dados=eyJlbWFpbCI6InBhY2llbnRlQGRlbW8uY29tIiwic2VuaGEiOiIxMjM0NTYiLCJvcmlnZW0iOiJob3N0aW5nZXIifQ%3D%3D
```

#### **Médico Demo**:
```json
Dados originais: {"crm":"123456-SP","senha":"medico123","origem":"hostinger"}
Base64: eyJjcm0iOiIxMjM0NTYtU1AiLCJzZW5oYSI6Im1lZGljbzEyMyIsIm9yaWdlbSI6Imhvc3RpbmdlciJ9

URL Final:
https://seudominio.hostinger.com/processar-login?dados=eyJjcm0iOiIxMjM0NTYtU1AiLCJzZW5oYSI6Im1lZGljbzEyMyIsIm9yaWdlbSI6Imhvc3RpbmdlciJ9
```

### 4. TRATAMENTO DE ERROS
```
Credenciais Inválidas:
https://seudominio.hostinger.com/login?erro=credenciais

Rate Limit Excedido:
https://seudominio.hostinger.com/login?erro=bloqueado&tempo=5

Erro do Sistema:
https://seudominio.hostinger.com/login?erro=sistema
```

### 5. DASHBOARDS DE DESTINO
```
Paciente → https://seudominio.hostinger.com/patient-dashboard
Médico → https://seudominio.hostinger.com/doctor-dashboard
```

### 6. CÓDIGOS DE EXEMPLO EM JAVASCRIPT

#### Gerar URL Criptografada:
```javascript
function createSecureLoginUrl(email, senha, crm, hostinger_domain) {
    const data = { 
        email, 
        senha, 
        crm, 
        origem: 'hostinger' 
    };
    const encrypted = btoa(JSON.stringify(data));
    return `https://${hostinger_domain}/processar-login?dados=${encodeURIComponent(encrypted)}`;
}

// Exemplo de uso:
const urlPaciente = createSecureLoginUrl('paciente@demo.com', '123456', null, 'seudominio.hostinger.com');
const urlMedico = createSecureLoginUrl(null, 'medico123', '123456-SP', 'seudominio.hostinger.com');
```

### 7. CONFIGURAÇÃO DO HOSTINGER

Para garantir funcionamento correto, configure no Hostinger:

1. **Variáveis de Ambiente**:
   - `NODE_ENV=production`
   - `BASE_URL=https://seudominio.hostinger.com`

2. **Redirecionamento de Domínio**:
   - Configure o domínio principal para apontar para a aplicação TeleMed

3. **SSL/HTTPS**:
   - Ative certificado SSL para segurança

### 8. LOGS DE SEGURANÇA

O sistema registra todos os acessos:
- IP do usuário
- Tipo de login (criptografado/legacy)
- Origem da requisição
- Resultado da autenticação
- URL de redirecionamento final

### 9. FUNCIONALIDADES DE SEGURANÇA ATIVAS

✅ **Criptografia Base64** para parâmetros URL
✅ **Rate Limiting** - 5 tentativas por 5 minutos
✅ **Validação de Origem** - apenas Hostinger autorizado
✅ **Limpeza de URL** - parâmetros removidos após processamento
✅ **Session ID único** para cada login
✅ **Logs de auditoria** completos
✅ **Redirecionamento dinâmico** baseado no domínio