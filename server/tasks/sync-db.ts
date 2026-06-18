import { fetchOrdersFromApi } from '../api/orders.get'
import { fetchServicesFromApi } from '../api/services.get'

export default defineTask({
  meta: {
    name: 'sync:db',
    description: 'Refresh orders dan services dari API eksternal ke SQLite setiap 3 menit',
  },
  async run() {
    const config = useRuntimeConfig()
    const results: string[] = []
    const errors: string[] = []

    const createdFrom = Math.floor(Date.now() / 1000) - 7 * 24 * 3600

    const [ordersResult, servicesResult] = await Promise.allSettled([
      config.apiAdminKey
        ? fetchOrdersFromApi(createdFrom)
        : Promise.reject(new Error('Admin API key tidak dikonfigurasi')),
      config.apiV2Key
        ? fetchServicesFromApi()
        : Promise.reject(new Error('V2 API key tidak dikonfigurasi')),
    ])

    if (ordersResult.status === 'fulfilled') {
      results.push(`orders: ${ordersResult.value.list.length}`)
    } else {
      errors.push(`orders: ${ordersResult.reason?.message}`)
    }

    if (servicesResult.status === 'fulfilled') {
      results.push(`services: ${servicesResult.value.list.length}`)
    } else {
      errors.push(`services: ${servicesResult.reason?.message}`)
    }

    const summary = [...results, ...errors.map(e => `[ERR] ${e}`)].join(', ')
    console.log(`[${new Date().toISOString()}] [sync:db] ${summary}`)

    return { result: summary }
  },
})
