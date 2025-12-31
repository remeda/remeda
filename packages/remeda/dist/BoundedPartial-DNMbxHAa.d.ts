import { t as IsBoundedRecord } from "./IsBoundedRecord-DBhikMQR.js";

//#region src/internal/types/BoundedPartial.d.ts

/**
 * Records with an unbounded set of keys have different semantics to those with
 * a bounded set of keys when using 'noUncheckedIndexedAccess', the former
 * being implicitly `Partial` whereas the latter are implicitly `Required`.
 *
 * @example
 *    BoundedPartial<{ a: number }>; //=> { a?: number }
 *    BoundedPartial<Record<string, number>>; //=> Record<string, number>
 */
type BoundedPartial<T> = IsBoundedRecord<T> extends true ? Partial<T> : T;
//#endregion
export { BoundedPartial as t };
//# sourceMappingURL=BoundedPartial-DNMbxHAa.d.ts.map