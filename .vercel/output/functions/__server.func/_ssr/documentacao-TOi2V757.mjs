import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./router-_tRA0p-q.mjs";
import "../_libs/sonner.mjs";
import { B as BookOpen } from "../_libs/lucide-react.mjs";
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
const CATEGORIA_LABEL = {
  sobre: "Sobre o Bíblia Estúdios",
  autenticacao: "Login e Autenticação",
  suporte: "Suporte",
  privacidade: "Privacidade e Segurança"
};
function Documentacao() {
  const [docs, setDocs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data,
        error
      } = await supabase.from("documentacao").select("*").order("ordem", {
        ascending: true
      });
      if (!error && data) setDocs(data);
      setLoading(false);
    })();
  }, []);
  const categorias = Array.from(new Set(docs.map((d) => d.categoria)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border/40 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg gold-text-gradient", children: "Bíblia Estúdios" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-2xl px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl gold-text-gradient mb-2", children: "Documentação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-10 font-serif italic", children: "Tudo o que você precisa saber sobre como usamos, protegemos e apresentamos nossos conteúdos." }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Carregando..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-12", children: categorias.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl text-gold mb-6 pb-2 border-b border-border/40", children: CATEGORIA_LABEL[cat] ?? cat }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: docs.filter((d) => d.categoria === cat).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-foreground mb-2", children: d.titulo }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground/80 leading-relaxed whitespace-pre-line", children: d.conteudo })
        ] }, d.id)) })
      ] }, cat)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground/70 mt-12 pt-8 border-t border-border/40", children: [
        "Dúvidas que não foram respondidas aqui?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/suporte", className: "text-gold hover:underline", children: "Fale com nosso suporte" })
      ] })
    ] })
  ] });
}
export {
  Documentacao as component
};
