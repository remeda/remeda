//#region src/internal/types/PartialArray.d.ts
/**
 * In versions of TypeScript prior to 5.4 there is an issue inferring an array
 * type after passing it to Partial without additional testing. To allow simpler
 * code we pulled this check into it's own utility.
 *
 * TODO [>2]: Remove this utility once the minimum TypeScript version is bumped.
 */
type PartialArray<T> = T extends ReadonlyArray<unknown> | [] ? Partial<T> : never;
//#endregion
export { PartialArray as t };
//# sourceMappingURL=PartialArray-vJGoNMaK.d.cts.map