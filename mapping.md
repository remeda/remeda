# Mapping for Lodash and Ramda

_Remeda functions are not necessarily drop-in replacements for the
listed Lodash and Ramda functions. Just as the Lodash function may behave
differently than the Ramda equivalent, the Remeda function may also
behave differently from either or both. Be sure to consult each library's
documentation when migrating._

| Remeda              | Lodash              | Ramda               |
| ------------------- | ------------------- | ------------------- |
| `add`               | `add`               | `add`               |
| `addProp`           | `set`               | `set`               |
| `allPass`           |                     | `allPass`           |
| `anyPass`           |                     | `anyPass`           |
| `chunk`             | `chunk`             |                     |
| `clamp`             | `clamp`             | `clamp`             |
| `clone`             | `cloneDeep`         | `clone`             |
| `concat`            | `concat`            | `concat`            |
| `createPipe`        |                     |                     |
| `debounce`          | `debounce`          |                     |
| `difference`        | `difference`        | `difference`        |
| `differenceWith`    | `differenceWith`    | `differenceWith`    |
| `drop`              | `drop`              | `drop`              |
| `dropLast`          | `dropRight`         | `dropLast`          |
| `equals`            | `isEqual`           | `equals`            |
| `filter`            | `filter`            | `filter`            |
| `find`              | `find`              | `find`              |
| `findIndex`         | `findIndex`         | `findIndex`         |
| `findLast`          | `findLast`          | `findLast`          |
| `findLastIndex`     | `findLastIndex`     | `findLastIndex`     |
| `first`             | `head`              | `head`              |
| `flatMap`           | `flatMap`           | `chain`             |
| `flatten`           | `flatten`           | `flatten`           |
| `flattenDeep`       | `flattenDeep`       | `flatten`           |
| `forEach`           | `forEach`           | `forEach`           |
| `forEachObj`        | `forEach`           | `forEachObjIndexed` |
| `groupBy`           | `groupBy`           | `groupBy`           |
| `identity`          | `identity`          | `identity`          |
| `indexBy`           | `keyBy`             | `indexBy`           |
| `intersection`      | `intersection`      | `intersection`      |
| `intersectionWith`  | `intersectionWith`  | `innerJoin`         |
| `invert`            | `invert`            | `invertObj`         |
| `isEmpty`           | `isEmpty`           | `isEmpty`           |
| `isNil`             | `isNil`             | `isNil`             |
| `join`              | `join`              | `join`              |
| `last`              | `last`              | `last`              |
| `length`            | `size`              | `length`            |
| `map`               | `map`               | `map`               |
| `mapKeys`           | `mapKeys`           |                     |
| `meanBy`            | `meanBy`            |                     |
| `merge`             | `assign`            | `merge`             |
| `mergeAll`          | `assign`            | `mergeAll`          |
| `mergeDeep`         |                     | `mergeDeepRight`    |
| `multiply`          | `multiply`          | `multiply`          |
| `noop`              | `noop`              | `-`                 |
| `objOf`             | `-`                 | `objOf`             |
| `omit`              | `omit`              | `omit`              |
| `omitBy`            | `omitBy`            |                     |
| `once`              | `once`              | `once`              |
| `partition`         | `partition`         | `partition`         |
| `pathOr`            | `get`               | `pathOr`            |
| `pick`              | `pick`              | `pick`              |
| `pickBy`            | `pickBy`            | `pickBy`            |
| `pipe`              | `flow`              | `pipe`              |
| `prop`              | `get`               | `prop`              |
| `purry`             |                     |                     |
| `randomString`      |                     |                     |
| `range`             | `range`             | `range`             |
| `reduce`            | `reduce`            | `reduce`            |
| `reject`            | `reject`            | `reject`            |
| `reverse`           | `reverse`           | `reverse`           |
| `sample`            | `sampleSize`\*      |                     |
| `set`               | `set`               | `assoc`             |
| `setPath`           | `set`               | `assocPath`         |
| `shuffle`           | `shuffle`           |                     |
| `sort`              |                     | `sort`              |
| `sortBy`            | `orderBy`           |                     |
| `sortBy`            | `sortBy`            | `sortBy`            |
| `sortedIndex`       | `sortedIndex`       |                     |
| `sortedIndexBy`     | `sortedIndexBy`     |                     |
| `sortedLastIndex`   | `sortedLastIndex`   |                     |
| `sortedLastIndexBy` | `sortedLastIndexBy` |                     |
| `splice`            | `-`                 | `remove`            |
| `splitAt`           | `-`                 | `splitAt`           |
| `splitWhen`         | `-`                 | `splitWhen`         |
| `stringToPath`      | `toPath`            | `-`                 |
| `subtract`          | `subtract`          | `subtract`          |
| `sumBy`             | `sumBy`             | `-`                 |
| `swapIndices`       | `-`                 | `swap`              |
| `swapProps`         | `-`                 | `swap`              |
| `take`              | `take`              | `take`              |
| `takeLastWhile`     | `takeRightWhile`    | `takeLastWhile`     |
| `takeWhile`         | `takeWhile`         | `takeWhile`         |
| `tap`               | `tap`               | `tap`               |
| `times`             | `times`             | `times`             |
| `toPairs`           | `toPairs`           | `toPairs`           |
| `type`              |                     | `type`              |
| `uniq`              | `uniq`              | `uniq`              |
| `uniqBy`            | `uniqBy`            | `uniqBy`            |
| `uniqWith`          | `uniqWith`          | `uniqWith`          |
| `zipObj`            | `zipObj`            | `zipObj`            |

## Helpful one-liners

Some lodash and ramda functions don't have a Remeda equivalent, but can be
easily replaced with a one-liner in TypeScript. Some of the most common
are listed below.

_TypeScript one-liners are not necessarily drop-in replacements that
provide the exact functionality of the listed Lodash and Ramda functions.
Be sure to consult each library's documentation and to check what features
you are relying on when migrating._

| Lodash     | Ramda    | TypeScript                    |
| ---------- | -------- | ----------------------------- |
|            | `append` | `(arr, val) => [...arr, val]` |
| `constant` | `always` | `x => () => x`                |
| `nth`      | `nth`    | `n => a[n]`                   |
|            | `path`   | `a?.b?.c`                     |
|            | `propEq` | `x => x.a === value`          |
|            | `propOr` | `x => x.a ?? defaultValue`    |
| `words`    |          | `str => str.split(/\s+/)`     |
| `compact`  |          | `R.filter(R.isTruthy)`        |
