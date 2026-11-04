import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useRequireAccess } from "@/hooks/use-require-access";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/cursos")({
  head: () => ({
    meta: [
      { title: "Cursos — Bíblia Estúdios" },
      { name: "description", content: "Cursos em vídeo de estudo bíblico do Bíblia Estúdios." },
      { property: "og:title", content: "Cursos — Bíblia Estúdios" },
      { property: "og:description", content: "Cursos em vídeo de estudo bíblico do Bíblia Estúdios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CursosPage,
});

type Curso = { id: string; titulo: string; descricao: string | null; youtube_url: string; criado_em: string };

/** Aceita link normal, youtu.be, shorts, embed ou o código <iframe> inteiro. */
export function youtubeEmbed(input: string): string | null {
  const src = input.match(/src="([^"]+)"/)?.[1] ?? input.trim();
  const id =
    src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/)?.[1] ??
    src.match(/youtu\.be\/([\w-]{11})/)?.[1] ??
    src.match(/[?&]v=([\w-]{11})/)?.[1] ??
    src.match(/shorts\/([\w-]{11})/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function CursosPage() {
  const { ready, profile } = useRequireAccess();
  const isAdmin = profile?.nivel_admin === "admin";
  const qc = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");

  const { data: cursos = [], isLoading, error } = useQuery({
    queryKey: ["cursos"],
    enabled: ready,
    queryFn: async () => {
      const { data, error } = await supabase.from("cursos").select("*").order("criado_em", { ascending: false });
      if (error) throw error;
      return data as Curso[];
    },
  });

  const adicionar = async () => {
    const embed = youtubeEmbed(link);
    if (!titulo.trim() || !embed) return toast.error("Informe título e um link válido do YouTube");
    const { error } = await supabase.from("cursos").insert({ titulo, descricao: descricao || null, youtube_url: embed });
    if (error) return toast.error(error.message);
    setTitulo(""); setDescricao(""); setLink("");
    toast.success("Curso publicado");
    qc.invalidateQueries({ queryKey: ["cursos"] });
  };

  const remover = async (id: string) => {
    if (!confirm("Remover este curso?")) return;
    const { error } = await supabase.from("cursos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["cursos"] });
  };

  return (
    <div className="min-h-screen md:flex">
      <AppSidebar />
      <main className="flex-1 px-4 md:px-10 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="h-8 w-8 text-gold" />
          <h1 className="font-serif text-3xl gold-text-gradient">Cursos</h1>
        </div>

        {isAdmin && (
          <section className="rounded-xl border border-gold/30 bg-card/40 p-5 mb-8 space-y-3">
            <h2 className="font-serif text-gold">Publicar novo curso</h2>
            <Input placeholder="Título do curso" value={titulo} onChange={(e) => setTitulo(e.target.value)} aria-label="Título" />
            <Textarea rows={2} placeholder="Descrição (opcional)" value={descricao} onChange={(e) => setDescricao(e.target.value)} aria-label="Descrição" />
            <Input placeholder="Link do YouTube ou código de incorporação" value={link} onChange={(e) => setLink(e.target.value)} aria-label="Link do YouTube" />
            <Button onClick={adicionar} className="bg-gold text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-1" /> Publicar</Button>
          </section>
        )}

        {isLoading && <p className="text-muted-foreground">Carregando cursos...</p>}
        {error && <p className="text-muted-foreground">Os cursos ainda não estão disponíveis.</p>}
        {!isLoading && !error && cursos.length === 0 && <p className="text-muted-foreground">Nenhum curso publicado ainda.</p>}

        <div className="grid gap-6 sm:grid-cols-2">
          {cursos.map((c) => (
            <article key={c.id} className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="aspect-video bg-muted">
                <iframe className="w-full h-full" src={c.youtube_url} title={c.titulo} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg text-gold">{c.titulo}</h3>
                  {isAdmin && (
                    <button onClick={() => remover(c.id)} aria-label={`Remover curso ${c.titulo}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
                {c.descricao && <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{c.descricao}</p>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
