import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useAuth, supabase } from "./router-_tRA0p-q.mjs";
import { A as AppSidebar } from "./app-sidebar-JGGZ6bKK.mjs";
import { B as Button } from "./button-CjjxD3JV.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, v as Lock, P as Play, w as SkipBack, x as Pause, y as SkipForward } from "../_libs/lucide-react.mjs";
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
const FUNCTION_URL = "https://phguxgdqwrysvjdkzzxn.supabase.co/functions/v1/audio-stream";
function AudioPlayer({
  driveFileId
}) {
  const audioRef = reactExports.useRef(null);
  const [playing, setPlaying] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [current, setCurrent] = reactExports.useState(0);
  const [audioLoading, setAudioLoading] = reactExports.useState(true);
  const [errored, setErrored] = reactExports.useState(null);
  const src = `${FUNCTION_URL}?fileId=${driveFileId}`;
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };
  const skip = (seconds) => {
    if (!audioRef.current) return;
    const next = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = next;
  };
  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-5 bg-background/40 rounded-xl border border-border/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef, src, onLoadedMetadata: (e) => {
      setDuration(e.target.duration);
      setAudioLoading(false);
    }, onTimeUpdate: (e) => {
      const t = e.target;
      setCurrent(t.currentTime);
      setProgress(t.currentTime / t.duration * 100);
    }, onEnded: () => setPlaying(false), onError: () => {
      setErrored("Não foi possível carregar este áudio.");
      setAudioLoading(false);
    }, preload: "metadata", onContextMenu: (e) => e.preventDefault() }),
    errored ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errored }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Verifique se a chave da API do Google Drive está configurada corretamente." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mb-2", children: audioLoading ? "Carregando áudio..." : `${fmt(current)} / ${fmt(duration)}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-border/40 rounded-full overflow-hidden mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gold/70 rounded-full transition-all", style: {
        width: `${progress}%`
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => skip(-15), disabled: audioLoading, "aria-label": "Voltar 15 segundos", className: "w-11 h-11 rounded-full border border-border/60 flex items-center justify-center hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: togglePlay, disabled: audioLoading, className: "w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center hover:bg-gold/30 transition-colors disabled:opacity-40", children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-6 w-6 text-gold" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-6 w-6 text-gold ml-0.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => skip(15), disabled: audioLoading, "aria-label": "Avançar 15 segundos", className: "w-11 h-11 rounded-full border border-border/60 flex items-center justify-center hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "h-5 w-5" }) })
      ] })
    ] })
  ] });
}
function GenesisAudiolivro() {
  const {
    user,
    profile,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [capitulos, setCapitulos] = reactExports.useState([]);
  const [loadingAudio, setLoadingAudio] = reactExports.useState(true);
  const [loadError, setLoadError] = reactExports.useState(null);
  const [playerAberto, setPlayerAberto] = reactExports.useState({});
  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    if (profile && !isAdmin) {
      navigate({
        to: "/dashboard"
      });
      return;
    }
  }, [user, profile, loading, isAdmin, navigate]);
  reactExports.useEffect(() => {
    if (!user || !isAdmin) return;
    (async () => {
      const {
        data,
        error
      } = await supabase.from("audiobooks").select("*").order("order_index", {
        ascending: true
      });
      if (error) setLoadError(error.message);
      else if (data) setCapitulos(data);
      setLoadingAudio(false);
    })();
  }, [user, isAdmin]);
  if (loading || !user || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-6 py-12 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audiolivros", className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold transition-colors mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Áudio Livros"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl gold-text-gradient", children: "Gênesis — A Criação e a Queda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 font-serif italic", children: loadingAudio ? "Carregando..." : `${capitulos.length} capítulo${capitulos.length !== 1 ? "s" : ""}` })
      ] }),
      loadingAudio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Carregando capítulos..." }),
      !loadingAudio && loadError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-destructive text-center py-6", children: [
        "Erro: ",
        loadError
      ] }),
      !loadingAudio && !loadError && capitulos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Nenhum capítulo ainda." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: capitulos.map((cap) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-card/40 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
          cap.is_new && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded-full", children: "Novidade" }),
          cap.admin_only && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs bg-muted/40 text-muted-foreground border border-border/40 px-2 py-0.5 rounded-full flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
            " Admin"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg", children: cap.title }),
        cap.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: cap.description }),
        !playerAberto[cap.id] ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "mt-4", onClick: () => setPlayerAberto((prev) => ({
          ...prev,
          [cap.id]: true
        })), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 mr-2" }),
          " Mostrar player"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayer, { driveFileId: cap.drive_file_id })
      ] }, cap.id)) })
    ] }) })
  ] });
}
export {
  GenesisAudiolivro as component
};
