import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({mode}) => {
  const wordpressBuild = mode === 'wordpress';

  return {
    plugins: [react(), tailwindcss()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ...(wordpressBuild && {
      publicDir: false,
      build: {
        outDir: path.resolve(__dirname, 'wordpress-theme/build'),
        emptyOutDir: true,
        manifest: 'manifest.json',
        rollupOptions: {
          input: path.resolve(__dirname, 'src/main.tsx'),
        },
      },
    }),
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
