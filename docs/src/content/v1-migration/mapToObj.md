# Typing

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The mapper now takes 2 additional parameters: `index` - The index of the current
element being processed in array, and `data` - the array the function was called
upon (the same signature the callbacks the built-in `Array.prototype` functions
have).

If you are using a function reference for the mapper (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Indexed variant removed

```ts
// Was
mapToObj.indexed(array, mapper);

// Now
mapToObj(array, mapper);
```

### Potential bug

```ts
function callback(key: string, index = 0) {
  return [key, index];
}

// Bug
mapToObj(["a", "b", "c"], callback); // => { a: 0, b: 1, c: 2 }, Was: { a: 0, b: 0, c: 0 }

// Fix
mapToObj(["a", "b", "c"], (item) => callback(item)); // => { a: 0, b: 0, c: 0 }
```
