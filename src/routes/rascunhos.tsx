import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PenLine, Plus, Trash2, NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useRequireAccess } from "@/hooks/use-require-access";
import {
  listarRascunhos,
  criarRascunho,
  apagarRascunho,
  type Rascunho,
} from "@/lib/rascunhos.functions";

export const Route = createFileRoute("/rascunhos")({
  head: () => ({
    meta: [
      { title: "Rascunhos — Bíblia Estúdios" },
      {
        name: "description",
        content:
          "Anote ideias soltas em rascunhos privados e mova para os seus cadernos quando estiverem prontos.",
      },
      { property: "og:title", content: "Rascunhos — Bíblia Estúdios" },
      {
        property: "og:description",
        content:
          "Anote ideias soltas em rascunhos privados e mova para os seus cadernos quando estiverem prontos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RascunhosPage,
});

const LOCAL_KEY = "be:rascunhos-locais";

function lerLocais(): Rascunho[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? "[]") as Rascunho[];
  } catch {
    return [];
  }
}

function salvarLocais(rs: Rascunho[]) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(rs));
}

async function getToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

function RascunhosPage() {
  const { ready, user } = useRequireAccess();
  const qc = useQueryClient();

  const [criando, setCriando] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [locais, setLocais] = useState<Rascunho[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => setLocais(lerLocais()), []);

  const { data, isLoading } = useQuery({
    queryKey: ["rascunhos", user?.id],
    enabled: ready,
    queryFn: async () => {
      const accessToken = await getToken();
      return listarRascunhos({ data: { accessToken } });
    },
    retry: false,
  });

  const usandoKeep = data?.configurado === true;
  const rascunhos = usandoKeep ? data.rascunhos : locais;

  const criar = async () => {
    if (!titulo.trim() && !conteudo.trim()) {
      return toast.error("Escreva algo antes de salvar.");
    }
    setSalvando(true);
    try {
      if (usandoKeep) {
        const accessToken = await getToken();
        await criarRascunho({
          data: { accessToken, titulo: titulo.trim() || "Rascunho", conteudo },
        });
        await qc.invalidateQueries({ queryKey: ["rascunhos"] });
      } else {
        const novo: Rascunho = {
          id: crypto.randomUUID(),
          titulo: titulo.trim() || "Rascunho",
          conteudo,
          atualizado_em: new Date().toISOString(),
        };
        const next = [novo, ...locais];
        setLocais(next);
        salvarLocais(next);
      }
      setTitulo("");
      setConteudo("");
      setCriando(false);
      toast.success("Rascunho salvo.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não consegui salvar o rascunho.");
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (r: Rascunho) => {
    try {
      if (usandoKeep) {
        const accessToken = await getToken();
        await apagarRascunho({ data: { accessToken, id: r.id } });
        await qc.invalidateQueries({ queryKey: ["rascunhos"] });
      } else {
        const next = locais.filter((x) => x.id !== r.id);
        setLocais(next);
        salvarLocais(next);
      }
      toast.success("Rascunho apagado.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não consegui apagar o rascunho.");
    }
  };

  const mover = async (r: Rascunho) => {
    if (!user) return;
    const { error } = await supabase
      .from("cadernos")
      .insert({ user_id: user.id, titulo: r.titulo, conteudo: r.conteudo });
    if (error) return toast.error(error.message);
    await remover(r);
    await qc.invalidateQueries({ queryKey: ["cadernos"] });
    toast.success("Rascunho movido para os seus cadernos.");
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          Carregando...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs text-gold uppercase tracking-widest">Bloco de notas</p>
              <h1 className="font-serif text-4xl gold-text-gradient mt-1">Rascunhos</h1>
              <p className="text-muted-foreground mt-2 font-serif italic">
                Anotações rápidas e privadas. Só o que você mover para os cadernos fica visível
                para o professor.
              </p>
            </div>
            <Button
              onClick={() => setCriando((v) => !v)}
              className="bg-gold text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" /> Criar novo rascunho
            </Button>
          </div>

          {!isLoading && !usandoKeep && (
            <p className="mb-6 text-sm text-amber-400 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3">
              O Google Keep ainda não está conectado. Por enquanto os rascunhos ficam salvos
              apenas neste aparelho. Assim que a chave do Keep for adicionada nos segredos do
              site, eles passam a ser salvos no bloco de notas do Google automaticamente.
            </p>
          )}

          {criando && (
            <div className="mb-8 rounded-xl border border-gold/30 bg-card/60 p-5 space-y-4">
              <div>
                <Label htmlFor="titulo-rascunho">Título</Label>
                <Input
                  id="titulo-rascunho"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex.: ideias sobre Gênesis 1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="conteudo-rascunho">Anotação</Label>
                <Textarea
                  id="conteudo-rascunho"
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={8}
                  placeholder="Escreva livremente..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={criar}
                  disabled={salvando}
                  className="bg-gold text-primary-foreground hover:opacity-90"
                >
                  {salvando ? "Salvando..." : "Salvar rascunho"}
                </Button>
                <Button variant="ghost" onClick={() => setCriando(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {isLoading && <p className="text-muted-foreground">Carregando rascunhos...</p>}

          <div className="grid gap-3">
            {rascunhos.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-border/60 bg-card/60 p-5"
              >
                <div className="flex items-start gap-3">
                  <PenLine className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-xl">{r.titulo}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Atualizado em {new Date(r.atualizado_em).toLocaleString("pt-BR")}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-foreground/90">{r.conteudo}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => mover(r)}
                    aria-label={`Mover o rascunho ${r.titulo} para os meus cadernos`}
                  >
                    <NotebookPen className="h-4 w-4 mr-1" /> Mover para meus cadernos
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remover(r)}
                    aria-label={`Apagar o rascunho ${r.titulo}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Apagar
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {!isLoading && rascunhos.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Nenhum rascunho por aqui. Clique em “Criar novo rascunho” para começar.{" "}
              <Link to="/cadernos" className="text-gold underline">
                Ver meus cadernos
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
