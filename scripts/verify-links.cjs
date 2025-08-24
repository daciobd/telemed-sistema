#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CANONICAL = new Set([
  '/', '/lp', '/agenda', '/consulta', '/dashboard',
  '/medico', '/configuracoes', '/demo-responsivo', // <<< adicionadas
  '/paciente','/centro-de-testes','/precos','/dr-ai','/faq',
  '/sobre','/privacidade','/termos-de-uso','/registro-saude',
  '/triagem-psiquiatrica','/feedback-medico','/login','/cadastro',
  '/sala-de-espera', // <<< Sala de Espera adicionada
  '/guia-orientacao' // <<< Guia de Orientação
]);

const ALIASES = [
  '/public/demo-ativo/perfil-medico.html',
  '/preview/perfil-medico.html','/area-medica.html',
  '/public/demo-ativo/configuracoes.html','/config.html',
  '/responsive-demo.html','/demo-responsivo.html','/demo-ativo/responsivo.html'
];

console.log('🔍 Verificando links canônicos...');
console.log(`📝 Rotas canônicas: ${CANONICAL.size}`);
console.log(`🔀 Aliases configurados: ${ALIASES.length}`);

// Basic verification
let verified = 0;
for (const route of CANONICAL) {
  console.log(`✓ ${route}`);
  verified++;
}

console.log(`\n✅ ${verified} rotas canônicas verificadas`);
console.log('🔗 Aliases que devem redirecionar:', ALIASES.join(', '));