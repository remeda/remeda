# Typing

If you weren't using the `strict` variant, the returned type is now stricter and
more reflective of the input type. Instead of `string`, the keys are typed based
on the input type (similar to how `keyof T` works), all number keys are cast
as `strings`, and `symbol` keys are filtered out. For tuple inputs the returned
array is of the same _shape_ (e.g. if the input is non-empty, the output would
also be non-empty). This aligns with the runtime behavior of [`Object.keys`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys).
To achieve the legacy typing cast your object as a `Record<string, unknown>`.
If you are already using the `strict` variant simply remove the `.strict`
suffix.

## Examples

### Strict

```ts
// Was
keys.strict(obj);

// Now
keys(obj);
```

### Better typing

```ts
const result = keys({ a: 123 } as const);
//    ^? "a"[], Was: string[]
```

### Symbol keys

```ts
const mySymbol = Symbol("a");
keys({ [mySymbol]: 123 }); // => [];
```

### Number keys

```ts
keys({ 123: "hello" }); // ["123"];
```

### Legacy

```ts
const result = keys({ 123: "hello" } as Record<string, unknown>);
//    ^? string[]
```
