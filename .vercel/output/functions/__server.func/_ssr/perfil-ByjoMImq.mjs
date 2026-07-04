import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { I as Input } from "./input-CYqlILYs.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
import { d as ChevronUp, e as ChevronDown, f as FingerprintPattern, g as FileCheck, h as ScrollText, i as ShieldCheck, j as LogOut } from "../_libs/lucide-react.mjs";
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
function Perfil() {
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
  const [saving, setSaving] = reactExports.useState(false);
  const [loginsOpen, setLoginsOpen] = reactExports.useState(false);
  const [passkeyLoading, setPasskeyLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
  }, [user, loading, navigate]);
  reactExports.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setWhatsapp(profile.whatsapp ?? "");
    }
  }, [profile]);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: fullName,
      whatsapp: whatsapp || null
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error("Não foi possível salvar as alterações.");
    toast.success("Perfil atualizado com sucesso!");
    refreshProfile();
  };
  const handleAddPasskey = async () => {
    setPasskeyLoading(true);
    try {
      const auth = supabase.auth;
      const {
        error
      } = await auth.registerPasskey();
      if (error) {
        console.error("Erro ao cadastrar passkey:", error);
        toast.error(error.message || "Não foi possível cadastrar a passkey neste dispositivo.");
        return;
      }
      toast.success("Passkey cadastrada com sucesso!");
    } catch (err) {
      console.error("Exceção ao cadastrar passkey:", err);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(`Erro: ${message}`);
    } finally {
      setPasskeyLoading(false);
    }
  };
  const handleLogout = async () => {
    await signOut();
    navigate({
      to: "/"
    });
  };
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Carregando..." });
  }
  const nivelLabel = profile?.nivel_admin === "admin" ? "Administrador" : profile?.nivel_admin === "junior" ? "Admin Júnior" : "Aluno";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-6 py-12 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl gold-text-gradient mb-2", children: "Meu Perfil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Gerencie suas informações pessoais, seus logins e sua conta." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/60 p-6 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: user.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Nível de acesso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold font-medium", children: nivelLabel })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "rounded-xl border border-border/60 bg-card/60 p-6 space-y-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fullName", children: "Nome completo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "fullName", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Seu nome" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "whatsapp", children: "WhatsApp (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "whatsapp", value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), placeholder: "(00) 00000-0000" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, className: "w-full", children: saving ? "Salvando..." : "Salvar alterações" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/60 overflow-hidden mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setLoginsOpen((v) => !v), className: "w-full flex items-center justify-between p-6 hover:bg-muted/20 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg", children: "Gerenciar Logins" }),
          loginsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        loginsOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6 border-t border-border/40 pt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "h-4 w-4 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-base", children: "Passkey" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-gold/10 text-gold border border-gold/30 px-1.5 py-0.5 rounded", children: "beta" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Cadastre este dispositivo para entrar com biometria (digital, rosto ou PIN), sem precisar digitar sua senha da próxima vez." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: handleAddPasskey, disabled: passkeyLoading, className: "w-full", children: passkeyLoading ? "Cadastrando..." : "Cadastrar passkey neste dispositivo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/documentacao", className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { className: "h-4 w-4 text-gold" }),
          " Documentação"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/termos", className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "h-4 w-4 text-gold" }),
          " Termos de Serviço"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/privacidade", className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-gold" }),
          " Política de Privacidade"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-400/5 text-red-400 hover:bg-red-400/10 transition-colors py-3 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        "Sair da conta"
      ] })
    ] }) })
  ] });
}
export {
  Perfil as component
};
