import type { Ref } from 'vue'
import type { RawOrder } from '~/server/api/orders.get'
import type { RawService } from '~/server/api/services.get'
import type { Service } from './useServices'

function periodToSeconds(period: string): number {
  switch (period) {
    case '6J': return 6 * 3600
    case '24J': return 24 * 3600
    case '48J': return 48 * 3600
    case '7 Hari': return 7 * 24 * 3600
    default: return 24 * 3600
  }
}

interface OrdersApiResponse {
  data: RawOrder[]
  updatedAt: string | null
  fromCache: boolean
  total: number
  error?: string
}

interface ServicesApiResponse {
  data: RawService[]
  updatedAt: string | null
  fromCache: boolean
  total: number
  error?: string
}

interface ResyncApiResponse {
  orders:   { data: RawOrder[];   updatedAt: string | null; total: number }
  services: { data: RawService[]; updatedAt: string | null; total: number }
  syncedAt: string
  errors?: string[]
}

function detectPlatform(name: string, link = ''): { platform: string; icon: string } {
  const n = name.toLowerCase()
  const l = link.toLowerCase()
  if (n.includes('instagram') || l.includes('instagram.com'))                         return { platform: 'Instagram', icon: 'logos:instagram-icon' }
  if (n.includes('tiktok') || l.includes('tiktok.com'))                               return { platform: 'TikTok',    icon: 'logos:tiktok-icon' }
  if (n.includes('youtube') || l.includes('youtube.com') || l.includes('youtu.be'))   return { platform: 'YouTube',   icon: 'logos:youtube-icon' }
  if (n.includes('facebook') || l.includes('facebook.com') || l.includes('fb.com'))   return { platform: 'Facebook',  icon: 'logos:facebook' }
  if (n.includes('twitter') || n.includes('tweet') || l.includes('twitter.com') || l.includes('x.com')) return { platform: 'Twitter/X', icon: 'logos:twitter' }
  if (n.includes('shopee')  || l.includes('shopee'))                                  return { platform: 'Shopee',    icon: 'simple-icons:shopee' }
  if (n.includes('spotify')  || l.includes('spotify.com'))                              return { platform: 'Spotify',   icon: 'logos:spotify' }
  if (n.includes('telegram') || l.includes('t.me'))                                    return { platform: 'Telegram',  icon: 'logos:telegram' }
  if (n.includes('google')   || n.includes('gmail') || n.includes('play store') || l.includes('google.com')) return { platform: 'Google', icon: 'logos:google' }
  if (n.includes('thread')   || l.includes('threads.net'))                             return { platform: 'Threads',   icon: 'logos:thread' }
  return { platform: 'Lain-lain', icon: 'logos:other' }
}

function mapCategory(type: string): string {
  if (type.includes('follower') || type.includes('subscriber')) return 'Followers'
  if (type.includes('like')) return 'Likes'
  if (type.includes('view')) return 'Views'
  if (type.includes('comment')) return 'Comments'
  if (type.includes('share') || type.includes('retweet')) return 'Share'
  if (type.includes('live')) return 'Live'
  if (type.includes('watch')) return 'Watch Hours'
  if (type.includes('review')) return 'Reviews'
  if (type.includes('save')) return 'Saves'
  if (type.includes('mention')) return 'Mentions'
  return 'Lainnya'
}

function mapSpeed(type: string): Service['speed'] {
  const t = type.toLowerCase()
  if (t.includes('drip')) return 'Lambat'
  if (t.includes('instant') || t.includes('fast')) return 'Sangat Cepat'
  if (t.includes('slow')) return 'Lambat'
  return 'Cepat'
}

function ordersToServices(orders: RawOrder[], windowSeconds: number, servicesMap?: Map<number, RawService>): Service[] {
  if (!orders.length) return []

  const byService = new Map<number, RawOrder[]>()
  for (const o of orders) {
    if (!byService.has(o.service_id)) byService.set(o.service_id, [])
    byService.get(o.service_id)!.push(o)
  }

  const allCounts = [...byService.values()].map(os => os.length)
  const maxOrders = Math.max(...allCounts, 1)

  const now = Date.now() / 1000
  const half = windowSeconds / 2
  const midpoint = now - half

  const services: Service[] = []

  byService.forEach((svcOrders, serviceId) => {
    const sample = svcOrders[0]
    const total = svcOrders.length
    const completed = svcOrders.filter(o => ['completed', 'partial'].includes(o.status)).length
    const cancelled = svcOrders.filter(o => ['cancelled', 'canceled'].includes(o.status)).length

    const successRate = parseFloat(((completed / total) * 100).toFixed(1))
    const cancelRate = parseFloat(((cancelled / total) * 100).toFixed(1))

    const volumeScore = Math.min(total / maxOrders, 1) * 100
    const aiScore = Math.min(100, Math.max(0, Math.round(
      successRate * 0.55 + Math.max(0, 100 - cancelRate * 15) * 0.30 + volumeScore * 0.15
    )))

    const recentCount = svcOrders.filter(o => !o.created_timestamp || o.created_timestamp > midpoint).length
    const prevCount = svcOrders.filter(o => o.created_timestamp && o.created_timestamp <= midpoint).length

    let trend: Service['trend'] = 'stable'
    let trendPercent = 0
    if (prevCount > 0) {
      const pct = ((recentCount - prevCount) / prevCount) * 100
      trendPercent = parseFloat(pct.toFixed(1))
      if (pct > 5) trend = 'up'
      else if (pct < -5) trend = 'down'
    } else if (recentCount > 0) {
      trend = 'up'
      trendPercent = 100
    }

    const avgPrice = total > 0 ? svcOrders.reduce((s, o) => s + (Number(o.charge?.value) || 0), 0) / total : 0
    const { platform, icon } = detectPlatform(sample.service_name, sample.link)

    const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 3600
    const isNew = svcOrders.some(o => (o.created_timestamp ?? 0) > sevenDaysAgo)

    // Merge with Services API data when available
    const svc = servicesMap?.get(serviceId)

    services.push({
      id: serviceId,
      name: svc?.name ?? sample.service_name,
      category: svc?.category ?? mapCategory(sample.service_type),
      platform,
      platformIcon: icon,
      aiScore,
      successRate,
      orderCount: total,
      cancelRate,
      trend,
      trendPercent,
      price: svc ? Math.round(Number(svc.rate) / 10) : Math.round(avgPrice / 10),
      minOrder: svc ? Number(svc.min) : (svcOrders.reduce((m, o) => Math.min(m, Number(o.quantity) || 0), Infinity) || 0),
      speed: mapSpeed(svc?.type ?? sample.service_type),
      quality: aiScore >= 90 ? 'Premium' : aiScore >= 80 ? 'High' : 'Standard',
      isHot: total >= maxOrders * 0.7,
      isNew: isNew || undefined,
    })
  })

  return services.sort((a, b) => b.aiScore - a.aiScore)
}

export const useOrders = (period?: Ref<string>) => {
  const rawOrders = ref<RawOrder[]>([])
  const rawServicesList = ref<RawService[]>([])
  const isLoading = ref(true)
  const fromCache = ref(false)
  const apiError = ref<string | null>(null)
  const updatedAt = ref<string | null>(null)
  const lastUpdate = ref('')

  const servicesMap = computed(() => {
    const map = new Map<number, RawService>()
    for (const s of rawServicesList.value) map.set(s.service, s)
    return map
  })

  const periodFiltered = computed(() => {
    if (!period?.value) return rawOrders.value
    const cutoff = Date.now() / 1000 - periodToSeconds(period.value)
    return rawOrders.value.filter(o =>
      !o.created_timestamp || o.created_timestamp > cutoff
    )
  })

  const services = computed(() =>
    ordersToServices(periodFiltered.value, periodToSeconds(period?.value ?? '24J'), servicesMap.value)
  )

  const fetchServices = async () => {
    try {
      const res = await $fetch<ServicesApiResponse>('/api/services')
      rawServicesList.value = res.data ?? []
    } catch {
      // keep existing list on failure
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await $fetch<OrdersApiResponse>('/api/orders')
      rawOrders.value = res.data ?? []
      fromCache.value = res.fromCache
      apiError.value = res.error ?? null
      updatedAt.value = res.updatedAt

      if (res.updatedAt) {
        lastUpdate.value = new Date(res.updatedAt).toLocaleTimeString('id-ID', {
          hour: '2-digit', minute: '2-digit',
        })
      }
    } catch (err: unknown) {
      apiError.value = err instanceof Error ? err.message : 'Fetch gagal'
    } finally {
      isLoading.value = false
    }
  }

  const resync = async (p?: string) => {
    isLoading.value = true
    apiError.value = null
    try {
      const res = await $fetch<ResyncApiResponse>('/api/resync', {
        method: 'POST',
        body: { period: p ?? period?.value ?? '7 Hari' },
      })
      rawOrders.value = res.orders.data ?? []
      rawServicesList.value = res.services.data ?? []
      fromCache.value = false
      updatedAt.value = res.syncedAt
      lastUpdate.value = new Date(res.syncedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      if (res.errors?.length) apiError.value = res.errors.join('; ')
    } catch (err: unknown) {
      apiError.value = err instanceof Error ? err.message : 'Resync gagal'
    } finally {
      isLoading.value = false
    }
  }

  // Auto-resync saat periode berubah
  if (period) {
    watch(period, (p) => resync(p), { immediate: false })
  }

  const POLL_MS = 3 * 60 * 1000 // 3 menit
  let pollTimer: ReturnType<typeof setInterval> | null = null

  onMounted(async () => {
    await Promise.all([fetchOrders(), fetchServices()])
    pollTimer = setInterval(() => {
      fetchOrders()
      fetchServices()
    }, POLL_MS)
  })

  onUnmounted(() => {
    if (pollTimer !== null) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  })

  return { services, rawOrders, rawServicesList, isLoading, fromCache, apiError, updatedAt, lastUpdate, fetchOrders, fetchServices, resync }
}
