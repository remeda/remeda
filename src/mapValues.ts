// /**
//  * Map each element of an array using a defined callback function.
//  * @param array The array to map.
//  * @param fn The function mapper.
//  * @returns The new mapped array.
//  * @signature
//  *    R.map(array, fn)
//  * @example
//  *    R.map([1, 2, 3], x => x * 10) // => [10, 20, 30]
//  * @tag Data First
//  * @tag Array
//  */
// export function map<T, K>(array: T[], fn: (input: T) => K): K[];

// /**
//  * Map each value of an object using a defined callback function.
//  * @param object The object to map.
//  * @param fn The function mapper.
//  * @returns The new mapped array.
//  * @signature
//  *    R.map(object, fn)
//  * @example
//  *    R.map({ a: 1, b: 2, c: 3 }, x => x * 10) // => { a: 2, b: 4, c: 6 }
//  * @tag Data First
//  * @tag Object
//  */
// export function map<T, K>(
//   object: T,
//   fn: (input: T[keyof T]) => K
// ): { [k in keyof T]: K };

// /**
//  * Map each value of an object using a defined callback function.
//  * @param fn the function mapper
//  * @example
//  *    R.map(x => x * 10)({ a: 1, b: 2, c: 3 }) // => { a: 2, b: 4, c: 6 }
//  * @tag Data Last
//  * @tag Array
//  */
// export function map<T, K>(
//   fn: (input: T[keyof T]) => K
// ): (object: T) => { [k in keyof T]: K };

// /**
//  * Map each element of an array using a defined callback function.
//  * @param fn the function mapper
//  * @example
//  *    R.map(x => x * 10)([1, 2, 3]) // => [10, 20, 30]
//  * @tag Data Last
//  * @tag Array
//  */
// export function map<T, K>(fn: (input: T) => K): (array: T[]) => K[];

// export function map(arg1: any, arg2?: any): any {
//   if (arguments.length === 1) {
//     return (data: any[]) => {
//       if (Array.isArray(data)) {
//         return _map(data, arg1);
//       }
//       return _mapObject(data, arg1);
//     };
//   }
//   if (Array.isArray(arg1)) {
//     return _map(arg1, arg2);
//   }
//   return _mapObject(arg1, arg2);
// }

// function _map<T, K>(array: T[], fn: (input: T) => K) {
//   return array.map(item => fn(item));
// }

// function _mapObject<T, K>(
//   object: T,
//   fn: (input: T[keyof T]) => K
// ): { [k in keyof T]: K } {
//   const ret: any = {};
//   for (const k in object) {
//     ret[k] = fn(object[k]);
//   }
//   return ret;
// }
