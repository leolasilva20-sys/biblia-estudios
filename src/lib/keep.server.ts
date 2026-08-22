const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://phguxgdqwrysvjdkzzxn.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ3V4Z2Rxd3J5c3ZqZGt6enhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTY4MDAsImV4cCI6MjA5NTY3MjgwMH0.J2fZuaSbsX_0McUmNJXNxpyD71lUdV4aGkmV5z_VfqQ";

/** Valida o token do usuário e devolve o id dele. */
export async function requireUserId(accessToken: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Não autenticado.");
  const user = (await res.json()) as { id?: string };
  if (!user.id) throw new Error("Não autenticado.");
  return user.id;
}

/**
 * Token de acesso do Google Keep.
 * Aceita GOOGLE_KEEP_ACCESS_TOKEN direto, ou a tríade
 * GOOGLE_KEEP_CLIENT_ID / GOOGLE_KEEP_CLIENT_SECRET / GOOGLE_KEEP_REFRESH_TOKEN.
 * Retorna null quando o segredo ainda não foi configurado.
 */
export async function getKeepAccessToken(): Promise<string | null> {
  const direct = process.env.GOOGLE_KEEP_ACCESS_TOKEN;
  if (direct) return direct;

  const clientId = process.env.GOOGLE_KEEP_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_KEEP_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_KEEP_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("Falha ao autenticar no Google Keep.");
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

export const KEEP_API = "https://keep.googleapis.com/v1";

export function prefixFor(userId: string) {
  return `[BE:${userId}]`;
}
