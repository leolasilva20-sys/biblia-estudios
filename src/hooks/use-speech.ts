import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Narração acessível com Web Speech API.
 * - espera o carregamento assíncrono das vozes (Chrome/Android)
 * - escolhe uma voz pt-BR quando existir
 * - divide o texto em blocos curtos (limite de ~200 caracteres por utterance
 *   evita o bug em que a fala para sozinha depois de alguns segundos)
 * - mantém um "keep alive" com resume() enquanto fala
 */

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

async function loadVoices(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const existing = synth.getVoices();
  if (existing.length > 0) return existing;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(synth.getVoices()), 2000);
    synth.addEventListener(
      "voiceschanged",
      () => {
        clearTimeout(timer);
        resolve(synth.getVoices());
      },
      { once: true },
    );
  });
}

function splitText(text: string, limit = 200): string[] {
  const pieces = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?;:])\s+/)
    .filter(Boolean);

  const chunks: string[] = [];
  let buffer = "";
  for (const piece of pieces) {
    if (piece.length > limit) {
      if (buffer) {
        chunks.push(buffer.trim());
        buffer = "";
      }
      for (const word of piece.split(" ")) {
        if ((buffer + " " + word).trim().length > limit) {
          chunks.push(buffer.trim());
          buffer = word;
        } else {
          buffer = (buffer + " " + word).trim();
        }
      }
      continue;
    }
    if ((buffer + " " + piece).trim().length > limit) {
      chunks.push(buffer.trim());
      buffer = piece;
    } else {
      buffer = (buffer + " " + piece).trim();
    }
  }
  if (buffer.trim()) chunks.push(buffer.trim());
  return chunks;
}

export function useSpeech() {
  const [falando, setFalando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [suportado, setSuportado] = useState(true);

  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSuportado(!!getSynth());
  }, []);

  const clearKeepAlive = () => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  };

  const parar = useCallback(() => {
    const synth = getSynth();
    clearKeepAlive();
    chunksRef.current = [];
    indexRef.current = 0;
    if (synth) synth.cancel();
    setFalando(false);
    setPausado(false);
  }, []);

  useEffect(() => () => parar(), [parar]);

  const speakNext = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    const texto = chunksRef.current[indexRef.current];
    if (texto === undefined) {
      clearKeepAlive();
      setFalando(false);
      setPausado(false);
      return;
    }

    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    u.rate = rateRef.current;
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onend = () => {
      indexRef.current += 1;
      speakNext();
    };
    u.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      setErro(
        "Não consegui usar a voz do dispositivo. Verifique se há uma voz em português instalada nas configurações do aparelho.",
      );
      clearKeepAlive();
      setFalando(false);
      setPausado(false);
    };
    synth.speak(u);
  }, []);

  const ouvir = useCallback(
    async (texto: string, velocidade = 1) => {
      const synth = getSynth();
      if (!synth) {
        setSuportado(false);
        setErro("Seu navegador não oferece narração por voz.");
        return;
      }
      setErro(null);
      synth.cancel();

      const voices = await loadVoices(synth);
      voiceRef.current =
        voices.find((v) => v.lang?.toLowerCase().startsWith("pt-br")) ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("pt")) ??
        null;

      rateRef.current = velocidade;
      chunksRef.current = splitText(texto);
      indexRef.current = 0;

      if (chunksRef.current.length === 0) return;

      setFalando(true);
      setPausado(false);
      speakNext();

      clearKeepAlive();
      keepAliveRef.current = setInterval(() => {
        const s = getSynth();
        if (!s) return;
        if (s.speaking && !s.paused) s.resume();
      }, 8000);
    },
    [speakNext],
  );

  const pausarOuContinuar = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    if (synth.paused) {
      synth.resume();
      setPausado(false);
    } else {
      synth.pause();
      setPausado(true);
    }
  }, []);

  return { ouvir, parar, pausarOuContinuar, falando, pausado, erro, suportado };
}
