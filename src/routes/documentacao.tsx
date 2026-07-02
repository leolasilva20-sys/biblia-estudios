import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/documentacao")({
  head: () => ({ meta: [{ title: "Documentação — Bíblia Estúdios" }] }),
  component: Documentacao,
});

type Doc = {
  id: number;
  categoria: string;
  titulo: string;
  conteudo: string;
  ordem: number;
};

const CATEGORIA_LABEL: Record<string, string> = {
  sobre: "Sobre o Bíblia Estúdios",
  autenticacao: "Login e Autenticação",
  suporte: "Suporte",
  privacidade: "Privacidade e Segurança",
};

function Documentacao() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("documentacao")
        .select("*")
        .order("ordem", { ascending: true });
      if (!error && data) setDocs(data as Doc[]);
      setLoading(false);
    })();
  }, []);

  const categorias = Array.from(new Set(docs.map((d) => d.categoria)));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <BookOpen className="h-5 w-5 text-gold" />
          <span className="font-serif text-lg gold-text-gradient">Bíblia Estúdios</span>
        </Link>
      </header>

      <main className="flex-1 container mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-serif text-4xl gold-text-gradient mb-2">Documentação</h1>
        <p className="text-muted-foreground text-sm mb-10 font-serif italic">
          Tudo o que você precisa saber sobre como usamos, protegemos e apresentamos
          nossos conteúdos.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : (
          <div className="space-y-12">
            {categorias.map((cat) => (
              <section key={cat}>
                <h2 className="font-serif text-2xl text-gold mb-6 pb-2 border-b border-border/40">
                  {CATEGORIA_LABEL[cat] ?? cat}
                </h2>
                <div className="space-y-8">
                  {docs
                    .filter((d) => d.categoria === cat)
                    .map((d) => (
                      <div key={d.id}>
                        <h3 className="font-serif text-lg text-foreground mb-2">{d.titulo}</h3>
                        <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                          {d.conteudo}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground/70 mt-12 pt-8 border-t border-border/40">
          Dúvidas que não foram respondidas aqui?{" "}
          <Link to="/suporte" className="text-gold hover:underline">
            Fale com nosso suporte
          </Link>
        </p>
      </main>
    </div>
  );
}
