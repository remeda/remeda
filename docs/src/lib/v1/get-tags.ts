import type { Tag } from "../get-tags";
import type { DocumentedFunction } from "./transform";

export function getTags({
  methods: [method],
}: DocumentedFunction): ReadonlyArray<Tag> {
  if (method === undefined) {
    return [];
  }

  const out: Array<Tag> = [];

  if (method.strict) {
    out.push("strict");
  }

  if (method.indexed) {
    out.push("indexed");
  }

  if (method.pipeable) {
    out.push("lazy");
  }

  return out;
}
