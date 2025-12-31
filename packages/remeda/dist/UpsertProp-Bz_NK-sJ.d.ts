import { t as IsUnion } from "./IsUnion-Cx9c18vt.js";
import { IsLiteral, Simplify, Writable } from "type-fest";

//#region src/internal/types/UpsertProp.d.ts
type UpsertProp<T, K extends PropertyKey, V> = Simplify<Omit<T, K> & (IsSingleLiteral<K> extends true ? Writable<Required<Record<K, V>>> :
// ('cat' | 'dog') so we can't say anything for sure, we need to narrow
{ -readonly [P in keyof T as P extends K ? P : never]: T[P] | V } & { -readonly [P in K as P extends keyof T ? never : P]?: V })>;
type IsSingleLiteral<K> = IsLiteral<K> extends true ? (IsUnion<K> extends true ? false : true) : false;
//#endregion
export { UpsertProp as t };
//# sourceMappingURL=UpsertProp-Bz_NK-sJ.d.ts.map