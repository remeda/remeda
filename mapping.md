### Mapping for Lodash and Ramda

_Remeda functions are not necessarily drop-in replacements for the
listed Lodash and Ramda functions. Just as the Lodash function may behave
differently than the Ramda equivalent, the Remeda function may also
behave differently from either or both. Be sure to consult each library's
documentation when migrating._

| Remeda         | Lodash         | Ramda               |
| -------------- | -------------- | ------------------- |
| `addProp`      | `set`          | `set`               |
| `allPass`      | `-`            | `allPass`           |
| `anyPass`      | `-`            | `anyPass`           |
| `chunk`        | `chunk`        | `-`                 |
| `clamp`        | `clamp`        | `clamp`             |
| `clone`        | `cloneDeep`    | `clone`             |
| `compact`      | `compact`      | `-`                 |
| `concat`       | `concat`       | `concat`            |
| `createPipe`   | `-`            | `-`                 |
| `difference`   | `difference`   | `difference`        |
| `drop`         | `drop`         | `drop`              |
| `dropLast`     | `dropRight`    | `dropLast`          |
| `equals`       | `isEqual`      | `equals`            |
| `filter`       | `filter`       | `filter`            |
| `find`         | `find`         | `find`              |
| `findIndex`    | `findIndex`    | `findIndex`         |
| `first`        | `head`         | `head`              |
| `flatMap`      | `flatMap`      | `chain`             |
| `flatten`      | `flatten`      | `flatten`           |
| `flattenDeep`  | `flattenDeep`  | `flatten`           |
| `forEach`      | `forEach`      | `forEach`           |
| `forEachObj`   | `forEach`      | `forEachObjIndexed` |
| `groupBy`      | `groupBy`      | `groupBy`           |
| `indexBy`      | `keyBy`        | `indexBy`           |
| `intersection` | `intersection` | `intersection`      |
| `last`         | `last`         | `last`              |
| `map`          | `map`          | `map`               |
| `mapKeys`      | `mapKeys`      | `-`                 |
| `merge`        | `assign`       | `merge`             |
| `mergeAll`     | `assign`       | `mergeAll`          |
| `noop`         | `noop`         | `-`                 |
| `objOf`        | `-`            | `objOf`             |
| `omit`         | `omit`         | `omit`              |
| `once`         | `once`         | `once`              |
| `pathOr`       | `get`          | `pathOr`            |
| `pick`         | `pick`         | `pick`              |
| `pipe`         | `flow`         | `pipe`              |
| `prop`         | `get`          | `prop`              |
| `purry`        | `-`            | `-`                 |
| `randomString` | `-`            | `-`                 |
| `range`        | `range`        | `range`             |
| `reduce`       | `reduce`       | `reduce`            |
| `reject`       | `reject`       | `reject`            |
| `reverse`      | `reverse`      | `reverse`           |
| `set`          | `set`          | `set`               |
| `sort`         | `-`            | `sort`              |
| `sortBy`       | `sortBy`       | `sortBy`            |
| `splitAt`      | `-`            | `splitAt`           |
| `splitWhen`    | `-`            | `splitWhen`         |
| `take`         | `take`         | `take`              |
| `takeWhile`    | `takeWhile`    | `takeWhile`         |
| `times`        | `times`        | `times`             |
| `toPairs`      | `toPairs`      | `toPairs`           |
| `type`         | `-`            | `type`              |
| `uniq`         | `uniq`         | `uniq`              |
| `uniqBy`       | `uniqBy`       | `uniqBy`            |

### Helpful one-liners

Some lodash and ramda functions don't have a Remeda equivalent, but can be
easily replaced with a one-liner in TypeScript. Some of the most common
are listed below.

_TypeScript one-liners are not necessarily drop-in replacements that
provide the exact functionality of the listed Lodash and Ramda functions.
Be sure to consult each library's documentation and to check what features
you are relying on when migrating._

| Lodash         | Ramda          | TypeScript                                 |
| -------------- | -------------- | ------------------------------------------ |
| `add`          | `add`          | `(x, y) => x + y`                          |
| `-`            | `append`       | `(arr, val) => [...arr, val]`              |
| `constant`     | `always`       | `x => () => x`                             |
| `identity`     | `identity`     | `x => x`                                   |
| `isNil`        | `isNil`        | `x => x == null`                           |
| `nth`          | `nth`          | `n => a[n]`                                |
| `-`            | `path`         | `a?.b?.c`                                  |
| `-`            | `propEq`       | `x => x.a === value`                       |
| `-`            | `propOr`       | `x => x.a ?? defaultValue`                 |
| `reverse`      | `reverse`      | `(arr : Array<any>) => [...arr].reverse()` |
| `words`        | `-`            | `str => str.split(/\s+/)`                  |


