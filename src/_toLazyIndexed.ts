// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Typescript requires using `any` to infer any kind of function type, `unknown` is not enough.
export const _toLazyIndexed = <Func extends (...args: any) => unknown>(
  fn: Func
): Func & { readonly indexed: true } =>
  Object.assign(fn, { indexed: true as const });
