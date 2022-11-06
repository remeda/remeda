import { Key } from './_types';

export type Path<Obj, Prefix extends Key[] = []> = Obj extends Primitive
  ? Prefix
  : Obj extends Array<infer Item>
  ? Prefix | Path<Item, [...Prefix, number]>
  : Prefix | PathsOfObject<Obj, Prefix>;

type PathsOfObject<Obj, Prefix extends Key[]> = {
  [K in keyof Obj]: Path<Obj[K], [...Prefix, K]>;
}[keyof Obj];

export type ValueAtPath<Obj, ObjPath extends Key[] = []> = ObjPath extends []
  ? Obj
  : ObjPath extends [infer Head, ...infer Tail extends Key[]]
  ? Head extends keyof Obj
    ? ValueAtPath<Obj[Head], Tail>
    : never
  : never;

export type SupportsValueAtPath<
  Obj,
  Path extends Key[],
  Value
> = Value extends ValueAtPath<Obj, Path> ? Obj : never;

type Primitive = string | number | boolean | null | undefined | symbol;

// Can't represent a symbol in a string path
type StringPathKey = string | number;

export type PathToString<
  T extends Key[],
  Prefix extends string = ''
> = T extends []
  ? Prefix
  : T extends [
      infer Head extends StringPathKey,
      ...infer Tail extends StringPathKey[]
    ]
  ? Prefix extends ''
    ? Head extends number
      ? PathToString<Tail, `${Head}` | `[${Head}]`>
      : PathToString<Tail, `${Head}`>
    : Head extends number
    ? PathToString<Tail, `${Prefix}[${Head}]` | `${Prefix}.${Head}`>
    : PathToString<Tail, `${Prefix}.${Head}`>
  : never;

type WithNumbers<T extends string> = T extends `${infer Num extends number}`
  ? Num
  : T;

export type StringToPath<T extends string> = T extends ''
  ? []
  : T extends `[${infer Head}].${infer Tail}`
  ? [WithNumbers<Head>, ...StringToPath<Tail>]
  : T extends `.${infer Head}${infer Tail}`
  ? [WithNumbers<Head>, ...StringToPath<Tail>]
  : T extends `${infer Head}${infer Tail}`
  ? [WithNumbers<Head>, ...StringToPath<Tail>]
  : [WithNumbers<T>];

export type PathString<Obj> = PathToString<Path<Obj>>;

export const stringToPathArray = <T extends string>(
  path: T
): StringPathKey[] => {
  if (path.length === 0) return [];

  let match =
    path.match(/^\[(.+?)\](.*)$/) || path.match(/^\.?([^\.\[\]]+)(.*)$/);
  if (match) {
    const [_, key, rest] = match;
    return [/^\d+$/.test(key) ? Number(key) : key, ...stringToPathArray(rest)];
  }
  return [path];
};
