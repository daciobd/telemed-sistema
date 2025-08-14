import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Copy, Trash2, Loader2 } from "lucide-react";

const MAX_LEN = 2000;

// scrub básico de PII no cliente (extra-cautela)
const sanitize = (s: string) =>
  s
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ]")
    .replace(/\+?\d{2}\s?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}/g, "[PHONE]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]");

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-csrf": "1" }, // ok mesmo se não usar CSRF-lite
    body: JSON.stringify(body),
  });
  if (r.status === 401) throw new Error("Faça login.");
  if (r.status === 403) throw new Error("IA desabilitada ou sem permissão.");
  if (r.status === 428) throw new Error("Consentimento necessário (autorize a IA).");
  if (!r.ok) throw new Error(`Erro ${r.status}`);
  return r.json() as Promise<T>;
}

function isValid(s: string) {
  const t = s.trim();
  return t.length >= 6 && t.length <= MAX_LEN;
}

export default function AIConsolePage() {
  const [statusOk, setStatusOk] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("verificando…");

  // aba
  const [tab, setTab] = useState<"ask" | "code">("ask");
  const [pending, setPending] = useState(false);

  // Q&A
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const qCount = useMemo(() => question.trim().length, [question]);

  // Codegen
  const [spec, setSpec] = useState("");
  const [language, setLanguage] = useState<"ts" | "tsx" | "js">("ts");
  const [notes, setNotes] = useState("React + segurança; use React Query quando útil");
  const [code, setCode] = useState("");
  const sCount = useMemo(() => spec.trim().length, [spec]);

  useEffect(() => {
    fetch("/api/ai-agent/status", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw r;
        return r.json();
      })
      .then(() => {
        setStatusOk(true);
        setStatusMsg("online");
      })
      .catch(async (e) => {
        setStatusOk(false);
        const msg = e instanceof Response ? `offline (HTTP ${e.status})` : "offline";
        setStatusMsg(msg);
      });
  }, []);

  async function doAsk() {
    if (!isValid(question) || pending) return;
    setPending(true); setAnswer(""); setCode("");
    try {
      const data = await postJSON<{ answer?: string }>("/api/ai-agent/ask", {
        question: sanitize(question.trim()),
      });
      setAnswer(data.answer ?? "(sem conteúdo)");
      setHistory((h) => [question.trim(), ...h].slice(0, 5));
    } catch (e: any) {
      setAnswer(`⚠️ ${e.message || "Erro ao consultar o Agent"}`);
    } finally {
      setPending(false);
    }
  }

  async function doGenerate() {
    if (!isValid(spec) || pending) return;
    setPending(true); setCode(""); setAnswer("");
    try {
      const data = await postJSON<{ code?: string; notes?: string }>(
        "/api/ai-agent/generate-code",
        { specification: sanitize(spec.trim()), language, notes }
      );
      setCode(data.code || data.notes || "(sem conteúdo)");
    } catch (e: any) {
      setCode(`⚠️ ${e.message || "Erro ao gerar código"}`);
    } finally {
      setPending(false);
    }
  }

  const copy = async (txt: string) => { try { await navigator.clipboard.writeText(txt); } catch {} };
  const clear = () => { setQuestion(""); setSpec(""); setAnswer(""); setCode(""); };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">TeleMed AI Console — V2</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Faça perguntas técnicas ou gere trechos de código com segurança (sem PII).
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {statusOk ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : statusOk === false ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <span className="text-sm">Status do Agent:</span>
            <Badge variant={statusOk ? "default" : "destructive"} className="capitalize">
              {statusMsg}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Requisitos: login de <b>médico</b>, consentimento, <code>AI_ENABLED=true</code>.
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ask">Perguntar (Q&amp;A)</TabsTrigger>
          <TabsTrigger value="code">Gerar Código</TabsTrigger>
        </TabsList>

        {/* ==== ASK ==== */}
        <TabsContent value="ask" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pergunta para o Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="q">Pergunta (sem PII)</Label>
                <Textarea
                  id="q"
                  placeholder="Ex.: Explique opções de autenticação segura no TeleMed."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isValid(question) && !pending) doAsk();
                  }}
                  className="min-h-[140px]"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{question.trim().length}/{MAX_LEN}</span>
                  <span>Atalho: Ctrl/⌘ + Enter</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={doAsk} disabled={pending || !isValid(question)}>
                  {pending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Perguntando…</>) : "Perguntar ao Agent"}
                </Button>
                <Button variant="outline" onClick={clear}><Trash2 className="h-4 w-4 mr-2" />Limpar</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Resposta</Label>
                  {answer && (
                    <Button variant="ghost" size="sm" onClick={() => copy(answer)}>
                      <Copy className="h-4 w-4 mr-1" /> Copiar
                    </Button>
                  )}
                </div>
                {answer ? (
                  <pre className="text-sm whitespace-pre-wrap p-3 border rounded bg-muted/30">{answer}</pre>
                ) : (
                  <Alert><AlertDescription>Nenhuma resposta ainda.</AlertDescription></Alert>
                )}
              </div>

              {history.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Últimas perguntas</Label>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {history.map((h, i) => (
                        <Button key={i} variant="outline" className="justify-start"
                                onClick={() => setQuestion(h)} title="Reutilizar">
                          {h}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==== CODE ==== */}
        <TabsContent value="code" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gerar Código</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="spec">Especificação (sem PII)</Label>
                <Textarea
                  id="spec"
                  placeholder='Ex.: "Criar hook useAppointments com React Query chamando GET /api/appointments"'
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isValid(spec) && !pending) doGenerate();
                  }}
                  className="min-h-[140px]"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{sCount}/{MAX_LEN}</span>
                  <span>Atalho: Ctrl/⌘ + Enter</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Linguagem</Label>
                  <select
                    className="border rounded h-10 px-2"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                  >
                    <option value="ts">TypeScript</option>
                    <option value="tsx">TSX (React)</option>
                    <option value="js">JavaScript</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Notas (opcional)</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={doGenerate} disabled={pending || !isValid(spec)}>
                  {pending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando…</>) : "Gerar Código"}
                </Button>
                <Button variant="outline" onClick={clear}><Trash2 className="h-4 w-4 mr-2" />Limpar</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Saída</Label>
                  {code && (
                    <Button variant="ghost" size="sm" onClick={() => copy(code)}>
                      <Copy className="h-4 w-4 mr-1" /> Copiar
                    </Button>
                  )}
                </div>
                {code ? (
                  <pre className="text-sm whitespace-pre-wrap p-3 border rounded bg-muted/30 overflow-x-auto">
                    {code}
                  </pre>
                ) : (
                  <Alert><AlertDescription>Nenhum código gerado ainda.</AlertDescription></Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                ⚠️ Não envie dados pessoais (nome, CPF, telefone, e-mail).
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}