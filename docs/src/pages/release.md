---
layout: "../layouts/wiki.astro"
---

🎉 We are excited to announce the release of **Remeda v2**! 🎉

It's been nearly two years since our last major update, and this version is
packed with the improvements and changes you've been waiting for. This release
focuses on modernization and simplification, gathering many important updates
into one comprehensive release.

To make the transition as easy as possible we've prepared a [thorough migration
guide, which can be found on our documentation site](https://remedajs.com/v1#migration-intro).

# Highlights

- [**Modernized Runtime and TypeScript Support**](https://remedajs.com/v1#migration-environment):
  Remeda is now compiled with a target of **ES2022**, and the minimum TypeScript
  version is now **5.1**, allowing us to leverage the latest features for
  improved type safety and better runtime performance.
- [**Removed Variants**](https://remedajs.com/v1#migration-variants): The
  `indexed` and `strict` variants are now merged into the base functions, with
  indexed parameters and improved typing as defaults, respectively.
- [**Headless Invocation Changes**](https://remedajs.com/v1#migration-headless):
  Functions like `keys` and `identity` should now be called with no parameters
  to get their dataLast implementation; only type-guards remain headless.
- [**Function Renames and Removals**](https://remedajs.com/v1#migration-removed):
  We have aligned function names with ECMAScript standards (e.g., `toPairs` is
  now `entries`), and removed redundant functions that can be replaced with
  combinations of other functions (e.g., `compact` replaced with
  `filter(isTruthy)`).
- [**Object Keys Handling**](https://remedajs.com/v1#migration-keys): Typing
  changes better reflect JavaScript's handling of `symbol` and `number` keys.
- [**Re-Implementations**](https://remedajs.com/v1#migration-reimplementations):
  Several functions, including `clone`, `difference`, and `intersect`, have had
  their runtime implementations and semantics adjusted to handle edge cases more
  consistently.

We believe these changes will enhance your development experience, making Remeda
more powerful and easier to use. Thank you for being a part of the Remeda
community. If you encounter any issues or have questions, please reach out on
our [GitHub Issues page](https://github.com/remeda/remeda/issues). Happy coding!

### Go ahead and update!

```bash
npm install remeda@latest
yarn add remeda@latest
pnpm add remeda@latest
bun add remeda@latest
```

The Remeda Team
