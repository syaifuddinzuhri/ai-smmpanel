import { readCache, writeCache } from '../utils/db'
import type { RawOrder } from './orders.get'
import type { RawService } from './services.get'

export interface ServiceOrderStats {
  serviceId: number
  serviceName: string
  serviceType: string
  total: number
  completed: number
  partial: number
  processing: number
  inProgress: number
  canceled: number
  completionRate: number
  orders: RawOrder[]
  updatedAt: string | null
  fromCache: boolean
  period: string
}

interface ApiResponse {
  data?: { count?: number; list?: RawOrder[] }
  pagination?: { next_page_href?: string | null; offset?: number; limit?: number }
  error_message?: string
  error_code?: number
}

export function periodToCreatedFrom(period: string): number {
  const map: Record<string, number> = {
    '6J':     6   * 3600,
    '24J':    24  * 3600,
    '48J':    48  * 3600,
    '7 Hari': 7   * 24 * 3600,
  }
  return Math.floor(Date.now() / 1000) - (map[period] ?? 7 * 24 * 3600)
}

async function fetchByServiceId(serviceId: number, createdFrom: number): Promise<{ list: RawOrder[]; updatedAt: string }> {
  const config = useRuntimeConfig()
  const baseUrl = config.apiBaseUrl
  const pageLimit = 1000
  const allOrders: RawOrder[] = []
  let offset = 0

  while (true) {
    const url = `${baseUrl}/adminapi/v2/orders?limit=${pageLimit}&offset=${offset}&service_ids=${serviceId}&created_from=${createdFrom}&sort=date-desc`

    let res: ApiResponse
    try {
      res = await $fetch<ApiResponse>(url, {
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': String(config.apiAdminKey) },
        timeout: 20000,
      })
    } catch {
      break
    }

    if (res.error_code || res.error_message) break

    const pageData = res.data?.list ?? []
    allOrders.push(...pageData)

    if (pageData.length < pageLimit || !res.pagination?.next_page_href) break
    offset += pageLimit
  }

  const updatedAt = new Date().toISOString()
  return { list: allOrders, updatedAt }
}

function buildStats(serviceId: number, serviceName: string, serviceType: string, orders: RawOrder[], updatedAt: string | null, fromCache: boolean, period: string): ServiceOrderStats {
  const total      = orders.length
  const completed  = orders.filter(o => o.status === 'completed').length
  const partial    = orders.filter(o => o.status === 'partial').length
  const processing = orders.filter(o => o.status === 'processing').length
  const inProgress = orders.filter(o => ['inprogress', 'in_progress'].includes(o.status)).length
  const canceled   = orders.filter(o => ['canceled', 'cancelled'].includes(o.status)).length
  const completionRate = total > 0 ? Math.round(((completed + partial) / total) * 100) : 0

  return {
    serviceId,
    serviceName,
    serviceType,
    total, completed, partial, processing, inProgress, canceled,
    completionRate,
    orders: [...orders].sort((a, b) => (b.created_timestamp ?? 0) - (a.created_timestamp ?? 0)),
    updatedAt,
    fromCache,
    period,
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const serviceId = Number(query.serviceId)
  const period    = String(query.period ?? '7 Hari')

  if (!serviceId) {
    throw createError({ statusCode: 400, message: 'serviceId required' })
  }

  const config = useRuntimeConfig()
  const createdFrom = periodToCreatedFrom(period)
  const cacheKey = `service_orders_${serviceId}_${period.replace(' ', '_')}`

  const serviceRow = await readCache<RawService[]>('services')
  const svc = serviceRow?.data.find(s => s.service === serviceId)
  const serviceName = svc?.name ?? `Layanan #${serviceId}`
  const serviceType = svc?.type ?? ''

  // Tanpa API key → fallback ke cache global orders lalu filter by period
  if (!config.apiAdminKey) {
    const cached = await readCache<RawOrder[]>('orders')
    const orders = (cached?.data ?? []).filter(
      o => o.service_id === serviceId && (o.created_timestamp ?? 0) >= createdFrom
    )
    return buildStats(serviceId, serviceName, serviceType, orders, cached?.fetchedAt ?? null, true, period)
  }

  // Serve dari cache per-service+period jika sudah ada
  const cached = await readCache<RawOrder[]>(cacheKey)
  if (cached) {
    return buildStats(serviceId, serviceName, serviceType, cached.data, cached.fetchedAt, true, period)
  }

  // Fetch dari API
  const { list, updatedAt } = await fetchByServiceId(serviceId, createdFrom)
  await writeCache(cacheKey, list)
  return buildStats(serviceId, serviceName, serviceType, list, updatedAt, false, period)
})
