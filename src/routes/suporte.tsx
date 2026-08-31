import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Send, Bot, User as UserIcon, AlertTriangle, Sparkles, Mail } from "lucide-react";
import { sendSupportEmail } from "@/lib/support.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/suporte")({
  head: () => ({ meta: [{ title: "Suporte — Bíblia Estúdios" }] }),
  component: Suporte,
});

type ChatMessage = {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  model_used?: string | null;
};

const CHAT_URL = "/api/chat";

function Suporte() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(true);
  const [escalated, setEscalated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"ia" | "email">("email");
  const [mailNome, setMailNome] = useState("");
  const [mailEmail, setMailEmail] = useState("");
  const [mailMsg, setMailMsg] = useState("");
  const [mailSending, setMailSending] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setMailNome((v) => v || profile.full_name!);
    if (profile?.email ?? user?.email) setMailEmail((v) => v || profile?.email || user?.email || "");
  }, [profile, user]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailNome.trim() || !mailEmail.trim() || !mailMsg.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setMailSending(true);
    try {
      await sendSupportEmail({
        data: { nome: mailNome.trim(), email: mailEmail.trim(), mensagem: mailMsg.trim() },
      });
      setMailSent(true);
      setMailMsg("");
      toast.success("Mensagem enviada! Responderemos por email.");
    } catch {
      toast.error("Não foi possível enviar sua mensagem agora.");
    } finally {
      setMailSending(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setStarting(true);
      const { data: existing } = await supabase
        .from("support_conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let convId = existing?.id;

      if (!convId) {
        const { data: created, error } = await supabase
          .from("support_conversations")
          .insert({ user_id: user.id, title: "Suporte" })
          .select()
          .single();
        if (error) {
          toast.error("Não foi possível iniciar o suporte.");
          setStarting(false);
          return;
        }
        convId = created.id;
      }

      setConversationId(convId);

      const { data: msgs } = await supabase
        .from("support_chat_messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      setMessages((msgs as ChatMessage[]) || []);
      setStarting(false);
    })();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || sending) return;
    const userMessage = input.trim();
    setInput("");
    setSending(true);

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: userMessage }]);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ conversationId, message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao processar sua mensagem.");
        setSending(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: data.reply, model_used: data.model },
      ]);

      if (data.escalated) {
        setEscalated(true);
        toast.info("Encaminhamos sua dúvida para a equipe técnica.");
      }
    } catch {
      toast.error("Não foi possível conectar ao agente interno de suporte.");
    } finally {
      setSending(false);
    }
  };

  if (loading || !user || starting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando suporte...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gold uppercase tracking-widest">Bíblia Estúdios</p>
            <h1 className="font-serif text-2xl gold-text-gradient">Agente de suporte</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border/60 p-1">
            <button
              onClick={() => setMode("email")}
              aria-pressed={mode === "email"}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                mode === "email" ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Falar com a equipe
            </button>
            <button
              onClick={() => setMode("ia")}
              aria-pressed={mode === "ia"}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                mode === "ia" ? "bg-gold/20 text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Modo IA
            </button>
          </div>
        </div>

        {mode === "email" ? (
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-xl mx-auto rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="font-serif text-2xl gold-text-gradient mb-1">Enviar mensagem</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Sua mensagem chega direto no email da equipe da Bíblia Estúdios.
              </p>

              {mailSent ? (
                <div className="text-center py-6">
                  <Mail className="h-8 w-8 text-gold mx-auto mb-3" />
                  <p className="font-serif text-lg">Mensagem enviada!</p>
                  <p className="text-sm text-muted-foreground mt-1">Responderemos no seu email.</p>
                  <Button variant="outline" className="mt-5" onClick={() => setMailSent(false)}>
                    Enviar outra
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mail-nome">Nome</Label>
                    <Input id="mail-nome" value={mailNome} onChange={(e) => setMailNome(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail-email">Email para resposta</Label>
                    <Input
                      id="mail-email"
                      type="email"
                      value={mailEmail}
                      onChange={(e) => setMailEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail-msg">Mensagem</Label>
                    <Textarea
                      id="mail-msg"
                      value={mailMsg}
                      onChange={(e) => setMailMsg(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={mailSending}>
                    {mailSending ? "Enviando..." : "Enviar para a equipe"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        ) : (
        <>
        {escalated && (
          <div className="mx-6 mt-4 p-3 rounded-lg border border-gold/30 bg-gold/10 flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
            Sua dúvida foi encaminhada para a equipe técnica. Você receberá uma resposta em breve.
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Bot className="h-10 w-10 mx-auto mb-3 text-gold/60" />
              <p>Olá! Como posso ajudar você hoje?</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border/60 flex items-center justify-center bg-card/60">
                {msg.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4 text-gold" />}
              </div>
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-gold/20 border border-gold/30"
                    : "bg-card/60 border border-border/40"
                }`}
              >
                <div className="prose prose-sm max-w-none text-inherit prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-border/60 flex items-center justify-center bg-card/60">
                <Bot className="h-4 w-4 text-gold" />
              </div>
              <div className="rounded-xl px-4 py-3 text-sm bg-card/60 border border-border/40 text-muted-foreground">
                Digitando...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border/40 p-4 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua dúvida..."
            className="resize-none min-h-[48px] max-h-32"
            rows={1}
          />
          <Button onClick={handleSend} disabled={sending || !input.trim()} size="icon" className="h-12 w-12 flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
