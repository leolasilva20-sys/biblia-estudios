import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { Route, useAuth } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { g as getApostila, b as buildDriveEmbedUrl } from "./apostilas-DIHTceSL.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, z as PenLine } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
function ApostilaViewer() {
  const {
    id
  } = Route.useParams();
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (profile && !profile.acesso_liberado) navigate({
      to: "/complete-profile"
    });
  }, [user, profile, loading, navigate]);
  const apostila = getApostila(id);
  if (!user || !profile?.acesso_liberado) return null;
  if (!apostila) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-2xl text-gold", children: "Apostila não encontrada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "mt-6", children: "Voltar ao dashboard" }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-6xl px-6 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
          " Voltar"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-2xl gold-text-gradient", children: apostila.titulo }),
        apostila.nivel === "consolidacao" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/exercicios", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gold text-primary-foreground hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4 mr-2" }),
          " Responder exercícios"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/60 overflow-hidden bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: buildDriveEmbedUrl(apostila), title: apostila.titulo, className: "w-full", style: {
        height: "calc(100vh - 200px)",
        minHeight: "600px",
        border: "none"
      }, allow: "autoplay" }) })
    ] })
  ] });
}
export {
  ApostilaViewer as component
};
