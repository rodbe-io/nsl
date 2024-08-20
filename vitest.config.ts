import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': './src',
      '@/adapters': './src/adapters',
      '@/models': './src/models',
      '@/tasks': './src/tasks',
      '@/utils': './src/utils',
    },
  },
});
