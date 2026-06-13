import { readCache, writeCache } from '../utils/db'

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

function log(level: 'INFO' | 'WARN' | 'ERROR', msg: string, extra?: Record<string, unknown>) {
  const prefix = `[${new Date().toISOString()}] [orders] [${level}]`
  const fn = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log
  extra ? fn(prefix, msg, JSON.stringify(extra)) : fn(prefix, msg)
}

export async function fetchOrdersFromApi(createdFrom?: number): Promise<{ list: RawOrder[]; updatedAt: string }> {
  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseUrl
  const pageLimit = 1000
  const cf = createdFrom ?? Math.floor(Date.now() / 1000) - 7 * 24 * 3600
  const allOrders: RawOrder[] = []
  let offset = 0
  let page = 0

  log('INFO', `Fetch orders dari ${baseUrl}`, { createdFrom: cf, pageLimit })

  while (true) {
    page++
    const url = `${baseUrl}/adminapi/v2/orders?limit=${pageLimit}&offset=${offset}&created_from=${cf}&sort=date-desc`

    let res: ApiResponse
    try {
      res = await $fetch<ApiResponse>(url, {
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': String(config.apiAdminKey) },
        timeout: 20000,
      })
    } catch (err: unknown) {
      log('WARN', `Halaman ${page} gagal — berhenti di ${allOrders.length} order`, {
        message: err instanceof Error ? err.message : String(err),
      })
      break
    }

    if (res.error_code || res.error_message) {
      log('ERROR', 'API error', { error_code: res.error_code, error_message: res.error_message })
      break
    }

    const pageData = res.data?.list ?? []
    allOrders.push(...pageData)
    log('INFO', `Halaman ${page} selesai`, { records: pageData.length, total: allOrders.length })

    if (pageData.length < pageLimit || !res.pagination?.next_page_href) break
    offset += pageLimit
  }

  const updatedAt = new Date().toISOString()
  log('INFO', 'Fetch selesai', { total: allOrders.length, pages: page })
  await writeCache('orders', allOrders)
  return { list: allOrders, updatedAt }
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  if (!config.apiAdminKey) {
    const cached = await readCache<RawOrder[]>('orders')
    return {
      data: cached?.data ?? [],
      updatedAt: cached?.fetchedAt ?? null,
      fromCache: true,
      total: cached?.count ?? 0,
      error: 'Admin API key tidak dikonfigurasi',
    }
  }

  // Serve dari SQLite jika sudah ada data — fetch hanya lewat Resync
  const cached = await readCache<RawOrder[]>('orders')
  if (cached) {
    log('INFO', `Serve dari SQLite`, { total: cached.count, fetchedAt: cached.fetchedAt })
    return { data: cached.data, updatedAt: cached.fetchedAt, fromCache: true, total: cached.count }
  }

  // Bootstrap: DB kosong (pertama kali), fetch sekali ke API
  log('INFO', 'DB kosong — bootstrap fetch pertama')
  try {
    const { list, updatedAt } = await fetchOrdersFromApi()
    return { data: list, updatedAt, fromCache: false, total: list.length }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log('ERROR', 'Bootstrap fetch gagal', { message: msg })
    return { data: [], updatedAt: null, fromCache: false, total: 0, error: msg }
  }
})
