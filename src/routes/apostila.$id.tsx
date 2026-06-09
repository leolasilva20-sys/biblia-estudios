import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, PenLine } from "lucide-react";
import { supabase, type Apostila } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/apostila/$id")({
  head: () => ({ meta: [{ title: "Apostila — Bíblia Estúdios" }] }),
  component: ApostilaViewer,
});

function buildEmbedUrl(ap: Apostila) {
  if (ap.drive_type === "doc") {
    return `https://docs.google.com/document/d/${ap.drive_id}/preview`;
  }
  return `https://drive.google.com/file/d/${ap.drive_id}/preview`;
}

function ApostilaViewer() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const { data: apostila, isLoading } = useQuery({
    queryKey: ["apostila", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("apostilas").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Apostila | null;
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
          </Link>
          {apostila && (
            <h1 className="font-serif text-2xl gold-text-gradient">{apostila.titulo}</h1>
          )}
          {apostila?.nivel === "consolidacao" && (
            <Link to="/exercicios">
              <Button className="bg-gold text-primary-foreground hover:opacity-90">
                <PenLine className="h-4 w-4 mr-2" /> Fazer exercícios
              </Button>
            </Link>
          )}
        </div>

        {isLoading && <div className="text-muted-foreground">Carregando apostila...</div>}

        {apostila && (
          <div className="rounded-xl border border-border/60 overflow-hidden bg-white">
            <iframe
              src={buildEmbedUrl(apostila)}
              title={apostila.titulo}
              className="w-full"
              style={{ height: "calc(100vh - 200px)", minHeight: "600px", border: "none" }}
              allow="autoplay"
            />
          </div>
        )}
      </main>
    </div>
  );
}
