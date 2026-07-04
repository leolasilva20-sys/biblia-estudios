import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useAuth } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import "../_libs/sonner.mjs";
import { o as BookMarked, m as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "./avatar-_RcPDcoa.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function AudioLivros() {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (profile && !profile.acesso_liberado) {
      navigate({
        to: "/complete-profile"
      });
      return;
    }
    if (profile && !isAdmin) {
      navigate({
        to: "/dashboard"
      });
      return;
    }
  }, [user, profile, loading, isAdmin, navigate]);
  if (loading || !user || !profile?.acesso_liberado || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-6 py-12 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold uppercase tracking-widest", children: "Bíblia Estúdios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl gold-text-gradient mt-2", children: "Áudio Livros" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 font-serif italic", children: "Acesso restrito — visível apenas para administradores." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audiolivros/genesis", className: "group flex items-center gap-5 rounded-xl border border-border/60 bg-card/60 p-6 hover:border-gold/60 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "h-6 w-6 text-gold" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "Gênesis — A Criação e a Queda" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Ver capítulos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors flex-shrink-0" })
      ] })
    ] }) })
  ] });
}
export {
  AudioLivros as component
};
