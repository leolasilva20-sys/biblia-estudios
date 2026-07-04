import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useParams, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button, b as buttonVariants } from "./button-CjjxD3JV.mjs";
import { T as Textarea } from "./textarea-BMkBHt8W.mjs";
import { R as RadioGroup$1, a as RadioGroupItem$1, b as RadioGroupIndicator } from "../_libs/radix-ui__react-radio-group.mjs";
import { c as cn } from "./utils-B-5jxtHY.mjs";
import { L as Label } from "./label-CBu_eAVI.mjs";
import { R as Root, I as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { R as Root2, T as Trigger2, P as Portal2, C as Content2, a as Title2, D as Description2, b as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { A as ArrowLeft, b as CircleCheck, s as ChevronLeft, m as ChevronRight, t as Send, u as Circle } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup$1, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = RadioGroup$1.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RadioGroupItem$1,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupIndicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = Root.displayName;
const AlertDialog = Root2;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
function ResponderProva() {
  const {
    apostilaId
  } = useParams({
    from: "/responder/$apostilaId"
  });
  const apId = Number(apostilaId);
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [licoes, setLicoes] = reactExports.useState(null);
  const [respostas, setRespostas] = reactExports.useState({});
  const [titulo, setTitulo] = reactExports.useState("");
  const [idx, setIdx] = reactExports.useState(0);
  const [saving, setSaving] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
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
    if (!user || !profile?.acesso_liberado || !apId) return;
    (async () => {
      const {
        data: lc,
        error: e1
      } = await supabase.from("licoes").select("*").eq("apostila_id", apId).order("ordem", {
        ascending: true
      });
      if (e1) {
        toast.error(e1.message);
        return;
      }
      const {
        data: ap
      } = await supabase.from("apostilas").select("title").eq("id", apId).maybeSingle();
      setTitulo(ap?.title ?? `Apostila #${apId}`);
      const {
        data: rs
      } = await supabase.from("respostas").select("id, licao_id, resposta, status, nota, visto, visto_em").eq("user_id", user.id).eq("apostila_id", apId);
      const map = {};
      (rs ?? []).forEach((r) => {
        if (r.licao_id) map[r.licao_id] = r;
      });
      setRespostas(map);
      setLicoes(lc ?? []);
    })();
  }, [user, profile, apId]);
  const allEnviada = reactExports.useMemo(() => {
    if (!licoes || licoes.length === 0) return false;
    return licoes.every((l) => {
      const r = respostas[l.id];
      return r && (r.status === "enviada" || r.status === "corrigida");
    });
  }, [licoes, respostas]);
  const allCorrigida = reactExports.useMemo(() => {
    if (!licoes || licoes.length === 0) return false;
    return licoes.every((l) => respostas[l.id]?.status === "corrigida");
  }, [licoes, respostas]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10 text-muted-foreground", children: "Carregando..." })
    ] });
  }
  if (!user || !profile?.acesso_liberado) return null;
  if (licoes === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10 text-muted-foreground", children: "Carregando prova..." })
    ] });
  }
  if (licoes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/responder", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
          " Voltar"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma pergunta cadastrada para esta apostila." })
      ] })
    ] });
  }
  if (allEnviada) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/responder", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
          " Voltar"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold uppercase tracking-widest", children: "Prova" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl gold-text-gradient mt-2", children: titulo })
        ] }),
        !allCorrigida ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-sky-400 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mb-2", children: "Prova enviada" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Suas respostas foram enviadas e estão aguardando correção." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-emerald-400 mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-2xl mb-1", children: "Prova corrigida" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Veja abaixo o resultado por pergunta." })
          ] }),
          licoes.map((l) => {
            const r = respostas[l.id];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/60 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gold uppercase tracking-wider", children: l.topico }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-serif text-lg mt-1", children: l.pergunta }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Sua resposta:" }),
                " ",
                r?.resposta || /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "(em branco)" })
              ] }),
              typeof r?.nota === "number" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-2 text-emerald-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Nota:" }),
                " ",
                r.nota
              ] })
            ] }, l.id);
          })
        ] })
      ] })
    ] });
  }
  const total = licoes.length;
  const licao = licoes[idx];
  const resp = respostas[licao.id];
  const currentValue = resp?.resposta ?? "";
  const answeredCount = licoes.filter((l) => (respostas[l.id]?.resposta ?? "").trim() !== "").length;
  const setCurrent = (val) => {
    setRespostas((prev) => ({
      ...prev,
      [licao.id]: {
        ...prev[licao.id] ?? {
          licao_id: licao.id,
          status: "rascunho",
          nota: null,
          visto: null,
          visto_em: null,
          resposta: null
        },
        resposta: val,
        status: "rascunho"
      }
    }));
  };
  const persistCurrent = async () => {
    if (!user) return;
    const r = respostas[licao.id];
    const value = (r?.resposta ?? "").trim();
    setSaving(true);
    const payload = {
      user_id: user.id,
      apostila_id: apId,
      licao_id: licao.id,
      pergunta: licao.pergunta,
      resposta: value || null,
      status: "rascunho"
    };
    const {
      data,
      error
    } = await supabase.from("respostas").upsert(payload, {
      onConflict: "user_id,licao_id"
    }).select("id").maybeSingle();
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    if (data?.id && !respostas[licao.id]?.id) {
      setRespostas((prev) => ({
        ...prev,
        [licao.id]: {
          ...prev[licao.id],
          id: data.id
        }
      }));
    }
  };
  const goPrev = async () => {
    await persistCurrent();
    setIdx((i) => Math.max(0, i - 1));
  };
  const goNext = async () => {
    await persistCurrent();
    setIdx((i) => Math.min(total - 1, i + 1));
  };
  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    await persistCurrent();
    const toUpsert = licoes.map((l) => {
      const r = respostas[l.id];
      return {
        user_id: user.id,
        apostila_id: apId,
        licao_id: l.id,
        pergunta: l.pergunta,
        resposta: (r?.resposta ?? "").trim() || null,
        status: "enviada"
      };
    });
    const {
      error
    } = await supabase.from("respostas").upsert(toUpsert, {
      onConflict: "user_id,licao_id"
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao enviar: " + error.message);
      return;
    }
    toast.success("Prova enviada para correção!");
    navigate({
      to: "/responder"
    });
  };
  const isLast = idx === total - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 container mx-auto max-w-3xl px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/responder", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1" }),
        " Voltar"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gold uppercase tracking-widest", children: "Prova" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl gold-text-gradient mt-2", children: titulo }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Pergunta ",
            idx + 1,
            " de ",
            total
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            answeredCount,
            " respondida",
            answeredCount === 1 ? "" : "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: (idx + 1) / total * 100, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: licoes.map((l, i) => {
        const answered = (respostas[l.id]?.resposta ?? "").trim() !== "";
        const active = i === idx;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: async () => {
          await persistCurrent();
          setIdx(i);
        }, className: `h-8 w-8 text-xs rounded-md border transition-colors ${active ? "border-gold bg-gold/20 text-gold" : answered ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500" : "border-border bg-card/40 text-muted-foreground hover:border-gold/40"}`, children: i + 1 }, l.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/60 bg-card/60 backdrop-blur p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gold uppercase tracking-wider", children: licao.topico }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl md:text-2xl mt-2 mb-5", children: licao.pergunta }),
        licao.tipo === "alternativa" && Array.isArray(licao.alternativas) ? /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: currentValue, onValueChange: setCurrent, className: "gap-3", children: licao.alternativas.map((alt, i) => {
          const letra = String.fromCharCode(65 + i);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: `opt-${licao.id}-${i}`, className: `flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${currentValue === letra ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: letra, id: `opt-${licao.id}-${i}`, className: "mt-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm leading-relaxed", children: alt })
          ] }, i);
        }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: currentValue, onChange: (e) => setCurrent(e.target.value), rows: 8, placeholder: "Escreva sua resposta..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: goPrev, disabled: idx === 0 || saving, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 mr-1" }),
          " Anterior"
        ] }),
        !isLast ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: goNext, disabled: saving, className: "bg-gold text-primary-foreground hover:opacity-90", children: [
          "Próximo ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 ml-1" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: saving || submitting, className: "bg-gold text-primary-foreground hover:opacity-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-1" }),
            " Enviar prova"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Enviar prova?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                "Você respondeu ",
                answeredCount,
                " de ",
                total,
                " perguntas. Após enviar você não poderá mais editar suas respostas."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleSubmit, disabled: submitting, children: submitting ? "Enviando..." : "Confirmar envio" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3 text-center", children: saving ? "Salvando rascunho..." : "Suas respostas são salvas automaticamente como rascunho ao navegar." })
    ] })
  ] });
}
export {
  ResponderProva as component
};
