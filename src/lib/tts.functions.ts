import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TTS_MODEL = "google/gemini-3.1-flash-tts-preview";
const TTS_VOICE = "Kore";

/**
 * Gera narração em áudio a partir de um trecho de texto usando o gateway de
 * IA do Lovable (modelo Gemini TTS). Retorna data URL base64 (WAV) para tocar
 * no cliente com um elemento <audio>.
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
        model: TTS_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Leia em português brasileiro, com voz calma e clara, como uma narração de estudo bíblico: ${data.texto}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: TTS_VOICE },
            },
          },
        },
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
    return { ok: true as const, audio: `data:audio/wav;base64,${btoa(binary)}` };
  });
