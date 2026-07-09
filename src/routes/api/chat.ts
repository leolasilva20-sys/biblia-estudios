import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";

const chatInputSchema = z.object({
  conversationId: z.number(),
  message: z.string().trim().min(1),
});

const SYSTEM_PROMPT = `Você é o agente interno de suporte do Bíblia Estúdios.

Sobre a plataforma:
- A plataforma oferece estudos bíblicos em português, apostilas de Gênesis, exercícios e áudio dramas bíblicos.
- Os Áudio Dramas ficam em /audiolivros e apresentam histórias bíblicas com narração original, dublagem original, vozes originais e música original.
- O usuário pode acessar perfil, gerenciar login, continuar estudos e pedir ajuda pelo suporte.

Como responder:
- Responda sempre em português do Brasil, com clareza, acolhimento e objetividade.
- Ajude o usuário a navegar e resolver dúvidas comuns da plataforma.
- Se o usuário relatar um bug técnico ou algo que precisa de revisão humana, diga que a equipe técnica vai revisar e finalize com [ESCALATE].
- Não invente dados, links, preços, políticas ou prazos.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = chatInputSchema.parse(await request.json());
          const authHeader = request.headers.get("Authorization") ?? "";
          const token = authHeader.replace(/^Bearer\s+/i, "").trim();

          if (!token) {
            return Response.json({ error: "Não autenticado" }, { status: 401 });
          }

          const lovableKey = process.env.LOVABLE_API_KEY;
          if (!lovableKey) {
            return Response.json({ error: "IA interna não configurada" }, { status: 500 });
          }

          const supabaseUrl = process.env.SUPABASE_URL ?? "https://phguxgdqwrysvjdkzzxn.supabase.co";
          const supabaseKey =
            process.env.SUPABASE_PUBLISHABLE_KEY ??
            process.env.SUPABASE_ANON_KEY ??
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6InBoZ3V4Z2Rxd3J5c3ZqZGt6enhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTY4MDAsImV4cCI6MjA5NTY3MjgwMH0.J2fZuaSbsX_0McUmNJXNxpyD71lUdV4aGkmV5z_VfqQ";

          const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const { data: userData, error: userError } = await supabase.auth.getUser(token);
          if (userError || !userData.user) {
            return Response.json({ error: "Usuário inválido" }, { status: 401 });
          }

          const { data: conversation, error: convError } = await supabase
            .from("support_conversations")
            .select("id, user_id")
            .eq("id", body.conversationId)
            .eq("user_id", userData.user.id)
            .maybeSingle();

          if (convError || !conversation) {
            return Response.json({ error: "Conversa não encontrada" }, { status: 404 });
          }

          await supabase.from("support_chat_messages").insert({
            conversation_id: body.conversationId,
            role: "user",
            content: body.message,
          });

          const { data: history } = await supabase
            .from("support_chat_messages")
            .select("role, content")
            .eq("conversation_id", body.conversationId)
            .order("created_at", { ascending: true });

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, nivel_admin, acesso_liberado")
            .eq("id", userData.user.id)
            .maybeSingle();

          const gateway = createLovableAiGatewayProvider(lovableKey);
          const { text } = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system:
              SYSTEM_PROMPT +
              `\n\nContexto do usuário: nome=${profile?.full_name ?? "não informado"}; perfil=${profile?.nivel_admin ?? "aluno"}; acesso_liberado=${profile?.acesso_liberado ? "sim" : "não"}.`,
            messages: (history ?? []).map((item) => ({
              role: item.role === "assistant" ? "assistant" : "user",
              content: item.content,
            })),
          });

          let reply = text || "Desculpe, não consegui gerar uma resposta agora.";
          const escalated = reply.includes("[ESCALATE]");
          reply = reply.replace("[ESCALATE]", "").trim();

          await supabase.from("support_chat_messages").insert({
            conversation_id: body.conversationId,
            role: "assistant",
            content: reply,
            model_used: "lovable-ai/gemini-3-flash-preview",
          });

          if (escalated) {
            await supabase
              .from("support_conversations")
              .update({ status: "escalated", updated_at: new Date().toISOString() })
              .eq("id", body.conversationId)
              .eq("user_id", userData.user.id);
          }

          return Response.json({ reply, escalated, model: "Lovable AI" });
        } catch (error) {
          console.error("[support-chat] error", error);
          const message = error instanceof Error ? error.message : "Erro inesperado";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});