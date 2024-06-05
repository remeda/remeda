---
category: Collection
---

_Not provided by Remeda._

This function could be recreated in Remeda via a combination of
[`map`](/docs#map), and [`flat`](/docs#flat) with a large depth parameter, or via
a combination of the the native JS functions [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
and [`Array.prototype.flat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) with a large depth parameter.

```ts
// Lodash
flatMapDeep(DATA, mappingFunction);

// Remeda
flat(map(DATA, mappingFunction), depth);

// Or as a pipe
pipe(DATA, map(mappingFunction), flat(depth));

// Native
DATA.map(mappingFunction).flat(depth);
```
