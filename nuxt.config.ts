export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://smmbuzzer.com',
    apiAdminKey: process.env.NUXT_API_ADMIN_KEY || '',         // Admin API → /adminapi/v2/orders
    apiV2Key: process.env.NUXT_API_V2_KEY || '',               // User/Reseller API → /api/v2
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    public: {
      panelUrl: process.env.NUXT_API_BASE_URL || 'https://smmbuzzer.com', // URL panel untuk tombol Beli
    },
  },

  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      script: [
        {
          innerHTML: `!function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light')}()`,
        }
      ],
      title: 'AI Rekomendasi Layanan — SmmBuzzer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI-powered SMM panel service recommendation dashboard' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: { configPath: '~/tailwind.config.ts' }
})
