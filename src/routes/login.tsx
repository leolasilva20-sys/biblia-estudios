import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, LockKeyhole, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroManuscript from "@/assets/hero-manuscript.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Bíblia Estúdios" },
      { name: "description", content: "Entre na sua conta do Bíblia Estúdios com Google, e-mail e senha." },
      { property: "og:title", content: "Entrar — Bíblia Estúdios" },
      { property: "og:description", content: "Acesse seus estudos bíblicos, cursos, cadernos e áudio dramas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (profile?.acesso_liberado) navigate({ to: "/dashboard" });
    else if (profile) navigate({ to: "/complete-profile" });
  }, [user, profile, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
  };

  const handleReset = async () => {
    if (!email) return toast.error("Digite seu email primeiro");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast.error(error.message);
    toast.success("Email de redefinição enviado");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12">
      <img src={heroManuscript} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <span className="rounded-xl border border-gold/30 bg-gold/10 p-2.5">
            <BookOpen className="h-6 w-6 text-gold" />
          </span>
          <span className="font-serif text-3xl gold-text-gradient">Bíblia Estúdios</span>
        </Link>
        <div className="rounded-2xl border border-gold/20 bg-card/85 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
          <div className="text-center mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">Bem-vindo de volta</p>
            <h1 className="font-serif text-3xl mt-2">Entrar na sua conta</h1>
            <p className="text-sm text-muted-foreground mt-2">Continue sua jornada de estudo.</p>
          </div>

          <Button variant="outline" onClick={handleGoogle} className="w-full h-11 border-border/80 bg-background/40">
            <GoogleIcon /> Continuar com Google
          </Button>

          <div className="ornament-divider my-6 text-xs">ou use seu e-mail</div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gold" /> Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5 text-gold" /> Senha</Label>
                <button type="button" onClick={handleReset} className="text-xs text-gold hover:underline">
                  Esqueci minha senha
                </button>
              </div>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full h-11 bg-gold text-primary-foreground hover:opacity-90">
              <LogIn className="h-4 w-4 mr-2" /> {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Não tem conta? <Link to="/signup" className="text-gold hover:underline">Criar conta</Link>
          </p>
          <p className="text-xs text-center text-muted-foreground/70 mt-4 leading-relaxed">
            Ao continuar, você concorda com os nossos{" "}
            <Link to="/termos" className="text-gold hover:underline">Termos de Serviço</Link>{" "}
            e nossa{" "}
            <Link to="/privacidade" className="text-gold hover:underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
