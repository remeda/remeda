const R = require('ramda');

const firstTruthy = ([head, ...tail]) =>
  R.reduce(
    (a, b) => {
      // console.log(a, b);
      return R.either(a, b);
    },
    head,
    tail
  );
const makeComparator = propName =>
  R.comparator((a, b) => {
    console.log(a.name, b.name, propName);
    return R.gt(R.prop(propName, a), R.prop(propName, b));
  });
const sortByProps = (props, list) =>
  R.sort(firstTruthy(R.map(makeComparator, props)), list);

const ret = sortByProps(
  ['a', 'b', 'c'],
  [
    { name: '1', a: 1, b: 2, c: 3 },
    { name: '2', a: 10, b: 6, c: 0 },
    { name: '3', a: 10, b: 10, c: 10 },
    { name: '4', a: 1, b: 2, c: 1 },
    { name: '5', a: 100 },
  ]
);

console.log(ret);
// console.log(firstTruthy(R.map(makeComparator, ['a', 'b', 'c'])));
