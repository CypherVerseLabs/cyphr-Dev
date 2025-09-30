import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path'; // ✅ Import path module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'sdk/src'), // ✅ Alias @ to sdk/src
    },
  },
});