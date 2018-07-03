// import R from 'ramda';
// import { map } from './map';
// import { pipe } from './pipe';
// import { createPipe } from './createPipe';
// import { prop, prop2 } from './prop';

// const arr = [{ a: 1 }];

// pipe(arr, map(x => x.a * 10));

// const mapItems = createPipe<Array<{ a: number }>>()(map(x => x.a * 10));

// mapItems(arr);

// map(arr, x => x.a * 10);

// const ret = map(arr, item => item.a);
// const ret2 = map(arr, prop('a'));
// // const ret3 = map(prop('a'), arr);

// const a = { a: 1 };

// const p = prop('b')(a);
// const p2 = prop2('a', a);

// // const R: any = null;

// // R.flow([1, 2, 3, 4], R.map(x => x + 1), R.take(2));

// const incCount = (obj: { count?: number }) => ({
//   ...obj,
//   count: obj.count ? obj.count + 1 : 1,
// });

// const objSize = R.nAry(
//   1,
//   R.pipe(
//     R.when(R.is(Object), R.keys),
//     R.when(
//       R.is(Boolean),
//       R.cond([[R.equals(false), R.always(null)], [R.T, R.always(1)]])
//     ),
//     R.when(R.is(Number), R.toString),
//     R.ifElse(R.isNil, R.always(0), R.length)
//   )
// );

// const objSize2 = (obj: any) => {
//   if (obj == null) {
//     return 0;
//   }
//   if (typeof obj === 'boolean') {
//     return obj ? 1 : 0;
//   }
//   if (typeof obj === 'object') {
//     return Object.keys(obj).length;
//   }
//   if (Array.isArray(obj)) {
//     return obj.length;
//   }
//   return obj.toString().length;
// };

// const firstTruthy = ([head, ...tail]) => R.reduce(R.either, head, tail);
// const makeComparator = propName =>
//   R.comparator((a, b) => R.gt(R.prop(propName, a), R.prop(propName, b)));
// const sortByProps = (props, list) =>
//   R.sort(firstTruthy(R.map(makeComparator, props)), list);

// const sortByProps2 = (props: string[], list: any[]) => {
//   const ret = [...list];
//   ret.sort((a, b) => {
//     for (const prop of props) {
//       const result = a[prop] - b[prop];
//       if (result !== 0) {
//         return result;
//       }
//     }
//     return 0;
//   });
//   ret.sort((a, b) =>
//     R.pipe(
//       props,
//       R.map(prop => a[prop] - b[prop]),
//       R.filter(value => value),
//       R.take(1),
//       R.defaultTo(0)
//     )
//   );

//   return ret;
// };

// R.pipe(R.map(() => 1), R.filter(value => 1), R.take(1), R.defaultTo(0));

// [].map;

// const paths = R.curry((paths, obj) => R.ap([R.path(R.__, obj)], paths));
// // usage:
// // const obj = {
// //   a: { b: { c: 1 } },
// //   x: 2,
// // };
// // paths([['a', 'b', 'c'], ['x']], obj); //=> [1, 2]

// const paths2 = (paths, obj) => paths.map(path => R.path(path, obj));
