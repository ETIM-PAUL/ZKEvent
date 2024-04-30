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

  plugins: [react()],
});
