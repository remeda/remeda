import type { DocumentedFunction } from "./transform";

export type Tag = "lazy" | "indexed" | "strict";

export const getTags = ({
  methods: [method],
}: DocumentedFunction): ReadonlyArray<Tag> =>
  method?.pipeable ?? false ? ["lazy"] : [];
