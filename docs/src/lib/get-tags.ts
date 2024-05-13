import type { DocumentedFunction } from "./transform";

export type Tag = "Lazy" | "Indexed" | "Strict";

export const getTags = ({
  methods: [method],
}: DocumentedFunction): ReadonlyArray<Tag> =>
  method?.pipeable ?? false ? ["Lazy"] : [];
