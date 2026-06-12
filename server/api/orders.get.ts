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

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const storage = useStorage('data')

  if (!config.apiKey) {
    const cached = await storage.getItem<CacheEntry>('orders:latest')
    return {
      data: cached?.list ?? [],
      updatedAt: cached?.updatedAt ?? null,
      fromCache: true,
      total: cached?.list?.length ?? 0,
      error: 'API key tidak dikonfigurasi',
    }
  }

  try {
    // Fetch all pages
    const allOrders: RawOrder[] = []
    const pageLimit = 200
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const res = await $fetch<ApiResponse>(
        `${config.apiBaseUrl}/adminapi/v2/orders?limit=${pageLimit}&offset=${offset}`,
        {
          headers: { 'Content-Type': 'application/json', 'X-Api-Key': config.apiKey },
          timeout: 12000,
        }
      )
      const page = res.data?.list ?? []
      allOrders.push(...page)
      hasMore = page.length === pageLimit && !!res.pagination?.next_page_href
      offset += pageLimit
    }

    const list: RawOrder[] = allOrders
    const updatedAt = new Date().toISOString()

    await storage.setItem<CacheEntry>('orders:latest', { list, updatedAt })

    // Keep rolling history (max 48 snapshots ≈ 2 days at 3-min polling)
    const history = (await storage.getItem<CacheEntry[]>('orders:history')) ?? []
    history.push({ list, updatedAt })
    if (history.length > 48) history.splice(0, history.length - 48)
    await storage.setItem('orders:history', history)

    return { data: list, updatedAt, fromCache: false, total: list.length }
  } catch {
    const cached = await storage.getItem<CacheEntry>('orders:latest')
    return {
      data: cached?.list ?? [],
      updatedAt: cached?.updatedAt ?? null,
      fromCache: true,
      total: cached?.list?.length ?? 0,
    }
  }
})
