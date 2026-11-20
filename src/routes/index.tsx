import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookOpen, Scroll, GraduationCap, Sparkles, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";
import heroManuscript from "@/assets/hero-manuscript.jpg";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Bíblia Estúdios — Estudo bíblico em profundidade" },
      { name: "description", content: "Estude a Bíblia em profundidade com apostilas, contexto original e hebraico, cursos, livros e áudio dramas no Bíblia Estúdios." },
      { property: "og:title", content: "Bíblia Estúdios — Estudo bíblico em profundidade" },
      { property: "og:description", content: "Estude a Bíblia em profundidade com apostilas, contexto original e hebraico, cursos, livros e áudio dramas no Bíblia Estúdios." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://biblia-estudios.lovable.app/" },
      { property: "og:site_name", content: "Bíblia Estúdios" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://biblia-estudios.lovable.app/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Bíblia Estúdios",
        url: "https://biblia-estudios.lovable.app/",
        inLanguage: "pt-BR",
        description: "Plataforma cristã gratuita para estudo bíblico em profundidade com apostilas, cursos, livros e áudio dramas.",
      }),
    }],
  }),
  component: Landing,
});

function Landing() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    if (profile && !profile.acesso_liberado) {
      navigate({ to: "/complete-profile", replace: true });
    } else {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, profile, loading, navigate]);

  if (!loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Redirecionando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <img
            src={heroManuscript}
            alt=""
            width={1600}
            height={912}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="relative container mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Sua jornada nas Escrituras
          </div>
          <h1 className="font-serif text-5xl md:text-7xl gold-text-gradient leading-tight">
            Bíblia Estúdios
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-serif italic">
            Tudo que você precisa para entender a Bíblia em profundidade.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-gold text-primary-foreground hover:opacity-90 font-medium px-8">
                Entrar
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-gold/40 text-foreground hover:bg-accent px-8">
                Continuar com o Google
              </Button>
            </Link>
          </div>
          <div className="ornament-divider mt-16 max-w-xs mx-auto">
            <Sparkles className="h-4 w-4" />
          </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold">Tudo em um só lugar</p>
            <h2 className="mt-2 font-serif text-3xl">Aprenda, anote e ouça</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Scroll, title: "Apostilas", desc: "Estudo aprofundado, do iniciante ao especialista, com hebraico e contexto original." },
              { icon: GraduationCap, title: "Cursos", desc: "Aulas estruturadas para aprender de forma guiada, no seu ritmo." },
              { icon: BookOpen, title: "Livros", desc: "Obras completas para quem quer se aprofundar ainda mais." },
              { icon: Headphones, title: "Áudio dramas", desc: "Narração, dublagem e trilha original para ouvir onde estiver." },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold/40 hover:bg-card/80">
                <div className="mb-4 w-fit rounded-xl border border-gold/25 bg-gold/10 p-3">
                  <f.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-serif text-xl mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
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
