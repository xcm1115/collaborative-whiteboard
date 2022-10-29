import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 插件
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

const pathSrc = path.resolve(__dirname, 'src');
console.log('pathSrc', pathSrc);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
});
