import { defineConfig } from 'tsup';

export default defineConfig(ctx => ({
  entry: ['src'],
  minify: !ctx.watch,
  dts: true,
  external: [/.(test).(ts)$/],
  splitting: false,
  sourcemap: !ctx.watch,
  clean: !ctx.watch,
}));
