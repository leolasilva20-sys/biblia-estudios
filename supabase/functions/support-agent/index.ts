// Supabase Edge Function: support-agent
// Recebe uma mensagem do usuário, consulta contexto relevante no banco (somente leitura),
// chama a API do OpenRouter com um modelo gratuito, e retorna a resposta.
// Se o agente não conseguir resolver ([ESCALATE]), envia email ao admin via Resend
// e marca a conversa como "escalated" para revisão.

import { createClient } from "jsr:@supabase/supabase-js@2";

const SYSTEM_PROMPT = `Você é o assistente de suporte do Bíblia Estúdios, uma plataforma de estudo bíblico em português.

Sobre a plataforma:
- Oferece apostilas em 5 níveis (iniciante, intermediário, avançado, especialista, consolidação) sobre o livro de Gênesis, acessíveis em /dashboard e /apostila/:id
- Tem exercícios de fixação na apostila de consolidação (rotas /responder e /responder/:apostilaId)
- Áudio dramas em /audiolivros (dramatizações em áudio das narrativas bíblicas), disponíveis para todos os usuários logados
- Login pode ser feito com email/senha, Google, ou Passkey (biometria — em beta)
- Não há mais código de convite: o cadastro é aberto e o acesso é liberado automaticamente
- Perfil do usuário em /perfil (nome, WhatsApp, foto, gerenciar logins)
- Administradores têm acesso extra ao Painel Admin em /admin

Seu papel:
- Responder dúvidas sobre como usar a plataforma de forma clara, breve e acolhedora
- Se o usuário relatar um BUG técnico que você não tem certeza de como resolver, ou que pareça exigir mudança de código/dados, diga: "Vou encaminhar isso para a equipe técnica revisar" e finalize sua resposta com a tag exata [ESCALATE] em uma linha separada
- NUNCA invente informações técnicas se não tiver certeza
- Responda sempre em português do Brasil`;


Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { conversationId, message, model } = await req.json();

    if (!conversationId || !message) {
      return new Response(JSON.stringify({ error: "conversationId e message são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verifica o usuário autenticado a partir do header Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Usuário inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // Confirma que a conversa pertence ao usuário
    const { data: conversation, error: convError } = await supabase
      .from("support_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .single();

    if (convError || !conversation) {
      return new Response(JSON.stringify({ error: "Conversa não encontrada" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Salva a mensagem do usuário
    await supabase.from("support_chat_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: message,
    });

    // Busca o histórico da conversa (contexto)
    const { data: history } = await supabase
      .from("support_chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    // Contexto extra: progresso do usuário (somente leitura, apenas dados relevantes ao suporte)
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, nivel_admin, acesso_liberado")
      .eq("id", userId)
      .single();

    const { data: progress } = await supabase
      .from("user_progress")
      .select("apostila_id, completed_at")
      .eq("user_id", userId);

    const contextInfo = `\n\n[Contexto do usuário — não repita isso literalmente para o usuário, use apenas para embasar sua resposta]\nNome: ${profile?.full_name ?? "não informado"}\nNível: ${profile?.nivel_admin ?? "aluno"}\nApostilas com progresso registrado: ${progress?.length ?? 0}`;

    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterKey) {
      return new Response(JSON.stringify({ error: "Chave da API do OpenRouter não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const chosenModel = model || "meta-llama/llama-3.3-70b-instruct:free";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + contextInfo },
      ...(history || []).map((h: { role: string; content: string }) => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      })),
    ];

    const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: chosenModel,
        messages,
      }),
    });

    if (!orResponse.ok) {
      const errText = await orResponse.text();
      return new Response(JSON.stringify({ error: "Erro ao consultar o modelo de IA", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orData = await orResponse.json();
    let reply: string = orData.choices?.[0]?.message?.content ?? "Desculpe, não consegui gerar uma resposta agora.";

    let escalated = false;
    if (reply.includes("[ESCALATE]")) {
      escalated = true;
      reply = reply.replace("[ESCALATE]", "").trim();
    }

    await supabase.from("support_chat_messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: reply,
      model_used: chosenModel,
    });

    if (escalated) {
      await supabase
        .from("support_conversations")
        .update({ status: "escalated", updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      // Envia email de escalonamento pro admin via Resend
      const resendKey = Deno.env.get("RESEND_API_KEY");
      const adminEmail = Deno.env.get("ADMIN_EMAIL");
      if (resendKey && adminEmail) {
        const userEmail = userData.user.email ?? "email desconhecido";
        const escape = (s: string) =>
          s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h2 style="color:#C9A84C">Escalonamento do agente de suporte</h2>
            <p><strong>Usuário:</strong> ${escape(profile?.full_name ?? userEmail)} (${escape(userEmail)})</p>
            <p><strong>Conversa:</strong> #${conversationId}</p>
            <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
            <p><strong>Última mensagem do usuário:</strong></p>
            <p style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:6px">${escape(message)}</p>
            <p><strong>Resposta do agente:</strong></p>
            <p style="white-space:pre-wrap;background:#fdf6e3;padding:12px;border-radius:6px">${escape(reply)}</p>
          </div>
        `;
        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: "Bíblia Estúdios <onboarding@resend.dev>",
              to: [adminEmail],
              reply_to: userData.user.email,
              subject: `[Suporte — Escalado] ${profile?.full_name ?? userEmail}`,
              html,
            }),
          });
          if (!emailRes.ok) console.error("Resend escalation failed:", emailRes.status, await emailRes.text());
        } catch (e) {
          console.error("Erro enviando email de escalonamento:", e);
        }
      } else {
        console.warn("RESEND_API_KEY ou ADMIN_EMAIL não configurados — escalonamento não enviou email.");
      }
    }


    return new Response(JSON.stringify({ reply, escalated, model: chosenModel }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
