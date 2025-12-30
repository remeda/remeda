/**
 * Type-fest's `Writeable` acts funny for complex types involving intersections
 * that redefine the same key, because of how it reconstructs the output type
 * keys eagerly. Instead, this type is based on the `Simplify` utility type
 * which avoids this problem.
 *
 * @see Writable
 * @see Simplify
 */
export type SimplifiedWritable<T> = {
  -readonly [KeyType in keyof T]: T[KeyType];
} & {};
