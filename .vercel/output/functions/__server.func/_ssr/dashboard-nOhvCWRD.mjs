import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useAuth } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { M as MODULO_1_APOSTILAS } from "./apostilas-DIHTceSL.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import "../_libs/sonner.mjs";
import { k as Sparkles, l as Crown, G as GraduationCap, F as FileText, B as BookOpen, m as ChevronRight, c as Clock, n as Film } from "../_libs/lucide-react.mjs";
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
const NIVEL_META = {
  iniciante: {
    label: "Iniciante",
    icon: BookOpen,
    color: "text-emerald-400"
  },
  intermediario: {
    label: "Intermediário",
    icon: FileText,
    color: "text-sky-400"
  },
  avancado: {
    label: "Avançado",
    icon: GraduationCap,
    color: "text-violet-400"
  },
  especialista: {
    label: "Especialista",
    icon: Crown,
    color: "text-amber-400"
  },
  consolidacao: {
    label: "Consolidação",
    icon: Sparkles,
    color: "text-gold"
  }
};
function Dashboard() {
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
  if (loading || !user || !profile?.acesso_liberado) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Carregando..." });
  }
  const nome = profile?.full_name?.split(" ")[0] ?? "leitor";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-6 py-12 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold uppercase tracking-widest", children: "Bem-vindo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif text-4xl md:text-5xl gold-text-gradient mt-2", children: [
          "Olá, ",
          nome
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-2xl font-serif italic", children: "Comece sua jornada pelas Escrituras, uma página de cada vez." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gold uppercase tracking-widest", children: "Módulo 1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl gold-text-gradient mt-1", children: "Gênesis 1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "5 apostilas progressivas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: MODULO_1_APOSTILAS.map((ap, idx) => {
          const meta = NIVEL_META[ap.nivel];
          const Icon = meta.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/apostila/$id", params: {
            id: ap.id
          }, className: "group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 hover:border-gold/60 transition-all flex items-center gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center font-serif text-gold", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${meta.color}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: meta.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl mt-1 truncate", children: ap.titulo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5 truncate", children: ap.descricao })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-muted-foreground group-hover:text-gold transition-colors" })
          ] }, ap.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider mb-8 max-w-xs mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl text-center gold-text-gradient mb-2", children: "Em breve" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground mb-8 font-serif italic", children: "Próximos lançamentos da Bíblia Estúdios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ComingCard, { icon: BookOpen, eta: "Em breve", title: "Módulos 2 a 6 — Gênesis", desc: "Continuação completa do livro de Gênesis em cinco níveis." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ComingCard, { icon: Film, eta: "Em breve", title: "Série animada: Gênesis", desc: "Adaptação visual da narrativa para todas as idades." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ComingCard, { icon: Sparkles, eta: "Em breve", title: "Lista de espera", desc: "Em breve você poderá entrar na fila para cada lançamento." })
        ] })
      ] })
    ] }) })
  ] });
}
function ComingCard({
  icon: Icon,
  eta,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-5 flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded", children: eta })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground flex-1", children: desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", disabled: true, className: "w-fit opacity-60 cursor-not-allowed", children: "Em breve" })
  ] });
}
export {
  Dashboard as component
};
