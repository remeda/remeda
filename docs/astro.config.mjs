import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { transformerTwoslash } from "@shikijs/twoslash";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://remedajs.com",

  markdown: {
    shikiConfig: {
      transformers: [transformerTwoslash()],
    },
  },

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],
});
