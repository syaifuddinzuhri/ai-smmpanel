import { writeCache } from '../utils/db'

const FALLBACK = 16_000

export default defineTask({
  meta: {
    name: 'sync-kurs',
    description: 'Refresh kurs USD/IDR dari Frankfurter ke SQLite setiap 3 menit',
  },
  async run() {
    try {
      const res = await $fetch<{ rates: { IDR: number } }>(
        'https://api.frankfurter.app/latest?from=USD&to=IDR',
        { timeout: 5000 }
      )
      const rate = res.rates?.IDR ?? FALLBACK
      await writeCache('kurs:usd_idr', { rate })
      console.log(`[${new Date().toISOString()}] [sync:kurs] rate=$${1} = Rp ${rate}`)
      return { result: `rate=Rp ${rate}` }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[${new Date().toISOString()}] [sync:kurs] gagal: ${msg}`)
      return { result: `error: ${msg}` }
    }
  },
})
