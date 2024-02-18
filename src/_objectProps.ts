import { Simplify } from './type-fest/simplify';

export type AllUnionKeys<Union> = Union extends Union ? keyof Union : never;

type MakeKeyRequired<Obj, Prop extends keyof Obj> = Obj & {
  // We need to both remove the optional modifier and exclude undefined.
  // This is because the `-?` modifier will only exclude undefined from the type if the property is optional,
  // which makes the behavior of the type inconsistent.
  // More info about this can be found here: https://github.com/microsoft/TypeScript/issues/31025
  // So excluding `undefined` explicitly also does this for required properties that include undefined.
  [key in Prop]-?: Exclude<Obj[key], undefined>;
};

export type WithRequiredProp<Obj, Prop extends AllUnionKeys<Obj>> = Simplify<
  MakeKeyRequired<Extract<Obj, { [key in Prop]?: any }>, Prop>
>;

export type WithPropOfType<
  Obj,
  Prop extends AllUnionKeys<Obj>,
  PropType extends AllPossiblePropValues<Obj, Prop>,
> = Simplify<
  Extract<Obj, { [key in Prop]?: any }> & {
    [key in Prop]: PropType;
  }
>;

export type AllPossiblePropValues<
  Obj,
  Prop extends AllUnionKeys<Obj>,
> = Extract<WithRequiredProp<Obj, Prop>, { [key in Prop]: any }>[Prop];
