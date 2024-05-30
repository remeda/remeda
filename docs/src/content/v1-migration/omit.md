# Runtime

Props with `symbol` keys are no longer omitted implicitly from the output, they
can be targeted from omission.

## Examples

### Symbol keys aren't omitted

```ts
const mySymbol = Symbol("a");
const DATA = { [mySymbol]: "hello", a: 123 };
const result = omit(DATA, ["a"]); // => { [mySymbol]: "hello" }, Was: {}
```

### Symbol keys can be omitted

```ts
const symbolA = Symbol("a");
const symbolB = Symbol("b");
const DATA = { [symbolA]: "hello", [symbolB]: 123 };
const result = omit(DATA, [symbolA]); // => { [symbolB]: 123 }, Was: {}
```
