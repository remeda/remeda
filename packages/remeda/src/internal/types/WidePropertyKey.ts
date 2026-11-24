/**
 * The wide primitive key (`string`, `number`, or `symbol`) that `Key` includes,
 * or `never` when `Key` is made of literal keys only. Template literals such as
 * `` `data-${string}` `` count as literal: they still limit which keys can be
 * used, so they can be checked against an object's keys. When `Key` includes
 * more than one wide key, `string` takes precedence over `number`, and
 * `number` over `symbol`.
 *
 * To check whether a set of keys is finite (template literals aren't), use
 * `IsBounded`.
 *
 * @example
 *   WidePropertyKey<string>; //=> string
 *   WidePropertyKey<"a" | number>; //=> number
 *   WidePropertyKey<"a" | "b">; //=> never
 */
export type WidePropertyKey<Key> = string extends Key
  ? string
  : number extends Key
    ? number
    : symbol extends Key
      ? symbol
      : never;
