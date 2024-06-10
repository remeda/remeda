1. Guide: All Lodash functions under the "collection" group are actually hybrid
   array/object functions. This isn't supported very well by the @types/lodash
   package anyway, but we should provide some general instructions on how to
   approach this difference, mainly suggesting using `values`.

2. Guide: Lodash accepts `null | undefined` for most data inputs. We don't

3. Guide: most `iteratee` functions in lodash only take one argument, we usually
   take 3 params (index, data).

4. `pick`, `pickBy`, `omit`, and `omitBy` handle symbol keys differently. We
   need to compare this with how Lodash does it and document any differences.
