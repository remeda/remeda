1. Guide: All Lodash functions under the "collection" group are actually hybrid
   array/object functions. This isn't supported very well by the @types/lodash
   package anyway, but we should provide some general instructions on how to
   approach this difference, mainly suggesting using `values`.

2. Guide: Lodash accepts `null | undefined` for most data inputs. We don't

3. Guide: most `iteratee` functions in lodash only take one argument, we usually
   take 3 params (index, data).

4. `pick`, `pickBy`, `omit`, and `omitBy` handle symbol keys differently. We
   need to compare this with how Lodash does it and document any differences.

5. Add special remeda flag (e.g., `candidate: true`) for mapping docs where
   functions are "Not provided by Remeda". When present, display a banner/UX
   element encouraging users to share their use-cases if they believe the
   function should be added, allowing us to re-assess past decisions based on
   real-world usage data. Articles to mark as candidates: `pad`, `padStart`,
   `padEnd`, `parseInt`, `repeat`, `replace`.

6. Add `padStart` and `padEnd` functions to Remeda for data-last ergonomics
   in pipes (e.g., `pipe(input, padStart(10, "0"))`) and better typing than
   native methods.

7. Consider adding `parseInt` function to Remeda for improved TypeScript
   literal type support.

8. Consider adding `repeat` function to Remeda for improved TypeScript literal
   type support. See type-fest `Repeat`

9. Consider adding `replace` for data-last support and maybe improved typing on
   some edge-cases, See type-fest `Replace`.
