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
