import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { missingBooksTable, type BookContent, type Livro } from "@/lib/books";

export function booksQuery(userId: string) {
  return queryOptions({
    queryKey: ["livros", userId],
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase.from("livros").select("id,title,author,description,drive_file_id,order_index,admin_only,is_new,created_at").order("order_index", { ascending: true });
      if (error) {
        if (missingBooksTable(error)) return [];
        throw new Error("Não foi possível carregar os livros. Verifique sua conexão e tente de novo.");
      }
      return (data ?? []) as Livro[];
    },
  });
}

export function bookContentQuery(userId: string, id: number) {
  return queryOptions({
    queryKey: ["livro-content", userId, id],
    retry: false,
    queryFn: async (): Promise<BookContent> => {
      if (!Number.isSafeInteger(id) || id <= 0) throw new Error("Este endereço de livro não é válido.");
      const { data, error } = await supabase.functions.invoke("livro-content", { body: { livro_id: id } });
      if (data?.error) throw new Error(String(data.error));
      if (error) {
        let message = "Não foi possível abrir o livro. O documento pode ainda não estar compartilhado. Tente de novo.";
        // Edge Functions may return their JSON error with a non-2xx status.
        if (error.context instanceof Response) {
          try {
            const body = await error.context.clone().json();
            if (typeof body?.error === "string") message = body.error;
          } catch { /* keep the friendly fallback */ }
        }
        throw new Error(message);
      }
      if (!data || typeof data.markdown !== "string" || !data.markdown.trim()) throw new Error("Este livro ainda não tem texto disponível.");
      return { title: typeof data.title === "string" ? data.title : "Livro", author: typeof data.author === "string" ? data.author : "", markdown: data.markdown };
    },
  });
}