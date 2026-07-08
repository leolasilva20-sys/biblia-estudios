import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookMarked, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({ meta: [{ title: "Áudio Dramas — Bíblia Estúdios" }] }),
  component: AudioDramas,
});

function AudioDramas() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-sm text-gold uppercase tracking-widest">Bíblia Estúdios</p>
            <h1 className="font-serif text-4xl gold-text-gradient mt-2">Áudio Dramas</h1>
            <p className="text-muted-foreground mt-3 font-serif italic">
              Dramatizações em áudio das narrativas bíblicas.
            </p>
          </div>

          <Link
            to="/audiolivros/genesis"
            className="group flex items-center gap-5 rounded-xl border border-border/60 bg-card/60 p-6 hover:border-gold/60 transition-all"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5">
              <BookMarked className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl">Gênesis — A Criação e a Queda</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Ver capítulos</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" />
          </Link>
        </div>
      </main>
    </div>
  );
}

