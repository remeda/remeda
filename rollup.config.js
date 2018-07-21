import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';

export default {
  entry: './src/index.ts',
  output: [
    {
      file: pkg.main,
      name: 'remeda',
      format: 'umd',
      sourcemap: true,
    },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          noEmit: false,
          outDir: 'dist',
        },
      },
    }),
    commonjs(),
    sourceMaps(),
  ],
};
