import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  Headphones,
  BookOpen,
  Clock,
  Gift,
  Check,
  Crown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium por tempo limitado — Bíblia Estúdios" },
      {
        name: "description",
        content:
          "Cadastro gratuito por tempo limitado: acesso aos áudio dramas, áudio livros, curso de religiosidade e sorteios para participar das produções.",
      },
      { property: "og:title", content: "Premium por tempo limitado — Bíblia Estúdios" },
      {
        property: "og:description",
        content:
          "Garanta acesso antecipado aos áudios da Bíblia Estúdios, ao curso de religiosidade e concorra a sorteios. Cadastro gratuito.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PremiumPage,
});

const BENEFITS = [
  {
    icon: Headphones,
    title: "Áudio dramas e áudio livros",
    desc: "Narração, dublagem, trilha original e vozes exclusivas da Bíblia Estúdios.",
  },
  {
    icon: BookOpen,
    title: "Curso de religiosidade",
    desc: "Acompanhe o curso que estou produzindo, aula por aula, direto na plataforma.",
  },
  {
    icon: Clock,
    title: "Acesso antecipado",
    desc: "Você ouve, lê e assiste antes de todo mundo — muito mais do que antecipado.",
  },
  {
    icon: Gift,
    title: "Sorteios exclusivos",
    desc: "Concorra a vagas para participar de perto das minhas produções.",
  },
];

function PremiumPage() {
  const { user, profile } = useAuth();
  const [nome, setNome] = useState(profile?.full_name ?? "");
  const [email, setEmail] = useState(profile?.email ?? user?.email ?? "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? "");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      toast.error("Preencha nome e email.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("premium_inscricoes").insert({
      user_id: user?.id ?? null,
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim() || null,
    });
    setSending(false);
    if (error) {
      toast.error("Não foi possível concluir o cadastro. Tente novamente.");
      return;
    }
    setDone(true);
    toast.success("Cadastro confirmado! Bem-vindo ao Premium.");
  };

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <section className="relative px-6 py-16 border-b border-border/50">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Tempo limitado — gratuito
            </span>
            <h1 className="font-serif text-4xl md:text-6xl gold-text-gradient mt-6 leading-tight">
              Premium da Bíblia Estúdios
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto font-serif italic">
              A fé também se ouve. Entre agora, sem pagar nada, e receba as
              Escrituras narradas, dramatizadas e ensinadas como você nunca viu —
              antes de todo mundo.
            </p>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6 flex gap-4"
              >
                <Icon className="h-6 w-6 text-gold flex-shrink-0" />
                <div>
                  <h2 className="font-serif text-xl">{title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="max-w-xl mx-auto rounded-2xl border border-gold/30 bg-card/70 backdrop-blur p-8">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-gold" />
              <h2 className="font-serif text-2xl gold-text-gradient">
                Cadastro gratuito
              </h2>
            </div>

            {done ? (
              <div className="text-center py-8">
                <Check className="h-10 w-10 text-gold mx-auto mb-4" />
                <p className="font-serif text-xl">Seu lugar está garantido.</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Você será avisado assim que os recursos Premium forem liberados.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    autoComplete="tel"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <Button type="submit" className="w-full h-12" disabled={sending}>
                  {sending ? "Enviando..." : "Quero meu acesso Premium grátis"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Gratuito por tempo limitado. Sem cartão de crédito.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
