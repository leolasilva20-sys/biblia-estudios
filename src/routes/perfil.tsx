import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Meu Perfil — Bíblia Estúdios" }] }),
  component: Perfil,
});

function Perfil() {
  const { user, profile, loading, refreshProfile } = useAuth();
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
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto max-w-lg px-6 py-12">
        <h1 className="font-serif text-3xl gold-text-gradient mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Gerencie suas informações pessoais e veja seu status na plataforma.
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

        <form onSubmit={handleSave} className="rounded-xl border border-border/60 bg-card/60 p-6 space-y-4">
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

        <p className="text-xs text-center text-muted-foreground/70 mt-8 leading-relaxed">
          Ao usar o Bíblia Estúdios, você concorda com os nossos{" "}
          <Link to="/termos" className="text-gold hover:underline">Termos de Serviço</Link>{" "}
          e nossa{" "}
          <Link to="/privacidade" className="text-gold hover:underline">Política de Privacidade</Link>.
        </p>
      </main>
    </div>
  );
}
