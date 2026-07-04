import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery, a as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import { T as Textarea } from "./textarea-BMkBHt8W.mjs";
import { B as BookOpen, U as Users, p as FileQuestionMark, L as LifeBuoy, S as Shield, A as ArrowLeft, j as LogOut, b as CircleCheck, q as MessageSquare } from "../_libs/lucide-react.mjs";
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
function AdminPanel() {
  const {
    user,
    profile,
    loading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const nivel = profile?.nivel_admin ?? "nenhum";
  const hasAccess = nivel !== "nenhum";
  const isFullAdmin = nivel === "admin";
  const [tab, setTab] = reactExports.useState("overview");
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) navigate({
      to: "/login"
    });
    else if (profile && nivel === "nenhum") navigate({
      to: "/dashboard"
    });
  }, [user, profile, nivel, loading, navigate]);
  const {
    data: stats
  } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [u, r, s] = await Promise.all([supabase.from("profiles").select("id", {
        count: "exact",
        head: true
      }), supabase.from("respostas").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pendente"), supabase.from("support_messages").select("id", {
        count: "exact",
        head: true
      }).eq("status", "pendente")]);
      return {
        usuarios: u.count ?? 0,
        respostas: r.count ?? 0,
        suporte: s.count ?? 0
      };
    },
    enabled: hasAccess
  });
  if (loading || !hasAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Verificando acesso..." });
  }
  const allTabs = [{
    k: "overview",
    label: "Resumo",
    icon: BookOpen
  }, {
    k: "usuarios",
    label: "Usuários",
    icon: Users
  }, {
    k: "respostas",
    label: "Respostas",
    icon: FileQuestionMark
  }, {
    k: "suporte",
    label: "Suporte",
    icon: LifeBuoy
  }];
  const visibleTabs = isFullAdmin ? allTabs : allTabs.filter((t) => t.k === "overview" || t.k === "respostas");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#0E0C0A]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b-2 border-gold/40 bg-black/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 rounded-md bg-gold text-primary-foreground text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_oklch(0.74_0.12_82/0.4)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 inline mr-1" }),
          " ",
          isFullAdmin ? "ADMIN" : "JUNIOR"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg text-gold", children: "Painel de Controle" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
          " Site"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: async () => {
          await signOut();
          navigate({
            to: "/"
          });
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-1" }),
          " Sair"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "space-y-1", children: visibleTabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.k), className: `w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${tab === t.k ? "bg-gold text-primary-foreground font-medium" : "text-muted-foreground hover:bg-card hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-4 w-4" }),
        " ",
        t.label
      ] }, t.k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
        tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Usuários", value: stats?.usuarios ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: FileQuestionMark, label: "Respostas pendentes", value: stats?.respostas ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: LifeBuoy, label: "Suporte pendente", value: stats?.suporte ?? 0 })
        ] }),
        tab === "usuarios" && isFullAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(UsuariosList, {}),
        tab === "respostas" && /* @__PURE__ */ jsxRuntimeExports.jsx(RespostasList, { readOnly: !isFullAdmin }),
        tab === "suporte" && isFullAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SuporteList, {})
      ] })
    ] })
  ] });
}
function StatCard({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-gold/30 bg-gradient-to-br from-card to-black/40 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-gold mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-serif gold-text-gradient", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mt-1", children: label })
  ] });
}
function UsuariosList() {
  const {
    data
  } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("profiles").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border/60 font-serif text-gold", children: "Usuários" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/40", children: [
      (data ?? []).map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: u.full_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: u.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          u.is_admin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30", children: "admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(u.created_at).toLocaleDateString() })
        ] })
      ] }, u.id)),
      data && data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-8 text-center text-muted-foreground", children: "Nenhum usuário." })
    ] })
  ] });
}
function RespostasList({
  readOnly = false
}) {
  const qc = useQueryClient();
  const [feedback, setFeedback] = reactExports.useState({});
  const {
    data
  } = useQuery({
    queryKey: ["admin", "respostas"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("respostas").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2;
    }
  });
  const aprovar = async (id) => {
    const {
      error
    } = await supabase.from("respostas").update({
      status: "aprovada",
      feedback: feedback[id] ?? null
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Resposta aprovada");
    qc.invalidateQueries({
      queryKey: ["admin"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    (data ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${r.status === "pendente" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`, children: r.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(r.created_at).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-gold mb-1", children: r.pergunta }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 whitespace-pre-wrap mb-3", children: r.resposta }),
      r.status === "pendente" && !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Feedback opcional...", rows: 2, value: feedback[r.id] ?? r.feedback ?? "", onChange: (e) => setFeedback({
          ...feedback,
          [r.id]: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => aprovar(r.id), className: "bg-gold text-primary-foreground hover:opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1" }),
          " Aprovar"
        ] })
      ] }),
      r.feedback && r.status !== "pendente" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-muted-foreground border-l-2 border-gold/40 pl-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-gold", children: "Feedback:" }),
        " ",
        r.feedback
      ] })
    ] }, r.id)),
    data && data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-12", children: "Nenhuma resposta." })
  ] });
}
function SuporteList() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["admin", "suporte"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("support_messages").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data2;
    }
  });
  const resolver = async (id) => {
    const {
      error
    } = await supabase.from("support_messages").update({
      status: "resolvido"
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Marcado como resolvido");
    qc.invalidateQueries({
      queryKey: ["admin"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    (data ?? []).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/40 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: m.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: m.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${m.status === "pendente" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`, children: m.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap mb-3", children: m.mensagem }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(m.created_at).toLocaleString() }),
        m.status === "pendente" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => resolver(m.id), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1" }),
          " Marcar resolvido"
        ] })
      ] })
    ] }, m.id)),
    data && data.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-12", children: "Nenhuma mensagem." })
  ] });
}
export {
  AdminPanel as component
};
