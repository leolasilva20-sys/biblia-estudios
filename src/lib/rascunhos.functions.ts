import { createServerFn } from "@tanstack/react-start";

export type Rascunho = {
  id: string;
  titulo: string;
  conteudo: string;
  atualizado_em: string;
};

type KeepNote = {
  name?: string;
  title?: string;
  createTime?: string;
  updateTime?: string;
  trashed?: boolean;
  body?: { text?: { text?: string } };
};

export const listarRascunhos = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string }) => input)
  .handler(async ({ data }) => {
    const { requireUserId, getKeepAccessToken, KEEP_API, prefixFor } = await import(
      "./keep.server"
    );
    const userId = await requireUserId(data.accessToken);
    const token = await getKeepAccessToken();
    if (!token) return { configurado: false as const, rascunhos: [] as Rascunho[] };

    const res = await fetch(`${KEEP_API}/notes?pageSize=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Google Keep respondeu ${res.status}.`);
    const json = (await res.json()) as { notes?: KeepNote[] };
    const prefix = prefixFor(userId);

    const rascunhos: Rascunho[] = (json.notes ?? [])
      .filter((n) => !n.trashed && (n.title ?? "").startsWith(prefix))
      .map((n) => ({
        id: n.name ?? "",
        titulo: (n.title ?? "").slice(prefix.length).trim() || "Sem título",
        conteudo: n.body?.text?.text ?? "",
        atualizado_em: n.updateTime ?? n.createTime ?? new Date().toISOString(),
      }))
      .sort((a, b) => b.atualizado_em.localeCompare(a.atualizado_em));

    return { configurado: true as const, rascunhos };
  });

export const criarRascunho = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string; titulo: string; conteudo: string }) => input)
  .handler(async ({ data }) => {
    const { requireUserId, getKeepAccessToken, KEEP_API, prefixFor } = await import(
      "./keep.server"
    );
    const userId = await requireUserId(data.accessToken);
    const token = await getKeepAccessToken();
    if (!token) return { configurado: false as const };

    const res = await fetch(`${KEEP_API}/notes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${prefixFor(userId)} ${data.titulo}`.trim(),
        body: { text: { text: data.conteudo } },
      }),
    });
    if (!res.ok) throw new Error(`Google Keep respondeu ${res.status}.`);
    return { configurado: true as const };
  });

export const apagarRascunho = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string; id: string }) => input)
  .handler(async ({ data }) => {
    const { requireUserId, getKeepAccessToken, KEEP_API, prefixFor } = await import(
      "./keep.server"
    );
    const userId = await requireUserId(data.accessToken);
    const token = await getKeepAccessToken();
    if (!token) return { configurado: false as const };

    // confere se a nota realmente pertence a este usuário
    const check = await fetch(`${KEEP_API}/${data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!check.ok) throw new Error("Rascunho não encontrado.");
    const note = (await check.json()) as KeepNote;
    if (!(note.title ?? "").startsWith(prefixFor(userId))) {
      throw new Error("Rascunho não encontrado.");
    }

    const res = await fetch(`${KEEP_API}/${data.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Google Keep respondeu ${res.status}.`);
    return { configurado: true as const };
  });
