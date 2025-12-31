import { IsNever } from "type-fest";

//#region src/internal/types/CoercedArray.d.ts

/**
 * `never[]` and `[]` are not the same type, and in some cases they aren't
 * interchangeable.
 *
 * This type makes it easier to use the result of TupleParts when the input is a
 * fixed-length tuple but we still want to spread the rest of the array. e.g.
 * `[...CoercedArray<TupleParts<T>["item"]>, ...TupleParts<T>["suffix"]]`.
 *
 */
type CoercedArray<T> = IsNever<T> extends true ? [] : Array<T>;
//#endregion
export { CoercedArray as t };
//# sourceMappingURL=CoercedArray-DlHZGNXy.d.cts.map