import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/complete-profile")({
  head: () => ({ meta: [{ title: "Complete seu cadastro — Bíblia Estúdios" }] }),
  component: CompleteProfilePage,
});

function CompleteProfilePage() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (profile?.acesso_liberado) {
      navigate({ to: "/dashboard" });
      return;
    }
    if (profile) {
      setFullName(profile.full_name ?? "");
      setWhatsapp(profile.whatsapp ?? "");
    }
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    if (!profile?.full_name) {
      const n = (meta.full_name as string | undefined) ?? (meta.name as string | undefined);
      if (n) setFullName(n);
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) return toast.error("Informe seu nome completo");

    setSubmitting(true);

    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const picture =
      (meta.avatar_url as string | undefined) ??
      (meta.picture as string | undefined) ??
      null;

    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        whatsapp: whatsapp.trim() || null,
        avatar_url: profile?.avatar_url ?? picture,
        acesso_liberado: true,
      })
      .eq("id", user.id);
    setSubmitting(false);

    if (upErr) {
      return toast.error("Erro ao salvar perfil: " + upErr.message);
    }

    await refreshProfile();
    toast.success("Bem-vindo!");
    navigate({ to: "/dashboard" });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-6 w-6 text-gold" />
          <span className="font-serif text-2xl gold-text-gradient">Bíblia Estúdios</span>
        </Link>
        <div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur p-8">
          <h1 className="font-serif text-2xl text-center mb-1">Complete seu cadastro</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Só falta confirmar seu nome pra continuar.
          </p>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold text-primary-foreground hover:opacity-90"
            >
              {submitting ? "Salvando..." : "Entrar"}
            </Button>

          </form>

          <div className="ornament-divider my-6 text-xs">ou</div>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
