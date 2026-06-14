import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Shield, Users, FileQuestion, LifeBuoy, LogOut, CheckCircle2,
  ArrowLeft, MessageSquare, BookOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — Bíblia Estúdios" }] }),
  component: AdminPanel,
});

type TabKey = "overview" | "usuarios" | "respostas" | "suporte";

function AdminPanel() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const nivel = profile?.nivel_admin ?? "nenhum";
  const hasAccess = nivel !== "nenhum";
  const isFullAdmin = nivel === "admin";
  const [tab, setTab] = useState<TabKey>("overview");

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (profile && nivel === "nenhum") navigate({ to: "/dashboard" });
  }, [user, profile, nivel, loading, navigate]);

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [u, r, s] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("respostas").select("id", { count: "exact", head: true }).eq("status", "pendente"),
        supabase.from("support_messages").select("id", { count: "exact", head: true }).eq("status", "pendente"),
      ]);
      return {
        usuarios: u.count ?? 0,
        respostas: r.count ?? 0,
        suporte: s.count ?? 0,
      };
    },
    enabled: hasAccess,
  });

  if (loading || !hasAccess) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Verificando acesso...</div>;
  }

  const allTabs = [
    { k: "overview" as TabKey, label: "Resumo", icon: BookOpen },
    { k: "usuarios" as TabKey, label: "Usuários", icon: Users },
    { k: "respostas" as TabKey, label: "Respostas", icon: FileQuestion },
    { k: "suporte" as TabKey, label: "Suporte", icon: LifeBuoy },
  ];
  const visibleTabs = isFullAdmin
    ? allTabs
    : allTabs.filter((t) => t.k === "overview" || t.k === "respostas");

  return (
    <div className="min-h-screen bg-[#0E0C0A]">
      {/* Admin distinct header */}
      <header className="border-b-2 border-gold/40 bg-black/60">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-md bg-gold text-primary-foreground text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_oklch(0.74_0.12_82/0.4)]">
              <Shield className="h-3 w-3 inline mr-1" /> {isFullAdmin ? "ADMIN" : "JUNIOR"}
            </div>
            <span className="font-serif text-lg text-gold">Painel de Controle</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Site</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-1">
          {visibleTabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                tab === t.k ? "bg-gold text-primary-foreground font-medium" : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </aside>

        <main>
          {tab === "overview" && (
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard icon={Users} label="Usuários" value={stats?.usuarios ?? 0} />
              <StatCard icon={FileQuestion} label="Respostas pendentes" value={stats?.respostas ?? 0} />
              <StatCard icon={LifeBuoy} label="Suporte pendente" value={stats?.suporte ?? 0} />
            </div>
          )}
          {tab === "usuarios" && isFullAdmin && <UsuariosList />}
          {tab === "respostas" && <RespostasList readOnly={!isFullAdmin} />}
          {tab === "suporte" && isFullAdmin && <SuporteList />}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-card to-black/40 p-6">
      <Icon className="h-6 w-6 text-gold mb-3" />
      <div className="text-3xl font-serif gold-text-gradient">{value}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function UsuariosList() {
  const { data } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Array<{ id: string; full_name: string | null; email: string | null; is_admin: boolean; created_at: string }>;
    },
  });

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
      <div className="px-5 py-3 border-b border-border/60 font-serif text-gold">Usuários</div>
      <div className="divide-y divide-border/40">
        {(data ?? []).map((u) => (
          <div key={u.id} className="px-5 py-3 flex items-center justify-between text-sm">
            <div>
              <div className="font-medium">{u.full_name ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{u.email}</div>
            </div>
            <div className="flex items-center gap-3">
              {u.is_admin && <span className="text-xs px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30">admin</span>}
              <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {data && data.length === 0 && <div className="px-5 py-8 text-center text-muted-foreground">Nenhum usuário.</div>}
      </div>
    </div>
  );
}

function RespostasList() {
  const qc = useQueryClient();
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ["admin", "respostas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("respostas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Array<{ id: string; user_id: string; pergunta: string; resposta: string; status: string; feedback?: string | null; created_at: string }>;
    },
  });

  const aprovar = async (id: string) => {
    const { error } = await supabase
      .from("respostas")
      .update({ status: "aprovada", feedback: feedback[id] ?? null })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Resposta aprovada");
    qc.invalidateQueries({ queryKey: ["admin"] });
  };

  return (
    <div className="space-y-3">
      {(data ?? []).map((r) => (
        <div key={r.id} className="rounded-xl border border-border/60 bg-card/40 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs px-2 py-0.5 rounded ${r.status === "pendente" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
              {r.status}
            </span>
            <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
          </div>
          <p className="font-serif text-gold mb-1">{r.pergunta}</p>
          <p className="text-sm text-foreground/90 whitespace-pre-wrap mb-3">{r.resposta}</p>
          {r.status === "pendente" && (
            <div className="space-y-2">
              <Textarea
                placeholder="Feedback opcional..."
                rows={2}
                value={feedback[r.id] ?? r.feedback ?? ""}
                onChange={(e) => setFeedback({ ...feedback, [r.id]: e.target.value })}
              />
              <Button size="sm" onClick={() => aprovar(r.id)} className="bg-gold text-primary-foreground hover:opacity-90">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Aprovar
              </Button>
            </div>
          )}
          {r.feedback && r.status !== "pendente" && (
            <div className="mt-2 text-xs text-muted-foreground border-l-2 border-gold/40 pl-3">
              <strong className="text-gold">Feedback:</strong> {r.feedback}
            </div>
          )}
        </div>
      ))}
      {data && data.length === 0 && <div className="text-center text-muted-foreground py-12">Nenhuma resposta.</div>}
    </div>
  );
}

function SuporteList() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "suporte"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Array<{ id: string; nome: string; email: string; mensagem: string; status: string; created_at: string }>;
    },
  });

  const resolver = async (id: string) => {
    const { error } = await supabase.from("support_messages").update({ status: "resolvido" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marcado como resolvido");
    qc.invalidateQueries({ queryKey: ["admin"] });
  };

  return (
    <div className="space-y-3">
      {(data ?? []).map((m) => (
        <div key={m.id} className="rounded-xl border border-border/60 bg-card/40 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gold" />
              <span className="font-medium">{m.nome}</span>
              <span className="text-xs text-muted-foreground">{m.email}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${m.status === "pendente" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
              {m.status}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap mb-3">{m.mensagem}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
            {m.status === "pendente" && (
              <Button size="sm" variant="outline" onClick={() => resolver(m.id)}>
                <CheckCircle2 className="h-4 w-4 mr-1" /> Marcar resolvido
              </Button>
            )}
          </div>
        </div>
      ))}
      {data && data.length === 0 && <div className="text-center text-muted-foreground py-12">Nenhuma mensagem.</div>}
    </div>
  );
}
