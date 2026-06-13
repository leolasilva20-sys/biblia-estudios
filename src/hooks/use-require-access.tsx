import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

/**
 * Garante usuário logado E com acesso_liberado=true.
 * Redireciona para /login ou /complete-profile conforme o caso.
 */
export function useRequireAccess() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (profile && !profile.acesso_liberado) {
      navigate({ to: "/complete-profile" });
    }
  }, [user, profile, loading, navigate]);

  const ready = !loading && !!user && !!profile?.acesso_liberado;
  return { ready, user, profile, loading };
}
