import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { I as Input } from "./input-CYqlILYs.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-B-5jxtHY.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
function SignupPage() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    loading
  } = useAuth();
  const [invite, setInvite] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (profile?.acesso_liberado) navigate({
      to: "/dashboard"
    });
    else if (profile) navigate({
      to: "/complete-profile"
    });
  }, [user, profile, loading, navigate]);
  const handleSignup = async (e) => {
    e.preventDefault();
    const code = invite.trim().toUpperCase();
    if (!code) return toast.error("Informe o código de convite");
    if (!fullName.trim()) return toast.error("Informe seu nome completo");
    setSubmitting(true);
    const {
      data,
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName,
          whatsapp
        }
      }
    });
    if (error) {
      setSubmitting(false);
      return toast.error(error.message);
    }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName.trim(),
        whatsapp: whatsapp.trim() || null
      }, {
        onConflict: "id"
      });
    }
    const {
      data: sess
    } = await supabase.auth.getSession();
    if (sess.session) {
      const {
        data: rpcData,
        error: rpcErr
      } = await supabase.rpc("consumir_convite", {
        p_codigo: code
      });
      setSubmitting(false);
      if (rpcErr) {
        toast.error("Conta criada, mas convite falhou: " + rpcErr.message);
        return navigate({
          to: "/complete-profile"
        });
      }
      const result = rpcData;
      if (!result?.ok) {
        toast.error(result?.error ?? "Código de convite inválido. Tente novamente.");
        return navigate({
          to: "/complete-profile"
        });
      }
      toast.success("Conta criada com acesso liberado!");
      return navigate({
        to: "/dashboard"
      });
    }
    setSubmitting(false);
    toast.success("Conta criada! Verifique seu email para confirmar e depois faça login.");
    navigate({
      to: "/login"
    });
  };
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/complete-profile`
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center justify-center gap-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-2xl gold-text-gradient", children: "Bíblia Estúdios" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/70 backdrop-blur p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-2xl text-center mb-1", children: "Criar conta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mb-6", children: "Acesso por convite" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleGoogle, className: "w-full mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4 mr-2", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" })
        ] }),
        "Continuar com Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mb-4", children: "Você informará o código de convite na próxima tela" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider my-4 text-xs", children: "ou" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignup, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome completo *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: fullName, onChange: (e) => setFullName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "whatsapp", children: "WhatsApp (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "whatsapp", type: "tel", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), placeholder: "(11) 99999-9999" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Senha *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "invite", children: "Código de convite *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "invite", required: true, value: invite, onChange: (e) => setInvite(e.target.value), placeholder: "Ex.: AMOR2026", style: {
            textTransform: "uppercase"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, className: "w-full bg-gold text-primary-foreground hover:opacity-90", children: submitting ? "Criando..." : "Criar conta" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-center text-muted-foreground mt-6", children: [
        "Já tem conta? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-gold hover:underline", children: "Entrar" })
      ] })
    ] })
  ] }) });
}
export {
  SignupPage as component
};
