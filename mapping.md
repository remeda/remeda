# Mapping for Lodash and Ramda

_Remeda functions are not necessarily drop-in replacements for the
listed Lodash and Ramda functions. Just as the Lodash function may behave
differently than the Ramda equivalent, the Remeda function may also
behave differently from either or both. Be sure to consult each library's
documentation when migrating._

| Remeda                                                              | Lodash                                                                   | Ramda                                                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [`add`](https://remedajs.com/docs/#add)                             | [`add`](https://lodash.com/docs/4.17.15#add)                             | [`add`](https://ramdajs.com/docs/#add)                             |
| [`addProp`](https://remedajs.com/docs/#addProp)                     | [`set`](https://lodash.com/docs/4.17.15#set)                             | [`set`](https://ramdajs.com/docs/#set)                             |
| [`allPass`](https://remedajs.com/docs/#allPass)                     |                                                                          | [`allPass`](https://ramdajs.com/docs/#allPass)                     |
| [`anyPass`](https://remedajs.com/docs/#anyPass)                     |                                                                          | [`anyPass`](https://ramdajs.com/docs/#anyPass)                     |
| [`ceil`](https://remedajs.com/docs/#ceil)                           | [`ceil`](https://lodash.com/docs/4.17.15#ceil)                           |                                                                    |
| [`chunk`](https://remedajs.com/docs/#chunk)                         | [`chunk`](https://lodash.com/docs/4.17.15#chunk)                         |                                                                    |
| [`clamp`](https://remedajs.com/docs/#clamp)                         | [`clamp`](https://lodash.com/docs/4.17.15#clamp)                         | [`clamp`](https://ramdajs.com/docs/#clamp)                         |
| [`clone`](https://remedajs.com/docs/#clone)                         | [`cloneDeep`](https://lodash.com/docs/4.17.15#cloneDeep)                 | [`clone`](https://ramdajs.com/docs/#clone)                         |
| [`concat`](https://remedajs.com/docs/#concat)                       | [`concat`](https://lodash.com/docs/4.17.15#concat)                       | [`concat`](https://ramdajs.com/docs/#concat)                       |
| [`conditional`](https://remedajs.com/docs/#conditional)             | [`cond`](https://lodash.com/docs/4.17.15#cond)                           | [`cond`](https://ramdajs.com/docs/#cond)                           |
| [`constant`](https://remedajs.com/docs/#constant)                   | [`constant`](https://lodash.com/docs/4.17.15#constant)                   | [`always`](https://ramdajs.com/docs/#always)                       |
| [`debounce`](https://remedajs.com/docs/#debounce)                   | [`debounce`](https://lodash.com/docs/4.17.15#debounce)                   |                                                                    |
| [`difference`](https://remedajs.com/docs/#difference)               | [`difference`](https://lodash.com/docs/4.17.15#difference)               | [`difference`](https://ramdajs.com/docs/#difference)               |
| [`differenceWith`](https://remedajs.com/docs/#differenceWith)       | [`differenceWith`](https://lodash.com/docs/4.17.15#differenceWith)       | [`differenceWith`](https://ramdajs.com/docs/#differenceWith)       |
| [`divide`](https://remedajs.com/docs/#divide)                       | [`divide`](https://lodash.com/docs/4.17.15#divide)                       | [`divide`](https://ramdajs.com/docs/#divide)                       |
| [`drop`](https://remedajs.com/docs/#drop)                           | [`drop`](https://lodash.com/docs/4.17.15#drop)                           | [`drop`](https://ramdajs.com/docs/#drop)                           |
| [`dropLastWhile`](https://remedajs.com/docs/#dropLastWhile)         | [`dropRightWhile`](https://lodash.com/docs/4.17.15#dropRightWhile)       | [`dropLastWhile`](https://ramdajs.com/docs/#dropLastWhile)         |
| [`takeLast`](https://remedajs.com/docs/#takeLast)                   | [`takeRight`](https://lodash.com/docs/4.17.15#takeRight)                 | [`takeLast`](https://ramdajs.com/docs/#takeLast)                   |
| [`dropWhile`](https://remedajs.com/docs/#dropWhile)                 | [`dropWhile`](https://lodash.com/docs/4.17.15#dropWhile)                 | [`dropWhile`](https://ramdajs.com/docs/#dropWhile)                 |
| [`entries`](https://remedajs.com/docs/#entries)                     | [`toPairs`](https://lodash.com/docs/4.17.15#toPairs)                     | [`toPairs`](https://ramdajs.com/docs/#toPairs)                     |
| [`evolve`](https://remedajs.com/docs/#evolve)                       |                                                                          | [`evolve`](https://ramdajs.com/docs/#evolve)                       |
| [`filter`](https://remedajs.com/docs/#filter)                       | [`filter`](https://lodash.com/docs/4.17.15#filter)                       | [`filter`](https://ramdajs.com/docs/#filter)                       |
| [`find`](https://remedajs.com/docs/#find)                           | [`find`](https://lodash.com/docs/4.17.15#find)                           | [`find`](https://ramdajs.com/docs/#find)                           |
| [`findIndex`](https://remedajs.com/docs/#findIndex)                 | [`findIndex`](https://lodash.com/docs/4.17.15#findIndex)                 | [`findIndex`](https://ramdajs.com/docs/#findIndex)                 |
| [`findLast`](https://remedajs.com/docs/#findLast)                   | [`findLast`](https://lodash.com/docs/4.17.15#findLast)                   | [`findLast`](https://ramdajs.com/docs/#findLast)                   |
| [`findLastIndex`](https://remedajs.com/docs/#findLastIndex)         | [`findLastIndex`](https://lodash.com/docs/4.17.15#findLastIndex)         | [`findLastIndex`](https://ramdajs.com/docs/#findLastIndex)         |
| [`first`](https://remedajs.com/docs/#first)                         | [`head`](https://lodash.com/docs/4.17.15#head)                           | [`head`](https://ramdajs.com/docs/#head)                           |
| [`flat`](https://remedajs.com/docs/#flat)                           | [`flatten`](https://lodash.com/docs/4.17.15#flatten)                     | [`flatten`](https://ramdajs.com/docs/#flatten)                     |
| [`flat`](https://remedajs.com/docs/#flattenDeep)                    | [`flattenDeep`](https://lodash.com/docs/4.17.15#flattenDeep)             |                                                                    |
| [`flatMap`](https://remedajs.com/docs/#flatMap)                     | [`flatMap`](https://lodash.com/docs/4.17.15#flatMap)                     | [`chain`](https://ramdajs.com/docs/#chain)                         |
| [`floor`](https://remedajs.com/docs/#floor)                         | [`floor`](https://lodash.com/docs/4.17.15#floor)                         |                                                                    |
| [`forEach`](https://remedajs.com/docs/#forEach)                     | [`forEach`](https://lodash.com/docs/4.17.15#forEach)                     | [`forEach`](https://ramdajs.com/docs/#forEach)                     |
| [`forEachObj`](https://remedajs.com/docs/#forEachObj)               | [`forEach`](https://lodash.com/docs/4.17.15#forEach)                     | [`forEachObjIndexed`](https://ramdajs.com/docs/#forEachObjIndexed) |
| [`groupBy`](https://remedajs.com/docs/#groupBy)                     | [`groupBy`](https://lodash.com/docs/4.17.15#groupBy)                     | [`groupBy`](https://ramdajs.com/docs/#groupBy)                     |
| [`hasSubobject`](https://remedajs.com/docs/#hasSubobject)           | [`isMatch`](https://lodash.com/docs/4.17.15#isMatch)                     | [`where`](https://ramdajs.com/docs/#where)                         |
| [`identity`](https://remedajs.com/docs/#identity)                   | [`identity`](https://lodash.com/docs/4.17.15#identity)                   | [`identity`](https://ramdajs.com/docs/#identity)                   |
| [`indexBy`](https://remedajs.com/docs/#indexBy)                     | [`keyBy`](https://lodash.com/docs/4.17.15#keyBy)                         | [`indexBy`](https://ramdajs.com/docs/#indexBy)                     |
| [`intersection`](https://remedajs.com/docs/#intersection)           | [`intersection`](https://lodash.com/docs/4.17.15#intersection)           | [`intersection`](https://ramdajs.com/docs/#intersection)           |
| [`intersectionWith`](https://remedajs.com/docs/#intersectionWith)   | [`intersectionWith`](https://lodash.com/docs/4.17.15#intersectionWith)   | [`innerJoin`](https://ramdajs.com/docs/#innerJoin)                 |
| [`invert`](https://remedajs.com/docs/#invert)                       | [`invert`](https://lodash.com/docs/4.17.15#invert)                       | [`invertObj`](https://ramdajs.com/docs/#invertObj)                 |
| [`isDeepEqual`](https://remedajs.com/docs/#isDeepEqual)             | [`isEqual`](https://lodash.com/docs/4.17.15#isEqual)                     | [`equals`](https://ramdajs.com/docs/#equals)                       |
| [`isEmpty`](https://remedajs.com/docs/#isEmpty)                     | [`isEmpty`](https://lodash.com/docs/4.17.15#isEmpty)                     | [`isEmpty`](https://ramdajs.com/docs/#isEmpty)                     |
| [`isNonNullish`](https://remedajs.com/docs/#isNonNullish)           |                                                                          | [`isNotNil`](https://ramdajs.com/docs/#isNotNil)                   |
| [`isNullish`](https://remedajs.com/docs/#isNullish)                 | [`isNil`](https://lodash.com/docs/4.17.15#isNil)                         | [`isNil`](https://ramdajs.com/docs/#isNil)                         |
| [`isObjectType`](https://remedajs.com/docs/#isObjectType)           | [`isObjectLike`](https://lodash.com/docs/4.17.15#isObjectLike)           |                                                                    |
| [`isPlainObject`](https://remedajs.com/docs/#isPlainObject)         | [`isPlainObject`](https://lodash.com/docs/4.17.15#isPlainObject)         |                                                                    |
| [`isSymbol`](https://remedajs.com/docs/#isSymbol)                   | [`isSymbol`](https://lodash.com/docs/4.17.15#isSymbol)                   |                                                                    |
| [`join`](https://remedajs.com/docs/#join)                           | [`join`](https://lodash.com/docs/4.17.15#join)                           | [`join`](https://ramdajs.com/docs/#join)                           |
| [`last`](https://remedajs.com/docs/#last)                           | [`last`](https://lodash.com/docs/4.17.15#last)                           | [`last`](https://ramdajs.com/docs/#last)                           |
| [`length`](https://remedajs.com/docs/#length)                       | [`size`](https://lodash.com/docs/4.17.15#size)                           | [`length`](https://ramdajs.com/docs/#length)                       |
| [`map`](https://remedajs.com/docs/#map)                             | [`map`](https://lodash.com/docs/4.17.15#map)                             | [`map`](https://ramdajs.com/docs/#map)                             |
| [`mapKeys`](https://remedajs.com/docs/#mapKeys)                     | [`mapKeys`](https://lodash.com/docs/4.17.15#mapKeys)                     |                                                                    |
| [`mapValues`](https://remedajs.com/docs/#mapValues)                 | [`mapValues`](https://lodash.com/docs/4.17.15#mapValues)                 | [`mapValues`](https://ramdajs.com/docs/#mapObjIndexed)             |
| [`mapWithFeedback`](https://remedajs.com/docs/#mapWithFeedback)     |                                                                          | [`scan`](https://ramdajs.com/docs/#scan)                           |
| [`meanBy`](https://remedajs.com/docs/#meanBy)                       | [`meanBy`](https://lodash.com/docs/4.17.15#meanBy)                       |                                                                    |
| [`merge`](https://remedajs.com/docs/#merge)                         | [`assign`](https://lodash.com/docs/4.17.15#assign)                       | [`merge`](https://ramdajs.com/docs/#merge)                         |
| [`mergeAll`](https://remedajs.com/docs/#mergeAll)                   | [`assign`](https://lodash.com/docs/4.17.15#assign)                       | [`mergeAll`](https://ramdajs.com/docs/#mergeAll)                   |
| [`mergeDeep`](https://remedajs.com/docs/#mergeDeep)                 |                                                                          | [`mergeDeepRight`](https://ramdajs.com/docs/#mergeDeepRight)       |
| [`multiply`](https://remedajs.com/docs/#multiply)                   | [`multiply`](https://lodash.com/docs/4.17.15#multiply)                   | [`multiply`](https://ramdajs.com/docs/#multiply)                   |
| [`objOf`](https://remedajs.com/docs/#objOf)                         |                                                                          | [`objOf`](https://ramdajs.com/docs/#objOf)                         |
| [`omit`](https://remedajs.com/docs/#omit)                           | [`omit`](https://lodash.com/docs/4.17.15#omit)                           | [`omit`](https://ramdajs.com/docs/#omit)                           |
| [`omitBy`](https://remedajs.com/docs/#omitBy)                       | [`omitBy`](https://lodash.com/docs/4.17.15#omitBy)                       |                                                                    |
| [`once`](https://remedajs.com/docs/#once)                           | [`once`](https://lodash.com/docs/4.17.15#once)                           | [`once`](https://ramdajs.com/docs/#once)                           |
| [`partition`](https://remedajs.com/docs/#partition)                 | [`partition`](https://lodash.com/docs/4.17.15#partition)                 | [`partition`](https://ramdajs.com/docs/#partition)                 |
| [`pathOr`](https://remedajs.com/docs/#pathOr)                       | [`get`](https://lodash.com/docs/4.17.15#get)                             | [`pathOr`](https://ramdajs.com/docs/#pathOr)                       |
| [`pick`](https://remedajs.com/docs/#pick)                           | [`pick`](https://lodash.com/docs/4.17.15#pick)                           | [`pick`](https://ramdajs.com/docs/#pick)                           |
| [`pickBy`](https://remedajs.com/docs/#pickBy)                       | [`pickBy`](https://lodash.com/docs/4.17.15#pickBy)                       | [`pickBy`](https://ramdajs.com/docs/#pickBy)                       |
| [`pipe`](https://remedajs.com/docs/#pipe)                           | [`flow`](https://lodash.com/docs/4.17.15#flow)                           | [`pipe`](https://ramdajs.com/docs/#pipe)                           |
| [`product`](https://remedajs.com/docs/#product)                     |                                                                          | [`product`](https://ramdajs.com/docs/#product)                     |
| [`prop`](https://remedajs.com/docs/#prop)                           | [`get`](https://lodash.com/docs/4.17.15#get)                             | [`prop`](https://ramdajs.com/docs/#prop)                           |
| [`randomString`](https://remedajs.com/docs/#randomString)           |                                                                          |                                                                    |
| [`range`](https://remedajs.com/docs/#range)                         | [`range`](https://lodash.com/docs/4.17.15#range)                         | [`range`](https://ramdajs.com/docs/#range)                         |
| [`reduce`](https://remedajs.com/docs/#reduce)                       | [`reduce`](https://lodash.com/docs/4.17.15#reduce)                       | [`reduce`](https://ramdajs.com/docs/#reduce)                       |
| [`reverse`](https://remedajs.com/docs/#reverse)                     | [`reverse`](https://lodash.com/docs/4.17.15#reverse)                     | [`reverse`](https://ramdajs.com/docs/#reverse)                     |
| [`round`](https://remedajs.com/docs/#round)                         | [`round`](https://lodash.com/docs/4.17.15#round)                         |                                                                    |
| [`sample`](https://remedajs.com/docs/#sample)                       | [`sampleSize`](https://lodash.com/docs/4.17.15#)\*                       |                                                                    |
| [`set`](https://remedajs.com/docs/#set)                             | [`set`](https://lodash.com/docs/4.17.15#set)                             | [`assoc`](https://ramdajs.com/docs/#assoc)                         |
| [`setPath`](https://remedajs.com/docs/#setPath)                     | [`set`](https://lodash.com/docs/4.17.15#set)                             | [`assocPath`](https://ramdajs.com/docs/#assocPath)                 |
| [`shuffle`](https://remedajs.com/docs/#shuffle)                     | [`shuffle`](https://lodash.com/docs/4.17.15#shuffle)                     |                                                                    |
| [`sort`](https://remedajs.com/docs/#sort)                           |                                                                          | [`sort`](https://ramdajs.com/docs/#sort)                           |
| [`sortBy`](https://remedajs.com/docs/#sortBy)                       | [`orderBy`](https://lodash.com/docs/4.17.15#orderBy)                     |                                                                    |
| [`sortBy`](https://remedajs.com/docs/#sortBy)                       | [`sortBy`](https://lodash.com/docs/4.17.15#sortBy)                       | [`sortBy`](https://ramdajs.com/docs/#sortBy)                       |
| [`sortedIndex`](https://remedajs.com/docs/#sortedIndex)             | [`sortedIndex`](https://lodash.com/docs/4.17.15#sortedIndex)             |                                                                    |
| [`sortedIndexBy`](https://remedajs.com/docs/#sortedIndexBy)         | [`sortedIndexBy`](https://lodash.com/docs/4.17.15#sortedIndexBy)         |                                                                    |
| [`sortedLastIndex`](https://remedajs.com/docs/#sortedLastIndex)     | [`sortedLastIndex`](https://lodash.com/docs/4.17.15#sortedLastIndex)     |                                                                    |
| [`sortedLastIndexBy`](https://remedajs.com/docs/#sortedLastIndexBy) | [`sortedLastIndexBy`](https://lodash.com/docs/4.17.15#sortedLastIndexBy) |                                                                    |
| [`splice`](https://remedajs.com/docs/#splice)                       |                                                                          | [`remove`](https://ramdajs.com/docs/#remove)                       |
| [`splitAt`](https://remedajs.com/docs/#splitAt)                     |                                                                          | [`splitAt`](https://ramdajs.com/docs/#splitAt)                     |
| [`splitWhen`](https://remedajs.com/docs/#splitWhen)                 |                                                                          | [`splitWhen`](https://ramdajs.com/docs/#splitWhen)                 |
| [`stringToPath`](https://remedajs.com/docs/#stringToPath)           | [`toPath`](https://lodash.com/docs/4.17.15#toPath)                       |                                                                    |
| [`subtract`](https://remedajs.com/docs/#subtract)                   | [`subtract`](https://lodash.com/docs/4.17.15#subtract)                   | [`subtract`](https://ramdajs.com/docs/#subtract)                   |
| [`sum`](https://remedajs.com/docs/#sum)                             | [`sum`](https://lodash.com/docs/4.17.15#sum)                             | [`sum`](https://ramdajs.com/docs/#sum)                             |
| [`sumBy`](https://remedajs.com/docs/#sumBy)                         | [`sumBy`](https://lodash.com/docs/4.17.15#sumBy)                         |                                                                    |
| [`swapIndices`](https://remedajs.com/docs/#swapIndices)             |                                                                          | [`swap`](https://ramdajs.com/docs/#swap)                           |
| [`swapProps`](https://remedajs.com/docs/#swapProps)                 |                                                                          | [`swap`](https://ramdajs.com/docs/#swap)                           |
| [`take`](https://remedajs.com/docs/#take)                           | [`take`](https://lodash.com/docs/4.17.15#take)                           | [`take`](https://ramdajs.com/docs/#take)                           |
| [`takeLastWhile`](https://remedajs.com/docs/#takeLastWhile)         | [`takeRightWhile`](https://lodash.com/docs/4.17.15#takeRightWhile)       | [`takeLastWhile`](https://ramdajs.com/docs/#takeLastWhile)         |
| [`takeWhile`](https://remedajs.com/docs/#takeWhile)                 | [`takeWhile`](https://lodash.com/docs/4.17.15#takeWhile)                 | [`takeWhile`](https://ramdajs.com/docs/#takeWhile)                 |
| [`tap`](https://remedajs.com/docs/#tap)                             | [`tap`](https://lodash.com/docs/4.17.15#tap)                             | [`tap`](https://ramdajs.com/docs/#tap)                             |
| [`times`](https://remedajs.com/docs/#times)                         | [`times`](https://lodash.com/docs/4.17.15#times)                         | [`times`](https://ramdajs.com/docs/#times)                         |
| [`unique`](https://remedajs.com/docs/#unique)                       | [`uniq`](https://lodash.com/docs/4.17.15#uniq)                           | [`uniq`](https://ramdajs.com/docs/#uniq)                           |
| [`uniqueBy`](https://remedajs.com/docs/#uniqueBy)                   | [`uniqBy`](https://lodash.com/docs/4.17.15#uniqBy)                       | [`uniqBy`](https://ramdajs.com/docs/#uniqBy)                       |
| [`uniqueWith`](https://remedajs.com/docs/#uniqueWith)               | [`uniqWith`](https://lodash.com/docs/4.17.15#uniqWith)                   | [`uniqWith`](https://ramdajs.com/docs/#uniqWith)                   |

## Helpful one-liners

Some lodash and ramda functions don't have a Remeda equivalent, but can be
easily replaced with a one-liner in TypeScript. Some of the most common
are listed below.

_TypeScript one-liners are not necessarily drop-in replacements that
provide the exact functionality of the listed Lodash and Ramda functions.
Be sure to consult each library's documentation and to check what features
you are relying on when migrating._

| Remeda                                                                         | Lodash       | Ramda    |
| ------------------------------------------------------------------------------ | ------------ | -------- |
| `(arr, val) => [...arr, val]`                                                  |              | `append` |
| `a?.b?.c`                                                                      | `path`       |          |
| `n => a[n]`                                                                    | `nth`        | `nth`    |
| `R.constant(undefined)`                                                        | `noop`       |          |
| `R.filter((item, index, array) => index === 0 \|\| item !== array[index - 1])` | `sortedUniq` |          |
| `R.filter(R.isNot(fn))`                                                        | `reject`     | `reject` |
| `R.filter(R.isTruthy)`                                                         | `compact`    |          |
| `R.firstBy([fn, "desc"])`                                                      | `maxBy`      | `maxBy`  |
| `R.firstBy([R.identity, "desc"])`                                              | `max`        | `max`    |
| `R.firstBy(fn)`                                                                | `minBy`      | `minBy`  |
| `R.firstBy(R.identity)`                                                        | `min`        | `min`    |
| `R.fromEntries.strict(R.zip(keys, values))`                                    | `zipObj`     | `zipObj` |
| `str => str.split(/\s+/)`                                                      | `words`      |          |
| `x => x.a ?? defaultValue`                                                     | `propOr`     |          |
| `x => x.a === value`                                                           | `propEq`     |          |
