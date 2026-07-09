import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookMarked, Headphones, Pause, Play, SkipBack, SkipForward, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/audiolivros/genesis")({
  head: () => ({
    meta: [
      { title: "Gênesis — A Criação e a Queda | Áudio Dramas" },
      {
        name: "description",
        content: "Ouça Gênesis — A Criação e a Queda, áudio drama bíblico original do Bíblia Estúdios.",
      },
    ],
  }),
  component: GenesisAudioDrama,
});

type Capitulo = {
  id: number | string;
  title: string;
  description: string | null;
  drive_file_id: string;
  order_index?: number | null;
};

const FUNCTION_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co/functions/v1/audio-stream";

function Player({ driveFileId }: { driveFileId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const src = `${FUNCTION_URL}?fileId=${encodeURIComponent(driveFileId)}`;
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch((err) => {
        console.error("[audio-drama] play error", err);
        setError("Não foi possível iniciar o áudio neste dispositivo.");
      });
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  }

  function format(seconds: number) {
    if (!isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${minutes}:${rest.toString().padStart(2, "0")}`;
  }

  return (
    <div className="mt-4 rounded-xl border border-border/50 bg-background/45 p-5">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        controlsList="nodownload"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          setLoading(false);
          setError(null);
        }}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
        onError={(event) => {
          console.error("[audio-drama] audio load error", event.currentTarget.error);
          setError("Não foi possível carregar este capítulo de áudio agora.");
          setLoading(false);
        }}
        onContextMenu={(event) => event.preventDefault()}
      />

      {error ? (
        <p className="py-2 text-center text-sm text-destructive">{error}</p>
      ) : (
        <>
          <p className="mb-2 text-center text-xs text-muted-foreground">
            {loading ? "Carregando áudio..." : `${format(current)} / ${format(duration)}`}
          </p>
          <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-border/40">
            <div className="h-full bg-gold/75 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Voltar 15 segundos"
              disabled={loading}
              onClick={() => skip(-15)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 disabled:opacity-40"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pausar" : "Reproduzir"}
              disabled={loading}
              onClick={toggle}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/20 disabled:opacity-40"
            >
              {playing ? <Pause className="h-6 w-6 text-gold" /> : <Play className="ml-0.5 h-6 w-6 text-gold" />}
            </button>
            <button
              type="button"
              aria-label="Avançar 15 segundos"
              disabled={loading}
              onClick={() => skip(15)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 disabled:opacity-40"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GenesisAudioDrama() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Capitulo[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
  }, [loading, navigate, user]);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;

    async function loadChapters() {
      const { data, error } = await supabase
        .from("audiobooks")
        .select("id, title, description, drive_file_id, order_index")
        .order("order_index", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("[audio-drama] chapters query error", error);
        setListError(error.message);
        setChapters([]);
        return;
      }

      console.log("[audio-drama] chapters loaded", data);
      setChapters((data as Capitulo[]) ?? []);
      setListError(null);
    }

    loadChapters();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const visibleChapters = useMemo(() => chapters ?? [], [chapters]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="min-h-screen md:flex">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto px-5 py-10 md:px-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate({ to: "/audiolivros" })}
            className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para Áudio Dramas
          </button>

          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <p className="text-sm uppercase tracking-widest text-gold">Livro áudio dramatizado</p>
          </div>
          <h1 className="font-serif text-4xl gold-text-gradient md:text-5xl">Gênesis — A Criação e a Queda</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Uma dramatização bíblica original sobre a criação, Adão e Eva, e os primeiros passos da história humana diante de Deus.
          </p>

          <section className="mt-8 rounded-xl border border-border/50 bg-card/45 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/5">
                <BookMarked className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h2 className="font-serif text-2xl">Capítulos</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Narração original, dublagem original, vozes originais e música original do Bíblia Estúdios.
                </p>
              </div>
            </div>

            {!expanded ? (
              <Button size="lg" className="mt-6 w-full py-6 text-base sm:w-auto" onClick={() => setExpanded(true)}>
                Ver capítulos
              </Button>
            ) : (
              <div className="mt-6 space-y-6 border-t border-border/40 pt-6">
                {chapters === null && <p className="text-muted-foreground">Carregando capítulos…</p>}
                {listError && <p className="text-sm text-destructive">Erro ao carregar capítulos: {listError}</p>}
                {chapters !== null && visibleChapters.length === 0 && !listError && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum capítulo apareceu para sua conta. A consulta voltou vazia; isso normalmente indica policy de acesso ou dados não publicados na tabela de áudio dramas.
                  </p>
                )}
                {visibleChapters.map((chapter, index) => (
                  <article key={chapter.id} className="rounded-lg border border-border/40 bg-background/35 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
                      <Headphones className="h-4 w-4" /> Capítulo {index + 1}
                    </div>
                    <h3 className="font-serif text-xl">{chapter.title}</h3>
                    {chapter.description && <p className="mt-1 text-sm text-muted-foreground">{chapter.description}</p>}
                    <Player driveFileId={chapter.drive_file_id} />
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}