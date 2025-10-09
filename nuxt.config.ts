import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  pages: true,
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      // tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    plugins: [
      // tailwindcss(),
    ],
  },
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'index',
        path: '/',
        file: resolve(__dirname, './pages/index.vue')
      })
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    // '@nuxt/test-utils',
    '@nuxt/ui',
    'motion-v/nuxt',
    'nuxt-quasar-ui',
    '@nuxt/icon',
  ],
  quasar: {
    plugins: ['Notify', 'Loading'],
    // Дополнительная конфигурация (опционально)
    config: {
      notify: {
        position: 'top-right',
      }
    }
  },

  // Добавляем конфигурацию для ApexCharts
  build: {
    transpile: ['vue3-apexcharts']
  },

  ssr: {
    noExternal: ['vue3-apexcharts']
  }
})