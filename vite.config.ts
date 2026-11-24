import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative asset paths work anywhere (GitHub Pages, sub-paths, custom domains)
  server: {
    port: 5173,
    host: true,
  },
});
