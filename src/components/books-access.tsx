import { Component, Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { useRequireAccess } from "@/hooks/use-require-access";

class BooksErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return (
      <div className="mx-auto max-w-xl space-y-5 py-12">
        <h1 className="font-serif text-3xl">Não foi possível abrir os livros</h1>
        <p role="alert" className="text-foreground">{this.state.error.message}</p>
        <Button className="min-h-12 focus-visible:ring-2" onClick={() => { this.props.onReset(); this.setState({ error: null }); }}>Tentar de novo</Button>
      </div>
    );
    return this.props.children;
  }
}

export function BooksAccess({ children }: { children: (userId: string, isAdmin: boolean) => ReactNode }) {
  const { ready, user, profile, loading } = useRequireAccess();
  return (
    <div className="books-area min-h-screen md:flex">
      <AppSidebar />
      <main className="min-w-0 flex-1 px-4 py-8 md:px-8" aria-label="Livros">
        {!ready || !user || !profile ? (
          <p role="status" className="py-12 text-muted-foreground">{loading || !profile ? "Carregando seu acesso…" : "Verificando seu acesso…"}</p>
        ) : (
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <BooksErrorBoundary onReset={reset}>
                <Suspense fallback={<p role="status" className="py-12 text-muted-foreground">Carregando livro…</p>}>
                  {children(user.id, !!profile.nivel_admin && profile.nivel_admin !== "nenhum")}
                </Suspense>
              </BooksErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        )}
      </main>
    </div>
  );
}