import { t as IsUnion } from "./IsUnion-uZa852UE.cjs";

//#region src/internal/types/PartitionByUnion.d.ts

/**
 * We split the fixed tuple item types into **singular** types (e.g., `"a"`),
 * and unions of several types (e.g., `"a" | "b"`). This split allows building
 * complex types based on if a specific value would always be present, or if
 * it is *effectively* optional.
 *
 * We assume that T is a fixed tuple (no optional or rest elements), and that
 * all elements in it are bounded (as defined by `IsBounded`).
 */
type PartitionByUnion<T, Singular = never, Union = never> = T extends readonly [infer Head, ...infer Rest] ? IsUnion<Head> extends true ? PartitionByUnion<Rest, Singular, Union | Head> : PartitionByUnion<Rest, Singular | Head, Union> : {
  singular: Singular;
  union: Union;
};
//#endregion
export { PartitionByUnion as t };
//# sourceMappingURL=PartitionByUnion-DWcLid3g.d.cts.map