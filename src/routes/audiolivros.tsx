import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookMarked, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({ meta: [{ title: "Áudio Livros — Bíblia Estúdios" }] }),
  component: AudioLivros,
});

function AudioLivros() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) { navigate({ to: "/complete-profile" }); return; }
    if (profile && !isAdmin) { navigate({ to: "/dashboard" }); return; }
  }, [user, profile, loading, isAdmin, navigate]);

  if (loading || !user || !profile?.acesso_liberado || !isAdmin) {
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
            <h1 className="font-serif text-4xl gold-text-gradient mt-2">Áudio Livros</h1>
            <p className="text-muted-foreground mt-3 font-serif italic">
              Acesso restrito — visível apenas para administradores.
            </p>
          </div>

          <div
            className="group rounded-xl border border-border/60 bg-card/60 p-6 flex items-center gap-5 hover:border-gold/60 transition-all cursor-pointer"
            onClick={() => navigate({ to: "/audiolivros/genesis" })}
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5">
              <BookMarked className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl">Gênesis — A Criação e a Queda</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Ver capítulos</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" />
          </div>
        </div>
      </main>
    </div>
  );
}
