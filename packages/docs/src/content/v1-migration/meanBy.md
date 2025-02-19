# Typing

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The mapper now takes 2 additional parameters: `index` - The index of the current
element being processed in array, and `data` - the array the function was called
upon (the same signature the callbacks the built-in `Array.prototype` functions
have).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Indexed variant removed

```ts
// Was
meanBy.indexed(array, mapper);

// Now
meanBy(array, mapper);
```

### Potential bug

```ts
// Bug
meanBy(["1", "2", "3"], parseInt); // => Nan, Was: 2

// Fix
meanBy(["1", "2", "3"], (item) => parseInt(item)); // => 2
```
