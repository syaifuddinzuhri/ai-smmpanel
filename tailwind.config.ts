import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        dark: {
          900: '#0b0d1a',
          800: '#0f1220',
          700: '#111827',
          600: '#1a2035',
          500: '#1e2540'
        }
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)',
      }
    }
  },
  plugins: []
} satisfies Config
