import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, FileCheck, ScrollText, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Meu Perfil — Bíblia Estúdios" }] }),
  component: Perfil,
});

function Perfil() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setWhatsapp(profile.whatsapp ?? "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, whatsapp: whatsapp || null })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error("Não foi possível salvar as alterações.");
    toast.success("Perfil atualizado com sucesso!");
    refreshProfile();
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Carregando...
      </div>
    );
  }

  const nivelLabel =
    profile?.nivel_admin === "admin" ? "Administrador" :
    profile?.nivel_admin === "junior" ? "Admin Júnior" : "Aluno";

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <h1 className="font-serif text-3xl gold-text-gradient mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Gerencie suas informações pessoais e sua conta.
          </p>

          <div className="rounded-xl border border-border/60 bg-card/60 p-6 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">E-mail</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Nível de acesso</span>
              <span className="text-gold font-medium">{nivelLabel}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="rounded-xl border border-border/60 bg-card/60 p-6 space-y-4 mb-6">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>

          <div className="space-y-2 mb-8">
            <Link
              to="/documentacao"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <FileCheck className="h-4 w-4 text-gold" /> Documentação
            </Link>
            <Link
              to="/termos"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <ScrollText className="h-4 w-4 text-gold" /> Termos de Serviço
            </Link>
            <Link
              to="/privacidade"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-gold" /> Política de Privacidade
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/5 text-red-400 hover:bg-red-400/10 transition-colors py-3 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </main>
    </div>
  );
}
