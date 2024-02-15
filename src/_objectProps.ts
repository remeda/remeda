import { Simplify } from './type-fest/simplify';

export type AllUnionKeys<Union> = Union extends Union ? keyof Union : never;

type MakeKeyRequired<Obj, Prop extends keyof Obj> = Obj & {
  [key in Prop]-?: Obj[key];
};

type IsArrayButNotTuple<Obj> = Obj extends [any, ...Array<any>]
  ? false
  : Obj extends Array<any>
    ? true
    : false;

export type WithRequiredProp<Obj, Prop extends AllUnionKeys<Obj>> =
  IsArrayButNotTuple<Obj> extends true
    ? Obj
    : Simplify<MakeKeyRequired<Extract<Obj, { [key in Prop]?: any }>, Prop>>;

export type WithPropOfType<
  Obj,
  Prop extends AllUnionKeys<Obj>,
  PropType extends AllPossiblePropValues<Obj, Prop>,
> = Simplify<
  Extract<Obj, { [key in Prop]?: any }> & {
    [key in Prop]: PropType;
  }
>;

export type AllPossiblePropValues<Obj, Prop extends AllUnionKeys<Obj>> = [
  IsArrayButNotTuple<Obj>,
  Prop,
] extends [true, number]
  ? Obj extends Array<any>
    ? Obj[number]
    : never
  : Extract<WithRequiredProp<Obj, Prop>, { [key in Prop]: any }>[Prop];
