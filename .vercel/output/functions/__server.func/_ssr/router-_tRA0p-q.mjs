import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-DEa3jTiU.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const SUPABASE_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ3V4Z2Rxd3J5c3ZqZGt6enhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTY4MDAsImV4cCI6MjA5NTY3MjgwMH0.J2fZuaSbsX_0McUmNJXNxpyD71lUdV4aGkmV5z_VfqQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  // @ts-expect-error - opcao experimental de passkeys ainda nao tipada no pacote instalado
  experimental: {
    passkey: true
  }
});
const Ctx = reactExports.createContext(null);
const PROFILE_COLUMNS = "id, full_name, email, whatsapp, avatar_url, is_admin, nivel_admin, acesso_liberado, created_at";
async function ensureProfileFromUser(user) {
  const meta = user.user_metadata ?? {};
  const full_name = meta.full_name ?? meta.name ?? null;
  const avatar_url = meta.avatar_url ?? meta.picture ?? null;
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name,
      avatar_url
    },
    { onConflict: "id", ignoreDuplicates: false }
  );
}
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const loadProfile = reactExports.useCallback(async (user) => {
    let { data, error } = await supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", user.id).maybeSingle();
    if (error) {
      console.warn("[auth] loadProfile error:", error.message);
      return null;
    }
    if (!data) {
      await ensureProfileFromUser(user);
      const retry = await supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", user.id).maybeSingle();
      data = retry.data;
    } else {
      const meta = user.user_metadata ?? {};
      const picture = meta.avatar_url ?? meta.picture;
      if (picture && !data.avatar_url) {
        await supabase.from("profiles").update({ avatar_url: picture }).eq("id", user.id);
        data.avatar_url = picture;
      }
    }
    const p = data ?? null;
    setProfile(p);
    return p;
  }, []);
  reactExports.useEffect(() => {
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
  const value = {
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
      try {
        Object.keys(localStorage).filter((k) => k.startsWith("sb-") && k.endsWith("-auth-token")).forEach((k) => localStorage.removeItem(k));
      } catch {
      }
    },
    refreshProfile: async () => {
      if (session?.user) return loadProfile(session.user);
      return null;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function useAuth() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-serif text-gold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-serif text-foreground", children: "Página não encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A página que você procura não existe." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
        children: "Voltar ao início"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-serif text-foreground", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Tente novamente ou volte ao início." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border border-border px-4 py-2 text-sm", children: "Início" })
    ] })
  ] }) });
}
const Route$i = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bíblia Estúdios — Estudo bíblico em profundidade" },
      { name: "description", content: "Plataforma educacional cristã com apostilas em múltiplos níveis para entender a Bíblia em profundidade." },
      { property: "og:title", content: "Bíblia Estúdios" },
      { property: "og:description", content: "Tudo que você precisa para entender a Bíblia em profundidade." },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$i.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { theme: "dark" })
  ] }) });
}
const $$splitComponentImporter$h = () => import("./termos-BbIED8xv.mjs");
const Route$h = createFileRoute("/termos")({
  head: () => ({
    meta: [{
      title: "Termos de Serviço — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./suporte-UQTPLoem.mjs");
const Route$g = createFileRoute("/suporte")({
  head: () => ({
    meta: [{
      title: "Suporte — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./signup-DZ1J_0QP.mjs");
const Route$f = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Criar conta — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./responder-Dk-TZW7V.mjs");
const Route$e = createFileRoute("/responder")({
  head: () => ({
    meta: [{
      title: "Responder — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./reset-password-C0YvhqPp.mjs");
const Route$d = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{
      title: "Nova senha — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./privacidade-DZF00mxA.mjs");
const Route$c = createFileRoute("/privacidade")({
  head: () => ({
    meta: [{
      title: "Política de Privacidade — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./perfil-ByjoMImq.mjs");
const Route$b = createFileRoute("/perfil")({
  head: () => ({
    meta: [{
      title: "Meu Perfil — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./login-DQmMi5qS.mjs");
const Route$a = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Entrar — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./exercicios-DnCoIcIT.mjs");
const Route$9 = createFileRoute("/exercicios")({
  head: () => ({
    meta: [{
      title: "Exercícios — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./documentacao-TOi2V757.mjs");
const Route$8 = createFileRoute("/documentacao")({
  head: () => ({
    meta: [{
      title: "Documentação — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./dashboard-nOhvCWRD.mjs");
const Route$7 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./complete-profile-DycqVoIU.mjs");
const Route$6 = createFileRoute("/complete-profile")({
  head: () => ({
    meta: [{
      title: "Complete seu cadastro — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./audiolivros-DSACjhmm.mjs");
const Route$5 = createFileRoute("/audiolivros")({
  head: () => ({
    meta: [{
      title: "Áudio Livros — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin-275Y1Uq9.mjs");
const Route$4 = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Painel Admin — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-BHQH0-jp.mjs");
const Route$3 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Bíblia Estúdios — Estudo bíblico em profundidade"
    }, {
      name: "description",
      content: "Tudo que você precisa para entender a Bíblia em profundidade."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./responder._apostilaId-Bpv6LzkR.mjs");
const Route$2 = createFileRoute("/responder/$apostilaId")({
  head: () => ({
    meta: [{
      title: "Prova — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./audiolivros.genesis-Dctg6f1k.mjs");
const Route$1 = createFileRoute("/audiolivros/genesis")({
  head: () => ({
    meta: [{
      title: "Gênesis — A Criação e a Queda | Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./apostila._id-aTiGo2e3.mjs");
const Route = createFileRoute("/apostila/$id")({
  head: () => ({
    meta: [{
      title: "Apostila — Bíblia Estúdios"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermosRoute = Route$h.update({
  id: "/termos",
  path: "/termos",
  getParentRoute: () => Route$i
});
const SuporteRoute = Route$g.update({
  id: "/suporte",
  path: "/suporte",
  getParentRoute: () => Route$i
});
const SignupRoute = Route$f.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$i
});
const ResponderRoute = Route$e.update({
  id: "/responder",
  path: "/responder",
  getParentRoute: () => Route$i
});
const ResetPasswordRoute = Route$d.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$i
});
const PrivacidadeRoute = Route$c.update({
  id: "/privacidade",
  path: "/privacidade",
  getParentRoute: () => Route$i
});
const PerfilRoute = Route$b.update({
  id: "/perfil",
  path: "/perfil",
  getParentRoute: () => Route$i
});
const LoginRoute = Route$a.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$i
});
const ExerciciosRoute = Route$9.update({
  id: "/exercicios",
  path: "/exercicios",
  getParentRoute: () => Route$i
});
const DocumentacaoRoute = Route$8.update({
  id: "/documentacao",
  path: "/documentacao",
  getParentRoute: () => Route$i
});
const DashboardRoute = Route$7.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$i
});
const CompleteProfileRoute = Route$6.update({
  id: "/complete-profile",
  path: "/complete-profile",
  getParentRoute: () => Route$i
});
const AudiolivrosRoute = Route$5.update({
  id: "/audiolivros",
  path: "/audiolivros",
  getParentRoute: () => Route$i
});
const AdminRoute = Route$4.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$i
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$i
});
const ResponderApostilaIdRoute = Route$2.update({
  id: "/$apostilaId",
  path: "/$apostilaId",
  getParentRoute: () => ResponderRoute
});
const AudiolivrosGenesisRoute = Route$1.update({
  id: "/genesis",
  path: "/genesis",
  getParentRoute: () => AudiolivrosRoute
});
const ApostilaIdRoute = Route.update({
  id: "/apostila/$id",
  path: "/apostila/$id",
  getParentRoute: () => Route$i
});
const AudiolivrosRouteChildren = {
  AudiolivrosGenesisRoute
};
const AudiolivrosRouteWithChildren = AudiolivrosRoute._addFileChildren(
  AudiolivrosRouteChildren
);
const ResponderRouteChildren = {
  ResponderApostilaIdRoute
};
const ResponderRouteWithChildren = ResponderRoute._addFileChildren(
  ResponderRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  AudiolivrosRoute: AudiolivrosRouteWithChildren,
  CompleteProfileRoute,
  DashboardRoute,
  DocumentacaoRoute,
  ExerciciosRoute,
  LoginRoute,
  PerfilRoute,
  PrivacidadeRoute,
  ResetPasswordRoute,
  ResponderRoute: ResponderRouteWithChildren,
  SignupRoute,
  SuporteRoute,
  TermosRoute,
  ApostilaIdRoute
};
const routeTree = Route$i._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route,
  router,
  supabase,
  useAuth
};
