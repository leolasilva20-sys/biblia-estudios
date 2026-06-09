import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <BookOpen className="h-5 w-5 text-gold" />
          <span className="font-serif text-xl tracking-wide gold-text-gradient">
            Bíblia Estúdios
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/suporte">
                <Button variant="ghost" size="sm">Suporte</Button>
              </Link>
              {profile?.is_admin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-gold">
                    <Shield className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gold text-primary-foreground hover:opacity-90">
                  Começar
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
