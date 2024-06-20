import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";

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
