import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NotebookPen, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { supabase, type Caderno } from "@/lib/supabase";
import { useRequireAccess } from "@/hooks/use-require-access";

export const Route = createFileRoute("/cadernos/")({
  head: () => ({
    meta: [
      { title: "Meus Cadernos — Bíblia Estúdios" },
      { name: "description", content: "Escreva e organize suas anotações de estudo bíblico em cadernos pessoais." },
      { property: "og:title", content: "Meus Cadernos — Bíblia Estúdios" },
      { property: "og:description", content: "Escreva e organize suas anotações de estudo bíblico em cadernos pessoais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CadernosPage,
});

function CadernosPage() {
  const { ready, user } = useRequireAccess();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cadernos", user?.id],
    enabled: ready,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cadernos")
        .select("*")
        .order("atualizado_em", { ascending: false });
      if (error) throw error;
      return data as Caderno[];
    },
  });

  const criar = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("cadernos")
      .insert({ user_id: user.id, titulo: "Novo caderno", conteudo: "" })
      .select()
      .single();
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["cadernos"] });
    navigate({ to: "/cadernos/$id", params: { id: (data as Caderno).id } });
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">Carregando...</main>
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
              <p className="text-xs text-gold uppercase tracking-widest">Anotações</p>
              <h1 className="font-serif text-4xl gold-text-gradient mt-1">Meus cadernos</h1>
              <p className="text-muted-foreground mt-2 font-serif italic">
                Escreva livremente. O professor pode ler e deixar observações.
              </p>
            </div>
            <Button onClick={criar} className="bg-gold text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" /> Criar novo caderno
            </Button>
          </div>

          {isLoading && <p className="text-muted-foreground">Carregando cadernos...</p>}

          <div className="grid gap-3">
            {(data ?? []).map((c) => (
              <Link
                key={c.id}
                to="/cadernos/$id"
                params={{ id: c.id }}
                aria-label={`Abrir caderno ${c.titulo}`}
                className="group rounded-xl border border-border/60 bg-card/60 p-5 hover:border-gold/60 transition-all flex items-center gap-4"
              >
                <NotebookPen className="h-5 w-5 text-gold flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl truncate">{c.titulo}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Atualizado em {new Date(c.atualizado_em).toLocaleString("pt-BR")}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold" />
              </Link>
            ))}
          </div>

          {data && data.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              Você ainda não tem cadernos. Crie o primeiro acima.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
