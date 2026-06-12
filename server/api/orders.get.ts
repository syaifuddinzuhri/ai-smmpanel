export interface RawOrder {
  id: number
  external_id?: string
  user?: string
  service_id: number
  service_name: string
  service_type: string
  status: string
  quantity: number
  remains?: number
  start_count?: number
  charge?: { value: number; currency_code: string; formatted: string }
  provider?: string
  link?: string
  created?: string
  created_timestamp?: number
}

interface ApiResponse {
  data?: { count?: number; list?: RawOrder[] }
  pagination?: { next_page_href?: string | null; offset?: number; limit?: number }
  error_message?: string
  error_code?: number
}

interface CacheEntry {
  list: RawOrder[]
  updatedAt: string
}

function log(level: 'INFO' | 'WARN' | 'ERROR', msg: string, extra?: Record<string, unknown>) {
  const ts = new Date().toISOString()
  const prefix = `[${ts}] [orders.get] [${level}]`
  if (extra !== undefined) {
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](`${prefix} ${msg}`, JSON.stringify(extra, null, 2))
  } else {
    console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](`${prefix} ${msg}`)
  }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const storage = useStorage('data')

  if (!config.apiKey) {
    log('WARN', 'API key tidak dikonfigurasi — returning cache')
    const cached = await storage.getItem<CacheEntry>('orders:latest')
    return {
      data: cached?.list ?? [],
      updatedAt: cached?.updatedAt ?? null,
      fromCache: true,
      total: cached?.list?.length ?? 0,
      error: 'API key tidak dikonfigurasi',
    }
  }

  const baseUrl = config.apiBaseUrl
  log('INFO', `Mulai fetch orders dari ${baseUrl}`)

  try {
    const allOrders: RawOrder[] = []
    const pageLimit = 200
    let offset = 0
    let hasMore = true
    let page = 0

    while (hasMore) {
      page++
      const url = `${baseUrl}/adminapi/v2/orders?limit=${pageLimit}&offset=${offset}`
      log('INFO', `Fetch halaman ${page}`, { url, offset, limit: pageLimit })

      const startTime = Date.now()
      const res = await $fetch<ApiResponse>(url, {
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': config.apiKey },
        timeout: 12000,
      })
      const elapsed = Date.now() - startTime

      if (res.error_code || res.error_message) {
        log('ERROR', 'API mengembalikan error', {
          error_code: res.error_code,
          error_message: res.error_message,
          url,
        })
      }

      const pageData = res.data?.list ?? []
      log('INFO', `Halaman ${page} selesai`, {
        elapsed_ms: elapsed,
        records: pageData.length,
        has_next: !!res.pagination?.next_page_href,
      })

      allOrders.push(...pageData)
      hasMore = pageData.length === pageLimit && !!res.pagination?.next_page_href
      offset += pageLimit
    }

    const updatedAt = new Date().toISOString()
    log('INFO', `Fetch selesai`, { total_orders: allOrders.length, pages: page, updatedAt })

    await storage.setItem<CacheEntry>('orders:latest', { list: allOrders, updatedAt })

    const history = (await storage.getItem<CacheEntry[]>('orders:history')) ?? []
    history.push({ list: allOrders, updatedAt })
    if (history.length > 48) history.splice(0, history.length - 48)
    await storage.setItem('orders:history', history)

    return { data: allOrders, updatedAt, fromCache: false, total: allOrders.length }
  } catch (err: unknown) {
    const isError = err instanceof Error
    log('ERROR', 'Fetch gagal — fallback ke cache', {
      message: isError ? err.message : String(err),
      name: isError ? err.name : undefined,
      stack: isError ? err.stack : undefined,
      cause: isError && err.cause ? String(err.cause) : undefined,
    })

    const cached = await storage.getItem<CacheEntry>('orders:latest')
    log('INFO', `Mengembalikan cache`, {
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
