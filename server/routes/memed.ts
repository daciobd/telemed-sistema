import { Router } from "express";

export const memed = Router();

// In-memory storage for prescriptions
const prescriptions = new Map<string, any>();

/** GET /api/memed/launch?name=Ana&age=30&phone=1198765... */
memed.get("/launch", (req, res) => {
  const { name, age, phone } = req.query;
  
  if (!name) {
    return res.status(400).json({ 
      ok: false, 
      error: "Nome do paciente é obrigatório" 
    });
  }

  // In production, generate token/URL according to Memed documentation
  // For now, we create a demo URL that opens the Memed prescription platform
  const params = new URLSearchParams({
    demo: "1",
    patient: JSON.stringify({
      name: String(name),
      age: age ? Number(age) : 0,
      phone: String(phone || "")
    })
  });
  
  const url = `https://memed.com.br/?${params.toString()}`;
  
  console.log(`💊 Memed lançado para paciente: ${name}`);
  
  res.json({ 
    ok: true, 
    url,
    message: "Abrindo plataforma MedMed para prescrição digital"
  });
});

/** POST /api/memed/webhook (receives prescription completion) */
memed.post("/webhook", (req, res) => {
  const prescriptionData = req.body;
  
  // Store the prescription in your database
  const prescriptionId = "MEMED-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const prescription = {
    id: prescriptionId,
    ...prescriptionData,
    status: "Assinada",
    createdAt: new Date().toISOString(),
    source: "memed"
  };
  
  prescriptions.set(prescriptionId, prescription);
  
  console.log("📋 Webhook Memed recebido:", prescriptionData);
  console.log(`💊 Receita ${prescriptionId} armazenada`);
  
  res.json({ ok: true, prescriptionId });
});

/** GET /api/memed/prescriptions/:consultId */
memed.get("/prescriptions/:consultId", (req, res) => {
  const { consultId } = req.params;
  
  // Filter prescriptions by consultId
  const consultPrescriptions = Array.from(prescriptions.values())
    .filter(p => p.consultId === consultId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  res.json({ ok: true, prescriptions: consultPrescriptions });
});

/** POST /api/memed/prescription/demo */
memed.post("/prescription/demo", (req, res) => {
  const { consultId, patientName, medications } = req.body;
  
  // Create a demo prescription for testing
  const prescriptionId = "MEMED-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const prescription = {
    id: prescriptionId,
    consultId,
    patientName,
    medications: medications || [
      {
        name: "Dipirona Sódica",
        dosage: "500mg",
        instructions: "1 comprimido de 6/6 horas se dor ou febre",
        quantity: "20 comprimidos"
      }
    ],
    status: "Assinada",
    createdAt: new Date().toISOString(),
    source: "memed",
    digitalSignature: true,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
  
  prescriptions.set(prescriptionId, prescription);
  
  console.log(`💊 Receita demo criada: ${prescriptionId} para ${patientName}`);
  
  res.json({ ok: true, prescription });
});

/** GET /api/memed/prescription/:id/pdf */
memed.get("/prescription/:id/pdf", (req, res) => {
  const { id } = req.params;
  const prescription = prescriptions.get(id);
  
  if (!prescription) {
    return res.status(404).json({ 
      ok: false, 
      error: "Receita não encontrada" 
    });
  }
  
  // In production, this would generate/return the actual PDF
  // For demo, we return a download link
  const pdfUrl = `https://memed.com.br/prescription/${id}/download.pdf`;
  
  res.json({ 
    ok: true, 
    pdfUrl,
    message: "Link para download da receita em PDF" 
  });
});

/** DELETE /api/memed/prescription/:id */
memed.delete("/prescription/:id", (req, res) => {
  const { id } = req.params;
  const prescription = prescriptions.get(id);
  
  if (!prescription) {
    return res.status(404).json({ 
      ok: false, 
      error: "Receita não encontrada" 
    });
  }
  
  // Mark as cancelled instead of deleting (for audit trail)
  prescription.status = "Cancelada";
  prescription.cancelledAt = new Date().toISOString();
  prescriptions.set(id, prescription);
  
  console.log(`🗑️ Receita ${id} cancelada`);
  
  res.json({ 
    ok: true, 
    message: "Receita cancelada com sucesso" 
  });
});

export default memed;