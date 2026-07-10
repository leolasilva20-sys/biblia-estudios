import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, BookOpen, Headphones, Mic2, Music2, Sparkles, UsersRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({
    meta: [
      { title: "Áudio Dramas — Bíblia Estúdios" },
      {
        name: "description",
        content: "Áudio dramas bíblicos originais do Bíblia Estúdios com narração, dublagem, música e vozes originais.",
      },
    ],
  }),
  component: AudioDramasPage,
});

function AudioDramasPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
  }, [loading, navigate, user]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="min-h-screen md:flex">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto px-5 py-10 md:px-8 md:py-12">
        <section className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <p className="text-sm uppercase tracking-widest text-gold">Áudio Dramas</p>
          </div>
          <h1 className="max-w-3xl font-serif text-4xl gold-text-gradient md:text-6xl">
            Histórias bíblicas dramatizadas pelo Bíblia Estúdios
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Os áudio dramas do Bíblia Estúdios são focados na Bíblia e retratam as histórias bíblicas com uma pitada de criatividade.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={Mic2} label="Narração original" />
            <Feature icon={UsersRound} label="Dublagem original" />
            <Feature icon={Music2} label="Música original" />
            <Feature icon={Headphones} label="Vozes originais" />
          </div>

          <div className="mt-12 border-t border-border/50 pt-8">
            <div className="mb-5 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-3xl">Veja os livros áudio dramatizados</h2>
            </div>

            <Link
              to="/audiolivros/genesis"
              aria-label="Ver capítulos de Gênesis — A Criação e a Queda"
              className="group block rounded-xl border border-border/60 bg-card/45 p-6 transition-colors hover:border-gold/50 hover:bg-card/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-gold/30 bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
                  Primeiro livro
                </span>
                <span className="rounded-full border border-gold/30 bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
                  Disponível agora
                </span>
              </div>
              <h3 className="font-serif text-2xl text-foreground">Gênesis — A Criação e a Queda</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                A história da criação, de Adão e Eva, e da queda, apresentada em formato áudio dramatizado.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:underline">
                Ver capítulos <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof Mic2; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/35 px-4 py-4">
      <Icon className="h-5 w-5 flex-shrink-0 text-gold" />
      <span className="text-sm font-medium text-foreground/85">{label}</span>
    </div>
  );
}