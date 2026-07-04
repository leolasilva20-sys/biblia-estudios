import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { T as Textarea } from "./textarea-BMkBHt8W.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
import { b as CircleCheck, A as ArrowLeft } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
const PERGUNTAS = ["Em suas próprias palavras, qual é a mensagem central de Gênesis 1?", 'O que o conceito hebraico de "tohu wa-bohu" revela sobre o estado inicial da criação?', "Como a estrutura dos sete dias reflete a teologia do descanso e da ordem divina?", "Qual a diferença entre a cosmogonia bíblica e as cosmogonias do Antigo Oriente Médio?", 'O que significa ser criado "à imagem e semelhança de Deus" (imago Dei)?'];
function Exercicios() {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [respostas, setRespostas] = reactExports.useState(Array(5).fill(""));
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [submitted, setSubmitted] = reactExports.useState(false);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (respostas.some((r) => !r.trim())) {
      return toast.error("Responda todas as perguntas");
    }
    setSubmitting(true);
    const rows = PERGUNTAS.map((p, i) => ({
      user_id: user.id,
      pergunta: p,
      resposta: respostas[i].trim(),
      status: "pendente"
    }));
    const {
      error
    } = await supabase.from("respostas").insert(rows);
    setSubmitting(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    toast.success("Respostas enviadas para revisão!");
  };
  if (!user || !profile?.acesso_liberado) return null;
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-2xl px-6 py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-16 w-16 text-gold mx-auto mb-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl gold-text-gradient mb-3", children: "Respostas enviadas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Suas respostas foram registradas e serão revisadas em breve." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Voltar ao dashboard" }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
        " Voltar"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold uppercase tracking-widest", children: "Consolidação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl gold-text-gradient mt-2", children: "Exercícios — Gênesis 1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Responda com suas próprias palavras. Suas respostas serão revisadas." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        PERGUNTAS.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/60 backdrop-blur p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-serif text-base text-gold", children: [
            "Pergunta ",
            i + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 mb-3 text-foreground", children: p }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: respostas[i], onChange: (e) => {
            const copy = [...respostas];
            copy[i] = e.target.value;
            setRespostas(copy);
          }, rows: 4, placeholder: "Sua resposta...", required: true })
        ] }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, size: "lg", className: "w-full bg-gold text-primary-foreground hover:opacity-90", children: submitting ? "Enviando..." : "Enviar respostas" })
      ] })
    ] })
  ] });
}
export {
  Exercicios as component
};
