import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  plugins:
    mode === 'singlefile'
      ? [react(), viteSingleFile()]
      : [react()],
  base: './',
  server: {
    port: 5175,
    // Разрешаем доступ из Cloudflare Tunnel (общий публичный URL для друга)
    allowedHosts: ['.trycloudflare.com'],
  },
  build:
    mode === 'singlefile'
      ? {
          // Инлайним всё (JS+CSS+картинки) в один HTML
          assetsInlineLimit: 100_000_000,
          cssCodeSplit: false,
          rollupOptions: { output: { inlineDynamicImports: true } },
        }
      : {},
}));
