import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Sparkles, Clock, Film, NotebookPen } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { APOSTILAS } from "@/lib/apostilas";
import { Button } from "@/components/ui/button";
import { useRequireAccess } from "@/hooks/use-require-access";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bíblia Estúdios" },
      { name: "description", content: "Acesse a Apostila de Gênesis e seus cadernos de estudo bíblico." },
      { property: "og:title", content: "Dashboard — Bíblia Estúdios" },
      { property: "og:description", content: "Acesse a Apostila de Gênesis e seus cadernos de estudo bíblico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { ready, profile } = useRequireAccess();

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  const nome = profile?.full_name?.split(" ")[0] ?? "leitor";

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">
          <header>
            <p className="text-xs text-gold uppercase tracking-widest">Bem-vindo</p>
            <h1 className="font-serif text-3xl md:text-4xl gold-text-gradient mt-1">Olá, {nome}</h1>
            <p className="text-muted-foreground mt-2 font-serif italic">
              Comece sua jornada pelas Escrituras, uma página de cada vez.
            </p>
          </header>

          <Link
            to="/premium"
            aria-label="Conhecer o Premium por tempo limitado"
            className="block rounded-xl border border-gold/40 bg-gold/10 p-5 hover:bg-gold/15 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Sparkles className="h-5 w-5 text-gold flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-serif text-lg text-gold">Premium — tempo limitado</p>
                <p className="text-sm text-muted-foreground">
                  Áudio dramas, curso de religiosidade e sorteios. Cadastro gratuito.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gold" />
            </div>
          </Link>

          <section>
            <h2 className="text-xs text-gold uppercase tracking-widest mb-4">Estudo atual</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {APOSTILAS.map((ap) => (
                <ActionCard
                  key={ap.id}
                  to="/apostila/$id"
                  params={{ id: ap.id }}
                  icon={BookOpen}
                  title={ap.titulo}
                  desc={ap.descricao}
                />
              ))}
              <ActionCard
                to="/cadernos"
                icon={NotebookPen}
                title="Meus cadernos"
                desc="Anotações por página e observações do professor."
              />
              <ActionCard
                to="/rascunhos"
                icon={PenLine}
                title="Rascunhos"
                desc="Ideias rápidas antes de passar a limpo."
              />
              <ActionCard
                to="/suporte"
                icon={LifeBuoy}
                title="Suporte"
                desc="Fale com a equipe ou com o agente de IA."
              />
            </div>
          </section>

          <section>
            <div className="ornament-divider mb-6 max-w-xs mx-auto"><Clock className="h-4 w-4" /></div>
            <h2 className="font-serif text-2xl text-center gold-text-gradient mb-6">Em breve</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <ComingCard icon={BookOpen} eta="Em breve" title="Novas apostilas" desc="Continuação do estudo em novos livros." />
              <ComingCard icon={Film} eta="Em breve" title="Série animada" desc="Gênesis em adaptação visual." />
              <ComingCard icon={Sparkles} eta="Em breve" title="Lista de espera" desc="Entre na fila de cada lançamento." />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ActionCard({
  to, params, icon: Icon, title, desc,
}: {
  to: string;
  params?: Record<string, string>;
  icon: typeof BookOpen;
  title: string;
  desc: string;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      aria-label={`Abrir ${title}`}
      className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 hover:border-gold/60 transition-all flex items-start gap-4"
    >
      <Icon className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-xl">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors mt-1.5" />
    </Link>
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
