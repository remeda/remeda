---
category: Collection
---

_Not provided by Remeda._

This function could be recreated in Remeda via a composition of
[`map`](/docs#map), and [`flat`](/docs#flat) with a large depth parameter.

```ts
// Lodash
flatMapDeep(DATA, mappingFunction);

// Remeda
flat(map(DATA, mappingFunction), 10 /* depth */);

// Or as a pipe
pipe(DATA, map(mappingFunction), flat(10 /* depth */));
```
