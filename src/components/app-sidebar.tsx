import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  FileText,
  Music,
  Shield,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Apostilas", icon: BookOpen },
  { to: "/audiolivros", label: "Áudio Dramas", icon: Music },
  { to: "/responder", label: "Exercícios", icon: FileText },
];

const ADMIN_ONLY_ITEMS: { to: string; label: string; icon: typeof BookOpen }[] = [];

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

  const NavLink = ({ to, label, icon: Icon }: { to: string; label: string; icon: typeof BookOpen }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      aria-label={label}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-base transition-colors ${
        isActive(to)
          ? "bg-gold/15 text-gold font-medium"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/40"
      }`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {label}
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 px-3 py-5">
        <BookOpen className="h-5 w-5 text-gold" />
        <span className="font-serif text-lg gold-text-gradient">Bíblia Estúdios</span>
      </Link>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}

        {isAdmin &&
          ADMIN_ONLY_ITEMS.map((item) => <NavLink key={item.to} {...item} />)}

        {isAdmin && (
          <NavLink to="/admin" label="Painel Admin" icon={Shield} />
        )}
      </nav>

      <div className="px-2 pb-3 border-t border-border/40 pt-3">
        <Link
          to="/perfil"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-muted/40 transition-colors border border-border/40"
          aria-label="Ir para meu perfil"
        >
          <Avatar className="h-9 w-9 border border-border/60 flex-shrink-0">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
            <AvatarFallback className="text-sm">{initial}</AvatarFallback>
          </Avatar>
          <span className="text-base font-medium text-foreground">Perfil</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border/60 bg-background/90 backdrop-blur sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gold" />
          <span className="font-serif text-lg gold-text-gradient">Bíblia Estúdios</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu de navegação"
          className="p-2 -mr-2 rounded-lg hover:bg-muted/40"
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-background border-r border-border/60 h-full">
            <div className="flex justify-end px-2 pt-2">
              <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-border/60 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
