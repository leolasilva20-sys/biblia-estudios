import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Lock, ChevronRight, FileText, GraduationCap, Star, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase, type Apostila } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Bíblia Estúdios" }] }),
  component: Dashboard,
});

const NIVEL_META: Record<Apostila["nivel"], { label: string; icon: typeof BookOpen; color: string }> = {
  iniciante: { label: "Iniciante", icon: BookOpen, color: "text-emerald-400" },
  intermediario: { label: "Intermediário", icon: FileText, color: "text-sky-400" },
  avancado: { label: "Avançado", icon: GraduationCap, color: "text-violet-400" },
  especialista: { label: "Especialista", icon: Crown, color: "text-amber-400" },
  consolidacao: { label: "Consolidação", icon: Sparkles, color: "text-gold" },
};

const ORDER: Apostila["nivel"][] = ["iniciante", "intermediario", "avancado", "especialista", "consolidacao"];

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  const { data: apostilas } = useQuery({
    queryKey: ["apostilas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apostilas")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data as Apostila[];
    },
    enabled: !!user,
  });

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando...</div>;
  }

  const sorted = [...(apostilas ?? [])].sort(
    (a, b) => ORDER.indexOf(a.nivel) - ORDER.indexOf(b.nivel),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm text-gold uppercase tracking-widest">Módulo 1</p>
          <h1 className="font-serif text-4xl md:text-5xl gold-text-gradient mt-2">Gênesis 1</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Cinco apostilas progressivas para o seu estudo, do primeiro contato à consolidação completa.
          </p>
        </div>

        <div className="grid gap-4">
          {sorted.map((ap, idx) => {
            const meta = NIVEL_META[ap.nivel];
            const Icon = meta.icon;
            return (
              <Link
                key={ap.id}
                to="/apostila/$id"
                params={{ id: ap.id }}
                className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 hover:border-gold/60 transition-all flex items-center gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center font-serif text-gold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{meta.label}</span>
                  </div>
                  <h3 className="font-serif text-xl mt-1 truncate">{ap.titulo}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" />
              </Link>
            );
          })}
          {(!apostilas || apostilas.length === 0) && (
            <div className="text-center text-muted-foreground py-12">Nenhuma apostila disponível.</div>
          )}
        </div>
      </main>
    </div>
  );
}
