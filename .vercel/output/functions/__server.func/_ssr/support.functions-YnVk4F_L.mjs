import { TSS_SERVER_FUNCTION, createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const inputSchema = objectType({
  nome: stringType().min(1).max(200),
  email: stringType().email().max(320),
  mensagem: stringType().min(1).max(5e3)
});
const sendSupportEmail_createServerFn_handler = createServerRpc({
  id: "625708959784a3e3bb62af17d4624bfdeefb749934b9540e3fca167595540c54",
  name: "sendSupportEmail",
  filename: "src/lib/support.functions.ts"
}, (opts) => sendSupportEmail.__executeServer(opts));
const sendSupportEmail = createServerFn({
  method: "POST"
}).inputValidator((data) => inputSchema.parse(data)).handler(sendSupportEmail_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) {
    throw new Error("Email service not configured");
  }
  const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: "Bíblia Estúdios <onboarding@resend.dev>",
      to: [adminEmail],
      reply_to: data.email,
      subject: `[Suporte] ${data.nome}`,
      html
    })
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error:", res.status, text);
    throw new Error("Falha ao enviar email");
  }
  return {
    ok: true
  };
});
export {
  sendSupportEmail_createServerFn_handler
};
