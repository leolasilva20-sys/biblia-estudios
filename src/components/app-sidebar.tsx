import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Headphones,
  NotebookPen,
  LifeBuoy,
  Shield,
  X,
  Menu,
  GraduationCap,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const NAV_GROUPS: { label: string; items: { to: string; label: string; icon: typeof BookOpen; isNew?: boolean }[] }[] = [
  {
    label: "Conteúdo",
    items: [
      { to: "/dashboard", label: "Apostilas", icon: BookOpen },
      { to: "/audio-dramas", label: "Áudio Dramas", icon: Headphones, isNew: true },
      { to: "/cursos", label: "Cursos", icon: GraduationCap },
    ],
  },
  {
    label: "Minha área",
    items: [
      { to: "/cadernos", label: "Meus cadernos", icon: NotebookPen },
      { to: "/suporte", label: "Suporte", icon: LifeBuoy },
    ],
  },
];

export function AppSidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";
  const initial = (profile?.full_name ?? user?.email ?? "?").trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  const NavLink = ({ to, label, icon: Icon, isNew }: { to: string; label: string; icon: typeof BookOpen; isNew?: boolean }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      aria-label={isNew ? `${label} — novo` : label}
      className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-all ${
        isActive(to)
          ? "border-gold/25 bg-gold/15 text-gold font-medium shadow-sm"
          : "border-transparent text-foreground/70 hover:border-border/60 hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      <span className={`rounded-lg p-1.5 ${isActive(to) ? "bg-gold/15" : "bg-muted/40 group-hover:bg-gold/10"}`}>
        <Icon className="h-4 w-4 shrink-0" />
      </span>
      {label}
      {isNew && (
        <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-background">
          Novo
        </span>
      )}
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-4 py-6" onClick={() => setMobileOpen(false)}>
        <span className="rounded-xl border border-gold/30 bg-gold/10 p-2">
          <BookOpen className="h-5 w-5 text-gold" />
        </span>
        <span>
          <span className="block font-serif text-xl leading-none gold-text-gradient">Bíblia Estúdios</span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Estudo • Fé • Verdade</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4" aria-label="Navegação principal">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => <NavLink key={item.to} {...item} />)}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div>
            <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Gestão</p>
            <NavLink to="/admin" label="Painel Admin" icon={Shield} />
          </div>
        )}
      </nav>

      <div className="border-t border-border/40 p-3">
        <div className="rounded-xl border border-border/50 bg-card/50 p-2">
          <div className="flex items-center gap-2">
            <Link
              to="/perfil"
              onClick={() => setMobileOpen(false)}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1.5 hover:bg-muted/40"
              aria-label="Ir para meu perfil"
            >
              <Avatar className="h-9 w-9 shrink-0 border border-gold/30">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                <AvatarFallback className="bg-gold/10 text-sm text-gold">{initial}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{profile?.full_name ?? "Meu perfil"}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{user?.email}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
            <button onClick={handleLogout} aria-label="Sair da conta" title="Sair" className="rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-gold">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="rounded-lg border border-gold/30 bg-gold/10 p-1.5"><BookOpen className="h-4 w-4 text-gold" /></span>
          <span className="font-serif text-xl gold-text-gradient">Bíblia Estúdios</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu de navegação"
          className="rounded-lg border border-border/60 p-2 hover:bg-muted/40"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="relative h-full w-80 max-w-[85vw] border-r border-gold/20 bg-background shadow-2xl">
            <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="absolute right-3 top-4 z-10 rounded-lg p-2 hover:bg-muted/40">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
          <button className="flex-1 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Fechar menu de navegação" />
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/60 bg-card/20 md:flex md:flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
