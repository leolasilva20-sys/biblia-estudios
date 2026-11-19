import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanMarkdown, parseBook, paginateParagraphs, savedPage, visibleBooks, missingBooksTable, type Livro } from "./books.ts";

test("capa extrai título, autor e gênero da estrutura fornecida", () => {
  const book = parseBook({ title: "Fallback", author: "Fallback", markdown: "# LIVRO\n\n**Leonardo Lameu**\n\n*Ficção bíblica*\n\n## **DEDICATÓRIA**\n\nPara todos." });
  assert.equal(book.title, "LIVRO"); assert.equal(book.author, "Leonardo Lameu"); assert.equal(book.genre, "Ficção bíblica");
});
test("paginação usa aproximadamente 1400 caracteres sem cortar parágrafos", () => {
  const paragraphs = ["a".repeat(800), "b".repeat(600), "c".repeat(1700)];
  assert.deepEqual(paginateParagraphs(paragraphs.join("\n\n")), paragraphs);
});
test("seções genéricas incluem capítulos futuros e epílogo, ignorando títulos vazios", () => {
  const book = parseBook({ title: "Livro", author: "Autor", markdown: "# Livro\n## **SUMÁRIO**\nTexto original\n## **CONTRACAPA**\nFim\n## **CAPÍTULO 42: NOVO**\n*Subtítulo*\n\n***Intertítulo***\n\n— Olá\\!\n## \n\nMais texto.\n## **EPÍLOGO**\nFinal" });
  assert.deepEqual(book.sections.map((s) => s.title), ["SUMÁRIO", "CAPÍTULO 42: NOVO", "EPÍLOGO", "CONTRACAPA"]);
  assert.equal(book.sections[1]?.page, 2);
  assert.ok(book.pages[1]?.markdown.includes("— Olá!"));
  assert.ok(book.pages[1]?.markdown.includes("***Intertítulo***"));
  assert.ok(book.pages[1]?.markdown.includes("Mais texto."));
  assert.equal(book.pages.at(-1)?.backCover, true);
});
test("remove escapes de pontuação sem apagar barras normais", () => {
  assert.equal(cleanMarkdown("Olá\\! \\*texto\\* caminho\\nome"), "Olá! *texto* caminho\\nome");
});
test("última página salva é limitada ao tamanho atual do livro", () => {
  assert.equal(savedPage(5, 3), 3); assert.equal(savedPage(-2, 3), 0); assert.equal(savedPage("2", 3), 0);
});
test("livros administrativos não aparecem para alunos", () => {
  const books = [{ id: 1, admin_only: true }, { id: 2, admin_only: false }] as Livro[];
  assert.deepEqual(visibleBooks(books, false).map((b) => b.id), [2]);
  assert.equal(visibleBooks(books, true).length, 2);
});
test("tabela ausente é reconhecida sem ocultar outros erros", () => {
  assert.equal(missingBooksTable({ code: "42P01" }), true);
  assert.equal(missingBooksTable({ code: "PGRST205" }), true);
  assert.equal(missingBooksTable({ code: "42501" }), false);
});