import type {
  IsNumericLiteral,
  IsStringLiteral,
  IsSymbolLiteral,
  Or,
  Split,
} from "type-fest";

/**
 * Checks if a type is a bounded key: a union of bounded strings, numeric
 * literals, or symbol literals.
 *
 * [For an interactive deeper dive and explanation see the following playground](https://www.typescriptlang.org/play/?noUncheckedIndexedAccess=true#code/PTAEBUAsEsGdQE4FMDGB7BATUdQCIAjNAVwDtMlM8AaHAF1EgEN4nQAzaU6OpUWJAzTtQAayQBPWADpQASQZMANrDSIkAR2LRk8HgHJYAKBCg0BAFaoGdNcwBufZUrMi6kJAFtpRuhIAOfABCJOSUoAC8oABKqBiYADwABv7InAAeAPoAJADeeB5KSmh4oAA++ADuGEpUAL5JtHiqnoIwpADmeAB8ANxGJmBQuMjoWDjweGREZBRUtDyMLKBMpDiknNy8-IKuoP5osLDQBEp84lKyCoaDZpbWoOjEtY9opHRMXKCkb3zCoO4vAC0GgfH5AqAAKqkGZhbBRWJjRIpNLQLJ5WB0BBcDoNJotNo4nr9W4AMQwK1IEggAC4IKAkOleOR4AAFJgIOjQZQJcDdUAEakUTZct60AjEGwedaOBACCbfNCKJSVJhSW5Y4hIWQAdQ8a0WuE1fEqfBQq34aoBzAY4AV0E8-iU0BQPCU1P8HK5ylAAApDcZTJptPZlEh3sDQOzOdylLzugBKXwBPhyWByR3O110d3R71xvmRKNe2PxhlM8OYeB2gD8+AkpTpeFIeBJpj14ZWKBQSCOOJW+wQaH8e0BAtCczuVhQtpTAGUUNj-AxzWtw7BiMhrUwGKlh7dGXA6Ho1mPzNPFOQGaQN1uePBwdqjBQUEoOWa3pjQEEAPKQgByAAiACigF0iEsyUP06A3gwsKTlEv4ASBgEANp4KkSAZJkhTFHgAC6-SmKAJEAHo1gM7b6l2PZ9p0A57iO-xjtME7hOe1i0JU1H6D80IoB4KDiJgchhOklAAILdr2sBJLcuDhkwpzhOA86LtAy6PBabzutet4mjaAIpvQoAAFSeNAHSQHQpkCkg4qSisKhoLcMHHBQCDWmaLAGUgd4MJgaC9qQ+gMIeX5fGe9wzrQqgmU8LzKHFBBILcSSQZslBJD4L5vlubkMABSFAaBdLQvBUFGAVoCsZB8JQv+xUoehmHYbhJSEbcJGgORlFDDAegPggWocBSpmmasEjjYOw57EVf4lYBvSgNxLqQKArSrA+hnODN-jwMItzzchoErFueDDqKpDKDQK0wAJCqMkwM66dxO6gEkealo+-zHYt3RyaYm03jsnirFy5pFBIy1xaa+jYIygQztaRpqMgdCbms+gSPoDkMIs6OY-AvH6AAhMmEJpuVbEiZmLpuhIX0+lEaYZk69M5ozJY8tTdV9F1PUUbcervbt7i4MDg3bvjaxg1SWkCLAtC9kjsa6e4hx8O4726MwEKrLcHHI6aG2WdZ3xIOEthLOQZzjnVlLYLVcLqEi8ACJ6CA7u6tCrJgrmrKF6i6W8OB09mrx+a6n7K44azcZ2gLUmD4g7De2rSD4QA).
 */
export type IsBounded<T> =
  // `extends unknown` is always going to be the case and is used to convert any
  // union into a [distributive conditional type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    T extends unknown
      ? Or<IsBoundedString<T>, Or<IsNumericLiteral<T>, IsSymbolLiteral<T>>>
      : never
  ) extends true
    ? // When some parts of the union result in `true` and others in `false`
      // (e.g. `"a" | number`), when we distribute the union we would get
      // `boolean` as a result (because `true | false` === `boolean`); but the
      // union as a whole is bounded only if **all** it's parts are bounded
      // individually.
      true
    : false;

/**
 * Literal strings can be unbounded when they are a template literal which
 * contains non-literal components (e.g. `prefix_${string}`), this is because
 * there are an infinite number of possible values that satisfy it.
 */
type IsBoundedString<T> = T extends string
  ? IsStringLiteral<T> extends true
    ? // T[number] alone doesn't work because that's just string.
      Split<T, "">[number] extends infer U
      ? // string. Otherwise, we assume it's bounded.
        [`${number}`] extends [U]
        ? false
        : [string] extends [U]
          ? false
          : true
      : false
    : false
  : false;
