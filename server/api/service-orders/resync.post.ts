import { writeCache } from '../../utils/db'
import { periodToCreatedFrom } from '../service-orders.get'
import type { RawOrder } from '../orders.get'

interface ApiResponse {
  data?: { count?: number; list?: RawOrder[] }
  pagination?: { next_page_href?: string | null; offset?: number; limit?: number }
  error_message?: string
  error_code?: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const serviceId = Number(body?.serviceId)
  const period    = String(body?.period ?? '7 Hari')

  if (!serviceId) {
    throw createError({ statusCode: 400, message: 'serviceId required' })
  }

  const config = useRuntimeConfig()
  if (!config.apiAdminKey) {
    throw createError({ statusCode: 503, message: 'Admin API key tidak dikonfigurasi' })
  }

  const baseUrl = config.apiBaseUrl
  const createdFrom = periodToCreatedFrom(period)
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

  const cacheKey = `service_orders_${serviceId}_${period.replace(' ', '_')}`
  await writeCache(cacheKey, allOrders)

  return { serviceId, period, total: allOrders.length, syncedAt: new Date().toISOString() }
})
