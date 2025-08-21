import type { IsEqual } from "type-fest";

// TODO [>2]: type-fest's version of this utility type fails on TypeScript versions before 5.3 on inputs that have a readonly index signature, e.g., `Readonly<Record<string, string>>`. Once our minimal TypeScript version is past that version we can remove this workaround.
export type HasWritableKeys<T> =
  // If making all props of the type readonly doesn't change anything about it
  // it means that none of it's props are **not** readonly, so it doesn't have
  // any mutable/writable keys
  IsEqual<Readonly<T>, T> extends true ? false : true;
