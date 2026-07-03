import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { User, FileCheck, ScrollText, LogOut, ShieldCheck, Bell, Fingerprint } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Bíblia Estúdios" }] }),
  component: Configuracoes,
});

function Configuracoes() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

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

  const items = [
    {
      to: "/perfil",
      icon: User,
      title: "Perfil",
      desc: "Edite seu nome, WhatsApp e veja seu nível de acesso.",
    },
    {
      to: "/documentacao",
      icon: FileCheck,
      title: "Documentação",
      desc: "Entenda como funciona o login, os passkeys, o suporte e a privacidade da plataforma.",
    },
    {
      to: "/termos",
      icon: ScrollText,
      title: "Termos de Serviço",
      desc: "Leia as regras de uso do Bíblia Estúdios.",
    },
    {
      to: "/privacidade",
      icon: ShieldCheck,
      title: "Política de Privacidade",
      desc: "Saiba como protegemos seus dados.",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 px-6 py-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-sm text-gold uppercase tracking-widest">Bíblia Estúdios</p>
            <h1 className="font-serif text-4xl gold-text-gradient mt-2">Configurações</h1>
            <p className="text-muted-foreground mt-3 font-serif italic">
              Gerencie sua conta, segurança e preferências.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 p-5 mb-8">
            <p className="text-sm text-muted-foreground">Conta conectada</p>
            <p className="text-foreground font-medium mt-1">{user.email}</p>
          </div>

          <div className="space-y-3 mb-10">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card/40 p-5 hover:border-gold/50 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5">
                  <item.icon className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="rounded-xl border border-border/50 bg-card/40 p-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Fingerprint className="h-4 w-4 text-gold" />
              <h3 className="font-serif text-lg">Login por Passkey</h3>
              <span className="text-[10px] bg-gold/10 text-gold border border-gold/30 px-1.5 py-0.5 rounded">beta</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Você pode entrar com biometria (digital, rosto ou PIN) sem precisar digitar sua senha.
              Configure isso na tela de login clicando em "Continuar com Passkey".
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/40 p-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="h-4 w-4 text-gold" />
              <h3 className="font-serif text-lg">Notificações</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Em breve você poderá escolher como deseja ser avisado sobre novidades e liberação
              de novos módulos.
            </p>
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
