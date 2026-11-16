import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGmailComposeUrl, buildMailtoUrl, emailBodyFromMarkdown } from "./email-compose.ts";

test("Gmail coloca todos os destinatários somente em cópia oculta", () => {
  const url = new URL(buildGmailComposeUrl("Novidade", "Olá", ["um@example.com", "dois@example.com"]));
  assert.equal(url.searchParams.get("bcc"), "um@example.com,dois@example.com");
  assert.equal(url.searchParams.get("to"), null);
});

test("Gmail mantém assunto e transforma links em texto legível", () => {
  const url = new URL(buildGmailComposeUrl("Grande notícia", "Olá **pessoal**\n\n[Estude agora](https://example.com/estudo)", ["um@example.com"]));
  assert.equal(url.searchParams.get("su"), "Grande notícia");
  assert.equal(url.searchParams.get("body"), "Olá pessoal\n\nEstude agora: https://example.com/estudo");
});

test("aplicativo de e-mail recebe CCO, assunto e corpo", () => {
  const url = new URL(buildMailtoUrl("Notícia", "Mensagem", ["um@example.com", "dois@example.com"]));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.searchParams.get("bcc"), "um@example.com,dois@example.com");
  assert.equal(url.searchParams.get("subject"), "Notícia");
  assert.equal(url.searchParams.get("body"), "Mensagem");
  assert.equal(emailBodyFromMarkdown("**Texto**"), "Texto");
});
