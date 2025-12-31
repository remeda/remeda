import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";
import { t as RemedaTypeError } from "./RemedaTypeError-D7wvGSrH.js";
import { t as TupleParts } from "./TupleParts-CMigdcrz.js";
import { t as ClampedIntegerSubtract } from "./ClampedIntegerSubtract-RjA0M8T2.js";
import { t as CoercedArray } from "./CoercedArray-DxS6j_hV.js";
import { And, GreaterThan, IsEqual, IsLiteral, IsNever, ReadonlyTuple } from "type-fest";

//#region src/internal/types/ArrayRequiredPrefix.d.ts
type ArrayRequiredPrefix<T extends IterableContainer, N extends number> = IsLiteral<N> extends true ? T extends unknown ? ClampedIntegerSubtract<N, [...TupleParts<T>["required"], ...TupleParts<T>["suffix"]]["length"]> extends infer Remainder extends number ? Remainder extends 0 ? T : And<GreaterThan<Remainder, TupleParts<T>["optional"]["length"]>, IsNever<TupleParts<T>["item"]>> extends true ? RemedaTypeError<"ArrayRequiredPrefix", "The input tuple cannot satisfy the minimum", {
  type: never;
  metadata: [T, N];
}> : WithSameReadonly<T, [...TupleParts<T>["required"], ...OptionalTupleRequiredPrefix<TupleParts<T>["optional"], Remainder>, ...ReadonlyTuple<TupleParts<T>["item"], ClampedIntegerSubtract<Remainder, TupleParts<T>["optional"]["length"]>>, ...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]> : RemedaTypeError<"ArrayRequiredPrefix", "Remainder didn't compute to a number?!", {
  type: never;
  metadata: [T, N];
}> : RemedaTypeError<"ArrayRequiredPrefix", "Failed to distribute union?!", {
  type: never;
  metadata: T;
}> : RemedaTypeError<"ArrayRequiredPrefix", "Only literal minimums are supported!", {
  type: never;
  metadata: N;
}>;
type WithSameReadonly<Source, Destination> = IsEqual<Source, Readonly<Source>> extends true ? Readonly<Destination> : Destination;
type OptionalTupleRequiredPrefix<T extends Array<unknown>, N, Prefix extends Array<unknown> = []> = Prefix["length"] extends N ? [...Prefix, ...Partial<T>] : T extends readonly [infer Head, ...infer Rest] ? OptionalTupleRequiredPrefix<Rest, N, [...Prefix, Head]> : Prefix;
//#endregion
export { ArrayRequiredPrefix as t };
//# sourceMappingURL=ArrayRequiredPrefix-BQgcBIkt.d.ts.map