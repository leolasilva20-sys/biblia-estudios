import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryHistory } from "@tanstack/react-router";
import { getRouter } from "../router";
import { sitemapStaticPaths, sitemapXML } from "./sitemap";

describe("Public sitemap", () => {
  test("includes only landing, terms, privacy and documentation, never login or private pages", async () => {
    const router = getRouter();
    router.update({ context: router.options.context, history: createMemoryHistory({ initialEntries: ["/"] }) });
    await router.load();
    assert.deepEqual(sitemapStaticPaths(router), ["/", "/documentacao", "/privacidade", "/termos"]);
  });

  test("uses the published origin without invented modification timestamps", () => {
    const xml = sitemapXML("https://biblia-estudios.lovable.app", [{ path: "/" }]);
    assert.ok(xml.includes("<loc>https://biblia-estudios.lovable.app/</loc>"));
    assert.ok(!xml.includes("<lastmod>"));
  });
});