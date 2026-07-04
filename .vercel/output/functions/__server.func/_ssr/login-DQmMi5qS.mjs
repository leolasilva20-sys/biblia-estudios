import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { I as Input } from "./input-CYqlILYs.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
import { B as BookOpen, f as FingerprintPattern } from "../_libs/lucide-react.mjs";
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
function LoginPage() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    loading
  } = useAuth();
  const [email, setEmail] = reactExports.useState("");
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
  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
  };
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`
      }
    });
  };
  const [passkeyLoading, setPasskeyLoading] = reactExports.useState(false);
  const handlePasskey = async () => {
    setPasskeyLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPasskey();
      if (error) {
        toast.error("Não foi possível entrar com passkey. Tente e-mail e senha.");
        return;
      }
      toast.success("Bem-vindo de volta!");
    } catch {
      toast.error("Passkey não disponível neste dispositivo.");
    } finally {
      setPasskeyLoading(false);
    }
  };
  const handleReset = async () => {
    if (!email) return toast.error("Digite seu email primeiro");
    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) return toast.error(error.message);
    toast.success("Email de redefinição enviado");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center justify-center gap-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-2xl gold-text-gradient", children: "Bíblia Estúdios" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/70 backdrop-blur p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-2xl text-center mb-1", children: "Entrar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mb-6", children: "Acesse sua conta para continuar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleGoogle, className: "w-full mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, {}),
        " Continuar com Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handlePasskey, disabled: passkeyLoading, className: "w-full mb-4 border-gold/30 hover:border-gold/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "h-4 w-4 mr-2 text-gold" }),
        passkeyLoading ? "Verificando..." : "Continuar com Passkey",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] ml-1.5 text-muted-foreground", children: "(beta)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider my-6 text-xs", children: "ou" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Senha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleReset, className: "text-xs text-gold hover:underline", children: "Esqueci minha senha" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, className: "w-full bg-gold text-primary-foreground hover:opacity-90", children: submitting ? "Entrando..." : "Entrar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-center text-muted-foreground mt-6", children: [
        "Não tem conta? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-gold hover:underline", children: "Criar conta" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground/70 mt-4 leading-relaxed", children: [
        "Ao continuar, você concorda com os nossos",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", className: "text-gold hover:underline", children: "Termos de Serviço" }),
        " ",
        "e nossa",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "text-gold hover:underline", children: "Política de Privacidade" }),
        "."
      ] })
    ] })
  ] }) });
}
function GoogleIcon() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4 mr-2", viewBox: "0 0 24 24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" })
  ] });
}
export {
  LoginPage as component
};
