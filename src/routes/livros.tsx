import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { BooksAccess } from "@/components/books-access";
import { Button } from "@/components/ui/button";
import { booksQuery } from "@/lib/books.queries";
import { visibleBooks } from "@/lib/books";

export const Route = createFileRoute("/livros")({
  staticData: { sitemap: "exclude-subtree" }, component: () => <Outlet /> });

export function BooksList({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const { data } = useSuspenseQuery(booksQuery(userId));
  const books = visibleBooks(data, isAdmin);
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center gap-4 border-b border-border pb-6">
        <BookOpen className="h-9 w-9 shrink-0 text-gold" aria-hidden="true" />
        <h1 className="font-serif text-4xl text-gold">Livros</h1>
      </header>
      {!books.length ? <p role="status" className="py-12 text-center text-muted-foreground">Nenhum livro disponível ainda</p> : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <article key={book.id} className="flex min-w-0 flex-col rounded-lg border border-gold/30 bg-card p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <BookOpen className="h-8 w-8 text-gold" aria-hidden="true" />
                {book.is_new && <span className="rounded-sm bg-gold px-3 py-1 text-sm font-semibold text-primary-foreground">Novo</span>}
              </div>
              <h2 className="break-words font-serif text-3xl leading-tight">{book.title}</h2>
              {book.author && <p className="mt-3 text-gold">{book.author}</p>}
              {book.description && <p className="mt-4 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground">{book.description}</p>}
              <Button asChild className="mt-8 min-h-12 w-full whitespace-normal focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <Link to="/livros/$id" params={{ id: String(book.id) }} aria-label={`Abrir livro: ${book.title}`}>Abrir livro</Link>
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function BooksListPage() {
  return <BooksAccess>{(userId, isAdmin) => <BooksList userId={userId} isAdmin={isAdmin} />}</BooksAccess>;
}