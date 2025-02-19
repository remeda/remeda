---
category: Logic
remeda: when
---

- Remeda supports both if-like statements, and if-else-like statements (which is
  what Ramda's ifElse function supports); The former is done by using a
  predicate function and a mapper function, and the latter is done by wrapping
  both mappers with an object.
- To support extra arguments Ramda requires one of the functions provided to
  provide full typing to all params, in Remeda this isn't needed as the extra
  arguments would be inferred from the call site.

### if-else

```ts
// Ramda
ifElse(predicate, onTrue, onFalse)(data);

// Remeda
when(data, predicate, { onTrue, onFalse });

// Or in a pipe
pipe(data, when(predicate, { onTrue, onFalse }));
```

### if

```ts
ifElse(predicate, onTrue, identity)(data);

// Remeda
when(data, predicate, onTrue);

// Or in a pipe
pipe(data, when(predicate, onTrue));
```

### extra args

```ts
// Ramda
const mapper = ifElse(
  (x: string | undefined, index: number) => x === undefined,
  (_, index) => `item_${index}`,
  identity,
);
map(data, mapper);

// Remeda
map(
  data,
  when(
    (x) => x === undefined,
    (_, index) => `item_${index}`,
  ),
);
```
