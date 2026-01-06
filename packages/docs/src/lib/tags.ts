import { prop } from "remeda";
import type { BlockTag } from "./typedoc/schema";

export type Tag = "Lazy" | "Indexed" | "Strict";

export function extractTags(blockTags: readonly BlockTag[] | undefined) {
  const out: Tag[] = [];

  if (hasTag(blockTags, "strict")) {
    out.push("Strict");
  }

  if (hasTag(blockTags, "indexed")) {
    out.push("Indexed");
  }

  if (hasTag(blockTags, "pipeable") || hasTag(blockTags, "lazy")) {
    out.push("Lazy");
  }

  return out;
}

export const hasTag = (
  blockTags: readonly BlockTag[] | undefined,
  tagName: string,
): boolean => blockTags?.some(({ tag }) => tag === `@${tagName}`) ?? false;

export function tagContent(
  blockTags: readonly BlockTag[] | undefined,
  tagName: string,
): string | undefined {
  const tag = blockTags?.find(({ tag }) => tag === `@${tagName}`);
  if (tag === undefined) {
    return;
  }

  const { content } = tag;
  return content.length === 0 ? undefined : content.map(prop("text")).join("");
}
