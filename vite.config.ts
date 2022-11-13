import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA()],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  // define: {
  //   global: {},
  // },
});
