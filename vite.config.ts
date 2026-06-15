import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'node:path';

// Base путь передаётся через CLI (`vite build --base=/stella/`) в Pages-workflow.
// В dev и singlefile-режиме оставляем './'.
export default defineConfig(({ mode }) => ({
  plugins:
    mode === 'singlefile'
      ? [react(), viteSingleFile()]
      : [react()],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5175,
    allowedHosts: ['.trycloudflare.com', '.cfargotunnel.com'],
  },
  build:
    mode === 'singlefile'
      ? {
          assetsInlineLimit: 100_000_000,
          cssCodeSplit: false,
          rollupOptions: { output: { inlineDynamicImports: true } },
        }
      : {},
}));
