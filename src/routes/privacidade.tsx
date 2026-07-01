import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Política de Privacidade — Bíblia Estúdios" }] }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <BookOpen className="h-5 w-5 text-gold" />
          <span className="font-serif text-lg gold-text-gradient">Bíblia Estúdios</span>
        </Link>
      </header>
      <main className="flex-1 container mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-serif text-3xl gold-text-gradient mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: junho de 2026</p>

        <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-gold mb-2">1. Dados que coletamos</h2>
            <p>
              Coletamos nome completo, e-mail e, opcionalmente, número de WhatsApp informado no
              cadastro. Se você entrar com sua conta Google, recebemos nome, e-mail e foto de
              perfil associados a essa conta.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">2. Como usamos seus dados</h2>
            <p>
              Usamos seus dados para autenticação, acompanhamento do seu progresso nos estudos,
              envio de comunicações relacionadas à plataforma e suporte quando solicitado. Não
              vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">3. Armazenamento</h2>
            <p>
              Seus dados são armazenados de forma segura através do Supabase, com controle de
              acesso restrito por linha (Row Level Security), garantindo que apenas você e os
              administradores autorizados possam visualizar suas informações.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">4. Seus direitos</h2>
            <p>
              Você pode solicitar a exclusão da sua conta e dos seus dados a qualquer momento
              entrando em contato pela nossa{" "}
              <Link to="/suporte" className="text-gold hover:underline">
                página de suporte
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">5. Cookies e sessão</h2>
            <p>
              Utilizamos cookies e armazenamento local exclusivamente para manter sua sessão
              ativa e lembrar suas preferências dentro da plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">6. Alterações</h2>
            <p>
              Esta política pode ser atualizada conforme a plataforma evolui. Mudanças
              significativas serão comunicadas por e-mail ou aviso na plataforma.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
