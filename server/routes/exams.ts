import { Router } from "express";

export const exams = Router();

const templates = [
  { 
    id: "hemograma", 
    name: "Hemograma completo", 
    routine: "Jejum de 8–12 horas",
    category: "Hematologia",
    description: "Avaliação completa dos elementos sanguíneos"
  },
  { 
    id: "glicemia", 
    name: "Glicemia de jejum", 
    routine: "Jejum rigoroso de 8–12 horas",
    category: "Bioquímica",
    description: "Dosagem da glicose plasmática"
  },
  { 
    id: "lipidograma", 
    name: "Perfil lipídico completo", 
    routine: "Jejum de 12 horas",
    category: "Bioquímica",
    description: "Colesterol total, HDL, LDL, triglicérides"
  },
  { 
    id: "tsh", 
    name: "TSH (hormônio estimulante da tireoide)", 
    routine: "Sem necessidade de jejum",
    category: "Endocrinologia",
    description: "Avaliação da função tireoidiana"
  },
  { 
    id: "ureia", 
    name: "Ureia e creatinina", 
    routine: "Sem necessidade de jejum",
    category: "Bioquímica",
    description: "Avaliação da função renal"
  },
  { 
    id: "eas", 
    name: "EAS - Exame de urina", 
    routine: "Primeira urina da manhã",
    category: "Urinálise",
    description: "Análise físico-química e microscópica da urina"
  },
  { 
    id: "ecg", 
    name: "Eletrocardiograma (ECG)", 
    routine: "Sem preparo especial",
    category: "Cardiologia",
    description: "Avaliação da atividade elétrica cardíaca"
  },
  { 
    id: "rx_torax", 
    name: "Radiografia de tórax (PA e perfil)", 
    routine: "Sem preparo especial",
    category: "Imagem",
    description: "Avaliação radiológica do tórax"
  },
  { 
    id: "eco_abdominal", 
    name: "Ultrassonografia de abdome total", 
    routine: "Jejum de 8 horas",
    category: "Imagem",
    description: "Avaliação ultrassonográfica dos órgãos abdominais"
  },
  { 
    id: "hba1c", 
    name: "Hemoglobina glicada (HbA1c)", 
    routine: "Sem necessidade de jejum",
    category: "Bioquímica",
    description: "Controle glicêmico dos últimos 2-3 meses"
  }
];

// In-memory storage for exam orders
const examOrders = new Map<string, any>();

/** GET /api/exams/templates */
exams.get("/templates", (_req, res) => {
  console.log(`📋 Templates de exames solicitados: ${templates.length} disponíveis`);
  res.json({ ok: true, templates });
});

/** GET /api/exams/templates/category/:category */
exams.get("/templates/category/:category", (req, res) => {
  const { category } = req.params;
  const filtered = templates.filter(t => 
    t.category.toLowerCase() === category.toLowerCase()
  );
  res.json({ ok: true, templates: filtered });
});

/** POST /api/exams/order */
exams.post("/order", (req, res) => {
  const { consultId, name, priority, instructions, category } = req.body ?? {};
  
  if (!consultId || !name) {
    return res.status(400).json({ 
      ok: false, 
      error: "consultId e name são obrigatórios" 
    });
  }

  const orderId = "EX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const order = {
    id: orderId,
    consultId,
    name,
    priority: priority || "Rotina",
    instructions: instructions || "",
    category: category || "Geral",
    status: "Solicitado",
    createdAt: new Date().toISOString(),
    estimatedDelivery: getEstimatedDelivery(priority)
  };

  examOrders.set(orderId, order);
  
  console.log(`🧪 Exame solicitado: ${name} (${orderId}) - Prioridade: ${priority}`);
  
  res.json({ ok: true, order });
});

/** GET /api/exams/orders/:consultId */
exams.get("/orders/:consultId", (req, res) => {
  const { consultId } = req.params;
  const orders = Array.from(examOrders.values())
    .filter(order => order.consultId === consultId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  res.json({ ok: true, orders });
});

/** GET /api/exams/order/:orderId */
exams.get("/order/:orderId", (req, res) => {
  const { orderId } = req.params;
  const order = examOrders.get(orderId);
  
  if (!order) {
    return res.status(404).json({ 
      ok: false, 
      error: "Pedido de exame não encontrado" 
    });
  }
  
  res.json({ ok: true, order });
});

/** PUT /api/exams/order/:orderId/status */
exams.put("/order/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  const order = examOrders.get(orderId);
  if (!order) {
    return res.status(404).json({ 
      ok: false, 
      error: "Pedido não encontrado" 
    });
  }
  
  order.status = status;
  order.updatedAt = new Date().toISOString();
  examOrders.set(orderId, order);
  
  console.log(`📊 Status do exame ${orderId} atualizado para: ${status}`);
  res.json({ ok: true, order });
});

function getEstimatedDelivery(priority: string): string {
  const now = new Date();
  let hours = 24; // Default: 24 hours
  
  switch (priority) {
    case "Urgente":
      hours = 2;
      break;
    case "Prioritário":
      hours = 6;
      break;
    case "Rotina":
    default:
      hours = 24;
      break;
  }
  
  now.setHours(now.getHours() + hours);
  return now.toISOString();
}

export default exams;