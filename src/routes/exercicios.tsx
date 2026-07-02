import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/exercicios")({
  head: () => ({ meta: [{ title: "Exercícios — Bíblia Estúdios" }] }),
  component: Exercicios,
});

const PERGUNTAS = [
  "Em suas próprias palavras, qual é a mensagem central de Gênesis 1?",
  "O que o conceito hebraico de \"tohu wa-bohu\" revela sobre o estado inicial da criação?",
  "Como a estrutura dos sete dias reflete a teologia do descanso e da ordem divina?",
  "Qual a diferença entre a cosmogonia bíblica e as cosmogonias do Antigo Oriente Médio?",
  "O que significa ser criado \"à imagem e semelhança de Deus\" (imago Dei)?",
];

function Exercicios() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [respostas, setRespostas] = useState<string[]>(Array(5).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (profile && !profile.acesso_liberado) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (respostas.some((r) => !r.trim())) {
      return toast.error("Responda todas as perguntas");
    }
    setSubmitting(true);
    const rows = PERGUNTAS.map((p, i) => ({
      user_id: user!.id,
      pergunta: p,
      resposta: respostas[i].trim(),
      status: "pendente",
    }));
    const { error } = await supabase.from("respostas").insert(rows);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    toast.success("Respostas enviadas para revisão!");
  };

  if (!user || !profile?.acesso_liberado) return null;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppSidebar />
        <main className="flex-1 container mx-auto max-w-2xl px-6 py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-6" />
          <h1 className="font-serif text-3xl gold-text-gradient mb-3">Respostas enviadas</h1>
          <p className="text-muted-foreground mb-8">
            Suas respostas foram registradas e serão revisadas em breve.
          </p>
          <Link to="/dashboard"><Button>Voltar ao dashboard</Button></Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppSidebar />
      <main className="flex-1 container mx-auto max-w-3xl px-6 py-10">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button>
        </Link>

        <div className="mb-8">
          <p className="text-sm text-gold uppercase tracking-widest">Consolidação</p>
          <h1 className="font-serif text-4xl gold-text-gradient mt-2">Exercícios — Gênesis 1</h1>
          <p className="text-muted-foreground mt-2">Responda com suas próprias palavras. Suas respostas serão revisadas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {PERGUNTAS.map((p, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5">
              <Label className="font-serif text-base text-gold">Pergunta {i + 1}</Label>
              <p className="mt-1 mb-3 text-foreground">{p}</p>
              <Textarea
                value={respostas[i]}
                onChange={(e) => {
                  const copy = [...respostas];
                  copy[i] = e.target.value;
                  setRespostas(copy);
                }}
                rows={4}
                placeholder="Sua resposta..."
                required
              />
            </div>
          ))}

          <Button type="submit" disabled={submitting} size="lg" className="w-full bg-gold text-primary-foreground hover:opacity-90">
            {submitting ? "Enviando..." : "Enviar respostas"}
          </Button>
        </form>
      </main>
    </div>
  );
}
