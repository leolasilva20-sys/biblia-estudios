import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LifeBuoy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/suporte")({
  head: () => ({ meta: [{ title: "Suporte — Bíblia Estúdios" }] }),
  component: Suporte,
});

function Suporte() {
  const { user, profile } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setNome(profile.full_name);
    if (profile?.email) setEmail(profile.email);
    else if (user?.email) setEmail(user.email);
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      return toast.error("Preencha todos os campos");
    }
    setLoading(true);
    const { error } = await supabase.from("support_messages").insert({
      user_id: user?.id ?? null,
      nome: nome.trim(),
      email: email.trim(),
      mensagem: mensagem.trim(),
      status: "pendente",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Mensagem enviada! Responderemos em breve.");
    setMensagem("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-2xl px-6 py-12">
        <div className="text-center mb-10">
          <LifeBuoy className="h-10 w-10 text-gold mx-auto mb-4" />
          <h1 className="font-serif text-4xl gold-text-gradient">Suporte</h1>
          <p className="text-muted-foreground mt-2">Envie sua dúvida ou comentário. Respondemos por email.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea id="mensagem" rows={6} value={mensagem} onChange={(e) => setMensagem(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gold text-primary-foreground hover:opacity-90">
            {loading ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      </main>
    </div>
  );
}
