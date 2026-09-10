import type { IsNever } from "type-fest";

/**
 * Unlike intersection (`&`), `Extract` forces TypeScript to work harder to
 * prove that two types have values that satisfy both.
 *
 * Unlike `Extract` which only checks the relation from one direction, we
 * perform a symmetric (bi-directional) check here.
 *
 * One case where this is non-trivially useful is for unbound template strings,
 * where TypeScript would keep the intersection unresolved even when they are
 * completely disjoint, and which wouldn't allow us to compare the intersection
 * against never. Albeit, there are cases where this doesn't work (see 'known
 * issues' in the test file).
 *
 * @example
 *   IsDisjoint<"a" | "b", "b" | "c">; //=> false
 *   IsDisjoint<"a", "b">; //=> true
 *   IsDisjoint<string, "a">; //=> false
 *
 *   type A = `a${string}`;
 *   type B = `b${string}`;
 *   type X0 = IsNever<A & B>; //=> false
 *   type X1 = IsDisjoint<A, B>; //=> true
 */
export type IsDisjoint<T0, T1> =
  IsNever<Extract<T0, T1>> extends true ? IsNever<Extract<T1, T0>> : false;
