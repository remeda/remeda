# Typing

The `indexed` variant was removed; the base implementation takes the same
parameters. If you are using `indexed` you can simply remove it without any
other changes.

Symbol keys are no longer passed to the callback function, and their values are
also excluded from the typing.

Number keys are cast to strings when passed to the predicate.

# Runtime

The callback function now takes 2 additional parameters: `key` - The key of the
current entry being processed in data, and `data` - the object the function was
called upon (similar to the signature for callbacks in `Array.prototype`).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Indexed variant removed

```ts
// Was
forEachObj.indexed({ a: 1, b: 2 }, (value, key) => {
  console.log(`${key} => ${value}`);
});

// Now
forEachObj({ a: 1, b: 2 }, (value, key) => {
  console.log(`${key} => ${value}`);
});
```

### Symbol Keys

```ts
const mySymbol = Symbol("a");
forEachObj({ [mySymbol]: "hello", a: 123 }, (value, key) => {
  // value: 123, Was: 123 | "hello".
  // key: "a", Was: "a" | symbol.
});
```

### Number Keys

```ts
forEachObj({ 123: "hello" }, (value, key) => {
  // key: "123", Was: 123.
});
```

### Potential bug

```ts
function callback(value: number, key = "X"): boolean {
  console.log(`${key} => ${value}`);
}

// Bug
forEachObj({ a: 1, b: 2 }, callback); // "a => 1, b => 2", Was: "a => X, b => X"

// Fix
forEach({ a: 1, b: 2 }, (value) => callback(value)); // => "a => X, b => X"
```
