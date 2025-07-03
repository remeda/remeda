import type { KeysOfUnion } from "type-fest";
import type { IsBounded } from "./IsBounded";

/**
 * Check if a type is guaranteed to be a bounded record: a record with a finite
 * set of keys.
 *
 * See the docs for `IsBounded` to understand more.
 *
 * @example
 *   IsBoundedRecord<{ a: 1, 1: "a" }>; //=> true
 *   IsBoundedRecord<Record<string | number, unknown>>; //=> false
 *   IsBoundedRecord<Record<`prefix_${number}`, unknown>>; //=> false
 */
export type IsBoundedRecord<T> = IsBounded<KeysOfUnion<T>>;
