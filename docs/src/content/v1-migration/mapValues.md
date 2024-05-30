# Typing

The mapping function is typed to no longer accept `symbol` keys or their
corresponding values, and `number` keys will be cast as `string`, Aligning with
the result of [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
on the input object). In the vast majority of cases this should not cause any
breakages.

The return type is now a stricter mapping of the input type, maintaining the
optionality of the keys. This would fix a common bug where the return type could
cause accessing non-existent properties (see example). It also filters out
`symbol` keys, as they cannot be mapped.

# Runtime

A third parameter was added to the predicate with the input object that was
passed into the function (this is similar to how the built-in `Array.prototype`
functions take a third param with the input array).

If you are using a function reference for the predicate (and not an inline arrow
function), and that function accepts more than one param you might run into
compile-time (or run-time!) issues because of the extra params being sent on
each invocation of the function. We highly recommend using [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md)
to warn against these issues.

## Examples

### Mapper typing

```ts
const mySymbol = Symbol("a");
mapValues({ [mySymbol]: "hello", a: 123, 456: true }, (key, value) => {
  // key: "a" | "456", Was symbol | "a" | 456;
  // value: number | boolean, Was string | number | boolean;
});
```

### Input shape is preserved

```ts
const DATA = { a: 123 } as { a: number; b?: boolean };

const result = mapValues(DATA, constant("hello"));
//    ^? { a: string, b?: string }, Was: Record<"a" | "b", string>

// We don't know in compile time if the object contains the "b" prop or not, and
// thus might not exist on the output object either, therefore it's a mistake to
// assume that the type of the prop would be `string`.
console.log(result.b);
//                 ^? string | undefined, Was: string
```

### Symbol keys are removed

```ts
const mySymbol = Symbol("a");

const DATA = { [mySymbol]: "hello", a: 123 } as {
  [mySymbol]: string;
  a: number;
};

const result = mapValues(DATA, constant(456));
//    ^? { a: number }, Was: Record<symbol | "a", number>
```

### Potential bug

```ts
function callback(
  value: string,
  key: string,
  obj: Record<string, string> = {},
): boolean {
  return `${key}${value}${Object.keys(obj).length}`;
}

// Bug
mapValues({ a: "hello" }, callback); // => { a: "ahello1" }, Was: { a: "ahello" }

// Fix
mapValues({ a: "hello" }, (value, key) => callback(value, key)); // => { a: "ahello" }
```
