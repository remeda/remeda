import type { DocumentedFunction } from "./transform";

export function getTags({
  methods: [method],
}: DocumentedFunction): ReadonlyArray<string> {
  const { pipeable = false, indexed = false, strict = false } = method ?? {};

  const out = [];

  if (pipeable) {
    out.push("pipeable");
  }

  if (indexed) {
    out.push("indexed");
  }

  if (strict) {
    out.push("strict");
  }

  return out;
}
