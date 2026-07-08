import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Criar conta — Bíblia Estúdios" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Já logado? Roteia
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (profile?.acesso_liberado) navigate({ to: "/dashboard" });
    else if (profile) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Informe seu nome completo");

    setSubmitting(true);

    // 1) Cria a conta
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: fullName, whatsapp },
      },
    });
    if (error) {
      setSubmitting(false);
      return toast.error(error.message);
    }

    // 2) Garante perfil já com acesso liberado (sem convite)
    if (data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email,
          full_name: fullName.trim(),
          whatsapp: whatsapp.trim() || null,
          acesso_liberado: true,
        },
        { onConflict: "id" },
      );
    }

    const { data: sess } = await supabase.auth.getSession();
    setSubmitting(false);
    if (sess.session) {
      toast.success("Conta criada!");
      return navigate({ to: "/dashboard" });
    }

    toast.success("Conta criada! Verifique seu email para confirmar e depois faça login.");
    navigate({ to: "/login" });
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/complete-profile` },
    });
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-6 w-6 text-gold" />
          <span className="font-serif text-2xl gold-text-gradient">Bíblia Estúdios</span>
        </Link>
        <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur p-8">
          <h1 className="font-serif text-2xl text-center mb-1">Criar conta</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">Acesso por convite</p>

          <Button variant="outline" onClick={handleGoogle} className="w-full mb-2">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continuar com Google
          </Button>
          <p className="text-xs text-muted-foreground text-center mb-4">
            Você informará o código de convite na próxima tela
          </p>

          <div className="ornament-divider my-4 text-xs">ou</div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input id="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="invite">Código de convite *</Label>
              <Input
                id="invite"
                required
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
                placeholder="Ex.: AMOR2026"
                style={{ textTransform: "uppercase" }}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-gold text-primary-foreground hover:opacity-90">
              {submitting ? "Criando..." : "Criar conta"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Já tem conta? <Link to="/login" className="text-gold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
