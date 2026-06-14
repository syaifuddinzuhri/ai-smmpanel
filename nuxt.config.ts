const brand = process.env.NUXT_PUBLIC_APP_BRAND || 'smmbuzzer'

const brandConfig: Record<string, { name: string; tagline: string; metaTitle: string; metaDesc: string }> = {
  smmbuzzer: {
    name: 'SmmBuzzer',
    tagline: 'Monitoring Layanan',
    metaTitle: 'AI Rekomendasi Layanan — SmmBuzzer',
    metaDesc: 'AI-powered SMM panel service recommendation dashboard by SmmBuzzer',
  },
  djuragan: {
    name: 'Djuragan Sosmed',
    tagline: 'Monitoring Layanan',
    metaTitle: 'AI Rekomendasi Layanan — Djuragan Sosmed',
    metaDesc: 'AI-powered SMM panel service recommendation dashboard by Djuragan Sosmed',
  },
}

const app = brandConfig[brand] ?? brandConfig.smmbuzzer

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || 'https://smmbuzzer.com',
    apiAdminKey: process.env.NUXT_API_ADMIN_KEY || '',
    apiV2Key: process.env.NUXT_API_V2_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    public: {
      panelUrl:    process.env.NUXT_API_BASE_URL || 'https://smmbuzzer.com',
      appBrand:    brand,
      appName:     app.name,
      appTagline:  app.tagline,
      appMetaTitle: app.metaTitle,
      appMetaDesc:  app.metaDesc,
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
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `/${brand}/favicon.ico` },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: { configPath: '~/tailwind.config.ts' }
})
