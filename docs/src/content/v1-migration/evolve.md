# Typing

Symbol keys were previously skipped silently during runtime, the typing is now
fixed to prevent defining transformers for these keys.

## Examples

### Symbol keys

```ts
const mySymbol = Symbol("a");

// This was fine in v1, will now raise a Typescript error.
evolve({ [mySymbol]: 123 }, { [mySymbol]: add(1) });
```
