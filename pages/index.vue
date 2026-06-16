<template>
  <div class="min-h-screen relative overflow-x-hidden" :style="{ background: 'var(--bg-page)' }">
    <!-- Ambient glow -->
    <div class="pointer-events-none fixed top-[-5%] left-[15%] w-[800px] h-[600px] z-0 opacity-50"
      style="background: radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)"></div>
    <div class="pointer-events-none fixed top-[50%] right-[-5%] w-[500px] h-[500px] z-0 opacity-30"
      style="background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)"></div>

    <AppHeader
      v-model:searchQuery="searchQuery"
      :isLoading="isLoading"
      :lastUpdate="lastUpdate"
      :fromCache="fromCache"
      :apiError="apiError"
      :platforms="platforms"
      :periods="periods"
      :selectedPlatform="isSidebarTab ? sidebarPlatform : selectedPlatform"
      :selectedPeriod="selectedPeriod"
      :showPlatformFilter="activeTab === 'monitor' || activeTab === 'rekomendasi' || isSidebarTab"
      @update:selectedPlatform="isSidebarTab ? (sidebarPlatform = $event) : (selectedPlatform = $event)"
      @update:selectedPeriod="selectedPeriod = $event"
      @resync="resync"
    />

    <main class="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 relative z-[1]">

      <!-- Tabs -->
      <div class="flex overflow-x-auto scrollbar-hide gap-1 rounded-xl p-1 mb-3" :style="{ background: 'var(--bg-a60)', border: '1px solid var(--border)' }">
        <button
          v-for="tab in mainTabs"
          :key="tab.key"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0',
            activeTab === tab.key
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-[var(--row-hover)]'
          ]"
          @click="activeTab = tab.key"
        >
          <Icon :name="tab.icon" class="w-4 h-4 flex-shrink-0" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-5 max-w-full">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          :value="searchQuery"
          :disabled="isLoading"
          type="text"
          :placeholder="t('search.placeholder')"
          class="w-full rounded-xl py-2 pl-9 pr-8 text-[13px] text-slate-700 dark:text-slate-200 outline-none transition-all focus:border-indigo-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          :style="{ background: 'var(--bg-a60)', border: '1px solid var(--border)' }"
          @input="searchQuery = ($event.target as HTMLInputElement).value"
        />
        <button
          v-if="searchQuery"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          @click="searchQuery = ''"
        >
          <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Stat Cards — hanya di tab AI Rekomendasi -->
      <StatCards v-if="activeTab === 'rekomendasi'" :isLoading="isLoading" :stats="stats" />

      <!-- TAB content -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'monitor'" key="monitor">
          <MonitorLayanan
            :services="rawServicesList"
            :isLoading="isLoading"
            :searchQuery="searchQuery"
            :selectedPlatform="selectedPlatform"
            :selectedPeriod="selectedPeriod"
            :rawOrders="rawOrders"
          />
        </div>

        <!-- TAB: Analitik -->
        <div v-else-if="activeTab === 'analitik'" key="analitik">
          <AnalitikPanel
            :rawOrders="rawOrders"
            :rawServicesList="rawServicesList"
            :isLoading="isLoading"
            :selectedPeriod="selectedPeriod"
          />
        </div>

        <!-- TAB: AI Rekomendasi -->
        <div v-else-if="activeTab === 'rekomendasi'" key="rekomendasi">
          <ServiceTable
            :services="filteredServices"
            :isLoading="isLoading"
            :lastUpdate="lastUpdate"
            :sortOptions="sortOptions"
            :selectedSort="selectedSort"
            :selectedPeriod="selectedPeriod"
            @update:selectedSort="selectedSort = $event"
          />
        </div>

        <!-- TAB: Top Performer -->
        <div v-else-if="activeTab === 'top'" key="top">
          <div class="card overflow-hidden">
            <div class="px-5 py-3.5 flex items-center gap-2" :style="{ borderBottom: '1px solid var(--border)' }">
              <Icon name="heroicons:trophy" class="w-4 h-4 text-amber-400" />
              <span class="text-[14px] font-bold text-slate-900 dark:text-white">{{ t('top.title') }}</span>
              <span class="text-[11px] text-slate-500 ml-1">{{ t('top.subtitle') }}</span>
            </div>
            <div v-if="isLoading" class="p-5 space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4">
                <div class="skeleton w-6 h-6 rounded-full flex-shrink-0"></div>
                <div class="skeleton w-5 h-5 flex-shrink-0"></div>
                <div class="flex-1 space-y-1.5"><div class="skeleton w-3/4 h-3"></div><div class="skeleton w-1/3 h-2.5"></div></div>
                <div class="skeleton w-10 h-5 flex-shrink-0"></div>
              </div>
            </div>
            <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.04]">
              <div v-for="(svc, i) in filteredTop" :key="svc.id"
                class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--row-hover)]">
                <div :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0',
                  i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-400' : i === 2 ? 'bg-orange-700/20 text-orange-500' : 'bg-white/5 text-slate-500'
                ]">{{ i + 1 }}</div>
                <Icon :name="svc.platformIcon" class="w-5 h-5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-slate-800 dark:text-slate-200 text-[13px] font-medium truncate">{{ svc.name }}</p>
                  <p class="text-slate-500 text-[11px]">ID: {{ svc.id }} · {{ svc.successRate }}% · {{ svc.orderCount.toLocaleString('id-ID') }} {{ t('label.orders') }}</p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <div class="text-right">
                    <p :class="['text-[15px] font-black', svc.aiScore >= 95 ? 'text-emerald-400' : 'text-violet-400']">{{ svc.aiScore }}</p>
                    <p class="text-slate-600 text-[10px]">{{ t('label.score') }}</p>
                  </div>
                  <a :href="`${panelUrl}?service=${svc.id}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-colors">{{ t('btn.buy') }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Trending -->
        <div v-else-if="activeTab === 'trending'" key="trending">
          <div class="card overflow-hidden">
            <div class="px-5 py-3.5 flex items-center gap-2" :style="{ borderBottom: '1px solid var(--border)' }">
              <Icon name="heroicons:arrow-trending-up" class="w-4 h-4 text-emerald-400" />
              <span class="text-[14px] font-bold text-slate-900 dark:text-white">{{ t('trending.title') }}</span>
              <span class="text-[11px] text-slate-500 ml-1">{{ t('trending.subtitle') }}</span>
            </div>
            <div v-if="isLoading" class="p-5 space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4">
                <div class="skeleton w-5 h-5 flex-shrink-0"></div>
                <div class="flex-1 space-y-1.5"><div class="skeleton w-3/4 h-3"></div><div class="skeleton w-1/4 h-2.5"></div></div>
                <div class="skeleton w-14 h-5 flex-shrink-0"></div>
              </div>
            </div>
            <div v-else-if="filteredTrending.length === 0" class="px-5 py-10 text-center">
              <p class="text-slate-500 text-[13px]">{{ t('trending.empty') }}</p>
            </div>
            <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.04]">
              <div v-for="svc in filteredTrending" :key="svc.id"
                class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--row-hover)]">
                <Icon :name="svc.platformIcon" class="w-5 h-5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-slate-800 dark:text-slate-200 text-[13px] font-medium truncate">{{ svc.name }}</p>
                  <p class="text-slate-500 text-[11px]">ID: {{ svc.id }} · {{ svc.orderCount.toLocaleString('id-ID') }} {{ t('label.orders') }}</p>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <div class="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                    <Icon name="heroicons:arrow-trending-up" class="w-3.5 h-3.5 text-emerald-400" />
                    <span class="text-emerald-400 text-[12px] font-bold">+{{ svc.trendPercent }}%</span>
                  </div>
                  <a :href="`${panelUrl}?service=${svc.id}`" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-colors">{{ t('btn.buy') }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Risiko -->
        <div v-else-if="activeTab === 'risk'" key="risk">
          <div class="card overflow-hidden">
            <div class="px-5 py-3.5 flex items-center gap-2" :style="{ borderBottom: '1px solid var(--border)' }">
              <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 text-red-400" />
              <span class="text-[14px] font-bold text-slate-900 dark:text-white">{{ t('risk.title') }}</span>
              <span class="text-[11px] text-slate-500 ml-1">{{ t('risk.subtitle') }}</span>
            </div>
            <div v-if="isLoading" class="p-5 space-y-3">
              <div v-for="i in 4" :key="i" class="flex items-center gap-4">
                <div class="skeleton w-5 h-5 flex-shrink-0"></div>
                <div class="flex-1 space-y-1.5"><div class="skeleton w-2/3 h-3"></div><div class="skeleton w-1/3 h-2.5"></div></div>
              </div>
            </div>
            <div v-else-if="filteredRisky.length === 0" class="flex items-center gap-2.5 px-5 py-6">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span class="text-[13px] font-medium text-emerald-400">{{ t('risk.empty') }}</span>
            </div>
            <div v-else class="divide-y divide-slate-100 dark:divide-white/[0.04]">
              <div v-for="svc in filteredRisky" :key="svc.id"
                class="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--row-hover)]">
                <Icon :name="svc.platformIcon" class="w-5 h-5 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-slate-800 dark:text-slate-200 text-[13px] font-medium truncate">{{ svc.name }}</p>
                  <p class="text-slate-500 text-[11px]">ID: {{ svc.id }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-red-400 text-[11px] font-medium">Cancel {{ svc.cancelRate }}%</span>
                    <span class="text-slate-600">·</span>
                    <span class="text-amber-400 text-[11px] font-medium">SR {{ svc.successRate }}%</span>
                  </div>
                </div>
                <a :href="`${panelUrl}?service=${svc.id}`" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-500/40 text-white text-[11px] font-semibold transition-colors flex-shrink-0">{{ t('btn.buy') }}</a>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Insight -->
        <div v-else-if="activeTab === 'insight'" key="insight">
          <div class="card p-6 max-w-2xl">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Icon name="heroicons:sparkles" class="w-4 h-4 text-indigo-400" />
              </div>
              <span class="text-[14px] font-bold text-slate-900 dark:text-white">{{ t('insight.title') }}</span>
              <span v-if="aiInsightLoading" class="flex items-center gap-1 text-[11px] text-violet-400 ml-1">
                <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block"></span>
                {{ t('insight.updating') }}
              </span>
            </div>
            <div v-if="isLoading || (!aiInsight && aiInsightLoading)" class="space-y-2">
              <div class="skeleton w-full h-3"></div><div class="skeleton w-5/6 h-3"></div>
              <div class="skeleton w-4/6 h-3"></div><div class="skeleton w-5/6 h-3"></div>
            </div>
            <p v-else class="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{{ aiInsight }}</p>
            <div class="mt-5 pt-4 grid grid-cols-2 gap-3" :style="{ borderTop: '1px solid var(--border)' }">
              <div class="rounded-xl p-3.5 text-center" :style="{ background: 'var(--bg-subtle)' }">
                <p class="text-indigo-300 font-black text-[22px]">{{ topPerformers[0]?.aiScore ?? '—' }}</p>
                <p class="text-slate-500 text-[11px] mt-0.5">{{ t('insight.topScore') }}</p>
              </div>
              <div class="rounded-xl p-3.5 text-center" :style="{ background: 'var(--bg-subtle)' }">
                <p class="text-emerald-300 font-black text-[22px]">{{ trendingServices[0] ? '+' + trendingServices[0].trendPercent + '%' : '—' }}</p>
                <p class="text-slate-500 text-[11px] mt-0.5">{{ t('insight.topTrend') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else key="fallback"></div>
      </Transition>

      <!-- Footer -->
      <div class="mt-5 pb-5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-700 pt-3" :style="{ borderTop: '1px solid var(--border-sub)' }">
        <span>{{ appCfg.appName }} · {{ t('footer.dashboard') }}</span>
        <span v-if="!isLoading">{{ t('footer.lastUpdate') }}: <span class="text-indigo-500/70">{{ lastUpdate }} WIB</span></span>
      </div>
    </main>

    <!-- Scroll to top -->
    <Transition name="scroll-top">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500/40 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white backdrop-blur-sm transition-colors duration-200"
        aria-label="Scroll to top"
      >
        <Icon name="heroicons:chevron-up" class="w-4 h-4" />
      </button>
    </Transition>

    <!-- Floating comparison bar -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <Transition name="slide-up">
        <div
          v-if="comparisonCount > 0"
          class="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-2xl shadow-2xl shadow-black/30"
          :style="{ background: 'var(--bg-card)', border: '1px solid var(--border)' }"
        >
          <Icon name="heroicons:arrows-right-left" class="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span class="text-[12px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            {{ t('compare.selected', { n: comparisonCount }) }}
          </span>
          <button
            class="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[12px] font-semibold whitespace-nowrap shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            :disabled="comparisonCount < 2"
            @click="showComparison = true"
          >
            {{ t('compare.btn') }}
          </button>
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
            :style="{ background: 'var(--bg-input)', border: '1px solid var(--border)' }"
            @click="clearComparison"
          >
            <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
          </button>
        </div>
      </Transition>
    </div>

    <!-- Comparison Modal -->
    <KomparasiModal
      v-if="showComparison"
      :allServices="rawServicesList"
      :ids="comparisonIds"
      :rawOrders="rawOrders"
      @close="showComparison = false"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useLang()
const { public: appCfg } = useRuntimeConfig()
useHead({
  title: appCfg.appMetaTitle,
  meta: [{ name: 'description', content: appCfg.appMetaDesc }]
})

const {
  isLoading, fromCache, apiError, resync,
  selectedPlatform, selectedPeriod, selectedSort,
  searchQuery, platforms, periods, sortOptions, filteredServices,
  rawOrders, rawServicesList, services,
  stats, topPerformers, riskyServices, trendingServices,
  aiInsight, aiInsightLoading, lastUpdate
} = useServices()

const sidebarPlatform = ref('Semua')

const sidebarFiltered = computed(() =>
  sidebarPlatform.value === 'Semua'
    ? services.value
    : services.value.filter(s => s.platform === sidebarPlatform.value)
)

const filteredTop = computed(() =>
  [...sidebarFiltered.value].sort((a, b) => b.aiScore - a.aiScore).slice(0, 10)
)

const filteredTrending = computed(() =>
  [...sidebarFiltered.value]
    .filter(s => s.trend === 'up' && s.trendPercent > 8)
    .sort((a, b) => b.trendPercent - a.trendPercent)
    .slice(0, 10)
)

const filteredRisky = computed(() =>
  sidebarFiltered.value
    .filter(s => s.cancelRate > 2 || s.successRate < 95)
    .sort((a, b) => b.cancelRate - a.cancelRate)
    .slice(0, 10)
)

const panelUrl = useRuntimeConfig().public.panelUrl
const activeTab = ref('monitor')
const isSidebarTab = computed(() => ['top', 'trending', 'risk'].includes(activeTab.value))

const { ids: comparisonIds, clear: clearComparison, count: comparisonCount } = useComparison()
const showComparison = ref(false)

const showScrollTop = ref(false)

onMounted(() => {
  const onScroll = () => { showScrollTop.value = window.scrollY > 300 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const mainTabs = computed(() => [
  { key: 'monitor',     icon: 'heroicons:signal',               label: t('tab.monitor') },
  { key: 'rekomendasi', icon: 'heroicons:cpu-chip',             label: t('tab.rekomendasi') },
  { key: 'top',         icon: 'heroicons:trophy',               label: t('tab.top') },
  { key: 'trending',    icon: 'heroicons:arrow-trending-up',    label: t('tab.trending') },
  { key: 'risk',        icon: 'heroicons:exclamation-triangle', label: t('tab.risk') },
  { key: 'analitik',    icon: 'heroicons:chart-bar',            label: t('tab.analitik') },
])
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
