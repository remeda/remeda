import type { Simplify } from "./type-fest/simplify";

export type PlainObject = Record<PropertyKey, unknown>;

export type AllUnionKeys<Union> = Union extends Union ? keyof Union : never;

// Used to ensure the type asserted by a type guard is recognized as a subtype of the original type.
export type EnsureExtends<T, U> = U extends T ? U : Simplify<T & U>;

type MakeKeyRequired<Obj, Prop extends keyof Obj> = Omit<Obj, Prop> & {
  // We need to both remove the optional modifier and exclude undefined.
  // This is because the `-?` modifier will only exclude undefined from the type if the property is optional,
  // which makes the behavior of the type inconsistent.
  // More info about this can be found here: https://github.com/microsoft/TypeScript/issues/31025
  // So excluding `undefined` explicitly also does this for required properties that include undefined.
  [key in Prop]-?: Exclude<Obj[key], undefined>;
};

type UnionMembersWithProp<Obj, Prop extends keyof Obj> = Extract<
  Obj,
  { [key in Prop]?: any }
>;

export type WithRequiredProp<Obj, Prop extends AllUnionKeys<Obj>> = Simplify<
  MakeKeyRequired<UnionMembersWithProp<Obj, Prop>, Prop>
>;

type ReplaceProp<Obj, Prop extends keyof Obj, NewType> = Omit<Obj, Prop> & {
  [key in Prop]: NewType;
};

export type WithPropOfType<
  Obj,
  Prop extends AllUnionKeys<Obj>,
  PropType extends AllPossiblePropValues<Obj, Prop>,
> = Simplify<ReplaceProp<UnionMembersWithProp<Obj, Prop>, Prop, PropType>>;

export type AllPossiblePropValues<
  Obj,
  Prop extends AllUnionKeys<Obj>,
> = Extract<WithRequiredProp<Obj, Prop>, { [key in Prop]: any }>[Prop];
