import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'node:path';

// База путей для GitHub Pages приходит через env VITE_BASE_PATH
// (например '/stella/'). В dev и singlefile-режиме оставляем './'.
const PAGES_BASE = process.env.VITE_BASE_PATH || './';

export default defineConfig(({ mode }) => ({
  plugins:
    mode === 'singlefile'
      ? [react(), viteSingleFile()]
      : [react()],
  base: mode === 'singlefile' ? './' : PAGES_BASE,
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
