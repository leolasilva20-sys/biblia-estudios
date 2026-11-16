import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles, Mail, Link2, X, Newspaper, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { melhorarNoticia } from "@/lib/news.functions";
import { buildGmailComposeUrl, buildMailtoUrl } from "@/lib/email-compose";

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
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [busca, setBusca] = useState("");
  const [assunto, setAssunto] = useState("");
  const [texto, setTexto] = useState("");
  const [links, setLinks] = useState<{ titulo: string; url: string }[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoUrl, setNovoUrl] = useState("");
  const [melhorando, setMelhorando] = useState(false);

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
    setMelhorando(true);
    try {
      const r = await melhorar({ data: { token: await token(), assunto, texto, links } });
      if (r.ok) { setTexto(r.texto); toast.success("Texto melhorado com IA"); }
      else toast.error(r.erro);
    } catch (e) { toast.error((e as Error).message); }
    setMelhorando(false);
  };

  const validar = () => {
    if (!assunto.trim() || !texto.trim()) {
      toast.error("Preencha assunto e notícia");
      return false;
    }
    if (sel.size === 0) {
      toast.error("Selecione ao menos um e-mail");
      return false;
    }
    return true;
  };

  const corpoEmail = () => links.length && !links.every((l) => texto.includes(l.url))
    ? `${texto}\n\n${links.map((l) => `[${l.titulo || l.url}](${l.url})`).join("\n")}`
    : texto;

  const abrirGmail = () => {
    if (!validar()) return;
    const url = buildGmailComposeUrl(assunto, corpoEmail(), [...sel]);
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null;
    else window.location.href = url;
    toast.success("Mensagem preparada no Gmail. Revise e toque em Enviar.");
  };

  const abrirAplicativo = () => {
    if (!validar()) return;
    window.location.href = buildMailtoUrl(assunto, corpoEmail(), [...sel]);
    toast.success("Mensagem preparada no seu aplicativo de e-mail.");
  };

  const copiarEmails = async () => {
    if (sel.size === 0) return toast.error("Selecione ao menos um e-mail");
    try {
      await navigator.clipboard.writeText([...sel].join(", "));
      toast.success(`${sel.size} endereço(s) copiado(s) para cópia oculta`);
    } catch {
      toast.error("Não foi possível copiar. Tente abrir diretamente no Gmail.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-gold/30 bg-gold/10 p-2.5">
          <Newspaper className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h2 className="font-serif text-2xl gold-text-gradient">Bíblia Estúdios Notícias</h2>
          <p className="text-sm text-muted-foreground">Escreva uma vez e prepare o envio para quem você escolher.</p>
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm text-muted-foreground">
        <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
        <p>Todos entram em <strong className="text-foreground">cópia oculta (CCO/BCC)</strong>: ninguém verá o endereço dos outros. O Gmail abrirá a mensagem pronta e você só precisará confirmar o envio.</p>
      </div>

      <section className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-serif text-lg text-gold">Destinatários ({sel.size} de {pessoas.length})</h3>
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

        <div className="flex gap-2 flex-wrap border-t border-border/40 pt-4">
          <Button variant="outline" onClick={onMelhorar} disabled={melhorando}>
            <Sparkles className="h-4 w-4 mr-1" /> {melhorando ? "Melhorando..." : "Deixar profissional com IA"}
          </Button>
          <Button variant="outline" onClick={copiarEmails}>
            <Copy className="h-4 w-4 mr-1" /> Copiar e-mails
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={abrirGmail} className="bg-gold text-primary-foreground hover:opacity-90">
            <ExternalLink className="h-4 w-4 mr-1" /> Abrir Gmail com {sel.size} em CCO
          </Button>
          <Button variant="outline" onClick={abrirAplicativo}>
            <Mail className="h-4 w-4 mr-1" /> Abrir app de e-mail
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Se houver muitos destinatários e o aplicativo não abrir a mensagem completa, use “Copiar e-mails” e cole no campo CCO/BCC do Gmail.</p>
      </section>
    </div>
  );
}
