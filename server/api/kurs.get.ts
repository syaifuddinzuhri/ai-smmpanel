import { readCache, writeCache } from '../utils/db'

const FALLBACK = 16_000

interface KursCache { rate: number }

export default defineEventHandler(async () => {
  const cached = await readCache<KursCache>('kurs:usd_idr')
  if (cached) return { rate: cached.data.rate, source: 'cache' as const }

  // Cache belum ada (first boot sebelum cron jalan) — fetch langsung
  try {
    const res = await $fetch<{ rates: { IDR: number } }>(
      'https://api.frankfurter.app/latest?from=USD&to=IDR',
      { timeout: 5000 }
    )
    const rate = res.rates?.IDR ?? FALLBACK
    await writeCache('kurs:usd_idr', { rate })
    return { rate, source: 'live' as const }
  } catch {
    return { rate: FALLBACK, source: 'fallback' as const }
  }
})
