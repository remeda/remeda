import type { ConditionalSimplifyDeep } from './conditional-simplify';
import type { Merge } from './merge';
import type { OmitIndexSignature } from './omit-index-signature';
import type { PickIndexSignature } from './pick-index-signature';

type UnknownRecord = Record<string, unknown>;

/**
Deeply simplifies an object excluding iterables and functions. Used internally to improve the UX and accept both interfaces and type aliases as inputs.
*/
export type SimplifyDeep<Type> = ConditionalSimplifyDeep<
  Type,
  Function | Iterable<unknown>,
  object
>;

/**
Try to merge two record properties or return the source property value, preserving `undefined` properties values in both cases.
*/
type MergeDeepRecordProperty<Destination, Source> = undefined extends Source
  ?
      | MergeDeepOrReturn<
          Source,
          Exclude<Destination, undefined>,
          Exclude<Source, undefined>
        >
      | undefined
  : MergeDeepOrReturn<Source, Destination, Source>;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.
Rules:
1. If the source does not contain the key, the value of the destination is returned.
2. If the source contains the key and the destination does not contain the key, the value of the source is returned.
3. If both contain the key, try to merge according to the chosen {@link MergeDeepOptions options} or return the source if unable to merge.
*/
type DoMergeDeepRecord<
  Destination extends UnknownRecord,
  Source extends UnknownRecord,
> = {
  // Case in rule 1: The destination contains the key but the source doesn't.
  [Key in keyof Destination as Key extends keyof Source
    ? never
    : Key]: Destination[Key];
} & {
  // Case in rule 2: The source contains the key but the destination doesn't.
  [Key in keyof Source as Key extends keyof Destination
    ? never
    : Key]: Source[Key];
} & {
  // Case in rule 3: Both the source and the destination contain the key.
  [Key in keyof Source as Key extends keyof Destination
    ? Key
    : never]: MergeDeepRecordProperty<
    Key extends keyof Destination ? Destination[Key] : never,
    Source[Key]
  >;
};

/**
Wrapper around {@link DoMergeDeepRecord} which preserves index signatures.
*/
type MergeDeepRecord<
  Destination extends UnknownRecord,
  Source extends UnknownRecord,
> = DoMergeDeepRecord<
  OmitIndexSignature<Destination>,
  OmitIndexSignature<Source>
> &
  Merge<PickIndexSignature<Destination>, PickIndexSignature<Source>>;

/**
Try to merge two objects or two arrays/tuples recursively into a new type or return the default value.
*/
type MergeDeepOrReturn<DefaultType, Destination, Source> = SimplifyDeep<
  [undefined] extends [Destination | Source]
    ? DefaultType
    : Destination extends UnknownRecord
      ? Source extends UnknownRecord
        ? MergeDeepRecord<Destination, Source>
        : DefaultType
      : DefaultType
>;

export type MergeDeep<
  Destination extends UnknownRecord,
  Source extends UnknownRecord,
> = SimplifyDeep<
  MergeDeepRecord<SimplifyDeep<Destination>, SimplifyDeep<Source>>
>;
