import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/responder")({
  head: () => ({ meta: [{ title: "Responder — Bíblia Estúdios" }] }),
  component: ResponderList,
});

type ApostilaItem = {
  apostila_id: number;
  titulo: string;
  total: number;
  status: "nao_iniciado" | "rascunho" | "enviada" | "corrigida";
};

function ResponderList() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ApostilaItem[] | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (!user || !profile?.acesso_liberado) return;
    (async () => {
      const { data: licoes } = await supabase
        .from("licoes")
        .select("apostila_id");
      const counts = new Map<number, number>();
      (licoes ?? []).forEach((l: any) => {
        counts.set(l.apostila_id, (counts.get(l.apostila_id) ?? 0) + 1);
      });
      const ids = Array.from(counts.keys());
      if (ids.length === 0) { setItems([]); return; }

      const { data: apostilas } = await supabase
        .from("apostilas")
        .select("id, title")
        .in("id", ids);
      const titulos = new Map<number, string>();
      (apostilas ?? []).forEach((a: any) => titulos.set(a.id, a.title));

      const { data: respostas } = await supabase
        .from("respostas")
        .select("apostila_id, status")
        .eq("user_id", user.id)
        .in("apostila_id", ids);

      const statusMap = new Map<number, ApostilaItem["status"]>();
      (respostas ?? []).forEach((r: any) => {
        const cur = statusMap.get(r.apostila_id);
        const order = ["nao_iniciado", "rascunho", "enviada", "corrigida"];
        const next = r.status === "corrigida" ? "corrigida"
          : r.status === "enviada" ? "enviada"
          : "rascunho";
        if (!cur || order.indexOf(next) > order.indexOf(cur)) statusMap.set(r.apostila_id, next);
      });

      const result: ApostilaItem[] = ids.map((id) => ({
        apostila_id: id,
        titulo: titulos.get(id) ?? `Apostila #${id}`,
        total: counts.get(id) ?? 0,
        status: statusMap.get(id) ?? "nao_iniciado",
      })).sort((a, b) => a.apostila_id - b.apostila_id);

      setItems(result);
    })();
  }, [user, profile]);

  if (!user || !profile?.acesso_liberado) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <AppSidebar />
      <main className="flex-1 container mx-auto max-w-3xl px-6 py-10">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
        </Link>

        <div className="mb-8">
          <p className="text-sm text-gold uppercase tracking-widest">Prova</p>
          <h1 className="font-serif text-4xl gold-text-gradient mt-2">Responder</h1>
          <p className="text-muted-foreground mt-2">
            Escolha uma apostila para responder a prova. Suas respostas ficam salvas como rascunho até você enviar.
          </p>
        </div>

        {items === null ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma prova disponível no momento.</p>
        ) : (
          <div className="grid gap-4">
            {items.map((it) => (
              <Link
                key={it.apostila_id}
                to="/responder/$apostilaId"
                params={{ apostilaId: String(it.apostila_id) }}
                className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 hover:border-gold/60 transition-all flex items-center gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl truncate">{it.titulo}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{it.total} perguntas</p>
                </div>
                <StatusBadge status={it.status} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: ApostilaItem["status"] }) {
  if (status === "corrigida") {
    return <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Corrigida</span>;
  }
  if (status === "enviada") {
    return <span className="text-[10px] uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Enviada</span>;
  }
  if (status === "rascunho") {
    return <span className="text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">Rascunho</span>;
  }
  return <span className="text-[10px] uppercase tracking-widest bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded">Iniciar</span>;
}
