import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: format => `numeric-quantity.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
      name: 'numericQuantity',
    },
    sourcemap: true,
  },
  server: {
    open: '/main.html',
  },
});
