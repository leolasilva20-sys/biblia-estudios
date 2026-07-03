import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros/genesis")({
  head: () => ({ meta: [{ title: "Gênesis — A Criação e a Queda | Bíblia Estúdios" }] }),
  component: Capitulos,
});

type Audiobook = {
  id: number;
  title: string;
  description: string | null;
  drive_file_id: string;
  order_index: number;
  admin_only: boolean;
  is_new: boolean;
};

function Capitulos() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [capitulos, setCapitulos] = useState<Audiobook[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !isAdmin) { navigate({ to: "/dashboard" }); return; }
  }, [user, profile, loading, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    (async () => {
      const { data, error } = await supabase
        .from("audiobooks")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) setLoadError(error.message);
      else if (data) setCapitulos(data as Audiobook[]);
      setLoadingAudio(false);
    })();
  }, [user, isAdmin]);

  if (loading || !user || !isAdmin) {
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
          <button
            onClick={() => navigate({ to: "/audiolivros" })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" /> Áudio Livros
          </button>

          <div className="mb-8">
            <h1 className="font-serif text-3xl gold-text-gradient">Gênesis — A Criação e a Queda</h1>
            <p className="text-muted-foreground mt-2 font-serif italic">
              {loadingAudio ? "Carregando..." : `${capitulos.length} capítulo${capitulos.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {loadingAudio && (
            <p className="text-sm text-muted-foreground text-center py-6">Carregando capítulos...</p>
          )}
          {!loadingAudio && loadError && (
            <p className="text-sm text-destructive text-center py-6">Erro: {loadError}</p>
          )}
          {!loadingAudio && !loadError && capitulos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum capítulo ainda.</p>
          )}

          <div className="space-y-3">
            {capitulos.map((cap) => (
              <div
                key={cap.id}
                onClick={() => navigate({ to: "/audiolivros/genesis/$capId", params: { capId: String(cap.id) } })}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/40 p-5 hover:border-gold/50 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {cap.is_new && (
                      <span className="text-xs font-semibold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                        Novidade
                      </span>
                    )}
                    {cap.admin_only && (
                      <span className="text-xs bg-muted/40 text-muted-foreground border border-border/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Admin
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg">{cap.title}</h3>
                  {cap.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">{cap.description}</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
