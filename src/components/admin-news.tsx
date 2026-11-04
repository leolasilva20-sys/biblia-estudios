import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Send, Link2, X, Newspaper } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { melhorarNoticia, enviarNoticia } from "@/lib/news.functions";

const PAGINAS = [
  { titulo: "Página inicial", url: "https://biblia-estudios.lovable.app/" },
  { titulo: "Apostilas", url: "https://biblia-estudios.lovable.app/dashboard" },
  { titulo: "Áudio Dramas", url: "https://biblia-estudios.lovable.app/audio-dramas" },
  { titulo: "Cursos", url: "https://biblia-estudios.lovable.app/cursos" },
  { titulo: "Meus cadernos", url: "https://biblia-estudios.lovable.app/cadernos" },
  { titulo: "Suporte", url: "https://biblia-estudios.lovable.app/suporte" },
];

export function AdminNews() {
  const melhorar = useServerFn(melhorarNoticia);
  const enviar = useServerFn(enviarNoticia);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [busca, setBusca] = useState("");
  const [assunto, setAssunto] = useState("");
  const [texto, setTexto] = useState("");
  const [links, setLinks] = useState<{ titulo: string; url: string }[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoUrl, setNovoUrl] = useState("");
  const [busy, setBusy] = useState<"ia" | "env" | null>(null);

  const { data: pessoas = [] } = useQuery({
    queryKey: ["admin", "emails"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("full_name, email").not("email", "is", null).order("full_name");
      if (error) throw error;
      const seen = new Set<string>();
      return (data as { full_name: string | null; email: string }[]).filter((p) => {
        const e = p.email.toLowerCase();
        if (seen.has(e)) return false;
        seen.add(e);
        return true;
      });
    },
  });

  const filtradas = useMemo(
    () => pessoas.filter((p) => `${p.full_name ?? ""} ${p.email}`.toLowerCase().includes(busca.toLowerCase())),
    [pessoas, busca],
  );
  const todos = pessoas.length > 0 && sel.size === pessoas.length;

  const token = async () => (await supabase.auth.getSession()).data.session?.access_token ?? "";

  const toggle = (e: string) => {
    const n = new Set(sel);
    if (n.has(e)) n.delete(e); else n.add(e);
    setSel(n);
  };

  const addLink = (titulo: string, url: string) => {
    try { new URL(url); } catch { return toast.error("Link inválido (use https://...)"); }
    setLinks((l) => [...l, { titulo, url }]);
    setNovoTitulo(""); setNovoUrl("");
  };

  const onMelhorar = async () => {
    if (!texto.trim()) return toast.error("Escreva a notícia primeiro");
    setBusy("ia");
    try {
      const r = await melhorar({ data: { token: await token(), assunto, texto, links } });
      if (r.ok) { setTexto(r.texto); toast.success("Texto melhorado com IA"); }
      else toast.error(r.erro);
    } catch (e) { toast.error((e as Error).message); }
    setBusy(null);
  };

  const onEnviar = async () => {
    if (!assunto.trim() || !texto.trim()) return toast.error("Preencha assunto e notícia");
    if (sel.size === 0) return toast.error("Selecione ao menos um e-mail");
    if (!confirm(`Enviar para ${sel.size} pessoa(s)?`)) return;
    setBusy("env");
    try {
      const corpo = links.length && !links.every((l) => texto.includes(l.url))
        ? `${texto}\n\n${links.map((l) => `[${l.titulo || l.url}](${l.url})`).join("\n")}`
        : texto;
      const r = await enviar({ data: { token: await token(), assunto, texto: corpo, emails: [...sel] } });
      if (r.falhas.length) toast.warning(`${r.enviados} enviados, ${r.falhas.length} falharam`);
      else toast.success(`Notícia enviada para ${r.enviados} pessoa(s)`);
    } catch (e) { toast.error((e as Error).message); }
    setBusy(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Newspaper className="h-6 w-6 text-gold" />
        <h2 className="font-serif text-2xl gold-text-gradient">Bíblia Estúdios Notícias</h2>
      </div>

      <section className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-serif text-gold">Destinatários ({sel.size} de {pessoas.length})</h3>
          <Button size="sm" variant="outline" onClick={() => setSel(todos ? new Set() : new Set(pessoas.map((p) => p.email)))}>
            {todos ? "Desmarcar todos" : "Selecionar todos"}
          </Button>
        </div>
        <Input placeholder="Buscar por nome ou e-mail..." value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar destinatário" />
        <div className="max-h-72 overflow-y-auto divide-y divide-border/40 rounded-md border border-border/40">
          {filtradas.map((p) => (
            <label key={p.email} className="flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-muted/30">
              <input type="checkbox" className="h-4 w-4 accent-[var(--gold)]" checked={sel.has(p.email)} onChange={() => toggle(p.email)} />
              <span className="font-medium">{p.full_name ?? "—"}</span>
              <span className="text-muted-foreground truncate">{p.email}</span>
            </label>
          ))}
          {filtradas.length === 0 && <div className="p-4 text-center text-muted-foreground text-sm">Nenhum e-mail encontrado.</div>}
        </div>
      </section>

      <section className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
        <Input placeholder="Assunto do e-mail" value={assunto} onChange={(e) => setAssunto(e.target.value)} aria-label="Assunto" />
        <Textarea rows={14} placeholder="Digite a grande notícia do Bíblia Estúdios..." value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Texto da notícia" />

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Links das páginas do site:</div>
          <div className="flex flex-wrap gap-2">
            {PAGINAS.map((p) => (
              <Button key={p.url} size="sm" variant="outline" onClick={() => addLink(p.titulo, p.url)}>
                <Link2 className="h-3 w-3 mr-1" /> {p.titulo}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Input className="flex-1 min-w-32" placeholder="Nome do link" value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} />
            <Input className="flex-[2] min-w-48" placeholder="https://..." value={novoUrl} onChange={(e) => setNovoUrl(e.target.value)} />
            <Button variant="outline" onClick={() => addLink(novoTitulo, novoUrl)}><Link2 className="h-4 w-4 mr-1" /> Adicionar link</Button>
          </div>
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {links.map((l, i) => (
                <li key={i} className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gold/15 text-gold border border-gold/30">
                  {l.titulo || l.url}
                  <button aria-label={`Remover link ${l.titulo}`} onClick={() => setLinks(links.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2 flex-wrap pt-2">
          <Button variant="outline" onClick={onMelhorar} disabled={busy !== null}>
            <Sparkles className="h-4 w-4 mr-1" /> {busy === "ia" ? "Melhorando..." : "Deixar profissional com IA"}
          </Button>
          <Button onClick={onEnviar} disabled={busy !== null} className="bg-gold text-primary-foreground hover:opacity-90">
            <Send className="h-4 w-4 mr-1" /> {busy === "env" ? "Enviando..." : `Enviar para ${sel.size}`}
          </Button>
        </div>
      </section>
    </div>
  );
}
