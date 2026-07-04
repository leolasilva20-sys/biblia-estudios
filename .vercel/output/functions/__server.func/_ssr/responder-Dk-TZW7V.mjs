import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, C as ClipboardList, b as CircleCheck, c as Clock } from "../_libs/lucide-react.mjs";
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
function ResponderList() {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = reactExports.useState(null);
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
  reactExports.useEffect(() => {
    if (!user || !profile?.acesso_liberado) return;
    (async () => {
      const {
        data: licoes
      } = await supabase.from("licoes").select("apostila_id");
      const counts = /* @__PURE__ */ new Map();
      (licoes ?? []).forEach((l) => {
        counts.set(l.apostila_id, (counts.get(l.apostila_id) ?? 0) + 1);
      });
      const ids = Array.from(counts.keys());
      if (ids.length === 0) {
        setItems([]);
        return;
      }
      const {
        data: apostilas
      } = await supabase.from("apostilas").select("id, title").in("id", ids);
      const titulos = /* @__PURE__ */ new Map();
      (apostilas ?? []).forEach((a) => titulos.set(a.id, a.title));
      const {
        data: respostas
      } = await supabase.from("respostas").select("apostila_id, status").eq("user_id", user.id).in("apostila_id", ids);
      const statusMap = /* @__PURE__ */ new Map();
      (respostas ?? []).forEach((r) => {
        const cur = statusMap.get(r.apostila_id);
        const order = ["nao_iniciado", "rascunho", "enviada", "corrigida"];
        const next = r.status === "corrigida" ? "corrigida" : r.status === "enviada" ? "enviada" : "rascunho";
        if (!cur || order.indexOf(next) > order.indexOf(cur)) statusMap.set(r.apostila_id, next);
      });
      const result = ids.map((id) => ({
        apostila_id: id,
        titulo: titulos.get(id) ?? `Apostila #${id}`,
        total: counts.get(id) ?? 0,
        status: statusMap.get(id) ?? "nao_iniciado"
      })).sort((a, b) => a.apostila_id - b.apostila_id);
      setItems(result);
    })();
  }, [user, profile]);
  if (!user || !profile?.acesso_liberado) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
        " Voltar"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold uppercase tracking-widest", children: "Prova" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl gold-text-gradient mt-2", children: "Responder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Escolha uma apostila para responder a prova. Suas respostas ficam salvas como rascunho até você enviar." })
      ] }),
      items === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Carregando..." }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma prova disponível no momento." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/responder/$apostilaId", params: {
        apostilaId: String(it.apostila_id)
      }, className: "group rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5 hover:border-gold/60 transition-all flex items-center gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-xl truncate", children: it.titulo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
            it.total,
            " perguntas"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: it.status })
      ] }, it.apostila_id)) })
    ] })
  ] });
}
function StatusBadge({
  status
}) {
  if (status === "corrigida") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      " Corrigida"
    ] });
  }
  if (status === "enviada") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
      " Enviada"
    ] });
  }
  if (status === "rascunho") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded", children: "Rascunho" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded", children: "Iniciar" });
}
export {
  ResponderList as component
};
