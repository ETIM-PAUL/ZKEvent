import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
    exclude: ['fsevents'],
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      fsevents: 'fsevents/fsevents.js', // Specify the .js file instead of the .node file
    },
  },
  plugins: [react()],
});
