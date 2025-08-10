#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Lista de arquivos funcionais do projeto TeleMed
const functionalFiles = [
    // Configuração Principal
    'package.json',
    'tsconfig.json',
    'tailwind.config.ts',
    'postcss.config.js',
    'vite.config.ts',
    'drizzle.config.ts',
    'components.json',
    
    // Backend Core
    'server/index.ts',
    'server/db.ts',
    'server/auth.ts',
    'server/storage.ts',
    'server/chatgpt-agent.ts',
    
    // Backend Routes
    'server/routes.ts',
    'server/routes/ai-agent.ts',
    'server/routes/medical-reports.ts',
    'server/routes/notifications.ts',
    
    // Backend Security
    'server/security/audit-logger.ts',
    'server/security/encryption.ts',
    'server/security/lgpd-compliance.ts',
    
    // Frontend Core
    'client/src/App.tsx',
    'client/src/main.tsx',
    'client/src/index.css',
    
    // Frontend Hooks
    'client/src/hooks/useAuth.ts',
    'client/src/hooks/use-toast.ts',
    'client/src/hooks/useNotifications.ts',
    
    // Frontend Pages
    'client/src/pages/dashboard.tsx',
    'client/src/pages/LoginPage.tsx',
    'client/src/pages/DoctorDashboardUnified.tsx',
    'client/src/pages/PatientDashboardUnified.tsx',
    'client/src/pages/DiagnosticPage.tsx',
    'client/src/pages/SecurityPage.tsx',
    'client/src/pages/MonitoringDashboard.tsx',
    
    // Frontend Components
    'client/src/components/layout/header.tsx',
    
    // Frontend Utils
    'client/src/lib/queryClient.ts',
    'client/src/lib/utils.ts',
    'client/src/lib/authUtils.ts',
    
    // Build Scripts
    'build.js',
    'start.js',
    
    // Landing Page
    'landing-page-simple.html',
    
    // Schemas
    'shared/schema.ts',
    
    // Environment
    '.env.example',
    
    // Documentation
    'README.md',
    'replit.md'
];

// Função para criar estrutura de diretórios no ZIP
function ensureDirectoryStructure(filePath, baseDir) {
    const dir = path.dirname(filePath);
    if (dir && dir !== '.') {
        const fullDir = path.join(baseDir, dir);
        if (!fs.existsSync(fullDir)) {
            fs.mkdirSync(fullDir, { recursive: true });
        }
    }
}

// Função principal para criar o ZIP
async function createFunctionalZip() {
    console.log('🚀 Iniciando criação do ZIP dos arquivos funcionais do TeleMed...');
    
    const zipDir = path.join(projectRoot, 'dist', 'telemed-functional');
    const zipPath = path.join(projectRoot, 'dist', 'telemed-functional.zip');
    
    // Cria diretório temporário
    if (fs.existsSync(zipDir)) {
        fs.rmSync(zipDir, { recursive: true, force: true });
    }
    fs.mkdirSync(zipDir, { recursive: true });
    
    let copiedFiles = 0;
    let skippedFiles = 0;
    
    // Copia arquivos funcionais
    for (const file of functionalFiles) {
        const sourcePath = path.join(projectRoot, file);
        const destPath = path.join(zipDir, file);
        
        try {
            if (fs.existsSync(sourcePath)) {
                const stats = fs.statSync(sourcePath);
                if (stats.isFile()) {
                    ensureDirectoryStructure(file, zipDir);
                    fs.copyFileSync(sourcePath, destPath);
                    copiedFiles++;
                    console.log(`✅ Copiado: ${file}`);
                } else {
                    console.log(`⚠️  Pulado (diretório): ${file}`);
                    skippedFiles++;
                }
            } else {
                console.log(`⚠️  Arquivo não encontrado: ${file}`);
                skippedFiles++;
            }
        } catch (error) {
            console.error(`❌ Erro ao copiar ${file}:`, error.message);
            skippedFiles++;
        }
    }
    
    // Cria arquivo README.txt com instruções
    const readmeContent = `# TeleMed Sistema - Arquivos Funcionais

Este ZIP contém todos os arquivos funcionais do projeto TeleMed.

## Estrutura do Projeto:

### Configuração
- package.json: Dependências e scripts
- tsconfig.json: Configuração TypeScript
- tailwind.config.ts: Configuração Tailwind CSS
- vite.config.ts: Configuração Vite

### Backend (Node.js + Express)
- server/index.ts: Servidor principal
- server/db.ts: Conexão banco PostgreSQL
- server/auth.ts: Sistema autenticação JWT
- server/routes/: APIs e endpoints
- server/security/: Segurança e LGPD

### Frontend (React + TypeScript)
- client/src/App.tsx: Aplicação React principal
- client/src/pages/: Páginas do sistema
- client/src/components/: Componentes reutilizáveis
- client/src/hooks/: Hooks customizados

### Build e Deploy
- build.js: Script de build
- landing-page-simple.html: Landing page standalone

## Como executar:
1. npm install
2. npm run dev

## URLs:
- Desenvolvimento: Replit environment
- Produção: telemed-sistema.onrender.com

Total de arquivos incluídos: ${copiedFiles}
Arquivos pulados: ${skippedFiles}
Data: ${new Date().toLocaleDateString('pt-BR')}
`;
    
    fs.writeFileSync(path.join(zipDir, 'README.txt'), readmeContent);
    
    // Usa comando zip nativo se disponível, senão cria tar
    try {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        
        // Remove ZIP anterior se existir
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
        
        // Cria ZIP
        const zipCommand = `cd "${path.dirname(zipDir)}" && zip -r telemed-functional.zip telemed-functional/`;
        await execAsync(zipCommand);
        
        console.log(`\n🎉 ZIP criado com sucesso!`);
        console.log(`📁 Localização: ${zipPath}`);
        console.log(`📊 Arquivos incluídos: ${copiedFiles + 1} (+ README.txt)`);
        
        // Remove diretório temporário
        fs.rmSync(zipDir, { recursive: true, force: true });
        
        return zipPath;
        
    } catch (error) {
        console.error('❌ Erro ao criar ZIP:', error.message);
        console.log('💡 Mantendo diretório temporário em:', zipDir);
        return zipDir;
    }
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    createFunctionalZip()
        .then(result => {
            console.log('\n✅ Processo concluído!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Erro:', error);
            process.exit(1);
        });
}

export { createFunctionalZip };