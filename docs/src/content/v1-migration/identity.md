# Typing

The "headless" mode of the function is no longer available. The function now
acts as a factory that creates an identity function. To fix headless cases
simply add parenthesis to the end: `identity` -> `identity()`.

## Examples

### No headless version

```ts
// Was
map(DATA, identity);

// Now
map(DATA, identity());
```
