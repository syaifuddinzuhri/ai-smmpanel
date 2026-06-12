export interface RawService {
  service: number
  name: string
  type: string
  category: string
  rate: string
  min: string
  max: string
  refill: boolean
  cancel: boolean
}

interface CacheEntry {
  list: RawService[]
  updatedAt: string
}

function log(level: 'INFO' | 'WARN' | 'ERROR', msg: string, extra?: Record<string, unknown>) {
  const ts = new Date().toISOString()
  const prefix = `[${ts}] [services.get] [${level}]`
  if (extra !== undefined) {
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](`${prefix} ${msg}`, JSON.stringify(extra, null, 2))
  } else {
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](`${prefix} ${msg}`)
  }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const storage = useStorage('data')

  if (!config.apiV2Key) {
    log('WARN', 'V2 API key (NUXT_API_V2_KEY) tidak dikonfigurasi — returning cache')
    const cached = await storage.getItem<CacheEntry>('services:latest')
    return {
      data: cached?.list ?? [],
      updatedAt: cached?.updatedAt ?? null,
      fromCache: true,
      total: cached?.list?.length ?? 0,
      error: 'V2 API key tidak dikonfigurasi',
    }
  }

  const apiUrl = `${config.apiBaseUrl}/api/v2`
  log('INFO', `Fetch services dari ${apiUrl}`)

  try {
    const startTime = Date.now()
    const res = await $fetch<RawService[]>(apiUrl, {
      method: 'POST',
      body: new URLSearchParams({ key: String(config.apiV2Key), action: 'services' }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
    })
    const elapsed = Date.now() - startTime

    if (!Array.isArray(res)) {
      log('ERROR', 'Response bukan array', { preview: JSON.stringify(res).slice(0, 300) })
      throw new Error('Invalid services response format')
    }

    log('INFO', 'Fetch services selesai', { total: res.length, elapsed_ms: elapsed })

    const updatedAt = new Date().toISOString()
    await storage.setItem<CacheEntry>('services:latest', { list: res, updatedAt })

    return { data: res, updatedAt, fromCache: false, total: res.length }
  } catch (err: unknown) {
    const isError = err instanceof Error
    log('ERROR', 'Fetch services gagal — fallback ke cache', {
      message: isError ? err.message : String(err),
      name: isError ? err.name : undefined,
      stack: isError ? err.stack : undefined,
    })

    const cached = await storage.getItem<CacheEntry>('services:latest')
    log('INFO', 'Mengembalikan cache services', {
      cached_total: cached?.list?.length ?? 0,
      cached_at: cached?.updatedAt ?? null,
    })

    return {
      data: cached?.list ?? [],
      updatedAt: cached?.updatedAt ?? null,
      fromCache: true,
      total: cached?.list?.length ?? 0,
    }
  }
})
