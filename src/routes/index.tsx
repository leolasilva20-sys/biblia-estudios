import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Scroll, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bíblia Estúdios — Estudo bíblico em profundidade" },
      { name: "description", content: "Tudo que você precisa para entender a Bíblia em profundidade." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
          <div className="ornament-divider mb-8 max-w-xs mx-auto">
            <Scroll className="h-4 w-4" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl gold-text-gradient leading-tight">
            Bíblia Estúdios
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-serif italic">
            Tudo que você precisa para entender a Bíblia em profundidade.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gold text-primary-foreground hover:opacity-90 font-medium px-8">
                Começar gratuitamente
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-gold/40 text-foreground hover:bg-accent px-8">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <div className="ornament-divider mt-16 max-w-xs mx-auto">
            <Sparkles className="h-4 w-4" />
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-6 pb-24 grid md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Cinco níveis", desc: "Do iniciante ao especialista, com consolidação final." },
            { icon: GraduationCap, title: "Conteúdo curado", desc: "Apostilas escritas e revisadas para estudo sério." },
            { icon: Scroll, title: "Hebraico e contexto", desc: "Conceitos originais, cosmogonia e teologia bíblica." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur">
              <f.icon className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-serif text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground space-x-3">
        <span>© Bíblia Estúdios — Estudo bíblico em profundidade</span>
        <span>·</span>
        <Link to="/documentacao" className="hover:text-gold transition-colors">Documentação</Link>
        <span>·</span>
        <Link to="/termos" className="hover:text-gold transition-colors">Termos</Link>
        <span>·</span>
        <Link to="/privacidade" className="hover:text-gold transition-colors">Privacidade</Link>
      </footer>
    </div>
  );
}
