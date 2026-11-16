import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SUPABASE_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ3V4Z2Rxd3J5c3ZqZGt6enhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTY4MDAsImV4cCI6MjA5NTY3MjgwMH0.J2fZuaSbsX_0McUmNJXNxpyD71lUdV4aGkmV5z_VfqQ";

/** Confirma no servidor que o token pertence a um admin completo. */
async function assertAdmin(token: string) {
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: u } = await sb.auth.getUser(token);
  if (!u.user) throw new Error("Não autenticado");
  const { data: p } = await sb.from("profiles").select("nivel_admin").eq("id", u.user.id).maybeSingle();
  if (p?.nivel_admin !== "admin") throw new Error("Apenas o administrador pode usar isso");
}

export const melhorarNoticia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string(), assunto: z.string().max(300), texto: z.string().min(1).max(10000), links: z.array(z.object({ titulo: z.string().max(200), url: z.string().url() })).max(20) }).parse(d),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, erro: "IA indisponível" };
    const linksTxt = data.links.map((l) => `- ${l.titulo || l.url}: ${l.url}`).join("\n");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você é redator do boletim 'Bíblia Estúdios Notícias', uma plataforma cristã de estudos bíblicos. Reescreva a notícia em português brasileiro, tom acolhedor, profissional e inspirador. Integre os links naturalmente no texto no formato markdown [texto](url). Responda SOMENTE com o corpo do e-mail, sem assunto, parágrafos curtos, finalize com uma saudação da equipe Bíblia Estúdios." },
          { role: "user", content: `Assunto: ${data.assunto}\n\nNotícia:\n${data.texto}\n\nLinks para incluir:\n${linksTxt || "(nenhum)"}` },
        ],
      }),
    });
    if (!res.ok) {
      console.error("AI error", res.status, await res.text());
      return { ok: false as const, erro: res.status === 429 ? "Muitas solicitações, tente em instantes." : res.status === 402 ? "Créditos de IA esgotados." : "Falha na IA" };
    }
    const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { ok: true as const, texto: j.choices?.[0]?.message?.content?.trim() ?? data.texto };
  });
