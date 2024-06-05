---
category: Collection
---

_Not provided by Remeda._

This function could be recreated in Remeda via [`map`](/docs#map),
[`flatMap`](/docs#flatMap), or [`flat`](/docs#flat) (or a combination of them,
depending on the parameters used).

```ts
// Lodash
flatMapDepth(DATA);

// Remeda
flat(DATA);
```

```ts
// Lodash
flatMapDepth(DATA, mappingFunction);

// Remeda
flatMap(DATA, mappingFunction);
```

```ts
// Lodash
flatMapDepth(DATA, mappingFunction, depth);

// Remeda
flat(map(DATA, mappingFunction), depth);

// Or as a pipe
pipe(DATA, map(mappingFunction), flat(depth));
```
