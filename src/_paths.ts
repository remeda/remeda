export type Path<
  Obj,
  Prefix extends Array<PropertyKey> = [],
> = Obj extends Primitive
  ? Prefix
  : Obj extends Array<infer Item>
    ? Path<Item, [...Prefix, number]> | Prefix
    : PathsOfObject<Obj, Prefix> | Prefix;

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

export type SupportsValueAtPath<Obj, P extends Array<PropertyKey>, Value> =
  Value extends ValueAtPath<Obj, P> ? Obj : never;

type Primitive = boolean | number | string | symbol | null | undefined;
