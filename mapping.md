### Mapping for Lodash and Ramda

| Remeda         | Lodash         | Ramda               |
| -------------- | -------------- | ------------------- |
| `addProp`      | `set`          | `set`               |
| `allPass`      | `-`            | `allPass`           |
| `anyPass`      | `-`            | `anyPass`           |
| `chunk`        | `chunk`        | `-`                 |
| `clamp`        | `clamp`        | `clamp`             |
| `clone`        | `clone`        | `clone`             |
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
| `flatMap`      | `flatMap`      | `-`                 |
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
| `merge`        | `merge`        | `merge`             |
| `mergeAll`     | `merge`        | `mergeAll`          |
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

| Lodash         | Ramda               | TypeScript                          |
| -------------- | ------------------- | ----------------------------------- |
| `isNil`        | `isNil`             | `x => x == null`                    |
| `-`            | `path`              | `a?.b?.c`                           |
| `property`     | `prop`              | `x => x.a` or `x => x[n]`           |
| `-`            | `propOr`            | `x => x.a ?? defaultValue`          |
| `-`            | `propEq`            | `x => x.a === value`                |
| `nth`          | `nth`               | `n => a[n]`                         |
