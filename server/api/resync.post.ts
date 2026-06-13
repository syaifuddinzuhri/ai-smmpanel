import { fetchOrdersFromApi } from './orders.get'
import { fetchServicesFromApi } from './services.get'

function periodToCreatedFrom(period: string): number {
  const seconds: Record<string, number> = {
    '6J':     6  * 3600,
    '24J':    24 * 3600,
    '48J':    48 * 3600,
    '7 Hari': 7  * 24 * 3600,
  }
  return Math.floor(Date.now() / 1000) - (seconds[period] ?? 7 * 24 * 3600)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event).catch(() => ({}))
  const period: string = body?.period ?? '7 Hari'
  const createdFrom = periodToCreatedFrom(period)

  const errors: string[] = []

  const [ordersResult, servicesResult] = await Promise.allSettled([
    config.apiAdminKey
      ? fetchOrdersFromApi(createdFrom)
      : Promise.reject(new Error('Admin API key tidak dikonfigurasi')),
    config.apiV2Key
      ? fetchServicesFromApi()
      : Promise.reject(new Error('V2 API key tidak dikonfigurasi')),
  ])

  const orders   = ordersResult.status   === 'fulfilled' ? ordersResult.value   : null
  const services = servicesResult.status === 'fulfilled' ? servicesResult.value : null

  if (ordersResult.status   === 'rejected') errors.push(`orders: ${ordersResult.reason?.message}`)
  if (servicesResult.status === 'rejected') errors.push(`services: ${servicesResult.reason?.message}`)

  return {
    orders:   { data: orders?.list ?? [],   updatedAt: orders?.updatedAt ?? null,   total: orders?.list.length ?? 0 },
    services: { data: services?.list ?? [], updatedAt: services?.updatedAt ?? null, total: services?.list.length ?? 0 },
    syncedAt: new Date().toISOString(),
    period,
    errors: errors.length ? errors : undefined,
  }
})
