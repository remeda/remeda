# Typing

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

# Runtime

The mapper function now takes 2 additional parameters: `index` - The index of
the current element being processed in array, and `data` - the array the
function was called upon (the same signature the callbacks the built-in
`Array.prototype` functions have). The first call to the mapper function will
be called with an `undefined` index, this is for the item being inserted.

If you are using a function _reference_ for the mapper (and not an inline
arrow function), and that function accepts more than one param you might run
into compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Indexed variant removed

```ts
// Was
sortedLastIndexBy.indexed(array, mapper);

// Now
sortedLastIndexBy(array, mapper);
```

### Potential bug

```ts
// Bug
sortedLastIndexBy(["1", "10"], "2", parseInt); // => 2, Was: 1

// Fix
sortedLastIndexBy(["1", "10"], "2", (item) => parseInt(item)); // => 1
```
