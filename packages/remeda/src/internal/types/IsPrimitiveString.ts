/**
 * Sometimes you just need to ask the simple questions...
 */
export type IsPrimitiveString<T extends string> = string extends T
  ? true
  : false;
