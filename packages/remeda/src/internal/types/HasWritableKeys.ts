import type { IsEqual } from "type-fest";

// TODO [>2]: type-fest's version of this utility type fails on TypeScript versions before 5.3 on inputs that have a readonly index signature, e.g., `Readonly<Record<string, string>>`. Once our minimal TypeScript version is past that version we can remove this workaround.
export type HasWritableKeys<T> = IsEqual<{ -readonly [P in keyof T]: T[P] }, T>;
