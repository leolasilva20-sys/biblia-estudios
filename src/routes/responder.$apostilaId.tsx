import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ChevronLeft, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/responder/$apostilaId")({
  head: () => ({ meta: [{ title: "Prova — Bíblia Estúdios" }] }),
  component: ResponderProva,
});

type Licao = {
  id: number;
  apostila_id: number;
  topico: string;
  pergunta: string;
  tipo: "alternativa" | "dissertativa";
  alternativas: string[] | null;
  resposta_correta: string | null;
  ordem: number;
};

type Resposta = {
  id?: number;
  licao_id: number;
  resposta: string | null;
  status: "rascunho" | "enviada" | "corrigida";
  nota: number | null;
  visto: boolean | null;
  visto_em: string | null;
};

function ResponderProva() {
  const { apostilaId } = useParams({ from: "/responder/$apostilaId" });
  const apId = Number(apostilaId);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [licoes, setLicoes] = useState<Licao[] | null>(null);
  const [respostas, setRespostas] = useState<Record<number, Resposta>>({});
  const [titulo, setTitulo] = useState<string>("");
  const [idx, setIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (!user || !profile?.acesso_liberado || !apId) return;
    (async () => {
      const { data: lc, error: e1 } = await supabase
        .from("licoes")
        .select("*")
        .eq("apostila_id", apId)
        .order("ordem", { ascending: true });
      if (e1) { toast.error(e1.message); return; }

      const { data: ap } = await supabase
        .from("apostilas")
        .select("title")
        .eq("id", apId)
        .maybeSingle();
      setTitulo((ap as any)?.title ?? `Apostila #${apId}`);

      const { data: rs } = await supabase
        .from("respostas")
        .select("id, licao_id, resposta, status, nota, visto, visto_em")
        .eq("user_id", user.id)
        .eq("apostila_id", apId);

      const map: Record<number, Resposta> = {};
      (rs ?? []).forEach((r: any) => { if (r.licao_id) map[r.licao_id] = r; });
      setRespostas(map);
      setLicoes((lc ?? []) as Licao[]);
    })();
  }, [user, profile, apId]);

  const allEnviada = useMemo(() => {
    if (!licoes || licoes.length === 0) return false;
    return licoes.every((l) => {
      const r = respostas[l.id];
      return r && (r.status === "enviada" || r.status === "corrigida");
    });
  }, [licoes, respostas]);

  const allCorrigida = useMemo(() => {
    if (!licoes || licoes.length === 0) return false;
    return licoes.every((l) => respostas[l.id]?.status === "corrigida");
  }, [licoes, respostas]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppSidebar />
        <main className="flex-1 container mx-auto max-w-3xl px-6 py-10 text-muted-foreground">Carregando...</main>
      </div>
    );
  }

  if (!user || !profile?.acesso_liberado) return null;

  if (licoes === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppSidebar />
        <main className="flex-1 container mx-auto max-w-3xl px-6 py-10 text-muted-foreground">Carregando prova...</main>
      </div>
    );
  }

  if (licoes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppSidebar />
        <main className="flex-1 container mx-auto max-w-3xl px-6 py-10">
          <Link to="/responder"><Button variant="ghost" size="sm" className="mb-6"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button></Link>
          <p className="text-muted-foreground">Nenhuma pergunta cadastrada para esta apostila.</p>
        </main>
      </div>
    );
  }

  // Se já foi enviada/corrigida, mostrar resumo
  if (allEnviada) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppSidebar />
        <main className="flex-1 container mx-auto max-w-3xl px-6 py-10">
          <Link to="/responder"><Button variant="ghost" size="sm" className="mb-6"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button></Link>
          <div className="mb-8">
            <p className="text-sm text-gold uppercase tracking-widest">Prova</p>
            <h1 className="font-serif text-3xl gold-text-gradient mt-2">{titulo}</h1>
          </div>

          {!allCorrigida ? (
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-sky-400 mx-auto mb-3" />
              <h2 className="font-serif text-2xl mb-2">Prova enviada</h2>
              <p className="text-muted-foreground">Suas respostas foram enviadas e estão aguardando correção.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                <h2 className="font-serif text-2xl mb-1">Prova corrigida</h2>
                <p className="text-muted-foreground">Veja abaixo o resultado por pergunta.</p>
              </div>
              {licoes.map((l) => {
                const r = respostas[l.id];
                return (
                  <div key={l.id} className="rounded-xl border border-border/60 bg-card/60 p-5">
                    <p className="text-xs text-gold uppercase tracking-wider">{l.topico}</p>
                    <p className="font-serif text-lg mt-1">{l.pergunta}</p>
                    <p className="text-sm text-muted-foreground mt-2"><strong>Sua resposta:</strong> {r?.resposta || <em>(em branco)</em>}</p>
                    {typeof r?.nota === "number" && (
                      <p className="text-sm mt-2 text-emerald-400"><strong>Nota:</strong> {r.nota}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  const total = licoes.length;
  const licao = licoes[idx];
  const resp = respostas[licao.id];
  const currentValue = resp?.resposta ?? "";
  const answeredCount = licoes.filter((l) => (respostas[l.id]?.resposta ?? "").trim() !== "").length;

  const setCurrent = (val: string) => {
    setRespostas((prev) => ({
      ...prev,
      [licao.id]: {
        ...(prev[licao.id] ?? { licao_id: licao.id, status: "rascunho", nota: null, visto: null, visto_em: null, resposta: null }),
        resposta: val,
        status: "rascunho",
      } as Resposta,
    }));
  };

  const persistCurrent = async () => {
    if (!user) return;
    const r = respostas[licao.id];
    const value = (r?.resposta ?? "").trim();
    setSaving(true);
    const payload: any = {
      user_id: user.id,
      apostila_id: apId,
      licao_id: licao.id,
      pergunta: licao.pergunta,
      resposta: value || null,
      status: "rascunho",
    };
    const { data, error } = await supabase
      .from("respostas")
      .upsert(payload, { onConflict: "user_id,licao_id" })
      .select("id")
      .maybeSingle();
    setSaving(false);
    if (error) { toast.error("Erro ao salvar: " + error.message); return; }
    if (data?.id && !respostas[licao.id]?.id) {
      setRespostas((prev) => ({ ...prev, [licao.id]: { ...(prev[licao.id] as Resposta), id: data.id } }));
    }
  };

  const goPrev = async () => { await persistCurrent(); setIdx((i) => Math.max(0, i - 1)); };
  const goNext = async () => { await persistCurrent(); setIdx((i) => Math.min(total - 1, i + 1)); };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    // Persiste a atual primeiro
    await persistCurrent();

    // Garante que todas as licoes tenham uma linha em respostas (cria placeholders para perguntas sem resposta)
    const toUpsert = licoes.map((l) => {
      const r = respostas[l.id];
      return {
        user_id: user.id,
        apostila_id: apId,
        licao_id: l.id,
        pergunta: l.pergunta,
        resposta: (r?.resposta ?? "").trim() || null,
        status: "enviada" as const,
      };
    });

    const { error } = await supabase
      .from("respostas")
      .upsert(toUpsert, { onConflict: "user_id,licao_id" });
    setSubmitting(false);
    if (error) { toast.error("Erro ao enviar: " + error.message); return; }
    toast.success("Prova enviada para correção!");
    navigate({ to: "/responder" });
  };

  const isLast = idx === total - 1;

  return (
    <div className="min-h-screen flex flex-col">
      <AppSidebar />
      <main className="flex-1 container mx-auto max-w-3xl px-6 py-10">
        <Link to="/responder">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </Link>

        <div className="mb-6">
          <p className="text-sm text-gold uppercase tracking-widest">Prova</p>
          <h1 className="font-serif text-3xl gold-text-gradient mt-2">{titulo}</h1>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Pergunta {idx + 1} de {total}</span>
            <span>{answeredCount} respondida{answeredCount === 1 ? "" : "s"}</span>
          </div>
          <Progress value={((idx + 1) / total) * 100} className="mt-2" />
        </div>

        {/* Navegação rápida por número */}
        <div className="flex flex-wrap gap-2 mb-6">
          {licoes.map((l, i) => {
            const answered = (respostas[l.id]?.resposta ?? "").trim() !== "";
            const active = i === idx;
            return (
              <button
                key={l.id}
                type="button"
                onClick={async () => { await persistCurrent(); setIdx(i); }}
                className={`h-8 w-8 text-xs rounded-md border transition-colors ${
                  active
                    ? "border-gold bg-gold/20 text-gold"
                    : answered
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500"
                      : "border-border bg-card/40 text-muted-foreground hover:border-gold/40"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6">
          <p className="text-xs text-gold uppercase tracking-wider">{licao.topico}</p>
          <h2 className="font-serif text-xl md:text-2xl mt-2 mb-5">{licao.pergunta}</h2>

          {licao.tipo === "alternativa" && Array.isArray(licao.alternativas) ? (
            <RadioGroup
              value={currentValue}
              onValueChange={setCurrent}
              className="gap-3"
            >
              {licao.alternativas.map((alt, i) => {
                const letra = String.fromCharCode(65 + i); // A, B, C, D
                return (
                  <Label
                    key={i}
                    htmlFor={`opt-${licao.id}-${i}`}
                    className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      currentValue === letra ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                    }`}
                  >
                    <RadioGroupItem value={letra} id={`opt-${licao.id}-${i}`} className="mt-1" />
                    <span className="text-sm leading-relaxed">{alt}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          ) : (
            <Textarea
              value={currentValue}
              onChange={(e) => setCurrent(e.target.value)}
              rows={8}
              placeholder="Escreva sua resposta..."
            />
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={goPrev} disabled={idx === 0 || saving}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>

          {!isLast ? (
            <Button onClick={goNext} disabled={saving} className="bg-gold text-primary-foreground hover:opacity-90">
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={saving || submitting} className="bg-gold text-primary-foreground hover:opacity-90">
                  <Send className="h-4 w-4 mr-1" /> Enviar prova
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enviar prova?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você respondeu {answeredCount} de {total} perguntas. Após enviar você não poderá mais editar suas respostas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Enviando..." : "Confirmar envio"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          {saving ? "Salvando rascunho..." : "Suas respostas são salvas automaticamente como rascunho ao navegar."}
        </p>
      </main>
    </div>
  );
}
