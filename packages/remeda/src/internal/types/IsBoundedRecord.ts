import type { KeysOfUnion } from "type-fest";
import type { IsBounded } from "./IsBounded";

/**
 * Check if a type is guaranteed to be a bounded record: a record with a finite
 * set of keys.
 *
 * @example
 *   IfBoundedRecord<{ a: 1, 1: "a" }>; //=> true
 *   IfBoundedRecord<Record<string | number, unknown>>; //=> false
 *   IfBoundedRecord<Record<`prefix_${number}`, unknown>>; //=> false
 */
export type IsBoundedRecord<T> = IsBounded<KeysOfUnion<T>>;
