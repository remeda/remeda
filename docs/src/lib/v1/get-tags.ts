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
    out.push("Strict");
  }

  if (method.indexed) {
    out.push("Indexed");
  }

  if (method.pipeable) {
    out.push("Lazy");
  }

  return out;
}
