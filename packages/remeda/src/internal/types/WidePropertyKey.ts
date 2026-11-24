/**
 * The wide key (`string`, `number`, or `symbol`) that is assignable to `Key`,
 * or `never` when none is. Unlike `IsBounded`, it checks assignability, not
 * whether `Key` is literal: template literals and branded strings give `never`.
 *
 * @see IsBounded
 */
export type WidePropertyKey<Key> = string extends Key
  ? string
  : number extends Key
    ? number
    : symbol extends Key
      ? symbol
      : never;
