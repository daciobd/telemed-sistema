import { Router } from "express";
import fs from "fs";
import path from "path";

let data: {code:string; label:string}[] = [];

try {
  const filePath = path.join(__dirname, "..", "cid10.json");
  data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(`📋 CID-10 carregado: ${data.length} códigos`);
} catch (error) {
  console.error("⚠️ Erro ao carregar CID-10:", error);
  // Fallback data
  data = [
    { "code": "F41.1", "label": "Transtorno de ansiedade generalizada" },
    { "code": "J00", "label": "Nasofaringite aguda (resfriado comum)" },
    { "code": "I10", "label": "Hipertensão essencial (primária)" },
    { "code": "E11.9", "label": "Diabetes mellitus tipo 2 sem complicações" },
    { "code": "R51", "label": "Cefaleia" },
    { "code": "R50.9", "label": "Febre não especificada" }
  ];
}

export const cid10 = Router();

/** GET /api/cid10?query=ansiedade */
cid10.get("/", (req, res) => {
  const q = String(req.query.query || "").toLowerCase().trim();
  if (!q || q.length < 2) return res.json([]);
  
  const result = data
    .filter(x => 
      x.code.toLowerCase().includes(q) || 
      x.label.toLowerCase().includes(q)
    )
    .slice(0, 20)
    .sort((a, b) => {
      // Prioritize exact code matches
      if (a.code.toLowerCase().startsWith(q)) return -1;
      if (b.code.toLowerCase().startsWith(q)) return 1;
      
      // Then prioritize label matches at the beginning
      if (a.label.toLowerCase().startsWith(q)) return -1;
      if (b.label.toLowerCase().startsWith(q)) return 1;
      
      return 0;
    });
  
  console.log(`🔍 CID-10 busca: "${q}" → ${result.length} resultados`);
  res.json(result);
});

/** GET /api/cid10/:code */
cid10.get("/:code", (req, res) => {
  const { code } = req.params;
  const item = data.find(x => x.code.toUpperCase() === code.toUpperCase());
  if (!item) return res.status(404).json({ ok: false, error: "Código não encontrado" });
  res.json({ ok: true, item });
});

export default cid10;