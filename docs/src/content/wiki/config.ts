import { defineCollection } from "astro:content";

export const collections = {
  wiki: defineCollection({ type: "content" }),
};
