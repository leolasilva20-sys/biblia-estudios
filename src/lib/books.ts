export type Livro = {
  id: number;
  title: string;
  author: string | null;
  description: string | null;
  drive_file_id: string;
  order_index: number;
  admin_only: boolean;
  is_new: boolean;
  created_at: string;
};

export type BookContent = { title: string; author: string; markdown: string };
export type BookPage = { section: string; markdown: string; backCover: boolean };
export type ParsedBook = {
  title: string;
  author: string;
  genre: string;
  pages: BookPage[];
  sections: { title: string; page: number }[];
};

export function cleanMarkdown(text: string): string {
  return text.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~])/g, "$1").replace(/\r\n?/g, "\n");
}

function plain(text: string): string {
  return text.replace(/[*_`]/g, "").trim();
}

export function paginateParagraphs(markdown: string, limit = 1400): string[] {
  const paragraphs = markdown.trim().split(/\n\s*\n/).filter(Boolean);
  const pages: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (current && next.length > limit) {
      pages.push(current);
      current = paragraph;
    } else current = next;
  }
  if (current) pages.push(current);
  return pages.length ? pages : [""];
}

export function parseBook(content: BookContent): ParsedBook {
  const markdown = cleanMarkdown(content.markdown);
  const chunks = markdown.split(/^##[ \t]+(.*)$/m);
  const front = chunks[0] ?? "";
  const lines = front.split("\n").map((line) => line.trim()).filter(Boolean);
  const title = plain(lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, "") ?? content.title);
  const author = plain(lines.find((line) => /^\*\*[^*]/.test(line)) ?? content.author);
  const genre = plain(lines.find((line) => /^\*[^*].*\*$/.test(line)) ?? "");
  const rawSections: { title: string; markdown: string }[] = [];
  for (let i = 1; i < chunks.length; i += 2) {
    const heading = plain(chunks[i] ?? "");
    const body = (chunks[i + 1] ?? "").trim();
    if (heading) rawSections.push({ title: heading, markdown: body });
    // Empty section headings are formatting artifacts, not page boundaries.
    else if (body && rawSections.length) {
      const previous = rawSections[rawSections.length - 1];
      if (previous) previous.markdown += `\n\n${body}`;
    }
  }
  const sections: ParsedBook["sections"] = [];
  const pages: BookPage[] = [];
  const ordered = [...rawSections.filter((s) => s.title.toLocaleUpperCase("pt-BR") !== "CONTRACAPA"), ...rawSections.filter((s) => s.title.toLocaleUpperCase("pt-BR") === "CONTRACAPA")];
  for (const section of ordered) {
    const backCover = section.title.toLocaleUpperCase("pt-BR") === "CONTRACAPA";
    sections.push({ title: section.title, page: pages.length + 1 });
    for (const text of backCover ? [section.markdown] : paginateParagraphs(section.markdown)) {
      pages.push({ section: section.title, markdown: text, backCover });
    }
  }
  // A document without sections still has selectable reading content.
  if (!pages.length) {
    const body = lines.filter((line) => !/^#\s+/.test(line)).join("\n\n");
    sections.push({ title: title || content.title, page: 1 });
    pages.push(...paginateParagraphs(body).map((text) => ({ section: title, markdown: text, backCover: false })));
  }
  return { title: title || content.title, author, genre, pages, sections };
}

export function visibleBooks(books: Livro[], isAdmin: boolean): Livro[] {
  return books.filter((book) => !book.admin_only || isAdmin);
}

export function savedPage(value: unknown, total: number): number {
  return typeof value === "number" && Number.isInteger(value) ? Math.max(0, Math.min(total, value)) : 0;
}

export function missingBooksTable(error: { code?: string }): boolean {
  return error.code === "42P01" || error.code === "PGRST205";
}