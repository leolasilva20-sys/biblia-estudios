import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/audiolivros")({
  head: () => ({ meta: [{ title: "Áudio Dramas — Bíblia Estúdios" }] }),
  component: () => <Navigate to="/audiolivros/genesis" replace />,
});
