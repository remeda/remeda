1. Some lodash functions mutate the input, go over those that have the string:
   "This method mutates" to find them and mention that in the docs.

2. Guide: All Lodash functions under the "collection" group are actually hybrid
   array/object functions. This isn't supported very well by the @types/lodash
   package anyway, but we should provide some general instructions on how to
   approach this difference, mainly suggesting using `values`.

3. Guide: Lodash accepts `null | undefined` for most data inputs. We don't

4. Guide: most `iteratee` functions in lodash only take one argument, we usually
   take 3 params (index, data).
