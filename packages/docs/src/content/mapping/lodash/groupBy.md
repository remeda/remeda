---
category: Collection
remeda: groupBy
---

- When using `groupBy` with a callback function use Remeda's
  [`groupBy`](/docs#groupBy) function.
- When using `groupBy` on an array of objects and with a property name use
  Remeda's [`groupByProp`](/docs#groupByProp) instead.
- When using `groupBy` on an array of primitives (e.g., `string`) and with a
  property name use Remeda's [`groupBy`](/docs#groupBy) composed with
  [`prop`](/docs#prop).

### Callback

```ts
const DATA = [6.1, 4.2, 6.3];

// Lodash
groupBy(DATA, Math.floor);

// Remeda
groupBy(DATA, Math.floor);
```

### Property Name (on objects)

```ts
const DATA = [
  { type: "cat", name: "felix" },
  { type: "dog", toys: 3 },
];

// Lodash
groupBy(DATA, "type");

// Remeda
groupByProp(DATA, "type");
```

### Property Name (on primitives)

```ts
const DATA = ["one", "two", "three"];

// Lodash
groupBy(DATA, "length");

// Remeda
groupBy(DATA, prop("length"));
```
