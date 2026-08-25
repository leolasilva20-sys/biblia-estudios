import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase, type Caderno, type CadernoNota, type CadernoPagina } from "@/lib/supabase";
import { useRequireAccess } from "@/hooks/use-require-access";

export const Route = createFileRoute("/cadernos/$id")({
  head: () => ({
    meta: [
      { title: "Caderno — Bíblia Estúdios" },
      { name: "description", content: "Escreva página por página no seu caderno de estudo bíblico." },
      { property: "og:title", content: "Caderno — Bíblia Estúdios" },
      { property: "og:description", content: "Escreva página por página no seu caderno de estudo bíblico." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CadernoEditor,
});

function CadernoEditor() {
  const { id } = Route.useParams();
  const { ready } = useRequireAccess();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // -1 = capa do caderno
  const [indice, setIndice] = useState(-1);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [status, setStatus] = useState("");
  const [salvando, setSalvando] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { data: caderno, isLoading } = useQuery({
    queryKey: ["caderno", id],
    enabled: ready,
    queryFn: async () => {
      const { data, error } = await supabase.from("cadernos").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Caderno | null;
    },
  });

  const { data: paginas } = useQuery({
    queryKey: ["caderno-paginas", id],
    enabled: ready,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("caderno_paginas")
        .select("*")
        .eq("caderno_id", id)
        .order("numero_pagina", { ascending: true });
      if (error) throw error;
      return data as CadernoPagina[];
    },
  });

  const { data: nota } = useQuery({
    queryKey: ["caderno-nota", id],
    enabled: ready,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("caderno_notas")
        .select("*")
        .eq("caderno_id", id)
        .maybeSingle();
      if (error) throw error;
      return data as CadernoNota | null;
    },
  });

  useEffect(() => {
    if (caderno) setTitulo(caderno.titulo);
  }, [caderno]);

  const lista = paginas ?? [];
  const paginaAtual = indice >= 0 ? lista[indice] : undefined;

  useEffect(() => {
    setConteudo(paginaAtual?.conteudo ?? "");
    setStatus("");
  }, [paginaAtual?.id, paginaAtual?.conteudo]);

  const irPara = (novo: number) => {
    setIndice(novo);
    setTimeout(() => headingRef.current?.focus(), 30);
  };

  const salvarCapa = async () => {
    setSalvando(true);
    const { error } = await supabase
      .from("cadernos")
      .update({ titulo: titulo.trim() || "Novo caderno", atualizado_em: new Date().toISOString() })
      .eq("id", id);
    setSalvando(false);
    if (error) {
      setStatus("Erro ao salvar a capa.");
      return toast.error(error.message);
    }
    setStatus("Capa salva com sucesso.");
    toast.success("Capa salva");
    qc.invalidateQueries({ queryKey: ["cadernos"] });
    qc.invalidateQueries({ queryKey: ["caderno", id] });
  };

  const salvarPagina = async () => {
    if (!paginaAtual) return;
    setSalvando(true);
    const { error } = await supabase
      .from("caderno_paginas")
      .update({ conteudo, atualizado_em: new Date().toISOString() })
      .eq("id", paginaAtual.id);
    if (!error) {
      await supabase.from("cadernos").update({ atualizado_em: new Date().toISOString() }).eq("id", id);
    }
    setSalvando(false);
    if (error) {
      setStatus("Erro ao salvar a página.");
      return toast.error(error.message);
    }
    setStatus(`Página ${paginaAtual.numero_pagina} salva com sucesso.`);
    toast.success("Página salva");
    qc.invalidateQueries({ queryKey: ["caderno-paginas", id] });
    qc.invalidateQueries({ queryKey: ["cadernos"] });
  };

  const novaPagina = async () => {
    const proximo = lista.length ? Math.max(...lista.map((p) => p.numero_pagina)) + 1 : 1;
    const { data, error } = await supabase
      .from("caderno_paginas")
      .insert({ caderno_id: id, numero_pagina: proximo, conteudo: "" })
      .select()
      .single();
    if (error) return toast.error(error.message);
    await qc.invalidateQueries({ queryKey: ["caderno-paginas", id] });
    toast.success(`Página ${(data as CadernoPagina).numero_pagina} criada`);
    irPara(lista.length);
  };

  const apagarPagina = async () => {
    if (!paginaAtual) return;
    if (!confirm(`Apagar a página ${paginaAtual.numero_pagina}? Esta ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("caderno_paginas").delete().eq("id", paginaAtual.id);
    if (error) return toast.error(error.message);
    await qc.invalidateQueries({ queryKey: ["caderno-paginas", id] });
    toast.success("Página apagada");
    irPara(Math.max(-1, indice - 1));
  };

  const apagarCaderno = async () => {
    if (!confirm("Apagar este caderno e todas as suas páginas? Esta ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("cadernos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Caderno apagado");
    qc.invalidateQueries({ queryKey: ["cadernos"] });
    navigate({ to: "/cadernos" });
  };

  if (!ready || isLoading) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">Carregando...</main>
      </div>
    );
  }

  if (!caderno) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 px-6 py-16 text-center">
          <h1 className="font-serif text-2xl text-gold">Caderno não encontrado</h1>
          <Link to="/cadernos">
            <Button variant="outline" className="mt-6">Voltar aos cadernos</Button>
          </Link>
        </main>
      </div>
    );
  }

  const total = lista.length;
  const podeVoltar = indice > -1;
  const podeAvancar = indice < total - 1;

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-4 sm:px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link to="/cadernos">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={apagarCaderno} aria-label="Apagar este caderno inteiro">
              <Trash2 className="h-4 w-4 mr-1" /> Apagar caderno
            </Button>
          </div>

          {/* Bloco de notas */}
          <article
            className="relative rounded-2xl border border-gold/30 bg-card/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
            aria-label={`Caderno ${caderno.titulo}`}
          >
            {/* Espiral / lombada */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-8 border-r border-gold/20 bg-gradient-to-r from-gold/15 to-transparent flex flex-col items-center justify-around py-6"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-gold/40" />
              ))}
            </div>

            <div className="pl-12 pr-5 sm:pr-8 py-8">
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-2xl sm:text-3xl gold-text-gradient outline-none"
              >
                {indice === -1
                  ? `Capa — ${caderno.titulo}`
                  : `Página ${paginaAtual?.numero_pagina ?? indice + 1} de ${total}`}
              </h1>

              <p aria-live="polite" className="sr-only">
                {indice === -1
                  ? "Você está na capa do caderno."
                  : `Você está na página ${indice + 1} de ${total}.`}
              </p>

              {indice === -1 ? (
                <div className="mt-6">
                  <label htmlFor="titulo" className="text-xs uppercase tracking-widest text-gold">
                    Título do caderno
                  </label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="mt-2 font-serif text-2xl h-14"
                  />
                  <p className="mt-4 text-sm text-muted-foreground font-serif italic">
                    {total === 0
                      ? "Este caderno ainda não tem páginas. Crie a primeira página abaixo."
                      : `Este caderno tem ${total} ${total === 1 ? "página" : "páginas"}.`}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={salvarCapa}
                      disabled={salvando}
                      className="bg-gold text-primary-foreground hover:opacity-90"
                    >
                      <Save className="h-4 w-4 mr-2" /> {salvando ? "Salvando..." : "Salvar capa"}
                    </Button>
                    {total > 0 && (
                      <Button variant="outline" onClick={() => irPara(0)} aria-label="Abrir a primeira página do caderno">
                        <BookOpen className="h-4 w-4 mr-2" /> Abrir caderno
                      </Button>
                    )}
                  </div>
                </div>
              ) : paginaAtual ? (
                <div className="mt-6">
                  <label htmlFor="conteudo" className="text-xs uppercase tracking-widest text-gold">
                    Escreva nesta página
                  </label>
                  <Textarea
                    id="conteudo"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    rows={18}
                    placeholder="Escreva livremente aqui..."
                    className="mt-2 font-serif text-lg leading-[2rem] bg-transparent [background-image:repeating-linear-gradient(transparent,transparent_31px,hsl(var(--border))_32px)] [background-attachment:local]"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={salvarPagina}
                      disabled={salvando}
                      className="bg-gold text-primary-foreground hover:opacity-90"
                    >
                      <Save className="h-4 w-4 mr-2" /> {salvando ? "Salvando..." : "Salvar página"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={apagarPagina} aria-label="Apagar esta página">
                      <Trash2 className="h-4 w-4 mr-1" /> Apagar página
                    </Button>
                  </div>
                </div>
              ) : null}

              <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">{status}</p>

              {/* Navegação do caderno */}
              <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
                <Button
                  variant="outline"
                  disabled={!podeVoltar}
                  onClick={() => irPara(indice - 1)}
                  aria-label={indice === 0 ? "Voltar para a capa do caderno" : `Ir para a página ${indice} de ${total}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> {indice === 0 ? "Capa" : "Página anterior"}
                </Button>

                <span className="text-sm text-muted-foreground">
                  {indice === -1 ? "Capa" : `${indice + 1} / ${total}`}
                </span>

                {podeAvancar ? (
                  <Button
                    variant="outline"
                    onClick={() => irPara(indice + 1)}
                    aria-label={`Ir para a página ${indice + 2} de ${total}`}
                  >
                    Próxima página <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={novaPagina}
                    className="bg-gold text-primary-foreground hover:opacity-90"
                    aria-label="Criar uma nova página em branco no fim do caderno"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Nova página
                  </Button>
                )}
              </nav>
            </div>
          </article>

          {nota?.observacao && (
            <section className="mt-8 rounded-xl border border-gold/40 bg-card/50 p-5">
              <h2 className="font-serif text-lg text-gold">Observação do professor</h2>
              <p className="mt-2 whitespace-pre-wrap text-foreground/90">{nota.observacao}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
