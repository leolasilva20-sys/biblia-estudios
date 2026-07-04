import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { useAuth } from "./router-_tRA0p-q.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-_RcPDcoa.mjs";
import "../_libs/sonner.mjs";
import { r as Scroll, k as Sparkles, B as BookOpen, G as GraduationCap, S as Shield, j as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function SiteHeader() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };
  const initial = (profile?.full_name ?? user?.email ?? "?").trim().charAt(0).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-xl tracking-wide gold-text-gradient", children: "Bíblia Estúdios" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-2", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-muted/40 animate-pulse" }) : user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Dashboard" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/responder", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Responder" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/audiolivros", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Áudio Livros" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suporte", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Suporte" }) }),
      profile?.nivel_admin && profile.nivel_admin !== "nenhum" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "text-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-1" }),
        " Admin"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/perfil", title: "Meu perfil", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8 border border-border/60 hover:border-gold/60 transition-colors", children: [
        profile?.avatar_url && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: profile?.full_name ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initial })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleLogout, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-1" }),
        " Sair"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: "Entrar" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-gold text-primary-foreground hover:opacity-90", children: "Começar" }) })
    ] }) })
  ] }) });
}
function Landing() {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading || !user) return;
    if (profile && !profile.acesso_liberado) {
      navigate({
        to: "/complete-profile",
        replace: true
      });
    } else {
      navigate({
        to: "/dashboard",
        replace: true
      });
    }
  }, [user, profile, loading, navigate]);
  if (!loading && user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Redirecionando..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto max-w-4xl px-6 py-24 md:py-32 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider mb-8 max-w-xs mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scroll, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-5xl md:text-7xl gold-text-gradient leading-tight", children: "Bíblia Estúdios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-serif italic", children: "Tudo que você precisa para entender a Bíblia em profundidade." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "bg-gold text-primary-foreground hover:opacity-90 font-medium px-8", children: "Começar gratuitamente" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "border-gold/40 text-foreground hover:bg-accent px-8", children: "Já tenho conta" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider mt-16 max-w-xs mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto max-w-5xl px-6 pb-24 grid md:grid-cols-3 gap-6", children: [{
        icon: BookOpen,
        title: "Cinco níveis",
        desc: "Do iniciante ao especialista, com consolidação final."
      }, {
        icon: GraduationCap,
        title: "Conteúdo curado",
        desc: "Apostilas escritas e revisadas para estudo sério."
      }, {
        icon: Scroll,
        title: "Hebraico e contexto",
        desc: "Conceitos originais, cosmogonia e teologia bíblica."
      }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/60 p-6 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-6 w-6 text-gold mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl mb-2", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: f.desc })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/60 py-6 text-center text-xs text-muted-foreground space-x-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "© Bíblia Estúdios — Estudo bíblico em profundidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/documentacao", className: "hover:text-gold transition-colors", children: "Documentação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", className: "hover:text-gold transition-colors", children: "Termos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "hover:text-gold transition-colors", children: "Privacidade" })
    ] })
  ] });
}
export {
  Landing as component
};
