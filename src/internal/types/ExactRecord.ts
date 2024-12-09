import type { IfBoundedRecord } from "./IfBoundedRecord";

// Records with an unbounded set of keys have different semantics to those with
// a bounded set of keys when using 'noUncheckedIndexedAccess', the former
// being implicitly `Partial` whereas the latter are implicitly `Required`.
export type ExactRecord<Key extends PropertyKey, Value> = IfBoundedRecord<
  Record<Key, Value>,
  // If the key is bounded, e.g. 'cat' | 'dog', the result is partial
  // because we can't statically know what values the mapper would return on
  // a specific input.
  Partial<Record<Key, Value>>,
  // If the key is unbounded, it means that Key is at least as wide
  // as them, so we don't need to wrap the returned record with Partial.
  Record<Key, Value>
>;
