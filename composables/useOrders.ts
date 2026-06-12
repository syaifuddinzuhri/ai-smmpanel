import type { Ref } from 'vue'
import type { RawOrder } from '~/server/api/orders.get'
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

function detectPlatform(name: string, link = ''): { platform: string; icon: string } {
  const n = name.toLowerCase()
  const l = link.toLowerCase()
  if (n.includes('instagram') || l.includes('instagram.com')) return { platform: 'Instagram', icon: '📸' }
  if (n.includes('tiktok') || l.includes('tiktok.com')) return { platform: 'TikTok', icon: '🎵' }
  if (n.includes('youtube') || l.includes('youtube.com') || l.includes('youtu.be')) return { platform: 'YouTube', icon: '▶️' }
  if (n.includes('facebook') || l.includes('facebook.com') || l.includes('fb.com')) return { platform: 'Facebook', icon: '👍' }
  if (n.includes('twitter') || n.includes('tweet') || l.includes('twitter.com') || l.includes('x.com')) return { platform: 'Twitter/X', icon: '🐦' }
  if (n.includes('shopee') || l.includes('shopee')) return { platform: 'Shopee', icon: '🛍️' }
  return { platform: 'Lainnya', icon: '🌐' }
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
  if (type.includes('instant') || type.includes('fast')) return 'Sangat Cepat'
  if (type.includes('slow') || type.includes('drip')) return 'Lambat'
  return 'Cepat'
}

function ordersToServices(orders: RawOrder[], windowSeconds: number): Service[] {
  if (!orders.length) return []

  // Aggregate by service_id
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

    // AI score: weighted formula (success 55%, cancel penalty 30%, volume 15%)
    const volumeScore = Math.min(total / maxOrders, 1) * 100
    const aiScore = Math.min(100, Math.max(0, Math.round(
      successRate * 0.55 + Math.max(0, 100 - cancelRate * 15) * 0.30 + volumeScore * 0.15
    )))

    // Trend: bandingkan paruh baru vs paruh lama dalam window yang sama
    // Order tanpa timestamp dianggap "recent" (tidak diketahui kapan)
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
      // Semua order baru (tidak ada di paruh lama) — trending naik
      trend = 'up'
      trendPercent = 100
    }

    const avgPrice = total > 0 ? svcOrders.reduce((s, o) => s + (Number(o.charge?.value) || 0), 0) / total : 0
    const { platform, icon } = detectPlatform(sample.service_name, sample.link)

    // isNew: any order created within 7 days
    const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 3600
    const isNew = svcOrders.some(o => (o.created_timestamp ?? 0) > sevenDaysAgo)

    services.push({
      id: serviceId,
      name: sample.service_name,
      category: mapCategory(sample.service_type),
      platform,
      platformIcon: icon,
      aiScore,
      successRate,
      orderCount: total,
      cancelRate,
      trend,
      trendPercent,
      price: Math.round(avgPrice),
      minOrder: svcOrders.reduce((m, o) => Math.min(m, Number(o.quantity) || 0), Infinity) || 0,
      speed: mapSpeed(sample.service_type),
      quality: aiScore >= 90 ? 'Premium' : aiScore >= 80 ? 'High' : 'Standard',
      isHot: total >= maxOrders * 0.7,
      isNew: isNew || undefined,
    })
  })

  return services.sort((a, b) => b.aiScore - a.aiScore)
}

export const useOrders = (period?: Ref<string>) => {
  const rawOrders = ref<RawOrder[]>([])
  const isLoading = ref(true)
  const fromCache = ref(false)
  const apiError = ref<string | null>(null)
  const updatedAt = ref<string | null>(null)
  const lastUpdate = ref('')

  // Filter raw orders to only those within the selected period window
  const periodFiltered = computed(() => {
    if (!period?.value) return rawOrders.value
    const cutoff = Date.now() / 1000 - periodToSeconds(period.value)
    return rawOrders.value.filter(o =>
      !o.created_timestamp || o.created_timestamp > cutoff
    )
  })

  // Services recompute automatically when rawOrders or period changes
  const services = computed(() =>
    ordersToServices(periodFiltered.value, periodToSeconds(period?.value ?? '24J'))
  )

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

  onMounted(async () => {
    await fetchOrders()
    const timer = setInterval(fetchOrders, 3 * 60 * 1000) // 3 minutes
    onUnmounted(() => clearInterval(timer))
  })

  return { services, rawOrders, isLoading, fromCache, apiError, updatedAt, lastUpdate, fetchOrders  }
}
