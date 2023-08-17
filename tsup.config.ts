import { defineConfig } from 'tsup';

export default defineConfig(ctx => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: !ctx.watch,
  dts: true,
  splitting: false,
  clean: !ctx.watch,
}));
