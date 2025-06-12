# 🎉 Remeda Sandbox

Welcome to the **Remeda StackBlitz Sandbox**! This environment allows you to
test and explore how remeda works before installing it in your own projects.

> **📋 What's this for?** This sandbox is automatically created for each Remeda
> PR, letting contributors and maintainers validate changes in a live
> environment with the latest code modifications.

## 🛠️ Available Tools

### 🧑‍💻 **Interactive Console**

- All Remeda utilities loaded globally
- Perfect for quick experimentation
- **Usage:** Runs automatically when the sandbox is started, or restart with
  `npm start`

### 🧪 **Test Suite**

- Pre-configured Vitest testing environment
- Test both runtime behavior and TypeScript types
- **Files:**
  - [Runtime](./src/runtime.test.ts)
  - [Typing](./src/typing.test-d.ts)
- **Usage:** `npm test` or use the Vitest VS Code extension

### 🎮 **TypeScript Playground**

- Experiment with type inference and transformations
- Uses relaxed TypeScript settings for easier experimentation
- **File:** [`playground.ts`](./src/playground.ts)
- **Config:** [`tsconfig.playground.json`](./tsconfig.playground.json)

---

**🔗 Need help?** React out to us at https://github.com/remeda/remeda/discussions.

**🐞 Something broken?** Report it at https://github.com/remeda/remeda/issues.
