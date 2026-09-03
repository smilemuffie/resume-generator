import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 最小配置：根目录 src，端口 5173
export default defineConfig({
  root: '.',
  // 相对路径：build 后可直接用 file:// 打开 dist/index.html，无需起服务器
  base: './',
  server: {
    port: 5173,
    open: false
  },
  plugins: [viteSingleFile()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 全部内联到单个 index.html：JS 改为 IIFE，CSS 内联为 <style>，资源 base64
    assetsInlineLimit: 100000000,
    cssCodeSplit: false
  }
});
