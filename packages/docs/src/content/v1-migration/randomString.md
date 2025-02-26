# Typing

The "headless" mode of the function is no longer available. For dataLast
invocations use `randomString()`.

## Examples

### No headless version

```ts
// Was:
map([1, 2, 3], randomString);

// Now:
map([1, 2, 3], randomString());
```
