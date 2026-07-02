import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, PenLine } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { getApostila, buildDriveEmbedUrl } from "@/lib/apostilas";

export const Route = createFileRoute("/apostila/$id")({
  head: () => ({ meta: [{ title: "Apostila — Bíblia Estúdios" }] }),
  component: ApostilaViewer,
});

function ApostilaViewer() {
  const { id } = Route.useParams();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  const apostila = getApostila(id);

  if (!user || !profile?.acesso_liberado) return null;

  if (!apostila) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppSidebar />
        <main className="flex-1 container mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="font-serif text-2xl text-gold">Apostila não encontrada</h1>
          <Link to="/dashboard"><Button variant="outline" className="mt-6">Voltar ao dashboard</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppSidebar />
      <main className="flex-1 container mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
          </Link>
          <h1 className="font-serif text-2xl gold-text-gradient">{apostila.titulo}</h1>
          {apostila.nivel === "consolidacao" && (
            <Link to="/exercicios">
              <Button className="bg-gold text-primary-foreground hover:opacity-90">
                <PenLine className="h-4 w-4 mr-2" /> Responder exercícios
              </Button>
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-border/60 overflow-hidden bg-white">
          <iframe
            src={buildDriveEmbedUrl(apostila)}
            title={apostila.titulo}
            className="w-full"
            style={{ height: "calc(100vh - 200px)", minHeight: "600px", border: "none" }}
            allow="autoplay"
          />
        </div>
      </main>
    </div>
  );
}
