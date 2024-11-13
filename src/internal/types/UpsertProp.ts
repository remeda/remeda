import type { IsLiteral, Simplify, Writable } from "type-fest";
import type { IsUnion } from "./IsUnion";

export type UpsertProp<T, K extends PropertyKey, V> = Simplify<
  // Copy any uninvolved props from the object, they are unaffected by the type.
  Omit<T, K> &
    // Rebuild the object for the rest:
    (IsSingleLiteral<K> extends true
      ? // the value as we know this prop would be exactly this value in the
        // output.
        Writable<Required<Record<K, V>>>
      : // ('cat' | 'dog') so we can't say anything for sure, we need to narrow
        // the types of all relevant props, this has 2 parts, for props already
        // in the object this means the value _might_ change, or it might not.
        {
          -readonly [P in keyof T as P extends K ? P : never]: T[P] | V;
        } & {
          // And for new props they might have been added to the object, or they
          // might not have been, so we need to set them as optional.
          -readonly [P in K as P extends keyof T ? never : P]?: V;
        })
>;

// This type attempts to detect when a type is a single literal value (e.g.
// "cat"), and not anything else (e.g. "cat" | "dog", string, etc...)
type IsSingleLiteral<K> =
  IsLiteral<K> extends true ? (IsUnion<K> extends true ? false : true) : false;
