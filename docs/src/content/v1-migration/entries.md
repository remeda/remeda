# Typing

The `strict` variant was promoted to the base type, and was refined further to
exclude `symbol` keys, and to convert all number keys to `string`, to match the
runtime return type of [`Object.entries`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
which is used as the implementation.

If you are already using `entries.strict` simply remove the `.strict` suffix.

## Examples

### Strict

```ts
// Was
entries.strict(obj);

// Now
entries(obj);
```

### Better typing

```ts
const result = entries({ a: 123 } as const);
//    ^? ['a', 123][], Was: [string, number][]
```

### Symbol keys

```ts
const mySymbol = Symbol("a");

// Was
const result = entries.strict({ [mySymbol]: 123, a: 456 } as const);
//    ^? ([typeof mySymbol, 123] | [a, 456])[]

// Now
const result = entries({ [mySymbol]: 123, a: 456 } as const);
//    ^? ['a', 456][]
```

### Number keys

```ts
// Was
const result = entries.strict({ 123: "hello" } as const);
//    ^? [123, "hello"][]

// Now
const result = entries({ 123: "hello" } as const);
//    ^? ['123', "hello"][]
```
