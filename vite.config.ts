import { defineConfig } from 'vite';

// 最小配置：根目录 src，端口 5173
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
