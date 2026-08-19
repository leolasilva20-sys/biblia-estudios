import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase, type Caderno, type CadernoNota } from "@/lib/supabase";
import { useRequireAccess } from "@/hooks/use-require-access";

export const Route = createFileRoute("/cadernos/$id")({
  head: () => ({
    meta: [
      { title: "Caderno — Bíblia Estúdios" },
      { name: "description", content: "Edite suas anotações de estudo bíblico neste caderno pessoal." },
      { property: "og:title", content: "Caderno — Bíblia Estúdios" },
      { property: "og:description", content: "Edite suas anotações de estudo bíblico neste caderno pessoal." },
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

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [status, setStatus] = useState("");
  const [salvando, setSalvando] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["caderno", id],
    enabled: ready,
    queryFn: async () => {
      const { data, error } = await supabase.from("cadernos").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Caderno | null;
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
    if (data) {
      setTitulo(data.titulo);
      setConteudo(data.conteudo);
    }
  }, [data]);

  const salvar = async () => {
    setSalvando(true);
    const { error } = await supabase
      .from("cadernos")
      .update({ titulo: titulo.trim() || "Novo caderno", conteudo, atualizado_em: new Date().toISOString() })
      .eq("id", id);
    setSalvando(false);
    if (error) {
      setStatus("Erro ao salvar.");
      return toast.error(error.message);
    }
    setStatus("Caderno salvo com sucesso.");
    toast.success("Caderno salvo");
    qc.invalidateQueries({ queryKey: ["cadernos"] });
  };

  const apagar = async () => {
    if (!confirm("Apagar este caderno? Esta ação não pode ser desfeita.")) return;
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

  if (!data) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 px-6 py-16 text-center">
          <h1 className="font-serif text-2xl text-gold">Caderno não encontrado</h1>
          <Link to="/cadernos"><Button variant="outline" className="mt-6">Voltar aos cadernos</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link to="/cadernos">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={apagar} aria-label="Apagar este caderno">
              <Trash2 className="h-4 w-4 mr-1" /> Apagar
            </Button>
          </div>

          <label htmlFor="titulo" className="text-xs uppercase tracking-widest text-gold">Título do caderno</label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-2 font-serif text-2xl h-14"
          />

          <label htmlFor="conteudo" className="block mt-6 text-xs uppercase tracking-widest text-gold">
            Suas anotações
          </label>
          <Textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            rows={20}
            placeholder="Escreva livremente aqui..."
            className="mt-2 font-serif text-lg leading-relaxed"
          />

          <div className="mt-4 flex items-center gap-4">
            <Button onClick={salvar} disabled={salvando} className="bg-gold text-primary-foreground hover:opacity-90">
              <Save className="h-4 w-4 mr-2" /> {salvando ? "Salvando..." : "Salvar"}
            </Button>
            <span aria-live="polite" className="text-sm text-muted-foreground">{status}</span>
          </div>

          {nota?.observacao && (
            <section className="mt-10 rounded-xl border border-gold/40 bg-card/50 p-5">
              <h2 className="font-serif text-lg text-gold">Observação do professor</h2>
              <p className="mt-2 whitespace-pre-wrap text-foreground/90">{nota.observacao}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
