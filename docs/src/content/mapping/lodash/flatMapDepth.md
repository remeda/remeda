---
category: Collection
---

_Not provided by Remeda._

This function could be recreated in Remeda via [`map`](/docs#map),
[`flatMap`](/docs#flatMap), or [`flat`](/docs#flat) (or a combination of them,
depending on the parameters used), or via the native JS functions
[`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
[`Array.prototype.flatMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap),
or [`Array.prototype.flat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) (or a combination of them, depending on the
parameters used).

```ts
// Lodash
flatMapDepth(DATA);

// Remeda
flat(DATA);

// Native
DATA.flat();
```

```ts
// Lodash
flatMapDepth(DATA, mappingFunction);

// Remeda
flatMap(DATA, mappingFunction);

// Native
DATA.flatMap(mappingFunction);
```

```ts
// Lodash
flatMapDepth(DATA, mappingFunction, depth);

// Remeda
flat(map(DATA, mappingFunction), depth);

// Or as a pipe
pipe(DATA, map(mappingFunction), flat(depth));

// Native
DATA.map(mappingFunction).flat(depth);
```
