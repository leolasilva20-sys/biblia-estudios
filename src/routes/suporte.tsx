import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, Bot, User as UserIcon, Settings2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const MODELOS_DISPONIVEIS = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B (padrão)" },
  { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1 (raciocínio)" },
  { id: "qwen/qwen3-coder:free", label: "Qwen3 Coder (técnico)" },
  { id: "google/gemini-2.0-flash-exp:free", label: "Gemini Flash" },
];

const FUNCTION_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co/functions/v1/support-agent";

function Suporte() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(true);
  const [modelo, setModelo] = useState(MODELOS_DISPONIVEIS[0].id);
  const [showSettings, setShowSettings] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ conversationId, message: userMessage, model: modelo }),
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
      toast.error("Não foi possível conectar ao assistente de suporte.");
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
            <h1 className="font-serif text-2xl gold-text-gradient">Suporte</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings((v) => !v)}>
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>

        {showSettings && (
          <div className="border-b border-border/40 px-6 py-4 bg-card/40">
            <label className="text-sm text-muted-foreground mb-2 block">Modelo de IA</label>
            <Select value={modelo} onValueChange={setModelo}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELOS_DISPONIVEIS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-gold/20 border border-gold/30"
                    : "bg-card/60 border border-border/40"
                }`}
              >
                {msg.content}
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
