import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { I as Input } from "./input-CYqlILYs.mjs";
import { T as Textarea } from "./textarea-BMkBHt8W.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
import { createServerFn, TSS_SERVER_FUNCTION, getServerFnById } from "./index.mjs";
import "../_libs/seroval.mjs";
import { L as LifeBuoy } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const inputSchema = objectType({
  nome: stringType().min(1).max(200),
  email: stringType().email().max(320),
  mensagem: stringType().min(1).max(5e3)
});
const sendSupportEmail = createServerFn({
  method: "POST"
}).inputValidator((data) => inputSchema.parse(data)).handler(createSsrRpc("625708959784a3e3bb62af17d4624bfdeefb749934b9540e3fca167595540c54"));
function Suporte() {
  const {
    user,
    profile
  } = useAuth();
  const [nome, setNome] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [mensagem, setMensagem] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (profile?.full_name) setNome(profile.full_name);
    if (profile?.email) setEmail(profile.email);
    else if (user?.email) setEmail(user.email);
  }, [profile, user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      return toast.error("Preencha todos os campos");
    }
    setLoading(true);
    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      mensagem: mensagem.trim()
    };
    const {
      error
    } = await supabase.from("support_messages").insert({
      user_id: user?.id ?? null,
      ...payload,
      status: "pendente"
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    try {
      await sendSupportEmail({
        data: payload
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    toast.success("Mensagem enviada! Responderemos em breve.");
    setMensagem("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-2xl px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "h-10 w-10 text-gold mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-4xl gold-text-gradient", children: "Suporte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Envie sua dúvida ou comentário. Respondemos por email." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nome", value: nome, onChange: (e) => setNome(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mensagem", children: "Mensagem" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "mensagem", rows: 6, value: mensagem, onChange: (e) => setMensagem(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "w-full bg-gold text-primary-foreground hover:opacity-90", children: loading ? "Enviando..." : "Enviar mensagem" })
      ] })
    ] })
  ] });
}
export {
  Suporte as component
};
