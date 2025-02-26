import type { Tagged } from "type-fest";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- We want to confine the typing to a specific symbol
declare const TAG_NAME_BRANDED_RETURN: unique symbol;

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- The most generic function signature requires the usage of `any` instead of `unknown`
export type BrandedReturn<F extends (...args: any) => any> = (
  ...args: Parameters<F>
) => Tagged<ReturnType<F>, typeof TAG_NAME_BRANDED_RETURN, F>;
