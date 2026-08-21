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
                <p className="text-xs text-gold uppercase tracking-widest">Estudo atual</p>
                <h2 className="font-serif text-3xl gold-text-gradient mt-1">Gênesis</h2>
              </div>
            </div>

            <div className="grid gap-4">
              {APOSTILAS.map((ap) => (
                <Link
                  key={ap.id}
                  to="/apostila/$id"
                  params={{ id: ap.id }}
                  aria-label={`Abrir ${ap.titulo}`}
                  className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 hover:border-gold/60 transition-all flex items-center gap-5"
                >
                  <BookOpen className="h-6 w-6 text-gold flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-2xl">{ap.titulo}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{ap.descricao}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </Link>
              ))}

              <Link
                to="/cadernos"
                aria-label="Abrir meus cadernos de anotações"
                className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 hover:border-gold/60 transition-all flex items-center gap-5"
              >
                <NotebookPen className="h-6 w-6 text-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-2xl">Meus cadernos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Escreva suas anotações e receba observações do professor.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" />
              </Link>
            </div>
          </section>

          <section>
            <div className="ornament-divider mb-8 max-w-xs mx-auto"><Clock className="h-4 w-4" /></div>
            <h2 className="font-serif text-3xl text-center gold-text-gradient mb-2">Em breve</h2>
            <p className="text-center text-muted-foreground mb-8 font-serif italic">Próximos lançamentos da Bíblia Estúdios</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <ComingCard icon={BookOpen} eta="Em breve" title="Novas apostilas" desc="Continuação do estudo bíblico em novos livros." />
              <ComingCard icon={Film} eta="Em breve" title="Série animada: Gênesis" desc="Adaptação visual da narrativa para todas as idades." />
              <ComingCard icon={Sparkles} eta="Em breve" title="Lista de espera" desc="Em breve você poderá entrar na fila para cada lançamento." />
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
