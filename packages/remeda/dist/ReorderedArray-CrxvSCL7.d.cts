import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";

//#region src/internal/types/ReorderedArray.d.ts
type ReorderedArray<T extends IterableContainer> = { -readonly [P in keyof T]: T[number] };
//#endregion
export { ReorderedArray as t };
//# sourceMappingURL=ReorderedArray-CrxvSCL7.d.cts.map