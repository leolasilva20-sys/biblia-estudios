import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Pause, Play, Rewind, FastForward, SkipBack, SkipForward } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useRequireAccess } from "@/hooks/use-require-access";
import { supabase } from "@/lib/supabase";

type Capitulo = { id: string; title: string; description: string | null; drive_file_id: string; order_index: number; is_new: boolean };

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "https://phguxgdqwrysvjdkzzxn.supabase.co";
const streamUrl = (id: string) => `${SUPABASE_URL}/functions/v1/get-audio-stream?fileId=${encodeURIComponent(id)}`;

export const Route = createFileRoute("/audio-dramas/genesis")({
  head: () => ({
    meta: [
      { title: "Gênesis — A Criação e a Queda | Áudio Dramas" },
      { name: "description", content: "Ouça os capítulos do áudio drama Gênesis — A Criação e a Queda." },
      { property: "og:title", content: "Gênesis — A Criação e a Queda | Áudio Dramas" },
      { property: "og:description", content: "Ouça os capítulos do áudio drama Gênesis — A Criação e a Queda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Genesis,
});

function Genesis() {
  const { ready } = useRequireAccess();
  const [caps, setCaps] = useState<Capitulo[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [atual, setAtual] = useState<number | null>(null);
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!ready) return;
    supabase
      .from("audiobooks")
      .select("id,title,description,drive_file_id,order_index,is_new")
      .order("order_index")
      .then(({ data, error }) => {
        if (error) setErro("Não foi possível carregar os capítulos.");
        else setCaps((data ?? []) as Capitulo[]);
      });
  }, [ready]);

  useEffect(() => {
    if (atual !== null) audioRef.current?.play().catch(() => {});
  }, [atual]);

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;

  const cap = atual !== null ? caps[atual] : null;
  const pular = (s: number) => { if (audioRef.current) audioRef.current.currentTime += s; };
  const toggle = () => { const a = audioRef.current; if (!a) return; a.paused ? a.play() : a.pause(); };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AppSidebar />
      <main className="flex-1 px-6 py-10 pb-48">
        <div className="max-w-5xl mx-auto space-y-8">
          <Link to="/audio-dramas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
          </Link>
          <header>
            <h1 className="font-serif text-3xl md:text-4xl gold-text-gradient">Gênesis — A Criação e a Queda</h1>
            <p className="text-muted-foreground font-serif italic mt-2">Escolha um capítulo para ouvir.</p>
          </header>
          {erro && <p role="alert" className="text-destructive">{erro}</p>}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caps.map((c, i) => (
              <li key={c.id}>
                <button
                  onClick={() => setAtual(i)}
                  aria-label={`Ouvir ${c.title}`}
                  className={`w-full text-left aspect-video rounded-xl border p-5 flex flex-col justify-end bg-gradient-to-t from-gold/20 to-card transition-transform hover:scale-[1.03] ${atual === i ? "border-gold" : "border-border/60"}`}
                >
                  {c.is_new && <span className="self-start mb-auto rounded bg-gold px-2 py-0.5 text-xs font-medium text-background">Novo</span>}
                  <span className="font-serif text-lg text-foreground">{c.title}</span>
                  {c.description && <span className="text-sm text-muted-foreground line-clamp-2">{c.description}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {cap && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gold/30 bg-background/95 backdrop-blur px-4 py-4" role="region" aria-label="Player de áudio">
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="font-serif text-center text-foreground" aria-live="polite">{cap.title}</p>
            <audio
              ref={audioRef}
              key={cap.id}
              src={streamUrl(cap.drive_file_id)}
              controls
              controlsList="nodownload"
              onPlay={() => setTocando(true)}
              onPause={() => setTocando(false)}
              onEnded={() => atual! < caps.length - 1 && setAtual(atual! + 1)}
              className="w-full"
            />
            <div className="flex items-center justify-center gap-3">
              <button aria-label="Capítulo anterior" disabled={atual === 0} onClick={() => setAtual(atual! - 1)} className="p-3 rounded-full hover:bg-muted/40 disabled:opacity-30"><SkipBack className="h-6 w-6" /></button>
              <button aria-label="Voltar 15 segundos" onClick={() => pular(-15)} className="p-3 rounded-full hover:bg-muted/40"><Rewind className="h-6 w-6" /></button>
              <button aria-label={tocando ? "Pausar" : "Reproduzir"} onClick={toggle} className="p-4 rounded-full bg-gold text-background">{tocando ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}</button>
              <button aria-label="Avançar 15 segundos" onClick={() => pular(15)} className="p-3 rounded-full hover:bg-muted/40"><FastForward className="h-6 w-6" /></button>
              <button aria-label="Próximo capítulo" disabled={atual === caps.length - 1} onClick={() => setAtual(atual! + 1)} className="p-3 rounded-full hover:bg-muted/40 disabled:opacity-30"><SkipForward className="h-6 w-6" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
