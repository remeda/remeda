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

| Lodash         | Ramda          | TypeScript                                 |
| -------------- | -------------- | ------------------------------------------ |
| `add`          | `add`          | `(x, y) => x + y`                          |
| `-`            | `append`       | `(arr, val) => [...arr, val]`              |
| `concat`       | `concat`       | `(arr1, arr2) => arr1.concat(arr2)`<sup id="a1">[1](#f1)</sup>  |
| `constant`     | `always`       | `x => () => x`                             |
| `filter`       | `filter`       | `(arr, pred) => arr.filter(pred)`<sup id="a2">[2](#f2)</sup> |
| `identity`     | `identity`     | `x => x`                                   |
| `isNil`        | `isNil`        | `x => x == null`                           |
| `nth`          | `nth`          | `n => a[n]`                                |
| `-`            | `path`         | `a?.b?.c`                                  |
| `-`            | `propEq`       | `x => x.a === value`                       |
| `-`            | `propOr`       | `x => x.a ?? defaultValue`                 |

#### Footnotes

1. <small id="f1">Incomplete replacement for Lodash `concat`. Lodash `concat` accepts multiple values to concatenate, including values that are not within an array. </small> [↩](#a1)
2. <small id="f2">To filter objects instead of arrays, use `(obj, pred) => Object.fromEntries(Object.entries(obj).filter(pred));` </small> [↩](#a2)
