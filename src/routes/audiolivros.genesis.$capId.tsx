import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros/genesis/$capId")({
  head: () => ({ meta: [{ title: "Ouvindo — Bíblia Estúdios" }] }),
  component: PlayerCapitulo,
});

type Audiobook = {
  id: number;
  title: string;
  description: string | null;
  drive_file_id: string;
};

const FUNCTION_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co/functions/v1/audio-stream";

function PlayerCapitulo() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { capId } = useParams({ from: "/audiolivros/genesis/$capId" });

  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";

  const [cap, setCap] = useState<Audiobook | null>(null);
  const [loadingCap, setLoadingCap] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [audioLoading, setAudioLoading] = useState(true);
  const [errored, setErrored] = useState<string | null>(null);

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
        .eq("id", Number(capId))
        .single();
      if (error || !data) setNotFound(true);
      else setCap(data as Audiobook);
      setLoadingCap(false);
    })();
  }, [user, isAdmin, capId]);

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

  if (loading || !user || !isAdmin || loadingCap) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (notFound || !cap) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Capítulo não encontrado.</p>
            <button
              onClick={() => navigate({ to: "/audiolivros/genesis" })}
              className="text-gold hover:underline text-sm"
            >
              Voltar aos capítulos
            </button>
          </div>
        </main>
      </div>
    );
  }

  const src = `${FUNCTION_URL}?fileId=${cap.drive_file_id}`;

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate({ to: "/audiolivros/genesis" })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-10"
          >
            <ChevronLeft className="h-4 w-4" /> Gênesis — A Criação e a Queda
          </button>

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

          <div className="text-center mb-10">
            <div className="w-40 h-40 mx-auto rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent flex items-center justify-center mb-6">
              <span className="font-serif text-5xl text-gold/60">📖</span>
            </div>
            <h1 className="font-serif text-2xl gold-text-gradient">{cap.title}</h1>
            {cap.description && (
              <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{cap.description}</p>
            )}
          </div>

          {errored ? (
            <div className="text-center py-8">
              <p className="text-sm text-destructive">{errored}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Verifique se a chave da API do Google Drive está configurada corretamente.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/40 bg-card/40 p-6">
              <p className="text-xs text-muted-foreground text-center mb-2">
                {audioLoading ? "Carregando áudio..." : `${fmt(current)} / ${fmt(duration)}`}
              </p>
              <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden mb-6">
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
            </div>
          )}

          <p className="text-xs text-muted-foreground/50 mt-6 text-center select-none">
            © Bíblia Estúdios — conteúdo protegido
          </p>
        </div>
      </main>
    </div>
  );
}
