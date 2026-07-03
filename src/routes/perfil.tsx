import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Fingerprint, LogOut, ChevronDown, ChevronUp, FileCheck, ScrollText, ShieldCheck } from "lucide-react";
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
  const [loginsOpen, setLoginsOpen] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

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

  const handleAddPasskey = async () => {
    setPasskeyLoading(true);
    try {
      const auth = supabase.auth as unknown as {
        passkey?: { add: () => Promise<{ data: unknown; error: unknown }> };
      };
      if (!auth.passkey?.add) {
        toast.error("Passkeys não são suportadas neste navegador ou biblioteca desatualizada.");
        return;
      }
      const { error } = await auth.passkey.add();
      if (error) {
        toast.error("Não foi possível cadastrar a passkey neste dispositivo.");
        return;
      }
      toast.success("Passkey cadastrada com sucesso!");
    } catch {
      toast.error("Passkeys não são suportadas neste navegador.");
    } finally {
      setPasskeyLoading(false);
    }
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
            Gerencie suas informações pessoais, seus logins e sua conta.
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

          <div className="rounded-xl border border-border/60 bg-card/60 overflow-hidden mb-6">
            <button
              onClick={() => setLoginsOpen((v) => !v)}
              className="w-full flex items-center justify-between p-6 hover:bg-muted/20 transition-colors"
            >
              <span className="font-serif text-lg">Gerenciar Logins</span>
              {loginsOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {loginsOpen && (
              <div className="px-6 pb-6 border-t border-border/40 pt-5">
                <div className="flex items-center gap-3 mb-3">
                  <Fingerprint className="h-4 w-4 text-gold" />
                  <h3 className="font-serif text-base">Passkey</h3>
                  <span className="text-[10px] bg-gold/10 text-gold border border-gold/30 px-1.5 py-0.5 rounded">beta</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Cadastre este dispositivo para entrar com biometria (digital, rosto ou PIN),
                  sem precisar digitar sua senha da próxima vez.
                </p>
                <Button variant="outline" onClick={handleAddPasskey} disabled={passkeyLoading} className="w-full">
                  {passkeyLoading ? "Cadastrando..." : "Cadastrar passkey neste dispositivo"}
                </Button>
              </div>
            )}
          </div>

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
