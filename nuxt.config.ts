export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://smmbuzzer.com',
    apiKey: process.env.NUXT_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },

  nitro: {
    preset: process.env.NETLIFY ? 'netlify' : undefined,
    storage: {
      // fs driver tidak tersedia di Netlify serverless — fallback ke memory
      data: process.env.NETLIFY
        ? { driver: 'memory' }
        : { driver: 'fs', base: './.data/kv' },
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'AI Rekomendasi Layanan — SmmPanel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI-powered SMM panel service recommendation dashboard' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: { configPath: '~/tailwind.config.ts' }
})
