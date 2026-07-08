import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/audiolivros/genesis")({
  head: () => ({ meta: [{ title: "Gênesis — A Criação e a Queda | Bíblia Estúdios" }] }),
  component: GenesisAudiolivro,
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

const FUNCTION_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co/functions/v1/audio-stream";

function AudioPlayer({ driveFileId }: { driveFileId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [audioLoading, setAudioLoading] = useState(true);
  const [errored, setErrored] = useState<string | null>(null);

  const src = `${FUNCTION_URL}?fileId=${driveFileId}`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    const next = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = next;
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-4 p-5 bg-background/40 rounded-xl border border-border/40">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={(e) => { setDuration((e.target as HTMLAudioElement).duration); setAudioLoading(false); }}
        onTimeUpdate={(e) => {
          const t = e.target as HTMLAudioElement;
          setCurrent(t.currentTime);
          setProgress((t.currentTime / t.duration) * 100);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => { setErrored("Não foi possível carregar este áudio."); setAudioLoading(false); }}
        preload="metadata"
        onContextMenu={(e) => e.preventDefault()}
      />

      {errored ? (
        <div className="text-center py-4">
          <p className="text-sm text-destructive">{errored}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Verifique se a chave da API do Google Drive está configurada corretamente.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground text-center mb-2">
            {audioLoading ? "Carregando áudio..." : `${fmt(current)} / ${fmt(duration)}`}
          </p>
          <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-gold/70 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => skip(-15)}
              disabled={audioLoading}
              aria-label="Voltar 15 segundos"
              className="w-11 h-11 rounded-full border border-border/60 flex items-center justify-center hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              disabled={audioLoading}
              className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center hover:bg-gold/30 transition-colors disabled:opacity-40"
            >
              {playing ? <Pause className="h-6 w-6 text-gold" /> : <Play className="h-6 w-6 text-gold ml-0.5" />}
            </button>
            <button
              onClick={() => skip(15)}
              disabled={audioLoading}
              aria-label="Avançar 15 segundos"
              className="w-11 h-11 rounded-full border border-border/60 flex items-center justify-center hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GenesisAudiolivro() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [capitulos, setCapitulos] = useState<Audiobook[]>([]);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [playerAberto, setPlayerAberto] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("audiobooks")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) {
        console.error("[audiobooks] query error:", error);
        setLoadError(`${error.code ?? ""} ${error.message}`.trim());
      } else if (data) {
        console.log("[audiobooks] rows retornadas:", data.length);
        setCapitulos(data as Audiobook[]);
      }
      setLoadingAudio(false);
    })();
  }, [user]);

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
          <Link
            to="/audiolivros"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Áudio Livros
          </Link>

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

          <div className="space-y-4">
            {capitulos.map((cap) => (
              <div key={cap.id} className="rounded-xl border border-border/50 bg-card/40 p-5">
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

                {!playerAberto[cap.id] ? (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setPlayerAberto((prev) => ({ ...prev, [cap.id]: true }))}
                  >
                    <Play className="h-4 w-4 mr-2" /> Mostrar player
                  </Button>
                ) : (
                  <AudioPlayer driveFileId={cap.drive_file_id} />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
