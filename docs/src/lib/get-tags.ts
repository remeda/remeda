export type Tag = "Lazy" | "Indexed" | "Strict";

export type SourceTags = Readonly<
  Partial<Record<"pipeable" | "strict" | "indexed" | "lazy", boolean>>
>;

export function getTags([
  method,
]: ReadonlyArray<SourceTags>): ReadonlyArray<Tag> {
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

  if (method.pipeable ?? method.lazy) {
    out.push("Lazy");
  }

  return out;
}
