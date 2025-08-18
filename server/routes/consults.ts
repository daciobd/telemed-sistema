import { Router } from "express";

type Consult = {
  id: string;
  status: "waiting" | "in_progress" | "finished";
  startedAt?: string;
  endedAt?: string;
  notes?: {
    hda: string; // História da Doença Atual
    hypothesis?: { code?: string; label?: string };
    conduct?: string;
    alertSigns?: string;
    complexity?: {
      aggravation?: boolean;
      clinical?: boolean;
      inconsistencies?: boolean;
    };
    panelSize?: "sm" | "md" | "lg";
  };
  exams?: any[];
  recipes?: any[];
};

const db = new Map<string, Consult>(); // demo in-memory

export const consults = Router();

/** POST /api/consults/:id/start  */
consults.post("/:id/start", (req, res) => {
  const { id } = req.params;
  const c: Consult = db.get(id) ?? { id, status: "waiting" };
  c.status = "in_progress";
  c.startedAt = new Date().toISOString();
  db.set(id, c);
  console.log(`🏥 Consulta ${id} iniciada`);
  res.json({ ok: true, consult: c });
});

/** POST /api/consults/:id/notes */
consults.post("/:id/notes", (req, res) => {
  const { id } = req.params;
  const { hda, hypothesis, conduct, alertSigns, complexity, panelSize } = req.body ?? {};
  if (!hda || !conduct) return res.status(400).json({ ok:false, error:"Campos obrigatórios: hda, conduct" });

  const c: Consult = db.get(id) ?? { id, status: "in_progress" };
  c.notes = { hda, hypothesis, conduct, alertSigns, complexity, panelSize };
  db.set(id, c);
  console.log(`📝 Notas da consulta ${id} salvas`);
  res.json({ ok: true, consult: c });
});

/** POST /api/consults/:id/finalize */
consults.post("/:id/finalize", (req, res) => {
  const { id } = req.params;
  const { summary } = req.body ?? {};
  const c = db.get(id) ?? { id, status: "in_progress" as const };
  c.status = "finished";
  c.endedAt = new Date().toISOString();
  if (summary) {
    c.notes = { ...(c.notes ?? { hda: "", conduct: "" }), conduct: (c.notes?.conduct ?? "") + `\n\nResumo final: ${summary}` };
  }
  db.set(id, c);
  console.log(`✅ Consulta ${id} finalizada`);
  res.json({ ok: true, consult: c });
});

/** GET /api/consults/:id */
consults.get("/:id", (req, res) => {
  const { id } = req.params;
  const c = db.get(id);
  if (!c) return res.status(404).json({ ok: false, error: "Consulta não encontrada" });
  res.json({ ok: true, consult: c });
});

export default consults;