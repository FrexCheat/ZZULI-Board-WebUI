import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       secure: false,
  //       target: 'https://board.frexlink.cn/api',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  plugins: [
    UnoCSS(),
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'typed-router.d.ts',
    }),
    vue(),
    Layouts({
      layoutsDirs: ['src/layouts'],
      pagesDirs: ['src/pages'],
    }),
    AutoImport({
      dirs: ['src/utils'],
      imports: ['vue', '@vueuse/core', VueRouterAutoImports],
      resolvers: [TDesignResolver({ library: 'vue-next', resolveIcons: true })],
      dts: 'auto-imports.d.ts',
    }),
    Components({
      resolvers: [TDesignResolver({ library: 'vue-next', resolveIcons: true })],
      dirs: ['src/components'],
      dts: 'components.d.ts',
    }),
  ],
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
