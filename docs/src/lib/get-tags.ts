import type { DocumentedFunction } from "./transform";

export function getTags({
  methods: [method],
}: DocumentedFunction): ReadonlyArray<string> {
  const { pipeable = false } = method ?? {};

  const out = [];

  if (pipeable) {
    out.push("pipeable");
  }

  return out;
}
