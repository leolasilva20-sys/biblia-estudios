import { useCallback, useEffect, useRef, useState } from "react";
import { gerarNarracao } from "@/lib/tts.functions";

/**
 * Narração por IA (texto -> áudio mp3 gerado no servidor).
 * Divide o texto em blocos, gera o áudio de cada bloco e toca em sequência
 * com um elemento <audio>. Funciona em qualquer dispositivo, inclusive
 * Android/TalkBack, sem depender de voz instalada no aparelho.
 */

function splitText(text: string, limit = 900): string[] {
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

export function useNarracao() {
  const [falando, setFalando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1);
  const canceladoRef = useRef(false);

  const parar = useCallback(() => {
    canceladoRef.current = true;
    chunksRef.current = [];
    indexRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setFalando(false);
    setPausado(false);
    setCarregando(false);
  }, []);

  useEffect(() => () => parar(), [parar]);

  const tocarProximo = useCallback(async () => {
    if (canceladoRef.current) return;
    const texto = chunksRef.current[indexRef.current];
    if (texto === undefined) {
      setFalando(false);
      setPausado(false);
      return;
    }

    setCarregando(true);
    const resultado = await gerarNarracao({ data: { texto } });
    if (canceladoRef.current) return;
    setCarregando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      setFalando(false);
      setPausado(false);
      return;
    }

    const audio = new Audio(resultado.audio);
    audio.playbackRate = rateRef.current;
    audioRef.current = audio;
    audio.onended = () => {
      indexRef.current += 1;
      void tocarProximo();
    };
    audio.onerror = () => {
      setErro("Não consegui tocar o áudio gerado.");
      setFalando(false);
      setPausado(false);
    };
    try {
      await audio.play();
    } catch {
      setErro("Toque em Ouvir novamente para iniciar o áudio.");
      setFalando(false);
    }
  }, []);

  const ouvir = useCallback(
    async (texto: string, velocidade = 1) => {
      setErro(null);
      parar();
      canceladoRef.current = false;
      rateRef.current = velocidade;
      chunksRef.current = splitText(texto);
      indexRef.current = 0;
      if (chunksRef.current.length === 0) return;
      setFalando(true);
      setPausado(false);
      await tocarProximo();
    },
    [parar, tocarProximo],
  );

  const pausarOuContinuar = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setPausado(false);
    } else {
      audio.pause();
      setPausado(true);
    }
  }, []);

  const mudarVelocidade = useCallback((v: number) => {
    rateRef.current = v;
    if (audioRef.current) audioRef.current.playbackRate = v;
  }, []);

  return { ouvir, parar, pausarOuContinuar, mudarVelocidade, falando, pausado, carregando, erro };
}
