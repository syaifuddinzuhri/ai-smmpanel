export interface Service {
  id: number
  name: string
  category: string
  platform: string
  platformIcon: string
  aiScore: number
  successRate: number
  orderCount: number
  cancelRate: number
  trend: 'up' | 'down' | 'stable'
  trendPercent: number
  price: number
  minOrder: number
  speed: 'Sangat Cepat' | 'Cepat' | 'Sedang' | 'Lambat'
  quality: 'Premium' | 'High' | 'Standard'
  isNew?: boolean
  isHot?: boolean
}

const ALL_SERVICES: Service[] = [
  // // Instagram
  // { id: 1, name: 'Instagram Followers Indonesia [HQ]', category: 'Followers', platform: 'Instagram', platformIcon: '📸', aiScore: 97, successRate: 99.2, orderCount: 45820, cancelRate: 0.3, trend: 'up', trendPercent: 12.4, price: 850, minOrder: 100, speed: 'Cepat', quality: 'Premium', isHot: true },
  // { id: 2, name: 'Instagram Likes Real [Aktif]', category: 'Likes', platform: 'Instagram', platformIcon: '📸', aiScore: 95, successRate: 98.7, orderCount: 38910, cancelRate: 0.5, trend: 'up', trendPercent: 8.1, price: 300, minOrder: 50, speed: 'Sangat Cepat', quality: 'High' },
  // { id: 3, name: 'Instagram Views Story [24 Jam]', category: 'Views', platform: 'Instagram', platformIcon: '📸', aiScore: 93, successRate: 99.5, orderCount: 29840, cancelRate: 0.2, trend: 'stable', trendPercent: 0.3, price: 150, minOrder: 100, speed: 'Sangat Cepat', quality: 'Standard' },
  // { id: 4, name: 'Instagram Reels Views [Viral Boost]', category: 'Views', platform: 'Instagram', platformIcon: '📸', aiScore: 91, successRate: 97.8, orderCount: 22190, cancelRate: 0.8, trend: 'up', trendPercent: 15.2, price: 200, minOrder: 1000, speed: 'Cepat', quality: 'High', isNew: true },
  // { id: 5, name: 'Instagram Comments Indonesia', category: 'Comments', platform: 'Instagram', platformIcon: '📸', aiScore: 88, successRate: 96.4, orderCount: 14520, cancelRate: 1.2, trend: 'down', trendPercent: -2.1, price: 2500, minOrder: 10, speed: 'Sedang', quality: 'Premium' },
  // { id: 6, name: 'Instagram Saves [Organic]', category: 'Saves', platform: 'Instagram', platformIcon: '📸', aiScore: 84, successRate: 95.1, orderCount: 9820, cancelRate: 1.8, trend: 'up', trendPercent: 5.3, price: 500, minOrder: 50, speed: 'Cepat', quality: 'High' },

  // // TikTok
  // { id: 7, name: 'TikTok Followers [Garanted]', category: 'Followers', platform: 'TikTok', platformIcon: '🎵', aiScore: 96, successRate: 98.9, orderCount: 52340, cancelRate: 0.4, trend: 'up', trendPercent: 18.7, price: 700, minOrder: 100, speed: 'Cepat', quality: 'Premium', isHot: true },
  // { id: 8, name: 'TikTok Views [Mix Real]', category: 'Views', platform: 'TikTok', platformIcon: '🎵', aiScore: 94, successRate: 99.1, orderCount: 67820, cancelRate: 0.3, trend: 'up', trendPercent: 22.5, price: 80, minOrder: 1000, speed: 'Sangat Cepat', quality: 'High' },
  // { id: 9, name: 'TikTok Likes [Indonesia Target]', category: 'Likes', platform: 'TikTok', platformIcon: '🎵', aiScore: 92, successRate: 98.3, orderCount: 41560, cancelRate: 0.6, trend: 'stable', trendPercent: 1.2, price: 250, minOrder: 100, speed: 'Sangat Cepat', quality: 'High' },
  // { id: 10, name: 'TikTok Live Viewer [Real-time]', category: 'Live', platform: 'TikTok', platformIcon: '🎵', aiScore: 89, successRate: 95.7, orderCount: 8740, cancelRate: 2.1, trend: 'up', trendPercent: 34.2, price: 3500, minOrder: 100, speed: 'Sangat Cepat', quality: 'Premium', isNew: true },
  // { id: 11, name: 'TikTok Share [Boost Viral]', category: 'Share', platform: 'TikTok', platformIcon: '🎵', aiScore: 85, successRate: 94.2, orderCount: 5320, cancelRate: 2.8, trend: 'down', trendPercent: -3.4, price: 400, minOrder: 100, speed: 'Sedang', quality: 'Standard' },

  // // YouTube
  // { id: 12, name: 'YouTube Subscribers [Non Drop]', category: 'Subscribers', platform: 'YouTube', platformIcon: '▶️', aiScore: 95, successRate: 98.5, orderCount: 31240, cancelRate: 0.5, trend: 'up', trendPercent: 9.8, price: 1200, minOrder: 50, speed: 'Cepat', quality: 'Premium', isHot: true },
  // { id: 13, name: 'YouTube Views [High Retention]', category: 'Views', platform: 'YouTube', platformIcon: '▶️', aiScore: 93, successRate: 97.9, orderCount: 48720, cancelRate: 0.7, trend: 'up', trendPercent: 11.3, price: 350, minOrder: 1000, speed: 'Sedang', quality: 'Premium' },
  // { id: 14, name: 'YouTube Watch Hours [4000 hr]', category: 'Watch Hours', platform: 'YouTube', platformIcon: '▶️', aiScore: 90, successRate: 96.8, orderCount: 12840, cancelRate: 1.1, trend: 'stable', trendPercent: 0.8, price: 15000, minOrder: 1, speed: 'Lambat', quality: 'Premium', isNew: true },
  // { id: 15, name: 'YouTube Likes Real [Active]', category: 'Likes', platform: 'YouTube', platformIcon: '▶️', aiScore: 87, successRate: 95.4, orderCount: 18920, cancelRate: 1.5, trend: 'down', trendPercent: -1.8, price: 500, minOrder: 100, speed: 'Cepat', quality: 'High' },
  // { id: 16, name: 'YouTube Comments [Custom]', category: 'Comments', platform: 'YouTube', platformIcon: '▶️', aiScore: 83, successRate: 93.7, orderCount: 6840, cancelRate: 3.1, trend: 'stable', trendPercent: 0.1, price: 3000, minOrder: 5, speed: 'Sedang', quality: 'Premium' },

  // // Facebook
  // { id: 17, name: 'Facebook Page Likes [ID+Global]', category: 'Page Likes', platform: 'Facebook', platformIcon: '👍', aiScore: 92, successRate: 97.6, orderCount: 24380, cancelRate: 0.8, trend: 'up', trendPercent: 6.2, price: 600, minOrder: 100, speed: 'Cepat', quality: 'High' },
  // { id: 18, name: 'Facebook Followers [Aktif]', category: 'Followers', platform: 'Facebook', platformIcon: '👍', aiScore: 89, successRate: 96.2, orderCount: 19120, cancelRate: 1.3, trend: 'stable', trendPercent: 0.5, price: 700, minOrder: 100, speed: 'Cepat', quality: 'High' },
  // { id: 19, name: 'Facebook Post Likes [Organic]', category: 'Likes', platform: 'Facebook', platformIcon: '👍', aiScore: 86, successRate: 95.8, orderCount: 28740, cancelRate: 1.0, trend: 'up', trendPercent: 4.7, price: 250, minOrder: 50, speed: 'Sangat Cepat', quality: 'Standard' },
  // { id: 20, name: 'Facebook Views [Video Viral]', category: 'Views', platform: 'Facebook', platformIcon: '👍', aiScore: 83, successRate: 94.5, orderCount: 15240, cancelRate: 1.6, trend: 'down', trendPercent: -2.9, price: 180, minOrder: 1000, speed: 'Cepat', quality: 'Standard' },

  // // Twitter/X
  // { id: 21, name: 'Twitter Followers [Verified Look]', category: 'Followers', platform: 'Twitter/X', platformIcon: '🐦', aiScore: 91, successRate: 97.1, orderCount: 16820, cancelRate: 0.9, trend: 'up', trendPercent: 7.8, price: 900, minOrder: 100, speed: 'Cepat', quality: 'High', isNew: true },
  // { id: 22, name: 'Twitter Likes [Real Engagement]', category: 'Likes', platform: 'Twitter/X', platformIcon: '🐦', aiScore: 87, successRate: 95.9, orderCount: 21450, cancelRate: 1.2, trend: 'stable', trendPercent: 0.4, price: 350, minOrder: 50, speed: 'Sangat Cepat', quality: 'High' },
  // { id: 23, name: 'Twitter Retweets [Indonesia]', category: 'Retweets', platform: 'Twitter/X', platformIcon: '🐦', aiScore: 84, successRate: 94.3, orderCount: 9870, cancelRate: 2.0, trend: 'up', trendPercent: 9.1, price: 450, minOrder: 50, speed: 'Cepat', quality: 'Standard' },

  // // Shopee
  // { id: 24, name: 'Shopee Followers Toko [Indonesia]', category: 'Followers', platform: 'Shopee', platformIcon: '🛍️', aiScore: 93, successRate: 98.4, orderCount: 34210, cancelRate: 0.5, trend: 'up', trendPercent: 16.3, price: 500, minOrder: 100, speed: 'Cepat', quality: 'High', isHot: true },
  // { id: 25, name: 'Shopee Likes Produk [Real]', category: 'Likes', platform: 'Shopee', platformIcon: '🛍️', aiScore: 90, successRate: 97.5, orderCount: 41820, cancelRate: 0.7, trend: 'up', trendPercent: 13.8, price: 200, minOrder: 100, speed: 'Sangat Cepat', quality: 'High' },
  // { id: 26, name: 'Shopee Ulasan Bintang 5 [Custom]', category: 'Reviews', platform: 'Shopee', platformIcon: '🛍️', aiScore: 88, successRate: 96.1, orderCount: 8940, cancelRate: 1.4, trend: 'stable', trendPercent: 2.1, price: 8000, minOrder: 1, speed: 'Sedang', quality: 'Premium' },
]

interface InsightResponse { insight: string; source: 'llm' | 'rule' }

export const useServices = () => {
  const selectedPlatform = ref('Semua')
  const selectedPeriod = ref('24J')
  const selectedSort = ref('score')
  const searchQuery = ref('')

  const {
    services: liveServices,
    rawOrders,
    rawServicesList,
    isLoading,
    fromCache,
    apiError,
    lastUpdate,
    fetchOrders,
    resync,
  } = useOrders(selectedPeriod)

  // Fall back to mock data only when the API has returned zero raw orders
  const services = computed<Service[]>(() =>
    rawOrders.value.length > 0 ? liveServices.value : ALL_SERVICES
  )

  const platforms = [
    { label: 'Semua',     icon: null },
    { label: 'Instagram', icon: 'logos:instagram-icon' },
    { label: 'TikTok',    icon: 'logos:tiktok-icon' },
    { label: 'Facebook',  icon: 'logos:facebook' },
    { label: 'YouTube',   icon: 'logos:youtube-icon' },
    { label: 'Twitter/X', icon: 'logos:twitter' },
    { label: 'Shopee',    icon: 'simple-icons:shopee' },
    { label: 'Spotify',   icon: 'logos:spotify' },
    { label: 'Telegram',  icon: 'logos:telegram' },
    { label: 'Google',    icon: 'logos:google' },
    { label: 'Threads',   icon: 'logos:thread' },
    { label: 'Lain-lain', icon: 'logos:other' },
  ]

  const periods = ['6J', '24J', '48J', '7 Hari']

  const sortOptions = [
    { value: 'score', label: 'Sort: AI Score' },
    { value: 'success', label: 'Sort: Success Rate' },
    { value: 'orders', label: 'Sort: Order Count' },
    { value: 'trending', label: 'Sort: Trending' },
    { value: 'cancel', label: 'Sort: Cancel Rate ↑' },
  ]

  const filteredServices = computed(() => {
    let result = services.value

    if (selectedPlatform.value !== 'Semua') {
      result = result.filter(s => s.platform === selectedPlatform.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toString().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    }

    result = [...result].sort((a, b) => {
      switch (selectedSort.value) {
        case 'score': return b.aiScore - a.aiScore
        case 'success': return b.successRate - a.successRate
        case 'orders': return b.orderCount - a.orderCount
        case 'trending': return b.trendPercent - a.trendPercent
        case 'cancel': return b.cancelRate - a.cancelRate
        default: return b.aiScore - a.aiScore
      }
    })

    return result
  })

  const stats = computed(() => {
    const all = services.value
    const n = all.length || 1
    return {
      total: all.length,
      avgScore: all.length ? Math.round(all.reduce((s, x) => s + x.aiScore, 0) / n) : 0,
      avgSuccess: all.length ? (all.reduce((s, x) => s + x.successRate, 0) / n).toFixed(1) : '0.0',
      totalOrders: all.reduce((s, x) => s + x.orderCount, 0),
      risky: all.filter(s => s.cancelRate > 2 || s.successRate < 95).length,
      trending: all.filter(s => s.trend === 'up' && s.trendPercent > 5).length,
    }
  })

  const topPerformers = computed(() =>
    [...services.value].sort((a, b) => b.aiScore - a.aiScore).slice(0, 10)
  )

  const riskyServices = computed(() =>
    services.value
      .filter(s => s.cancelRate > 2 || s.successRate < 95)
      .sort((a, b) => b.cancelRate - a.cancelRate)
      .slice(0, 10)
  )

  const trendingServices = computed(() =>
    [...services.value].filter(s => s.trend === 'up' && s.trendPercent > 8)
      .sort((a, b) => b.trendPercent - a.trendPercent).slice(0, 10)
  )

  const aiInsight = ref<string>('')
  const aiInsightLoading = ref(false)

  const fetchInsight = async () => {
    if (!services.value.length) return
    aiInsightLoading.value = true
    try {
      const res = await $fetch<InsightResponse>('/api/insight', {
        method: 'POST',
        body: {
          period: selectedPeriod.value,
          totalServices: stats.value.total,
          avgScore: stats.value.avgScore,
          avgSuccess: stats.value.avgSuccess,
          totalOrders: stats.value.totalOrders,
          riskyCount: stats.value.risky,
          trendingCount: stats.value.trending,
          topServices: topPerformers.value.map(s => ({
            name: s.name,
            aiScore: s.aiScore,
            successRate: s.successRate,
            orderCount: s.orderCount,
            platform: s.platform,
          })),
          riskyServices: riskyServices.value.map(s => ({
            name: s.name,
            cancelRate: s.cancelRate,
            successRate: s.successRate,
          })),
          trendingServices: trendingServices.value.map(s => ({
            name: s.name,
            trendPercent: s.trendPercent,
            platform: s.platform,
          })),
        },
      })
      if (res.insight) aiInsight.value = res.insight
    } catch {
      // keep previous insight on failure
    } finally {
      aiInsightLoading.value = false
    }
  }

  // Refresh insight whenever live services update (after each poll)
  watch(liveServices, () => { fetchInsight() }, { deep: false })

  return {
    services, rawServicesList, isLoading, fromCache, apiError, fetchOrders, resync,
    selectedPlatform, selectedPeriod, selectedSort,
    searchQuery, platforms, periods, sortOptions, filteredServices,
    stats, topPerformers, riskyServices, trendingServices,
    aiInsight, aiInsightLoading, fetchInsight, lastUpdate
  }
}
