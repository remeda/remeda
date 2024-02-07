import type DATA from "../../build/data.json";

export function getTags({
  methods: [method],
}: (typeof DATA)[number]): ReadonlyArray<string> {
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
