---
category: Array
---

_Not provided by Remeda._

**CAUTION**: `pullAllBy` mutates the input array _in-place_! All functions in
Remeda are [_pure_](https://en.wikipedia.org/wiki/Pure_function) and never
mutate the input. These mutations might introduce side-effects and implicit
dependencies in your codebase that need to be handled before migrating to
Remeda!

- `pullAllBy` is equivalent to Lodash's `differenceBy` function. To migrate to
  Remeda first migrate calls to Lodash `_.differenceBy` and then use the
  migration docs for [`differenceBy`](/migrate/lodash#differenceBy) to complete
  the migration.

- If the mutability of the input array is desired, make sure the variable is
  assignable (e.g., using `let` instead of `const`), and assign back the result
  of `differenceBy` back to it. Note that if the input array is part of an
  object or nested array, you will need to manually reconstruct this _outer_
  object with the updated array manually.

- If mutability wasn't desired, and instead the input was cloned (shallowly)
  before calling `pullAllBy`, that cloning is now redundant.

### In-place mutation

```ts
// pullAllBy
const DATA = [{ x: 1 }, { x: 2 }, { x: 3 }];
_.pullAllBy(DATA, values, iteratee);

// differenceBy
let DATA = [{ x: 1 }, { x: 2 }, { x: 3 }];
DATA = _.differenceBy(DATA, values, iteratee);
```

### Non-mutating usage

```ts
// pullAllBy
const pulled = _.pullAllBy([...DATA], values, iteratee);

// differenceBy
const pulled = _.differenceBy(DATA, values, iteratee);
```

### Nested inside an object

```ts
// pullAllBy
const DATA = { items: [{ x: 1 }, { x: 2 }], meta: "info" };
_.pullAllBy(DATA.items, values, iteratee);

// differenceBy
let DATA = { items: [{ x: 1 }, { x: 2 }], meta: "info" };
DATA = { ...DATA, items: _.differenceBy(DATA.items, values, iteratee) };
```
