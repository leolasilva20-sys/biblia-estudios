import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { I as Input } from "./input-CYqlILYs.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
import { B as BookOpen, j as LogOut } from "../_libs/lucide-react.mjs";
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
function CompleteProfilePage() {
  const {
    user,
    profile,
    loading,
    refreshProfile,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = reactExports.useState("");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [invite, setInvite] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (profile?.acesso_liberado) {
      navigate({
        to: "/dashboard"
      });
      return;
    }
    if (profile) {
      setFullName(profile.full_name ?? "");
      setWhatsapp(profile.whatsapp ?? "");
    }
    const meta = user.user_metadata ?? {};
    if (!profile?.full_name) {
      const n = meta.full_name ?? meta.name;
      if (n) setFullName(n);
    }
  }, [user, profile, loading, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const code = invite.trim().toUpperCase();
    if (!fullName.trim()) return toast.error("Informe seu nome completo");
    if (!code) return toast.error("Informe o código de convite");
    setSubmitting(true);
    const meta = user.user_metadata ?? {};
    const picture = meta.avatar_url ?? meta.picture ?? null;
    const {
      error: upErr
    } = await supabase.from("profiles").update({
      full_name: fullName.trim(),
      whatsapp: whatsapp.trim() || null,
      avatar_url: profile?.avatar_url ?? picture
    }).eq("id", user.id);
    if (upErr) {
      setSubmitting(false);
      return toast.error("Erro ao salvar perfil: " + upErr.message);
    }
    const {
      data,
      error
    } = await supabase.rpc("consumir_convite", {
      p_codigo: code
    });
    setSubmitting(false);
    if (error) {
      return toast.error("Erro ao validar convite: " + error.message);
    }
    const result = data;
    if (!result?.ok) {
      return toast.error(result?.error ?? "Código de convite inválido");
    }
    await refreshProfile();
    toast.success("Acesso liberado! Bem-vindo.");
    navigate({
      to: "/dashboard"
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center justify-center gap-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-2xl gold-text-gradient", children: "Bíblia Estúdios" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/70 backdrop-blur p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-2xl text-center mb-1", children: "Complete seu cadastro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mb-6", children: "Falta pouco — informe o código de convite para liberar seu acesso." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Nome completo *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, value: fullName, onChange: (e) => setFullName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "whatsapp", children: "WhatsApp (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "whatsapp", type: "tel", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), placeholder: "(11) 99999-9999" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "invite", children: "Código de convite *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "invite", required: true, value: invite, onChange: (e) => setInvite(e.target.value), placeholder: "Ex.: AMOR2026", style: {
            textTransform: "uppercase"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: submitting, className: "w-full bg-gold text-primary-foreground hover:opacity-90", children: submitting ? "Validando..." : "Liberar acesso" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider my-6 text-xs", children: "ou" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "w-full text-muted-foreground", onClick: async () => {
        await signOut();
        navigate({
          to: "/"
        });
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-2" }),
        " Sair"
      ] })
    ] })
  ] }) });
}
export {
  CompleteProfilePage as component
};
