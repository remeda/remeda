# Runtime

The function no longer looks for a `lazy` prop on the dataFirst function
implementation itself, and will only use the lazy impl provided as the third
argument to the `purry` call itself.

## Examples

### Implicit lazy removed (with Object.assign)

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(withLazy, args);

  // Now:
  return purry(dataFirstImpl, args, lazyImpl);
}

// This can be removed now:
function withLazy = Object.assign(dataFirstImpl, { lazy: lazyImpl });

function dataFirstImpl(...) {
  // ...
}

function lazyImpl(...): LazyEvaluator {
  // ...
}
```

### Implicit lazy removed (with a namespace)

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(dataFirstImpl, args);

  // Now:
  return purry(dataFirstImpl, args, lazyImpl);
}

function dataFirstImpl(...) {
  // ...
}

// This can be removed now:
namespace dataFirstImpl {
  export const lazy = lazyImpl;
}

function lazyImpl(...): LazyEvaluator {
  // ...
}
```
