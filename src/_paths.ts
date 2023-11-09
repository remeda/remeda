export type Path<
  Obj,
  Prefix extends Array<PropertyKey> = [],
> = Obj extends Primitive
  ? Prefix
  : Obj extends Array<infer Item>
  ? Prefix | Path<Item, [...Prefix, number]>
  : Prefix | PathsOfObject<Obj, Prefix>;

type PathsOfObject<Obj, Prefix extends Array<PropertyKey>> = {
  [K in keyof Obj]: Path<Obj[K], [...Prefix, K]>;
}[keyof Obj];

export type ValueAtPath<
  Obj,
  ObjPath extends Array<PropertyKey> = [],
> = ObjPath extends []
  ? Obj
  : ObjPath extends [infer Head, ...infer Tail]
  ? Tail extends Array<PropertyKey>
    ? Head extends keyof Obj
      ? ValueAtPath<Obj[Head], Tail>
      : never
    : never
  : never;

export type SupportsValueAtPath<
  Obj,
  Path extends Array<PropertyKey>,
  Value,
> = Value extends ValueAtPath<Obj, Path> ? Obj : never;

type Primitive = string | number | boolean | null | undefined | symbol;
