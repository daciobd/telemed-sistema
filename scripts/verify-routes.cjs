const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT||5000}`;
const alias = [
  "/enhanced","/enhanced-consultation","/enhanced-teste",
  "/doctor-dashboard","/dashboard-teste","/dashboard-teste.html","/enhanced-system"
];
const canon = ["/", "/agenda", "/consulta", "/dashboard"];

async function head(p){ 
  try {
    const r = await fetch(BASE+p, {redirect:"manual"}); 
    return {p, s:r.status, loc:r.headers.get('location')}; 
  } catch(e) {
    return {p, s:"ERROR", loc:e.message};
  }
}

(async ()=>{
  console.log(`🔍 Verificando rotas em: ${BASE}`);
  const rows = [];
  
  // Testar rotas canônicas
  for(const p of canon) rows.push(await head(p));
  
  // Testar aliases com query string
  for(const p of alias) rows.push(await head(p+"?x=1&y=2")); 
  
  console.table(rows);
  
  const bad = rows.filter(r=>{
    if (canon.includes(r.p)) return !(r.s>=200 && r.s<400);
    if (alias.includes(r.p.replace(/\?.*$/,''))) return !(String(r.s).startsWith("30") && r.loc && /(\?|&)x=1/.test(r.loc));
    return true;
  });
  
  if (bad.length){ 
    console.error("❌ Falhas:", bad); 
    process.exit(1); 
  }
  console.log("✅ Rotas canônicas/redirects ok");
})();