import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, BookOpen, List, Moon, Sun } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { parseBook, savedPage, type BookContent } from "@/lib/books";

export function BookReader({ content, bookId }: { content: BookContent; bookId: number }) {
  const book = useMemo(() => parseBook(content), [content]);
  const [page, setPage] = useState(0);
  const [font, setFont] = useState(1);
  const [light, setLight] = useState(false);
  const [restored, setRestored] = useState(false);
  const [toc, setToc] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousPage = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = book.pages.length;
  const current = book.pages[page - 1];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`livro:${bookId}:leitura`) ?? "null");
      if (saved) {
        setPage(savedPage(saved.page, total));
        if (Number.isInteger(saved.font)) setFont(Math.max(0, Math.min(3, saved.font)));
        setLight(saved.light === true);
      }
    } catch { /* storage is optional */ }
    setRestored(true);
  }, [bookId, total]);

  useEffect(() => {
    if (!restored) return;
    try { localStorage.setItem(`livro:${bookId}:leitura`, JSON.stringify({ page, font, light })); } catch { /* reading still works */ }
  }, [page, font, light, restored, bookId]);

  useEffect(() => {
    if (previousPage.current !== page && restored) heading.current?.focus({ preventScroll: true });
    previousPage.current = page;
  }, [page, restored]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const element = event.target instanceof HTMLElement ? event.target : null;
      if (toc || event.altKey || event.ctrlKey || event.metaKey || element?.closest("input, textarea, select, [contenteditable=true], [role=dialog]")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); setPage((p) => Math.min(total, p + 1)); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setPage((p) => Math.max(0, p - 1)); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toc, total]);

  const go = (next: number) => setPage(Math.max(0, Math.min(total, next)));
  const controls = "min-h-12 whitespace-normal px-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (!restored) return <p role="status">Preparando a leitura…</p>;

  return (
    <div className={`book-reader mx-auto max-w-4xl ${light ? "book-reader-light" : ""}`}>
      <nav aria-label="Barra do leitor" className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-border bg-background py-3">
        <Button asChild variant="outline" className={controls}><Link to="/livros"><ArrowLeft aria-hidden="true" />Livros</Link></Button>
        <Button variant="outline" className={controls} onClick={() => setToc(true)} aria-haspopup="dialog"><List aria-hidden="true" />Sumário</Button>
        <div className="flex gap-2" role="group" aria-label="Tamanho da fonte">
          <Button variant="outline" className={controls} onClick={() => setFont((f) => Math.max(0, f - 1))} disabled={font === 0} aria-label="A-: diminuir tamanho da fonte">A−</Button>
          <Button variant="outline" className={controls} onClick={() => setFont((f) => Math.min(3, f + 1))} disabled={font === 3} aria-label="A+: aumentar tamanho da fonte">A+</Button>
        </div>
        <Button variant="outline" className={controls} onClick={() => setLight((v) => !v)} aria-pressed={light}>{light ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}{light ? "Tema escuro" : "Tema claro"}</Button>
      </nav>

      <p role="status" aria-live="polite" aria-atomic="true" className="py-4 text-center text-sm text-muted-foreground">{page === 0 ? "Capa do livro" : `Página ${page} de ${total}`}</p>

      <article
        key={page}
        aria-label={page === 0 ? `Capa: ${book.title}` : current?.section}
        className={`book-sheet book-font-${font} ${page === 0 || current?.backCover ? "book-cover" : ""}`}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0];
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !end || window.getSelection()?.toString()) return;
          const dx = end.clientX - start.x;
          if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(end.clientY - start.y) * 1.5) go(page + (dx < 0 ? 1 : -1));
        }}
      >
        {page === 0 ? (
          <div className="flex min-h-[28rem] flex-col items-center justify-center gap-6 text-center">
            <BookOpen className="h-12 w-12 text-gold" aria-hidden="true" />
            <div className="h-px w-24 bg-gold" aria-hidden="true" />
            <h1 ref={heading} tabIndex={-1} className="break-words font-serif text-4xl leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring sm:text-5xl">{book.title}</h1>
            {book.author && <p className="font-serif text-2xl">{book.author}</p>}
            {book.genre && <p className="italic text-muted-foreground">{book.genre}</p>}
            <Button className={`${controls} mt-4`} onClick={() => go(1)}>Começar a ler<ArrowRight aria-hidden="true" /></Button>
          </div>
        ) : current && (
          <>
            <header className="mb-8 border-b border-border pb-5">
              <p className="mb-3 text-sm text-muted-foreground">{book.title}</p>
              <h2 ref={heading} tabIndex={-1} className="break-words font-serif text-3xl leading-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">{current.section}</h2>
            </header>
            <div className="book-text"><ReactMarkdown
              skipHtml
              components={{ a: ({ children, href }) => <a href={href} className="underline decoration-gold underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring" target="_blank" rel="noopener noreferrer">{children}</a> }}
            >{current.markdown}</ReactMarkdown></div>
            <footer className="mt-10 border-t border-border pt-4 text-center text-sm text-muted-foreground">Página {page} de {total}</footer>
          </>
        )}
      </article>

      <nav aria-label="Navegação entre páginas" className="mt-5 grid grid-cols-2 gap-3 pb-6">
        <Button variant="outline" className={`${controls} h-auto py-4`} disabled={page === 0} onClick={() => go(page - 1)}><ArrowLeft aria-hidden="true" />Página anterior</Button>
        <Button className={`${controls} h-auto py-4`} disabled={page === total} onClick={() => go(page + 1)}>Próxima página<ArrowRight aria-hidden="true" /></Button>
      </nav>

      <Dialog open={toc} onOpenChange={setToc}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content className={`book-reader ${light ? "book-reader-light" : ""} fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-background p-6 text-foreground shadow-xl`} onCloseAutoFocus={(event) => { event.preventDefault(); heading.current?.focus(); }}>
            <DialogTitle className="font-serif text-3xl">Sumário</DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">{book.title}</DialogDescription>
            <nav aria-label="Seções do livro" className="my-5 flex flex-col gap-2">
              <Button variant="outline" className={`${controls} h-auto justify-start py-3`} onClick={() => { go(0); setToc(false); }}>Capa</Button>
              {book.sections.map((section, index) => (
                <Button key={`${section.page}-${index}`} variant="outline" className={`${controls} h-auto justify-between gap-4 py-3 text-left`} onClick={() => { go(section.page); setToc(false); }}>
                  <span className="min-w-0 break-words">{section.title}</span><span className="shrink-0 text-muted-foreground">p. {section.page}</span>
                </Button>
              ))}
            </nav>
            <DialogClose asChild><Button className={`${controls} w-full`}>Fechar sumário</Button></DialogClose>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
}