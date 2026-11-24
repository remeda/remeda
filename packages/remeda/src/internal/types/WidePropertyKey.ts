/**
 * The wide key (`string`, `number`, or `symbol`) that `Key` includes, or
 * `never` when it is made of literal keys only.
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
