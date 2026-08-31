/* eslint-disable @typescript-eslint/consistent-type-definitions -- Intentional, it's the whole point of this file! */

export interface Cat {
  readonly type: "cat";
  readonly legs: number;
}

export interface Kitten extends Cat {
  readonly age: number;
}

export interface Legged {
  readonly legs: number;
  readonly tail: boolean;
}

export interface Named {
  readonly name: string;
}

export declare function isCat(x: unknown): x is Cat;

export declare function isLegged(x: unknown): x is Legged;

export declare function isNamed(x: unknown): x is Named;
