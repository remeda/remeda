---
layout: ../../layouts/wiki.astro
---

# Mapping for Ramda

_Remeda functions are not necessarily drop-in replacements for the listed Ramda
functions; they may behave differently. Be sure to consult Ramda's documentation
when migrating._

| Ramda                                                              | Remeda                                                            |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [`add`](https://ramdajs.com/docs/#add)                             | [`add`](https://remedajs.com/docs/#add)                           |
| [`allPass`](https://ramdajs.com/docs/#allPass)                     | [`allPass`](https://remedajs.com/docs/#allPass)                   |
| [`always`](https://ramdajs.com/docs/#always)                       | [`constant`](https://remedajs.com/docs/#constant)                 |
| [`anyPass`](https://ramdajs.com/docs/#anyPass)                     | [`anyPass`](https://remedajs.com/docs/#anyPass)                   |
| [`assoc`](https://ramdajs.com/docs/#assoc)                         | [`set`](https://remedajs.com/docs/#set)                           |
| [`assocPath`](https://ramdajs.com/docs/#assocPath)                 | [`setPath`](https://remedajs.com/docs/#setPath)                   |
| [`chain`](https://ramdajs.com/docs/#chain)                         | [`flatMap`](https://remedajs.com/docs/#flatMap)                   |
| [`clamp`](https://ramdajs.com/docs/#clamp)                         | [`clamp`](https://remedajs.com/docs/#clamp)                       |
| [`clone`](https://ramdajs.com/docs/#clone)                         | [`clone`](https://remedajs.com/docs/#clone)                       |
| [`concat`](https://ramdajs.com/docs/#concat)                       | [`concat`](https://remedajs.com/docs/#concat)                     |
| [`cond`](https://ramdajs.com/docs/#cond)                           | [`conditional`](https://remedajs.com/docs/#conditional)           |
| [`difference`](https://ramdajs.com/docs/#difference)               | [`difference`](https://remedajs.com/docs/#difference)             |
| [`differenceWith`](https://ramdajs.com/docs/#differenceWith)       | [`differenceWith`](https://remedajs.com/docs/#differenceWith)     |
| [`divide`](https://ramdajs.com/docs/#divide)                       | [`divide`](https://remedajs.com/docs/#divide)                     |
| [`drop`](https://ramdajs.com/docs/#drop)                           | [`drop`](https://remedajs.com/docs/#drop)                         |
| [`dropLast`](https://ramdajs.com/docs/#dropLast)                   | [`dropLast`](https://remedajs.com/docs/#dropLast)                 |
| [`dropLastWhile`](https://ramdajs.com/docs/#dropLastWhile)         | [`dropLastWhile`](https://remedajs.com/docs/#dropLastWhile)       |
| [`dropWhile`](https://ramdajs.com/docs/#dropWhile)                 | [`dropWhile`](https://remedajs.com/docs/#dropWhile)               |
| [`equals`](https://ramdajs.com/docs/#equals)                       | [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual)           |
| [`evolve`](https://ramdajs.com/docs/#evolve)                       | [`evolve`](https://remedajs.com/docs/#evolve)                     |
| [`filter`](https://ramdajs.com/docs/#filter)                       | [`filter`](https://remedajs.com/docs/#filter)                     |
| [`find`](https://ramdajs.com/docs/#find)                           | [`find`](https://remedajs.com/docs/#find)                         |
| [`findIndex`](https://ramdajs.com/docs/#findIndex)                 | [`findIndex`](https://remedajs.com/docs/#findIndex)               |
| [`findLast`](https://ramdajs.com/docs/#findLast)                   | [`findLast`](https://remedajs.com/docs/#findLast)                 |
| [`findLastIndex`](https://ramdajs.com/docs/#findLastIndex)         | [`findLastIndex`](https://remedajs.com/docs/#findLastIndex)       |
| [`flatten`](https://ramdajs.com/docs/#flatten)                     | [`flat`](https://remedajs.com/docs/#flat)                         |
| [`forEach`](https://ramdajs.com/docs/#forEach)                     | [`forEach`](https://remedajs.com/docs/#forEach)                   |
| [`forEachObjIndexed`](https://ramdajs.com/docs/#forEachObjIndexed) | [`forEachObj`](https://remedajs.com/docs/#forEachObj)             |
| [`groupBy`](https://ramdajs.com/docs/#groupBy)                     | [`groupBy`](https://remedajs.com/docs/#groupBy)                   |
| [`head`](https://ramdajs.com/docs/#head)                           | [`first`](https://remedajs.com/docs/#first)                       |
| [`identity`](https://ramdajs.com/docs/#identity)                   | [`identity`](https://remedajs.com/docs/#identity)                 |
| [`indexBy`](https://ramdajs.com/docs/#indexBy)                     | [`indexBy`](https://remedajs.com/docs/#indexBy)                   |
| [`innerJoin`](https://ramdajs.com/docs/#innerJoin)                 | [`intersectionWith`](https://remedajs.com/docs/#intersectionWith) |
| [`intersection`](https://ramdajs.com/docs/#intersection)           | [`intersection`](https://remedajs.com/docs/#intersection)         |
| [`invertObj`](https://ramdajs.com/docs/#invertObj)                 | [`invert`](https://remedajs.com/docs/#invert)                     |
| [`isEmpty`](https://ramdajs.com/docs/#isEmpty)                     | [`isEmpty`](https://remedajs.com/docs/#isEmpty)                   |
| [`isNil`](https://ramdajs.com/docs/#isNil)                         | [`isNullish`](https://remedajs.com/docs/#isNullish)               |
| [`isNotNil`](https://ramdajs.com/docs/#isNotNil)                   | [`isNonNullish`](https://remedajs.com/docs/#isNonNullish)         |
| [`join`](https://ramdajs.com/docs/#join)                           | [`join`](https://remedajs.com/docs/#join)                         |
| [`last`](https://ramdajs.com/docs/#last)                           | [`last`](https://remedajs.com/docs/#last)                         |
| [`length`](https://ramdajs.com/docs/#length)                       | [`length`](https://remedajs.com/docs/#length)                     |
| [`map`](https://ramdajs.com/docs/#map)                             | [`map`](https://remedajs.com/docs/#map)                           |
| [`mapObjIndexed`](https://ramdajs.com/docs/#mapObjIndexed)         | [`mapValues`](https://remedajs.com/docs/#mapValues)               |
| [`merge`](https://ramdajs.com/docs/#merge)                         | [`merge`](https://remedajs.com/docs/#merge)                       |
| [`mergeAll`](https://ramdajs.com/docs/#mergeAll)                   | [`mergeAll`](https://remedajs.com/docs/#mergeAll)                 |
| [`mergeDeepRight`](https://ramdajs.com/docs/#mergeDeepRight)       | [`mergeDeep`](https://remedajs.com/docs/#mergeDeep)               |
| [`multiply`](https://ramdajs.com/docs/#multiply)                   | [`multiply`](https://remedajs.com/docs/#multiply)                 |
| [`objOf`](https://ramdajs.com/docs/#objOf)                         | [`objOf`](https://remedajs.com/docs/#objOf)                       |
| [`omit`](https://ramdajs.com/docs/#omit)                           | [`omit`](https://remedajs.com/docs/#omit)                         |
| [`once`](https://ramdajs.com/docs/#once)                           | [`once`](https://remedajs.com/docs/#once)                         |
| [`partition`](https://ramdajs.com/docs/#partition)                 | [`partition`](https://remedajs.com/docs/#partition)               |
| [`pathOr`](https://ramdajs.com/docs/#pathOr)                       | [`pathOr`](https://remedajs.com/docs/#pathOr)                     |
| [`pick`](https://ramdajs.com/docs/#pick)                           | [`pick`](https://remedajs.com/docs/#pick)                         |
| [`pickBy`](https://ramdajs.com/docs/#pickBy)                       | [`pickBy`](https://remedajs.com/docs/#pickBy)                     |
| [`pipe`](https://ramdajs.com/docs/#pipe)                           | [`pipe`](https://remedajs.com/docs/#pipe)                         |
| [`product`](https://ramdajs.com/docs/#product)                     | [`product`](https://remedajs.com/docs/#product)                   |
| [`prop`](https://ramdajs.com/docs/#prop)                           | [`prop`](https://remedajs.com/docs/#prop)                         |
| [`range`](https://ramdajs.com/docs/#range)                         | [`range`](https://remedajs.com/docs/#range)                       |
| [`reduce`](https://ramdajs.com/docs/#reduce)                       | [`reduce`](https://remedajs.com/docs/#reduce)                     |
| [`remove`](https://ramdajs.com/docs/#remove)                       | [`splice`](https://remedajs.com/docs/#splice)                     |
| [`reverse`](https://ramdajs.com/docs/#reverse)                     | [`reverse`](https://remedajs.com/docs/#reverse)                   |
| [`set`](https://ramdajs.com/docs/#set)                             | [`addProp`](https://remedajs.com/docs/#addProp)                   |
| [`sort`](https://ramdajs.com/docs/#sort)                           | [`sort`](https://remedajs.com/docs/#sort)                         |
| [`sortBy`](https://ramdajs.com/docs/#sortBy)                       | [`sortBy`](https://remedajs.com/docs/#sortBy)                     |
| [`splitAt`](https://ramdajs.com/docs/#splitAt)                     | [`splitAt`](https://remedajs.com/docs/#splitAt)                   |
| [`splitWhen`](https://ramdajs.com/docs/#splitWhen)                 | [`splitWhen`](https://remedajs.com/docs/#splitWhen)               |
| [`subtract`](https://ramdajs.com/docs/#subtract)                   | [`subtract`](https://remedajs.com/docs/#subtract)                 |
| [`sum`](https://ramdajs.com/docs/#sum)                             | [`sum`](https://remedajs.com/docs/#sum)                           |
| [`swap`](https://ramdajs.com/docs/#swap)                           | [`swapIndices`](https://remedajs.com/docs/#swapIndices)           |
| [`take`](https://ramdajs.com/docs/#take)                           | [`take`](https://remedajs.com/docs/#take)                         |
| [`takeLast`](https://ramdajs.com/docs/#takeLast)                   | [`takeLast`](https://remedajs.com/docs/#takeLast)                 |
| [`takeLastWhile`](https://ramdajs.com/docs/#takeLastWhile)         | [`takeLastWhile`](https://remedajs.com/docs/#takeLastWhile)       |
| [`takeWhile`](https://ramdajs.com/docs/#takeWhile)                 | [`takeWhile`](https://remedajs.com/docs/#takeWhile)               |
| [`tap`](https://ramdajs.com/docs/#tap)                             | [`tap`](https://remedajs.com/docs/#tap)                           |
| [`times`](https://ramdajs.com/docs/#times)                         | [`times`](https://remedajs.com/docs/#times)                       |
| [`toPairs`](https://ramdajs.com/docs/#toPairs)                     | [`entries`](https://remedajs.com/docs/#entries)                   |
| [`uniq`](https://ramdajs.com/docs/#uniq)                           | [`unique`](https://remedajs.com/docs/#unique)                     |
| [`uniqBy`](https://ramdajs.com/docs/#uniqBy)                       | [`uniqueBy`](https://remedajs.com/docs/#uniqueBy)                 |
| [`uniqWith`](https://ramdajs.com/docs/#uniqWith)                   | [`uniqueWith`](https://remedajs.com/docs/#uniqueWith)             |
| [`where`](https://ramdajs.com/docs/#where)                         | [`hasSubobject`](https://remedajs.com/docs/#hasSubobject)         |

## Helpful one-liners

Some ramda functions don't have a Remeda equivalent, but can be easily replaced
with a one-liner in TypeScript. Some of the most common are listed below.

_TypeScript one-liners are not necessarily drop-in replacements that provide the
exact functionality of the listedRamda functions. Be sure to consult Ramda's
documentation and to check what features you are relying on when migrating._

| Ramda    | Remeda                                      |
| -------- | ------------------------------------------- |
| `append` | `(arr, val) => [...arr, val]`               |
| `max`    | `R.firstBy([R.identity, "desc"])`           |
| `maxBy`  | `R.firstBy([fn, "desc"])`                   |
| `min`    | `R.firstBy(R.identity)`                     |
| `minBy`  | `R.firstBy(fn)`                             |
| `nth`    | `n => a[n]`                                 |
| `reject` | `R.filter(R.isNot(fn))`                     |
| `zipObj` | `R.fromEntries.strict(R.zip(keys, values))` |
