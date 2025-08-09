# 🔗 LINKS DO SISTEMA TELEMED - VERSÃO ATUAL 2025

**Data de atualização:** 2025-08-09  
**Base:** App.tsx atual com rotas funcionais  
**Status:** DOCUMENTO OFICIAL - Usar apenas este  

## 🌐 DOMÍNIOS E AMBIENTES

### Produção (Render)
```
https://telemed-sistema.onrender.com
```

### Desenvolvimento (Replit)
```
https://[SEU-PROJETO].replit.app
```

### Local
```
http://localhost:5000
```

## 🎯 ROTAS PRINCIPAIS (SPA REACT)

### 📋 PÁGINA INICIAL E LOGIN
```
/                    → LandingPageUnified (Página inicial)
/landing             → LandingPageUnified (Alias)
/login               → LoginPage
```

### 🏥 DASHBOARDS PRINCIPAIS
```
/doctor-dashboard    → DoctorDashboardInline (Dashboard Médico Principal)
/patient-dashboard   → PatientDashboardUnified (Dashboard Paciente)
/dashboard           → PatientDashboardUnified (Alias)
```

### 💰 SISTEMA DE LEILÕES/LANCES
```
/patient-bidding     → PatientBiddingPage (Fazer Lance)
/fazer-lance         → PatientBiddingPage (Alias)
/lances              → PatientBiddingPage (Alias)
```

### 📅 AGENDAMENTO E AGENDA
```
/agendamento         → AgendamentoEspecialidade
/agenda-dia          → AgendaDia
/agenda              → AgendaDia (Alias)
```

### 🔧 FUNCIONALIDADES CORE
```
/security            → SecurityPage (LGPD/Segurança)
/monitoring          → MonitoringDashboard
/medical-pro         → DashboardMedicalPro
/diagnostic          → DiagnosticPage
```

### 👤 JORNADA DO PACIENTE
```
/patient-journey/:patientId  → PatientJourneyPage (Com ID)
/patient-journey-demo        → PatientJourneyDemo
```

### 📚 ONBOARDING E DEMOS
```
/onboarding-demo     → OnboardingDemo
/onboarding-fixed    → OnboardingFixed
/success             → OnboardingSuccess
/legacy-demo         → LegacyDemoPage
```

### 🏥 DASHBOARDS LEGADOS (Compatibilidade)
```
/doctor-dashboard-legacy  → DoctorDashboard
/simple-dashboard         → SimpleDashboard
```

## 🔗 LINKS PARA BOTÕES (COPY & PASTE)

### 🎯 CTAs PRINCIPAIS
```html
<!-- Começar Consulta / Fazer Lance -->
<button onclick="window.location.href='/patient-bidding'">
    Começar Consulta
</button>

<!-- Login/Cadastro -->
<button onclick="window.location.href='/login'">
    Entrar / Cadastrar
</button>

<!-- Dashboard Médico -->
<button onclick="window.location.href='/doctor-dashboard'">
    Área Médica
</button>

<!-- Dashboard Paciente -->
<button onclick="window.location.href='/patient-dashboard'">
    Minha Área
</button>
```

### 🩺 ESPECIALIDADES E FUNCIONALIDADES
```html
<!-- Agendamento -->
<button onclick="window.location.href='/agendamento'">
    Agendar Consulta
</button>

<!-- Ver Agenda -->
<button onclick="window.location.href='/agenda-dia'">
    Minha Agenda
</button>

<!-- Segurança/LGPD -->
<button onclick="window.location.href='/security'">
    Segurança e Privacidade
</button>

<!-- Monitoramento -->
<button onclick="window.location.href='/monitoring'">
    Sistema de Monitoramento
</button>
```

## 🌍 LINKS EXTERNOS (PARA HOSTINGER)

### Base URL Completa
```html
<!-- Página Inicial -->
<a href="https://telemed-sistema.onrender.com/">
    TeleMed Sistema
</a>

<!-- Fazer Lance -->
<a href="https://telemed-sistema.onrender.com/patient-bidding">
    Começar Consulta
</a>

<!-- Dashboard Médico -->
<a href="https://telemed-sistema.onrender.com/doctor-dashboard">
    Portal Médico
</a>

<!-- Login -->
<a href="https://telemed-sistema.onrender.com/login">
    Acessar Sistema
</a>
```

## ⚡ NAVEGAÇÃO REACT (wouter)

### Para desenvolvimento React
```jsx
import { useLocation } from 'wouter';

// Navegação programática
const [, setLocation] = useLocation();

// Exemplos de navegação
setLocation('/patient-bidding');    // Fazer lance
setLocation('/doctor-dashboard');   // Dashboard médico
setLocation('/login');              // Login
setLocation('/agenda-dia');         // Agenda
```

### Componente Link
```jsx
import { Link } from 'wouter';

<Link href="/patient-bidding">Começar Consulta</Link>
<Link href="/doctor-dashboard">Área Médica</Link>
<Link href="/login">Entrar</Link>
```

## 🔒 ROTAS PROTEGIDAS

### Requer Autenticação
```
/doctor-dashboard        (Médicos)
/patient-dashboard       (Pacientes)
/medical-pro            (Médicos)
/monitoring             (Admin)
```

### Públicas
```
/                       (Landing)
/login                  (Login)
/security               (Informações)
/patient-bidding        (Lances)
```

## 🎨 404 E FALLBACK

### Página não encontrada
```
Qualquer rota não mapeada → 404 customizado
Mensagem: "🔥 Onboarding System v2.0 - FUNCIONANDO"
```

---

## 📝 NOTAS IMPORTANTES

1. **Todas as rotas usam React SPA** - Não há recarregamento de página
2. **Wouter para roteamento** - Não usar react-router
3. **URLs amigáveis** - Sem # ou parâmetros complexos
4. **Responsivo** - Funciona em desktop e mobile
5. **SEO-friendly** - Meta tags configuradas

## 🗑️ DOCUMENTOS OBSOLETOS

**ELIMINAR estes arquivos antigos:**
- LINKS_COPY_PASTE_PRONTOS.md
- LINKS_HOSTINGER_TELEMED.md  
- LINKS_CORRETOS_FINAIS.md
- LINKS_NAVEGACAO_CORRIGIDOS.md
- LINKS_VERIFICACAO_TELEMED.md
- Todos os outros LINKS_*.md

**USAR APENAS:** `LINKS_SISTEMA_TELEMED_2025_ATUAL.md` (este documento)

---

**Última verificação:** 2025-08-09 14:30  
**Autor:** Sistema TeleMed  
**Versão:** 2.0 Final