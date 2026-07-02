import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://phguxgdqwrysvjdkzzxn.supabase.co";

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ3V4Z2Rxd3J5c3ZqZGt6enhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTY4MDAsImV4cCI6MjA5NTY3MjgwMH0.J2fZuaSbsX_0McUmNJXNxpyD71lUdV4aGkmV5z_VfqQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // @ts-expect-error - opcao experimental de passkeys ainda nao tipada no pacote instalado
  experimental: {
    passkey: true,
  },
});

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  nivel_admin: "nenhum" | "junior" | "admin" | string;
  acesso_liberado: boolean;
  created_at: string;
};

export type Apostila = {
  id: string;
  module_id: string;
  nivel: "iniciante" | "intermediario" | "avancado" | "especialista" | "consolidacao";
  titulo: string;
  drive_id: string;
  drive_type: "doc" | "pdf";
  ordem: number;
};
