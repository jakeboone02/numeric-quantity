import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'numericQuantity',
      file: pkg.browser,
      format: 'umd',
    },
  },
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];
