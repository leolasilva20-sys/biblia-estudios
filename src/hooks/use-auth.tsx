import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, type Profile } from "@/lib/supabase";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
};

const Ctx = createContext<AuthCtx | null>(null);

const PROFILE_COLUMNS =
  "id, full_name, email, whatsapp, avatar_url, is_admin, acesso_liberado, created_at";

async function ensureProfileFromUser(user: User): Promise<void> {
  // Tenta criar perfil mínimo caso ainda não exista (trigger pode falhar para alguns providers)
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const full_name =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    null;
  const avatar_url =
    (meta.avatar_url as string | undefined) ??
    (meta.picture as string | undefined) ??
    null;

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name,
      avatar_url,
    },
    { onConflict: "id", ignoreDuplicates: false },
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (user: User): Promise<Profile | null> => {
    let { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("[auth] loadProfile error:", error.message);
      return null;
    }

    if (!data) {
      // Auto-cria perfil mínimo (acesso_liberado=false por default no DB)
      await ensureProfileFromUser(user);
      const retry = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("id", user.id)
        .maybeSingle();
      data = retry.data;
    } else {
      // Atualiza avatar_url do Google se ainda não tiver
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const picture =
        (meta.avatar_url as string | undefined) ??
        (meta.picture as string | undefined);
      if (picture && !(data as Profile).avatar_url) {
        await supabase.from("profiles").update({ avatar_url: picture }).eq("id", user.id);
        (data as Profile).avatar_url = picture;
      }
    }

    const p = (data as Profile) ?? null;
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) {
        setTimeout(() => {
          if (mounted) loadProfile(s.user).finally(() => mounted && setLoading(false));
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
      if (event === "SIGNED_OUT") {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user).finally(() => mounted && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value: AuthCtx = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signOut: async () => {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("[auth] signOut error", e);
      }
      setSession(null);
      setProfile(null);
      // Garante que nada fique em cache local
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token"))
          .forEach((k) => localStorage.removeItem(k));
      } catch {
        /* ignore */
      }
    },
    refreshProfile: async () => {
      if (session?.user) return loadProfile(session.user);
      return null;
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
