import { IsNever } from "type-fest";

//#region src/internal/types/IsUnion.d.ts
type IsUnion<T> = InternalIsUnion<T>;
type InternalIsUnion<T, U = T> = (IsNever<T> extends true ? false : T extends any ? [U] extends [T] ? false : true : never) extends infer Result ? boolean extends Result ? true : Result : never;
//#endregion
export { IsUnion as t };
//# sourceMappingURL=IsUnion-Cx9c18vt.d.ts.map