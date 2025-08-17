/* Node 20+ (fetch nativo) */
const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT||5000}`;

const ENDPOINTS = {
  health:    "/api/status",
  consults:  "/api/consultations",     // ajuste aqui se seus nomes diferirem
  exams:     "/api/exam-orders",       // idem
  payments:  "/api/payments/intent"    // idem
};

async function req(method, path, body){
  const r = await fetch(BASE+path, {
    method, headers:{ "Content-Type":"application/json" },
    body: body? JSON.stringify(body): undefined
  });
  let json = null;
  try { json = await r.json(); } catch {}
  return { status:r.status, json };
}

(async ()=>{
  const out = [];

  // health
  out.push(["health", await req("GET", ENDPOINTS.health)]);

  // create consultation (mock)
  out.push(["create_consultation", await req("POST", ENDPOINTS.consults, {
    patientId: "demo-p", doctorId: "demo-d", reason: "dor de cabeça"
  })]);

  // list consultations
  out.push(["list_consultations", await req("GET", ENDPOINTS.consults)]);

  // create exam order
  out.push(["create_exam", await req("POST", ENDPOINTS.exams, {
    consultationId: out[1][1].json?.id ?? "demo-c", type: "hemograma"
  })]);

  // payment intent
  out.push(["payment_intent", await req("POST", ENDPOINTS.payments, {
    consultationId: out[1][1].json?.id ?? "demo-c", amount: 9900, currency: "BRL"
  })]);

  // rules (bem leves; ajuste conforme seu contrato real)
  const failures = out.filter(([name,res])=>{
    if (!res) return true;
    if (name==="health") return res.status!==200;
    if (name==="list_consultations") return !(Array.isArray(res.json));
    return !String(res.status).startsWith("2");
  });

  console.table(out.map(([k,v])=>({step:k,status:v.status})));
  if (failures.length){
    console.error("Contract failures:", failures.map(f=>f[0]));
    process.exit(1);
  } else {
    console.log("✓ Contract tests passed");
  }
})();