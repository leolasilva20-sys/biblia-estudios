# Architecture

- Generate the public static sitemap from required route-level staticData.sitemap decisions; exclude authenticated areas and regenerate public/sitemap.xml when public routes change, because server request inventories can omit page options.

- Books use the existing access hook and browser Supabase client; mount suspense queries only after access is ready, matching the existing external backend without changing its schema.
- Keep book Markdown parsing and pagination in a pure module; render text with react-markdown without raw HTML to preserve accessibility and avoid executing document markup.
- Scope reader theme, font and animation styles to the books area so other pages remain unchanged.