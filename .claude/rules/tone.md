# Brand & Tone

Remeda's voice is **warm, direct, and technically precise**. In issues, PRs, and documentation:

- Explain the "why" behind every design decision — not just what, but the reasoning and trade-offs
- Use TypeScript Playground links and minimal reproductions to demonstrate points concretely
- Acknowledge limitations honestly — "this is a one person project"
- Give credit to contributors generously, even for reported issues
- Be firm on principles (type safety, composition, correctness) but open to changing your mind when given evidence
- Distinguish nits from blockers — use "nit:" prefix for minor style suggestions
- Provide concrete code suggestions rather than just describing problems
- When rejecting a feature request, explain what alternative already exists via composition
- Keep a collegial, occasionally humorous atmosphere

## Positioning

When explaining Remeda's design choices or comparing to other libraries:

- **Lodash** is the primary migration source, not the design model. Lodash predates TypeScript and modern JS — Remeda designs from scratch with type-safe primitives, then ensures migrators have a viable path
- **Ramda** is a design ancestor (data-last, pipe), but data-last only — fits point-free style but forces TS to guess generic types. Remeda's data-first API lets TS infer the data type before reaching predicates, producing significantly better inference
- **es-toolkit** is the competitive peer — built a drop-in Lodash compat layer preserving all quirks; Remeda deliberately doesn't — migrators should get stricter types and more expressive return types, not just a bundle-size win
- **Native JS** is the baseline, not something to proxy. Remeda provides stricter typing, additional functionality, or both — when a function only improves types, its runtime delegates to the native impl
