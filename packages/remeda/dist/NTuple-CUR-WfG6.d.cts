//#region src/internal/types/NTuple.d.ts
/**
 * An array with *exactly* N elements in it.
 *
 * Only literal N values are supported. For very large N the type might result
 * in a recurse depth error. For negative N the type would result in an infinite
 * recursion. None of these have protections because this is an internal type!
 */
type NTuple<T, N extends number, Result extends Array<unknown> = []> = Result["length"] extends N ? Result : NTuple<T, N, [...Result, T]>;
//#endregion
export { NTuple as t };
//# sourceMappingURL=NTuple-CUR-WfG6.d.cts.map