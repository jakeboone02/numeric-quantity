import typescriptPlugin from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/numeric-quantity.ts',
  output: [
    { file: pkg.browser, format: 'umd', name: 'numericQuantity' },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [
    typescriptPlugin({
      typescript: require('typescript'),
    }),
  ],
};
