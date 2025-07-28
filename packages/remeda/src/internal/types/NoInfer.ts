// TODO [>2]: Once we bump our minimum supported TypeScript version beyond 5.4 we can drop this and use the built-in intrinsic `NoInfer` type. This was largely copied from type-fest: https://github.com/sindresorhus/type-fest/blob/v4.41.0/source/is-any.d.ts#L1-L3
export type NoInfer<T> = T extends infer U ? U : never;
