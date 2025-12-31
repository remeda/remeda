import { t as IterableContainer } from "./IterableContainer-C4t-zHIU.js";

//#region src/internal/types/ReorderedArray.d.ts
type ReorderedArray<T extends IterableContainer> = { -readonly [P in keyof T]: T[number] };
//#endregion
export { ReorderedArray as t };
//# sourceMappingURL=ReorderedArray-BUZ1Pbmy.d.ts.map