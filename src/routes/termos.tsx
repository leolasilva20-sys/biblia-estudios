import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de Serviço — Bíblia Estúdios" }] }),
  component: Termos,
});

function Termos() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <BookOpen className="h-5 w-5 text-gold" />
          <span className="font-serif text-lg gold-text-gradient">Bíblia Estúdios</span>
        </Link>
      </header>
      <main className="flex-1 container mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-serif text-3xl gold-text-gradient mb-2">Termos de Serviço</h1>
        <p className="text-sm text-muted-foreground mb-8">Última atualização: junho de 2026</p>

        <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-gold mb-2">1. Sobre a plataforma</h2>
            <p>
              O Bíblia Estúdios é uma plataforma educacional independente dedicada ao estudo
              aprofundado das Escrituras, oferecendo apostilas, áudio livros e conteúdo
              complementar. O acesso está atualmente em fase beta, disponível por convite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">2. Cadastro e conta</h2>
            <p>
              Para usar a plataforma, você deve fornecer um endereço de e-mail válido e, quando
              aplicável, um código de convite. Você é responsável por manter a confidencialidade
              da sua senha e por todas as atividades realizadas em sua conta.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">3. Uso do conteúdo</h2>
            <p>
              Todo o conteúdo disponibilizado — apostilas, áudio livros, textos e materiais
              relacionados — é de propriedade do Bíblia Estúdios e de seus autores. É proibido
              baixar, redistribuir, copiar ou comercializar esse conteúdo sem autorização prévia
              por escrito.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">4. Conduta do usuário</h2>
            <p>
              Esperamos que você utilize a plataforma com respeito, sem tentar burlar
              mecanismos de segurança, compartilhar credenciais de acesso ou usar o conteúdo
              para fins comerciais não autorizados.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">5. Disponibilidade</h2>
            <p>
              Por estarmos em fase beta, funcionalidades podem mudar, ser adicionadas ou
              removidas sem aviso prévio. Fazemos o possível para manter a plataforma estável,
              mas não garantimos disponibilidade ininterrupta.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-gold mb-2">6. Contato</h2>
            <p>
              Dúvidas sobre estes termos podem ser enviadas através da nossa{" "}
              <Link to="/suporte" className="text-gold hover:underline">
                página de suporte
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
