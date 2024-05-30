# Runtime

No longer throws negative sample sizes or non-integer sample sizes, instead
returns an empty result. This aligns better with how the rest of the library
functions, and with how built-in functions handle these situations (e.g.
`slice(1.5)`)

## Examples

### Fails silently

```ts
// No longer throws:
sample([1, 2, 3], -1); // => []

// No longer throws:
sample([1, 2, 3], 2.5); // => []
```
