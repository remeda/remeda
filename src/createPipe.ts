// export function createPipe<A>(): <B>(op1: (input: A) => B) => (value: A) => B;
// export function createPipe<A>(): <B, C>(
//   op1: (input: A) => B,
//   op2: (input: B) => C
// ) => (value: A) => C;
// export function createPipe<A>(): <B, C, D>(
//   op1: (input: A) => B,
//   op2: (input: B) => C,
//   op3: (input: C) => D
// ) => (value: A) => D;

// // export function pipe<A, B, C>(
// //   value: A,
// //   op1: (input: A) => B,
// //   op2: (input: B) => C
// // ): C;

// // export function pipe<A, B, C, D>(
// //   value: A,
// //   op1: (input: A) => B,
// //   op2: (input: B) => C,
// //   op3: (input: C) => D
// // ): D;

// // export function pipe<A, B, C, D, E>(
// //   value: A,
// //   op1: (input: A) => B,
// //   op2: (input: B) => C,
// //   op3: (input: C) => D,
// //   op4: (input: D) => E
// // ): E;

// // export function pipe<A, B, C, D, E, F>(
// //   value: A,
// //   op1: (input: A) => B,
// //   op2: (input: B) => C,
// //   op3: (input: C) => D,
// //   op4: (input: D) => E,
// //   op5: (input: E) => F
// // ): F;

// // export function pipe<A, B, C, D, E, F, G>(
// //   value: A,
// //   op1: (input: A) => B,
// //   op2: (input: B) => C,
// //   op3: (input: C) => D,
// //   op4: (input: D) => E,
// //   op5: (input: E) => F,
// //   op6: (input: F) => G
// // ): G;

// // export function pipe<A, B, C, D, E, F, G, H>(
// //   value: A,
// //   op1: (input: A) => B,
// //   op2: (input: B) => C,
// //   op3: (input: C) => D,
// //   op4: (input: D) => E,
// //   op5: (input: E) => F,
// //   op6: (input: F) => G,
// //   op7: (input: G) => H
// // ): H;

// /**
//  * Perform left-to-right function composition.
//  */
// // export function createPipe(
// //   value: any,
// //   ...operations: Array<(input: any) => any>
// // ): any {
// //   return null as any;
// // }

// export function createPipe() {
//   return (...operations: Array<(input: any) => any>) => (value: any): any => {};
// }
