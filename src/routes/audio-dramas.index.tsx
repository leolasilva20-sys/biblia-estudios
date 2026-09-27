import { createFileRoute, Link } from "@tanstack/react-router";
import { Headphones, Play } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useRequireAccess } from "@/hooks/use-require-access";

export const Route = createFileRoute("/audio-dramas/")({
  head: () => ({
    meta: [
      { title: "Áudio Dramas — Bíblia Estúdios" },
      { name: "description", content: "Áudio dramas bíblicos, narrados com vozes únicas." },
      { property: "og:title", content: "Áudio Dramas — Bíblia Estúdios" },
      { property: "og:description", content: "Áudio dramas bíblicos, narrados com vozes únicas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AudioDramas,
});

function AudioDramas() {
  const { ready } = useRequireAccess();
  if (!ready) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AppSidebar />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="font-serif text-3xl md:text-4xl gold-text-gradient">Áudio Dramas</h1>
          <section className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-8 space-y-4">
            <Headphones className="h-10 w-10 text-gold" aria-hidden />
            <h2 className="font-serif text-2xl md:text-3xl text-foreground">Gênesis — A Criação e a Queda</h2>
            <p className="text-muted-foreground font-serif italic">Áudio dramas bíblicos, narrados com vozes únicas.</p>
            <Link
              to="/audio-dramas/genesis"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-base font-medium text-background hover:opacity-90"
            >
              <Play className="h-5 w-5" aria-hidden /> Assistir agora
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
