// Supabase Edge Function: audio-stream
// Faz proxy do arquivo de áudio do Google Drive usando a API oficial,
// escondendo o link direto do Drive e evitando exposição da chave de API no frontend.

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const fileId = url.searchParams.get("fileId");

    if (!fileId) {
      return new Response(JSON.stringify({ error: "fileId é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_DRIVE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Chave da API do Google Drive não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;

    const range = req.headers.get("range");
    const driveResponse = await fetch(driveUrl, {
      headers: range ? { Range: range } : {},
    });

    if (!driveResponse.ok && driveResponse.status !== 206) {
      return new Response(JSON.stringify({ error: "Não foi possível carregar o áudio" }), {
        status: driveResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set("Content-Type", driveResponse.headers.get("Content-Type") ?? "audio/mpeg");
    responseHeaders.set("Accept-Ranges", "bytes");
    const contentRange = driveResponse.headers.get("Content-Range");
    if (contentRange) responseHeaders.set("Content-Range", contentRange);
    const contentLength = driveResponse.headers.get("Content-Length");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);
    // Impede que o navegador ofereça "Salvar como" automaticamente
    responseHeaders.set("Content-Disposition", "inline");

    return new Response(driveResponse.body, {
      status: driveResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
