import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://remedajs.com",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [
      visualizer({
        filename: "node_modules/.cache/bundleVisualizer.html",
      }),
    ],
  },
});
