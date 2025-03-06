import type { APIRoute } from "astro";

const CONTENT_TYPE = "text/plain; charset=utf-8";

const ROBOTS_TXT = `
User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () =>
  new Response(ROBOTS_TXT, { headers: { "Content-Type": CONTENT_TYPE } });
