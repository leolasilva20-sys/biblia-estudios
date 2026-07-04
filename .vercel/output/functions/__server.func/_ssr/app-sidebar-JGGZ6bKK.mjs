import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useRouterState, L as Link } from "../_libs/tanstack__react-router.mjs";
import { useAuth } from "./router-_tRA0p-q.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-_RcPDcoa.mjs";
import { B as BookOpen, M as Menu, X, F as FileText, a as Music, S as Shield } from "../_libs/lucide-react.mjs";
const NAV_ITEMS = [
  { to: "/dashboard", label: "Apostilas", icon: BookOpen },
  { to: "/responder", label: "Exercícios", icon: FileText }
];
const ADMIN_ONLY_ITEMS = [
  { to: "/audiolivros", label: "Áudio Livros", icon: Music }
];
function AppSidebar() {
  const { user, profile, signOut } = useAuth();
  useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const isAdmin = !!profile?.nivel_admin && profile.nivel_admin !== "nenhum";
  const initial = (profile?.full_name ?? user?.email ?? "?").trim().charAt(0).toUpperCase();
  const isActive = (path) => currentPath === path || currentPath.startsWith(path + "/");
  const NavLink = ({ to, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      onClick: () => setMobileOpen(false),
      "aria-label": label,
      className: `flex items-center gap-3 px-4 py-3.5 rounded-lg text-base transition-colors ${isActive(to) ? "bg-gold/15 text-gold font-medium" : "text-foreground/70 hover:text-foreground hover:bg-muted/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 flex-shrink-0" }),
        label
      ]
    }
  );
  const SidebarContent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 px-3 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-gold" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg gold-text-gradient", children: "Bíblia Estúdios" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 px-2 space-y-1 overflow-y-auto", children: [
      NAV_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { ...item }, item.to)),
      isAdmin && ADMIN_ONLY_ITEMS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { ...item }, item.to)),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(NavLink, { to: "/admin", label: "Painel Admin", icon: Shield })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-3 border-t border-border/40 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/perfil",
        onClick: () => setMobileOpen(false),
        className: "flex items-center gap-3 px-4 py-4 rounded-lg hover:bg-muted/40 transition-colors border border-border/40",
        "aria-label": "Ir para meu perfil",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9 border border-border/60 flex-shrink-0", children: [
            profile?.avatar_url && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-sm", children: initial })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium text-foreground", children: "Perfil" })
        ]
      }
    ) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center justify-between px-4 h-14 border-b border-border/60 bg-background/90 backdrop-blur sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg gold-text-gradient", children: "Bíblia Estúdios" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setMobileOpen(true),
          "aria-label": "Abrir menu de navegação",
          className: "p-2 -mr-2 rounded-lg hover:bg-muted/40",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-7 w-7" })
        }
      )
    ] }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden fixed inset-0 z-50 flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 bg-background border-r border-border/60 h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end px-2 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMobileOpen(false), "aria-label": "Fechar menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-black/50", onClick: () => setMobileOpen(false) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden md:flex md:flex-col w-64 border-r border-border/60 h-screen sticky top-0 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {}) })
  ] });
}
export {
  AppSidebar as A
};
