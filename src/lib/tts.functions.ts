import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Gera narração em áudio (mp3) a partir de um trecho de texto usando o
 * gateway de IA do Lovable. Retorna data URL base64 para tocar no cliente.
 */
export const gerarNarracao = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ texto: z.string().min(1).max(4000) }).parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, erro: "Narração indisponível no momento." };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/tts-1",
        voice: "onyx",
        input: data.texto,
        response_format: "mp3",
      }),
    });

    if (!res.ok) {
      return {
        ok: false as const,
        erro: `Não consegui gerar o áudio agora (erro ${res.status}). Tente novamente.`,
      };
    }

    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return { ok: true as const, audio: `data:audio/mpeg;base64,${btoa(binary)}` };
  });
