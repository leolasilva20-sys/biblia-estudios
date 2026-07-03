import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BookMarked, ChevronRight, ChevronLeft, Play, Pause, Lock, SkipBack, SkipForward } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({ meta: [{ title: "Áudio Livros — Bíblia Estúdios" }] }),
  component: AudioLivros,
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
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const src = `${FUNCTION_URL}?fileId=${driveFileId}`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    const next = Math.max(0, Math.min((audioRef.current.duration || 0), audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = next;
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-5 bg-background/40 rounded-xl border border-border/40">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={(e) => { setDuration((e.target as HTMLAudioElement).duration); setLoading(false); }}
        onTimeUpdate={(e) => {
          const t = e.target as HTMLAudioElement;
          setCurrent(t.currentTime);
          setProgress((t.currentTime / t.duration) * 100);
        }}
        onEnded={() => setPlaying(false)}
        onError={() => { setErrored(true); setLoading(false); }}
        preload="metadata"
        onContextMenu={(e) => e.preventDefault()}
      />
      {errored ? (
        <p className="text-sm text-destructive text-center py-2">
          Não foi possível carregar este áudio. Verifique se a chave da API do Google Drive está configurada.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => skip(-15)}
            disabled={loading}
            aria-label="Voltar 15 segundos"
            className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40 flex-shrink-0"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={togglePlay}
            disabled={loading}
            className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center hover:bg-gold/30 transition-colors disabled:opacity-40 flex-shrink-0"
          >
            {playing ? <Pause className="h-5 w-5 text-gold" /> : <Play className="h-5 w-5 text-gold ml-0.5" />}
          </button>
          <button
            onClick={() => skip(15)}
            disabled={loading}
            aria-label="Avançar 15 segundos"
            className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40 flex-shrink-0"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-2">
              {loading ? "Carregando..." : `${fmt(current)} / ${fmt(duration)}`}
            </p>
            <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
              <div className="h-full bg-gold/70 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground/50 mt-3 text-center select-none">
        © Bíblia Estúdios — conteúdo protegido
      </p>
    </div>
  );
}

function AudioLivros() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [capitulos, setCapitulos] = useState<Audiobook[]>([]);
  const [selected, setSelected] = useState<Audiobook | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookOpen, setBookOpen] = useState(false);

  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) { navigate({ to: "/complete-profile" }); return; }
    if (profile && !isAdmin) { navigate({ to: "/dashboard" }); return; }
  }, [user, profile, loading, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    (async () => {
      const { data, error } = await supabase
        .from("audiobooks")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) {
        console.error("[audiolivros] load error:", error);
        setLoadError(error.message);
      } else if (data) {
        setCapitulos(data as Audiobook[]);
      }
      setLoadingAudio(false);
    })();
  }, [user, isAdmin]);

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
          {!selected ? (
            <>
              <div className="mb-10">
                <p className="text-sm text-gold uppercase tracking-widest">Bíblia Estúdios</p>
                <h1 className="font-serif text-4xl gold-text-gradient mt-2">Áudio Livros</h1>
                <p className="text-muted-foreground mt-3 font-serif italic">
                  Acesso restrito — visível apenas para administradores.
                </p>
              </div>

              <div
                className="group rounded-xl border border-border/60 bg-card/60 p-6 flex items-center gap-5 hover:border-gold/60 transition-all cursor-pointer"
                onClick={() => capitulos.length > 0 && setSelected(capitulos[0])}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5">
                  <BookMarked className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl">Gênesis — A Criação e a Queda</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {loadingAudio ? "Carregando..." : `${capitulos.length} capítulo${capitulos.length !== 1 ? "s" : ""} disponível`}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" />
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-6"
              >
                <ChevronLeft className="h-4 w-4" /> Gênesis — A Criação e a Queda
              </button>

              <div className="space-y-3">
                {capitulos.map((cap) => (
                  <div key={cap.id}>
                    <div
                      className={`rounded-xl border p-5 transition-all ${
                        selected.id === cap.id
                          ? "border-gold/60 bg-card/70"
                          : "border-border/50 bg-card/40 hover:border-gold/30 cursor-pointer"
                      }`}
                      onClick={() => setSelected(cap)}
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {cap.is_new && (
                          <span className="text-xs font-semibold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                            Novidade
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg">{cap.title}</h3>
                      {cap.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">{cap.description}</p>
                      )}
                      {selected.id === cap.id && (
                        <div className="mt-4">
                          <AudioPlayer driveFileId={cap.drive_file_id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
