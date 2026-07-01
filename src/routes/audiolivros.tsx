import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Music, Lock, Play, Pause } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";

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

function AudioPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  const src = `https://drive.google.com/uc?export=download&id=${driveFileId}&confirm=t`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-5 bg-background/40">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={(e) => { setDuration((e.target as HTMLAudioElement).duration); setLoading(false); }}
        onTimeUpdate={(e) => { const t = e.target as HTMLAudioElement; setProgress(t.currentTime / t.duration * 100); }}
        onEnded={() => setPlaying(false)}
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={loading}
          className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center hover:bg-gold/30 transition-colors disabled:opacity-40"
        >
          {playing ? <Pause className="h-5 w-5 text-gold" /> : <Play className="h-5 w-5 text-gold ml-0.5" />}
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-2">{loading ? "Carregando..." : `${fmt(audioRef.current?.currentTime ?? 0)} / ${fmt(duration)}`}</p>
          <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
            <div className="h-full bg-gold/70 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/50 mt-3 text-center select-none">
        © Bíblia Estúdios — conteúdo protegido
      </p>
    </div>
  );
}

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

function AudioLivros() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [selected, setSelected] = useState<Audiobook | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (!user || !profile?.acesso_liberado) return;
    (async () => {
      const { data, error } = await supabase
        .from("audiobooks")
        .select("*")
        .order("order_index", { ascending: true });
      if (!error && data) setAudiobooks(data as Audiobook[]);
      setLoadingAudio(false);
    })();
  }, [user, profile]);

  const temAcesso = (ab: Audiobook) => {
    if (!ab.admin_only) return true;
    const nivel = profile?.nivel_admin;
    return nivel === "admin" || nivel === "junior";
  };

  if (loading || !user || !profile?.acesso_liberado) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm text-gold uppercase tracking-widest">Bíblia Estúdios</p>
          <h1 className="font-serif text-4xl gold-text-gradient mt-2">Áudio Livros</h1>
          <p className="text-muted-foreground mt-3 font-serif italic">
            Ouça a Palavra narrada com profundidade e trilha sonora original.
          </p>
        </div>

        {selected && temAcesso(selected) && (
          <div className="mb-10 rounded-xl border border-gold/30 bg-card/60 overflow-hidden">
            <div className="p-5 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  {selected.is_new && (
                    <span className="text-xs font-semibold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full mr-2">
                      Novidade
                    </span>
                  )}
                  <span className="font-serif text-lg">{selected.title}</span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs text-muted-foreground hover:text-gold transition-colors"
                >
                  Fechar
                </button>
              </div>
              {selected.description && (
                <p className="text-sm text-muted-foreground mt-2">{selected.description}</p>
              )}
            </div>
            <AudioPlayer driveFileId={selected.drive_file_id} title={selected.title} />
          </div>
        )}

        {loadingAudio ? (
          <p className="text-muted-foreground">Carregando áudio livros...</p>
        ) : audiobooks.length === 0 ? (
          <p className="text-muted-foreground">Nenhum áudio livro disponível ainda.</p>
        ) : (
          <div className="space-y-4">
            {audiobooks.map((ab) => {
              const acesso = temAcesso(ab);
              return (
                <div
                  key={ab.id}
                  onClick={() => acesso && setSelected(ab)}
                  className={`group rounded-xl border p-5 flex items-center gap-5 transition-all ${
                    acesso
                      ? "border-border/60 bg-card/60 hover:border-gold/60 cursor-pointer"
                      : "border-border/30 bg-card/30 opacity-60 cursor-default"
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                    {acesso ? (
                      <Music className="h-5 w-5 text-gold" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ab.is_new && acesso && (
                        <span className="text-xs font-semibold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                          Novidade
                        </span>
                      )}
                      {!acesso && (
                        <span className="text-xs bg-muted/40 text-muted-foreground border border-border/40 px-2 py-0.5 rounded-full">
                          Em breve
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl mt-1 truncate">{ab.title}</h3>
                    {ab.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{ab.description}</p>
                    )}
                  </div>
                  {acesso && (
                    <span className="text-muted-foreground group-hover:text-gold transition-colors text-lg flex-shrink-0">▶</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
