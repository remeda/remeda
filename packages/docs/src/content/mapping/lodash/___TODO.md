1. Guide: All Lodash functions under the "collection" group are actually hybrid
   array/object functions. This isn't supported very well by the @types/lodash
   package anyway, but we should provide some general instructions on how to
   approach this difference, mainly suggesting using `values`.

2. Guide: Lodash accepts `null | undefined` for most data inputs. We don't

3. Guide: most `iteratee` functions in lodash only take one argument, we usually
   take 3 params (index, data).

4. `pick`, `pickBy`, `omit`, and `omitBy` handle symbol keys differently. We
   need to compare this with how Lodash does it and document any differences.

5. Add `toTitleCase` function to handle 45% of `words` usage (converting
   identifiers to readable labels). Research shows this is the most common
   Lodash string operation not covered by Remeda. Use proper name `toTitleCase`
   instead of `startCase` - matches Python's `str.title()` and .NET's
   `ToTitleCase()`. This single function enables composition-based migration
   for both `startCase` (direct replacement) and `lowerCase` (via
   `toLowerCase(toTitleCase(input))`).

6. Improve Unicode support in string utilities to match TypeScript's type-level
   transformations. Functions like `capitalize`, `uncapitalize`, and future
   `toTitleCase` should handle multi-code-unit Unicode characters (surrogate
   pairs) properly instead of using simple `data[0]` access which can split
   characters. This would ensure runtime behavior matches the Unicode support
   in TypeScript's `Lowercase`/`Uppercase`/`Capitalize` utility types for
   literal strings.
