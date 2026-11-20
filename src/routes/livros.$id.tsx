import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BooksAccess } from "@/components/books-access";
import { BookReader } from "@/components/book-reader";
import { bookContentQuery } from "@/lib/books.queries";

export const Route = createFileRoute("/livros/$id")({
  staticData: { sitemap: false },
  head: ({ params }) => ({ meta: [
    { title: `Leitura do livro ${params.id} — Bíblia Estúdios` },
    { name: "description", content: "Leia seu livro com sumário, páginas e ajustes de leitura acessíveis." },
    { property: "og:title", content: `Leitura do livro ${params.id} — Bíblia Estúdios` },
    { property: "og:description", content: "Leitor de livros acessível do Bíblia Estúdios." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: LivroPage,
});

function LoadedBook({ userId, id }: { userId: string; id: number }) {
  const { data } = useSuspenseQuery(bookContentQuery(userId, id));
  return <BookReader key={id} content={data} bookId={id} />;
}

function LivroPage() {
  const { id } = Route.useParams();
  return <BooksAccess>{(userId) => <LoadedBook userId={userId} id={Number(id)} />}</BooksAccess>;
}