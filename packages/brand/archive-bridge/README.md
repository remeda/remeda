# Bridge mark (archived)

The original remeda logo design: the TypeScript-blue and JavaScript-yellow
panels side by side with the R standing across both - remeda as a native
citizen of the TS/JS ecosystem.

Superseded by the peel mark (see `packages/brand/`), which keeps the same materials
but claims depth instead of adjacency: the type layer peeled back over the
runtime layer, one letter printed through both in perfect registration.

This directory exists to be **deleted in the same pull request that adds the
new mark**, so the bridge survives in repository history (retrievable at the
commit that added it) without living in the working tree. Regenerate the
SVGs with:

```bash
node packages/brand/archive-bridge/generate.cjs
```

The wordmark and letter are Arimo (SIL Open Font License; see
`fonts/OFL.txt`).
