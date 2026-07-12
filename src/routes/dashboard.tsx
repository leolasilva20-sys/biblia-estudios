import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, ChevronRight, FileText, GraduationCap, Crown, Sparkles, Clock, Film, Headphones } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { MODULO_1_APOSTILAS, type Nivel } from "@/lib/apostilas";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Bíblia Estúdios" }] }),
  component: Dashboard,
});

const NIVEL_META: Record<Nivel, { label: string; icon: typeof BookOpen; color: string }> = {
  iniciante: { label: "Iniciante", icon: BookOpen, color: "text-emerald-400" },
  intermediario: { label: "Intermediário", icon: FileText, color: "text-sky-400" },
  avancado: { label: "Avançado", icon: GraduationCap, color: "text-violet-400" },
  especialista: { label: "Especialista", icon: Crown, color: "text-amber-400" },
  consolidacao: { label: "Consolidação", icon: Sparkles, color: "text-gold" },
};

function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  if (loading || !user || !profile?.acesso_liberado) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  const nome = profile?.full_name?.split(" ")[0] ?? "leitor";

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <p className="text-sm text-gold uppercase tracking-widest">Bem-vindo</p>
          <h1 className="font-serif text-4xl md:text-5xl gold-text-gradient mt-2">Olá, {nome}</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl font-serif italic">
            Comece sua jornada pelas Escrituras, uma página de cada vez.
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="text-xs text-gold uppercase tracking-widest">Módulo 1</p>
              <h2 className="font-serif text-3xl gold-text-gradient mt-1">Gênesis 1</h2>
            </div>
            <span className="text-xs text-muted-foreground">5 apostilas progressivas</span>
          </div>

          <div className="grid gap-4">
            {MODULO_1_APOSTILAS.map((ap, idx) => {
              const meta = NIVEL_META[ap.nivel];
              const Icon = meta.icon;
              return (
                <Link
                  key={ap.id}
                  to="/apostila/$id"
                  params={{ id: ap.id }}
                  className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 hover:border-gold/60 transition-all flex items-center gap-5"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center font-serif text-gold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{meta.label}</span>
                    </div>
                    <h3 className="font-serif text-xl mt-1 truncate">{ap.titulo}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">{ap.descricao}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <Link
            to="/audiolivros/genesis"
            className="group flex items-center gap-5 rounded-xl border border-gold/40 bg-gradient-to-r from-gold/10 to-transparent p-6 hover:border-gold/70 transition-all"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-gold/50 flex items-center justify-center bg-gold/10">
              <Headphones className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                  Novidade
                </span>
                <span className="text-xs uppercase tracking-widest text-gold">Áudio Drama</span>
              </div>
              <h2 className="font-serif text-2xl">Gênesis — A Criação e a Queda</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Ouça agora o primeiro áudio drama do Bíblia Estúdios.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Link>
        </section>

        <section>
          <div className="ornament-divider mb-8 max-w-xs mx-auto"><Clock className="h-4 w-4" /></div>
          <h2 className="font-serif text-3xl text-center gold-text-gradient mb-2">Em breve</h2>
          <p className="text-center text-muted-foreground mb-8 font-serif italic">Próximos lançamentos da Bíblia Estúdios</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <ComingCard
              icon={BookOpen}
              eta="Em breve"
              title="Módulos 2 a 6 — Gênesis"
              desc="Continuação completa do livro de Gênesis em cinco níveis."
            />
            <ComingCard
              icon={Film}
              eta="Em breve"
              title="Série animada: Gênesis"
              desc="Adaptação visual da narrativa para todas as idades."
            />
            <ComingCard
              icon={Sparkles}
              eta="Em breve"
              title="Lista de espera"
              desc="Em breve você poderá entrar na fila para cada lançamento."
            />
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

function ComingCard({
  icon: Icon, eta, title, desc,
}: { icon: typeof BookOpen; eta: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-gold" />
        <span className="text-[10px] uppercase tracking-widest bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded">{eta}</span>
      </div>
      <h3 className="font-serif text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground flex-1">{desc}</p>
      <Button variant="outline" size="sm" disabled className="w-fit opacity-60 cursor-not-allowed">Em breve</Button>
    </div>
  );
}
