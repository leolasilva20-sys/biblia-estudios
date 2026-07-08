import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({ meta: [{ title: "Áudio Dramas — Bíblia Estúdios" }] }),
  component: AudioDramas,
});

type Capitulo = {
  id: number;
  title: string;
  description: string | null;
  drive_file_id: string;
};

const FUNCTION_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co/functions/v1/audio-stream";

function Player({ driveFileId }: { driveFileId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const src = `${FUNCTION_URL}?fileId=${driveFileId}`;

  function alternar() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  function pular(segundos: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + segundos));
  }

  function formatar(segundos: number) {
    if (!isFinite(segundos)) return "0:00";
    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const progresso = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="mt-4 p-5 rounded-xl border border-border/40 bg-background/40">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setCarregando(false);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setErro(true);
          setCarregando(false);
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {erro ? (
        <p className="text-sm text-destructive text-center py-2">
          Não foi possível carregar este áudio. Verifique a chave da API do Google Drive.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground text-center mb-2">
            {carregando ? "Carregando áudio..." : `${formatar(current)} / ${formatar(duration)}`}
          </p>
          <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-gold/70 transition-all" style={{ width: `${progresso}%` }} />
          </div>
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Voltar 15 segundos"
              disabled={carregando}
              onClick={() => pular(-15)}
              className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center disabled:opacity-40"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pausar" : "Reproduzir"}
              disabled={carregando}
              onClick={alternar}
              className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center disabled:opacity-40"
            >
              {playing ? <Pause className="h-6 w-6 text-gold" /> : <Play className="h-6 w-6 text-gold ml-0.5" />}
            </button>
            <button
              type="button"
              aria-label="Avançar 15 segundos"
              disabled={carregando}
              onClick={() => pular(15)}
              className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center disabled:opacity-40"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AudioDramas() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [capitulos, setCapitulos] = useState<Capitulo[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("audiobooks")
      .select("id, title, description, drive_file_id")
      .order("order_index", { ascending: true })
      .then(({ data, error }) => {
        if (error) setErroLista(error.message);
        if (data) setCapitulos(data as Capitulo[]);
        setCarregandoLista(false);
      });
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
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>

          <h1 className="font-serif text-3xl gold-text-gradient mb-1">Gênesis — A Criação e a Queda</h1>
          <p className="text-muted-foreground mb-8">Dramatizações em áudio das narrativas bíblicas.</p>

          {carregandoLista && <p className="text-muted-foreground">Carregando capítulos...</p>}
          {erroLista && <p className="text-destructive">Erro ao carregar: {erroLista}</p>}
          {!carregandoLista && !erroLista && capitulos.length === 0 && (
            <p className="text-muted-foreground">Nenhum capítulo disponível ainda.</p>
          )}

          <div className="space-y-6">
            {capitulos.map((cap) => (
              <div key={cap.id} className="p-5 rounded-xl border border-border/50 bg-card/40">
                <h2 className="font-serif text-xl">{cap.title}</h2>
                {cap.description && (
                  <p className="text-sm text-muted-foreground mt-1">{cap.description}</p>
                )}
                <Player driveFileId={cap.drive_file_id} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
