import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// 使用 fileURLToPath 和 URL 构造函数获取目录路径
const rootDir = resolve(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@vue-nova': resolve(rootDir, 'packages'),
    },
  },
  build: {
    lib: {
      entry: resolve(rootDir, 'packages/components/src/index.ts'),
      name: 'VueNova',
      fileName: (format) => `vue-nova.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
