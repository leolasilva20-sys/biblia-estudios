import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  nome: z.string().min(1).max(200),
  email: z.string().email().max(320),
  mensagem: z.string().min(1).max(5000),
});

export const sendSupportEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!apiKey || !adminEmail) {
      throw new Error("Email service not configured");
    }

    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#C9A84C">Nova mensagem de suporte — Bíblia Estúdios</h2>
        <p><strong>Nome:</strong> ${escape(data.nome)}</p>
        <p><strong>Email:</strong> ${escape(data.email)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
        <p><strong>Mensagem:</strong></p>
        <p style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:6px">${escape(data.mensagem)}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Bíblia Estúdios <onboarding@resend.dev>",
        to: [adminEmail],
        reply_to: data.email,
        subject: `[Suporte] ${data.nome}`,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend error:", res.status, text);
      throw new Error("Falha ao enviar email");
    }

    return { ok: true };
  });
