import type { Primitive } from "./primitive";

export type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;

export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;
