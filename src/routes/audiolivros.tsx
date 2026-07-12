import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({
    meta: [
      { title: "Áudio Dramas — Bíblia Estúdios" },
      {
        name: "description",
        content: "Áudio dramas bíblicos originais do Bíblia Estúdios, focados na Bíblia com uma pitada de criatividade.",
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
        <section className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" aria-hidden="true" />
            <p className="text-sm uppercase tracking-widest text-gold">Áudio Dramas</p>
          </div>
          <h1 className="font-serif text-4xl gold-text-gradient md:text-5xl">Áudio Dramas do Bíblia Estúdios</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Os áudio dramas do Bíblia Estúdios são focados na Bíblia e retratam as histórias bíblicas com uma pitada de criatividade.
          </p>

          <div className="mt-10 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden="true" />
            <h2 className="font-serif text-2xl">Veja os livros áudio dramatizados</h2>
          </div>

          <ul className="mt-4 space-y-3">
            <li>
              <Link
                to="/audiolivros/genesis"
                aria-label="Gênesis — A Criação e a Queda"
                className="block rounded-xl border border-border/60 bg-card/45 px-5 py-5 transition-colors hover:border-gold/50 hover:bg-card/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span className="font-serif text-xl text-foreground">Gênesis — A Criação e a Queda</span>
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
