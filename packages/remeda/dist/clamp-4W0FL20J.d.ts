//#region src/clamp.d.ts
type Limits = {
  readonly min?: number;
  readonly max?: number;
};
/**
 * Clamp the given value within the inclusive min and max bounds.
 *
 * @param value - The number.
 * @param limits - The bounds limits.
 * @signature
 *    R.clamp(value, { min, max });
 * @example
 *    clamp(10, { min: 20 }) // => 20
 *    clamp(10, { max: 5 }) // => 5
 *    clamp(10, { max: 20, min: 5 }) // => 10
 * @dataFirst
 * @category Number
 */
declare function clamp(value: number, limits: Limits): number;
/**
 * Clamp the given value within the inclusive min and max bounds.
 *
 * @param limits - The bounds limits.
 * @signature
 *    R.clamp({ min, max })(value);
 * @example
 *    clamp({ min: 20 })(10) // => 20
 *    clamp({ max: 5 })(10) // => 5
 *    clamp({ max: 20, min: 5 })(10) // => 10
 * @dataLast
 * @category Number
 */
declare function clamp(limits: Limits): (value: number) => number;
//#endregion
export { clamp as t };
//# sourceMappingURL=clamp-4W0FL20J.d.ts.map