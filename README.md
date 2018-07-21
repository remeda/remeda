# Remeda
=============

The first "data-first" and "data-last" utility library designed especially for TypeScript.

[![Build Status](https://travis-ci.org/remeda/remeda.svg?branch=master)](https://travis-ci.org/remeda/remeda)
[![npm module](https://badge.fury.io/js/remeda.svg)](https://www.npmjs.org/package/remeda)
[![dependencies](https://david-dm.org/remeda/remeda.svg)](https://david-dm.org/remeda/remeda)


Why Remeda?
----------
There are no good utility libraries that work well with TypeScript. When working with Lodash or Ramda you must sometimes annotate types manually.  
Remeda is written and tested in TypeScript and that means there won't be any problems with custom typings.



What's "data-first" and "data-last"?
----------
Functional programming is nice, and it makes the code more readable. However there are situations where you don't need "pipes", and you want to call just a single function.  

```js
// Remeda
R.pick(obj, ['firstName', 'lastName']);

// Ramda
R.pick(['firstName', 'lastName'], obj);

// Lodash
_.pick(obj, ['firstName', 'lastName']);
```

In the above example, "data-first" approach is more natural and more programmer friendly because when you type the second argument, you get the auto-complete from IDE. It's not possible to get the auto-complete in Ramda because the data argument is not provided.

"data-last" approach is helpful when writing data transformations aka pipes.

```js
const users = [
  {name: 'john', age: 20, gender: 'm'},
  {name: 'marry', age: 22, gender: 'f'},
  {name: 'samara', age: 24, gender: 'f'},
  {name: 'paula', age: 24, gender: 'f'},
  {name: 'bill', age: 33, gender: 'm'},
]

// Remeda
R.pipe(
  users,
  R.filter(x => x.gender === 'f'),
  R.groupBy(x => x.age),
);


// Ramda
R.pipe(
  R.filter(x => x.gender === 'f'),
  R.groupBy(x => x.age),
)(users) // broken typings in TS :(

// Lodash
_(users)
  .filter(x => x.gender === 'f')
  .groupBy(x => x.age)
  .value()

// Lodash-fp
_.flow(
  _.filter(x => x.gender === 'f'),
  _.groupBy(x => x.age),
)(users)// broken typings in TS :(
```

Mixing paradigms can be cumbersome in Lodash because you must import two different methods.  
Remeda provides all methods in two versions, and the correct overload is picked based on the number of provided arguments.  
The "data-last" version must have always one argument less then the "data-first" version.

```js
// Remeda
R.pick(obj, ['firstName', 'lastName']); // data-first
R.pipe(obj, R.pick(['firstName', 'lastName'])); // data-last

R.pick(['firstName', 'lastName'], obj); // this won't work!
R.pick(['firstName', 'lastName'])(obj); // this will work but the types cannot be inferred

```


Lazy evaluation
----------



Remeda Design Goals
----------
1. The usage must be programmer friendly and that's more important then following XYZ paradigm strictly.
2. Manual annotation should be never required, and everything should be inferred by proper typings. The only exception is the first function is `createPipe`.
3. E6 polyfill is required. Core methods are reused and data structure (like Map/Set) are not re-implemented.
4. The implementation of each function should minimal as possible. Tree-shaking is supported by default. (Do you know that `lodash.keyBy` has 14KB after minification?)
5. All functions are immutable, and there are no side-effects.