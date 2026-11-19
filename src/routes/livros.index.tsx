import { createFileRoute } from "@tanstack/react-router";
import { BooksListPage } from "@/routes/livros";

export const Route = createFileRoute("/livros/")({
  head: () => ({ meta: [
    { title: "Livros — Bíblia Estúdios" },
    { name: "description", content: "Livros do Bíblia Estúdios em um leitor acessível com páginas e sumário." },
    { property: "og:title", content: "Livros — Bíblia Estúdios" },
    { property: "og:description", content: "Leia os livros do Bíblia Estúdios." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: BooksListPage,
});