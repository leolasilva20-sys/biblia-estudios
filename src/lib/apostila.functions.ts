import { createServerFn } from "@tanstack/react-start";

export type ApostilaTexto = {
  ok: boolean;
  paragrafos: string[];
  erro?: string;
};

export const getApostilaTexto = createServerFn({ method: "GET" })
  .inputValidator((data: { driveId: string }) => {
    if (!data || typeof data.driveId !== "string" || !/^[\w-]{10,}$/.test(data.driveId)) {
      throw new Error("driveId inválido");
    }
    return { driveId: data.driveId };
  })
  .handler(async ({ data }): Promise<ApostilaTexto> => {
    const url = `https://docs.google.com/document/d/${data.driveId}/export?format=txt`;
    try {
      const res = await fetch(url, { headers: { "cache-control": "no-cache" } });
      if (!res.ok) {
        return { ok: false, paragrafos: [], erro: `Documento indisponível (${res.status}).` };
      }
      const raw = await res.text();
      if (raw.trim().startsWith("<")) {
        return {
          ok: false,
          paragrafos: [],
          erro: "O documento não está compartilhado publicamente para leitura.",
        };
      }
      const paragrafos = raw
        .replace(/\r/g, "")
        .split(/\n{1,}/)
        .map((p) => p.replace(/\u00a0/g, " ").trim())
        .filter((p) => p.length > 0);
      if (paragrafos.length === 0) {
        return { ok: false, paragrafos: [], erro: "O documento está vazio." };
      }
      return { ok: true, paragrafos };
    } catch {
      return { ok: false, paragrafos: [], erro: "Não foi possível carregar o documento." };
    }
  });
