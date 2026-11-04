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

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function toHtml(md: string) {
  return esc(md)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" style="color:#C9A84C">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .split(/\n{2,}/)
    .map((p) => `<p style="line-height:1.6;margin:0 0 14px">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export const enviarNoticia = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string(), assunto: z.string().min(1).max(300), texto: z.string().min(1).max(20000), emails: z.array(z.string().email()).min(1).max(1000) }).parse(d),
  )
  .handler(async ({ data }) => {
    await assertAdmin(data.token);
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) throw new Error("Envio de e-mail não configurado");
    const html = `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;background:#1C1917;color:#f5f0e6;border-radius:12px">
      <h1 style="color:#C9A84C;font-size:22px;margin:0 0 4px">Bíblia Estúdios Notícias</h1>
      <h2 style="font-size:18px;margin:0 0 20px;color:#f5f0e6">${esc(data.assunto)}</h2>
      ${toHtml(data.texto)}
      <hr style="border:none;border-top:1px solid #C9A84C55;margin:20px 0"/>
      <p style="font-size:12px;color:#a8a29e"><a href="https://biblia-estudios.lovable.app" style="color:#C9A84C">biblia-estudios.lovable.app</a></p></div>`;
    let enviados = 0;
    const falhas: string[] = [];
    // Envio individual para que ninguém veja o e-mail dos outros
    for (let i = 0; i < data.emails.length; i += 100) {
      const lote = data.emails.slice(i, i + 100).map((to) => ({
        from: "Bíblia Estúdios <onboarding@resend.dev>", to: [to], subject: data.assunto, html,
      }));
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(lote),
      });
      if (res.ok) enviados += lote.length;
      else { console.error("Resend", res.status, await res.text()); falhas.push(...lote.map((l) => l.to[0])); }
    }
    return { enviados, falhas };
  });
