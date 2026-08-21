import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Volume2, Pause, Play, Square, NotebookPen,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { getApostila, buildDriveEmbedUrl } from "@/lib/apostilas";
import { getApostilaTexto } from "@/lib/apostila.functions";
import { useRequireAccess } from "@/hooks/use-require-access";

export const Route = createFileRoute("/apostila/$id")({
  head: () => ({
    meta: [
      { title: "Apostila de Gênesis — Bíblia Estúdios" },
      { name: "description", content: "Leia ou ouça a Apostila de Gênesis com paginação e narração acessível." },
      { property: "og:title", content: "Apostila de Gênesis — Bíblia Estúdios" },
      { property: "og:description", content: "Leia ou ouça a Apostila de Gênesis com paginação e narração acessível." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ApostilaViewer,
});

const PARAGRAFOS_POR_PAGINA = 12;

function ApostilaViewer() {
  const { id } = Route.useParams();
  const { ready } = useRequireAccess();
  const apostila = getApostila(id);

  const { data, isLoading } = useQuery({
    queryKey: ["apostila-texto", apostila?.drive_id],
    queryFn: () => getApostilaTexto({ data: { driveId: apostila!.drive_id } }),
    enabled: ready && !!apostila,
  });

  const paginas = useMemo(() => {
    const ps = data?.paragrafos ?? [];
    const out: string[][] = [];
    for (let i = 0; i < ps.length; i += PARAGRAFOS_POR_PAGINA) {
      out.push(ps.slice(i, i + PARAGRAFOS_POR_PAGINA));
    }
    return out;
  }, [data]);

  const [pagina, setPagina] = useState(0);
  const [falando, setFalando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [velocidade, setVelocidade] = useState(1);
  const topoRef = useRef<HTMLDivElement>(null);

  const parar = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setFalando(false);
    setPausado(false);
  };

  useEffect(() => () => parar(), []);
  useEffect(() => {
    parar();
    topoRef.current?.focus();
  }, [pagina]);

  if (!ready || !apostila) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          {apostila ? "Carregando..." : "Apostila não encontrada."}
        </main>
      </div>
    );
  }

  const conteudo = paginas[pagina] ?? [];
  const totalPaginas = paginas.length;

  const ouvir = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(conteudo.join("\n\n"));
    u.lang = "pt-BR";
    u.rate = velocidade;
    u.onend = () => { setFalando(false); setPausado(false); };
    u.onerror = () => { setFalando(false); setPausado(false); };
    window.speechSynthesis.speak(u);
    setFalando(true);
    setPausado(false);
  };

  const pausarOuContinuar = () => {
    const s = window.speechSynthesis;
    if (!s) return;
    if (pausado) { s.resume(); setPausado(false); } else { s.pause(); setPausado(true); }
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
            </Link>
            <Link to="/cadernos">
              <Button variant="outline" size="sm"><NotebookPen className="h-4 w-4 mr-1" /> Meus cadernos</Button>
            </Link>
          </div>

          <h1
            ref={topoRef}
            tabIndex={-1}
            className="font-serif text-3xl md:text-4xl gold-text-gradient outline-none"
          >
            {apostila.titulo}
          </h1>

          {isLoading && <p className="mt-8 text-muted-foreground">Carregando o texto da apostila...</p>}

          {!isLoading && data && !data.ok && (
            <div className="mt-6">
              <p className="text-sm text-amber-400 mb-3">
                {data.erro} Exibindo o documento original abaixo (sem narração).
              </p>
              <div className="rounded-xl border border-border/60 overflow-hidden bg-white">
                <iframe
                  src={buildDriveEmbedUrl(apostila)}
                  title={apostila.titulo}
                  className="w-full"
                  style={{ height: "70vh", minHeight: "500px", border: "none" }}
                />
              </div>
            </div>
          )}

          {!isLoading && data?.ok && (
            <>
              {/* Controles de leitura em voz */}
              <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-gold/30 bg-card/50 p-3">
                {!falando ? (
                  <Button onClick={ouvir} className="bg-gold text-primary-foreground hover:opacity-90">
                    <Volume2 className="h-4 w-4 mr-2" /> Ouvir esta página
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={pausarOuContinuar}>
                      {pausado ? <><Play className="h-4 w-4 mr-2" /> Continuar</> : <><Pause className="h-4 w-4 mr-2" /> Pausar</>}
                    </Button>
                    <Button variant="outline" onClick={parar}>
                      <Square className="h-4 w-4 mr-2" /> Parar
                    </Button>
                  </>
                )}
                <label className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  Velocidade
                  <select
                    aria-label="Velocidade da narração"
                    value={velocidade}
                    onChange={(e) => setVelocidade(Number(e.target.value))}
                    className="bg-background border border-border/60 rounded-md px-2 py-1 text-foreground"
                  >
                    <option value={0.75}>0,75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1,25x</option>
                    <option value={1.5}>1,5x</option>
                  </select>
                </label>
              </div>

              <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
                Página {pagina + 1} de {totalPaginas}
              </p>

              <article className="mt-4 space-y-5 font-serif text-lg md:text-xl leading-relaxed text-foreground/95">
                {conteudo.map((p, i) => (
                  <p key={`${pagina}-${i}`}>{p}</p>
                ))}
              </article>

              <nav className="mt-10 flex items-center justify-between gap-3 border-t border-border/50 pt-6">
                <Button
                  variant="outline"
                  disabled={pagina === 0}
                  onClick={() => setPagina((p) => Math.max(0, p - 1))}
                  aria-label={`Ir para a página ${pagina} de ${totalPaginas}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Página anterior
                </Button>
                <Button
                  variant="outline"
                  disabled={pagina >= totalPaginas - 1}
                  onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                  aria-label={`Ir para a página ${pagina + 2} de ${totalPaginas}`}
                >
                  Próxima página <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </nav>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
