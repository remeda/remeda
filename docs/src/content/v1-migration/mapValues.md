# Typing

The mapping function is no longer typed to accept symbol keys, it casts `number`
keys as strings, and the values of `symbol` keys are also not part of the typing
of the value parameter. Additionally, a third parameter was added with the whole
input object (this is similar to how the built-in `Array.prototype` functions
take a third param with the whole input array). In the vast majority of cases
this should not cause any changes.

The return type is now a stricter mapping of the input type, maintaining the
optionality of the keys. This would fix a common bug where the return type could
cause accessing non-existent properties (see example). It also filters out
`symbol` keys, as they cannot be mapped.

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
