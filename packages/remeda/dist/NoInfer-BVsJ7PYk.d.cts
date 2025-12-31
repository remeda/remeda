//#region src/internal/types/NoInfer.d.ts
type NoInfer<T> = T extends infer U ? U : never;
//#endregion
export { NoInfer as t };
//# sourceMappingURL=NoInfer-BVsJ7PYk.d.cts.map